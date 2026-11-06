"""b04_skates: one, two or three dots on each corner ledge, pressed firmly (10 N at z -20) into the same soft pad as b04_sag.
Ledges: each corner's ledge is centred on the 3D shell's corner pair (KEY_PARTS.skates), along the pair's direction, 19.5 mm
long (the lens's two-dot span: room for three 6.5 mm dots). One dot: at the ledge's centre. Two: at its ends (13 mm apart,
like the lens's). Three: ends and centre. Output: each set's sink under its deepest dot, the sink at each ledge, pressure."""
import sys, json, math, numpy as np
sys.argv = [sys.argv[0]]
sys.path.insert(0, '/home/claude/work/b04/model')
import sag_final as S
from sink import XX, ZZ, at, area, dots, CORN
E = S.E
P = 10.0; ZL = -20.0
pairs = [(0, 1), (2, 3), (4, 5), (6, 7)]          # CORN order: front-right pair, rear-right, front-left, rear-left (x, z)
C = np.array(CORN)
led = []
for a, b in pairs:
    p, q = C[a], C[b]; c = (p + q) / 2; u = (q - p) / np.linalg.norm(q - p)
    led.append(dict(c=c.tolist(), u=u.tolist(), ends=[(c - 6.5 * u).tolist(), (c + 6.5 * u).tolist()], kp=[p.tolist(), q.tolist()]))
def run(pts):
    m = dots(pts); r = S.run(E, m, P, ZL)
    sinks = [float(r['body'](x, z)) for x, z in pts]
    return dict(n=len(pts), area=float(area(m)), sinkMax=max(sinks), sinks=sinks, c=[float(v) for v in r['c']], pmean=P / float(area(m)))
one = [l['c'] for l in led]
two = [e for l in led for e in l['ends']]
three = two + one
kp = [list(p) for p in CORN]
out = dict(press=P, zl=ZL, ledges=led, one=run(one), two=run(two), three=run(three), keyparts=run(kp))
for k in ('one', 'two', 'three', 'keyparts'):
    r = out[k]; print('%-9s n %2d area %5.0f mm2  max sink %.3f mm  mean pressure %.4f N/mm2' % (k, r['n'], r['area'], r['sinkMax'], r['pmean']), ['%.3f' % v for v in r['sinks']])
# the same at the resting hand's weight (4.4 N): linear
for k in ('one', 'two', 'three'): print(k, 'at 4.4 N: %.3f' % (out[k]['sinkMax'] * 4.4 / P))
json.dump(out, open('/home/claude/work/b04/model/skates_model.json', 'w'))
