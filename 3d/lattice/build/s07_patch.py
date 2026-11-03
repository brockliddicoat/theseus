"""Stage 7: high-resolution patch around one filleted 6-way node for the macro (setFilletZoom) -> assets/lattice_patch.bin

Picks a body node on the crown (+X half, so the 'half' cut leaves it standing), meshes a 22 x 9 x 22 mm box at
0.035 mm, decimates to ~240k triangles and writes it with the same attributes as the main meshes.
"""
import json, subprocess, sys, numpy as np
from common import *
from geom import *

S = Shell()
d = np.load(os.path.join(WORK, 'lattice_raw.npz')); X, K, J = d['X'], d['K'], d['J']
idx = {(int(k), int(j)): i for i, (k, j) in enumerate(zip(K, J))}
best = None
for (k, j), i in idx.items():
    nb = [(k, j + 1), (k, j - 1), (k + 1, j), (k + 1, j - 1), (k - 1, j), (k - 1, j + 1)]
    if not all(q in idx for q in nb): continue
    p = X[i]
    if trig_sdf(p[None])[0] < 2.0 or p[0] < 3.0 or p[0] > 14 or p[1] < 31: continue
    score = abs(p[0] - 7.5) + 0.6 * abs(p[2] + 14)
    if best is None or score < best[0]: best = (score, i, p)
_, inode, node = best
node = S.project(node[None])[0]
nin = S.normal_in(node[None])[0]
print('fillet node', node.round(2), 'normal', nin.round(3))
half = np.array([11.0, 0, 11.0])
box = [[node[0] - 11, node[1] - 7.0, node[2] - 11], [node[0] + 11, node[1] + 2.2, node[2] + 11]]
h = float(sys.argv[1]) if len(sys.argv) > 1 else 0.035
if '--skip' not in sys.argv:
    subprocess.run([sys.executable, 'build/s04_mesh.py' if os.path.exists('build/s04_mesh.py') else 's04_mesh.py', '--kind', 'tri', '--h', str(h), '--name', 'patch',
                    '--box=' + ','.join('%.3f' % v for v in (box[0][0], box[1][0], box[0][1], box[1][1], box[0][2], box[1][2])),
                    '--target', 'patch:240000'], check=True, cwd=os.path.dirname(os.path.abspath(__file__)))
# camera: inside the cavity, looking up at the node from the -X side (where the half-cut opens the shell)
side = np.array([-1.0, 0, 0]); side -= nin * (side @ nin); side /= np.linalg.norm(side)
fwd = np.cross(nin, side); fwd /= np.linalg.norm(fwd)
# frame the node with the arch running from it to the section plane (x = 0), whose yellow cap shows the rib profile
target = node + nin * 0.9 + side * 2.6
cdir = 0.50 * nin + 0.74 * side + 0.45 * fwd; cdir /= np.linalg.norm(cdir)
cam = target + 17.5 * cdir
ldir = 0.70 * nin + 0.20 * side - 0.68 * fwd; ldir /= np.linalg.norm(ldir)
# section marks traced from the patch mesh: the arch profile 3.2 mm from the node (root fillets) and the node outline
import trimesh
mp = np.load(os.path.join(WORK, 'mesh_patch_patch.npz')); pm = trimesh.Trimesh(mp['V'], mp['F'], process=False)
md = np.load(os.path.join(WORK, 'members_tri.npz')); Q, mid, at = md['Q'], md['mid'], md['at']
fam0 = np.where(at[:, 3] == 0)[0]; k0 = fam0[np.argmin(np.linalg.norm(Q[fam0] - node, axis=1))]
mem = np.where(mid == mid[k0])[0]; R = Q[mem]
dists = np.linalg.norm(R - node, axis=1); i0 = np.argmin(dists)
cands = [i for i in range(len(R)) if abs(dists[i] - 3.2) < 0.35]
ic = min(cands, key=lambda i: R[i][0])          # the side toward -x (toward the camera)
c = R[ic]; t = R[min(ic + 1, len(R) - 1)] - R[max(ic - 1, 0)]; t /= np.linalg.norm(t)
n_c = S.normal_in(c[None])[0]; b = np.cross(t, n_c); b /= np.linalg.norm(b)
w_c, h_c, r_c = at[mem[ic], 1], at[mem[ic], 0], at[mem[ic], 2]
marks = []
def pieces(path):
    out = []
    for seg in path.discrete: out.append(np.asarray(seg))
    return out
sec = None
if sec is not None:
    for P_ in pieces(sec):
        lat = (P_ - c) @ b; up = (P_ - c) @ n_c
        ok = (np.abs(lat) < w_c / 2 + r_c + 1.1) & (up > -0.05) & (up < h_c + 0.4)
        idx_ = np.where(ok)[0]
        if len(idx_) < 4: continue
        runs = np.split(idx_, np.where(np.diff(idx_) > 1)[0] + 1)
        for rr in runs:
            if len(rr) > 6: marks.append(P_[rr] + 0.02 * cdir)
hm = 0.55 * float(at[mem[i0], 0])
sec2 = pm.section(plane_origin=node + nin * hm, plane_normal=nin)
if sec2 is not None:
    for P_ in pieces(sec2):
        ok = np.linalg.norm((P_ - node) - np.outer((P_ - node) @ nin, nin), axis=1) < 2.9
        idx_ = np.where(ok)[0]
        if len(idx_) < 4: continue
        runs = np.split(idx_, np.where(np.diff(idx_) > 1)[0] + 1)
        for rr in runs:
            if len(rr) > 6: marks.append(P_[rr] + 0.02 * cdir)
print('marks', [len(m) for m in marks], 'profile at', c.round(2), 'w %.2f h %.2f r %.2f' % (w_c, h_c, r_c))
info = dict(node=node.tolist(), normal=nin.tolist(), box=box, h=h,
            camera=dict(position=cam.tolist(), target=target.tolist(), fov=26.0),
            light=dict(position=(node + 16.0 * ldir).tolist()),
            marks=[m.tolist() for m in marks], profile=dict(at=c.tolist(), tangent=t.tolist(), w=float(w_c), h=float(h_c), r=float(r_c)),
            radius=float(r_c), width=float(w_c))
jdump(info, os.path.join(WORK, 'fillet.json'))
print({k: v for k, v in info.items() if k != 'marks'})
