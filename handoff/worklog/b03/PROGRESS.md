# B03 progress (Clicks II: the switch and the signal)

File: deck/src/30-b03-switch.js. Build: `cd /home/claude/theseus/deck && python3 tools/build.py main --out=b03 --own=30-b03-switch.js`
(add `,06-motion.js` to --own until the integrator snapshots the kit). Checks: `export NODE_PATH=/opt/npm-tools/node_modules; Q='&2d=1'`.
Slides (film order): b03_switch, b03_binning, b03_spdt, b03_timing, b03_debounce, b03_hotswap, b03_side.
Before: b02_pom (b02, POM pads set the tolerance). After: b04_card (b04, glide chapter card).

## Status (09:5x): all seven slides built and checked; CHECKPOINT1.md written; review/b03.md answered (19 replies)
- [x] b03_switch, b03_binning, b03_spdt, b03_timing, b03_debounce, b03_hotswap, b03_side: errs.js ok at 9–11 times each;
      qa.js clean at settle and mid for all seven; desktop and phone views checked. Final frames (re-shot after H1's
      GT01 walls and the new pcbSec, 09:30): /home/claude/work/b03/shots/final/ (frame one, mid, settle per slide) and
      the settle sheet /home/claude/work/b03/shots/final_phone_settles.png.
- [x] Film order in the file: switch, binning, spdt, timing, debounce, hotswap, side. No provisional slides left.
- [x] Critic R-b03-1..12 and auditor M-b03-1..4 + the board convention: replied in review/b03.md (all FIXED but R-b03-8,
      a could, answered WHY NOT). FILM F3 (gf, one verdict form), F18 (no "2×"), F20 (no "most mice" without a count) done.
- [x] BROADCAST-0945 applied (13.6 % / +15 %, the MVP's side switches, "many mice"); research fills applied (OpenStax
      torque source, Endgame Gear's bands, Logitech's hours, D2LS-21 force). Final checks: errs ok, qa clean settle and mid.
- [ ] Report via SubagentHandback (next).

## Build order and why
b03_side first: `sidebuttons` is on F33.5's list of his important-but-badly-executed ideas (most care). Then b03_switch
(F31.1 decided, a strong battery sell), b03_timing ("i like that it sells something"), b03_spdt, b03_debounce,
b03_hotswap, b03_binning.

## Themes (alternate): switch paper, binning night, spdt paper, timing night, debounce paper, hotswap night, side paper.

## Sources gathered (key → what)
- omronD2fp datasheet (chipdip mirror, verified 2026-11-06): D2FP-FN2 0.59 ± 0.15 N; LED test IF = 5 mA, pulse 30 µs ON /
  970 µs OFF (avg 0.15 mA); 4 terminals + a dummy (5 pins); 0.54 g; 70 M operations.
- Logitech support, "What is the difference between Hybrid and optical-only mode of the LIGHTFORCE switch?": optical-only
  "runs the IR LED and optical sensor full time, and can reduce battery life"; hybrid "uses the galvanic contact to turn on
  the IR LED ... saving power" (a maker's own admission). https://support.logi.com/hc/en-us/articles/16237236344727
- Razer Viper V4 Pro page: optical Gen-4 mains, "no debounce delay", optical wheel "3.3× more reliable", MECHANICAL side
  buttons 0.33 ms vs "Brand X" 1.65 ms, "up to 180 hours" (clk_razerV4bat: 180 h at 1 khz, Razer blog); 306 mAh (Vortex).
  Razer staff "almost half": no public source (searched Razer pages, Insider, reviews) → claim via Brock (F31.1).
- mice.json (EloShapes): 16 of 35 tracked flagships ship optical mains, 3 more are Logitech hybrids (19 of 35 shine a light).
- Ganssle, "A Guide to Debouncing" (2004, rev. 2008; hosted by Univ. of Utah CS 5780 and UW CSE 466 courses): 16 switches
  averaged 1,557 µs bounce, max 6,200 µs; SPDT + SR latch: the contact "may bounce around a bit, but will never bang all the
  way back to the other contact". https://my.eng.utah.edu/~cs5780/debouncing.pdf
