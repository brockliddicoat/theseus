"""Stage 6: per-vertex attributes + compact binaries for the three.js module -> assets/*.bin + assets/lattice.json

Per mesh: position f32x3, normal i16x3 (crease-split at 50 deg so cut edges stay crisp), index u32,
  aEta   u8   height above the inner wall (0..3 mm)          -> rib growth (setBuild)
  aWallN i8x3 inner-wall normal                              -> rib growth direction
  aOrder u8   build order of the nearest member (0..1)
  aOuter u8   1 on the coated outer skin, 0 on raw interior CF-PP
  aSP/aSS u8  stress (press / squeeze), 0..254 over the case's display range, 255 = outside the FE model
"""
import json, sys, numpy as np
from scipy.spatial import cKDTree
from scipy.sparse import coo_matrix
from field import *

ST_RANGE = {'press': 6.0, 'squeeze': 8.0}       # MPa, display range shared by both lattices

def crease_split(V, F, angle=50.0):
    V = np.asarray(V, np.float64); F = np.asarray(F, np.int64)
    fn = np.cross(V[F[:, 1]] - V[F[:, 0]], V[F[:, 2]] - V[F[:, 0]]); fa = np.linalg.norm(fn, axis=1)
    fn = fn / np.maximum(fa, 1e-12)[:, None]
    nv = len(V); corners_v = F.ravel(); corners_f = np.repeat(np.arange(len(F)), 3)
    order = np.argsort(corners_v, kind='stable'); cv = corners_v[order]; cf = corners_f[order]
    start = np.searchsorted(cv, np.arange(nv)); deg = np.diff(np.r_[start, len(cv)]); md = deg.max()
    pad = np.full((nv, md), -1)
    pos = np.arange(len(cv)) - start[cv]; pad[cv, pos] = cf
    valid = pad >= 0
    PN = np.where(valid[..., None], fn[np.maximum(pad, 0)], 0.0); PA = np.where(valid, fa[np.maximum(pad, 0)], 0.0)
    cosT = np.cos(np.radians(angle))
    dots = np.einsum('vik,vjk->vij', PN, PN)
    w = (dots > cosT) & valid[:, None, :] & valid[:, :, None]
    sm = np.einsum('vij,vj,vjk->vik', w.astype(float), PA, PN)
    sm /= np.maximum(np.linalg.norm(sm, axis=2, keepdims=True), 1e-12)
    corner_n = np.zeros((len(F) * 3, 3)); idx_c = order
    corner_n[idx_c] = sm[cv, pos]
    # unique (vertex, quantised normal)
    q = np.round(corner_n * 60).astype(np.int64)
    key = np.c_[corners_v, q]
    uq, first, inv = np.unique(key, axis=0, return_index=True, return_inverse=True)
    inv = inv.reshape(-1)
    V2 = V[corners_v[first]]; N2 = corner_n[first]; src = corners_v[first]
    F2 = inv.reshape(-1, 3)
    return V2, F2, N2, src

def smooth_vals(F, vals, iters=2, mask=None):
    n = len(vals)
    A = coo_matrix((np.ones(len(F) * 6), (np.r_[F[:, 0], F[:, 1], F[:, 2], F[:, 1], F[:, 2], F[:, 0]], np.r_[F[:, 1], F[:, 2], F[:, 0], F[:, 0], F[:, 1], F[:, 2]])), shape=(n, n)).tocsr()
    A.data[:] = 1.0; deg = np.asarray(A.sum(1)).ravel()
    v = vals.copy()
    for _ in range(iters):
        v = 0.5 * v + 0.5 * (A @ v) / np.maximum(deg, 1)
    return v

