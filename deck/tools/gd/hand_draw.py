"""The hand drawn as the film draws a finger (06-motion.js, Brock's "A Line" with "A Soft" nails): a flat lit grey, a flat shadow
grey beyond one clean light/shadow line per digit, a light outline round the silhouette and wherever one part passes in front of
another or two digits touch, nails with the skin's fold round them, creases on every joint; traced as vector paths from the posed
open hand model (hand_pose.py). ONE hand (hand(): the study's pose, POSE below), seen in every view the page draws:
  python3 -I deck/tools/gd/hand_draw.py            every view -> out/hand3/gd-hand.json (build.py gd embeds it as GDHAND)
  python3 -I deck/tools/gd/hand_draw.py tq rx      only those (tq: the turn; rx: the hand relaxing; grip, heel; gh: the thumb between)
  python3 -I deck/tools/gd/hand_views.py           the measured sheet of views (which three-quarter view, and why two)
Paths are in mm, x toward the fingertips (right), y up, the index knuckle at the origin.
The light/shadow line: the skin's normals smoothed over the surface (so the knuckles' small bumps don't break it up), lit from the
stage's light (FNG_LIGHT: from above, a little left) tipped 11.5 deg toward the viewer, so a straight finger's lower 40 % is in
shadow, as the film's finger is (termA); islands of either grey under 24 mm2 are given to what surrounds them. Lines: where the
depth jumps by more than DJ mm across a part's edge, on the nearer side's edge, and between two digits that touch; where a finger
joins the palm the skin runs on and no line is drawn."""
import json, os, sys
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage, sparse
from skimage import measure
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from hand_pose import Hand, rot, aff, FING
from kit_nail import Nail, HL_W, HL_STREAK

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'out', 'hand3')
PARTS = ['body', 'thumb', 'index', 'middle', 'ring', 'little']
DJ = 4.0           # mm of depth across an edge that makes a line
S_PX = 10.0        # px per mm for the fields
THUMB_TURN = [('index-finger-phalanx-proximal:0', 16)]   # the thumb's metacarpal about its base (an estimate)
# ---- (G12) THE POSE INPUTS, in one place. The joint angles and the bone lengths are the study's (out/gd-deck.json: hand.cascade,
# hand.thumb, hand.bones, hand.thumbBase, hand.ansur; hand_pose.py reads them). What the study does not give is set here, each an
# estimate: the thumb's turn at its base (no named reference line in Lee & Jung) and the fingers' spread (no spread in Lee & Jung).
# Change a value here (or the study's numbers in gd-deck.json) and rerun  python3 -I deck/tools/gd/hand_draw.py  to re-trace
# every view of the hand; nothing downstream holds a pose of its own.
#   spread: degrees at the knuckle, + away from the middle finger, set on the open hand before it is flexed (the finger then
#     flexes in its own plane, turned by that much). The model's own little finger closes 9 deg onto the ring finger as it flexes
#     (its knuckle's axis is oblique), which tucks it behind the ring finger from every direction on the thumb's side (measured:
#     hand_views.py); SPREAD_LITTLE undoes that and rests it a little apart, as a relaxed hand's does.
POSE = dict(thumb_turn=THUMB_TURN, spread={'little': 15.0})
# ---- (G12) the three-quarter view: the side view's camera raised el deg over the back of the hand and moved yaw deg toward the
# fingertips (tq_basis). Chosen by measurement (hand_views.py: each digit's visible share, each joint's drawn bend over its true one)
VIEW3Q = dict(el=30.0, yaw=45.0, roll=0.0)


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


def edge_runs(region_mask, label, depth, s, box, R_id, min_len=4.0, empty=False, touch=False):
    """the stretches of a region's edge that are a real edge: the outside is a surface more than DJ mm behind (not empty: the
    silhouette is drawn on its own). Returns open polylines (mm)"""
    x0, y1 = box[0], box[1]
    sm = ndimage.gaussian_filter(region_mask.astype(float), 2.0 if touch else 0.8)     # (G12) the part's edge rounded over 0.2 mm
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
        if touch and R_id >= 1:
            # (G12) two digits side by side touch with no jump in depth (seen from above): the line between them is still an
            # edge, drawn once, on the nearer one's (or, level, the lower-numbered one's)
            dig = (lo >= 1) & (lo < len(PARTS)) & (lo != R_id) & (li == R_id)
            # level with each other: only where the skin dips between them: a valley 1.2 mm deep or more 0.8 mm either side (two
            # fingers side by side: over 3 mm). Above the web, on the back of the hand, the two digits' skin is one surface, the
            # boundary between them only the model's (jagged), and no line is drawn
            ri0, qi0 = np.clip(np.round(r).astype(int), 0, H - 1), np.clip(np.round(q).astype(int), 0, W - 1); db = depth[ri0, qi0]
            (l8i, d8i), (l8o, d8o) = at(0.8 * s), at(-0.8 * s)
            valley = (d8i - db > 1.2) & (d8o - db > 1.2)
            keep |= dig & ((di - do > 0.6) | (valley & (R_id < lo)))
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
            pts = measure.approximate_polygon(smooth_line(pts, 5.0 if touch else 2.2), 0.3)
            mm = np.c_[x0 + (pts[:, 1] + 0.5) / s, y1 - (pts[:, 0] + 0.5) / s]
            if len(seg) < len(c) - 2: mm = unhook(mm)
            if np.linalg.norm(np.diff(mm, axis=0), axis=1).sum() >= min_len: runs.append(mm)
    return runs


DIGITS = ('index', 'middle', 'ring', 'little', 'thumb')
_KN = {}


