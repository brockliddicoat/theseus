import sys, numpy as np, matplotlib; matplotlib.use('Agg'); import matplotlib.pyplot as plt
sys.path.insert(0, '/home/claude/theseus/3d/shell/tools')
import glbio
fn = sys.argv[1] if len(sys.argv) > 1 else '/home/claude/theseus/3d/shell/shell-theseus-1seam.glb'
zs = [float(v) for v in sys.argv[2].split(',')] if len(sys.argv) > 2 else [44, 48, 50, 52, 54, 55.5]
js, b = glbio.read(fn); M = {}
for k in ('body', 'triggerL'):
    _, d = glbio.mesh_arrays(js, b, k); M[k] = (d['POSITION'].astype(float), d['indices'].reshape(-1, 3))
def section(P, T, z0):
    A, B, C = P[T[:, 0]], P[T[:, 1]], P[T[:, 2]]
    dd = np.stack([A[:, 2], B[:, 2], C[:, 2]], 1) - z0
    m = (dd.min(1) < 0) & (dd.max(1) > 0); segs = []
    for a, bb, c, e in zip(A[m], B[m], C[m], dd[m]):
        pts = []
        for (p, q, dp, dq) in ((a, bb, e[0], e[1]), (bb, c, e[1], e[2]), (c, a, e[2], e[0])):
            if (dp < 0) != (dq < 0): t = dp / (dp - dq); pts.append((p + t * (q - p))[:2])
        if len(pts) == 2: segs.append(pts)
    return np.array(segs)
c = np.load('/home/claude/work/s2/seam_ths_cloud.npy')
import json; p = np.array(json.load(open('/home/claude/work/s2/seam_path_v4.json'))['path'])
fig, ax = plt.subplots(1, len(zs), figsize=(4.5 * len(zs), 6), dpi=80)
for a, z in zip(ax, zs):
    for k, col in (('body', '#444'), ('triggerL', '#0A6CFF')):
        S = section(*M[k], z)
        for s in S: a.plot(s[:, 0], s[:, 1], color=col, lw=0.8)
    m = np.abs(c[:, 2] - z) < 0.3; a.plot(c[m, 0], c[m, 1], 'o', color='red', ms=4)
    m = (np.abs(p[:, 2] - z) < 0.06) & (p[:, 0] > 10); a.plot(p[m, 0], p[m, 1], 's', color='lime', ms=5)
    a.plot([0, 30], [5, 5 + 30 * np.tan(np.radians(15))], color='#ccc', lw=0.5)
    a.set_xlim(14, 31); a.set_ylim(4, 20); a.set_aspect('equal'); a.grid(alpha=.3); a.set_title('z %.1f' % z)
plt.savefig('/home/claude/work/s2/shots/sections_nose.png', bbox_inches='tight')
