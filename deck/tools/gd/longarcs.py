"""Phase 3 (G2, after Brock 13:33: "arcs that span the whole sides, not tiny ones" / "they look way too extreme and nothing
like normal mice"): the shape as a few LONG arcs, the strength from what a fingertip can feel, the four trials again.

THE MODEL. Each side of the top outline (u >= 0, nose -> tail) is the Sora's own fitted chain regrouped:
  nose cap (fit arcs 1-3, fixed) | F front arc | W waist arc (concave) | H hump arc | C rear corner | tail tip (fit arc 8, fixed)
W is set by its chord length c, its depth d (sagitta), the z of its chord's middle zc and its chord's angle a (+ = the side
converges toward the front). F then follows exactly: its turn meets W's tangent, its length puts W's middle at zc. H and C
close the chain onto the fixed tail tip and set the hump's half-width uh (a 2-unknown solve). All joins are tangent-continuous
(G1, as the Sora's own fit). Changing W moves F, H and C only; the nose and tail never move. The waist's bottom (the side's
narrowest point) is that finger's one minimum, by construction: one concave arc between convex ones.
Across the buttons (z 30) the half section is regrouped the same way from the top centre:
  I inner crown arc | G groove arc (concave) | S shoulder arc | K shoulder corner (the Sora's radius) | side wall (fixed)
G is set by c, d, its middle's u, and its chord's angle; I follows exactly; S and K close onto the fixed side wall.
THE STRENGTH (with friction). Skin on plastic grips (dry skin mu > 0.2, typically about 0.5: Derler & Gerhardt 2012), so a
resting fingertip does not slide on a slope under atan(mu) (11 deg at mu 0.2): the pocket does not have to hold the finger.
Its job is to be felt. A fingertip feels a curve by how much the surface turns across the stretch it touches: Gordon &
Morison 1982, a constant overall gradient of 0.009 (SD about 0.003) at threshold over 20 to 40 mm, which is a turn of 4 x
0.009 rad = 2.1 deg; Pont et al. 1999, 3.3 to 5.3 deg in dynamic touch. Reliably felt: the mean plus two SD, 4 x 0.015 rad
= 3.4 deg (derived). The stretch is where the fingertip lands: its contact (Serhat 2022) plus the spread across 90 % of
hands (ANSUR II). The gentlest arc that turns 3.4 deg across it: kappa* = 0.060 / w. Normal mice bound it from the other
side: the outline within real mice's widths (mice.json: 60.5 to 70 mm wide) and the waist no deeper than the UltralightX's
2.5 mm a side (TechPowerUp).
OVER THE WHOLE SLIDE (G3, after Brock ~14:20, F65.6: "Over the whole slide"). The side arcs are felt over the whole distance
the thumb (and the pinky) slides along the side as you grip, not only where it lands. As you take hold, the hand lands with
the palm on the hump and the fingers relaxed (the heel placement), then draws back and lifts into the zero-g grip with the
fingertips on the buttons (the lifted placement, trial 4's); the thumb and the pinky ride the sides throughout, so each slides
by the difference between its two placements (hand model; derived): 21.0 mm the thumb, 24.9 mm the pinky for the ANSUR II mean
hand (11 to 34 and 15 to 38 mm from the 5th to the 95th). The waist arc must turn 3.4 deg across that slide (dynamic touch
judges the change of attitude along the path: Pont 1999), kappa* = 0.060 / slide, and be long enough to carry it: its chord at
least the slide plus the contact patch (half a patch past each end). The grooves keep the landing rule (F65.6 names the sides).
G3 also: each trial starts from the Sora's waists slid so that their narrowest point (not their chord's middle) sits at the
rest (the chord leans, so the middle-at-rest start ran the thumb's waist past the nose corner and the descent crawled back);
mirrored pockets count each finger against its own rest (G2 counted both against the mean, which hid that each sits 10 mm
off); the front arc must run forward (a negative length looped the outline); the top outline stays within DEV_BOUND of the
Sora's. Cross-checks on the slide: slide_checks.py.
Run: python3 deck/tools/gd/longarcs.py run [trial keys] -> out/longarcs.json"""
import json, os, sys
import numpy as np
from scipy.optimize import least_squares
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import arcs as A
import trials as T          # the hand placement and the spreads (place, HANDS, contact_d, BREADTH_SD), unchanged

