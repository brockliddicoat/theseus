# P3 progress: polish b01 (intro and close) and b04 (glide)

Brief: /home/claude/theseus/handoff/revamp2/p3-brief.md. Files owned: deck/src/30-b01-intro.js, deck/src/30-b04-glide.js.
Build: `cd /home/claude/theseus/deck && python3 tools/build.py main --out=p3 --own=30-b01-intro.js` (or 30-b04-glide.js).

## Status
- [x] 10:05 Read: brief, POLISH.md (b01, b04), review/b01.md, review/b04.md, b01 + b04 PROGRESS.md, FEEDBACK F41-F45,
      BROADCAST-0930/0945, common.md, KIT.md.
- [ ] Read build.py, INTEGRATOR.md, FILM.md (b01/b04 items), h2 PROGRESS (KEY_PARTS ledges), S1 brief.

## Open items (from review files and POLISH.md)
### b01
- POLISH: keep B01_TRADES' six ids stable. (constraint)
- KIT 09:58 (must): mouseRival for every non-Theseus mouse in b01 (trade icons, big* stage mice, battery fill via rvBox,
  optical switches via rvAt, cable nose via rvAt, ULX bow on mouseRival pts). Check b01_lighter flick mice, b01_battery
  right-hand mouse.
### b04
- POLISH: ledges wait on S1/H2 KEY_PARTS change; then read KEY_PARTS, re-check b04_sag and b04_skates numbers.
- R2-b04-1 (could): b04_sag frame one: start the 4.4 N arrow descending at t = 0.

