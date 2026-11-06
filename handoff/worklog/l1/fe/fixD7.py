"""re-plan only the D7 depth entries of stageD.json (the others stand)"""
import json, sys
sys.path.insert(0, '/home/claude/work/l1/fe')
from stageD import at_depth
D = json.load(open('stageD.json')); C = {d['label']: d for d in json.load(open('stageC.json'))}
win = C['C2-tri-t0.60']; out = []
for d in D:
    if d['label'].startswith('D7-depth'):
        hr = float(d['label'][len('D7-depth'):]); nd, t = at_depth('tri', win['lam'], hr); nd['label'] = d['label']; d = nd
        print(d['label'], 't %.4f w %.4f hr %.4f' % (t, d['w'], d['hr']), flush=True)
    out.append(d)
json.dump(out, open('stageD.json', 'w'), indent=1)
