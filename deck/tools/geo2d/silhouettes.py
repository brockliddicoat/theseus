"""Turn an exported 3D scene (export.js) into 2D outlines for the deck's 2D mode.

  python3 silhouettes.py <scene.json> <out.json> [tol] [--lines=<path regex>] [--crease=<deg, default 32>]

For every mesh and each of the three world axes, the mesh is projected flat (orthographic) and rasterised; the outline
of the result (outer rings and holes) is traced and simplified. Projections along +A and -A are the same shape, so a
view from either side reads the same rings; only the drawing order differs (by depth, at run time).
Also kept: each mesh's depth range along each axis, a look (fill tone) from its material, and how it moves with each
state key (a delta transform per sampled value, or a rotation rate for 'scroll').
With --lines, the meshes whose path matches also get `lines`: their visible feature lines (edges sharper than --crease,
and open boundaries), hidden lines removed against the mesh itself (nearer parts cover the rest by drawing order), per axis AND side ('+0' … '-2', since what is hidden
depends on the side), delta-coded like the rings. Readers that don't know the field ignore it.
"""
import sys, json, base64, math
import numpy as np, cv2

args = [a for a in sys.argv[1:] if not a.startswith('--')]
opt = dict(a[2:].split('=', 1) for a in sys.argv[1:] if a.startswith('--') and '=' in a)
src, dst = args[0], args[1]
D = json.load(open(src))
TOL = float(args[2]) if len(args) > 2 else None           # outline tolerance, mm (default: frame radius / 700)
# feature lines (sharp edges and boundaries, hidden lines removed) for the meshes whose path matches --lines=<regex>;
# drawn by 08-v2d.js over each part's flat fill so a part reads as a drawing (slots, recess, crests, knurl), not a blob
import re
LINES_RE = re.compile(opt['lines']) if opt.get('lines') else None
CREASE = math.cos(math.radians(float(opt.get('crease', 32))))

def mat(m):  # three.js column-major 16 -> 4x4
    return np.array(m, dtype=float).reshape(4, 4).T

