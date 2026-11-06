"""H4: the pair's width for 90 ohm (fine grid), with the coplanar pour at g = 0.5 mm and the sensitivities."""
import json, math
import fieldsolve as F
FINE = dict(hmin=0.0015, ratio=1.12, hmax_near=0.04)
H, T, ER = 0.565, 0.0175, 4.3
MASK = dict(er_mask=3.5, c1=0.020, c2=0.015)
def Z(**g):
    geom = dict(w=0.475, s=0.15, t=T, h=H, er_sub=ER); geom.update(MASK); geom.update(g)
    return F.solve(geom, **FINE)
def w_for(target, **g):
    lo, hi = 0.40, 0.56
    zl, zh = Z(w=lo, **g)['Zdiff'], Z(w=hi, **g)['Zdiff']
    for _ in range(8):
        wm = lo + (hi - lo) * (zl - target) / (zl - zh)
        zm = Z(w=wm, **g)['Zdiff']
        if abs(zm - target) < 0.03: return wm, zm
        if zm > target: lo, zl = wm, zm
        else: hi, zh = wm, zm
    return wm, zm
out = {}
w, z = w_for(90.0, g=0.5)
out['w_for_90_g0.5'] = round(w, 4)
W = round(w / 0.005) * 0.005           # to a 5 um drawing step
out['W'] = W
r = Z(w=W, g=0.5); out['design'] = {k: round(v, 3) for k, v in r.items() if isinstance(v, float)}
for tag, g in (('g_inf', {}), ('g0.4', dict(g=0.4)), ('g0.75', dict(g=0.75)), ('g1.0', dict(g=1.0)),
               ('band_m0.7_g0.5', dict(g=0.5, m=0.7)), ('band_m1.0_g0.5', dict(g=0.5, m=1.0)),
               ('nomask_g0.5', dict(g=0.5, er_mask=None)), ('er4.0', dict(g=0.5, er_sub=4.0)), ('er4.6', dict(g=0.5, er_sub=4.6)),
               ('cu35', dict(g=0.5, t=0.035)), ('mask_er4.0', dict(g=0.5, er_mask=4.0)), ('mask_er3.3', dict(g=0.5, er_mask=3.3)),
               ('w+0.025', dict(g=0.5, w=W + 0.025)), ('w-0.025', dict(g=0.5, w=W - 0.025)),
               ('s+0.025', dict(g=0.5, s=0.175)), ('s-0.025', dict(g=0.5, s=0.125)), ('h-0.05', dict(g=0.5, h=0.515)), ('h+0.05', dict(g=0.5, h=0.615))):
    gg = dict(w=W); gg.update(g)
    r = Z(**gg)
    out[tag] = dict(Zdiff=round(r['Zdiff'], 2), Zcm=round(r['Zcm'], 2), eeff_odd=round(r['eeff_odd'], 3))
    print(tag, out[tag], flush=True)
# IPC-2141 and H3's estimate for the record
z0, zd = F.ipc2141_diff(W, 0.15, H, T, ER)
out['ipc2141_same_geometry'] = dict(Z0=round(z0, 2), Zdiff=round(zd, 2))
z0, zd = F.ipc2141_diff(0.55, 0.15, H, T, ER)
out['ipc2141_h3_0.55_0.15'] = dict(Z0=round(z0, 2), Zdiff=round(zd, 2))
r = F.solve(dict(w=0.55, s=0.15, t=T, h=H, er_sub=ER), **FINE); out['fd_h3_0.55_0.15_bare_inf'] = round(r['Zdiff'], 2)
r = F.solve(dict(w=0.55, s=0.15, t=T, h=H, er_sub=ER, **MASK), **FINE); out['fd_h3_0.55_0.15_mask_inf'] = round(r['Zdiff'], 2)
r = F.solve(dict(w=0.13, s=0.27, t=T, h=H, er_sub=ER, **MASK), **FINE); out['fd_old_0.13_0.27_mask'] = round(r['Zdiff'], 2)
r = F.solve(dict(w=0.13, s=0.15, t=T, h=H, er_sub=ER, **MASK), **FINE); out['fd_old_0.13_0.15_mask'] = round(r['Zdiff'], 2)
r = F.solve(dict(w=0.13, s=0.87, t=T, h=H, er_sub=ER, **MASK), **FINE); out['fd_old_0.13_0.87_mask'] = round(r['Zdiff'], 2)
kj = F.kj_coupled(W, 0.15, H, ER); out['kj_t0_nomask_inf'] = dict(Zdiff=round(kj['Zdiff'], 2))
json.dump(out, open('/home/claude/work/h4/usb_final.json', 'w'), indent=1)
print(json.dumps(out, indent=1))
