"""F49.2 seam path v5 (S2): arch3's design (offset 6.9 -> 4.75 mm below the crown along its normal, onto today's seam at the
nose; K3 at the back), with the rear (from z 22 back: the arch near J, the corner, the cutout) on one smooth bicubic surface of
the skin seen from above (S1's height map, grooves closed, lightly smoothed), so the arch and the corner share exact heights
and slopes at J. Ahead of z 22 the arch's X comes from rear_seam's polar skin (arch4). Writes seam_path_v5.json."""
import json, sys
import numpy as np
from scipy.interpolate import RectBivariateSpline, UnivariateSpline
from scipy.ndimage import gaussian_filter
sys.path.insert(0, '/home/claude/work/s2/scripts')
import skin as SK, arch3 as A3, arch4 as A4
from arch3 import T, arch_y, bez, curv2, Z_CUT, D_LEGS, E0, Z_FRONT

HM = np.load('/home/claude/work/s1/heightmap_ths.npz')
zs, xs, Y = HM['zs'], HM['xs'], HM['Y'].astype(float)
iz = (zs > -4) & (zs < 30); ix = (xs > -2) & (xs < 32.5)
Ys = Y[np.ix_(iz, ix)]
ok = Ys > 0
Yf = np.where(ok, Ys, 0.0)
w = gaussian_filter(ok.astype(float), 1.5); Ysm = gaussian_filter(Yf, 1.5) / np.maximum(w, 1e-6)
Ysm = np.where(ok, Ysm, np.nan)
# fill outside (beyond the outline) by extending each row's last value, so the spline is defined there (we never use it)
for i in range(Ysm.shape[0]):
    r = Ysm[i]; g = np.isfinite(r)
    if g.any(): last = np.nonzero(g)[0].max(); r[last + 1:] = r[last] - 0.5 * np.arange(1, len(r) - last); Ysm[i] = r
H = RectBivariateSpline(zs[iz], xs[ix], Ysm, kx=3, ky=3)
def Hy(x, z): return H.ev(z, x)
def Hx(x, z): return H.ev(z, x, dy=1)

def x_on(y, z, x0):
    x = x0
    for _ in range(30):
        f = Hy(x, z) - y; d = Hx(x, z)
        if abs(d) < 1e-6: break
        x = x - f / d
        if abs(f) < 1e-7: break
    return x

def design():
    sk = SK.get()
    D4 = A4.design(sk)                             # the front part (polar skin) and a first guess everywhere
    sx4 = D4['sx']
    zz = np.arange(Z_CUT + 3.0, 22.0 + 1e-9, 0.02)
    ya = arch_y(zz)
    xa = np.array([x_on(y, z, float(sx4(z))) for y, z in zip(ya, zz)])
    # J: tangent meets the cutout E0 back
    dx = np.gradient(xa, zz); s = (zz - Z_CUT) * np.sqrt(1 + dx ** 2); k = np.argmin(np.abs(s - E0))
    zJ = zz[k]; J = np.array([xa[k], zJ]); t2 = np.array([dx[k], 1.0]) / np.sqrt(1 + dx[k] ** 2); sJ = s[k]
    K = J - sJ * t2; t1 = np.array([1.0, 0.0])
    Pc = np.array([K - D_LEGS[0] * t1, K - D_LEGS[1] * t1, K - D_LEGS[2] * t1, K + sJ / 3 * t2, K + 2 * sJ / 3 * t2, K + sJ * t2])
    C = bez(Pc, 900); kap = curv2(C)
    corner = np.c_[C[:, 0], Hy(C[:, 0], C[:, 1]), C[:, 1]]                       # cutout end ... J
    cx = np.linspace(C[0, 0], 0.125, 500)
    cut = np.c_[cx, Hy(cx, np.full(len(cx), Z_CUT)), np.full(len(cx), Z_CUT)]
    rear = np.c_[xa, ya, zz][k:]                                                   # J .. z 22
    # ahead of z 22: arch4's arch (polar skin), joined with a short blend of X over z 20..22
    front = D4['arch']; front = front[front[:, 2] > 22.0]
    wz = np.clip((rear[:, 2] - 20.0) / 2.0, 0, 1); wz = wz * wz * (3 - 2 * wz)
    rear[:, 0] = (1 - wz) * rear[:, 0] + wz * sx4(rear[:, 2])
    arch = np.vstack([rear, front])
    path = np.vstack([arch[::-1], corner[::-1][1:], cut[1:]])
    return dict(path=path, arch=arch, corner=corner, cut=cut, J=J, K=K, ctrl=Pc, rmin=float(1 / np.abs(kap).max()),
                span=[float(C[:, 0].max() - C[:, 0].min()), float(C[:, 1].max() - C[:, 1].min())], dJ=float(Hy(J[0], zJ) - arch_y(np.array([zJ]))[0]))

if __name__ == '__main__':
    D = design(); p = D['path']
    print('J (%.2f, %.2f) K (%.2f, %.2f) rmin %.2f span %.2f x %.2f; height mismatch at J %.4f mm' % (*D['J'], *D['K'], D['rmin'], *D['span'], D['dJ']))
    print('corner end (%.2f, %.2f); crown at the cutout %.2f' % (D['corner'][0, 0], D['corner'][0, 1], T(Z_CUT)))
    json.dump(dict(note='S2 seam path v5 (+X side; scene X Y Z, front (z %.1f, on today\'s seam) to the centre of the rear cutout). Arch %.1f mm below the crown along its normal behind z %.0f, easing to %.2f ahead of z %.0f, onto today\'s seam over z %.0f..%.0f; K3 (legs d %.2f, e %.1f) on the arch\'s tangent; cutout z %.4f' % (Z_FRONT, A3.N_REAR, A3.Z_T0, A3.N_FRONT, A3.Z_T1, A3.Z_B0, A3.Z_B1, D_LEGS[0], E0, Z_CUT),
                   path=p.round(4).tolist(), J=D['J'].round(4).tolist(), K=D['K'].round(4).tolist(), ctrl=D['ctrl'].round(4).tolist(), rmin=round(D['rmin'], 3), span=[round(v, 3) for v in D['span']]),
              open('/home/claude/work/s2/seam_path_v5.json', 'w'))
