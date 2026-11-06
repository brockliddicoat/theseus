# R3 (standing critic, continuing R2 and R): progress
Brief: handoff/revamp2/critic-brief.md + the integrator's update (11:15): re-check R2's last open musts, then slides R2 hadn't
seen, then new changes; judge against FEEDBACK F41-F50 (F47.1 side profile must not change, F48.1 tied rail, F49.1 fingers
being redesigned by FG: don't file finger looks on builders) and BROADCAST-*.md. Owners: P1 b09-b11, P2 b02/b03/b08,
P3 b01/b04, P4 b05-b07. Findings in work/review/<code>.md (R3-<code>-n), film-level in work/review/FILM.md. No web search
(REQUESTS.md). Ledgers before mine: work/r2/PROGRESS.md, work/r/PROGRESS.md.

## Method
- Build: `LB_FAST=1 bash /home/claude/scripts/livebuild.sh` (<= one per 15 min; it wipes /home/claude/live first), then
  copy dist/main.html to film/main-<HHMM>.html (+ ids, hashes of src files).
- Changed slides: `python3 scripts/slidediff.py <old html> <new html>` (hash of each S({...}) block, wrapped S(x({ too).
- Shoot (one browser, PAR=1): `bash scripts/shoot.sh <html copy> <outdir> $(H=<html> python3 scripts/specs.py ids...)`
  (FOUR=0 for 0/mid/settle). Settles read from the html. Sheets: `bash scripts/mksheets.sh <shotdir> <tag> ids...`
  -> sheets/<id>_<tag>.jpg (+ _phone.png); phone grid: scripts/phonegrid.py. Full-frame coords = (sheet - (960,540)) × 2 for
  the settle quadrant.
- Profile check (F47.1): ref/b05_card_6_0955.png vs a new b05_card:6 crop (960,250,1920,620): identical at 1111.
- Write: sec/<code>_<HHMM>.md, then `python3 scripts/insert.py /home/claude/work/review/<code>.md <sec>`.

## Ledger (slide | builds seen | state)
- Build 1111 (105 slides, same order as R2's 1100). Changed since 1100: b05_card, b05_material, b08_tape, b10_software,
  b11_screws, b11_wear, b11_battplug, b11_board (all seen 1111).
- R2-b02-1 (must, tensioner/stiff t=0): STILL OPEN 1111 (b02 file unchanged since 10:52). R2-b02-2..-8 open.
- b02_tensioner | 1111 | R3-b02-1 should (red heat on Theseus's bridge; colour by share used or neutral).
- b11_* | 1111 | R2-b11-1/-2/-3/-4 CONFIRMED FIXED. R3-b11-1 should (b11_board "The wordmark" leader on the sensor, QR low),
  R3-b11-2 should ("(F30.15)" on screen), could (b11_screws "most mice" class 4.8).
- b08_tape | 1111 | R2's M4 finding CONFIRMED FIXED.  b05_card, b05_material | 1111 | good; could (mid-frame 2.0 N vs 3.73 mm).
- b03_side, b03_rail | R2's 1100 frames | F48.1 confirmed. R3-b03-1 should (5 mm greased guide in Theseus blue).
- b10_software | 1111 | good (R2-b10-8 stays fixed).
- F-checks at 1111: b07_board (0.6 mm board, 0.64 → 0.21 mm), b07_arms (53 → 45 µm), b09_radio (F48.2: 17.2 mm, 19.5 mm,
  4.3×, short of 20), b01_budget (5.60 g "a target", side switches 1.00 g, shell about 9.3 g), b07_balance (9.35 g, board
  target), b03_switch (13.6 → 0.4 %, +15 %), b04_camera: all consistent with F42.2/F44.2/F47.4/F48.2/BROADCAST-0945.
  H3's board-thickness musts (b03_switch drawOurs 1.0 mm, P2; b04 lens section B04S.board, P3) pending.
- Build 1128 (11:28): 0.6 mm board rollout (b01_budget path line, b04 lens section BOARD_T, b07 board/arms, b10 board, b11
  joints/OWN_SEAT 4.4 mm aside 0.15 mm). Seen: b01 all 11 + close (good; coulds filed and applied), b04_module, b04_sag,
  b10_board (R3-b10-1 filed, FIXED 1143), b11_inserts, b11_repair, b05_cubed/fallacy/nopick, b06_fillet/filletsize.
- Build 1143 (11:43): P2's b02 pass + b03 + P1's b11 + P3's b04 + P4's b05. CONFIRMED: R2-b02-1 MUST CLOSED (tensioner, stiff
  draw at t=0), R2-b02-2..-8, R2-b03-6 (= my R3-b03-1), R3-b10-1, R3-b11-1/-2, b01 coulds. R3-b02-1 WITHDRAWN (Brock F18.6
  "scant to peak"). New: R3-b03-2 should (b03_timing verdict 72 -> 70 us is the smallest win; use 4.4 ms -> 0),
  R3-b07-1 should (b07_poron scale note collides with verdict label), R3-b08-1 should (b08_gripmap strikes Theseus's own
  one-way ridges: K's 11:20 convention). Confirmed P4's b06 (-1,-2,-3,-5,-6,-7,-8) and b07 (-6..-11) replies; P2's b08 replies.
  Open with no reply: R2-b03-1/-2/-3 (b03_debounce: drag click not drawn; "Default wait: Fnatic 4 ms" is Fnatic's advice),
  R2-b03-4 (b03_binning verdict vs the unbinned datasheet spread), R2-b06-4 (palm drawing; FG).
- Load spiked to 10 at 11:53 (my 19-slide shoot crashed once at b07_size; rerun fine). Keep batches <= 15 slides.
- Build 1203 (12:03, 107 slides): L1's b12_latopt + b12_ribs after b06_filletsize (slides 57-58); b03_rail before b03_side
  (FILM F36 applied). New review file work/review/b12.md: R3-b12-1 MUST (b12_ribs depth sweep has one data point),
  R3-b12-2 MUST (0.60 mm skin / 0.36 mm ribs under the film's 0.89 mm PP floor: FILM F42, told integrator + L1 by message),
  R3-b12-3 should (two fillets: 0.18 root vs b06's 0.6 node), R3-b12-4 should (ruler panel text overflows).
  FILM F42 (must, integrator): one floor rule + one set of Theseus lattice numbers. b06.md heads-up + should (b06_lattice's
  1.2x/38 % line: re-source to L1: tri 92.3 vs hex 106.9 um = 1.16x -> 1.1x).
  CONFIRMED 1203: R3-b03-2 (timing verdict 0.0 -> -1.4 ms "at best"), R2-b03-1/-2/-4. b03 has nothing open from me.
- 12:10-12:15 fresh-eyes pass on build 1203: b04_focus/skates/sensor/reports (R3-b04-1 should: b04_sensor strikes the older
  PAW3395, research asked for PAW3950 specs), b05_wall, b02_cutouts/seams/front/flush/direct (R3-b02-2 should: b02_front's
  struck owner "Grooved" right before b02_grooves), b10_pmic/charge/battery/sealed/twist/cable/lights (3 coulds).
  REQUESTS.md: R3 section (PAW3950 datasheet; PP minimum wall for FILM F42).
  Not yet seen by me this session: chapter cards b04/b08/b09/b11/b07_shcard at settle (R2 closed F12), b07_balance mid-frame
  only at 1111. Everything else seen at least at settle since 11:11.
- 12:18 coordinator: Brock decided F42 ("Skin: 0.60 mm, to be proven": P4 restates b05_wall/b06_filletsize/b06_mold on flow
  length + rib rules; L1 labels 0.60 a target, fixes the depth sweep), F35 ("Drop it from the box": integrator edits b11_box
  + trifold, spares = skates only, tape cell "Etched"), fingers "A Line" (FG phase 2, kit finger()). FILM F35/F42 closed
  in FILM.md (12:18 section). Re-review those slides as owners report.
- Build 1218 (12:18): CONFIRMED R3-b12-3/-4 (two fillets named: root 0.24 in section, node 0.22 in plan; ruler text wraps),
  R3-b08-1 (gripmap plain stats), b06_lattice re-sourced to L1 (hex 15 % more flex), b06_mold quotes the 0.22 mm node,
  R3-b02-2 ("Grooved to the edge"). New R3-b12-5 should (rib 1.80 mm is 5 rib widths, past the drawn Xometry/Stratasys
  3-rib-width line, unsaid). Pending: R3-b12-1 must (depth sweep, L1), 0.60 "target" label (L1), P4's F42 restatement of
  b05_wall / b06_filletsize / b06_mold (still "0.89 mm floor" at 1218), b04_sensor PAW3950 (research), b11_box (integrator,
  F35), FG's "A Line" finger.

## For the next critic (kept current, 12:2x)
1. Musts open: R3-b12-1 (b12_ribs depth sweep has one point; L1 fixing). Nothing else open at must level.
2. Re-review as owners report (Brock's 12:10 answers): P4's F42 restatement (b05_wall "Fills down to 0.89 mm", b06_filletsize
   and b06_mold "struts under 0.89 mm, too thin to mold" must become rules of thumb + flow length), L1's b12_ribs (0.60 mm
   "a target, to be proven", the depth sweep, R3-b12-5's 3-rib-width line), the integrator's b11_box + trifold (tape out,
   spares = skates, tape cell "Etched"), FG's "A Line" finger in the kit (check locator size, both grounds, b02_seams'
   two fingertips, b08_tape's section, b05_hotspot's press).
3. Shoulds waiting on replies: R3-b07-1 (b07_poron label collision), R3-b04-1 (b04_sensor foil: PAW3950, research asked),
   R3-b10 coulds (battery 33 vs 30 h, charge 8.6 vs 8.3 h, sensor glow red), b03_timing could (caption vs −1.4 ms).
4. Watch: S2's shape (O1 opening, K3 corners, rim to the scan, F49.2 trigger line) reaching 06-motion.js / geo2d: the side
   profile must not change (F47.1). Reference: ref/b05_card_6_0955.png vs b05_card:6 crop (960,250,1920,620).
5. Film-level open: F38 (ground flips 93/106 at 1218), F23 (Shell is 26 slides now), F34 (ruler on b05_cubed, not b05_fallacy),
   F40 CLOSED (no feedback IDs in drawn strings at 1218), F41 (verdict grammar; all three named cases
   now fixed: gripmap, timing, binning).
