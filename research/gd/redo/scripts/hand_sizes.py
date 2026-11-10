"""Writes research/gd/redo/hand-sizes.json: the outside dimensions a survey measures on a man's hand, the bones, where the joint
centres sit under the skin, and the thumb, for fitting a drawn hand to the ANSUR II men's mean hand (193.3 mm).
Run: python3 research/gd/redo/scripts/hand_sizes.py
Every figure was read in the primary named beside it on 2026-11-09 (reads: how many separately worded reads agreed), or is derived
here and says so. Lengths are scaled to the reference hand by hand length, breadths and depths by hand breadth."""
import json, os

REF = {'hand_length_mm': 193.28, 'palm_length_mm': 116.46, 'hand_breadth_mm': 88.26}
SURV = {
 'ansur2': {'name': 'ANSUR II, 2012 Anthropometric Survey of U.S. Army Personnel (Gordon et al. 2014, NATICK/TR-15/007), men', 'n': 4082, 'hand_length_mm': 193.28, 'hand_breadth_mm': 88.26,
            'url': 'https://apps.dtic.mil/sti/pdfs/ADA611869.pdf', 'method': 'direct, calipers and tape', 'status': 'verified: dimension pages 42, 43, 44 and 65 read; means and SDs recomputed from the public CSV (scripts/ansur_check.py)'},
 'greiner1991': {'name': 'Greiner 1991, Hand Anthropometry of U.S. Army Personnel, NATICK/TR-92/011, men (1987-88 sample)', 'n': 1003, 'hand_length_mm': 194.1, 'hand_breadth_mm': 90.4,
                 'url': 'https://apps.dtic.mil/sti/pdfs/ADA244533.pdf', 'method': 'right hand photographed palm down on a photobox, 64 dimensions digitised from the silhouette and palm photograph; 22 measured directly',
                 'status': 'verified in the primary (an OCR copy): the figures marked reads 2 were read twice with different wording'},
 'garrett1970': {'name': 'Garrett 1970, Anthropometry of the Hands of Male Air Force Flight Personnel, AMRL-TR-69-42', 'n': 148, 'hand_length_mm': 197.2, 'hand_breadth_mm': 89.6,
                 'url': 'https://apps.dtic.mil/sti/pdfs/AD0709883.pdf', 'method': 'direct: sliding calipers, tape, and a tracing of the hand on a data blank', 'status': 'verified in the primary (an OCR copy); reads as marked'},
 'bk2010': {'name': 'Buryanov & Kotiuk 2010, Proportions of Hand Segments, Int. J. Morphol. 28(3):755-758, Tables I and III', 'n': 66, 'url': 'https://www.scielo.cl/pdf/ijmorphol/v28n3/art15.pdf',
            'method': 'front-to-back X-rays of adults aged 19 to 78 (sex split not given), right hands, lengths between joint surfaces', 'status': 'verified: two reads'},
}
def kL(s): return REF['hand_length_mm'] / SURV[s]['hand_length_mm']
def kB(s): return REF['hand_breadth_mm'] / SURV[s]['hand_breadth_mm']

D = []   # key, name, survey, where, mean, sd, kind (L length / B breadth-depth), definition, reads, note
def add(key, name, s, where, mean, sd, kind, definition, reads=1, note='', rec=False, p5=None, p95=None):
    k = 1.0 if s == 'ansur2' else (kL(s) if kind == 'L' else kB(s))
    D.append({'key': key, 'name': name, 'survey': s, 'table_or_page': where, 'n': SURV[s]['n'], 'mean_mm': mean, 'sd_mm': sd, 'p5_mm': p5, 'p95_mm': p95,
              'scaled_to_reference_mm': round(mean * k, 1), 'scale_used': round(k, 4), 'scaled_by': 'none (the reference survey)' if s == 'ansur2' else ('hand length' if kind == 'L' else 'hand breadth'),
              'definition': definition, 'reads': reads, 'recommended': rec, 'note': note})

# ---- the hand
add('hand_length', 'Hand length', 'ansur2', 'dimension (44) HAND LENGTH', 193.28, 9.95, 'L', 'Stylion landmark on the wrist (the lowest point of the radius, about level with the wrist crease) to the tip of the middle finger; Poech sliding caliper; hand flat and straight, the fingers\' two end bones on a surface 8 mm above the table', 2, rec=True, p5=177.0, p95=210.0)
add('hand_length', 'Hand length', 'greiner1991', 'dimensions 58 (digitised: middle fingertip to the wrist-crease baseline) and 59 (measured: middle fingertip to stylion)', 194.1, 10.3, 'L', 'Middle fingertip to the wrist-crease baseline (the line through the ulnar and radial ends of the distal wrist crease); measured from the stylion it is the same 194.1 (SD 9.9)', 2)
add('hand_length', 'Hand length', 'garrett1970', 'dimension 1, p. 9', 197.2, 9.3, 'L', 'Wrist crease to the tip of the longest finger', 2)
add('palm_length', 'Palm length', 'ansur2', 'dimension (65) PALM LENGTH', 116.46, 6.23, 'L', 'Centre of the crease at the base of the middle finger to the ventral stylion landmark; Poech sliding caliper; forearm level, hand straight, palm up, fingers together, thumb held out about 45 deg', 1, rec=True,
    note='The reference survey\'s own. Greiner\'s is 6.5 mm shorter: the two surveys do not put the base crease in the same place (a finger\'s base crease is often double). Heights and tip-to-wrist-crease lengths do not depend on the crease.', p5=107.0, p95=127.0)
