"""Q3, Q4, Q6: the Newtonian numbers for Theseus, from sourced inputs. Every input names its source; every output is derived.
Writes research/gd/redo/out/newton.json and prints the tables that feel-and-forces.md quotes.
Run: python3 research/gd/redo/scripts/newton.py
"""
import json, os, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, '..'))
sys.path.insert(0, os.path.join(ROOT, 'model'))
import hand as H
G = 9.80665; DEG = 180 / np.pi
# ---------------------------------------------------------------- inputs
M = 27.95e-3                      # kg, Theseus with the board's coat (deck/src/05-data.js THESEUS.mass)
W = M * G                         # N
MU = {'dry skin, lowest (Derler & Gerhardt 2012, abstract)': 0.2,
      'textured coat, along its ridges (Zhang 2017, 0.2-1 N, as the main film uses it)': 0.41,
      'typical dry skin / matte plastic (Derler 2012 "around 0.5"; Dzidek 2014 rough PP 0.53)': 0.5,
      'smooth plastic once the skin has sweated against it (Dzidek 2014 smooth PP, steady state, 0.4 N)': 1.08 * 0.4 ** (0.80 - 1)}
P_SIDE, P_SIDE_SIM = 0.43, 0.92   # N, squeeze on the sides: regular office work, and "simulated" (Johnson et al. 2000, p. 402)
N_BTN, N_BTN_PEAK = 0.35, 1.41    # N, on the button: mean and mean peak, regular office work (Johnson et al. 2000, Table 2)
K_MCP = float(np.mean([0.0377, 0.0328, 0.0466, 0.0393])); K_MCP_SUBJ = (0.0328, 0.0466); K_MCP_LIT = (0.016, 0.210)   # N m/rad (Shi 2020; Table 4)
PULP_SHEAR = {'along the finger': 1.0, 'across the finger': 0.5}     # N/mm (Nakazawa 2000 as cited by Delhaye 2014)
ALPHA = {'G&M 1982 mean, 75 %': 4 * 0.009, 'G&M at 84 % (Pont 1999, p. 890)': np.radians(2.8), 'the study: G&M mean + 2 SD, 75 %': 4 * 0.015,
         'G&M mean + 2 SD moved to 84 %': 4 * 0.015 / 0.6745, 'Pont 1999 dynamic, best subject, 84 %': np.radians(3.3), 'Pont 1999 dynamic, worst subject, 84 %': np.radians(5.3)}
SLIDE = {'p5': 7.19, 'p50': 16.69, 'p95': 29.50}          # mm, the thumb's slide as you grip (hand model, G5; RA's side)
PATCH = {'side, 0.43 N': 9.07, 'button, 0.35 N': 8.62}    # mm, contact diameter (Serhat 2022 fit, as the study uses it)
ACC = {'aiming flick, 5 cm in 100 ms (minimum-jerk peak 5.77 d/T^2)': 5.77 * 0.05 / 0.1 ** 2,
       'fast flick, 10 cm in 100 ms': 5.77 * 0.10 / 0.1 ** 2,
       'all-out swipe: 4.5 m/s (TechPowerUp reviewer, MM711) reached over 12.5 cm at constant acceleration': 4.5 ** 2 / (2 * 0.125)}
out = {'inputs': {'mass_kg': M, 'weight_N': W, 'mu': MU, 'P_side': P_SIDE, 'N_btn': N_BTN, 'K_mcp': K_MCP}}

# ---------------------------------------------------------------- 1. what slope friction holds
print('1. FRICTION ANGLE: a pressed fingertip stays put on any slope below atan(mu)')
out['friction_angle_deg'] = {k: float(np.degrees(np.arctan(v))) for k, v in MU.items()}
for k, v in MU.items(): print('   mu %.2f -> %.1f deg   (%s)' % (v, np.degrees(np.arctan(v)), k))

# ---------------------------------------------------------------- 2. lifting
print('\n2. LIFT: squeeze per side to hold Theseus (%.2f g, weight %.3f N) between two opposed pads, P = W (1 + a/g) / (2 tan(phi + beta))' % (M * 1e3, W))
out['lift'] = {}
for k, mu in MU.items():
    phi = np.arctan(mu); row = {}
    for beta in (0, 5, 10):
        for a_g in (0.0, 1.0):
            row['undercut %d deg, lift accel %.0f g' % (beta, a_g)] = float(W * (1 + a_g) / (2 * np.tan(phi + np.radians(beta))))
    out['lift'][k] = row
    print('   mu %.2f: static %.3f N | lifting off at 1 g %.3f N | static, walls undercut 5 deg %.3f N, 10 deg %.3f N' % (mu, row['undercut 0 deg, lift accel 0 g'], row['undercut 0 deg, lift accel 1 g'], row['undercut 5 deg, lift accel 0 g'], row['undercut 10 deg, lift accel 0 g']))
