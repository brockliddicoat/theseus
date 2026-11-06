# Theseus PCB layout assembly + DRC + 2D plot.  python3 tools/layout.py [--plot out.png]
import json, math, sys, os
import numpy as np
import deps  # noqa: F401  (stand-ins for packages this machine lacks: shim/README.md)
from shapely.geometry import Polygon, Point, LineString, box, MultiPolygon, GeometryCollection
from shapely.ops import unary_union
from shapely import affinity
from board import theseus_outline, wheel_cut_poly, square_cut_poly, SORA_HOLES, rrect, P, BAY_TRIM
import parts
from parts import C, world_pads, FP, GND

HERE = os.path.dirname(os.path.abspath(__file__))
EDGE_BAND = 0.35          # ENIG edge trim width on top/bottom (Viper V4 Pro style)
CU_EDGE = 0.30            # copper (non-trim) to trim/edge clearance
CLR = 0.12                # copper-copper clearance
POUR_CLR = 0.20           # pour clearance to other nets
ANT_KEEPOUT = box(-6.6, 7.95, 6.6, 12.25)    # plan 5: under U1's antenna end (forward, toward the sensor) and 0.8 mm past it,
                                             # all layers, no copper (Raytac AN54LM-P20A: the long meander antenna)


def pad_poly(p, grow=0.0):
    w, h = p['w'] + 2 * grow, p['h'] + 2 * grow
    if p['shape'] == 'circle':
        g = Point(0, 0).buffer(w / 2, quad_segs=16)
    elif p['shape'] == 'oval':
        r = min(w, h) / 2
        g = LineString([(0, -(h / 2 - r)), (0, h / 2 - r)] if h > w else [(-(w / 2 - r), 0), (w / 2 - r, 0)]).buffer(r, quad_segs=12)
    else:
        r = min(p.get('r', 0) + grow, min(w, h) / 2 - 1e-4)
        g = rrect(0, 0, w, h, max(r, 0))
    g = affinity.rotate(g, p.get('rot', 0), origin=(0, 0))
    return affinity.translate(g, p['x'], p['z'])


def drill_poly(p):
    if p.get('drill'):
        return Point(p['x'], p['z']).buffer(p['drill'] / 2, quad_segs=16)
    if p.get('slot'):
        sw, sh = p['slot']; r = min(sw, sh) / 2
        g = LineString([(0, -(sh / 2 - r)), (0, sh / 2 - r)] if sh > sw else [(-(sw / 2 - r), 0), (sw / 2 - r, 0)]).buffer(r, quad_segs=12)
        return affinity.translate(affinity.rotate(g, p.get('rot', 0), origin=(0, 0)), p['x'], p['z'])
    return None


def trace_poly(t):
    return LineString(t['pts']).buffer(t['w'] / 2, quad_segs=8, cap_style=1, join_style=1)


def load():
    import importlib
    import routes
    importlib.reload(routes)
    return routes.ROUTES, routes.VIAS


def build():
    outline = theseus_outline()
    cuts = [c for c in (wheel_cut_poly(), square_cut_poly()) if not c.is_empty]
    npth = []
    for k, (x, z, d, kind) in SORA_HOLES.items():
        npth.append(dict(name=k, x=x, z=z, d=d, plated=k in ('MH3', 'MH4')))
    pads, comps = [], []
    for c in C:
        wp, fp = world_pads(c)
        pads += wp
        comps.append((c, fp))
        a = math.radians(c['rot'])
        for (x, z, d) in fp.get('npth', []):
            npth.append(dict(name=c['ref'] + '_AP', x=c['x'] + x * math.cos(a) - z * math.sin(a),
                             z=c['z'] + x * math.sin(a) + z * math.cos(a), d=d, plated=False))
        for (x, z, w, h) in fp.get('slots', []):
            g = affinity.translate(affinity.rotate(rrect(0, 0, w, h, min(w, h) / 2 - 0.01), c['rot'], origin=(0, 0)),
                                   c['x'] + x * math.cos(a) - z * math.sin(a), c['z'] + x * math.sin(a) + z * math.cos(a))
            cuts.append(g)
    board = outline.difference(unary_union(cuts + [Point(h['x'], h['z']).buffer(h['d'] / 2, quad_segs=24) for h in npth]))
    routes, vias = load()
    return dict(outline=outline, cuts=cuts, npth=npth, pads=pads, comps=comps, board=board, routes=routes, vias=vias)


