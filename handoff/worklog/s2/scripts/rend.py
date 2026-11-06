"""Orthographic shaded renders of shell GLBs (S1's painter renderer), cropped to a scene box, at s px/mm.
python3 rend.py <glb> <out.png> <view> <s> <u0,v0,u1,v1 in view coords> [nodes]"""
import sys, time
import numpy as np, cv2
sys.path.insert(0, '/home/claude/work/s1/scripts')
from render import load, render, VIEWS
if __name__ == '__main__':
    fn, out, view, s = sys.argv[1], sys.argv[2], sys.argv[3], float(sys.argv[4])
    box = tuple(float(v) for v in sys.argv[5].split(',')) if len(sys.argv) > 5 and sys.argv[5] else None
    names = sys.argv[6].split(',') if len(sys.argv) > 6 and sys.argv[6] else None
    t0 = time.time()
    M = load(fn, names)
    img, b = render(M, view, s, box=box)
    cv2.imwrite(out, img[:, :, ::-1]); print(out, img.shape, 'box', [round(v, 2) for v in b], '%.1fs' % (time.time() - t0))
