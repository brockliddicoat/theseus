"""L2 geometry: Theseus's top shell with L1's final lattices, as moulded, built from L1's own generator (read-only).

Patterns (L1's code labels are swapped; see l1geo's docstring and L1 PROGRESS 12:14):
  'kag' = KAGOME (woven: two ribs cross at a time)  = L1 code 'tri',    lam 0.2382 (G-win-h0.55, the study's winner)
  'tri' = TRUE TRIANGLES (six ribs meet at a node)  = L1 code 'kagome', lam 0.2398 (H-kagome-t0.60)
Both at 9.35 g (L1 solved lam so the skin is 0.60 at the budget). Crease: L1's sloped line (l1geo.y_crease 'slope').

2D (the developed (z, s) chart, as L1): rib lines, crease line, rails, junctions. 3D: the outer skin from the chart, a 0.60 mm
skin, ribs 0.36 (root) x 1.80 with 0.5 deg draft per side and 0.24 mm root fillets swept along each line, node fillets 0.22 mm
in plan as a prism at every junction, the crease rib, rails 1.1 x 1.5 (opening) and 1.15 x 2.0 (cutout)."""
import env
import numpy as np, json, time, sys
from shapely.geometry import LineString, Point, Polygon, MultiPolygon
from shapely.ops import unary_union
import mapbox_earcut as earcut
from l1geo import Chart, lattice_segments, Z_CUT, Z_NOSE, y_crease

PAT = {'kag': dict(code='tri', lam=0.2382, label='Kagome (woven)'),
       'tri': dict(code='kagome', lam=0.2398, label='True triangles')}
T_SKIN = 0.60; W_RIB = 0.36; H_RIB = 1.80; DRAFT = 0.5; R_ROOT = 0.24; R_NODE = 0.22
RAIL_SIDE = (1.1, 1.5); RAIL_CUT = (1.15, 2.0)
EMB = 0.05            # solids start this far inside the skin (no gaps)
_CH = None


def chart():
    global _CH
    if _CH is None:
        _CH = Chart(); _CH.dom, _CH.lat = _CH.polygons()
    return _CH


# ------------------------------------------------------------------ 2D
def crease_lines(ch):
    iz = np.where(ch.ok & (ch.s_cr > ch.s_top + 0.05))[0]
    runs = np.split(iz, np.where(np.diff(iz) > 1)[0] + 1)
    out = []
    for half in (1, -1):
        for r in runs:
            if len(r) >= 3: out.append(np.c_[ch.z[r], half * ch.s_cr[r]])
    return out


def rail_lines(ch):
    """the opening's edge (each half, cutout to nose) and the cutout line (z = Z_CUT across)"""
    iz = np.where(ch.ok & (ch.z >= Z_CUT))[0]
    out = [np.c_[ch.z[iz], h * ch.s_top[iz]] for h in (1, -1)]
    cut = np.c_[[Z_CUT, Z_CUT], [-ch.st0, ch.st0]]
    return out, cut


def pattern2d(key):
    ch = chart(); p = PAT[key]
    segs = lattice_segments(p['code'], p['lam'], ch.lat)
    segs = [np.array(s, float) for s in segs]
    # junctions between rib lines: pairwise crossings, grouped (three lines meet at one point in true triangles)
    pts = []
    for i in range(len(segs)):
        a = LineString(segs[i])
        for j in range(i + 1, len(segs)):
            g = a.intersection(LineString(segs[j]))
            if g.is_empty or g.geom_type != 'Point': continue
            pts.append((g.x, g.y, i, j))
    nodes = []
    for x, y, i, j in pts:
        for nd in nodes:
            if abs(nd['p'][0] - x) < 1e-5 and abs(nd['p'][1] - y) < 1e-5:
                nd['lines'] |= {i, j}; break
        else:
            nodes.append(dict(p=(x, y), lines={i, j}))
    # arms of each node: the directions of its lines, both ways unless the line ends there
    for nd in nodes:
        arms = []
        for i in nd['lines']:
            A, B = segs[i]; d = (B - A) / np.linalg.norm(B - A); P = np.array(nd['p'])
            if np.linalg.norm(P - A) > 0.05: arms.append(-d)
            if np.linalg.norm(P - B) > 0.05: arms.append(d)
        nd['arms'] = arms; nd['n_ribs'] = len(nd['lines']); nd['lines'] = sorted(nd['lines'])
    # rib ends on the crease (T-junctions with the crease rib)
    cr = crease_lines(ch)
    cru = unary_union([LineString(c) for c in cr])
    tees = []
    for k, (A, B) in enumerate(segs):
        for P, Q in ((A, B), (B, A)):
            if cru.distance(Point(P)) < 0.02:
                d = (Q - P) / np.linalg.norm(Q - P)
                # the crease's direction there
                best = None
                for c in cr:
                    ls = LineString(c); dd = ls.distance(Point(P))
                    if best is None or dd < best[0]:
                        m = ls.project(Point(P)); a_ = np.array(ls.interpolate(max(m - 0.5, 0)).coords[0]); b_ = np.array(ls.interpolate(min(m + 0.5, ls.length)).coords[0])
                        best = (dd, (b_ - a_) / np.linalg.norm(b_ - a_))
                tees.append(dict(p=tuple(P), arms=[d, best[1], -best[1]], rib=k))
    L2 = float(sum(np.linalg.norm(B - A) for A, B in segs))
    return dict(segs=segs, nodes=nodes, tees=tees, crease=cr, L2=L2)


