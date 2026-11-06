# A1 audit: the eleven archived slides, clause by clause (build main-1253)

Auditor: A1 (independent, report only). Build judged: /home/claude/work/int/film/main-1253.html (107 slides), the one live
for Brock. Its code is identical to /home/claude/live/deck/src (checked file by file), so the `answers` quoted below are the
built ones. The working source (/home/claude/theseus/deck/src) was re-diffed at 13:19; where it already fixes a finding, the
evidence column says so, but the verdict is on the live build.

Frames: /home/claude/work/a1/shots/r1/ (t = 0.6, 40 %, settle for all eleven), /home/claude/work/a1/shots/r2/ (t = 0 and the
demonstration beats), zoom crops `z_*.png` in both, contact sheets `g_*.png` in r2. File names are `<index>_<id>_<t>.png`.
Shot with the deck's tools/shoot.js (`Q='&2d=1' PAR=1`), 4 runs, one browser at a time, no page errors. tools/qa.js at
settle and at 40 %: clean on all eleven (its tolerance is 6 px; the overlaps below were found by eye and zoom).

Old → new: `clicks` → b02_card, `arc` → b02_direct, `clk_switch` → b03_switch, `tensioner` → b02_tensioner, `clk_tenmat` →
b02_stiff, `anchors` → b02_rails, `sidebuttons` → b03_side (the click rebuild); `cells` → b10_battery, `elecsheet1` →
b10_sealed, `cable` → b10_cable, `srf_encoder` → b10_lights (the board package). Each `replaces` list holds exactly the one
old id.

Verdicts: DONE, PARTIAL, NOT DONE, OVERCLAIMED (the `answers` text claims more than the frames show; the most serious),
SUPERSEDED (a later FEEDBACK decision replaced the clause).

---

## 1. `clicks` (7/10) → b02_card "Clicks that land the same, every time" (settle 5.5)

| Clause (F27, verbatim) | Verdict | Evidence (frame, time) | Fix |
|---|---|---|---|
| "switch plunger on the gt01s is still turned vertical ... the part that actually sticks out above the housing looks like it needs to be turned 90 degrees" | DONE | r1/z_card_plunger.png (from 11_b02_card_5.5): the cap above the cover is now a short, round-topped inverted U about 1.5 mm across on its flange, as in Gateron's render (refs/photos/gateron-gt01-vertical-push.jpg); v19 (feedback/frames/F27/016_clicks.jpg) had a tall narrow stub. On screen from t = 0 (r2/11_b02_card_0.png). | None |
| "bottom part looks fine" | DONE | Same frames: the bottom housing kept, H1's 0.70 mm walls, round holes, slot and triangle, three pins (F12.7). | None |

## 2. `arc` (7/10) → b02_direct "Direct Drive Actuation" (settle 11)

