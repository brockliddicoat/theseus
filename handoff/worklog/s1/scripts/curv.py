"""A curvature map of the shell's skin seen from above / from the side: where the surface bends sharply (creases, edges,
seams) shows dark. Per-vertex: the spread of the normals of the vertex's neighbours (1 - mean cos), smoothed once.

    python3 curv.py <glb> <out.png> <view> [px_per_mm] [nodes] [vmax]
"""
import sys
import numpy as np, cv2
sys.path.insert(0, '/home/claude/work/s1/scripts')
from render import load, VIEWS, view34
import scipy.sparse as sp


def vertex_curv(P, N, T):
    n = len(P)
    I = np.concatenate([T[:, 0], T[:, 1], T[:, 2], T[:, 1], T[:, 2], T[:, 0]])
    J = np.concatenate([T[:, 1], T[:, 2], T[:, 0], T[:, 0], T[:, 1], T[:, 2]])
    A = sp.csr_matrix((np.ones(len(I)), (I, J)), shape=(n, n)); A.data[:] = 1
    deg = np.asarray(A.sum(1)).ravel(); deg[deg == 0] = 1
    Nm = N / np.maximum(np.linalg.norm(N, axis=1, keepdims=True), 1e-9)
    # mean neighbour normal; the edge length to scale it into a curvature (1/mm)
    avg = (A @ Nm) / deg[:, None]
    el = np.linalg.norm(P[T[:, 0]] - P[T[:, 1]], axis=1).mean()
    k = (1 - np.clip((avg * Nm).sum(1) / np.maximum(np.linalg.norm(avg, axis=1), 1e-9), -1, 1))
    k = np.sqrt(2 * k) / el                  # ~ angle / edge length
    k = (A @ k + k) / (deg + 1)
    return k


def render_curv(meshes, view, s=10.0, vmax=0.35, pad=3, box=None):
    if view in VIEWS: r, u, d = VIEWS[view]
    else: r, u, d = view34(*[float(v) for v in view[2:].split(':')])
    allP = np.vstack([m[1] for m in meshes]); X = allP @ r; Y = allP @ u
    if box is None: box = (X.min() - pad, Y.min() - pad, X.max() + pad, Y.max() + pad)
    x0, y0, x1, y1 = box
    W, H = int((x1 - x0) * s), int((y1 - y0) * s)
    img = np.ones((H, W, 3), np.float32) * np.array([245, 245, 247], np.float32) / 255
    tris, cols, depth = [], [], []
    for name, P, N, C, T in meshes:
        k = vertex_curv(P, N, T)
        A, B, Cc = P[T[:, 0]], P[T[:, 1]], P[T[:, 2]]
        vis = (np.cross(B - A, Cc - A) @ d) > -1e-9
        kk = k[T].mean(1)
        occ = C[T].mean(1).mean(1)
        v = 1 - np.clip(kk / vmax, 0, 1) * 0.9
        v = v * (0.4 + 0.6 * occ)
        q = np.stack([(A @ r - x0) * s, (y1 - A @ u) * s, (B @ r - x0) * s, (y1 - B @ u) * s, (Cc @ r - x0) * s, (y1 - Cc @ u) * s], 1)
        tris.append(q[vis]); cols.append(v[vis]); depth.append(((A + B + Cc) / 3 @ d)[vis])
    tris = np.vstack(tris); cols = np.concatenate(cols); depth = np.concatenate(depth)
    q = np.round(tris * 16).astype(np.int32).reshape(-1, 3, 2)
    for i in np.argsort(depth):
        c = float(cols[i]); cv2.fillConvexPoly(img, q[i], (c, c, c), lineType=cv2.LINE_AA, shift=4)
    return (np.clip(img, 0, 1) * 255).astype(np.uint8), box


if __name__ == '__main__':
    fn, out, view = sys.argv[1], sys.argv[2], sys.argv[3]
    s = float(sys.argv[4]) if len(sys.argv) > 4 else 10
    names = sys.argv[5].split(',') if len(sys.argv) > 5 and sys.argv[5] else None
    vmax = float(sys.argv[6]) if len(sys.argv) > 6 else 0.35
    img, box = render_curv(load(fn, names), view, s, vmax)
    cv2.imwrite(out, img[:, :, ::-1]); print(out, img.shape, [round(v, 2) for v in box])
