"""The seam's centreline in the nose chart: y(phi) on the +X side, from a shell's trigger/body facing outer vertices."""
import sys, numpy as np
sys.path.insert(0, '/home/claude/work/s2/scripts')
import seam3d, vskin
from scipy.ndimage import gaussian_filter1d
PHG = np.radians(np.arange(0.0, 80.0001, 0.25))
def seam_phi(M, side=1):
    cl = seam3d.seam_line(M, 'L' if side > 0 else 'R')
    cl = cl[(cl[:, 2] > vskin.ZC + 2) & (cl[:, 1] < 24)]
    ph, y, r = vskin.chart(cl, side)
    out = np.full(len(PHG), np.nan)
    for k, p in enumerate(PHG):
        m = np.abs(ph - p) < np.radians(0.4)
        if m.sum() >= 2: out[k] = np.median(y[m])
    ok = np.isfinite(out)
    out = np.interp(np.arange(len(PHG)), np.nonzero(ok)[0], out[ok])
    return gaussian_filter1d(out, 2.0, mode='nearest'), cl
def lip_top(sk, slope=1.0):
    """per phi: the lowest height above the gap (y > 10.6) where the skin leans back by `slope` (dR/dy = -slope): the
    bottom of the trigger nose's round, i.e. the top of its usable lip"""
    out = np.full(len(PHG), np.nan)
    for k, p in enumerate(PHG):
        yy = np.arange(10.6, 22.0, 0.02); d = sk.dR_at(np.full(len(yy), p), yy)
        j = np.nonzero(d < -slope)[0]
        if len(j): out[k] = yy[j[0]]
    return out