| Clause | Verdict | Evidence | Fix |
|---|---|---|---|
| "tensioner doesn't look accurate" | DONE | r1/z_direct_tens.png (11 s): the shared click section (K1, from his photos): a block clamped by one screw from below into a brass insert, the trigger's own arm thinning to the bridge's crown, square joints. Consistent with the G305's one-screw blocks (refs/photos/brock-2026-11-06/g305-top-shell-tensioners.jpg). It is small here (about 150 px); b02_tensioner carries the detail. | None |
| "i dont like the use of the metrics "pts" or "points" anywhere" | DONE | No "pts" or "points" in any string of the slide (grep); the loupe and verdict are percentages of the travel (r1/17_b02_direct_11.png). | None |
| "this is a really important slide the concept is good but it needs to be demonstrated and sold better" | **OVERCLAIMED** | The demonstration is there: the finger presses the trigger on an upright switch at 2.0 and 3.15 s, the loupe splits the travel (34.2 % across, in red), the switch turns 20° in place at 4.3 to 5.3 s, the same presses land on the GT01, with the lawn-mower classroom panel (r2/17_b02_direct_2.3, 3.4, 6.2.png). But the answer says "Sold in What you feel: no scrub, no wear in the guide, the click 6 % sooner". The slide has no "What you feel" panel (its draw() has no noteBox), and "wear" is never said. The player's gain is only the last caption (from 7.85 s) and the loupe's small line "the click 6 % sooner". The verdict is a mechanism metric ("Travel at the switch running across it"). This is one of his F33.5 important ideas. Not fixed in the working source. | Add the panel the answer describes, e.g. `noteBox(t, Q.v + 1.3, 1200, 560, 640, { label: 'What you feel', head: 'The whole press goes into the click', body: 'Nothing scrubs the plunger, so nothing wears the guide or mushes the click, and it lands 6 % sooner at the same press speed.' })`, in the gap between the loupe text and the classroom panel (or replace the classroom panel after the verdict lands). Otherwise cut the answer down to what is on screen. |
| "i think direct drive means the peak theoretical reaction time should be 20% faster because 20% more of the force goes where you actually intend it" | SUPERSEDED (F31.2: "Keep "6% sooner"", with why it isn't 20 %) | The slide keeps 6 % (the loupe line at settle and the last caption). The foot line gives why: "across = sin 20° = 34.2 % of the travel, along = cos 20° = 94.0 %, so turning the switch makes the click 6 % sooner, not 20 %" (r1/17_b02_direct_11.png). | None (the "why" lives only in the foot line; fine) |

> **P5 (14:10), O1 done:** once the verdict lands the lawn-mower panel fades and a noteBox takes its place (from Q.v + 1.3 s): "What you feel. The whole press goes into the click. No scrub at the plunger, no side load wearing its guide, and the click lands 6 % sooner." Once the tile has landed, the panel under it is not drawn, and qa is clean. The answer row now says what is on screen. S7: the panel ends 24 px above the verdict label. S11: the mower's useful component and "only F cos θ moves it" are in ink. Frame: /home/claude/work/p5/shots/a4/19_b02_direct_11.png

## 3. `clk_switch` (5/10) → b03_switch "A mechanical switch, for the battery" (settle 12)

| Clause | Verdict | Evidence | Fix |
|---|---|---|---|
| "bottom housing doesn't look very accurate at all, i'll attach a new reference when you ask" | DONE | r1/22_b03_switch_12.png: the shared clk_gt01MM traced from the render he called the best reference (F28.1), with straight 0.70 mm walls (F30.24) and four cut-outs. The answer still says H1's walls "land here as it lands"; they have landed (an under-claim, harmless). | Optional: update the answer's tense |
| "show the effect on battery life" | DONE | LED current trace, 5 mA pulses whether pressed or not (r2/22_b03_switch_2.6.png, 3.7). The V4 Pro's draw: the two optical switches' 0.23 mA in red become 0.006 mA (r1/22_b03_switch_4.8.png, r2 6). Verdict "Switch drain (lower is better) 13.6 % → 0.4 %, +15 % battery life" (r1 12). | None |
| "razer says their optical encoder and switched account for almost half the battery life in the viper v4 pro (find quote)" | **OVERCLAIMED** (minor) | On screen as F31.1 requires: "Razer staff, via Brock, put it higher still: switches and wheel take "almost half"" (from 9.2 s, r1 12). But the answer adds "beside Logitech's own support page saying its optical-only mode "can reduce battery life"", and that line is not on the slide. `b03_logiHybrid` is only in `src`; the column now shows "By Omron's datasheet pulse: up to 17.6 %". Not fixed in the working source. | Add the line under "The same, other ways": `Logitech's own support page: optical-only mode "can reduce battery life"`. Or delete that phrase from the answer. |
| "also i'd like to switch to using a halling effect/ magnetic encoder" | DONE | Settled caption: "The wheel is magnetic too: only the sensor lights up." (r1 12); b10_lights carries it. | None |
| "so we can say we should have double the battery luce efficiency as razer" | SUPERSEDED (research, BROADCAST-0945; the F27 marker on clk_switch) | The slide says +15 % for the switches; b10_lights has +23 % with the wheel; Razer's remark is attributed only. | None |

> **P5 (14:10), O3 done:** the line is on screen under "The same, other ways", between Omron and Razer: Logitech's own page: optical-only mode "can reduce battery life". The rows are respaced (y 782 / 816 / 852 / 920), so the wrapped Logitech line clears Razer's. Frame: /home/claude/work/p5/shots/a4/24_b03_switch_12.png

## 4. `tensioner` (8/10) → b02_tensioner "The bridge tensioner" (settle 11)

| Clause | Verdict | Evidence | Fix |
|---|---|---|---|
| "reference the starlight x's stufd clicks from using such a stiff composite materiak with no bridge" | DONE | Top row "As seen in Starlight X / Flat, no bridge, same resin". First caption: "a flat tensioner with no bridge in a stiff composite, so it bends all along and the click comes stiff". The flat plane needs 26.9 gf to click against the bridge's 7.7 (r2/18_b02_tensioner_5.6.png); the felt click is 68.2 → 49.0 gf (r1 11). | Should: the row is modelled in PP-C-20A (the foot line says Starlight X's own composite is stiffer and unpublished), yet a big 68.2 gf sits under "As seen in Starlight X" and reads as that mouse's own figure. Make the spec line "Flat, no bridge, modelled in the same resin". |
| "market top as "as seen in starlight x" or something like that, and bottom as proposed solution" | DONE | Both labels from t = 0 (r2/18_b02_tensioner_0.png) to settle. | None |
| "also the rounding where the bridges meets the trigger looks bad, ie needs to connect without filets" | DONE | r1/z_tens_joint.png (11 s): the bridge runs square into the block and the trigger's riser, with mitred ends and no fillet. | None |

