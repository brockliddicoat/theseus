"""A small stand-in for the parts of shapely the PCB tools use (see README.md).

Geometry is vector in and vector out. Points, boxes, circles (Point.buffer), polygons from coordinates and the affine
transforms stay exact. Booleans and buffers are computed on a signed-distance grid: each operand's distance to its own
boundary is computed exactly (point to segment, with the inside/outside sign from the nearest feature) in a narrow band
round its boundary, the fields are combined (min = union, max = intersection, max(a, -b) = difference, minus r = buffer),
and the zero level is traced back to rings with marching squares and simplified. Joins are always round (a mitre
buffer is drawn round). Grid step H (mm, env SHIM_H, default 0.01) and ring tolerance TOL (env SHIM_TOL, 0.002).
"""
import math, os
import numpy as np
import cv2
from skimage import measure

H = float(os.environ.get('SHIM_H', '0.01'))
TOL = float(os.environ.get('SHIM_TOL', '0.002'))
BIG = np.float32(1e4)
LMAX = 0.4                    # long segments are split into pieces this long (small windows)
O = 0.37 * H                  # grid points sit at i*H + O: off the round numbers CAD coordinates are made of


# ------------------------------------------------------------------ ring helpers
def _arr(coords):
    a = np.asarray([tuple(c)[:2] for c in coords] if not isinstance(coords, np.ndarray) else coords, float).reshape(-1, 2)
    if len(a) > 1 and np.allclose(a[0], a[-1], atol=1e-12, rtol=0):
        a = a[:-1]
    if len(a) > 1:
        keep = np.r_[True, np.any(np.abs(np.diff(a, axis=0)) > 1e-12, axis=1)]
        a = a[keep]
        if len(a) > 1 and np.allclose(a[0], a[-1], atol=1e-12, rtol=0):
            a = a[:-1]
    return a


def _sarea(r):
    if len(r) < 3:
        return 0.0
    x, y = r[:, 0], r[:, 1]
    return 0.5 * float(np.dot(x, np.roll(y, -1)) - np.dot(np.roll(x, -1), y))


def _orient(r, ccw=True):
    return r if ((_sarea(r) >= 0) == ccw) else r[::-1].copy()


def _closed(r):
    return np.vstack([r, r[:1]]) if len(r) else r


# ------------------------------------------------------------------ geometry classes
class BaseGeometry:
    geom_type = 'Geometry'

    # -- set operations
    def union(self, other):
        return _union([self, other])

    def difference(self, other):
        return _difference(self, other)

    def intersection(self, other):
        return _intersection(self, other)

    def symmetric_difference(self, other):
        return _union([_difference(self, other), _difference(other, self)])

    def buffer(self, distance, quad_segs=16, cap_style=1, join_style=1, mitre_limit=5.0, resolution=None, **kw):
        return _buffer(self, float(distance), _cap(cap_style), int(resolution or quad_segs))

    def simplify(self, tolerance, preserve_topology=True):
        return self

    # -- predicates
    def intersects(self, other):
        return _intersects(self, other)

    def disjoint(self, other):
        return not _intersects(self, other)

    def contains(self, other):
        return _contains(self, other)

    def covers(self, other):
        return _contains(self, other)

    def within(self, other):
        return _contains(other, self)

    def distance(self, other):
        return _distance(self, other)

    # -- measures
    @property
    def envelope(self):
        if self.is_empty:
            return Polygon()
        x0, y0, x1, y1 = self.bounds
        return box(x0, y0, x1, y1)

    @property
    def minimum_rotated_rectangle(self):
        pts = _all_points(self)
        if len(pts) < 3:
            return self.envelope
        from scipy.spatial import ConvexHull
        try:
            hull = pts[ConvexHull(pts).vertices]
        except Exception:
            return self.envelope
        best = None
        for i in range(len(hull)):
            e = hull[(i + 1) % len(hull)] - hull[i]
            L = math.hypot(*e)
            if L < 1e-12:
                continue
            u = e / L; v = np.array([-u[1], u[0]])
            a, b = hull @ u, hull @ v
            area = (a.max() - a.min()) * (b.max() - b.min())
            if best is None or area < best[0]:
                best = (area, u, v, a.min(), a.max(), b.min(), b.max())
        _, u, v, a0, a1, b0, b1 = best
        cs = [a0 * u + b0 * v, a1 * u + b0 * v, a1 * u + b1 * v, a0 * u + b1 * v]
        return Polygon(cs)

    @property
    def convex_hull(self):
        pts = _all_points(self)
        from scipy.spatial import ConvexHull
        return Polygon(pts[ConvexHull(pts).vertices])

    def representative_point(self):
        ps = _polys_of(self)
        if not ps:
            return Point(*self.centroid.coords[0]) if not self.is_empty else Point()
        p = max(ps, key=lambda q: q.area)
        c = p.centroid
        if _pip_geom(p, np.array([[c.x, c.y]]))[0] and _bdist(p, np.array([[c.x, c.y]]))[0] > H:
            return c
        G = _grid_for(p.bounds, 2 * H)
        D = _sdf(p, G, 1e9)
        r, cc = np.unravel_index(np.argmin(D), D.shape)
        return Point((G[0] + cc) * H + O, (G[1] + r) * H + O)

    @property
    def is_valid(self):
        return True

    def __repr__(self):
        return '<%s%s>' % (self.geom_type, ' EMPTY' if self.is_empty else ' %s' % (tuple(round(v, 3) for v in self.bounds),))


