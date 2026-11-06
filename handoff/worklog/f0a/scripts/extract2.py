import json, math
import numpy as np
from shapely.geometry import Polygon, LineString, MultiLineString, Point, box as sbox
from shapely.ops import unary_union, linemerge
from PIL import Image, ImageDraw
D = json.load(open('/home/claude/theseus/deck/geo2d/shell.json')); q = 1 / D['q']
def rings(m, a):
    out = []
    for r in m['rings'].get(a, []):
        u = v = 0; pts = []
        for i in range(0, len(r['d']), 2):
            u += r['d'][i]; v += r['d'][i+1]; pts.append((u*q, v*q))
        out.append((pts, r.get('h', 0)))
    return out
def poly(path, a):
    ps = []
    for m in D['meshes']:
        if m['path'] != path: continue
        rs = rings(m, a)
        for o in [p for p, h in rs if not h]:
            ps.append(Polygon(o, [p for p, h in rs if h]).buffer(0))
    return unary_union(ps)
# spec scaling (F12.11): 119.3 long, 62.4 wide, 39.9 tall from the pad
KZ, KX, KY = 119.3 / 119.41, 62.4 / 62.54, 39.9 / 38.12
def resample(pts, step, closed=True):
    P = np.array(pts + ([pts[0]] if closed else []), float)
    seg = np.hypot(*np.diff(P, axis=0).T); L = np.concatenate([[0], np.cumsum(seg)])
    n = max(8, int(L[-1] / step)); s = np.linspace(0, L[-1], n, endpoint=not closed)
    return np.stack([np.interp(s, L, P[:, 0]), np.interp(s, L, P[:, 1])], 1)
def smooth(P, sigma_pts, closed=True):
    n = len(P); r = int(3 * sigma_pts) + 1; k = np.exp(-0.5 * (np.arange(-r, r + 1) / sigma_pts) ** 2); k /= k.sum()
    if closed:
        Q = np.concatenate([P[-r:], P, P[:r]]); out = np.stack([np.convolve(Q[:, i], k, 'valid') for i in range(2)], 1)
    else:
        Q = np.concatenate([np.repeat(P[:1], r, 0), P, np.repeat(P[-1:], r, 0)]); out = np.stack([np.convolve(Q[:, i], k, 'valid') for i in range(2)], 1)
        out[0] = P[0]; out[-1] = P[-1]
    return out
def dp(P, tol):
    return np.array(LineString(P).simplify(tol, preserve_topology=False).coords)
out = {}
# ---------- side (axis 0: u = Z, v = Y) ----------
a = '0'
body = poly('body/body', a); tL = poly('explodeL/triggerL/Group/triggerL', a); tR = poly('explodeR/triggerR/Group/triggerR', a)
sil = unary_union([body, tL, tR]).buffer(0.05).buffer(-0.05)
ext = list(sil.exterior.coords)[:-1]
# side coords: x = Z*KZ (nose +), y = Y*KY (up +); converted to the view's frame in JS
P = np.array([(z * KZ, y * KY) for z, y in ext])
R = resample(P.tolist(), 0.35); S = smooth(R, 2.2); S = dp(S, 0.02)
out['sideSil'] = S
# trigger seam on the side: the trigger's boundary that is not on the silhouette
trig = tL
tb = trig.exterior
silb = sil.exterior.buffer(0.45)
seam = tb.difference(silb)
segs = [list(g.coords) for g in (seam.geoms if hasattr(seam, 'geoms') else [seam]) if g.length > 2]
print('side trigger seam pieces', [round(LineString(s).length, 1) for s in segs])
out['sideSeam'] = [dp(smooth(resample([(z * KZ, y * KY) for z, y in s], 0.35, False), 1.6, False), 0.05) for s in segs]
# side buttons
out['sideBtn'] = []
for pth in ['sideFront/sideFront', 'sideRear/sideRear']:
    b = poly(pth, a); e = list(b.exterior.coords)[:-1]
    B = resample([(z * KZ, y * KY) for z, y in e], 0.3); B = dp(smooth(B, 1.5), 0.04); out['sideBtn'].append(B)
    print(pth, 'side bounds', [round(v, 2) for v in b.bounds])
