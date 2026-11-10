"""The kit's nail (deck/src/06-motion.js: FNG_DIG[..].nail, fngGeo, fngNail; Brock's pick "A Soft", FEEDBACK.md F60.1: the skin's
grey a shade lighter, a soft sheen, the skin's fold drawn round its sides and base, no outline on the free edge; the thumb's is
broad and shows its lunula), ported so the traced hand wears the film's own nails (Brock 2026-11-09 20:44: "the nails don't look
like the new revamped ones i wanted").
The numbers below are copied from FNG_DIG and must follow it if it changes. The nail lives in the fingertip's (u, z): u mm back
from the skin's front along the last bone, z mm across. hand_draw.py lays it on each fingertip's back (every pixel's own (u, z) in
the last bone's frame, so the outline is the kit's, projected into the view) through the look-up grids made here:
  sd    signed distance to the nail's outline (mm, + inside)
  free  > 0 in the paler free edge's band (the kit's smile)
  lun   > 0 in the lunula (the thumb's)
  hl    distance (mm) to the sheen's line on the z > 0 side (the other side: z -> -z)
The kit has two digits: the index's nail serves the middle, ring and little fingers, scaled by each fingertip's own breadth."""
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

KIT = {   # 06-motion.js FNG_DIG.index.nail, FNG_DIG.thumb.nail
    'index': dict(free=1.9, corner=3.4, cut=14.6, sag=2.75, p=1.9, hw=[[3.4, 4.95], [5.5, 5.15], [8.5, 5.13], [10.5, 5.0], [11.85, 4.87]], smile=[0.5, 0.4], lunula=0),
    'thumb': dict(free=2.4, corner=4.3, cut=16.2, sag=3.3, p=1.9, hw=[[4.3, 6.85], [7.0, 7.12], [10.0, 7.08], [12.9, 6.78]], smile=[0.6, 0.45], lunula=1),
}
HL_W = 2.2                                   # fngPaint: the sheen's width from above (mm), stroked three times (fngStreak):
HL_STREAK = [[1, 0.13], [0.66, 0.16], [0.36, 0.22]]   # [share of the width, share of the alpha]
G_PX = 25.0                                  # the grids: px per mm


def mono(pts):
    """fngMono: a monotone cubic through pts, straight beyond its ends"""
    xs = np.array([p[0] for p in pts], float); ys = np.array([p[1] for p in pts], float); n = len(xs)
    d = (ys[1:] - ys[:-1]) / (xs[1:] - xs[:-1]); m = np.zeros(n); m[0], m[-1] = d[0], d[-1]
    for i in range(1, n - 1): m[i] = 0 if d[i - 1] * d[i] <= 0 else (d[i - 1] + d[i]) / 2
    for i in range(n - 1):
        if d[i] == 0: m[i] = m[i + 1] = 0; continue
        a, b = m[i] / d[i], m[i + 1] / d[i]; h = a * a + b * b
        if h > 9: t = 3 / np.sqrt(h); m[i] = t * a * d[i]; m[i + 1] = t * b * d[i]
    def f(x):
        x = np.asarray(x, float); out = np.empty_like(x)
        lo, hi = x <= xs[0], x >= xs[-1]
        out[lo] = ys[0] + m[0] * (x[lo] - xs[0]); out[hi] = ys[-1] + m[-1] * (x[hi] - xs[-1])
        mid = ~(lo | hi)
        if mid.any():
            xm = x[mid]; i = np.clip(np.searchsorted(xs, xm, side='left') - 1, 0, n - 2)
            h = xs[i + 1] - xs[i]; t = (xm - xs[i]) / h; t2, t3 = t * t, t * t * t
            out[mid] = (2 * t3 - 3 * t2 + 1) * ys[i] + (t3 - 2 * t2 + t) * h * m[i] + (-2 * t3 + 3 * t2) * ys[i + 1] + (t3 - t2) * h * m[i + 1]
        return out
    return f


