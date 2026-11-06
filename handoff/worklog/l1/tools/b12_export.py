"""L1: the slides' data. Reads every cached design (out/cache/*.json), the fillet study and the winner's geometry, and writes
the block between /* B12-DATA-BEGIN */ and /* B12-DATA-END */ in deck/src/30-b12-latopt.js (and out/b12-data.json).

Per design (all at the 9.35 g budget, mesh h 0.9): the flex under the worst of the 25 hard presses round the crown (10 N,
10 mm pad), the crown, off-centre, palm (4.4 N) and squeeze (10 N) flexes, and the peak share of strength used at 10 N
(F41.1) with the root fillet's stress concentration on the lattice's skin and ribs (the fillet study's SCF at the design's
r/t), the rails and the cutout corners as solved. Within the moulding limits = skin >= 0.60 (F20.3), rib <= 0.6 skin
(Protolabs, Xometry), rib depth <= 3 skin (Beall 2000, DFMPro).
Usage: python3 b12_export.py [--geo]   (--geo also projects each topology's ribs to the top view: builds 5 meshes)
"""
import json, glob, os, sys, re, numpy as np
sys.path.insert(0, '/home/claude/work/l1/fe')
CACHE = '/home/claude/work/l1/out/cache'; OUT = '/home/claude/work/l1/out'
SLIDE = '/home/claude/theseus/deck/src/30-b12-latopt.js'
KINDS = ['tri', 'kagome', 'square', 'diamond', 'hex', 'none', 'plain']   # none = the plain wall with the rails; plain = without


def scf_root(rt):
    """the root fillet's SCF at r/t, from the fillet study on the winner's section (falls back to the first section)"""
    for f in (f'{OUT}/fillet_root_t0.60_w0.36_h1.80.json', f'{OUT}/fillet_root.json'):
        if os.path.exists(f):
            F = json.load(open(f)); R = np.array([r['r_over_t'] for r in F['rows']]); S = np.array([r['scf'] for r in F['rows']])
            return float(np.interp(rt, R, S))
    return 1.0


def peak_use(r):
    """the peak share of strength used over the 10 N cases, as solved (skin, ribs, rails; no fillet factor): the same rule
    for every design. The winner's fillet-included peak is solved element by element in winK.py (out/winK.json)."""
    best = 0.0; where = ''
    for c, u in r['use'].items():
        if c == 'palm': continue
        cand = [(u['skin_use'], 'skin'), (u.get('rib_use', 0), 'rib'), (u.get('rail_use', 0), 'rail')]
        if 'skin_use_field' in u and u['skin_use'] <= max(u['skin_use_field'], u['skin_use_crease'], u['skin_use_corner']) + 1e-9:
            z = max((u['skin_use_field'], 'field'), (u['skin_use_crease'], 'crease'), (u['skin_use_corner'], 'corner'))
            cand[0] = (u['skin_use'], 'skin-' + z[1])
        v, wh = max(cand)
        if v > best: best, where = v, f'{wh}:{c}'
    return best, where


def load():
    R = []
    for f in glob.glob(os.path.join(CACHE, '*.json')):
        r = json.load(open(f))
        if r.get('infeasible') or 'grid' not in r: continue
        R.append(r)
    return R


def row(r):
    d = r['d']; i = r['info']; u, where = peak_use(r)
    # the map's strength: the ribs' and rails' peak (beams: no single-element junction spikes); a wall with neither, its skin
    cs = [c for c in r['use'] if c != 'palm']
    ub = max(max(r['use'][c].get('rib_use', 0), r['use'][c].get('rail_use', 0)) for c in cs)
    if ub <= 0: ub = max(r['use'][c]['skin_use'] for c in cs)
    t = i['t']; w = d.get('w') or 0; hr = d.get('hr') or 0
    ok = (t >= 0.594) and (w <= 0.606 * t) and (hr <= 3.03 * t) if w else True     # the guides' rules of thumb, 1 % tolerance
    return dict(label=d.get('label', ''), kind=d['kind'] if d.get('rails', True) or d['kind'] != 'none' else 'plain', rails=d.get('rails', True),
                lam=d.get('lam'), t=t, w=w, hr=hr, r=d.get('r_root', 0), h=d.get('h', 0.9), phase=d.get('phase'), draft=d.get('draft', 0.5),
                worst=1e3 * r['grid']['worst'], crown=1e3 * r['crown']['defl'], off=1e3 * r['off']['defl'], palm=1e3 * r['palm']['defl'],
                sq=1e3 * r['squeeze']['defl'], use=u, ub=ub, where=where, ok=bool(ok), buckle=r.get('buckle'),
                trip=min((v.get('trip_factor', 1e9) for v in r['use'].values()), default=1e9), g_ribs=i.get('g_ribs', 0))


