"""F49.2 seam path v4 (S2): v3's design with clean curves (see arch3.py for the definitions).
  side view   y_a(z) analytic (the smoothed crown, the normal offset n(z), the softplus run-out into the flat lip)
  top view    X_a(z): the skin's X at height y_a(z), as a quintic smoothing spline (within 0.02 mm of the skin)
  corner      K3's Bezier on the spline's tangent at J; heights from the skin, splined, shifted to meet y_a(J) exactly
  cutout      z = Z_CUT, heights from the skin, splined
design() -> dict(path (front -> centre, scene X Y Z, +X side), pieces, J, K, ctrl, rmin, span)"""
import json, sys
import numpy as np
from scipy.interpolate import UnivariateSpline
sys.path.insert(0, '/home/claude/work/s2/scripts')
import skin as SK
import arch3 as A3
from arch3 import T, arch_y, bez, curv2, Z_CUT, D_LEGS, E0, Z_FRONT

def spl(x, y, tol, k=5):
    o = np.argsort(x); return UnivariateSpline(x[o], y[o], k=k, s=len(x) * tol ** 2)

def design(sk=None):
    sk = sk or SK.get()
    zz = np.arange(Z_CUT + 1.5, Z_FRONT + 0.4, 0.05)
    ya = arch_y(zz)
    th = np.array([SK.th_at_y(sk, y, z) for y, z in zip(ya, zz)])
    Xr = SK.xyz(sk, th, zz)[:, 0]
    sx = spl(zz, Xr, 0.012)
    # J on the spline: its tangent meets the cutout E0 back
    zs = np.arange(Z_CUT + 4, Z_CUT + 9, 0.005)
    dx = sx.derivative(1)(zs); s = (zs - Z_CUT) * np.sqrt(1 + dx ** 2)
    k = np.argmin(np.abs(s - E0)); zJ = zs[k]
    J = np.array([sx(zJ), zJ]); t2 = np.array([dx[k], 1.0]) / np.sqrt(1 + dx[k] ** 2); sJ = s[k]
    K = J - sJ * t2; t1 = np.array([1.0, 0.0])
    Pc = np.array([K - D_LEGS[0] * t1, K - D_LEGS[1] * t1, K - D_LEGS[2] * t1, K + sJ / 3 * t2, K + 2 * sJ / 3 * t2, K + sJ * t2])
    C = bez(Pc, 800); kap = curv2(C)
    # the corner's heights: the skin's, splined along the Bezier's parameter, then shifted so it meets the arch at J exactly
    tt = np.linspace(0, 1, len(C))
    Yc = np.array([SK.xyz(sk, SK.th_at_x(sk, x, z), z)[0, 1] for x, z in C])
    syc = spl(tt, Yc, 0.006)
    Yc = syc(tt); Yc += (arch_y(np.array([zJ]))[0] - Yc[-1]) * q(tt)
    corner = np.c_[C[:, 0], Yc, C[:, 1]]                                   # cutout end ... J
    # the cutout
    cx = np.linspace(C[0, 0], 0.125, 400)
    Ycut = np.array([SK.xyz(sk, SK.th_at_x(sk, x, Z_CUT), Z_CUT)[0, 1] for x in cx])
    sct = spl(cx, Ycut, 0.006); Ycut = sct(cx); Ycut += (Yc[0] - Ycut[0]) * (1 - (cx - cx[0]) / (cx[-1] - cx[0]))
    cut = np.c_[cx, Ycut, np.full(len(cx), Z_CUT)]
    za = np.arange(zJ, Z_FRONT + 1e-9, 0.05)
    arch = np.c_[sx(za), arch_y(za), za]
    path = np.vstack([arch[::-1], corner[::-1][1:], cut[1:]])
    return dict(path=path, arch=arch, corner=corner, cut=cut, J=J, K=K, ctrl=Pc, rmin=float(1 / np.abs(kap).max()),
                span=[float(C[:, 0].max() - C[:, 0].min()), float(C[:, 1].max() - C[:, 1].min())], sx=sx)

def q(t):
    """0 at the cutout end, 1 at J, flat at both ends (so the height correction adds no kink)"""
    t = np.clip(t, 0, 1); return t ** 3 * (10 - 15 * t + 6 * t * t)

def mirror(p):
    return p * np.array([-1, 1, 1])

if __name__ == '__main__':
    D = design()
    p = D['path']
    print('J (%.2f, %.2f) K (%.2f, %.2f)  rmin %.2f  span %.2f x %.2f' % (*D['J'], *D['K'], D['rmin'], *D['span']))
    # curvature check on 0.25 mm resampling, both views
    for nm, (a, b) in (('side', (2, 1)), ('top', (0, 2))):
        Q = p[:, [a, b]]; d = np.r_[0, np.cumsum(np.linalg.norm(np.diff(Q, axis=0), axis=1))]; ss = np.arange(0, d[-1], 0.25)
        R = np.c_[np.interp(ss, d, Q[:, 0]), np.interp(ss, d, Q[:, 1])]
        kk = curv2(R)
        zi = np.interp(ss, d, p[:, 2])
        for lo, hi in ((5.5, 11), (11, 20), (20, 45), (45, 55.5)):
            m = (zi > lo) & (zi < hi) & (np.abs(np.interp(ss, d, p[:, 0])) > 20)
            if m.any(): print('  %s z %4.1f..%4.1f  |k| max %.3f /mm (r %.1f mm)' % (nm, lo, hi, np.abs(kk[m]).max(), 1 / max(np.abs(kk[m]).max(), 1e-9)))
    json.dump(dict(note='S2 seam path v4 (+X side; scene X Y Z, the front (flat lip) to the centre of the rear cutout). Arch: %.1f mm below the crown along its normal (%.1f at the nose), run out into y %.1f; K3 corner (S1 legs d %.1f, e %.1f) on the arch tangent; cutout z %.4f' % (A3.N_REAR, A3.N_FRONT, A3.Y_LIP, D_LEGS[0], E0, Z_CUT),
                   path=p.round(4).tolist(), J=D['J'].round(4).tolist(), K=D['K'].round(4).tolist(), ctrl=D['ctrl'].round(4).tolist(), rmin=round(D['rmin'], 3), span=[round(v, 3) for v in D['span']]),
              open('/home/claude/work/s2/seam_path_v4.json', 'w'))
