"""Before / after: the bottom rim's top edge (the hard crease) in the side view, against the scan (F47)."""
import sys, json
import numpy as np, cv2
sys.path.insert(0, '/home/claude/work/s1/scripts')
from sheetlib import *
import sidegeo as SG
import lattice_asset as LA
from skimage.morphology import skeletonize
from matplotlib.colors import LinearSegmentedColormap
from matplotlib.patches import Polygon as MP
from curv import render_curv
from render import load

CR = json.load(open('/home/claude/work/s1/crease_side.json'))
crease_y = lambda z: np.interp(z, CR['z'], CR['y'])
SIL = SG.silhouette('shell'); SEAM = SG.seam_lower(); SBS = SG.side_buttons()
CM = LinearSegmentedColormap.from_list('lat', [(0, 0, 0, 0), (17 / 255, 17 / 255, 17 / 255, 1)])

def lattice(clip):
    R = LA.parts(); s = 10
    allP = np.vstack([v[0] for v in R.values()])
    U, V = (lambda P: -P[:, 2]), (lambda P: -P[:, 1])
    u0, u1 = U(allP).min() - 2, U(allP).max() + 2; v0, v1 = V(allP).min() - 2, V(allP).max() + 2
    img = np.zeros((int((v1 - v0) * s), int((u1 - u0) * s)), np.uint8)
    for p, (P, I, E) in R.items():
        keep = (E[I] > 0.35).all(1) & (P[I][:, :, 0] > 0).all(1)
        keep &= (P[I][:, :, 1] > clip(P[I][:, :, 2])).all(1)
        q = np.stack([(U(P) - u0) * s, (V(P) - v0) * s], 1)
        for t in I[keep]: cv2.fillConvexPoly(img, np.round(q[t] * 16).astype(np.int32), 255, lineType=cv2.LINE_8, shift=4)
    sk = skeletonize(img > 0).astype(np.uint8) * 255
    rib = cv2.dilate(sk, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (11, 11)))
    return rib, (u0, v0, s)

def side(ax, clip_fn, crease_line, col=INK):
    fill(ax, SG.S(SIL), PANEL, z=2)
    img, (u0, v0, s) = lattice(clip_fn)
    h, w = img.shape
    im = ax.imshow(img.astype(float) / 255, cmap=CM, extent=[u0, u0 + w / s, v0 + h / s, v0], alpha=0.16, zorder=4, interpolation='bilinear')
    im.set_clip_path(MP(SG.S(SIL), closed=True, transform=ax.transData))
    line(ax, SG.S(SIL), 2.0, INK, 0.78, z=8, closed=True)
    line(ax, SG.S(SEAM), 1.3, INK, 0.5, z=6)
    for b in SBS: fill(ax, SG.S(b), TRACK, z=5); line(ax, SG.S(b), 1.2, INK, 0.5, z=7, closed=True)
    line(ax, SG.S(crease_line), 2.4, col, 0.95, z=9)

W_, H_ = 2600, 1500
sh = Sheet(W_, H_)
sh.title(60, 90, 'The bottom rim: before and after', size=44)
sh.text(60, 135, 'Side view (the left wall, nose left), 10 px/mm. The rim is the band under the hard crease; F43.6 keeps the lattice off it.', size=22, weight=500, color=MUTE)
s = 10.0
rows = [('Before (my sheet and the kit’s MS_SKIRT): the crease drawn as a level line at 9.3 mm', lambda Z: np.full(np.shape(Z), 9.3), np.c_[[-59.0, 59.0], [9.3, 9.3]], RED),
        ('After: the crease where your scan has it, sloping down from the back (8.6 mm at the tail, 4.8 a third of the way in, then about 4)', crease_y, np.c_[CR['z'], CR['y']], HERO)]
for i, (ttl, clip, cl, col) in enumerate(rows):
    y0 = 190 + i * 430
    sh.label(60, y0 + 10, ttl, size=19, color=RED if col == RED else HERO_T)
    ax = sh.panel(60, y0 + 30, 1300, 380, 0, -19.5, s)
    side(ax, clip, cl, col)
M = load('/home/claude/theseus/3d/shell/shell-sora.glb', ['body', 'triggerL', 'triggerR', 'sideFront', 'sideRear'])
img, box = render_curv(M, 'left', s, 0.06)
y0 = 190 + 2 * 430
sh.label(60, y0 + 10, 'Your scan (shell-sora, the scan’s own surface): its curvature; the crease is the dark ridge running forward from the tail', size=19, color=INK)
axs = sh.fig.add_axes([60 / W_, 1 - (y0 + 30 + img.shape[0]) / H_, img.shape[1] / W_, img.shape[0] / H_]); axs.axis('off'); axs.imshow(img)
for k, (ttl, clip, cl, col) in enumerate(rows):
    zx = 1420 + k * 590; zy = 220
    sh.label(zx, zy - 10, ('Before' if k == 0 else 'After') + ': the tail, 30 px/mm', size=18, color=RED if col == RED else HERO_T)
    ax = sh.panel(zx, zy, 560, 560, 51.5, -9.0, 30.0, frame=True)
    side(ax, clip, cl, col)
for j, l in enumerate(['The 3D shell is your scan here: its outline at the tail is within',
                       '0.4 mm of the raw scan’s render, so its shape stays. What was',
                       'wrong is the level 9.3 mm line I used for the crease (and the',
                       'kit’s MS_SKIRT): it put the rim about 5 mm too high all along',
                       'the mouse and took the lattice off that much side wall. The',
                       'crease is measured on the scan’s surface (both walls agree',
                       'to 0.2 mm); the 2D draws it from there and the lattice stops on it.']):
    sh.text(1420, 830 + j * 30, l, size=19, weight=500, color=MUTE)
sh.save('/home/claude/work/s1/rim_before_after.png')
print('ok')