def kit_nail(dig):
    k = 'thumb' if dig == 'thumb' else 'index'
    if k not in _KN: _KN[k] = Nail(k)
    return _KN[k]


def nail_attrs(h, V, n, L):
    """(G13, Brock 2026-11-09 20:44: "the nails don't look like the new revamped ones i wanted") The kit's nails (kit_nail.py:
    06-motion.js's fngNail, his pick "A Soft") laid on each fingertip's back. Per digit: every vertex's (u, z) in its last bone's
    frame (u mm back from the skin's front along the bone, z mm across), where the skin is the fingertip's back (m), the nail's
    scale k (the index's and the thumb's nails are the kit's own sizes; the middle, ring and little fingers wear the index's
    scaled by their fingertip's breadth over the index's) and the sheen's side sg (the nail's half that faces the light L).
    (u, z) are linear in position, so layer() carries them to every pixel exactly and reads the kit's outline there"""
    out = {}; w9 = {}
    for d in DIGITS:
        pre = 'thumb' if d == 'thumb' else FING[d]
        nm = pre + '-phalanx-distal'; i = h.ix[nm]
        R = h.M[i, :3, :3] @ h.FR[i, :3, :3]; R = R / np.linalg.norm(R, axis=0); o = h.pos(nm)
        sel = h.W[:, [h.ix[nm], h.ix[pre + '-tip']]].sum(1) > 0.35
        Lc = (V - o) @ R; a = -Lc[:, 2]; z = Lc[:, 0]; u = a[sel].max() - a; up = n @ R[:, 1]
        band = sel & (np.abs(u - 9.0) < 1.6); w9[d] = float(z[band].max() - z[band].min())
        out[d] = dict(u=u, z=z, m=(sel & (up > 0.25)).astype(float), nail=kit_nail(d))
    for d in DIGITS:
        A = out[d]; k = 1.0 if d in ('index', 'thumb') else w9[d] / w9['index']; N = A['nail']; A['k'] = k; A['w9'] = w9[d]
        on = (A['m'] > 0.5) & (np.abs(A['z'] / k) < N.W(A['u'] / k)); lit = n @ L
        a_, b_ = on & (A['z'] > 0), on & (A['z'] < 0)
        A['sg'] = 1 if (lit[a_].mean() if a_.any() else -9) >= (lit[b_].mean() if b_.any() else -9) else -1
    return out


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


def clean_shade(shx, filled, s, min_mm2):
    """(G12) one clean light/shadow split per digit: islands of lit grey inside the shadow, or of shadow inside the lit grey, under
    min_mm2 are given to what surrounds them (counted on the hand itself; the field outside it only carries the line across the
    outline), then the line is rounded again over a third of a millimetre"""
    out = shx.copy()
    for sign in (1, -1):
        m = ((out * sign) < 0) & filled
        lab, n = ndimage.label(m)
        if not n: continue
        area = ndimage.sum(np.ones_like(lab), lab, index=np.arange(1, n + 1)) / s ** 2
        small = np.isin(lab, 1 + np.nonzero(area < min_mm2)[0])
        if small.any():
            grow = ndimage.binary_dilation(small, iterations=int(0.6 * s))
            out = np.where(grow, sign * np.maximum(np.abs(out), 0.06), out)
    return ndimage.gaussian_filter(out, 0.3 * s)


def layer(V, F, P, shade, tri_part, include, B, box, s, own=None, nails=None, touch=False, clean=0.0):
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
    if clean: shx = clean_shade(shx, filled, s, clean)
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
        for k, nm in enumerate(PARTS): edges += edge_runs(label == k, label, depth, s, box, k, touch=touch)
    else:
        # a digit on its own: its whole edge but where it runs on into the palm (the skin continues there: no line)
        lab2 = np.where(mask, PARTS.index(own), np.where(filled, 0, -1))
        edges = edge_runs(mask, lab2, depth, s, box, PARTS.index(own), empty=True)
    nl, fr, lu, nfi, ufi, hls = [], [], [], None, None, [[], [], []]
    if nails is not None:
        keep = mask if own is not None else filled
        nf = np.full((H, W), -1.0); fe = np.full((H, W), -1.0); lf = np.full((H, W), -1.0); uf = np.full((H, W), -1.0); hd_ = np.full((H, W), 9.0)
        for d, A in nails.items():
            M = (interp(R, A['m'], H, W, 0.0) > 0.5) & keep
            if not M.any(): continue
            k = A['k']; N = A['nail']; U = interp(R, A['u'], H, W, 0.0)[M] / k; Z = interp(R, A['z'], H, W, 0.0)[M] / k
            sd = N.at(N.sd, U, Z, -1.0) * k
            nf[M] = np.maximum(nf[M], np.clip(sd, -1.0, None))
            fe[M] = np.maximum(fe[M], np.where(sd > -0.3, N.at(N.free, U, Z, -1.0) * k, -1.0))
            lf[M] = np.maximum(lf[M], np.where(sd > -0.3, N.at(N.lun, U, Z, -1.0) * k, -1.0))
            hd_[M] = np.minimum(hd_[M], np.where(sd > -0.3, N.at(N.hlg, U, A['sg'] * Z, 9.0) * k, 9.0) / k)   # in the kit's own mm
            uf[M] = np.where(sd > -0.6, U - N.uf0, uf[M])
        nfi = ndimage.gaussian_filter(nf, 0.8); ufi = uf
        nl = contours(nfi, 0.0, s, box, tol=0.2)
        fr = contours(ndimage.gaussian_filter(np.where(nf > -0.2, fe, -1.0), 0.8), 0.0, s, box, tol=0.2)
        lu = contours(ndimage.gaussian_filter(np.where(nf > -0.2, lf, -1.0), 0.8), 0.0, s, box, tol=0.2)
        # the sheen (fngStreak: three strokes of the line, each narrower and stronger): three nested bands round the kit's line
        hls = [contours(ndimage.gaussian_filter(np.clip(HL_W * f / 2 - hd_, -1.0, None), 0.6), 0.0, s, box, tol=0.15) for f, _ in HL_STREAK]
    return dict(sil=sil, sh=shad, edges=edges, mask=mask, label=label, depth=depth, Pw=Pw, nail=nl, free=fr, lun=lu, nfi=nfi, ufi=ufi, hl0=hls[0], hl1=hls[1], hl2=hls[2],
                filled=filled, box=box, s=s, R=R)


