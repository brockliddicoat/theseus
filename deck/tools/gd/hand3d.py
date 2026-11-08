"""A realistic hand for the gd slides (G6, after Brock 2026-11-08 08:05: "the hand in the presentation looks horrible super
unrealistic"): a signed-distance sculpture of the ANSUR II mean hand, posed joint by joint from hand.py's model, meshed by
marching cubes, rendered in Blender (render_hand.py).

Frame (the hand's own, mm): origin the middle finger's MCP joint, z forward along the metacarpal line, y dorsal (up, palm
down), x toward the thumb (the user's left for the right hand). The side view of the slides is (z, y): every finger's joints
take their (z, y) from hand.chain (the model's planar chains: Buryanov's bones scaled to ANSUR II, Lee & Jung's resting
angles), so the drawing matches the model exactly in side view. The fingers fan sideways (x) by an estimate: each joint's x
is interpolated along the finger from its knuckle's x to its tip's (a shear; the side view is unchanged).

Proportions: palm breadth 88.3 mm at the knuckles (ANSUR II); the palm's skin 20 mm under the knuckle line (hand.PALM_SKIN,
an estimate); finger breadths and thicknesses, the pads, nails, creases, eminences: drawn to typical adult male hands
(estimates, not sourced data: they set the look, not the model)."""
import numpy as np
from scipy.optimize import least_squares
from skimage.measure import marching_cubes
import hand as H

# ------------------------------------------------------------------ the pose: joints in the hand frame (x, y, z)
FING = ('index', 'middle', 'ring', 'little')
X_MCP = {'index': 28.0, 'middle': 8.0, 'ring': -11.5, 'little': -29.5}      # knuckle x (estimate: 88.3 mm across the skin)
X_TIP = {'index': 16.0, 'middle': -16.0, 'ring': -31.0, 'little': -39.0}     # tip x: index, middle on the buttons' middles
                                                                            # (trials.place: x 16 and -16); ring, little estimates
KB = H.KNUCKLE_BACK

def finger_joints(f, k=1.0):
    """four joints (MCP, PIP, DIP, tip) as (x, y, z); (z, y) from hand.chain with the angles scaled by k"""
    p = np.array([-KB[f], 0.0]); P = [p.copy()]; c = 0.0
    for L, a in zip(H.BONES[f], H.CASCADE[f]):
        c += np.radians(a) * k; d = -c; p = p + L * np.array([np.cos(d), np.sin(d)]); P.append(p.copy())
    P = np.array(P); s = np.r_[0, np.cumsum(np.hypot(*np.diff(P, axis=0).T))]; s /= s[-1]
    x = X_MCP[f] + (X_TIP[f] - X_MCP[f]) * s
    return np.c_[x, P[:, 1], P[:, 0]]

def _unit(v): v = np.asarray(v, float); return v / np.linalg.norm(v)
def _rot(v, axis, ang):
    """Rodrigues: v rotated about axis by ang (rad)"""
    a = _unit(axis); return v * np.cos(ang) + np.cross(a, v) * np.sin(ang) + a * np.dot(a, v) * (1 - np.cos(ang))

# the thumb: its CMC from hand.py (0.275 hand lengths behind the index MCP, 10 mm under the knuckle line), x an estimate
CMC = np.array([29.0, -H.THUMB_CMC_PALMAR, -KB['index'] - H.THUMB_CMC_BACK * H.ANSUR['hand']])
TB = H.THUMB_BONES

P_REST = np.array([-0.85, 0.10, 0.20])   # the relaxed thumb flexes toward the index's side (estimate)

