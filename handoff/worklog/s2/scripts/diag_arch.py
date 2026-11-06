import numpy as np, matplotlib, json, sys; matplotlib.use('Agg')
import matplotlib.pyplot as plt
sys.path.insert(0, '/home/claude/work/s1/scripts')
import arch as AR
import sidegeo as SG, topgeo
from geo_options import option_rear
D = AR.design()
c = np.load('/home/claude/work/s2/seam_ths_cloud.npy')
fig, ax = plt.subplots(1, 2, figsize=(26, 11), dpi=80, gridspec_kw=dict(width_ratios=[1.6, 1]))
a = ax[0]
zz = np.linspace(-10, 60, 800); a.plot(zz, AR.T(zz), color='k', lw=1, label='crown T(z)')
a.plot(c[:, 2], c[:, 1], '.', ms=2, color='red', label='today seam (3D)')
p = D['path']; a.plot(p[:, 2], p[:, 1], color='#0071e3', lw=2, label='new seam (arch + K3 + cutout)')
sil = SG.silhouette('shell'); a.plot(sil[:, 0], sil[:, 1], color='grey', lw=0.8)
a.set_xlim(60, -5); a.set_ylim(8, 40); a.set_aspect('equal'); a.grid(alpha=.3); a.legend()
b = ax[1]
b.plot(c[:, 0], c[:, 2], '.', ms=2, color='red')
s1, _ = option_rear('K3'); b.plot(s1[:, 0], s1[:, 1], color='orange', lw=1.5, label="S1's K3 (top view)")
b.plot(p[:, 0], p[:, 2], color='#0071e3', lw=2, label='new')
ring = topgeo.ring('body/body') if hasattr(topgeo, 'ring') else None
if ring is not None: b.plot(ring[:, 0], ring[:, 1], color='grey', lw=0.8)
Pc = np.array(D['ctrl']); b.plot(Pc[:, 0], Pc[:, 1], 'o--', color='#0071e3', ms=4, lw=0.6)
b.set_xlim(-1, 33); b.set_ylim(0, 30); b.set_aspect('equal'); b.grid(alpha=.3); b.legend()
plt.savefig('/home/claude/work/s2/shots/diag_arch.png', bbox_inches='tight')
