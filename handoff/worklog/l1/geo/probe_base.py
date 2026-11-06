import numpy as np
d = np.load('chart.npz'); z, s, X, lab, S = d['z'], d['s'], d['X'], d['lab'], d['S']
fp = None
import json
meta = json.load(open('/home/claude/theseus/3d/shell/shell-theseus-1seam.json'))
fp = np.array(meta['footprint'])
for zq in [-50, -40, -30, -14, 0, 10, 20, 30, 40, 50]:
    i = int(round((zq - z[0]) / 0.25)); P = X[i]; m = np.isfinite(P[:, 0]); P = P[m]; ss = s[m]
    # footprint x at this z (outer outline of the base)
    k = np.argsort(np.abs(fp[:, 1] - zq))[:4]
    # curvature of the contour (2D: x, y) vs arc length
    x, y = P[:, 0], P[:, 1]
    def sm(a, n=4): 
        k_ = np.ones(2*n+1)/(2*n+1); return np.convolve(np.pad(a, n, mode='edge'), k_, 'valid')
    xs, ys = sm(x), sm(y)
    dx, dy = np.gradient(xs, ss), np.gradient(ys, ss); ddx, ddy = np.gradient(dx, ss), np.gradient(dy, ss)
    kap = (dx * ddy - dy * ddx) / np.maximum((dx*dx + dy*dy) ** 1.5, 1e-9)
    side = (y > 4) & (y < 16) & (x < -10)
    j = np.where(side)[0]
    jj = j[np.argmax(np.abs(kap[j]))] if len(j) else None
    low = np.where(y < 3.0)[0]
    print(f'z={zq:5.1f} S={S[i]:5.1f} footprint x ~ {fp[k,0].min():6.2f}..{fp[k,0].max():6.2f}', end=' ')
    if jj is not None: print(f'| crease? s={ss[jj]:5.2f} at ({x[jj]:6.2f},{y[jj]:5.2f}) kappa={kap[jj]:6.3f}', end=' ')
    if len(low): print(f'| y<3 from s={ss[low[0]]:5.2f} ({x[low[0]]:6.2f},{y[low[0]]:4.2f}) to end ({x[-1]:6.2f},{y[-1]:4.2f})')
    else: print()
# print a profile of one section: y, x, kappa every 1 mm of s for z = -14 from y<20
i = int(round((-14 - z[0]) / 0.25)); P = X[i]; m = np.isfinite(P[:, 0]); P = P[m]; ss = s[m]
for q in range(0, len(ss), 4):
    if P[q,1] < 20: print(f'  s={ss[q]:5.2f} x={P[q,0]:7.2f} y={P[q,1]:6.2f}')