def rib_lines_top(d):
    """the design's rib (and crease) lines projected to the top view (key-plan frame: x, y = -z), merged into polylines"""
    import l1fe, l1geo
    ch = l1fe.chart(); m2 = l1geo.build_mesh(ch, d['kind'], d['lam'], h=1.5, rails=True, phase=d.get('phase')); M3 = l1geo.to3d(ch, m2)
    X, edges = M3['X'], M3['edges']
    out = {}
    for tg in ('rib', 'crease'):
        E = edges.get(tg, np.zeros((0, 2), int))
        # chain edges into polylines (nodes of degree 2 continue a line when the turn is small)
        from collections import defaultdict
        adj = defaultdict(list)
        for a, b in E: adj[int(a)].append(int(b)); adj[int(b)].append(int(a))
        used = set(); lines = []
        def P(i): return (round(float(X[i, 0]), 2), round(float(-X[i, 2]), 2))
        def straight(a, b, c):
            u = X[b] - X[a]; v = X[c] - X[b]; return np.dot(u, v) / (np.linalg.norm(u) * np.linalg.norm(v) + 1e-12) > 0.97
        for a, b in E:
            a, b = int(a), int(b)
            if (min(a, b), max(a, b)) in used: continue
            used.add((min(a, b), max(a, b))); line = [a, b]
            for end in (0, 1):
                while True:
                    cur = line[-1] if end else line[0]; prev = line[-2] if end else line[1]
                    nx = [n for n in adj[cur] if (min(cur, n), max(cur, n)) not in used and straight(prev, cur, n)]
                    if len(nx) != 1 and not (len(nx) >= 1 and len(adj[cur]) == 2): break
                    n = nx[0]; used.add((min(cur, n), max(cur, n)))
                    if end: line.append(n)
                    else: line.insert(0, n)
            lines.append([P(i) for i in line])
        # thin points (keep ends; every point when the line bends)
        out[tg] = [[list(p) for p in ln] for ln in lines]
    return out


