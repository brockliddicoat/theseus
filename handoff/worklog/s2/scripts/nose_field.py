"""S2 nose move: carries the trigger/body seam from where it is (re-extracted) onto a target y_new(phi) in the nose chart
(vskin: vertical axis at x 0, z ZC), for every vertex of the three meshes within FADE (surface distance up the skin) of the
seam: the band (BAND) moves whole, the rest fades out (quintic); each vertex moves at its own depth under the skin; normals
turn with the skin's profile. Optional: the body set back SETBACK mm under the lip (the 'proud lip'), full across the
front, fading out round the corner (phi PS0..PS1) and down the wall (1.0..4.5 mm under the seam).
Both sides (side -1 = the -X half, its own skin and seam). Use: run(src, dst, f_side, setback)."""
import sys, json, time
import numpy as np
from scipy.ndimage import gaussian_filter1d
sys.path.insert(0, '/home/claude/theseus/3d/shell/tools'); sys.path.insert(0, '/home/claude/work/s2/scripts')
import glbio, one_seam, seam3d, vskin, nose_seam as NS, nose_design as ND
BAND, FADE = 1.1, 4.0
PH_END0, PH_END1 = np.radians(58.0), np.radians(66.0)      # the move fades out between these (z ~47 .. ~43 on the side)
PS0, PS1 = np.radians(36.0), np.radians(52.0)               # set-back: full to |x| 18.4, gone by z ~50.4
SB_Y0, SB_Y1 = 1.0, 4.5

def q5(t): t = np.clip(t, 0, 1); return t ** 3 * (10 - 15 * t + 6 * t * t)

def load(src):
    js, b = glbio.read(src); M = {}
    for n in js['nodes']:
        if 'mesh' not in n: continue
        _, d = glbio.mesh_arrays(js, b, n['name'])
        M[n['name']] = [d['POSITION'].astype(float), d['NORMAL'].astype(float), d['COLOR_0'], d['indices'].reshape(-1, 3).astype(np.int64)]
    return js, b, M

def vnormals(P, T):
    A, B, C = P[T[:, 0]], P[T[:, 1]], P[T[:, 2]]
    fn = np.cross(B - A, C - A)
    V = np.zeros_like(P)
    for k in range(3): np.add.at(V, T[:, k], fn)
    return V / np.maximum(np.linalg.norm(V, axis=1, keepdims=True), 1e-12)

def rotate_delta(N, a, b):
    """rotate each N by the rotation taking unit a to unit b (Rodrigues)"""
    v = np.cross(a, b); s = np.linalg.norm(v, axis=1); c = (a * b).sum(1)
    k = v / np.maximum(s, 1e-12)[:, None]
    out = N * c[:, None] + np.cross(k, N) * s[:, None] + k * (k * N).sum(1)[:, None] * (1 - c)[:, None]
    bad = (np.linalg.norm(a, axis=1) < 0.5) | (np.linalg.norm(b, axis=1) < 0.5) | (c < 0.0) | ~np.isfinite(out).all(1)
    out[bad] = N[bad]
    return out / np.maximum(np.linalg.norm(out, axis=1, keepdims=True), 1e-12)

def rot_profile(N, ph, side, da):
    """turn normals by da in the vertical plane through the chart's radial direction at phi"""
    rx, rz = np.sin(ph) * side, np.cos(ph)
    nr = N[:, 0] * rx + N[:, 2] * rz; ny = N[:, 1]
    tx, tz = N[:, 0] - nr * rx, N[:, 2] - nr * rz          # the part along the horizontal tangent: unchanged
    c, s = np.cos(da), np.sin(da)
    nr2 = nr * c - ny * s; ny2 = nr * s + ny * c
    out = np.c_[tx + nr2 * rx, ny2, tz + nr2 * rz]
    return out / np.maximum(np.linalg.norm(out, axis=1, keepdims=True), 1e-9)

