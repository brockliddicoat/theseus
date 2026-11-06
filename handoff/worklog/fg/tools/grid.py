"""Lay images out at 1:1 (or scaled to fit max_h) in rows with labels. usage: python3 grid.py out.png W max_h img:label ..."""
import sys
from PIL import Image, ImageDraw, ImageFont
out, W, max_h = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
items = []
for a in sys.argv[4:]:
    p, _, lab = a.partition('::')
    im = Image.open(p).convert('RGB')
    if im.height > max_h:
        k = max_h / im.height; im = im.resize((max(1, int(im.width * k)), max_h), Image.LANCZOS); lab += f' (x{k:.2f})'
    items.append((im, lab))
try: font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 15)
except Exception: font = ImageFont.load_default()
gap, lh = 16, 22
rows, row, x = [], [], gap
for im, lab in items:
    if row and x + im.width + gap > W: rows.append(row); row, x = [], gap
    row.append((im, lab)); x += max(im.width, 120) + gap
if row: rows.append(row)
H = gap + sum(max(i.height for i, _ in r) + lh + gap for r in rows)
sheet = Image.new('RGB', (W, H), (128, 128, 132)); d = ImageDraw.Draw(sheet)
y = gap
for r in rows:
    x = gap; rh = max(i.height for i, _ in r)
    for im, lab in r:
        d.text((x, y), lab, fill=(255, 255, 255), font=font)
        sheet.paste(im, (x, y + lh)); x += max(im.width, 120) + gap
    y += rh + lh + gap
sheet.save(out); print(out, sheet.size)
