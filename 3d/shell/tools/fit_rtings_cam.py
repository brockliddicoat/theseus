"""Fit a perspective camera to the RTINGS 3/4 photo silhouette (IoU), using a mesh (npz with vertices/faces).
Usage: python3 fit_rtings_cam.py mesh.npz out_prefix [cam.json to reuse]
Camera params: target (tx,ty,tz), azimuth (deg, around +Y, 0 = camera on +Z), elevation (deg), distance (mm), fov (deg), roll (deg).
"""
import sys, json
import numpy as np, cv2
from scipy.optimize import minimize
sys.path.insert(0, '/home/claude/theseus/3d/shell/tools')
from raster import persp_cam, render, shade, _basis
from PIL import Image

REF = '/home/claude/theseus/3d/shell/work/refs/'
PM = np.asarray(Image.open(REF + 'mask_sora-v2-three-quarter-rtings.png')) > 127   # 563 x 1000
H0, W0 = PM.shape


def cam_from(p):
    tx, ty, tz, az, el, dist, fov, roll = p
    az, el, rl = np.radians(az), np.radians(el), np.radians(roll)
    d = np.array([np.sin(az) * np.cos(el), np.sin(el), np.cos(az) * np.cos(el)])
    eye = np.array([tx, ty, tz]) + dist * d
    f = -d
    up0 = np.array([0, 1.0, 0])
    r, u, f = _basis(f, up0)
    up = np.cos(rl) * u + np.sin(rl) * r
    return persp_cam(eye, eye + f, up, fov)


def sil(V, F, p, scale=0.5):
    W, H = int(W0 * scale), int(H0 * scale)
    R = render(V, F, cam_from(p), W, H)
    return R['mask']


def iou(a, b):
    return np.logical_and(a, b).sum() / max(np.logical_or(a, b).sum(), 1)


def fit(V, F, p0=None):
    pm_s = cv2.resize(PM.astype(np.uint8), (W0 // 2, H0 // 2), interpolation=cv2.INTER_AREA) > 0
    if p0 is None:
        best = None
        for az in range(20, 80, 6):
            for el in range(20, 60, 6):
                p = [0, 12, 0, az, el, 330, 22, 0]
                # scale distance so that silhouette area matches
                m = sil(V, F, p)
                if m.sum() == 0:
                    continue
                p[5] *= np.sqrt(m.sum() / pm_s.sum())
                m = sil(V, F, p)
                # align centroid by moving target in screen plane is costly; use iou of centroid-aligned masks
                ys, xs = np.nonzero(m); yp, xp = np.nonzero(pm_s)
                M = np.float32([[1, 0, xp.mean() - xs.mean()], [0, 1, yp.mean() - ys.mean()]])
                mm = cv2.warpAffine(m.astype(np.uint8), M, (m.shape[1], m.shape[0])) > 0
                s = iou(mm, pm_s)
                if best is None or s > best[0]:
                    best = (s, p, (xp.mean() - xs.mean(), yp.mean() - ys.mean()))
        print('grid best', best)
        p0 = best[1]
        # convert pixel offset to target shift: approximate using camera basis
        cam = cam_from(p0)
        f_px = (H0 / 4) / np.tan(np.radians(p0[6]) / 2)
        dx, dy = best[2]
        shift = (-dx * cam['r'] + dy * cam['u']) * p0[5] / f_px * -1
        p0[0] += shift[0]; p0[1] += shift[1]; p0[2] += shift[2]

    def cost(p):
        return -iou(sil(V, F, p), pm_s)
    r = minimize(cost, p0, method='Nelder-Mead', options=dict(maxiter=900, xatol=1e-3, fatol=1e-6))
    p = r.x
    r2 = minimize(lambda q: -iou(sil(V, F, q, 1.0), PM), p, method='Nelder-Mead', options=dict(maxiter=500, xatol=1e-3, fatol=1e-6))
    return r2.x, -r2.fun


if __name__ == '__main__':
    d = np.load(sys.argv[1]); out = sys.argv[2]
    V = d['vertices'].astype(float); F = d['faces'].astype(np.int64)
    p0 = None
    if len(sys.argv) > 3:
        p0 = json.load(open(sys.argv[3]))['params']
    p, s = fit(V, F, p0)
    cam = cam_from(p)
    m = sil(V, F, p, 1.0)
    ov = np.zeros((H0, W0, 3), np.uint8); ov[:] = 245
    ov[m & ~PM] = (220, 60, 60); ov[PM & ~m] = (60, 110, 230); ov[m & PM] = (120, 120, 120)
    Image.fromarray(ov).save(out + '_overlay.png')
    img, _ = shade(V, F, cam, W0, H0, base=(0.6, 0.61, 0.64), spec=0.4)
    Image.fromarray(img).save(out + '_render.png')
    res = dict(params=[float(x) for x in p], iou=float(s), eye=cam['eye'].tolist(),
               target=(cam['eye'] + cam['f'] * p[5]).tolist(), up=cam['u'].tolist(), fov=float(p[6]),
               note='perspective camera fitted to sora-v2-three-quarter-rtings.jpg (1000x563), vertical fov in degrees')
    json.dump(res, open(out + '.json', 'w'), indent=1)
    print(json.dumps(res, indent=1))
