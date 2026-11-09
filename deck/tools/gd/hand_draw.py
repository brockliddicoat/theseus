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
from hand_pose import Hand, rot, aff, FING

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


def unhook(pl, look=3.0, maxturn=25.0):
    """an open line's ends without a hook: drop end points while the first step turns more than maxturn deg from where the line
    goes over the next `look` mm (the trace's tick where a run starts on a pixel corner: G8's notch at the index's top line)"""
    pl = np.asarray(pl, float)
    for _ in range(2):
        while len(pl) > 4:
            seg = np.linalg.norm(np.diff(pl[1:], axis=0), axis=1); j = min(1 + int(np.searchsorted(np.cumsum(seg), look)), len(pl) - 1)
            d0, d1 = pl[1] - pl[0], pl[j] - pl[1]
            c = d0 @ d1 / (np.linalg.norm(d0) * np.linalg.norm(d1) + 1e-12)
            if np.degrees(np.arccos(np.clip(c, -1, 1))) > maxturn: pl = pl[1:]
            else: break
        pl = pl[::-1]
    return pl


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
            if len(seg) < len(c) - 2: seg = seg[14:-14] if empty else seg[8:-8]   # an open line stops short of where it turns into the skin: no tick or hook
            pts = c[seg]
            if len(pts) < 3: continue
            pts = measure.approximate_polygon(smooth_line(pts), 0.3)
            mm = np.c_[x0 + (pts[:, 1] + 0.5) / s, y1 - (pts[:, 0] + 0.5) / s]
            if len(seg) < len(c) - 2: mm = unhook(mm)
            if np.linalg.norm(np.diff(mm, axis=0), axis=1).sum() >= min_len: runs.append(mm)
    return runs


NAIL = {   # (half width mm, cuticle and free edge as fractions of the last joint to the skin's front): estimates, typical nails
    'thumb': (6.2, 0.30, 0.96), 'index': (4.9, 0.30, 0.95), 'middle': (5.1, 0.30, 0.95), 'ring': (4.8, 0.30, 0.95), 'little': (4.1, 0.32, 0.95)}


def nail_fields(h, V, n):
    """per vertex: the nail (> 0 inside: a rounded box on the back of the last bone, where the skin faces the back) and its free
    edge (> 0 inside the last 1.3 mm toward the tip), from each digit's last bone as posed"""
    nf = np.full(len(V), -1.0); fe = np.full(len(V), -1.0)
    for d, (w, c0, c1) in NAIL.items():
        pre = 'thumb' if d == 'thumb' else FING[d]
        nm = pre + '-phalanx-distal'; i = h.ix[nm]
        R = h.M[i, :3, :3] @ h.FR[i, :3, :3]; R = R / np.linalg.norm(R, axis=0); o = h.pos(nm)
        sel = h.W[:, [h.ix[nm], h.ix[pre + '-tip']]].sum(1) > 0.35
        Lc = (V - o) @ R; a = -Lc[:, 2]; b = Lc[:, 0]
        Lf = a[sel].max()
        a0, a1 = c0 * Lf, c1 * Lf; am, ha = (a0 + a1) / 2, (a1 - a0) / 2
        up = n @ R[:, 1]
        f = 1 - np.abs((a - am) / ha) ** 2.6 - np.abs(b / w) ** 2.6     # rounder than a box (G9: the thumbnail read as a button)
        f = np.where(sel & (up > 0.25), f, -1.0)
        nf = np.maximum(nf, f)
        fe = np.maximum(fe, np.where(f > -0.2, np.minimum(f + 0.2, (a - (a1 - 1.3)) / 1.3), -1.0))
    return nf, fe


def round_shadow(shx, filled, label, s, idx, r_mm=3.0):
    """the palm's shadow without sharp tips (2026-11-09 review: the web's leaf-shaped shadow between the thumb and the index
    "ends in a sharp point"; it should read as shadow, not a cut-out): a round opening (a disc of r_mm) of the shadow on the
    palm, so wherever it tapers thinner than 2 r_mm it ends in a round cap. The shadow is the field's, carried past the outline
    as before (so its line still crosses the outline cleanly); only where the nearest skin is the palm's or the thumb's is it
    opened (the fingers' narrow shadows are left alone)"""
    S = shx < 0
    rp = r_mm * s
    E = ndimage.distance_transform_edt(S) > rp                 # eroded
    if not E.any(): return shx
    D = ndimage.distance_transform_edt(~E)                     # distance from the eroded shadow: <= rp is the opening
    g = (rp - D) / s * 0.05                                    # > 0 inside the opening (about the shade's own slope per mm)
    body = np.isin(label[idx[0], idx[1]], [0, 1])              # the palm's and the thumb's skin (the web is both), carried outward
    out = np.where(body, np.maximum(shx, -g), shx)
    return ndimage.gaussian_filter(out, 0.25 * s)


