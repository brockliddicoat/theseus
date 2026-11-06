"""Scordelis-Lo roof (MacNeal-Harder obstacle course): R 25, L 50, 80 deg arc (40 each side), t 0.25, E 4.32e8, nu 0,
gravity 90 per unit area; ends on rigid diaphragms (u_x = u_y = 0 in the end plane: here x, y transverse), sides free.
Reference vertical displacement at the midpoint of the free edge: 0.3024 (0.3086 in some sources). Quarter model."""
import numpy as np, sys
import fem
R, Lh, t, E, nu, q = 25.0, 25.0, 0.25, 4.32e8, 0.0, 90.0
def run(n, membrane='cst'):
    th = np.linspace(0, np.radians(40), n + 1); zs = np.linspace(0, Lh, n + 1)     # z along the roof (0 = mid, Lh = diaphragm)
    X = np.array([[R * np.sin(a), R * np.cos(a), z] for z in zs for a in th]); idx = lambda i, j: j * (n + 1) + i
    T = []
    for j in range(n):
        for i in range(n): T += [[idx(i, j), idx(i + 1, j), idx(i + 1, j + 1)], [idx(i, j), idx(i + 1, j + 1), idx(i, j + 1)]]
    T = np.array(T)
    m = fem.Model(X)
    if membrane == 'cst': m.add_shells(T, np.full(len(T), t), E, nu)
    else: m.add_shells(T, np.full(len(T), t), E, nu, membrane=membrane)
    F = np.zeros(6 * len(X)); P1, P2, P3 = X[T[:, 0]], X[T[:, 1]], X[T[:, 2]]
    ar = 0.5 * np.linalg.norm(np.cross(P2 - P1, P3 - P1), axis=1); A = np.zeros(len(X))
    for k in range(3): np.add.at(A, T[:, k], ar / 3)
    F[6 * np.arange(len(X)) + 1] = -q * A
    fixed = []
    for i in range(n + 1):
        d_ = idx(i, n); fixed += [6 * d_ + 0, 6 * d_ + 1, 6 * d_ + 5 * 0 + 2 * 0]      # diaphragm: ux = uy = 0
        s_ = idx(i, 0); fixed += [6 * s_ + 2, 6 * s_ + 3, 6 * s_ + 4]                   # symmetry z = 0: uz = 0, rx = ry = 0
    for j in range(n + 1):
        c_ = idx(0, j); fixed += [6 * c_ + 0, 6 * c_ + 4, 6 * c_ + 5]                   # symmetry x = 0: ux = 0, ry = rz = 0
    fixed = sorted(set([f for f in fixed]))
    pass
    U = m.solve(F, np.array(sorted(set(fixed))))
    return -U[6 * idx(n, 0) + 1]
mem = sys.argv[1] if len(sys.argv) > 1 else 'cst'
for n in [4, 8, 16, 32]:
    print(mem, 'n', n, 'free-edge mid vertical displacement %.4f  (ref 0.3024)  ratio %.3f' % (run(n, mem), run(n, mem) / 0.3024))
