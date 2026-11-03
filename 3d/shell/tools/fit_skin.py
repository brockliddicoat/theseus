"""Fit a Loop subdivision surface to the cleaned, mirrored scan targets.
python3 fit_skin.py control.npz lam out_prefix [levels=2] [iters=10]
"""
import sys, time, numpy as np, scipy.sparse as sp, scipy.sparse.linalg as spla, trimesh, igl
from scipy.spatial import cKDTree
sys.path.insert(0, '/home/claude/theseus/3d/shell/tools')
from loop import loop_matrix, umbrella


def vnormals(V, F):
    fn = np.cross(V[F[:, 1]] - V[F[:, 0]], V[F[:, 2]] - V[F[:, 0]])
    vn = np.zeros_like(V)
    for k in range(3):
        np.add.at(vn, F[:, k], fn)
    return vn / (np.linalg.norm(vn, axis=1, keepdims=True) + 1e-12)


def fit(Vc, Fc, P, PN, lam=2.0, mu=0.05, levels=2, iters=10, maxd=2.0, verbose=True, bilap=0.0):
    n = len(Vc)
    A, Ff = loop_matrix(Fc, n, levels)
    L = umbrella(Fc, n)
    R = sp.block_diag([L, L, L]).tocsr()
    if bilap > 0:
        L2 = (L @ L).tocsr()
        R = sp.vstack([R, np.sqrt(bilap / max(lam, 1e-9)) * sp.block_diag([L2, L2, L2])]).tocsr()
    tree = cKDTree(P)
    C = Vc.copy()
    for it in range(iters):
        t0 = time.time()
        X = A @ C
        nf = vnormals(X, Ff)
        dist, idx = tree.query(X)
        p, pn = P[idx], PN[idx]
        dv = X - p
        tang = np.linalg.norm(dv - (dv * pn).sum(1, keepdims=True) * pn, axis=1)
        ok = (dist < maxd) & ((nf * pn).sum(1) > 0.4) & (tang < 0.7)
        Ai = A[ok]
        k = ok.sum()
        D = [sp.diags(pn[ok, c]) @ Ai for c in range(3)]
        M_pl = sp.hstack(D).tocsr()
        b_pl = (pn[ok] * p[ok]).sum(1)
        sm = np.sqrt(mu)
        M_pp = sm * sp.block_diag([Ai, Ai, Ai]).tocsr()
        b_pp = sm * np.concatenate([p[ok, 0], p[ok, 1], p[ok, 2]])
        sl = np.sqrt(lam)
        M = sp.vstack([M_pl, M_pp, sl * R]).tocsr()
        b = np.concatenate([b_pl, b_pp, np.zeros(R.shape[0])])
        MtM = (M.T @ M).tocsc()
        c = spla.spsolve(MtM, M.T @ b)
        C = c.reshape(3, n).T
        if verbose:
            res = np.abs(((A[ok] @ C) - p[ok]) * pn[ok]).sum(1)
            print(f'it {it}: matched {k}/{len(X)}  mean|plane res| {res.mean():.4f}  p95 {np.percentile(res,95):.4f}  ({time.time()-t0:.1f}s)')
    return C, A, Ff


if __name__ == '__main__':
    ctrl = np.load(sys.argv[1]); lam = float(sys.argv[2]); out = sys.argv[3]
    levels = int(sys.argv[4]) if len(sys.argv) > 4 else 2
    iters = int(sys.argv[5]) if len(sys.argv) > 5 else 10
    bilap = float(sys.argv[6]) if len(sys.argv) > 6 else 0.0
    T = np.load('work/fit_targets.npz')
    P, PN, src = T['P'], T['N'], T['src']
    C, A, Ff = fit(ctrl['V'], ctrl['F'], P, PN, lam=lam, levels=levels, iters=iters, bilap=bilap)
    X = A @ C
    np.savez_compressed(out + '.npz', C=C, Fc=ctrl['F'], X=X, Ff=Ff, lam=lam, levels=levels)
    # evaluation: distance of original-side targets to the fitted surface
    orig = P[src == 0]
    d2, fi, cp = igl.point_mesh_squared_distance(orig, X, Ff.astype(np.int64))
    dd = np.sqrt(d2)
    print('target->surface  mean %.4f  rms %.4f  p95 %.4f  p99 %.4f  max %.4f mm' % (dd.mean(), np.sqrt((dd**2).mean()), np.percentile(dd, 95), np.percentile(dd, 99), dd.max()))
