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


# ===================================================================== the Theseus board: plan 5 (Brock, 2026-11-05)
# Plan 5 (3d/pcb/plans/plan5.py, board-plan-5.jpg, Brock's OK on 2026-11-05 07:1x) with his last changes (F30.25): the
# rear notch as long as the side notches, the wheel bay chamfered and filleted like the outline, then built. In short:
# - one mirrored outline (the whole footprint symmetric, F30.23): one half drawn, the other its mirror image;
# - one notch depth D = 3.61 mm (the waist notches': 19.03 - 15.42) for the side notches, the rear notch and the front
#   trapezoid (F30.22); one chamfer angle, 35.24 deg from the x axis (atan 0.70656, the front waist chamfer's line,
#   F30.22), every chamfer straight; every corner filleted so the fillet starts 1.0 mm from its corner (equal tangent
#   length: the same apparent size everywhere, F30.21): r 1.0 at a right angle, 1.93 and 3.15 at the chamfers;
# - the front: one trapezoid D above the wing line (z 47.84 = the GT01 pin 39.60 + its 8.24 overhang, F30.11), its flat
#   edge at z 51.45, no tab (F30.21);
# - the rear notch as long as the side notches (F30.25): its flat 13.09 mm (x +-6.545), the rear lobes D deep to z -7.61;
# - the wheel bay centred on x 0 (+-7.20, F30.23), its front at z 44.13 (the USB-C receptacle moved back 1.05 mm, F30.25),
#   each corner chamfered at the one angle (3.61 across, 2.55 along: the waist's chamfer) and filleted the same way, with
#   a 0.35 mm gold trim (F30.21, F30.25);
# - the mounting holes in mirror pairs (F30.25), SH1, SH2, LH1, LH2 dropped, no new cut-outs (F30.13, F30.16, F30.19);
# - the power switch: variant A in a 3.83 x 4.29 window on the x +10.0 axis (the default, the deck's board), variant B
#   at the right waist edge (PCB_VARIANT=B), no window (F30.17, F30.19).
import os
VARIANT = (os.environ.get('PCB_VARIANT') or 'A').strip().upper()
T_FIL = 1.0                                   # every fillet starts this far from its corner
W, WX = 19.03, 15.42                          # the sides, the waist (side-notch bottom)
D = round(W - WX, 2)                          # 3.61: the one notch depth
TA = 0.70656                                  # tan of the one chamfer angle (35.24 deg from the x axis)
SW_PIN_Z, GT_CORNER = 39.60, 8.24             # the GT01's middle pin and how far its top-front corner overhangs it
ZF = round(SW_PIN_Z + GT_CORNER, 2)           # 47.84: the wing line
ZT = round(ZF + D, 2)                         # 51.45: the front trapezoid's flat edge
XT = 5.85                                     # its half width
WAIST = (30.52, 17.43)                        # the side notches' flat, z
ZN = -4.0                                     # the rear notch's flat
ZB = round(ZN - D, 2)                         # -7.61: the rear lobes' back edge
XN = round((WAIST[0] - WAIST[1]) / 2, 4)      # 6.545: the rear notch as long as the side notches (F30.25)
XB = round(XN + D / TA, 4)                    # 11.6543
ZA, ZBW = round(WAIST[0] + D * TA, 4), round(WAIST[1] - D * TA, 4)   # where the waist chamfers meet the sides


def tangent_r(p, a, b, t=T_FIL):
    """the radius whose fillet at corner p (neighbours a, b) starts t from p: equal tangent length, equal apparent size"""
    import numpy as np
    u = np.subtract(a, p, dtype=float); v = np.subtract(b, p, dtype=float)
    u /= np.linalg.norm(u); v /= np.linalg.norm(v)
    return t * math.tan(math.acos(max(-1.0, min(1.0, float(u @ v)))) / 2)


def equal_fillets(pts, t=T_FIL, closed=True):
    """[(x, z)] -> [(x, z, r)] with every corner filleted at tangent length t"""
    n = len(pts)
    return [(x, z, tangent_r((x, z), pts[i - 1], pts[(i + 1) % n], t)) for i, (x, z) in enumerate(pts)]


PLAN5_RIGHT = [  # the user's right half (layout x >= 0), front to back; the left half is its mirror image
    (XT, ZT), (XT + D / TA, ZF), (W, ZF), (W, ZA), (WX, WAIST[0]), (WX, WAIST[1]), (W, ZBW), (W, ZB), (XB, ZB), (XN, ZN)]


def theseus_outline():
    pts = [(0.0, ZT)] + PLAN5_RIGHT + [(0.0, ZN)]
    full = pts[1:-1] + [(-x, z) for x, z in reversed(pts[1:-1])]       # mirrored: x -> -x, the order reversed
    corners = equal_fillets(full)
    return filleted(corners)


def rrect(cx, cz, w, h, r):
    b = box(cx - w / 2 + r, cz - h / 2 + r, cx + w / 2 - r, cz + h / 2 - r)
    return b.buffer(r, quad_segs=8) if r > 0 else box(cx - w / 2, cz - h / 2, cx + w / 2, cz + h / 2)


