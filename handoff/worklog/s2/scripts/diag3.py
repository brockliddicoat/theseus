import numpy as np, matplotlib, json, sys; matplotlib.use('Agg')
import matplotlib.pyplot as plt
from PIL import Image
from common import *
import shellio, sidegeo as SG
M = ms(); can = np.asarray(Image.open('/home/claude/work/s2/photo_mm20.png')); P = json.load(open('/home/claude/work/s2/photo_mm20.json'))
Z0, Z1, Y0, Y1 = P['Z0'], P['Z0'] - P['W'] / P['s'], P['Y1'] - P['H'] / P['s'], P['Y1']
zl = [float(v) for v in sys.argv[1:5]] if len(sys.argv) > 4 else [62, 0, 8, 40]
fig, ax = plt.subplots(figsize=(24, 24 * (zl[3] - zl[2]) / (zl[0] - zl[1])), dpi=90)
ax.imshow(can, extent=[Z0, Z1, Y0, Y1])
lw = 0.8
sil = SG.silhouette('shell'); ax.plot(sil[:, 0], sil[:, 1], color='#0071e3', lw=lw, label='3D twin silhouette')
tr = SG.trigger_side('shell'); ax.plot(tr[:, 0], tr[:, 1], color='orange', lw=lw, label='Theseus triggerL (1seam)')
trs = np.array(max([p for p, h in shellio.mesh_rings('explodeL/triggerL/Group/triggerL', '0', 'shell-sora') if not h], key=len))
ax.plot(trs[:, 0], trs[:, 1], color='lime', lw=lw, label='Sora variant triggerL')
ax.set_xlim(zl[0], zl[1]); ax.set_ylim(zl[2], zl[3]); ax.set_aspect('equal'); ax.legend(loc='lower left', fontsize=12)
ax.grid(True, alpha=0.25); ax.set_xticks(np.arange(np.floor(zl[1]), zl[0] + 1, 2)); ax.set_yticks(np.arange(np.floor(zl[2]), zl[3] + 1, 2))
plt.savefig(sys.argv[5] if len(sys.argv) > 5 else '/home/claude/work/s2/shots/diag3.png', bbox_inches='tight')
a = np.load('/home/claude/work/s2/seam_ths_cloud.npy'); b = np.load('/home/claude/work/s2/seam_sora_cloud.npy')
ax.plot(a[:, 2], a[:, 1], '.', color='red', ms=2.5, label='seam centreline 3D (ths)')
ax.plot(b[:, 2], b[:, 1], '.', color='cyan', ms=2.5, label='seam centreline 3D (sora)')
for p in ['sideFront/sideFront', 'sideRear/sideRear']:
    for q, h in shellio.mesh_rings(p, '0', 'shell'):
        q = np.array(q); ax.plot(q[:, 0], q[:, 1], color='yellow', lw=0.8)
ax.legend(loc='lower left', fontsize=12)
plt.savefig(sys.argv[5] if len(sys.argv) > 5 else '/home/claude/work/s2/shots/diag3.png', bbox_inches='tight')
