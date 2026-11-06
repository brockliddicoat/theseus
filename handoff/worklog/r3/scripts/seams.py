# usage: python3 seams.py <ids.json> <outprefix> : seam sheets, each row = [settle of slide i | frame one of slide i+1], 2 pairs a row
import json, glob, os, re, sys
from PIL import Image, ImageDraw, ImageFont
ids = json.load(open(sys.argv[1])); out = sys.argv[2]
dirs = ['s0935', 's0955', 's1007', 't0-1007', 's1029', 'st1029']
def pick(i, kind):
    best, bt, bd = None, -1, -1
    for di, d in enumerate(dirs):
        for f in glob.glob(f'/home/claude/work/r3/shots/{d}/*_{i}_*.png'):
            m = re.match(r'\d+_(.+)_([\d.]+)\.png$', os.path.basename(f))
            if not m or m.group(1) != i: continue
            t = float(m.group(2))
            if kind == 't0' and t == 0 and di >= bd: best, bd = f, di
            if kind == 'st' and t > 0 and (di > bd or (di == bd and t > bt)): best, bt, bd = f, t, di
    return best
font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 16)
tw, th, gap, lab = 470, 264, 20, 22
pairs = [(ids[k], ids[k + 1]) for k in range(len(ids) - 1)]
per = 24
for s in range(0, len(pairs), per):
    chunk = pairs[s:s + per]; rows = (len(chunk) + 1) // 2
    sheet = Image.new('RGB', (2 * (2 * tw + gap) + 30, rows * (th + lab)), (70, 70, 70)); d = ImageDraw.Draw(sheet)
    for n, (a, b) in enumerate(chunk):
        x = (n % 2) * (2 * tw + gap + 30); y = (n // 2) * (th + lab)
        for k, (i, kind) in enumerate([(a, 'st'), (b, 't0')]):
            f = pick(i, kind)
            if f: sheet.paste(Image.open(f).convert('RGB').resize((tw - 2, th - 2)), (x + k * (tw + 4), y + lab))
        d.text((x + 4, y + 2), f'{s + n + 1}. {a} (end)  ->  {b} (start)', fill=(255, 255, 0), font=font)
    p = f'{out}_{s // per + 1}.jpg'; sheet.save(p, quality=85); print(p, sheet.size)
