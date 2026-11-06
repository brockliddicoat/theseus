# R (standing critic): progress — HANDED OFF 2026-11-06 ~09:50 (machine clock), context full

Brief: handoff/revamp2/critic-brief.md. Read first: common.md, KIT.md, REVAMP.md, FEEDBACK.md (F27, G1-G10, F32-F39).
Builders' own clocks run ~20 to 60 min ahead of the machine clock; my timestamps are the machine clock.

## Method (reuse as is)
- Build: `LB_FAST=1 bash /home/claude/scripts/livebuild.sh` (seconds). A file mid-edit is dropped that round (b02, b04, b11
  each dropped once): just rebuild later. Snapshot: cp /home/claude/live/deck/dist/main.html to film/main-<HHMM>.html (+ ids,
  + hashes-<HHMM>.txt = md5 of each builder file).
- Shoot from the copy, one browser: cd /home/claude/live/deck; export NODE_PATH=/opt/npm-tools/node_modules;
  `Q='&2d=1' PAR=1 node tools/shoot.js <copy> /home/claude/work/r/shots/s<HHMM> 0 $(python3 /home/claude/work/r/scripts/specs.py ids...)`
  (0, 0.6, 40 %, settle; ~1 s a frame). Sheets: `scripts/mksheets.sh <shotdir> <tag> ids...` → sheets/<id>_<tag>.jpg + _phone.
  Frame-one sweep: shoot `id:0` for all, then `scripts/contact.py <out> 4 <files>`.
- Write: `python3 scripts/insert.py /home/claude/work/review/<code>.md <section.md>` (new section under the heading,
  newest first; safe with the model auditor's sections). FILM.md: insert new dated section above the previous newest.
- Research: append to /home/claude/work/research/REQUESTS.md (answers in FILLS.md). No WebSearch.

## Ledger (slide | builds seen | state)   R-ids are in work/review/<code>.md
- b01_compromise | 0829 0849 0903 | R-b01-1, -3 FIXED (frames); -2, -4, -5, -6, -7 replied FIXED (code confirms 0.4 % via
  B03.mechShare; foot cites TechPowerUp first batches). F17 (ULX vs b05_fallacy) open.
- b01_lighter | 0849 | R-b01-8 (scale-free headline), -9 (70 ms threshold), -10 could. Not re-checked.
- b01_battery | 0903 | R-b01-11 (listed vs derived; derive the four blanks: X2F ~120 h → 1.6×). Not re-checked.
- b01_density | 0912 | good, no findings.
- b02_cutouts | 0829 0849 | -1, -6 FIXED; -2 closed (my error); -3, -7 WHY NOT accepted; -4, -5, -8 replied FIXED (not yet
  confirmed in frames).
- b02_front | 0849 0912 | R-b02-9 MUST still open in 0912 (arrows through caption + panel title); -10..-13 open.
- b02_flush | 0903 | -14 (verdict ~9 s), -15 could.  b02_seams, b02_direct | 0912 | good; coulds.
- b03_side | 0829 | -1..-6 (replies exist in b03.md: not yet confirmed).  b03_switch | 0849 | -7 (19 of 35 counts hybrids),
  -8, -9, -12 (drop "up to 2×", F18).  b03_timing | 0903 | -10 ("most mice" vs optical no-debounce), -11.
  b03_spdt, b03_hotswap | 0849 | mid-flight, unreviewed.  b03_debounce: not seen.
- b04_camera | 0855 | -1 (no recognisable problem/win), -2.  b04_sag: not seen (b04 file dropped in 0912; rebuild).
- b05_nopick | 0829 0903 | -1 FIXED; -2 finger, -3 vs hotspot, -4.  b05_margin/specific/wall | 0855 | -5..-9.
  b05_fallacy | 0903 | -10 MUST with b01 (F17).  b05_hotspot: not seen.  (Model auditor M covers b05's models.)
- b06_light | 0829 0903 | -1 FIXED; -2..-4 (replies exist).  b06_lattice | 0912 | good; -5 could.  b06_arch, b06_thrust: not seen.
- b07_tolerance | 0829 0903 0912 | -1, -2, -3, -4 FIXED; -5, -6 open (minor).  b07_board, b07_arms, b07_balance: not seen.
- b08_grip | 0829 0912 | -1, -2, -4 FIXED; -3, -5 open.  b08_gripmap | 0855 | -6 closed, -7 could.  b08_coating | 0912 |
  -8 (internal verdict).  b08_film | 0912 | -9 could.  b08_uv, b08_tape, b08_twotone: sheets made (sheets/*_0912.jpg), NOT viewed.
- b09_chip | 0829 | coulds.  b09_card..b09_life | 0855 | -4..-8 (penalty ratio of rounded targets; radio's own-layout before).
- b10_board, b10_cable | 0855 | -1, -2.  b10_lights | 0903 0912 | -3 MUST still open (0 % vs 0.4 %), -4 (G703 source), -5.
  b10_battery | 0912 | good.  b10_pmic, b10_charge, b10_sealed: sheets made (sheets/*_0912.jpg), NOT viewed.
  b10_wires, b10_twist, b10_software: not seen.
- b11_repair | 0829 | -1 (duplicates b03_hotswap, F5), -2 (optional tool counted), -3, -4.  b11_card, screws, inserts, wear,
  battplug, board, box: not seen (only their t = 0 in the sweep).
- Chapter cards: b09_card seen (kit F12: empty at t = 0); b11_card same.

## FILM.md items (work/review/FILM.md)
F1 two ledgers (open, largest); F2 frame-one sweep (done 0903: only cards); F3 one uniformity verdict form (b02 partly
adopted); F4 one test strip for shell; F5 hotswap vs repair; F6 callbacks (b07 done); F7 resolved; F8/F15 internal verdicts;
F9 rival outlines (kit); F10 grid "+" row (b02 fixed its own); F11 intro order; F12 chapter card frame one (kit, must);
F13 callbacks working; F14 latency/penalty merge option; F16 caption cross-fade; F17 ULX (with callback fix); F18 three
battery figures; F19 200 h basis; F20 "most mice"; F21 opening in good shape.

## For the next critic
1. Fast build; confirm replied fixes (b01 -4/-5/-6, b02 -4/-5/-8, b03 side, b05, b06) in frames; re-check R-b02-9, R-b10-3.
2. View the sheets already made: b08_uv/tape/twotone, b10_pmic/charge/sealed (sheets/*_0912.jpg).
3. First looks: b03_debounce, b04_sag, b05_hotspot, b06_arch, b06_thrust, b07_board/arms/balance, b10_wires/twist/software,
   b11_* , then the intro slides still to be built (cover, targets, listed, illusion, rank, price, budget, close) and the
   chapter cards.
