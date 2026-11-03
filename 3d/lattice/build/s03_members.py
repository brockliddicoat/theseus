"""Stage 3: every structural member as a polyline on the inner surface, with per-sample rib parameters.

Outputs work/members_tri.npz and work/members_hex.npz (same rails/struts/bosses, different lattice) and
work/layout.json (bosses, inserts, PCB outline + tie points, skates, cuts) for the JS module and the FE stage.

Families (fillets are blended between different families; a family is fused sharply with itself):
  0,1,2  lattice directions (tri: 0 = transverse arches, 1/2 = diagonals; hex: the three edge directions)
  3      rails along the trigger seams (body side: trigger supports + front arch; trigger side: edge ribs)
  4      vertical struts in the nose (#55)
"""
import numpy as np, json
from common import *
from geom import *

S = Shell()
d = np.load(os.path.join(WORK, 'lattice_raw.npz'))
X, E, K, J, Y_RIM = d['X'], d['E'], d['K'], d['J'], float(d['y_rim'])
a = P['a']; gap = P['gap']
node = {(int(k), int(j)): i for i, (k, j) in enumerate(zip(K, J))}

# --------------------------------------------------------------------------------------------------
def surf_poly(p0, p1, step=0.3):
    n = max(2, int(np.ceil(np.linalg.norm(p1 - p0) / step)) + 1)
    t = np.linspace(0, 1, n)[:, None]
    return S.project(p0 * (1 - t) + p1 * t)

# bottom outer contour (marched inward from outside at the bottom face) -> the floor region in plan
from matplotlib.path import Path as _Path
from scipy.spatial import cKDTree as _KD
_ang = np.radians(np.linspace(0, 360, 1441)[:-1]); _pts = []
for t_ in _ang:
    dd = np.array([np.sin(t_), 0, np.cos(t_)]); ts = np.arange(75, 0, -0.05)
    Pq = np.array([0, P['y_bottom'] + 0.25, 0]) + ts[:, None] * dd; s_ = S.D(Pq)
    k = np.where((s_[:-1] >= 0) & (s_[1:] < 0))[0]
    if len(k): _pts.append(Pq[k[0]])
OUTLINE = np.array(_pts); _opath = _Path(OUTLINE[:, [0, 2]]); _okd = _KD(OUTLINE[:, [0, 2]])

def region(Q):
    """+1 body, -1 trigger, 0 below the rim or on the floor (inside the footprint, > 3.2 mm in from the contour, low)"""
    r = np.where(trig_sdf(Q) < 0, -1, 1)
    xz = Q[:, [0, 2]]
    floor = _opath.contains_points(xz) & (_okd.query(xz)[0] > 3.2) & (Q[:, 1] < 8.0)
    return np.where((Q[:, 1] < Y_RIM - 0.4) | floor, 0, r)

def split_runs(Q, lab):
    out = []; i = 0
    while i < len(Q):
        j = i
        while j + 1 < len(Q) and lab[j + 1] == lab[i]: j += 1
        if lab[i] != 0 and j > i: out.append((Q[i:j + 1], int(lab[i])))
        i = j + 1
    return out

def grade_w(Q): g = grade(Q); return P['w_top'] + (P['w_bot'] - P['w_top']) * g
def grade_r(Q): g = grade(Q); return P['r_top'] + (P['r_bot'] - P['r_top']) * g
def span_h(Q, scale=1.0):
    k = smoothstep(6.0, 36.0, Q[:, 1]); return scale * (P['h_min'] + (P['h_max'] - P['h_min']) * k)