FIT = json.load(open(os.path.join(HERE, 'out', 'sora_arcs.json')))['curves']
DEG = np.pi / 180
TURN_REL = 4 * (0.009 + 2 * 0.003)    # rad, reliably felt: Gordon & Morison 1982 mean + 2 SD, as a turn (3.44 deg; derived)
TURN_MEAN = 4 * 0.009                 # rad, their mean threshold as a turn (2.06 deg)
MU_DRY = (0.2, 0.5)                   # skin friction, dry: over 0.2, typically about 0.5 (Derler & Gerhardt 2012)
WIDTH_RANGE = (60.5, 70.0)            # mm, the widest point of 35 flagship mice (research/data/mice.json, EloShapes)
ULX_POCKET = T.ULX_POCKET             # 2.5 mm a side (TechPowerUp widths; derived)
SEC_BOUND = 2.0                       # mm, the section within this of the Sora's (estimate: a normal button top)
DEV_BOUND = 2.5                       # mm, the top outline within this of the Sora's anywhere (G3; estimate: still the Sora, F65.1
                                      # "should not be that out there"). Unbound, trial 4 wandered 4.4 mm at the rear at no gain.

# ------------------------------------------------------------------ the Sora's chains, regrouped
PA = [tuple(a) for a in FIT['plan']['arcs']]; P0, TH0 = FIT['plan']['p0'], FIT['plan']['th0']
NOSE = PA[:3]; TAIL = PA[7:]
def endpoint(p0, th0, arcs):
    C = A.chain(p0, th0, arcs, ds=0.05); return np.array([C['x'][-1], C['y'][-1]]), float(C['th'][-1])
P3, H3 = endpoint(P0, TH0, NOSE)                       # where the nose cap ends (the front arc starts)
SORA_PLAN = A.chain(P0, TH0, PA, ds=0.1)
PEND, HEND = np.array([SORA_PLAN['x'][-1], SORA_PLAN['y'][-1]]), float(SORA_PLAN['th'][-1])
L8, F8 = TAIL[0]; H8 = HEND - F8                       # the tail tip arc: fixed; its start T8 is fixed
T8 = PEND - (np.array([np.sin(HEND) - np.sin(H8), -(np.cos(HEND) - np.cos(H8))]) / (F8 / L8))
SA = [tuple(a) for a in FIT['xsec']['30']['arcs']]; S0, STH0 = FIT['xsec']['30']['p0'], FIT['xsec']['30']['th0']
WALL = SA[4:]
SORA_SEC = A.chain(S0, STH0, SA, ds=0.05)
Q5, HQ5 = endpoint(S0, STH0, SA[:4])                  # where the side wall starts (fixed)
KC = SA[3][1] / SA[3][0]                               # the shoulder corner's curvature, the Sora's (R 4.9 mm)

def disp(L, phi, h):
    """an arc's displacement from heading h, length L, turn phi"""
    if abs(phi) < 1e-9: return np.array([np.cos(h), np.sin(h)]) * L
    return np.array([np.sin(h + phi) - np.sin(h), -(np.cos(h + phi) - np.cos(h))]) * (L / phi)
def arc_of(c, d):
    """a circular arc from its chord c and sagitta d (d > 0): radius, turn, length"""
    d = max(d, 1e-5); R = c * c / (8 * d) + d / 2; phi = 2 * np.arcsin(min(1.0, c / (2 * R))); return R, phi, R * phi

def plan_side(p):
    """p = (c, d, zc, a_deg, uh) -> the half outline's arcs, with the closure's residual"""
    c, d, zc, a, uh = p; R, phW, LW = arc_of(c, d)
    thc = -np.pi / 2 + a * DEG; thB = thc - phW / 2
    phF = thB - H3
    k = (np.cos(H3) - np.cos(H3 + phF)) / phF if abs(phF) > 1e-9 else np.sin(H3)
    LF = (zc - (c / 2) * np.sin(thc) - P3[1]) / k
    B = P3 + disp(LF, phF, H3); Apt = B + c * np.array([np.cos(thc), np.sin(thc)]); thA = thc + phW / 2
    def res(v):
        phH, LH = v; E = Apt + disp(LH, phH, thA); e = thA + phH; phC = H8 - e; D = T8 - E
        r1 = np.arctan2(D[1], D[0]) - (e + phC / 2); r1 = (r1 + np.pi) % (2 * np.pi) - np.pi
        kH = phH / LH; xmax = Apt[0] + (-1 - np.sin(thA)) / kH if (thA > -np.pi / 2 > e and kH < 0) else max(Apt[0], E[0])
        return [r1 * 50, xmax - uh]
    sol = least_squares(res, [-42.13 * DEG, 26.41], bounds=([-120 * DEG, 3.0], [-1 * DEG, 80.0]), xtol=1e-12, ftol=1e-12)
    phH, LH = sol.x; E = Apt + disp(LH, phH, thA); e = thA + phH; phC = H8 - e; D = T8 - E
    chord = np.hypot(*D); RC = chord / (2 * abs(np.sin(phC / 2))) if abs(phC) > 1e-9 else 1e9; LC = RC * abs(phC)
    arcs = NOSE + [(LF, phF), (LW, phW), (LH, phH), (LC, phC)] + TAIL
    return {'arcs': arcs, 'closure': float(np.hypot(*sol.fun)), 'LF': LF, 'R': R, 'phW': phW, 'A': Apt, 'B': B}
