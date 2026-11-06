"""S2's before/after (F47.2 the rim, F49.2 the trigger cutout from the side): side view, true scale, the raw scan underneath."""
import sys, json
import numpy as np
from PIL import Image
sys.path.insert(0, '/home/claude/work/s1/scripts'); sys.path.insert(0, '/home/claude/work/s2/scripts')
from sheetlib import *
import sidegeo as SG
from common import ms, SCAN_PX, SCAN_S
KZ, KY = 119.3 / 119.41, 39.9 / 38.12            # F0a: the kit's outlines = the 3D twin x (KZ, KY)
M = ms()
S = lambda P: np.c_[-np.asarray(P)[:, 0], -np.asarray(P)[:, 1]]          # scene (Z, Y) -> page (u, v)
kit = lambda P: np.c_[np.asarray(P)[:, 0] / KZ, np.asarray(P)[:, 1] / KY]    # the kit's (39.9) lines back onto the scan
img = np.asarray(Image.open(SCAN_PX).convert('L')).astype(float) / 255
img = 0.52 + 0.48 * img                                                   # lightened, grey: the scan under the lines
ext = [-650 / SCAN_S, (1300 - 650) / SCAN_S, -(19 - (520 - 260) / SCAN_S), -(19 + 260 / SCAN_S)]   # page u, v
CR = json.load(open('/home/claude/work/s1/crease_side.json')); crease = np.c_[CR['z'], CR['y']]
PH = np.array(json.load(open('/home/claude/work/s2/crease_photo.json'))); PH = PH[(PH[:, 2] > 0.15) & (PH[:, 0] > -56)]
seam_new = np.array(json.load(open('/home/claude/work/s2/seam_path_v4.json'))['path'])
seam_now = np.load('/home/claude/work/s2/seam_ths_cloud.npy')
sil = SG.silhouette('shell')

def scan(ax):
    im = ax.imshow(img, cmap='gray', vmin=0, vmax=1, extent=ext, zorder=1, interpolation='lanczos')
def before(ax, s):
    line(ax, S(kit(M['SIDE'])), 2.0, INK, 0.85, z=8, closed=True)
    # the kit's skirt: the level line at MS_SKIRT across the outline
    xa = M['SIDE'][np.abs(M['SIDE'][:, 1] - 9.3) < 1.2][:, 0]
    line(ax, S(kit(np.array([[xa.min() + 0.4, 9.3], [xa.max() - 0.4, 9.3]]))), 2.6, RED, 0.95, z=10)
    for sm in M['SEAM']: line(ax, S(kit(sm)), 2.6, RED, 0.95, z=10)
def after(ax, s):
    line(ax, S(sil), 2.0, INK, 0.85, z=8, closed=True)
    line(ax, S(crease), 2.6, HERO, 1.0, z=10)
    line(ax, S(seam_new[:, [2, 1]]), 2.6, HERO, 1.0, z=10)
    line(ax, S(np.c_[seam_new[seam_new[:, 2] > 55.4][:, 2], seam_new[seam_new[:, 2] > 55.4][:, 1]]), 2.6, HERO, 1.0, z=10)
    # the flat lip across the nose, unchanged
    line(ax, S(np.array([[55.5, 10.0], [59.6, 10.0]])), 2.6, HERO, 1.0, z=10)
def photo_dots(ax):
    ax.plot(-PH[:, 0], -PH[:, 1], 'o', ms=3.2, color=SECOND, mec='none', zorder=12)

W_, H_ = 2600, 2330
sh = Sheet(W_, H_)
sh.title(60, 92, 'The bottom rim and the trigger cutout, seen from the side', size=44)
sh.text(60, 138, 'True scale, nose left. Underneath: your scan itself (its own side render, 6.5 px/mm, greyed). Red: what the slides draw today. Blue: the fix (the 3D first, the 2D from it).', size=22, weight=500, color=MUTE)
s = 9.5
for k, (ttl, fn, col) in enumerate([('Before: the slides today (the kit’s side view)', before, RED), ('After', after, HERO)]):
    x0 = 60 + k * 1270
    sh.label(x0, 200, ttl, size=19, color=RED if col == RED else HERO_T)
    ax = sh.panel(x0, 215, 1230, 430, 0, -19.5, s, frame=True)
    scan(ax); fn(ax, s)
sh.text(60, 690, 'Before: the rim (the plain band under the hard crease, no lattice, F43.6) drawn under a level line at 9.3 mm, and the cutout traced from the trigger part’s outline: it steps, then climbs straight up at the back.', size=19, weight=500, color=MUTE)
sh.text(60, 718, 'After: the crease where your scan has it, sloping down from the tail; the cutout one smooth arch 6.9 mm under the top (5.5 at the nose, along the profile’s normal), turning up into the straight rear cutout through K3.', size=19, weight=500, color=MUTE)

