"""L1 lattice study: the shell's geometry, the lattice patterns and a conforming mesh.

The outer skin is the (z, s) chart from geo/extract.py: z along the mouse (+ forward), s the arc length round each
transverse section from the top midline (s > 0 the user's right, -X; s < 0 mirrored). Regions, all in (z, s):
  domain    the body: s_top(z) <= |s| <= s_bot(z); s_top is the trigger opening's edge (z > the rear cutout), s_bot the
            bottom edge of the wall (the outer skin at y = Y_BOT, the base ledge's mid-thickness) or, where a section is a
            closed loop (the tail and nose overhangs), its bottom at x = 0 (the two halves are stitched there)
  lattice   above the hard crease (outer skin y > Y_CREASE; F43.6) and inside the domain
Lattice patterns are laid flat in (z, s) (the chart is near-isometric on the sides and the crown, stretched on the tail
and nose slopes; edge lengths are reported). Topologies: 'tri' (isogrid: three families of continuous lines meeting at
six-way nodes, one family along the transverse arches), 'kagome' (the same three families shifted so crossings are
four-way: small triangles and hexagons), 'square' (lines along z and along s), 'diamond' (lines at +-45 deg), 'hex'
(honeycomb, walls zig-zag, no continuous line), 'none'. The density is the rib length per unit area, lam (1/mm):
tri/kagome H = 3/lam (line spacing), square/diamond a = 2/lam, hex wall L = 2/(sqrt(3) lam).
"""
import numpy as np
from scipy.spatial import Delaunay, cKDTree
from shapely.geometry import Polygon, LineString, MultiLineString, Point
from shapely.ops import unary_union
from shapely import prepared

CHART = '/home/claude/work/l1/geo/chart.npz'
Y_CREASE = 9.3      # the hard crease, mm above the pad (kit MS_SKIRT): the 'level' model
import os as _os
CREASE = _os.environ.get('L1_CREASE', 'level')
def y_crease(z):
    """the crease's height above the pad at z: 'level' 9.3 mm (the study's first model), or 'slope': one straight line
    from the tail tip (z -59.58, y 8.56) to the nose's lower corner (z 55.4, y 3.0), the same on both walls (Brock F47.2,
    F51; S2, 12:30): y = 8.56 - 0.04837 (z + 59.58)"""
    z = np.asarray(z, float)
    if CREASE == 'slope': return 8.56 - 0.04837 * (z + 59.58)
    return np.full(z.shape, Y_CREASE) if z.ndim else Y_CREASE
Y_BOT = 1.85        # the wall's bottom edge for the FE: the top of the 1.2 mm base ledge (0.65 to 1.85); the ledge is a beam ring
Z_NOSE = 54.5       # the mesh ends here; the chin (USB-C port) is closed by a deep beam, as the 3D lattice study did
Z_CUT = 4.8418      # the straight rear cutout (shell-theseus-1seam.json rearCutoutZ)


