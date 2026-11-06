# usage: python3 sheet.py <out.jpg> <f1> <f2> <f3> <f4> [labels...]
# tiles four 1920x1080 frames 2x2 into one 1920x1080 sheet, with a small time label on each tile
import sys
from PIL import Image, ImageDraw, ImageFont
out = sys.argv[1]; files = sys.argv[2:6]; labels = sys.argv[6:10]
W, H = 1920, 1080
sheet = Image.new('RGB', (W, H), (128, 128, 128))
try:
    font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 22)
except Exception:
    font = ImageFont.load_default()
for i, f in enumerate(files):
    im = Image.open(f).convert('RGB').resize((W // 2 - 4, H // 2 - 4), Image.LANCZOS)
    x = (i % 2) * (W // 2) + 2; y = (i // 2) * (H // 2) + 2
    sheet.paste(im, (x, y))
    if i < len(labels):
        d = ImageDraw.Draw(sheet)
        d.rectangle([x, y, x + 150, y + 30], fill=(255, 0, 255))
        d.text((x + 6, y + 3), labels[i], fill=(255, 255, 255), font=font)
sheet.save(out, quality=90)
print(out)
