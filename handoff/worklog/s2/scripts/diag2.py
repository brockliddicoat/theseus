import numpy as np, matplotlib, json, cv2; matplotlib.use('Agg')
import matplotlib.pyplot as plt
from PIL import Image
from common import *
import shellio, sidegeo as SG
M = ms()
R = json.load(open('/home/claude/work/s2/photo_reg.json')); A = np.array(R['M'])
ph = np.asarray(Image.open(REPO + '/3d/shell/work/refs/sora-v2-side.png').convert('RGB')).astype(float) / 255
ph = np.clip(ph ** 0.35, 0, 1)
# warp the photo into a scene-mm canvas at 20 px/mm: canvas px = ((60 - Z)*s ... ) build the full affine photo->canvas
s = 20.0; Z0, Z1, Y0, Y1 = 62, -62, -1, 41
W, H = int((Z0 - Z1) * s), int((Y1 - Y0) * s)
# scan px -> scene: Z = (650 - px)/6.5, Y = 19 - (py - 260)/6.5 ; canvas: cx = (Z0 - Z)*s, cy = (Y1 - Y)*s
S2C = np.array([[s / SCAN_S, 0, (Z0 - 650 / SCAN_S) * s], [0, s / SCAN_S, (Y1 - 19 - 260 / SCAN_S) * s]])
Af = np.vstack([A, [0, 0, 1]]); Sf = np.vstack([S2C, [0, 0, 1]])
T = (Sf @ Af)[:2]
can = cv2.warpAffine((ph * 255).astype(np.uint8), T, (W, H), flags=cv2.INTER_AREA, borderValue=(255, 255, 255))
Image.fromarray(can).save('/home/claude/work/s2/photo_mm20.png')
json.dump(dict(s=s, Z0=Z0, Y1=Y1, W=W, H=H), open('/home/claude/work/s2/photo_mm20.json', 'w'))
fig, ax = plt.subplots(figsize=(26, 9), dpi=80)
ax.imshow(can, extent=[Z0, Z1, Y0, Y1])
sil = SG.silhouette('shell'); ax.plot(sil[:, 0], sil[:, 1], color='#0071e3', lw=1.0, label='3D twin silhouette')
tr = SG.trigger_side('shell'); ax.plot(tr[:, 0], tr[:, 1], color='orange', lw=1.2, label='Theseus triggerL (1seam)')
trs = np.array(max([p for p, h in shellio.mesh_rings('explodeL/triggerL/Group/triggerL', '0', 'shell-sora') if not h], key=len))
ax.plot(trs[:, 0], trs[:, 1], color='lime', lw=1.2, label='Sora variant triggerL')
for sm in M['SEAM']: ax.plot(sm[:, 0], sm[:, 1], color='magenta', lw=1.2, label='kit MS_SIDE_SEAM (39.9 frame)')
cz, cy = crease_s1(); ax.plot(cz, cy, color='green', lw=1.5, label='S1 crease')
ax.set_xlim(Z0, Z1); ax.set_ylim(Y0, Y1); ax.set_aspect('equal'); ax.legend(loc='upper right', fontsize=12)
ax.grid(True, alpha=0.3); ax.set_xticks(np.arange(-60, 61, 5)); ax.set_yticks(np.arange(0, 41, 5))
plt.savefig('/home/claude/work/s2/shots/diag2.png', bbox_inches='tight')
