"""How strong a pocket should be: the estimate, step by step (all inputs sourced in research/data/shape-gd.json).

A fingertip rests on the surface with a press N. Across a pocket whose surface curves up by kappa (1/mm) per mm of
offset, the slope at an offset u is kappa*u, so the surface turns kappa*u of the press sideways: the pocket pulls the
tip back with a stiffness N*kappa (N/mm). (Exact for a conforming pad on a parabola: the slope averaged over a
symmetric contact patch is the slope at its centre.)
The relaxed finger has its own pull back to rest: its knuckle's passive stiffness k (N m/rad) over the lever r from the
knuckle to the tip, k_tip = k / r^2.
Drift under a sideways disturbance F:  F / (k_tip + N kappa)       -> falls as the pocket steepens
Strain when the pocket's floor misses the finger's rest by e:  e * N kappa / (k_tip + N kappa)   -> rises with it
Normalise each by its worst case (no pocket; a rigid pocket) and add the squares: J(rho) = (1 + rho^2) / (1 + rho)^2,
rho = N kappa / k_tip. dJ/drho = 2 (rho - 1) / (1 + rho)^3 = 0 at rho = 1: the best pocket holds the finger exactly as
hard as the finger holds itself.  kappa* = k_tip / N."""
import numpy as np
import hand

K_MCP = float(np.mean([0.0377, 0.0328, 0.0466, 0.0393]))   # N m/rad, [shi2020] healthy index MCP, standard device
K_RANGE = (0.0328, 0.0466)
N_BTN = 0.35          # N, mean press on the button, regular work [johnson2000] (Table 2; the abstract swaps sides and button)
N_SIDE = 0.43         # N, mean squeeze on the sides, regular work [johnson2000]
N_SIDE_SIM = 0.92     # N, the same in simulated use [johnson2000]
CLICK_N = 49 * 9.80665e-3   # the deck's click, 49 gf
PAD_W = 16.0          # mm, the pad width used only to express depth; estimate

def J(rho): return (1 + rho ** 2) / (1 + rho) ** 2

def k_tip(r_mm, k=K_MCP):
    return k / (r_mm / 1000.0) ** 2 / 1000.0     # N/mm

def table():
    rows = {}
    for f, lever_kind, N in [('index', 'reach', N_BTN), ('middle', 'reach', N_BTN), ('little', 'chord', N_SIDE), ('thumb', 'chord', N_SIDE)]:
        L, ang, reach = hand.chord('little' if f == 'thumb' else f)   # the thumb: taken as the little finger's lever (estimate)
        r = reach if lever_kind == 'reach' else L
        kt = k_tip(r); kap = kt / N
        lo, hi = k_tip(r, K_RANGE[0]) / N, k_tip(r, K_RANGE[1]) / N
        rows[f] = {'lever_mm': r, 'k_tip_N_per_mm': kt, 'press_N': N, 'kappa_opt_per_mm': kap, 'R_opt_mm': 1 / kap,
                   'R_range_mm': [1 / hi, 1 / lo], 'depth_over_pad_mm': kap * PAD_W ** 2 / 8,
                   'slope_at_2mm_deg': float(np.degrees(np.arctan(2 * kap))), 'pull_at_2mm_N': kt * 2}
        if f in ('little', 'thumb'):
            ks = kt / N_SIDE_SIM; rows[f]['R_opt_mm_simulated_use'] = 1 / ks
    return rows

if __name__ == '__main__':
    import json
    print('K_MCP %.4f N m/rad; click %.3f N' % (K_MCP, CLICK_N))
    print(json.dumps(table(), indent=1))
    print('J(0.25) %.3f J(1) %.3f J(4) %.3f' % (J(0.25), J(1), J(4)))
