#!/usr/bin/env python3
"""Builds the "Thesis Handoff" page (Brock, F67.1, 2026-11-10): a text-only HTML page plus a combined markdown copy and the raw
files, in handoff/thesis-handoff/out/. Sources: read-first.md, s3-decisions.md, s4-after-nov5.md (written for the handoff),
FEEDBACK.md, REVAMP.md, deck/DESIGN.md, WORK-LEFT.md, the feedback inbox, 3d/pcb/*.json, deck/geo2d/board2d.json and the film
manifest (deck/src/25-film.js). Run from anywhere: python3 handoff/thesis-handoff/build.py"""
import datetime, html, json, os, re, shutil, subprocess
from markdown_it import MarkdownIt

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
OUT = os.path.join(HERE, 'out')
TITLE = 'Thesis Handoff'


def rd(p):
    return open(os.path.join(ROOT, p), encoding='utf-8').read()


def git(*a):
    return subprocess.run(['git', '-C', ROOT, *a], capture_output=True, text=True).stdout.strip()


def cell(s):
    return str(s).replace('|', '\\|').replace('\n', ' ')


# ---------- generated tables ----------
def board_table():
    d = json.load(open(os.path.join(ROOT, '3d/pcb/pcb-layout.json')))
    rows = ['| Ref | Part | x | z | Note |', '|---|---|---:|---:|---|']
    for c in d['components']:
        x = c.get('x'); z = c.get('z')
        rows.append('| {} | {} | {} | {} | {} |'.format(cell(c['ref']), cell(c.get('value', '')),
                                                        '' if x is None else f'{x:.2f}', '' if z is None else f'{z:.2f}',
                                                        cell(c.get('label', ''))))
    return '\n'.join(rows)


def balance_table():
    d = json.load(open(os.path.join(ROOT, '3d/pcb/pcb-balance.json')))
    names = {'sideSw1': 'Side switch, front', 'sideSw2': 'Side switch, back', 'post MH1': 'Screw post MH1', 'post MH2': 'Screw post MH2',
             'post MH3': 'Screw post MH3', 'post MH4': 'Screw post MH4', 'shell': 'Shell (without its posts)', 'btn': 'Buttons',
             'board': 'Board (its 5.60 g target)', 'batt': 'Battery', 'wheel': 'Wheel and axle', 'screws': 'Screws',
             'ins': 'Brass inserts', 'wires': 'Side-button lead', 'coat': 'Board coat'}
    rows = ['| Part | Weight (g) | X | Y | Z |', '|---|---:|---:|---:|---:|']
    tot = 0.0
    for k, v in d['parts'].items():
        tot += v['g']
        x, y, z = v['at']
        rows.append(f'| {cell(names.get(k, k))} | {v["g"]:.3f} | {x:.2f} | {y:.2f} | {z:.2f} |')
    cx, cy, cz = d['com']
    rows.append(f'| **Total** | **{tot:.2f}** | | | |')
    rows.append(f'| Centre of mass (derived) | | {cx:.2f} | {cy:.2f} | {cz:.2f} |')
    return '\n'.join(rows)


