"""Cross-checks on the slide as you grip (F65.6), beside longarcs.py's figure (the heel placement to the lifted one: the
thumb 21.0 mm, the pinky 24.9 mm for the ANSUR II mean hand). Neither is the whole slide; each is a part of the motion.

1. CLAMP IN PLACE: the hand already in trial 4's grip clamps down, the wrist back 15 deg until the palm's skin meets the hump,
   the index tip held where it is and both tips on the buttons (the fingers' cascade scaled by one factor to fit). The thumb
   (an estimate: level with the index's middle joint) and the pinky ride back with the hand.
2. THE THUMB'S OWN CLOSURE: its tip relative to its metacarpal from rest to a grasp. Phalanges 17.1 and 12.1 % of hand length
   (Freivalds, as tabulated in "A Functional Anatomy Based Kinematic Human Hand Model with Simple Size Adaptation", Table II);
   rest MCP 39, IP 10 deg (Lee & Jung 2014); a cylinder grasp MCP 29.9, IP 36.2 deg (Buchholz & Armstrong 1992, Table 1,
   measured, transverse volar grasp).
Run: python3 deck/tools/gd/slide_checks.py"""
import os, sys
import numpy as np
from scipy.optimize import least_squares
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import trials as T, hand as H
from descend import top_y, PROF

def chain_s(f, g, s, k):
    p = np.zeros(2); out = [p.copy()]; c = 0.0
    for L, a in zip(H.BONES[f], H.CASCADE[f]):
        c += np.radians(a * s); d = g - c; p = p + k * L * np.array([np.cos(d), np.sin(d)]); out.append(p.copy())
    return np.array(out)
def clamp(k, z_index, gdeg=T.GRIP_HEEL_DEG):
    g = np.radians(gdeg); xs = {'index': 16.0, 'middle': -16.0}; kb = {f: H.KNUCKLE_BACK[f] * k for f in H.KNUCKLE_BACK}
    n = np.array([np.sin(g), -np.cos(g)]); tdir = np.array([np.cos(g), np.sin(g)])
    def pts(f, v): zK, yK, s = v; return np.array([zK - kb[f] * np.cos(g), yK - kb[f] * np.sin(g)]) + chain_s(f, g, s, k)
    def gap(v):
        base = np.array(v[:2]) + H.PALM_SKIN * k * n; rel = PROF - base; along = rel @ tdir; m = (along < 0) & (along > -100 * k)
        return float((rel[m] @ n).min())
    def res(v):
        tr = [pts(f, v)[-1][1] - top_y(xs[f], pts(f, v)[-1][0]) for f in ('index', 'middle')]
        return [pts('index', v)[-1][0] - z_index, np.mean(tr), gap(v)]
    v = least_squares(res, [-20.0, 65.0, 1.3], bounds=([-80, 20, 0.5], [20, 140, 3.0])).x
    return {'flex': float(v[2]), 'thumb': float(pts('index', v)[2][0]), 'little': float(pts('little', v)[-1][0])}

def thumb_closure(hand=H.ANSUR['hand']):
    Lp, Ld = 0.171 * hand, 0.121 * hand
    def tip(mcp, ip): a1, a2 = np.radians(mcp), np.radians(mcp + ip); return Lp * np.array([np.cos(a1), -np.sin(a1)]) + Ld * np.array([np.cos(a2), -np.sin(a2)])
    return float(np.hypot(*(tip(29.9, 36.2) - tip(39, 10)))), Lp, Ld

if __name__ == '__main__':
    L50 = T.place('lifted', 1.0); zi = L50['z']['index']; out = {}
    for hk in T.HANDS:
        k = T.HANDS[hk] / T.HANDS['p50']; Lp = L50 if hk == 'p50' else T.place('lifted', k, zi); c = clamp(k, zi)
        out[hk] = {'thumb': abs(c['thumb'] - Lp['z']['thumb']), 'pinky': abs(c['little'] - Lp['z']['little']), 'flex': c['flex']}
        print('clamp in place, %s: thumb %.1f mm, pinky %.1f mm (the cascade x%.2f: the fingers straighten as the palm comes down)' % (hk, out[hk]['thumb'], out[hk]['pinky'], c['flex']))
    d, Lp_, Ld_ = thumb_closure(); print('the thumb\'s own closure, rest to grasp: its tip moves %.1f mm (phalanges %.1f and %.1f mm)' % (d, Lp_, Ld_))
