import sys, numpy as np, pymeshlab, trimesh
coarse, fine = float(sys.argv[1]), float(sys.argv[2])
d = np.load('work/groove_scan.npz'); V, F = d['V'], d['F']
m = trimesh.Trimesh(V, F, process=False); N = m.vertex_normals
ms = pymeshlab.MeshSet()
ms.add_mesh(pymeshlab.Mesh(vertex_matrix=V, v_normals_matrix=N))
ms.generate_surface_reconstruction_screened_poisson(depth=7, preclean=True, samplespernode=4, pointweight=2)
ms.apply_coord_laplacian_smoothing(stepsmoothnum=6)
ms.meshing_isotropic_explicit_remeshing(targetlen=pymeshlab.PureValue(coarse), iterations=10)
# refine nose and rim band
ms.compute_selection_by_condition_per_face(condselect='((z0 > 44) && (y0 > 0.9)) || ((y0 > 0.9) && (y0 < 8.0))')
ms.meshing_isotropic_explicit_remeshing(targetlen=pymeshlab.PureValue(fine), iterations=10, selectedonly=True)
ms.set_selection_none()
ms.meshing_isotropic_explicit_remeshing(targetlen=pymeshlab.PureValue(coarse), iterations=1, adaptive=False, selectedonly=True)
C = ms.current_mesh()
tc = trimesh.Trimesh(C.vertex_matrix(), C.face_matrix(), process=True)
print('control', len(tc.vertices), len(tc.faces), 'euler', tc.euler_number, 'watertight', tc.is_watertight)
el = tc.edges_unique_length; print('edge len mean %.3f p5 %.3f p95 %.3f' % (el.mean(), np.percentile(el, 5), np.percentile(el, 95)))
np.savez_compressed(f'work/control_ad.npz', V=tc.vertices, F=tc.faces)
