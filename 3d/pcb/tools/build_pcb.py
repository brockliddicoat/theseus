# Build the Theseus main PCB: pcb.glb (geometry) + pcb-layout.json (animation/metadata).
#   python3 tools/build_pcb.py [--qr URL] [--no-components]
# Everything is deterministic (fixed seeds). Units: mm. Board top copper at local y = 0; the JS builder
# places the board in the mouse frame (default: board top at y = 5.03 mm, z shifted -2.88 mm).
import json, math, os, sys, time
import numpy as np
from shapely.geometry import Point, box, LineString, Polygon
from shapely.ops import unary_union
from shapely import affinity

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.abspath(os.path.join(HERE, '..'))
sys.path.insert(0, HERE)

from geom import Mesh, GLB, polys, cap, walls, raised, slab, cyl_mesh, trs
from layout import build as build_layout, pad_poly, drill_poly, trace_poly, ANT_KEEPOUT, EDGE_BAND
import board_geo as BG
from board_geo import build_board, T, CU, Y_MASK, Y_MASKCU, Y_PAD, Y_SILK, Y_L2, Y_L3, BEVEL, ybot
from silk import build_silk_top, build_bottom
from board import SORA_HOLES, wheel_cut_poly, square_cut_poly
from parts import GND

args = sys.argv[1:]
QR = BG.QR_URL
if '--qr' in args:
    QR = args[args.index('--qr') + 1]
WITH_COMPONENTS = '--no-components' not in args

# ------------------------------------------------------------------ materials (names are the contract with pcb.js)
MATS = {
    'mask': ((0.035, 0.037, 0.040, 1), 0.0, 0.42),
    'mask_b': ((0.035, 0.037, 0.040, 1), 0.0, 0.42),       # bottom mask cap (separate so X-ray keeps a dark floor)
    'mask_cu': ((0.055, 0.060, 0.062, 1), 0.0, 0.36),      # mask over L1 GND pour
    'mask_tr': ((0.055, 0.060, 0.062, 1), 0.0, 0.36),      # mask over L1 signal/power traces (lit up in X-ray)
    'mask_cub': ((0.055, 0.060, 0.062, 1), 0.0, 0.36),     # mask over L4 (bottom) copper art
    'enig': ((0.89, 0.74, 0.44, 1), 1.0, 0.30),
    'edge_gold': ((0.89, 0.74, 0.44, 1), 1.0, 0.26),
    'silk': ((0.93, 0.93, 0.90, 1), 0.0, 0.78),
    'fr4': ((0.36, 0.33, 0.22, 1), 0.0, 0.75),
    'cu_inner': ((0.82, 0.50, 0.32, 1), 1.0, 0.35),
    'cu_l2': ((0.82, 0.50, 0.32, 1), 1.0, 0.35),
    'cu_l3': ((0.82, 0.50, 0.32, 1), 1.0, 0.35),
    'cu_via': ((0.82, 0.50, 0.32, 1), 1.0, 0.35),
    'solder': ((0.82, 0.83, 0.85, 1), 1.0, 0.16),
    'epoxy': ((0.05, 0.05, 0.055, 1), 0.0, 0.48),
    'laser': ((0.22, 0.22, 0.23, 1), 0.0, 0.65),
    'ceramic': ((0.62, 0.53, 0.40, 1), 0.0, 0.62),
    'tin': ((0.74, 0.75, 0.76, 1), 1.0, 0.34),
    'nickel': ((0.72, 0.72, 0.70, 1), 1.0, 0.30),
    'steel': ((0.80, 0.81, 0.83, 1), 1.0, 0.20),
    'black_plastic': ((0.03, 0.03, 0.035, 1), 0.0, 0.55),
    'white_plastic': ((0.90, 0.88, 0.82, 1), 0.0, 0.50),
    'blue_plastic': ((0.10, 0.40, 0.78, 1), 0.0, 0.45),
    'module_pcb': ((0.07, 0.22, 0.52, 1), 0.0, 0.40),
    'ferrite': ((0.11, 0.11, 0.12, 1), 0.0, 0.58),
    'label': ((0.95, 0.95, 0.93, 1), 0.0, 0.60),
    'clear': ((0.92, 0.95, 1.0, 0.35), 0.0, 0.05),
    'wire_red': ((0.70, 0.08, 0.06, 1), 0.0, 0.45),
    'wire_black': ((0.05, 0.05, 0.05, 1), 0.0, 0.45),
    'wire_white': ((0.88, 0.88, 0.86, 1), 0.0, 0.45),
    'wire_yellow': ((0.86, 0.68, 0.10, 1), 0.0, 0.45),
    'pom': ((0.92, 0.92, 0.89, 1), 0.0, 0.42),
    'rubber': ((0.06, 0.06, 0.065, 1), 0.0, 0.85),
    'gt01_cover': ((0.12, 0.12, 0.13, 0.85), 0.0, 0.25),
    'kapton': ((0.85, 0.55, 0.10, 0.9), 0.0, 0.3),
}


