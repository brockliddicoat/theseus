# Silkscreen (top + bottom) and bottom copper/gold artwork for the Theseus PCB.
import math, random
import numpy as np
import deps  # noqa: F401  (stand-ins for packages this machine lacks: shim/README.md)
from shapely.geometry import Polygon, Point, LineString, box, MultiPolygon
from shapely.ops import unary_union
from shapely import affinity
from geom import polys, hershey_text, outline_text, qr_modules, matrix_polys
from layout import pad_poly, ANT_KEEPOUT, EDGE_BAND, POUR_CLR
from board import wheel_cut_poly, square_cut_poly, SORA_HOLES, rrect, WIN, VARIANT, WX
from parts import GND, ZS
from stackup import T as BOARD_T, LAYERS

LW = 0.10          # silk line width
# fillets on the underside triangles (F26.6). Each triangle is rounded on its own (rounded_inset), so the mosaic keeps
# every triangle, the partial ones at the edges too (an opening of the whole mosaic cut those: Brock, 2026-11-05)
TRI_FILLET = 0.20       # the copper mosaic (inradius 0.58 mm)
TRI_FILLET_GOLD = 0.15  # the gold triangles (inradius 0.35)
TRI_FILLET_SILK = 0.10  # the silk-outlined triangles (inradius 0.26)


def rounded_inset(poly, d, r, n=10):
    """convex polygon `poly` inset by d, its corners rounded at r (exact: the polygon inset by d + r, grown back by r)"""
    P = np.asarray(poly.exterior.coords)[:-1]
    e0, e1 = P[1] - P[0], P[2] - P[1]
    if e0[0] * e1[1] - e0[1] * e1[0] < 0:
        P = P[::-1]
    m = len(P)
    nrm = []
    for i in range(m):
        e = P[(i + 1) % m] - P[i]; e = e / np.linalg.norm(e); nrm.append(np.array([e[1], -e[0]]))      # outward (CCW)
    Q = []
    for i in range(m):
        n0, n1 = nrm[i - 1], nrm[i]                     # edges into and out of vertex i
        a0 = P[i] - n0 * (d + r); a1 = P[i] - n1 * (d + r)
        t0 = np.array([-n0[1], n0[0]]); t1 = np.array([-n1[1], n1[0]])
        A = np.array([t0, -t1]).T; k = np.linalg.solve(A, a1 - a0)
        Q.append(a0 + t0 * k[0])
    out = []
    for i in range(m):
        a_in, a_out = math.atan2(nrm[i - 1][1], nrm[i - 1][0]), math.atan2(nrm[i][1], nrm[i][0])
        da = (a_out - a_in) % (2 * math.pi)
        for k in range(n + 1):
            a = a_in + da * k / n
            out.append((Q[i][0] + r * math.cos(a), Q[i][1] + r * math.sin(a)))
    return Polygon(out)
REF_H = 0.55       # refdes cap height
NO_REF = {'FID1', 'FID2', 'FID3', 'J1', 'SW4', 'WB1'} | {'TP%d' % i for i in range(1, 14)}


def rbox_line(cx, cz, w, h, r, rot=0, lw=LW):
    g = rrect(0, 0, w, h, r)
    ring = g.exterior.buffer(lw / 2, quad_segs=4)
    return affinity.translate(affinity.rotate(ring, rot, origin=(0, 0)), cx, cz)


def dashed_circle(cx, cz, r, n=4, gap_deg=24, lw=0.16):
    segs = []
    for i in range(n):
        a0 = math.radians(i * 360 / n + gap_deg / 2 + 45)
        a1 = math.radians((i + 1) * 360 / n - gap_deg / 2 + 45)
        pts = [(cx + r * math.cos(a0 + (a1 - a0) * k / 16), cz + r * math.sin(a0 + (a1 - a0) * k / 16)) for k in range(17)]
        segs.append(LineString(pts).buffer(lw / 2, quad_segs=4))
    return unary_union(segs)


