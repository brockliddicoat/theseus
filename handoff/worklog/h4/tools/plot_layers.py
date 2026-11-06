"""H4: both faces of the board in the layout frame (x = user's right, seen from above), USB pair highlighted.
  python3 plot_layers.py out.png [--zoom x0,z0,x1,z1] [--tools DIR]"""
import os, sys
a = sys.argv[1:]
TOOLS = a[a.index('--tools') + 1] if '--tools' in a else '/home/claude/theseus/3d/pcb/tools'
sys.path.insert(0, TOOLS); os.chdir(TOOLS)
import deps  # noqa
import numpy as np, matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.path import Path
from matplotlib.patches import PathPatch
from shapely.geometry import Point, box
from shapely.ops import unary_union
from shapely import affinity
import layout as LY, board_geo as BG, silk as SK
L = LY.build(); B = BG.build_board(L); SB = SK.build_bottom(L, B, BG.QR_URL)
zoom = [float(v) for v in a[a.index('--zoom') + 1].split(',')] if '--zoom' in a else [-21, -7, 21, 56]
W = zoom[2] - zoom[0]; H = zoom[3] - zoom[1]
fig, axs = plt.subplots(1, 2, figsize=(2 * 9, 9 * H / W + 0.6), dpi=120)
def draw(ax, g, **kw):
    if g is None or g.is_empty: return
    for gg in getattr(g, 'geoms', [g]):
        if gg.geom_type != 'Polygon': continue
        verts, codes = [], []
        for ring in [gg.exterior] + list(gg.interiors):
            c = np.array(ring.coords); verts += list(c); codes += [Path.MOVETO] + [Path.LINETO] * (len(c) - 2) + [Path.CLOSEPOLY]
        ax.add_patch(PathPatch(Path(np.array(verts), codes), **kw))
USB = ('USB_DP', 'USB_DN')
for k, ax in enumerate(axs):
    top = k == 0
    draw(ax, L['board'], fc='#1b1d21', ec='k', lw=0.6)
    if top:
        draw(ax, B['pour'], fc='#3b4a3f', ec='none')
    else:
        draw(ax, SB['l4'], fc='#3b4a3f', ec='none')
        draw(ax, SB['art']['reserved'], fc='none', ec='#ffcc00', lw=0.8, ls='--')
    draw(ax, LY.ANT_KEEPOUT, fc='#ff00ff18', ec='#ff00ff', lw=0.6, ls='--')
    for t in L['routes']:
        on = (t['layer'] == 'L1') == top
        col = '#00c8ff' if t['net'] == 'USB_DP' else ('#ff4fd8' if t['net'] == 'USB_DN' else ('#d08a4a' if on else '#d08a4a'))
        if on:
            draw(ax, LY.trace_poly(t), fc=col, ec='none', alpha=1.0 if t['net'] in USB else 0.85)
        else:
            draw(ax, LY.trace_poly(t), fc='none', ec=col, lw=0.3, alpha=0.35)
    for p in L['pads']:
        th = bool(p.get('drill') or p.get('slot'))
        if top or th:
            draw(ax, LY.pad_poly(p), fc='#e8c172' if p['net'] != 'GND' else '#a89a6a', ec='#7a5a1a', lw=0.2)
    for v in B['vias']:
        c = '#00c8ff' if v['net'] == 'USB_DP' else ('#ff4fd8' if v['net'] == 'USB_DN' else ('#9a8a60' if v['net'] == 'GND' else '#e8c172'))
        draw(ax, Point(v['x'], v['z']).buffer(v.get('d', 0.45) / 2), fc=c, ec='k', lw=0.2)
    if top:
        for c, fp in L['comps']:
            bw, bh = fp['body']
            g = affinity.translate(affinity.rotate(box(-bw / 2, -bh / 2, bw / 2, bh / 2), c['rot'], origin=(0, 0)), c['x'], c['z'])
            draw(ax, g, fc='none', ec='#88ccff', lw=0.4)
            if zoom[0] <= c['x'] <= zoom[2] and zoom[1] <= c['z'] <= zoom[3]:
                ax.text(c['x'], c['z'], c['ref'], fontsize=6, color='w', ha='center', va='center')
    ax.set_aspect('equal'); ax.set_xlim(zoom[0], zoom[2]); ax.set_ylim(zoom[1], zoom[3])
    ax.set_title('TOP (L1) from above' if top else 'BOTTOM (L4) from above (x-ray: x = user right)', fontsize=9)
    ax.grid(True, lw=0.15, color='#777'); ax.tick_params(labelsize=6)
    step = 1 if W < 20 else 2
    ax.set_xticks(np.arange(np.floor(zoom[0]), zoom[2] + 0.01, step)); ax.set_yticks(np.arange(np.floor(zoom[1]), zoom[3] + 0.01, step))
fig.tight_layout(); fig.savefig(a[0]); print(a[0])
