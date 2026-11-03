#!/usr/bin/env python3
"""Flag (and with --delete remove) blank or broken shots: lost WebGL canvases screenshot as a flat page."""
import sys, glob, os
from PIL import Image, ImageStat
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'shots')
bad = []
for f in sorted(glob.glob(os.path.join(root, '*.png'))):
    im = Image.open(f).convert('L').resize((320, 180))
    sd = ImageStat.Stat(im).stddev[0]
    if sd < 4.0 or Image.open(f).size != (3200, 1800):
        bad.append((os.path.basename(f), round(sd, 2), Image.open(f).size))
for b in bad:
    print('BAD', *b)
    if '--delete' in sys.argv:
        os.remove(os.path.join(root, b[0]))
print(len(glob.glob(os.path.join(root, '*.png'))), 'files,', len(bad), 'bad')
