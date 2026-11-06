"""The fairest run-out of the arch into the lip: y''(z) piecewise linear on knots from Z_A to the tip (G2 with the arch at
Z_A), integrated twice; lands on (Z_TIP, Y_TIP) with slope 0 (the lip is symmetric across the nose); the lip's corners
(z 55.5) rise at most RISE; minimise the curvature's change (sum of (dy''/dz)^2) plus the peak curvature."""
import sys, numpy as np
from scipy.optimize import minimize
sys.path.insert(0, '/home/claude/work/s2/scripts')
import front as FR
fa = FR.arch_side()

def build(z_a, inner, n):
    knots = np.linspace(z_a, FR.Z_TIP, n)
    y2a = FR.deriv(fa, z_a)[1]
    y2 = np.r_[y2a, inner]
    zz = np.linspace(z_a, FR.Z_TIP, 2000); y2z = np.interp(zz, knots, y2)
    ya = float(fa(z_a)); y1a = FR.deriv(fa, z_a)[0]
    y1 = y1a + np.r_[0, np.cumsum((y2z[1:] + y2z[:-1]) / 2 * np.diff(zz))]
    y = ya + np.r_[0, np.cumsum((y1[1:] + y1[:-1]) / 2 * np.diff(zz))]
    return zz, y, y1, y2z, knots, y2

def solve(z_a, rise_max, n=8, w_peak=0.3):
    def unpack(v): return v
    def obj(v):
        zz, y, y1, y2, kn, y2k = build(z_a, v, n)
        return np.sum(np.diff(y2k) ** 2 / np.diff(kn)) * 100 + w_peak * 100 * np.max(np.abs(y2)) ** 2
    cons = [dict(type='eq', fun=lambda v: build(z_a, v, n)[1][-1] - FR.Y_TIP),
            dict(type='eq', fun=lambda v: build(z_a, v, n)[2][-1] - 0.0),
            dict(type='ineq', fun=lambda v: rise_max - (np.interp(55.5, build(z_a, v, n)[0], build(z_a, v, n)[1]) - FR.Y_TIP))]
    v0 = np.full(n - 1, 0.03)
    r = minimize(obj, v0, constraints=cons, method='SLSQP', options=dict(maxiter=500, ftol=1e-10))
    zz, y, y1, y2, kn, y2k = build(z_a, r.x, n)
    k = y2 / (1 + y1 ** 2) ** 1.5
    return dict(ok=r.success, z_a=z_a, zz=zz, y=y, k=k, kmax=float(np.abs(k).max()), kmin=float(k.min()),
                rise=float(np.interp(55.5, zz, y) - FR.Y_TIP), knots=kn, y2=y2k, err=(y[-1] - FR.Y_TIP, y1[-1]))

if __name__ == '__main__':
    for rise in [0.0, 0.25, 0.45]:
        best = None
        for z_a in np.arange(30.0, 50.1, 2.0):
            R = solve(z_a, rise)
            if not R['ok'] or abs(R['err'][0]) > 1e-3 or abs(R['err'][1]) > 1e-3: continue
            if best is None or R['kmax'] < best['kmax']: best = R
        if best: print('rise <= %.2f: z_a %.1f  peak curvature %.4f (r %.1f mm), most concave-down %.4f, rise %.2f; y\'\' at knots %s' % (
            rise, best['z_a'], best['kmax'], 1 / best['kmax'], best['kmin'], best['rise'], np.round(best['y2'], 4).tolist()))

def solve_capped(z_a, rise_max, belly_min, n=9):
    """as solve(), plus y'' >= belly_min everywhere (no more concave-down bend than that), maximising the smallest radius"""
    def obj(v):
        zz, y, y1, y2, kn, y2k = build(z_a, v, n)
        return np.max(y2) * 100 + np.sum(np.diff(y2k) ** 2 / np.diff(kn)) * 20
    cons = [dict(type='eq', fun=lambda v: build(z_a, v, n)[1][-1] - FR.Y_TIP),
            dict(type='eq', fun=lambda v: build(z_a, v, n)[2][-1] - 0.0),
            dict(type='ineq', fun=lambda v: rise_max - (np.interp(55.5, build(z_a, v, n)[0], build(z_a, v, n)[1]) - FR.Y_TIP)),
            dict(type='ineq', fun=lambda v: v - belly_min)]
    r = minimize(obj, np.full(n - 1, 0.02), constraints=cons, method='SLSQP', options=dict(maxiter=800, ftol=1e-12))
    zz, y, y1, y2, kn, y2k = build(z_a, r.x, n)
    k = y2 / (1 + y1 ** 2) ** 1.5
    return dict(ok=r.success, z_a=z_a, zz=zz, y=y, k=k, kmax=float(k.max()), kmin=float(k.min()), rise=float(np.interp(55.5, zz, y) - FR.Y_TIP),
                err=(y[-1] - FR.Y_TIP, y1[-1]), dip45=float(np.interp(45.0, zz, y) - fa(45.0)) if z_a < 45 else 0.0)

if __name__ == '__main__' and len(sys.argv) > 1:
    for belly in [-0.008, -0.012, -0.018]:
        best = None
        for z_a in np.arange(36.0, 52.1, 1.0):
            R = solve_capped(z_a, 0.30, belly)
            if not R['ok'] or abs(R['err'][0]) > 2e-3 or abs(R['err'][1]) > 2e-3: continue
            if best is None or R['kmax'] < best['kmax']: best = R
        if best: print('belly >= %.3f: z_a %.0f  r min %.1f mm, k min %.4f, rise %.2f, below the arch at z 45 by %.2f' % (belly, best['z_a'], 1 / best['kmax'], best['kmin'], best['rise'], -best['dip45']))
