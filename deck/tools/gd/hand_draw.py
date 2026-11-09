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
    nl, fr, nfi, fei = [], [], None, None
    if nails is not None:
        nf = interp(R, nails[0], H, W, -1.0); fe = interp(R, nails[1], H, W, -1.0)
        keep = mask if own is not None else filled
        nf = np.where(keep, nf, -1.0); fe = np.where(keep & (nf > 0), fe, -1.0)
        nfi, fei = ndimage.gaussian_filter(nf, 0.8), ndimage.gaussian_filter(fe, 0.8)
        nl = contours(nfi, 0.0, s, box, tol=0.25)
        fr = contours(fei, 0.0, s, box, tol=0.25)
    return dict(sil=sil, sh=shad, edges=edges, mask=mask, label=label, depth=depth, Pw=Pw, nail=nl, free=fr, nfi=nfi, fei=fei,
                filled=filled, box=box, s=s)


# ---- (G10) the film's joint creases and nail folds, on the traced hand (Brock 2026-11-09 13:14: "the hand looks more natural
# there, but not perfect"): the fingers read as smooth tubes, the thumbnail as a pale blob. The film's finger (06-motion.js
# fngSide) draws, at its last joint, three short wrinkles in from the back and one in from the pad, and round its nail the skin's
# fold as a crease line (the free edge has none). Here the same marks at every visible joint of every digit, placed on the drawing:
# each wrinkle starts where the line across the joint (square to its two bones' mean) leaves the digit's own skin, only where that
# is an outline (the background or a surface behind), never where a nearer part covers it.
CRZ = {   # per joint kind: dorsal wrinkles [toward the tip mm, length mm], palmar creases [toward the tip, length]; at the film's
          # finger's thickness (12.7 mm at its last joint), scaled with the digit's own there. DIP: the film's own (fngSide); PIP and
          # the thumb's knuckle: G7's deeper double crease (estimates, as G7's)
    'dip': ([[1.7, 2.4], [0.4, 3.1], [-0.85, 2.3]], [[0.0, 2.3]], 12.7),
    'pip': ([[2.2, 2.6], [0.8, 3.6], [-0.7, 4.0], [-2.1, 3.4], [-3.4, 2.4]], [[0.75, 2.4], [-0.75, 2.4]], 15.0),
    'tmcp': ([[1.8, 3.0], [0.4, 4.0], [-1.0, 4.2], [-2.4, 3.0]], [[0.6, 2.6], [-0.8, 2.6]], 19.0),
}


def _px(L, p):
    x0, y1 = L['box'][0], L['box'][1]; s = L['s']
    return (y1 - p[1]) * s - 0.5, (p[0] - x0) * s - 0.5          # (row, col), float


def _at(img, L, p, fill=-1):
    r, c = _px(L, p); H, W = img.shape; ri, ci = int(round(r)), int(round(c))
    return img[ri, ci] if 0 <= ri < H and 0 <= ci < W else fill


def _exit(L, region, p, d, maxd=16.0, step=0.04):
    """from p (mm) along d until leaving region (a bool image): the last point inside, or None if p is outside"""
    if not _at(region, L, p, False): return None
    t = 0.0
    while t < maxd:
        q = p + d * (t + step)
        if not _at(region, L, q, False): return p + d * t
        t += step
    return None


def _visible_edge(L, region, E, d, dj=DJ):
    """is the region's edge at E (leaving along d) an outline: the background beyond, or a surface more than dj mm behind?"""
    qo, qi = E + d * 0.45, E - d * 0.45
    if not L['filled'][tuple(np.clip(np.round(_px(L, qo)).astype(int), 0, np.array(L['filled'].shape) - 1))]: return True
    if region is not None and _at(region, L, qo, False): return False
    return _at(L['depth'], L, qi, -1e9) - _at(L['depth'], L, qo, -1e9) > dj


def _wrinkle(E, nb, m, Ln, lean, inward):
    """a crease's three points (the film's): from just inside the edge, Ln mm in, bowing toward the tip; nb points out of the
    skin at E (inward = -nb)"""
    a = 0.3 if inward > 0 else 0.1
    p0 = E - nb * a; p1 = p0 - nb * 0.55 * Ln + m * 0.3 * lean; p2 = p0 - nb * Ln + m * 0.12 * lean
    return np.array([p0, p1, p2])


