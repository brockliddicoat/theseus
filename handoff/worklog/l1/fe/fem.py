"""Small stiffened-shell finite-element library (mm, N, MPa).

  shell: flat 3-node facet = CST membrane + DKT plate bending (Batoz, Bathe & Ho 1980) + small drilling stiffness
  beam : 3D Euler-Bernoulli frame element with a rigid offset (eccentric rib on the shell mid-surface)
Assembly is vectorised; solve with scipy's sparse direct solver.
"""
import numpy as np
import scipy.sparse as sp
import scipy.sparse.linalg as spla

def frames(P1, P2, P3):
    e1 = P2 - P1; e1 /= np.linalg.norm(e1, axis=1, keepdims=True)
    n = np.cross(P2 - P1, P3 - P1); A2 = np.linalg.norm(n, axis=1); e3 = n / A2[:, None]
    e2 = np.cross(e3, e1)
    R = np.stack([e1, e2, e3], 1)                    # rows = local axes (global -> local)
    loc = lambda Q: np.stack([((Q - P1) * e1).sum(1), ((Q - P1) * e2).sum(1)], 1)
    return R, loc(P1), loc(P2), loc(P3), A2 / 2

def _dkt_H(x, y, xi, eta):
    """derivatives of the DKT Hx, Hy shape vectors at (xi, eta); x, y: (n, 3) local node coords"""
    x1, x2, x3 = x[:, 0], x[:, 1], x[:, 2]; y1, y2, y3 = y[:, 0], y[:, 1], y[:, 2]
    def coef(xij, yij):
        l2 = xij * xij + yij * yij
        return -6 * xij / l2, 3 * xij * yij / l2, 3 * yij * yij / l2, -6 * yij / l2
    P4, q4, r4, t4 = coef(x2 - x3, y2 - y3)
    P5, q5, r5, t5 = coef(x3 - x1, y3 - y1)
    P6, q6, r6, t6 = coef(x1 - x2, y1 - y2)
    a, b = xi, eta
    Hxk = np.stack([P6 * (1 - 2 * a) + (P5 - P6) * b, q6 * (1 - 2 * a) - (q5 + q6) * b, -4 + 6 * (a + b) + r6 * (1 - 2 * a) - b * (r5 + r6),
                    -P6 * (1 - 2 * a) + b * (P4 + P6), q6 * (1 - 2 * a) - b * (q6 - q4), -2 + 6 * a + r6 * (1 - 2 * a) + b * (r4 - r6),
                    -b * (P5 + P4), b * (q4 - q5), -b * (r5 - r4)], 1)
    Hyk = np.stack([t6 * (1 - 2 * a) + b * (t5 - t6), 1 + r6 * (1 - 2 * a) - b * (r5 + r6), -q6 * (1 - 2 * a) + b * (q5 + q6),
                    -t6 * (1 - 2 * a) + b * (t4 + t6), -1 + r6 * (1 - 2 * a) + b * (r4 - r6), -q6 * (1 - 2 * a) - b * (q4 - q6),
                    -b * (t5 + t4), b * (r4 - r5), -b * (q4 - q5)], 1)
    Hxe = np.stack([-P5 * (1 - 2 * b) - a * (P6 - P5), q5 * (1 - 2 * b) - a * (q5 + q6), -4 + 6 * (a + b) + r5 * (1 - 2 * b) - a * (r5 + r6),
                    a * (P4 + P6), a * (q4 - q6), -a * (r6 - r4),
                    P5 * (1 - 2 * b) - a * (P4 + P5), q5 * (1 - 2 * b) + a * (q4 - q5), -2 + 6 * b + r5 * (1 - 2 * b) + a * (r4 - r5)], 1)
    Hye = np.stack([-t5 * (1 - 2 * b) - a * (t6 - t5), 1 + r5 * (1 - 2 * b) - a * (r5 + r6), -q5 * (1 - 2 * b) + a * (q5 + q6),
                    a * (t4 + t6), a * (r4 - r6), -a * (q4 - q6),
                    t5 * (1 - 2 * b) - a * (t4 + t5), -1 + r5 * (1 - 2 * b) + a * (r4 - r5), -q5 * (1 - 2 * b) - a * (q4 - q5)], 1)
    return Hxk, Hyk, Hxe, Hye

