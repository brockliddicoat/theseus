import math, numpy as np, cv2
from PIL import Image
im = np.asarray(Image.open('/home/claude/theseus/refs/photos/gateron-gt01-vertical-push.jpg').convert('RGB')).astype(np.float32)
L = im.mean(2)
PX, XZ, YB = 14.53, 597.0, 302.5
t = math.radians(20); ct, st = math.cos(t), math.sin(t); lift = 1.669
def img2w(x, y): return ((XZ - x) / PX, (YB - y) / PX)
def w2img(z, y): return (XZ - PX * z, YB - PX * y)
# region of the housing in image px
X0, Y0, X1, Y1 = 500, 230, 690, 305
sub = L[Y0:Y1, X0:X1]
S = 8
big = cv2.resize(sub, ((X1 - X0) * S, (Y1 - Y0) * S), interpolation=cv2.INTER_CUBIC)
mask = (big < 30).astype(np.uint8)
# keep only inside the housing polygon (K1 outline, slightly shrunk)
hous = [(-6.014, 0.05), (5.724, 0.05), (6.445, 1.979), (-4.737, 6.049), (-5.591, 3.704), (-6.014, 3.858)]
poly = np.array([[(w2img(z, y)[0] - X0) * S, (w2img(z, y)[1] - Y0) * S] for z, y in hous], np.int32)
hm = np.zeros_like(mask); cv2.fillPoly(hm, [poly], 1)
mask = mask & hm
mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
n, lab, stats, cen = cv2.connectedComponentsWithStats(mask)
cs, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
out = []
for c in cs:
    if cv2.contourArea(c) < 400: continue
    pts = c[:, 0, :].astype(float) / S + [X0, Y0]
    W = np.array([img2w(x, y) for x, y in pts])
    zc, yc = W.mean(0)
    out.append((zc, yc, W))
# housing edges in world: board y=0; shoulder ys=2.5; front face (5.724,0)->(6.445,1.979); back face z=-6.014 ; back end wall inner face (-4.737,6.049)->(-5.591,3.704)
def ys_of(z, y): return (y - lift) * ct + z * st
def d_front(z, y):
    a = np.array([5.724, 0]); b = np.array([6.445, 1.979]); u = (b - a) / np.linalg.norm(b - a); n_ = np.array([u[1], -u[0]])
    return abs((np.array([z, y]) - a) @ n_)
for zc, yc, W in sorted(out, key=lambda o: -o[0]):
    db = W[:, 1].min(); ds = (2.5 - np.array([ys_of(z, y) for z, y in W])).min(); dfr = min(d_front(z, y) for z, y in W); dbk = (W[:, 0] + 6.014).min()
    ext_along = np.array([z * ct - (y - lift) * st for z, y in W]); ext_up = np.array([ys_of(z, y) for z, y in W])
    print('cut-out centre (%.2f, %.2f): z %.2f..%.2f y %.2f..%.2f | along %.2f, across %.2f | to board %.2f, shoulder %.2f, front face %.2f, back face %.2f' % (
        zc, yc, W[:, 0].min(), W[:, 0].max(), W[:, 1].min(), W[:, 1].max(), np.ptp(ext_along), np.ptp(ext_up), db, ds, dfr, dbk))
vis = cv2.cvtColor(np.clip(big, 0, 255).astype(np.uint8), cv2.COLOR_GRAY2BGR)
cv2.drawContours(vis, [c for c in cs if cv2.contourArea(c) >= 400], -1, (0, 0, 255), 2)
cv2.polylines(vis, [poly], True, (0, 255, 0), 2)
cv2.imwrite('measure.png', vis)
# webs between cut-outs (closest approach between the dark regions)
from scipy.spatial import cKDTree
names = {}
for zc, yc, W in out:
    k = 'front hole' if zc > 2 else 'slot' if zc > -1 and yc > 1.9 else 'back hole' if yc > 3 else 'triangle'
    names[k] = W
ks = list(names)
for i in range(len(ks)):
    for j in range(i + 1, len(ks)):
        d, _ = cKDTree(names[ks[j]]).query(names[ks[i]])
        print('web %s - %s: %.2f mm' % (ks[i], ks[j], d.min()))
