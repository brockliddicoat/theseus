# trace the X2-family top silhouette (from Brock's reference photo of the X2H base) as half-widths in mm
import sys
from PIL import Image
im = Image.open(sys.argv[1]); print(im.mode, im.size)
im = im.convert('RGBA'); W, H = im.size; px = im.load()
def inside(c): return c[3] > 128 and sum(c[:3]) < 720
rows = []
for y in range(H):
    xs = [x for x in range(W) if inside(px[x, y])]
    if len(xs) > 3: rows.append((y, min(xs), max(xs)))
y0, y1 = rows[0][0], rows[-1][0]
L = 120.4  # X2H length, mm
k = L / (y1 - y0)
print('px per mm %.3f' % (1/k), 'rows', y0, y1)
xs_mid = [(a+b)/2 for _, a, b in rows]
cx = sum(xs_mid)/len(xs_mid)
widths = []
for i in range(0, 61):
    frac = i/60
    y = int(round(y0 + frac*(y1-y0)))
    r = [rr for rr in rows if rr[0] == y]
    if not r: continue
    _, a, b = r[0]
    widths.append((frac*L, (b-a)/2*k))
print('max width %.2f mm' % (2*max(w for _, w in widths)))
print(', '.join('[%.1f, %.2f]' % (z, w) for z, w in widths))
