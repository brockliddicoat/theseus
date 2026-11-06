import sys; sys.path.insert(0, '/home/claude/work/s1/scripts')
from shellio import *
import matplotlib; matplotlib.use('Agg')
import matplotlib.pyplot as plt
fig, axs = plt.subplots(1, 3, figsize=(24, 12))
paths = {'body/body': 'k', 'explodeL/triggerL/Group/triggerL': 'b', 'explodeR/triggerR/Group/triggerR': 'g', 'wheelBayGroup/wheelBay': 'm'}
for ax, lim in zip(axs, [None, (-12, 12, 24, 50), (-33, -10, -2, 22)]):
    for p, c in paths.items():
        for pts, h in mesh_rings(p, '1'):
            xs = [-x for x, y in pts] + [-pts[0][0]]; ys = [y for x, y in pts] + [pts[0][1]]   # key-plan: x = -X (user's left on the left)
            ax.plot(xs, ys, c + ('--' if h else '-'), lw=1)
    ax.set_aspect('equal'); ax.grid(alpha=.3)
    if lim: ax.set_xlim(lim[0], lim[1]); ax.set_ylim(lim[2], lim[3])
plt.tight_layout(); plt.savefig('/home/claude/work/s1/now_top.png', dpi=70)
