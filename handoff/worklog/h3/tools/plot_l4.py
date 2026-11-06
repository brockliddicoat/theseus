"""H3: the underside's copper as the 3D build makes it (silk.build_bottom l4 + the bottom routes), seen from BELOW (mirrored),
with the reserved zones dashed. python3 plot_l4.py out.png [old]  (old: the backed-up four-layer tools)"""
import os, sys
TOOLS = '/home/claude/theseus/3d/pcb/tools' if 'old' not in sys.argv else '/home/claude/work/h3/oldtools'
sys.path.insert(0, TOOLS); os.chdir(TOOLS)
import deps  # noqa
import numpy as np, matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.path import Path
from matplotlib.patches import PathPatch
from shapely.ops import unary_union
from shapely import affinity
import layout as LY, board_geo as BG, silk as SK
L = LY.build(); B = BG.build_board(L); SB = SK.build_bottom(L, B, BG.QR_URL)
M = lambda g: affinity.scale(g, -1, 1, origin=(0, 0))
fig, ax = plt.subplots(figsize=(12, 17), dpi=100)
def draw(g, **kw):
    if g is None or g.is_empty: return
    for gg in getattr(g, 'geoms', [g]):
        if gg.geom_type != 'Polygon': continue
        verts, codes = [], []
        for ring in [gg.exterior] + list(gg.interiors):
            c = np.array(ring.coords); verts += list(c); codes += [Path.MOVETO] + [Path.LINETO] * (len(c) - 2) + [Path.CLOSEPOLY]
        ax.add_patch(PathPatch(Path(np.array(verts), codes), **kw))
draw(M(L['board']), fc='#2b2d33', ec='k')
draw(M(SB['l4']), fc='#121316', ec='#3a3d44', lw=0.3)
far = unary_union([LY.trace_poly(t) for t in L['routes'] if t['layer'] not in ('L1',)])
draw(M(far), fc='#121316', ec='#5a5f69', lw=0.5)
draw(M(SB['gold']), fc='#d9b25a', ec='none')
draw(M(SB['silk']), fc='#ebeae6', ec='none')
for z in getattr(SK, 'art_zones', lambda: {})().values():
    draw(M(z), fc='none', ec='#ffcc00', lw=0.6, ls='--')
ax.set_aspect('equal'); ax.set_xlim(-21, 21); ax.set_ylim(-9, 53)
fig.tight_layout(); fig.savefig(sys.argv[1])