class Point(BaseGeometry):
    geom_type = 'Point'

    def __init__(self, *args):
        if len(args) == 0:
            self._c = None
        elif len(args) == 1:
            a = args[0]
            if isinstance(a, Point):
                self._c = a._c
            else:
                a = tuple(a)
                self._c = (float(a[0]), float(a[1])) if len(a) else None
        else:
            self._c = (float(args[0]), float(args[1]))

    @property
    def is_empty(self):
        return self._c is None

    @property
    def x(self):
        return self._c[0]

    @property
    def y(self):
        return self._c[1]

    @property
    def coords(self):
        return [] if self._c is None else [self._c]

    @property
    def bounds(self):
        return (self._c[0], self._c[1], self._c[0], self._c[1])

    area = 0.0
    length = 0.0

    @property
    def centroid(self):
        return self

    def buffer(self, distance, quad_segs=16, cap_style=1, join_style=1, mitre_limit=5.0, resolution=None, **kw):
        n = 4 * int(resolution or quad_segs)
        r = float(distance)
        if r <= 0 or self.is_empty:
            return Polygon()
        a = np.arange(n) * (2 * math.pi / n)
        p = Polygon(np.c_[self._c[0] + r * np.cos(a), self._c[1] + r * np.sin(a)])
        p._circle = (self._c[0], self._c[1], r * math.cos(math.pi / n))     # inscribed radius of the polygon
        return p


class LineString(BaseGeometry):
    geom_type = 'LineString'
    _closed = False

    def __init__(self, coords=None):
        if coords is None:
            self._a = np.zeros((0, 2))
        else:
            a = np.asarray([tuple(c)[:2] for c in (coords.coords if isinstance(coords, BaseGeometry) else coords)], float).reshape(-1, 2)
            self._a = a

    @property
    def is_empty(self):
        return len(self._a) == 0

    @property
    def coords(self):
        return [tuple(p) for p in self._a]

    @property
    def xy(self):
        return self._a[:, 0], self._a[:, 1]

    @property
    def bounds(self):
        return (*self._a.min(0), *self._a.max(0))

    @property
    def length(self):
        return float(np.linalg.norm(np.diff(self._a, axis=0), axis=1).sum()) if len(self._a) > 1 else 0.0

    area = 0.0

    @property
    def centroid(self):
        a = self._a
        if len(a) < 2:
            return Point(a[0]) if len(a) else Point()
        m = (a[1:] + a[:-1]) / 2; w = np.linalg.norm(np.diff(a, axis=0), axis=1)
        return Point(*(m * w[:, None]).sum(0) / max(w.sum(), 1e-12))

    def interpolate(self, distance, normalized=False):
        a = self._a
        seg = np.linalg.norm(np.diff(a, axis=0), axis=1)
        L = seg.sum()
        d = distance * L if normalized else distance
        if d < 0:
            d += L
        d = min(max(d, 0.0), L)
        cum = np.r_[0, np.cumsum(seg)]
        i = int(np.searchsorted(cum, d, side='right') - 1)
        i = min(max(i, 0), len(seg) - 1)
        t = (d - cum[i]) / max(seg[i], 1e-12)
        p = a[i] + t * (a[i + 1] - a[i])
        return Point(p[0], p[1])

    def project(self, other, normalized=False):
        p = np.array(other.coords[0]); a = self._a
        best = (1e18, 0.0); cum = 0.0
        for i in range(len(a) - 1):
            d = a[i + 1] - a[i]; L = math.hypot(*d)
            t = 0.0 if L < 1e-12 else min(max(np.dot(p - a[i], d) / (L * L), 0), 1)
            q = a[i] + t * d; dd = math.hypot(*(p - q))
            if dd < best[0]:
                best = (dd, cum + t * L)
            cum += L
        return best[1] / cum if normalized and cum > 0 else best[1]


class LinearRing(LineString):
    geom_type = 'LinearRing'
    _closed = True

    def __init__(self, coords=None):
        super().__init__(coords)
        if len(self._a) and not np.allclose(self._a[0], self._a[-1]):
            self._a = np.vstack([self._a, self._a[:1]])

    @property
    def is_ccw(self):
        return _sarea(self._a[:-1]) > 0


class Polygon(BaseGeometry):
    geom_type = 'Polygon'
    _circle = None

    def __init__(self, shell=None, holes=None):
        if shell is None:
            self._ext = None; self._holes = []
            return
        if isinstance(shell, Polygon):
            self._ext, self._holes = shell._ext, list(shell._holes)
            return
        if isinstance(shell, BaseGeometry):
            shell = shell.coords
        e = _arr(shell)
        if len(e) < 3:
            self._ext = None; self._holes = []
            return
        self._ext = _orient(e, True)
        hs = []
        for h in (holes or []):
            if isinstance(h, BaseGeometry):
                h = h.coords
            h = _arr(h)
            if len(h) >= 3:
                hs.append(_orient(h, False))
        self._holes = hs

    @classmethod
    def _from(cls, ext, holes):
        p = cls.__new__(cls)
        p._ext, p._holes = ext, holes
        return p

    @property
    def is_empty(self):
        return self._ext is None

    @property
    def exterior(self):
        return LinearRing(_closed(self._ext)) if self._ext is not None else LinearRing()

    @property
    def interiors(self):
        return [LinearRing(_closed(h)) for h in self._holes]

    @property
    def coords(self):
        raise NotImplementedError('Polygon has no coords; use exterior.coords')

    @property
    def bounds(self):
        if self._ext is None:
            return (math.nan,) * 4
        return (*self._ext.min(0), *self._ext.max(0))

    @property
    def area(self):
        if self._ext is None:
            return 0.0
        return _sarea(self._ext) + sum(_sarea(h) for h in self._holes)

    @property
    def length(self):
        if self._ext is None:
            return 0.0
        return sum(float(np.linalg.norm(np.diff(_closed(r), axis=0), axis=1).sum()) for r in [self._ext] + self._holes)

    @property
    def centroid(self):
        if self._ext is None:
            return Point()
        A = 0.0; cx = 0.0; cy = 0.0
        for r in [self._ext] + self._holes:
            x, y = r[:, 0], r[:, 1]; x1, y1 = np.roll(x, -1), np.roll(y, -1)
            cr = x * y1 - x1 * y
            A += cr.sum() / 2; cx += ((x + x1) * cr).sum() / 6; cy += ((y + y1) * cr).sum() / 6
        if abs(A) < 1e-15:
            return Point(*self._ext.mean(0))
        return Point(cx / A, cy / A)

    def rings(self):
        return [] if self._ext is None else [self._ext] + self._holes

    def buffer(self, distance, quad_segs=16, cap_style=1, join_style=1, mitre_limit=5.0, resolution=None, **kw):
        if float(distance) == 0.0 and not self.is_empty:
            return Polygon._from(self._ext.copy(), [h.copy() for h in self._holes])
        return super().buffer(distance, quad_segs, cap_style, join_style, mitre_limit, resolution)

    def simplify(self, tolerance, preserve_topology=True):
        if self._ext is None:
            return self
        e = _dp(self._ext, tolerance)
        if len(e) < 3:
            return Polygon()
        hs = [h2 for h2 in (_dp(h, tolerance) for h in self._holes) if len(h2) >= 3]
        return Polygon._from(e, hs)