- Tom's Hardware, Sauvageau, "Hacking Your Mouse To Fix The Misclick Of Doom" (2016-03-20): new switch NC→NO travel ≥ 840
  µs, bounce ~500–800 µs on NO; worn switch NC break > 10 ms, travel > 5 ms; "Not all mice use SPDT switches", the SPDT mice
  he saw used them as single throw; settle-wait debounce adds ≥ 4 ms at 1 khz sampling. (deck keys tomsBounce, tomsDebounce)
- XBAB 2026 (latency.json): NC release still XA25 72.04 µs [68.6, 75.48] n 500; OP1 8k v2 320.29; moving OP1 +121–125 µs;
  NC edge precedes NO by ~1.5 ms. TechPowerUp OP1: GX Speed ~1.4 ms faster. F18.5: Theseus 70 µs target.
- TechPowerUp Lamzu Atlantis: 2.4 ms at 0 ms debounce, 5.4 ms at 4 ms (+3.0 ms). TechPowerUp G-Wolves Hati-S Plus 4K:
  lowest setting = eager debounce (no added latency), higher = defer-type (adds latency).
- Fnatic help, "How To Change Click Debounce": 0–20 ms; "Lower debounce settings may result in the occurrence of double clicks
  or slam clicking"; recommends 4 ms or higher; 0 ms for highly competitive play.
- Razer Insider (user, 2022-05-12) "ADD ADJUSTABLE DEBOUNCE FOR THE RAZER VIPER V2 PRO": plays Minecraft, wants double
  clicks; "FPS and Minecrafter's could BOTH be good with it". Red Lotus guide (Minecraft screensharing): low debounce lets
  drag/butterfly-click vibrations register as separate clicks. Glorious blog: higher debounce makes high CPS harder.
- Brock's doc: #14 claw springs (Mill-Max 3305, unpatentable, covers pins, encoders too; 0.11 g each, 98 % Cu 2 % Be gold);
  #64 Hyperlight side buttons supported by the switch (stop); #78 mechanical: "much more power efficient than optical
  microswitches because they don't have a laser that is always on"; #79 "negative latency via SPDT" (G-Wolves, EGG);
  #80 dual rail side buttons "sliding rails instead of a bending mechanism" ("like a Gateron Dual Rail switch");
  brainstorm: "omron opticals being 10gf weaker at 60gf is quite noticeable"; "using mechanical spdt switches lets you ...
  [set] the debounce timer ... to zero, likely making minecraft kids very happy"; transparent switches show faults.
- Mill-Max 3305 (mill-max.com + 3D asset 3d/parts/millmax3305.js from Mill-Max's hot-swap sheet): leads 0.635–0.940 mm;
  hole 1.575; flange Ø 1.956, body Ø 1.473, length 2.667 (-0), 0.254 above board; 6-finger BeCu C17200 contact, 30 µin Au;
  1,000 cycles min; 10 mΩ max. GT01 pin (3D): 0.6 × 0.4 mm tip, 0.9 wide above a shoulder.
- iFixit, Kevin Purdy, 2022-02-16, "More PC Gaming Mice Should Follow ROG's Repairable Switches": switches wear → single
  clicks become double clicks; a swap "usually involves de-soldering around a dozen contact points"; ROG push-fit sockets.
- Endgame Gear OP1 8k v2 page: Kailh GX SPDT, "hot-swappable main button switches", "<70 µs" (XLAT, 10,000 clicks),
  GX Speed ~1.4 ms lower. TechRadar (trOp1): its swap terminal "hard to remove and easy to insert backwards".
- TechPowerUp Hitscan Hyperlight: side buttons "2-pin low-profile switches from TTC" on their own PCB screwed to the top
  shell, joined by a ribbon cable; pre/post-travel low. Brock's photos: Lamzu-type one-piece moulded side-button rail.
- Gateron dual-rail (keyboard) page: "reinforced stem-guided rail structure"; keyboard switch 45 ± 15 gf.
- Kailh GM8.0 (MechKeys): 65 ± 10 gf (or 60 ± 5 upgraded). Gateron GT01 (MechKeys 2024-10-08): 55 ± 5 g, 0.35 ± 0.10 mm,
  100 M, "Zero Preload". Omron D2F-01F 0.74 N max (omronD2f).
- Pang, Tan & Durlach 1991, Perception & Psychophysics 49:531–540: force JND ≈ 7 % of the reference (2.5–10 N squeezes).
- NVIDIA (Spjut, Boudaoud, Kim 2021, CHI EHPHCI): 20 → 12 ms latency cut median aim completion by 182 ms (context only).
- 3D shell (3d/shell/shell.js): side switches = the GT01's switch without the wedge; guide on the switch top (walls ±2.31,
  POM pads ±1.56, end bars ±1.8), glove cap 6×6, post 2.4; side buttons sideFront Z 8.93..23.48, sideRear Z -9.78..5.08.
  pcb-layout: SW1/SW2 GT01 at layout x ±16.0, z 39.6 (mouse z 36.7), "in 3× Mill-Max 3305".

