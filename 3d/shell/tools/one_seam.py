#!/usr/bin/env python3
"""One seam from the nose to the rear seam, the wheel sitting in it, as on the Sora (Brock, 2026-11-04: "it forks which
it shouldn't, it has a center strip, which it shouldn't").

The pipeline that built shell-theseus.glb (trimesh, pymeshlab, igl) is not available here, so this edits its output
with numpy only and writes shell-theseus-1seam.glb next to it (the original stays as it was):

1. the centre cap ahead of the wheel ('bridge', #58 of the first build) is split at x = 0 into two halves with a real
   0.25 mm gap, the same width as the centre split behind the wheel; each cut is closed by a flat face, and the skin
   beside the new split is darkened in COLOR_0 like the other seam cavities;
2. each half is merged into its trigger mesh (so it moves with that click);
3. the old groove between the cap and each trigger is covered by a strip of skin, lofted between the cap's skin at
   x = ±XB and the trigger's skin at x = ±XT (cross-sections of the two meshes), 4 µm proud, with their normals;
4. the 'bridge' node loses its mesh (the shell builder then skips it).

    python3 -I shell/tools/one_seam.py          (from 3d/)
"""
import json, os, struct, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import glbio

SRC = os.path.join(HERE, '..', 'shell-theseus.glb')
DST = os.path.join(HERE, '..', 'shell-theseus-1seam.glb')
XC = 0.125              # half the centre split (the trigger halves behind the wheel stop at x = ±0.12)
XB, XT = 4.20, 5.25     # the loft runs from the cap's flat skin (its edge round starts at 4.29) to the trigger's (5.12)
Z0 = 46.62              # the cap's rear edge round ends here (the wheel opening's front edge is at z = 46.40)
LIFT = 0.004

def clip(P, A, tri, f):
    """Keep the part of a triangle mesh where f(p) >= 0 (f linear). P (n,3) positions, A list of (n,k) attributes
    interpolated at the cut. Returns new P, A, tri and the cut segments (pairs of new vertex indices)."""
    d = f(P)
    P = list(map(tuple, P)); A = [list(map(tuple, a)) for a in A]
    out, segs, memo = [], [], {}
    def cut(i, j):
        key = (min(i, j), max(i, j))
        if key in memo: return memo[key]
        t = d[i] / (d[i] - d[j])
        p = tuple(np.asarray(P[i]) + t * (np.asarray(P[j]) - np.asarray(P[i])))
        P.append(p)
        for a in A: a.append(tuple(np.asarray(a[i]) + t * (np.asarray(a[j]) - np.asarray(a[i]))))
        memo[key] = len(P) - 1
        return memo[key]
    for (i, j, k) in tri:
        ins = [d[v] >= 0 for v in (i, j, k)]
        n = sum(ins)
        if n == 3: out.append((i, j, k)); continue
        if n == 0: continue
        vs = [i, j, k]
        # rotate so the odd one out is first
        if n == 1: r = ins.index(True)
        else: r = ins.index(False)
        a, b, c = vs[r], vs[(r + 1) % 3], vs[(r + 2) % 3]
        ab, ac = cut(a, b), cut(a, c)
        if n == 1: out.append((a, ab, ac)); segs.append((ab, ac))
        else: out.append((ab, b, c)); out.append((ab, c, ac)); segs.append((ac, ab))
    return np.asarray(P), [np.asarray(a) for a in A], np.asarray(out, dtype=np.int64), segs

def chains(segs):
    """Chain cut segments (directed pairs) into loops/polylines of vertex indices."""
    nxt = {}
    for a, b in segs: nxt.setdefault(a, []).append(b)
    used, out = set(), []
    for a, b in segs:
        if (a, b) in used: continue
        ch = [a]; cur = a
        while True:
            cand = [x for x in nxt.get(cur, []) if (cur, x) not in used]
            if not cand: break
            x = cand[0]; used.add((cur, x)); ch.append(x); cur = x
            if x == ch[0]: break
        out.append(ch)
    return out

def weld(P, tol=1e-6):
    q = np.round(P / tol).astype(np.int64)
    _, first, inv = np.unique(q, axis=0, return_index=True, return_inverse=True)
    return first, inv.reshape(-1)