class Members:
    def __init__(self): self.items = []
    def add(self, Q, fam, kind, reg, h=None, w=None, order=0.0, hscale=1.0, tag=''):
        if len(Q) < 2: return
        h = span_h(Q, hscale) if h is None else np.broadcast_to(h, (len(Q),)).astype(float)
        w = grade_w(Q) if w is None else np.broadcast_to(w, (len(Q),)).astype(float)
        self.items.append(dict(Q=Q, fam=fam, kind=kind, reg=reg, h=h, w=w, r=grade_r(Q), order=order, tag=tag))
    def save(self, path):
        Qs = []; mid = []; at = []
        for m, it in enumerate(self.items):
            n = len(it['Q']); Qs.append(it['Q']); mid.append(np.full(n, m))
            at.append(np.stack([it['h'], it['w'], it['r'], np.full(n, it['fam']), np.full(n, it['reg']), np.full(n, it['order'])], 1))
        meta = [dict(fam=it['fam'], kind=it['kind'], reg=it['reg'], order=it['order'], tag=it['tag'],
                     len=float(polyline_arclen(it['Q'])[-1])) for it in self.items]
        np.savez(path, Q=np.concatenate(Qs), mid=np.concatenate(mid), at=np.concatenate(at), meta=json.dumps(meta))
        return meta

# --------------------------------------------------------------------------------------------------
# shared members: rails along the seams, nose struts
shared = Members()
off = gap / 2 + 0.55          # rail centre line offset from the seam surface (half rail width + a hair)

def seam_loop(dy, zmin):
    """inner-surface curve on the tilted side-seam surface y = y_s(z) + dy, around the front, z > zmin"""
    pts = []
    c = np.array([0.0, 0.0, 18.0])
    for ang in np.radians(np.linspace(-179.5, 179.5, 1437)):
        dx, dz = np.sin(ang), np.cos(ang)
        ts = np.arange(0, 70, 0.1); xs = c[0] + ts * dx; zs = c[2] + ts * dz
        ys = seam_side_y(zs) + dy
        Pq = np.stack([xs, ys, zs], 1); s = S.Sin(Pq)
        k = np.where((s[:-1] < 0) & (s[1:] >= 0))[0]
        if len(k) == 0: continue
        k = k[0]; t = ts[k] + 0.1 * s[k] / (s[k] - s[k + 1])
        z = c[2] + t * dz
        pts.append((ang, np.array([c[0] + t * dx, seam_side_y(z) + dy, z])))
    pts = np.array([p for _, p in pts])
    pts = pts[pts[:, 2] > zmin]
    # order: left corner -> nose -> right corner  (angle order already sweeps x from -.. to +..)
    return pts

def rear_curve(dz, xmax):
    """inner-surface curve at z = z_r(x) + dz (top), for |x| <= xmax"""
    out = []
    for x in np.linspace(-xmax, xmax, int(2 * xmax / 0.25) + 1):
        z = seam_rear_z(x) + dz
        ys = np.arange(42, 5, -0.05); Pq = np.stack([np.full_like(ys, x), ys, np.full_like(ys, z)], 1)
        s = S.Sin(Pq); k = np.where((s[:-1] > 0) & (s[1:] <= 0))[0]
        if len(k) == 0: continue
        k = k[0]; y = ys[k] - 0.05 * s[k] / (s[k] - s[k + 1])
        out.append([x, y, z])
    return np.array(out)

# body-side side rails ("trigger supports"): along the seam, below it, from the corner to the nose
side_body = seam_loop(-off - 0.05, zmin=-5)
# corner: where the side seam meets the rear seam (x where the rear seam plane hits the side rail)
cz = seam_rear_z(side_body[:, 0]) - off
side_body = side_body[side_body[:, 2] > cz]
side_body = S.project(side_body)
# front arch: body side of the rear seam, joins the side rails at the corners
xc = np.abs(side_body[np.argmin(side_body[:, 2] - seam_rear_z(side_body[:, 0]))][0])
front_arch = rear_curve(-off, xc + 2.0)
front_arch = front_arch[trig_sdf(front_arch) > 0]
front_arch = S.project(front_arch)
shared.add(front_arch, 3, 'front_arch', 1, h=2.0, w=1.15, order=0.30, tag='front arch: body side of the trigger seam (#53)')
L = side_body[:, 0] < 0
for sgn, sel in ((-1, L), (1, ~L)):
    Q = side_body[sel]; Q = Q[np.argsort(Q[:, 2])]
    shared.add(Q, 3, 'trigger_rail', 1, h=1.5, w=1.1, order=0.62, tag='trigger support rail (#55)')
