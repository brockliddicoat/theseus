# Review findings for b10

## CRITIC (R2), 2026-11-06 11:01 (machine clock), build 1100: re-check of P1's work
Frames: /home/claude/work/r2/sheets/r1100_b.jpg (sealed, twist, software at settle).
**R2-b10-1, -2, -3, -8 CONFIRMED FIXED** (all three musts): b10_sealed prints DTU's whole range, "14 to 62 s to a short, bare",
runs the coated clock to 120 s and sources the coated result (Yoo 2024: no failure until the drop dried), "+0.24 g, under 1 %";
b10_twist's noise source is neutral and the side-by-side current red; b10_software's labels no longer collide. Also done:
R2-b10-4 ("side by side, as in a ribbon"), -5 (the lead passes plan 5's antenna at about 6 mm, said), -6 ("an ideal twist,
derived" in the verdict's label), -7 (pointer gone), -9 (the fine-step argument: a pad that loses tracking at 1 mm puts a
1-or-2 sensor at 2 mm, Theseus at 1.2: 3.0 → 1.8 mm), -10 (the crosshair 1.3° off each lift), -11 (plain label). Good work.

## CRITIC (R2), 2026-11-06 (R2 clock 10:54, about 30 min ahead of the machine), build 1007: re-check b10_lights
Sheet /home/claude/work/r2/sheets/b10_lights_1007.jpg. **R-b10-3 CONFIRMED FIXED** and BROADCAST-0945 applied: optical switches
6.8 % each (0.116 mA, Logitech's hours), the wheel 5.8 %, 19.5 % in all, against Theseus's 0.2 % parts and 0.6 % total; +23 %
hours (1.70 / 1.377 mA = 1.23: checks); the G703 line is the research's 32 / 24 h. (could) the parts as printed sum to 19.4 %
(5.8 + 6.8 + 6.8) while the total says 19.5 % (5.88 + 6.82 + 6.82): print the wheel as 5.9 or the parts to two decimals.

## CRITIC (R2), 2026-11-06 (R2 clock 09:55, about 30 min ahead of the machine), build 0935: b10_pmic, b10_charge, b10_sealed, b10_wires, b10_twist, b10_software (first look)
For P1 (now owns this file). Sheets: /home/claude/work/r2/sheets/<id>_0935.jpg (0, 0.6, 40 %, settle), phones_b10.jpg.
Reply under each finding (FIXED / WHY NOT). R's R-b10-3 is confirmed fixed in code (B03.mechUA); POLISH.md's 45 h item
is still open in this build (b10_charge prints 3.7 → 7.7 h; 45 h gives 0.092 × 45 = 4.1 and 0.166 × 1.369 × 45 / 1.184 =
8.6 h: check the last digit with the unrounded percentages).

**b10_sealed.** Good, keep it: sweat as salt water, a powered gap, the tin tree growing across it, the ACS classroom beaker
beside it doing the same thing, the coat drawn honestly as a tint ("it is 50 µm thick"), HyperX named as the exception.
**R2-b10-1 (must): the comparison doesn't hold at its own numbers.** DTU 2012's times to failure are "62 s, 25 s, 19 s and
14 s as the salt increases"; the slide prints only 14 s (the saltiest drop) and then runs the coated board for 60 s, which
is shorter than DTU's own slowest short (62 s). So "None in a minute, coated" proves nothing for a less salty drop, and
"14 s" picks the extreme in Theseus's favour (G5). Fix: print "14 to 62 s, bare (DTU, by salt level)" (or the one level
that matches sweat's 10 to 90 mmol/L, if DTU's paper gives its concentrations), and run the coated clock well past the bare
range (5 or 10 min), saying what the coated result rests on (the film keeps the drop off the metal: a source if research
has one for coated boards under a powered drop, otherwise "drawn: the coat's job", not a measurement).
**R2-b10-2 (could):** "+0.2 g of coat ... 0.8 % of the mouse": a viewer who divides 0.2 by 29.31 gets 0.7 %. Print the
weight to the figure the % uses (+0.23 g) or take the % from the printed value.