print('   against the measured office squeeze: %.2f N mean (Johnson 2000): margin over the static need at mu 0.5: x%.2f; at mu 0.2: x%.2f' % (P_SIDE, P_SIDE / (W / (2 * 0.5)), P_SIDE / (W / (2 * 0.2))))

# ---------------------------------------------------------------- 3. swipes
print('\n3. SWIPE: force to accelerate the mouse F = m a; fore-aft it passes through friction at the sides, P = m a / (2 tan(phi + theta))')
out['swipe'] = {}
for nm, a in ACC.items():
    F = M * a; row = {'a_m_s2': float(a), 'a_g': float(a / G), 'F_N': float(F), 'squeeze_per_side_N': {}}
    for k, mu in MU.items(): row['squeeze_per_side_N'][k] = float(F / (2 * mu))
    out['swipe'][nm] = row
    print('   %s: a = %.0f m/s^2 (%.1f g), F = %.2f N; squeeze per side at mu 0.2 / 0.41 / 0.5 / 1.3: %s N' % (nm, a, a / G, F, ' / '.join('%.2f' % (F / (2 * mu)) for mu in MU.values())))
print('   sideways the wall pushes directly: the pushing side carries F itself, no friction needed; fingertips on the buttons add mu N (2 x 0.5 x %.2f = %.2f N) fore-aft' % (N_BTN, 2 * 0.5 * N_BTN))
# help from the shape: slope theta under the pad, facing the load
print('   help from a slope theta under the pads (mu 0.5): capacity x tan(phi + theta) / tan(phi)')
out['slope_help'] = {}
for th in (0.5, 1.0, 1.57, 2.09, 4.0, 6.1, 10.0):
    up = np.tan(np.arctan(0.5) + np.radians(th)) / 0.5; dn = np.tan(np.arctan(0.5) - np.radians(th)) / 0.5; out['slope_help'][str(th)] = [float(up), float(dn)]
    print('     theta %.2f deg: %+.0f %% against the load, %+.0f %% with it' % (th, (up - 1) * 100, (dn - 1) * 100))

# ---------------------------------------------------------------- 4. the finger as a spring
print('\n4. THE FINGER AS A SPRING (passive, at rest): k_tip = K_mcp / r^2')
out['spring'] = {}
for f in ('index', 'middle', 'ring', 'little'):
    L, ang, reach = H.chord(f); row = {}
    for nm, r in (('lever = knuckle-to-tip chord', L), ('lever = reach along the hand', reach)):
        row[nm] = {'r_mm': float(r), 'k_N_per_mm': float(K_MCP / (r / 1e3) ** 2 / 1e3), 'k_subjects': [float(k / (r / 1e3) ** 2 / 1e3) for k in K_MCP_SUBJ], 'k_literature': [float(k / (r / 1e3) ** 2 / 1e3) for k in K_MCP_LIT]}
    out['spring'][f] = row
    a = row['lever = knuckle-to-tip chord']; b = row['lever = reach along the hand']
    print('   %-6s chord %.1f mm: %.4f N/mm (4 subjects %.4f to %.4f; literature %.4f to %.4f) | reach %.1f mm: %.4f N/mm' % (f, a['r_mm'], a['k_N_per_mm'], *a['k_subjects'], *a['k_literature'], b['r_mm'], b['k_N_per_mm']))
print('   the fingertip pulp in shear, for comparison: %.1f N/mm along the finger, %.1f N/mm across (Nakazawa 2000 via Delhaye 2014): 40 to 100 times stiffer' % (PULP_SHEAR['along the finger'], PULP_SHEAR['across the finger']))