def sec_half(p):
    """p = (c, d, uc, a_deg): the groove; a + = its chord falls outboard"""
    c, d, uc, a = p; R, phG, LG = arc_of(c, d)
    thc = -a * DEG; thB = thc - phG / 2; phI = thB - STH0
    LI = (uc - (c / 2) * np.cos(thc)) * (phI / np.sin(phI) if abs(phI) > 1e-9 else 1.0)
    B = np.array(S0) + disp(LI, phI, STH0); Apt = B + c * np.array([np.cos(thc), np.sin(thc)]); thA = thc + phG / 2
    def res(v):
        LS, LK = v; phK = KC * LK; phS = HQ5 - thA - phK; E = Apt + disp(LS, phS, thA) ; E2 = E + disp(LK, phK, thA + phS)
        return (E2 - Q5) * 10
    sol = least_squares(res, [7.33, 6.78], bounds=([0.3, 0.5], [40.0, 30.0]), xtol=1e-12, ftol=1e-12)
    LS, LK = sol.x; phK = KC * LK; phS = HQ5 - thA - phK
    arcs = [(LI, phI), (LG, phG), (LS, phS), (LK, phK)] + WALL
    return {'arcs': arcs, 'closure': float(np.hypot(*sol.fun) / 10), 'R': R, 'phG': phG, 'A': Apt, 'B': B}

# ------------------------------------------------------------------ the Sora's own long-arc parameters (a check: rebuilding them gives the Sora)
def sora_plan_params():
    LW, phW = PA[4]; R = LW / phW; c = 2 * R * np.sin(phW / 2); d = R * (1 - np.cos(phW / 2))
    th_start = TH0 + sum(a[1] for a in PA[:4]); thc = th_start + phW / 2
    C = A.chain(P0, TH0, PA[:4], ds=0.05); B = np.array([C['x'][-1], C['y'][-1]]); M = B + (c / 2) * np.array([np.cos(thc), np.sin(thc)])
    uh = float(SORA_PLAN['x'][(SORA_PLAN['y'] < 0) & (SORA_PLAN['y'] > -45)].max())
    return np.array([c, d, M[1], (thc + np.pi / 2) / DEG, uh])
def sora_sec_params():
    LG, phG = SA[1]; R = LG / phG; c = 2 * R * np.sin(phG / 2); d = R * (1 - np.cos(phG / 2)); thc = STH0 + SA[0][1] + phG / 2
    C = A.chain(S0, STH0, SA[:1], ds=0.05); B = np.array([C['x'][-1], C['y'][-1]]); M = B + (c / 2) * np.array([np.cos(thc), np.sin(thc)])
    return np.array([c, d, M[0], -thc / DEG])

