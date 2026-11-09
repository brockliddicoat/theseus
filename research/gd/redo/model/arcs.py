"""A curve made of circular arcs, each with a length L (mm) and a turn phi (rad): curvature k = phi / L, joined with a
continuous tangent (G1). Its "depth" is the sagitta over its chord, R (1 - cos(phi / 2)), signed like phi.

  chain(p0, th0, arcs)        -> dense samples {x, y, s, th, k, i}
  fit(target, p0, th0, init)  -> arcs fitted by least squares (scipy), with the fit error in mm
"""
import numpy as np
from scipy.optimize import least_squares
from scipy.spatial import cKDTree

def chain(p0, th0, arcs, ds=0.2):
    """exact arcs: arcs = [(L, phi), ...]; returns arrays x, y, s, th, k, i (arc index)"""
    x, y, th, s = float(p0[0]), float(p0[1]), float(th0), 0.0
    X, Y, S, TH, K, I = [x], [y], [s], [th], [arcs[0][1] / max(arcs[0][0], 1e-9)], [0]
    for i, (L, ph) in enumerate(arcs):
        L = max(float(L), 1e-6); k = ph / L; n = max(2, int(np.ceil(L / ds)))
        u = np.linspace(0, L, n + 1)[1:]
        if abs(k) < 1e-9:
            xs = x + np.cos(th) * u; ys = y + np.sin(th) * u; ths = np.full_like(u, th)
        else:
            ths = th + k * u
            xs = x + (np.sin(ths) - np.sin(th)) / k; ys = y - (np.cos(ths) - np.cos(th)) / k
        X += xs.tolist(); Y += ys.tolist(); S += (s + u).tolist(); TH += ths.tolist(); K += [k] * n; I += [i] * n
        x, y, th, s = xs[-1], ys[-1], ths[-1], s + L
    return {'x': np.array(X), 'y': np.array(Y), 's': np.array(S), 'th': np.array(TH), 'k': np.array(K), 'i': np.array(I)}

def depth(L, ph):
    """sagitta of the arc over its chord, signed like the turn (mm)"""
    if abs(ph) < 1e-9: return 0.0
    R = L / abs(ph); return float(np.sign(ph) * R * (1 - np.cos(ph / 2)))

def resample(P, n):
    d = np.r_[0, np.cumsum(np.hypot(*np.diff(P, axis=0).T))]
    u = np.linspace(0, d[-1], n)
    return np.c_[np.interp(u, d, P[:, 0]), np.interp(u, d, P[:, 1])]

def err(C, target):
    """distance from each target point to the chain (mm), both ways' worst"""
    tr = cKDTree(np.c_[C['x'], C['y']]); d1, _ = tr.query(target)
    return d1

def fit(target, p0, th0, init, fixL=None, w_end=4.0, iters=400, end=None):
    """fit arc lengths and turns to an ordered polyline 'target' (n, 2) from p0 at heading th0.
    end: optional (point, heading) the chain must also reach; residuals = matched points by arc-length fraction,
    then refined by the nearest distance"""
    T = resample(np.asarray(target, float), 240)
    n = len(init); x0 = np.r_[np.log([a[0] for a in init]), [a[1] for a in init]]
    def res(v, nearest=False):
        arcs = list(zip(np.exp(v[:n]), v[n:]))
        C = chain(p0, th0, arcs, ds=0.25)
        P = np.c_[C['x'], C['y']]
        if nearest:
            r = (T - P[cKDTree(P).query(T)[1]]).ravel()
        else:
            u = np.linspace(0, C['s'][-1], len(T))
            Q = np.c_[np.interp(u, C['s'], C['x']), np.interp(u, C['s'], C['y'])]
            r = (Q - T).ravel()
        extra = [w_end * (P[-1] - T[-1])]
        if end is not None:
            extra.append([w_end * 20 * np.sin(C['th'][-1] - end)])
        return np.r_[r, np.concatenate(extra)]
    lo = np.r_[np.full(n, np.log(0.5)), np.full(n, -2.6)]; hi = np.r_[np.full(n, np.log(90.0)), np.full(n, 2.6)]
    x0 = np.clip(x0, lo + 1e-6, hi - 1e-6)
    r1 = least_squares(res, x0, bounds=(lo, hi), max_nfev=iters)
    r2 = least_squares(lambda v: res(v, True), r1.x, bounds=(lo, hi), max_nfev=iters)
    v = r2.x; arcs = [(float(a), float(b)) for a, b in zip(np.exp(v[:n]), v[n:])]
    C = chain(p0, th0, arcs)
    e = err(C, T)
    return arcs, C, {'rms': float(np.sqrt(np.mean(e ** 2))), 'max': float(e.max()), 'p95': float(np.percentile(e, 95))}
