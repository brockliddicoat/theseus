import sys, json, numpy as np, matplotlib; matplotlib.use('Agg'); import matplotlib.pyplot as plt
sys.path.insert(0, '/home/claude/work/s2/scripts')
exec(open('rimsec.py').read().split('cr = json.load')[0])
cr = json.load(open('/home/claude/work/s1/crease_side.json'))
zs = [-55, -50, -40, -30, -20, -10, 0, 20, 40]
fig, ax = plt.subplots(1, len(zs), figsize=(3.2 * len(zs), 6), dpi=80)
for a, z in zip(ax, zs):
    dd = np.stack([A[:, 2], B[:, 2], C[:, 2]], 1) - z
    m = (dd.min(1) < 0) & (dd.max(1) > 0)
    for aa, bb, cc, e in zip(A[m], B[m], C[m], dd[m]):
        pts = []
        for (p, q, dp, dq) in ((aa, bb, e[0], e[1]), (bb, cc, e[1], e[2]), (cc, aa, e[2], e[0])):
            if (dp < 0) != (dq < 0): t = dp / (dp - dq); pts.append((p + t * (q - p))[:2])
        if len(pts) == 2 and pts[0][0] > 0: a.plot([pts[0][0], pts[1][0]], [pts[0][1], pts[1][1]], color='#333', lw=0.7)
    yc = np.interp(z, cr['z'], cr['y']); yl = 8.56 - 0.0484 * (z + 59.58)
    a.axhline(yc, color='red', lw=0.8); a.axhline(yl, color='#0A6CFF', lw=0.8)
    a.set_xlim(max(0, a.get_xlim()[1] - 9) if z < -45 else 22, 32 if z > -52 else 24); a.set_ylim(0, 12); a.set_aspect('equal'); a.grid(alpha=.3); a.set_title('z %d' % z)
plt.savefig('/home/claude/work/s2/shots/rim_sections.png', bbox_inches='tight')
