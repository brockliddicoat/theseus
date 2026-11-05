# Board placement plan (step 1): new outline + parts, to scale, top and underside. Layout frame: x = user's right, z = nose.
import math, json, numpy as np
import matplotlib; matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import Polygon as MP, Rectangle, Circle, FancyBboxPatch
from matplotlib.path import Path
BLUE, INK, GREY, LG, RED, GOLD = '#1E6EEB', '#141416', '#7A7A78', '#C9C8C3', '#C0523E', '#C9A24A'
def fillet_corner(p, a, b, r, n=24):
    p, a, b = map(np.asarray, (p, a, b)); u = (a - p) / np.linalg.norm(a - p); v = (b - p) / np.linalg.norm(b - p)
    ang = math.acos(np.clip(u @ v, -1, 1)); d = r / math.tan(ang / 2); c = p + (u + v) / np.linalg.norm(u + v) * (r / math.sin(ang / 2))
    p1, p2 = p + u * d, p + v * d; a1, a2 = math.atan2(*(p1 - c)[::-1]), math.atan2(*(p2 - c)[::-1]); da = (a2 - a1 + math.pi) % (2 * math.pi) - math.pi
    return [tuple(c + r * np.array([math.cos(a1 + da * k / n), math.sin(a1 + da * k / n)])) for k in range(n + 1)]
def poly_fillets(corners):
    out = []
    for i, (x, z, r) in enumerate(corners):
        prv, nxt = corners[i - 1][:2], corners[(i + 1) % len(corners)][:2]
        out += fillet_corner((x, z), prv, nxt, r) if r > 0 else [(x, z)]
    return out
def arc(c, R, a0, a1, n=40): return [(c[0] + R * math.cos(a0 + (a1 - a0) * k / n), c[1] + R * math.sin(a0 + (a1 - a0) * k / n)) for k in range(n + 1)]
