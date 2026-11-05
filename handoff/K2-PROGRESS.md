# K2 progress (board, sensor marking, magnetic encoder, Electronics notes)

Started 2026-11-05 ~04:10. Brief: handoff/k2-prompt.md + k-common.md. Read: FEEDBACK (all), BRIEF-V5, BRIEF-COMMON, DESIGN §0, §2b.

## Blocker found and handled
- pypi.org refused by the proxy (403), npm too: shapely, mapbox_earcut, HersheyFonts, segno are missing (trimesh is not
  used by 3d/pcb). Coordinator OK'd a stand-in: **3d/pcb/tools/shim/** (sdfgeom.py: exact signed-distance grid,
  H 0.01 mm, ring tol 0.002 mm; earcut via three.js over a pipe; OpenCV QR; OpenCV glyphs grown to stroke width),
  loaded by tools/deps.py only when a package is missing. README to write.
- Validation: today's design rebuilt through the shim = 141,233 tris / 5.51 MB vs 141.8k / 5.45 MB; DRC 0 issues;
  top render matches (text calibrated to the old board: 'MAIN PCB V1.0' 4.83 x 0.47 mm vs 4.69 x 0.46).
- build_pcb.py takes PCB_OUT=<dir> (build elsewhere first); test.html takes layout=<url>.

## Status
- [x] 0. Survey
- [x] 1. Board (3D): built (build2), DRC 0, in place at 3d/pcb/pcb.glb + layout; before/after board-first.png sent 05:1x
- [x] 1b. Sensor marking PAW3970DM-T5QU (3d/parts/boardparts.js), label + 2D code removed
- [x] 1c. In place; bundle rebuilt (meshopt compressor missing: @gltf-transform gone, npm refused -> pcb.glb ships raw 6.9 MB, 2.99 MB packed); pcb 2D twin rebuilt
- [!] 1R. BROCK REVIEWED board-first.png (9 notes, coordinator msg ~05:45): board redesign in 2 steps.
      Step 1 DONE: scratchpad/k2/board-plan.png (plan.py, outline_v3.json in plan/) sent to main. WAITING for Brock's OK.
      Plan: notch back (battery bay), r 1.5 everywhere (USB tab 0.6), lobes r 3.35 round MH3/MH4, front 48.0, width 38.06;
      sensor (0, 20.4); MCU (0, 4.5) antenna to the front; PMIC (-10.2, 20.4) block 9.2 x 9.6; window (10.0, 20.1);
      J2 (14.5, 8.5) opening back; J3 (-14.5, 8.5) opening left; mosaic: fillet each triangle (r 0.2), keep partials.
      Step 2 (after OK): parts.py, routes.py (re-route nearly all), board.py, silk.py, pcb.js (no 180 deg U1 turn), build.
- [x] 1R2. ~06:20 coordinator: rejected v2 board OUT of 3d/pcb: pcb.glb + pcb-layout.json restored from git HEAD (v2 kept in
      scratchpad/k2/build2/), bundle rebuilt (dist/assets/pcb.glb = HEAD), pcb twin rebuilt (HEAD board + marking + wheel),
      10-f-elec.js ELC_OUTLINE + edge vias back to HEAD (magnetic encoder drawing kept). Build into my own folder (PCB_OUT).
