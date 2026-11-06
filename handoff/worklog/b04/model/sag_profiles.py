"""b04_sag drawing data: per skate set, at the 5 N demonstration press, the rigid body's sink (c0 + c1 x + c2 z), the
cloth's sink seen from the side (the deepest along x at each z: the dish round each skate), the lens's drop toward the
cloth under it, area and weight (same 0.65 mm stack, POM). Plus the sweep of growing end skates, refined to the size that
holds the lens as well as Theseus's two lens dots."""
import sys, json, math, numpy as np
sys.argv = [sys.argv[0]]
sys.path.insert(0, '/home/claude/work/b04/model')
import sag_final as S   # runs the calibration (prints) and defines everything
from sink import XX, ZZ, at, area, dots, CORN
E = S.E
zl = np.arange(-62, 62.01, 1.0)
def prof(mask):
    r = S.run(E, mask, S.P_DEMO)
    w = r['w']
    # deepest along x at each z (|x| <= 30)
    ix = np.where(np.abs(XX[0]) <= 30)[0]
    deep = []
    for z in zl:
        iz = int(round((z - (-75)) / 0.5))
        deep.append(float(w[iz, ix].max()))
    b = r['body'](0, S.AXIS); d = at(w, 0, S.AXIS)
    return dict(c=[float(v) for v in r['c']], cloth=[round(v * 1000) for v in deep], gap=float(b - d), dip=float(d), area=float(area(mask)))
def sweep_mask(k):
    if k == 0: return dots(CORN)
    w = 14 + (47.6 - 14) * k; h = 8 + (23.8 - 8) * k
    fr = S.rrect(0, 50 - h / 2, w, h, min(6.0, h / 2)); rw = 14 + (52 - 14) * k; rh = 8 + (21.5 - 8) * k
    re = S.halfmoon(-52 + rh, rw, rh, -1)
    return fr | re | dots(CORN)
out = {}
out['corners'] = prof(dots(CORN))
out['theseus'] = prof(dots(CORN + S.LDOTS))
target = out['theseus']['gap']
ks = [0, 0.125, 0.25, 0.375, 0.5, 0.75, 1.0]
sw = []
for k in ks:
    p = prof(sweep_mask(k)); p['k'] = k; sw.append(p); print('k %.3f area %.0f gap %.4f' % (k, p['area'], p['gap']))
# refine the match
lo, hi = 0.25, 0.375
for _ in range(14):
    mid = (lo + hi) / 2; g = prof(sweep_mask(mid))['gap']
    if g > target: lo = mid
    else: hi = mid
km = (lo + hi) / 2; pm = prof(sweep_mask(km)); pm['k'] = km
print('match k %.4f area %.1f gap %.4f (target %.4f)' % (km, pm['area'], pm['gap'], target))
sw.append(pm); sw.sort(key=lambda p: p['k'])
out['sweep'] = sw; out['match'] = km
gpm = S.stack_g_per_mm2('POM'); gpt = S.stack_g_per_mm2('PTFE')
out['g_POM'] = gpm; out['g_PTFE'] = gpt; out['z'] = [float(z) for z in zl]
json.dump(out, open('/home/claude/work/b04/model/sag_profiles.json', 'w'))
for nm in ('corners', 'theseus'):
    p = out[nm]; print(nm, 'area %.1f gap %.4f dip %.4f g POM %.4f' % (p['area'], p['gap'], p['dip'], p['area'] * gpm))
print('match: area %.1f, POM %.4f g, added over corners %.4f g; lens dots add %.4f g' % (pm['area'], pm['area'] * gpm, (pm['area'] - out['corners']['area']) * gpm, (out['theseus']['area'] - out['corners']['area']) * gpm))