def run(src, dst, f_side=None, setback=0.0, report=None, y_target=None, ph_end=(58.0, 66.0)):
    t0 = time.time()
    PH_END0, PH_END1 = np.radians(ph_end[0]), np.radians(ph_end[1])
    js, b, M = load(src)
    names = ('body', 'triggerL', 'triggerR')
    S = {k: (M[k][0], M[k][1], M[k][3]) for k in names}
    P0 = {k: M[k][0].copy() for k in names}; V0 = {k: vnormals(M[k][0], M[k][3]) for k in names}
    info = {}; YN = {}
    for side in (1, -1):
        sk = vskin.VSkin([S[k] for k in names], side=side)
        y_old, _ = NS.seam_phi(S, side)
        PH = NS.PHG
        y_new = y_target(sk, side) if y_target is not None else (ND.to_phi(sk, f_side, PH) if f_side is not None else y_old.copy())
        YN[side] = y_new
        w_end = 1 - q5((PH - PH_END0) / (PH_END1 - PH_END0))
        s_old = sk.sig_at(PH, y_old); s_new = sk.sig_at(PH, y_new)
        dsig = gaussian_filter1d((s_new - s_old) * w_end, 1.5, mode='nearest')
        # extraction noise (+-0.02) is not a move: a soft dead zone below 0.04 mm
        a = np.abs(dsig); dsig = dsig * q5((a - 0.02) / 0.04)
        info['side%+d' % side] = dict(max_move=round(float(np.abs(dsig).max()), 3), at_phi=round(float(np.degrees(PH[np.argmax(np.abs(dsig))])), 1))
        for name in names:
            P, N = M[name][0], M[name][1]
            sel = np.nonzero(((P[:, 0] * side > 0) | ((P[:, 0] == 0) & (side > 0))) & (P[:, 2] > vskin.ZC + 6) & (P[:, 1] > 3.0) & (P[:, 1] < 24.0))[0]
            if not len(sel): continue
            ph, y, R = vskin.chart(P[sel], side)
            ok = (ph >= 0) & (ph < PH[-1])
            sel, ph, y, R = sel[ok], ph[ok], y[ok], R[ok]
            Ro = sk.R_at(ph, y); depth = Ro - R
            ok = (depth > -0.6) & (depth < 2.8)
            sel, ph, y, R, depth = sel[ok], ph[ok], y[ok], R[ok], depth[ok]
            sv = sk.sig_at(ph, y); ss = sk.sig_at(ph, np.interp(ph, PH, y_old))
            d = np.abs(sv - ss)
            w = np.where(d <= BAND, 1.0, 1 - q5((d - BAND) / (FADE - BAND)))
            dS = np.interp(ph, PH, dsig) * w
            mv = np.abs(dS) > 1e-6
            yn = y.copy(); Rn = R.copy()
            if mv.any():
                yn[mv] = sk.y_at_sig(ph[mv], sv[mv] + dS[mv])
                Rn[mv] = sk.R_at(ph[mv], yn[mv]) - depth[mv]
            dR = np.zeros(len(sel))
            ch = mv | (np.abs(dR) > 1e-6)
            if not ch.any(): continue
            i = sel[ch]
            P[i, 0] = side * Rn[ch] * np.sin(ph[ch]); P[i, 1] = yn[ch]; P[i, 2] = vskin.ZC + Rn[ch] * np.cos(ph[ch])
            info.setdefault('moved', {}).setdefault(name, 0)
            info['moved'][name] += int(ch.sum())
    if setback > 0:
        for side in (1, -1):
            P = M['body'][0]
            sel = np.nonzero(((P[:, 0] * side > 0) | ((P[:, 0] == 0) & (side > 0))) & (P[:, 2] > vskin.ZC + 14) & (P[:, 1] > 2.5) & (P[:, 1] < 13.5))[0]
            ph, y, R = vskin.chart(P[sel], side)
            ys = np.interp(ph, NS.PHG, YN[side])
            below = ys - y
            wy = np.where(below < -0.6, 0.0, 1 - q5((below - SB_Y0) / (SB_Y1 - SB_Y0)))
            wp = 1 - q5((ph - PS0) / (PS1 - PS0))
            dR = -setback * wy * wp
            m = np.abs(dR) > 1e-6
            i = sel[m]; Rn = R[m] + dR[m]
            P[i, 0] = side * Rn * np.sin(ph[m]); P[i, 2] = vskin.ZC + Rn * np.cos(ph[m])
            info['setback_moved_%+d' % side] = int(m.sum())
    for k in names:
        P, N, T = M[k][0], M[k][1], M[k][3]
        ch = np.nonzero(np.linalg.norm(P - P0[k], axis=1) > 1e-4)[0]
        if not len(ch): continue
        V1 = vnormals(P, T)
        a, b2 = V0[k][ch], V1[ch]
        ok = (a * b2).sum(1) > np.cos(np.radians(25))          # bigger turns are sliver faces (seam rounds, the split): keep
        r = ch[ok]
        N[r] = rotate_delta(N[r], V0[k][r], V1[r])
    rep = {k: (M[k][0].astype(np.float32), M[k][1].astype(np.float32), M[k][2], M[k][3].astype(np.uint32)) for k in M}
    one_seam.write(js, b, rep, [], dst)
    info['s'] = round(time.time() - t0, 1)
    print(json.dumps(info))
    return info
