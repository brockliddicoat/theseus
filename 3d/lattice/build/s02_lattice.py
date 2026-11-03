"""Stage 2: the triangle lattice on the inner surface (geodesic-ish, relaxed), plus its hexagon twin at equal rib length.

Rows (family A) are transverse arches: sections of the inner surface by planes that contain the X axis direction,
spaced a*sqrt(3)/2 along the inner midline and tilted (lambda * midline slope) so they stay square to the surface
over the rear cap. Nodes sit at arc length (j + k/2)*a from the midline; families B/C join consecutive rows.
The node net is then relaxed on the surface (springs at rest length a, nodes re-projected every step), which evens
out the triangles where the shell is doubly curved. Output: work/lattice.npz
"""
import numpy as np, argparse
from common import *
from geom import *

ap = argparse.ArgumentParser(); ap.add_argument('--lam', type=float, default=0.45); ap.add_argument('--iters', type=int, default=400)
ap.add_argument('--plot', action='store_true'); args = ap.parse_args()
S = Shell()
a = P['a']; dv = a * np.sqrt(3) / 2
Y_RIM = P['y_bottom'] + P['rim_t'] + 0.35          # where ribs land in the flange

# ---- inner midline (x = 0) ----
c0 = np.array([0.0, 6.0, 0.0])
phi = np.radians(np.linspace(198, -18, 2400))
M = S.raycast(c0, np.stack([np.zeros_like(phi), np.sin(phi), np.cos(phi)], 1), rmax=75, step=0.2)
M = M[np.isfinite(M[:, 0])]
top = np.argmax(M[:, 1]); good = M[:, 1] > Y_RIM
lo = top
while lo > 0 and good[lo - 1]: lo -= 1
hi = top
while hi < len(M) - 1 and good[hi + 1]: hi += 1
M = M[lo:hi + 1]
vM = polyline_arclen(M)
print('midline length', vM[-1])
T = np.gradient(M, vM, axis=0); T /= np.linalg.norm(T, axis=1, keepdims=True)

# rows: phase so that one row passes the crown region symmetric about the hump; K rows over the midline
# phase: the trigger's rear seam (z = 4.8 on the midline) falls midway between two arches
itop = np.argmax(M[:, 1]); fr = np.arange(len(M)) > itop
v_seam = np.interp(seam_rear_z(0.0), M[fr, 2], vM[fr])
k0 = int(np.floor(v_seam / dv)) + 1; ks = np.arange(-k0 - 1, int((vM[-1] - v_seam) / dv) + 2)
rows = []
for k in ks:
    v = v_seam + (k + 0.5) * dv
    if v < 0.6 * dv or v > vM[-1] - 0.6 * dv: continue
    m = np.array([np.interp(v, vM, M[:, i]) for i in range(3)])
    t = np.array([np.interp(v, vM, T[:, i]) for i in range(3)]); t /= np.linalg.norm(t)
    th = np.arctan2(t[1], t[2])
    ph = args.lam * th if th > 0 else 0.15 * th      # tilt over the rear cap only; near-vertical arches in front
    if m[2] > 51.0: continue                          # the nose gets explicit vertical struts (#55)
    n = np.array([0, np.sin(ph), np.cos(ph)]); e1 = np.array([1.0, 0, 0]); e2 = np.cross(n, e1)
    d = max(2.0, (m[1] - 7.0) / max(e2[1], 0.35))
    c = m - d * e2
    psi = np.radians(np.linspace(-150, 150, 1201))
    dirs = np.cos(psi)[:, None] * e2[None] + np.sin(psi)[:, None] * e1[None]
    Q = S.raycast(c, dirs, rmax=60, step=0.15)
    ok = np.isfinite(Q[:, 0])
    i0 = np.argmin(np.abs(psi))
    # keep the contiguous run around psi = 0 with y above the floor offset
    good = ok & (Q[:, 1] > Y_RIM - 1.2)
    lo = i0
    while lo > 0 and good[lo - 1]: lo -= 1
    hi = i0
    while hi < len(psi) - 1 and good[hi + 1]: hi += 1
    C = Q[lo:hi + 1]; s = polyline_arclen(C); s -= np.interp(i0 - lo, np.arange(len(s)), s)
    rows.append(dict(k=int(k), v=v, m=m, n=n, C=C, s=s))
print('rows', len(rows), [round(r['m'][2], 1) for r in rows])