class Chart:
    def __init__(self, path=CHART):
        d = np.load(path)
        self.z, self.s, X, self.lab, self.S = d['z'], d['s'], d['X'], d['lab'], d['S']
        self.dz, self.ds = self.z[1] - self.z[0], self.s[1] - self.s[0]
        nz, ns = X.shape[:2]
        # pad past each contour's end with its last point (interpolation safety only; the domain test keeps us inside)
        Xf = X.copy()
        for i in range(nz):
            m = np.isfinite(X[i, :, 0])
            if not m.any(): Xf[i] = np.nan; continue
            k = np.where(m)[0][-1]; Xf[i, k + 1:] = X[i, k]
        self.X = Xf
        self.valid = np.isfinite(self.X[:, 0, 0])
        # per-section boundaries
        self.s_top = np.zeros(nz); self.s_bot = np.zeros(nz); self.s_cr = np.zeros(nz); self.closed = np.zeros(nz, bool)
        for i in range(nz):
            if not self.valid[i]: continue
            S = self.S[i]; m = self.s <= S + 1e-9; P = X[i, m]; ss = self.s[m]; lab = self.lab[i, m]
            if self.z[i] > Z_CUT:
                tr = np.where(lab == 1)[0]
                self.s_top[i] = ss[tr.max()] + 0.15 if len(tr) else 0.0
            y = P[:, 1]
            below = np.where((y <= Y_BOT) & (ss > self.s_top[i]))[0]
            if len(below):
                k = below[0]; f = (y[k - 1] - Y_BOT) / (y[k - 1] - y[k]); self.s_bot[i] = ss[k - 1] + f * (ss[k] - ss[k - 1])
            else:
                self.s_bot[i] = S; self.closed[i] = abs(P[-1, 0]) < 0.5
            ycr = float(y_crease(self.z[i]))
            cr = np.where((y <= ycr) & (ss >= self.s_top[i]))[0]
            if len(cr) and y[max(cr[0] - 1, 0)] > ycr:
                k = cr[0]; f = (y[k - 1] - ycr) / (y[k - 1] - y[k]); self.s_cr[i] = ss[k - 1] + f * (ss[k] - ss[k - 1])
            else:
                self.s_cr[i] = self.s_top[i]     # no lattice in this section
        # the nose: no mesh past Z_NOSE
        self.valid &= self.z <= Z_NOSE + 1e-9
        # smooth the bottom edge and the crease over about 2 mm of z, within runs of the same kind (open or closed)
        def smooth(a, idx, k=4):
            v = a[idx].copy(); vp = np.pad(v, k, mode='edge'); a[idx] = np.convolve(vp, np.ones(2 * k + 1) / (2 * k + 1), 'valid')
        for flag in (True, False):
            idx = np.where(self.valid & (self.closed == flag))[0]
            for r in np.split(idx, np.where(np.diff(idx) > 1)[0] + 1):
                if len(r) > 9:
                    if not flag: smooth(self.s_bot, r)       # a closed loop's end is its bottom at x = 0: keep it exact
                    smooth(self.s_cr, r)
        # smooth the opening's edge (label noise) over about 2 mm of z, forward of the cutout
        fw = np.where(self.valid & (self.z > Z_CUT) & (self.s_top > 0))[0]
        if len(fw) > 9:
            v = self.s_top[fw].copy(); k = 4
            vp = np.pad(v, k, mode='edge'); self.s_top[fw] = np.convolve(vp, np.ones(2 * k + 1) / (2 * k + 1), 'valid')
        # no lattice where the strip between the opening (or the midline) and the crease is under 3 mm (the nose, the
        # tail tip): a cell can't fit there
        thin = self.s_cr - self.s_top < 3.0
        self.s_cr[thin] = self.s_top[thin]
        # sections whose body part is empty (all trigger) or degenerate
        self.ok = self.valid & (self.s_bot > self.s_top + 0.5)
        iz = np.where(self.ok)[0]; self.zlo, self.zhi = self.z[iz[0]], self.z[iz[-1]]

    def _iz(self, z):
        f = (np.asarray(z, float) - self.z[0]) / self.dz
        i0 = np.clip(np.floor(f).astype(int), 0, len(self.z) - 2); return i0, f - i0

    def bnd(self, name, z):
        """a per-section boundary (s_top, s_bot, s_cr) interpolated at z"""
        a = getattr(self, name); i0, fz = self._iz(z); return a[i0] * (1 - fz) + a[i0 + 1] * fz

    def P(self, z, s):
        """outer-skin points at (z, s); s < 0 is the mirrored half (x -> -x)"""
        z = np.asarray(z, float); s = np.asarray(s, float); sa = np.abs(s)
        i0, fz = self._iz(z)
        g = sa / self.ds; j0 = np.clip(np.floor(g).astype(int), 0, len(self.s) - 2); fs = g - j0
        X = self.X
        out = (X[i0, j0] * ((1 - fz) * (1 - fs))[..., None] + X[i0 + 1, j0] * (fz * (1 - fs))[..., None]
               + X[i0, j0 + 1] * ((1 - fz) * fs)[..., None] + X[i0 + 1, j0 + 1] * (fz * fs)[..., None])
        out[..., 2] = z
        out[..., 0] = np.where(s < 0, -out[..., 0], out[..., 0])
        return out

    def frame(self, z, s, e=0.12):
        """outer skin point, unit outward normal, and the two chart tangents (d/dz, d/ds) at (z, s)"""
        z = np.asarray(z, float); s = np.asarray(s, float)
        Pz = (self.P(z + e, s) - self.P(z - e, s)) / (2 * e)
        sp = np.where(np.abs(s) < e, s + e, s); sm = np.where(np.abs(s) < e, s - e, s)
        sp = s + e; sm = s - e
        Ps = (self.P(z, sp) - self.P(z, sm)) / (2 * e)
        n = np.cross(Ps, Pz)            # outward for s>0 half? fixed below by a centroid test
        n /= np.linalg.norm(n, axis=-1, keepdims=True)
        X = self.P(z, s)
        c = np.array([0.0, 14.0, 0.0])
        flip = ((X - c) * n).sum(-1) < 0
        n[flip] *= -1
        return X, n, Pz, Ps

    # ---------------- region polygons in (z, s) ----------------
    def polygons(self, step=0.25):
        """the domain and the lattice region as shapely polygons in (z, s), both halves (the trigger hole cut out, its
        rear edge exactly at the cutout z = Z_CUT)"""
        iz = np.where(self.ok)[0]
        zz = self.z[iz]; st, sb, sc = self.s_top[iz], self.s_bot[iz], self.s_cr[iz]
        back = zz < Z_CUT; fwd = ~back
        st0 = st[fwd][0]                      # the opening's half-width at the cutout
        sc0 = sc[fwd][0]
        self.st0 = st0
        def half(sg):
            pts = [(z_, sg * b_) for z_, b_ in zip(zz, sb)]                                   # bottom edge, tail to nose
            pts += [(z_, sg * t_) for z_, t_ in zip(zz[fwd][::-1], st[fwd][::-1])]            # opening edge, nose to cutout
            pts += [(Z_CUT, sg * st0), (Z_CUT, 0.0)]                                           # the cutout, to the midline
            pts += [(z_, 0.0) for z_ in zz[back][::-1]]                                        # the midline back to the tail
            return Polygon(pts).buffer(0)
        dom = unary_union([half(1), half(-1)])
        def lhalf(sg):
            m = sc > st + 0.05
            pts = [(z_, sg * c_) for z_, c_, k in zip(zz, sc, m) if k]                         # crease, tail to nose
            pts += [(z_, sg * t_) for z_, t_, k, f in zip(zz[::-1], st[::-1], m[::-1], fwd[::-1]) if k and f]
            if m[fwd][0]: pts += [(Z_CUT, sg * st0)]
            pts += [(Z_CUT, 0.0)] + [(z_, 0.0) for z_, k in zip(zz[back][::-1], m[back][::-1]) if k]
            return Polygon(pts).buffer(0)
        lat = unary_union([lhalf(1), lhalf(-1)]).intersection(dom)
        return dom, lat