def dkt_B(x, y, xi, eta):
    x31 = x[:, 2] - x[:, 0]; y31 = y[:, 2] - y[:, 0]; x12 = x[:, 0] - x[:, 1]; y12 = y[:, 0] - y[:, 1]
    A2 = x31 * y12 - x12 * y31
    Hxk, Hyk, Hxe, Hye = _dkt_H(x, y, xi, eta)
    B = np.stack([y31[:, None] * Hxk + y12[:, None] * Hxe,
                  -x31[:, None] * Hyk - x12[:, None] * Hye,
                  -x31[:, None] * Hxk - x12[:, None] * Hxe + y31[:, None] * Hyk + y12[:, None] * Hye], 1) / A2[:, None, None]
    return B, A2

def cst_B(x, y):
    x1, x2, x3 = x[:, 0], x[:, 1], x[:, 2]; y1, y2, y3 = y[:, 0], y[:, 1], y[:, 2]
    A2 = (x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1)
    z = np.zeros_like(x1)
    B = np.stack([np.stack([y2 - y3, z, y3 - y1, z, y1 - y2, z], 1),
                  np.stack([z, x3 - x2, z, x1 - x3, z, x2 - x1], 1),
                  np.stack([x3 - x2, y2 - y3, x1 - x3, y3 - y1, x2 - x1, y1 - y2], 1)], 1) / A2[:, None, None]
    return B, A2

def Dmat(E, nu):
    return E / (1 - nu * nu) * np.array([[1, nu, 0], [nu, 1, 0], [0, 0, (1 - nu) / 2]])


# ---------------- Allman (1984) membrane triangle with drilling rotations (L1, 2026-11-06) ----------------
# the 6-node quadratic triangle (LST) whose mid-side displacements are tied to the corner rotations:
#   u_m = (u_i + u_j)/2 + (y_j - y_i)(w_j - w_i)/8,   v_m = (v_i + v_j)/2 + (x_i - x_j)(w_j - w_i)/8
# K = T' K_LST T, K_LST by 3-point (mid-side) quadrature (exact); the spurious equal-rotation mode is held by a penalty
# gamma * E t A (w_mean - w_cst)^2 (w_cst: the rotation of the vertex displacement field).
def lst_B(x, y, L1, L2, L3):
    """B (n, 3, 12) of the LST at area coordinates (L1, L2, L3); dof order u1 v1 u2 v2 u3 v3 u4 v4 u5 v5 u6 v6 (4: mid 1-2, 5: 2-3, 6: 3-1)"""
    x1, x2, x3 = x[:, 0], x[:, 1], x[:, 2]; y1, y2, y3 = y[:, 0], y[:, 1], y[:, 2]
    A2 = (x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1)
    b = np.stack([y2 - y3, y3 - y1, y1 - y2], 1) / A2[:, None]   # dLi/dx
    c = np.stack([x3 - x2, x1 - x3, x2 - x1], 1) / A2[:, None]   # dLi/dy
    L = [L1, L2, L3]
    # shape functions: corners N_i = L_i (2 L_i - 1), mids N4 = 4 L1 L2, N5 = 4 L2 L3, N6 = 4 L3 L1
    dNx = [(4 * L[i] - 1) * b[:, i] for i in range(3)] + [4 * (L[0] * b[:, 1] + L[1] * b[:, 0]), 4 * (L[1] * b[:, 2] + L[2] * b[:, 1]), 4 * (L[2] * b[:, 0] + L[0] * b[:, 2])]
    dNy = [(4 * L[i] - 1) * c[:, i] for i in range(3)] + [4 * (L[0] * c[:, 1] + L[1] * c[:, 0]), 4 * (L[1] * c[:, 2] + L[2] * c[:, 1]), 4 * (L[2] * c[:, 0] + L[0] * c[:, 2])]
    n = len(x); B = np.zeros((n, 3, 12))
    for k in range(6):
        B[:, 0, 2 * k] = dNx[k]; B[:, 1, 2 * k + 1] = dNy[k]; B[:, 2, 2 * k] = dNy[k]; B[:, 2, 2 * k + 1] = dNx[k]
    return B, A2

