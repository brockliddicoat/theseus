# P1 PROGRESS (polish b09, b10, b11)

Brief: /home/claude/theseus/handoff/revamp2/p1-brief.md. List: /home/claude/work/POLISH.md (b09, b10, b11 sections + "b11 (addition)").
Files I own: deck/src/30-b09-signal.js, 30-b10-power.js, 30-b11-own.js. Nothing else. Backups of the builders' last state:
/home/claude/work/p1/backup/ (09:49).
Build: cd /home/claude/theseus/deck && python3 tools/build.py main --out=p1 --own=30-b09-signal.js,30-b10-power.js,30-b11-own.js
Checks: export NODE_PATH=/opt/npm-tools/node_modules; Q='&2d=1'; errs / qa (T=settle, T=mid) / shoot PAR=1 -> /home/claude/work/p1/shots
Eval in page: node /home/claude/work/p1/scripts/evalq.js $PWD/dist/main-p1.html <slide> '<expr>' ...
Note: the p1 build has no other 30-*.js (snapshot holds none), so B03 (b03's constants) is undefined here: b10 reads it with
a fallback (same derivation). source() grows UP from the foot rule: keep source lines to 2 lines (~3,400 px of 'foot' type,
measure with tw()) or they hit the verdict's net.

## Done
- 09:5x b10: the 8 khz draw is Razer's 45 h (B10.w8, B10.v4.h8; TPU's 40 h kept in b10_charge's source as corroboration).
  b10_charge: b10_tenMin() feeds verdict + answers: true 4.14 → 8.67 h, shown 4.2 → 8.6 h (each rounded against Theseus;
  b10's "4.1 → 8.7" rounded both our way), net 2.0×; caption "just over half its battery's capacity an hour" (0.55C);
  src + elcTpuV4, nbcV4. b10_pmic's session axis follows (24 h at 8 khz; ticks unchanged).
- b10_lights: switches from Logitech's hours (B03.optMA when present, else the same derivation: 0.116 mA a switch),
  rows 6.8 / 6.8 / 5.8 %, verdict 19.5 → 0.6 %, "+23 % hours, same battery" (B10.lights.gain, Theseus's 9 µA counted),
  caption "about a fifth", answers + source rewritten (2 lines), new SRC b10Gpx2Hours, src + b03_logiHybrid.
  errs ok; qa clean settle + mid (pmic, charge, lights); frames 0 / mid / settle viewed (shots/b10a_sheet.jpg).
- b10_cable source: "(no maker or reviewer publishes a diameter)" (FILLS b10-1). [re-check 2 lines]
- b11_card: flight: { view: 'left', box: [1020, 230, 800, 440], pad: 0.05 } (integrator's addition; msBox = msView.box, the
  box = chapterCard2's part box less b11_cardPart's margins, so the landing is exact). errs ok.

- 10:0x-10:15 b11 done (logged in POLISH.md): b11_jointMM (own_jointMM + rival board), pcbSec rival:true, plugMM grey pads,
  repair "Claw sockets, as in Clicks", wear two named results (82.9 / 98.6, no arrow; b11_result helper), box X3 row (rows 36 px)
  + PC Gamer warranty line, card flight. errs ok, qa clean settle+mid, frames viewed.
- 10:1x-10:30 b09_radio REWORKED on the integrator's two messages: clearance to the nearest big metal in 3D (B09C: H2's antenna
  model, wheel R 11.37 / axle 12 up, battery live from KEY_PARTS), both metals drawn with lines + values, Taoglas gauge
  (b09_gauge), verdict 4.0 → 17.2 mm (4.3×), caption "still short of the 20 mm Taoglas recommends", rings shadowed by both
  (b09_rings takes several rects). Snapshot battery = H2's 2.03 mm back (front −11.60): wheel nearest 17.2, battery 19.55.
  Options picture sent to the integrator: /home/claude/work/p1/opts/b09_radio_clearance_options.png (A accept 17.2/19.5;
  B module 1.2 back 18.3/18.3; C module 3.0 back + battery front 3.45 back = 20/20, fits per H2's clear.py, CoM ~0.9 back).
- b09_life: "Theseus, target" (chart + verdict), "a 0.14 ms target ... against 0.34 measured" (M-b09-2/3).
- b09_card checked with b01's file: flagship line "Like the XA25: wired only" lays out clean (qa clean 2.2/5.5).

- 10:3x-10:45 mouseRival (K, FILM F9): b10_lights (rivalFit -> mouseFit cross-fade; verdict from = printed parts' sum 19.4),
  b10_cable (b10_geo('rival'): plug 60 mm / 7.8 up, front skate edge 51.3: lift 1.62 -> verdict 1.6 -> 0), b09_chip Scyrox row
  (b09_dims from RDATA.mice, 118 x 63), b09_second "most mice" row. qa clean, frames viewed (shots/b09d_sheet.jpg, b10c/b10d).
- 10:45 POLISH: every b09/b10 item marked [x] with notes (b09_radio's 11.9 -> 27.6 superseded: FEEDBACK F40.4 to update).

## Resumed 11:15 (new P1 after the server restart)
- Re-checked: node --check ok on all three files; --own build ok; errs ok on all 26 (b09 x8, b10 x10, b11 x8).
- The antenna options page (opts_slide.js, ?p1opts=1) is in NO src / snapshot / dist file: never in the film. Nothing to gate.
- Already done by the predecessor (verified in code): rival rows on mouseRival (b09_chipRow, b09_secondRow, b10_lights
  rivalFit, b10_cable), b10_lights encoder at py + 160, b11_result's % at the kit verdict's gap (0.16 x size).
- b11 R2-b11-1..4 appear done in code at 11:04 (shots/b11d) but have no replies in review/b11.md yet.

- 11:2x-11:5x 0.6 mm board (F47.4; H3's HARDWARE notes b10 11:30, b11 11:32, b09 11:34; integrator's urgent b11_inserts):
  b11_jointMM: Theseus's joint BOARD_T + OWN_SEAT (4.4), the rival's plastic joint most mice's 1.0 mm + 4.0 (B11_RIVAL_BT);
  b11_inPose(t, d) per joint; b11_wear rows the same; B11_SIDE boardTop/Bot = BOARD_TOP / -BOARD_T, rivalTop/Bot 5.05/4.0
  (b11_rivalInside, b11_repair's latch); b11_switchClaws + b11_plugMM('side') th null; screws OWN_M2.len; b11_inserts'
  aside live (0.14 mm, the plastic joint's 4.0 mm). b10_boardSideMM o.th (rival 1.0, ths BOARD_T; faces +-th/2, copper inside
  each face); b10_board lane "Board target: 5.6 g" (F42.2, R3-b10-1). b09: B09C top and the twin camera read BOARD_TOP.
  Frames: shots/h3a*, h3b*, h3c* (kit's dashed board meets the joint's underside on b11_inserts).
- b11 verdict `who` pairs (K's fix): repair G Pro Wireless, screws Steel, inserts Straight into carbon-filled, battplug
  Superlight, board Viper V3 Pro, box Next best; re-spaced battplug (verdict 760 -> 736), screws' mass line (866 -> 884),
  board's hand-off (830 -> 858). qa clean settle + mid.
- b09_radio: title 'The radio, four times further from metal' (B09C.times; card entry 'The radio, further from metal');
  readouts 'To the wheel's rim' (R2-b09-1); verdict -> b09_twoStats (17.2 mm Plan 5 | 4.0 mm Our first board | 4.3x the
  clearance, a steadier link; nothing struck, K 11:20); answers row: F48.2 accepted; foil phones 112 tall (label clear).
- R3: b11_board leaders re-measured (QR right edge 0.69/0.685, wordmark right end 0.60/0.78, labels swapped), "(F30.15)" off
  screen; b11_screws tag 'Common steel'; b10_wires caption "as paper does" (F24a callback).

- 11:4x-11:5x replies written: review/b09.md (R2-b09-1, M-b09-2/3, K 09:58, H3 11:34), b10.md (R3-b10-1, R2 10:54 could,
  R2-b10-12..15, M-b10-2 superseded, K 09:58 incl. b10_software's call, H3 11:30), b11.md (R3-b11-1/2 + could, R2-b11-5 WHY NOT
  yet (F35, Brock), R2-b11-1..4, M-b11-3, M's convention follow-up, K 10:31, H3 11:32), FILM.md (F37, F15, F20, F32, F24).
  POLISH: shared-code item [x]; hand-offs: P1 note (no real case in b09-b11, none declared); new section "b09-b11 (P1 ...)".
- 11:5x final pass on the 11:5x build: errs ok on all 26 (in batches: the checker's page crashes after ~80 navigations);
  qa clean at settle and mid on all 26; frames 0 / mid / settle for all 26 (shots/final/, sheets final_b09/b10a/b10b/b11.jpg),
  phone sheet final_phone.jpg. R3 at 11:50/11:58: R3-b10-1 confirmed fixed; b09 nothing new.

## In flight
- Nothing. Waiting on H3's job 3 (regenerated pcb twin, lighter encoder): when it lands, re-shoot b09_radio, b10_lights,
  b11_board and re-measure b11_board's QR / wordmark leaders (box fractions in the tags list).

## Next
- Report (SubagentHandback). Open for Brock: grip tape in the box (FILM F35 / R2-b11-5).