# ---------------- lattice lines in the flat (z, s) plane ----------------
def lattice_segments(kind, lam, region, z0=Z_CUT, crown_z=-14.0, phase=None):
    """rib segments (list of ((z1, s1), (z2, s2))) of a topology with rib length per area lam (1/mm), clipped to the
    lattice region polygon. Lines are infinite families clipped to the region; the hex walls are finite segments."""
    if kind in ('none', 'plain'): return []
    zmin, smin, zmax, smax = region.bounds
    span = max(zmax - zmin, smax - smin) * 1.6 + 40
    cz, cs = 0.5 * (zmin + zmax), 0.0
    lines = []
    def family(theta, H, phase):
        # lines with direction angle theta (in the (z, s) plane), spaced H, offset by phase*H, through the pattern origin
        d = np.array([np.cos(theta), np.sin(theta)]); n = np.array([-d[1], d[0]])
        o = np.array([z0, 0.0])
        c = np.array([cz, cs])
        kmin = int(np.floor(((c - o) @ n - span) / H)) - 1; kmax = int(np.ceil(((c - o) @ n + span) / H)) + 1
        for k in range(kmin, kmax + 1):
            p = o + n * (k + phase) * H
            # point on the line closest to c
            p = p + d * ((c - p) @ d)
            lines.append(LineString([tuple(p - d * span), tuple(p + d * span)]))
    if kind in ('tri', 'kagome'):
        H = 3.0 / lam
        # one family along s (the transverse arches: lines z = const, direction (0, 1)), the others at +-60 deg to it
        # phased so the rear cutout falls midway between two arches (as the 3D study)
        ph = [0.5, 0.5, 0.5] if kind == 'tri' else [0.5, 0.5, 0.0]
        # phase: a scalar adds the same offset to every family (NOT a translation: it changes the pattern's geometry; kept
        # only so the cached D5 runs stay reproducible); a list [d1, d2, d3] offsets each family: a pure translation v of
        # the pattern is d_i = n_i . v / H (n_1 = (-1, 0), n_2 = (-0.5, -0.866), n_3 = (-0.5, 0.866) in (z, s)), which
        # keeps d2 + d3 - d1 = 0. NB the labels: 'tri' (0.5, 0.5, 0.5) has d2 + d3 - d1 = 0.5, so its three families do NOT
        # meet at one point: it is the KAGOME (trihexagonal) pattern; 'kagome' (0.5, 0.5, 0) is concurrent: TRUE triangles.
        if isinstance(phase, (list, tuple)): ph = [p + d for p, d in zip(ph, phase)]
        elif phase is not None: ph = [p + phase for p in ph]
        for q, th in enumerate([np.pi / 2, np.pi / 2 + np.pi / 3, np.pi / 2 - np.pi / 3]):
            family(th, H, ph[q])
    elif kind == 'square':
        a = 2.0 / lam
        family(np.pi / 2, a, 0.5); family(0.0, a, 0.5)
    elif kind == 'diamond':
        a = 2.0 / lam
        family(np.pi / 4, a, 0.5); family(-np.pi / 4, a, 0.5)
    elif kind == 'hex':
        # honeycomb = the dual of a triangle lattice of edge at = sqrt(3) L, its vertices at the triangle centroids
        L = 2.0 / (np.sqrt(3) * lam); at = np.sqrt(3) * L; Ht = at * np.sqrt(3) / 2
        # triangle lattice with arches along s (rows at z = z0 + (i + 1/2) Ht), nodes along s at j*at (+at/2 on odd rows)
        segs = []
        imin = int(np.floor((zmin - z0) / Ht)) - 2; imax = int(np.ceil((zmax - z0) / Ht)) + 2
        jmax = int(np.ceil(max(abs(smin), abs(smax)) / at)) + 3
        def node(i, j): return np.array([z0 + (i + 0.5) * Ht, (j + 0.5 * (i % 2)) * at])
        cent = {}
        for i in range(imin, imax):
            for j in range(-jmax, jmax):
                a_, b_, c_ = node(i, j), node(i, j + 1), node(i + 1, j + (i % 2))       # up triangle
                cent[('u', i, j)] = (a_ + b_ + c_) / 3
                a2, b2, c2 = node(i, j + 1), node(i + 1, j + (i % 2)), node(i + 1, j + 1 + (i % 2))   # down triangle
                cent[('d', i, j)] = (a2 + b2 + c2) / 3
        # honeycomb walls: each up triangle's centroid joins the down triangles sharing its edges
        for (t_, i, j), p in cent.items():
            if t_ != 'u': continue
            for key in [('d', i, j), ('d', i, j - 1), ('d', i - 1, j - ((i - 1) % 2))]:
                if key in cent: segs.append(LineString([tuple(p), tuple(cent[key])]))
        lines = segs
    out = []
    preg = prepared.prep(region)
    for ln in lines:
        if not preg.intersects(ln): continue
        g = ln.intersection(region)
        geoms = [g] if g.geom_type == 'LineString' else list(getattr(g, 'geoms', []))
        for q in geoms:
            if q.geom_type != 'LineString' or q.length < 0.3: continue
            c = list(q.coords); out.append((c[0], c[-1]))
    return out


