# b11 PROGRESS (Ownership: made to last, and to open)

File: deck/src/30-b11-own.js. Build: `cd /home/claude/theseus/deck && python3 tools/build.py main --out=b11 --own=30-b11-own.js`.
Checks: `export NODE_PATH=/opt/npm-tools/node_modules; Q='&2d=1'` errs / qa (T=settle, T=mid) / shoot (PAR=1).
Slides (film order): b11_card, b11_repair, b11_screws, b11_inserts, b11_wear, b11_battplug, b11_board, b11_box.
Before: b07_balance (b07, the battery as the balance weight). After: b01_close (b01, every compromise answered).
Themes alternate: card night, repair paper, screws night, inserts paper, wear night, battplug paper, board night, box paper.

## Status
- 09:05 (system clock): all eight slides built in deck/src/30-b11-own.js, in film order: b11_card, b11_repair, b11_screws,
  b11_inserts, b11_wear, b11_battplug, b11_board, b11_box (built deck: ... emg, then mine, then close; in the integrated
  film b07_balance comes before b11_card and b01_close after b11_box). Every slide has replaces, src and answers.
- Checks (build 09:12): errs ok on all eight; qa clean at settle and mid on all eight; frames one, mid and settle shot
  (work/b11/shots/1NN_b11_<id>_<t>.png; contact sheet final_contact.png; phone-size settle sheet final_settle_phone.png).
- Lab slides (b11_lab, b11_lab2, b11_lab3) and the unused b11_toolList removed.
- Review file work/review/b11.md: CONVENTION must FIXED (board colours); R-b11-2 FIXED, R-b11-3 partly, R-b11-1 and R-b11-4
  answered WHY NOT (R-b11-1 put to Brock as a question). RESEARCH b11-4 used (TweakTown added), b11-2 closed (not public).

## Reuse from the old files (they stay in the build; call, don't copy)
- 10-h2-own.js: `own_jointMM` (boss + plain bore or brass insert + screw + board, with the second-drive recut model
  `own_wallTF`: 2° tilt, a fifth-pitch phase), `own_headSecMM` / `own_headTopMM` / `own_bitMM` (ISO 7045 pan head, cross No. 0,
  slot, from panhead.js), `own_insertPartMM`, `own_isoMM`, `own_flankTFMM`, `OWN_FEEL` {abs 90, cf 70, insert 0},
  `OWN_TIW` {hv48 220, hvTi 349, 23.59 mm³: 0.186 / 0.105 g}, SRC keys ownTi, ownIso898p, ownIso7045m, ownRecess, ownStrip,
  ownCumbicus, ownCovestro, ownPem M2, own3dp, ownBrock, ownIso898.
- 10-h-own.js: `own_trifold` (envelope, trifold), `own_BOX` (box table), SRC ownEuBatt, ownJstSh, ownIfixit, ownPsV4,
  ownLogiBox, ownSoraBox, ownX2Box, ownTrOp1Box, ownB2gSlx. 12-50-own.js: ownRazerWarranty, ownPcgSkates, `own_skatePanel`.
- 2D twins: view3D('pcb', {view:'bottom'}) for the board underside art (H1 is rebuilding it to plan 5, art adapted F30.15);
  view3D('battery') (JST SH side-entry header, plug, wires, bands); view3D('claw'); view3D('screw').

## Research (phase A), with what each slide uses
- Logitech G Pro Wireless side-switch replacement, iFixit guide 211265: Difficult, 40 to 50 min, 15 steps; heat the base,
  peel five skates, seven #00 screws, ribbon locking tabs ("Do not pull on the ribbon cable itself"), clips, board adhesive,
  "Desolder the switch pins"; tools: soldering iron kit, spudger, tweezers, Phillips #00, (optional) heat gun = 5.
- Logitech G Pro X Superlight opening + battery, iFixit 170091 / 170154: heat (iOpener or hair dryer) and peel the feet
  ("secured ... with strong adhesive"), six screws, ZIF ribbon, battery connector pulled "straight up and out of its
  socket", battery "secured to the top shell with mild adhesive": heat it and pry it off; tools: spudger, Phillips, tweezers,
  angled tweezers, iOpener / hair dryer, isopropyl, cloth, double-sided tape.
