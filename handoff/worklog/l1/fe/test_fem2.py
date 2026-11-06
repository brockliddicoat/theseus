import numpy as np
from fem import *
Lx, b, nx, ny = 100.0, 10.0, 40, 4
xs = np.linspace(0, Lx, nx + 1); ys = np.linspace(-b / 2, b / 2, ny + 1)
X = np.array([[x, y, 0.0] for y in ys for x in xs]); idx = lambda i, j: j * (nx + 1) + i
T = []
for j in range(ny):
    for i in range(nx): T += [[idx(i, j), idx(i + 1, j), idx(i + 1, j + 1)], [idx(i, j), idx(i + 1, j + 1), idx(i, j + 1)]]
T = np.array(T); E = 1000.0
for rib in (False, True):
    m = Model(X); m.add_shells(T, np.ones(len(T)), E, 0.0)
    if rib:
        jc = ny // 2; Bn = np.array([[idx(i, jc), idx(i + 1, jc)] for i in range(nx)]); k = len(Bn)
        w, h = 1.0, 2.0
        m.add_beams(Bn, E, 0.0, np.full(k, w * h), np.full(k, h * w ** 3 / 12), np.full(k, w * h ** 3 / 12), np.full(k, 0.3), up=np.tile([0, 0, 1.0], (k, 1)),
                    off=np.tile([0, 0, 0.5 + h / 2], (k, 1)), h=np.full(k, h), w=np.full(k, w))
    F = np.zeros(6 * len(X)); tip = [idx(nx, j) for j in range(ny + 1)]
    for i in tip: F[6 * i + 2] = -1.0 / len(tip)
    fixed = np.concatenate([6 * idx(0, j) + np.arange(6) for j in range(ny + 1)] + [6 * np.arange(len(X)) + 5])
    U = m.solve(F, fixed); wt = -np.mean([U[6 * i + 2] for i in tip])
    I = 10 / 12 if not rib else 5.25
    print('rib' if rib else 'plate', 'tip %.3f  expect %.3f' % (wt, Lx ** 3 / (3 * E * I)))