def layer(V, F, P, shade, tri_part, include, B, box, s, own=None, nails=None):
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
    gap = np.zeros_like(filled)
    if own is None:
        # (G9) a narrow gap through the hand (between the thumb and the palm, from the thumb's side) read as a cut-out: it is
        # drawn as the shadowed skin behind it, with the lines of the parts in front of it kept (holes under 60 mm2)
        lab_, nh = ndimage.label(ndimage.binary_fill_holes(filled) & ~filled)
        if nh:
            area = ndimage.sum(np.ones_like(lab_), lab_, index=np.arange(1, nh + 1)) / s ** 2
            gap = np.isin(lab_, 1 + np.nonzero(area < 60)[0])
            label = np.where(gap, len(PARTS), label); depth = np.where(gap, depth[filled].min() - 50, depth)
    sh = interp(R, shade, H, W, np.nan)
    # the shade carried outward past the edge (nearest), so its line crosses the outline cleanly
    idx = ndimage.distance_transform_edt(~filled, return_distances=False, return_indices=True)
    filled = filled | gap
    shx = sh[idx[0], idx[1]]
    shx = ndimage.gaussian_filter(shx, 1.2 * s)     # the light/shadow line evened out over about a millimetre (no wander on flat skin)
    shx = round_shadow(shx, filled, label, s, idx)
    if gap.any(): shx = np.where(ndimage.binary_dilation(gap, iterations=2), np.minimum(shx, -0.05), shx)
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
    nl, fr = [], []
    if nails is not None:
        nf = interp(R, nails[0], H, W, -1.0); fe = interp(R, nails[1], H, W, -1.0)
        keep = mask if own is not None else filled
        nf = np.where(keep, nf, -1.0); fe = np.where(keep & (nf > 0), fe, -1.0)
        nl = contours(ndimage.gaussian_filter(nf, 0.8), 0.0, s, box, tol=0.25)
        fr = contours(ndimage.gaussian_filter(fe, 0.8), 0.0, s, box, tol=0.25)
    return dict(sil=sil, sh=shad, edges=edges, mask=mask, label=label, depth=depth, Pw=Pw, nail=nl, free=fr)


def q(pl, k=20):
    """a polyline to ints (1/k mm)"""
    return np.round(np.asarray(pl) * k).astype(int).ravel().tolist()


FSEG = ['metacarpal', 'phalanx-proximal', 'phalanx-intermediate', 'phalanx-distal', 'tip']
TSEG_ = ['metacarpal', 'phalanx-proximal', 'phalanx-distal', 'tip']


def view_basis(h, view):
    """the view's (right, up, toward the viewer) and its origin joint. Each depends only on frames a finger's or the thumb's
    flexion leaves alone (the knuckles' own axes, the metacarpals), so posing the joints below never moves the view"""
    J = h.joints()
    if view == 'side':
        # the side view: along the four fingers' knuckle axes (from the thumb's side), the middle metacarpal level, fingers right
        ax = np.mean([h.axis(FING[f] + '-phalanx-proximal', 0) for f in FING], 0)
        up = h.axis('middle-finger-metacarpal', 1)
        mc = J['middle-finger-phalanx-proximal'] - J['middle-finger-metacarpal']
        org = 'index-finger-phalanx-proximal'
    else:
        # the thumb's view: along its knuckle's axis, so its knuckle and tip joint bend in the picture's plane at true size; its
        # first bone (the metacarpal) level, pointing right
        ax = h.axis('thumb-phalanx-proximal', 0)
        up = h.axis('thumb-phalanx-proximal', 1)
        mc = J['thumb-phalanx-proximal'] - J['thumb-metacarpal']
        org = 'thumb-phalanx-proximal'
    r, u, tv = basis(ax, up)
    if mc @ r < 0: r = -r                                    # mirror: the digit points right (the deck's z)
    a = np.arctan2(mc @ u, mc @ r)                           # level the reference bone
    r, u = np.cos(a) * r + np.sin(a) * u, -np.sin(a) * r + np.cos(a) * u
    tv = np.cross(r, u) * (1 if np.cross(r, u) @ (-ax) > 0 else -1)
    return (r, u, tv), org


def drawn_angles(h, B, digit):
    """a digit's joints' bends as the view draws them (deg, + toward the palm): the turn between its bones' projections, each
    from the bone before it (the knuckle from the metacarpal), as the study measures them"""
    r, u = B[0], B[1]
    pre, seg = ('thumb', TSEG_) if digit == 'thumb' else (FING[digit], FSEG)
    p = [np.array([h.pos(pre + '-' + s_) @ r, h.pos(pre + '-' + s_) @ u]) for s_ in seg]
    d = [p[i + 1] - p[i] for i in range(len(p) - 1)]
    return [-np.degrees(np.arctan2(d[i][0] * d[i + 1][1] - d[i][1] * d[i + 1][0], d[i] @ d[i + 1])) for i in range(len(d) - 1)]


ADDUCT = {'index': 6.0, 'ring': 6.0, 'little': 11.0}   # deg toward the middle finger, the thumb's view only (an estimate: G9)


