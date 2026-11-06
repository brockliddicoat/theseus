"""S2 for F51: the front of the trigger cutout and the rim's crease as one straight line; side view, true scale, over the scan."""
import sys, json
import numpy as np
from PIL import Image
sys.path.insert(0, '/home/claude/work/s1/scripts'); sys.path.insert(0, '/home/claude/work/s2/scripts')
from sheetlib import *
import sidegeo as SG
from common import SCAN_PX, SCAN_S
import front as FR
S = lambda P: np.c_[-np.asarray(P)[:, 0], -np.asarray(P)[:, 1]]
img = np.asarray(Image.open(SCAN_PX).convert('L')).astype(float) / 255; img = 0.52 + 0.48 * img
ext = [-650 / SCAN_S, (1300 - 650) / SCAN_S, -(19 - (520 - 260) / SCAN_S), -(19 + 260 / SCAN_S)]
CR = json.load(open('/home/claude/work/s1/crease_side.json')); crease = np.c_[CR['z'], CR['y']]
Z_T, Y_T, Z_N, Y_N = -59.58, 8.56, 55.4, 3.0
line_crease = np.c_[[Z_T, Z_N], [Y_T, Y_N]]
sil = SG.silhouette('shell')
v4 = np.array(json.load(open('/home/claude/work/s2/seam_path_v4.json'))['path'])
v5 = np.array(json.load(open('/home/claude/work/s2/seam_path_v5.json'))['path']); zJ = FR.V5['J'][1]
rear = v5[v5[:, 2] <= zJ + 1e-6]
fB, _ = FR.design_B(); fA, IA = FR.design_S(-0.15); fF, IF = FR.design_C(); IF['kmax'] = 1 / IF['rmin']
zz = np.linspace(zJ, FR.Z_TIP, 900)
def side_seam(f): return np.vstack([np.c_[zz[::-1], f(zz[::-1])], rear[:, [2, 1]]])
SEAMS = {'before': np.vstack([np.c_[[59.65, 55.5], [10.0, 10.0]], v4[:, [2, 1]]]), 'B': side_seam(fB), 'A': side_seam(fA), 'F': side_seam(fF)}
xf_ = np.linspace(-21, 21, 300); zf_ = FR.Z_TIP - FR.B_NOSE * xf_ ** 2
DIP_B = float(fB(zf_).max() - fB(zf_).min()); DIP_A = float(fA(zf_).max() - fA(zf_).min()); RISE_F = float(fF(zf_).max() - 10.0)

def scan(ax): ax.imshow(img, cmap='gray', vmin=0, vmax=1, extent=ext, zorder=1, interpolation='lanczos')
def comb_side(ax, Q, color, scale=40.0):
    Q = Q[np.argsort(Q[:, 0])]; Q = Q[(Q[:, 0] > zJ + 0.3)]
    z, y = Q[:, 0], Q[:, 1]; zu = np.linspace(z.min(), z.max(), 600); yu = np.interp(zu, z, y)
    d1 = np.gradient(yu, zu); d2 = np.gradient(d1, zu); k = d2 / (1 + d1 ** 2) ** 1.5
    n = np.c_[-d1, np.ones_like(d1)] / np.sqrt(1 + d1 ** 2)[:, None]
    tip = np.c_[zu + n[:, 0] * k * scale, yu + n[:, 1] * k * scale]
    for i in range(0, len(zu), 5): line(ax, S([[zu[i], yu[i]], tip[i]]), 0.8, color, 0.35, z=9, cap='butt')
    line(ax, S(tip), 1.0, color, 0.5, z=9)
def draw(ax, key, col, crease_line=None, comb=False):
    line(ax, S(sil), 2.0, INK, 0.85, z=8, closed=True)
    line(ax, S(SEAMS[key]), 2.6, col, 1.0, z=10)
    if comb: comb_side(ax, SEAMS[key], col)
    if crease_line is not None: line(ax, S(crease_line), 2.6, col, 1.0, z=10)

W_, H_ = 2600, 2440
sh = Sheet(W_, H_)
sh.title(60, 92, 'The cutout’s front and the rim’s crease, side view (F51)', size=44)
sh.text(60, 138, 'True scale, nose left, your scan underneath. Red: what you saw at 11:50. Blue: the fix. Faint blue hairs: the curvature comb (length = how sharply the line bends; one smooth envelope = no kinks).', size=22, weight=500, color=MUTE)
# row 1: the cutout's front, 20 px/mm
s1 = 20.0
heads = [('Before (11:50): a hook into the flat lip', 'before', RED), ('After (C): one smooth run-out into the flat lip', 'F', HERO), ('Not buildable: the arch to the nose tip', 'B', RED)]
for k, (ttl, key, col) in enumerate(heads):
    x0 = 60 + k * 845
    sh.label(x0, 200, ttl, size=18, color=RED if col == RED else HERO_T)
    ax = sh.panel(x0, 215, 815, 470, -46.5, -15.0, s1, frame=True)
    scan(ax); draw(ax, key, col, comb=(key == 'F'))
    # the front view of the lip across the nose, under it: x across, true scale
    axf = sh.panel(x0, 700, 815, 150, 0.0, -10.8, 17.0, frame=True)
    xf = np.linspace(-21, 21, 300); zf = FR.Z_TIP - FR.B_NOSE * xf ** 2
    if key == 'before': yf = np.full(len(xf), 10.0)
    elif key == 'B': yf = fB(zf)
    elif key == 'F': yf = fF(zf)
    else: yf = fA(zf)
    line(axf, np.c_[xf, -yf], 2.6, col, 1.0, z=10)
    line(axf, np.c_[[-23, 23], [-10.0, -10.0]], 1.0, INK, 0.25, dash=(5, 4), z=5)
    dip = float(yf.max() - yf.min())
    msg = {'before': 'flat (#46)', 'F': 'flat across the middle, its outer corners %.2f mm up' % (yf.max() - 10.0), 'B': '%.1f mm lower at the centre; its corners 0 to 0.7 mm thin' % dip}[key]
    sh.text(x0 + 12, 840, 'The lip from the front, 17 px/mm: ' + msg, size=16, weight=600, color=MUTE)
