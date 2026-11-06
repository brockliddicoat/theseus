# L1 PROGRESS: the lattice study

Brief: /home/claude/theseus/handoff/revamp2/l1-brief.md (Brock F43.4, 2026-11-06 09:31)

## Status
- [x] 1. Read (predecessor + resumed session 11:14: FEEDBACK F41.1, F19, F33, F43-F50, G1-G10, common.md, KIT.md incl. Changes to 11:35)
- [x] 2. Moulding constraints, cited (resumed session, 11:20-11:30; see "## Moulding limits (cited)")
- [x] 3. Sweep (3D directly, stages A/B/C; the 2D strip map in map/strip2d.js)
- [x] 4. 3D shell study (decides): stages A-H
- [x] 5. Converged (h .9/.7/.55) + sensitivity (registration, rules, depth, patterns at fine mesh)
- [x] 6. Integrator messaged ~12:05 (winner numbers + 3 flags); review/b06.md LATTICE STUDY appended
- [x] 7. Slides: b12_latopt, b12_ribs (fine-mesh data, 13:05)
- [x] 8. Checks: errs ok, qa clean settle+mid, frames desktop+phone (shots/final), CHECKPOINT1.md
- [ ] 9. Final report (SubagentHandback)

## Integrator instructions (act on them)
- 09:4x F43.6 (Brock 09:38): "the bottom rim (the lower part after the hard crease) of the shape shouldn't have the
  lattice, it'll make it too complicated to manufacture". So: the lattice region ends at the hard crease; the rim below
  is plain wall, in the 3D study AND on the slide; the rim's plain wall is in the weight and in every load case.
  The crease: MS_SKIRT = 9.3 mm above the pad (06-motion.js, "the base chamfer's top edge"); confirm on the 3D body.
- 09:5x F44.2 (Brock): the two side switches (about 1 g together) come out of the shell's allowance: the study's weight
  constraint is **9.35 g** (was 10.35 g), lattice above the crease, plain rim below it.
- 09:5x F45 (Brock 09:50): he liked Codex's ruler demo (rv_thin_wall, "Shape buys more than thinning.": bend a ruler flat,
  release, turn it on edge, press again, same weight, N× stiffer; `git show origin/codex/theseus-revamp-2026-11-05:deck/revamp/40-structure.js`).
  My slide's classroom version = the ruler (the ribs are rulers on edge); then WHY the ribs stop at their depth and width:
  the simulation's optimum bounded by moulding limits (rib thickness vs wall for sink, min rib width PP-C-20A fills, draft,
  min fillet), each limit cited to a moulding guide and DRAWN AS A BOUNDARY on the map. b05_cubed shows a ruler for
  "thickness cubed": coordinate with b05 (film shows the ruler once in full, then calls back). Integrator is telling b05.
- b05 (agent aa486281695973786) for my ruler callback: the film's one ruler demo is b05_cubed's first beat (B05_C.ruler):
  a 10 × 3.3 mm strip of PP-C-20A, 60 mm span, 2.00 g, 10 N in the middle: flat 111 µm, on edge 12 µm: **9.1× stiffer**
  (floored from (10/3.3)² = 9.18), "On edge. Same weight."; "Shape buys more than thinning: depth goes in cubed." Quote 9.1×.
- 09:54 CPU (BROADCAST-CPU.md, load ~12 on 2 CPUs): coarse grid first, cache every result, refine only near the optimum,
  ONE solver process at a time, no browser for solving.

## Log
- 2026-11-06: started (no prior progress).

## Geometry and mass facts (measured, 10:05)
- Chart: geo/extract.py → geo/chart.npz: z-sections of shell-theseus-1seam.glb (body + triggerR, -X half, mirrored), outer
  skin by outermost ray hit, arc length s from the top midline. Rear cutout z = 4.84; trigger covers s < 25 to 31 mm.
