# usage: python3 phonegrid.py <out.jpg> <phone pngs...> : 2 columns of 845x475 phone views, labelled
import sys, os
from PIL import Image, ImageDraw, ImageFont
out, files = sys.argv[1], sys.argv[2:]
W, H, lab = 845, 475, 24
rows = (len(files) + 1) // 2
sheet = Image.new('RGB', (2 * W + 6, rows * (H + lab)), (90, 90, 90))
try: font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 18)
except Exception: font = ImageFont.load_default()
d = ImageDraw.Draw(sheet)
for i, f in enumerate(files):
    im = Image.open(f).convert('RGB')
    x, y = (i % 2) * (W + 6), (i // 2) * (H + lab)
    sheet.paste(im, (x, y + lab))
    d.text((x + 6, y + 2), os.path.basename(f).replace('_phone.png', ''), fill=(255, 255, 0), font=font)
sheet.save(out, quality=88); print(out, sheet.size)
