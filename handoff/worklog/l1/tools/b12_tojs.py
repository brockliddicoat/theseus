"""L1: out/b12-data.json (+ out/b12-geo.json) -> the B12 block in deck/src/30-b12-latopt.js (between the markers).
Compact: flexes in µm to 0.1, uses to 0.001, geometry to 0.1 mm (Douglas-Peucker 0.08 mm)."""
import json, os, re, math, numpy as np
OUT = '/home/claude/work/l1/out'; SLIDE = '/home/claude/theseus/deck/src/30-b12-latopt.js'
D = json.load(open(f'{OUT}/b12-data.json'))
G = json.load(open(f'{OUT}/b12-geo.json')) if os.path.exists(f'{OUT}/b12-geo.json') else None


def dp(pts, eps=0.08):
    pts = np.asarray(pts, float)
    if len(pts) < 3: return pts
    a, b = pts[0], pts[-1]; ab = b - a; L = np.hypot(*ab) + 1e-12
    q = pts - a; d = np.abs(ab[0] * q[:, 1] - ab[1] * q[:, 0]) / L; i = int(np.argmax(d))
    if d[i] > eps: return np.vstack([dp(pts[:i + 1], eps)[:-1], dp(pts[i:], eps)])
    return np.vstack([a, b])


def small(r, keys):
    return {k: (round(r[k], 4) if isinstance(r[k], float) else r[k]) for k in keys if k in r}


K = ['label', 't', 'w', 'hr', 'r', 'lam', 'worst', 'crown', 'off', 'palm', 'sq', 'use', 'ub', 'where', 'trip', 'rPick', 'rPickT', 'scfPick', 'ribPeak', 'skinPeak', 'railPeak', 'rootNom', 'beamPeak', 'juncPeak', 'juncAt', 'fieldPeak', 'rootAtPick']
win = small(D['win'], K)
lam = D['win']['lam']; win['a'] = round(2 * math.sqrt(3) / lam, 2)          # triangle side from rib length per area
# the root fillet's SCF at the winner's r/t (the fillet study)
if D.get('fil'):
    R = [f[0] for f in D['fil']]; S = [f[1] for f in D['fil']]; win['scf'] = round(float(np.interp(win['r'] / win['t'], R, S)), 3)
if D['win'].get('buckle'): win['buckle'] = D['win']['buckle']
win['rNode'] = round(0.6 * D['win']['w'], 2)
win['H'] = round(3.0 / D['win']['lam'], 2)                 # line spacing in each of the three directions          # the node fillet in plan: b06_filletsize's rule, 60 % of the strut (rib) width
B = dict(g=D['g'], base=small(D['base'], K), plain=small(D['plain'], K), win=win, final=D.get('final', False), fine=D.get('fine', False),
         bg=D.get('bg', []), facPairs=D.get('facPairs'), coarse=D.get('coarse'))
if os.path.exists(f'{OUT}/flowlen.json'):
    FL = json.load(open(f'{OUT}/flowlen.json'))
    # the longest melt path from the crown's gate: the mesh-graph length (108) overstates a geodesic by a few %; say 105
    B['flow'] = dict(mm=round((FL['graph_mm'] + FL['est_mm']) / 2 / 5) * 5, graph=round(FL['graph_mm'], 1), p95=round(FL['p95_mm'], 1))
# the stagger inside each pattern's window: in label order
pts = sorted(D['pts'], key=lambda p: (p[0], p[4]))
cnt = {}
for p in pts: cnt[p[0]] = cnt.get(p[0], 0) + 1
seen = {}
out = []
for p in pts:
    i = seen.get(p[0], 0); seen[p[0]] = i + 1
    out.append([p[0], p[1], p[2], p[3], p[4], round(i / max(1, cnt[p[0]] - 1), 3)])
B['pts'] = out
B['triLabel'] = D.get('triLabel'); B['depth'] = D['depth']; B['fil'] = D.get('fil', []); B['sens'] = D.get('sens', {}); B['filsec'] = D.get('filsec')
# the crown point (x, y, z) in the shell's frame: from any cached design
B['crown'] = json.load(open(f'{OUT}/crown_point.json'))          # l1fe.crown_point: the hump's top on the midline
if G:
    B['geo'] = {}
    for k, v in G.items():
        r = [[round(float(c), 1) for q in dp(ln) for c in q] for ln in v['rib'] if len(ln) >= 2]
        c = [[round(float(c), 1) for q in dp(ln) for c in q] for ln in v.get('crease', []) if len(ln) >= 2]
        B['geo'][k] = dict(r=r, c=c)
js = 'const B12 = ' + json.dumps(B, separators=(',', ':')) + ';'
s = open(SLIDE).read()
s2 = re.sub(r'/\* B12-DATA-BEGIN \*/.*?/\* B12-DATA-END \*/', lambda m: '/* B12-DATA-BEGIN */\n' + js + '\n/* B12-DATA-END */', s, flags=re.S)
open(SLIDE, 'w').write(s2)
print('B12 block', len(js), 'chars; designs', len(out), '; win', win)