def thumb_chain(yaw, pitch, roll, flex=(None, None), k=1.0):
    """the thumb's joints from its CMC: the metacarpal along (yaw: toward +x from z, pitch: palmar), flexing toward P_REST
    (made square to the metacarpal) rolled about it by roll; MCP and IP flexion (deg) default to Lee & Jung's, scaled by k.
    Returns joints (4, 3) and the palmar direction of the distal segment"""
    m = _unit([np.sin(yaw) * np.cos(pitch), -np.sin(pitch), np.cos(yaw) * np.cos(pitch)])
    p0 = _unit(P_REST - np.dot(P_REST, m) * m); p0 = _rot(p0, m, roll)
    a1 = np.radians(H.THUMB['mcp'] if flex[0] is None else flex[0]) * k
    a2 = a1 + np.radians(H.THUMB['ip'] if flex[1] is None else flex[1]) * k
    J = [CMC, CMC + TB[0] * m]
    d1 = m * np.cos(a1) + p0 * np.sin(a1); J.append(J[-1] + TB[1] * d1)
    d2 = m * np.cos(a2) + p0 * np.sin(a2); J.append(J[-1] + TB[2] * d2)
    pal = -m * np.sin(a2) + p0 * np.cos(a2)
    return np.array(J), pal

# the thumb's free rest (no mouse): the metacarpal 45 deg off the index's (Lee & Jung's CMC 45; the article does not say
# which segment it is measured against: read here as the angle to the index metacarpal), split between palmar and radial
# (estimate), flexing toward the index
REST_THUMB = dict(yaw=np.radians(32.8), pitch=np.radians(32.8), roll=0.0)   # cos(yaw) cos(pitch) = cos 45 deg
IK_X0 = [np.radians(28.0), np.radians(28.0), 0.0, 0.0]   # the grips' solver starts here (fixed, so their frames stay as rendered)

PAD_OUT = 7.4      # mm from the distal bone's axis to the pad's skin, palmar (estimate)
def thumb_pad(J, pal):
    u = _unit(J[3] - J[2]); return J[3] - u * 5.5 + pal * PAD_OUT

def thumb_to(target, wall_dir, k=1.0, x0=None):
    """solve the thumb (yaw, pitch, roll, extra flexion) so its pad touches target (x, y, z) facing wall_dir (the wall's
    inward normal, unit), close to the free rest: the grips' thumb (G5's placement: the pad on the side's contact band)"""
    r0 = REST_THUMB
    def res(v):
        yaw, pitch, roll, df = v
        J, pal = thumb_chain(yaw, pitch, roll, (H.THUMB['mcp'] + df, H.THUMB['ip'] + df * 0.6), k)
        return np.r_[(thumb_pad(J, pal) - target) * 1.0, (np.dot(pal, wall_dir) - 0.8) * 10.0, df / 15.0, (roll - r0['roll']) * 0.4]
    v0 = x0 if x0 is not None else IK_X0
    s = least_squares(res, v0); yaw, pitch, roll, df = s.x
    J, pal = thumb_chain(yaw, pitch, roll, (H.THUMB['mcp'] + df, H.THUMB['ip'] + df * 0.6), k)
    return dict(J=J, pal=pal, params=s.x.tolist(), miss=float(np.linalg.norm(thumb_pad(J, pal) - target)))

def to_hand(pm, zK, yK, gdeg):
    """a mouse-frame point (x, y, z) into the hand frame of a grip (knuckle at zK, yK, the metacarpals tilted gdeg)"""
    g = np.radians(gdeg); x, y, z = pm; dz, dy = z - zK, y - yK
    return np.array([x, -dz * np.sin(g) + dy * np.cos(g), dz * np.cos(g) + dy * np.sin(g)])

# ------------------------------------------------------------------ signed distances (mm), vectorised
def smin(a, b, k):
    h = np.clip(0.5 + 0.5 * (b - a) / k, 0.0, 1.0); return b * (1 - h) + a * h - k * h * (1 - h)
def smax(a, b, k): return -smin(-a, -b, k)

def frame_of(u, up):
    u = _unit(u); v = _unit(np.asarray(up, float) - np.dot(up, u) * u); w = np.cross(u, v); return u, v, w

