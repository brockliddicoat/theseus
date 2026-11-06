"""L2 renders: (1) the top shell from below, inside, shaded with shadows; (2) from above, the skin translucent: the outer
skin shaded and darkened by the plastic behind it (ribs, node fillets, crease rib, rails), a frosted-shell look.
True greys only. Same camera, box, scale and lights for both patterns.

python3 render.py <key> <view> <px_per_mm> <ss> [elev azim]   -> out/r_<key>_<view>.npz (rgb, alpha)"""
import sys, time, json
import numpy as np, cv2
sys.path.insert(0, '/home/claude/work/l2/scripts')
import rast

OUT = '/home/claude/work/l2/out'
MAT = dict(skin_out=0, skin_in=1, skin_edge=2, rib=3, node=4, crease=5, rail=6, ledge=7, button=8)
STRUCT = (3, 4, 5, 6)


def load(key):
    d = np.load('%s/geo_%s.npz' % (OUT, key))
    return d['V'], d['F'], d['N'].astype(np.float64), d['M']


def scene_box(V, cam, pad=3.0, sel=None):
    r, u, d = cam
    P = V if sel is None else V[sel]
    X, Y = P @ r, P @ u
    return (X.min() - pad, Y.min() - pad, X.max() + pad, Y.max() + pad)


def shade_pass(V, F, N, M, cam, s, box, faces, lights, shadow=None, albedo=None, ao=0.0, spec=0.10):
    r, u, d = cam
    x0, y0, x1, y1 = box
    W, H = int(round((x1 - x0) * s)), int(round((y1 - y0) * s))
    xy, z = rast.project(V, cam, s, box)
    zb, fid, b1, b2 = rast.rasterize(xy, z, F, W, H, faces=faces)
    m = fid >= 0
    n = rast.interp(N, F, fid, b1, b2); n /= np.maximum(np.linalg.norm(n, axis=1, keepdims=True), 1e-9)
    flip = n @ d < 0; n[flip] *= -1
    P = rast.interp(V, F, fid, b1, b2)
    mat = M[fid[m]]
    alb = np.full(m.sum(), 0.86) if albedo is None else albedo[mat]
    sh = np.ones(m.sum())
    if shadow is not None: sh = shadow(P, n)
    col = np.zeros(m.sum())
    for k, (L, w, kind) in enumerate(lights):
        L = np.asarray(L, float); L /= np.linalg.norm(L)
        ndl = np.clip(n @ L, 0, 1)
        col += w * ndl * (sh if kind == 'key' else 1.0)
        if kind == 'key' and spec > 0:
            hv = L + d; hv /= np.linalg.norm(hv)
            col += spec * np.clip(n @ hv, 0, 1) ** 40 * sh
    col += 0.16                                    # ambient
    img = np.zeros(H * W); img[m] = alb * col
    if ao > 0:
        zz = np.where(m, zb, 0).reshape(H, W); mm = m.reshape(H, W).astype(np.float32)
        zbl = rast.masked_blur(zz, mm, sigma=1.1 * s)
        dz = np.clip(zbl - zz, 0, 3.0)             # how far this pixel sits behind its neighbourhood (mm)
        img = img.reshape(H, W) * (1 - ao * (1 - np.exp(-dz / 0.9))); img = img.ravel()
    return img.reshape(H, W), m.reshape(H, W), fid.reshape(H, W), zb.reshape(H, W), P, n


def shadow_fn(V, F, faces, Lkey, s, bias=0.06, up=(0, 0, 1.0)):
    camL = rast.cam_from(Lkey, up)
    boxL = scene_box(V[np.unique(F[faces])], camL, pad=1.0)
    x0, y0, x1, y1 = boxL
    W, H = int(round((x1 - x0) * s)), int(round((y1 - y0) * s))
    xy, z = rast.project(V, camL, s, boxL)
    zb, fid, _, _ = rast.rasterize(xy, z, F, W, H, faces=faces)
    zb = zb.reshape(H, W)
    def f(P, n):
        q, zp = rast.project(P, camL, s, boxL)
        lit = np.zeros(len(P))
        cnt = 0
        for dx in (-1, 0, 1):
            for dy in (-1, 0, 1):
                ix = np.clip(np.floor(q[:, 0]).astype(int) + dx, 0, W - 1); iy = np.clip(np.floor(q[:, 1]).astype(int) + dy, 0, H - 1)
                zl = zb[iy, ix]
                lit += (zl <= zp + bias + 0.5 / s) | ~np.isfinite(zl) | (zl > zp + 2.5)   # contact shadows only (occluder within 2.5 mm)
                cnt += 1
        return 0.42 + 0.58 * lit / cnt
    return f