# ------------------------------------------------------------------ measures
def count_minima(x, y, tol=0.004): return T.count_minima(x, y, tol)
def side_measure(ch, z_rest):
    """the side as u(z): the hump (widest behind z 0), the bottom (narrowest between the hump and the nose corner), the front
    crest (widest between the bottom and the nose corner); minima counted between the hump and the front crest"""
    zl = float(P3[1]) + 1.0
    m = (ch['x'] > 15) & (ch['y'] > -50) & (ch['y'] < 50); z, u = ch['y'][m], ch['x'][m]; o = np.argsort(z); z, u = z[o], u[o]
    hump_i = int(np.argmax(np.where(z < 0, u, -1)))
    side = (z > z[hump_i]) & (z < zl); mins0 = count_minima(z[side], u[side])
    ib = int(np.argmin(np.abs(z - min(mins0, key=lambda q: abs(q - z_rest))))) if mins0 else int(np.argmin(np.where(side, u, 1e9)))
    front_i = int(np.argmax(np.where((z >= z[ib]) & (z < zl), u, -1)))
    reg = (z >= z[hump_i]) & (z <= z[front_i]); mins = count_minima(z[reg], u[reg])
    return {'z_bottom': float(z[ib]), 'u_bottom': float(u[ib]), 'u_hump': float(u[hump_i]), 'z_hump': float(z[hump_i]), 'u_front': float(u[front_i]), 'z_front': float(z[front_i]),
            'below_hump': float(u[hump_i] - u[ib]), 'flare': float(u[front_i] - u[ib]), 'minima': mins, 'n_minima': len(mins), 'rest_z': z_rest}
BTN = (4.8, 26.0)    # mm: the button top, from the wheel's slot to where the shoulder begins (the Sora at z 30)
def sec_measure(ch, u_rest, u_ring):
    """the groove's valley measured against the button's own chord (the finger presses along the button's normal, and
    feels a groove against the surface round it: Pont et al. 1999, attitude differences): minima of the height over that
    chord, between the slot and the shoulder"""
    m = ch['y'] > 12; u, y = ch['x'][m], ch['y'][m]; o = np.argsort(u); u, y = u[o], y[o]
    y0, y1 = np.interp(BTN[0], u, y), np.interp(BTN[1], u, y); sl = (y1 - y0) / (BTN[1] - BTN[0]); cs = 1 / np.hypot(1, sl)
    h = (y - (y0 + sl * (u - BTN[0]))) * cs
    reg = (u >= BTN[0]) & (u <= BTN[1]); mins = count_minima(u[reg], h[reg])
    j = np.nonzero(reg)[0]; ib = int(np.argmin(np.abs(u - min(mins, key=lambda q: abs(q - u_rest))))) if mins else int(j[np.argmin(h[reg])])
    # the ring finger on the shoulder: the slope and the rate of turn at its contact, and no minimum along the surface there
    top = np.nonzero(ch['y'] > 12)[0]; i = int(top[np.argmin(np.abs(ch['x'][top] - u_ring))]); k = -ch['k'][i]
    sr = ch['s'][i]; along = (ch['s'] > sr - 4) & (ch['s'] < sr + 2); rmins = count_minima(ch['s'][along], ch['y'][along])
    return {'u_bottom': float(u[ib]), 'y_bottom': float(y[ib]), 'depth_chord': float(-h[ib]), 'chord_deg': float(np.degrees(np.arctan(sl))), 'minima': mins, 'n_minima': len(mins),
            'ring': {'u': u_ring, 'slope_deg': float(np.degrees(ch['th'][i])), 'k_deg_per_mm': float(k / DEG), 'n_minima': len(rmins)}}
def dev(ch, ref):
    from scipy.spatial import cKDTree
    d, _ = cKDTree(np.c_[ref['x'], ref['y']]).query(np.c_[ch['x'], ch['y']]); return float(d.max())

# ------------------------------------------------------------------ the felt strength: the gentlest arc that turns TURN_REL across where the fingertip lands
def _bottom_off():
    s0 = sora_plan_params(); C = A.chain(P0, TH0, plan_side(s0)['arcs'], ds=0.1); return side_measure(C, 10.0)['z_bottom'] - s0[2]
BOTTOM_OFF = _bottom_off()                                         # mm, the Sora's narrowest point ahead of its waist chord's middle
def placements(grip):
    p50 = T.place(grip, 1.0); anc = p50['z']['index'] if grip == 'lifted' else None
    return {k: (p50 if k == 'p50' else T.place(grip, T.HANDS[k] / T.HANDS['p50'], anc)) for k in T.HANDS}
PL_LIFT, PL_HEEL = placements('lifted'), placements('heel')
def slides():
    """the slide as you grip, per hand: from the landing (palm on the hump, fingers relaxed) to the grip (palm lifted, tips on
    the buttons). Cross-checks (parts of the motion, not the whole slide) in slide_checks.py."""
    out = {}
    for hk in T.HANDS:
        L, H_ = PL_LIFT[hk], PL_HEEL[hk]
        out[hk] = {'thumb': [L['z']['thumb'], H_['z']['thumb']], 'pinky': [L['z']['little'], H_['z']['little']],
                   'slide': {'thumb': abs(H_['z']['thumb'] - L['z']['thumb']), 'pinky': abs(H_['z']['little'] - L['z']['little'])}}
    return out