- [x] 1R3. PLAN 2 (F30.10-F30.12) = scratchpad/k2/board-plan-2.png (plan/plan2.py, outline_v3b.json, webs*.py/json).
      Chamfers back (front-tab 45 deg 3.5 mm moved with the front; notch 30 deg; waist on today's lines); main corners r 0.75
      (tab 0.6); front = GT01 pin 39.60 + 8.24 = 47.84 (overhang 2.04 over its foot 6.20, K1's trace) = +1.61 on today;
      equal centre gaps 1.60 x3 -> sensor z 19.45, MCU 4.80 (pads 7.2 behind centre), PMIC (-10.2, 19.45), window (10.0, 19.45);
      notch line -4.0 (LH webs 1.35/1.17), lobe bottom -5.6, notch chamfer (9.76,-4.0)->(12.53,-5.6); sides W 19.80 (SH webs
      1.03/1.23); thinnest web today 0.27 (SH1), plan1 0.26, plan2 1.03 except USB-C front legs 0.44 (unchanged footprint);
      area 1863 -> 2003; shell wall >= 4.0 at the sides; balance stays at z 0 (battery unmoved); lens 1.12 -> 16.57.
      WAITING for Brock's OK -> then build step 2 straight away. Questions: rear outer corners fillet vs chamfer; W 19.80 vs
      drop SH1/SH2; USB legs keep vs J1 back 0.6.
      BROCK ANSWERED (~06:45): rear corners "[No preference]" -> keep r 0.75 fillets; "Drop SH1 and SH2" -> W back to
      19.03, SH1/SH2 removed (plan2.py + webs_plans.py updated, re-rendered: thinnest web 1.08 = SW1 key peg to the side,
      as today; area 1949; shell >= 4.6 at the sides); USB legs "Keep as today". He picked "Changes first": more changes
      coming -> re-render then; HOLD step 2 until the coordinator forwards them.
- [x] 1R4. PLAN 3 = scratchpad/k2/board-plan-3.png (plan/plan3.py, outline_v3c.json), sent ~06:50. Brock's notes: one
      radius r 0.75 everywhere (tab, bay, window, cut-outs; chamfers straight, ends filleted); USB-C flush (J1 z 48.825,
      -1.605; bay front 44.95 -> 43.20); LH1/LH2 dropped (nothing in shell/plate meets them); own cut-outs: rear pair
      rr 3.6 x 7.0 at (+-10, 0.5) r 0.75 (webs 1.00 notch / 1.24 MH), -0.12 g; underside = today's art adapted (lattice
      s 2.45 origin (0,-3.2), gold fg (17.5,-3), silk fs (-17,44), triangles r 0.15, THESEUS z 2.6, fab 0.45/-0.5, QR
      (-11, 9.8), TPs z 13.0 x 11.2..17.2, LT/RT z 32); power switch A (window) vs B (PCM12SMTR at right waist edge
      z 19.45). USB mouth vs shell opening: 3.0 short today, 4.6 flush (shell mouth mouse z 54.23, centre y 5.25; J1
      top-mount centre 6.61). Questions sent: USB a/b/c, switch A/B, cut-outs keep/drop. HOLD build.
      GT01: K1 fixing walls; follow scratchpad/k1/GT01-PLUNGER.md when it changes (check mtime before step 2).
- [x] 1R5. Brock on plan 3: cut-outs "Drop them"; BOTH switch variants to build (A window = deck board, B edge = 2nd
      build for renders); USB flush/no pref; more changes -> PLAN 4 = scratchpad/k2/board-plan-4.png (plan/plan4.py,
      outline_v4.json), sent ~07:20: front = one trapezoid (flat top z 52.50, half-width 5.80, 45 deg chamfers to ZF
      47.84), J1 back at 50.43 (hangs 1.60, legs 0.44 as today), bay front back to 44.95; fillets by EQUAL TANGENT LENGTH
      T 1.0 (r 1.0 right angles, 2.41 chamfer ends, 1.93 / 1.67 waist, 3.73 notch 30 deg); bay gold trim 0.35 (r 1.0);
      window r 1.0; triangles keep r 0.15. Shell min 0.62 at the front centre (as today). HOLD build until OK.
      K1 fixed GT01 walls (one wall 0.45) -> new outline in scratchpad/k1/GT01-PLUNGER.md: apply in step 2.
- [x] 1R6. PLAN 5 = scratchpad/k2/board-plan-5.png (plan/plan5.py, outline_v5.json), sent to main 07:11. Brock on plan 4:
      one notch depth D 3.61 (= waist 19.03 - 15.42), one chamfer angle 35.24 deg (atan 0.70656, the front waist chamfer,
      today's line; 45 would cut the GT01 back corner 0.7) -> front trapezoid flat edge z 51.45 (XT 5.85), rear lobes to
      z -7.61 (notch line -4.0, XN 9.76 -> XB 14.87; battery corner 0.53 clear), fillets T 1.0 (r 3.15 at 35 deg, 1.0 at 90).
      Symmetry note (Brock): outline = one half mirrored (error 0.0000 mm); BAY moved 0.15 mm to the user's left:
      x -7.05..+7.35 -> -7.20..+7.20 (WB1 inner tabs 0.05 -> 0.20 from the cut, ENC1 drills 1.75 -> 1.60); MH in mirror
      pairs: MH1/MH2 (+-10.10, 29.50), MH3/MH4 (+-14.59, -2.25) (moves <= 0.10; nothing in shell/plate mates them).
      Conflict: USB-C front leg slots end z 52.06 = 0.61 past the edge. Choices sent: (a) J1 back 1.05 to z 49.38 (legs
      0.44, hangs 1.60, bay front -> 44.13, mouth 4.05 short of the shell) or (b) front keeps plan 4's 4.66; holes mirror
      vs keep. Thinnest web, receptacle aside: 1.08 (SW1 key peg). HOLD build until Brock's OK.
- [!] PAUSED 07:11 by the coordinator (Brock's usage window 77 %): stop after plan 5 + this update; do NOT start the
      srf_encoder or Electronics work until resumed (~08:20).
- [x] elc_sheet2: HIDDEN_elc_sheet2 (12-45-elec.js). srf_encoder -> ch 'elec', after 'software', title "Nothing lights up
      but the sensor" (encoder + mechanical switches 18%->0% (clk_switch derived) + no RGB 27%->0% (logiRgb)), rev 1 +
      answers incl. sealed + elc_sheet2 clauses; honest note: Hall sensor 0.8 mA when awake > optical LED -> wake to read.
- [x] cells: Li-ion row = 10440 (akkuteile: 350 mAh, 9 g) not 18650; caption + gloss: +1.5 g at the same capacity; rev 1.
- [x] elecsheet1: coat panel shows water: bare board shorts / coated beads up; +0.06-0.24 g (<1 %); "few mice do it"; rev 1.
- [x] 8. Wheel tread back to the fine straight knurl (144, 0.12 deep), thin arms kept, tC 1.040 -> 0.900 g (508.5 mm3);
      bundle + wheel/pcb twins rebuilt; `wheel` slide: only the two strings naming the diamond knurl changed (its
      srf_knurlStrip drawing still draws diamonds: flag to coordinator).
- [ ] 1d. Hand-drawn 2D board: ELC_OUTLINE (done for v2; redo for v3), ownboard, ownbatt, elc_*
- [~] 2. Magnetic encoder: research done (sources below); 3D done (bundle + wheel twin); 03-parts.js encoderMM ->
      k2_encMagFront; srf_encoder rewritten in 10-e-surface.js ("Nothing lights up but the sensor": mag / sw / rgb rows,
      render tile + 5 callouts, honest 0.8 mA note, 11 sources). NEXT on resume: re-shoot srf_encoder (row-text fix
      applied, not shot), 3D shots; flag srf_knurlStrip (diamonds) in the report.
- [ ] 3. framesync: keep figures, simplify (G10) - not started
- [~] 4. Elec notes: cells DONE, elecsheet1 DONE, elc_sheet2 DONE (hidden, merged into srf_encoder); cable REWRITTEN in
      10-f-elec.js (elc_paracord / elc_plugSide / elc_bez / elc_chargeSide, shell twin side view; backup
      elec10f_before_cable.js) - its reshoot (shots/e3, task bglmx230e) finished but NOT yet viewed/fixed; elc_oneside
      ("even better visualized"), software, motion - not started. Hand 2D boards (ELC_OUTLINE, ownboard, ownbatt,
      elc_*) wait for the step 2 board build.
- [ ] 5. Checks: errs 2D/3D, qa settle/mid, shots, 384px contact sheet
- [ ] 6. Report

## Board decisions (layout frame: x = user's right)
- F26.4 J2 (battery) (14.0, 3.2) rot -90 -> (8.6, -0.9) rot 180: opening faces the back, plug tail at z -5.5 by the
  rear edge, lead straight back to the battery (centre mouse z -22.7). VBAT/NTC re-routed; DRC 0.
- F26.5 outline (board.py THESEUS_RIGHT): sides +/-19.4 front and back (were 19.03 wings / 18.52 back), ears gone,
  wing front 46.23 -> 49.0 (GT01 top-front corner is 8.24 ahead of its pin: overhung by ~1.6 mm), fillets r 0.4-2.0,
  rear corners r 4.7. Outline 2031.7 mm2 (was 1863). Shell section at board height: min clearance stays 0.32 at the
  USB-C tab (unchanged); new wing corner ~2.3 mm from the wall; rear corners 7+ mm.
- F26.6 first rebuild: opening r 0.25 on the whole mosaic (Brock: triangles 'missing'); plan: fillet each triangle on its own.
- F26.7 MH3/MH4 unmoved; board round their gold rings 0.53 -> 1.25 mm. (SH1/SH2 0.26/0.24 -> 0.41/0.60.)
- F26.8 SW3 now bridges the window at its centre (10.725, 20.095), actuator down through it (new SLIDEB footprint);
  ON/OFF labels moved to the window's free side; VDD_1V8 trace and a VBUS via moved to make room. Brock: "Middle of the
  shell's notch"; the shell model has none (Theseus base: open rim 54.9 x 103.3 / plate skin with only the sensor window
  6.42 x 15.42 at (0, 1.12); Sora variant: none). Brock then chose "Decide with the bottom cover": switch stays as built.
  REPORT both positions: Sora V2's real slot (scan_bottom.png, 7.0 px/mm): ~14.5 mm to the user's right of centre, level
  with the sensor (+0.4 mm), ~4 mm round-ended slot = layout ~(14.5, 4.4), mouse ~(-14.5, 1.5); room freed by the J2 move:
  a 3.8 x 4.3 window could sit at layout z 2.25..6.55 there, clear of MH4's ring and L2 (C33 to nudge).
- F26.9 sensor: PAW3970DM-T5QU laser-marked; pattern <PMW|PAW><model>DM-T<n>QU from PMW3360DM-T2QU, PMW3389DM-T3QU,
  PAW3395DM-T6QU (LCSC), PAW3950DM-T5QU (EPS Global); suffix -T5QU derived (keeps the PAW3950's).
- GT01 (K1's GT01-PLUNGER.md, appeared 04:29): components.py stand-in rebuilt on K1's side profile (lift 1.669,
  shoulder 2.5, plunger zs 2.0, cap 2.1 x 1.5 turned 90 deg, 0.8 proud). In the deck the board uses parts/gt01.js (K1's).

## Clause ticks
(per slide, filled as slides are done)

## Encoder sources (research)
- Conntek KTH5791: 3D Hall for mouse wheels, replaces mechanical encoders, contactless; 0.8 mA typ / 1.5 max @3.3 V; ABZ, CPR
  16-1024; QFN 3x3; "10M+" life, "no mechanical wear" (maker). conntek-design-center-bu1.pages.dev/products/3d-hall/KTH5791
- MPS app note "Using MagAlpha devices to replace optical encoders" (2015): optical "subject to problems due to contamination
  (dirt) obstructing the optical path, leading to failure"; magnetic: "insensitivity to dust and dirt".
- Razer blog "Why the Razer Viper V4 Pro goes all in on optical": optical encoder "3.3 times more reliable than mechanical";
  contact encoders: "wear can show up over time as unwanted scroll behavior, including ghost inputs or reverse scrolling".
  No battery-share quote there (Brock's "almost half" not found).
- Avago ADNK-3043 wireless mouse design manual: optical wheel encoder, "IR LED ... pulsed on for approximately 40 usec every
  2 msec while in ACTIVE mode" (2%). No LED current given.
- Kailh 13 mm mechanical mouse encoders: rated 300,000 / 800,000 life (Global Sources listings).
- MDT TMR sensors for gaming (TechPowerUp 2024-11-12): "less than 0.3mA"; scroll wheels "being actively developed".
- TI TMAG5111 2D dual Hall latch (quadrature): 6 mA (too much for a wireless mouse).
