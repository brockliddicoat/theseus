"""L1 lattice study, geometry: the outer skin of Theseus's shell as a (z, s) chart.

Source: 3d/shell/shell-theseus-1seam.glb (the scan-based Sora shape with Theseus's one seam and straight rear cutout), meshes
`body`, `triggerL`, `triggerR`. Frame: +X user's left (side-button side), +Y up, +Z forward (nose), mm.

The model is symmetric: the side-button side (+X) has openings for the side buttons, so (like the 3D lattice study, which
mirrored the button-free half) the -X half (the user's right) is extracted and mirrored.

For each transverse plane z = const (every DZ mm), rays from an interior point (0, yc) sweep the -X half from straight up to
straight down; the outermost hit of each ray is the outer skin (the meshes are hollow walls: inner and outer surfaces).
The contour is then parameterised by arc length s from the top midline (x = 0, s = 0) toward the base (s > 0 is -X; the
mirror gives s < 0 for +X). Each point is labelled body (0) or trigger (1) by the mesh it came from.

Output geo/chart.npz: z (nz), s (ns), X (nz, ns, 3) with NaN past the contour's end, lab (nz, ns), S (nz: the contour's
length), crease (nz: arc length of the crease, the base chamfer's top edge, where found), plus the raw contours.
"""
import numpy as np, trimesh, json, sys, time

DZ = 0.25
DS = 0.25
NRAY = 1400
GLB = '/home/claude/theseus/3d/shell/shell-theseus-1seam.glb'

def main():
    t0 = time.time()
    sc = trimesh.load(GLB, force='scene')
    meshes = [sc.geometry['body'], sc.geometry['triggerR']]      # -X half: the body and the user's right trigger
    zs = np.arange(-59.5, 59.5 + 1e-9, DZ)
    contours = []
    for z in zs:
        segs, labs = [], []
        for li, g in enumerate(meshes):
            sg = trimesh.intersections.mesh_plane(g, plane_normal=[0, 0, 1], plane_origin=[0, 0, z])
            if len(sg):
                segs.append(sg[:, :, :2]); labs.append(np.full(len(sg), li))
        if not segs:
            contours.append(None); continue
        S2 = np.concatenate(segs); L2 = np.concatenate(labs)
        # keep x <= 0.3 (the -X half and a sliver over the midline)
        keep = (S2[:, :, 0].min(1) <= 0.3)
        S2, L2 = S2[keep], L2[keep]
        if len(S2) == 0:
            contours.append(None); continue
        ymin, ymax = S2[:, :, 1].min(), S2[:, :, 1].max()
        yc = ymin + 0.42 * (ymax - ymin)
        # rays from (0, yc): angle phi from +y (0) through -x (pi/2) to -y (pi)
        phi = np.linspace(0.0, np.pi, NRAY)
        d = np.stack([-np.sin(phi), np.cos(phi)], 1)                  # (NRAY, 2)
        A = S2[:, 0, :] - np.array([0.0, yc]); B = S2[:, 1, :] - np.array([0.0, yc])
        E = B - A                                                      # segment direction
        # solve o + r d = A + u E  ->  r d - u E = A
        den = d[:, None, 0] * (-E[None, :, 1]) - d[:, None, 1] * (-E[None, :, 0])   # det [d, -E]
        with np.errstate(divide='ignore', invalid='ignore'):
            r = (A[None, :, 0] * (-E[None, :, 1]) - A[None, :, 1] * (-E[None, :, 0])) / den
            u = (d[:, None, 0] * A[None, :, 1] - d[:, None, 1] * A[None, :, 0]) / den
        ok = np.isfinite(r) & (r > 0) & (u >= -1e-9) & (u <= 1 + 1e-9)
        rr = np.where(ok, r, -1.0)
        j = rr.argmax(1); rmax = rr[np.arange(NRAY), j]
        hit = rmax > 0
        P = np.stack([-np.sin(phi) * rmax, yc + np.cos(phi) * rmax], 1)
        lab = L2[j]
        P, lab, ph = P[hit], lab[hit], phi[hit]
        contours.append(dict(z=float(z), yc=yc, P=P, lab=lab, phi=ph))
    print('sliced', len(zs), 'in', round(time.time() - t0, 1), 's')

    # arc-length parameterisation from the top midline; resample at DS
    smax = 0
    for c in contours:
        if c is None: continue
        P = c['P']
        # drop near-duplicate points and backtracks (seam gaps produce spikes inward): enforce monotone-ish by
        # discarding points whose radius jumps inward by more than 0.6 mm relative to both neighbours
        rad = np.hypot(P[:, 0], P[:, 1] - c['yc'])
        bad = np.zeros(len(P), bool)
        bad[1:-1] = (rad[1:-1] < rad[:-2] - 0.6) & (rad[1:-1] < rad[2:] - 0.6)
        P, lab = P[~bad], c['lab'][~bad]
        # start exactly at x = 0
        P[0, 0] = 0.0
        seg = np.hypot(np.diff(P[:, 0]), np.diff(P[:, 1]))
        s = np.concatenate([[0], np.cumsum(seg)])
        c['s'] = s; c['P'] = P; c['lab'] = lab; c['S'] = s[-1]
        smax = max(smax, s[-1])
    ns = int(np.ceil(smax / DS)) + 2
    sg = np.arange(ns) * DS
    nz = len(zs)
    X = np.full((nz, ns, 3), np.nan); LAB = np.full((nz, ns), -1, np.int8); Sz = np.zeros(nz)
    for i, c in enumerate(contours):
        if c is None: continue
        m = sg <= c['S'] + 1e-9
        X[i, m, 0] = np.interp(sg[m], c['s'], c['P'][:, 0])
        X[i, m, 1] = np.interp(sg[m], c['s'], c['P'][:, 1])
        X[i, m, 2] = c['z']
        # label: nearest raw point
        idx = np.clip(np.searchsorted(c['s'], sg[m]), 0, len(c['s']) - 1)
        LAB[i, m] = c['lab'][idx]
        Sz[i] = c['S']
    np.savez_compressed('/home/claude/work/l1/geo/chart.npz', z=zs, s=sg, X=X, lab=LAB, S=Sz)
    # quick report
    for zq in [-59, -58, -55, -50, -40, -30, -14, 0, 4.75, 5, 10, 20, 30, 40, 50, 55, 58]:
        i = int(round((zq - zs[0]) / DZ)); c = contours[i]
        if c is None: print(zq, 'none'); continue
        P = c['P']; lab = c['lab']
        tr = np.where(lab == 1)[0]
        s_tr = (c['s'][tr].min(), c['s'][tr].max()) if len(tr) else None
        print(f"z={c['z']:6.2f} S={c['S']:6.2f} end=({P[-1,0]:6.2f},{P[-1,1]:6.2f}) ymax={P[:,1].max():5.2f} trigger s={s_tr}")
    print('done', round(time.time() - t0, 1), 's')

if __name__ == '__main__':
    main()
