"""Tiny numba z-buffer rasterizer for inspecting meshes (no GPU needed).

render(V, F, cam, W, H) -> dict(depth, fid, bary, mask)
shade(...) -> uint8 RGB image with smooth or flat normals, headlight + key light, specular.
Cameras: ortho_cam(view_dir, up, center, half_h) or persp_cam(eye, target, up, fov_deg).
Coordinates: project into image with x right, y down.
"""
import numpy as np
from numba import njit


def _basis(fwd, up):
    f = np.asarray(fwd, float); f = f / np.linalg.norm(f)
    u = np.asarray(up, float)
    r = np.cross(f, u); r /= np.linalg.norm(r)
    u2 = np.cross(r, f)
    return r, u2, f


def ortho_cam(view_dir, up, center, half_h):
    """view_dir: direction FROM camera TO scene."""
    r, u, f = _basis(view_dir, up)
    return dict(kind='ortho', r=r, u=u, f=f, c=np.asarray(center, float), half_h=float(half_h))


def persp_cam(eye, target, up, fov_deg):
    eye = np.asarray(eye, float); target = np.asarray(target, float)
    r, u, f = _basis(target - eye, up)
    return dict(kind='persp', r=r, u=u, f=f, eye=eye, fov=float(fov_deg))


def project(V, cam, W, H):
    """Return screen coords (px, py, depth) with px right, py down."""
    if cam['kind'] == 'ortho':
        d = V - cam['c']
        x = d @ cam['r']; y = d @ cam['u']; z = d @ cam['f']
        s = (H / 2) / cam['half_h']
        px = W / 2 + x * s; py = H / 2 - y * s
        return np.stack([px, py, z], 1)
    d = V - cam['eye']
    x = d @ cam['r']; y = d @ cam['u']; z = d @ cam['f']
    t = np.tan(np.radians(cam['fov']) / 2)
    s = (H / 2) / t
    px = W / 2 + s * x / z; py = H / 2 - s * y / z
    return np.stack([px, py, z], 1)


@njit(cache=True)
def _raster(P, F, W, H, persp):
    depth = np.full((H, W), np.inf)
    fid = np.full((H, W), -1, np.int64)
    bary = np.zeros((H, W, 3))
    for t in range(F.shape[0]):
        a = F[t, 0]; b = F[t, 1]; c = F[t, 2]
        x0, y0, z0 = P[a, 0], P[a, 1], P[a, 2]
        x1, y1, z1 = P[b, 0], P[b, 1], P[b, 2]
        x2, y2, z2 = P[c, 0], P[c, 1], P[c, 2]
        if persp and (z0 <= 0 or z1 <= 0 or z2 <= 0):
            continue
        xmin = max(int(np.floor(min(x0, x1, x2))), 0)
        xmax = min(int(np.ceil(max(x0, x1, x2))), W - 1)
        ymin = max(int(np.floor(min(y0, y1, y2))), 0)
        ymax = min(int(np.ceil(max(y0, y1, y2))), H - 1)
        if xmin > xmax or ymin > ymax:
            continue
        area = (x1 - x0) * (y2 - y0) - (x2 - x0) * (y1 - y0)
        if abs(area) < 1e-12:
            continue
        for py in range(ymin, ymax + 1):
            fy = py + 0.5
            for px in range(xmin, xmax + 1):
                fx = px + 0.5
                w0 = ((x1 - fx) * (y2 - fy) - (x2 - fx) * (y1 - fy)) / area
                w1 = ((x2 - fx) * (y0 - fy) - (x0 - fx) * (y2 - fy)) / area
                w2 = 1.0 - w0 - w1
                if w0 < -1e-9 or w1 < -1e-9 or w2 < -1e-9:
                    continue
                if persp:
                    iz = w0 / z0 + w1 / z1 + w2 / z2
                    z = 1.0 / iz
                    b0 = w0 / z0 * z; b1 = w1 / z1 * z; b2 = w2 / z2 * z
                else:
                    z = w0 * z0 + w1 * z1 + w2 * z2
                    b0 = w0; b1 = w1; b2 = w2
                if z < depth[py, px]:
                    depth[py, px] = z
                    fid[py, px] = t
                    bary[py, px, 0] = b0; bary[py, px, 1] = b1; bary[py, px, 2] = b2
    return depth, fid, bary