sh.text(60, 900, 'Before: the arch bent into the flat lip on a short hook (r about 7 mm). After (C): the same arch (6.9 mm under the top at the back) runs out into the lip on one smooth curve: its curvature', size=19, weight=500, color=MUTE)
sh.text(60, 928, '(the hairs) rises once and falls once, smallest radius %.1f mm (the Sora V2\u2019s own lip is about 15), landing level on the lip with no kink. Before it, the seam sits at most %.1f mm under the pure offset.' % (IF['rmin'], -IF['dip']), size=19, weight=500, color=MUTE)
sh.text(60, 956, 'The lip stays flat (#46) across the middle; its outer corners rise %.1f mm. Why not one arch right to the tip (right, not buildable): the lip is a 2.25 mm plate and at its corners the arch would leave' % IF['rise'], size=19, weight=500, color=MUTE)
sh.text(60, 984, '0 to 0.7 mm of trigger, too thin to mould (or the lip would have to hang 2 mm lower at the centre and the chin be cut back to 0.8 mm over the USB-C). From the back to 34 mm ahead of the cutout nothing changes; K3 too.', size=19, weight=500, color=MUTE)
# row 2: whole mouse, before | after
s2 = 9.5
for k, (ttl, key, col, cl) in enumerate([('Before (11:50)', 'before', RED, crease), ('After: the swoop into the lip, the crease one straight line', 'F', HERO, line_crease)]):
    x0 = 60 + k * 1270
    sh.label(x0, 1060, ttl, size=18, color=RED if col == RED else HERO_T)
    ax = sh.panel(x0, 1075, 1230, 430, 0, -19.5, s2, frame=True)
    scan(ax); draw(ax, key, col, crease_line=cl)
    if key == 'F': line(ax, S(crease), 1.6, INK, 0.5, dash=(6, 5), z=9)
# row 3: the rim, 22 px/mm, rear half
s3 = 22.0
sh.label(60, 1560, 'The rim at the back, 22 px/mm: before (the crease where the scan has it, curving) | after (one straight line; the scan’s crease dashed)', size=18, color=INK)
for k, (cl, col) in enumerate([(crease, RED), (line_crease, HERO)]):
    x0 = 60 + k * 1270
    ax = sh.panel(x0, 1580, 1230, 400, 37.0, -6.6, s3, frame=True)
    scan(ax); line(ax, S(sil), 2.0, INK, 0.85, z=8, closed=True); line(ax, S(cl), 2.6, col, 1.0, z=10)
    if k == 1:
        line(ax, S(crease), 1.6, INK, 0.5, dash=(6, 5), z=9)
        for z in (-50.0, -40.0, -30.0, -20.0):
            yl = Y_T + (Y_N - Y_T) * (z - Z_T) / (Z_N - Z_T); yc = np.interp(z, crease[:, 0], crease[:, 1])
            px, py = sh.to_px(ax, -z, -yl); sh.text(px, py - 12, '+%.1f' % (yl - yc), size=15, weight=650, color=HERO_T, ha='center')
sh.text(60, 2022, 'After: from the tail tip (8.6 mm, the corner of the outline at the back) one straight line to the nose’s lower corner (3.0 mm at 4.4 mm from the front): it meets the outline at both', size=19, weight=500, color=MUTE)
sh.text(60, 2050, 'ends, so the outline seen from the side does not change. It sits above the scan’s crease by up to 2.3 mm at 30 mm from the tail and within 0.9 mm over the front half (the scan’s', size=19, weight=500, color=MUTE)
sh.text(60, 2078, 'crease is a curve, so no straight line can hug it: this one is the chord through the outline’s two corners). In 3D the rim’s chamfer is carried up to the line: the band', size=19, weight=500, color=MUTE)
sh.text(60, 2106, 'under it grows (more plain wall, less lattice) and the side wall above it is untouched. Forward of 35 mm from the tail the top view does not change; behind it the crease is the', size=19, weight=500, color=MUTE)
sh.text(60, 2134, 'widest point of each section, so lifting it trims the outline seen from above by up to 0.6 mm round the tail (z −55 to −35).', size=19, weight=500, color=MUTE)
sh.save('/home/claude/work/s2/s2_f51_front_rim_C_1221.png')
print('ok')
