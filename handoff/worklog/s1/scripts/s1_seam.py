"""Phase 2 tooling: the rear cutout's corners on the 3D shell (S1, F43.2).

rear_seam.py moves the first build's seam onto a new path in near-isometric surface coordinates (u = arc length round the
cross-section from the top centre, z). Its own path (new_curve) lets the side seam climb to 30.5 mm and meet the cutout on
a 2 mm circular corner, which from above is the long sweep Brock rejected. This replaces new_curve with S1's path: the side
seam straight back along the side wall, 1.2 mm in from the outline (seen from above), into a G2 corner (corners.py: K1, K2
or K3) and the straight cutout at z = 4.84. The path is designed from above (X, Z) and mapped onto the skin: for each point
the angle round the section where the skin is at that X (on the upper wall), then u. Everything else (the displacement
field, the band, ARAP, the normals, the fixed region under the side buttons) is rear_seam's.

    import s1_seam; s1_seam.install('K2')     # before rear_seam.apply(); then one_seam's flow as usual
"""
import sys
import numpy as np
sys.path.insert(0, '/home/claude/theseus/3d/shell/tools'); sys.path.insert(0, '/home/claude/work/s1/scripts')
import rear_seam as RS
from geo_options import option_rear

Z_JOIN = 24.0          # the side seam is the old lip seam ahead of here (rear_seam leaves z > 26 untouched)

def xz_to_u(skin, sgn, X, Z):
    """(X, Z) seen from above -> |u| on this side's upper wall (between its widest point and the top centre)"""
    out = []
    th = skin.th
    for x, z in zip(np.atleast_1d(X), np.atleast_1d(Z)):
        rr = skin.rho_at(th, np.full(len(th), z)); xs = rr * np.cos(th)
        if sgn > 0:
            m = th <= np.pi / 2; tt, xx = th[m], xs[m]
            iw = np.argmax(xx); tt, xx = tt[iw:], xx[iw:]                 # from the widest point (largest x) to the top
            t = np.interp(-abs(x), -xx, tt)                                # xx falls as theta rises
        else:
            m = th >= np.pi / 2; tt, xx = th[m], -xs[m]
            iw = np.argmax(xx); tt, xx = tt[:iw + 1][::-1], xx[:iw + 1][::-1]
            t = np.interp(-abs(x), -xx, tt)
        out.append(abs(float(skin.u_at(np.array([t]), np.array([z]))[0])))
    return np.array(out)

def make_new_curve(kind):
    def new_curve(old, skin, sgn):
        oc, _ = RS.resample(old, 0.05)
        jb = int(np.argmax(oc[:, 1] < Z_JOIN))
        side_part = oc[: jb + 1]
        P, c = option_rear(kind)                       # scene (X, Z) for the +X trigger: z from 24 down, the corner, the cutout
        P = P[P[:, 1] <= oc[jb, 1] + 1e-9]
        if sgn < 0: P = np.c_[-P[:, 0], P[:, 1]]
        us = xz_to_u(skin, sgn, P[:, 0], P[:, 1])
        us += oc[jb, 0] - us[0]                         # starts exactly on the old seam (the two descriptions differ by ~0.1 mm)
        tail = np.c_[us, P[:, 1]]
        tail[-1, 0] = 0.0
        tail, _ = RS.resample(tail, 0.05)
        return side_part, tail
    return new_curve

Z_SPLIT = 11.5        # ahead of here both seams run along the side wall: old and new points are paired at the same z

def correspondence(old, new_tail):
    """old seam points behind the junction -> the new path: along the side by z (so nothing slides along the seam near the
    junction, where rear_seam's arc-length pairing pushed points 2 mm forward next to a held point and folded the map);
    from Z_SPLIT round the corner to |u| = UJ by normalised arc length; the straight middle by a pure shift in z"""
    oc, _ = RS.resample(old, 0.05)
    jb = int(np.argmax(oc[:, 1] < Z_JOIN))
    tail_old = oc[jb:]
    UJ = 12.0
    nc, _ = RS.resample(new_tail, 0.05)
    src, dst = [], []
    # 1. the side: same z
    k_os = int(np.argmax(tail_old[:, 1] < Z_SPLIT)); k_ns = int(np.argmax(nc[:, 1] < Z_SPLIT))
    side_new = nc[: k_ns + 1]; o = np.argsort(side_new[:, 1])
    for p in tail_old[:k_os]:
        src.append(p); dst.append(np.array([np.interp(p[1], side_new[o, 1], side_new[o, 0]), p[1]]))
    # 2. round the corner: arc length from Z_SPLIT to UJ on both
    k_old = int(np.argmax(tail_old[:, 0] < UJ)); k_new = int(np.argmax(nc[:, 0] < UJ)) if (nc[:, 0] < UJ).any() else len(nc) - 1
    seg_o, so = RS.resample(tail_old[k_os: k_old + 1], 0.05); seg_n, sn = RS.resample(nc[k_ns: k_new + 1], 0.05)
    so_n = so / so[-1]; sn_n = sn / sn[-1]
    for p, s in zip(seg_o, so_n):
        src.append(p); dst.append(np.c_[np.interp(s, sn_n, seg_n[:, 0]), np.interp(s, sn_n, seg_n[:, 1])][0])
    # 3. the straight middle
    for p in tail_old[k_old:]:
        src.append(p); dst.append(np.array([p[0], RS.Z_NEW]))
    return np.array(src), np.array(dst)

def install(kind, band=None):
    if band is not None: RS.BAND = band
    RS.new_curve = make_new_curve(kind)
    RS.correspondence = correspondence
    return RS
