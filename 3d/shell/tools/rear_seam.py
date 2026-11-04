#!/usr/bin/env python3
"""The rear trigger cutout as one straight line across both triggers, moved back level with the deepest point of the
Sora V2's smile (Brock, 2026-11-04 09:28: "the rear trigger cutouts have a sort of notch ... instead of being an entirely
straight line"; "level with the deepest point of the Sora V2's smile").

The first build's cutout ran straight only over the middle (z = 6.0 + 0.00055 x^2, |x| < 14); there it handed over to
the lip seam, which climbs over the shoulder, and the hand-over showed as a jog. Here the straight cutout is z = Z_NEW all
the way across and down each side wall, and the side (lip) seam carries on straight back along the side wall from
Z_B, where it was still gentle, to meet it on a 2 mm corner.

The SDF pipeline that built the shell (and its data) is not available, so this moves the seams on the meshes themselves:
a displacement field over the skin, in near-isometric surface coordinates (u = arc length round the cross-section from
the top centre, z), carries a band around the old seam onto the new one and fades to zero away from it (a harmonic
fill); every vertex of the two triggers and the body moves by it, at its own depth under the skin. So the seam's
cross-section (0.25 mm gap, 0.28 mm rounds, its occlusion in COLOR_0) moves whole, the skin stays exactly where it was,
and the trigger grows over the strip the body gives up. Normals are carried through the same map.

    python3 -I -B rear_seam.py <in.glb> <out.glb>      (one_seam.py calls apply() before it writes the GLB)
"""
import json, os, sys
import numpy as np
from scipy.spatial import cKDTree
from scipy.interpolate import griddata, RegularGridInterpolator
from scipy.ndimage import gaussian_filter1d
import scipy.sparse as sp
import scipy.sparse.linalg as spla

HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import glbio

YC = 14.0                 # cylinder axis for the surface coordinates: along z through (0, YC)
Z_NEW = 4.8418            # the Sora's smile at its deepest point (x = 0): its hump fit c0 (shell-sora.json hinge 6.4418 - 1.6)
Z_B = 22.0                # the side seam leaves the old lip seam here, straight (side view) to the corner
Y_CORNER = 30.5           # its height at z = Z_NEW before the corner is rounded (it leaves the lip seam on its own slope)
R_C = 2.0                 # corner where the side seam meets the rear cutout on the side wall (mm, surface coordinates)
BAND = 0.75               # half-width of the band that moves whole with the seam (mm): the gap, its rounds, the occlusion
Z_LO, Z_HI = -7.0, 26.0   # nothing moves behind / ahead of these (ahead: the wheel opening starts at z = 28.4)
TH0, TH1 = np.radians(3.0), np.radians(177.0)


def polar(P):
    x, y, z = P[:, 0], P[:, 1] - YC, P[:, 2]
    return np.arctan2(y, x), np.hypot(x, y), z


