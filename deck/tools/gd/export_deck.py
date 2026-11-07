"""Everything the gd slides draw, precomputed: -> deck/tools/gd/out/gd-deck.json (embedded only in dist/gd.html as GD)."""
import json, os, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import arcs as A, hand as H, strength as S, trials as T
from descend import FIT, PROF
R = json.load(open(os.path.join(HERE, 'out', 'trials.json')))
r2 = lambda a, d=2: np.round(np.asarray(a, float), d).tolist()
def thin(P, step):
    P = np.asarray(P, float); d = np.r_[0, np.cumsum(np.hypot(*np.diff(P, axis=0).T))]; u = np.arange(0, d[-1], step)
    return np.c_[np.interp(u, d, P[:, 0]), np.interp(u, d, P[:, 1])]
out = {}
# ---- the Sora: plan (right half, u = -x, nose -> tail), profile, section at z 30, and the fit's arcs (for the handles)
pl = A.chain(FIT['plan']['p0'], FIT['plan']['th0'], [tuple(a) for a in FIT['plan']['arcs']], ds=0.2)
out['sora'] = {'plan': r2(thin(np.c_[pl['x'], pl['y']], 1.0)), 'profile': r2(thin(np.array(FIT['profile']['target']), 1.0)),
               'sec': r2(thin(np.c_[T.SEC['x'], T.SEC['y']], 0.4)), 'scan_plan': r2(np.array(FIT['plan']['target'])[::2]), 'scan_sec': r2(np.array(FIT['xsec']['30']['target'])[::2])}