def boundary_lines(geom):
    """exterior and interior rings of a (multi)polygon as coordinate lists"""
    gs = [geom] if geom.geom_type == 'Polygon' else list(geom.geoms)
    rings = []
    for g in gs:
        rings.append(list(g.exterior.coords))
        for r in g.interiors: rings.append(list(r.coords))
    return rings


# ---------------- conforming mesh in (z, s) ----------------
def _split_at_crossings(segs, extra_lines=()):
    """split rib segments at every crossing with each other and with extra polylines; returns polylines' vertices"""
    allg = [LineString(s) for s in segs] + [LineString(l) for l in extra_lines]
    if not allg: return [], []
    U = unary_union(allg)              # noded: split at all crossings
    parts = [U] if U.geom_type == 'LineString' else list(U.geoms)
    return parts


def build_mesh(chart, kind, lam, h=1.5, rails=True, seed=0, verbose=False, phase=None):
    """the conforming triangulation of the body in (z, s). One noded arrangement of every constraint line (the domain's
    boundary, the crease line where there is a lattice, the rib segments), so nothing is duplicated; pieces are tagged
    'bnd' (free edge or the bottom edge), 'rail' (the boundary along the trigger opening and the cutout), 'crease',
    'rib'. Constraint points and fill points are kept apart; missing constraint edges get midpoints until all exist."""
    import shapely
    from shapely.geometry import LineString as LS
    dom, lat = chart.polygons()
    segs = lattice_segments(kind, lam, lat, phase=phase)
    lines = [LS(r) for r in boundary_lines(dom)]
    crease = []
    if kind not in ('none', 'plain'):
        iz = np.where(chart.ok & (chart.s_cr > chart.s_top + 0.05))[0]
        runs = np.split(iz, np.where(np.diff(iz) > 1)[0] + 1)
        for half in (1, -1):
            for r in runs:
                if len(r) >= 3: crease.append(LS([(chart.z[i], half * chart.s_cr[i]) for i in r]))
    lines += crease + [LS(s) for s in segs]
    U = unary_union(lines)
    parts = [U] if U.geom_type == 'LineString' else list(U.geoms)
    bnd_u = unary_union([LS(r) for r in boundary_lines(dom)])
    crease_u = unary_union(crease) if crease else None
    rib_u = unary_union([LS(s) for s in segs]) if segs else None
    st0 = chart.st0
    def is_rail(p):            # on the opening's edge: forward of the cutout, |s| = s_top(z); or on the cutout line
        z, s = p.x, abs(p.y)
        if abs(z - Z_CUT) < 0.05 and s <= st0 + 0.05: return True
        return z > Z_CUT and abs(s - chart.bnd('s_top', z)) < 0.08
    Pc = []; key = {}; cons = []
    def addp(p):
        k = (round(p[0], 5), round(p[1], 5))
        if k not in key: key[k] = len(Pc); Pc.append(p)
        return key[k]
    from shapely.geometry import Point as Pt
    def tag_of(p):
        if bnd_u.distance(p) < 0.05: return 'rail' if (rails and is_rail(p)) else 'bnd'
        if crease_u is not None and crease_u.distance(p) < 0.05: return 'crease'
        if rib_u is not None and rib_u.distance(p) < 1e-6: return 'rib'
        return None
    for g in parts:
        if g.length < 1e-6: continue
        if tag_of(g.interpolate(0.5, normalized=True)) is None: continue
        c = np.asarray(g.coords, float)
        # split at sharp corners (> 25 deg), then resample each run uniformly at about h along its length
        if len(c) > 2:
            d = np.diff(c, axis=0); an = np.arctan2(d[:, 1], d[:, 0]); turn = np.abs((np.diff(an) + np.pi) % (2 * np.pi) - np.pi)
            cuts = [0] + list(np.where(turn > np.radians(25))[0] + 1) + [len(c) - 1]
        else:
            cuts = [0, len(c) - 1]
        for c0, c1 in zip(cuts[:-1], cuts[1:]):
            run = c[c0:c1 + 1]
            if len(run) < 2: continue
            ls = LS(run); L = ls.length
            if L < 1e-9: continue
            n = max(1, int(np.ceil(L / h - 0.3)))
            pts = [tuple(run[0])] + [tuple(np.asarray(ls.interpolate(k / n, normalized=True).coords[0])) for k in range(1, n)] + [tuple(run[-1])]
            idx = [addp(p) for p in pts]
            for p, q in zip(idx[:-1], idx[1:]):
                if p != q:
                    mp = Pt(0.5 * (Pc[p][0] + Pc[q][0]), 0.5 * (Pc[p][1] + Pc[q][1]))
                    tg = tag_of(mp)
                    if tg is None:      # a chord of a curved line sits a hair off it: take the nearest feature
                        cand = [(bnd_u.distance(mp), 'bnd')] + ([(crease_u.distance(mp), 'crease')] if crease_u is not None else []) + ([(rib_u.distance(mp), 'rib')] if rib_u is not None else [])
                        tg = min(cand)[1]
                        if tg == 'bnd' and rails and is_rail(mp): tg = 'rail'
                    cons.append([p, q, tg])
    Pc = np.array(Pc)
    # fill points: a hex grid of spacing h inside the domain, away from every constraint line
    zmin, smin, zmax, smax = dom.bounds
    rh = h * np.sqrt(3) / 2
    gz, gs = np.meshgrid(np.arange(zmin, zmax + h, h), np.arange(smin, smax + rh, rh))
    gz = gz + (np.arange(gs.shape[0])[:, None] % 2) * h / 2
    Pf = np.c_[gz.ravel(), gs.ravel()]
    Pf = Pf[shapely.contains_xy(dom, Pf[:, 0], Pf[:, 1])]
    def dense(Pc, cons):
        out = []
        for a_, b_, _ in cons:
            A, B = Pc[a_], Pc[b_]; n = max(2, int(np.ceil(np.hypot(*(B - A)) / (h / 6))))
            out.append(A + (B - A) * np.linspace(0, 1, n)[:, None])
        return np.vstack(out)
    dd, _ = cKDTree(dense(Pc, cons)).query(Pf)
    Pf = Pf[dd > 0.5 * h]
    for it in range(12):
        allP = np.vstack([Pc, Pf]); tri = Delaunay(allP).simplices
        E = np.sort(np.concatenate([tri[:, [0, 1]], tri[:, [1, 2]], tri[:, [2, 0]]]), 1)
        Es = set(map(tuple, E))
        miss = [i for i, (a_, b_, _) in enumerate(cons) if tuple(sorted((a_, b_))) not in Es]
        if verbose: print('  conform iter', it, 'constraint edges', len(cons), 'missing', len(miss))
        if not miss: break
        newPc = list(map(tuple, Pc)); newcons = []
        ms = set(miss); added = []
        for i, (a_, b_, tg) in enumerate(cons):
            if i in ms:
                k = len(newPc); m_ = tuple(0.5 * (Pc[a_] + Pc[b_])); newPc.append(m_); added.append(m_)
                newcons += [[a_, k, tg], [k, b_, tg]]
            else: newcons.append([a_, b_, tg])
        Pc = np.array(newPc); cons = newcons
        if len(Pf):
            dd, _ = cKDTree(np.array(added)).query(Pf); Pf = Pf[dd > 0.45 * h]
    else:
        allP = np.vstack([Pc, Pf]); tri = Delaunay(allP).simplices
        E = np.sort(np.concatenate([tri[:, [0, 1]], tri[:, [1, 2]], tri[:, [2, 0]]]), 1); Es = set(map(tuple, E))
        miss = [i for i, (a_, b_, _) in enumerate(cons) if tuple(sorted((a_, b_))) not in Es]
        print('  WARNING: constraint edges still missing after 12 passes:', len(miss), [cons[i][2] for i in miss][:6])
        cons = [c_ for i, c_ in enumerate(cons) if i not in set(miss)]
    C = allP[tri].mean(1)
    tri = tri[shapely.contains_xy(dom, C[:, 0], C[:, 1])]
    used = np.unique(tri); remap = -np.ones(len(allP), int); remap[used] = np.arange(len(used))
    zs = allP[used]; tri = remap[tri]
    cons = [(remap[a_], remap[b_], tg) for a_, b_, tg in cons if remap[a_] >= 0 and remap[b_] >= 0]
    return dict(zs=zs, tri=tri, cons=cons, kind=kind, lam=lam, h=h, dom=dom, lat=lat, nseg=len(segs))


