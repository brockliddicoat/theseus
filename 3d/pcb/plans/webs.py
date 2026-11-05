"""Narrowest webs of board: the shortest distances across board material between two different edges (the outline, a
hole, a cut-out), and across the outline to itself (a neck). Rings are sampled every 0.02 mm."""
import math, numpy as np
from scipy.spatial import cKDTree
from matplotlib.path import Path

def ring_pts(pts, step=0.02):
    p = np.asarray(pts, float)
    if np.allclose(p[0], p[-1]): p = p[:-1]
    q = np.vstack([p, p[:1]]); out = []
    for a, b in zip(q[:-1], q[1:]):
        n = max(1, int(math.ceil(np.linalg.norm(b - a) / step)))
        out.append(a + (b - a) * (np.arange(n)[:, None] / n))
    return np.vstack(out)

def circle(x, z, d, n=96):
    return [(x + d / 2 * math.cos(2 * math.pi * k / n), z + d / 2 * math.sin(2 * math.pi * k / n)) for k in range(n)]

def rrect(cx, cz, w, h, r, n=12):
    r = min(r, w / 2, h / 2); out = []
    for (sx, sz, a0) in ((1, 1, 0), (-1, 1, 90), (-1, -1, 180), (1, -1, 270)):
        c = (cx + sx * (w / 2 - r), cz + sz * (h / 2 - r))
        out += [(c[0] + r * math.cos(math.radians(a0 + 90 * k / n)), c[1] + r * math.sin(math.radians(a0 + 90 * k / n))) for k in range(n + 1)]
    return out

def slot(cx, cz, w, h, rot=0.0):
    pts = rrect(0, 0, w, h, min(w, h) / 2 - 1e-3); a = math.radians(rot)
    return [(cx + x * math.cos(a) - z * math.sin(a), cz + x * math.sin(a) + z * math.cos(a)) for x, z in pts]

def webs(outline, holes, top=12, step=0.02):
    """outline: [(x, z)], holes: [(name, [(x, z)])]. Returns (pairs, necks): pairs = [(d, nameA, nameB, pA, pB)] sorted"""
    R = [('outline', ring_pts(outline, step))] + [(n, ring_pts(h, step)) for n, h in holes]
    trees = [cKDTree(p) for _, p in R]
    pairs = []
    for i in range(len(R)):
        for j in range(i + 1, len(R)):
            d, k = trees[j].query(R[i][1])
            m = int(np.argmin(d)); pairs.append((float(d[m]), R[i][0], R[j][0], R[i][1][m], R[j][1][k[m]]))
    pairs.sort(key=lambda t: t[0])
    # necks of the outline: two points far apart along the ring, close across board material
    P = R[0][1]; n = len(P); s = np.arange(n) * step; per = n * step
    inside = Path(np.vstack([P, P[:1]]))
    best = []
    tr = trees[0]
    for i in range(0, n, 3):
        idx = tr.query_ball_point(P[i], 4.0)
        for j in idx:
            ds = abs(s[j] - s[i]); ds = min(ds, per - ds); d = float(np.linalg.norm(P[j] - P[i]))
            if d < 1e-6 or ds < max(3.2 * d, 2.0): continue
            mid = (P[i] + P[j]) / 2
            if inside.contains_point(mid): best.append((d, P[i], P[j]))
    best.sort(key=lambda t: t[0])
    necks = []
    for d, a, b in best:
        if all(np.linalg.norm((a + b) / 2 - (c + e) / 2) > 2.0 for _, c, e in necks): necks.append((d, a, b))
        if len(necks) >= 4: break
    return pairs[:top], necks
