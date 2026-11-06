"""The trigger/body seam's centreline in 3D on a shell GLB: midpoints of facing outer vertices of a trigger and the body
(within 0.9 mm), the +X (triggerL) side, ordered from the nose round to the rear cutout's middle; saved as JSON."""
import sys, json
import numpy as np
from scipy.spatial import cKDTree
sys.path.insert(0, '/home/claude/theseus/3d/shell/tools')
import glbio

def meshes(fn, names=('body', 'triggerL', 'triggerR')):
    js, b = glbio.read(fn); out = {}
    for k in names:
        _, d = glbio.mesh_arrays(js, b, k)
        out[k] = (d['POSITION'].astype(float), d['NORMAL'].astype(float), d['indices'].reshape(-1, 3))
    return out

def outer(P, N, yc=12.0):
    """vertices whose normal faces away from a centre line (x 0, y yc) and that lie on the outer skin side"""
    r = np.c_[P[:, 0], P[:, 1] - yc]; r /= np.maximum(np.linalg.norm(r, axis=1, keepdims=True), 1e-9)
    radial = N[:, 0] * r[:, 0] + N[:, 1] * r[:, 1]
    front = (P[:, 2] > 50) & (N[:, 2] > 0.5)
    return (radial > 0.3) | front

def seam_line(M, side='L', gap=0.9):
    tk = 'triggerL' if side == 'L' else 'triggerR'
    Pt, Nt, _ = M[tk]; Pb, Nb, _ = M['body']
    mt = outer(Pt, Nt); mb = outer(Pb, Nb)
    A = Pt[mt]; B = Pb[mb]
    d, i = cKDTree(B).query(A, distance_upper_bound=gap)
    ok = np.isfinite(d)
    mid = 0.5 * (A[ok] + B[i[ok]])
    sgn = 1 if side == 'L' else -1
    mid = mid[mid[:, 0] * sgn > -0.2]
    return mid

def order(mid, step=0.25):
    """order the cloud along the seam: by an angle round a pivot ahead of the rear cutout, in the (|x| + z) plane: we march
    with a nearest-neighbour chain from the nose's front-most centre point"""
    from scipy.spatial import cKDTree
    P = mid.copy()
    # thin to a 0.15 mm grid
    key = np.round(P / 0.15).astype(int); _, u = np.unique(key, axis=0, return_index=True); P = P[np.sort(u)]
    tree = cKDTree(P)
    start = np.argmax(P[:, 2] - 2 * np.abs(P[:, 0]))                 # the nose, middle
    cur = P[start]; out = [cur]; used = np.zeros(len(P), bool)
    prev_dir = None
    for _ in range(4000):
        idx = tree.query_ball_point(cur, 0.9)
        cand = [j for j in idx if not used[j]]
        for j in idx: used[j] = True if np.linalg.norm(P[j] - cur) < 0.35 else used[j]
        if not cand: break
        C = P[cand]; dv = C - cur; dist = np.linalg.norm(dv, axis=1)
        far = dist > 0.3
        if not far.any(): break
        C, dv, dist = C[far], dv[far], dist[far]
        if prev_dir is not None:
            cosang = (dv @ prev_dir) / dist
            C, dv, dist, cosang = C[cosang > 0.3], dv[cosang > 0.3], dist[cosang > 0.3], cosang[cosang > 0.3]
            if not len(C): break
        k = np.argmax(dist) if prev_dir is None else np.argmax(cosang * 0.3 + dist)
        nxt = C.mean(0) if False else C[k]
        prev_dir = (nxt - cur) / np.linalg.norm(nxt - cur)
        cur = nxt; out.append(cur)
    return np.array(out)

if __name__ == '__main__':
    fn = sys.argv[1]; out = sys.argv[2]
    M = meshes(fn)
    mid = seam_line(M, 'L')
    np.save(out.replace('.json', '_cloud.npy'), mid)
    print('cloud', mid.shape, 'x', mid[:, 0].min().round(2), mid[:, 0].max().round(2), 'z', mid[:, 2].min().round(2), mid[:, 2].max().round(2))