# ---------------------------------------------------------------- 5. slope, spring and friction on one axis
print('\n5. WHAT MOVES A PRESSED FINGERTIP: per mm off its rest / off the valley bottom, against what friction holds')
out['balance'] = {}
cases = [('side arc, result (R 278)', P_SIDE, 278.15, 0.0092), ('side arc, the Sora (R 381)', P_SIDE, 381.19, 0.0092), ('side arc, first estimate (R 46.7)', P_SIDE, 46.66, 0.0092),
         ('groove, result (R 224)', N_BTN, 223.7, 0.0128), ('groove, the Sora (R 50)', N_BTN, 50.14, 0.0128), ('groove, first estimate (R 28.7)', N_BTN, 28.75, 0.0128)]
for nm, N, R, k in cases:
    pocket = N / R; row = {'pocket_N_per_mm': pocket, 'spring_N_per_mm': k, 'rho': pocket / k, 'friction_N': {}, 'stuck_half_width_mm': {}, 'offset_to_slide_on_slope_alone_mm': {}}
    for mu in (0.2, 0.5, 1.3):
        row['friction_N'][str(mu)] = mu * N; row['stuck_half_width_mm'][str(mu)] = mu * N / (pocket + k); row['offset_to_slide_on_slope_alone_mm'][str(mu)] = mu * R
    out['balance'][nm] = row
    print('   %-34s pocket %.5f N/mm, finger %.4f N/mm (rho %.2f); friction at mu 0.2 / 0.5 / 1.3: %.3f / %.3f / %.3f N -> held within +-%.0f / %.0f / %.0f mm' % (
        nm, pocket, k, pocket / k, 0.2 * N, 0.5 * N, 1.3 * N, *[row['stuck_half_width_mm'][str(m)] for m in (0.2, 0.5, 1.3)]))

# ---------------------------------------------------------------- 6. felt: the gentlest arc, across the thresholds and the slides
print('\n6. FELT: the gentlest radius R = stretch / turn (mm)')
out['felt'] = {'sides': {}, 'groove': {}}
for nm, a in ALPHA.items():
    row = {hk: float(s / a) for hk, s in SLIDE.items()}; out['felt']['sides'][nm] = dict(row, turn_deg=float(a * DEG))
    print('   %-42s %.2f deg: thumb slide p5 / mean / p95 (%.1f / %.1f / %.1f mm): R %.0f / %.0f / %.0f' % (nm, a * DEG, *SLIDE.values(), *row.values()))
for nm, a in ALPHA.items():
    out['felt']['groove'][nm] = {'own contact patch 8.62 mm': float(PATCH['button, 0.35 N'] / a), 'patch + spread between hands 13.44 mm (stock)': float(13.44 / a)}
print('   groove, a fingertip that stays put: across its own contact patch (8.62 mm) at the study\'s 3.44 deg: R %.0f mm; stock counts 13.44 mm (patch + the spread between hands): R %.0f mm' % (PATCH['button, 0.35 N'] / ALPHA['the study: G&M mean + 2 SD, 75 %'], 13.44 / ALPHA['the study: G&M mean + 2 SD, 75 %']))
print('   groove, measured directly on a still fingerpad (Goodwin 1991, 75 %%): concave 5.4 /m = R 185 mm; the result R 224 mm is %.2f /m, the Sora\'s own R 50 mm is %.1f /m' % (1e3 / 223.7, 1e3 / 50.14))
print('   the turn across one fingertip\'s contact (8.62 mm): result R 224: %.2f deg; R 144: %.2f deg; the Sora R 50: %.2f deg' % (8.62 / 223.7 * DEG, 8.62 / 143.7 * DEG, 8.62 / 50.14 * DEG))

# ---------------------------------------------------------------- 7. what the slope signals when sliding, and what it catches
print('\n7. WHAT A GENTLE ARC DOES MECHANICALLY')
turn = ALPHA['the study: G&M mean + 2 SD, 75 %']
out['drag_change'] = {str(mu): float(turn / mu) for mu in (0.2, 0.5, 1.3)}
print('   sliding through a 3.44 deg turn changes the sideways force by N x 0.060: %.3f N at %.2f N, against a drag mu N of %.3f N (mu 0.5): %.0f %% (mu 0.2: %.0f %%, mu 1.3: %.0f %%)' % (P_SIDE * turn, P_SIDE, 0.5 * P_SIDE, turn / 0.5 * 100, turn / 0.2 * 100, turn / 1.3 * 100))
out['catch_mm'] = {}
for R in (381.2, 278.2, 188.0, 143.7, 100.0, 50.1, 46.7, 28.7):
    row = {}
    for over in (1.1, 1.25):
        row['%d %% overload' % round((over - 1) * 100)] = float(R * (np.arctan(over * 0.5) - np.arctan(0.5)))
    out['catch_mm'][str(R)] = row
