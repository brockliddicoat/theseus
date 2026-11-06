import sys, json, numpy as np, matplotlib; matplotlib.use('Agg'); import matplotlib.pyplot as plt
sys.path.insert(0, '/home/claude/work/s2/scripts'); sys.path.insert(0, '/home/claude/work/s1/scripts')
import front as FR, front_opt as FO, sidegeo as SG
sil = SG.silhouette('shell'); c = np.load('/home/claude/work/s2/seam_ths_cloud.npy')
v4 = np.array(json.load(open('/home/claude/work/s2/seam_path_v4.json'))['path'])
v5 = np.array(json.load(open('/home/claude/work/s2/seam_path_v5.json'))['path']); zJ = FR.V5['J'][1]; rear = v5[v5[:, 2] <= zJ + 1e-6]
fa = FR.arch_side()
def opt_curve(rise):
    R = FO.solve(30.0, rise); zz = np.r_[np.linspace(zJ, 30.0, 300), R['zz']]; yy = np.r_[fa(np.linspace(zJ, 30.0, 300)), R['y']]
    return zz, yy, R
cases = [('today (3D)', 'today'), ('11:50 (v4)', 'v4'), ('fair, lip flat (#46 exact): r min 19.5 mm', 0.0), ('fair, lip corners +0.37: r min 23 mm', 0.45)]
fig, ax = plt.subplots(len(cases), 3, figsize=(30, 5.0 * len(cases)), dpi=55, gridspec_kw=dict(width_ratios=[2.2, 1.1, 1.1]))
for i, (nm, key) in enumerate(cases):
    if key == 'today': Z, Y = c[:, 2], c[:, 1]
    elif key == 'v4': Z, Y = np.r_[59.65, 55.5, v4[:, 2]], np.r_[10, 10, v4[:, 1]]
    else:
        zz, yy, R = opt_curve(key); Z, Y = np.r_[zz, rear[:, 2]], np.r_[yy, rear[:, 1]]
        if key == 0.0: Z, Y = np.r_[Z, [59.65]], np.r_[Y, [10.0]]
    for j, (xl, yl) in enumerate([((61, -3), (8, 38)), ((61, 38), (8, 20))]):
        a = ax[i, j]; a.plot(sil[:, 0], sil[:, 1], color='#888', lw=0.8)
        if key == 'today': a.plot(Z, Y, '.', ms=2, color='#d33')
        else:
            o = np.argsort(Z); zs, ys = Z[o], Y[o]; m = zs > zJ + 0.2; zs, ys = zs[m], ys[m]
            zu = np.linspace(zs.min(), zs.max(), 1500); yu = np.interp(zu, zs, ys)
            d1 = np.gradient(yu, zu); d2 = np.gradient(d1, zu); k = d2 / (1 + d1 ** 2) ** 1.5
            nn = np.c_[-d1, np.ones_like(d1)] / np.sqrt(1 + d1 ** 2)[:, None]
            for q in range(0, len(zu), 10): a.plot([zu[q], zu[q] + nn[q, 0] * k[q] * 60], [yu[q], yu[q] + nn[q, 1] * k[q] * 60], color='#9bbcf0', lw=0.5)
            a.plot(zu, yu, color='#0A6CFF' if key != 'v4' else '#d33', lw=1.8); a.plot(rear[:, 2], rear[:, 1], color='#0A6CFF', lw=1.8)
        a.set_xlim(*xl); a.set_ylim(*yl); a.set_aspect('equal'); a.grid(alpha=.25)
    ax[i, 0].set_title(nm, loc='left', fontsize=16)
    a = ax[i, 2]
    xf = np.linspace(-21, 21, 300); zf = FR.Z_TIP - FR.B_NOSE * xf ** 2
    if key in ('today', 'v4', 0.0): a.plot(xf, np.full(len(xf), 10.0), color='#0A6CFF' if key == 0.0 else '#d33', lw=2)
    else: a.plot(xf, np.interp(zf, R['zz'], R['y']), color='#0A6CFF', lw=2)
    a.set_xlim(-24, 24); a.set_ylim(8, 14); a.set_aspect('equal'); a.grid(alpha=.25)
plt.savefig('/home/claude/work/s2/shots/front_candidates2.png', bbox_inches='tight')