def dashed_rect(x0, z0, x1, z1, dash=0.6, gap=0.4, lw=LW):
    ring = LineString([(x0, z0), (x1, z0), (x1, z1), (x0, z1), (x0, z0)])
    L = ring.length
    segs, s = [], 0.0
    from shapely.ops import substring
    while s < L:
        segs.append(substring(ring, s, min(s + dash, L)).buffer(lw / 2, quad_segs=3, cap_style=2))
        s += dash + gap
    return unary_union(segs)


def arrow(x, z, length, rot=0, lw=LW, head=0.35):
    shaft = LineString([(0, -length / 2), (0, length / 2 - head * 0.6)]).buffer(lw / 2, cap_style=2)
    tip = Polygon([(0, length / 2), (-head / 2, length / 2 - head), (head / 2, length / 2 - head)])
    g = unary_union([shaft, tip])
    return affinity.translate(affinity.rotate(g, rot, origin=(0, 0)), x, z)


def build_silk_top(L, B, qr_url):
    items = []        # (geometry, tag)
    comps = {c['ref']: (c, fp) for c, fp in L['comps']}
    pads = L['pads']
    mask_open = B['mask_open']
    keepout_silk = mask_open.buffer(0.08)
    # --- component outlines (Sora V2 style: white rounded boxes hugging each part)
    for ref, (c, fp) in comps.items():
        bw, bh = fp['body']
        kind = c['fp']
        if kind in ('TP', 'FID', 'TPTHT'):
            continue
        if kind in ('0402', '0603', '0805', 'L2016', 'SOD523', 'SOT666'):
            # outline encloses body + pads
            ps = [pad_poly(p) for p in pads if p['ref'] == ref]
            env = unary_union(ps + [affinity.translate(affinity.rotate(box(-bw / 2, -bh / 2, bw / 2, bh / 2), c['rot'], origin=(0, 0)), c['x'], c['z'])])
            g = env.envelope if c['rot'] % 90 == 0 else env.minimum_rotated_rectangle
            g = g.buffer(0.16, join_style=1)
            items.append((g.exterior.buffer(LW / 2, quad_segs=4), 'outline'))
        elif kind == 'GT01':
            items.append((rbox_line(c['x'], c['z'], 5.8 + 0.3, 12.8 + 0.3, 0.3), 'outline'))
        elif kind == 'MODULE':
            items.append((rbox_line(c['x'], c['z'], 9.9 + 0.5, 13.3 + 0.4, 0.4), 'outline'))
        elif kind == 'SENSOR':
            items.append((rbox_line(c['x'], c['z'], 9.0 + 2.6, 11.0 + 0.5, 0.35), 'outline'))
        elif kind == 'QFN32':
            h_ = 3.35; a_ = 0.9
            for sx_, sz_ in ((-1, 1), (1, 1), (-1, -1), (1, -1)):
                cx_, cz_ = c['x'] + sx_ * h_, c['z'] + sz_ * h_
                items.append((LineString([(cx_ - sx_ * a_, cz_), (cx_, cz_), (cx_, cz_ - sz_ * a_)]).buffer(LW / 2, cap_style=2, join_style=2), 'outline'))
            items.append((Point(c['x'] - 3.0, c['z'] + 3.0).buffer(0.14), 'pin1'))
        elif kind in ('JSTSH3',):
            items.append((affinity.translate(affinity.rotate(rrect(0, 0.0, 4.4, 4.5, 0.2).exterior.buffer(LW / 2), c['rot'], origin=(0, 0)), c['x'], c['z']), 'outline'))
        elif kind == 'USBC':
            pass
        elif kind == 'ENC':
            items.append((rbox_line(c['x'], c['z'], 4.6, 10.8, 0.3), 'outline'))
        elif kind == 'BRACKET':
            items.append((rbox_line(c['x'], c['z'], 6.6, 9.1, 0.4), 'outline'))
        elif kind == 'SLIDE':
            items.append((rbox_line(c['x'] + 0.2, c['z'], 2.4, 6.9, 0.25), 'outline'))
        elif kind == 'SLIDEB':                    # bridging the window: the outline shows on the board either side of it
            items.append((rbox_line(c['x'], c['z'], 2.5, 7.3, 0.25), 'outline'))
    # --- mounting hole rings (dashed, as on the Sora V2) for the copper-free front holes; small rings elsewhere
    for k, (x, z, d, kind) in SORA_HOLES.items():
        if k in ('MH1', 'MH2'):
            items.append((dashed_circle(x, z, d / 2 + 0.55), 'mh'))
    # --- labels (plan 5: the free board behind the module, either side of it; the switch labels beside its window)
    lab = []
    comp = {r: c for r, (c, f) in comps.items()}
    lab.append(outline_text('THESEUS', 1.05, 11.2, 2.55, anchor='c', tracking=0.22))
    lab.append(hershey_text('MAIN  PCB  V1.0', 0.5, 11.2, 1.25, w=0.085))
    # QR to the web software (normal polarity: white quiet zone, black modules), left of the module
    M = qr_modules(qr_url, error='m')
    lab.append(matrix_polys(M, 4.3, -9.3, 2.3, invert=True, quiet=1))
    lab.append(hershey_text('WEB  APP', 0.45, -9.3, -0.4, w=0.08))
    # power switch labels (#100): ON toward the nose, OFF toward the tail, on the window's sensor side (variant A); beside
    # the edge switch's body (variant B)
    if VARIANT == 'B':
        c3 = comp['SW3']; xl = c3['x'] - 2.4
        lab.append(outline_text('ON', 0.65, xl, c3['z'] + 2.2, tracking=0.08))
        lab.append(arrow(xl, c3['z'] + 1.05, 0.7, 0))
        lab.append(outline_text('OFF', 0.65, xl, c3['z'] - 2.2, tracking=0.08))
        lab.append(arrow(xl, c3['z'] - 1.05, 0.7, 180))
    else:
        xl = WIN['c'][0] - WIN['w'] / 2 - 1.25
        lab.append(outline_text('ON', 0.65, xl, WIN['c'][1] + 1.45, tracking=0.08))
        lab.append(arrow(xl, WIN['c'][1] + 0.35, 0.7, 0))
        lab.append(outline_text('OFF', 0.65, xl, WIN['c'][1] - 1.45, tracking=0.08))
        lab.append(arrow(xl, WIN['c'][1] - 0.35, 0.7, 180))
    # test pads
    for ref, t, dx, dz, an in (('TP1', 'VBUS', 0.0, -0.75, 'c'), ('TP2', 'GND', 0.0, -0.75, 'c'), ('TP3', 'VSYS', 0.0, -0.8, 'c'),
                               ('TP4', 'VBAT', 0.0, -0.75, 'c'), ('TP5', 'SNS', -0.65, 0.0, 'r'), ('TP6', 'D-', 0.65, 0.0, 'l'),
                               ('TP7', 'D+', 0.65, 0.0, 'l'), ('TP8', 'DIO', 0.0, -0.75, 'c'), ('TP9', 'CLK', 0.0, -0.75, 'c'),
                               ('TP10', '1V8', 0.0, 1.25, 'c'), ('TP11', 'GND', 0.0, 1.25, 'c'), ('TP12', 'GND', 0.0, 1.25, 'c'), ('TP13', 'SNS', 0.0, 1.25, 'c')):
        c = comp[ref]
        lab.append(hershey_text(t, 0.42, c['x'] + dx, c['z'] + dz, w=0.08, anchor=an))
    # polarity / pin-1: J2 faces the back (F26.4), its pin 1 (VBAT) at local x -1.0, turned: layout x + 1.0
    c = comp['J2']
    lab.append(hershey_text('+', 0.7, c['x'] + 1.85, c['z'] + 2.78, w=0.12))
    lab.append(hershey_text('BAT', 0.5, c['x'] - 1.65, c['z'] + 2.78, w=0.09, anchor='r'))
    c = comp['J3']                         # its mouth faces the left wall: the label between it and the edge
    lab.append(hershey_text('SIDE', 0.5, c['x'] - 3.1, c['z'], w=0.09, rot=90))
    for ref, dx, dz in (('U1', -5.35, -6.95), ('U3', -5.6, 4.9), ('U4', -1.25, 1.0)):
        c = comp[ref]
        lab.append(Point(c['x'] + dx, c['z'] + dz).buffer(0.15))
    c = comp['D1']
    lab.append(affinity.translate(affinity.rotate(box(-0.06, -0.45, 0.06, 0.45), 45, origin=(0, 0)), c['x'] - 0.8, c['z'] + 0.95))
    # LT / RT under the hot-swap switches (visible with the switch pulled)
    lab.append(outline_text('LT', 1.0, -16.0, 37.2, tracking=0.1))
    lab.append(outline_text('RT', 1.0, 16.0, 37.2, tracking=0.1))
    # RF keep-out frame, in front of the module (its antenna end, forward: plan 5), 'ANT' down both sides of it
    k = ANT_KEEPOUT.bounds
    u1 = comp['U1']
    lab.append(dashed_rect(k[0], k[1], k[2], k[3], lw=0.08).difference(rrect(u1['x'], u1['z'], 9.9 + 0.6, 13.3 + 0.6, 0.3)))
    for sx in (-1, 1):
        lab.append(hershey_text('ANT', 0.42, sx * (k[2] - 0.65), (k[1] + k[3]) / 2, w=0.08, rot=90))
    # revision, under the wordmark's line
    lab.append(hershey_text('THESEUS_MAIN_V1.0', 0.45, 11.2, 0.1, w=0.08))
    for g in lab:
        items.append((g, 'label'))
    # --- refdes auto-placement
    taken = unary_union([g for g, t in items]).buffer(0.02)
    bodies = []
    for ref, (c, fp) in comps.items():
        bw, bh = fp['body']
        bodies.append(affinity.translate(affinity.rotate(box(-bw / 2, -bh / 2, bw / 2, bh / 2), c['rot'], origin=(0, 0)), c['x'], c['z']))
    blocked = unary_union([keepout_silk, unary_union(bodies).buffer(0.05), B['trim_top'].buffer(0.1),
                           wheel_cut_poly().buffer(0.2), square_cut_poly().buffer(0.2)])
    for h in L['npth']:
        blocked = blocked.union(Point(h['x'], h['z']).buffer(h['d'] / 2 + 0.25))
    inside = L['outline'].buffer(-(EDGE_BAND + 0.15))
    placed = []
    for ref, (c, fp) in sorted(comps.items()):
        if ref in NO_REF or c['fp'] in ('USBC',):
            continue
        bw, bh = fp['body']
        env = unary_union([pad_poly(p) for p in pads if p['ref'] == ref] +
                          [affinity.translate(affinity.rotate(box(-bw / 2, -bh / 2, bw / 2, bh / 2), c['rot'], origin=(0, 0)), c['x'], c['z'])])
        x0, z0, x1, z1 = env.bounds
        h = REF_H if c['fp'] not in ('MODULE', 'SENSOR', 'GT01') else 0.75
        cands = []
        for gap in (0.42, 0.62, 0.9):
            cands += [((x0 + x1) / 2, z1 + gap + h / 2, 0, 0), ((x0 + x1) / 2, z0 - gap - h / 2, 0, 0),
                      (x1 + gap, (z0 + z1) / 2, 'l', 0), (x0 - gap, (z0 + z1) / 2, 'r', 0),
                      (x1 + gap, z1 + 0.1, 'l', 0), (x0 - gap, z1 + 0.1, 'r', 0), (x1 + gap, z0 - 0.1, 'l', 0), (x0 - gap, z0 - 0.1, 'r', 0),
                      (x1 + gap + h / 2, (z0 + z1) / 2, 0, 90), (x0 - gap - h / 2, (z0 + z1) / 2, 0, 90)]
        if c['fp'] in ('MODULE', 'SENSOR', 'GT01'):
            cands = [((x0 + x1) / 2, z0 - 0.45 - h / 2, 0, 0)] + cands
        ok = None
        for (x, z, a, rr) in cands:
            anchor = 'c' if a == 0 else a
            g = hershey_text(ref, h, x, z, w=0.09, anchor=anchor, rot=rr)
            if g.within(inside) and not g.buffer(0.06).intersects(blocked) and not g.buffer(0.08).intersects(taken):
                ok = g
                break
        if ok is not None:
            items.append((ok, 'ref'))
            taken = taken.union(ok.buffer(0.12))
            placed.append(ref)
    silk = unary_union([g for g, t in items])
    silk = silk.difference(keepout_silk).intersection(L['outline'].buffer(-(EDGE_BAND + 0.05)))
    for cut in L['cuts']:
        silk = silk.difference(cut.buffer(0.15))
    for h in L['npth']:
        silk = silk.difference(Point(h['x'], h['z']).buffer(h['d'] / 2 + 0.15))
    return silk, placed


