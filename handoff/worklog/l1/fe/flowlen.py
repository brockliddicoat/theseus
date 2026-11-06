"""L1: the melt's longest path from the gate under the crown (F19.1) to the shell's farthest edge, along the shell (geodesic
on the mesh edges, Dijkstra); the trigger buttons are separate parts (their own gates), so the body only. -> out/flowlen.json"""
import sys, json, numpy as np, scipy.sparse as sp
from scipy.sparse.csgraph import dijkstra
sys.path.insert(0, '/home/claude/work/l1/fe')
import l1fe, l1geo
ch = l1fe.chart(); m2 = l1geo.build_mesh(ch, 'none', 0.3, h=1.2, rails=True); M3 = l1geo.to3d(ch, m2)
X, tri = M3['X'], M3['tri']
e = np.vstack([tri[:, [0, 1]], tri[:, [1, 2]], tri[:, [2, 0]]]); e = np.unique(np.sort(e, 1), axis=0)
L = np.linalg.norm(X[e[:, 0]] - X[e[:, 1]], axis=1); N = len(X)
A = sp.coo_matrix((np.r_[L, L], (np.r_[e[:, 0], e[:, 1]], np.r_[e[:, 1], e[:, 0]])), shape=(N, N)).tocsr()
c = l1fe.crown_point(None); g = int(np.argmin(np.linalg.norm(X - c, axis=1)))
dist = dijkstra(A, indices=g)
k = int(np.argmax(dist)); far = X[k]
# graph paths overestimate a straight geodesic a little on a triangle mesh (zig-zag): report both the graph length and a
# corrected one (x 0.95, the typical excess of edge paths on an unstructured mesh at this density)
out = dict(gate=X[g].round(2).tolist(), far=far.round(2).tolist(), graph_mm=float(dist[k]), est_mm=float(dist[k] * 0.95),
           p95_mm=float(np.percentile(dist, 95)), n=N)
print(out); json.dump(out, open('/home/claude/work/l1/out/flowlen.json', 'w'), indent=1)
