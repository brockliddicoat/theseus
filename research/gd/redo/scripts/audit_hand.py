"""Audit of deck/tools/gd/hand.py and trials.place: reproduce the recorded hand numbers, then change one input at a time and
see how far the study's results move (fingertip positions on the mouse, the thumb's contact, the slides).
Run from the worktree root: python3 research/gd/redo/scripts/audit_hand.py   -> prints tables, writes audit_out.json
Nothing in deck/ is changed: the study's modules are imported and their inputs patched in memory.

Note on the palm-lifted placement: trials.place('lifted') with no anchor returns wherever its solver stops (see lifted_free()).
Here every variant is anchored as the study anchors other hand sizes: the index fingertip at z 30.0, the mean hand's recorded value."""
import os, sys, json, contextlib
import numpy as np
ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..', '..'))
sys.path.insert(0, os.path.join(ROOT, 'deck', 'tools', 'gd'))
import hand as H, trials as T
from descend import top_y
from scipy.optimize import least_squares

ANCHOR = 30.0
BASE = {'BONES': dict(H.BONES), 'CASCADE': dict(H.CASCADE), 'KNUCKLE_BACK': dict(H.KNUCKLE_BACK), 'PALM_SKIN': H.PALM_SKIN,
        'THUMB_CMC_BACK': H.THUMB_CMC_BACK, 'THUMB_CMC_PALMAR': H.THUMB_CMC_PALMAR, 'THUMB_BONES': tuple(H.THUMB_BONES), 'THUMB': dict(H.THUMB)}

@contextlib.contextmanager
def patched(heel_deg=None, **kw):
    old = {k: getattr(H, k) for k in kw}; old_deg = T.GRIP_HEEL_DEG
    try:
        for k, v in kw.items(): setattr(H, k, v)
        if heel_deg is not None: T.GRIP_HEEL_DEG = heel_deg
        T._REACH.clear(); yield
    finally:
        for k, v in old.items(): setattr(H, k, v)
        T.GRIP_HEEL_DEG = old_deg; T._REACH.clear()

def both(k=1.0, anchor=ANCHOR):
    """the two placements of a hand k times the mean, the lifted one anchored at the index fingertip's z"""
    T._REACH.clear()
    L = T.place('lifted', k, anchor); T._REACH[round(float(k), 9)] = L['thumb']['reach']
    Hh = T.place('heel', k)
    r = {'lifted': {f: L['z'][f] for f in L['z']}, 'heel': {f: Hh['z'][f] for f in Hh['z']},
         'lifted_knuckle': [L['zK'], L['yK']], 'heel_knuckle': [Hh['zK'], Hh['yK']], 'palm_gap': L['palm_gap_mm'],
         'reach': L['thumb']['reach'], 'span': L['thumb']['span'],
         'thumb_ahead_of_index_knuckle': {'lifted': L['z']['thumb'] - L['joints']['index'][0][0], 'heel': Hh['z']['thumb'] - Hh['joints']['index'][0][0]},
         'slide': {'thumb': Hh['z']['thumb'] - L['z']['thumb'], 'pinky': Hh['z']['little'] - L['z']['little']},
         'tip_misfit': L['tip_misfit_mm']['index']}
    # the thumb pad to the index pad, straight line (x: the side wall 29.7 against the index at 16; y: the band 15 against the index tip's height)
    for g, P in (('lifted', L), ('heel', Hh)):
        it = P['joints']['index'][-1]; r.setdefault('thumb_to_index_tip', {})[g] = float(np.sqrt((it[0] - P['z']['thumb']) ** 2 + (it[1] - H.CONTACT_Y) ** 2 + (29.7 - 16.0) ** 2))
    return r