# ------------------------------------------------------------------ 3D helpers
def frame(ch, z, s):
    X, n, Pz, Ps = ch.frame(np.asarray(z, float), np.asarray(s, float))
    return X, n, Pz, Ps


def rib_profile(w=W_RIB, h=H_RIB, rr=R_ROOT, draft=DRAFT, narc=5):
    """closed CCW polygon in (b, d): b across the rib, d depth below the skin's inner face (+ inward). Root fillets tangent
    to the face and to the flank; flanks drafted; the base EMB inside the skin."""
    hw = w / 2; tw = hw - h * np.tan(np.radians(draft))
    P = [(-(hw + rr), -EMB), ((hw + rr), -EMB), ((hw + rr), 0.0)]
    if rr > 0:
        for ph in np.linspace(-np.pi / 2, -np.pi, narc + 1)[1:]:
            P.append((hw + rr + rr * np.cos(ph), rr + rr * np.sin(ph)))
    P += [(tw, h), (-tw, h)]
    if rr > 0:
        for ph in np.linspace(0.0, -np.pi / 2, narc + 1)[:-1]:
            P.append((-(hw + rr) + rr * np.cos(ph), rr + rr * np.sin(ph)))
        P.append((-(hw + rr), 0.0))
    else:
        P += [(-hw, 0.0)]
    return np.array(P)


def rect_profile(b0, b1, h):
    return np.array([(b0, -EMB), (b1, -EMB), (b1, h), (b0, h)])


class Mesh:
    def __init__(self):
        self.V, self.F, self.N, self.M = [], [], [], []      # vertices, faces, per-corner normals (F,3,3), material per face
        self.nv = 0

    def add(self, V, F, N, mat):
        V = np.asarray(V, float); F = np.asarray(F, np.int64)
        self.V.append(V); self.F.append(F + self.nv); self.N.append(np.asarray(N, np.float32)); self.M.append(np.full(len(F), mat, np.int16))
        self.nv += len(V)

    def arrays(self):
        return np.vstack(self.V), np.vstack(self.F), np.vstack(self.N), np.concatenate(self.M)


def face_normals(V, F):
    n = np.cross(V[F[:, 1]] - V[F[:, 0]], V[F[:, 2]] - V[F[:, 0]])
    return n / np.maximum(np.linalg.norm(n, axis=1, keepdims=True), 1e-12)


def orient_out(V, F, inside_pts):
    """flip faces so their normals point away from the nearest of the given interior points"""
    n = face_normals(V, F); C = V[F].mean(1)
    from scipy.spatial import cKDTree
    _, k = cKDTree(inside_pts).query(C)
    bad = ((C - inside_pts[k]) * n).sum(1) < 0
    F = F.copy(); F[bad] = F[bad][:, [0, 2, 1]]
    return F