def sd_roundcone_local(q, L, r1, r2):
    """iq's round cone along the local u axis from 0 to L, radii r1 -> r2; q (N, 3) local (u, v, w)"""
    l2 = L * L; rr = r1 - r2; a2 = l2 - rr * rr; il2 = 1.0 / l2
    y = q[:, 0] * L; z = y - l2
    x2 = (q[:, 1] ** 2 + q[:, 2] ** 2) * l2 * l2
    y2 = y * y * l2; z2 = z * z * l2; kk = np.sign(rr) * rr * rr * x2
    d = (np.sqrt(x2 * a2 * il2) + y * rr) * il2 - r1
    m1 = np.sign(z) * a2 * z2 > kk; d = np.where(m1, np.sqrt(x2 + z2) * il2 - r2, d)
    m2 = (~m1) & (np.sign(y) * a2 * y2 < kk); d = np.where(m2, np.sqrt(x2 + y2) * il2 - r1, d)
    return d

class Prim:
    """a primitive: kind 'cone' (a, b, r1, r2, up, sw: the cross-section's width over its depth) or 'ell' (c, axes (u, v, w)
    unit vectors, radii); op 'add' or 'sub'; k the blend; group (for the near / far layers)"""
    def __init__(self, kind, group, k, op='add', **kw): self.kind, self.group, self.k, self.op, self.kw = kind, group, k, op, kw
    def bbox(self):
        kw = self.kw
        if self.kind == 'cone':
            r = max(kw['r1'], kw['r2']) * max(1.0, kw.get('sw', 1.0)); a, b = kw['a'], kw['b']
            return np.minimum(a, b) - r, np.maximum(a, b) + r
        R = np.max(kw['r']); return kw['c'] - R, kw['c'] + R
    def sd(self, P):
        kw = self.kw
        if self.kind == 'cone':
            a, b = kw['a'], kw['b']; u, v, w = frame_of(b - a, kw['up']); d = P - a
            q = np.c_[d @ u, d @ v, (d @ w) / kw.get('sw', 1.0)]
            return sd_roundcone_local(q, float(np.linalg.norm(b - a)), kw['r1'], kw['r2'])
        c, (u, v, w), r = kw['c'], kw['ax'], np.asarray(kw['r'], float); d = P - c
        q = np.c_[d @ u, d @ v, d @ w] / r; k0 = np.linalg.norm(q, axis=1); k1 = np.linalg.norm(q / r, axis=1)
        return k0 * (k0 - 1.0) / np.maximum(k1, 1e-9)

def cone(group, a, b, r1, r2, up, k, sw=1.0, op='add'):
    return Prim('cone', group, k, op, a=np.asarray(a, float), b=np.asarray(b, float), r1=r1, r2=r2, up=np.asarray(up, float), sw=sw)
def ell(group, c, u, up, r, k, op='add'):
    u_, v_, w_ = frame_of(u, up); return Prim('ell', group, k, op, c=np.asarray(c, float), ax=(u_, v_, w_), r=r)

# ------------------------------------------------------------------ the sculpture
# finger breadths (mm) at the base, the PIP, the middle phalanx, the DIP, the pad, the tip; thickness = breadth x DEPTH
BREADTH = {'index': (22.6, 20.6, 18.6, 17.8, 16.6, 13.2), 'middle': (23.2, 21.2, 19.0, 18.2, 17.0, 13.6),
           'ring': (21.8, 19.8, 17.8, 17.0, 16.0, 12.8), 'little': (19.0, 17.4, 15.6, 15.0, 14.2, 11.6)}
DEPTH = 0.9

def crease_arc(group, c, u, up, R, sw, a0, a1, rad, k, n=7):
    """a groove round a finger: short capsules along an arc of radius R (the skin's) about c, in the plane square to u,
    from angle a0 to a1 (deg; 0 the back, 180 the palm), the lateral axis stretched by sw (the section's width / depth)"""
    u_, v_, w_ = frame_of(u, up); out = []
    th = np.radians(np.linspace(a0, a1, n)); P = [c + R * (v_ * np.cos(t) + w_ * np.sin(t) * sw) for t in th]
    for a, b in zip(P[:-1], P[1:]): out.append(cone(group, a, b, rad, rad, v_, k, op='sub'))
    return out