def ear_clip(poly):
    """Triangulate a simple 2D polygon (list of (u, v)), any orientation. Returns index triples."""
    pts = np.asarray(poly, dtype=float); n = len(pts)
    area = 0.5 * np.sum(pts[:, 0] * np.roll(pts[:, 1], -1) - np.roll(pts[:, 0], -1) * pts[:, 1])
    idx = list(range(n)) if area > 0 else list(range(n))[::-1]
    tris = []
    def inside(p, a, b, c):
        def s(p1, p2, p3): return (p1[0] - p3[0]) * (p2[1] - p3[1]) - (p2[0] - p3[0]) * (p1[1] - p3[1])
        d1, d2, d3 = s(p, a, b), s(p, b, c), s(p, c, a)
        return not ((d1 < 0 or d2 < 0 or d3 < 0) and (d1 > 0 or d2 > 0 or d3 > 0))
    guard = 0
    while len(idx) > 3 and guard < 100000:
        guard += 1; m = len(idx); found = False
        for t in range(m):
            i0, i1, i2 = idx[(t - 1) % m], idx[t], idx[(t + 1) % m]
            a, b, c = pts[i0], pts[i1], pts[i2]
            if (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]) <= 1e-14: continue
            if any(inside(pts[j], a, b, c) for j in idx if j not in (i0, i1, i2)): continue
            tris.append((i0, i1, i2)); idx.pop(t); found = True; break
        if not found: idx.pop(0)          # degenerate sliver: drop a vertex rather than loop forever
    if len(idx) == 3: tris.append(tuple(idx))
    return tris

def section(P, N, tri, x0):
    """Cross-section of a mesh with the plane x = x0: polylines of (point, normal), interpolated."""
    d = P[:, 0] - x0
    pts = []
    for (i, j, k) in tri:
        s = []
        for a, b in ((i, j), (j, k), (k, i)):
            if (d[a] >= 0) != (d[b] >= 0):
                t = d[a] / (d[a] - d[b]); s.append((P[a] + t * (P[b] - P[a]), N[a] + t * (N[b] - N[a])))
        if len(s) == 2: pts.append(s)
    return pts

def top_skin_curve(P, N, tri, x0, z_from):
    """The top skin's cross-section at x = x0, from z_from to the lip, as an ordered (m, 3) curve with normals.
    Top skin = outward normal facing up or forward (the nose face), above the lip seam."""
    segs = section(P, N, tri, x0)
    pts = []
    for s in segs:
        for p, n in s:
            nn = n / (np.linalg.norm(n) + 1e-12)
            if p[2] >= z_from and (nn[1] > 0.2 or (nn[2] > 0.6 and p[1] > 10.45)): pts.append((p, nn))
    pts.sort(key=lambda q: q[0][2])
    # dedupe and order along the profile: by z, then drop points that fold back (the front face turns down)
    out = []
    for p, n in pts:
        if out and np.linalg.norm(p - out[-1][0]) < 1e-4: continue
        out.append((p, n))
    # the front face runs down in y at nearly constant z: order the tail by descending y once z stops growing
    zs = np.array([p[2] for p, _ in out]); ys = np.array([p[1] for p, _ in out])
    k = int(np.argmax(zs > zs.max() - 0.45)) if len(zs) else 0
    head, tail = out[:k], sorted(out[k:], key=lambda q: -q[0][1])
    return head + tail

def resample(curve, n):
    P = np.array([p for p, _ in curve]); N = np.array([q for _, q in curve])
    s = np.concatenate([[0], np.cumsum(np.linalg.norm(np.diff(P, axis=0), axis=1))]); s /= s[-1]
    u = np.linspace(0, 1, n)
    Pr = np.stack([np.interp(u, s, P[:, i]) for i in range(3)], 1)
    Nr = np.stack([np.interp(u, s, N[:, i]) for i in range(3)], 1); Nr /= np.linalg.norm(Nr, axis=1, keepdims=True)
    return Pr, Nr

