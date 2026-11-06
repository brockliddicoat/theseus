"""S1 options sheet A: the wheel opening and the rear cutout's corners (true scale, deck line style)."""
import json, sys
import numpy as np
from shapely.geometry import Polygon
sys.path.insert(0, '/home/claude/work/s1/scripts')
from sheetlib import *
from topgeo import outline_top, ring, to_top
from shellio import poly
from geo_options import option_rear, today_rear, brock_rear, rrect, chamfered, XC
from corners import corner, KINDS, Z_CUT, curvature
from wheelfoot import footprint
import sidegeo as SG

OUT = '/home/claude/work/s1/s1_options_A.png'
W, H = 3200, 2900
sh = Sheet(W, H)
OUTL = outline_top()                              # (u, v) = (-X, -Z)
def T(P): P = np.asarray(P, float); return np.c_[-P[:, 0], -P[:, 1]]      # scene (X, Z) -> top view (u, v)
def M(P): P = np.asarray(P, float); return np.c_[-P[:, 0], P[:, 1]]       # the other trigger (scene)
# the side buttons from above: only what stands proud of the body
BODY = poly('body/body', '1')
SBTOP = []
for p in ['sideFront/sideFront', 'sideRear/sideRear']:
    g = poly(p, '1').difference(BODY.buffer(0.02))
    for q in (g.geoms if hasattr(g, 'geoms') else [g]):
        if q.area > 0.05: SBTOP.append(T(np.array(q.exterior.coords)))

def mouse_top(ax, lw=2.0, buttons=True):
    body(ax, OUTL, lw=lw)
    if buttons:
        for b in SBTOP: fill(ax, b, TRACK, z=3); line(ax, b, 1.2, INK, 0.55, z=8, closed=True)

def wrap(sh, x, y, s, size=17, color=MUTE, width=60, lh=1.35, weight=560):
    words, lines, cur = s.split(), [], ''
    for w_ in words:
        if len(cur) + len(w_) + 1 > width: lines.append(cur); cur = w_
        else: cur = (cur + ' ' + w_).strip()
    lines.append(cur)
    for i, l in enumerate(lines): sh.text(x, y + i * size * lh, l, size=size, weight=weight, color=color)
    return y + len(lines) * size * lh

# ------------------------------------------------------------------ header
sh.title(80, 120, 'S1 · Theseus’s shape · options 1 of 2', size=56)
sh.text(80, 172, 'The wheel opening and the rear cutout’s corners at true scale, drawn from the 3D shell (shell-theseus-1seam). '
        'Blue: the proposals. Red: what you marked. Pick one in each section.', size=26, weight=500, color=MUTE)

# ================================================================== 1. the wheel opening
Y1 = 240
sh.label(80, Y1 + 30, '1 · The wheel opening, from above', size=26, color=INK)
sh.text(80, Y1 + 70, 'Sized to K2’s 0.900 g wheel (Ø22.74 × 7.0 mm, a torus crown) where it passes through the 1.4 mm trigger wall: '
        '17.3 mm long at the inner skin. Gap = the clearance all round. The split meets each end in its middle: a 0.25 mm hairline, no taper.',
        size=22, weight=500, color=MUTE)
