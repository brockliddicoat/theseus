"""b04_sag: the numbers the slide shows, from one model.
A rigid mouse on its skates, pressed into a soft cloth pad (Pasternak foundation: springs k plus a shear layer G that
drags the cloth down round each skate; lambda = sqrt(G/k) = 2 mm, a 4 mm foam).
Calibration (Brock, doc #10): one dot a corner sinks until the cloth reaches the base (0.65 mm, the skate height) under a
firm press, taken as 10 N (twice the hand's weight). The demonstration press: the hand's weight, 5 N (Dempster: the hand
is 0.6 % of body mass; 80 kg -> 4.7 N), on the hump at z = -20 mm.
Outputs (JSON): for each skate set, the gap change at the imaging axis (the lens's drop toward the cloth under it), the
max sink, skate area and weight, and the cloth and body profiles along the centre line for the side-section drawing.
"""
import sys, json, math, numpy as np
sys.argv = [sys.argv[0]]
from sink import *

LENS = 16.57                     # mm, plan 5 (sensor module centre in the mouse frame, +z = nose)
AXIS = LENS + 1.1                # imaging axis, 1.1 mm ahead of the module centre (3D lens)
LDOTS = [[0, LENS + 6.3], [0, LENS - 6.7]]
LAM, TF = 2.0, 4.0
ZP, P_DEMO, P_CAL = -20.0, 5.0, 10.0
# mass per mm^2 of the 0.65 mm stack: glide 0.38 + tape 0.05 + PORON 0.17 + tape 0.05 (3D DOT_SKATE_SPEC)
RHO = {'POM': 1.42e-3, 'PTFE': 2.16e-3, 'tape': 1.0e-3, 'poron': 0.32e-3}       # g/mm^3
def stack_g_per_mm2(glide='POM'): return 0.38 * RHO[glide] + 0.10 * RHO['tape'] + 0.17 * RHO['poron']

def rrect(cx, cz, w, h, r):
    m = (np.abs(XX - cx) <= w / 2) & (np.abs(ZZ - cz) <= h / 2)
    for sx in (-1, 1):
        for sz in (-1, 1):
            ccx, ccz = cx + sx * (w / 2 - r), cz + sz * (h / 2 - r)
            corner = (sx * (XX - ccx) > 0) & (sz * (ZZ - ccz) > 0)
            m &= ~(corner & ((XX - ccx) ** 2 + (ZZ - ccz) ** 2 > r * r))
    return m
def halfmoon(z_edge, w, h, sign):
    a, b = w / 2, h; zz = (ZZ - z_edge) * sign
    return (zz >= 0) & ((XX / a) ** 2 + (zz / b) ** 2 <= 1)

def run(E, mask, P, zl=ZP):
    k = E / TF; G = k * LAM * LAM
    return solve(mask, k, G, P, 0.0, zl)

four = dots([CORN[i] for i in (1, 2, 4, 7)])
lo, hi = 0.01, 5.0
for _ in range(40):
    E = math.sqrt(lo * hi); s = run(E, four, P_CAL)['c'][0]
    if s > 0.65: lo = E
    else: hi = E
print('foam E %.3f MPa' % E)

def result(nm, mask, glide='POM'):
    r = run(E, mask, P_DEMO); b = r['body'](0, AXIS); d = at(r['w'], 0, AXIS)
    A = area(mask)
    zline = np.arange(-62, 62.01, 0.5)
    cloth = [float(at(r['w'], 0, z)) for z in zline]
    body = [float(r['body'](0, z)) for z in zline]
    out = dict(name=nm, area=A, grams=A * stack_g_per_mm2(glide), glide=glide, body_at_lens=b, cloth_dip=d, gap=b - d,
               max_sink=float(max(r['body'](x, z) for x in (-28, 28) for z in (-55, 55))), c=list(map(float, r['c'])),
               z=list(map(float, zline)), cloth=cloth, bodyline=body)
    print('%-34s area %6.0f mm2  %.3f g (%s)  body %.3f  dip %.3f  gap %.3f' % (nm, A, out['grams'], glide, b, d, b - d))
    return out

R = {}
R['corners'] = result('8 corner dots (no lens dots)', dots(CORN))
R['theseus'] = result('Theseus: 8 corner + 2 lens dots', dots(CORN + LDOTS))
front = rrect(0, 38.0, 47.6, 23.8, 6.0); rear = halfmoon(-30.5, 52.0, 21.5, -1)
ring = (XX ** 2 + (ZZ - AXIS) ** 2 <= 7.1 ** 2) & ~(XX ** 2 + (ZZ - AXIS) ** 2 <= 4.0 ** 2)
R['v4pads'] = result('V4 Pro-size pads (no ring)', front | rear, 'PTFE')
R['v4ring'] = result('V4 Pro-size pads + ring', front | rear | ring, 'PTFE')
# the sweep: end pads growing from the corner dots toward V4 Pro size (k = 0..1): width and length scale together
sweep = []
for k in np.linspace(0, 1, 9):
    if k == 0: m = dots(CORN)
    else:
        w = lerp_ = 14 + (47.6 - 14) * k; h = 8 + (23.8 - 8) * k
        fr = rrect(0, 50 - h / 2, w, h, min(6.0, h / 2)) ; rw = 14 + (52 - 14) * k; rh = 8 + (21.5 - 8) * k
        re = halfmoon(-52 + rh, rw, rh, -1)
        m = fr | re | dots(CORN)
    r = run(E, m, P_DEMO); b = r['body'](0, AXIS); d = at(r['w'], 0, AXIS)
    sweep.append(dict(k=float(k), area=area(m), gap=float(b - d), grams_ptfe=area(m) * stack_g_per_mm2('PTFE')))
    print('  sweep k %.2f area %6.0f gap %.3f  %.2f g PTFE' % (k, area(m), b - d, area(m) * stack_g_per_mm2('PTFE')))
R['sweep'] = sweep
R['params'] = dict(lam=LAM, foam_mm=TF, E_MPa=E, P_cal=P_CAL, P_demo=P_DEMO, z_press=ZP, lens=LENS, axis=AXIS,
                   g_per_mm2_POM=stack_g_per_mm2('POM'), g_per_mm2_PTFE=stack_g_per_mm2('PTFE'))
json.dump(R, open('/home/claude/work/b04/model/sag_final.json', 'w'), indent=0)
print('saved')