class Skin:
    """rho(theta, z) of the outer skin with its seams closed over, its normals, and u(theta, z) = arc length round the
    cross-section from the top centre (u > 0 on +X). Built by rasterising the outward-facing triangles of the given
    meshes into the (theta, z) grid, outermost surface per cell; a grey closing fills the seam grooves (0.8 mm across
    their rounds) so the arc length runs over them, and the normals there are inpainted from the skin round them."""
    def __init__(self, meshes):
        self.th = np.linspace(TH0, TH1, 1161); self.z = np.arange(Z_LO - 2, Z_HI + 2 + 1e-9, 0.2)
        nt, nz = len(self.th), len(self.z); dth = self.th[1] - self.th[0]; dzz = self.z[1] - self.z[0]
        rho = np.full((nt, nz), -1.0); nrm = np.zeros((nt, nz, 3))
        for P, N, C, T in meshes:
            th, rr, z = polar(P)
            T = T[(th[T] > TH0 - 0.1).all(1) & (th[T] < TH1 + 0.1).all(1) & (z[T] > self.z[0] - 1).all(1) & (z[T] < self.z[-1] + 1).all(1)]
            A, B, Cc = P[T[:, 0]], P[T[:, 1]], P[T[:, 2]]
            fn = np.cross(B - A, Cc - A); cen = (A + B + Cc) / 3
            rc = np.c_[cen[:, 0], cen[:, 1] - YC]; rc /= np.linalg.norm(rc, axis=1, keepdims=True)
            T = T[(fn[:, 0] * rc[:, 0] + fn[:, 1] * rc[:, 1]) > 0]          # facing out
            gi = (th - TH0) / dth; gj = (z - self.z[0]) / dzz
            for t in T:
                a, b, c = t
                i0 = int(np.ceil(min(gi[a], gi[b], gi[c]))); i1 = int(np.floor(max(gi[a], gi[b], gi[c])))
                j0 = int(np.ceil(min(gj[a], gj[b], gj[c]))); j1 = int(np.floor(max(gj[a], gj[b], gj[c])))
                i0 = max(i0, 0); j0 = max(j0, 0); i1 = min(i1, nt - 1); j1 = min(j1, nz - 1)
                if i1 < i0 or j1 < j0: continue
                II, JJ = np.meshgrid(np.arange(i0, i1 + 1), np.arange(j0, j1 + 1), indexing='ij')
                x0, y0, x1, y1, x2, y2 = gi[a], gj[a], gi[b], gj[b], gi[c], gj[c]
                den = (y1 - y2) * (x0 - x2) + (x2 - x1) * (y0 - y2)
                if abs(den) < 1e-12: continue
                l0 = ((y1 - y2) * (II - x2) + (x2 - x1) * (JJ - y2)) / den
                l1 = ((y2 - y0) * (II - x2) + (x0 - x2) * (JJ - y2)) / den
                l2 = 1 - l0 - l1
                m = (l0 >= -1e-6) & (l1 >= -1e-6) & (l2 >= -1e-6)
                if not m.any(): continue
                r = l0 * rr[a] + l1 * rr[b] + l2 * rr[c]
                ii, jj, r = II[m], JJ[m], r[m]
                up = r > rho[ii, jj]
                if not up.any(): continue
                ii, jj, r = ii[up], jj[up], r[up]
                rho[ii, jj] = r
                nrm[ii, jj] = l0[m][up][:, None] * N[a] + l1[m][up][:, None] * N[b] + l2[m][up][:, None] * N[c]
        hole = rho < 0
        if hole.any():                                        # cells no triangle covered: nearest filled cell
            from scipy.ndimage import distance_transform_edt
            _, (ai, aj) = distance_transform_edt(hole, return_indices=True)
            rho = rho[ai, aj]; nrm = nrm[ai, aj]
        from scipy.ndimage import grey_closing
        closed = grey_closing(rho, size=(23, 9))
        groove = (closed - rho) > 0.004
        self.rho = closed
        # normals in the closed grooves: inpaint (Jacobi) from the skin round them
        n = nrm / np.maximum(np.linalg.norm(nrm, axis=2, keepdims=True), 1e-9)
        for _ in range(300):
            avg = 0.25 * (np.roll(n, 1, 0) + np.roll(n, -1, 0) + np.roll(n, 1, 1) + np.roll(n, -1, 1))
            n = np.where(groove[..., None], avg, n)
        n /= np.maximum(np.linalg.norm(n, axis=2, keepdims=True), 1e-9)
        self.nrm = n; self.groove = groove
        drho = np.gradient(self.rho, dth, axis=0)
        ds = np.sqrt(self.rho ** 2 + drho ** 2) * dth
        cum = np.concatenate([np.zeros((1, ds.shape[1])), np.cumsum(0.5 * (ds[1:] + ds[:-1]), axis=0)])   # from TH0 upward
        c90 = np.array([np.interp(np.pi / 2, self.th, cum[:, j]) for j in range(cum.shape[1])])
        self.u = c90[None, :] - cum                  # u > 0 for theta < 90 deg (the +X side, triggerL)
        self._rho = RegularGridInterpolator((self.th, self.z), self.rho, bounds_error=False, fill_value=None)
        self._u = RegularGridInterpolator((self.th, self.z), self.u, bounds_error=False, fill_value=None)
        self._n = [RegularGridInterpolator((self.th, self.z), self.nrm[..., k], bounds_error=False, fill_value=None) for k in range(3)]

    def rho_at(self, th, z):
        th = np.atleast_1d(np.asarray(th, float)); return self._rho(np.c_[th, np.broadcast_to(np.atleast_1d(z), th.shape)])
    def u_at(self, th, z):
        th = np.atleast_1d(np.asarray(th, float)); return self._u(np.c_[th, np.broadcast_to(np.atleast_1d(z), th.shape)])
    def n_at(self, th, z):
        n = np.stack([f(np.c_[th, z]) for f in self._n], -1); return n / np.linalg.norm(n, axis=1, keepdims=True)
    def th_at(self, u, z):
        """inverse of u along each cross-section (u decreases with theta)"""
        u = np.atleast_1d(np.asarray(u, float)); z = np.broadcast_to(np.atleast_1d(np.asarray(z, float)), u.shape)
        zi = np.clip((z - self.z[0]) / (self.z[1] - self.z[0]), 0, len(self.z) - 1.000001)
        j0 = np.floor(zi).astype(int); f = zi - j0
        out = np.empty(len(u))
        for j in np.unique(j0):
            m = j0 == j
            a = np.interp(-u[m], -self.u[:, j], self.th); b = np.interp(-u[m], -self.u[:, j + 1], self.th)
            out[m] = a * (1 - f[m]) + b * f[m]
        return out


