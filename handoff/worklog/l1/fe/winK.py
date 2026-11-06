"""L1: the winner (and the 0.25 /mm alternative) re-evaluated with the root fillet's SCF applied element by element (skin
elements touching a rib line, rib ends at lattice nodes): the honest peak share of strength used. -> out/winK.json
Usage: python3 winK.py K"""
import sys, json, numpy as np
sys.path.insert(0, '/home/claude/work/l1/fe')
import l1fe
K = float(sys.argv[1]) if len(sys.argv) > 1 else 1.51
STAGE = sys.argv[2] if len(sys.argv) > 2 else 'stageC'
C = {d['label']: d for d in json.load(open(f'/home/claude/work/l1/fe/{STAGE}.json'))}
LABS = ('F-tri-t0.60', 'F-kagome-t0.60') if STAGE == 'stageF' else ('C2-tri-t0.60', 'C1-tri-0.25')
import os
OUTF = '/home/claude/work/l1/out/winK.json'
out = json.load(open(OUTF)) if os.path.exists(OUTF) else {}
for lab in LABS:
    d = {k: v for k, v in C[lab].items() if k != 'label'}
    model, info = l1fe.build(d)
    r, U = l1fe.evaluate(model, K_node=K, K_root=K)
    o = {}
    for c, u in r['use'].items():
        o[c] = dict(skin=u['skin_use'], skin_scf=u['skin_use_scf'], rib=u.get('rib_use'), rib_scf=u.get('rib_use_scf'), rail=u.get('rail_use'),
                    hot=u['skin_hot'], onrib=u['skin_hot_onrib'], field=u.get('skin_use_field'), crease=u.get('skin_use_crease'), corner=u.get('skin_use_corner'))
    # junctions: skin elements within 2 mm of a rail (the openings' edges) or of the crease line are where a lattice rib meets
    # an edge rib; their peaks depend on where the pattern lands (registration) and on detail (fillets, alignment) more than
    # on the lattice. Report the field without them, and the junction peak with its place.
    from scipy.spatial import cKDTree
    Xo, tri = model['Xo'], model['tri']; Cc = Xo[tri].mean(1)
    rail_e = model['edges'].get('rail', np.zeros((0, 2), int)); RP = np.vstack([Xo[rail_e].mean(1), Xo[rail_e[:, 0]], Xo[rail_e[:, 1]]]) if len(rail_e) else np.zeros((1, 3)) + 1e9
    d_rail = cKDTree(RP).query(Cc)[0]; d_cr = np.abs(Cc[:, 1] - l1fe.y_crease(Cc[:, 2]))
    junc = (d_rail < 2.0) | (d_cr < 2.0)
    amin, _ = l1fe.quality(Xo, tri); okq = amin >= 12.0
    rib_nodes = set(np.unique(model['rib_e'].ravel()).tolist()) if len(model['rib_e']) else set()
    onrib = np.array([any(int(v) in rib_nodes for v in tr) for tr in tri])
    jx = {}
    for c in ('crown', 'off', 'squeeze'):
        vms, vbs, _ = l1fe.shell_split(model['m'], U[c], 0); use = vms / l1fe.FT + vbs / l1fe.FB; useK = np.where(onrib, use * K, use)
        fm = okq & ~junc; jm = okq & junc
        i_f = int(np.argmax(np.where(fm, useK, -1))); i_j = int(np.argmax(np.where(jm, useK, -1)))
        jx[c] = dict(field=float(useK[i_f]), field_at=Cc[i_f].round(2).tolist(), field_onrib=bool(onrib[i_f]),
                     junc=float(useK[i_j]), junc_at=Cc[i_j].round(2).tolist(), junc_minang=float(amin[i_j]), p99=float(np.percentile(useK[okq], 99)))
    print(lab, 'field/junction', json.dumps({c: (round(v['field'], 3), round(v['junc'], 3), v['junc_at']) for c, v in jx.items()}), flush=True)
    out[lab] = dict(K=K, t=info['t'], use=o, worst=r['grid']['worst'], zones=jx)
    print(lab, json.dumps({c: (round(v['skin_scf'], 3), round(v['rib_scf'] or 0, 3), round(v['rail'] or 0, 3), v['onrib']) for c, v in o.items()}), flush=True)
json.dump(out, open(OUTF, 'w'), indent=1)
