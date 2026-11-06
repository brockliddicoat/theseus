"""H4: the USB pair's geometry on the 0.6 mm two-layer stack, by the 2D field solver (fieldsolve.py).
Writes /home/claude/work/h4/usb_design.json."""
import json, math, sys
import fieldsolve as F
H, T, ER = 0.565, 0.0175, 4.3
MASK = dict(er_mask=3.5, c1=0.020, c2=0.015)          # LPI mask: 20 um over laminate, 15 um over copper, er 3.5
out = dict(stack=dict(h=H, t=T, er=ER, mask=MASK), runs=[])

def run(tag, **g):
    geom = dict(w=0.55, s=0.15, t=T, h=H, er_sub=ER); geom.update(g)
    r = F.solve(geom)
    rec = dict(tag=tag, geom={k: v for k, v in geom.items()}, Zdiff=round(r['Zdiff'], 2), Zodd=round(r['Zodd'], 2),
               Zcm=round(r['Zcm'], 2), Zeven=round(r['Zeven'], 2), eeff_odd=round(r['eeff_odd'], 3), eeff_even=round(r['eeff_even'], 3))
    out['runs'].append(rec)
    print(tag, {k: v for k, v in g.items()}, '->', rec['Zdiff'], 'diff', rec['Zcm'], 'cm', rec['eeff_odd'], flush=True)
    return r

def solve_w(target, lo=0.25, hi=0.9, **g):
    """w for Zdiff = target (Zdiff falls as w grows)"""
    flo = run('w?', w=lo, **g)['Zdiff'] - target
    fhi = run('w?', w=hi, **g)['Zdiff'] - target
    for _ in range(12):
        # secant on log(w), safeguarded
        wm = math.exp(math.log(lo) + (math.log(hi) - math.log(lo)) * flo / (flo - fhi))
        wm = min(max(wm, lo + 0.1 * (hi - lo)), hi - 0.1 * (hi - lo)) if _ > 3 else wm
        fm = run('w?', w=wm, **g)['Zdiff'] - target
        if abs(fm) < 0.05:
            return wm
        if fm > 0: lo, flo = wm, fm
        else: hi, fhi = wm, fm
    return wm

def sweep_env():
    base = dict(w=0.49, s=0.15); base.update(MASK)
    run('base', **base)
    for g in (0.2, 0.3, 0.4, 0.5, 0.6, 0.75, 1.0, 1.5):
        run('cpw_g', g=g, **base)
    for m in (0.5, 0.75, 1.0, 1.5, 2.0, 3.0):
        run('band_m', m=m, **base)
    for (g, m) in ((0.5, 1.5), (0.5, 2.0), (0.6, 2.0), (0.75, 2.0)):
        run('cpw_band', g=g, m=m, **base)


if __name__ == '__main__':
    what = sys.argv[1] if len(sys.argv) > 1 else 'w'
    if what == 'w':
        for s in (0.15,):
            for mask in (False, True):
                g = dict(s=s); g.update(MASK if mask else {})
                w = solve_w(90.0, **g)
                out.setdefault('w90', []).append(dict(s=s, mask=mask, w=round(w, 4)))
                print('==> s %.3f mask %s: w %.4f for 90 ohm' % (s, mask, w), flush=True)
    if what == "env":
        sweep_env()
    json.dump(out, open('/home/claude/work/h4/usb_design_%s.json' % what, 'w'), indent=1)
