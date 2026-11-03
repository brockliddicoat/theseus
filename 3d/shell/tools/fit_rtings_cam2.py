import sys, json, itertools
import numpy as np, cv2
from scipy.optimize import minimize
sys.path.insert(0, '/home/claude/theseus/3d/shell/tools')
from raster import persp_cam, render, shade, _basis
from fit_rtings_cam import PM, H0, W0, iou
from PIL import Image

def cam_from(q):
    # q = az, el, roll, fov, dist, su, sv  (su,sv: target shift in mm along camera right/up), base target (0,14,0)
    az, el, roll, fov, dist, su, sv = q
    a, e, rl = np.radians(az), np.radians(el), np.radians(roll)
    d = np.array([np.sin(a)*np.cos(e), np.sin(e), np.cos(a)*np.cos(e)])
    t0 = np.array([0, 14.0, 0])
    r, u, f = _basis(-d, (0, 1, 0))
    t = t0 + su * r + sv * u
    eye = t + dist * d
    up = np.cos(rl)*u + np.sin(rl)*r
    return persp_cam(eye, t, up, fov)

def sil(V, F, q, s):
    W, H = int(W0*s), int(H0*s)
    return render(V, F, cam_from(q), W, H)['mask']

if __name__ == '__main__':
    d = np.load(sys.argv[1]); out = sys.argv[2]
    V = d['vertices'].astype(float); F = d['faces'].astype(np.int64)
    s = 0.25
    pm = cv2.resize(PM.astype(np.uint8), (int(W0*s), int(H0*s)), interpolation=cv2.INTER_AREA) > 0
    yp, xp = np.nonzero(pm); A = pm.sum()
    best = []
    for az, el, roll in itertools.product(range(5, 90, 8), range(15, 70, 7), range(-24, 25, 8)):
        q = [az, el, roll, 25, 300, 0, 0]
        m = sil(V, F, q, s)
        if m.sum() < 10: continue
        q[4] *= np.sqrt(m.sum()/A)
        m = sil(V, F, q, s)
        ys, xs = np.nonzero(m)
        dx, dy = xp.mean()-xs.mean(), yp.mean()-ys.mean()
        M = np.float32([[1,0,dx],[0,1,dy]])
        mm = cv2.warpAffine(m.astype(np.uint8), M, (m.shape[1], m.shape[0])) > 0
        sc = iou(mm, pm)
        # shift target: pixel -> mm at target distance
        fpx = (H0*s/2)/np.tan(np.radians(q[3])/2)
        q[5] = -dx*q[4]/fpx; q[6] = dy*q[4]/fpx
        best.append((sc, q))
    best.sort(key=lambda x: -x[0])
    print('top grid:', [(round(b[0],4), [round(v,1) for v in b[1]]) for b in best[:5]])
    results = []
    for sc, q0 in best[:4]:
        cost = lambda q: -iou(sil(V, F, q, 0.5), cv2.resize(PM.astype(np.uint8), (W0//2, H0//2), interpolation=cv2.INTER_AREA) > 0)
        simplex = np.array([q0] + [np.array(q0) + np.eye(7)[i]*st for i, st in enumerate([4, 4, 3, 3, 15, 3, 3])])
        r = minimize(cost, q0, method='Nelder-Mead', options=dict(maxiter=1200, xatol=1e-3, fatol=1e-6, initial_simplex=simplex))
        results.append((-r.fun, r.x))
        print('refined', round(-r.fun, 4), np.round(r.x, 2))
    results.sort(key=lambda x: -x[0])
    q = results[0][1]
    r2 = minimize(lambda q: -iou(sil(V, F, q, 1.0), PM), q, method='Nelder-Mead', options=dict(maxiter=600, xatol=1e-3, fatol=1e-6))
    q = r2.x; sc = -r2.fun
    cam = cam_from(q)
    m = sil(V, F, q, 1.0)
    ov = np.zeros((H0, W0, 3), np.uint8); ov[:] = 245
    ov[m & ~PM] = (220,60,60); ov[PM & ~m] = (60,110,230); ov[m & PM] = (120,120,120)
    Image.fromarray(ov).save(out + '_overlay.png')
    img, _ = shade(V, F, cam, W0, H0, base=(0.6,0.61,0.64), spec=0.4)
    Image.fromarray(img).save(out + '_render.png')
    tgt = cam['eye'] + cam['f']*q[4]
    res = dict(q=[float(x) for x in q], iou=float(sc), eye=cam['eye'].tolist(), target=tgt.tolist(), up=cam['u'].tolist(), fov=float(q[3]),
               note='perspective camera fitted to sora-v2-three-quarter-rtings.jpg (1000x563); fov is vertical, degrees; aspect 1000/563')
    json.dump(res, open(out + '.json', 'w'), indent=1)
    print(json.dumps(res, indent=1))
