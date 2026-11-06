# centre of mass of each mesh in a GLB: volume centroid if the mesh is closed, else area centroid (thin uniform wall)
import json, struct, sys
import numpy as np
def load(p):
    b = open(p, 'rb').read()
    assert b[:4] == b'glTF'
    off = 12; chunks = []
    while off < len(b):
        L, T = struct.unpack_from('<I4s', b, off); chunks.append((T, b[off + 8: off + 8 + L])); off += 8 + L
    js = json.loads(chunks[0][1]); bin_ = chunks[1][1] if len(chunks) > 1 else b''
    return js, bin_
CT = {5120: np.int8, 5121: np.uint8, 5122: np.int16, 5123: np.uint16, 5125: np.uint32, 5126: np.float32}
NC = {'SCALAR': 1, 'VEC2': 2, 'VEC3': 3, 'VEC4': 4, 'MAT4': 16}
def acc(js, bin_, i):
    a = js['accessors'][i]; bv = js['bufferViews'][a['bufferView']]
    dt = CT[a['componentType']]; n = NC[a['type']]; st = bv.get('byteStride', 0); o = bv.get('byteOffset', 0) + a.get('byteOffset', 0)
    cnt = a['count']; isz = np.dtype(dt).itemsize * n
    if st and st != isz:
        out = np.stack([np.frombuffer(bin_, dt, n, o + k * st) for k in range(cnt)])
    else:
        out = np.frombuffer(bin_, dt, cnt * n, o).reshape(cnt, n)
    return out.astype(np.float64)
def node_mats(js):
    mats = {}
    def q2m(q):
        x, y, z, w = q
        return np.array([[1-2*(y*y+z*z), 2*(x*y-z*w), 2*(x*z+y*w)], [2*(x*y+z*w), 1-2*(x*x+z*z), 2*(y*z-x*w)], [2*(x*z-y*w), 2*(y*z+x*w), 1-2*(x*x+y*y)]])
    def local(nd):
        M = np.eye(4)
        if 'matrix' in nd: return np.array(nd['matrix']).reshape(4, 4).T
        T = np.eye(4); T[:3, 3] = nd.get('translation', [0, 0, 0])
        R = np.eye(4); R[:3, :3] = q2m(nd.get('rotation', [0, 0, 0, 1]))
        S = np.diag(list(nd.get('scale', [1, 1, 1])) + [1])
        return T @ R @ S
    def walk(i, P):
        nd = js['nodes'][i]; M = P @ local(nd); mats[i] = M
        for c in nd.get('children', []): walk(c, M)
    for s in js.get('scenes', [{}])[js.get('scene', 0)].get('nodes', []): walk(s, np.eye(4))
    return mats
js, bin_ = load(sys.argv[1])
mats = node_mats(js)
for ni, M in mats.items():
    nd = js['nodes'][ni]
    if 'mesh' not in nd: continue
    mesh = js['meshes'][nd['mesh']]
    V = []; F = []; base = 0
    for pr in mesh['primitives']:
        p = acc(js, bin_, pr['attributes']['POSITION']); p = (np.c_[p, np.ones(len(p))] @ M.T)[:, :3]
        idx = acc(js, bin_, pr['indices']).astype(np.int64).reshape(-1, 3) if 'indices' in pr else np.arange(len(p)).reshape(-1, 3)
        V.append(p); F.append(idx + base); base += len(p)
    V = np.vstack(V); F = np.vstack(F)
    a, b, c = V[F[:, 0]], V[F[:, 1]], V[F[:, 2]]
    cr = np.cross(b - a, c - a); area = 0.5 * np.linalg.norm(cr, axis=1); At = area.sum()
    ac = ((a + b + c) / 3 * area[:, None]).sum(0) / At
    vol = (np.einsum('ij,ij->i', a, np.cross(b, c)) / 6); Vt = vol.sum()
    vc = ((a + b + c) / 4 * vol[:, None]).sum(0) / Vt if abs(Vt) > 1e-6 else np.array([np.nan] * 3)
    name = nd.get('name') or mesh.get('name')
    print('%-14s tris %6d area %8.1f mm2 vol %9.1f mm3  areaC [%.2f %.2f %.2f]  volC [%.2f %.2f %.2f]  bbox x %.1f..%.1f y %.1f..%.1f z %.1f..%.1f' % (name, len(F), At, Vt, *ac, *vc, V[:,0].min(), V[:,0].max(), V[:,1].min(), V[:,1].max(), V[:,2].min(), V[:,2].max()))
