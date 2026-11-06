"""S1 options sheet B: the side profile (the centre hump, and the height pair) and the richer simplified mouse."""
import json, sys
import numpy as np
sys.path.insert(0, '/home/claude/work/s1/scripts')
from sheetlib import *
from hump import Hump, Y_C
from topgeo import outline_top, to_top
from shellio import poly, mesh_rings
from geo_options import option_rear, rrect, Z_CUT
import sidegeo as SG
import lattice_asset as LA

OUT = '/home/claude/work/s1/s1_options_B.png'
W, H = 3200, 3260
sh = Sheet(W, H)
prof = json.load(open('/home/claude/work/s1/profile_centre.json'))
NOSE, TAIL = 59.78, -59.61; L = NOSE - TAIL
HUMPS = {'today': None, 'H50': Hump(prof, NOSE - 0.50 * L), 'H54': Hump(prof, NOSE - 0.54 * L)}
def warp_fn(hk, H39=False):
    Hm = HUMPS[hk]
    if Hm is None:
        sH = (39.9 - Y_C) / (38.10 - Y_C) if H39 else 1.0
        return lambda P: np.c_[P[:, 0], np.where(P[:, 1] > Y_C, Y_C + (P[:, 1] - Y_C) * sH, P[:, 1])]
    sH = (39.9 - Y_C) / (Hm.H - Y_C) if H39 else 1.0
    return lambda P: np.c_[P[:, 0], np.where(P[:, 1] > Y_C, Y_C + (P[:, 1] - Y_C) * Hm.k(P[:, 0]) * sH, P[:, 1])]

# the side view's parts (scene Z, Y), densified so the warp follows the curve
def dens(P, step=0.3, closed=True):
    P = np.asarray(P, float)
    if closed: P = np.vstack([P, P[:1]])
    out = [P[0]]
    for a, b in zip(P[:-1], P[1:]):
        n = max(1, int(np.ceil(np.linalg.norm(b - a) / step)))
        for t in np.linspace(0, 1, n + 1)[1:]: out.append(a + (b - a) * t)
    return np.array(out)
SIL = dens(SG.silhouette()); SEAM = SG.seam_lower(); SBS = [dens(b) for b in SG.side_buttons()]
TS = SG.trigger_side(); YTOP_CUT = TS[np.abs(TS[:, 0] - 5.0) < 0.4][:, 1].max()
WHL = dict(z=34.87, y=17.03, r=11.37)

def side_drawing(ax, hk, H39=False, col=HERO, main=True, lw=2.6, alpha=1.0, dash=None, wheel=True, details=True):
    f = warp_fn(hk, H39)
    S_ = f(SIL)
    if main:
        fill(ax, SG.S(S_), PANEL, z=2)
    line(ax, SG.S(S_), lw, col, alpha, z=8, closed=False, dash=dash)
    if details:
        line(ax, SG.S(f(SEAM)), 1.3, INK, 0.5, z=6)
        line(ax, SG.S(f(np.array([[SEAM[0, 0], SEAM[0, 1]], [SEAM[0, 0], YTOP_CUT]]))), 1.3, INK, 0.5, z=6)
        for b in SBS: fill(ax, SG.S(f(b)), TRACK, z=3); line(ax, SG.S(f(b)), 1.2, INK, 0.5, z=7, closed=True)
        line(ax, SG.S([[TAIL + 2.5, Y_C], [NOSE - 2.5, Y_C]]), 1.0, INK, 0.3, z=4)
        if wheel:
            # the wheel keeps its height above the crown (2.9 mm proud): it rises with the skin over it
            Hm = HUMPS[hk]; y0 = (Hm.h_old(WHL['z']) if Hm else np.interp(WHL['z'], prof['z'], prof['sil']))
            dy = f(np.array([[WHL['z'], y0]]))[0, 1] - y0
            t = np.linspace(0, 2 * np.pi, 200); C = np.c_[WHL['z'] + WHL['r'] * np.cos(t), WHL['y'] + dy + WHL['r'] * np.sin(t)]
            from shapely.geometry import Polygon
            vis = Polygon(C).difference(Polygon(S_).buffer(0))
            for g in (vis.geoms if hasattr(vis, 'geoms') else [vis]):
                if g.area > 0.2: P = np.array(g.exterior.coords); fill(ax, SG.S(P), TRACK, z=3); line(ax, SG.S(P), 1.2, INK, 0.5, z=7, closed=True)
    return f

