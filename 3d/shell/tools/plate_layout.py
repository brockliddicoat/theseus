#!/usr/bin/env python3
"""The optional bottom plate (F12.10): its layout in plan, from the shell's own base (shell-theseus-1seam.json).

Brock: "a fine triangle lattice, but you can only see it looking from inside the shell, on the outside it should look
solid. also the bottom should be solid with no holes (even before mylar)"; "i like the X style designs, but they have to
form triangles"; "the big cutouts have high walls on ther edges".

The plate is a solid 0.5 mm skin. On its inner face:
  - PRIMARY struts, 2 mm walls: an X from the lens ring to the four screw bosses, the keel down the centre line, two ties
    across the screw lines, two side spokes, and a wall round the edge. They close twelve bays, every one a triangle:
    eight round the lens (apex at the lens) and four caps at the nose and tail (one side along the edge).
  - the FINE lattice, 0.7 mm ribs: every bay cut by a frequency-6 subdivision (lines parallel to its sides, as a
    geodesic dome is cut), so every cell is a copy of its bay and the cells of neighbouring bays meet node to node. Round
    the lens the lines close into concentric polygons, a web; by the edge they bend to follow it.
  - an in-plan fillet at every corner, the hub ring round the lens window, half-bosses at the screws.

Writes 3d/shell/plate-layout.json: the outline, window, bosses, the frame (nodes and members, for the deck's solver) and
the pockets and bays as polygons (for plate_mesh.mjs).            python3 -I 3d/shell/tools/plate_layout.py [preview.png]
"""
import json, os, sys
import numpy as np, cv2
from skimage.measure import find_contours, approximate_polygon
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from sdf import Raster2D, U_round

ROOT = os.path.join(HERE, '..')
META = json.load(open(os.path.join(ROOT, 'shell-theseus-1seam.json')))
OUT = os.environ.get('PLATE_OUT') or os.path.join(ROOT, 'plate-layout.json')
PREVIEW = sys.argv[1] if len(sys.argv) > 1 else None

# ------------------------------------------------------------------ the shell's base (features.py, build_parts.py)
Y_BASE, W_RIM, GAP = 0.65, 3.2, 0.25
FPp = np.array(META['footprint']); SK = np.array(META['skates']); SC = np.array(META['screws'])
SENSOR = np.array(META['sensor'], float)
FP = Raster2D([FPp], (-34, -63), (34, 63), px=0.05)
def pad2d(x, z):
    d = np.full(np.shape(x), 1e9)
    for (sx, sz) in SK: d = np.minimum(d, np.hypot(x - sx, z - sz) - (3.25 + 1.05))
    return d
def plate2d(x, z):            # negative inside: the rim opening (ring + corner ledges) less the seam gap
    return -U_round(-(FP(x, z) + W_RIM), pad2d(x, z), 2.2) + GAP

D = dict(
    skin=0.50,                                  # solid outer skin
    wall=dict(w=0.80, h=2.00),                  # primary struts (height above the skin)
    fine=dict(w=0.50, h=0.70),                  # fine lattice ribs
    ring=dict(w=0.90, h=2.00, off=0.70),        # hub ring wall, 0.7 mm clear of the window
    boss=dict(r=3.10, h=2.00, cb=2.25, hole=1.10, cbTop=2.35),   # cbTop: the M2 head's bearing face (shell.js)
    fil=float(os.environ.get('FIL', 0.30)),        # in-plan fillet at every pocket corner
    window=dict(hw=3.20, hl=7.70),              # the lens window, a 6.4 x 15.4 stadium (Glide chapter GLD_WIN)
    n=int(os.environ.get('NSUB', 5)),            # subdivision frequency
    keepout=dict(pts=[[s * 16.0, z] for s in (1, -1) for z in (31.6, 36.7, 41.8)], r=1.6, top=2.30),  # GT01 sockets
)
px = 0.03
xs = np.arange(-27, 27, px); zs = np.arange(-54, 54, px)
XX, ZZ = np.meshgrid(xs, zs)
PF = plate2d(XX, ZZ)
INSIDE = PF < 0

