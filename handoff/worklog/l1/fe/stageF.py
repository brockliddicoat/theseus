"""L1 stage F: the final crease (one straight sloped line, F47.2/F51, S2 12:30). Run with L1_CREASE=slope.
Re-solved: the five patterns at the skin floor (t = 0.60, lam solved), and the winner's (kagome) depth family.
Usage: L1_CREASE=slope python3 stageF.py -> stageF.json; then L1_CREASE=slope python3 sweep.py stageF.json"""
import sys, json
sys.path.insert(0, '/home/claude/work/l1/fe')
import l1geo
assert l1geo.CREASE == 'slope'
from stageC import lam_for_t
from stageD import at_depth
out = []
for kind in ('tri', 'kagome', 'square', 'diamond', 'hex'):
    d, t, tab = lam_for_t(kind, 0.60, lams=(0.20, 0.26, 0.32)); d['label'] = f'F-{kind}-t0.60'; out.append(d)
    print(d['label'], 'lam %.4f t %.4f w %.4f hr %.4f' % (d['lam'], t, d['w'], d['hr']), [(l, round(x, 4)) for l, x in tab], flush=True)
    json.dump(out, open('stageF.json', 'w'), indent=1)
win = out[0]
for hr in (0.6, 1.0, 1.4, 2.2, 2.6):
    d, t = at_depth('tri', win['lam'], hr); d['crease'] = 'slope'; d['label'] = f'F-depth{hr}'; out.append(d)
    print(d['label'], 't %.4f w %.4f hr %.4f' % (t, d['w'], d['hr']), flush=True)
json.dump(out, open('stageF.json', 'w'), indent=1)
print('wrote', len(out), flush=True)