def render_inside(key, s, ss, elev, azim, box=None, cut=None):
    V, F, N, M = load(key)
    if cut is not None:
        keep = V[F].mean(1)[:, 0] < cut
        F, N, M = F[keep], N[keep], M[keep]
    d = rast.view_dir(elev, azim, below=True)
    cam = rast.cam_from(d, (0, 0, 1.0))
    r, u, _ = cam
    shell = np.where(M != MAT['button'])[0]
    if box is None: box = scene_box(V[np.unique(F[shell])], cam, pad=2.0)
    S = s * ss
    Lkey = 0.85 * d + 0.42 * u - 0.36 * r            # from the upper left of the picture, toward the viewer
    Lfill = 0.8 * d - 0.35 * u + 0.45 * r
    shf = shadow_fn(V, F, np.where(np.isin(M, STRUCT))[0], Lkey, S)
    alb = np.full(9, 0.86); alb[MAT['button']] = 1.0
    img, m, fid, zb, P, n = shade_pass(V, F, N, M, cam, S, box, None, [(Lkey, 0.62, 'key'), (Lfill, 0.22, 'fill')],
                                        shadow=shf, albedo=alb, ao=0.32)
    return finish(img, m, ss), box


def render_top(key, s, ss, box=None, kappa=1.15, beta=0.55):
    V, F, N, M = load(key)
    d = np.array([0, 1.0, 0]); cam = rast.cam_from(d, (0, 0, 1.0))
    r, u, _ = cam
    shellfaces = np.where(~np.isin(M, STRUCT))[0]
    if box is None: box = scene_box(V[np.unique(F[shellfaces])], cam, pad=2.0)
    S = s * ss
    Lkey = 0.75 * d + 0.45 * u - 0.45 * r
    Lfill = 0.9 * d - 0.3 * u + 0.4 * r
    img, m, fid, zb, P, n = shade_pass(V, F, N, M, cam, S, box, shellfaces, [(Lkey, 0.58, 'key'), (Lfill, 0.22, 'fill')], ao=0.0, spec=0.06)
    # the plastic behind the skin: nearest entry (front faces) to nearest exit (back faces) of the structure
    st = np.where(np.isin(M, STRUCT))[0]
    fn = np.cross(V[F[st, 1]] - V[F[st, 0]], V[F[st, 2]] - V[F[st, 0]])
    front = st[fn @ d > 0]; back = st[fn @ d < 0]
    x0, y0, x1, y1 = box; W, H = img.shape[1], img.shape[0]
    xy, z = rast.project(V, cam, S, box)
    zf, ff, _, _ = rast.rasterize(xy, z, F, W, H, faces=front)
    zk, fk, _, _ = rast.rasterize(xy, z, F, W, H, faces=back)
    thk = np.where((ff >= 0) & (fk >= 0), np.clip(zf - zk, 0, 3.0), 0.0).reshape(H, W)
    matpix = np.where(m, M[np.maximum(fid, 0)], -1)
    body = np.isin(matpix, (MAT['skin_out'], MAT['skin_edge'], MAT['skin_in'], MAT['ledge']))
    T = np.exp(-kappa * thk)
    img = np.where(body, img * (1 - beta * (1 - T)), img)
    alb_button = 1.0
    return finish(img, m, ss), box, thk


def finish(img, m, ss):
    a = rast.downsample(m.astype(np.float32), ss)
    c = rast.downsample(np.where(m, img, 0).astype(np.float32), ss)
    c = np.where(a > 1e-4, c / np.maximum(a, 1e-4), 0)
    return np.clip(c, 0, 1), a


if __name__ == '__main__':
    key, view, s, ss = sys.argv[1], sys.argv[2], float(sys.argv[3]), int(sys.argv[4])
    t0 = time.time()
    tag = sys.argv[5] if len(sys.argv) > 5 else ''
    if view == 'inside':
        elev, azim = float(sys.argv[6]), float(sys.argv[7])
        box = tuple(map(float, sys.argv[8].split(','))) if len(sys.argv) > 8 and sys.argv[8] != '-' else None
        cut = float(sys.argv[9]) if len(sys.argv) > 9 else None
        (c, a), box = render_inside(key, s, ss, elev, azim, box, cut)
    else:
        box = tuple(map(float, sys.argv[6].split(','))) if len(sys.argv) > 6 else None
        (c, a), box, thk = render_top(key, s, ss, box)
    fn = '%s/r_%s_%s%s' % (OUT, key, view, tag)
    np.savez_compressed(fn + '.npz', c=c.astype(np.float32), a=a.astype(np.float32), box=np.array(box), s=s)
    paper = 0.96
    rgb = (np.clip(c * a + paper * (1 - a), 0, 1) * 255).astype(np.uint8)
    cv2.imwrite(fn + '.png', rgb)
    print(fn, rgb.shape, 'box', np.round(box, 2), '%.1fs' % (time.time() - t0), flush=True)