def contours_of(field, level=0.0, tol=0.012):
    """sub-pixel contours of field = level, in mm, simplified"""
    out = []
    for c in find_contours(field, level):
        p = np.c_[xs[0] + c[:, 1] * px, zs[0] + c[:, 0] * px]
        if len(p) < 8: continue
        p = approximate_polygon(p, tolerance=tol)
        if len(p) > 4: out.append(p[:-1] if np.allclose(p[0], p[-1]) else p)
    return out
def area(p): x, z = p[:, 0], p[:, 1]; return 0.5 * (np.dot(x, np.roll(z, -1)) - np.dot(z, np.roll(x, -1)))
OUTLINE = max(contours_of(-PF), key=lambda p: abs(area(p)))

def edge_x(z, side):
    row = PF[np.argmin(np.abs(zs - z))]; ins = xs[row < 0]; return ins.max() if side > 0 else ins.min()
def edge_z(x, end):
    col = PF[:, np.argmin(np.abs(xs - x))]; ins = zs[col < 0]; return ins.max() if end > 0 else ins.min()

# ------------------------------------------------------------------ primary points (+X = the user's left)
inset = D['wall']['w'] / 2 + 0.02
SCR = {k: np.array(v, float) for k, v in zip(['FL', 'FR', 'BL', 'BR'], SC)}
BOSS = {k: np.array([v[0] - np.sign(v[0]) * 1.3, v[1]]) for k, v in SCR.items()}   # boss centres, on the plate side
P = dict(BOSS)
P['F0'] = np.array([0.0, edge_z(0, 1) - inset]); P['B0'] = np.array([0.0, edge_z(0, -1) + inset])
P['Mf'] = np.array([0.0, SCR['FL'][1]]); P['Mb'] = np.array([0.0, SCR['BL'][1]])
zL = 0.5 * (SCR['FL'][1] + SCR['BL'][1])
P['L0'] = np.array([edge_x(zL, 1) - inset, zL]); P['R0'] = np.array([edge_x(zL, -1) + inset, zL])
O = SENSOR.copy()

# the inset outline (centreline of the edge wall) as a closed polyline
gx = np.gradient(PF, axis=1) / px; gz = np.gradient(PF, axis=0) / px
def inset_outline(d):
    ix = np.clip(((OUTLINE[:, 0] - xs[0]) / px).round().astype(int), 0, len(xs) - 1)
    iz = np.clip(((OUTLINE[:, 1] - zs[0]) / px).round().astype(int), 0, len(zs) - 1)
    g = np.c_[gx[iz, ix], gz[iz, ix]]; g /= np.linalg.norm(g, axis=1, keepdims=True) + 1e-9
    return OUTLINE - g * d
EDGE = inset_outline(inset)
def edge_path(a, b):
    """the inset outline from the point nearest a to the point nearest b, the short way round, resampled every 0.5 mm"""
    m = len(EDGE); ia = np.argmin(np.linalg.norm(EDGE - a, axis=1)); ib = np.argmin(np.linalg.norm(EDGE - b, axis=1))
    f, r = (ib - ia) % m, (ia - ib) % m
    idx = [(ia + k) % m for k in range(f + 1)] if f <= r else [(ia - k) % m for k in range(r + 1)]
    p = np.vstack([a, EDGE[idx[1:-1]], b]) if len(idx) > 2 else np.vstack([a, b])
    L = np.r_[0, np.cumsum(np.linalg.norm(np.diff(p, axis=0), axis=1))]
    t = np.linspace(0, L[-1], max(2, int(L[-1] / 0.5) + 1))
    return np.c_[np.interp(t, L, p[:, 0]), np.interp(t, L, p[:, 1])], L[-1]
def polyline_at(pl, s):        # point at fraction s of the polyline's length
    L = np.r_[0, np.cumsum(np.linalg.norm(np.diff(pl, axis=0), axis=1))]; u = s * L[-1]
    return np.array([np.interp(u, L, pl[:, 0]), np.interp(u, L, pl[:, 1])])

