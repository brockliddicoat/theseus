"""Fit the arc model to the Sora V2 base: the top outline (plan), the side profile and the cross-sections.
Writes out/sora_arcs.json: each curve's arcs (L mm, turn rad, depth mm), its start, and the fit error in mm.
Run after sora_sections.py: python3 deck/tools/gd/fit_sora.py"""
import json, os, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import arcs as A
from sora_sections import load

def polar_outline(P2, c, a0, a1, n=900):
    """outline of a 2D cloud by polar max about c, for angles a0..a1 (atan2(dy, dx)), ordered a0 -> a1"""
    d = P2 - c; ang = np.arctan2(d[:, 1], d[:, 0]); r = np.hypot(*d.T)
    out = []
    for lo, hi in zip(np.linspace(a0, a1, n)[:-1], np.linspace(a0, a1, n)[1:]):
        lo2, hi2 = min(lo, hi), max(lo, hi)
        m = (ang >= lo2) & (ang < hi2)
        if m.any(): out.append(P2[np.argmax(np.where(m, r, -1))])
    return np.array(out)

def main():
    T = load(); V = T.reshape(-1, 3)
    # densify the triangles a little (centroids and edge midpoints) so the polar max sees the true silhouette
    V = np.concatenate([V, T.mean(1), (T[:, 0] + T[:, 1]) / 2, (T[:, 1] + T[:, 2]) / 2, (T[:, 2] + T[:, 0]) / 2])
    sec = json.load(open(os.path.join(HERE, 'out', 'sora_sections.json')))
    out = {'source': 'deck/tools/gd/fit_sora.py on 3d/shell/shell-sora.glb', 'units': 'mm, rad', 'curves': {}}
    # ---- plan: the right half (user's right, -X; no side buttons), mirrored to u = -x >= 0; nose centre -> tail centre
    P = np.c_[-V[:, 0], V[:, 2]]; P = P[P[:, 0] >= -0.05]
    Pl = polar_outline(P, np.array([0.0, 0.0]), np.pi / 2, -np.pi / 2, 1400)
    Pl = Pl[np.argsort(-np.arctan2(Pl[:, 1], Pl[:, 0]))]
    zN, zT = V[:, 2].max(), V[:, 2].min()
    Pl = np.r_[[[0, zN]], Pl, [[0, zT]]]
    init = [(8, -0.55), (10, -0.6), (14, -0.3), (22, 0.02), (24, 0.02), (16, -0.35), (12, -0.6), (12, -0.75)]
    arcs, C, e = A.fit(Pl, (0.0, zN), 0.0, init, end=-np.pi)
    out['curves']['plan'] = {'p0': [0.0, float(zN)], 'th0': 0.0, 'axes': ['u = -x (right half, mirrored)', 'z'], 'arcs': arcs, 'err': e,
                             'target': Pl[::4].round(3).tolist()}
    print('plan  ', len(arcs), 'arcs  rms %.3f  p95 %.3f  max %.3f mm' % (e['rms'], e['p95'], e['max']))
    # ---- side profile: (z, y) silhouette, from the tail at the base up over the hump to the nose at the base
    Q = np.c_[V[:, 2], V[:, 1]]
    Pr = polar_outline(Q, np.array([0.0, 8.0]), np.pi - 0.02, 0.02, 1400)
    Pr = Pr[np.argsort(-np.arctan2(Pr[:, 1] - 8.0, Pr[:, 0]))]
    Pr = Pr[(Pr[:, 1] > 1.2) & (Pr[:, 0] < 57.5)]
    init = [(10, -0.5), (16, -0.4), (20, -0.25), (22, -0.2), (24, -0.15), (20, -0.1), (10, -0.3)]
    th0 = np.arctan2(Pr[3, 1] - Pr[0, 1], Pr[3, 0] - Pr[0, 0])
    arcs, C, e = A.fit(Pr, tuple(Pr[0]), th0, init)
    out['curves']['profile'] = {'p0': Pr[0].round(4).tolist(), 'th0': float(th0), 'axes': ['z', 'y'], 'arcs': arcs, 'err': e, 'target': Pr[::4].round(3).tolist()}
    print('profile', len(arcs), 'arcs  rms %.3f  p95 %.3f  max %.3f mm' % (e['rms'], e['p95'], e['max']))
    # ---- cross-sections: right half, u = -x, from the top centre heading outward, down the side to the base
    out['curves']['xsec'] = {}
    for zk, pts in sec['xsec'].items():
        c = np.array(pts); c = c[c[:, 0] <= 0.05]; c = np.c_[-c[:, 0], c[:, 1]]
        ang = np.arctan2(c[:, 1] - 14.0, c[:, 0]); c = c[np.argsort(-ang)]
        c = c[c[:, 1] > 0.9]
        top = c[0]; c = np.r_[[[0.0, top[1]]], c]
        init = [(8, -0.08), (8, -0.12), (8, -0.35), (6, -0.6), (10, -0.3), (8, -0.1), (6, -0.6)]
        arcs, C, e = A.fit(c, (0.0, float(top[1])), 0.0, init)
        out['curves']['xsec'][zk] = {'z': float(zk), 'p0': [0.0, float(top[1])], 'th0': 0.0, 'axes': ['u = -x (right half)', 'y'], 'arcs': arcs, 'err': e, 'target': c[::3].round(3).tolist()}
        print('xsec z %4s' % zk, len(arcs), 'arcs  rms %.3f  p95 %.3f  max %.3f mm' % (e['rms'], e['p95'], e['max']))
    json.dump(out, open(os.path.join(HERE, 'out', 'sora_arcs.json'), 'w'), indent=1)

if __name__ == '__main__':
    main()
