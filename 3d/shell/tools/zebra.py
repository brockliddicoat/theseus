"""Fairness check: render with reflection-line stripes (zebra) + shaded view."""
import sys, numpy as np
sys.path.insert(0, '/home/claude/theseus/3d/shell/tools')
from raster import persp_cam, render, vertex_normals
from PIL import Image
def zebra(V, F, cam, W, H, freq=14.0):
    R = render(V, F, cam, W, H)
    vn, fn = vertex_normals(V, F)
    m = R['mask']; fid = R['fid'][m]; b = R['bary'][m]
    n = vn[F[fid, 0]]*b[:, 0:1] + vn[F[fid, 1]]*b[:, 1:2] + vn[F[fid, 2]]*b[:, 2:3]
    n /= np.linalg.norm(n, axis=1, keepdims=True)
    pts = V[F[fid, 0]]*b[:, 0:1] + V[F[fid, 1]]*b[:, 1:2] + V[F[fid, 2]]*b[:, 2:3]
    v = cam['eye'][None] - pts; v /= np.linalg.norm(v, axis=1, keepdims=True)
    r = 2*(n*v).sum(1, keepdims=True)*n - v          # reflection vector
    s = 0.5 + 0.5*np.sign(np.sin(freq*np.arctan2(r[:, 1], np.hypot(r[:, 0], r[:, 2]))))
    img = np.ones((H, W, 3))*0.97
    c = np.c_[s, s, s]*0.85 + 0.1
    img[m] = c
    return (img*255).astype(np.uint8)
if __name__ == '__main__':
    d = np.load(sys.argv[1]); out = sys.argv[2]
    if 'X' in d: V, F = d['X'], d['Ff']
    else: V, F = d['V'] if 'V' in d else d['vertices'], d['F'] if 'F' in d else d['faces']
    V = V.astype(float); F = F.astype(np.int64)
    cams = {'z_a': persp_cam((110, 90, 120), (0, 12, 5), (0, 1, 0), 30),
            'z_b': persp_cam((-120, 70, -110), (0, 12, 0), (0, 1, 0), 30),
            'z_top': persp_cam((0, 170, 0.1), (0, 15, 0), (0, 0, 1), 42)}
    tiles = []
    for k, c in cams.items():
        tiles.append(zebra(V, F, c, 800, 560))
    Image.fromarray(np.concatenate(tiles, 1)).save(out)
