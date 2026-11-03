"""Build all shell parts as meshes from SDFs.
python3 build_parts.py <variant sora|theseus> <skingrid.npz> <out.npz> [parts=comma list]
"""
import sys, time, json, numpy as np, trimesh, pymeshlab
from scipy.ndimage import map_coordinates
sys.path.insert(0, '/home/claude/theseus/3d/shell/tools')
from sdf import Skin, I_round, U_round, Raster2D, RoundPoly2D, round_rect2, cyl_x, grad_fd
from skimage.measure import marching_cubes
import features as FT

VARIANT = sys.argv[1]
GRID = np.load(sys.argv[2])
VOL, LO, H = GRID['vol'], GRID['lo'], float(GRID['h'])
SKIN = Skin(GRID['S'].astype(float), GRID['N'].astype(float), k=8, sym=True)
OUT = sys.argv[3]
ONLY = sys.argv[4].split(',') if len(sys.argv) > 4 else None
T0 = time.time()
def log(*a): print('[%6.1fs]' % (time.time() - T0), *a, flush=True)

g = FT.GAP; rE = FT.R_EDGE
SB = FT.SB_THESEUS if VARIANT == 'theseus' else FT.SB_SORA
WO = FT.WHEEL_OPEN

# ------------------------------------------------------------------ 2D helper fields
def footprint_raster():
    """bottom outline: skin section at y = Y_BASE + 0.35 (inside the rounded bottom edge)."""
    xs = np.arange(-33, 33, 0.1); zs = np.arange(-62, 62, 0.1)
    X, Z = np.meshgrid(xs, zs, indexing='xy')
    P = np.c_[X.ravel(), np.full(X.size, FT.Y_BASE + 0.35), Z.ravel()]
    f = sample_grid(P).reshape(X.shape)
    import cv2
    m = (f < 0).astype(np.uint8)
    cs, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    c = max(cs, key=len)[:, 0, :].astype(float)
    poly = np.c_[xs[0] + c[:, 0] * 0.1, zs[0] + c[:, 1] * 0.1]
    return poly

def sample_grid(P):
    c = (P - LO) / H
    return map_coordinates(VOL, [c[:, 0], c[:, 1], c[:, 2]], order=1, mode='nearest')

FP_POLY = footprint_raster()
FP = Raster2D([FP_POLY], (-34, -63), (34, 63), px=0.05)
log('footprint', FP_POLY[:, 0].min(), FP_POLY[:, 0].max(), FP_POLY[:, 1].min(), FP_POLY[:, 1].max())

# dot skates: 2 per corner, inset from the footprint (#10), pads solid (#11)
def skate_layout():
    from shapely.geometry import Polygon
    pg = Polygon(FP_POLY).buffer(-(3.25 + 1.15))
    ring = np.array(pg.exterior.coords)
    pts = []
    for sx in (1, -1):
        for sz, zz in ((1, None), (-1, None)):
            # corner = point of the inset ring closest to the bbox corner
            cx, cz = sx * 40, sz * 80
            i = np.argmin(np.hypot(ring[:, 0] - cx, ring[:, 1] - cz))
            # walk along the ring both ways ~ 7.6 mm from the corner point
            d = np.r_[0, np.cumsum(np.hypot(*np.diff(ring, axis=0).T))]
            L = d[-1]
            for s in (-4.1, 4.1):
                t = (d[i] + s) % L
                j = np.searchsorted(d, t)
                pts.append(ring[min(j, len(ring) - 1)])
    return np.array(pts)

SKATES = skate_layout()
SENSOR = np.array([0.0, 0.0])      # (x, z): centre (Kim et al. CHI 2020: centre is the best compromise)
def pad2d(x, z):
    d = np.full(np.shape(x), 1e9)
    for (sx, sz) in SKATES:
        d = np.minimum(d, np.hypot(x - sx, z - sz) - (3.25 + 1.05))
    return d
def rim2d(x, z):   # negative inside the rim zone (ring + corner pads)
    return U_round(-(FP(x, z) + FT.W_RIM), pad2d(x, z), 2.2)
