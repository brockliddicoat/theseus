"""(G12, Brock 2026-11-09 13:50: "the angle needs to be towards the side at a like 3/4ths view (or similar) ... it's near impossible
to tell the fingers apart from just the side profile, and in many cases the hand looks 4 fingers") Which three-quarter view?
A sheet of candidates, each measured, so the view is chosen by evidence:
  python3 -I deck/tools/gd/hand_views.py [out.png]
The view (hand_draw.tq_basis): the side view's camera raised by `el` to look down onto the back of the hand and moved by `yaw`
toward the fingertips. Orthographic. The hand is the page's one hand (hand_draw.hand: every joint at its true bend, POSE).
Measured per candidate:
  seen   each digit's visible share: its skin's pixels in the whole hand's picture over its pixels drawn alone, and the same for
         its last bone's skin (the fingertip);
  bend   each joint's bend as the picture draws it (the turn between the bone before carried straight on and the bone after, both
         in the joint's own bending plane, projected: hand_draw.arcs_data) over its true size.
What it shows: the fingers bend in planes that face the side, so their bends read from the side and flatten as the camera comes
round to the front, while the far fingers (the ring behind the index and middle, the little finger behind the ring) only come out
from behind the near ones from the front. No single view shows five digits and every bend at 0.6 or more. So two views on one
path are used (hand_draw.TURN): VB for the index, middle and ring fingers' bends, VA for five digits, the little finger's and the
thumb's bends."""
import os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import hand_draw as hd
from hand_pose import FING

DIG = ['thumb', 'index', 'middle', 'ring', 'little']


def measure(h, V, F, P, B, org, s=4.0):
    """the visible share of each digit and of its fingertip; and the raster, for a quick picture"""
    r, u, t = B
    V2 = V - org; X, Y, Z = V2 @ r, V2 @ u, V2 @ t
    box = (np.floor(X.min()) - 3, np.ceil(Y.max()) + 3)
    W, H = int((X.max() - box[0] + 3) * s), int((box[1] - Y.min() + 3) * s); box = (box[0], box[1], W, H)
    tri_part = P[F].mean(1).argmax(-1)
    R = hd.raster(X, Y, Z, F, np.arange(len(F)), box, s)
    top = np.where(R['tid'] >= 0, tri_part[np.clip(R['tid'], 0, None)], -1)
    seen = {}
    for d in DIG:
        k = hd.PARTS.index(d); pre = 'thumb' if d == 'thumb' else FING[d]
        tip_t = (h.W[:, [h.ix[pre + '-phalanx-distal'], h.ix[pre + '-tip']]].sum(1) > 0.5)[F].mean(1) > 0.5
        alone = hd.raster(X, Y, Z, F, np.nonzero(tri_part == k)[0], box, s)['tid'] >= 0
        t_alone = hd.raster(X, Y, Z, F, np.nonzero(tip_t)[0], box, s)['tid'] >= 0
        t_vis = (R['tid'] >= 0) & tip_t[np.clip(R['tid'], 0, None)]
        seen[d] = (float((top == k).sum()) / max(1, alone.sum()), float(t_vis.sum()) / max(1, t_alone.sum()))
    return seen, None, (R, top, box, s, (X, Y, Z))


def bends(h, B, org):
    """each joint's drawn bend over its true one, per digit"""
    A = hd.arcs_data(h, B, org); out = {}
    for d in DIG:
        rs = []
        for j in A[d]['j']:
            a = np.radians(j[6]); v0 = np.array(j[2:4]); v1 = np.cos(a) * v0 + np.sin(a) * np.array(j[4:6])
            rs.append(abs(np.degrees(np.arctan2(v0[0] * v1[1] - v0[1] * v1[0], v0 @ v1))) / j[6])
        out[d] = rs
    return out


def quick(V, F, B, org, M):
    """a quick flat picture: lit and shadow grey, a light line where depth jumps"""
    from scipy import ndimage
    R, top, box, s, (X, Y, Z) = M; r, u, t = B
    n = hd.smooth_normals(V - org, F, it=60)
    Hh, Ww = box[3], box[2]
    sh = hd.interp(R, n @ hd.light(r, u, t), Hh, Ww, np.nan); depth = hd.interp(R, Z, Hh, Ww, -1e9)
    img = np.zeros((Hh, Ww, 3)) + np.array([17, 18, 20.0]); f = top >= 0
    img[f] = np.where((sh < 0)[..., None], np.array([0x77, 0x77, 0x7D], float), np.array([0xA4, 0xA4, 0xAA], float))[f]
    dmin = -ndimage.maximum_filter(np.where(f, -depth, -1e9), 3)
    img[f & ((depth - dmin) > 3)] = [232, 232, 236]; img[ndimage.binary_dilation(f) & ~f] = [232, 232, 236]
    return Image.fromarray(img.astype(np.uint8))


