#!/usr/bin/env python3
"""Side-by-side composites of the renders against Brock's reference, at the same size, with small captions.
    python3 -I render/composite.py [--ref /home/claude/work/render/reference.png]
Writes render/out/compare_hero.png (hero | reference), render/out/compare_inside.png (inside | reference) and
render/out/iterations.png (the rounds, small).
"""
import argparse, os
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'out')
ap = argparse.ArgumentParser()
ap.add_argument('--ref', default='/home/claude/work/render/reference.png')
ap.add_argument('--size', type=int, default=1100)
args = ap.parse_args()

FONT = None
for f in ('/usr/share/fonts/opentype/inter/Inter-Medium.otf', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'):
    if os.path.exists(f):
        FONT = f
        break


def font(px):
    return ImageFont.truetype(FONT, px) if FONT else ImageFont.load_default()


def pair(left, right, labels, out, size):
    a = Image.open(left).convert('RGB').resize((size, size), Image.LANCZOS)
    b = Image.open(right).convert('RGB').resize((size, size), Image.LANCZOS)
    pad, cap = 16, 44
    W, H = 2 * size + 3 * pad, size + 2 * pad + cap
    im = Image.new('RGB', (W, H), (18, 18, 19))
    im.paste(a, (pad, pad))
    im.paste(b, (2 * pad + size, pad))
    d = ImageDraw.Draw(im)
    f = font(22)
    for i, t in enumerate(labels):
        d.text((pad + i * (size + pad) + 4, pad + size + 10), t, fill=(200, 200, 200), font=f)
    im.save(out, optimize=True)
    print(out, im.size, f'{os.path.getsize(out) / 1e6:.2f} MB')


def sheet(paths, labels, out, cell=300):
    n = len(paths)
    pad, cap = 10, 30
    im = Image.new('RGB', (n * cell + (n + 1) * pad, cell + 2 * pad + cap), (18, 18, 19))
    d = ImageDraw.Draw(im)
    f = font(16)
    for i, (p, t) in enumerate(zip(paths, labels)):
        if not os.path.exists(p):
            continue
        a = Image.open(p).convert('RGB')
        a.thumbnail((cell, cell), Image.LANCZOS)
        im.paste(a, (pad + i * (cell + pad), pad))
        d.text((pad + i * (cell + pad) + 2, pad + cell + 6), t, fill=(200, 200, 200), font=f)
    im.save(out, optimize=True)
    print(out, im.size, f'{os.path.getsize(out) / 1e6:.2f} MB')


if __name__ == '__main__':
    S = args.size
    if os.path.exists(os.path.join(OUT, 'hero_1400.png')):
        pair(os.path.join(OUT, 'hero_1400.png'), args.ref,
             ['R2: Cycles, the deck\'s GT01 refined (hero)', 'Reference (Brock\'s product render)'],
             os.path.join(OUT, 'compare_hero.png'), S)
    if os.path.exists(os.path.join(OUT, 'inside_1400.png')):
        pair(os.path.join(OUT, 'inside_1400.png'), args.ref,
             ['R2: Cycles, the internals through the clear cover', 'Reference (Brock\'s product render)'],
             os.path.join(OUT, 'compare_inside.png'), S)
    rounds = [('d2_hero.png', 'r1: first composition'), ('round1/hero_1400_r1.png', 'r1 final (main: one switch edge-on)'),
              ('e1_hero.png', 'r2: pair recomposed'), ('e3_hero.png', 'r2: top highlight too wide'),
              ('e5_hero.png', 'r2: highlights aimed per top'), ('hero_1400.png', 'r2 final')]
    sheet([os.path.join(OUT, p) for p, _ in rounds], [t for _, t in rounds], os.path.join(OUT, 'iterations.png'))
