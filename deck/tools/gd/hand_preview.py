"""quick looks at the posed hand from any direction (flat Lambert, painter's order): for checking a pose, not for the deck"""
import sys, numpy as np
from PIL import Image, ImageDraw
sys.path.insert(0, __import__('os').path.dirname(__file__))
from hand_pose import Hand, rot

def basis(view, up):
    v = np.asarray(view, float); v /= np.linalg.norm(v); u = np.asarray(up, float); u = u - v * (u @ v); u /= np.linalg.norm(u)
    r = np.cross(u, v)          # screen right for a camera looking along v (toward the hand), up u
    return r, u, -v

def look(V, F, B, path, s=4.0, mirror=False, marks=()):
    r, u, t = B
    X = V @ r * (-1 if mirror else 1); Y = V @ u; Z = V @ t
    x0, y1 = X.min() - 8, Y.max() + 8; W = int((X.max() - x0 + 8) * s); Hh = int((y1 - Y.min() + 8) * s)
    im = Image.new('RGB', (W, Hh), (17, 18, 20)); d = ImageDraw.Draw(im)
    tri = F[np.argsort(Z[F].mean(1))]
    A, Bv, C = V[tri[:, 0]], V[tri[:, 1]], V[tri[:, 2]]
    n = np.cross(Bv - A, C - A); n /= np.linalg.norm(n, axis=1)[:, None] + 1e-12
    L = -0.42 * r * (-1 if mirror else 1) + 0.91 * u + 0.3 * t; L /= np.linalg.norm(L)
    sh = np.clip(np.abs(n @ L), 0, 1) * 0.75 + 0.2
    for k, f in enumerate(tri):
        pts = [((X[i] - x0) * s, (y1 - Y[i]) * s) for i in f]
        g = int(255 * sh[k]); d.polygon(pts, fill=(g, g, int(g * 1.02)))
    for (p, col) in marks:
        x, y = (p @ r * (-1 if mirror else 1) - x0) * s, (y1 - p @ u) * s
        d.ellipse([x - 4, y - 4, x + 4, y + 4], fill=col)
    im.save(path)
    return im
