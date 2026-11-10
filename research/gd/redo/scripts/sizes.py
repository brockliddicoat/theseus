"""Sizes of the reference hand, re-derived from the primary sources read on 2026-11-09 (RA research redo).
Run: python3 research/gd/redo/scripts/sizes.py   (prints every derived number used in hand-at-rest.md; no downloads needed)

Sources (figures as read in the primaries; see hand-at-rest.md for pages and the two-read check):
  BK    Buryanov & Kotiuk 2010, Int. J. Morphol. 28(3):755-758, Tables I and III (66 adults, AP X-rays, right hands)
  A2    ANSUR II men, n 4,082 (public CSV recomputed by ansur_check.py; NATICK/TR-15/007 dimensions 42, 44, 65)
  G91   Greiner 1991, Hand Anthropometry of U.S. Army Personnel, NATICK/TR-92/011, men n 1,003 (photometric; OCR copy)
  GM18  Goislard de Monsabert et al. 2018, Ann. Biomed. Eng. 46:71-85, ESM Tables S1, S3a-f (ONE specimen, hand 203 mm)
  OSIM  OpenSim wrist model (opensim-models/Models/WristModel/wrist.osim; Gonzalez, Buchanan & Delp 1997), default pose (osim_joints.py)
  MYO   MyoHand / MyoArm (MyoHub/myo_sim, Apache-2.0; from the MoBL model, Holzbaur et al. 2005, and the 2nd-Hand model), rest pose (mjcf_joints.py)
Estimates are marked EST and carry a range."""
import json, math

# ---------------------------------------------------------------- BK Table I (mm): tip soft tissue, distal, middle, proximal, metacarpal
BK = {'thumb':  {'tip': 5.67, 'pd': 21.67, 'pm': None,  'pp': 31.57, 'm': 46.22},
      'index':  {'tip': 3.84, 'pd': 15.82, 'pm': 22.38, 'pp': 39.78, 'm': 68.12},
      'middle': {'tip': 3.95, 'pd': 17.40, 'pm': 26.33, 'pp': 44.63, 'm': 64.60},
      'ring':   {'tip': 3.95, 'pd': 17.30, 'pm': 25.65, 'pp': 41.37, 'm': 58.00},
      'little': {'tip': 3.73, 'pd': 15.96, 'pm': 18.11, 'pp': 32.74, 'm': 53.69}}
BK_SD = {'thumb': {'tip': 0.61, 'pd': 1.60, 'pp': 3.13, 'm': 3.94}, 'index': {'tip': 0.59, 'pd': 2.26, 'pm': 2.51, 'pp': 4.94, 'm': 6.27},
         'middle': {'tip': 0.61, 'pd': 1.85, 'pm': 3.00, 'pp': 3.81, 'm': 5.38}, 'ring': {'tip': 0.60, 'pd': 2.22, 'pm': 3.29, 'pp': 3.87, 'm': 5.06},
         'little': {'tip': 0.62, 'pd': 2.45, 'pm': 2.54, 'pp': 2.77, 'm': 4.36}}
BK_WEB_PCT = {'index': 15.52, 'middle': 15.33, 'ring': 18.49, 'little': 24.72}   # Table III, pp*: PER CENT of the external finger length
A2 = {'hand': 193.28, 'hand_sd': 9.95, 'palm': 116.46, 'palm_sd': 6.23, 'breadth': 88.26, 'breadth_sd': 4.39, 'hand_p5': 177.0, 'hand_p95': 210.0}
# G91 men (cm -> mm): digit length (base crease to tip), height (tip above the wrist-crease baseline), tip to wrist crease along the digit's axis
G91 = {'thumb': {'len': 69.7, 'height': 100.3, 'tipwrist': 137.9}, 'index': {'len': 75.3, 'height': 180.0, 'tipwrist': 185.2},
       'middle': {'len': 83.8, 'height': 194.1, 'tipwrist': 194.5}, 'ring': {'len': 79.2, 'height': 180.2, 'tipwrist': 185.0},
       'little': {'len': 64.7, 'height': 145.4, 'tipwrist': 159.9}, 'hand': 194.1, 'palm': 110.5, 'breadth': 90.4,
       'crotch': [69.1, 110.4, 109.9, 96.6], 'wrist_thumbtip': 124.5, 'wrist_indextip': 181.0,
       'dip_breadth': {'index': 20.1, 'middle': 19.8, 'ring': 18.5, 'little': 17.4}, 'pip_breadth': {'index': 23.0, 'middle': 22.5, 'ring': 21.4, 'little': 19.2},
       'thumb_ip_breadth': 24.0}