class Nail:
    """one digit's nail as the kit draws it (fngGeo's W, freeAt, cutAt; fngNail's outline, free band, lunula, fold, sheen)"""
    def __init__(self, dig):
        N = KIT[dig]; self.N = N; self.nhw = mono(N['hw'])
        self.zc = float(self.nhw([N['corner']])[0]); self.ua = N['cut'] - N['sag']; self.w0 = float(self.nhw([self.ua])[0])
        self.uf0 = N['corner'] - 0.3 * (N['corner'] - N['free'])      # the fold starts here (the free edge has none)
        self._grids()

    def W(self, u):
        N = self.N; u = np.asarray(u, float); out = np.zeros_like(u)
        a = (u > N['free']) & (u < N['corner']); q = (N['corner'] - u[a]) / (N['corner'] - N['free'])
        out[a] = self.zc * np.maximum(0, 1 - q ** N['p']) ** (1 / N['p'])
        b = (u >= N['corner']) & (u <= self.ua); out[b] = self.nhw(u[b])
        c = (u > self.ua) & (u < N['cut']); q = (u[c] - self.ua) / N['sag']; out[c] = self.w0 * np.sqrt(np.maximum(0, 1 - q * q))
        return out

    def freeAt(self, z):
        N = self.N; r = np.minimum(1, np.abs(z) / self.zc)
        return N['corner'] - (N['corner'] - N['free']) * np.maximum(0, 1 - r ** N['p']) ** (1 / N['p'])

    def cutAt(self, z):
        r = np.minimum(1, np.abs(z) / self.w0); return self.ua + self.N['sag'] * np.sqrt(np.maximum(0, 1 - r * r))

    def outline(self, K=28):
        """fngNail's out: the free edge, the right side back to the cuticle, the cuticle's U, the left side forward"""
        N = self.N; out = []
        for i in range(K + 1):
            z = self.zc * np.sin(-np.pi / 2 + np.pi * i / K); out.append([float(self.freeAt(z)), z])
        for u in np.arange(N['corner'] + 0.25, self.ua - 0.05, 0.25): out.append([u, float(self.nhw([u])[0])])
        for i in range(K + 1):
            th = np.pi * i / K; out.append([self.ua + N['sag'] * np.sin(th), self.w0 * np.cos(th)])
        for u in np.arange(self.ua - 0.25, N['corner'] + 0.05, -0.25): out.append([u, -float(self.nhw([u])[0])])
        return np.array(out)

    def hl(self):
        """fngNail's hl(1): the sheen's line, 0.42 of the half width to one side"""
        N = self.N; us = np.arange(N['free'] + 2.1, self.ua - 0.2 + 1e-9, 0.4)
        return np.c_[us, 0.42 * np.minimum(self.W(us), self.w0)]

    def _grids(self):
        N = self.N; s = G_PX; self.u0, self.z0 = -2.0, -(self.zc + 4.0)
        nu, nz = int((N['cut'] + 4.0) * s), int(2 * (self.zc + 4.0) * s); self.shape = (nu, nz)
        px = lambda P: [((p[1] - self.z0) * s, (p[0] - self.u0) * s) for p in P]      # image x: z, image y: u
        im = Image.new('L', (nz, nu), 0); ImageDraw.Draw(im).polygon(px(self.outline()), fill=255); ins = np.array(im) > 0
        self.sd = (ndimage.distance_transform_edt(ins) - ndimage.distance_transform_edt(~ins)) / s
        uu = self.u0 + (np.arange(nu) + 0.5) / s; zz = self.z0 + (np.arange(nz) + 0.5) / s; U, Z = np.meshgrid(uu, zz, indexing='ij')
        sm = N['smile'][0] + N['smile'][1] * (np.abs(Z) / self.zc) ** 2
        self.free = np.where(np.abs(Z) <= self.zc + 1.0, self.freeAt(Z) + sm - U, -1.0)
        if N['lunula'] > 0:
            wl = self.w0 * 0.8; ld = 2.3 * N['lunula']
            self.lun = np.where(np.abs(Z) < wl, U - (self.cutAt(Z) - ld * np.sqrt(np.maximum(0, 1 - (Z / wl) ** 2))), -1.0)
        else: self.lun = np.full((nu, nz), -1.0)
        ln = Image.new('L', (nz, nu), 0); ImageDraw.Draw(ln).line(px(self.hl()), fill=255, width=1)
        self.hlg = ndimage.distance_transform_edt(np.array(ln) == 0) / s

    def at(self, grid, u, z, fill):
        """a grid's value at (u, z) arrays (bilinear), fill outside it"""
        r = (u - self.u0) * G_PX - 0.5; c = (z - self.z0) * G_PX - 0.5
        return ndimage.map_coordinates(grid, [r, c], order=1, mode='constant', cval=fill)
