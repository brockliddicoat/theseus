import sys, numpy as np, networkx as nx
sys.path.insert(0, '/home/claude/work/l1/fe')
import l1geo
from l1geo import Z_CUT
ch = l1geo.Chart()
for h in [1.5, 1.1, 0.8]:
    m2 = l1geo.build_mesh(ch, 'none', 0.3, h=h, rails=True); M3 = l1geo.to3d(ch, m2)
    X = M3['X']; e = M3['edges'].get('rail', np.zeros((0, 2), int))
    G = nx.Graph(); G.add_edges_from(map(tuple, e))
    comps = list(nx.connected_components(G))
    P = X[e].mean(1); cut = np.abs(P[:, 2] - Z_CUT) < 0.3
    L = np.linalg.norm(X[e[:, 0]] - X[e[:, 1]], axis=1)
    print('h', h, 'rail edges', len(e), 'components', len(comps), 'len side %.1f cut %.1f' % (L[~cut].sum(), L[cut].sum()),
          'cut edges', cut.sum(), 'cut z range', P[cut, 2].min().round(3) if cut.any() else None, P[cut, 2].max().round(3) if cut.any() else None)
    for c in comps:
        idx = np.array(list(c)); print('   comp', len(idx), 'x', X[idx, 0].min().round(1), X[idx, 0].max().round(1), 'z', X[idx, 2].min().round(1), X[idx, 2].max().round(1))
