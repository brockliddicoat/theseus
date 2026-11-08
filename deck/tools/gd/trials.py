"""Phase 2: the four trials (grip x pockets) on the modified base, with one minimum per finger.

THE DIP (each pocket and groove). A single smooth valley laid along the base curve's outward normal, defined by its
curvature c(t) (1/mm, + = concave): the core |t| <= a is a circle of curvature kc (the strength the finger needs, over
the whole range where fingertips land: a is derived, not free); the transition a < |t| < a + b eases the curvature
through a convex rim back to the base's own, c = kc (H(x) - m B(x)), x = (|t| - a) / b, H = 1 - 3x^2 + 2x^3,
B = 30 x^2 (1 - x)^2, m = 1/2 + a/b. Then the slope is 0 at the centre, rises through the core, falls back to exactly 0
at the end, and never changes sign: the surface rises monotonically from the bottom to the dip's end on both sides and
never passes outside the base (no rim, no ripple, no second dip). The curvature eases to the base's at the ends (C2).
THE FRONT FLARE. An outward step of height hf ahead of each side pocket: a C2 smoothstep from the pocket's centre to the
end of its front transition (its concave half lies inside the pocket's core), held along the front side, and tapered to
nothing round the nose corner (the nose stays the Sora's).
Bounds, not a pull to the Sora: the outline within 3.5 mm of the Sora; the only concave stretches are the four valleys;
radii a mould can make; the side profile untouched (F47.1). A light pull toward the modified base keeps it Brock's.
Run after fit_sora.py: python3 deck/tools/gd/trials.py -> out/trials.json"""
import json, os, sys
import numpy as np
from scipy.optimize import least_squares
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import arcs as A, hand as H, strength as S
from descend import FIT, top_y, PROF, DEG, BAND, ELL

GRIP_HEEL_DEG = 15.0          # Brock's trial: the wrist tilted back about 15 deg puts the palm's heel on the hump (phase 1, derived)
BOUND = 3.5                   # mm, the outline within this of the Sora (main's bound)
RMIN_PLAN, RMIN_SEC = 5.0, 2.0   # mm, smallest radius allowed (estimate: a moulded, comfortable edge)
ULX = {'rear': 61.6, 'grip': 56.6, 'front': 58.8}   # TechPowerUp, widths in mm
ULX_POCKET, ULX_FLARE = (ULX['rear'] - ULX['grip']) / 2, (ULX['front'] - ULX['grip']) / 2   # 2.5, 1.1 mm per side (derived)
# fingertip contact: gross area A = k F^m, k 98.6 mm^2 N^-0.50, m 0.50 (Serhat, Vardar & Kuchenbecker 2022, Table 1, E 1 MPa)
def contact_d(F): return 2 * np.sqrt(98.6 * F ** 0.50 / np.pi)   # mm, diameter of the equal-area circle
HANDS = {'p5': 177.0, 'p50': 193.3, 'p95': 210.0}     # ANSUR II men, hand length percentiles (b07Ansur)
BREADTH_SD = 4.4                                      # ANSUR II men, hand breadth SD, mm

# ------------------------------------------------------------------ the hand, placed for each grip and size
def joints(f, g, k):
    return k * H.chain(f, g)
