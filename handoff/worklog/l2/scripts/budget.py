"""L2: the weight bookkeeping of L1's budget (l1fe.build: ribs as the plan union of the rib and crease-rib strips at the mean
drafted width, times the depth; root fillets (2 - pi/2) r^2 per mm of rib), replicated on L1's own lattice lines without the
FE mesh, for the crease chosen by L2_CREASE. Prints JSON.

Used for: (a) checking the replication against L1's cached builds; (b) the true triangles' spacing at the kagome's weight and
skin; (c) what the 1.75 deg crease does to the ribbed area and the weight at L1's spacings."""
import env
import json, sys
import numpy as np
import shapely
from shapely.geometry import LineString
from shapely.ops import unary_union
import geo
from l1geo import lattice_segments

ch = geo.chart()
W, HR, DR = 0.36, 1.80, 0.5
WM = W - HR * np.tan(np.radians(DR))          # L1's mean width of a drafted rib (l1fe.build: w - hr tan(draft))
RHO = 1.01e-3


def area3d(poly, step=0.25):
    zmin, smin, zmax, smax = poly.bounds
    gz, gs = np.meshgrid(np.arange(zmin, zmax, step) + step / 2, np.arange(smin, smax, step) + step / 2)
    inside = shapely.contains_xy(poly, gz.ravel(), gs.ravel())
    z, s = gz.ravel()[inside], gs.ravel()[inside]
    _, _, Pz, Ps = ch.frame(z, s)
    dA = np.linalg.norm(np.cross(Pz, Ps), axis=1)
    return float(np.nansum(dA) * step * step)


def len3d(P, step=0.25):
    P = np.asarray(P, float); tot = 0.0
    for a, b in zip(P[:-1], P[1:]):
        L = np.linalg.norm(b - a); n = max(2, int(np.ceil(L / step)) + 1)
        q = a + (b - a) * np.linspace(0, 1, n)[:, None]
        X = ch.P(q[:, 0], q[:, 1]); d = np.linalg.norm(np.diff(X, axis=0), axis=1)
        tot += float(np.nansum(d))
    return tot


def ribs(code, lam, r_root=0.18, r_node=0.0):
    segs = lattice_segments(code, lam, ch.lat)
    cr = geo.crease_lines(ch)
    lines = [LineString(s) for s in segs] + [LineString(c) for c in cr]
    L2 = sum(l.length for l in lines)
    L3 = sum(len3d(np.array(s)) for s in segs) + sum(len3d(c) for c in cr)
    U = unary_union(lines)
    A_union = U.buffer(WM / 2, cap_style='flat', join_style='mitre', mitre_limit=10).area
    sc = L3 / L2
    A_close = A_union
    if r_node > 0:
        A_close = U.buffer(WM / 2 + r_node, cap_style='flat', join_style='round').buffer(-r_node, join_style='round').area
    V_ribs = A_union * sc * HR
    V_root = (2 - np.pi / 2) * r_root ** 2 * L3
    return dict(n_lines=len(segs), L3=L3, L3_lattice=L3 - sum(len3d(c) for c in cr), V_ribs=V_ribs, V_root=V_root,
                V=V_ribs + V_root, A_union3=A_union * sc)


def node_fillet_volume(key, rn=0.22, w=W, h=HR):
    """the node fillets' plan area per junction from the exact local geometry (geo.prism's plan minus the bare strips), x depth"""
    from shapely.geometry import Point
    P2 = geo.pattern2d(key)
    tot = 0.0
    for nd in P2['nodes'] + P2['tees']:
        arms = nd['arms']
        strips = []
        for a in arms:
            a = np.asarray(a, float); a = a / np.linalg.norm(a)
            strips.append(LineString([(0, 0), tuple(3.0 * a)]).buffer(w / 2, cap_style='flat'))
        U = unary_union(strips + [Point(0, 0).buffer(w / 2 / np.cos(np.radians(30)), 32)])
        C = U.buffer(rn, join_style='round', quad_segs=16).buffer(-rn, join_style='round', quad_segs=16)
        R = Point(0, 0).buffer(2.0, 64)
        tot += (C.intersection(R).area - U.intersection(R).area)
    return tot * h, len(P2['nodes']), len(P2['tees'])


if __name__ == '__main__':
    dom, lat = ch.dom, ch.lat
    out = dict(crease=env.CREASE, A_lat=area3d(lat), A_dom=area3d(dom))
    for key, code, lam in (('kag', 'tri', 0.2382), ('tri', 'kagome', 0.2398)):
        out[key] = ribs(code, lam)
        out[key]['V_rootfil_024'] = (2 - np.pi / 2) * 0.24 ** 2 * out[key]['L3']
        vn, nn, nt = node_fillet_volume(key)
        out[key].update(V_nodefil_022=vn, n_nodes=nn, n_tees=nt)
    # (b) the triangles' line spacing that matches the kagome's rib volume (same weight, same skin): scan lam
    if '--scan' in sys.argv:
        target = out['kag']['V']
        lams = np.round(np.arange(0.2330, 0.2421, 0.0015), 4)
        rows = [(float(l), ribs('kagome', float(l))['V']) for l in lams]
        out['tri_scan'] = rows
        # registration noise makes V(lam) jagged: report the linear fit's crossing and the scan
        A = np.polyfit([r[0] for r in rows], [r[1] for r in rows], 1)
        out['tri_lam_same_V'] = float((target - A[1]) / A[0])
        out['tri_spacing_same_V'] = 3.0 / out['tri_lam_same_V']
    print(json.dumps(out, indent=1))
