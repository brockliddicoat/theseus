"""Phase-1 preview (matplotlib draft in the deck's colours): the Sora base (yellow, the comparison) against the
descended shape (blue), the four minima, the ring finger on the shoulder, the loss curve. -> out/preview-gd.png"""
import json, os, sys
import numpy as np
import matplotlib; matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib import font_manager as fm
HERE = os.path.dirname(os.path.abspath(__file__))
FD = '/usr/share/fonts/opentype/inter/'
for f in ['Inter-SemiBold.otf', 'Inter-Bold.otf', 'InterDisplay-ExtraBold.otf', 'InterDisplay-Bold.otf', 'Inter-Medium.otf']:
    if os.path.exists(FD + f): fm.fontManager.addfont(FD + f)
BG, INK, INK2, MUTE, FAINT, HAIR = '#F5F5F7', '#111111', '#2E2E2C', '#66655F', '#8A8983', '#DDDCD6'
HERO, HEROT, YEL, YELT, PANEL, SKIN, SKINE = '#0A6CFF', '#0058D6', '#E3A800', '#8F6A00', '#FFFFFF', '#C9C8C3', '#5E5D58'
R = json.load(open(os.path.join(HERE, 'out', 'gd_run.json')))
C = {k: np.array(v) for k, v in R['curves'].items()}
plt.rcParams.update({'font.family': 'Inter', 'font.weight': 600, 'text.color': INK2})
fig = plt.figure(figsize=(16, 9), dpi=100, facecolor=BG)
def T(x, y, s, size=13, w=600, c=INK2, fam='Inter', ha='left', va='baseline', **k):
    fig.text(x / 1600, 1 - y / 900, s, fontsize=size, fontweight=w, color=c, family=fam, ha=ha, va=va, **k)
T(60, 62, 'SHAPE STUDY, PHASE 1 DRAFT', 11, 700, MUTE)
T(60, 112, 'SHAPE, BY GRADIENT DESCENT', 30, 800, INK, 'Inter Display')
T(60, 146, 'The Sora V2 fitted with arcs, then four pockets descended to the strength the hand at rest asks for.', 13.5, 560, INK2)
fin, sor, tg, op = R['final'], R['sora'], R['targets'], R['optimum']
def panel(x, y, w, h):
    ax = fig.add_axes([x / 1600, 1 - (y + h) / 900, w / 1600, h / 900]); ax.set_facecolor(PANEL)
    for s in ax.spines.values(): s.set_visible(False)
    ax.set_xticks([]); ax.set_yticks([]); return ax
# ---------------- top view: the full outline, Sora vs descended, pockets marked
ax = panel(60, 190, 470, 640)
ps, pf = C['plan_sora'], C['plan_final']
for P, col, lw, z in [(ps, YEL, 2.2, 2), (pf, HERO, 2.6, 3)]:
    ax.plot(P[:, 0] * -1, P[:, 1], color=col, lw=lw, zorder=z); ax.plot(P[:, 0], P[:, 1], color=col, lw=lw, zorder=z)
mp = fin['minima']['thumb_pocket']; zt = mp['z']; hw = mp['half_width']
for sgn, nm, who in [(-1, 'Thumb', 'left'), (1, 'Pinky', 'right')]:
    ax.add_patch(plt.Circle((sgn * (hw + 8.0), zt), 8.0, fc=SKIN, ec=SKINE, lw=1.2, zorder=4))
    ax.plot([sgn * hw], [zt], 'o', color=HERO, ms=7, zorder=5)
    ax.text(sgn * (hw + 8.0), zt + 12, nm, ha='center', fontsize=11, fontweight=700, color=INK2)
