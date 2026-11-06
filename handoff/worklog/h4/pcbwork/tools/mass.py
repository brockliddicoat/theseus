# Mass estimate: Theseus main PCB + components (+ wheel assembly) vs the Sora V2 "PCB & wheel" (8.29 g, Brock's scale).
#   python3 tools/mass.py            -> prints a markdown table, writes work/mass.json
# Laminate: FR4 1.85 g/cm3 (glass/epoxy, the usual 1.8-1.9 range), the board's finished thickness from stackup.py (F47.4:
# 0.6 mm, two layers, 0.5 oz outer copper; plan 5 was first built 1.0 mm, four layers, 1 oz). Copper 8.96 g/cm3 on the
# actual pours/planes/traces (two layers: L1 and L4, the bottom, which carries the art pour, its joints and the bottom
# routes). Mask 2 x 20 um at 1.5 g/cm3. Component masses: typical values for the package class (labelled), or the parts
# builder's estimate; the wheel's encoder and support as drawn in 3d/parts/scrollwheel.js (H3: the lighter encoder and
# the cored support, F47.4).
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import deps  # noqa: F401  (stand-ins for packages this machine lacks: shim/README.md)
from shapely.ops import unary_union
from layout import build as build_layout
from board_geo import build_board, T
from stackup import LAYERS, CU as CU_OUT, CU_IN
from silk import build_bottom
import board_geo as BG

L = build_layout()
B = build_board(L)
SB = build_bottom(L, B, BG.QR_URL)

core = B['core']                       # outline minus every hole / cut-out
A_core = core.area                     # mm2
A_outline = B['outline'].area
FR4, CU, MASK = 1.85e-3, 8.96e-3, 1.5e-3   # g/mm3
t_out, t_in, t_mask = CU_OUT, CU_IN, 0.020
if LAYERS == 4:
    cu = {
        'L1 (pour + traces + pads)': (B['l1_copper'].intersection(core).area, t_out),
        'L2 (GND plane)': (B['l2'].intersection(core).area, t_in),
        'L3 (power + long runs)': (unary_union([B['l3'], B['l3_vias']]).intersection(core).area, t_in),
        'L4 (triangle-art pour)': (unary_union([SB['l4'], SB['gold'], SB['tht_rings']]).intersection(core).area, t_out),
    }
else:
    cu = {
        'L1 (pour + traces + pads)': (B['l1_copper'].intersection(core).area, t_out),
        'L4 (art pour + joints + bottom routes)': (unary_union([SB['l4'], SB['gold'], SB['tht_rings'], B['l3'], B['l3_vias']]).intersection(core).area, t_out),
    }
dielectric_t = T - 2 * t_out - (2 * t_in if LAYERS == 4 else 0.0)
m_lam = A_core * dielectric_t * FR4
m_cu = sum(a * t * CU for a, t in cu.values())
m_mask = 2 * A_core * t_mask * MASK
# plated barrels (vias + THT): thin copper tubes, 25 um wall
import math
n_via = len(B['vias'])
m_barrels = n_via * math.pi * 0.2 * T * 0.025 * CU
board = dict(area_outline_mm2=round(A_outline, 1), area_core_mm2=round(A_core, 1), thickness_mm=T, layers=LAYERS, outer_cu_um=round(t_out * 1000, 1),
             laminate_g=round(m_lam, 3), copper_g=round(m_cu, 3), mask_g=round(m_mask, 3), barrels_g=round(m_barrels, 3),
             copper_areas_mm2={k: round(a, 1) for k, (a, t) in cu.items()}, vias=n_via)
m_board = m_lam + m_cu + m_mask + m_barrels

