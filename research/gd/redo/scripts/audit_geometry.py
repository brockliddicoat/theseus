"""Q7, step 2: what the stored result is, measured directly from its arcs (no descent). Reads the deck's own
deck/tools/gd/out/longarcs.json and the untouched model copy. Prints, and writes research/gd/redo/out/audit_geometry.json.

  1. every arc of every trial's outline and section, with its length and radius (degenerate arcs flagged)
  2. trial 3 against the untouched Sora V2: where the outline and the section differ, and by how much
  3. the turn of the surface along each finger's own slide (the felt rule as written), on the Sora and on each trial
  4. the slope under each finger at its grip rest, and how far it rests from its valley's bottom
Run: python3 research/gd/redo/scripts/audit_geometry.py
"""
import json, os, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, '..'))
sys.path.insert(0, os.path.join(ROOT, 'model'))
import longarcs as LA, arcs as A
STORED = json.load(open(os.path.abspath(os.path.join(ROOT, '..', '..', '..', 'deck', 'tools', 'gd', 'out', 'longarcs.json'))))
DEG = 180 / np.pi
PLAN_NAMES = ['nose 1', 'nose 2', 'nose 3', 'front F', 'waist W', 'hump H', 'rear corner C', 'tail tip']
SEC_NAMES = ['inner crown I', 'groove G', 'shoulder S', 'shoulder corner K', 'wall 1', 'wall 2', 'wall 3']

def arc_table(arcs, p0, th0, names):
    C = A.chain(p0, th0, [tuple(a) for a in arcs], ds=0.02); rows = []
    for i, (L, ph) in enumerate(arcs):
        m = C['i'] == i; R = L / ph if abs(ph) > 1e-9 else float('inf')
        rows.append({'arc': names[i], 'L_mm': round(L, 2), 'turn_deg': round(ph * DEG, 2), 'R_mm': round(R, 2), 'deg_per_mm': round(abs(ph) * DEG / L, 2),
                     'from': [round(float(C['x'][m][0]), 2), round(float(C['y'][m][0]), 2)], 'to': [round(float(C['x'][m][-1]), 2), round(float(C['y'][m][-1]), 2)]})
    return rows

def side_u(arcs):
    """the side as u(z) between the tail and the nose corner (the outline's outer branch), and its tangent angle"""
    C = A.chain(LA.P0, LA.TH0, [tuple(a) for a in arcs], ds=0.02)
    m = (C['x'] > 15) & (C['y'] > -52) & (C['y'] < float(LA.P3[1]) + 0.5); z, u = C['y'][m], C['x'][m]; o = np.argsort(z); z, u = z[o], u[o]
    zz = np.arange(-50.0, float(LA.P3[1]), 0.05); uu = np.interp(zz, z, u); return zz, uu
def turn_along(zz, uu, a, b):
    """net turn and total variation of the tangent (deg) from z = a to z = b; + = concave (a valley)"""
    sl = np.gradient(uu, zz); th = np.arctan(sl); m = (zz >= min(a, b)) & (zz <= max(a, b))
    t = th[m]; return float((t[-1] - t[0]) * DEG), float(np.abs(np.diff(t)).sum() * DEG)
def slope_at(zz, uu, z0):
    sl = np.gradient(uu, zz); return float(np.arctan(np.interp(z0, zz, sl)) * DEG)

out = {}
# ---- 1. arcs
out['arcs'] = {'sora': {'plan': arc_table(LA.PA, LA.P0, LA.TH0, PLAN_NAMES), 'sec': arc_table(LA.SA, LA.S0, LA.STH0, SEC_NAMES)}}
for k, t in STORED['trials'].items():
    out['arcs'][k] = {'planL': arc_table(t['end']['planL'], LA.P0, LA.TH0, PLAN_NAMES), 'planR': arc_table(t['end']['planR'], LA.P0, LA.TH0, PLAN_NAMES),
                      'sec': arc_table(t['end']['sec'], LA.S0, LA.STH0, SEC_NAMES)}
print('1. ARCS (length mm, turn deg, radius mm)')
for k in out['arcs']:
    for part, rows in out['arcs'][k].items():
        print('  %-11s %-5s ' % (k, part) + ' | '.join('%s %.1f/%.0f' % (r['arc'].split()[-1], r['L_mm'], r['R_mm']) for r in rows[:4] if part == 'sec') if part == 'sec'
              else '  %-11s %-5s ' % (k, part) + ' | '.join('%s %.1f/%.0f' % (r['arc'].split()[-1], r['L_mm'], r['R_mm']) for r in rows[3:7]))
