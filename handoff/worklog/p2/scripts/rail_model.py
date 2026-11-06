# Side-button rail: force at the thumb to keep the button sliding at the click, with an off-centre press.
# Rigid button translating in x (inward); thumb force F at y = e; switch reaction S at y = 0 (55 gf).
# Each guided post touches its guide at two ends of its engagement (x1 outer, x2 inner) on opposite faces
# (tilt from clearance). Unknowns: F, and the normal forces. Solve statics with Coulomb friction (kinetic, mu).
import numpy as np
S = 55.0
def one_post(e, Lg, mu):
    # x: F - S - 2 mu N = 0 ; moment about origin: -e F + N Lg = 0 (friction moments of the two faces cancel)
    return S / (1 - 2 * mu * e / Lg)
def two_posts(e, Lp, mu, a, share=0.5):
    # posts at y = +a (near the press) and -a, each touching at both guide ends; share = fraction of the
    # tilt moment taken by the near post. Friction at a contact on the near post sits at y ~ +a (faces +-p/2:
    # their moments cancel per post only when both faces carry equal N, which they do: N at x1 and x2 equal).
    # moment: -e F + (N_near + N_far) Lp + mu*(2 N_near * a) + mu*(2 N_far * (-a)) = 0
    # x: F - S - 2 mu (N_near + N_far) = 0 ; N_near = share * Ntot, N_far = (1 - share) * Ntot
    # => Ntot = e F / (Lp + 2 mu a (2 share - 1))
    k = Lp + 2 * mu * a * (2 * share - 1)
    if 1 - 2 * mu * e / k <= 0: return float('inf')
    return S / (1 - 2 * mu * e / k)
e = 12.375 - 7.25   # the slide's tip spot, 5.125 mm off the centre
for mu in (0.2, 0.1, 0.05):
    print(f"mu {mu}: one post Lg 14: {one_post(e,14,mu):6.2f}  Lg 5: {one_post(e,5,mu):6.2f}  Lg 2: {one_post(e,2,mu) if 2*mu*e<2 else 'jams'}")
    print(f"        two posts Lp 5, a 5.6: equal share {two_posts(e,5,mu,5.6):6.2f}  near-only {two_posts(e,5,mu,5.6,1):6.2f}  far-only {two_posts(e,5,mu,5.6,0):6.2f}")
# the old tip spot (13.0 mm, e 5.75) for F44.1's quoted figures
e2 = 13.0 - 7.25
print('F44.1 check (e 5.75, mu 0.2):', [round(one_post(e2, L, 0.2) / S, 3) for L in (14, 5, 3)])
# spread across the three spots on a single 14 mm guide, mu 0.2
for s in (3.0, 7.25, 12.375):
    ee = abs(s - 7.25); print('spot', s, 'e', ee, round(one_post(ee, 14, 0.2), 2) if ee else S)
print('--- with Q3 (FILLS 10:09): dry POM/POM kinetic 0.35-0.40 (DuPont), plastics grease 0.02-0.04 (Molykote, steel on POM) ---')
import math
e = 5.125
for name, Lg in (('14 mm guide', 14), ('5 mm guide', 5), ('two posts, 5 mm guides (untied, equal share)', 5), ('b03_side as drawn (~1.95 mm)', 1.95)):
    for lab, mus in (('dry', (0.35, 0.40)), ('greased', (0.02, 0.04))):
        vals = [one_post(e, Lg, m) if 2*m*e < Lg else float('inf') for m in mus]
        print(f'{name:48s} {lab:8s} ' + ' to '.join('jams' if v == float('inf') else f'{v:7.2f} (ceil {math.ceil(v - 1e-9)})' for v in vals))
print('jam mu at e 5.125: Lg 14', 14/(2*e), ' Lg 5', 5/(2*e), ' Lg 1.95', 1.95/(2*e))
# the tie: it carries the tilt as axial forces f = F e / 2a at the posts; its pivots rub with lever r/R (wire radius over arm)
a, r, R = 5.6, 0.3, 3.0
for mu in (0.02, 0.04, 0.35):
    q = 2 * 2 * mu * (r / R) * e / (2 * a)   # 2 clips + 2 arm ends
    print(f'tie, joints mu {mu}: x{1/(1-q):.4f} -> {55/(1-q):.2f} gf')
print('--- spread across b03_side\'s three spots (front e 4.25, middle 0, tip 5.125): max - min, gf ---')
def tie(mu, e):
    q = 4 * mu * 0.1 * e / (2 * 5.6); return 55 / (1 - q)
for name, f in (('A 14 mm dry', lambda e, m: one_post(e, 14, m)), ('B two loose posts 5 mm dry', lambda e, m: one_post(e, 5, m)),
                ('C 5 mm greased', lambda e, m: one_post(e, 5, m)), ('D tied (joints greased..dry)', tie), ('E 14 mm greased', lambda e, m: one_post(e, 14, m))):
    mus = (0.02, 0.35) if name.startswith('D') else (0.02, 0.04) if 'greased' in name else (0.35, 0.40)
    vals = []
    for m in mus:
        fs = [f(4.25, m), 55.0, f(5.125, m)]
        vals.append(max(fs) - min(fs))
    print(f'{name:30s} spread {vals[0]:6.2f} to {vals[1]:6.2f} gf  (ceil {math.ceil(vals[0]-1e-9)} to {math.ceil(vals[1]-1e-9)});  7 % JND of 55 = 3.85 gf')
print('--- F48.1 tied posts on b03_side: per spot (front e 4.25, middle 0, tip 5.125), tie a 5.6, r/R 0.1, 4 joints ---')
for mu in (0.02, 0.04, 0.35):
    fr, tp = tie(mu, 4.25), tie(mu, 5.125)
    print(f'joints mu {mu}: front {fr:.2f} (ceil {math.ceil(fr-1e-9)})  middle 55.00  tip {tp:.2f} (ceil {math.ceil(tp-1e-9)})  spread {max(fr,tp)-55:.2f}')