def entry_index():
    """every entry of FEEDBACK.md after the Nov 5 publish (v20, 04:07): F28 to F35 and F38 on, in the file's order"""
    L = rd('FEEDBACK.md').split('\n')
    keep = lambda n: n >= 28 and n not in (36, 37)
    sec = None; out = []
    i = 0
    while i < len(L):
        l = L[i]
        m = re.match(r'^## F(\d+)(?:, F\d+)*\. (.*)$', l)
        if m:
            sec = (int(m.group(1)), m.group(2)) if keep(int(m.group(1))) else None
        elif l.startswith('## '):
            sec = None
        elif sec and re.match(r'^- \*\*(F\d+\.\d+|CORRECTION)', l):
            body = [l[2:]]
            j = i + 1
            while j < len(L) and L[j].startswith('  ') and not L[j].startswith('  - '):
                body.append(L[j].strip()); j += 1
            t = ' '.join(body)
            mm = re.match(r'^\*\*([^*]+)\*\*\s*(.*)$', t)
            head, rest = (mm.group(1), mm.group(2)) if mm else (t[:20], t)
            hm = re.match(r'^(F\d+\.\d+|CORRECTION[^ ]*(?: to [^ ]+)*)\s*(.*)$', head)
            eid = hm.group(1) if hm else head
            status = (hm.group(2) if hm else '').strip(' ,') or '(a note)'
            if eid.startswith('CORRECTION'):
                eid, status = 'Correction', head[len('CORRECTION'):].strip()
            rest = re.sub(r'\*\*', '', rest)
            rest = re.sub(r'`', '', rest)
            if len(rest) > 170:
                rest = rest[:170].rsplit(' ', 1)[0] + ' …'
            anchor = f'#log-F{sec[0]}'   # the section the entry sits under (F31's section also holds F30.13 to F30.25)
            topic = re.sub(r'\s*\(.*$', '', sec[1])
            out.append(f'| [{cell(eid)}]({anchor}) | {cell(status)} | {cell(topic)} | {cell(rest)} |')
            i = j; continue
        i += 1
    head = ['| Entry | Status as logged | Topic | Opening words (his, quoted, or the log\'s) |', '|---|---|---|---|']
    return '\n'.join(head + out), len(out)


def film_list():
    src = rd('deck/src/25-film.js')
    moves = {int(m.group(1)): (m.group(2), m.group(3)) for m in
             re.finditer(r"\{ n: (\d+), ch: '\w+', name: '([^']+)', title: '([^']+)'", src)}
    om = re.search(r'\n  order: \[(.*?)\n  \],', src, re.S)
    order = re.findall(r"\[(\d+), \[([^\]]*)\]\]", re.sub(r'/\*.*?\*/', '', om.group(1), flags=re.S)) if om else []
    titles = {}
    for fn in sorted(os.listdir(os.path.join(ROOT, 'deck/src'))):
        if not fn.endswith('.js'): continue
        s = rd('deck/src/' + fn)
        for m in re.finditer(r"\bid: '([\w-]+)'", s):
            seg = s[m.end(): m.end() + 600]
            nx = seg.find("id: '")
            if nx >= 0: seg = seg[:nx]
            t = re.search(r"title: '((?:[^'\\]|\\.)*)'\s*[,}]", seg)
            if t and m.group(1) not in titles:
                titles[m.group(1)] = t.group(1).replace("\\'", "'")
    lines, n = [], 0
    for mv, ids in order:
        ids = re.findall(r"'([\w-]+)'", ids)
        nm, tt = moves.get(int(mv), ('', ''))
        n += len(ids)
        lines.append(f'- **Move {mv}, {nm}:** {tt} ({len(ids)} slides). ' +
                     ', '.join(f'`{i}`' + (f' ({titles[i]})' if i in titles else '') for i in ids) + '.')
    return '\n'.join(lines), n


def demote_md(text, n):
    """markdown headings n levels down (max 6), outside code fences"""
    out, fence = [], False
    for l in text.split('\n'):
        if l.lstrip().startswith('```'): fence = not fence
        elif not fence and re.match(r'^#{1,6} ', l):
            k = len(l) - len(l.lstrip('#')); l = '#' * min(6, k + n) + l[k:]
        out.append(l)
    return '\n'.join(out)


