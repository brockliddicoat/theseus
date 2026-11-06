"""L1 stage C: the lattice at the moulding limits, every design at the 9.35 g budget (F44.2).

The cited limits tie the rib to the skin it stands on (t):
  rib base width  w  = KW * t   (Protolabs: 40 to 60 % of the adjacent wall; Xometry: no more than 60 %; Beall 2000: 50 %
                                  for high-shrink PP, 75 % for low-shrink resins; PP-C-20A shrinks 0.1 / 0.4 %, PlaBase)
  rib height      hr = KH * t   (Beall 2000: ribs project 2.5 to 3.0 times the nominal wall; DFMPro: not more than 2.5 to 3)
  root radius     r  = KR * t   (DFMPro: 0.25 to 0.4 times the wall; Beall: at least 25 %)
  draft           0.5 deg/side  (DFMPro: minimum 0.5 per side; Xometry 0.5 to 1.5)
  skin            t >= 0.60 mm  (F20.3, Brock's plate: "about 0.6 mm, so no rib is wider than the skin")
So a design is (topology, cell density lam); the budget then fixes t: with every rib dimension proportional to t, the
budget is a cubic in t (the rib's plan area, node overlaps and node fillets included, is exactly a w + c w^2 for a fixed
lattice, so two shapely evaluations per mesh give it).

Usage: python3 stageC.py   -> writes stageC.json (designs with t solved), then: python3 sweep.py stageC.json
"""
import sys, json, numpy as np
sys.path.insert(0, '/home/claude/work/l1/fe')
import l1fe, l1geo
from sweep import _MCACHE

KW, KH, KR = 0.6, 3.0, 0.3
GEO = {}


def geo(kind, lam, h=0.9):
    """per lattice: areas, rib lengths, rails, and the plan-area fit A(wm) = a wm + c wm^2 at the node-fillet ratio q"""
    key = (kind, round(lam, 5), h)
    if key in GEO: return GEO[key]
    ch = l1fe.chart(); m2 = l1geo.build_mesh(ch, kind, lam, h=h, rails=True); M3 = l1geo.to3d(ch, m2)
    _MCACHE[(kind, round(lam, 5), h, True, None)] = (m2, M3)
    Xo, tri, edges, zs3 = M3['X'], M3['tri'], M3['edges'], M3['zs']
    fn = np.cross(Xo[tri[:, 1]] - Xo[tri[:, 0]], Xo[tri[:, 2]] - Xo[tri[:, 0]]); A_el = 0.5 * np.linalg.norm(fn, axis=1)
    above = Xo[tri].mean(1)[:, 1] > l1geo.y_crease(Xo[tri].mean(1)[:, 2])
    e = edges.get('rail', np.zeros((0, 2), int)); P = Xo[e].mean(1); cut = np.abs(P[:, 2] - l1fe.Z_CUT) < 0.3
    L = np.linalg.norm(Xo[e[:, 0]] - Xo[e[:, 1]], axis=1)
    V_rails = L[~cut].sum() * l1fe.RAIL_SIDE[0] * l1fe.RAIL_SIDE[1] + L[cut].sum() * l1fe.RAIL_CUT[0] * l1fe.RAIL_CUT[1]
    g = dict(A_lat=A_el[above].sum(), A_rim=A_el[~above].sum(), A_nose=l1fe.nose_area(), V_rails=V_rails,
             m2=m2, X=Xo, zs=zs3, edges=edges)
    GEO[key] = g; return g


def plan_fit(g, q):
    """A_close(wm) / sc = a wm + c wm^2 at r_node = q wm; returns (a, c, sc, L3) with the volume = sc * A * hr"""
    key = ('fit', round(q, 5))
    if key in g: return g[key]
    w1, w2 = 0.25, 0.40
    A1, F1, L3 = l1fe.rib_plan_volume(g['m2'], g['X'], g['zs'], g['edges'], w1, 1.0, q * w1)
    A2, F2, _ = l1fe.rib_plan_volume(g['m2'], g['X'], g['zs'], g['edges'], w2, 1.0, q * w2)
    T1, T2 = A1 + F1, A2 + F2                       # already scaled by sc (per unit height)
    c = (T2 / w2 - T1 / w1) / (w2 - w1); a = T1 / w1 - c * w1
    g[key] = (a, c, L3); return g[key]


def at_limits(kind, lam, kw=KW, kh=KH, kr=KR, kn=None, h=0.9, draft=0.5):
    """the skin t at which ribs at (kw t, kh t, root kr t, node kn t) leave exactly t of skin at the budget"""
    kn = kr if kn is None else kn
    g = geo(kind, lam, h)
    kap = kw - kh * np.tan(np.radians(draft))       # mean width wm = kap t (drafted rib)
    a, c, L3 = plan_fit(g, kn / kap)
    V0 = (l1fe.BUDGET - l1fe.M_SKATES) / l1fe.RHO - l1fe.V_LEDGE - l1fe.V_BOSS - g['V_rails']
    At = g['A_lat'] + g['A_rim'] + g['A_nose']
    # t At + kh t (a kap t + c kap^2 t^2) + (2 - pi/2) kr^2 t^2 L3 = V0
    co = [c * kap ** 2 * kh, a * kap * kh + (2 - np.pi / 2) * kr ** 2 * L3, At, -V0]
    rts = [r.real for r in np.roots(co) if abs(r.imag) < 1e-9 and r.real > 0]
    t = min(rts)
    r = lambda x: round(float(x), 4)
    dd = dict(kind=kind, lam=r(lam), w=r(kw * t), hr=r(kh * t), draft=draft, r_root=r(kr * t), r_node=r(kn * t), h=h, rails=True)
    if l1geo.CREASE != 'level': dd['crease'] = l1geo.CREASE
    return dd, t


def lam_for_t(kind, t_target, lams=(0.24, 0.32, 0.40), **kw):
    """the cell density at which the budget leaves exactly t_target: t(lam) at three densities, quadratic, then checked"""
    ts = [at_limits(kind, l, **kw)[1] for l in lams]
    p = np.polyfit(ts, lams, 2); lam = float(np.polyval(p, t_target))
    d, t = at_limits(kind, round(lam, 4), **kw)
    return d, t, list(zip(lams, ts))


if __name__ == '__main__':
    designs = []
    for lam in (0.10, 0.15, 0.20, 0.25, 0.30, 0.35, 0.40, 0.45):
        d, t = at_limits('tri', lam); d['label'] = f'C1-tri-{lam:.2f}'; designs.append(d)
        print(d['label'], 't %.4f w %.4f hr %.4f r %.4f' % (t, d['w'], d['hr'], d['r_root']), flush=True)
    for kind in ('tri', 'kagome', 'square', 'diamond', 'hex'):
        d, t, tab = lam_for_t(kind, 0.60); d['label'] = f'C2-{kind}-t0.60'; designs.append(d)
        print(d['label'], 'lam %.4f t %.4f w %.4f hr %.4f' % (d['lam'], t, d['w'], d['hr']), [(l, round(x, 4)) for l, x in tab], flush=True)
        json.dump(designs, open('/home/claude/work/l1/fe/stageC.json', 'w'), indent=1)
    json.dump(designs, open('/home/claude/work/l1/fe/stageC.json', 'w'), indent=1)
    print('wrote', len(designs), 'designs', flush=True)
