"""F51 (12:34): the rim's crease as one straight line at about 2 deg to the base, matched to the scan's crease over the front and
middle (z > Z_FM), the back allowed to miss. y = c - tan(a) (z - 0)."""
import json, sys, numpy as np
CR = json.load(open('/home/claude/work/s1/crease_side.json')); cz, cy = np.array(CR['z']), np.array(CR['y'])
Z_NOSE = 55.4                 # the scan's crease meets the nose's lower corner here (y 3.0)
def resid(a_deg, c, lo, hi, step=0.25):
    zz = np.arange(lo, hi + 1e-9, step); return (c - np.tan(np.radians(a_deg)) * zz) - np.interp(zz, cz, cy)
def fit(a_deg, lo=-20.0, hi=Z_NOSE, kind='rms'):
    zz = np.arange(lo, hi + 1e-9, 0.25); y = np.interp(zz, cz, cy); t = np.tan(np.radians(a_deg))
    if kind == 'rms': c = np.mean(y + t * zz)
    else:                                   # minimax: the middle of the residual's range
        r = y + t * zz; c = (r.max() + r.min()) / 2
    return c
if __name__ == '__main__':
    print('angle  c(z=0)  | rms/max front-middle (z -20..55.4) | worst miss: front (20..55.4)  middle (-20..20)  back (-59.6..-20) | y at the nose corner 55.4, at z -50, at the tail -59.58')
    for a in [1.5, 1.75, 2.0, 2.25, 2.5]:
        for kind in ('rms', 'max'):
            c = fit(a, kind=kind); r = resid(a, c, -20, Z_NOSE)
            rf = resid(a, c, 20, Z_NOSE); rm = resid(a, c, -20, 20); rb = resid(a, c, -59.58, -20)
            t = np.tan(np.radians(a)); yat = lambda z: c - t * z
            worst = lambda r: r[np.argmax(np.abs(r))]
            print('%.2f %s  %.3f  | %.2f / %.2f | %+.2f  %+.2f  %+.2f | %.2f  %.2f  %.2f' % (a, kind, c, np.sqrt((r ** 2).mean()), np.abs(r).max(), worst(rf), worst(rm), worst(rb), yat(Z_NOSE), yat(-50), yat(-59.58)))
    # free angle (rms over the front two-thirds)
    best = min(((np.sqrt((resid(a, fit(a), -20, Z_NOSE) ** 2).mean()), a) for a in np.arange(0.5, 3.01, 0.01)))
    print('free angle, rms-best over z -20..55.4: %.2f deg (rms %.3f)' % (best[1], best[0]))
