"""The hand drawn as the film draws a finger (06-motion.js, Brock's "A Line" with "A Soft" nails): a flat lit grey, a flat shadow
grey beyond one smooth light/shadow line, a light outline round the silhouette and wherever one part passes in front of another,
traced as vector paths from the posed open hand model (hand_pose.py). Writes deck/tools/gd/out/hand3/<view>.json (paths in mm,
x toward the fingertips, y up, the index knuckle at the origin) and a preview PNG.
  python3 -I deck/tools/gd/hand_draw.py
The light/shadow line: the skin's normals smoothed over the surface (so the knuckles' small bumps don't break it up), lit from the
stage's light (FNG_LIGHT: from above, a little left) tipped 11.5 deg toward the viewer, so a straight finger's lower 40 % is in
shadow, as the film's finger is (termA). Lines: where the depth jumps by more than DJ mm across a part's edge, on the nearer
side's edge; where a finger joins the palm the skin runs on and no line is drawn."""
import json, os, sys
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage, sparse
from skimage import measure
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from hand_pose import Hand, rot, FING

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'out', 'hand3')
PARTS = ['body', 'thumb', 'index', 'middle', 'ring', 'little']
DJ = 4.0           # mm of depth across an edge that makes a line
S_PX = 10.0        # px per mm for the fields
THUMB_TURN = [('index-finger-phalanx-proximal:0', 16)]   # the thumb's metacarpal about its base (an estimate)


def basis(view, up):
    v = np.asarray(view, float); v /= np.linalg.norm(v); u = np.asarray(up, float); u = u - v * (u @ v); u /= np.linalg.norm(u)
    return np.cross(u, v), u, -v      # right, up, toward the viewer


def smooth_normals(V, F, it=160):
    n = np.zeros_like(V)
    fn = np.cross(V[F[:, 1]] - V[F[:, 0]], V[F[:, 2]] - V[F[:, 0]])
    for k in range(3): np.add.at(n, F[:, k], fn)
    n /= np.linalg.norm(n, axis=1)[:, None] + 1e-12
    i = np.r_[F[:, 0], F[:, 1], F[:, 2], F[:, 1], F[:, 2], F[:, 0]]; j = np.r_[F[:, 1], F[:, 2], F[:, 0], F[:, 0], F[:, 1], F[:, 2]]
    A = sparse.csr_matrix((np.ones(len(i)), (i, j)), shape=(len(V), len(V))); A.data[:] = 1
    A = sparse.diags(1 / np.asarray(A.sum(1)).ravel()) @ A
    for _ in range(it):
        n = 0.5 * n + 0.5 * (A @ n); n /= np.linalg.norm(n, axis=1)[:, None] + 1e-12
    return n


def raster(X, Y, Z, F, tris, box, s):
    """painter's order into an id image; per pixel: triangle, barycentrics, depth"""
    x0, y1, W, H = box
    px = (X - x0) * s; py = (y1 - Y) * s
    order = tris[np.argsort(Z[F[tris]].mean(1))]
    im = Image.new('I', (W, H), 0); d = ImageDraw.Draw(im)
    for t in order:
        a, b, c = F[t]
        d.polygon([(px[a], py[a]), (px[b], py[b]), (px[c], py[c])], fill=int(t) + 1)
    tid = np.array(im).astype(np.int64) - 1
    yy, xx = np.nonzero(tid >= 0); t = tid[yy, xx]
    A, B, C = F[t, 0], F[t, 1], F[t, 2]
    cx, cy = xx + 0.5, yy + 0.5
    v0x, v0y = px[B] - px[A], py[B] - py[A]; v1x, v1y = px[C] - px[A], py[C] - py[A]; v2x, v2y = cx - px[A], cy - py[A]
    den = v0x * v1y - v1x * v0y; den = np.where(np.abs(den) < 1e-9, 1e-9, den)
    l1 = (v2x * v1y - v1x * v2y) / den; l2 = (v0x * v2y - v2x * v0y) / den; l0 = 1 - l1 - l2
    lam = np.clip(np.stack([l0, l1, l2], 1), 0, 1); lam /= lam.sum(1, keepdims=True)
    return dict(tid=tid, yy=yy, xx=xx, t=t, lam=lam, abc=np.stack([A, B, C], 1))


