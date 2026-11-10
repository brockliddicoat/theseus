"""The corrected thumb, before and after, for the 5th, 50th and 95th percentile hands: writes research/gd/redo/hand-variant.json.
Run from the worktree root: python3 research/gd/redo/scripts/hand_variant.py
'before' is deck/tools/gd/hand.py as it stands. 'after' changes the thumb only (research/gd/redo/variant/hand.py): links between joint
centres 37 / 35 / 26 mm (26 to the bone's tip; the skin's tip is 6 mm further), the base 0.29 hand lengths behind the index knuckle and
11.5 mm under the knuckle line, the tip joint 10 deg, and the knuckle at each of three values: 39, 25 and 12.5 deg.
The placements are made exactly as longarcs.py makes them (placements, slides, overlap_at, overlap_hand are copied from it), so the
'slide' and 'path' blocks have the shape longarcs.py writes to out/longarcs.json and the 'hand' block the shape export_deck.py writes.
To rerun the trials on a variant: put research/gd/redo/variant ahead of deck/tools/gd on sys.path (and set GD_THUMB_KNUCKLE), e.g.
  PYTHONPATH=research/gd/redo/variant GD_THUMB_KNUCKLE=25 python3 deck/tools/gd/longarcs.py run      (it writes deck/tools/gd/out/longarcs.json)"""
import os, sys, json, subprocess, contextlib
import numpy as np
from scipy.optimize import brentq
ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..', '..'))
GD = os.path.join(ROOT, 'deck', 'tools', 'gd'); VAR = os.path.join(ROOT, 'research', 'gd', 'redo', 'variant')
sys.path.insert(0, GD)
import hand as H, trials as T
TURN_REL = 4 * (0.009 + 2 * 0.003)      # rad, as longarcs.py
GROOVE_END = 48.0
AFTER = dict(THUMB_BONES=(37.0, 35.0, 26.0), THUMB_CMC_BACK=0.29, THUMB_CMC_PALMAR=11.5)
KNUCKLES = {'knuckle_39': 39.0, 'knuckle_25': 25.0, 'knuckle_12_5': 12.5}
r3 = lambda v: round(float(v), 3)

@contextlib.contextmanager
def patched(**kw):
    old = {k: getattr(H, k) for k in kw}
    try:
        for k, v in kw.items(): setattr(H, k, v)
        T._REACH.clear(); yield
    finally:
        for k, v in old.items(): setattr(H, k, v)
        T._REACH.clear()