# ---- small helpers on a traced layer (its box, scale and images)
def _px(L, p):
    x0, y1 = L['box'][0], L['box'][1]; s = L['s']
    return (y1 - p[1]) * s - 0.5, (p[0] - x0) * s - 0.5          # (row, col), float


def _at(img, L, p, fill=-1):
    r, c = _px(L, p); H, W = img.shape; ri, ci = int(round(r)), int(round(c))
    return img[ri, ci] if 0 <= ri < H and 0 <= ci < W else fill


def nail_folds(L, region_of, digits=('index', 'middle', 'ring', 'little', 'thumb'), min_len=1.2):
    """the skin's fold round each nail (A Soft, the kit's fngNail fold: from just behind the free edge's corners back along the
    sides and round the cuticle's U; the free edge has none), as open lines: the nail's traced edge from the fold's start on, less
    where it lies on the digit's outline (drawn already)"""
    if L['nfi'] is None: return []
    s = L['s']; x0, y1 = L['box'][0], L['box'][1]
    out = []
    for c in measure.find_contours(L['nfi'], 0.0):
        if len(c) < 6: continue
        c = smooth_line(c)
        ri = np.clip(np.round(c[:, 0]).astype(int), 0, L['nfi'].shape[0] - 1); ci = np.clip(np.round(c[:, 1]).astype(int), 0, L['nfi'].shape[1] - 1)
        mm = np.c_[x0 + (c[:, 1] + 0.5) / s, y1 - (c[:, 0] + 0.5) / s]
        uf = ndimage.map_coordinates(L['ufi'], [c[:, 0], c[:, 1]], order=0)     # u past the fold's start (the free edge has no fold)
        # near the digit's own outline (within 0.45 mm): no fold line (the outline is there)
        own = None
        for d in digits:
            reg = region_of(d)
            if reg is not None and reg[ri, ci].mean() > 0.5: own = reg; break
        if own is None: continue
        dist = ndimage.distance_transform_edt(own) / s
        keep = (uf >= 0) & (dist[ri, ci] > 0.45)
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


def view_basis(h, view='side'):
    """the side view's (right, up, toward the viewer) and its origin joint: along the four fingers' knuckle axes (from the thumb's
    side), the middle metacarpal level, the fingers pointing right (the deck's z: the drawing is the hand's mirror image, as the
    study's side view of the mouse has its nose to the right and the thumb nearest). It depends only on frames a finger's flexion
    leaves alone (the knuckles' own axes, the metacarpals); posed3d fixes it before the fingers are spread (h.side_B)"""
    if getattr(h, 'side_B', None) is not None: return h.side_B
    J = h.joints()
    ax = np.mean([h.axis(FING[f] + '-phalanx-proximal', 0) for f in FING], 0)
    up = h.axis('middle-finger-metacarpal', 1)
    mc = J['middle-finger-phalanx-proximal'] - J['middle-finger-metacarpal']
    org = 'index-finger-phalanx-proximal'
    r, u, tv = basis(ax, up)
    if mc @ r < 0: r = -r                                    # mirror: the fingers point right (the deck's z)
    a = np.arctan2(mc @ u, mc @ r)                           # level the middle metacarpal
    r, u = np.cos(a) * r + np.sin(a) * u, -np.sin(a) * r + np.cos(a) * u
    tv = np.cross(r, u) * (1 if np.cross(r, u) @ (-ax) > 0 else -1)
    return (r, u, tv), org


def tq_basis(h, el, yaw, roll=0.0):
    """(G12) the three-quarter view's (right, up, toward the viewer) and its origin joint: the side view's camera raised by el deg
    to look down onto the back of the hand and moved by yaw deg toward the fingertips, then the picture turned by roll deg
    (counter-clockwise). el = yaw = roll = 0 is the side view itself, so a turn between the two is one family of views"""
    (r0, u0, t0), org = view_basis(h, 'side')
    e, y, ro = np.radians(el), np.radians(yaw), np.radians(roll)
    t = np.cos(e) * (np.cos(y) * t0 + np.sin(y) * r0) + np.sin(e) * u0
    r = np.cos(y) * r0 - np.sin(y) * t0
    u = u0 - t * (u0 @ t); u /= np.linalg.norm(u)
    r, u = np.cos(ro) * r - np.sin(ro) * u, np.sin(ro) * r + np.cos(ro) * u
    return (r, u, t), org


def spread_fingers(h, amounts):
    """(G12) the fingers' spread, on the open hand: each finger turned about its knuckle's own back-of-the-hand axis by deg, + away
    from the middle finger (the study gives no spread: an estimate, POSE['spread'])"""
    mk = h.pos('middle-finger-phalanx-proximal')
    for f, deg in (amounts or {}).items():
        if not deg or f == 'middle': continue
        ch = h.chain(f, 1); Y = h.axis(ch[0], 1); p = h.pos(ch[0]); tip = h.pos(FING[f] + '-tip'); side = p - mk
        sg = max((1, -1), key=lambda g: (rot(Y, g * 5.0) @ (tip - p)) @ side)
        h.apply(ch, aff(rot(Y, sg * deg), p))
        h.log.append(f'{f}: spread {deg} deg away from the middle finger at its knuckle (an estimate: the study gives no spread)')
    return h


