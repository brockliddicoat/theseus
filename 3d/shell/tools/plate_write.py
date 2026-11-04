#!/usr/bin/env python3
"""Put the bottom plate (work/plate-mesh.bin from plate_mesh.mjs) into shell-theseus-1seam.glb's 'plate' node, welded
(equal position and normal), with COLOR_0 occlusion. The rest of the GLB is copied unchanged (one_seam.write).
    python3 -I shell/tools/plate_write.py        (from 3d/)"""
import json, os, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import glbio, one_seam
GLB = os.path.join(HERE, '..', 'shell-theseus-1seam.glb')
W = os.path.join(HERE, '..', 'work')
h = json.load(open(os.path.join(W, 'plate-mesh.json'))); nv, nt = h['nv'], h['nt']
raw = np.fromfile(os.path.join(W, 'plate-mesh.bin'), dtype=np.uint8)
o = 0
def take(dt, n):
    global o
    a = np.frombuffer(raw, dtype=dt, count=n, offset=o); o += a.nbytes; return a
P = take(np.float32, nv * 3).reshape(-1, 3); N = take(np.float32, nv * 3).reshape(-1, 3); C = take(np.float32, nv * 4).reshape(-1, 4); T = take(np.uint32, nt * 3).reshape(-1, 3)
key = np.c_[np.round(P * 2000).astype(np.int64), np.round(N * 100).astype(np.int64)]
_, first, inv = np.unique(key, axis=0, return_index=True, return_inverse=True)
P2, N2, C2, T2 = P[first], N[first].copy(), C[first], inv.reshape(-1)[T]
bad = ~(np.linalg.norm(N2, axis=1) > 1e-6); N2[bad] = [0, 1, 0]
T2 = T2[(T2[:, 0] != T2[:, 1]) & (T2[:, 1] != T2[:, 2]) & (T2[:, 0] != T2[:, 2])]
js, b = glbio.read(GLB)
size = one_seam.write(js, b, {'plate': (P2, N2, C2, T2.astype(np.uint32))}, [], GLB)
vol = np.einsum('ij,ij->i', P2[T2[:, 0]], np.cross(P2[T2[:, 1]], P2[T2[:, 2]])).sum() / 6
print('plate: %d vertices, %d triangles; volume %.0f mm3 (%.2f g at 1.01 g/cm3, overlapping layers counted twice); GLB %d KB' % (len(P2), len(T2), vol, vol * 1.01e-3, size // 1024))
meta_p = GLB.replace('.glb', '.json'); meta = json.load(open(meta_p))
meta['triangles']['plate'] = int(len(T2))
L = json.load(open(os.path.join(HERE, '..', 'plate-layout.json')))
meta['plate'] = dict(note='Optional bottom plate (F12.10): solid outside, triangle lattice inside; plate-layout.json, plate_mesh.mjs',
                     window=L['window'], ring=L['ring'], yTop=L['mesh']['yTop'], skin=L['dims']['skin'], mass=L['mass'])
tmp = meta_p + '.tmp'; open(tmp, 'w').write(json.dumps(meta, separators=(',', ':'))); os.replace(tmp, meta_p)
print('meta: plate block written')