def arc_handles(c):
    C = A.chain(c['p0'], c['th0'], [tuple(a) for a in c['arcs']], ds=0.2); hs = []
    for i, (L, ph) in enumerate(c['arcs']):
        m = C['i'] == i
        if m.sum() < 2: continue
        xs, ys = C['x'][m], C['y'][m]; j = len(xs) // 2
        hs.append({'L': round(L, 2), 'turn_deg': round(np.degrees(ph), 2), 'depth': round(A.depth(L, ph), 3), 'R': round(L / abs(ph), 1) if abs(ph) > 1e-6 else None,
                   'a': r2([xs[0], ys[0]]), 'b': r2([xs[-1], ys[-1]]), 'm': r2([xs[j], ys[j]]), 'pts': r2(np.c_[xs, ys][::max(1, len(xs) // 24)])})
    return hs
out['arcs'] = {'plan': arc_handles(FIT['plan']), 'sec': arc_handles(FIT['xsec']['30']), 'profile': arc_handles(FIT['profile']),
               'err': {'plan': FIT['plan']['err'], 'profile': FIT['profile']['err'], 'sec_rms_range': [min(v['err']['rms'] for v in FIT['xsec'].values()), max(v['err']['rms'] for v in FIT['xsec'].values())]}}
# ---- the trials: final curves, the modified base, the numbers; the minima
def side_pts(P): return r2(thin(np.asarray(P), 1.2))
out['trials'] = {}
for k, r in R['trials'].items():
    f, d = r['final'], r['derived']
    out['trials'][k] = {'loss': round(r['loss'][-1], 3), 'loss0': round(r['loss'][0], 3), 'curve': r2(np.array(r['loss'])[::4], 3),
        'planL': side_pts(r['curves']['planL']), 'planR': side_pts(r['curves']['planR']), 'sec': r2(thin(np.asarray(r['curves']['sec']), 0.4)),
        'planL0': side_pts(r['curves']['planL_base']), 'planR0': side_pts(r['curves']['planR_base']), 'sec0': r2(thin(np.asarray(r['curves']['sec_base']), 0.4)),
        'thumb': {k2: f['thumb'][k2] for k2 in ('z_bottom', 'u_bottom', 'R_bottom', 'below_hump_mm', 'flare_mm', 'n_minima', 'z_hump', 'z_flare')},
        'pinky': {k2: f['pinky'][k2] for k2 in ('z_bottom', 'u_bottom', 'R_bottom', 'below_hump_mm', 'flare_mm', 'n_minima', 'z_hump', 'z_flare')},
        'groove': {k2: f['grooves'][k2] for k2 in ('u_bottom', 'y_bottom', 'R_bottom', 'lip_mm', 'n_minima', 'u_lip')},
        'ring': {k2: f['grooves']['ring'][k2] for k2 in ('u', 'slope_deg', 'k_deg_per_mm', 'R_mm', 'k_max_outboard_deg_per_mm', 'n_minima', 'verdict')},
        'grooves_under_finger': bool(max(r['placement']['p50']['z']['index'], r['placement']['p50']['z']['middle']) <= 48.0),
        'dev_sora': round(f['dev_sora_mm'], 2), 'dev_base': round(max(r['dev_from_base_mm'].values()), 2),
        'targets': d['targets'], 'R_opt': d['R_opt'], 'cores': {'thumb': d['core_len_thumb'], 'pinky': d['core_len_pinky'], 'groove': d['core_len_groove']},
        'contact': {'side': d['contact_side_mm'], 'btn': d['contact_btn_mm']}, 'spread': r['spread'],
        'placement': {kk: r['placement']['p50'][kk] for kk in ('zK', 'yK', 'gamma_deg', 'palm_gap_mm', 'tip_misfit_mm', 'joints', 'z')}}
# ---- every trial's descent: curves along the path (morph frames), the parameters, the loss; and its loss landscape
out['descent'] = {}; out['landscape'] = {}
for rec, r in R['trials'].items():
    nm = r['names']; fr = []
    for q in r['path'][::2] + [r['path'][-1]]:
        p = np.array(q['p']); PL, _ = T.plan_side(p[0:4], r['derived']['a_thumb']); PR, _ = T.plan_side(p[4:8], r['derived']['a_pinky']); Sx, _ = T.section(p[8:11], r['derived']['a_groove'])
        dd = r['derived']; ML = T.side_measures(PL, dd['targets']['thumb_z'], dd['a_thumb']); MR = T.side_measures(PR, dd['targets']['pinky_z'], dd['a_pinky']); MS = T.sec_measures(Sx, 16.0, dd['a_groove'], 28.5)
        fr.append({'it': q['it'], 'loss': round(q['loss'], 3), 'p': r2(p, 4), 'R': {'thumb': ML['R_bottom'], 'pinky': MR['R_bottom'], 'groove': MS['R_bottom']}, 'flare': ML['flare_mm'],
                   'planL': side_pts(np.c_[PL['x'], PL['y']]), 'planR': side_pts(np.c_[PR['x'], PR['y']]), 'sec': r2(thin(np.c_[Sx['x'], Sx['y']], 0.4))})
    out['descent'][rec] = {'names': nm, 'frames': fr}
    p_end = np.array(r['final_params']); zs = np.linspace(p_end[0] - 16, p_end[0] + 16, 49); ks = np.linspace(0.004, 0.09, 40)
    aL = r['derived']['a_thumb']; zT = r['derived']['targets']['thumb_z']; kT = r['derived']['k_opt']['thumb']
    grid = []
    for kv in ks:
        row = []
        for zv in zs:
            P_, _ = T.plan_side((zv, kv, p_end[2], p_end[3]), aL); M = T.side_measures(P_, zT, aL)
            row.append(round(((M['z_bottom'] - zT) / 2.0) ** 2 + ((M['k_bottom'] - kT) / kT) ** 2 + 2 * (M['n_minima'] - 1) ** 2, 3))
        grid.append(row)
    out['landscape'][rec] = {'z': r2(zs), 'k': r2(ks, 4), 'loss': grid, 'path': [[q['p'][0], q['p'][1]] for q in r['path']], 'z_target': zT, 'k_opt': kT}
out['order'] = ['heel_sym', 'heel_fwd', 'lifted_sym', 'lifted_fwd']
out['recommended'] = 'lifted_fwd'
# ---- the hand at rest: both grips' finger chains (side view), the Sora's profile; the cascade's angles; orbit data
out['hand'] = {'cascade': H.CASCADE, 'thumb': H.THUMB, 'orbit_flex': H.ORBIT_FINGER_FLEX, 'bones': {k2: r2(v) for k2, v in H.BONES.items()}, 'chords': H.summary()['chords'],
               'grips': {g: {kk: R['trials'][g + '_sym']['placement']['p50'][kk] for kk in ('zK', 'yK', 'gamma_deg', 'palm_gap_mm', 'tip_misfit_mm', 'joints', 'z')} for g in ('heel', 'lifted')},
               'palm_skin': H.PALM_SKIN, 'ansur': H.ANSUR}
# ---- the strength: J(rho), the drift and strain curves; the numbers
rho = np.linspace(0, 4, 81)
out['strength'] = {'rho': r2(rho), 'drift': r2(1 / (1 + rho), 4), 'strain': r2(rho / (1 + rho), 4), 'J': r2((1 + rho ** 2) / (1 + rho) ** 2, 4),
                   'k_mcp': S.K_MCP, 'k_range': S.K_RANGE, 'N_btn': S.N_BTN, 'N_side': S.N_SIDE, 'N_side_sim': S.N_SIDE_SIM, 'click_N': S.CLICK_N, 'table': S.table()}
# ---- the dip's anatomy: a worked example (the thumb's, recommended trial) as curvature and shape
r = R['trials']['lifted_fwd']; p = np.array(r['final_params']); tt, hh, ss, cc = T.dip_profile(r['derived']['a_thumb'], p[2], p[1])
out['dip'] = {'t': r2(tt[::8]), 'h': r2(hh[::8], 4), 'slope': r2(ss[::8], 4), 'curv': r2(cc[::8], 5), 'a': r['derived']['a_thumb'], 'b': float(p[2]), 'kc': float(p[1])}
out['ulx'] = {'widths': T.ULX, 'pocket': T.ULX_POCKET, 'flare': T.ULX_FLARE}
out['circle_check'] = {'L': 30.0, 'R': 47.0, 'depth': 47.0 - float(np.sqrt(47.0 ** 2 - 15.0 ** 2))}
json.dump(out, open(os.path.join(HERE, 'out', 'gd-deck.json'), 'w'), separators=(',', ':'))
print('gd-deck.json', os.path.getsize(os.path.join(HERE, 'out', 'gd-deck.json')))