# nose rail runs across the front: the part of the loop with z beyond the side walls is included above.
# trigger side edge ribs (perimeter of each trigger panel)
side_trig = seam_loop(+off + 0.05, zmin=-5)
side_trig = side_trig[side_trig[:, 2] > seam_rear_z(side_trig[:, 0]) + off]
side_trig = S.project(side_trig)
rear_trig = rear_curve(+off, xc + 2.0); rear_trig = rear_trig[trig_sdf(rear_trig) < 0]
for sgn in (-1, 1):
    A_ = side_trig[side_trig[:, 0] * sgn > SEAM['center_gap'] / 2 + 0.6]
    B_ = rear_trig[rear_trig[:, 0] * sgn > SEAM['center_gap'] / 2 + 0.6]
    shared.add(S.project(A_[np.argsort(A_[:, 2])]), 3, 'trigger_edge', -1, h=1.2, w=1.0, order=0.80, tag='trigger edge rib')
    shared.add(S.project(B_[np.argsort(np.abs(B_[:, 0]))]), 3, 'trigger_edge', -1, h=1.2, w=1.0, order=0.80, tag='trigger edge rib')
    # centre split edge + wheel slot surround
    xw, z0w, z1w = SEAM['wheel']
    xe = sgn * (SEAM['center_gap'] / 2 + 0.55)
    zs = np.arange(seam_rear_z(0) + off, 58.6, 0.3)
    zs = zs[(zs < z0w - 0.6) | (zs > z1w + 0.6)]
    pts = []
    for z in zs:
        xx = xe if not (z0w - 1.0 < z < z1w + 1.0) else sgn * (xw + 0.55)
        pts.append([xx, 30.0, z])
    for z in np.arange(z0w - 0.6, z1w + 0.6, 0.3): pts.append([sgn * (xw + 0.55), 30.0, z])
    pts = np.array(sorted(pts, key=lambda p: p[2]))
    # project vertically onto the inner surface (ray down)
    out = []
    for p in pts:
        ys = np.arange(42, 8, -0.05); Pq = np.stack([np.full_like(ys, p[0]), ys, np.full_like(ys, p[2])], 1)
        s = S.Sin(Pq); k = np.where((s[:-1] > 0) & (s[1:] <= 0))[0]
        if len(k): out.append([p[0], ys[k[0]], p[2]])
    out = S.project(np.array(out))
    out = out[trig_sdf(out) < -0.3]
    # break into continuous pieces
    br = np.where(np.linalg.norm(np.diff(out, axis=0), axis=1) > 1.2)[0]
    for piece in np.split(out, br + 1):
        if len(piece) > 3: shared.add(piece, 3, 'trigger_edge', -1, h=1.2, w=1.0, order=0.80, tag='trigger edge rib')

# nose: vertical struts (#55) from the rim to the nose rail, clear of the USB-C port
nose_x = [-16.6, -12.2, -7.7, 7.7, 12.2, 16.6]
for x in nose_x:
    pts = []
    for y in np.arange(Y_RIM - 0.4, seam_side_y(58.5) - off - 0.3, 0.25):
        zs = np.arange(40, 63, 0.05); Pq = np.stack([np.full_like(zs, x), np.full_like(zs, y), zs], 1)
        s = S.Sin(Pq); k = np.where((s[:-1] < 0) & (s[1:] >= 0))[0]
        if len(k): pts.append([x, y, zs[k[0]]])
    Q = S.project(np.array(pts))
    shared.add(Q, 4, 'nose_strut', 1, h=1.25, order=0.70, tag='vertical nose strut (#55)')

