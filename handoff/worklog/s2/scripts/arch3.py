"""F49.2 seam path v3 (S2): the trigger seam seen from the side as a smooth arch offset below the top of the profile.
  T(z)    the crown profile (S1 profile_centre.json 'sil': the centre line, the wheel opening filled by the crown)
  n(z)    the offset along the profile's normal: N_REAR behind Z_T0, easing (quintic) to N_FRONT ahead of Z_T1
  y_a(z)  the offset curve, run out into the flat front cutout (y = Y_LIP across the nose, #46) by a softplus (C-inf)
  3D      on the +X wall where the skin (rear_seam's Skin, grooves closed) is at y_a(z); X(z) lightly smoothed, Y back
          from the skin so every point lies on it
  corner  K3 (F46.2) as S1 built it: a quintic Bezier from the cutout line z = Z_CUT (3 control points, legs D) to the
          arch's top-view tangent at J (3 control points, legs E), J chosen so the tangent meets the cutout E[0] back
  cutout  z = Z_CUT from the corner to the centre (X 0.125, the split's half width)
Returns the path from the front (where it meets today's flat lip) to the centre, in scene (X, Y, Z), the +X side."""
import json, sys
import numpy as np
from math import comb
from scipy.ndimage import gaussian_filter1d
sys.path.insert(0, '/home/claude/work/s2/scripts')
import skin as SK

N_REAR, N_FRONT, Z_T0, Z_T1 = 6.9, 4.75, 18.0, 42.0
Y_LIP, S_RUN, Z_FRONT = 10.0, 0.55, 50.0
Z_B0, Z_B1 = 45.0, 50.0       # ahead of Z_B0 the arch eases onto today's seam (the trigger cap's shoulder edge at the nose)
Z_CUT = 4.8418
D_LEGS = [2.85, 1.9, 0.95]; E0 = 7.0          # K3 (S1: d 3.2, e 7.0, rmin 1.83 on a level side seam); d 2.85 keeps rmin 1.8 on the rising arch

P = json.load(open('/home/claude/work/s1/profile_centre.json'))
Tz, Ty = np.array(P['z']), np.array(P['sil'])
def T(z): return np.interp(z, Tz, Ty)
def q5(t): t = np.clip(t, 0, 1); return t ** 3 * (10 - 15 * t + 6 * t * t)
Z_TJ, Z_TE0, Z_TE1 = 11.75, 38.0, 46.0     # the offset falls linearly from J (so the seam stays concave-down like the top: it
                                          # never flattens then steepens), easing out over Z_TE0..Z_TE1 (d' to 0), onto today's
def n_of(z):
    z = np.asarray(z, float)
    L = (Z_TE0 - Z_TJ) + (Z_TE1 - Z_TE0) / 2; a = (N_REAR - N_FRONT) / L
    s1 = np.clip(z, Z_TJ, Z_TE0) - Z_TJ                                   # the linear part
    u = np.clip(z, Z_TE0, Z_TE1) - Z_TE0; s2 = u - u * u / (2 * (Z_TE1 - Z_TE0))   # the ease (d' falls linearly to 0)
    return N_REAR - a * (s1 + s2)

def offset_curve(z0=-2.0, z1=62.0, n=None):
    zz = np.arange(z0, z1, 0.02); yy = T(zz)
    yy = gaussian_filter1d(yy, 150)                    # 3 mm: the crown's small bumps (the opening's fill) out of the offset
    dz = np.gradient(zz); dy = np.gradient(yy); L = np.hypot(dz, dy)
    nz, ny = dy / L, -dz / L
    nn = n_of(zz) if n is None else n
    oz, oy = zz + nn * nz, yy + nn * ny
    o = np.argsort(oz); return oz[o], oy[o]

def arch_y(z):
    oz, oy = offset_curve()
    ya = np.interp(z, oz, oy)
    ya = Y_LIP + S_RUN * np.logaddexp(0, (ya - Y_LIP) / S_RUN)
    from arch import seam_today
    w = q5((np.asarray(z, float) - Z_B0) / (Z_B1 - Z_B0))
    return (1 - w) * ya + w * seam_today(z)