def old_seam(skin, trig, body):
    """samples of the old trigger/body seam centreline in (u, z): midpoints of facing outer-round vertices"""
    def outer(P, N):
        th, rho, z = polar(P); r = np.c_[np.cos(th), np.sin(th)]
        return (N[:, 0] * r[:, 0] + N[:, 1] * r[:, 1] > 0.3) & (z > Z_LO) & (z < Z_HI + 2) & (th > TH0) & (th < TH1)
    Pt = np.concatenate([P[outer(P, N)] for P, N in trig]); Pb = body[0][outer(*body)]
    d, i = cKDTree(Pb).query(Pt, distance_upper_bound=0.9)
    ok = np.isfinite(d)
    M = 0.5 * (Pt[ok] + Pb[i[ok]])
    th, rho, z = polar(M)
    return np.c_[skin.u_at(th, z), z]


def order_curve(S, side):
    """one side's samples ordered from the lip seam (front) round to the top centre, binned and smoothed"""
    s = S[(S[:, 0] * side) > 0.0]
    a = np.arctan2(np.abs(s[:, 0]), 32.0 - s[:, 1])            # monotone along the curve: pivot ahead of it on the centre
    bins = np.linspace(a.min(), a.max(), 420)
    k = np.digitize(a, bins)
    pts = np.array([s[k == j].mean(0) for j in range(1, len(bins)) if (k == j).sum() >= 2])
    pts = pts[np.argsort(-np.arctan2(np.abs(pts[:, 0]), 32.0 - pts[:, 1]))]   # from the side (large angle) to the centre
    pts[:, 0] = np.abs(pts[:, 0])
    pts, _ = resample(pts, 0.05)
    sm = np.c_[gaussian_filter1d(pts[:, 0], 12, mode='nearest'), gaussian_filter1d(pts[:, 1], 12, mode='nearest')]
    sm[:, 0] = np.where(pts[:, 0] < 1.0, pts[:, 0], sm[:, 0])    # keep the end at the centre
    return sm                                                    # (|u|, z), front of the side part first


def resample(c, step):
    d = np.r_[0, np.cumsum(np.linalg.norm(np.diff(c, axis=0), axis=1))]
    s = np.arange(0, d[-1], step)
    return np.c_[np.interp(s, d, c[:, 0]), np.interp(s, d, c[:, 1])], s


def y_fix(z):
    """below this height on the side walls nothing moves: the side buttons' top edges and the divider rib, + 0.4 mm
    (features.py SB_THESEUS / DIVIDER; the same on the -X side, so the field stays symmetric)"""
    z = np.asarray(z, float)
    rear = 24.65 + (5.2 - z) * (1.25 / 15.1) + 0.4          # sideRear: (5.2, 24.65) .. (-9.9, 25.9)
    front = 23.75 + (8.8 - z) * (3.45 / 14.8) + 0.4         # sideFront: (8.8, 23.75) .. (23.6, 20.3)
    return np.where(z < 5.2, rear, np.where(z < 8.8, 25.05, np.where(z < 23.6, front, 20.7)))


def side_y(skin, sgn, u, z):
    th = skin.th_at(sgn * np.asarray(u, float), np.asarray(z, float))
    return float((YC + skin.rho_at(th, z) * np.sin(th))[0])


