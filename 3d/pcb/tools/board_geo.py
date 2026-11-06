# Board-level geometry for the Theseus PCB: copper pours, stitching vias, mask relief, gold trim, pads, silk, inner layers.
import math
import numpy as np
import deps  # noqa: F401  (stand-ins for packages this machine lacks: shim/README.md)
from shapely.geometry import Polygon, Point, LineString, box, MultiPolygon
from shapely.ops import unary_union
from shapely import affinity
from geom import Mesh, polys, cap, walls, raised, slab, hershey_text, outline_text, qr_modules, matrix_polys
from layout import build as build_layout, pad_poly, drill_poly, trace_poly, EDGE_BAND, CU_EDGE, POUR_CLR, ANT_KEEPOUT
from board import SORA_HOLES, wheel_cut_poly, square_cut_poly, rrect, BAY_TRIM
from parts import GND

# ---- stack-up (local y; laminate top at 0) -------------------------------------------------------------
# F47.4 (Brock, 2026-11-06, "0.6 mm, 5.63 g"; H3): a 0.6 mm finished, two-layer board with half-ounce outer copper, on the
# path to the 5.6 g target (F42.2). Was 1.0 mm, four layers (L2 a GND plane, L3 power + long runs), 1 oz outer. The board's
# TOP stays where it was in the mouse (5.03 mm over the pad: the shell's posts, the switches, the wheel's axle 12 mm up and
# the lens's focus are all set from it); the underside comes up 0.4 mm. The deck's drawings read this through KEY_PARTS
# (deck/tools/geo2d/key_parts.py -> KEY_PARTS.board.t / .top -> BOARD_T / BOARD_TOP in deck/src/03-parts.js).
# T (finished thickness), LAYERS (2: L1 top + L4 bottom; 4 adds L2 GND + L3 power), CU (outer copper, 0.5 oz) and FAR
# (the second routing layer: L4, the bottom, on two layers) live in stackup.py, one place for every tool
from stackup import T, LAYERS, CU, FAR
Y_MASK = 0.022          # solder mask over bare laminate
# the relief heights below are DRAWN heights, kept as they were for 1 oz copper (H3): on the half-ounce board the real copper
# is 17.5 um thinner, which no view can show, while drawn this thin the ENIG pads sit level with the bare-laminate mask and
# the 2D twins (deck/tools/geo2d, which order a view's meshes by depth) draw the mask over every gold pad. The masses use
# the real stack (stackup.CU in mass.py)
Y_MASKCU = 0.056        # solder mask over copper (copper 35 um + mask 21 um, as drawn)
Y_PAD = 0.042           # ENIG pad surface (as drawn)
Y_SILK = 0.064          # silkscreen ink
Y_L2, Y_L3 = -0.30, -0.70   # inner layers of the four-layer build only (LAYERS == 4, T 1.0); none on two layers
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
        if cut.is_empty:
            continue
        ring = cut.buffer(CU_EDGE + (BAY_TRIM if cut.area > 100 else 0.28) + 0.42, join_style=1).exterior
        n = max(3, int(ring.length / 1.3))
        for i in range(n):
            p = ring.interpolate(i / n, normalized=True)
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


