"""L1: the study's final numbers in one citable file (out/results-final.json): Theseus's shell, 9.35 g, the final sloped
crease, mesh 0.55 mm (converged within about 4 %); 10 N cases; strength by F41.1 (120 MPa stretched, 207 bent)."""
import json, glob, os
C = {}
for f in glob.glob('/home/claude/work/l1/out/cache/*.json'):
    r = json.load(open(f)); lab = r.get('d', {}).get('label')
    if lab: C[lab] = r
def row(lab):
    r = C[lab]; d = r['d']; u = r['use']; cs = [c for c in u if c != 'palm']
    return dict(label=lab, kind_code=d['kind'], lam=d.get('lam'), spacing_mm=round(3 / d['lam'], 2) if d.get('lam') else None, skin_mm=round(r['info']['t'], 3),
                rib_w_mm=d.get('w'), rib_h_mm=d.get('hr'), mesh_mm=d.get('h'),
                flex_um=dict(worst_hard_press=round(1e3 * r['grid']['worst'], 1), crown=round(1e3 * r['crown']['defl'], 1), off_centre=round(1e3 * r['off']['defl'], 1),
                             palm_4p4N=round(1e3 * r['palm']['defl'], 2), squeeze=round(1e3 * r['squeeze']['defl'], 1)),
                strength_used_at_10N=dict(skin=round(max(u[c]['skin_use'] for c in cs), 3), ribs=round(max(u[c].get('rib_use', 0) for c in cs), 3), rails=round(max(u[c].get('rail_use', 0) for c in cs), 3)),
                buckle=r.get('buckle'))
NAMES = {'tri': 'kagome (woven; the code calls it tri)', 'kagome': 'true triangles (the code calls it kagome)', 'square': 'squares', 'diamond': 'diamonds', 'hex': 'hexagons', 'none': 'plain wall'}
out = dict(note=__doc__, names=NAMES,
           winner=row('G-win-h0.55'), plain_wall_with_rails=row('G-plain+rails-h0.55'),
           plain_wall_no_rails=row('H-plain-h0.55') if 'H-plain-h0.55' in C else None,
           patterns=[row(l) for l in ('H-square-t0.60', 'H-diamond-t0.60', 'H-kagome-t0.60', 'G-win-h0.55', 'H-hex-t0.60')],
           depth_family=[row(l) for l in ('H-depth0.6', 'H-depth1.0', 'H-depth1.4', 'G-win-h0.55', 'H-depth2.2', 'H-depth2.6')],
           convergence=dict(winner=[row(l)['flex_um']['worst_hard_press'] for l in ('Gb-win', 'G-win-h0.7', 'G-win-h0.55')],
                            plain_with_rails=[row(l)['flex_um']['worst_hard_press'] for l in ('Gb-plain+rails', 'G-plain+rails-h0.7', 'G-plain+rails-h0.55')], mesh_mm=[0.9, 0.7, 0.55]),
           buckling_h0p9=dict(winner=C['Gb-win'].get('buckle'), plain_with_rails=C['Gb-plain+rails'].get('buckle'), note='load factor x the 10 N case'),
           registration_h0p9=dict(kagome=[92.3, 94.2, 91.1], triangles=[94.2, 94.2, 92.0], note='worst hard press, um, three placements (true translations), level crease'),
           fillets=dict(root_mm=0.24, node_mm=0.22, root_scf=1.472, note='root: 0.4 skins (top of DFMPro 0.25-0.4); node: 60 % of the rib (b06_filletsize rule)'),
           flow_path_mm=105)
json.dump(out, open('/home/claude/work/l1/out/results-final.json', 'w'), indent=1)
print('wrote out/results-final.json'); print(json.dumps(out['winner']['flex_um']), json.dumps(out['plain_wall_with_rails']['flex_um']))