**b10_twist.** Good bones: one loop against flipping half-loops is the right picture, the lay chart answers "how tight"
with the copper's cost on it, Klipec 1967 is a real measurement.
**R2-b10-3 (must): blue on the problem's side.** The noise source and its field rings are blue ("NOISE SOURCE" in blue), and
the side-by-side lead (most mice's way) glows blue where the current adds up (4.4 s and settle). Blue is Theseus only
(F35.1; the brief's error list). Draw the coil and its field in neutral ink, the current that adds up on the side-by-side
lead in red (the fault), the twisted pair's alternating halves in two neutral tones that visibly cancel, and keep blue for
the 6 mm marker and the verdict.
**R2-b10-4 (should): name the rival with a callback.** The previous slide's ribbon is exactly the side-by-side loop (its
traces run parallel the whole way). Say so: "A ribbon's traces run side by side: one long loop" as the first beat, and the
two slides become one argument (torn, then noisy) instead of two.
**R2-b10-5 (should): the title promises a quiet radio, the slide never shows the radio.** Say where the lead runs (past
plan 5's radio module, at the rear) and what the picked-up noise costs the player (the radio hears it as noise: range and
lost packets, which b09_second answers). One line and the module drawn at the lead's end are enough.
**R2-b10-6 (should): the headline is the ideal model's, the measurement is five times weaker.** "100 % → 2 %" is the
derived ideal twist; the one measurement shown (Klipec) is 5 to 6 times less, i.e. 17 to 20 %. Put "ideal twist, derived"
in the verdict's label, or headline the measured floor ("at least 5× less, measured") with the model's 2 % under it.
**R2-b10-7 (could):** the pointer is left parked at (1550, 885) in the settled frame; fade it once it lets go of the coil.
Frame one has no noise yet: start the coil beside the side-by-side lead at t = 0.

**b10_software.** Good: the problem is real and well chosen (lift to reset, the sensor keeps counting until it clears
lift-off), the slider moved by the pointer drives the drift number, "an illustration" is said, WebHID named.
**R2-b10-8 (must): text collision in all four frames.** "STILL TRACKING" (red) runs into "LENS AT REST, 2.4 MM OVER THE PAD"
(left panel, y ≈ 315 / 855): "STILL TRACKINGLENS AT REST". Move the lens label above the pad line or to the panel's other end.
**R2-b10-9 (should): the verdict compares against the rival's worse setting.** The PAW3395 offers 1 or 2 mm; on your own
model (drift = 1.5 × lift-off) its 1 mm gives 1.5 mm, so "3.0 → 1.2 mm" is against its 2 mm. Either compare at its best
(1.5 → 1.2 mm), or show why fine steps matter: the lowest lift-off that still tracks depends on the pad and on the lens's
working window (b04_focus's 0.2 mm), so a player whose pad needs a little over 1 mm is forced to 2 mm on a 1-or-2 sensor and
Theseus stops at 1.2. That also answers "why 0.8 and not 0.5?", which the slide raises (its slider goes to 0.5) and never
says. Note the research line: Razer's software has a 26-step cut-off, so don't let "1 or 2 mm" read as what every rival offers.
**R2-b10-10 (should): show the drift, don't only count it.** The left panel's mouse is a dashed rounded box with a tiny
icon; the drift is a number. Use mouseSimple('side') with the lens lit, and a crosshair on a small target that slides
3.0 mm-worth off it on each lift at 2 mm, and barely moves at Theseus's setting: the problem becomes something felt.
**R2-b10-11 (should):** "SAVED ON THE MOUSE" is a capsule outlined in its text's colour (F9.5 no capsules, F9.2): plain blue
label text.

**b10_pmic.** Good: a real problem (a voltage guess that jumps after a restart, reads low in the cold, dies early), the
A-level V = E − I·r practical as the classroom piece, Nordic's 20 % against 3 %, the six parts folding into one 5 × 5 mm chip.
**R2-b10-12 (should): the title names the part, the demonstration teaches the gauge.** A silent viewer of "One chip runs the
power" watches a battery-reading chart and a verdict on reading error; the title never says what they're learning (F2.44).
Title it by what the player gets ("A battery reading you can trust", or "One chip, a gauge that counts") and keep "one chip
for six parts" as the second beat.
**R2-b10-13 (could):** the yellow line is labelled "Voltage guess (G Pro X Superlight 2)", so everything on it reads as
the GPX 2's; only the restart jump is sourced (TechPowerUp). Put "illustration" on the red "dies mid-match" tag itself (the
foot line says it, the tag doesn't). "THE VOLTAGE UNDER LOAD THE A-LEVEL PRACTICAL" reads as one label: two lines. Frame one
is an empty chart: draw the dashed true-charge line from t = 0.

**b10_wires.** Good, keep it: the nick and Kt ≈ 11 at its tip (a correct 1 + 2√(a/ρ)), the ribbon tearing across, one braid
strand cut and the other two holding, "pulls: illustration", Shengyi's fold rating.
**R2-b10-14 (should):** "Most mice reach the side buttons with a ribbon" and "most mice's side-button lead" are unsourced
universals (BROADCAST-0930, FILM F20): name the mice whose teardowns show a ribbon, or say "many mice".
**R2-b10-15 (could):** "46.6×" is three figures from a value shown to one (0.3 N): "about 45×", or drop it (0.3 → 14.0
already says it). The blue glow behind both cables (the ribbon too) is blue used decoratively and a gradient outside type
(F8.1): make the light neutral. Callback worth one line: Kt ≈ 11 at the nick is b05_margin's paper nick ("the nick that
tears paper, from Shell").

## CRITIC (R), 2026-11-06 09:44 (machine clock), build 0912: b10_battery (first look); b10_lights re-check
**R-b10-3 still open in 0912** (b10_lights: "MECHANICAL SWITCH 0 %" twice and "23.5 % → 0.2 %", against b03's and b01's 0.4 %).

**b10_battery.** Good, keep it: his cells note answered with the right batteries ("1 g heavier, for 20 mAh less": a 10440 at
350 mAh and 9 g against the 370 mAh, 8 g pouch), a balance that tips the right way, the cut-open can (2.2 g of steel) against
the foil (0.4 g) as the cause, and numbers that check: 144 against 171 Wh/kg, +33 h at the same 8 g at the V4 Pro's draw;
"battery", never "cell". No findings.

## CRITIC (R), 2026-11-06 09:26 (machine clock), build 0903: b10_lights (first look)
Sheet /home/claude/work/r/sheets/b10_lights_0903.jpg (0, 0.6, 4.8, 12 s).

Good, keep it: the V4 Pro's lit parts glowing with their share of its battery, the same layout on Theseus with nothing
lit but the sensor, the dust test in the wheel's light gate (8 of 16 counted against 16 of 16, "an illustration"), the
clear top with the spring and magnet in sight (his note on sealed), the no-RGB line placed here as he asked (F30.20).

**R-b10-3 (must): Theseus's switches print "0 %", but b03_switch and b01_compromise print 0.4 % for the same two
switches.** Lines 1462-1463 hard-code '0 %'; b03 derives 3 µA a switch (B03.mechShare = 0.35 % for the pair, shown 0.4 %).
Here, per switch at your one decimal: 0.2 % each (0.18 rounded up, never in Theseus's favour), and the verdict's total
becomes 0.4 + 0.2 = 0.6 %, not 0.2 % (the +30 % hours barely moves). Read B03.mechShare as b01 now does, so the three
slides can't drift.
> B10 reply 12:20: FIXED. b10_lights reads B03.mechUA (3 µA a switch): each mechanical switch 0.2 % (0.18 rounded up), Theseus's total 0.6 % (two switches + TMR, rounded up), +29 % hours; the source line says the pull-up's 3 µA "as Clicks".
**R-b10-4 (should): "Logitech's G703 lasts 30 h with its lighting off, 22 h with RGB cycling" has no source entry** (only in
the text and the answer). Add the source or request it (I've put it in REQUESTS.md).
> B10 reply 12:20: FIXED with the research fill: Logitech's original G703 spec sheet, 32 h lights off against 24 h RGB cycling (new SRC b10G703); the old logiRgb (30/22 h) is no longer used.
**R-b10-5 (could):** the wheel's 5.8 % rests on an assumed LED timing ("40 µs every 2 ms at 5 mA (assumed)"); the verdict
then states 23.5 % to one decimal. Say "about 23 %" or carry "assumed" into the verdict's label.
> B10 reply 12:20: FIXED: the verdict's label reads "Battery to the switches and wheel (wheel current assumed)"; the research fill (no maker publishes it; ITR9707 tested at 20 mA) makes the 5 mA assumption conservative, said in PROGRESS.

## MODEL (M, model auditor), 2026-11-06 09:11: the battery per gram and the 10-minute charge

**M-b10-1 (OK, b10_battery):** reproduces: the 10440 Li-ion, 350 mAh at 9 g, 144 Wh/kg; the LP402535JU pouch, 370 mAh at
8 g, 171 Wh/kg; in the same 8 g, 175 h against 208 h at the V4 Pro's 1 khz draw. It answers Brock's "a gram or two"
honestly (1.5 to 2.6 g heavier at 370 mAh). Precision (should): the masses are 9 ± 1 g (akkuteile) and a whole-gram
listing (8 g), so 144 against 171 is really about 130 to 160 against 160 to 180 Wh/kg; round to two figures ("about 140
against 170") or show the ± so the 27 Wh/kg gap isn't read as exact.
> B10 reply 12:20: FIXED: verdict now "Energy for the weight, about" 140 → 170 Wh/kg (two figures), net "+30 h at 1 khz, same 8 g" (33 floored to two figures).
**M-b10-2 (should, b10_charge): one 8 khz draw for the film.** You use TechPowerUp's measured ~40 h (29.6 mW); b09_life uses
Razer's 45 h claim (26.3 mW). Agree with b09 on one and say which. The 10-minute arithmetic is plausible (1C for 10 min
stays in the constant-current phase from 20 %: about a sixth of the battery, 7.7 h at 8 khz on the measured draw).
> B10 reply 12:20: WHY NOT (for the integrator): I kept TechPowerUp's measured 40 h (a measurement beats Razer's 45 h claim). If the film settles on 45 h, b10_charge's figures become 4.1 → 8.7 h (the ratio, 2.0×, holds); it is one constant (B10.w8, from elc_cell's w8) and I can switch it on request.

## CRITIC (R), 2026-11-06 09:15 (machine clock), build 0855: b10_board, b10_cable (first look)
Sheets: /home/claude/work/r/sheets/b10_board_0855.jpg, b10_cable_0855.jpg (frames 0, 0.6, 40 %, settle). Reply under each
finding (FIXED / WHY NOT).

**b10_board.** Good, keep it: his "wish it was even better visualized" is answered with a real oven: the reflow profile
with its 217 °C line, two lanes under the same heaters, the rival named (Cougar Revenger Pro 4K), the Type-C hanging in
melted solder on the second pass, the water drop as the classroom version with 2πrγ = mg, the second-side rule sourced
(Liu, Geiger & Shangguan 2006) and the estimate called an estimate.
**R-b10-1 (should, b10_board): say what one pass gives the player.** "2 → 1 oven passes. Nothing hangs" is a factory
fact; the player's version is reliability: every joint heated once, nothing that slid or was glued in place, one 5.6 g
board. One line under the verdict (G7).
> B10 reply 12:20: FIXED in the caption the settle frame holds: "Theseus puts every part on one face: one pass, every joint melted once, and nothing ever hangs." (no room under the verdict without crowding the source line).

**b10_cable.** Good, keep it: the strongest "what if you miss" in the chapter, and a fair one: the straight plug's stiff
cable lifts the tail during the flick, the sensor passes lift-off (the gauge, 1 mm) and the cursor freezes; the same flick
with the angled plug and paracord arcs clear. The paracord is drawn properly now (woven sheath, tracer, four conductors in
section), and the foot line is honest ("for illustration, diameters unmeasured").
**R-b10-2 (should, b10_cable): the close-up shows Theseus's paracord during the rival's turn.** 0 to ~4 s, "MOST MICE
STRAIGHT PLUG" on the left while "THE CABLE, CLOSE UP" on the right is the blue-tracer paracord. A viewer reads it as the
rival's cable. Bring the close-up in with Theseus's half (or show the stock cable's section first, then the paracord's).
> B10 reply 12:20: FIXED: the close-up panel now comes in with Theseus's half (3.8 to 4.3 s, after the wipe), titled "Theseus's cable, close up".

- 09:03 RESEARCH: b10-1 (part) V4 Pro cable 1.8 m fabric-sheathed, called stiff, no diameter published anywhere; b10-2 Synapse 4: Razer publishes no disk space (Windows 10/11 64-bit only), see research/FILLS.md
- 09:05 RESEARCH: b10-9 (part) GPX2 has Low/Medium/High LOD (Low and Medium don't track at 1.2 mm, TechPowerUp), default not stated; PMW3360 default nominal + 2 mm, see research/FILLS.md
- 09:08 RESEARCH: b10-3: no maker publishes wheel-encoder current; Everlight ITR9707 (a mouse interrupter) is rated 50 mA max, tested at 20 mA; say if the 5 mA is pulsed or continuous; b10-6: USB4105-GF-A is top-mount, not mid-mount, no mass listed, see research/FILLS.md
- 09:10 RESEARCH: b10-4 magnet through card filled (Oak National Academy Year 3, Blocking magnetic force) and b10-5 filled (AQA A-level required practical EMF and internal resistance, V = E - Ir), see research/FILLS.md
- 09:13 RESEARCH: R b10_lights G703: MUST CHANGE, '30 h off / 22 h RGB' matches neither Logitech figure; original G703: 32 h lights off vs 24 h RGB cycling (spec sheet); G703 HERO: 60 h no lighting vs 35 h default, see research/FILLS.md
- 09:15 RESEARCH: b10-2 G HUB: Logitech gives only an old installer's 40.2 MB, no install size; keep 'no size claimed', see research/FILLS.md
- 09:17 RESEARCH: b10-1 cable diameters: not published by TechPowerUp or makers (lengths only: V2/V3/V4 Pro 1.8 m, ULX 1.7 m); keep the 3 mm said as an illustration, see research/FILLS.md
- 09:18 RESEARCH: b10-7 PTFE-on-cloth static friction not found (queries in FILLS), see research/FILLS.md
- 09:19 RESEARCH: b10-9 (rest) Razer default LOD not published (26-step cut-off, no default); keep 1 mm as the deck's choice, see research/FILLS.md
- 09:26 RESEARCH: b10-8 cable stiffness not found (retailer guides only); b10-7 third try, still no coefficient, see research/FILLS.md

## KIT (K, shared code), 2026-11-06 09:58: mouseRival has landed (FILM F9; POLISH.md b10 item)
`mouseRival(view, o)` / `rivalFit` / `rvBox` / `rvAt` are in the snapshot (KIT.md §3 "The rival mouse"), same frames as
mouseSimple. **Must (P1, polish):**
- `b10_lights`: the Viper V4 Pro is a rival: `const m = rivalFit([80, 300, 420, 560], 'top', { dims: V4_PRO_DIMS, show: ['sensor', 'board', 'switches'] })`
  and the lights at `m.at('switchL')`, `m.at('switchR')`, `m.at('wheel')`, `m.at('sensor')` (the same names as before,
  `trigL` / `trigR` still answer). If the slide's second beat ("only Theseus's sensor lights up") is meant to show Theseus,
  hand over from the rival to `mouseFit(..., 'top', ...)` with the kit's `wipeTo` (or a cross-fade) rather than dimming the
  rival's lights on Theseus's outline.
- `b10_cable`: the rival's scene: `mouseRival('right', { dims, show: ['sensor'] })`, its port at `rvAt('right', 'cable', { dims })`
  (in place of `C0.zp`, `C0.hP` for the rival only), its rear skate for the pitch at `rvAt('right', 'skateR', { dims })`.
  Theseus's scene keeps mouseSimple.
- (Your call) b10's lift-off slide draws one mouse at two settings: if the 2.0 mm one is "a rival's default", draw it with
  mouseRival; if it is Theseus's own setting changed in its software, keep mouseSimple.
- 10:18 RESEARCH: b10_software default LOD: Pulsar ships 1 mm (Pulsar X3 factory setting, via a Linux tool's release notes; 0.7/1/2 mm wired, 1/2 mm on the dongle), so compare the PAW3395 rival at 1 mm (1.5 -> 1.2 mm on the slide's model) or say who needs 2 mm; Logitech (Low/Medium/High per DPI slot) and Razer (Smart Tracking auto-calibrates; 26-level cut-off) publish no default in mm; b10_cable: still no stock cable diameter published anywhere (Pulsar, Glorious, Razer, Tom's Hardware give lengths only), keep 3 mm as an illustration, see research/FILLS.md
