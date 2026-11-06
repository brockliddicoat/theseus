import numpy as np, matplotlib; matplotlib.use('Agg')
import matplotlib.pyplot as plt
from PIL import Image
from common import *
import shellio, sidegeo as SG
M = ms()
img = np.asarray(Image.open(SCAN_PX).convert('RGB'))
# extent in scene coords: px -> Z = (650 - px)/6.5 ; py -> Y = 19 - (py-260)/6.5
H, W = img.shape[:2]
ext = [(650 - 0) / SCAN_S, (650 - W) / SCAN_S, 19 - (H - 260) / SCAN_S, 19 - (0 - 260) / SCAN_S]   # left, right, bottom, top in Z,Y
fig, ax = plt.subplots(figsize=(26, 9), dpi=80)
ax.imshow(img, extent=ext, alpha=0.75)
sil = SG.silhouette('shell')
ax.plot(sil[:, 0], sil[:, 1], color='#0071e3', lw=1.2, label='3D twin silhouette (shell.json)')
tr = SG.trigger_side('shell'); ax.plot(tr[:, 0], tr[:, 1], color='orange', lw=1.0, label='twin triggerL outline')
S = M['SIDE']; ax.plot(np.r_[S[:, 0], S[0, 0]], np.r_[S[:, 1], S[0, 1]], color='red', lw=1.2, label='kit MS_SIDE (39.9)')
for s in M['SEAM']: ax.plot(s[:, 0], s[:, 1], color='magenta', lw=1.5, label='kit MS_SIDE_SEAM')
ax.axhline(9.3, color='red', ls='--', lw=1, label='MS_SKIRT 9.3')
cz, cy = crease_s1(); ax.plot(cz, cy, color='green', lw=1.5, label='S1 crease (shell-sora curvature)')
ax.set_xlim(62, -62); ax.set_ylim(-1, 41); ax.set_aspect('equal'); ax.legend(loc='upper right', fontsize=12)
ax.grid(True, alpha=0.3); ax.set_xticks(np.arange(-60, 61, 5)); ax.set_yticks(np.arange(0, 41, 5))
plt.savefig('/home/claude/work/s2/shots/diag1.png', bbox_inches='tight')
print('ok')