def layer_items(L, layer):
    """copper items on a layer: list of (net, poly, kind, label, key) - key joins the same via/THT pad across layers"""
    items = []
    for p in L['pads']:
        through = bool(p.get('drill') or p.get('slot'))
        if layer == 'L1' or through:
            items.append((p['net'], pad_poly(p), 'pad', '%s.%s' % (p['ref'], p['name']), 'pad:%s.%s' % (p['ref'], p['name'])))
    for i, t in enumerate(L['routes']):
        if t['layer'] == layer:
            items.append((t['net'], trace_poly(t), 'trace', t['net'], 'tr:%d' % i))
    for i, v in enumerate(L['vias']):
        items.append((v['net'], Point(v['x'], v['z']).buffer(v.get('d', 0.45) / 2, quad_segs=10), 'via', v['net'], 'via:%d' % i))
    return items


def drc(L, verbose=True):
    errs = []
    edge = L['outline'].exterior
    keep_edge = L['outline'].buffer(-(EDGE_BAND + CU_EDGE))
    hole_keep3 = unary_union([g.buffer(CU_EDGE) for g in L['cuts']] +
                             [Point(h['x'], h['z']).buffer(h['d'] / 2 + CU_EDGE) for h in L['npth'] if not h['plated']])
    # on the top layer the wheel bay and the switch window carry gold trim (0.35 / 0.28 mm): traces keep CLR off it
    trims = [(wheel_cut_poly(), BAY_TRIM), (square_cut_poly(), 0.28)]
    hole_keep1 = unary_union([hole_keep3] + [c.buffer(t + CLR) for c, t in trims if not c.is_empty])
    for layer in ('L1', 'L3'):
        hole_keep = hole_keep1 if layer == 'L1' else hole_keep3
        items = layer_items(L, layer)
        for i, (n1, g1, k1, l1, _k1) in enumerate(items):
            if k1 == 'trace' or k1 == 'via':
                if not g1.within(keep_edge):
                    errs.append('%s %s %s too close to board edge' % (layer, k1, l1))
                if g1.intersects(hole_keep):
                    errs.append('%s %s %s too close to a cutout/hole at %s' % (layer, k1, l1, tuple(np.round(g1.intersection(hole_keep).centroid.coords[0], 2))))
                if g1.intersects(ANT_KEEPOUT):
                    errs.append('%s %s %s inside the antenna keep-out' % (layer, k1, l1))
            for j in range(i + 1, len(items)):
                n2, g2, k2, l2, _k2 = items[j]
                if n1 == n2 and n1 != 'NC':
                    continue
                if k1 == 'pad' and k2 == 'pad':
                    continue
                if g1.distance(g2) < CLR - 1e-6:
                    where = tuple(np.round(g1.buffer(CLR).intersection(g2).centroid.coords[0], 2)) if g1.buffer(CLR).intersects(g2) else ''
                    errs.append('%s clearance %s(%s) <-> %s(%s) at %s' % (layer, l1, k1, l2, k2, where))
    # pads (plan 5): every pad inside the board by the gold trim plus 0.15, clear of the cut-outs and copper-free holes, and
    # 0.15 from any other net's pad (two pads of one part on one net may touch)
    pad_in = L['outline'].buffer(-(EDGE_BAND + 0.15))
    cut_keep = unary_union([g.buffer(0.2) for g in L['cuts']] + [Point(h['x'], h['z']).buffer(h['d'] / 2 + 0.2) for h in L['npth'] if not h['plated']])
    pp = [(p, pad_poly(p)) for p in L['pads']]
    for p, g in pp:
        if not g.within(pad_in if p['net'] != GND else L['outline'].buffer(-0.15)):    # GND pads may meet the (GND) edge plating
            errs.append('pad %s.%s too close to the board edge' % (p['ref'], p['name']))
        if not (p.get('drill') or p.get('slot')) and g.intersects(cut_keep):
            errs.append('pad %s.%s too close to a cut-out or hole' % (p['ref'], p['name']))
        if g.intersects(ANT_KEEPOUT) and p['ref'] != 'U1':
            errs.append('pad %s.%s inside the antenna keep-out' % (p['ref'], p['name']))
    for i in range(len(pp)):
        for j in range(i + 1, len(pp)):
            (p, g), (q, h) = pp[i], pp[j]
            if p['net'] == q['net'] and p['net'] not in ('NC',):
                continue
            if g.distance(h) < 0.15 - 1e-6:
                errs.append('pads %s.%s (%s) and %s.%s (%s) %.3f apart' % (p['ref'], p['name'], p['net'], q['ref'], q['name'], q['net'], g.distance(h)))
    # vias clear of other nets' pads on L1 (already in layer_items) and of each other (any net) by 0.12
    vs = L['vias']
    for i in range(len(vs)):
        for j in range(i + 1, len(vs)):
            a, b = vs[i], vs[j]
            if math.hypot(a['x'] - b['x'], a['z'] - b['z']) < a.get('d', 0.45) / 2 + b.get('d', 0.45) / 2 + 0.12 - 1e-6:
                errs.append('vias %s (%.2f, %.2f) and %s (%.2f, %.2f) too close' % (a['net'], a['x'], a['z'], b['net'], b['x'], b['z']))
    # connectivity per net (L1+L3+vias/THT joined across layers), GND excluded (pour + plane)
    nets = {}
    for layer in ('L1', 'L3'):
        for (n, g, k, l, key) in layer_items(L, layer):
            nets.setdefault(n, []).append((layer, g, k, l, key))
    for n, items in nets.items():
        if n in (GND, 'NC') or n.startswith('NC_'):
            continue
        parent = list(range(len(items)))
        def f(a):
            while parent[a] != a:
                parent[a] = parent[parent[a]]; a = parent[a]
            return a
        for i in range(len(items)):
            for j in range(i + 1, len(items)):
                li, gi, ki, _, keyi = items[i]; lj, gj, kj, _, keyj = items[j]
                internal = (ki == 'pad' and kj == 'pad' and items[i][3].split('.')[0] == items[j][3].split('.')[0]
                            and items[i][3].split('.')[0] in ('U4',))      # flow-through ESD: pins 1-6 / 3-4 tied inside
                if keyi == keyj or internal or (li == lj and gi.intersects(gj)):
                    parent[f(i)] = f(j)
        groups = {}
        for i in range(len(items)):
            groups.setdefault(f(i), set()).add(items[i][3])
        pads_in = [sorted(l for l in labels if '.' in l) for labels in groups.values()]
        pads_in = [p for p in pads_in if p]
        if len(pads_in) > 1:
            errs.append('net %s split into %d groups: %s' % (n, len(pads_in), pads_in))
    if verbose:
        print('DRC: %d issues' % len(errs))
        for e in errs[:80]:
            print('  ', e)
    return errs