def _quad(P, n=7):
    """the film's midpoint quadratic through three points, sampled (fngPath: moveTo p0, curve via p1 to p2)"""
    t = np.linspace(0, 1, n)[:, None]; return (1 - t) ** 2 * P[0] + 2 * (1 - t) * t * P[1] + t ** 2 * P[2]


def creases(h, B, org, L, region_of, digits=('index', 'middle', 'ring', 'little', 'thumb')):
    """the film's creases at each visible joint of each digit (open polylines, mm, y up). region_of(d): the bool image of digit
    d's own skin in this layer"""
    r, u = B[0], B[1]
    P2 = lambda n: np.array([(h.pos(n) - org) @ r, (h.pos(n) - org) @ u])
    out = []
    for d in digits:
        reg = region_of(d)
        if reg is None or not reg.any(): continue
        if d == 'thumb':
            pre = 'thumb'; jl = [('phalanx-proximal', 'metacarpal', 'phalanx-distal', 'tmcp'), ('phalanx-distal', 'phalanx-proximal', 'tip', 'dip')]
        else:
            pre = FING[d]; jl = [('phalanx-intermediate', 'phalanx-proximal', 'phalanx-distal', 'pip'), ('phalanx-distal', 'phalanx-intermediate', 'tip', 'dip')]
        for jn, bn, an, kind in jl:
            J = P2(pre + '-' + jn); b0 = J - P2(pre + '-' + bn); b1 = P2(pre + '-' + an) - J
            m = b0 / np.linalg.norm(b0) + b1 / np.linalg.norm(b1); m /= np.linalg.norm(m)
            Y3 = h.axis(pre + '-' + jn, 1); nb = np.array([Y3 @ r, Y3 @ u]); nb -= m * (nb @ m)
            if np.linalg.norm(nb) < 1e-6: continue
            nb /= np.linalg.norm(nb)
            Eb, Ep = _exit(L, reg, J, nb), _exit(L, reg, J, -nb)
            if Eb is None or Ep is None: continue
            thick = np.linalg.norm(Eb - Ep)
            dors, palm, ref = CRZ[kind]; k = float(np.clip(thick / ref, 0.7, 1.35))
            for side, lst in ((1, dors), (-1, palm)):
                n_ = nb * side
                for o, ln in lst:
                    p = J + m * o * k
                    E = _exit(L, reg, p, n_)
                    if E is None or not _visible_edge(L, reg, E, n_): continue
                    # the thumb's knuckle runs on into the palm on its back: its wrinkles only where the background is beyond (else
                    # they float on the palm, no outline beside them)
                    if kind == 'tmcp' and _at(L['filled'], L, E + n_ * 0.45, False): continue
                    w = _wrinkle(E, n_, m, ln * k, 1.0 if side > 0 else 1.5, side)
                    # keep it on the digit's own skin
                    if not _at(reg, L, w[2], False): continue
                    out.append(_quad(w))
    return out


def nail_folds(L, region_of, digits=('index', 'middle', 'ring', 'little', 'thumb'), min_len=1.2):
    """the skin's fold round each nail (A Soft, the film's fngNail fold: round its sides and the cuticle; the free edge has none),
    as open lines: the nail's traced edge less its free edge and less where it lies on the digit's outline (drawn already)"""
    if L['nfi'] is None: return []
    s = L['s']; x0, y1 = L['box'][0], L['box'][1]
    out = []
    for c in measure.find_contours(L['nfi'], 0.0):
        if len(c) < 6: continue
        c = smooth_line(c)
        ri = np.clip(np.round(c[:, 0]).astype(int), 0, L['nfi'].shape[0] - 1); ci = np.clip(np.round(c[:, 1]).astype(int), 0, L['nfi'].shape[1] - 1)
        mm = np.c_[x0 + (c[:, 1] + 0.5) / s, y1 - (c[:, 0] + 0.5) / s]
        fe = ndimage.map_coordinates(L['fei'], [c[:, 0], c[:, 1]], order=1)
        # near the digit's own outline (within 0.45 mm): no fold line (the outline is there)
        own = None
        for d in digits:
            reg = region_of(d)
            if reg is not None and reg[ri, ci].mean() > 0.5: own = reg; break
        if own is None: continue
        dist = ndimage.distance_transform_edt(own) / s
        keep = (fe < -0.35) & (dist[ri, ci] > 0.45)
        idx = np.nonzero(keep)[0]
        if not len(idx): continue
        segs = np.split(idx, np.nonzero(np.diff(idx) > 1)[0] + 1)
        closed = np.allclose(c[0], c[-1])
        if closed and len(segs) > 1 and segs[0][0] == 0 and segs[-1][-1] == len(c) - 1: segs = [np.r_[segs[-1], segs[0]]] + segs[1:-1]
        for sg in segs:
            if len(sg) < 4: continue
            p = measure.approximate_polygon(mm[sg], 0.05)
            if np.linalg.norm(np.diff(p, axis=0), axis=1).sum() >= min_len: out.append(p)
    return out