def apex(hk, H39=False):
    """the top of the centre line (the designed apex), and its height after the warp"""
    Hm = HUMPS[hk]; zz = np.linspace(TAIL, NOSE, 4000)
    h = Hm.h_new(zz) if Hm else np.interp(zz, prof['z'], prof['sil'])
    i = np.argmax(h); z = zz[i]
    f = warp_fn(hk, H39); P = f(SIL); j = np.argmin(np.abs(P[:, 0] - z) + 100 * (P[:, 1] < 30))
    return np.array([z, f(np.array([[z, (Hm.h_old(z) if Hm else h[i])]]))[0, 1]])

# ------------------------------------------------------------------ header
sh.title(80, 120, 'S1 · Theseus’s shape · options 2 of 2', size=56)
sh.text(80, 172, 'The side profile (a centre hump like the Starlight X) and the richer simplified mouse, at true scale, from the 3D shell. '
        'Blue: the proposals. Red: today, which you rejected.', size=26, weight=500, color=MUTE)

# ================================================================== 3. the side profile
Y3 = 240
sh.label(80, Y3 + 30, '3 · The side profile: the hump to the centre', size=26, color=INK)
sh.text(80, Y3 + 70, 'Only the height above the hard crease (9.3 mm) changes; the length, the width and the top view stay, and so does everything '
        'under the crease (the base, the rim, the skates, the board). The nose and the tail keep their shape; the hump’s top stays 38.1 mm.',
        size=22, weight=500, color=MUTE)
s3 = 12.0
x0, y0, pw, ph = 80, Y3 + 110, 1960, 640
sh.card(x0, y0, pw, ph + 300, PANEL)
ax = sh.panel(x0, y0 + 10, pw, ph, -2.0, -22.5, s3)
side_drawing(ax, 'H50', col=HERO, lw=3.0)
side_drawing(ax, 'H54', col=HERO, main=False, lw=2.2, dash=[9, 6], details=False)
side_drawing(ax, 'today', col=RED, main=False, lw=2.2, alpha=0.9, details=False)
for k_, (hk, col, lab) in enumerate([('H50', HERO, '50 %'), ('H54', HERO, '54 %'), ('today', RED, 'today')]):
    a = apex(hk); pa = SG.S([a])[0]
    ax.plot([pa[0]], [pa[1]], 'o', ms=11 * PX, mfc=col, mec=PANEL, mew=1.6 * PX, zorder=12)
    up = 4.0 + 3.2 * k_
    line(ax, [[pa[0], pa[1]], [pa[0], pa[1] - up]], 1.2, col, 0.8, z=11)
    px_, py_ = sh.to_px(ax, pa[0] + 0.4, pa[1] - up)
    sh.text(px_, py_, '%s · the top %.1f mm from the front' % (lab, NOSE - a[0]), size=19, weight=700, color=col if col != HERO else HERO_T, ha='left', va='center')
# the length and the front marker
dim(sh, ax, SG.S([[NOSE, 2.0]])[0], SG.S([[TAIL, 2.0]])[0], '119.4 mm (the scan, with the triggers’ lip)', off=0, size=17)
# the change in height along the length, under it
axc = sh.panel(x0, y0 + ph + 30, pw, 220, -2.0, 0.0, s3)
zz = np.linspace(TAIL, NOSE, 1200)
for hk, ls in (('H50', None), ('H54', [9, 6])):
    Hm = HUMPS[hk]; d = Hm.h_new(zz) - Hm.h_old(zz)
    line(axc, np.c_[-zz, -d * 3.0], 2.2, HERO, 1, z=8, dash=ls)
line(axc, [[-NOSE, 0], [-TAIL, 0]], 1.0, INK, 0.4, z=5)
for v in (-3, -2, -1, 1, 2, 3):
    line(axc, [[-NOSE, -v * 3], [-NOSE + 1.5, -v * 3]], 1.0, INK, 0.4, z=5)
    sh.text(*sh.to_px(axc, -NOSE - 1.0, -v * 3), '%+d' % v, size=15, weight=600, color=FAINT, ha='right', va='center')
