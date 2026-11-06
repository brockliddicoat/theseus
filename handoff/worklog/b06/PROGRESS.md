# B06 progress: Shell II (triangles, arches, fibres, fillets)

File: deck/src/30-b06-lattice.js. Build: `cd /home/claude/theseus/deck && python3 tools/build.py main --out=b06 --own=30-b06-lattice.js`.
Before my first slide: b05_work (Putting that weight to work). After my last: b07_board (night; b07 opens "on the ribs' feet",
and b07_arms calls back "the Comet's square corners" from b06_fillet). b07 uses "10 N, about a 1 kg bag of sugar": I use the
same human scale.
Tools: /home/claude/work/b06/tools/eval.js (evaluate an expression in a built deck; q1..q6 are the model probes).

## Status
- [x] Read common.md, b06-brief.md, FEEDBACK (STANDING, DECIDED, F32-F35, F2.09/16/17/18/24/25/37, F9.23/27, F13.1/2, F33.5/8),
      audit-brief.md (what the reviewer checks)
- [x] Read the old slides (10-d-shell.js: lattice, shlDeterminate, shlThin, fillet, filletsize; 10-d2-arches.js: shbArches,
      shbPress, shbThrust, shbBend, shbFibres, shbFlow, shbWidth, shbMill, shbMillDirect, shbTol) and the shared APIs
- [x] Old model numbers pulled; new models probed (bridge strips, free-feet arch, spread press)
- [x] Research (below). Web search budget ran out at ~07:55 (shared); everything below was fetched and read.
- [x] Storyboard every slide (below)
- [x] Models in my file: lattice bridge strips (b06_strip/b06_bridge), general node flow (b06_stokes, validated: the 6-arm
      case reproduces shbFlowCase exactly; the hexagon Y-node gives 0.81, as good as straight, so the fibre slide does NOT
      claim hexagon nodes tangle fibres), Comet plate FE (tools/comet_fe.js, validated vs Kirsch: 3.05 / 2.53 in a big panel)
- [x] KIT.md landed 08:03; Phase B started
- [x] b06_light built and checked (errs ok, qa clean settle+mid, frames + phone): CHECKPOINT1.md written
- [x] b06_lattice rebuilt after the 08:45 rules (frame one, greys, ribs-alone label, 3D line, 60 mm strip, joint zones)
- [x] b06_light reworked to stiffness (lead chart, linear) - [x] b06_arch (two strengths, buckling)
- [ ] b06_thrust  - [ ] b06_fibres  - [ ] b06_fillet  - [ ] b06_mold  - [ ] b06_arches  - [ ] b06_filletsize

## NOW (09:55): ALL NINE BUILT AND CHECKED
- Film order in the file = play order: b06_lattice (paper), b06_light (night), b06_arches (paper), b06_arch (night),
  b06_thrust (paper), b06_fibres (night), b06_fillet (paper), b06_filletsize (night), b06_mold (paper).
- Checks on the final build (dist/main-b06.html): errs ok for all nine; qa clean at settle and mid for all nine, plus
  extra times on each (1.2-7.0 s); frames in shots/v2..v6, arch*, thrust*, fib*, fil*, fsz, mold, arcs*, final
  (final/settle_sheet.jpg = all nine settles); phone views of b06_light and b06_arch.
- Shared constant for b05 (FILM F4): B06_STRIP (span 60, cells 5 × 12 mm, ribs 2.0 × 1.0 mm, 10 N, pressSay, solve()).
- Integrator decisions applied: frame one (all nine), true greys, "Honeycomb mice" (+ the two named), verdict grammar (F8),
  F41.1 two strengths (b06_use / b06_breakAt), "10 N, a hard press" wording (Won 2009), the egg (Sutanto 2025), the
  Comet's real window (RAE R&M 3248; FE re-run), F43.6 (no lattice below the crease: b06_arches stops at the shoulder),
  F44.2 (no shell budget quoted in b06: nothing to change), F45 (rib sizes: awaiting L1's LATTICE STUDY numbers; every
  size on my slides comes from B06_STRIP / SHB_A / FILLET, so a change is one edit).

