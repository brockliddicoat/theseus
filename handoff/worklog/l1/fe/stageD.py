"""L1 stage D: around the winner (triangles at the skin floor, ribs at the limits). Sensitivity to each cited limit,
to where the pattern lands (phase), to the mesh, and buckling.

  D1 rib height rule:  kh 1.8 (3 x the rib's own width: Xometry; Stratasys Direct 2015), kh 2.5 (Beall's lower end)
  D2 rib width rule:   kw 0.5 (Beall 2000: high-shrink PP), kw 0.45 (Beall: appearance parts, a further -10 %)
  D4 draft 1.0 deg/side (DFMPro's recommended 1 to 1.5)
  D5 phase +0.25, +0.5 of a line spacing (where the ribs meet the crease and the cutout)
  D6 mesh h 0.7, 0.55: the winner and the plain wall with rails
  every one at t = 0.60 (lam solved), except D6 (the same design as the winner, finer mesh)
Usage: python3 stageD.py  -> stageD.json, stageDb.json (the buckling list)
"""
import sys, json
sys.path.insert(0, '/home/claude/work/l1/fe')
from stageC import at_limits, lam_for_t, geo, plan_fit
import numpy as np, l1fe


def at_depth(kind, lam, hr, kw=0.6, kr=0.3, kn=None, h=0.9, draft=0.5):
    """a fixed rib depth hr, the width at the sink limit w = kw t, root and node radii kr t: t from the budget (quadratic)"""
    kn = kr if kn is None else kn
    g = geo(kind, lam, h); a, c, L3 = plan_fit(g, kn / kw)
    V0 = (l1fe.BUDGET - l1fe.M_SKATES) / l1fe.RHO - l1fe.V_LEDGE - l1fe.V_BOSS - g['V_rails']
    At = g['A_lat'] + g['A_rim'] + g['A_nose']; dt = hr * np.tan(np.radians(draft))
    # t At + hr (a (kw t - dt) + c (kw t - dt)^2) + (2 - pi/2) kr^2 L3 t^2 = V0
    co = [hr * c * kw ** 2 + (2 - np.pi / 2) * kr ** 2 * L3, At + hr * a * kw - 2 * hr * c * kw * dt, hr * (-a * dt + c * dt * dt) - V0]
    t = min(r.real for r in np.roots(co) if abs(r.imag) < 1e-9 and r.real > 0.05)    # the physical root (the other is spurious)
    r_ = lambda x: round(float(x), 4)
    return dict(kind=kind, lam=r_(lam), w=r_(kw * t), hr=r_(hr), draft=draft, r_root=r_(kr * t), r_node=r_(kn * t), h=h, rails=True), t

if __name__ == '__main__':
    C = json.load(open('/home/claude/work/l1/fe/stageC.json'))
    win = [d for d in C if d['label'] == 'C2-tri-t0.60'][0]
    out = []
    for lab, kw in (('D1-kh1.8', dict(kh=1.8)), ('D1-kh2.5', dict(kh=2.5)), ('D2-kw0.50', dict(kw=0.5)), ('D2-kw0.45', dict(kw=0.45)),
                    ('D4-draft1.0', dict(draft=1.0))):
        d, t, tab = lam_for_t('tri', 0.60, **kw); d['label'] = lab; out.append(d)
        print(lab, 'lam %.4f t %.4f w %.4f hr %.4f' % (d['lam'], t, d['w'], d['hr']), flush=True)
    for hr in (0.6, 1.0, 1.4, 2.2, 2.6):
        d, t = at_depth('tri', win['lam'], hr); d['label'] = f'D7-depth{hr}'; out.append(d)
        print(d['label'], 't %.4f w %.4f hr %.4f' % (t, d['w'], d['hr']), flush=True)
    for ph in (0.25, 0.5):
        d = dict(win); d['phase'] = ph; d['label'] = f'D5-phase{ph}'; out.append(d)
    c25 = [d for d in C if d['label'] == 'C1-tri-0.25'][0]
    for ph in (0.25, 0.5):
        d = dict(c25); d['phase'] = ph; d['label'] = f'D5-l0.25-phase{ph}'; out.append(d)
    for h in (0.7, 0.55):
        d = dict(win); d['h'] = h; d['label'] = f'D6-win-h{h}'; out.append(d)
        out.append(dict(label=f'D6-plain+rails-h{h}', kind='none', rails=True, h=h))
    pri = {'D5': 0, 'D7': 1, 'D1': 2, 'D2': 3, 'D4': 4, 'D6': 5}
    out.sort(key=lambda d: (pri[d['label'][:2]], d['label']))
    json.dump(out, open('/home/claude/work/l1/fe/stageD.json', 'w'), indent=1)
    json.dump([dict(win, label='Db-win'), dict(label='Db-plain+rails', kind='none', rails=True, h=0.9)], open('/home/claude/work/l1/fe/stageDb.json', 'w'), indent=1)
    print('wrote', len(out), '+ 2 buckling', flush=True)
