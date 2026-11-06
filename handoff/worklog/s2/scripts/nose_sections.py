"""Sections x = const through the nose (body grey, triggerL blue): what the lip and the body's front look like."""
import sys, numpy as np, cv2
sys.path.insert(0, '/home/claude/work/s1/scripts')
from render import load
def section_x(P, T, x0):
    A, B, C = P[T[:, 0]], P[T[:, 1]], P[T[:, 2]]
    segs = []
    for (p, q, r) in ((A, B, C), (B, C, A), (C, A, B)):
        pass
    d = np.stack([A[:, 0], B[:, 0], C[:, 0]], 1) - x0
    s = np.sign(d); m = ~((s > 0).all(1) | (s < 0).all(1))
    out = []
    V = np.stack([A, B, C], 1)[m]; dd = d[m]
    for i in range(len(V)):
        pts = []
        for a, b in ((0, 1), (1, 2), (2, 0)):
            if (dd[i, a] < 0) != (dd[i, b] < 0):
                t = dd[i, a] / (dd[i, a] - dd[i, b]); pts.append(V[i, a] + t * (V[i, b] - V[i, a]))
        if len(pts) == 2: out.append(pts)
    return np.array(out)
if __name__ == '__main__':
    fn, out = sys.argv[1], sys.argv[2]
    xs = [float(v) for v in sys.argv[3].split(',')]
    M = load(fn, ['body', 'triggerL'])
    S = 40; z0, z1, y0, y1 = 44.0, 61.0, 2.0, 22.0
    tiles = []
    for x0 in xs:
        img = np.full((int((y1 - y0) * S), int((z1 - z0) * S), 3), 255, np.uint8)
        for g in range(int(y0), int(y1) + 1):
            cv2.line(img, (0, int((y1 - g) * S)), (img.shape[1], int((y1 - g) * S)), (235, 235, 235) if g % 5 else (200, 200, 200), 1)
        for g in range(int(z0), int(z1) + 1):
            cv2.line(img, (int((g - z0) * S), 0), (int((g - z0) * S), img.shape[0]), (235, 235, 235) if g % 5 else (200, 200, 200), 1)
        for name, P, N, C, T in M:
            sg = section_x(P, T, x0)
            col = (90, 90, 90) if name == 'body' else (200, 110, 20)
            for a, b in sg:
                pa = (int((a[2] - z0) * S), int((y1 - a[1]) * S)); pb = (int((b[2] - z0) * S), int((y1 - b[1]) * S))
                cv2.line(img, pa, pb, col, 2, cv2.LINE_AA)
        cv2.putText(img, 'x = %.0f' % x0, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 0), 2)
        tiles.append(img)
    rows = [np.hstack(tiles[i:i + 3]) for i in range(0, len(tiles), 3)]
    W = max(r.shape[1] for r in rows)
    rows = [cv2.copyMakeBorder(r, 0, 4, 0, W - r.shape[1], cv2.BORDER_CONSTANT, value=(255, 255, 255)) for r in rows]
    cv2.imwrite(out, np.vstack(rows)); print(out)
