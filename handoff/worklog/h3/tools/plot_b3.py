"""H3: the module's B3 pad (VDD 1.8 V) and its decoupling, C10 and C11, on the four-layer board (a via in B3's pad) and on
the two-layer board (C10 and C11 moved apart, one via between them). Top view, layout frame (x the user's right, z nose).
  python3 plot_b3.py            -> /home/claude/work/h3/shots/q_b3.png
Runs each tool set in its own process (the old and new tools share module names)."""
import json, os, subprocess, sys

OUT = '/home/claude/work/h3/shots/q_b3.png'
DUMP = r'''
import json, sys, os
T = sys.argv[1]; sys.path.insert(0, T); os.chdir(T)
import deps  # noqa
import layout as LY
L = LY.build()
X0, X1, Z0, Z1 = -6.6, 0.6, -4.6, 0.6
def near(x, z, m=1.5): return X0 - m < x < X1 + m and Z0 - m < z < Z1 + m
pads = [dict(x=p['x'], z=p['z'], w=p['w'], h=p['h'], rot=p.get('rot', 0), net=p['net'], ref=p.get('ref'), name=p.get('name'))
        for p in L['pads'] if near(p['x'], p['z']) and not (p.get('drill') or p.get('slot'))]
routes = [dict(net=r['net'], layer=r['layer'], w=r['w'], pts=r['pts']) for r in L['routes']
          if any(near(x, z) for x, z in r['pts'])]
vias = [dict(x=v['x'], z=v['z'], net=v['net'], d=v.get('d', 0.45)) for v in L['vias'] if near(v['x'], v['z'])]
print(json.dumps(dict(pads=pads, routes=routes, vias=vias)))
'''
def dump(tools):
    r = subprocess.run([sys.executable, '-c', DUMP, tools], capture_output=True, text=True, timeout=600)
    if r.returncode: sys.exit(r.stderr[-2000:])
    return json.loads(r.stdout.strip().splitlines()[-1])

old = dump('/home/claude/work/h3/oldtools')
new = dump('/home/claude/theseus/3d/pcb/tools')

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle, Circle, Polygon
from shapely.geometry import LineString

PAPER, INK, MUTE, GREY, ACC, RED, GOLD = '#f7f6f2', '#262626', '#6f6c66', '#b9b6ae', '#127f86', '#b3412f', '#c9a347'
plt.rcParams.update({'font.family': 'DejaVu Sans', 'font.size': 8.5, 'figure.facecolor': PAPER, 'axes.facecolor': PAPER})
fig, axs = plt.subplots(1, 2, figsize=(12.8, 6.2), dpi=130)
fig.subplots_adjust(left=0.02, right=0.98, top=0.8, bottom=0.17, wspace=0.06)
fig.text(0.02, 0.955, 'Q3: the module\'s 1.8 V pad B3 on two layers: move C10 and C11 apart (done), or a via in the pad?',
         fontsize=13, weight='bold', color=INK, va='top')
fig.text(0.02, 0.9, 'Top view, nose up, mm. Teal: the 1.8 V (VDD_1V8) pads, top copper and vias; dashed: its bottom (or inner) '
         'copper; grey: other nets\' pads (GND darker).', fontsize=9, color=MUTE, va='top')


def draw(ax, D, title, far):
    ax.set_title(title, loc='left', fontsize=10.5, weight='bold', color=INK)
    for r in D['routes']:
        g = LineString(r['pts']).buffer(r['w'] / 2, cap_style=1)
        vdd = r['net'] == 'VDD_1V8'
        if r['layer'] == 'L1':
            fc, ec, ls, z = ((ACC, ACC, '-', 3) if vdd else ('#dcd9d1', '#dcd9d1', '-', 1))
        else:
            fc, ec, ls, z = (('none', ACC, '--', 4) if vdd else ('none', GREY, ':', 1))
        for gg in getattr(g, 'geoms', [g]):
            ax.add_patch(Polygon(list(gg.exterior.coords), closed=True, fc=fc, ec=ec, lw=0.9, ls=ls, zorder=z, alpha=0.9 if fc != 'none' else 1))
    for p in D['pads']:
        w, h = (p['h'], p['w']) if p['rot'] in (90, 270) else (p['w'], p['h'])
        vdd = p['net'] == 'VDD_1V8'
        fc = ACC if vdd else ('#8f8b83' if p['net'] == 'GND' else '#cfccc4')
        ax.add_patch(Rectangle((p['x'] - w / 2, p['z'] - h / 2), w, h, fc=fc, ec=INK if vdd else 'none', lw=0.6, zorder=5))
    for v in D['vias']:
        vdd = v['net'] == 'VDD_1V8'
        ax.add_patch(Circle((v['x'], v['z']), v['d'] / 2, fc=ACC if vdd else '#8f8b83', ec=INK, lw=0.6, zorder=6))
        ax.add_patch(Circle((v['x'], v['z']), 0.1, fc=PAPER, ec='none', zorder=7))
    lab = {}
    for p in D['pads']:
        if p['ref'] in ('C10', 'C11'): lab.setdefault(p['ref'], []).append((p['x'], p['z']))
    for ref, pts in lab.items():
        x = sum(a for a, _ in pts) / len(pts); z = min(b for _, b in pts) - 0.55
        ax.text(x, z, ref, ha='center', va='top', fontsize=9, weight='bold', color=INK, zorder=8)
    for p in D['pads']:
        if p['ref'] == 'U1' and p['name'] == 'B3':
            ax.annotate('U1 pad B3 (1.8 V)', xy=(p['x'], p['z'] + 0.5), xytext=(p['x'] + 0.6, p['z'] + 1.6), fontsize=8.5, color=INK, zorder=9,
                        arrowprops=dict(arrowstyle='->', lw=0.7, color=INK))
    ax.set_xlim(-6.6, 0.6); ax.set_ylim(-4.6, 0.9); ax.set_aspect('equal'); ax.set_xticks([]); ax.set_yticks([])
    for s in ax.spines.values(): s.set_edgecolor(GREY)


draw(axs[0], old, 'Four layers, 1.0 mm (plan 5 as first built)', 'L3')
draw(axs[1], new, 'Two layers, 0.6 mm (now): C11 0.5 mm left, C10 0.3 mm right', 'L4')
# mark the old via in B3's pad
for v in old['vias']:
    if v['net'] == 'VDD_1V8' and abs(v['x'] + 2.4) < 0.4 and abs(v['z'] + 1.85) < 0.7:
        axs[0].add_patch(Circle((v['x'], v['z']), 0.45, fc='none', ec=RED, lw=1.4, zorder=9))
        axs[0].text(v['x'] - 0.6, v['z'] + 0.05, 'via in\nthe pad', color=RED, fontsize=8.5, ha='right', va='center', zorder=9)
fig.text(0.02, 0.135, 'A [default, done]: keep the move: a plain via between C10 and C11, the 1.8 V on the top to B3; '
         'nothing special to fabricate.\nB: put C10 and C11 back and use a via in B3\'s pad: it must be filled and capped '
         '(plated over), an extra fab step and cost.', fontsize=9, color=INK, va='top', linespacing=1.5)
fig.text(0.02, 0.05, 'On two layers B3, C10\'s and C11\'s 1.8 V pads were walled in by GND pads: no route reached B3 without '
         'a via there.', fontsize=9, color=MUTE, va='top')
fig.savefig(OUT, facecolor=PAPER)
print(OUT)
