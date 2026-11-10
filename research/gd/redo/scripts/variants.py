"""Q7 (sensitivity) and Q8 (the rerun): named runs of the variant model, one after another, each appended to
research/gd/redo/out/variants.json as soon as it finishes (so a cut-off loses only the run in progress).

Every run is trial 3 (palm lifted, mirrored) unless its key says otherwise. 'stock' options = deck/tools/gd/longarcs.py.
Run: nice -n 10 python3 research/gd/redo/scripts/variants.py [names...]      (no names: every run not yet in the file)
"""
import json, os, sys, time
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, '..'))
sys.path.insert(0, os.path.join(ROOT, 'model'))
import longarcs_v as LV, arcs as A
OUT = os.path.join(ROOT, 'out', 'variants.json')
FIX = {'groove_zone': 'pad', 'groove_kmin': 5.4e-3, 'rmin': 4.88, 'rest_tie': 0.02}      # the corrections of rules as they stand
SL = LV.SL
RUNS = [
    # ---- Q8: the corrected rules (A), and three alternatives on top of them
    ('A_fixes', 'lifted_sym', dict(FIX), 500),
    ('C_sora_groove', 'lifted_sym', dict(FIX, start_groove='sora', gentle_groove=False), 500),
    ('B_turn_5p1', 'lifted_sym', dict(FIX, turn=4 * 0.015 / 0.6745), 500),
    ('D_cover_path', 'lifted_sym', dict(FIX, cover_path=True), 500),
    # ---- Q7: what moves the stock result (stock rules; 300 steps: the stock run is within 3 % of its end by step 300)
    ('s_stock_300', 'lifted_sym', {}, 300),
    ('s_start_plus8', 'lifted_sym', {'start_dz': 8.0}, 300),
    ('s_start_plus16', 'lifted_sym', {'start_dz': 16.0}, 300),
    ('s_start_minus8', 'lifted_sym', {'start_dz': -8.0}, 300),
    ('s_gentle_0', 'lifted_sym', {'W': {'gentle': 0.0}}, 300),
    ('s_base_stay_0', 'lifted_sym', {'W': {'base': 0.0, 'stay': 0.0}}, 300),
    ('s_turn_mean_2p06', 'lifted_sym', {'turn': 4 * 0.009}, 300),
    ('s_turn_pont_5p3', 'lifted_sym', {'turn': np.radians(5.3)}, 300),
    ('s_slide_p5', 'lifted_sym', {'slide': dict(SL['p5']['slide'])}, 300),
    ('s_slide_p95', 'lifted_sym', {'slide': dict(SL['p95']['slide'])}, 300),
    ('s_stock_1500', 'lifted_sym', {}, 1500),
    # ---- Q8: the other three trials under the corrected rules
    ('A_fixes_heel_sym', 'heel_sym', dict(FIX), 500),
    ('A_fixes_lifted_fwd', 'lifted_fwd', dict(FIX), 500),
    ('A_fixes_heel_fwd', 'heel_fwd', dict(FIX), 500),
    # ---- added after the first pass: B was still falling at step 500; D from a start further forward (another way to cover both slides)
    ('B_turn_5p1_1500', 'lifted_sym', dict(FIX, turn=4 * 0.015 / 0.6745), 1500),
    ('D2_cover_path_fwd_start', 'lifted_sym', dict(FIX, cover_path=True, start_dz=12.0), 500),
    ('A_fixes_1500', 'lifted_sym', dict(FIX), 1500),
]

