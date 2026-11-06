"""H3: plot the board's bottom side as the two-layer re-route sees it (layout frame, seen from above: x = the user's right):
outline, the art's region and reserved zones (QR, wordmark, fab block, lens, switch window, rail labels), THT pads, vias,
the antenna keep-out, the routes on the far layer (L3 on the 4-layer board, L4 on the 2-layer one) and, faint, L1.
  python3 plot_bottom.py out.png [--zoom x0,z0,x1,z1]
"""
import os, sys
TOOLS = '/home/claude/theseus/3d/pcb/tools'
sys.path.insert(0, TOOLS)
os.chdir(TOOLS)
import deps  # noqa: F401
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.path import Path
from matplotlib.patches import PathPatch
from shapely.geometry import Point
import layout as LY
import board_geo as BG
import silk as SK

L = LY.build()
B = BG.build_board(L)
SB = SK.build_bottom(L, B, BG.QR_URL)
art = SB['art']
fig, ax = plt.subplots(figsize=(14, 20), dpi=110)


def draw(g, **kw):
    if g is None or g.is_empty: return
    for gg in getattr(g, 'geoms', [g]):
        if gg.geom_type != 'Polygon': continue
        verts, codes = [], []
        for ring in [gg.exterior] + list(gg.interiors):
            c = np.array(ring.coords)
            verts += list(c); codes += [Path.MOVETO] + [Path.LINETO] * (len(c) - 2) + [Path.CLOSEPOLY]
        ax.add_patch(PathPatch(Path(np.array(verts), codes), **kw))


draw(L['board'], fc='#202326', ec='k', lw=0.8)
draw(SB['region'], fc='#2f3a33', ec='none')
draw(SB['l4'], fc='#3d5a45', ec='#5a7a62', lw=0.2)
draw(art['reserved'], fc='#ffcc0033', ec='#ffcc00', lw=1.0, ls='--')
draw(LY.ANT_KEEPOUT, fc='#ff00ff22', ec='#ff00ff', lw=0.8, ls='--')
far = [t for t in L['routes'] if t['layer'] != 'L1']
for t in L['routes']:
    if t['layer'] == 'L1':
        draw(LY.trace_poly(t), fc='#c8753340', ec='none')
for t in far:
    draw(LY.trace_poly(t), fc='#2ec4b6', ec='#0b6b62', lw=0.3)
for p in L['pads']:
    if p.get('drill') or p.get('slot'):
        draw(LY.pad_poly(p), fc='#e8c172', ec='#7a5a1a', lw=0.3)
for v in B['vias']:
    draw(Point(v['x'], v['z']).buffer(0.225), fc='#e8c172' if v['net'] != 'GND' else '#9a8a60', ec='k', lw=0.2)
for c, fp in L['comps']:
    if c['ref'] in ('U1', 'U2', 'U3', 'J1', 'J2', 'J3', 'SW1', 'SW2', 'ENC1', 'WB1', 'SW3'):
        ax.text(c['x'], c['z'], c['ref'], fontsize=7, color='#9cf', ha='center', va='center')
ax.set_aspect('equal')
a = sys.argv[1:]
if '--zoom' in a:
    z = [float(v) for v in a[a.index('--zoom') + 1].split(',')]
    ax.set_xlim(z[0], z[2]); ax.set_ylim(z[1], z[3])
    ax.set_xticks(np.arange(np.floor(z[0]), z[2], 1)); ax.set_yticks(np.arange(np.floor(z[1]), z[3], 1))
else:
    ax.set_xlim(-21, 21); ax.set_ylim(-9, 56)
    ax.set_xticks(np.arange(-20, 21, 2)); ax.set_yticks(np.arange(-8, 56, 2))
ax.grid(True, lw=0.2, color='#888'); ax.tick_params(labelsize=6)
fig.tight_layout(); fig.savefig(a[0]); plt.close(fig)
print('far-layer routes', len(far), {n: sum(1 for t in far if t['net'] == n) for n in sorted({t['net'] for t in far})})
