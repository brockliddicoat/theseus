"""Body sections round the rim: for each z, the outer contour x(y) on +X from the base up to 14 mm; the widest point and its
height; the old crease (scan) and candidate straight lines; how much X the section loses if the rim's chamfer is carried up
to the line (a straight segment from the base edge to the wall at the line's height)."""
import sys, json, numpy as np
sys.path.insert(0, '/home/claude/theseus/3d/shell/tools')
import glbio
from scipy.ndimage import gaussian_filter1d
js, b = glbio.read('/home/claude/theseus/3d/shell/shell-theseus-1seam.glb'); _, d = glbio.mesh_arrays(js, b, 'body')
P = d['POSITION'].astype(float); T = d['indices'].reshape(-1, 3)
A, B, C = P[T[:, 0]], P[T[:, 1]], P[T[:, 2]]
def contour(z0, side=1):
    """the section's outer face on one wall as x(y), y 0.7..14: the exact intersection polyline, the largest X at each height"""
    from shapely.geometry import MultiLineString, LineString
    from shapely.ops import linemerge
    from scipy.ndimage import gaussian_filter1d
    dd = np.stack([A[:, 2], B[:, 2], C[:, 2]], 1) - z0
    m = (dd.min(1) < 0) & (dd.max(1) > 0); segs = []
    for a, bb, c, e in zip(A[m], B[m], C[m], dd[m]):
        pts = []
        for (p, q, dp, dq) in ((a, bb, e[0], e[1]), (bb, c, e[1], e[2]), (c, a, e[2], e[0])):
            if (dp < 0) != (dq < 0): t_ = dp / (dp - dq); pts.append((p + t_ * (q - p))[:2])
        if len(pts) == 2 and (pts[0][0] * side > 0 or pts[1][0] * side > 0): segs.append([(abs(pts[0][0]), pts[0][1]), (abs(pts[1][0]), pts[1][1])])
    ML = linemerge(MultiLineString(segs))
    ys = np.arange(0.7, 14.0, 0.05); xs = np.full(len(ys), np.nan)
    for i, y in enumerate(ys):
        I = ML.intersection(LineString([(-1, y), (80, y)]))
        if I.is_empty: continue
        gs = getattr(I, 'geoms', [I]); xx = [g.x for g in gs if g.geom_type == 'Point'] + [c_[0] for g in gs if g.geom_type == 'LineString' for c_ in g.coords]
        if xx: xs[i] = max(xx)
    ok = np.isfinite(xs); xs = np.interp(ys, ys[ok], xs[ok])
    return ys, xs
cr = json.load(open('/home/claude/work/s1/crease_side.json'))
z0, y0 = -59.58, 8.56
LINES = {'chord 0.0484': 0.0484, 'rms 0.0584': 0.0584}
out = {}
for z in [-55, -50, -45, -40, -35, -30, -25, -20, -15, -10, -5, 0, 10, 20, 30, 40, 50]:
    ys, xs = contour(z)
    w = np.argmax(xs); yc = np.interp(z, cr['z'], cr['y'])
    xb = xs[0]                                   # the contour's lowest point (the base edge, y 0.7)
    row = 'z %+4d  widest x %.2f at y %.2f | crease %.2f (x %.2f)' % (z, xs[w], ys[w], yc, np.interp(yc, ys, xs))
    for nm, s in LINES.items():
        yl = y0 - s * (z - z0)
        if yl > yc:
            # chamfer carried up: straight from (xs at the old crease's foot... base edge at y 0.7) to the wall at yl
            xl = np.interp(yl, ys, xs)
            seg = xb + (xl - xb) * (ys - ys[0]) / (yl - ys[0])
            lost = np.max(np.where(ys <= yl, xs - seg, 0)); newmax = max(xs[ys > yl].max(), xl)
            row += ' | %s: line %.2f, wall x %.2f, cut %.2f, outline %+.2f' % (nm, yl, xl, lost, newmax - xs.max())
        else:
            row += ' | %s: line %.2f (below the crease by %.2f)' % (nm, yl, yc - yl)
    print(row)
