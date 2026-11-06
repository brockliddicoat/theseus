import sys, json, numpy as np, matplotlib; matplotlib.use('Agg'); import matplotlib.pyplot as plt
sys.path.insert(0, '/home/claude/work/s2/scripts'); sys.path.insert(0, '/home/claude/work/s1/scripts')
import front as FR, sidegeo as SG
from arch import seam_today
sil = SG.silhouette('shell'); c = np.load('/home/claude/work/s2/seam_ths_cloud.npy')
V5 = np.array(json.load(open('/home/claude/work/s2/seam_path_v5.json'))['path']); rear = V5[V5[:, 2] < FR.V5['J'][1]]
cases = [('today (3D)', None), ('s_tip 0', -0.0), ('s_tip -0.15', -0.15), ('s_tip -0.30', -0.30), ('B: the arch to the tip', 'B')]
fig, ax = plt.subplots(len(cases), 3, figsize=(30, 5.2 * len(cases)), dpi=55, gridspec_kw=dict(width_ratios=[2.2, 1.1, 1.1]))
zz = np.linspace(FR.V5['J'][1], FR.Z_TIP, 800)
xf = np.linspace(-22, 22, 300); zf = FR.Z_TIP - FR.B_NOSE * xf ** 2
for i, (nm, s) in enumerate(cases):
    if s is None: f = None
    elif s == 'B': f, _ = FR.design_B()
    else: f, I = FR.design_S(s)
    for j, (xl, yl) in enumerate([((61, -3), (8, 38)), ((61, 40), (8, 19))]):
        a = ax[i, j]; a.plot(sil[:, 0], sil[:, 1], color='#888', lw=0.8)
        if f is None: a.plot(c[:, 2], c[:, 1], '.', ms=2, color='#d33')
        else:
            a.plot(zz, f(zz), color='#0A6CFF', lw=1.8); a.plot(rear[:, 2], rear[:, 1], color='#0A6CFF', lw=1.8)
            yy = f(zz); d1 = np.gradient(yy, zz); d2 = np.gradient(d1, zz); k = d2 / (1 + d1 ** 2) ** 1.5
            nn = np.c_[-d1, np.ones_like(d1)] / np.sqrt(1 + d1 ** 2)[:, None]
            for q in range(0, len(zz), 6): a.plot([zz[q], zz[q] + nn[q, 0] * k[q] * 60], [yy[q], yy[q] + nn[q, 1] * k[q] * 60], color='#9bbcf0', lw=0.5)
        a.set_xlim(*xl); a.set_ylim(*yl); a.set_aspect('equal'); a.grid(alpha=.25)
    ax[i, 0].set_title(nm, loc='left', fontsize=16)
    a = ax[i, 2]
    if f is None: a.plot(xf, np.full(len(xf), 10.0), color='#d33', lw=2)
    else: a.plot(xf, f(zf), color='#0A6CFF', lw=2)
    a.set_xlim(-24, 24); a.set_ylim(8, 14); a.set_aspect('equal'); a.grid(alpha=.25); a.set_title('front view: the front cutout (lip) across the nose', fontsize=11)
plt.savefig('/home/claude/work/s2/shots/front_candidates.png', bbox_inches='tight')
