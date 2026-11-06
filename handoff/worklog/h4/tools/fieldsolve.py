"""H4: a 2D quasi-static field solver for the Theseus board's USB 2.0 pair (finite volumes on a graded rectilinear grid).

The cross-section: FR4 (er_sub) between the two copper faces, h thick; the pair (two traces w wide, s apart, t thick) on one
face; the reference copper on the other face (an infinite plane, or a band that ends m past the pair's outer edges, with air
beyond); optionally the same face's ground pour g from the pair's outer edges (a coplanar ground); optionally solder mask
(er_mask) c1 thick over bare laminate and c2 over copper (conformal). Everything sits in a grounded box far away.

Method: Laplace's equation div(eps grad phi) = 0, cell-centred permittivity, node potentials; each node's control volume
balances the flux through its four faces (the 5-point finite-volume stencil, exact at material interfaces on grid lines).
Conductors are Dirichlet nodes. A conductor's charge is the discrete Gauss law (the net flux out of its nodes). For each mode
(odd: +1/-1, even: +1/+1) the charge per unit length with the dielectrics (C) and with everything air (C0) gives
Z = eta0 / sqrt(C/eps0 * C0/eps0) and eps_eff = C/C0. Z_diff = 2 Z_odd, Z_cm = Z_even / 2.

Validated in validate(): single microstrip against Hammerstad & Jensen (1980) and coupled microstrip against Kirschning &
Jansen (1984), plus grid and box convergence.
"""
import math, sys, json
import numpy as np
import scipy.sparse as sp
import scipy.sparse.linalg as spla

ETA0 = 376.730313668
C0 = 299792458.0


def graded(keys, lo, hi, hmin, ratio, hmax):
    """grid lines through every key coordinate in [lo, hi], spacing hmin at each key, growing by `ratio` up to hmax"""
    keys = sorted(set([lo, hi] + [k for k in keys if lo <= k <= hi]))
    # merge keys closer than hmin/4
    kk = [keys[0]]
    for k in keys[1:]:
        if k - kk[-1] > hmin * 0.25:
            kk.append(k)
        else:
            kk[-1] = k if k in (lo, hi) else kk[-1]
    pts = [kk[0]]
    for a, b in zip(kk[:-1], kk[1:]):
        L = b - a
        # grow from both ends toward the middle
        left, right = [], []
        d, x = hmin, 0.0
        while True:
            # symmetric fill: add steps from each end until they meet
            if x + d >= L / 2:
                break
            left.append(d); x += d
            d = min(d * ratio, hmax)
        # mirror
        steps = left + [max(L - 2 * x, 0.0)] + left[::-1]
        steps = [s for s in steps if s > 1e-12]
        # the middle step may be up to 2*hmax: split it if needed
        out = []
        for s in steps:
            n = max(1, int(math.ceil(s / hmax - 1e-9)))
            out += [s / n] * n
        acc = a
        for s in out[:-1]:
            acc += s
            pts.append(acc)
        pts.append(b)
    return np.array(pts)