SL = slides()
SLIDE = dict(SL['p50']['slide'])                                    # mm, the ANSUR II mean hand (derived)
SLIDE_RANGE = {f: [min(SL[k]['slide'][f] for k in SL), max(SL[k]['slide'][f] for k in SL)] for f in ('thumb', 'pinky')}
def zones(grip):
    pl = PL_LIFT if grip == 'lifted' else PL_HEEL; p50 = pl['p50']
    sp = {f: [min(pl[k]['z'][f] for k in pl), max(pl[k]['z'][f] for k in pl)] for f in ('thumb', 'little', 'index', 'middle', 'ring')}
    dS, dB = T.contact_d(T.S.N_SIDE), T.contact_d(T.S.N_BTN); lat = 1.645 * T.BREADTH_SD / 3
    # the sides: felt over the whole slide (F65.6); the grooves: over where the fingertip lands, as before
    w = {'thumb': SLIDE['thumb'], 'pinky': SLIDE['pinky'], 'groove': dB + 2 * lat}
    land = {'thumb': dS + sp['thumb'][1] - sp['thumb'][0], 'pinky': dS + sp['little'][1] - sp['little'][0]}
    return p50, sp, w, {'contact_side': dS, 'contact_btn': dB, 'lat': lat, 'land': land}

def trial(grip, pockets, steps=500, log=True, lr=0.05, start_felt=False, devbound=None):
    devbound = DEV_BOUND if devbound is None else devbound
    p50, sp, w, cd = zones(grip)
    zT0, zP0 = p50['z']['thumb'], p50['z']['little']; zT, zP = zT0, zP0; dS = cd['contact_side']
    if pockets == 'sym':
        # one mirrored waist, placed between the two rests: each finger's own slide is felt on it (the shorter sets it), it is
        # long enough for the longer one, and each finger still counts against its OWN rest (G3: G2 counted both against the mean)
        zT = zP = (zT0 + zP0) / 2; wT = wP = min(w['thumb'], w['pinky']); cT = cP = max(w['thumb'], w['pinky']) + dS
    else: wT, wP = w['thumb'], w['pinky']; cT, cP = w['thumb'] + dS, w['pinky'] + dS
    kT, kP, kG = TURN_REL / wT, TURN_REL / wP, TURN_REL / w['groove']
    s0, g0 = sora_plan_params(), sora_sec_params()
    # the start: the Sora's own waists and groove, moved to rest where each finger rests (a designer's first move)
    # (G3) slid so that its narrowest point, not its chord's middle, sits at the rest: the Sora's bottom is BOTTOM_OFF ahead of
    # its chord's middle (the chord leans 1.7 deg), so a middle at the rest put the thumb's waist past the nose corner
    base = np.r_[s0[0], s0[1], zT - BOTTOM_OFF, s0[3], s0[4], s0[0], s0[1], zP - BOTTOM_OFF, s0[3], s0[4], 20.0, 0.25, 16.0, g0[3]]
    if start_felt: base[1], base[6] = s0[0] ** 2 / (8 / kT), s0[0] ** 2 / (8 / kP)     # the Sora's waist at the felt radius
    scale = np.array([8.0, 0.4, 4.0, 1.0, 0.5, 8.0, 0.4, 4.0, 1.0, 0.5, 3.0, 0.08, 2.0, 1.0])
    tie = pockets == 'sym'
    def unpack(v):
        p = base + v * scale
        if tie: p[5:10] = p[0:5]
        return p
    def build(p):
        L = plan_side(p[0:5]); R_ = plan_side(p[5:10]); Sx = sec_half(p[10:14])
        return L, R_, Sx, A.chain(P0, TH0, L['arcs'], ds=0.25), A.chain(P0, TH0, R_['arcs'], ds=0.25), A.chain(S0, STH0, Sx['arcs'], ds=0.1)
    def terms(v):
        p = unpack(v); L, R_, Sx, CL, CR, CS = build(p); t = {}
        ML, MR, MS = side_measure(CL, zT), side_measure(CR, zP), sec_measure(CS, 16.0, 28.5)
        ML['rest_z'], MR['rest_z'] = zT0, zP0
        # each finger's one minimum at its own rest, felt and no deeper than normal
        t['level'] = ((ML['z_bottom'] - zT0) / 2.0) ** 2 + ((MR['z_bottom'] - zP0) / 2.0) ** 2 + ((MS['u_bottom'] - 16.0) / 1.0) ** 2
        kL, kR, kS = 1 / L['R'], 1 / R_['R'], 1 / Sx['R']
        t['felt'] = max(0.0, (kT - kL) / kT) ** 2 * 4 + max(0.0, (kP - kR) / kP) ** 2 * 4 + max(0.0, (kG - kS) / kG) ** 2 * 4
        t['gentle'] = ((kL - kT) / kT) ** 2 * 0.25 + ((kR - kP) / kP) ** 2 * 0.25 + ((kS - kG) / kG) ** 2 * 0.25
        # the waist long enough to carry the whole slide: its chord at least the slide plus the contact patch
        t['cover'] = max(0.0, (cT - p[0]) / 2.0) ** 2 + max(0.0, (cP - p[5]) / 2.0) ** 2
        t['one_min'] = (ML['n_minima'] - 1) ** 2 + (MR['n_minima'] - 1) ** 2 + (MS['n_minima'] - 1) ** 2 + MS['ring']['n_minima'] ** 2
        t['normal'] = max(0.0, ML['below_hump'] - ULX_POCKET) ** 2 * 4 + max(0.0, MR['below_hump'] - ULX_POCKET) ** 2 * 4
        wmax = ML['u_hump'] + MR['u_hump']
        t['normal'] += max(0.0, WIDTH_RANGE[0] - wmax) ** 2 + max(0.0, wmax - WIDTH_RANGE[1]) ** 2
        t['normal'] += max(0.0, dev(CS, SORA_SEC) - SEC_BOUND) ** 2 * 4
        if devbound: t['normal'] += max(0.0, max(dev(CL, SORA_PLAN), dev(CR, SORA_PLAN)) - devbound) ** 2 * 4
        # closed, and the front arc running forward (a negative length would loop the outline back on itself)
        t['closure'] = (L['closure'] ** 2 + R_['closure'] ** 2 + Sx['closure'] ** 2) * 100 + sum(max(0.0, 1.0 - q) ** 2 for q in (L['LF'], R_['LF'])) * 100
        t['base'] = float(np.sum(v ** 2)) * 0.01
        return t, {'L': L, 'R': R_, 'S': Sx, 'ML': ML, 'MR': MR, 'MS': MS, 'CL': CL, 'CR': CR, 'CS': CS}
    W = {'level': 1.0, 'felt': 1.0, 'gentle': 1.0, 'cover': 1.0, 'one_min': 2.0, 'normal': 1.0, 'closure': 1.0, 'base': 1.0}
    def loss(v): t, _ = terms(v); return sum(W[k] * t[k] for k in W)
    v = np.zeros(len(base)); free = [i for i in range(len(v)) if not (tie and 5 <= i < 10)]
    m1 = np.zeros_like(v); m2 = np.zeros_like(v); hist, path = [], []
    for it in range(1, steps + 1):
        f0 = loss(v); g = np.zeros_like(v)
        for i in free:
            e = np.zeros_like(v); e[i] = 2e-3; g[i] = (loss(v + e) - loss(v - e)) / 4e-3
        m1 = 0.9 * m1 + 0.1 * g; m2 = 0.999 * m2 + 0.001 * g * g
        v = v - lr * (m1 / (1 - 0.9 ** it)) / (np.sqrt(m2 / (1 - 0.999 ** it)) + 1e-8)
        hist.append(float(f0)); path.append({'it': it, 'p': unpack(v).round(5).tolist(), 'loss': float(f0)})
        if log and it % 40 == 0: print('  %s/%s it %3d loss %.4f' % (grip, pockets, it, f0), flush=True)
    # (G3) the descent stops at the lowest point it found: Adam can step past it and climb (trial 4 rose from 0.008 to 0.06)
    if hist:
        ib = int(np.argmin(hist)); v = (np.array(path[ib - 1]['p']) - base) / scale if ib > 0 else np.zeros(len(base))
        hist, path = hist[:ib + 1], path[:ib]
    tF, iF = terms(v); t0, i0 = terms(np.zeros(len(base)))
    return {'grip': grip, 'pockets': pockets, 'v': v.tolist(), 'base': base.tolist(), 'scale': scale.tolist(), 'final': unpack(v).tolist(), 'start': unpack(np.zeros(len(base))).tolist(),
            'loss': hist, 'path': path, 'terms0': t0, 'terms': tF, 'targets': {'thumb_z': zT0, 'pinky_z': zP0, 'pocket_z': [zT, zP], 'groove_u': 16.0, 'ring_u': 28.5, 'station_z': 30.0},
            'zones': {'thumb': wT, 'pinky': wP, 'groove': w['groove']}, 'cover': {'thumb': cT, 'pinky': cP}, 'spread': sp, 'contact': cd, 'k_felt': {'thumb': kT, 'pinky': kP, 'groove': kG},
            'placement': p50, '_loss': loss, '_terms': terms, '_unpack': unpack}