NET_COL = {'VBUS': '#ff5a36', 'VBAT': '#ff9f1c', 'VBAT_RAW': '#ff9f1c', 'VSYS': '#ffd23f', 'PVDD': '#ffe08a',
           'VDD_1V8': '#3bceac', 'VDD_SNS': '#0ead69', 'SW_B1': '#9b5de5', 'SW_B2': '#9b5de5', 'GND': '#666666',
           'USB_DP': '#00bbf9', 'USB_DN': '#00bbf9', 'VBUSOUT': '#ff8c69'}


def plot(L, out, zoom=None):
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    from matplotlib.patches import Polygon as MP
    fig, ax = plt.subplots(figsize=(14, 20) if not zoom else (14, 14), dpi=110)
    from matplotlib.path import Path
    from matplotlib.patches import PathPatch
    def draw(g, **kw):
        if g.is_empty: return
        geoms = getattr(g, 'geoms', [g])
        for gg in geoms:
            if gg.geom_type != 'Polygon': continue
            verts, codes = [], []
            for ring in [gg.exterior] + list(gg.interiors):
                c = np.array(ring.coords)
                verts += list(c); codes += [Path.MOVETO] + [Path.LINETO] * (len(c) - 2) + [Path.CLOSEPOLY]
            ax.add_patch(PathPatch(Path(np.array(verts), codes), **kw))
    draw(L['board'], fc='#1d2a1f', ec='k', lw=0.8)
    draw(L['outline'].difference(L['outline'].buffer(-EDGE_BAND)), fc='#d4a93c', ec='none')
    draw(ANT_KEEPOUT, fc='#ff00ff22', ec='#ff00ff', lw=0.8, ls='--')
    for t in L['routes']:
        col = NET_COL.get(t['net'], '#c87533' if t['layer'] == 'L1' else '#4f7cff')
        draw(trace_poly(t), fc=col if t['layer'] == 'L1' else 'none', ec=col, lw=0.6 if t['layer'] != 'L1' else 0.2,
             alpha=0.95 if t['layer'] == 'L1' else 0.9, ls='-' if t['layer'] == 'L1' else '--')
    for p in L['pads']:
        draw(pad_poly(p), fc='#e8c172', ec='#7a5a1a', lw=0.3)
        d = drill_poly(p)
        if d is not None: draw(d, fc='white', ec='k', lw=0.3)
    for v in L['vias']:
        draw(Point(v['x'], v['z']).buffer(0.225), fc='#e8c172', ec='k', lw=0.3)
        draw(Point(v['x'], v['z']).buffer(0.1), fc='white', ec='none')
    for (c, fp) in L['comps']:
        bw, bh = fp['body']
        g = affinity.translate(affinity.rotate(box(-bw / 2, -bh / 2, bw / 2, bh / 2), c['rot'], origin=(0, 0)), c['x'], c['z'])
        draw(g, fc='none', ec='#88ccff', lw=0.6)
        ax.text(c['x'], c['z'], c['ref'], fontsize=6 if not zoom else 9, color='w', ha='center', va='center')
    # pad net labels
    if zoom:
        for p in L['pads']:
            if p['net'] not in ('NC',):
                ax.text(p['x'], p['z'], p['net'][:7], fontsize=4.5, color='k', ha='center', va='center', rotation=0)
    ax.set_aspect('equal')
    if zoom:
        ax.set_xlim(zoom[0], zoom[2]); ax.set_ylim(zoom[1], zoom[3])
    else:
        ax.set_xlim(-21, 21); ax.set_ylim(-7, 56)
    ax.grid(True, lw=0.2, color='#888')
    ax.set_xticks(np.arange(-20, 21, 2) if not zoom else np.arange(math.floor(zoom[0]), zoom[2], 1))
    ax.set_yticks(np.arange(-6, 56, 2) if not zoom else np.arange(math.floor(zoom[1]), zoom[3], 1))
    ax.tick_params(labelsize=6)
    fig.tight_layout()
    fig.savefig(out)
    plt.close(fig)


if __name__ == '__main__':
    L = build()
    drc(L)
    a = sys.argv[1:]
    if '--plot' in a:
        out = a[a.index('--plot') + 1]
        z = None
        if '--zoom' in a:
            z = [float(v) for v in a[a.index('--zoom') + 1].split(',')]
        plot(L, out, z)
