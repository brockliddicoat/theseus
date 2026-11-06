# R2 (standing critic, continuing R): progress
Brief: handoff/revamp2/critic-brief.md + the integrator's update (start with R's "not yet seen", then R's open musts and new
slides; judge against BROADCAST-0930/0945 and FEEDBACK F41-F43; b09-b11 now owned by P1 (POLISH.md); no web search:
REQUESTS.md; keep FILM.md current). R's ledger: /home/claude/work/r/PROGRESS.md.

## Method (R's, reused)
- Build: `LB_FAST=1 bash /home/claude/scripts/livebuild.sh`; snapshot to /home/claude/work/r2/film/main-<HHMM>.html (+ ids, hashes).
- Shoot (one browser): cd /home/claude/live/deck; NODE_PATH=/opt/npm-tools/node_modules Q='&2d=1' PAR=1 node tools/shoot.js
  <copy> /home/claude/work/r2/shots/s<HHMM> 0 $(python3 /home/claude/work/r2/scripts/specs.py ids...)  (~3.5 s a frame now)
- Sheets: bash /home/claude/work/r2/scripts/mksheets.sh <shotdir> <tag> ids... -> r2/sheets/<id>_<tag>.jpg + _phone.png;
  phone grid: python3 scripts/phonegrid.py <out> <phone pngs>.
- Write: sections in r2/sec/, then python3 scripts/insert.py /home/claude/work/review/<code>.md <section>.

## Ledger (slide | builds seen | state)  (R2 ids in work/review/<code>.md)
- b08_uv, b08_tape, b08_twotone | 0935 | R2-b08-1..7 (uv: stains vs UV-only test, paragraph not shown, late payoff; tape: M4;
  twotone: "the paint chips" unsourced).