class _Multi(BaseGeometry):
    def __init__(self, geoms=None):
        gs = []
        for g in (geoms or []):
            if g is None:
                continue
            if isinstance(g, BaseGeometry):
                if g.is_empty:
                    continue
                gs.append(g)
            else:
                gs.append(self._item(g))
        self._g = gs

    def _item(self, g):
        return Polygon(g)

    @property
    def geoms(self):
        return list(self._g)

    def __iter__(self):
        return iter(self._g)

    def __len__(self):
        return len(self._g)

    @property
    def is_empty(self):
        return len(self._g) == 0

    @property
    def bounds(self):
        if not self._g:
            return (math.nan,) * 4
        b = np.array([g.bounds for g in self._g])
        return (b[:, 0].min(), b[:, 1].min(), b[:, 2].max(), b[:, 3].max())

    @property
    def area(self):
        return sum(g.area for g in self._g)

    @property
    def length(self):
        return sum(g.length for g in self._g)

    @property
    def centroid(self):
        ps = [g for g in self._g if g.area > 0]
        if ps:
            A = sum(g.area for g in ps)
            return Point(sum(g.centroid.x * g.area for g in ps) / A, sum(g.centroid.y * g.area for g in ps) / A)
        if self._g:
            return self._g[0].centroid
        return Point()

    def simplify(self, tolerance, preserve_topology=True):
        return type(self)([g.simplify(tolerance) for g in self._g])


class MultiPolygon(_Multi):
    geom_type = 'MultiPolygon'

    def _item(self, g):
        if isinstance(g, (tuple, list)) and len(g) == 2 and not np.isscalar(g[0]) and len(np.shape(g[0])) == 2:
            return Polygon(g[0], g[1])
        return Polygon(g)


class MultiLineString(_Multi):
    geom_type = 'MultiLineString'

    def _item(self, g):
        return LineString(g)


class MultiPoint(_Multi):
    geom_type = 'MultiPoint'

    def _item(self, g):
        return Point(g)


class GeometryCollection(_Multi):
    geom_type = 'GeometryCollection'


def box(minx, miny, maxx, maxy, ccw=True):
    return Polygon([(maxx, miny), (maxx, maxy), (minx, maxy), (minx, miny)])


def orient(polygon, sign=1.0):
    if polygon.is_empty:
        return polygon
    if sign >= 0:
        return Polygon._from(polygon._ext, list(polygon._holes))
    return Polygon._from(polygon._ext[::-1].copy(), [h[::-1].copy() for h in polygon._holes])


# ------------------------------------------------------------------ flatteners
def _polys_of(g):
    if g is None or g.is_empty:
        return []
    if isinstance(g, Polygon):
        return [g]
    if isinstance(g, _Multi):
        out = []
        for x in g._g:
            out += _polys_of(x)
        return out
    return []


def _lines_of(g):
    if g is None or g.is_empty:
        return []
    if isinstance(g, LineString):
        return [g]
    if isinstance(g, _Multi):
        out = []
        for x in g._g:
            out += _lines_of(x)
        return out
    return []


def _points_of(g):
    if g is None or g.is_empty:
        return []
    if isinstance(g, Point):
        return [g]
    if isinstance(g, _Multi):
        out = []
        for x in g._g:
            out += _points_of(x)
        return out
    return []


def _all_points(g):
    pts = []
    for p in _polys_of(g):
        pts += [p._ext] + p._holes
    for l in _lines_of(g):
        pts.append(l._a)
    for q in _points_of(g):
        pts.append(np.array([q._c]))
    return np.vstack(pts) if pts else np.zeros((0, 2))


def _result(polys):
    polys = [p for p in polys if p is not None and not p.is_empty]
    if not polys:
        return Polygon()
    if len(polys) == 1:
        return polys[0]
    return MultiPolygon(polys)


def _bb_overlap(a, b, m=0.0):
    return not (a[2] + m < b[0] or b[2] + m < a[0] or a[3] + m < b[1] or b[3] + m < a[1])