def bez(Pc, n=400):
    Pc = np.asarray(Pc, float); m = len(Pc) - 1; t = np.linspace(0, 1, n)[:, None]
    return sum(comb(m, i) * (1 - t) ** (m - i) * t ** i * Pc[i] for i in range(m + 1))

def curv2(C):
    d1 = np.gradient(C, axis=0); d2 = np.gradient(d1, axis=0)
    return (d1[:, 0] * d2[:, 1] - d1[:, 1] * d2[:, 0]) / np.maximum(np.hypot(d1[:, 0], d1[:, 1]) ** 3, 1e-12)

def design(sk=None):
    sk = sk or SK.get()
    zz = np.arange(Z_CUT + 1.5, Z_FRONT + 1e-9, 0.05)
    ya = arch_y(zz)
    th = np.array([SK.th_at_y(sk, y, z) for y, z in zip(ya, zz)])
    th = gaussian_filter1d(th, 6)
    A = np.vstack([SK.xyz(sk, t, z) for t, z in zip(th, zz)])        # the arch on the skin
    # J: where the arch's top-view tangent meets the cutout line E0 back
    X, Z = A[:, 0], A[:, 2]
    best = None
    for k in range(10, len(zz) - 10):
        t = np.array([X[k + 8] - X[k - 8], Z[k + 8] - Z[k - 8]]); t /= np.linalg.norm(t)
        s = (Z[k] - Z_CUT) / t[1]
        if best is None or abs(s - E0) < best[0]: best = (abs(s - E0), k, t, s)
    _, kJ, t2, s = best
    J = np.array([X[kJ], Z[kJ]]); K = J - s * t2; t1 = np.array([1.0, 0.0])
    Pc = [K - D_LEGS[0] * t1, K - D_LEGS[1] * t1, K - D_LEGS[2] * t1, K + s / 3 * t2, K + 2 * s / 3 * t2, K + s * t2]
    C = bez(Pc, 700); kap = curv2(C)
    Cth = np.array([SK.th_at_x(sk, x, z) for x, z in C])
    Cor = np.vstack([SK.xyz(sk, t, z) for t, z in zip(Cth, C[:, 1])])
    cx = np.linspace(C[0, 0], 0.125, 300)
    Cut = np.vstack([SK.xyz(sk, SK.th_at_x(sk, x, Z_CUT), Z_CUT) for x in cx])
    path = np.vstack([A[kJ:][::-1], Cor[::-1][1:], Cut[1:]])
    # the arch's top-view curvature at J (the corner's is 0 there: G2 if this is ~0)
    kA = curv2(np.c_[X, Z])[kJ]
    return dict(path=path, arch=A[kJ:], corner=Cor, cut=Cut, J=J, K=K, ctrl=np.array(Pc), rmin=float(1 / np.abs(kap).max()),
                span=[float(C[:, 0].max() - C[:, 0].min()), float(C[:, 1].max() - C[:, 1].min())], kJ_arch=float(kA))

if __name__ == '__main__':
    D = design()
    print('J (%.2f, %.2f) K (%.2f, %.2f) rmin %.2f span %.2f x %.2f, arch top-view curvature at J %.4f /mm' % (*D['J'], *D['K'], D['rmin'], *D['span'], D['kJ_arch']))
    p = D['path']
    print('Y at J %.2f; corner end (%.2f, %.2f); crown at the cutout %.2f' % (D['arch'][0, 1], D['corner'][0, 0], D['corner'][0, 1], T(Z_CUT)))
    json.dump(dict(note='S2 seam path v3 (+X side, scene X Y Z, front to centre): the arch n %.1f -> %.1f mm below the crown, run out into y %.1f; K3 corner; the cutout at z %.4f' % (N_REAR, N_FRONT, Y_LIP, Z_CUT),
                   path=p.round(4).tolist(), J=D['J'].tolist(), K=D['K'].tolist(), ctrl=D['ctrl'].tolist(), rmin=D['rmin'], span=D['span']),
              open('/home/claude/work/s2/seam_path_v3.json', 'w'))