# row 2: the rim at the back, 22 px/mm
s2 = 22.0
sh.label(60, 790, 'The rim at the back, 22 px/mm (before | after). Yellow dots: the crease read off the Sora V2 side photo, registered on the scan (IoU 0.97): a second, independent check', size=18, color=INK)
for k, fn in enumerate([before, after]):
    x0 = 60 + k * 1270
    ax = sh.panel(x0, 810, 1230, 400, 37.0, -6.6, s2, frame=True)
    scan(ax); fn(ax, s2); photo_dots(ax)
    if k == 1:
        for z, lab in ((-59.3, '8.6 mm at the tail tip'), (-50.0, '6.8'), (-40.0, '5.5'), (-30.0, '4.8'), (-22, '4.6')):
            y = np.interp(z, crease[:, 0], crease[:, 1]); px, py = sh.to_px(ax, -z, -y)
            sh.text(px + (8 if z > -59 else -14), py - (14 if z > -59 else 30), lab, size=16, weight=650, color=HERO_T, ha='left' if z > -59 else 'right')
    else:
        px, py = sh.to_px(ax, 30, -9.3); sh.text(px, py - 12, '9.3 mm, level: about 5 mm too high in the middle', size=16, weight=650, color=RED)
sh.text(60, 1252, 'The outline at the tail is the scan’s in both (the 3D shell matches the raw scan to 0.4 mm here; the slides’ outline is the same shape drawn 39.9 mm tall, F47.1). What changes is the crease:', size=19, weight=500, color=MUTE)
sh.text(60, 1280, 'from the tail tip it runs down in one long line (8.6 mm, then 6.8, 5.5, 4.8 at 30 mm in) and stays about 4 mm to the nose. The lattice stops on it, so the side wall gets its lattice back down to 4 mm.', size=19, weight=500, color=MUTE)

# row 3: the cutout, the back and the nose, 22 px/mm
sh.label(60, 1350, 'The trigger cutout from the side, 22 px/mm: the back (before | after), the nose (before | after)', size=18, color=INK)
boxes = [((8.5, -27.5), before), ((8.5, -27.5), after), ((50.5, -13.0), before), ((50.5, -13.0), after)]
for k, ((cz, cy), fn) in enumerate(boxes):
    x0 = 60 + k * 635
    ax = sh.panel(x0, 1370, 600, 520, -cz, cy, s2, frame=True)
    scan(ax); fn(ax, s2)
    if fn is before:
        q = seam_now[(seam_now[:, 0] > 0)]
        ax.plot(-q[:, 2], -q[:, 1], '.', ms=1.6, color=RED, alpha=0.35, zorder=9)
sh.text(60, 1930, 'Before: the slides’ line (red) is the trigger part’s outline, with its steps; the 3D seam itself (red dots) runs ~7 mm under the top, kinks up 12 mm from the cutout and climbs straight up at it.', size=19, weight=500, color=MUTE)
sh.text(60, 1958, 'After: one curve 6.9 mm under the top along its normal (5.5 at the nose: the band reads parallel), within 1.0 mm of today’s seam along the side; from 11.7 mm ahead of the cutout it turns up through K3', size=19, weight=500, color=MUTE)
sh.text(60, 1986, '(your corner, built on the arch: smallest radius 1.8 mm, 4.1 × 6.9 mm from above) into the straight cutout, which from the side is the short vertical line to the top. At the nose it runs out into the flat lip (10 mm, unchanged).', size=19, weight=500, color=MUTE)
# the top view of the corner, small: today's, S1's K3 and the new one
ax = sh.panel(60, 2030, 760, 280, -24.5, -8.6, 26.0, frame=True)
c = seam_now[seam_now[:, 0] > 0]; ax.plot(-c[:, 0], -c[:, 2], '.', ms=1.5, color=RED, alpha=0.5, zorder=5)
line(ax, np.c_[-seam_new[:, 0], -seam_new[:, 2]], 2.4, HERO, 1.0, z=8)
from geo_options import option_rear
k3, _ = option_rear('K3'); line(ax, np.c_[-k3[:, 0], -k3[:, 1]], 1.6, INK, 0.45, dash=(6, 5), z=7)
sh.text(850, 2070, 'From above, the left rear corner (26 px/mm): blue the new seam, dashed S1’s K3 as you picked it, red dots today’s.', size=18, weight=500, color=MUTE)
sh.text(850, 2098, 'K3’s construction (quintic: curvature from zero up to one peak, 1.8 mm, and back to zero), now on the arch’s own tangent.', size=18, weight=500, color=MUTE)
sh.text(850, 2126, 'The arch rises as it comes back, so it arrives 0.5 mm further in and slightly angled, and the turn is 4.1 mm across, not 3.3.', size=18, weight=500, color=MUTE)
sh.text(850, 2154, 'Elsewhere from above nothing moves: the side seam stays 0.3 to 1 mm inside the outline, as today.', size=18, weight=500, color=MUTE)
sh.save('/home/claude/work/s2/s2_rim_cutout_before_after.png')
print('ok')
