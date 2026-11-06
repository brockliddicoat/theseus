"""H3: the USB 2.0 pair on the two-layer board (Q2 for Brock): where it runs, and its cross-section now and at ~90 ohm.
  python3 plot_usb.py  -> /home/claude/work/h3/shots/q_usb.png"""
import json, math
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle, Polygon
from shapely.geometry import LineString

L = json.load(open('/home/claude/theseus/3d/pcb/pcb-layout.json'))
PAPER, INK, MUTE, GREY, ACC, ACC2, RED, BOARD = '#f7f6f2', '#262626', '#6f6c66', '#b9b6ae', '#127f86', '#7a4fb0', '#b3412f', '#2f3a33'
plt.rcParams.update({'font.family': 'DejaVu Sans', 'font.size': 8.5, 'figure.facecolor': PAPER, 'axes.facecolor': PAPER})


def z0(w, h, t=0.0175, er=4.3): return 87 / math.sqrt(er + 1.41) * math.log(5.98 * h / (0.8 * w + t))
def zd(w, s, h, t=0.0175, er=4.3): return 2 * z0(w, h, t, er) * (1 - 0.48 * math.exp(-0.96 * s / h))
H = 0.565

fig = plt.figure(figsize=(12.8, 7.0), dpi=130)
fig.text(0.02, 0.965, 'Q2: the USB 2.0 pair on two layers: widen it to ~90 ohm, or keep it representative?', fontsize=13, weight='bold', color=INK, va='top')
fig.text(0.02, 0.918, 'USB 2.0 high speed wants 90 ohm ± 15 % between D+ and D-. With no inner ground plane, the pair\'s reference is the '
         'other face\'s copper, 0.565 mm away.', fontsize=9, color=MUTE, va='top')

ax = fig.add_axes([0.02, 0.05, 0.36, 0.82]); ax.set_aspect('equal'); ax.set_xticks([]); ax.set_yticks([])
for s in ax.spines.values(): s.set_visible(False)
ol = [(-x, z) for x, z in L['outline']]
ax.add_patch(Polygon(ol, closed=True, fc='#e9e6de', ec=GREY, lw=0.8))
for r in L['routes']:
    pts = [(-x, z) for x, z in r['pts']]
    usb = r['net'] in ('USB_DP', 'USB_DN')
    if not usb:
        ax.plot(*zip(*pts), color='#d3cfc5', lw=0.5, zorder=1)
        continue
    col = ACC if r['net'] == 'USB_DP' else ACC2
    ax.plot(*zip(*pts), color=col, lw=1.6, ls='-' if r['layer'] == 'L1' else (0, (2.5, 1.2)), zorder=3, solid_capstyle='round')
for c in L['components']:
    if c.get('ref') in ('J1', 'U1', 'U4'):
        name = {'J1': 'J1 USB-C', 'U1': 'U1 module (USB pins)', 'U4': 'U4 ESD'}[c['ref']]
        ax.text(-c['x'], c['z'], name, fontsize=8, ha='center', va='center', color=INK, zorder=5,
                bbox=dict(boxstyle='round,pad=0.2', fc=PAPER, ec='none', alpha=0.85))
ax.plot([], [], color=ACC, lw=1.6, label='D+ on the top'); ax.plot([], [], color=ACC, lw=1.6, ls=(0, (2.5, 1.2)), label='D+ on the bottom')
ax.plot([], [], color=ACC2, lw=1.6, label='D- (same)')
ax.legend(loc='lower left', fontsize=8, frameon=False)
ax.text(-19, 54.5, 'top view, nose up; about 76 mm each\n(27 on the top, 47 to 49 on the bottom)', fontsize=8, color=MUTE, va='top')
ax.set_xlim(-21, 21); ax.set_ylim(-7, 56)


def section(ax, w, s, title, col, note):
    ax.set_title(title, loc='left', fontsize=10, weight='bold', color=col)
    ax.add_patch(Rectangle((-2.0, -H), 4.0, H, fc='#cdbf8f', ec='none', alpha=0.55))           # laminate
    ax.add_patch(Rectangle((-2.0, -H - 0.0175), 4.0, 0.0175, fc='#b87333', ec='none'))           # the other face's copper
    for x0 in (-s / 2 - w, s / 2):
        ax.add_patch(Rectangle((x0, 0), w, 0.0175 * 3, fc='#b87333', ec=INK, lw=0.5))         # traces (drawn 3x thick)
    ax.text(0, 0.12, '%.2f mm traces, %.2f mm apart' % (w, s), ha='center', fontsize=8.5, color=INK)
    ax.text(1.95, -H / 2, '0.565 mm\nFR4', ha='right', va='center', fontsize=8, color=INK)
    ax.text(-1.95, -H - 0.09, 'the other face\'s copper (its reference)', fontsize=7.5, color=MUTE, va='top')
    ax.text(0, -H - 0.3, note, ha='center', va='top', fontsize=9, color=col, weight='bold')
    ax.set_xlim(-2.05, 2.05); ax.set_ylim(-1.15, 0.3); ax.set_aspect('equal'); ax.set_xticks([]); ax.set_yticks([])
    for sp in ax.spines.values(): sp.set_visible(False)


a1 = fig.add_axes([0.42, 0.6, 0.27, 0.27]); section(a1, 0.13, 0.27, 'Now, as drawn', RED,
                                                    'about %.0f ohm single, %.0f to %.0f ohm as a pair\n(its gap 0.15 to 0.87 mm, median 0.27)' % (z0(0.13, H), zd(0.13, 0.15, H), zd(0.13, 0.87, H)))
a2 = fig.add_axes([0.71, 0.6, 0.27, 0.27]); section(a2, 0.55, 0.15, 'For ~90 ohm on this stack', ACC,
                                                    'about %.0f ohm as a pair' % zd(0.55, 0.15, H))
fig.text(0.42, 0.53, 'IPC-2141 microstrip estimates, εr 4.3, 17.5 µm copper; traces drawn 3x thicker so they show.', fontsize=8, color=MUTE, va='top')
opts = ('A [default]: widen to ~0.55 mm traces 0.15 mm apart over unbroken copper on the other face, kept out of the art\'s '
        'cut lines under it: the pair takes ~1.25 mm of width where it now takes ~0.55; a re-route of the left channel.\n\n'
        'B: a coplanar pair: the pour on its own face beside it as its reference (narrower traces, a row of ground vias '
        'along each side); more stitching, and the bottom art still has to stay whole.\n\n'
        'C: keep 0.13 mm as drawn: the film\'s board is representative; the real layout is the EE\'s job.')
import textwrap
fig.text(0.42, 0.47, '\n'.join(textwrap.fill(p, 96) if p else '' for p in opts.split('\n')), fontsize=9, color=INK, va='top', linespacing=1.4)
fig.savefig('/home/claude/work/h3/shots/q_usb.png', facecolor=PAPER)
print('/home/claude/work/h3/shots/q_usb.png')
