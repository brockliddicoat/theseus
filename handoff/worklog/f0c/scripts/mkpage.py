"""usage: python3 mkpage.py <out.html> [--own=a.js,b.js] [--extra=/abs/test.js,...] [--with=30-b09-signal.js,...]
Builds the film like tools/build.py main: every file from deck/.snapshot/src except the --own ones (from deck/src), plus
builder files named in --with (from deck/src), plus --extra slide files (absolute paths, e.g. test cards), before 13-sort.js."""
import sys, pathlib, json
root = pathlib.Path('/home/claude/theseus/deck'); src = root / 'src'; snap = root / '.snapshot' / 'src'
args = sys.argv[1:]; out = pathlib.Path(args[0]); opt = dict(a[2:].split('=', 1) for a in args[1:] if a.startswith('--') and '=' in a)
own = set(x for x in opt.get('own', '20-app.js,06-motion.js').split(',') if x)
withf = [x for x in opt.get('with', '').split(',') if x]
extra = [x for x in opt.get('extra', '').split(',') if x]
def rd(name):
    if name in own or name in withf: return (src / name).read_text()
    p = snap / name
    return p.read_text() if p.exists() else ''
data = root.parent / 'research' / 'data'
rdata = {p.stem: json.loads(p.read_text()) for p in sorted(data.glob('*.json'))} if data.exists() else {}
geo = {p.stem: json.loads(p.read_text()) for p in sorted((root / '.snapshot' / 'geo2d').glob('*.json'))}
head = rd('00-head.html').replace('%%TITLE%%', 'F0c test')
parts = ['01-core.js', '03-parts.js', '04-ui.js', '07-charts.js', '07-sim.js', '08-r3d.js', '08-v2d.js', '05-data.js', '06-audio.js', '05-f27.js', '06-motion.js']
slides = ['09-fillet-data.js'] + sorted(p.name for p in snap.glob('10-*.js')) + sorted(p.name for p in snap.glob('12-*.js')) + sorted(p.name for p in snap.glob('14-*.js')) + withf
js = 'const RDATA = ' + json.dumps(rdata, ensure_ascii=False, separators=(',', ':')) + ';\n' + 'const GEO2D = ' + json.dumps(geo, ensure_ascii=False, separators=(',', ':')) + ';\n'
js += '\n'.join(rd(p) for p in parts + slides) + '\n' + '\n'.join(pathlib.Path(e).read_text() for e in extra) + '\n' + rd('13-sort.js') + '\n' + rd('20-app.js')
i = head.index('<div id="app">')
hp, bp = head[:i], head[i:]
if 'name="viewport"' not in hp: hp = hp.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">', 1)
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text('<!DOCTYPE html>\n<html lang="en">\n<head>\n' + hp + '</head>\n<body>\n' + bp + '\n<script>\n' + js + '\n</script>\n</body>\n</html>\n')
print(out, len(out.read_text()))
