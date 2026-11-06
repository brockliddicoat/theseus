"""S2: the rim's crease onto Brock's 1.75 deg line in 3D (body only). Per section z (0.2 mm) and wall, the outer profile x(y)
is reshaped as rim_line.section_change('hold') does it, with the chamfer's foot at the section's own lowest outer point (so the
tail's bottom edge stays put): where the line is above the scan's crease the chamfer runs straight from its foot to the wall at
the line; where it is below, the wall is carried straight down from the old crease to the line and the chamfer runs from its
foot to there. Every body vertex within 2.2 mm of the outer skin moves sideways by the profile's change at its height (the wall
keeps its thickness; heights and z never change, so the side view cannot change). Normals: geometric delta.
python3 rim_build.py <src.glb> <dst.glb>"""
import sys, json, time, os
import numpy as np
from scipy.ndimage import gaussian_filter1d
sys.path.insert(0, '/home/claude/theseus/3d/shell/tools'); sys.path.insert(0, '/home/claude/work/s2/scripts')
import glbio, one_seam
os.environ.setdefault('RIM_DEG', '1.75')
import crease_fit as CF
J = json.load(open('/home/claude/work/s2/crease_line_175.json'))
C0, SL = J['y0'], J['slope']; ZT, ZN = J['meets_outline']['tail'][0], J['meets_outline']['nose'][0]
CR = json.load(open('/home/claude/work/s1/crease_side.json')); cz, cy = np.array(CR['z']), np.array(CR['y'])
line = lambda z: C0 + SL * z
scan = lambda z: np.interp(z, cz, cy)
YS = np.arange(0.0, 14.0001, 0.05)
TAIL_FULL, NOSE_FULL, TAPER, DX_CAP = -55.5, 52.0, 2.0, 1.2
DZ = 0.2
def q5(t): t = np.clip(t, 0, 1); return t ** 3 * (10 - 15 * t + 6 * t * t)
def profiles(P, T, zs, side):
    """outer profile x(y) (largest |x| on this side at each height) per section; nan where the section has no wall"""
    A, B, C = P[T[:, 0]], P[T[:, 1]], P[T[:, 2]]
    out = np.full((len(zs), len(YS)), np.nan)
    zmin = np.minimum(np.minimum(A[:, 2], B[:, 2]), C[:, 2]); zmax = np.maximum(np.maximum(A[:, 2], B[:, 2]), C[:, 2])
    keep = (zmax > zs[0] - 0.1) & (zmin < zs[-1] + 0.1) & (np.minimum(np.minimum(A[:, 1], B[:, 1]), C[:, 1]) < 14.5) & \
           (np.maximum(np.maximum(A[:, 0] * side, B[:, 0] * side), C[:, 0] * side) > 0)
    A, B, C, zmin, zmax = A[keep], B[keep], C[keep], zmin[keep], zmax[keep]
    for k, z0 in enumerate(zs):
        m = (zmin < z0) & (zmax > z0)
        a, b, c = A[m], B[m], C[m]
        da, db, dc = a[:, 2] - z0, b[:, 2] - z0, c[:, 2] - z0
        segs = []
        for p, q, dp, dq in ((a, b, da, db), (b, c, db, dc), (c, a, dc, da)):
            cr = (dp < 0) != (dq < 0)
            t = dp[cr] / (dp[cr] - dq[cr]); segs.append((cr, p[cr][:, :2] + t[:, None] * (q[cr][:, :2] - p[cr][:, :2])))
        # each triangle crossing z gives two points: pair them per triangle
        n = len(a); pts = np.full((n, 2, 2), np.nan); cnt = np.zeros(n, int)
        for cr, X in segs:
            idx = np.nonzero(cr)[0]
            for j, i in enumerate(idx):
                if cnt[i] < 2: pts[i, cnt[i]] = X[j]; cnt[i] += 1
        S = pts[cnt == 2]
        S = S[(S[:, :, 0] * side > 0).any(1)]
        x0, y0, x1, y1 = np.abs(S[:, 0, 0]), S[:, 0, 1], np.abs(S[:, 1, 0]), S[:, 1, 1]
        lo, hi = np.minimum(y0, y1), np.maximum(y0, y1)
        Y = YS[:, None]
        span = (Y >= lo[None]) & (Y <= hi[None]) & (hi - lo > 1e-9)[None]
        t = (Y - y0[None]) / np.where(np.abs(y1 - y0) > 1e-12, (y1 - y0), 1)[None]
        X = x0[None] + t * (x1 - x0)[None]
        X = np.where(span, X, -np.inf); xm = X.max(1)
        out[k] = np.where(np.isfinite(xm), xm, np.nan)
    return out