def process(js, b, side):
    sx = 1 if side == 'L' else -1
    _, T = glbio.mesh_arrays(js, b, 'trigger' + side)
    _, B = glbio.mesh_arrays(js, b, 'bridge')
    def tris(M): return M['indices'].reshape(-1, 3).astype(np.int64)
    # 1. the cap's half on this side, cut at x = ±XC
    cP, (cN, cC), cT, segs = clip(B['POSITION'].astype(float), [B['NORMAL'].astype(float), B['COLOR_0'].astype(float)], tris(B), lambda p: sx * p[:, 0] - XC)
    # close the cut: one flat face per loop, facing the gap
    capP, capT = [], []
    for ch in chains(segs):
        if len(ch) < 4 or ch[0] != ch[-1]: continue
        loop = ch[:-1]
        uv = [(cP[v][2], cP[v][1]) for v in loop]
        for (a, c2, d) in ear_clip(uv):
            capT.append((loop[a], loop[c2], loop[d]))
    # the cut face's own vertices (flat normal toward the gap, dark: it is inside the split)
    base = len(cP)
    used = sorted({v for t in capT for v in t}); remap = {v: base + i for i, v in enumerate(used)}
    addP = cP[used]; addN = np.tile([-sx, 0.0, 0.0], (len(used), 1)); addC = np.tile([0.18, 0.18, 0.18, 1.0], (len(used), 1))
    faceT = []
    for (a, c2, d) in capT:
        ta = np.array([cP[a], cP[c2], cP[d]]); nrm = np.cross(ta[1] - ta[0], ta[2] - ta[0])
        faceT.append((remap[a], remap[c2], remap[d]) if nrm[0] * -sx > 0 else (remap[a], remap[d], remap[c2]))
    cP = np.vstack([cP, addP]); cN = np.vstack([cN, addN]); cC = np.vstack([cC, addC]); cT = np.vstack([cT, np.asarray(faceT, dtype=np.int64).reshape(-1, 3)])
    # seam-cavity darkening on the skin beside the new split, like the other seams (0.15 at the edge → 1 at 0.7 mm)
    dist = np.abs(cP[:, 0]) - XC
    k = np.clip(dist / 0.7, 0, 1); k = k * k * (3 - 2 * k)
    skin = cN[:, 1] > -0.2
    cC[skin, :3] = np.minimum(cC[skin, :3], (0.15 + 0.85 * k[skin])[:, None])
    # 2. the loft over the old groove: cap skin at ±XB → trigger skin at ±XT, z from Z0 to the lip
    curveB = top_skin_curve(B['POSITION'].astype(float), B['NORMAL'].astype(float), tris(B), sx * XB, Z0)
    curveT = top_skin_curve(T['POSITION'].astype(float), T['NORMAL'].astype(float), tris(T), sx * XT, Z0)
    nS = 160
    PB, NB = resample(curveB, nS); PT_, NT_ = resample(curveT, nS)
    cols = 4
    sP, sN, sT = [], [], []
    for i in range(nS):
        for c in range(cols + 1):
            w = c / cols
            p = PB[i] * (1 - w) + PT_[i] * w; n = NB[i] * (1 - w) + NT_[i] * w; n /= np.linalg.norm(n)
            sP.append(p + n * LIFT); sN.append(n)
    for i in range(nS - 1):
        for c in range(cols):
            a = i * (cols + 1) + c; b2 = a + 1; d = a + (cols + 1); e = d + 1
            for t3 in ((a, d, b2), (b2, d, e)):
                pa, pb, pc = sP[t3[0]], sP[t3[1]], sP[t3[2]]
                nrm = np.cross(pb - pa, pc - pa)
                sT.append(t3 if np.dot(nrm, sN[t3[0]]) > 0 else (t3[0], t3[2], t3[1]))
    sP = np.asarray(sP); sN = np.asarray(sN); sC = np.ones((len(sP), 4)); sT = np.asarray(sT, dtype=np.int64)
    # 3. merge: trigger + cap half + loft
    oP = T['POSITION'].astype(float); oN = T['NORMAL'].astype(float); oC = T['COLOR_0'].astype(float); oT = tris(T)
    allP = np.vstack([oP, cP, sP]); allN = np.vstack([oN, cN, sN]); allC = np.vstack([oC, cC, sC])
    allT = np.vstack([oT, cT + len(oP), sT + len(oP) + len(cP)])
    info = dict(side=side, trigger=len(oT), cap=len(cT), capFace=len(faceT), loft=len(sT), loftLen=(len(curveB), len(curveT)),
                loftZ=(round(float(PB[0, 2]), 3), round(float(PB[-1, 2]), 3)), loftY=(round(float(PB[0, 1]), 3), round(float(PB[-1, 1]), 3)))
    return allP.astype(np.float32), allN.astype(np.float32), allC, allT.astype(np.uint32), info