def open2d(x, z):  # plate opening (negative inside)
    return -rim2d(x, z)

# screws (#52): at the opening edge, clear of the skate pads
def screw_layout():
    from shapely.geometry import Polygon, Point
    out = []
    for zz in (17.0, -24.0):
        xs = np.linspace(0, 32, 3201)
        v = open2d(xs, np.full_like(xs, zz))
        xe = xs[np.argmax(v > 0)]           # opening edge
        for sx in (1, -1):
            out.append((sx * (xe + 0.0), zz))
    return np.array(out)
SCREWS = screw_layout()
log('skates', np.round(SKATES, 1).tolist()); log('screws', np.round(SCREWS, 1).tolist())

# side-button outlines (z, y) on the +X wall
from shapely.geometry import Polygon as _Poly
def _rounded(poly, r):
    p = _Poly(poly).buffer(-r, join_style=2).buffer(r, resolution=32)
    return np.array(p.exterior.coords)
SB_POLYS = [_rounded(b['poly'], b['r']) for b in SB]
SB_R = [RoundPoly2D(b['poly'], b['r']) for b in SB]   # exact, smooth (raster SDFs left kinks on the 1.1 mm roll-over)
SB_NAMES = [b['name'] for b in SB]
def sb2d(i, z, y):
    return SB_R[i](z, y) - SB[i]['r'] * 0
# rounded polygon: shrink then grow by r for rounded corners
def sb_round(i, z, y):
    return SB_R[i](z, y)

# ------------------------------------------------------------------ 3D building blocks
def env(P, sk):
    """outer envelope: skin with flat bottom at Y_BASE, rounded bottom edge."""
    return I_round(sk, FT.Y_BASE - P[:, 1], 0.45)

R_JUNCTION = 2.2   # the rear cutout turns down into the side seam on a radius, like the real part
def zone_minus(P):   # trigger zone shrunk by half gaps (trigger material side)
    return I_round(FT.hump_sdf(P, VARIANT) + g / 2, FT.lip_sdf(P) + FT.lip_gap(P) / 2, R_JUNCTION)
def zone_plus(P):
    return I_round(FT.hump_sdf(P, VARIANT) - g / 2, FT.lip_sdf(P) - FT.lip_gap(P) / 2, R_JUNCTION + g)

def opening(P):  # wheel opening, rounded rect in XZ (negative inside)
    return round_rect2(P[:, 0], P[:, 2], 0.0, 0.5 * (WO['z0'] + WO['z1']), WO['hx'], 0.5 * (WO['z1'] - WO['z0']), WO['r'])
def channel(P):  # Theseus: opening extended to the nose (bridge = channel ahead of the opening)
    return round_rect2(P[:, 0], P[:, 2], 0.0, 0.5 * (WO['z0'] + 75), WO['hx'], 0.5 * (75 - WO['z0']), WO['r'])

def trigger(P, sk, side):
    sh = np.maximum(env(P, sk), -(sk + FT.T_TRIG))
    split = g / 2 - side * P[:, 0]
    reg = np.maximum(zone_minus(P), split)
    if VARIANT == 'theseus':
        reg = np.maximum(reg, g / 2 - channel(P))
    else:
        reg = np.maximum(reg, -opening(P))
    return I_round(sh, reg, rE)