# bays: apex A, then B, C; side B-C straight or along the edge; the kind of each side (AB, BC, CA)
BAYS = [('O', 'Mf', 'FL', None, ('spoke', 'tie', 'spoke')), ('O', 'FL', 'L0', 'edge', ('spoke', 'edge', 'spoke')),
        ('O', 'L0', 'BL', 'edge', ('spoke', 'edge', 'spoke')), ('O', 'BL', 'Mb', None, ('spoke', 'tie', 'spoke')),
        ('O', 'Mb', 'BR', None, ('spoke', 'tie', 'spoke')), ('O', 'BR', 'R0', 'edge', ('spoke', 'edge', 'spoke')),
        ('O', 'R0', 'FR', 'edge', ('spoke', 'edge', 'spoke')), ('O', 'FR', 'Mf', None, ('spoke', 'tie', 'spoke')),
        ('Mf', 'FL', 'F0', 'edge', ('tie', 'edge', 'keel')), ('Mf', 'F0', 'FR', 'edge', ('keel', 'edge', 'tie')),
        ('Mb', 'B0', 'BL', 'edge', ('keel', 'edge', 'tie')), ('Mb', 'BR', 'B0', 'edge', ('tie', 'edge', 'keel'))]
Pt = dict(P); Pt['O'] = O
n = D['n']
nodes, nkey = [], {}
def node(p):
    k = (round(p[0] * 50), round(p[1] * 50))                # merge within 0.02 mm
    if k not in nkey: nkey[k] = len(nodes); nodes.append([float(p[0]), float(p[1])])
    return nkey[k]
members = {}
def member(i, j, kind):
    if i == j: return
    k = (min(i, j), max(i, j))
    old = members.get(k)
    rank = {'fine': 0, 'edge': 1, 'tie': 2, 'keel': 2, 'spoke': 3}
    if old is None or rank[kind] > rank[old]: members[k] = kind
bay_cells = []
for bi, (a, b, c, curved, kinds) in enumerate(BAYS):
    A, B, Cc = Pt[a], Pt[b], Pt[c]
    E = edge_path(B, Cc)[0] if curved else np.vstack([B, Cc])
    def at(i, j, k):          # barycentric (i, j, k)/n on A, B, C, with side BC along E
        aa = i / n
        if j + k == 0: return A
        return aa * A + (1 - aa) * polyline_at(E, k / (j + k))
    idx = {}
    for i in range(n + 1):
        for j in range(n + 1 - i):
            k = n - i - j; idx[(i, j, k)] = node(at(i, j, k))
    cells = []
    for i in range(n + 1):
        for j in range(n + 1 - i):
            k = n - i - j
            for (p, q) in [((i, j, k), (i - 1, j + 1, k)), ((i, j, k), (i - 1, j, k + 1)), ((i, j, k), (i, j - 1, k + 1))]:
                if min(q) < 0: continue
                # which side of the bay does this member lie on?
                kind = 'fine'
                if p[0] == 0 and q[0] == 0: kind = kinds[1]          # side BC (a = 0)
                elif p[2] == 0 and q[2] == 0: kind = kinds[0]        # side AB (c = 0)
                elif p[1] == 0 and q[1] == 0: kind = kinds[2]        # side CA (b = 0)
                member(idx[p], idx[q], kind)
            if i >= 1 and j <= n - i:   # upward cell (i,j,k) (i-1,j+1,k) (i-1,j,k+1)
                cells.append([idx[(i, j, k)], idx[(i - 1, j + 1, k)], idx[(i - 1, j, k + 1)]])
            if i >= 1 and j >= 1 and i + j <= n:   # downward cell
                if k + 1 <= n and (i - 1) >= 0: cells.append([idx[(i - 1, j, k + 1)], idx[(i, j - 1, k + 1)], idx[(i, j, k)]]) if False else None
    bay_cells.append(cells)
NODES = np.array(nodes)
MEMB = [(i, j, kind) for (i, j), kind in members.items()]
print('nodes', len(NODES), 'members', len(MEMB), {k: sum(1 for m in MEMB if m[2] == k) for k in ('spoke', 'tie', 'keel', 'edge', 'fine')})

# ------------------------------------------------------------------ the hub ring: clip the frame at its stadium
hw, hl = D['window']['hw'], D['window']['hl']
ro = D['ring']['off'] + D['ring']['w'] / 2
RH, RL = hw + ro, hl + ro
def ring_sdf(p):
    q = np.atleast_2d(p) - O; qz = np.clip(q[:, 1], -(RL - RH), RL - RH)
    return np.hypot(q[:, 0], q[:, 1] - qz) - RH