# ------------------------------------------------------------------ segment tables (cached per polygon)
def _segtab(p):
    """pieces of every ring of polygon p: a (n,2), b (n,2), vertex class at a and at b (+1 convex, -1 reflex, 0 none)"""
    t = getattr(p, '_seg', None)
    if t is not None:
        return t
    A, B, CA, CB = [], [], [], []
    for r in p.rings():
        n = len(r)
        prv, nxt = np.roll(r, 1, axis=0), np.roll(r, -1, axis=0)
        ein, eout = r - prv, nxt - r
        cr = ein[:, 0] * eout[:, 1] - ein[:, 1] * eout[:, 0]
        sc = np.linalg.norm(ein, axis=1) * np.linalg.norm(eout, axis=1)
        cls = np.where(cr > 1e-9 * sc, 1, np.where(cr < -1e-9 * sc, -1, 0))
        for i in range(n):
            a, b = r[i], nxt[i]
            L = math.hypot(b[0] - a[0], b[1] - a[1])
            k = max(1, int(math.ceil(L / LMAX)))
            if k == 1:
                A.append(a); B.append(b); CA.append(cls[i]); CB.append(cls[(i + 1) % n])
            else:
                ts = np.linspace(0, 1, k + 1)
                pts = a[None, :] + ts[:, None] * (b - a)[None, :]
                for j in range(k):
                    A.append(pts[j]); B.append(pts[j + 1])
                    CA.append(cls[i] if j == 0 else 0); CB.append(cls[(i + 1) % n] if j == k - 1 else 0)
    if A:
        A, B = np.array(A), np.array(B)
        t = (A, B, np.array(CA), np.array(CB), np.minimum(A, B), np.maximum(A, B))
    else:
        z = np.zeros((0, 2))
        t = (z, z, np.zeros(0, int), np.zeros(0, int), z, z)
    p._seg = t
    return t


# ------------------------------------------------------------------ the grid
def _grid_for(bounds, margin):
    x0, y0, x1, y1 = bounds
    i0 = int(math.floor((x0 - margin - O) / H)); i1 = int(math.ceil((x1 + margin - O) / H))
    j0 = int(math.floor((y0 - margin - O) / H)); j1 = int(math.ceil((y1 + margin - O) / H))
    return (i0, j0, i1 - i0 + 1, j1 - j0 + 1)


def _win(G, lo, hi):
    """index window (r0, r1, c0, c1) of grid G covering the box lo..hi; None if outside"""
    i0, j0, nx, ny = G
    c0 = max(0, int(math.floor((lo[0] - O) / H)) - i0); c1 = min(nx, int(math.ceil((hi[0] - O) / H)) - i0 + 1)
    r0 = max(0, int(math.floor((lo[1] - O) / H)) - j0); r1 = min(ny, int(math.ceil((hi[1] - O) / H)) - j0 + 1)
    if c0 >= c1 or r0 >= r1:
        return None
    return r0, r1, c0, c1


def _fill(p, G, out, r0=0, c0=0):
    """far-field inside mask of polygon p into out (uint8), the window starting at row r0, col c0 of grid G"""
    i0, j0 = G[0] + c0, G[1] + r0
    pts = [np.round((r - np.array([i0 * H + O, j0 * H + O])) / H * 256).astype(np.int64).astype(np.int32).reshape(-1, 1, 2) for r in p.rings()]
    if pts:
        tmp = np.zeros_like(out)
        cv2.fillPoly(tmp, pts, 1, lineType=cv2.LINE_8, shift=8)
        np.maximum(out, tmp, out=out)


def _poly_sdf_into(D, G, p, band, r0=0, r1=None, c0=0, c1=None):
    """signed distance of polygon p (negative inside), exact within `band`, folded into D (D = min(D, sdf_p))
    over the window rows r0..r1, cols c0..c1 of grid G (D is that window)."""
    r1 = D.shape[0] + r0 if r1 is None else r1; c1 = D.shape[1] + c0 if c1 is None else c1
    i0, j0 = G[0] + c0, G[1] + r0
    lo = np.array([i0 * H + O, j0 * H + O]); hi = np.array([(G[0] + c1 - 1) * H + O, (G[1] + r1 - 1) * H + O])
    x0, y0, x1, y1 = p.bounds
    if x1 + band < lo[0] or x0 - band > hi[0] or y1 + band < lo[1] or y0 - band > hi[1]:
        return
    ins = np.zeros(D.shape, np.uint8)
    _fill(p, G, ins, r0, c0)
    P = np.where(ins > 0, -BIG, BIG).astype(np.float32)
    best = np.full(D.shape, np.inf, np.float32)
    A, B, CA, CB, mn, mx = _segtab(p)
    sel = np.nonzero((mx[:, 0] + band >= lo[0]) & (mn[:, 0] - band <= hi[0]) & (mx[:, 1] + band >= lo[1]) & (mn[:, 1] - band <= hi[1]))[0]
    G2 = (i0, j0, c1 - c0, r1 - r0)
    for k in sel:
        a, b = A[k], B[k]
        w = _win(G2, np.minimum(a, b) - band, np.maximum(a, b) + band)
        if w is None:
            continue
        wr0, wr1, wc0, wc1 = w
        X = (i0 + np.arange(wc0, wc1)) * H + O - a[0]
        Y = (j0 + np.arange(wr0, wr1)) * H + O - a[1]
        dx, dy = b[0] - a[0], b[1] - a[1]
        L2 = dx * dx + dy * dy
        px = X[None, :]; py = Y[:, None]
        t = (px * dx + py * dy) / L2 if L2 > 0 else np.zeros((len(Y), len(X)))
        tc = np.clip(t, 0.0, 1.0)
        qx = px - tc * dx; qy = py - tc * dy
        dist = np.sqrt(qx * qx + qy * qy).astype(np.float32)
        side = (dx * py - dy * px) > 0
        inside = side
        if CA[k] != 0:
            inside = np.where(t <= 0, CA[k] < 0, inside)
        if CB[k] != 0:
            inside = np.where(t >= 1, CB[k] < 0, inside)
        bw = best[wr0:wr1, wc0:wc1]
        upd = dist < bw
        if not upd.any():
            continue
        bw[upd] = dist[upd]
        sd = np.where(inside, -dist, dist)
        pw = P[wr0:wr1, wc0:wc1]
        m2 = upd & (dist <= band)
        pw[m2] = sd[m2]
    np.minimum(D, P, out=D)


