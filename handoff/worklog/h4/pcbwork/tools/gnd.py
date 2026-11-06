# Ground connectivity on the two-layer board (H3, F47.4).  python3 tools/gnd.py   (PCB_VARIANT=A|B)
# On four layers every GND pad reached the solid L2 plane through a via, so layout.py's DRC left GND out. On two layers the
# ground is the top pour (cut into islands by the top routes), the bottom's art pour (the triangle mosaic, its corners joined,
# cut back round the bottom routes, solid where it is too narrow for whole triangles), the gold triangles, the plated rings
# and the GND vias that tie the two faces together. analyze() builds that copper per face, joins what touches on a face and
# what a GND via or a plated GND hole joins between the faces, and finds the pieces every GND pad lands in. repair_vias()
# proposes a GND via wherever a piece cut off from the main ground overlaps a main-ground piece on the other face (board_geo
# adds them: the stitching's "repair" vias). Run as a script it is the check: exit status 1 if the ground is split.
import math, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import deps  # noqa: F401
from shapely.geometry import Point, box
from shapely.ops import unary_union
from shapely.strtree import STRtree
from parts import GND
from stackup import LAYERS

VIA_D, VIA_CLR = 0.45, 0.12


def _ring(h):
    return Point(h['x'], h['z']).buffer(h['d'] / 2 + 0.75, quad_segs=24).difference(Point(h['x'], h['z']).buffer(h['d'] / 2, quad_segs=24))


def analyze(L, B, SB):
    import layout as LY
    pads = L['pads']
    tht = [p for p in pads if p.get('drill') or p.get('slot')]
    gnd_smd = [p for p in pads if p['net'] == GND and not (p.get('drill') or p.get('slot'))]
    gnd_tht = [p for p in tht if p['net'] == GND]
    mh = [h for h in L['npth'] if h['plated']]
    vias = [v for v in B['vias'] if v['net'] == GND]
    vring = [Point(v['x'], v['z']).buffer(v.get('d', VIA_D) / 2) for v in vias]
    top = unary_union([B['pour'], B['gnd_pad'], B['gnd_tr']] + [LY.pad_poly(p) for p in gnd_tht] + [_ring(h) for h in mh] + vring)
    bot = unary_union([SB['l4'], SB['gold']] + [LY.pad_poly(p) for p in gnd_tht] + [_ring(h) for h in mh] + vring)
    pieces = [('T', g) for g in getattr(top, 'geoms', [top]) if not g.is_empty] + [('B', g) for g in getattr(bot, 'geoms', [bot]) if not g.is_empty]
    parent = list(range(len(pieces)))

    def f(a):
        while parent[a] != a:
            parent[a] = parent[parent[a]]; a = parent[a]
        return a
    tree = STRtree([g for _, g in pieces])
    links = [Point(v['x'], v['z']) for v in vias] + [Point(p['x'], p['z']).buffer(0.05) for p in gnd_tht] + \
            [Point(h['x'], h['z']).buffer(h['d'] / 2 + 0.3) for h in mh]
    for q in links:
        qq = q.buffer(0.1)
        hit = [int(i) for i in tree.query(qq) if pieces[int(i)][1].intersects(qq)]
        for i in hit[1:]:
            parent[f(i)] = f(hit[0])
    where = {}
    for p in gnd_smd + gnd_tht:
        q = Point(p['x'], p['z'])
        hit = [int(i) for i in tree.query(q) if pieces[int(i)][0] == 'T' and pieces[int(i)][1].intersects(q)]
        where['%s.%s' % (p['ref'], p['name'])] = f(hit[0]) if hit else None
    roots = {}
    for k, r in where.items():
        roots.setdefault(r, []).append(k)
    return dict(pieces=pieces, root=[f(i) for i in range(len(pieces))], where=where, roots=roots, vias=vias, gnd_tht=gnd_tht, mh=mh)