keep, ring_nodes = [], []
newnodes = [list(p) for p in NODES]
for (i, j, kind) in MEMB:
    a, b = NODES[i], NODES[j]; da, db = ring_sdf(a)[0], ring_sdf(b)[0]
    if da >= 0 and db >= 0: keep.append((i, j, kind)); continue
    if da < 0 and db < 0: continue
    # cut at the ring
    lo, hi = (a, b) if da < 0 else (b, a)
    for _ in range(40):
        m = 0.5 * (lo + hi)
        if ring_sdf(m)[0] < 0: lo = m
        else: hi = m
    newnodes.append([float(hi[0]), float(hi[1])]); r = len(newnodes) - 1; ring_nodes.append(r)
    keep.append((r, j if da < 0 else i, kind))
# ring chain through the cut points, sorted by angle, with extra points so no ring member is longer than 2.5 mm
ang = lambda k: np.arctan2(newnodes[k][1] - O[1], newnodes[k][0] - O[0])
ring_nodes = sorted(set(ring_nodes), key=ang)
merged, remap = [], {}
for k in ring_nodes:
    if merged and np.hypot(*(np.array(newnodes[k]) - np.array(newnodes[merged[-1]]))) < 0.3: remap[k] = merged[-1]; continue
    merged.append(k)
if len(merged) > 1 and np.hypot(*(np.array(newnodes[merged[0]]) - np.array(newnodes[merged[-1]]))) < 0.3: remap[merged[-1]] = merged[0]; merged.pop()
keep = [(remap.get(i, i), remap.get(j, j), kd) for i, j, kd in keep]
ring_nodes = merged
chain = []
for a_, b_ in zip(ring_nodes, ring_nodes[1:] + ring_nodes[:1]):
    chain.append(a_)
    t0, t1 = ang(a_), ang(b_)
    if t1 <= t0: t1 += 2 * np.pi
    m = int(np.ceil((t1 - t0) * RL / 2.5))
    for s in range(1, m):
        th = t0 + (t1 - t0) * s / m; d = np.array([np.cos(th), np.sin(th)])
        lo_, hi_ = 0.0, 20.0
        for _ in range(40):
            mm = 0.5 * (lo_ + hi_)
            if ring_sdf(O + d * mm)[0] < 0: lo_ = mm
            else: hi_ = mm
        q_ = O + d * lo_
        if min(np.hypot(*(np.array(newnodes[c_]) - q_)) for c_ in (a_, b_)) < 0.8: continue   # no sliver next to a cut point
        newnodes.append(list(q_)); chain.append(len(newnodes) - 1)
for a_, b_ in zip(chain, chain[1:] + chain[:1]): keep.append((a_, b_, 'ring'))
# drop unused nodes, renumber
used = sorted({i for m in keep for i in m[:2]}); ren = {o: k for k, o in enumerate(used)}
NODES = np.array([newnodes[o] for o in used]); MEMB = [(ren[i], ren[j], kd) for i, j, kd in keep]
SUP = {k: int(np.argmin(np.linalg.norm(NODES - BOSS[k], axis=1))) for k in BOSS}
RING = sorted({ren[c] for c in chain})
print('after ring clip: nodes', len(NODES), 'members', len(MEMB), 'ring nodes', len(RING), 'supports', SUP)

WFROM = os.environ.get('WIDTHS')
WIDTH = {}
if WFROM:
    J = json.load(open(WFROM)); NODES = np.array(J['frame']['nodes']); MEMB = [(m[0], m[1], m[2]) for m in J['frame']['members']]
    WIDTH = {(m[0], m[1]): (m[3], m[4]) for m in J['frame']['members'] if len(m) > 3}
    SUP = J['frame']['supports']; RING = J['frame']['ring']
    for k in ('skin',): D[k] = J['dims'][k]
    D['wall']['h'] = J['dims']['wall']['h']; D['fine']['h'] = J['dims']['fine']['h']; FE = J.get('fe')
    print('frame and widths from', WFROM, len(MEMB), 'members')
