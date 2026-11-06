"""L1: each topology's rib and crease lines at its C2 design (t = 0.60), projected to the top view -> out/b12-geo.json"""
import json, sys
sys.path.insert(0, '/home/claude/work/l1/fe'); sys.path.insert(0, '/home/claude/work/l1/tools')
from b12_export import rib_lines_top
import os, l1geo
STAGE, PRE = ('stageF', 'F') if l1geo.CREASE == 'slope' else ('stageC', 'C2')
C = {d['label']: d for d in json.load(open(f'/home/claude/work/l1/fe/{STAGE}.json'))}
geo = {}
for k in ('tri', 'kagome', 'square', 'diamond', 'hex'):
    d = C[f'{PRE}-{k}-t0.60']; geo[k] = rib_lines_top(dict(kind=k, lam=d['lam']))
    print(k, d['lam'], len(geo[k]['rib']), 'rib lines', sum(len(l) for l in geo[k]['rib']), 'points', flush=True)
json.dump(geo, open('/home/claude/work/l1/out/b12-geo.json', 'w'))
