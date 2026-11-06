import numpy as np
from l1geo import *
from scipy.spatial import Delaunay
ch = Chart()
import l1geo
m = build_mesh(ch, 'tri', 0.3464, h=1.5)
zs, tri = m['zs'], m['tri']
E = set(map(tuple, np.sort(np.concatenate([tri[:, [0, 1]], tri[:, [1, 2]], tri[:, [2, 0]]]), 1)))
miss = [(a, b, tg) for a, b, tg in m['cons'] if tuple(sorted((a, b))) not in E]
print('missing', len(miss))
from collections import Counter
print(Counter(tg for _,_,tg in miss))
for a, b, tg in miss[:25]:
    print(tg, zs[a].round(3), zs[b].round(3), 'len', np.hypot(*(zs[a]-zs[b])).round(4))
M3 = to3d(ch, m); amin, L = quality(M3['X'], M3['tri'])
bad = np.where(amin < 8)[0]
C = M3['X'][M3['tri'][bad]].mean(1); Czs = M3['zs'][M3['tri'][bad]].mean(1)
print('bad tris', len(bad))
H, ze = np.histogram(Czs[:, 0], bins=[-60, -55, -50, -40, -20, 0, 4.84, 10, 30, 50, 55, 60]); print('bad by z', list(zip(ze[:-1], H)))
yb = C[:, 1]; print('bad by y', np.histogram(yb, bins=[0, 1.5, 3, 6, 9.3, 12, 20, 40])[0])
