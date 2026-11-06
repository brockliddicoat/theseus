import sys, numpy as np
sys.path.insert(0, '/home/claude/work/l1/fe')
import l1geo
from scipy.spatial import cKDTree
ch = l1geo.Chart()
for h in [1.5, 1.1, 0.8]:
    m2 = l1geo.build_mesh(ch, 'none', 0.3, h=h, rails=True)
    zs = m2['zs']; X, n, _, _ = ch.frame(zs[:, 0], zs[:, 1])
    pairs = cKDTree(X).query_pairs(0.02)
    # free (boundary) edges of the final 3D mesh near the tail bottom (x ~ 0, y > 2.6)
    M3 = l1geo.to3d(ch, m2); T = M3['tri']; Xo = M3['X']
    E = np.sort(np.concatenate([T[:, [0, 1]], T[:, [1, 2]], T[:, [2, 0]]]), 1)
    u, c = np.unique(E, axis=0, return_counts=True); free = u[c == 1]
    P = Xo[free].mean(1)
    slit = free[(np.abs(P[:, 0]) < 1.0) & (P[:, 1] > 2.6) & (P[:, 2] < -50)]
    print('h', h, 'stitched pairs', len(pairs), 'free edges', len(free), 'open slit edges at the tail', len(slit),
          'free edges above y 2.6 (excluding the opening z>4.84):', int(((P[:, 1] > 2.6) & (P[:, 2] < 4.5)).sum()))