# ---- nodes (axial index (k, j): u = (j + k/2) * a), keep a margin beyond the rim for clipping ----
nodes = []; idx = {}
for r in rows:
    k = r['k']; s = r['s']; C = r['C']
    jlo = int(np.floor(s[0] / a - k / 2)) - 1; jhi = int(np.ceil(s[-1] / a - k / 2)) + 1
    for j in range(jlo, jhi + 1):
        u = (j + k / 2) * a
        if u < s[0] - 0.75 * a or u > s[-1] + 0.75 * a: continue
        if s[0] <= u <= s[-1]:
            p = np.array([np.interp(u, s, C[:, i]) for i in range(3)])
        else:   # virtual node beyond the rim: extrapolate along the end tangent (will be clipped)
            e = C[-1] if u > s[-1] else C[0]; e2_ = C[-3] if u > s[-1] else C[2]
            tt = (e - e2_) / np.linalg.norm(e - e2_); p = e + tt * (abs(u) - (s[-1] if u > 0 else -s[0]))
        idx[(k, j)] = len(nodes); nodes.append(dict(k=k, j=j, u=u, p=p))
X = np.array([n['p'] for n in nodes])
edges = []
for (k, j), i in idx.items():
    for (dk, dj, fam) in ((0, 1, 0), (1, 0, 1), (1, -1, 2)):
        q = idx.get((k + dk, j + dj))
        if q is not None: edges.append((i, q, fam))
E = np.array(edges)
print('nodes', len(X), 'edges', len(E))

# ---- relaxation on the surface ----
mov = (X[:, 1] > Y_RIM + 2.0)
rimband = (~mov) & (X[:, 1] > Y_RIM - 0.3)          # slide horizontally along the wall, height kept
y_keep = X[:, 1].copy()
mir = np.array([idx.get((n['k'], -n['j'] - n['k'])) for n in nodes], dtype=object)
mir = np.array([m if m is not None else -1 for m in mir])
for it in range(args.iters):
    d = X[E[:, 1]] - X[E[:, 0]]; L = np.linalg.norm(d, axis=1)
    f = ((L - a) / np.maximum(L, 1e-9))[:, None] * d
    F = np.zeros_like(X)
    np.add.at(F, E[:, 0], f); np.add.at(F, E[:, 1], -f)
    Xn = X + 0.22 * F
    Xn[mov] = S.project(Xn[mov], iters=2)
    X[mov] = Xn[mov]
    if rimband.any():
        R = X[rimband] + 0.22 * F[rimband] * np.array([1, 0, 1])
        for _ in range(3):   # project onto S_in moving only in x/z (walls are near-vertical here)
            s_ = S.Sin(R); g = S.ext.grad(R) * np.array([1, 0, 1]); n2 = np.maximum((g * g).sum(1), 0.25)
            st = (s_ / n2)[:, None] * g; nn = np.linalg.norm(st, axis=1, keepdims=True)
            R -= st * np.minimum(1.0, 0.8 / np.maximum(nn, 1e-9))
        R[:, 1] = y_keep[rimband]; X[rimband] = R
    # enforce mirror symmetry
    ok = mir >= 0
    Xm = X[mir[ok]] * np.array([-1, 1, 1]); X[ok] = 0.5 * (X[ok] + Xm)
    if it % 100 == 0 or it == args.iters - 1:
        inside = (mov | rimband)[E[:, 0]] & (mov | rimband)[E[:, 1]] & (X[E[:, 0], 1] > Y_RIM) & (X[E[:, 1], 1] > Y_RIM)
        print(it, 'edge len (interior) mean %.2f sd %.2f min %.2f max %.2f' % (L[inside].mean(), L[inside].std(), L[inside].min(), L[inside].max()))
np.savez(os.path.join(WORK, 'lattice_raw.npz'), X=X, E=E, K=np.array([n['k'] for n in nodes]), J=np.array([n['j'] for n in nodes]), y_rim=Y_RIM,
         M=M)
if args.plot:
    import matplotlib; matplotlib.use('Agg'); import matplotlib.pyplot as plt
    fig, axs = plt.subplots(1, 3, figsize=(24, 9))
    cols = ['C3', 'C0', 'C2']
    for ax, (i0, i1, sel) in zip(axs, [(0, 2, None), (2, 1, 0), (0, 1, None)]):
        for (i, j, fm) in E:
            if X[i, 1] < Y_RIM - 1 and X[j, 1] < Y_RIM - 1: continue
            if sel is not None and (X[i, 0] < 0 or X[j, 0] < 0): continue
            ax.plot([X[i, i0], X[j, i0]], [X[i, i1], X[j, i1]], cols[fm], lw=0.8)
        ax.set_aspect('equal'); ax.grid(alpha=0.3)
    axs[0].set_title('top (x, z)'); axs[1].set_title('right side (z, y), x>0'); axs[2].set_title('front (x, y)')
    fig.tight_layout(); fig.savefig(os.path.join(WORK, 'lattice_plot.png'), dpi=60)
