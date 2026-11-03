# Mesh helpers for the Theseus PCB: triangulation, bevelled extrusions, text, QR, fillets, tubes, GLB writing.
# 2D shapes live in (x, z) mouse-frame mm; 3D is (x, y, z) with +y up.
import json, math, struct
import numpy as np
import mapbox_earcut as earcut
from shapely.geometry import Polygon, MultiPolygon, LineString, Point, box, GeometryCollection
from shapely.geometry.polygon import orient
from shapely.ops import unary_union
from shapely import affinity


def polys(g):
    """flatten any shapely geometry into a list of Polygons"""
    if g is None or g.is_empty:
        return []
    if g.geom_type == 'Polygon':
        return [g]
    if hasattr(g, 'geoms'):
        out = []
        for gg in g.geoms:
            out += polys(gg)
        return out
    return []


class Mesh:
    """accumulates triangles with per-vertex normals"""

    def __init__(self):
        self.P, self.N, self.I = [], [], []
        self.n = 0

    def add(self, P, N, I):
        P = np.asarray(P, np.float64).reshape(-1, 3)
        N = np.asarray(N, np.float64).reshape(-1, 3)
        I = np.asarray(I, np.int64).reshape(-1, 3)
        if len(I) == 0:
            return
        self.P.append(P); self.N.append(N); self.I.append(I + self.n)
        self.n += len(P)

    def merge(self, m, T=None):
        if m.n == 0:
            return
        P, N, I = m.arrays()
        if T is not None:
            T = np.asarray(T, float)
            P = (np.c_[P, np.ones(len(P))] @ T.T)[:, :3]
            R = T[:3, :3]
            Ninv = np.linalg.inv(R).T
            N = N @ Ninv.T
            N /= np.maximum(np.linalg.norm(N, axis=1, keepdims=True), 1e-9)
            if np.linalg.det(R) < 0:
                I = I[:, [0, 2, 1]]
        self.add(P, N, I)

    def arrays(self):
        if not self.P:
            return np.zeros((0, 3), np.float32), np.zeros((0, 3), np.float32), np.zeros((0, 3), np.uint32)
        return (np.vstack(self.P).astype(np.float32), np.vstack(self.N).astype(np.float32),
                np.vstack(self.I).astype(np.uint32))

    @property
    def ntri(self):
        return sum(len(i) for i in self.I)


def tri_poly(poly):
    poly = orient(poly, 1.0)
    rings = [np.asarray(poly.exterior.coords)[:-1]] + [np.asarray(r.coords)[:-1] for r in poly.interiors]
    rings = [r for r in rings if len(r) >= 3]
    verts = np.vstack(rings)
    ends = np.cumsum([len(r) for r in rings]).astype(np.uint32)
    t = earcut.triangulate_float64(verts, ends).reshape(-1, 3)
    return verts, t


def cap(mesh, g, y, up=True):
    """flat face(s) of polygon(s) g at height y, facing +y (up) or -y"""
    for p in polys(g):
        if p.area < 1e-7:
            continue
        v, t = tri_poly(p)
        if len(t) == 0:
            continue
        P = np.c_[v[:, 0], np.full(len(v), y), v[:, 1]]
        a, b, c = v[t[:, 0]], v[t[:, 1]], v[t[:, 2]]
        cr = (b[:, 0] - a[:, 0]) * (c[:, 1] - a[:, 1]) - (b[:, 1] - a[:, 1]) * (c[:, 0] - a[:, 0])
        # +y normal needs clockwise (x,z) triangles
        flip = cr > 0 if up else cr < 0
        t = t.copy(); t[flip] = t[flip][:, [0, 2, 1]]
        N = np.tile([0, 1 if up else -1, 0], (len(v), 1))
        mesh.add(P, N, t)