> **P5 (14:10), Should done:** the top row's spec reads "Flat, no bridge, / modelled in the same resin" (second line kept lowercase). S4: the stress key now sits stacked in the clear right of the top row, off the riser, and after the push-in the locator crossfades from the top left to the bottom right corner, off the brass insert. S14: the red crown stays (F18.6), as main asked. FILM F38: the theme is now paper, one ground per run with b02_stiff. Frame: /home/claude/work/p5/shots/a4/20_b02_tensioner_11.png

## 5. `clk_tenmat` (4/10) → b02_stiff "A stiff button, a light click" (settle 10)

| Clause | Verdict | Evidence | Fix |
|---|---|---|---|
| "hard to understand" | DONE | The old chart (feedback/frames/F27/023_clk_tenmat.jpg) is now one demonstration: the same 2 N hard click on one button shape in ABS and in PP-C-20A, side by side from t = 0. The ABS body bends 45 µm past the switch and PP-C-20A 9 µm (drawn 40×, labelled), with the door classroom panel (r2/19_b02_stiff_2.6.png, r1 10). See the standing-rule notes on its 40 % frame (M8) and human scale (M5). | None for the clause |
| "and stiffer is better doesn't seem right" | DONE | "A button has two jobs" (0.5 s caption). Panel "Two jobs, two parts: The body: stiff. The spring: light." (7.1 s). The verdict is the body's bend (lower is better), not "stiffer" (r1/19_b02_stiff_10.png). | None |

## 6. `anchors` (7/10) → b02_rails "Dual rail main clicks" (settle 11)

| Clause | Verdict | Evidence | Fix |
|---|---|---|---|
| "locking the motion to one plane/ direction needs to be better explained" | DONE | A sideways flick swings the one-post button about its spring (drawn 14×, r2/20_b02_rails_2.2.png, z_rails_22.png), tagged "One post: swings about it" (3.3 s). The second post stops it (5.9, 7.3 s). Settled caption: "moves in one plane only". Drawers classroom panel: the one-runner drawer twists. | None |
| "and the visualization here is too abstract and difficult to tell what you're looking at" | PARTIAL | The context is clear now: the whole mouse from above at 0.6 s, a push-in to the left button, the locator kept (r1 0.6, 4.4). But the mechanism the slide is about is not legible. From 1.3 s to the end the fingertip covers almost the whole button. The front post sits under the nail, marked only by a blue dot. The rear post and guide peek out below the finger at about 20 px. The POM pads cannot be seen at any time (r1/z_rails_settle.png, z_rails_mid.png). | Make the posts the subject. Draw the finger see-through (outline only) or move it to the button's tip. Add a loupe like b02_direct's on the two posts in their padded guides, about 3× scale, swinging then held. Or lift the finger after the last flick, so the posts and pads read at settle. |
| "i also dislike how the dual plungers and pads aren't uniform" | PARTIAL | The code draws them identical (2.4 mm posts, the same guides and pads) and the tag says "A second post, the same". But the viewer cannot compare them: the front post is hidden and the pads are invisible (z_rails_settle.png). The answer ("Both posts are the same ... both with the same POM pads") reads as if this is visible; it is not. | Same loupe as above: the two posts side by side, the same size, the same pads, at settle. |
| "and you need to sell the benefit here a little better, talk about how the bad version feels cheap and causes more wear over time fork being losing" | **OVERCLAIMED** | The answer says "What you feel: no sideways wobble under the finger (the cheap feel), and nothing grinding the guide wider every click (red rub marks build on the bare guide; POM pads take the rub on Theseus)". On screen, wear is said (1.9 s caption: "the post grinds the guide wider with every click") with small red rub marks (z_rails_mid.png). But "cheap" is never said or shown, there is no "What you feel" panel (no noteBox in the slide), and "POM pads take the rub" is neither said nor visible. The verdict is the play: 0.39 → 0.05 mm, −87 % (r1 11). Not fixed in the working source. | Add the panel, e.g. `noteBox(t, Q.v + 1.2, 1180, 560, 660, { label: 'What you feel', head: 'Solid, not cheap', body: 'No side-to-side rattle under your finger, and nothing grinding the guide wider click after click: the POM pads take the rub.' })` (over the classroom panel once the verdict lands). Say "feels cheap" in the 1.9 s caption. |
| "good information, execution just need medium improvement" | PARTIAL | The information is kept and the execution is rebuilt as a demonstration with one number, but its subject (posts, guides, pads) stays hidden (see above). This is one of his F33.5 important ideas. | As for the abstract clause |

