# H1 progress (board plan 5, GT01, battery, sensor, wheel, encoder, 2D drawings)

Started 2026-11-06 ~07:25. Brief: /home/claude/theseus/handoff/revamp2/h1-brief.md (+ common.md).
Resume rule: read this file top to bottom, then continue at the first unchecked item.

## Status
- [x] 0. Reading: common.md, h1-brief.md, FEEDBACK F21/F22/F25-F33, K1/K2 progress, GT01-PLUNGER, INTEGRATOR-NOTES,
      k2-prompt, CONVENTIONS, pcb README, plan5.py, outline_v5.json, board-plan-5.jpg, refs (Sora V2 board, Raytac, FP-3)
- [x] 1. Tooling: pip real shapely 2.2.0, mapbox_earcut, segno 1.6.6, Hershey-Fonts 2.1.0, manifold3d (shim kept, unused
      now: deps.py only adds it when a package is missing). `cd 3d && npm install` + @gltf-transform/{core,extensions,functions}
      4.5.1 + meshoptimizer 1.3 added to 3d/package.json (compress.mjs needs them). playwright: /opt/npm-tools/node_modules.
- [x] 2. Board plan 5 DONE + INSTALLED (09:01): pcb.js no U1 turn (flipFootprint/moveKeepout removed), no peg caps, origin
      centring from the outline; components.py module AN54LM-P20A black + long meander antenna, ENCM + SLIDEE templates,
      leads from the new J2/J3; silk.py plan-5 top labels (checked for collisions: work/h1/tools/silkcheck.py) and plan-5
      underside zones (QR (-11,9.8), wordmark z 2.6, fab, lens, window, rail labels, LT/RT z 32); power_paths.py derived
      from the routes (graph search, vias/pads as hubs); mass.py (ENCM 1.0, support 0.26, wheel 0.900, axle 0.116, CoM);
      build_pcb meta: variant, antenna, battery. routes.py: B's right channel turns in at z 26.5 + B's SW_PWR route. DRC 0
      A and B. Installed pcb.glb/pcb-layout.json (A), pcb-b.glb/pcb-layout-b.json (B). README updated. Board+parts 6.66 g,
      +wheel assy 8.94 g (Sora 8.29). (tools: board.py outline/holes/bay, parts.py placement + magnetic encoder 4-pin fp + no GT01 peg,
      routes.py full re-route, silk.py top/bottom art, components.py, pcb.js no U1 turn) -> PCB_OUT scratch build -> DRC 0
      -> compare with board-plan-5.jpg -> install. Variant B (edge switch) = second build (PCB_VARIANT=B).
- [x] 3. Battery DONE: BATTERY in board.py (LP402535JU x -17.09..17.91, layout z -34.57..-9.57 = 2.23 back; KEY_PARTS y
      12.45..37.45). Tail clearance (shell GLB body+triggers+sides+bay, sampled tris): 3.84 mm min after (4.99 before),
      at X -17.4 y 1.8 z -38.6 (the rim ledge). Balance (3d/pcb/tools/balance.py; budget masses at 3D centroids, board CoM
      from parts): CoM z before (v1 board, batt -22.72) -0.87; plan 5 batt unmoved -1.00; after (batt -24.95) -1.61 mm;
      CoM z 0 needs batt centre -19.05 (front -6.55: 3.9 mm over the rear lobes, over MH3/4 screw heads + C10/C11 -> not
      at board height). FINDING: the 2.23 mm came from K2's 20-wide 502030 in the notch; the deck's 35-wide LP402535JU
      sits behind/above the lobes either way (old place overlapped the lobes 0.27 mm in plan, 0.43 above the board top).
      -> question for Brock (keep 2.23 back / return / raise forward). Was: rear notch = side notch length (flat 13.09: XN 6.545, XB 11.654); battery (LP402535JU, key plan) back
      2.23 mm; check shell clearance in the tail; CoM before/after (z), report.