def tri_lattice(region, s=2.45, origin=(0.0, -3.2)):
    """equilateral triangle cells covering region (bounds); returns list of (Polygon, centroid, row, col)"""
    h = s * math.sqrt(3) / 2
    x0, z0, x1, z1 = region.bounds
    cells = []
    r = int(math.floor((z0 - origin[1]) / h)) - 1
    while origin[1] + r * h < z1 + h:
        zb = origin[1] + r * h
        off = (r % 2) * s / 2
        c = int(math.floor((x0 - origin[0] - off) / s)) - 1
        while origin[0] + off + c * s < x1 + s:
            xa = origin[0] + off + c * s
            up = Polygon([(xa, zb), (xa + s, zb), (xa + s / 2, zb + h)])
            dn = Polygon([(xa + s / 2, zb + h), (xa + s * 1.5, zb + h), (xa + s, zb)])
            cells.append((up, r, 2 * c))
            cells.append((dn, r, 2 * c + 1))
            c += 1
        r += 1
    return cells


QR_C, QR_S = (-11.0, 9.8), 7.2           # the underside's QR: centre (layout) and size
ART_KEEP = ('qr', 'word', 'fab')         # zones the bottom's routes and vias keep out of, so the art stays whole (layout.py)
JOINT_W, JOINT_L = 0.25, 0.70            # two layers: each mosaic triangle's corner joined to its lattice vertex by a bar this
                                         # wide reaching this far from the vertex (its rounded corner starts 0.46 from it)
