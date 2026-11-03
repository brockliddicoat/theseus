"""Stage 1: exterior signed-distance field (negative inside), 0.25 mm grid -> work/ext.npz

  python3 build/s01_exterior.py                       # Brock's scan (default): mirror the button-free half, close seams,
                                                       #   patch the wheel slot and USB port, flat bottom, light blur
  python3 build/s01_exterior.py --exterior ../shell/<clean>.ply --clean   # the shell builder's clean surface: no fixes
"""
import argparse, time, numpy as np, igl
from scipy.ndimage import gaussian_filter, grey_opening, zoom
from common import *

ap = argparse.ArgumentParser()
ap.add_argument('--exterior', default=SCAN_NPZ)
ap.add_argument('--clean', action='store_true', help='input is already clean: skip mirror/closing/patches')
ap.add_argument('--h', type=float, default=0.25)
ap.add_argument('--blur', type=float, default=0.30, help='gaussian sigma in mm (0 = none)')
a = ap.parse_args()
V, F = load_exterior_mesh(a.exterior)
h = a.h
lo = V.min(0) - 2.5; hi = V.max(0) + 2.5
lo[1] = min(lo[1], -1.5)
n = np.ceil((hi - lo) / h).astype(int) + 1
# symmetric x axis so mirroring is an index flip
nx = n[0] | 1; xs = h * (np.arange(nx) - (nx - 1) / 2)
ys = lo[1] + h * np.arange(n[1]); zs = lo[2] + h * np.arange(n[2])
o = np.array([xs[0], ys[0], zs[0]]); shape = (nx, n[1], n[2])
print('grid', shape, np.prod(shape) / 1e6, 'M pts')

def sdf(P):
    out = np.empty(len(P))
    for i in range(0, len(P), 300000):
        out[i:i + 300000] = igl.signed_distance(P[i:i + 300000], V, F, sign_type=4)[0]
    return out

t0 = time.time()
# coarse pass (1 mm) to find the band, then exact values only within 9 mm of the surface
c = 4
cx, cy, cz = xs[::c], ys[::c], zs[::c]
CX, CY, CZ = np.meshgrid(cx, cy, cz, indexing='ij')
Sc = sdf(np.stack([CX.ravel(), CY.ravel(), CZ.ravel()], 1)).reshape(CX.shape)
S = zoom(Sc, [shape[i] / Sc.shape[i] for i in range(3)], order=1).astype(np.float32)
S = S[:shape[0], :shape[1], :shape[2]]
X, Y, Z = np.meshgrid(xs, ys, zs, indexing='ij')
band = np.abs(S) < 9.0
print('band', band.mean(), 'coarse', time.time() - t0)
S[band] = sdf(np.stack([X[band], Y[band], Z[band]], 1))
print('exact', time.time() - t0)