- Glorious Model O 2 Wireless battery, iFixit 200287: feet off, screws, four clips, two ribbons and a JST, battery glued
  ("It is glued to the spongy material. This will rip").
- Razer Viper V2 Pro / V3 Pro, TechPowerUp p.4: "Torx T6 screws are found beneath the front and rear skates", clips at the
  sides, a cable between the shells, the main PCB held by four screws to the bottom shell, FFCs to the button boards.
- iFixit (Switch battery guide): "The battery can catch fire and/or explode if accidentally punctured." G Pro Wireless guide:
  "Be careful not to damage the battery as it can leak toxic chemicals, catch fire, or explode."
- Hakko KB: lead-free SAC305 melts at ~220 °C; tip ~340 to 370 °C (FX-951 / 936). Use "about 350 °C".
- EU 2023/1542 Art. 11 (guidelines C/2025/214): from 18 Feb 2027 a portable battery is readily removable "without requiring
  the use of specialised tools, unless provided free of charge with the product, proprietary tools, thermal energy, or
  solvents".
- 3M (science of adhesion): adhesive joints should carry "tensile, compression and shear loading, removing cleavage or peel"
  (the classroom tape: pulled along it holds, lifted at an end it peels).
- Cam-out (Stahlwille; Monroe Engineering): a cross recess's tapered flanks turn torque into an axial push that lifts the bit
  out; the slipping bit wears the head until it no longer engages (stripped). Hardness: Vickers HV = 0.1891 F / d² (Utah MCL
  lab page): same force, dent area ∝ 1 / HV: steel 220 HV vs titanium 349 HV → the steel dent has 1.59× the area, its
  diagonal 1.26× as long. Class 4.8: 130 to 220 HV (ISO 898-1, TR Fastenings); ISO 7045 Table 2 names class 4.8 steel or A2;
  grade 5: 36 HRC = 349 HV, permeability 1.00005 (ASM).
- Cumbicus et al. 2023 (open copy dadun.unav.edu): 5 mm thread-forming screws in 30 % glass-fibre PEI, loss of tightening
  torque by assembly: PF-30 3rd 11.95 %, 5th 15.31 %, 10th 17.16 %; DELTA PT 5th 56.73 %, 10th 41.93 %; first disassembly
  "negligible". (Hold kept: PF-30 88.05 / 84.69 / 82.84 %; DELTA PT 43.27 / 58.07 %.)
- 3D People 2022: brass inserts M2 to M5 in four printed plastics; after 20 loads at 80 % of the failure force, pull strength
  −1.37 % (98.6 % kept). Not a re-assembly test: label it as what it is.
- PEM IUTF-M2 heat-staking insert: 255 N pull-out and 0.5 N·m torque-out in ABS (= 26 kg hanging; a checked bag is 23 kg).
- Covestro: thread-forming screws suit once-only or few re-assemblies; "repeated assembly is only possible if the screw is
  carefully reinserted into the original thread (by hand)".
- UNITAR Global E-waste Monitor 2024: 62 Mt of e-waste in 2022, 22.3 % documented collected and recycled; small IT 4.6 Mt.
- Migliaccio & Rathod (Sept 2025) investigating a double-click defect in Logitech G Pro / Superlight mice (allegation).
- Logitech G Pro X3 SUPERSTRIKE box (ProSettings, 6 Oct 2026): grip tape, receiver, USB-C to A adapter, docs, a POWERPLAY puck;
  "Replacement mouse feet feel like a bare minimum". Viper V4 Pro (ProSettings): no spare feet ("I do miss a set").
- Datacolor / Techkon: "The barely noticeable difference (JND) of dE is usually 1" (for the ΔE ≤ 1.0 colourway target).
- Brock's doc: #52 "screws aren't under the skates will increase repairability ... prevent skate waste"; #54 PCB screws from
  the bottom "easier to access for disassembly"; #63 the PCB bottom is constantly visible without a bottom rim, so art;
  #71 the JST turned "reduces RMA fees by making it easier for customers to do their own battery replacements"; line 614
  "silicone bands ... instead of adhesive since adhesive usually gets ruined if you ever have to change the battery"; #72 the
  envelope and trifold that doubles as a manual; #73 the driver ("not everything has to be sent for RMA"); #74 laminated
  satin paper battery cover ("having the battery exposed makes a mouse look like a prototype"); #9 the combination drive
  (Phillips self-centres, any flat blade is the fallback; his comment: the cross gives a second slot if one strips);
  line 514 one screw size for everything; line 731 "with metal on plastic even the tiniest difference in the angle you
  screw it will turn the screw into a bore ... different amount of tensioning (ie create inconsistency)".