geos = {}
for gid, g in D['geos'].items():
    pos = np.frombuffer(base64.b64decode(g['pos']), dtype=np.float32).reshape(-1, 3).astype(float)
    if g['idx']:
        idx = np.frombuffer(base64.b64decode(g['idx']), dtype=np.uint32).astype(np.int64)
    else:
        idx = np.arange(len(pos), dtype=np.int64)
    dr = g.get('dr')
    if dr and dr[1] is not None and dr[1] != float('inf') and dr[1] < len(idx):
        idx = idx[int(dr[0]): int(dr[0]) + int(dr[1])]
    idx = idx[: len(idx) // 3 * 3]
    geos[gid] = (pos, idx.reshape(-1, 3))

S0 = D['samples'][0]
AX = {0: (2, 1), 1: (0, 2), 2: (0, 1)}       # projected along X: (Z, Y); along Y: (X, Z); along Z: (X, Y)
size = np.array(D['frame']['size'])
tol = TOL or D['frame']['r'] / 700.0
res = tol / 1.6                             # mm per raster pixel
Q = 1.0 / (tol / 2.0)                       # stored coordinates: integers of tol / 2

def lum(hexc):
    if not hexc: return 0.5
    r, g, b = (int(hexc[i:i + 2], 16) / 255 for i in (1, 3, 5))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b

def weld_edges(W, tri):
    """welded vertices, face normals and the feature edges (boundary, crease, non-manifold) of one mesh"""
    q = np.round(W / 1e-4).astype(np.int64)
    uq, inv = np.unique(q, axis=0, return_inverse=True)
    inv = inv.reshape(-1)
    V = np.zeros((len(uq), 3)); np.add.at(V, inv, W); V /= np.bincount(inv, minlength=len(uq))[:, None]
    T = inv[tri]
    a, b, c = V[T[:, 0]], V[T[:, 1]], V[T[:, 2]]
    n = np.cross(b - a, c - a); ar = np.linalg.norm(n, axis=1)
    ok = (ar > 1e-12) & (T[:, 0] != T[:, 1]) & (T[:, 1] != T[:, 2]) & (T[:, 0] != T[:, 2])
    T, n, ar = T[ok], n[ok], ar[ok]
    n = n / ar[:, None]
    nT = len(T)
    if nT == 0: return V, T, n, np.zeros((0, 2), int), np.zeros((0, 2), int)
    E = np.concatenate([T[:, [0, 1]], T[:, [1, 2]], T[:, [2, 0]]]); F = np.tile(np.arange(nT), 3)
    Es = np.sort(E, axis=1); key = Es[:, 0] * (len(V) + 1) + Es[:, 1]
    o = np.argsort(key, kind='stable'); key, F, Es = key[o], F[o], Es[o]
    _, st, cnt = np.unique(key, return_index=True, return_counts=True)
    edges, faces = [], []
    for s0, k in zip(st, cnt):
        if k == 2:
            f0, f1 = F[s0], F[s0 + 1]
            if np.dot(n[f0], n[f1]) < CREASE: edges.append(Es[s0]); faces.append((f0, f1))
        else:                                 # boundary (1) or non-manifold (3+): a feature either way
            edges.append(Es[s0]); faces.append((F[s0], F[s0 + 1] if k > 1 else -1))
    return V, T, n, np.array(edges, int).reshape(-1, 2), np.array(faces, int).reshape(-1, 2)

def feature_lines(WE, a, sgn, iu, iv, u0, v0, rr, Wd, Hd):
    """visible feature lines of one mesh seen from the sgn side of axis a, as rings-style delta-coded open polylines"""
    V, T, n, E, EF = WE
    if len(E) == 0: return []
    front = sgn * n[:, a] > 0.02
    keep = np.array([(front[f0] or (f1 >= 0 and front[f1])) for f0, f1 in EF], bool)
    E, EF = E[keep], EF[keep]
    if len(E) == 0: return []
    # depth buffer from the front faces: each painted with its nearest-to-the-back depth, nearest faces last
    FT = T[front]
    dep = sgn * V[:, a]
    zb = np.full((Hd, Wd), -1e9, np.float32)
    sh = 4
    px = np.round((V[:, iu] - u0) / rr * (1 << sh)).astype(np.int32)
    py = np.round((V[:, iv] - v0) / rr * (1 << sh)).astype(np.int32)
    dmin = dep[FT].min(1); dmean = dep[FT].mean(1)
    for k in np.argsort(dmean, kind='stable'):
        cv2.fillConvexPoly(zb, np.stack([px[FT[k]], py[FT[k]]], -1), float(dmin[k]), lineType=cv2.LINE_8, shift=sh)
    tol = 1.5 * rr + 2e-3
    segs = []
    for (i, j) in E:
        p0 = np.array([V[i, iu], V[i, iv]]); p1 = np.array([V[j, iu], V[j, iv]])
        L = np.linalg.norm(p1 - p0) / rr
        if L < 0.6: continue
        m = int(math.ceil(L)) + 1
        t = np.linspace(0, 1, m)
        pu = p0[0] + (p1[0] - p0[0]) * t; pv = p0[1] + (p1[1] - p0[1]) * t
        pd = dep[i] + (dep[j] - dep[i]) * t
        xi = np.clip(((pu - u0) / rr).astype(int), 0, Wd - 1); yi = np.clip(((pv - v0) / rr).astype(int), 0, Hd - 1)
        # a point is seen if nothing in front of it (3 × 3 neighbourhood minimum, so edges on a face's rim survive)
        zz = zb[yi, xi]
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            zz = np.minimum(zz, zb[np.clip(yi + dy, 0, Hd - 1), np.clip(xi + dx, 0, Wd - 1)])
        vis = pd >= zz - tol
        if not vis.any(): continue
        # runs of visible samples → segments
        idx = np.flatnonzero(np.diff(np.concatenate([[0], vis.astype(int), [0]])))
        for r0, r1 in zip(idx[::2], idx[1::2]):
            if r1 - r0 < 2: continue
            segs.append(np.stack([pu[r0:r1], pv[r0:r1]], 1)[[0, -1]])
    if not segs: return []
    # chain segments that share endpoints into polylines (cheaper to store and to stroke)
    key = lambda p: (int(round(p[0] / (rr * 0.5))), int(round(p[1] / (rr * 0.5))))
    ends = {}
    for k, sgm in enumerate(segs):
        for e in (0, 1): ends.setdefault(key(sgm[e]), []).append((k, e))
    used = np.zeros(len(segs), bool); polys = []
    for k in range(len(segs)):
        if used[k]: continue
        used[k] = True; chain = [segs[k][0], segs[k][1]]
        for direction in (1, 0):
            while True:
                tip = chain[-1] if direction else chain[0]
                nxt = [(kk, e) for kk, e in ends.get(key(tip), []) if not used[kk]]
                if not nxt: break
                kk, e = nxt[0]; used[kk] = True
                p = segs[kk][1 - e]
                if direction: chain.append(p)
                else: chain.insert(0, p)
        polys.append(np.array(chain))
    out = []
    for pl in polys:
        pts = np.round(pl / rr * 4).astype(np.int32).reshape(-1, 1, 2)
        ap = cv2.approxPolyDP(pts, 0.75 * 4, False).reshape(-1, 2) * (rr / 4.0)
        if len(ap) < 2: continue
        qq = np.round(ap * Q).astype(int)
        d = np.vstack([qq[:1], np.diff(qq, axis=0)]).reshape(-1)
        out.append({'d': d.tolist()})
    return out

out_meshes = []
for m in D['meshes']:
    i = m['id']
    if m['geo'] not in geos: continue
    pos, tri = geos[m['geo']]
    if len(tri) == 0: continue
    if m.get('inst'): continue
    if not m.get('mat') or str(m.get('name', '')).endswith(':cap'): continue          # helper meshes and section caps
    # a section's back-face twin is a child of its mesh with the same geometry; instances of one geometry side by side
    # (four screw heads, four gussets) are not twins, so only a child path counts
    if '/' in m['path'] and any(o['geo'] == m['geo'] and o['id'] < m['id'] and o['path'] == m['path'].rsplit('/', 1)[0] for o in D['meshes']): continue
    M0 = mat(S0['M'][i])
    W = (M0 @ np.c_[pos, np.ones(len(pos))].T).T[:, :3]
    used = np.unique(tri)
    Wu = W[used]
    rec = {'id': i, 'name': m['name'], 'path': m['path'], 'vis': bool(S0['V'][i]), 'rings': {}, 'depth': {}}
    mt = m['mat'] or {}
    rec['look'] = {'color': mt.get('color'), 'lum': round(lum(mt.get('color')), 3), 'metal': mt.get('metal'), 'opacity': mt.get('opacity'),
                   'transparent': mt.get('transparent'), 'trans': mt.get('trans'), 'type': mt.get('type'), 'wire': mt.get('wire')}
    lo, hi = Wu.min(0), Wu.max(0)
    WE = weld_edges(W, tri) if (LINES_RE and LINES_RE.search(m['path'])) else None
    rec['bbox'] = [[round(v, 3) for v in lo], [round(v, 3) for v in hi]]
    for a, (iu, iv) in AX.items():
        rec['depth'][a] = [round(lo[a], 3), round(hi[a], 3), round(float(Wu[:, a].mean()), 3)]
        U, V = W[:, iu], W[:, iv]
        u0, v0 = lo[iu] - 3 * res, lo[iv] - 3 * res
        Wd = int(math.ceil((hi[iu] - lo[iu]) / res)) + 7
        Hd = int(math.ceil((hi[iv] - lo[iv]) / res)) + 7
        if Wd * Hd > 40e6:
            r2 = res * math.sqrt(Wd * Hd / 40e6); u0, v0 = lo[iu] - 3 * r2, lo[iv] - 3 * r2
            Wd = int(math.ceil((hi[iu] - lo[iu]) / r2)) + 7; Hd = int(math.ceil((hi[iv] - lo[iv]) / r2)) + 7; rr = r2
        else:
            rr = res
        mask = np.zeros((Hd, Wd), np.uint8)
        sh = 4
        px = np.round((U - u0) / rr * (1 << sh)).astype(np.int32)
        py = np.round((V - v0) / rr * (1 << sh)).astype(np.int32)
        P = np.stack([px[tri], py[tri]], axis=-1)          # (T, 3, 2)
        # one triangle at a time: fillPoly with many contours fills by parity, so overlapping triangles cancelled out
        for T3 in P:
            cv2.fillConvexPoly(mask, T3, 255, lineType=cv2.LINE_8, shift=sh)
        mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8))
        cs, hier = cv2.findContours(mask, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)
        rings = []
        if hier is not None:
            for ci, c in enumerate(cs):
                area = cv2.contourArea(c)
                if area < 4: continue
                ap = cv2.approxPolyDP(c, 0.75, True).reshape(-1, 2)
                if len(ap) < 3: continue
                hole = hier[0][ci][3] >= 0
                uu = u0 + (ap[:, 0] + 0.5) * rr
                vv = v0 + (ap[:, 1] + 0.5) * rr
                q = np.round(np.stack([uu, vv], 1) * Q).astype(int)
                d = np.vstack([q[:1], np.diff(q, axis=0)]).reshape(-1)       # first point, then steps
                rings.append({'h': 1 if hole else 0, 'd': d.tolist()})
        rec['rings'][a] = rings
        if WE is not None:
            for sgn in (1, -1):
                ls = feature_lines(WE, a, sgn, iu, iv, u0, v0, rr, Wd, Hd)
                if ls: rec.setdefault('lines', {})[('+' if sgn > 0 else '-') + str(a)] = ls
    out_meshes.append(rec)