def _line_sdf_into(D, G, line, r, band, cap):
    """signed distance of a polyline (or closed ring) buffered by r: round joins, round or flat ends (a flat end is the
    exact distance to the end line, so the end sits where it should), exact within band, folded into D (min)."""
    a_ = line._a
    if len(a_) == 0:
        return
    closed = isinstance(line, LinearRing) or (len(a_) > 2 and np.allclose(a_[0], a_[-1]))
    if len(a_) == 1:
        a_ = np.vstack([a_, a_])
    segs = list(zip(a_[:-1], a_[1:]))
    i0, j0 = G[0], G[1]
    n = len(segs)
    flat = (not closed) and cap in (2, 3)
    for k, (a, b) in enumerate(segs):
        L = math.hypot(b[0] - a[0], b[1] - a[1])
        pieces = max(1, int(math.ceil(L / LMAX)))
        for j in range(pieces):
            pa = a + (b - a) * (j / pieces); pb = a + (b - a) * ((j + 1) / pieces)
            w = _win(G, np.minimum(pa, pb) - band, np.maximum(pa, pb) + band)
            if w is None:
                continue
            wr0, wr1, wc0, wc1 = w
            X = (i0 + np.arange(wc0, wc1)) * H + O - pa[0]
            Y = (j0 + np.arange(wr0, wr1)) * H + O - pa[1]
            dx, dy = pb[0] - pa[0], pb[1] - pa[1]
            L2 = dx * dx + dy * dy
            Lp = math.sqrt(L2)
            px = X[None, :]; py = Y[:, None]
            t = (px * dx + py * dy) / L2 if L2 > 0 else np.zeros((len(Y), len(X)))
            tc = np.clip(t, 0.0, 1.0)
            qx = px - tc * dx; qy = py - tc * dy
            d = (np.sqrt(qx * qx + qy * qy) - r).astype(np.float32)
            # behind a piece's start or past its end belongs to the neighbouring piece of the same segment
            if j > 0:
                d = np.where(t < 0, np.float32(np.inf), d)
            if j < pieces - 1:
                d = np.where(t > 1, np.float32(np.inf), d)
            if flat and Lp > 0 and ((k == 0 and j == 0) or (k == n - 1 and j == pieces - 1)):
                perp = np.abs(dx * py - dy * px) / Lp - r
                if k == 0 and j == 0:
                    al = -t * Lp                                  # distance behind the start line (+ outside)
                    cap_d = np.where(perp <= 0, al, np.sqrt(al * al + perp * perp))
                    d = np.where(t < 0, cap_d, np.where(d < 0, np.maximum(d, al), d)).astype(np.float32)
                if k == n - 1 and j == pieces - 1:
                    al = (t - 1) * Lp                             # distance past the end line
                    cap_d = np.where(perp <= 0, al, np.sqrt(al * al + perp * perp))
                    d = np.where(t > 1, cap_d, np.where(d < 0, np.maximum(d, al), d)).astype(np.float32)
            dw = D[wr0:wr1, wc0:wc1]
            np.minimum(dw, d, out=dw)


def _sdf(g, G, band):
    """signed distance field of polygonal geometry g on grid G (union of its polygons)"""
    i0, j0, nx, ny = G
    D = np.full((ny, nx), BIG, np.float32)
    for p in _polys_of(g):
        w = _win(G, np.array(p.bounds[:2]) - band - H, np.array(p.bounds[2:]) + band + H)
        if w is None:
            continue
        r0, r1, c0, c1 = w
        sub = D[r0:r1, c0:c1]
        _poly_sdf_into(sub, G, p, band, r0, r1, c0, c1)
    return D


# ------------------------------------------------------------------ contours back to polygons
def _dp(r, tol):
    if len(r) < 4 or tol <= 0:
        return r
    c = cv2.approxPolyDP(r.astype(np.float32).reshape(-1, 1, 2), float(tol), True).reshape(-1, 2).astype(float)
    return c