def interp(R, attr, H, W, fill=np.nan):
    """a per-vertex attribute (n,) or (n, k) to a field (H, W[, k])"""
    a = attr[R['abc']]                                     # (m, 3[, k])
    v = (a * (R['lam'][:, :, None] if a.ndim == 3 else R['lam'])).sum(1)
    out = np.full((H, W) + v.shape[1:], fill, float); out[R['yy'], R['xx']] = v
    return out


def smooth_line(c, sig=2.2):
    """a traced line smoothed along itself (px), closed ones wrapping round"""
    closed = len(c) > 3 and np.allclose(c[0], c[-1])
    if len(c) < 5: return c
    m = 'wrap' if closed else 'nearest'
    out = np.c_[ndimage.gaussian_filter1d(c[:, 0], sig, mode=m), ndimage.gaussian_filter1d(c[:, 1], sig, mode=m)]
    if not closed: out[0], out[-1] = c[0], c[-1]
    return out


def contours(field, level, s, box, tol=0.3, closed=True):
    x0, y1 = box[0], box[1]
    out = []
    for c in measure.find_contours(field, level):
        if len(c) < 6: continue
        c = measure.approximate_polygon(smooth_line(c), tol)
        pts = np.c_[x0 + (c[:, 1] + 0.5) / s, y1 - (c[:, 0] + 0.5) / s]
        out.append(pts)
    return out


def edge_runs(region_mask, label, depth, s, box, R_id, min_len=4.0, empty=False):
    """the stretches of a region's edge that are a real edge: the outside is a surface more than DJ mm behind (not empty: the
    silhouette is drawn on its own). Returns open polylines (mm)"""
    x0, y1 = box[0], box[1]
    sm = ndimage.gaussian_filter(region_mask.astype(float), 0.8)
    gy, gx = np.gradient(sm)
    H, W = region_mask.shape
    runs = []
    for c in measure.find_contours(sm, 0.5):
        if len(c) < 4: continue
        r, q = c[:, 0], c[:, 1]
        ri, qi = np.clip(r.astype(int), 0, H - 1), np.clip(q.astype(int), 0, W - 1)
        g = np.c_[gy[ri, qi], gx[ri, qi]]; g /= np.linalg.norm(g, axis=1)[:, None] + 1e-12     # inward
        def at(k):
            rr = np.clip(np.round(r + g[:, 0] * k).astype(int), 0, H - 1); qq = np.clip(np.round(q + g[:, 1] * k).astype(int), 0, W - 1)
            return label[rr, qq], depth[rr, qq]
        li, di = at(3.0); lo, do = at(-3.0)
        keep = (lo >= 0) & (li == R_id) & (di - do > DJ)
        if empty: keep |= (lo < 0)
        keep = ndimage.binary_closing(keep, np.ones(5)) | keep
        # split into runs
        idx = np.nonzero(keep)[0]
        if not len(idx): continue
        breaks = np.nonzero(np.diff(idx) > 1)[0]
        segs = np.split(idx, breaks + 1)
        if empty and len(segs) > 1 and segs[0][0] == 0 and segs[-1][-1] == len(c) - 1:   # a closed contour's run across its start
            segs = [np.r_[segs[-1], segs[0]]] + segs[1:-1]
        for seg in segs:
            if len(seg) < len(c) - 2: seg = seg[8:-8]     # an open line stops short of where it turns into the skin: no tick or hook at its ends
            pts = c[seg]
            if len(pts) < 3: continue
            pts = measure.approximate_polygon(smooth_line(pts), 0.3)
            mm = np.c_[x0 + (pts[:, 1] + 0.5) / s, y1 - (pts[:, 0] + 0.5) / s]
            if np.linalg.norm(np.diff(mm, axis=0), axis=1).sum() >= min_len: runs.append(mm)
    return runs


