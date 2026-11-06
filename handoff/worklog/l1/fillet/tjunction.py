"""L1 fillet study, part 1: the rib's root fillet (the rib meets the skin), solved.

A plane-strain section across one rib: the skin (thickness t) runs +-L either side of the rib; the rib (root width w,
height h, 0.5 deg draft) stands on it; the two root corners are filleted with radius r. Load: the skin is bent across
the rib line (a moment M per unit length applied as a linear traction at the left end, reacted at the right end), the
case that peaks at the crease and next to the press in the 3D study. Measure: SCF = peak maximum principal stress in
the fillet (and on the skin's outer face) over the skin's nominal bending stress 6M/t^2; and the junction's thick
section: the largest circle that fits in the junction (touching the outer face), against t (sink grows with it:
RapidDirect: past about 0.75 t a radius "may induce sink or thick-section issues").

Elements: 6-node quadratic triangles (LST), plane strain, on a graded Delaunay mesh (scipy), 3-point quadrature.
Validated on the plain skin in pure bending (SCF 1) and a mesh refinement. Units: mm, N, MPa.
Usage: python3 tjunction.py t w h  -> out/fillet_root.json
"""
import numpy as np, json, sys
from scipy.spatial import Delaunay
import scipy.sparse as sp, scipy.sparse.linalg as spla
from shapely.geometry import Polygon, Point
import shapely

E, NU = 13500.0, 0.35


def section_polygon(t, w, h, r, L, draft=0.5):
    """outline of the skin + rib + fillets (y up, outer face y = 0, inner face y = t, rib on top)"""
    tw = w - 2 * h * np.tan(np.radians(draft))
    pts = [(-L, 0), (L, 0), (L, t)]
    # right fillet: the circle tangent to the skin's inner face (y = t) and to the rib's right flank
    def fillet(side):
        # flank line through (side*w/2, t) and (side*tw/2, t+h); for small draft, treat the flank as vertical for the
        # tangent points but keep the true flank above the fillet
        cx = side * (w / 2 + r); cy = t + r
        n = 24
        if side > 0: ang = np.linspace(-np.pi / 2, -np.pi, n)
        else: ang = np.linspace(-np.pi / 2, 0, n)
        return [(cx + r * np.cos(a), cy + r * np.sin(a)) for a in ang]
    if r > 1e-6:
        pts += fillet(+1)[::-1][::-1]
    else:
        pts += [(w / 2, t)]
    pts += [(tw / 2, t + h), (-tw / 2, t + h)]
    if r > 1e-6:
        pts += fillet(-1)[::-1]
    else:
        pts += [(-w / 2, t)]
    pts += [(-L, t)]
    return Polygon(pts).buffer(0)


def mesh(poly, t, w, r, hmin, hmax, L):
    """boundary points, then a fine hex grid near the junction and a coarse one elsewhere, inside the outline"""
    from scipy.spatial import cKDTree
    def size(x, y):
        dd = np.hypot(x, np.maximum(0, y - t))
        return np.clip(hmin + (hmax - hmin) * np.maximum(0, dd - (w / 2 + r) - 0.05) / (1.5 * t), hmin, hmax)
    B = []
    ring = list(poly.exterior.coords)
    for a, b in zip(ring[:-1], ring[1:]):
        a, b = np.array(a), np.array(b); mid = (a + b) / 2; hl = size(mid[0], mid[1])
        n = max(1, int(np.ceil(np.hypot(*(b - a)) / hl)))
        for k in range(n): B.append(a + (b - a) * k / n)
    B = np.array(B)
    xmin, ymin, xmax, ymax = poly.bounds
    G = []
    for hs in sorted(set([hmin, (hmin * hmax) ** 0.5, hmax])):
        xs = np.arange(xmin, xmax, hs); ys = np.arange(ymin, ymax, hs * 0.866)
        gx, gy = np.meshgrid(xs, ys); gx = gx + (np.arange(len(ys))[:, None] % 2) * hs / 2
        Q = np.c_[gx.ravel(), gy.ravel()]; sz = size(Q[:, 0], Q[:, 1])
        Q = Q[(sz >= hs * 0.75) & (sz < hs * 1.6) | ((hs == hmin) & (sz < hmin * 1.2))]
        G.append(Q)
    G = np.vstack(G)
    G = G[shapely.contains_xy(poly, G[:, 0], G[:, 1])]
    d, _ = cKDTree(B).query(G); G = G[d > 0.5 * size(G[:, 0], G[:, 1])]
    # thin interior points closer than half the local size to each other
    keep = np.ones(len(G), bool); tr = cKDTree(G)
    for i in range(len(G)):
        if not keep[i]: continue
        for j in tr.query_ball_point(G[i], 0.5 * size(G[i, 0], G[i, 1])):
            if j > i: keep[j] = False
    G = G[keep]
    P = np.vstack([B, G])
    tri = Delaunay(P).simplices
    C = P[tri].mean(1); tri = tri[shapely.contains_xy(poly, C[:, 0], C[:, 1])]
    return P, tri