def summarise(key, r, opt, steps, secs):
    grip, pk = key.split('_'); v = np.array(r['v']); t, i = r['_terms'](v)
    L, R_, Sx, ML, MR, MS = i['L'], i['R'], i['S'], i['ML'], i['MR'], i['MS']; p = np.array(r['final'])
    sec = [(float(a), float(b)) for a, b in Sx['arcs'][:4]]
    return {'trial': key, 'opt': {k: (v_ if not isinstance(v_, np.floating) else float(v_)) for k, v_ in opt.items()}, 'steps': steps, 'seconds': round(secs),
            'loss0': r['loss'][0] if r['loss'] else None, 'loss': r['loss'][-1] if r['loss'] else None, 'kept_step': len(r['loss']),
            'terms': {k: float(x) for k, x in t.items()}, 'final': [float(x) for x in p],
            'R_felt': {k: float(1 / x) for k, x in r['k_felt'].items()},
            'thumb': {'R': float(L['R']), 'chord': float(p[0]), 'sagitta': float(p[1]), 'z_bottom': ML['z_bottom'], 'below_hump': ML['below_hump'], 'flare': ML['flare'], 'n_minima': ML['n_minima'],
                      'arc_z': [float(L['A'][1]), float(L['B'][1])], 'hump_arc_L': float(L['arcs'][5][0]), 'front_arc_L': float(L['arcs'][3][0])},
            'pinky': {'R': float(R_['R']), 'chord': float(p[5]), 'sagitta': float(p[6]), 'z_bottom': MR['z_bottom'], 'below_hump': MR['below_hump'], 'flare': MR['flare'], 'n_minima': MR['n_minima'],
                      'arc_z': [float(R_['A'][1]), float(R_['B'][1])]},
            'groove': {'R': float(Sx['R']), 'chord': float(p[10]), 'sagitta': float(p[11]), 'u_bottom': MS['u_bottom'], 'depth_vs_button_chord': MS['depth_chord'], 'n_minima': MS['n_minima'],
                       'sec_arcs_L_R': [[round(a, 2), round(a / b, 2) if abs(b) > 1e-9 else None] for a, b in sec], 'ring': {k: MS['ring'][k] for k in ('k_deg_per_mm', 'slope_deg', 'n_minima')}},
            'dev': {'plan': max(LV.dev(i['CL'], LV.SORA_PLAN), LV.dev(i['CR'], LV.SORA_PLAN)), 'sec': LV.dev(i['CS'], LV.SORA_SEC)}, 'width': ML['u_hump'] + MR['u_hump'],
            'planL': [[float(a), float(b)] for a, b in L['arcs']], 'planR': [[float(a), float(b)] for a, b in R_['arcs']], 'sec': [[float(a), float(b)] for a, b in Sx['arcs']],
            'loss_curve': [float(x) for x in r['loss'][::10]]}

if __name__ == '__main__':
    res = json.load(open(OUT)) if os.path.exists(OUT) else {}
    want = sys.argv[1:]
    for name, key, opt, steps in RUNS:
        if (want and name not in want) or (not want and name in res): continue
        t0 = time.time(); grip, pk = key.split('_'); r = LV.trial(grip, pk, steps=steps, log=False, opt=opt)
        res[name] = LV.clean(summarise(key, r, opt, steps, time.time() - t0)); json.dump(res, open(OUT, 'w'), indent=1)
        s = res[name]
        print('%-20s %4.0f s loss %.4f -> %.4f (step %d) | waist R %.1f c %.1f d %.3f bottom z %.2f arc z %.1f..%.1f below hump %.2f | pinky R %.1f bottom %.2f | groove R %.1f c %.1f depth %.3f u %.2f S-arc %s | dev %.2f/%.2f' % (
            name, s['seconds'], s['loss0'], s['loss'], s['kept_step'], s['thumb']['R'], s['thumb']['chord'], s['thumb']['sagitta'], s['thumb']['z_bottom'], *s['thumb']['arc_z'], s['thumb']['below_hump'],
            s['pinky']['R'], s['pinky']['z_bottom'], s['groove']['R'], s['groove']['chord'], s['groove']['depth_vs_button_chord'], s['groove']['u_bottom'], s['groove']['sec_arcs_L_R'][2], s['dev']['plan'], s['dev']['sec']), flush=True)
    print('done')
