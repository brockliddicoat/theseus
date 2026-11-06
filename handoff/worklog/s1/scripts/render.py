"""Quick orthographic shaded renders of the shell GLB meshes (painter's algorithm with OpenCV), for looking at the shape:
creases, seams, the wheel opening. Scene frame: X = user's left, Y up, Z nose.

    python3 render.py <glb> <out.png> <view> [px_per_mm] [nodes,comma]   view: top | left | right | front | back | 34 | bottom
"""
import sys, os
import numpy as np, cv2
sys.path.insert(0, '/home/claude/theseus/3d/shell/tools')
import glbio

VIEWS = {
    # (right vector, up vector, view direction toward the viewer) in scene coords; screen x = P.right, screen y = P.up
    'top':    (np.array([-1., 0, 0]), np.array([0, 0, 1.]), np.array([0, 1., 0])),     # nose up, user's left on the left
    'bottom': (np.array([1., 0, 0]), np.array([0, 0, 1.]), np.array([0, -1., 0])),     # nose up, seen from below
    'left':   (np.array([0, 0, -1.]), np.array([0, 1., 0]), np.array([1., 0, 0])),     # from the user's left (+X), nose left
    'right':  (np.array([0, 0, 1.]), np.array([0, 1., 0]), np.array([-1., 0, 0])),     # from the user's right, nose right
    'front':  (np.array([1., 0, 0]), np.array([0, 1., 0]), np.array([0, 0, 1.])),      # facing the nose: user's left on the viewer's right... (x = +X to the right)
    'back':   (np.array([-1., 0, 0]), np.array([0, 1., 0]), np.array([0, 0, -1.])),
}


def view34(az=-35, el=28):
    a, e = np.radians(az), np.radians(el)
    d = np.array([np.sin(a) * np.cos(e), np.sin(e), np.cos(a) * np.cos(e)])      # toward the viewer
    r = np.cross(np.array([0, 1., 0]), d); r /= np.linalg.norm(r)
    u = np.cross(d, r)
    return r, u, d


def load(fn, names=None):
    js, b = glbio.read(fn)
    out = []
    for n in js['nodes']:
        if 'mesh' not in n: continue
        if names and n.get('name') not in names: continue
        _, d = glbio.mesh_arrays(js, b, n['name'])
        P = d['POSITION'].astype(float); N = d['NORMAL'].astype(float); T = d['indices'].reshape(-1, 3)
        C = d.get('COLOR_0'); C = C[:, :3].astype(float) if C is not None else np.ones_like(P)
        out.append((n['name'], P, N, C, T))
    return out


def render(meshes, view, s=8.0, pad=4, light=None, bg=(245, 245, 247), tint=None, box=None):
    if isinstance(view, str) and view in VIEWS: r, u, d = VIEWS[view]
    elif isinstance(view, str) and view.startswith('34'): r, u, d = view34(*[float(v) for v in view[2:].split(':')]) if ':' in view else view34()
    else: r, u, d = view
    allP = np.vstack([m[1] for m in meshes])
    X = allP @ r; Y = allP @ u
    if box is None: box = (X.min() - pad, Y.min() - pad, X.max() + pad, Y.max() + pad)
    x0, y0, x1, y1 = box
    W, H = int((x1 - x0) * s), int((y1 - y0) * s)
    img = np.zeros((H, W, 3), np.float32); img[:] = np.array(bg, np.float32) / 255
    L = light if light is not None else (0.45 * d + 0.55 * u + 0.35 * r)
    L = L / np.linalg.norm(L)
    tris, cols, depth = [], [], []
    for name, P, N, C, T in meshes:
        A, B, Cc = P[T[:, 0]], P[T[:, 1]], P[T[:, 2]]
        n = N[T].mean(1); n /= np.maximum(np.linalg.norm(n, axis=1, keepdims=True), 1e-9)
        face = np.cross(B - A, Cc - A)
        vis = (face @ d) > -1e-9
        lam = np.clip(n @ L, 0, 1)
        hv = (L + d); hv /= np.linalg.norm(hv)
        spec = np.clip(n @ hv, 0, 1) ** 40
        occ = C[T].mean(1).mean(1)          # the seam occlusion baked in COLOR_0
        base = 0.62 if tint is None else tint.get(name, 0.62)
        val = (0.18 + 0.62 * lam) * base + 0.25 * spec
        val = val * (0.35 + 0.65 * occ)
        q = np.stack([(A @ r - x0) * s, (y1 - A @ u) * s, (B @ r - x0) * s, (y1 - B @ u) * s, (Cc @ r - x0) * s, (y1 - Cc @ u) * s], 1)
        tris.append(q[vis]); cols.append(val[vis]); depth.append(((A + B + Cc) / 3 @ d)[vis])
    tris = np.vstack(tris); cols = np.concatenate(cols); depth = np.concatenate(depth)
    order = np.argsort(depth)
    sh = 4
    q = np.round(tris * (1 << sh)).astype(np.int32).reshape(-1, 3, 2)
    for i in order:
        c = float(cols[i]); cv2.fillConvexPoly(img, q[i], (c, c, c), lineType=cv2.LINE_AA, shift=sh)
    return (np.clip(img, 0, 1) * 255).astype(np.uint8), box


if __name__ == '__main__':
    fn, out, view = sys.argv[1], sys.argv[2], sys.argv[3]
    s = float(sys.argv[4]) if len(sys.argv) > 4 else 8.0
    names = sys.argv[5].split(',') if len(sys.argv) > 5 and sys.argv[5] else None
    M = load(fn, names)
    img, box = render(M, view, s)
    cv2.imwrite(out, img[:, :, ::-1])
    print(out, img.shape, 'box', [round(v, 2) for v in box])