def landscape(r, nd=61, nz=49):
    """the full loss over the thumb waist's depth x centre, every other number at its final value"""
    v = np.array(r['v']); base, scale = np.array(r['base']), np.array(r['scale']); pF = np.array(r['final'])
    ds = np.linspace(0.05, max(3.2, pF[1] * 1.8), nd); zs = np.linspace(pF[2] - 18, pF[2] + 18, nz); out = []
    tie = r['pockets'] == 'sym'
    for d in ds:
        row = []
        for zc in zs:
            w = v.copy(); w[1] = (d - base[1]) / scale[1]; w[2] = (zc - base[2]) / scale[2]
            row.append(round(r['_loss'](w), 4))
        out.append(row)
    return {'d': ds.round(4).tolist(), 'zc': zs.round(3).tolist(), 'loss': out}
def run_one(key, stored=None):
    """one trial, packed as plain data (a worker: the closures stay in the process). stored: a trial already run (its loss
    history and path, from the file): re-packed at its lowest point instead of descending again (the same result)"""
    grip, pk = key.split('_')
    if stored is None: r = trial(grip, pk, log=False)
    else:
        r = trial(grip, pk, steps=0, log=False); hist = stored['loss']; ib = int(np.argmin(hist)); path = stored['path'][:ib]
        base, scale = np.array(r['base']), np.array(r['scale'])
        v = (np.array(path[-1]['p']) - base) / scale if ib > 0 else np.zeros(len(base))
        r.update(v=v.tolist(), loss=hist[:ib + 1], path=path, final=r['_unpack'](v).tolist(), terms=r['_terms'](v)[0])
    t, i = r['_terms'](np.array(r['v'])); t0, i0 = r['_terms'](np.zeros(len(r['v'])))
    def pack(ii):
        return {'planL': [list(a) for a in ii['L']['arcs']], 'planR': [list(a) for a in ii['R']['arcs']], 'sec': [list(a) for a in ii['S']['arcs']],
                'thumb': ii['ML'], 'pinky': ii['MR'], 'groove': ii['MS'], 'R': {'thumb': ii['L']['R'], 'pinky': ii['R']['R'], 'groove': ii['S']['R']},
                'dev': {'plan': max(dev(ii['CL'], SORA_PLAN), dev(ii['CR'], SORA_PLAN)), 'sec': dev(ii['CS'], SORA_SEC)},
                'width': ii['ML']['u_hump'] + ii['MR']['u_hump']}
    out = {k: r[k] for k in ('grip', 'pockets', 'final', 'start', 'loss', 'targets', 'zones', 'cover', 'spread', 'contact', 'k_felt', 'terms0', 'terms')}
    out['path'] = [{'it': q['it'], 'p': q['p'], 'loss': q['loss']} for q in r['path']]
    out['end'] = pack(i); out['begin'] = pack(i0); out['placement'] = {k: r['placement'][k] for k in ('zK', 'yK', 'gamma_deg', 'palm_gap_mm', 'z')}
    out['landscape'] = landscape(r)
    return key, clean(out)