sh.text(x0 + 260, y0 + ph + 40, 'Height change at the top (mm, ×3 vertically): the front rises over the triggers, the rear eases', size=17, weight=650, color=FAINT)
# notes column
nx = x0 + pw + 50; ny = y0
sh.card(nx, ny, 3200 - 80 - nx, ph + 300, PANEL)
lines_ = [
    ('TODAY (REJECTED)', RED, 'The Sora’s rear hump: the top at %.1f mm from the front, %d %% back.' % (NOSE - apex('today')[0], round(100 * (NOSE - apex('today')[0]) / L))),
    ('50 % · CENTRE', HERO_T, 'The top at %.1f mm from the front. The triggers rise up to 3.0 mm (9 mm ahead of the cutout); the rear between the top and the tail eases up to 1.5 mm; the last 18 mm of the tail and the front 14 mm are untouched.' % (NOSE - apex('H50')[0])),
    ('54 % · SLIGHTLY BEHIND', HERO_T, 'The top at %.1f mm from the front. Half the change: the triggers up to 1.9 mm, the rear down to 1.1 mm.' % (NOSE - apex('H54')[0])),
    ('THE STARLIGHT X', INK, 'Finalmouse: 124.8 × 58.9 × 39.5 mm, 38 g, symmetric, “a fuller rear hump”. No orthographic side outline is public; read off Finalmouse’s side render, its top sits about half way (52 % ± 3 %). Overlay to come if you send its profile.'),
    ('THE WHEEL', INK, 'The skin over the wheel rises 0.6 mm (50 %) or 0.3 mm (54 %); I raise the wheel with it so it stays 2.9 mm proud (the encoder’s axle 0.6 / 0.3 mm higher).'),
]
ty = ny + 50
for head, col, body_ in lines_:
    sh.label(nx + 30, ty, head, size=19, color=col); ty = wrap_text = None or ty
    from textwrap import wrap as _w
    for l in _w(body_, 52): ty += 28; sh.text(nx + 30, ty, l, size=19, weight=500, color=MUTE)
    ty += 46

# ---- the height pair: 38.1 (the scan) and 39.9 (F12.11)
yh = y0 + ph + 340
sh.label(80, yh + 30, '3b · The height: 38.1 mm (your scan) or 39.9 mm (your F12.11 number)', size=24, color=INK)
sh.text(80, yh + 66, 'Today the 3D and MS_DIMS are 38.1 tall but the slides’ side and front outlines were drawn at 39.9 (F0c found the mismatch). '
        'Whichever you pick, the 3D, the outlines and MS_DIMS will agree. The extra 1.8 mm goes in above the crease.', size=20, weight=500, color=MUTE)
s3b = 6.6
for i, hk in enumerate(['H50', 'H54']):
    bx = 80 + i * 1540; by = yh + 100
    sh.card(bx, by, 1500, 430, PANEL)
    axh = sh.panel(bx, by, 1500, 380, -2.0, -20.5, s3b)
    side_drawing(axh, hk, H39=True, col=HERO, lw=2.6)
    side_drawing(axh, hk, H39=False, col=INK, main=False, lw=1.6, alpha=0.6, dash=[7, 5], details=False)
    a1 = apex(hk, True); a0 = apex(hk, False)
    p1 = SG.S([a1])[0]
    sh.text(*sh.to_px(axh, p1[0], p1[1] - 2.0), '39.9 (blue) · 38.1 (dashed)', size=17, weight=700, color=HERO_T, ha='center')
    sh.label(bx + 24, by + 410, {'H50': '50 % at 39.9: the triggers up to 4.6 mm, the wheel 1.6 mm higher to stay 2.9 proud', 'H54': '54 % at 39.9: the triggers up to 3.6 mm, the wheel 1.3 mm higher to stay 2.9 proud'}[hk], size=17, color=MUTE)

# ================================================================== 4. the richer simplified mouse
Y4 = yh + 600
sh.label(80, Y4 + 30, '4 · The simplified mouse, with the creases and the lattice', size=26, color=INK)
sh.text(80, Y4 + 70, 'Still clearly simplified (F38.8), but with what you asked to keep: the two creases ahead of the wheel (the Sora V2’s chamfer each side '
        'of the split) and the shell’s triangle lattice, faint, as an x-ray at its real size (12.5 mm cells, ribs 1.0–1.2 mm), stopping at the hard '
        'crease (F43.6).', size=22, weight=500, color=MUTE)
sh.text(80, Y4 + 102, 'Drawn here with the current lattice (3d/lattice) and with K2 and O1 as stand-ins: your picks and L1’s optimised cell and rib replace them.',
        size=20, weight=500, color=FAINT)
OUTL = outline_top()
BODY = poly('body/body', '1')
SBTOP = []
for p in ['sideFront/sideFront', 'sideRear/sideRear']:
    g = poly(p, '1').difference(BODY.buffer(0.02))
    for q in (g.geoms if hasattr(g, 'geoms') else [g]):
        if q.area > 0.05: SBTOP.append(to_top(np.array(q.exterior.coords)))
def T(P): P = np.asarray(P, float); return np.c_[-P[:, 0], -P[:, 1]]
def Mx(P): P = np.asarray(P, float); return np.c_[-P[:, 0], P[:, 1]]
REAR, _ = option_rear('K2')
OPEN = rrect(-4.5, 27.8, 4.5, 47.1, 1.6)