def body(P, sk):
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    E = env(P, sk)
    # cavity above the flange + plate opening through the flange
    cav = np.maximum(sk + FT.T_BODY, FT.Y_FLANGE - y)
    op = np.maximum(open2d(x, z), y - (FT.Y_FLANGE + 0.8))
    hole = np.minimum(cav, op)
    sol = I_round(E, -hole, 0.25)
    # region: outside the trigger zone (+ bridge for Theseus)
    reg = -zone_plus(P)
    sol = I_round(sol, reg, rE)
    # side-button pockets (+X side)
    for i in range(len(SB)):
        pk = np.maximum(SB_R[i](z, y) - g / 2, 16.0 - x)
        sol = I_round(sol, -pk, 0.2)
    # Theseus divider rib between the side buttons (#29): proud, rounded, part of the unibody wall
    if VARIANT == 'theseus':
        d = FT.DIVIDER
        zc_, hz_ = 0.5 * (d['z0'] + d['z1']), 0.5 * (d['z1'] - d['z0']) - g / 2
        # rib spans the buttons' height band (follows their slant): y between 18.6 and 24.6 at z~7
        rib2 = round_rect2(z, y, zc_, 21.6, hz_, 3.05, 1.1)
        rib = np.maximum(I_round(sk - d['proud'], rib2, 1.0), -(sk + 1.6))
        rib = np.maximum(rib, 15.0 - x)
        sol = U_round(sol, rib, 0.35)
    # USB-C recess in the front wall + receptacle opening
    rr = round_rect2(x, y, FT.USB['cx'], FT.USB['cy'], FT.USB['hw'], FT.USB['hh'], FT.USB['r'])
    rec = np.maximum(rr, (ZF_USB - FT.USB['depth']) - z)
    sol = I_round(sol, -rec, 0.3)
    stad = round_rect2(x, y, 0.0, FT.USB['cy'], FT.USBC['w'] / 2 + 0.15, FT.USBC['h'] / 2 + 0.15, FT.USBC['h'] / 2 + 0.15)
    sol = np.maximum(sol, -np.maximum(stad, (ZF_USB - FT.USB['depth'] - 4.0) - z))
    # plate screw counterbores in the rim (half on rim, half on plate)
    for (sx, sz) in SCREWS:
        cb = np.maximum(np.hypot(x - sx, z - sz) - 2.25, y - (FT.Y_BASE + 1.0))
        sol = np.maximum(sol, -cb)
    return sol

def bridge(P, sk):
    """#58: fixed cap between the triggers ahead of the wheel (no centre split there); mounted on the wheel bay."""
    sh = np.maximum(env(P, sk), -(sk + FT.T_TRIG))
    reg = np.maximum(np.maximum(channel(P) + g / 2, WO['z1'] - P[:, 2]), zone_minus(P))
    return I_round(sh, reg, rE)

def core(P, sk):
    """stand-in for the internals: a dark volume inside the cavity so seams/lattice don't show daylight."""
    c = np.maximum(sk + FT.T_BODY + 0.9, np.maximum(FT.Y_FLANGE + 0.8 - P[:, 1], P[:, 1] - 33.0))
    bayhole = round_rect2(P[:, 0], P[:, 2], 0.0, 0.5 * (WO['z0'] + WO['z1']), 6.4, 0.5 * (WO['z1'] - WO['z0']) + 2.6, 1.5)
    return np.maximum(c, -bayhole)

def side_button(P, sk, i):
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    out2 = SB_R[i](z, y) + g / 2
    # pillow: stands ~0.7 mm proud at the lower edge rising to ~1.2 mm at the upper edge (measured on the scan:
    # 0.44 -> 1.14 front, ~0.8-1.0 rear); the wall leans in, the button face stays nearly vertical
    pz = np.array(SB[i]['poly'])
    zf, zr = pz[0, 0], pz[2, 0]
    tz = np.clip((z - zr) / (zf - zr), 0, 1)
    ymid = (0.5 * (pz[2, 1] + pz[3, 1])) * (1 - tz) + (0.5 * (pz[0, 1] + pz[1, 1])) * tz
    hh = (0.5 * (pz[2, 1] - pz[3, 1])) * (1 - tz) + (0.5 * (pz[1, 1] - pz[0, 1])) * tz
    t = np.clip((y - ymid) / hh, -1, 1)
    proud = 0.95 + 0.25 * t
    top = I_round(sk - proud, out2, 1.1)
    sol = np.maximum(top, -(sk + FT.SB_DEPTH))
    sol = np.maximum(sol, 16.0 - x)
    # rails (#80): two bars on the inner face, along the press direction (-X)
    pz = np.array(SB[i]['poly'])
    zc_ = pz[:, 0].mean(); yc_ = pz[:, 1].mean()
    L = abs(pz[0, 0] - pz[2, 0])
    for f in (-0.28, 0.28):
        bz = zc_ + f * L
        rail = round_rect2(z, y, bz, yc_, 0.55, 1.3, 0.3)
        rail = np.maximum(rail, np.maximum(-(sk + 4.4), sk + FT.SB_DEPTH - 0.3))
        sol = np.minimum(sol, rail)
    return sol

