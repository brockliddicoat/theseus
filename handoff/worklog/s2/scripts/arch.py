"""F49.2: the trigger seam seen from the side as a smooth arch, a constant (normal) offset below the top of the profile,
running out into today's lip seam at the nose and blending into the K3 corner (F46.2) at the back.

Frames: scene X (the user's left), Y up, Z nose. The +X (triggerL) side; the -X side is its mirror.
  T(z)     the crown (centre line) profile, the wheel opening filled by the crown (S1 heightmap.py, profile_centre.json)
  arch     y_s = the curve offset by N0 along the normal of (z, T(z)), resampled on z; from z = Z_RUN0 to Z_RUN1 it eases
           into today's seam (which runs out into the flat lip at y 10 across the nose), unchanged ahead of Z_RUN1
  top view x_s(z): where the skin (height map, grooves closed) is at y_s(z) on the upper wall
  corner   K3: a quintic Bezier, 3 control points on the cutout line z = Z_CUT, 3 on the arch's top-view tangent at J,
           with S1's K3 spacing (d 3.2, e 7.0: smallest radius ~1.8 mm), J chosen so its tangent meets the cutout 7.0 back
  path     3D points (X, Y, Z): the arch from Z_RUN1 back to J, the corner, the cutout to X 0
"""
import json, sys
import numpy as np
from math import comb
from scipy.interpolate import RegularGridInterpolator
from scipy.ndimage import gaussian_filter1d
sys.path.insert(0, '/home/claude/work/s2/scripts')

N0 = 5.75             # mm, the offset along the profile's normal (about the mean of today's seam over z 12..50)
Z_RUN0, Z_RUN1 = 40.0, 50.0   # the arch eases into today's seam over this range (today's run-out into the lip ahead)
Z_CUT = 4.8418
K3 = dict(d=[3.2, 2.1333, 1.0667], e=[7.0, 4.6667, 2.3333])

P = json.load(open('/home/claude/work/s1/profile_centre.json'))
Tz, Ty = np.array(P['z']), np.array(P['sil'])
def T(z): return np.interp(z, Tz, Ty)
HM = np.load('/home/claude/work/s1/heightmap_ths.npz')
YS = RegularGridInterpolator((HM['zs'], HM['xs']), np.where(HM['Y'] > 0, HM['Y'], np.nan), bounds_error=False, fill_value=np.nan)
def skin_y(x, z): return YS(np.c_[np.atleast_1d(z), np.atleast_1d(x)])

def seam_today(z):
    """today's seam height on the side (binned from the 3D centreline cloud, smoothed)"""
    c = np.load('/home/claude/work/s2/seam_ths_cloud.npy')
    zz = np.arange(8.0, 59.0, 0.5); yy = []
    for z0 in zz:
        m = (np.abs(c[:, 2] - z0) < 0.6) & (c[:, 0] > 15); yy.append(c[m, 1].mean() if m.any() else np.nan)
    yy = np.array(yy); ok = np.isfinite(yy); yy = np.interp(zz, zz[ok], yy[ok]); yy = gaussian_filter1d(yy, 1.5)
    return np.interp(z, zz, yy)

def offset_curve(n0, z0=-2.0, z1=58.0):
    zz = np.arange(z0, z1, 0.02); yy = T(zz)
    dz = np.gradient(zz); dy = np.gradient(yy); L = np.hypot(dz, dy)
    nz, ny = dy / L, -dz / L                   # the normal pointing down (below the profile)
    oz, oy = zz + n0 * nz, yy + n0 * ny
    o = np.argsort(oz); return oz[o], oy[o]

def smooth5(t):
    t = np.clip(t, 0, 1); return t ** 3 * (10 - 15 * t + 6 * t * t)

def arch_y(z, n0=N0):
    oz, oy = offset_curve(n0)
    ya = np.interp(z, oz, oy)
    w = smooth5((np.asarray(z) - Z_RUN0) / (Z_RUN1 - Z_RUN0))
    return (1 - w) * ya + w * seam_today(z)

def x_at(y, z):
    """the +X upper wall's X where the skin is at height y, section z (from the outline inward)"""
    xs = HM['xs']; i = np.argmin(np.abs(HM['zs'] - z))
    row = YS(np.c_[np.full(len(xs), z), xs])
    m = (xs > 0) & np.isfinite(row)
    xx, yy = xs[m], row[m]
    w = np.argmax(xx)                            # the outline (largest x with skin)
    # from the outline inward the height rises: use the monotone part from the outline toward x = 0
    xx, yy = xx[::-1], yy[::-1]                  # x falling from the outline
    yy = np.maximum.accumulate(yy)
    return float(np.interp(y, yy, xx))

