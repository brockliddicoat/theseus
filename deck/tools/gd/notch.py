"""Gradient descent on arc notches over the Sora V2 base (the shape model of the study).

Each minimum is a notch made of three arcs, laid along the base curve's normal so nothing downstream moves:
a convex blend arc (radius R/2), a concave arc (radius R) and a convex blend arc. A notch has a centre c, a length L
(its full width) and a depth d (mm); its turn (angle) follows: theta_e = 2 atan(2d / L), R = (2/3) (L/2) / sin(theta_e).
  - the plan: the thumb (left) and pinky (right) pocket, one notch mirrored on a symmetric shell: c = z (mm)
  - the button section: the index (left) and middle (right) groove, one notch mirrored: c = u = |x| (mm)
The ring finger rests on the right shoulder of the same section: no notch, its curvature checked.
Loss (all terms dimensionless):
  level  : the surface is level at each target (the bottom is under the finger)        (slope / 0.02)^2
  strength: the pad-averaged curvature at each target equals kappa* (strength.py)      ((k - k*) / k*)^2
  ring   : the shoulder under the ring finger stays convex, in the deck's defined band (6 to 22 deg/mm), no pocket
  trad   : a traditional mouse: depth and the change to the Sora, in mm                 (d / 1 mm)^2, small weight
  radii  : every arc at least R_MIN
Run after fit_sora.py: python3 deck/tools/gd/notch.py -> out/gd_run.json"""
import json, os, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import arcs as A, strength as S
from descend import place, FIT, DEG, BAND, ELL

R_MIN = 2.0
PAD_HALF = 4.0      # mm: half the fingertip's contact across a groove (estimate, about 8 mm wide)
PAD_HALF_SIDE = 7.0 # mm: half the thumb's or pinky's contact along the side wall (estimate, about 14 mm long)

def notch_profile(L, d, n=241):
    """local (t, delta) of the notch: t across [-L/2, L/2], delta >= 0 inward; the three arcs exactly"""
    W = L / 2.0; th = 2 * np.arctan2(d, W); rho = W / max(np.sin(th), 1e-9); R = 2 * rho / 3; rb = rho / 3
    t = np.linspace(-W, W, n); dl = np.zeros_like(t)
    # blend arcs centred above the base at (+-W, rb) ... concave arc centred at (0, d - R) below? work in delta = inward depth
    # inward depth: the concave arc's lowest point at depth d; its centre at delta = d - R (on the outward side)
    tj = W - rb * np.sin(th)                    # where blend meets the concave arc
    for i, x in enumerate(t):
        ax = abs(x)
        if ax >= tj: dl[i] = rb - np.sqrt(max(rb * rb - (W - ax) ** 2, 0.0))
        else: dl[i] = d - (R - np.sqrt(max(R * R - x * x, 0.0)))
    return t, dl, {'R': R, 'rb': rb, 'theta_e': th, 'turn_deg': float(2 * th * DEG)}

def displaced(base, c, L, d, sign=1.0, key='s'):
    """the base curve (dict of x, y, s, th) with a notch centred at arc length c, pushed inward along its normal"""
    x, y, s, th = base['x'].copy(), base['y'].copy(), base['s'], base['th']
    t, dl, info = notch_profile(L, d)
    m = (s > c - L / 2) & (s < c + L / 2)
    dd = np.interp(s[m] - c, t, dl)
    nx, ny = -np.sin(th[m]), np.cos(th[m])     # left normal of the travel direction
    x[m] += sign * nx * dd; y[m] += sign * ny * dd
    return {'x': x, 'y': y, 's': s}, info

def fit_parabola(u, v, at, half):
    m = np.abs(u - at) <= half
    if m.sum() < 5: return 0.0, 0.0
    a, b, _ = np.polyfit(u[m] - at, v[m], 2); return 2 * a, b   # curvature (small slope), slope at the target

