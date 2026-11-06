"""L1: read every cached result, score each design against the baseline (the plain wall with the same rails, same
weight), print a table, and write out/results.json (the slide's data).

Stiffness gain per case = baseline flex / design flex (10 N worst press near the crown, 10 N off-centre, 4.4 N palm,
10 N squeeze); the score = their geometric mean. Strength: the peak use over all cases (F41.1, with the fillet SCFs
applied at node ends and rib roots when given); margin = 1 / use (how many times the press before the first fibre
reaches its strength, linear). Moulding: skin >= 0.60 (F20.3), rib <= skin (F20.3), rib >= 0.4 skin (Protolabs:
thinner walls 40-60 % of the adjacent wall), depth <= 4 x width (Core77/Sandvik: a pocket within 4 cutter diameters).
"""
import json, glob, os, sys, numpy as np
CACHE = '/home/claude/work/l1/out/cache'
K_NODE = float(os.environ.get('K_NODE', 1.0)); K_ROOT = float(os.environ.get('K_ROOT', 1.0))


def load():
    R = []
    for f in glob.glob(os.path.join(CACHE, '*.json')):
        r = json.load(open(f))
        if r.get('infeasible'): continue
        R.append(r)
    return R


def baseline(R, h=0.9):
    for r in R:
        d = r['d']
        if d['kind'] == 'none' and d.get('rails', True) and abs(d.get('h', 0.9) - h) < 1e-6 and 't' not in d: return r
    return None


def metrics(r, b):
    d = r['d']; i = r['info']
    g = dict(worst=b['grid']['worst'] / r['grid']['worst'], crown=b['crown']['defl'] / r['crown']['defl'], off=b['off']['defl'] / r['off']['defl'],
             palm=b['palm']['defl'] / r['palm']['defl'], squeeze=b['squeeze']['defl'] / r['squeeze']['defl'])
    score = float(np.exp(np.mean(np.log([g['worst'], g['off'], g['palm'], g['squeeze']]))))
    use_skin = max(u.get('skin_use', 0) for u in r['use'].values())
    use_skin_k = max(max(u.get('skin_use', 0), u.get('skin_use', 0) * (K_ROOT if u.get('skin_hot_onrib') else 1)) for u in r['use'].values())
    use_rib = max(u.get('rib_use', 0) for u in r['use'].values())
    use = max(use_skin_k, use_rib * K_NODE)
    t = i['t']; w = d.get('w', 0) or 0; hr = d.get('hr', 0) or 0
    ok = dict(skin=t >= 0.6 - 1e-3, sink=(w <= t + 1e-3) if w else True, fill=(w >= 0.4 * t - 1e-3) if w else True, cutter=(hr <= 4 * w + 1e-3) if w else True)
    trip = min((u.get('trip_factor', np.inf) for u in r['use'].values()), default=np.inf)
    return dict(g=g, score=score, use=use, use_skin=use_skin, use_rib=use_rib, margin=1 / use if use > 0 else np.inf, ok=ok, feasible=all(ok.values()), t=t, w=w, hr=hr,
                trip=trip, buckle=r.get('buckle'))


if __name__ == '__main__':
    R = load(); b = baseline(R)
    rows = []
    for r in R:
        m = metrics(r, b); d = r['d']
        rows.append((d, m, r))
    rows.sort(key=lambda x: -x[1]['score'])
    print(f"baseline plain+rails: t {b['info']['t']:.3f} worst {1e3*b['grid']['worst']:.1f} off {1e3*b['off']['defl']:.1f} palm {1e3*b['palm']['defl']:.2f} squeeze {1e3*b['squeeze']['defl']:.1f} um, use {metrics(b, b)['use']:.3f}")
    print(f"{'label':22s} {'kind':7s} {'lam':>5s} {'w':>5s} {'hr':>5s} {'t':>5s} | {'worst':>5s} {'off':>5s} {'palm':>5s} {'sqz':>5s} | {'score':>5s} {'use':>5s} {'marg':>5s} feas")
    for d, m, r in rows:
        if d.get('h', 0.9) != 0.9: continue
        print(f"{d.get('label', '')[:22]:22s} {d['kind']:7s} {d.get('lam', 0) or 0:5.2f} {m['w']:5.2f} {m['hr']:5.2f} {m['t']:5.3f} | {m['g']['worst']:5.2f} {m['g']['off']:5.2f} {m['g']['palm']:5.2f} {m['g']['squeeze']:5.2f} | {m['score']:5.3f} {m['use']:5.3f} {m['margin']:5.1f} {'Y' if m['feasible'] else '-'} {'' if m['feasible'] else [k for k, v in m['ok'].items() if not v]}")
