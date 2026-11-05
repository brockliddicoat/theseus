# Board placement plan 3 (step 1, third round): one fillet radius everywhere (chamfers straight, their ends filleted), the
# USB-C receptacle flush with the tab, LH1/LH2 (and SH1/SH2) dropped, cut-outs of my own, and today's underside artwork
# adapted to the new outline. Layout frame: x = the user's right, z = toward the nose, mm.
import math, json, random, textwrap, sys
import numpy as np
import matplotlib; matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import Polygon as MP, Circle, FancyBboxPatch, PathPatch
from matplotlib.path import Path
K2 = '/tmp/claude-0/-home-claude/17d0b892-9041-5973-afc8-9659df39052b/scratchpad/k2'
sys.path.insert(0, K2 + '/plan')
from plan_helpers import poly_fillets, BLUE, INK, GREY, RED, GOLD
from webs import webs, circle as wcircle, rrect as wrrect, slot as wslot
sys.path.insert(0, '/home/claude/theseus/3d/pcb/tools/shim')
from shapely.geometry import Polygon as SPoly
OUT = K2 + '/board-plan-5.png'
GREEN, PAGE = '#0E7C5A', '#F7F6F2'
# ------------------------------------------------------------- outline: one radius, chamfers straight
T_FIL = 1.0                     # every fillet starts 1.0 mm from its corner: equal tangent length, the same apparent size
R = T_FIL                       # on a right angle the radius equals the tangent length
SW_PIN_Z, GT_FOOT, GT_CORNER = 39.60, 6.20, 8.24
ZF_TODAY = 46.23
W = 19.03; ZF = SW_PIN_Z + GT_CORNER
WX = 15.42; DEPTH = W - WX                                  # Brock: one notch depth, the waist's (3.61)
ANG = math.atan(0.70656); TA = math.tan(ANG)               # one chamfer angle: the front waist chamfer's, today's line (35.2 deg)
ZT, XT = ZF + DEPTH, 5.85        # the front trapezoid, DEPTH high above the wings (the GT01 line)
ZN = -4.0; ZB = ZN - DEPTH; XN = 9.76                       # the rear notch, DEPTH deep: the lobes extend back, MH3/MH4 unmoved
zA = 30.52 + DEPTH * TA; zB = 17.43 - DEPTH * TA
XB = XN + DEPTH / TA
def r_for(p, a, b, T=T_FIL):
    """the radius that makes the fillet at corner p (between neighbours a and b) start T from p"""
    u = np.subtract(a, p); v = np.subtract(b, p); u = u / np.linalg.norm(u); v = v / np.linalg.norm(v)
    return T * math.tan(math.acos(np.clip(u @ v, -1, 1)) / 2)
P_R = [(XT, ZT), (XT + DEPTH / TA, ZF), (W, ZF), (W, zA), (WX, 30.52), (WX, 17.43), (W, zB), (W, ZB), (XB, ZB), (XN, ZN)]
PTS = [(0, ZT)] + P_R + [(0, ZN)]
CR = [(x, z, r_for((x, z), PTS[i], PTS[i + 2])) for i, (x, z) in enumerate(P_R)]
print('fillet radii for tangent length %.2f:' % T_FIL, [(round(x, 2), round(z, 2), round(r, 2)) for x, z, r in CR])
half = poly_fillets([(0, ZT, 0)] + CR + [(0, ZN, 0)])
outline = np.array(half[:-1] + [(-x, z) for x, z in reversed(half)][:-1])
json.dump(outline.round(4).tolist(), open(K2 + '/plan/outline_v5.json', 'w'))
from scipy.spatial import cKDTree
SYM_ERR = cKDTree(outline).query(np.c_[-outline[:, 0], outline[:, 1]])[0].max()
print('outline mirror error %.6f mm over %d points' % (SYM_ERR, len(outline)))
old = np.array(json.load(open(K2 + '/before/pcb-layout.json'))['outline']); old[:, 0] *= -1
def area(p): x, y = p[:, 0], p[:, 1]; return 0.5 * abs(np.dot(x, np.roll(y, -1)) - np.dot(np.roll(x, -1), y))
def rr_pts(cx, cz, w, h, r, n=10):
    r = min(r, w / 2, h / 2); out = []
    for sx, sz, a0 in ((1, 1, 0), (-1, 1, 90), (-1, -1, 180), (1, -1, 270)):
        c = (cx + sx * (w / 2 - r), cz + sz * (h / 2 - r))
        out += [(c[0] + r * math.cos(math.radians(a0 + 90 * k / n)), c[1] + r * math.sin(math.radians(a0 + 90 * k / n))) for k in range(n + 1)]
    return np.array(out)
# ------------------------------------------------------------- the centre line (as plan 2)
BAY_TODAY = dict(x0=-7.05, x1=7.35)                          # today's bay, off the Sora V2 photo: centred 0.15 mm right of x 0
BAY = dict(x0=-7.20, x1=7.20, z0=27.45, z1=44.95)          # Brock: symmetric. Centred on the wheel (x 0), width 14.40 kept
BAY3 = dict(z0=27.45, z1=43.20)                              # plan 3's bay, for the close-up
TRIM = 0.35                                                  # gold trim round the bay: the board edge's ENIG band width
bay_pts = rr_pts((BAY['x0'] + BAY['x1']) / 2, (BAY['z0'] + BAY['z1']) / 2, BAY['x1'] - BAY['x0'] + 2 * TRIM, BAY['z1'] - BAY['z0'] + 2 * TRIM, T_FIL + TRIM)
bay_in = rr_pts((BAY['x0'] + BAY['x1']) / 2, (BAY['z0'] + BAY['z1']) / 2, BAY['x1'] - BAY['x0'], BAY['z1'] - BAY['z0'], T_FIL)
WB1_TAB_IN = 10.1 - 2.1 - 0.6; ENC_DRILL_IN = -9.15 + 0.35                  # parts.py: the bracket's inner tabs, the encoder's pin drills
BAY_GAPS = dict(wb1_today=WB1_TAB_IN - BAY_TODAY['x1'], wb1=WB1_TAB_IN - BAY['x1'], enc_today=BAY_TODAY['x0'] - ENC_DRILL_IN, enc=BAY['x0'] - ENC_DRILL_IN)
print('bay gaps', {k: round(v, 2) for k, v in BAY_GAPS.items()})
MCU_BACK, MCU_FRONT, SNS_HALF = 7.2, 6.65, 6.4
G3 = (BAY['z0'] - ZN - (MCU_BACK + MCU_FRONT) - 2 * SNS_HALF) / 3
ZM = ZN + G3 + MCU_BACK; ZS = BAY['z0'] - G3 - SNS_HALF
# ------------------------------------------------------------- the USB-C receptacle, flush with the tab
J1_TODAY, J1_LEN, J1_W = 50.43, 7.35, 8.94
J1_Z = J1_TODAY; J1_MOVE = 0.0                                          # Brock: it "needs to hang out a little bit": as today
LEG_END = J1_TODAY + 0.78 + 0.85; LEG_OVER = LEG_END - ZT                  # the front legs' slots end here: past the new front edge?
J1_FIX = ZT - 0.44 - 0.85 - 0.78; J1_BACK = J1_TODAY - J1_FIX              # the receptacle moved back so the legs keep today's 0.44
BAY_FIX = (J1_FIX - 4.10 - 0.5) - 0.35 - 0.3                                # its pads then need the bay's front (and trim) back here
OFS = -2.88                                                           # mouse z = layout z - 2.88 (pcb.js)
SHELL = dict(outer=55.775, floor=55.775 - 1.3, mouth=55.775 - 1.3 - 0.25, tunnel_in=55.775 - 1.3 - 4.0)   # mouse z (3d/shell)
lay = lambda zm: zm - OFS
USB_GAP_TODAY = SHELL['mouth'] - (J1_TODAY + J1_LEN / 2 + OFS); USB_GAP_NEW = SHELL['mouth'] - (J1_FIX + J1_LEN / 2 + OFS); J1_OVER = J1_Z + J1_LEN / 2 - ZT
# ------------------------------------------------------------- holes and cut-outs (plan 3)
MH_TODAY = [(-10.20, 29.56), (10.00, 29.43), (-14.69, -2.25), (14.49, -2.25)]          # the Sora V2 photo's spots
MH = [(-10.10, 29.50, 2.90, 'MH1', False), (10.10, 29.50, 2.90, 'MH2', False), (-14.59, -2.25, 2.90, 'MH3', True), (14.59, -2.25, 2.90, 'MH4', True)]   # mirror pairs
GONE = [(-10.59, -1.72, 2.20, 'LH1'), (10.40, -1.85, 2.20, 'LH2'), (-18.12, -2.25, 1.30, 'SH1'), (17.92, -2.25, 1.30, 'SH2')]
CUTS = []          # Brock on plan 3: the rear cut-outs, "Drop them" (they were rr 3.6 x 7.0 at (+-10, 0.5), -0.12 g)
WIN = dict(c=(10.0, ZS), w=3.83, h=4.29)
PINS = [('SW1 COM', -16.0, 44.68, 1.575, 2.3), ('SW1 NO', -16.0, 39.6, 1.575, 2.3), ('SW1 NC', -16.0, 34.52, 1.575, 2.3),
        ('SW2 COM', 16.0, 44.68, 1.575, 2.3), ('SW2 NO', 16.0, 39.6, 1.575, 2.3), ('SW2 NC', 16.0, 34.52, 1.575, 2.3)]