def finger_prims(f, J):
    """one finger from its joints: tapered, the joints a touch fuller than the shafts, the pad, the nail, the creases"""
    B = BREADTH[f]; out = []
    segs = [J[1] - J[0], J[2] - J[1], J[3] - J[2]]
    ups = []
    for s in segs:                                  # each segment's dorsal side: the chain's in-plane normal, upward
        u = _unit(s); n = np.array([0.0, u[2], -u[1]]); n = n if n[1] >= 0 else -n
        ups.append(_unit(n - np.dot(n, u) * u))
    r = lambda b: b * DEPTH / 2; sw = 1.0 / DEPTH
    off = [-1.6, -1.2, -0.9]                         # the skin's centre sits palmar of the bone (tendons, pulp)
    def O(i, p): return p + ups[i] * off[i]
    # proximal phalanx: base -> shaft -> PIP
    m0 = J[0] + segs[0] * 0.55
    out.append(cone(f, O(0, J[0] + segs[0] * 0.05), O(0, m0), r(B[0]), r(B[1] * 0.97), ups[0], 2.0, sw))
    out.append(cone(f, O(0, m0), O(0, J[1]), r(B[1] * 0.97), r(B[1]), ups[0], 2.0, sw))
    # middle phalanx
    m1 = J[1] + segs[1] * 0.5
    out.append(cone(f, O(1, J[1]), O(1, m1), r(B[1]), r(B[2]), ups[1], 2.4, sw))
    out.append(cone(f, O(1, m1), O(1, J[2]), r(B[2]), r(B[3]), ups[1], 2.0, sw))
    # distal: DIP -> the tip's core (the skin ends about 4 mm past the bone)
    u3 = _unit(segs[2]); v3 = ups[2]; w3 = np.cross(u3, v3)
    tipc = J[3] - u3 * 1.0
    out.append(cone(f, O(2, J[2]), O(2, tipc), r(B[3]), r(B[5]) * 1.02, ups[2], 2.2, sw))
    # the pad (pulp): a soft ellipsoid under the distal phalanx
    out.append(ell(f, J[3] - u3 * 5.8 - v3 * 2.7, u3, v3, (8.2, 5.0, B[4] / 2 * 0.93), 2.6))
    # the PIP and DIP knuckles: a little fuller on the back
    out.append(ell(f, J[1] + ups[1] * 1.6, segs[1], ups[1], (5.5, B[1] * DEPTH / 2 * 0.86, B[1] / 2 * 0.98), 2.0))
    out.append(ell(f, J[2] + ups[2] * 1.2, segs[2], ups[2], (4.4, B[3] * DEPTH / 2 * 0.86, B[3] / 2 * 0.98), 1.8))
    # the nail: a slightly proud plate on the back of the distal phalanx, its fold a shallow groove
    top = r(B[4]) + off[2] - 0.2                     # the back's skin height over the bone at the nail
    nc = J[3] - u3 * 4.6 + v3 * (top - 0.9)
    out.append(ell(f, nc, u3, v3, (6.6, 1.25, B[4] / 2 * 0.74), 0.45))
    # palmar flexion creases at the base, the PIP and the DIP, wrapping the palmar half; two faint wrinkles over the PIP's
    # back; the nail's fold: arcs of short capsules round the finger, so the side view shows them as lines
    for i, (Jc, wb) in enumerate([(J[0] + segs[0] * 0.30, B[0]), (J[1] - _unit(segs[0]) * 0.6, B[1]), (J[2] - _unit(segs[1]) * 0.4, B[3])]):
        out += crease_arc(f, Jc + ups[min(i, 2)] * off[min(i, 2)], segs[min(i, 2)], ups[min(i, 2)], r(wb) + 1.1, sw, 145, 215, 1.2, 0.9)
    out += crease_arc(f, J[3] - u3 * 10.6 + v3 * off[2], u3, v3, r(B[4]) + 0.95, sw * 0.98, -54, 54, 1.0, 0.7)
    return out