def posed3d(thumb_turn=None, spread=None, flex=1.0):
    """(G12) the study's hand at rest, every joint at the study's angle about its own axis (its true 3D bend): one pose for every
    view (Brock 2026-11-09 13:50: a three-quarter view; no view has its joints nudged to draw a number any more). flex: the
    fingers' and the thumb's joints at that share of their resting bend (1: at rest; 0: straight), for the hand relaxing"""
    h = Hand(os.path.join(OUT, 'rest.npz'), os.path.join(HERE, 'out', 'gd-deck.json')).fit()
    h.side_B = None; h.side_B = view_basis(h, 'side')      # the side view's frame, from the knuckles' axes before the spread
    spread_fingers(h, POSE['spread'] if spread is None else spread)
    if flex != 1.0:
        H = h.H; H['cascade'] = {f: [a * flex for a in v] for f, v in H['cascade'].items()}
        H['thumb'] = dict(H['thumb'], mcp=H['thumb']['mcp'] * flex, ip=H['thumb']['ip'] * flex)
    h.pose_rest(POSE['thumb_turn'] if thumb_turn is None else thumb_turn)
    return h


TIP_SIDE = 11.5     # deg: the film's light in the side view (a straight finger's lower 40 % in shadow, as fngSide's termA)
TIP_3Q = 30.0       # deg: by the three-quarter views (from yaw 35 on)


def tip_at(yaw):
    """(G13) how far the stage's light is tipped toward the viewer in a view yaw deg round from the side: the film's 11.5 deg in the
    side view, rising evenly to 30 deg by yaw 35 and held from there. With the film's tip, a finger curled toward the viewer has
    its whole end in shadow: a hard diagonal across every finger and dark fingertips (the review of the first three-quarter
    traces, 2026-11-09); at 30 deg the light/shadow line runs along each finger, as it does along the film's own finger"""
    return TIP_SIDE + (TIP_3Q - TIP_SIDE) * min(1.0, max(0.0, yaw / 35.0))


def light(r, u, tv, tip=TIP_SIDE):
    """the stage's light (FNG_LIGHT: from above, a little left) tipped `tip` deg toward the viewer"""
    L = -0.42 * r + 0.91 * u; L = L / np.linalg.norm(L); return np.cos(np.radians(tip)) * L + np.sin(np.radians(tip)) * tv


def pk(L_):
    out = dict(sil=[q(p) for p in L_['sil']], sh=[q(p) for p in L_['sh']], edges=[q(p) for p in L_['edges']], nail=[q(p) for p in L_['nail']],
               free=[q(p) for p in L_['free']])
    for k in ('crease', 'fold', 'out', 'lun', 'hl0', 'hl1', 'hl2'):
        if k in L_ and L_[k] is not None and len(L_[k]): out[k] = [q(p) for p in L_[k]]
    return out


# ---- gd_rest's side view: trial 3's lifted grip and the palm on the hump (G10; Brock 2026-11-09 13:14: "that also isn't the hand in
# the presentation you've linked"). The page's one hand (posed3d: every joint at Lee & Jung's bend about its own axis; G12: no
# joint nudged to the view any more, so the side view draws each bend within about 2 deg of its number), placed as the study places
# it (deck/tools/gd/hand.py, trials.py): the index knuckle on the grip's, the metacarpals level (lifted) or tilted 15 deg (on the
# hump, a turn of the whole drawing). The thumb (its base angle has no named reference: an estimate) is turned about its base
# until the skin's front of its tip is where the study puts it: on the side at y 15, z -3.8 (lifted) or z 12.9 (on the hump).
# Two layers, so the far fingers can pass behind the Sora: far (the middle, ring and little fingers where they show, each a step
# darker: DARK) and near (the rest).
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
    h.thumb_x = best.x.copy()
    return got


def turn_thumb(h, x):
    """the thumb turned about its base by the rotation vector x (as pose_thumb found it)"""
    base = h.pos('thumb-metacarpal'); A = rot(x, np.degrees(np.linalg.norm(x))) if np.linalg.norm(x) > 1e-9 else np.eye(3)
    h.apply(h.chain('thumb', 0), aff(A, base)); h.thumb_x = np.asarray(x, float).copy()
    return h


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


DARK = {'middle': 0.085, 'ring': 0.17, 'little': 0.255}   # (G12) the side view: each farther finger a step darker (ink over its greys)


