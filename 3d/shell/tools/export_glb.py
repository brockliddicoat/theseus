"""Pack part meshes + decals into one GLB (named nodes, exact normals, AO in COLOR_0) and a JSON sidecar.
python3 export_glb.py parts.npz[,override.npz...] decals.npz|none out.glb out.json
"""
import sys, json, numpy as np, trimesh
from trimesh.exchange.gltf import export_glb

class Merged:
    def __init__(self, paths):
        self.d = {}
        for p in paths:
            z = np.load(p)
            for k in z.files: self.d[k] = z[k]
        self.files = list(self.d.keys())
    def __getitem__(self, k): return self.d[k]
parts = Merged(sys.argv[1].split(','))
dec = Merged([] if sys.argv[2] == 'none' else [sys.argv[2]])
scene = trimesh.Scene()
counts = {}
def add(src, name):
    V, F, N = src[name + '_V'], src[name + '_F'].astype(np.int64), src[name + '_N']
    fn = np.cross(V[F[:, 1]] - V[F[:, 0]], V[F[:, 2]] - V[F[:, 0]])
    if (fn * N[F].mean(1)).sum() < 0:      # orient faces with the (outward) field normals
        F = F[:, ::-1]
    m = trimesh.Trimesh(V.astype(np.float64), F.astype(np.int64), vertex_normals=N.astype(np.float64), process=False)
    A = src[name + '_A'] if (name + '_A') in src.files else np.ones(len(V))
    c = np.clip(np.round(A * 255), 0, 255).astype(np.uint8)
    m.visual = trimesh.visual.ColorVisuals(m, vertex_colors=np.c_[c, c, c, np.full(len(c), 255, np.uint8)])
    scene.add_geometry(m, node_name=name, geom_name=name)
    counts[name] = int(len(F))
for src in (parts, dec):
    names = sorted(set(k.rsplit('_', 1)[0] for k in src.files if k != 'meta' and not k.endswith('_A')))
    for n in names:
        add(src, n)
blob = export_glb(scene, include_normals=True)
open(sys.argv[3], 'wb').write(blob)
meta = json.loads(str(parts['meta']))
meta['triangles'] = counts
meta['trianglesTotal'] = int(sum(counts.values()))
json.dump(meta, open(sys.argv[4], 'w'), indent=1)
print('glb bytes', len(blob), 'tris', meta['trianglesTotal'], counts)
