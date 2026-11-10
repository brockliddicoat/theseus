"""The trials rerun on the hand redo's corrected thumb (RA's hand-variant.json, copied to out/hand_paths_ra.json): one table,
each case against the stored result. Reads out/variants.json (the H... runs) and the deck's out/longarcs.json.

For every run: the waists (radius, chord, depth over the chord, where the narrowest point is, where the arc runs), the
groove, the loss and its terms, and, measured on the finished shape with that case's own paths: how far each finger grips
from its valley's bottom, the turn along each finger's slide, and how much of each slide lies on the waist arc.
Run: python3 research/gd/redo/scripts/hand_rerun_report.py   -> prints, and writes out/hand_rerun.json
"""
import json, os, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, '..'))
sys.path.insert(0, os.path.join(ROOT, 'model'))
import longarcs as LA, arcs as A
DEG = 180 / np.pi
STORED = json.load(open(os.path.abspath(os.path.join(ROOT, '..', '..', '..', 'deck', 'tools', 'gd', 'out', 'longarcs.json'))))
V = json.load(open(os.path.join(ROOT, 'out', 'variants.json')))
HP = json.load(open(os.path.join(ROOT, 'out', 'hand_paths_ra.json')))['blocks']

def side_u(arcs):
    C = A.chain(LA.P0, LA.TH0, [tuple(a) for a in arcs], ds=0.02)
    m = (C['x'] > 15) & (C['y'] > -52) & (C['y'] < float(LA.P3[1]) + 0.5); z, u = C['y'][m], C['x'][m]; o = np.argsort(z); z, u = z[o], u[o]
    zz = np.arange(-50.0, float(LA.P3[1]), 0.05); return zz, np.interp(zz, z, u)
def turn_along(zz, uu, a, b):
    th = np.arctan(np.gradient(uu, zz)); m = (zz >= min(a, b)) & (zz <= max(a, b)); t = th[m]
    return float((t[-1] - t[0]) * DEG), float(np.abs(np.diff(t)).sum() * DEG)
def slope_at(zz, uu, z0): return float(np.arctan(np.interp(z0, zz, np.gradient(uu, zz))) * DEG)
def waist_z(arcs):
    C = A.chain(LA.P0, LA.TH0, [tuple(a) for a in arcs], ds=0.02); m = C['i'] == 4; return float(C['y'][m].min()), float(C['y'][m].max())
def on_arc(path, wz): return max(0.0, min(path[1], wz[1]) - max(path[0], wz[0]))

def measure(name, planL, planR, final, thumb, pinky, groove_R, groove_depth, loss, terms, paths, sym):
    zL, uL = side_u(planL); zR, uR = side_u(planR); wL, wR = waist_z(planL), waist_z(planR); tp, pp = paths['thumb'], paths['pinky']
    row = {'name': name, 'loss': loss, 'terms': {k: v for k, v in terms.items() if abs(v) > 5e-4},
           'thumb_waist': {'R': thumb['R'], 'chord': final[0], 'depth': final[1], 'z_bottom': thumb['z_bottom'], 'arc_z': list(wL), 'below_hump': thumb['below_hump']},
           'pinky_waist': {'R': pinky['R'], 'chord': final[5], 'depth': final[6], 'z_bottom': pinky['z_bottom'], 'arc_z': list(wR), 'below_hump': pinky['below_hump']},
           'groove': {'R': groove_R, 'depth_vs_button_chord': groove_depth}, 'paths': {'thumb': tp, 'pinky': pp},
           'thumb_grip_from_bottom_mm': tp[0] - thumb['z_bottom'], 'thumb_grip_slope_deg': slope_at(zL, uL, tp[0]),
           'pinky_grip_from_bottom_mm': pp[0] - pinky['z_bottom'], 'pinky_grip_slope_deg': slope_at(zR, uR, pp[0]),
           'thumb_turn_net_total_deg': turn_along(zL, uL, *tp), 'pinky_turn_net_total_deg': turn_along(zR, uR, *pp),
           'thumb_slide_on_arc_mm': on_arc(tp, wL), 'thumb_slide_mm': tp[1] - tp[0], 'pinky_slide_on_arc_mm': on_arc(pp, wR), 'pinky_slide_mm': pp[1] - pp[0],
           'bottom_on_thumb_path': tp[0] - 1e-6 <= thumb['z_bottom'] <= tp[1] + 1e-6, 'bottom_on_pinky_path': pp[0] - 1e-6 <= pinky['z_bottom'] <= pp[1] + 1e-6}
    return row
rows = {}
old = HP['before']['per_hand']['p50']
for k, t in STORED['trials'].items():
    e = t['end']; rows['stored_' + k] = measure('stored ' + k, e['planL'], e['planR'], t['final'], dict(e['thumb'], R=e['R']['thumb']), dict(e['pinky'], R=e['R']['pinky']), e['R']['groove'], e['groove']['depth_chord'],
                                                 t['loss'][-1], t['terms'], {'thumb': sorted(old['thumb']), 'pinky': sorted(old['pinky'])}, t['pockets'] == 'sym')
for name, s in V.items():
    if not name.startswith('H'): continue
    rows[name] = measure(name, s['planL'], s['planR'], s['final'], s['thumb'], s['pinky'], s['groove']['R'], s['groove']['depth_vs_button_chord'], s['loss'], s['terms'], s['paths'], s['trial'].endswith('sym'))
    rows[name]['R_felt'] = s['R_felt']; rows[name]['trial'] = s['trial']; rows[name]['dev'] = s['dev']; rows[name]['width'] = s['width']
json.dump(rows, open(os.path.join(ROOT, 'out', 'hand_rerun.json'), 'w'), indent=1)
def line(r):
    t, p = r['thumb_waist'], r['pinky_waist']
    return ('%-26s loss %8.4f | thumb waist R %6.1f chord %5.1f depth %.3f bottom z %6.2f arc %6.1f..%5.1f under hump %.2f | pinky waist R %6.1f chord %5.1f depth %.3f bottom z %6.2f | groove R %6.1f %.3f mm'
            ' | thumb grips %+5.1f mm from the bottom (%+.2f deg), pinky %+5.1f (%+.2f) | turn on slide: thumb %.2f (%.2f), pinky %.2f (%.2f) | on the arc: thumb %.1f of %.1f mm, pinky %.1f of %.1f | bottom on thumb path %s, on pinky path %s' % (
                r['name'], r['loss'], t['R'], t['chord'], t['depth'], t['z_bottom'], *t['arc_z'], t['below_hump'], p['R'], p['chord'], p['depth'], p['z_bottom'], r['groove']['R'], r['groove']['depth_vs_button_chord'],
                r['thumb_grip_from_bottom_mm'], r['thumb_grip_slope_deg'], r['pinky_grip_from_bottom_mm'], r['pinky_grip_slope_deg'], *r['thumb_turn_net_total_deg'], *r['pinky_turn_net_total_deg'],
                r['thumb_slide_on_arc_mm'], r['thumb_slide_mm'], r['pinky_slide_on_arc_mm'], r['pinky_slide_mm'], r['bottom_on_thumb_path'], r['bottom_on_pinky_path']))
for k in rows: print(line(rows[k])); print('      terms', {a: round(b, 4) for a, b in rows[k]['terms'].items()}, '| paths', {a: [round(x, 2) for x in b] for a, b in rows[k]['paths'].items()})
