"""S2 nose chart: the outer skin round a VERTICAL axis through (x 0, z ZC): R(phi, y) = horizontal distance from the axis,
phi = atan2(side * x, z - ZC) (0 = straight ahead, 90 deg = abeam the axis). Built like rear_seam.Skin (outermost outward-
facing triangle per cell, the seam grooves closed over by a grey closing along y), one per side (side -1 = x mirrored).
sigma(phi, y) = arc length up the skin from y Y0 at fixed phi (the 'vertical' surface coordinate the nose move uses)."""
import numpy as np
from scipy.ndimage import grey_closing, gaussian_filter, distance_transform_edt
from scipy.interpolate import RegularGridInterpolator
ZC = 30.0
PH0, PH1, DPH = np.radians(-6.0), np.radians(100.0), np.radians(0.1)
Y0, Y1, DY = 2.0, 26.0, 0.05

def chart(P, side):
    x = P[:, 0] * side; dz = P[:, 2] - ZC
    return np.arctan2(x, dz), P[:, 1], np.hypot(x, dz)

class VSkin:
    def __init__(self, meshes, side=1, close_y=1.9):
        self.side = side
        self.ph = np.arange(PH0, PH1 + 1e-12, DPH); self.y = np.arange(Y0, Y1 + 1e-9, DY)
        nph, ny = len(self.ph), len(self.y)
        R = np.full((nph, ny), -1.0)
        for P, N, T in meshes:
            ph, yy, rr = chart(P, side)
            keep = (P[:, 2] > ZC - 2) & (yy > Y0 - 1) & (yy < Y1 + 1) & (P[:, 0] * side > -4)
            T = T[keep[T].all(1)]
            if not len(T): continue
            A, B, C = P[T[:, 0]], P[T[:, 1]], P[T[:, 2]]
            fn = np.cross(B - A, C - A); cen = (A + B + C) / 3
            radial = np.c_[np.sin(chart(cen, side)[0]) * side, np.zeros(len(cen)), np.cos(chart(cen, side)[0])]
            T = T[(fn * radial).sum(1) > 0]
            gi = (ph - PH0) / DPH; gj = (yy - Y0) / DY
            for a, b, c in T:
                i0 = max(int(np.ceil(min(gi[a], gi[b], gi[c]))), 0); i1 = min(int(np.floor(max(gi[a], gi[b], gi[c]))), nph - 1)
                j0 = max(int(np.ceil(min(gj[a], gj[b], gj[c]))), 0); j1 = min(int(np.floor(max(gj[a], gj[b], gj[c]))), ny - 1)
                if i1 < i0 or j1 < j0: continue
                II, JJ = np.meshgrid(np.arange(i0, i1 + 1), np.arange(j0, j1 + 1), indexing='ij')
                x0, y0, x1, y1, x2, y2 = gi[a], gj[a], gi[b], gj[b], gi[c], gj[c]
                den = (y1 - y2) * (x0 - x2) + (x2 - x1) * (y0 - y2)
                if abs(den) < 1e-12: continue
                l0 = ((y1 - y2) * (II - x2) + (x2 - x1) * (JJ - y2)) / den
                l1 = ((y2 - y0) * (II - x2) + (x0 - x2) * (JJ - y2)) / den
                l2 = 1 - l0 - l1
                m = (l0 >= -1e-6) & (l1 >= -1e-6) & (l2 >= -1e-6)
                if not m.any(): continue
                r = (l0 * rr[a] + l1 * rr[b] + l2 * rr[c])[m]; ii, jj = II[m], JJ[m]
                up = r > R[ii, jj]
                R[ii[up], jj[up]] = r[up]
        hole = R < 0
        self.hole = hole
        if hole.any():
            _, (ai, aj) = distance_transform_edt(hole, return_indices=True); R = R[ai, aj]
        self.raw = R.copy()
        k = int(round(close_y / DY)) | 1
        Rc = grey_closing(R, size=(3, k))
        self.groove = (Rc - R) > 0.004
        self.R = gaussian_filter(Rc, (1.0, 1.5))
        dR = np.gradient(self.R, DY, axis=1)
        self.dR = dR
        ds = np.sqrt(1 + dR ** 2) * DY
        self.sig = np.concatenate([np.zeros((nph, 1)), np.cumsum(0.5 * (ds[:, 1:] + ds[:, :-1]), axis=1)], 1)
        self._R = RegularGridInterpolator((self.ph, self.y), self.R, bounds_error=False, fill_value=None)
        self._dR = RegularGridInterpolator((self.ph, self.y), self.dR, bounds_error=False, fill_value=None)
        self._sig = RegularGridInterpolator((self.ph, self.y), self.sig, bounds_error=False, fill_value=None)

    def R_at(self, ph, y): return self._R(np.c_[np.atleast_1d(ph), np.broadcast_to(np.atleast_1d(y), np.shape(np.atleast_1d(ph)))])
    def dR_at(self, ph, y): return self._dR(np.c_[np.atleast_1d(ph), np.broadcast_to(np.atleast_1d(y), np.shape(np.atleast_1d(ph)))])
    def sig_at(self, ph, y): return self._sig(np.c_[np.atleast_1d(ph), np.broadcast_to(np.atleast_1d(y), np.shape(np.atleast_1d(ph)))])
    def y_at_sig(self, ph, s):
        """inverse of sigma along y at each phi (bilinear in phi)"""
        ph = np.atleast_1d(ph); s = np.broadcast_to(np.atleast_1d(s), ph.shape)
        fi = np.clip((ph - PH0) / DPH, 0, len(self.ph) - 1.000001); i0 = np.floor(fi).astype(int); f = fi - i0
        out = np.empty(len(ph))
        for k in range(len(ph)):
            a = np.interp(s[k], self.sig[i0[k]], self.y); b = np.interp(s[k], self.sig[i0[k] + 1], self.y)
            out[k] = a * (1 - f[k]) + b * f[k]
        return out
    def xyz(self, ph, y):
        ph = np.atleast_1d(ph); y = np.broadcast_to(np.atleast_1d(y), ph.shape); r = self.R_at(ph, y)
        return np.c_[self.side * r * np.sin(ph), y, ZC + r * np.cos(ph)]
    def ph_at_z(self, y, z):
        """phi on this side where the skin at height y reaches z (the skin's z falls as phi grows past the nose)"""
        ph = self.ph[(self.ph > 0) & (self.ph < np.radians(95))]
        P = self.xyz(ph, np.full(len(ph), y)); zz = P[:, 2]
        zz = np.minimum.accumulate(zz)
        return float(np.interp(-z, -zz, ph))
