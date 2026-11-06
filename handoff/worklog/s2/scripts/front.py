"""F51: the front of the trigger cutout seen from the side, two ways (side view y(z) on the +X side, scene mm).
  A  'fair into the lip': from the arch at Z_A (matching height, slope, curvature) a quintic to the nose tip (Z_TIP, Y_TIP),
     flat there only by symmetry; the front cutout across the nose then rises RISE mm from the centre to its corners
  B  'the arch to the nose': one concave-down curve from J to the nose tip (slope steepening all the way), so the band
     narrows to the lip and nothing turns flat; the front cutout dips at the centre (seen from the front)
Both keep the rear (J, K3, the cutout) of seam_path_v5."""
import json, sys
import numpy as np
sys.path.insert(0, '/home/claude/work/s2/scripts')
import arch3 as A3
from arch import seam_today
Z_TIP, Y_TIP = 59.65, 10.0
V5 = json.load(open('/home/claude/work/s2/seam_path_v5.json'))

def arch_side():
    """v5's side view (z, y) of the arch: offset 6.9 -> 4.75 below the crown, without the blend onto today's seam"""
    oz, oy = A3.offset_curve()
    return lambda z: np.interp(z, oz, oy)

def hermite5(z0, z1, p0, p1):
    """quintic on [z0, z1] matching (y, y', y'') at both ends"""
    h = z1 - z0
    y0, d0, a0 = p0; y1, d1, a1 = p1
    M = np.array([[1, 0, 0, 0, 0, 0], [0, 1, 0, 0, 0, 0], [0, 0, 2, 0, 0, 0],
                  [1, h, h ** 2, h ** 3, h ** 4, h ** 5], [0, 1, 2 * h, 3 * h ** 2, 4 * h ** 3, 5 * h ** 4], [0, 0, 2, 6 * h, 12 * h ** 2, 20 * h ** 3]])
    c = np.linalg.solve(M, [y0, d0, a0, y1, d1, a1])
    return lambda z: np.polyval(c[::-1], np.asarray(z) - z0)

def deriv(f, z, h=0.05): return (f(z + h) - f(z - h)) / (2 * h), (f(z + h) - 2 * f(z) + f(z - h)) / h ** 2

def design_A(z_a=36.0, tip_curv=0.06):
    fa = arch_side(); d1, d2 = deriv(fa, z_a)
    g = hermite5(z_a, Z_TIP, (float(fa(z_a)), d1, d2), (Y_TIP, 0.0, tip_curv))
    return lambda z: np.where(np.asarray(z) < z_a, fa(z), g(z))

def design_B(zJ=V5['J'][1]):
    """concave-down from J to the tip: y'' linear in z (from the arch's own at J to steeper), fitted so it lands on the tip"""
    fa = arch_side(); y0 = float(fa(zJ)); s0, k0 = deriv(fa, zJ)
    L = Z_TIP - zJ
    # y = y0 + s0 t + k0 t^2/2 + c t^3 / 6 ; choose c so y(L) = Y_TIP
    c = (Y_TIP - y0 - s0 * L - k0 * L ** 2 / 2) * 6 / L ** 3
    return lambda z: np.where(np.asarray(z) < zJ, fa(z), y0 + s0 * (np.asarray(z) - zJ) + k0 * (np.asarray(z) - zJ) ** 2 / 2 + c * (np.asarray(z) - zJ) ** 3 / 6), dict(s0=s0, k0=k0, c=c)

if __name__ == '__main__':
    fa = arch_side(); A = design_A(); B, info = design_B()
    print('B: slope at J %.3f, curvature at J %.4f, its rate %.5f; at the tip slope %.3f' % (info['s0'], info['k0'], info['c'], deriv(B, Z_TIP - 0.1)[0]))
    for z in [12, 20, 30, 36, 40, 45, 48, 50, 52, 54, 55.5, 57, 58.5, 59.6]:
        print('z %5.1f  today %6.2f  arch %6.2f   A %6.2f (k %+.4f)   B %6.2f (k %+.4f)' % (z, seam_today(z), fa(z), A(z), deriv(A, z)[1], B(z), deriv(B, z)[1]))

