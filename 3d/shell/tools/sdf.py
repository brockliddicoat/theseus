"""SDF toolkit for the Theseus shell: IMLS skin field, analytic primitives, rounded booleans, 2D raster SDFs,
marching cubes with Newton projection, smooth normals.  Units: mm.  Convention: negative = inside."""
import numpy as np, cv2
from scipy.spatial import cKDTree
from scipy.ndimage import map_coordinates
from skimage.measure import marching_cubes


# ---------------------------------------------------------------- IMLS skin
class Skin:
    """Implicit moving-least-squares surface from oriented samples (S, N); symmetric about x=0 if sym=True."""

    def __init__(self, S, N, h=None, k=8, sym=True):
        self.S = np.ascontiguousarray(S, float); self.N = np.ascontiguousarray(N, float)
        self.tree = cKDTree(self.S)
        if h is None:
            d, _ = self.tree.query(self.S[::50], k=2)
            h = 1.5 * np.median(d[:, 1])
        self.h = h; self.k = k; self.sym = sym

    def _eval(self, P, grad=False):
        out = np.empty(len(P)); G = np.empty((len(P), 3)) if grad else None
        for a in range(0, len(P), 400000):
            p = P[a:a + 400000]
            d, i = self.tree.query(p, k=self.k, workers=2)
            w = np.exp(-(d / self.h) ** 2) + 1e-30
            s = self.S[i]; n = self.N[i]
            f = ((p[:, None, :] - s) * n).sum(2)
            ws = w.sum(1)
            out[a:a + 400000] = (w * f).sum(1) / ws
            if grad:
                g = (w[:, :, None] * n).sum(1) / ws[:, None]
                G[a:a + 400000] = g
        return out, G

    def __call__(self, P, grad=False):
        P = np.asarray(P, float)
        f, G = self._eval(P, grad)
        if self.sym:
            Pm = P * [-1, 1, 1]
            f2, G2 = self._eval(Pm, grad)
            f = 0.5 * (f + f2)
            if grad:
                G = 0.5 * (G + G2 * [-1, 1, 1])
        if grad:
            G /= np.linalg.norm(G, axis=1, keepdims=True) + 1e-12
            return f, G
        return f


# ---------------------------------------------------------------- booleans (hg_sdf style)
def U(a, b):
    return np.minimum(a, b)


def I(a, b):
    return np.maximum(a, b)


def Sub(a, b):
    return np.maximum(a, -b)


def I_round(a, b, r):
    """Intersection with the convex edge rounded to radius r."""
    if r <= 0:
        return np.maximum(a, b)
    ua = np.maximum(r + a, 0); ub = np.maximum(r + b, 0)
    return np.minimum(-r, np.maximum(a, b)) + np.sqrt(ua * ua + ub * ub)


def Sub_round(a, b, r):
    return I_round(a, -b, r)


def U_round(a, b, r):
    """Union with the concave edge filleted (radius r)."""
    if r <= 0:
        return np.minimum(a, b)
    ua = np.maximum(r - a, 0); ub = np.maximum(r - b, 0)
    return np.maximum(r, np.minimum(a, b)) - np.sqrt(ua * ua + ub * ub)


# ---------------------------------------------------------------- primitives
def plane(P, n, d):
    n = np.asarray(n, float); n = n / np.linalg.norm(n)
    return P @ n - d


def box(P, c, half):
    q = np.abs(P - c) - half
    return np.linalg.norm(np.maximum(q, 0), axis=1) + np.minimum(q.max(1), 0)


def round_rect2(u, v, cu, cv, hu, hv, r):
    qu = np.abs(u - cu) - (hu - r); qv = np.abs(v - cv) - (hv - r)
    return np.hypot(np.maximum(qu, 0), np.maximum(qv, 0)) + np.minimum(np.maximum(qu, qv), 0) - r


def cyl_x(P, c, r, half_len):
    """Capped cylinder with axis along X."""
    dyz = np.hypot(P[:, 1] - c[1], P[:, 2] - c[2]) - r
    dx = np.abs(P[:, 0] - c[0]) - half_len
    return np.hypot(np.maximum(dyz, 0), np.maximum(dx, 0)) + np.minimum(np.maximum(dyz, dx), 0)


def cyl_y(P, c, r, y0, y1):
    dxz = np.hypot(P[:, 0] - c[0], P[:, 2] - c[2]) - r
    dy = np.maximum(y0 - P[:, 1], P[:, 1] - y1)
    return np.hypot(np.maximum(dxz, 0), np.maximum(dy, 0)) + np.minimum(np.maximum(dxz, dy), 0)