ax.axhline(tg['section_station_z'], color=FAINT, lw=1, ls=(0, (5, 4)), zorder=1)
ax.text(-34, tg['section_station_z'] + 2, 'Section at z %.0f' % tg['section_station_z'], fontsize=10, color=MUTE, fontweight=600)
ax.set_xlim(-50, 50); ax.set_ylim(-66, 70); ax.set_aspect('equal')
ax.text(-46, 63, 'TOP VIEW, NOSE UP, AS THE HAND SEES IT', fontsize=10.5, fontweight=700, color=MUTE)
ax.text(-46, -62, 'Pockets at z %.1f: %.2f mm under the hump, %.2f mm under the front' % (zt, mp['rise_behind_mm'], mp['rise_ahead_mm']), fontsize=9.5, color=INK2)
# inset: the side's half width, x10 across, Sora vs descended
ia = fig.add_axes([250 / 1600, 1 - (470 + 250) / 900, 90 / 1600, 250 / 900]); ia.set_facecolor('#F7F7F9')
for s in ia.spines.values(): s.set_color(HAIR)
for P, col in [(ps, YEL), (pf, HERO)]:
    m = (P[:, 0] > 26) & (P[:, 1] > -30) & (P[:, 1] < 45); ia.plot(P[m, 0], P[m, 1], color=col, lw=2)
ia.set_xticks([]); ia.set_yticks([]); ia.set_title('Right side,\n×10 across', fontsize=8.5, color=MUTE, fontweight=700, pad=3)
xm = pf[(pf[:, 1] > -30) & (pf[:, 1] < 45), 0]; ia.set_xlim(xm.min() - 0.3, xm.max() + 0.3)
# ---------------- the section across the buttons: grooves under index and middle, the ring on the shoulder
ax2 = panel(570, 190, 640, 420)
ss, sf = C['sec_sora'], C['sec_final']
for S, col, lw in [(ss, YEL, 2.2), (sf, HERO, 2.6)]:
    ax2.plot(S[:, 0], S[:, 1], color=col, lw=lw); ax2.plot(-S[:, 0], S[:, 1], color=col, lw=lw)
g = fin['minima']['index_groove']
for sgn, nm in [(-1, 'Index'), (1, 'Middle')]:
    ax2.add_patch(plt.Circle((sgn * g['x_left'], g['y'] + 8.0), 8.0, fc=SKIN, ec=SKINE, lw=1.2, zorder=4))
    ax2.plot([sgn * g['x_left']], [g['y']], 'o', color=HERO, ms=7, zorder=5)
    ax2.text(sgn * g['x_left'], g['y'] + 19.5, nm, ha='center', fontsize=11, fontweight=700, color=INK2)
# ring finger on the right shoulder (user's right: image right, seen from behind): no pocket, resting on the slope
up = sf[sf[:, 1] > 12]; j = int(np.argmin(np.abs(up[:, 0] - tg['u_ring']))); q = up[j]; q2 = up[min(j + 1, len(up) - 1)]
tx, ty = q2 - q; nrm = np.array([-ty, tx]); nrm = nrm / np.hypot(*nrm)
if nrm[1] < 0: nrm = -nrm
ax2.add_patch(plt.Circle((q[0] + nrm[0] * 8.0, q[1] + nrm[1] * 8.0), 8.0, fc=SKIN, ec=SKINE, lw=1.2, zorder=4))
ax2.text(q[0] + nrm[0] * 8.0 - 2, q[1] + nrm[1] * 8.0 + 10.5, 'Ring', ha='center', fontsize=11, fontweight=700, color=INK2)
tl = np.array([tx, ty]) / np.hypot(tx, ty)
ax2.plot([q[0] - tl[0] * 9, q[0] + tl[0] * 9], [q[1] - tl[1] * 9, q[1] + tl[1] * 9], color=INK2, lw=1.5, zorder=5)
ax2.plot([q[0]], [q[1]], 'o', color=INK, ms=5, zorder=6)
# inset: the groove, x10 in height
ib = fig.add_axes([760 / 1600, 1 - (440 + 110) / 900, 260 / 1600, 110 / 900]); ib.set_facecolor('#F7F7F9')
for sp_ in ib.spines.values(): sp_.set_color(HAIR)
for S, col in [(ss, YEL), (sf, HERO)]:
    m = (S[:, 1] > 12) & (S[:, 0] > 6) & (S[:, 0] < 27); ib.plot(-S[m, 0], S[m, 1], color=col, lw=2)