def plate(P, sk):
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    p2 = open2d(x, z) + g
    slab = np.maximum(FT.Y_BASE - y, y - FT.Y_FLANGE)
    sol = I_round(I_round(p2, FT.Y_BASE - y, 0.35), y - FT.Y_FLANGE, 0.2)
    # triangle lattice (#75): three strut families at 0/60/120 deg; only complete triangles become holes
    a = 6.2; w = 1.15; rc = 0.9
    q = np.stack([x, z], 1)
    ns = [np.array([np.cos(th), np.sin(th)]) for th in (np.pi / 2, np.pi / 2 + 2 * np.pi / 3, np.pi / 2 + 4 * np.pi / 3)]
    S_ = [q @ n / a for n in ns]
    fl = [np.floor(sv) for sv in S_]
    tot = fl[0] + fl[1] + fl[2]
    frac = np.where(tot <= -2, 2 / 3, 1 / 3)
    c0 = (fl[0] + frac) * a; c1 = (fl[1] + frac) * a
    M = np.array([ns[0], ns[1]]); Minv = np.linalg.inv(M)
    qc = np.stack([c0, c1], 1) @ Minv.T          # cell centroid
    holes = None
    for sv in S_:
        dk = np.abs(sv - np.round(sv)) * a
        term = w / 2 - dk
        holes = term if holes is None else I_round(holes, term, rc)
    def zone2(xx, zz):
        zn = open2d(xx, zz) + g + 1.7
        zn = np.maximum(zn, -(np.hypot(xx - SENSOR[0], zz - SENSOR[1]) - 6.4))
        for (sx, sz) in SCREWS:
            zn = np.maximum(zn, -(np.hypot(xx - sx, zz - sz) - 3.7))
        return zn
    ok = zone2(qc[:, 0], qc[:, 1]) < -(2 * a / 3)
    holes = np.where(ok, holes, np.maximum(holes, 0.3))
    sol = I_round(sol, -holes, 0.18)
    # sensor lens window (#37: small single-dot lens)
    win = np.hypot(x - SENSOR[0], z - SENSOR[1]) - 3.3
    sol = I_round(sol, -win, 0.25)
    for (sx, sz) in SCREWS:
        cb = np.maximum(np.hypot(x - sx, z - sz) - 2.25, y - (FT.Y_BASE + 1.0))
        sol = np.maximum(sol, -cb)
        th_ = np.hypot(x - sx, z - sz) - 1.1
        sol = np.maximum(sol, -th_)
    return sol

def wheel_bay(P, sk):
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    c = FT.WHEEL['center']
    outer = np.maximum(round_rect2(x, z, 0.0, 0.5 * (WO['z0'] + WO['z1']), 5.6, 0.5 * (WO['z1'] - WO['z0']) + 1.6, 1.5), np.maximum(5.8 - y, y - 40))
    inner = np.maximum(round_rect2(x, z, 0.0, 0.5 * (WO['z0'] + WO['z1']), 4.35, 0.5 * (WO['z1'] - WO['z0']) + 0.5, 1.0), 6.9 - y)
    sol = I_round(outer, -inner, 0.3)
    # stay under the triggers' inner surface
    sol = I_round(sol, sk + FT.T_TRIG + 0.55, 0.4)
    # axle bosses (POM bushings sit here, #7)
    boss = cyl_x(P, [0, c[1], c[2]], 1.9, 5.6)
    boss = np.maximum(boss, -(cyl_x(P, [0, c[1], c[2]], 1.05, 9)))
    sol = np.minimum(sol, np.maximum(boss, np.abs(x) - 5.6))
    return sol

