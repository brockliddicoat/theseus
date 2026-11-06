"""L2: exact plan outlines and true sections of the three nodes (kagome crossing, triangle knot, cored knot) for drawing.
Section: a vertical cut through the junction ball's centre along the node's mirror line (kagome: the crossing's long
diagonal; knot: across one rib; cored knot: along a rib through the core). Output out/nodedraw.npz + json."""
import json
import numpy as np
import shapely
from shapely.geometry import Point
from skimage import measure
import nodes as N

OUT = '/home/claude/work/l2/out'
R = json.load(open('%s/nodes.json' % OUT))
RH = R['hole_d'] / 2
CUT = {'kag': 30.0, 'tri': 90.0, 'tri_cored': 0.0}      # cut directions (deg) through the ball's centre


def section(case, ang, through, umax=1.25, g=0.004):
    e = np.array([np.cos(np.radians(ang)), np.sin(np.radians(ang))])
    c = np.asarray(through, float)
    # u measured from the node's centre projected on the cut line
    u0 = c @ e
    us = np.arange(-umax, umax + 1e-9, g); vs = np.arange(-0.2, 2.6 + 1e-9, g)
    P = c[None, :] + (us - u0)[:, None] * e[None, :]
    M = np.zeros((len(vs), len(us)), bool)
    lines = N.CASES[case]; cache = {}
    for k, v in enumerate(vs):
        if v < 0: continue
        if v <= N.T: M[k] = True; continue
        h = v - N.T
        if h > N.H: continue
        hw = round(N.W / 2 - h * N.TAN, 4)
        if hw not in cache: cache[hw] = N.plan(lines, hw)
        df = float(N.d_fillet(h))
        geom = cache[hw].buffer(df, quad_segs=32) if df > 1e-6 else cache[hw]
        m = shapely.contains_xy(geom, P[:, 0], P[:, 1])
        if case == 'tri_cored':
            m &= ~((P ** 2).sum(1) < float(N.hole_r(h, RH)) ** 2)
        M[k] = m
    cs = measure.find_contours(M.astype(float), 0.5)
    outl = [np.c_[us[0] + c_[:, 1] * g, vs[0] + c_[:, 0] * g] for c_ in cs]
    return outl, u0, M, us, vs


if __name__ == '__main__':
    out = {}
    arrays = {}
    for case in ('kag', 'tri', 'tri_cored'):
        b = R[case]['ball']; c = np.array(b['centre'][:2])
        outl, u0, M, us, vs = section(case, CUT[case], c)
        arrays['%s_mask' % case] = M; arrays['%s_us' % case] = us; arrays['%s_vs' % case] = vs
        for i, o in enumerate(outl): arrays['%s_sec%d' % (case, i)] = o
        # plan outlines: the root (ribs + node fillets), the root fillet's edge on the skin, the rib tips
        Proot = N.plan(N.CASES[case], N.W / 2)
        Pfil = Proot.buffer(N.RR, quad_segs=32)
        Ptip = N.plan(N.CASES[case], N.W / 2 - N.H * N.TAN)
        for nm, P in (('root', Proot), ('fil', Pfil), ('tip', Ptip)):
            P = P.intersection(Point(0, 0).buffer(1.6, 128))
            gs = [P] if P.geom_type == 'Polygon' else list(P.geoms)
            for j, gg in enumerate(gs):
                arrays['%s_%s%d' % (case, nm, j)] = np.array(gg.exterior.coords)
        e = [np.cos(np.radians(CUT[case])), np.sin(np.radians(CUT[case]))]
        out[case] = dict(n_sec=len(outl), cut_deg=CUT[case], ball_u=float(c @ np.array(e)), ball_v=b['centre'][2], ball_D=b['D'],
                         plan=R[case]['plan'], hole_d=2 * RH if case == 'tri_cored' else 0)
        print(case, 'section pieces', len(outl), 'ball u %.3f v %.3f D %.3f' % (out[case]['ball_u'], b['centre'][2], b['D']))
    np.savez_compressed('%s/nodedraw.npz' % OUT, **arrays)
    json.dump(out, open('%s/nodedraw.json' % OUT, 'w'), indent=1)