## Models and conventions checked (08:45 rule; what, where, the check, the verdict)
- **07-sim.js frame solver** (all strips, the arch): Euler-Bernoulli 2D frame; I = w h³/12 with w the out-of-plane height
  (2.0 mm ribs, 10 mm arch strip), h the in-plane width; peak = |N|/A + max|M|·h/2/I; mass ρAL node to node; linear.
  Verdict: correct for what it is. Gaps found and handled: (1) no buckling → my buckle.js (linear buckling eigen-analysis,
  checked on a pinned Euler column to the digit; the auditor's agrees on the arch: 41.1 N); (2) joint size ignored →
  rigid joint zones in b06_zones ((h/2 + r/2)/tan(φ/2) per end); effect on the strip: both stiffen, ratio 10.2× → 9.3×
  (62.5 mm) / 8.6× (now 60 mm, 12 mm cells); (3) shear deformation: L/h ≥ 5.7, < 3 %, ignored.
- **PP-C-20A** (shlPyrofil datasheet): E = 13.5 GPa is the FLEXURAL modulus (right for bending members; no tensile modulus
  given; deck-wide). Breaks: F41.1 (Brock, 09:2x) two strengths, axial/120 + bending/207 combined linearly (b06_util).
  Before F41.1 the chapter judged bending peaks at 120 (conservative 1.7× for bending parts; flagged by me and by M).
- **b06_light's measure**: "max press before it breaks" → NOT robust: thin triangle ribs buckle before their strength (my
  eigen-analysis: 57 N against 78 N at 0.5 mm; the auditor: 42.8 N on his strip), and the lead then depends on the break
  rule (non-monotonic: M finds it peaks near 11.9× and falls to 8.9× at half weight). → stiffness: the press that flexes
  the middle 0.1 mm (SCALE.paper). Lead 8.6× → 34×; triangles 28 → 13 N, honeycomb 3.3 → 0.38 N (under SCALE.click 0.54 N
  at 0.26 g). Buckling margin at the limit press: 15 N in the top chord against 57 N.
- **2D strip scope** (b06_lattice, b06_light): ribs alone, loaded in their own plane, no wall. The 3D study (lattice.json
  fe.summary, the same rib weight; checked): crown k 499.3 against 411.4 N/mm (1.2×), rib_max 4.33 against 7.03 MPa (−38 %).
  Slides say "Ribs alone" / "strip" and give the 3D figures in a quiet line; no mouse-level 10× claim.
- **Rival label**: "Most mice" → "Honeycomb mice" (integrator 08:5x; Q1 open on what share of mice use honeycombs).
- **Human scale**: 10 N = about the weight of a 1 kg bag of sugar (9.81 N): OK. b05 calls 2 N "a firm press, about a
  phone's weight" (30-b05-shell.js:522): I dropped "a firm press" so we don't contradict; one chapter press is the
  integrator's call. SCALE.paper 0.1 mm (80 g/m² copy paper) OK; SCALE.click 0.54 N = 55 gf × 9.81 OK.
- **shbArch** (10-d2-arches.js): parabola, 20 mm rise, 60 mm span, 10 mm wide; equal weight by thinning (0.9 → 0.72 mm,
  0.545 g both: checked); 10 N over a 10 mm pad; hand check of the plate: M = PL/4 − P·pad/8 = 137.5 N·mm → 101.9 MPa
  (model 101.0); two-hinged parabolic arch thrust ≈ (25/128)PL/f = 5.86 N for a point load, 5.71 with the pad (model);
  crown moment cut 136.4 → 22.4 N·mm (−84 %). Verdicts: (a) the flat strip on two pins: in linear analysis identical to a
  pin and a roller, and only the roller is physically right at 7× its thickness of sag → drawn on a pin and a roller;
  (b) the held arch buckles at 41.1 N before its strength (76 N by F41.1) → buckling is its limit, shown; (c) under a
  fingertip 97 % of the arch's peak is still bending → "most bending goes", never "pure compression".
  Two-strength results: flat 20.5 N (crack), free arch 13.2 N (crack), held arch 41.1 N (buckle): 2.0×; flex at 10 N
  5.40 → 0.257 mm (21×).
- **SHL_GAMMA = 2 heat** (shlSigG): colour = (σ/σref)², the same on both sides, monotonic; decided (F19.3). σref: b06_lattice
  the hexagons' peak; b06_light 120 (all calm at the limit press); b06_arch 207 (the bending strength: red = cracking).
- **Old lattice numbers**: the old block's 4.64× (shlLat) quoted only as the old slide's value in answers.
- **shbThrustLine** (b06_thrust): e = M/|N| per element, from the solve; checked (M-b06-4): under an even load it stays
  within 0.005 mm of the 0.72 mm rib, under the 10 mm pad it strays 3.9 mm. The slide uses the even load (a palm) for the
  chain's twin and shows the fingertip's line leaving the rib, said as bending.
- **Node flow** (b06_fibres): shbStokes/shbFibres/shbFlowCase, 2D creeping Newtonian flow, Jeffery rods; b06_stokes
  reproduces it. Krenchel cos⁴ = a STIFFNESS efficiency, said so. Choi 2024 is carbon nylon (PA6), named so. Results:
  turning fibres within 30° of their rib 63 → 79 %; Krenchel 0.66 → 0.74 (+11 %).