F = footprint(); fi = F['inner']; fo = F['outer']
foot_out = np.vstack([np.c_[fo[:, 0], fo[:, 1]], np.c_[fo[::-1, 0], fo[::-1, 2]]])
c0 = fi[np.argmin(np.abs(fi[:, 0]))]; z_in0, z_in1 = c0[1], c0[2]
OPEN = {
    'today': dict(title='Today (rejected)', sub='The 3D: a 9.7 × 18.5 rectangle, r 0.5. The slides smoothed its sparse outline into the funnel you circled (b02_trigBase).',
                  ring=rrect(-4.85, 28.31, 4.85, 46.8, 0.5)),
    'sora': dict(title='The Sora V2 (reference)', sub='9.4 × 18.0, r 1.5, from your scan. Gaps 1.2 at the sides, 0.4 and 0.3 at the ends: not even.',
                 ring=rrect(-4.7, 28.4, 4.7, 46.4, 1.5)),
    'O1': dict(title='O1 · Even 1.0', sub='9.0 × 19.3, r 1.6. The Sora’s look, the same 1.0 mm gap all round.',
               ring=rrect(-4.5, z_in0 - 1.0, 4.5, z_in1 + 1.0, 1.6), gap=1.0),
    'O2': dict(title='O2 · Even 0.6, tight', sub='8.2 × 18.5, r 1.2. Less to see into, less dust over the encoder.',
               ring=rrect(-4.1, z_in0 - 0.6, 4.1, z_in1 + 0.6, 1.2), gap=0.6),
    'O3': dict(title='O3 · The board bay’s corners', sub='8.6 × 18.9, 35.24° chamfers, r 0.6 fillets: plan 5’s bay brought up through the shell.',
               ring=chamfered(-4.3, z_in0 - 0.8, 4.3, z_in1 + 0.8, 1.55, 1.10, 0.6), gap=0.8),
}
s1 = 18.0; pw, ph = 560, 560
for i, (key, o) in enumerate(OPEN.items()):
    x0 = 80 + i * (pw + 40); y0 = Y1 + 110
    sh.card(x0, y0, pw, ph + 150, PANEL)
    ax = sh.panel(x0, y0, pw, ph, 0, -38.5, s1)
    mouse_top(ax)
    R = T(o['ring']); zf, zr = o['ring'][:, 1].max(), o['ring'][:, 1].min(); xo = o['ring'][:, 0].max()
    if key == 'today':
        fill(ax, R, '#F7F7F9', z=3.5)
    else:
        fill(ax, R, '#F7F7F9', z=3.5)
    # the wheel where it shows above the skin (the outer-skin footprint), its knurl
    fill(ax, T(foot_out), TRACK, z=3.6)
    for zz in np.arange(30.7, 45.5, 0.5): line(ax, T([[-3.25, zz], [3.25, zz]]), 0.9, INK, 0.2, z=4)
    line(ax, T(foot_out), 1.2, INK, 0.5, z=4.2, closed=True)
    if key == 'today':
        line(ax, R, 2.0, INK, 0.55, z=7, closed=True)
        fun = T([[-0.15, 59.8], [-1.21, 49.77], [-4.4, 46.42], [-4.85, 46.77], [-4.85, 29.37], [-4.2, 28.52], [-1.06, 22.4], [-0.15, 5.0]])
        line(ax, fun, 2.8, RED, 0.9, z=8); line(ax, fun * [-1, 1], 2.8, RED, 0.9, z=8)
    else:
        line(ax, R, 2.8 if key != 'sora' else 2.2, HERO if key != 'sora' else INK, 1.0 if key != 'sora' else 0.62, z=8, closed=True)
        line(ax, T([[0, 59.6], [0, zf]]), 1.3, INK, 0.5, z=6); line(ax, T([[0, zr], [0, 10]]), 1.3, INK, 0.5, z=6)
        for sgn in (1, -1): line(ax, T([[sgn * xo, zf], [sgn * xo, 58.3]]), 1.2, INK, 0.42, z=6, dash=[6, 5])
    if 'gap' in o:
        g = o['gap']
        dim(sh, ax, T([[-xo, 51.0]])[0], T([[xo, 51.0]])[0], '%.1f' % (2 * xo), size=16)
        dim(sh, ax, T([[9.5, zr]])[0], T([[9.5, zf]])[0], '%.1f' % (zf - zr), size=16)
        # the even gap, marked at the side and at both ends (the ends at the inner skin, where the wheel would touch)
        line(ax, T([[3.5, 38.0], [xo, 38.0]]), 2.0, HERO, 0.9, z=9); sh.text(*sh.to_px(ax, *T([[xo + 0.6, 38.0]])[0]), 'gap %.1f' % g, size=16, weight=700, color=HERO_T, va='center', ha='right')
    sh.label(x0 + 22, y0 + ph + 38, o['title'], size=22, color=RED if key == 'today' else INK)
    wrap(sh, x0 + 22, y0 + ph + 72, o['sub'], size=17, width=58)