# ---------------------------------------------------------------- 2D raster SDF (for outlines)
class Raster2D:
    """Signed distance to a 2D polygon region, rasterized (px mm) and bilinearly sampled. negative inside."""

    def __init__(self, poly_list, lo, hi, px=0.04):
        self.lo = np.asarray(lo, float); self.px = px
        W = int(np.ceil((hi[0] - lo[0]) / px)) + 1; H = int(np.ceil((hi[1] - lo[1]) / px)) + 1
        mask = np.zeros((H, W), np.uint8)
        for poly in poly_list:
            pts = np.round((np.asarray(poly) - self.lo) / px * 16).astype(np.int32)
            cv2.fillPoly(mask, [pts], 1, lineType=cv2.LINE_8, shift=4)
        din = cv2.distanceTransform(mask, cv2.DIST_L2, cv2.DIST_MASK_PRECISE)
        dout = cv2.distanceTransform(1 - mask, cv2.DIST_L2, cv2.DIST_MASK_PRECISE)
        self.f = ((dout - din) * px).astype(np.float32)
        self.f += np.where(mask > 0, 0.5 * px, -0.5 * px).astype(np.float32)
        # remove pixel-scale kinks (bilinear DT gradients are only C0): light blur + cubic-spline sampling
        self.f = cv2.GaussianBlur(self.f, (0, 0), 1.2)
        from scipy.ndimage import spline_filter
        self.coef = spline_filter(self.f.astype(np.float64), order=3)
        self.shape = (H, W)

    def __call__(self, u, v):
        cu = (np.asarray(u) - self.lo[0]) / self.px; cv_ = (np.asarray(v) - self.lo[1]) / self.px
        return map_coordinates(self.coef, [cv_.ravel(), cu.ravel()], order=3, mode='nearest', prefilter=False).reshape(np.shape(u))


class RoundPoly2D:
    """Exact SDF of a convex polygon with corners rounded to radius r (negative inside)."""

    def __init__(self, poly, r):
        from shapely.geometry import Polygon
        P = Polygon(poly)
        if not P.exterior.is_ccw:
            poly = list(poly)[::-1]
        inner = Polygon(poly).buffer(-r, join_style=2)
        self.q = np.array(inner.exterior.coords)[:-1]
        if not Polygon(self.q).exterior.is_ccw:
            self.q = self.q[::-1]
        self.r = r

    def __call__(self, u, v):
        u = np.asarray(u, float); v = np.asarray(v, float)
        q = self.q; n = len(q)
        dmin = np.full(u.shape, np.inf); inside = np.ones(u.shape, bool)
        for i in range(n):
            a = q[i]; b = q[(i + 1) % n]; e = b - a
            wu, wv = u - a[0], v - a[1]
            t = np.clip((wu * e[0] + wv * e[1]) / (e @ e), 0, 1)
            du, dv = wu - t * e[0], wv - t * e[1]
            dmin = np.minimum(dmin, np.hypot(du, dv))
            inside &= (e[0] * wv - e[1] * wu) >= 0      # left of every CCW edge
        return np.where(inside, -dmin, dmin) - self.r


# ---------------------------------------------------------------- meshing
def mc_mesh(field_fn, lo, hi, h, band_fn=None, chunk=40):
    """Marching cubes of field_fn over the box [lo,hi] at spacing h. field_fn(P)->values (P: (n,3)).
    Evaluates in z-slabs to bound memory. Returns V, F (outward orientation for negative-inside fields)."""
    lo = np.asarray(lo, float); hi = np.asarray(hi, float)
    nx, ny, nz = (np.ceil((hi - lo) / h).astype(int) + 1)
    xs = lo[0] + h * np.arange(nx); ys = lo[1] + h * np.arange(ny); zs = lo[2] + h * np.arange(nz)
    vol = np.empty((nx, ny, nz), np.float32)
    X, Y = np.meshgrid(xs, ys, indexing='ij')
    for a in range(0, nz, chunk):
        zz = zs[a:a + chunk]
        P = np.empty((nx, ny, len(zz), 3))
        P[..., 0] = X[:, :, None]; P[..., 1] = Y[:, :, None]; P[..., 2] = zz[None, None, :]
        vol[:, :, a:a + chunk] = field_fn(P.reshape(-1, 3)).reshape(nx, ny, len(zz))
    if vol.min() > 0 or vol.max() < 0:
        return np.zeros((0, 3)), np.zeros((0, 3), int)
    V, F, _, _ = marching_cubes(vol, 0.0, spacing=(h, h, h))
    V += lo
    return V, F[:, ::-1].copy()   # flip to outward for negative-inside


def newton_project(V, field_fn, iters=3, eps=1e-3):
    """Move vertices onto the zero level set using finite-difference gradients."""
    V = V.copy()
    for _ in range(iters):
        f = field_fn(V)
        g = grad_fd(V, field_fn, eps)
        gn = (g * g).sum(1) + 1e-12
        step = (f / gn)[:, None] * g
        step = np.clip(step, -0.15, 0.15)
        V -= step
    return V


def grad_fd(V, field_fn, eps=1e-3):
    n = len(V)
    P = np.concatenate([V + [eps, 0, 0], V - [eps, 0, 0], V + [0, eps, 0], V - [0, eps, 0], V + [0, 0, eps], V - [0, 0, eps]])
    f = field_fn(P)
    g = np.stack([f[0:n] - f[n:2 * n], f[2 * n:3 * n] - f[3 * n:4 * n], f[4 * n:5 * n] - f[5 * n:6 * n]], 1) / (2 * eps)
    return g


def normals_fd(V, field_fn, eps=2e-3):
    g = grad_fd(V, field_fn, eps)
    return g / (np.linalg.norm(g, axis=1, keepdims=True) + 1e-12)
