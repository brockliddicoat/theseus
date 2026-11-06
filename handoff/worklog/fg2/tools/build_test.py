"""FG2's test page: the deck's shared files (deck/.snapshot/src; 06-motion.js from --kit or the snapshot) + FG2's test files.
usage: python3 build_test.py [--kit=/path/to/06-motion.js] [--with=a.js,b.js] [--out=name] -> /home/claude/work/fg2/dist/<name>.html
Mirrors tools/build.py's build() part list, without touching deck/."""
import sys, pathlib, json
deck = pathlib.Path('/home/claude/theseus/deck')
opt = dict(a[2:].split('=', 1) for a in sys.argv[1:] if a.startswith('--') and '=' in a)
base = deck / '.snapshot/src'
me = pathlib.Path('/home/claude/work/fg2')
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
    for p in sorted(d.glob('*.json')): out[p.stem] = json.loads(p.read_text())
    return 'const GEO2D = ' + json.dumps(out, ensure_ascii=False, separators=(',', ':')) + ';\n'
parts = ['01-core.js', '03-parts.js', '04-ui.js', '07-charts.js', '07-sim.js', '08-r3d.js', '08-v2d.js', '05-data.js', '06-audio.js', '05-f27.js', '06-motion.js']
extra = [s for s in opt.get('with', '').split(',') if s]
mine = [me / 'src' / n for n in sorted(p.name for p in (me / 'src').glob('*.js'))]
head = rd('00-head.html').replace('%%TITLE%%', 'FG2 nail test')
js = rdata() + geo2d() + '\n'.join(rd(p) for p in parts + extra) + '\n' + '\n'.join(p.read_text() for p in mine) + '\n' + rd('20-app.js')
i = head.index('<div id="app">')
out = '<!DOCTYPE html>\n<html lang="en">\n<head>\n' + head[:i] + '</head>\n<body>\n' + head[i:] + '\n<script>\n' + js + '\n</script>\n</body>\n</html>\n'
name = opt.get('out', 'fg2-test')
(me / 'dist' / (name + '.html')).write_text(out)
print(name + '.html', len(out), 'mine', [p.name for p in mine])
