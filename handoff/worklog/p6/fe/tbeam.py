"""P6: the cube law for a ribbed section, a flat check before the 3D runs.
A smeared kagome plate: three rib families at 60 deg, each spaced a (mm) apart, on a skin t; ribs of root width w, depth hr,
draft 0.5 deg per side (mean width wm = w - hr*tan(draft), as L1's model). Bending stiffness per unit width about the plate's
neutral axis (the ribs eccentric): D = E * I / unit width. For three families at 0/60/120 the smeared rib stiffness is
isotropic: each family adds (A_r/a) to the membrane per direction weighted by cos^4: sum cos^4 = 1 + 2/16 = 9/8.
Mould tolerance: every moulded dimension off by the same o (worst case, against Theseus), o in [-0.076, +0.076]."""
import numpy as np
def D_ribbed(t, w, hr, a, draft=0.5):
    wm = w - hr * np.tan(np.radians(draft))
    k = 9 / 8                          # three families, cos^4 sum
    Ar = wm * hr / a * k               # rib area per unit width (smeared, in one bending direction)
    Ir = wm * hr ** 3 / 12 / a * k
    # skin: area t per unit width, centroid at t/2; ribs: centroid at t + hr/2 (measured from the outer face)
    A = t + Ar; ybar = (t * t / 2 + Ar * (t + hr / 2)) / A
    I = t ** 3 / 12 + t * (t / 2 - ybar) ** 2 + Ir + Ar * (t + hr / 2 - ybar) ** 2
    return I
def D_plain(t): return t ** 3 / 12
tol = 0.076
offs = np.array([-1, 1]) * tol
def swing(f):
    lo, hi = f(-tol), f(tol); return lo - 1, hi - 1, hi - lo
for a in (10.7, 12.6):
    t, w, hr = 0.60, 0.36, 1.80
    D0 = D_ribbed(t, w, hr, a)
    full = swing(lambda o: D_ribbed(t + o, w + o, hr + o, a) / D0)
    skin = swing(lambda o: D_ribbed(t + o, w, hr, a) / D0)
    rib = swing(lambda o: D_ribbed(t, w + o, hr + o, a) / D0)
    wid = swing(lambda o: D_ribbed(t, w + o, hr, a) / D0)
    dep = swing(lambda o: D_ribbed(t, w, hr + o, a) / D0)
    eq = t + (w - hr*np.tan(np.radians(0.5))) * hr / a * 3   # equivalent thickness by weight (three families, no node overlap)
    print(f"a={a}: D_rib/D_skin={D0/D_plain(t):.2f}, same-weight plain t_eq={eq:.3f} mm, D_rib/D_plain(t_eq)={D0/D_plain(eq):.2f}")
    for nm, s in [('all dims', full), ('skin only', skin), ('ribs (w+hr)', rib), ('rib width', wid), ('rib depth', dep)]:
        print(f"   {nm:12s} {100*s[0]:+6.1f} % to {100*s[1]:+6.1f} %, span {100*s[2]:5.1f} %")
for tp in (0.55, 0.60, 0.70, 0.744, 1.00):
    s = swing(lambda o: D_plain(tp + o) / D_plain(tp)); print(f"plain {tp:.3f}: {100*s[0]:+.1f} to {100*s[1]:+.1f}, span {100*s[2]:.1f}")
