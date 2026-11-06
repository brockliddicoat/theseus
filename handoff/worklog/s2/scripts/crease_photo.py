"""The crease in the registered Sora side photo: for each z, the strongest downward brightness step between y 2 and 11."""
import numpy as np, json
from PIL import Image
from scipy.ndimage import gaussian_filter, gaussian_filter1d
P = json.load(open('/home/claude/work/s2/photo_mm20.json')); s = P['s']
ph = np.asarray(Image.open('/home/claude/theseus/3d/shell/work/refs/sora-v2-side.png').convert('L')).astype(float) / 255
R = json.load(open('/home/claude/work/s2/photo_reg.json')); A = np.array(R['M'])
import cv2
SCAN_S = 6.5
S2C = np.array([[s / SCAN_S, 0, (P['Z0'] - 650 / SCAN_S) * s], [0, s / SCAN_S, (P['Y1'] - 19 - 260 / SCAN_S) * s]])
T = (np.vstack([S2C, [0, 0, 1]]) @ np.vstack([A, [0, 0, 1]]))[:2]
can = cv2.warpAffine((ph * 255).astype(np.uint8), T, (P['W'], P['H']), flags=cv2.INTER_AREA, borderValue=255).astype(float) / 255
can = gaussian_filter(can, 1.2)
cz = lambda z: (P['Z0'] - z) * s; cy = lambda y: (P['Y1'] - y) * s
c1 = json.load(open('/home/claude/work/s1/crease_side.json'))
out = []
for z in np.arange(-58, 52.1, 2.0):
    ys = np.arange(1.6, 11.5, 0.05)
    col = np.array([can[int(round(cy(y))), int(round(cz(z)))] for y in ys])
    col = gaussian_filter1d(col, 2)
    g = np.gradient(col, ys)          # brightness rising with y = lighter above
    k = np.argmax(g)
    out.append((z, ys[k], g[k], np.interp(z, c1['z'], c1['y'])))
for r in out: print('z %6.1f  photo step at y %.2f (strength %.3f)   S1 crease %.2f' % r)
json.dump([list(map(float, r)) for r in out], open('/home/claude/work/s2/crease_photo.json', 'w'))