NARROW = 0.9                             # two layers: parts of the art's region narrower than 2 x this are poured solid


def art_zones():
    """the underside's reserved zones (solid pour, no mosaic): QR, wordmark, fab block, the lens, the switch window, the
    rail pads' labels (plan 5's RES). Layout frame."""
    z = dict(qr=rrect(QR_C[0], QR_C[1] - 0.5, QR_S + 1.2, QR_S + 2.2, 0.4),
             word=rrect(0.0, 2.6, 15.0, 2.8, 0.4),
             fab=rrect(0.0, -0.05, 8.0, 2.1, 0.4),
             lens=rrect(0.0, ZS, 10.6, 13.6, 0.8),
             sw=rrect(WIN['c'][0], WIN['c'][1], WIN['w'] + 4.6, WIN['h'] + 4.6, 0.4) if VARIANT != 'B' else rrect(WX - 2.6, ZS, 4.6, 8.6, 0.4),
             rail=rrect(14.2, 13.6, 7.8, 2.6, 0.4))
    return z


def lattice_joints(cells, region):
    """two layers (H3): the mosaic is the bottom's ground pour, so its triangles can't be islands. Every corner of a mosaic
    cell is joined to its lattice vertex by a short bar along the corner's bisector (JOINT_W wide); the six bars at a vertex
    meet, so every triangle connects to its neighbours and the grooves still run nearly corner to corner."""
    bars = []
    for poly, r, c in cells:
        if not poly.intersects(region):
            continue
        cen = poly.centroid
        for vx, vz in list(poly.exterior.coords)[:-1]:
            dx, dz = cen.x - vx, cen.y - vz
            d = math.hypot(dx, dz)
            bars.append(LineString([(vx, vz), (vx + dx / d * JOINT_L, vz + dz / d * JOINT_L)]).buffer(JOINT_W / 2, cap_style=1))
    return unary_union(bars)