def thumb_prims(J, pal):
    """the thumb: its metacarpal under the thenar, a knuckle at the MCP, a slimmer proximal phalanx, a broad distal pad, a wide
    nail (sizes: typical adult male thumbs, estimates)"""
    out = []; segs = [J[1] - J[0], J[2] - J[1], J[3] - J[2]]
    ups = [_unit(-pal + np.dot(pal, _unit(s)) * _unit(s)) for s in segs]
    out.append(cone('thumb', J[0] + segs[0] * 0.18, J[1] - _unit(segs[0]) * 2.0, 8.2, 8.8, ups[0], 4.5, 1.15))      # metacarpal
    out.append(ell('thumb', J[1] + ups[0] * 2.6 - _unit(segs[0]) * 1.0, segs[0], ups[0], (8.0, 7.2, 9.6), 2.6))   # its head: the knuckle
    m1 = J[1] + segs[1] * 0.55
    out.append(cone('thumb', J[1] + _unit(segs[1]) * 1.5, m1, 9.0, 8.3, ups[1], 2.2, 1.2))
    out.append(cone('thumb', m1, J[2], 8.3, 8.7, ups[1], 2.0, 1.2))
    out.append(ell('thumb', J[2] + ups[2] * 1.3, segs[2], ups[2], (5.0, 7.6, 10.0), 2.0))                     # the IP knuckle
    u3 = _unit(segs[2]); v3 = ups[2]
    out.append(cone('thumb', J[2], J[3] - u3 * 1.4, 8.6, 6.8, ups[2], 2.2, 1.24))
    out.append(ell('thumb', J[3] - u3 * 7.2 + pal * 2.6, u3, v3, (10.2, 5.0, 9.8), 2.8))                      # the pad
    top = 8.6 * 0.95 - 0.6; nc = J[3] - u3 * 6.2 + v3 * (top - 0.9)
    out.append(ell('thumb', nc, u3, v3, (8.6, 1.3, 7.4), 0.5))                                               # the nail
    out += crease_arc('thumb', J[3] - u3 * 13.8, u3, v3, 8.6 + 0.6, 1.24, -56, 56, 1.1, 0.7)                 # its fold
    for Jc, rr_ in ((J[1] + segs[1] * 0.14, 9.0), (J[2] - _unit(segs[1]) * 0.6, 8.6)):                        # palmar creases
        c = Jc + pal * (rr_ + 0.5); w = np.cross(_unit(segs[1]), _unit(pal))
        out.append(cone('thumb', c - w * 7.5, c + w * 7.5, 1.2, 1.2, pal, 0.9, op='sub'))
    return out

