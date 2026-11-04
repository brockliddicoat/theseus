# Theseus — internal lattice (`3d/lattice/`)

The inside of the shell: a graded wall offset from Brock's Sora scan, a **filleted triangle lattice of ribs** laid on the
curved inner surface, **transverse arches** that run from rim to rim over the hump and land on the **M2 heat-set screw
bosses** (#53), **vertical struts** in the low front tied to the trigger support rails (#55), side ribs that come down
to the **PCB edge** with marked tie points (#94), walls and ribs **thicker toward the bottom** (#93), and the same shell
with a **hexagon lattice at equal rib mass** (#75) plus a stiffened-shell **finite-element comparison** of the two.
Everything is one signed-distance field meshed by marching cubes, so the fillets are real geometry (round unions), not
shading.

## Files

| file | what |
|---|---|
| `lattice.js` | ES module: `buildLattice(opts) → THREE.Group` with setters (below) |
| `assets/lattice.json` | manifest + layout (bosses, ties, PCB stand-in, skates, cuts), masses, FE numbers, stress scale, macro camera |
| `assets/lattice_tri.bin` / `lattice_hex.bin` | body + left/right trigger meshes per lattice (positions, crease-split normals, growth/stress attributes, FE load-path segments) |
| `assets/lattice_patch.bin` | 0.035 mm patch around one 6-way crown node for the fillet macro (240k tris) |
| `test.html` | standalone page (URL params below), sets `window.__ready` |
| `shots/` | finals at 2×, paper and night |
| `build/` | the pipeline (Python), stages `s01`…`s09` (+ `field.py` the SDF, `fem.py` element library, `test_fem*.py` validations, `decimate.py`) |
| `tools/shot.mjs`, `tools/shots.sh` | copy of `3d/tools/shot.mjs` with a longer capture timeout (SwiftShader + 600k triangles), and the shot list |

Triangle budget per lattice: body 200k, triggers 30k each (≈ 260k); the macro patch 240k is only drawn inside its box
while `setFilletZoom(k > 0)`.

## How it is built

1. `s01_exterior.py` — exterior signed-distance field on a 0.25 mm grid (libigl, fast winding number for sign). For the
   raw scan it mirrors the button-free half (the scan's side buttons are on +X), closes seams < 1.6 mm (grey opening),
   replaces the wheel slot and the USB port by fitted height fields, flattens the bottom face at y = 0.70 and blurs
   0.3 mm. **Re-run on the shell builder's clean surface:** `python3 build/s01_exterior.py --exterior ../shell/<file>.ply --clean`
   (any closed mesh trimesh can read, mm, our axes; bottom face at `P['y_bottom']`), then run stages 2–8 in order (see
   *Re-running*). The trigger split (`geom.SEAM`) was fitted to the scan's grooves; if the shell builder's split moves,
   edit `SEAM` (rear seam `z = 4.8 + 0.0058 x²`, side seam `y = 27.5 − 0.346 (z − 9)`, steeper past z = 48).
2. `s02_lattice.py` — transverse arches: sections of the inner surface by planes that contain the X direction, spaced
   a·√3/2 along the inner midline (tilted 0.45 × the midline slope over the rear cap so they stay square to it), phased so
   the trigger's rear seam falls midway between two arches. Nodes at arc length (j + k/2)·a from the midline; the net is
   then relaxed on the surface (springs at rest length a, re-projected each step, rim nodes sliding along the wall,
   mirror symmetry enforced). Edge length after relaxation: mean 12.35 mm, sd 1.09 mm, range 7.8–16.1 (a = 12.5).
3. `s03_members.py` — every member as a polyline on the inner surface with per-sample width, height and fillet radius:
   lattice edges (clipped at the rim flange, split at the trigger seams, rear-bottom corner reduced to arch legs),
   the front arch along the trigger's rear seam, trigger support rails along the side seams, trigger edge ribs,
   vertical nose struts, the hexagon twin (the triangle lattice refined ×3, one colour class of nodes removed: hexagon
   wall = a/3 = 4.17 mm, cells 7.2 mm across flats, the same rib length per area as the triangles), bosses on the arch
   feet, PCB stand-in outline, tie points, 8 skates.
4. `s04_mesh.py` / `field.py` — the solid as one SDF: wall `−T(p) ≤ D(p) ≤ 0`; ribs as swept tapered profiles
   (1°/side draft, 0.35 mm tip radius); **fillets by hg_sdf round union** — between rib families (node fillets) and
   between ribs and wall (root fillets; exact quarter circles where they meet at 90°), radius r(p); bosses round-unioned;
   cuts (trigger seam slot 0.45 mm, centre split, wheel slot, USB-C port, insert bores, bottom opening) with 0.1–0.25 mm
   edge breaks. Marching cubes in z-slabs at **0.13 mm** (4.3 M raw triangles for the body), welded, split into
   body / trigger L / trigger R, quadric-decimated in a separate process per part. The same pass integrates the
   moulded volume with and without ribs.
5. `s05_fe.py` — the structural model (below).
6. `s06_export.py` — crease-split normals (50°), per-vertex attributes, binaries.
7. `s07_patch.py` — the macro node, its 22 × 9 × 22 mm box at 0.035 mm, camera and light.
8. `s08_assemble.py` — `assets/lattice.json`.

### Re-running
```
cd 3d/lattice
python3 build/s01_exterior.py [--exterior <clean.ply> --clean]
python3 build/s02_lattice.py && python3 build/s03_members.py
python3 build/s04_mesh.py --kind tri --h 0.15 --vol --nomesh --name vtri          # rib volume, triangles
python3 build/s04_mesh.py --kind hex --h 0.15 --vol --nomesh --name vhex --wscale 0.9
python3 build/s04_mesh.py --kind hex --h 0.15 --vol --nomesh --name vhex2 --wscale 1.0
#   -> pick the hexagon width scale that matches the triangle rib volume (linear), write work/hex_wscale.json
python3 build/s04_mesh.py --kind tri --h 0.13 --vol --name tri
python3 build/s04_mesh.py --kind hex --h 0.13 --vol --name hex --wscale <w>
python3 build/s06b_volumes.py 0 && python3 build/s05_fe.py 12
python3 build/s06_export.py && python3 build/s07_patch.py 0.035 && python3 build/s08_assemble.py && python3 build/s09_readme_numbers.py
sh tools/shots.sh                                                                  # from 3d/: sh lattice/tools/shots.sh
```
Meshing peaks near 2 GB (decimation runs in its own process); at 0.11 mm it was OOM-killed when other builders'
processes shared the machine. Avoid `pkill -f` with patterns that also match your own shell.

## Geometry (all mm)

| item | value |
|---|---|
| wall | 0.90 over the crown → 1.20 at the rim (smoothstep over y = 2 → 16, #93); Protolabs PP floor 0.889 |
| rim flange | 4.2 wide from the outer contour, 1.2 thick, widened into pads under the 8 skates; bottom open (PCB seen from below) |
| lattice | triangles, edge a = 12.5 along the surface, 12 transverse arches rim to rim |
| ribs | root width 1.00 (crown) → 1.20 (rim), draft 1°/side, tip radius 0.35; arch height 1.10 (rim) → 2.00 (crown, the largest span); diagonals 86 % of that |
| fillets | r = 0.60 (crown) → 0.75 (rim) at nodes **and** roots = 0.60–0.63 × the strut width (the deck's FE study: ½–¾ of the strut) |
| front arch | 1.15 × 2.0 rail on the body side of the trigger's rear seam; its legs are the arch at z ≈ 9 that lands on the mid bosses |
| trigger supports | 1.1 × 1.5 rails along the side seams; the arch legs below them are the vertical struts of the low front (#55) |
| nose | 6 vertical struts (x = ±7.7, ±12.2, ±16.6), clear of the USB-C port (9.8 × 3.9, r 1.7, centre y 6.1) |
| bosses | 4 × M2 heat-set: OD 6.2, bore Ø3.2 × 3.6 from below, y 5.0 → 11.2, at (±25.6, −31.8) and (±23.7, 9.3) on the arch feet; nearest skate centre 12.2 mm (5.8 mm edge to edge), so no screw sits under a skate (#52) |
| inserts | brass stand-ins OD 3.5 × 3.0 (parts API `buildHeatSetInsert` sizes), top face at y = 8.05 |
| PCB stand-in | 1.0 FR4 at y 4.0–5.0, edge = inner wall at mid-board inset 1.22 so it bears on the rib tips; 24 tie points (yellow rings) where arch legs and nose struts meet it (#94) |
| skates | 8 × Ø6.5 × 0.65 (parts API sizes), two per corner |
| triggers | separate parts, cut by the seams: same wall, lattice heights 1.15 / 1.0, 1.0 × 1.2 edge ribs, wheel slot 8.8 × 20.2 |

**Measured vs representative.** Exterior: Brock's scan (button-free half mirrored, seams/wheel/port filled) — to be
replaced by the shell builder's surface. Trigger seams: fitted to the scan's grooves. Bosses, ties, PCB outline/height,
skate positions, insert geometry, USB-C opening: **representative** (plausible, not from a drawing); the PCB and parts
builders own the real ones (`assets/lattice.json → layout` is the place to sync them). Lattice, ribs, fillets: **proposal**.

<!-- numbers:start -->
## Mass (derived, this model)

Moulded volumes integrated from the field on the 0.13 mm meshing grid (0.11 and 0.15 mm runs agree within 0.03 %) × Pyrofil PP-C-20A 1.01 g/cm³. Inserts, screws, skates, PCB not included.

| | wall mm³ | ribs mm³ | total g |
|---|---:|---:|---:|
| body, triangles | 11280 | 3754 | 15.18 |
| body, hexagons (walls ×0.881 wide) | 11280 | 3755 | 15.19 |
| two triggers, triangles | 2784 | 1059 | 3.88 |
| **shell + triggers, triangles** | 14064 | 4813 | **19.07** |

Equal mass: body rib volume triangles 3754.1 mm³ vs hexagons 3755.0 mm³ (+0.02 %); same wall field. The hexagon triggers differ by +49 mm³ (not in the structural model).

## Structure (derived, this model)

Linear stiffened-shell finite elements on the shell body (9304 nodes, 18047 shells): flat CST + DKT facets on the wall mid-surface with the graded thickness, every rib an eccentric 3D beam on a mesh edge (the mesh is the lattice refined ×12, so triangle and hexagon ribs both lie on edges), rim flange / rails / nose as beams, bosses as stiff links, the PCB stand-in as a 1.0 mm FR4 plate screwed at the 4 bosses and tied to the rib feet, the 8 skates as supports. E = 13.5 GPa, ν = 0.35 (CF-PP datasheet modulus). Element library checked against textbook plates (simply supported and clamped, uniform and point load: within 0.5 %), a membrane strip, a cantilever and a ribbed T-strip (0.14 %). Mesh check: the triangle/hexagon stiffness ratio moved < 0.03 between refinement ×6 and ×12.

| 10 N | triangles | hexagons, equal moulded mass | hexagons, equal straight-rib volume | wall only | plain wall, equal total mass |
|---|---:|---:|---:|---:|---:|
| press on the crown, N/mm | **499** | 411 | 433 | 125 | 247 |
| press 7 mm right / 6 mm fwd, N/mm | **329** | 276 | 291 | 74 | 150 |
| squeeze at the grip, N/mm | **646** | 541 | 572 | 246 | 475 |
| press: rib stress max / P99, MPa | 4.3 / 3.4 | 7.0 / 4.1 | 6.3 / 3.8 | – | – |
| press: wall von Mises P99, MPa | 1.98 | 2.25 | 2.16 | 6.08 | 3.84 |
| squeeze: rib stress max / P99, MPa | 7.2 / 5.5 | 8.6 / 6.3 | 8.0 / 5.9 | – | – |
| squeeze: wall von Mises P99, MPa | 3.41 | 3.81 | 3.64 | 6.46 | 4.14 |

At equal rib mass the triangle lattice is **1.21×** as stiff as the hexagons under the crown press, 1.19× off-centre and 1.19× in squeeze (1.15–1.13× if the hexagons get the fillet volume back as straight rib), with 38 % lower peak rib stress under the press. The ribbed shell is 4.0× the bare wall and 2.02× a plain wall of the same total mass (thickened ×1.33) in press, 1.36× in squeeze. The topology gap is much smaller than for a perforated panel (the deck's 2D lattice slide) because a solid skin carries the membrane load either way. Stresses at 10 N are far below the material's strength; they are for comparison, not a margin.

<!-- numbers:end -->

## Driving it

```js
import { buildLattice } from '../lattice/lattice.js';
const g = buildLattice({ materials: M });     // M = materials() from lib/studio.js (shell, brass, pom are reused)
await g.userData.ready;                       // the builder returns the group at once; data streams in
g.setCut(k, { mode: 'half' | 'quarter' | 'top', x: 0 });   // section plane sweeps from the −X side to x (yellow cap, hatch-free)
g.setBuild(k);                                // ribs grow out of the wall: arches (centre out), front arch, diagonals, rails, struts, triggers, bosses last
g.setStress(k, 'press' | 'squeeze');          // blend to the FE stress map (shared MPa range for both lattices; rim flange = no data)
g.setFlow(k, 'press' | 'squeeze');            // white load-path pulses along compressed ribs; g.setTime(t) animates them
g.setCompare('tri' | 'hex' | 'both');         // 'both' puts them side by side (centres ±36 mm, opts.compareGap)
g.setFilletZoom(k);                           // swaps in the 0.035 mm patch; g.getFilletCamera(k, {position, target, fov}) → eased camera
g.setFilletMarks(true);                       // optional: traces of the node outline at mid-rib height
g.setPcb(k); g.setTriggers(k); g.setUnderLight(k); g.setLights(k);   // context and the asset's interior lights
g.dispose();
```
`g.userData`: `parts` (`tri`, `hex`, `triMeshes`, `hexMeshes`, `inserts`, `pcb`, `ties`, `skates`, `lights`,
`filletPatch`, `filletMarks`), `layout`, `fe` (summary numbers), `stressScale` (`ramp`, `range`, `unit`, `label` — draw
the deck legend from this), `fillet` (`node`, `normal`, `camera`, `radius`, `width`). Clip planes live in each variant's
local frame and follow the group's world matrix, so the deck can move it. The asset owns four lights (interior fill
for cutaways, a macro spot, an under-light) that scale with its state; `setLights(0)` mutes them.

Deck bridge example:
```js
R3D.register('lattice', async (studio, THREE, M) => {
  const g = buildLattice({ materials: M }); studio.scene.add(g); await g.userData.ready;
  return { root: g, update(s, t) { g.setCut(s.cut ?? 0); g.setBuild(s.build ?? 1); g.setStress(s.stress ?? 0, s.case);
    g.setFlow(s.flow ?? 0); g.setCompare(s.compare ?? 'tri'); g.setFilletZoom(s.fillet ?? 0); g.setTime(t); } };
});
```
`test.html` params: `theme`, `view` (name or `x:y:z`), `cut`, `cutmode`, `cutx`, `build`, `stress`, `case`, `flow`,
`compare`, `fillet`, `marks`, `pcb`, `triggers`, `under`, `lights`, `t`, `legend`, `legendpos=top`, `labels`, `lblz`,
`margin`, `target=x:y:z`, `dist`, `fov`.

## Shots (`shots/`, 3200 × 1800, `_paper` / `_night`)
`hero_cutaway` (quarter cut, ghost PCB, ties), `section_side` (half cut: arches from the crown onto the bosses),
`underside` (through the bottom opening, inserts and skates), `fillet_macro` (yellow section through the arch shows the
root fillets; the 6-way node in front), `tri_vs_hex` (same mass, from below), `stress_press` (half cut, stress + load
paths, legend), `stress_compare` (both lattices, same MPa scale, from below).

## Known gaps / notes
- **Axes:** the scan is right-handed with its side buttons on **+X**, i.e. the user's *left*; CONVENTIONS.md says
  "+X = user's right" and "side buttons on −X", which is the mirrored (left-handed) reading. This asset is mirror-
  symmetric about x = 0 (built from the scan's button-free half), so it is valid either way, but whoever places the
  side-button parts should check.
- **Mass vs 29 g:** see the table — the brief's 0.9–1.2 mm solid wall alone is ~14 g of CF-PP for body + triggers;
  the ribs add ~4.8 g. A 29 g mouse with this shape needs thinner skin between ribs or a lattice that replaces wall
  rather than adds to it (Brock's "cut material out of a solid plane").
- **Moulding:** ribs are normal to the wall with 1° draft; the transverse arches lie in planes containing the pull-free
  X direction, but ribs on the steep side walls are undercuts for a straight core pull (lifters or a collapsing core,
  as for any rib on a mouse side wall). Not checked with a pull analysis.
- The FE is linear and small-strain: no buckling, no creep, no contact (PCB ties are assumed bonded, screws clamped);
  fillets are not in the beam model (they are in the mass); the rim flange and nose are beams; the triggers are not in
  the model. Peak values at the load pad and supports are local; use the P99 columns for comparisons.
- The trigger hinge / click tensioners are not modelled (separate parts); the trigger lattice is the triangle lattice
  continued, with edge ribs.
- `s01` fills two scan features by fitted height fields; with the clean surface these patches are skipped.
