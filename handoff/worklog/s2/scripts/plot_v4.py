import numpy as np, sys, json, matplotlib; matplotlib.use('Agg'); import matplotlib.pyplot as plt
from arch3 import curv2
p = np.array(json.load(open(sys.argv[1] if len(sys.argv) > 1 else '/home/claude/work/s2/seam_path_v5.json'))['path'])
c = np.load('/home/claude/work/s2/seam_ths_cloud.npy')
fig, ax = plt.subplots(2, 1, figsize=(24, 20), dpi=60)
for a, (i, j), lim in ((ax[0], (2, 1), (61, 3, 8, 37)), (ax[1], (2, 0), (61, 3, 14, 31))):
    Q = p[:, [i, j]]; d = np.r_[0, np.cumsum(np.linalg.norm(np.diff(Q, axis=0), axis=1))]; ss = np.arange(0, d[-1], 0.2)
    R = np.c_[np.interp(ss, d, Q[:, 0]), np.interp(ss, d, Q[:, 1])]
    kk = curv2(R); dd = np.gradient(R, axis=0); n = np.c_[-dd[:, 1], dd[:, 0]] / np.maximum(np.hypot(dd[:, 0], dd[:, 1]), 1e-9)[:, None]
    for k in range(0, len(R), 2): a.plot([R[k, 0], R[k, 0] - n[k, 0] * kk[k] * 8], [R[k, 1], R[k, 1] - n[k, 1] * kk[k] * 8], color='#9bbcf0', lw=0.6)
    a.plot(c[:, i], c[:, j], '.', ms=2, color='red'); a.plot(R[:, 0], R[:, 1], color='#0071e3', lw=1.6)
    a.set_xlim(lim[0], lim[1]); a.set_ylim(lim[2], lim[3]); a.set_aspect('equal'); a.grid(alpha=.3)
plt.savefig('/home/claude/work/s2/shots/v4_combs.png', bbox_inches='tight')
