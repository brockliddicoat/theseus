import sys, math, numpy as np
sys.argv=[sys.argv[0]]
from sink import *
def rrect(cx, cz, w, h, r):
    m = (np.abs(XX-cx) <= w/2) & (np.abs(ZZ-cz) <= h/2)
    for sx in (-1,1):
        for sz in (-1,1):
            ccx, ccz = cx+sx*(w/2-r), cz+sz*(h/2-r)
            corner = (sx*(XX-ccx) > 0) & (sz*(ZZ-ccz) > 0)
            m &= ~(corner & ((XX-ccx)**2+(ZZ-ccz)**2 > r*r))
    return m
def halfmoon(cz_edge, w, h, sign):
    # straight edge at z=cz_edge facing the middle, curved away (sign=-1: rear)
    a, b = w/2, h
    zz = (ZZ - cz_edge) * sign
    return (zz >= 0) & ((XX/a)**2 + (zz/b)**2 <= 1)
lensZ = 16.57; axis = lensZ + 1.1
front = rrect(0, 38.0, 47.6, 23.8, 6.0)
rear = halfmoon(-30.5, 52.0, 21.5, -1)
ring = ((XX)**2/(7.1**2) + (ZZ-axis)**2/(7.1**2) <= 1) & ~(((XX)**2 + (ZZ-axis)**2) <= 4.0**2)
four = dots([CORN[i] for i in (1, 2, 4, 7)])
sets = [('four corner dots', four), ('eight corner dots', dots(CORN)), ('Theseus 8+2', dots(CORN + [[0, lensZ + 6.3], [0, lensZ - 6.7]])),
        ('V4-size pads, no ring', front | rear), ('V4-size pads + ring', front | rear | ring), ('8 corner + ring', dots(CORN) | ring)]
t_foam = 4.0
for lam in (1.5, 2.5):
  for (Pcal, lab) in ((5.0, 'cal: 4 dots sink 0.65 at 5 N'), (10.0, 'cal: 4 dots sink 0.65 at 10 N')):
    def run(E, mask, P=5.0, zl=-15.0):
        k = E / t_foam; G = k * lam * lam
        return solve(mask, k, G, P, 0.0, zl)
    lo, hi = 0.01, 5.0
    for _ in range(36):
        E = math.sqrt(lo*hi); s = run(E, four, P=Pcal)['c'][0]
        if s > 0.65: lo = E
        else: hi = E
    print('lam %.1f  %s  E=%.3f MPa' % (lam, lab, E))
    for nm, mk in sets:
        r = run(E, mk, P=5.0); b = r['body'](0, axis); d = at(r['w'], 0, axis)
        print('   %-24s area %6.0f  body@lens %5.3f  dip %5.3f  gap %6.3f  maxsink %5.3f' % (nm, area(mk), b, d, b-d, max(r['c'][0]+abs(r['c'][1])*30+abs(r['c'][2])*50, 0)))
