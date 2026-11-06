import trimesh, numpy as np, time
t0=time.time()
s = trimesh.load('/home/claude/theseus/3d/shell/shell-theseus-1seam.glb', force='scene')
G = {k: s.geometry[k] for k in ['body','triggerL','triggerR']}
# world transforms
for name in G:
    T, gname = s.graph[name]
    print(name, 'transform identity?', np.allclose(T, np.eye(4)))
for z in [-58, -55, -50, -40, -14, 0, 4, 10, 30, 50, 56, 58]:
    out = []
    for k, g in G.items():
        seg = trimesh.intersections.mesh_plane(g, plane_normal=[0,0,1], plane_origin=[0,0,z])
        if len(seg): out.append((k, seg.reshape(-1,3)))
    for k, P in out:
        x, y = P[:,0], P[:,1]
        print(f'z={z:6.1f} {k:9s} n={len(P)//2:5d} x[{x.min():6.2f},{x.max():6.2f}] y[{y.min():6.2f},{y.max():6.2f}]')
print('time', time.time()-t0)
