"""benchmark: a simply supported strip (100 x 10 mm, t 0.5) with a centre rib (w 0.5, h 2) under a centre point load;
beam theory for the T-section; mesh nx = 10..160 along the length"""
import numpy as np
from fem import *
E, nu = 13500.0, 0.0
Lx, b, t, w, h = 100.0, 10.0, 0.5, 0.5, 2.0
# T-section stiffness (flange b x t, web w x h on top of it)
A1, A2 = b * t, w * h; y1, y2 = t / 2, t + h / 2
yc = (A1 * y1 + A2 * y2) / (A1 + A2)
I = b * t ** 3 / 12 + A1 * (yc - y1) ** 2 + w * h ** 3 / 12 + A2 * (y2 - yc) ** 2
exact = 1.0 * Lx ** 3 / (48 * E * I)
for nx in [10, 20, 40, 80, 160]:
    ny = 4
    xs = np.linspace(0, Lx, nx + 1); ys = np.linspace(-b / 2, b / 2, ny + 1)
    X = np.array([[x, y, 0.0] for y in ys for x in xs]); idx = lambda i, j: j * (nx + 1) + i
    T = []
    for j in range(ny):
        for i in range(nx): T += [[idx(i, j), idx(i + 1, j), idx(i + 1, j + 1)], [idx(i, j), idx(i + 1, j + 1), idx(i, j + 1)]]
    T = np.array(T)
    m = Model(X); m.add_shells(T, np.full(len(T), t), E, nu, membrane='allman')
    jc = ny // 2; Bn = np.array([[idx(i, jc), idx(i + 1, jc)] for i in range(nx)]); k = len(Bn)
    m.add_beams(Bn, E, nu, np.full(k, w * h), np.full(k, h * w ** 3 / 12), np.full(k, w * h ** 3 / 12), np.full(k, 0.3 * w ** 3 * h / 3), up=np.tile([0, 0, 1.0], (k, 1)),
                off=np.tile([0, 0, t / 2 + h / 2], (k, 1)), h=np.full(k, h), w=np.full(k, w))
    F = np.zeros(6 * len(X)); mid = [idx(nx // 2, j) for j in range(ny + 1)]
    for i in mid: F[6 * i + 2] = -1.0 / len(mid)
    fixed = []
    for j in range(ny + 1):
        fixed += [6 * idx(0, j) + 2, 6 * idx(nx, j) + 2]
    fixed += [6 * idx(0, jc), 6 * idx(0, jc) + 1, 6 * idx(nx, jc) + 1]
    fixed += list(6 * np.arange(len(X)) + 5)
    U = m.solve(F, np.array(sorted(set(fixed))))
    wm = -np.mean([U[6 * i + 2] for i in mid])
    print(f'nx={nx:4d} (h={Lx/nx:5.2f} mm)  mid deflection {wm:.5f}  beam theory {exact:.5f}  ratio {wm/exact:.3f}')