def row(name, r, b=None):
    s = '%-58s lifted: thumb %6.1f pinky %6.1f gap %5.1f | hump: index %5.1f middle %5.1f pinky %5.1f thumb %5.1f | slide thumb %5.1f pinky %5.1f' % (
        name, r['lifted']['thumb'], r['lifted']['little'], r['palm_gap'], r['heel']['index'], r['heel']['middle'], r['heel']['little'], r['heel']['thumb'], r['slide']['thumb'], r['slide']['pinky'])
    if b is not None:
        s += '  || moves: thumb grip %+5.1f, thumb landing %+5.1f, pinky grip %+5.1f, hump index tip %+5.1f, thumb slide %+5.1f, pinky slide %+5.1f' % (
            r['lifted']['thumb'] - b['lifted']['thumb'], r['heel']['thumb'] - b['heel']['thumb'], r['lifted']['little'] - b['lifted']['little'], r['heel']['index'] - b['heel']['index'],
            r['slide']['thumb'] - b['slide']['thumb'], r['slide']['pinky'] - b['slide']['pinky'])
    print(s)

def scaled_bones(s):
    raw = H.BONES_RAW; return {k: tuple(s * b for b in v) for k, v in raw.items()}

def lifted_free():
    """where the unanchored palm-lifted solve ends for different starting guesses"""
    g = 0.0; xs = {'index': 16.0, 'middle': -16.0}; kb = H.KNUCKLE_BACK
    def pts(f, v): return np.array([v[0] - kb[f], v[1]]) + T.joints(f, g, 1.0)
    def res(v): return [pts(f, v)[-1][1] - top_y(xs[f], pts(f, v)[-1][0]) for f in ('index', 'middle')]
    out = []
    for z0 in (-60, -45, -35, -25, -15, -5):
        for y0 in (60, 85, 110):
            sol = least_squares(res, [z0, y0], bounds=([-60.0, 30.0], [10.0, 140.0])); v = sol.x
            out.append({'start': [z0, y0], 'index_tip_z': float(pts('index', v)[-1][0]), 'cost': float(sol.cost), 'misfit': float(res(v)[0])})
    return out

