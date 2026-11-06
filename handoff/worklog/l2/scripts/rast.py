"""L2: a small vectorised z-buffer rasteriser (numpy only), orthographic cameras, shading in true greys.

Camera: right r, up u, toward-the-viewer d (d = r x u); screen x = (P.r - x0) * s, y = (y1 - P.u) * s; depth = P.d
(larger = nearer). Pixel (i, j) has its centre at (i + 0.5, j + 0.5)."""
import numpy as np


def cam_from(d, up_hint=(0, 0, 1.0)):
    d = np.asarray(d, float); d /= np.linalg.norm(d)
    u = np.asarray(up_hint, float); u = u - (u @ d) * d; u /= np.linalg.norm(u)
    r = np.cross(u, d)
    return r, u, d


def view_dir(elev_deg, azim_deg, below=False):
    """direction toward the viewer: elevation above (or below) the base plane, azimuth from +Z (nose) toward +X"""
    e, a = np.radians(elev_deg), np.radians(azim_deg)
    y = -np.sin(e) if below else np.sin(e)
    return np.array([np.cos(e) * np.sin(a), y, np.cos(e) * np.cos(a)])


def project(V, cam, s, box):
    r, u, d = cam; x0, y0, x1, y1 = box
    return np.c_[(V @ r - x0) * s, (y1 - V @ u) * s], V @ d


def rasterize(xy, z, F, W, H, faces=None, near=True, maxcand=3_000_000, eps=1e-7):
    """z-buffer: returns zbuf (H*W), fid (H*W, -1 empty) and the barycentric weights of corners 1 and 2"""
    if faces is None: faces = np.arange(len(F))
    F = F[faces]
    zbuf = np.full(H * W, -np.inf if near else np.inf); fid = np.full(H * W, -1, np.int64)
    B1 = np.zeros(H * W, np.float32); B2 = np.zeros(H * W, np.float32)
    A, B, C = xy[F[:, 0]], xy[F[:, 1]], xy[F[:, 2]]
    x0 = np.ceil(np.minimum(np.minimum(A[:, 0], B[:, 0]), C[:, 0]) - 0.5).astype(np.int64)
    x1 = np.floor(np.maximum(np.maximum(A[:, 0], B[:, 0]), C[:, 0]) - 0.5).astype(np.int64)
    y0 = np.ceil(np.minimum(np.minimum(A[:, 1], B[:, 1]), C[:, 1]) - 0.5).astype(np.int64)
    y1 = np.floor(np.maximum(np.maximum(A[:, 1], B[:, 1]), C[:, 1]) - 0.5).astype(np.int64)
    x0 = np.maximum(x0, 0); y0 = np.maximum(y0, 0); x1 = np.minimum(x1, W - 1); y1 = np.minimum(y1, H - 1)
    area = (B[:, 0] - A[:, 0]) * (C[:, 1] - A[:, 1]) - (C[:, 0] - A[:, 0]) * (B[:, 1] - A[:, 1])
    bw = x1 - x0 + 1; bh = y1 - y0 + 1
    ok = (bw > 0) & (bh > 0) & (np.abs(area) > 1e-12)
    K = np.maximum(bw, bh)
    kb = np.where(ok, np.ceil(np.log2(np.maximum(K, 1))).astype(int), -1)
    Za, Zb, Zc = z[F[:, 0]], z[F[:, 1]], z[F[:, 2]]
    for k in range(0, kb.max() + 1 if ok.any() else 0):
        idx = np.where(kb == k)[0]
        if len(idx) == 0: continue
        Kk = 1 << k
        oy, ox = np.divmod(np.arange(Kk * Kk), Kk)
        nc = max(1, maxcand // (Kk * Kk))
        for c0 in range(0, len(idx), nc):
            f = idx[c0:c0 + nc]
            px = x0[f, None] + ox[None, :]; py = y0[f, None] + oy[None, :]
            m = (px <= x1[f, None]) & (py <= y1[f, None])
            cx = px + 0.5; cy = py + 0.5
            ar = area[f, None]
            w0 = ((B[f, 0, None] - cx) * (C[f, 1, None] - cy) - (C[f, 0, None] - cx) * (B[f, 1, None] - cy)) / ar
            w1 = ((C[f, 0, None] - cx) * (A[f, 1, None] - cy) - (A[f, 0, None] - cx) * (C[f, 1, None] - cy)) / ar
            w2 = 1.0 - w0 - w1
            m &= (w0 >= -eps) & (w1 >= -eps) & (w2 >= -eps)
            if not m.any(): continue
            zz = (w0 * Za[f, None] + w1 * Zb[f, None] + w2 * Zc[f, None])[m]
            pix = (py * W + px)[m]
            ff = np.broadcast_to(f[:, None], m.shape)[m]
            b1 = w1[m]; b2 = w2[m]
            order = np.lexsort((-zz if near else zz, pix))
            ps = pix[order]; first = np.r_[True, ps[1:] != ps[:-1]]
            win = order[first]
            pw = pix[win]; zw = zz[win]
            better = zw > zbuf[pw] if near else zw < zbuf[pw]
            pw, win = pw[better], win[better]
            zbuf[pw] = zz[win]; fid[pw] = faces[ff[win]]; B1[pw] = b1[win]; B2[pw] = b2[win]
    return zbuf, fid, B1, B2


def interp(attr, F, fid, B1, B2):
    """per-pixel interpolation of a per-vertex (Nv, k) or per-corner (Nf, 3, k) attribute"""
    m = fid >= 0; f = fid[m]; b1 = B1[m][:, None]; b2 = B2[m][:, None]; b0 = 1 - b1 - b2
    if attr.ndim == 3:
        return attr[f, 0] * b0 + attr[f, 1] * b1 + attr[f, 2] * b2
    return attr[F[f, 0]] * b0 + attr[F[f, 1]] * b1 + attr[F[f, 2]] * b2


def masked_blur(img, mask, sigma):
    import cv2
    a = cv2.GaussianBlur((img * mask).astype(np.float32), (0, 0), sigma)
    b = cv2.GaussianBlur(mask.astype(np.float32), (0, 0), sigma)
    return a / np.maximum(b, 1e-6)


def downsample(img, ss):
    H, W = img.shape[:2]
    h, w = H // ss, W // ss
    return img[:h * ss, :w * ss].reshape(h, ss, w, ss, *img.shape[2:]).mean((1, 3))