def block():
    """everything longarcs.py and export_deck.py take from the hand, for the hand model as it is patched now"""
    def placements(grip):
        p50 = T.place(grip, 1.0); anc = p50['z']['index'] if grip == 'lifted' else None
        return {k: (p50 if k == 'p50' else T.place(grip, T.HANDS[k] / T.HANDS['p50'], anc)) for k in T.HANDS}
    PL_LIFT, PL_HEEL = placements('lifted'), placements('heel')
    SL = {}
    for hk in T.HANDS:
        L, H_ = PL_LIFT[hk], PL_HEEL[hk]
        SL[hk] = {'thumb': [L['z']['thumb'], H_['z']['thumb']], 'pinky': [L['z']['little'], H_['z']['little']],
                  'slide': {'thumb': abs(H_['z']['thumb'] - L['z']['thumb']), 'pinky': abs(H_['z']['little'] - L['z']['little'])}}
    SLIDE = dict(SL['p50']['slide']); SLIDE_RANGE = {f: [min(SL[k]['slide'][f] for k in SL), max(SL[k]['slide'][f] for k in SL)] for f in ('thumb', 'pinky')}
    PATH = {f: sorted(SL['p50'][f]) for f in ('thumb', 'pinky')}; PATHS = {hk: {f: sorted(SL[hk][f]) for f in ('thumb', 'pinky')} for hk in SL}
    def overlap_at(k):
        L, H_ = T.place('lifted', k, PL_LIFT['p50']['z']['index']), T.place('heel', k)
        return min(H_['z']['thumb'], H_['z']['little']) - max(L['z']['thumb'], L['z']['little'])
    lo = T.HANDS['p5'] / T.HANDS['p50'] * 0.9
    try: oh = float(brentq(overlap_at, lo, 1.0, xtol=1e-6) * T.HANDS['p50']); oh_note = 'the shortest hand whose two paths still overlap'
    except ValueError: oh = None; oh_note = 'no crossing between %.0f and %.0f mm: overlap %.1f mm at %.0f mm, %.1f mm at the mean hand' % (lo * T.HANDS['p50'], T.HANDS['p50'], overlap_at(lo), lo * T.HANDS['p50'], overlap_at(1.0))
    PLC = {g: (PL_HEEL if g == 'heel' else PL_LIFT)['p50'] for g in ('heel', 'lifted')}
    hand = {'cascade': H.CASCADE, 'thumb': H.THUMB, 'orbit_flex': H.ORBIT_FINGER_FLEX, 'bones': {k2: np.round(v, 2).tolist() for k2, v in H.BONES.items()}, 'chords': H.summary()['chords'],
            'grips': {g: {kk: PLC[g][kk] for kk in ('zK', 'yK', 'gamma_deg', 'palm_gap_mm', 'tip_misfit_mm', 'joints', 'z', 'thumb')} for g in ('heel', 'lifted')},
            'thumbBase': {'cmc_back_mm': H.THUMB_CMC_BACK * H.ANSUR['hand'], 'cmc_palmar_mm': H.THUMB_CMC_PALMAR, 'bones': list(H.THUMB_BONES), 'span': H.thumb_span(), 'contact_y': H.CONTACT_Y,
                          'g1_dip': {g: PLC[g]['joints']['index'][2] for g in PLC}},
            'palm_skin': H.PALM_SKIN, 'ansur': H.ANSUR}
    table = {}
    for hk in T.HANDS:
        L, H_ = PL_LIFT[hk], PL_HEEL[hk]
        table[hk] = {'hand_length_mm': T.HANDS[hk],
                     'grip': {'z': r3(L['thumb']['tip'][0]), 'height': r3(L['thumb']['tip'][1]), 'base': L['thumb']['cmc'], 'ahead_of_index_knuckle': r3(L['z']['thumb'] - L['joints']['index'][0][0])},
                     'hump': {'z': r3(H_['thumb']['tip'][0]), 'height': r3(H_['thumb']['tip'][1]), 'base': H_['thumb']['cmc'], 'ahead_of_index_knuckle': r3(H_['z']['thumb'] - H_['joints']['index'][0][0])},
                     'slide': r3(SL[hk]['slide']['thumb']), 'reach_along_the_mouse': r3(L['thumb']['reach']), 'span_base_to_tip': r3(L['thumb']['span']),
                     'pinky': {'grip_z': r3(L['z']['little']), 'hump_z': r3(H_['z']['little']), 'slide': r3(SL[hk]['slide']['pinky'])},
                     'paths_overlap': r3(min(PATHS[hk]['thumb'][1], PATHS[hk]['pinky'][1]) - max(PATHS[hk]['thumb'][0], PATHS[hk]['pinky'][0])),
                     'paths_overlap_from_to': [r3(max(PATHS[hk]['thumb'][0], PATHS[hk]['pinky'][0])), r3(min(PATHS[hk]['thumb'][1], PATHS[hk]['pinky'][1]))]}
    return {'hand': hand,
            'slide': {'p50': SLIDE, 'range': SLIDE_RANGE, 'per_hand': SL, 'contact_side': float(T.contact_d(T.S.N_SIDE)), 'R_felt': {f: SLIDE[f] / TURN_REL for f in SLIDE},
                      'basis': 'hand model: the heel placement (palm on the hump, fingers relaxed) to the lifted (zero-g, tips on the buttons); derived'},
            'path': {'p50': PATH, 'per_hand': PATHS, 'overlap': {hk: min(PATHS[hk]['thumb'][1], PATHS[hk]['pinky'][1]) - max(PATHS[hk]['thumb'][0], PATHS[hk]['pinky'][0]) for hk in PATHS},
                     'overlap_hand_mm': oh, 'overlap_hand_note': oh_note, 'groove_end': GROOVE_END},
            'thumb_by_hand': table}

