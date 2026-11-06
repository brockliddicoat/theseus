"""S2's seam move on the 3D shell (F49.2 + F46.2): today's trigger/body seam carried onto S2's path (seam_path_v4.json: the
arch offset below the crown from the nose's flat lip back to K3 and the straight rear cutout), with rear_seam's machinery:
a displacement field over the skin in near-isometric surface coordinates (u, z) moves a band round the old seam (the gap,
its rounds, its occlusion) whole onto the new path and fades out harmonically, then ARAP so nothing folds; every vertex of
the triggers and the body moves at its own depth under the skin.

Changed from rear_seam / s1_seam: the polar axis is lower (YC 5, so the seam at the nose, y 10, is on the map), the domain
runs to the nose (Z_HI 57: ahead of z 55.5 the seam does not move), and the held region on the side walls is the side
buttons' top edges + 0.4 (rear_seam's) behind z 23.6 and, ahead of it, 2.5 mm under the lower of the old and new seams.

    import s2_seam; RS = s2_seam.install(); moved, info = RS.apply(meshes)
"""
import json, sys
import numpy as np
sys.path.insert(0, '/home/claude/theseus/3d/shell/tools'); sys.path.insert(0, '/home/claude/work/s2/scripts')
import rear_seam as RS

PATH = '/home/claude/work/s2/seam_path_v6.json'
Z_FRONT = 50.0          # the polar field's target joins today's seam here (easing over the 2 mm before); ahead of it s2_nose.py moves the seam section by section
Z_SPLIT = 13.0          # behind the arch: the corner region (paired by arc length)
UJ = 18.0               # |u| below which both seams lie on the straight cutout

def path_uz(skin):
    D = json.load(open(PATH)); P = np.array(D['path'])   # front ... centre, +X side
    zJ = D['J'][1]
    th = np.arctan2(P[:, 1] - RS.YC, P[:, 0])
    # on the arch (ahead of J) the design variable is the height: theta from Y (well conditioned on the steep wall, where
    # X hardly changes with height); in the corner and the cutout it is X (seen from above)
    import skin as SK
    arch = P[:, 2] > zJ + 1e-6
    th[arch] = [SK.th_at_y_fit(skin, y, z) for y, z in zip(P[arch, 1], P[arch, 2])]
    u = skin.u_at(th, P[:, 2])
    C = np.c_[np.abs(u), P[:, 2]]
    C, _ = RS.resample(C, 0.05)
    return C

_cache = {}
def new_curve(old, skin, sgn):
    oc, _ = RS.resample(old, 0.05)
    jf = int(np.argmax(oc[:, 1] < Z_FRONT))              # the old seam: front ... centre
    side_part = oc[: jf + 1]                             # unchanged (ahead of Z_FRONT)
    if 'new' not in _cache: _cache['new'] = path_uz(skin)
    new = _cache['new'].copy()
    # ease onto the old seam over the last mm before Z_FRONT in (u, z) (there the design and today's seam differ by < 0.2 mm)
    side_old = oc[(oc[:, 1] > Z_FRONT - 4) & (oc[:, 1] < Z_FRONT + 2)]; o = np.argsort(side_old[:, 1])
    m = new[:, 1] > Z_FRONT - 2.0
    w = np.clip((new[m, 1] - (Z_FRONT - 2.0)) / 2.0, 0, 1); w = w ** 3 * (10 - 15 * w + 6 * w * w)
    new[m, 0] = (1 - w) * new[m, 0] + w * np.interp(new[m, 1], side_old[o, 1], side_old[o, 0])
    new[0, 0] = oc[jf, 0]; new[0, 1] = oc[jf, 1]          # start exactly on the old seam
    new[-1, 0] = 0.0
    return side_part, new