def place(grip, k=1.0, anchor=None):
    g = np.radians(GRIP_HEEL_DEG if grip == 'heel' else 0.0); xs = {'index': 16.0, 'middle': -16.0}
    kb = {f: H.KNUCKLE_BACK[f] * k for f in H.KNUCKLE_BACK}
    def pts(f, v):
        zK, yK = v; base = np.array([zK - kb[f] * np.cos(g), yK - kb[f] * np.sin(g)]); return base + joints(f, g, k)
    def tipres(v): return [pts(f, v)[-1][1] - top_y(xs[f], pts(f, v)[-1][0]) for f in ('index', 'middle')]
    n = np.array([np.sin(g), -np.cos(g)])
    def palm_gap(v):
        base = np.array(v) + H.PALM_SKIN * k * n; tdir = np.array([np.cos(g), np.sin(g)])
        rel = PROF - base; along = rel @ tdir; m = (along < 0) & (along > -100 * k)
        return float((rel[m] @ n).min()) if m.any() else 50.0       # > 0: the palm floats above the hump; < 0: it would sink in
    if grip == 'lifted':
        # palm lifted, wrist straight (the exact zero-g pose): nothing but the fingertips touches, so the hand is anchored
        # where the reference hand's fingertips land; other sizes keep that index fingertip and settle to the buttons
        if anchor is None:
            sol = least_squares(tipres, [-25.0, 85.0], bounds=([-60.0, 30.0], [10.0, 140.0]))
        else:
            sol = least_squares(lambda v: [pts('index', v)[-1][0] - anchor, np.mean(tipres(v))], [-25.0, 85.0], bounds=([-80.0, 30.0], [20.0, 140.0]))
        v = sol.x
    else:
        # palm on the hump: wrist tilted back GRIP_HEEL_DEG; the palm's skin rests on the hump and the fingertips on the
        # buttons (their mean; the middle finger reaches lower than the index, so each keeps a misfit)
        sol = least_squares(lambda v: [np.mean(tipres(v)), palm_gap(v)], [-25.0, 65.0], bounds=([-60.0, 30.0], [0.0, 120.0])); v = sol.x
    P = {f: pts(f, v) for f in ('index', 'middle', 'ring', 'little')}
    tr = tipres(v)
    # (G5) the thumb from its base, not pinned to the index's DIP (G1's estimate; Brock 2026-11-08: "the thumb never goes that far
    # forward"): its CMC rides with the hand; in the zero-g grip its relaxed span reaches down to the side's contact band, which
    # sets how far along the mouse it reaches from its base; it keeps that reach as the hand moves (it rides with its base and
    # flexes to stay on the side), so as you grip it slides by its base's travel
    cmc = H.thumb_cmc(P['index'][0], g, k)
    reach = H.thumb_reach(cmc[1], k) if grip == 'lifted' else lifted_reach(k)
    thumb = {'cmc': cmc.round(3).tolist(), 'reach': reach, 'span': H.thumb_span(k), 'tip': [float(cmc[0] + reach), H.CONTACT_Y]}
    return {'grip': grip, 'k': k, 'gamma_deg': float(np.degrees(g)), 'zK': float(v[0]), 'yK': float(v[1]), 'palm_gap_mm': palm_gap(v),
            'tip_misfit_mm': {'index': float(tr[0]), 'middle': float(tr[1])},
            'joints': {f: P[f].round(3).tolist() for f in P}, 'thumb': thumb,
            'z': {'index': float(P['index'][-1][0]), 'middle': float(P['middle'][-1][0]), 'ring': float(P['ring'][-1][0]), 'little': float(P['little'][-1][0]),
                  'thumb': thumb['tip'][0]}}
_REACH = {}
def lifted_reach(k):
    """(G5) the thumb's reach along the mouse from its base, set in the zero-g grip (palm lifted) for a hand k times the mean's,
    anchored as the trials anchor it (the mean hand's index tip)"""
    key = round(float(k), 9)
    if key not in _REACH:
        anc = None if key == 1.0 else place('lifted', 1.0)['z']['index']
        _REACH[key] = place('lifted', k, anc)['thumb']['reach']
    return _REACH[key]

# ------------------------------------------------------------------ the dip and the flare
def dip_curv(t, a, b, kc):
    x = np.clip((np.abs(t) - a) / max(b, 1e-6), 0, 1); m = 0.5 + a / max(b, 1e-6)
    Hs = 1 - 3 * x ** 2 + 2 * x ** 3; Bs = 30 * x ** 2 * (1 - x) ** 2
    c = np.where(np.abs(t) <= a, kc, kc * (Hs - m * Bs)); return np.where(np.abs(t) >= a + b, 0.0, c)