PEGS = [('SW1 key peg', -17.45, 42.14, 1.0), ('SW2 key peg', 14.55, 42.14, 1.0)]
ENCP = [('ENC1 pin', -9.15, 37.75 + d, 0.7, 1.05) for d in (-1.875, -0.625, 0.625, 1.875)]       # the magnetic encoder's 4 pins
TPS = [('TP ' + n, x, 13.0, 0.8, 1.3, n) for x, n in ((11.2, '1V8'), (13.2, 'GND'), (15.2, 'GND'), (17.2, 'SNS'))]
USB = [('USB-C leg S1', -4.32, J1_Z + 0.78, 0.6, 1.7), ('USB-C leg S2', 4.32, J1_Z + 0.78, 0.6, 1.7),
       ('USB-C leg S3', -4.32, J1_Z - 3.03, 0.6, 1.2), ('USB-C leg S4', 4.32, J1_Z - 3.03, 0.6, 1.2)]
def plan_holes():
    H = [(n, wcircle(x, z, d)) for x, z, d, n, p in MH]
    H += [(n, wcircle(x, z, d)) for n, x, z, d, _ in PINS + ENCP] + [(n, wcircle(x, z, d)) for n, x, z, d in PEGS]
    H += [(t[0], wcircle(t[1], t[2], t[3])) for t in TPS]
    H += [(n, wslot(x, z, w, h)) for n, x, z, w, h in USB]
    H.append(('wheel bay', wrrect((BAY['x0'] + BAY['x1']) / 2, (BAY['z0'] + BAY['z1']) / 2, BAY['x1'] - BAY['x0'], BAY['z1'] - BAY['z0'], R)))
    H.append(('power window', wrrect(WIN['c'][0], WIN['c'][1], WIN['w'], WIN['h'], R)))
    H += [('sensor aperture', wcircle(0, ZS, 2.4)), ('sensor front slot', wslot(0, ZS + 6.0, 2.0, 0.8)), ('sensor rear slot', wslot(0, ZS - 6.0, 2.0, 0.8))]
    H += [('cut-out ' + c['name'], wrrect(c['c'][0], c['c'][1], c['w'], c['h'], R)) for c in CUTS]
    return H
pairs, necks = webs(outline.tolist(), plan_holes(), top=400)
same = lambda a, b: a.split(' ')[0] == b.split(' ')[0] and a.split(' ')[0] in ('ENC1', 'TP', 'SW1', 'SW2', 'USB-C', 'sensor')
pin_pairs = [p for p in pairs if same(p[1], p[2])]; pairs = [p for p in pairs if not same(p[1], p[2])]
web_min = [p for p in pairs if 'USB' not in p[1] + p[2]][0]; web_other = [p for p in pairs if 'USB' not in p[1] + p[2]][0]; web_next = [p for p in pairs if 'cut-out' not in p[1] + p[2]][0]
print('webs', [(round(d, 2), a, b) for d, a, b, _, _ in pairs[:8]], 'necks', [round(n[0], 2) for n in necks])
# cut-out webs to their own neighbours, and the weight they save (derived: 2.4 mg/mm2 = 0.895 mm FR4 at 1.85 g/cm3 + 4 copper layers + mask)
AREAL = 2.4e-3
def rr_area(w, h, r): return w * h - (4 - math.pi) * r * r
cut_g = [rr_area(c['w'], c['h'], R) * AREAL for c in CUTS] or [0.0]
cut_webs = {c['name']: min(d for d, a, b, _, _ in pairs if c['name'] in a + b) if any(c['name'] in a + b for d, a, b, _, _ in pairs) else None for c in CUTS}
# the full web check per cut-out (all neighbours, not only the 12 thinnest)
allp = pairs
for c in CUTS: cut_webs[c['name']] = min(d for d, a, b, _, _ in allp if ('cut-out ' + c['name']) in (a, b))
if not cut_webs: cut_webs = {'none': 0.0}
bay_old = rr_area(14.4, 17.5, 1.2); bay_new = rr_area(14.4, BAY['z1'] - BAY['z0'], R)
holes_g = sum(math.pi * (d / 2) ** 2 for x, z, d, n in GONE) * AREAL
nums = dict(area=(area(old), area(outline)), front=ZF - ZF_TODAY)
print('gap %.3f MCU %.2f sensor %.2f J1 z %.3f (-%.3f) usb gap today %.2f new %.2f cut g %s webs %s area %s' % (G3, ZM, ZS, J1_Z, J1_MOVE, USB_GAP_TODAY, USB_GAP_NEW, [round(g, 3) for g in cut_g], cut_webs, nums['area']))
# ------------------------------------------------------------- figure
fig = plt.figure(figsize=(28, 22.0), dpi=100); fig.patch.set_facecolor(PAGE)
def fsz(ax, cap_mm):
    """font size (pt) whose cap height is cap_mm in ax's data units"""
    bb = ax.get_window_extent(); x0, x1 = ax.get_xlim(); y0, y1 = ax.get_ylim()
    s = min(bb.width / abs(x1 - x0), bb.height / abs(y1 - y0))      # px per mm (aspect equal)
    return cap_mm * s / 0.72 * 72 / fig.dpi
def setup(ax, xl, yl, title):
    ax.set_facecolor(PAGE); ax.set_aspect('equal'); ax.set_anchor('N'); ax.set_xlim(*xl); ax.set_ylim(*yl); ax.axis('off')
    ax.set_title(title, loc='left', fontsize=16, fontweight='bold', color=INK, pad=6)
def rect(ax, x, z, w, h, fc, ec, lw=1.4, ls='-', alpha=1, z0=4, r=0.35):
    ax.add_patch(FancyBboxPatch((x - w / 2 + r, z - h / 2 + r), w - 2 * r, h - 2 * r, boxstyle='round,pad=%g' % r, fc=fc, ec=ec, lw=lw, ls=ls, alpha=alpha, zorder=z0))
def note(ax, xy, txt, xytext, col=INK, fs=8.6, ha='left', bold=False):
    ax.annotate(txt, xy=xy, xytext=xytext, fontsize=fs, color=col, ha=ha, va='center', fontweight='bold' if bold else 'normal', zorder=12,
                arrowprops=dict(arrowstyle='-', color=col, lw=0.9, shrinkA=0, shrinkB=1), bbox=dict(boxstyle='round,pad=0.25', fc=PAGE, ec='none', alpha=0.9))