# ------------------------------------------------------------------ rasters: ribs (fine + primary), primary only
def draw(kinds, width_of):
    m = np.zeros(XX.shape, np.uint8)
    for (i, j, kd) in MEMB:
        if kd not in kinds: continue
        a, b = NODES[i], NODES[j]
        pa = (int(round((a[0] - xs[0]) / px * 16)), int(round((a[1] - zs[0]) / px * 16)))
        pb = (int(round((b[0] - xs[0]) / px * 16)), int(round((b[1] - zs[0]) / px * 16)))
        wd = (WIDTH[(i, j)][0] if (i, j) in WIDTH else width_of(kd)) * float(os.environ.get('WSCALE', 1))
        cv2.line(m, pa, pb, 1, thickness=max(1, int(round(wd / px))), lineType=cv2.LINE_8, shift=4)
    return m
def disc(mask, c, r):
    cv2.circle(mask, (int(round((c[0] - xs[0]) / px * 16)), int(round((c[1] - zs[0]) / px * 16))), int(round(r / px * 16)), 1, -1, shift=4)
WID = {'fine': D['fine']['w'], 'edge': D['wall']['w'], 'tie': D['wall']['w'], 'keel': D['wall']['w'], 'spoke': D['wall']['w'], 'ring': D['ring']['w']}
def sdist(mask):               # signed distance, negative inside mask
    din = cv2.distanceTransform(mask.astype(np.uint8), cv2.DIST_L2, cv2.DIST_MASK_PRECISE)
    dout = cv2.distanceTransform((1 - mask).astype(np.uint8), cv2.DIST_L2, cv2.DIST_MASK_PRECISE)
    return (dout - din) * px
def closed(mask, r):           # morphological closing by a disc of radius r: fillets in every concave corner
    d = sdist(mask); grown = (d < r).astype(np.uint8)
    return (sdist(grown) < -r).astype(np.uint8) | mask
prim = draw({'edge', 'tie', 'keel', 'spoke', 'ring'}, lambda k: WID[k])
for c in BOSS.values(): disc(prim, c, D['boss']['r'])
ringfill = (ring_sdf(np.c_[XX.ravel(), ZZ.ravel()]).reshape(XX.shape) < 0).astype(np.uint8)
edge_band = (PF > -float(os.environ.get('EDGEBAND', D['wall']['w'] + 0.04))).astype(np.uint8)   # the edge wall: a band inside the outline
prim = closed(np.maximum(prim, edge_band) & 1, D['fil'])
allr = closed(np.maximum(prim, draw({'fine'}, lambda k: WID[k])) & 1, D['fil'])
# pockets (between fine ribs) and bays (between primary walls), inside the plate and outside the ring
pocket_f = sdist(((allr == 0) & INSIDE & (ringfill == 0)).astype(np.uint8))
bay_f = sdist(((prim == 0) & INSIDE & (ringfill == 0)).astype(np.uint8))
POCKETS = [p for p in contours_of(-pocket_f) if abs(area(p)) > 0.4]
BAYPOLY = [p for p in contours_of(-bay_f) if abs(area(p)) > 2.0]
print('pockets', len(POCKETS), 'bays', len(BAYPOLY), 'outline pts', len(OUTLINE), 'pocket pts', sum(len(p) for p in POCKETS))

# ------------------------------------------------------------------ mass (g, PP-C-20A 1.01 g/cm3), from the rasters
RHO = 1.01e-3
A_plate = INSIDE.sum() * px * px
win = (np.hypot(np.maximum(np.abs(XX - O[0]), 0), np.maximum(np.abs(ZZ - O[1]) - (hl - hw), 0)) < hw)
A_skin = (INSIDE & ~win).sum() * px * px
A_prim = (prim.astype(bool) & INSIDE).sum() * px * px
A_fine = ((allr.astype(bool) & ~prim.astype(bool)) & INSIDE).sum() * px * px
V = A_skin * D['skin'] + A_prim * D['wall']['h'] + A_fine * D['fine']['h'] + sum(np.pi * D['boss']['r'] ** 2 * 0.5 * 0 for _ in BOSS)
print('areas: plate %.0f skin %.0f primary %.0f fine %.0f  -> volume %.0f mm3, mass %.3f g' % (A_plate, A_skin, A_prim, A_fine, V, V * RHO))