def S(g, tol=0.004):
    """simplify for meshing (buffers default to 16 segments per quarter circle; 4 um tolerance is invisible)"""
    return g.simplify(tol, preserve_topology=True)


def board_meshes(L, B, SB, silk_top):
    """returns dict name -> list of (Mesh, material)"""
    out = {}
    outline, core = B['outline'], B['core']
    # ---- FR4 core with mask on both faces; edges: plated outline, plated square window + PTH, bare elsewhere
    m_mask, m_mask_b = Mesh(), Mesh()
    cap(m_mask, core, Y_MASK, up=True)
    cap(m_mask_b, core, ybot(Y_MASK), up=False)
    m_edge_gold, m_fr4 = Mesh(), Mesh()
    sq = square_cut_poly()
    mh_plated = [Point(h['x'], h['z']) for h in L['npth'] if h['plated']]
    for p in polys(core):
        rings = [('ext', p.exterior)] + [('int', r) for r in p.interiors]
        for kind, ring in rings:
            rp = Polygon(ring)
            c = rp.representative_point()
            if kind == 'ext':
                tgt = m_edge_gold
            else:
                is_tht = any(rp.buffer(0.02).contains(Point(q['x'], q['z'])) for q in L['pads'] if q.get('drill') or q.get('slot'))
                is_sq = rp.buffer(0.05).contains(sq.centroid) and rp.area < 30
                is_mh = any(rp.buffer(0.05).contains(q) for q in mh_plated)
                tgt = m_edge_gold if (is_tht or is_sq or is_mh) else m_fr4
            from geom import ring_walls
            ring_walls(tgt, list(ring.coords), kind == 'int', Y_MASK, ybot(Y_MASK))
    out['board_core'] = [(m_mask, 'mask'), (m_mask_b, 'mask_b'), (m_edge_gold, 'edge_gold'), (m_fr4, 'fr4')]
    # ---- top copper relief under mask: GND pour islands vs signal/power trace islands (identical material by
    #      default; separate so the X-ray state can light the routing and dim the pour)
    sig = unary_union([B['nongnd_tr'], B['nongnd_via']]).buffer(-0.01)
    tr_parts, pour_parts = [], []
    for q in polys(B['relief_top']):
        (tr_parts if q.intersects(sig) else pour_parts).append(q)
    m_pour, m_tr = Mesh(), Mesh()
    raised(m_pour, S(unary_union(pour_parts), 0.005), Y_MASK, Y_MASKCU, bevel=BEVEL)
    raised(m_tr, S(unary_union(tr_parts), 0.004), Y_MASK, Y_MASKCU, bevel=BEVEL)
    out['top_relief'] = [(m_pour, 'mask_cu'), (m_tr, 'mask_tr')]
    # ---- exposed ENIG: pads, edge trim, plated rings
    m = Mesh()
    raised(m, S(B['pads_top'], 0.003), Y_MASK - 0.01, Y_PAD, bevel=0.0)
    out['top_pads'] = [(m, 'enig')]
    m = Mesh()
    tt = S(B['trim_top'], 0.004)
    raised(m, tt, Y_MASK - 0.01, Y_PAD, bevel=0.0)
    raised(m, tt, ybot(Y_MASK - 0.01), ybot(Y_PAD), bevel=0.0, bottom=True)
    out['trim'] = [(m, 'edge_gold')]
    # ---- top silk
    m = Mesh()
    cap(m, S(silk_top, 0.006), Y_SILK, up=True)
    out['top_silk'] = [(m, 'silk')]
    # ---- bottom: L4 relief (triangle mosaic pour), ENIG accents + THT rings, silk
    l4 = SB['l4'].difference(unary_union([pad_poly(q, 0.05) for q in L['pads'] if q.get('drill') or q.get('slot')]))
    l4 = l4.difference(SB['gold'].buffer(0.05))
    # tented GND vias on the bottom too
    vring = unary_union([Point(v['x'], v['z']).buffer(v['d'] / 2, quad_segs=10) for v in B['vias']])
    vholes = unary_union([Point(v['x'], v['z']).buffer(v['drill'] / 2 + 0.01, quad_segs=8) for v in B['vias']])
    l4 = unary_union([l4, vring]).difference(vholes).difference(B['trim_top'].buffer(0.02))
    m = Mesh()
    raised(m, S(l4, 0.005), ybot(Y_MASK), ybot(Y_MASKCU), bevel=BEVEL, bottom=True)
    out['bot_relief'] = [(m, 'mask_cub')]
    m = Mesh()
    bot_tht = SB['tht_rings'].difference(unary_union(B['tht_holes']))
    raised(m, S(unary_union([bot_tht, SB['gold']]), 0.003), ybot(Y_MASK - 0.01), ybot(Y_PAD), bevel=0.0, bottom=True)
    out['bot_pads'] = [(m, 'enig')]
    m = Mesh()
    cap(m, S(SB['silk'], 0.006), ybot(Y_SILK), up=False)
    out['bot_silk'] = [(m, 'silk')]
    # ---- inner layers (visible in X-ray)
    m = Mesh()
    l2s = S(B['l2'], 0.01)
    cap(m, l2s, Y_L2, up=True); cap(m, l2s, Y_L2 - 0.001, up=False)
    out['inner_l2'] = [(m, 'cu_l2')]
    m = Mesh()
    l3 = S(unary_union([B['l3'], B['l3_vias']]), 0.006)
    cap(m, l3, Y_L3, up=True); cap(m, l3, Y_L3 - 0.001, up=False)
    out['inner_l3'] = [(m, 'cu_l3')]
    # via barrels (plated holes through the stack; tented, so only seen in X-ray)
    m = Mesh()
    bar = cyl_mesh(0.11, T + 0.02, seg=8, y0=-T - 0.01, top=False, bottom=False)
    for v in B['vias']:
        m.merge(bar, trs(v['x'], 0, v['z']))
    out['via_barrels'] = [(m, 'cu_via')]
    return out