# ================= TOP =================
axT = fig.add_axes([0.004, 0.435, 0.30, 0.54])
setup(axT, (-31, 31), (-10, 57.5), 'TOP (nose up, the user\'s right on the right)')
axT.add_patch(MP(outline, closed=True, fc='#17181B', ec=GOLD, lw=2.0, zorder=1))
axT.add_patch(MP(old, closed=True, fc='none', ec='#9A9890', lw=1.1, ls=(0, (4, 3)), zorder=6))
axT.add_patch(MP(bay_pts, closed=True, fc=GOLD, ec='none', zorder=2)); axT.add_patch(MP(bay_in, closed=True, fc=PAGE, ec='none', zorder=2.1))
axT.add_patch(MP(rr_pts((BAY_TODAY['x0'] + BAY_TODAY['x1']) / 2, (BAY['z0'] + BAY['z1']) / 2, BAY_TODAY['x1'] - BAY_TODAY['x0'], BAY['z1'] - BAY['z0'], 1.2), closed=True, fc='none', ec=RED, lw=1.0, ls=(0, (3, 2)), alpha=0.85, zorder=6))
for x, z in MH_TODAY: axT.add_patch(Circle((x, z), 1.45, fc='none', ec=RED, lw=0.9, ls=(0, (2, 2)), alpha=0.85, zorder=6))
axT.add_patch(MP(rr_pts(WIN['c'][0], WIN['c'][1], WIN['w'], WIN['h'], R), closed=True, fc=PAGE, ec=GOLD, lw=1.3, zorder=4))
for c in CUTS: axT.add_patch(MP(rr_pts(c['c'][0], c['c'][1], c['w'], c['h'], R), closed=True, fc=PAGE, ec=GREEN, lw=1.6, zorder=4))
for x, z, d, nm, p in MH:
    axT.add_patch(Circle((x, z), d / 2, fc=PAGE, ec=GOLD, lw=1.2, zorder=3)); axT.text(x, z - d / 2 - 0.9, nm, ha='center', va='top', fontsize=7.5, color='#BDBBB4', zorder=7)
for x, z, d, nm in GONE:
    axT.add_patch(Circle((x, z), d / 2, fc='none', ec=GREEN, lw=1.0, ls=(0, (2, 2)), zorder=7))
for t in TPS: axT.add_patch(Circle((t[1], t[2]), t[4] / 2, fc=GOLD, ec='none', zorder=7)); axT.add_patch(Circle((t[1], t[2]), t[3] / 2, fc=PAGE, ec='none', zorder=7))
for x in (0, 10.05, -10.2, 14.5, -14.5): axT.plot([x, x], [-7.5, 54.5], color=BLUE, lw=0.8, ls=(0, (6, 4)), alpha=0.45, zorder=5)
for z, lab in ((ZS, 'PMIC, sensor,\npower switch'), (8.5, 'J3, J2'), (-2.25, 'rear holes'), (29.5, 'front holes'), (37.75, 'wheel axle')):
    axT.plot([-21.0, 21.0], [z, z], color=BLUE, lw=0.8, ls=(0, (6, 4)), alpha=0.3, zorder=5)
    axT.text(-21.3, z, lab + ' (z %.2f)' % z, fontsize=7.8, color=BLUE, va='center', ha='right')
for x, t in ((0, 'x 0'), (10.05, '+10'), (-10.2, '-10'), (14.5, '+14.5'), (-14.5, '-14.5')): axT.text(x, -9.4, t, color=BLUE, fontsize=8.5, ha='center')
FIXED = [('SW1 GT01', -16, 39.6, 5.8, 12.8), ('SW2 GT01', 16, 39.6, 5.8, 12.8), ('ENC1', -9.45, 37.75, 3.8, 10), ('WB1 + SW4', 10.1, 37.75, 5.4, 7.9), ('U4', -9.6, 44.0, 1.6, 1.6), ('D1', 8.45, 45.0, 1.2, 0.8)]
for nm, x, z, w, h in FIXED:
    rect(axT, x, z, w, h, '#2A2B30', '#8E8C86', 1.0)
    axT.text(x, z, nm, ha='center', va='center', fontsize=7.2, color='#D8D6D0', zorder=8, rotation=90 if h > 2.5 * w else 0)
rect(axT, 0, J1_TODAY, J1_W, J1_LEN, 'none', RED, 1.1, (0, (3, 2)), 0.85, 6)
rect(axT, 0, J1_Z, J1_W, J1_LEN, '#2A2B30', '#8E8C86', 1.0, z0=5); axT.text(0, J1_Z, 'J1 USB-C', ha='center', va='center', fontsize=7.2, color='#D8D6D0', zorder=8)
for sx in (-1, 1): rect(axT, sx * 4.32, J1_Z + 0.78, 0.6, 1.7, RED if LEG_OVER > 0 else '#33363C', 'none', 0, '-', 1, 9, 0.29)
rect(axT, 0, J1_FIX, J1_W, J1_LEN, 'none', GREEN, 1.2, (0, (2, 2)), 1, 9)
NEW = {'U3': (0.0, ZS, 9.0, 12.8, BLUE, 'Sensor PAW3970\n+ lens slots'), 'U1': (0.0, ZM - (MCU_BACK - MCU_FRONT) / 2, 9.9, MCU_BACK + MCU_FRONT, '#3C3F46', 'MCU module\nAN54LM-20A'),
       'U2': (-10.2, ZS, 5.0, 5.0, '#8A5A2B', 'PMIC'), 'J2': (14.5, 8.5, 6.8, 5.7, '#6B6E76', 'J2\nbattery'), 'J3': (-14.5, 8.5, 5.7, 6.8, '#6B6E76', 'J3\nside')}
rect(axT, -10.2, ZS, 9.2, 9.6, '#8A5A2B', '#D9A36A', 1.0, '-', 0.28, 4)
for k, (x, z, w, h, col, lab) in NEW.items():
    rect(axT, x, z, w, h, col, 'white' if k != 'U1' else '#B9BBC2', 1.5, '-', 0.95, 7)
    axT.text(x, z + (-2.2 if k == 'U1' else -1.2 if k == 'U3' else 0), lab, ha='center', va='center', fontsize=8.2, color='white', fontweight='bold', zorder=10)
axT.plot([-4.3, 4.3], [ZM - MCU_BACK + 0.28] * 2, color=GOLD, lw=2.6, solid_capstyle='butt', zorder=8)
rect(axT, 0, ZM + MCU_FRONT - 1.85, 13.2, 3.7, 'none', '#FF6BD6', 1.0, (0, (2, 2)), 1, 8, 0.05)
rect(axT, WIN['c'][0], WIN['c'][1], 1.8, 5.2, '#C9CCD2', '#555', 1.0, '-', 1, 7, 0.1); axT.text(10.0, ZS + 2.8, 'SW3', ha='center', fontsize=7.5, color='#2E8B57', fontweight='bold', zorder=10)
for z0, z1 in ((ZN, ZN + G3), (ZM + MCU_FRONT, ZM + MCU_FRONT + G3), (BAY['z0'] - G3, BAY['z0'])):
    axT.annotate('', xy=(0, z1), xytext=(0, z0), arrowprops=dict(arrowstyle='<->', color='#FFD25A', lw=1.5, shrinkA=0, shrinkB=0), zorder=13)
    axT.text(0.6, (z0 + z1) / 2, '%.2f' % G3, color='#FFD25A', fontsize=9, fontweight='bold', va='center', zorder=13)