def palm_prims(Jf, Jt):
    """the palm, the knuckles, the eminences, the web to the thumb, the wrist and the forearm"""
    out = []; Y = np.array([0, 1.0, 0]); Z = np.array([0, 0, 1.0]); X = np.array([1.0, 0, 0])
    base_x = {'index': 13.0, 'middle': 3.0, 'ring': -8.0, 'little': -17.0}
    for f in FING:
        h = Jf[f][0]; b = np.array([base_x[f], -2.5, -72.0])
        out.append(cone('palm', b, h + np.array([0, 0.8, 0]), 9.0, 8.6, Y, 7.0, 1.15))          # the metacarpal under the back
        out.append(ell('palm', h + np.array([0, 1.8, 0.5]), Z, Y, (9.6, 8.2, 9.8), 4.5))         # its head: the knuckle
        out.append(ell('palm', h + np.array([0, -12.6, -5.0]), Z, Y, (12.5, 7.2, 9.6), 5.0))     # the pad under it
    # the palm's body: the skin H.PALM_SKIN under the knuckle line, a little fuller over the eminences
    out.append(ell('palm', np.array([2.0, -8.0, -44.0]), Z, Y, (46.0, 12.6, 40.5), 9.0))
    out.append(ell('palm', np.array([-1.0, -7.5, -20.0]), Z, Y, (24.0, 12.2, 38.0), 8.0))
    out.append(ell('palm', np.array([-33.5, -12.0, -50.0]), _unit([0.12, 0.0, 1.0]), Y, (31.0, 10.0, 10.5), 7.0))  # hypothenar
    m = _unit(Jt[1] - Jt[0])
    out.append(ell('palm', Jt[0] + m * 16.0 + np.array([-9.0, -3.5, 0.0]), m, Y, (25.0, 10.0, 12.5), 9.0))         # thenar
    # the first web: skin from the thumb's MCP to the index's knuckle
    a, b = Jt[1] + np.array([-3.0, 0.0, 0.0]), Jf['index'][0] + np.array([2.0, -3.0, -10.0])
    out.append(cone('palm', a, b, 6.5, 7.5, Y, 7.0, 1.0))
    # the first web, filled: a sheet of skin across the triangle of the thumb's CMC, its MCP and the index's knuckle (no hole
    # between the thumb and the palm, however far the thumb swings)
    A_, B_, C_ = Jt[0], Jt[1], Jf['index'][0] + np.array([0.0, -6.0, -6.0])
    cen = (A_ + 1.3 * B_ + 1.3 * C_) / 3.6; u_ = _unit(C_ - B_); n_ = _unit(np.cross(B_ - A_, C_ - A_)); v_ = np.cross(n_, u_)
    out.append(Prim('ell', 'palm', 7.0, c=cen, ax=(u_, v_, n_), r=(float(np.linalg.norm(C_ - B_)) * 0.5, 15.0, 5.5)))
    # the heel and the wrist (circumference about 170 mm: STS-57's crew 132 to 170), the forearm fading behind
    out.append(ell('palm', np.array([1.0, -8.5, -86.0]), Z, Y, (17.0, 17.5, 31.0), 9.0))
    out.append(cone('palm', np.array([2.0, -6.5, -96.0]), np.array([2.0, -5.5, -185.0]), 19.0, 22.5, Y, 10.0, 1.52))
    return out

def sculpt(fingers, thumbJ, thumbPal):
    P = palm_prims(fingers, thumbJ)
    for f in FING: P += finger_prims(f, fingers[f])
    P += thumb_prims(thumbJ, thumbPal)
    return P

# ------------------------------------------------------------------ field -> mesh
def mesh(prims, h=0.6, pad=4.0):
    lo = np.min([p.bbox()[0] for p in prims if p.op == 'add'], axis=0) - pad
    hi = np.max([p.bbox()[1] for p in prims if p.op == 'add'], axis=0) + pad
    lo[2] = max(lo[2], -178.0)                       # the forearm is cut here (faded on the slide)
    n = np.ceil((hi - lo) / h).astype(int) + 1
    F = np.full(tuple(n), 6.0, np.float32)
    for p in prims:
        a, b = p.bbox(); a = a - p.k - 2.0; b = b + p.k + 2.0
        i0 = np.clip(np.floor((a - lo) / h).astype(int), 0, n - 1); i1 = np.clip(np.ceil((b - lo) / h).astype(int) + 1, 0, n)
        if np.any(i1 <= i0): continue
        ax = [lo[d] + h * np.arange(i0[d], i1[d]) for d in range(3)]
        G = np.stack(np.meshgrid(*ax, indexing='ij'), -1).reshape(-1, 3)
        d = p.sd(G).reshape(tuple(i1 - i0)).astype(np.float32)
        sl = tuple(slice(i0[q], i1[q]) for q in range(3))
        F[sl] = smin(F[sl], d, p.k) if p.op == 'add' else smax(F[sl], -d, p.k)
    F[:, :, 0] = 6.0                                 # close the cut forearm
    V, Fc, N, _ = marching_cubes(F, 0.0, spacing=(h, h, h))
    V = V + lo
    return V, Fc, F, lo, h