def r2(p): return [[round(float(x), 3), round(float(z), 3)] for x, z in p]
# ------------------------------------------------------------------ the mesh's polygons (plate_mesh.mjs)
CB, HOLE, BR = D['boss']['cb'], D['boss']['hole'], D['boss']['r']
def discs(r, cs):
    m = np.zeros(XX.shape, bool)
    for c in cs: m |= np.hypot(XX - c[0], ZZ - c[1]) < r
    return m
notchCB = discs(CB, SC); notchH = discs(HOLE, SC)
TOL = 0.025
skin_out = max(contours_of(-sdist((INSIDE & ~notchCB).astype(np.uint8)), tol=TOL), key=lambda p: abs(area(p)))
rib_mask = (allr.astype(bool) | discs(BR, BOSS.values())) & INSIDE & ~notchCB & (ringfill == 0)
rib_cs = contours_of(-sdist(rib_mask.astype(np.uint8)), tol=TOL)
rib_out = max(rib_cs, key=lambda p: abs(area(p)))
rib_holes = [p for p in rib_cs if p is not rib_out and abs(area(p)) > 0.3]
roof = (discs(BR, BOSS.values()) & INSIDE & ~notchH & notchCB)
roofs = [p for p in contours_of(-sdist(roof.astype(np.uint8)), tol=TOL) if abs(area(p)) > 0.2]
wt = np.linspace(0, 2 * np.pi, 97)[:-1]
WIN = [[O[0] + hw * np.cos(a), O[1] + (hl - hw) * np.sign(np.sin(a)) + hw * np.sin(a)] for a in wt]
print('mesh polygons: skin', len(skin_out), 'rib outer', len(rib_out), 'holes', len(rib_holes), 'pts', sum(len(p) for p in rib_holes), 'roofs', len(roofs))
MESH = dict(skin=r2(skin_out), window=r2(WIN), ribOuter=r2(rib_out), ribHoles=[r2(p) for p in rib_holes], roofs=[r2(p) for p in roofs],
            y0=Y_BASE, ySkin=Y_BASE + D['skin'], yTop=Y_BASE + D['skin'] + D['wall']['h'], yCb=D['boss']['cbTop'])
out = dict(
    note='Optional bottom plate, F12.10. Plan (x, z) mm in the shell frame (+X = user\'s left, +Z = nose). Built by '
         '3d/shell/tools/plate_layout.py from shell-theseus-1seam.json; meshed by plate_mesh.mjs.',
    dims=D, yBase=Y_BASE, outline=r2(OUTLINE), screws=SC.tolist(), bosses={k: r2([v])[0] for k, v in BOSS.items()},
    window=dict(c=O.tolist(), hw=hw, hl=hl), ring=dict(c=O.tolist(), hw=RH, hl=RL),
    frame=dict(nodes=r2(NODES), members=[[int(i), int(j), kd] + (list(WIDTH[(i, j)]) if (i, j) in WIDTH else []) for i, j, kd in MEMB], supports=SUP, ring=[int(k) for k in RING]),
    pockets=[r2(p) for p in POCKETS], bays=[r2(p) for p in BAYPOLY],
    areas=dict(plate=round(A_plate, 1), skin=round(A_skin, 1), primary=round(A_prim, 1), fine=round(A_fine, 1)),
    mass=round(V * RHO, 3), mesh=MESH,
)
if WFROM and FE: out['fe'] = FE
tmp = OUT + '.tmp'; open(tmp, 'w').write(json.dumps(out, separators=(',', ':'))); os.replace(tmp, OUT)
print('wrote', OUT, os.path.getsize(OUT) // 1024, 'KB')
if PREVIEW:
    S_ = 8; W_, H_ = int(54 * S_), int(108 * S_)
    img = np.full((H_, W_, 3), 24, np.uint8)
    T = lambda p: (int((p[0] + 27) * S_), int((54 - p[1]) * S_))
    cv2.fillPoly(img, [np.array([T(p) for p in OUTLINE], np.int32)], (70, 70, 74))
    for p in POCKETS: cv2.fillPoly(img, [np.array([T(q) for q in p], np.int32)], (40, 40, 44))
    for p in BAYPOLY: cv2.polylines(img, [np.array([T(q) for q in p], np.int32)], True, (255, 140, 40), 1, cv2.LINE_AA)
    for k in SUP.values(): cv2.circle(img, T(NODES[k]), 5, (60, 60, 255), -1)
    cv2.imwrite(PREVIEW, img)
