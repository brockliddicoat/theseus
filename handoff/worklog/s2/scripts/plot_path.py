import sys; sys.path.insert(0, '/home/claude/work/s2/scripts')
import numpy as np, json, matplotlib; matplotlib.use('Agg'); import matplotlib.pyplot as plt
from scipy.ndimage import gaussian_filter1d
fn = sys.argv[1]; out = sys.argv[2]
p = np.array(json.load(open(fn))['path']); c = np.load('/home/claude/work/s2/seam_ths_cloud.npy')
sys.path.insert(0, '/home/claude/work/s1/scripts'); import sidegeo as SG; sil = SG.silhouette('shell')
fig, ax = plt.subplots(2, 2, figsize=(26, 16), dpi=60, gridspec_kw=dict(width_ratios=[2.2, 1]))
def comb(a, Q, sc, step=0.1):
    d = np.r_[0, np.cumsum(np.linalg.norm(np.diff(Q, axis=0), axis=1))]; s = np.arange(0, d[-1], step)
    R = np.c_[np.interp(s, d, Q[:, 0]), np.interp(s, d, Q[:, 1])]
    Rs = np.c_[gaussian_filter1d(R[:, 0], 4, mode='nearest'), gaussian_filter1d(R[:, 1], 4, mode='nearest')]
    d1 = np.gradient(Rs, axis=0); d2 = np.gradient(d1, axis=0)
    k = (d1[:, 0] * d2[:, 1] - d1[:, 1] * d2[:, 0]) / np.maximum(np.hypot(d1[:, 0], d1[:, 1]) ** 3, 1e-12)
    n = np.c_[-d1[:, 1], d1[:, 0]] / np.maximum(np.hypot(d1[:, 0], d1[:, 1]), 1e-9)[:, None]
    for i in range(0, len(R), 2): a.plot([R[i, 0], R[i, 0] - n[i, 0] * k[i] * sc], [R[i, 1], R[i, 1] - n[i, 1] * k[i] * sc], color='#9bbcf0', lw=0.5)
    a.plot(R[:, 0], R[:, 1], color='#0071e3', lw=1.6)
a = ax[0, 0]; a.plot(sil[:, 0], sil[:, 1], color='#999', lw=0.8); a.plot(c[:, 2], c[:, 1], '.', ms=1.5, color='red'); comb(a, p[:, [2, 1]], 120)
a.set_xlim(61, -3); a.set_ylim(8, 38); a.set_aspect('equal'); a.grid(alpha=.3)
a = ax[0, 1]; a.plot(c[:, 0], c[:, 2], '.', ms=1.5, color='red'); comb(a, p[:, [0, 2]], 40); a.set_xlim(14, 32); a.set_ylim(2, 52); a.set_aspect('equal'); a.grid(alpha=.3)
a = ax[1, 0]; a.plot(c[:, 2], c[:, 1], '.', ms=2, color='red'); comb(a, p[:, [2, 1]], 3); a.set_xlim(17, 3); a.set_ylim(22, 37); a.set_aspect('equal'); a.grid(alpha=.3)
a = ax[1, 1]; a.plot(c[:, 0], c[:, 2], '.', ms=2, color='red'); comb(a, p[:, [0, 2]], 3); a.set_xlim(20, 31); a.set_ylim(3, 17); a.set_aspect('equal'); a.grid(alpha=.3)
plt.savefig(out, bbox_inches='tight')
