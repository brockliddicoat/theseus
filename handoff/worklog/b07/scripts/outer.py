import json, sys, math, numpy as np
loops = json.load(open(sys.argv[1])); L = np.array(loops[0])
cx, cy = 0.0, float(sys.argv[2]) if len(sys.argv) > 2 else 12.0
segs = np.stack([L[:-1], L[1:]], 1)
def ray(th):
    d = np.array([math.cos(th), math.sin(th)]); hits = []
    for a, b in segs:
        e = b - a; M = np.array([[d[0], -e[0]], [d[1], -e[1]]])
        if abs(np.linalg.det(M)) < 1e-12: continue
        t, s = np.linalg.solve(M, a - np.array([cx, cy]))
        if t > 0 and 0 <= s <= 1: hits.append(t)
    return sorted(hits)
out = []; inn = []
# the user's right half: x <= 0, from the rim foot (angle ~ -100 deg) round to the top (90 deg)
for k in range(0, 121):
    th = math.radians(90 + k * 1.75)   # 90 (top) -> 300 (below the right foot)
    h = ray(th)
    if len(h) >= 2:
        o, i = h[-1], h[-2]
        out.append([round(cx + o * math.cos(th), 2), round(cy + o * math.sin(th), 2)]); inn.append([round(cx + i * math.cos(th), 2), round(cy + i * math.sin(th), 2)])
out = [p for p in out if p[1] >= 0.6]; inn = [p for p in inn if p[1] >= 0.6]
print('n', len(out)); print('OUT', json.dumps(out)); print('IN', json.dumps(inn))
th = [math.hypot(o[0]-i[0], o[1]-i[1]) for o, i in zip(out, inn)]
print('wall thickness min %.2f max %.2f mean %.2f' % (min(th), max(th), sum(th)/len(th)))
