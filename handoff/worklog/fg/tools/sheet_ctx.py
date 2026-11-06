"""The in-context panel: real film frames (11:11 build) with the kit's finger swapped for each direction."""
from PIL import Image, ImageDraw, ImageFont
import os
FG = '/home/claude/work/fg'
F = lambda s, b=False: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf' % ('-Bold' if b else ''), s)
cols = [('Today', None), ('A  Line', 'A'), ('B  Shaded', 'B'), ('C  Graphic', 'C')]
rows = [
  ('b02_direct (night): the finger on the trigger, as the slide calls it', '017_b02_direct_6.png', '', (400, 260, 1180, 690)),
  ('b05_nopick (night): pressing a level strip; new columns with surf: 0 added to b05\'s call', '044_b05_nopick_3.25.png', '-surf', (170, 330, 730, 640)),
  ('b08_uv (paper): two fingertips on the buttons, from above', '066_b08_uv_3.png', '', (130, 400, 560, 790)),
  ('b02_flush (paper): end-on, the ring finger against the side (b02\'s own pad, top, unchanged here)', '016_b02_flush_2.25.png', '', (270, 390, 1060, 880)),
]
W, gap, CW = 1920, 0, 440
cells = []
for title, f, suf, box in rows:
    row = []
    for name, st in cols:
        p = os.path.join(FG, 'now', f) if st is None else os.path.join(FG, 'ctx', st + suf, f)
        im = Image.open(p).convert('RGB').crop(box)
        k = min(CW / im.width, 1.0); im = im.resize((int(im.width * k), int(im.height * k)), Image.LANCZOS)
        row.append((im, k))
    cells.append((title, row))
H = 150 + sum(max(c[0].height for c in r) + 60 for _, r in cells) + 30
S = Image.new('RGB', (W, H), (128, 128, 133)); d = ImageDraw.Draw(S)
d.text((gap + 40, 34), 'F49.1  In the film: real frames, only the finger swapped', fill=(255, 255, 255), font=F(34, True))
d.text((gap + 40, 82), 'The 11:11 build, the kit\'s finger replaced by each direction with the same call; nothing else on the slides changed.', fill=(236, 236, 240), font=F(18))
for i, (name, st) in enumerate(cols): d.text((gap + 40 + i * (CW + 20), 118), name.upper() + ('   (FG\'s pick)' if st == 'A' else ''), fill=(255, 255, 255), font=F(20, True))
y = 150
for title, row in cells:
    d.text((gap + 40, y + 4), title, fill=(240, 240, 244), font=F(17))
    y += 30
    for i, (im, k) in enumerate(row): S.paste(im, (gap + 40 + i * (CW + 20), y))
    y += max(c[0].height for c in row) + 30
os.makedirs(os.path.join(FG, 'sheets'), exist_ok=True)
out = os.path.join(FG, 'sheets', 'fg_context.png'); S.save(out); print(out, S.size)