def skin_front(h, digit):
    """the skin's front of a digit along its last bone (3D): its distal skin's farthest point that way"""
    pre = 'thumb' if digit == 'thumb' else FING[digit]
    a, b = h.pos(pre + '-phalanx-distal'), h.pos(pre + '-tip'); u = (b - a) / np.linalg.norm(b - a)
    sel = h.W[:, [h.ix[pre + '-phalanx-distal'], h.ix[pre + '-tip']]].sum(1) > 0.5
    Vn = h.skin_now(sel); return a + u * float(((Vn - a) @ u).max())


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


def light(r, u, tv):
    """the stage's light (FNG_LIGHT: from above, a little left) tipped 11.5 deg toward the viewer"""
    L = -0.42 * r + 0.91 * u; L = L / np.linalg.norm(L); return np.cos(np.radians(11.5)) * L + np.sin(np.radians(11.5)) * tv


def pk(L_):
    out = dict(sil=[q(p) for p in L_['sil']], sh=[q(p) for p in L_['sh']], edges=[q(p) for p in L_['edges']], nail=[q(p) for p in L_['nail']],
               free=[q(p) for p in L_['free']])
    for k in ('crease', 'fold', 'out'):
        if k in L_: out[k] = [q(p) for p in L_[k]]
    return out


def build(view='side', preview=True):
    h = posed(ADDUCT if view == 'thumb' else None)
    V = h.skin(); F = h.F; P = h.parts(); J = h.joints()
    B, orgn = view_basis(h, view)
    r, u, tv = B
    org = J[orgn]
    V2 = V - org; Jo = {k: v - org for k, v in J.items()}
    n = smooth_normals(V2, F)
    shade = n @ light(r, u, tv)
    tri_part = P[F].mean(1).argmax(-1)
    X, Y = V2 @ r, V2 @ u
    s = S_PX
    box = (np.floor(X.min()) - 3, np.ceil(Y.max()) + 3)
    W, H = int((X.max() - box[0] + 3) * s), int((box[1] - Y.min() + 3) * s)
    box = (box[0], box[1], W, H)
    allp = list(range(6))
    NF = nail_fields(h, V, n)
    comp = layer(V2, F, P, shade, tri_part, allp, B, box, s, nails=NF)
    reg_c = lambda d: comp['label'] == PARTS.index(d)
    comp['crease'] = creases(h, B, org, comp, reg_c); comp['fold'] = nail_folds(comp, reg_c)
    out = dict(view=view, s=s, box=[box[0], box[1], W / s, H / s], q=20, parts={}, **pk(comp))
    for k, nm in enumerate(PARTS):
        if nm == 'body': continue
        Lp = layer(V2, F, P, shade, tri_part, [0, k], B, box, s, own=nm, nails=NF)
        reg_p = (lambda m_: (lambda d: m_ if d == nm else None))(Lp['mask'])
        Lp['crease'] = creases(h, B, org, Lp, reg_p, digits=(nm,)); Lp['fold'] = nail_folds(Lp, reg_p, digits=(nm,))
        out['parts'][nm] = pk(Lp)
    # joints in 2D (mm), and each joint's flexion as drawn against its true value
    j2 = {k: [round(float(v @ r), 2), round(float(v @ u), 2)] for k, v in Jo.items()}
    for d in ('index', 'middle', 'ring', 'little', 'thumb'):           # (G10) the skin's front along the last bone
        fp = skin_front(h, d) - org; j2[(FING.get(d, 'thumb')) + '-front'] = [round(float(fp @ r), 2), round(float(fp @ u), 2)]
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


