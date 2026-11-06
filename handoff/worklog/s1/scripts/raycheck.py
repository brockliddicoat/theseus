"""Vertical-ray check of the floor ring + ledges: for each corner ledge, cast rays down (from above) and up (from below)
on a 0.05 mm grid over the ledge and its window; report samples where the first hit is not the ledge/ring face
(holes, cracks, poke-through)."""
import sys, json, numpy as np
sys.path.insert(0, '/home/claude/theseus/3d/shell/tools')
import glbio
from shapely.geometry import Point, LineString
fn = sys.argv[1] if len(sys.argv) > 1 else '/home/claude/work/s1/build/shell-s1.glb'
js, b = glbio.read(fn); _, d = glbio.mesh_arrays(js, b, 'body')
P = d['POSITION'].astype(float); T = d['indices'].reshape(-1, 3)
A = P[T]; cen = A.mean(1)
f_ = np.cross(A[:, 1] - A[:, 0], A[:, 2] - A[:, 0]); nrm = f_ / np.maximum(np.linalg.norm(f_, axis=1)[:, None], 1e-12)
meta = json.load(open(fn.replace('.glb', '.json')))

def hits(Q, At, down=True):
    a, bb, cc = At[:, 0][:, [0, 2]], At[:, 1][:, [0, 2]], At[:, 2][:, [0, 2]]
    v0 = bb - a; v1 = cc - a
    den = v0[:, 0] * v1[:, 1] - v1[:, 0] * v0[:, 1]
    res_y = np.full(len(Q), -np.inf if down else np.inf); res_i = np.full(len(Q), -1)
    for k in np.where(np.abs(den) > 1e-12)[0]:
        lo = np.minimum(np.minimum(a[k], bb[k]), cc[k]); hi = np.maximum(np.maximum(a[k], bb[k]), cc[k])
        m0 = np.all((Q >= lo - 1e-9) & (Q <= hi + 1e-9), axis=1)
        if not m0.any(): continue
        idx0 = np.where(m0)[0]; w = Q[idx0] - a[k]
        l1 = (w[:, 0] * v1[k, 1] - v1[k, 0] * w[:, 1]) / den[k]; l2 = (v0[k, 0] * w[:, 1] - w[:, 0] * v0[k, 1]) / den[k]
        m = (l1 >= -1e-9) & (l2 >= -1e-9) & (l1 + l2 <= 1 + 1e-9)
        if not m.any(): continue
        y = At[k, 0, 1] + l1[m] * (At[k, 1, 1] - At[k, 0, 1]) + l2[m] * (At[k, 2, 1] - At[k, 0, 1])
        idx = idx0[m]
        better = (y > res_y[idx]) if down else (y < res_y[idx])
        res_y[idx[better]] = y[better]; res_i[idx[better]] = k
    return res_y, res_i

from shapely.geometry import Polygon
from shapely.ops import unary_union
def union_sel(m):
    g = unary_union([Polygon(t[:, [0, 2]]).buffer(1e-4, join_style=2) for t in A[m] if Polygon(t[:, [0, 2]]).area > 1e-10]).buffer(-1e-4, join_style=2)
    return g
isb = (nrm[:, 1] < -0.9) & (A[:, :, 1].max(1) < 0.7)
ist = (nrm[:, 1] > 0.9) & (A[:, :, 1].min(1) > 1.7) & (A[:, :, 1].max(1) < 2.0)
Rb = union_sel(isb); foot = Rb.buffer(3.0).buffer(-3.0); foot = max(foot.geoms, key=lambda g: g.area) if foot.geom_type != 'Polygon' else foot; foot = Polygon(foot.exterior)
Rt = union_sel(ist).buffer(0.05).buffer(-0.05); Rt = max(Rt.geoms, key=lambda g: g.area) if Rt.geom_type != 'Polygon' else Rt
top_outer = Polygon(Rt.exterior)
from shapely import contains_xy
tot_bad = 0
for L in (meta['ledges']['items'] if 'ledges' in meta else json.load(open('/home/claude/work/s1/build/shell-s1.json'))['ledges']['items']):
    c = np.array(L['c']); u = np.array(L['u'])
    sel = (np.linalg.norm(cen[:, [0, 2]] - c, axis=1) < 18) & (A[:, :, 1].max(1) < 2.6)     # the floor's faces only (below the wall's overhang)
    At, nt = A[sel], nrm[sel]
    xs = np.arange(c[0] - 14, c[0] + 14, 0.05); zs = np.arange(c[1] - 10, c[1] + 10, 0.05)
    X, Z = np.meshgrid(xs, zs); Q = np.c_[X.ravel(), Z.ravel()]
    pill = LineString([c - u * 6.25, c + u * 6.25]).buffer(4.25)
    MODE = sys.argv[2] if len(sys.argv) > 2 else 'inner'
    region = pill.intersection(top_outer.buffer(-0.12)) if MODE == 'inner' else pill.buffer(3.0).intersection(top_outer.buffer(0.5).difference(top_outer.buffer(-0.12)))
    inP = contains_xy(region, Q[:, 0], Q[:, 1])
    Q = Q[inP]
    yd, idd = hits(Q, At, True)
    yu, idu = hits(Q, At, False)
    # from above the first hit must be an up-facing face at the ring top (1.85) or the wall's lower fillet (y < 2.6, facing up-ish)
    if MODE == 'inner':
        bad_top = (idd < 0) | (nt[idd.clip(0)][:, 1] < 0.9) | (np.abs(yd - 1.85) > 0.16)
        bad_bot = (idu < 0) | (nt[idu.clip(0)][:, 1] > -0.9) | (np.abs(yu - 0.65) > 0.06)
    else:   # the junction with the wall: from above the first hit must be at or above the ring top
        bad_top = (idd < 0) | (yd < 1.84)
        bad_bot = np.zeros(len(Q), bool)
    print('ledge c=(%.1f, %.1f): samples %d  from above: bad %d (y range %.3f..%.3f)  from below: bad %d (y range %.3f..%.3f)' % (
        c[0], c[1], len(Q), bad_top.sum(), yd[np.isfinite(yd)].min(), yd[np.isfinite(yd)].max(), bad_bot.sum(), yu[np.isfinite(yu)].min(), yu[np.isfinite(yu)].max()))
    for nm, bad, yy, ii in (('top', bad_top, yd, idd), ('bottom', bad_bot, yu, idu)):
        if bad.sum():
            q = Q[bad]
            print('   %s bad at x %.2f..%.2f z %.2f..%.2f, e.g.' % (nm, q[:, 0].min(), q[:, 0].max(), q[:, 1].min(), q[:, 1].max()), [(round(a_, 2), round(b_, 2), round(float(y_), 3)) for (a_, b_), y_ in zip(q[:6], yy[bad][:6])])
    tot_bad += bad_top.sum() + bad_bot.sum()
print('total bad', tot_bad)