sh.text(80, Y1 + 110 + ph + 195, 'Grey band: the wheel showing above the skin. Dashed: the Sora’s creases ahead of the wheel (section 4), on the opening’s sides. '
        '18 px/mm. The 3D gets the chosen opening; the slides draw it from the 3D without smoothing.', size=19, weight=500, color=FAINT)

# ================================================================== 2. the rear cutout's corners
Y2 = 1130
sh.label(80, Y2 + 30, '2 · The rear cutout’s corners', size=26, color=INK)
sh.text(80, Y2 + 70, 'The side seam comes straight back along the side wall, 1.2 mm in from the outline (about 27 mm up the wall, clear of the '
        'side buttons), and turns into the straight cutout on a corner whose curvature rises from zero and falls back to zero: no kink, no jump.',
        size=22, weight=500, color=MUTE)
BL, BR = brock_rear()
SIL = SG.silhouette(); TSIDE = SG.trigger_side(); SEAM0 = SG.seam_lower(); SBS = SG.side_buttons(); LIFT = SG.Lift()
CASES = [('today', 'Today (rejected)', 'The seam climbs to 30.5 mm on the wall, so from above it starts curving in 14 mm before the cutout and meets it 5.5 mm in from the side.'),
         ('brock', 'Your sketch', 'Digitised from your 09:31 markup, scaled onto the 3D outline: the seam stays by the side, then a small turn.'),
         ('K1', 'K1 · Tight', ''), ('K2', 'K2 · Your proportions, made smooth', ''), ('K3', 'K3 · Flowing', '')]
SUB = {'K1': 'Smallest radius %.1f mm; the turn takes %.1f × %.1f mm. Crisp, close to a drawn corner.',
       'K2': 'Smallest radius %.1f mm; the turn takes %.1f × %.1f mm, as your sketch does.',
       'K3': 'Smallest radius %.1f mm; the seam starts bending early and wraps in late: %.1f × %.1f mm.'}
