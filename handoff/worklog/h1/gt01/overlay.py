import math, sys
import numpy as np
from PIL import Image, ImageDraw
im = Image.open('/home/claude/theseus/refs/photos/gateron-gt01-vertical-push.jpg').convert('RGB')
S = 8
X0, Y0, X1, Y1 = 480, 150, 700, 320
c = im.crop((X0, Y0, X1, Y1)).resize(((X1 - X0) * S, (Y1 - Y0) * S), Image.LANCZOS)
d = ImageDraw.Draw(c)
PX = float(sys.argv[1]) if len(sys.argv) > 1 else 14.53
XZ = float(sys.argv[2]) if len(sys.argv) > 2 else 597.0
YB = float(sys.argv[3]) if len(sys.argv) > 3 else 302.5
def P(z, y):
    return ((XZ - PX * z - X0) * S, (YB - PX * y - Y0) * S)
t = math.radians(20); ct, st = math.cos(t), math.sin(t); lift = 1.669
def Sw(zs, ys):
    return (ys * st + zs * ct, ys * ct - zs * st + lift)
def poly(pts, col, w=2):
    q = [P(*p) for p in pts]; d.line(q + [q[0]], fill=col, width=w)
# silhouette
sil = [(6.20, 0), (8.24, 5.59), (-3.79, 9.97), (-6.01, 3.86), (-6.01, 0)]
poly(sil, (255, 60, 60))
# housing outline (K1)
hous = [(-6.014, 0), (5.724, 0), (6.445, 1.979), (-4.737, 6.049), (-5.591, 3.704), (-6.014, 3.858)]
poly(hous, (60, 255, 60))
# cut-outs
def circ(z, y, r, col):
    pts = [(z + r * math.cos(a), y + r * math.sin(a)) for a in np.linspace(0, 2 * math.pi, 48)]
    poly(pts, col)
circ(3.44, 1.49, 1.04, (60, 200, 255)); circ(-2.86, 3.81, 1.01, (60, 200, 255))
# slot along the tilt
u = (math.cos(t), -math.sin(t)); v = (math.sin(t), math.cos(t))
sl = []
for k in range(25):
    a = math.pi / 2 + math.pi * k / 24
    sl.append((0.22 + u[0] * (-0.63) + 0.37 * (math.cos(a) * u[0] + math.sin(a) * v[0]) , 3.37 + u[1] * (-0.63) + 0.37 * (math.cos(a) * u[1] + math.sin(a) * v[1])))
for k in range(25):
    a = -math.pi / 2 + math.pi * k / 24
    sl.append((0.22 + u[0] * 0.63 + 0.37 * (math.cos(a) * u[0] + math.sin(a) * v[0]), 3.37 + u[1] * 0.63 + 0.37 * (math.cos(a) * u[1] + math.sin(a) * v[1])))
poly(sl, (60, 200, 255))
poly([(0.07, 0.45), (-5.564, 3.03), (-5.564, 0.45)], (60, 200, 255))
# shoulder line and cover box
poly([Sw(-6.4, 2.5), Sw(6.4, 2.5)], (255, 220, 0), 1)
poly([Sw(-6.4, 0), Sw(6.4, 0), Sw(6.4, 6.5), Sw(-6.4, 6.5)], (255, 140, 0), 1)
# mm grid ticks along the board
for z in range(-7, 10):
    x, y = P(z, 0); d.line([(x, y), (x, y + 10)], fill=(255, 255, 255))
c.save(sys.argv[4] if len(sys.argv) > 4 else 'overlay_k1.png'); print(c.size)
