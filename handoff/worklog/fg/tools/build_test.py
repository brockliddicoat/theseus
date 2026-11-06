"""FG's test page: the deck's shared files (from deck/.snapshot/src, or --src=deck/src) + FG's test slides.
usage: python3 build_test.py [--src=snapshot|src] [--kit=/path/to/06-motion.js] [--with=a.js,b.js] -> /home/claude/work/fg/dist/fg-test.html
Mirrors tools/build.py's build() (the kit target's part list), without touching deck/."""
import sys, pathlib, json
deck = pathlib.Path('/home/claude/theseus/deck')
opt = dict(a[2:].split('=', 1) for a in sys.argv[1:] if a.startswith('--') and '=' in a)
base = deck / ('src' if opt.get('src') == 'src' else '.snapshot/src')
fg = pathlib.Path('/home/claude/work/fg')
def rd(name):
    if name == '06-motion.js' and opt.get('kit'): return pathlib.Path(opt['kit']).read_text()
    p = base / name
    return p.read_text() if p.exists() else ''
def rdata():
    out = {}
    d = deck.parent / 'research' / 'data'
    for p in sorted(d.glob('*.json')):
        try: out[p.stem] = json.loads(p.read_text())
        except Exception: pass
    return 'const RDATA = ' + json.dumps(out, ensure_ascii=False, separators=(',', ':')) + ';\n'
def geo2d():
    out = {}
    d = deck / '.snapshot' / 'geo2d'
    if not d.exists(): d = deck / 'geo2d'
    for p in sorted(d.glob('*.json')): out[p.stem] = json.loads(p.read_text())
    return 'const GEO2D = ' + json.dumps(out, ensure_ascii=False, separators=(',', ':')) + ';\n'
parts = ['01-core.js', '03-parts.js', '04-ui.js', '07-charts.js', '07-sim.js', '08-r3d.js', '08-v2d.js', '05-data.js', '06-audio.js', '05-f27.js', '06-motion.js']
extra = [s for s in opt.get('with', '').split(',') if s]          # deck files with drawings the sheet borrows (e.g. 10-b-click.js)
mine = [fg / 'src' / n for n in sorted(p.name for p in (fg / 'src').glob('*.js'))]
head = rd('00-head.html').replace('%%TITLE%%', 'FG finger test')
js = rdata() + geo2d() + '\n'.join(rd(p) for p in parts + extra) + '\n' + '\n'.join(p.read_text() for p in mine) + '\n' + rd('20-app.js')
i = head.index('<div id="app">')
out = '<!DOCTYPE html>\n<html lang="en">\n<head>\n' + head[:i] + '</head>\n<body>\n' + head[i:] + '\n<script>\n' + js + '\n</script>\n</body>\n</html>\n'
(fg / 'dist').mkdir(exist_ok=True)
(fg / 'dist' / 'fg-test.html').write_text(out)
print('fg-test.html', len(out), 'base', base, 'mine', [p.name for p in mine])
