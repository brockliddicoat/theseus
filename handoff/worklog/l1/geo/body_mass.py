import trimesh, numpy as np
sc = trimesh.load('/home/claude/theseus/3d/shell/shell-theseus-1seam.glb', force='scene')
def vol_below(m, y0):
    V = m.vertices[m.faces]                     # (n, 3, 3)
    O = np.array([0.0, y0, 0.0])
    yv = V[:, :, 1]; below = yv <= y0
    nb = below.sum(1)
    tot = 0.0
    full = V[nb == 3] - O
    tot += np.einsum('ij,ij->i', full[:, 0], np.cross(full[:, 1], full[:, 2])).sum() / 6
    for tri in V[(nb == 1) | (nb == 2)]:
        # clip the polygon against y <= y0
        out = []
        for k in range(3):
            P, Q = tri[k], tri[(k + 1) % 3]
            pin, qin = P[1] <= y0, Q[1] <= y0
            if pin: out.append(P)
            if pin != qin:
                t = (y0 - P[1]) / (Q[1] - P[1]); out.append(P + t * (Q - P))
        out = np.array(out) - O
        for k in range(1, len(out) - 1):
            tot += np.dot(out[0], np.cross(out[k], out[k + 1])) / 6
    return tot
b = sc.geometry['body']
print('body', round(b.volume, 1), 'check', round(vol_below(b, 100), 1))
prev = 0
for y in [1.25, 1.85, 2.5, 3.5, 5.0, 7.0, 9.3, 12, 16, 20, 25, 30, 38.2]:
    v = vol_below(b, y); print(f'  below y={y:5.2f}: {v:8.1f} mm3 ({v*1.01e-3:6.3f} g)  band {v-prev:7.1f}'); prev = v
for tg in ['triggerL', 'triggerR', 'sideFront', 'sideRear', 'plate', 'core']:
    g = sc.geometry[tg]; print(tg, 'vol', round(g.volume, 1), 'mm3', round(g.volume*1.01e-3, 3), 'g', 'watertight', g.is_watertight)