# motion per state key: the world-space delta from rest, per sampled value
inv0 = {m['id']: np.linalg.inv(mat(S0['M'][m['id']])) for m in D['meshes']}
motion = {}
vis_change = {}
look_change = {}
for s in D['samples'][1:]:
    st = s['state']
    if not st: continue
    key, val = next(iter(st.items()))
    for m in out_meshes:
        i = m['id']
        Dm = mat(s['M'][i]) @ inv0[i]
        if np.abs(Dm - np.eye(4)).max() > 2e-4:
            motion.setdefault(key, {}).setdefault(str(i), {})[str(val)] = [round(float(v), 4) for v in Dm[:3, :].reshape(-1)]
        if bool(s['V'][i]) != m['vis']:
            vis_change.setdefault(key, {}).setdefault(str(i), {})[str(val)] = bool(s['V'][i])
        o0, o1 = S0['O'][i], s['O'][i]
        if o0 != o1:
            look_change.setdefault(key, {}).setdefault(str(i), {})[str(val)] = o1
# scroll: one rotation, about an axis through a pivot, at a rate per radian of state
rot = {}
if 'scroll' in motion:
    for i, vals in motion['scroll'].items():
        v = list(vals.items())[0]; sval = float(v[0]); Dm = np.array(v[1]).reshape(3, 4)
        R, t = Dm[:, :3], Dm[:, 3]
        ang = math.acos(max(-1, min(1, (np.trace(R) - 1) / 2)))
        if ang < 1e-6: continue
        ax = np.array([R[2, 1] - R[1, 2], R[0, 2] - R[2, 0], R[1, 0] - R[0, 1]]) / (2 * math.sin(ang))
        piv, *_ = np.linalg.lstsq(np.eye(3) - R, t, rcond=None)
        rot[i] = {'axis': [round(float(x), 5) for x in ax], 'pivot': [round(float(x), 4) for x in piv], 'rate': round(ang / sval, 5)}
    motion['scroll'] = {}
out = {'key': D['key'], 'frame': D['frame'], 'q': Q, 'meshes': out_meshes, 'motion': motion, 'rot': rot, 'vis': vis_change, 'look': look_change}
js = json.dumps(out, separators=(',', ':'))
import os
open(dst + '.tmp', 'w').write(js); os.replace(dst + '.tmp', dst)      # never a half-written twin
print(D['key'], 'tol', round(tol, 4), len(out_meshes), 'meshes', sum(1 for m in out_meshes if 'lines' in m), 'with lines', len(js) // 1024, 'KB', 'res', round(res, 4), 'motion keys', {k: len(v) for k, v in motion.items()}, 'rot', len(rot), 'vis', list(vis_change), 'look', list(look_change))