def _contour(D, G, tol=None):
    tol = TOL if tol is None else tol
    i0, j0, nx, ny = G
    Dp = np.pad(D, 1, constant_values=BIG)
    Dp[Dp == 0] = np.float32(1e-6 * H)       # no level-set vertex exactly on a grid point (boundaries on grid lines)
    neg = (Dp < 0)
    if not neg.any():
        return Polygon()
    cs = measure.find_contours(Dp, 0.0, fully_connected='low', positive_orientation='low')
    if not cs:
        return Polygon()
    n, lab = cv2.connectedComponents(neg.astype(np.uint8), connectivity=8)
    groups = {}
    for c in cs:
        if len(c) < 4:
            continue
        # the label of the solid on the inside of this ring: a negative grid point next to one of its vertices
        L = 0
        for v in c[:: max(1, len(c) // 8)]:
            r, q = v
            for rr, qq in ((math.floor(r), math.floor(q)), (math.ceil(r), math.ceil(q)), (math.floor(r), math.ceil(q)), (math.ceil(r), math.floor(q)),
                           (round(r) - 1, round(q)), (round(r) + 1, round(q)), (round(r), round(q) - 1), (round(r), round(q) + 1)):
                if 0 <= rr < Dp.shape[0] and 0 <= qq < Dp.shape[1] and neg[rr, qq]:
                    L = lab[rr, qq]
                    break
            if L:
                break
        if not L:
            continue
        xy = np.c_[(i0 + c[:, 1] - 1) * H + O, (j0 + c[:, 0] - 1) * H + O]
        xy = _arr(xy)
        if len(xy) < 3:
            continue
        a = _sarea(xy)
        if abs(a) < 1.5 * H * H:
            continue
        groups.setdefault(L, []).append((a, xy))
    out = []
    for L, rings in groups.items():
        rings.sort(key=lambda t: -abs(t[0]))
        ext = rings[0][1]
        e = _dp(_orient(ext, True), tol)
        if len(e) < 3:
            continue
        hs = []
        for a, r in rings[1:]:
            h2 = _dp(_orient(r, False), tol)
            if len(h2) >= 3 and abs(_sarea(h2)) > 1.5 * H * H:
                hs.append(h2)
        out.append(Polygon._from(e, hs))
    return _result(out)


# ------------------------------------------------------------------ operations
def _cap(c):
    if isinstance(c, str):
        return {'round': 1, 'flat': 2, 'square': 3}[c]
    return int(getattr(c, 'value', c))


def _components(geoms, m):
    """group geometries whose (grown) boxes overlap; returns lists of indices"""
    n = len(geoms)
    if n == 0:
        return []
    b = np.array([g.bounds for g in geoms])
    order = np.argsort(b[:, 0])
    parent = list(range(n))

    def f(a):
        while parent[a] != a:
            parent[a] = parent[parent[a]]; a = parent[a]
        return a
    active = []
    for i in order:
        x0 = b[i, 0] - m
        active = [j for j in active if b[j, 2] + m >= x0]
        for j in active:
            if _bb_overlap(b[i], b[j], m):
                ri, rj = f(i), f(j)
                if ri != rj:
                    parent[ri] = rj
        active.append(i)
    groups = {}
    for i in range(n):
        groups.setdefault(f(i), []).append(i)
    return list(groups.values())


def _union(gs):
    polys = []
    for g in gs:
        polys += _polys_of(g)
    polys = [p for p in polys if p.area > 1e-12]
    if not polys:
        return Polygon()
    out = []
    for grp in _components(polys, 2 * H):
        if len(grp) == 1:
            out.append(polys[grp[0]])
            continue
        sub = [polys[i] for i in grp]
        bb = np.array([p.bounds for p in sub])
        G = _grid_for((bb[:, 0].min(), bb[:, 1].min(), bb[:, 2].max(), bb[:, 3].max()), 4 * H)
        D = _sdf(MultiPolygon(sub), G, 3 * H)
        out += _polys_of(_contour(D, G))
    return _result(out)


def _difference(a, b):
    pa = _polys_of(a)
    if not pa:
        return Polygon()
    pb = _polys_of(b)
    if not pb:
        return _result(pa)
    out = []
    bbs = np.array([q.bounds for q in pb])
    for p in pa:
        pbx = p.bounds
        hit = [pb[i] for i in np.nonzero((bbs[:, 0] <= pbx[2] + H) & (bbs[:, 2] >= pbx[0] - H) & (bbs[:, 1] <= pbx[3] + H) & (bbs[:, 3] >= pbx[1] - H))[0]]
        if not hit:
            out.append(p)
            continue
        G = _grid_for(pbx, 4 * H)
        DA = _sdf(p, G, 3 * H)
        DB = _sdf(MultiPolygon(hit), G, 3 * H)
        np.maximum(DA, -DB, out=DA)
        out += _polys_of(_contour(DA, G))
    return _result(out)


def _intersection(a, b):
    pa, pb = _polys_of(a), _polys_of(b)
    if not pa or not pb:
        if _lines_of(a) and pb:
            return a          # only used for bounds-like checks
        return Polygon()
    ba, bb = a.bounds, b.bounds
    if not _bb_overlap(ba, bb):
        return Polygon()
    lo = (max(ba[0], bb[0]), max(ba[1], bb[1]), min(ba[2], bb[2]), min(ba[3], bb[3]))
    G = _grid_for(lo, 4 * H)
    DA = _sdf(a, G, 3 * H)
    DB = _sdf(b, G, 3 * H)
    np.maximum(DA, DB, out=DA)
    return _contour(DA, G)


def _buffer(g, r, cap, quad_segs):
    if g.is_empty:
        return Polygon()
    band = abs(r) + 3 * H
    pts, lines, polys = _points_of(g), _lines_of(g), _polys_of(g)
    if r <= 0 and not polys:
        return Polygon()
    if polys and not lines and not pts:
        G = _grid_for(g.bounds, max(r, 0) + 4 * H)
        out = []
        # buffer each separated group on its own grid (keeps the grids small)
        for grp in _components(polys, 2 * max(r, 0) + 4 * H):
            sub = [polys[i] for i in grp]
            bb = np.array([p.bounds for p in sub])
            G = _grid_for((bb[:, 0].min(), bb[:, 1].min(), bb[:, 2].max(), bb[:, 3].max()), max(r, 0) + 4 * H)
            D = _sdf(MultiPolygon(sub), G, band)
            D -= np.float32(r)
            out += _polys_of(_contour(D, G))
        return _result(out)
    # lines (and points): unsigned distance minus r
    parts = []
    for q in pts:
        parts.append(q.buffer(r, quad_segs))
    if lines:
        if cap == 3:
            lines2 = []
            for l in lines:
                a = l._a.copy()
                if len(a) >= 2 and not isinstance(l, LinearRing):
                    d0 = a[0] - a[1]; d0 /= max(np.linalg.norm(d0), 1e-12)
                    d1 = a[-1] - a[-2]; d1 /= max(np.linalg.norm(d1), 1e-12)
                    a[0] += d0 * r; a[-1] += d1 * r
                lines2.append(LineString(a) if not isinstance(l, LinearRing) else l)
            lines = lines2
        bb = np.array([l.bounds for l in lines])
        G = _grid_for((bb[:, 0].min(), bb[:, 1].min(), bb[:, 2].max(), bb[:, 3].max()), r + 4 * H)
        D = np.full((G[3], G[2]), np.inf, np.float32)
        for l in lines:
            _line_sdf_into(D, G, l, r, band, cap)
        D[~np.isfinite(D) | (D > band)] = BIG
        parts += _polys_of(_contour(D, G))
    if polys:
        parts += _polys_of(_buffer(_result(polys), r, cap, quad_segs))
    return _union(parts) if len(parts) > 1 else _result(parts)


# ------------------------------------------------------------------ predicates and distances (vector where exact)
def _pip_rings(rings, P):
    """even-odd point in polygon for points P (n,2) against rings"""
    inside = np.zeros(len(P), bool)
    x, y = P[:, 0][:, None], P[:, 1][:, None]
    for r in rings:
        a = r; b = np.roll(r, -1, axis=0)
        ay, by = a[:, 1][None, :], b[:, 1][None, :]
        ax, bx = a[:, 0][None, :], b[:, 0][None, :]
        cond = (ay > y) != (by > y)
        with np.errstate(divide='ignore', invalid='ignore'):
            xc = ax + (y - ay) * (bx - ax) / (by - ay)
        inside ^= (np.sum(cond & (x < xc), axis=1) % 2).astype(bool)
    return inside


def _pip_geom(g, P):
    out = np.zeros(len(P), bool)
    for p in _polys_of(g):
        b = p.bounds
        m = (P[:, 0] >= b[0]) & (P[:, 0] <= b[2]) & (P[:, 1] >= b[1]) & (P[:, 1] <= b[3])
        if m.any():
            out[m] |= _pip_rings(p.rings(), P[m])
    return out


def _seg_dist(P, a, b):
    """distance from points P (n,2) to segments a->b (m,2): (n,m)"""
    d = b - a
    L2 = np.maximum((d * d).sum(1), 1e-30)
    px = P[:, None, 0] - a[None, :, 0]; py = P[:, None, 1] - a[None, :, 1]
    t = np.clip((px * d[None, :, 0] + py * d[None, :, 1]) / L2[None, :], 0, 1)
    qx = px - t * d[None, :, 0]; qy = py - t * d[None, :, 1]
    return np.sqrt(qx * qx + qy * qy)


def _segments(g):
    S = []
    for p in _polys_of(g):
        for r in p.rings():
            S.append((r, np.roll(r, -1, axis=0)))
    for l in _lines_of(g):
        if len(l._a) >= 2:
            S.append((l._a[:-1], l._a[1:]))
        elif len(l._a) == 1:
            S.append((l._a, l._a))
    for q in _points_of(g):
        c = np.array([q._c]); S.append((c, c))
    if not S:
        return np.zeros((0, 2)), np.zeros((0, 2))
    return np.vstack([s[0] for s in S]), np.vstack([s[1] for s in S])


def _bdist(g, P):
    a, b = _segments(g)
    if len(a) == 0:
        return np.full(len(P), np.inf)
    out = np.empty(len(P))
    for i in range(0, len(P), 256):
        out[i:i + 256] = _seg_dist(P[i:i + 256], a, b).min(1)
    return out


def _distance(g1, g2):
    if g1.is_empty or g2.is_empty:
        return 0.0
    if isinstance(g2, Point) and not isinstance(g1, Point):
        g1, g2 = g2, g1
    if isinstance(g1, Point):
        P = np.array([g1._c])
        if _polys_of(g2) and _pip_geom(g2, P)[0]:
            return 0.0
        return float(_bdist(g2, P)[0])
    if _intersects(g1, g2):
        return 0.0
    a1, b1 = _segments(g1); a2, b2 = _segments(g2)
    d = min(_seg_dist(a1, a2, b2).min(), _seg_dist(a2, a1, b1).min())
    return float(d)


def _window_fields(g1, g2, lo, hi, band):
    G = _grid_for((lo[0], lo[1], hi[0], hi[1]), 2 * H)
    return G, _sdf(g1, G, band), _sdf(g2, G, band)


def _intersects(g1, g2):
    if g1.is_empty or g2.is_empty:
        return False
    b1, b2 = g1.bounds, g2.bounds
    if not _bb_overlap(b1, b2, 1e-9):
        return False
    p1, p2 = _polys_of(g1), _polys_of(g2)
    if isinstance(g1, Point) or isinstance(g2, Point):
        pt, other = (g1, g2) if isinstance(g1, Point) else (g2, g1)
        P = np.array([pt._c])
        if _polys_of(other) and _pip_geom(other, P)[0]:
            return True
        return bool(_bdist(other, P)[0] < 1e-9)
    if p1 and p2:
        c1, c2 = getattr(p1[0], '_circle', None) if len(p1) == 1 else None, getattr(p2[0], '_circle', None) if len(p2) == 1 else None
        if c1 and c2:
            return math.hypot(c1[0] - c2[0], c1[1] - c2[1]) < c1[2] + c2[2]
        for pa, pb in ((p1, g2), (p2, g1)):
            V = np.vstack([p._ext for p in pa])
            if _pip_geom(pb, V).any():
                return True
        lo = (max(b1[0], b2[0]), max(b1[1], b2[1])); hi = (min(b1[2], b2[2]), min(b1[3], b2[3]))
        G, D1, D2 = _window_fields(g1, g2, lo, hi, 3 * H)
        return bool((np.maximum(D1, D2) <= 0.25 * H).any())
    # lines against polygons / lines
    if p1 or p2:
        line, poly = (g2, g1) if p1 else (g1, g2)
        V = _all_points(line)
        if _pip_geom(poly, V).any():
            return True
    a1, b1_ = _segments(g1); a2, b2_ = _segments(g2)
    return bool(min(_seg_dist(a1, a2, b2_).min(), _seg_dist(a2, a1, b1_).min()) < 1e-9) or _segs_cross(a1, b1_, a2, b2_)


def _segs_cross(a1, b1, a2, b2):
    def cr(o, p, q):
        return (p[..., 0] - o[..., 0]) * (q[..., 1] - o[..., 1]) - (p[..., 1] - o[..., 1]) * (q[..., 0] - o[..., 0])
    A1, B1 = a1[:, None, :], b1[:, None, :]; A2, B2 = a2[None, :, :], b2[None, :, :]
    d1 = cr(A2, B2, A1); d2 = cr(A2, B2, B1); d3 = cr(A1, B1, A2); d4 = cr(A1, B1, B2)
    return bool(np.any((d1 * d2 < 0) & (d3 * d4 < 0)))


def _contains(g1, g2):
    if g1.is_empty or g2.is_empty:
        return False
    p1 = _polys_of(g1)
    if not p1:
        return False
    b1, b2 = g1.bounds, g2.bounds
    if b2[0] < b1[0] - 1e-9 or b2[1] < b1[1] - 1e-9 or b2[2] > b1[2] + 1e-9 or b2[3] > b1[3] + 1e-9:
        return False
    if isinstance(g2, Point):
        P = np.array([g2._c])
        return bool(_pip_geom(g1, P)[0] and _bdist(g1, P)[0] > 1e-12)
    p2 = _polys_of(g2)
    c2 = getattr(p2[0], '_circle', None) if len(p2) == 1 else None
    if c2:
        P = np.array([[c2[0], c2[1]]])
        return bool(_pip_geom(g1, P)[0] and _bdist(g1, P)[0] >= c2[2] - 1e-9)
    V = _all_points(g2)
    if not _pip_geom(g1, V).all():
        return False
    if not p2:            # lines: every vertex inside and no crossing of the boundary
        a1, b1_ = _segments(g1); a2, b2_ = _segments(g2)
        return not _segs_cross(a1, b1_, a2, b2_)
    G = _grid_for(b2, 2 * H)
    D2 = _sdf(g2, G, 3 * H)
    D1 = _sdf(g1, G, 3 * H)
    return bool((D1[D2 < -0.5 * H] <= 0.5 * H).all())


# ------------------------------------------------------------------ affine transforms
def _xform(g, f):
    if g.is_empty:
        return g
    if isinstance(g, Point):
        q = f(np.array([g._c]))[0]
        return Point(q[0], q[1])
    if isinstance(g, LinearRing):
        return LinearRing(f(g._a))
    if isinstance(g, LineString):
        return LineString(f(g._a))
    if isinstance(g, Polygon):
        p = Polygon._from(_orient(f(g._ext), True), [_orient(f(h), False) for h in g._holes])
        return p
    if isinstance(g, _Multi):
        return type(g)([_xform(x, f) for x in g._g])
    raise TypeError(type(g))


def _origin(g, origin):
    if isinstance(origin, str):
        if origin == 'center':
            b = g.bounds
            return ((b[0] + b[2]) / 2, (b[1] + b[3]) / 2)
        if origin == 'centroid':
            c = g.centroid
            return (c.x, c.y)
        raise ValueError(origin)
    if isinstance(origin, Point):
        return origin._c
    return (float(origin[0]), float(origin[1]))


def translate(g, xoff=0.0, yoff=0.0, zoff=0.0):
    o = np.array([xoff, yoff], float)
    r = _xform(g, lambda a: a + o)
    if isinstance(g, Polygon) and g._circle:
        r._circle = (g._circle[0] + xoff, g._circle[1] + yoff, g._circle[2])
    return r


def rotate(g, angle, origin='center', use_radians=False):
    if g.is_empty:
        return g
    a = angle if use_radians else math.radians(angle)
    c, s = math.cos(a), math.sin(a)
    o = np.array(_origin(g, origin))
    M = np.array([[c, -s], [s, c]])
    r = _xform(g, lambda p: (p - o) @ M.T + o)
    if isinstance(g, Polygon) and g._circle:
        q = (np.array(g._circle[:2]) - o) @ M.T + o
        r._circle = (q[0], q[1], g._circle[2])
    return r


def scale(g, xfact=1.0, yfact=1.0, zfact=1.0, origin='center'):
    if g.is_empty:
        return g
    o = np.array(_origin(g, origin))
    f = np.array([xfact, yfact], float)
    r = _xform(g, lambda p: (p - o) * f + o)
    if isinstance(g, Polygon) and g._circle and abs(abs(xfact) - abs(yfact)) < 1e-12:
        q = (np.array(g._circle[:2]) - o) * f + o
        r._circle = (q[0], q[1], g._circle[2] * abs(xfact))
    return r


def affine_transform(g, m):
    a, b, d, e, xo, yo = m
    M = np.array([[a, b], [d, e]]); o = np.array([xo, yo])
    return _xform(g, lambda p: p @ M.T + o)


# ------------------------------------------------------------------ ops
def unary_union(geoms):
    if isinstance(geoms, BaseGeometry):
        geoms = [geoms]
    geoms = [g for g in geoms if g is not None and not g.is_empty]
    if not geoms:
        return GeometryCollection()
    if all(not _polys_of(g) for g in geoms):
        return GeometryCollection(geoms)
    return _union(geoms)


def substring(geom, start_dist, end_dist, normalized=False):
    a = geom._a
    seg = np.linalg.norm(np.diff(a, axis=0), axis=1)
    L = seg.sum()
    s, e = (start_dist * L, end_dist * L) if normalized else (start_dist, end_dist)
    s, e = min(max(s, 0), L), min(max(e, 0), L)
    rev = s > e
    if rev:
        s, e = e, s
    cum = np.r_[0, np.cumsum(seg)]
    pts = [geom.interpolate(s).coords[0]]
    for i in range(1, len(a) - 1):
        if s < cum[i] < e:
            pts.append(tuple(a[i]))
    pts.append(geom.interpolate(e).coords[0])
    if rev:
        pts = pts[::-1]
    return LineString(pts)