# ---------- assemble ----------
def main():
    os.makedirs(os.path.join(OUT, 'files'), exist_ok=True)
    commit = git('rev-parse', '--short', 'HEAD')
    branches = ['g12-shape-gd', 'ra-research-redo', 'rb-research-redo', 'r1-switch-render', 'r2-switch-render']
    remote = git('ls-remote', '--heads', 'origin')
    on = [b for b in branches if f'refs/heads/{b}' in remote]
    bl = ('All five are on GitHub (pushed 2026-11-10 with this handoff); the files their agents left uncommitted (mostly '
          'images, and G13\'s partly re-traced hand data) are not.' if len(on) == len(branches) else
          'On GitHub: ' + (', '.join(on) or 'none') + '. The rest exist only in the session\'s workspace.')
    read_first = rd('handoff/thesis-handoff/read-first.md').replace('{COMMIT}', commit).replace('{BRANCHES}', bl)
    s3 = rd('handoff/thesis-handoff/s3-decisions.md').replace('{BOARD_TABLE}', board_table()).replace('{BALANCE_TABLE}', balance_table())
    s4 = rd('handoff/thesis-handoff/s4-after-nov5.md')
    idx, n_idx = entry_index()
    films, n_film = film_list()
    fb, rv, ds, wl, inbox = rd('FEEDBACK.md'), rd('REVAMP.md'), rd('deck/DESIGN.md'), rd('WORK-LEFT.md'), rd('handoff/worklog/feedback-inbox.md')
    when = datetime.datetime.now().strftime('%Y-%m-%d %H:%M')

    s4_more = (f'## Every entry after the Nov 5 publish\n\n{n_idx} entries of the log, F28 on (F28 is 04:14 on Nov 5, after v20), '
               'in the log\'s own order. Each links to its section in part 1, where the full entry is.\n\n' + idx +
               f'\n\n## The live film, move by move\n\nThe film\'s manifest (deck/src/25-film.js, FILM.order) as live in '
               f'1794039339-1c54: {n_film} slides in the ten moves, plus v23\'s five testing-pair slides that play before their rebuilds '
               f'(FILM_AB: lattice before b06_lattice, shlThin before b06_light, shbArches before b06_arches, tolerance before '
               f'b07_tolerance, grind before b07_poron), {n_film + 5} in all. Slide ids, with their titles where the source gives one plainly.\n\n'
               + films +
               '\n\n## The backlog as written on Nov 6 and 7 (WORK-LEFT.md, unchanged)\n\nWritten at the revamp\'s stop (Nov 6 '
               '14:00) and updated that evening; parts are done since (section 12 above is current).\n\n')

    files = [  # (served as, source, what)
        ('files/pcb-layout.json', '3d/pcb/pcb-layout.json', 'The new board\'s layout, build A (the deck\'s board): outline, every part, routes, vias, the battery, power paths.'),
        ('files/board2d.json', 'deck/geo2d/board2d.json', 'Its flat 2D geometry: builds A and B as 2D data (outline, holes, cuts, both faces), made by deck/tools/geo2d/board2d.py from the board tools. The layout has changed since only in the battery\'s entry, which this file doesn\'t carry.'),
        ('files/pcb-layout-b.json', '3d/pcb/pcb-layout-b.json', 'Build B\'s layout (the power switch hanging off the edge; used for renders).'),
        ('files/pcb-mass.json', '3d/pcb/pcb-mass.json', 'The board\'s mass as built (mass.py).'),
        ('files/pcb-balance.json', '3d/pcb/pcb-balance.json', 'The weight budget with each part\'s place, and the centre of mass (balance.py).'),
        ('files/FEEDBACK.md', 'FEEDBACK.md', 'Part 1, raw.'),
        ('files/feedback-inbox.md', 'handoff/worklog/feedback-inbox.md', 'The inbox: each message as it landed, from Nov 6.'),
        ('files/REVAMP.md', 'REVAMP.md', 'Part 2, raw.'),
        ('files/DESIGN.md', 'deck/DESIGN.md', 'Part 2, raw.'),
        ('files/WORK-LEFT.md', 'WORK-LEFT.md', 'The backlog, raw.'),
        ('files/thesis-handoff.md', None, 'This whole page as one markdown file.'),
    ]
    att_md = '\n'.join(f'- [{os.path.basename(a)}]({a}): {w}' for a, s, w in files)

    parts = [  # (id, heading, markdown, demote, verbatim-note)
        ('read-first', 'Read first', read_first, 1, None),
        ('s1', '1. The full feedback log', fb, 2, 'FEEDBACK.md, unchanged: every message of Brock\'s, verbatim, with what each changed. Its own '
         'sections run F34 to F64, then F0 to F33, then F65 to F67. Headings are set two levels down here; nothing else differs.'),
        ('s2', '2. REVAMP.md and DESIGN.md', None, 2, None),
        ('s3', '3. Current decisions', s3, 1, None),
        ('s4', '4. Decided after the Nov 5 publish', s4 + '\n\n' + s4_more, 1, None),
        ('files', 'Attached files', att_md, 1, None),
    ]

    md = MarkdownIt('commonmark', {'html': False}).enable(['table', 'strikethrough'])
    md.disable('image')

    def render(text, demote):
        h = md.render(text)
        return re.sub(r'<(/?)h([1-6])>', lambda m: f'<{m.group(1)}h{min(6, int(m.group(2)) + demote)}>', h)

    def slug(s):
        return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')[:60]

    body, toc, combined = [], [], [f'# {TITLE}\n']
    for pid, head, text, dem, note in parts:
        toc_sub = []
        if pid == 's2':
            inner = (f'<h3 id="revamp">REVAMP.md</h3>\n<p class="note">REVAMP.md, unchanged (last changed {git("log", "-1", "--format=%ci", "--", "REVAMP.md")[:16]}): '
                     'the plan of the Nov 6 revamp. Brock judged the revamp a regression (F63); the live film is built on v23 '
                     'with the revamp\'s parts salvaged.</p>\n' + render(rv, 3) +
                     f'<h3 id="design">deck/DESIGN.md</h3>\n<p class="note">deck/DESIGN.md, unchanged (last changed '
                     f'{git("log", "-1", "--format=%ci", "--", "deck/DESIGN.md")[:16]}): the design system.</p>\n' + render(ds, 3))
            toc_sub = [('revamp', 'REVAMP.md'), ('design', 'deck/DESIGN.md')]
            combined.append(f'\n\n## {head}\n\n### REVAMP.md\n\n{demote_md(rv, 3)}\n\n### deck/DESIGN.md\n\n{demote_md(ds, 3)}\n')
        else:
            inner = (f'<p class="note">{html.escape(note)}</p>\n' if note else '') + render(text, dem)
            if pid == 's1':
                def fid(m):
                    level, txt = m.group(1), m.group(2)
                    ids = re.findall(r'F(\d+)', txt.split('.')[0])
                    if not re.match(r'F\d+', txt) or not ids: return m.group(0)
                    extra = ''.join(f'<a id="log-F{x}"></a>' for x in ids[1:])
                    return f'<h{level} id="log-F{ids[0]}">{extra}{txt}</h{level}>'
                inner = re.sub(r'<h([3-6])>(F\d+.*?)</h\1>', fid, inner)
            if pid in ('s3', 's4'):
                def hid(m):
                    sid = f'{pid}-{slug(html.unescape(m.group(2)))}'
                    toc_sub.append((sid, html.unescape(m.group(2))))
                    return f'<h3 id="{sid}">{m.group(2)}</h3>'
                inner = re.sub(r'<h(3)>([^<]*)</h3>', hid, inner)
            if pid == 's4':
                inner += render(wl, 3)          # WORK-LEFT.md under its own heading, kept out of the contents
            body_md = demote_md(text, 1) if pid in ('s3', 's4') else (demote_md(text, 2) if pid == 's1' else text)
            combined.append(f'\n\n## {head}\n\n' + (f'{note}\n\n' if note else '') + body_md + ('\n\n' + demote_md(wl, 3) if pid == 's4' else '') + '\n')
        body.append(f'<section id="{pid}">\n<h2>{html.escape(head)}</h2>\n{inner}\n</section>')
        toc.append((pid, head, toc_sub))

    toc_html = '<nav><h2>Contents</h2><ul class="toc">' + ''.join(
        f'<li><a href="#{pid}">{html.escape(h)}</a>' + (('<ul>' + ''.join(f'<li><a href="#{s}">{html.escape(t)}</a></li>' for s, t in sub) + '</ul>') if sub else '') + '</li>'
        for pid, h, sub in toc) + '</ul></nav>'

    css = """
:root{--ink:#1b1c1f;--mute:#5d5f66;--line:#d9dadf;--bg:#fbfbfc;--card:#f1f2f4;--blue:#2563eb}
@media (prefers-color-scheme:dark){:root{--ink:#e9e9ec;--mute:#a3a5ad;--line:#34363c;--bg:#141518;--card:#1d1f23;--blue:#6ea0ff}}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.6 system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}
main{max-width:52rem;margin:0 auto;padding:1.25rem 1rem 4rem}
h1{font-size:2rem;line-height:1.2;margin:.5rem 0 .25rem}
.sub{color:var(--mute);margin:0 0 1.5rem}
h2{font-size:1.45rem;line-height:1.25;margin:3rem 0 1rem;padding-top:1rem;border-top:2px solid var(--line)}
h3{font-size:1.2rem;margin:2rem 0 .6rem}h4{font-size:1.05rem;margin:1.6rem 0 .5rem}h5,h6{font-size:1rem;margin:1.2rem 0 .4rem}
a{color:var(--blue);text-decoration:none}a:hover{text-decoration:underline}
p,li{overflow-wrap:anywhere}ul,ol{padding-left:1.4rem}li{margin:.2rem 0}
code{font:0.9em ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:var(--card);padding:.05em .3em;border-radius:4px;overflow-wrap:anywhere}
pre{background:var(--card);padding:.8rem;border-radius:8px;overflow-x:auto;white-space:pre-wrap;word-break:break-word}pre code{background:none;padding:0}
table{display:block;overflow-x:auto;border-collapse:collapse;margin:1rem 0;font-size:.88rem;max-width:100%}
th,td{border:1px solid var(--line);padding:.35rem .55rem;vertical-align:top;text-align:left}th{background:var(--card)}
blockquote{margin:1rem 0;padding:.2rem 1rem;border-left:3px solid var(--line);color:var(--mute)}
.note{background:var(--card);border-radius:8px;padding:.7rem .9rem;color:var(--mute);font-size:.95rem}
nav{background:var(--card);border-radius:10px;padding:.4rem 1rem 1rem;margin:1rem 0 2rem}nav h2{border:0;margin:.8rem 0 .4rem;padding:0;font-size:1.1rem}
.toc ul{margin:.2rem 0 .4rem;font-size:.92rem}
"""
    page = (f'<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n'
            f'<title>{TITLE}</title>\n<style>{css}</style>\n</head>\n<body>\n<main>\n<h1>{TITLE}</h1>\n'
            f'<p class="sub">Theseus: the concept flagship wireless gaming mouse and its presentation. Built {when} (Chicago) from '
            f'brockliddicoat/theseus at {commit}. Text only.</p>\n{toc_html}\n' + '\n'.join(body) + '\n</main>\n</body>\n</html>\n')
    open(os.path.join(OUT, 'index.html'), 'w', encoding='utf-8').write(page)
    combined_md = '\n'.join(combined)
    open(os.path.join(OUT, 'files', 'thesis-handoff.md'), 'w', encoding='utf-8').write(combined_md)
    for a, s, _ in files:
        if s: shutil.copyfile(os.path.join(ROOT, s), os.path.join(OUT, a))

    # checks: size, nothing that looks like a secret or an address, no images or scripts
    print('index.html', len(page.encode()), 'bytes;', 'entries', n_idx, '; film slides', n_film, '; commit', commit, '; branches on origin', len(on))
    for pat in [r'[\w.+-]+@[\w-]+\.[\w.]+', r'\bsk-[A-Za-z0-9]{8,}', r'(?i)bearer\s+[A-Za-z0-9._-]{12,}', r'(?i)api[_-]?key', r'ghp_[A-Za-z0-9]{10,}', r'<img', r'<script']:
        hits = sorted(set(re.findall(pat, page)))
        if hits: print('CHECK', pat, hits[:8])


if __name__ == '__main__':
    main()
