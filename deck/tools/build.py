import sys, pathlib, re, json
root = pathlib.Path(__file__).resolve().parent.parent
src = root / 'src'
data_dir = root.parent / 'research' / 'data'
# usage: python3 tools/build.py [main|rec|parts|comps] [--dev] [--only=12-xx-name.js] [--out=name]
#   main = 10-slides-main.js + every src/12-*.js idea sheet (sorted by name) + 14-exemplars.js + 13-sort.js
#   --only keeps 12-00-ideas.js (the framework) and the one named sheet file, for an isolated preview
#   --out writes dev|dist/main-<name>.html instead of main.html
# research/data/*.json is embedded as RDATA (RDATA.batteries, RDATA['weight-science'], ...), so slides read sourced data.
def rdata():
    out = {}
    if data_dir.exists():
        for p in sorted(data_dir.glob('*.json')):
            try: out[p.stem] = json.loads(p.read_text())
            except Exception as e: print('skipping', p.name, e)
    return 'const RDATA = ' + json.dumps(out, ensure_ascii=False, separators=(',', ':')) + ';\n'
def r3d_tag():
    """the 3D bundle (built by 3d/integration/build.mjs); assets load from ./assets/ next to the page"""
    v = root / 'vendor' / 'r3d.js'
    if not v.exists(): return ''
    return ("\n<script>window.R3D_MODURL = new URL('assets/', location.href).href;</script>\n<script>\n"
            + v.read_text() + "\n</script>")
def build(name, title, slides, dev=False):
    head = (src/'00-head.html').read_text().replace('%%TITLE%%', title)
    parts = ['01-core.js', '03-parts.js', '04-ui.js', '07-charts.js', '08-r3d.js', '05-data.js', '06-audio.js'] + slides + ['20-app.js']
    js = rdata() + '\n'.join((src/p).read_text() for p in parts)
    i = head.index('<div id="app">')
    head_part, body_part = head[:i], head[i:]
    if 'name="viewport"' not in head_part:
        head_part = head_part.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">', 1)
    out = ('<!DOCTYPE html>\n<html lang="en">\n<head>\n' + head_part + '</head>\n<body>\n' + body_part
           + r3d_tag() + '\n<script>\n' + js + '\n</script>\n</body>\n</html>\n')
    d = root / ('dev' if dev else 'dist'); d.mkdir(exist_ok=True)
    (d / name).write_text(out)
    print(name, len(out))
args = sys.argv[1:]
dev = '--dev' in args
opt = dict(a[2:].split('=', 1) for a in args if a.startswith('--') and '=' in a)
which = [a for a in args if not a.startswith('--')] or ['main', 'rec']
sheets = sorted(p.name for p in src.glob('12-*.js'))
if 'only' in opt: sheets = [s for s in sheets if s == '12-00-ideas.js' or s == opt['only']]
extra = sorted(p.name for p in src.glob('14-*.js'))
main_slides = (['09-fillet-data.js'] if (src/'09-fillet-data.js').exists() else []) + sorted(p.name for p in src.glob('10-*.js')) + sheets + extra + (['13-sort.js'] if (src/'13-sort.js').exists() else [])
out = ('main-' + opt['out'] + '.html') if 'out' in opt else 'main.html'
if 'main' in which: build(out, 'THESEUS — In Pursuit of an Objectively Better Mouse', main_slides, dev)
if 'parts' in which: build('parts.html', 'Parts test', ['19-parts-test.js'], dev)
if 'comps' in which: build('components.html', 'Component test', ['19-components-test.js'], dev)
if 'three' in which: build('three.html', '3D test', ['18-three-test.js'], dev)
if 'rec' in which: build('rec.html', 'THESEUS — Recommendations', ['11-slides-rec.js'], dev)
