"""check the top silk's fixed labels against component bodies, pads, cuts, holes and the edge (plan 5)"""
import os, sys
sys.path.insert(0, '/home/claude/theseus/3d/pcb/tools')
import deps  # noqa
from shapely.geometry import box, Point
from shapely.ops import unary_union
from shapely import affinity
from layout import build as build_layout, pad_poly, EDGE_BAND
from board_geo import build_board, QR_URL
import silk
L = build_layout(); B = build_board(L)
captured = []
orig_append = list.append
# re-run the label part by monkeypatching: simplest is to call build_silk_top and inspect 'label' items via a wrapper
src = open(silk.__file__).read()
i = src.index('    # --- labels'); j = src.index("    for g in lab:\n        items.append((g, 'label'))")
code = src[i:j]
comps = {c['ref']: (c, fp) for c, fp in L['comps']}
ns = dict(silk.__dict__); ns.update(comps=comps, qr_url=QR_URL)
exec(code.replace('\n    ', '\n'), ns)
lab = ns['lab']
bodies = {}
for ref, (c, fp) in comps.items():
    bw, bh = fp['body']
    bodies[ref] = affinity.translate(affinity.rotate(box(-bw / 2, -bh / 2, bw / 2, bh / 2), c['rot'], origin=(0, 0)), c['x'], c['z'])
pads = {}
for p in L['pads']:
    pads.setdefault(p['ref'], []).append(pad_poly(p))
inside = L['outline'].buffer(-(EDGE_BAND + 0.05))
for k, g in enumerate(lab):
    b = g.bounds; hits = []
    for ref, bd in bodies.items():
        if g.intersects(bd.buffer(0.05)) and ref not in ('SW1', 'SW2'): hits.append('body ' + ref)
    for ref, ps in pads.items():
        if any(g.intersects(pp.buffer(0.1)) for pp in ps): hits.append('pad ' + ref)
    for cut in L['cuts']:
        if g.intersects(cut.buffer(0.15)): hits.append('cut')
    for h in L['npth']:
        if g.intersects(Point(h['x'], h['z']).buffer(h['d'] / 2 + 0.2)): hits.append('hole')
    if not g.within(inside): hits.append('EDGE')
    print(k, '(%.1f,%.1f)-(%.1f,%.1f)' % b, ', '.join(sorted(set(hits))) or 'ok')