def labels(V, prims):
    """each vertex's group: the nearest additive primitive's"""
    groups = sorted(set(p.group for p in prims)); best = np.full(len(V), np.inf); lab = np.zeros(len(V), int)
    for p in prims:
        if p.op != 'add': continue
        d = p.sd(V); m = d < best; best[m] = d[m]; lab[m] = groups.index(p.group)
    return np.array(groups)[lab]

def taubin(V, Fc, it=6, lam=0.5, mu=-0.53):
    """Taubin smoothing (no shrink) to take the voxel steps out"""
    n = len(V); E = np.r_[Fc[:, [0, 1]], Fc[:, [1, 2]], Fc[:, [2, 0]]]; E = np.r_[E, E[:, ::-1]]
    deg = np.bincount(E[:, 0], minlength=n).astype(float)
    for _ in range(it):
        for f_ in (lam, mu):
            S = np.zeros_like(V); np.add.at(S, E[:, 0], V[E[:, 1]]); V = V + f_ * (S / deg[:, None] - V)
    return V

def grip_thumb(grips, kind, zK=None, yK=None, gdeg=None, tz=None, x0=None):
    """the thumb's pad on the side's contact band (hand.py: y 15; z from trials.place) in a grip, or at a placement and z in
    between; returns thumb_to's result"""
    G = grips[kind]; tip = G['thumb']['tip']
    zK = G['zK'] if zK is None else zK; yK = G['yK'] if yK is None else yK; gdeg = G['gamma_deg'] if gdeg is None else gdeg
    tgt = to_hand(np.array([grips['wall_x'], tip[1], tip[0] if tz is None else tz]), zK, yK, gdeg)
    return thumb_to(tgt, np.array([-1.0, 0.0, 0.0]), x0=x0)

REST_P = np.array([REST_THUMB['yaw'], REST_THUMB['pitch'], REST_THUMB['roll'], 0.0])
def thumb_from(p, k=1.0):
    J, pal = thumb_chain(p[0], p[1], p[2], (H.THUMB['mcp'] + p[3], H.THUMB['ip'] + p[3] * 0.6), k); return J, pal

def pose(kind, k=1.0, grips=None):
    """the joints for a pose: 'rest' (floating, the fingers' and thumb's angles scaled by k); a grip ('heel', 'lifted') with the
    thumb's pad on the side at G5's contact; or a step between: 'fh' (floating to the palm on the hump) and 'hl' (the hump
    to the palm lifted) at t = k. Returns the fingers' joints, the thumb's joints, its pad's direction and the IK result"""
    fingers = {f: finger_joints(f, k if kind == 'rest' else 1.0) for f in FING}
    if kind == 'rest':
        J, pal = thumb_chain(REST_THUMB['yaw'] * (0.55 + 0.45 * k), REST_THUMB['pitch'] * (0.4 + 0.6 * k), REST_THUMB['roll'], k=k)
        return fingers, J, pal, None
    if kind in ('heel', 'lifted'):
        T = grip_thumb(grips, kind); return fingers, T['J'], T['pal'], T
    if kind == 'fh':
        Th = grip_thumb(grips, 'heel'); p = REST_P + (np.array(Th['params']) - REST_P) * k
        J, pal = thumb_from(p); return fingers, J, pal, dict(params=p.tolist(), miss=0.0)
    if kind == 'hl':
        Gh, Gl = grips['heel'], grips['lifted']; L = lambda a, b: a + (b - a) * k
        Th, Tl = grip_thumb(grips, 'heel'), grip_thumb(grips, 'lifted')
        T = grip_thumb(grips, 'heel', L(Gh['zK'], Gl['zK']), L(Gh['yK'], Gl['yK']), L(Gh['gamma_deg'], Gl['gamma_deg']),
                       L(Gh['thumb']['tip'][0], Gl['thumb']['tip'][0]), x0=L(np.array(Th['params']), np.array(Tl['params'])))
        return fingers, T['J'], T['pal'], T
    raise ValueError(kind)