def render(V, F, cam, W, H):
    P = project(np.asarray(V, float), cam, W, H)
    depth, fid, bary = _raster(P, np.asarray(F, np.int64), W, H, cam['kind'] == 'persp')
    return dict(depth=depth, fid=fid, bary=bary, mask=fid >= 0, P=P)


def vertex_normals(V, F):
    V = np.asarray(V, float)
    fn = np.cross(V[F[:, 1]] - V[F[:, 0]], V[F[:, 2]] - V[F[:, 0]])
    vn = np.zeros_like(V)
    for k in range(3):
        np.add.at(vn, F[:, k], fn)
    vn /= np.linalg.norm(vn, axis=1, keepdims=True) + 1e-12
    return vn, fn / (np.linalg.norm(fn, axis=1, keepdims=True) + 1e-12)


def shade(V, F, cam, W, H, smooth=True, base=(0.55, 0.56, 0.6), bg=(0.97, 0.965, 0.95),
          light=None, spec=0.35, shininess=40.0, vcolor=None, two_side=True, R=None, VN=None):
    V = np.asarray(V, float); F = np.asarray(F, np.int64)
    if R is None:
        R = render(V, F, cam, W, H)
    vn, fn = vertex_normals(V, F)
    if VN is not None:
        vn = np.asarray(VN, float)
    m = R['mask']; fid = R['fid']; b = R['bary']
    img = np.zeros((H, W, 3)); img[:] = bg
    ids = fid[m]
    if smooth:
        n = (vn[F[ids, 0]] * b[m][:, 0:1] + vn[F[ids, 1]] * b[m][:, 1:2] + vn[F[ids, 2]] * b[m][:, 2:3])
    else:
        n = fn[ids]
    n /= np.linalg.norm(n, axis=1, keepdims=True) + 1e-12
    # view vector (towards camera)
    if cam['kind'] == 'ortho':
        vv = -cam['f'][None, :].repeat(len(ids), 0)
    else:
        pts = (V[F[ids, 0]] * b[m][:, 0:1] + V[F[ids, 1]] * b[m][:, 1:2] + V[F[ids, 2]] * b[m][:, 2:3])
        vv = cam['eye'][None, :] - pts; vv /= np.linalg.norm(vv, axis=1, keepdims=True)
    if two_side:
        flip = (n * vv).sum(1) < 0
        n[flip] *= -1
    if light is None:
        light = -cam['f'] + 0.6 * cam['u'] - 0.5 * cam['r']
    L = np.asarray(light, float); L /= np.linalg.norm(L)
    ndl = np.clip(n @ L, 0, 1)
    hv = L[None, :] + vv; hv /= np.linalg.norm(hv, axis=1, keepdims=True)
    sp = np.clip((n * hv).sum(1), 0, 1) ** shininess
    ndv = np.clip((n * vv).sum(1), 0, 1)
    col = np.asarray(base)[None, :].repeat(len(ids), 0)
    if vcolor is not None:
        vc = np.asarray(vcolor, float)
        col = (vc[F[ids, 0]] * b[m][:, 0:1] + vc[F[ids, 1]] * b[m][:, 1:2] + vc[F[ids, 2]] * b[m][:, 2:3])
    c = col * (0.22 + 0.62 * ndl[:, None] + 0.16 * ndv[:, None]) + spec * sp[:, None]
    img[m] = np.clip(c, 0, 1)
    return (img * 255).astype(np.uint8), R