if __name__ == '__main__':
    R = [row(r) for r in load()]
    base = [x for x in R if x['kind'] == 'none' and x['rails'] and abs(x['h'] - 0.9) < 1e-6][0]
    plain = [x for x in R if x['kind'] == 'plain' and abs(x['h'] - 0.9) < 1e-6][0]
    # the final model (the sloped crease, stage F) when it has landed; the buckling run relabels its cache entry 'Gb-win'
    FINAL = any(x['label'] in ('F-tri-t0.60', 'Gb-win') for x in R)
    win = [x for x in R if x['label'] in (('F-tri-t0.60', 'Gb-win') if FINAL else ('C2-tri-t0.60', 'Db-win'))][0]
    tri = [x for x in R if x['label'] == ('F-kagome-t0.60' if FINAL else 'C2-kagome-t0.60')]
    replaced = ('C2-', 'D7-') if FINAL else ()
    pts = [x for x in R if abs(x['h'] - 0.9) < 1e-6 and x['phase'] is None and not x['label'].startswith(('Db', 'Gb', 'D6', 'G-') + replaced)]
    if FINAL and win not in pts: pts.append(win)
    # the fine mesh (h 0.55, the final crease) when it has landed: the winner, the plain walls, the patterns and the depths
    FINE = any(x['label'] == 'G-win-h0.55' for x in R)
    coarse = dict(win=win, base=base, plain=plain)
    if FINE:
        L_ = {x['label']: x for x in R}
        win = L_['G-win-h0.55']; base = L_.get('G-plain+rails-h0.55', base); plain = L_.get('H-plain-h0.55', plain)
        tri = [L_[k] for k in ('H-kagome-t0.60',) if k in L_] or tri
        # the coarse-to-fine ratio of the worst-press flex against rib depth (measured pairs), and for the plain walls
        cw = L_.get('F-tri-t0.60') or L_['Gb-win']          # the coarse winner (the buckling run relabels its cache entry)
        pairs = [(cw['hr'], win['worst'] / cw['worst'])]
        for hrs in ('0.6', '1.0', '1.4', '2.2', '2.6'):
            if f'H-depth{hrs}' in L_ and f'F-depth{hrs}' in L_: pairs.append((L_[f'F-depth{hrs}']['hr'], L_[f'H-depth{hrs}']['worst'] / L_[f'F-depth{hrs}']['worst']))
        pairs.sort(); fac_hr = lambda hr: float(np.interp(hr, [p[0] for p in pairs], [p[1] for p in pairs]))
        fac_base = base['worst'] / coarse['base']['worst']; fac_plain = plain['worst'] / coarse['plain']['worst']
        fine_pts = [win] + [x for x in R if x['label'].startswith('H-') and x['label'] != 'H-plain-h0.55']
        bg = [x for x in R if abs(x['h'] - 0.9) < 1e-6 and x['phase'] is None and x['kind'] not in ('none', 'plain')
              and not x['label'].startswith(('Db', 'Gb', 'D6', 'G-', 'E-', 'D5', 'F-'))]
        bgv = [[KINDS.index(x['kind']), round(x['worst'] * fac_hr(x['hr']), 1), round(x['ub'], 3)] for x in bg]
    js = dict(g=9.35, base=base, plain=plain, win=win, final=FINAL, fine=FINE, triLabel=tri[0]['label'] if tri else None)
    if FINE: js.update(bg=bgv, facPairs=[[round(a, 3), round(b, 4)] for a, b in pairs], facBase=round(fac_base, 4), facPlain=round(fac_plain, 4),
                       coarse={k: dict(worst=round(v['worst'], 1), crown=round(v['crown'], 1), off=round(v['off'], 1), palm=round(v['palm'], 2), sq=round(v['sq'], 1)) for k, v in coarse.items()})
    if os.path.exists(f'{OUT}/winK.json'):
        WK = json.load(open(f'{OUT}/winK.json'))
        wkey = 'F-tri-t0.60' if (FINAL and 'F-tri-t0.60' in WK) else 'C2-tri-t0.60'
        if wkey in WK:
            w = WK[wkey]; Kw = w['K']
            # the root's nominal stress: the skin's field peak at a rib line (junctions with the rails and the crease aside),
            # without the fillet's factor; the rib's own peak (a beam: its extreme fibre) and the rails'
            Z = w.get('zones') or {}
            win['rootNom'] = max((z['field'] / Kw if z['field_onrib'] else z['field']) for z in Z.values()) if Z else None
            win['ribPeak'] = max((v['rib_scf'] or 0) for c, v in w['use'].items() if c != 'palm')
            win['railPeak'] = max((v['rail'] or 0) for c, v in w['use'].items() if c != 'palm')
            win['beamPeak'] = win['ub']   # (the fine winner's when FINE: win is the fine row by then)
            win['juncPeak'] = max(z['junc'] for z in Z.values()) if Z else None
            win['juncAt'] = max(Z.values(), key=lambda z: z['junc'])['junc_at'] if Z else None
            win['fieldPeak'] = max(z['field'] for z in Z.values()) if Z else None
    js['pts'] = [[KINDS.index(x['kind']), round(x['worst'], 1), round(x['ub'], 3), 1 if x['ok'] else 0, x['label']] for x in (fine_pts if FINE else pts)]
    # the depth family: flex against rib depth at the winner's cells, the rib at the sink limit, the skin from the budget
    dep = sorted([x for x in R if x['label'].startswith('H-depth' if FINE else 'F-depth' if FINAL else 'D7-depth')] + [win], key=lambda x: x['hr'])
    js['depth'] = [[round(x['hr'], 3), round(x['t'], 4), round(x['w'], 4), round(x['worst'], 1), round(x['use'], 3)] for x in dep]
    js['sens'] = {x['label']: dict(worst=round(x['worst'], 1), t=round(x['t'], 4), w=round(x['w'], 4), hr=round(x['hr'], 4), lam=x['lam'], h=x['h'],
                                   use=round(x['use'], 3), ub=round(x['ub'], 3), where=x['where'], buckle=x['buckle'])
                  for x in R if x['label'].startswith(('D1', 'D2', 'D4', 'D6', 'G'))}
    js['reg'] = {x['label']: round(x['worst'], 1) for x in R if x['label'].startswith('E-')}
    F = None
    for f in (f'{OUT}/fillet_root_t0.60_w0.36_h1.80.json', f'{OUT}/fillet_root.json'):
        if os.path.exists(f): F = json.load(open(f)); js['filsec'] = [F['t'], F['w'], F['h']]; break
    js['fil'] = [[r['r_over_t'], round(r['scf'], 3), round(r['D_over_t'], 3)] for r in F['rows']] if F else []
    if js['fil'] and win.get('rootNom'):
        R_ = np.array([f[0] for f in js['fil']]); S_ = np.array([f[1] for f in js['fil']])
        # the fillet: if the root (its nominal stress x the fillet's factor) stays under the structure's own peak (ribs, rails)
        # across the guides' band (0.25 to 0.4 skins), strength doesn't set it: take the band's top (the lowest factor the band
        # allows before the junction thickens toward a sink); else the smallest radius in the band that keeps it under
        need = win['beamPeak'] / win['rootNom']; band = np.linspace(0.25, 0.40, 151); sc = np.interp(band, R_, S_)
        rt = 0.40 if (sc <= need).all() else float(band[np.argmax(sc <= need)]) if (sc <= need).any() else 0.40
        win['rPickT'] = rt; win['rPick'] = round(rt * F['t'], 2); win['scfPick'] = round(float(np.interp(rt, R_, S_)), 3)
        win['rootAtPick'] = round(win['rootNom'] * win['scfPick'], 4)
    if '--geo' in sys.argv:
        geo = {}
        for k in ('tri', 'kagome', 'square', 'diamond', 'hex'):
            d = [x for x in R if x['label'] == f'C2-{k}-t0.60'][0]
            geo[k] = rib_lines_top(dict(kind=k, lam=d['lam']))
            print(k, len(geo[k]['rib']), 'rib lines', sum(len(l) for l in geo[k]['rib']), 'points', flush=True)
        json.dump(geo, open(f'{OUT}/b12-geo.json', 'w'))
    json.dump(js, open(f'{OUT}/b12-data.json', 'w'), indent=1)
    print('designs', len(pts), 'base', round(base['worst'], 1), 'win', round(win['worst'], 1), 'use', round(win['use'], 3), win['where'])
