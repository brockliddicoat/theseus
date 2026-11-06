"""S2 nose study: the nose of a shell GLB in four shaded views at S px/mm (side from the user's right half? no: from +X = the
user's left, nose left; front; top; 3/4 front), same boxes for every shell so they compare 1:1.
python3 nose_views.py <glb> <out_prefix> [S]"""
import sys, time
import numpy as np, cv2
sys.path.insert(0, '/home/claude/work/s1/scripts')
from render import load, render, VIEWS, view34
S = 32.0
V34 = view34(38, 24)                     # from the front, user's left side (+X), above
BOXES = {
    'side':  ('left',  (-62.0, 2.0, -34.0, 24.0)),        # screen x = -z, y = y
    'front': ('front', (-2.0, 2.0, 34.0, 24.0)),          # x = +X (user's left) to the right; centre line at the left edge
    'top':   ('top',   (-34.0, 38.0, 2.0, 62.0)),         # screen x = -X, y = z: the +X half, nose up
}
def box34(M):
    r, u, d = V34
    P = np.vstack([m[1] for m in M]); P = P[(P[:, 2] > 36) & (P[:, 0] > -6) & (P[:, 1] > 1)]
    X, Y = P @ r, P @ u
    return (X.min() - 1, Y.min() - 1, X.max() + 1, Y.max() + 1)
def views(fn, S=S, names=('body', 'triggerL', 'triggerR')):
    M = load(fn, list(names))
    out = {}
    for k, (v, bx) in BOXES.items():
        out[k] = render(M, v, S, box=bx)
    out['34'] = render(M, V34, S, box=BOX34 if BOX34 else box34(M))
    return out
BOX34 = None
if __name__ == '__main__':
    fn, pre = sys.argv[1], sys.argv[2]
    s = float(sys.argv[3]) if len(sys.argv) > 3 else S
    if len(sys.argv) > 4: BOX34 = tuple(float(v) for v in sys.argv[4].split(','))
    t0 = time.time()
    out = views(fn, s)
    for k, (img, b) in out.items():
        cv2.imwrite('%s_%s.png' % (pre, k), img[:, :, ::-1]); print(k, img.shape, [round(v, 2) for v in b])
    print('%.1fs' % (time.time() - t0))