def side_u(skin, sgn, y, z):
    """u (>= 0) of the point at height y on this side's wall at z"""
    out = []
    for yy, zz in zip(np.atleast_1d(y), np.atleast_1d(z)):
        j = np.clip(np.searchsorted(skin.z, zz), 1, len(skin.z) - 1)
        th = skin.th; rr = skin.rho_at(th, np.full(len(th), zz)); yv = YC + rr * np.sin(th)
        m = (th < np.radians(75)) if sgn > 0 else (th > np.radians(105))
        tt, yy_ = th[m], yv[m]
        if sgn < 0: tt, yy_ = tt[::-1], yy_[::-1]
        t = np.interp(yy, yy_, tt)                            # y rises toward the top on both walls
        out.append(abs(float(skin.u_at(np.array([t]), np.array([zz]))[0])))
    return np.array(out)


def new_curve(old, skin, sgn):
    """the new seam for one side, as (|u|, z) from the same front end: unchanged to Z_B; then the side seam straight on
    back in the side view (the old lip seam's slope over z 14..22), a corner of R_C, and z = Z_NEW to the centre"""
    oc, _ = resample(old, 0.05)
    jb = np.argmax(oc[:, 1] < Z_B)
    side_part = oc[: jb + 1]                                    # front end ... junction (z falling to Z_B)
    zb = oc[jb, 1]
    yb = side_y(skin, sgn, oc[jb, 0], zb)
    k8 = np.argmin(np.abs(oc[:jb, 1] - (zb + 6.0)))
    s0 = (yb - side_y(skin, sgn, oc[k8, 0], oc[k8, 1])) / (oc[k8, 1] - zb)     # the lip seam's slope ahead (dy per mm back)
    L = zb - Z_NEW; kq = (Y_CORNER - yb - s0 * L) / L ** 2      # a gentle parabola: on the lip seam's tangent at Z_B
    zs = np.linspace(zb, Z_NEW, 200)
    us = side_u(skin, sgn, yb + s0 * (zb - zs) + kq * (zb - zs) ** 2, zs)
    us += oc[jb, 0] - us[0]                                     # starts exactly on the old seam
    line1 = np.c_[us, zs]
    # corner: fillet of R_C between line1 (heading back) and the cutout z = Z_NEW (heading to u = 0)
    t = line1[-1] - line1[-12]; t /= np.linalg.norm(t)
    K = line1[-1] + t * ((Z_NEW - line1[-1, 1]) / t[1]) if abs(t[1]) > 1e-6 else line1[-1]
    t2 = np.array([-1.0, 0.0])
    ang = np.arccos(np.clip(np.dot(t, t2), -1, 1))
    tl = R_C * np.tan(ang / 2)
    A = K - tl * t; Bp = K + tl * t2
    bis = (t2 - t); bis /= np.linalg.norm(bis)
    C0 = K + bis * (R_C / np.cos(ang / 2))
    a0 = np.arctan2(*(A - C0)[::-1]); a1 = np.arctan2(*(Bp - C0)[::-1])
    da = (a1 - a0 + np.pi) % (2 * np.pi) - np.pi
    arc = np.array([C0 + R_C * np.array([np.cos(a0 + da * k), np.sin(a0 + da * k)]) for k in np.linspace(0, 1, 40)])
    keep = line1[:, 1] > A[1] + 1e-6                            # the side line up to the fillet's start
    line1 = np.vstack([line1[keep], A])
    line2 = np.array([Bp + (np.array([0.0, Z_NEW]) - Bp) * k for k in np.linspace(0, 1, 240)])
    return side_part, np.vstack([line1[1:], arc[1:], line2[1:]])


def correspondence(old, new_tail):
    """map old seam points behind the junction to the new curve: the old straight middle (|u| < UJ) by a pure shift in z,
    the rest (junction ... jog) by normalised arc length onto (junction ... UJ on the new straight)"""
    oc, _ = resample(old, 0.05)
    jb = np.argmax(oc[:, 1] < Z_B)
    tail_old = oc[jb:]                                           # junction ... centre
    UJ = 12.0
    k_old = np.argmax(tail_old[:, 0] < UJ)                       # first point of the straight middle
    nc, _ = resample(new_tail, 0.05)
    k_new = np.argmax(nc[:, 0] < UJ) if (nc[:, 0] < UJ).any() else len(nc) - 1
    seg_o, so = resample(tail_old[: k_old + 1], 0.05); seg_n, sn = resample(nc[: k_new + 1], 0.05)
    so_n = so / so[-1]; sn_n = sn / sn[-1]
    src, dst = [], []
    for p, s in zip(seg_o, so_n):
        q = np.c_[np.interp(s, sn_n, seg_n[:, 0]), np.interp(s, sn_n, seg_n[:, 1])][0]
        src.append(p); dst.append(q)
    for p in tail_old[k_old:]:
        src.append(p); dst.append(np.array([p[0], Z_NEW]))
    return np.array(src), np.array(dst)


