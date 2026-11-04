"""Turn an exported 3D scene (export.js) into 2D outlines for the deck's 2D mode.

  python3 silhouettes.py <scene.json> <out.json>

For every mesh and each of the three world axes, the mesh is projected flat (orthographic) and rasterised; the outline
of the result (outer rings and holes) is traced and simplified. Projections along +A and -A are the same shape, so a
view from either side reads the same rings; only the drawing order differs (by depth, at run time).
Also kept: each mesh's depth range along each axis, a look (fill tone) from its material, and how it moves with each
state key (a delta transform per sampled value, or a rotation rate for 'scroll').
"""
import sys, json, base64, math
import numpy as np, cv2

src, dst = sys.argv[1], sys.argv[2]
D = json.load(open(src))
TOL = float(sys.argv[3]) if len(sys.argv) > 3 else None   # outline tolerance, mm (default: frame radius / 700)

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

out_meshes = []
for m in D['meshes']:
    i = m['id']
    if m['geo'] not in geos: continue
    pos, tri = geos[m['geo']]
    if len(tri) == 0: continue
    if m.get('inst'): continue
    if not m.get('mat') or str(m.get('name', '')).endswith(':cap'): continue          # helper meshes and section caps
    if any(o['geo'] == m['geo'] and o['id'] < m['id'] and o['path'] == m['path'].rsplit('/', 1)[0] for o in D['meshes']): continue
    M0 = mat(S0['M'][i])
    W = (M0 @ np.c_[pos, np.ones(len(pos))].T).T[:, :3]
    used = np.unique(tri)
    Wu = W[used]
    rec = {'id': i, 'name': m['name'], 'path': m['path'], 'vis': bool(S0['V'][i]), 'rings': {}, 'depth': {}}
    mt = m['mat'] or {}
    rec['look'] = {'color': mt.get('color'), 'lum': round(lum(mt.get('color')), 3), 'metal': mt.get('metal'), 'opacity': mt.get('opacity'),
                   'transparent': mt.get('transparent'), 'trans': mt.get('trans'), 'type': mt.get('type'), 'wire': mt.get('wire')}
    lo, hi = Wu.min(0), Wu.max(0)
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
open(dst, 'w').write(js)
print(D['key'], 'tol', round(tol, 4), len(out_meshes), 'meshes', len(js) // 1024, 'KB', 'res', round(res, 4), 'motion keys', {k: len(v) for k, v in motion.items()}, 'rot', len(rot), 'vis', list(vis_change), 'look', list(look_change))
