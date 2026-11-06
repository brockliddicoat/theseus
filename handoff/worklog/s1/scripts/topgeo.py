"""Top-view geometry for the options sheet, from the 3D shell's flat twin (deck/geo2d/shell.json, axis '1' = seen from
above) and the corner / opening designs. Frame: u = -X (the user's left on the left, as the deck's top view), v = -Z (nose
up, with the y axis pointing down on the page)."""
import json, sys
import numpy as np
from shapely.geometry import Polygon, LineString, Point
from shapely.ops import unary_union
sys.path.insert(0, '/home/claude/work/s1/scripts')
from shellio import mesh_rings, poly

def to_top(P):
    P = np.asarray(P, float); return np.c_[-P[:, 0], -P[:, 1]]

def ring(path, src='shell', axis='1', holes=False):
    rs = mesh_rings(path, axis, src)
    out = [np.array(p) for p, h in rs if bool(h) == holes]
    return max(out, key=len) if out and not holes else out

def outline_top(src='shell'):
    """the whole mouse from above: body + triggers + side buttons"""
    parts = [poly(p, '1', src) for p in ['body/body', 'explodeL/triggerL/Group/triggerL', 'explodeR/triggerR/Group/triggerR',
                                          'sideFront/sideFront', 'sideRear/sideRear']]
    U = unary_union([g.buffer(0.05) for g in parts]).buffer(-0.05)
    if U.geom_type != 'Polygon': U = max(U.geoms, key=lambda g: g.area)
    return to_top(np.array(U.exterior.coords))

def trigger_rings(src='shell'):
    L = ring('explodeL/triggerL/Group/triggerL', src); R = ring('explodeR/triggerR/Group/triggerR', src)
    return to_top(L), to_top(R)

def side_buttons(src='shell'):
    return [to_top(ring(p, src)) for p in ['sideFront/sideFront', 'sideRear/sideRear']]

def split_outer(T, side):
    """the trigger ring's outer edge (the side seam seen from above), front to back, as (u, v); side -1 = the left trigger"""
    P = T.copy()
    # the outer edge: points with |u| > 20 behind v < -20 (z > 20) ... take the run with |u| large from the nose round to the rear
    return P
