"""The options' geometry in the scene frame (X = the user's left, Z = nose), from the 3D shell's twin.

Rear corners: the left trigger's top-view ring with its rear (side seam from z 24 back, the corner, the straight cutout)
replaced by an option's curve. Wheel openings: outlines round the wheel."""
import json, sys
import numpy as np
from scipy.ndimage import gaussian_filter1d
sys.path.insert(0, '/home/claude/work/s1/scripts')
from topgeo import ring
from corners import corner, KINDS, Z_CUT, bez, curvature

XC = 0.125                        # half the centre split
TODAY_L = ring('explodeL/triggerL/Group/triggerL')          # scene (X, Z)

def smoothstep(t):
    t = np.clip(t, 0, 1); return t * t * (3 - 2 * t)

def today_outer():
    """today's side seam seen from above (the left trigger's outer edge), front (z 28) to back, smoothed"""
    T = TODAY_L
    idx = list(range(97, 149)) + [0, 1]
    P = T[idx]
    return P

def today_trace_x(z):
    P = today_outer(); o = np.argsort(P[:, 1])
    zs, xs = P[o, 1], P[o, 0]
    xs = gaussian_filter1d(xs, 2)
    return np.interp(z, zs, xs)

def option_rear(kind, z_join=(14.0, 24.0), n=200):
    """the left trigger's rear edge for a corner option, from z = z_join[1] on the side seam, down, round the corner and
    along the straight cutout to the split: [[X, Z], ...] (scene)"""
    c = corner(kind)
    C = c['pts']                                  # cutout side first (toward the centre) ... seam side last
    seam_end = C[-1]                              # where the corner meets the side seam's straight
    zz = np.linspace(z_join[1], seam_end[1], n)
    w = smoothstep((z_join[1] - zz) / (z_join[1] - z_join[0]))
    xs = (1 - w) * today_trace_x(zz) + w * c['seam_x'](zz)
    side = np.c_[xs, zz]
    cut = np.c_[np.linspace(C[0][0], XC, 120), np.full(120, Z_CUT)]
    return np.vstack([side, C[::-1][1:], cut[1:]]), c

def today_rear():
    T = TODAY_L
    idx = [i for i in list(range(97, 149)) + list(range(0, 15)) if T[i][1] <= 24.3]
    return T[idx]

def brock_rear():
    D = json.load(open('/home/claude/work/s1/markup_digitised.json'))
    MSK = (62.5 / 62.38, 119.2 / 118.99)
    L = np.array(D['curves']['left']['mm']); R = np.array(D['curves']['right']['mm'])
    # kit mm (x = the user's right, y = -Z) -> scene: X = -x / MSK.x, Z = -y / MSK.y
    toS = lambda C: np.c_[-C[:, 0] / MSK[0], -C[:, 1] / MSK[1]]
    return toS(L), toS(R)

# ---------------------------------------------------------------- wheel openings
WHEEL = dict(c=(17.03, 34.87), R=11.37, w=7.0)          # shell meta: centre (y, z), radius, width
SORA_OPEN = dict(x=4.7, z0=28.4, z1=46.4)               # the scan's opening (3d/shell/README.md)

def rrect(x0, z0, x1, z1, r, n=24):
    """a rounded rectangle [X0..X1] x [Z0..Z1], corner radius r, as a closed ring (scene X, Z), counter-clockwise"""
    pts = []
    for (cx, cz, a0) in [(x1 - r, z0 + r, -90), (x1 - r, z1 - r, 0), (x0 + r, z1 - r, 90), (x0 + r, z0 + r, 180)]:
        for a in np.linspace(a0, a0 + 90, n):
            pts.append([cx + r * np.cos(np.radians(a)), cz + r * np.sin(np.radians(a))])
    return np.array(pts)

def chamfered(x0, z0, x1, z1, cx, cz, r, n=12):
    """a rectangle with its four corners chamfered (legs cx across, cz along) and every corner filleted r with equal
    tangent lengths, the board bay's language (plan 5, F30.21/F30.25)"""
    base = [[x1 - cx, z0], [x1, z0 + cz], [x1, z1 - cz], [x1 - cx, z1], [x0 + cx, z1], [x0, z1 - cz], [x0, z0 + cz], [x0 + cx, z0]]
    P = np.array(base, float); out = []
    m = len(P)
    for i in range(m):
        a, b, c = P[i - 1], P[i], P[(i + 1) % m]
        u = (a - b) / np.linalg.norm(a - b); v = (c - b) / np.linalg.norm(c - b)
        ang = np.arccos(np.clip(np.dot(u, v), -1, 1)); tl = r / np.tan(ang / 2)
        p0 = b + u * tl; p1 = b + v * tl
        bis = (u + v) / np.linalg.norm(u + v); C = b + bis * (r / np.sin(ang / 2))
        a0 = np.arctan2(*(p0 - C)[::-1]); a1 = np.arctan2(*(p1 - C)[::-1]); da = (a1 - a0 + np.pi) % (2 * np.pi) - np.pi
        for t in np.linspace(0, 1, n): out.append(C + r * np.array([np.cos(a0 + da * t), np.sin(a0 + da * t)]))
    return np.array(out)