## Storyboards (times in s; M6: hook ≤1 s, fix 5–7, payoff ≤8, settle held)

### b03_switch — A mechanical switch, for the battery (paper, settle 11)
Problem: an optical switch is a light gate: to catch a press its IR LED must flash all day (Omron D2FP datasheet: 5 mA,
30 µs of every 1 ms = 0.15 mA a switch). Rival named: Razer Viper V4 Pro (two optical mains + an optical wheel); 19 of 35
flagships shine a light (mice.json). Logitech's own page: optical-only "can reduce battery life".
Classroom: the light gate (photogate) from the school physics lab: lit all the time, waiting for something to cut its beam.
Beats: 0 mouse side view, trigger + switch lit, header; 0.3–1.6 establish → push in to the switch under the left trigger;
~1.0 the switch there is OPTICAL (cut open): LED flashes, a current trace below ticks in 5 mA pulses even at rest, a
battery gauge in the corner sipping; ~3.5 wipe in place to the GT01-style mechanical switch (clk_gt01MM, clear cover):
the pole on NC, no light, the trace flat; the same finger presses both (pressCurve): the optical's trace keeps pulsing,
the mechanical's stays flat; ~6 the two battery bars side by side (Viper V4 Pro at 1 khz: 1.70 mA; its two switches 0.30
mA = 18 %); ~7.5 verdict "Battery share of the main switches (lower is better) 18 % → <1 %", net "+21 % battery life,
same battery" (306 mAh / 180 h → 218 h); beside it, quieter: "Razer staff: switches and wheel take almost half the battery
(claim, via Brock) → up to 2×"; a line pointing to the magnetic wheel ("Nothing lights up but the sensor").
Headline: +21 % (derived). Every clause of clk_switch: see answers below.
Hand-off in: b02_pom ends on the trigger's post and pads → "Under the post: the switch". Out: the GT01 → binning (a row of
GT01-style switches).

