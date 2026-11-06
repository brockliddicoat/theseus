"""S1's shell build (Brock F46, 2026-11-06): from today's shell (shell-theseus-1seam.glb) to the one he picked.

  1. the rear cutout's corners: K3 "flowing" (rear_seam's machinery, S1's path: s1_seam.py), the side seam 1.2 mm in from
     the outline seen from above;
  2. the wheel opening O1: 9.0 x 19.3 mm, r 1.6, an even 1.0 mm gap round the wheel where it passes through the wall
     (the triggers' opening moved onto the new outline by a small displacement field in the top plane, each vertex kept
     at its depth under the skin);
  3. the creases ahead of the wheel: the Sora V2's soft chamfer each side of the split, from the opening's front corners to
     the nose, its edge in line with the opening's sides (x +-4.5), 0.35 mm deep at the split;
  4. (cancelled, F47.1: "don't change the side profile at all, just say it's 39.9") the 39.9 stretch; kept as an option only;
  5. the four board posts (MH1-4, #54): the rear pair hangs from the hump, the front pair stands on an arm from each side
     wall, under the triggers' travel (never on a trigger: they click); merged into the body;
  6. b04's skate ledges (gld_under / b04_skates): four identical corner ledges, 21 x 8.5 mm pills along each corner pair,
     three 6.5 mm slots 6.5 mm apart (the default pair at the ends, 13 mm apart), grown out of the wall with 2 mm fillets;
     the meta's corner dots move to the ledge ends.

    python3 s1_build.py [--out path.glb] [--steps 1,2,3,4,5,6] [--src glb]
"""
import argparse, json, os, sys, time
import numpy as np
from scipy.interpolate import RegularGridInterpolator
from shapely.geometry import Polygon, Point, LineString
from shapely.ops import unary_union
T3D = '/home/claude/theseus/3d/shell/tools'
sys.path.insert(0, T3D); sys.path.insert(0, '/home/claude/work/s1/scripts')
import glbio, one_seam
import s1_seam
from geo_options import rrect
from heightmap import HeightMap

ap = argparse.ArgumentParser()
ap.add_argument('--src', default='/home/claude/theseus/3d/shell/shell-theseus-1seam.glb')
ap.add_argument('--out', default='/home/claude/work/s1/build/shell-s1.glb')
ap.add_argument('--steps', default='1,2,3,5,6')        # 4 (the 39.9 stretch) cancelled by Brock, F47.1
ap.add_argument('--corner', default='K3')
args = ap.parse_args()
STEPS = set(int(s) for s in args.steps.split(','))
os.makedirs(os.path.dirname(args.out), exist_ok=True)
t0 = time.time()
def log(*a): print('[%5.1fs]' % (time.time() - t0), *a, flush=True)

Y_C = 9.3                       # the hard crease: nothing below it changes
H_OLD, H_NEW = 38.12, 39.9      # the scan's height, Brock's (F12.11, F46.4)
SH = (H_NEW - Y_C) / (H_OLD - Y_C)
O1 = dict(hx=4.5, z0=27.8, z1=47.1, r=1.6)          # the wheel opening (scene X, Z), before the stretch (plan view)
CREASE = dict(x=4.5, depth=0.35, soft=0.55, ramp=1.2)
BOARD_TOP = 5.03
LAY_DZ = -2.88                  # mouse z = layout z - 2.88; mouse X = -layout x
MH = {'MH1': (10.10, 29.50), 'MH2': (-10.10, 29.50), 'MH3': (14.59, -2.25), 'MH4': (-14.59, -2.25)}   # board plan 5 (layout x, z)
POST = dict(od=5.3, bore=3.2, bore_depth=4.0, insert='M2 heat-set, OD 3.5 x 3.0 (parts API)', arm_w=2.4, arm_h=3.0, arm_y=18.5)
RHO = 1.01e-3                   # PP-C-20A, g per mm^3 (3d/lattice: Pyrofil 1.01 g/cm3)

