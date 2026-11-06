"""P6: L1's design rule at Brock's 1.75 deg crease: ribs at the limits (0.3606 x 1.8028, as L1's winner), skin on the
0.60 floor, 9.35 g -> solve the rib density lam (stage F's rule, lam_for_t), here at the fine mesh (h 0.55).
Budget bookkeeping only (l1fe.build, no solve). L1's code imported read-only; the crease replaced in memory."""
import sys, os, json, time
sys.path.insert(0, '/home/claude/work/l1/fe')
import numpy as np
import l1geo
def y_crease_175(z):
    z = np.asarray(z, float); return 4.6408 - 0.030553 * z
l1geo.CREASE = 'slope175'; l1geo.y_crease = y_crease_175
import l1fe
l1fe.y_crease = y_crease_175
F = json.load(open('/home/claude/work/l1/fe/stageF.json'))
w = [d for d in F if d['label'] == 'F-tri-t0.60'][0]
lams = [float(x) for x in sys.argv[1:]] or [0.222, 0.230]
res = []
for lam in lams:
    t0 = time.time()
    d = dict(w, h=0.55, crease='slope175', lam=lam); d.pop('label')
    model, info = l1fe.build(d)
    res.append((lam, info['t'], info['Lrib'], info['A_lat'], info['g_ribs']))
    print('lam %.4f t %.4f Lrib %.0f A_lat %.0f g_ribs %.3f  %.0fs' % (lam, info['t'], info['Lrib'], info['A_lat'], info['g_ribs'], time.time() - t0), flush=True)
json.dump(res, open('/home/claude/work/p6/fe/crease175/lam_scan_%s.json' % '_'.join('%.4f' % l for l in lams), 'w'))