def clean(o):
    if isinstance(o, dict): return {k: clean(v) for k, v in o.items()}
    if isinstance(o, (list, tuple)): return [clean(v) for v in o]
    if isinstance(o, (np.floating,)): return float(o)
    if isinstance(o, (np.integer,)): return int(o)
    if isinstance(o, np.bool_): return bool(o)
    return o
def run():
    s0, g0 = sora_plan_params(), sora_sec_params()
    CL = A.chain(P0, TH0, plan_side(s0)['arcs'], ds=0.1); CS = A.chain(S0, STH0, sec_half(g0)['arcs'], ds=0.05)
    res = {'about': 'longarcs.py: the long-arc model, the felt strength (the sides over the whole slide, F65.6), the four trials', 'turn_rel_deg': TURN_REL / DEG, 'turn_mean_deg': TURN_MEAN / DEG,
           'mu_dry': MU_DRY, 'width_range': WIDTH_RANGE, 'ulx_pocket': ULX_POCKET, 'sec_bound': SEC_BOUND,
           'slide': {'p50': SLIDE, 'range': SLIDE_RANGE, 'per_hand': SL, 'contact_side': float(T.contact_d(T.S.N_SIDE)),
                     'R_felt': {f: SLIDE[f] / TURN_REL for f in SLIDE}, 'basis': 'hand model: the heel placement (palm on the hump, fingers relaxed) to the lifted (zero-g, tips on the buttons); derived'},
           'sora': {'plan_params': s0.tolist(), 'sec_params': g0.tolist(), 'side': side_measure(CL, 10.0), 'sec': sec_measure(CS, 16.0, 28.5),
                    'R_waist': float(plan_side(s0)['R']), 'R_groove': float(sec_half(g0)['R'])}, 'trials': {}}
    keys = [g + '_' + pk for g in ('heel', 'lifted') for pk in ('sym', 'fwd')]
    only = [k for k in sys.argv[2:] if k in keys]          # run heel_sym lifted_sym: redo those, keep the rest from the file
    old = json.load(open(os.path.join(HERE, 'out', 'longarcs.json')))['trials'] if (only or 'repack' in sys.argv) else {}
    if only: res['trials'] = {k: v for k, v in old.items() if k not in only}
    jobs = [(k, old[k]) for k in keys] if 'repack' in sys.argv else [(k, None) for k in (only or keys)]
    import multiprocessing as mp
    with mp.Pool(min(4, os.cpu_count() or 1)) as pool:
        for key, out in pool.starmap(run_one, jobs):
            res['trials'][key] = out; e = out['end']
            print('%-10s loss %.3f -> %.3f | thumb z %.1f/%.1f R %.0f (felt <= %.0f) c %.1f (>= %.1f) d %.2f below-hump %.2f n=%d | pinky z %.1f/%.1f R %.0f (<= %.0f) c %.1f (>= %.1f) d %.2f n=%d | groove u %.1f R %.0f (<= %.0f) n=%d | ring %.1f deg/mm n=%d | dev %.2f/%.2f width %.1f' % (
                key, out['loss'][0], out['loss'][-1], e['thumb']['z_bottom'], out['targets']['thumb_z'], e['R']['thumb'], 1 / out['k_felt']['thumb'], out['final'][0], out['cover']['thumb'], out['final'][1], e['thumb']['below_hump'], e['thumb']['n_minima'],
                e['pinky']['z_bottom'], out['targets']['pinky_z'], e['R']['pinky'], 1 / out['k_felt']['pinky'], out['final'][5], out['cover']['pinky'], out['final'][6], e['pinky']['n_minima'], e['groove']['u_bottom'], e['R']['groove'], 1 / out['k_felt']['groove'], e['groove']['n_minima'],
                e['groove']['ring']['k_deg_per_mm'], e['groove']['ring']['n_minima'], e['dev']['plan'], e['dev']['sec'], e['width']), flush=True)
    res['trials'] = {k: res['trials'][k] for k in keys}
    json.dump(clean(res), open(os.path.join(HERE, 'out', 'longarcs.json'), 'w'))
    print('sora', res['sora']['side']['n_minima'], res['sora']['sec']['n_minima'], res['sora']['sec']['u_bottom'])

if __name__ == '__main__':
    if 'run' in sys.argv: run(); sys.exit()
    s0, g0 = sora_plan_params(), sora_sec_params()
    L = plan_side(s0); C = A.chain(P0, TH0, L['arcs'], ds=0.1); S = sec_half(g0); CS = A.chain(S0, STH0, S['arcs'], ds=0.05)
    print('sora plan params c %.2f d %.3f zc %.2f a %.2f uh %.2f -> closure %.2e, dev from the Sora %.4f mm' % (*s0, L['closure'], dev(C, SORA_PLAN)))
    print('sora sec params c %.2f d %.3f uc %.2f a %.2f -> closure %.2e, dev %.4f mm' % (*g0, S['closure'], dev(CS, SORA_SEC)))
    print('sora side', {k: v for k, v in side_measure(C, 10).items() if k != 'minima'}); print('sora sec', sec_measure(CS, 16, 28.5))
