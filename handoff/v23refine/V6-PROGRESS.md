# V6: move 6 of the v23 refinement ("More hours from the same battery"). Progress log

Started 2026-11-06 ~18:58. Worktree /home/claude/work/v6, branch v6-move6 (from 78a4ef4). Build: `python3 tools/build.py main --out=v6`.

## Step 1: compare (v23 in the film against the revamp's replacements, ?film=0)
Sheets at settle: work/v6/cmp/v23_m6_1.png, v23_m6b_1.png (row 6 as it played), rv_m6_1.png, rv_m6b_1.png (the revamp's b09_*,
b10_*). Mid frames of the kept slides: checks/mid_1.png.

## Step 2: the choice
Rule (as V3, V5): keep v23's peaks with his fixes unless the revamp's rebuild IS that slide with his notes done; a slide he
called lazy or "combine" goes to the better version; cut what adds no hours, density or 8 khz motion. Row 6: 22 slides with
the card, now 7.

MOVE 6 (6 + card): four upgrades that spend what moves 2 to 5 handed on (FILM.steps[6]), then the three bars together.

| Upgrade | Slide in the film | Was (his score) | Call | Why |
|---|---|---|---|---|
| card | mv6 | (eleccard 7) | keep, text | "Builds on" now names move 5's frames too (the board's 5 to 6); "Unlocks" names the three bars; the stat keeps the battery against the pack it replaced. |
| 1 nothing lit | b10_lights | srf_encoder (2), elc_sheet2 (2) | swap | His elc_sheet2 note: "add the no rgb light to the slide about having no optical components, and put it next to the web software". The rebuild is that slide: the Viper V4 Pro's three lights (two optical switches, an optical wheel) go out one by one, no RGB said with Logitech's G703 hours, and it now opens move 6, one card after b10_software. Fixed: its verdict counted the wheel's assumed current (+23 %), a second figure for the saving every other slide calls +15 %. Now it counts the switches alone (13.6 to 0.4 %, +15 %, the film's 194 h) and the wheel keeps its row, "assumed", not counted. |
| 2 the same battery | power | power (unrated) | keep v23 | V4's story already in it (194 h against 180 h on a battery the Viper's size): the battery bar's step. The frame-sync note (b09_sync's idea, off topic here) became the 8 khz basis, see below. |
| 3 one chip, 8 khz | b09_chip | onechip (unrated) | swap | A demonstration (the same flick at 1 khz and at 8 khz) where v23's was a chip table. |
| 4 frame sync | b09_sync | framesync (unrated) | swap | Cursor and hand on screen, the same 202 to 42 µs. |
| 4 | b09_latency | motion (unrated) | swap | The race v23's ranking became (G10: one clock, one number); the motion bar's second step. |
| recap | powerup (NEW) | | new | The supercharge, shown: density, battery and motion latency fill step by step in the order of the moves that earned them (2, 3; 5; move 4's switches banked for the battery), then move 6 lands on all three at once: they reach the line together (5.2 s, the line flashes) and overfill together (each overflow rings once). Figures from LO's table, the dock's own. |

Cut from move 6 (none of them adds hours, density or 8 khz motion; Brock's direction: "not self contained where every slide
shows something a mouse is insignificantly good at"):
- cells (4: "lithium ion numbers are way off") and b10_battery: every flagship already carries a pouch; it moves no bar.
  V4 had fixed its figures (Li-ion +1.3 g at 300 mAh, as his note says). The 1.6 g the smaller battery saves is on the card
  and the recap.
- frontier (unrated): the same two charts b01_battery (move 0) and powerup make.
- elc_pmic, elc_charge, elc_safe and b10_pmic, b10_charge: the power chip, fast charging and its guards.
- elc_module, antenna and b09_radio: the radio module and its antenna.
- elc_rate and b09_penalty: the wired line is on b09_latency already (0.13 against 0.14 ms).
- secondshot and b09_second: Second Shot sends every report twice, a radio cost the 194 h doesn't count. Out until its cost
  is known.
- elc_twist, elc_lay and b10_twist: wire noise, a detail.
- cable (3: "extremely lazy visualizations, paracord needs better assets") and b10_cable: charging while you play. The
  rebuild's paracord is better drawn, but it adds nothing to this move.
- Leaving move 6, with a better home (question 1): elc_tear (8) with elc_flex (7), whose rebuild b10_wires is the same
  drawing with an honest pull figure (0.3 to 14.0 N, about 45×, not 200×) and the fold; elecsheet1 (7) and its rebuild
  b10_sealed (a coat that keeps water out, +0.24 g: his "for very little weight"); elc_oneside (7) and b10_board.

## Step 3: the compounding (25-film.js, row 6 only)
- FILM.order row 6; FILM.link lines for every slide in it (each under 80 characters, one line in the footer).
- FILM.steps[6]: 'nothing lit', 'the same battery', 'one chip, 8 khz', 'frame sync'; done: 'three bars past the line'.
- FILM.moves[6]: builds (move 4's switches, move 5's frames), unlocks (the three bars), stat (v6_cardStat). Edges unchanged
  (2, 3 to 6 Density; 4 to 6 No opticals; 5 to 6 Every frame).
- Nothing outside row 6, its links and steps, and move 6's entry.

## The 8 khz claim (V4's open point): sourced
TechPowerUp's G Pro X Superlight 2 review (page 7) quotes Logitech's own hours in optical and hybrid switch modes at three
rates (290 mAh): 96/104 h at 1 khz, 55/61 at 2 khz, 42/48 at 4 khz. So the two optical switches cost 0.23, 0.52 and 0.86 mA
(derived): the cost climbs with the rate, it is not fixed. The film's 43 h at 8 khz takes the Viper V4 Pro's switches at the
same share of its draw as at 1 khz, which is 1.05 mA at 8 khz: 4.5 times their 1 khz cost, where Logitech's climb 3.7 times
by 4 khz. The fixed case (0.23 mA at 8 khz) would give Theseus 38.6 h, under the Viper's 40; Logitech's figures rule it out.
Said on the power slide (a "Derived" box: "Optical switches cost more at 8 khz") and in its source line; SRC v6Gpx2Rates;
V6_OPT in 30-b14-move6.js.

## Other fixes
- elc_safe (out of the film, still in the deck): it drew an "NTC lead" as the battery's third wire and said the PMIC reads
  "the battery's own" sensor. Neither EEMB's nor Jauch's pack lists one (batteries.json: two-wire packs). Now: "Two wires.
  No sensor inside: one on the board, proposed", and the caption says the sensor sits on the board beside the pack.

## Files
- deck/src/25-film.js (row 6; move 6's entry; links; steps 6)
- deck/src/30-b14-move6.js (NEW: SRC v6Gpx2Rates, V6_OPT, v6_mA, v6_cardStat, v6_upRows, v6_chip, the powerup slide)
- deck/src/10-f-elec.js (power: the 8 khz basis box and source; elc_safe: two wires, honest)
- deck/src/30-b10-power.js (b10_lights: the switches counted alone, the wheel "assumed", caption, source, answers)

## Checks (19:10)
- film.js check, the whole film (95 slides) in batches of 15: 0 errors (checks/film_check.txt). That includes b10_software
  (move 5's last), every slide of move 6 and mv7.
- Settle and mid frames of every slide in move 6 looked at (checks/mid_1.png; the close-ups); powerup at 1.4, 3.6, 3.9, 4.8,
  5.3, 6.2 and settle: each beat lands in turn, the captions with their motion.
- &2d=1 (checks/2d_1.png): powerup, b10_lights, power, mv6, b09_latency look the same as the film.
- Not checked: the MP4 reel (skipped, as briefed).

## Deliverables
- Close-ups (1600 px): out/v6_peak1_three_bars_past_the_line_2026-11-06.png (the bars overfilled),
  v6_peak1b_bars_reach_the_line_together_2026-11-06.png (5.3 s: the three reach the line together),
  v6_peak2_same_battery_more_hours_2026-11-06.png (power, with the 8 khz basis),
  v6_peak3_nothing_lit_but_the_sensor_2026-11-06.png (b10_lights, the switches counted alone).
- Build: deck/dist/main-v6.html (95 slides).

## For main (merge notes)
1. Homes for the three well-rated slides that left move 6 (question 1): b10_wires (elc_tear 8 + elc_flex 7; "ribbons are the
   most common failure in assembly and repair", #51) into move 8, "Built to be opened"; b10_sealed or v23's elecsheet1 (7)
   into move 7, "A finish that weighs nothing" (a board coat for 0.24 g beside the shell's); elc_oneside (7) or b10_board,
   main's call (move 8, or out).
2. One factor, two prints: b09_latency says the Viper V4 Pro's 0.34 ms is "2.3× sooner" than Theseus's target (the model's
   0.142 ms, floored); the dock (lo_thsVals, the rounded 0.14) prints "2.4×". The honest floor is 2.3×. LO is shared code,
   so not changed here; powerup prints the figures (0.14 against 0.34 ms), no factor.
3. Slides outside the film still say 370 mAh in places (b10_battery, b10_charge, b09_life: V4's list). None is played.

## Questions for Brock (plain words, each with a recommendation)
1. Three slides you rated well (the braided wires, 8; the water-proof coat, 7; one board on one side, 7) don't add battery
   hours, so I took them out of the battery move. Put the braided wires in "Built to be opened" and the coat in "A finish
   that weighs nothing"? Recommended: yes, and drop the one-sided board unless you want it back.
2. The battery move now ends on one slide where the density, battery and motion bars fill move by move and then cross the
   line together. Want the move card to stop showing them overfilling, so this slide is the first time you see it?
   Recommended: no, keep both (the card is the headline, this slide is the why).
3. The old "pouch battery per gram" slide is out: every rival already uses that kind of battery, so it doesn't push past
   anyone. Fine to leave it out? Recommended: yes.
