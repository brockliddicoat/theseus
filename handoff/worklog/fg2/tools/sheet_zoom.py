"""FG2 before/after zoom sheet: each finger slide's finger, before (current kit) and after (FG2's), cropped round the finger
at the same moment; tiles 360 px (crops scaled to fit; the factor is printed). usage: python3 sheet_zoom.py <HHMM>"""
import sys, json, glob
from PIL import Image, ImageDraw, ImageFont
hhmm = sys.argv[1]
F = lambda s, b=False: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf' % ('-Bold' if b else ''), s)
d = json.load(open('/home/claude/work/fg2/scan-fg2test.json')); fr = json.load(open('/home/claude/work/fg2/frames.json'))
TILE = 360
def box(sid, t):
    rs = [r for r in d['rec'] if r.get('fn') == 'finger' and r['id'] == sid and abs(r['t'] - t) < 1e-6]
    r = rs[0]; s = r['stage_s']; h = max(46, min(270, 17 * s))
    cx, cy = r['x'], r['y']
    view = r.get('view') or 'side'
    if view == 'top': import math; a = r.get('ang') or 0; cx += math.cos(a) * -2 * s; cy += math.sin(a) * -2 * s
    elif view == 'end': cy -= 0.62 * h
    else:
        import math; a = r.get('ang') or 0
        if sid == 'b03_side': cx -= 0.45 * h; cy -= 0.05 * h
        else: cy -= 0.35 * h
    return [int(cx - h), int(cy - h), int(cx + h), int(cy + h)], s, view, len(rs)
ids = list(fr.keys())
halves = [ids[:11], ids[11:]]
for hi, part in enumerate(halves):
    cols = 2; rows = (len(part) + cols - 1) // cols
    W = cols * (TILE * 2 + 14) + (cols + 1) * 30; H = 110 + rows * (TILE + 56)
    im = Image.new('RGB', (W, H), (118, 118, 124)); dr = ImageDraw.Draw(im)
    dr.text((30, 22), 'Fingernails (A Soft) on every slide: before and after (%d of 2)' % (hi + 1), fill=(255, 255, 255), font=F(28, True))
    dr.text((30, 62), 'The same frame from today\'s kit and from the new one, cropped round the finger (factor shown); the slides\' own calls unchanged.', fill=(236, 236, 240), font=F(16))
    for i, sid in enumerate(part):
        t = fr[sid]['t']; (x0, y0, x1, y1), s, view, n = box(sid, t)
        cx = 30 + (i % cols) * (TILE * 2 + 14 + 30); cy = 110 + (i // cols) * (TILE + 56)
        k = TILE / (x1 - x0)
        dr.text((cx, cy), '%s  (%s, %.1f px/mm, t %.1f s, crop x%.1f)' % (sid, view, s, t, k), fill=(255, 255, 255), font=F(15, True))
        for j, tag in enumerate(['before', 'after']):
            f = glob.glob('/home/claude/work/fg2/fr_%s/*_%s_%s.png' % (tag, sid, ('%g' % t)))
            if not f: continue
            src = Image.open(f[0]).convert('RGB')
            c = src.crop((max(0, x0), max(0, y0), min(1920, x1), min(1080, y1)))
            tile = Image.new('RGB', (x1 - x0, y1 - y0), (60, 60, 64)); tile.paste(c, (max(0, x0) - x0, max(0, y0) - y0))
            tile = tile.resize((TILE, TILE), Image.LANCZOS if k < 1 else Image.BICUBIC)
            px = cx + j * (TILE + 14); im.paste(tile, (px, cy + 22))
            dr.rectangle((px, cy + 22, px + 58, cy + 42), fill=(40, 40, 44)); dr.text((px + 6, cy + 24), tag, fill=(250, 250, 250), font=F(14, True))
    out = '/home/claude/work/fg2/fg2_after_zoom_%s_%d.png' % (hhmm, hi + 1)
    im.save(out); print(out, im.size)
