# Board-level geometry for the Theseus PCB: copper pours, stitching vias, mask relief, gold trim, pads, silk, inner layers.
import math
import numpy as np
from shapely.geometry import Polygon, Point, LineString, box, MultiPolygon
from shapely.ops import unary_union
from shapely import affinity
from geom import Mesh, polys, cap, walls, raised, slab, hershey_text, outline_text, qr_modules, matrix_polys
from layout import build as build_layout, pad_poly, drill_poly, trace_poly, EDGE_BAND, CU_EDGE, POUR_CLR, ANT_KEEPOUT
from board import SORA_HOLES, wheel_cut_poly, square_cut_poly, rrect
from parts import GND

# ---- stack-up (local y; laminate top at 0) -------------------------------------------------------------
T = 1.0                 # finished FR4 laminate thickness (mm)
CU = 0.035              # outer copper (1 oz)
Y_MASK = 0.022          # solder mask over bare laminate
Y_MASKCU = 0.056        # solder mask over copper (copper 35 um + mask 21 um)
Y_PAD = 0.042           # ENIG pad surface
Y_SILK = 0.064          # silkscreen ink
Y_L2, Y_L3 = -0.30, -0.70   # inner layers (core 0.4 mm between them)
BEVEL = 0.045           # mask shoulder over copper edges (gives the subtle relief)
MASK_EXP = 0.05         # mask opening expansion around pads
QR_URL = 'https://theseus.example/software'   # placeholder: Brock sets the real web-software URL (see README)


def ybot(y):
    """mirror a top-side height to the bottom side"""
    return -T - y


def board_polys(L):
    outline = L['outline']
    tht_holes = [drill_poly(p) for p in L['pads'] if (p.get('drill') or p.get('slot'))]
    core = L['board'].difference(unary_union(tht_holes))
    return outline, core, tht_holes


def hole_keep(L, extra=0.0):
    g = [c.buffer(CU_EDGE + extra) for c in L['cuts']]
    g += [Point(h['x'], h['z']).buffer(h['d'] / 2 + CU_EDGE + extra) for h in L['npth'] if not h['plated']]
    g += [Point(h['x'], h['z']).buffer(h['d'] / 2 + 0.01) for h in L['npth'] if h['plated']]
    return unary_union(g)


def plated_mh(L):
    return [h for h in L['npth'] if h['plated']]


def stitching_vias(L, pour_area, avoid):
    """GND vias: fence along the edge + sparse field grid + next to GND castellations; returns list of (x, z)"""
    out = []
    ok_region = pour_area.buffer(-0.32)
    ok_region = ok_region.difference(avoid)
    ok_region = ok_region.difference(unary_union([Point(h['x'], h['z']).buffer(h['d'] / 2 + 1.0) for h in L['npth'] if h['plated']]))
    # 1) fence along the gold trim
    fence = L['outline'].buffer(-(EDGE_BAND + CU_EDGE + 0.42), join_style=1)
    for ring in [p.exterior for p in polys(fence)]:
        n = max(3, int(ring.length / 1.25))
        for i in range(n):
            p = ring.interpolate(i / n, normalized=True)
            if ok_region.contains(p.buffer(0.24)):
                out.append((p.x, p.y))
    # fence around the wheel bay (not along the antenna side) and the switch window
    for cut in (wheel_cut_poly(), square_cut_poly()):
        ring = cut.buffer(CU_EDGE + 0.45, join_style=1).exterior
        n = max(3, int(ring.length / 1.3))
        for i in range(n):
            p = ring.interpolate(i / n, normalized=True)
            if p.y < 28.6 and abs(p.x) < 8.5 and cut.area > 100:
                continue          # keep the antenna side of the wheel bay clear
            if ok_region.contains(p.buffer(0.24)):
                out.append((p.x, p.y))
    # 2) field grid (hex) in open pour
    pitch = 2.1
    minx, miny, maxx, maxy = ok_region.bounds
    row = 0
    z = miny
    while z < maxy:
        x0 = minx + (pitch / 2 if row % 2 else 0)
        x = x0
        while x < maxx:
            p = Point(x, z)
            if ok_region.contains(p.buffer(0.3)) and all(math.hypot(x - a, z - b) > 0.95 for a, b in out[-400:]):
                out.append((x, z))
            x += pitch
        z += pitch * 0.866
        row += 1
    # de-duplicate (min spacing 0.8)
    res = []
    for p in out:
        if all(math.hypot(p[0] - q[0], p[1] - q[1]) > 0.8 for q in res):
            res.append(p)
    return res


