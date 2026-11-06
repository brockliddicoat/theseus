"""After the rollout: (1) fg_after.png, every changed slide at its finger frame and its settle frame, downscaled;
(2) fg_after_zoom.png, each finger at 1:1, before (11:11 build) and after (live 12:26 build)."""
from PIL import Image, ImageDraw, ImageFont
import json, os, glob, math
FG = '/home/claude/work/fg'
F = lambda s, b=False: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf' % ('-Bold' if b else ''), s)
C = json.load(open(f'{FG}/changed.json'))
ids, tf, st, paper = C['ids'], C['tf'], C['settle'], C['paper']
def shot(d, i, t):
    m = glob.glob(f'{FG}/{d}/*_{i}_{t}.png') or glob.glob(f'{FG}/{d}/*_{i}_{int(t) if float(t).is_integer() else t}.png')
    return m[0] if m else None
def fmt(t): return ('%g' % t)
BG = (118, 118, 124)
# ---------- sheet 1: frames ----------
cw, chh, gap = 480, 270, 18
cellW = cw * 2 + 10
cols = 2
rows = math.ceil(len(ids) / cols)
W = 30 + cols * cellW + (cols - 1) * 40 + 30
H = 120 + rows * (chh + 56 + gap) + 20
S = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(S)
d.text((30, 26), 'F49.1  The new finger (A Line) on every slide that draws it: the finger frame and the settled frame', fill=(255, 255, 255), font=F(26, True))
d.text((30, 66), 'Live build 2026-11-06 12:26 (107 slides), kit finger rebuilt; the slides\' own calls unchanged (the owners\' one-line fixes are in their review files).', fill=(236, 236, 240), font=F(16))
for k, i in enumerate(ids):
    r, c = divmod(k, cols); x = 30 + c * (cellW + 40); y = 120 + r * (chh + 56 + gap)
    d.text((x, y), i, fill=(255, 255, 255), font=F(18, True))
    d.text((x + 210, y + 3), ('paper' if paper[i] else 'night') + f'   finger frame t = {fmt(tf[i])} s   settle t = {fmt(st[i])} s', fill=(230, 230, 235), font=F(14))
    for j, t in enumerate([tf[i], st[i]]):
        p = shot('after', i, t)
        if p: S.paste(Image.open(p).convert('RGB').resize((cw, chh), Image.LANCZOS), (x + j * (cw + 10), y + 30))
out1 = f'{FG}/sheets/fg_after.png'; S.save(out1); print(out1, S.size)
# ---------- sheet 2: 1:1 crops, before and after ----------
def scanmap(path):
    d = json.load(open(path)); m = {}
    for r in d['rec']:
        if 'err' in r or r['fn'] != 'finger': continue
        m.setdefault((r['id'], round(r['t'], 2)), []).append(r)
    return m
A = scanmap(f'{FG}/scan-live-1226.json'); Bm = scanmap(f'{FG}/scan-1111b.json') if os.path.exists(f'{FG}/scan-1111b.json') else {}
def near(m, i, t):
    best = None
    for (j, tt), rs in m.items():
        if j == i and (best is None or abs(tt - t) < abs(best[0] - t)): best = (tt, rs)
    return best[1] if best else []
def crop(p, rs, size=300):
    im = Image.open(p).convert('RGB')
    if not rs: return im.resize((size, int(size * 9 / 16)))
    r = max(rs, key=lambda q: (q.get('alpha') if q.get('alpha') is not None else 1))
    s, ang = r.get('stage_s') or 4, r.get('ang') or 0
    L = r.get('len') or 46; v = r.get('view') or 'side'
    if v == 'side': cx, cy = r['x'] - math.cos(ang) * L * s * 0.3, r['y'] - math.sin(ang) * L * s * 0.3 - 4 * s
    elif v == 'top': cx, cy = r['x'] - math.cos(ang) * L * s * 0.25, r['y'] - math.sin(ang) * L * s * 0.25
    else: cx, cy = r['x'], r['y'] - 10 * s
    half = max(size / 2, min(420, 0.55 * L * s)) if v != 'end' else max(size / 2, 18 * s)
    box = (int(cx - half), int(cy - half), int(cx + half), int(cy + half))
    c = im.crop(box)
    return c.resize((size, size), Image.LANCZOS) if c.width != size else c
tiles = []
for i in ids:
    pa = shot('after', i, tf[i]); pb = shot('before', i, tf[i])
    a = crop(pa, near(A, i, tf[i])) if pa else None
    b = crop(pb, near(Bm, i, tf[i])) if pb else None
    tiles.append((i, b, a))
tw, th2 = 300, 300
cols2 = 3
rows2 = math.ceil(len(tiles) / cols2)
W2 = 30 + cols2 * (2 * tw + 10 + 40) - 40 + 30
H2 = 120 + rows2 * (th2 + 60) + 20
S2 = Image.new('RGB', (W2, H2), BG); d2 = ImageDraw.Draw(S2)
d2.text((30, 26), 'F49.1  Each finger up close: before (11:11) and after (12:26)', fill=(255, 255, 255), font=F(26, True))
d2.text((30, 66), 'Crops round the finger at the same moment; scaled to fit where the finger is big. New slides since 11:11 have no "before".', fill=(236, 236, 240), font=F(16))
for k, (i, b, a) in enumerate(tiles):
    r, c = divmod(k, cols2); x = 30 + c * (2 * tw + 10 + 40); y = 120 + r * (th2 + 60)
    d2.text((x, y), i, fill=(255, 255, 255), font=F(17, True))
    d2.text((x, y + 22), 'before', fill=(225, 225, 230), font=F(13)); d2.text((x + tw + 10, y + 22), 'after', fill=(225, 225, 230), font=F(13))
    if b: S2.paste(b, (x, y + 40))
    else: d2.rectangle([x, y + 40, x + tw, y + 40 + th2], outline=(150, 150, 156)); d2.text((x + 20, y + 170), '(new slide)', fill=(220, 220, 224), font=F(15))
    if a: S2.paste(a, (x + tw + 10, y + 40))
out2 = f'{FG}/sheets/fg_after_zoom.png'; S2.save(out2); print(out2, S2.size)
