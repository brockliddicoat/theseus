# M (model and convention auditor): progress

Brief: /home/claude/theseus/handoff/revamp2/models-brief.md. Audit: MODELS-AUDIT.md (this folder, written as I go).
Findings for builders: /home/claude/work/review/<code>.md (newest first, dated, "MODEL"); prepend with prepend.py.
Test scripts: /home/claude/work/models/tests/ (load-sim.js loads 07-sim.js in Node; buckle.js = linear buckling).
Published values / textbook checks needed: add to /home/claude/work/research/REQUESTS.md (answers in FILLS.md); no WebSearch.

## Order (caller's priority)
1. 07-sim.js (shared solver) .......................... DONE (OK; notes below)
2. Shell strength models: b05, b06, b07 DONE
3. Click geometry: b02 DONE 09:05, b03 DONE 09:07
4. Weight budget and density (b01) .................... DONE 09:10
5. Battery life: DONE 09:11 (b01, b03, b09, b10 notes)
6. Glide, surface, elec, own: DONE 09:13. Conventions DONE 09:15. MODELS-AUDIT.md written 09:17.
7. Re-checks: b05/b06/b07 follow F41.1 (09:15: b05 yes, b06 arch yes / strips no, b07 leads with stiffness); b01_lighter
   rebuilt and OK (09:18). Corrected my own b02 nickel error (5.0 g = 5.0 gf) at 09:19.

## Status: audit complete; final report sent via SubagentHandback

## Audited so far (08:50)
- 07-sim.js feSolve: OK. 35 textbook checks pass (t-sim-textbook.js): cantilever δ, θ, σ; simply supported; fixed-fixed;
  axial; 45° bar; pin triangle forces; pin square = mechanism; braced square; rigid square; the rotational whisper
  harmless. Stress = |N|/A + |M_end|·c/I (correct peak fibre for nodal loads). Units mm, N, MPa, g OK. Limits to state:
  Euler-Bernoulli (no shear: +10 % deflection on the 10.4 mm deep web), joints are points (overlap mass), no out-of-plane
  behaviour, fillets are drawn only (feFillets) and change no stress.