def to3d(chart, mesh):
    """map the (z, s) mesh to the outer skin, stitch the overhang slits, flip edges for 3D quality.
    Returns X (outer skin), n (outward normals), tri, edges by tag"""
    zs = mesh['zs']; tri = mesh['tri'].copy()
    X, n, _, _ = chart.frame(zs[:, 0], zs[:, 1])
    # stitch: the two halves meet at x = 0 on the overhangs' undersides (the slit at s = +-S(z) of closed sections).
    # The slit's two sides are resampled independently, so their nodes don't coincide: each slit node is merged with
    # the nearest slit node on the other side (both ways), which zips the slit shut
    tree = cKDTree(X); pairs = set(tree.query_pairs(0.02))
    # slit nodes: on the bottom boundary of a closed (tail) section; each is merged with its mirror (z, -s)
    zc = chart.z[chart.closed & chart.valid & (chart.z < 0)]
    zcl = zc.max() + 0.13 if len(zc) else -1e9
    onslit = (zs[:, 0] < zcl) & (np.abs(np.abs(zs[:, 1]) - chart.bnd('s_bot', zs[:, 0])) < 0.05) & (np.abs(zs[:, 1]) > 0.5)
    key = {(round(z_, 3), round(s_, 3)): i for i, (z_, s_) in enumerate(zs)}
    A_ = np.where(onslit & (zs[:, 1] > 0))[0]; B_ = np.where(onslit & (zs[:, 1] < 0))[0]; fnodes = np.where(onslit)[0]
    nmir = 0
    for a_ in A_:
        b_ = key.get((round(zs[a_, 0], 3), round(-zs[a_, 1], 3)))
        if b_ is not None: pairs.add((min(a_, b_), max(a_, b_))); nmir += 1
    _stat = dict(fnodes=len(fnodes), slitA=len(A_), slitB=len(B_), pairs0=len(pairs))
    if len(A_) and len(B_):
        ta, tb = cKDTree(X[A_]), cKDTree(X[B_])
        da, ia = tb.query(X[A_]); db, ib = ta.query(X[B_])
        for k, a in enumerate(A_):
            if da[k] < 2.5: pairs.add((min(a, B_[ia[k]]), max(a, B_[ia[k]])))
        for k, b in enumerate(B_):
            if db[k] < 2.5: pairs.add((min(b, A_[ib[k]]), max(b, A_[ib[k]])))
    rep = np.arange(len(X))
    for a, b in sorted(pairs):
        ra, rb = rep[a], rep[b]
        while rep[ra] != ra: ra = rep[ra]
        while rep[rb] != rb: rb = rep[rb]
        if ra != rb: rep[max(ra, rb)] = min(ra, rb)
    for i in range(len(rep)):
        r = i
        while rep[r] != r: r = rep[r]
        rep[i] = r
    for r in np.unique(rep):
        mem = np.where(rep == r)[0]
        if len(mem) > 1: X[r] = X[mem].mean(0); n[r] = n[mem].mean(0) / np.linalg.norm(n[mem].mean(0))
    tri = rep[tri]
    good = (tri[:, 0] != tri[:, 1]) & (tri[:, 1] != tri[:, 2]) & (tri[:, 0] != tri[:, 2])
    tri = tri[good]
    cons = [(rep[a], rep[b], tg) for a, b, tg in mesh['cons'] if rep[a] != rep[b]]
    used = np.unique(tri); remap = -np.ones(len(X), int); remap[used] = np.arange(len(used))
    X, n, zs = X[used], n[used], zs[used]; tri = remap[tri]
    cons = [(remap[a], remap[b], tg) for a, b, tg in cons if remap[a] >= 0 and remap[b] >= 0]
    # Lawson flips on 3D angles (constraint edges never flip)
    cset = set(tuple(sorted((a, b))) for a, b, _ in cons)
    tri = lawson3d(X, tri, cset)
    # orient triangles so their normal points outward
    nr = np.cross(X[tri[:, 1]] - X[tri[:, 0]], X[tri[:, 2]] - X[tri[:, 0]])
    flip = (nr * n[tri].mean(1)).sum(1) < 0
    tri[flip] = tri[flip][:, [0, 2, 1]]
    edges = {}
    for a, b, tg in cons: edges.setdefault(tg, set()).add(tuple(sorted((a, b))))
    edges = {k: np.array(sorted(v)) for k, v in edges.items()}
    _stat['pairs'] = len(pairs)
    return dict(X=X, n=n, zs=zs, tri=tri, edges=edges, stitch=_stat)


