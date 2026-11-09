"""Shared pieces of the study (the Sora surface, the hand placement place(), split_long, heading_at) and the FIRST descent
attempt, superseded by notch.py: free arcs with grooves spliced into the chain shift everything downstream and the
problem is ill-conditioned (kept for the record; notch.py is the run).
Gradient descent on the arc model: the Sora V2 fit, modified (arched side middles, comfort grooves), then descended on
a loss built from the hand at rest. Writes out/gd_run.json (targets, optimum strengths, the loss curve, the path, the
parameters before and after, the deviation from the Sora in mm, the four minima found).
Run after fit_sora.py: python3 deck/tools/gd/descend.py"""
import json, os, sys
import numpy as np
from scipy.optimize import least_squares
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import arcs as A, hand as H, strength as S

FIT = json.load(open(os.path.join(HERE, 'out', 'sora_arcs.json')))['curves']
SEC = json.load(open(os.path.join(HERE, 'out', 'sora_sections.json')))
DEG = 180 / np.pi
BAND = (6 / DEG, 22 / DEG)        # the deck's "defined" shoulder band, 6 to 22 deg/mm (10-g-shape.js shp_tile)
ELL = 2.27                        # mm: the tightest turn a sliding finger follows (b07_newton: 10 g, 0.5 m/s, 1.1 N)
R_MIN = 2.0                       # mm: smallest outer radius allowed (estimate: a moulded, comfortable edge)

# ---------------------------------------------------------------- the Sora's surface, for placing the hand
ST = sorted((float(k), np.array(v)) for k, v in SEC['xsec'].items())
def top_y(x, z):
    """the Sora's height at (x, z) from the stations (outer contour, top side), linear in z"""
    u = abs(x); ys = []
    for zs, C in ST:
        c = C[(C[:, 1] > 8)]; c = c[np.argsort(np.abs(c[:, 0]))]
        side = c[c[:, 0] * (1 if x >= 0 else -1) >= -0.01]
        side = side[np.argsort(np.abs(side[:, 0]))]
        ys.append(np.interp(u, np.abs(side[:, 0]), side[:, 1], right=np.nan))
    zz = [s[0] for s in ST]
    return float(np.interp(z, zz, ys))
PROF = np.array(FIT['profile']['target'])

def place(gamma_deg=0.0):
    """knuckle line (zK, yK) with the metacarpals at gamma (0: the wrist straight, as in orbit, forearm level): index
    and middle tips on their buttons. Also reports where the palm's skin sits over the hump (it floats: a claw)"""
    g = np.radians(gamma_deg); xs = {'index': 16.0, 'middle': -16.0}
    def tip(f, v):
        zK, yK = v; P = H.chain(f, g)
        return np.array([zK - H.KNUCKLE_BACK[f] * np.cos(g), yK - H.KNUCKLE_BACK[f] * np.sin(g)]) + P
    def res(v):
        return [tip(f, v)[-1][1] - top_y(xs[f], tip(f, v)[-1][0]) for f in ('index', 'middle')]
    sol = least_squares(res, [-20.0, 80.0])
    v = sol.x; tips = {f: tip(f, v)[-1].tolist() for f in ('index', 'middle', 'ring', 'little')}
    n = np.array([np.sin(g), -np.cos(g)]); base = np.array(v) + H.PALM_SKIN * n
    behind = (PROF[:, 0] < v[0]) & (PROF[:, 0] > v[0] - 100)
    gap = float(((PROF[behind] - base) @ n).min() * -1) if behind.any() else None
    return {'zK': float(v[0]), 'yK': float(v[1]), 'gamma_deg': gamma_deg, 'residual_mm': [float(r) for r in sol.fun], 'tips_zy': tips,
            'palm_gap_over_hump_mm': gap, 'index_pip_zy': tip('index', v)[2].tolist(),
            'ring_tip_vs_surface_mm': float(tips['ring'][1] - top_y(-25.0, tips['ring'][0]))}