- feEngaged (07-sim.js): FLAWED as a "weight that works" measure (whole element counted if one end's outer fibre ≥ 30 %):
  plate 70 % vs true 34 % at the same threshold. Not used by builders yet; say so in the audit.
- SIM_MAT: PP-C-20A E 13.5 GPa is the FLEXURAL modulus (datasheet), ρ 1.01 OK (rule of mixtures 1.00); FR4 19 GPa in
  SIM_MAT vs 20 GPa in B05_MAT (Gund: 20 lengthwise, 18 crosswise): inconsistent, pick one (convention).
  Mg AZ91D 46 GPa (az91d makeitfrom) vs 44.8 (shlMg MatWeb) in B05_MAT: same issue.
- shlHot (10-d-shell.js), used by b05_nopick/hotspot/margin/work: peak sampled 6 % low (FLAWED, fix written);
  "cracks at 67 N, hardest squeeze" not supportable (FLAWED); labels (web vs wall; sized truss called Theseus) (FLAWED);
  in-plane buckling OK (175 / 193 N > crack loads); work shares 18/25/90 → 15/24/87 with true peak, threshold-sensitive.
- 3D study SHL_FE / lattice.json: the squeeze case has triangle ribs P99 5.55 vs plain wall 4.14 MPa (+34 %); press −12 %;
  stiffness 2.0× press, 1.36× squeeze. Old meter used press only (cherry-picked load case). Old shlShell3d said "busiest
  rib runs 12 % under the plain wall's peak": P99 vs P99, not peaks (rib max 4.33 > plain wall P99 3.84).
- B05 tables (b05_material, b05_specific, b05_wall, b05_cubed): numbers reproduce. Specific stiffness/strength: textbook
  E/ρ and σ/ρ rank PP 3rd; only thin-wall bending indices give 1st/2nd: label must say "bent, at one weight".
- Heat scale: shlSigG squares the colour (F19.3); shlRamp draws the key with the same gamma, so a key read is honest
  when the key is drawn. TODO: check every slide that uses shlSigG also draws shlRamp with gamma.

## Findings appended to review files
- review/b05.md 08:45: M-b05-1..5 (sampled peak; hand-squeeze tie; labels; work shares; specific-strength label)
- review/b01.md 08:48: M-b01-1..3 (flick model: moving mass m_eff; friction/force assumptions; Chen 2012)
- review/b06.md 08:52: M-b06-1..5 (buckling, already fixed by b06; strip vs shell scope; arch buckles 41 N, plate
  needs a roller, thrust cancels 84 % of the moment, not pure compression; thrust line leaves the arch under a pad)
- review/b05.md + b06.md 08:52: CONVENTION break rule (120 vs 207 MPa in bending: 1.91→1.36×, 1.42→0.86×, 3.8→2.0×)
- review/b03.md + b11.md 08:54: CONVENTION board colour (black + gold Theseus; grey rival; pcbSec default for H1)
- SendMessage to main 08:55: board rule, break-rule question for Brock, b01 verdict
- review/b07.md 08:59: M-b07-1..5 (arms comparison selective: arms tie 3× stiffer, Theseus's rib feet 5.9 % vs 1.9 %;
  483 MPa unsourced; board OK with T-section stress caution; stack-up OK with mold-bias note; balance false precision)
- review/b05,b06,b07.md 09:03: F41.1 updates (exact numbers under two strengths; feUse/feBreakAt for 07-sim.js)
- review/b02.md 09:05: M-b02-1..6 (cutouts OK; direct: 34 % is travel not force; tensioner: spring share only, 68→49 gf
  total, Starlight X modelled in PP; front example groove; flush OK; pom pad tolerance)
- review/b03.md 09:07: M-b03-1..4 (17.6 % is Omron's test pulse; SPDT NC pull-up draws ~0.14 mA unless strobed;
  4.4 ms is Lamzu defer-type; ±2 gf bin is 7.3 % not under 7 %)
- review/b01.md 09:10: M-b01-4..8 (budget OK, battery listed to the gram; density OK; derived hours not an upper bound;
  200 vs 208 h and 45 vs 40 h at 8 khz; 15.2 g study vs 10.35 g shell)
- review/b09.md, b10.md 09:11: battery life OK; one 8 khz draw; per-gram precision
- review/b04.md, b08.md, b11.md 09:13: optics OK (+ UNCLEAR: ADNS-3080 slope); sag OK; film OK; grip source; hardness OK;
  b11_wear verdict mixes two measures (must)

## Brock's decisions that change models
- F41.1 (08:58): two strengths, 120 MPa stretched / 207 MPa bent; slides whose point fails lead with stiffness. Updates
  posted 09:03 to b05, b06, b07 (exact numbers, feUse/feBreakAt helper for 07-sim.js). Re-check their sims as they rebuild.

## Requests from the integrator
- DONE 08:48: audit b01_lighter's flick model (30-b01-intro.js, B01_LT): mouse-only mass under 0.54 N, "back on the target in half
  the time"; b01 is scoping it to the fingers' final correction; check against a moving-mass model (mouse + finger
  segments; Q2 sources their masses, in research FILLS.md). Verdict to review/b01.md as MODEL. IN PROGRESS.

- 09:0x: convention: board colour in section vs plan (boardMM black mask #16171a + gold #d9b25a; the section helper in
  03-parts.js defaults to green #1c3a29; b03 and b11 draw Theseus's board green in section: b03_switch, b03_hotswap,
  b11_inserts). DONE 08:54 (rule in review/b03.md, b11.md; sent to main).

## Next
- Nothing pending in this run. Not yet audited (not built at 09:20): b06_mold (heads-up posted), b06_fibres
  (Stokes/Jeffery flux bookkeeping), b10_twist (−36 dB), b01_targets / b01_listed / b01_rank / b01_price, b09 latency rows.