ib.plot([-g['x_left']], [g['y']], 'o', color=HERO, ms=6)
ib.set_xticks([]); ib.set_yticks([]); ib.set_title('Index groove, ×10 in height', fontsize=8.5, color=MUTE, fontweight=700, pad=3)
ax2.set_xlim(-40, 46); ax2.set_ylim(-4, 52); ax2.set_aspect('equal')
ax2.text(-40, 48, 'ACROSS THE BUTTONS AT Z %.0f, SEEN FROM BEHIND' % tg['section_station_z'], fontsize=10.5, fontweight=700, color=MUTE)
ax2.text(-40, -2.5, 'Grooves %.1f mm off centre, level under the pad, a %.2f mm lip outboard' % (g['x_left'], g['rise_outboard_mm']), fontsize=9.5, color=INK2)
# ---------------- numbers: the optimum and what the descent reached
ax3 = panel(1250, 190, 290, 420)
ax3.set_xlim(0, 1); ax3.set_ylim(0, 1)
def row(y, lab, val, sub, col=HEROT):
    ax3.text(0.07, y, lab, fontsize=9.5, fontweight=700, color=MUTE, transform=ax3.transAxes)
    ax3.text(0.07, y - 0.085, val, fontsize=21, fontweight=800, color=col, family='Inter Display', transform=ax3.transAxes)
    ax3.text(0.07, y - 0.135, sub, fontsize=9, color=INK2, transform=ax3.transAxes)
row(0.92, 'GROOVE STRENGTH, DERIVED', 'R %.0f mm' % op['R_groove'], 'Sora: no groove; descended: R %.0f' % (1 / fin['info']['k_groove']))
row(0.67, 'POCKET STRENGTH, DERIVED', 'R %.0f mm' % op['R_pocket'], 'Sora: R %.0f; descended: R %.0f' % (sor['minima']['thumb_pocket']['R_mm'], fin['minima']['thumb_pocket']['R_mm']))
row(0.42, 'MOST THE SURFACE MOVES', '%.2f mm' % max(fin['dev_from_sora_mm'].values()), 'from the Sora V2; side profile unchanged')
row(0.17, 'RING SHOULDER, CHECKED', '%.0f °/mm' % fin['info']['k_ring_deg_per_mm'], 'no pocket; in the 6 to 22 °/mm band', col=INK)
# ---------------- loss curve
ax4 = fig.add_axes([620 / 1600, 1 - (650 + 150) / 900, 920 / 1600, 150 / 900]); ax4.set_facecolor(PANEL)
L = np.array([h['loss'] for h in R['loss']]); it = np.arange(1, len(L) + 1)
ax4.plot(it, L, color=HERO, lw=2.4); ax4.set_yscale('log')
for s in ['top', 'right']: ax4.spines[s].set_visible(False)
for s in ['left', 'bottom']: ax4.spines[s].set_color(HAIR)
ax4.tick_params(colors=FAINT, labelsize=9)
ax4.text(0.0, -0.22, 'STEP', transform=ax4.transAxes, fontsize=9, color=MUTE, fontweight=700)
ax4.text(0.99, 0.86, 'LOSS, LOWER IS BETTER', transform=ax4.transAxes, ha='right', fontsize=10, fontweight=700, color=MUTE)
ax4.text(0.99, 0.70, '%.2f → %.2f' % (L[0], L[-1]), transform=ax4.transAxes, ha='right', fontsize=14, fontweight=800, color=HEROT, family='Inter Display')
# legend and source line
T(60, 858, '—', 16, 800, YEL); T(84, 858, 'Sora V2 base, arc fit to the scan (RMS 0.12 mm top view, 0.06 to 0.12 mm sections)', 10.5, 600, INK2)
T(60, 884, '—', 16, 800, HERO); T(84, 884, 'Descended: one arc notch per pocket, mirrored. Draft: matplotlib, phase 1; strengths derived from Shi 2020, Johnson 2000, Lee & Jung 2014, STS-57', 10.5, 600, INK2)
fig.savefig(os.path.join(HERE, 'out', 'preview-gd.png'), facecolor=BG, dpi=100)
print('ok')