add('palm_length', 'Palm length', 'greiner1991', 'dimension 61', 110.5, 6.0, 'L', 'Base of the middle finger (point 9, the centre of the finger on its proximal flexion crease) to the wrist-crease baseline; from the photograph', 2)
add('hand_breadth', 'Hand breadth at the knuckles', 'ansur2', 'dimension (42) HAND BREADTH', 88.26, 4.39, 'B', 'Between the landmarks metacarpale II and metacarpale V (the outermost points of the index and little fingers\' knuckle joints); sliding caliper; palm on a table, fingers together, thumb held out', 2, rec=True, p5=81.0, p95=96.0)
add('hand_breadth', 'Hand breadth at the knuckles', 'greiner1991', 'dimension 63 (measured)', 90.4, 4.2, 'B', 'Between metacarpale II and metacarpale V, measured directly; the digitised silhouette (dimension 62, hand pressed on glass) is 95.3 (SD 5.8)', 2)
add('hand_breadth', 'Hand breadth at the knuckles', 'garrett1970', 'dimension 2, p. 10', 89.6, 4.0, 'B', 'Across the knuckle joints of digits II and V, hand extended palm down, thumb held away; sliding caliper', 2)
add('hand_circumference', 'Hand circumference at the knuckles', 'ansur2', 'dimension (43) HAND CIRCUMFERENCE', 212.28, 10.24, 'B', 'Tape passing over metacarpale II and metacarpale V; palm on a table, fingers together, thumb held out', 1, rec=True)
add('hand_thickness', 'Hand thickness at the middle finger\'s knuckle', 'garrett1970', 'dimension 8, p. 16', 32.9, 2.0, 'B', 'Hand extended; the greatest thickness of the knuckle (metacarpal-phalangeal) joint of digit III; sliding caliper', 2, rec=True, p5=29.8, p95=36.1)
add('thenar_depth', 'Hand depth at the thenar pad (the ball of the thumb)', 'garrett1970', 'dimension 9, p. 17', 61.2, 4.4, 'B', 'Greatest distance from the thenar pad to the back of the hand, the thumb lying beside the index; sliding caliper', 1, rec=True,
    note='UNVERIFIED: the page\'s mean and SD were unreadable in the scan; 61.2 is the median of its percentile table, 4.4 a rough SD. 5th percentile 55.0; the 95th printed as 70.2 in one place and 61.9 in another.', p5=55.0)
add('wrist_breadth', 'Wrist breadth', 'garrett1970', 'dimension 37, p. 27', 67.8, 3.7, 'B', 'Hand and wrist on the measuring board; sliding caliper at the wrist-crease baseline', 1, rec=True, p5=62.6, p95=73.3)
add('wrist_breadth', 'Wrist breadth', 'greiner1991', 'dimension 64', 65.8, 4.5, 'B', 'Between the ulnar (point 2) and radial (point 38) edges of the silhouette at the distal wrist crease', 1)
add('wrist_circumference', 'Wrist circumference', 'ansur2', 'public CSV column wristcircumference', 175.92, 8.96, 'B', 'Tape around the wrist at the stylion (definition page not read; Greiner: over the stylion, square to the forearm)', 1)