# --------------------------------------------------------------------------------------------------
def lattice_members(kind):
    M = Members()
    if kind == 'tri':
        for (i, j, fam) in E:
            p0, p1 = X[i], X[j]
            if p0[1] < Y_RIM - 1.5 and p1[1] < Y_RIM - 1.5: continue
            Q = surf_poly(p0, p1)
            kk = 0.5 * (K[i] + K[j])
            for R, reg in split_runs(Q, region(Q)):
                if polyline_arclen(R)[-1] < 0.8: continue
                if reg == -1:
                    M.add(R, int(fam), 'trigger_lattice', -1, h=1.15 if fam == 0 else 1.0, order=0.85 + 0.1 * (fam > 0))
                else:
                    # arches first (centre outwards), then the diagonals
                    o = 0.02 + 0.25 * abs(kk - 7.0) / 7.0 if fam == 0 else 0.35 + 0.25 * abs(kk - 7.0) / 7.0
                    M.add(R, int(fam), 'arch' if fam == 0 else 'diagonal', 1, hscale=1.0 if fam == 0 else 0.86, order=o,
                          tag='transverse arch (#53)' if fam == 0 else 'diagonal (#75)')
        return M
    # hexagons: subdivide every lattice triangle n = 3, drop one colour class of the fine triangular lattice
    n = 3
    fine = {}
    for (k, j), i in node.items():
        for dk in range(n):
            for dj in range(n):
                s_, t_ = dj / n, dk / n
                if s_ + t_ <= 1 + 1e-9:
                    ids = [(k, j), (k, j + 1), (k + 1, j)]; w_ = [1 - s_ - t_, s_, t_]
                else:
                    ids = [(k + 1, j + 1), (k + 1, j), (k, j + 1)]; w_ = [s_ + t_ - 1, 1 - s_, 1 - t_]
                if any(q not in node for q in ids if True) and any(ww > 1e-9 for q, ww in zip(ids, w_) if q not in node): continue
                p = sum(ww * X[node[q]] for q, ww in zip(ids, w_) if ww > 1e-9)
                fine[(n * k + dk, n * j + dj)] = p
    keys = list(fine.keys()); Pf = S.project(np.array([fine[q] for q in keys])); fine = dict(zip(keys, Pf))
    keep = {q for q in fine if (q[1] - q[0]) % 3 != 1}
    for q in keep:
        for (dk, dj, fam) in ((0, 1, 0), (1, 0, 1), (1, -1, 2)):
            r = (q[0] + dk, q[1] + dj)
            if r not in keep: continue
            p0, p1 = fine[q], fine[r]
            if p0[1] < Y_RIM - 1.5 and p1[1] < Y_RIM - 1.5: continue
            Q = surf_poly(p0, p1)
            for R, reg in split_runs(Q, region(Q)):
                if polyline_arclen(R)[-1] < 0.6: continue
                kk = q[0] / n
                if reg == -1:
                    M.add(R, fam, 'trigger_lattice', -1, h=1.07, order=0.85 + 0.05 * fam)
                else:
                    M.add(R, fam, 'hex', 1, hscale=0.93, order=0.02 + 0.6 * abs(kk - 7.0) / 7.5, tag='hexagon cell wall')
    return M

# --------------------------------------------------------------------------------------------------
# bosses (M2 heat-set inserts, screws from below through the PCB, #54/#101) on the arch feet (#53)
def row_leg(krow, sgn, y):
    """point where lattice row krow crosses height y on side sgn (polyline of its A edges)"""
    ids = sorted([i for i in range(len(X)) if K[i] == krow], key=lambda i: J[i])
    Q = np.concatenate([surf_poly(X[ids[m]], X[ids[m + 1]]) for m in range(len(ids) - 1)])
    if sgn < 0: Q = Q[::-1]
    Q = Q[Q[:, 0] * sgn > 0]          # crown -> rim along the side leg
    ok = np.where(np.abs(Q[:, 0]) > 12)[0]
    if len(ok) == 0: return None
    Q = Q[ok[0]:]
    k = np.where((Q[:-1, 1] >= y) & (Q[1:, 1] < y))[0]
    if len(k) == 0: return None
    k = k[0]; t = (y - Q[k, 1]) / (Q[k + 1, 1] - Q[k, 1]); return Q[k] * (1 - t) + Q[k + 1] * t