def build_grip(name, target, preview=True):
    h = posed3d()                                # (G12) the one pose: every joint at its true bend (no nudging to the view)
    B, orgn = view_basis(h, 'side'); r, u, tv = B
    org = h.pos(orgn)
    got = pose_thumb(h, B, org, target)
    V = h.skin(); F = h.F; P = h.parts(); J = h.joints()
    V2 = V - org
    n = smooth_normals(V2, F)
    Lt = light(r, u, tv, TIP_SIDE); shade = n @ Lt
    tri_part = P[F].mean(1).argmax(-1)
    X, Y = V2 @ r, V2 @ u; s = S_PX
    box = (np.floor(X.min()) - 3, np.ceil(Y.max()) + 3)
    W, H = int((X.max() - box[0] + 3) * s), int((box[1] - Y.min() + 3) * s); box = (box[0], box[1], W, H)
    NF = nail_attrs(h, V, n, Lt)
    comp = layer(V2, F, P, shade, tri_part, list(range(6)), B, box, s, nails=NF, touch=True, clean=24.0)
    lab, filled = comp['label'], comp['filled']
    farm = filled & np.isin(lab, [PARTS.index(f) for f in FAR])
    nearm = filled & ~farm
    far_d = ndimage.binary_dilation(farm, iterations=int(0.6 * s)) & filled      # under the near layer's edge: no seam
    reg_c = lambda d: lab == PARTS.index(d)
    cr = creases3d(h, V, B, org, comp, n); fo = nail_folds(comp, reg_c)
    def owner(pl):
        rc = np.array([_px(comp, p) for p in pl]); ri = np.clip(np.round(rc[:, 0]).astype(int), 0, H - 1); ci = np.clip(np.round(rc[:, 1]).astype(int), 0, W - 1)
        return 'far' if farm[ri, ci].mean() > 0.5 else 'near'
    layers = {}
    for nm, m in (('far', far_d), ('near', nearm)):
        sil = contours(ndimage.gaussian_filter(m.astype(float), 0.7), 0.5, s, box)
        L_ = dict(sil=sil, sh=[], edges=[], nail=[], free=[], crease=[], fold=[], out=outline_runs(m, filled, s, box))
        layers[nm] = L_
    for k, pn in enumerate(PARTS):
        for e in edge_runs(lab == k, lab, comp['depth'], s, box, k, touch=True): layers['far' if pn in FAR else 'near']['edges'].append(e)
    for key, lst in (('nail', comp['nail']), ('free', comp['free']), ('crease', cr), ('fold', fo), ('lun', comp['lun']), ('hl0', comp['hl0']), ('hl1', comp['hl1']), ('hl2', comp['hl2'])):
        layers['near'].setdefault(key, []); layers['far'].setdefault(key, [])
        for pl in lst: layers[owner(pl)][key].append(pl)
    out = dict(view=name, s=s, box=[box[0], box[1], W / s, H / s], q=20, sh=[q(p) for p in comp['sh']],
               layers={k: pk(v) for k, v in layers.items()})
    # (G12) each farther finger a step darker where it shows (its visible skin; in this view every such patch ends on a line)
    dk = {}
    for nm, lv in DARK.items():
        m = lab == PARTS.index(nm)
        if m.sum() >= 8: dk[nm] = dict(k=lv, p=[q(p_) for p_ in contours(ndimage.gaussian_filter(m.astype(float), 0.7), 0.5, s, box)])
    out['layers']['far']['dark'] = dk; out['fade'] = fade_line(h, B, org)
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
        pv = dict(out); pv.update(dict(sil=[], sh=out['sh'], edges=[], nail=[], free=[], dark=dk))
        for k in ('far', 'near'):
            for kk in ('sil', 'edges', 'nail', 'free', 'crease', 'fold', 'out', 'lun', 'hl0', 'hl1', 'hl2'): pv.setdefault(kk, []); pv[kk] = pv[kk] + out['layers'][k].get(kk, [])
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
    for nm, dk in (o.get('dark') or {}).items():
        ov = Image.new('L', (W, H), 0); dv = ImageDraw.Draw(ov)
        for p in dk['p']: dv.polygon(P(p), fill=int(255 * dk['k']))
        base.paste(Image.new('RGB', (W, H), (12, 12, 14)), mask=Image.fromarray((np.array(sil) // 255 * np.array(ov)).astype(np.uint8)))
    d = ImageDraw.Draw(base)
    for p in o.get('nail', []): d.polygon(P(p), fill=(0xB0, 0xB0, 0xB6))
    for p in o.get('free', []): d.polygon(P(p), fill=(0xC0, 0xC0, 0xC5))
    for p in o.get('lun', []): d.polygon(P(p), fill=(0xBA, 0xBA, 0xBF))
    for kk, c in (('hl0', 0xB8), ('hl1', 0xBE), ('hl2', 0xC6)):
        for p in o.get(kk, []):
            if len(p) >= 6: d.polygon(P(p), fill=(c, c, c + 4))
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
    h = posed3d(); B, orgn = view_basis(h, 'side'); r, u, tv = B; org = h.pos(orgn); J = h.joints()     # (G12) the one pose
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


# ============================== (G12) the three-quarter views (Brock 2026-11-09 13:50) ==============================
# "the angle needs to be towards the side at a like 3/4ths view (or similar) in at least one visualizations because it's near
# impossible to tell the fingers apart from just the side profile, and in many cases the hand looks 4 fingers".
# One hand (hand(): the study's pose, the thumb where the study rests it), seen along one path of views from the side view
# (yaw 0, el 0) round toward the fingertips and up over the back of the hand: TURN. What was measured (hand_views.py): the fingers
# bend in planes that face the side, so their bends read from the side and flatten as the camera comes round to the front, while
# the far fingers only come out from behind the near ones from the front. No one view does both, so two views on the path are kept
# whole (each digit's own outline traced too): VB, where the index, middle and ring fingers' bends read (each drawn at 0.66 or
# more of its true size), and VA, where all five digits are plainly apart and the little finger's and the thumb's bends read.
# The frames between are whole-hand traces only: the hand turning.
def path_el(yaw):
    """the path's elevation at a yaw (deg): through VB (yaw 35, el 25) and VA (yaw 65, el 35), level at the side view"""
    return 0.9194 * yaw - 0.005861 * yaw * yaw


TURN = [7.0, 14.0, 21.0, 28.0, 35.0, 42.5, 50.0, 57.5, 65.0]     # the frames' yaws; yaw 0 is the side view itself (grip)
VB, VA = 4, 8                                                     # the two kept whole (indices into TURN)

CR3 = {   # (G12) each joint's creases on the skin itself, so every view shows them where they are: [toward the tip mm, half the
          # angle round the finger they span, deg]: dorsal ones centred on the back's crest, palmar on the pad's side; the film's
          # (fngSide, fngTop) at its last joint, G7's deeper set at the middle joint and the thumb's knuckle; two short ones on
          # each knuckle. Estimates, as theirs
    'dip': ([[1.7, 36], [0.4, 46], [-0.85, 35]], [[0.0, 40]], 12.7),
    'pip': ([[2.2, 32], [0.8, 42], [-0.7, 47], [-2.1, 40], [-3.4, 30]], [[0.75, 38], [-0.75, 38]], 15.0),
    'tmcp': ([[1.8, 32], [0.4, 42], [-1.0, 44], [-2.4, 32]], [[0.6, 36], [-0.8, 36]], 19.0),
    'mcp': ([[1.1, 17], [-1.1, 21]], [], 19.0),
}


def creases3d(h, V, B, org, L, n, digits=('index', 'middle', 'ring', 'little', 'thumb')):
    """each joint's creases as curves on the skin (3D), projected, kept where the view sees them (the composite's own depth and
    part at that pixel): open polylines, mm, y up"""
    r, u, t = B; out = []
    lab, dep = L['label'], L['depth']
    for d in digits:
        if d == 'thumb':
            pre = 'thumb'; jl = [('phalanx-proximal', 'metacarpal', 'phalanx-distal', 'tmcp'), ('phalanx-distal', 'phalanx-proximal', 'tip', 'dip')]
        else:
            pre = FING[d]; jl = [('phalanx-proximal', 'metacarpal', 'phalanx-intermediate', 'mcp'), ('phalanx-intermediate', 'phalanx-proximal', 'phalanx-distal', 'pip'),
                                 ('phalanx-distal', 'phalanx-intermediate', 'tip', 'dip')]
        k = PARTS.index(d)
        for jn, bn, an, kind in jl:
            Jp = h.pos(pre + '-' + jn); b0 = Jp - h.pos(pre + '-' + bn); b1 = h.pos(pre + '-' + an) - Jp
            m = b0 / np.linalg.norm(b0) + b1 / np.linalg.norm(b1); m /= np.linalg.norm(m)
            Yd = 0.5 * (h.axis(pre + '-' + jn, 1) + h.axis(pre + '-' + bn, 1)); Yd = Yd - m * (Yd @ m); Yd /= np.linalg.norm(Yd); Xl = np.cross(Yd, m)
            sel = h.W[:, [h.ix[pre + '-' + jn], h.ix[pre + '-' + bn]]].sum(1) > 0.6
            Q = V[sel] - Jp; a = Q @ m; x = Q @ Xl; y = Q @ Yd
            near = np.abs(a) < 7.0
            a, x, y = a[near], x[near], y[near]; th = np.degrees(np.arctan2(x, y)); rho = np.hypot(x, y)
            if len(a) < 20: continue
            # the digit's thickness at the joint, back to pad
            top = rho[(np.abs(th) < 20) & (np.abs(a) < 2)]; bot = rho[(np.abs(np.abs(th) - 180) < 20) & (np.abs(a) < 2)]
            if not len(top) or not len(bot): continue
            dors, palm, ref = CR3[kind]; kk = float(np.clip((top.mean() + bot.mean()) / ref, 0.7, 1.35))
            for side, lst in ((0.0, dors), (180.0, palm)):
                for o, half in lst:
                    pts = []
                    for f_ in np.linspace(-1, 1, 15):
                        tt = side + f_ * half; at = o * kk + 0.4 * kk * (1 - f_ * f_)
                        dth = np.abs((th - tt + 180) % 360 - 180)
                        w = np.clip(1 - dth / 16.0, 0, None) * np.clip(1 - np.abs(a - at) / 1.6, 0, None)
                        if w.sum() < 1e-6: pts.append(None); continue
                        rr = float((w * rho).sum() / w.sum()) + 0.05
                        c_, s_ = np.cos(np.radians(tt)), np.sin(np.radians(tt))
                        P3 = Jp + m * at + rr * (c_ * Yd + s_ * Xl); nrm = c_ * Yd + s_ * Xl
                        p2 = np.array([(P3 - org) @ r, (P3 - org) @ u]); z = (P3 - org) @ t
                        lv = _at(lab, L, p2, -1); dv = _at(dep, L, p2, -1e9)
                        ok = (nrm @ t > 0.10) and (lv == k or (kind in ('mcp', 'tmcp') and lv in (0, 1, k))) and (z > dv - 1.3)
                        pts.append(p2 if ok else None)
                    run = []
                    for q_ in pts + [None]:
                        if q_ is not None: run.append(q_); continue
                        if len(run) >= 4:
                            pl = np.array(run)
                            if np.linalg.norm(np.diff(pl, axis=0), axis=1).sum() >= 1.2: out.append(pl)
                        run = []
    return out


def arcs_data(h, B, org):
    """(G12) what the slide needs to draw each joint's bend where it is, in the digit's own bending plane: per digit, each joint
    [x, y, e0x, e0y, e1x, e1y, deg]: the joint, and the projections of two unit vectors in its bending plane (square to its
    axis): e0 the bone before carried straight on, e1 square to it toward the bend, so the arc's point at angle a is
    J + R (cos a e0 + sin a e1), a from 0 to the joint's bend (the study's, as posed): a circle's arc in 3D, part of an ellipse as
    drawn. tip: the same at the fingertip's skin front for the sum: from the back of the hand's direction (the knuckle's
    straight-on line; the thumb's: its first bone's) round to the last bone's, [x, y, e0x, e0y, e1x, e1y, sum deg, the true 3D
    angle between those two lines]. back: the knuckle's straight-on line's start (ref mm behind it), for the line through"""
    r, u = B[0], B[1]; P2 = lambda v: [float(v @ r), float(v @ u)]
    out = {}
    for d in ('index', 'middle', 'ring', 'little', 'thumb'):
        pre, seg = ('thumb', TSEG_) if d == 'thumb' else (FING[d], FSEG)
        js = []; f0 = None; b_last = None; tot = 0.0
        for k in range(1, len(seg) - 1):
            Jp = h.pos(pre + '-' + seg[k]); X = h.axis(pre + '-' + seg[k], 0)
            a = Jp - h.pos(pre + '-' + seg[k - 1]); b = h.pos(pre + '-' + seg[k + 1]) - Jp
            a = a - X * (a @ X); b = b - X * (b @ X); a /= np.linalg.norm(a); b /= np.linalg.norm(b)
            ang = float(np.degrees(np.arccos(np.clip(a @ b, -1, 1)))); e1 = b - a * (a @ b); e1 /= (np.linalg.norm(e1) + 1e-12)
            js.append([round(v, 3) for v in P2(Jp - org) + P2(a) + P2(e1)] + [round(ang, 2)])
            if f0 is None: f0 = a
            b_last = b; tot += ang
        Fp = skin_front(h, d); g1 = f0 - b_last * (f0 @ b_last); g1 /= (np.linalg.norm(g1) + 1e-12)
        S = np.radians(tot); e0 = np.cos(S) * b_last + np.sin(S) * g1; e1 = b_last - e0 * (b_last @ e0); e1 /= (np.linalg.norm(e1) + 1e-12)
        s3 = float(np.degrees(np.arccos(np.clip(f0 @ b_last, -1, 1))))
        Jk = h.pos(pre + '-' + seg[1])
        out[d] = dict(j=js, tip=[round(v, 3) for v in P2(Fp - org) + P2(e0) + P2(e1)] + [round(tot, 2), round(s3, 2)],
                      back=[round(v, 3) for v in P2(f0)], knuckle=[round(v, 3) for v in P2(Jk - org)])
    return out


def hand(thumb='grip', flex=1.0):
    """(G12) THE hand of this page: the study's pose (posed3d: every joint at its true bend; POSE), its thumb turned about its
    base to where the study rests it on the side (grip: palm lifted, the zero-g grip; heel: palm on the hump; a number between
    0 and 1: that far from grip to heel). Returns the hand and the side view's frame and origin"""
    T = _targets()
    if isinstance(thumb, str): tgt = T[thumb]
    else: tgt = [T['grip'][0] + (T['heel'][0] - T['grip'][0]) * thumb, T['grip'][1] + (T['heel'][1] - T['grip'][1]) * thumb]
    h = posed3d(); B, orgn = view_basis(h, 'side'); org = h.pos(orgn)
    pose_thumb(h, B, org, tgt)
    if flex != 1.0:      # relaxing: the same turn at the thumb's base, the joints at a share of their bend
        x = h.thumb_x; h = posed3d(flex=flex); turn_thumb(h, x)
    return h


_TG = {}
def _targets():
    if 'v' not in _TG: _TG['v'] = grip_place()
    return _TG['v']['targets']


def fade_line(h, B, org):
    """the forearm's fade, as a line in the view (mm, y up): opaque at its second point (5 mm ahead of the wrist joint), gone by
    its first (28 mm behind it), along the forearm"""
    r, u = B[0], B[1]; w = h.pos('wrist'); a = w - h.pos('middle-finger-phalanx-proximal'); a /= np.linalg.norm(a)
    p0, p1 = w + a * 28.0 - org, w - a * 5.0 - org
    return [[round(float(p0 @ r), 2), round(float(p0 @ u), 2)], [round(float(p1 @ r), 2), round(float(p1 @ u), 2)]]


def trace(h, B, org, parts=(), preview=None, dark=None, s=S_PX, tip=TIP_3Q):
    """one view of the hand as flat paths: the whole hand (outline, the light/shadow split cleaned of islands, the lines where one
    part passes in front of another or two digits touch, nails with their folds, the thumb's lunula, creases on every joint), and
    for each digit in `parts` its own outline (edges) and where the rest of the hand hides it (hid)"""
    V = h.skin(); F = h.F; P = h.parts(); J = h.joints(); r, u, tv = B
    V2 = V - org; n = smooth_normals(V2, F); Lt = light(r, u, tv, tip); shade = n @ Lt; tri_part = P[F].mean(1).argmax(-1)
    X, Y = V2 @ r, V2 @ u
    box = (np.floor(X.min()) - 3, np.ceil(Y.max()) + 3); W, H = int((X.max() - box[0] + 3) * s), int((box[1] - Y.min() + 3) * s); box = (box[0], box[1], W, H)
    NF = nail_attrs(h, V, n, Lt)
    comp = layer(V2, F, P, shade, tri_part, list(range(6)), B, box, s, nails=NF, touch=True, clean=24.0)
    reg_c = lambda d: comp['label'] == PARTS.index(d)
    comp['crease'] = creases3d(h, V, B, org, comp, n); comp['fold'] = nail_folds(comp, reg_c)
    out = dict(s=s, box=[box[0], box[1], W / s, H / s], q=20, **pk(comp))
    if dark:      # each farther digit a step darker where it shows: its visible skin, bounded by the lines round it
        out['dark'] = {}
        for nm, lv in dark.items():
            m = comp['label'] == PARTS.index(nm)
            if m.sum() < 8: continue
            out['dark'][nm] = dict(k=lv, p=[q(p_) for p_ in contours(ndimage.gaussian_filter(m.astype(float), 0.7), 0.5, s, box)])
    if parts:
        out['parts'] = {}
        for nm in parts:
            k = PARTS.index(nm)
            Lp = layer(V2, F, P, shade, tri_part, [0, k], B, box, s, own=nm)
            hid = Lp['mask'] & ~(comp['label'] == k)
            hid = ndimage.binary_opening(hid, np.ones((3, 3)))
            out['parts'][nm] = dict(edges=[q(p_) for p_ in Lp['edges']], hid=[q(p_) for p_ in contours(ndimage.gaussian_filter(hid.astype(float), 0.7), 0.5, s, box)] if hid.any() else [])
    j2 = {k_: [round(float((v - org) @ r), 2), round(float((v - org) @ u), 2)] for k_, v in J.items()}
    for d in ('index', 'middle', 'ring', 'little', 'thumb'):
        fp = skin_front(h, d) - org; j2[(FING.get(d, 'thumb')) + '-front'] = [round(float(fp @ r), 2), round(float(fp @ u), 2)]
    out['joints'] = j2; out['arcs'] = arcs_data(h, B, org); out['fade'] = fade_line(h, B, org)
    if preview: draw_preview(dict(out, sil=out['sil']), preview)
    return out, comp


def build_turn(which=None, preview=True):
    """the hand turning: TURN's frames (tq0 ... tq8), VB and VA whole"""
    h = hand('grip'); J = h.joints(); res = {}
    for i, yaw in enumerate(TURN):
        if which is not None and i not in which: continue
        B, orgn = tq_basis(h, path_el(yaw), yaw); org = J[orgn]
        o, comp = trace(h, B, org, parts=('thumb', 'index', 'middle', 'ring', 'little') if i in (VB, VA) else (),
                        preview=os.path.join(OUT, 'tq%d_preview.png' % i) if preview else None)
        o['view'] = dict(yaw=yaw, el=round(path_el(yaw), 2)); res['tq%d' % i] = o
        print('tq%d yaw %.1f el %.1f: %d bytes' % (i, yaw, path_el(yaw), len(json.dumps(o, separators=(',', ':')))), flush=True)
    return res


RELAX = [0.0, 0.25, 0.5, 0.75]  # the hand relaxing in the opening view (VA): the joints at these shares of their resting bend
THUMB_BETWEEN = [0.25, 0.5, 0.75]   # the thumb between its two places on the side (palm lifted -> palm on the hump), side view


def build_all(which=None):
    """every view of the hand the page draws -> out/hand3/gd-hand.json (deck/tools/build.py gd embeds it as GDHAND):
    tq0 .. tq8   the hand turning from the side round to the front and up (TURN); tq4 (VB) and tq8 (VA) with each digit's outline
    rx0 .. rx3   the hand relaxing from straight, in VA (whole-hand traces)
    grip, heel   the side view as gd_rest places it (two layers, so the far fingers pass behind the mouse), each farther finger a
                 step darker; gh0 .. gh2: the thumb on its way between the two"""
    path = os.path.join(OUT, 'gd-hand.json'); res = {}
    want = lambda k: which is None or k in which
    pl = grip_place(); _TG['v'] = pl
    place = dict(lev=round(pl['lev'], 5), sh=round(pl['sh'], 3))
    keep = ('s', 'box', 'q', 'sh', 'layers', 'joints', 'thumb_front', 'fade')
    for v in ('grip', 'heel'):
        if not want(v): continue
        o = build_grip(v, pl['targets'][v]); print(v, 'thumb front', o['thumb_front'], o['log'][-1], 'lev %.2f deg sh %.2f mm' % (np.degrees(pl['lev']), pl['sh']), flush=True)
        res[v] = {k: o[k] for k in keep}; res[v]['place'] = place
    for i, f in enumerate(THUMB_BETWEEN):
        if not want('gh'): continue
        T = pl['targets']; tgt = [T['grip'][0] + (T['heel'][0] - T['grip'][0]) * f, T['grip'][1] + (T['heel'][1] - T['grip'][1]) * f]
        o = build_grip('gh%d' % i, tgt); res['gh%d' % i] = {k: o[k] for k in keep}; print('gh%d' % i, o['log'][-1], flush=True)
    if want('tq'): res.update(build_turn())
    if want('rx'):
        for i, f in enumerate(RELAX):
            h = hand('grip', flex=f); J = h.joints(); yaw = TURN[VA]; B, orgn = tq_basis(h, path_el(yaw), yaw)
            o, _ = trace(h, B, J[orgn], preview=os.path.join(OUT, 'rx%d_preview.png' % i)); o['flex'] = f
            for k in ('arcs',): o.pop(k, None)
            res['rx%d' % i] = o; print('rx%d flex %.2f: %d bytes' % (i, f, len(json.dumps(o, separators=(',', ':')))), flush=True)
    allv = json.load(open(path)) if (which is not None and os.path.exists(path)) else {}
    allv.update(res)
    allv['pose'] = dict(spread=POSE['spread'], thumb_turn=str(POSE['thumb_turn']), turn=TURN, el=[round(path_el(y), 2) for y in TURN], vb=VB, va=VA, relax=RELAX, between=THUMB_BETWEEN)
    json.dump(allv, open(path, 'w'), separators=(',', ':'))
    print('gd-hand.json', os.path.getsize(path), {k: len(json.dumps(v)) for k, v in allv.items()})


if __name__ == '__main__':
    build_all(set(sys.argv[1:]) or None)