def dip_profile(a, b, kc, n=801):
    """t, displacement (<= 0, inward), slope, curvature over [-(a+b), a+b]"""
    E = a + b; t = np.linspace(0, E, n); c = dip_curv(t, a, b, kc)
    sl = np.r_[0, np.cumsum((c[1:] + c[:-1]) / 2 * np.diff(t))]; h = np.r_[0, np.cumsum((sl[1:] + sl[:-1]) / 2 * np.diff(t))]
    h = h - h[-1]
    tt = np.r_[-t[::-1], t[1:]]; hh = np.r_[h[::-1], h[1:]]; ss = np.r_[-sl[::-1], sl[1:]]; cc = np.r_[c[::-1], c[1:]]
    return tt, hh, ss, cc
def smooth5(x): x = np.clip(x, 0, 1); return x ** 3 * (10 - 15 * x + 6 * x ** 2)

# ------------------------------------------------------------------ the base curves (the Sora's fitted arcs)
PLAN = A.chain(FIT['plan']['p0'], FIT['plan']['th0'], [tuple(a) for a in FIT['plan']['arcs']], ds=0.1)
ZST = 30.0
SECB = FIT['xsec']['30']
SEC = A.chain(SECB['p0'], 0.0, [tuple(a) for a in SECB['arcs']], ds=0.05)
S_CORNER = float(sum(L for L, _ in FIT['plan']['arcs'][:3]))     # the nose corner and front side: arcs 1 to 3 of the fit
def s_at_z(z):
    side = PLAN['x'] > 18; return float(np.interp(-z, -PLAN['y'][side], PLAN['s'][side]))
def s_at_u(u):
    top = SEC['y'] > 12; return float(np.interp(u, SEC['x'][top], SEC['s'][top]))

def displace(base, disp):
    nx, ny = -np.sin(base['th']), np.cos(base['th'])           # the left normal = outward, for both chains
    return {'x': base['x'] + nx * disp, 'y': base['y'] + ny * disp, 's': base['s'], 'th': base['th']}
def hull_fill():
    """outward fill of the Sora's side between the hump's crest and the front's crest to their common tangent line
    (the upper envelope), so the base side has no minimum of its own: its shallow waist would be a second dip"""
    side = (PLAN['x'] > 15) & (PLAN['y'] > -45) & (PLAN['y'] < 45); z, u = PLAN['y'], PLAN['x']
    zz, uu = z[side], u[side]; o = np.argsort(zz); zz, uu = zz[o], uu[o]
    # upper convex hull of (z, u)
    hull = []
    for q in zip(zz, uu):
        while len(hull) >= 2 and (hull[-1][0] - hull[-2][0]) * (q[1] - hull[-2][1]) - (hull[-1][1] - hull[-2][1]) * (q[0] - hull[-2][0]) >= 0: hull.pop()
        hull.append(q)
    H_ = np.array(hull); env = np.interp(z, H_[:, 0], H_[:, 1])
    f = np.where(side, np.maximum(0.0, env - u), 0.0)
    return f
FILL = hull_fill()
def plan_side(p, a):
    """one side of the top outline (u >= 0, nose -> tail) with its pocket and flare. p = (z0, kc, b, hf)"""
    z0, kc, b, hf = p; c0 = s_at_z(z0)
    tt, hh, _, _ = dip_profile(a, b, kc)
    s = PLAN['s']; d = np.interp(s - c0, tt, hh, left=0.0, right=0.0)
    E = a + b
    fl = hf * smooth5((c0 - s) / E) * smooth5(s / max(S_CORNER, 1e-6))   # ahead of the pocket (smaller s), tapered round the nose
    return displace(PLAN, FILL + d + fl), FILL + d + fl
def section(p, a):
    """the button section (u >= 0, top centre -> base) with its groove. p = (u0, kc, b)"""
    u0, kc, b = p; c0 = s_at_u(u0)
    tt, hh, _, _ = dip_profile(a, b, kc)
    d = np.interp(SEC['s'] - c0, tt, hh, left=0.0, right=0.0)
    return displace(SEC, d), d

