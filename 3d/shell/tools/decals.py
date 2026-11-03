"""Engraving / decal meshes conformed to the skin.
python3 decals.py <skingrid.npz> <variant> <out.npz> [serial=099]
- serial (large, laser-etched tone-on-tone) on the RIGHT click (user's right = -X trigger), rear-outer area (#32, #36, #35)
- 'LT' / 'RT' GMK-style legends, front-outer corners (#62)
- gold side mark on the +X (user's left) front side wall where the Sora has its gold kanji (#33, #61)
Text reads correctly for the user (looking from behind/above): reading direction = -X, up = +Z on the triggers.
"""
import sys, json, numpy as np, trimesh
from shapely.geometry import Polygon, MultiPolygon, box
from shapely.ops import unary_union
from shapely import affinity
from matplotlib.textpath import TextPath
from matplotlib.font_manager import FontProperties
sys.path.insert(0, '/home/claude/theseus/3d/shell/tools')
from sdf import Skin

FONT_DISPLAY = '/usr/share/fonts/opentype/inter/InterDisplay-Medium.otf'
FONT_LEGEND = '/usr/share/fonts/opentype/inter/Inter-SemiBold.otf'


def text_shape(txt, font, cap_mm, tracking=0.0):
    fp = FontProperties(fname=font)
    # measure cap height with 'H'
    hb = TextPath((0, 0), 'H', size=100, prop=fp).get_extents()
    scale = cap_mm / hb.height
    polys = []; x = 0.0
    for ch in txt:
        tp = TextPath((x, 0), ch, size=100, prop=fp)
        rings = [r for r in tp.to_polygons(closed_only=True) if len(r) >= 3]
        shp = None
        for r in rings:
            p = Polygon(r).buffer(0)
            shp = p if shp is None else shp.symmetric_difference(p)
        if shp is not None:
            polys.append(shp)
        adv = TextPath((0, 0), ch, size=100, prop=fp).get_extents().width
        w = TextPath((0, 0), ch + 'H', size=100, prop=fp).get_extents().width - hb.width
        x += max(w, adv) + tracking / scale
    shp = unary_union(polys)
    shp = affinity.scale(shp, scale, scale, origin=(0, 0))
    b = shp.bounds
    shp = affinity.translate(shp, -(b[0] + b[2]) / 2, -(b[1] + b[3]) / 2)
    return shp


def theta_mark(h=5.0, stroke=0.46, bar_gap=0.42):
    """Monoline geometric capital theta: an upright ellipse ring + a floating bar."""
    from shapely.geometry import Point
    w = h * 0.74
    outer = affinity.scale(Point(0, 0).buffer(1.0, resolution=128), w / 2, h / 2)
    inner = affinity.scale(Point(0, 0).buffer(1.0, resolution=128), w / 2 - stroke, h / 2 - stroke)
    ring = outer.difference(inner)
    bl = w - 2 * stroke - 2 * bar_gap
    bar = box(-bl / 2, -stroke / 2, bl / 2, stroke / 2).buffer(stroke * 0.18, join_style=1).buffer(-stroke * 0.18)
    bar = box(-bl / 2, -stroke / 2, bl / 2, stroke / 2)
    return unary_union([ring, bar])


def triangulate(shp, max_edge=0.35):
    geoms = list(shp.geoms) if isinstance(shp, MultiPolygon) else [shp]
    Vs, Fs = [], []; off = 0
    for gm in geoms:
        if gm.area < 1e-4:
            continue
        v, f = trimesh.creation.triangulate_polygon(gm, engine='earcut')
        v3 = np.c_[v, np.zeros(len(v))]
        v3, f = trimesh.remesh.subdivide_to_size(v3, f, max_edge=max_edge)
        Vs.append(v3[:, :2]); Fs.append(f + off); off += len(v3)
    return np.concatenate(Vs), np.concatenate(Fs)


def place(uv, origin, u, v, n, skin, lift=0.012):
    """map 2D (u,v) mm to 3D on the skin: start on the tangent plane, Newton-project onto skin=0, lift along normal."""
    P = origin[None] + uv[:, 0:1] * u[None] + uv[:, 1:2] * v[None]
    for _ in range(6):
        f, G = skin(P, grad=True)
        P = P - f[:, None] * G
    f, G = skin(P, grad=True)
    return P + lift * G, G


def frame_at(skin, p0, up_hint, right_hint, ray=(0, -1, 0)):
    """surface point hit by a ray from p0 (bisection on the skin field), plus a tangent frame."""
    p0 = np.asarray(p0, float); d = np.asarray(ray, float)
    ts = np.linspace(0, 50, 2001)
    f = skin(p0[None] + ts[:, None] * d[None])
    i = int(np.argmax(f < 0)); lo, hi = ts[i - 1], ts[i]
    for _ in range(40):
        mid = 0.5 * (lo + hi)
        if skin((p0 + mid * d)[None])[0] < 0: hi = mid
        else: lo = mid
    P = (p0 + hi * d)[None]
    f, G = skin(P, grad=True)
    n = G[0]
    v = np.asarray(up_hint, float); v = v - (v @ n) * n; v /= np.linalg.norm(v)
    u = np.cross(v, n)
    if u @ np.asarray(right_hint, float) < 0:
        u = -u
    return P[0], u, v, n


def build(grid, variant, serial='099'):
    G = np.load(grid)
    skin = Skin(G['S'].astype(float), G['N'].astype(float), k=8, sym=True)
    out = {}
    # ---- serial on the right click (-X), rear-outer area, away from the finger rest zone
    o, u, v, n = frame_at(skin, [-16.0, 45.0, 13.6], up_hint=[0, 0, 1], right_hint=[-1, 0, 0])
    shp = text_shape(serial, FONT_DISPLAY, cap_mm=6.4, tracking=0.55)
    uv, F = triangulate(shp)
    P, N = place(uv, o, u, v, n, skin)
    out['engraveSerial'] = (P, F, N)
    # ---- LT / RT legends (GMK-style), front-outer corners
    for name, x0 in (('engraveLT', 19.2), ('engraveRT', -19.2)):
        o, u, v, n = frame_at(skin, [x0, 45.0, 50.5], up_hint=[0, 0, 1], right_hint=[-1, 0, 0])
        shp = text_shape('LT' if name.endswith('LT') else 'RT', FONT_LEGEND, cap_mm=2.3, tracking=0.25)
        uv, F = triangulate(shp, 0.2)
        P, N = place(uv, o, u, v, n, skin)
        out[name] = (P, F, N)
    # ---- gold side mark (+X front side wall)
    o, u, v, n = frame_at(skin, [40, 11.6, 41.0], up_hint=[0, 1, 0], right_hint=[0, 0, -1], ray=(-1, 0, 0))
    shp = theta_mark(h=5.0)
    uv, F = triangulate(shp, 0.32)
    P, N = place(uv, o, u, v, n, skin, lift=0.015)
    out['sideMark'] = (P, F, N)
    return out


if __name__ == '__main__':
    grid, variant, outp = sys.argv[1], sys.argv[2], sys.argv[3]
    serial = sys.argv[4] if len(sys.argv) > 4 else '099'
    D = build(grid, variant, serial)
    np.savez_compressed(outp, **{f'{k}_{a}': arr for k, (P, F, N) in D.items() for a, arr in zip('VFN', (P.astype(np.float32), F.astype(np.int32), N.astype(np.float32)))})
    for k, (P, F, N) in D.items():
        print(k, len(P), 'verts', len(F), 'tris', 'bbox', np.round(P.min(0), 2), np.round(P.max(0), 2))