def build_bottom(L, B, qr_url, seed=11):
    """bottom side: GND pour cut into a triangle mosaic (relief), sparse ENIG gold triangles, silk accents, QR, text.
    Two layers (F47.4, H3): the bottom also carries routes (the far layer's, B['far_nongnd']): the pour keeps POUR_CLR off
    them, and the mosaic's triangles are joined at their corners so the pour is one ground."""
    rnd = random.Random(seed)
    outline = L['outline']
    pads = L['pads']
    tht = [p for p in pads if p.get('drill') or p.get('slot')]
    tht_rings = unary_union([pad_poly(p) for p in tht])
    tht_open = unary_union([pad_poly(p, 0.05) for p in tht])
    region = outline.buffer(-(EDGE_BAND + 0.3)).difference(B['keep']).difference(ANT_KEEPOUT.buffer(0.25))
    region = region.difference(tht_rings.buffer(0.25))
    for h in L['npth']:
        if h['plated']:
            region = region.difference(Point(h['x'], h['z']).buffer(h['d'] / 2 + 0.75 + 0.3))
    nongnd_via = unary_union([Point(v['x'], v['z']).buffer(0.225) for v in B['vias'] if v['net'] != GND])
    region = region.difference(nongnd_via.buffer(0.2))
    if LAYERS == 2 and not B.get('far_nongnd', Polygon()).is_empty:
        region = region.difference(B['far_nongnd'].buffer(POUR_CLR))
    # reserved (solid pour, no mosaic): QR, wordmark, fab block, lens, switch window, the rail pads' labels (plan 5's RES)
    qr_c = QR_C; qr_s = QR_S
    reserved = unary_union(list(art_zones().values()))
    cells = tri_lattice(region)
    edges = []
    gold, silk_tri = [], []
    # duotone halftone gradient (#63): ENIG triangles thicken toward the rear corner on the user's right,
    # silk-outlined triangles toward the front wing on the user's left (layout frame: x = user's right)
    fg = np.array([17.5, -3.0]); fs = np.array([-17.0, 44.0])
    kinds = {}
    for poly, r, c in cells:
        cen = poly.centroid
        if not poly.intersects(region) or poly.intersects(reserved):
            continue
        edges.append(poly.exterior)
        if not region.contains(poly.buffer(0.05)):
            continue
        dg = math.hypot(cen.x - fg[0], cen.y - fg[1]); ds = math.hypot(cen.x - fs[0], cen.y - fs[1])
        pg = max(0.0, 1.0 - dg / 21.0) ** 1.25 * 0.95
        ps = max(0.0, 1.0 - ds / 19.0) ** 1.25 * 0.8
        u = rnd.random()
        if u < pg:
            gold.append(rounded_inset(poly, 0.36, TRI_FILLET_GOLD)); kinds[id(poly)] = 'g'
        elif rnd.random() < ps:
            inner = rounded_inset(poly, 0.45, TRI_FILLET_SILK)
            if not inner.is_empty:
                silk_tri.append(inner.exterior.buffer(0.05, cap_style=2, join_style=2)); kinds[id(poly)] = 's'
    if not B.get('drop_bottom', Polygon()).is_empty:
        gold = [g for g in gold if not B['drop_bottom'].buffer(0.02).contains(g)]
    # the copper mosaic: every cell inset by half the 0.26 mm gap and its corners rounded on their own (F26.6); cells that
    # touch a reserved zone stay solid there, as before; the region's own edges cut the partial triangles, nothing else
    mos = [rounded_inset(poly, 0.13, TRI_FILLET) if not poly.intersects(reserved) else poly for poly, r, c in cells if poly.intersects(region)]
    joints = lattice_joints(cells, region) if LAYERS == 2 else Polygon()
    # two layers: where the region is too narrow for whole triangles (a strip between the bottom's routes, round a via, a neck
    # between holes) it is filled solid: the mosaic there would be fragments, and the ground needs the passage
    narrow = region.difference(region.buffer(-NARROW, join_style=2).buffer(NARROW, join_style=2)) if LAYERS == 2 else Polygon()
    l4 = region.intersection(unary_union(mos + [reserved, joints, narrow]))
    if not B.get('drop_bottom', Polygon()).is_empty:
        l4 = l4.difference(B['drop_bottom'].buffer(0.02))        # copper tied to no GND pad (board_geo, gnd.py): removed
    # GND ring copper around the THT pads stays as pads
    gold = unary_union(gold)
    # --- bottom silk (reads correctly when viewed from below -> mirrored in x)
    lab = []
    M = qr_modules(qr_url, error='m')
    lab.append(matrix_polys(M, qr_s, qr_c[0], qr_c[1], invert=True, quiet=1, mirror=True))
    lab.append(hershey_text('SCAN  FOR  THE  WEB  SOFTWARE', 0.5, qr_c[0], qr_c[1] - qr_s / 2 - 0.85, w=0.085, mirror=True))
    lab.append(outline_text('THESEUS', 1.9, 0.0, 2.6, tracking=0.5, mirror=True))
    # ON / OFF at the switch, readable from below: round its window (A) or beside the edge switch (B)
    if VARIANT == 'B':
        sq = (WX - 3.4, ZS - 2.15, WX - 1.0, ZS + 2.15)
    else:
        sq = square_cut_poly().bounds
    lab.append(outline_text('ON', 0.95, (sq[0] + sq[2]) / 2 + 0.2, sq[3] + 0.95, tracking=0.08, mirror=True))
    lab.append(outline_text('OFF', 0.95, (sq[0] + sq[2]) / 2 + 0.2, sq[1] - 0.95, tracking=0.08, mirror=True))
    lab.append(arrow(sq[0] - 0.75, (sq[1] + sq[3]) / 2, 2.6, 0))
    lab.append(arrow(sq[0] - 0.75, (sq[1] + sq[3]) / 2, 2.6, 180))
    lab.append(hershey_text('POWER', 0.5, sq[0] - 1.6, (sq[1] + sq[3]) / 2, w=0.085, rot=90, mirror=True))
    # fab block, under the wordmark
    lab.append(hershey_text('94V-0  2611', 0.5, 0.0, 0.45, w=0.085, mirror=True))
    # the stack-up as built (F47.4: '2L  0.6mm  ENIG'; plan 5 as first built read '4L  1.0mm  ENIG')
    lab.append(hershey_text('%dL  %.1fmm  ENIG' % (LAYERS, BOARD_T), 0.45, 0.0, -0.5, w=0.08, mirror=True))
    # the rail test pads' names, over each pad (plan 5: the row at z 13.0)
    for ref, t_ in (('TP10', '1V8'), ('TP11', 'GND'), ('TP12', 'GND'), ('TP13', 'SNS')):
        c = next(c for c, f in L['comps'] if c['ref'] == ref)
        lab.append(hershey_text(t_, 0.45, c['x'], c['z'] + 1.25, w=0.08, mirror=True))
    lab.append(hershey_text('LT', 0.9, -16.0, 32.0, w=0.13, mirror=True))
    lab.append(hershey_text('RT', 0.9, 16.0, 32.0, w=0.13, mirror=True))
    # dashed rings around copper-free mounting holes (as on top)
    for k, (x, z, d, kind) in SORA_HOLES.items():
        if k in ('MH1', 'MH2'):
            lab.append(dashed_circle(x, z, d / 2 + 0.55))
    silk = unary_union(lab + silk_tri)
    silk = silk.difference(tht_open.buffer(0.1)).difference(gold.buffer(0.1)).intersection(outline.buffer(-(EDGE_BAND + 0.05)))
    for cut in L['cuts']:
        silk = silk.difference(cut.buffer(0.15))
    for h in L['npth']:
        silk = silk.difference(Point(h['x'], h['z']).buffer(h['d'] / 2 + 0.15))
    # for the 2D drawings (deck/tools/geo2d/board2d.py): each mosaic cell (centroid, pointing up?) and what it carries
    art = dict(s=2.45, origin=[0.0, -3.2], inset=dict(m=0.13, g=0.36, s=0.45), fillet=dict(m=TRI_FILLET, g=TRI_FILLET_GOLD, s=TRI_FILLET_SILK),
               cells=[(poly.centroid.x, poly.centroid.y, 1 if (c % 2 == 0) else 0, kinds.get(id(poly), 'm'))
                      for poly, r, c in cells if poly.intersects(region) and not poly.intersects(reserved)],
               reserved=reserved)
    return dict(l4=l4, gold=gold, silk=silk, tht_rings=tht_rings, region=region, art=art, joints=joints)
