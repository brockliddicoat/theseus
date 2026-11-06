import numpy as np, sys, matplotlib; matplotlib.use('Agg'); import matplotlib.pyplot as plt
from scipy.ndimage import gaussian_filter1d
import arch2 as A2
NS = [float(v) for v in sys.argv[1:]] or [6.0, 6.9]
fig, ax = plt.subplots(1, len(NS) * 2, figsize=(11 * len(NS), 9), dpi=70)
for i, n0 in enumerate(NS):
    D = A2.design(n0); p = D['path']
    for j, (u, v, lim, ttl) in enumerate([(2, 1, (17, 3, 22, 37), 'side'), (0, 2, (16, 31, 3, 18), 'top')]):
        a = ax[2 * i + j]
        q = np.c_[p[:, u], p[:, v]]
        # resample by arc length and curvature
        d = np.r_[0, np.cumsum(np.linalg.norm(np.diff(q, axis=0), axis=1))]; s = np.arange(0, d[-1], 0.05)
        Q = np.c_[np.interp(s, d, q[:, 0]), np.interp(s, d, q[:, 1])]
        Qs = np.c_[gaussian_filter1d(Q[:, 0], 3), gaussian_filter1d(Q[:, 1], 3)]
        d1 = np.gradient(Qs, axis=0); d2 = np.gradient(d1, axis=0)
        kap = (d1[:, 0] * d2[:, 1] - d1[:, 1] * d2[:, 0]) / np.maximum(np.hypot(d1[:, 0], d1[:, 1]) ** 3, 1e-12)
        nrm = np.c_[-d1[:, 1], d1[:, 0]] / np.maximum(np.hypot(d1[:, 0], d1[:, 1]), 1e-9)[:, None]
        m = (Q[:, 0] < max(lim[0], lim[1])) & (Q[:, 0] > min(lim[0], lim[1]))
        for k in np.nonzero(m)[0][::3]:
            a.plot([Q[k, 0], Q[k, 0] - nrm[k, 0] * kap[k] * 3], [Q[k, 1], Q[k, 1] - nrm[k, 1] * kap[k] * 3], color='#9bbcf0', lw=0.5)
        a.plot(Q[:, 0], Q[:, 1], color='#0071e3', lw=2)
        a.set_xlim(lim[0], lim[1]); a.set_ylim(lim[2], lim[3]); a.set_aspect('equal'); a.grid(alpha=.3)
        a.set_title('N0 %.1f %s; max curvature %.2f /mm (r %.2f)' % (n0, ttl, np.abs(kap[m]).max(), 1 / np.abs(kap[m]).max()))
plt.savefig('/home/claude/work/s2/shots/arch_rear.png', bbox_inches='tight')
