"""rear_seam's Skin (rho(theta, z) of the outer skin, grooves closed, u = arc length round the section from the top centre)
built once over a wider range for S2 (the whole side seam, nose to rear cutout) with a lower polar axis, cached."""
import os, sys, pickle, time
import numpy as np
sys.path.insert(0, '/home/claude/theseus/3d/shell/tools')
import rear_seam as RS, glbio
CACHE = '/home/claude/work/s2/skin_%s.pkl'
YC, Z_LO, Z_HI = 5.0, -7.0, 57.0

def configure():
    RS.YC = YC; RS.Z_LO = Z_LO; RS.Z_HI = Z_HI

def meshes(fn):
    js, b = glbio.read(fn); M = {}
    for k in ('triggerL', 'triggerR', 'body'):
        _, d = glbio.mesh_arrays(js, b, k)
        M[k] = (d['POSITION'].astype(float), d['NORMAL'].astype(float), d['COLOR_0'], d['indices'].reshape(-1, 3))
    return js, b, M

def get(fn='/home/claude/theseus/3d/shell/shell-theseus-1seam.glb', tag='ths'):
    configure()
    c = CACHE % tag
    if os.path.exists(c) and os.path.getmtime(c) > os.path.getmtime(fn):
        return pickle.load(open(c, 'rb'))
    t0 = time.time()
    _, _, M = meshes(fn)
    sk = RS.Skin([M[k] for k in ('triggerL', 'triggerR', 'body')])
    pickle.dump(sk, open(c, 'wb'))
    print('skin built %.0fs' % (time.time() - t0), file=sys.stderr)
    return sk

def xyz(sk, th, z):
    th = np.atleast_1d(th); z = np.broadcast_to(np.atleast_1d(z), th.shape)
    r = sk.rho_at(th, z); return np.c_[r * np.cos(th), YC + r * np.sin(th), z]

def th_at_y(sk, y, z, side=1):
    """theta on this side's wall (up to 80 deg from horizontal) where the skin is at height y"""
    th = sk.th[(sk.th < np.radians(80))] if side > 0 else sk.th[(sk.th > np.radians(100))]
    P = xyz(sk, th, np.full(len(th), z)); yy = P[:, 1]
    if side < 0: th, yy = th[::-1], yy[::-1]
    yy = np.maximum.accumulate(yy)
    return float(np.interp(y, yy, th))

def th_at_x(sk, x, z, side=1):
    """theta on the upper wall (between the widest point and the top) where the skin is at X = x"""
    th = sk.th[(sk.th > np.radians(3.5)) & (sk.th < np.radians(90))]
    P = xyz(sk, th, np.full(len(th), z)); xx = P[:, 0]
    w = np.argmax(xx); th, xx = th[w:], xx[w:]          # from the widest point up (x falls as theta rises)
    return float(np.interp(-x, -xx, th))

def fill_opening(sk, z0=26.0, z1=49.0, xin=5.6, xout=8.5):
    """the wheel opening (and the bay seen through it) replaced by the crown in rho(theta, z), so u (the arc length round
    the section from the top centre) is not inflated by rays dipping into the hole; u and the interpolators rebuilt"""
    from scipy.interpolate import RegularGridInterpolator
    th = sk.th; c = np.cos(th); s = np.sin(th)
    for j, z in enumerate(sk.z):
        if z < z0 or z > z1: continue
        r = sk.rho[:, j]; x = r * c; y = YC + r * s
        side = (np.abs(x) > xin) & (np.abs(x) < xout) & (y > YC + 5)
        if side.sum() < 6: continue
        A = np.c_[x[side] ** 2, np.ones(side.sum())]
        c2, c0 = np.linalg.lstsq(A, y[side], rcond=None)[0]
        hole = (np.abs(x) < xin + 0.3) & (y > YC + 5)
        # the crown's height at this theta: solve r sin(t) + YC = c2 (r cos t)^2 + c0 for r (quadratic in r)
        tt = th[hole]; a_ = c2 * np.cos(tt) ** 2; b_ = -np.sin(tt); cc = c0 - YC
        disc = np.maximum(b_ ** 2 - 4 * a_ * cc, 0)
        rr = np.where(np.abs(a_) > 1e-9, (-b_ - np.sqrt(disc)) / (2 * a_), -cc / b_)
        rr = np.where((rr > 0) & np.isfinite(rr), rr, r[hole])
        r[hole] = rr
        sk.rho[:, j] = r
    dth = th[1] - th[0]
    drho = np.gradient(sk.rho, dth, axis=0)
    ds = np.sqrt(sk.rho ** 2 + drho ** 2) * dth
    cum = np.concatenate([np.zeros((1, ds.shape[1])), np.cumsum(0.5 * (ds[1:] + ds[:-1]), axis=0)])
    c90 = np.array([np.interp(np.pi / 2, th, cum[:, j]) for j in range(cum.shape[1])])
    sk.u = c90[None, :] - cum
    sk._rho = RegularGridInterpolator((th, sk.z), sk.rho, bounds_error=False, fill_value=None)
    sk._u = RegularGridInterpolator((th, sk.z), sk.u, bounds_error=False, fill_value=None)
    return sk

def th_at_y_fit(sk, y, z, side=1, half=3.0):
    """theta where the skin is at height y on this wall, through a cubic fit of y(theta) over +-half degrees round the
    plain inversion (the old seam's closed groove leaves a ~0.05 mm residue that makes the plain inversion stick)"""
    t0 = th_at_y(sk, y, z, side)
    ths = t0 + np.radians(np.linspace(-half, half, 41))
    yy = xyz(sk, ths, np.full(len(ths), z))[:, 1]
    c = np.polyfit(ths - t0, yy, 3)
    r = np.roots(c - np.r_[0, 0, 0, y])
    r = r[np.isreal(r)].real; r = r[np.abs(r) < np.radians(half)]
    return float(t0 + r[np.argmin(np.abs(r))]) if len(r) else t0

def smooth_side(sk, z0=26.0, th0=8.0, th1=70.0, sig=(2.5, 2.0)):
    """a light 2D smoothing of rho(theta, z) over the side wall ahead of z0 (the closed seam's residue and local defects of
    the grey closing put ~0.1-0.3 mm steps into u there), then u and the interpolators rebuilt"""
    from scipy.ndimage import gaussian_filter
    from scipy.interpolate import RegularGridInterpolator
    th = sk.th; m_t = (th > np.radians(th0)) & (th < np.radians(th1)); m_z = sk.z > z0
    R = gaussian_filter(sk.rho, sig)
    W = np.outer(np.clip((th - np.radians(th0)) / np.radians(3), 0, 1) * np.clip((np.radians(th1) - th) / np.radians(3), 0, 1),
                 np.clip((sk.z - z0) / 2.0, 0, 1))
    sk.rho = sk.rho * (1 - W) + R * W
    dth = th[1] - th[0]
    drho = np.gradient(sk.rho, dth, axis=0)
    ds = np.sqrt(sk.rho ** 2 + drho ** 2) * dth
    cum = np.concatenate([np.zeros((1, ds.shape[1])), np.cumsum(0.5 * (ds[1:] + ds[:-1]), axis=0)])
    c90 = np.array([np.interp(np.pi / 2, th, cum[:, j]) for j in range(cum.shape[1])])
    sk.u = c90[None, :] - cum
    sk._rho = RegularGridInterpolator((th, sk.z), sk.rho, bounds_error=False, fill_value=None)
    sk._u = RegularGridInterpolator((th, sk.z), sk.u, bounds_error=False, fill_value=None)
    return sk