def field(skin, curves):
    """displacement (du, dz) on a (u, z) grid: the band round each old curve moves with its point and normal onto the new
    curve; zero on the frame and below Y_FIX on the side walls; harmonic in between"""
    du_, dz_ = 0.2, 0.2
    U = np.arange(-50, 50 + 1e-9, du_); Z = np.arange(Z_LO, Z_HI + 1e-9, dz_)
    UU, ZZ = np.meshgrid(U, Z, indexing='ij')
    fixed = np.zeros(UU.shape, bool); val = np.zeros(UU.shape + (2,))
    fixed[0, :] = fixed[-1, :] = fixed[:, 0] = fixed[:, -1] = True
    # below Y_FIX on the side walls (and past the cylinder's angular range)
    th = skin.th_at(np.abs(UU.ravel()) * np.sign(UU.ravel() + 1e-12), ZZ.ravel())
    rho = skin.rho_at(th, ZZ.ravel()); y = YC + rho * np.sin(th)
    low = (y < y_fix(ZZ.ravel())) | (th <= TH0 + 1e-3) | (th >= TH1 - 1e-3)
    fixed |= low.reshape(UU.shape)
    G = np.c_[UU.ravel(), ZZ.ravel()]
    fl = fixed.ravel().copy(); vv = val.reshape(-1, 2)
    for sgn, (src, dst) in curves:
        S = src.copy(); Dd = dst.copy()
        # past the centre: the mirror image, so the band runs on across u = 0
        k = np.nonzero(S[:, 0] < 2.5)[0]
        S = np.vstack([S, (S[k][::-1] * [-1, 1])[1:]]); Dd = np.vstack([Dd, (Dd[k][::-1] * [-1, 1])[1:]])
        S[:, 0] *= sgn; Dd[:, 0] *= sgn
        dS = np.gradient(S, axis=0); lS = np.linalg.norm(dS, axis=1); tS = dS / lS[:, None]
        dD = np.gradient(Dd, axis=0); lD = np.linalg.norm(dD, axis=1); tD = dD / np.maximum(lD, 1e-12)[:, None]
        st = lD / np.maximum(lS, 1e-12)                          # how much the curve stretches there
        nS = np.c_[-tS[:, 1], tS[:, 0]]; nD = np.c_[-tD[:, 1], tD[:, 0]]
        mine = (G[:, 0] * sgn) >= 0
        dist, idx = cKDTree(S).query(G, distance_upper_bound=BAND)
        m = np.isfinite(dist) & mine
        gi = np.nonzero(m)[0]; ii = idx[m]
        rel = G[gi] - S[ii]
        a_t = np.einsum('ij,ij->i', rel, tS[ii]); d = np.einsum('ij,ij->i', rel, nS[ii])
        tgt = Dd[ii] + (a_t * st[ii])[:, None] * tD[ii] + d[:, None] * nD[ii]
        disp = tgt - G[gi]
        free = ~fl[gi]
        vv[gi[free]] = disp[free]; fl[gi[free]] = True
    fixed = fl.reshape(UU.shape); val = vv.reshape(UU.shape + (2,))
    # harmonic fill
    n = UU.size; idx = np.arange(n).reshape(UU.shape)
    unk = ~fixed.ravel(); ui = -np.ones(n, int); ui[unk] = np.arange(unk.sum())
    rows, cols, data = [], [], []; rhs = np.zeros((unk.sum(), 2))
    I, J = np.nonzero(~fixed)
    k = ui[idx[I, J]]
    rows.append(k); cols.append(k); data.append(np.full(len(k), 4.0))
    for di, dj in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        nI, nJ = I + di, J + dj
        nid = idx[nI, nJ]
        isu = unk[nid]
        rows.append(k[isu]); cols.append(ui[nid[isu]]); data.append(np.full(isu.sum(), -1.0))
        rhs[~isu] += val.reshape(-1, 2)[nid[~isu]]
    A = sp.csr_matrix((np.concatenate(data), (np.concatenate(rows), np.concatenate(cols))), shape=(unk.sum(), unk.sum()))
    lu = spla.splu(A.tocsc())
    sol = np.stack([lu.solve(rhs[:, c]) for c in range(2)], -1)
    out = val.reshape(-1, 2).copy(); out[unk] = sol
    D = out.reshape(UU.shape + (2,))
    D = arap(UU, ZZ, D, fixed)
    # fold check: Jacobian of (u, z) -> (u, z) + D
    j11 = 1 + np.gradient(D[..., 0], du_, axis=0); j12 = np.gradient(D[..., 0], dz_, axis=1)
    j21 = np.gradient(D[..., 1], du_, axis=0); j22 = 1 + np.gradient(D[..., 1], dz_, axis=1)
    det = j11 * j22 - j12 * j21
    return U, Z, D, det


