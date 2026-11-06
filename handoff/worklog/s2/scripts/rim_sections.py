"""Sections z = const through the body near the rim (+X wall): outer and inner surfaces, the crease, the base."""
import sys, numpy as np, cv2
sys.path.insert(0, '/home/claude/work/s1/scripts')
from render import load
def section_z(P, T, z0):
    A, B, C = P[T[:, 0]], P[T[:, 1]], P[T[:, 2]]
    d = np.stack([A[:, 2], B[:, 2], C[:, 2]], 1) - z0
    s = np.sign(d); m = ~((s > 0).all(1) | (s < 0).all(1))
    V = np.stack([A, B, C], 1)[m]; dd = d[m]; out = []
    for i in range(len(V)):
        pts = []
        for a, b in ((0, 1), (1, 2), (2, 0)):
            if (dd[i, a] < 0) != (dd[i, b] < 0):
                t = dd[i, a] / (dd[i, a] - dd[i, b]); pts.append(V[i, a] + t * (V[i, b] - V[i, a]))
        if len(pts) == 2: out.append(pts)
    return np.array(out)
if __name__ == '__main__':
    fn, out = sys.argv[1], sys.argv[2]; zs = [float(v) for v in sys.argv[3].split(',')]
    M = load(fn, ['body'])
    S = 60; tiles = []
    for z0 in zs:
        segs = section_z(M[0][1], M[0][4], z0)
        segs = segs[(segs[:, :, 0] > 0).all(1) & (segs[:, :, 1] < 12).all(1)]
        xm = segs[:, :, 0].max()
        x0, x1, y0, y1 = xm - 9, xm + 1, -0.5, 11.5
        img = np.full((int((y1 - y0) * S), int((x1 - x0) * S), 3), 255, np.uint8)
        for g in range(int(y0), int(y1) + 1): cv2.line(img, (0, int((y1 - g) * S)), (img.shape[1], int((y1 - g) * S)), (225, 225, 225), 1)
        for g in range(int(x0), int(x1) + 1): cv2.line(img, (int((g - x0) * S), 0), (int((g - x0) * S), img.shape[0]), (225, 225, 225), 1)
        for a, b in segs:
            cv2.line(img, (int((a[0] - x0) * S), int((y1 - a[1]) * S)), (int((b[0] - x0) * S), int((y1 - b[1]) * S)), (60, 60, 60), 2, cv2.LINE_AA)
        cv2.putText(img, 'z = %.0f' % z0, (8, 28), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 0), 2)
        tiles.append(img)
    H = max(t.shape[0] for t in tiles)
    tiles = [cv2.copyMakeBorder(t, 0, H - t.shape[0], 0, 6, cv2.BORDER_CONSTANT, value=(255, 255, 255)) for t in tiles]
    cv2.imwrite(out, np.hstack(tiles)); print(out)