def new_profile(z, xs):
    """the 'hold' reshape of one section's outer profile; returns dx(y) and info"""
    ok = np.isfinite(xs)
    if ok.sum() < 20: return np.zeros(len(YS)), None
    i_b = np.nonzero(ok)[0][0]; yb = max(YS[i_b], 0.7); xb = np.interp(yb, YS[ok], xs[ok])
    yc, yn = float(scan(z)), float(line(z))
    if yn <= yb + 0.05: return np.zeros(len(YS)), dict(z=z, yb=yb, yc=yc, yn=yn, note='line at/below the foot')
    xo = np.interp(YS, YS[ok], xs[ok])
    if yn >= yc:
        xl = np.interp(yn, YS, xo); seg = xb + (xl - xb) * (YS - yb) / (yn - yb)
        new = np.where((YS >= yb) & (YS <= yn), np.minimum(xo, seg), xo)
    else:
        xc = np.interp(yc, YS, xo)
        seg = xb + (xc - xb) * (YS - yb) / (yn - yb)
        new = np.where((YS >= yb) & (YS <= yn), seg, np.where((YS > yn) & (YS <= yc), np.maximum(xo, xc), xo))
    dx = np.where(ok & (YS >= yb), new - xo, 0.0)
    return dx, dict(z=z, yb=yb, yc=yc, yn=yn, dxmin=float(dx.min()), dxmax=float(dx.max()), wid0=float(np.nanmax(xs)), wid1=float(np.nanmax(np.where(ok, xo + dx, np.nan))))
def run(src, dst):
    t0 = time.time()
    js, b = glbio.read(src); M = {}
    for n in js['nodes']:
        if 'mesh' not in n: continue
        _, d = glbio.mesh_arrays(js, b, n['name'])
        M[n['name']] = [d['POSITION'].astype(float), d['NORMAL'].astype(float), d['COLOR_0'], d['indices'].reshape(-1, 3).astype(np.int64)]
    P, N, T = M['body'][0], M['body'][1], M['body'][3]
    P0 = P.copy()
    import nose_field as NF
    V0 = NF.vnormals(P, T)
    zs = np.arange(ZT - 0.6, ZN + 0.6 + 1e-9, DZ)
    info = dict(sections=len(zs))
    for side in (1, -1):
        XO = profiles(P0, T, zs, side)
        DX = np.zeros_like(XO); widen = 0.0; rows = []
        for k, z in enumerate(zs):
            if z < ZT or z > ZN: continue
            dx, r = new_profile(z, XO[k]); DX[k] = dx
            if r and 'wid1' in r: widen = max(widen, r['wid1'] - r['wid0']); rows.append(r)
        # the z-sections cut a wall only between the tail's and the nose's big rounds: full change for TAIL_FULL..NOSE_FULL,
        # eased to nothing over TAPER mm beyond (there the 3D keeps the scan's surface); smooth section to section
        w = q5((zs - (TAIL_FULL - TAPER)) / TAPER) * q5(((NOSE_FULL + TAPER) - zs) / TAPER)
        DX = np.clip(DX, -DX_CAP, DX_CAP)
        DX = gaussian_filter1d(DX * w[:, None], 1.5, axis=0, mode='nearest')
        XOf = np.where(np.isfinite(XO), XO, -1e9)
        sel = np.nonzero((P0[:, 0] * side > 0) & (P0[:, 2] > zs[0]) & (P0[:, 2] < zs[-1]) & (P0[:, 1] < 13.9))[0]
        fz = (P0[sel, 2] - zs[0]) / DZ; k0 = np.clip(np.floor(fz).astype(int), 0, len(zs) - 2); f = fz - k0
        fy = P0[sel, 1] / 0.05; j0 = np.clip(np.floor(fy).astype(int), 0, len(YS) - 2); g = fy - j0
        def bil(G):
            return ((1 - f) * ((1 - g) * G[k0, j0] + g * G[k0, j0 + 1]) + f * ((1 - g) * G[k0 + 1, j0] + g * G[k0 + 1, j0 + 1]))
        dxv = bil(DX); xo = bil(XOf)
        depth = xo - np.abs(P0[sel, 0])
        wd = np.where(depth < -0.3, 0.0, 1 - q5((depth - 1.6) / 0.6))
        mv = np.abs(dxv * wd) > 1e-6
        i = sel[mv]
        P[i, 0] = side * (np.abs(P0[i, 0]) + (dxv * wd)[mv])
        info['side%+d' % side] = dict(moved=int(mv.sum()), dx_min=round(float(DX.min()), 3), dx_max=round(float(DX.max()), 3), widest_change=round(widen, 3))
    ch = np.nonzero(np.linalg.norm(P - P0, axis=1) > 1e-5)[0]
    V1 = NF.vnormals(P, T)
    okn = (V0[ch] * V1[ch]).sum(1) > np.cos(np.radians(45)); r = ch[okn]
    N[r] = NF.rotate_delta(N[r], V0[r], V1[r])
    rep = {k: (M[k][0].astype(np.float32), M[k][1].astype(np.float32), M[k][2], M[k][3].astype(np.uint32)) for k in M}
    one_seam.write(js, b, rep, [], dst)
    info['s'] = round(time.time() - t0, 1); print(json.dumps(info)); return info
if __name__ == '__main__':
    run(sys.argv[1], sys.argv[2])