def sweep(ch, path, profile, mat, mesh, t=T_SKIN, step=0.3, side=None, caps=True):
    """sweep a (b, d) profile along a path given in (z, s) (resampled at `step` mm of (z, s) length). b's sign: +b is
    n x T (or, with side = 'out', toward larger |s|)."""
    path = np.asarray(path, float)
    seg = np.r_[0, np.cumsum(np.linalg.norm(np.diff(path, axis=0), axis=1))]
    if seg[-1] < 1e-6: return
    n_ = max(2, int(np.ceil(seg[-1] / step)) + 1)
    u = np.linspace(0, seg[-1], n_)
    zs = np.c_[np.interp(u, seg, path[:, 0]), np.interp(u, seg, path[:, 1])]
    X, n, Pz, Ps = frame(ch, zs[:, 0], zs[:, 1])
    ok = np.isfinite(X).all(1) & np.isfinite(n).all(1) & np.isfinite(Ps).all(1)
    if ok.sum() < 2: return
    X, n, Pz, Ps, zs = X[ok], n[ok], Pz[ok], Ps[ok], zs[ok]; n_ = len(X)
    T = np.gradient(X, axis=0); T -= (T * n).sum(1, keepdims=True) * n; T /= np.linalg.norm(T, axis=1, keepdims=True)
    b = np.cross(n, T)
    if side == 'out':
        # +b toward larger |s|: compare with the chart's d/ds (times the sign of s)
        sg = np.sign(zs[:, 1] + 1e-9)
        flip = ((b * Ps).sum(1) * sg) < 0
        b[flip] *= -1
    Xi = X - n * t
    k = len(profile)
    V = Xi[:, None, :] + b[:, None, :] * profile[None, :, 0, None] - n[:, None, :] * profile[None, :, 1, None]
    V = V.reshape(-1, 3)
    F = []
    for i in range(n_ - 1):
        for j in range(k):
            a, b_, c, d = i * k + j, i * k + (j + 1) % k, (i + 1) * k + (j + 1) % k, (i + 1) * k + j
            F += [(a, b_, c), (a, c, d)]
    F = np.array(F)
    if caps:
        tri = earcut.triangulate_float64(profile, np.array([k], np.uint32)).reshape(-1, 3)
        F = np.vstack([F, tri, tri + (n_ - 1) * k])
    # interior points for orientation: the profile's inner point (0, d_mid) along the path
    pin = np.array([profile[:, 0].mean(), 0.5 * (profile[:, 1].min() + profile[:, 1].max())])
    inner = Xi + b * pin[0] - n * pin[1]
    # denser inner points (between stations) for robust orientation
    F = orient_out(V, F, np.vstack([inner, 0.5 * (inner[1:] + inner[:-1])]))
    fn = face_normals(V, F)
    mesh.add(V, F, np.repeat(fn[:, None, :], 3, 1), mat)


def prism(ch, p, arms, mat, mesh, t=T_SKIN, w=W_RIB, h=H_RIB, rn=R_NODE, L=1.6, extra=None):
    """the node fillets: the union of the arms' strips closed by rn, in the local tangent plane at p, as a prism from the
    skin (EMB inside it) to the rib's depth. Returns the plan polygon (local mm)."""
    z0, s0 = p
    X, n, Pz, Ps = frame(ch, np.array([z0]), np.array([s0]))
    X, n, Pz, Ps = X[0], n[0], Pz[0], Ps[0]
    e1 = Pz - (Pz @ n) * n; e1 /= np.linalg.norm(e1); e2 = np.cross(n, e1)
    strips = []
    for a in arms:
        v = a[0] * Pz + a[1] * Ps; v -= (v @ n) * n; v /= np.linalg.norm(v)
        d2 = np.array([v @ e1, v @ e2])
        strips.append(LineString([(0, 0), tuple(L * d2)]).buffer(w / 2, cap_style='flat'))
    if extra is not None: strips.append(extra)
    U = unary_union(strips + [Point(0, 0).buffer(w / 2 / np.cos(np.radians(30)), 24)])
    C = U.buffer(rn, join_style='round', quad_segs=8).buffer(-rn, join_style='round', quad_segs=8)
    C = C.intersection(Point(0, 0).buffer(L - 0.35, 48))       # trim the closing's rounded arm ends (buried in the ribs)
    if C.geom_type == 'MultiPolygon': C = max(C.geoms, key=lambda g: g.area)
    ring = np.array(C.exterior.coords)[:-1]
    k = len(ring)
    tri = earcut.triangulate_float64(ring, np.array([k], np.uint32)).reshape(-1, 3)
    base = X - n * t
    V0 = base + ring[:, 0, None] * e1 + ring[:, 1, None] * e2 + n * EMB
    V1 = base + ring[:, 0, None] * e1 + ring[:, 1, None] * e2 - n * h
    V = np.vstack([V0, V1])
    F = [tri, tri + k]
    side = []
    for j in range(k):
        a, b_ = j, (j + 1) % k
        side += [(a, b_, b_ + k), (a, b_ + k, a + k)]
    F = np.vstack(F + [np.array(side)])
    F = orient_out(V, F, np.array([base - n * (h / 2)]))
    fn = face_normals(V, F)
    mesh.add(V, F, np.repeat(fn[:, None, :], 3, 1), mat)
    return C


