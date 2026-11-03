"""Trace seam centerlines from scan high-pass depth maps -> work/seams_scan.json (world mm)."""
import sys, json, numpy as np, cv2
from scipy.ndimage import gaussian_filter1d
from scipy.interpolate import UnivariateSpline
from PIL import Image
PX = 10.0
def load(view):
    d = np.load(f'work/scan_dm_{view}.npz'); return d['hp'], d['dep'], d
def img2w(d, px, py, dep):
    H, W = dep.shape
    x = (px + 0.5 - W/2)/PX; y = -(py + 0.5 - H/2)/PX
    return d['c'] + x[:,None]*d['r'][None] + y[:,None]*d['u'][None] + dep[:,None]*d['f'][None]
def peak_along(hp, idx_fixed, lo, hi, axis):
    """for each fixed index (row or col), argmax of hp in [lo,hi] along the other axis, with subpixel refinement."""
    out = []
    for k in idx_fixed:
        prof = hp[k, lo:hi] if axis == 1 else hp[lo:hi, k]
        prof = np.nan_to_num(prof, nan=-1)
        j = int(np.argmax(prof))
        if 0 < j < len(prof)-1:
            a, b, c = prof[j-1], prof[j], prof[j+1]; den = a - 2*b + c
            off = 0.5*(a - c)/den if abs(den) > 1e-9 else 0
        else: off = 0
        out.append((lo + j + off, prof[j]))
    return np.array(out)
res = {}
# ---------- TOP map: center split and hump seam ----------
hp, dep, d = load('top'); H, W = dep.shape
# world X of image column: x_world = -(px+0.5-W/2)/PX ; world Z of row: z = -(py+0.5-H/2)/PX
colX = lambda px: -(px + 0.5 - W/2)/PX
rowZ = lambda py: -(py + 0.5 - H/2)/PX
X2col = lambda X: W/2 - 0.5 - X*PX
Z2row = lambda Z: H/2 - 0.5 - Z*PX
# center split: rows from z=+58 to z=+4 ; search x in [-2, 2] mm
rows = np.arange(int(Z2row(57)), int(Z2row(5)))
pk = peak_along(hp, rows, int(X2col(2.5)), int(X2col(-2.5)), axis=1)
zs = rowZ(rows); xs = colX(pk[:,0]); st = pk[:,1]
ok = st > 0.03
res['center_split_samples'] = np.c_[xs[ok], zs[ok], st[ok]].tolist()
A = np.polyfit(zs[ok], xs[ok], 1)
res['center_split_line_x_of_z'] = A.tolist()
print('center split x = %.3f + %.4f z  (n=%d)' % (A[1], A[0], ok.sum()))
# hump seam: columns from x=-27 to 27, search z in [-12, 12]
cols = np.arange(int(X2col(27)), int(X2col(-27)))
pk = peak_along(hp, cols, int(Z2row(14)), int(Z2row(-14)), axis=0)
xh = colX(cols); zh = rowZ(pk[:,0]); sth = pk[:,1]
ok = (sth > 0.03) & (np.abs(xh) > 1.2)
res['hump_seam_samples'] = np.c_[xh[ok], zh[ok], sth[ok]].tolist()
print('hump seam z range', zh[ok].min(), zh[ok].max(), 'at x=0 ~', np.interp(0, xh[ok][::-1] if xh[0]>xh[-1] else xh[ok], zh[ok][::-1] if xh[0]>xh[-1] else zh[ok]))
# wheel opening: rows/cols where depth drops (opening) - use hp large negative/positive region near center
# ---------- side maps: trigger side seam y(z) ----------
for view, sgn in (('px', 1), ('nx', -1)):
    hp, dep, d = load(view); H, W = dep.shape
    # image x -> world Z: for px: r = -Z => Z = -(px+0.5-W/2)/PX ; for nx: r=+Z
    colZ = (lambda px: -(px + 0.5 - W/2)/PX) if sgn == 1 else (lambda px: (px + 0.5 - W/2)/PX)
    Z2c = (lambda Z: W/2 - 0.5 - Z*PX) if sgn == 1 else (lambda Z: W/2 - 0.5 + Z*PX)
    rowY = lambda py: 20 - (py + 0.5 - H/2)/PX
    Y2r = lambda Y: H/2 - 0.5 - (Y - 20)*PX
    samples = []
    for Z in np.arange(-4.0, 57.0, 0.25):
        c = int(round(Z2c(Z)))
        # expected seam height: between y=10 and y=30
        lo, hi = int(Y2r(31)), int(Y2r(9))
        prof = np.nan_to_num(hp[lo:hi, c], nan=-1)
        # multiple grooves (side buttons): take the topmost strong groove below the silhouette top
        j = int(np.argmax(prof)); 
        samples.append((float(Z), float(rowY(lo + j)), float(prof[j])))
    res[f'side_seam_{view}_samples'] = samples
    print(view, 'seam samples', len(samples))
json.dump(res, open('work/seams_scan_raw.json', 'w'))
