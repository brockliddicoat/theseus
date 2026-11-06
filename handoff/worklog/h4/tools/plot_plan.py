"""H4: the planned USB re-route (not built) over the board as it is. -> shots/usb_plan_2026-11-06_1405.png"""
import os, sys
TOOLS = '/home/claude/theseus/3d/pcb/tools'
sys.path.insert(0, TOOLS); os.chdir(TOOLS)
import deps  # noqa
import numpy as np, matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.path import Path
from matplotlib.patches import PathPatch
from shapely.geometry import LineString, Point
import layout as LY
L = LY.build()
fig, ax = plt.subplots(figsize=(10, 14), dpi=110)
def draw(g, **kw):
    for gg in getattr(g, 'geoms', [g]):
        if gg.is_empty or gg.geom_type != 'Polygon': continue
        verts, codes = [], []
        for ring in [gg.exterior] + list(gg.interiors):
            c = np.array(ring.coords); verts += list(c); codes += [Path.MOVETO] + [Path.LINETO] * (len(c) - 2) + [Path.CLOSEPOLY]
        ax.add_patch(PathPatch(Path(np.array(verts), codes), **kw))
draw(L['board'], fc='#ecebe6', ec='#888', lw=0.8)
for t in L['routes']:
    draw(LY.trace_poly(t), fc='#c9c6bd' if t['layer'] == 'L1' else 'none', ec='#c9c6bd', lw=0.3)
for p in L['pads']:
    draw(LY.pad_poly(p), fc='#d8c89a', ec='none')
HP, W = 0.3075, 0.465
top = [(-9.68, 46.35), (-12.77, 46.35), (-13.27, 45.85), (-13.27, 16.0), (-16.88, 12.39), (-16.88, 2.6), (-15.98, 1.7), (-5.5, 1.7)]
bot = [(-0.25, 47.8525), (-5.3, 47.8525), (-6.8, 46.35)]
band = LineString(top).buffer(HP + W / 2 + 1.0, cap_style=2, join_style=2)
draw(band, fc='#2f6fb233', ec='#2f6fb2', lw=0.6, ls='--')
draw(LineString(bot).buffer(HP + W / 2 + 1.0, cap_style=2, join_style=2), fc='#d0703033', ec='#d07030', lw=0.6, ls='--')
for c, col in ((top, '#1f5fa8'), (bot, '#c0601a')):
    cl = LineString(c)
    for s in (1, -1):
        o = cl.offset_curve(s * HP, join_style='mitre')
        ax.plot(*zip(*o.coords), color=col, lw=2.2, solid_capstyle='butt')
sw = LineString(top[3:]).offset_curve(-1.25, join_style='mitre')
ax.plot(*zip(*sw.coords), color='#6a3d9a', lw=1.2, ls=(0, (3, 1.5)))
enc = [(-11.15, 37.75), (-8.0, 37.75), (-8.0, 27.6), (-10.8, 27.3), (-11.15, 16.0), (-12.0, 14.9), (-13.3, 11.5), (-13.3, 3.6), (-5.5, 3.3)]
ax.plot(*zip(*enc), color='#2a9d55', lw=1.2, ls=(0, (1, 1)))
vb = [(-2.4, 46.61), (-2.4, 45.1), (-4.9, 45.1), (-7.9, 41.6), (-7.9, 27.0), (-7.6, 16.3), (-10.6, 16.3)]
ax.plot(*zip(*vb), color='#b22222', lw=1.0, ls=(0, (4, 2)))
ax.annotate('', xy=(-8.0, 19.45), xytext=(-10.2, 19.45), arrowprops=dict(arrowstyle='->', color='k', lw=1.4))
notes = [((-17.5, 50.5), 'H4 plan, NOT BUILT (2026-11-06 14:05): the USB 2.0 pair at 0.465 / 0.15 mm (90 ohm, 2D field solve)'),
         ((-17.5, 49.6), 'blue: the pair on the top; shaded: its solid reference band underneath (1.0 mm past it)'),
         ((-17.5, 48.7), 'orange: the bottom run under the receptacle (reference: the top pour), up-vias east of U4'),
         ((-18.6, 31.5), 'purple dashed: SW1 NO/NC, west of the pair'),
         ((-6.8, 33.5), 'green dotted: encoder A/B\n(MH1 gap on top, under\nthe PMIC on the bottom,\nunder J3 on the top)'),
         ((-6.8, 44.2), 'red dashed: VBUS_L'),
         ((-10.0, 20.4), 'PMIC block +1.1 mm')]
for (x, z), s in notes:
    ax.text(x, z, s, fontsize=7.5, va='top')
ax.set_aspect('equal'); ax.set_xlim(-20, 8); ax.set_ylim(-7, 52); ax.set_xticks(range(-20, 9, 2)); ax.set_yticks(range(-6, 53, 2))
ax.tick_params(labelsize=6); ax.grid(lw=0.2, color='#aaa')
ax.set_title('layout frame (x = the user\'s right), top view, nose up', fontsize=8)
fig.tight_layout(); out = '/home/claude/work/h4/shots/usb_plan_2026-11-06_1405.png'; fig.savefig(out); print(out)
