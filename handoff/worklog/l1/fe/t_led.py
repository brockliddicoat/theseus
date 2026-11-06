import sys, numpy as np
sys.path.insert(0, '/home/claude/work/l1/fe')
import l1fe
from l1geo import Y_BOT
for h in [1.5, 1.1, 0.8]:
    d = dict(kind='none', rails=True, h=h)
    ch = l1fe.chart()
    import l1geo
    m2 = l1geo.build_mesh(ch, 'none', 0.3, h=h, rails=True); M3 = l1geo.to3d(ch, m2)
    Xo, bnd = M3['X'], M3['edges'].get('bnd')
    led = bnd[(Xo[bnd][:, :, 1].max(1) < Y_BOT + 0.35)]
    deg = np.bincount(led.ravel(), minlength=len(Xo)); ends = np.where(deg == 1)[0]
    print('h', h, 'bnd', len(bnd), 'led', len(led), 'ends', len(ends))
    for e in ends: print('   end', Xo[e].round(2))
    other = bnd[(Xo[bnd][:, :, 1].max(1) >= Y_BOT + 0.35)]
    yy = Xo[other].mean(1)
    print('   other bnd edges', len(other), 'y range', yy[:,1].min().round(2) if len(yy) else None, 'z range', (yy[:,2].min().round(1), yy[:,2].max().round(1)) if len(yy) else None)