flags = []
for k in out['arcs']:
    for part, rows in out['arcs'][k].items():
        for r in rows:
            if abs(r['R_mm']) < 2.5 or (r['L_mm'] < 5 and r['arc'] in ('hump H', 'shoulder S', 'waist W', 'front F', 'groove G')): flags.append((k, part, r['arc'], r['L_mm'], r['R_mm'], r['deg_per_mm'], r['from'], r['to']))
out['degenerate'] = flags
print('  degenerate arcs (a long arc under 5 mm, or any radius under 2.5 mm):')
for f in flags: print('   ', f)

# ---- 2. trial 3 against the untouched Sora
T3 = STORED['trials']['lifted_sym']; zs, us = side_u(LA.PA); zt, ut = side_u(T3['end']['planL'])
d = ut - us; i = int(np.argmax(np.abs(d)))
stations = [-45, -40, -30, -26, -20, -10, -3.8, 0, 3.9, 10.1, 20, 26, 30, 35, 40]
out['trial3_vs_sora'] = {'half_width_diff_mm': {str(s): round(float(np.interp(s, zs, d)), 3) for s in stations}, 'max_abs_half_width_diff_mm': round(float(abs(d[i])), 3), 'at_z': round(float(zs[i]), 1),
                         'rms_half_width_diff_mm': round(float(np.sqrt(np.mean(d ** 2))), 3), 'normal_dev_max_mm': T3['end']['dev']['plan'],
                         'sora': {'waist': dict(zip(('c', 'd', 'zc', 'a_deg', 'uh'), [round(float(v), 3) for v in STORED['sora']['plan_params']])), 'R_waist': STORED['sora']['R_waist'], 'side': STORED['sora']['side']},
                         'trial3': {'waist': dict(zip(('c', 'd', 'zc', 'a_deg', 'uh'), [round(float(v), 3) for v in T3['final'][:5]])), 'R_waist': T3['end']['R']['thumb'], 'side': T3['end']['thumb']}}
print('\n2. TRIAL 3 AGAINST THE SORA: half-width difference u_trial - u_sora (mm) at z:')
print('   ' + '  '.join('%g: %+.2f' % (s, np.interp(s, zs, d)) for s in stations))
print('   max |diff| %.3f mm at z %.1f; rms %.3f mm; the stored normal distance (dev.plan) %.3f mm' % (abs(d[i]), zs[i], np.sqrt(np.mean(d ** 2)), T3['end']['dev']['plan']))
ws = [(-40, 'rear'), (-26, 'hump'), (3.9, 'waist bottom, trial'), (10.1, 'waist bottom, Sora'), (26, 'front crest'), (35, 'front')]
print('   full widths (mm), Sora -> trial 3: ' + '; '.join('%s z %g: %.2f -> %.2f' % (nm, z, 2 * np.interp(z, zs, us), 2 * np.interp(z, zt, ut)) for z, nm in ws))
# section
def sec_y(arcs):
    C = A.chain(LA.S0, LA.STH0, [tuple(a) for a in arcs], ds=0.01); m = C['y'] > 12; u, y = C['x'][m], C['y'][m]; o = np.argsort(u); return u[o], y[o]
u0, y0 = sec_y(LA.SA); u1, y1 = sec_y(T3['end']['sec']); uu = np.arange(0.0, 29.5, 0.05); dy = np.interp(uu, u1, y1) - np.interp(uu, u0, y0); j = int(np.argmax(np.abs(dy)))
out['trial3_vs_sora']['section'] = {'max_abs_height_diff_mm': round(float(abs(dy[j])), 3), 'at_u': round(float(uu[j]), 1), 'height_diff_mm': {str(s): round(float(np.interp(s, uu, dy)), 3) for s in (5, 8, 12, 16, 20, 24, 27, 28, 29)},
                                    'sora_groove': {'c': STORED['sora']['sec_params'][0], 'd': STORED['sora']['sec_params'][1], 'R': STORED['sora']['R_groove'], 'depth_vs_button_chord': STORED['sora']['sec']['depth_chord'], 'u_bottom': STORED['sora']['sec']['u_bottom']},
                                    'trial3_groove': {'c': T3['final'][10], 'd': T3['final'][11], 'R': T3['end']['R']['groove'], 'depth_vs_button_chord': T3['end']['groove']['depth_chord'], 'u_bottom': T3['end']['groove']['u_bottom']}}
