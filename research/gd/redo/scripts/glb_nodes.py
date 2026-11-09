"""Bounding boxes of the named nodes of a GLB (mm), to read where the side buttons sit on the Sora V2 shell.
Usage: python3 glb_nodes.py 3d/shell/shell-sora.glb [name-filter ...]"""
import sys, json, struct
import numpy as np

def load(path):
    b = open(path, 'rb').read(); assert b[:4] == b'glTF'
    off = 12; chunks = []
    while off < len(b):
        ln, ty = struct.unpack('<I4s', b[off:off + 8]); chunks.append((ty, b[off + 8:off + 8 + ln])); off += 8 + ln
    return json.loads(chunks[0][1]), chunks[1][1]

def acc(js, bin_, i):
    a = js['accessors'][i]; bv = js['bufferViews'][a['bufferView']]
    n = {'SCALAR': 1, 'VEC2': 2, 'VEC3': 3, 'VEC4': 4, 'MAT4': 16}[a['type']]
    dt = {5120: 'i1', 5121: 'u1', 5122: 'i2', 5123: 'u2', 5125: 'u4', 5126: 'f4'}[a['componentType']]
    o = bv.get('byteOffset', 0) + a.get('byteOffset', 0); st = bv.get('byteStride')
    if st:
        raw = np.frombuffer(bin_, dtype='u1', count=st * a['count'], offset=o).reshape(a['count'], st)[:, :n * np.dtype(dt).itemsize]
        return np.frombuffer(raw.tobytes(), dtype='<' + dt).reshape(a['count'], n)
    return np.frombuffer(bin_, dtype='<' + dt, count=n * a['count'], offset=o).reshape(a['count'], n)

def mat(nd):
    if 'matrix' in nd: return np.array(nd['matrix'], float).reshape(4, 4).T
    M = np.eye(4)
    if 'scale' in nd: M = np.diag(list(nd['scale']) + [1.0]) @ M
    if 'rotation' in nd:
        x, y, z, w = nd['rotation']; R = np.array([[1 - 2 * (y * y + z * z), 2 * (x * y - z * w), 2 * (x * z + y * w)], [2 * (x * y + z * w), 1 - 2 * (x * x + z * z), 2 * (y * z - x * w)], [2 * (x * z - y * w), 2 * (y * z + x * w), 1 - 2 * (x * x + y * y)]])
        T = np.eye(4); T[:3, :3] = R; M = T @ M
    if 'translation' in nd: T = np.eye(4); T[:3, 3] = nd['translation']; M = T @ M
    return M

if __name__ == '__main__':
    js, bin_ = load(sys.argv[1]); filt = [f.lower() for f in sys.argv[2:]]
    def walk(i, M, out):
        nd = js['nodes'][i]; W = M @ mat(nd)
        if 'mesh' in nd:
            P = []
            for pr in js['meshes'][nd['mesh']]['primitives']:
                v = acc(js, bin_, pr['attributes']['POSITION']).astype(float); P.append((np.c_[v, np.ones(len(v))] @ W.T)[:, :3])
            P = np.vstack(P); out.append((nd.get('name', '?'), P.min(0), P.max(0), len(P)))
        for c in nd.get('children', []): walk(c, W, out)
    out = []
    for r in js['scenes'][js.get('scene', 0)]['nodes']: walk(r, np.eye(4), out)
    for nm, lo, hi, n in out:
        if filt and not any(f in nm.lower() for f in filt): continue
        print('%-22s x %7.2f..%7.2f  y %6.2f..%6.2f  z %7.2f..%7.2f  (%d verts)' % (nm, lo[0], hi[0], lo[1], hi[1], lo[2], hi[2], n))