OLD = {'scale': 1.0516226208407504, 'web_mm_as_used': BK_WEB_PCT, 'knuckle_back': {'index': 0.19, 'middle': 0.0, 'ring': 3.16, 'little': 9.39},
       'thumb_bones': (46.93, 33.05, 23.39), 'cmc_back_HL': 55.9 / 203.0, 'cmc_palmar': 10.0}

def chain(f, skin=True):
    b = BK[f]; return b['pd'] + (b['pm'] or 0.0) + b['pp'] + (b['tip'] if skin else 0.0)

def main():
    out = {}
    # (1) the web heights in mm: pp* = (tip + d - de) / de, de the finger from the web to the skin's tip  ->  de = (tip + d) / (1 + pp*)
    web = {}
    for f, pct in BK_WEB_PCT.items():
        de = chain(f) / (1 + pct / 100.0); web[f] = {'external_finger_mm': de, 'web_height_mm': pct / 100.0 * de}
    out['web'] = web
    print('1. BK web heights (Table III is per cent of the external finger length):')
    for f, w in web.items(): print('   %-6s external finger %.1f mm, web height %.1f mm (the study used %.2f mm)' % (f, w['external_finger_mm'], w['web_height_mm'], BK_WEB_PCT[f]))

    # (2) the scale from the BK sample to the ANSUR II mean hand
    # the study: (hand - palm) / (middle bones - 15.33)
    s_old = (A2['hand'] - A2['palm']) / (BK['middle']['pd'] + BK['middle']['pm'] + BK['middle']['pp'] - 15.33)
    # like for like, landmark mismatch: ANSUR's finger is from the base CREASE, BK's from the WEB
    s_crease_web = (A2['hand'] - A2['palm']) / web['middle']['external_finger_mm']
    s_g91 = G91['middle']['len'] / web['middle']['external_finger_mm']
    # skeletal identity: stylion -> base of MC3 (c) + MC3 + PP3 + MP3 + DP3 + tip = hand length
    ray3 = BK['middle']['m'] + chain('middle')
    c_est, c_lo, c_hi = 26.0, 23.0, 29.0      # EST: carpal height 0.54 x MC3 (Youm 1978, from memory, not re-read) less the styloid's ~11 mm
    s_id = {c: (A2['hand'] - c) / ray3 for c in (c_lo, c_est, c_hi)}
    out['scale'] = {'study': s_old, 'ansur_crease_over_bk_web': s_crease_web, 'greiner_d3_over_bk_web': s_g91, 'skeletal_identity': s_id, 'ray3_mm': ray3}
    print('2. scale BK -> ANSUR II mean man: the study %.4f; ANSUR (hand - palm) / BK external finger %.3f (crease against web: not like for like);' % (s_old, s_crease_web))
    print('   Greiner digit 3 length / BK external finger %.3f; skeletal identity (193.28 - c) / %.2f = %.3f (c 26; %.3f to %.3f for c 29 to 23)' % (s_g91, ray3, s_id[c_est], s_id[c_hi], s_id[c_lo]))
    s = s_id[c_est]; out['scale']['skeletal_identity_c26'] = s; out['scale']['plausible_range'] = [1.04, 1.09]; out['scale']['recommended'] = s_old
    # the base crease lies 14.4 to 19.6 mm beyond the knuckle joint (Bugbee & Botte 1993 as cited by Doyle & Botte 2003 in Kosif et al. 2015)
    for nm, fl in (('ANSUR II (hand - palm)', A2['hand'] - A2['palm']), ('Greiner digit 3 length', G91['middle']['len'])):
        print('   %s %.1f mm + crease 14.4 to 19.6 mm beyond the joint, over BK\'s %.2f mm: scale %.3f to %.3f' % (nm, fl, chain('middle'), (fl + 14.4) / chain('middle'), (fl + 19.6) / chain('middle')))
    X = s * chain('middle') - (A2['hand'] - A2['palm'])
    print('   check: the middle finger\'s base crease then lies %.1f mm beyond its knuckle joint (ANSUR II); with Greiner\'s crease %.1f mm' % (X, s * chain('middle') - G91['middle']['len']))
    out['scale']['crease_beyond_mcp3_mm'] = X

    # (3) bones for the mean hand, the study's and the recommended
    bones = {f: [s * BK[f]['pp'], s * BK[f]['pm'], s * BK[f]['pd']] for f in ('index', 'middle', 'ring', 'little')}
    thumb = [s * BK['thumb']['m'], s * BK['thumb']['pp'], s * BK['thumb']['pd']]
    tips = {f: s * BK[f]['tip'] for f in BK}
    out['bones_mm'] = bones; out['thumb_bones_mm'] = thumb; out['tip_soft_tissue_mm'] = tips
    print('3. bones for the ANSUR II mean hand at scale %.3f (the study\'s at %.3f in brackets):' % (s, s_old))
    for f in bones: print('   %-6s %s  [%s]' % (f, ' / '.join('%.1f' % v for v in bones[f]), ' / '.join('%.1f' % (s_old * BK[f][k]) for k in ('pp', 'pm', 'pd'))))
    print('   thumb  %s  [the study: %s]  + %.1f mm of soft tissue at the tip' % (' / '.join('%.1f' % v for v in thumb), ' / '.join('%.1f' % v for v in OLD['thumb_bones']), tips['thumb']))
    print('   thumb straight, base to skin tip: %.1f mm (study, bone only: %.1f)' % (sum(thumb) + tips['thumb'], sum(OLD['thumb_bones'])))

    # (4) where the knuckle joints sit along the hand: Greiner's digit heights less the scaled finger, along each digit's own axis
    print('4. knuckle joint lines above the wrist-crease baseline (Greiner men: height - cos(theta) x scaled finger; derived):')
    kn = {}
    for sc_name, sc in (('rec', s), ('study', s_old), ('g91', s_g91)):
        h = {}
        for f in ('index', 'middle', 'ring', 'little'):
            g = G91[f]; cs = g['height'] / g['tipwrist']; h[f] = g['height'] - cs * sc * chain(f)
        kn[sc_name] = {'height_mm': h, 'behind_middle_mm': {f: h['middle'] - h[f] for f in h}}
        print('   scale %.3f: %s ; behind the middle\'s: %s' % (sc, ', '.join('%s %.1f' % (f, v) for f, v in h.items()), ', '.join('%s %.1f' % (f, v) for f, v in kn[sc_name]['behind_middle_mm'].items())))
    # the same from the bones alone: metacarpal length differences (ignores the bases' own offsets)
    mcd = {f: s * (BK['middle']['m'] - BK[f]['m']) for f in ('index', 'ring', 'little')}
    print('   metacarpal length alone, middle minus each (x %.3f): %s' % (s, ', '.join('%s %.1f' % kv for kv in mcd.items())))
    out['knuckles'] = kn; out['knuckles']['metacarpal_difference_mm'] = mcd

    # (5) GM18, one specimen: joint axis points (mm), ulna frame: X toward the thumb side in this pose, Y proximal, Z palmar (see the note)
    GM = {'CMC1_fe': (63.295, -34.518, -7.088), 'CMC1_aa': (82.077, -28.811, -4.837), 'MCP1': (91.554, -64.140, 3.117), 'IP1': (111.414, -95.813, -15.995),
          'MCP2_fe': (71.674, -87.610, -17.488), 'MCP2_aa': (68.471, -87.639, -14.211), 'PIP2': (64.953, -135.492, -12.956), 'DIP2': (76.188, -161.367, -16.307),
          'MCP3_fe': (32.900, -88.269, -9.424), 'MCP3_aa': (42.276, -88.635, -13.560), 'PIP3': (44.415, -140.812, -13.250), 'DIP3': (53.651, -174.594, -18.298),
          'MCP4_fe': (25.619, -81.791, -4.356), 'MCP4_aa': (18.649, -85.173, -9.535), 'MCP5_fe': (-1.732, -75.912, 4.286), 'MCP5_aa': (2.748, -72.907, -9.168),
          'wrist_fe': (43.229, -0.712, -2.087), 'wrist_aa': (38.585, -11.269, -3.927)}
    GM_AX = {'CMC1_fe': (-0.018, -0.931, -0.364), 'CMC1_aa': (0.896, 0.235, -0.377)}
    GM_VAR = {'CMC1_fe': (33.6, 7.2), 'CMC1_aa': (47.0, 14.1), 'MCP2_fe': (18.3, 5.6), 'MCP2_aa': (13.3, 4.2)}   # direction (deg), position (mm)
    HL = 203.0; k = A2['hand'] / HL
    mid = lambda a, b: tuple((p + q) / 2 for p, q in zip(GM[a], GM[b]))
    mcp = {n: mid('MCP%d_fe' % n, 'MCP%d_aa' % n) for n in (2, 3, 4, 5)}
    cmc = mid('CMC1_fe', 'CMC1_aa')
    d = lambda a, b: math.dist(a, b)
    print('5. GM18 specimen (hand 203 mm): CMC1 relative to MCP2 (means of the two axis points): proximal %.1f, toward the thumb %.1f, palmar %.1f mm' % (cmc[1] - mcp[2][1], cmc[0] - mcp[2][0], cmc[2] - mcp[2][2]))
    print('   each axis point on its own: flexion axis %.1f mm proximal (its direction is %.0f %% along the hand, so this figure is free to slide), abduction axis %.1f mm' % (GM['CMC1_fe'][1] - mcp[2][1], 100 * abs(GM_AX['CMC1_fe'][1]), GM['CMC1_aa'][1] - mcp[2][1]))
    print('   stated position variation: flexion axis %.1f mm, abduction axis %.1f mm' % (GM_VAR['CMC1_fe'][1], GM_VAR['CMC1_aa'][1]))
    print('   as hand lengths: %.3f (the study\'s 0.275); for the ANSUR II mean hand %.1f mm' % ((cmc[1] - mcp[2][1]) / HL, k * (cmc[1] - mcp[2][1])))
    print('   knuckles behind the middle\'s (x %.3f to the mean hand): index %.1f, ring %.1f, little %.1f mm' % (k, k * (mcp[2][1] - mcp[3][1]), k * (mcp[4][1] - mcp[3][1]), k * (mcp[5][1] - mcp[3][1])))
    print('   thumb links: base to knuckle %.1f, knuckle to tip joint %.1f mm; index: knuckle to middle joint %.1f, to tip joint %.1f mm' % (d(cmc, GM['MCP1']), d(GM['MCP1'], GM['IP1']), d(mcp[2], GM['PIP2']), d(GM['PIP2'], GM['DIP2'])))
    out['gm18'] = {'cmc_rel_mcp2_mm': {'proximal': cmc[1] - mcp[2][1], 'radial': cmc[0] - mcp[2][0], 'palmar': cmc[2] - mcp[2][2]}, 'hand_mm': HL,
                   'knuckles_behind_middle_mean_hand_mm': {'index': k * (mcp[2][1] - mcp[3][1]), 'ring': k * (mcp[4][1] - mcp[3][1]), 'little': k * (mcp[5][1] - mcp[3][1])},
                   'position_variation_mm': {'CMC1_fe': 7.2, 'CMC1_aa': 14.1}}

    # (6) the thumb's base relative to the index knuckle's centre: five readings
    print('6. the thumb\'s base behind the index knuckle\'s centre, along the hand:')
    # MYO: the open MyoHand model (MyoHub/myo_sim, Apache-2.0; from the MoBL OpenSim model and the 2nd-Hand model), mjcf_joints.py, hand axes
    MYO = {'cmc_behind': 58.0, 'cmc_radial': 8.1, 'cmc_palmar': 13.1, 'wrist_to_mcp3': 81.5, 'wrist_to_dip3': 155.3, 'thumb_links': (35.9, 31.1),
           'knuckles_behind_middle': {'index': -1.3, 'ring': 3.0, 'little': 12.8}, 'knuckles_palmar_of_middle': {'index': 0.0, 'ring': 6.0, 'little': 14.1}}
    myo_hand = MYO['wrist_to_dip3'] + 25.0 + 10.0   # EST: tip joint centre to the skin's tip about 25 mm, the wrist's centre about 10 mm beyond the wrist crease
    print('   (1) GM18 specimen (hand 203 mm): %.1f mm behind, %.1f palmar, %.1f toward the thumb; x %.3f for the mean hand: %.1f mm = 0.276 hand lengths' % (cmc[1] - mcp[2][1], cmc[2] - mcp[2][2], cmc[0] - mcp[2][0], k, k * (cmc[1] - mcp[2][1])))
    print('   (2) MyoHand model: %.1f mm behind, %.1f palmar, %.1f toward the thumb; its hand about %.0f mm (EST) -> %.2f hand lengths' % (MYO['cmc_behind'], MYO['cmc_palmar'], MYO['cmc_radial'], myo_hand, MYO['cmc_behind'] / myo_hand))
    osim_ratio = 79.7 / 82.1
    idx_links = s * (BK['index']['pp'] + BK['index']['pm']) + 4.2     # EST: knuckle centre to tip-joint centre = the two bones + about 4 mm
    c_ = osim_ratio * idx_links
    print('   (3) OpenSim wrist model: 79.7 mm behind for an index of 82.1 mm knuckle to tip joint (MyoHand\'s index: 67.7 mm, ratio 0.86; GM18\'s 76.6, ratio 0.73): the outlier; scaled %.1f mm' % c_)
    r_head = 6.5                                   # EST: the knuckle's centre behind its joint line (the metacarpal head's radius), 5.5 to 7.5 mm
    a_ = s * BK['index']['m'] - r_head
    print('   (4) bones: index metacarpal %.1f - %.1f = %.1f mm IF the base\'s centre were level with that metacarpal\'s base; (1) and (2) put it about 10 mm beyond that level -> about %.0f mm' % (s * BK['index']['m'], r_head, a_, a_ - 10))
    g = G91['thumb']; cs1 = g['height'] / g['tipwrist']; L1 = s * (BK['thumb']['m'] + BK['thumb']['pp'] + BK['thumb']['pd'] + BK['thumb']['tip'])
    tmc_h = (g['tipwrist'] - L1) * cs1; h2 = kn['rec']['height_mm']['index'] - r_head; b_ = h2 - tmc_h
    fore = s * BK['thumb']['m'] * (1 - math.cos(math.radians(35)))   # EST: the thumb's metacarpal dips 35 deg out of the photograph's plane, so it reads shorter
    print('   (5) Greiner men + BK x %.3f, a flat photograph: %.1f mm behind (the thumb\'s joint surface); less %.1f mm if its metacarpal dips 35 deg out of the picture, less about 5 mm to the centre -> about %.0f mm' % (s, b_, fore * cs1, b_ - fore * cs1 - 5))
    rec = 56.0
    print('   recommended: %.0f mm, %.2f hand lengths (range 53 to 66 mm, 0.275 to 0.34); %.1f mm under the knuckle line (10 to 13); about 5 mm toward the thumb side (3 to 8)' % (rec, rec / A2['hand'], 11.5))
    out['thumb_base'] = {'gm18_mm': k * (cmc[1] - mcp[2][1]), 'gm18_palmar_mm': cmc[2] - mcp[2][2], 'gm18_radial_mm': cmc[0] - mcp[2][0], 'myohand': MYO, 'myohand_hand_est_mm': myo_hand,
                         'opensim_wrist_mm': c_, 'bones_if_level_mm': a_, 'greiner_bk_flat_mm': b_, 'recommended_mm': rec, 'recommended_HL': rec / A2['hand'], 'range_HL': [0.275, 0.34],
                         'recommended_palmar_mm': 11.5, 'palmar_range_mm': [10, 13], 'recommended_radial_mm': 5.0, 'radial_range_mm': [3, 8]}
    # the thumb's links between joint centres: GM18 38.6 / 42.0 (noisy), MyoHand 35.9 / 31.1; BK's bones x s are 49.3 / 33.7 / 23.1 between joint surfaces
    print('   thumb links between joint centres: GM18 %.1f / %.1f, MyoHand %.1f / %.1f mm; BK bones x %.3f: %s (joint surface to joint surface)' % (d(cmc, GM['MCP1']), d(GM['MCP1'], GM['IP1']), *MYO['thumb_links'], s, ' / '.join('%.1f' % v for v in thumb)))
    print('   recommended chain from the base\'s centre: 37 (36 to 39) / 35 (31 to 36) / 26 to the bone\'s tip (+ %.0f mm of skin): %.0f mm straight, against the study\'s %.1f' % (tips['thumb'], 37 + 35 + 26, sum(OLD['thumb_bones'])))
    out['thumb_links_recommended_mm'] = [37.0, 35.0, 26.0]
    # (7) the knuckles behind the middle's, three sources
    print('7. each knuckle behind the middle finger\'s (mm, mean hand): the study %s' % OLD['knuckle_back'])
    srcs = {'GM18 specimen': out['gm18']['knuckles_behind_middle_mean_hand_mm'], 'MyoHand model': MYO['knuckles_behind_middle'], 'Greiner + BK (derived)': {f: kn['rec']['behind_middle_mm'][f] for f in ('index', 'ring', 'little')}}
    for nm, v in srcs.items(): print('   %-24s index %+.1f, ring %+.1f, little %+.1f' % (nm, v['index'], v['ring'], v['little']))
    print('   recommended: index 0 (-1.3 to 0.9), ring 5 (3.0 to 7.4), little 13 (12.8 to 18.9); the little finger\'s knuckle also sits 9 to 14 mm toward the palm (GM18 %.1f, MyoHand %.1f)' % (mcp[5][2] - mcp[3][2], MYO['knuckles_palmar_of_middle']['little']))
    out['knuckles']['sources'] = srcs; out['knuckles']['recommended_mm'] = {'index': 0.0, 'middle': 0.0, 'ring': 5.0, 'little': 13.0}
    out['knuckles']['recommended_range_mm'] = {'index': [-1.3, 0.9], 'ring': [3.0, 7.4], 'little': [12.8, 18.9]}
    # (8) the thumb laid along the index: its tip against the index's middle joint (the thumb about 25 deg off the index's line)
    for nm, back, chainlen in (('study: base 53.2 mm behind, bones 103.4', OLD['cmc_back_HL'] * A2['hand'], sum(OLD['thumb_bones'])), ('recommended: base 56 mm behind, links 98', rec, 98.0)):
        reach = (chainlen + tips['thumb']) * math.cos(math.radians(25)) - back
        print('8. thumb laid along the index (%s): its skin tip %.0f mm past the index knuckle\'s centre; the index\'s middle joint is %.0f mm past it' % (nm, reach, s * BK['index']['pp'] + 3))
    json.dump(out, open(__file__.replace('sizes.py', 'sizes_out.json'), 'w'), indent=1, default=float)

if __name__ == '__main__':
    main()