def lst_solve(P, tri, loadfn, fixfn):
    """6-node triangles: add mid-side nodes, assemble plane strain, solve. Returns nodes, elements, displacements."""
    # mid-side nodes
    edges = {}
    nodes = list(map(tuple, P)); T6 = []
    def mid(a, b):
        k = (min(a, b), max(a, b))
        if k not in edges: edges[k] = len(nodes); nodes.append(tuple((P[a] + P[b]) / 2))
        return edges[k]
    for a, b, c in tri:
        # orient counter-clockwise
        if (P[b][0] - P[a][0]) * (P[c][1] - P[a][1]) - (P[c][0] - P[a][0]) * (P[b][1] - P[a][1]) < 0: b, c = c, b
        T6.append([a, b, c, mid(a, b), mid(b, c), mid(c, a)])
    X = np.array(nodes); T6 = np.array(T6); n = len(X)
    lam_ = E * NU / ((1 + NU) * (1 - 2 * NU)); mu = E / (2 * (1 + NU))
    D = np.array([[lam_ + 2 * mu, lam_, 0], [lam_, lam_ + 2 * mu, 0], [0, 0, mu]])
    gp = [(2 / 3, 1 / 6, 1 / 6), (1 / 6, 2 / 3, 1 / 6), (1 / 6, 1 / 6, 2 / 3)]
    rows, cols, vals = [], [], []
    def Bmat(xe, L1, L2, L3):
        x1, x2, x3 = xe[0:3, 0]; y1, y2, y3 = xe[0:3, 1]
        A2 = (x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1)
        b = np.array([y2 - y3, y3 - y1, y1 - y2]) / A2; c = np.array([x3 - x2, x1 - x3, x2 - x1]) / A2
        L = [L1, L2, L3]
        dNx = [(4 * L[i] - 1) * b[i] for i in range(3)] + [4 * (L[0] * b[1] + L[1] * b[0]), 4 * (L[1] * b[2] + L[2] * b[1]), 4 * (L[2] * b[0] + L[0] * b[2])]
        dNy = [(4 * L[i] - 1) * c[i] for i in range(3)] + [4 * (L[0] * c[1] + L[1] * c[0]), 4 * (L[1] * c[2] + L[2] * c[1]), 4 * (L[2] * c[0] + L[0] * c[2])]
        B = np.zeros((3, 12))
        for k in range(6): B[0, 2 * k] = dNx[k]; B[1, 2 * k + 1] = dNy[k]; B[2, 2 * k] = dNy[k]; B[2, 2 * k + 1] = dNx[k]
        return B, A2 / 2
    for e in T6:
        xe = X[e]; K = np.zeros((12, 12))
        for (l1, l2, l3) in gp:
            B, A = Bmat(xe, l1, l2, l3); K += B.T @ D @ B * A / 3
        dofs = np.ravel([[2 * i, 2 * i + 1] for i in e])
        rows.append(np.repeat(dofs, 12)); cols.append(np.tile(dofs, 12)); vals.append(K.ravel())
    Kg = sp.csr_matrix((np.concatenate(vals), (np.concatenate(rows), np.concatenate(cols))), shape=(2 * n, 2 * n))
    F = loadfn(X, T6); fixed = fixfn(X)
    free = np.ones(2 * n, bool); free[fixed] = False
    U = np.zeros(2 * n); U[free] = spla.spsolve(Kg[free][:, free].tocsc(), F[free])
    # stresses at the corner nodes of each element (extrapolated: evaluate B at the vertices)
    S = []
    for e in T6:
        xe = X[e]; ue = np.ravel([[U[2 * i], U[2 * i + 1]] for i in e])
        for (l1, l2, l3) in ((1, 0, 0), (0, 1, 0), (0, 0, 1)):
            B, _ = Bmat(xe, l1, l2, l3); s = D @ B @ ue
            sz = NU * (s[0] + s[1])                                   # plane strain
            sx, sy, txy = s; c_ = (sx + sy) / 2; rr = np.hypot((sx - sy) / 2, txy)
            S.append((sx, sy, txy, c_ + rr, c_ - rr))
    S = np.array(S).reshape(len(T6), 3, 5)
    return X, T6, U, S