# ------------------------------------------------------------------ measures
def pfit(x, y, at, half):
    m = np.abs(x - at) <= half
    if m.sum() < 5: return 0.0, 0.0, float('nan')
    a2, b1, c0 = np.polyfit(x[m] - at, y[m], 2); return 2 * a2, b1, c0
def count_minima(x, y, tol=0.004):
    """local minima of y(x) (x ascending), ignoring wiggles under tol mm"""
    o = np.argsort(x); x, y = x[o], y[o]; n = 0; i = 1; mins = []
    # walk: a minimum is a point lower than everything within the nearest rise of tol on both sides
    for j in range(1, len(y) - 1):
        if y[j] <= y[j - 1] and y[j] < y[j + 1]:
            L = y[:j][::-1]; R_ = y[j + 1:]
            rl = np.argmax(L > y[j] + tol) if (L > y[j] + tol).any() else None
            rr = np.argmax(R_ > y[j] + tol) if (R_ > y[j] + tol).any() else None
            if rl is not None and rr is not None and (L[:rl] >= y[j] - 1e-9).all() and (R_[:rr] >= y[j] - 1e-9).all():
                if not mins or x[j] - mins[-1] > 1.0: mins.append(float(x[j]))
    return mins
def side_measures(P, z_target, a):
    """the side as u(z): the pocket's bottom, its depth under the hump and the flare, the minima in the finger's region"""
    m = (P['x'] > 15) & (P['y'] > -50) & (P['y'] < 50); z, u = P['y'][m], P['x'][m]
    o = np.argsort(z); z, u = z[o], u[o]
    zt = min(max(z_target, -20.0), 40.0)
    hump_i = np.argmax(np.where(z < zt - 2, u, -1)); flare_i = np.argmax(np.where((z > zt + 2) & (z < 48), u, -1))
    reg = (z >= z[hump_i]) & (z <= z[flare_i])
    mins = count_minima(z[reg], u[reg])
    ib = np.argmin(np.where(reg, u, 1e9)); zb, ub = z[ib], u[ib]
    k_t, s_t, _ = pfit(z, u, z_target, contact_d(S.N_SIDE) / 2)
    k_b, _, _ = pfit(z, u, zb, contact_d(S.N_SIDE) / 2)
    conc = concave_runs(z, u)
    return {'z_bottom': float(zb), 'u_bottom': float(ub), 'below_hump_mm': float(u[hump_i] - ub), 'z_hump': float(z[hump_i]), 'flare_mm': float(u[flare_i] - ub), 'z_flare': float(z[flare_i]),
            'minima': mins, 'n_minima': len(mins), 'k_target': float(k_t), 'slope_target': float(s_t), 'k_bottom': float(k_b), 'R_bottom': float(1 / k_b) if k_b > 0 else None,
            'concave_runs': conc}
def concave_runs(x, y, thr=0.002, minlen=2.0):
    """stretches where y'' > thr (concave from outside), from a smoothed second difference"""
    xs = np.linspace(x.min(), x.max(), 600); ys = np.interp(xs, x, y); h = xs[1] - xs[0]
    k = np.gradient(np.gradient(ys, h), h); k = np.convolve(k, np.ones(9) / 9, mode='same')
    runs, on = [], None
    for i, v in enumerate(k > thr):
        if v and on is None: on = xs[i]
        if (not v or i == len(k) - 1) and on is not None:
            if xs[i] - on >= minlen: runs.append([float(on), float(xs[i])])
            on = None
    return runs
