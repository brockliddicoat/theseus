#!/usr/bin/env python3
"""Side-by-side: an R1 render beside the reference, both at the same size, with small captions.
    python3 composite.py out/gt01_hero_1400.png /home/claude/work/render/reference.png out/compare_hero_vs_reference.png
"""
import sys
from PIL import Image, ImageDraw, ImageFont


def main(a, b, out, size=1400):
    A = Image.open(a).convert('RGB').resize((size, size), Image.LANCZOS)
    B = Image.open(b).convert('RGB').resize((size, size), Image.LANCZOS)
    bar = 56
    C = Image.new('RGB', (2 * size + 16, size + bar), (14, 14, 15))
    C.paste(A, (0, bar)); C.paste(B, (size + 16, bar))
    d = ImageDraw.Draw(C)
    try:
        f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 26)
    except Exception:
        f = ImageFont.load_default()
    d.text((20, 14), 'R1: GT01, Blender 5.2 Cycles (modelled from scratch)', fill=(225, 225, 228), font=f)
    d.text((size + 36, 14), 'Reference', fill=(225, 225, 228), font=f)
    C.save(out, optimize=True)
    print('wrote', out, C.size)


if __name__ == '__main__':
    main(*sys.argv[1:4])
