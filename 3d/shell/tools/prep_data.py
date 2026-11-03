"""Target points for the skin fit: scan minus seams/wheel/buttons/front face/bottom/logo/patch borders, + mirror."""
import sys, numpy as np, trimesh
from scipy.spatial import cKDTree
sys.path.insert(0, '/home/claude/theseus/3d/shell/tools')
d = np.load('work/groove_scan.npz'); V, F, g = d['V'], d['F'], d['g']
m = trimesh.Trimesh(V, F, process=False)
N = m.vertex_normals.copy()
x, y, z = V.T
tree = cKDTree(V)
def dilate(mask, r):
    idx = np.nonzero(mask)[0]
    out = mask.copy()
    if len(idx) == 0: return out
    for lst in tree.query_ball_point(V[idx], r):
        out[lst] = True
    return out
excl = {}
excl['seam'] = dilate(g < -0.045, 1.6)
excl['wheel'] = (np.abs(x) < 7.0) & (z > 25.5) & (z < 48.5) & (y > 16.5)
excl['buttons'] = (x > 21.5) & (z > -18) & (z < 32) & (y > 12.5) & (y < 29)
excl['front_face'] = (z > 42) & (N[:, 2] > 0.30) & (y < 14.5) & (np.abs(x) < 7.5) & (y < 10.8)   # USB port only
excl['chin_low'] = (y < 1.25)
excl['logo'] = (z > -52) & (z < -33) & (np.abs(x) < 10) & (y > 22)
# patch borders
E = np.sort(np.concatenate([F[:, [0, 1]], F[:, [1, 2]], F[:, [2, 0]]]), 1)
u, c = np.unique(E, axis=0, return_counts=True)
bv = np.zeros(len(V), bool); bv[u[c == 1].ravel()] = True
excl['patch_border'] = dilate(bv, 1.2)
ex = np.zeros(len(V), bool)
for k, v in excl.items():
    print(f'{k:14s} {v.sum():6d}'); ex |= v
keep = ~ex
print('kept', keep.sum(), 'of', len(V))
P = V[keep]; Pn = N[keep]
# mirror (x -> -x); the -X side has no side buttons so it fills the +X button area
Pm = P * [-1, 1, 1]; Pnm = Pn * [-1, 1, 1]
src = np.r_[np.zeros(len(P)), np.ones(len(Pm))]
np.savez_compressed('work/fit_targets.npz', P=np.r_[P, Pm], N=np.r_[Pn, Pnm], src=src, keep=keep)
# front face points for the nose plane (exclude USB port region)
ff = excl['front_face'] & ~((np.abs(x) < 6.5) & (y < 10.5)) & (y > 2.0) & (g > -0.04)
np.savez_compressed('work/front_face_pts.npz', P=V[ff], N=N[ff])
print('front face pts', ff.sum())
# visualization
from raster import persp_cam, shade
from PIL import Image
col = np.zeros((len(V), 3)); col[:] = (0.75, 0.75, 0.78)
pal = {'seam': (0.9, 0.2, 0.2), 'wheel': (0.2, 0.5, 0.9), 'buttons': (0.2, 0.8, 0.3), 'front_face': (0.9, 0.7, 0.1),
       'chin_low': (0.6, 0.3, 0.8), 'logo': (0.1, 0.8, 0.8), 'patch_border': (1.0, 0.5, 0.0)}
for k, v in excl.items(): col[v] = pal[k]
for nm, cam in {'ex_a': persp_cam((110, 90, 120), (0, 12, 5), (0, 1, 0), 30), 'ex_b': persp_cam((-120, 70, -110), (0, 12, 0), (0, 1, 0), 30)}.items():
    img, _ = shade(V, F, cam, 1100, 700, vcolor=col, spec=0.1)
    Image.fromarray(img).save(f'work/{nm}.png')