def _ring_offsets(r, d):
    """outward (right-hand) miter offsets for a ring oriented per shapely.orient(sign=1)"""
    n = len(r)
    e = np.roll(r, -1, axis=0) - r
    el = np.maximum(np.linalg.norm(e, axis=1, keepdims=True), 1e-12)
    en = np.c_[e[:, 1], -e[:, 0]] / el                  # right-hand normal of edge i (r[i] -> r[i+1])
    prev = np.roll(en, 1, axis=0)
    m = prev + en
    ml = np.maximum(np.linalg.norm(m, axis=1, keepdims=True), 1e-12)
    m = m / ml
    cosh = np.clip((m * en).sum(1, keepdims=True), 0.35, 1.0)
    return m * d / cosh, en


def walls(mesh, g, y_top, y_bot, out=0.0, smooth_deg=40.0):
    """side walls of polygon(s) g from y_top (at the outline) down to y_bot (outline pushed outward by `out`)."""
    for p in polys(g):
        p = orient(p, 1.0)
        for ring in [p.exterior] + list(p.interiors):
            r = np.asarray(ring.coords)[:-1]
            if len(r) < 3:
                continue
            off, en = _ring_offsets(r, out)
            n = len(r)
            e = np.roll(r, -1, axis=0) - r
            el = np.linalg.norm(e, axis=1)
            # edge normal in 3D (tilted by the bevel)
            h = y_top - y_bot
            tilt = np.arctan2(out, h) if h > 1e-9 else 0.0
            # face normals per edge
            fn = np.c_[en[:, 0] * math.cos(tilt), np.full(n, math.sin(tilt)), en[:, 1] * math.cos(tilt)]
            # vertex normals: average neighbours when the turn is gentle, else per-edge
            turn = np.degrees(np.arccos(np.clip((np.roll(en, 1, axis=0) * en).sum(1), -1, 1)))
            P, N, I = [], [], []
            for i in range(n):
                j = (i + 1) % n
                if el[i] < 1e-9:
                    continue
                a_top = (r[i, 0], y_top, r[i, 1]); b_top = (r[j, 0], y_top, r[j, 1])
                a_bot = (r[i, 0] + off[i, 0], y_bot, r[i, 1] + off[i, 1])
                b_bot = (r[j, 0] + off[j, 0], y_bot, r[j, 1] + off[j, 1])
                na = fn[i] if turn[i] > smooth_deg else (fn[i] + fn[i - 1]) / 2
                nb = fn[i] if turn[j] > smooth_deg else (fn[i] + fn[j]) / 2
                k = len(P)
                P += [a_top, b_top, b_bot, a_bot]
                N += [na, nb, nb, na]
                I += [(k, k + 2, k + 1), (k, k + 3, k + 2)]
            if P:
                P = np.array(P); N = np.array(N, float)
                N /= np.maximum(np.linalg.norm(N, axis=1, keepdims=True), 1e-9)
                I = np.array(I)
                # make sure winding faces outward (check first quad)
                a, b, c = P[I[0, 0]], P[I[0, 1]], P[I[0, 2]]
                if np.dot(np.cross(b - a, c - a), N[I[0, 0]]) < 0:
                    I = I[:, [0, 2, 1]]
                mesh.add(P, N, I)


def ring_walls(mesh, coords, interior, y_top, y_bot):
    """vertical wall for one ring; interior=True means the ring bounds a hole (faces point into the hole)"""
    ring = Polygon(coords)
    if interior:
        big = ring.buffer(0.5, join_style=2)
        g = Polygon(big.exterior.coords, [ring.exterior.coords])
        m2 = Mesh()
        walls(m2, g, y_top, y_bot)
        # keep only the inner ring faces: those whose vertices lie on the hole ring
        P, N, I = m2.arrays()
        if len(I):
            from shapely.geometry import Point as _P
            keep = []
            ext = ring.exterior
            for t in I:
                c = P[t].mean(0)
                if ext.distance(_P(c[0], c[2])) < 1e-3:
                    keep.append(t)
            if keep:
                mesh.add(P, N, np.array(keep))
    else:
        walls(mesh, ring, y_top, y_bot)


