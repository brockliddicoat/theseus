import numpy as np, sys, json, matplotlib; matplotlib.use('Agg'); import matplotlib.pyplot as plt
sys.path.insert(0, '/home/claude/work/s1/scripts')
import sidegeo as SG, arch3 as A3, arch4 as A4, skin as SK
sk = SK.get(); sil = SG.silhouette('shell'); c = np.load('/home/claude/work/s2/seam_ths_cloud.npy')
V = [('today', None), ('6.9 -> 6.2', (6.9, 6.2)), ('6.9 -> 5.5', (6.9, 5.5)), ('6.9 -> 5.0', (6.9, 5.0)), ('6.9 const', (6.9, 6.9))]
fig, ax = plt.subplots(len(V), 2, figsize=(20, 4.2 * len(V)), dpi=70, gridspec_kw=dict(width_ratios=[2.2, 1]))
for i, (nm, nn) in enumerate(V):
    a = ax[i, 0]; b = ax[i, 1]
    a.fill(sil[:, 0], sil[:, 1], color='white'); a.plot(sil[:, 0], sil[:, 1], color='#111', lw=1.2)
    if nn is None:
        o = np.argsort(c[:, 2]); a.plot(c[:, 2], c[:, 1], '.', ms=1.5, color='#111'); b.plot(c[:, 0], c[:, 2], '.', ms=1.5, color='#111')
    else:
        A3.N_REAR, A3.N_FRONT = nn; D = A4.design(sk); p = D['path']
        a.plot(p[:, 2], p[:, 1], color='#0A6CFF', lw=1.4); b.plot(p[:, 0], p[:, 2], color='#0A6CFF', lw=1.4)
        b.plot(c[:, 0], c[:, 2], '.', ms=1, color='#bbb')
    a.set_xlim(62, -62); a.set_ylim(-1, 40); a.set_aspect('equal'); a.axis('off'); a.set_title(nm, loc='left')
    T = SG.trigger_side('shell')
    b.set_xlim(14, 32); b.set_ylim(2, 58); b.set_aspect('equal'); b.grid(alpha=.3)
plt.savefig('/home/claude/work/s2/shots/offsets_compare.png', bbox_inches='tight')