def lattice_img(view, ymin=Y_C, w=1.1):
    import cv2
    from skimage.morphology import skeletonize
    img, (u0, v0, s) = LA.raster(view, 10, ymin=ymin)
    sk = skeletonize(img > 0).astype(np.uint8)
    r = int(round(w / 2 * s)); k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * r + 1, 2 * r + 1))
    rib = cv2.dilate(sk * 255, k)
    return rib, (u0, v0, s)
LAT = {v: lattice_img(v) for v in ('top', 'left')}
from matplotlib.colors import LinearSegmentedColormap
CM = LinearSegmentedColormap.from_list('lat', [(0, 0, 0, 0), (17 / 255, 17 / 255, 17 / 255, 1)])

def draw_lattice(ax, view, alpha, mirror=False):
    img, (u0, v0, s) = LAT['top' if view in ('top', 'bottom') else 'left']
    A = img.astype(float) / 255
    h, w = A.shape
    ext = [u0, u0 + w / s, v0 + h / s, v0]
    if mirror: A = A[:, ::-1]; ext = [-(u0 + w / s), -u0, v0 + h / s, v0]
    im = ax.imshow(A, cmap=CM, extent=ext, alpha=alpha, zorder=4, interpolation='bilinear')
    return im

def mouse_top_rich(ax, s, lattice=True, creases=True, lat_a=0.14, lw=2.0):
    body(ax, OUTL, lw=lw)
    if lattice:
        im = draw_lattice(ax, 'top', lat_a)
        from matplotlib.patches import Polygon as MP
        clip = MP(OUTL, closed=True, transform=ax.transData); im.set_clip_path(clip)
    for b in SBTOP: fill(ax, b, TRACK, z=5); line(ax, b, 1.0, INK, 0.5, z=8, closed=True)
    kw = 1.3 if s > 3 else 1.0
    line(ax, T(REAR), kw, INK, 0.5, z=7); line(ax, T(Mx(REAR)), kw, INK, 0.5, z=7)
    line(ax, T([[0, 59.6], [0, 47.1]]), kw, INK, 0.5, z=7); line(ax, T([[0, 27.8], [0, Z_CUT]]), kw, INK, 0.5, z=7)
    line(ax, T(OPEN), kw, INK, 0.5, z=7, closed=True)
    fill(ax, T(rrect(-3.5, 28.8, 3.5, 46.1, 3.0)), TRACK, z=6)
    if s > 3:
        for zz in np.arange(30.0, 45.5, 1.2): line(ax, T([[-3.3, zz], [3.3, zz]]), 0.8, INK, 0.25, z=6.5)
    line(ax, T(rrect(-3.5, 28.8, 3.5, 46.1, 3.0)), 1.0, INK, 0.5, z=6.6, closed=True)
    if creases:
        for sg in (1, -1): line(ax, T([[sg * 4.5, 47.1], [sg * 4.5, 58.3]]), kw, INK, 0.42, z=7)

def mouse_side_rich(ax, s, lattice=True, lat_a=0.14, lw=2.0):
    side_drawing(ax, 'today', col=INK, lw=lw, alpha=0.78, wheel=True)
    if lattice:
        im = draw_lattice(ax, 'left', lat_a)
        from matplotlib.patches import Polygon as MP
        im.set_clip_path(MP(SG.S(SIL), closed=True, transform=ax.transData))

def mouse_bottom_rich(ax, s, lattice=True, lat_a=0.10, lw=2.0):
    B = np.c_[-OUTL[:, 0], OUTL[:, 1]]
    body(ax, B, lw=lw)
    if lattice:
        im = draw_lattice(ax, 'bottom', lat_a, mirror=True)
        from matplotlib.patches import Polygon as MP
        im.set_clip_path(MP(B, closed=True, transform=ax.transData))
    # the base plate's edge, the lens window and the skates (KEY_PARTS)
    from shapely.geometry import Polygon as SP
    inset = np.array(SP(B).buffer(-2.6, join_style=1).exterior.coords)
    line(ax, inset, 1.3, INK, 0.5, z=7, closed=True)
    KP = json.load(open('/home/claude/work/s1/keyparts.json'))
    for (x, y) in KP['skates'] + KP['lensDots']:
        t = np.linspace(0, 2 * np.pi, 60); C = np.c_[-x + 3.25 * np.cos(t), y + 3.25 * np.sin(t)]
        fill(ax, C, TRACK, z=8); line(ax, C, 1.0, INK, 0.5, z=9, closed=True)
    lx, ly, lw2, lh = KP['lens']
    line(ax, rrect(-lx - lw2 / 2, ly - lh / 2, -lx + lw2 / 2, ly + lh / 2, 1.6), 1.2, INK, 0.55, z=9, closed=True)

