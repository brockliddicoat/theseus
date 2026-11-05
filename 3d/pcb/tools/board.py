# Theseus main PCB — board outline, holes and cutouts traced from the Sora V2 photo.
# Units: mm. LAYOUT frame (as the photo, a top view with the nose up): +x = user's right = image right,
# +z = forward (nose), board top copper at local y = 0. build_pcb.py mirrors x -> -x on export, giving the
# mouse/three.js frame of CONVENTIONS.md (+X = user's LEFT = side-button side, right-handed).
#
# Source: refs/photos/sora-v2-pcb-8.29g.jpg, de-rotated by 0.72 deg (the board sits 0.72 deg clockwise
# in the photo). Scale 15.15 px/mm, cross-checked against the USB-C shell (8.94 mm), the 2.0 mm pitch
# programming pads and the sensor pin pitch (+/-1.5 %). Board centre line at x = 476.5 px; the front
# edge of the USB-C tab (y = 306.5 px) is placed at mouse z = 52.5 mm so that the scroll wheel lands
# under the shell's wheel slot (scan: wheel centre at z ~ 38 mm).
import math
import deps  # noqa: F401  (stand-ins for packages this machine lacks: shim/README.md)
from shapely.geometry import Polygon, Point, box
from shapely import affinity

S, XC, YT, ZF = 15.15, 476.5, 306.5, 52.5


def P(px, py):
    """photo pixel (de-rotated) -> (x, z) mm in the mouse frame"""
    return ((px - XC) / S, ZF - (py - YT) / S)


def mirror_pts(half):
    """half = list of (dx_px, y_px) for the right side, front to back -> full symmetric polygon (px offsets)"""
    right = [(XC + dx, y) for dx, y in half]
    left = [(XC - dx, y) for dx, y in reversed(half)]
    return right + left


def sora_outline():
    """The Sora V2 PCB outline (symmetrised where left/right differ by < 0.2 mm; rear corners kept asymmetric)."""
    R = [
        (80.5, 306.5), (80.5, 348.0),            # USB-C tab, right side
        (128.0, 396.0), (133.0, 401.5),          # 45 deg chamfer down to the switch wing
        (288.25, 401.5),                          # wing front edge (corner rounded later)
        (288.25, 601.0), (234.5, 638.5),          # wing side, rear chamfer
        (233.5, 641.0), (233.5, 838.0),           # waist
        (290.5, 868.0), (292.75, 873.0),          # rear flare
        (292.75, 898.0), (280.5, 914.0),          # ear
        (280.5, 1110.0),                          # rear side
    ]
    right_rear = [  # rear-right corner bulge around the mounting hole (traced)
        (286.5, 1120), (286.5, 1144), (283.5, 1148), (278.5, 1150), (263.5, 1157), (243.5, 1167),
        (228.5, 1174), (223.5, 1177), (203.5, 1178), (198.5, 1178), (193.5, 1174), (188.5, 1170),
        (183.5, 1166), (178.5, 1162), (173.5, 1159), (168.5, 1158)]
    left_rear = [  # rear-left corner bulge (traced), listed right-to-left along the rear edge
        (-181.5, 1158), (-186.5, 1160), (-191.5, 1165), (-196.5, 1171), (-201.5, 1175), (-206.5, 1177),
        (-216.5, 1177), (-226.5, 1176), (-236.5, 1172), (-246.5, 1167), (-256.5, 1161), (-266.5, 1156),
        (-276.5, 1152), (-286.5, 1146), (-288.5, 1144), (-288.5, 1120), (-281.5, 1110)]
    L = [(-dx, y) for dx, y in reversed(R)]
    pts = [(XC + dx, y) for dx, y in R] + [(XC + dx, y) for dx, y in right_rear] + \
          [(XC + dx, y) for dx, y in left_rear] + [(XC + dx, y) for dx, y in L]
    poly = Polygon([P(*p) for p in pts])
    # routed-board corner treatment: concave corners get the router-bit radius, convex corners a small round
    poly = poly.buffer(0.5, join_style=1).buffer(-0.5, join_style=1)     # close: r 0.5 mm in concave corners
    poly = poly.buffer(-0.35, join_style=1).buffer(0.35, join_style=1)   # open: r 0.35 mm on convex corners
    # the wing's outer front corners are visibly rounder in the photo (r ~ 0.6 mm)
    return poly.simplify(0.004)


def filleted(corners):
    """closed polygon through corners [(x, z, r), ...] with a tangent arc of radius r at each corner (r = 0: sharp)"""
    import numpy as np
    pts = []
    n = len(corners)
    for i in range(n):
        p = np.array(corners[i][:2], float); r = corners[i][2]
        a = np.array(corners[i - 1][:2], float) - p; b = np.array(corners[(i + 1) % n][:2], float) - p
        la, lb = np.linalg.norm(a), np.linalg.norm(b)
        a, b = a / la, b / lb
        ang = math.acos(max(-1.0, min(1.0, float(a @ b))))
        if r <= 0 or ang > math.pi - 1e-6:
            pts.append(tuple(p)); continue
        d = r / math.tan(ang / 2)
        assert d < 0.5 * min(la, lb) + 1e-6 or d < min(la, lb), ('fillet too big at', corners[i])
        c = p + (a + b) / np.linalg.norm(a + b) * (r / math.sin(ang / 2))
        p1, p2 = p + a * d, p + b * d
        a1, a2 = math.atan2(p1[1] - c[1], p1[0] - c[0]), math.atan2(p2[1] - c[1], p2[0] - c[0])
        da = (a2 - a1 + math.pi) % (2 * math.pi) - math.pi          # the short way round
        k = max(2, int(abs(da) / math.radians(3)))                  # a vertex every 3 degrees
        for j in range(k + 1):
            t = a1 + da * j / k
            pts.append((c[0] + r * math.cos(t), c[1] + r * math.sin(t)))
    return Polygon(pts)


