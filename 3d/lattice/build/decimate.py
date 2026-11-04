"""decimate one raw part saved by s04_mesh.py (separate process to keep peak memory low)"""
import sys, os, numpy as np, fast_simplification
rp, out, target, h = sys.argv[1], sys.argv[2], int(sys.argv[3]), float(sys.argv[4])
V = np.load(rp.replace('.npy', '_V.npy')); F = np.load(rp.replace('.npy', '_F.npy'))
raw_n = len(F)
if len(F) > target:
    V, F = fast_simplification.simplify(V.astype(np.float32), F.astype(np.int32), target_reduction=1 - target / len(F), agg=5)
np.savez_compressed(out, V=np.asarray(V, np.float32), F=np.asarray(F, np.int32), h=h, raw=raw_n)
os.remove(rp.replace('.npy', '_V.npy')); os.remove(rp.replace('.npy', '_F.npy'))
print(os.path.basename(out), 'raw', raw_n, '->', len(F), flush=True)