def skin_rows(ch, y_lo=1.30):
    """per chart row (z <= Z_NOSE): s from the opening (or the midline behind the cutout) down to the wall at y = y_lo (or the
    end of a closed tail section)"""
    rows = []
    for i in np.where(ch.ok)[0]:
        z = ch.z[i]
        s_lo = 0.0 if z < Z_CUT - 1e-9 else ch.s_top[i]
        S = ch.S[i]; ss = ch.s[ch.s <= S + 1e-9]; P = ch.X[i, :len(ss)]
        y = P[:, 1]
        if ch.closed[i]: s_hi = S
        else:
            k = np.where((y <= y_lo) & (ss > s_lo + 1))[0]
            if len(k) == 0: s_hi = S
            else:
                k = k[0]; f = (y[k - 1] - y_lo) / (y[k - 1] - y[k]); s_hi = ss[k - 1] + f * (ss[k] - ss[k - 1])
        rows.append((z, s_lo, s_hi))
    R = np.array(rows)
    # the cutout row: the last row behind the cutout, exactly at Z_CUT (full width), and the first ahead of it (from st0)
    return R


def skin(ch, mesh, t=T_SKIN, ds=0.35, mat_out=0, mat_in=1, mat_edge=2):
    R = skin_rows(ch)
    zb = R[:, 0]
    # block R (behind the cutout, plus the row at Z_CUT) and block F (from Z_CUT, starting at the opening's edge)
    iR = np.where(zb < Z_CUT)[0]; iF = np.where(zb >= Z_CUT)[0]
    rowR = [(z, a, b) for z, a, b in R[iR]] + [(Z_CUT, 0.0, np.interp(Z_CUT, zb, R[:, 2]))]
    rowF = [(Z_CUT, ch.st0, np.interp(Z_CUT, zb, R[:, 2]))] + [(z, a, b) for z, a, b in R[iF] if z > Z_CUT + 1e-6]
    for block, open_lo in ((rowR, False), (rowF, True)):
        B = np.array(block)
        K = int(np.ceil((B[:, 2] - B[:, 1]).max() / ds)) + 1
        u = np.linspace(0, 1, K)
        for half in (1, -1):
            Z = np.repeat(B[:, 0:1], K, 1); Sv = half * (B[:, 1:2] + (B[:, 2:3] - B[:, 1:2]) * u[None, :])
            X, n, _, _ = frame(ch, Z.ravel(), Sv.ravel())
            good = (np.isfinite(X).all(1) & np.isfinite(n).all(1)).reshape(Z.shape).all(1)
            if not good.all():                                   # degenerate rows at the chart's ends: drop them
                Z, Sv = Z[good], Sv[good]
                X, n, _, _ = frame(ch, Z.ravel(), Sv.ravel())
            nr, nc = Z.shape
            idx = np.arange(nr * nc).reshape(nr, nc)
            q = np.c_[idx[:-1, :-1].ravel(), idx[:-1, 1:].ravel(), idx[1:, 1:].ravel(), idx[1:, :-1].ravel()]
            F = np.vstack([q[:, [0, 1, 2]], q[:, [0, 2, 3]]])
            Fo = F.copy(); fn = face_normals(X, Fo); flip = (fn * n[Fo].mean(1)).sum(1) < 0; Fo[flip] = Fo[flip][:, [0, 2, 1]]
            mesh.add(X, Fo, n[Fo], mat_out)
            Xi = X - n * t
            Fi = Fo[:, [0, 2, 1]]
            mesh.add(Xi, Fi, -n[Fi], mat_in)
            # cut edges: the opening's edge (block F's s_lo column), the cutout row (block R's last row, s < st0), the bottom
            edges = []
            edges.append(idx[:, -1])                               # bottom (or the closed tail's stitch: hidden anyway)
            if open_lo: edges.append(idx[:, 0])
            else:
                last = idx[-1]; sv = np.abs(Sv[-1]); edges.append(last[sv <= ch.st0 + 1e-6])
            for e in edges:
                if len(e) < 2: continue
                A = X[e]; Bi = Xi[e]; m = len(e)
                V = np.vstack([A, Bi]); FF = []
                for j in range(m - 1): FF += [(j, j + 1, m + j + 1), (j, m + j + 1, m + j)]
                FF = np.array(FF); fn = face_normals(V, FF)
                mesh.add(V, FF, np.repeat(fn[:, None, :], 3, 1), mat_edge)
    return R


