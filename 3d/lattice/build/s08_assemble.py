"""Stage 8: patch binary + assets/lattice.json (everything the JS module and the deck need, numbers included)."""
import json, sys, numpy as np
from s06_export import *

man = json.load(open(os.path.join(WORK, 'manifest.json')))
fill = json.load(open(os.path.join(WORK, 'fillet.json')))
L = json.load(open(os.path.join(WORK, 'layout.json')))
fe = json.load(open(os.path.join(WORK, 'fe_results.json')))
vol = json.load(open(os.path.join(WORK, 'vol_final.json')))

# ---- patch (tri, body) ----
HAVE_PATCH = os.path.exists(os.path.join(WORK, 'mesh_patch_patch.npz')) and '--nopatch' not in sys.argv
Fd = Field('tri', 1.0); S = Fd.S; orders = np.array([m['order'] for m in Fd.meta])
d = np.load(os.path.join(WORK, 'mesh_patch_patch.npz')) if HAVE_PATCH else dict(V=np.zeros((3, 3), np.float32), F=np.array([[0, 1, 2]]))
V, F = d['V'], d['F']
V2, F2, N2, src = crease_split(V, F)
f, parts = Fd.eval(V2.astype(np.float64), want_parts=True)
eta = np.clip(parts['eta'], 0, 3.0); memb = parts['memb']
order = np.where(memb >= 0, orders[np.maximum(memb, 0)], 0.0)
outer = (parts['D'] > -0.35 * wall_T(V2)).astype(np.uint8) * 255
W = Writer(os.path.join(ASSETS, 'lattice_patch.bin'))
W.add('patch.position', V2.astype(np.float32), 'f32', 3)
W.add('patch.normal', np.round(N2 * 32767).astype(np.int16), 'i16', 3, True)
W.add('patch.index', F2.astype(np.uint32), 'u32', 1)
W.add('patch.aEta', np.round(eta / 3.0 * 255).astype(np.uint8), 'u8', 1, True)
W.add('patch.aWallN', np.round(parts['nin'] * 127).astype(np.int8), 'i8', 3, True)
W.add('patch.aOrder', np.round(np.clip(order, 0, 1) * 255).astype(np.uint8), 'u8', 1, True)
W.add('patch.aOuter', outer, 'u8', 1, True)
for case, nm in (('press', 'aSP'), ('squeeze', 'aSS')):
    smp = fe_samplers('tri', case, Fd.ext, S)
    dr, ir = smp['rib'][0].query(V2, k=1); dw, iw = smp['wall'][0].query(V2, k=1)
    onrib = (parts['eta'] > 0.12) & (dr < 2.2)
    val = smooth_vals(F2, np.where(onrib, smp['rib'][1][ir], smp['wall'][1][iw]), 3)
    W.add('patch.' + nm, np.clip(np.round(val / ST_RANGE[case] * 254), 0, 254).astype(np.uint8), 'u8', 1, True)
man['patch'] = W.save() if HAVE_PATCH else None; man['meshes']['patch'] = dict(vertices=int(len(V2)), triangles=int(len(F2)))
print('patch', len(V2), len(F2))

rho = P['rho']
def g(mm3): return round(mm3 * rho / 1000.0, 2)
masses = {
    'density_g_cm3': rho,
    'tri': dict(wall_body_mm3=vol['tri']['wall_body'], ribs_body_mm3=vol['tri']['ribs_body'], wall_triggers_mm3=vol['tri']['wall_trig'], ribs_triggers_mm3=vol['tri']['ribs_trig'],
                body_g=g(vol['tri']['wall_body'] + vol['tri']['ribs_body']), triggers_g=g(vol['tri']['all_trig']), ribs_body_g=g(vol['tri']['ribs_body']), wall_body_g=g(vol['tri']['wall_body']),
                total_g=g(vol['tri']['wall_body'] + vol['tri']['ribs_body'] + vol['tri']['all_trig'])),
    'hex': dict(wall_body_mm3=vol['hex']['wall_body'], ribs_body_mm3=vol['hex']['ribs_body'], ribs_triggers_mm3=vol['hex']['ribs_trig'],
                body_g=g(vol['hex']['wall_body'] + vol['hex']['ribs_body']), triggers_g=g(vol['hex']['all_trig']), ribs_body_g=g(vol['hex']['ribs_body']),
                total_g=g(vol['hex']['wall_body'] + vol['hex']['ribs_body'] + vol['hex']['all_trig']), width_scale=vol['hex'].get('wscale')),
    'note': 'derived, this model: field-integrated volumes of the moulded geometry (0.11 mm grid) x Pyrofil PP-C-20A 1.01 g/cm3; inserts, screws, skates not included',
}
summ = {}
for kind in ('tri', 'hex', 'hex_eqbeam', 'none', 'thick'):
    r = fe[kind]
    summ[kind] = {c: dict(k=round(r[c]['stiffness_N_per_mm'], 1), defl_um=round(1000 * r[c]['defl_mm'], 1), wall_p99=round(r[c]['wall_vm_p99'], 2),
                         rib_max=round(r[c].get('rib_sig_max', float('nan')), 2) if 'rib_sig_max' in r[c] else None,
                         rib_p99=round(r[c].get('rib_sig_p99', float('nan')), 2) if 'rib_sig_p99' in r[c] else None) for c in ('press', 'press_off', 'squeeze')}
out = dict(
    version=1, units='mm', axes='+Y up, +Z forward; +X is the scan side carrying the side buttons (right-handed => user\'s left)',
    tri=man['tri'], hex=man['hex'], patch=man['patch'], meshes=man['meshes'],
    layout=dict(bosses=L['bosses'], ties=[t for t in L['ties'] if np.all(np.isfinite(t['p']))], skates=L['skates'], skate_d=L['skate_d'], skate_h=L['skate_h'],
                pcb=L['pcb'], usb=L['usb'], wheel=L['wheel'], y_rim=L['y_rim'], seam=L['seam']),
    params={k: P[k] for k in ('a', 'w_top', 'w_bot', 'r_top', 'r_bot', 'h_min', 'h_max', 'draft_deg', 'tip_r', 'T_top', 'T_bot', 'gap', 'pcb_y0', 'pcb_t', 'boss_od', 'bore_d', 'insert_od', 'insert_len', 'E', 'nu', 'rho')},
    masses=masses,
    fe=dict(summary=summ, crown=fe['meta']['crown'], nodes=fe['meta']['fe_nodes'], shells=fe['meta']['fe_shells'], label='derived, this model',
            method=fe['meta']['note'], cases=dict(press='10 N down on the crown over a 10 mm pad', press_off='same, 7 mm right and 6 mm forward', squeeze='10 N inward on each side at the grip (y 15, z -8)')),
    stressScale=dict(ramp=['#26272b', '#5b4314', '#a8730b', '#fdc316', '#fff2c2'], range=ST_RANGE, unit='MPa', label='derived, this model'),
    fillet=fill,
)
jdump(out, os.path.join(ASSETS, 'lattice.json'))
print('wrote assets/lattice.json', os.path.getsize(os.path.join(ASSETS, 'lattice.json')))
