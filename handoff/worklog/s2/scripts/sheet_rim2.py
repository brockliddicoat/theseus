"""S2, F51 12:34: the rim's crease as one 2 deg line, matched to the scan over the front and middle; side, the tail, the nose
corner and the top view at the tail; true scale over the scan. Saved under a new dated name."""
import sys, json, time
import numpy as np
from PIL import Image
sys.path.insert(0, '/home/claude/work/s1/scripts'); sys.path.insert(0, '/home/claude/work/s2/scripts')
from sheetlib import *
import sidegeo as SG
from common import SCAN_PX, SCAN_S
import rim_line as RL
S = lambda P: np.c_[-np.asarray(P)[:, 0], -np.asarray(P)[:, 1]]
img = np.asarray(Image.open(SCAN_PX).convert('L')).astype(float) / 255; img = 0.52 + 0.48 * img
ext = [-650 / SCAN_S, (1300 - 650) / SCAN_S, -(19 - (520 - 260) / SCAN_S), -(19 + 260 / SCAN_S)]
sil = SG.silhouette('shell')
CR = json.load(open('/home/claude/work/s1/crease_side.json')); crease = np.c_[CR['z'], CR['y']]
(zt, yt), (zn, yn) = RL.meets_outline()
chord = np.c_[[-59.58, 55.4], [8.56, 3.0]]
new = np.c_[[zt, zn], [yt, yn]]
def scan(ax): ax.imshow(img, cmap='gray', vmin=0, vmax=1, extent=ext, zorder=1, interpolation='lanczos')
def body(ax): line(ax, S(sil), 2.0, INK, 0.85, z=8, closed=True)
def worst(lo, hi):
    zz = np.arange(lo, hi + 1e-9, 0.1); r = RL.line(zz) - np.interp(zz, crease[:, 0], crease[:, 1]); i = np.argmax(np.abs(r)); return r[i], zz[i]
wf, wfz = worst(20, zn); wm, wmz = worst(-20, 20); wb, wbz = worst(zt, -20)
stamp = time.strftime('%H%M')
W_, H_ = 2600, 2380
sh = Sheet(W_, H_)
sh.title(60, 92, 'The rim’s crease at 2°, matched over the front and middle (F51, 12:34)', size=44)
sh.text(60, 138, 'True scale, nose left, your scan underneath; the scan’s own crease dashed. Red: the chord you saw at 12:16 (through the tail tip). Blue: one straight line at 2.0°.', size=22, weight=500, color=MUTE)
s = 9.5
for k, (ttl, L, col) in enumerate([('Before (12:16): the chord through the tail tip, 2.8°', chord, RED), ('After: one line at 2.0°, fitted to the front two-thirds', new, HERO)]):
    x0 = 60 + k * 1270
    sh.label(x0, 200, ttl, size=18, color=RED if col == RED else HERO_T)
    ax = sh.panel(x0, 215, 1230, 430, 0, -19.5, s, frame=True)
    scan(ax); body(ax); line(ax, S(crease), 1.6, INK, 0.5, dash=(6, 5), z=9); line(ax, S(L), 2.6, col, 1.0, z=10)
# row 2: the tail and the nose corner, 30 px/mm
s2 = 30.0
sh.label(60, 700, 'At the tail, 30 px/mm: before | after', size=18, color=INK)
for k, (L, col) in enumerate([(chord, RED), (new, HERO)]):
    x0 = 60 + k * 640
    ax = sh.panel(x0, 720, 610, 460, 54.0, -6.0, s2, frame=True)
    scan(ax); body(ax); line(ax, S(crease), 1.6, INK, 0.5, dash=(6, 5), z=9); line(ax, S(L), 2.6, col, 1.0, z=10)
    if k == 1:
        px, py = sh.to_px(ax, -zt, -yt); sh.bg.plot([px], [py], 'o', ms=9, mfc='none', mec=HERO, mew=2, zorder=30)
        sh.text(px - 14, py + 70, 'meets the outline at %.1f mm,' % yt, size=16, weight=650, color=HERO_T, ha='right'); sh.text(px - 14, py + 92, '%.1f mm under the tail tip' % (8.56 - yt), size=16, weight=650, color=HERO_T, ha='right')
sh.label(1340, 700, 'At the nose’s lower corner, 30 px/mm: before | after', size=18, color=INK)
for k, (L, col) in enumerate([(chord, RED), (new, HERO)]):
    x0 = 1340 + k * 625
    ax = sh.panel(x0, 720, 595, 460, -52.0, -5.0, s2, frame=True)
    scan(ax); body(ax); line(ax, S(crease), 1.6, INK, 0.5, dash=(6, 5), z=9); line(ax, S(L), 2.6, col, 1.0, z=10)
    if k == 1:
        px, py = sh.to_px(ax, -zn, -yn); sh.bg.plot([px], [py], 'o', ms=9, mfc='none', mec=HERO, mew=2, zorder=30)
        sh.text(px + 14, py + 34, 'meets the outline at %.2f mm' % yn, size=16, weight=650, color=HERO_T)