# The Theseus board (Brock, 2026-11-05 01:43, F26.5 and F26.7). Changed from the Sora V2 trace:
# - the wings come forward 2.77 mm (front edge z 46.23 -> 49.0) so the GT01s (top-front corner 8.24 mm ahead of the
#   middle pin, 3d/parts/gt01.js) sit over board everywhere;
# - the back is as wide as the front: both at x = +/-19.4 (they were 19.03 at the wings, 18.52 at the back), the small
#   notches (the "ears" at z 12.4 to 15.4) are gone and the sides run straight;
# - every corner is rounded: wing corners r 2.0 / 1.2, waist r 1.6, the USB-C tab r 0.6 / 0.8, the rear corners r 4.7;
# - the two rear mounting holes (MH3, MH4, unmoved) get 1.2 mm of board round their gold rings (was 0.53 below them).
THESEUS_RIGHT = [  # (x, z, fillet r) on the user's right, front to back (layout frame); mirrored for the left
    (5.31, 52.5, 0.6), (5.31, 49.76, 0.4), (6.07, 49.0, 0.6),   # USB-C tab (its 45 deg chamfer kept: CC1 runs along it)
    (19.4, 49.0, 2.0), (19.4, 32.4, 1.2),          # switch wing
    (15.41, 29.6, 1.6), (15.41, 17.42, 1.6),       # waist (the side-button space)
    (19.4, 15.3, 1.6), (19.4, -5.7, 4.7),          # the back: straight side, wide rounded corner round MH3/MH4
]


def theseus_outline():
    R = THESEUS_RIGHT
    L = [(-x, z, r) for x, z, r in reversed(R)]
    return filleted(R + L)


def rrect(cx, cz, w, h, r):
    b = box(cx - w / 2 + r, cz - h / 2 + r, cx + w / 2 - r, cz + h / 2 - r)
    return b.buffer(r, quad_segs=8) if r > 0 else box(cx - w / 2, cz - h / 2, cx + w / 2, cz + h / 2)


# --- holes and cutouts (from Hough circles / edge measurements on the de-rotated photo) ---
SORA_HOLES = {
    # name: (x, z, diameter, kind)
    'MH1': (-10.20, 29.56, 2.90, 'npth'),   # front-left mounting hole (white dashed silk ring in the photo)
    'MH2': (10.00, 29.43, 2.90, 'npth'),    # front-right
    'MH3': (-14.69, -2.25, 2.90, 'npth'),   # rear-left
    'MH4': (14.49, -2.25, 2.90, 'npth'),    # rear-right
    'LH1': (-10.59, -1.72, 2.20, 'npth'),   # locating holes (shell pins)
    'LH2': (10.40, -1.85, 2.20, 'npth'),
    'SH1': (-18.12, -2.25, 1.30, 'npth'),   # small holes at the rear corners
    'SH2': (17.92, -2.25, 1.30, 'npth'),
}
# wheel bay: x 370..588 px, y 408..686 px (front edge set 0.5 mm further back than the visible corners,
# where it is hidden under the wheel, so the USB-C signal pads have room)
WHEEL_CUT = dict(x0=-7.05, x1=7.35, z0=27.45, z1=44.95, r=1.2)
# square window (x 610..668, y 765..830 px) -> Theseus uses it as the power-switch window
SQUARE_CUT = dict(x0=8.81, x1=12.64, z0=17.95, z1=22.24, r=0.6)


def wheel_cut_poly():
    c = WHEEL_CUT
    return rrect((c['x0'] + c['x1']) / 2, (c['z0'] + c['z1']) / 2, c['x1'] - c['x0'], c['z1'] - c['z0'], c['r'])


def square_cut_poly():
    c = SQUARE_CUT
    return rrect((c['x0'] + c['x1']) / 2, (c['z0'] + c['z1']) / 2, c['x1'] - c['x0'], c['z1'] - c['z0'], c['r'])


# Sora V2 component boxes as seen in the photo (for the layout comparison image). (x0, z0, x1, z1) mm
def _bx(px0, py0, px1, py1):
    a = P(px0, py1); b = P(px1, py0)
    return (a[0], a[1], b[0], b[1])


SORA_PARTS = {
    'USB-C': _bx(419, 283, 555, 393),
    'SW L (Omron D2FP-FN2)': _bx(193, 401, 279, 603),
    'SW R (Omron D2FP-FN2)': _bx(680, 404, 766, 605),
    'Encoder (TTC)': _bx(296, 445, 368, 610),
    'Wheel support': _bx(578, 455, 680, 590),
    'Wheel': _bx(418, 355, 538, 700),
    'MCU nRF52840': _bx(432, 722, 528, 828),
    'Sensor PAW3395 + lens': _bx(395, 868, 552, 1136),
    'Side-btn conn.': _bx(292, 1028, 372, 1100),
    'Battery conn.': _bx(636, 990, 714, 1098),
    'RGB LED': _bx(560, 687, 588, 722),
    'Prog. pads': _bx(730, 872, 756, 994),
    'Edge part (switch?)': _bx(678, 760, 707, 832),
}


if __name__ == '__main__':
    o = sora_outline()
    print('outline area %.1f mm2, bounds %s' % (o.area, [round(v, 2) for v in o.bounds]))
