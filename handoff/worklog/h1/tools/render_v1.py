"""the v1 board (git HEAD's 3d/pcb/pcb-layout.json) from above, schematic: outline, routes, parts. python3 render_v1.py out.png"""
import sys, json, numpy as np
import matplotlib; matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import Polygon as MPoly, FancyBboxPatch, Rectangle
L = json.load(open('/home/claude/work/h1/pcb-layout.v1.json'))
fig = plt.figure(figsize=(6.0, 8.6), dpi=100); fig.patch.set_facecolor('#F5F5F7')
ax = fig.add_axes([0, 0, 1, 1]); ax.set_aspect('equal'); ax.axis('off')
S = 13.5 / (100 / 25.4 * 72 / 72)   # not used
o = np.array(L['outline'], float); o[:, 0] *= -1
zc = (o[:, 1].min() + o[:, 1].max()) / 2
ax.set_xlim(-600 / 2 / 13.5, 600 / 2 / 13.5); ax.set_ylim(zc - 860 / 2 / 13.5, zc + 860 / 2 / 13.5)
ax.add_patch(MPoly(o, closed=True, fc='#16171a', ec='#d9b25a', lw=3.2, zorder=1))
for r in L['routes']:
    if r['layer'] != 'L1': continue
    a = np.array(r['pts'], float); a[:, 0] *= -1
    ax.plot(a[:, 0], a[:, 1], color='#2f3238', lw=max(0.6, r['w'] * 10), solid_capstyle='round', zorder=2)
SIZE = {'MODULE': (9.9, 13.3), 'SENSOR': (9.0, 11.0), 'QFN32': (5, 5), 'USBC': (8.94, 7.35), 'GT01': (5.8, 12.8), 'JSTSH3': (4.0, 4.25),
        'ENC': (3.8, 10.0), 'BRACKET': (5.4, 7.9), 'SLIDE': (1.8, 4.6), 'SLIDEB': (1.8, 5.2), 'TACT': (3.5, 2.9), 'L2016': (2.0, 1.6)}
COL = {'MODULE': '#0e0f11', 'SENSOR': '#23262b', 'QFN32': '#26282c', 'USBC': '#b9bdc4', 'GT01': '#cdd0d6', 'JSTSH3': '#e6e3da', 'ENC': '#3a3c42', 'BRACKET': '#1b1c1f'}
LAB = {'U1': 'module (turned:\nantenna to the rear)', 'U3': 'sensor', 'U2': 'PMIC', 'J1': 'USB-C', 'SW1': 'GT01', 'SW2': 'GT01', 'J2': 'J2', 'J3': 'J3'}
for c in L['components']:
    fp = c.get('fp'); 
    if fp not in SIZE: continue
    w, h = SIZE[fp]
    if c.get('rot', 0) % 180: w, h = h, w
    x, z = -c['x'], c['z']
    ax.add_patch(FancyBboxPatch((x - w / 2, z - h / 2), w, h, boxstyle='round,pad=0,rounding_size=0.3', fc=COL.get(fp, '#2a2c30'), ec='#00000080', lw=0.6, zorder=3, alpha=0.95))
    if c['ref'] in LAB: ax.text(x, z, LAB[c['ref']], ha='center', va='center', fontsize=7, color='#d8d9dc' if fp not in ('GT01', 'USBC', 'JSTSH3') else '#222', zorder=4)
from matplotlib.patches import Circle
for nm, (x, z, d) in {'MH1': (-10.20, 29.56, 2.9), 'MH2': (10.00, 29.43, 2.9), 'MH3': (-14.69, -2.25, 2.9), 'MH4': (14.49, -2.25, 2.9),
                      'LH1': (-10.59, -1.72, 2.2), 'LH2': (10.40, -1.85, 2.2), 'SH1': (-18.12, -2.25, 1.3), 'SH2': (17.92, -2.25, 1.3)}.items():
    ax.add_patch(Circle((x, z), d / 2 + (0.75 if nm in ('MH3', 'MH4') else 0), fc='#d9b25a' if nm in ('MH3', 'MH4') else '#16171a', ec='none', zorder=5))
    ax.add_patch(Circle((x, z), d / 2, fc='#F5F5F7', ec='none', zorder=5.1))
for (x0, x1, z0, z1, r) in ((-7.05, 7.35, 27.45, 44.95, 1.2), (8.81, 12.64, 17.95, 22.24, 0.6)):
    ax.add_patch(FancyBboxPatch((x0, z0), x1 - x0, z1 - z0, boxstyle='round,pad=0,rounding_size=%.2f' % r, fc='#F5F5F7', ec='#d9b25a', lw=2.0, zorder=5))
k = L['antennaKeepout']; u1 = next(c for c in L['components'] if c['ref'] == 'U1'); zc1 = u1['z']
k2 = [k[0], 2 * zc1 - k[3], k[2], 2 * zc1 - k[1]]      # pcb.js turned the module: the keep-out mirrored about it
ax.add_patch(Rectangle((-k2[2], k2[1]), k2[2] - k2[0], k2[3] - k2[1], fc='none', ec='#7FB2FF', lw=1.0, ls='--', zorder=5))
fig.savefig(sys.argv[1], facecolor=fig.get_facecolor()); print(sys.argv[1])