js, b = glbio.read(args.src)
NAMES = [n['name'] for n in js['nodes'] if 'mesh' in n]
M = {}
for nm in NAMES:
    _, d = glbio.mesh_arrays(js, b, nm)
    M[nm] = [d['POSITION'].astype(float), d['NORMAL'].astype(float), d['COLOR_0'].astype(float), d['indices'].reshape(-1, 3).astype(np.int64)]
meta = json.load(open(args.src.replace('.glb', '.json')))
REPORT = {}

# ------------------------------------------------------------------ 1. the rear corners
if 1 in STEPS:
    RS = s1_seam.install(args.corner)
    mm = {k: tuple(M[k]) for k in ('triggerL', 'triggerR', 'body')}
    moved, info = RS.apply(mm, verbose=False)
    for k, v in moved.items(): M[k][0], M[k][1] = v[0].astype(float), v[1].astype(float)
    REPORT['corner'] = dict(kind=args.corner, det_min=info['det_min'])
    log('1. corners', args.corner, 'det_min', info['det_min'])

# the skin from above (grooves closed, the opening filled by the crown), for steps 2 and 3
hm = HeightMap([(k, *M[k]) for k in ('body', 'triggerL', 'triggerR')])
YS = RegularGridInterpolator((hm.zs, hm.xs), np.where(hm.Y > 0, hm.Y, np.nan), bounds_error=False, fill_value=np.nan)
def skin_y(x, z): return YS(np.c_[z, x])