def build_board(L, art_seed=7, _extra=None, _drop=None):
    """the board's copper, mask, trim and vias. Two layers (F47.4, H3): the ground is the two faces' pours tied by vias (no
    L2 plane), so after the stitching, gnd.repair_vias adds a via wherever a piece cut off from the main ground overlaps it on
    the other face (or a floating piece over 1 mm2 does), until the ground is one piece (B['repair_vias']); then copper still
    tied to no GND pad is removed, as a board house's DFM would ask (B['drop_top'] off the top pour, B['drop_bottom'] off the
    underside's art: silk.build_bottom honours it), with the vias that only joined such copper. gnd.py checks the result"""
    if LAYERS == 2 and _extra is None:
        import gnd as _G
        import silk as _SK
        extra = []
        for _ in range(8):
            Bx = build_board(L, art_seed, _extra=extra)
            add = _G.repair_vias(L, Bx, _SK.build_bottom(L, Bx, QR_URL))
            if not add:
                break
            extra = extra + add
        A = _G.analyze(L, Bx, _SK.build_bottom(L, Bx, QR_URL))
        used = set(r for r in A['roots'] if r is not None)
        drop_t = unary_union([g for i, (f, g) in enumerate(A['pieces']) if f == 'T' and A['root'][i] not in used])
        drop_b = unary_union([g for i, (f, g) in enumerate(A['pieces']) if f == 'B' and A['root'][i] not in used])
        Bx = build_board(L, art_seed, _extra=extra, _drop=(drop_t, drop_b))
        Bx['repair_vias'] = extra
        return Bx
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
    # (on two layers the far routes are the bottom's copper: the stitching vias, whose bottom lands join the mosaic pour,
    # keep clear of them as they did of L3's)
    l3_other = unary_union([trace_poly(t) for t in routes if t['layer'] == FAR and t['net'] != GND] +
                           [g for p, g in smd_or_tht if (p.get('drill') or p.get('slot')) and p['net'] != GND])
    avoid = bodies.buffer(0.2).union(gnd_pad.buffer(0.15)).union(l3_other.buffer(0.12 + 0.225))
    if LAYERS == 2:
        # (two layers: the GND vias' bottom ends show on the underside: none in the art's QR, wordmark or fab block)
        import silk as _SK
        _Z = _SK.art_zones()
        avoid = avoid.union(unary_union([_Z[k] for k in _SK.ART_KEEP]).buffer(0.3))
    gv = stitching_vias(L, pour, avoid)
    gv += list(_extra or [])
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
    if _drop is not None:
        # GND vias whose both ends land only on dropped (floating) copper go with it
        dt, db = _drop
        gv = [(x, z) for x, z in gv if not (dt.buffer(0.01).contains(Point(x, z)) and (db.is_empty or db.buffer(0.01).contains(Point(x, z)) or not inside.contains(Point(x, z))))]
    gvias = [dict(net=GND, x=x, z=z, d=0.45, drill=0.2) for x, z in gv]
    all_vias = vias + gvias
    # keep only pour islands tied to GND (touching a GND pad or holding a GND via)
    anchors = unary_union([gnd_pad] + [Point(v['x'], v['z']).buffer(0.2) for v in gvias])
    pour = unary_union([p for p in polys(pour) if p.area > 0.6 and p.intersects(anchors)])
    if _drop is not None and not _drop[0].is_empty:
        pour = pour.difference(_drop[0].buffer(0.02))
    pour = pour.buffer(-0.04, join_style=1).buffer(0.04, join_style=1)
    gnd_via = unary_union([via_ring(v) for v in all_vias if v['net'] == GND])
    gnd_tr = unary_union([g for t, g in l1_tr if t['net'] == GND])
    l1_copper = unary_union([pour, nongnd_tr, gnd_tr, nongnd_via, gnd_via, nongnd_pad, gnd_pad])

    # mask openings (pads + expansion; fiducials use their own larger clearance)
    mask_open = unary_union([pad_poly(p, p.get('mask', MASK_EXP)) for p in pads])
    # trim (exposed ENIG band along the plated edge + square window + plated mounting holes)
    trim = outline.difference(outline.buffer(-EDGE_BAND, join_style=1))
    sq = square_cut_poly()
    trim_sq = sq.buffer(0.28, join_style=1).difference(sq) if not sq.is_empty else Polygon()
    bay = wheel_cut_poly()
    trim_bay = bay.buffer(BAY_TRIM, join_style=1).difference(bay)          # the wheel bay's gold trim (F30.21, F30.25)
    mh_rings = unary_union([Point(h['x'], h['z']).buffer(h['d'] / 2 + 0.75, quad_segs=24).difference(Point(h['x'], h['z']).buffer(h['d'] / 2, quad_segs=24)) for h in plated_mh(L)])
    trim_top = unary_union([trim, trim_sq, trim_bay, mh_rings])
    # tented vias: ring under mask with the drill dimple
    def tented(vs):
        return unary_union([via_ring(v).difference(Point(v['x'], v['z']).buffer(v.get('drill', 0.2) / 2 + 0.01, quad_segs=8)) for v in vs])
    relief_top = unary_union([pour, nongnd_tr, gnd_tr]).difference(mask_open).difference(trim_top.buffer(0.02))
    relief_top = unary_union([relief_top.difference(unary_union([Point(v['x'], v['z']).buffer(v.get('drill', 0.2) / 2 + 0.01) for v in all_vias])), tented(all_vias)])
    relief_top = relief_top.difference(mask_open)
    pads_top = unary_union([g for p, g in smd_or_tht]).difference(unary_union(tht_holes))

    # ---------------- inner layers (four layers), or the bottom's routes (two layers: no L2 plane; 'l3' is then the far
    # layer's copper, the bottom routes, which the X-ray mesh shows through the board and the mosaic pour keeps clear of)
    tht_all = unary_union(tht_holes)
    nongnd_through = unary_union([via_ring(v) for v in all_vias if v['net'] != GND] + [g for p, g in smd_or_tht if (p.get('drill') or p.get('slot')) and p['net'] != GND])
    if LAYERS == 4:
        l2 = outline.buffer(-(EDGE_BAND + 0.25)).difference(keep).difference(ant.buffer(0.2)).difference(nongnd_through.buffer(0.25)).difference(tht_all.buffer(0.05))
    else:
        l2 = Polygon()
    l3 = unary_union([trace_poly(t) for t in routes if t['layer'] == FAR])
    far_nongnd = unary_union([trace_poly(t) for t in routes if t['layer'] == FAR and t['net'] != GND])
    l3_vias = unary_union([via_ring(v) for v in all_vias])

    return dict(drop_top=_drop[0] if _drop else Polygon(), drop_bottom=_drop[1] if _drop else Polygon(),
                outline=outline, core=core, tht_holes=tht_holes, pour=pour, relief_top=relief_top, pads_top=pads_top,
                trim_top=trim_top, mask_open=mask_open, l1_copper=l1_copper, vias=all_vias, gvias=gvias,
                l2=l2, l3=l3, l3_vias=l3_vias, keep=keep, inside=inside, bodies=bodies, mh_rings=mh_rings, trim_sq=trim_sq,
                nongnd_tr=nongnd_tr, nongnd_via=nongnd_via, far_nongnd=far_nongnd, gnd_pad=gnd_pad, gnd_tr=gnd_tr)