def adduct(h, amounts):
    """the fingers brought together (each turned about its knuckle's own back-of-the-finger axis toward the middle finger's tip):
    the model's open hand has its fingers spread, which from the palm read as a glove's (2026-11-09 review). The study gives no
    spread; this is an estimate, used only where the palm shows"""
    mt = h.pos('middle-finger-tip')
    for f, deg in amounts.items():
        ch = h.chain(f, 1); Y = h.axis(ch[0], 1); p = h.pos(ch[0]); tip = h.pos(FING[f] + '-tip')
        sg = min((1, -1), key=lambda g: np.linalg.norm(rot(Y, g * deg) @ (tip - p) + p - mt))
        h.apply(ch, aff(rot(Y, sg * deg), p))
        h.log.append(f'{f}: turned {deg} deg toward the middle finger (the thumb\'s view only, an estimate)')
    return h


def posed(spread=None):
    """the study's hand at rest, each joint posed so that the view that shows it draws the study's angle (within 0.05 deg):
    the fingers in the side view, the thumb's knuckle and tip joint in the thumb's view. A finger's knuckle axis is up to 11 deg
    off the side view's line of sight (the fingers fan out), so a joint set to its angle about its own axis is drawn up to 2 deg
    off it; each is turned until the drawing shows the study's number, a change of a few degrees about its own axis"""
    h = Hand(os.path.join(OUT, 'rest.npz'), os.path.join(HERE, 'out', 'gd-deck.json')).fit()
    if spread: adduct(h, spread)
    h.pose_rest(THUMB_TURN)
    H = h.H
    for view, digits in (('side', list(FING)), ('thumb', ['thumb'])):
        B, _ = view_basis(h, view)
        for dg in digits:
            want = H['cascade'][dg] if dg != 'thumb' else [H['thumb']['mcp'], H['thumb']['ip']]
            tgt = list(map(float, want))
            for _ in range(40):
                got = drawn_angles(h, B, dg)[:len(want)]
                err = [w - g for w, g in zip(want, got)]
                if max(map(abs, err)) < 0.02: break
                for k in range(len(want)):
                    tgt[k] += err[k]; h.set_flex(dg, k + 1, tgt[k])
            h.log.append(f'{dg}: posed about its own axes at {[round(float(x), 2) for x in tgt]} so the {view} view draws {want}')
    return h


def build(view='side', preview=True):
    h = posed(ADDUCT if view == 'thumb' else None)
    V = h.skin(); F = h.F; P = h.parts(); J = h.joints()
    B, orgn = view_basis(h, view)
    r, u, tv = B
    org = J[orgn]
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
    NF = nail_fields(h, V, n)
    comp = layer(V2, F, P, shade, tri_part, allp, B, box, s, nails=NF)
    pk = lambda L_: dict(sil=[q(p) for p in L_['sil']], sh=[q(p) for p in L_['sh']], edges=[q(p) for p in L_['edges']], nail=[q(p) for p in L_['nail']], free=[q(p) for p in L_['free']])
    out = dict(view=view, s=s, box=[box[0], box[1], W / s, H / s], q=20, parts={}, **pk(comp))
    for k, nm in enumerate(PARTS):
        if nm == 'body': continue
        out['parts'][nm] = pk(layer(V2, F, P, shade, tri_part, [0, k], B, box, s, own=nm, nails=NF))
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
    for p in o.get('nail', []): d.polygon(P(p), fill=(0xB4, 0xB4, 0xB9), outline=(0x5A, 0x5A, 0x5E))
    for p in o.get('free', []): d.polygon(P(p), fill=(0xC6, 0xC6, 0xCA))
    for p in o['sil']: d.line(P(p) + P(p)[:1], fill=(222, 222, 224), width=int(1.35 * ss * 1.2))
    for p in o['edges']: d.line(P(p), fill=(222, 222, 224), width=int(1.35 * ss * 1.2))
    base = base.resize((W // ss, H // ss), Image.LANCZOS)
    base.save(path)


if __name__ == '__main__':
    ot, comp = build('thumb')
    print('thumb view: drawn flexion', ot['drawn_flexion'])
    o, comp = build('side')
    print('drawn flexion', o['drawn_flexion'])
    keep = ('s', 'box', 'q', 'sil', 'sh', 'edges', 'nail', 'free', 'parts', 'joints', 'drawn_flexion')
    json.dump({'side': {k: o[k] for k in keep}, 'thumb': {k: ot[k] for k in keep}}, open(os.path.join(OUT, 'gd-hand.json'), 'w'), separators=(',', ':'))
    print('gd-hand.json', os.path.getsize(os.path.join(OUT, 'gd-hand.json')))
    print('paths', len(o['sil']), len(o['sh']), len(o['edges']), {k: (len(v['sil']), len(v['sh']), len(v['edges'])) for k, v in o['parts'].items()})
    print('json bytes', os.path.getsize(os.path.join(OUT, 'side.json')))