# row 3: the top view at the tail (the widest X of each section, both walls), and four sections
sh.label(60, 1240, 'From above, the back half, 7.6 px/mm: the outline before (grey) and after (blue); the difference ×20 in the strip under it', size=18, color=INK)
zs = np.arange(-59.4, -14.9, 0.5); x0s, x1s = [], []
for z in zs:
    r = RL.section_change(z, 'hold'); x0s.append(r['xmax0']); x1s.append(r['xmax1'])
x0s, x1s = np.array(x0s), np.array(x1s)
ax = sh.panel(60, 1260, 1230, 520, 37.0, 0.0, 7.6, frame=True)
for sgn in (1, -1):
    line(ax, np.c_[-zs, sgn * x0s], 4.0, COMP, 1.0, z=5); line(ax, np.c_[-zs, sgn * x1s], 1.8, HERO, 1.0, z=8)
axd = sh.panel(60, 1790, 1230, 120, 37.0, 0.0, 7.6, frame=True)
line(axd, np.c_[-zs, -(x1s - x0s) * 20], 2.0, HERO, 1.0, z=8); line(axd, np.c_[[-zs.min(), -zs.max()], [0, 0]], 1.0, INK, 0.3, z=5)
sh.text(72, 1902, 'Largest change %.2f mm (a trim at z %.0f, where the crease is the widest point and the line is above it)' % (np.abs(x1s - x0s).max(), zs[np.argmax(np.abs(x1s - x0s))]), size=15, weight=600, color=MUTE)
sh.label(1340, 1240, 'Sections (the +X wall, 24 px/mm): grey before, blue after; dashed: the crease before and after', size=18, color=INK)
for k, z in enumerate([-55.0, -40.0, -25.0, 40.0]):
    r = RL.section_change(z, 'hold')
    ax = sh.panel(1340 + (k % 2) * 625, 1260 + (k // 2) * 330, 595, 310, -(r['xs'].max() - 3.0), -6.5, 12.0 * 2.0, frame=True)
    line(ax, np.c_[-r['xs'], -r['ys']], 4.0, COMP, 1.0, z=5); line(ax, np.c_[-r['new'], -r['ys']], 1.8, HERO, 1.0, z=8)
    for yy, cc in ((r['yc'], INK), (r['yn'], HERO)): line(ax, np.c_[[-r['xs'].max() - 1.5, -r['xs'].max() + 6], [-yy, -yy]], 1.0, cc, 0.4, dash=(4, 4), z=6)
    px, py = sh.to_px(ax, -(r['xs'].max() - 3.0), -12.0)
    sh.text(1352 + (k % 2) * 625, 1290 + (k // 2) * 330, 'z %+.0f: crease %.2f → %.2f mm' % (z, r['yc'], r['yn']), size=16, weight=650, color=HERO_T)
rows = ['The line: y = %.2f − %.4f z (z from the middle of the mouse, mm), 2.0° to the base. At the nose’s lower corner %.2f mm (your scan 3.0), at the middle %.2f, at the tail %.2f where it' % (RL.C0, RL.TANA, yn, RL.C0, yt),
        'meets the outline, %.1f mm under the tail tip (8.56) and %.1f mm ahead of it. Worst miss against your scan’s crease: front %+.2f mm (z %+.0f), middle %+.2f mm (z %+.0f), back %+.2f mm (z %+.0f).' % (8.56 - yt, zt + 59.58, wf, wfz, wm, wmz, wb, wbz),
        'The side view does not change (F47.1): the line meets the outline at both ends, and behind the tail point and ahead of the nose point the crease runs on the outline itself. On the walls the crease',
        'moves up to %.2f mm (middle) and down up to %.2f mm (just ahead of the tail). Where it moves down, the wall above is carried straight down rather than leaning further out, so the top view does' % (max(RL.line(np.arange(-40, 0, 0.5)) - np.interp(np.arange(-40, 0, 0.5), crease[:, 0], crease[:, 1])), -min(RL.line(np.arange(zt, -45, 0.5)) - np.interp(np.arange(zt, -45, 0.5), crease[:, 0], crease[:, 1]))),
        'not widen: it changes by at most %.2f mm. The rim (the plain band) is taller in the middle and shorter at the back; the lattice stops on the line.' % np.abs(x1s - x0s).max()]
for j, r in enumerate(rows): sh.text(60, 1990 + j * 30, r, size=19, weight=500, color=MUTE)
fn = '/home/claude/work/s2/s2_rim_2deg_%s.png' % stamp
sh.save(fn); print(fn, 'worst', (wf, wfz), (wm, wmz), (wb, wbz), 'meets', (zt, yt), (zn, yn))
