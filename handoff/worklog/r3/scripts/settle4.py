# usage: python3 settle4.py <out.jpg> <shotdir> id1 id2 id3 id4 : 2x2 sheet of the latest (settle) frame of each slide, labelled
import sys, glob, os, re
from PIL import Image, ImageDraw, ImageFont
out, d, ids = sys.argv[1], sys.argv[2], sys.argv[3:7]
W, H = 1920, 1080
sheet = Image.new('RGB', (W, H), (128, 128, 128)); dr = ImageDraw.Draw(sheet)
font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 22)
for i, sid in enumerate(ids):
    fs = [f for f in glob.glob(f'{d}/*_{sid}_*.png') if re.match(r'\d+_%s_[\d.]+\.png$' % re.escape(sid), os.path.basename(f))]
    if not fs: continue
    f = max(fs, key=lambda p: float(re.search(r'_([\d.]+)\.png$', p).group(1)))
    im = Image.open(f).convert('RGB').resize((W // 2 - 4, H // 2 - 4), Image.LANCZOS)
    x, y = (i % 2) * (W // 2) + 2, (i // 2) * (H // 2) + 2
    sheet.paste(im, (x, y)); dr.rectangle([x, y, x + 260, y + 30], fill=(255, 0, 255)); dr.text((x + 6, y + 3), sid, fill=(255, 255, 255), font=font)
sheet.save(out, quality=90); print(out)
