"""Write the numbers section of README.md from assets/lattice.json (so the prose can't drift from the data)."""
import json, re
from common import *
L = json.load(open(os.path.join(ASSETS, 'lattice.json')))
fe = json.load(open(os.path.join(WORK, 'fe_results.json')))
m = L['masses']; t, h = m['tri'], m['hex']; rho = m['density_g_cm3']
g = lambda mm3: mm3 * rho / 1000
out = []
out.append('## Mass (derived, this model)\n')
out.append('Moulded volumes integrated from the field on the 0.13 mm meshing grid (0.11 and 0.15 mm runs agree within 0.03 %) × Pyrofil PP-C-20A 1.01 g/cm³. Inserts, screws, skates, PCB not included.\n')
out.append('| | wall mm³ | ribs mm³ | total g |')
out.append('|---|---:|---:|---:|')
out.append(f"| body, triangles | {t['wall_body_mm3']:.0f} | {t['ribs_body_mm3']:.0f} | {t['body_g']:.2f} |")
out.append(f"| body, hexagons (walls ×{h['width_scale']:.3f} wide) | {h['wall_body_mm3']:.0f} | {h['ribs_body_mm3']:.0f} | {h['body_g']:.2f} |")
out.append(f"| two triggers, triangles | {t['wall_triggers_mm3']:.0f} | {t['ribs_triggers_mm3']:.0f} | {t['triggers_g']:.2f} |")
out.append(f"| **shell + triggers, triangles** | {t['wall_body_mm3'] + t['wall_triggers_mm3']:.0f} | {t['ribs_body_mm3'] + t['ribs_triggers_mm3']:.0f} | **{t['total_g']:.2f}** |")
out.append(f"\nEqual mass: body rib volume triangles {t['ribs_body_mm3']:.1f} mm³ vs hexagons {h['ribs_body_mm3']:.1f} mm³ "
           f"({100 * (h['ribs_body_mm3'] / t['ribs_body_mm3'] - 1):+.2f} %); same wall field. The hexagon triggers differ by "
           f"{h['ribs_triggers_mm3'] - t['ribs_triggers_mm3']:+.0f} mm³ (not in the structural model).\n")
S = L['fe']['summary']; meta = fe['meta']
out.append('## Structure (derived, this model)\n')
out.append(f"Linear stiffened-shell finite elements on the shell body ({meta['fe_nodes']} nodes, {meta['fe_shells']} shells): flat CST + DKT "
           "facets on the wall mid-surface with the graded thickness, every rib an eccentric 3D beam on a mesh edge (the mesh is the "
           "lattice refined ×12, so triangle and hexagon ribs both lie on edges), rim flange / rails / nose as beams, bosses as stiff "
           "links, the PCB stand-in as a 1.0 mm FR4 plate screwed at the 4 bosses and tied to the rib feet, the 8 skates as supports. "
           "E = 13.5 GPa, ν = 0.35 (CF-PP datasheet modulus). Element library checked against textbook plates (simply supported and "
           "clamped, uniform and point load: within 0.5 %), a membrane strip, a cantilever and a ribbed T-strip (0.14 %). Mesh check: "
           "the triangle/hexagon stiffness ratio moved < 0.03 between refinement ×6 and ×12.\n")
out.append('| 10 N | triangles | hexagons, equal moulded mass | hexagons, equal straight-rib volume | wall only | plain wall, equal total mass |')
out.append('|---|---:|---:|---:|---:|---:|')
for case, lab in (('press', 'press on the crown, N/mm'), ('press_off', 'press 7 mm right / 6 mm fwd, N/mm'), ('squeeze', 'squeeze at the grip, N/mm')):
    out.append(f"| {lab} | **{S['tri'][case]['k']:.0f}** | {S['hex'][case]['k']:.0f} | {S['hex_eqbeam'][case]['k']:.0f} | {S['none'][case]['k']:.0f} | {S['thick'][case]['k']:.0f} |")
for case, lab in (('press', 'press'), ('squeeze', 'squeeze')):
    out.append(f"| {lab}: rib stress max / P99, MPa | {S['tri'][case]['rib_max']:.1f} / {S['tri'][case]['rib_p99']:.1f} | {S['hex'][case]['rib_max']:.1f} / {S['hex'][case]['rib_p99']:.1f} | "
               f"{S['hex_eqbeam'][case]['rib_max']:.1f} / {S['hex_eqbeam'][case]['rib_p99']:.1f} | – | – |")
    out.append(f"| {lab}: wall von Mises P99, MPa | {S['tri'][case]['wall_p99']:.2f} | {S['hex'][case]['wall_p99']:.2f} | {S['hex_eqbeam'][case]['wall_p99']:.2f} | {S['none'][case]['wall_p99']:.2f} | {S['thick'][case]['wall_p99']:.2f} |")
r = lambda c, a, b: S[a][c]['k'] / S[b][c]['k']
out.append(f"\nAt equal rib mass the triangle lattice is **{r('press', 'tri', 'hex'):.2f}×** as stiff as the hexagons under the crown press, "
           f"{r('press_off', 'tri', 'hex'):.2f}× off-centre and {r('squeeze', 'tri', 'hex'):.2f}× in squeeze ({r('press', 'tri', 'hex_eqbeam'):.2f}–{r('squeeze', 'tri', 'hex_eqbeam'):.2f}× if the "
           f"hexagons get the fillet volume back as straight rib), with {100 * (1 - S['tri']['press']['rib_max'] / S['hex']['press']['rib_max']):.0f} % lower peak rib stress under the press. "
           f"The ribbed shell is {r('press', 'tri', 'none'):.1f}× the bare wall and {r('press', 'tri', 'thick'):.2f}× a plain wall of the same total mass "
           f"(thickened ×{fe['thick']['wall_thickness_factor']:.2f}) in press, {r('squeeze', 'tri', 'thick'):.2f}× in squeeze. The topology gap is much smaller than "
           "for a perforated panel (the deck's 2D lattice slide) because a solid skin carries the membrane load either way. "
           "Stresses at 10 N are far below the material's strength; they are for comparison, not a margin.\n")
txt = open(os.path.join(ROOT, 'README.md')).read()
txt = re.sub(r'<!-- numbers:start -->.*<!-- numbers:end -->', '<!-- numbers:start -->\n' + '\n'.join(out) + '\n<!-- numbers:end -->', txt, flags=re.S)
open(os.path.join(ROOT, 'README.md'), 'w').write(txt)
print('\n'.join(out))
