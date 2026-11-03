"""Per-vertex groove field: g = (v - smooth(v)) . n   (negative = groove/seam)."""
import sys, numpy as np, trimesh, scipy.sparse as sp
sys.path.insert(0, '/home/claude/theseus/3d/shell/tools')
def adjacency(F, n):
    E = np.concatenate([F[:, [0, 1]], F[:, [1, 2]], F[:, [2, 0]]])
    E = np.concatenate([E, E[:, ::-1]])
    A = sp.coo_matrix((np.ones(len(E)), (E[:, 0], E[:, 1])), shape=(n, n)).tocsr()
    A.data[:] = 1.0
    return A
def laplacian_smooth(V, F, iters=30, lam=0.5, A=None):
    n = len(V); A = adjacency(F, n) if A is None else A
    deg = np.asarray(A.sum(1)).ravel()
    Dinv = sp.diags(1.0 / np.maximum(deg, 1))
    P = Dinv @ A
    X = V.copy()
    for _ in range(iters):
        X = X + lam * (P @ X - X)
    return X
def groove_field(V, F, iters=40):
    Vs = laplacian_smooth(V, F, iters)
    m = trimesh.Trimesh(Vs, F, process=False)
    n = m.vertex_normals
    return ((V - Vs) * n).sum(1), Vs, n
if __name__ == '__main__':
    from raster import persp_cam, shade
    from PIL import Image
    d = np.load('/home/claude/theseus/refs/scan/sora-normalized.npz')
    V = d['vertices'].astype(float); F = d['faces'].astype(np.int64)
    # merge duplicate vertices across scan patches so smoothing crosses patch boundaries
    m = trimesh.Trimesh(V, F, process=True)  # merges close verts
    V, F = m.vertices, m.faces
    g, Vs, n = groove_field(V, F, 25)
    np.savez_compressed('work/groove_scan.npz', V=V, F=F, g=g)
    print('verts', len(V), 'g pct', np.percentile(g, [1, 5, 50, 95, 99]))
    t = np.clip(-g / 0.25, -1, 1)
    col = np.zeros((len(V), 3)); col[:] = 0.8
    col[t > 0] = (0.8 - 0.8 * t[t > 0, None] * np.array([0, 1, 1]))  # grooves red
    col[t < 0] = (0.8 + 0.8 * t[t < 0, None] * np.array([1, 1, 0]))  # ridges blue
    cams = {'g_side': persp_cam((150, 30, 15), (25, 18, 10), (0, 1, 0), 34),
            'g_nose': persp_cam((70, 40, 120), (5, 14, 40), (0, 1, 0), 32),
            'g_top': persp_cam((0, 160, 5), (0, 20, 5), (0, 0, 1), 44),
            'g_nside': persp_cam((-150, 30, 15), (-25, 18, 10), (0, 1, 0), 34)}
    for k, c in cams.items():
        img, _ = shade(V, F, c, 1300, 800, vcolor=col, spec=0.15)
        Image.fromarray(img).save(f'work/{k}.png'); print(k)