def raised(mesh, g, y_base, y_top, bevel=0.0, bottom=False):
    """flat-topped relief: top cap + bevelled walls (bottom=True mirrors for the underside: top at y_top < y_base)"""
    if not bottom:
        cap(mesh, g, y_top, up=True)
        walls(mesh, g, y_top, y_base, out=bevel)
    else:
        cap(mesh, g, y_top, up=False)
        m2 = Mesh()
        walls(m2, g, -y_top, -y_base, out=bevel)
        P, N, I = m2.arrays()
        if len(P):
            P = P.copy(); P[:, 1] *= -1; N = N.copy(); N[:, 1] *= -1
            mesh.add(P, N, I[:, [0, 2, 1]])


def slab(mesh, g, y0, y1, side=True, top=True, bottom=True):
    if top:
        cap(mesh, g, y1, up=True)
    if bottom:
        cap(mesh, g, y0, up=False)
    if side:
        walls(mesh, g, y1, y0, out=0.0)


# ------------------------------------------------------------------ primitives (local, returned as Mesh)
def box_mesh(sx, sy, sz, c=(0, 0, 0)):
    m = Mesh()
    hx, hy, hz = sx / 2, sy / 2, sz / 2
    F = [((1, 0, 0), [(hx, -hy, -hz), (hx, hy, -hz), (hx, hy, hz), (hx, -hy, hz)]),
         ((-1, 0, 0), [(-hx, -hy, hz), (-hx, hy, hz), (-hx, hy, -hz), (-hx, -hy, -hz)]),
         ((0, 1, 0), [(-hx, hy, -hz), (-hx, hy, hz), (hx, hy, hz), (hx, hy, -hz)]),
         ((0, -1, 0), [(-hx, -hy, hz), (-hx, -hy, -hz), (hx, -hy, -hz), (hx, -hy, hz)]),
         ((0, 0, 1), [(hx, -hy, hz), (hx, hy, hz), (-hx, hy, hz), (-hx, -hy, hz)]),
         ((0, 0, -1), [(-hx, -hy, -hz), (-hx, hy, -hz), (hx, hy, -hz), (hx, -hy, -hz)])]
    for n, q in F:
        P = np.array(q) + np.array(c)
        I = np.array([[0, 1, 2], [0, 2, 3]])
        a, b, cc = P[0], P[1], P[2]
        if np.dot(np.cross(b - a, cc - a), n) < 0:
            I = I[:, [0, 2, 1]]
        m.add(P, np.tile(n, (4, 1)), I)
    return m


def rbox_mesh(sx, sy, sz, r, c=(0, 0, 0), seg=4, rb=None):
    """box with rounded vertical edges (radius r) and rounded top edges (rb, default r); flat bottom"""
    rb = r if rb is None else rb
    m = Mesh()
    base = box(-sx / 2 + r, -sz / 2 + r, sx / 2 - r, sz / 2 - r).buffer(r, quad_segs=seg) if r > 0 else box(-sx / 2, -sz / 2, sx / 2, sz / 2)
    # stack of insets for the top round-over
    levels = []
    for k in range(seg + 1):
        a = (math.pi / 2) * k / seg
        inset = rb * (1 - math.cos(a))
        y = sy - rb + rb * math.sin(a) if rb > 0 else sy
        levels.append((inset, y))
    shapes = [base.buffer(-ins, join_style=1) if ins > 1e-6 else base for ins, _ in levels]
    # bottom
    cap(m, base, 0.0, up=False)
    # vertical side up to sy - rb
    walls(m, base, sy - rb, 0.0, out=0.0)
    # round-over bands
    for k in range(seg):
        g0, (i0, y0) = shapes[k], levels[k]
        g1, (i1, y1) = shapes[k + 1], levels[k + 1]
        walls(m, g1, y1, y0, out=(i1 - i0))
    cap(m, shapes[-1], sy, up=True)
    if c != (0, 0, 0):
        P, N, I = m.arrays(); m2 = Mesh(); m2.add(P + np.array(c), N, I); return m2
    return m


def extrude_mesh(g, y0, y1, bevel_top=0.0):
    m = Mesh()
    if bevel_top > 0:
        inner = g.buffer(-bevel_top, join_style=2)
        cap(m, inner, y1, up=True)
        walls(m, inner, y1, y1 - bevel_top, out=bevel_top)
        walls(m, g, y1 - bevel_top, y0, out=0.0)
        cap(m, g, y0, up=False)
    else:
        slab(m, g, y0, y1)
    return m