# ---- digit lengths, heights, crotches
for nm, key, g_len, g_h, g_tw, ga_len, ga_h, ga_tw in (
   ('Thumb', 'd1', (69.7, 4.8), (100.3, 7.4), (137.9, 8.7), (58.7, 4.5), (100.3, 9.2), (127.0, 11.3)),
   ('Index finger', 'd2', (75.3, 4.9), (180.0, 9.5), (185.2, 9.9), (75.3, 4.6), (183.2, 8.8), (185.2, 8.8)),
   ('Middle finger', 'd3', (83.8, 5.4), (194.1, 10.3), (194.5, 10.3), (85.7, 5.1), (195.2, 9.2), (195.2, 9.2)),
   ('Ring finger', 'd4', (79.2, 5.2), (180.2, 10.1), (185.0, 10.2), (80.5, 4.7), (182.0, 8.9), (187.2, 9.1)),
   ('Little finger', 'd5', (64.7, 4.9), (145.4, 9.4), (159.9, 9.8), (61.4, 4.7), (146.0, 8.0), (166.1, 9.1))):
    base = 'the proximal flexion crease of the thumb\'s knuckle (point 4)' if key == 'd1' else 'the centre of the finger on its proximal flexion crease, the crease at its base'
    add(key + '_length_from_crease', nm + ' length from its base crease', 'greiner1991', 'dimensions 1, 10, 22, 34, 46', g_len[0], g_len[1], 'L', 'Tip of the digit to ' + base + '; from the palm photograph', 2 if key in ('d3', 'd4', 'd5') else 1, rec=True)
    add(key + '_length_to_crotch', nm + ' length, fingertip to crotch level', 'garrett1970', 'dimensions 47 to 51, p. 37 to 41', ga_len[0], ga_len[1], 'L', 'Fingertip to the level of the crotch (the web) beside it, along the digit\'s axis; from the tracing on the data blank', 2 if key in ('d1', 'd2', 'd3') else 1, rec=True,
        note=('The page prints 2.31 in and 5.67 cm, which disagree; 58.7 mm is the inch value, which also sits mid-way between the 5th and 95th percentiles (50.7 and 65.7). ' if key == 'd1' else '') + 'Which crotch: for the middle and ring fingers the figures fit the mean of the two neighbouring crotches, for the index crotch 2, for the little finger crotch 4 (inferred from the heights, not read).')
    add(key + '_tip_height', nm + ' tip height above the wrist crease', 'greiner1991', 'dimensions 2, 11, 23, 35, 47', g_h[0], g_h[1], 'L', 'Perpendicular distance from the tip of the digit to the wrist-crease baseline; hand flat, palm down, as photographed', 2 if key != 'd1' else 1, rec=True)
    add(key + '_tip_height', nm + ' tip height above the wrist crease', 'garrett1970', 'dimensions 38 to 42, p. 28 to 32', ga_h[0], ga_h[1], 'L', 'Perpendicular distance from the wrist-crease baseline (tangent to the near edge of the thenar and hypothenar pads) to the middle of the fingertip; from the tracing', 1)
    add(key + '_tip_to_wrist_crease', nm + ' tip to the wrist crease along the digit', 'greiner1991', 'dimensions 3, 12, 24, 36, 48', g_tw[0], g_tw[1], 'L', 'Tip of the digit to the wrist-crease baseline, measured along the digit\'s central axis; hand flat, as photographed', 2 if key != 'd1' else 1, rec=(key != 'd1'),
        note='For the thumb this depends on how far the thumb is held out (about 43 deg from the hand\'s line in Greiner\'s photographs, derived from height / length); Garrett\'s tracings give 127.0. Use the thumb tip\'s height (100.3 in both surveys) and the stylion-to-thumb-tip length instead.' if key == 'd1' else '')
    add(key + '_tip_to_wrist_crease', nm + ' tip to the wrist crease along the digit', 'garrett1970', 'dimensions 52 to 56, p. 42 to 46', ga_tw[0], ga_tw[1], 'L', 'Tip to the wrist-crease baseline along the digit', 2 if key in ('d1', 'd2', 'd3') else 1)
for i, (g, ga) in enumerate((((69.1, 4.7), (68.1, 6.0)), ((110.4, 6.1), (110.5, 6.0)), ((109.9, 6.4), (108.7, 5.8)), ((96.6, 6.2), (97.2, 5.1))), 1):
    add('crotch%d_height' % i, 'Crotch %d height (the web between digits %d and %d) above the wrist crease' % (i, i, i + 1), 'greiner1991', 'dimensions 69 to 72', g[0], g[1], 'L', 'Perpendicular distance from the deepest point of the web between the two digits to the wrist-crease baseline; hand flat, fingers as photographed', 1, rec=True)
    add('crotch%d_height' % i, 'Crotch %d height above the wrist crease' % i, 'garrett1970', 'dimensions 43 to 46, p. 33 to 36', ga[0], ga[1], 'L', 'The same, from the tracing', 2)
add('wrist_to_thumb_tip', 'Wrist (stylion) to the thumb\'s tip', 'greiner1991', 'dimension 68', 124.5, 6.8, 'L', 'Stylion landmark to the tip of digit 1; sliding caliper, straight line', 1, rec=True)
add('wrist_to_index_tip', 'Wrist (stylion) to the index fingertip', 'greiner1991', 'dimension 67', 181.0, 9.1, 'L', 'Stylion landmark to the tip of digit 2; sliding caliper, straight line', 1, rec=True)

