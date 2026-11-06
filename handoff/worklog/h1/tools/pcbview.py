"""Quick routing review: python3 pcbview.py out.png [x0,z0,x1,z1] (run with cwd = 3d/pcb/tools)"""
import sys, math
sys.path.insert(0, '.')
import numpy as np
import matplotlib; matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import PathPatch
from matplotlib.path import Path
from shapely.geometry import Point, box
from shapely import affinity
import layout
from layout import pad_poly, trace_poly, drill_poly, ANT_KEEPOUT, EDGE_BAND

def draw(ax, g, **kw):
    if g.is_empty: return
    for gg in getattr(g, 'geoms', [g]):
        if gg.geom_type != 'Polygon': continue
        v, c = [], []
        for ring in [gg.exterior] + list(gg.interiors):
            a = np.array(ring.coords); v += list(a); c += [Path.MOVETO] + [Path.LINETO] * (len(a) - 2) + [Path.CLOSEPOLY]
        ax.add_patch(PathPatch(Path(np.array(v), c), **kw))

out = sys.argv[1]
z = [float(v) for v in sys.argv[2].split(',')] if len(sys.argv) > 2 else [-20, -8, 20, 54]
L = layout.build()
w, h = z[2] - z[0], z[3] - z[1]
fig = plt.figure(figsize=(w * 0.55, h * 0.55), dpi=90)
ax = fig.add_axes([0, 0, 1, 1]); ax.set_xlim(z[0], z[2]); ax.set_ylim(z[1], z[3]); ax.set_aspect('equal'); ax.axis('off')
fig.patch.set_facecolor('#f4f3ef')
draw(ax, L['board'], fc='#1b2a20', ec='#888', lw=0.6)
draw(ax, L['outline'].difference(L['outline'].buffer(-EDGE_BAND)), fc='#c8a24a', ec='none')
draw(ax, ANT_KEEPOUT, fc='#ff00ff18', ec='#ff00ff', lw=0.8, ls='--')
for t in L['routes']:
    if t['layer'] == 'L3':
        draw(ax, trace_poly(t), fc='#3a7bd5', ec='none', alpha=0.55)
for t in L['routes']:
    if t['layer'] == 'L1':
        draw(ax, trace_poly(t), fc='#d98c3f', ec='none', alpha=0.95)
for p in L['pads']:
    draw(ax, pad_poly(p), fc='#e8c172', ec='#7a5a1a', lw=0.3)
    d = drill_poly(p)
    if d is not None: draw(ax, d, fc='#f4f3ef', ec='k', lw=0.3)
for v in L['vias']:
    draw(ax, Point(v['x'], v['z']).buffer(v.get('d', 0.45) / 2), fc='#e8c172', ec='k', lw=0.3)
    draw(ax, Point(v['x'], v['z']).buffer(0.1), fc='#f4f3ef', ec='none')
for c, fp in L['comps']:
    bw, bh = fp['body']
    g = affinity.translate(affinity.rotate(box(-bw / 2, -bh / 2, bw / 2, bh / 2), c['rot'], origin=(0, 0)), c['x'], c['z'])
    draw(ax, g, fc='none', ec='#88ccff', lw=0.5)
    if z[0] <= c['x'] <= z[2] and z[1] <= c['z'] <= z[3]:
        ax.text(c['x'], c['z'], c['ref'], fontsize=7, color='w', ha='center', va='center', clip_on=True)
for p in L['pads']:
    if z[0] <= p['x'] <= z[2] and z[1] <= p['z'] <= z[3] and p['net'] not in ('GND',):
        ax.text(p['x'], p['z'], p['net'][:8], fontsize=4.2, color='k', ha='center', va='center', clip_on=True)
fig.savefig(out, facecolor=fig.get_facecolor())
print(out)