def usb_receptacle(P, sk):
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    zf = ZF_USB - FT.USB['depth'] - 0.25
    W2, H2 = FT.USBC['w'] / 2, FT.USBC['h'] / 2
    outer = np.maximum(round_rect2(x, y, 0, FT.USB['cy'], W2, H2, H2), np.maximum(z - zf, (zf - FT.USBC['depth']) - z))
    inner = np.maximum(round_rect2(x, y, 0, FT.USB['cy'], W2 - FT.USBC['wall'], H2 - FT.USBC['wall'], H2 - FT.USBC['wall']), (zf - FT.USBC['depth'] + 0.4) - z)
    shell = np.maximum(outer, -inner)
    tw, tt = FT.USBC['tongue']
    tongue = np.maximum(round_rect2(x, y, 0, FT.USB['cy'], tw / 2, tt / 2, 0.2), np.maximum(z - (zf - 0.75), (zf - FT.USBC['depth']) - z))
    return np.minimum(shell, tongue)

# front-face z at the USB centre line (for the recess and receptacle)
def _zf():
    zs = np.linspace(45, 62, 3401)
    P = np.c_[np.zeros_like(zs), np.full_like(zs, FT.USB['cy']), zs]
    f = SKIN(P)
    return float(zs[np.argmax(f > 0)])
ZF_USB = _zf(); log('front face z at USB', ZF_USB)

# ------------------------------------------------------------------ meshing
def sub_box(lo, hi):
    i0 = np.maximum(np.floor((np.asarray(lo) - LO) / H).astype(int), 0)
    i1 = np.minimum(np.ceil((np.asarray(hi) - LO) / H).astype(int) + 1, np.array(VOL.shape))
    return i0, i1

def mesh_part(name, fn, lo, hi, target_faces, h_scale=1):
    i0, i1 = sub_box(lo, hi)
    xs = LO[0] + H * np.arange(i0[0], i1[0]); ys = LO[1] + H * np.arange(i0[1], i1[1]); zs = LO[2] + H * np.arange(i0[2], i1[2])
    vol = np.empty((len(xs), len(ys), len(zs)), np.float32)
    X, Y = np.meshgrid(xs, ys, indexing='ij')
    for a in range(0, len(zs), 30):
        zz = zs[a:a + 30]
        P = np.empty((len(xs), len(ys), len(zz), 3)); P[..., 0] = X[:, :, None]; P[..., 1] = Y[:, :, None]; P[..., 2] = zz
        sk = VOL[i0[0]:i1[0], i0[1]:i1[1], i0[2] + a:i0[2] + a + len(zz)].reshape(-1)
        Pf = P.reshape(-1, 3)
        vol[:, :, a:a + len(zz)] = fn(Pf, sk + FT.skin_correction(Pf, VARIANT)).reshape(len(xs), len(ys), len(zz))
    # pad so surfaces touching the box close
    vol = np.pad(vol, 1, constant_values=1.0)
    V, F, _, _ = marching_cubes(vol, 0.0, spacing=(H, H, H))
    V += np.array([xs[0], ys[0], zs[0]]) - H
    m = trimesh.Trimesh(V, F, process=True)
    cc = m.split(only_watertight=False)
    cc = [c for c in cc if len(c.faces) > 200]
    m = trimesh.util.concatenate(cc) if len(cc) > 1 else cc[0]
    log(f'{name}: MC {len(m.faces)} faces, comps {len(cc)}')
    ms = pymeshlab.MeshSet(); ms.add_mesh(pymeshlab.Mesh(m.vertices, m.faces))
    ms.meshing_decimation_quadric_edge_collapse(targetfacenum=int(target_faces), qualitythr=0.45, preservenormal=True,
                                                 preserveboundary=True, optimalplacement=True, planarquadric=True, planarweight=0.002)
    D = ms.current_mesh(); V, F = D.vertex_matrix(), D.face_matrix()
    # Newton projection onto the exact field, then normals from its gradient
    ex = lambda Q: fn(Q, SKIN(Q) + FT.skin_correction(Q, VARIANT))
    for it in range(2):
        f = ex(V); gr = grad_fd(V, ex, 2e-3)
        gn = (gr * gr).sum(1) + 1e-12
        st = np.clip(f / gn, -0.12, 0.12)[:, None] * gr
        V = V - st
    f = ex(V)
    gr = grad_fd(V, ex, 2e-3); N = gr / (np.linalg.norm(gr, axis=1, keepdims=True) + 1e-12)
    # drop tiny fragments left by decimation
    mm = trimesh.Trimesh(V, F, process=False)
    cc = trimesh.graph.connected_components(mm.face_adjacency, min_len=1)
    keepF = np.zeros(len(F), bool)
    for c in cc:
        if len(c) >= 60: keepF[c] = True
    if not keepF.all():
        F = F[keepF]; used = np.unique(F); remap = -np.ones(len(V), int); remap[used] = np.arange(len(used))
        V, N, F = V[used], N[used], remap[F]
    ao = ao_fn(name, V)
    log(f'{name}: final {len(F)} faces, |f| mean {np.abs(f).mean():.4f} max {np.abs(f).max():.4f}, ao min {ao.min():.2f}')
    return dict(V=V.astype(np.float32), F=F.astype(np.int32), N=N.astype(np.float32), A=ao.astype(np.float32))

