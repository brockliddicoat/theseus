"""Digitise Brock's red curves (rear cutout corners) from his marked-up screenshot of b02_cutouts, into key-plan mm.

The screenshot is the deck stage (1920 x 1080) scaled by k and offset (ox, oy). b02_cutouts' top view at settle has the
camera camFit([-34, -60.5, 44, 66], [80, 270, 860, 650], 0.06): s = 8.6667 px/mm, centre (-12, -27.5) mm at stage
(510, 595). k, ox, oy are fitted on the mouse outline's right edge and its nose (clean in the screenshot), and checked on
the blue rear cutout line. Key-plan mm: x = the user's right (nose up), y = -Z (the cutout at y = -4.85).
"""
import json, sys
import numpy as np, cv2
from skimage.morphology import skeletonize
sys.path.insert(0, '/home/claude/work/s1/scripts')

IMG = '/home/claude/theseus/refs/photos/brock-2026-11-06b/0931-cutouts-markup.jpg'
S, CX, CY, SX0, SY0 = 8.6667, -12.0, -27.5, 510.0, 595.0
MSK = (62.5 / 62.38, 119.2 / 118.99)

# the kit's top outline (key plan SORA_HALF scaled by MS_K): x right, y = -Z
SORA_HALF = json.load(open('/home/claude/work/s1/sora_half.json'))
half = np.array([[x * MSK[0], -z * MSK[1]] for x, z in SORA_HALF])

def mm_to_stage(mx, my): return SX0 + (mx - CX) * S, SY0 + (my - CY) * S

def halfw(y):
    """the outline's half-width at key y"""
    order = np.argsort(half[:, 1]); return np.interp(y, half[order, 1], half[order, 0])

im = cv2.imread(IMG)[:, :, ::-1].astype(int)
R, G, B = im[..., 0], im[..., 1], im[..., 2]
red = (R > 170) & (G < 90) & (B < 90)
dark = (R < 120) & (G < 120) & (B < 120) & (np.abs(R - B) < 25)
blue = (B > 180) & (R < 120) & (G > 80) & (G < 170)

# ---- fit the screenshot transform on the right edge (rows 300..600 of the shot) and the nose ----
rows = np.arange(430, 612, 4)
lum = im.mean(2)
xr = []
for r in rows:
    seg = lum[r, 595:625]; j = int(np.argmin(seg))
    # sub-pixel: the luminance-weighted centre of the dark line round its minimum
    lo, hi = max(0, j - 2), min(len(seg), j + 3); w = np.clip(240 - seg[lo:hi], 0, None)
    xr.append(595 + lo + (w * np.arange(hi - lo)).sum() / max(w.sum(), 1e-9) if seg[j] < 170 else np.nan)
xr = np.array(xr, float)
# nose: the topmost dark pixel near the centre column
col = lum[200:260, 432:446].mean(1); j = int(np.argmin(col)); w = np.clip(240 - col[j - 2:j + 3], 0, None)
ytop = 200 + j - 2 + (w * np.arange(5)).sum() / w.sum()
print('nose line at shot y %.2f' % ytop)
# vertical: the nose line and the blue rear cutout line give k and oy; horizontal: the right edge gives ox
by = []
for c in range(330, 540, 6):
    ys = np.where(blue[500:560, c])[0]
    if len(ys): by.append(500 + ys.mean())
yblue = float(np.mean(by))
syn = mm_to_stage(0, half[:, 1].min())[1]; syb = mm_to_stage(0, -4.84 * MSK[1])[1]
k = (yblue - ytop) / (syb - syn); oy = ytop - syn * k
oxs = []
for r, x in zip(rows, xr):
    if not np.isfinite(x): continue
    my = ((r - oy) / k - SY0) / S + CY
    oxs.append(x - (SX0 + (halfw(my) - CX) * S) * k)
ox = float(np.median(oxs)); print('ox spread (px)', round(float(np.std(oxs)), 2))
class _F: pass
fit = _F(); fit.fun = np.array(oxs) - ox
print('transform k %.4f ox %.2f oy %.2f, rms %.2f px' % (k, ox, oy, np.sqrt(np.mean(fit.fun ** 2))))
def shot_to_mm(x, y):
    sx, sy = (x - ox) / k, (y - oy) / k
    return (sx - SX0) / S + CX, (sy - SY0) / S + CY
# check: the blue rear line's y in the shot vs -4.85 mm
by = []
for c in range(330, 540, 10):
    ys = np.where(blue[500:560, c])[0]
    if len(ys): by.append(500 + ys.mean())
print('blue rear line: shot y %.1f -> %.2f mm (kit: %.2f)' % (np.mean(by), shot_to_mm(400, np.mean(by))[1], -4.84 * MSK[1]))
# the outline's left edge where it is clean (below the side buttons), check
for r in [560, 590]:
    xs = np.where(dark[r, 240:300])[0]
    if len(xs): print('left edge row', r, '->', [round(v, 2) for v in shot_to_mm(240 + xs.min(), r)], 'kit', round(-halfw(shot_to_mm(0, r)[1]), 2))

# ---- the red strokes: two corner curves (left and right) and the ring round the wheel ----
n, lab, stats, cent = cv2.connectedComponentsWithStats(red.astype(np.uint8), 8)
curves = {}
for i in range(1, n):
    x, y, w, h, a = stats[i]
    if a < 80: continue
    sk = skeletonize(lab == i)
    ys, xs = np.nonzero(sk)
    name = 'ring' if h > 150 else ('left' if x < 430 else 'right')
    # order the skeleton points along the stroke: walk from an end (a pixel with one neighbour)
    pts = set(zip(xs.tolist(), ys.tolist()))
    def nb(p): return [(p[0] + dx, p[1] + dy) for dx in (-1, 0, 1) for dy in (-1, 0, 1) if (dx or dy) and (p[0] + dx, p[1] + dy) in pts]
    ends = [p for p in pts if len(nb(p)) == 1]
    start = min(ends, key=lambda p: p[1]) if ends else min(pts, key=lambda p: p[1])
    path, seen, cur = [start], {start}, start
    while True:
        c = [q for q in nb(cur) if q not in seen]
        if not c: break
        cur = min(c, key=lambda q: (q[0] - cur[0]) ** 2 + (q[1] - cur[1]) ** 2); seen.add(cur); path.append(cur)
    mm = np.array([shot_to_mm(px, py) for px, py in path])
    curves[name] = {'shot': path, 'mm': mm.round(3).tolist(), 'bbox_shot': [int(x), int(y), int(w), int(h)]}
    print(name, 'shot bbox', (x, y, w, h), 'points', len(path), 'mm x %.2f..%.2f y %.2f..%.2f' % (mm[:, 0].min(), mm[:, 0].max(), mm[:, 1].min(), mm[:, 1].max()))
# the current blue cutout curve (the lit rear edge) for comparison
sk = skeletonize(blue[440:560, 260:620]); ys, xs = np.nonzero(sk)
bl = np.array([shot_to_mm(260 + x, 440 + y) for x, y in zip(xs, ys)])
json.dump({'k': k, 'ox': ox, 'oy': oy, 'curves': curves, 'blue': bl.round(3).tolist()}, open('/home/claude/work/s1/markup_digitised.json', 'w'))
print('saved')