def layer(V, F, P, shade, tri_part, include, B, box, s, own=None):
    """fields and paths for the triangles of the parts in `include`; own: the part whose region is the layer (None: all)"""
    r, u, t = B
    X, Y, Z = V @ r, V @ u, V @ t
    tris = np.nonzero(np.isin(tri_part, include))[0]
    W, H = box[2], box[3]
    R = raster(X, Y, Z, F, tris, box, s)
    filled = R['tid'] >= 0
    depth = interp(R, Z, H, W, -1e9)
    Pw = interp(R, P, H, W, 0.0)
    label = np.where(filled, Pw.argmax(-1), -1)
    sh = interp(R, shade, H, W, np.nan)
    # the shade carried outward past the edge (nearest), so its line crosses the outline cleanly
    idx = ndimage.distance_transform_edt(~filled, return_distances=False, return_indices=True)
    shx = sh[idx[0], idx[1]]
    if own is None:
        mask = filled
    else:
        k = PARTS.index(own)
        mask = filled & (Pw[..., k] > 0.25)
        mask = ndimage.binary_opening(mask, np.ones((3, 3)))
    sil = contours(ndimage.gaussian_filter(mask.astype(float), 0.7), 0.5, s, box)
    shad = contours(np.pad(shx, 1, constant_values=1.0), 0.0, s, (box[0] - 1 / s, box[1] + 1 / s))
    edges = []
    if own is None:
        for k, nm in enumerate(PARTS): edges += edge_runs(label == k, label, depth, s, box, k)
    else:
        # a digit on its own: its whole edge but where it runs on into the palm (the skin continues there: no line)
        lab2 = np.where(mask, PARTS.index(own), np.where(filled, 0, -1))
        edges = edge_runs(mask, lab2, depth, s, box, PARTS.index(own), empty=True)
    return dict(sil=sil, sh=shad, edges=edges, mask=mask, label=label, depth=depth, Pw=Pw)


def q(pl, k=20):
    """a polyline to ints (1/k mm)"""
    return np.round(np.asarray(pl) * k).astype(int).ravel().tolist()


def build(view='side', preview=True):
    h = Hand(os.path.join(OUT, 'rest.npz'), os.path.join(HERE, 'out', 'gd-deck.json')).fit().pose_rest(THUMB_TURN)
    V = h.skin(); F = h.F; P = h.parts(); J = h.joints()
    if view == 'side':
        # the side view: along the four fingers' knuckle axes (from the thumb's side), the middle metacarpal level, fingers right
        ax = np.mean([h.axis(FING[f] + '-phalanx-proximal', 0) for f in FING], 0)
        up = h.axis('middle-finger-metacarpal', 1)
        mc = J['middle-finger-phalanx-proximal'] - J['middle-finger-metacarpal']
        org = J['index-finger-phalanx-proximal']
    else:
        # the thumb's view: along its knuckle's axis, so its knuckle and tip joint bend in the picture's plane at true size; its
        # first bone (the metacarpal) level, pointing right
        ax = h.axis('thumb-phalanx-proximal', 0)
        up = h.axis('thumb-phalanx-proximal', 1)
        mc = J['thumb-phalanx-proximal'] - J['thumb-metacarpal']
        org = J['thumb-phalanx-proximal']
    r, u, tv = basis(ax, up)
    if mc @ r < 0: r = -r                                    # mirror: the digit points right (the deck's z)
    a = np.arctan2(mc @ u, mc @ r)                           # level the reference bone
    r, u = np.cos(a) * r + np.sin(a) * u, -np.sin(a) * r + np.cos(a) * u
    tv = np.cross(r, u) * (1 if np.cross(r, u) @ (-ax) > 0 else -1)
    B = (r, u, tv)
    V2 = V - org; Jo = {k: v - org for k, v in J.items()}
    n = smooth_normals(V2, F)
    L = -0.42 * r + 0.91 * u; L = L / np.linalg.norm(L); L = np.cos(np.radians(11.5)) * L + np.sin(np.radians(11.5)) * tv
    shade = n @ L
    tri_part = P[F].mean(1).argmax(-1)
    X, Y = V2 @ r, V2 @ u
    s = S_PX
    box = (np.floor(X.min()) - 3, np.ceil(Y.max()) + 3)
    W, H = int((X.max() - box[0] + 3) * s), int((box[1] - Y.min() + 3) * s)
    box = (box[0], box[1], W, H)
    allp = list(range(6))
    comp = layer(V2, F, P, shade, tri_part, allp, B, box, s)
    out = dict(view=view, s=s, box=[box[0], box[1], W / s, H / s], q=20,
               sil=[q(p) for p in comp['sil']], sh=[q(p) for p in comp['sh']], edges=[q(p) for p in comp['edges']], parts={})
    for k, nm in enumerate(PARTS):
        if nm == 'body': continue
        L_ = layer(V2, F, P, shade, tri_part, [0, k], B, box, s, own=nm)
        out['parts'][nm] = dict(sil=[q(p) for p in L_['sil']], sh=[q(p) for p in L_['sh']], edges=[q(p) for p in L_['edges']])
    # joints in 2D (mm), and each joint's flexion as drawn against its true value
    j2 = {k: [round(float(v @ r), 2), round(float(v @ u), 2)] for k, v in Jo.items()}
    out['joints'] = j2
    chk = {}
    for f, pre in list(FING.items()) + [('thumb', 'thumb')]:
        seg = ['metacarpal', 'phalanx-proximal', 'phalanx-intermediate', 'phalanx-distal', 'tip'] if f != 'thumb' else ['metacarpal', 'phalanx-proximal', 'phalanx-distal', 'tip']
        p = [np.array(j2[pre + '-' + s_]) for s_ in seg]
        d = [p[i + 1] - p[i] for i in range(len(p) - 1)]
        ang = [np.degrees(np.arctan2(d[i][0] * d[i + 1][1] - d[i][1] * d[i + 1][0], d[i] @ d[i + 1])) for i in range(len(d) - 1)]
        chk[f] = [round(-v, 1) for v in ang]
    out['drawn_flexion'] = chk
    out['log'] = h.log
    json.dump(out, open(os.path.join(OUT, view + '.json'), 'w'), separators=(',', ':'))
    if preview: draw_preview(out, os.path.join(OUT, view + '_preview.png'))
    return out, comp


