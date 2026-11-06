"""L2 image 2: the nodes up close, to scale: plan (from inside) and a true section through the thickest spot; the sink risk as
the largest ball in each junction against the 0.60 mm skin; the cored knot and what coring costs. True greys, blue for the pick."""
import sys, json, time, os
sys.dont_write_bytecode = True
sys.path.insert(0, '/home/claude/work/l2/scripts'); sys.path.insert(0, '/home/claude/work/s1/scripts')
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patheffects as pe
import sheetlib as SL
from sheetlib import Sheet, line

PAPER, INK, INK2, MUTE, FAINT, HAIR = '#F5F5F5', '#111111', '#2E2E2E', '#5E5E5E', '#8A8A8A', '#DCDCDC'
G_FIL, G_ROOT, G_TIP, G_SEC = '#D2D2D2', '#A9A9A9', '#8C8C8C', '#B4B4B4'
HERO, HERO_T = SL.HERO, SL.HERO_T
SL.PAPER = PAPER
OUT = '/home/claude/work/l2/out'
ND = json.load(open('%s/nodes.json' % OUT)); DR = json.load(open('%s/nodedraw.json' % OUT))
A = np.load('%s/nodedraw.npz' % OUT)
B2 = json.load(open('%s/budget_s2.json' % OUT))
S = 190.0                                  # px per mm, every drawing
T = 0.60

