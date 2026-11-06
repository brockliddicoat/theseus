"""L2 node close-ups: the kagome's two-rib crossing, the true triangles' six-rib knot, and that knot cored, to scale.

Geometry (L1 final): skin 0.60; ribs 0.36 at the root, 1.80 deep, 0.5 deg draft per side; root fillets 0.24 (rib to skin, in
section); node fillets 0.22 (rib to rib, in plan). Kagome: two ribs cross at 60 deg. Triangles: three ribs (six arms) at 60 deg.
Cored knot: a round-ended core pin down the knot's axis to the skin's inner face (the skin stays 0.60 under it), its diameter
chosen so the ring wall left at its thinnest equals the rib (0.36): d = 2 (r_plan - 0.36).

Measures (the sink risk):
  plan circle: the largest circle inside the node's plan at the root (ribs + node fillets), 2D distance transform;
  junction ball: the largest ball inside the solid where the node meets the skin (skin + node + root fillets), 3D distance
  transform on a 0.01 mm grid; against the skin's own 0.60 and a single rib's root (0.36 rib, 0.24 fillets).
Output: out/nodes.json (+ out/nodes_sections.npz for drawing)."""
import json, time
import numpy as np
from scipy import ndimage
from shapely.geometry import LineString, Point, Polygon
from shapely.ops import unary_union
import shapely

T, W, H, DR, RR, RN = 0.60, 0.36, 1.80, 0.5, 0.24, 0.22
TAN = np.tan(np.radians(DR))
OUT = '/home/claude/work/l2/out'
CASES = {'kag': [0.0, 60.0], 'tri': [0.0, 60.0, 120.0], 'tri_cored': [0.0, 60.0, 120.0], 'rib': [0.0]}


def plan(lines_deg, hw, rn=RN, R=3.0):
    """ribs as full lines through the origin (half-width hw), closed by rn (node fillets): shapely polygon"""
    strips = [LineString([(-R * np.cos(np.radians(a)), -R * np.sin(np.radians(a))), (R * np.cos(np.radians(a)), R * np.sin(np.radians(a)))]).buffer(hw, cap_style='flat')
              for a in lines_deg]
    U = unary_union(strips)
    if rn > 0 and len(lines_deg) > 1:
        U = U.buffer(rn, join_style='round', quad_segs=32).buffer(-rn, join_style='round', quad_segs=32)
    return U.intersection(Point(0, 0).buffer(R - 0.5, 128))


def d_fillet(h, r=RR):
    """how far the root fillet reaches beyond the wall at height h above the skin's inner face"""
    h = np.asarray(h, float)
    return np.where((h >= 0) & (h < r), r - np.sqrt(np.clip(r * r - (r - h) ** 2, 0, None)), 0.0)


def hole_r(h, rh):
    """the core pin's hole radius at height h above the skin's inner face (round end: hemisphere, lowest point at h = 0)"""
    h = np.asarray(h, float)
    return np.where(h >= rh, rh, np.sqrt(np.clip(rh * rh - (rh - h) ** 2, 0, None)) * (h >= 0))


def solid_grid(case, rh=0.0, g=0.01, half=1.6, ytop=2.0):
    """voxel model: x, y in plan, v up from the outer face (skin 0..T, node above)"""
    xs = np.arange(-half, half + 1e-9, g); vs = np.arange(-0.04, ytop + 1e-9, g)
    X, Y = np.meshgrid(xs, xs, indexing='ij')
    S = np.zeros((len(xs), len(xs), len(vs)), bool)
    lines = CASES[case]
    cache = {}
    for k, v in enumerate(vs):
        if v < 0: continue
        if v <= T: S[:, :, k] = True; continue
        h = v - T
        hw = W / 2 - h * TAN
        key = round(hw, 4)
        if key not in cache:
            P = plan(lines, hw, RN if case != 'rib' else 0.0)
            cache[key] = P
        P = cache[key]
        df = float(d_fillet(h))
        geom = P.buffer(df, quad_segs=32) if df > 1e-6 else P
        m = shapely.contains_xy(geom, X.ravel(), Y.ravel()).reshape(X.shape)
        if rh > 0:
            m &= ~(X ** 2 + Y ** 2 < float(hole_r(h, rh)) ** 2)
        S[:, :, k] = m
    return S, xs, vs


def ball(case, rh=0.0, g=0.01):
    t0 = time.time()
    S, xs, vs = solid_grid(case, rh, g)
    D = ndimage.distance_transform_edt(S, sampling=g)
    i = np.unravel_index(np.argmax(D), D.shape)
    r = float(D[i])
    out = dict(case=case, D=2 * r, centre=[float(xs[i[0]]), float(xs[i[1]]), float(vs[i[2]])], grid=g, secs=round(time.time() - t0, 1))
    del D, S
    return out


def plan_circle(case, rh=0.0):
    P = plan(CASES[case], W / 2, RN if case != 'rib' else 0.0)
    if rh > 0: P = P.difference(Point(0, 0).buffer(rh, 128))
    # pole of inaccessibility (largest inscribed circle) by a fine distance transform of the plan
    g = 0.002; xs = np.arange(-1.4, 1.4 + 1e-9, g)
    X, Y = np.meshgrid(xs, xs, indexing='ij')
    m = shapely.contains_xy(P, X.ravel(), Y.ravel()).reshape(X.shape)
    D = ndimage.distance_transform_edt(m, sampling=g)
    i = np.unravel_index(np.argmax(D), D.shape)
    return dict(D=2 * float(D[i]), centre=[float(xs[i[0]]), float(xs[i[1]])])


if __name__ == '__main__':
    res = {}
    rp_tri = plan_circle('tri')['D'] / 2
    RH = rp_tri - W                    # the cored knot's hole radius: the ring wall at its thinnest = the rib
    for case in ('rib', 'kag', 'tri', 'tri_cored'):
        rh = RH if case == 'tri_cored' else 0.0
        pc = plan_circle(case, rh) if case != 'rib' else dict(D=W, centre=[0, 0])
        b = ball(case, rh)
        res[case] = dict(plan=pc, ball=b, hole_d=2 * rh)
        print(case, 'plan %.3f' % pc['D'], 'ball %.3f at %s' % (b['D'], np.round(b['centre'], 3)), b['secs'], 's', flush=True)
    res['hole_d'] = 2 * RH
    res['note'] = __doc__
    json.dump(res, open('%s/nodes.json' % OUT, 'w'), indent=1)
