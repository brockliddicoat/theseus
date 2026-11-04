"""The lattice study (3d/lattice) as 2D outlines for the deck's 2D mode.

  python3 tools/geo2d/lattice2d.py ../3d/lattice/assets geo2d/lattice.json

Views (all orthographic, mm, the lattice's own axes: +Y up, +Z forward, +X the side-button side):
  bottom   from below, both lattices: the shell's outline, its open inside, the ribs banded by stress under the
           press on the crown (the colours of the 3D stress view), and the ribs without stress
  side     the shell cut on its midplane (x = 0) and seen from -X: the far half's inside, its ribs in the order the
           3D grows them, the cut wall (the 3D's yellow caps) and the board stand-in with its tie points;
           plus the whole shell's outline, uncut
  node     the 6-way crown node of the fillet study, looked at along the node normal: the ribs' plan and
           contour lines of their height above the wall
"""
import sys, json, math
import numpy as np, cv2

src, dst = sys.argv[1], sys.argv[2]
M = json.load(open(src + '/lattice.json'))
TT = {'f32': np.float32, 'i16': np.int16, 'i8': np.int8, 'u8': np.uint8, 'u16': np.uint16, 'u32': np.uint32}
TOL = 0.08
Q = 1.0 / (TOL / 2)

def load(kind):
    buf = open(src + '/' + M[kind]['file'], 'rb').read()
    items = M[kind]['items']
    def get(k):
        it = items[k]; a = np.frombuffer(buf, dtype=TT[it['type']], count=it['count'] * it['itemSize'], offset=it['offset']).reshape(-1, it['itemSize'])
        return a.astype(float) / (255.0 if it.get('normalized') and it['type'] == 'u8' else 1.0)
    return get, items

def rings_of(mask, u0, v0, res, min_area=3, eps=0.7):
    cs, hier = cv2.findContours(mask, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)
    out = []
    if hier is None: return out
    for ci, c in enumerate(cs):
        if cv2.contourArea(c) < min_area: continue
        ap = cv2.approxPolyDP(c, eps, True).reshape(-1, 2)
        if len(ap) < 3: continue
        uu = u0 + (ap[:, 0] + 0.5) * res; vv = v0 + (ap[:, 1] + 0.5) * res
        q = np.round(np.stack([uu, vv], 1) * Q).astype(int)
        d = np.vstack([q[:1], np.diff(q, axis=0)]).reshape(-1)
        out.append({'h': 1 if hier[0][ci][3] >= 0 else 0, 'd': d.tolist()})
    return out

class Raster:
    """an orthographic raster over a fixed window (u0..u1, v0..v1) in mm"""
    def __init__(self, u0, u1, v0, v1, res):
        self.u0, self.v0, self.res = u0, v0, res
        self.W = int(math.ceil((u1 - u0) / res)) + 2; self.H = int(math.ceil((v1 - v0) / res)) + 2
    def mask(self, U, V, tri, close=True):
        m = np.zeros((self.H, self.W), np.uint8)
        sh = 4
        px = np.round((U - self.u0) / self.res * (1 << sh)).astype(np.int32)
        py = np.round((V - self.v0) / self.res * (1 << sh)).astype(np.int32)
        P = np.stack([px[tri], py[tri]], axis=-1)
        for T3 in P: cv2.fillConvexPoly(m, T3, 255, lineType=cv2.LINE_8, shift=sh)
        if close: m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8))
        return m
    def rings(self, m, **k): return rings_of(m, self.u0, self.v0, self.res, **k)

out = {'key': 'lattice', 'tol': TOL, 'q': Q, 'r': 69.83, 'center': [0, 19.075, -0.04], 'ramp': M['stressScale']['ramp'], 'range': M['stressScale']['range'],
       'bottom': {}, 'side': {}, 'gap': 72}
RES = TOL / 1.6
NB = 6        # stress bands
NO = 16       # growth steps