for t in TPS: axT.text(t[1], t[2] + 1.15, t[5], ha='center', va='bottom', fontsize=6, color='#D8D6D0', zorder=9)
note(axT, (8.2, 50.1), 'front: one trapezoid, no tab', (10.5, 55.8), GREEN, bold=True)
axT.annotate('', xy=(-8.2, 50.1), xytext=(10.5, 55.8), arrowprops=dict(arrowstyle='-', color=GREEN, lw=0.9, alpha=0.8), zorder=11)
note(axT, (W - 0.3, ZF - 0.3), 'every fillet starts\n1.0 mm from its corner', (20.6, 51.4), GREEN, bold=True)
note(axT, (4.32, LEG_END - 0.3), 'conflict: the USB-C legs cross\nthe new front edge by %.2f mm' % LEG_OVER, (-24.8, 55.2), RED, bold=True)
note(axT, (10.40, -1.85), 'LH1, LH2, SH1, SH2\ndropped', (20.6, -5.6), GREEN)
note(axT, (BAY['x1'] + 0.2, 40.0), 'wheel bay: centred on x 0\n(0.15 mm left), gold trim', (20.6, 45.5), GREEN, bold=True)
note(axT, (11.55, 29.5), 'MH1 to MH4 in\nmirror pairs', (20.6, 25.0), GREEN, bold=True)
axT.text(0, 56.6, 'mirror line: the outline, the bay and the holes', ha='center', fontsize=8.2, color=BLUE, fontweight='bold')
axT.plot([-10, 10], [-4.82, -4.82], color=GOLD, lw=2.4, alpha=0.5, zorder=0); axT.text(0, -6.3, 'battery front, 20 wide, z -4.82', ha='center', fontsize=7.5, color=GREY)
# ================= UNDERSIDE, today's artwork adapted =================
axB = fig.add_axes([0.31, 0.435, 0.215, 0.54])
setup(axB, (-21.5, 21.5), (-10, 57.5), 'UNDERSIDE, PLAN 5 (today\'s art, adapted)')
MIR = lambda P: np.c_[-np.asarray(P)[:, 0], np.asarray(P)[:, 1]]
COPPER, GAPC, ENIG, SILK, BARE = '#121316', '#2B2D33', '#D7BD7F', '#EDEBE5', '#26282D'
axB.add_patch(MP(MIR(outline), closed=True, fc=ENIG, ec=ENIG, lw=0.6, zorder=1))
inner = SPoly(outline.tolist()).buffer(-0.35); innerP = np.array(inner.exterior.coords)
axB.add_patch(MP(MIR(innerP), closed=True, fc=COPPER, ec='none', zorder=1.2))
region = SPoly(outline.tolist()).buffer(-0.65); regP = MIR(np.array(region.exterior.coords))
clipB = MP(regP, closed=True, transform=axB.transData)
axB.add_patch(MP(regP, closed=True, fc=GAPC, ec='none', zorder=1.3))
S_, H_ = 2.45, 2.45 * math.sqrt(3) / 2
def lattice(x0, z0, x1, z1, origin=(0.0, -3.2)):
    cells = []; r = int(math.floor((z0 - origin[1]) / H_)) - 1
    while origin[1] + r * H_ < z1 + H_:
        zb = origin[1] + r * H_; off = (r % 2) * S_ / 2; c = int(math.floor((x0 - origin[0] - off) / S_)) - 1
        while origin[0] + off + c * S_ < x1 + S_:
            xa = origin[0] + off + c * S_
            cells.append(np.array([(xa, zb), (xa + S_, zb), (xa + S_ / 2, zb + H_)])); cells.append(np.array([(xa + S_ / 2, zb + H_), (xa + S_ * 1.5, zb + H_), (xa + S_, zb)]))
            c += 1
        r += 1
    return cells
TRI_R = 0.15                                              # one fillet radius on every triangle (F26.6)
def rtri(P, ins, r=TRI_R):
    P = np.asarray(P, float)
    if (P[1, 0] - P[0, 0]) * (P[2, 1] - P[0, 1]) - (P[1, 1] - P[0, 1]) * (P[2, 0] - P[0, 0]) < 0: P = P[::-1]     # counter-clockwise, so each arc joins the next
    c = P.mean(0); r0 = S_ / (2 * math.sqrt(3)); q = c + (P - c) * (r0 - ins - r) / r0; out = []
    for p in q:
        u = (p - c) / np.linalg.norm(p - c); a = math.atan2(u[1], u[0])
        out += [p + r * np.array([math.cos(a + (k / 8 - 0.5) * 2 * math.pi / 3), math.sin(a + (k / 8 - 0.5) * 2 * math.pi / 3)]) for k in range(9)]
    return np.array(out)
# keep zones (no mosaic): hole keep-outs, the plated rear holes' rings, THT rings, the antenna keep-out; reserved (solid pour)
KEEP = [('c', x, z, d / 2 + (0.75 + 0.3 if p else 0.3)) for x, z, d, n, p in MH]
KEEP += [('c', x, z, pd / 2 + 0.25) for n, x, z, d, pd in PINS + ENCP] + [('c', x, z, d / 2 + 0.3) for n, x, z, d in PEGS] + [('c', t[1], t[2], t[4] / 2 + 0.25) for t in TPS]
KEEP += [('r', x, z, 1.0 + 0.5, h + 0.9) for n, x, z, w, h in USB]
KEEP += [('r', (BAY['x0'] + BAY['x1']) / 2, (BAY['z0'] + BAY['z1']) / 2, BAY['x1'] - BAY['x0'] + 0.6, BAY['z1'] - BAY['z0'] + 0.6), ('r', WIN['c'][0], WIN['c'][1], WIN['w'] + 0.6, WIN['h'] + 0.6)]
KEEP += [('r', c['c'][0], c['c'][1], c['w'] + 0.6, c['h'] + 0.6) for c in CUTS] + [('r', 0, ZM + MCU_FRONT - 1.85, 13.2 + 0.5, 3.7 + 0.5)]
QR_C, QR_S = (-11.0, 9.8), 7.2
RES = [('r', QR_C[0], QR_C[1] - 0.5, QR_S + 1.2, QR_S + 2.2), ('r', 0, 2.6, 15.0, 2.8), ('r', 0, -0.05, 8.0, 2.1), ('r', 0, ZS, 10.6, 13.6),
       ('r', WIN['c'][0], WIN['c'][1], WIN['w'] + 4.6, WIN['h'] + 4.6), ('r', 14.2, 13.6, 7.8, 2.6)]
def in_zone(pt, Z):
    k, x, z = Z[:3]
    if k == 'c': return math.hypot(pt[0] - x, pt[1] - z) < Z[3]
    return abs(pt[0] - x) < Z[3] / 2 and abs(pt[1] - z) < Z[4] / 2
def tri_hits(P, Z):
    """does the triangle P touch zone Z? (dense edge samples + the centroid)"""
    pts = [P[i] + (P[(i + 1) % 3] - P[i]) * k / 6 for i in range(3) for k in range(6)] + [P.mean(0)]
    return any(in_zone(p, Z) for p in pts)
regPath = Path(np.array(region.exterior.coords))
rnd = random.Random(11); fg = np.array([17.5, -3.0]); fs_ = np.array([-17.0, 44.0])
gold, silk_t, n_cells = [], [], 0
for P in lattice(-20, -6, 20, 53):
    if not regPath.contains_points(P).any() and not regPath.contains_point(P.mean(0)): continue
    if any(tri_hits(P, Z) for Z in RES): continue
    n_cells += 1
    p = MP(MIR(rtri(P, 0.13)), closed=True, fc=COPPER, ec='none', zorder=1.5); axB.add_patch(p); p.set_clip_path(clipB)
    grow = P.mean(0) + (P - P.mean(0)) * 1.07
    if not regPath.contains_points(grow).all() or any(tri_hits(grow, Z) for Z in KEEP): continue
    cen = P.mean(0); dg = np.linalg.norm(cen - fg); ds = np.linalg.norm(cen - fs_)
    pg = max(0.0, 1.0 - dg / 21.0) ** 1.25 * 0.95; ps = max(0.0, 1.0 - ds / 19.0) ** 1.25 * 0.8
    if rnd.random() < pg: gold.append(P)
    elif rnd.random() < ps: silk_t.append(P)