print('   a finger that slips under a load 10 % (25 %) over its friction travels R x (atan(1.1 mu) - atan(mu)) before the slope stops it (mu 0.5):')
print('     ' + '; '.join('R %s: %.1f (%.1f) mm' % (R, v['10 % overload'], v['25 % overload']) for R, v in out['catch_mm'].items()))
out['misfit'] = {}
print('   a finger resting e mm from the bottom sits on a slope e / R and spends (e / R) / mu of its friction holding itself there:')
for nm, e, R in (('result, thumb, mean hand (7.7 mm behind the bottom)', 7.65, 278.2), ('result, thumb, 95th percentile hand (9.9 mm)', 9.9, 278.2), ('first estimate R 46.7, 9.9 mm', 9.9, 46.7), ('groove R 224, 2.4 mm sideways spread', 2.41, 223.7), ('groove R 50 (the Sora), 2.4 mm', 2.41, 50.1), ('groove R 28.7 (first estimate), 2.4 mm', 2.41, 28.7)):
    out['misfit'][nm] = {'slope_deg': float(np.degrees(np.arctan(e / R))), 'share_of_friction': {str(mu): float(e / R / mu) for mu in (0.2, 0.5)}}
    print('     %-52s slope %.2f deg: %.0f %% of the friction at mu 0.5, %.0f %% at mu 0.2' % (nm, np.degrees(np.arctan(e / R)), e / R / 0.5 * 100, e / R / 0.2 * 100))
# the bound R >= e / (X mu)
print('   the hardest radius that keeps every 5th-to-95th hand\'s resting finger within a share X of its friction: R >= e / (X mu), e = 9.9 mm (sides), 2.4 mm (grooves)')
out['R_min_friction'] = {}
for X in (0.1, 0.2, 1.0):
    for mu in (0.2, 0.5):
        out['R_min_friction']['X %.1f mu %.1f' % (X, mu)] = {'side': 9.9 / (X * mu), 'groove': 2.41 / (X * mu)}
        print('     X %.0f %%, mu %.1f: sides R >= %.0f mm, grooves R >= %.0f mm' % (X * 100, mu, 9.9 / (X * mu), 2.41 / (X * mu)))

# ---------------------------------------------------------------- 8. the first estimate, recomputed
print('\n8. THE FIRST ESTIMATE (kappa* = k_tip / N), recomputed')
for f, r, N in (('index', H.chord('index')[2], N_BTN), ('middle', H.chord('middle')[2], N_BTN), ('little / thumb', H.chord('little')[0], P_SIDE)):
    k = K_MCP / (r / 1e3) ** 2 / 1e3; print('   %-14s k_tip %.4f N/mm, N %.2f N -> R %.1f mm (stiffness range of the 4 subjects: %.1f to %.1f; of the literature: %.1f to %.1f)' % (
        f, k, N, N / k, N / (K_MCP_SUBJ[1] / (r / 1e3) ** 2 / 1e3), N / (K_MCP_SUBJ[0] / (r / 1e3) ** 2 / 1e3), N / (K_MCP_LIT[1] / (r / 1e3) ** 2 / 1e3), N / (K_MCP_LIT[0] / (r / 1e3) ** 2 / 1e3)))
kI, kM = K_MCP / (H.chord('index')[2] / 1e3) ** 2 / 1e3, K_MCP / (H.chord('middle')[2] / 1e3) ** 2 / 1e3
out['first_estimate'] = {'R_side': P_SIDE / (K_MCP / (H.chord('little')[0] / 1e3) ** 2 / 1e3), 'R_groove': 1 / (0.5 * (kI / N_BTN + kM / N_BTN))}
print('   recorded: sides 46.66, grooves 28.75 -> recomputed %.2f, %.2f' % (out['first_estimate']['R_side'], out['first_estimate']['R_groove']))
print('   a 41.5 mm side arc at R 46.7 would be %.1f mm deep; over 60 mm, %.1f mm' % (46.66 - np.sqrt(46.66 ** 2 - 20.75 ** 2), 46.66 - np.sqrt(46.66 ** 2 - 30 ** 2)))
json.dump(out, open(os.path.join(ROOT, 'out', 'newton.json'), 'w'), indent=1)