def main():
    pl = place(); tips = pl['tips_zy']
    z_f = 0.5 * (tips['index'][0] + tips['middle'][0]); z_thumb = pl['index_pip_zy'][0]; z_pinky = tips['little'][0]
    z_pocket = 0.5 * (z_thumb + z_pinky); u_g = 16.0; u_ring = 16.0 + 12.5   # estimate: one fingertip width (16 mm) outboard of the middle, less 3.5 mm of squash
    opt = S.table()
    kap_g = 0.5 * (opt['index']['kappa_opt_per_mm'] + opt['middle']['kappa_opt_per_mm'])
    kap_p = 0.5 * (opt['thumb']['kappa_opt_per_mm'] + opt['little']['kappa_opt_per_mm'])
    # the base curves: the Sora's plan (right half, nose -> tail) and its section at the fingertips' station
    PB = A.chain(FIT['plan']['p0'], FIT['plan']['th0'], [tuple(a) for a in FIT['plan']['arcs']], ds=0.1)
    zb = min((float(k) for k in FIT['xsec']), key=lambda q: abs(q - z_f)); key = [k for k in FIT['xsec'] if float(k) == zb][0]
    sx = FIT['xsec'][key]; SB = A.chain(sx['p0'], 0.0, [tuple(a) for a in sx['arcs']], ds=0.05)
    # arc-length positions of the targets on each base curve
    side = (PB['x'] > 18)
    s_pocket0 = float(np.interp(-z_pocket, -PB['y'][side], PB['s'][side]))
    top = SB['y'] > 12
    s_groove0 = float(np.interp(u_g, SB['x'][top], SB['s'][top]))
    def build(v):
        cp, Lp, dp, cg, Lg, dg = v
        P, ip = displaced(PB, cp, Lp, max(dp, 1e-4), sign=1.0)    # plan: the chain heads -z on the side; left normal = +u... inward is -u
        Sx, ig = displaced(SB, cg, Lg, max(dg, 1e-4), sign=-1.0)  # section heads +u then down; left normal points up/out; inward = down
        return P, Sx, ip, ig
    def terms(v):
        P, Sx, ip, ig = build(v)
        t = {}
        # the plan as u(z) on the side: level and kappa* at z_pocket (u = half width; a waist is a minimum of u)
        m = (P['x'] > 18) & (P['y'] > -45) & (P['y'] < 45)
        kp, sp = fit_parabola(P['y'][m], P['x'][m], z_pocket, PAD_HALF_SIDE)
        t['p_level'] = (sp / 0.02) ** 2; t['p_str'] = ((kp - kap_p) / kap_p) ** 2
        mt = Sx['y'] > 12
        uu, yy = Sx['x'][mt], Sx['y'][mt]
        kg, sg = fit_parabola(uu, yy, u_g, PAD_HALF)
        t['g_level'] = (sg / 0.02) ** 2; t['g_str'] = ((kg - kap_g) / kap_g) ** 2
        kr, sr = fit_parabola(uu, yy, u_ring, PAD_HALF * 0.75); kr = -kr
        t['ring'] = (max(0.0, BAND[0] - kr) / BAND[0]) ** 2 + (max(0.0, kr - 1 / ELL) * ELL) ** 2
        t['trad'] = (v[2] / 1.0) ** 2 + (v[5] / 1.0) ** 2
        t['radii'] = sum(max(0.0, R_MIN - r) ** 2 for r in (ip['rb'], ig['rb'], ip['R'], ig['R']))
        t['span'] = max(0.0, abs(v[3] - s_groove0) + v[4] / 2 - (u_ring - u_g - 1.0)) ** 2   # the groove stays off the ring's shoulder
        info = {'k_pocket': kp, 'slope_pocket': sp, 'k_groove': kg, 'slope_groove': sg, 'k_ring_deg_per_mm': kr * DEG,
                'R_pocket_notch': ip['R'], 'R_groove_notch': ig['R'], 'turn_pocket_deg': ip['turn_deg'], 'turn_groove_deg': ig['turn_deg']}
        return t, info
    Wt = {'p_level': 1.0, 'p_str': 1.0, 'g_level': 1.0, 'g_str': 1.0, 'ring': 1.0, 'trad': 0.05, 'radii': 10.0, 'span': 1.0}
    def loss(v):
        t, _ = terms(v); return sum(Wt[k] * t[k] for k in Wt)
    # start: the modified base (Brock: an arched side middle, better grooves), by hand: modest notches at the targets
    v = np.array([s_pocket0, 28.0, 0.6, s_groove0, 12.0, 0.5])
    v_start = v.copy(); lo = np.array([s_pocket0 - 30, 16, 0.02, s_groove0 - 8, 6, 0.02]); hi = np.array([s_pocket0 + 30, 70, 3.0, s_groove0 + 8, 18, 2.5])
    m1 = np.zeros_like(v); m2 = np.zeros_like(v); lr = np.array([0.4, 0.6, 0.02, 0.2, 0.3, 0.02]); hist = []; path = []
    for it in range(1, 401):
        f0 = loss(v); g = np.zeros_like(v)
        for k in range(len(v)):
            e = np.zeros_like(v); hk = 1e-3 * max(1.0, abs(v[k]) * 0.01); e[k] = hk; g[k] = (loss(v + e) - loss(v - e)) / (2 * hk)
        m1 = 0.9 * m1 + 0.1 * g; m2 = 0.999 * m2 + 0.001 * g * g
        v = np.clip(v - lr * (m1 / (1 - 0.9 ** it)) / (np.sqrt(m2 / (1 - 0.999 ** it)) + 1e-8), lo, hi)
        t, info = terms(v); hist.append({'it': it, 'loss': float(f0), **{k: float(x) for k, x in t.items()}, **{k: float(x) for k, x in info.items()}, 'v': v.round(4).tolist()})
        if it % 10 == 0 or it == 1: path.append({'it': it, 'v': v.round(4).tolist(), 'loss': float(f0)})
        if it % 50 == 0: print('it %3d loss %.4f  pocket c %.1f L %.1f d %.2f (R %.0f, k %.4f / %.4f)  groove c %.1f L %.1f d %.2f (k %.4f / %.4f)  ring %.1f deg/mm' % (
            it, f0, v[0], v[1], v[2], info['R_pocket_notch'], info['k_pocket'], kap_p, v[3], v[4], v[5], info['k_groove'], kap_g, info['k_ring_deg_per_mm']), flush=True)
    # report: the four minima on the final shape (and whether they exist on the Sora and the start)
    def local_min_near(x, y, at, win):
        """the local minimum of y(x) nearest 'at' within +-win, with its rise on each side within 2 win"""
        o = np.argsort(x); x, y = x[o], y[o]; m = np.abs(x - at) <= win
        if m.sum() < 5: return None
        xs, ys = x[m], y[m]; dy = np.diff(ys)
        cand = [i + 1 for i in range(len(dy) - 1) if dy[i] < 0 <= dy[i + 1]]
        if not cand: return None
        i = min(cand, key=lambda q: ys[q]); xc, yc = xs[i], ys[i]   # the deepest local minimum in the window
        lo_side = y[(x < xc) & (x > xc - 2 * win)]; hi_side = y[(x > xc) & (x < xc + 2 * win)]
        return {'at': float(xc), 'value': float(yc), 'rise_low_side_mm': float(lo_side.max() - yc) if len(lo_side) else 0.0, 'rise_high_side_mm': float(hi_side.max() - yc) if len(hi_side) else 0.0}
    def minima(v):
        P, Sx, ip, ig = build(v); out = {}
        m = (P['x'] > 18) & (P['y'] > -45) & (P['y'] < 45)
        r = local_min_near(P['y'][m], P['x'][m], z_pocket, 12.0)
        if r:
            kp, _ = fit_parabola(P['y'][m], P['x'][m], r['at'], PAD_HALF_SIDE)
            r = {'z': r['at'], 'half_width': r['value'], 'rise_behind_mm': r['rise_low_side_mm'], 'rise_ahead_mm': r['rise_high_side_mm'], 'R_mm': float(1 / kp) if kp > 0 else None}
        out['thumb_pocket'] = r; out['pinky_pocket'] = r and {**r, 'mirror': 'the right side, x < 0'}
        mt = Sx['y'] > 12; ux, yx = Sx['x'][mt], Sx['y'][mt]
        g = local_min_near(ux, yx, u_g, 6.0)
        if g:
            kg, _ = fit_parabola(ux, yx, g['at'], PAD_HALF)
            g = {'x_left': g['at'], 'x_right': -g['at'], 'y': g['value'], 'rise_inboard_mm': g['rise_low_side_mm'], 'rise_outboard_mm': g['rise_high_side_mm'], 'R_mm': float(1 / kg) if kg > 0 else None}
        out['index_groove'] = g; out['middle_groove'] = g
        return out, P, Sx
    mS, PS, SS = minima(np.array([s_pocket0, 20, 1e-4, s_groove0, 10, 1e-4]))
    m0, P0, S0 = minima(v_start); m1_, P1, S1 = minima(v)
    tS, iS = terms(np.array([s_pocket0, 20, 1e-4, s_groove0, 10, 1e-4])); t0, i0 = terms(v_start); t1, i1 = terms(v)
    def dev(A_, B_):
        from scipy.spatial import cKDTree
        d, _ = cKDTree(np.c_[B_['x'], B_['y']]).query(np.c_[A_['x'], A_['y']]); return float(d.max())
    out = {
        'model': 'notch.py: the Sora V2 arc fit + one arc notch per pocket (mirrored: symmetric shell)',
        'placement': pl, 'targets': {'z_grooves': z_f, 'u_grooves': u_g, 'z_ring': tips['ring'][0], 'u_ring': u_ring, 'z_thumb': z_thumb, 'z_pinky': z_pinky, 'z_pocket': z_pocket, 'section_station_z': zb},
        'optimum': {'kappa_groove': kap_g, 'R_groove': 1 / kap_g, 'kappa_pocket': kap_p, 'R_pocket': 1 / kap_p, 'table': opt},
        'params': ['pocket centre s (mm along the plan from the nose)', 'pocket length L (mm)', 'pocket depth d (mm)', 'groove centre s (mm along the section from the top)', 'groove length L (mm)', 'groove depth d (mm)'],
        'sora': {'terms': tS, 'info': iS, 'minima': mS}, 'start': {'v': v_start.tolist(), 'terms': t0, 'info': i0, 'minima': m0},
        'final': {'v': v.tolist(), 'terms': t1, 'info': i1, 'minima': m1_, 'dev_from_sora_mm': {'plan': dev(P1, PS), 'section': dev(S1, SS)}},
        'loss': hist, 'path': path, 'weights': Wt,
        'curves': {'plan_sora': np.c_[PS['x'], PS['y']][::10].round(3).tolist(), 'plan_final': np.c_[P1['x'], P1['y']][::10].round(3).tolist(),
                   'sec_sora': np.c_[SS['x'], SS['y']][::20].round(3).tolist(), 'sec_final': np.c_[S1['x'], S1['y']][::20].round(3).tolist(),
                   'plan_start': np.c_[P0['x'], P0['y']][::10].round(3).tolist(), 'sec_start': np.c_[S0['x'], S0['y']][::20].round(3).tolist()},
    }
    json.dump(out, open(os.path.join(HERE, 'out', 'gd_run.json'), 'w'))
    print('targets', json.dumps(out['targets'])); print('optimum R groove %.1f pocket %.1f' % (1 / kap_g, 1 / kap_p))
    print('sora  ', json.dumps(iS)); print('final ', json.dumps(i1)); print('minima', json.dumps(m1_)); print('dev', out['final']['dev_from_sora_mm'])
    print('sora minima', json.dumps(mS))

if __name__ == '__main__':
    main()
