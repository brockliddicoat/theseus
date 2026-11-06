# Models and conventions audit (M, 2026-11-06, 08:30 to 09:20)

Brief: handoff/revamp2/models-brief.md. Each item: where it is defined, what it assumes, the check, the verdict. Every
check can be re-run: /home/claude/work/models/tests/ (Node; `load-sim.js` loads deck/src/07-sim.js with stubs; each
`t-*.js` reads the builders' live source, so re-running it checks the current model). Findings for builders are in
/home/claude/work/review/<code>.md, newest first, headed MODEL / CONVENTION / MODEL UPDATE / MODEL CHECK.

Brock's decision during the audit: **F41.1 "Two strengths"** (08:58): 120 MPa stretched, 207 MPa bent; a slide whose point
doesn't survive leads with stiffness. It came from the CONVENTION finding below and changes several shell numbers.

---

## 1. The shared solver: deck/src/07-sim.js

| item | check | verdict |
|---|---|---|
| `feSolve` frame element (Euler-Bernoulli, 6 DOF, Tᵀ k T), Cholesky, back-substitution | 35 textbook cases (t-sim-textbook.js): cantilever PL³/3EI, PL²/2EI, PL·c/I at n = 1, 4, 20; simply supported PL³/48EI, PL/4, PL²/16EI; fixed-fixed PL³/192EI; axial PL/EA; a 45° bar; one-element Hermite mid-span 5PL³/48EI; compliance = 2U | **OK**, all to < 0.001 % |
| `truss: true` bars, the rotational "whisper" (dmax·1e-9), the mechanism flag | pin-jointed triangle (P/(2 tan60) tension, P/(2 sin60) compression), pin square flagged a mechanism, braced square P√2, rigid square carries load, a 0.3 mm beam unaffected by the whisper | **OK** |
| reported stress `sig = |N|/A + |M_end|·c/I` | the peak fibre stress for nodal loads (moment linear along an element) | **OK**; it is stress magnitude, tension and compression alike |
| units (mm, N, MPa, g; ρ in g/mm³) and mass ρ·A·L | checked in the tests | **OK** |
| load scaling (linear: drawn deflection and heat × k) | feDraw multiplies the shape and the stress by the load share | **OK** |
| fillets (`feFillets`) | drawing only: no stiffness, no mass, no stress effect; a frame model cannot show a fillet lowering a peak (the fillet study, 09-fillet-data.js, is a separate continuum model) | **OK as a drawing**; say so wherever a slide implies the frame's peak "knows" the fillet |
| `feEngaged(r, 0.3)` ("grams that work") | counts an element's whole mass if one end's outer fibre passes 30 % of the peak: on the solid web it gives 70 % where the material really above 30 % is 34 % | **FLAWED as a measure** (unused by the new slides). Fix: sample through each element's depth and length (as shlSamples does), against the true peak; or report mean use ÷ peak use |
| limits the slides must not exceed | no shear deformation (adds ~10 % on the 10.4 mm deep web), no buckling (now checked separately, below), joints are points (overlapping joint mass), planar only (no out-of-plane, no lateral-torsional buckling), small deflection | **OK as stated limits**; buckling checks: tests/buckle.js (linear eigen-buckling, checked against Euler for pinned, fixed and cantilever struts) |
| SIM_MAT | PP-C-20A E 13.5 GPa is the datasheet's *flexural* modulus, used for axial members too (fine); ρ 1.01 (rule of mixtures 1.00); FR4 19 GPa here but 20 GPa in B05_MAT (Gund: 20 lengthwise, 18 crosswise); Mg 46 GPa here (makeitfrom) but 44.8 in B05_MAT (MatWeb) | **CONVENTION**: one value per material across the film (suggest FR4 20 / 18 by direction, Mg 44.8) |

**Proposed addition to 07-sim.js (integrator applies):** the F41.1 rule as `feUse(r, ft, fb)` (σ_axial/ft + σ_bending/fb per
element) and `feBreakAt(r, P, ft, fb)`; text in review/b05.md (MODEL UPDATE 09:03). b05 and b06 carry their own copies now.

## 2. Shell I (b05): materials and strength

| item | where | check | verdict |
|---|---|---|---|
| peak stress of shlHot's frames | 10-d-shell.js shlSamples / shlHot (`r.peak = samples[0].s`) | the outermost sample row sits at 15/32 of the depth: the web's peak 17.79 MPa against beam theory's (and the solver's own) 18.99 MPa | **FLAWED** (−6.3 %). Fix: use `r.smax`. Under the old rule: web 63 N (not 67), sized triangles 121 N (not 126), 1.9× (not 1.8×), −47 %. b05 now computes at the fibre (F41.1 code) |
| the break rule | SHL_STR.ft = 120 applied to bending peaks | the datasheet's bending strength is 207 MPa; the 120 rule on bending favoured the triangles and arches | **CONVENTION, decided F41.1**. Under it: web 109.0 N, one-size triangles 93.9 N, sized 147.8 N; sized/web 1.36×, the same press at −26 % weight; one-size triangles lose (0.86×). b05 implements it (checked 09:15) |
| "cracks at 67 N, about the hardest a hand can squeeze" | b05_nopick | a 0.28 g, 0.44 mm-thick section's crack force is arbitrary (∝ its thickness); the deck's own 3D study puts the plain 15.18 g wall at ~30 MPa under a 72 N squeeze (a quarter of 120) | **FLAWED**: drop the tie |
| what the parts are | b05_nopick labels | the "plain solid wall" is a deep web loaded in its plane (b05_material's strip is a wall pressed on its face); "Theseus" was the force-sized truss | **FLAWED** (labels): name them; Theseus's line only as "sized to their force", or lead with stiffness (F41.1) |
| the 3D study (SHL_FE, lattice.json fe.summary) | 10-d-shell.js | linear CST + DKT flat shells, eccentric rib beams, 9,304 nodes: credible as a *relative* study (same mesh both ways); its stress figures are P99, not peaks | **OK relative**. Crown press: 2.0× stiffer, P99 −12 %; off-centre: 2.2×, −14 %; **squeeze: 1.36× stiffer but the triangle ribs' P99 is 34 % higher than the plain wall's** (the old meter used the press case only). The old shlShell3d's "busiest rib runs 12 % under the plain wall's peak" compared P99 with P99, not peaks |
| "18, 25, 90 % of the weight works" | shlWorkShare (≥ half the sampled peak) | true peak: 15, 24, 87 %; at 30 %: 34, 87, 99 %; by use (F41.1): 16, 26, 100 %; threshold-free mean/peak: 25, 42, 56 % | **FLAWED** as printed; must state its rule and use the true peak; don't multiply a 2D share by the 3D study's 15.2 g |
| in-plane buckling of the shlHot truss | buckle.js | 175 N (one size), 193 N (sized), above their break loads | **OK** |
| b05_material strip (beam theory P L³/48EI, Z = bt²/6) | B05_M | 0.80 against 4.24 mm at 2 N; 0.61 against 0.63 g; gives at 13.3 against 5.6 N (tensile basis) | **OK** (sag 7 % of span at 2 N for ABS: near the edge of small deflection) |
| specific strength and stiffness ranking | B05_SP | at one weight bent: E^⅓/ρ PP 1st; σ^½/ρ PP 2nd on tensile values, **1st on F41.1's bending values** (207 against FR4's 552 × 0.298 = 165); textbook E/ρ and σ/ρ put PP **3rd** | **OK**, but the headline must say "bent, at one weight" (should) |
| magnesium "cracks at 8 N" | B05_MAT mg s 230 (UTS) | yields (bends for good) at 150 MPa, 5.2 N | **OK** with the note: "gives at 5 N, cracks at 8 N" is the fully honest pair |
| the fill law reach ∝ (t/floor)² | B05_W | Poiseuille flow (v ∝ t²) with a freeze time ∝ t² gives L ∝ t²: sound | **OK**; the verdict depends on the magnesium floor (0.70 typical against Yizumi's 0.3 to 0.5): show both |
| ruler 225× and cubed tolerance swings | B05_C | b²/h² = 225; 0.70 mm: −29 to +36 %; 1.00 mm: −21 to +25 % | **OK**; ±0.076 mm is Protolabs' rapid-tooling machining tolerance |
| human scale | B05_HAND | Johnson 2000: side 0.43 N at 0.6 % MVC → 72 N derived; 2 N "about a phone's weight" (204 g) | **OK** as derived (the MVC derivation can't be re-checked against the paper here) |
| squared heat scale (F19.3) | shlSigG, shlPlateField γ 2 | no b05 slide draws the key | **CONVENTION, must**: draw shlRamp(…, γ) or say "squared" (Brock chose the scale; disclosure is the condition) |

## 3. Shell II (b06): triangles, arches, fibres, fillets

| item | where | check | verdict |
|---|---|---|---|
| the lattice strip (Warren truss against a row of hexagons, same weight) | b06_strip, b06_bridge | 10.2× flex, −88 % peak at 1.0 mm reproduce; a 10 mm pad instead of the apex load changes the hexagons' flex 2 % (fair); the builder added rigid joint zones (08:47), a sound refinement | **OK** as the strip. Scope **FLAWED** where it speaks for the shell: the 3D study gives triangles against hexagons 1.21× crown stiffness, −38 % hottest rib, −17 % P99 |
| b06_light "max press before it breaks" | b06_sweep (first build) | buckling: below 0.675 mm the compressed ribs buckle before 120 MPa; the lead peaks at 11.9× near 0.32 g and falls to 8.9× at half weight (43 N, not 79) | **FLAWED** (found independently by b06, who switched to stiffness: the press that flexes the strip 0.1 mm): **OK now** |
| the arch against the plate (12 N, 45 N, 21×) | 10-d2-arches.js shbArch | the plate (11.9 N) sags 6.4 mm (7× its thickness) at its break: linear theory holds only if it is free to slide (a roller); the arch buckles in its plane at **41.1 N** (linear eigen, an upper bound) before 45.2 N; under F41.1 the plate breaks at 20.5 N | **FLAWED** as printed: 21× stiffer stands; the load becomes 2.0× (F41.1, buckling), plate drawn on a pin and a roller. b06 now draws the buckling mode |
| "thrust cancelling bending" | shbThrustLine | under a fingertip the thrust removes 84 % of the moment (136 → 22 N·mm) but 97 % of the arch's peak stress is still bending; the thrust line strays 3.9 mm off a 0.72 mm arch; under an even load 0.005 mm | **FLAWED** if said as pure compression under a finger; the chain demonstration needs the even load |
| colour by use (F41.1) | b06_archDraw | colours σ_a/120 + σ_b/207 | **OK**; b06_drawStrip still colours stress against 120 (should) |
| fillet size study | 09-fillet-data.js | plane-stress CST on a graded mesh, validated on a plate with a hole (3.01 against 3.03); same-mass constraint gives a true optimum (SCF 16.6 → 8.3 at r 0.75 to 0.9 mm, rising to 8.8 at 1.2) | **OK** (the sharpest radius's SCF is mesh-sensitive; the trend and the pick are robust); von Mises against a brittle-ish material is fine at a free surface |
| fibre alignment (Stokes flow, Jeffery orbits, Krenchel cos⁴) | b06_stokes, shbFibres | method standard; not re-run | **UNCLEAR** (not audited in depth this run): check the flux bookkeeping if b06_fibres prints a percentage |

## 4. Shell III and Shape (b07)

| item | check | verdict |
|---|---|---|
| the board as a triangle truss (bar area 0.866·s·t, ρ/3) | reproduces the plate's in-plane E·t and mass per area exactly; ν 1/3, G 3E/8 (about twice woven FR4's shear) | **OK** (minor for a tie) |
| b07_board squeeze: sides 0.64 → 0.21 mm, feet 0.68 mm; FR4 against magnesium 1.83× | reproduces | **OK**; the section's equivalent rectangle keeps stiffness exact but reads stress at its half-depth, ~half the T-section's rib-tip stress; the tie raises the peak 9 %; the crown press gains only 3 % |
| b07_arms "a fifth of the peak" | under the squeeze the arms tie 3× stiffer (0.004 against 0.012 mm) and the arms design's worst member uses 1.1 % of its strength against Theseus's rib feet at 4.9 % (F41.1) | **FLAWED** as evidence (selective: FR4 only). b07 now leads with stiffness and says the drop is not modelled (checked 09:15) |
| the tab: σ = 3EHδ/L², 0.36 mm to 483 MPa | reproduces; 483 MPa now sourced (b05Fr4Flex, Gund crosswise); tab 6.5 mm against the plan model's 11.8 mm arm | **OK** with one length for the arm |
| tolerance stack-up (Scholz worst case, RSS, 2Φ(−S/σ)) | 4.84 %, 28.8 % (78 % share) reproduce; the deck's LCG Monte Carlo agrees (4.82, 28.76 %) | **OK**; framing: Protolabs' ±0.076 mm is a mold's machining error, fixed per mold, not random part-to-part scatter |
| centre of mass and "twist cut" | parts sum to 29.31 g; balance 0.06 mm above the grip from part heights known to ~1 mm | **FLAWED** (false precision): one decimal at most, "at the grip's height" |

## 5. Clicks (b02, b03)

| item | check | verdict |
|---|---|---|
| cutouts: hinge about the cutout's chord over the 10 mm spring; `b02_sideShare` | re-derived from the rotation (k × r): matches; smile 13.22°, 8.01 % of the travel sideways, click weights by the lever balance | **OK** (old 33.4 % = sin(lean) gone) |
| Direct Drive: sin 20° = 34 %, 1 − cos 20° = 6 % | right as shares of the post's *travel* | **FLAWED wording** carried in the old caption ("a third of the press shoves its plunger sideways"): the sideways force is the friction of the slide (μ × the switch's force) |
| tensioner 26.9 → 7.7 gf | reproduces (flat 0.8 mm against the bridge, clamped, 0.35 mm at 30 mm, finger at 40 mm) | **OK as the spring's share**; must add the switch's 55 gf (41.3 gf at the fingertip): 68.2 → 49.0 gf (−28 %); the "Starlight X" row is modelled in PP-C-20A (a flat plane's force ∝ E: 60 gf at 30 GPa); dimensions an example (F12.5) |
| front rock 0.42 mm, flush step 0.46 mm, POM pads ±0.05 mm | example groove (0.9 mm, 0.1 mm out of step); 0.35 × 40/30 = 0.47; pads in 0.05 steps | **OK** (label the example; add the pad's own tolerance) |
| optical switches 17.6 %, Theseus +20.9 % (printed +20) | arithmetic right; the 5 mA / 30 µs / 1 ms drive is Omron's *test* condition, not Razer's (at a 125 µs strobe two LEDs would exceed the whole mouse's draw) | **UNCLEAR → OK as labelled** ("at Omron's datasheet drive"); stale comment 216.6 h / +20.3 % |
| mechanical read "about 3 µA whatever the firmware does" | an SPDT's NC contact is closed at rest: an always-on pull-up (~13 kΩ on Nordic parts) draws ~0.14 mA at 1.8 V | **FLAWED**: holds only with strobed pull-ups (a firmware commitment) |
| timing: 1.43 ms before NO; "4.4 ms later" | right for a defer-type 4 ms debounce (Lamzu, TechPowerUp); eager debounce costs ~0 | **should**: name the rival setting; "negative latency" needs its reference |
| 72 → 70 µs target (F18.5), XBAB's 1.5 ms flight | his target; XBAB's measurement on its switch | **OK** as labelled |
| bin ±2 gf "under 7 % of 55" | 4/55 = 7.3 %; Pang 1991 measured 2.5 to 10 N | **FLAWED** (minor): ±1.9 gf, or reword |

## 6. Glide (b04)

| item | check | verdict |
|---|---|---|
| defocus: thin lens 1:1 at 2.4 mm, blur disc, aperture from "±0.2 mm DOF" | sound; scale v0/u gives +9.1 / −7.7 % at 2.2 / 2.6 mm, ±4 % at 2.3 / 2.5 | **OK**; **UNCLEAR**: the direction and size against the ADNS-3080's resolution-vs-Z figure (requested from Q1) |
| "0.2 mm, not 0.4" | PixArt's ±0.2 mm *is* a 0.4 mm window; Theseus's band is ±0.1 | **OK**, say both forms on the slide |
| sag: Pasternak foundation calibrated to Brock's 0.65 mm at 10 N; 706 against 66 mm² (0.31 against 0.05 g) | consistent | **OK** as a labelled model (F18.8) |

## 7. Surface (b08)

| item | check | verdict |
|---|---|---|
| film 0.368 g (F-110 at 0.75 mil over 133 cm²), soft-touch 0.68 g | Cerakote's coverage per gallon at 1 mil; a dry film ~1.3 to 1.45 g/cm³: plausible; the old 0.49 g came from the wrong film and is corrected | **OK** |
| directional grip 14 % | Zhang 2017, one finger on laser-textured steel, 6 to 26 % over 0.2 to 1 N; 0.3 N row used | **OK** with the source said on the slide |
| 3H → 9H, 51 → 19 µm, 0 → 1,000 h, 3 → 1 layers | like-for-like, sourced | **OK** |
| wheel 0.900 g = 508.8 mm³ × 1.77 (AZ31B); + POM axle 0.12 g | reproduces | **OK** |

## 8. Electronics (b09, b10) and the battery

| item | check | verdict |
|---|---|---|
| hours = Wh ÷ the V4 Pro's draw (1.184 Wh / 180 h = 6.58 mW) | the 370 mAh example battery: 1.369 Wh → 208 h; the film's figure is the 200 h target | **OK**; say which (target or derivation) per slide; the V4 Pro's draw includes its optical switches, so this is cautious for Theseus |
| polling: 1/h = a + b·f fitted to 180 h and 45 h | 126 h at 2 khz, 79 h at 4 khz; Theseus scaled to 200 h → 50 h at 8 khz | **OK**; **CONVENTION**: b09 uses the 45 h claim (26.3 mW), b10 the measured 40 h (29.6 mW): one draw for the film |
| derived rival hours "an upper bound" | not an upper bound by any law; for mechanical-switch rivals it is likely an underestimate (SLX 141 h → 171 h without an optical pair) | **FLAWED wording**: "an estimate at the V4 Pro's draw" |
| Li-ion against Li-po per gram | 10440 350 mAh 9 ± 1 g (144 Wh/kg) against LP402535JU 370 mAh 8 g (171 Wh/kg); 175 against 208 h in 8 g | **OK**, round to the masses' precision |
| charging at 1C, 10 minutes | 1C for 10 min stays in constant current: ~1/6 of the battery, 7.7 h at 8 khz on the measured draw | **OK** (plausible; the CC/CV model not re-run) |
| wires: ribbon ~0.3 N damaged (film 0.07 N + traces 0.26 N each), 32 AWG ~7 N | reproduces; the old 200× corrected by b10 | **OK** |
| twisted pairs −36 dB at a 6 mm lay | derived, plausible order (≈ 20 log of the half-twists); not re-derived | **UNCLEAR** (minor) |

## 9. Intro (b01): budget, density, flick

| item | check | verdict |
|---|---|---|
| budget parts (wheel 1.02, screws 0.418, inserts 0.516, lead 0.080, board 5.6, buttons as XBAB's XA25) → shell and skates 10.35 g | every derived part reproduces from its volume and density | **OK**; precision: the battery's 8 g is a whole-gram listing (Farnell 380 against Endrich 370 mAh): the shell's share is ±0.5 g |
| density 29.31 / 297.03 = 0.0987 → 0.099; X2F 0.1746 → 0.174 | rounded against Theseus | **OK** |
| 15.2 g study body against the 10.35 g budget | plain-wall law (m^2.37): 0.40× the stiffness at 10.35 g | **CONVENTION**: absolute shell figures must keep saying "the 15.2 g stress study" (F21.1) |
| b01_lighter flick (132 → 66 ms, 12.6 mm past at 70 ms) | arithmetic right; times ∝ the whole moving mass: with 10 to 20 g of fingertip 38 to 43 % sooner and not back by 70 ms; with the hand (420 g) 6 % | **FLAWED** as headlined; the integrator scoped it to the fingers' correction with m_eff (Q2 sourcing finger masses); Chen, Lee & Cheng 2012 (a 130 g minimum for wrist motion and muscle activity) must be faced |

## 10. Ownership (b11)

| item | check | verdict |
|---|---|---|
| 220 → 349 HV | ISO 898-1 class 4.8 top, ASM Ti-6Al-4V annealed | **OK**; indents ∝ √(1/HV), wear depth ∝ 1/HV (Archard): right |
| inserts 90 / 70 / 0 % | Brock's estimates, labelled; 255 N = 26.0 kg | **OK** |
| thread wear verdict 82.8 → 98.6 % | release torque after ten re-screws (Cumbicus 2023) against pull-out strength after twenty loadings (3D People 2022) | **FLAWED** presentation: two measures under one arrow |

## 11. Conventions carried from the old deck

| convention | finding | verdict |
|---|---|---|
| the break rule (120 MPa for everything) | favoured bending-dominated rivals' failure | **changed by Brock, F41.1** |
| squared heat scale (F19.3) | b05 and b06 colour through γ 2 and draw no key | **must disclose** (key or a line) |
| heat colour by stress or by use | with two strengths, MPa no longer says how near a part is to breaking | colour by use where a slide speaks of breaking (b06 does on the arch) |
| rounding | gains are floored and rivals' faults rounded in the rival's favour (b01, b03, b05, b07): consistent "never in Theseus's favour" | **OK**; keep one rule per number across slides (the plan's "+21 %" is printed +20 %) |
| one precision per comparison (G5) | violated by false precision: b07_balance 0.01 mm, the budget's battery at 0.01 g, b10's Wh/kg | **should** |
| baselines | no builder uses a bar chart with a non-zero base; the one log axis (b06_light) is stated | **OK** |
| board colour | Theseus black mask + gold in every view; rival grey; pcbSec's default green | **decided 08:54** (integrator forwarding to H1) |
| material constants | FR4 19 against 20 GPa, Mg 46 against 44.8 GPa between files | one value per material |
| one battery story, one 8 khz draw, one test strip for the shell | 200 against 208 h; 45 against 40 h; b05's 60 mm section at 67 N against b06's 62.5 mm strip at 10 N (critic F4) | align across chapters |