def draw_preview(o, path, s=8, ss=3):
    x0, y1, Wm, Hm = o['box']; S = s * ss
    W, H = int(Wm * S), int(Hm * S)
    P = lambda a: [((a[i] / o['q'] - x0) * S, (y1 - a[i + 1] / o['q']) * S) for i in range(0, len(a), 2)]
    sil = Image.new('L', (W, H), 0); ds = ImageDraw.Draw(sil)
    for p in o['sil']: ds.polygon(P(p), fill=255)
    shd = Image.new('L', (W, H), 0); dd = ImageDraw.Draw(shd)
    for p in o['sh']:
        pts = P(p)
        if len(pts) > 2: dd.polygon(pts, fill=255)
    base = Image.new('RGB', (W, H), (17, 18, 20))
    lit = Image.new('RGB', (W, H), (0xA4, 0xA4, 0xAA)); shc = Image.new('RGB', (W, H), (0x77, 0x77, 0x7D))
    base.paste(lit, mask=sil)
    m = Image.fromarray((np.array(sil) // 255 * np.array(shd)).astype(np.uint8))
    base.paste(shc, mask=m)
    d = ImageDraw.Draw(base)
    for p in o['sil']: d.line(P(p) + P(p)[:1], fill=(222, 222, 224), width=int(1.35 * ss * 1.2))
    for p in o['edges']: d.line(P(p), fill=(222, 222, 224), width=int(1.35 * ss * 1.2))
    base = base.resize((W // ss, H // ss), Image.LANCZOS)
    base.save(path)


if __name__ == '__main__':
    ot, comp = build('thumb')
    print('thumb view: drawn flexion', ot['drawn_flexion'])
    o, comp = build('side')
    print('drawn flexion', o['drawn_flexion'])
    keep = ('s', 'box', 'q', 'sil', 'sh', 'edges', 'parts', 'joints', 'drawn_flexion')
    json.dump({'side': {k: o[k] for k in keep}, 'thumb': {k: ot[k] for k in keep}}, open(os.path.join(OUT, 'gd-hand.json'), 'w'), separators=(',', ':'))
    print('gd-hand.json', os.path.getsize(os.path.join(OUT, 'gd-hand.json')))
    print('paths', len(o['sil']), len(o['sh']), len(o['edges']), {k: (len(v['sil']), len(v['sh']), len(v['edges'])) for k, v in o['parts'].items()})
    print('json bytes', os.path.getsize(os.path.join(OUT, 'side.json')))