for kind in ['tri', 'hex']:
    get, items = load(kind)
    parts = {}
    for part in ['body', 'trigL', 'trigR']:
        P = get(f'{kind}_{part}.position'); I = get(f'{kind}_{part}.index').astype(np.int64).reshape(-1, 3)
        parts[part] = dict(P=P, I=I, eta=get(f'{kind}_{part}.aEta')[:, 0], order=get(f'{kind}_{part}.aOrder')[:, 0], outer=get(f'{kind}_{part}.aOuter')[:, 0],
                           sp=get(f'{kind}_{part}.aSP')[:, 0], ss=get(f'{kind}_{part}.aSS')[:, 0])
    allP = np.vstack([p['P'] for p in parts.values()])
    lo, hi = allP.min(0) - 1, allP.max(0) + 1
    # ---------- bottom: X across, Z along ----------
    R = Raster(lo[0], hi[0], lo[2], hi[2], RES)
    B = {'outline': [], 'inside': [], 'ribs': [], 'bands': [[] for _ in range(NB)]}
    full = np.zeros((R.H, R.W), np.uint8); inside = np.zeros_like(full); ribs = np.zeros_like(full); bands = [np.zeros_like(full) for _ in range(NB)]
    for part, p in parts.items():
        P, I = p['P'], p['I']
        full |= R.mask(P[:, 0], P[:, 2], I)
        tri_eta = p['eta'][I].min(1); tri_out = p['outer'][I].max(1)
        inner = I[tri_out < 0.5]
        inside |= R.mask(P[:, 0], P[:, 2], inner)
        rb = I[tri_eta > 0.02]
        ribs |= R.mask(P[:, 0], P[:, 2], rb)
        sv = p['sp'][rb]; s = sv.mean(1) * 255 / 254
        ok = sv.max(1) <= 0.998                                  # 255 means no data (the triggers, the bosses): left uncoloured, as in 3D
        for b in range(NB):
            sel = rb[ok & (s >= b / NB) & ((s < (b + 1) / NB) if b < NB - 1 else (s >= b / NB))]
            if len(sel): bands[b] |= R.mask(P[:, 0], P[:, 2], sel)
    # the bands are drawn in order, so each keeps only what no higher band covers (the most stressed rib on top)
    B['outline'] = R.rings(full); B['inside'] = R.rings(inside); B['ribs'] = R.rings(ribs)
    for b in range(NB): B['bands'][b] = R.rings(bands[b], min_area=2)
    out['bottom'][kind] = B
    print(kind, 'bottom', sum(len(json.dumps(v)) for v in B.values()) // 1024, 'KB')
    if kind != 'tri': continue
    # ---------- side: from -X, Z across (to the right, nose right), Y up; the half x > 0 ----------
    R2 = Raster(lo[2], hi[2], lo[1], hi[1], RES)
    ext = np.zeros((R2.H, R2.W), np.uint8); far = np.zeros_like(ext); grown = [np.zeros_like(ext) for _ in range(NO)]
    segs = []
    for part, p in parts.items():
        P, I = p['P'], p['I']
        ext |= R2.mask(P[:, 2], P[:, 1], I)
        cx = P[I][:, :, 0].mean(1)
        fh = I[cx > 0]
        far |= R2.mask(P[:, 2], P[:, 1], fh[p['outer'][fh].max(1) < 0.5])
        rb = fh[p['eta'][fh].min(1) > 0.02]
        o = p['order'][rb].max(1)
        for b in range(NO):
            sel = rb[(o >= b / NO) & (o < (b + 1) / NO)] if b < NO - 1 else rb[o >= b / NO]
            if len(sel): grown[b] |= R2.mask(P[:, 2], P[:, 1], sel)
        # the cut: where the wall crosses x = 0, as closed loops (material inside)
        X = P[:, 0]; T = I
        sx = X[T]
        cross = ((sx > 0).any(1)) & ((sx < 0).any(1))
        for t3 in T[cross]:
            pts = []
            for a, b in ((0, 1), (1, 2), (2, 0)):
                xa, xb = X[t3[a]], X[t3[b]]
                if (xa > 0) != (xb > 0):
                    f = xa / (xa - xb); pa, pb = P[t3[a]], P[t3[b]]
                    pts.append((pa[2] + (pb[2] - pa[2]) * f, pa[1] + (pb[1] - pa[1]) * f))
            if len(pts) == 2: segs.append(pts)
    # fill the cut loops by parity on a raster: every segment is an edge of the section polygon
    sec = np.zeros((R2.H, R2.W), np.uint8)
    if segs:
        S = np.array(segs)                                     # (n, 2, 2) in (z, y)
        canvas = np.zeros((R2.H, R2.W), np.int32)
        # scanline parity: for each row, x-crossings of the segments
        ys = (np.arange(R2.H) + 0.5) * R2.res + R2.v0
        z0, y0, z1, y1 = S[:, 0, 0], S[:, 0, 1], S[:, 1, 0], S[:, 1, 1]
        for r, yy in enumerate(ys):
            m = ((y0 <= yy) & (y1 > yy)) | ((y1 <= yy) & (y0 > yy))
            if not m.any(): continue
            zz = z0[m] + (yy - y0[m]) * (z1[m] - z0[m]) / (y1[m] - y0[m])
            zz.sort()
            for a, b in zip(zz[0::2], zz[1::2]):
                c0 = int(round((a - R2.u0) / R2.res)); c1 = int(round((b - R2.u0) / R2.res))
                if c1 > c0: sec[r, max(0, c0):min(R2.W, c1)] = 255
    Sd = {'ext': R2.rings(ext), 'far': R2.rings(far), 'cut': R2.rings(sec, min_area=2), 'grow': [R2.rings(g, min_area=2) for g in grown]}
    lay = M['layout']
    Sd['pcb'] = {'y0': lay['pcb']['y0'], 't': lay['pcb']['t'], 'z': [min(p[1] for p in lay['pcb']['outline']), max(p[1] for p in lay['pcb']['outline'])]}
    Sd['ties'] = [[round(t['p'][0], 2), round(t['p'][1], 2), round(t['p'][2], 2)] for t in lay['ties']]
    Sd['bosses'] = [{'x': b['x'], 'z': b['z'], 'y0': b['y0'], 'y1': b['y1'], 'od': b['od']} for b in lay['bosses']]
    out['side'] = Sd
    print('side', len(json.dumps(Sd)) // 1024, 'KB')

# ---------- node: the fillet study's patch, along the node normal ----------
F = M['fillet']
try:
    getp, itp = load('patch')
    P = getp('patch.position'); I = getp('patch.index').astype(np.int64).reshape(-1, 3)
    n = np.array(F['node'] and F['normal']); n = n / np.linalg.norm(n)
    c = np.array(F['node'])
    # a frame on the plane: e1 roughly along +X, e2 = n x e1
    e1 = np.array([1.0, 0, 0]); e1 -= n * e1.dot(n); e1 /= np.linalg.norm(e1); e2 = np.cross(n, e1)
    rel = P - c
    U, V = rel @ e1, rel @ e2
    eta = getp('patch.aEta')[:, 0]
    lo2 = np.array([U.min(), V.min()]); hi2 = np.array([U.max(), V.max()])
    RN = Raster(lo2[0], hi2[0], lo2[1], hi2[1], 0.012)
    have = RN.mask(U, V, I)
    te = eta[I].mean(1)
    lev = {}
    # rib material from the wall up: the root fillets (low), the rib flanks, the rib tops (aEta is the height off the wall)
    for L in [0.012, 0.06, 0.12, 0.18]:
        lev[str(L)] = RN.rings(RN.mask(U, V, I[te > L]), min_area=4, eps=0.6)
    out['node'] = {'c': [round(v, 3) for v in c], 'n': [round(v, 4) for v in n], 'e1': [round(v, 4) for v in e1], 'e2': [round(v, 4) for v in e2],
                   'box': [round(lo2[0], 3), round(lo2[1], 3), round(hi2[0], 3), round(hi2[1], 3)], 'lev': lev,
                   'have': RN.rings(have, min_area=4)}
    print('node', len(json.dumps(out['node'])) // 1024, 'KB')
except Exception as e:
    print('node skipped', e)

js = json.dumps(out, separators=(',', ':'))
open(dst, 'w').write(js)
print('lattice', len(js) // 1024, 'KB')