if not a.clean:
    # 1) mirror: the scan's -X half has no side buttons -> use it for both sides (the Sora is symmetric)
    S = np.where(X < 0, S, S[::-1, :, :])
    # 2) close seams narrower than ~1.6 mm (trigger seams, center split): grey opening of f == closing of the solid
    r = 0.8 / h; k = int(np.ceil(r))
    gx, gy, gz = np.mgrid[-k:k + 1, -k:k + 1, -k:k + 1]
    ball = gx * gx + gy * gy + gz * gz <= r * r + 1e-6
    S = grey_opening(S, footprint=ball).astype(np.float32)
    print('closing', time.time() - t0)
    # 3) wheel slot + front notch: replace the top by a smooth height field across |x| < 6.5
    zi = np.where((zs > 20) & (zs < 59))[0]
    H = np.full((nx, len(zs)), np.nan)
    for j in zi:
        col = S[:, :, j]                       # (nx, ny)
        for i in range(nx):
            if abs(xs[i]) > 14: continue
            s = col[i]; neg = np.where(s < 0)[0]
            if len(neg) == 0: continue
            top = neg.max()
            if top + 1 < len(ys):
                s0, s1 = s[top], s[top + 1]; H[i, j] = ys[top] + h * s0 / (s0 - s1)
    Hf = H.copy()
    for j in zi:
        sel = (np.abs(xs) >= 6.5) & (np.abs(xs) <= 13) & np.isfinite(H[:, j])
        if sel.sum() < 6: continue
        A = np.stack([np.ones(sel.sum()), xs[sel] ** 2, xs[sel] ** 4], 1)
        cfit = np.linalg.lstsq(A, H[sel, j], rcond=None)[0]
        ins = np.abs(xs) < 6.6
        Hf[ins, j] = cfit[0] + cfit[1] * xs[ins] ** 2 + cfit[2] * xs[ins] ** 4
    Hf = np.where(np.isfinite(Hf), Hf, np.nanmax(np.nan_to_num(Hf, nan=-99)))
    Hz = np.gradient(Hf, h, axis=1); Hx = np.gradient(Hf, h, axis=0)
    nrm = np.sqrt(1 + Hx ** 2 + Hz ** 2)
    Sp = (Y - Hf[:, None, :]) / nrm[:, None, :]
    w = (1 - smoothstep(5.0, 6.5, np.abs(X))) * smoothstep(22.5, 24.0, Z) * (1 - smoothstep(56.0, 57.6, Z))
    # through the full depth only over the wheel slot; in front of it only near the top surface (the nose is below)
    w = w * np.maximum(1 - smoothstep(48.5, 50.0, Z), smoothstep(Hf[:, None, :] - 5.0, Hf[:, None, :] - 3.0, Y))
    S = ((1 - w) * S + w * Sp).astype(np.float32)
    # 4) USB-C port in the nose: replace the front face by a smooth z(x, y) field across |x| < 6.5, 1.5 < y < 9.5
    yi = np.where((ys > 0.5) & (ys < 11.0))[0]
    Zf = np.full((nx, len(ys)), np.nan)
    for j in yi:
        for i in range(nx):
            if abs(xs[i]) > 13: continue
            s = S[i, j, :]; neg = np.where(s < 0)[0]
            if len(neg) == 0: continue
            fr = neg.max()
            if fr + 1 < len(zs):
                s0, s1 = s[fr], s[fr + 1]; Zf[i, j] = zs[fr] + h * s0 / (s0 - s1)
    Zff = Zf.copy()
    for j in yi:
        sel = (np.abs(xs) >= 6.0) & (np.abs(xs) <= 9.5) & np.isfinite(Zf[:, j])
        if sel.sum() < 6: continue
        A = np.stack([np.ones(sel.sum()), xs[sel] ** 2], 1)
        cfit = np.linalg.lstsq(A, Zf[sel, j], rcond=None)[0]
        ins = np.abs(xs) < 6.6
        Zff[ins, j] = cfit[0] + cfit[1] * xs[ins] ** 2
    Zff = np.where(np.isfinite(Zff), Zff, np.nanmax(np.nan_to_num(Zff, nan=-99)))
    Zx = np.gradient(Zff, h, axis=0); Zy = np.gradient(Zff, h, axis=1)
    Sf = (Z - Zff[:, :, None]) / np.sqrt(1 + Zx ** 2 + Zy ** 2)[:, :, None]
    wf = (1 - smoothstep(5.0, 6.5, np.abs(X))) * smoothstep(2.0, 2.4, Y) * (1 - smoothstep(8.6, 9.6, Y)) * smoothstep(50, 52, Z)
    S = ((1 - wf) * S + wf * Sf).astype(np.float32)
    print('patches', time.time() - t0)

# flat bottom face (the shell's underside rim, skates below it)
S = np.maximum(S, (P['y_bottom'] - Y).astype(np.float32))
if a.blur > 0:
    S = gaussian_filter(S, a.blur / h).astype(np.float32)
Grid(S, o, h).save(os.path.join(WORK, 'ext.npz'))
print('saved work/ext.npz', time.time() - t0)
