"""Geometry helpers on the inner wall surface S_in = {D(p) + T(p) = 0} (D: exterior SDF, T: graded wall thickness)."""
import numpy as np
from common import *

class Shell:
    def __init__(self, ext=None):
        self.ext = ext or Grid.load(os.path.join(WORK, 'ext.npz'))
    def D(self, p): return self.ext(p)
    def Sin(self, p):
        """>0 inside the wall material side, <0 in the cavity; 0 on the inner wall surface"""
        p = np.asarray(p, float).reshape(-1, 3); return self.ext(p) + wall_T(p)
    def normal_in(self, p):
        """unit normal of the inner surface pointing into the cavity (= -grad D)"""
        g = self.ext.grad(np.asarray(p, float).reshape(-1, 3)); return -g / np.linalg.norm(g, axis=1, keepdims=True)
    def project(self, p, iters=4):
        p = np.array(p, float).reshape(-1, 3)
        for _ in range(iters):
            s = self.Sin(p); g = self.ext.grad(p); n2 = np.maximum((g * g).sum(1), 1e-9)
            p -= (s / n2)[:, None] * g
        return p
    def raycast(self, c, dirs, rmax=60.0, step=0.25):
        """first crossing from cavity (<0) to wall (>0) along rays c + t*d; returns points (nan if none)"""
        c = np.asarray(c, float); dirs = np.asarray(dirs, float)
        ts = np.arange(0.0, rmax, step)
        P = c[None, None, :] + ts[None, :, None] * dirs[:, None, :]
        S = self.Sin(P.reshape(-1, 3)).reshape(len(dirs), len(ts))
        out = np.full((len(dirs), 3), np.nan)
        for i in range(len(dirs)):
            s = S[i]; k = np.where((s[:-1] < 0) & (s[1:] >= 0))[0]
            if len(k) == 0: continue
            k = k[0]; t = ts[k] + step * s[k] / (s[k] - s[k + 1])
            out[i] = c + t * dirs[i]
        return out

def polyline_arclen(P):
    d = np.linalg.norm(np.diff(P, axis=0), axis=1); return np.concatenate([[0], np.cumsum(d)])

def resample(P, s_new):
    s = polyline_arclen(P)
    return np.stack([np.interp(s_new, s, P[:, i]) for i in range(3)], 1)

# ---------------- trigger seams (from the scan's groove map; see README) ----------------
SEAM = dict(
    rear_z0=4.8, rear_k=0.0058,          # rear (hump) seam: z = 4.8 + 0.0058 x^2
    side_y9=27.5, side_slope=-0.346,      # side seam plane: y = 27.5 - 0.346 (z - 9) up to z = 48, then steeper
    side_z1=48.0, side_slope2=-0.45,
    wheel=(4.4, 27.6, 47.8),             # wheel slot half-width, z0, z1 (triggers only)
    center_gap=0.5,
)
def seam_side_y(z):
    z = np.asarray(z, float)
    y = SEAM['side_y9'] + SEAM['side_slope'] * (z - 9.0)
    y1 = SEAM['side_y9'] + SEAM['side_slope'] * (SEAM['side_z1'] - 9.0)
    return np.where(z > SEAM['side_z1'], y1 + SEAM['side_slope2'] * (z - SEAM['side_z1']), y)
def seam_rear_z(x):
    return SEAM['rear_z0'] + SEAM['rear_k'] * np.asarray(x, float) ** 2
def trig_sdf(p):
    """signed distance-like field of the trigger region (negative inside): z > rear seam and y > side seam."""
    p = np.asarray(p, float).reshape(-1, 3)
    a = seam_rear_z(p[:, 0]) - p[:, 2]                         # <0 in front of the rear seam
    gx = 2 * SEAM['rear_k'] * p[:, 0]; a = a / np.sqrt(1 + gx * gx)
    b = seam_side_y(p[:, 2]) - p[:, 1]                        # <0 above the side seam
    sl = np.where(p[:, 2] > SEAM['side_z1'], SEAM['side_slope2'], SEAM['side_slope']); b = b / np.sqrt(1 + sl * sl)
    return np.maximum(a, b)