# wheel cap above the surface: tread circle minus silhouette
wc = (34.87, 17.03); wr = 11.37
circ = Point(wc).buffer(wr, 128)
cap = circ.difference(sil)
print('wheel cap', cap.geom_type, round(cap.area, 2), [round(v, 2) for v in cap.bounds])
caps = [g for g in (cap.geoms if hasattr(cap, 'geoms') else [cap]) if g.area > 0.5]
out['sideWheel'] = [dp(np.array([(z * KZ, y * KY) for z, y in list(g.exterior.coords)[:-1]]), 0.03) for g in caps]
# the top surface height along Z (for anchors): max Y of the silhouette at each Z
zs = np.arange(-59, 59.6, 0.5)
top = []
for z in zs:
    l = LineString([(z, -1), (z, 50)]).intersection(sil)
    top.append(l.bounds[3] if not l.is_empty else 0)
top = np.array(top); i = int(np.argmax(top)); print('hump at Z', zs[i], 'Y', top[i])
out['hump'] = (zs[i] * KZ, top[i] * KY)
for zz in [4.84, 20, 34.87, 46, 55]:
    j = int(np.argmin(abs(zs - zz))); print('surface at Z', zz, 'Y', round(top[j], 2))
# ---------- front (axis 2: u = X, v = Y) ----------
a = '2'
body = poly('body/body', a); tL = poly('explodeL/triggerL/Group/triggerL', a); tR = poly('explodeR/triggerR/Group/triggerR', a)
silF = unary_union([body, tL, tR]).buffer(0.05).buffer(-0.05)
ext = list(silF.exterior.coords)[:-1]
P = np.array([(x * KX, y * KY) for x, y in ext]); R = resample(P.tolist(), 0.3); S = smooth(R, 2.0); S = dp(S, 0.05)
out['frontSil'] = S
fl = []
for t in [tL, tR]:
    d = t.exterior.difference(silF.exterior.buffer(0.45))
    for g in (d.geoms if hasattr(d, 'geoms') else [d]):
        if g.length > 2: fl.append(dp(smooth(resample([(x * KX, y * KY) for x, y in g.coords], 0.3, False), 1.4, False), 0.05))
print('front trigger lines', len(fl), [round(LineString(f).length, 1) for f in fl])
out['frontTrig'] = fl
out['frontBtn'] = []
for pth in ['sideFront/sideFront', 'sideRear/sideRear']:
    b = poly(pth, a); print(pth, 'front bounds', [round(v, 2) for v in b.bounds])
    e = list(b.exterior.coords)[:-1]; out['frontBtn'].append(dp(smooth(resample([(x * KX, y * KY) for x, y in e], 0.25), 1.2), 0.04))
print('front sil bounds', [round(v, 2) for v in silF.bounds], 'side sil bounds', [round(v, 2) for v in sil.bounds])
json.dump({k: (v.tolist() if hasattr(v, 'tolist') else [x.tolist() if hasattr(x, 'tolist') else x for x in v]) for k, v in out.items()}, open('/home/claude/work/f0a/ms_raw.json', 'w'))
# ---------- preview ----------
img = Image.new('RGB', (1900, 900), 'white'); dr = ImageDraw.Draw(img)
def drawp(pts, ox, oy, s, col, w=2, closed=True):
    Q = [(ox + x * s, oy - y * s) for x, y in pts]
    if closed: Q = Q + Q[:1]
    dr.line(Q, fill=col, width=w)
s = 7
drawp([(z * KZ, y * KY) for z, y in list(sil.exterior.coords)], 450, 400, s, (200, 200, 200), 1)
drawp(out['sideSil'].tolist(), 450, 400, s, 'black', 2)
for sg in out['sideSeam']: drawp(sg.tolist(), 450, 400, s, 'blue', 2, False)
for b in out['sideBtn']: drawp(b.tolist(), 450, 400, s, 'red', 2)
for w in out['sideWheel']: drawp(w.tolist(), 450, 400, s, 'purple', 2)
drawp(out['frontSil'].tolist(), 1500, 400, s, 'black', 2)
for f in out['frontTrig']: drawp(f.tolist(), 1500, 400, s, 'blue', 2, False)
for b in out['frontBtn']: drawp(b.tolist(), 1500, 400, s, 'red', 2)
img.save('/home/claude/work/f0a/ms_extract.png')
for k, v in out.items():
    if hasattr(v, 'shape'): print(k, v.shape)
    elif isinstance(v, list): print(k, [len(x) if hasattr(x, '__len__') else x for x in v])
