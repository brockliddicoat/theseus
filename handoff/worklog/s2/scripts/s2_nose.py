"""S2's seam move at the nose (z Z0..Z1): section by section (planes z = const), each vertex slides along its section's outer
contour (the polar envelope from (0, YC) with the seam's gap closed) by w * dsigma, at its own depth under the contour, where
dsigma carries the seam from where it is now (re-extracted from the mesh) to the design's height (front.design_C); w = 1 within
BAND of the seam along the contour, a quintic fade to 0 at FADE. Run after s2_seam (the polar field, z <= 50)."""
import sys, json, time
import numpy as np
from scipy.ndimage import gaussian_filter1d, grey_closing
sys.path.insert(0, '/home/claude/theseus/3d/shell/tools'); sys.path.insert(0, '/home/claude/work/s2/scripts')
import glbio, one_seam
import front as FR
from seam3d import seam_line
YC, Z0, Z1, DZ = 5.0, 45.0, 54.8, 0.05
BAND, FADE = 0.75, 4.0
TH = np.radians(np.arange(2.0, 89.5, 0.02))

def q5(t): t = np.clip(t, 0, 1); return t ** 3 * (10 - 15 * t + 6 * t * t)

def tri_sections(M, zk):
    """the outer envelope rho(theta) of the union of the meshes' sections at each zk, per side, gap closed"""
    out = {}
    for side in (1, -1):
        R = np.full((len(zk), len(TH)), np.nan)
        for P, T in M:
            A, B, C = P[T[:, 0]], P[T[:, 1]], P[T[:, 2]]
            zmin = np.minimum(np.minimum(A[:, 2], B[:, 2]), C[:, 2]); zmax = np.maximum(np.maximum(A[:, 2], B[:, 2]), C[:, 2])
            sel = (zmax > zk[0]) & (zmin < zk[-1]) & (np.maximum(np.maximum(A[:, 0], B[:, 0]), C[:, 0]) * side > -0.5)
            A, B, C, zmin, zmax = A[sel], B[sel], C[sel], zmin[sel], zmax[sel]
            for k, z0 in enumerate(zk):
                m = (zmin < z0) & (zmax > z0)
                if not m.any(): continue
                a, b, c = A[m], B[m], C[m]
                pts = []
                for p, q in ((a, b), (b, c), (c, a)):
                    dp, dq = p[:, 2] - z0, q[:, 2] - z0; cr = (dp < 0) != (dq < 0)
                    t = dp[cr] / (dp[cr] - dq[cr]); pts.append(p[cr][:, :2] + t[:, None] * (q[cr][:, :2] - p[cr][:, :2]))
                S = np.vstack(pts) if pts else np.zeros((0, 2))
                # segments are pairs of consecutive crossings per triangle: rebuild them
                segs = []
                for p, q, r_ in ((a, b, c),):
                    pass
                X = S[:, 0] * side; Y = S[:, 1] - YC
                th = np.arctan2(Y, X); rr = np.hypot(X, Y)
                ii = np.clip(np.round((th - TH[0]) / (TH[1] - TH[0])).astype(int), 0, len(TH) - 1)
                cur = R[k]
                np.fmax.at(cur, ii, rr) if hasattr(np.fmax, 'at') else None
                for i_, r_ in zip(ii, rr):
                    if not (cur[i_] >= r_): cur[i_] = r_
                R[k] = cur
        # fill empty angle bins, close the seam's gap (0.9 mm), light smoothing
        for k in range(len(zk)):
            r = R[k]; ok = np.isfinite(r)
            if ok.sum() < 10: continue
            r = np.interp(np.arange(len(TH)), np.nonzero(ok)[0], r[ok])
            r = grey_closing(r, size=41)
            R[k] = gaussian_filter1d(r, 4)
        R = gaussian_filter1d(R, 3.0, axis=0, mode='nearest')     # section-to-section jitter out (0.15 mm in z)
        out[side] = R
    return out

def contour_xy(r):
    return np.c_[r * np.cos(TH), YC + r * np.sin(TH)]

def arclen(P):
    return np.r_[0, np.cumsum(np.linalg.norm(np.diff(P, axis=0), axis=1))]

