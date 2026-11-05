"""Build the independent Codex film. Original slides stay available for review.

    python -X utf8 deck/tools/build_revamp.py

All art is drawn by the source code. No network is needed to play the 2D film.
"""
from pathlib import Path
import json
import re
import argparse
import hashlib
from datetime import datetime, timezone

parser = argparse.ArgumentParser()
parser.add_argument('--out', default='index.html', help='HTML filename inside deck/dist, for isolated review builds')
args = parser.parse_args()
if Path(args.out).name != args.out or not args.out.endswith('.html'):
    raise ValueError('--out must be a single .html filename')

ROOT = Path(__file__).resolve().parents[2]
DECK = ROOT / 'deck'
SRC = DECK / 'src'

def read(p):
    return p.read_text(encoding='utf-8-sig')

data = {}
for p in sorted((ROOT / 'research/data').glob('*.json')):
    data[p.stem] = json.loads(read(p))
geo = {p.stem: json.loads(read(p)) for p in sorted((DECK / 'geo2d').glob('*.json'))}
audit = ROOT / 'handoff/codex/feedback-audit.json'
coverage = ROOT / 'deck/revamp/coverage.json'
merged_coverage = {'schemaVersion': 1, 'slides': {}, 'source_mapping': [], 'removed': {}}
for p in sorted((DECK / 'revamp').glob('coverage-*.json')):
    part = json.loads(read(p))
    for sid, record in part.get('slides', {}).items():
        if sid in merged_coverage['slides']:
            raise ValueError(f'Duplicate coverage owner: {sid} in {p.name}')
        merged_coverage['slides'][sid] = record
    rules = part.get('source_mapping', [])
    if isinstance(rules, list):
        merged_coverage['source_mapping'].extend(rules)
    for sid, record in part.get('removed', {}).items():
        if sid in merged_coverage['removed']:
            raise ValueError(f'Duplicate removed-feedback owner: {sid}')
        merged_coverage['removed'][sid] = record
coverage.write_text(json.dumps(merged_coverage, ensure_ascii=False, indent=2), encoding='utf-8')
head = read(SRC / '00-head.html').replace('%%TITLE%%', 'THESEUS — ZERO COMPROMISES')
if 'name="viewport"' not in head:
    head = head.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,interactive-widget=resizes-content">', 1)
head = head.replace('</style>', '\n' + read(DECK / 'revamp/player.css') + '\n</style>', 1)
split = head.index('<div id="app">')
shared = ['01-core.js', '03-parts.js', '04-ui.js', '07-charts.js', '07-sim.js', '08-r3d.js', '08-v2d.js', '05-data.js', '06-audio.js']
old = sorted(SRC.glob('09-*.js')) + sorted(SRC.glob('10-*.js')) + sorted(SRC.glob('12-*.js')) + sorted(SRC.glob('14-*.js')) + [SRC / '13-sort.js']
new = sorted(p for p in (DECK / 'revamp').glob('*.js') if p.name != '99-review.js')
payload = "window.THESEUS_HUE='blue';\n"
payload += 'const RDATA=' + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + ';\n'
payload += 'const GEO2D=' + json.dumps(geo, ensure_ascii=False, separators=(',', ':')) + ';\n'
payload += 'const RV_AUDIT=' + (read(audit) if audit.exists() else '{}') + ';\n'
payload += 'const RV_COVERAGE=' + json.dumps(merged_coverage, ensure_ascii=False, separators=(',', ':')) + ';\n'
payload += '\n'.join(read(SRC / p) for p in shared)
payload += '\n' + '\n'.join(read(p) for p in old)
payload += '\n' + '\n'.join(read(p) for p in new)
payload += '\nRV.finish();\n' + read(SRC / '20-app.js')
payload += '\n' + read(DECK / 'revamp/99-review.js')
vendor = DECK / 'vendor/r3d.js'
vtag = "<script>window.R3D_MODURL=new URL('assets/',location.href).href;</script>\n<script>" + read(vendor) + '</script>' if vendor.exists() else ''
build_meta = {'id': hashlib.sha256((head + vtag + payload).encode('utf-8')).hexdigest()[:12],
              'at': datetime.now(timezone.utc).isoformat(timespec='seconds')}
payload = 'const RV_BUILD=' + json.dumps(build_meta, separators=(',', ':')) + ';\n' + payload
html = '<!doctype html>\n<html lang="en"><head>' + head[:split] + '</head><body>' + head[split:] + vtag + '<script>\n' + payload.replace('</script', '<\\/script') + '\n</script></body></html>'
out = DECK / 'dist'
out.mkdir(exist_ok=True)
(out / args.out).write_text(html, encoding='utf-8')
(out / (args.out.removesuffix('.html') + '-version.json')).write_text(json.dumps(build_meta), encoding='utf-8')
print(f'Built {out / args.out}: {len(html):,} characters')