def split_long(arcs, Lmax):
    out = []
    for L, ph in arcs:
        n = max(1, int(np.ceil(L / Lmax))); out += [(L / n, ph / n)] * n
    return out

def heading_at(C, key, val, mask=None):
    """heading and curvature of chain C where coordinate key ('x' or 'y') crosses val (first crossing within mask)"""
    q = C[key]; idx = np.arange(len(q)) if mask is None else np.nonzero(mask)[0]
    d = q[idx] - val; cr = np.nonzero(d[:-1] * d[1:] <= 0)[0]
    if len(cr) == 0: j = idx[np.argmin(np.abs(d))]; f = 0.0
    else:
        a = idx[cr[0]]; b = a + 1; f = (val - q[a]) / (q[b] - q[a] + 1e-12); j = a
    th = C['th'][j] + f * (C['th'][min(j + 1, len(q) - 1)] - C['th'][j]); return float(th), float(C['k'][min(j + 1, len(q) - 1)]), int(j)

# ---------------------------------------------------------------- the parameterised model
def sec_insert_groove(arcs, u_at, Lg=12.0, phi=0.05):
    """split the crown where the arc length reaches u_at - Lg/2 - Lb, and insert blend / groove / blend arcs"""
    Lb = 4.0; s0 = max(1.0, u_at - Lg / 2 - Lb); out = []; acc = 0.0; done = False
    for L, ph in arcs:
        if not done and acc + L > s0:
            a = s0 - acc; k = ph / L
            if a > 0.2: out.append((a, k * a))
            out += [(Lb, -phi / 2), (Lg, phi), (Lb, -phi / 2)]
            rest = L - a - (2 * Lb + Lg)
            if rest > 0.3: out.append((rest, k * rest))
            done = True
        else:
            out.append((L, ph))
        acc += L
    return out

def pack(curves): return np.concatenate([np.r_[np.log([a[0] for a in c]), [a[1] for a in c]] for c in curves])
def unpack(v, sizes):
    out, i = [], 0
    for n in sizes:
        out.append([(float(np.exp(v[i + j])), float(v[i + n + j])) for j in range(n)]); i += 2 * n
    return out

def plan_curve(arcs): return A.chain(FIT['plan']['p0'], FIT['plan']['th0'], arcs, ds=0.25)
def sec_curve(arcs, p0): return A.chain(p0, 0.0, arcs, ds=0.2)

def local_min(x, y, lo, hi):
    """the lowest point of y over x in [lo, hi] that is a true local minimum; returns (x, y, i) or None"""
    m = np.nonzero((x >= lo) & (x <= hi))[0]
    if len(m) < 5: return None
    i = m[np.argmin(y[m])]
    if i in (m[0], m[-1]): return None
    return float(x[i]), float(y[i]), int(i)

def curvature_at(C, i):
    return float(C['k'][i])

def deviation(C, base):
    """distance from each point of C to the base curve (mm)"""
    from scipy.spatial import cKDTree
    d, _ = cKDTree(np.c_[base['x'], base['y']]).query(np.c_[C['x'], C['y']]); return d