def design_S(s_tip, zlo=30.0):
    """the arch, then from Z_A a run-out whose y'' changes linearly (G2 at Z_A) to the tip, landing on (Z_TIP, Y_TIP) with
    slope s_tip (the front cutout rising a = -s_tip * b from the centre to its corners, b the nose's plan curvature)"""
    fa = arch_side()
    best = None
    for za in np.arange(zlo, Z_TIP - 3, 0.01):
        ya = float(fa(za)); d1, d2 = deriv(fa, za); L = Z_TIP - za
        r = ya + 2 / 3 * d1 * L + s_tip * L / 3 + d2 * L * L / 6 - Y_TIP
        if best is None or abs(r) < abs(best[0]): best = (r, za, ya, d1, d2, L)
    _, za, ya, d1, d2, L = best
    q = 2 * (s_tip - d1) / L - d2
    def f(z):
        z = np.asarray(z, float); t = np.clip(z - za, 0, None)
        run = ya + d1 * t + d2 * t ** 2 / 2 + (q - d2) / L * t ** 3 / 6
        return np.where(z < za, fa(z), run)
    return f, dict(za=za, q=q, d1=d1, d2=d2)

B_NOSE = 4.15 / 20.0 ** 2           # the nose's plan: z = Z_TIP - b x^2 (today's front cutout: z 59.65 at x 0, 55.5 at x 20)
if __name__ == '__main__':
    print()
    for s in [0.0, -0.10, -0.15, -0.20, -0.30, -0.46]:
        f, I = design_S(s)
        print('s_tip %+.2f: run-out from z %.2f, tip curvature %+.4f (r %.0f mm); corner rise %.2f mm; y at 55.5 %.2f, 50 %.2f, 45 %.2f' % (
            s, I['za'], I['q'], 1 / max(abs(I['q']), 1e-9), -s * B_NOSE * 400, f(55.5), f(50.0), f(45.0)))

def design_Q(z_a, q_tip, s_tip=0.0):
    """the arch to Z_A, then a quintic matching (y, y', y'') there and (Y_TIP, s_tip, q_tip) at the tip"""
    fa = arch_side(); d1, d2 = deriv(fa, z_a)
    g = hermite5(z_a, Z_TIP, (float(fa(z_a)), d1, d2), (Y_TIP, s_tip, q_tip))
    return lambda z: np.where(np.asarray(z) < z_a, fa(z), g(z))

def fairness(f, z_a):
    zz = np.linspace(z_a - 3, Z_TIP, 1500); yy = f(zz)
    d1 = np.gradient(yy, zz); d2 = np.gradient(d1, zz); k = d2 / (1 + d1 ** 2) ** 1.5
    dk = np.gradient(k, zz)
    sign_changes = int(np.sum(np.diff(np.sign(np.round(k, 5))) != 0))
    return float(np.abs(k).max()), float(np.sqrt((dk ** 2).mean())), sign_changes, k

def search(rise_max=0.45, z_corner=55.5):
    best = None
    for z_a in np.arange(30.0, 50.01, 0.25):
        for q in np.arange(0.0, 0.12, 0.002):
            f = design_Q(z_a, q)
            rise = float(f(z_corner) - Y_TIP)
            if rise > rise_max or rise < 0: continue
            kmax, dkr, sc, k = fairness(f, z_a)
            # one inflection only: the curvature goes from the arch's (negative) to positive once
            zz = np.linspace(z_a, Z_TIP, 600); kk = np.interp(zz, np.linspace(z_a - 3, Z_TIP, 1500), k)
            mono = np.all(np.diff(kk) >= -1e-4)
            if not mono: continue
            score = kmax + 3 * dkr
            if best is None or score < best[0]: best = (score, z_a, q, rise, kmax, dkr)
    return best