# ------------------------------------------------------------------ 2. the wheel opening
if 2 in STEPS:
    # today's opening, from the left trigger's top ring (twin) is x +-4.85, z 28.31..46.8 with small rounds; take it from the
    # mesh: the triggers' vertices that bound the hole, seen from above
    import cv2
    res_ = 0.04; xs_ = np.arange(-7.5, 7.5, res_); zs_ = np.arange(24.0, 51.0, res_)
    mask = np.zeros((len(zs_), len(xs_)), np.uint8)
    for k in ('triggerL', 'triggerR'):
        P_, T_ = M[k][0], M[k][3]
        sel = (P_[T_][:, :, 1].min(1) > 15) & (np.abs(P_[T_][:, :, 0]).min(1) < 8) & (P_[T_][:, :, 2].min(1) > 23) & (P_[T_][:, :, 2].max(1) < 52)
        q = np.stack([(P_[:, 0] - xs_[0]) / res_, (P_[:, 2] - zs_[0]) / res_], 1)
        for t in T_[sel]: cv2.fillConvexPoly(mask, np.round(q[t] * 16).astype(np.int32), 255, lineType=cv2.LINE_8, shift=4)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (13, 13)))     # close the 0.25 mm split
    hole = (mask == 0).astype(np.uint8)
    n_, lab = cv2.connectedComponents(hole)
    lc = lab[np.argmin(np.abs(zs_ - 37.0)), np.argmin(np.abs(xs_))]
    cs, _ = cv2.findContours((lab == lc).astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    cc = max(cs, key=len).reshape(-1, 2)
    old = np.c_[xs_[0] + cc[:, 0] * res_, zs_[0] + cc[:, 1] * res_]
    REPORT['opening_old'] = dict(x=[round(float(old[:, 0].min()), 2), round(float(old[:, 0].max()), 2)], z=[round(float(old[:, 1].min()), 2), round(float(old[:, 1].max()), 2)])
    new = rrect(-O1['hx'], O1['z0'], O1['hx'], O1['z1'], O1['r'], n=40)
    def by_arclen(R, n=1600):
        A2 = np.sum(R[:, 0] * np.roll(R[:, 1], -1) - np.roll(R[:, 0], -1) * R[:, 1])
        if A2 < 0: R = R[::-1]
        R = np.vstack([R, R[:1]]); s = np.r_[0, np.cumsum(np.linalg.norm(np.diff(R, axis=0), axis=1))]
        # start at the rear centre (x 0, z min), go round the same way on both
        u = np.linspace(0, s[-1], n, endpoint=False)
        P = np.c_[np.interp(u, s, R[:, 0]), np.interp(u, s, R[:, 1])]
        k = np.argmin(np.abs(P[:, 0]) + 10 * (P[:, 1] > (R[:, 1].min() + 1)))
        return np.roll(P, -k, axis=0)
    Po, Pn = by_arclen(old), by_arclen(new)
    D = Pn - Po
    from scipy.spatial import cKDTree
    tree = cKDTree(Po)
    RF = 2.6                      # the field fades to nothing 2.6 mm outside the old outline
    oldP = Polygon(old)
    for k in ('triggerL', 'triggerR'):
        P = M[k][0]
        xz = P[:, [0, 2]]
        dist, idx = tree.query(xz)
        near = (dist < RF) & (P[:, 2] > 20) & (P[:, 2] < 55)
        inside = np.array([oldP.contains(Point(q)) for q in xz[near]])
        r = dist[near] * np.where(inside, -1, 1)
        w = np.clip(1 - r / RF, 0, 1); w = np.where(r <= 0, 1.0, w * w * (3 - 2 * w))
        dxz = D[idx[near]] * w[:, None]
        p0 = P[near].copy()
        depth = skin_y(p0[:, 0], p0[:, 2]) - p0[:, 1]
        p1 = p0.copy(); p1[:, 0] += dxz[:, 0]; p1[:, 2] += dxz[:, 1]
        ok = np.isfinite(depth)
        y1 = skin_y(p1[:, 0], p1[:, 2]) - depth
        p1[ok, 1] = y1[ok]
        P[near] = p1
        M[k][0] = P
    meta['wheelOpen'] = dict(hx=O1['hx'], z0=O1['z0'], z1=O1['z1'], r=O1['r'], gap=1.0, note='O1 (F46.1): an even 1.0 mm gap round the wheel where it passes through the 1.4 mm wall')
    log('2. opening O1')

# ------------------------------------------------------------------ 3. the creases (the soft chamfer ahead of the wheel)
if 3 in STEPS:
    xc, d, soft, ramp = CREASE['x'], CREASE['depth'], CREASE['soft'], CREASE['ramp']
    z_open = O1['z1'] if 2 in STEPS else 46.42
    def dy(x, z):
        t = np.abs(x) / xc
        e = soft / xc
        g = np.where(t < 1 - e, 1 - t, np.where(t < 1 + e, (1 + e - t) ** 2 / (4 * e), 0.0))   # 1 - t with its kink at t 1 rounded (C1)
        wz = np.clip((z - z_open) / ramp, 0, 1); wz = wz * wz * (3 - 2 * wz)
        return -d * g * wz
    def dy_grad(x, z, h=0.02):
        return (dy(x + h, z) - dy(x - h, z)) / (2 * h), (dy(x, z + h) - dy(x, z - h)) / (2 * h)
    for k in ('triggerL', 'triggerR'):
        P, N = M[k][0], M[k][1]
        m = (P[:, 2] > z_open - 0.5) & (np.abs(P[:, 0]) < xc + soft + 0.2)
        dd = dy(P[m, 0], P[m, 2]); gx, gz = dy_grad(P[m, 0], P[m, 2])
        P[m, 1] += dd
        n = N[m]; up = n[:, 1] > 0.3                      # the skin facing up: tilt its normal with the slope
        n2 = n.copy(); n2[up, 0] -= gx[up] * n[up, 1]; n2[up, 2] -= gz[up] * n[up, 1]
        n2 /= np.linalg.norm(n2, axis=1, keepdims=True); N[m] = n2
    meta['creases'] = dict(x=xc, z0=z_open, depth=d, soft=soft, note='the Sora V2 chamfer each side of the split ahead of the wheel (F43.5); its edge runs at x +-x from the opening to the lip')
    log('3. creases')

# ------------------------------------------------------------------ 4. the height: 39.9 above the crease
if 4 in STEPS:
    for k, (P, N, C, T) in M.items():
        up = P[:, 1] > Y_C
        P[up, 1] = Y_C + (P[up, 1] - Y_C) * SH
        N[up, 1] /= SH; N[up] /= np.linalg.norm(N[up], axis=1, keepdims=True)
    yw = meta['wheel']['center'][1]
    crown = float(skin_y(np.array([0.0]), np.array([meta['wheel']['center'][2]]))[0])   # before the stretch
    lift = (crown - Y_C) * (SH - 1)
    meta['wheel']['center'][1] = round(yw + lift, 3)
    meta['wheel']['axleHeight'] = round(meta['wheel']['center'][1] - BOARD_TOP, 3)
    for s_ in ('L', 'R'):
        p = meta['hinge'][s_]['pivot']
        if p[1] > Y_C: p[1] = round(Y_C + (p[1] - Y_C) * SH, 4)
    meta['height'] = H_NEW; meta['heightNote'] = 'F12.11 / F46.4: 39.9 mm, the scan (38.12) stretched 6.25 % above the 9.3 mm crease'
    REPORT['height'] = dict(sH=round(SH, 5), wheel_lift=round(lift, 3), crown_over_wheel=round(crown, 3))
    log('4. height 39.9: wheel up %.3f mm' % lift)

# ------------------------------------------------------------------ helpers for new geometry
def add_mesh(name, P, N, T, color=1.0):
    P0, N0, C0, T0 = M[name]
    C = np.tile([color, color, color, 1.0], (len(P), 1))
    M[name] = [np.vstack([P0, P]), np.vstack([N0, N]), np.vstack([C0, C]), np.vstack([T0, T + len(P0)])]

def cylinder(cx, cz, y0, y1, r, n=40, caps=(True, True), r_in=None):
    """a vertical tube (or rod) from y0 to y1, outward normals; r_in > 0 makes it hollow (bore from below)"""
    a = np.linspace(0, 2 * np.pi, n, endpoint=False)
    ring = np.c_[np.cos(a), np.sin(a)]
    P, N, T = [], [], []
    def band(rad, ya, yb, sgn):
        base = len(P)
        for y in (ya, yb):
            for c in ring: P.append([cx + rad * c[0], y, cz + rad * c[1]]); N.append([sgn * c[0], 0, sgn * c[1]])
        for i in range(n):
            j = (i + 1) % n
            t1, t2 = (base + i, base + n + i, base + j), (base + j, base + n + i, base + n + j)
            T.extend([t1, t2] if sgn > 0 else [t1[::-1], t2[::-1]])
    band(r, y0, y1, 1)
    def disk(y, rad_o, rad_i, sgn):
        base = len(P)
        for c in ring: P.append([cx + rad_o * c[0], y, cz + rad_o * c[1]]); N.append([0, sgn, 0])
        if rad_i:
            for c in ring: P.append([cx + rad_i * c[0], y, cz + rad_i * c[1]]); N.append([0, sgn, 0])
            for i in range(n):
                j = (i + 1) % n; t1, t2 = (base + i, base + j, base + n + i), (base + j, base + n + j, base + n + i)
                T.extend([t1, t2] if sgn < 0 else [t1[::-1], t2[::-1]])
        else:
            P.append([cx, y, cz]); N.append([0, sgn, 0]); c0 = len(P) - 1
            for i in range(n):
                j = (i + 1) % n; t = (base + i, base + j, c0)
                T.append(t if sgn < 0 else t[::-1])
    if caps[0]: disk(y0, r, r_in, -1)
    if caps[1]: disk(y1, r, None, 1)
    if r_in:
        band(r_in, y0, y0 + POST['bore_depth'], -1); disk(y0 + POST['bore_depth'], r_in, None, -1)
    return np.array(P, float), np.array(N, float), np.array(T, np.int64)

def box(x0, x1, y0, y1, z0, z1):
    V = np.array([[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], float)
    F = [((0, 3, 2, 1), (0, 0, -1)), ((4, 5, 6, 7), (0, 0, 1)), ((0, 1, 5, 4), (0, -1, 0)), ((3, 7, 6, 2), (0, 1, 0)),
         ((0, 4, 7, 3), (-1, 0, 0)), ((1, 2, 6, 5), (1, 0, 0))]
    P, N, T = [], [], []
    for q, n in F:
        base = len(P)
        for i in q: P.append(V[i]); N.append(n)
        T.extend([(base, base + 1, base + 2), (base, base + 2, base + 3)])
    return np.array(P), np.array(N, float), np.array(T, np.int64)

def body_section(z0):
    """the body's outer contour at z = z0 (scene X, Y), for the walls the arms meet"""
    P, N, C, T = M['body']
    A, B_, Cc = P[T[:, 0]], P[T[:, 1]], P[T[:, 2]]
    d = np.stack([A[:, 2], B_[:, 2], Cc[:, 2]], 1) - z0
    m = (d.min(1) < 0) & (d.max(1) > 0)
    pts = []
    for a, bb, c, dd in zip(A[m], B_[m], Cc[m], d[m]):
        for (p, q, dp, dq) in ((a, bb, dd[0], dd[1]), (bb, c, dd[1], dd[2]), (c, a, dd[2], dd[0])):
            if (dp < 0) != (dq < 0): t = dp / (dp - dq); pts.append((p + t * (q - p))[:2])
    return np.array(pts)

# ------------------------------------------------------------------ 5. the board posts
if 5 in STEPS:
    posts = []; mass = 0.0
    for nm, (lx, lz) in MH.items():
        X, Z = -lx, lz + LAY_DZ
        S = body_section(Z)
        if nm in ('MH1', 'MH2'):
            # the front pair: an arm from the side wall (below the trigger seam), the post under it
            ya, yb = POST['arm_y'] - POST['arm_h'] / 2, POST['arm_y'] + POST['arm_h'] / 2
            side = np.sign(X)
            wall = S[(np.abs(S[:, 1] - POST['arm_y']) < 0.6) & (S[:, 0] * side > 0)]
            xw = (np.abs(wall[:, 0]).min() if len(wall) else 28.0) * side      # the inner skin is the nearer face
            x_in = X - side * 0.0; x_out = xw - side * 0.2                     # into the wall by 0.2 mm
            Pp, Np_, Tp = cylinder(X, Z, BOARD_TOP, yb, POST['od'] / 2, r_in=POST['bore'] / 2)
            Pa, Na, Ta = box(min(X, x_out), max(X, x_out), ya, yb, Z - POST['arm_w'] / 2, Z + POST['arm_w'] / 2)
            add_mesh('body', Pp, Np_, Tp, color=0.15); add_mesh('body', Pa, Na, Ta, color=0.15)
            vol = np.pi * ((POST['od'] / 2) ** 2) * (yb - BOARD_TOP) - np.pi * (POST['bore'] / 2) ** 2 * POST['bore_depth'] + abs(x_out - X) * POST['arm_w'] * POST['arm_h']
            posts.append(dict(name=nm, x=round(X, 3), z=round(Z, 3), y0=BOARD_TOP, y1=round(yb, 3), arm=[round(X, 2), round(x_out, 2)], vol=round(vol, 1)))
        else:
            # the rear pair: hung from the hump's inner skin straight down to the board
            top = S[(np.abs(S[:, 0] - X) < 0.6)][:, 1]
            y_in = (top.max() - 1.0) if len(top) else 34.0                      # 1.0 mm into the 0.9-1.2 mm wall
            Pp, Np_, Tp = cylinder(X, Z, BOARD_TOP, y_in, POST['od'] / 2, r_in=POST['bore'] / 2, caps=(True, False))
            add_mesh('body', Pp, Np_, Tp, color=0.15)
            vol = np.pi * ((POST['od'] / 2) ** 2) * (y_in - BOARD_TOP) - np.pi * (POST['bore'] / 2) ** 2 * POST['bore_depth']
            posts.append(dict(name=nm, x=round(X, 3), z=round(Z, 3), y0=BOARD_TOP, y1=round(y_in, 3), vol=round(vol, 1)))
        mass += vol * RHO
    meta['posts'] = dict(items=posts, od=POST['od'], bore=POST['bore'], boreDepth=POST['bore_depth'], insert=POST['insert'],
                         massG=round(mass, 3), note='S1 stand-ins (#54): the board is screwed from below into MH1-4; the front pair stands on arms from the side walls under the triggers\' travel, the rear pair hangs from the hump')
    REPORT['posts'] = meta['posts']
    log('5. posts: %.2f g' % mass)

# ------------------------------------------------------------------ 6. b04's skate ledges
# The body's foot is a floor ring 1.2 mm thick (base y 0.65, top 1.85) round the inside of the wall, with the old scalloped
# pads at the corners. Each corner gets b04's ledge (a pill along the corner pair and a web out to the wall, r 2 fillets
# where its ends meet the wall), merged into the ring: in a window round each ledge the ring's base and top faces are
# re-triangulated as (old faces there) U (ledge), less the faces kept round it (no cracks, no coplanar overlap); new walls
# only where the ledge's edge leaves the ring; the ring's own step walls that end up inside the ledge go.
if 6 in STEPS:
    import mapbox_earcut as earcut
    from shapely import contains_xy
    from shapely.geometry import MultiLineString
    INTERIOR_AO = 0.15                       # build_parts.ao_fn: 1 - 0.85 for everything under the outer skin
    sk = np.array(meta['skates'], float)     # scene (X, Z), 8 corner dots, in corner pairs
    pairs, used = [], set()
    for i in range(8):
        if i in used: continue
        j = min((k for k in range(8) if k != i and k not in used), key=lambda k: np.linalg.norm(sk[k] - sk[i]))
        used |= {i, j}; pairs.append((sk[i], sk[j]))
    Pb_, Nb_, Cb_, Tb_ = M['body']
    A_ = Pb_[Tb_]; fn_ = np.cross(A_[:, 1] - A_[:, 0], A_[:, 2] - A_[:, 0]); nr_ = fn_ / np.maximum(np.linalg.norm(fn_, axis=1)[:, None], 1e-12)
    cen = A_.mean(1)
    isb = (nr_[:, 1] < -0.9) & (A_[:, :, 1].max(1) < 0.7)                                   # the ring's base (y 0.65)
    ist = (nr_[:, 1] > 0.9) & (A_[:, :, 1].min(1) > 1.7) & (A_[:, :, 1].max(1) < 2.0)       # the ring's top (y 1.85)
    isw = (np.abs(nr_[:, 1]) < 0.35) & (A_[:, :, 1].min(1) > 0.55) & (A_[:, :, 1].max(1) < 1.95)   # its step walls
    Y_B = float(np.median(A_[isb][:, :, 1])); Y_T = float(np.median(A_[ist][:, :, 1]))
    tri2 = lambda t: Polygon(t[:, [0, 2]])
    def union_tris(sel, eps=1e-5):
        g = unary_union([tri2(t).buffer(eps, join_style=2) for t in A_[sel] if tri2(t).area > 1e-10])
        return g.buffer(-eps, join_style=2)
    Rb = union_tris(isb)
    foot = Rb.buffer(3.0).buffer(-3.0)                      # closes the screw counterbores' notches
    foot = max(foot.geoms, key=lambda g: g.area) if foot.geom_type != 'Polygon' else foot
    foot = Polygon(foot.exterior)
    Rt = union_tris(ist).buffer(0.05).buffer(-0.05)
    Rt = max(Rt.geoms, key=lambda g: g.area) if Rt.geom_type != 'Polygon' else Rt
    top_outer = Polygon(Rt.exterior)                        # where the ring's top meets the wall's fillet
    ledges, newdots, Ls = [], [], []
    for (p, q) in pairs:
        c = (p + q) / 2; u = (q - p) / np.linalg.norm(q - p); n = np.array([-u[1], u[0]])
        if np.dot(n, c) < 0: n = -n                         # outward
        half, w0 = 6.25, 4.25                               # 21.0 x 8.5: the three 6.5 mm dots (19.5 mm) with 0.75 all round
        pill = LineString([c - u * half, c + u * half]).buffer(w0, quad_segs=24)
        web = Polygon([c - u * (half + 2.0) - n * 0.5, c + u * (half + 2.0) - n * 0.5, c + u * (half + 2.0) + n * 16, c - u * (half + 2.0) + n * 16])
        L_ = unary_union([pill, web]).intersection(foot)
        L_ = L_.buffer(2.0, quad_segs=16).buffer(-2.0, quad_segs=16).intersection(foot)   # r 2 fillets where it meets the wall
        if L_.geom_type != 'Polygon': L_ = max(L_.geoms, key=lambda g: g.area)
        Ls.append(L_)
        slots = [c + u * k for k in (-6.5, 0.0, 6.5)]
        ledges.append(dict(c=[round(float(v), 3) for v in c], u=[round(float(v), 4) for v in u], n=[round(float(v), 4) for v in n],
                           length=2 * (half + w0), width=2 * w0, slots=[[round(float(v), 3) for v in s_] for s_ in slots]))
        newdots += [slots[0], slots[2]]
    Lu = unary_union(Ls)
    # the ring's own flat faces stay exactly as they are; the ledge adds only what lies outside them, so every shared edge
    # is an old edge (no cracks, no coplanar overlap); the ring's step walls and edge rounds wholly inside a ledge go
    from scipy.spatial import cKDTree
    Rt_in = [Polygon(h) for h in Rt.interiors]
    inner_edge = unary_union([p.exterior for p in Rt_in]) if Rt_in else None
    Lin = Lu.buffer(0.02)
    allin = np.all(np.stack([contains_xy(Lin, A_[:, k, 0], A_[:, k, 2]) for k in range(3)], 1), 1)
    from shapely import distance as sdist, points as spoints
    near_edge = (sdist(spoints(cen[:, 0], cen[:, 2]), inner_edge) < 0.6) if inner_edge is not None else np.zeros(len(cen), bool)
    drop_w = (~isb) & (~ist) & (A_[:, :, 1].min(1) > 0.55) & (A_[:, :, 1].max(1) < 1.95) & allin & near_edge
    drop_b = np.zeros(len(cen), bool); drop_t = np.zeros(len(cen), bool)
    nearL = contains_xy(Lu.buffer(6.0), cen[:, 0], cen[:, 2])
    def union_exact(sel):
        return unary_union([tri2(t) for t in A_[sel] if tri2(t).area > 1e-12])
    Kb, Kt = union_exact(isb & nearL), union_exact(ist & nearL)
    Nb = Lu.intersection(foot).difference(Kb)
    Nt = Lu.intersection(top_outer).difference(Kt)
    # heights: a vertex that is an old one keeps its height (the round's edge, the base), new ones sit on the planes
    oldV = Pb_[np.unique(Tb_[(isb | ist) & nearL])]
    tree = cKDTree(oldV[:, [0, 2]])
    newP, newN, newT = [], [], []
    def cap(G, y, up):
        polys = [G] if G.geom_type == 'Polygon' else [g for g in getattr(G, 'geoms', []) if g.geom_type == 'Polygon']
        for g in polys:
            if g.area < 1e-4: continue
            rings = [np.array(g.exterior.coords)[:-1]] + [np.array(h.coords)[:-1] for h in g.interiors]
            V2 = np.vstack(rings); ends = np.cumsum([len(r_) for r_ in rings]).astype(np.uint32)
            tr = earcut.triangulate_float64(V2, ends).reshape(-1, 3)
            if not len(tr): continue
            dd, ii = tree.query(V2)
            ys = np.where(dd < 1e-6, oldV[ii, 1], y)
            ys = np.where(np.abs(ys - y) < 0.2, ys, y)              # only the same plane's vertices (base or top)
            V3 = np.c_[V2[:, 0], ys, V2[:, 1]]
            e1 = V3[tr[:, 1]] - V3[tr[:, 0]]; e2 = V3[tr[:, 2]] - V3[tr[:, 0]]; ny = np.cross(e1, e2)[:, 1]
            tr = np.where(((ny > 0) == up)[:, None], tr, tr[:, ::-1])
            ar = np.abs(ny) / 2; tr = tr[ar > 1e-9]
            base = sum(len(x) for x in newP)
            newP.append(V3); newN.append(np.tile([0.0, 1.0 if up else -1.0, 0.0], (len(V3), 1))); newT.append(tr + base)
    cap(Nb, Y_B, False); cap(Nt, Y_T, True)
    # new walls: the ledge's edge over the void (it stops 0.15 mm short of the ring's flat face, past the old step wall)
    wl = Lu.boundary.difference(Rb.buffer(0.15)).intersection(foot.buffer(-0.3))
    lines = [wl] if wl.geom_type == 'LineString' else [g for g in getattr(wl, 'geoms', []) if g.geom_type == 'LineString']
    nwall = 0
    for ln in lines:
        Q = np.array(ln.coords)
        for i in range(len(Q) - 1):
            a2, b2 = Q[i], Q[i + 1]; e = b2 - a2; le = np.linalg.norm(e)
            if le < 1e-6: continue
            nn = np.array([e[1], -e[0]]) / le
            mid = (a2 + b2) / 2
            if Lu.contains(Point(*(mid + nn * 0.03))): nn = -nn          # the wall faces away from the ledge
            V3 = np.array([[a2[0], Y_B, a2[1]], [b2[0], Y_B, b2[1]], [b2[0], Y_T, b2[1]], [a2[0], Y_T, a2[1]]])
            tr = np.array([[0, 1, 2], [0, 2, 3]])
            f = np.cross(V3[1] - V3[0], V3[2] - V3[0])
            if np.dot(f, [nn[0], 0, nn[1]]) < 0: tr = tr[:, ::-1]
            base = sum(len(x) for x in newP)
            newP.append(V3); newN.append(np.tile([nn[0], 0.0, nn[1]], (4, 1))); newT.append(tr + base); nwall += 1
    drop = drop_b | drop_t | drop_w
    M['body'][3] = Tb_[~drop]
    add_mesh('body', np.vstack(newP), np.vstack(newN), np.vstack(newT), color=INTERIOR_AO)
    meta['ledges'] = dict(items=ledges, y=[round(Y_B, 3), round(Y_T, 3)], fillet=2.0,
                          note='b04_skates spec (gld_under): four identical corner ledges 21.0 x 8.5 (three 6.5 mm slots, 0.75 margin), grown out of the floor ring and the wall with r 2 fillets; the default dots at the ends (13 mm apart)')
    meta['skates'] = [[round(float(v[0]), 3), round(float(v[1]), 3)] for v in newdots]
    REPORT['ledges'] = dict(dots=meta['skates'], dropped=dict(stepWallsAndRounds=int(drop_w.sum())), newWalls=nwall,
                            area=dict(ledges=round(Lu.area, 1), base=round(Nb.area, 1), top=round(Nt.area, 1)))
    log('6. ledges: %d old step-wall/round faces inside the ledges dropped; base %.1f / top %.1f mm2 added; %d wall quads' % (drop_w.sum(), Nb.area, Nt.area, nwall))

# ------------------------------------------------------------------ write
rep = {k: (M[k][0].astype(np.float32), M[k][1].astype(np.float32), M[k][2], M[k][3].astype(np.uint32)) for k in M}
size = one_seam.write(js, b, rep, [], args.out)
meta['rearCorner'] = args.corner
meta['triangles'] = {k: int(len(M[k][3])) for k in M}; meta['trianglesTotal'] = int(sum(len(M[k][3]) for k in M))
meta['note'] = ('S1 build 2026-11-06 (F46, F47): one seam; the rear cutout straight at rearCutoutZ with corner %s; wheel opening O1; '
                'the Sora creases ahead of the wheel; board posts over MH1-4; b04 ledges; the side profile and the scan-derived skin unchanged (F47.1)' % args.corner
                + ('; 39.9 mm stretch' if 4 in STEPS else ''))
json.dump(meta, open(args.out.replace('.glb', '.json'), 'w'), separators=(',', ':'))
json.dump(REPORT, open(args.out.replace('.glb', '.report.json'), 'w'), indent=1)
log('wrote', args.out, size // 1024, 'KB')