def solve(geom, hmin=0.0025, ratio=1.2, hmax_near=0.08, hmax_far=1.0, X=12.0, Y=12.0, verbose=False):
    """geom: dict(w, s, t, h, er_sub, er_mask=None, c1=0, c2=0, g=None (coplanar pour gap; None = none),
    m=None (reference band margin past the outer trace edges; None = infinite plane at y=0)).
    Returns dict(Zodd, Zeven, Zdiff, Zcm, eeff_odd, eeff_even, Codd, Ceven (pF/m), C0odd, C0even, nodes)."""
    w, s, t, h = geom['w'], geom['s'], geom['t'], geom['h']
    er, erm = geom['er_sub'], geom.get('er_mask') or 1.0
    c1, c2 = geom.get('c1', 0.0) if geom.get('er_mask') else 0.0, geom.get('c2', 0.0) if geom.get('er_mask') else 0.0
    g, m = geom.get('g'), geom.get('m')
    tref = geom.get('tref', t)
    single = bool(geom.get('single'))
    if single:                                # one trace centred at x = 0 (no second trace)
        x1a, x1b = -w / 2, w / 2
        x2a = x2b = None
    else:
        x1a, x1b = -(s / 2 + w), -s / 2      # trace 1 (left) and trace 2 (right, mirror)
        x2a, x2b = s / 2, s / 2 + w
    xo0, xo1 = x1a, (x1b if single else x2b)  # the outer edges of the line(s)
    yt0, yt1 = h, h + t
    infinite = m is None
    ybot = 0.0 if infinite else -Y
    # key coordinates
    xk = [x1a, x1b, 0.0] + ([] if single else [x2a, x2b])
    if c2 > 0:
        xk += [x1a - c2, x1b + c2] + ([] if single else [x2a - c2, x2b + c2])
    if g is not None:
        xk += [xo0 - g, xo1 + g]
        if c2 > 0:
            xk += [xo0 - g + c2, xo1 + g - c2]
    if not infinite:
        xk += [xo0 - m, xo1 + m]
    yk = [0.0, h, yt1]
    if c1 > 0:
        yk += [h + c1]
    if c2 > 0:
        yk += [yt1 + c2]
    if not infinite:
        yk += [-tref]
    # fine region: graded near keys, hmax_near inside |x| < 3 mm, y < 2 mm; coarser beyond (second pass)
    xs = graded(xk + [-3.0, 3.0], -X, X, hmin, ratio, hmax_far)
    ys = graded(yk + [2.0] + ([-2.0] if not infinite else []), ybot, Y, hmin, ratio, hmax_far)
    # cap the spacing near the structure
    def cap(arr, lo, hi, hm):
        out = [arr[0]]
        for a, b in zip(arr[:-1], arr[1:]):
            if lo - 1e-9 <= a and b <= hi + 1e-9 and b - a > hm:
                n = int(math.ceil((b - a) / hm))
                out += list(a + (b - a) * np.arange(1, n) / n)
            out.append(b)
        return np.array(out)
    xs = cap(xs, -3.0, 3.0, hmax_near)
    ys = cap(ys, (0.0 if infinite else -2.0), 2.0, hmax_near)
    nx, ny = len(xs), len(ys)
    xc = 0.5 * (xs[:-1] + xs[1:]); yc = 0.5 * (ys[:-1] + ys[1:])
    XC, YC = np.meshgrid(xc, yc, indexing='ij')              # cell centres (nx-1, ny-1)

    def eps_cells(with_diel):
        E = np.ones_like(XC)
        if not with_diel:
            return E
        E[(YC > 0) & (YC < h)] = er
        if c1 > 0:
            E[(YC > h) & (YC < h + c1)] = erm
        if c2 > 0:
            for (a, b) in ((x1a, x1b),) + (() if single else ((x2a, x2b),)):
                E[(XC > a - c2) & (XC < b + c2) & (YC > h) & (YC < yt1 + c2)] = erm
            if g is not None:
                E[(XC < xo0 - g + c2) & (YC > h) & (YC < yt1 + c2)] = erm
                E[(XC > xo1 + g - c2) & (YC > h) & (YC < yt1 + c2)] = erm
        return E

    XN, YN = np.meshgrid(xs, ys, indexing='ij')
    tol = 1e-9
    def inside(a, b, c, d):
        return (XN >= a - tol) & (XN <= b + tol) & (YN >= c - tol) & (YN <= d + tol)
    cond = np.zeros((nx, ny), dtype=np.int8)       # 0 free, 1 trace 1, 2 trace 2, 3 ground (Dirichlet 0)
    cond[inside(x1a, x1b, yt0, yt1)] = 1
    if not single:
        cond[inside(x2a, x2b, yt0, yt1)] = 2
    if g is not None:
        cond[inside(-X, xo0 - g, yt0, yt1)] = 3
        cond[inside(xo1 + g, X, yt0, yt1)] = 3
    if infinite:
        cond[:, 0] = 3
    else:
        cond[inside(xo0 - m, xo1 + m, -tref, 0.0)] = 3
        cond[:, 0] = 3
    cond[0, :] = 3; cond[-1, :] = 3; cond[:, -1] = 3

    dx = np.diff(xs); dy = np.diff(ys)
    idx = -np.ones((nx, ny), dtype=np.int64)
    free = cond == 0
    idx[free] = np.arange(free.sum())
    N = int(free.sum())

    def run(with_diel, V1, V2):
        E = eps_cells(with_diel)
        # edge conductances: east edges (i,j)-(i+1,j) for j in 1..ny-2 use cells (i,j-1),(i,j)
        Epad = np.zeros((nx + 1, ny + 1)); Epad[1:-1, 1:-1] = E          # pad so out-of-range cells contribute 0
        dyp = np.zeros(ny + 1); dyp[1:-1] = dy
        dxp = np.zeros(nx + 1); dxp[1:-1] = dx
        # GE[i,j]: conductance between node (i,j) and (i+1,j), i in 0..nx-2
        GE = (Epad[1:nx, 0:ny] * dyp[0:ny][None, :] / 2 + Epad[1:nx, 1:ny + 1] * dyp[1:ny + 1][None, :] / 2) / dx[:, None]
        # GN[i,j]: between (i,j) and (i,j+1), j in 0..ny-2
        GN = (Epad[0:nx, 1:ny] * dxp[0:nx][:, None] / 2 + Epad[1:nx + 1, 1:ny] * dxp[1:nx + 1][:, None] / 2) / dy[None, :]
        Vfix = np.zeros((nx, ny)); Vfix[cond == 1] = V1; Vfix[cond == 2] = V2
        rows, cols, vals = [], [], []
        b = np.zeros(N)
        diag = np.zeros(N)
        # assemble over edges
        for (G, di, dj) in ((GE, 1, 0), (GN, 0, 1)):
            I, J = np.meshgrid(np.arange(G.shape[0]), np.arange(G.shape[1]), indexing='ij')
            a_i, a_j = I.ravel(), J.ravel(); b_i, b_j = a_i + di, a_j + dj
            gv = G.ravel()
            ia, ib = idx[a_i, a_j], idx[b_i, b_j]
            fa, fb = ia >= 0, ib >= 0
            # both free
            both = fa & fb
            rows += [ia[both], ib[both]]; cols += [ib[both], ia[both]]; vals += [-gv[both], -gv[both]]
            np.add.at(diag, ia[fa], gv[fa]); np.add.at(diag, ib[fb], gv[fb])
            # free - fixed
            m1 = fa & ~fb
            np.add.at(b, ia[m1], gv[m1] * Vfix[b_i[m1], b_j[m1]])
            m2 = fb & ~fa
            np.add.at(b, ib[m2], gv[m2] * Vfix[a_i[m2], a_j[m2]])
        rows.append(np.arange(N)); cols.append(np.arange(N)); vals.append(diag)
        A = sp.csr_matrix((np.concatenate(vals), (np.concatenate(rows), np.concatenate(cols))), shape=(N, N))
        phi_free = spla.spsolve(A.tocsc(), b)
        phi = Vfix.copy(); phi[free] = phi_free
        # charge on trace 1: net flux out of its nodes
        Q = 0.0
        for (G, di, dj) in ((GE, 1, 0), (GN, 0, 1)):
            I, J = np.meshgrid(np.arange(G.shape[0]), np.arange(G.shape[1]), indexing='ij')
            a_i, a_j = I.ravel(), J.ravel(); b_i, b_j = a_i + di, a_j + dj
            gv = G.ravel()
            ca, cb = cond[a_i, a_j] == 1, cond[b_i, b_j] == 1
            dphi = phi[a_i, a_j] - phi[b_i, b_j]
            Q += np.sum(gv[ca & ~cb] * dphi[ca & ~cb]) - np.sum(gv[cb & ~ca] * dphi[cb & ~ca])
        return Q / V1, phi

    if single:
        S, _ = run(True, 1.0, 0.0)
        S0, _ = run(False, 1.0, 0.0)
        Z = ETA0 / math.sqrt(S * S0)
        return dict(Z0=Z, eeff=S / S0, nodes=N, nx=nx, ny=ny)
    So, _ = run(True, 1.0, -1.0)
    S0o, _ = run(False, 1.0, -1.0)
    Se, _ = run(True, 1.0, 1.0)
    S0e, _ = run(False, 1.0, 1.0)
    Zo = ETA0 / math.sqrt(So * S0o); Ze = ETA0 / math.sqrt(Se * S0e)
    eps0 = 8.8541878128e-12
    r = dict(Zodd=Zo, Zeven=Ze, Zdiff=2 * Zo, Zcm=Ze / 2, eeff_odd=So / S0o, eeff_even=Se / S0e,
             Codd_pF_m=So * eps0 * 1e12, Ceven_pF_m=Se * eps0 * 1e12, nodes=N, nx=nx, ny=ny)
    if verbose:
        print(json.dumps({k: (round(v, 4) if isinstance(v, float) else v) for k, v in r.items()}))
    return r


