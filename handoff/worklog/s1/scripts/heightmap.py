"""The shell's top surface as a height map y(x, z) seen from above (upper envelope of the outer skin), with the seams'
grooves closed and the wheel opening filled by the crown on either side. Used to get a smooth side profile (the centre
line) for the hump warp, and the surface round the wheel for the opening's footprint.

    hm = HeightMap(meshes); hm.y(x, z); hm.centre(z)
"""
import sys
import numpy as np, cv2
from scipy.ndimage import grey_closing, gaussian_filter
from scipy.interpolate import RegularGridInterpolator
sys.path.insert(0, '/home/claude/work/s1/scripts')

class HeightMap:
    def __init__(self, meshes, res=0.1, x0=-33, x1=33, z0=-62, z1=62, fill_opening=(-5.6, 5.6, 26.5, 48.5)):
        self.res = res
        self.xs = np.arange(x0, x1 + 1e-9, res); self.zs = np.arange(z0, z1 + 1e-9, res)
        W, H = len(self.xs), len(self.zs)
        Y = np.full((H, W), -1.0, np.float32)
        for name, P, N, C, T in meshes:
            A, B, Cc = P[T[:, 0]], P[T[:, 1]], P[T[:, 2]]
            up = np.cross(B - A, Cc - A)[:, 1] > 0
            for tri in T[up]:
                p = P[tri]
                gx = (p[:, 0] - x0) / res; gz = (p[:, 2] - z0) / res
                i0, i1 = int(np.ceil(gz.min())), int(np.floor(gz.max())); j0, j1 = int(np.ceil(gx.min())), int(np.floor(gx.max()))
                if i1 < i0 or j1 < j0: continue
                i0 = max(i0, 0); j0 = max(j0, 0); i1 = min(i1, H - 1); j1 = min(j1, W - 1)
                II, JJ = np.meshgrid(np.arange(i0, i1 + 1), np.arange(j0, j1 + 1), indexing='ij')
                (xa, xb, xc), (za, zb, zc) = gx, gz
                den = (zb - zc) * (xa - xc) + (xc - xb) * (za - zc)
                if abs(den) < 1e-12: continue
                l0 = ((zb - zc) * (JJ - xc) + (xc - xb) * (II - zc)) / den
                l1 = ((zc - za) * (JJ - xc) + (xa - xc) * (II - zc)) / den
                l2 = 1 - l0 - l1
                m = (l0 >= -1e-6) & (l1 >= -1e-6) & (l2 >= -1e-6)
                if not m.any(): continue
                y = l0 * p[0, 1] + l1 * p[1, 1] + l2 * p[2, 1]
                ii, jj, yy = II[m], JJ[m], y[m]
                upd = yy > Y[ii, jj]
                Y[ii[upd], jj[upd]] = yy[upd]
        self.raw = Y.copy()
        inside = Y > 0
        # close the seams' grooves (up to ~0.9 mm across) where there is skin round them
        Yc = grey_closing(np.where(inside, Y, 0), size=(9, 9))
        Yc = np.where(inside | (Yc > 0), np.maximum(Y, Yc), -1)
        # the wheel opening: replace by a smooth crown fitted on its two sides, row by row (z)
        if fill_opening is not None:
            xa, xb, za, zb = fill_opening
            ja, jb = np.searchsorted(self.xs, [xa, xb]); ia, ib = np.searchsorted(self.zs, [za, zb])
            for i in range(ia, ib + 1):
                row = Yc[i]
                side = (np.abs(self.xs) > 5.0) & (np.abs(self.xs) < 7.5) & (row > 0)
                if side.sum() < 10: continue
                A = np.c_[self.xs[side] ** 2, np.ones(side.sum())]
                c2, c0 = np.linalg.lstsq(A, row[side], rcond=None)[0]
                fit = c2 * self.xs[ja:jb + 1] ** 2 + c0
                seg = row[ja:jb + 1]
                hole = (seg < fit - 0.6) | (seg <= 0)              # only where the opening (or the bay under it) shows
                seg[hole] = fit[hole]
                Yc[i, ja:jb + 1] = seg
        self.Y = Yc
        self._f = RegularGridInterpolator((self.zs, self.xs), np.where(self.Y > 0, self.Y, np.nan), bounds_error=False, fill_value=np.nan)

    def y(self, x, z):
        x = np.atleast_1d(np.asarray(x, float)); z = np.broadcast_to(np.atleast_1d(np.asarray(z, float)), x.shape)
        return self._f(np.c_[z, x])

    def centre(self, zq=None, sigma=1.0):
        """the centre line y(z): the upper envelope at x = 0 (split groove closed), smoothed by sigma mm"""
        j = np.argmin(np.abs(self.xs))
        col = self.Y[:, j - 2:j + 3].max(1)
        ok = col > 0
        z, h = self.zs[ok], col[ok]
        hs = gaussian_filter(h, sigma / self.res, mode='nearest') if sigma else h
        if zq is None: return z, hs
        return np.interp(zq, z, hs)

if __name__ == '__main__':
    import json
    from render import load
    fn = sys.argv[1] if len(sys.argv) > 1 else '/home/claude/theseus/3d/shell/shell-theseus-1seam.glb'
    M = load(fn, ['body', 'triggerL', 'triggerR'])
    hm = HeightMap(M)
    np.savez_compressed('/home/claude/work/s1/heightmap_ths.npz', xs=hm.xs, zs=hm.zs, Y=hm.Y, raw=hm.raw)
    z, h = hm.centre(sigma=0.0)
    zz, hs = hm.centre(sigma=1.5)
    i = np.argmax(hs)
    print('centre apex %.2f at z %.2f; nose z %.2f tail z %.2f' % (hs[i], zz[i], zz.max(), zz.min()))
    json.dump({'z': zz.round(3).tolist(), 'sil': hs.round(4).tolist(), 'raw': h.round(4).tolist(), 'nose': float(zz.max()), 'tail': float(zz.min())},
              open('/home/claude/work/s1/profile_centre.json', 'w'))