- [x] 4. Sensor forward DONE 3D (2D follows in job 7 / KEY_PARTS): boardparts.js lens 1.12 shallower; shell meta.sensor
      [0, 16.57]; shell.js lens LENS_Y0 2.40 (was 1.0), discs +1.12, lens-dot pads tP = 2.40 - 0.65 = 1.75 (was 1.0);
      plate rebuilt in scratch then installed (frame regenerated NSUB 3 round the window at z 16.57, widths per kind = v3
      FE means: ring 0.948 twin, tie 0.699 twin, fine 0.396, spoke/keel 0.5, edge 0.512; ribs 2.3, skin 0.6; 4.67 g raster
      est.; NOT re-solved by plate_fe; meta.plate.frameNote says so); skates.js buildSkateSets(opts.sensor, opts.lensY)
      + entry.js passes meta.sensor (base window, ring, lens set move). Backups: work/h1/*.before.*. Tools: plate_layout
      SHELL_META/PLATE_DIMS/KIND_W/FRAME_NOTE env, plate_mesh PLATE_LAYOUT/PLATE_WORK, plate_write SHELL_GLB/PLATE_WORK/
      PLATE_LAYOUT. Was: mouse z 1.12 -> 16.57 (layout 19.45 - 2.88). Shell meta.sensor, plate window/ring, lens, lensDots,
      2D key plan + boardMM.
- [x] 5. GT01 DONE: gt01.js WALL 0.70 (cover walls 0.45), holes r 0.76/0.79 at the render's centres, slot to the
      render's (0.15, 2.30) 2.11 x 1.10, side skins 0.70, webs >= 0.92 (work/h1/gt01/walls.py); clk_gt01MM same numbers
      (CLK_G1.wH/wC/holes); parts README. Was: GT01 walls: one wall 0.70 mm (median of the 12 webs measured on Gateron's side-on render, 0.3..2.1); slot back
      where the render has it (1 mm lower than v23); windows refit; 3D gt01.js + 2D clk_gt01MM + components.py stand-in.
- [x] 6. Wheel/encoder DONE: scrollwheel.js J-hook legs -> SMD side feet on F1/F2 (7.88..8.82, z +/-5.55..6.51), support
      on WB1 (base 7.75..13.05 with SW4 window, tabs, post 7.9..9.7, seat 5.3..7.9 over the bay), axle xL -7.7; wheel 0.900 g
      verified (6 arms, 144 straight grooves); k2_encMagFront draws the feet. Was: Wheel + encoder: K2 did it (6 arms 0.55, straight knurl 144, 0.900 g, magnetic 4-pin, clear top). Verify only;
      board footprint ENC1 -> 4 pins at 1.25 (x -9.15).
- [x] 7. 2D DONE (snapshot: 03-parts, 10-b-click, geo2d/*; integrator told 09:18): geo2d regen DONE (shell pcb gt01 wheel skates; build.sh now --with3d), board2d.json + board2d.py, boardMM from
      GEO2D.board2d (old drawing kept as boardGenericMM / o.generic), pcbSec black/gold/rival (integrator ruling),
      extras.py no keep-out mirror. errs ok on 23 + 72 slides (Q=&2d=1). Was: 2D: boardMM <- deck/geo2d/board2d.json (exported from the PCB layout: outline, holes, copper, pads, silk, bottom
      art); keyPlanMM (board outline, sensor, antenna, battery); clk_gt01MM; encoderMM (already magnetic); geo2d regen
      (bundle first). SHARED-CHANGES.md line per change.
- [x] 8. Review image DONE: /home/claude/work/h1/review.png (tools/compose_review.py; harness renders from builds
      main-h1 (after) and main-h1old (before, --base=/tmp/h1base)). Was: Review image /home/claude/work/h1/review.png (board top/bottom A and B, GT01 profile, key plan battery+sensor,
      before beside after).

## Integrator requests (act on before finishing)
- 08:2x KEY_PARTS: add one constants object `KEY_PARTS` in deck/src/03-parts.js (sensor, lens window, battery, board
  outline anchor, antenna, skates, power switch; key-plan mm); keyPlanMM reads it; deck/src/06-motion.js mouseSimple reads
  KEY_PARTS instead of its own copies (MS_BATTERY etc.; authorized for that only, no signature changes). When both pass
  errs: copy both to deck/.snapshot/src/; log in work/h1/SHARED-CHANGES.md AND in the "Changes" section at the end of
  handoff/revamp2/KIT.md.  [x] DONE: deck/tools/geo2d/key_parts.py generates the
  KEY_PARTS block (markers KEY_PARTS:BEGIN/END) in deck/src/03-parts.js from 3d/pcb/tools (board.py outline/holes/bay/
  BATTERY, parts.py placement, layout.py ANT_KEEPOUT) + shell meta + plate-layout; also BOARD_OUTLINE (mouse [X,Z], for
  b07). keyPlanMM reads it (board = plan-5 outline, antenna, sensor, skates, battery; new o.hi 'lens','power').
  06-motion.js: MS_CORNER_DOTS/MS_BATTERY now derived aliases of KEY_PARTS, msLive() from KEY_PARTS (no GEO2D scan),
  antenna rect, side-view battery height (yMid/t) and sensor bottom (lens y0), board drawn as plan-5 outline. Build
  main-h1 OK. errs (Q=&2d=1, TIMES 0.5,4) on 72 slides: ALL OK. Copied 03-parts.js + 06-motion.js to deck/.snapshot/src/,
  logged SHARED-CHANGES.md + KIT.md §4, integrator told. DONE.
- Brock's standing rule (08:18) + BROADCAST-0845: check every reused model/number/convention/label (units, assumptions,
  physics, source, evidence label, rounding) and record it under "## Models and conventions checked" (what, where, check,
  verdict). Read /home/claude/work/review/h1.md (critic + model auditor) before the report; act on every "must", reply
  FIXED / WHY NOT under each finding. True greys only (C.* tokens). Kit mouse now at scan proportions (MS_DIMS 119.2 x
  62.5 x 38.1, F12.11): keep when adding KEY_PARTS.  [ ]

## Decisions / numbers
- Layout frame: x = user's right, z = nose; mouse z = layout z - 2.88; mouse X = -layout x. Key plan: x = layout x,
  y = -(mouse z).
- Plan 5 (plan5.py): W 19.03, WX 15.42, D 3.61, chamfer 35.24 deg (atan 0.70656), ZF 47.84, ZT 51.45, XT 5.85,
  ZN -4.0, ZB -7.61; fillets equal tangent length 1.0 (r 3.15 at 35 deg corners, 1.0 at 90). Sensor (0, 19.45), MCU
  (0, 4.80) antenna FORWARD (integrator 07:4x: no 180 turn, AN54LM-P20A long meander antenna, black body; fix
  pcb-layout keep-out + description), PMIC (-10.2, 19.45), window A (10.0, 19.45) 3.83 x 4.29, J2 (14.5, 8.5)
  opening back, J3 (-14.5, 8.5) opening left, TPs z 13.0 x 11.2..17.2, MH1/2 (+-10.10, 29.50), MH3/4 (+-14.59, -2.25),
  LH/SH dropped, bay x +-7.20 z 27.45..44.13 (F30.25: front back to 44.13), J1 z 49.38 (back 1.05, hangs 1.60).
- F30.25 to apply: bay corners chamfered at 35.24 deg + T 1.0 fillets + 0.35 gold trim; rear notch as long as the sides.

## Notes
- K2's old scratchpad (/tmp/.../scratchpad/k2) is gone; plan5.py's paths point there (not needed).
- The 3D battery part is a 502030 (20x30x5); the deck's battery is the LP402535JU (35 across x 25 along x 4.0),
  key plan centre mouse (-0.41 X?, y 7.46, z -22.72). K2's plan used the 20-wide one at layout z -4.82. Reconcile.

## Board progress (08:40)
- board.py: plan-5 outline (PLAN5_RIGHT mirrored, equal tangent fillets), rear notch XN 6.545 / XB 11.654, chamfered bay
  (3.61 x 2.55 corners, T 1.0 fillets), holes MH1-4 mirror pairs, window A (variant B: none). Area 1991.6 mm2.
- parts.py: plan-5 placement + pin maps (U1 L/R/B, U2, U3), ENCM (4 pins x -11.15 + 2 SMD feet), SLIDEE (variant B, top
  side at the right waist edge), GT01 without the peg hole. J2/J3 at z 7.9 (TP row at 13.0 needs the room).
- layout.py: ANT_KEEPOUT x +-6.6, z 7.95..12.25 (antenna forward); DRC extended with pad/via checks.
- routes.py: hand routes (USB-C front, left channel bus L1->L3->module, TWI, SB4/5, SPI, right channel, PMIC stubs) +
  routes_auto.py (tools/autoroute.py, grid A*, no L1 under U1/U3/U2/J1-3). DRC 0 issues, all nets connected.
- DONE since: board_geo stitching vias avoid L3 non-GND copper (bug fixed); trim-aware DRC (bay trim 0.35, window trim
  0.28) + autorouter trim keep, re-run: DRC 0; bay interior wall plated (build_pcb edge_gold); boardparts.js
  RADIO_SPEC 'Raytac AN54LM-P20A', LENS_SPEC belowBoardTop 2.63 / referencePlaneOverPad 2.40, buildSnapLens 1.12 mm
  shallower (b04 told, b04 matches in 2D). Old v1 routes: /home/claude/work/h1/routes_v1_backup.py.
- NEXT (job 2 rest): pcb.js (no U1 turn/flip/moveKeepout, no SW peg caps, origin), components.py (module long antenna
  black, ENCM stand-in, bracket at WB1, SW3 B edge, wires from new J2/J3, GT01 stand-in), silk.py plan-5 top labels +
  underside art, power_paths.py from routes, mass.py PER_FP (ENCM/SLIDEB/SLIDEE), pcb-layout meta (antenna text,
  keep-out), build A + B into scratch, compare board-plan-5.jpg, install.

## Waiting on me (builders)
- Integrator 09:0x (model auditor ruling): pcbSec (03-parts.js) default mask '#1c3a29' -> MT.mask (black), surface rings gold
  (#d9b25a), add a rival option (grey C.comp); clk_gt01MM/clk_hingeMM inherit. Fold into GT01 work, snapshot, one-line
  note (affects b03_switch, b03_timing, b03_hingeMM/b03_clawMM, b11_repair rival switch).  [x] done 09:17
- Integrator 08:5x: when GT01 / encoderMM / boardMM / geo2d regen land in the snapshot, message main ONE line on what moved
  on screen (they broadcast). KEY_PARTS broadcast done (BROADCAST-0850: b09 antenna, b10 board, b04 sensor, b07 outline).
- b07 reads MS_BATTERY / BOARD_OUTLINE (now provided, from KEY_PARTS); b04 reads the lens height (told 2.40) and sensor via
  GEO2D.shell lens mesh -> needs the geo2d regen (job 7) for the moved lens; everyone: snapshot copy of 03/06 after errs.

## Research gaps
- Raytac AN54LM-P20A: size confirmed 9.9 x 13.3 x 2.0 (research Q1, 09:03); recommended antenna keep-out NOT public.
  Needed: Raytac's AN54LM-P20A datasheet keep-out drawing (raytac.com product page / datasheet PDF). Feeds: boardMM, b09
  radio slides, pcb-layout antennaKeepout (now: the antenna end + 0.8 mm, representative).
- C&K PCM12SMTR body/actuator dimensions: not verified (09:15). Query "C&K PCM12SMTR datasheet dimensions actuator".
  Feeds: board variant B renders only.
- Gateron GT01 wall thickness: unpublished; measured off Gateron's side-on render (work/h1/gt01/measure.py), labelled DV.
- Magnetic encoder mass: no weighed part; ~1.0 g is a hollow-shell estimate from the 3D part (DV).
- b07 mass model positions (30-b07: body 12,166 mm3 at z -10.41 y 16.44; triggers z 31.97 y 22.05): re-computed from
  shell-theseus-1seam.glb (signed-volume centroids) -> match to 0.01. OK to reuse (balance.py uses the GLB directly).
- The 2.23 mm battery move (2026-11-05 decision): traced to K2's plan-5 drawing of a 20-wide 502030 front at layout -4.82
  in the notch (0.53 mm corner clearance). The deck's battery is the 35-wide LP402535JU, wider than the notch, behind the
  lobes: the notch length does not constrain it. Applied as decided; flagged for Brock with the balance cost (-0.61 mm).
- keyPlanMM's board (rounded rect 38.6 x 57.5 to mouse z 49.6): not the board's outline -> plan 5's outline from the tools.
- keyPlanMM's antenna keep-out (mouse z 10.87..14.57, "module turned 180"): wrong for plan 5 -> forward of the module
  (5.07..9.37) from layout.py ANT_KEEPOUT. extras.py's keep-out mirror (same assumption) removed.
- keyPlanMM's sensor circle at (0, 0) while shell meta.sensor was z 1.12: 1.12 mm off -> now from meta (16.57).
- kit side-view battery 5.05..9.05 mm vs the key plan's yMid 7.46 (5.46..9.46): inconsistent -> KEY_PARTS (yMid, t).
- mass.py: wheel 1.52 g ("parts estimate") and "axle, optical encoder, support ~0.9 TYP": stale (the wheel is 0.900 g since
  K2; the encoder is magnetic) -> parts spec (0.900, axle 0.116) + mesh volumes (encoder 1.59 solid / ~1.0 hollow, support
  0.26). Labelled DV.
- PCB lens height (boardparts.js): its lowest point 1.28 mm over the pad vs PixArt's 2.4 (2.2..2.6) reference plane (b04's
  finding, checked in the source) -> 2.40.
- K1's GT01 cut-outs vs Gateron's render (measure.py on the side-on render): holes and triangle within 0.1 mm; the slot 1.07
  mm too high -> moved to the render's; walls 0.45 vs render webs 0.39..1.27 -> 0.70 (median web).
- Plate FE frame (plate_fe, sized round the old window at z 1.12): can't be reused for the moved window -> frame regenerated,
  widths by kind from the v3 FE means, labelled "not FE-solved" in meta.plate.frameNote.
- pcbSec default mask green '#1c3a29' (a generic board) vs the board convention (black #16171a, gold rings) -> changed.
- k2_encMagFront draws the board 11 mm under the axle (scrollwheel.js default) while Theseus uses 12 (pcb.js, shell): left as
  the part's default; noted (a slide that shows the encoder in the mouse should know).
- MS_K scale (scan/Sora 1.0018) applied by the kit to 3D positions too (lens z): 0.03 mm at the lens; kept (kit's choice).

## Final (09:2x)
- pcb.glb stand-in sensor now marked PixArt / PAW3970DM / -T5QU (F26.9); A and B rebuilt + installed; bundle rebuilt.
- NEXT: the report (SubagentHandback).