rows_k = sorted(set(K.tolist()))
row_z = {k: float(np.median(X[(K == k) & (X[:, 1] > Y_RIM)][:, 2])) for k in rows_k}
pcb_top = P['pcb_y0'] + P['pcb_t']
def nearest_row(z): return min(rows_k, key=lambda k: abs(row_leg(k, 1, 8.0)[2] - z) if row_leg(k, 1, 8.0) is not None else 1e9)
k_rear, k_mid = nearest_row(-27.5), nearest_row(9.5)
bosses = []
for k, name in ((k_rear, 'rear'), (k_mid, 'mid')):
    for sgn in (-1, 1):
        p = row_leg(k, sgn, 8.5); n_in = S.normal_in(p[None])[0]; n_in[1] = 0; n_in /= np.linalg.norm(n_in)
        c = p + n_in * 3.65
        bosses.append(dict(name=f'{name}_{"L" if sgn < 0 else "R"}', x=float(c[0]), z=float(c[2]), y0=pcb_top, y1=pcb_top + 6.2,
                           od=P['boss_od'], bore=P['bore_d'], bore_depth=P['insert_len'] + 0.6, row=int(k), leg=p.tolist()))
print('bosses', [(b['name'], round(b['x'], 2), round(b['z'], 2)) for b in bosses])

# PCB stand-in: board edge follows the inner wall at mid-board height, inset to bear on the rib tips (#94)
yb = P['pcb_y0'] + P['pcb_t'] / 2
ang = np.radians(np.linspace(0, 360, 1441)[:-1])
cen = np.array([0.0, yb, 2.0]); pts = []
for t_ in ang:
    dd = np.array([np.sin(t_), 0, np.cos(t_)])
    ts = np.arange(0, 70, 0.05); Pq = cen + ts[:, None] * dd; s = S.Sin(Pq)
    k = np.where((s[:-1] < 0) & (s[1:] >= 0))[0]
    if len(k): pts.append(Pq[k[0]])
wall_loop = np.array(pts)
nrm = S.normal_in(wall_loop); nrm[:, 1] = 0; nrm /= np.linalg.norm(nrm, axis=1, keepdims=True)
inset = P['h_min'] + 0.12
board = wall_loop + nrm * inset
z_rear_pcb, z_front_pcb = -36.0, 54.0
board = board[(board[:, 2] > z_rear_pcb) & (board[:, 2] < z_front_pcb)]
# tie points: lattice arch legs and nose struts crossing the board plane
ties = []
for k in rows_k:
    for sgn in (-1, 1):
        p = row_leg(k, sgn, pcb_top + 0.3)
        if p is None or not (z_rear_pcb + 2 < p[2] < z_front_pcb - 1): continue
        if trig_sdf(p[None])[0] < 0: continue
        n_in = S.normal_in(p[None])[0]; n_in[1] = 0
        if np.linalg.norm(n_in) < 0.3: continue
        n_in /= np.linalg.norm(n_in)
        ties.append(dict(p=(p + n_in * inset).tolist(), n=n_in.tolist(), row=int(k), boss=bool(k in (k_rear, k_mid))))
for x in nose_x:
    zs = np.arange(40, 63, 0.05); Pq = np.stack([np.full_like(zs, x), np.full_like(zs, pcb_top + 0.3), zs], 1)
    s = S.Sin(Pq); k = np.where((s[:-1] < 0) & (s[1:] >= 0))[0]
    if len(k) and zs[k[0]] - inset < z_front_pcb + 3:
        ties.append(dict(p=[x, pcb_top + 0.3, float(zs[k[0]] - inset)], n=[0, 0, -1.0], row=-1, boss=False))