def main():
    t0 = time.time()
    L = build_layout()
    B = build_board(L)
    silk_top, placed = build_silk_top(L, B, QR)
    SB = build_bottom(L, B, QR)
    print('layout + board polygons: %.1fs' % (time.time() - t0))
    meshes = board_meshes(L, B, SB, silk_top)
    glb = GLB()
    for k, (col, metal, rough) in MATS.items():
        glb.material(k, col, metal, rough, double=(k in ('cu_inner', 'cu_l2', 'cu_l3', 'cu_via', 'clear')), alpha=(col[3] < 1))
    board_children = []
    ntri = 0
    from components import mirrored
    for name, prims in meshes.items():
        prims = [(mirrored(m), mat) for m, mat in prims]      # layout (photo) frame -> physical frame: x -> -x
        mi = glb.mesh(name, prims)
        ntri += sum(m.ntri for m, _ in prims)
        if mi is not None:
            board_children.append(glb.node(name, mesh=mi, extras=dict(kind='board', layer='board')))
    comp_root_children = []
    comp_meta = []
    if WITH_COMPONENTS:
        import components as CP
        comp_root_children, comp_meta, n2 = CP.add_components(glb, L, B)
        ntri += n2
    board_node = glb.node('board', children=board_children, extras=dict(kind='group'))
    comp_node = glb.node('components', children=comp_root_children, extras=dict(kind='group'))
    root = glb.node('theseus_pcb', children=[board_node, comp_node], root=True,
                    extras=dict(units='mm', boardTopY=0.0, thickness=T))
    size = glb.write(os.path.join(OUT, 'pcb.glb'))
    print('pcb.glb: %.2f MB, %d triangles, %.1fs' % (size / 1e6, ntri, time.time() - t0))
    # ------------------------------------------------------------------ layout json (animation data + metadata)
    meta = dict(
        units='mm', frame="mouse/three.js (right-handed): +X = user's LEFT (side-button side), +Y up, +Z forward (nose); board top copper at local y=0. Authored in the photo/top-view frame (x = user's right) and mirrored x -> -x at export",
        boardTopY_in_mouse=5.03, boardOffsetZ_in_mouse=-2.88, thickness=T, qr=QR,
        outline=[[round(-c[0], 3), round(c[1], 3)] for c in B['outline'].exterior.coords],
        antennaKeepout=[-ANT_KEEPOUT.bounds[2], ANT_KEEPOUT.bounds[1], -ANT_KEEPOUT.bounds[0], ANT_KEEPOUT.bounds[3]],
        components=comp_meta,
        routes=[dict(net=t['net'], layer=t['layer'], w=t['w'], pts=[[round(-a, 3), round(b, 3)] for a, b in t['pts']]) for t in L['routes']],
        vias=[dict(net=v['net'], x=round(-v['x'], 3), z=round(v['z'], 3)) for v in B['vias']],
    )
    import power_paths
    pw = power_paths.paths(L)
    for mode in ('charge', 'run'):
        for sg in pw[mode]['segments']:
            sg['pts'] = [[-a, b] for a, b in sg['pts']]
    pw['nodes'] = {k: [-v[0], v[1]] for k, v in pw['nodes'].items()}
    meta['power'] = pw
    with open(os.path.join(OUT, 'pcb-layout.json'), 'w') as f:
        json.dump(meta, f, separators=(',', ':'))
    print('pcb-layout.json written')


if __name__ == '__main__':
    main()
