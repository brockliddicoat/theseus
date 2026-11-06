"""S2 nose candidates, side view y(z) on the +X side: the arch (v5 offset) to Z_A, then one G2 quintic down onto the flat
front cutout (y 10.0, #46) at Z_L, flat to the tip. Z_L = 56.17 is where the flat must start for the lip to keep today's
1.37 mm (|x| <= 16.35); the family varies Z_A (how far back the bend starts). to_phi() turns a side-view design into the
nose chart's y(phi) on a VSkin."""
import sys, json
import numpy as np
sys.path.insert(0, '/home/claude/work/s2/scripts')
import front as FR
Z_L, Y_L = 56.17, 10.0
def design(z_a, z_l=Z_L):
    fa = FR.arch_side(); d1, d2 = FR.deriv(fa, z_a)
    g = FR.hermite5(z_a, z_l, (float(fa(z_a)), d1, d2), (Y_L, 0.0, 0.0))
    return lambda z: np.where(np.asarray(z) < z_a, fa(z), np.where(np.asarray(z) > z_l, Y_L, g(np.minimum(z, z_l))))
def stats(f, z0=28.0, z1=59.0):
    z = np.arange(z0, z1, 0.02); y = f(z)
    d1 = np.gradient(y, z); d2 = np.gradient(d1, z); k = d2 / (1 + d1 ** 2) ** 1.5
    m = (z < Z_L - 0.05)
    kk = np.abs(k[m]); i = np.argmax(kk)
    # sign changes of curvature (bends) ahead of 30
    s = np.sign(np.round(k[(z > 30) & m], 4)); s = s[s != 0]; flips = int((np.diff(s) != 0).sum())
    return dict(r_min=round(1 / kk.max(), 1), at_z=round(float(z[m][i]), 2), flips=flips)
def to_phi(sk, f, PHG, y_flat=Y_L, it=30):
    """the 3D seam on the skin: for each phi, the height y with y = f(z_skin(phi, y)) (fixed point), flat y_flat where the
    skin at y_flat is ahead of Z_L"""
    out = np.empty(len(PHG))
    for k, p in enumerate(PHG):
        y = y_flat
        for _ in range(it):
            z = sk.xyz(p, y)[0, 2]; yn = float(f(z))
            if abs(yn - y) < 1e-5: break
            y = 0.5 * y + 0.5 * yn
        out[k] = y
    return out
if __name__ == '__main__':
    fC, _ = FR.design_C()
    print('C', stats(fC))
    fa = FR.arch_side()
    for za in (30.0, 34.0, 38.0, 42.0, 46.0):
        f = design(za)
        st = stats(f)
        dip = max(float(fa(z) - f(z)) for z in np.arange(za, 50, 0.1))
        print('z_a %.0f' % za, st, 'max below the arch offset %.2f' % dip, ' y@50 %.2f @52 %.2f @54 %.2f @55 %.2f' % tuple(float(f(z)) for z in (50, 52, 54, 55)))
