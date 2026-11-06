# usage: python3 contact.py <out.jpg> <cols> <files...> : grid of thumbnails (480x270) with the slide id under each
import sys, re, os
from PIL import Image, ImageDraw, ImageFont
out, cols, files = sys.argv[1], int(sys.argv[2]), sys.argv[3:]
tw, th, lab = 480, 270, 26
rows = (len(files) + cols - 1) // cols
sheet = Image.new('RGB', (cols * tw, rows * (th + lab)), (90, 90, 90))
try: font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 18)
except Exception: font = ImageFont.load_default()
d = ImageDraw.Draw(sheet)
for i, f in enumerate(files):
    im = Image.open(f).convert('RGB').resize((tw - 4, th - 4), Image.LANCZOS)
    x, y = (i % cols) * tw, (i // cols) * (th + lab)
    sheet.paste(im, (x + 2, y + 2))
    name = re.sub(r'^\d+_', '', os.path.basename(f)).replace('.png', '')
    d.text((x + 6, y + th + 2), name, fill=(255, 255, 0), font=font)
sheet.save(out, quality=88); print(out, sheet.size)
