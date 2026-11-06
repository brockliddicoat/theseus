"""S2: close-up of option C at the nose (side, front, top, 3/4; 32 px/mm): the seam's 3D path drawn over light renders of the
shell, so it shows where the seam meets the lip and runs across the front. New dated file."""
import sys, json, time
import numpy as np, cv2
sys.path.insert(0, '/home/claude/work/s1/scripts'); sys.path.insert(0, '/home/claude/work/s2/scripts')
from render import load, render, VIEWS, view34
import front as FR
from sheetlib import *
SRC = '/home/claude/theseus/3d/shell/shell-theseus-1seam.glb'
M = load(SRC, ['body', 'triggerL', 'triggerR'])
fC, D = FR.design_C()
v6 = np.array(json.load(open('/home/claude/work/s2/seam_path_v6.json'))['path'])
cl = np.load('/home/claude/work/s2/seam_ths_cloud.npy')
# the front cutout today, in plan: z as a function of |x| for the +X side (from the seam cloud, z > 54)
fr = cl[(cl[:, 2] > 53.5) & (cl[:, 0] > -0.2)]; o = np.argsort(fr[:, 0]); fx, fz = fr[o, 0], fr[o, 2]
xs = np.linspace(0.0, 18.0, 200); zs = np.interp(xs, fx, fz)
from scipy.ndimage import gaussian_filter1d
zs = gaussian_filter1d(zs, 3)
front = np.c_[xs, fC(zs), zs]                                         # the lip across the nose, C's heights
side = v6[(v6[:, 2] > 30.0)]                                         # the side seam, front part (z 30 .. 55.5)
# one line: the -X side (back -> the lip's corner), the lip across the nose (-X corner -> +X corner), the +X side (-> back)
sideP = side                                                          # v6 runs front -> back on the +X side
newL = np.vstack([sideP[::-1] * [-1, 1, 1], front[::-1][1:] * [-1, 1, 1], front[1:], sideP])
newR = np.zeros((0, 3))
olds = cl[cl[:, 2] > 30]
views = [('side', 'left', (-61.5, 7.0, -40.0, 21.0)), ('front', 'front', (-24.0, 6.0, 24.0, 18.0)), ('top', 'top', (-26.0, 36.0, 26.0, 61.5)), ('3/4', view34(-40, 22), None)]
S_ = 32.0
imgs = []
for nm, v, box in views:
    r_, u_, d_ = VIEWS[v] if isinstance(v, str) else v
    if box is None:
        allP = np.vstack([m[1] for m in M]); sel = allP[allP[:, 2] > 30]
        X = sel @ r_; Y = sel @ u_; box = (X.min() - 1, Y.min() - 1, X.max() + 1, Y.max() + 1)
    img, bx = render(M, (r_, u_, d_), S_, box=box)
    img = (255 - (255 - img.astype(float)) * 0.45).astype(np.uint8)          # lightened
    x0, y0, x1, y1 = bx
    def proj(P): return np.c_[(P @ r_ - x0) * S_, (y1 - P @ u_) * S_]
    # visibility: draw only the points facing the viewer side (crude: skip the far side in side/3-4 views)
    def draw(P, col, w):
        Q = proj(P)
        for a, b in zip(Q[:-1], Q[1:]):
            cv2.line(img, tuple(np.round(a * 8).astype(int)), tuple(np.round(b * 8).astype(int)), col, w, cv2.LINE_AA, shift=3)
    near = lambda P: P[(P @ d_) >= (np.median(np.vstack([m[1] for m in M]) @ d_) - 2)] if nm in ('side', '3/4') else P
    for P in [olds[olds[:, 0] > 0], olds[olds[:, 0] < 0]]:
        Q = proj(near(P))
        for q in Q: cv2.circle(img, tuple(np.round(q).astype(int)), 2, (225, 72, 77), -1, cv2.LINE_AA)
    PP = newL
    if nm == 'side': PP = newL[newL[:, 0] > -0.5]
    if nm == '3/4': PP = newL[(newL @ d_) > (np.vstack([m[1] for m in M]) @ d_).min() + 0.45 * np.ptp(np.vstack([m[1] for m in M]) @ d_)]
    draw(PP, (10, 108, 227), 3)
    imgs.append((nm, img))
H = max(i.shape[0] for _, i in imgs)
W = sum(i.shape[1] for _, i in imgs) + 40 * (len(imgs) + 1)
sheet = np.full((H + 260, max(W, 2400), 3), 245, np.uint8)
x = 40
for nm, im in imgs:
    sheet[150:150 + im.shape[0], x:x + im.shape[1]] = im[:, :, ::-1] if False else im
    cv2.putText(sheet, nm.upper(), (x, 135), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (30, 30, 30), 2, cv2.LINE_AA)
    x += im.shape[1] + 40
cv2.putText(sheet, 'Option C at the nose, 32 px/mm. Blue: the new seam (one line: along each side, into the lip, across the front). Red dots: today\'s seam.', (40, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (30, 30, 30), 2, cv2.LINE_AA)
cv2.putText(sheet, 'The lip stays flat across the middle; its outer corners rise 0.3 mm to meet the run-out. Smallest radius of the run-out 16.7 mm.', (40, 100), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (90, 90, 95), 2, cv2.LINE_AA)
fn = '/home/claude/work/s2/s2_nose_C_closeup_%s.png' % time.strftime('%H%M')
cv2.imwrite(fn, sheet[:, :, ::-1]); print(fn, sheet.shape)
