"""Read the 2D shell twins (deck/geo2d/shell.json, shell-sora.json): rings per axis.
axis '0' side (u=Z nose+, v=Y up), '1' top (u=X user's left... check), '2' front (u=X, v=Y)."""
import json
from shapely.geometry import Polygon
from shapely.ops import unary_union
GEO = '/home/claude/theseus/deck/geo2d/'
_cache = {}
def load(name='shell'):
    if name not in _cache: _cache[name] = json.load(open(GEO + name + '.json'))
    return _cache[name]
def rings(m, a, q):
    out = []
    for r in m['rings'].get(a, []):
        u = v = 0; pts = []
        d = r['d']
        for i in range(0, len(d), 2):
            u += d[i]; v += d[i+1]; pts.append((u*q, v*q))
        out.append((pts, r.get('h', 0)))
    return out
def mesh_rings(path, a, name='shell'):
    D = load(name); q = 1 / D['q']; out = []
    for m in D['meshes']:
        if m['path'] == path: out += rings(m, a, q)
    return out
def poly(path, a, name='shell'):
    rs = mesh_rings(path, a, name)
    outs = [p for p, h in rs if not h]; holes = [p for p, h in rs if h]
    ps = []
    for o in outs:
        P = Polygon(o)
        hs = [h for h in holes if P.contains(Polygon(h).representative_point())]
        ps.append(Polygon(o, hs).buffer(0))
    return unary_union(ps)
