"""Build the IMLS skin field and cache it on a global grid.
python3 skin_grid.py work/skin_ad_40.npz work/skingrid.npz
"""
import sys, time, numpy as np, trimesh
from scipy.ndimage import map_coordinates
sys.path.insert(0, '/home/claude/theseus/3d/shell/tools')
from loop import loop_step
from sdf import Skin

LO = np.array([-32.6, -0.4, -60.8]); HI = np.array([32.6, 39.2, 61.2]); H = 0.2


def skin_samples(path):
    d = np.load(path)
    X, Ff = d['X'], d['Ff'].astype(np.int64)
    S, F3 = loop_step(Ff, len(X))
    X3 = S @ X
    m = trimesh.Trimesh(X3, F3, process=False)
    return X3, m.vertex_normals.copy(), F3


def build(path, out):
    t0 = time.time()
    S, N, F3 = skin_samples(path)
    sk = Skin(S, N, k=8, sym=True)
    print('samples', len(S), 'h', sk.h, '%.1fs' % (time.time() - t0))
    shape = (np.ceil((HI - LO) / H).astype(int) + 1)
    nx, ny, nz = shape
    xs = LO[0] + H * np.arange(nx); ys = LO[1] + H * np.arange(ny); zs = LO[2] + H * np.arange(nz)
    # coarse 1.0 mm grid, exact
    Hc = 1.0
    cs = (np.ceil((HI - LO) / Hc).astype(int) + 1)
    cx = LO[0] + Hc * np.arange(cs[0]); cy = LO[1] + Hc * np.arange(cs[1]); cz = LO[2] + Hc * np.arange(cs[2])
    Pc = np.stack(np.meshgrid(cx, cy, cz, indexing='ij'), -1).reshape(-1, 3)
    fc = sk(Pc).reshape(cs)
    # far from the samples IMLS is meaningless: clamp using sample distance and an inside test from the coarse sign
    print('coarse done %.1fs' % (time.time() - t0))
    vol = np.empty((nx, ny, nz), np.float32)
    band = 2.2
    nexact = 0
    for a in range(0, nz, 24):
        zz = zs[a:a + 24]
        gx, gy, gz = np.meshgrid((xs - LO[0]) / Hc, (ys - LO[1]) / Hc, (zz - LO[2]) / Hc, indexing='ij')
        approx = map_coordinates(fc, [gx.ravel(), gy.ravel(), gz.ravel()], order=1, mode='nearest')
        sel = np.abs(approx) < band
        if sel.any():
            P = np.stack(np.meshgrid(xs, ys, zz, indexing='ij'), -1).reshape(-1, 3)[sel]
            approx[sel] = sk(P)
            nexact += sel.sum()
        vol[:, :, a:a + 24] = approx.reshape(nx, ny, len(zz))
    print('fine done: exact evals %d  %.1fs' % (nexact, time.time() - t0))
    np.savez(out, vol=vol, lo=LO, h=H, S=S.astype(np.float32), N=N.astype(np.float32))
    return vol


if __name__ == '__main__':
    build(sys.argv[1], sys.argv[2])
