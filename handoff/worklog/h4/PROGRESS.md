# H4 PROGRESS (board engineer, follow-ups to H3's 0.6 mm two-layer board)

Brief: main's message (2026-11-06 ~13:05), jobs 1-5. Rules: handoff/revamp2/common.md; KIT.md §4 for the board API.
Started 13:05. Stopped 14:10 on main's wind-down (publish at a clean point; report by 14:25).
Resume rule: read this file top to bottom, then do "Exact next steps".

## State of the repo (true state at 14:10)
- NOTHING in the repo was changed by H4. 3d/pcb/tools is byte-identical to /home/claude/work/h4/backup/pcb-tools.before
  (checked with diff -rq). No twins regenerated, deck/src, the snapshot and KEY_PARTS untouched. BOARD_G stays 5.68.
  (git status shows 3d/pcb/README.md and deck/src/03-parts.js modified: those are H3's / others' edits from before 13:05.)
- Main's wind-down rule (14:00): do not regenerate twins into deck/geo2d, do not touch deck/src, the snapshot or
  KEY_PARTS; 3d/pcb only ever at a complete, DRC-clean, gnd-clean new state. Ask main before resuming any of that.

## Status
- [x] 0. Reading: H3 PROGRESS (+ before-final), 3d/pcb/README.md, 3d/parts/README.md, KIT.md §4, common.md, h3-brief.
- [~] 1. USB 2.0 pair to 90 ohm (H3's option A, decided)
  - [x] impedance: 2D field solve -> W 0.465, S 0.15 (numbers below). DONE, results in usb_final.json.
  - [x] topology of the re-route worked out (below; sketch shots/usb_plan_2026-11-06_1405.png, NOT BUILT).
  - [~] work copy /home/claude/work/h4/pcbwork/tools: usb.py (new: geometry + rule helpers) and parts.py (placement and
        pin-map edits, listed below) DONE; routes.py, layout.py (DRC rules), board_geo.py, silk.py, autoroute.py NOT
        started. The work copy is half-done: never install it as it is.
  - [ ] route, DRC 0 (A and B), all nets, gnd.py clean, skew, before/after picture.
- [x] 2. Mass: Brock (via main, ~13:15): "Accept 5.68 g". None of B-F applied. The board is unchanged, so 5.68 stands;
      re-run mass.py only after the re-route lands.
- [x] 3. Pad B3: C10/C11 apart with a plain via (decided, H3 did it). Nothing to change.
- [ ] 4. Battery: not started (S2's posts not relayed yet). Steps below.
- [ ] 5. Bundle / errs / frames / notes: nothing landed, so nothing to check.
- [x] 6. Report sent (SubagentHandback, ~14:15).

## Numbers (job 1)
- Method: my own 2D quasi-static finite-volume field solver, tools/fieldsolve.py (graded rectilinear grid, cell
  permittivities, node potentials, discrete Gauss law for the charge; Z = eta0 / sqrt(C C0) per mode). Validated
  (python3 fieldsolve.py --validate): single microstrip vs Hammerstad-Jensen -0.14 % converged (-0.35 % base grid);
  coupled vs Kirschning-Jansen -0.2 to -0.7 %; finer grid +0.22 %; doubled box 0.00 %.
- Stack: 0.565 mm FR4 er 4.3 between the faces, 17.5 um copper, LPI mask 20 um over laminate / 15 um over copper, er 3.5.
- DESIGN: W 0.465 mm, S 0.15 mm, the same face's ground pour 0.5 mm from the pair: Zdiff 90.1 ohm, Zodd 45.1, Zcm 46.6,
  eeff(odd) 2.82 (5.6 ps/mm). No pour near: 91.6. Reference band 0.7 or 1.0 mm past the pair: 90.13 (no change).
- Sensitivity (all inside 90 +/- 15 %): gap +/-0.025 -> 93.9 / 85.8; width +/-0.025 -> 88.6 / 91.7; er 4.0 / 4.6 ->
  92.5 / 87.9; 35 um copper (if the fab plates the outer layers up) -> 86.3; no mask -> 94.1; FR4 +/-0.05 -> 89.2 / 90.8.
- H3's estimate re-checked: IPC-2141 says 98.8 ohm for 0.465/0.15 and 91.4 for 0.55/0.15; the field solve gives
  0.55/0.15 = 90.3 bare but 86.7 with the mask. The mask (it fills the gap) is what IPC-2141 misses here.
- The pair as drawn now (0.13 mm, with the mask): 157 ohm at its median gap 0.27, 130 to 207 over 0.15 to 0.87.
- Files: usb_final.json (design + sensitivity), usb_design_w.json, usb_design_env.json, final_w.log.

## The re-route, worked out (sketch: shots/usb_plan_2026-11-06_1405.png; layout frame, x = the user's right)
Why it is big: the pair plus its solid reference band is a wall through BOTH faces from J1 to U1; nothing may cross it.
The topology that works (each point checked on paper with the clearances):
- Wall: J1 -> (bottom under the receptacle) -> U4 -> corridor between SW1's sockets and the encoder's pins -> the waist's
  WEST side -> jog west at z 16..12.4 -> down the left edge WEST of J3 -> east at z 1.7 into U1 L8 (DP north) / L9 (DN).
  West (right-hand) side: SW1 only. East side: encoder, PMIC, J3, TWI, everything else.
- J1 breakout: each USB land its own via, DP row z 47.545 (A6 at x -0.25, B6 at 0.75), DN row z 48.16 (B7 -0.75,
  A7 0.25); top stubs 0.2 wide; A/B joined on the bottom; the pair runs west on the BOTTOM between S3 and S1 (DP's edge
  0.16 off S3), centre z 47.85, 45 deg down to two up-vias at x ~-6.8 (z 46.04 / 46.66) with GND return vias next to
  them; necked 0.2 stubs on the top into U4's east pads (U4 stays rot 180). U4 pin 2 (GND) gets a via just east of its
  pad (-7.45, 46.35). 2 layer changes per line (H3's route: 4).
- VBUS: VBUS_L / VBUS_R joined on the bottom at z 46.61 under the four breakout stubs (the one place the pair's
  reference is crossed: the receptacle's single row of lands leaves no other way; say so). VBUS_L via (-2.4, 46.61) ->
  bottom: south to z 45.1, west under S3's south end, SW along the bay's NW chamfer, down the bay's west edge (x -7.9),
  through the MH1 gap on the BOTTOM (x -8.35..-7.5, 0.85 mm), south along the PMIC's east side, west to pins 9/10.
- CC1: land -> via (-1.25, 46.06) -> bottom south to z 44.63, west under S3 (south of VBUS) -> R3 (moved to
  (-6.35, 43.95) rot 180). CC2: top stub NE to x 1.95, north to a via at (1.95, 49.0), bottom east to R4 as now.
- Top run: centre (-9.68, 46.35) -> (-12.77, 46.35) -> (-13.27, 45.85) -> (-13.27, 16.0) -> (-16.88, 12.39) ->
  (-16.88, 2.6) -> (-15.98, 1.7) -> (-6.0, 1.7) -> spread into L8/L9. DP = centre offset +0.3075 (left of travel),
  DN = -0.3075 (usb.pair_lines). TP7 (DP) / TP6 (DN) inline at x -10.6, offset outward by 0.2175 (no stubs).
- Band (bottom, under the top run): solid GND, no mosaic, no other net; m about 0.84 in the corridor (pads), 0.92 at
  the waist and the left edge (edge keep), 1.0 elsewhere. silk.build_bottom: add it to `reserved`.
- SW1 NO/NC on the TOP along the pair's west side at -1.115 / -1.385 from the centre (the NO line passes the NC socket
  on its east side, x -14.585), round the corner outside the pair, into L10/L11 between the pair and MH3's ring.
- Encoder A/B: top from the pins east to x -8.2 / -7.82, south through the MH1 gap on the TOP (0.68 mm: two 0.15 lines),
  west along z ~27.15 / 27.42 (between C32/C33 and MH1's keep), vias ~(-11.0, 27.2) / (-10.5, 27.45), bottom south
  under the PMIC's west strip (x -11.3 / -11.03, between the band and the thermal vias), veer west at z ~16, up-vias
  ~(-11.9, 14.7) / (-12.2, 15.1) (north of the QR zone), top SW under J3's body between its mounting pads and its pins
  (x -13.5 / -13.1), south to z ~3.6, east into L6/L7 (check which is east; swap L6/L7 nets if needed).
- Encoder VDD_1V8: from C32's (now west) 1.8 V pad north on the TOP at x -12.05 (west of MH1: 0.4 mm room, one 0.15
  line) to the encoder's VDD pin.
- TWI: PMIC pins 17 SDA, 18 INT, 19 SCL (east side), out east and south down the PMIC's east side (x ~-6.25..-5.71), SW
  into the passage between J3 and the antenna keep-out (x -10.9..-6.6, z 8..12.25: the BOTTOM can't carry anything
  from the PMIC to the module there, the QR zone + keep-out block it), into L1 SCL / L2 INT / L3 SDA. R1 (SDA) west of
  the bundle in the passage, R2 (SCL) east of SCL at the PMIC's SE corner (both placed in the work copy).
- J3's SB4/SB5 unchanged into L4/L5. VBUSOUT must reach B5 the long way: bottom east under the sensor, down the right
  side east of the keep-out and the wordmark zone, west along z ~-2.75 (the autorouter, with the new keep-outs).
- Placement / pin-map edits ALREADY in the work copy's parts.py: PMIC block (U2, L1, L2, C30, C31, C32 (turned 180),
  C33, C35, C36, TP4) +1.1 mm east (PMIC_DX); U2_PINS TWI 1-3 -> 17-19, SW_PWR 18 -> 20, NTC 19 -> 22; U1_PINS L1 SCL /
  L3 SDA (swapped); R1 (-9.35, 10.6) r90; R2 (-4.9, 14.05) r0 nets 1 SCL 2 VDD_1V8; R3 (-6.35, 43.95) r180; C20
  (-5.645, 21.73) r270; C22 (-4.6, 25.4) r90; TP3 (-8.75, 12.85); TP5 (-3.3, 26.55); TP6 (-10.6, 46.875); TP7
  (-10.6, 45.825); FID3 (-17.8, -5.2). These are small moves of Brock's plan-5 placement: say so to main.

## Exact next steps
### USB pair (job 1), in /home/claude/work/h4/pcbwork/tools (the work copy), never in the repo until it is clean
1. routes.py: replace the USB section (J1 breakout, VBUS join, CC1, CC2) and the left channel (USB, ENC, SW1) with the
   plan above, using usb.pair_lines(centre) for the pair (W, HP from usb.py) and offsets for SW1; shift every PMIC-local
   hand route by parts.PMIC_DX except those that end on the sensor, C20-C22, TP3/TP5 (re-draw those); rewrite the TWI
   section (PMIC east pins -> passage -> L1-L3); add the U4 pin-2 GND via and the up-via GND returns.
2. layout.py drc(): add the USB rules with usb.py: other nets' copper (traces, vias, non-GND pads) outside
   usb.keep_same(routes, layer) on the pair's face and outside usb.band(routes, face, BAND_MIN) + POUR_CLR on the
   other face, along the controlled run (full-width traces); exempt the end parts' pads (J1, U4, U1, TP6, TP7).
3. board_geo.build_board: the top pour keeps usb.G_POUR (not POUR_CLR) off USB copper. silk.build_bottom: the bottom pour
   keeps G_POUR off bottom USB copper; add usb.band(routes, 'L4') to `reserved` (solid, no mosaic, no gold triangles).
4. autoroute.py: L1 keep = keep_same; FAR keep = band + POUR_CLR (traces and vias); then run it for A (~5 min, alone on
   the CPU), then PCB_VARIANT=B. Hand-route anything it can't (VBUSOUT's long way is the likely one).
5. Check: python3 layout.py (0 issues), PCB_VARIANT=B too; python3 gnd.py (one piece, both); the pair's skew
   (usb.length(routes,'USB_DP') - ...('USB_DN'), target < 0.15 mm, at 5.6 ps/mm); its length (expect ~78 mm);
   the cross-section along the run (min gap to other copper, band margin) and its Zdiff with fieldsolve.py.
6. Pictures: before = /home/claude/work/h3/shots/q_usb.png; after with tools/plot_layers.py (--tools <work copy>).
7. Only then, with main's go-ahead: install (backup first), build both (PCB_OUT, build_pcb.py), mass.py (report the new
   figure; BOARD_G via key_parts.py), README (Two layers: the pair), the bundle, twins under the lock, errs on H3's 28
   board slides in batches <= 40, frames, HARDWARE notes (P5: b01-b04/b08-b11; P6: b05-b07), KIT.md §4 entry.
