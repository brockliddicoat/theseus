import numpy as np, cv2
from scipy.optimize import minimize
# copied from 3d/shell/tools/silhouette.py (fit_photo, _iou) without the numba rasteriser import
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