def build_board(L, art_seed=7):
    outline, core, tht_holes = board_polys(L)
    pads = L['pads']
    routes, vias = L['routes'], list(L['vias'])
    keep = hole_keep(L)
    inside = outline.buffer(-(EDGE_BAND + CU_EDGE))
    ant = ANT_KEEPOUT.buffer(0.0)

    # ---------------- L1 copper
    smd_or_tht = [(p, pad_poly(p)) for p in pads]
    nongnd_pad = unary_union([g for p, g in smd_or_tht if p['net'] != GND])
    gnd_pad = unary_union([g for p, g in smd_or_tht if p['net'] == GND])
    l1_tr = [(t, trace_poly(t)) for t in routes if t['layer'] == 'L1']
    nongnd_tr = unary_union([g for t, g in l1_tr if t['net'] != GND])
    via_ring = lambda v: Point(v['x'], v['z']).buffer(v.get('d', 0.45) / 2, quad_segs=10)
    nongnd_via = unary_union([via_ring(v) for v in vias if v['net'] != GND])
    # component bodies where we do not want field vias (purely visual: vias under parts are hidden anyway)
    bodies = []
    for c, fp in L['comps']:
        bw, bh = fp['body']
        if c['fp'] in ('TP', 'FID', 'TPTHT'):
            continue
        bodies.append(affinity.translate(affinity.rotate(box(-bw / 2, -bh / 2, bw / 2, bh / 2), c['rot'], origin=(0, 0)), c['x'], c['z']))
    bodies = unary_union(bodies)
    pour = inside.difference(keep).difference(ant.buffer(0.25))
    pour = pour.difference(nongnd_pad.buffer(POUR_CLR)).difference(nongnd_tr.buffer(POUR_CLR)).difference(nongnd_via.buffer(POUR_CLR))
    # QFN exposed pad + module/sensor centre are handled by pads; no pour under the sensor aperture (already a hole)
    # stitching vias
    gv = stitching_vias(L, pour, bodies.buffer(0.2).union(gnd_pad.buffer(0.15)))
    # QFN thermal vias + vias next to module GND castellations
    for c, fp in L['comps']:
        a = math.radians(c['rot'])
        for (vx, vz) in fp.get('ep_vias', []):
            gv.append((c['x'] + vx * math.cos(a) - vz * math.sin(a), c['z'] + vx * math.sin(a) + vz * math.cos(a)))
    for p in pads:
        if p['ref'] == 'U1' and p['net'] == GND:
            dx = 0.95 if p['x'] > 0.1 else (-0.95 if p['x'] < -0.1 else 0)
            dz = -0.95 if p['name'].startswith('B') else 0
            if p['name'].startswith('B'):
                dx = 0
            q = (p['x'] + dx, p['z'] + dz)
            if pour.buffer(-0.25).contains(Point(q)) and not ant.buffer(0.4).contains(Point(q)):
                gv.append(q)
    gvias = [dict(net=GND, x=x, z=z, d=0.45, drill=0.2) for x, z in gv]
    all_vias = vias + gvias
    # keep only pour islands tied to GND (touching a GND pad or holding a GND via)
    anchors = unary_union([gnd_pad] + [Point(v['x'], v['z']).buffer(0.2) for v in gvias])
    pour = unary_union([p for p in polys(pour) if p.area > 0.6 and p.intersects(anchors)])
    pour = pour.buffer(-0.04, join_style=1).buffer(0.04, join_style=1)
    gnd_via = unary_union([via_ring(v) for v in all_vias if v['net'] == GND])
    gnd_tr = unary_union([g for t, g in l1_tr if t['net'] == GND])
    l1_copper = unary_union([pour, nongnd_tr, gnd_tr, nongnd_via, gnd_via, nongnd_pad, gnd_pad])

    # mask openings (pads + expansion; fiducials use their own larger clearance)
    mask_open = unary_union([pad_poly(p, p.get('mask', MASK_EXP)) for p in pads])
    # trim (exposed ENIG band along the plated edge + square window + plated mounting holes)
    trim = outline.difference(outline.buffer(-EDGE_BAND, join_style=1))
    sq = square_cut_poly()
    trim_sq = sq.buffer(0.28, join_style=1).difference(sq)
    mh_rings = unary_union([Point(h['x'], h['z']).buffer(h['d'] / 2 + 0.75, quad_segs=24).difference(Point(h['x'], h['z']).buffer(h['d'] / 2, quad_segs=24)) for h in plated_mh(L)])
    trim_top = unary_union([trim, trim_sq, mh_rings])
    # tented vias: ring under mask with the drill dimple
    def tented(vs):
        return unary_union([via_ring(v).difference(Point(v['x'], v['z']).buffer(v.get('drill', 0.2) / 2 + 0.01, quad_segs=8)) for v in vs])
    relief_top = unary_union([pour, nongnd_tr, gnd_tr]).difference(mask_open).difference(trim_top.buffer(0.02))
    relief_top = unary_union([relief_top.difference(unary_union([Point(v['x'], v['z']).buffer(v.get('drill', 0.2) / 2 + 0.01) for v in all_vias])), tented(all_vias)])
    relief_top = relief_top.difference(mask_open)
    pads_top = unary_union([g for p, g in smd_or_tht]).difference(unary_union(tht_holes))

    # ---------------- inner layers
    tht_all = unary_union(tht_holes)
    nongnd_through = unary_union([via_ring(v) for v in all_vias if v['net'] != GND] + [g for p, g in smd_or_tht if (p.get('drill') or p.get('slot')) and p['net'] != GND])
    l2 = outline.buffer(-(EDGE_BAND + 0.25)).difference(keep).difference(ant.buffer(0.2)).difference(nongnd_through.buffer(0.25)).difference(tht_all.buffer(0.05))
    l3 = unary_union([trace_poly(t) for t in routes if t['layer'] == 'L3'])
    l3_vias = unary_union([via_ring(v) for v in all_vias])

    return dict(outline=outline, core=core, tht_holes=tht_holes, pour=pour, relief_top=relief_top, pads_top=pads_top,
                trim_top=trim_top, mask_open=mask_open, l1_copper=l1_copper, vias=all_vias, gvias=gvias,
                l2=l2, l3=l3, l3_vias=l3_vias, keep=keep, inside=inside, bodies=bodies, mh_rings=mh_rings, trim_sq=trim_sq)