def allman_T(x, y):
    """T (n, 12, 9): Allman dofs [u1 v1 w1 u2 v2 w2 u3 v3 w3] -> LST dofs"""
    n = len(x); T = np.zeros((n, 12, 9))
    for k in range(3):
        T[:, 2 * k, 3 * k] = 1; T[:, 2 * k + 1, 3 * k + 1] = 1
    for m_, (i, j) in enumerate(((0, 1), (1, 2), (2, 0))):
        r = 6 + 2 * m_
        T[:, r, 3 * i] = 0.5; T[:, r, 3 * j] = 0.5
        T[:, r + 1, 3 * i + 1] = 0.5; T[:, r + 1, 3 * j + 1] = 0.5
        dy = y[:, j] - y[:, i]; dx = x[:, i] - x[:, j]
        T[:, r, 3 * j + 2] += dy / 8; T[:, r, 3 * i + 2] -= dy / 8
        T[:, r + 1, 3 * j + 2] += dx / 8; T[:, r + 1, 3 * i + 2] -= dx / 8
    return T

def allman_K(x, y, t, E, nu, gamma=0.01):
    D = Dmat(E, nu); T = allman_T(x, y); n = len(x)
    K = np.zeros((n, 12, 12))
    for (l1, l2, l3) in ((0.5, 0.5, 0.0), (0.0, 0.5, 0.5), (0.5, 0.0, 0.5)):
        B, A2 = lst_B(x, y, l1, l2, l3)
        K += np.einsum('nji,jk,nkl->nil', B, D, B) * (np.abs(A2) / 2 / 3 * t)[:, None, None]
    Ka = np.einsum('nji,njk,nkl->nil', T, K, T)
    # penalty: mean drilling rotation against the vertex field's rotation (CST: w = (dv/dx - du/dy)/2)
    Bc, A2 = cst_B(x, y)                      # rows: exx, eyy, gxy; d/dx in row 0 (u), d/dy in row 1 (v)
    p = np.zeros((n, 9))
    # dv/dx: coefficients of v_i are B[0, 2i] (dN_i/dx); du/dy: coefficients of u_i are B[1, 2i+1] (dN_i/dy)
    for k in range(3):
        p[:, 3 * k] = -0.5 * Bc[:, 1, 2 * k + 1]
        p[:, 3 * k + 1] = 0.5 * Bc[:, 0, 2 * k]
        p[:, 3 * k + 2] = -1.0 / 3
    Ka += gamma * (E * t * np.abs(A2) / 2)[:, None, None] * np.einsum('ni,nj->nij', p, p)
    return Ka, T

GP = [(1 / 6, 1 / 6, 1 / 6), (2 / 3, 1 / 6, 1 / 6), (1 / 6, 2 / 3, 1 / 6)]

def shell_local(xy, t, E, nu, membrane='cst'):
    """18x18 local stiffness per element. local DOF per node: u v w tx ty tz"""
    x = xy[..., 0]; y = xy[..., 1]; n = len(x)
    D = Dmat(E, nu)
    Bm, A2 = cst_B(x, y); A = A2 / 2
    Km = np.einsum('nij,jk,nkl->nil', Bm.transpose(0, 2, 1), D, Bm) * (t * A)[:, None, None]
    if membrane == 'allman':
        Ka, _ = allman_K(x, y, t, E, nu)
    Kb = np.zeros((n, 9, 9))
    for (a, b, w) in GP:
        Bb, A2b = dkt_B(x, y, a, b)
        Kb += np.einsum('nij,jk,nkl->nil', Bb.transpose(0, 2, 1), D, Bb) * (w * np.abs(A2b))[:, None, None]
    Kb *= (t ** 3 / 12)[:, None, None]
    K = np.zeros((n, 18, 18))
    mi = np.array([0, 1, 6, 7, 12, 13]); bi = np.array([2, 3, 4, 8, 9, 10, 14, 15, 16]); di = np.array([5, 11, 17])
    K[:, bi[:, None], bi[None, :]] = Kb
    if membrane == 'allman':
        ai = np.array([0, 1, 5, 6, 7, 11, 12, 13, 17])
        K[:, ai[:, None], ai[None, :]] += Ka
        return K
    K[:, mi[:, None], mi[None, :]] = Km
    kd = 1e-4 * E * t * A
    for i in di: K[:, i, i] += kd
    return K

