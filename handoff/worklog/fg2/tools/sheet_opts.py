"""FG2 options sheet: two images ~1650 px wide (Brock views on his phone).
usage: python3 sheet_opts.py <HHMM>  (reads opt/0xx_fg2_o_<k>_<g>_1.png) -> fg2_nail_options_<HHMM>_a.png (paper, large) and _b.png (night + film sizes)"""
import sys, glob
from PIL import Image, ImageDraw, ImageFont
hhmm = sys.argv[1]
F = lambda s, b=False: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf' % ('-Bold' if b else ''), s)
def shot(k, g): return Image.open(glob.glob('/home/claude/work/fg2/opt/*_fg2_o_%s_%s_1.png' % (k, g))[0]).convert('RGB')
ROWS = [('today', 'Today', 'the nail now'), ('soft', 'A  Soft', 'recommended'), ('line', 'B  Line', ''), ('tone', 'C  Tone', '')]
NOTES = {'today': ['White, outlined,', 'square-based: a', 'sticker from above,', 'a visor from the side'],
         'soft': ['Skin grey, a shade', 'lighter; a soft sheen;', 'the skin\'s fold drawn', 'round its sides, base'],
         'line': ['Skin grey; the fold,', 'the free edge and the', 'cuticle\'s crease drawn', 'as lines, like the parts'],
         'tone': ['A lighter tone that', 'darkens to its sides,', 'a brighter sheen;', 'no lines at all']}
CROP = {'top': (50, 150, 390, 570), 'side': (450, 50, 1030, 490), 'end': (1100, 60, 1580, 500)}
GAP, LW, HEAD = 12, 262, 134
def labels(d, x, y, k, name, sub, dark):
    fg = (20, 20, 22) if not dark else (240, 240, 242); mu = (110, 110, 116) if not dark else (170, 170, 176)
    d.text((x, y), name, fill=fg, font=F(30, True))
    if sub: d.text((x, y + 40), sub, fill=(30, 90, 200) if not dark else (110, 160, 255), font=F(20, True))
    for i, l in enumerate(NOTES[k]): d.text((x, y + 76 + i * 26), l, fill=mu, font=F(18))
def sheet(name, cols, dark, title, sub, colnames):
    widths = [CROP[c][2] - CROP[c][0] if c in CROP else c[1] for c in cols]
    H = 440
    W = LW + sum(widths) + GAP * len(cols) + 20
    bg = (14, 14, 16) if dark else (245, 245, 247)
    im = Image.new('RGB', (W, HEAD + len(ROWS) * (H + GAP) + 10), bg); d = ImageDraw.Draw(im)
    d.text((24, 18), title, fill=(240, 240, 242) if dark else (20, 20, 22), font=F(34, True))
    d.text((24, 64), sub, fill=(170, 170, 176) if dark else (100, 100, 106), font=F(19))
    x = LW
    for c, w, cn in zip(cols, widths, colnames):
        d.text((x + 6, HEAD - 30), cn, fill=(170, 170, 176) if dark else (100, 100, 106), font=F(19, True)); x += w + GAP
    for r, (k, nm, sb) in enumerate(ROWS):
        y = HEAD + r * (H + GAP)
        labels(d, 24, y + 14, k, nm, sb, dark)
        x = LW
        for c, w in zip(cols, widths):
            if c in CROP: tile = shot(k, 'n' if dark else 'p').crop(CROP[c])
            else: tile = c[0](k)
            im.paste(tile, (x, y)); x += w + GAP
        if r: d.line((20, y - GAP // 2, W - 20, y - GAP // 2), fill=(60, 60, 64) if dark else (215, 215, 220), width=1)
    out = '/home/claude/work/fg2/fg2_nail_options_%s_%s.png' % (hhmm, name)
    im.save(out); print(out, im.size)
sheet('a', ['top', 'side', 'end'], False, 'Fingernails: today and three treatments (paper, drawn large)',
      'The same finger in every row; only the nail changes (and the tip\'s shading now wraps round, so it reads round, not as a chisel).',
      ['From above', 'From the side, pressing at a slant', 'End-on'])
def film(k):
    """1:1 film sizes: b02_seams' top view (13 px/mm, night) | b08_uv's (4.4, paper), b07_tolerance's (1.6), b06's press (8)"""
    n, p = shot(k, 'n'), shot(k, 'p')
    t = Image.new('RGB', (500, 440), (14, 14, 16))
    t.paste(n.crop((30, 690, 245, 1080)).resize((215, 390)), (0, 50))
    t.paste(p.crop((250, 690, 535, 1080)), (215, 50))
    dd = ImageDraw.Draw(t); dd.text((6, 10), '13 px/mm, night  |  4.4, 1.6 and 8, paper', fill=(170, 170, 176), font=F(16, True))
    return t
sheet('b', ['top', 'side', (film, 500)], True, 'Fingernails on night, and at the film\'s own sizes (1:1)',
      'Left: drawn large on night. Right: as the slides draw them: b02_seams 13 px/mm; b08_uv 4.4; b07_tolerance 1.6; b06\'s press 8.',
      ['From above', 'From the side, pressing at a slant', 'In the film, 1:1'])
