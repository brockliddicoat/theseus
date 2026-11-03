"""Loop subdivision as sparse matrices (closed triangle meshes), plus helpers."""
import numpy as np, scipy.sparse as sp


def edges_of(F):
    m = len(F)
    he = np.concatenate([F[:, [0, 1]], F[:, [1, 2]], F[:, [2, 0]]])        # (3m,2)
    opp = np.concatenate([F[:, 2], F[:, 0], F[:, 1]])
    key = np.sort(he, 1)
    uniq, inv = np.unique(key, axis=0, return_inverse=True)
    inv = inv.ravel()
    return he, opp, uniq, inv


def loop_step(F, n):
    """One Loop step. Returns S ((n+ne) x n sparse) and new faces."""
    m = len(F)
    he, opp, E, inv = edges_of(F)
    ne = len(E)
    cnt = np.bincount(inv, minlength=ne)
    if cnt.max() > 2 or cnt.min() < 2:
        raise ValueError('mesh not closed-manifold: edge use counts %s' % np.bincount(cnt))
    # two opposite vertices per edge
    order = np.argsort(inv, kind='stable')
    oppE = opp[order].reshape(ne, 2)
    rows, cols, vals = [], [], []
    eid = np.arange(ne) + n
    for k, w in ((0, 3 / 8), (1, 3 / 8)):
        rows.append(eid); cols.append(E[:, k]); vals.append(np.full(ne, w))
    for k in (0, 1):
        rows.append(eid); cols.append(oppE[:, k]); vals.append(np.full(ne, 1 / 8))
    # even vertices
    nb_r = np.concatenate([E[:, 0], E[:, 1]]); nb_c = np.concatenate([E[:, 1], E[:, 0]])
    k = np.bincount(nb_r, minlength=n).astype(float)
    beta = np.where(k > 3, (1 / k) * (5 / 8 - (3 / 8 + 0.25 * np.cos(2 * np.pi / np.maximum(k, 1))) ** 2), 3 / 16)
    rows.append(np.arange(n)); cols.append(np.arange(n)); vals.append(1 - k * beta)
    rows.append(nb_r); cols.append(nb_c); vals.append(beta[nb_r])
    S = sp.csr_matrix((np.concatenate(vals), (np.concatenate(rows), np.concatenate(cols))), shape=(n + ne, n))
    e01 = inv[:m] + n; e12 = inv[m:2 * m] + n; e20 = inv[2 * m:] + n
    a, b, c = F[:, 0], F[:, 1], F[:, 2]
    Fn = np.concatenate([np.c_[a, e01, e20], np.c_[e01, b, e12], np.c_[e20, e12, c], np.c_[e01, e12, e20]])
    return S, Fn


def loop_matrix(F, n, levels):
    A = sp.identity(n, format='csr'); Fc = F; nc = n
    for _ in range(levels):
        S, Fc = loop_step(Fc, nc)
        A = S @ A; nc = S.shape[0]
    return A.tocsr(), Fc


def limit_matrix(F, n):
    """Loop limit-position stencil for a closed mesh (applied after the last subdivision level)."""
    he, opp, E, inv = edges_of(F)
    nb_r = np.concatenate([E[:, 0], E[:, 1]]); nb_c = np.concatenate([E[:, 1], E[:, 0]])
    k = np.bincount(nb_r, minlength=n).astype(float)
    beta = (1 / k) * (5 / 8 - (3 / 8 + 0.25 * np.cos(2 * np.pi / k)) ** 2)
    chi = 1 / (3 / (8 * beta) + k)
    rows = np.concatenate([np.arange(n), nb_r]); cols = np.concatenate([np.arange(n), nb_c])
    vals = np.concatenate([1 - k * chi, chi[nb_r]])
    return sp.csr_matrix((vals, (rows, cols)), shape=(n, n))


def umbrella(F, n):
    he, opp, E, inv = edges_of(F)
    r = np.concatenate([E[:, 0], E[:, 1]]); c = np.concatenate([E[:, 1], E[:, 0]])
    A = sp.csr_matrix((np.ones(len(r)), (r, c)), shape=(n, n))
    deg = np.asarray(A.sum(1)).ravel()
    return (sp.diags(1 / deg) @ A - sp.identity(n)).tocsr()