### b03_binning — Provable switch binning (night, settle 11)
Problem: a datasheet's band lets two "identical" switches differ: Omron D2FP 60.2 ± 15.3 gf → your two buttons up to 30.6
gf apart; Brock: "10gf weaker at 60gf is quite noticeable". "Binned" on a box with no bin width and no data cannot be
checked (not naming a company: no public proof of a lie; say "claims you can't check").
Classroom: Weber's law, the just-noticeable difference (lifted-weights demo): a finger notices about 7 % (Pang, Tan &
Durlach 1991).
Beats: 0 header + a tray of GT01-style switches and a force axis; ~0.8 the tester (proposal) presses each: a probe on a
load cell, a Hall-effect sensor tracking the plunger: force-travel curve, the click point dot drops onto the axis; dots
pile into a spread (illustrative lot, labelled) inside the datasheet band (grey); a "Binned?" bracket with no edges (the
rival's claim); ~4.5 Theseus's bin closes in: ±2 gf (proposal: within 7 % at 55 gf), dots outside slide off to a reject
tray; ~6.5 two dots picked as a pair: left 55.4, right 54.1 gf: "your two buttons"; ~7.5 verdict "Worst gap between your
two buttons (lower is better) 30.6 → 4 gf", label "under the 7 % a finger can feel"; "GT01-style" everywhere; "Proposal"
on the tester and the bin; "Provable: the bin and its test published" (proposal).
Hand-off in: the GT01 from b03_switch. Out: one switch from the bin, push into its contacts (spdt).

### b03_spdt — Single pole, double throw (paper, settle 10)
Problem: a single-throw read (NO only; Tom's: the SPDT mice he saw were wired as single throw) sees every bounce as a new
click unless it waits.
Classroom: the knife switch from the school physics lab: one blade (the pole), two jaws (the throws). Ganssle 2004 (used in
Utah CS 5780 / UW CSE 466): the contact "will never bang all the way back to the other contact".
Beats: 0 the words SINGLE POLE, DOUBLE THROW huge (F9.4) with a knife switch under them; 0.6 the pointer throws the blade
from the top jaw to the bottom: "POLE: one blade", "THROW: two places it lands"; ~2.4 match cut / push in to the GT01's
contacts (clk_gt01MM contact region): NC above, NO below, 0.3 mm apart ("three hairs"); ~3.5 one press slowed down: the
pole leaves NC, lands on NO, bounces three times (decaying, never reaching NC); two counters: "Single throw: reads NO"
counts 1, 2, 3 (red: a triple click from one press) vs "Double throw: reads both" counts 1; ~7 the gap marked: "a bounce
never crosses back to NC"; ~8 verdict "Clicks counted from one press (no wait) 3 → 1".
Hand-off in: from the binning bin, one switch. Out: the pole on NO with "counted" → timing (when it counts).

### b03_timing — Negative latency: counted before the switch closes (night, settle 11) (was "Counted at first contact")
Problem: a single-throw mouse can't count until the pole lands on NO and then waits out the bounce (defer debounce):
TechPowerUp: a 4 ms setting cost the Lamzu Atlantis 3.0 ms; some mice also queue the click behind motion (XBAB: OP1 8k v2
+0.12 ms moving).
Classroom: the photo finish (one shared clock, who crosses first) — the timeline itself.
Beats: 0 header + a finger over a button and a shared clock (0 to 5 ms) with three lanes; ~0.5 the press: the pole
leaves NC (t = 0); lane THESEUS lights at once (+0.07 ms: NC release); the pole flies 1.5 ms (XBAB ≈1.5 ms; Tom's ≥0.84
ms) and lands: lane "SPDT read at NO" lights at +1.5; it bounces; lane "Single throw + 4 ms wait" lights at +4.5 (1.5 +
TPU's +3.0); ~5 shotInset: a flick still turning at 300 °/s (labelled example): the click counted at +0.07 lands on
target (HIT), at +4.5 ms it lands 1.3° off (MISS); ~7.5 verdict (F18.5) "Click latency against the XA25 (lower is
better) 72 → 70 µs", gain line "counted 1.5 ms before the switch even closes", one quiet method line: "Electrical
latency, NC edge to USB, Beagle USB 480: XBAB 2026, n 500; Theseus: target, moving or still"; "never waits for motion".
Hand-off in: the pole on NO from spdt. Out: the bounce after NO → debounce window.

### b03_debounce — Debounce: low, and yours to set (paper, settle 11)
Problem: on a single-throw read, one fixed window can't suit everyone (Fnatic: lower → double clicks or slam clicks; ≥4 ms
recommended; TechPowerUp: 4 ms costs +3.0 ms); optical switches (Razer) can't double click at all, and a Minecraft player
asks Razer for adjustable debounce: "FPS and Minecrafter's could BOTH be good with it" (Razer Insider 2022).
Beats: 0 header + one chattery press (a drag click: a finger dragging over the button, the contact chattering) feeding two
lanes; ~1 lane A "long window 10 ms": 1 click; lane B "short window 1 ms": the re-closures count: 2 (a double click);
~3.5 the pointer drags a window slider from 10 → 0 ms: the count goes 1 → 2 → 3 (more double clicks, for drag clicking);
~6 the default: SPDT (no window at all): 1 click, 0 ms wait; the setting panel: "Click mode: Double throw (default)
| Single throw, window 0 to 20 ms (proposal)"; ~7.5 verdict "Default wait (lower is better) 4 → 0 ms"; payoff line "FPS:
no wait, no doubles. Drag clicking: doubles on. One mouse." Point to the web software slide (b10_software).
Hand-off in: the bounce from timing. Out: "a worn switch bounces longer" (Tom's) → hot-swap's double click.

### b03_hotswap — Hot-swap switches, no solder (night, settle 11) (was "Swap a switch in a minute")
Problem first: a worn switch double clicks (iFixit 2022; Tom's: a worn switch's contact takes > 10 ms to break); in most
mice the switch is soldered: a swap means desoldering (iFixit: "around a dozen contact points") → most mice end there.
Beats: 0 header + mouseSimple top, left trigger lit, a click counter: one press → "2 clicks" (red) — the hook; ~1.5 the
board's switch soldered (three joints): "a soldering iron, or the bin"; ~3 Theseus: the board from below (b11 callback),
the pointer pulls the worn switch out of its three claw sockets and pushes a new one in; ~4.5 push in to one pin entering
one Mill-Max 3305 socket, cut open, huge: six BeCu fingers (two in section) spread and grip, gold; ~7 counter back to "1
click"; ~8 verdict "Solder joints to change a switch (lower is better) 3 → 0"; tiles "1,000 swaps a socket, at least
(Mill-Max)" and "a switch a week for 19 years (derived)"; quiet line: ROG and Endgame Gear already swap switches; claw
sockets take any 3-pin switch (0.635–0.940 mm legs) and cover the pins.
Hand-off in: worn switch double clicking (debounce). Out: "the side buttons get the same full-size switch" → b03_side.

### b03_side — Dual rail side buttons (paper, settle 12) — CHECKPOINT SLIDE
Problem (rival accurate, his note): the shipping side button is one moulded part on a hinge (Brock's photos: the Lamzu-
type blue rail), its nub pressing a 2-pin mini switch (single throw) on its own side board joined by a ribbon cable
(TechPowerUp, Hyperlight teardown). On a hinge it is a lever: the force to click changes with where the thumb lands, and
pressed at its tip it bends past the click.
Classroom: the door: push near the hinges and it takes far more force than at the handle (torque = force × distance).
Beats: 0 header + mouseSimple top view, side buttons lit; 0.3–1.4 establish → push in to the front side button, the wall
cut at button height (top section); ~1.5 split: left MOST MICE (hinge, rival grey/yellow), right THESEUS (rail), same
scale, same three thumb spots; ~1.8–4.6 the thumb presses spot 1 (near the hinge), 2 (middle), 3 (tip) on both at once:
hinge readout 165 / 68 / 38 gf and at the tip it bends past the click (red); rail 55 / 55 / 55 gf, landing on the stop each
time; ~5 labels on the rail: "the main buttons' post, on POM pads", "full-size SPDT switch", "held by the shell: no side
board"; ~5.5 small chart "force to click along the button" (hinge curve vs flat rail, "flatter is better"); ~7.5
verdict "Force to click, end to end (lower is better) 4.3× → 1×"; tiles "0 mice ship SPDT side buttons" (F11.4) and
"29.31 g with four full-size switches" (F9.17); final frame pulls out to the whole mouse (hand-off to glide).
Lever model (labelled illustration): button 14.5 mm, hinge at one end, nub 9 mm out, the same 55 gf switch on both.
FEEDBACK: F2.07, F9.16, F9.17, F11.4, F12.4, F17.3, F31.4 (show the guide clearly; ask him), F33.5.
Note: one short post can tip when pressed at a button's end (a 1u key on one stem is fine; long keys need stabilisers):
draw the post deeply engaged in its guide; question for Brock on engagement and pad faces.

## Brock's clauses → answers (draft; final wording lives in each slide's `answers`)
clk_switch: (1) "bottom housing doesn't look very accurate at all, i'll attach a new reference" → drawn by the shared
clk_gt01MM traced from the Gateron render he sent (F28.1), with H1's thicker, straight walls (F30.18, F30.24) landing in it;
(2) "show the effect on battery life" → the slide is that demonstration: LED current vs none, battery share, +21 %;
(3) "razer says ... almost half ... (find quote)" → searched again: no public quote; on screen as Razer staff's claim via
Brock (F31.1), beside Logitech's own page saying optical-only mode "can reduce battery life"; (4) "switch to a hall
effect / magnetic encoder" → done deck-wide; this slide points to "Nothing lights up but the sensor"; (5) "double the
battery life efficiency as razer" → "up to 2×, if Razer staff's figure holds", beside the +21 % derived for two switches.
clk_switch2: "largely irrelevant" → force/life chart gone; "we don't even know if ... gt01 ... or just their style" →
"GT01-style" everywhere, Theseus's own bin not Gateron's claim; "group it in with better binning practices" → it is the
binning slide; "a lot of companies lie about their binning" → shown as claims nobody can check (no company named without
proof); "commit to provable bins" → measured, published bin; "(potentially using hall effect tech)" → the tester, a proposal.
clk_spdt: "difficult to understand" → knife switch + a click counter under bounce + SPDT spelled out (F9.4).
latency: "difficult to understand" → one press, one clock, three lanes; "i like that it sells something" → still sells:
counted first, the shot leaves when the finger says; "hard to tell what is changing" → only the press moves, each lane
lights at its moment.
clk_wait: "hard to understand" → a one-line note on the same timeline; "combined somewhere else" → merged here.
clk_methods: "combined somewhere else or removed" → the methods chart removed; one quiet method line under the verdict.
clk_debounce: "weak slide" → demonstration; "minecraft kids want to adjust ... more double clicks" → single-throw mode with
a window from 0 ms; "not sure how ... sold" → sold as low by default, yours to set; "low debounce is good ... to most
people" → default SPDT, 0 ms, no doubles; "a sub group ... dislike it" → they set a longer window.
clk_hotswap: "demonstration is plain" → wear, pull, push, back to one click; "hard to see the claw clips" → one socket cut
open, huge, from the 3D asset's datasheet numbers; "no argument as to why this is important" → the worn switch's double
click and the soldering iron first.
sidebuttons: "left visualization feels lazy" → the rival drawn as shipped (moulded rail on a hinge, 2-pin mini switch on a
side board and ribbon cable) and demonstrated (lever force, bending past the click); "right ... doesn't match the other dual
rail plungers with ptfe" → the main buttons' post and POM pads (POM everywhere, F31.3), same width and pads; "way
overbuilt" → a guide over the switch, one post, two pads, the stop: nothing else; "important information ... gets the point
across okay" → the facts kept (0 mice SPDT, 29.31 g, held by the shell); "it just feels lazy" → a full demonstration.

## Questions for Brock (multiple choice, collect for the report)
- Side-button guide (F31.4): pads on the post's front/back faces (hold it square against a thumb at either end) | across
  (as K1's 3D) | all four.
- NC release can count a slam (mouse dropped) as a click: offer a "safe" mode (count at NO) in the software | no.
- Binning width to commit to: ±2 gf (within a finger's 7 %) | ±3 gf | ±5 gf.
- Debounce range in the software: 0–20 ms like Fnatic | 0–10 ms | 0–8 ms.
- Title "Negative latency" for the timing slide: keep | "Counted before the switch closes" | "Counted at first contact".
- Weight budget (b01) should list the two side switches explicitly (not visible in NTR_BUD today).

## Models and conventions checked (08:45 rule: what, where, the check, the verdict)
- Side-button lever (b03_side, mine, new): F_thumb = F_switch × a / s about the hinge (a = 9 mm nub, s the thumb's spot).
  Units gf × mm / mm = gf; ×9.80665e-3 → N. Rigid button; the living hinge's own stiffness ignored (it adds kθ/s, larger
  near the hinge: ignoring it understates the rival's spread); the rail's pad friction not modelled (said on the slide).
  Same 55 gf switch on both (said on the slide; a gap is listed for the real 2-pin switch force). Verdict: sound, labelled.
- Rounding (b03_side): the hinge's forces were rounded half up (1.618 → 1.62, 0.6696 → 0.67), which overstated a rival's
  fault in our favour. Now floored as printed (1.61 / 0.66 / 0.37 N) and the spread taken from the printed values
  (1.61 − 0.37 = 1.24 = floor of the true 1.245). Theseus's 0.539 N prints 0.54 (its own force, as SCALE.click).
- "0 mice ship SPDT side buttons" (b03_side): FEEDBACK F11.4 DECIDED ("I've checked, state it"): Brock's own check; no
  tag (his figures carry none). Razer's V4 Pro page sells "Mechanical Side Buttons" at 0.33 ms but says nothing of SPDT.
- "29.31 g with four full-size SPDT switches" (b03_side): F9.17 (Brock). THESEUS.mass 29.31 g (05-data.js); the budget
  slide (NTR_BUD, 14-b-intro-ex.js) carries "One board 5.6 g" and the XA25's buttons, and lists the side lead but not the
  switches by name: I can't confirm from the code that four full-size switches are inside the 5.6 g. Kept as Brock
  decided; flagged to the integrator / b01 to list the switches in the budget.
- Battery model (b03_switch; the old clk_switch's, and b10's B10.lights uses the same): Omron D2FP-FN2 datasheet LED test
  drive 5 mA × 30 µs per 1 ms = 0.15 mA a switch (units ✓); Viper V4 Pro 306 mAh (Vortex) / 180 h (Razer, 1 khz) = 1.70
  mA (✓); two switches 0.30 mA = 17.647 %. Assumption: Razer drives its LED as Omron's test does (unverified; Razer staff's
  "almost half" says it may be more): labelled "Derived". The old slide said "+21 %": that left out the mechanical
  switch's read current. With a strobed pull-up, about 3 µA a switch (a design assumption: a static pull-up through the
  closed NC contact would draw ~0.23 mA at 13 kΩ, worse than the optical, so the read must be strobed or high-value),
  life = 306 / (1.70 − 0.30 + 0.006) = 217.6 h, +20.9 % → "+20 %" (floored). Share printed 17.6 % (floored) → 0.4 %
  (0.35 rounded up: our own cost never rounded down). Verdict: sound with the read current; "18 %" and "+21 %" retired.
- "16 of 35 flagships click with light" (b03_switch): research/data/mice.json (EloShapes): 16 optical mains + 3 Logitech
  LIGHTFORCE hybrids of 35. The hybrids' default mode turns the LED on only after the galvanic contact (Logitech's page),
  so "its LED never rests" is true of the 16, not the 19 (critic R-b03-7): the caption counts 16. ✓
- Rail friction (b03_side, critic R-b03-2): an off-centre press tilts the post; F = S / (1 − 2μ·e/Lg). At the tip
  (e = 5.75 mm), μ 0.2: Lg 14 → ×1.2, 5 → ×1.85, 3 → ×4.3, 2 → jams. μ (POM on POM) and the guide's engagement depth are
  unknown: the verdict says "friction aside" and Brock gets the design question.
- Razer staff "almost half" → "up to 2×" (b03_switch): 1 / (1 − f) < 2 for f < ½: "up to" holds on their figure; shown
  as their claim via Brock (F31.1). It assumes Theseus's replacements draw ~nothing: the switches 0.006 mA (above), the
  magnetic wheel 0.003 mA (b10's TMR, MDT 1.5 µA per axis). ✓ consistent with b10.
- GT01 drawing (clk_gt01MM, H1's): reused as the shared drawing; H1's wall fix (one 0.70 mm wall) lands when H1 lands it.
- The kit's side view (b03_switch): the left trigger's switch put 36.7 mm ahead of the sensor (the 3D board's SW1, mouse z
  36.7) and on the kit's board top (y = −5.05). Approximate to ±0.5 mm after the 08:40 rescale to the scan's proportions.

- Logitech's own figures (FILLS, TechPowerUp GPX2): 96 h optical-only vs 104 h hybrid at 1 khz, 290 mAh → 0.116 mA a
  switch, 13.67 % of the V4 Pro's 1.70 mA. BROADCAST-0945 decision 1: the film claims this lower one, printed 13.6 %;
  Omron's pulse (17.6 %) shown beside it as the upper derivation. Life: 306 / (1.70 − 0.232 + 0.006) = 207.6 h, +15.4 %,
  printed +15 % (was +20 %). b01's B01_TRADES and b10 follow the same decision (theirs to change).
- "0 mice ship SPDT side buttons" (F11.4) is wrong (FILLS Q1: TechPowerUp, the Gamesense MVP's side buttons are Kailh GM
  4.0s, full-size, on a side board): replaced by Theseus's own fact, 0 side boards, and the MVP named in the foot line.
  The 2-pin side switch's force: Omron D2LS-21 61 ± 20 gf (datasheet), so 55 gf on both sides of the comparison is inside it.
- Side-button spread in gf (FILM F3): tip spot moved 13.0 → 12.375 mm so the lever gives a whole 40 gf; readings 165 /
  68 / 40 gf (68.28 floored), spread 125 gf exact; Theseus 55 gf everywhere, "friction aside".
- Bin ±1.5 gf (auditor M-b03-4): worst gap 3.0 gf = 5.5 % of 55, under the 7 % JND; ±2 would be 4 gf = 7.3 %, over.
  The JND is Pang 1991's for 2.5 to 10 N squeezes; said "on firmer squeezes" and taken as the same at 0.54 N.
- Timing rival (auditor M-b03-3): "single throw at a 4 ms debounce" = TechPowerUp's defer-type 4 ms on the Lamzu Atlantis
  (+3.0 ms); an eager single-throw read counts at NO, 1.4 ms after Theseus. 300 °/s (the shot) is FILLS' derived *peak*
  for a fast target switch (0.26 m/s at 30 cm/360°), labelled "an example".
- The pole's flight (b03_spdt, b03_timing): drawn with clk_gt01MM, its CLK_G1.gap scaled for the one call and restored
  (b03_gt01Pole): no redraw of the shared part. Ask H1 for a continuous o.pole.

## Research gaps
Search budget used up 2026-11-06 ~08:30; the central research agents fill these into /home/claude/work/research/FILLS.md.
Each line: the slide it feeds, the query or URL to run.
- b03_timing: a sourced crosshair angular speed at the moment a flick shot is clicked (the shot inset uses a labelled
  example, 300 °/s). Query: "flick shot crosshair angular velocity at click deg/s FPS aim study". URL to fetch if known:
  https://arxiv.org/abs/2203.12050 (NVIDIA, "Mouse Sensitivity Effects in First-Person Targeting Tasks").
- b03_side: a teaching source for the door / torque demonstration (OpenStax University Physics vol. 1, 10.6 Torque, the
  door pushed near its hinges). Query: "OpenStax University Physics torque door hinge example". Until then demoPanel src
  reads "Torque = F × d".
- b03_side: a 2-pin low-profile side switch's operating force, to replace the assumption that the hinged button's switch is
  the same 55 gf as the rail's. Query: "TTC 2-pin low profile side switch operating force datasheet"; "Omron D2LS-21
  operating force"; "Kailh side micro switch 2 pin gf".
- b03_spdt: a teaching source for the SPDT knife switch in school physics labs (optional). Query: "SPDT knife switch school
  physics lab double throw".
- b03_binning: (a) a public example of a mouse maker claiming "binned" or "tested" switches without publishing the spread
  (the slide says "claims you can't check" and names no one). Query: "mouse \"binned switches\" force tested". (b) RTINGS'
  measured click forces per mouse: https://www.rtings.com/mouse/learn/research/tactile-force (renders client-side; needs a
  browser or their data table). (c) Any published operating-force spread for a lot of microswitches (n ≥ 20), to replace
  the illustrative spread. Query: "microswitch operating force distribution measured lot gf histogram".
- b03_switch: (a) the publish date of Logitech's LIGHTFORCE hybrid / optical-only support article (URL in SRC
  b03_logiHybrid). (b) Razer staff's "almost half" (no public source found; on screen as a claim via Brock, F31.1).
  Query: "Razer optical switch power consumption battery Viper V4 Pro staff". (c) Razer's own optical switch LED drive
  (current, pulse width, rate) to replace Omron's D2FP datasheet drive as the stand-in. Query: "Razer optical mouse switch
  Gen-4 LED pulse current µA".
- b03_debounce: none open (Fnatic, Razer Insider, Red Lotus, TechPowerUp in hand).
- b03_hotswap: none open (Mill-Max 3305, iFixit, Tom's in hand).

### Gap status after the 09:19 FILLS
- b03_timing flick speed: partly filled (FILLS: no measured speed at the click; derived peak ~315 °/s). Kept "an example".
- b03_switch (a) Logitech article date: not readable (template); cite undated, accessed 2026-11-06, LIGHTFORCE from 2022.
- b03_switch (c) Razer's own LED drive: still not public; Logitech's hours used as a maker's cross-check instead.
- b03_switch read current: nRF54 pull-up not found; nRF51's 11/13/16 kΩ used for scale (0.14 mA at 1.8 V).
- b03_side 0 SPDT side buttons: Q1 checking teardowns (REQUESTS.md); scoped in the foot line meanwhile.
- Still open: OpenStax torque source (b03_side), 2-pin side switch force (b03_side), knife-switch teaching source
  (b03_spdt), binning claims and RTINGS forces and a measured lot spread (b03_binning), POM-on-POM μ and the guide's
  engagement depth (b03_side friction).
