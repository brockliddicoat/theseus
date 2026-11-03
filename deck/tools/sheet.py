# usage: python3 sheet.py out.png cols tile_w img1 img2 ... ; tiles screenshots with labels
import sys
from PIL import Image, ImageDraw
out, cols, tw, imgs = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), sys.argv[4:]
th = tw * 9 // 16
rows = (len(imgs) + cols - 1) // cols
S = Image.new('RGB', (cols * tw, rows * (th + 22)), (40, 40, 44))
d = ImageDraw.Draw(S)
for i, p in enumerate(imgs):
    im = Image.open(p).convert('RGB').resize((tw, th), Image.LANCZOS)
    x, y = (i % cols) * tw, (i // cols) * (th + 22)
    S.paste(im, (x, y + 22)); d.text((x + 6, y + 4), p.split('/')[-1], fill=(230, 230, 230))
S.save(out)
print(out, S.size)