if __name__ == '__main__':
    out = {}
    print('== 0. the recorded numbers, recomputed ==')
    S = H.summary(); print('scale %.4f; chords (length, angle below the metacarpal line): %s' % (S['scale'], {f: (round(c['len'], 1), round(c['angle_deg'], 1)) for f, c in S['chords'].items()}))
    print('thumb span %.2f mm; orbit finger flexion mean %.2f (per crew member, left and right averaged: %.1f)' % (H.thumb_span(), S['orbit_finger_flex_mean'], np.mean([42, 60, 30, (21 + 57) / 2, (55 + 47) / 2, (25 + 35) / 2])))
    free = T.place('lifted', 1.0); print('unanchored lifted placement: index tip z %.2f, thumb %.2f, pinky %.2f, palm gap %.2f' % (free['z']['index'], free['z']['thumb'], free['z']['little'], free['palm_gap_mm']))
    b = both(); row('baseline (the study, index tip anchored at z 30.0)', b); out['baseline'] = b
    print('thumb ahead of the index knuckle: lifted %.1f, on the hump %.1f mm; thumb tip to index tip: lifted %.1f, on the hump %.1f mm' % (b['thumb_ahead_of_index_knuckle']['lifted'], b['thumb_ahead_of_index_knuckle']['heel'], b['thumb_to_index_tip']['lifted'], b['thumb_to_index_tip']['heel']))
    print('\n== 1. the palm-lifted placement without an anchor: where the solver stops, by starting guess ==')
    fr = lifted_free(); out['lifted_free'] = fr
    for z in sorted(set(round(f['index_tip_z'], 1) for f in fr)):
        m = [f for f in fr if round(f['index_tip_z'], 1) == z]; print('   index tip z %5.1f  (cost %.2f, tips miss by %.1f mm)  from %d of %d starts' % (z, m[0]['cost'], abs(m[0]['misfit']), len(m), len(fr)))
    print('\n== 2. one input at a time ==')
    V = {}
    def run(name, heel_deg=None, anchor=ANCHOR, **kw):
        with patched(heel_deg, **kw): r = both(1.0, anchor)
        V[name] = r; row(name, r, b)
    run('lifted anchor: index tip at z 20', anchor=20.0); run('lifted anchor: index tip at z 40', anchor=40.0)
    run('bones x 1.066 (was 1.052)', BONES=scaled_bones(1.066))
    run('bones x 1.04', BONES=scaled_bones(1.04)); run('bones x 1.09', BONES=scaled_bones(1.09))
    run('knuckles behind the middle: index 0.7, ring 6, little 16', KNUCKLE_BACK={'index': 0.7, 'middle': 0.0, 'ring': 6.0, 'little': 16.0})
    run('  ... little 13', KNUCKLE_BACK={'index': 0.7, 'middle': 0.0, 'ring': 5.0, 'little': 13.0}); run('  ... little 19', KNUCKLE_BACK={'index': 0.7, 'middle': 0.0, 'ring': 7.5, 'little': 19.0})
    run('thumb bones Buryanov x 1.066 (49.3, 33.7, 23.1)', THUMB_BONES=(49.27, 33.65, 23.10))
    run('thumb base 0.30 hand lengths behind the knuckle (was 0.275)', THUMB_CMC_BACK=0.30); run('thumb base 0.35', THUMB_CMC_BACK=0.35); run('thumb base 0.37', THUMB_CMC_BACK=0.37)
    run('thumb base 5 mm under the knuckle line (was 10)', THUMB_CMC_PALMAR=5.0); run('thumb base 15 mm under', THUMB_CMC_PALMAR=15.0); run('thumb base 20 mm under', THUMB_CMC_PALMAR=20.0)
    run('thumb knuckle 12.5, tip joint 12.5 deg (Cooney 1981; was 39, 10)', THUMB={'cmc': 45, 'mcp': 12.5, 'ip': 12.5})
    run('thumb knuckle 15, tip joint 17 deg (Rogers 2008 tip joint, on a mouse)', THUMB={'cmc': 45, 'mcp': 15, 'ip': 17})
    run('palm skin 15 mm under the knuckle line (was 20)', PALM_SKIN=15.0); run('palm skin 25 mm', PALM_SKIN=25.0)
    run('wrist back 20 deg (was 15)', heel_deg=20.0); run('wrist back 25 deg', heel_deg=25.0); run('wrist back 31 deg (Oude Hengel 2008, in use)', heel_deg=31.0)
    C90 = {'index': (28, 29, 9), 'middle': (32, 30, 11), 'ring': (23, 35, 10), 'little': (31, 38, 13)}
    C0 = {'index': (27, 26, 10), 'middle': (32, 27, 10), 'ring': (24, 32, 8), 'little': (29, 34, 12)}
    CV = {'index': (27.08, 38.74, 13.76), 'middle': (33.21, 40.67, 14.20), 'ring': (29.34, 44.83, 14.33), 'little': (26.24, 43.07, 16.08)}
    CR = {'index': (24.4, 8.6, 4.4), 'middle': (27.3, 12.9, 4.8), 'ring': (22.0, 12.9, 5.6), 'little': (20.5, 4.1, 6.8)}
    run('cascade: Lee & Jung, forearm neutral, arm forward (shoulder 90)', CASCADE=C90); run('cascade: Lee & Jung, arm hanging (shoulder 0)', CASCADE=C0)
    run('cascade: Varghese 2020 (supinated, wrist 15 to 20 deg back)', CASCADE=CV); run('cascade: Rogers 2008, holding a mouse', CASCADE=CR)
    for d in (-10, -5, 5, 10):
        run('cascade: every knuckle %+d deg' % d, CASCADE={f: (a + d, p, q) for f, (a, p, q) in BASE['CASCADE'].items()})
    for d in (-10, 10):
        run('cascade: every middle joint %+d deg' % d, CASCADE={f: (a, p + d, q) for f, (a, p, q) in BASE['CASCADE'].items()})
    run('thumb links between joint centres 37 / 35 / 26 (was bones 46.9 / 33.1 / 23.4)', THUMB_BONES=(37.0, 35.0, 26.0))
    run('thumb base 0.29 hand lengths behind (was 0.275)', THUMB_CMC_BACK=0.29); run('thumb base 11.5 mm under the knuckle line (was 10)', THUMB_CMC_PALMAR=11.5)
    REC = dict(KNUCKLE_BACK={'index': 0.0, 'middle': 0.0, 'ring': 5.0, 'little': 13.0}, THUMB_BONES=(37.0, 35.0, 26.0), THUMB_CMC_BACK=0.29, THUMB_CMC_PALMAR=11.5)
    run('RECOMMENDED SIZES together (knuckles 0 / 5 / 13, thumb base 0.29 and 11.5 under, thumb links 37 / 35 / 26)', **REC)
    run('  ... and the thumb at Cooney\'s 12.5 / 12.5 deg', THUMB={'cmc': 45, 'mcp': 12.5, 'ip': 12.5}, **REC)
    run('  ... at the far ends: base 0.33, thumb angles 39 / 10', **dict(REC, THUMB_CMC_BACK=0.33))
    run('  ... at the near end: base 0.275, thumb angles 12.5 / 12.5', THUMB={'cmc': 45, 'mcp': 12.5, 'ip': 12.5}, **dict(REC, THUMB_CMC_BACK=0.275))
    out['variants'] = V
    print('\n== 3. hand sizes (5th, mean, 95th percentile hand length), the study\'s inputs and the recommended sizes ==')
    RECC = dict(REC, THUMB={'cmc': 45, 'mcp': 12.5, 'ip': 12.5})
    for nm, kw in (('study', {}), ('recommended sizes', REC), ('recommended_cooney sizes and Cooney thumb angles', RECC)):
        res = {}
        for hk, hl in T.HANDS.items():
            with patched(**kw): res[hk] = both(hl / T.HANDS['p50'])
        out['sizes_' + nm.split()[0]] = res
        print('%-18s thumb grip z %s; landing z %s; slide %s | pinky grip z %s; landing %s; slide %s | thumb ahead of the index knuckle (lifted) %s' % (
            nm, *[' / '.join('%.1f' % f(res[h]) for h in ('p5', 'p50', 'p95')) for f in (lambda r: r['lifted']['thumb'], lambda r: r['heel']['thumb'], lambda r: r['slide']['thumb'],
              lambda r: r['lifted']['little'], lambda r: r['heel']['little'], lambda r: r['slide']['pinky'], lambda r: r['thumb_ahead_of_index_knuckle']['lifted'])]))
    print('\n== 4. the spread between people from posture, against the spread from hand size ==')
    # the fingertip's reach along the metacarpal line and its drop below it, with each joint's SD (Lee & Jung, forearm neutral), joints taken as independent
    SD = {'index': (8, 8, 5), 'middle': (7, 11, 5), 'ring': (6, 10, 5), 'little': (7, 8, 7)}
    def tip(f, ang):
        p = np.zeros(2); c = 0.0
        for L_, a in zip(H.BONES[f], ang): c += np.radians(a); p = p + L_ * np.array([np.cos(c), -np.sin(c)])
        return p
    for f in ('index', 'middle', 'ring', 'little'):
        a0 = np.array(H.CASCADE[f], float); t0 = tip(f, a0); var = np.zeros(2)
        for i in range(3):
            da = np.zeros(3); da[i] = 1.0; g = (tip(f, a0 + da) - tip(f, a0 - da)) / 2.0; var += (g * SD[f][i]) ** 2
        size = t0 * (T.HANDS['p95'] - T.HANDS['p5']) / 2 / T.HANDS['p50']
        print('   %-6s tip %.1f mm ahead of the knuckle, %.1f below the knuckle line; 1 SD of posture: %.1f mm along, %.1f mm down; the 5th to 95th percentile of hand length: +/- %.1f mm along, %.1f down' % (f, t0[0], -t0[1], np.sqrt(var[0]), np.sqrt(var[1]), size[0], -size[1]))
        out.setdefault('posture_spread', {})[f] = {'along_sd_mm': float(np.sqrt(var[0])), 'down_sd_mm': float(np.sqrt(var[1])), 'size_half_range_along_mm': float(size[0])}
    json.dump(out, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'audit_out.json'), 'w'), indent=1, default=float)