## Storyboard (every slide: frame 1 = header + subject; problem by ~1 s; fix by 5 to 7 s; payoff by ~8 s; settle held)

### b11_card (night, settle 6): Made to last, and to open
- Kit chapterCard2: ch own, compromise "Glued, soldered, thrown away", answer "Screwed, plugged, kept" (ledger strip).
- Part: the simplified mouse from below (the view b11_repair opens on). 0 s name + compromise; 0.8 s three faults lit red
  on most mice: the battery glued, the switches soldered, the skates over the screws; 3 s each turns blue on Theseus: two
  bands, claw sockets, screws clear of the skates; 5 s the list settles.
- List (7): Made to be opened / Titanium screws / Brass inserts / Thread wear / A battery you can unplug / Screws from below /
  In the box, with idea numbers.
- Hand-off in: b07_balance ends on the battery that sets the balance; the card lights that same battery first ("and in most
  mice it is glued in"). Hand-off out: the bottom view carries into b11_repair.

### b11_repair (paper, settle 12): Made to be opened  [replaces repair 8/10, no note]
- Problem (rival, named, sourced): Logitech G Pro Wireless, a switch swap per iFixit: heat the base and peel five skates,
  seven screws, ribbon latches, clips, then desolder (iron ~350 °C). Viper V3 Pro: screws beneath the skates (TechPowerUp).
- Demonstration, same task on both ("swap a worn switch"), one scale, the pointer doing it:
  0 s header, both mice bottom-up (MOST MICE: G Pro Wireless | THESEUS). 0.7 s heat glow on the rival's skates, the pointer
  peels them (struck: "peeled: ruined"). 1.6 s seven screws out. 2.4 s the shell lifts, a ribbon pulls taut (red: "tears if
  pulled"). 3.2 s the switch's three pins: the iron touches, solder melts (red heat). A tool tray under it fills as each step
  needs one: heat gun, spudger, tweezers, #00 driver, soldering iron (5).
  5.0 s Theseus, same task: four screws out from below (the skates stay: no screw under one), the board lowers on its plugs,
  the switch pulls from its claw sockets (pins, no solder). Its tray: one driver, "in the box".
  8.0 s verdict: 5 → 1 tools; under it "No heat, no solder, nothing peeled". Player line: fix it at your desk, keep the mouse.
- Rated 8, no note: keep what worked (what comes out and the tool it takes), now problem-first and shown being done.
- No classroom demo (not an engineering concept); a quiet line: iFixit survey (95 % would buy again from a maker whose
  product they repaired; self-selected readers).
- Hand-off: ends on the one driver → b11_screws opens on that driver's bit in a screw head.

### b11_screws (night, settle 12): Titanium screws  [replaces ownscrew 7/10, F2.08, F25.4, F25.5]
- Problem: a bit that slips (cam-out: the cross's sloped walls turn the twist into a lift) chews a soft head's cross until
  the bit spins (stripped). Rival: the standard M2 pan head, class 4.8 steel (ISO 7045; at most 220 HV, ISO 898-1).
- Demonstration: 0 s establish: mouse from below, the four screws lit → push in to one head (locator stays). 1 s section B-B
  with the Phillips #0 bit; the pointer twists; a torque arrow; the bit rides up the ramp (cam-out arrow), jumps, its edges
  dent the steel cross (red, sized by 1/HV). 3.5 s second slip: the cross rounds, "stripped". 5 s wipe to titanium, the same
  twist and slip: a dent 37 % smaller, the cross keeps its edges, the bit bites again.
  Classroom panel (2 to 5 s): Vickers: the same diamond, the same force, into each metal; the steel's dent 1.26× as wide.
  7.5 s verdict 220 → 349 HV (1.6× as hard), then each M2 × 4: 0.19 → 0.10 g (−44 %; 0.75 → 0.42 g for four).
  9 s plain lines: "If a cross ever strips, any flat blade turns the slot." "A thread strips in the softer part: the brass
  insert, not the screw." "Non-magnetic: a magnetised driver won't hold it." (F25.4/F25.5 honesty.)
- Step further (F0.4): Finalmouse already uses titanium (Starlight X); Theseus: M2 (2.07 mm² of thread against the M1.6's
  1.27, +63 %) and a head any driver turns, one size for every screw (Brock line 514).
- Hand-off: the screw's thread in the insert → b11_inserts.

### b11_inserts (paper, settle 11): Brass inserts: the same fit every time  [replaces own_insert; F2.01, F2.08, F21.3,
  F21.5, F21.12]
- Problem: a thread-forming screw straight into plastic forms its own thread on the first drive; driven again a hair off
  (2°: 0.17 mm at the tip, about two hairs), it cuts a second thread beside the first and seats at a new tension: the joint
  feels different (carbon-filled 70 %, ABS 90 %: Brock's estimates, F21.5). Covestro: re-assembly holds only if the screw is
  reinserted into its original thread by hand. Brock line 731 quoted.
- Demonstration (own_jointMM, both joints, the same hand): 0 s establish: a section through a board boss on the mouse, lit
  → push in. 1.0 to 3.4 s first drive on both (pointer on the drivers). 3.8 to 5.0 s backed out. 5.4 to 8.0 s re-driven 2°
  off: the plastic's red sliver grows with the drive (a new helix); the brass screw can only follow its thread.
  8.2 s verdict 70 % → 0 % "chance the joint feels different after a re-screw (lower is better)", bars ABS 90, carbon-filled
  70, brass 0. First assembly in words (F21.12): "and right the first time: the thread is cut in brass before it ever meets
  the screw".
- Classroom panel: a nut and bolt can be done up again and again; a wood screw cuts its own thread and loosens the hole. The
  insert is a brass nut set into the plastic.
- Hand-off: one re-screw changes the feel; ten wear the thread → b11_wear.

### b11_wear (night, settle 11): Thread wear  [replaces own_life; F2.01, F2.08, F21.12 "Keep both"]
- Problem: every re-assembly into plastic costs hold until the screw spins (the stripped hole everyone has met in furniture).
  Cumbicus 2023 (thread-forming screws, glass-filled PEI): the better screw kept 82.8 % after 10 re-assemblies; the other
  kept 43.3 % by the 5th. Brass insert: 98.6 % after 20 loads at 80 % of its failure force (3D People 2022). Both tests named.
- Demonstration: two joints cycle in and out together (counter 1 → 10, ~0.4 s per cycle, the pointer driving), each plastic
  cycle shaves a sliver (red slivers accumulate on the flank close-up), a dial gauge per joint reads the hold (plastic
  follows Cumbicus's points; brass stays). 6 s chart: hold kept against re-assemblies, both tests labelled, which way is
  better written. 8 s verdict 82.8 % → 98.6 % (hold kept, higher is better). Human scale: an M2 insert holds 255 N in ABS
  (PEM): a 26 kg suitcase on one screw.
- Hand-off: "open it as often as you like" → the first thing you open: the battery (b11_battplug).

### b11_battplug (paper, settle 11): A battery you can unplug  [replaces ownbatt; F26.4]
- Problem: most mice glue the battery (Superlight: adhesive, heat and pry; Model O 2 Wireless: "glued ... will rip");
  prying a pouch risks a puncture, which can start a fire (iFixit). A plug you can't get behind gets pulled by its wires, at
  an angle, which peels its pads (the Superlight's is pulled "straight up").
- Demonstration: 0 s establish: mouse from below, battery and plug lit → push in. 1 s rival: heat glow, a spudger under a
  glued pouch, the pouch bends (red stress); a top-entry plug tugged by its wires lifts the header (peel). Classroom panel:
  a strip of tape: pulled along (shear) it holds, lifted at the end (peel) it comes away (3M). 5 s Theseus: the side-entry
  plug turned to face the back (F26.4): a fingertip pulls it straight back along the board (shear), it slides out; the
  battery slides out of its two silicone bands. 8 s verdict: tools and heat to change the battery: Superlight's list → 0;
  "No heat, no solvent: what the EU requires from 18 Feb 2027, already".
- Hand-off: the battery out, the board in view → b11_board.

### b11_board (night, settle 11): Screws from below, art on the board  [replaces ownboard; F30.15]
- Problem: in most mice the board sits inside a two-part shell on screws driven from inside (Viper V3 Pro: four screws to
  the bottom shell; to get there: skates, screws, clips, a cable between the shells; TechPowerUp). Section: the driver from
  below reaches only the shell's screws; the board's are behind the bottom shell.
- Demonstration: same input, the driver from below: on Theseus the board hangs from the top shell's bosses (brass inserts)
  on four M2 screws driven from below: each is in reach; they back out, the board lowers out (spring settle), the shell
  untouched. Then turn to the board's underside: the art (H1's plan-5 board, the old design's artwork adapted: dark filleted
  triangles, gold clusters, wordmark, QR to the web software, F30.15) and a laminated paper cover over the battery (#74,
  about 0.10 g): with no bottom plate the underside is the face you see.
- Verdict: "Board screws you can reach without opening the mouse: 0 → 4".
- Hand-off: the board back in, the mouse turned over → into the box.

### b11_box (paper, settle 11): In the box  [replaces box, ownsheet1 2/10, ownsheet2]
- Problem: wireless flagships ship no driver and no spare skates (box lists: Viper V4 Pro, X3 Superstrike, Starlight X,
  Sora V3, X2 CrazyLight; the wired OP1 8K adds a driver); Razer may refuse warranty after third-party skates (May 2026).
- Demonstration: the envelope opens, the trifold slides out and unfolds (own_trifold, improved): setup (QR), spares (POM and
  PTFE dots, grip tape), repair (the driver: cross or slot, the steps). The skate file (DXF) published on day one. The
  colourway: a keycap set beside the mouse, ΔE ≤ 1.0 (below what the eye can see).
- Verdict: what ships in the box, next best 3 of 6 → 6 of 6 (table, sourced per mouse).
- ownsheet1's points moved: ribbon vs wires (#51) → b10_wires; twisted leads (#69) → b10_twist; the skate DXF stays here.
  ownsheet2: colourways here; serials ending in 9 out (serials hidden, F26.11); the paper cover → b11_board (the underside).
- Hand-off out: the box closes on the mouse and the driver → b01_close.

## Phase B log
- 08:03 KIT.md landed; the kit is in the snapshot. Build: `python3 tools/build.py main --out=b11 --own=30-b11-own.js`.
- Helpers written and checked in a lab page (only under `&b11lab=1`, shot with work/b11/scripts/shoot-q.js): tools
  (b11_toolMM), Vickers panel (b11_vickers), cam-out wear (b11_headTopMM / b11_headSecMM), dial (b11_dial), plastic flank
  wear (b11_flankN), tape peel/shear (b11_tape), plug section (b11_plugMM), battery glue/bands (b11_battSecMM), side innards
  (b11_theseusInside / b11_rivalInside), bottom inset (b11_underMM), tool list (b11_toolList).
- b11_repair: first full draft (wipe from the G Pro Wireless job to Theseus's; tool list; bottom inset; verdict 4 → 1).
- 08:17 b11_repair rebuilt as a three-step job sheet (open it, reach the board, free the switch): most mice (G Pro Wireless,
  iFixit) above, Theseus below (dimmed until its turn), tools kept in their cells, verdict 5 → 1. errs ok, qa clean (settle,
  mid). CHECKPOINT1.md written (frames 125_b11_repair_0.6 / 4.8 / 12).
- 08:29 b11_inserts built: establish on Theseus's front boss (side view), split into carbon-filled | brass, one pointer
  drives both in, out and in again 2° off; red second thread vs the same thread; verdict 70 % → 0 %; bars; first fit in
  words. errs ok, qa clean (settle, mid). Frame one shows the mouse and its bosses.
- 08:30 08:45-broadcast acted on: models table below, warm greys converted to true greys, frame one checked (b11_repair and
  b11_inserts show their subject at t = 0); 0.17 mm corrected to 0.14 mm on b11_inserts.
- 08:38 b11_wear built (night): two rows (the joint in section, a loupe on its thread, a dial): plastic re-assembled 10
  times (flank magnified, red slivers, dial follows Cumbicus PF-30), the brass insert pulled 20 times to 80 % of failure,
  then measured (98.6 %); verdict 82.8 → 98.6 %; bars name each test; 255 N = 26 kg; hand-off to the battery. errs, qa clean.
- 08:38 b11_screws built (night): establish from below on the four heads, push in to one, dip to steel | titanium: the same
  twist and two slips (cam-out arrow, burrs, dents from above sized by 220/349); Vickers panel; verdict 220 → 349 HV; four
  screws 0.75 → 0.42 g; three plain lines. errs ok, qa clean (settle, mid).
- 08:42 checkpoint (integrator). In flight: b11_battplug (see Status for the exact next step).
- 08:50 broadcast (plan 5 in KEY_PARTS): b11_batt now reads KEY_PARTS.battery (yMid ± t/2); screw and board places already
  plan 5; re-shot repair, screws, inserts, battplug: camera targets and callouts land.
- 08:50 b11_battplug built (paper): 2 × 2 (battery glued and pried vs in bands; plug pulled by its wires vs facing the back,
  with a top-view turn of 90°), tape panel (peel vs shear), verdict 7 → 1 (iFixit's Superlight list → the driver), EU line.
- 08:55 b11_board built (night): the mouse from below, four screws out, push-in to the board's underside (plan 5's art from
  the 2D twin), five callouts measured on the drawing; Viper V3 Pro's route in a side panel; verdict 0 → 4.
- 08:57 b11_box built (paper): envelope and trifold (own_trifold), the driver, the table (6 flagships + Theseus's plan),
  verdict 3 → 6 of 6, the skate file and the colourways.
- 08:58 b11_card built (night): chapterCard2 with the cut-open mouse turning from glued/soldered to bands/sockets.
- 09:06 review: board colours fixed; repair 4 → 1 with iFixit's time; replies written in work/review/b11.md.
- 09:12 labs removed; errs/qa clean on all eight; final shots and phone sheet.

## Models and conventions checked (08:45 rule: nothing reused unchecked)
| What | Where | The check | Verdict |
|---|---|---|---|
| own_jointMM's 2° second pass | b11_inserts | own_wallTF turns the second pass about the hole's mouth (z = 0), so the tip at 4.0 mm lands 4.0 × sin 2° = 0.14 mm aside | I had written 0.17 mm: FIXED to 0.14 mm ("about two hairs": SCALE.hair 0.07 mm × 2) |
| OWN_FEEL 90 / 70 / 0 % | b11_inserts verdict and bars | Brock's estimates (F2.01, F21.3, F21.5), not measurements; brass 0 % from his experience; a simulation is TODO (F21.12) | Kept; the source line says "Brock's estimates"; no measured-looking tag added |
| "a screw cuts its own thread" | b11_inserts captions | a thread-forming screw forms (displaces) rather than cuts; everyday speech says cuts/taps | Kept "cuts" as the plain word; the drawing (own_wallTF) shows the displaced wall, not chips |
| Cumbicus 2023 percentages | b11_wear | Springer full text (Sec. 4.3, 5): the loss of tightening torque, measured as the loosening torque at each release. The old ownCumbicus said "loosening torque lost against the first tightening" (near); my b11Cumbicus said "loss of tightening torque" (vague) | FIXED: shown as "torque to undo it, against the torque that closed it"; DELTA PT is not monotonic (43.3 % kept by the 5th, 58.1 % by the 10th): both said, no cherry-pick |
| 3D People 2022, 98.6 % | b11_wear | PDF re-read: 20 load/unload cycles at 80 % of the failure force, then pulled to failure: about −24 N, −1.37 % (a decrease) | Kept 98.6 %; it is a different test from re-assembly, so the slide names each test on its own dial and bar. The 629.2 N M2 figure is an average over four printed plastics: no per-material newtons on screen |
| PEM IUTF-M2 255 N in ABS | b11_wear human scale | 255 / 9.81 = 26.0 kg | Kept: "a 26 kg suitcase" |
| OWN_TIW 220 → 349 HV | b11_screws | 220 HV is the top of class 4.8's ISO 898-1 range (130 to 220 HV): the steel's best case; 349 HV is ASM's 36 HRC converted for annealed grade 5 | Kept; conservative for Theseus. b11_vickers' "1.26× as wide" = √(349/220) (Vickers d ∝ 1/√HV at equal load): correct |
| OWN_TIW masses | b11_screws | 23.59 mm³ (3D model) × 7.9 and × 4.43 g/cm³ = 0.186 g and 0.105 g; four: 0.75 g → 0.42 g | Kept |
| Repair tool count | b11_repair | iFixit's G Pro Wireless switch guide lists the heat gun as optional | Counted in the 5, said in the source; question for Brock |
| own_bars convention | b11_inserts, b11_wear | rows labelled with their test, "lower/higher is better" written, Theseus row in blue | Kept |
| own_ba (old before/after) | all | replaced by the kit's verdict() | Not reused |
| Warm greys | my helpers | 15 hexes and 4 rgba warm greys in b11 helpers | FIXED: converted to true greys of the same lightness |
| Board colours (CONVENTION 08:54) | b11_repair, b11_battplug, card/repair side cuts | pcbSec defaults to a green mask; a rival's board is grey, Theseus's black (MT.mask) | FIXED: rival boards C.comp, Theseus's #16171A; own_jointMM's board kept black (same board, counterfactual joint) |
| Repair tool count | b11_repair | iFixit's list: soldering iron kit, spudger, tweezers, Phillips #00; heat gun optional | FIXED: 4 → 1, the optional heat gun said beside it (was 5 → 1) |
| own_BOX table | b11_box | each row against its source (ProSettings/TweakTown, Logitech, Back2Gaming, AusModShop, TechRadar); "measured/claim" evidence tags made no sense for a box list | Rows kept, tags dropped; a dash = not listed; X3 Superstrike left out (its source lists no cable, which would undercount it) |
| own_trifold | b11_box | the old drawing (warm hexes neutralised by warmGuard at draw time); started 1.2 s in so frame one shows the envelope | Reused, not copied |
| 3D People / Cumbicus labels | b11_wear | each test named on its own row and bar; DELTA PT's 58.1 % at the 10th in the source | Kept |

## Research gaps (web search budget used up; for the research agents: query or URL, and the slide it feeds)
1. b11_wear / b11_inserts: a teaching or extension source that a wood or particleboard screw re-driven into its own hole
   holds less each time (classroom panel). Query: "repeated screw insertion particleboard withdrawal resistance second
   insertion". Until then: no classroom panel on b11_wear; the plastic data is Cumbicus 2023 only.
2. CLOSED 09:03 (FILLS.md: not in any public JST sheet; spec on request). b11_battplug: JST SH unmating force per contact, for a human-scale line on the plug.
   Query: "JST SH SHR-03V-S withdrawal force per contact specification" (Mouser catalogue eSH-3480477.pdf has no figure).
   Until then: no newton figure on the plug.
3. b11_repair, b11_board: Razer Viper V4 Pro and Logitech G Pro X Superlight 2 disassembly (screws under skates? board
   screws from inside?). Query: "Viper V4 Pro teardown screws under skates" and "G Pro X Superlight 2 teardown"; TechPowerUp
   review pages could not be read. Until then the rivals stay the G Pro Wireless (iFixit) and the Viper V3 Pro (TechPowerUp).
4. PART FILLED 09:03 (Viper V4 Pro: no driver, spare screws or skates; TweakTown, Profesional Review). b11_box: what ships in the box for 2026 flagships beyond the X3 Superstrike (ProSettings) and the Viper V4 Pro: Sora V3,
   X2 CrazyLight, OP1 8K, Starlight X (URLs already in SRC: ownSoraBox, ownX2Box, ownTrOp1Box, ownB2gSlx); does any include
   a screwdriver or spare screws? Query: "<mouse> unboxing what's in the box screwdriver".
5. b11_battplug: does the G Pro X Superlight's battery connector sit top-entry (pulled "straight up", iFixit 170154)? Fine
   as is; a photo-level confirmation would let the slide name it. Query: "G Pro X Superlight battery connector JST top entry".
