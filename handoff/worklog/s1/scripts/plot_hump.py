import json, sys
import numpy as np
sys.path.insert(0, '/home/claude/work/s1/scripts')
from hump import Hump, Y_C
import matplotlib; matplotlib.use('Agg')
import matplotlib.pyplot as plt
prof = json.load(open('/home/claude/work/s1/profile_centre.json'))
nose, tail = prof['nose'], prof['tail']; L = nose - tail
zz = np.linspace(tail, nose, 1500)
fig, ax = plt.subplots(2, 1, figsize=(20, 12), gridspec_kw={'height_ratios': [3, 1.3]})
H0 = Hump(prof, -14.1)
raw = np.array(prof['raw']); ax[0].plot(-np.array(prof['z']), raw, color='#bbb', lw=1, label='raw centre line')
ax[0].plot(-zz, H0.h_old(zz), 'k-', lw=2, label='today (apex %.1f mm from the nose)' % (nose + 14.1))
cols = {50: '#0A6CFF', 54: '#7a4dff', 52: '#00a0a0'}
for pct in (50, 54):
    for zt, zf, ls in ((-42, 46, '-'),):
        H = Hump(prof, nose - pct / 100 * L, z_t=zt, z_f=zf)
        hn = H.h_new(zz)
        ax[0].plot(-zz, hn, ls, color=cols[pct], lw=2, label='%d %%: apex %.1f mm from the nose' % (pct, nose - zz[np.argmax(hn)]))
        ax[1].plot(-zz, hn - H.h_old(zz), ls, color=cols[pct], lw=2); ax[1].plot(-zz, (H.k(zz) - 1) * 20, ':', color=cols[pct], lw=1.5)
ax[0].axhline(Y_C, color='#999', lw=.8, ls='--'); ax[0].text(-nose, Y_C + .3, 'hard crease y 9.3 (nothing below moves)')
for a in ax: a.grid(alpha=.3); a.set_xlim(-nose - 2, -tail + 2)
ax[0].set_aspect('equal'); ax[0].set_ylim(0, 42); ax[0].legend(); ax[1].set_ylabel('height change (mm)'); ax[1].axhline(0, color='k', lw=.6)
ax[0].set_title('side profile (nose on the left): today vs the centre hump')
plt.tight_layout(); plt.savefig('/home/claude/work/s1/hump_profiles.png', dpi=60)