> **P5 (14:10), O2 done:** the 1.9 s caption now says "a rattle that feels cheap". Once the verdict lands, a noteBox replaces the classroom panel: "What you feel. Solid, not cheap. No side-to-side rattle under your finger, and nothing grinding the guide wider click after click: the POM pads take the rub." The panel under the note is no longer drawn after the note lands.
> **P5, PARTIAL x3 (abstract, not uniform, medium):** two 2.25× loupes on the left show the front post and the rear post, each in its guide, with the POM pads drawn (white on paper, grey on night) and labelled "POM pads". Dashed leaders run to the posts, and the finger is ghosted so the posts read through it. Both posts are drawn by one function, so they match. Frame: /home/claude/work/p5/shots/a4/22_b02_rails_11.png

## 7. `sidebuttons` (5/10) → b03_side "Dual rail side buttons" (settle 11)

| Clause | Verdict | Evidence | Fix |
|---|---|---|---|
| "left visualization fells lazy" | DONE | The hinged button is drawn as built (living hinge, nub on a 2-pin mini switch on its own side board, ribbon cable, "as in the Hitscan Hyperlight") and pressed by the thumb at three spots: 165 / 68 / 40 gf, with "At the tip it bends on past the click" (r2/29_b03_side_1.9, 2.5, 3.2.png). | None |
| "right visualization doesn't match the other dial rail plungers with prfe" | DONE | Two posts about 2.4 mm thick (about 2.3 mm measured against the 12.8 mm switch), each between two POM pads, tagged "Two posts on POM pads / As the main buttons; the guides are the stop" (r1/z_side_rail.png). Uniform within the button: both posts and the plunger-pusher are the same. | Note: the match across slides relies on b02_rails, whose posts are hidden (see 6) |
| "and it's way overbuilt" | DONE | Only guides with pads, two posts, a stabiliser wire in two clips and a pocket round the switch; no arms, no glove (z_side_rail.png against feedback/frames/F27/033_sidebuttons.jpg). | None |
| "important information though, it gets the point across okay" | DONE | Kept: full-size SPDT, held by the shell, "0 side boards", "29.31 g with four full-size SPDT switches", the guides as the stop (#64) (r1 11). "0 mice ship SPDT side buttons" was superseded by research (BROADCAST-0945; the F9.16 and F11.4 markers) and is said truthfully in the foot line ("Full-size side switches are rare: the Gamesense MVP's sit on a side board"). | None |
| "it just feels lazy" | DONE | Establish, push-in, three presses on each design, the door classroom panel, verdict "Click force spread across the button (lower is better) 125 → 4 gf" (r2 6.7, r1 11). F31.4, F44.1 and F48.1: b03_rail (the four designs) plays just before, and the tied posts are drawn as picked. | None |

## 8. `cells` (4/10) → b10_battery "The battery, per gram" (settle 10)

| Clause | Verdict | Evidence | Fix |
|---|---|---|---|
| "lithium ion numbers are way off" | DONE | The Li-ion is now a 10440 at 350 mAh and 9 g (akkuteile; Keeppower about 10 g), not an 18650 (r1 4, 10). | None |
| "look at smaller batteries, you're probably looking at too big of ones" | DONE | Same: the AAA-size 10440 on the balance against the 370 mAh pouch. | None |
| "lithium ion batteries are a usually a gram or two heavier than their lithium polymer counterparts if the same capacity for mice" | DONE | The balance settles toward the Li-ion: "1 g heavier, for 20 mAh less" (from 3.0 s, r1 4). Cut open: the steel can 2.2 g against the pouch's foil 0.4 g (r2/84_b10_battery_5.png). The answer's scaled "1.5 to 2.6 g at 370 mAh" is reasoning, not an on-screen claim. | None for the clause; see the standing-rule findings (dots, 29.3 g) |

## 9. `elecsheet1` (7/10) → b10_sealed "A coat that keeps water out" (settle 11)

| Clause | Verdict | Evidence | Fix |
|---|---|---|---|
| "show joe this protects against water" | DONE | A sweat drop on two powered pads. Bare: a tin tree grows and shorts at 14 s (r2/86_b10_sealed_2.5.png, r1 4.4). Wipe to the coated board: 120 s, no current (r2 6.3, r1 11). | None |
| "for very little weight" | DONE | "+0.24 g of coat (50 µm, both faces): under 1 % of the mouse" (from 9.3 s, r1 11). | None |
| "something few might do" | DONE | "Few mice protect the board: HyperX rates its Pulsefire Haste Wireless IP55 against sweat." (from 9.6 s, r1 11). | None |

The old slide's other half (#100, a readable ON/OFF switch) was dropped on purpose: the switch's place waits for the bottom
cover (F29.3), and ship mode moved to b10_charge. Accepted.

## 10. `cable` (3/10) → b10_cable "An angled plug, a paracord cable" (settle 11)

| Clause | Verdict | Evidence | Fix |
|---|---|---|---|
| "extremely lazy visualizations" | DONE | A demonstration. The straight plug's slack goes under the chin; a flick pitches the mouse and lifts the lens 1.6 mm past its 1 mm lift-off ("About two credit cards"); the cursor freezes and misses (r2/89_b10_cable_1.4, 2.7.png). Rewind and wipe: the angled plug, the same flick, 0.0 mm, a hit (r2 4.6, r1 11). | None |
| "paracord needs better assets" | DONE | Woven sheath (diamond weave, highlights, blue tracer) and the cable cut across (sheath yarns, filler, four stranded conductors) (r1/z_cable_close.png). The L plug turns the cable up (r1/z_cable_plug.png). | None (see historical finding H18: idea #20) |

> **P5 (14:10), #20 done (historical H18):** the close-up's name now gives the thickness, "Theseus's cable, about 2 mm" (B10_CAB.dt). From 6.7 s, under it: "Thin enough not to tug a 29 g mouse; XBAB's 1.9 mm cable still passes USB high speed" (elcXa25, in src; 29 from THESEUS.mass). The woven band runs lower on the right to clear the two lines. Theseus's slack on the pad had been drawn at the stock cable's 3 mm under its 2 mm arc; it is now 2 mm throughout. I left out "thick enough to charge at full speed": XBAB's page gives the high-speed eye test, not a current rating. S12: the rival's lens marker is ink until Theseus is on screen. Frames: /home/claude/work/p5/shots/a3/100_b10_cable_11.png, close-up at 4.6 / 7.3 s: /home/claude/work/p5/shots/a3/close_46_73.png

## 11. `srf_encoder` (2/10, no note) → b10_lights "Nothing lights up but the sensor" (settle 12)

His notes that REVAMP and F30.20 moved onto this slide are checked as its clauses.

| Clause | Verdict | Evidence | Fix |
|---|---|---|---|
| srf_encoder, 2/10 with no note (rebuild it) | DONE | A demonstration: the V4 Pro in x-ray with three pulsing LEDs and their shares (5.8 / 6.8 / 6.8 %, r1 0.6, r2 2). They go out as it hands over to Theseus (r2 3.2). Then the dust test. | None |
| (sealed) "you're still drawing the encoder poorly" | DONE | The shared magnetic encoder: clear top over the rotor, detent star, leaf spring, magnet and its field, five pins (r1/z_lights_enc.png). It is drawn small (12 px/mm, about 200 × 300 px), where the answer says "large". | Could: draw it larger, since the dust panel has room |
| (sealed) "a magnetic encoder that doesn't get affected by dust" | DONE | Dust test: optical "Counted 8 of 16" in red, magnetic "Counted 16 of 16" (r1 12). | None |
| (sealed) "have a transparent top housing to see when it's broken like switches" | DONE | "Clear top: Spring and magnet in sight" (from 9.2 s, r1 12). | None |
| (elc_sheet2) "add the no rgb light to the slide about having no optical components" | DONE | "No RGB either: Logitech rates its G703 for 32 h with the lights off, 24 h with RGB cycling." (from 4.0 s, r1 4.8). | None |
| (elc_sheet2) "put it next to the web software" | DONE | Film order (ids-1253.json): b10_cable, b10_lights, b10_software. | None |

---

## Standing-rule findings (brief §3, on the eleven new slides)

| # | Rule | Slide | Verdict | Evidence | Fix |
|---|---|---|---|---|---|
| S1 | F9.5 no dots between words | b10_battery | NOT DONE | "350 mAh · 9 g" and "370 mAh · 8 g" under the pans, from t = 0 to settle (r1/84_b10_battery_10.png). Still in the working source (lines 1064, 1066). | "350 mAh, 9 g" and "370 mAh, 8 g" (or two lines each) |
| S2 | F2.32 the mouse is 29.31 g | b10_battery | NOT DONE | Scale note "is 27 % of Theseus's 29.3 g" (from 6.6 s, r1 10). Still in the working source (line 1082). | Use THS.mass: "29.31 g" |
| S3 | G5 one precision per figure, rivals not rounded our way | b10_battery | PARTIAL, **fixed in the working source** | Live: the caption says the pouch "runs 33 h longer" and the verdict net says "+30 h at 1 khz", for the same figure. 140 → 170 Wh/kg rounds the 10440's 144 down, in Theseus's favour (r1 10). The working source now prints 144 → 171 and +33 h on both. | Publish the fix |
| S4 | F2.41 no overlaps | b02_tensioner | PARTIAL | From the push-in (about 7.9 s) to settle, the heat-key panel covers the top row's trigger riser and the trigger's top surface (r1/z_tens_key.png). The locator panel covers the top row's boss and brass insert (r1/z_tens_loc.png). | Move the key out of the drawing (the right column above "As seen in Starlight X", or the gap between the rows), and fade the locator out once the camera has pushed in (or park it in the lower-left gap) |
| S5 | F2.41 no overlaps | b03_side | NOT DONE | From 0.9 to about 4.7 s the classroom panel's heading "THE CLASSROOM VERSION" runs into its source "OpenStax §10.6" with no gap. The door's red force arrow (165 gf at the hinge) starts above the panel and runs down through the heading text (r2/z_side_panelhead.png, from 29_b03_side_1.9). | Drop the panel label here (keep the source), or shorten it to "Classroom", or move the source to the panel's foot. Start the door's arrow below the heading: cap its length, or lower the door by about 40 px. |
| S6 | Legibility (F2.41, M7) | b03_side | PARTIAL | At settle, "Stabiliser wire / And its two pivot clips" sits between the "59 gf" and "55 gf" readouts in the same blue, so "59 gf STABILISER WIRE" reads as one unit (r1/z_side_labels.png). | Keep the left column for the three readouts; move the wire's tag to the right column with the other part names (or below the drawing) |
| S7 | F2.41 (spacing) | b02_direct | PARTIAL (minor) | At settle, the verdict label "Travel at the switch running across it (lower is better)" touches the classroom panel's bottom edge (r1/z_direct_verdict.png, z_direct_overlap.png). | Lower the verdict by about 15 px, or shorten the panel by 10 |
| S8 | M8 every mid-frame designed | b02_stiff | PARTIAL | The 40 % frame (4.0 s) falls between the two presses: both bars at rest, no arrow, no numbers, the caption fading (r1/19_b02_stiff_4.png). | Start the second press earlier (p2 4.3 → 3.8 s) or hold the first through 4.2 s, so the frame shows both bends and their numbers |
| S9 | M5 human scale, G5 honest | b02_stiff | PARTIAL | 45 µm against 9 µm of bend is given no human scale (about half a hair's width). The settled caption ties the 9 µm to "the low post-travel TechPowerUp praised on the GPX 2", but that review line ("low post-travel") is about the whole button's travel after the click, not a body bend of microns (r1 10; src b02_tpuGpx2). | Put the bend at human scale on the slide, and drop the GPX 2 tie or say what the review measured |
| S10 | M4 establish, then push in | b02_tensioner, b02_stiff | PARTIAL (low) | Both open on the part with only a 150 px locator, with no establishing shot of the simplified mouse with the part lit (r2/18_b02_tensioner_0, 19_b02_stiff_0). The critic accepted the locator for these two section views. | Integrator's call: accept, or add the kit's establish (0.4 s hold) before the section |
| S11 | F35.1 blue only for Theseus | b02_direct | PARTIAL | The classroom lawn mower draws its useful component in blue and "Only F cos θ moves it" in blue (r1 0.6 to 11). The same split in the loupe is ink. | Ink, as in the loupe |
| S12 | F35.1 blue only for Theseus | b10_cable | PARTIAL | In the "Sensor lift" panel the rival's lens marker is Theseus blue while "Most mice" is on screen (r1/89_b10_cable_0.6.png). | Ink or grey for the rival's lens; blue only once Theseus is on |
| S13 | F14.10, F35.1 red only for faults | b10_lights | PARTIAL, **fixed in the working source** | Live: Theseus's only light, the sensor, glows red (r1/90_b10_lights_12.png). The working source now draws it as a neutral glow, "Sensor, infrared / Both have it, unseen". | Publish the fix |
| S14 | F14.10, red on Theseus's side | b02_tensioner | Pending Brock (not a defect) | The reddest part at settle is Theseus's bridge crown (r1 11). This follows his own F18.6 ("scale to peak"); P2 has put the alternatives to him with a picture, and the critic withdrew R3-b02-1. | Wait for his answer |
| S15 | F35.1 yellow sparingly | b10_lights | PARTIAL (low) | The opening has three yellow LED glows plus three yellow numbers and two yellow labels (r1/90_b10_lights_0.6.png). | Could: keep the glows (they are lights) and set the three shares in ink |
| S16 | M6 payoff by about 8 s | b10_sealed | PARTIAL (low) | The payoff rows land at 8.6 to 9.3 s and "Few mice protect the board" at 9.6 s (settle 11), after the coated clock runs from 6.0 to 8.5 s (r2/86_b10_sealed_9.png). | Could: run the coated clock faster (to 7.5 s) and bring the payoff forward about 1 s |

> **P5 replies (14:10)** (build main-p5; errs in batches, qa settle + mid: clean on all of these):
> - S1 done: "350 mAh, 9 g" / "370 mAh, 8 g". S2 done: the scale note reads THS.massG (29.31 g).
> - S3 confirmed: the caption and the net give one figure, 33 h (floor of the difference). Energy for the weight is 144 → 171 Wh/kg: the rival rounded up, Theseus down.
> - S4 done (section 4). S7 and S11 done (section 2). S12 done (section 10).
> - S5 done: b03_side's panel heading is now "Classroom", so it clears "OpenStax §10.6". The door moved down (r[1] + 100), so its arrow no longer crosses the heading. S6 done: "Stabiliser wire" is an ink callout to [478, 552], sub "ties the two posts", off the blue readouts.
> - S8 done: b02_stiff's second press starts at 3.6 s and holds for 0.75 s, so the 40 % frame shows a press. S9 done: the caption gives 45 and 9 µm as fractions of a 0.07 mm hair (SCALE.hair, Ley 1999). The GPX 2 tie is dropped (b02_tpuGpx2 is out of src), and the foot line adds the hair's source.
> - S10: not in my list, unchanged. S13 confirmed: b10_lights' sensor glow is neutral, "Sensor, infrared / Both have it, unseen". S14: unchanged (main: the red crown stays).
> - S15 done: the three shares are in ink (C.ink2), with the glows kept. S16 done: b10_sealed's coated clock runs ×80, so the payoff lands about 1 s earlier.

Checked and clean on all eleven:
- G9: the header and the subject are on frame one (t = 0) of every slide (r2/g_t0_a.png, g_t0_b.png).
- Words: no "pts" or "points"; "khz" always lowercase ("1 khz"); no on-screen "cell" (b10_battery says "battery" throughout); no "grams" for the idea; no "might", "could" or "aims to" on screen.
- "Peak experienced stress (lower is better)": no peak-stress axis is in scope. b02_tensioner's key reads "Stress" and its margin is stated as "20.1× under the break".
- Skin: fingers and thumb are mono grey, never peach.
- No outline round Theseus's marks; gradients only in Theseus's type (drawn parts are shaded, not graded fills).
- Before → after is visible on all eleven (b10_sealed uses two rows, "14 to 62 s" against "None").
- The rival's fault is drawn before or beside the fix on all eleven.
- Whole-mouse views use mouseSimple for Theseus and mouseRival for rivals.
- Sources: research is named by source and year (DTU 2012, Yoo 2024, ACS 2023, OpenStax), derivations say "Derived", and Brock's figures carry no tag.
- No lattices in scope.
- The one-split seam is right on every top view (b02_rails, b03_side, b10_lights).

## Historical DONE items (brief §4) for the eleven

| Item | Slide | Verdict | Evidence / reason | Fix |
|---|---|---|---|---|
| F2.04 the bridge sets where and how easily it bends; less subtle; matters on a stiffer material | b02_tensioner (+ b02_stiff) | DONE | "Bends at the crown", "Half the bend in 2.0 mm" against 4.0, the bend curves, 7.7 against 26.9 gf to click, in a stiff PP-C-20A (r1 11, r2 5.6, 7.7) | None |
| F2.06 "Dual rail main clicks" better explained and visualised; POM pad thickness tunes the tolerance | b02_rails (pads: b02_pom) | PARTIAL | Name DONE; explained DONE. Visualised: PARTIAL (posts and pads hidden, §6). Pad thickness is b02_pom's slide; b02_rails' foot names "pads fitted in 0.05 mm steps (#28)". | As in §6 |
| F26.2 the second plunger exactly the same size as the switch's and the side button's (uniformity) | b02_rails, b03_side | PARTIAL | Same size in code on both; visible on b03_side; hidden under the fingertip on b02_rails (z_rails_settle.png) | As in §6 (the loupe) |
| F26.1, F28.2 an accurate tensioning mechanism from real mice: one-screw blocks, aligned, stripped down | b02_direct, b02_tensioner | DONE | The shared click section; "One screw" (r2/18_b02_tensioner_0.png) | None |
| F18.6 heat scaled to the hotter peak; one continuous band (fillets overruled by F27) | b02_tensioner | DONE | The key runs to 10.3 MPa, the hotter peak; block, bridge and riser are one band; square joints | None |
| F16.1 before → after, and the two overlaps it found on `arc` | b02_direct | DONE | 34.2 % struck → 0.0 %; no leader crosses "Turns about the crown"; no label under the switch drawing (r1 11) | None |
| F31.2 "6% sooner", with why not 20 % | b02_direct | DONE | The loupe line, the last caption, the foot line | None |
| F9.15, F14.3, F28.1, F30.18, F30.24, F12.7: the GT01 with standard SPDT internals, a flat tongue strip, round holes, a normal plunger, the render's silhouette, straight 0.70 mm walls, three pins | b02_card, b03_switch, b02_direct | DONE | r1/z_card_plunger.png; r1/22_b03_switch_12.png | None |
| F9.9 no magnetic clicks | the seven click slides | DONE | "Magnetic" appears only for the wheel | None |
| F31.1 Razer staff's "almost half", attributed only | b03_switch, b10_lights | DONE | Both print their own derivations (+15 %, +23 %, "about a fifth") | None (but see §3 for the answer's extra Logitech claim) |
| F31.3 POM everywhere | b02_rails, b03_side | DONE | In captions and tags | None |
| F9.16, F9.17, F12.4, F48.1: full-size SPDT side switches, 29.31 g with four, held by the shell, tied posts | b03_side | DONE | Tiles, callouts, the wire (r1 11) | None |
| F11.4 / F9.16 "no company has SPDT side buttons" | b03_side | SUPERSEDED (research, BROADCAST-0945) | Said truthfully in the foot line | None |
| F17.3 a 3D shot of the side switches in their glove | b03_side | Dropped on purpose | The glove is superseded (F48.1) and the film is 2D (F38.8) | None |
| F21.8 "battery", never "cell" | b10_battery | DONE | No on-screen "cell" | None |
| F27 magnetic encoder everywhere; F30.20 srf_encoder becomes "nothing lights up but the sensor", next to the web software (elc_sheet2 out); F2.19 and F12.13 superseded | b10_lights | DONE | §11 | None |
| F2.08 and F9.21 the encoder's look (optical encoders look like normal encoders, for rivals) | b10_lights | DONE (noted) | Theseus's encoder is the shared magnetic drawing. The rival's optical wheel appears only as a light-gate schematic (IR LED, slots, light sensor), not as an encoder body; acceptable for a mechanism view | None |
| The old `cable`'s idea #20: a Goldilocks cable thickness (the old slide: "1.9 mm still passes USB high speed ... thick enough to charge at full current") | b10_cable | **NOT DONE** | b10_cable lists idea 20 in `ideas`, but nothing on screen says it. The close-up draws Theseus's cable at 2.0 mm against "a 3 mm stock cable" and never says so. No other slide in the film carries #20 (grep). Content lost against "make sure you don't lose too much content". | Add one line to the close-up panel, e.g. "2 mm across: thin enough to lie flat and not tug a 29 g mouse, thick enough to charge at full speed", citing the old slide's XA25-class 1.9 mm (XBAB). Or drop 20 from `ideas` and say in the answers where it went. |
| The old `elecsheet1`'s #100 (a readable ON/OFF switch) | b10_sealed | Dropped on purpose | F29.3: the switch's place waits for the bottom cover; ship mode is on b10_charge | None |
| The old `cells`' charge-cycle and AA comparisons | b10_battery | Dropped on purpose | REVAMP limits the slide to the Li-ion against Li-po comparison his note asked for | None |
| F33.5 his important ideas (`arc`, `anchors`, `sidebuttons`) vastly improved, with more weight than the rest | b02_direct, b02_rails, b03_side | PARTIAL | b03_side DONE. b02_direct sells the player's gain weakly (§2). b02_rails hides its mechanism and never says "cheap" (§6). | As in §2 and §6 |

---

> **P5 (14:10):** idea #20 is now said on b10_cable's close-up (see section 10).

## Summary

Clause verdicts on Brock's notes (40 clauses over the eleven slides, counting the six notes moved onto b10_lights):

| DONE | PARTIAL | NOT DONE | OVERCLAIMED | SUPERSEDED |
|---|---|---|---|---|
| 32 | 3 | 0 | 3 | 2 |

- **OVERCLAIMED (3):**
  - b02_direct "demonstrated and sold better": the answer cites a "What you feel" panel and "no wear in the guide"; neither is on the slide.
  - b02_rails "sell the benefit ... feels cheap and causes more wear": the answer cites a "What you feel" panel, "the cheap feel" and "POM pads take the rub"; none is on the slide.
  - b03_switch "almost half (find quote)": the answer cites a Logitech "can reduce battery life" line; it is not on screen.
- **PARTIAL (3), all b02_rails:** the abstract visual, uniform posts and pads, and medium improvement. The posts and POM pads are hidden under the fingertip.
- **Clean slides:** b02_card, b02_tensioner, b02_stiff, b03_side, b10_battery, b10_sealed, b10_cable and b10_lights answer every clause of his notes.
- **Standing rules: 16 findings.**
  - NOT DONE (3): b10_battery's "·" dots; b10_battery's "29.3 g"; b03_side's classroom heading colliding with its source tag and with the door's red arrow.
  - PARTIAL (12), of which 2 are already fixed in the working source (b10_battery's 33 h / +30 h and its rounding; b10_lights' red sensor glow).
  - Pending Brock (1): b02_tensioner's red crown, under F18.6.
- **Historical DONE: 21 items checked.**
  - DONE (13); SUPERSEDED (1); dropped on purpose with a reason (3); PARTIAL (3: F2.06, F26.2, F33.5); NOT DONE (1: idea #20, the cable's Goldilocks thickness, which no slide now carries).
- **Working source at 13:19:** none of the OVERCLAIMED or PARTIAL clause findings is fixed yet.

Report: /home/claude/work/a1/AUDIT.md. Frames: /home/claude/work/a1/shots/r1/ and /home/claude/work/a1/shots/r2/.
