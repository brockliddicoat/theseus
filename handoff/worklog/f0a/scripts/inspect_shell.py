import json, sys
D = json.load(open(sys.argv[1]))
print('keys', list(D.keys()))
print('q', D.get('q'), 'frame', D.get('frame'))
for m in D['meshes']:
    rings = m.get('rings', {})
    info = {a: (len(rings.get(a, [])), sum(len(r['d'])//2 for r in rings.get(a, []))) for a in ['0','1','2']}
    print(m['id'], m.get('path'), 'vis', m.get('vis'), 'bbox', [[round(v,2) for v in b] for b in m.get('bbox', [[0,0,0],[0,0,0]])], info, 'lines', list((m.get('lines') or {}).keys()))
print('motion keys', list(D.get('motion', {}).keys()))
print('vis keys', list(D.get('vis', {}).keys()))
