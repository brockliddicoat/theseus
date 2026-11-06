"""H3: plot GND copper by connected group (top left, bottom right); the main group grey, others coloured.
  python3 plot_gnd.py out.png"""
import os, sys
TOOLS = '/home/claude/theseus/3d/pcb/tools'; sys.path.insert(0, TOOLS); os.chdir(TOOLS)
import deps  # noqa
import numpy as np, matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.path import Path
from matplotlib.patches import PathPatch
from shapely.geometry import Point
from shapely.ops import unary_union
import gnd, layout as LY, board_geo as BG, silk as SK
from parts import GND
L = LY.build(); B = BG.build_board(L); SB = SK.build_bottom(L, B, BG.QR_URL)
ok, A = gnd.check(verbose=False); where = A["where"]
fig, axs = plt.subplots(1, 2, figsize=(22, 16), dpi=90)
def draw(ax, g, **kw):
    if g is None or g.is_empty: return
    for gg in getattr(g, 'geoms', [g]):
        if gg.geom_type != 'Polygon': continue
        verts, codes = [], []
        for ring in [gg.exterior] + list(gg.interiors):
            c = np.array(ring.coords); verts += list(c); codes += [Path.MOVETO] + [Path.LINETO] * (len(c) - 2) + [Path.CLOSEPOLY]
        ax.add_patch(PathPatch(Path(np.array(verts), codes), **kw))
gnd_tht = [p for p in L['pads'] if (p.get('drill') or p.get('slot')) and p['net'] == GND]
top = unary_union([B['pour'], B['gnd_pad'], B['gnd_tr']] + [LY.pad_poly(p) for p in gnd_tht])
bot = unary_union([SB['l4'], SB['gold']] + [LY.pad_poly(p) for p in gnd_tht])
cols = ['#e6194b', '#3cb44b', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c']
for ax, cu, title in ((axs[0], top, 'top GND'), (axs[1], bot, 'bottom GND')):
    draw(ax, L['board'], fc='#111', ec='k')
    for i, g in enumerate(getattr(cu, 'geoms', [cu])):
        draw(ax, g, fc=cols[i % len(cols)], ec='none', alpha=0.55)
    for t in L['routes']:
        if (t['layer'] == 'L1') == (ax is axs[0]): draw(ax, LY.trace_poly(t), fc='white', ec='none')
    for v in B['vias']:
        draw(ax, Point(v['x'], v['z']).buffer(0.225), fc='yellow' if v['net'] == GND else 'red', ec='k', lw=0.2)
    for k, r in where.items():
        pass
    ax.set_aspect('equal'); ax.set_xlim(-20, 20); ax.set_ylim(-8, 53); ax.set_title(title)
# mark the GND pads by group
from collections import Counter
cnt = Counter(where.values()); main = cnt.most_common(1)[0][0]
for p in L['pads']:
    k = '%s.%s' % (p['ref'], p['name'])
    if k in where and where[k] != main:
        for ax in axs: ax.plot(p['x'], p['z'], 'o', ms=10, mfc='none', mec='cyan', mew=2); axs[0].text(p['x'], p['z'] + 0.6, k, color='cyan', fontsize=8)
fig.tight_layout(); fig.savefig(sys.argv[1])