# ---- (G10) gd_rest's hand: trial 3's lifted grip and the palm on the hump, traced (Brock 2026-11-09 13:14: "that also isn't the
# hand in the presentation you've linked": gd_rest still drew G7's invented fingers). The same posed hand as gd_joints (every
# finger joint drawn at Lee & Jung's angle in this side view), placed as the study places it (deck/tools/gd/hand.py, trials.py):
# the index knuckle on the grip's, the metacarpals level (lifted) or tilted 15 deg (on the hump, a turn of the whole drawing).
# The thumb (its base angle has no named reference: an estimate) is turned about its base until the skin's front of its tip is
# where the study puts it: on the side at y 15, z -3.8 (lifted) or z 12.9 (on the hump). Two layers, so the far fingers can pass
# behind the Sora: far (the middle, ring and little fingers, where they show) and near (the rest).
def pose_thumb(h, B, org, target, reg=0.0005):
    """turn the thumb about its base (a rotation vector at its CMC) so the skin's front of its tip, in the view, is at target
    (mm from the view's origin, y up); the smallest turn that does it"""
    from scipy.optimize import minimize
    r, u = B[0], B[1]
    base = h.pos('thumb-metacarpal'); names = h.chain('thumb', 0); M0 = h.M.copy()
    tgt = np.asarray(target, float)
    def front2(x):
        h.M[:] = M0; A = rot(x, np.degrees(np.linalg.norm(x))) if np.linalg.norm(x) > 1e-9 else np.eye(3)
        h.apply(names, aff(A, base)); f = skin_front(h, 'thumb') - org
        return np.array([f @ r, f @ u])
    cost = lambda x: float(np.sum((front2(x) - tgt) ** 2) + reg * np.degrees(np.linalg.norm(x)) ** 2 * 0.01)
    best = None
    for x0 in ([0, 0, 0], [0.2, 0, 0], [0, 0.2, 0], [0, 0, 0.2], [-0.2, 0, 0], [0, -0.2, 0], [0, 0, -0.2]):
        rs = minimize(cost, np.array(x0, float), method='Nelder-Mead', options=dict(xatol=1e-5, fatol=1e-6, maxiter=4000))
        if best is None or rs.fun < best.fun: best = rs
    got = front2(best.x)
    h.log.append(f'thumb turned {np.degrees(np.linalg.norm(best.x)):.1f} deg about its base: tip front at {got.round(2).tolist()} (target {tgt.round(2).tolist()})')
    return got


def outline_runs(mask, filled, s, box, min_len=1.0):
    """a layer's outline where it borders the background (open runs, mm)"""
    x0, y1 = box[0], box[1]
    sm = ndimage.gaussian_filter(mask.astype(float), 0.7); gy, gx = np.gradient(sm); H, W = mask.shape; runs = []
    for c in measure.find_contours(sm, 0.5):
        if len(c) < 4: continue
        ri, qi = np.clip(c[:, 0].astype(int), 0, H - 1), np.clip(c[:, 1].astype(int), 0, W - 1)
        g = np.c_[gy[ri, qi], gx[ri, qi]]; g /= np.linalg.norm(g, axis=1)[:, None] + 1e-12
        rr = np.clip(np.round(c[:, 0] - g[:, 0] * 3).astype(int), 0, H - 1); qq = np.clip(np.round(c[:, 1] - g[:, 1] * 3).astype(int), 0, W - 1)
        keep = ~filled[rr, qq]
        keep = ndimage.binary_closing(keep, np.ones(5)) | keep
        idx = np.nonzero(keep)[0]
        if not len(idx): continue
        if len(idx) >= len(c) - 1:
            pts = c
        else:
            segs = np.split(idx, np.nonzero(np.diff(idx) > 1)[0] + 1)
            if len(segs) > 1 and segs[0][0] == 0 and segs[-1][-1] == len(c) - 1: segs = [np.r_[segs[-1], segs[0]]] + segs[1:-1]
            for sg in segs:
                p = measure.approximate_polygon(smooth_line(c[sg]), 0.3); mm = np.c_[x0 + (p[:, 1] + 0.5) / s, y1 - (p[:, 0] + 0.5) / s]
                if np.linalg.norm(np.diff(mm, axis=0), axis=1).sum() >= min_len: runs.append(mm)
            continue
        p = measure.approximate_polygon(smooth_line(pts), 0.3); runs.append(np.c_[x0 + (p[:, 1] + 0.5) / s, y1 - (p[:, 0] + 0.5) / s])
    return runs


FAR = ('middle', 'ring', 'little')