def run(src, dst, report=None):
    t0 = time.time()
    js, b = glbio.read(src); M = {}
    for n in js['nodes']:
        if 'mesh' not in n: continue
        _, d = glbio.mesh_arrays(js, b, n['name'])
        M[n['name']] = [d['POSITION'].astype(float), d['NORMAL'].astype(float), d['COLOR_0'], d['indices'].reshape(-1, 3).astype(np.int64)]
    zk = np.arange(Z0, Z1 + 1e-9, DZ)
    meshes = [(M[k][0], M[k][3]) for k in ('body', 'triggerL', 'triggerR')]
    ENV = tri_sections(meshes, zk)
    fC, _ = FR.design_C()
    # the seam now (both sides), binned per section: its theta
    seamM = {'triggerL': (M['triggerL'][0], M['triggerL'][1], M['triggerL'][3]), 'triggerR': (M['triggerR'][0], M['triggerR'][1], M['triggerR'][3]), 'body': (M['body'][0], M['body'][1], M['body'][3])}
    info = {}
    DS = {}
    for side, tk in ((1, 'L'), (-1, 'R')):
        cl = seam_line(seamM, tk); cl = cl[(cl[:, 2] > Z0 - 1) & (cl[:, 0] * side > 3)]
        th_s = np.full(len(zk), np.nan); ds = np.zeros(len(zk))
        for k, z0 in enumerate(zk):
            m = np.abs(cl[:, 2] - z0) < 0.3
            if not m.any(): continue
            p = cl[m].mean(0); th0 = np.arctan2(p[1] - YC, p[0] * side)
            r = ENV[side][k]
            if not np.isfinite(r).all(): continue
            P = contour_xy(r); s = arclen(P)
            i0 = np.argmin(np.abs(TH - th0)); s0 = s[i0]
            yt = float(fC(z0))
            # the target: along the contour from the seam, the first point at the design's height (search both ways, nearest)
            y = P[:, 1]; cand = np.nonzero(np.diff(np.sign(y - yt)) != 0)[0]
            if not len(cand): continue
            j = cand[np.argmin(np.abs(s[cand] - s0))]
            f = (yt - y[j]) / (y[j + 1] - y[j]); s1 = s[j] + f * (s[j + 1] - s[j])
            th_s[k] = th0; ds[k] = s1 - s0
        ok = np.isfinite(th_s)
        ds = np.where(ok, ds, 0.0)
        ds = gaussian_filter1d(ds, 4)
        w_end = q5((zk - Z0) / 1.0) * q5((Z1 - zk) / 1.2)          # nothing moves at the two ends of the range
        ds *= w_end
        th_s = np.interp(np.arange(len(zk)), np.nonzero(ok)[0], th_s[ok])
        DS[side] = (th_s, ds)
        info[tk] = dict(max_ds=round(float(np.abs(ds).max()), 3), at_z=round(float(zk[np.argmax(np.abs(ds))]), 2))
    PC = {}
    def contour_k(side, k):
        if (side, k) not in PC:
            r = ENV[side][k]; Pc = contour_xy(r); s = arclen(Pc)
            v = np.gradient(Pc, axis=0); ang = np.unwrap(np.arctan2(v[:, 1], v[:, 0]))
            PC[(side, k)] = (r, Pc, s, ang)
        return PC[(side, k)]
    def move_one(x, y, z, side, k):
        th_s, ds = DS[side]
        if abs(ds[k]) < 1e-5 or not np.isfinite(ENV[side][k]).all(): return None
        r, Pc, s, ang = contour_k(side, k)
        th_v = np.arctan2(y - YC, x * side); rho_v = np.hypot(x * side, y - YC)
        if th_v < TH[0] or th_v > TH[-1]: return None
        sv = np.interp(th_v, TH, s); s0 = np.interp(th_s[k], TH, s)
        rc = np.interp(th_v, TH, r); depth = rc - rho_v
        if depth > 3.0 or depth < -0.5: return None
        d = abs(sv - s0); w = 1.0 if d <= BAND else 1 - q5((d - BAND) / (FADE - BAND))
        if w <= 0: return None
        s1 = sv + w * ds[k]
        th1 = np.interp(s1, s, TH); r1 = np.interp(th1, TH, r) - depth
        da = np.interp(th1, TH, ang) - np.interp(th_v, TH, ang)
        return (side * r1 * np.cos(th1), YC + r1 * np.sin(th1), None, None, da)
    moved = {}
    for name in ('body', 'triggerL', 'triggerR'):
        P, N = M[name][0], M[name][1]
        sel = np.nonzero((P[:, 2] > Z0) & (P[:, 2] < Z1))[0]; cnt = 0
        for i in sel:
            x, y, z = P[i]; side = 1 if x >= 0 else -1
            fk = (z - Z0) / DZ; k0 = int(np.floor(fk)); fr = fk - k0
            ks = (min(max(k0, 0), len(zk) - 1), min(max(k0 + 1, 0), len(zk) - 1))
            res = [move_one(x, y, z, side, k) for k in ks]
            if res[0] is None and res[1] is None: continue
            res = [r_ if r_ is not None else (x, y, None, None, 0.0) for r_ in res]
            nx_ = (1 - fr) * res[0][0] + fr * res[1][0]; ny_ = (1 - fr) * res[0][1] + fr * res[1][1]
            da = (1 - fr) * res[0][4] + fr * res[1][4]
            P[i, 0], P[i, 1] = nx_, ny_
            n0x, n0y = N[i, 0] * side, N[i, 1]
            N[i, 0] = side * (n0x * np.cos(da) - n0y * np.sin(da)); N[i, 1] = n0x * np.sin(da) + n0y * np.cos(da)
            N[i] /= np.linalg.norm(N[i]); cnt += 1
        moved[name] = cnt
    info['moved'] = moved
    rep = {k: (M[k][0].astype(np.float32), M[k][1].astype(np.float32), M[k][2], M[k][3].astype(np.uint32)) for k in M}
    size = one_seam.write(js, b, rep, [], dst)
    info['s'] = round(time.time() - t0, 1)
    print(json.dumps(info))
    return info

if __name__ == '__main__':
    run(sys.argv[1], sys.argv[2])