def beam_local(L, E, G, A, Iy, Iz, J):
    n = len(L); K = np.zeros((n, 12, 12))
    def put(i, j, v): K[:, i, j] += v
    ea = E * A / L; gj = G * J / L
    for (i, j, s) in ((0, 0, 1), (6, 6, 1), (0, 6, -1), (6, 0, -1)): put(i, j, s * ea)
    for (i, j, s) in ((3, 3, 1), (9, 9, 1), (3, 9, -1), (9, 3, -1)): put(i, j, s * gj)
    # bending in the local x-y plane (v, rz) with Iz
    k = E * Iz
    m = {(1, 1): 12 / L ** 3, (1, 5): 6 / L ** 2, (1, 7): -12 / L ** 3, (1, 11): 6 / L ** 2,
         (5, 5): 4 / L, (5, 7): -6 / L ** 2, (5, 11): 2 / L, (7, 7): 12 / L ** 3, (7, 11): -6 / L ** 2, (11, 11): 4 / L}
    for (i, j), v in m.items(): put(i, j, k * v); put(j, i, k * v) if i != j else None
    # bending in the local x-z plane (w, ry) with Iy
    k = E * Iy
    m = {(2, 2): 12 / L ** 3, (2, 4): -6 / L ** 2, (2, 8): -12 / L ** 3, (2, 10): -6 / L ** 2,
         (4, 4): 4 / L, (4, 8): 6 / L ** 2, (4, 10): 2 / L, (8, 8): 12 / L ** 3, (8, 10): 6 / L ** 2, (10, 10): 4 / L}
    for (i, j), v in m.items(): put(i, j, k * v); put(j, i, k * v) if i != j else None
    return K

def skew(e):
    z = np.zeros(len(e))
    return np.stack([np.stack([z, -e[:, 2], e[:, 1]], 1), np.stack([e[:, 2], z, -e[:, 0]], 1), np.stack([-e[:, 1], e[:, 0], z], 1)], 1)

