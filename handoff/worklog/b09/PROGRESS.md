# b09 PROGRESS (Electronics I: wireless with no penalty)

File: deck/src/30-b09-signal.js. Build: `cd /home/claude/theseus/deck && python3 tools/build.py main --out=b09 --own=30-b09-signal.js`
(08:5x: the kit is in the snapshot now; build with `--own=30-b09-signal.js` only: the live src/06-motion.js reads KEY_PARTS
and must not be mixed with the snapshot's 03-parts.js by hand).
Checks: `export NODE_PATH=/opt/npm-tools/node_modules; Q='&2d=1'` errs / qa (settle, mid) / shoot PAR=1 → /home/claude/work/b09/shots.

## Status
- 07:2x-07:5x Phase A: read common.md, b09-brief.md, FEEDBACK (STANDING/DECIDED, F21-F38), REVAMP.md, DESIGN.md, old slides
  (10-f-elec.js: eleccard, onechip, elc_module, antenna, framesync, secondshot, power; 14-c-elec-ex.js: motion, elc_rate,
  frontier), research data (latency.json, mice.json, batteries.json), plan 5 (board-plan-5.jpg, plan5.py, K2-PROGRESS).
- Research done (sources below). Storyboard below. KIT.md not landed yet (07:40): poll with `sleep 120`.
- Phase B order (most important first): b09_chip → b09_radio → b09_latency → b09_penalty → b09_sync → b09_second →
  b09_life → b09_card (the card waits on chapterCard2/LEDGER). CHECKPOINT1 after b09_chip.
- 07:56 deck/src/06-motion.js landed (KIT.md not yet). Building with --own=30-b09-signal.js,06-motion.js.
- 08:2x b09_chip DONE (errs ok, qa clean settle+mid, frames judged) → CHECKPOINT1.md written.
- 08:5x integrator review of b09_chip (frame one empty; too small; verdict tucked away) → fixed: row A live at t = 0, row B
  dimmed till its turn, mice 2.25 px/mm, 1 ms rulers, trail panels 456 × 262, verdict size 124 in the right column with
  "Dual 8khz wired and wireless" as its net line. Frames in shots/cp1/. Same standard applied to every other slide.
- 09:1x b09_radio (establish → pcb twin, module swap around the sensor, rings shadowed by the wheel, foil demo, verdict
  12.4 → 28.2 mm "2.2× further"), b09_latency (race + verdict 0.34 → 0.14 "2.4× sooner" + XA25 0.13), b09_penalty (plugs
  pulled, bars run on, verdict +0.08 → +0.01 "8× smaller"), b09_sync (three rows with step bars + lag shading, verdict
  202 → 42 "160 µs fresher") built; errs ok, qa clean settle+mid on all five.
- NOTE: an edit duplicated part of the file at 09:15 (splice end before start); fixed by truncating to the first 612 lines;
  backup at /home/claude/work/b09/30-b09-signal.backup-0915.js. Splice with s.index(marker, start) from now on.
- 09:3x b09_second built (channels A/B, headset burst, spare rescues, shotInset miss/hit, verdict 0.67 → 0.007 % "99%
  rescued"); errs ok, qa clean.
- CHECKPOINT (integrator, 08:3x real clock): DONE and checked: b09_chip, b09_radio, b09_latency, b09_penalty, b09_sync,
  b09_second (errs ok; qa clean settle + mid). IN FLIGHT: b09_life (slide 8). Its first build's frames (shots/s_111_b09_life_*)
  had: source over the x-axis label, verdict who-labels colliding, "Faster and longer" touching Theseus's label, a floating
  "best trade-off" label, "20 g lighter" rounded UP (49 − 29.31 = 19.69). Rewritten (backup 30-b09-signal.backup-life1.js):
  plane 230-1180 × 350-840 (0-240 h), segmented rate control (no outlines), clicks 1.3/2.4/3.5 s, hours labels from t = 0,
  V3 Pro name left of its point (with *), V4 Pro tag "Fastest wireless measured", key (filled = Razer, hollow = derived),
  verdict size 140 who ['Viper V4 Pro','Theseus'] auto net "+11 %" + "and 19.6 g lighter", two lines, shorter source.
  EXACT NEXT STEP: build (--own=30-b09-signal.js,06-motion.js), errs b09_life, shoot b09_life:0, :4.4, :11, judge, fix,
  qa settle + mid.
- 08:4x b09_life DONE: integrator's three collisions fixed (region label vs Theseus label, verdict who-labels, axis title vs
  source) and the subtitle now says what the chart shows ("Battery hours fall as the polling rate rises: at 8 khz the Vipers
  keep a quarter of them or less." → "At every polling rate Theseus targets more hours than either Viper, and less
  latency."). Plane widened to 230-1240 (M10), clicks 1.2/2.2/3.2, verdict t0 3.6 (mid frame no longer empty), settle 10.
  errs ok; qa clean settle (10) + mid (4); desktop and phone (0.44×) frames judged.
- 08:5x BROADCAST-0850 (plan 5 in KEY_PARTS): kit now in the snapshot → build with --own=30-b09-signal.js only (the live
  src/06-motion.js reads KEY_PARTS and differs from the snapshot's). B09B re-derived from KEY_PARTS (module z 4.80, antenna
  keep-out centre z 10.10 = 5.30 ahead of the module's centre, sensor 19.45 (9 × 11 mm), battery front −9.57); first layout
  from the pcb twin (module 20.60, lens 4.00). Distances now 11.9 → 27.6 mm to the axle, "2.3×" (was 12.4 → 28.2, "2.2×").
  F9.13 answer rewritten with the new numbers. Re-shot b09_radio, b09_chip, b09_second (mouseSimple): errs ok, qa clean
  settle + mid.
- 09:0x b09_card DONE (chapterCard2, compromise "Wireless that costs latency, battery or weight" = LEDGER's, answer
  "Wireless with no penalty", 9 topics across b09 and b10, part = mouseFit top with board + antenna lit, elc_module at
  KEY_PARTS' module, one 3-ring send at turn + 0.3). Review file b09.md (critic, 3 coulds on b09_chip): replied; R-b09-1
  FIXED (panel title "Your cursor: a flick, slowed"), R-b09-3 FIXED in part (lane labels 22 → 26 px), R-b09-2 WHY NOT (needs a
  kit-level rival outline). Frame-one sweep: b09_sync opened empty → its first row now starts at −0.8 s (hand and reports on
  screen at t = 0), rows 2-3 at 3.0 s, verdict 5.4 s, settle 9.5. b09_latency caption: "he measured" → "piaknow measured".
- 09:1x critic's second pass (R-b09-4..8, no musts): penalty's "8×" dropped (ratio of rounded targets; net "Feels like its
  cable"; source says only the wireless 0.14 comes from Kunai's model); latency's ratio from the model value 0.1421 →
  "2.3× sooner" (was 2.4×, a round-up); Second Shot "99%" was a round-up of 98.96 % → "98.9 % rescued", spaced %, the
  guide's 99-100 % quoted as its own condition; sync source says 160 = Brock's 202 − 42, 163 = XBAB's measurement; radio
  "before" said plainly ("Our first board put the radio right behind it", who "First board"), verdict netWord "a steadier
  link, fewer lost reports"; card's mixed idea keys kept (WHY NOT). Replies written in review/b09.md.
- FINAL (09:1x): errs ok on all 8; qa clean on all 8 at settle and mid (TOTAL 0); frames at 0, mid, settle judged on desktop
  and phone (shots/final/, sheet_t0.png). Report sent via SubagentHandback. THEN: b09_card (S id 'b09_card', card: true, first: true, theme night, settle 5.5, replaces
  ['eleccard'], chapterCard2 with compromise 'Wireless that costs latency, battery or weight', answer 'Wireless with no
  penalty', list of the 7 slide titles, part = elc_module with one send pulse); then read /home/claude/work/review/b09.md
  (empty at 08:32) and FILLS.md, the radio polish, phone views (0.44×) on all 8, final errs/qa on all 8, report.

## Decisions (from the integrator)
- 07:5x b09_radio: show plan 5 as Brock approved it: module at the board's rear (MCU z 4.80), antenna facing FORWARD,
  no 180° turn; antenna band to the wheel axle 12.4 → 28.2 mm (board-local z: axle 37.75, band 25.38 → 9.58).
  F9.13's aim met by the move; turning it would put the antenna ~3 mm from the battery (front z −4.82).
  Answer F9.13 with exactly that; ask Brock "keep it facing forward?" as a multiple-choice question in the report.
  The integrator tells H1 to build U1 the same way.

## Models and conventions checked (rule of 08:45)
- elc_module (10-f-elec.js), the module drawing: 9.9 × 13.3 mm (Raytac page: OK), black (F9.25: OK), meander across the −y
  end = the long PCB antenna (F21.4; Brock's photo: OK in kind), castellations 12 a side + 11 across the end at 0.8 mm (K2's
  land pattern: OK), marking text = part names only (F26.11 is about Theseus's own engravings: OK). Verdict: reuse.
- Old antenna geometry (ELC: modZ 20.6, antZ0 25.38, axle 37.75): probed the pcb twin: U1 centre mouse z 17.73 = layout
  20.61, wheel axle mouse z 34.88 = layout 37.76 (OK). Band centre sits 1.87 mm behind the module's front end (27.25 − 25.38);
  plan 5's band = 11.45 − 1.87 = 9.58, so 37.75 − 9.58 = 28.17 → "28.2 mm"; 12.37 → "12.4". Ratio 2.277: the old "1.8×" is
  superseded; the slide says "2.2×" (floored, never rounded up) and "more than twice as far". Verdict: reuse, recomputed.
- Old onechip claim "Two chips: most 8 khz mice": NOT carried (unsourced, and new chips such as nRF54H20 / nRF54LM20 /
  Airoha AB1623 carry high-speed USB). Replaced with sourced facts: Scyrox V8 1 khz on its cable (TPU), 6 of the 9 mice
  piaknow timed at 8 khz wireless run 1 khz on a cable, the MCHOSE two-chip example (TPU).
- piaknow rows (latency.json): units ms; footnote * = Motion Sync forced on at ≤ 4 khz (may be inaccurate) applies to the
  starred mice's ≤ 4 khz rows; shown as "*" with that exact note. V4 Pro 0.34 matches Razer's own 0.36 claim (OK).
- Theseus 0.14 ms wireless: Kunai's model 79.6 µs + 62.5 µs = 142 µs (OK, a target, says "target"). 0.13 ms wired: the old
  deck's target equal to the XA25's measured 0.13 (no separate derivation found; kept as a target, labelled so).
- Old elc_rate "8× smaller": 0.08 / 0.01 = 8 exactly from two targets (OK). Old motion "2.4× faster": 0.34 / 0.14 = 2.43 →
  "2.4× sooner" (floored, OK).
- Old secondshot numbers (Kunai guide via the old slide): 15 / 220,017 = 0.0068 % ≈ 0.007 % (consistent); 1 − 0.0068 / 0.67 =
  99.0 % (consistent with "99 % rescued"). Kept as measured on a pre-production mouse, said so.
- Old framesync: Brock's 202 and 42 µs (F26.10); XBAB's own figure is 163 µs below FrameSync, not 160: both kept, the
  headline uses Brock's figures and the source line gives XBAB's. The old lanes model (12 kfps frames) replaced by XBAB's
  described 50 µs frames (2 or 3 frames a report) (OK, an illustration, labelled).
- Old power: V3 Pro 95/62/40/17 h (Razer support, re-fetched today: OK); V4 Pro 1.184 Wh = 0.306 Ah × 3.87 V (TPU): OK;
  LP402535JU 370 mAh × 3.7 V = 1.369 Wh: OK; "8 khz takes about four-fifths": V3 Pro 82 %, V4 Pro 75 % (claims) → "three-
  quarters to four-fifths" (to say on b09_life).
- KEY_PARTS (03-parts.js, H1, 08:50) for b09_radio: key-plan y = −mouse z; board-local z = anchor (2.88) − y. Checked against
  plan5.py: module centre 4.80 = ZM (OK); sensor 19.45 = ZS (OK); antenna keep-out z 7.95-12.25 (4.3 long, 0.8 past the
  module's front) against plan5.py's drawn keep-out 7.75-11.45 (3.7 long): KEY_PARTS used, as the integrator asked (0.5 mm
  difference in the centre). The pcb twin (old board, 07:22): RadioModule z 11.07-24.37 (centre 17.72 mouse = 20.60 board)
  with its antenna trace at the REAR end (mouse z 11.41-14.47): the old 3D board already carried F9.13's flip (~22 mm to the
  axle); the slide's "first layout" is the unflipped one (antenna toward the wheel, old ELC antZ0), said in the F9.13 answer.
  Wheel in the twin: rubber tyre z 23.5-46.24 (R 11.37), axle 12.0 mm over the board, its bottom 0.63 mm over it.
  Verdict: distances re-derived (11.85 → 27.65; shown 11.9 → 27.6, 2.3×).
- b09_life numbers (09:0x): Theseus's curve = the V4 Pro's fitted draw curve × 200/180 (1.111), more conservative than the
  batteries' energy ratio (1.369 / 1.184 Wh = 1.156): 200/140/87.5/50 h. V4 Pro 2 and 4 khz derived (126, 78.75 h), drawn hollow
  with a key. Verdict 45 → 50 h: +11.1 % → the kit's floored "+11 %" (passed as the computed net). "20 g lighter" was a round-up
  (49 − 29.31 = 19.69): now "19.6 g lighter" (floored; both weights are claims, like for like). "Leave 8 khz on: six hours a
  day, charged once a week": 6 × 7 = 42 ≤ 50 h (OK). V3 Pro starred (*: Motion Sync forced on at 1-4 khz, its rows shown).
  "Fastest wireless measured" on the V4 Pro = piaknow's 8 khz chart (same claim as b09_latency).
- FINDING for H1/Brock (plan5.py): J2 (battery) and J3 (side) connectors at board z 8.5, x ±14.5 sit 4.5 and 5.1 mm to each
  side of the antenna keep-out: the nearest metal to the antenna in plan 5 (small, but worth Raytac's keep-out check). The
  slide says "to the wheel's axle", never "to the nearest metal".
- Colours: every hard-coded grey in my file made neutral (R = G = B within 4) or a token (C.faint, C.mute) (08:45 rule).

## Research gaps (web-search budget used up at 08:30; central research answers land in /home/claude/work/research/FILLS.md)
Each: the slide it feeds, the query to run, the stand-in on the slide now.
1. b09_radio: how much nearby metal costs a 2.4 GHz PCB antenna against distance (efficiency or dB at 5, 10, 20, 30 mm).
   Query: "2.45 GHz printed inverted-F antenna metal clearance distance efficiency" and "Casado EuCAP 2012 printed IFA
   metallic environments clearance distance" (DOI 10.1109/EuCAP.2012.6205978, closed access; an open copy or a figure
   quoted elsewhere would do). Also "Nordic nWP-017 antenna metal distance" / "TI DN035 antenna clearance metal".
   Stand-in: distance only (12.4 → 28.2 mm), the mechanism (Antenova, Finalmouse), the foil demo.
2. b09_radio: Raytac AN54LM-P20A datasheet keep-out / clearance to metal. Query: "AN54LM-P20A datasheet" and "Raytac
   AN54LM-P20A antenna keep-out ground clearance". Stand-in: MDBT50Q spec ver. K §2.3 (No Ground Pad on every layer, module
   toward the board edge).
3. b09_life: Viper V4 Pro battery hours at 2000 and 4000 Hz. Query: "Razer Viper V4 Pro battery life 2000 Hz 4000 Hz"
   (Razer support FAQ for RZ01-0563, or a review that lists all four rates). Stand-in: derived from 180 h / 45 h with a fixed
   draw plus a cost per report (126 h, 79 h), drawn hollow, marked derived.
4. b09_life: Viper V4 Pro battery measured at 8 khz (TechPowerUp ~40 h was recorded in validation-report-2026-11-03; TPU was
   unreachable). Query: "techpowerup Razer Viper V4 Pro review battery life 8000 Hz". Stand-in: Razer's 45 h claim.
5. b09_second: Kunai tester guide's Second Shot section (private, from Brock): confirm 99 % rescued at 4 khz, ~92 % beside a
   headset base station, 0.67 % → 0.007 % lost, 15 of 220,017. Not a web search: a question for Brock. Stand-in: the numbers
   as the old `secondshot` slide carried them.
6. b09_latency / b09_penalty: piaknow chart newer than 2026-09-15 (any re-test of the Viper V4 Pro, XA25 firmware 1.08).
   Query: "piaknow motion latency chart 8000Hz wireless 2026". Stand-in: the 2026-09-15 chart in research/data/latency.json.

## Brock's notes on my old slides
Only `eleccard` is rated: 7/10, no note. The rest are unrated. FEEDBACK items: F9.13 (antenna flipped away from the wheel,
long antenna), F9.25 (module black), F21.4 (AN54LM-P20A, long antenna), F22.2 (match SensorLock, 42 µs), F26.10 (V4 Pro
202 µs, XA25 42 µs on a worse 3950 with better software), F27 G10 ("mosr of them are confusing": latency/software slides
simple), G1-G9, F33.3-F33.8 (problem first, mechanical fault, best problem per feature, zero compromises, classroom demos),
F14.10/F15.1/F16.1 (at a glance, before → after), F35.1 (blue Theseus, yellow one rival, grey others, red faults),
F21.8 (battery not cell), F2.42 (no dongle), "Dual 8khz wired and wireless", "khz" lowercase.

## Sources (new or reused; SRC keys to add with prefix b09)
- piaknow 2026-09-15 motion latency chart (exPiaknow; research/data/latency.json): wireless 8 khz: V4 Pro 0.34, Scyrox V8 0.51,
  VM800L* 0.65, Beast X 8K 0.68, NP01-S V3 0.70, V3 Pro* 0.77, Superstrike 0.89, GPX2 0.90; wired 8 khz: XA25 0.13 (fw 1.08),
  V4 Pro 0.26, NP01-S V3 0.25, VM800L* 0.42; wired 1 khz only for Scyrox V8 1.52, Beast X 8K 1.24, GPX2 2.14, Superstrike 2.00,
  V3 Pro* 1.75. * = Motion Sync forced on at ≤ 4 khz (may be inaccurate). Method: time from motion to the PC, one rig,
  1600 cpi, max performance settings.
- TechPowerUp spec tables: Scyrox V8 (nRF52840; wired 125-1000 Hz, wireless to 8000), G-Wolves Hati-R 8K (nRF52840; wired to
  1000, wireless to 8000), Finalmouse ULX (wired 500/1000, wireless to 4000 then 8000 by update), MCHOSE AX5 Pro Max (WCH CH32V305
  "provides a USB high-speed PHY" + Nordic nRF52840; 8000 Hz wired and wireless).
- Razer Insider (Razer staff, Viper V3 Pro): "To achieve the higher polling rates, including 2000Hz and up to 8000Hz ... ensure
  that you are using the HyperPolling Wireless Dongle" (wired stops at 1000 Hz).
- Nordic: nRF52840 full-speed USB 12 Mbit/s (nrf52); nRF54LM20A high-speed USB 480 Mbit/s (nrf54, nrf54usb); usbHs (125 µs
  microframes → 8 khz). Brock's doc #77 ("reduces the need for a second and very costly High Speed USB Microcontroller"), #90
  ("single MCU 8K wired polling").
- Raytac AN54LM-P20A page (elcRaytac): nRF54LM20A, PCB antenna, 9.9 × 13.3 × 2.0 mm, high-speed USB, 2 MB/512 KB, lists FCC,
  IC, CE, MIC, KC, SRRC, NCC, RCM, WPC; coming Q4 2026. Raytac MDBT50Q spec ver K §2.3: keep the antenna's "No Ground Pad" on
  every layer; module toward the board edge.
- Antenova (antDetune): "Batteries, shielding cans and heatsinks absorb or reflect RF energy"; detuning → "reduced efficiency,
  poor impedance matching, and in severe cases, complete communication dropouts".
- Finalmouse innovations page (finalInnov): "RF-reflective materials such as magnesium"; RF Escape avoids "the formation of a
  Faraday cage".
- Gear Patrol, Eric Limer, 2024-12-01: radio waves pass plastic but "are blocked by materials that do [conduct] (like metal)":
  why metal phones carry plastic antenna lines.
- Classroom: University of Iowa physics demo 5B20.35 "Faraday's Cage - Radio": a phone wrapped in foil (in a plastic bag) does
  not ring (also Rutgers 5B20.30).
- Digi XBee PCB-antenna design notes: keep metal at least 2.54 cm (1 in) from the antenna (rule of thumb; maybe a quiet line).
- XBAB firmware blog (xbabFw/usbHs): sensor frame ≈ 50 µs does not divide 125 µs, so unsynced reports carry "alternating 2 or 3
  frames" ("alternating 20/30 counts"), "adds a bit of stutter in the cursor/screen tracking"; synced reads: XA25 "< 0.2 µs
  jitter", "roughly a 2.3 µs gap"; 107.5 µs floor at 8 khz with frame timing control (132.5 without).
- Brock F26.10: Viper V4 Pro 202 µs frame to USB; XA25 42 µs with SensorLock on a PAW3950. XBAB on X 2026-10-07: SensorLock
  163 µs below FrameSync (xbabSensorLock). PC Gamer: piaknow's oscilloscope shows FrameSync's fixed phase (pcgFrameSync).
- Kunai tester guide fw 96.79 (kunai, private, via Brock): Theseus's 0.14 ms wireless projection (79.6 µs light to PC + 62.5 µs);
  Second Shot: 99% of lost reports rescued at 4 khz with a headset nearby, ~92% beside a headset's base station; 0.67% → 0.007%
  lost at the weakest signal tried, 15 of 220,017 stayed lost (numbers as the old secondshot slide carried them).
- SteelSeries Quantum 2.0: "2 wireless channels transmitting simultaneously" (a precedent: don't claim Second Shot is unique).
- Battery: Razer support V3 Pro 95/62/40/17 h at 1/2/4/8 khz (razerBatt); V4 Pro 180 h at 1 khz, 45 h at 8 khz (nbcV4, TweakTown;
  wired 8 khz too); TPU V4 Pro ~40 h measured at 8 khz, 306 mAh 3.87 V = 1.184 Wh (elcTpuV4); Theseus example battery
  LP402535JU 370 mAh, 1.369 Wh (elcLp4025, elc_cell()); THS.hours 200 h at 1 khz (Brock's target).

## Storyboard (film order). Times in s. Themes alternate night/paper.

### 1. b09_card (night, settle 5.5): Wireless with no penalty
- Problem: wireless usually costs something: latency (the V4 Pro is 0.08 ms slower unplugged), battery (8 khz takes ~4/5 of a
  V3 Pro's hours), or weight (a bigger battery). Answer in blue: Theseus pays none.
- Kit chapterCard2 + ledger strip (elec row focused, red → blue). Part: the black Raytac module with its long meander, one
  send pulse when the answer lands (causal: the antenna sends). List: the 7 slides' names.
- Hand-off in: b08_wheel's magnesium wheel (its metal returns on b09_radio). Out: b09_chip opens on the mouse and its cable.
- Answers: eleccard 7/10 no note → "rebuilt as the chapter's compromise card in the kit's family".

### 2. b09_chip (paper, settle 10.5): One chip, 8 khz   [MOST IMPORTANT → CHECKPOINT1]
- Problem (named, sourced): most 8 khz wireless mice drop to 1 khz on the cable: their radio chip (nRF52840) has full-speed
  USB, one report per 1 ms frame. Scyrox V8 (TPU: wired 1000 Hz, wireless 8000; nRF52840); piaknow: 0.51 ms wireless → 1.52 ms
  on its cable (3× slower plugged in). Also ULX, Hati-R 8K (TPU), Viper V3 Pro (Razer staff). The other route: a second chip
  for high-speed USB (MCHOSE AX5 Pro Max: nRF52840 + WCH CH32V305, TPU): more parts, power, cost.
- Fix: the nRF54LM20A in the Raytac module carries high-speed USB: radio and 8 khz USB in one chip (Brock #77, #90).
- Beats: 0 s header + mouse (mouseSimple top, small, nose right) with a report lane to the PC, 8 reports per ms flowing
  (slowed: 1 ms ≈ 1.4 s), readout 0.51 ms, label "SCYROX V8, WIRELESS". ~1 s pointer pushes the USB-C plug into the nose (M2);
  on contact the radio stops, the reports go down the cable spaced 8× wider (1 per ms), chip inset: nRF52840 "USB full speed:
  one report a millisecond" in red; readout re-counts 0.51 → 1.52 ms (red, "plugged in: 3× slower"). ~4.5 s wipe to Theseus,
  same plug, same lane: 8 per ms keep flowing; chip inset nRF54LM20A "radio and high-speed USB, one chip"; readout 0.14 → 0.13 ms
  (targets). ~6.5 s verdict "1 → 8 khz on the cable (higher is better)"; line "Dual 8khz wired and wireless". ~8 s payoff:
  "Plug in mid-match: nothing changes". Quiet line: the two-chip route (MCHOSE) and 2 → 1 chips.
- Headline: 8× (khz on the cable), before → after 1 → 8 khz. Hand-off out: ends on the chip inside the black module → radio.

### 3. b09_radio (night, settle 11): The radio, clear of the wheel
- Problem: metal beside an antenna reflects its signal and pulls it off its band (Antenova; Finalmouse: magnesium is
  RF-reflective). The wheel is metal (the 0.9 g magnesium wheel, callback to b08_wheel). On the board Theseus started from (the
  radio right behind the wheel, as on the Sora V2's board), the antenna band sat 12.4 mm from the axle, under the wheel's rim.
- Classroom version (demoPanel, small, ~2-4 s): a phone wrapped in foil won't ring (U. Iowa 5B20.35); real world: metal phones
  carry plastic antenna lines (Gear Patrol 2024).
- Fix (plan 5, F30.3): the sensor and the radio swap: the module moves to the board's rear, antenna forward, no turn:
  28.2 mm from the axle (2.3×), and ~12.6 mm clear of the battery (turned, it would sit ~3 mm from it).
- Beats: 0 s header + mouse top view, board lit; push in to the board's front half by ~1.2 s (establish, locator stays).
  ~1.2 s old layout: antenna sends, arcs break on the wheel (red rim), a shadow wedge toward the nose; "12.4 mm" in red.
  ~2.5 s classroom panel (foil phone). ~4 s pointer drags the module back while the sensor glides forward into its place
  (list-reorder motion). ~6 s arcs leave freely; distance re-counts 12.4 → 28.2 mm. ~7.5 s verdict "2.3× further from the
  wheel's metal"; callout on the module: "Raytac AN54LM-P20A: black, the long PCB antenna" (F9.25, F21.4).
- Board drawn from the shared 2D twin (view3D 'pcb' top; H1 regenerates it for plan 5) + elc_module (black, meander) on top.
  If the twin is not plan 5 yet: draw plan 5's positions from plan5.py numbers and say so to the integrator.
- Hand-off: the arcs leave the mouse toward the PC → b09_latency's race to the PC.

### 4. b09_latency (paper, settle 10): Motion latency, ranked   (G10 simple)
- Problem: wireless mice reach the PC late: the fastest wireless mouse measured takes 0.34 ms (Viper V4 Pro, yellow), most
  0.5-0.9 ms (piaknow, 8 khz). Fix: Theseus targets 0.14 ms (Kunai's model), within 0.01 ms of the fastest wired (XA25 0.13).
- Demonstration: a slow-motion race (1 ms ≈ 3.2 s). 0 s lanes named + the hand at the start line; ~0.8 s the hand moves
  (a jolt, a "0 µs" mark); each mouse's cursor leaves when its latency elapses (Theseus first at 0.14 ms), all at one speed, so
  position = rank. ~4 s the slowest leaves; ~5 s times written at the lane ends; ~6 s headline "2.4× sooner" (0.34 → 0.14 ms,
  target); method in one line. Rows: the 8 wireless 8 khz rows + Theseus (target, dashed lane start).
- Hand-off: the V4 Pro is 0.34 wireless but 0.26 wired: "the same mouse, unplugged, is slower" → b09_penalty.

### 5. b09_penalty (night, settle 10): No wireless penalty   (G10 simple)
- Problem: the same mouse is slower wireless than wired, at 8 khz: VAXEE NP01-S V3 +0.45 ms, ELECOM VM800L* +0.23, Viper V4 Pro
  +0.08 (the best pair, yellow) (piaknow). Fix: Theseus times the radio to each poll as the cable is: 0.13 wired, 0.14 wireless
  (targets): +0.01 ms.
- Demonstration: unplug: for each pair, a wired cursor and a wireless cursor start together at the hand's move; the wireless
  one trails by the penalty (a red gap that grows as the cable is pulled). Pointer pulls the plug (M2, callback to b09_chip's
  plug-in). Theseus last: the gap barely opens. Headline "8× smaller" (+0.08 → +0.01 ms), "wireless as fast as its cable".
- Hand-off: what's left of the delay: the frame's age → b09_sync.

### 6. b09_sync (paper, settle 11): Frame sync: 202 → 42 µs   (simple)
- Problem: most sensors run their camera on their own clock (≈ 50 µs frames) that doesn't divide the 125 µs between reports,
  so reports carry 2 or 3 frames: at a steady hand the cursor steps 20, 30, 20, 30 (XBAB): stutter. Razer's FrameSync syncs
  it, but each frame reaches USB 202 µs after it's taken (V4 Pro, Brock).
- Fix: Theseus syncs like SensorLock: 42 µs frame to USB (XA25 does it on an older PAW3950 with better software, Brock).
- Demonstration: a finger pushes the mouse at a steady speed (constant); the cursor trail on a screen strip: unsynced steps
  alternate short/long (stutter), synced steps even. Then the timing strip: camera flash → USB, 202 vs 42 µs (bars, same
  scale, "lower is better"). Headline 202 → 42 µs (−160 µs).
- Hand-off: every report the same age … unless it never arrives → b09_second.

### 7. b09_second (night, settle 10): Second Shot
- Problem: 2.4 GHz is shared with Wi-Fi, headsets and phones; a report that collides is lost; most mice send each report once,
  so the cursor hitches (freezes, then jumps) at the worst moment. shotInset: the flick's last report lost → MISS.
- Fix: Second Shot: every report goes out twice, a slot apart, on two channels; when one is lost the other lands on time.
- Demonstration: report packets crossing to the PC; an interference burst (a grey band from a headset) sweeps across and
  knocks one out (red ✕); rival cursor trail hitches; same burst on Theseus: the spare on channel B lands; trail smooth → HIT.
  Headline "99% rescued" (Kunai, pre-production, headset nearby); before → after 0.67% → 0.007% lost.
- Hand-off: two copies of every report, and still a battery that lasts → b09_life.

### 8. b09_life (paper, settle 11): Battery life at every polling rate
- Problem: 8 khz costs most mice four-fifths of their battery: Viper V3 Pro 95 → 17 h (Razer). Players turn 8 khz off, or carry
  a heavier battery (V4 Pro 180/45 h at 49 g).
- Fix: frame sync, an efficient one-chip radio and a 370 mAh battery carried by the weight the shell frees (F2.27): 200 h at
  1 khz (target), 50 h at 8 khz (derived: the V4 Pro's 1 → 8 khz ratio, 4.0×), at 29.31 g.
- Demonstration: the pointer clicks a polling-rate selector 1 → 2 → 4 → 8 khz; on each click every mouse's dot slides along its
  trade-off curve (latency ← faster, battery ↑ longer): V3 Pro (grey), V4 Pro (yellow, the frontier), Theseus (blue) past it at
  every rate. Corner labelled "Faster and longer". Headline "0.14 ms and 50 h at 8 khz" against 0.34 ms and 45 h.
  Derivations in one line (V4 Pro 2k/4k hours from a fixed-plus-per-report draw fitted to its two claims; Theseus latency
  Kunai's model 79.6 µs + half a report period).
- Hand-off out: "…a 370 mAh battery, run by one power chip" → b10_pmic.