for P in gold: axB.add_patch(MP(MIR(rtri(P, 0.36)), closed=True, fc=ENIG, ec='none', zorder=2.2))
for P in silk_t: axB.add_patch(MP(MIR(rtri(P, 0.45)), closed=True, fc='none', ec=SILK, lw=0.9, zorder=2.2))
# the keep zones read as bare laminate under the mask; reserved zones as solid pour
for Z in KEEP:
    if Z[0] == 'c': axB.add_patch(Circle((-Z[1], Z[2]), Z[3], fc=BARE, ec='none', zorder=2.0))
    else: axB.add_patch(MP(MIR(rr_pts(Z[1], Z[2], Z[3], Z[4], 0.5)), closed=True, fc=BARE, ec='none', zorder=2.0))
for Z in RES: axB.add_patch(MP(MIR(rr_pts(Z[1], Z[2], Z[3], Z[4], 0.4)), closed=True, fc=COPPER, ec='none', zorder=2.05))
# holes, rings
axB.add_patch(MP(MIR(bay_pts), closed=True, fc=ENIG, ec='none', zorder=2.9)); axB.add_patch(MP(MIR(bay_in), closed=True, fc=PAGE, ec='none', zorder=3))
axB.add_patch(MP(MIR(rr_pts(WIN['c'][0], WIN['c'][1], WIN['w'], WIN['h'], R)), closed=True, fc=PAGE, ec=ENIG, lw=0.8, zorder=3))
rect(axB, -10.0, ZS + 0.5, 1.0, 0.9, '#111', '#555', 1, '-', 1, 8, 0.1)
for c in CUTS: axB.add_patch(MP(MIR(rr_pts(c['c'][0], c['c'][1], c['w'], c['h'], R)), closed=True, fc=PAGE, ec=ENIG, lw=0.8, zorder=3))
for x, z, d, n, p in MH:
    if p: axB.add_patch(Circle((-x, z), 2.2, fc=ENIG, ec='none', zorder=2.6))
    axB.add_patch(Circle((-x, z), d / 2, fc=PAGE, ec='none', zorder=3))
for n, x, z, d, pd in PINS + ENCP: axB.add_patch(Circle((-x, z), pd / 2, fc=ENIG, ec='none', zorder=2.6)); axB.add_patch(Circle((-x, z), d / 2, fc=PAGE, ec='none', zorder=3))
for t in TPS: axB.add_patch(Circle((-t[1], t[2]), t[4] / 2, fc=ENIG, ec='none', zorder=2.6)); axB.add_patch(Circle((-t[1], t[2]), t[3] / 2, fc=PAGE, ec='none', zorder=3))
for n, x, z, d in PEGS: axB.add_patch(Circle((-x, z), d / 2, fc=PAGE, ec='none', zorder=3))
for n, x, z, w, h in USB: rect(axB, -x, z, 1.0, h + 0.4, ENIG, 'none', 0, '-', 1, 2.6, 0.5); rect(axB, -x, z, w, h, PAGE, 'none', 0, '-', 1, 3, w / 2 - 0.01)
# the lens on the bottom; the switch's actuator in the window
rect(axB, 0.0, ZS, 6.4, 12.2, '#C9CCD2', '#8E939B', 1.0, '-', 1, 4, 1.2); rect(axB, 0.0, ZS, 2.6, 2.6, '#33363C', 'none', 0, '-', 1, 5, 1.3)
axB.add_patch(Circle((0, ZS + 2.6), 1.0, fc='#33363C', ec='none', zorder=5))
# silk: wordmark, fab block, ON/OFF + POWER, test pad labels, LT/RT, the QR, dashed rings round MH1/MH2
def silk_text(x, z, s, cap, bold=False, rot=0, ha='center'):
    axB.text(-x, z, s, ha=ha, va='center', fontsize=fsz(axB, cap), color=SILK, fontweight='bold' if bold else 'normal', rotation=rot, zorder=6, family='DejaVu Sans')
for i, ch in enumerate('THESEUS'): silk_text(6.3 - 2.1 * i, 2.6, ch, 1.9, True)          # mirrored: read from below
silk_text(0, 0.45, '94V-0   2611', 0.5); silk_text(0, -0.5, '4L   1.0mm   ENIG', 0.45)
silk_text(WIN['c'][0] + 0.2, WIN['c'][1] + WIN['h'] / 2 + 0.95, 'ON', 0.95, True); silk_text(WIN['c'][0] + 0.2, WIN['c'][1] - WIN['h'] / 2 - 0.95, 'OFF', 0.95, True)
xa = WIN['c'][0] - WIN['w'] / 2 - 0.75
axB.annotate('', xy=(-xa, ZS + 1.3), xytext=(-xa, ZS - 1.3), arrowprops=dict(arrowstyle='<->', color=SILK, lw=0.8), zorder=6)
silk_text(WIN['c'][0] - WIN['w'] / 2 - 1.6, ZS, 'POWER', 0.5, rot=90)
for t in TPS: silk_text(t[1], t[2] + 1.25, t[5], 0.45)
silk_text(-16.0, 32.0, 'LT', 0.9); silk_text(16.0, 32.0, 'RT', 0.9)
for x, z, d, n, p in MH[:2]:
    for k in range(4):
        a0 = 90 * k + 12; axB.add_patch(matplotlib.patches.Arc((-x, z), 2 * (d / 2 + 0.55), 2 * (d / 2 + 0.55), theta1=a0, theta2=a0 + 66, color=SILK, lw=1.3, zorder=6))
sys.path.insert(0, '/home/claude/theseus/3d/pcb/tools')
import segno
q = segno.make('https://theseus.example/software', error='m'); M = np.array([[1 if c else 0 for c in row] for row in q.matrix], np.uint8)
n = M.shape[0]; ms = QR_S / n
axB.add_patch(MP(MIR(rr_pts(QR_C[0], QR_C[1], QR_S + 2 * ms, QR_S + 2 * ms, 0.1)), closed=True, fc=SILK, ec='none', zorder=6))
for i in range(n):
    for j in range(n):
        if M[i, j]:
            x = QR_C[0] - QR_S / 2 + (n - 1 - j) * ms; z = QR_C[1] + QR_S / 2 - (i + 1) * ms     # mirrored, to read from below
            axB.add_patch(matplotlib.patches.Rectangle((-x - ms, z), ms, ms, fc=COPPER, ec='none', zorder=6.5))
silk_text(QR_C[0], QR_C[1] - QR_S / 2 - 0.85, 'SCAN  FOR  THE  WEB  SOFTWARE', 0.5)
axB.text(0, -8.6, 'every triangle filleted at one radius (r %.2f); the partial triangles at the edges stay; %d triangles' % (TRI_R, n_cells), ha='center', fontsize=8.2, color=INK)
# ================= today's underside (render) =================
axR = fig.add_axes([0.53, 0.435, 0.165, 0.54]); axR.axis('off')
from PIL import Image
im = np.asarray(Image.open(K2 + '/ba1/before_bottom.png').convert('RGB'))
axR.imshow(im[60:1440, 40:960]); axR.set_title('UNDERSIDE TODAY (render)', loc='left', fontsize=16, fontweight='bold', color=INK, pad=6)
# ================= close-ups =================
def board_axes(rect_, xl, yl, title):
    ax = fig.add_axes(rect_); setup(ax, xl, yl, title); ax.title.set_fontsize(12)
    return ax
