import json, sys
from PIL import Image, ImageDraw
D = json.load(open(sys.argv[1])); q = 1 / D['q']
def rings(m, a):
    out = []
    for r in m['rings'].get(a, []):
        u = v = 0; pts = []
        d = r['d']
        for i in range(0, len(d), 2):
            u += d[i]; v += d[i+1]; pts.append((u*q, v*q))
        out.append((pts, r.get('h', 0)))
    return out
want = ['body/body', 'explodeL/triggerL', 'explodeR/triggerR', 'sideFront/sideFront', 'sideRear/sideRear', 'wheelBayGroup/wheelBay', 'body/lens/Mesh', 'body/usbC', 'body/core']
img = Image.new('RGB', (1800, 1400), 'white'); dr = ImageDraw.Draw(img)
S = 6
offs = {'0': (900, 300), '1': (450, 1000), '2': (1400, 1000)}
cols = {'body/body': 'black', 'explodeL': 'blue', 'explodeR': 'green', 'sideFront': 'red', 'sideRear': 'orange', 'wheelBay': 'purple', 'lens': 'brown', 'usbC': 'gray', 'core': (200,200,200)}
for m in D['meshes']:
    p = m['path']
    if not any(p.startswith(w) for w in want): continue
    col = next((c for k, c in cols.items() if k in p), 'black')
    for a in ['0', '1', '2']:
        ox, oy = offs[a]
        for pts, h in rings(m, a):
            P = [(ox + x * S, oy - y * S) for x, y in pts]
            if len(P) > 2: dr.line(P + [P[0]], fill=col, width=2 if 'body/body' in p else 1)
img.save(sys.argv[2])
# print the body outline extents per axis
for m in D['meshes']:
    if m['path'] == 'body/body':
        for a in ['0','1','2']:
            for pts, h in rings(m, a):
                xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
                print('axis', a, 'hole' if h else 'outer', len(pts), 'u', round(min(xs),2), round(max(xs),2), 'v', round(min(ys),2), round(max(ys),2))