def arap(UU, ZZ, D, fixed, iters=40):
    """as-rigid-as-possible relaxation of the map (u, z) -> (u, z) + D, the band and the fixed region held: the harmonic
    fill folds where the body gives up a wide strip next to a held edge; ARAP spreads that out (local rotations per
    grid point, 8 neighbours, then one prefactored global solve per iteration)"""
    sh = UU.shape; n = UU.size
    P = np.c_[UU.ravel(), ZZ.ravel()]; Q = P + D.reshape(-1, 2)
    idx = np.arange(n).reshape(sh)
    pairs = []
    for di, dj in ((1, 0), (0, 1), (1, 1), (1, -1)):
        a = idx[max(0, -di): sh[0] - max(0, di), max(0, -dj): sh[1] - max(0, dj)].ravel()
        b = idx[max(0, di): sh[0] + min(0, di) or None, max(0, dj): sh[1] + min(0, dj) or None].ravel()
        w = 1.0 if (di == 0 or dj == 0) else 0.5
        pairs.append((a, b, np.full(len(a), w)))
    I = np.concatenate([p_[0] for p_ in pairs]); J = np.concatenate([p_[1] for p_ in pairs]); W = np.concatenate([p_[2] for p_ in pairs])
    fx = fixed.ravel(); fr = ~fx
    L = sp.csr_matrix((np.r_[W, W], (np.r_[I, J], np.r_[J, I])), shape=(n, n))
    deg = np.asarray(L.sum(1)).ravel()
    Lap = sp.diags(deg) - L
    A = Lap[fr][:, fr].tocsc(); B = Lap[fr][:, fx]
    lu = spla.splu(A)
    pij = P[I] - P[J]
    for _ in range(iters):
        qij = Q[I] - Q[J]
        M = np.zeros((n, 2, 2))
        outer = W[:, None, None] * qij[:, :, None] * pij[:, None, :]
        np.add.at(M, I, outer); np.add.at(M, J, outer)
        ang = np.arctan2(M[:, 1, 0] - M[:, 0, 1], M[:, 0, 0] + M[:, 1, 1])
        c, s_ = np.cos(ang), np.sin(ang)
        R = np.stack([np.c_[c, -s_], np.c_[s_, c]], 1)
        Rm = 0.5 * (R[I] + R[J])
        e = W[:, None] * np.einsum('kij,kj->ki', Rm, pij)
        rhs = np.zeros((n, 2)); np.add.at(rhs, I, e); np.add.at(rhs, J, -e)
        r = rhs[fr] - B @ Q[fx]
        Q[fr] = np.stack([lu.solve(r[:, 0]), lu.solve(r[:, 1])], -1)
    return (Q - P).reshape(sh + (2,))


