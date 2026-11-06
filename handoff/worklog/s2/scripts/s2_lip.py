"""S2's last seam step: the lip's corners (z Z0..tip) raised onto C (<= 0.3 mm) by a vertical push of the seam's band; the
faces round the seam there (the lip plate's outer edge, the chin's face) are vertical, so a vertical move stays on them."""
import sys, json, time
import numpy as np
from scipy.spatial import cKDTree
from scipy.ndimage import gaussian_filter1d
sys.path.insert(0, '/home/claude/theseus/3d/shell/tools'); sys.path.insert(0, '/home/claude/work/s2/scripts')
import glbio, one_seam, front as FR
from seam3d import seam_line
Z0, BAND, FADE, RAD = 54.0, 0.6, 1.6, 2.5
def q5(t): t = np.clip(t, 0, 1); return t ** 3 * (10 - 15 * t + 6 * t * t)
def run(src, dst):
    js, b = glbio.read(src); M = {}
    for n in js['nodes']:
        if 'mesh' not in n: continue
        _, d = glbio.mesh_arrays(js, b, n['name'])
        M[n['name']] = [d['POSITION'].astype(float), d['NORMAL'].astype(float), d['COLOR_0'], d['indices'].reshape(-1, 3).astype(np.int64)]
    fC, _ = FR.design_C()
    sm = {k: (M[k][0], M[k][1], M[k][3]) for k in ('body', 'triggerL', 'triggerR')}
    cl = np.vstack([seam_line(sm, 'L'), seam_line(sm, 'R')]); cl = cl[cl[:, 2] > Z0 - 1.0]
    # the seam's height now, as a function of z (both sides alike), and the push it needs
    zz = np.arange(Z0 - 1.0, 59.7, 0.05); yn = np.array([cl[np.abs(cl[:, 2] - z) < 0.15][:, 1].mean() if (np.abs(cl[:, 2] - z) < 0.15).any() else np.nan for z in zz])
    ok = np.isfinite(yn); yn = np.interp(zz, zz[ok], yn[ok]); yn = gaussian_filter1d(yn, 3)
    dy = (fC(zz) - yn) * q5((zz - Z0) / 0.8)
    tree = cKDTree(cl); moved = {}
    for name in ('body', 'triggerL', 'triggerR'):
        P = M[name][0]; sel = np.nonzero(P[:, 2] > Z0)[0]
        d, j = tree.query(P[sel]); cnt = 0
        for i, dd, jj in zip(sel, d, j):
            if dd > RAD: continue
            s = cl[jj]; vy = abs(P[i, 1] - s[1])
            w = 1.0 if vy <= BAND else 1 - q5((vy - BAND) / (FADE - BAND))
            hz = np.hypot(P[i, 0] - s[0], P[i, 2] - s[2]); w *= 1 - q5((hz - 1.5) / (RAD - 1.5))
            if w <= 0: continue
            P[i, 1] += w * float(np.interp(s[2], zz, dy)); cnt += 1
        moved[name] = cnt
    rep = {k: (M[k][0].astype(np.float32), M[k][1].astype(np.float32), M[k][2], M[k][3].astype(np.uint32)) for k in M}
    one_seam.write(js, b, rep, [], dst)
    print(json.dumps(dict(moved=moved, dy_max=round(float(dy.max()), 3), dy_min=round(float(dy.min()), 3))))
if __name__ == '__main__': run(sys.argv[1], sys.argv[2])
