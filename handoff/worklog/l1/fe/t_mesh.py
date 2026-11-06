import numpy as np, time, sys
import matplotlib; matplotlib.use('Agg'); import matplotlib.pyplot as plt
from l1geo import *
t0 = time.time()
ch = Chart(); dom, lat = ch.polygons()
print('chart', round(time.time()-t0, 2), 's; z range', ch.zlo, ch.zhi, 'domain area (z,s)', round(dom.area), 'lattice area', round(lat.area))
kind = sys.argv[1] if len(sys.argv) > 1 else 'tri'; lam = float(sys.argv[2]) if len(sys.argv) > 2 else 3.464/10
h = float(sys.argv[3]) if len(sys.argv) > 3 else 1.5
m = build_mesh(ch, kind, lam, h=h, verbose=True)
print('mesh (z,s)', len(m['zs']), 'nodes', len(m['tri']), 'tris', 'segs', m['nseg'], round(time.time()-t0, 2), 's')
M3 = to3d(ch, m)
amin, L = quality(M3['X'], M3['tri'])
print('3D', len(M3['X']), 'nodes', len(M3['tri']), 'tris; min angle P1/P5/med', np.percentile(amin, [1, 5, 50]).round(1), 'edge len med', np.median(L).round(2), 'max', L.max().round(2))
for k, v in M3['edges'].items(): print('  edges', k, len(v))
A = np.linalg.norm(np.cross(M3['X'][M3['tri'][:,1]]-M3['X'][M3['tri'][:,0]], M3['X'][M3['tri'][:,2]]-M3['X'][M3['tri'][:,0]]), axis=1)/2
yc = M3['X'][M3['tri']].mean(1)[:, 1]
print('outer area total', A.sum().round(0), 'above crease', A[yc > Y_CREASE].sum().round(0), 'below', A[yc <= Y_CREASE].sum().round(0))
if 'rib' in M3['edges']:
    e = M3['edges']['rib']; Lr = np.linalg.norm(M3['X'][e[:,0]]-M3['X'][e[:,1]], axis=1); print('rib length total', Lr.sum().round(0), 'per area above crease', (Lr.sum()/A[yc > Y_CREASE].sum()).round(4), 'target lam', lam)
fig, ax = plt.subplots(figsize=(16, 9))
zs = m['zs']; ax.triplot(zs[:,0], zs[:,1], m['tri'], lw=0.2, color='0.7')
for a, b, tg in m['cons']:
    c = {'rib': 'b', 'crease': 'g', 'rail': 'r', 'bnd': 'k'}[tg]; ax.plot(zs[[a,b],0], zs[[a,b],1], c, lw=0.8)
ax.set_aspect('equal'); fig.savefig(f'/home/claude/work/l1/shots/mesh_{kind}.png', dpi=110, bbox_inches='tight')
print('done', round(time.time()-t0, 1), 's')
