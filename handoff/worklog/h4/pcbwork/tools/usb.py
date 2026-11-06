# The USB 2.0 high-speed pair on the 0.6 mm two-layer board (H4, 2026-11-06): its geometry and the rules that keep it at
# 90 ohm differential. Every tool reads it (routes, layout's DRC, board_geo's top pour, silk's underside art, autoroute).
#
# The numbers come from a 2D quasi-static field solve of the cross-section (finite volumes on a graded grid, work/h4/tools/
# fieldsolve.py; checked against Hammerstad-Jensen and Kirschning-Jansen to within 0.2 to 0.7 %): two 0.465 mm traces
# 0.15 mm apart, 17.5 um copper, 0.565 mm of FR4 (er 4.3) to the other face's copper, LPI mask (20 um over laminate, 15 um
# over copper, er 3.5), the same face's ground pour 0.5 mm away: Zdiff 90.1 ohm, Zodd 45.1, Zcm 46.6 (USB 2.0 HS: 90 +/- 15 %).
# With no pour beside it 91.6; the reference band below makes no measurable difference from 0.7 mm past the pair outward.
#
# The rules (the DRC checks them along the controlled run, the full-width traces):
#  - same face: every other net's copper keeps G_POUR off the pair, the ground pour too (it is drawn there);
#  - the other face: the reference is solid copper at least BAND_MIN (aim BAND) past the pair's outer edges, unbroken: no
#    other net's copper in it, and on the underside no mosaic groove (silk.build_bottom pours it solid);
#  - at the ends (the receptacle's lands, the ESD array's pads, the module's castellations) the pads set the pitch: short
#    necked stubs, not the controlled run.
import math
from shapely.geometry import LineString, Point
from shapely.ops import unary_union

W, S = 0.465, 0.15                 # trace width, gap (mm)
PITCH = W + S                      # centre to centre
HP = PITCH / 2
G_POUR = 0.5                       # same-face clearance for the pour and every other net
BAND = 1.0                         # reference band past the pair's outer edges (aim)
BAND_MIN = 0.7                     # the least it may be where a pad or a hole forces it narrower
NETS = ('USB_DP', 'USB_DN')
STUB_W = 0.2                       # the necked stubs at the pads


def pair_lines(centre):
    """the two lines of a pair along a centre polyline: DP on the left of the direction of travel, DN on the right"""
    c = LineString(centre)
    dp = c.offset_curve(+HP, join_style='mitre', mitre_limit=4.0)
    dn = c.offset_curve(-HP, join_style='mitre', mitre_limit=4.0)
    return [tuple(p) for p in dp.coords], [tuple(p) for p in dn.coords]


def controlled(routes, layer=None):
    """the controlled run: the full-width traces of the pair"""
    return [t for t in routes if t['net'] in NETS and t['w'] >= W - 1e-6 and (layer is None or t['layer'] == layer)]


def _poly(t, extra=0.0):
    return LineString(t['pts']).buffer(t['w'] / 2 + extra, quad_segs=8, cap_style=1, join_style=1)


def keep_same(routes, layer):
    """the zone on the pair's own face where no other net's copper may be (the pair grown by G_POUR)"""
    return unary_union([_poly(t, G_POUR) for t in controlled(routes, layer)])


def band(routes, face, m=BAND):
    """the reference band on `face`: the controlled run on the OTHER face grown by m past its outer edges"""
    other = [t for t in controlled(routes) if t['layer'] != face]
    return unary_union([_poly(t, m) for t in other])


def length(routes, net):
    """routed length of a net's traces (mm) and its via count"""
    return sum(LineString(t['pts']).length for t in routes if t['net'] == net)