def correspondence(old, new):
    oc, _ = RS.resample(old, 0.05)
    jf = int(np.argmax(oc[:, 1] < Z_FRONT))
    tail_old = oc[jf:]
    nc, _ = RS.resample(new, 0.05)
    src, dst = [], []
    # 1. the side (z from Z_FRONT back to Z_SPLIT): the same z
    k_os = int(np.argmax(tail_old[:, 1] < Z_SPLIT)); k_ns = int(np.argmax(nc[:, 1] < Z_SPLIT))
    side_new = nc[: k_ns + 1]; o = np.argsort(side_new[:, 1])
    for p in tail_old[:k_os]:
        src.append(p); dst.append(np.array([np.interp(p[1], side_new[o, 1], side_new[o, 0]), p[1]]))
    # 2. round the corner to |u| = UJ: normalised arc length on both
    k_old = k_os + int(np.argmax(tail_old[k_os:, 0] < UJ)); k_new = k_ns + int(np.argmax(nc[k_ns:, 0] < UJ))
    seg_o, so = RS.resample(tail_old[k_os: k_old + 1], 0.05); seg_n, sn = RS.resample(nc[k_ns: k_new + 1], 0.05)
    so_n = so / so[-1]; sn_n = sn / sn[-1]
    for p, s in zip(seg_o, so_n):
        src.append(p); dst.append(np.c_[np.interp(s, sn_n, seg_n[:, 0]), np.interp(s, sn_n, seg_n[:, 1])][0])
    # 3. the straight middle: stays (both at z = Z_CUT)
    zc = nc[-1, 1]
    for p in tail_old[k_old:]:
        src.append(p); dst.append(np.array([p[0], zc]))
    return np.array(src), np.array(dst)

def make_y_fix(skin):
    """held below: the side buttons' top edges + 0.4 behind z 23.6 (rear_seam's), and 2.5 mm under the lower seam ahead"""
    P = np.array(json.load(open(PATH))['path']); Pn = P[(P[:, 0] > 15)]
    c = np.load('/home/claude/work/s2/seam_ths_cloud.npy'); c = c[c[:, 0] > 15]
    zz = np.arange(-8, 60, 0.25)
    def lo(Q):
        out = []
        for z in zz:
            m = np.abs(Q[:, 2] - z) < 0.3
            out.append(Q[m, 1].min() if m.any() else np.nan)
        out = np.array(out); ok = np.isfinite(out); return np.interp(zz, zz[ok], out[ok])
    low = np.minimum(lo(Pn), lo(c)) - 2.5
    base = RS.y_fix
    def y_fix(z):
        z = np.asarray(z, float)
        b = base(z)
        f = np.interp(z, zz, low)
        w = np.clip((z - 20.0) / 3.6, 0, 1)            # hand over from the buttons' line to the seam's, z 20..23.6
        return np.minimum(b, f) * (1 - w) + f * w if False else np.where(z < 20.0, np.minimum(b, f), (1 - w) * np.minimum(b, f) + w * f)
    return y_fix

def install(path=None):
    global PATH
    if path: PATH = path
    RS.YC = 5.0; RS.Z_LO = -7.0; RS.Z_HI = 52.0
    import skin as SK
    if not getattr(RS.Skin, '_s2_filled', False):
        Base = RS.Skin
        class FilledSkin(Base):
            _s2_filled = True
            def __init__(self, meshes):
                super().__init__(meshes); SK.fill_opening(self); SK.smooth_side(self)   # u not inflated by the wheel opening, nor stepped by the closed seam's residue
        RS.Skin = FilledSkin
    RS.new_curve = new_curve
    RS.correspondence = correspondence
    _orig_field = RS.field
    def field(skin, curves):
        yf = make_y_fix(skin)
        RS.y_fix = yf
        # the centre ahead of the cutout (|u| < U_HOLD, z > Z_HOLD: the wheel opening and the split) is held: field() fixes
        # the cells whose height is under y_fix, so give those cells a y_fix above the crown
        U_HOLD, Z_HOLD = 10.0, 15.0
        th_c = lambda U, Z: skin.th_at(U, Z)
        orig_th_at = skin.th_at
        def th_at_flag(u, z):
            th = orig_th_at(u, z)
            u = np.atleast_1d(u); z = np.broadcast_to(np.atleast_1d(z), u.shape)
            hold = (np.abs(u) < U_HOLD) & (z > Z_HOLD)
            return np.where(hold, np.radians(1.0), th)        # below TH0: field() treats it as held
        skin.th_at = th_at_flag
        try:
            return _orig_field(skin, curves)
        finally:
            skin.th_at = orig_th_at
    RS.field = field
    return RS
