import json, math
import numpy as np
from shapely.geometry import Polygon, LineString, Point
from shapely.ops import unary_union
from PIL import Image, ImageDraw
exec(open('extract2.py').read().split('out = {}')[0])   # reuse helpers: rings, poly, resample, smooth, dp, KZ, KX, KY
O = {}
# ---------- side ----------
a = '0'
body = poly('body/body', a); tL = poly('explodeL/triggerL/Group/triggerL', a); tR = poly('explodeR/triggerR/Group/triggerR', a)
sil = unary_union([body, tL, tR]).buffer(1.1, 32).buffer(-1.1, 32)
P = [(z * KZ, y * KY) for z, y in list(sil.exterior.coords)[:-1]]
O['side'] = dp(smooth(resample(P, 0.3), 2.4), 0.018)
seam = tL.exterior.difference(unary_union([body, tR]).buffer(1.1).buffer(-1.1).exterior.buffer(0.5))
segs = [g for g in (seam.geoms if hasattr(seam, 'geoms') else [seam]) if g.length > 3]
O['sideSeam'] = [dp(smooth(resample([(z * KZ, y * KY) for z, y in g.coords], 0.3, False), 1.4, False), 0.018) for g in segs]
O['sideBtn'] = []
for pth in ['sideFront/sideFront', 'sideRear/sideRear']:
    e = list(poly(pth, a).exterior.coords)[:-1]
    O['sideBtn'].append(dp(smooth(resample([(z * KZ, y * KY) for z, y in e], 0.25), 1.6), 0.018))
wc, wr = (34.87, 17.03), 11.37
cap = Point(wc).buffer(wr, 180).difference(sil)
caps = sorted([g for g in (cap.geoms if hasattr(cap, 'geoms') else [cap]) if g.area > 0.5], key=lambda g: -g.area)
O['sideWheel'] = [dp(np.array([(z * KZ, y * KY) for z, y in list(caps[0].exterior.coords)[:-1]]), 0.015)]
O['wheelSide'] = [wc[0] * KZ, wc[1] * KY, wr * KY]
# ---------- front ----------
a = '2'
body = poly('body/body', a); tL = poly('explodeL/triggerL/Group/triggerL', a); tR = poly('explodeR/triggerR/Group/triggerR', a)
silF = unary_union([body, tL, tR]).buffer(0.6, 32).buffer(-0.6, 32)
O['front'] = dp(smooth(resample([(x * KX, y * KY) for x, y in list(silF.exterior.coords)[:-1]], 0.3), 2.0), 0.018)
oval = unary_union([tL, tR]).buffer(2.5, 32).buffer(-2.5, 32)
O['frontTrig'] = dp(smooth(resample([(x * KX, y * KY) for x, y in list(oval.exterior.coords)[:-1]], 0.3), 2.2), 0.018)
ln = LineString([(0, -5), (0, 60)]).intersection(oval)
print('oval split at x=0: y', [round(v, 2) for v in ln.bounds])
O['frontSplit'] = [ln.bounds[1] * KY, ln.bounds[3] * KY]
O['frontWheel'] = [2.58 * KX, 19.8 * KY, 28.4 * KY]
O['frontBtn'] = []
for pth in ['sideFront/sideFront', 'sideRear/sideRear']:
    e = list(poly(pth, a).exterior.coords)[:-1]
    O['frontBtn'].append(dp(smooth(resample([(x * KX, y * KY) for x, y in e], 0.2), 1.0), 0.03))
print('side bounds', [round(v, 2) for v in np.r_[O['side'].min(0), O['side'].max(0)]], 'front bounds', [round(v, 2) for v in np.r_[O['front'].min(0), O['front'].max(0)]])
# ---------- emit JS ----------
def js(arr): return '[' + ','.join('[%s,%s]' % (('%.2f' % x).rstrip('0').rstrip('.'), ('%.2f' % y).rstrip('0').rstrip('.')) for x, y in arr) + ']'
lines = []
lines.append('const MS_SIDE = ' + js(O['side']) + ';')
lines.append('const MS_SIDE_SEAM = [' + ','.join(js(s) for s in O['sideSeam']) + '];')
lines.append('const MS_SIDE_BTN = [' + ','.join(js(s) for s in O['sideBtn']) + '];')
lines.append('const MS_SIDE_WHEEL = ' + js(O['sideWheel'][0]) + ';')
lines.append('const MS_FRONT = ' + js(O['front']) + ';')
lines.append('const MS_FRONT_TRIG = ' + js(O['frontTrig']) + ';')
lines.append('const MS_FRONT_BTN = [' + ','.join(js(s) for s in O['frontBtn']) + '];')
lines.append('/* split ' + str([round(v, 2) for v in O['frontSplit']]) + ' wheel ' + str([round(v, 2) for v in O['frontWheel']]) + ' wheelSide ' + str([round(v, 2) for v in O['wheelSide']]) + ' */')
open('/home/claude/work/f0a/ms_consts.js', 'w').write('\n'.join(lines) + '\n')
print('chars', sum(len(l) for l in lines), {k: (len(v) if hasattr(v, '__len__') else v) for k, v in O.items()})
# preview at large scale, side view nose LEFT as 'left' would draw it
img = Image.new('RGB', (1900, 1000), 'white'); dr = ImageDraw.Draw(img)
def drawp(pts, ox, oy, s, col, w=2, closed=True, flipx=False):
    Q = [(ox + (-x if flipx else x) * s, oy - y * s) for x, y in pts]
    if closed: Q = Q + Q[:1]
    dr.line(Q, fill=col, width=w)
s = 7.5
for (ox, fx) in [(470, True)]:
    drawp(O['side'], ox, 420, s, 'black', 3, True, fx)
    for sg in O['sideSeam']: drawp(sg, ox, 420, s, (40, 40, 40), 2, False, fx)
    for b in O['sideBtn']: drawp(b, ox, 420, s, (40, 40, 40), 2, True, fx)
    drawp(O['sideWheel'][0], ox, 420, s, (40, 40, 40), 2, True, fx)
    yb = 9.3; dr.line([(ox - 58.9 * s, 420 - yb * s), (ox + 58.6 * s, 420 - yb * s)], fill=(170, 170, 170), width=1)
ox = 1450
drawp(O['front'], ox, 420, s, 'black', 3)
drawp(O['frontTrig'], ox, 420, s, (40, 40, 40), 2)
for b in O['frontBtn']: drawp(b, ox, 420, s, (40, 40, 40), 2)
w = O['frontWheel']; dr.rectangle([ox - w[0] * s, 420 - w[2] * s, ox + w[0] * s, 420 - w[1] * s], outline=(40, 40, 40), width=2)
img.save('/home/claude/work/f0a/ms_extract2.png')
