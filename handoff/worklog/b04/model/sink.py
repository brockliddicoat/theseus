"""b04 sag model, exploration: a rigid mouse on skates pressed into a soft pad.
Pad: Pasternak foundation (Winkler springs k plus a shear layer G that couples neighbours), k*w - G*lap(w) = p.
Skates are rigid punches fixed to the rigid mouse: w = a + b*x + c*z over each skate's footprint.
Load: P newtons at (xL, zL). Solve the three rigid-body modes, combine for equilibrium.
Outputs: body sink at the lens, the cloth's dip at the lens, the gap change (lens to cloth), max sink."""
import numpy as np, scipy.sparse as sp, scipy.sparse.linalg as sla, json, math, sys

H = 0.5                                   # grid, mm
X0, X1, Z0, Z1 = -50, 50, -75, 75
xs = np.arange(X0, X1 + 1e-9, H); zs = np.arange(Z0, Z1 + 1e-9, H)
NX, NZ = len(xs), len(zs)
XX, ZZ = np.meshgrid(xs, zs)              # [iz, ix]

def lap_matrix():
    n = NX * NZ
    idx = lambda iz, ix: iz * NX + ix
    rows, cols, vals = [], [], []
    for iz in range(NZ):
        for ix in range(NX):
            i = idx(iz, ix)
            rows.append(i); cols.append(i); vals.append(-4.0 / H / H)
            for dz, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                jz, jx = iz + dz, ix + dx
                if 0 <= jz < NZ and 0 <= jx < NX:
                    rows.append(i); cols.append(idx(jz, jx)); vals.append(1.0 / H / H)
    return sp.csr_matrix((vals, (rows, cols)), shape=(n, n))

LAP = None
def solve(mask, k, G, P, xL, zL):
    """mask: bool [NZ, NX] skate contact. returns dict"""
    global LAP
    if LAP is None: LAP = lap_matrix()
    n = NX * NZ
    A = (k * sp.identity(n) - G * LAP).tocsr()
    m = mask.ravel()
    free = ~m
    Aff = A[free][:, free]; Afc = A[free][:, m]
    lu = sla.splu(Aff.tocsc())
    xm, zm = XX.ravel()[m], ZZ.ravel()[m]
    basis = []
    for wc in (np.ones(m.sum()), xm, zm):
        w = np.zeros(n); w[m] = wc
        w[free] = lu.solve(-Afc @ wc)
        p = A @ w                           # pressure (N/mm^2) at contact nodes; ~0 elsewhere
        pc = p[m] * H * H                   # force per node
        basis.append((w, pc.sum(), (pc * xm).sum(), (pc * zm).sum()))
    M = np.array([[b[1] for b in basis], [b[2] for b in basis], [b[3] for b in basis]])
    rhs = np.array([P, P * xL, P * zL])
    c = np.linalg.solve(M, rhs)
    w = sum(ci * b[0] for ci, b in zip(c, basis))
    p = (A @ w)
    return dict(c=c, w=w.reshape(NZ, NX), p=p.reshape(NZ, NX), pmin=p[m].min(), body=lambda x, z: c[0] + c[1] * x + c[2] * z)

def at(F, x, z):
    ix = (x - X0) / H; iz = (z - Z0) / H
    i0, j0 = int(math.floor(ix)), int(math.floor(iz)); fx, fz = ix - i0, iz - j0
    return (F[j0, i0] * (1 - fx) + F[j0, i0 + 1] * fx) * (1 - fz) + (F[j0 + 1, i0] * (1 - fx) + F[j0 + 1, i0 + 1] * fx) * fz

def disk(cx, cz, r):
    return (XX - cx) ** 2 + (ZZ - cz) ** 2 <= r * r

def poly_mask(pts):
    from matplotlib.path import Path
    pth = Path(pts)
    return pth.contains_points(np.c_[XX.ravel(), ZZ.ravel()]).reshape(NZ, NX)

meta = json.load(open('/home/claude/theseus/3d/shell/shell-theseus-1seam.json'))
CORN = meta['skates']                                  # 8 corner dots (x, z), +z = nose
R = 3.25
def dots(pts):
    m = np.zeros((NZ, NX), bool)
    for x, z in pts: m |= disk(x, z, R)
    return m

def area(mask): return mask.sum() * H * H

if __name__ == '__main__':
    lensZ = float(sys.argv[1]) if len(sys.argv) > 1 else 16.57
    axis = lensZ + 1.1                                  # imaging axis 1.1 mm ahead of the module centre
    t_foam, nu = 4.0, 0.3
    for lam in (1.0, 1.5, 2.0, 3.0):
        # pick E so that 4 corner dots, 5 N at z -15, give mean sink 0.65 mm (Brock: the base scrapes on soft pads)
        def run(E, mask, P=5.0, zl=-15.0):
            k = E / t_foam; G = k * lam * lam
            return solve(mask, k, G, P, 0.0, zl)
        four = dots([CORN[i] for i in (1, 2, 4, 7)])
        lo, hi = 0.01, 5.0
        for _ in range(40):
            E = math.sqrt(lo * hi); r = run(E, four); s = r['c'][0]
            if s > 0.65: lo = E
            else: hi = E
        print('lambda %.1f mm  E %.3f MPa (k %.4f N/mm3)' % (lam, E, E / t_foam))
        sets = {
            'four corner dots': four,
            'eight corner dots': dots(CORN),
            'Theseus 8 + 2 lens dots': dots(CORN + [[0, lensZ + 6.3], [0, lensZ - 6.7]]),
        }
        for nm, mk in sets.items():
            r = run(E, mk); b = r['body'](0, axis); d = at(r['w'], 0, axis)
            print('  %-26s area %6.0f mm2  sink(lens body) %5.3f  cloth dip %5.3f  gap change %6.3f  pmin %.4f' % (nm, area(mk), b, d, b - d, r['pmin']))
