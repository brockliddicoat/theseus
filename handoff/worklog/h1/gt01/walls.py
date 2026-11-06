"""GT01 bottom housing: the side profile (gt01.js), the cut-outs, every web and margin, for a housing wall W"""
import math, sys
import numpy as np
from shapely.geometry import Polygon, Point, LineString
from shapely import affinity
W = float(sys.argv[1]) if len(sys.argv) > 1 else 0.70
CW = 0.45                                   # the cover's end walls stay the D2F cover's 0.45
L_, t = 12.8, math.radians(20); cT, sT = math.cos(t), math.sin(t); lift = (L_ / 2) * sT - 0.52
S2W = lambda y, z: (y * cT - z * sT + lift, y * sT + z * cT)      # -> (Y, Z)
zi = L_ / 2 - CW
C = S2W(0, L_ / 2); F = S2W(0, -L_ / 2); C2 = S2W(2.496, zi); F2 = S2W(2.496, -zi); Fi = S2W(0, -zi)
ysF = (zi * sT - lift) / cT
front = [(S2W(ysF, zi)[1], 0.0)]
prof = Polygon([(F[1], 0.0)] + front + [(C2[1], C2[0]), (F2[1], F2[0]), (Fi[1], Fi[0]), (F[1], F[0])])
args = dict(back=(-2.86, 3.81, 1.01), front=(3.44, 1.49, 1.04), slot=(0.22, 3.37, 2.0, 0.74))
def cut(W, back, front, slot, tri_top=3.03):
    zb = F[1] + W
    tri = Polygon([(0.07, W), (zb, tri_top), (zb, W)])
    bh = Point(back[0], back[1]).buffer(back[2], 64); fh = Point(front[0], front[1]).buffer(front[2], 64)
    cz, cy, ln, wd = slot; dx, dy = (ln / 2 - wd / 2) * cT, -(ln / 2 - wd / 2) * sT
    sl = LineString([(cz - dx, cy - dy), (cz + dx, cy + dy)]).buffer(wd / 2, 32)
    return dict(triangle=tri, back=bh, front=fh, slot=sl)
def report(cs, tag):
    edge = prof.exterior
    print(tag)
    for k, g in cs.items():
        inside = prof.buffer(-1e-6).contains(g)
        print('  %-8s margin to the outline %.2f%s' % (k, g.distance(edge), '' if inside else '  (OUTSIDE)'))
    ks = list(cs)
    for i in range(len(ks)):
        for j in range(i + 1, len(ks)):
            print('  web %-8s - %-8s %.2f' % (ks[i], ks[j], cs[ks[i]].distance(cs[ks[j]])))
report(cut(0.45, **args), 'v23 (K1): W 0.45, render sizes')
# W: shrink the round holes to keep W from the outline; move the slot down off the shoulder; triangle by W
dS = W - 0.45
back = (args['back'][0], args['back'][1], args['back'][2] - dS)
front = (args['front'][0], args['front'][1], args['front'][2] - dS)
sl = args['slot']; slot = (sl[0] - sT * dS, sl[1] - cT * dS, sl[2], sl[3])
cs = cut(W, back, front, slot)
report(cs, 'H1: W %.2f (holes r %.2f / %.2f, slot centre (%.2f, %.2f))' % (W, back[2], front[2], slot[0], slot[1]))
print('profile', [(round(x, 3), round(y, 3)) for x, y in prof.exterior.coords][:-1])
# the render's slot (measure.py: centre (0.15, 2.30), 2.11 along x 1.10 across), the holes at their traced places
cs2 = cut(W, back, front, (0.15, 2.30, 2.11, 1.10))
report(cs2, 'H1 + the render\'s slot (0.15, 2.30) 2.11 x 1.10')
for tt in (3.03, 2.6, 2.4):
    cs3 = cut(W, back, front, (0.15, 2.30, 2.11, 1.10), tri_top=tt)
    print('tri top %.2f: web triangle-slot %.2f, triangle-back %.2f' % (tt, cs3['triangle'].distance(cs3['slot']), cs3['triangle'].distance(cs3['back'])))