def cyl_mesh(r, h, seg=24, y0=0.0, top=True, bottom=True, axis='y', r_top=None):
    r_top = r if r_top is None else r_top
    m = Mesh()
    a = np.linspace(0, 2 * math.pi, seg, endpoint=False)
    ca, sa = np.cos(a), np.sin(a)
    P, N, I = [], [], []
    slope = (r - r_top) / max(h, 1e-9)
    for i in range(seg):
        j = (i + 1) % seg
        k = len(P)
        P += [(r * ca[i], y0, r * sa[i]), (r * ca[j], y0, r * sa[j]), (r_top * ca[j], y0 + h, r_top * sa[j]), (r_top * ca[i], y0 + h, r_top * sa[i])]
        ni = np.array([ca[i], slope, sa[i]]); nj = np.array([ca[j], slope, sa[j]])
        N += [ni, nj, nj, ni]
        I += [(k, k + 2, k + 1), (k, k + 3, k + 2)]
    m.add(P, N, I)
    if top and r_top > 0:
        cap(m, Point(0, 0).buffer(r_top, quad_segs=max(4, seg // 4)), y0 + h, up=True)
    if bottom:
        cap(m, Point(0, 0).buffer(r, quad_segs=max(4, seg // 4)), y0, up=False)
    m = _fix_outward(m)
    if axis != 'y':
        T = rot_to_axis(axis)
        m2 = Mesh(); m2.merge(m, T); return m2
    return m


def _fix_outward(m):
    return m


def rot_to_axis(axis):
    T = np.eye(4)
    if axis == 'x':      # y -> x
        T[:3, :3] = [[0, 1, 0], [-1, 0, 0], [0, 0, 1]]
    elif axis == 'z':    # y -> z
        T[:3, :3] = [[1, 0, 0], [0, 0, -1], [0, 1, 0]]
    return T


def tube_mesh(path, r, seg=10, caps=True):
    """sweep a circle of radius r along a 3D polyline (parallel-transport frames)"""
    path = np.asarray(path, float)
    n = len(path)
    T = np.gradient(path, axis=0)
    T /= np.maximum(np.linalg.norm(T, axis=1, keepdims=True), 1e-12)
    ref = np.array([0, 1, 0]) if abs(T[0, 1]) < 0.9 else np.array([1, 0, 0])
    Nn = np.cross(T[0], ref); Nn /= np.linalg.norm(Nn)
    frames = []
    for i in range(n):
        if i > 0:
            v = np.cross(T[i - 1], T[i])
            s = np.linalg.norm(v)
            if s > 1e-9:
                v /= s
                ang = math.atan2(s, np.dot(T[i - 1], T[i]))
                Nn = Nn * math.cos(ang) + np.cross(v, Nn) * math.sin(ang) + v * np.dot(v, Nn) * (1 - math.cos(ang))
        B = np.cross(T[i], Nn)
        frames.append((Nn.copy(), B))
    a = np.linspace(0, 2 * math.pi, seg, endpoint=False)
    P, N, I = [], [], []
    for i in range(n):
        Nn, B = frames[i]
        for k in range(seg):
            d = Nn * math.cos(a[k]) + B * math.sin(a[k])
            P.append(path[i] + r * d); N.append(d)
    for i in range(n - 1):
        for k in range(seg):
            k2 = (k + 1) % seg
            p0 = i * seg + k; p1 = i * seg + k2; p2 = (i + 1) * seg + k2; p3 = (i + 1) * seg + k
            I += [(p0, p1, p2), (p0, p2, p3)]
    m = Mesh()
    P = np.array(P); N = np.array(N); I = np.array(I)
    a0, b0, c0 = P[I[0, 0]], P[I[0, 1]], P[I[0, 2]]
    if np.dot(np.cross(b0 - a0, c0 - a0), N[I[0, 0]]) < 0:
        I = I[:, [0, 2, 1]]
    m.add(P, N, I)
    if caps:
        for idx, sgn in ((0, -1), (n - 1, 1)):
            c = path[idx]; ring = P[idx * seg:(idx + 1) * seg]
            cp = np.vstack([c, ring]); cn = np.tile(T[idx] * sgn, (seg + 1, 1))
            ci = np.array([(0, 1 + k, 1 + (k + 1) % seg) for k in range(seg)])
            if np.dot(np.cross(cp[ci[0, 1]] - cp[0], cp[ci[0, 2]] - cp[0]), cn[0]) < 0:
                ci = ci[:, [0, 2, 1]]
            m.add(cp, cn, ci)
    return m


def grid_surface(F, nu, nv, closed_v=False):
    """parametric surface F(u, v) -> point; normals from finite differences"""
    U = np.linspace(0, 1, nu); Vv = np.linspace(0, 1, nv)
    P = np.array([[F(u, v) for v in Vv] for u in U])
    du = np.gradient(P, axis=0); dv = np.gradient(P, axis=1)
    N = np.cross(du, dv)
    N /= np.maximum(np.linalg.norm(N, axis=2, keepdims=True), 1e-12)
    I = []
    for i in range(nu - 1):
        for j in range(nv - 1):
            a = i * nv + j; b = (i + 1) * nv + j; c = (i + 1) * nv + j + 1; d = i * nv + j + 1
            I += [(a, b, c), (a, c, d)]
    m = Mesh(); m.add(P.reshape(-1, 3), N.reshape(-1, 3), I)
    return m


def fillet_mesh(x_face, x_pad, width, height, y0=0.0, nu=7, nv=11, side_flare=0.08, convex=False):
    """solder meniscus from a vertical termination face at x=x_face (pad extends to x_pad, sign gives direction)
    across width (along z, centred). Profile: concave quadratic (wetting fillet)."""
    L = x_pad - x_face

    def F(u, v):
        s = 2 * v - 1                                  # -1..1 across the width
        e = max(0.0, 1 - abs(s) ** 6)                  # end taper across the width
        hz = (width / 2 + side_flare * (1 - u)) * s
        h = height * ((1 - u) ** (1.6 if not convex else 0.8)) * (0.35 + 0.65 * e)
        x = x_face + L * u * (0.55 + 0.45 * e)
        return (x, y0 + h, hz)
    m = grid_surface(F, nu, nv)
    # orient normals up/outward
    P, N, I = m.arrays()
    if N[:, 1].mean() < 0:
        m2 = Mesh(); m2.add(P, -N, I[:, [0, 2, 1]]); return m2
    return m


def transform(m, x=0, y=0, z=0, ry_deg=0, rx_deg=0, rz_deg=0, s=1.0):
    T = trs(x, y, z, ry_deg, rx_deg, rz_deg, s)
    m2 = Mesh(); m2.merge(m, T); return m2


def trs(x=0, y=0, z=0, ry_deg=0, rx_deg=0, rz_deg=0, s=1.0):
    rx, ry, rz = map(math.radians, (rx_deg, ry_deg, rz_deg))
    Rx = np.array([[1, 0, 0], [0, math.cos(rx), -math.sin(rx)], [0, math.sin(rx), math.cos(rx)]])
    Ry = np.array([[math.cos(ry), 0, math.sin(ry)], [0, 1, 0], [-math.sin(ry), 0, math.cos(ry)]])
    Rz = np.array([[math.cos(rz), -math.sin(rz), 0], [math.sin(rz), math.cos(rz), 0], [0, 0, 1]])
    T = np.eye(4); T[:3, :3] = (Ry @ Rx @ Rz) * s; T[:3, 3] = (x, y, z)
    return T


# ------------------------------------------------------------------ text + codes
_HF = None


def hershey_text(text, height, x=0, z=0, w=0.12, anchor='c', rot=0, font='futural', spacing=1.0, mirror=False):
    """stroke text as polygons. height = cap height (mm). anchor: c (centre), l (left-mid), r (right-mid)"""
    global _HF
    from HersheyFonts import HersheyFonts
    if _HF is None:
        _HF = {}
    if font not in _HF:
        f = HersheyFonts(); f.load_default_font(font); _HF[font] = f
    f = _HF[font]
    f.normalize_rendering(height * 1.0)
    lines = []
    for (x1, y1), (x2, y2) in f.lines_for_text(text):
        lines.append(LineString([(x1 * spacing, y1), (x2 * spacing, y2)]))
    if not lines:
        return Polygon()
    g = unary_union([l.buffer(w / 2, quad_segs=4, cap_style=1, join_style=1) for l in lines])
    minx, miny, maxx, maxy = g.bounds
    cx = {'c': (minx + maxx) / 2, 'l': minx, 'r': maxx}[anchor]
    cy = (miny + maxy) / 2
    g = affinity.translate(g, -cx, -cy)
    if mirror:
        g = affinity.scale(g, -1, 1, origin=(0, 0))
    g = affinity.rotate(g, rot, origin=(0, 0))
    return affinity.translate(g, x, z)


def outline_text(text, height, x=0, z=0, anchor='c', rot=0, weight='bold', family='DejaVu Sans', tracking=0.0, mirror=False):
    """filled-outline text (matplotlib TextPath) as polygons; height = cap height (mm)"""
    from matplotlib.textpath import TextPath
    from matplotlib.font_manager import FontProperties
    fp = FontProperties(family=family, weight=weight)
    glyphs = []
    cursor = 0.0
    for ch in text:
        if ch == ' ':
            cursor += height * 0.45 + tracking
            continue
        tp = TextPath((0, 0), ch, size=1.0, prop=fp)
        ps = tp.to_polygons()
        # even-odd composition of glyph rings
        g = Polygon()
        for ring in ps:
            if len(ring) < 3:
                continue
            p = Polygon(ring).buffer(0)
            g = g.symmetric_difference(p)
        bx = TextPath((0, 0), ch, size=1.0, prop=fp).get_extents()
        glyphs.append(affinity.translate(g, cursor - bx.x0 * 0, 0))
        cursor += (bx.x1 - bx.x0 if bx.width > 0 else 0.5) + 0.08 + tracking / max(height, 1e-6)
    g = unary_union(glyphs)
    # scale so the cap height of 'H' = height
    hp = TextPath((0, 0), 'H', size=1.0, prop=fp).get_extents()
    s = height / hp.height
    g = affinity.scale(g, s, s, origin=(0, 0))
    minx, miny, maxx, maxy = g.bounds
    cx = {'c': (minx + maxx) / 2, 'l': minx, 'r': maxx}[anchor]
    g = affinity.translate(g, -cx, -(hp.y0 + hp.height / 2) * s)
    if mirror:
        g = affinity.scale(g, -1, 1, origin=(0, 0))
    g = affinity.rotate(g, rot, origin=(0, 0))
    return affinity.translate(g, x, z)


def qr_modules(data, error='m', border=0):
    import segno
    q = segno.make(data, error=error, micro=False, boost_error=False)
    M = np.array([[1 if c else 0 for c in row] for row in q.matrix], np.uint8)
    return M


def matrix_polys(M, size, x=0, z=0, invert=False, quiet=0, rot=0, mirror=False):
    """dark modules of a QR/data-matrix as polygons, fitted into `size` mm square centred at (x, z).
    invert=True returns quiet-zone square minus dark modules (white-on-black silk printing)."""
    n = M.shape[0]
    tot = n + 2 * quiet
    m = size / tot
    sq = []
    for r in range(n):
        c = 0
        while c < n:
            if M[r, c]:
                c0 = c
                while c < n and M[r, c]:
                    c += 1
                sq.append(box((quiet + c0) * m, (tot - quiet - r - 1) * m, (quiet + c) * m, (tot - quiet - r) * m))
            else:
                c += 1
    dark = unary_union(sq).buffer(1e-4, join_style=2).buffer(-1e-4, join_style=2)
    if invert:
        g = box(0, 0, tot * m, tot * m).difference(dark)
    else:
        g = dark
    g = affinity.translate(g, -tot * m / 2, -tot * m / 2)
    if mirror:
        g = affinity.scale(g, -1, 1, origin=(0, 0))
    g = affinity.rotate(g, rot, origin=(0, 0))
    return affinity.translate(g, x, z)


# ------------------------------------------------------------------ GLB writer
class GLB:
    """minimal glTF 2.0 binary writer: named materials, shared meshes, node tree with TRS and extras"""

    def __init__(self):
        self.bin = bytearray()
        self.buffer_views, self.accessors, self.meshes, self.nodes, self.materials = [], [], [], [], []
        self.mat_index = {}
        self.scene_nodes = []

    def material(self, name, color=(0.8, 0.8, 0.8, 1.0), metal=0.0, rough=0.5, double=False, alpha=None):
        if name in self.mat_index:
            return self.mat_index[name]
        m = dict(name=name, pbrMetallicRoughness=dict(baseColorFactor=list(color), metallicFactor=metal, roughnessFactor=rough))
        if double:
            m['doubleSided'] = True
        if alpha:
            m['alphaMode'] = 'BLEND'
        self.materials.append(m)
        self.mat_index[name] = len(self.materials) - 1
        return self.mat_index[name]

    def _view(self, data, target=None):
        while len(self.bin) % 4:
            self.bin.append(0)
        off = len(self.bin)
        self.bin += data
        v = dict(buffer=0, byteOffset=off, byteLength=len(data))
        if target:
            v['target'] = target
        self.buffer_views.append(v)
        return len(self.buffer_views) - 1

    def _acc(self, arr, comp, typ, target, minmax=False):
        v = self._view(arr.tobytes(), target)
        a = dict(bufferView=v, componentType=comp, count=int(arr.shape[0]), type=typ)
        if minmax:
            a['min'] = arr.min(0).astype(float).tolist(); a['max'] = arr.max(0).astype(float).tolist()
        self.accessors.append(a)
        return len(self.accessors) - 1

    def mesh(self, name, prims):
        """prims: list of (Mesh, material_name)"""
        P_ = []
        for m, mat in prims:
            P, N, I = m.arrays()
            if len(I) == 0:
                continue
            pa = self._acc(P.astype(np.float32), 5126, 'VEC3', 34962, minmax=True)
            na = self._acc(N.astype(np.float32), 5126, 'VEC3', 34962)
            if P.shape[0] < 65535:
                ia = self._acc(I.astype(np.uint16).reshape(-1), 5123, 'SCALAR', 34963)
            else:
                ia = self._acc(I.astype(np.uint32).reshape(-1), 5125, 'SCALAR', 34963)
            P_.append(dict(attributes=dict(POSITION=pa, NORMAL=na), indices=ia, material=self.mat_index[mat]))
        if not P_:
            return None
        self.meshes.append(dict(name=name, primitives=P_))
        return len(self.meshes) - 1

    def node(self, name, mesh=None, children=None, T=None, extras=None, root=False):
        n = dict(name=name)
        if mesh is not None:
            n['mesh'] = mesh
        if children:
            n['children'] = children
        if T is not None:
            n['matrix'] = np.asarray(T, float).T.reshape(-1).tolist()
        if extras:
            n['extras'] = extras
        self.nodes.append(n)
        idx = len(self.nodes) - 1
        if root:
            self.scene_nodes.append(idx)
        return idx

    def write(self, path, extras=None):
        while len(self.bin) % 4:
            self.bin.append(0)
        gl = dict(asset=dict(version='2.0', generator='theseus-pcb build_pcb.py'), scene=0,
                  scenes=[dict(nodes=self.scene_nodes)], nodes=self.nodes, meshes=self.meshes,
                  materials=self.materials, accessors=self.accessors, bufferViews=self.buffer_views,
                  buffers=[dict(byteLength=len(self.bin))])
        if extras:
            gl['extras'] = extras
        js = json.dumps(gl, separators=(',', ':')).encode()
        while len(js) % 4:
            js += b' '
        out = struct.pack('<III', 0x46546C67, 2, 12 + 8 + len(js) + 8 + len(self.bin))
        out += struct.pack('<II', len(js), 0x4E4F534A) + js
        out += struct.pack('<II', len(self.bin), 0x004E4942) + bytes(self.bin)
        with open(path, 'wb') as f:
            f.write(out)
        return len(out)
