"""Sections of the faithful Sora V2 base (3d/shell/shell-sora.glb) for the gradient-descent shape study.

Frame (3d/CONVENTIONS.md): mm, +Y up (Y = 0 the pad), +Z forward (nose), +X the user's LEFT (side-button side).
Takes the outer skin (body + both triggers + side buttons) and writes:
  plan    : the silhouette from above, max |x| per z (left and right)
  grip    : the outline at the grip heights (thumb/pinky contact band), x per z at y = 12, 15, 18
  profile : the side profile, max y per z near the centre line (x = +/-1)
  xsec    : cross-sections at z stations, outer contour as (x, y), polar max about (0, 16)
Run: python3 deck/tools/gd/sora_sections.py  -> deck/tools/gd/out/sora_sections.json
"""
import json, os, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
sys.path.insert(0, os.path.join(ROOT, '3d', 'shell', 'tools'))
import glbio  # noqa: E402

PARTS = ['body', 'triggerL', 'triggerR', 'sideFront', 'sideRear']

def load():
    js, b = glbio.read(os.path.join(ROOT, '3d', 'shell', 'shell-sora.glb'))
    tris = []
    for nm in PARTS:
        _, d = glbio.mesh_arrays(js, b, nm)
        P = d['POSITION'].astype(np.float64); I = d['indices'].reshape(-1, 3)
        tris.append(P[I])
    return np.concatenate(tris, 0)   # (n, 3, 3)

def plane_segments(T, axis, c):
    """intersection of triangles with the plane coord[axis] = c: returns (m, 2, 3) segment endpoints"""
    v = T[:, :, axis] - c
    s = np.sign(v); s[s == 0] = 1
    cross = ~((s[:, 0] == s[:, 1]) & (s[:, 1] == s[:, 2]))
    T, v = T[cross], v[cross]
    out = []
    for (i, j) in [(0, 1), (1, 2), (2, 0)]:
        a, bb = v[:, i], v[:, j]
        m = (a * bb) < 0
        tt = a[m] / (a[m] - bb[m])
        p = T[m, i] + (T[m, j] - T[m, i]) * tt[:, None]
        out.append((np.nonzero(m)[0], p))
    idx = np.concatenate([o[0] for o in out]); pts = np.concatenate([o[1] for o in out])
    order = np.argsort(idx, kind='stable'); idx, pts = idx[order], pts[order]
    # pair the two crossing points of each triangle
    segs = []
    k = 0
    while k < len(idx) - 1:
        if idx[k] == idx[k + 1]:
            segs.append([pts[k], pts[k + 1]]); k += 2
        else:
            k += 1
    return np.array(segs)

def polar_outer(P2, c, n=361):
    """outer contour of a 2D point cloud by angle about c: max radius per angle bin, angles from straight up (0) to
    straight down (pi) on the -x side (the right half), and the +x side; returns ordered (x, y)"""
    d = P2 - c; ang = np.arctan2(d[:, 0], d[:, 1])  # 0 = up, +pi/2 = +x, -pi/2 = -x
    r = np.hypot(d[:, 0], d[:, 1])
    bins = np.linspace(-np.pi, np.pi, n)
    out = []
    for a0, a1 in zip(bins[:-1], bins[1:]):
        m = (ang >= a0) & (ang < a1)
        if m.any():
            i = np.argmax(np.where(m, r, -1))
            out.append(P2[i])
    return np.array(out)

def main():
    T = load()
    allP = T.reshape(-1, 3)
    zmin, zmax = allP[:, 2].min(), allP[:, 2].max()
    res = {'source': '3d/shell/shell-sora.glb (body, triggerL, triggerR, sideFront, sideRear)', 'frame': '+X user left, +Y up, +Z nose, mm',
           'bbox': {'min': allP.min(0).round(3).tolist(), 'max': allP.max(0).round(3).tolist()}}
    # cross sections every 1 mm in z: plan silhouette and the grip outline
    zs = np.arange(np.ceil(zmin) + 0.5, zmax - 0.2, 1.0)
    plan, grip = [], {12: [], 15: [], 18: []}
    for z in zs:
        S = plane_segments(T, 2, z)
        if len(S) == 0: continue
        P2 = S[:, :, [0, 1]].reshape(-1, 2)
        plan.append([float(z), float(P2[:, 0].max()), float(-P2[:, 0].min()), float(P2[:, 1].max())])
        for yg in grip:
            # x where the segments cross y = yg, outermost on each side
            a, b = S[:, 0, :], S[:, 1, :]
            m = (a[:, 1] - yg) * (b[:, 1] - yg) <= 0
            if m.any():
                tt = (yg - a[m, 1]) / np.where(np.abs(b[m, 1] - a[m, 1]) < 1e-12, 1e-12, (b[m, 1] - a[m, 1]))
                xx = a[m, 0] + (b[m, 0] - a[m, 0]) * tt
                grip[yg].append([float(z), float(xx.max()), float(-xx.min())])
    res['plan'] = plan
    res['grip'] = {str(k): v for k, v in grip.items()}
    # side profile: plane x = -1 (right trigger, clear of the 0.25 mm centre split)
    prof = []
    S = plane_segments(T, 0, -1.0)
    P2 = S[:, :, [2, 1]].reshape(-1, 2)  # (z, y)
    for z in np.arange(np.floor(P2[:, 0].min()), P2[:, 0].max(), 0.5):
        m = np.abs(P2[:, 0] - z) < 0.35
        if m.any(): prof.append([float(z), float(P2[m, 1].max())])
    res['profile'] = prof
    # cross-sections at stations (z), outer contour
    xsec = {}
    for z in [-40, -30, -20, -10, 0, 10, 20, 30, 40, 48]:
        S = plane_segments(T, 2, float(z))
        u = np.linspace(0, 1, 12)[None, :, None]
        P2 = (S[:, 0, None, :2] + (S[:, 1, None, :2] - S[:, 0, None, :2]) * u).reshape(-1, 2)   # densified
        C = polar_outer(P2, np.array([0.0, 14.0]), n=241)
        xsec[str(z)] = C.round(4).tolist()
    res['xsec'] = xsec
    json.dump(res, open(os.path.join(HERE, 'out', 'sora_sections.json'), 'w'))
    pl = np.array(plan)
    i = np.argmax(pl[:, 1] + pl[:, 2])
    print('bbox', res['bbox'])
    print('plan: max width %.2f at z %.1f; length %.2f' % (pl[i, 1] + pl[i, 2], pl[i, 0], zmax - zmin))
    g = np.array(grip[15]); w = g[:, 1] + g[:, 2]
    for zz in [-40, -30, -20, -10, 0, 10, 20, 30, 40, 50]:
        k = np.argmin(np.abs(pl[:, 0] - zz)); kg = np.argmin(np.abs(g[:, 0] - zz))
        print('z %4d  silhouette W %.2f (L %.2f R %.2f)  at y15 W %.2f   top y %.2f' % (zz, pl[k, 1] + pl[k, 2], pl[k, 1], pl[k, 2], w[kg], pl[k, 3]))
    pr = np.array(prof); j = np.argmax(pr[:, 1]); print('profile peak y %.2f at z %.1f' % (pr[j, 1], pr[j, 0]))

if __name__ == '__main__':
    main()
