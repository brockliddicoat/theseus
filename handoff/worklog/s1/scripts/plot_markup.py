import json, sys
import numpy as np
sys.path.insert(0, '/home/claude/work/s1/scripts')
from shellio import mesh_rings
import matplotlib; matplotlib.use('Agg')
import matplotlib.pyplot as plt

D = json.load(open('/home/claude/work/s1/markup_digitised.json'))
SH = json.load(open('/home/claude/work/s1/sora_half.json'))
MSK = (62.5 / 62.38, 119.2 / 118.99)
half = np.array([[x * MSK[0], -z * MSK[1]] for x, z in SH])
full = np.vstack([half, half[::-1] * [-1, 1]])
fig, axs = plt.subplots(1, 3, figsize=(24, 11))
for ax, lim in zip(axs, [(-33, 33, -30, 8), (-32, -14, -20, -2), (14, 32, -20, -2)]):
    ax.plot(full[:, 0], full[:, 1], 'k-', lw=1.2, label='kit outline (KEY_PTS x MS_K)')
    for nm in ('explodeL/triggerL/Group/triggerL', 'explodeR/triggerR/Group/triggerR'):
        for pts, h in mesh_rings(nm, '1'):
            P = np.array(pts); ax.plot(-P[:, 0] * MSK[0], -P[:, 1] * MSK[1], '-', color='#1f77b4', lw=1, alpha=.7)
    bl = np.array(D['blue']); ax.plot(bl[:, 0], bl[:, 1], '.', color='#5aa0ff', ms=2, label='b02 blue (screenshot)')
    for nm in ('left', 'right'):
        c = np.array(D['curves'][nm]['mm']); ax.plot(c[:, 0], c[:, 1], '-', color='red', lw=2.5, label='Brock red ' + nm)
    ax.axhline(-4.85, color='g', lw=.6, ls='--')
    ax.set_aspect('equal'); ax.grid(alpha=.3); ax.set_xlim(lim[0], lim[1]); ax.set_ylim(lim[3], lim[2])
axs[0].legend(loc='lower center', fontsize=9)
plt.tight_layout(); plt.savefig('/home/claude/work/s1/markup_mm.png', dpi=60)
