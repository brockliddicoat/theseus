"""Numbers for the nose sheet, per shell: the seam's side view (heights, smallest radius ahead of z 40, the flat run), the
front cutout's rise at the corners (front view), the lip (gap top to the nose round's 45-deg point) at its thinnest."""
import sys, json, pickle
import numpy as np
from scipy.ndimage import gaussian_filter1d
sys.path.insert(0, '/home/claude/work/s2/scripts')
import seam3d, vskin, nose_seam as NS
def numbers(fn):
    M = seam3d.meshes(fn)
    cl = seam3d.seam_line(M, 'L')
    # side view y(z) from the 3D centreline, z 38..58 (points with x > 12: the side and the corner)
    s = cl[(cl[:, 0] > 12) & (cl[:, 2] > 36)]
    zz = np.arange(38.0, 57.01, 0.25); yy = np.full(len(zz), np.nan)
    for k, z0 in enumerate(zz):
        m = np.abs(s[:, 2] - z0) < 0.3
        if m.sum() >= 2: yy[k] = np.median(s[m, 1])
    ok = np.isfinite(yy); yy = np.interp(zz, zz[ok], yy[ok]); ys = gaussian_filter1d(yy, 2.0, mode='nearest')
    d1 = np.gradient(ys, zz); d2 = np.gradient(d1, zz); k = np.abs(d2) / (1 + d1 ** 2) ** 1.5
    flat = zz[np.abs(ys - 10.0) < 0.06]
    z_flat = float(flat.min()) if len(flat) else None
    m = (zz > 40) & (zz < (z_flat - 0.3 if z_flat else 56.5))
    r_min = 1 / k[m].max(); z_r = zz[m][np.argmax(k[m])]
    # front view: the cutout's height across the front (points with z > 51), binned by x
    f = cl[cl[:, 2] > 50.5]
    rise = {}
    for x0 in (0, 8, 12, 14, 16, 18, 20, 22, 24):
        mm = np.abs(f[:, 0] - x0) < 0.5
        rise[x0] = round(float(np.median(f[mm, 1])), 2) if mm.sum() else None
    sk = vskin.VSkin([M[k_] for k_ in ('triggerL', 'triggerR', 'body')], side=1)
    y_s, _ = NS.seam_phi({k_: M[k_] for k_ in M}, 1)
    lt = NS.lip_top(sk, 1.0)
    lip = lt - (y_s + 0.45)
    P = sk.xyz(NS.PHG, y_s); front = (P[:, 0] <= 20.5)
    j = np.nanargmin(np.where(front, lip, np.nan))
    return dict(y_at={z: round(float(np.interp(z, zz, ys)), 2) for z in (44, 46, 48, 50, 52, 54, 55)}, flat_from_z=z_flat,
                flat_run=round(59.55 - z_flat, 2) if z_flat else None, r_min_side=round(float(r_min), 1), r_at_z=round(float(z_r), 2),
                front_y=rise, lip_min=round(float(lip[j]), 2), lip_min_at_x=round(float(P[j, 0]), 1))
if __name__ == '__main__':
    out = {}
    for nm, fn in [('sora', '/home/claude/theseus/3d/shell/shell-sora.glb'), ('today', '/home/claude/theseus/3d/shell/shell-theseus-1seam.glb')] + \
                  [(n, '/home/claude/work/s2/build/nose/%s.glb' % n) for n in ('S_flush', 'C_flush', 'C_proud', 'L_proud', 'S_proud')]:
        out[nm] = numbers(fn); print(nm, json.dumps(out[nm]))
    json.dump(out, open('/home/claude/work/s2/nose_numbers.json', 'w'), indent=1)