- Crease: kit MS_SKIRT = 9.3 mm (skirt line; the smoothed skin's slope change is at y ≈ 9-11, the chamfer below y ≈ 5).
  S1 uses 9.3 too. Lattice region = body above y = 9.3; rim below it plain wall.
- Body (1.2 mm walls) = 12,166 mm³ = 12.29 g: ledge y<1.85: 1,437 mm³ (1.45 g); rim band 1.85-9.3: 2,968 mm³ (3.0 g);
  above the crease 7,761 mm³ (7.84 g) → area above ≈ 6,470 mm², rim band ≈ 2,470 mm². No bosses in the GLB body.
- Skates: 8 dots Ø6.5 × 0.65, POM by default (glide card) 1.42 g/cm³ → 0.25 g.
- Budget (F44.2): body + skates ≤ 9.35 g. Fixed: ledge 1.45 + 4 bosses (OD 6.2, bore 3.2, 3.6 tall) 0.32 + skates 0.25
  = 2.02 g → 7.33 g for walls + ribs + rails + fillets. Plain wall at budget ≈ 0.81 mm (< Protolabs PP 0.889!).
- FLAG for integrator: at 9.35 g even a plain wall is under b05_wall's PP floor (0.89 mm); a lattice needs a ~0.6 mm skin
  (Brock's F20.3 plate precedent: "Thicker skin, about 0.6 mm, so no rib is wider than the skin").

## The 3D model (built 10:15-12:40; fe/)
- fe/l1geo.py: chart access, regions in (z, s) (domain to Z_NOSE 54.5, lattice above y 9.3, trigger opening), lattice
  lines for tri/kagome/square/diamond/hex (density = rib length per area lam), conforming Delaunay (one noded arrangement;
  constraint points vs fill points; tags rib/crease/rail/bnd per sub-segment), 3D mapping, tail slit zipped by mirror
  pairs, Lawson flips on 3D angles.
- fe/l1fe.py: skin CST→**Allman** membrane + DKT (fe/fem.py = the 3D study's library + Allman, my copy), ribs and the
  crease rib as eccentric beams (mean width with 0.5° draft), rails 1.1×1.5 / 1.15×2.0, the base ledge as ONE closed
  ring (3.6×1.2) through all bottom nodes, chin as a deep beam (8 × t), skates: one node each (y); in-plane pins on
  the symmetry plane (x at tail and chin, z at tail). Budget solved per design: skin t = what 9.35 g leaves.
  Loads: crown 10 N (10 mm pad) + a 5×5 grid of positions ±6 mm round it (worst = local skin flex), off-centre 10 N
  (7 R, 6 F), palm 4.4 N over the rear hump, squeeze 10 N each side at (y 15, z -8). F41.1 use (membrane/120 +
  bending/207; rib axial/120 + bending/207), peaks over well-shaped elements (min angle ≥ 12°). Buckling: K_G (shell
  membrane on u,v,w; beam axial) + eigsh(K_G, M=K). Tripping: plate strip k 0.425.
- Checks: fem textbook plates ≤0.5 %, ribbed strip 0.6 % (centre load), Scordelis-Lo roof: CST 0.67/0.86/0.95/0.98,
  Allman 0.92/0.97/0.99/0.99 (n 4/8/16/32). Plain wall without rails converges (crown 126.9/127.0/128.0 µm at h
  1.5/1.1/0.8). With rails the crown converges from h ≤ 1.1 (70.6 → 74.3, +5 %). Sweep at h 0.9; finalists at 0.7/0.55.
- Bugs found and fixed on the way (so nobody repeats them): conforming loop index corruption; boundary tags per piece
  (whole ring tagged rail); ledge ring fragmented by a height filter; tail slit never stitched (smoothing of closed-loop
  ends); in-plane pins on one side resisted the squeeze; pads snapped to nodes.
- FINDING: the old 3D study's "2.0× stiffer than a plain wall" compared ribs+rails against a plain wall WITHOUT rails
  (s05_fe.py adds rails only `if ribs`). Here at 9.35 g the rails alone make the crown 1.6× stiffer (126 → 78 µm).

## Stage A (12:40): skin at the floor 0.60, ribs at the cutter limit h = 4w, 5 topologies × lam 0.18/0.25/0.33/0.45
- running: fe/stageA.json → fe/stageA.log, cache out/cache/<key>.json

## Resumed session (2026-11-06 11:14, after the server restart)
- Stage B finished (34 designs, cached). analyse.py over 50 cached designs: every lattice beats the plain wall with rails at
  the same weight; stiffness rises with rib height until the limits bind; topology spread ~10 % at equal rib size and lam.
- Strength peaks (K = 1): rails/cutout corners (0.15-0.18 under 10 N) for good designs; some lattices peak at the crease
  rib next to the squeeze pad (0.29-0.70: B1-tri-0.29, A-square-*), a registration effect (where ribs meet the crease
  rib near the pad), to be checked for mesh dependence.

## Moulding limits (cited) [11:30]
- Rib base width w <= 0.6 t: Protolabs, Injection Molding Basics ("a rib-to-wall thickness ratio of 40 to 60 percent the
  thickness of adjacent surfaces"); Xometry, Plastic ribs ("no more than 60% of the nominal wall thickness"; glossy 40 %).
  Beall (Plastics Today, By Design, 2000-08-13): high-shrink PP/acetal 50 %, low-shrink ABS/PC 75 %, fillers allow thicker,
  appearance parts a further -10 %. PP-C-20A mould shrinkage 0.1 % MD / 0.4 % TD (PlaBase datasheet) = low-shrink class.
- Rib height hr <= 3 t: Beall 2000 ("2.5 to 3.0 times the nominal wall thickness"); DFMPro via Wikipedia "Design of
  plastic components" ("not more than 2.5 to 3 times the nominal wall"). (Xometry: 3 x the rib thickness, stricter; outlier.)
- Root radius 0.25 to 0.4 t: DFMPro/Wikipedia ("between 0.25 and 0.4 times the nominal wall"); Beall: minimum 25 % (it
  thickens the junction by 50 %). Xometry says 0.5 to 1 t (outlier, sink).
- Draft >= 0.5 deg/side: DFMPro/Wikipedia ("Minimum draft should be 0.5 per side", 1 to 1.5 recommended); Xometry 0.5-1.5.
- Spacing >= 2 to 3 t (trivially met: cells >= 5 mm).
- Thin deep ribs are EDM'd (Autodesk, Rathbone 2018: "Ribs in molds are typically thin and can be quite deep ... EDM
  operations are often commonplace in those specific areas"; milling needs large L/D tools that deflect).
- Skin floor: 0.60 (F20.3). CONFLICT: the deck's protoWall (Protolabs design guidelines: PP 0.889 to 3.81 mm) is b05_wall's
  "Fills down to 0.89 mm"; Protolabs's Injection Molding Basics page lists PP 0.025-0.150 in (0.635 mm). At 9.35 g even
  the plain wall is 0.744 mm (with rails). Flag to the integrator / Brock.
- Stage C (stageC.py): ribs at the limits w = 0.6 t, hr = 3 t, r = 0.3 t, draft 0.5; t solved from the budget (fixed point).
  C1 tri lam 0.10-0.45; C2 five topologies at t = 0.60 (lam solved). Planning started 11:25 (mesh builds slow, load ~4.5).

## Stage C results (11:43-11:58) and the winner
- C1 tri at the limits (w 0.6t, hr 3t, r 0.3t), worst flex vs lam: 0.10 121 | 0.15 104 | 0.20 97.5 | 0.25 89.4 (t .611) |
  0.30 96.3 | 0.35 97.1 | 0.40 94.8 | 0.45 86.4 (t < 0.6 past 0.29). Flat and noisy past 0.25: registration (+-5 %).
- C2 same rib 0.36 x 1.80, skin 0.60, lam ~0.28: tri 92.3 | kagome 94.2 | square 94.3 | diamond 96.3 | hex 106.9 um
  (plain+rails 135.7, plain no rails 233.0). WINNER: triangles, 12.3 mm cells, ribs 0.36 x 1.80, skin 0.60, r 0.18.
- Mass: skin 5.66 + ribs 1.36 (2.2 m) + fixed/rails 2.33 = 9.35 g.
- Strength: field peak 0.173 (off-centre) x root SCF 1.51 = 0.26 (if at a rib root): winK.py checks element by element.
- Queue: q/runD0.sh (winK.py, then tjunction.py 0.60 0.36 1.80) -> runD.sh (stageD.py plan; sweep stageD.json: phases
  first, depth family D7, rule variants D1/D2/D4, fine meshes D6; then stageDb.json --buckle).
- Slides: deck/src/30-b12-latopt.js (b12_latopt, b12_ribs); data block from tools/b12_export.py + tools/b12_tojs.py
  (geometry from tools/b12_geo.py -> out/b12-geo.json; crown point out/crown_point.json).

## 12:00-12:20
- winK.py (element by element, K 1.51): winner peak 0.173 (skin mid-cell, off-centre, no fillet there); rib end with K
  0.177 (0.172 at K 1.472, r 0.24); plain+rails 0.181 (rail). Lattice NO WEAKER. (The 0.26 estimate was wrong.)
- Fillet study on the winning section (t .60, w .36, h 1.80): SCF 1.56 (.25t) 1.52 (.3t) 1.47 (.4t) 1.37 (.6t) 1.28 (1t);
  junction 1.19t to 1.56t; mesh drift ~2.5 %/refinement (quote +-5 %). PICK: root 0.24 mm (root peak = skin peak at .39t),
  node fillet 0.22 mm (b06's 60 % rule). Integrator told (12:16); review/b06.md updated.
- Flow length (flowlen.py): crown gate to the chin's lower edge ~105 mm along the shell (graph 108); 95 % within 80 mm.
  0.60 skin: 175 skins (PP 150-280, MIT 2.008). On slide 2 (R3-b12-2).
- R3 (review/b12.md): 2 musts + 2 shoulds + 1 could, all replied FIXED (12:15).
- Stage D: phase +0.5 is degenerate (an arch line on the rear cutout edge -> 95k missing edges, 3.5 GB): replaced by
  -0.25. Depth family D7 fixed (spurious quadratic root). Phases: lam .25: 89.4 / 102.4 (+.25) / 95.7 (-.25);
  lam .281 (winner): 92.3 / 103.9 (+.25) / pending (-.25). Registration +-7 %, more than cell size.

## 12:14-12:40: THE PATTERN LABELS WERE SWAPPED; kagome wins; the final crease
- l1geo's 'tri' (phases 0.5, 0.5, 0.5) is NOT concurrent (d2 + d3 - d1 = 0.5): it is the KAGOME (woven: 2 ribs cross per
  node; triangles + hexagons). 'kagome' (0.5, 0.5, 0) is the TRUE triangle lattice. Plotted and confirmed
  (shots/check_tri_kagome.png). Slides relabelled; the cache keeps the code labels.
- The scalar 'phase' (D5) added the same offset to all families: NOT a translation (it changes the geometry). Replaced by
  per-family offsets d_i = n_i.v/H (stage E). E (true translations, same rib/skin/weight): kagome 92.3 / 94.2 / 91.1
  (mean 92.5); triangles 94.2 / 94.2 / 92.0 (mean 93.5): a tie. Tie-break: node size (kagome 2-rib crossings ~0.5 mm;
  triangles 6-rib knots ~1.2 mm with 0.22 fillets, ~1.9 skins thick: sink). WINNER: KAGOME. Integrator + S2 told (12:30).
- Stage D (level crease, kagome): depth 0.6 124.5 | 1.0 116.4 | 1.4 104.6 | 1.8 92.3 | 2.2 80.7 | 2.6 70.9 um;
  kh1.8 (3 rib widths, 1.08 mm, lam .494) 118.9; kh2.5 (1.50 mm) 100.7; kw0.45 (0.27 mm ribs, lam .39) 90.7.
- Coordinator 12:2x: Brock "Skin: 0.60 mm, to be proven" (say once: mould-flow check / first shots at the chin's rim);
  agree wording with P4 (sent); final to main AND S2 (sent); R3's must: >= 5 depth points (6 now).
- S2 12:30: the crease is now one sloped straight line y = 8.56 - 0.04837 (z + 59.58) (F47.2/F51). Implemented as
  L1_CREASE=slope (l1geo.y_crease; designs carry crease='slope'). Stage F: five patterns at t 0.60 + kagome depth family;
  F winner lam 0.2382 (spacing 12.6 mm). Queue q/runF2.sh: F, winK (stageF), buckling (win, plain), convergence (h .7/.55).

## 12:35-12:58: final crease, buckling, CONVERGENCE (changes the headline), fine-mesh patterns
- Stage F (sloped crease, h 0.9): kagome 93.2 | diamonds 94.2 | triangles 94.7 | squares 95.8 | hexagons 100.8;
  plain+rails 135.7. Winner lam 0.2382 (12.6 mm spacing), t 0.601. Depth: 0.6 122.7, 1.0 115.9, 1.4 105.1, 1.8 93.2,
  2.2 82.0, 2.6 72.2.
- winK (F, K 1.472): skin field (junctions aside) 7.5 %, ribs ~16 %, rails 14 %; one rib-rail junction element at
  (-29.1, 23.2, 23.7) 25-50 % (coarse-mesh artefact: gone at h 0.55). Fillet: the root never governs in the band -> 0.24.
- Buckling (h 0.9, linear eigen): winner crown x92.9 (930 N), squeeze x73.5 (735 N); plain+rails x75.0 / x44.6.
  Rib tripping factor 17.
- CONVERGENCE: winner worst 93.2 / 109.5 / 112.2 (h .9/.7/.55); plain+rails 135.7 / 142.9 / 147.0. Coarse mesh
  flatters ribbed designs (~20 %) more than the plain wall (~8 %): headline 31 % -> 23 % (147 -> 112 um). Richardson
  (p=2) ~ 116.6 vs 153.6: -24 %. Integrator told (12:5x).
- Stage H (h 0.55, final crease): squares 108.6 (rib 12.6 %, skin 15.8 %) | diamonds 110.3 (17.6 / 14.7) | triangles
  111.6 (13.7 / 20.7) | kagome 112.2 (12.9 / 14.6) | hexagons 114.6 (26.4 / 19.1). Pattern spread 6 % = noise level;
  ribs' stress differs 2x. Kagome kept (lowest overall peak, 3 directions, no 6-rib knots). Depth 0.6: 153.4 (> plain
  147: shallow ribs LOSE to a plain wall). Remaining H depths + plain-no-rails h .55 queued.
- Slides: fine-mesh data (export FINE: the map = fine points + the coarse sweep faint, scaled by the measured
  coarse/fine ratio vs rib depth; depth chart fine; verdict 147 -> 112).

## 13:00-13:10: final
- Stage H (fine, final crease): depth 0.6 153.4 | 1.0 143.9 | 1.4 128.8 | 1.8 112.2 | 2.2 97.1 | 2.6 84.1; plain no
  rails 240.0. Coarse/fine ratio vs depth 1.25 (0.6) .. 1.20 (1.8) .. 1.16 (2.6); plain+rails 1.084, plain 1.030.
- out/results-final.json: the citable numbers (P6 cites it for b06_lattice's foot line). P6 runs b05_cubed tolerance
  solves on my model (their folder, nice 10, waits for my solvers).
- Slides on the fine mesh; frames shots/final; CHECKPOINT1.md written. Next: report (SubagentHandback).
