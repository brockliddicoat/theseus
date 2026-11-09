import sys, pathlib, re, json
root = pathlib.Path(__file__).resolve().parent.parent
src = root / 'src'
data_dir = root.parent / 'research' / 'data'
# usage: python3 tools/build.py [main|rec|parts|comps|kit|gd] [--dev] [--only=12-xx-name.js] [--out=name]
#   main = 10-slides-main.js + every src/12-*.js idea sheet (sorted by name) + 14-exemplars.js + 13-sort.js
#   --only keeps 12-00-ideas.js (the framework) and the one named sheet file, for an isolated preview
#   --out writes dev|dist/main-<name>.html instead of main.html
#   --own=a.js,b.js builds with those src/ files as they are now and every other file (shared or slide) as it is in the
#     snapshot (--base=dir, default deck/.snapshot/src): a builder working on one chapter is never broken by another
#     builder's half-saved file. A file that exists only in src/ and is not yours is left out. The 2D twins (geo2d/) and the
#     3D bundle (vendor/r3d.js) come from the snapshot too, unless 'geo2d' / 'vendor' is in the list.
#   --with3d embeds the 3D bundle in main for development; the film itself is 2D and ships without it (F38.8)
# research/data/*.json is embedded as RDATA (RDATA.batteries, RDATA['weight-science'], ...), so slides read sourced data.
def rdata():
    out = {}
    if data_dir.exists():
        for p in sorted(data_dir.glob('*.json')):
            try: out[p.stem] = json.loads(p.read_text())
            except Exception as e: print('skipping', p.name, e)
    return 'const RDATA = ' + json.dumps(out, ensure_ascii=False, separators=(',', ':')) + ';\n'
def geo2d():
    """the 2D twins' outlines (deck/geo2d/*.json, made by tools/geo2d), embedded as GEO2D[scene]"""
    d = root / 'geo2d' if OWN is None or 'geo2d' in OWN else BASE.parent / 'geo2d'
    out = {}
    if d.exists():
        for p in sorted(d.glob('*.json')):
            out[p.stem] = json.loads(p.read_text())
    return 'const GEO2D = ' + json.dumps(out, ensure_ascii=False, separators=(',', ':')) + ';\n'
def r3d_tag():
    """the 3D bundle (built by 3d/integration/build.mjs); assets load from ./assets/ next to the page. R3D_DEV marks a
    development page: only there does 08-v2d.js draw 3D (the film is 2D, F38.8)"""
    v = root / 'vendor' / 'r3d.js' if OWN is None or 'vendor' in OWN else BASE.parent / 'vendor' / 'r3d.js'
    if not v.exists(): return ''
    return ("\n<script>window.R3D_MODURL = new URL('assets/', location.href).href; window.R3D_DEV = true;</script>\n<script>\n"
            + v.read_text() + "\n</script>")
def build(name, title, slides, dev=False, flat=True, r3d=True, extra=''):
    head = read_src('00-head.html').replace('%%TITLE%%', title)
    parts = ['01-core.js', '03-parts.js', '04-ui.js', '07-charts.js', '07-sim.js', '08-r3d.js', '08-v2d.js', '05-data.js', '06-audio.js'] + [p for p in ('05-f27.js', '06-motion.js') if (src / p).exists()] + slides + ['20-app.js']
    js = rdata() + extra + (geo2d() if flat else 'const GEO2D = {};\n') + '\n'.join(read_src(p) for p in parts)
    i = head.index('<div id="app">')
    head_part, body_part = head[:i], head[i:]
    if 'name="viewport"' not in head_part:
        head_part = head_part.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">', 1)
    out = ('<!DOCTYPE html>\n<html lang="en">\n<head>\n' + head_part + '</head>\n<body>\n' + body_part
           + (r3d_tag() if r3d else '') + '\n<script>\n' + js + '\n</script>\n</body>\n</html>\n')
    d = root / ('dev' if dev else 'dist'); d.mkdir(exist_ok=True)
    (d / name).write_text(out)
    print(name, len(out))
args = sys.argv[1:]
dev = '--dev' in args
opt = dict(a[2:].split('=', 1) for a in args if a.startswith('--') and '=' in a)
OWN = set(f.strip() for f in opt['own'].split(',') if f.strip()) if 'own' in opt else None
BASE = pathlib.Path(opt['base']) if 'base' in opt else root / '.snapshot' / 'src'
def read_src(name):
    if OWN is None or name in OWN: return (src / name).read_text()
    b = BASE / name
    return b.read_text() if b.exists() else ''
which = [a for a in args if not a.startswith('--')] or ['main', 'rec']
sheets = sorted(p.name for p in src.glob('12-*.js'))
if 'only' in opt: sheets = [s for s in sheets if s == '12-00-ideas.js' or s == opt['only']]
extra = sorted(p.name for p in src.glob('14-*.js'))
# the revamp (2026-11-05): one file per builder, deck/src/30-*.js; their slides replace old ones with { replaces: [ids] }
revamp = sorted(p.name for p in src.glob('30-*.js'))
# the film's manifest (V1, 2026-11-06, the v23 refinement): after every slide file, before the sort, which stands aside when it is on
film = ['25-film.js'] if (src/'25-film.js').exists() else []
main_slides = (['09-fillet-data.js'] if (src/'09-fillet-data.js').exists() else []) + sorted(p.name for p in src.glob('10-*.js')) + sheets + extra + revamp + film + (['13-sort.js'] if (src/'13-sort.js').exists() else [])
out = ('main-' + opt['out'] + '.html') if 'out' in opt else 'main.html'
# the film is 2D (Brock, 2026-11-06, F38.8): main embeds no 3D bundle; --with3d embeds it for development (3D via ?2d=0)
if 'main' in which: build(out, 'Theseus', main_slides, dev, r3d='--with3d' in args)
if 'parts' in which: build('parts.html', 'Parts test', ['19-parts-test.js'], dev)
if 'comps' in which: build('components.html', 'Component test', ['19-components-test.js'], dev)
# the motion kit's test page and exemplar (F0a): every kit element animating, in both themes (dist/kit.html)
if 'kit' in which: build(('kit-' + opt['out'] + '.html') if 'out' in opt else 'kit.html', 'Motion kit', ['19-kit-test.js'], dev, r3d=False)   # --out=x: dist/kit-x.html
if 'three' in which: build('three.html', '3D test', ['18-three-test.js'], dev)
if 'rec' in which: build('rec.html', 'THESEUS — Recommendations', ['11-slides-rec.js'], dev, flat=False)
# the shape study (G1, 2026-11-07): "Shape, by gradient descent", its own page (dist/gd.html) on the same core and kit. Its
# data (tools/gd/out/gd-deck.json, research/gd/shape-gd.json) is embedded here only, as GD and GDSRC: never in main.html
def gd_data():
    g = root / 'tools' / 'gd' / 'out' / 'gd-deck.json'; s = root.parent / 'research' / 'gd' / 'shape-gd.json'
    h = root / 'tools' / 'gd' / 'out' / 'hand3' / 'gd-hand.json'   # G8: the hand traced from the open hand model (tools/gd/hand_draw.py)
    return 'const GD = ' + g.read_text() + ';\nconst GDSRC = ' + s.read_text() + ';\nconst GDHAND = ' + h.read_text() + ';\n'
if 'gd' in which: build('gd.html', 'Shape, by gradient descent', sorted(p.name for p in src.glob('40-gd-*.js')), dev, flat=False, r3d=False, extra=gd_data())