def check_copy(knuckle, blk):
    """the variant copy of hand.py, run in its own process, must give the same thumb as the in-memory patch"""
    code = ("import sys; sys.path.insert(0, %r); sys.path.insert(0, %r); import hand as H, trials as T; assert 'variant' in H.__file__; "
            "L = T.place('lifted', 1.0); Hh = T.place('heel', 1.0); print(L['z']['thumb'], Hh['z']['thumb'], H.thumb_span())") % (GD, VAR)
    out = subprocess.run([sys.executable, '-c', code], capture_output=True, text=True, env=dict(os.environ, GD_THUMB_KNUCKLE=str(knuckle)), cwd=ROOT)
    a = [float(x) for x in out.stdout.split()]; g = blk['hand']['grips']
    ok = abs(a[0] - g['lifted']['z']['thumb']) < 1e-6 and abs(a[1] - g['heel']['z']['thumb']) < 1e-6
    return ok, a, out.stderr[-300:]

if __name__ == '__main__':
    res = {'about': 'The thumb of the shape study\'s hand model, before and after the corrections of the research redo (RA, 2026-11-09). Only the thumb changes; the fingers, '
                    'the two placements, the contact band (y 15) and the sizes are the model\'s. Three "after" blocks, one per value of the thumb\'s knuckle at rest (Brock chooses).',
           'made_by': 'research/gd/redo/scripts/hand_variant.py', 'variant_module': 'research/gd/redo/variant/hand.py (set GD_THUMB_KNUCKLE to 39, 25 or 12.5)',
           'shape': 'each block: hand (as export_deck.py writes GD.hand), slide and path (as longarcs.py writes them to out/longarcs.json), thumb_by_hand (the table of the report)',
           'frame': 'the mouse\'s, mm: z toward the nose from the footprint\'s middle, height above the pad. The thumb touches the side at the contact band\'s middle, height 15 mm, in both placements (the model\'s rule).',
           'inputs': {'before': {'THUMB': dict(H.THUMB), 'THUMB_BONES': [round(b, 2) for b in H.THUMB_BONES], 'THUMB_CMC_BACK': H.THUMB_CMC_BACK, 'THUMB_CMC_PALMAR': H.THUMB_CMC_PALMAR},
                      'after': {'THUMB_BONES': list(AFTER['THUMB_BONES']), 'THUMB_CMC_BACK': 0.29, 'THUMB_CMC_PALMAR': 11.5, 'THUMB': {'cmc': 45, 'mcp': '39, 25 or 12.5', 'ip': 10}},
                      'why': {
                        'THUMB_BONES': 'Links between joint centres. Base to knuckle 37 mm: 38.6 in one specimen of 203 mm (Goislard de Monsabert et al. 2018, ESM Table S3) and 35.9 in the open MyoHand model; the whole first bone is 46.2 mm (SD 3.9) between its joint surfaces '
                                       '(Buryanov & Kotiuk 2010, Table I; 48.6 scaled), but the base joint turns about a point inside the bone\'s near end. Knuckle to tip joint 35: Buryanov\'s 31.57 x 1.052 + about 2. Tip joint to the bone\'s tip 26: 21.67 x 1.052 + about 3. '
                                       'The chain ends at the bone\'s tip, as the fingers\' chains do; the skin\'s tip is 6 mm further (5.67 x 1.052) and the pad\'s centre about 3 mm nearer. Status: two sources for the first link, the others derived.',
                        'THUMB_CMC_BACK': 'The base\'s centre 56 mm behind the index knuckle\'s for the mean hand: 56.0 mm in the specimen (hand 203 mm, so 53.3 scaled), 58.0 mm in MyoHand (a hand of about 185 to 190 mm). Range 0.275 to 0.34 hand lengths.',
                        'THUMB_CMC_PALMAR': '11.5 mm under the knuckle line: the specimen 9.9, MyoHand 13.1. The model\'s 10 was an estimate.',
                        'tip_joint_10': 'Measured: Lee & Jung 2014, 10 deg (SD 6), 40 hands, skin markers; Rogers et al. 2008, 100 hands, landmarks on the palm side: 6 deg (SD 15) relaxed round a large ball, 17 deg (SD 16) holding a mouse.',
                        'knuckle_39': 'Measured: Lee & Jung 2014, 39 deg (SD 12), 40 relaxed hands, forearm neutral, skin markers; the paper does not define what the angle is measured from.',
                        'knuckle_25': 'An estimate: 39 less a marker over-read of 6 to 24 deg, so 15 to 33 deg, taken at about the middle. The over-read: markers on the skin stand at different heights above the bones\' axes (about 14 mm at the thumb\'s knuckle, 12 mm at its tip joint, marker centres included; the height of the base\'s "virtual" marker is not given: 0 if at the joint\'s centre, 12 if at the skin), so a straight thumb reads 6 to 24 deg bent across links of 37 and 35 mm. For fingers the same kind of markers read 4 to 5 deg high against a goniometer at about 30 deg (Cook et al. 2007, J Appl Biomech 23:70-78, 5 people).',
                        'knuckle_12_5': 'Described, not measured: Cooney, Lucca, Chao & Linscheid 1981 (J Bone Joint Surg 63-A:1371-81) describe their rest position as the thumb against the side of the index\'s end bone with the knuckle and tip joint each flexed 10 to 15 deg.'}},
           'after': {}}
    res['before'] = block()
    for key, kn in KNUCKLES.items():
        with patched(THUMB={'cmc': 45, 'mcp': kn, 'ip': 10}, **AFTER):
            blk = block()
        ok, a, err = check_copy(kn, blk); blk['variant_copy_check'] = {'same_as_the_variant_module_run_on_its_own': ok, 'thumb_grip_z_hump_z_span': a}
        if not ok: print('CHECK FAILED', key, a, err)
        res['after'][key] = blk
    # beyond what was asked, for the overlap: the little finger's knuckle 13 mm behind the middle's (the model has 9.39), the ring's 5, the index's 0
    KN = {'index': 0.0, 'middle': 0.0, 'ring': 5.0, 'little': 13.0}
    res['after_with_recommended_knuckles'] = {'note': 'The same three thumbs with the knuckles set back as three sources put them (index 0, ring 5, little 13 mm behind the middle\'s; the model has 0.19, 3.16, 9.39 from a unit slip: '
                                               'hand-at-rest.md). This moves the little finger about 3.8 mm toward the tail in both placements and so lengthens the overlap. Not part of the thumb variant; offered for the rerun.', 'KNUCKLE_BACK': KN}
    for key, kn in KNUCKLES.items():
        with patched(THUMB={'cmc': 45, 'mcp': kn, 'ip': 10}, KNUCKLE_BACK=KN, **AFTER):
            res['after_with_recommended_knuckles'][key] = block()
    res['skin_tip'] = 'To place the SKIN\'s tip rather than the bone\'s, add 6.0 mm to the last link (26 -> 32): every thumb z below then moves about 6 mm toward the nose (5.7 to 6.6).'
    json.dump(res, open(os.path.join(ROOT, 'research', 'gd', 'redo', 'hand-variant.json'), 'w'), indent=1, default=float)
    def line(nm, b):
        t = b['thumb_by_hand']; f = lambda g: ' / '.join('%.1f' % g(t[h]) for h in ('p5', 'p50', 'p95'))
        print('%-14s grip z %-20s hump z %-19s slide %-18s ahead of knuckle: grip %-18s hump %-18s overlap %-17s pinky grip %s hump %s | felt R <= %.0f' % (
            nm, f(lambda r: r['grip']['z']), f(lambda r: r['hump']['z']), f(lambda r: r['slide']), f(lambda r: r['grip']['ahead_of_index_knuckle']), f(lambda r: r['hump']['ahead_of_index_knuckle']),
            f(lambda r: r['paths_overlap']), f(lambda r: r['pinky']['grip_z']), f(lambda r: r['pinky']['hump_z']), b['slide']['R_felt']['thumb']))
        print('               overlap_hand_mm %s (%s); span %.1f, reach %.1f; base (z, height): grip %s, hump %s' % (b['path']['overlap_hand_mm'], b['path']['overlap_hand_note'], t['p50']['span_base_to_tip'], t['p50']['reach_along_the_mouse'], t['p50']['grip']['base'], t['p50']['hump']['base']))
    print('5th / 50th / 95th percentile hands (177.0 / 193.3 / 210.0 mm); the thumb touches at height 15 mm in every case')
    line('before', res['before'])
    for key in KNUCKLES: line(key, res['after'][key])
    for key in KNUCKLES: line(key + ' +kn', res['after_with_recommended_knuckles'][key])
