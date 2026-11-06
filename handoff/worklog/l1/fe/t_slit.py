import sys, numpy as np
sys.path.insert(0, '/home/claude/work/l1/fe')
import l1geo
from l1geo import Y_BOT
ch = l1geo.Chart()
m2 = l1geo.build_mesh(ch, 'none', 0.3, h=1.1, rails=True)
zs = m2['zs']; tri = m2['tri']; X, n, _, _ = ch.frame(zs[:, 0], zs[:, 1])
E0 = np.sort(np.concatenate([tri[:, [0, 1]], tri[:, [1, 2]], tri[:, [2, 0]]]), 1)
uu, cc = np.unique(E0, axis=0, return_counts=True); fnodes = np.unique(uu[cc == 1].ravel())
tail = fnodes[(zs[fnodes, 0] < -54)]
for i in tail[np.argsort(zs[tail, 0])]: print('z %7.2f s %7.2f   X %s' % (zs[i, 0], zs[i, 1], X[i].round(2)))