## Log
- 10:03 backups: /home/claude/work/p3/backup/*.1005.js. Baseline errs: all 20 slides ok (errs_base.txt).
- 10:2x INTEGRATOR MUST (b01_cover): "ON PIAKNOW'S RIG" read as measured. DONE: Weight / Motion latency / Density subs now
  "Target" + (every unit weighed | by PIAKNOW'S measure | weight per cm³ of its box), Target in C.ink2, rest C.faint;
  knock: true clears the grid's + row (F10). Answers row added. errs ok, qa settle+mid clean, shots/cover_foot2.png.
  Replied to main.
- 10:1x KIT must (mouseRival) CODED in b01: helpers b01_dims / b01_dimsLerp / b01_rvBatt / b01_rvSw / b01_rvCol /
  b01_rvTop / b01_rvTopAt / b01_battC; b01_tradeIcon (weight, battery, optical, flex, wire -> mouseRival with dims;
  half -> rival grey on the traced X2F); b01_big* (Weight left pan, Battery, Optical with rvAt switches + kit switch size,
  Flex bowing the rival's top line, Half grey, Wire with rvAt cable); b01_lighter X3 lane -> mouseRival col 'rival'
  (yellow, the slide's one named rival); b01_battery right mouse -> rival morphing V4 Pro dims -> HTX Mini dims, cross-fade
  to Theseus at T.ths, battery centre lerps rival -> Theseus. "A firm press" -> "Pressed at the top" (BROADCAST-0945 #3;
  TechPowerUp's own words). errs ok at 9 times. NEXT: frames + qa, reply under KIT in review/b01.md.
- 10:45 KIT must DONE: frames shots/rv_sheet.jpg (+ rv_detail, rv_detail2), qa clean settle + mid, answers rows (FILM F9,
  BROADCAST-0945 #3) on compromise / lighter / battery; b01_battery weight count now starts with the name switch. Replied.
- 10:50 KIT 10:31: density / price / targets verdict maxW -> RM - x (510). Replied.
- (machine clock from here; my earlier times were estimates) 10:30 b04 DONE + replied: R2-b04-2 skates (meter labels
  one/two/third; verdict who 'One dot a corner' / 'Theseus, two dots'; foot line says why 10 N: 4.4 N sinks one dot 0.41 mm;
  tightened to 2 lines, 3238 px), R2-b04-4 sensor ("Finer is better" beside "1 cpi"), R2-b04-5 reports (peaks held big,
  "px behind, at the peak"; "Most:" gone), focus caption tail cut, card F12 done by K (checked). K '%' spacing in b04 (602,
  604 + three readout gaps 4 -> 10).
- 10:35 b01 R2 round (R2 clock ~30 min ahead): R2-b01-1 = integrator's cover must (done). R2-b01-2 MUST targets: implemented
  option (c): row compares mechanical: best OP1 8K V2 5.7, SLX magnetic 2.0 as labelled tick, Theseus "Under 4.2 ms, derived"
  (b01_pressTgt: 5.7 - B03.flightMs, ceil 0.1); foot line states the assumption; answers row fixed. MESSAGED main (POLISH
  said "under 2.0 decided") with options a/b/c; awaiting answer. R2-b01-4 targets frame one (rows at half from t=0).
  R2-b01-5 budget gap neutral + "About 2.8 g lighter than the XA25's: the Shell chapter shows how". R2-b01-3 cover counts 8
  ("Eight that most mice make", count steps per strike) + close counter 8 -> 0 right column, blue 0 before THESEUS. Rank
  could: "by weight, as mice are sold". All errs ok, qa clean (0.02 / mid / settle as relevant). Replies written for -1/-2/
  -4/-5; -3 and coulds to write.
- NEXT: R2-b04-3 module (draw PixArt's click fault; payoff line), R2-b04-1 sag arrow at t=0, close proof-number could (WHY NOT
  likely: cross-file numbers), POLISH ledges (S1/H2 KEY_PARTS), POLISH.md [x] marks, re-watch pass.
- 10:50 Integrator approved (c) for targets; asked foot line to say the OP1 assumption + Direct Drive unquantified: DONE
  (foot line). K items (mouseRival, density maxW) already done. NOTE: SendMessage to main now fails (session limit): all
  further notes go in review files + the final report (include: (c) live, K items done, R2-b01-3/-4/-5, rank, b04 -2/-4/-5).
- 10:45 b04_module R2-b04-3 FIXED in part (caption with PixArt's warning, retimed 0.2/3.0; red faultTag 'Clicks move it' on
  PixArt's board at 2.5; 'Clipped round the chip' blue; payoff caption 'carries its own two dots: the dots at the lens that keep
  it in focus'); WHY NOT animated flex (PixArt gives no mechanism/size). Replied.
- 10:50 b04_sag R2-b04-1: press from frame one (ep -0.1..0.9 out3), fault tag at 1.0. Caption cut-offs found + fixed (checker
  scripts/capcheck.py): b04_sag, b04_reports, b01_compromise (next 7.7), b01_battery (4.0 / 5.6), b01_illusion (4.5).
  R2 confirmed b04 -2/-4/-5 fixed (10:38 re-check).
- NEXT: POLISH.md [x] marks (b01, b04); check KEY_PARTS ledges (S1/H2); re-watch pass on all 20 (frames 0/mid/settle, phone).
- 10:52 FULL PASS (machine clock): errs ok x20 (6 times each); qa clean x20 at 0.02 / mid / settle; frames 0/mid/settle x20
  -> shots/pass_1..5.jpg, all read. Found + fixed in pass: forceArrow double-scaled N (N*k*k) on b04_sag and b04_skates (now
  N full, k ramps: frame one reads 1.2 N); compromise "Theseus's targets" label over the six answers; rank foot line "at its
  29.31 g target". R2 re-check 10:46: b01 R2-1..5 CONFIRMED FIXED; 10:38: b04 R2-2/-4/-5 CONFIRMED.
- Waiting: POLISH ledges (KEY_PARTS.skates still 7.94 mm pairs). FILM F38 (one ground per run, b04_camera->focus->sag) is the
  integrator's call: not changed.
- 10:52 answers rows audited (b01 + b04): fixed 5 stale b01 rows (compromise: 13.6 % is Logitech's hours, not Omron's; close
  answers the eight-chapter ledger; lighter: finger-mass floor is on screen; battery: rivals ARE derived at the same draw,
  verdict 141 -> 200 h). b04 rows true. Rebuilt; errs ok.
- Watcher: scripts/watch.sh prints new '## ' sections / line counts of review b01, b04, FILM, KIT Changes, POLISH b01/b04.
- 10:55 Questions for Brock prepared (pictures in /home/claude/work/p3/questions/): q1 press-to-PC target (a/b/c/d), q2
  module warning (named vs animated schematic vs dropped), q3 the count (eight marks vs six). Phone sheet ok
  (shots/phone_sheet.jpg). Now polling review files (scripts/watch.sh) ~every 10 min; idle-hour rule -> report.
- 11:04 POLISH 'All polish agents' hand-offs: no real case in b01/b04 (noted under the item). FILM 11:01: all R2 musts confirmed except b02's.

## Resumed 11:14 (new P3 after a server restart)
- 11:15 Re-check: node --check both files ok; --own build ok; errs ok on all 20 (5 times each) against the 11:03 snapshot
  (H3's BOARD_T change) -> errs_1115.txt. Nothing was half-done.
- 11:20 H3 (review/b04.md 11:05, must) DONE: b04 lens section at BOARD_T 0.6 / BOARD_TOP (B04S, b04_boardSec with copper
  hairlines on the two faces, upper block + boss up to -BOARD_T, highlight, board anchor); b04_sag close view + b04_module
  stack read BOARD_TOP, dots' tops = BOARD_TOP - B04.stack, floor = BOARD_TOP - 1.73. Slides: card, camera, focus, sag,
  module. Header comment. Frames shots/board06 (cmp_camera.png, cmp_sag.png before/after), shots/r06.
- 11:30 H3 (review/b01.md 11:05, should) DONE: b01_budget's board note on screen "At 0.6 mm: 5.63 g, derived" (noteOf; the
  parts' note field is never drawn, updated too); foot line "Board: 5.60 g, the target; at 0.6 mm on two layers, with a lighter
  encoder and a cored support, it builds to 5.63 g (derived, F47.4)"; constant B01_PCB_PATH.g = 5.63 (one place; H3 may move it).
- 11:30 Re-watch fixes: b01_budget small-part labels -> one staircase list right of the small parts with elbow leaders, clipped
  round the gram tick labels (the fan crossed "Wheel and axle" and "20 g"); b04_module force arrow inside the post (crossed
  the heading), divider 340 -> 356 (crossed "Pad"). Answers rows: F47.4 on b01_budget and b04_module.
- 11:31 errs ok, qa clean (0.02/mid/settle) on b01_budget + 5 lens slides; replies written in review/b01.md and b04.md.
  NOTE: PAR=1 for shoot.js from now on (common.md: one browser at a time).
- NEXT: verify the brief's decisions on screen (cover "Target", targets "Under 4.2 ms, derived" + foot line, mouseRival, density
  maxW); full re-watch pass of all 20 (frame one / mid / settle, phone); poll review files (scripts/watch.sh) every ~15 min.
- 11:34 (machine) R3's FILM F40 (could, integrator: no FEEDBACK IDs on screen): b01_budget's foot line drops "(F44.2)" and my
  "F47.4" (both kept in answers rows). drawn.js scan: no F-ID drawn on any of the 20 at settle.
- 11:38 Re-watch pass 2 (all 20 x frame one / mid / settle, shots/pass2/pass2_0..6.jpg): brief's decisions verified on screen
  (cover "Target" x3 + 8 -> 0; targets "Under 4.2 ms, derived" + foot line assumption; mouseRival icons; density verdict ends
  1812 < RM). Fixed: b04_sag + b04_reports verdict labels were 642 px (wrap at 640 left "better)" alone): now "Skate to hold
  the lens" (552 px, inside the card) and "Behind at the peak" (491 px, the panels' own words). errs ok, qa clean.
  Noted, not changed: the grid "+" shows through text off cards on every slide (titles at y 160 too): kit-level (F10 extension);
  29.31 shown as 29.3 at 0.1 g (film convention, G5 / F2.32) and price's "8.7 g lighter" (8.69): 0.01 g, left.
- 11:42 R3 (review/b01.md 11:33, two coulds) DONE: b01_battery verdict names its owners (who: D.lo.short "HTX Mini 8K",
  "Theseus"; row y 935 -> 900, size 84 -> 76 so the net clears the foot rule); b01_budget caption "each drawn to its weight"
  (R3's "heaviest first" would be untrue: side switches 1.00 g drop before the wheel 1.02 g). errs ok, qa clean. Replied.
- NEXT: POLISH.md marks (b04 ledges still waiting on S2 job 2 / KEY_PARTS.skates); poll review files ~15 min; final report
  when nothing is open for an hour or context gets full.
- 11:45 Phone check (0.44x) of battery, sag, reports, card, budget, module: legible. Fixed (re-watch): b04_reports' playhead ran
  from ty-70 through the red label "about 450 ms" (it crosses it during the run and at settle): now from ty-56, just above
  the red bar. errs ok, qa clean. q2 picture regenerated from the current b04_module (questions/q2_module_warning.png).
- 11:47 Fixed (re-watch): b01_battery's chart labels: "Keychron G3, 47.4 g" (the curve cut its "g", two same-draw rings sat under
  it) now in the clear band between the rings, 40 px left of its dot; "X2F, 118 h" above its ring (the curve cut its "h").
  errs ok, qa clean; shots/r06/crop_battery_after.png.
- 11:57 R3 11:50: "Nothing open from me on b01" (both coulds confirmed). FILM F32 (clips end on their own payoff, P3 + P1): already
  true for b04_focus; noted under the item. F51 (S2's rim and trigger cutouts) reaches b01/b04 only via shared drawings: re-check
  frames when the snapshot changes (snap.state holds the shared files' times). Nothing open; polling.
- 12:18 R3-b04-1 (should, b04_sensor: strike the PAW3950, not the older PAW3395): AGREED, waiting on research (REQUESTS.md, R3's
  request; no PAW3950 specs in repo; no searching). Prepared: B04SN.foil / foilSrc / rows' third values feed the bars, verdict
  and foot line (output unchanged, checked). Replied in review/b04.md.
- 12:31 Snapshot 06-motion.js changed 12:25 (FG's "A Line" finger, F52.1): rebuilt; errs ok x20 (5 times), qa clean x20 at
  settle / mid / 0.02 (errs_1228.txt); b01_compromise's fingertip on the UltralightX checked in frames (shots/r06/finger_check.png).
  R3 handed off (FILM 12:20): nothing open on b01/b04 except R3-b04-1 (waiting on research's PAW3950 figures).
- Open, blocked: POLISH b04 ledges (S2 job 2 / KEY_PARTS.skates); R3-b04-1 (REQUESTS.md). Context near full: final report now.
