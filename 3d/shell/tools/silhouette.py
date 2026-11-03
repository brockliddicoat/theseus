"""Silhouette agreement between a mesh and the reference photos.

top  : ortho, camera above, nose at image top  (photo: sora-v2-top.webp)
side : ortho, camera on +X (side-button side), nose at image left (photo: sora-v2-side.webp)
3/4  : perspective camera fitted to sora-v2-three-quarter-rtings.jpg

compare_ortho(V, F, view) -> dict(iou, prof_rms_mm, prof_max_mm, overlay)
"""
import sys, json
import numpy as np, cv2
from scipy.optimize import minimize
sys.path.insert(0, '/home/claude/theseus/3d/shell/tools')
from raster import ortho_cam, persp_cam, render, shade
from PIL import Image

REF = '/home/claude/theseus/3d/shell/work/refs/'
PX_PER_MM = 6.0


def mesh_mask(V, F, view, pxmm=PX_PER_MM):
    if view == 'top':
        cam = ortho_cam((0, -1, 0), (0, 0, 1), (0, 19, 0), 70)
        W, H = int(80 * pxmm), int(140 * pxmm)
    else:
        cam = ortho_cam((-1, 0, 0), (0, 1, 0), (0, 22, 0), 30)
        W, H = int(140 * pxmm), int(60 * pxmm)
    # pixel scale: H/2 / half_h
    cam['half_h'] = (H / 2) / pxmm
    R = render(V, F, cam, W, H)
    from scipy.ndimage import binary_fill_holes, binary_closing
    m = binary_fill_holes(binary_closing(R['mask'], iterations=2))
    return m, cam, (W, H)


def _iou(a, b):
    i = np.logical_and(a, b).sum(); u = np.logical_or(a, b).sum()
    return i / max(u, 1)


def fit_photo(photo_mask, target_mask, rot=True):
    """Similarity transform (scale, rotation, translation) photo -> target frame maximizing IoU."""
    H, W = target_mask.shape
    ys, xs = np.nonzero(photo_mask); yt, xt = np.nonzero(target_mask)
    # initial: match bounding boxes (use the longer extent for scale)
    pw, ph = np.ptp(xs) + 1, np.ptp(ys) + 1; tw, th = np.ptp(xt) + 1, np.ptp(yt) + 1
    s0 = (tw / pw + th / ph) / 2
    pc = np.array([(xs.min() + xs.max()) / 2, (ys.min() + ys.max()) / 2])
    tc = np.array([(xt.min() + xt.max()) / 2, (yt.min() + yt.max()) / 2])
    pm = photo_mask.astype(np.uint8)

    def warp(p):
        ls, tx, ty, th_ = p
        s = s0 * np.exp(ls)
        c, sn = np.cos(th_), np.sin(th_)
        A = np.array([[s * c, -s * sn], [s * sn, s * c]])
        t = tc + np.array([tx, ty]) - A @ pc
        M = np.hstack([A, t[:, None]])
        return cv2.warpAffine(pm, M, (W, H), flags=cv2.INTER_LINEAR) > 0, M

    def cost(p):
        if not rot:
            p = [p[0], p[1], p[2], 0.0]
        w, _ = warp(p)
        return -_iou(w, target_mask)

    x0 = [0, 0, 0, 0] if rot else [0, 0, 0]
    best = None
    for init in ([0, 0, 0, 0], [0.01, 2, 0, 0], [-0.01, -2, 0, 0]):
        x = init if rot else init[:3]
        r = minimize(cost, x, method='Nelder-Mead', options=dict(xatol=1e-4, fatol=1e-5, maxiter=600,
                     initial_simplex=None))
        if best is None or r.fun < best.fun:
            best = r
    p = list(best.x) if rot else list(best.x) + [0.0]
    w, M = warp(p)
    return w, M, -best.fun, p


def profiles(mask, axis):
    """axis='rows': width per row; 'cols': top-edge per column (height above lowest)."""
    if axis == 'rows':
        rows = np.nonzero(mask.any(1))[0]
        wid = np.array([mask[r].sum() for r in range(mask.shape[0])], float)
        return wid
    else:
        H = mask.shape[0]
        top = np.full(mask.shape[1], np.nan)
        for c in range(mask.shape[1]):
            col = np.nonzero(mask[:, c])[0]
            if len(col):
                top[c] = H - col.min()
        return top


def compare_ortho(V, F, view, pxmm=PX_PER_MM):
    tm, cam, (W, H) = mesh_mask(V, F, view, pxmm)
    pname = 'mask_sora-v2-top.png' if view == 'top' else 'mask_sora-v2-side.png'
    pm = np.asarray(Image.open(REF + pname)) > 127
    w, M, iou, p = fit_photo(pm, tm, rot=True)
    if view == 'top':
        a, b = profiles(tm, 'rows'), profiles(w, 'rows')
        rows = np.nonzero(tm.any(1) | w.any(1))[0]
        rows = rows[3:-3]
        d = (a[rows] - b[rows]) / pxmm
    else:
        a, b = profiles(tm, 'cols'), profiles(w, 'cols')
        cols = np.nonzero(tm.any(0) & w.any(0))[0][3:-3]
        d = (a[cols] - b[cols]) / pxmm
    # signed-distance-ish contour error: distance from each photo contour pixel to mesh contour
    ct, _ = cv2.findContours(tm.astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    cp, _ = cv2.findContours(w.astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    ct = max(ct, key=len)[:, 0, :]; cp = max(cp, key=len)[:, 0, :]
    from scipy.spatial import cKDTree
    dd = cKDTree(ct).query(cp)[0] / pxmm
    ov = np.zeros((H, W, 3), np.uint8); ov[:] = 245
    ov[tm & ~w] = (220, 60, 60)      # mesh only: red
    ov[w & ~tm] = (60, 110, 230)     # photo only: blue
    ov[w & tm] = (120, 120, 120)
    return dict(iou=float(iou), prof_rms_mm=float(np.sqrt(np.nanmean(d ** 2))), prof_max_mm=float(np.nanmax(np.abs(d))),
                contour_rms_mm=float(np.sqrt((dd ** 2).mean())), contour_p95_mm=float(np.percentile(dd, 95)),
                scale_mm_per_photo_px=float(1 / (np.sqrt(abs(np.linalg.det(M[:, :2]))) * 1) / pxmm * 1),
                rot_deg=float(np.degrees(p[3])), overlay=ov)


if __name__ == '__main__':
    path = sys.argv[1]
    out = sys.argv[2] if len(sys.argv) > 2 else None
    d = np.load(path)
    V = d['vertices'].astype(float); F = d['faces'].astype(np.int64)
    res = {}
    for view in ('top', 'side'):
        r = compare_ortho(V, F, view)
        ov = r.pop('overlay')
        res[view] = r
        if out:
            Image.fromarray(ov).save(out + f'_{view}.png')
    print(json.dumps(res, indent=1))