def bez(Pc, n=400):
    Pc = np.asarray(Pc, float); m = len(Pc) - 1; t = np.linspace(0, 1, n)[:, None]
    return sum(comb(m, i) * (1 - t) ** (m - i) * t ** i * Pc[i] for i in range(m + 1))

def curvature(C):
    d1 = np.gradient(C, axis=0); d2 = np.gradient(d1, axis=0)
    return (d1[:, 0] * d2[:, 1] - d1[:, 1] * d2[:, 0]) / np.maximum(np.hypot(d1[:, 0], d1[:, 1]) ** 3, 1e-12)

def design(n0=N0, k3=K3):
    zz = np.arange(Z_CUT + 2.0, Z_RUN1 + 1e-9, 0.1)
    ys = arch_y(zz, n0)
    xs = np.array([x_at(y, z) for y, z in zip(ys, zz)])
    xs_s = gaussian_filter1d(xs, 4)              # the height map's 0.1 mm steps
    # J: the point on the arch (top view) whose tangent meets z = Z_CUT at distance e0
    best = None
    for k in range(5, len(zz) - 5):
        t = np.array([xs_s[k + 3] - xs_s[k - 3], zz[k + 3] - zz[k - 3]]); t /= np.linalg.norm(t)
        if t[1] <= 0: continue
        s = (zz[k] - Z_CUT) / t[1]                # distance back along the tangent to the cutout line
        if best is None or abs(s - k3['e'][0]) < best[0]: best = (abs(s - k3['e'][0]), k, t, s)
    _, kJ, t2, s = best
    J = np.array([xs_s[kJ], zz[kJ]]); K = J - s * t2
    t1 = np.array([1.0, 0.0])
    d, e = k3['d'], [s, s * 2 / 3, s / 3]
    Pc = [K - d[0] * t1, K - d[1] * t1, K - d[2] * t1, K + e[2] * t2, K + e[1] * t2, K + e[0] * t2]
    C = bez(Pc, 600)
    kap = curvature(C)
    corner = np.c_[C[:, 0], skin_y(C[:, 0], C[:, 1]), C[:, 1]]              # (X, Y, Z), from the cutout end to J
    arch3 = np.c_[xs_s, ys, zz][kJ:]                                         # J .. Z_RUN1
    xc0 = C[0, 0]
    cx = np.linspace(xc0, 0.125, 200)
    cut3 = np.c_[cx, skin_y(cx, np.full(len(cx), Z_CUT)), np.full(len(cx), Z_CUT)]
    path = np.vstack([arch3[::-1], corner[::-1][1:], cut3[1:]])             # from the front (Z_RUN1) to the centre
    return dict(n0=n0, J=J.tolist(), K=K.tolist(), ctrl=np.array(Pc).tolist(), rmin=float(1 / np.abs(kap).max()),
                span=[float(C[:, 0].max() - C[:, 0].min()), float(C[:, 1].max() - C[:, 1].min())],
                path=path, corner=corner, arch=arch3, cut=cut3, kJ=int(kJ))

if __name__ == '__main__':
    D = design()
    print('N0 %.2f  J (%.2f, %.2f)  K (%.2f, %.2f)  rmin %.2f  span %.2f x %.2f' % (D['n0'], *D['J'], *D['K'], D['rmin'], *D['span']))
    pth = D['path']
    print('path', pth.shape, 'z', pth[:, 2].min().round(2), pth[:, 2].max().round(2), 'y at J %.2f, at the corner end %.2f, crown %.2f' % (D['arch'][0, 1], D['corner'][0, 1], T(Z_CUT)))
    for z in [50, 45, 40, 35, 30, 25, 20, 15, 12]:
        print('z %4.0f  arch y %.2f  today %.2f  move %+.2f   d %.2f' % (z, arch_y(z), seam_today(z), arch_y(z) - seam_today(z), T(z) - arch_y(z)))
    json.dump(dict(n0=D['n0'], J=D['J'], K=D['K'], ctrl=D['ctrl'], rmin=D['rmin'], span=D['span'], path=D['path'].round(4).tolist()),
              open('/home/claude/work/s2/arch_path.json', 'w'))