### Battery (job 4), when main relays that S2's real posts are in KEY_PARTS / the 3D shell
1. balance.py: posts() still builds ESTIMATED tubes over MH1-MH4 (POST = Ø5.3 / Ø3.5 CF-PP, length to the first shell
   surface above, line ~150). Replace it with S2's posts (their mass and centroid from the 3D shell or KEY_PARTS).
2. python3 balance.py --out=/home/claude/work/h4/balance.json: read "z for zero" (H3 with the estimates: battery centre
   z -27.45, 0.47 mm back of BATTERY's -26.98, mouse CoM +0.13 now).
3. ONE move: board.py BATTERY z0/z1 by the printed delta (x and y unchanged); re-run balance.py to confirm CoM z 0.00.
4. key_parts.py -> KEY_PARTS.battery (the only field that changes); 03-parts.js + snapshot; twins under the lock
   (flock /home/claude/work/geo2d.lock ..., re-read first: S2 also regenerates); HARDWARE notes P6 (b07_balance), P5
   (b10); KIT.md §4. Only if main has lifted the wind-down rule.

## Models and conventions checked
| what | where | check | verdict |
|---|---|---|---|
| USB pair impedance | H3's IPC-2141 estimate (q_usb.png) | validated 2D field solve with the mask | IPC-2141 +9 % here; the mask lowers Zdiff ~4 ohm; W 0.465 not 0.55 |
| the reference under the pair | board as built | bottom mosaic grooves, other routes, the QR zone | the run must be re-routed (a wall through both faces); plan above |
| bottom routes from the PMIC to the module | silk ART_KEEP + ANT_KEEPOUT | QR zone x -15.2..-6.8 z 4.6..14 + keep-out | no bottom passage on the left between z 4.6 and 14 |

## Files
- tools/fieldsolve.py (solver + validation), tools/design_sweep.py, tools/final_w.py, tools/plot_layers.py (both faces,
  --zoom, --tools), tools/plot_plan.py.
- shots/layers_before.png, shots/zoom_front_before.png (the board as built), shots/usb_plan_2026-11-06_1405.png (the plan).
- backup/pcb-tools.before (pristine copy of 3d/pcb/tools at 13:10). pcbwork/tools (the half-done work copy).
