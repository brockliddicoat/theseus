# slice a GLB mesh (by node name) with the plane z = Z; print the loops as [x, y] (mm), outer first
import sys, json, numpy as np
sys.path.insert(0, '/home/claude/work/b07/scripts')
from glbcom_lib import load, acc, node_mats
path, name, Z = sys.argv[1], sys.argv[2], float(sys.argv[3])
js, bin_ = load(path); mats = node_mats(js)
for ni, M in mats.items():
    nd = js['nodes'][ni]
    if 'mesh' not in nd or (nd.get('name') or js['meshes'][nd['mesh']].get('name')) != name: continue
    mesh = js['meshes'][nd['mesh']]; V = []; F = []; base = 0
    for pr in mesh['primitives']:
        p = acc(js, bin_, pr['attributes']['POSITION']); p = (np.c_[p, np.ones(len(p))] @ M.T)[:, :3]
        idx = acc(js, bin_, pr['indices']).astype(np.int64).reshape(-1, 3)
        V.append(p); F.append(idx + base); base += len(p)
    V = np.vstack(V); F = np.vstack(F)
    segs = []
    for f in F:
        P = V[f]; d = P[:, 2] - Z; pts = []
        for a, b in ((0, 1), (1, 2), (2, 0)):
            if (d[a] > 0) != (d[b] > 0):
                k = d[a] / (d[a] - d[b]); pts.append(P[a] + (P[b] - P[a]) * k)
        if len(pts) == 2: segs.append((pts[0][:2], pts[1][:2]))
    # chain segments into loops by nearest endpoints
    segs = [list(map(tuple, s)) for s in segs]
    from collections import defaultdict
    key = lambda p: (round(p[0], 3), round(p[1], 3))
    adj = defaultdict(list)
    for i, (a, b) in enumerate(segs): adj[key(a)].append((i, 0)); adj[key(b)].append((i, 1))
    used = [False] * len(segs); loops = []
    for i in range(len(segs)):
        if used[i]: continue
        used[i] = True; loop = [segs[i][0], segs[i][1]]
        while True:
            nxt = None
            for j, e in adj[key(loop[-1])]:
                if not used[j]: nxt = (j, e); break
            if nxt is None: break
            j, e = nxt; used[j] = True; loop.append(segs[j][1 - e])
        loops.append(loop)
    loops.sort(key=lambda L: -len(L))
    for L in loops[:6]:
        A = np.array(L); 
        area = 0.5 * np.sum(A[:-1, 0] * A[1:, 1] - A[1:, 0] * A[:-1, 1])
        print('loop n', len(L), 'area %.1f' % area, 'x %.2f..%.2f y %.2f..%.2f' % (A[:, 0].min(), A[:, 0].max(), A[:, 1].min(), A[:, 1].max()))
    json.dump([[list(map(lambda v: round(v, 3), p)) for p in L] for L in loops[:6]], open('/home/claude/work/b07/slice_%s_z%g.json' % (name, Z), 'w'))