if __name__ == '__main__':
    for rm in [0.3, 0.45, 0.6]:
        b = search(rm)
        print('corner rise <= %.2f: best z_a %.2f, tip curvature %.4f, rise %.2f, max curvature %.4f (r %.1f mm)' % (rm, b[1], b[2], b[3], b[4], 1 / b[4]) if b else 'none')

def design_F(z_L=56.5, y_L=Y_TIP):
    """the arch, then a swoop whose y'' is the arch's own fading out plus one smooth positive bump (30 w^2 (1-w)^2), so the
    curvature rises once and falls once (no belly, no knee), landing G2 on the flat lip (y_L, slope 0, y'' 0) at z_L.
    Solved for the start z_a and the bump's size A (two conditions: the end slope 0 and the end height y_L)."""
    fa = arch_side()
    def run(z_a):
        L = z_L - z_a; ya = float(fa(z_a)); s_a, k_a = deriv(fa, z_a)
        zz = np.linspace(z_a, z_L, 1200); w = (zz - z_a) / L
        fade = 1 - (w ** 3 * (10 - 15 * w + 6 * w * w))
        bump = 30 * w ** 2 * (1 - w) ** 2 / L
        base = k_a * fade
        def integ(y2):
            y1 = s_a + np.r_[0, np.cumsum((y2[1:] + y2[:-1]) / 2 * np.diff(zz))]
            y = ya + np.r_[0, np.cumsum((y1[1:] + y1[:-1]) / 2 * np.diff(zz))]
            return y1, y
        y1b, yb = integ(base); y1u, yu = integ(bump)
        yu = yu - ya - s_a * (zz - z_a); y1u = y1u - s_a     # the bump's own contributions (linear in A)
        A = -y1b[-1] / y1u[-1]                          # the end slope 0
        y = yb + A * yu; y2 = base + A * bump; y1 = y1b + A * y1u
        return zz, y, y1, y2, A
    lo, hi = 30.0, z_L - 2.0
    for _ in range(60):                                 # bisection on z_a for the end height
        mid = (lo + hi) / 2; zz, y, y1, y2, A = run(mid)
        if y[-1] > y_L: lo = mid
        else: hi = mid
    zz, y, y1, y2, A = run((lo + hi) / 2)
    k = y2 / (1 + y1 ** 2) ** 1.5
    za = (lo + hi) / 2
    f = lambda z: np.where(np.asarray(z) < za, fa(z), np.where(np.asarray(z) > z_L, y_L, np.interp(z, zz, y)))
    return f, dict(z_a=za, z_L=z_L, A=A, kmax=float(k.max()), kmin=float(k.min()), end=(float(y[-1]), float(y1[-1])))

if __name__ == '__main__':
    print()
    for zL in [55.5, 56.0, 56.5, 57.0, 57.5]:
        f, I = design_F(zL)
        print('lip flat from z %.1f: swoop from z %.2f (%.1f mm), r min %.1f mm, curvature min %+.4f; end %s; lip corner (z 55.5) %.2f' % (
            zL, I['z_a'], zL - I['z_a'], 1 / I['kmax'], I['kmin'], np.round(I['end'], 4), f(55.5)))

def design_C():
    """the arch, then S2's optimised run-out into the flat lip (front_opt.solve_capped: y'' piecewise linear, G2 with the arch,
    landing level on the lip at the tip, the lip's corners at most 0.3 mm up, no more concave-down bend than y'' -0.020)"""
    D = json.load(open('/home/claude/work/s2/front_C.json')); fa = arch_side()
    zz, yy, za = np.array(D['zz']), np.array(D['y']), D['z_a']
    return (lambda z: np.where(np.asarray(z) < za, fa(z), np.interp(z, zz, yy))), D