def sheet(path, els=(25, 40, 55), yaws=(0, 20, 35)):
    h = hd.hand('grip'); V = h.skin(); F = h.F; P = h.parts(); J = h.joints()
    try:
        fb = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 21); fs = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 15)
        fh = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 26)
    except Exception:
        fb = fs = fh = ImageFont.load_default()
    def cell(el, yaw, scale=0.62):
        B, orgn = hd.tq_basis(h, el, yaw); org = J[orgn]
        seen, _, M = measure(h, V, F, P, B, org); bd = bends(h, B, org); im = quick(V, F, B, org, M)
        im = im.resize((int(im.width * scale), int(im.height * scale)), Image.LANCZOS)
        print('el %4.1f yaw %4.1f  seen %s  bend %s' % (el, yaw, ' '.join('%s %.0f/%.0f' % (d[:2], 100 * seen[d][0], 100 * seen[d][1]) for d in DIG),
              ' '.join('%s %.2f' % (d[:2], min(bd[d])) for d in DIG)), flush=True)
        return im, seen, bd
    def put(S, d, x0, y0, title, im, seen, bd, mark=None):
        d.text((x0, y0), title, fill=(110, 170, 255) if mark else (230, 230, 232), font=fb)
        S.paste(im, (x0, y0 + 30)); yy = y0 + 34 + im.height
        xx = x0; d.text((xx, yy), 'seen', fill=(150, 150, 154), font=fs); xx += 42
        for dg in DIG:
            tx = '%s %.0f/%.0f  ' % (dg[:2], 100 * seen[dg][0], 100 * seen[dg][1])
            d.text((xx, yy), tx, fill=(255, 96, 96) if seen[dg][0] < 0.5 else (200, 200, 204), font=fs); xx += int(d.textlength(tx, font=fs))
        xx = x0; d.text((xx, yy + 20), 'bend', fill=(150, 150, 154), font=fs); xx += 42
        for dg in DIG:
            tx = '%s %.2f  ' % (dg[:2], min(bd[dg]))
            d.text((xx, yy + 20), tx, fill=(255, 96, 96) if min(bd[dg]) < 0.6 else (200, 200, 204), font=fs); xx += int(d.textlength(tx, font=fs))
        if mark: d.text((x0, yy + 42), mark, fill=(110, 170, 255), font=fs)
    grid = [[(el, yaw) + cell(el, yaw) for yaw in yaws] for el in els]
    pth = [(hd.path_el(y), y) + cell(hd.path_el(y), y) for y in (0.0, 14.0, 35.0, 50.0, 65.0)]
    cw = 470; ch1 = max(c[2].height for row in grid for c in row) + 110; ch2 = max(c[2].height for c in pth) + 130
    Wd = cw * 5 + 30; Hd = 150 + ch1 * len(els) + 110 + ch2 + 20
    S = Image.new('RGB', (Wd, Hd), (17, 18, 20)); d = ImageDraw.Draw(S)
    d.text((16, 12), 'Three-quarter view of the hand: candidates, measured', fill=(240, 240, 242), font=fh)
    for i, ln in enumerate(['Camera on the thumb\'s side, raised (el) over the back of the hand, moved (yaw) toward the fingertips. One pose: every joint at the study\'s angle about its own axis.',
                            'seen: each digit\'s visible share, whole / fingertip, % (under 50 in red).  bend: each digit\'s least joint, as drawn over its true size (under 0.60 in red).',
                            'Finding: no single view gives five visible digits AND every bend at 0.60 or more. The fingers\' bends face the side; the ring and little fingers only come out from behind from the front.']):
        d.text((16, 52 + i * 22), ln, fill=(255, 190, 90) if i == 2 else (180, 180, 184), font=fs)
    d.text((16, 124), 'The grid asked for', fill=(230, 230, 232), font=fb)
    for i, row in enumerate(grid):
        for j, (el, yaw, im, seen, bd) in enumerate(row):
            put(S, d, 16 + j * cw, 156 + i * ch1, 'el %d°, yaw %d°' % (el, yaw), im, seen, bd)
    # beside the grid: what was chosen
    x1 = 16 + 3 * cw + 20; y1 = 160
    for i, ln in enumerate(['Chosen: two views on one path',
                            '', 'VB (yaw 35°, el 25°): the index, middle and ring',
                            'fingers are measured here; every bend is drawn',
                            'at 0.66 or more of its true size (the thumb\'s too).',
                            'The little finger is behind the ring finger.',
                            '', 'VA (yaw 65°, el 35°): all five digits apart.',
                            'The little finger (0.72 or more) and the thumb',
                            '(1.0) are measured here; the slides open and',
                            'settle on it. The index\'s bends flatten to 0.23',
                            'here, so it is not measured in this view.',
                            '', 'The side view itself (yaw 0): the ring finger is',
                            'wholly behind the index and middle fingers',
                            '(same curl, 68° and 73° and 68°): four digits.',
                            '', 'Pose inputs that are estimates: the little',
                            'finger\'s spread (15° at its knuckle; the model\'s',
                            'own closes it 9° onto the ring finger) and the',
                            'thumb\'s turn at its base.']):
        d.text((x1, y1 + i * 24), ln, fill=(110, 170, 255) if i == 0 else (200, 200, 204), font=fb if i == 0 else fs)
    y2 = 156 + ch1 * len(els) + 20
    d.text((16, y2), 'The path used: from the side view round to the front and up (the hand turns along it)', fill=(230, 230, 232), font=fb)
    for j, (el, yaw, im, seen, bd) in enumerate(pth):
        tag = {35.0: 'VB: index, middle and ring fingers measured here', 65.0: 'VA: five digits; little finger and thumb measured here', 0.0: 'the side view (gd_rest, with the mouse)'}.get(yaw)
        put(S, d, 16 + j * cw, y2 + 36, 'yaw %.0f°, el %.0f°' % (yaw, el), im, seen, bd, mark=tag)
    S.save(path)


if __name__ == '__main__':
    out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(hd.OUT, 'view_candidates.png')
    sheet(out); print(out)
