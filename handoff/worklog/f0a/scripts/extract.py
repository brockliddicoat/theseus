# Extract the simplified side / front outlines and features for mouseSimple from the shell's flat twin (geo2d).
import json, sys, math
import numpy as np
from shapely.geometry import Polygon, LineString, MultiPolygon
from shapely.ops import unary_union
D = json.load(open('/home/claude/theseus/deck/geo2d/shell.json')); q = 1 / D['q']
def rings(m, a):
    out = []
    for r in m['rings'].get(a, []):
        u = v = 0; pts = []
        d = r['d']
        for i in range(0, len(d), 2):
            u += d[i]; v += d[i+1]; pts.append((u*q, v*q))
        out.append((pts, r.get('h', 0)))
    return out
def mesh(path):
    return [m for m in D['meshes'] if m['path'] == path]
def poly(path, a):
    ps = []
    for m in mesh(path):
        outer = [p for p, h in rings(m, a) if not h]
        holes = [p for p, h in rings(m, a) if h]
        for o in outer:
            P = Polygon(o, holes).buffer(0)
            ps.append(P)
    return unary_union(ps)
for a, name in [('0', 'side (Z,Y)'), ('2', 'front (X,Y)'), ('1', 'top (X,Z)')]:
    body = poly('body/body', a); tl = poly('explodeL/triggerL/Group/triggerL', a); tr = poly('explodeR/triggerR/Group/triggerR', a)
    U = unary_union([body, tl, tr])
    print(name, 'body bounds', [round(v, 2) for v in body.bounds], 'union bounds', [round(v, 2) for v in U.bounds], U.geom_type)
