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
out['recommended'] = 'lifted_sym'   # (G4) the old notch trials' key, kept in step with la['recommended'] below
# ---- the hand at rest: both grips' finger chains (side view), the Sora's profile; the cascade's angles; orbit data
# (G5) the grips placed fresh from trials.place (G1's trials.json is a stale run), each with the thumb from its base
PLC = {g: T.place(g, 1.0) for g in ('heel', 'lifted')}
out['hand'] = {'cascade': H.CASCADE, 'thumb': H.THUMB, 'orbit_flex': H.ORBIT_FINGER_FLEX, 'bones': {k2: r2(v) for k2, v in H.BONES.items()}, 'chords': H.summary()['chords'],
               'grips': {g: {kk: PLC[g][kk] for kk in ('zK', 'yK', 'gamma_deg', 'palm_gap_mm', 'tip_misfit_mm', 'joints', 'z', 'thumb')} for g in ('heel', 'lifted')},
               'thumbBase': {'cmc_back_mm': H.THUMB_CMC_BACK * H.ANSUR['hand'], 'cmc_palmar_mm': H.THUMB_CMC_PALMAR, 'bones': list(H.THUMB_BONES), 'span': H.thumb_span(), 'contact_y': H.CONTACT_Y,
                             'g1_dip': {g: PLC[g]['joints']['index'][2] for g in PLC}},
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
# ---- the long-arc model (G2, after Brock 13:33): longarcs.py's four trials, their frames, the landscapes, the sweeps
import longarcs as LA
LR = json.load(open(os.path.join(HERE, 'out', 'longarcs.json')))
ra = lambda arcs: [[round(float(L), 4), round(float(ph), 6)] for L, ph in arcs]
def frame(p):
    p = np.asarray(p, float); return {'planL': ra(LA.plan_side(p[0:5])['arcs']), 'planR': ra(LA.plan_side(p[5:10])['arcs']), 'sec': ra(LA.sec_half(p[10:14])['arcs'])}
la = {'turn_rel_deg': LR['turn_rel_deg'], 'turn_mean_deg': LR['turn_mean_deg'], 'mu': LR['mu_dry'], 'width_range': LR['width_range'], 'ulx_pocket': LR['ulx_pocket'], 'sec_bound': LR['sec_bound'],
      'P0': LA.P0, 'TH0': LA.TH0, 'S0': LA.S0, 'STH0': LA.STH0, 'btn': list(LA.BTN), 'nose_z': float(LA.P3[1]),
      'sora': dict(LR['sora'], planArcs=ra(LA.PA), secArcs=ra(LA.SA)), 'trials': {}, 'order': ['heel_sym', 'heel_fwd', 'lifted_sym', 'lifted_fwd'], 'recommended': 'lifted_fwd',
      'slide': {k: LR['slide'][k] for k in ('p50', 'range', 'contact_side', 'R_felt')}, 'path': LR['path']}
for k, r in LR['trials'].items():
    path = r['path']; idx = sorted(set(list(range(0, len(path), max(1, len(path) // 24))) + [len(path) - 1]))   # about 25 frames
    fr = [dict(frame(r['start']), it=0, loss=round(r['loss'][0], 4), p=[round(v, 4) for v in r['start']])]
    for i in idx: fr.append(dict(frame(path[i]['p']), it=path[i]['it'], loss=round(path[i]['loss'], 4), p=[round(v, 4) for v in path[i]['p']]))
    e = r['end']
    la['trials'][k] = {'grip': r['grip'], 'pockets': r['pockets'], 'final': r['final'], 'start': r['start'], 'loss': round(r['loss'][-1], 4), 'loss0': round(r['loss'][0], 4), 'curve': [round(v, 4) for v in r['loss'][::4]],
                       'targets': r['targets'], 'zones': r['zones'], 'cover': r['cover'], 'k_felt': r['k_felt'], 'spread': r['spread'], 'contact': r['contact'],
                       'end': {kk: e[kk] for kk in ('thumb', 'pinky', 'groove', 'R', 'dev', 'width')}, 'endArcs': {'planL': ra(e['planL']), 'planR': ra(e['planR']), 'sec': ra(e['sec'])},
                       'begin': {kk: r['begin'][kk] for kk in ('thumb', 'pinky', 'groove', 'R', 'dev', 'width')},
                       'grooves_under_finger': bool(max(r['placement']['z']['index'], r['placement']['z']['middle']) <= LA.GROOVE_END), 'tips': r['placement']['z'],
                       'symmetric': r['pockets'] == 'sym',
                       'frames': fr, 'path': [[round(q['p'][1], 4), round(q['p'][2], 3)] for q in path], 'landscape': r['landscape'], 'terms': r['terms'], 'terms0': r['terms0']}
# the default (G4, after Brock 17:18): symmetry is a rule, a traditional mouse is mirror-symmetric, so the result is the lowest
# loss among the mirrored trials (trial 3); the lopsided ones (2 and 4) stay on the Trials slide as the test that shows why
la['recommended'] = min((k for k in LR['trials'] if LR['trials'][k]['pockets'] == 'sym'), key=lambda k: LR['trials'][k]['loss'][-1])
la['lowest'] = min(LR['trials'], key=lambda k: LR['trials'][k]['loss'][-1])
print('recommended', la['recommended'], 'lowest overall', la['lowest'])
# sweeps of the thumb's waist round the default's result, for the cursor on gd_arcs: depth, length, angle
pF = np.array(LR['trials'][la['recommended']]['final'])
def sweep(i, vals):
    out_ = []
    for v in vals:
        q = pF[0:5].copy(); q[i] = v; L_ = LA.plan_side(q); out_.append({'v': round(float(v), 4), 'arcs': ra(L_['arcs']), 'ok': L_['closure'] < 1e-3})
    return out_
la['sweep'] = {'depth': sweep(1, np.linspace(0.15, 3.0, 20)), 'length': sweep(0, np.linspace(30, 62, 17)), 'angle': sweep(3, np.linspace(-1.5, 4.5, 13)),
               'sec_depth': [{'v': round(float(v), 4), 'arcs': ra(LA.sec_half(np.r_[pF[10], v, pF[12], pF[13]])['arcs'])} for v in np.linspace(0.02, 0.5, 13)]}
out['la'] = la
# the page draws the long-arc model now: G1's notch trials, frames, maps, handles and dip stay in trials.json, out of the page
for k_ in ('trials', 'descent', 'landscape', 'arcs', 'dip', 'circle_check'): out.pop(k_, None)
out['sora'] = {'profile': out['sora']['profile']}
json.dump(out, open(os.path.join(HERE, 'out', 'gd-deck.json'), 'w'), separators=(',', ':'))
print('gd-deck.json', os.path.getsize(os.path.join(HERE, 'out', 'gd-deck.json')))
