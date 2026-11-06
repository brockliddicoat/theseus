# Mass estimate: Theseus main PCB + components (+ wheel assembly) vs the Sora V2 "PCB & wheel" (8.29 g, Brock's scale).
#   python3 tools/mass.py            -> prints a markdown table, writes work/mass.json
# Laminate: FR4 1.85 g/cm3 (glass/epoxy, the usual 1.8-1.9 range), board 1.0 mm finished. Copper 8.96 g/cm3:
# outer layers 35 um (1 oz), inner 17.5 um (0.5 oz), areas from the actual pours/planes/traces. Mask 2 x 20 um at
# 1.5 g/cm3. Component masses: typical values for the package class (labelled), or the parts builder's estimate.
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import deps  # noqa: F401  (stand-ins for packages this machine lacks: shim/README.md)
from shapely.ops import unary_union
from layout import build as build_layout
from board_geo import build_board, T
from silk import build_bottom
import board_geo as BG

L = build_layout()
B = build_board(L)
SB = build_bottom(L, B, BG.QR_URL)

core = B['core']                       # outline minus every hole / cut-out
A_core = core.area                     # mm2
A_outline = B['outline'].area
FR4, CU, MASK = 1.85e-3, 8.96e-3, 1.5e-3   # g/mm3
t_out, t_in, t_mask = 0.035, 0.0175, 0.020
cu = {
    'L1 (pour + traces + pads)': (B['l1_copper'].intersection(core).area, t_out),
    'L2 (GND plane)': (B['l2'].intersection(core).area, t_in),
    'L3 (power + long runs)': (unary_union([B['l3'], B['l3_vias']]).intersection(core).area, t_in),
    'L4 (triangle-art pour)': (unary_union([SB['l4'], SB['gold'], SB['tht_rings']]).intersection(core).area, t_out),
}
dielectric_t = T - 2 * t_out - 2 * t_in
m_lam = A_core * dielectric_t * FR4
m_cu = sum(a * t * CU for a, t in cu.values())
m_mask = 2 * A_core * t_mask * MASK
# plated barrels (vias + THT): thin copper tubes, 25 um wall
import math
n_via = len(B['vias'])
m_barrels = n_via * math.pi * 0.2 * T * 0.025 * CU
board = dict(area_outline_mm2=round(A_outline, 1), area_core_mm2=round(A_core, 1), thickness_mm=T,
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
    'ENCM': (1.00, 'DV (hollow-shell estimate of the parts encoder)'), 'BRACKET': (0.26, 'DV (parts support, solid POM)'),
    'ENC': (0.0, '-'), 'TP': (0.0, '-'), 'TPTHT': (0.0, '-'), 'FID': (0.0, '-'),
}
WHEEL_PARTS = ('ENCM', 'BRACKET')       # counted with the wheel, as the Sora's 'PCB & wheel' weighing does
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