p3 = np.array(json.load(open(K2 + '/plan/outline_v4.json')))         # plan 4, for before -> after
def closeup(rect_, xl, yl, title, marks, bay=False):
    ax = board_axes(rect_, xl, yl, title)
    ax.add_patch(MP(outline, closed=True, fc='#17181B', ec=GOLD, lw=2.4, zorder=1))
    ax.add_patch(MP(p3, closed=True, fc='none', ec='#9A9890', lw=1.6, ls=(0, (4, 3)), zorder=6))
    if bay:
        b3 = rr_pts((BAY['x0'] + BAY['x1']) / 2, (BAY3['z0'] + BAY3['z1']) / 2, BAY['x1'] - BAY['x0'], BAY3['z1'] - BAY3['z0'], 0.75)
        ax.add_patch(MP(bay_pts, closed=True, fc=GOLD, ec='none', zorder=2)); ax.add_patch(MP(bay_in, closed=True, fc=PAGE, ec='none', zorder=3))
        ax.add_patch(MP(b3, closed=True, fc='none', ec='#9A9890', lw=1.6, ls=(0, (4, 3)), zorder=6))
    for (px, pz, lab, dx, dz) in marks:
        ax.add_patch(Circle((px, pz), 0.55 * T_FIL + 0.3, fc='none', ec='#FFD25A', lw=1.4, zorder=8)); ax.text(px + dx, pz + dz, lab, color='#FFD25A', fontsize=9, fontweight='bold', zorder=9)
    return ax
rad = {(round(x, 2), round(z, 2)): r for x, z, r in CR}
def rr_of(x, z): return rad[(round(x, 2), round(z, 2))]
def depth(ax, p0, p1, lab, side):
    ax.annotate('', xy=p1, xytext=p0, arrowprops=dict(arrowstyle='<->', color='#FFD25A', lw=1.4, shrinkA=0, shrinkB=0), zorder=10)
    ax.text((p0[0] + p1[0]) / 2 + side[0], (p0[1] + p1[1]) / 2 + side[1], lab, color='#FFD25A', fontsize=9.5, fontweight='bold', zorder=10, ha='center')
angl = '%.0f°' % math.degrees(ANG)
axF = closeup([0.01, 0.225, 0.105, 0.20], (3.0, 15.0), (45.0, 54.5), 'Front: %.2f high' % DEPTH, [])
depth(axF, (12.2, ZF), (12.2, ZT), 'D %.2f' % DEPTH, (0.9, 0)); axF.text(XT + DEPTH / TA / 2 + 0.4, (ZF + ZT) / 2 + 0.6, angl, color=GREEN, fontsize=10, fontweight='bold', zorder=10)
axWn = closeup([0.12, 0.225, 0.105, 0.20], (12.5, 21.0), (27.5, 36.0), 'Waist: %.2f deep' % DEPTH, [])
depth(axWn, (WX, 28.6), (W, 28.6), 'D %.2f' % DEPTH, (0, -1.0)); axWn.text(17.4, 31.0, angl, color=GREEN, fontsize=10, fontweight='bold', zorder=10)
axRn = closeup([0.23, 0.225, 0.105, 0.20], (6.5, 20.0), (-9.5, 0.5), 'Rear notch: %.2f deep' % DEPTH, [])
depth(axRn, (8.2, ZN), (8.2, ZB), 'D %.2f' % DEPTH, (-1.1, 0)); axRn.text(XN + DEPTH / TA / 2 - 0.3, (ZN + ZB) / 2 + 0.6, angl, color=GREEN, fontsize=10, fontweight='bold', zorder=10)
axRn.plot([-10, 10], [-4.82, -4.82], color=GOLD, lw=2, alpha=0.6, zorder=7); axRn.text(6.7, -4.6, 'battery front', fontsize=7, color=GREY, zorder=9)
axUc = board_axes([0.34, 0.225, 0.105, 0.20], (-7.5, 7.5), (42.0, 58.0), 'The receptacle: the conflict')
axUc.add_patch(MP(outline, closed=True, fc='#17181B', ec=GOLD, lw=2.0, zorder=1))
rect(axUc, 0, J1_TODAY, J1_W, J1_LEN, '#9CA1A8', '#555', 1.0, '-', 0.85, 5, 0.3)
for sx in (-1, 1): rect(axUc, sx * 4.32, J1_TODAY + 0.78, 0.6, 1.7, RED, 'none', 0, '-', 1, 6, 0.29)
rect(axUc, 0, J1_FIX, J1_W, J1_LEN, 'none', GREEN, 1.3, (0, (2, 2)), 1, 7)
axUc.plot([-7.5, 7.5], [lay(SHELL['mouth'])] * 2, color=RED, lw=1.0, zorder=7); axUc.text(-7.3, lay(SHELL['mouth']) + 0.3, 'where the shell wants the mouth', fontsize=7, color=RED)
axUc.text(-7.3, 43.0, 'red: legs past the edge by %.2f\ngreen: %.2f mm back fixes it' % (LEG_OVER, J1_BACK), fontsize=7.5, color='#E8E6E0', zorder=9)
for ax_ in fig.axes[-4:-1]: ax_.text(ax_.get_xlim()[0] + 0.2, ax_.get_ylim()[0] + 0.3, 'grey dashed: plan 4', fontsize=7.5, color=GREY, zorder=9)
# the webs and the cut-outs, as a table
axW = fig.add_axes([0.455, 0.225, 0.24, 0.20]); axW.axis('off')
axW.set_title('Holes, the front and the webs', loc='left', fontsize=12, fontweight='bold', color=INK)
pin_min = min(p[0] for p in pin_pairs)
net = -sum(cut_g) + holes_g + (bay_old - bay_new) * AREAL
rows = [('No cut-outs of my own (Brock dropped the rear pair)', ''),
        ('LH1, LH2, SH1, SH2 filled in (nothing in the shell or plate meets them)', '%+.3f g' % holes_g),
        ('Front: trapezoid, no tab; the wheel bay centred on x 0, gold trim', ''),
        ('', ''),
        ('Thinnest web, the receptacle aside: %.2f mm (%s to %s)' % (web_min[0], web_min[1], web_min[2]), ''),
        ('Today: 0.27 (SH1), 0.34 (SH2), 0.44 (USB-C legs), 0.60 (test pads)', ''),
        ('Pins of one part keep their pitch: the encoder\'s 4 pins, 1.25 mm apart, %.2f between drills' % min(p[0] for p in pin_pairs), ''),
        ('USB-C: its legs cross the edge where it is; %.2f mm back it keeps 0.44 and hangs %.2f out' % (J1_BACK, J1_FIX + J1_LEN / 2 - ZT), ''),
        ('  the fit to the shell\'s opening (then %.2f mm short, 1.36 mm up) waits for a shell round' % USB_GAP_NEW, '')]
for i, (a, b) in enumerate(rows):
    yy = 0.92 - i * 0.084
    axW.text(0.0, yy, a, fontsize=9.6, color=INK, va='center', transform=axW.transAxes, fontweight='bold' if not a.startswith('  ') and a else 'normal')
    axW.text(1.0, yy, b, fontsize=9.6, color=GREEN, va='center', ha='right', fontweight='bold', transform=axW.transAxes)

