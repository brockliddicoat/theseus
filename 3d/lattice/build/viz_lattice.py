"""debug: lattice edges as tubes + inner surface -> work/latt_tubes.ply, work/inner.ply"""
import sys, numpy as np, trimesh
from skimage.measure import marching_cubes
from common import *
from geom import *
S = Shell()
fn = sys.argv[1] if len(sys.argv) > 1 else 'lattice_raw.npz'
d = np.load(os.path.join(WORK, fn)); X = d['X']; E = d['E']; yr = float(d['y_rim'])
parts = []
for i, j, f in E:
    a, b = X[i], X[j]
    if a[1] < yr and b[1] < yr: continue
    # follow the surface: subdivide + project
    t = np.linspace(0, 1, 9)[:, None]; Q = S.project(a * (1 - t) + b * t)
    Q = Q + 0.6 * S.normal_in(Q)
    for q0, q1 in zip(Q[:-1], Q[1:]):
        L = np.linalg.norm(q1 - q0)
        if L < 1e-6: continue
        c = trimesh.creation.cylinder(radius=0.45, segment=[q0, q1], sections=6)
        c.visual.vertex_colors = [(220, 60, 50, 255), (40, 110, 220, 255), (40, 160, 70, 255)][f]
        parts.append(c)
m = trimesh.util.concatenate(parts); m.export(os.path.join(WORK, 'latt_tubes.ply'))
if not os.path.exists(os.path.join(WORK, 'inner.ply')) or 'inner' in sys.argv:
    g = S.ext; A = g.A[::2, ::2, ::2]; ax = g.axes()
    XX, YY, ZZ = np.meshgrid(ax[0][::2], ax[1][::2], ax[2][::2], indexing='ij')
    T = wall_T(np.stack([XX, YY, ZZ], -1))
    v, f, _, _ = marching_cubes(A + T, 0.0, spacing=(g.h * 2,) * 3); v += g.o
    mm = trimesh.Trimesh(v, f, process=False)
    keep = mm.triangles_center[:, 1] > 2.6
    mm.update_faces(keep); mm.remove_unreferenced_vertices(); mm.export(os.path.join(WORK, 'inner.ply'))
print('ok')