s2 = 8.0; pw2, ph2 = 560, 470
for i, (key, ttl, sub) in enumerate(CASES):
    x0 = 80 + i * (pw2 + 40); y0 = Y2 + 110
    sh.card(x0, y0, pw2, 1500, PANEL)
    ax = sh.panel(x0, y0, pw2, ph2, 0, -14.0, s2)
    mouse_top(ax)
    line(ax, T(rrect(-4.5, 27.8, 4.5, 47.1, 1.6)), 1.3, INK, 0.5, z=6, closed=True)
    line(ax, T([[0, 27.8], [0, Z_CUT]]), 1.3, INK, 0.5, z=6)
    c = None
    if key == 'today':
        Pl = today_rear(); line(ax, T(Pl), 2.8, RED, 1, z=8); line(ax, T(M(Pl)), 2.8, RED, 1, z=8)
    elif key == 'brock':
        Pl = today_rear(); line(ax, T(Pl), 1.3, INK, 0.3, z=6); line(ax, T(M(Pl)), 1.3, INK, 0.3, z=6)
        line(ax, T(BL), 3.2, RED, 0.95, z=8); line(ax, T(BR), 3.2, RED, 0.95, z=8)
    else:
        Pl, c = option_rear(key); line(ax, T(Pl), 2.8, HERO, 1, z=8); line(ax, T(M(Pl)), 2.8, HERO, 1, z=8)
        sub = SUB[key] % (c['rmin'], c['span_x'], c['span_z'])
    sh.label(x0 + 22, y0 + ph2 + 36, ttl, size=22, color=RED if key in ('today', 'brock') else INK)
    wrap(sh, x0 + 22, y0 + ph2 + 70, sub, size=17, width=60)
    # ---- the zoom: the left corner at 50 px/mm
    s3 = 50.0; zx, zy, zw, zh = x0 + 30, y0 + ph2 + 150, pw2 - 60, pw2 - 60
    sh.text(zx, zy - 12, 'The left corner, 50 px/mm', size=16, weight=700, color=FAINT)
    axz = sh.panel(zx, zy, zw, zh, -27.3, -8.2, s3, frame=True)
    mouse_top(axz, lw=2.2)
    if key == 'today':
        line(axz, T(today_rear()), 3.4, RED, 1, z=8)
    elif key == 'brock':
        line(axz, T(today_rear()), 1.6, INK, 0.3, z=6); line(axz, T(BL), 4.2, RED, 0.95, z=8)
    else:
        line(axz, T(Pl), 3.4, HERO, 1, z=8)
        C = c['pts']; kap = curvature(C)
        comb(axz, T(C), kap, scale=1.4, color=HERO, w=1.0, alpha=0.4, every=7)
        for p in (C[0], C[-1]):
            pp = T([p])[0]; axz.plot([pp[0]], [pp[1]], 'o', ms=8 * PX, mfc=PANEL, mec=HERO, mew=1.8 * PX, zorder=11)
    # ---- the same seam from the side (the user's left wall), lifted onto the skin: 12 px/mm
    sy = zy + zh + 50; s4 = 12.0
    axs = sh.panel(x0 + 10, sy, pw2 - 20, 300, -15.0, -28.0, s4)
    fill(axs, SG.S(SIL), PANEL, z=2); line(axs, SG.S(SIL), 2.0, INK, 0.78, z=8, closed=True)
    for b in SBS: fill(axs, SG.S(b), TRACK, z=3); line(axs, SG.S(b), 1.2, INK, 0.5, z=7, closed=True)
    line(axs, SG.S([[-60, 9.3], [60, 9.3]]), 1.0, INK, 0.25, z=4)
    fwd = SEAM0[SEAM0[:, 0] > 23.5]
    line(axs, SG.S(fwd), 1.3, INK, 0.5, z=6)
    if key in ('today', 'brock'):
        top = SEAM0[SEAM0[:, 0] <= 23.6]
        # today's corner and the cutout's line up the wall (the trigger ring's rear edge)
        ytop = TSIDE[np.abs(TSIDE[:, 0] - 5.0) < 0.4][:, 1].max()
        top = np.vstack([top, [[top[0, 0], ytop]]])[np.r_[len(top), 0:len(top)]] if False else top
        line(axs, SG.S(top), 2.8 if key == 'today' else 1.3, RED if key == 'today' else INK, 1 if key == 'today' else 0.5, z=8)
        line(axs, SG.S([[top[0, 0], top[0, 1]], [top[0, 0], ytop]]), 2.8 if key == 'today' else 1.3, RED if key == 'today' else INK, 1 if key == 'today' else 0.5, z=8)
    else:
        L3 = LIFT(Pl[Pl[:, 0] > 15.0]); L3 = L3[np.isfinite(L3[:, 1])]
        # smooth the lift along the side (the wall is steep there: the height map's 0.1 mm steps show), keep the corner,
        # and hand over to today's seam ahead of z 24 (the seam is unchanged there)
        from scipy.ndimage import gaussian_filter1d
        far = L3[:, 0] > c['pts'][-1][1] + 1.0
        ys = gaussian_filter1d(L3[:, 1], 6, mode='nearest'); L3[far, 1] = ys[far]
        y0z = np.interp(L3[:, 0], SEAM0[:, 0], SEAM0[:, 1]); wgt = np.clip((L3[:, 0] - 18.0) / 6.0, 0, 1); wgt = wgt * wgt * (3 - 2 * wgt)
        L3[:, 1] = (1 - wgt) * L3[:, 1] + wgt * y0z
        line(axs, SG.S(L3), 2.8, HERO, 1, z=8)
        ytop = TSIDE[np.abs(TSIDE[:, 0] - 5.0) < 0.4][:, 1].max()
        line(axs, SG.S([[Z_CUT, L3[-1, 1]], [Z_CUT, ytop]]), 2.8, HERO, 1, z=8)
    sh.text(x0 + 30, sy - 12, 'From the side (the left wall), 12 px/mm', size=16, weight=700, color=FAINT)
sh.text(80, Y2 + 110 + 1500 + 50, 'Hairlines on the blue zooms: the curvature comb (length = curvature). A circular fillet jumps from 0 to 1/r where it meets a '
        'straight; these ramp from 0, so the light runs through the turn without a kink. Full views 8 px/mm.', size=19, weight=500, color=FAINT)
sh.save(OUT)
print('saved', OUT)