- b10_pmic, b10_charge, b10_sealed, b10_wires, b10_twist, b10_software | 0935 | R2-b10-1..15. Musts: -1 (sealed: 14 s picked,
  60 s < DTU's 62 s), -3 (twist: blue noise source / blue on the side-by-side lead), -8 (software: label collision).
- (10:00) Integrator: CPU overloaded; pace (PAR=1, <= 1 LB_FAST build / 15 min, 3 frames: 0, mid, settle; finished chapters
  first). New scripts: scripts/specs3.py (3 frames), scripts/sheet3.sh (0, mid, settle + phone in one sheet).
- b03_debounce, b04_sag, b05_hotspot, b06_arch, b06_thrust, b07_board, b07_arms, b07_balance | 0935 (+0955 settle re-check for
  hotspot, arch) | R2-b03-1..3, R2-b04-1 (good), R2-b05-1 (MUST: stale answers rows) -2, R2-b06-1..4, R2-b07-1..4.
  Fixed before I filed: b05_hotspot verdict over foot lines (0955), b06_arch scale note under finger (0955), b07 10 N wording.
- b02_card, grooves, wedge, tensioner, stiff, rails, pom | 0955 | R2-b02-1 MUST (frame one empty: tensioner, stiff), -2..-8.
- b03_binning, spdt, hotswap | 0955 | R2-b03-4 (binning verdict vs the binned rival), -5 could.
- b08_wheel, b08_card | 0955 | R2-b08-8 MUST (placeholder data on screen), -9, -10.
- Build 0955: 104 slides, all new (old ones gone). New since 0935, not yet seen: b01_price, b01_targets, b01_budget, b01_close,
  b04_card, b04_sensor, b04_reports, b05_card, b05_material, b05_cubed, b05_work, b06_arches, b06_filletsize, b07_sheet,
  b07_shcard, b07_emg. Also never seen by R or me: b01_cover, b01_listed, b01_illusion, b01_rank, b04_focus, b04_skates,
  b04_module, b06_fibres, b06_fillet, b06_mold, b07_poron, b07_newton, b07_sides, b07_size.
- b01_cover, listed, illusion, rank, price, targets, budget, close | 0955 | R2-b01-1 MUST (cover: 0.14 ms target shown as
  "on Piaknow's rig"), -2 MUST (targets: "under 2.0 ms" unsupported; NC releases at the snap, not the travel's start), -3..-5.
- b04_card, b05_card, b07_shcard | 0955 | F12 (frame one) still; b05_card lists only b05's 9 of the chapter's 23 (FILM F22).
- Build 1007 (10:07). b04_focus, skates, module, sensor, reports | 1007 | R2-b04-2..5 (should), coulds.
- b05_material, cubed, work | 1007 | R2-b05-3 (pull test is a bending load), -4 (ULX material, unverified), -5 could.
- b06_arches, fibres, fillet, filletsize, mold | 1007 | R2-b06-5 (fibres: red in both nodes), -6 (16.6→8.3 twice; Comet's
  own number gone), -7, -8 could. FILM F26 (order: arch/thrust before arches).
- b07_poron, sheet, newton, sides, size, emg | 1007 | R2-b07-5 MUST (emg: blue on Zowie FK1/S2), -6..-11.
- Re-checks 1007: R-b02-9 FIXED, R-b10-3 FIXED, R-b05-10/F17 CLOSED (Sora V2). b05_margin vs hotspot: R2-b05-6.
- FILM.md 10:55: F26 (b06 order), F27 (Shape order), F28 (fillet trio), F29 (L1 study vs printed numbers; placement),
  F30 (verdict owners), F31 (one voice), F32 ("Next:" in clips), F33 (tensioner's 120 MPa).
- All 104 slides seen once. Polish agents now own files: P1 b09-b11, P2 b02/b03/b08, P3 b01/b04, P4 b05-b07.
- 11:00 frame-one sweep of all 104 (sheets t0_all_a/b/c.jpg): misses = 7 chapter cards (F12), b01_targets, b02_tensioner,
  b02_stiff. FILM F2 update. 11:05 FILM F34 (ruler belongs on b05_fallacy/nopick, F45.1), F44 status.
- New feedback since brief: F44 (side rails x3 on b03_side; side switches from the shell; POM fit; wheel research), F45 (ruler).
- NOTE: my stamps before 10:20 ran ~30-45 min ahead of the machine clock; relabelled in review files ('R2 clock'); FILM.md headings corrected. From 10:20 I use date +%H:%M.
- Build 1029 (105 slides: + b03_rail). F12 CLOSED (cards fixed by K). Re-checks: R2-b04-2/-4/-5 FIXED (P3); M-b11-3 done;
  b11_box X3 row done; b11_repair callback done. New: R2-b03-6..8 (b03_rail), R2-b11-5 (grip tape vs b08_tape),
  R2-b09-1 (radio measure changed; F40.4 stale). FILM F35 (tape question), F36 (rail before side), F37 (radio record).
- 10:50 seam sheets of all 104 (sheets/seams_1029_1..5.jpg; scripts/seams.py, settles.py). FILM F38 (ground flips at 94 of
  104 seams; one ground per shared-subject run), F39 (seams that work). b10 musts (sealed, twist, software) still open in 1029.
- 10:46 build 1044: CONFIRMED FIXED R2-b01-1..5 (P3), R2-b05-1/-2, R2-b07-5, R2-b08-8 (-9 closed). Open: R2-b02-1 (must),
  R2-b07-6, b03_side placeholder (must after F48.1), b10 musts (P1 not yet). Order: b02_wedge moved after b07_tolerance (good).
  New feedback F46-F48 read (F48.1 tied posts, F48.2 radio accepted, F47.4 0.6 mm board).
- 10:50 confirmed in 1029 settles: R-b01-8/-9/-11 addressed (b01_lighter "half the force", b01_battery same-draw 141 → 200 h),
  b02_cutouts in the film's gf spread form (5.3 → 0.0 gf), b03_switch on BROADCAST-0945 (13.6 → 0.4 %, +15 %), b03_timing is
  "Negative latency" (Brock's own term, #79: fine). Could, unfiled: b01_battery's struck 141 h has no owner label.

## For the next critic (kept current)
1. Open musts (re-check in frames): R2-b02-1 (tensioner/stiff empty t=0, P2), b03_side's red "placeholder" guide + "friction
   aside" (P2, F48.1), R2-b10-1 (sealed 14 s / 60 s), R2-b10-3 (twist blue noise), R2-b10-8 (software collision) (P1).
2. Shoulds with no reply yet: b02 (-2..-8), b03 (-1..-8), b06 (-1..-8), b07_emg (-6), b08 (-1..-7, -10), b09 (-1), b10 (-2..-15),
   b11 (-1..-5). P4 replied to b05/b07 (confirm frames), P3 to b01/b04 (confirmed).
3. Watch for: L1's lattice-study slide (30-b12-latopt.js; FILM F29: its numbers vs b06's printed 12.5 mm cells / 0.6 mm
   fillet / 60 mm strip), S1's shape changes (F46: wheel opening O1, rear corners K3; F47.2 rim) reaching b02 drawings, H2's
   battery (F42.1) on b07_balance / b10, F47.4's 0.6 mm board on b07_board / b07_arms (re-derived ties).
4. Film-level open: FILM F22 (cards index whole chapters; b05 done), F26 (b06 order), F27 (Shape order), F28 (fillet trio),
   F30 (verdict owners), F34 (ruler placement), F35 (grip tape question), F36 (rail before side), F38 (ground flips).
- 11:01 build 1100: CONFIRMED FIXED all three b10 musts (P1) + R2-b10-2,4..11; b03_side (F48.1) fixed; R2-b06-1 fixed; FILM F26
  (b06 order) and F27 (Shape: size first) applied. Last known open must: R2-b02-1 (tensioner/stiff t=0, P2).