def main():
    pl = place()
    tips = pl['tips_zy']
    z_f = 0.5 * (tips['index'][0] + tips['middle'][0])           # the grooves' station: between the two tips
    z_ring = tips['ring'][0]
    z_thumb = pl['index_pip_zy'][0]                               # estimate: the relaxed thumb tip level with the index PIP
    z_pinky = tips['little'][0]
    z_pocket = 0.5 * (z_thumb + z_pinky)                          # symmetric shell: one waist serves both
    opt = S.table()
    kap_g = 0.5 * (opt['index']['kappa_opt_per_mm'] + opt['middle']['kappa_opt_per_mm'])
    kap_p = 0.5 * (opt['thumb']['kappa_opt_per_mm'] + opt['little']['kappa_opt_per_mm'])
    u_g = 16.0                                                    # the fingertips' line on each button (placement)
    u_ring = 25.0                                                 # estimate: the ring tip on the right shoulder
    # the Sora's section at the grooves' station, interpolated between fitted stations by refitting the stations' mix
    zs = sorted(float(k) for k in FIT['xsec'])
    zb = min(zs, key=lambda q: abs(q - z_f))
    base_sec = FIT['xsec'][('%g' % zb) if ('%g' % zb) in FIT['xsec'] else str(int(zb))]
    p0 = base_sec['p0']; sec0 = [tuple(a) for a in base_sec['arcs']]
    plan0 = [tuple(a) for a in FIT['plan']['arcs']]
    SORA_P, SORA_S = plan_curve(plan0), sec_curve(sec0, p0)
    # ---- the modified base: more handles (long arcs split), grooves inserted at the fingertips' line, the side middle
    # arched in a little more (Brock: "more of an arched middle on the sides")
    sec1 = split_long(sec_insert_groove(sec0, u_g, Lg=8.0, phi=0.10), 6.0)
    plan1 = split_long(plan0, 11.0)
    zc = 0.0
    P1 = plan_curve(plan1); acc = np.cumsum([L for L, _ in plan1]); sP = P1['s']
    for i, (L, ph) in enumerate(plan1):
        s_mid = acc[i] - L / 2; j = int(np.argmin(np.abs(sP - s_mid))); zm = P1['y'][j]
        if -12 < zm - z_pocket < 12 and P1['x'][j] > 20: plan1[i] = (L, ph + 0.02)
        elif 12 <= abs(zm - z_pocket) < 30 and P1['x'][j] > 20: plan1[i] = (L, ph - 0.01)
    sizes = [len(plan1), len(sec1)]
    zT = FIT['plan']['target'][-1][1]
    end_s = (SORA_S['x'][-1], SORA_S['y'][-1])
    W = {'loc': 1.0, 'str': 1.0, 'ring': 2.0, 'trad': 1.5, 'smooth': 0.05, 'rad': 2.0, 'close': 20.0}

    def terms(v):
        plan, sec = unpack(v, sizes)
        P, Sc = plan_curve(plan), sec_curve(sec, p0)
        t = {}
        # thumb / pinky pocket: in the top outline the side runs at heading -pi/2 at a waist; its turn there, kappa*
        side = (P['x'] > 18) & (P['y'] > -40) & (P['y'] < 45)
        th, kp, jp = heading_at(P, 'y', z_pocket, side)
        t['p_loc'] = ((th + np.pi / 2) / 0.01) ** 2          # level (no slope) at the target: the bottom is there
        t['p_str'] = ((kp - kap_p) / kap_p) ** 2
        # index / middle grooves: across the button, level at the fingertips' line, concave by kappa*
        top = Sc['y'] > 12
        th, kg, jg = heading_at(Sc, 'x', u_g, top)
        t['g_loc'] = (th / 0.01) ** 2
        t['g_str'] = ((kg - kap_g) / kap_g) ** 2
        # ring finger: on the shoulder, no pocket; its curvature in the defined band, under the follow limit
        th_r, kr, jr = heading_at(Sc, 'x', u_ring, top)
        kr = -kr
        t['ring'] = (max(0.0, BAND[0] - kr) / BAND[0]) ** 2 + (max(0.0, kr - 1 / ELL) * ELL) ** 2
        # a traditional mouse: close to the Sora, smooth, moulded radii, closed outline
        dP, dS = deviation(P, SORA_P), deviation(Sc, SORA_S)
        t['trad'] = float(np.mean(dP ** 2) + np.mean(dS ** 2))
        kpl = np.array([ph / L for L, ph in plan]); ksc = np.array([ph / L for L, ph in sec])
        t['smooth'] = float(np.sum(np.diff(kpl) ** 2) + np.sum(np.diff(ksc) ** 2)) * 100
        t['rad'] = float(np.sum(np.maximum(0, np.abs(np.r_[kpl, ksc]) - 1 / R_MIN) ** 2)) * 100
        t['close'] = float(P['x'][-1] ** 2 + (P['y'][-1] - zT) ** 2 + (10 * np.sin(P['th'][-1] + np.pi)) ** 2 + (Sc['x'][-1] - end_s[0]) ** 2 + (Sc['y'][-1] - end_s[1]) ** 2)
        mp = local_min(-P['y'][side], P['x'][side], -45, 40); mg = local_min(Sc['x'][top], Sc['y'][top], 2, 26)
        info = {'z_pocket_min': (None if mp is None else -mp[0]), 'k_pocket': float(kp), 'u_groove_min': (None if mg is None else mg[0]), 'k_groove': float(kg), 'k_ring': float(kr),
                'dev_plan_max': float(dP.max()), 'dev_sec_max': float(dS.max()), 'dev_plan_rms': float(np.sqrt(np.mean(dP ** 2))), 'dev_sec_rms': float(np.sqrt(np.mean(dS ** 2)))}
        return t, info
    def loss(v):
        t, _ = terms(v)
        return (W['loc'] * (t['p_loc'] + t['g_loc']) + W['str'] * (t['p_str'] + t['g_str'])
                + W['ring'] * t['ring'] + W['trad'] * t['trad'] + W['smooth'] * t['smooth'] + W['rad'] * t['rad'] + W['close'] * t['close'])
    # ---- Adam on central finite differences
    v = pack([plan1, sec1]); m = np.zeros_like(v); s2 = np.zeros_like(v)
    lr, b1, b2, eps, h = 0.006, 0.9, 0.999, 1e-8, 1e-4
    hist, path = [], []
    v_start = v.copy()
    for it in range(1, 301):
        f0 = loss(v); g = np.zeros_like(v)
        for k in range(len(v)):
            e = np.zeros_like(v); e[k] = h; g[k] = (loss(v + e) - loss(v - e)) / (2 * h)
        m = b1 * m + (1 - b1) * g; s2 = b2 * s2 + (1 - b2) * g * g
        v = v - lr * (m / (1 - b1 ** it)) / (np.sqrt(s2 / (1 - b2 ** it)) + eps)
        t, info = terms(v)
        hist.append({'it': it, 'loss': float(f0), **{k: float(x) for k, x in t.items()}, **info})
        if it % 10 == 0 or it == 1: path.append({'it': it, 'v': v.round(5).tolist()})
        if it % 25 == 0: print('it %3d  loss %.4f  pocket min z %s k %.4f  groove min u %s k %.4f  ring %.1f deg/mm  dev plan %.2f sec %.2f mm' % (
            it, f0, info['z_pocket_min'], info['k_pocket'], info['u_groove_min'], info['k_groove'], info['k_ring'] * DEG, info['dev_plan_max'], info['dev_sec_max']), flush=True)
    t0, info0 = terms(v_start); t1, info1 = terms(v)
    plan_f, sec_f = unpack(v, sizes)
    out = {
        'placement': pl, 'targets': {'z_grooves': z_f, 'u_grooves': u_g, 'z_ring': z_ring, 'u_ring': u_ring, 'z_thumb': z_thumb, 'z_pinky': z_pinky, 'z_pocket': z_pocket},
        'optimum': {'kappa_groove': kap_g, 'R_groove': 1 / kap_g, 'kappa_pocket': kap_p, 'R_pocket': 1 / kap_p, 'table': opt},
        'section_station_z': zb, 'section_p0': p0,
        'sora': {'plan': plan0, 'sec': sec0}, 'modified': {'plan': plan1, 'sec': sec1, 'info': info0, 'terms': t0},
        'final': {'plan': plan_f, 'sec': sec_f, 'info': info1, 'terms': t1},
        'loss': hist, 'path': path, 'sizes': sizes, 'weights': W,
    }
    json.dump(out, open(os.path.join(HERE, 'out', 'gd_run.json'), 'w'))
    print('targets', json.dumps(out['targets']))
    print('placement', json.dumps({k: pl[k] for k in ('zK', 'yK', 'gamma_deg', 'residual_mm')}))
    print('start', json.dumps(info0)); print('final', json.dumps(info1))

if __name__ == '__main__':
    main()