print('ties', len(ties))

# skates: 8 dots (2 per corner) on the bottom face, clear of the bosses (#10, #52)
yb0 = P['y_bottom'] + 0.25
pts = []
for t_ in ang:   # march inward from outside: the first crossing is the outer contour (ignores the sensor recess)
    dd = np.array([np.sin(t_), 0, np.cos(t_)])
    ts = np.arange(75, 0, -0.05); Pq = np.array([0, yb0, 0]) + ts[:, None] * dd; s = S.D(Pq)
    k = np.where((s[:-1] >= 0) & (s[1:] < 0))[0]
    if len(k): pts.append(Pq[k[0]])
outline = np.array(pts)
skate_r = 3.25
cd = outline - np.array([0, 0, 0]);
def inset_pt(direction, inset_mm):
    i = np.argmax(outline[:, [0, 2]] @ direction); p = outline[i]
    nn = -S.ext.grad(p[None])[0]; nn[1] = 0; nn /= np.linalg.norm(nn)
    return p + nn * inset_mm, i
skates = []
nn_out = -S.ext.grad(outline); nn_out[:, 1] = 0; nn_out /= np.linalg.norm(nn_out, axis=1, keepdims=True)
inset_curve = outline + nn_out * (skate_r + 1.2)
s_in = polyline_arclen(np.vstack([inset_curve, inset_curve[:1]]))
for cx_, cz_ in ((-1, 1), (1, 1), (-1, -1), (1, -1)):
    dirv = np.array([cx_ * 0.80, cz_ * 1.0]); dirv /= np.linalg.norm(dirv)
    i = np.argmax(inset_curve[:, [0, 2]] @ dirv)
    for ds in ((-4.9, 4.9) if cz_ > 0 else (-5.9, 5.9)):      # two dots ~8 mm apart along the rim (#10)
        j = np.argmin(np.abs(s_in[:-1] - ((s_in[i] + ds) % s_in[-1])))
        skates.append([float(inset_curve[j, 0]), float(inset_curve[j, 2])])
for b in bosses:
    dmin = min(np.hypot(b['x'] - s_[0], b['z'] - s_[1]) for s_ in skates)
    print('boss', b['name'], 'nearest skate centre %.1f mm' % dmin)

layout = dict(
    params=P, seam=SEAM, y_rim=Y_RIM, bosses=bosses, ties=ties, skates=skates, skate_d=6.5, skate_h=0.65,
    pcb=dict(y0=P['pcb_y0'], t=P['pcb_t'], outline=board[:, [0, 2]].tolist(), holes=[[b['x'], b['z']] for b in bosses], z_rear=z_rear_pcb, z_front=z_front_pcb,
             note='stand-in board: edge follows the inner wall and bears on the rib tips (#94); the PCB builder owns the real outline'),
    usb=dict(cx=0.0, cy=6.1, w=9.8, h=3.9, r=1.7),
    wheel=dict(hw=SEAM['wheel'][0], z0=SEAM['wheel'][1], z1=SEAM['wheel'][2]),
    rows=dict(k_rear=int(k_rear), k_mid=int(k_mid), z={int(k): row_z[k] for k in rows_k}),
    outline_bottom=outline[:, [0, 2]].tolist(),
)
jdump(layout, os.path.join(WORK, 'layout.json'))
for kind in ('tri', 'hex'):
    M = lattice_members(kind)
    M.items = M.items + shared.items
    meta = M.save(os.path.join(WORK, f'members_{kind}.npz'))
    L_lat = sum(m['len'] for m in meta if m['kind'] in ('arch', 'diagonal', 'hex'))
    L_all = sum(m['len'] for m in meta)
    print(kind, 'members', len(meta), 'body lattice length %.0f mm' % L_lat, 'all %.0f mm' % L_all)
