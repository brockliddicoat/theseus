"""The shell's side profile (top line) from the GLB: max Y at each Z (silhouette) and the centreline Y(Z) at x = 0.
Prints the peak position and saves profile.json for the options sheet."""
import sys, json
import numpy as np
sys.path.insert(0, '/home/claude/work/s1/scripts')
from render import load

def silhouette_top(meshes, zs, xband=None):
    P = np.vstack([m[1] for m in meshes])
    if xband is not None: P = P[np.abs(P[:, 0]) < xband]
    out = []
    for z in zs:
        s = P[np.abs(P[:, 2] - z) < 0.35]
        out.append(s[:, 1].max() if len(s) else np.nan)
    return np.array(out)

def centreline(meshes, zs):
    """y of the outer skin at x = 0 by intersecting each triangle with the plane x = 0 (upper surface only)"""
    ys = np.full(len(zs), np.nan)
    for name, P, N, C, T in meshes:
        A, B, Cc = P[T[:, 0]], P[T[:, 1]], P[T[:, 2]]
        s = np.sign(np.stack([A[:, 0], B[:, 0], Cc[:, 0]], 1))
        cross = (s.min(1) <= 0) & (s.max(1) >= 0)
        for (a, b, c) in zip(A[cross], B[cross], Cc[cross]):
            pts = []
            for p, q in ((a, b), (b, c), (c, a)):
                if (p[0] <= 0) != (q[0] <= 0):
                    t = p[0] / (p[0] - q[0]); pts.append(p + t * (q - p))
            if len(pts) < 2: continue
            p, q = pts[0], pts[1]
            z0, z1 = sorted([p[2], q[2]])
            idx = np.where((zs >= z0) & (zs <= z1))[0]
            for i in idx:
                t = 0 if q[2] == p[2] else (zs[i] - p[2]) / (q[2] - p[2])
                y = p[1] + t * (q[1] - p[1])
                if not np.isfinite(ys[i]) or y > ys[i]: ys[i] = y
    return ys

if __name__ == '__main__':
    fn = sys.argv[1]
    M = load(fn, ['body', 'triggerL', 'triggerR'])
    zs = np.arange(-59.6, 59.6, 0.25)
    sil = silhouette_top(M, zs)
    cl = centreline(M, zs)
    i = np.nanargmax(sil); j = np.nanargmax(cl)
    zmin = min(m[1][:, 2].min() for m in M); zmax = max(m[1][:, 2].max() for m in M)
    print('length', round(zmax - zmin, 2), 'nose', round(zmax, 2), 'tail', round(zmin, 2))
    print('silhouette peak y %.2f at z %.2f (%.1f mm from the nose, %.1f %%)' % (sil[i], zs[i], zmax - zs[i], 100 * (zmax - zs[i]) / (zmax - zmin)))
    print('centreline peak y %.2f at z %.2f (%.1f mm from the nose, %.1f %%)' % (cl[j], zs[j], zmax - zs[j], 100 * (zmax - zs[j]) / (zmax - zmin)))
    # the band within 0.25 mm of the peak (how broad the hump is)
    band = zs[sil > sil[i] - 0.25]; print('within 0.25 mm of the peak: z %.1f .. %.1f' % (band.min(), band.max()))
    band = zs[sil > sil[i] - 1.0]; print('within 1.0 mm of the peak: z %.1f .. %.1f' % (band.min(), band.max()))
    json.dump({'z': zs.tolist(), 'sil': [None if not np.isfinite(v) else round(float(v), 3) for v in sil],
               'cl': [None if not np.isfinite(v) else round(float(v), 3) for v in cl], 'nose': float(zmax), 'tail': float(zmin)},
              open(sys.argv[2] if len(sys.argv) > 2 else '/home/claude/work/s1/profile.json', 'w'))
