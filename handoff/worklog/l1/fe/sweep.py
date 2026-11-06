"""L1 sweep runner: designs from a JSON list, one at a time (one solver process: the machine is shared), each result
cached as out/cache/<key>.json; a design already cached is skipped. Usage: python3 sweep.py <designs.json> [--buckle]

A design: {kind, lam, w, hr, draft, r_root, r_node, h, rails, t (optional: force the skin), t_rim_add, aspect/t_target
(optional: solve the rib so the skin lands on t_target with h = aspect * w)}.
"""
import sys, os, json, time, numpy as np
sys.path.insert(0, '/home/claude/work/l1/fe')
import l1fe
CACHE = '/home/claude/work/l1/out/cache'; os.makedirs(CACHE, exist_ok=True)


def solve_rib_for_skin(d, t_target, aspect):
    """find w (h = aspect * w) such that the budget leaves exactly t_target of skin: bisection on build's mass bookkeeping
    (the mesh is built once per call: cheap compared with the solve)"""
    lo, hi = 0.05, 2.0
    for it in range(30):
        w = 0.5 * (lo + hi); dd = dict(d, w=w, hr=aspect * w); dd.pop('t', None)
        _, info = l1fe.build(dict(dd, _massonly=True)) if False else (None, None)
        info = mass_only(dd)
        if info['t'] > t_target: lo = w
        else: hi = w
        if hi - lo < 1e-4: break
    return 0.5 * (lo + hi)


_MCACHE = {}
def mass_only(d):
    """the budget bookkeeping only (no FE): reuses build() up to the skin thickness"""
    import l1geo
    ph = d.get('phase'); key = (d['kind'], round(d.get('lam', 0), 5), d.get('h', 0.9), d.get('rails', True), tuple(ph) if isinstance(ph, list) else ph)
    if key not in _MCACHE:
        ch = l1fe.chart(); m2 = l1geo.build_mesh(ch, d['kind'], d.get('lam', 0.3), h=d.get('h', 0.9), rails=d.get('rails', True), phase=d.get('phase'))
        M3 = l1geo.to3d(ch, m2); _MCACHE[key] = (m2, M3)
    m2, M3 = _MCACHE[key]
    Xo, tri, edges, zs3 = M3['X'], M3['tri'], M3['edges'], M3['zs']
    fn = np.cross(Xo[tri[:, 1]] - Xo[tri[:, 0]], Xo[tri[:, 2]] - Xo[tri[:, 0]]); A_el = 0.5 * np.linalg.norm(fn, axis=1)
    yc = Xo[tri].mean(1)[:, 1]; above = yc > l1geo.y_crease(Xo[tri].mean(1)[:, 2])
    A_lat, A_rim, A_nose = A_el[above].sum(), A_el[~above].sum(), l1fe.nose_area()
    w, hr = d['w'], d['hr']; wm = max(w - hr * np.tan(np.radians(d.get('draft', 0.5))), 0.05)
    Apl, Afil, Lrib = l1fe.rib_plan_volume(m2, Xo, zs3, edges, wm, hr, d.get('r_node', 0.0))
    V_ribs = Apl * hr + Afil * hr + (2 - np.pi / 2) * d.get('r_root', 0.0) ** 2 * Lrib
    e = edges.get('rail', np.zeros((0, 2), int)); P = Xo[e].mean(1); cut = np.abs(P[:, 2] - l1fe.Z_CUT) < 0.3
    L = np.linalg.norm(Xo[e[:, 0]] - Xo[e[:, 1]], axis=1) if len(e) else np.zeros(0)
    V_rails = (L[~cut].sum() * l1fe.RAIL_SIDE[0] * l1fe.RAIL_SIDE[1] + L[cut].sum() * l1fe.RAIL_CUT[0] * l1fe.RAIL_CUT[1]) if d.get('rails', True) else 0.0
    V_avail = (l1fe.BUDGET - l1fe.M_SKATES) / l1fe.RHO - l1fe.V_LEDGE - l1fe.V_BOSS - V_rails - V_ribs
    t = (V_avail - d.get('t_rim_add', 0.0) * (A_rim + A_nose)) / (A_lat + A_rim + A_nose)
    return dict(t=t, Lrib=Lrib, V_ribs=V_ribs)


def run(d, buckle=False):
    d = dict(d)
    if 't_target' in d:
        w = solve_rib_for_skin(d, d['t_target'], d['aspect']); d['w'] = round(w, 4); d['hr'] = round(d['aspect'] * w, 4)
    key = l1fe.design_key({k: v for k, v in d.items() if k not in ('label',)})
    f = os.path.join(CACHE, key + '.json')
    if os.path.exists(f):
        r = json.load(open(f))
        if not buckle or 'buckle' in r: return r, True
    t0 = time.time()
    model, info = l1fe.build({k: v for k, v in d.items() if k not in ('t_target', 'aspect', 'label')})
    if model is None:
        r = dict(d=d, info={k: float(v) if isinstance(v, (np.floating,)) else v for k, v in info.items()}, infeasible=True)
    else:
        r, U = l1fe.evaluate(model, buckle=buckle)
        r['d'] = d
    r['key'] = key; r['wall'] = time.time() - t0
    def conv(o):
        if isinstance(o, dict): return {k: conv(v) for k, v in o.items()}
        if isinstance(o, (list, tuple)): return [conv(v) for v in o]
        if isinstance(o, (np.floating,)): return float(o)
        if isinstance(o, (np.integer,)): return int(o)
        if isinstance(o, np.ndarray): return o.tolist()
        return o
    r = conv(r); json.dump(r, open(f, 'w'))
    return r, False


if __name__ == '__main__':
    designs = json.load(open(sys.argv[1])); buckle = '--buckle' in sys.argv
    log = open(sys.argv[1].replace('.json', '.log'), 'a')
    for i, d in enumerate(designs):
        r, cached = run(d, buckle)
        if r.get('infeasible'): msg = f"{i} {d.get('label', '')} infeasible t={r['info'].get('t')}"
        else:
            msg = (f"{i} {d.get('label', '')} {d['kind']} lam={d.get('lam')} w={r['d'].get('w')} hr={r['d'].get('hr')} t={r['info']['t']:.3f} | crown {1e3*r['crown']['defl']:.1f} "
                   f"worst {1e3*r['grid']['worst']:.1f} off {1e3*r['off']['defl']:.1f} palm {1e3*r['palm']['defl']:.2f} squeeze {1e3*r['squeeze']['defl']:.1f} um "
                   f"| use max {max(v.get('skin_use_scf', 0) for v in r['use'].values()):.3f}/{max(v.get('rib_use_scf', 0) for v in r['use'].values()):.3f} "
                   f"{'cached' if cached else '%.0fs' % r['wall']}")
        print(msg, flush=True); log.write(msg + '\n'); log.flush()