# components (g each)  label: DS datasheet, TYP typical for the package class, DV derived from geometry, BR Brock's figure
PER_FP = {
    '0402': (0.0010, 'TYP'), '0603': (0.0045, 'TYP'), '0805': (0.010, 'TYP'), 'L2016': (0.015, 'TYP'),
    'QFN32': (0.060, 'TYP'), 'SOT666': (0.003, 'TYP'), 'SOD523': (0.0015, 'TYP'),
    'MODULE': (0.45, 'DV'), 'SENSOR': (0.25, 'TYP'), 'USBC': (0.40, 'TYP'), 'JSTSH3': (0.05, 'TYP'),
    'SLIDE': (0.10, 'TYP'), 'SLIDEB': (0.08, 'TYP'), 'SLIDEE': (0.12, 'TYP'), 'TACT': (0.05, 'TYP'), 'GT01': (0.50, 'TYP'),
    # the wheel assembly's encoder and support (3d/parts/scrollwheel.js), H1: volumes from the part's meshes; the encoder's
    # housing as 0.5 mm shells (the mesh is solid: 1.59 g as modelled), the support solid POM (0.26 g as modelled)
    # F47.4 (H3): the lighter encoder (its nickel-silver frame dropped) and the cored support, as drawn (ENC_DRAWN, SUP_DRAWN
    # below: the 3D part's own volumes); plan 5 was first built with ~1.0 g (hollow-shell estimate) and 0.26 g (solid POM)
    'ENCM': (None, 'DV (the lighter encoder as drawn, 3d/parts/scrollwheel.js: volumes x densities)'),
    'BRACKET': (None, 'DV (the cored support as drawn, 3d/parts/scrollwheel.js: POM volume x 1.42)'),
    'ENC': (0.0, '-'), 'TP': (0.0, '-'), 'TPTHT': (0.0, '-'), 'FID': (0.0, '-'),
}
WHEEL_PARTS = ('ENCM', 'BRACKET')       # counted with the wheel, as the Sora's 'PCB & wheel' weighing does
# the encoder and the support as drawn (H3, F47.4): grams from 3d/parts/scrollwheel.js's own meshes (WHEEL_SPEC.mass:
# each part's volume x its material's density, written to 3d/parts/tools/wheel-mass.json from the part's own spec
# (encoderMass_g, supportMass_g); parts README "Lighter encoder, cored support"). Plan 5 as first built:
# encoder ~1.0 g (0.5 mm housing shells + the nickel-silver frame), support 0.26 g (solid POM)
_WM = os.path.join(HERE, '..', '..', 'parts', 'tools', 'wheel-mass.json')
_spec = json.load(open(_WM)) if os.path.exists(_WM) else {}
ENC_DRAWN = round(_spec.get('encoder_g', 0.45), 3)
SUP_DRAWN = round(_spec.get('support_g', 0.16), 3)
PER_FP['ENCM'] = (ENC_DRAWN, PER_FP['ENCM'][1] if _spec else 'DV (estimate until drawn: ~0.45 g)')
PER_FP['BRACKET'] = (SUP_DRAWN, PER_FP['BRACKET'][1] if _spec else 'DV (estimate until drawn: ~0.16 g)')
rows = []
from collections import Counter
cnt = Counter(c['fp'] for c, fp in L['comps'])
for fpn, n in sorted(cnt.items()):
    m, lab = PER_FP.get(fpn, (0.0, '?'))
    if m:
        rows.append(dict(item=fpn, n=n, each_g=m, total_g=round(m * n, 4), label=lab, wheel=fpn in WHEEL_PARTS))
extra = [
    dict(item='Mill-Max 3305 receptacle (6)', n=6, each_g=0.03, total_g=0.18, label='DV (geometry; Brock: 0.11 g each)', wheel=False),
    dict(item='clip-on lens (PC)', n=1, each_g=0.07, total_g=0.07, label='DV', wheel=False),
    dict(item='solder (paste + fillets)', n=1, each_g=0.06, total_g=0.06, label='TYP', wheel=False),
    dict(item='wheel: six-arm magnesium AZ31B (parts builder)', n=1, each_g=0.900, total_g=0.900, label='DV (parts spec massEstimate_g)', wheel=True),
    dict(item='axle (POM, parts builder)', n=1, each_g=0.116, total_g=0.116, label='DV (parts spec axleMass_g)', wheel=True),
]
rows += extra
m_comp_board = sum(r['total_g'] for r in rows if not r['wheel'])
m_wheel = sum(r['total_g'] for r in rows if r['wheel'])
mm_brock = 6 * (0.11 - 0.03)
total = m_board + m_comp_board + m_wheel
# the centre of mass (H1, for the mouse's balance): the laminate, copper and mask at the core's centroid, each part at its
# place, the wheel assembly at the axle (layout z 37.75), the Mill-Max sockets under the switches, the lens on the sensor
comp = {c['ref']: c for c, fp in L['comps']}
cx, cz = core.centroid.x, core.centroid.y
mom = [(m_board, cx, cz)]
for c, fp in L['comps']:
    m, _ = PER_FP.get(c['fp'], (0.0, ''))
    if m: mom.append((m, c['x'], c['z']))
mom += [(0.09, comp['SW1']['x'], comp['SW1']['z']), (0.09, comp['SW2']['x'], comp['SW2']['z']), (0.07, comp['U3']['x'], comp['U3']['z']),
        (0.06, cx, cz), (0.900 + 0.116, 0.0, 37.75)]