def lawson3d(X, tri, cset, maxit=20):
    tri = tri.copy()
    for it in range(maxit):
        # edge -> triangles
        E = {}
        for t, (a, b, c) in enumerate(tri):
            for (p, q, r) in ((a, b, c), (b, c, a), (c, a, b)):
                E.setdefault((min(p, q), max(p, q)), []).append((t, r))
        nflip = 0; touched = set()
        for (p, q), lst in E.items():
            if len(lst) != 2 or (p, q) in cset: continue
            (t1, r1), (t2, r2) = lst
            if t1 in touched or t2 in touched: continue
            def ang(o, u, v):
                a_ = X[u] - X[o]; b_ = X[v] - X[o]
                return np.arccos(np.clip((a_ @ b_) / (np.linalg.norm(a_) * np.linalg.norm(b_) + 1e-15), -1, 1))
            if ang(r1, p, q) + ang(r2, p, q) > np.pi + 1e-9:
                # flip p-q to r1-r2 if it keeps both triangles valid (positive area in 3D, not folded)
                n_old = np.cross(X[q] - X[p], X[r1] - X[p]) - np.cross(X[q] - X[p], X[r2] - X[p])
                c1 = np.cross(X[r2] - X[r1], X[p] - X[r1]); c2 = np.cross(X[r2] - X[r1], X[q] - X[r1])
                if (c1 @ c2) >= 0: continue        # r1-r2 does not separate p and q: not a convex quad
                tri[t1] = [r1, r2, p] if True else tri[t1]
                tri[t2] = [r2, r1, q]
                touched.add(t1); touched.add(t2); nflip += 1
        if nflip == 0: break
    return tri


def quality(X, tri):
    A = X[tri]
    L = np.stack([np.linalg.norm(A[:, 1] - A[:, 0], axis=1), np.linalg.norm(A[:, 2] - A[:, 1], axis=1), np.linalg.norm(A[:, 0] - A[:, 2], axis=1)], 1)
    def angle(a, b, c): return np.degrees(np.arccos(np.clip((b * b + c * c - a * a) / (2 * b * c), -1, 1)))
    ang = np.stack([angle(L[:, 1], L[:, 0], L[:, 2]), angle(L[:, 2], L[:, 1], L[:, 0]), angle(L[:, 0], L[:, 2], L[:, 1])], 1)
    return ang.min(1), L
