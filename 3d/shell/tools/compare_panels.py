"""Side-by-side panels: reference photo | model render (same view), scaled by silhouette bbox.
python3 compare_panels.py <render.png> <photo> <out.png> <title> [bg=paper|night]
"""
import sys, numpy as np
from PIL import Image, ImageDraw, ImageFont

def mouse_bbox(im, dark_thr=None):
    a = np.asarray(im.convert('RGB')).astype(float)
    bg = np.median(np.r_[a[:8].reshape(-1, 3), a[-8:].reshape(-1, 3), a[:, :8].reshape(-1, 3), a[:, -8:].reshape(-1, 3)], 0)
    d = np.abs(a - bg).sum(2)
    m = d > (60 if dark_thr is None else dark_thr)
    ys, xs = np.nonzero(m)
    return xs.min(), ys.min(), xs.max(), ys.max()

def panel(render, photo, out, title, bg='paper'):
    R = Image.open(render).convert('RGB'); P = Image.open(photo).convert('RGB')
    rb = mouse_bbox(R); pb = mouse_bbox(P)
    H = 900
    # scale so the mouse heights match at 70% of the panel height
    def crop_scale(im, b):
        x0, y0, x1, y1 = b; cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
        s = (0.72 * H) / max(y1 - y0, (x1 - x0) * 0.56)
        im2 = im.resize((int(im.width * s), int(im.height * s)), Image.LANCZOS)
        W = 1200
        cx, cy = cx * s, cy * s
        box = (int(cx - W / 2), int(cy - H / 2), int(cx + W / 2), int(cy + H / 2))
        canvas = Image.new('RGB', (W, H), im.getpixel((2, 2)))
        canvas.paste(im2.crop((max(0, box[0]), max(0, box[1]), min(im2.width, box[2]), min(im2.height, box[3]))), (max(0, -box[0]), max(0, -box[1])))
        return canvas
    A = crop_scale(P, pb); B = crop_scale(R, rb)
    col = (247, 246, 242) if bg == 'paper' else (13, 14, 15)
    fg = (40, 40, 40) if bg == 'paper' else (220, 220, 220)
    out_im = Image.new('RGB', (2 * 1200 + 30, H + 70), col)
    out_im.paste(A, (0, 70)); out_im.paste(B, (1230, 70))
    dr = ImageDraw.Draw(out_im)
    try:
        f = ImageFont.truetype('/usr/share/fonts/opentype/inter/Inter-Medium.otf', 26)
        f2 = ImageFont.truetype('/usr/share/fonts/opentype/inter/Inter-Regular.otf', 20)
    except Exception:
        f = f2 = None
    dr.text((20, 18), 'Reference photo', fill=fg, font=f)
    dr.text((1250, 18), title, fill=fg, font=f)
    out_im.save(out)

if __name__ == '__main__':
    a = sys.argv
    panel(a[1], a[2], a[3], a[4], a[5] if len(a) > 5 else 'paper')
