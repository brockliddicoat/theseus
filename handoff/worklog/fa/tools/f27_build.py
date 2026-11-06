"""F27 frames: one settle frame per rated slide, from the version he most likely rated it on, both where they differ.
Reads work/fa/f27/{v18,v19}.jsonl (snap.js output), writes theseus/feedback/frames/F27/*.jpg and README.md."""
import json, os
import numpy as np
from PIL import Image

W = '/home/claude/work/fa'
OUT = '/home/claude/theseus/feedback/frames/F27'
os.makedirs(OUT, exist_ok=True)
rated = json.load(open(f'{W}/f27-rated.json'))
def frames(v):
    d = {}
    for l in open(f'{W}/f27/{v}.jsonl'):
        if l.startswith('{'):
            r = json.loads(l); d[r['id']] = r
    return d
F = {v: frames(v) for v in ('v18', 'v19')}
missing = [(v, x['id']) for v in F for x in rated if x['id'] not in F[v]]
if missing: raise SystemExit(f'missing frames: {missing}')

def diffpx(a, b):
    x = np.asarray(Image.open(a).convert('L'), dtype=np.int16); y = np.asarray(Image.open(b).convert('L'), dtype=np.int16)
    return int((np.abs(x - y) > 40).sum())

def jpg(png, name):
    im = Image.open(png).convert('RGB')
    im = im.resize((1280, round(im.height * 1280 / im.width)), Image.LANCZOS)
    im.save(os.path.join(OUT, name), quality=82, optimize=True, progressive=True)

rows, nsame, ndiff, nsmall = [], 0, 0, 0
for x in rated:
    sid, n = x['id'], x['n']
    a, b = F['v18'][sid], F['v19'][sid]
    d = diffpx(a['png'], b['png'])
    same = d <= 50
    intro = n <= 15                      # rated by 01:13 on v18 (F24); v19 went live at 01:28
    main = 'v18' if intro else 'v19'
    names = []
    small = 50 < d <= 2000
    if same or small:
        nsame += same; nsmall += small
        name = f'{n:03d}_{sid}.jpg'; jpg(F[main][sid]['png'], name); names.append(name)
        ver = 'v18 = v19' if same else f'{main} (likely); the other differs only in a small detail ({d} px)'
    else:
        ndiff += 1
        for v in (('v18', 'v19') if intro else ('v19', 'v18')):
            name = f'{n:03d}_{sid}_{v}.jpg'; jpg(F[v][sid]['png'], name); names.append(name)
        ver = f'{main} (likely); v18 and v19 differ ({d} px), both kept'
    title = (F[main][sid]['title'] or '').replace('|', '/')
    links = ', '.join(f'[{m}]({m})' for m in names)
    rows.append(f"| {n} | `{sid}` | {x['ch']} | {x['score']}/10 | {F[main][sid]['t']:g} | {links} | {ver} | {title} |")

head = f"""# F27: the rated slides as Brock saw them

Frames for FEEDBACK.md F27 (F50.1, job 3). On 2026-11-05, between 00:50 and 03:45 (Chicago), Brock rated 114 slides of
the old deck (143 slides) from 1 to 10 with the player's rating tool, 100 of them with a note. His notes, verbatim, are in
FEEDBACK.md F27; the slide numbers below are his ("slide 17"). One frame per slide, at its settle time (where its
animation comes to rest), 1280 px JPG.

- **Builds:** the published pages themselves, committed with each publish: v18 = `git show e6094e6:deck/dist/main.html`
  (published 00:45), v19 = `git show 6ec4864:deck/dist/main.html` (published 01:28; it changed the scroll wheel, the
  budget, frame sync and the note-saving bug). v20 went live at 04:07, after the last rating. Both have the same 143 slides
  in the same order.
- **Which version he rated:** the ratings carry no time of their own (the database kept one time for all). F24 (01:13)
  shows he had rated the intro through `map` (slide 15) before v19 went live, so the intro's frames are v18's and the rest
  v19's. {nsame} slides are pixel-identical in both; {nsmall} differ only in a small detail (under 2,000 px), and only the
  likely version is kept; {ndiff} differ visibly (v19's new six-arm wheel wherever the wheel is drawn, frame sync's 42 µs,
  the new budget and the numbers that follow from it), and both frames are kept.
- **The view:** the player opened in 3D by default then (2D if he had switched to it, remembered by his browser), so a
  slide with a 3D shot may have shown that shot instead of its 2D twin. The 3D assets on disk today are not 11-05's, so
  the 3D view can't be reproduced faithfully: these frames are the 2D view (`?2d=1`).
- Rendered 2026-11-06 with feedback/snap.js (one browser, the deck's capture hook `?cap=1&s=<id>&t=<settle>&2d=1`).

| Slide | Id | Chapter | His score | t (s) | Frame | Version | Title |
|---|---|---|---|---|---|---|---|
"""
open(os.path.join(OUT, 'README.md'), 'w').write(head + '\n'.join(rows) + '\n')
print('same', nsame, 'small', nsmall, 'differ', ndiff, 'files', len(os.listdir(OUT)))