def sec_measures(Sx, u_target, a, u_ring):
    m = Sx['y'] > 12; u, y = Sx['x'][m], Sx['y'][m]; o = np.argsort(u); u, y = u[o], y[o]
    lip_i = np.argmax(np.where((u > u_target) & (u < 29.5), y, -1e9))
    reg = (u >= 5.0) & (u <= u[lip_i])
    mins = count_minima(u[reg], y[reg])
    ib = np.argmin(np.where(reg & (np.abs(u - u_target) < 8), y, 1e9))
    k_t, s_t, _ = pfit(u, y, u_target, contact_d(S.N_BTN) / 2)
    k_b, _, _ = pfit(u, y, u[ib], contact_d(S.N_BTN) / 2)
    # the ring finger: derivatives only, along the shoulder from its contact outward (the dip ends inboard of it, so the
    # base chain's exact arc curvature is the shoulder's; b07's convention: the curvature at each point, smoothed 1.5 mm)
    sr = s_at_u(u_ring); ss_ = SEC['s']; kk = -SEC['k']; th_ = SEC['th']
    kk = np.convolve(kk, np.ones(31) / 31, mode='same')
    j = int(np.argmin(np.abs(ss_ - sr))); th = float(np.degrees(th_[j]))
    path_ = (ss_ >= sr) & (th_ > -np.pi / 2 + 0.03)
    kmax_i = int(np.argmax(np.where(path_, kk, -1))); kmax = float(kk[kmax_i])
    leave = np.nonzero(path_ & (kk > 1 / ELL))[0]
    lv = int(leave[0]) if len(leave) else None
    ysh = SEC['y'][(ss_ > sr - 4) & (ss_ < sr + 2)]; rmins = count_minima(np.arange(len(ysh), dtype=float), ysh)
    return {'u_bottom': float(u[ib]), 'y_bottom': float(y[ib]), 'lip_mm': float(y[lip_i] - y[ib]), 'u_lip': float(u[lip_i]), 'minima': mins, 'n_minima': len(mins),
            'k_target': float(k_t), 'slope_target': float(s_t), 'k_bottom': float(k_b), 'R_bottom': float(1 / k_b) if k_b > 0 else None,
            'ring': {'u': u_ring, 'slope_deg': th, 'k_deg_per_mm': float(kk[j] * DEG), 'R_mm': float(1 / kk[j]) if kk[j] > 0 else None,
                     'k_max_outboard_deg_per_mm': kmax * DEG, 'u_k_max': float(SEC['x'][kmax_i]), 'y_k_max': float(SEC['y'][kmax_i]), 'tangent_at_kmax_deg': float(np.degrees(th_[kmax_i])),
                     'leaves_at': None if lv is None else {'u': float(SEC['x'][lv]), 'y': float(SEC['y'][lv]), 'tangent_deg': float(np.degrees(th_[lv])), 'points_off': bool(th_[lv] > np.radians(-80))},
                     'k_profile': [[float(SEC['x'][i]), float(SEC['y'][i]), float(kk[i] * DEG)] for i in range(j, kmax_i + 60, 6) if i < len(kk)],
                     'band_deg_per_mm': [BAND[0] * DEG, BAND[1] * DEG], 'follow_limit_deg_per_mm': DEG / ELL, 'n_minima': len(rmins),
                     'verdict': ('past the follow limit' if kmax * DEG > DEG / ELL else 'past the band' if kmax * DEG > BAND[1] * DEG else 'in the band')}}