def repair_vias(L, B, SB, A=None):
    """one GND via per cut-off group: where one of its pieces overlaps a piece of the main ground on the other face, at a spot
    clear of every pad, body, hole, existing via and the underside art's QR / wordmark / fab block"""
    import layout as LY
    import silk as SK
    A = A or analyze(L, B, SB)
    roots = {r: ks for r, ks in A['roots'].items() if r is not None}
    main = max(roots, key=lambda r: len(roots[r]))
    pieces, root = A['pieces'], A['root']
    # targets: every group of GND pads cut off from the main ground, and every floating piece of copper over 1 mm2 (copper
    # tied to nothing is an antenna: stitch it to the ground if a via fits, as a board house's DFM check would ask)
    targets = [r for r in roots if r != main]
    seen = set(roots)
    for i, (fi, gi) in enumerate(pieces):
        if root[i] not in seen and gi.area > 1.0:
            targets.append(root[i]); seen.add(root[i])
    if not targets:
        return []
    pads = L['pads']
    avoid = unary_union([LY.pad_poly(p).buffer(VIA_D / 2 + 0.05 + 0.02) for p in pads if not (p.get('drill') or p.get('slot'))] +
                        [LY.pad_poly(p).buffer(VIA_D / 2 + VIA_CLR) for p in pads if (p.get('drill') or p.get('slot'))] +
                        [B['bodies'].buffer(0.2), B['keep'].buffer(VIA_D / 2 + 0.02), LY.ANT_KEEPOUT.buffer(VIA_D / 2 + 0.02)] +
                        [Point(v['x'], v['z']).buffer(VIA_D + VIA_CLR) for v in B['vias']] +
                        [SK.art_zones()[k].buffer(VIA_D / 2 + 0.05) for k in SK.ART_KEEP] +
                        [Point(h['x'], h['z']).buffer(h['d'] / 2 + 0.75 + VIA_D / 2 + VIA_CLR) for h in L['npth'] if h['plated']])
    inside = L['outline'].buffer(-(LY.EDGE_BAND + LY.CU_EDGE + VIA_D / 2))
    out = []
    for r in targets:
        best = None
        for i, (fi, gi) in enumerate(pieces):
            if root[i] != r:
                continue
            for j, (fj, gj) in enumerate(pieces):
                if root[j] != main or fj == fi or not gi.intersects(gj):
                    continue
                spot = gi.intersection(gj).buffer(-(VIA_D / 2 + 0.03)).intersection(inside).difference(avoid)
                if spot.is_empty:
                    continue
                for g in getattr(spot, 'geoms', [spot]):
                    if g.geom_type != 'Polygon' or g.area < 1e-4:
                        continue
                    pt = g.representative_point()
                    if best is None or g.area > best[0]:
                        best = (g.area, pt)
        if best:
            out.append((round(best[1].x, 3), round(best[1].y, 3)))
    return out


def check(verbose=True):
    import layout as LY
    import board_geo as BG
    import silk as SK
    L = LY.build()
    B = BG.build_board(L)
    SB = SK.build_bottom(L, B, BG.QR_URL)
    A = analyze(L, B, SB)
    roots = A['roots']
    ok = len(roots) == 1 and None not in roots
    if verbose:
        pcs = A['pieces']
        print('GND (%d layers): %d copper pieces (%d top, %d bottom), %d GND vias (%d repair), %d plated GND holes; %d GND pads in %d group(s)'
              % (LAYERS, len(pcs), sum(1 for s, _ in pcs if s == 'T'), sum(1 for s, _ in pcs if s == 'B'), len(A['vias']),
                 len(B.get('repair_vias', [])), len(A['gnd_tht']) + len(A['mh']), len(A['where']), len(roots)))
        if not ok:
            for r, ks in sorted(roots.items(), key=lambda kv: -len(kv[1])):
                print('   group', r, len(ks), sorted(ks)[:14])
        used = set(r for r in roots if r is not None)
        fl = [round(pcs[i][1].area, 2) for i in range(len(pcs)) if A['root'][i] not in used]
        print('   floating copper (no GND pad reaches it): %d pieces, %.1f mm2, largest %s' % (len(fl), sum(fl), sorted(fl, reverse=True)[:6]))
    return ok, A


if __name__ == '__main__':
    ok, _ = check()
    print('GND: one piece' if ok else 'GND: SPLIT')
    sys.exit(0 if ok else 1)
