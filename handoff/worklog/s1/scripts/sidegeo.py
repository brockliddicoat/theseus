"""Side-view geometry (from the user's left, nose left) from the 3D shell's twin (axis '0': u = Z, v = Y), and the
options' seams lifted onto the skin with the height map."""
import sys
import numpy as np
from shapely.geometry import Polygon
from shapely.ops import unary_union
from scipy.interpolate import RegularGridInterpolator
sys.path.insert(0, '/home/claude/work/s1/scripts')
from shellio import poly, mesh_rings

def S(P):
    """scene (Z, Y) -> the page (u, v) = (-Z, -Y): nose on the left, up is up"""
    P = np.asarray(P, float); return np.c_[-P[:, 0], -P[:, 1]]

def silhouette(src='shell'):
    parts = [poly(p, '0', src) for p in ['body/body', 'explodeL/triggerL/Group/triggerL', 'explodeR/triggerR/Group/triggerR']]
    U = unary_union([g.buffer(0.05) for g in parts]).buffer(-0.05)
    if U.geom_type != 'Polygon': U = max(U.geoms, key=lambda g: g.area)
    return np.array(U.exterior.coords)

def trigger_side(src='shell'):
    rs = mesh_rings('explodeL/triggerL/Group/triggerL', '0', src)
    return np.array(max([p for p, h in rs if not h], key=len))

def seam_lower(T=None, z0=4.9, z1=59.5, dz=0.1, src='shell'):
    """the trigger's lower edge in the side view (the seam): the trigger's side outline opened by 0.9 mm (so the plunger
    posts under it drop out), its lowest point at each z"""
    from shapely.geometry import LineString
    P = poly('explodeL/triggerL/Group/triggerL', '0', src).buffer(-0.9, 16).buffer(0.9, 16)
    if P.geom_type != 'Polygon': P = max(P.geoms, key=lambda g: g.area)
    out = []
    for z in np.arange(z0, z1, dz):
        L = LineString([(z, -5), (z, 60)]).intersection(P)
        if not L.is_empty: out.append((z, L.bounds[1]))
    return np.array(out)

def side_buttons(src='shell'):
    out = []
    for p in ['sideFront/sideFront', 'sideRear/sideRear']:
        rs = mesh_rings(p, '0', src); out.append(np.array(max([q for q, h in rs if not h], key=len)))
    return out

class Lift:
    def __init__(self, npz='/home/claude/work/s1/heightmap_ths.npz'):
        D = np.load(npz); self.f = RegularGridInterpolator((D['zs'], D['xs']), D['Y'], bounds_error=False, fill_value=np.nan)
    def __call__(self, XZ):
        XZ = np.asarray(XZ, float); y = self.f(np.c_[XZ[:, 1], XZ[:, 0]]); return np.c_[XZ[:, 1], y]   # (Z, Y)
