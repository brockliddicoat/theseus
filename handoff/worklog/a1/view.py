#!/usr/bin/env python3
"""Downscale or crop deck frames for viewing.
usage: view.py small <in.png> [<out.png>] [width=960]
       view.py crop <in.png> <out.png> x y w h [scale]   (x y w h in 1920x1080 stage px; scale >1 enlarges)
       view.py grid <out.png> <in1> <in2> ... (each downscaled to 640 wide, stacked 2 per row)"""
import sys
from PIL import Image

def small(src, dst=None, width=960):
    im = Image.open(src).convert('RGB')
    w, h = im.size
    im = im.resize((width, round(h * width / w)), Image.LANCZOS)
    dst = dst or src.replace('.png', f'_s{width}.png')
    im.save(dst)
    print(dst)

def crop(src, dst, x, y, w, h, scale=1.0):
    im = Image.open(src).convert('RGB')
    W, H = im.size
    f = W / 1920
    box = tuple(round(v * f) for v in (x, y, x + w, y + h))
    c = im.crop(box)
    if scale != 1.0:
        c = c.resize((round(c.width * scale), round(c.height * scale)), Image.LANCZOS)
    c.save(dst)
    print(dst, c.size)

def grid(dst, srcs, cw=640):
    ims = []
    for s in srcs:
        im = Image.open(s).convert('RGB')
        ims.append(im.resize((cw, round(im.height * cw / im.width)), Image.LANCZOS))
    rows = (len(ims) + 1) // 2
    h = max(i.height for i in ims)
    out = Image.new('RGB', (cw * 2 + 8, rows * (h + 8)), (128, 128, 128))
    for k, im in enumerate(ims):
        out.paste(im, ((k % 2) * (cw + 8), (k // 2) * (h + 8)))
    out.save(dst)
    print(dst, out.size)

if __name__ == '__main__':
    a = sys.argv[1:]
    if a[0] == 'small':
        small(a[1], a[2] if len(a) > 2 else None, int(a[3]) if len(a) > 3 else 960)
    elif a[0] == 'crop':
        crop(a[1], a[2], *[float(v) for v in a[3:7]], float(a[7]) if len(a) > 7 else 1.0)
    elif a[0] == 'grid':
        grid(a[1], a[2:])