# ---- breadths and depths at the joints
for nm, key, pb, pd_, db, dd, gp, gd in (('Index finger', 'd2', (21.5, 1.3), (19.4, 1.2), (18.4, 1.2), (15.5, 1.3), 23.0, 20.1), ('Middle finger', 'd3', (21.8, 1.4), (20.1, 1.4), (18.4, 1.2), (16.0, 1.3), 22.5, 19.8),
                                           ('Ring finger', 'd4', (20.2, 1.3), (18.9, 1.3), (17.2, 1.1), (15.1, 1.3), 21.4, 18.5), ('Little finger', 'd5', (17.7, 1.4), (16.7, 1.2), (15.7, 1.2), (13.7, 1.3), 19.2, 17.4)):
    r = 2 if key == 'd2' else 1
    add(key + '_pip_breadth', nm + ' breadth at its middle joint', 'garrett1970', 'dimensions 16 to 36, p. 19 to 26', pb[0], pb[1], 'B', 'Greatest breadth of the joint; sliding caliper, finger free', r, rec=True)
    add(key + '_pip_depth', nm + ' depth at its middle joint', 'garrett1970', 'dimensions 16 to 36, p. 19 to 26', pd_[0], pd_[1], 'B', 'Greatest depth (back to pad) of the joint; sliding caliper', r, rec=True)
    add(key + '_dip_breadth', nm + ' breadth at its tip joint', 'garrett1970', 'dimensions 13 to 33, p. 19 to 25', db[0], db[1], 'B', 'Greatest breadth of the joint; sliding caliper, finger free', r, rec=True)
    add(key + '_dip_depth', nm + ' depth at its tip joint', 'garrett1970', 'dimensions 13 to 33, p. 19 to 25', dd[0], dd[1], 'B', 'Greatest depth of the joint; sliding caliper', r, rec=True)
    add(key + '_pip_breadth', nm + ' breadth at its middle joint, silhouette', 'greiner1991', 'dimensions 13, 25, 37, 49', gp, None, 'B', 'Between the silhouette\'s edges at the joint crease, the hand pressed palm down on the photobox (so wider than a free finger)', 1)
    add(key + '_dip_breadth', nm + ' breadth at its tip joint, silhouette', 'greiner1991', 'dimensions 15, 27, 39, 51', gd, None, 'B', 'As above, at the tip joint\'s crease', 1)
add('d1_ip_breadth', 'Thumb breadth at its tip joint', 'garrett1970', 'dimension 10, p. 18', 22.9, 1.3, 'B', 'Greatest breadth of the thumb\'s tip (interphalangeal) joint; sliding caliper', 2, rec=True)
add('d1_ip_depth', 'Thumb depth at its tip joint', 'garrett1970', 'dimension 11, p. 18', 20.2, 1.5, 'B', 'Greatest depth of the thumb\'s tip joint; sliding caliper', 2, rec=True)
add('d1_ip_breadth', 'Thumb breadth at its tip joint', 'greiner1991', 'dimension 4 (measured directly, "Thumb Breadth")', 24.0, 1.3, 'B', 'Measured directly with a caliper at the thumb\'s tip joint', 2)

rec = {}
for d in D:
    if d['recommended']: rec[d['key']] = {'mm': d['scaled_to_reference_mm'], 'sd_mm': d['sd_mm'], 'survey': d['survey'], 'raw_mean_mm': d['mean_mm']}

# ---- bones
BK = {'thumb': {'metacarpal': (46.22, 3.94), 'proximal': (31.57, 3.13), 'distal': (21.67, 1.60), 'tip_soft_tissue': (5.67, 0.61)},
      'index': {'metacarpal': (68.12, 6.27), 'proximal': (39.78, 4.94), 'middle': (22.38, 2.51), 'distal': (15.82, 2.26), 'tip_soft_tissue': (3.84, 0.59)},
      'middle': {'metacarpal': (64.60, 5.38), 'proximal': (44.63, 3.81), 'middle': (26.33, 3.00), 'distal': (17.40, 1.85), 'tip_soft_tissue': (3.95, 0.61)},
      'ring': {'metacarpal': (58.00, 5.06), 'proximal': (41.37, 3.87), 'middle': (25.65, 3.29), 'distal': (17.30, 2.22), 'tip_soft_tissue': (3.95, 0.60)},
      'little': {'metacarpal': (53.69, 4.36), 'proximal': (32.74, 2.77), 'middle': (18.11, 2.54), 'distal': (15.96, 2.45), 'tip_soft_tissue': (3.73, 0.62)}}
S = 1.052
bones = {f: {b: {'raw_mean_mm': v[0], 'raw_sd_mm': v[1], 'scaled_mm': round(S * v[0], 1)} for b, v in d.items()} for f, d in BK.items()}
web_pct = {'index': 15.52, 'middle': 15.33, 'ring': 18.49, 'little': 24.72}
web = {}
for f, pct in web_pct.items():
    tot = sum(BK[f][b][0] for b in ('proximal', 'middle', 'distal', 'tip_soft_tissue')); de = tot / (1 + pct / 100); web[f] = {'percent_of_finger_from_web_to_tip': pct, 'finger_from_web_to_tip_raw_mm': round(de, 1), 'joint_behind_web_raw_mm': round(pct / 100 * de, 1), 'joint_behind_web_scaled_mm': round(S * pct / 100 * de, 1)}
links = {}
for f in ('index', 'middle', 'ring', 'little'):
    b = BK[f]; links[f] = {'knuckle_centre_to_middle_joint_centre_mm': round(S * b['proximal'][0] + 3.0, 1), 'middle_joint_centre_to_tip_joint_centre_mm': round(S * b['middle'][0] + 1.2, 1),
                           'tip_joint_centre_to_skin_tip_mm': round(S * (b['distal'][0] + b['tip_soft_tissue'][0]) + 2.8, 1)}