class Writer:
    def __init__(self, path): self.path = path; self.buf = bytearray(); self.items = {}
    def add(self, name, arr, ctype, item, norm=False):
        while len(self.buf) % 4: self.buf += b'\0'
        a = np.ascontiguousarray(arr); off = len(self.buf); self.buf += a.tobytes()
        self.items[name] = dict(offset=off, type=ctype, itemSize=item, normalized=norm, count=int(a.size // item))
    def save(self):
        open(self.path, 'wb').write(bytes(self.buf)); return dict(file=os.path.basename(self.path), bytes=len(self.buf), items=self.items)

fe = np.load(os.path.join(WORK, 'fe_fields.npz'))
fe_res = json.load(open(os.path.join(WORK, 'fe_results.json')))

def fe_samplers(kind, case, ext, S):
    """KD-trees for the FE results of one variant/case: rib beams at rib mid-height, wall shell centroids"""
    out = {}
    pts, sig = [], []
    for part in ('beam', 'rail'):
        k = f'{kind}|{case}|{part}|'
        if k + 'P1' not in fe: continue
        P1, P2, s_, h = fe[k + 'P1'], fe[k + 'P2'], fe[k + 'sig'], fe[k + 'h']
        for t in (0.15, 0.5, 0.85):
            Pm = P1 * (1 - t) + P2 * t
            nin = S.normal_in(Pm); T = wall_T(Pm)
            pts.append(Pm + nin * (T / 2 + h / 2)[:, None]); sig.append(s_)
    out['rib'] = (cKDTree(np.concatenate(pts)), np.concatenate(sig))
    C = fe[f'{kind}|{case}|wall|C']; out['wall'] = (cKDTree(C), fe[f'{kind}|{case}|wall|vm'])
    return out

def flow_segments(kind, case, S):
    k = f'{kind}|{case}|beam|'
    P1, P2, N, h = fe[k + 'P1'], fe[k + 'P2'], fe[k + 'N'], fe[k + 'h']
    lift = lambda Q: Q + S.normal_in(Q) * (wall_T(Q) / 2 + h + 0.25)[:, None]
    return np.c_[lift(P1), lift(P2), N].astype(np.float32)

def export_variant(kind, wscale, W, manifest):
    Fd = Field(kind, wscale); S = Fd.S
    meta = Fd.meta
    orders = np.array([m['order'] for m in meta])
    for part in ('body', 'trigL', 'trigR'):
        d = np.load(os.path.join(WORK, f'mesh_{kind}_{part}.npz')); V, F = d['V'], d['F']
        V2, F2, N2, src = crease_split(V, F)
        f, parts = Fd.eval(V2.astype(np.float64), want_parts=True)
        eta = np.clip(parts['eta'], 0, 3.0); nin = parts['nin']; memb = parts['memb']; D = parts['D']
        order = np.where(memb >= 0, orders[np.maximum(memb, 0)], 0.0)
        # bosses grow last, out of the wall
        for b in Fd.L['bosses']:
            rho = np.hypot(V2[:, 0] - b['x'], V2[:, 2] - b['z'])
            inb = (rho < b['od'] / 2 + 0.9) & (V2[:, 1] > b['y0'] - 0.5) & (V2[:, 1] < b['y1'] + 0.9)
            order[inb] = 0.97
            # boss growth: collapse toward the wall horizontally by the distance from the inner wall
            eta[inb] = np.clip(parts['eta'][inb], 0, 3.0)
        outer = (D > -0.35 * wall_T(V2)).astype(np.uint8) * 255
        sp = np.full(len(V2), 255, np.uint8); ss = np.full(len(V2), 255, np.uint8)
        if part == 'body':
            for case, arr in (('press', 'sp'), ('squeeze', 'ss')):
                smp = fe_samplers(kind, case, Fd.ext, S)
                dr, ir = smp['rib'][0].query(V2, k=1); dw, iw = smp['wall'][0].query(V2, k=1)
                onrib = (parts['eta'] > 0.12) & (dr < 2.2)
                val = np.where(onrib, smp['rib'][1][ir], smp['wall'][1][iw])
                val = smooth_vals(F2, val, 2)
                q = np.clip(np.round(val / ST_RANGE[case] * 254), 0, 254).astype(np.uint8)
                q[(dw > 4.0) & ~onrib] = 255
                if arr == 'sp': sp = q
                else: ss = q
        name = f'{kind}_{part}'
        W.add(name + '.position', V2.astype(np.float32), 'f32', 3)
        W.add(name + '.normal', np.round(N2 * 32767).astype(np.int16), 'i16', 3, True)
        W.add(name + '.index', F2.astype(np.uint32), 'u32', 1)
        W.add(name + '.aEta', np.round(eta / 3.0 * 255).astype(np.uint8), 'u8', 1, True)
        W.add(name + '.aWallN', np.round(nin * 127).astype(np.int8), 'i8', 3, True)
        W.add(name + '.aOrder', np.round(np.clip(order, 0, 1) * 255).astype(np.uint8), 'u8', 1, True)
        W.add(name + '.aOuter', outer, 'u8', 1, True)
        W.add(name + '.aSP', sp, 'u8', 1, True); W.add(name + '.aSS', ss, 'u8', 1, True)
        manifest['meshes'][name] = dict(vertices=int(len(V2)), triangles=int(len(F2)), bbox=[V2.min(0).tolist(), V2.max(0).tolist()])
        print(name, len(V2), 'verts', len(F2), 'tris')
    for case in ('press', 'squeeze'):
        W.add(f'flow_{kind}_{case}', flow_segments(kind, case, S), 'f32', 7)

if __name__ == '__main__':
    manifest = dict(meshes={}, units='mm', axes='+X scan side-button side, +Y up, +Z forward')
    ws = json.load(open(os.path.join(WORK, 'hex_wscale.json')))['wscale']
    for kind, wsc in (('tri', 1.0), ('hex', ws)):
        W = Writer(os.path.join(ASSETS, f'lattice_{kind}.bin'))
        export_variant(kind, wsc, W, manifest)
        manifest[kind] = W.save()
    jdump(manifest, os.path.join(WORK, 'manifest.json'))
    print('saved', {k: manifest[k]['bytes'] for k in ('tri', 'hex')})