# ----------------------------------------------------------------------------------------- closed forms (validation)
def hj_single(w, h, er, t=0.0):
    """Hammerstad & Jensen (1980), static, with their thickness correction"""
    u = w / h
    if t > 0:
        t_ = t / h
        du1 = t_ / math.pi * math.log(1 + 4 * math.e / (t_ * (1 / math.tanh(math.sqrt(6.517 * u))) ** 2))
        dur = 0.5 * (1 + 1 / math.cosh(math.sqrt(er - 1))) * du1
        u1, ur = u + du1, u + dur
    else:
        u1 = ur = u
    def z01(u):
        f = 6 + (2 * math.pi - 6) * math.exp(-(30.666 / u) ** 0.7528)
        return ETA0 / (2 * math.pi) * math.log(f / u + math.sqrt(1 + (2 / u) ** 2))
    def ee(u):
        a = 1 + 1 / 49 * math.log((u ** 4 + (u / 52) ** 2) / (u ** 4 + 0.432)) + 1 / 18.7 * math.log(1 + (u / 18.1) ** 3)
        b = 0.564 * ((er - 0.9) / (er + 3)) ** 0.053
        return (er + 1) / 2 + (er - 1) / 2 * (1 + 10 / u) ** (-a * b)
    Z = z01(ur) / math.sqrt(ee(ur))
    e_eff = ee(ur) * (z01(u1) / z01(ur)) ** 2
    return Z, e_eff