# ------------------------------------------------------------------ one trial
def trial(grip, pockets, steps=260, log=True):
    p50 = place(grip, 1.0); anc = p50['z']['index'] if grip == 'lifted' else None
    pl = {key: (p50 if key == 'p50' else place(grip, HANDS[key] / HANDS['p50'], anc)) for key in HANDS}
    T50 = pl['p50']['z']
    spread = {f: [min(pl[k]['z'][f] for k in pl), max(pl[k]['z'][f] for k in pl)] for f in ('thumb', 'little', 'index', 'middle', 'ring')}
    dC_side, dC_btn = contact_d(S.N_SIDE), contact_d(S.N_BTN)
    lat = 1.645 * BREADTH_SD / 3                         # derived: each fingertip's sideways spread, 5th to 95th hand
    a_g = (dC_btn + 2 * lat) / 2
    opt = S.table(); kT, kP = opt['thumb']['kappa_opt_per_mm'], opt['little']['kappa_opt_per_mm']
    kG = 0.5 * (opt['index']['kappa_opt_per_mm'] + opt['middle']['kappa_opt_per_mm'])
    zT, zP = T50['thumb'], T50['little']
    if pockets == 'sym':
        lo, hi = min(spread['thumb'][0], spread['little'][0]), max(spread['thumb'][1], spread['little'][1])
        aL = aR = (hi - lo + dC_side) / 2; zcL = zcR = (lo + hi) / 2
    else:
        aL = (spread['thumb'][1] - spread['thumb'][0] + dC_side) / 2; aR = (spread['little'][1] - spread['little'][0] + dC_side) / 2
        zcL, zcR = sum(spread['thumb']) / 2, sum(spread['little']) / 2
    u_g = 16.0; u_ring = 16.0 + 12.5
    # the modified base (Brock): pockets 2.5 mm per side under the hump and 1.1 mm of front flare (the ULX's), grooves 1 mm deep
    def base_side(zc, a):
        def r(v):
            kc, hf = v; P, _ = plan_side((zc, kc, a / 1.5, hf), a); M = side_measures(P, zc, a)
            return [M['below_hump_mm'] - ULX_POCKET, M['flare_mm'] - ULX_FLARE]
        return least_squares(r, [0.02, 0.8], bounds=([0.0, 0.0], [0.2, 3.0])).x
    kL0, hL0 = base_side(zcL, aL); kR0, hR0 = (kL0, hL0) if pockets == 'sym' else base_side(zcR, aR)
    def gdepth(kc):
        _, hh, _, _ = dip_profile(a_g, a_g / 1.5, kc); return -hh.min()
    kg0 = float(least_squares(lambda v: [gdepth(v[0]) - 1.0], [0.05], bounds=([0.0], [0.5])).x[0])
    names = ['zL', 'kL', 'bL', 'hL', 'zR', 'kR', 'bR', 'hR', 'ug', 'kg', 'bg']
    ug0 = u_g - 0.162 / kg0   # the crown slopes 9.2 deg at the fingertips' line (the Sora at z 30): the bottom sits slope / kc outboard of the dip's centre
    base = np.array([zcL, kL0, aL / 1.5, hL0, zcR, kR0, aR / 1.5, hR0, ug0, kg0, a_g / 1.5])
    scale = np.array([5.0, 0.01, 4.0, 0.5, 5.0, 0.01, 4.0, 0.5, 2.0, 0.02, 2.0])
    tie = pockets == 'sym'
    def unpack(v):
        p = base + v * scale
        p[3] = max(p[3], 0.0); p[7] = max(p[7], 0.0)            # front flare >= 0: the front never narrows below the Sora
        p[1] = max(p[1], 1e-4); p[5] = max(p[5], 1e-4); p[9] = max(p[9], 1e-4)
        p[2] = max(p[2], 1.0); p[6] = max(p[6], 1.0); p[10] = max(p[10], 1.0)
        if tie: p[4:8] = p[0:4]
        return p
    def build(p):
        PL, dL = plan_side(p[0:4], aL); PR, dR = plan_side(p[4:8], aR); Sx, dS = section(p[8:11], a_g)
        return PL, PR, Sx, dL, dR, dS
    def terms(v):
        p = unpack(v); PL, PR, Sx, dL, dR, dS = build(p); t = {}
        ML, MR, MS = side_measures(PL, zT, aL), side_measures(PR, zP, aR), sec_measures(Sx, u_g, a_g, u_ring)
        # level under each finger and the strength it needs, pad-averaged at the finger's own target
        t['level'] = ((p[0] - zcL) / 2.0) ** 2 + ((p[4] - zcR) / 2.0) ** 2 + ((ML['z_bottom'] - p[0]) / 2.0) ** 2 + ((MR['z_bottom'] - p[4]) / 2.0) ** 2 + ((MS['u_bottom'] - u_g) / 1.0) ** 2
        t['strength'] = ((ML['k_bottom'] - kT) / kT) ** 2 + ((MR['k_bottom'] - kP) / kP) ** 2 + ((MS['k_bottom'] - kG) / kG) ** 2
        # one minimum per finger, and no concave stretch but the valleys
        t['one_min'] = (ML['n_minima'] - 1) ** 2 + (MR['n_minima'] - 1) ** 2 + (MS['n_minima'] - 1) ** 2 + MS['ring']['n_minima'] ** 2
        t['concave'] = max(0, len(ML['concave_runs']) - 1) + max(0, len(MR['concave_runs']) - 1)
        # bounds: within 3.5 mm of the Sora; radii a mould can make
        dev = max(np.abs(dL).max(), np.abs(dR).max(), np.abs(dS).max())
        t['bound'] = max(0.0, dev - BOUND) ** 2 * 10
        rimL = rim_radius(p[1], aL, p[2]); rimR = rim_radius(p[5], aR, p[6]); rimG = rim_radius(p[9], a_g, p[10])
        t['radii'] = sum(max(0.0, RMIN_PLAN - r) ** 2 for r in (rimL, rimR, 1 / max(p[1], 1e-6), 1 / max(p[5], 1e-6))) + sum(max(0.0, RMIN_SEC - r) ** 2 for r in (rimG, 1 / max(p[9], 1e-6)))
        # a light pull toward Brock's modified base (not the Sora)
        t['base'] = float(np.sum(v ** 2)) * 0.02
        info = {'thumb': ML, 'pinky': MR, 'grooves': MS, 'dev_sora_mm': float(dev), 'rim_R': {'thumb': rimL, 'pinky': rimR, 'groove': rimG}}
        return t, info
    W = {'level': 1.0, 'strength': 1.0, 'one_min': 2.0, 'concave': 0.5, 'bound': 1.0, 'radii': 0.05, 'base': 1.0}
    def loss(v): t, _ = terms(v); return sum(W[k] * t[k] for k in W)
    v = np.zeros(len(base)); free = [i for i in range(len(v)) if not (tie and 4 <= i < 8)]
    m1 = np.zeros_like(v); m2 = np.zeros_like(v); hist, path = [], []
    for it in range(1, steps + 1):
        f0 = loss(v); g = np.zeros_like(v)
        for i in free:
            e = np.zeros_like(v); e[i] = 2e-3; g[i] = (loss(v + e) - loss(v - e)) / 4e-3
        m1 = 0.9 * m1 + 0.1 * g; m2 = 0.999 * m2 + 0.001 * g * g
        v = v - 0.03 * (m1 / (1 - 0.9 ** it)) / (np.sqrt(m2 / (1 - 0.999 ** it)) + 1e-8)
        hist.append(float(f0))
        if it % 10 == 0 or it == 1: path.append({'it': it, 'p': unpack(v).round(5).tolist(), 'loss': float(f0)})
        if log and it % 65 == 0: print('  %s/%s it %3d loss %.4f' % (grip, pockets, it, f0), flush=True)
    t0, i0 = terms(np.zeros(len(base))); t1, i1 = terms(v); pF = unpack(v); p0 = unpack(np.zeros(len(base)))
    PL, PR, Sx, dL, dR, dS = build(pF); PL0, PR0, Sx0, *_ = build(p0)
    def gap(Aa, Bb):
        from scipy.spatial import cKDTree
        d, _ = cKDTree(np.c_[Bb['x'], Bb['y']]).query(np.c_[Aa['x'], Aa['y']]); return float(d.max())
    out = {'grip': grip, 'pockets': pockets, 'placement': pl, 'spread': spread,
           'derived': {'contact_side_mm': dC_side, 'contact_btn_mm': dC_btn, 'lat_spread_mm': lat, 'a_thumb': aL, 'a_pinky': aR, 'a_groove': a_g,
                       'core_len_thumb': 2 * aL, 'core_len_pinky': 2 * aR, 'core_len_groove': 2 * a_g,
                       'k_opt': {'thumb': kT, 'pinky': kP, 'groove': kG}, 'R_opt': {'thumb': 1 / kT, 'pinky': 1 / kP, 'groove': 1 / kG},
                       'targets': {'thumb_z': zT, 'pinky_z': zP, 'groove_u': u_g, 'ring_u': u_ring, 'station_z': ZST}},
           'names': names, 'base_params': p0.tolist(), 'final_params': pF.tolist(),
           'loss': hist, 'path': path, 'terms_base': t0, 'terms_final': t1, 'base': i0, 'final': i1,
           'dev_from_base_mm': {'plan': max(gap(PL, PL0), gap(PR, PR0)), 'section': gap(Sx, Sx0)},
           'curves': {'planL': np.c_[PL['x'], PL['y']][::8].round(3).tolist(), 'planR': np.c_[PR['x'], PR['y']][::8].round(3).tolist(), 'sec': np.c_[Sx['x'], Sx['y']][::6].round(3).tolist(),
                      'planL_base': np.c_[PL0['x'], PL0['y']][::8].round(3).tolist(), 'planR_base': np.c_[PR0['x'], PR0['y']][::8].round(3).tolist(), 'sec_base': np.c_[Sx0['x'], Sx0['y']][::6].round(3).tolist()}}
    return out