def apply(meshes, verbose=True):
    """meshes: {'triggerL': (P, N, C, T), 'triggerR': ..., 'body': ...} -> the same, moved"""
    names = ['triggerL', 'triggerR', 'body']
    skin = Skin([meshes[k] for k in names])
    S = old_seam(skin, [(meshes[k][0], meshes[k][1]) for k in ('triggerL', 'triggerR')], (meshes['body'][0], meshes['body'][1]))
    curves = []; info = {}
    for sgn in (1, -1):
        old = order_curve(S, sgn)
        old = old[old[:, 1] < Z_HI + 1.5]                       # the band runs on past Z_HI (where nothing moves)
        side_part, tail = new_curve(old, skin, sgn)
        src, dst = correspondence(old, tail)
        src = np.vstack([side_part, src]); dst = np.vstack([side_part, dst])
        curves.append((sgn, (src, dst)))
        info['L' if sgn > 0 else 'R'] = dict(junction=[round(float(v), 2) for v in side_part[-1]], corner_u=round(float(tail[np.argmin(np.abs(tail[:, 1] - Z_NEW) + (tail[:, 0] < 5) * 9)][0]), 2),
                                             old_mid_z=round(float(old[-1, 1]), 3))
    U, Z, D, det = field(skin, curves)
    info['det_min'] = round(float(det.min()), 3)
    fU = RegularGridInterpolator((U, Z), D[..., 0], bounds_error=False, fill_value=0.0)
    fZ = RegularGridInterpolator((U, Z), D[..., 1], bounds_error=False, fill_value=0.0)
    out = {}
    for k in names:
        P, N, C, T = meshes[k]
        P = P.astype(float).copy(); N = N.astype(float).copy()
        th, rho, z = polar(P)
        m = (th > TH0) & (th < TH1) & (z > Z_LO) & (z < Z_HI)
        u = skin.u_at(th[m], z[m]); q = np.c_[u, z[m]]
        du = fU(q); dz = fZ(q)
        mv = (np.abs(du) > 1e-6) | (np.abs(dz) > 1e-6)
        ii = np.nonzero(m)[0][mv]
        u0, z0, th0, r0 = u[mv], z[m][mv], th[ii], rho[ii]
        u1, z1 = u0 + du[mv], z0 + dz[mv]
        th1 = skin.th_at(u1, z1)
        depth = skin.rho_at(th0, z0) - r0
        r1 = skin.rho_at(th1, z1) - depth
        P[ii, 0] = r1 * np.cos(th1); P[ii, 1] = YC + r1 * np.sin(th1); P[ii, 2] = z1
        # normals: tangential part through the inverse transpose of the in-surface map, frames at both ends
        eps = 0.05
        def jac(uu, zz):
            a = np.c_[uu, zz]
            def F(du1, dz1): b = a + np.c_[np.full(len(a), du1), np.full(len(a), dz1)]; return np.c_[fU(b), fZ(b)]
            dU = (F(eps, 0) - F(-eps, 0)) / (2 * eps); dZ = (F(0, eps) - F(0, -eps)) / (2 * eps)
            return np.stack([np.c_[1 + dU[:, 0], dZ[:, 0]], np.c_[dU[:, 1], 1 + dZ[:, 1]]], 1)   # [[du'/du, du'/dz],[dz'/du, dz'/dz]]
        Jm = jac(u0, z0)
        def frame(th_, z_):
            n = skin.n_at(th_, z_)
            et = np.c_[np.sin(th_), -np.cos(th_), np.zeros(len(th_))]          # direction of increasing u (theta falling)
            eu = et - np.einsum('ij,ij->i', et, n)[:, None] * n; eu /= np.linalg.norm(eu, axis=1, keepdims=True)
            ez = np.cross(n, eu); ez *= np.sign(ez[:, 2:3] + 1e-12)
            return eu, ez, n
        eu0, ez0, en0 = frame(th0, z0); eu1, ez1, en1 = frame(th1, z1)
        n0 = N[ii]
        a_u = np.einsum('ij,ij->i', n0, eu0); a_z = np.einsum('ij,ij->i', n0, ez0); a_n = np.einsum('ij,ij->i', n0, en0)
        Jinv_T = np.linalg.inv(Jm).transpose(0, 2, 1)
        t1 = np.einsum('kij,kj->ki', Jinv_T, np.c_[a_u, a_z])
        n1 = t1[:, :1] * eu1 + t1[:, 1:] * ez1 + a_n[:, None] * en1
        N[ii] = n1 / np.linalg.norm(n1, axis=1, keepdims=True)
        out[k] = (P.astype(np.float32), N.astype(np.float32), C, T)
        info[k + '_moved'] = int(len(ii))
    if verbose: print(json.dumps(info))
    return out, info


if __name__ == '__main__':
    src, dst = sys.argv[1], sys.argv[2]
    js, b = glbio.read(src)
    meshes = {}
    for k in ('triggerL', 'triggerR', 'body'):
        _, d = glbio.mesh_arrays(js, b, k)
        meshes[k] = (d['POSITION'], d['NORMAL'], d['COLOR_0'], d['indices'].reshape(-1, 3))
    out, info = apply(meshes)
    from one_seam import write
    rep = {k: (v[0], v[1], v[2], v[3]) for k, v in out.items()}
    size = write(js, b, rep, [], dst)
    print('wrote', dst, size // 1024, 'KB')
