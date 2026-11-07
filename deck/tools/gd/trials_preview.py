"""Checkpoint close-up: the four trials' top views (Sora yellow, trial blue), sides x5 off the Sora, the minima marked."""
import json, os
import numpy as np
import matplotlib; matplotlib.use('Agg'); import matplotlib.pyplot as plt
from matplotlib import font_manager as fm
HERE = os.path.dirname(os.path.abspath(__file__)); FD = '/usr/share/fonts/opentype/inter/'
for f in ['Inter-SemiBold.otf', 'Inter-Bold.otf', 'InterDisplay-ExtraBold.otf']:
    if os.path.exists(FD + f): fm.fontManager.addfont(FD + f)
plt.rcParams.update({'font.family': 'Inter', 'font.weight': 600})
BG, INK, MUTE, HERO, HEROT, YEL, RED, SKIN, SKINE = '#F5F5F7', '#111111', '#66655F', '#0A6CFF', '#0058D6', '#E3A800', '#E5484D', '#C9C8C3', '#5E5D58'
R = json.load(open(os.path.join(HERE, 'out', 'trials.json'))); so = np.array(R['sora']['plan'])
fig = plt.figure(figsize=(16, 9), dpi=100, facecolor=BG)
fig.text(0.0375, 0.93, 'FOUR TRIALS, ONE MINIMUM PER FINGER', fontsize=26, fontweight=800, color=INK, family='Inter Display')
fig.text(0.0375, 0.895, 'Top views as the hand sees them. Sides drawn ×5 off the Sora so millimetres show; dots are the minima, rings the fingers at rest.', fontsize=12.5, color='#2E2E2C')
names = {'heel_sym': 'Palm on the hump, symmetric', 'heel_fwd': 'Palm on the hump, thumb pocket forward', 'lifted_sym': 'Palm lifted (zero g), symmetric', 'lifted_fwd': 'Palm lifted (zero g), thumb pocket forward'}
X = 5.0
def ex(P):   # exaggerate a side x5 about the Sora (same z)
    P = np.array(P); u0 = np.interp(-P[:, 1], -so[:, 1], so[:, 0]); return np.c_[u0 + X * (P[:, 0] - u0), P[:, 1]]
for i, (k, r) in enumerate(R['trials'].items()):
    ax = fig.add_axes([0.04 + (i % 2) * 0.48, 0.47 - (i // 2) * 0.43, 0.2, 0.38]); ax.set_facecolor('white')
    for s_ in ax.spines.values(): s_.set_visible(False)
    ax.set_xticks([]); ax.set_yticks([])
    L, Rr = ex(r['curves']['planL']), ex(r['curves']['planR'])
    ax.plot(-so[:, 0], so[:, 1], color=YEL, lw=1.8); ax.plot(so[:, 0], so[:, 1], color=YEL, lw=1.8)
    ax.plot(-L[:, 0], L[:, 1], color=HERO, lw=2.4); ax.plot(Rr[:, 0], Rr[:, 1], color=HERO, lw=2.4)
    f = r['final']; d = r['derived']
    for side, m, zt, nm in [(-1, f['thumb'], d['targets']['thumb_z'], 'Thumb'), (1, f['pinky'], d['targets']['pinky_z'], 'Pinky')]:
        P = L if side < 0 else Rr; ub = np.interp(-m['z_bottom'], -P[:, 1], P[:, 0])
        ax.plot([side * ub], [m['z_bottom']], 'o', color=HERO if m['n_minima'] == 1 else RED, ms=7, zorder=5)
        ur = np.interp(-zt, -P[:, 1], P[:, 0]); ax.add_patch(plt.Circle((side * (ur + 8), zt), 7.5, fc=SKIN, ec=SKINE, lw=1, alpha=0.9, zorder=4))
    ax.set_xlim(-52, 52); ax.set_ylim(-64, 66); ax.set_aspect('equal')
    tx = fig.add_axes([0.25 + (i % 2) * 0.48, 0.47 - (i // 2) * 0.43, 0.22, 0.38]); tx.axis('off')
    tx.text(0, 0.97, names[k].upper(), fontsize=11, fontweight=700, color=MUTE, transform=tx.transAxes)
    tx.text(0, 0.86, 'Loss %.2f' % r['loss'][-1], fontsize=22, fontweight=800, color=HEROT, family='Inter Display', transform=tx.transAxes)
    th, pk, gr = f['thumb'], f['pinky'], f['grooves']
    lines = [('Thumb', 'z %.1f (rests %.1f), R %s / %.0f, %d min' % (th['z_bottom'], d['targets']['thumb_z'], ('%.0f' % th['R_bottom']) if th['R_bottom'] and th['R_bottom'] < 999 else 'flat', d['R_opt']['thumb'], th['n_minima'])),
             ('Pinky', 'z %.1f (rests %.1f), R %s / %.0f, %d min' % (pk['z_bottom'], d['targets']['pinky_z'], ('%.0f' % pk['R_bottom']) if pk['R_bottom'] else 'flat', d['R_opt']['pinky'], pk['n_minima'])),
             ('Under the hump', '%.2f mm thumb side, flare %.2f mm' % (th['below_hump_mm'], th['flare_mm'])),
             ('Grooves', 'x ±%.1f, R %.0f / %.0f, %d min each' % (gr['u_bottom'], gr['R_bottom'], d['R_opt']['groove'], gr['n_minima'])),
             ('Ring', '%.1f °/mm on the shoulder, %d min' % (gr['ring']['k_deg_per_mm'], gr['ring']['n_minima'])),
             ('Moved', '%.2f mm from the Sora, %.2f from the base' % (f['dev_sora_mm'], max(r['dev_from_base_mm'].values())))]
    for j, (a, b) in enumerate(lines):
        bad = (a in ('Thumb', 'Pinky') and ('0 min' in b or 'flat' in b))
        tx.text(0, 0.72 - j * 0.115, a.upper(), fontsize=9, fontweight=700, color=MUTE, transform=tx.transAxes)
        tx.text(0, 0.67 - j * 0.115, b, fontsize=11, fontweight=650, color=RED if bad else INK, transform=tx.transAxes)
fig.text(0.0375, 0.025, 'R a / b: the pocket\'s radius at its bottom against the optimum (derived: the finger\'s passive stiffness over its press). z in mm from the mouse centre, + toward the nose. Draft: matplotlib, for the checkpoint.', fontsize=10, color=MUTE)
fig.savefig('/home/claude/work/g1/out/gd-trials-2x2.png', facecolor=BG, dpi=100); print('ok')