if __name__ == '__main__':
    stamp = time.strftime('%H%M')
    W_, H_ = 1600, 1880
    sh = Sheet(W_, H_); sh.fig.patch.set_facecolor(PAPER)
    sh.title(46, 74, 'The nodes up close: where a sink could start', size=46)
    sh.text(46, 118, 'To scale (bar = 1 mm). Top: seen from inside. Below: cut through the thickest spot. A thick spot cools last and can pull', size=24, weight=500, color=MUTE)
    sh.text(46, 148, 'a dent (a sink) into the outside. The circle is the biggest ball that fits there; the skin alone fits a 0.60 mm ball.', size=24, weight=500, color=MUTE)
    cols = [('kag', 'Kagome crossing', HERO_T), ('tri', 'True-triangle knot', INK), ('tri_cored', 'The knot, cored', INK)]
    CW = 488; X0 = [46, 46 + CW + 18, 46 + 2 * (CW + 18)]
    yP, hP = 236, 470; yS, hS = 772, 500
    for k, (case, title, col) in enumerate(cols):
        x0 = X0[k]
        sh.label(x0, 214, title, size=32, color=col)
        if case == 'kag':
            sh.text(x0 + 336, 214, 'Current pick', size=19, weight=700, color=HERO_T,
                    bbox=dict(boxstyle='round,pad=0.3', facecolor='white', edgecolor=HERO, lw=1.4))
        # ---- plan
        ax = sh.panel(x0, yP, CW, hP, 0.0, 0.0, S, frame=True)
        ax.invert_yaxis()                                   # plan y up
        for nm, c in (('fil', G_FIL), ('root', G_ROOT), ('tip', G_TIP)):
            j = 0
            while '%s_%s%d' % (case, nm, j) in A.files:
                P = A['%s_%s%d' % (case, nm, j)]; ax.fill(P[:, 0], P[:, 1], color=c, zorder=2 + j * 0.01 + {'fil': 0, 'root': 1, 'tip': 2}[nm])
                if nm == 'root': ax.plot(P[:, 0], P[:, 1], color=INK, lw=1.4 * SL.PX, zorder=5)
                j += 1
        if case == 'tri_cored':
            r = ND['hole_d'] / 2
            ax.add_patch(plt.Circle((0, 0), r, facecolor=PAPER, edgecolor=INK, lw=2.0 * SL.PX, zorder=8))
        else:
            pc = ND[case]['plan']; ax.add_patch(plt.Circle(pc['centre'], pc['D'] / 2, facecolor='none', edgecolor=INK, lw=3.0 * SL.PX, zorder=9))
        # the cut line through the ball's centre
        ang = np.radians(DR[case]['cut_deg']); e = np.array([np.cos(ang), np.sin(ang)])
        bc = np.array(ND[case]['ball']['centre'][:2]) * (-1 if case == 'kag' else 1); u0 = bc @ e; base = bc - u0 * e
        L = np.array([base - 1.2 * e, base + 1.2 * e])
        ax.plot(L[:, 0], L[:, 1], color=INK, lw=1.6 * SL.PX, dashes=(6, 4), zorder=10)
        ax.plot([bc[0]], [bc[1]], marker='+', ms=16, mew=2.2, color=INK, zorder=11)
        # plan caption
        if case == 'kag': cap = ['Width: a %.2f mm circle fits' % ND['kag']['plan']['D']]
        elif case == 'tri': cap = ['Width: a %.2f mm circle fits' % ND['tri']['plan']['D']]
        else: cap = ['Core pin Ø%.2f mm, down to the skin' % ND['hole_d']]
        sh.text(x0 + 14, yP + hP - 18, cap[0], size=23, weight=650, color=INK,
                path_effects=[pe.withStroke(linewidth=5, foreground='white')])
        # ---- section
        ax2 = sh.panel(x0, yS, CW, hS, 0.0, 1.1, S, frame=True)
        ax2.invert_yaxis()
        M = A['%s_mask' % case]; us = A['%s_us' % case]; vs = A['%s_vs' % case]
        ax2.imshow(np.where(M, 0.0, np.nan), extent=[us[0], us[-1], vs[0], vs[-1]], origin='lower', cmap='gray', vmin=-1.6, vmax=1.0, zorder=2, interpolation='nearest')
        j = 0
        while '%s_sec%d' % (case, j) in A.files:
            O = A['%s_sec%d' % (case, j)]; ax2.plot(O[:, 0], O[:, 1], color=INK, lw=1.6 * SL.PX, zorder=5); j += 1
        b = ND[case]['ball']; bu = DR[case]['ball_u'] * (-1 if case == 'kag' else 1); bv = b['centre'][2]
        if case == 'kag': ax2.invert_xaxis()      # the mask is mirror-symmetric along this cut; flip so the ball sits as in the plan
        if case == 'kag': bu = -bu
        ax2.add_patch(plt.Circle((bu, bv), b['D'] / 2, facecolor=(1, 1, 1, 0.55), edgecolor=INK, lw=3.0 * SL.PX, zorder=9))
        # the skin's own ball, for comparison, at the left end
        if case != 'tri_cored':
            ax2.add_patch(plt.Circle((0.95 if case == 'kag' else -0.95, T / 2), T / 2, facecolor=(1, 1, 1, 0.45), edgecolor=INK, lw=1.6 * SL.PX, linestyle=(0, (3, 2)), zorder=9))
            sh.text(x0 + 16, yS + 150, 'skin alone: 0.60', size=19, weight=650, color=INK2, path_effects=[pe.withStroke(linewidth=5, foreground='white')])
        else:
            sh.text(x0 + 16, yS + 150, 'cut along a rib, through the core', size=19, weight=650, color=INK2, path_effects=[pe.withStroke(linewidth=5, foreground='white')])
        px, py = sh.to_px(ax2, 0.0, -0.08)
        sh.text(x0 + CW / 2, yS + hS - 14, 'outside surface (the side you hold)', size=19, weight=600, color=MUTE, ha='center')
        # ---- the verdict under each column
        D = b['D']
        yv = yS + hS + 58
        sh.text(x0 + CW / 2, yv, '%.2f mm' % D, size=52, weight=800, color=HERO_T if case == 'kag' else INK, ha='center', font='Inter Display')
        sh.text(x0 + CW / 2, yv + 36, 'thickest spot: %.1f× the skin’s' % (D / T), size=23, weight=650, color=INK2, ha='center')
    # scale bar (1 mm) on the first plan
    ax = sh.panel(X0[0], yP, CW, hP, 0.0, 0.0, S)
    x_, y_ = X0[0] + 20, yP + 30
    sh.ov.plot([x_, x_ + S], [y_, y_], color=INK, lw=4 * SL.PX, zorder=70); sh.text(x_ + S / 2, y_ + 30, '1 mm', size=21, weight=700, color=INK, ha='center')
    # ---- references and the cost of coring
    y = yS + hS + 150
    sh.rule(46, y - 20, W_ - 46, y - 20, HAIR, 2)
    sh.text(46, y + 14, 'For scale: the skin alone fits a 0.60 mm ball; one rib at the guides’ limits (60 %% of the skin, 0.24 mm fillets) fits %.2f mm.' % ND['rib']['ball']['D'], size=23, weight=600, color=INK2)
    n = B2['tri']['n_nodes']
    r = ND['hole_d'] / 2; vol = np.pi * r * r * (1.8 - r) + 2 / 3 * np.pi * r ** 3
    sh.label(46, y + 66, 'What coring the knot costs', size=26, color=INK)
    cost = ['• %d steel pins in the mould, Ø%.2f mm and 1.80 mm long: %.0f× their width. Guides allow 2× for holes under 5 mm (Envalior);' % (n, ND['hole_d'], 1.8 / ND['hole_d']),
            '   a pin that short (%.2f mm) stops %.2f mm above the skin and leaves the thick spot as it is.' % (2 * ND['hole_d'], 1.8 - 2 * ND['hole_d']),
            '• The melt splits round each pin and meets behind it: a weld line in every knot, where six ribs pass their load. Carbon-filled',
            '   plastic keeps about a third of its strength across a weld line (Wang 2023, carbon nylon; the film’s source).',
            '• It saves %.2f g in all, and L1’s model can’t see it (its ribs meet at points): untested.' % (n * vol * 1.01e-3)]
    for j, ln in enumerate(cost): sh.text(46, y + 104 + 31 * j, ln, size=22, weight=550, color=INK2)
    yf = y + 104 + 31 * len(cost) + 34
    sh.text(46, yf, 'Ribs 0.36 mm at the root, 1.80 deep, 0.5° draft; root fillets 0.24, node fillets 0.22 (L1 final). Largest ball: 3D distance map of each junction on a', size=18, weight=500, color=MUTE)
    sh.text(46, yf + 26, '0.01 mm grid (one rib: %.2f mm; L1’s 2D section: 0.76). Core pin sized so its wall is never thinner than a rib (0.36). %d knots on the 1.75° crease.' % (ND['rib']['ball']['D'], n), size=18, weight=500, color=MUTE)
    H_used = yf + 26 + 30
    fn = '/home/claude/work/l2/l2_kagome_vs_triangles_2_nodes_%s.png' % stamp
    sh.save(fn)
    from PIL import Image
    im = Image.open(fn); im.crop((0, 0, W_, min(H_, int(H_used)))).save(fn)
    print(fn, 'used', H_used)
