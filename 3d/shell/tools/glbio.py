"""Minimal GLB reader/writer with numpy (no external deps): read meshes as arrays, write a GLB back."""
import json, struct, numpy as np
COMP = {5126: np.float32, 5123: np.uint16, 5125: np.uint32, 5121: np.uint8, 5122: np.int16, 5120: np.int8}
NCOMP = {'SCALAR': 1, 'VEC2': 2, 'VEC3': 3, 'VEC4': 4}
def read(fn):
    f = open(fn, 'rb').read()
    clen, _ = struct.unpack('<II', f[12:20]); js = json.loads(f[20:20 + clen])
    off = 20 + clen; blen, _ = struct.unpack('<II', f[off:off + 8]); b = f[off + 8: off + 8 + blen]
    return js, b
def acc(js, b, i):
    a = js['accessors'][i]; bv = js['bufferViews'][a['bufferView']]
    dt = COMP[a['componentType']]; n = NCOMP[a['type']]; item = np.dtype(dt).itemsize * n
    start = bv.get('byteOffset', 0) + a.get('byteOffset', 0); stride = bv.get('byteStride', item)
    raw = np.frombuffer(b, dtype=np.uint8, count=stride * (a['count'] - 1) + item, offset=start)
    out = np.lib.stride_tricks.as_strided(raw, shape=(a['count'], item), strides=(stride, 1)).copy().view(dt).reshape(a['count'], n)
    if a.get('normalized') and dt != np.float32:
        out = out.astype(np.float32) / float(np.iinfo(dt).max)
    return out
def mesh_arrays(js, b, node_name):
    n = next(n for n in js['nodes'] if n.get('name') == node_name)
    p = js['meshes'][n['mesh']]['primitives'][0]
    d = {k: acc(js, b, v) for k, v in p['attributes'].items()}
    d['indices'] = acc(js, b, p['indices']).reshape(-1)
    d['material'] = p.get('material')
    return n, d