out = {
 'about': 'Sizes of a man\'s hand for fitting the drawn hand of "Shape, by gradient descent" to the deck\'s reference hand, the ANSUR II men\'s mean (193.3 mm). Written by RA, 2026-11-09, for the drawing agent. Lengths in mm. '
          'Each outside dimension carries its survey, page, n, mean, SD, the survey\'s own definition, how many separately worded reads of the primary agreed (reads), and its value scaled to the reference hand. '
          'recommended_targets holds one value per dimension. Provisional or unverified values say so in their note or status.',
 'reference_hand': dict(REF, source='ANSUR II men, n 4,082', sd_mm={'hand_length': 9.95, 'palm_length': 6.23, 'hand_breadth': 4.39}),
 'scaling': {'rule': 'value x (193.28 / the survey\'s mean hand length) for lengths; value x (88.26 / the survey\'s mean hand breadth) for breadths, depths and thicknesses',
             'factors': {s: {'lengths': round(kL(s), 4), 'breadths_and_depths': round(kB(s), 4)} for s in ('greiner1991', 'garrett1970')},
             'recommendation': 'Use the scaled values (scaled_to_reference_mm, and recommended_targets). Greiner\'s hands are 0.4 % longer than the reference and Garrett\'s 2.0 % longer: scaling moves Greiner\'s figures by under 1 mm and Garrett\'s by up to 4 mm (its fingertip heights).'},
 'surveys': SURV,
 'outside_dimensions': D,
 'recommended_targets': rec,
 'how_to_measure_the_model': [
   'Lay the hand flat, palm down, fingers straight and together as far as they go, thumb held out. Draw the wrist-crease baseline: the line across the palm side at the distal wrist crease (through its ulnar and radial ends), square to the middle finger.',
   'Heights are perpendicular to that baseline; tip-to-wrist-crease lengths run along each digit\'s own axis to the baseline; crotch heights go to the deepest point of each web.',
   'Hand length: baseline (stylion level) to the middle fingertip. Hand breadth: across the outermost points of the index and little fingers\' knuckle joints, thumb out of the way. Hand thickness: back to palm at the middle finger\'s knuckle.',
   'Joint breadths and depths: the greatest breadth (side to side) and depth (back to pad) at each joint, finger free, not pressed flat.'],
 'not_found': {'hand_breadth_across_the_thumb': 'Not in Greiner 1991 or Garrett 1970. White 1980 (NATICK/TR-81/010, "hand breadth at thumb", measured at the thumb\'s first joint) has it, but its tables were unreadable in the scan.',
               'hand_thickness_in_ansur': 'ANSUR II and Greiner did not measure hand thickness; Garrett 1970 is the source.',
               'fingertip_and_nail_sizes': 'Not re-read in this pass. The film\'s finger (deck/src/06-motion.js) records, unverified here: AIST Japanese men (Kouchi 2012, n 327) index breadth at the tip joint 15.6, at mid-nail 13.9, depth at the tip joint 13.0, nail base to fingertip 14.2, nail breadth 10.9; thumb joint breadth 20.1, depth 17.3, nail base to tip 15.7, nail breadth 14.7; Ha et al. 2015 men\'s index nail 12.3 wide x 13.0 long, thumb 15.2 x 14.7. '
                                           'Against these, U.S. Air Force men measure 18.4 mm across and 15.5 mm deep at the index\'s tip joint and 22.9 by 20.2 at the thumb\'s (Garrett 1970, above): the Japanese figures are about 15 % slimmer.'},
 'bones': {'source': SURV['bk2010'], 'scale_to_reference_hand': S,
           'scale_note': 'The study\'s 1.052. Re-derived three ways it comes out between 1.04 and 1.09 (scripts/sizes.py): stylion to the middle fingertip = carpus about 26 mm + metacarpal + three bones + tip gives 1.066; Greiner\'s middle finger over this sample\'s gives 1.047. Status: derived; the sample\'s own hand length was not published.',
           'lengths_between_joint_surfaces_mm': bones,
           'status': 'raw lengths verified (two reads of Table I); scaled values derived'},
 'joint_centres_under_the_skin': {
   'knuckle_joint_behind_the_web': {'what': 'how far each finger\'s knuckle joint lies toward the wrist from the web beside it, on the X-rays', 'values': web, 'source': 'Buryanov & Kotiuk 2010, Table III (per cent of the finger\'s length from the web to the skin\'s tip; the mm are derived). The thumb\'s was not measured.', 'status': 'verified (two reads); mm derived'},
   'knuckle_joint_behind_the_base_crease_mm': {'range': [14.4, 19.6], 'source': 'Bugbee & Botte 1993, as cited through Doyle & Botte 2003 in Kosif et al. 2015 (Int. J. Morphol. 33(1):173-177)', 'status': 'partly verified (secondary)',
                                                'note': 'The crease at a finger\'s base lies about mid-way along its first bone, not over the knuckle.'},
   'middle_joint_beyond_its_crease_mm': {'range': [1.6, 2.6], 'source': 'the same', 'status': 'partly verified (two secondaries)'},
   'tip_joint_beyond_its_crease_mm': {'range': [7.0, 7.8], 'source': 'the same', 'status': 'partly verified (two secondaries)'},
   'thumb': {'tip_joint_beyond_its_crease_mm': 2.2, 'knuckle_crease': 'over the joint', 'source': 'the same', 'status': 'partly verified (secondary)'},
   'centre_of_rotation_behind_the_joint_line_mm': {'knuckle': 6.5, 'middle_joint': 4.0, 'tip_joint': 2.8, 'status': 'ESTIMATE (the rounded head of the bone before the joint; not read in a source in this pass); range +/- 1 mm'},
   'links_between_joint_centres_mm': {'values': links, 'status': 'derived from the scaled bones and the estimate above', 'check': 'Open hand models, joint centre to joint centre: MyoHand index 42.6 / 25.1, middle 44.7 / 29.1, ring 40.4 / 24.9, little 36.1 / 21.0 (a hand of about 185 to 190 mm); one specimen of 203 mm (Goislard de Monsabert 2018): index 48.2 / 28.4'},
   'knuckle_joint_lines_above_the_wrist_crease_mm': {'index': 96.4, 'middle': 97.2, 'ring': 89.8, 'little': 77.9, 'centres': 'about 6.5 mm nearer the wrist: 89.9, 90.7, 83.3, 71.4',
        'how': 'Greiner\'s tip heights less each finger\'s scaled bones and tip, along the finger\'s own axis (scripts/sizes.py)', 'status': 'derived; the little finger\'s is the least sure (+/- 4 mm)'},
   'knuckles_behind_the_middle_fingers_mm': {'recommended': {'index': 0.0, 'ring': 5.0, 'little': 13.0}, 'range': {'index': [-1.3, 0.9], 'ring': [3.0, 7.4], 'little': [12.8, 18.9]},
        'sources': {'Goislard de Monsabert 2018 specimen, scaled': {'index': 0.8, 'ring': 4.7, 'little': 13.4}, 'MyoHand model': {'index': -1.3, 'ring': 3.0, 'little': 12.8}, 'Greiner + Buryanov (derived)': {'index': 0.7, 'ring': 7.4, 'little': 18.9}}},
   'knuckles_toward_the_palm_from_the_middle_fingers_mm': {'ring': [4.6, 6.0], 'little': [9.1, 14.1], 'note': 'the arch across the knuckles: specimen, then MyoHand'},
   'knuckle_centres_side_to_side': 'Index to little finger knuckle centres about 66 mm apart for the mean hand (the specimen\'s 69.6 mm at 203 mm), so each sits about 11 mm inside the skin of an 88.3 mm hand. Derived.',
   'knuckle_centre_depth': 'The hand is 32.9 mm thick at the middle knuckle (Garrett); the joint\'s centre is near mid-thickness, about 14 mm under the back\'s skin. ESTIMATE.'},
 'thumb': {
   'outside': {'length_from_its_knuckle_crease_mm': {'greiner1991': 69.7, 'scaled': round(69.7 * kL('greiner1991'), 1), 'check': 'Kosif et al. 2015, 56 right-handed Turkish men, crease to crease plus crease to tip: 34.97 + 34.42 = 69.4'},
               'fingertip_to_crotch_level_mm': {'garrett1970': 58.7, 'scaled': round(58.7 * kL('garrett1970'), 1), 'status': 'the page\'s cm figure (5.67) disagrees with its inch figure (2.31 = 5.87 cm); the inch figure is used'},
               'tip_height_above_wrist_crease_mm': {'greiner1991': 100.3, 'garrett1970': 100.3, 'scaled': round(100.3 * kL('greiner1991'), 1), 'note': 'thumb held out as photographed; both surveys give 100.3'},
               'stylion_to_tip_mm': {'greiner1991': 124.5, 'scaled': round(124.5 * kL('greiner1991'), 1)},
               'crotch_1_height_mm': {'greiner1991': 69.1, 'garrett1970': 68.1, 'scaled': round(69.1 * kL('greiner1991'), 1)},
               'tip_joint_breadth_mm': {'garrett1970': 22.9, 'greiner1991_direct': 24.0, 'scaled': round(22.9 * kB('garrett1970'), 1)}, 'tip_joint_depth_mm': {'garrett1970': 20.2, 'scaled': round(20.2 * kB('garrett1970'), 1)},
               'tip_soft_tissue_beyond_the_bone_mm': {'bk2010': 5.67, 'scaled': round(5.67 * S, 1)}},
   'bones_between_joint_surfaces_mm': bones['thumb'],
   'links_between_joint_centres_mm': {'base_to_knuckle': 37.0, 'knuckle_to_tip_joint': 35.0, 'tip_joint_to_skin_tip': 32.0, 'ranges': {'base_to_knuckle': [36, 39], 'knuckle_to_tip_joint': [31, 36], 'tip_joint_to_skin_tip': [30, 33]},
        'sources': 'Base to knuckle: 38.6 mm in the one specimen (hand 203 mm), 35.9 mm in the MyoHand model. Knuckle to tip joint: MyoHand 31.1; the scaled bone 33.2 plus about 2. Tip joint to skin: scaled bone 22.8 + about 3 + 6.0 of soft tissue; Kosif\'s crease-to-tip 34.4 less the crease\'s 2.2.',
        'status': 'PROVISIONAL: two sources for the first link, derived for the others',
        'for_the_drawing': 'The whole first bone is 46 to 49 mm between its joint surfaces, but the base joint turns about a centre inside the bone\'s near end, so between joint centres the first link is 36 to 39 mm. A model whose thumb joints are joint centres should have a first link of about 37 mm, not 46.9: stretching it to 46.9 makes the thumb about 10 mm too long and pushes it outward.'},
   'base_centre_relative_to_the_index_knuckle_centre_mm': {'behind': 56.0, 'toward_the_palm': 11.5, 'toward_the_thumb_side': 5.0, 'ranges': {'behind': [53, 66], 'toward_the_palm': [10, 13], 'toward_the_thumb_side': [3, 8]},
        'sources': {'Goislard de Monsabert 2018, one specimen, hand 203 mm (means of its two axis points; position variation 7 and 14 mm)': {'behind': 56.0, 'toward_the_palm': 9.9, 'toward_the_thumb_side': 2.6, 'scaled_behind': 53.3},
                    'MyoHand model (MyoHub/myo_sim; hand about 185 to 190 mm)': {'behind': 58.0, 'toward_the_palm': 13.1, 'toward_the_thumb_side': 8.1}}, 'status': 'two sources agree; hand.py\'s 53.2 mm (0.275 hand lengths) and 10 mm stand within them'},
   'base_centre_relative_to_the_wrist': {'beyond_the_wrists_centre_mm': [24.8, 25.7], 'toward_the_thumb_side_of_it_mm': [25.5, 31.8], 'beyond_the_wrist_crease_mm': 'about 33 to 35 (ESTIMATE: the wrist\'s centre lies 8 to 10 mm beyond the crease; 8.4 in the specimen)',
        'index_knuckle_centre_beyond_the_wrists_centre_mm': [81.6, 82.8]},
   'knuckle_and_tip_joint_in_the_models_neutral_poses_mm': {'note': 'Pose-dependent: each source\'s own neutral pose, thumb held a little out. Axes: ahead (+) or behind (-) the index knuckle along the hand, toward the thumb side, toward the palm.',
        'thumb_knuckle': {'specimen': [-23.5, 21.5, 19.0], 'MyoHand': [-30.0, 23.5, 29.3]}, 'thumb_tip_joint': {'specimen': [8.2, 41.3, -0.1], 'MyoHand': [-5.0, 36.5, 42.6]},
        'first_bone_direction': {'specimen': '30 deg toward the thumb side, 14 deg toward the palm', 'MyoHand': '29 deg toward the thumb side, 27 deg toward the palm'}},
   'relaxed': {
        'knuckle_options_deg': {
             '39': {'status': 'MEASURED, reference not defined', 'rests_on': 'K.-S. Lee and M.-C. Jung, "Flexion and Extension Angles of Resting Fingers and Wrist", Int. J. Occupational Safety and Ergonomics 20(1):91-101 (2014), Table 3, forearm neutral: 39 (SD 12), 40 relaxed hands (20 men, 20 women), 4 mm markers on the skin of the back of the thumb, Vicon. The paper does not say what line the angle is measured from.', 'reads': 2},
             '25': {'status': 'ESTIMATE', 'rests_on': '39 less the over-read of skin markers, 6 to 24 deg, which gives 15 to 33 deg; 25 is near its middle. How the over-read was got: marker_over_read below.'},
             '12.5': {'status': 'DESCRIBED, not measured', 'rests_on': 'W. P. Cooney III, M. J. Lucca, E. Y. S. Chao and R. L. Linscheid, "The kinesiology of the thumb trapeziometacarpal joint", J. Bone Joint Surg. 63-A(9):1371-1381 (1981): the rest position of their 19 adults (9 men, 10 women, mean age 26) is described as the thumb against the thumb side of the index finger\'s end bone, as for a key pinch, with the knuckle and the tip joint each flexed 10 to 15 deg. No mean, no SD, no table: it describes the pose, it is not a result. Only the base joint was measured at rest, from metal markers taped to the skin and seen on two-plane X-rays.', 'reads': 3}},
        'tip_joint_deg': {'value': 10, 'status': 'MEASURED, three sources', 'rests_on': 'Lee & Jung 2014, Table 3: 10 (SD 6), 40 hands, skin markers. M. S. Rogers, A. B. Barr, B. Kasemsontitum and D. M. Rempel, "A three-dimensional anthropometric solid model of the hand based on landmark measurements", Ergonomics 51(4):511-526 (2008), Table 4, 100 hands, landmarks on the palm side: 6.0 (SD 14.8) relaxed round a large ball, 17.1 (SD 16.2) holding a mouse. Cooney 1981 describes 10 to 15.'},
        'base_joint_deg': {'first_bone_on_the_trapezium': {'flexion': [20.5, 10], 'adduction': [23.2, 5], 'pronation': [13.6, 9], 'format': '[mean, SD]', 'n': 19, 'source': 'Cooney et al. 1981, Table III, rest position; from skin-taped markers on two-plane X-rays', 'reads': 2},
                           'trapezium_to_third_metacarpal': {'flexion': 46, 'abduction': 35, 'pronation': 82, 'medians': [48, 38, 80], 'n': '10 cadaver hands', 'source': 'Cooney et al. 1981, Table I', 'reads': 2},
                           'markers': {'value': [45, 12], 'format': '[mean, SD]', 'source': 'Lee & Jung 2014, Table 3, "CMC"; what it is measured from is not stated (most likely the first bone\'s tilt out of the plane of the palm)', 'status': 'verified figure, meaning unverified'}},
        'marker_over_read': {'fingers_deg': [4, 5], 'fingers_source': 'J. R. Cook, N. A. Baker, R. Cham, E. Hale and M. S. Redfern, "Measurements of wrist and finger postures: a comparison of goniometric and motion capture techniques", J. Appl. Biomech. 23(1):70-78 (2007), Table 2: 5 people, 4 mm markers; at about 30 deg the markers read the index knuckle 4.1 deg (SD 4.6) and the middle knuckle 4.6 deg (SD 4.8) more flexed than a goniometer; the middle joints within 2 deg.',
                             'thumb_knuckle_deg': [6, 24], 'thumb_status': 'ESTIMATE by geometry, not a measurement',
                             'how': 'A marker sits on the skin, above the bone. The line from one marker to the next is not the bone\'s line when the two markers stand at different heights above the bones\' axes. Heights taken: thumb knuckle 14 mm (half of a knuckle about 24 mm deep, plus the marker\'s 2 mm), tip joint 12 mm (half of 20.2 mm, Garrett 1970, plus 2). Across the second link (35 mm) the marker line drops atan(2 / 35) = 3 deg. Across the first link (37 mm) it rises atan((14 - h) / 37), h the height of the "virtual marker" at the thumb\'s base, which the paper does not give: 21 deg if it sits at the joint\'s centre (h 0), 3 deg if at skin height (h 12). A straight thumb would then read 6 to 24 deg bent at the knuckle.'},
        'holding_a_mouse': {'source': 'Rogers et al. 2008 (above); 100 hands of mean length 178.1 mm', 'thumb_tip_joint_flexion_deg': [17.1, 16.2], 'thumb_pad_centre_to_index_pad_centre_mm': [60.1, 10.6],
             'scaled_to_reference_mm': [65.2, 11.5], 'index_pad_to_middle_pad_mm': [21, 3], 'status': 'verified (two reads); not a rest pose'},
        'not_reached': 'D. D. Palande and S. G. Gilbie, "The deformity of thumb in ulnar paralysis" (1981, pp. 152-9, ISSN 0024-1024) measured the knuckle and tip joint of 25 normal thumbs at rest as controls; the figures are not in the abstract and the full text could not be reached. It would settle the knuckle. A 2024 paper, Indian J Plast Surg 57(4):248-255 (doi 10.1055/s-0044-1788593), found by a search on the resting cascade, could not be opened either.',
        'where_the_tip_lies': {'cooney_1981': 'the thumb\'s pulp against the thumb side of the index\'s end bone, at its middle (a posed rest)',
             'derived_for_the_studys_hand': 'With the fingers at the study\'s rest angles (index 29 / 29 / 10 deg), links 37 / 35 / 32 mm and the base 56 mm behind, 11.5 mm toward the palm and 5 mm toward the thumb side of the index knuckle, the thumb\'s skin tip reaches the thumb side of the index\'s MIDDLE bone: about half-way along it with the knuckle at 12.5 deg, two-fifths with 25 deg, one-fifth with 39 deg. It does not reach the index\'s end bone unless the fingers are curled more (40 deg or more at their knuckles).',
             'status': 'DERIVED, provisional'},
        'for_the_slide_source_line': 'Thumb knuckle: 39 deg, Lee & Jung 2014 (skin markers, 40 hands; reference line not defined); 10 to 15 deg as described for the resting thumb by Cooney et al. 1981 (not measured). Thumb tip joint: 10 deg, Lee & Jung 2014; 6 deg and 17 deg in Rogers et al. 2008 (100 hands).'}},
 'changes': ['2026-11-09 20:58 first issue (RA).', '2026-11-09 21:07 thumb at rest corrected: Cooney 1981\'s 10 to 15 deg is a description of a posed rest position, not an X-ray measurement (third read); the tip joint is 10 deg (measured), the knuckle is open between 39 (measured, reference undefined), 25 (estimate) and 12.5 (described); citations for the slide added; Garrett 1970\'s full table of joint breadths and depths had already been added.'],
}
p = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'hand-sizes.json')
json.dump(out, open(p, 'w'), indent=1, ensure_ascii=False)
print('wrote', os.path.abspath(p), len(D), 'dimension rows,', len(rec), 'recommended targets')
for k, v in rec.items(): print('  %-28s %6.1f mm  (%s, raw %.1f)' % (k, v['mm'], v['survey'], v['raw_mean_mm']))
