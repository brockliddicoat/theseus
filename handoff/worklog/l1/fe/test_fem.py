import numpy as np
from fem import *
def plate(n, a=100.0, clamped=False, point=False, flip=False):
    xs = np.linspace(0, a, n + 1)
    X = np.array([[x, y, 0.0] for y in xs for x in xs])
    idx = lambda i, j: j * (n + 1) + i
    T = []
    for j in range(n):
        for i in range(n):
            if (i + j) % 2 == 0 or not flip:
                T += [[idx(i, j), idx(i + 1, j), idx(i + 1, j + 1)], [idx(i, j), idx(i + 1, j + 1), idx(i, j + 1)]]
            else:
                T += [[idx(i, j), idx(i + 1, j), idx(i, j + 1)], [idx(i + 1, j), idx(i + 1, j + 1), idx(i, j + 1)]]
    T = np.array(T)
    E, nu, t, q = 1e4, 0.3, 1.0, 1e-3
    m = Model(X); m.add_shells(T, np.full(len(T), t), E, nu)
    F = np.zeros(6 * len(X))
    if point:
        c = idx(n // 2, n // 2); F[6 * c + 2] = -1.0
    else:
        A = np.zeros(len(X))
        P1, P2, P3 = X[T[:, 0]], X[T[:, 1]], X[T[:, 2]]
        ar = 0.5 * np.linalg.norm(np.cross(P2 - P1, P3 - P1), axis=1)
        for k in range(3): np.add.at(A, T[:, k], ar / 3)
        F[6 * np.arange(len(X)) + 2] = -q * A
    edge = [i for i, p in enumerate(X) if p[0] < 1e-9 or p[1] < 1e-9 or p[0] > a - 1e-9 or p[1] > a - 1e-9]
    fixed = []
    for i in edge:
        fixed += [6 * i + 2]
        if clamped: fixed += [6 * i + 3, 6 * i + 4]
    fixed += [0, 1, 6 * n + 1]                 # in-plane rigid body
    fixed += [6 * i + 5 for i in range(len(X))]  # drilling
    U = m.solve(F, np.array(fixed))
    c = idx(n // 2, n // 2); D = E * t ** 3 / (12 * (1 - nu ** 2))
    w = -U[6 * c + 2]
    return w * D / (a ** 2 if point else q * a ** 4)
for n in (8, 16, 32):
    print(n, 'SS uniform %.5f (0.00406)' % plate(n), ' clamped uniform %.5f (0.00126)' % plate(n, clamped=True),
          ' SS point %.5f (0.01160)' % plate(n, point=True), ' clamped point %.5f (0.00560)' % plate(n, clamped=True, point=True), ' flip SS %.5f' % plate(n, flip=True))
# membrane: strip in tension
X = np.array([[0, 0, 0], [10, 0, 0], [10, 1, 0], [0, 1, 0.0]]); T = np.array([[0, 1, 2], [0, 2, 3]])
m = Model(X); m.add_shells(T, np.ones(2), 1000.0, 0.0)
F = np.zeros(24); F[6 * 1] = 0.5; F[6 * 2] = 0.5
fixed = [0, 1, 2, 18, 19, 20] + [6 * i + k for i in range(4) for k in (2, 3, 4, 5)]
U = m.solve(F, np.array(fixed)); print('membrane strip u = %.4f (expect 1*10/(1000*1) = 0.01)' % U[6])
# cantilever beam with offset: tip load
X = np.array([[0, 0, 0], [50, 0, 0.0], [100, 0, 0]]); m = Model(X)
Bn = np.array([[0, 1], [1, 2]]); A = 2.0; Iz = 1 * 2 ** 3 / 12; Iy = 2 * 1 / 12; J = 0.4
m.add_beams(Bn, 1000.0, 0.3, np.full(2, A), np.full(2, Iy), np.full(2, Iz), np.full(2, J), up=np.tile([0, 0, 1.0], (2, 1)), off=np.zeros((2, 3)), h=np.full(2, 2.0), w=np.ones(2))
F = np.zeros(18); F[6 * 2 + 2] = -1.0
U = m.solve(F, np.arange(6)); print('cantilever tip w = %.4f (expect PL^3/3EI = %.4f)' % (-U[6 * 2 + 2], 100 ** 3 / (3 * 1000 * Iz)))