def glb_parts():
    """the body's base ledge (below y 1.6) and chin (past Z_NOSE), and the two buttons, from the repo's GLB (read only)"""
    sys.path.insert(0, '/home/claude/theseus/3d/shell/tools')
    import glbio
    js, b = glbio.read('/home/claude/theseus/3d/shell/shell-theseus-1seam.glb')
    out = {}
    for name in ('body', 'triggerL', 'triggerR'):
        _, d = glbio.mesh_arrays(js, b, name)
        P = d['POSITION'].astype(float); N = d['NORMAL'].astype(float); T = d['indices'].reshape(-1, 3).astype(np.int64)
        out[name] = (P, N, T)
    return out


def build3d(key, verbose=True):
    t0 = time.time()
    ch = chart(); P2 = pattern2d(key)
    mesh = Mesh()
    MAT = dict(skin_out=0, skin_in=1, skin_edge=2, rib=3, node=4, crease=5, rail=6, ledge=7, button=8)
    skin(ch, mesh)
    prof = rib_profile()
    for A, B in P2['segs']: sweep(ch, np.array([A, B]), prof, MAT['rib'], mesh)
    for c in P2['crease']: sweep(ch, c, prof, MAT['crease'], mesh)
    rails, cut = rail_lines(ch)
    for r in rails: sweep(ch, r, rect_profile(0.0, RAIL_SIDE[0], RAIL_SIDE[1]), MAT['rail'], mesh, side='out')
    # the cutout rail: behind the cutout line (toward -z): +b must point to -z
    cutp = np.c_[np.full(30, Z_CUT - RAIL_CUT[0] / 2), np.linspace(-ch.st0, ch.st0, 30)]
    sweep(ch, cutp, rect_profile(-RAIL_CUT[0] / 2, RAIL_CUT[0] / 2, RAIL_CUT[1]), MAT['rail'], mesh)
    plans = []
    for nd in P2['nodes']:
        C = prism(ch, nd['p'], nd['arms'], MAT['node'], mesh); plans.append(C.area)
    for te in P2['tees']:
        prism(ch, te['p'], te['arms'], MAT['node'], mesh)
    # GLB: ledge and chin of the body, buttons
    G = glb_parts()
    P, N, T = G['body']; C = P[T].mean(1)
    keep = (C[:, 1] < 1.6) | (C[:, 2] > Z_NOSE)
    mesh.add(P, T[keep], N[T[keep]], MAT['ledge'])
    for nm in ('triggerL', 'triggerR'):
        P, N, T = G[nm]; mesh.add(P, T, N[T], MAT['button'])
    V, F, NN, M = mesh.arrays()
    if verbose: print(key, 'verts', len(V), 'faces', len(F), 'nodes', len(P2['nodes']), 'tees', len(P2['tees']), '%.1fs' % (time.time() - t0), flush=True)
    return dict(V=V, F=F, N=NN, M=M, MAT=MAT, P2=P2)


if __name__ == '__main__':
    for key in sys.argv[1:] or ['kag', 'tri']:
        G = build3d(key)
        np.savez_compressed('/home/claude/work/l2/out/geo_%s.npz' % key, V=G['V'], F=G['F'], N=G['N'], M=G['M'])
        P2 = G['P2']
        json.dump(dict(n_lines=len(P2['segs']), L2=P2['L2'], nodes=[dict(p=nd['p'], n_ribs=nd['n_ribs']) for nd in P2['nodes']],
                       tees=[te['p'] for te in P2['tees']], segs=[s.tolist() for s in P2['segs']], crease=[c.tolist() for c in P2['crease']]),
                  open('/home/claude/work/l2/out/p2_%s.json' % key, 'w'))
