"""Feature definitions for the Sora-base / Theseus shell: seams, openings, outlines, positions.
All in mm, scan frame: +X = side-button side (the user's LEFT; see README handedness note), +Y up, +Z forward.
variant: 'sora' (faithful scan seams) or 'theseus' (gestures #17 straight rear cutouts, #58 no split ahead of wheel,
#29 side-button divider, #46 flat front cutouts)."""
import json, numpy as np
from scipy.interpolate import UnivariateSpline

W = '/home/claude/theseus/3d/shell/work/'
_sf = json.load(open(W + 'seam_fits.json'))

# ---------------- global numbers
Y_BASE = 0.65          # bottom face of the shell (dot skates 0.65 mm tall below it, #10 / Brock: 0.65 mm optimal)
GAP = 0.25             # seam width between parts (fine dark line)
R_EDGE = 0.28          # rounding of part edges at seams
T_BODY = 1.2           # wall thickness, body
T_TRIG = 1.4           # wall thickness, triggers
W_RIM = 3.2            # bottom rim (flange) width
Y_FLANGE = Y_BASE + 1.2

# wheel (fitted to the scan: circle in YZ through the tread crests)
WHEEL = dict(center=[0.0, 17.03, 34.87], diameter=22.74, width=7.0)
WHEEL_OPEN = dict(hx=4.7, z0=28.4, z1=46.4, r=1.2)     # opening in the triggers (rounded rect, XZ)

# side buttons (+X side), outlines traced from the scan groove field, (z, y) corners: front-low, front-high, rear-high, rear-low
SB_SORA = [
    dict(name='sideFront', poly=[(23.6, 16.0), (23.6, 20.3), (8.1, 23.9), (8.1, 18.4)], r=1.6),
    dict(name='sideRear', poly=[(5.8, 19.4), (5.8, 24.6), (-9.9, 25.9), (-9.9, 20.2)], r=1.4),
]
# Theseus: same buttons, gap widened to 3.6 mm for a raised divider (#29)
SB_THESEUS = [
    dict(name='sideFront', poly=[(23.6, 16.0), (23.6, 20.3), (8.8, 23.75), (8.8, 18.55)], r=1.6),
    dict(name='sideRear', poly=[(5.2, 19.45), (5.2, 24.65), (-9.9, 25.9), (-9.9, 20.2)], r=1.4),
]
SB_PROUD = 0.45        # how far the buttons stand proud of the skin
SB_DEPTH = 2.2         # button thickness below the skin
DIVIDER = dict(z0=5.2, z1=8.8, proud=1.05)

USB = dict(cx=0.0, cy=5.25, hw=5.7, hh=3.25, r=1.4, depth=1.3)        # recess in the front wall
USBC = dict(w=8.94, h=3.26, depth=6.0, wall=0.22, tongue=(6.69, 0.7))  # receptacle (USB-IF nominal)

SIDE_DECAL = dict(center=[29.2, 11.6, 41.0], height=5.2)               # Sora 空 location (raycast from RTINGS photo)


def hump_z(x, variant):
    x = np.asarray(x, float)
    if variant == 'theseus':
        # #17: straightened rear trigger cutout; a very slight curve (0.45 mm over the half-width) keeps it from reading concave
        return 6.0 + 0.00055 * x ** 2
    c = _sf['hump_coeffs']
    xx = np.minimum(np.abs(x), 29.0)
    return c[0] + c[1] * xx ** 2 + c[2] * xx ** 4 + c[3] * xx ** 6


def hump_dz(x, variant, eps=1e-3):
    return (hump_z(np.asarray(x) + eps, variant) - hump_z(np.asarray(x) - eps, variant)) / (2 * eps)


# lip / side seam: y = s(phi), phi = atan2(x, z - ZC) in degrees (ZC = 10, the parametrisation in which the traced
# seam is single-valued: see work/seam_scatter.png), symmetric.
ZC = _sf['zc']
_py = np.array(_sf['lip_phi_y'])
_m = (_py[:, 0] > 3) & (_py[:, 0] < 101)
_ph, _yy = _py[_m, 0], _py[_m, 1]
_FLAT = 18.0
_keep = _ph >= _FLAT
_ph = np.r_[np.arange(0, _FLAT, 1.0), _ph[_keep]]
_yy = np.r_[np.full(int(_FLAT), 10.0), _yy[_keep]]
_spl = UnivariateSpline(_ph, _yy, k=3, s=len(_ph) * 0.03)


def lip_y(phi_deg):
    a = np.abs(np.asarray(phi_deg, float))
    # beyond the hump-seam junction (~100 deg) the trigger is bounded by the hump seam: hold the seam height
    y = _spl(np.minimum(a, 101))
    # #46 flat front trigger cutouts: exactly 10.0 across the nose, blended in over 18..26 deg
    t = np.clip((a - _FLAT) / 8.0, 0, 1); t = t * t * (3 - 2 * t)
    return np.where(a < 26, 10.0 * (1 - t) + _spl(np.clip(a, _FLAT, 101)) * t, y)


def lip_sdf(P):
    """Signed distance-ish to the lip/side seam sheet: negative ABOVE the seam (trigger side)."""
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    phi = np.degrees(np.arctan2(x, z - ZC))
    rho = np.hypot(x, z - ZC) + 1e-6
    s = lip_y(phi)
    e = 0.05
    ds = (lip_y(phi + e) - lip_y(phi - e)) / (2 * e) * (180 / np.pi) / rho  # dy per mm along the perimeter
    # cap the slope used for the distance normalisation: near the ZC axis (top centre) the angular slope explodes
    # although the seam is centimetres away there; the real seam is never steeper than ~1 mm/mm
    return (s - y) / np.sqrt(1 + np.minimum(ds * ds, 2.25))


def hump_sdf(P, variant):
    """negative FORWARD of the hump seam (trigger side)."""
    x, z = P[:, 0], P[:, 2]
    return (hump_z(x, variant) - z) / np.sqrt(1 + hump_dz(x, variant) ** 2)


def lip_gap(P):
    """seam width at the lip/side seam grows toward the front so a 0.5 mm click has clearance."""
    t = np.clip((P[:, 2] - 14.0) / 44.0, 0, 1)
    return GAP + 0.40 * t * t * (3 - 2 * t)      # = GAP at the rear junction (uniform seam), 0.65 at the nose


def params_json(variant):
    hz = float(hump_z(0.0, variant))
    return dict(
        variant=variant, units='mm', frame='+X = side-button side (user LEFT), +Y up, +Z forward',
        yBase=Y_BASE, gap=GAP,
        # trigger hinge: axis along X through (y, z): the click-tensioner bend near the rear cutout
        hinge=dict(L=dict(pivot=[0.0, 31.5, hz + 1.6], axis=[1, 0, 0]), R=dict(pivot=[0.0, 31.5, hz + 1.6], axis=[1, 0, 0]),
                   travelFront=0.5, frontZ=58.5),
        wheel=WHEEL, wheelOpen=WHEEL_OPEN,
        sideButtons=[dict(name=b['name'], press=[-1, 0, 0], travel=0.45) for b in (SB_THESEUS if variant == 'theseus' else SB_SORA)],
        sideDecal=SIDE_DECAL,
    )