# ================= the power switch: A (in the window) and B (hanging off the edge) =================
SWA = dict(body=(1.8, 5.2), knob_drop=0.25)                    # the bridge switch of 3d/pcb/tools/components.py
SWB = dict(L=6.7, Wd=2.6, H=1.4, act=1.5)                       # C&K PCM12SMTR: 6.7 x 2.6 x 1.4 mm (RS), actuator 1.5 mm (C&K)
BOARD_BOT, PLATE_OUT, PLATE_IN = 5.03 - 1.0, 0.65, 1.85          # mouse y: the board's underside, the plate's outer and inner faces
win_g = rr_area(WIN['w'], WIN['h'], R) * AREAL
mA = (1.8 * 1.0 * 5.2 + 1.0 * 1.32 * 0.9) * 1.4e-3 + 1.86 * 0.08 * 5.26 * 7.9e-3      # the model's volumes, plastic + steel cover
mB = SWB['L'] * SWB['Wd'] * SWB['H'] * 2.0e-3                                          # estimate: 2 g/cm3 of plastic and metal
reachA = BOARD_BOT - SWA['knob_drop'] - PLATE_OUT; reachB = (BOARD_BOT - SWB['H'] / 2 - 0.5) - PLATE_OUT
ZSW = ZS
def waist(ax):
    ax.add_patch(MP(outline, closed=True, fc='#17181B', ec=GOLD, lw=1.6, zorder=1))
    rect(ax, 0.0, ZS, 9.0, 12.8, BLUE, 'white', 1.2, '-', 0.95, 5)
    for t in TPS: ax.add_patch(Circle((t[1], t[2]), t[4] / 2, fc=GOLD, ec='none', zorder=6)); ax.add_patch(Circle((t[1], t[2]), t[3] / 2, fc=PAGE, ec='none', zorder=6))
    ax.plot([2, 21], [ZSW, ZSW], color=BLUE, lw=0.8, ls=(0, (6, 4)), alpha=0.5, zorder=7); ax.text(20.8, ZSW + 0.35, 'row z %.2f' % ZSW, fontsize=7.5, color=BLUE, ha='right')
axA = board_axes([0.01, 0.02, 0.125, 0.185], (3.0, 21.5), (12.0, 27.0), 'A: in a window (as planned)')
waist(axA)
axA.add_patch(MP(rr_pts(WIN['c'][0], WIN['c'][1], WIN['w'], WIN['h'], R), closed=True, fc=PAGE, ec=GOLD, lw=1.2, zorder=3))
rect(axA, WIN['c'][0], WIN['c'][1], 1.8, 5.2, '#C9CCD2', '#555', 1.0, '-', 1, 7, 0.1); rect(axA, WIN['c'][0], WIN['c'][1], 1.0, 0.9, '#111', 'none', 0, '-', 1, 8, 0.1)
axB2 = board_axes([0.235, 0.02, 0.125, 0.185], (3.0, 21.5), (12.0, 27.0), 'B: hanging off the edge')
waist(axB2)
rect(axB2, WX - SWB['Wd'] / 2, ZSW, SWB['Wd'], SWB['L'], 'none', '#C9CCD2', 1.2, (0, (3, 2)), 1, 7, 0.2)
rect(axB2, WX + SWB['act'] / 2, ZSW, SWB['act'], 1.0, '#111', '#C9CCD2', 1.0, '-', 1, 8, 0.15)
axB2.annotate('', xy=(WX + 0.75, ZSW + 2.4), xytext=(WX + 0.75, ZSW - 2.4), arrowprops=dict(arrowstyle='<->', color='#E8E6E0', lw=0.9), zorder=9)
axB2.text(WX - 1.3, ZSW - 4.4, 'on the underside\n(dashed)', fontsize=7, color='#D8D6D0', ha='center', zorder=9)
def section(rect_, title, B):
    ax = fig.add_axes(rect_); ax.set_facecolor(PAGE); ax.set_aspect('equal'); ax.set_anchor('N'); ax.axis('off')
    ax.set_xlim(5.0, 21.0); ax.set_ylim(-0.6, 8.2); ax.set_title(title, loc='left', fontsize=10, fontweight='bold', color=INK)
    ax.add_patch(matplotlib.patches.Rectangle((5.0, PLATE_OUT), 16.0, PLATE_IN - PLATE_OUT, fc='#C9C8C3', ec='none', zorder=1))
    ax.text(5.2, PLATE_OUT + 0.25, 'bottom plate', fontsize=7, color=INK, zorder=3)
    if not B:
        for x0, x1 in ((5.0, WIN['c'][0] - WIN['w'] / 2), (WIN['c'][0] + WIN['w'] / 2, WX)): ax.add_patch(matplotlib.patches.Rectangle((x0, BOARD_BOT), x1 - x0, 1.0, fc='#17181B', ec=GOLD, lw=0.8, zorder=2))
        ax.add_patch(matplotlib.patches.Rectangle((WIN['c'][0] - 0.9, BOARD_BOT + 1.0), 1.8, 1.0, fc='#C9CCD2', ec='#555', lw=0.8, zorder=3))
        ax.add_patch(matplotlib.patches.Rectangle((WIN['c'][0] - 0.5, BOARD_BOT - SWA['knob_drop']), 1.0, 1.32, fc='#111', ec='none', zorder=4))
        xr, ytip = WIN['c'][0] + 1.6, BOARD_BOT - SWA['knob_drop']
        ax.add_patch(matplotlib.patches.Rectangle((WIN['c'][0] - 1.0, PLATE_OUT), 2.0, PLATE_IN - PLATE_OUT, fc=PAGE, ec='none', zorder=2))
    else:
        ax.add_patch(matplotlib.patches.Rectangle((5.0, BOARD_BOT), WX - 5.0, 1.0, fc='#17181B', ec=GOLD, lw=0.8, zorder=2))
        ax.add_patch(matplotlib.patches.Rectangle((WX - SWB['Wd'], BOARD_BOT - SWB['H']), SWB['Wd'], SWB['H'], fc='#C9CCD2', ec='#555', lw=0.8, zorder=3))
        ax.add_patch(matplotlib.patches.Rectangle((WX, BOARD_BOT - SWB['H'] / 2 - 0.5), SWB['act'], 1.0, fc='#111', ec='none', zorder=4))
        xr, ytip = WX + SWB['act'] + 0.5, BOARD_BOT - SWB['H'] / 2 - 0.5
        ax.add_patch(matplotlib.patches.Rectangle((WX - 0.2, PLATE_OUT), 2.2, PLATE_IN - PLATE_OUT, fc=PAGE, ec='none', zorder=2))
    ax.annotate('', xy=(xr, ytip), xytext=(xr, PLATE_OUT), arrowprops=dict(arrowstyle='<->', color=RED, lw=1.1, shrinkA=0, shrinkB=0), zorder=6)
    ax.text(xr + 0.3, (ytip + PLATE_OUT) / 2, '%.1f in\nfrom outside' % (ytip - PLATE_OUT), fontsize=8, color=RED, fontweight='bold', va='center', zorder=6)
    ax.text(5.2, BOARD_BOT + 2.4, 'board, cut at z %.2f' % ZSW, fontsize=7, color=INK, zorder=6)
    return ax
section([0.138, 0.02, 0.095, 0.185], 'A, section', False)
section([0.363, 0.02, 0.095, 0.185], 'B, section', True)
axS = fig.add_axes([0.462, 0.02, 0.233, 0.185]); axS.axis('off')
axS.set_title('Power switch: A or B', loc='left', fontsize=12, fontweight='bold', color=INK)
rowsS = [('A, window: the bridge switch over a 3.83 × 4.29 mm window, on the +10 axis', ''),
         ('  board: the window saves (derived)', '%.3f g' % -win_g), ('  switch: about (estimate, from its model)', '%.3f g' % mA),
         ('  reach: the knob 0.25 mm under the board, %.1f mm in from outside' % reachA, ''),
         ('B, edge: C&K PCM12SMTR on the underside at the right waist edge, row z %.2f' % ZSW, ''),
         ('  why there: the waist is the one free stretch of edge (9.7 mm of air', ''), ('    to the shell wall), and the row lines it up with the PMIC and the sensor', ''),
         ('  board: no window (against A)', '%+.3f g' % win_g), ('  switch: 6.7 × 2.6 × 1.4 mm (RS), about (estimate)', '%.3f g' % mB),
         ('  reach: the actuator 1.5 mm past the edge (C&K), %.1f mm in from outside' % reachB, ''),
         ('  B against A, net (estimate)', '%+.3f g' % (win_g + mB - mA)),
         ('Both need a slot in the bottom plate under the actuator.', '')]
