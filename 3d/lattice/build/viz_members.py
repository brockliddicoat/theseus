"""debug: members as tubes (colored by family) + bosses -> work/mem_<kind>.ply"""
import sys, json, numpy as np, trimesh
from common import *
from geom import *
S = Shell()
kind = sys.argv[1] if len(sys.argv) > 1 else 'tri'
d = np.load(os.path.join(WORK, f'members_{kind}.npz')); Q, mid, at = d['Q'], d['mid'], d['at']
lay = json.load(open(os.path.join(WORK, 'layout.json')))
cols = [(225, 70, 50), (40, 110, 220), (40, 160, 70), (250, 190, 20), (160, 60, 200)]
parts = []
for m in np.unique(mid):
    sel = mid == m; R = Q[sel]; A = at[sel]; fam = int(A[0, 3])
    R = R[::3] if len(R) > 6 else R
    Rn = R + (A[::3 if len(Q[sel]) > 6 else 1, 0][:, None] * 0.5) * S.normal_in(R)
    for q0, q1 in zip(Rn[:-1], Rn[1:]):
        if np.linalg.norm(q1 - q0) < 1e-6: continue
        c = trimesh.creation.cylinder(radius=0.5, segment=[q0, q1], sections=6); c.visual.vertex_colors = cols[fam] + (255,); parts.append(c)
for b in lay['bosses']:
    c = trimesh.creation.cylinder(radius=b['od'] / 2, segment=[[b['x'], b['y0'], b['z']], [b['x'], b['y1'], b['z']]], sections=24)
    c.visual.vertex_colors = (200, 160, 60, 255); parts.append(c)
for t in lay['ties']:
    if not np.all(np.isfinite(t['p'])): continue
    s = trimesh.creation.icosphere(radius=0.9, subdivisions=1); s.apply_translation(t['p']); s.visual.vertex_colors = (255, 40, 120, 255); parts.append(s)
for sk in lay['skates']:
    c = trimesh.creation.cylinder(radius=3.25, segment=[[sk[0], 0.05, sk[1]], [sk[0], 0.7, sk[1]]], sections=24); c.visual.vertex_colors = (240, 240, 240, 255); parts.append(c)
ol = np.array(lay['pcb']['outline'])
for i in range(0, len(ol) - 1, 2):
    p0 = [ol[i, 0], lay['pcb']['y0'] + 1.0, ol[i, 1]]; p1 = [ol[i + 1, 0], lay['pcb']['y0'] + 1.0, ol[i + 1, 1]]
    if np.linalg.norm(np.subtract(p1, p0)) < 3: c = trimesh.creation.cylinder(radius=0.25, segment=[p0, p1], sections=4); c.visual.vertex_colors = (30, 160, 60, 255); parts.append(c)
m = trimesh.util.concatenate(parts); m.export(os.path.join(WORK, f'mem_{kind}.ply')); print('ok', len(m.faces))