- **Wood Handbook**: 107,600 and 2,300 kPa, Douglas-fir interior north, both green: 47×. OK.
- **Comet FE** (tools/comet_fe.js → comet_fe2.js): Kirsch check 3.05 / 2.53; re-run at the RAE's real window (16.6 × 14 in,
  3 in corners → 100 × 84 mm, r 18 mm): corner peak 3.97× the hoop stress; a tall oval of the same width (100 × 172 mm):
  2.00×. Heat linear (said in the method line). The Elba break-up is NOT tied to the passenger window (it is usually traced
  to the roof's ADF window); the slide uses the RAE test's first crack at a window corner, 5,248 cycles.
- **FILLET** (09-fillet-data.js): equal mass, peak von Mises over the panel mean; 'near-sharp' = r 0.05 (a sharp corner is
  singular: its value follows the mesh). Tolerance band (b06_tolBand): ±13 µm at r 0.05; at the 0.6 mm pick, read on the
  steeper side, ±0.14 mm: about 11× (the old shbTol's 19× was a local slope read at a flatter point; M 09:19).
- **Egg** (b06_arch): Sutanto 2025, 46.0 N end to end, 45.2 N on the side, n 30 each: "a thin dome takes about 46 N", no
  claim that end-on is stronger.
- **Heat keys** (F19.3 disclosure, M 09:15): b06_lattice (stress, squared, 0 to 59 MPa), b06_arch (strength used, squared,
  red = breaks), b06_fillet (node: squared; Comet: linear in the method line), b06_filletsize (its own shlRamp). b06_light
  and b06_thrust draw their strips in flat colours (far from breaking; the heat was not the message).

## Research (sources to add to SRC, b06 prefix)  [restored 09:57 after an edit slip; text as of 08:40, fills noted]
- Forces. Johnson, Hagberg, Wigaeus Hjelm, Rempel 2000, SJWEH 26(5) 398-405 (sjweh.fi/article/560): office mouse use, mean
  side (grip) force 0.43 N, mean button force 0.35 N. Mathiowetz 1985 (Arch Phys Med Rehabil 66:69-74, via topendsports):
  men 20-24 palmar pinch 26.6 lb (118 N), tip 18.0 lb (80 N). FILLED (FILLS Q2): Won 2009 peak side force 2.0-2.1 N; de Leva
  1996 hand 0.61 % of body mass (4.4 N). Chapter wording (09:45): "10 N, a hard press: a 1 kg bag of sugar, about five
  times the hardest grip measured at a desk" (b06Won in SRC).
- Straws: PBS Building Big (WGBH, 2000; web site 2000-2001), "Straw Shapes": "Straws arranged into triangles form more
  stable shapes than straws arranged into squares"; "When compression is applied to a square ... the joints rotate easily,
  and the shape changes". TeachEngineering (CU Boulder 2013) "Triangles & Trusses": "If you push down on top of the square,
  it will no longer be a square"; "a triangle cannot collapse".
- Hexagon rival: Finalmouse LLC, US 10,983,609 (2021) "Computer mouse with lightweight housing": openings "may be hexagonal
  forming a honeycomb framework that provides a rigid housing"; "the choice of shape types ... may be a matter of design
  choice" (ipiq.io/patents/2558819). Brock's doc #75: "It is very confusing why the majority of mice on the market use
  hexagons instead of triangles" (his words). FILLED (Q1): honeycomb mice = Finalmouse UltralightX, G-Wolves HTS Ultra 8K
  (TechPowerUp); most 2026 flagships are solid; label "Honeycomb mice" (b06Honeycomb in SRC).
- Statically determinate: Ashby 2006 (shlMaxwell, in SRC): Maxwell's rule; MIT 3.054 honeycomb (mitHoney, in SRC).
- Egg: FILLED (Q2): Sutanto et al. 2025, Communications Physics 8:182: 46.0 ± 6.6 N end to end, 45.2 ± 5.5 N on the side
  (n 30 each): "a thin dome takes about 46 N"; never "end-on is stronger" (b06Sutanto). IOP Spark / Science World dropped.
- Roman arch: Wikipedia, Pont du Gard: "constructed largely without the use of mortar or clamps"; 40-60 AD.
- Hanging chain: Hooke 1675 via Block, DeJong, Ochsendorf 2006 (shbHooke). Gaudí: Colònia Güell hanging model, hemp ropes,
  lead-filled sacks, 1:10 (b06Gaudi).
- Wood: USDA FPL Wood Handbook 2010 (FPL-GTR-190) ch.5: Douglas-fir, interior north, tension parallel 107,600 kPa (Table
  5-7), perpendicular 2,300 kPa (Table 5-3a), both green: 47× (b06Wood).
- Fibres: Krenchel cos⁴θ (shbKrenchel, stiffness), Choi 2024 (carbon PA6: 130.3 / 101.3 / 77.2 MPa at 0/45/90°: 1.7×),
  Merseburg (×2 strength, ×3 modulus PP/GF), Hexcel, Jeffery 1922, Moldflow: all in SRC. PP-C-20A's own anisotropy:
  shrinkage 0.1 % along vs 0.4 % across (srf_ppc20, 10-e-surface.js).
- Comet: FAA Lessons Learned (b06Comet). FILLED (Q2): RAE / ARC R&M 3248 (1962): window 16.6 × 14 in, corner radii 3 in;
  first crack at a cabin window after 5,248 cycles; stress round the windows 2 to 3 times the fuselage's (b06Rae). Elba
  (G-ALYP) is usually traced to the roof's ADF window: not tied to a passenger window on the slide.
- Mold: Protolabs corners (shbProtoCorner), Core77, Autodesk EDM (shbAutodeskEdm), CTE in SRC; RapidDirect (F. Peng, 2025)
  "Sharp Corners in Injection Molding" (b06RapidDirect); Beall 106; Brock's doc line 616: ribs that taper "create a funnel
  like effect".
- Compressive strength of PP-C-20A: FILLED as "not published" (RTP 183, Carbonele PP-CF20 sheets give none; "20 % CF-PP"
  grades differ 3× in tensile): no compression claims made.

## Model numbers (all derived; current build)
- Lattice strip (B06_STRIP: 60 mm, 5 cells of 12 mm, ribs 2.0 mm tall, 1.0 mm triangle ribs; hexagons widened to 1.27 mm
  for the same 0.46 g; pin + roller; 10 N on the middle top node; rigid joint zones): flex 0.035 vs 0.302 mm (8.6× stiffer);
  peak 8.0 vs 59.0 MPa (−86 %). 3D study (shlLattice, with the wall): crown 499 vs 411 N/mm (1.2×), hottest rib −38 %.
- b06_light (stiffness: the press that flexes the middle 0.1 mm), ribs 1.0 → 0.5 mm (0.46 → 0.23 g): triangles 28.4 → 12.9 N;
  honeycomb 3.31 → 0.38 N (under a 0.54 N click at 0.26 g); lead 8.6× → 33.5×. Linear buckling of the 0.5 mm triangles:
  57 N (10 N reference × 5.74); the chord carries 15 N at the limit press.
- Arch (shbArch; F41.1 two strengths): flat strip cracks at 20.5 N, free arch at 13.2 N, held arch buckles at 41.1 N
  (strength would be 76 N): 2.0×; flex at 10 N 5.40 vs 0.257 mm (21×); thrust 5.71 N per 10 N; moment −84 %.
- Thrust: palm (even 10 N) flat 55.6 vs arch 0.86 MPa (65× lower); fingertip 101 vs 26.5 MPa (3.8× lower); line within
  0.005 mm under the palm, 3.9 mm out under the fingertip.
- Fibres: turning fibres within 30° of their rib 63 → 79 %; Krenchel 0.662 → 0.736 (+11 %); straight 0.81.
- Fillet: FILLET 16.55× (r 0.05) → 8.29× (0.75), −50 %; struts 1.199 → 1.045 mm; floor 0.89 mm at ~1.05. Comet FE: real
  window 3.97×, tall oval 2.00×. Mold tolerance: ±13 µm (r 0.05) vs ±0.14 mm (r 0.6): ~11×.

## Storyboards
Superseded by the built slides; each S()'s `answers` says what is shown for every clause. The plan as of 08:40 is in the
final report; the model checks above changed b06_light (strength → stiffness), b06_arch (two strengths, buckling),
b06_thrust (palm vs fingertip), b06_fillet (the real Comet window, the RAE test) and b06_mold (tolerance at 0.6 mm).

## Research gaps (web-search budget used up at ~07:55; research agents answered at 09:45)
- b06_arch, hen egg breaking force: FILLED (Sutanto 2025).
- b06_lattice, PBS Building Big year: FILLED (WGBH, 2000).
- b06_fillet, the Comet 1's window size and corner radius: FILLED (ARC R&M 3248: 16.6 × 14 in, r 3 in).
- Chapter-wide, a measured squeeze or press force on a gaming mouse: NOT FOUND (seven queries); office figures used (Won 2009,
  Johnson 2000), 10 N said as "a hard press".
- b06_lattice / b06_light / b06_arch, PP-C-20A compressive strength: NOT PUBLISHED; no compression claims.
- Open: none of mine. (L1's LATTICE STUDY numbers for rib and arch-beam sizes, F45: pending; B06_STRIP carries them.)