for i, (a, b) in enumerate(rowsS):
    yy = 0.93 - i * 0.08
    axS.text(0.0, yy, a, fontsize=9.0, color=INK, va='center', transform=axS.transAxes, fontweight='bold' if not a.startswith('  ') else 'normal')
    axS.text(1.0, yy, b, fontsize=9.2, color=GREEN, va='center', ha='right', fontweight='bold', transform=axS.transAxes)
# ================= the notes =================
axN = fig.add_axes([0.705, 0.02, 0.29, 0.95]); axN.axis('off')
T = [('BOARD PLACEMENT PLAN 5', 19, 'bold', INK),
     ('Step 1, fifth round, after Brock\'s notes on plan 4 and on symmetry. Nothing rebuilt yet. Layout mm (x = the user\'s right, z = toward the nose). Grey dashed: today\'s outline (close-ups: plan 4\'s). Red dashed: today\'s parts.', 10, 'normal', GREY), ('', 5, 'normal', INK),
     ('One depth, one angle', 13, 'bold', BLUE),
     ('Every notch is as deep as the waist\'s: D = %.2f mm (the side at %.2f, the waist at %.2f). The rear corners extend back to z %.2f so the rear notch is D deep; MH3 and MH4 stay. The front trapezoid stands D above the wings: its flat edge at z %.2f.' % (DEPTH, W, WX, ZB, ZT), 10, 'bold', INK),
     ('Every chamfer at %.1f°: the front\'s, both waist chamfers and the rear notch\'s. That is the front waist chamfer\'s angle, today\'s line. At 45° the waist chamfer would cut the GT01\'s back corner by 0.7 mm, so the waist\'s own angle is the one that fits everywhere. The rear notch\'s chamfer clears the battery\'s front corner by 0.53 mm.' % math.degrees(ANG), 10, 'normal', INK),
     ('Fillets as plan 4: every one starts %.1f mm from its corner, so the %.1f° corners take r %.2f and the right angles r %.1f.' % (T_FIL, math.degrees(ANG), T_FIL / math.tan(ANG / 2), T_FIL), 10, 'normal', INK), ('', 5, 'normal', INK),
     ('A symmetric footprint', 13, 'bold', BLUE),
     ('The outline is one half drawn and mirrored (notches, chamfers, fillets, lobes: mirror error %.4f mm). The wheel bay moves %.2f mm to the user\'s left: today it spans x %.2f to +%.2f (off the Sora V2 photo, centred %.2f right of x 0); now ±%.2f, centred on the wheel, width, depth and front edge as before. The bracket\'s inner tabs get %.2f mm from the cut (%.2f today); the encoder\'s pins keep %.2f (%.2f).' % (SYM_ERR, BAY['x0'] - BAY_TODAY['x0'] if False else BAY_TODAY['x0'] - BAY['x0'], BAY_TODAY['x0'], BAY_TODAY['x1'], (BAY_TODAY['x0'] + BAY_TODAY['x1']) / 2, BAY['x1'], BAY_GAPS['wb1'], BAY_GAPS['wb1_today'], BAY_GAPS['enc'], BAY_GAPS['enc_today']), 10, 'bold', INK),
     ('The four mounting holes, 0.10 to 0.20 mm off mirror in the photo, become mirror pairs: MH1/MH2 at ±10.10, z 29.50; MH3/MH4 at ±14.59, z -2.25 (each moves 0.10 mm or less; nothing in the shell or plate mates with them). Red dashed: today\'s bay and holes. Still one-sided, as the parts require: the encoder against the bracket, the PMIC against the power switch, the test pads, the GT01s\' key pegs, and switch A\'s window (B has none).', 10, 'normal', INK), ('', 5, 'normal', INK),
     ('The conflict: the receptacle', 13, 'bold', RED),
     ('With the front edge at z %.2f, the receptacle\'s front legs (slots to z %.2f) cross it by %.2f mm, so it can\'t stay where it is. Moving it %.2f mm back keeps the legs\' 0.44 mm of board and lets it hang %.2f mm out, as today; then its pads need the wheel bay\'s front edge back %.2f mm (to z %.2f), and its mouth is %.2f mm short of the shell\'s opening (3.0 today).' % (ZT, LEG_END, LEG_OVER, J1_BACK, J1_FIX + J1_LEN / 2 - ZT, 44.95 - BAY_FIX, BAY_FIX, USB_GAP_NEW), 10, 'bold', RED),
     ('Or the front keeps plan 4\'s height (4.66): the one place the depth rule would bend. A question for Brock.', 10, 'normal', RED), ('', 5, 'normal', INK),
     ('Wheel bay: gold trim', 13, 'bold', BLUE),
     ('A %.2f mm ENIG band round the bay, top and bottom, as wide as the board edge\'s trim, with the same %.1f mm fillets, so the USB-C pads in front of it keep their room.' % (TRIM, R), 10, 'normal', INK), ('', 5, 'normal', INK),
     ('Holes and cut-outs', 13, 'bold', BLUE),
     ('LH1 and LH2 dropped, as SH1 and SH2: nothing in the 3D shell or the bottom plate reaches them (within 2 mm of each hole there is only the top skin above and the plate below). MH1 to MH4 stay, now in mirror pairs.', 10, 'normal', INK),
     ('No cut-outs of my own: Brock dropped the rear pair. The receptacle aside, the thinnest web is %.2f mm (%s to %s).' % (web_min[0], web_min[1], web_min[2]), 10, 'normal', INK), ('', 5, 'normal', INK),
     ('Underside: today\'s art, adapted', 13, 'bold', BLUE),
     ('Today\'s dark triangle pattern on the same lattice, the gold clusters toward the rear corner on the user\'s right, the outlined triangles toward the front-left wing; every triangle filleted at one radius (r %.2f) and every partial triangle kept. THESEUS behind the lens, the fab mark (94V-0) under it, ON/OFF and POWER at the switch window, the four test pad labels, LT/RT, the QR with SCAN FOR THE WEB SOFTWARE on the left rear.' % TRI_R, 10, 'normal', INK), ('', 5, 'normal', INK),
     ('Power switch: A or B (bottom row)', 13, 'bold', BLUE),
     ('Both get built (Brock: "i want to see bout versions"): A, the window on the +10 axis, is the deck\'s board; B, a right-angle switch (C&K PCM12SMTR) on the underside at the right waist edge in the PMIC and sensor row, its actuator 1.5 mm past the edge, is a second build for renders. A saves %.3f g of board; B weighs about %.2f g more (estimate) and sits %.1f mm closer to the outside. Both need a slot in the bottom plate.' % (win_g, win_g + mB - mA, reachA - reachB), 10, 'normal', INK), ('', 5, 'normal', INK),
     ('Kept from plan 2', 13, 'bold', BLUE),
     ('Equal centre gaps %.2f mm (bay to sensor, sensor to MCU, MCU to notch): sensor z %.2f, MCU %.2f; PMIC and window in the sensor\'s row; balance at the mouse\'s centre, battery unmoved; lens 1.12 → %.2f in the mouse; sides 19.03. Area %.0f → %.0f mm².' % (G3, ZS, ZM, ZS + OFS, nums['area'][0], area(outline) - sum(rr_area(c['w'], c['h'], R) for c in CUTS)), 10, 'normal', INK)]
y = 1.0
for t, fs, fw, col in T:
    for L_ in (textwrap.wrap(t, 88 if fs < 12 else 48) or ['']):
        axN.text(0, y, L_, fontsize=fs, fontweight=fw, color=col, va='top', transform=axN.transAxes); y -= 0.0118 * fs / 10.5 * (1.5 if fs > 11 else 1.32)
print('notes end y %.3f' % y)
fig.savefig(OUT, dpi=100, facecolor=fig.get_facecolor())
print('saved', OUT)