def build_grip(name, target, preview=True):
    h = posed(None)
    B, orgn = view_basis(h, 'side'); r, u, tv = B
    org = h.pos(orgn)
    got = pose_thumb(h, B, org, target)
    V = h.skin(); F = h.F; P = h.parts(); J = h.joints()
    V2 = V - org
    n = smooth_normals(V2, F)
    shade = n @ light(r, u, tv)
    tri_part = P[F].mean(1).argmax(-1)
    X, Y = V2 @ r, V2 @ u; s = S_PX
    box = (np.floor(X.min()) - 3, np.ceil(Y.max()) + 3)
    W, H = int((X.max() - box[0] + 3) * s), int((box[1] - Y.min() + 3) * s); box = (box[0], box[1], W, H)
    NF = nail_fields(h, V, n)
    comp = layer(V2, F, P, shade, tri_part, list(range(6)), B, box, s, nails=NF)
    lab, filled = comp['label'], comp['filled']
    farm = filled & np.isin(lab, [PARTS.index(f) for f in FAR])
    nearm = filled & ~farm
    far_d = ndimage.binary_dilation(farm, iterations=int(0.6 * s)) & filled      # under the near layer's edge: no seam
    reg_c = lambda d: lab == PARTS.index(d)
    cr = creases(h, B, org, comp, reg_c); fo = nail_folds(comp, reg_c)
    def owner(pl):
        rc = np.array([_px(comp, p) for p in pl]); ri = np.clip(np.round(rc[:, 0]).astype(int), 0, H - 1); ci = np.clip(np.round(rc[:, 1]).astype(int), 0, W - 1)
        return 'far' if farm[ri, ci].mean() > 0.5 else 'near'
    layers = {}
    for nm, m in (('far', far_d), ('near', nearm)):
        sil = contours(ndimage.gaussian_filter(m.astype(float), 0.7), 0.5, s, box)
        L_ = dict(sil=sil, sh=[], edges=[], nail=[], free=[], crease=[], fold=[], out=outline_runs(m, filled, s, box))
        layers[nm] = L_
    for k, pn in enumerate(PARTS):
        for e in edge_runs(lab == k, lab, comp['depth'], s, box, k): layers['far' if pn in FAR else 'near']['edges'].append(e)
    for key, lst in (('nail', comp['nail']), ('free', comp['free']), ('crease', cr), ('fold', fo)):
        for pl in lst: layers[owner(pl)][key].append(pl)
    out = dict(view=name, s=s, box=[box[0], box[1], W / s, H / s], q=20, sh=[q(p) for p in comp['sh']],
               layers={k: pk(v) for k, v in layers.items()})
    j2 = {k: [round(float((v - org) @ r), 2), round(float((v - org) @ u), 2)] for k, v in J.items()}
    for d in ('index', 'middle', 'ring', 'little', 'thumb'):
        fp = skin_front(h, d) - org; j2[(FING.get(d, 'thumb')) + '-front'] = [round(float(fp @ r), 2), round(float(fp @ u), 2)]
    out['joints'] = j2; out['thumb_front'] = [round(float(v), 2) for v in got]; out['log'] = h.log
    # the palm's skin under the knuckle line, as drawn: the hand's lowest skin (but the thumb's) at each x near the knuckles
    xs = np.arange(-40, 11, 2.0); und = []
    Xb, Yb = X, Y; notthumb = P[:, 1] < 0.5
    for x0_ in xs:
        mm_ = notthumb & (np.abs(Xb - x0_) < 1.0)
        und.append(round(float(Yb[mm_].min()), 2) if mm_.any() else None)
    out['under'] = [xs.tolist(), und]
    json.dump(out, open(os.path.join(OUT, name + '.json'), 'w'), separators=(',', ':'))
    if preview:
        pv = dict(out); pv.update(dict(sil=[], sh=out['sh'], edges=[], nail=[], free=[]))
        for k in ('far', 'near'):
            for kk in ('sil', 'edges', 'nail', 'free', 'crease', 'fold', 'out'): pv.setdefault(kk, []); pv[kk] = pv[kk] + out['layers'][k].get(kk, [])
        draw_preview(pv, os.path.join(OUT, name + '_preview.png'), outline=False)
    return out


