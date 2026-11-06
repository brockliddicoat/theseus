"""board2d: the Theseus main board as flat 2D data for the deck's drawings (boardMM), straight from the PCB tools (H1).

  python3 tools/geo2d/board2d.py [out.json]        (default deck/geo2d/board2d.json; both variants, A and B)

Layout frame: x = the user's right, z = toward the nose (mm). The deck draws it with y = -z (nose up); seen from below,
x is mirrored. Every polygon is [outer ring, hole rings...], each ring [[x, z], ...], simplified to 0.01 mm and rounded to
0.01. Contents per variant:
  outline, holes [x, z, r, plated], cuts (the wheel bay; A's switch window), trim (the gold edge band's width)
  top:    pour (the L1 GND pour, under the mask), traces [layer, w, pts] (L1; L3 for x-ray), vias [x, z], pads (ENIG),
          silk, parts [ref, fp, x, z, rot, w, h, value]
  bottom: art (the triangle mosaic: lattice s, origin, insets, fillets; cells [x, z, up, kind m/g/s]; region; reserved),
          silk, tht (the plated rings on the underside), lens (the clip-on lens's stadium)
"""
import json, os, sys, importlib
HERE = os.path.dirname(os.path.abspath(__file__))
DECK = os.path.abspath(os.path.join(HERE, '..', '..')); R3 = os.path.abspath(os.path.join(DECK, '..', '3d'))
TOOLS = os.path.join(R3, 'pcb', 'tools'); sys.path.insert(0, TOOLS)
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(DECK, 'geo2d', 'board2d.json')

r2 = lambda v: round(float(v) + 0.0, 2)


def rings(g, tol=0.01):
    """shapely (Multi)Polygon -> [[outer, holes...], ...]"""
    if g is None or g.is_empty: return []
    g = g.simplify(tol)
    out = []
    for p in getattr(g, 'geoms', [g]):
        if p.geom_type != 'Polygon' or p.area < 1e-4: continue
        out.append([[[r2(x), r2(z)] for x, z in list(r.coords)[:-1]] for r in [p.exterior] + list(p.interiors)])
    return out


def build(variant):
    os.environ['PCB_VARIANT'] = variant
    for m in ('board', 'parts', 'routes', 'layout', 'board_geo', 'silk'):     # re-read every module for this variant
        if m in sys.modules: importlib.reload(sys.modules[m])
    import deps  # noqa: F401
    import board as BD, layout as LY, board_geo as BG, silk as SK
    from shapely.geometry import Point
    from shapely.ops import unary_union
    L = LY.build(); B = BG.build_board(L); SB = SK.build_bottom(L, B, BG.QR_URL)
    silk_top, _ = SK.build_silk_top(L, B, BG.QR_URL)
    pads_top = unary_union([LY.pad_poly(p) for p in L['pads']])
    tht = [p for p in L['pads'] if p.get('drill') or p.get('slot')]
    holes = [[r2(h['x']), r2(h['z']), r2(h['d'] / 2), 1 if h.get('plated') else 0] for h in L['npth']]
    holes += [[r2(p['x']), r2(p['z']), r2((p.get('drill') or 0) / 2), 2] for p in tht if p.get('drill')]
    parts = []
    for c, fp in L['comps']:
        bw, bh = fp['body']
        parts.append([c['ref'], c['fp'], r2(c['x']), r2(c['z']), c['rot'], r2(bw), r2(bh), c.get('value', '')])
    art = SB['art']
    pour = B['pour'] if 'pour' in B else None
    lens = dict(c=[0.0, r2(next(c['z'] for c, f in L['comps'] if c['ref'] == 'U3'))], hw=2.6, hl=7.1)
    return dict(
        variant=variant, trim=BD.BAY_TRIM, edgeBand=LY.EDGE_BAND,
        outline=rings(L['outline'])[0][0], holes=holes, cuts=[r for c in L['cuts'] for r in rings(c)],
        top=dict(pour=rings(pour, 0.02) if pour is not None else [],
                 traces=[[t['layer'], t['w'], [[r2(x), r2(z)] for x, z in t['pts']]] for t in L['routes']],
                 vias=[[r2(v['x']), r2(v['z'])] for v in B['vias']],
                 pads=rings(pads_top), silk=rings(silk_top), parts=parts,
                 keepout=[r2(v) for v in LY.ANT_KEEPOUT.bounds]),
        bottom=dict(art=dict(s=art['s'], origin=art['origin'], inset=art['inset'], fillet=art['fillet'],
                             cells=[[r2(x), r2(z), up, k] for x, z, up, k in art['cells']],
                             region=rings(SB['region'], 0.02), reserved=rings(art['reserved'], 0.02)),
                    silk=rings(SB['silk']), tht=rings(SB['tht_rings']), lens=lens),
    )


if __name__ == '__main__':
    D = dict(note='The Theseus main board (3d/pcb, board plan 5) as 2D data, made by deck/tools/geo2d/board2d.py from the '
                  'PCB tools. Layout frame mm: x = the user\'s right, z = the nose. A: the switch in its window (the deck\'s '
                  'board); B: the edge switch (renders).',
             frame=dict(x='the user\'s right', z='the nose', mouseZ='z - 2.88', boardTopY=5.03),
             A=build('A'), B=build('B'))
    s = json.dumps(D, separators=(',', ':'))
    open(OUT + '.tmp', 'w').write(s); os.replace(OUT + '.tmp', OUT)
    print(OUT, '%.0f KB' % (len(s) / 1024))