def kj_coupled(w, s, h, er):
    """Kirschning & Jansen (1984) static even/odd impedances of edge-coupled microstrip (t = 0)"""
    u, gg = w / h, s / h
    # single line (HJ, t=0)
    Z01, ee1 = hj_single(w, h, er)
    def z01(u):
        f = 6 + (2 * math.pi - 6) * math.exp(-(30.666 / u) ** 0.7528)
        return ETA0 / (2 * math.pi) * math.log(f / u + math.sqrt(1 + (2 / u) ** 2))
    Zl0 = z01(u)                                   # single line in air
    # even/odd effective permittivities
    v = u * (20 + gg ** 2) / (10 + gg ** 2) + gg * math.exp(-gg)
    ae = 1 + 1 / 49 * math.log((v ** 4 + (v / 52) ** 2) / (v ** 4 + 0.432)) + 1 / 18.7 * math.log(1 + (v / 18.1) ** 3)
    be = 0.564 * ((er - 0.9) / (er + 3)) ** 0.053
    ee_e = (er + 1) / 2 + (er - 1) / 2 * (1 + 10 / v) ** (-ae * be)
    a0 = 0.7287 * (ee1 - (er + 1) / 2) * (1 - math.exp(-0.179 * u))
    b0 = 0.747 * er / (0.15 + er)
    c0 = b0 - (b0 - 0.207) * math.exp(-0.414 * u)
    d0 = 0.593 + 0.694 * math.exp(-0.562 * u)
    ee_o = ((er + 1) / 2 + a0 - ee1) * math.exp(-c0 * gg ** d0) + ee1
    # impedances
    Q1 = 0.8695 * u ** 0.194
    Q2 = 1 + 0.7519 * gg + 0.189 * gg ** 2.31
    Q3 = 0.1975 + (16.6 + (8.4 / gg) ** 6) ** (-0.387) + 1 / 241 * math.log(gg ** 10 / (1 + (gg / 3.4) ** 10))
    Q4 = 2 * Q1 / Q2 * 1 / (math.exp(-gg) * u ** Q3 + (2 - math.exp(-gg)) * u ** (-Q3))
    Q5 = 1.794 + 1.14 * math.log(1 + 0.638 / (gg + 0.517 * gg ** 2.43))
    Q6 = 0.2305 + 1 / 281.3 * math.log(gg ** 10 / (1 + (gg / 5.8) ** 10)) + 1 / 5.1 * math.log(1 + 0.598 * gg ** 1.154)
    Q7 = (10 + 190 * gg ** 2) / (1 + 82.3 * gg ** 3)
    Q8 = math.exp(-6.5 - 0.95 * math.log(gg) - (gg / 0.15) ** 5)
    Q9 = math.log(Q7) * (Q8 + 1 / 16.5)
    Q10 = (Q2 * Q4 - Q5 * math.exp(math.log(u) * Q6 * u ** (-Q9))) / Q2
    Zl = Zl0  # air
    Ze = math.sqrt(ee1 / ee_e) * Z01 / (1 - Z01 / ETA0 * math.sqrt(ee1) * Q4)
    Zo = math.sqrt(ee1 / ee_o) * Z01 / (1 - Z01 / ETA0 * math.sqrt(ee1) * Q10)
    return dict(Zeven=Ze, Zodd=Zo, Zdiff=2 * Zo, eeff_even=ee_e, eeff_odd=ee_o)