def draw_preview(o, path, s=8, ss=3, outline=True):
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
    for p in o.get('crease', []): d.line(P(p), fill=(70, 70, 74), width=int(1.0 * ss * 1.2))
    for p in o.get('fold', []): d.line(P(p), fill=(80, 80, 84), width=int(1.0 * ss * 1.2))
    if outline:
        for p in o['sil']: d.line(P(p) + P(p)[:1], fill=(222, 222, 224), width=int(1.35 * ss * 1.2))
    for p in o.get('out', []): d.line(P(p), fill=(222, 222, 224), width=int(1.35 * ss * 1.2))
    for p in o['edges']: d.line(P(p), fill=(222, 222, 224), width=int(1.35 * ss * 1.2))
    base = base.resize((W // ss, H // ss), Image.LANCZOS)
    base.save(path)


def grip_place():
    """(G10) how gd_rest places the drawing so the study's numbers hold on it. The study's chain has one metacarpal line; the
    model's metacarpals arch (the side view levels the middle's; the index's points 4.5 deg down), so the drawing is turned by lev
    to level the index's: its joints then fall on the study's index chain. The model's palm under the knuckles is thinner than the
    study's estimate (20 mm), so the drawing rides lower by sh, its own palm's skin where the study's is (the 28 mm gap over the hump
    holds on the drawing). Stage (the mouse's z, y) = K + R(gamma) (R(lev) p + (0, -sh)), K the study's index knuckle."""
    h = posed(None); B, orgn = view_basis(h, 'side'); r, u, tv = B; org = h.pos(orgn); J = h.joints()
    p2 = lambda n: np.array([(J[n] - org) @ r, (J[n] - org) @ u])
    mc = p2('index-finger-phalanx-proximal') - p2('index-finger-metacarpal'); lev = -float(np.arctan2(mc[1], mc[0]))
    V = h.skin(); P = h.parts(); X, Y = (V - org) @ r, (V - org) @ u
    c, s_ = np.cos(lev), np.sin(lev); Xl, Yl = c * X - s_ * Y, s_ * X + c * Y
    D = json.load(open(os.path.join(HERE, 'out', 'gd-deck.json'))); Hh = D['hand']; G_ = Hh['grips']; L = G_['lifted']
    prof = [q_ for q_ in D['sora']['profile'] if L['zK'] - 100 < q_[0] < L['zK']]; top = max(prof, key=lambda q_: q_[1])
    xh = top[0] - L['joints']['index'][0][0]
    m = (P[:, 1] < 0.5) & (np.abs(Xl - xh) < 1.0); under = float(Yl[m].min())
    sh = Hh['palm_skin'] + under          # > 0: the drawn palm is thinner than the estimate; the drawing rides lower by sh
    out = dict(lev=lev, sh=sh, under=under, xh=xh, targets={})
    for nm, key in (('grip', 'lifted'), ('heel', 'heel')):
        g = G_[key]; K = np.array(g['joints']['index'][0]); tip = np.array(g['thumb']['tip']); a = -np.radians(g['gamma_deg'])
        d = tip - K; d = np.array([d[0] * np.cos(a) - d[1] * np.sin(a), d[0] * np.sin(a) + d[1] * np.cos(a)]) + np.array([0, sh])
        out['targets'][nm] = [d[0] * np.cos(-lev) - d[1] * np.sin(-lev), d[0] * np.sin(-lev) + d[1] * np.cos(-lev)]
    return out


if __name__ == '__main__':
    which = sys.argv[1:] or ['thumb', 'side', 'grip', 'heel']
    keep = ('s', 'box', 'q', 'sil', 'sh', 'edges', 'nail', 'free', 'crease', 'fold', 'parts', 'joints', 'drawn_flexion')
    res = {}
    for v in which:
        if v in ('grip', 'heel'):
            pl = grip_place(); o = build_grip(v, pl['targets'][v]); print(v, 'thumb front', o['thumb_front'], o['log'][-1], 'lev %.2f deg sh %.2f mm' % (np.degrees(pl['lev']), pl['sh']))
            o['place'] = dict(lev=round(pl['lev'], 5), sh=round(pl['sh'], 3))
            res[v] = {k: o[k] for k in ('s', 'box', 'q', 'sh', 'layers', 'joints', 'thumb_front', 'place')}
        else:
            o, comp = build(v); print(v, 'drawn flexion', o['drawn_flexion'])
            res[v] = {k: o[k] for k in keep if k in o}
    path = os.path.join(OUT, 'gd-hand.json')
    allv = json.load(open(path)) if os.path.exists(path) else {}
    allv.update(res)
    json.dump(allv, open(path, 'w'), separators=(',', ':'))
    print('gd-hand.json', os.path.getsize(path), {k: len(json.dumps(v)) for k, v in allv.items()})
