"""Side- and top-view curvature along a seam path JSON (arc-length resampled), printed per z band, and the change from today."""
import sys, json, numpy as np
from scipy.ndimage import gaussian_filter1d
sys.path.insert(0, '/home/claude/work/s2/scripts')
from arch import seam_today
fn = sys.argv[1]
p = np.array(json.load(open(fn))['path'])
def kap(Q, step=0.1, sm=4):
    d = np.r_[0, np.cumsum(np.linalg.norm(np.diff(Q, axis=0), axis=1))]; s = np.arange(0, d[-1], step)
    R = np.c_[np.interp(s, d, Q[:, 0]), np.interp(s, d, Q[:, 1])]
    R = np.c_[gaussian_filter1d(R[:, 0], sm, mode='nearest'), gaussian_filter1d(R[:, 1], sm, mode='nearest')]
    d1 = np.gradient(R, axis=0); d2 = np.gradient(d1, axis=0)
    return s, d, (d1[:, 0] * d2[:, 1] - d1[:, 1] * d2[:, 0]) / np.maximum(np.hypot(d1[:, 0], d1[:, 1]) ** 3, 1e-12)
for nm, (a, b) in (('side (z, y)', (2, 1)), ('top (x, z)', (0, 2))):
    s, d, k = kap(p[:, [a, b]])
    z = np.interp(s, d, p[:, 2]); x = np.interp(s, d, p[:, 0])
    print(nm)
    for lo in np.arange(5.0, 50.0, 2.5):
        m = (z >= lo) & (z < lo + 2.5) & (x > 20)
        if m.any(): print('  z %4.1f..%4.1f  k min %+.4f max %+.4f' % (lo, lo + 2.5, k[m].min(), k[m].max()))
side = p[p[:, 0] > 26.0]; o = np.argsort(side[:, 2])
for z in [12, 15, 20, 25, 30, 35, 40, 45, 48]:
    print('z %4.0f  y %.2f (today %.2f, %+.2f)  x %.2f' % (z, np.interp(z, side[o, 2], side[o, 1]), seam_today(z), np.interp(z, side[o, 2], side[o, 1]) - seam_today(z), np.interp(z, side[o, 2], side[o, 0])))