M_ = sum(m for m, x, z in mom)
com = dict(x=round(sum(m * x for m, x, z in mom) / M_, 2), z=round(sum(m * z for m, x, z in mom) / M_, 2), g=round(M_, 3),
           frame='layout (x = the user\'s right, z = nose); mouse z = z - 2.88', core_centroid=[round(cx, 2), round(cz, 2)])
out = dict(board=board, board_g=round(m_board, 3), components=rows, components_on_board_g=round(m_comp_board, 3),
           wheel_assembly_g=round(m_wheel, 3), total_g=round(total, 2), total_with_brock_millmax_g=round(total + mm_brock, 2),
           sora_v2_pcb_and_wheel_g=8.29, com=com,
           note='Theseus total = board + every on-board part + wheel assembly (wheel, axle, encoder, support); excludes battery '
                'lead/plug and side-button lead (not part of the Sora 8.29 g either). Typical masses are for the package class, '
                'not weighed parts.')
os.makedirs(os.path.join(HERE, '..', 'work'), exist_ok=True)
json.dump(out, open(os.path.join(HERE, '..', 'work', 'mass.json'), 'w'), indent=1)
print('| item | qty | each (g) | total (g) | basis |\n|---|---:|---:|---:|---|')
print('| board laminate (FR4 1.85 g/cm3, %.3f mm dielectric x %.0f mm2) | 1 | | %.2f | DV |' % (dielectric_t, A_core, m_lam))
print('| copper L1-L4 + barrels | | | %.2f | DV |' % (m_cu + m_barrels))
print('| solder mask (2 x 20 um) | | | %.2f | DV |' % m_mask)
for r in rows:
    print('| %s | %d | %.4g | %.3f | %s |' % (r['item'], r['n'], r['each_g'], r['total_g'], r['label']))
print('| **board + components** | | | **%.2f** | |' % (m_board + m_comp_board))
print('| **+ wheel assembly (wheel, axle, encoder, support) = total** | | | **%.2f** (%.2f with Brock\'s 0.11 g Mill-Max) | |' % (total, total + mm_brock))
print('| Sora V2 PCB + wheel (Brock\'s scale) | | | 8.29 | measured |')
print(json.dumps(board, indent=1))
print('centre of mass', json.dumps(com))

# ------------------------------------------------------------------ F42.2 + F47.4: the board's 5.6 g target and the path
# Brock (F42.2): "Keep 5.6 g as target": the film stays at 29.31 g and calls the board's figure a target; the board gets built
# to it, the wheel's encoder and support inside it. Brock (F47.4): its path is "0.6 mm, 5.63 g": a 0.6 mm two-layer board,
# half-ounce outer copper, a lighter encoder (its nickel-silver frame dropped) and a cored support. The model above is now
# that board as built (stackup.py; re-routed on two layers, H3). The path below starts from plan 5 as first built (1.0 mm,
# four layers, 1 oz outer: its own areas, REF, from mass.py's run of 2026-11-06 10:14) and takes each step at those areas;
# its last line is the re-route itself (the bottom's routes, the art pour's joints, the moved vias): the difference between
# the path's prediction at the old areas and the board as built.
TARGET_G = 5.6
REF = dict(T=1.0, layers=4, outer=0.035, inner=0.0175, A_core=1703.1, A_L1=1232.9, A_L2=1425.6, A_L3=117.1, A_L4=1068.5,
           mask_g=0.102, barrels_g=0.020, enc=1.00, sup=0.26,
           note='plan 5 as first built (H1, 2026-11-06): 1.0 mm, four layers, 1 oz outer, 0.5 oz inner; mass.py 10:14 (H2)')


def bare_ref(Tf, layers=4, outer=0.035):
    """the reference board's bare grams at finished thickness Tf, 4 or 2 layers, outer copper (mm), at its own areas"""
    out_a = REF['A_L1'] + REF['A_L4']
    in_a = REF['A_L2'] + REF['A_L3'] if layers == 4 else 0.0
    diel = Tf - 2 * outer - (2 * REF['inner'] if layers == 4 else 0.0)
    return REF['A_core'] * diel * FR4 + (out_a * outer + in_a * REF['inner']) * CU + REF['mask_g'] + REF['barrels_g'] * Tf / REF['T']


