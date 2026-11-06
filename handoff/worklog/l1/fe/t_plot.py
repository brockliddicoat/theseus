import numpy as np, sys
import matplotlib; matplotlib.use('Agg'); import matplotlib.pyplot as plt
from l1geo import *
ch = Chart(); m = build_mesh(ch, sys.argv[1], float(sys.argv[2]), h=float(sys.argv[3]))
M3 = to3d(ch, m); amin, L = quality(M3['X'], M3['tri'])
zs = M3['zs']; tri = M3['tri']
fig, axs = plt.subplots(1, 2, figsize=(18, 8))
for ax, (z0, z1, s0, s1) in zip(axs, [(4, 60, 15, 62), (-60, -30, -62, 62)]):
    ax.tripcolor(zs[:, 0], zs[:, 1], tri, facecolors=np.clip(amin, 0, 30), cmap='RdYlGn', lw=0.2, edgecolors='0.6')
    for tg, c in [('rib', 'b'), ('crease', 'g'), ('rail', 'r'), ('bnd', 'k')]:
        for a, b in M3['edges'].get(tg, []): ax.plot(zs[[a, b], 0], zs[[a, b], 1], c, lw=1)
    ax.set_xlim(z0, z1); ax.set_ylim(s0, s1); ax.set_aspect('equal')
fig.savefig('/home/claude/work/l1/shots/mesh_dbg.png', dpi=80, bbox_inches='tight'); print('saved')
