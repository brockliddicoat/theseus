"""Generate REVAMP.md (repo root) and one brief per builder from outline2.py, FEEDBACK.md (F27 notes, verbatim) and the
current film's slide list. Checks that every visible old slide is replaced exactly once.
usage: python3 make_briefs.py /path/to/slidelist.json"""
import json, re, sys, pathlib
HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent.parent
sys.path.insert(0, str(HERE))
from outline2 import B

sl = json.load(open(sys.argv[1]))
visible = [s[0] for s in sl['s']]
titles = {s[0]: s[2] for s in sl['s']}
fb = (ROOT / 'FEEDBACK.md').read_text()
notes = {}
for ln in fb.splitlines():
    m = re.match(r"\s*- `(\w+)` \((\w+), slide (\d+)\) \*\*(\d+)/10\*\*(?::\s*(.*))?$", ln)
    if m: notes[m.group(1)] = (int(m.group(4)), (m.group(5) or '').strip())

# FEEDBACK lines (outside F27's verbatim list) that name an old slide id in backticks or parentheses
fb_lines = fb.splitlines()
f27_start = next(i for i, l in enumerate(fb_lines) if l.startswith('## F27'))
f27_end = next(i for i, l in enumerate(fb_lines) if i > f27_start and l.startswith('## F28'))
def related(old):
    out = []
    pat = re.compile(r'`' + re.escape(old) + r'`|\(' + re.escape(old) + r'[,:)\s]')
    cur = None
    for i, l in enumerate(fb_lines):
        if f27_start <= i < f27_end: continue
        m = re.match(r'- \*\*(F\d+\.\d+)', l.strip())
        if m: cur = m.group(1)
        if pat.search(l) and cur and cur not in out: out.append(cur)
    return out

# coverage
cov = {}
order = []
for code, v in B.items():
    for sid, ch, title, point, repl in v['slides']:
        order.append((code, sid, ch, title))
        for r in repl: cov.setdefault(r, []).append(sid)
problems = []
unc = [i for i in visible if i not in cov]
unknown = [o for o in cov if o not in visible]
dbl = {o: v for o, v in cov.items() if len(v) > 1}
if unc: problems.append('not replaced: ' + ', '.join(unc))
if unknown: problems.append('replaces ids not in the film: ' + ', '.join(unknown))
if dbl: problems.append('replaced twice: ' + json.dumps(dbl))
print('visible old slides', len(visible), '| new slides', len(order))
print('\n'.join(problems) if problems else 'coverage OK: every visible old slide replaced exactly once')

# film order: chapters in the deck's order, files in name order within a chapter
chs = [c[0] for c in sl['ch']]
film = sorted(order, key=lambda o: (chs.index(o[2]), B[o[0]]['file']))
pos = {o[1]: i for i, o in enumerate(film)}

def fmt_old(r):
    if r in notes:
        rt, n = notes[r]
        s = f"- replaces `{r}` (“{titles.get(r, r)}”) **{rt}/10**" + (f": {n}" if n else " (rated, no note)")
    else:
        s = f"- replaces `{r}` (“{titles.get(r, r)}”), not rated"
    rel = related(r)
    if rel: s += f"\n  - FEEDBACK items that name it: {', '.join(rel)} (read them)"
    return s

md = ['# REVAMP v2: the new film (2026-11-06)\n',
      'Brock: "pick back up with the revamp that was planned for yesterday ... you should still have well over 100 slides, every',
      'animation should be vastly improved and more intuitive ... set the bar for this new presentation 10x higher". The spine is',
      'ZERO compromises; every slide shows the rival\'s fault, then Theseus\'s fix, then what the player gets; every slide works as a',
      'standalone silent clip and the whole film flows. The common brief is handoff/revamp2/common.md; the per-builder briefs and',
      'the outline (outline2.py) are beside it. Yesterday\'s 76-slide plan is in handoff/briefs/revamp-claude-2026-11-05/.\n',
      f'{len(visible)} visible old slides become {len(order)} new ones. Each new slide `replaces` the old slides it absorbs and `answers`',
      'every clause of Brock\'s notes on them (FEEDBACK F27), shown in the rating panel.\n']
md.append('\n## Film order\n')
for i, (code, sid, ch, title) in enumerate(film):
    md.append(f"{i + 1}. `{sid}` ({ch}, {code}) {title}")
for code, v in B.items():
    md.append(f"\n## {code.upper()}: {v['name']} (deck/src/{v['file']}, {len(v['slides'])} slides)\n")
    for sid, ch, title, point, repl in v['slides']:
        md.append(f"- `{sid}` ({ch}) **{title}**: {point} Replaces: {', '.join('`' + r + '`' for r in repl) or '(new)'}.")
    if v['extra']: md.append(f"\n  {v['extra']}")
(ROOT / 'REVAMP.md').write_text('\n'.join(md) + '\n')

for code, v in B.items():
    first, last = v['slides'][0][0], v['slides'][-1][0]
    prev_ = film[pos[first] - 1] if pos[first] > 0 else None
    next_ = film[pos[last] + 1] if pos[last] + 1 < len(film) else None
    br = [f"# {code.upper()}: {v['name']}\n",
          'Read /home/claude/theseus/handoff/revamp2/common.md first, then this. Then FEEDBACK.md: every STANDING and DECIDED item',
          '(`grep -n -E "STANDING|DECIDED" FEEDBACK.md`), F32 to F35, and every item this brief names. Never regress a decision.\n',
          f"Your file: deck/src/{v['file']}. Your work folder: /home/claude/work/{code}/ (PROGRESS.md, CHECKPOINT1.md, shots/).",
          f"Build: `cd /home/claude/theseus/deck && python3 tools/build.py main --out={code} --own={v['file']}`.\n",
          '## Where your slides sit in the film',
          (f"- Before your first slide: `{prev_[1]}` ({prev_[0]}): {prev_[3]}." if prev_ else '- Your first slide opens the film.'),
          (f"- After your last slide: `{next_[1]}` ({next_[0]}): {next_[3]}." if next_ else '- Your last slide closes the film.'),
          '- Within your file the slides play in the order below; hand each one to the next (common.md, M9 and "Clips and flow").\n',
          '## Your slides, in film order, with the old slides each replaces and Brock\'s rating and note on each, verbatim\n']
    for sid, ch, title, point, repl in v['slides']:
        br.append(f"### `{sid}` (chapter `{ch}`): {title}\n{point}\n")
        for r in repl: br.append(fmt_old(r))
        if not repl: br.append('- a new slide (it replaces nothing); its notes come from the slide named in the direction')
        br.append('')
    if v['extra']: br.append(f"## Also\n{v['extra']}\n")
    (HERE / f"{code}-brief.md").write_text('\n'.join(br) + '\n')
print('wrote REVAMP.md and', len(B), 'briefs')
