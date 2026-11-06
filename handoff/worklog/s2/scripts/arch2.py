"""F49.2 arch, v2: a constant normal offset N0 of the crown profile from the K3 corner forward, run out into the flat lip
(y = Y_LIP across the nose, #46) with a softplus blend (curvature-continuous), K3 at the back (S1's construction on the
arch's top-view tangent). design(n0) -> dict(path=(X, Y, Z) from the nose's flat lip to the centre of the cutout, ...)"""
import json, sys
import numpy as np
from math import comb
from scipy.ndimage import gaussian_filter1d
sys.path.insert(0, '/home/claude/work/s2/scripts')
from arch import T, skin_y, x_at, bez, curvature, offset_curve, seam_today, Z_CUT, K3, HM
Y_LIP, S_RUN = 10.0, 0.55        # the flat front cutout's height; the run-out's softness (mm)

def arch_y(z, n0):
    oz, oy = offset_curve(n0, -2.0, 62.0)
    ya = np.interp(z, oz, oy)
    return Y_LIP + S_RUN * np.logaddexp(0, (ya - Y_LIP) / S_RUN)

def design(n0, k3=K3, z_front=55.5):
    zz = np.arange(Z_CUT + 2.0, z_front + 1e-9, 0.1)
    ys = arch_y(zz, n0)
    xs = np.array([x_at(y, z) for y, z in zip(ys, zz)])
    xs_s = gaussian_filter1d(xs, 4)
    best = None
    for k in range(5, len(zz) - 5):
        t = np.array([xs_s[k + 3] - xs_s[k - 3], zz[k + 3] - zz[k - 3]]); t /= np.linalg.norm(t)
        if t[1] <= 0: continue
        s = (zz[k] - Z_CUT) / t[1]
        if best is None or abs(s - k3['e'][0]) < best[0]: best = (abs(s - k3['e'][0]), k, t, s)
    _, kJ, t2, s = best
    J = np.array([xs_s[kJ], zz[kJ]]); K = J - s * t2
    t1 = np.array([1.0, 0.0]); d = k3['d']; e = [s, s * 2 / 3, s / 3]
    Pc = [K - d[0] * t1, K - d[1] * t1, K - d[2] * t1, K + e[2] * t2, K + e[1] * t2, K + e[0] * t2]
    C = bez(Pc, 600); kap = curvature(C)
    corner = np.c_[C[:, 0], skin_y(C[:, 0], C[:, 1]), C[:, 1]]
    arch3 = np.c_[xs_s, ys, zz][kJ:]
    cx = np.linspace(C[0, 0], 0.125, 200)
    cut3 = np.c_[cx, skin_y(cx, np.full(len(cx), Z_CUT)), np.full(len(cx), Z_CUT)]
    path = np.vstack([arch3[::-1], corner[::-1][1:], cut3[1:]])
    return dict(n0=n0, J=J.tolist(), K=K.tolist(), ctrl=np.array(Pc).tolist(), rmin=float(1 / np.abs(kap).max()),
                span=[float(C[:, 0].max() - C[:, 0].min()), float(C[:, 1].max() - C[:, 1].min())], path=path, corner=corner, arch=arch3)

if __name__ == '__main__':
    import matplotlib; matplotlib.use('Agg'); import matplotlib.pyplot as plt
    sys.path.insert(0, '/home/claude/work/s1/scripts')
    import sidegeo as SG
    from geo_options import option_rear
    c = np.load('/home/claude/work/s2/seam_ths_cloud.npy')
    NS = [float(v) for v in sys.argv[1:]] or [5.0, 6.0, 6.9]
    fig, ax = plt.subplots(len(NS), 2, figsize=(26, 8.5 * len(NS)), dpi=70, gridspec_kw=dict(width_ratios=[1.8, 1]))
    sil = SG.silhouette('shell'); s1, _ = option_rear('K3')
    for i, n0 in enumerate(NS):
        D = design(n0); p = D['path']
        a = ax[i, 0]; zz = np.linspace(-10, 60, 800)
        a.plot(sil[:, 0], sil[:, 1], color='grey', lw=0.8); a.plot(c[:, 2], c[:, 1], '.', ms=2, color='red')
        a.plot(p[:, 2], p[:, 1], color='#0071e3', lw=2)
        a.set_xlim(61, -3); a.set_ylim(8, 38); a.set_aspect('equal'); a.grid(alpha=.3)
        a.set_title('N0 %.1f: J (%.2f, %.2f) rmin %.2f span %.2f x %.2f' % (n0, *D['J'], D['rmin'], *D['span']))
        b = ax[i, 1]
        b.plot(c[:, 0], c[:, 2], '.', ms=2, color='red'); b.plot(s1[:, 0], s1[:, 1], color='orange', lw=1.2)
        b.plot(p[:, 0], p[:, 2], color='#0071e3', lw=2)
        b.set_xlim(14, 32); b.set_ylim(2, 56); b.set_aspect('equal'); b.grid(alpha=.3)
        for z in [12, 20, 30, 40, 45, 50, 53]:
            print('N0 %.1f z %4.0f  new y %.2f today %.2f (%+.2f)  new x %.2f' % (n0, z, np.interp(z, p[::-1, 2][p[::-1, 2].argsort()], p[::-1, 1][p[::-1, 2].argsort()]) if False else arch_y(np.array([z]), n0)[0],
                  seam_today(z), arch_y(np.array([z]), n0)[0] - seam_today(z), np.interp(z, D['arch'][:, 2], D['arch'][:, 0])))
    plt.savefig('/home/claude/work/s2/shots/arch_candidates.png', bbox_inches='tight')