def rim_radius(kc, a, b):
    x = np.linspace(0, 1, 401); m = 0.5 + a / max(b, 1e-6); g = (1 - 3 * x ** 2 + 2 * x ** 3) - m * 30 * x ** 2 * (1 - x) ** 2
    mn = g.min() * kc; return float(-1 / mn) if mn < 0 else 1e9

def main():
    res = {'about': 'trials.py: four trials of the descent (grip x pockets) on the modified base', 'bound_mm': BOUND, 'ulx': {'pocket': ULX_POCKET, 'flare': ULX_FLARE},
           'sora': {'plan': np.c_[PLAN['x'], PLAN['y']][::8].round(3).tolist(), 'sec': np.c_[SEC['x'], SEC['y']][::6].round(3).tolist()}, 'trials': {}}
    sora_side = side_measures(PLAN, 13.8, 10); sora_sec = sec_measures(SEC, 16.0, 5.0, 28.5)
    res['sora_measures'] = {'side': sora_side, 'sec': sora_sec}
    for grip in ('heel', 'lifted'):
        for pockets in ('sym', 'fwd'):
            print('trial', grip, pockets, flush=True)
            res['trials'][grip + '_' + pockets] = trial(grip, pockets)
    json.dump(res, open(os.path.join(HERE, 'out', 'trials.json'), 'w'))
    for k, r in res['trials'].items():
        f = r['final']; d = r['derived']
        print('%-12s loss %.3f -> %.3f | thumb z %.1f (target %.1f) R %s/%.0f below-hump %.2f flare %.2f n=%d | pinky z %.1f (target %.1f) R %s/%.0f n=%d | groove u %.1f R %s/%.0f lip %.2f n=%d | ring %.1f deg/mm max %.1f n=%d | dev Sora %.2f base %.2f/%.2f' % (
            k, r['loss'][0], r['loss'][-1], f['thumb']['z_bottom'], d['targets']['thumb_z'], fmt(f['thumb']['R_bottom']), d['R_opt']['thumb'], f['thumb']['below_hump_mm'], f['thumb']['flare_mm'], f['thumb']['n_minima'],
            f['pinky']['z_bottom'], d['targets']['pinky_z'], fmt(f['pinky']['R_bottom']), d['R_opt']['pinky'], f['pinky']['n_minima'],
            f['grooves']['u_bottom'], fmt(f['grooves']['R_bottom']), d['R_opt']['groove'], f['grooves']['lip_mm'], f['grooves']['n_minima'], f['grooves']['ring']['k_deg_per_mm'], f['grooves']['ring']['k_max_outboard_deg_per_mm'], f['grooves']['ring']['n_minima'],
            f['dev_sora_mm'], r['dev_from_base_mm']['plan'], r['dev_from_base_mm']['section']))
    print('sora side', json.dumps({k: sora_side[k] for k in ('z_bottom', 'below_hump_mm', 'flare_mm', 'n_minima', 'R_bottom')}))
def fmt(v): return '%.0f' % v if v else '-'

if __name__ == '__main__':
    main()
