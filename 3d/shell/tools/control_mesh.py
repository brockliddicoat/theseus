import sys, numpy as np, pymeshlab, trimesh
d = np.load('work/groove_scan.npz'); V, F = d['V'], d['F']
m = trimesh.Trimesh(V, F, process=False); N = m.vertex_normals
ms = pymeshlab.MeshSet()
ms.add_mesh(pymeshlab.Mesh(vertex_matrix=V, v_normals_matrix=N))
ms.generate_surface_reconstruction_screened_poisson(depth=7, preclean=True, samplespernode=4, pointweight=2)
M = ms.current_mesh(); print('poisson', M.vertex_number(), M.face_number())
tm = trimesh.Trimesh(M.vertex_matrix(), M.face_matrix(), process=True)
print('euler', tm.euler_number, 'watertight', tm.is_watertight, 'bounds', tm.bounds)
target = float(sys.argv[1]) if len(sys.argv) > 1 else 1.5
ms2 = pymeshlab.MeshSet(); ms2.add_mesh(pymeshlab.Mesh(tm.vertices, tm.faces))
# smooth a bit to kill wheel/buttons bumps before remeshing
ms2.apply_coord_laplacian_smoothing(stepsmoothnum=6)
ms2.meshing_isotropic_explicit_remeshing(targetlen=pymeshlab.PureValue(target), iterations=12)
C = ms2.current_mesh()
tc = trimesh.Trimesh(C.vertex_matrix(), C.face_matrix(), process=True)
print('control', len(tc.vertices), len(tc.faces), 'euler', tc.euler_number, 'watertight', tc.is_watertight)
el = tc.edges_unique_length; print('edge len mean %.3f min %.3f max %.3f' % (el.mean(), el.min(), el.max()))
np.savez_compressed(f'work/control_{target}.npz', V=tc.vertices, F=tc.faces)