est_board = m_board + m_comp_board                       # the board as built + its on-board parts
est_all = est_board + ENC_DRAWN + SUP_DRAWN              # + the wheel's encoder and support (the 5.6 g covers them: F42.2)
cfg = dict(Tf=1.0, layers=4, outer=0.035, enc=REF['enc'], sup=REF['sup'])
def total(c): return bare_ref(c['Tf'], c['layers'], c['outer']) + m_comp_board + c['enc'] + c['sup']
ref_total = total(cfg)
path, prev = [], ref_total
for label, ch in (('laminate 1.0 -> 0.8 mm finished', dict(Tf=0.8)),
                  ('4 -> 2 layers (no GND plane, no inner power layer; their copper becomes laminate)', dict(layers=2)),
                  ('the lighter encoder as drawn: no nickel-silver frame, 0.4 mm housings', dict(enc=ENC_DRAWN)),
                  ('the cored support as drawn', dict(sup=SUP_DRAWN)),
                  ('laminate 0.8 -> 0.6 mm finished', dict(Tf=0.6)),
                  ('outer copper 1 oz -> 0.5 oz (35 -> 17.5 um)', dict(outer=0.0175))):
    cfg.update(ch); now = total(cfg); path.append(dict(step=label, delta_g=round(now - prev, 3), total_g=round(now, 3))); prev = now
path.append(dict(step='re-routed on two layers, as built (the bottom routes, the art pour\'s joints, the vias)',
                 delta_g=round(est_all - prev, 3), total_g=round(est_all, 3)))
stiff = (T / REF['T']) ** 3                              # bending stiffness goes with the cube of the thickness (same laminate)
target = dict(target_g=TARGET_G, as_built_board_and_parts_g=round(est_board, 2), as_built_with_encoder_and_support_g=round(est_all, 2),
              vs_target_g=round(est_all - TARGET_G, 2), reference_g=round(ref_total, 2), reference=REF['note'], path=path,
              encoder_g=ENC_DRAWN, support_g=SUP_DRAWN,
              stiffness=dict(bending_share=round(stiff, 3), in_plane_share=round(T / REF['T'], 3),
                             note='a plate bends with its thickness cubed (E t^3 / 12): 0.6 mm keeps %.1f %% of the 1.0 mm '
                                  'board\'s bending stiffness; in its own plane (stretching, as the shell\'s tie, b07) it keeps '
                                  '%.0f %%' % (100 * stiff, 100 * T / REF['T'])),
              uncertain=dict(millmax='Brock: 0.11 g each, 6 = 0.66 g (modelled 0.03 each, 0.18): +0.48 g if his figure holds',
                             gt01='0.5 g each is a typical micro switch, not a weighed GT01',
                             encoder='the lighter encoder\'s grams come from its 3D model (volumes x densities), not a weighed part'),
              note='F42.2: the 5.6 g covers the board with everything on it, the wheel\'s encoder and support included. F47.4: the '
                   'path is 0.6 mm, two layers, 0.5 oz outer, the lighter encoder and the cored support.')
out['target'] = target
json.dump(out, open(os.path.join(HERE, '..', 'work', 'mass.json'), 'w'), indent=1)
# the as-built figures the deck reads (H3, 2026-11-06): work/ is the builders' scratch (git-ignored), so the few numbers the
# 2D drawings use go to a committed file beside pcb-layout.json; deck/tools/geo2d/key_parts.py reads it into KEY_PARTS.board
# (BOARD_G in deck/src/03-parts.js: the board with everything the 5.6 g target covers, the encoder and support included)
summary = dict(note='3d/pcb/tools/mass.py (H3, F47.4): the board as built; the 5.6 g target (F42.2) covers the board with '
                    'everything on it, the wheel\'s encoder and support included', thickness_mm=T, layers=LAYERS,
               outer_cu_um=round(t_out * 1000, 1), target_g=TARGET_G, as_built_g=round(est_all, 2),
               board_and_parts_g=round(est_board, 2), bare_board_g=round(m_board, 2), encoder_g=ENC_DRAWN, support_g=SUP_DRAWN,
               bending_share=round(stiff, 3), in_plane_share=round(T / REF['T'], 3))
json.dump(summary, open(os.path.join(HERE, '..', 'pcb-mass.json'), 'w'), indent=1)
print('\n**Target (F42.2): %.1f g** with everything on it. As built (F47.4: %.1f mm, %d layers, %.1f um outer): %.2f g (board and '
      'parts), %.2f g with the encoder and support (%+.2f g against the target).' % (TARGET_G, T, LAYERS, t_out * 1000, est_board, est_all, est_all - TARGET_G))
print('| step | g | total (g) |\n|---|---:|---:|')
print('| plan 5 as first built: 1.0 mm, 4 layers (1 oz outer, 0.5 oz inner), encoder ~1.0 g, support 0.26 g | | %.2f |' % ref_total)
for p in path: print('| %s | %+.2f | %.2f |' % (p['step'], p['delta_g'], p['total_g']))
print('| **target** | | **%.2f** |' % TARGET_G)
print('bending stiffness: %.1f %% of the 1.0 mm board (t^3); in-plane %.0f %% (t)' % (100 * stiff, 100 * T / REF['T']))
