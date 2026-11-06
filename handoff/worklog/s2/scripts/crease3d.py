"""The hard crease (the bottom rim's top edge) on the 3D shell, section by section: for each z, the body's outer contour on
the +X and -X walls between y 1.5 and 12; the crease = the curvature peak (the sharpest turn), and the widest point."""
import sys, json
import numpy as np
from scipy.ndimage import gaussian_filter1d
sys.path.insert(0, '/home/claude/theseus/3d/shell/tools')
import glbio
fn = sys.argv[1] if len(sys.argv) > 1 else '/home/claude/theseus/3d/shell/shell-theseus-1seam.glb'
js, b = glbio.read(fn); _, d = glbio.mesh_arrays(js, b, 'body')
P = d['POSITION'].astype(float); T = d['indices'].reshape(-1, 3)
A, B, Cc = P[T[:, 0]], P[T[:, 1]], P[T[:, 2]]
def section(z0):
    dd = np.stack([A[:, 2], B[:, 2], Cc[:, 2]], 1) - z0
    m = (dd.min(1) < 0) & (dd.max(1) > 0)
    segs = []
    for a, bb, c, e in zip(A[m], B[m], Cc[m], dd[m]):
        pts = []
        for (p, q, dp, dq) in ((a, bb, e[0], e[1]), (bb, c, e[1], e[2]), (c, a, e[2], e[0])):
            if (dp < 0) != (dq < 0): t = dp / (dp - dq); pts.append((p + t * (q - p))[:2])
        if len(pts) == 2: segs.append(pts)
    return np.array(segs)
out = []
for z in np.arange(-59.0, 55.01, 1.0):
    S = section(z)
    if not len(S): continue
    res = []
    for sgn in (1, -1):
        Q = S.reshape(-1, 2); Q = Q[(Q[:, 0] * sgn > 0)]
        # the outermost x at each y (outer contour), y from 1.2 to 13
        ys = np.arange(1.2, 13.0, 0.05); xs = []
        for y in ys:
            m = np.abs(Q[:, 1] - y) < 0.06
            xs.append(np.abs(Q[m, 0]).max() if m.any() else np.nan)
        xs = np.array(xs); ok = np.isfinite(xs)
        if ok.sum() < 50: res.append((np.nan, np.nan, np.nan)); continue
        xs = np.interp(ys, ys[ok], xs[ok])
        xsm = gaussian_filter1d(xs, 3)
        d1 = np.gradient(xsm, ys); d2 = np.gradient(d1, ys)
        kap = d2 / (1 + d1 ** 2) ** 1.5          # x(y): a bend outward-then-in is negative curvature
        k = np.argmin(kap[10:-10]) + 10          # the sharpest convex turn
        w = np.argmax(xsm)
        res.append((ys[k], ys[w], xsm[w]))
    out.append((z, *res[0], *res[1]))
out = np.array(out)
json.dump(dict(z=out[:, 0].tolist(), creaseL=out[:, 1].tolist(), widestL=out[:, 2].tolist(), xL=out[:, 3].tolist(),
               creaseR=out[:, 4].tolist(), widestR=out[:, 5].tolist(), xR=out[:, 6].tolist()), open('/home/claude/work/s2/crease3d.json', 'w'))
for r in out[::4]: print('z %6.1f  crease L %.2f R %.2f   widest L %.2f R %.2f  (x %.2f)' % (r[0], r[1], r[4], r[2], r[5], r[3]))