def write(js, b, replace, drop, dst):
    """Re-pack the GLB: every existing buffer view copied, the replaced meshes' attributes appended, 'drop' nodes lose
    their mesh."""
    js = json.loads(json.dumps(js))
    blob = bytearray(b)
    def pad():
        while len(blob) % 4: blob.append(0)
    def add_view(arr, target):
        pad(); off = len(blob); blob.extend(arr.tobytes())
        js['bufferViews'].append({'buffer': 0, 'byteOffset': off, 'byteLength': arr.nbytes, 'target': target})
        return len(js['bufferViews']) - 1
    def add_acc(arr, comp, typ, normalized=False, minmax=False):
        v = add_view(arr, 34963 if typ == 'SCALAR' else 34962)
        a = {'bufferView': v, 'componentType': comp, 'count': int(arr.shape[0]), 'type': typ}
        if normalized: a['normalized'] = True
        if minmax: a['min'] = [float(x) for x in arr.min(0)]; a['max'] = [float(x) for x in arr.max(0)]
        js['accessors'].append(a); return len(js['accessors']) - 1
    for name, (P, N, C, T) in replace.items():
        node = next(n for n in js['nodes'] if n.get('name') == name)
        prim = js['meshes'][node['mesh']]['primitives'][0]
        prim['attributes']['POSITION'] = add_acc(np.ascontiguousarray(P, dtype=np.float32), 5126, 'VEC3', minmax=True)
        prim['attributes']['NORMAL'] = add_acc(np.ascontiguousarray(N / np.linalg.norm(N, axis=1, keepdims=True), dtype=np.float32), 5126, 'VEC3')
        prim['attributes']['COLOR_0'] = add_acc(np.ascontiguousarray(np.clip(np.round(C * 255), 0, 255), dtype=np.uint8), 5121, 'VEC4', normalized=True)
        prim['indices'] = add_acc(np.ascontiguousarray(T.reshape(-1), dtype=np.uint32), 5125, 'SCALAR')
    for name in drop:
        node = next(n for n in js['nodes'] if n.get('name') == name)
        node.pop('mesh', None); node['name'] = name + '_removed'
    # compact: keep only the buffer views that some primitive still uses (the replaced ones are dropped)
    used_acc = set()
    for n in js['nodes']:
        if 'mesh' not in n: continue
        for p in js['meshes'][n['mesh']]['primitives']:
            used_acc.update(p['attributes'].values()); used_acc.add(p['indices'])
    used_bv = sorted({js['accessors'][a]['bufferView'] for a in used_acc})
    new_blob = bytearray(); bv_map = {}
    for old in used_bv:
        v = js['bufferViews'][old]
        while len(new_blob) % 4: new_blob.append(0)
        off = len(new_blob); new_blob.extend(blob[v.get('byteOffset', 0): v.get('byteOffset', 0) + v['byteLength']])
        nv = dict(v); nv['byteOffset'] = off; bv_map[old] = len(bv_map); js['bufferViews'][old] = nv
    js['bufferViews'] = [js['bufferViews'][o] for o in used_bv]
    acc_map = {}
    accs = []
    for i, a in enumerate(js['accessors']):
        if i in used_acc: a = dict(a); a['bufferView'] = bv_map[a['bufferView']]; acc_map[i] = len(accs); accs.append(a)
    js['accessors'] = accs
    used_mesh = sorted({n['mesh'] for n in js['nodes'] if 'mesh' in n}); mesh_map = {o: i for i, o in enumerate(used_mesh)}
    meshes = []
    for o in used_mesh:
        m = js['meshes'][o]
        for p in m['primitives']:
            p['attributes'] = {k: acc_map[v] for k, v in p['attributes'].items()}; p['indices'] = acc_map[p['indices']]
        meshes.append(m)
    js['meshes'] = meshes
    for n in js['nodes']:
        if 'mesh' in n: n['mesh'] = mesh_map[n['mesh']]
    blob = new_blob
    pad()
    js['buffers'] = [{'byteLength': len(blob)}]
    j = json.dumps(js, separators=(',', ':')).encode()
    while len(j) % 4: j += b' '
    out = struct.pack('<III', 0x46546C67, 2, 12 + 8 + len(j) + 8 + len(blob)) + struct.pack('<II', len(j), 0x4E4F534A) + j + struct.pack('<II', len(blob), 0x004E4942) + bytes(blob)
    tmp = dst + '.tmp'; open(tmp, 'wb').write(out); os.replace(tmp, dst)
    return len(out)

if __name__ == '__main__':
    js, b = glbio.read(SRC)
    rep = {}
    for side in ('L', 'R'):
        P, N, C, T, info = process(js, b, side)
        rep['trigger' + side] = (P, N, C, T)
        print(info)
    size = write(js, b, rep, ['bridge'], DST)
    print('wrote', DST, size // 1024, 'KB')