# --- holes and cut-outs (plan 5) ---
SORA_HOLES = {      # (the name is the Sora V2 trace's; these are the plan-5 holes, in mirror pairs: F30.25)
    # name: (x, z, diameter, kind)
    'MH1': (-10.10, 29.50, 2.90, 'npth'),   # front pair: copper-free, dashed silk rings (as on the Sora V2)
    'MH2': (10.10, 29.50, 2.90, 'npth'),
    'MH3': (-14.59, -2.25, 2.90, 'npth'),   # rear pair: plated, gold rings (layout.py marks them plated)
    'MH4': (14.59, -2.25, 2.90, 'npth'),
}
SORA_HOLES_TODAY = {'MH1': (-10.20, 29.56), 'MH2': (10.00, 29.43), 'MH3': (-14.69, -2.25), 'MH4': (14.49, -2.25)}
BAY = dict(x0=-7.20, x1=7.20, z0=27.45, z1=44.13)     # centred on x 0 (F30.23); front 44.13 (J1 back 1.05 mm, F30.25)
BAY_CH = (D, round(D * TA, 4))                        # each corner chamfer: 3.61 across, 2.55 along (the waist's)
BAY_TRIM = 0.35                                       # gold trim round the bay: the board edge's ENIG band (F30.21)
WHEEL_CUT = dict(x0=BAY['x0'], x1=BAY['x1'], z0=BAY['z0'], z1=BAY['z1'], r=T_FIL)
WIN = dict(c=(10.0, 19.45), w=3.83, h=4.29)          # variant A's power-switch window, on the x +10 axis, the sensor's row
SQUARE_CUT = dict(x0=WIN['c'][0] - WIN['w'] / 2, x1=WIN['c'][0] + WIN['w'] / 2, z0=WIN['c'][1] - WIN['h'] / 2,
                  z1=WIN['c'][1] + WIN['h'] / 2, r=T_FIL)


def bay_points():
    x0, x1, z0, z1 = BAY['x0'], BAY['x1'], BAY['z0'], BAY['z1']; cx, cz = BAY_CH
    return [(x0 + cx, z1), (x1 - cx, z1), (x1, z1 - cz), (x1, z0 + cz), (x1 - cx, z0), (x0 + cx, z0), (x0, z0 + cz), (x0, z1 - cz)]


def wheel_cut_poly():
    """the wheel bay: a rectangle with its corners chamfered at the one angle, every corner filleted at tangent 1.0"""
    return filleted(equal_fillets(bay_points()))


def square_cut_poly():
    """variant A's power-switch window (r 1.0, a right angle: tangent 1.0); variant B has none (an empty polygon)"""
    if VARIANT == 'B':
        return Polygon()
    c = SQUARE_CUT
    return rrect((c['x0'] + c['x1']) / 2, (c['z0'] + c['z1']) / 2, c['x1'] - c['x0'], c['z1'] - c['z0'], c['r'])


# The battery in the tail behind the board, its middle 7.46 mm over the pad (0.43 mm above the board's top level when it
# was 4.0 thick). Layout frame (x right, z nose; mouse z = z - 2.88).
# History: the key plan's old place had its front at layout z -7.34; H1 (2026-11-06, the 2026-11-05 decision) moved it
# 2.23 mm back (front -9.57). F42.1 (Brock, "Forward and up": the balance at the mouse's centre) asked for H1's model's
# answer, about 5.9 mm forward and 1.5 mm up over the board's rear edge. H2 corrected that model (balance.py: the board's
# screws at its holes, not at the optional plate's; the bare board at its core's centroid; the encoder and support inside
# the board's 5.6 g target) and, at the integrator's request (10:1x), added the two side switches (F44.2, out of the shell's
# allowance) and the four boss posts the board hangs from (#54, an ESTIMATE until the 3D shell has them): with Jauch's
# 8 g LP402535JU the centre of mass landed at mouse z 0 with the battery's front at layout z -11.60 (2.03 mm behind H1's
# place), at the same height (no rise).
# H5 (2026-11-06, F64.11: Brock moved Theseus to EEMB's 300 mAh LP402535, about 6.40 g, at 17:08-17:10; then, asked whether
# to move it back to re-centre the balance, "Move it back (Recommended)"): the pack is read from research/data/batteries.json
# (its eemb_lipo row: mass and box, one place), 37.0 across x (the product page's length, the larger of EEMB's two: the
# specification's maximum is 36, the page's 37.00 probably counts the tabs), 25.5 along z, 4.3 thick (the specification's
# maximums). Its place: where balance.py (H2's corrected model, the board as built by H3, the deck's 27.71 g budget) puts the
# centre of mass at mouse z 0, BATT_ZC below; clear of the shell's tail by H5's check (tools/clear.py). x as before (its
# middle 0.41 mm to the user's right of the centre line); yMid as before (no rise, F42.1 as corrected).
import json as _json
_RD = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..', 'research', 'data', 'batteries.json'))


def pack(part):
    """a battery's row from research/data/batteries.json: {part, maker, g, mAh, w (width), l (length), t (thickness)}"""
    D = _json.load(open(_RD))
    for k in ('eemb_lipo', 'jauch_lipo_family'):
        for r in (D.get(k) or {}).get('rows', []):
            if r.get('part') == part:
                v = lambda x: x['value'] if isinstance(x, dict) else x
                return dict(part=part, maker=r.get('maker'), g=v(r['mass']), mAh=v(r['capacity']), w=r.get('width_mm'),
                            l=r.get('length_mm'), t=r.get('thickness_mm'))
    raise KeyError('no battery %r in %s' % (part, _RD))


PACK = pack('LP402535')                       # THESEUS.pack (deck/src/05-data.js): EEMB's, Brock 17:08-17:10
BATT_XC, BATT_YMID = 0.41, 7.46               # its middle across (layout x) and over the pad (mouse y), as H2 left them
BATT_ZC = -31.44                              # its middle along (layout z; mouse z = BATT_ZC - 2.88): H5, balance.py's z 0
BATTERY = dict(part=PACK['part'], maker=PACK['maker'], x0=round(BATT_XC - PACK['l'] / 2, 3), x1=round(BATT_XC + PACK['l'] / 2, 3),
               z0=round(BATT_ZC - PACK['w'] / 2, 3), z1=round(BATT_ZC + PACK['w'] / 2, 3), t=PACK['t'], yMid=BATT_YMID, g=PACK['g'])


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