class Model:
    def __init__(self, X):
        self.X = np.asarray(X, float); self.N = len(X); self.rows = []; self.cols = []; self.vals = []
        self.shell_groups = []; self.beams = []
    def _add(self, dofs, K):
        r = np.repeat(dofs[:, :, None], dofs.shape[1], 2); c = np.repeat(dofs[:, None, :], dofs.shape[1], 1)
        self.rows.append(r.ravel()); self.cols.append(c.ravel()); self.vals.append(K.ravel())
    def add_shells(self, T, t, E, nu, membrane='cst'):
        P1, P2, P3 = self.X[T[:, 0]], self.X[T[:, 1]], self.X[T[:, 2]]
        R, l1, l2, l3, A = frames(P1, P2, P3)
        xy = np.stack([l1, l2, l3], 1)
        Kl = shell_local(xy, np.asarray(t, float), E, nu, membrane)
        Tm = np.zeros((len(T), 18, 18))
        for k in range(6): Tm[:, 3 * k:3 * k + 3, 3 * k:3 * k + 3] = R
        Kg = np.einsum('nji,njk,nkl->nil', Tm, Kl, Tm)
        dofs = (6 * T[:, :, None] + np.arange(6)[None, None, :]).reshape(len(T), 18)
        self._add(dofs, Kg)
        self.shell_groups.append(dict(T=T, t=np.asarray(t, float), R=R, xy=xy, A=A, E=E, nu=nu, dofs=dofs, Tm=Tm, membrane=membrane))
    def add_beams(self, Bn, E, nu, A, Iy, Iz, J, up, off, tag=None, h=None, w=None):
        """Bn (m,2) node pairs; up (m,3): local y' direction (rib height); off (m,3): centroid offset vector from the nodes"""
        P1, P2 = self.X[Bn[:, 0]] + off, self.X[Bn[:, 1]] + off
        ex = P2 - P1; L = np.linalg.norm(ex, axis=1); ex /= L[:, None]
        ey = up - (up * ex).sum(1)[:, None] * ex; ey /= np.linalg.norm(ey, axis=1, keepdims=True); ez = np.cross(ex, ey)
        R = np.stack([ex, ey, ez], 1)
        G = E / (2 * (1 + nu))
        Kl = beam_local(L, E, G, A, Iy, Iz, J)
        T = np.zeros((len(Bn), 12, 12))
        for k in range(4): T[:, 3 * k:3 * k + 3, 3 * k:3 * k + 3] = R
        O = np.tile(np.eye(12), (len(Bn), 1, 1))
        S = -skew(off)
        O[:, 0:3, 3:6] = S; O[:, 6:9, 9:12] = S
        TT = np.einsum('nij,njk->nik', T, O)
        Kg = np.einsum('nji,njk,nkl->nil', TT, Kl, TT)
        dofs = (6 * Bn[:, :, None] + np.arange(6)[None, None, :]).reshape(len(Bn), 12)
        self._add(dofs, Kg)
        self.beams.append(dict(Bn=Bn, A=A, Iy=Iy, Iz=Iz, J=J, L=L, TT=TT, Kl=Kl, dofs=dofs, tag=tag, h=h, w=w, P1=P1, P2=P2, E=E))
    def add_springs(self, dof_a, dof_b, k):
        r = np.r_[dof_a, dof_b, dof_a, dof_b]; c = np.r_[dof_a, dof_b, dof_b, dof_a]; v = np.r_[k, k, -k, -k]
        self.rows.append(r); self.cols.append(c); self.vals.append(np.asarray(v, float))
    def solve(self, F, fixed):
        n = 6 * self.N
        K = sp.csr_matrix((np.concatenate(self.vals), (np.concatenate(self.rows), np.concatenate(self.cols))), shape=(n, n))
        diag = np.abs(K.diagonal())
        free = np.ones(n, bool); free[fixed] = False
        free &= diag > 1e-12 * diag.max()           # dofs with no stiffness at all (unused nodes)
        Kf = K[free][:, free]
        U = np.zeros(n); U[free] = spla.spsolve(Kf.tocsc(), F[free])
        return U
    def shell_stress(self, U, g=0):
        s = self.shell_groups[g]; ue = U[s['dofs']]                       # (m,18) global
        ul = np.einsum('nij,nj->ni', s['Tm'], ue)
        x = s['xy'][..., 0]; y = s['xy'][..., 1]
        D = Dmat(s['E'], s['nu'])
        Bm, _ = cst_B(x, y); um = ul[:, [0, 1, 6, 7, 12, 13]]
        sm = np.einsum('ij,njk,nk->ni', D, Bm, um)
        Bb, _ = dkt_B(x, y, 1 / 3, 1 / 3); ub = ul[:, [2, 3, 4, 8, 9, 10, 14, 15, 16]]
        kap = np.einsum('nij,nj->ni', Bb, ub)
        M = np.einsum('ij,nj->ni', D, kap) * (s['t'] ** 3 / 12)[:, None]
        out = []
        for sg in (1, -1):
            st = sm + sg * 6 * M / (s['t'] ** 2)[:, None]
            vm = np.sqrt(st[:, 0] ** 2 - st[:, 0] * st[:, 1] + st[:, 1] ** 2 + 3 * st[:, 2] ** 2); out.append(vm)
        return np.maximum(out[0], out[1]), sm, M
    def beam_forces(self, U, b):
        ue = U[b['dofs']]; ul = np.einsum('nij,nj->ni', b['TT'], ue)
        f = np.einsum('nij,nj->ni', b['Kl'], ul)
        N = 0.5 * (-f[:, 0] + f[:, 6])                                       # + tension
        sig = []
        for end, sgn in ((0, -1), (6, 1)):
            Nn = sgn * f[:, end]; My = sgn * f[:, end + 4]; Mz = sgn * f[:, end + 5]
            s_ = np.abs(Nn / b['A']) + np.abs(Mz) * (b['h'] / 2) / b['Iz'] + np.abs(My) * (b['w'] / 2) / b['Iy']
            sig.append(s_)
        return N, np.maximum(sig[0], sig[1])