def ipc2141_diff(w, s, h, t, er):
    z0 = 87 / math.sqrt(er + 1.41) * math.log(5.98 * h / (0.8 * w + t))
    return z0, 2 * z0 * (1 - 0.48 * math.exp(-0.96 * s / h))


def validate():
    out = {}
    h, er = 0.565, 4.3
    # 1) single line, t = 0 (HJ exact to ~0.01 % in air, eeff ~0.2 %)
    for w in (0.3, 1.0):
        r = solve(dict(w=w, s=0, t=0.0, h=h, er_sub=er, single=True))
        Zhj, ehj = hj_single(w, h, er)
        out['single_w%.1f_t0' % w] = dict(fd=round(r['Z0'], 3), hj=round(Zhj, 3), err_pct=round(100 * (r['Z0'] / Zhj - 1), 3),
                                          eeff_fd=round(r['eeff'], 4), eeff_hj=round(ehj, 4))
    # 2) single line with t = 17.5 um (HJ's thickness correction, ~1 %)
    r = solve(dict(w=1.0, s=0, t=0.0175, h=h, er_sub=er, single=True))
    Zhj, ehj = hj_single(1.0, h, er, 0.0175)
    out['single_w1.0_t17.5'] = dict(fd=round(r['Z0'], 3), hj=round(Zhj, 3), err_pct=round(100 * (r['Z0'] / Zhj - 1), 3),
                                    eeff_fd=round(r['eeff'], 4), eeff_hj=round(ehj, 4))
    # 3) coupled, t = 0 (Kirschning-Jansen, ~1 %)
    for (w, s) in ((0.55, 0.15), (0.3, 0.3), (0.5, 0.565)):
        r = solve(dict(w=w, s=s, t=0.0, h=h, er_sub=er))
        kj = kj_coupled(w, s, h, er)
        out['coupled_w%.2f_s%.3f_t0' % (w, s)] = dict(fd_Zodd=round(r['Zodd'], 3), kj_Zodd=round(kj['Zodd'], 3),
                                                     fd_Zeven=round(r['Zeven'], 3), kj_Zeven=round(kj['Zeven'], 3),
                                                     err_odd_pct=round(100 * (r['Zodd'] / kj['Zodd'] - 1), 2),
                                                     err_even_pct=round(100 * (r['Zeven'] / kj['Zeven'] - 1), 2))
    # 4) convergence (the design case): finer grid, bigger box
    base = dict(w=0.55, s=0.15, t=0.0175, h=h, er_sub=er)
    r0 = solve(base)
    r1 = solve(base, hmin=0.0015, ratio=1.12, hmax_near=0.04)
    r2 = solve(base, X=24.0, Y=24.0)
    out['convergence'] = dict(base=round(r0['Zdiff'], 3), fine=round(r1['Zdiff'], 3), bigbox=round(r2['Zdiff'], 3),
                              nodes=(r0['nodes'], r1['nodes'], r2['nodes']))
    return out


if __name__ == '__main__':
    if '--validate' in sys.argv:
        print(json.dumps(validate(), indent=1))
    else:
        g = json.loads(sys.argv[1])
        solve(g, verbose=True)