print('   section z 30: height difference y_trial - y_sora (mm) at u: ' + '  '.join('%g: %+.2f' % (s, np.interp(s, uu, dy)) for s in (5, 8, 12, 16, 20, 24, 27, 28, 29)) + ' | max %.3f at u %.1f' % (abs(dy[j]), uu[j]))
print('   groove: Sora c %.2f d %.3f R %.1f, %.3f mm deep against the button chord, bottom u %.2f -> trial 3 c %.2f d %.3f R %.1f, %.3f mm, u %.2f' % (
    *STORED['sora']['sec_params'][:2], STORED['sora']['R_groove'], STORED['sora']['sec']['depth_chord'], STORED['sora']['sec']['u_bottom'], T3['final'][10], T3['final'][11], T3['end']['R']['groove'], T3['end']['groove']['depth_chord'], T3['end']['groove']['u_bottom']))

# ---- 3. the turn along each finger's own slide (felt rule as written: 3.44 deg over the slide)
print('\n3. THE TURN ALONG EACH SLIDE (deg; net, and total variation), mean hand and 5th / 95th')
out['turn_on_slide'] = {}
shapes = {'sora': (LA.PA, LA.PA)}; shapes.update({k: (t['end']['planL'], t['end']['planR']) for k, t in STORED['trials'].items()})
paths = STORED['path']['per_hand']
for nm, (aL, aR) in shapes.items():
    zL, uL = side_u(aL); zR, uR = side_u(aR); row = {}
    for hk in ('p5', 'p50', 'p95'):
        tp, pp = paths[hk]['thumb'], paths[hk]['pinky']
        row[hk] = {'thumb': [round(v, 2) for v in turn_along(zL, uL, *tp)], 'pinky': [round(v, 2) for v in turn_along(zR, uR, *pp)], 'thumb_path': [round(v, 1) for v in tp], 'pinky_path': [round(v, 1) for v in pp]}
    out['turn_on_slide'][nm] = row
    print('   %-11s thumb net/total p5 %s p50 %s p95 %s | pinky p5 %s p50 %s p95 %s' % (nm, row['p5']['thumb'], row['p50']['thumb'], row['p95']['thumb'], row['p5']['pinky'], row['p50']['pinky'], row['p95']['pinky']))
# where the waist arc itself lies (z of its two ends) for trial 3
for nm in ('sora', 'lifted_sym'):
    rows = out['arcs'][nm]['plan' if nm == 'sora' else 'planL']; W = rows[4]; print('   %s: waist arc from z %.1f to z %.1f (bottom at z %.1f)' % (nm, W['to'][1], W['from'][1], (STORED['sora']['side'] if nm == 'sora' else T3['end']['thumb'])['z_bottom']))
    out['turn_on_slide'][nm]['waist_arc_z'] = [W['to'][1], W['from'][1]]

# ---- 4. the slope under each finger at its grip rest (palm lifted), and its distance from the bottom
print('\n4. AT THE GRIP REST (palm lifted): distance from the valley bottom (mm) and the side slope there (deg)')
out['rest'] = {}
for nm in ('sora', 'lifted_sym', 'lifted_fwd'):
    aL, aR = shapes[nm]; zL, uL = side_u(aL); zR, uR = side_u(aR); row = {}
    bL = STORED['sora']['side']['z_bottom'] if nm == 'sora' else STORED['trials'][nm]['end']['thumb']['z_bottom']; bR = STORED['sora']['side']['z_bottom'] if nm == 'sora' else STORED['trials'][nm]['end']['pinky']['z_bottom']
    for hk in ('p5', 'p50', 'p95'):
        zt_, zp_ = paths[hk]['thumb'][0], paths[hk]['pinky'][0]
        row[hk] = {'thumb': {'rest_z': round(zt_, 2), 'off_bottom_mm': round(zt_ - bL, 2), 'slope_deg': round(slope_at(zL, uL, zt_), 2)}, 'pinky': {'rest_z': round(zp_, 2), 'off_bottom_mm': round(zp_ - bR, 2), 'slope_deg': round(slope_at(zR, uR, zp_), 2)}}
    out['rest'][nm] = row
    print('   %-11s ' % nm + ' | '.join('%s thumb %+.1f mm, %+.2f deg; pinky %+.1f mm, %+.2f deg' % (hk, row[hk]['thumb']['off_bottom_mm'], row[hk]['thumb']['slope_deg'], row[hk]['pinky']['off_bottom_mm'], row[hk]['pinky']['slope_deg']) for hk in row))
json.dump(out, open(os.path.join(ROOT, 'out', 'audit_geometry.json'), 'w'), indent=1)
