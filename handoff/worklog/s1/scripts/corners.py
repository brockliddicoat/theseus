"""The rear cutout's corners, seen from above (mouse top view, scene X = the user's left, Z = nose; the left corner, +X).

The straight cutout runs along Z = Z_CUT out to the corner; the side seam comes back along the side wall at a constant
inset from the true outline (the 3D body's), i.e. at about one height on the wall. Each corner is a quintic Bezier whose
first three control points lie on the cutout line and last three on the side seam's line, so its curvature is zero at
both ends (G2 with both straights: no kink, no curvature jump) and rises smoothly to one peak (the minimum radius).

    corner(kind) -> dict(pts=[[X, Z], ...], rmin, span_x, span_z, ...)
"""
import json, sys
import numpy as np
sys.path.insert(0, '/home/claude/work/s1/scripts')
from math import comb

Z_CUT = 4.8418

def bez(P, n=400):
    P = np.asarray(P, float); m = len(P) - 1; t = np.linspace(0, 1, n)[:, None]
    B = sum(comb(m, i) * (1 - t) ** (m - i) * t ** i * P[i] for i in range(m + 1))
    return B

def curvature(C):
    d1 = np.gradient(C, axis=0); d2 = np.gradient(d1, axis=0)
    return (d1[:, 0] * d2[:, 1] - d1[:, 1] * d2[:, 0]) / np.maximum(np.hypot(d1[:, 0], d1[:, 1]) ** 3, 1e-12)

def outline_x(z, side=1):
    """the 3D body's half-width at Z (top view, from the shell twin), for the seam's inset"""
    O = json.load(open('/home/claude/work/s1/body_halfwidth.json'))
    return np.interp(z, O['z'], O['x'])

# the three options and the two references (distances in mm from the corner apex K along each straight:
# cutout side (toward the centre) d = [d0, d1, d2], seam side (forward) e = [e0, e1, e2])
INSET = 1.2                        # the side seam's inset from the outline, seen from above (mm)
KINDS = {
    # control points evenly spaced on each straight (D, 2D/3, D/3): one smooth curvature peak (G2, nearly G3 looking)
    'K1': dict(name='Tight', inset=INSET, d=[2.0, 1.333, 0.667], e=[2.0, 1.333, 0.667]),
    'K2': dict(name='Your proportions, made smooth', inset=INSET, d=[3.0, 2.0, 1.0], e=[3.0, 2.0, 1.0]),
    'K3': dict(name='Flowing', inset=INSET, d=[3.2, 2.133, 1.067], e=[7.0, 4.667, 2.333]),
}

def corner(kind, z_cut=Z_CUT):
    k = KINDS[kind]
    # the side seam's straight: the outline's local direction over z 5..16, moved in by the inset
    zz = np.linspace(5, 16, 23); xo = outline_x(zz)
    a, b = np.polyfit(zz, xo, 1)                    # x = a z + b (outline), the seam parallel to it
    xs = lambda z: a * z + b - k['inset']
    K = np.array([xs(z_cut), z_cut])                # the corner apex: where the two straights meet
    t2 = np.array([a, 1.0]); t2 /= np.linalg.norm(t2)          # forward along the seam
    t1 = np.array([1.0, 0.0])                                  # outward along the cutout (+X)
    d, e = k['d'], k['e']
    P = [K - d[0] * t1, K - d[1] * t1, K - d[2] * t1, K + e[2] * t2, K + e[1] * t2, K + e[0] * t2]
    C = bez(P)
    kap = curvature(C)
    rmin = 1 / np.abs(kap).max()
    return dict(kind=kind, name=k['name'], ctrl=np.array(P).round(4).tolist(), pts=C, kappa=kap, rmin=rmin, K=K, t2=t2, inset=k['inset'],
                seam_x=xs, span_x=float(C[:, 0].max() - C[:, 0].min()), span_z=float(C[:, 1].max() - C[:, 1].min()))

if __name__ == '__main__':
    for kk in KINDS:
        c = corner(kk)
        print('%s %-20s rmin %.2f mm  span x %.2f z %.2f  apex K (%.2f, %.2f)' % (kk, c['name'], c['rmin'], c['span_x'], c['span_z'], *c['K']))