y4 = Y4 + 130
# full-stage sizes: the top view as a slide shows it whole (6.5 px/mm), the side view (6.5 px/mm), the bottom view
cards = [('top', 'From above · 6.5 px/mm (a full-stage view)', 600, 900, 6.5),
         ('left', 'From the left · 6.5 px/mm', 1040, 420, 6.5),
         ('bottom', 'From below · 6.5 px/mm (the lattice through the base, fainter)', 600, 900, 6.5)]
cx = 80
for view, ttl, cw, chh, s in cards:
    sh.card(cx, y4, cw, chh + 80, PANEL)
    if view == 'top':
        a = sh.panel(cx, y4 + 20, cw, chh, 0, 0, s); mouse_top_rich(a, s)
    elif view == 'left':
        a = sh.panel(cx, y4 + 20, cw, chh, 0, -19.5, s); mouse_side_rich(a, s)
    else:
        a = sh.panel(cx, y4 + 20, cw, chh, 0, 0, s); mouse_bottom_rich(a, s)
    sh.label(cx + 24, y4 + chh + 58, ttl, size=17, color=MUTE)
    cx += cw + 40
# the locator sizes, under the side view
lx0 = 80 + 600 + 40; ly0 = y4 + 420 + 80 + 40
sh.card(lx0, ly0, 1040, 900 - 420 - 40, PANEL)
sh.label(lx0 + 24, ly0 + 40, 'The small sizes: what reads, and what I drop', size=18, color=INK)
for j, (s, lat, txt) in enumerate([(2.6, True, '2.6 px/mm (a third of the stage): creases and lattice still read'),
                                   (1.0, True, '1.0 px/mm (the 64 px locator) with the lattice: it turns to grey'),
                                   (1.0, False, '1.0 px/mm, the locator as I’d draw it: no lattice, creases kept')]):
    bx = lx0 + 40 + j * 330; byy = ly0 + 70
    a = sh.panel(bx, byy, 300, 330, 0, 0, s)
    mouse_top_rich(a, s, lattice=lat, lat_a=0.14 if s > 2 else 0.22, lw=1.6 if s < 2 else 2.0)
    from textwrap import wrap as _w
    for k, l in enumerate(_w(txt, 34)): sh.text(bx, byy + 350 + k * 22, l, size=15, weight=600, color=MUTE)
# ---- where the creases are (the Sora V2), right of the bottom view
from PIL import Image as _I
qx, qy, qw = 80 + 600 + 40 + 1040 + 40 + 600 + 40, y4, 3200 - 80 - (80 + 600 + 40 + 1040 + 40 + 600 + 40)
sh.card(qx, qy, qw, 980, PANEL)
sh.label(qx + 24, qy + 40, 'Where the creases are', size=19, color=INK)
ph_ = np.asarray(_I.open('/home/claude/theseus/3d/shell/work/refs/rtings_front_crop.png').convert('L')).astype(float)
crop = ph_[330:790, 120:700]
lo_, hi_ = np.percentile(crop, [2, 98]); crop = np.clip((crop - lo_) / (hi_ - lo_), 0, 1) ** 0.8
axp = sh.fig.add_axes([(qx + 24) / W, 1 - (qy + 70 + 390) / H, (qw - 48) / W, 390 / H]); axp.axis('off')
axp.imshow(crop, cmap='gray', vmin=0, vmax=1, extent=[120, 700, 790, 330], interpolation='bilinear')
p0, p1 = np.array([460., 480.]), np.array([250., 700.]); n_ = np.array([-0.7234, -0.6905])
c0_, c1_ = p0 + 58 * n_, p1 + 58 * n_
axp.plot([c0_[0], c1_[0]], [c0_[1], c1_[1]], color=HERO, lw=2.4 * PX, ls=(0, (5, 4)))
axp.set_xlim(120, 700); axp.set_ylim(790, 330)
from textwrap import wrap as _w
yy = qy + 70 + 390 + 40
for l in _w('Reference only (RTINGS, Sora V2 from the front left). Ahead of the wheel each trigger turns down toward the split in a narrow '
            'chamfer; its edge (dashed) is the crease, roughly in line with the opening’s side, from the opening to the lip. The fitted 3D '
            'skin smoothed it away, so the drawings lost it too. I’d model it as a soft crease, about 0.3 mm deep at the split, and draw '
            'its line from the 3D.', 50):
    sh.text(qx + 24, yy, l, size=17, weight=500, color=MUTE); yy += 25
sh.save(OUT)
print('saved', OUT)