def run(t, w, h, r, L=None, hmin=None, hmax=None):
    L = L or max(6.0, 10 * t)
    hmin = hmin or max(0.006, min(max(r, 0.02) / 12, t / 40)); hmax = hmax or t / 4
    poly = section_polygon(t, w, h, r, L)
    P, tri = mesh(poly, t, w, r, hmin, hmax, L)
    M = 1.0                      # N mm per mm
    def loadfn(X, T6):
        F = np.zeros(2 * len(X))
        # linear traction sigma_x = -12 M (y - t/2) / t^3 on the left end (x = -L), opposite on the right end: pure bending
        for xe_side, sgn in ((-L, -1.0), (L, 1.0)):
            ids = np.where(np.abs(X[:, 0] - xe_side) < 1e-9)[0]
            ids = ids[np.argsort(X[ids, 1])]
            ys = X[ids, 1]
            for a, b in zip(ids[:-1], ids[1:]):
                y1, y2 = X[a, 1], X[b, 1]; ln = y2 - y1
                s1 = sgn * 12 * M * (y1 - t / 2) / t ** 3; s2 = sgn * 12 * M * (y2 - t / 2) / t ** 3
                # consistent nodal forces for a linear traction on a straight segment (corner nodes only: adequate here)
                F[2 * a] += ln * (2 * s1 + s2) / 6; F[2 * b] += ln * (s1 + 2 * s2) / 6
        return F
    def fixfn(X):
        # a pin at the outer-face point under the rib and a vertical roller at the left outer corner (statically
        # determinate: the load is self-equilibrated)
        i0 = np.argmin(np.hypot(X[:, 0], X[:, 1])); i1 = np.argmin(np.hypot(X[:, 0] + L, X[:, 1]))
        return [2 * i0, 2 * i0 + 1, 2 * i1 + 1]
    X, T6, U, S = lst_solve(P, tri, loadfn, fixfn)
    nom = 6 * M / t ** 2
    # the peak tensile principal stress in the junction zone (within w/2 + r + 0.5 t of the rib axis, above the
    # outer face's neighbourhood) and on the outer face
    Cn = X[T6[:, :3]]                                               # (ne, 3, 2) corner coordinates
    zone = (np.abs(Cn[:, :, 0]) < w / 2 + r + 0.6 * t) & (Cn[:, :, 1] > 0.5 * t)
    s1 = S[:, :, 3]; s2 = S[:, :, 4]
    peak_fillet = max(np.abs(s1[zone]).max(), np.abs(s2[zone]).max())
    far = (np.abs(Cn[:, :, 0]) > L / 3) & (np.abs(Cn[:, :, 0]) < 2 * L / 3)
    peak_far = max(np.abs(s1[far]).max(), np.abs(s2[far]).max())
    face = (Cn[:, :, 1] < 1e-9) & (np.abs(Cn[:, :, 0]) < 2 * L / 3)
    peak_face = np.abs(S[:, :, 0][face]).max()
    # the junction's thick section: the largest circle in the polygon touching the outer face, on the rib axis
    poly = section_polygon(t, w, h, r, L)
    rho = 0.0
    for yc in np.linspace(t / 2, t + h, 400):
        rr_ = yc                                                    # touches the outer face y = 0
        if poly.contains(Point(0, yc).buffer(rr_ * 0.999, 64)): rho = max(rho, rr_)
    return dict(t=t, w=w, h=h, r=r, scf=float(peak_fillet / nom), scf_far=float(peak_far / nom), scf_face=float(peak_face / nom),
                D_over_t=float(2 * rho / t), n_el=int(len(T6)), area=float(poly.area))


if __name__ == '__main__':
    t, w, h = (float(a) for a in sys.argv[1:4]) if len(sys.argv) > 3 else (0.6, 0.42, 1.7)
    out = []
    # validation: a plain skin (no rib): SCF must be 1
    v = run(t, 1e-3, 1e-3, 0.0)
    print('check, plain skin: far %.3f face %.3f (expect 1.000)' % (v['scf_far'], v['scf_face']), flush=True)
    for hm in (2.0, 1.0, 0.6):
        base = max(0.006, min(0.5 * t / 12, t / 40))
        o = run(t, w, h, 0.5 * t, hmin=base * hm, hmax=t / 4 * min(1, hm))
        print('mesh check r 0.5t: hmin %.4f SCF %.3f elements %d' % (base * hm, o['scf'], o['n_el']), flush=True)
    for rf in [0.02, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.75, 1.0]:
        r = rf * t
        o = run(t, w, h, r); o['r_over_t'] = rf; out.append(o)
        print(f"r = {r:.3f} mm ({rf:.2f} t): SCF {o['scf']:.3f}  junction {o['D_over_t']:.2f} t  elements {o['n_el']}", flush=True)
    fout = '/home/claude/work/l1/out/fillet_root.json' if len(sys.argv) <= 3 else f'/home/claude/work/l1/out/fillet_root_t{t:.2f}_w{w:.2f}_h{h:.2f}.json'
    json.dump(dict(t=t, w=w, h=h, check=v, rows=out), open(fout, 'w'), indent=1)