def _sm(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t)

def ao_fn(name, V):
    """cavity occlusion for seam walls (IBL otherwise lights the inside of 0.25 mm gaps)."""
    if name in ('usbC', 'wheelBay', 'core'):
        return np.ones(len(V))
    if name == 'plate':
        d = V[:, 1] - FT.Y_BASE
        return 1 - 0.75 * _sm(0.04, 0.5, d)
    d = -(SKIN(V) + FT.skin_correction(V, VARIANT))
    if name in SB_NAMES:
        d = d + 0.0
        return 1 - 0.75 * _sm(0.02, 0.45, d)
    # everything below the outer skin (seam walls, the hollow interior) is enclosed when assembled
    return 1 - 0.85 * _sm(0.03, 0.4, d)

PARTS = {}
B = dict(x=(-32.6, 32.6), y=(-0.2, 39.2), z=(-60.8, 61.2))
specs = [
    ('triggerL', lambda P, s: trigger(P, s, +1), (-1, 8, -2), (32.6, 39.2, 61.2), 24000),
    ('triggerR', lambda P, s: trigger(P, s, -1), (-32.6, 8, -2), (1, 39.2, 61.2), 24000),
    ('body', body, (-32.6, 0.2, -60.8), (32.6, 39.2, 61.2), 84000),
    ('plate', plate, (-32, 0.4, -60), (32, 2.2, 60), 42000),
    ('wheelBay', wheel_bay, (-6, 5.5, 25), (6, 27, 50), 6000),
    ('usbC', usb_receptacle, (-5, 3, ZF_USB - 9), (5, 7.6, ZF_USB), 2400),
]
specs.append(('core', core, (-31, 2, -59), (31, 34, 59), 5000))
if VARIANT == 'theseus':
    specs.append(('bridge', bridge, (-6, 8, 44), (6, 30, 61.2), 5000))
for i, b in enumerate(SB):
    specs.append((b['name'], (lambda ii: (lambda P, s: side_button(P, s, ii)))(i), (15, 13, -13), (33, 29, 27), 6000))
for name, fn, lo, hi, tf in specs:
    if ONLY and name not in ONLY:
        continue
    PARTS[name] = mesh_part(name, fn, lo, hi, tf)

meta = FT.params_json(VARIANT)
meta.update(skates=SKATES.tolist(), screws=SCREWS.tolist(), sensor=SENSOR.tolist(), footprint=FP_POLY[::10].tolist(), zfUsb=ZF_USB)
np.savez_compressed(OUT, meta=json.dumps(meta), **{f'{k}_{a}': v[a] for k, v in PARTS.items() for a in ('V', 'F', 'N', 'A')})
log('saved', OUT, {k: len(v['F']) for k, v in PARTS.items()})
