# Brock's feedback: the rolling list

Every piece of feedback Brock has given on the Theseus deck, in his words, with where it stands. It is kept for people
and for models: read it before working on the deck, and update it whenever feedback arrives or an item moves. Nothing is
deleted. An item that a later message changes is marked OVERRIDDEN and points to what replaced it.

**For a model picking this up:** STANDING items are rules for all future work. DECIDED items are Brock's answers and are
now rules too. Never follow an OVERRIDDEN item except where its replacement says so. Quote the item IDs in commits and
briefs. IDs are stable; new feedback gets the next section number.

Status words:
- **DONE**: in the deck and checked.
- **IN PROGRESS**: being built, with who is on it.
- **TODO**: not started.
- **OVERRIDDEN**: a later note replaced it; see the pointer.
- **DECIDED**: an answer to a question, now a rule.
- **STANDING**: a rule for all work, always in force.

Builders: clk = Clicks, gld = Glide, shl / shb / shc = Shell A / B / C, srf = Surface, elc = Electronics, own =
Ownership and Shape, ntr = Intro and close, r3d = 3D models. The integrator does deck-wide items in the shared code
(deck/src/01-core.js, 04-ui.js, 07-charts.js, 07-sim.js, 03-parts.js, 20-app.js).

Last updated: 2026-11-06 07:30 (Chicago).

## F34, F35. Brock's own steering given to Codex on 2026-11-05 (carried over; Codex's work itself is set aside, F38.4)
On 2026-11-05, out of Claude usage, Brock had Codex continue from this branch. On 2026-11-06 he called its output "very
poor and a step backwards on almost all fronts" (F38.4), so nothing Codex made is used. His own words to it are his
feedback on the deck, so they are kept here (numbered as on Codex's branch, codex/theseus-revamp-2026-11-05):
- **F34.1 STANDING** "all visual assets must be generated with code, with elegant motion design, no AI-generated images,
  and a human tone".
- **F34.5 STANDING** "the animations are currently the weakest area compared with Claude. Prioritize a substantive
  causal-motion pass, not static diagrams with decorative movement." (said to Codex about its own animations; the point
  stands: motion that performs the explanation, F38.3).
- **F34.6 PARTLY OVERRIDDEN by F35.1** "the presentation should be mostly black, grey/white, yellow, and a little red.
  Other vibrant colors made it less professional."
- **F35.1 DECIDED, STANDING (confirmed 2026-11-06, F38.5)** "you're using too much yellow, the primary color is blue for
  theseus, yellow for comparisons and secondary items". The stage, type and chapter labels are black, grey and white;
  red only for faults; no other vibrant chapter colours. Overrides F11.2 (the old chapter colours). **DONE in shared code:**
  every chapter accent is ink (01-core.js).
- (F36 and F37 on Codex's branch are about Codex's own preview site and an Astra experiment: not carried.)

## F38. The revamp, picked back up (2026-11-06 06:33 to 07:20)
- **F38.1** "pick back up with the revamp that was planned for yesterday before i ran out of usage / make sure you don't
  lose too much content, you should still have well over 100 slides, every animation should be vastly improved and more
  intuitive, make sure to recover all the context we had in the conversation in that link as to the revamp and everything
  else, rely heavily on my feedback document, double check that all archived feedback has actually been addressed / set
  the bar for this new presentation 10x higher than it was before". **IN PROGRESS:** the context recovered from the shared
  chat (yesterday's plan and briefs are in handoff/briefs/revamp-claude-2026-11-05/); REVAMP.md is the new film (104
  slides); handoff/revamp2/ holds the common brief (the 10x bar, M1 to M10), the builders' briefs and the kit brief.
- **F38.2 DECIDED** Slide count: "at least 100, play it by ear as you work as to what you think is necessary to be most
  effective, probably less than 120 slides though".
- **F38.3 STANDING** "every animation should be vastly improved and more intuitive": the motion standard in
  handoff/revamp2/common.md (M1 to M10: a demonstration, not a graphic; causal motion; the rival's fault then the fix under
  the same input; establish then push in; human scale; a hook in the first second and a payoff by about 8 s).
- **F38.4 DECIDED** "mostly ignore codex, the output was very poor and a step backwards on almost all fronts". The revamp
  works from Claude's last commit (7d8f926); Codex's branch stays on GitHub untouched.
- **F38.5 DECIDED** Palette: "Neutral + blue" (F35.1 over F11.2).
- **F38.6 STANDING** Usage: "this is an ultra account, it doesn't have 5 hour limits. i don't want you to worry about usage
  at all, i want you to be as thorough as possible, unless you're worried being inefficient with usage may result in a worse
  execution, again the bar for this presentation and how understandable and impactful it is is 10x higher than quality
  than the last one. i'd like you to check in often and post live updates you aren't drifting from what i want and you stay
  aligned". (F10.1's pacing is retired for this account; check-ins and live-link updates are standing.)
- **F38.7 STANDING** Audience: "it's mostly clips that will be used on social media and for parts of the website, but the
  flow between clips has to be extremely good, the organization has to be as interconnected as possible for the most
  invested of customers and investors that sit down and watch the whole thing, the pacing also has to be amazing to keep
  people invested for when they watch the whole thing". So every slide stands alone as a silent clip, the film is threaded
  (the compromise ledger, callbacks, hand-offs), and a clip mode and exporter are being built (F0b).
- **F38.8 DECIDED, STANDING** 3D: "mostly drop the 3d version, but don't delete its assets, as many of the 2d
  visualizations should be derived from 3d assets as possible to make sure they stay contestant, and then those assets are
  also usable for develope, when you do full shell designs they should be based of a mouse that is clearly slightly
  simplified as well and only showing the parts of the design that matter for the concept because your last full design
  wasn't really up to par and i dint want people to think the indicative of the end product".
- **F38.9** The reference photos: he re-sent all of them (19 images: tensioners, G-Wolves board and arm, Viper V3 / V4 Pro
  undersides, lattice bases, the Sora V2 board, top and side, the long-antenna Raytac module, the Razer FP-3 sensor, ARYE's
  sensor-position drawing, Apple's M1 bento). Kept in refs/photos/brock-2026-11-06/ (INDEX.md).

## F39. Keep evaluating; no flawed model reused; greys (2026-11-06 08:18)
- **F39.1 STANDING** "continually evaluate slides even after they are done to look for errors or things that could be made
  better so the watcher can learn better, understand at a glance better, or so that the slides are more convincing and flow
  better/inter connect better between eachother or in the most persuasive order". **IN PLACE:** a standing critic reviews
  every finished slide and the film's order (handoff/revamp2/critic-brief.md), findings in work/review/<builder>.md and
  FILM.md; builders act on them before a slide counts as finished.
- **F39.2 STANDING** "make sure no bad conventions are carried forward without thinking about them or flawed models are
  silently used again without evaluating them for errors first". **IN PLACE:** a model auditor (models-brief.md) and a rule
  in common.md that every reused model or convention is checked and recorded. Caught already: the old cutouts slide's "33.4 %
  sideways" was sin(lean), not a sideways share of the press.
- **F39.3 DONE** "some of the backgrounds i'm seeing still feel yellowish to me instead of gray, make sure that is resolved".
  Paper #F7F6F2 → #F5F5F7, both grey ramps neutral, the page CSS too, and a canvas guard that draws any warm-tinted grey as a
  true grey (01-core.js warmGuard). Measured: the paper ground was (247, 246, 242), now (245, 245, 247).

## F40. Answers on the player and the radio (2026-11-06 ~09:00)
- **F40.1 DECIDED** Autoplay hold after a slide settles: "Longer, 2–6 s". **IN PROGRESS (F0b).**
- **F40.2 DECIDED** Chapter openings: "advanced motion transitions" (not a pass through black). **IN PROGRESS (F0b):** a
  camera flight across the simplified mouse from the last chapter's part to the next, landing in the chapter card.
- **F40.3 DECIDED** Vertical clips: "allow for both letterboxed and the same as before as options" (horizontal and 9:16
  letterboxed exports both kept).
- **F40.4 DECIDED** The radio module: "Keep facing forward" (plan 5: at the board's rear, the long antenna facing forward,
  28.2 mm from the wheel's axle against 12.4 mm on the old board; no 180° turn, which would put it about 3 mm from the
  battery). Supersedes the old 180° turn (F9.13's aim is met by the move).

## Open with Brock

- **Pushing:** this branch (claude/review-notes-rework) can't be pushed from the session. GitHub answers "not in this
  session's authorized repository set". Enabling the repo for Claude (claude.ai Settings → Connectors → GitHub) fixes
  it. Until then the work reaches him as the live link and a patch.
- **Answered at 09:28 (F12):** the intro, clicks and Shell A questions. Only the tensioner's real dimensions are
  still open (F12.5).
- **SPDT:** F9.4 says "single pull double throw". The standard term is **single pole, double throw**, and the deck uses
  that.
- **Questions:** all answered on 2026-11-04, 21:47 to 22:15 (F21). Still to ask: the grip map, once he has seen the
  slides with all the feedback in (F21.9). For the next iteration: the side seam by the trigger cutout (F21.16), the PCB
  redesign (the power chip, the board's thickness: F21.11), simulations of the first fit and the re-screw (F21.3,
  F21.12), the tensioner's real size (F12.5, still unknown).
- **Answered from his own photo:** TTC's optical encoder has five pins (the 07:20 photo), so every drawing now has five.

---

## F0. Standing guidance from earlier sessions (2026-11-02 and 11-03, from HANDOFF.md)

- **F0.1 STANDING** 2D first; never a lazy or blobby mouse. Full-mouse profiles were rejected early.
- **F0.2 STANDING** A real 3D model built from his own scan of the Ninjutso Sora V2/V3 (the placeholder shape), plus his
  features. The Sora's top silhouette, simplified, is the generic mouse icon.
- **F0.3 STANDING, partly OVERRIDDEN** The look:
  - XBAB promotional material, the Kunai tester guide, and the earlier GI film's grid (plus marks, white and black
    transitions, chapter colours).
  - Uppercase display type, with mixed sizes and colours side by side.
  - Bigger type for phones.
  - XBAB light grey #F7F6F2, not tan.
  - Tags and colours have since been replaced: F7.3, F7.4, F11.2.
- **F0.4 STANDING** Content:
  - Every idea gets an animated visualization.
  - Anything already in shipping mice gets a "how Theseus goes a step further" beat.
  - As many competitor comparisons as possible: bars, XY plots with sweet spots, Pareto frontiers.
- **F0.5 STANDING** The corrections in research/validation-report-2026-11-03.md:
  - sensor naming;
  - Raytac AN54LM-20A;
  - nPM1300;
  - the Kim et al. CHI 2020 wording;
  - no SLX battery-hour rating;
  - the single-sided reflow wording.
- **F0.6 STANDING** Don't publish or commit the raw Sora scan (refs/scan).

## F1. 2026-11-04, first message

- **F1.1 DONE** "right now the 3d visualizations are broken in a lot of areas, and i want a setting to do 2d only for the
  presentation"
  - Done: the 3D fixes and the 2D mode (the 2D / 3D pill, `D`, `?2d=1`). See HANDOFF.md.

## F2. The 40+ review notes (2026-11-04, attachment)

- **F2.01 DONE** (`own_insert`: the second drive in plastic cuts a new thread, in brass it follows the same one, 85 % → 0 %; `own_life`: 98.6 % hold kept) "i need a slide on how metal threaded inserts increase longevity and increase chances of
  tolerances be correct when assembled the first time, show chances of getting tolerances right and chances of it
  feeling different after unscrewing it (it should be like a 90% chance for abs plastic, and slightly lower for carbon
  filled plastic, which be the other material you're comparing to)"
  - Decided: F3.3, F6.1.
- **F2.02 DONE** (`focus`: +26 pts sharper in the worst case, 0.2 against 0.4 mm) "the sensors window to focus is actually only 0.2mm optimally but you should talk about how
  most manufacturers only optimize for 0.4mm which can lead to issues"
- **F2.03 DONE** (`gld_camera`: just a camera; `gld_blur`: computed defocus, the phone camera analogy) "you effect show how the sensor works, and how it is just a camera, and show how the lens
  unfocuses just like a smartphone camera if it gets to close to a surface or too far away, i need a blurriness
  visualization"
- **F2.04 DONE** (`tensioner`, `clk_tenmat`) "the bridge click effect of controlling where the click bends needs to be a lot less
  subtle, the point of the bridge is not only to control where the force bends, but how easily and this is particularly
  important on a stiffer material"
- **F2.05 DONE in shared code, IN PROGRESS per slide (all)** "the vocab and research source needs to be integrated into
  each slide, they shouldn't be in the same place every time, you also need nedd to mix and match the asset placement
  between slides so it doesn't feel repetitive, considered rounded boxes with padding and golden ratios"
  - Shared helpers: glossBox, sourceBox, golden(), bento().
  - The boxes are now barely rounded, per F9.19.
- **F2.06 DONE** (`anchors`, now "Dual rail main clicks"; `clk_pomtune`) "the dual rail main clicks needs to be better explained and visualized (right now you're
  calling it something with anchors) also explain how the pom pad thickness allows for easy factory tolerance
  modification and perfection"
- **F2.07 DONE as changed by F9.16** (`sidebuttons`) "the side button on rails slide (which should just be called dual rail
  side buttons should show the mini microswitch being used as as support by 2 additional arms as well to keep the
  button from bending in too far"
  - Now full-size SPDT switches with a glove (F9.16).
- **F2.08 DONE** (3D: TTC-style optical encoder, ISO screws, a knurled insert; 2D: `srf_encoder`, and `ownscrew`, `own_insert` and `own_life` drawn from the 3D model's exact head, recess, thread and insert) "the encoder and screws need a massive revamp to look proper"
  - Encoder form: F9.21.
- **F2.09 DONE** (`shlThin`, `shlShell3d`, `shlLattice3d`, and the meter strip through the chapter) "id like you to elaborate more and do more animations on how triangles are more helpful on a
  lower weight mouse. throughout all the strength increases from industry standards i'd like to see a bar of flex or
  strength to weight dropping"
  - This is the shell meter (10-d-0-meter.js); its baseline is F6.4.
- **F2.10 DONE** (`shlHotspot`, `shlMargin`, `shlWork`: 18 / 25 / 90 % of the grams work) "i'd also like you to better show of my concept of a lightweight mouse being able to be
  stronger than heavier one by more optimally spreading force and using force among the material it has, demonstrate
  how solid or flat planes have a propensity to build up hotspots and have once breakage point that wastes the rest of
  the material, have a visualization of the amount of grams of material a force applied to a mouse will actually act
  on depending on how optimized the structure is at dispersing force"
- **F2.11 DONE** (`shlPick`, then `shlNoPick`: the question types alone and rises into the title) "show how most mice make you pick between strength and weight, when that shouldn't have to
  be the case. follow that up with a "what if you didn't have to pick…" but find a good transition"
- **F2.12 DONE** (Shells A, B and C) "show more force distribution animations, i think those will be really helpful"
  - Built on 07-sim.js (feFlow, feDraw).
- **F2.13 DONE** (`srf_texture`: 7 µm fibres in PP-C-20A, the blasted profile and the 19 µm film levelling over it, to scale) "improve how the texture of the cerakote looks and make the fibers look more accurate"
- **F2.14 DONE** (`grip`: the fingertip drag and the polar plot, +26 %; `srf_gripmap`: a laser-etched zone for each job, −57 % squeeze to lift) "visualize and show cerakote can be laser etched in different shapes and spacings to create
  grip in exactly the right places in exactly the right directions, curation that grip tape doesn't allow for, because
  you need extra grip in a specific direction everywhere on the mouse, while allowing mobility in every other
  direction"
- **F2.15 DONE** (`srf_tape`: 0.5 mm tape on glue against the 19 µm coat, aged six months; 0 adhesive) "show how this is the solid state solution that doesn't need adhesives that wear down over
  time or collect gunk"
- **F2.16 DONE** (`shbArches`: arches drawn as continuous lines, triangles where they cross; `shbDome`: geodesic domes, the HI-SEAS Mars missions) "talk about how triangles from continuous lines (and therefore arches in dome shape like a
  mouse, show nasa mars base triangle domes) right now the presentation shows triangulated arches/ triangles forming
  arches, when it should show interwoven arches forming triangles)"
- **F2.17 DONE** (`shbFibres`: Krenchel's curve, Choi 2024 1.7×, Hexcel 33×) "show how these continuous lines particularly increase strength for materials filled with
  fibers, because fiber alignments is extremely important (bring up specific research on how high the potential
  strength increases are)"
- **F2.18 DONE** (`shbFlow`: a melt-flow simulation, sharp against filleted; `shbGates`: gating, rib width, fillets) "show a fluid simulation of how a filleted lattice helps sign fibers (if there is anything
  else that can be down to the lattice to better align it show it)"
- **F2.19 DONE** (`sealed`: "The encoder: the number one failure point") "talk about how no dust getting in the encoder is particularly important given the fact
  that the encoder is the number one failure point in a mouse"
- **F2.20 DONE** (`shbSides`: the flat low sides take the peak; a thicker band and the thumb rest) "show how the left and right sides of the mouse near the bottom being flatter and less
  arched, and how that means extra design intent has to be spent to make the lattice thicker in those wasted, as well as
  possibly specifically where the thumb rests"
- **F2.21 DONE** (`srf_twotone`: the second tone etched out of the first, 3 → 1 layers; a scuff chips the painted layers) "talk about how the cerakote etching lets us do 2 tone designs without having to worry about
  a second coat adding weight or coming off (as seen in the finalmouse prophecy series)"
- **F2.22 DONE** (`srf_weight`: blast then coat, a balance ends level, +0.49 → ≈0 g) "talk about how cerakote is film thin and is the only coating that doesn't add weight because
  the sandblasting process blasts off almost as much as it adds"
- **F2.23 DONE** (`srf_uv`: a UV chamber, 1,000 h, and what each maker publishes) "talk about how with most coatings it's very hard to tell if they will yellow over time, but
  cerakote is by far one of the safest because of its industry leading chemical and uv resistance (like how the ulx
  pros yellowed)"
- **F2.24 DONE** (`shbPress`: arch against flat plate, 21× stiffer, the plate cracks at 12 N, the arch holds to 45 N; `shbThrust`; `shbBend`) "i need an elaborate and in depth force simulation, bending simulation and and text
  explanation of why/how arches are so strong, as well as a comparison to flat planes"
- **F2.25 DONE** (`shbMill`: one cutter pass at 0.6 mm fillets; `shbTol`: 19× looser tolerance) "talk and visually about how the filets making milling the mold easier and reduce the
  tightest tolerance"
- **F2.26 DONE** (`shlPcbRib`: 1.8× stronger than magnesium at the same weight; `shcCarry`: 19 % of the weight already carried; `shcArms`: 18× lower peak than small arms, which snap) "i feel like the pcb being used as a reinforcement isn't demonstrated enough. i want to talk
  about how unexpectedly strong fr4 is (compared to even magnesium alloy directly). why in engineering it is so important
  to draw on all the resources you have access too. and how many mice just use small arms of fr4 to reinforce the pcb
  which are easy to break of or snap under force, but how we plan to use THE WHOLE PCB."
  - Decided: F6.3.
- **F2.27 DONE** (Intro, Shell A, Electronics) "also dont worry about weight compared to the xa25, i have that covered, we will be
  able to cut weight elsewhere with my shell design to hit that 200hr"
- **F2.28 DONE** (`ntr_stats`, "Theseus, by the numbers") "after the comparisons, i think our solution needs a stats slide of their own with a bunch of
  important numbers on big fonts that tick up with an animation, maybe sometimes the "next best" is in a smaller lore
  darker font"
  - Done: `ntr_stats`, "Theseus, by the numbers", a bento whose tiles count up, with the next best smaller, darker and
    in yellow, with its source. Shared helper: statTile with `next` (now with `next.ev` / `next.by` / `next.src`).
- **F2.29 DONE** (shared code, 3D, and `elc_oneside`: one board, one side, one reflow, 5.6 g) "we don't have a front and back pcb," / "it'll be a
  single ~5.6g pcb."
  - Shared constant: THS.pcb.
- **F2.30 DONE** "the price for the mouse is $189"
  - Shared constant: THS.price.
- **F2.31 OVERRIDDEN by F7.10** "the main accent color could be red first, before yellow"
- **F2.32 DONE in shared code, IN PROGRESS per slide (all)** "the more specific weight if the mouse should be 29.31g"
  - Shared constant: THS.mass.
- **F2.33 DONE** "i don't like the crosshair/scope symbol you're using in the top left"
  - Replaced by a small mouse outline (F3.4).
- **F2.34 DONE** "the pareto frontier line should be rounded instead of a stair step"
  - Done with monoCurve in scatter().
- **F2.35 DONE** "the rounded bubbles with a dot feel very ai generated, you need to find an alternative design, i'll
  attach a picture for a design element style you could use instead, as well as in other places too,"
  - Tags are type now (F7.3, F9.5).
- **F2.36 DONE in shared code, IN PROGRESS per slide (all)** "separation in the presentation needs to be vastly improved,
  thing are way to cranped by default and this is an animation for reason, you can't be afraid of black space"
- **F2.37 DONE** (`lattice`: whole cells, nothing sticks out; `shlDeterminate`) "it really bothers me that there's one line on the right that sticks way out into no mans
  land on the hexagon flexing animation, you need to polish that animation more as well as make an accompanying
  animation to show how hexagons distribute force versus triangles, talk about then being statically determinant"
- **F2.38 DONE** (`elc_tear`: 200× the pull; `elc_twist`: −36 dB noise; `elc_lay`; `elc_flex`: 2.5× less strain) "show a simulation benefit of the and statistic of braiding the wires"
  - The benefits to show: F3.6.
- **F2.39 STANDING, IN PROGRESS (all)** "whenever there is a simulation it needs to be given lots of screen real estate
  those are very convincing and a lot of work goes into them"
- **F2.40 DONE** (`mass`, rethought: −93 % twist, the centre of mass drops onto the grip line) "the keeping the mass low near the fingers slide needs to be revamped to be much better and
  make a better argument/be more intuitive"
- **F2.41 STANDING, IN PROGRESS (all)** "make sure no assets overlap where they shouldn't"
- **F2.42 DONE** (the dongle slide is gone) "remove any slides about the dongle as i'm unsure if i want to do the side arm system or not"
- **F2.43 STANDING, IN PROGRESS (all)** "i like the animations where you show the mouse cursor moving things"
  - Shared helper: cursorAt.
- **F2.44 DONE** (`shp_newton`, "Newtonian shape analysis"), **STANDING for titles (all)** "i want you to specifically mention newtonian shape analysis, i'm
  not a fan of how the titles of the slides seem to beat around the bush if the concept names"
- **F2.45 DONE** "the most important specification isn't weight, it's density, which is calculated by taking
  length x width x height in millimeters and dividing by density in grams (or maybe the other way around, look at how
  pwnage doesn't and reference their research) also have a slide or slides explaining WHY density is much more
  important than shear weight"
  - Decided: F6.2.
  - Done:
    - `ntr_density`, "Density, not weight": the box, and 29.31 g ÷ 278.6 cm³ = 0.105 g/cm³, Pwnage's way.
    - `ntr_sizewt`, "The size–weight illusion": why density beats weight.
    - `ntr_densrank`, "Ranked by density": how the ranking changes.

## F3. Answers to the first questions (2026-11-04, ~04:00)

- **F3.1 OVERRIDDEN by F7.10** Accent: "Red is Theseus, yellow 2nd".
- **F3.2 OVERRIDDEN by F7.3** Tags: "I'll send the picture" (the lower-third, F4).
- **F3.3 DECIDED, changed by F6.1** Inserts: "Yes, and research inserts".
  - 90 % for ABS, a bit lower for carbon-filled, both screwed straight in, as his estimate.
  - Brass insert figures come from published tests.
- **F3.4 DONE** Top-left mark: "Small mouse outline".
- **F3.5 OVERRIDDEN by F9.16** Side buttons: "two arms that act as an end stop and reduce flex".
  - The arms now belong to the glove over a full-size switch.
- **F3.6 DECIDED** Braided wires: show "Won't tear like ribbon", "Less radio noise" and "Flex life".

## F4. The lower-third picture (2026-11-04, ~04:00)

- **F4.1 OVERRIDDEN by F7.3** "here is the picture i meant to attach / ask any more questions you think could improve your
  execution"
  - The picture: a sharp outlined box with caps, joined to a solid value block.

## F5. 2026-11-04 04:05

- **F5.1 STANDING (big type), refined by F9.8** "you don't have to change the font, i just like the outline and box
  design in the reference picture" / "i quite like the font we have right now"
  - The display fonts are kept: Inter Display and Inter.

## F6. Answers to the second questions (2026-11-04, ~04:40)

- **F6.1 DECIDED** Inserts: his 90 % is the chance the joint **feels different after it is unscrewed and screwed back**,
  for ABS. Carbon-filled is "a bit lower": 85 %, his estimate.
- **F6.2 OVERRIDDEN by F12.11** Density: use the Ninjutso Sora V2's L × W × H for Theseus, labelled a placeholder.
- **F6.3 DECIDED** FR4 arms: "All G Wolves mice, I even had the arms on an HTS Ultra break during shipping once".
- **F6.4 DECIDED** The shell meter's baseline: a plain thin wall (no ribbing) at the same mass.

## F7. 2026-11-04 04:52: the Apple direction (with four keynote slides)

- **F7.1 STANDING** "make sure to keep working after your compactions"
- **F7.2 DONE in shared code, IN PROGRESS per slide** "from the slides i'm seeing the visual quality took a massive step
  backwards, i don't like the new super straight aesthetic"
- **F7.3 DONE** "i don't think the david crowley style boxes are a good fit, but i also don't think the old pill ones with a
  dot were good either"
  - Tags are type now.
- **F7.4 DONE, refined by F8.1 and F11.2** "i don't like the new colors you've chosen, the old ones were better, if you're
  gonna go in any new direction, go in the apple direction, but don't stray too far from the primary color scheme colors
  we chose originally"
- **F7.5 DONE in shared code, IN PROGRESS per slide** "i'm attaching some references to apple keynote i really like that do
  spacing well, we can't do slides like there's every slide, we need to combine our old style and what they have if
  anything so we can show a little bit more data than them and give ample screen space to the simulations"
  - Shared: bento(), statTile(), DESIGN.md §0.
- **F7.6 DONE, refined by F8.1** "i like how apples does subtle gradients a lot"
- **F7.7 STANDING, IN PROGRESS (all)** "and can get very far with showing quite little of the actual product in the slides,
  usually zoomed in pretty and abstract visualizations of the specific part in question"
- **F7.8 DONE** "research how apple does the graphic design of its keynotes"
  - Notes: research/apple-keynote-design.md.
- **F7.9 STANDING** "remember the colors need to be vibrate like the old ones and we need LOTS of premium motion design"
- **F7.10 DECIDED (F11.1)** "i also think blue should be the main theseus color after some thought red makes it seem like
  it's bad, and we can't do green because razer is green"
- **F7.11 STANDING** "don't forget to do every task from my original 40+ pieces of feedback, this is just me steering you
  more in the right direction"

## F8. 2026-11-04 05:12

- **F8.1 DONE in shared code, STANDING** "gradients make the most sense in the font, you need to use them everywhere else
  very sparingly other than where they are resided so the presentation doesn't look too vibe coded"
  - Gradients appear only on Theseus's big numbers and name.
  - Tiles, bars, marks, the stage and transitions are flat.

## F9. 2026-11-04 07:20 (with eight photos)

- **F9.1 STANDING** "continue on everything you were working on, but i have some more notes"
- **F9.2 DONE** "i don't like when tiles have the same color outline as there font color, that looks bad"
  - Theseus's tile has no outline.
- **F9.3 DONE (F11.2)** "orange was not a proposed color and the green you used looks bad"
  - There is no orange, glide's green is gone, and evidence tags are grey.
- **F9.4 DONE** (`clk_spdt`) "the presentation needs to explain than spdt means "single pull double throw" in big letters
  and demonstrate what that means with an animation"
  - The term is single pole, double throw.
- **F9.5 DONE in shared code, STANDING** "i dislike it when you separate words/concepts with a dot, not everything needs a
  source, especially when comes from me it looks odd, prioritize only sources where they are most needed/moving"
  - No dots, and his own figures carry no tag.
- **F9.6 DONE in shared code, IN PROGRESS per slide** "some less important specs don't need a gradient or color in the
  tiles, they can just be black on gray, juxtaposition is important, not everything can scream at you"
  - Shared: statTile `quiet`.
- **F9.7 DONE** "when it's research you don't need to say it's research, you can just say like Zaunkoenig and then 2018 in
  bold, i'd imagine only derivations need a disclaimer"
  - Shared: sourceBox.
- **F9.8 DONE in shared code** "use more apple style fonts, without looking vibe coded, or big and bold fonts look good
  right now, but the smaller skinnier ones look unprofessional"
  - Small type is Inter, and nothing at small sizes is lighter than 560.
- **F9.9 DONE in clicks (`magbuttons` and the analog chart are gone); other chapters are checked at integration** "remove anything about magnetic clicks for now, focus on the advantages of spdt. i am
  unsure if i am doing magnetic clicks"
- **F9.10 DONE in shared code, STANDING** "i dislike when you outline the primary selected color in black for graphs and
  things, it looks particularly bad in all the old slides where you outlined the yellow in black, i don't know what it
  looks like on the new colors yet but i'm assume it just won't look minimal enough"
- **F9.11 DONE** "the form the first slide is in what i attached is very good, i dont want it to stray much
  more than how it looks right now other than the actual content (i dont like the current form of the 2d mouse, it should
  be removed, and the numbers and text my change)"
- **F9.12 DECIDED (F11.1)** "maybe you should let me choose between red, blue or yellow for the primary Theseus color"
- **F9.13 DONE** (3D, and `antenna`: the pointer turns the module 180°, 1.8× further from the wheel) "the raytac module needs to be flipped so it's further from the scroll wheels metal, and
  id lowk you to use the long antenna design i've attached"
- **F9.14 DONE** (3D, and 2D on `gld_camera` and `gld_module`) "the sensor and snap on lens are both not as accurate as id like, you need to squeak out
  a lot more accuracy using the images i've attached"
- **F9.15 DONE in 3D (standard SPDT internals in the rotating housing); the 2D redraw is F14.3 (fixA)** "the internals on the gt01 switch are not right and it bothers me, before the old switch
  visualization was a lot more detailed, you should've used the same level of detail and accuracy on the gt01 switch. the
  gt01 switch is literally just a normal SPDT switch with a special bottom housing to rotate it. if you can i'd prefer the
  switch be even MORE detailed than the previous best."
- **F9.16 DONE** (`sidebuttons`: a glove over a full-size SPDT switch; "0 mice ship SPDT side buttons") "for the side buttons i want to use full size spdt microswitch as well (not miniature
  microswitches), this means our dual rail mechanism can be a glove that fits over the microswitch and gives us 2x the
  amount of practice to get the tolerancing right in the dual rail mechanism, and means we don't have to tolerance 2
  separate dual rail mechanism, advertise this and how no company has spdt side buttons yet"
  - F11.4: state it.
- **F9.17 DONE** (`sidebuttons`: "29.31 g with four full-size switches") "using full size microswitches on the side buttons should be explained as a testament of how
  we have good weights without compromising ANYTHING to achieve that weight"
- **F9.18 DONE** "fix the background grid spacing so it doesn't align improperly with the apple grid tile spacing"
  - Bento tiles snap to the 40 px grid with a 40 px gutter.
- **F9.19 DONE** "the tiles need to be significantly less rounded or not rounded at all so we can maintain cohesive and
  unique design language"
  - Radius 6.
- **F9.20 DONE** (`gld_sag`: 0 µm lens drop with the sensor dots, 150 → 0 µm; `dots`) "we need to talk about the importance of having one or 2 dot skates by the sensor to prevent
  sag and keeping the sensor focused correctly"
- **F9.21 DONE** (the shared 2D drawing `encoderMM` in TTC's form, `sealed`, 3D, and `srf_encoder`: the face plate cut away, the light gate magnified) "the encoder you are using is wrong, optical encoders look no different than normal mouse
  encoders, i've attached picture of what the interior looks of an modern mouse optical encoder is like, usually they're
  a little taller than that though"
- **F9.22 STANDING** "again this is just me giving you more guidance, do not abandon any of my old guidance unless i've
  intentionally overwritten it"
- **F9.23 DONE** (Shells A, B and C, and the heat scale) "you need to better explain how lower peak force hotspots are
  better, and peak force areas should also be colored in red so the viewer knows they're bad. show the risk of breakage.
  this should tie in with a lot of the other advice i've given you, you should try to make as many concepts tie together
  as possible"
- **F9.24 DONE** (shared code and every chapter: skin is grey or a white print outline, never peach) "i dislike anywhere where you use peach tones, especially if it's
  depicting skin (it's hard to tell) skin tones should always been mono tone"
- **F9.25 DONE** (3D and `elc_module`) "i'd like you to modify the way the raytac module looks, it should be black instead of
  blue"
- **F9.26 DONE** (zerograms argues it from F = m·a) "it feels like you're arguing against me when you say that there's no research to support zero
  grams is actually the optimal weight, it is well known in the enthusiast community that less weight feels better because
  f=ma, so mass means less inertia means quicker target switching when changing directions, there should also be other
  theories that are all but proven, the inertia thing means it should be objective easier to switch targets, even though
  there isn't a study to prove it, it feels pretty solid to me"
- **F9.27 DONE in 2D everywhere so far (feDraw fillet; Shells A, B, C, the plate); the 3D lattice insert is still a stand-in** "we have slides about the
  importance of filleting the lattice, but none of the lattices in our visualizations other than those slides are
  filleted, this is an issue"
- **F9.28 DONE** (the shared key plan, clicks, and the 3D shell's one seam) "we talk about how it's better to have 1 seam in our slides
  in front of the scroll wheel, but then all the visualizations show 2 seams, the seam shouldn't separate at the scroll
  wheel, our seam shouldn't shouldn't change from the sora"
  - F11.3.
- **F9.29 STANDING, IN PROGRESS (all)** "unless there is strong opposition you should be trying to sell something with me
  here, you feel very wishy washy in a lot of your text"

## F10. 2026-11-04 07:29

- **F10.1 STANDING** "make sure to pace yourself so you don't chew through your 5 hour limits in less than 5 hours, but DO
  NOT sacrifice thoroughness or projected agent intelligence or strength, if you have to make compromises, compromise on
  speed"
  - Two or three builders run at a time, on the same model.
- **F10.2 DONE, STANDING** (the live link, republished at each integration; v14 at 20:5x) "i'd also like you go back to giving me a live link that you update so i can see the progress
  updates often as soon as you make them"
  - The link: https://claude.ai/artifact/HH8yRD9aYxCvvgcT1jUkyv, republished as work lands.
- **F10.3 DONE (this file), STANDING** "you should have a rolling list of all the feedback i've given you somewhere in the
  github, its status on how much you've addressed it and whether or not it's still relevant/been overridden" / "this list
  should be readable for both humans and llms, i want this so you don't forget about anything i've told you in any of my
  messages"
  - On branch claude/review-notes-rework. Pushing it needs the repo enabled for the session (see "Open with Brock").
- **F10.4 STANDING** "if you have any questions to improve your execution you should ask them as well"

## F11. Answers to the third questions (2026-11-04 07:35)

- **F11.1 DECIDED** Theseus's colour: **blue**. The next best is yellow and problems are red.
- **F11.2 DECIDED** Chapter colours: **the old set**.
  - Shell purple, surface pink, electronics cyan, shape olive, ownership slate.
  - Clicks (blue, now Theseus's) and glide (green, out) are neutral.
- **F11.3 DECIDED** The seam: "it forks which it shouldn't, it has a center strip, which it shouldn't".
  - One split runs from the nose to the rear seam, with the wheel sitting in it, as on the Sora.
- **F11.4 DECIDED** "No company has SPDT side buttons yet": "I've checked, state it".

## F12. 2026-11-04 09:28 (answers, new notes, six reference photos of mouse bases)

Answers to the intro and clicks questions:
- **F12.1 DECIDED** "yes, that 5.6g includes everything": the board's 5.6 g includes the radio module, PMIC, antenna and
  USB-C.
- **F12.2 DECIDED** "the 3d mode should not show the shell cover". Asked whether that covers the close too: "Cover and
  close". **DONE:** neither slide shows a shell in 3D mode.
- **F12.3 DONE** (`ntr_densrank`: the XA25 ghost row, "Wired: not ranked") "yes density should be ranked among wireless mice only, show the xa25 but shoe it not be taken into
  account for be wired". **DONE:** `ntr_densrank` shows the XA25 above the density column, wired and not ranked.
- **F12.4 DONE** (`sidebuttons`: "Held by the shell: no side board") "the shell holds the switched instead of a pcb". **DONE:** the full-size side switches are
  held by the shell, not by a side board.
- **F12.5 OPEN** The tensioner's real width, span and crown: "unknown yet". The slide keeps its labelled example.
- **F12.6 DONE** "abandon idea #59". **DONE:** #59 is on no slide (and K1 was reminded at 04:20).
- **F12.7 DONE** (3D and 2D) The GT01: "it looks fine besides the fact that everywhere you draw it looks like there's a 4
  extra pin in the front and that's not right".

New notes:
- **F12.8 STANDING** "in the future use the question tool to ask me questions instead of doing it the old fashioned way"
- **F12.9 DONE in 3D and the shared key plan (one straight line at the Sora smile's deepest point: KEY.seam −4.84), and in the 2D cutouts drawing** "right now the rear trigger cutouts have a sort of notch in both
  visualizations instead of being an entirely straight line, which looks funny, also the straight light version needs
  to go back future"
  - Asked how far back: "To the smile's deepest point", level with the deepest point of the Sora V2's curved cutout.
- **F12.10 DONE** (`pltPlate`, `pltSim`, `shlsheet2`; 3D: a solid skin outside, X struts and a frequency-3 triangle lattice inside; v3: 4.4× stiffer than a solid plate of the same weight; against a plain grid 14 % less flex at the lens, 29 % lower peak, see F20.3) "the optional bottom plate has big holes instead of tiny triangle
  lattices, i've attached some reference designs for you to try to come up with your own design, i like the X style
  designs, but they have to form triangles" / "the big cutouts have high walls on ther edges and are reinforced by
  triangles on their underside" / "i want something that fits the arches and triangles, is as strung as possible, but
  it also beautiful and geometric"
  - Asked what fills the spaces between the struts: "a fine triangle lattice, but you can only see it looking from inside
    the shell, on the outside it should look solid. also the bottom should be solid with no holes (even before mylar)
    for a similar size of skates as the viper v4 pro uses".
  - The references: ARYE FCC-1 FE, Xlite, Pulsar X2H, WLmouse Beast Mini, WLmouse Beast X V2, and two honeycomb bases.
- **F12.11 DECIDED** "also the dimensions of theseus will be 119.3 x 62.4 x 39.9". Asked whether to resize the 3D shell:
  "Use the numbers only".
  - The scanned shape stays.
  - Density and specs use 119.3 × 62.4 × 39.9 mm, which is 297.0 cm³ and 0.099 g/cm³.
  - **DONE** in the shared constants (`THESEUS.dims`, `THS.dims`) and the intro's density slides.

Answers to the Shell A questions:
- **F12.12 DECIDED** "tensile strength": the shell counts as broken at 120 MPa.
- **F12.13 DECIDED** "cite the finalmouse support staff" for "the encoder is the number one failure point". **DONE**
  (`sealed`).

## F13. Answers to the Shell B questions (2026-11-04 ~10:20)

- **F13.1 DECIDED** The strength bar on the arch and fibre slides. First answer: "i'm confused what you're asking".
  Asked again more plainly: "Show it, holding".
  - The strip appears on those slides at the triangle lattice's value. The arch is already inside that number, because
    it's the same dome.
  - **DONE.**
- **F13.2 DECIDED** How the mold is made: "Not decided yet". **DONE:** `shbMill` (EDM) and a new `shbMillDirect`
  (a milled core) both carry the fillet's advantage.
- **F13.3 DECIDED** Where the gate goes: "decide where you think is optimal". **DONE:** `shbGates` puts one gate inside under the
  crown, from the fill model: no weld line, the shortest flow, and fibres along the arches.
- **F13.4 DECIDED** The thumb band: "Both sides". **DONE** (`shbSides`).

## F14. 2026-11-04 10:17 (with three Gateron GT01 images), and answers to the questions after it

- **F14.1 DONE** (3D and `gld_under`: wide front and back pills and a ring; plate off, two dots per corner plus two by the lens) "when you start on the bottom plate the 2 dot skates should join together to form a pill shape,
  not 2 independent circles like they do now, and without the bottom plate, there should only be be ledge to fit the 8
  dot skates"
  - Asked what the skates are with the plate on: "Pills + sensor ring". That means a front pill and a back pill,
    mirrored, plus a ring round the sensor.
  - Asked where the dots sit with the plate off: "2 each corner, 1 or 2 on the sensor 9 or 10 total". They sit on a
    ledge on the shell rim.
- **F14.2 DONE** (pills at z ±44.8, mirrored) "the front and the back skate pills should be a direct mirror, one shouldn't be more towards the
  center than the other"
- **F14.3 DONE** (2D redrawn; 3D tongue now a flat strip, side holes full circles) "your gt01 bottom housing design was wrong, which is confusing because you used it on the
  cover of the clicks section, please try to get more accurate with the pictures i've attached, also the current gt01
  has this weird noodle design on its interior which is not actuate, make sure you model the metal leaf as close as you
  can get it, i've given you multiple angles. another issue you had was the plunger looking like it was turned vertical
  or being tuned into a square for some reason when the gt01 has a fairly normal plunger"
- **F14.4 DONE** (a procedural woven cloth, crisp at any size) "the image you used for the mousepad in how the sensor looks feels really low quality and uncanny"
- **F14.5 DONE** (`shlPick`: "The strength–weight fallacy"; `shlNoPick` answers "You don't", −51 % flex) "what if you didn't have to chose shouldn't be the only words in the slide, and you should call
  the slide before that one "strength weight fallacy" or something like that (just say fallacy at least to allude to a
  correction coming)"
- **F14.6 DONE** (`shlSpecific`: six materials ranked five ways; PP-C-20A goes 4th → 1st for a thin shell) "i think we need a slide dedicated to specific strength and specific stiffness to show the sort of
  "value/efficiency" each material buys and how it's not just about who has the highest tensile strength or flexural
  modulus"
  - Asked which materials: "ABS and PC, Magnesium alloy, Aluminium and FR4", against PP-C-20A.
- **F14.7 DONE** "title one of the slides "putting that weight to work" there's a title that is close to that
  right now, but what i've typed here is better"
  - This is `shlWork`, "The grams that work".
- **F14.8 STANDING, DONE in every chapter** (each builder labelled its stress axes; the final review checks every slide) "i think for peak stress you should put(lower is better) because it still feels
  unintuitive, maybe you say peak EXPERIENCED stress as well"
  - The label is "Peak experienced stress (lower is better)".
- **F14.9 STANDING, DONE in every chapter** (the final review checks every slide) "sometimes you say "grams" where you should say "weight""
- **F14.10 STANDING, DONE in every chapter; the plate's flex is being re-tuned so it wins at a glance** (the final review checks every slide) "in general i think youre not really doing the best at showing how are
  techniques are better AT A GLANCE, and by how much, you shouldn't have to read the whole slide to understand why our
  methods are better, and if at a glance it can look like our methods add worse that is very dangerous, not everyone is
  going to have time to read the full thing, there eyes are going to get drawn to certain parts each slide. making sure
  the reader / watcher understands why/how/by how much only we're better only AT A GLANCE is EXTREMELY important"
  - Asked what each comparison slide should lead with: "Both". That means a huge headline number in Theseus blue (for
    example 21× STIFFER), plus a chart where Theseus visibly wins, with which way is better written on it.
- **F14.11** "do you have any more questions for me?" Answered with the four questions above.

## F15. 2026-11-04 10:24

- **F15.1 STANDING, TODO (fixA, fixB, all)** "in order to make the reader/viewer understand immediately at a glance what is better, you may have to completely reformat/rethink some slides and visualizations"
  - Applies to F14.10: a slide that can't read at a glance gets rethought, not patched.

## F16. 2026-11-04 10:30 (with a screenshot of `arc`, Direct Drive Actuation)

- **F16.1 STANDING, DONE in every chapter** (the final review checks every slide) "in slides like this where you count down to zero, it's very hard to remember
  what the original numbers were and how much better they are now, you should find some way to always show the net
  change or the bad case at the same time"
  - Asked how: "Before → after". The bad value stays visible, greyed or struck, beside the live one (10.6° → 0°), with
    the net change in Theseus's colour.
  - The screenshot also shows two overlaps on `arc`: a leader runs through "The trigger turns about this bend", and
    "Sideways, sin θ" sits under the switch drawing. **DONE.**
- **F16.2 DONE** (the "rate" pill in the player bar: 1 to 10 and a note per slide, saved in the artifact's database, which only Brock and editors can write) Asked about the deck's length (126 slides): "add a feature where i can rank each slides
  value 1 to 10 (10 being the best) so you can decide how to condense the slides and which information is safest to
  cut, these ratings shouldn't help determine slides to cut, but instead information"
- **F16.3 DECIDED** Which chapter goes first after 12:00: "Glide". Shell C runs too.
- **F16.4** "i can't fix the github thing right now". The branch stays local, and the live link and patch carry the
  work.

## F17. Answers to the 3D builder's questions (2026-11-04 ~11:00)

- **F17.1 DONE** The Raytac part: "AN54LM-20A, long antenna". The name is kept, and the long meander antenna is drawn.
- **F17.2 NEXT ITERATION** The side seam meets the side seams about 30.5 mm above the base: "I'll check and say". See F21.16: it bothers him; fix it after this iteration.
- **F17.3 DONE** (3D, and the shot on `sidebuttons`) A 3D shot of the full-size SPDT side switches in their
  glove: "Yes, model it".
- **F17.4 DECIDED** The GT01 cover's taller end walls from the photo: "No, it's fine".

## F18. Answers to the Intro, Clicks and Glide builders' questions (2026-11-04 ~13:05)

- **F18.1 DECIDED** The pills with the plate on: "One wide front, one wide back". Two pills, mirrored about the sensor,
  each spanning most of the width, plus the ring. **DONE.**
- **F18.2 DECIDED** Where the dots by the sensor sit with the plate off: "research and decide". **DONE:** left and right of the
  lens at ±11.5 mm (a third less worst sag under a palm press; front and back would clash with the lens clip). **TO CHECK
  (K4):** Glide's dots by the sensor at ±11.5 mm.
- **F18.3 DECIDED** Theseus's sensor: "Unannounced next part". Call it PixArt's next flagship, with no part name. **DONE.**
- **F18.4 DECIDED** The price row on `flagships`: "Keep price charted". **DONE:** one chart, price on each row, Theseus's
  $189 ending on the ULX's launch price.
- **F18.5 DECIDED** The click-latency target against the XA25's measured 72 µs: "Tighten it". **DONE:** 70 µs, moving or still, at NC
  release.
- **F18.6 DECIDED** The tensioner's stress colours: "scant to peak and also it's been bothering me that the bridge
  tensioner doesn't properly connect the 2 pieces". **DONE:** the heat runs to the hotter part's peak, and
  the plate, bridge and trigger are drawn as one continuous band with filleted roots.
- **F18.7 DONE** The Viper V4 Pro's skate sizes: "Estimate from photos". Measured off his own photo (F20.4) instead: the rear half-moon is about 53 × 24 mm, labelled an estimate from his photo (`gld_under`).
- **F18.8 DECIDED** Measured sag or sink figures: "No, keep the models". The labelled illustrations stay.

## F19. Answers to the Shell at-a-glance builder's questions (2026-11-04 ~15:00)

- **F19.1 DECIDED** The gate inside under the crown (needs a hot drop or a three-plate mold): "Fine, keep it".
- **F19.2 DECIDED** The thumb side band against the fingers' side: "Same on both".
- **F19.3 DECIDED** The heat scale on the plane-against-triangles drawings: "do what makes triangles look better". The
  squared scale stays: calm triangles, the red peak on the plane.

## F20. Answers to the plate builder's questions (2026-11-04 ~15:20)

- **F20.1 DECIDED** The plate's skates: "Inboard, plate only". They sit on the plate alone, about ±36 mm from the centre,
  and come off with it. **DONE.**
- **F20.2 DECIDED** What carries the dot skates by the lens with the plate off: "part of the clip on lens line what g wolves
  does". The dots are part of the clip-on lens, as on G-Wolves mice. **DONE** (3D and Glide).
- **F20.3 DECIDED** The plate's skin: "Thicker skin", about 0.6 mm, so no rib is wider than the skin. **DONE:** 0.60 mm, and the FE study rerun.
  The plate is 4.4× as stiff as a solid plate of the same weight (v3, 21:30). Against a plain grid it flexes 14 % less at
  the lens and 11 % less under the front skate, is 2.35× stiffer in twist and peaks 29 % lower; the grid flexes 20 % less
  under the back skate. (v2 showed the grid 10 % stiffer: the FE model's whisper stiffness, the grid's hexagon lens ring
  and its skin faces all favoured the grid; fixed, with switches that bring the v2 behaviour back.)
- **F20.4 DECIDED** The skates' shape: "they shouldn't be pills, they should be half circles, with cutouts for the dots,
  they should both look like the rear viper v4 skate, which i am attaching". **DONE** (3D and Glide): two half-moons after the
  Viper V4 Pro's rear skate, measured off his photo (an estimate), cut round the corner dots.

## F21. Status question and answers (2026-11-04 21:47 to ~21:55)
- **F21.0** "how far are you into integrating all my feedback?" Answered with the counts above, the review and the fixers.
- **F21.1 DECIDED** The shell's weight: "Budget is the target". The shell (with its skates) gets what the weight budget
  leaves; the Shell chapter's 15.2 g body is labelled a stress study, not the final shell. **DONE (fixK, fixI)**:
  the labels, and the budget recounted with the deck's own magnesium wheel and brass inserts.
- **F21.2 OPEN** The plate's back skate: "i'll have to see all 3 options". Being rendered side by side: (A) v3 as now,
  (B) the back skate weighted harder, (C) thinner ribs (0.30 mm lattice, 0.40 mm struts).
- **F21.3 DECIDED** The inserts: "i would think carbon filled would be lower than 85%, brass at zero as derived from my
  experiences feels fine, we should simulate it later though". Brass stays 0 % (derived from his experience); the
  carbon-filled figure goes lower (his number asked). **TODO later:** simulate re-threading in carbon-filled and ABS.
- **F21.4 DECIDED** The radio module: "AN54LM-P20A, long antenna". **DONE** in the deck.
- **F21.5 DECIDED** Carbon-filled re-screw: **70 %** (ABS 90 %, brass 0 %). **DONE:** own_insert, 70 % → 0 %.
- **F21.6 DECIDED, overrides F18.3** The sensor: "the next sensor is the PAW3970 which is what the viper v4 pro sensor is
  based off, the viper v4 pro is just a renamed PAW3970, razer only has exclusivity on it for 2 years so we should have
  access soon, it was the same process with razer viper mini signature edition sensor really just being a renamed 3950,
  use all of the viper v4 pro sensor specs, we are thinking ahead here." The Viper V4 Pro's published specs (Focus Pro
  50K Gen-3): 50,000 DPI in 1-DPI steps, 930 IPS, 90 G, 8,000 Hz, Frame Sync, 26-level asymmetric cut-off. **DONE**
  (fixI, fixK); the "suspected sensor" wording is K4's.
- **F21.7 DECIDED** Two-tone: "Etch through to carbon" (as drawn). **DONE.**
- **F21.8 DECIDED, STANDING** The battery: "not decided yet, and stop calling it a cell or using abstract vocab, people
  will understand it being called a battery much easier". The LP402535JU stays, labelled as the example battery; every
  on-screen "cell" becomes "battery", and plain words beat jargon everywhere. **DONE**, bar two lines left for the final sweep.
- **F21.9** Grip map: "i'll have to see it and then ask me again after i've seen the slides with all the feedback
  integrated". **Ask again** after the final publish.
- **F21.10 DECIDED** 9H: "'9H on Cerakote's tests'". Coating weight: "No, keep it unnumbered". Sync slide: "Fine, keep it
  folded". Cable: "Yes" (three 32 AWG wires of 40 AWG strands). Grip height: "12 mm is right". **DONE** (the 9H wording
  by the integrator).
- **F21.11 DECIDED** The power chip: "it's fine where it is right now, we will move it later next time i give you pcb
  redesign ideas". The board: "it will probably be thinner, but keep it as 1mm for now and we will change it after the
  next redesign ... it would be inefficient to recalculate something everytime we build". **STANDING:** don't re-solve
  for small spec changes between redesigns.
- **F21.12 DECIDED** First-assembly fit: "keep it in words, and then we'll simulate it for the next iteration". Thread
  wear: "Keep both". Newtonian profiles: "Fine for now". **TODO next iteration:** simulate the first fit and the re-screw.
- **F21.13 DECIDED** The size slide: he asked where "a flat mouse is better" came from; shown his doc's line 627 ("for a
  flatter mouse, its better to be too small than too big, because big hands will still be able to fingertip grip") and
  line 645 (the 2-4 % rule), he chose "Quote the flatter-mouse line". **DONE.**
- **F21.14 DECIDED** The plate: "show all options for now, so we can go any direction", and "Show all five charts" (the
  back skate too). **SUPERSEDED (F27):** built, then out of the film: "none are what i wanted we will worry about the bottom cover later".
- **F21.15 DECIDED** The battery's place: "the battery is very heavy and is used to balance the mouse, decide battery
  placement based where we'd determined the best balance should be". **DONE:** the battery sits in the tail, behind the board (the key plan
  and the 3D agree); why some push for a higher battery is K6's (`mass`).
- **F21.16** The side seam by the trigger cutout (about 30.5 mm up): "if you're talking abt the seam by the trigger cutout,
  yes that really bothers me, but we will fix it after ive the iteration where you've implemented all my feedback thus
  far". **NEXT ITERATION.** The tensioner's real size (F12.5): "Still unknown" (the labelled example stays).

## F22. Answers at ~23:00 (2026-11-04)
- **F22.1 DONE** The scroll wheel: "https://pmm.gg/products/magnesium-scroll-wheel-op1-8k-op1w-4k-pulse-cyber-op-for-modkit,
  this scroll wheel is 1.0g, ours will be 0.9g, right now the scroll wheel design you have is very bulky and unoptimized,
  it should be closer to the pmm wheel i've attached, but with 6 arms, i also don't like the texture your chosen, even if
  it's based on rover tread, we can get rid of the mars base dome slide as well". **DONE:** `shbDome` (the Mars base
  dome) is out of the film. The wheel: six arms, an open hub, a thin crowned rim, AZ31B at 0.900 g (508.8 mm³), a fine
  straight knurl (144 grooves) instead of the rover tread; `wheel` is now "Six-arm magnesium wheel", −10 % (1.0 → 0.9 g)
  against PMM's. (PMM's photos were blocked from the session, so the form follows his words and his doc.)
- **F22.2 DONE** Frame sync: "Match SensorLock, 42 µs". `framesync`: 205 → 42 µs frame to USB against Razer's FrameSync,
  SensorLock's 42 µs stated plainly.
- **F22.3 DONE** Screws and wires in the budget: "Derive Theseus's own" from the 3D model: 4 × M2 × 4 steel, 0.75 g; the
  side-button lead, 0.08 g. With the 0.9 g wheel the shell and skates get **10.02 g** (2.14 g under the XA25's).

## F23. The phone, and editing text (2026-11-05 00:28)
- **F23.1 DONE** "on my iphone 16 pro max, all the tools hang off screen and there's no way to input ratings, the tools
  below the video player need to wrap around to a second line after they become longer than the width of the video
  player". The bar wraps onto more lines at the stage's width, the stage refits to the bar's real height, the panels sit
  at the top on a phone (clear of the keyboard), and the safe areas are respected. Tested at 440 × 956 and 956 × 440.
- **F23.2 DONE** "id also like a tool where i can tap a button then be able to select and directly edit any text a on a
  slide". The "edit text" pill (editors only; key E) freezes the slide at its settled frame and outlines every string; a
  tap picks one and the panel takes the new words, shown on the slide as they're typed and saved as he goes ("back to
  original" undoes it). The narration's earlier lines are listed in the panel. Edits replace that string on that slide
  only, for every viewer, and are kept in the artifact's db (collection `edits`: slide, from, to), where Claude reads them.
- **F23.3** "these changes need to be made relatively soon so i can start giving you input on all your slides". Live in
  v18 (00:4x).

## F24. Notes on the wrong slide (2026-11-05 01:13)
- **F24.1 DONE** "my notes don't appear to be getting properly saved along with the slides ... sometimes my notes from a
  past slide will carry over to the next one". Cause: the note saved 1.2 s after typing stopped, to whichever slide was
  showing by then, and a focused note box kept its text across a slide change. Now a note belongs to the slide it was
  typed on, and any slide change saves it there first. In the saved ratings, `thesis` carries the cover's note word for
  word and `map`'s note ends mid-sentence: both from this bug.

## F25. Answers on the new wheel and the screws (2026-11-05 ~01:45)
- **F25.1 DONE** (a coarse diamond knurl, 72 teeth at 1.0 mm pitch, 30° each way, flat tops; IS 3403) The wheel's tread: "research what you think is best, if assumed, coarse and diamond are my favorites".
  **DONE (whl).**
- **F25.2 DONE** The wheel's form: "thinners arms". Arms 0.95 → 0.55 mm, the weight held at 0.900 g.
- **F25.3 DECIDED** The side-button lead: "Keep 3 wires". **DONE** (no change).
- **F25.4 DONE** The screws: "Titanium" (instead of steel): grade 5, 0.42 g for four; shell and skates 10.35 g. **DONE (whl):** the budget, the 3D screws and the
  Ownership slides (no more magnetic pickup).
- **F25.5 DONE** (head hardness 220 → 349 HV against class 4.8, sourced; thread stripping stays in the brass, said so) "mentioned the improved strength of the titanium screws compared to steel leading to less stripping,
  find research to back". **DONE (whl):** sourced, against the steel the screws would really be (stainless A2 or
  class 4.8 / 8.8; class 12.9 alloy steel is stronger than grade 5 titanium), and clear about which stripping the evidence
  supports (the recess, by hardness; the thread usually strips in the brass insert, not the screw).

## F26. Notes at 01:43 (2026-11-05)
- **F26.1** "the click tensioning mechanism you're showing in the diagrams isn't anywhere near as accurate as it should be,
  i almost feel like it's potentially wrong as well, it needs a lot more effort". Asked what to build from: "Research
  real mice". **DONE (K1, v22).**
- **F26.2** "the second of the dual plungers need to be shown as exactly the to be exactly same size as the one for the
  switch and the one for the side button, this helps show our uniformity claim. right now the plunger without a switch
  sticks done further and looks different." **DONE (K1, v22).**
- **F26.3 NOTED** "as if we ever add magnetic clicks, the second plunger is an excellent place to do so for this reason"
  (context for F26.2; magnetic clicks stay off the slides, F9.9).
- **F26.4** "the battery connector needs to be turned 90 degrees so it can be pulled out properly, it's hard to access it
  when it faces towards the left instead of the back". **IN PROGRESS (K2).**
- **F26.5** "the pcb needs more rounding on all of its edges to look more premium (this my mean extending the front
  slightly to give it a buffer so the microswitches don't stick out over where there's no pcb), and the tiny notches on
  the left and right sides should be shaved off so the pcb can better be used as a support better, the back width of the
  pcb should be back width as the front". **IN PROGRESS (K2).**
- **F26.6** "give the triangles on the back of PCB design the proper fliletting". **IN PROGRESS (K2).**
- **F26.7** "the 2 back holes need slightly more padding on the pcb, but the holes can't change location at all".
  **IN PROGRESS (K2).**
- **F26.8** "the power switch should be moved to the middle of the notch so it's easier to access". **IN PROGRESS (K2).**
- **F26.9** "remove the qr code off the sensor and engrave the sensor with PAW3970 and then whatever letters are on the
  actual sensor to make it look like a real sku (we don't know what the real sku will be past the PAW3970 yet, so
  derive)". **IN PROGRESS (K2).**
- **F26.10** "the XA25 achieved 42us latency with sensor lock on a worse 3950 sensor with better software" / "the viper v4
  pro does 202us". Asked for the 202 µs source: "you cited it before, maybe it's wrong if you don't remember". (The deck
  had 205 µs = SensorLock's 42 + XBAB's "163 µs lower"; nothing public found for either number.) **DONE:** 202 → 42 µs,
  both his figures, with XBAB's 163 µs noted.
- **F26.11** "remove all the engravings in the theseus visualizations for now, it's going to take a lot of specialized
  input to get them to them waiting i want them so it's better to have them off for now". Asked about the slides about
  engraving: "Hide them for now". **DONE:** srf_marks, details and serial out of the film; the 3D shell's legends,
  serial and side mark hidden.
- **F26.12** "let me know if you have any wishing for me to improve your execution, not just related to the feedback i've
  just given you". Answered in chat.
- **F26.13** "also updating a slide should archive its old score". **DONE:** each rating records the slide's version;
  when the slide changes, its score and note move to the rating's history and the slide shows as unrated.


## F27. Brock's slide ratings and notes (rated on v18 and v19, 2026-11-05 00:50 to 03:45)
He rated 114 slides from 1 to 10 (mean 5.0), 100 with notes: "i've also rated as many slides as i have energy for now, i
didn't touch the software slides very much yet, mosr of them are confusing". And: "take all my new feedback on the rating
system into account, assign builders to per slide issues and lessons you can derive globally from my feedback". Asked
about builders: "that's too many builders, i don't want them to chew through my limits before accomplishing anything, it
shouldn't be per chapter, it should be per slide and global derived lessons, per chapter would have very uneven work".
Also answered: units "khz" (all lowercase; **DONE** deck-wide); the scroll encoder: magnetic (Hall effect), "Yes, switch
everywhere". The ratings are kept in the artifact's db (collection `ratings`); a slide changed since he rated it shows its
old score as archived (F26.13).
- **Out of the film (DONE, 2026-11-05 03:5x):** `map`, `gld_position`, `shlGrams`, `sealed`, `serial`, `srf_marks`,
  `details`, `shbGates`, `pltPlate`, `pltSim`, `pltOptions`, `shlLattice3d` (131 slides now).
- **His notes, slide by slide (verbatim):**
  - `cover` (intro, slide 1) **8/10**: "PIAKNOW’S should be all capital, also instead of 8kh it should say something a lot there being zero compromises, 8khz is pretty much standard now"
  - `thesis` (intro, slide 2) **3/10**: "all of these numbers feel very random, they’d message is good but you can add it to the slide about other companies misadvertising weights"
  - `targets` (intro, slide 3) **8/10**: "marker it as dual 8khz, press to pc should be shorter, we’ve done numerous things to optimize mechanical latency"
  - `targets2` (intro, slide 4) **7/10**: "compare to starlight x weight for the headline value. set down and idle sleep settings are not important enough to talk about this early"
  - `flagships` (intro, slide 5) **6/10**: "need to derive all empty data, also it bothers me when one number has more decimal places than others, superstrike x3 is more id a flagship than gpx2"
  - `ntr_stats` (intro, slide 6) **4/10**: "density is so important it could be on the cover instead of the 100+ ideas, capitalize the P in Piaknow, it’s a name, all of this information is important but would fit better in other slides. also 8khz wired and wireless is better market as Dual 8khz wired and wireless. don’t capitalize the H in khz"
  - `zerograms` (intro, slide 7) **5/10**: "needs more reasoning, argument feels weak here, it should be more about theoretical ease of control and target changing speed, overall speed feels outlandish"
  - `weightgap` (intro, slide 8) **10/10**: "no comment"
  - `ntr_density` (intro, slide 9) **9/10**: "only use the outline or the shape/silhouete instead of something so detailed, good understandable demonstration, but you need to sell why low density is important a little better, the x2f having the wrong idea should come first, show the problem first, then sell the solution so the solution doesn’t feel useless"
  - `ntr_sizewt` (intro, slide 10) **9/10**: "find an outline of the x2f to add to the box, and same thing as last slide, the theseus should only be the shape outline"
  - `ntr_densrank` (intro, slide 11) **9/10**: "it bother me the the x2f is lighter and lacks decimal points, this probably isn’t the most exact weight available for the x2f crazylight (reports online say it’s at least 29.5g), i also don’t like how the theseus has an extra decimal point. you also need to use eloshapes to take g wolves mice into account for there weights and density, yes this will make the theseus look worse, but its more honest"
  - `pricefront` (intro, slide 12) **7/10**: "the bottom pareto lineinstantly going straight bothers me a lot i should continue on the trajectory it was at for a little but bit, there should never be a kink in a pareto line, i think the viper mini signature edition and zaunkoenig mice need to be on this table as well, and the x3 superstrike"
  - `market` (intro, slide 13) **8/10**: "we need to man’s a bigger argument here how most mice compromise battery life for weight, research harder to find missing weights or derive"
  - `budget` (intro, slide 14) **6/10**: "it’s a lot of work to keep updating this one"
  - `map` (intro, slide 15) **2/10**: "poor execution and not super needed"
  - `clicks` (click, slide 16) **7/10**: "switch plunger on the gt01s is still turned vertical, bottom part looks fine but the part that actually sticks out above the housing looks like it needs to be turned 90 degrees"
  - `arc` (click, slide 17) **7/10**: "tensioner doesn’t look accurate, i dont like the use of the metrics “pts” or “points” anywhere. this is a really important slide the concept is good but it needs to be demonstrated and sold better, i think direct drive means the peak theoretical reaction time should be 20% faster because 20% more of the force goes where you actually intend it."
  - `clk_wedge` (click, slide 18) **4/10**: "important concept, very poor execution, could be closer to the less parts is better demonstration, show after youve shown the problem with having more parts"
  - `clk_switch` (click, slide 19) **5/10**: "bottom housing doesn’t look very accurate at all, i’ll attach a new reference when you ask, show the effect on battery life, razer says their optical encoder and switched account for almost half the battery life in the viper v4 pro (find quote), also i’d like to switch to using a halling effect/ magnetic encoder so we can say we should have double the battery luce efficiency as razer"
  - `clk_switch2` (click, slide 20) **2/10**: "largely irrelevant, we don’t even know if we’re going with the gt01 switch or just their style for the bottom housing, if you want to keep this you’d have to group it in with better binning practices, a lot of companies lie about their binning practices for switches, whereas we could commit to proveable bins (potentially using galling effect tech)"
  - `cutouts` (click, slide 21) **3/10**: "everything here is among the most important concepts, but probably has the worst graphic design in the entire deck, it’s super unintuitive to understand because you can hardly tell which part of the mouse you’re looking at it’s so abstract, also the benefit to the player isn’t really sold"
  - `tensioner` (click, slide 22) **8/10**: "reference the starlight x’s stufd clicks from using such a stiff composite materiak with no bridge, market top as “as seen in starlight x” or something like that, and bottom as proposed solution. also the rounding where the bridges meets the trigger looks bad, ie needs to connect without filets"
  - `clk_tenmat` (click, slide 23) **4/10**: "hard to understand, and stiffer is better doesn’t seem right"
  - `anchors` (click, slide 24) **7/10**: "locking the motion to one plane/ direction needs to be better explained, and the visualization here is too abstract and difficult to tell what you’re looking at, i also dislike how the dual plungers and pads aren’t uniform, and you need to sell the benefit here a little better, talk about how the bad version feels cheap and causes more wear over time fork being losing, good information, execution just need medium improvement"
  - `clk_pomtune` (click, slide 25) **6/10**: "more cornered should be rounded here in the visualization, this one also just feels lazy compare to another mouse’s tolerances directly"
  - `clk_front` (click, slide 26) **8/10**: "this slide has second worst execution in the deck. it fails to intuitively communicate what is going on. if they were not my ideas i’d be very lost.  the left needs to compare to what happens when you don’t have a straight front, like when there is heavy front comfort grooves, and how that can cause wobble side to side, because the front will never reach the bottom in the same spot at the same, and where it reaches the bottom first will depend on where you press it, create wobble which makes the parts feel cheap and wear out faster.  i don’t think cross sections are the best way to communicate the comfort grooves that get shallower near the front. also it needs to be explained that these help lock your fingers in across another plane of motion and increase surface area contact since the front has more surface area too.  for the right visualization, it genuinely took me so long to realize that you weren’t demonstrating an alternative to the the left demonstration, you need to show how some mice do that concept wrong to create larger gaps than there should be and how we do it right. this is also an amazing opportunity to demonstrate why the cutouts are ceiling or wall facing.  these are all very important concepts and probably should be spread out over multiple slides, but still dense in information, not too many slides."
  - `clk_hotswap` (click, slide 27) **4/10**: "demonstration is plane and it’s hard to see the claw clips, there also is no argument as to why this is important"
  - `clk_spdt` (click, slide 28) **5/10**: "difficult to understand"
  - `latency` (click, slide 29) **6/10**: "difficult to understand, i like that it sells something though, its hard to tell what is changing"
  - `clk_debounce` (click, slide 30) **3/10**: "weak slide, also minecraft kids want to be able to adjust their debounce to count more double clicks, so i’m not sure how to feel about how this is being sold, low debounce is good and important though to most people, there is just a sub group of people who really dislike it"
  - `clk_wait` (click, slide 31) **3/10**: "hard to understand, probably can be combined somewhere else"
  - `clk_methods` (click, slide 32) **3/10**: "probably can be combined somewhere else or removed"
  - `sidebuttons` (click, slide 33) **5/10**: "left visualization fells lazy, right visualization doesn’t match the other dial rail plungers with prfe and it’s way overbuilt, important information though, it gets the point across okay, it just feels lazy"
  - `glide` (glide, slide 34) **7/10**
  - `gld_under` (glide, slide 35) **4/10**: "corner dots ledges should be the sable length as the sensor distance between the sensor skate ledge (possible to fit up to 3 skates), and they shouldn’t have a gap between themselves and the shell, we need filet where the skate pills hit the shell, the current execution looks vegetation lazy and not uniform, the right visualization is not what i wanted at all"
  - `dots` (glide, slide 36) **6/10**: "show how this is targeted and more weight efficient compared to how big of skates it takes to reduce the sink that aren’t placed in the most optimal possible spots (viper v4 style)"
  - `gld_camera` (glide, slide 37) **4/10**: "execution still feels lazy here for the visualization, the pad looks so realistic it’s uncanny, it’s weird irs not drawn like everything else, and this slide could probably be combined with something else, like the next slide"
  - `gld_corr` (glide, slide 38) **5/10**: "cool slide but it should probability be combined with the last slide"
  - `gld_blur` (glide, slide 39) **2/10**: "probably could be combined with the last 2 slides"
  - `gld_sag` (glide, slide 41) **5/10**: "visualization feels lazy and needs more detail, this could also be group with a comparison to bigger skates and weight efficiency"
  - `gld_module` (glide, slide 42) **8/10**: "i like this slide, it feels like a good slide, just your normal above average slide right here"
  - `sensor` (glide, slide 43) **6/10**: "says it’s the “suspected” sensor inside the viper v4 pro and that this is the plan, AFTER exclusivity expires"
  - `gld_reports` (glide, slide 44) **3/10**: "i don’t understand what is being demonstrated this slide, it’s a graphic but it’s not a demonstration. i would have to understand it to know if the information is good or not"
  - `gld_position` (glide, slide 45) **1/10**: "delete"
  - `gld_soft` (glide, slide 46) **7/10**: "place near web software, better sell the importance of liftoff distance being 0.1mm configurable"
  - `gld_sheet` (glide, slide 47) **4/10**: "visualizations feel lazy"
  - `shellcard` (shell, slide 48) **7/10**
  - `materials` (shell, slide 49) **6/10**: "explain that this is just on a flat plane, scale the force to what a mouse would experience from a hand and note that, do that more throughout the presentation. also add the projected weights of these 2 beams."
  - `shlSpecific` (shell, slide 50) **4/10**: "doesn’t shot how higher specific strength is better, just feels like a graphic which is quite convoluted. i like the graphic but the explanation for it needs to be so much better."
  - `thinwall` (shell, slide 51) **3/10**: "confusing and lazy graphic, hard to understand at a glance and with longer analysis, super important concept though."
  - `shlScatter` (shell, slide 52) **7/10**: "don’t use points, a little more intuitive, but still quite lazy."
  - `shlPick` (shell, slide 53) **7/10**: "gpx 2 has worse build quality than the ulx even though it was heavier, this demonstrates the fallacy, i dont like that it says the gpx 2 has good build quality, also i think the line might be unintuitive at a glance, i think the axes need to be formatted and labeled differently, also you expect the right to mean weaker and lighter at a glance be because it has the least area under the curve, not the other way around, maybe y should measure strength not flex, i feel as if that would be more intuitive to understand."
  - `shlNoPick` (shell, slide 54) **3/10**: "the what if uoh didn’t have to pick shouldn’t be the only thing on the screen for a start animation, it should just be the header, i’ve pointed this out before and im concerned you didn’t change it, it makes me worry you’re missing my other feedback. i have all the same comparisons here as the last slide, this graph feels even more intuitive at a glance, i feel like our method should have a separate line. this is a really important concept, but i genuinely have no idea what it’s show graphically."
  - `shlHotspot` (shell, slide 55) **8/10**: "show the weight of the 2 parts to tie into how a milled out part can be stronger a solid part, point this out"
  - `shlMargin` (shell, slide 56) **2/10**: "really hard to understand, probably important"
  - `shlWork` (shell, slide 57) **8/10**: "tie this into how we designed the stricter more, this page could be sized to have a more information, this example is part of the reasoning for a lot of design choices"
  - `shlShell3d` (shell, slide 58) **2/10**: "hard to understand, and cut the strength graphs that last multiple slides, they were a bad idea"
  - `lattice` (shell, slide 59) **7/10**: "use human force that would be exerted on a mouse and point that out make hexagons bend a lot more"
  - `shlDeterminate` (shell, slide 60) **5/10**: "could be combined with another slide"
  - `shlThin` (shell, slide 61) **7/10**: "needs a better explanation and more information to be more inituitive, i really like the fact that triangles win more as the mouse gets lighter, this really just isn’t as compelling as it should be sits hard ti understand. max load to bend maybe?"
  - `shlLattice3d` (shell, slide 62) **1/10**: "wins aren’t big enough, these slides take a ton of computation, and they show triangles firve dispersion being almost no different in the graph, triangles should have less red and more spread out force"
  - `shbArches` (shell, slide 63) **7/10**: "arches shojdkne be on the photon rim and for some reason sole of the lines look wobbly, cool animation other than the poor execution"
  - `shbPress` (shell, slide 64) **3/10**: "hard to understand, need real world examples and it’s just unintuitive for a social media brain"
  - `shbThrust` (shell, slide 65) **3/10**: "hard to understand, need real world examples and it’s just unintuitive for a social media brain"
  - `shbBend` (shell, slide 66) **3/10**: "hard to understand, need real world examples and it’s just unintuitive for a social media brain"
  - `shbFibres` (shell, slide 67) **3/10**: "hard to understand, need real world examples and it’s just unintuitive for a social media brain"
  - `fillet` (shell, slide 68) **4/10**: "she’ll study isn’t needed to be shoes here, rest can be combined with other slides"
  - `filletsize` (shell, slide 69) **10/10**
  - `shbGates` (shell, slide 71) **1/10**: "not sure if needed"
  - `shbWidth` (shell, slide 72) **3/10**: "hard to understand, feels contradictory to things we’ve says before at a glance"
  - `shbMill` (shell, slide 73) **2/10**: "doesn’t need its own slide"
  - `shbMillDirect` (shell, slide 74) **2/10**: "doesnt need its own slide"
  - `shbTol` (shell, slide 75) **3/10**: "unintuitive, better visualization needed, mediocre idea"
  - `shbSides` (shell, slide 76) **4/10**: "show equal pressure on both sides, just for show. the asymmetry looks bad, this should be in the shape category"
  - `shlPcbRib` (shell, slide 77) **6/10**: "unintuitive, explain how fr4 is like carbon fiber because it’s also a woven composite, using the pcb is an alternative to having carbon fiber rods in your mouse that doesn’t require extra parts with extra tolerancing, you’re just using what you already have"
  - `shcCarry` (shell, slide 78) **5/10**: "meg slide"
  - `shcArms` (shell, slide 79) **6/10**: "these aren’t what the arms or pcb would look like, important idea tho"
  - `shlStructs` (shell, slide 80) **3/10**: "viewer will have no idea what that spec means in big blue poor setup"
  - `tolerance` (shell, slide 81) **7/10**: "needs to be explained with some sort of law for more validity, don’t show the theseus teardown, improve the diagram, the little drops should be simplified mouse parts, explain how one incorrectly tolerances mouse part ruins a whole mouse so this is more important than it looks, you’re on the right track here you just need to improve your execution."
  - `sealed` (shell, slide 82) **1/10**: "remove, you’re still drawing the encoder poorly and i want to use a magnetic encoder that doesn’t get affected by dust and have have a transparent top housing to see when it’s broken like switches"
  - `shlGrams` (shell, slide 83) **1/10**: "not needed"
  - `mass` (shell, slide 84) **5/10**: "in review, research why some people are pushing for higher battery placement"
  - `grind` (shell, slide 85) **7/10**: "factory poron pads, many people already mod there g wolves mice with these for where it hits the pcb to reduce creaking"
  - `shlsheet1` (shell, slide 86) **4/10**: "most important thing here is the right cutouts thing, and it should be back by the other cutouts slides and it meds a lot more detail, especially how the further the seams are from the center the easier they are to get your fingers caught in them. we don’t have to talk about the pro model yet. and i’m unsure about the the sticker"
  - `shlsheet2` (shell, slide 87) **5/10**
  - `pltPlate` (shell, slide 88) **3/10**: "not what i wanted at all"
  - `pltSim` (shell, slide 89) **3/10**: "none are what i wanted we will worry about the bottom cover later"
  - `pltOptions` (shell, slide 90) **2/10**: "none are good options and we don’t need to worry abt this into later into development"
  - `surfacecard` (surface, slide 91) **4/10**: "surfaces looks bad in 2d and 3d visualization"
  - `coating` (surface, slide 92) **5/10**: "lazy visualizations, show flames and more realistic pots"
  - `srf_texture` (surface, slide 93) **6/10**: "needs to show previous height before sanding and coat, i like the comparisons to soft touch"
  - `srf_weight` (surface, slide 94) **4/10**: "can be combined with previous slide, cerakote film numbers before sand blasting look way too heavy, 0.49g is a lot, especially with how much thinner cerakote is to soft touch"
  - `srf_uv` (surface, slide 95) **7/10**
  - `grip` (surface, slide 96) **8/10**: "really good visualization but needs to be more intuitive"
  - `srf_gripmap` (surface, slide 97) **5/10**: "grip designs need massive optimizations to look cool, and blend between there different textures better"
  - `srf_tape` (surface, slide 98) **8/10**: "the best thickness is no thickness, people have been chasing really thin grip tape for a while now, this is a better solution"
  - `srf_twotone` (surface, slide 99) **6/10**: "not a universal dah of the design, but i love how realistic it is"
  - `srf_marks` (surface, slide 100) **1/10**
  - `details` (surface, slide 101) **3/10**
  - `wheel` (surface, slide 102) **5/10**: "poor comparison figure, we should be comparing ti average plastic wheels with heavy rubber, a test group"
  - `srf_encoder` (surface, slide 103) **2/10**
  - `eleccard` (elec, slide 104) **7/10**
  - `cells` (elec, slide 116) **4/10**: "lithium ion numbers are way off, look at smaller batteries, you’re probably looking at too big of ones, lithium ion batteries are a usually a gram or two heavier than their lithium polymer counterparts if the same capacity for mice"
  - `elc_oneside` (elec, slide 118) **7/10**: "good but i wish it was even better visualized"
  - `elecsheet1` (elec, slide 119) **7/10**: "show joe this protects against water for very little weight, something few might do"
  - `elc_tear` (elec, slide 120) **8/10**
  - `elc_flex` (elec, slide 123) **7/10**
  - `cable` (elec, slide 124) **3/10**: "extremely lazy visualizations, paracord needs better assets"
  - `software` (elec, slide 125) **6/10**
  - `elc_sheet2` (elec, slide 126) **2/10**: "remove this slide, add the no rgb light to the slide about having no opticak components, and put it next to the web software"
  - `repair` (own, slide 133) **8/10**
  - `ownscrew` (own, slide 134) **7/10**
  - `serial` (own, slide 140) **1/10**: "not needed for now"
  - `ownsheet1` (own, slide 141) **2/10**: "feels redundant, most of this should be moved to other slides"
- **Lessons drawn from all of them (STANDING for every slide):**
  - **G1. The problem first, then Theseus's fix, then what the player feels.** ("show the problem first, then sell the
    solution so the solution doesn't feel useless"; "the benefit to the player isn't really sold").
  - **G2. Real-world examples and human-scale forces, said on the slide** ("need real world examples and it's just
    unintuitive for a social media brain"; "scale the force to what a mouse would experience from a hand and note that,
    do that more throughout the presentation").
  - **G3. Accurate, finished drawings in one style:** parts drawn as they really are (research teardowns and datasheets),
    nothing lazy, abstract or photo-real ("lazy" recurs in 15 notes; "the pad looks so realistic it's uncanny").
  - **G4. Fewer, denser slides:** merge thin slides, cut what isn't needed ("probably can be combined", "doesn't need its
    own slide", 14 notes).
  - **G5. Honest, complete numbers:** derive missing data instead of blanks; one decimal precision per comparison ("it
    bothers me when one number has more decimal places than others"); include rivals even when Theseus looks worse ("yes
    this will make the theseus look worse, but its more honest").
  - **G6. Words:** no "pts" or "points" metric anywhere; "khz"; Piaknow is a name (capital P; all caps where the style is
    caps, PIAKNOW'S); "Dual 8khz wired and wireless"; "battery", never "cell"; plain words.
  - **G7. Sell what the player gets** (control, feel, wear, battery life), at a glance (F14.10).
  - **G8. Uniform parts where uniformity is the claim** (plungers, pads).
  - **G9. The opening frame is the header, never a lone phrase** ("the what if you didn't have to pick shouldn't be the
    only thing on the screen for a start animation, it should just be the header, i've pointed this out before and im
    concerned you didn't change it, it makes me worry you're missing my other feedback"). Check every past note again.
  - **G10. Software and latency slides must be simple** ("mosr of them are confusing"; "difficult to understand").
- **Work packages** (balanced by effort, two builders at a time, each integrated and published as it lands):
  K1 click mechanics accuracy (F26.1, F26.2, `clicks`, `arc`, `clk_switch`, `tensioner`, `clk_tenmat`, `anchors`,
  `sidebuttons`; **running** since 04:10); K2 the board, the sensor marking, the magnetic encoder everywhere and the
  Electronics notes (F26.4 to F26.9; **running** since 04:10); then K3 the click slides made clear (`cutouts`,
  `clk_front` and the timing slides); K4 the glide slides; K5 the shell's materials and strength slides; K6 the arches,
  fillets, board and build slides; K7 the intro's data and sell; K8 the surface, the ownership sheet and the wheel. The
  deck-wide word sweep (G5, G6) is done at integration. (Re-balanced at 04:15 from K3 to K5b: the shell alone was 30
  slides.)

## F28. The GT01 reference (2026-11-05 04:14)
- **F28.1** With a Gateron render ("Vertical push mouse switch": the GT01 side-on in its mouse, cut open; saved as
  attachments/8e779cef-image.jpg, annotated "best GT01 Reference"): "this picture should help you get the side profile as
  accurate as possible on the gt01, priories sus profile accuracy over everything else. you shouldn't have an issue
  outlining the silhouette and extrapolating the rest of the switch based off other reference as i'd switches, that's my
  process when i model a switch." **DONE (K1, v22):** the silhouette traced from it, the rest from other switch
  references, in 3D and 2D (also the bottom-housing reference for `clk_switch`); K2 matches the board's switches to it.
- **F28.2** With three photos of tensioners (a white shell in two views, a Logitech G305's top shell, a white Lamzu-marked
  shell; attachments 0300b3c2, c82f85d5, 1fce7c7f): "here are some pictures i'd click tensioning mechanisms i like. none of
  them are aligned properly though, and all of them are overbuilt and overly complex." **DONE (K1, v22):** split,
  one-screw blocks as in the photos, but aligned with the switches and stripped to what the load needs.
- **F28.3** With two photos (a G-Wolves board inside its lattice shell, and the black lattice part with its arm; attachments
  d2ae72fe, 80f31ed6): "i also attached a picture of the pcb with arms from g wolves that are used as a reinforcement that i
  had break during shipping". **TODO (K6):** `shcArms` drawn from these: what the arms and the board really look like, and
  that they broke in shipping.

## F29. Status, and archiving that proves the work (2026-11-05 05:05)
- **F29.1** "are all the agents still working?" / "give me a status update". Answered in chat (K1, K2 running; the board's
  before/after sent).
- **F29.2 DONE (v21)** "you need a solution to make sure archived feedback was fully taken into account and it wasn't just
  some small change that archived the feedback". Found: v20 showed 13 rated slides as archived (cover, targets, targets2,
  flagships, market, budget, clk_debounce, gld_reports, surfacecard, wheel, eleccard, cells, ownscrew), all by small
  changes such as the khz sweep. Now: a score is archived only when a builder raises the slide's `rev`, which it may do
  only after acting on every clause of his note, listing each clause and what changed in the slide's `answers`. The
  rating panel shows his archived note beside those answers, and "not done: bring my note back" makes it current again
  (recorded in the rating as `reopened`). Those 13 are current again. At each integration Claude checks every raised rev
  against its note and answers before publishing.
- **F29.3 DECIDED** The power switch (F26.8): asked whether the board builder's reading (centred in the board's window,
  actuator straight down) was right, he chose "Middle of the shell's notch": centre it on the cutout in the shell or plate
  it is reached through. The shell model turned out to have no switch notch (the real Sora V2 has a round-ended slot beside
  the sensor, about 14.5 mm right of centre, level with it; the board's window is 16 mm further forward). Asked where the
  switch should go, he chose **"Decide with the bottom cover"**: it stays centred in the board's window for now, and the
  notch is placed with the bottom cover (the Sora's slot and the room freed by J2's move are noted for then).

## F30. The board revamp, reviewed (2026-11-05 05:22, on board-first.png)
- **F30.1** "i have a lot of issues with this design, you need to really think through the components placement a lot
  more, the pmic was supposed to bd moved as far from the mcu as possible" (the power chip's move was due at this
  redesign, F21.11; Claude's miss: it wasn't in K2's brief).
- **F30.2** "you weren't supposed to get rid of the back notch and some of the filets being bigger than others looks
  quite bad".
- **F30.3** "you should flip the sensor and MCU position so the sensor is as far up as possible and then put the pmic in
  that empty left middle spot".
- **F30.4** "you have more space to come up with a more optimal the pcb component spacing shouldn't be so cramped".
- **F30.5** "the new front sticks out way too much, the power button placement hole should be aligned with the hole above
  it for the screw and another component".
- **F30.6** "all of the compensnts should feel cerntered to eachother".
- **F30.7** "the traces are gone and the not gold triangles are missing from the bottom, this pcb is less detailed than
  before".
- **F30.8** "i liked the scroll wheel version with lines better" (back to the straight-line tread of F22.1, overriding
  F25.1's diamond knurl; arms and 0.900 g kept).
- **F30.9** "the new battery just is in a really stupid spot that makes it feel cramped" (the battery connector J2).
- **IN PROGRESS (K2), in two steps:** a placement plan first (scale outline, every part's footprint, the alignment axes,
  the PMIC-to-MCU distance, the sensor's new position and what it moves), shown to Brock; the 3D rebuild only after his OK.
  Moving the sensor up moves the lens: the shell's lens window, the dots round it and the balance get asked about with
  the plan's numbers.
- **F30.10** On the placement plan (board-plan.png), the balance: "balance stays at the center of the mouse" (the centre of
  mass at the mouse's centre, not under the moved sensor; the lens window and the dots move with the sensor).
- **F30.11** The plan's changes, with his marked-up copy (attachments c2c68601: red at the front edge's diagonal up to the
  USB-C tab, and at the rear notch's diagonal corners): "i don't like how you removed some of the chamfers and turned them
  into filets, the main big corner filets need to be half as strong as they are right, and the space in front of the switch
  should only be the extra amount the gt01 hands out ovee because of its angle". **IN PROGRESS (K2):** the plan revised
  (chamfers back, the big corner fillets halved, the front only as far as the GT01's angled overhang), shown again, then
  built.
- **F30.12** "also the spacing between the scroll wheel hole and sensor, sensor and mcu and mcu and edge of the board all
  needs to be equal right now it looks like there are some thin parts that could easily break". **IN PROGRESS (K2):** the
  three gaps along the centre line equal, no thin webs (shown in mm on the revised plan).

## F31. Answers on the click work (2026-11-05 ~06:30, on K1's questions)
- **F31.1** Razer's "almost half the battery" (clk_switch): asked where he saw it, "Razer staff online". No public source:
  it goes on the slide as a claim, attributed to Razer staff online via Brock, beside the derived 18 % → +21 % for the
  two switches. **TODO (K3).**
- **F31.2 DECIDED** Direct Drive's speed: "Keep \"6% sooner\"" (with why it isn't 20 %). **DONE (v22).**
- **F31.3 DECIDED** The pads: "POM everywhere" (idea #28). **DONE (v22)**; the side buttons' answer drops "say if you want
  PTFE" (K3).
- **F31.4** The side-button guide as a fixed part over the full-size switch: "i'd have to see". It's on `sidebuttons` in
  v22 (2D and 3D); his rating or note there decides it.
- **F30.13** On board-plan-2.png: build it? "Changes first" (his changes to come). Rear outer corners: "[No preference]"
  (fillets r 0.75 as drawn). SH1/SH2: **"Drop SH1 and SH2"** (sides stay 19.03). USB-C front legs: **"Keep as today"**.
- **F30.14** His changes to plan 2: "every filet on the board should be the same radius, the changers don't have filets, you
  filet them the chamfers without turning them into filets" (one radius everywhere, the tab's corners too; each chamfer
  stays straight, with that fillet where it meets the next edge). And, overriding F30.13's USB-C answer: "i think i
  answered your question wrong before and the usb port should be moved back so it doesn't stick out oddly like it does
  now". **IN PROGRESS (K2):** plan 3, shown before the build.
- **F30.15** "i'm also not sure how i feel about the new board back, i really liked the old designs artwork, you should try
  the match/adapt the old designs back artwork as best you can". **IN PROGRESS (K2):** today's underside artwork adapted
  to the new outline (its dark triangles, gold clusters, wordmark, labels, QR), triangles filleted, shown in plan 3.
- **F30.16** "drop the other 2 small holes and add your own cutouts wherever you see fit" (LH1 and LH2 go; cutouts of
  K2's choosing, each with its reason and weight, every web 1 mm or more). **IN PROGRESS (K2), plan 3.**
- **F30.17** "i also want a variant of the pcb where the switch hangs off the edge instead if in a hole". **IN PROGRESS
  (K2):** plan 3 shows variant B (the power switch at the board's edge, no window) beside A (the window).
- **F30.18** "also on the gt01 switch the walls aren't straight for some reason and they aren't a consistent thickness for
  the bottom housing, you messed up the design". **IN PROGRESS (K1, resumed):** straight walls of one thickness, 3D and
  2D; the board's switches follow.
- **F30.19** On board-plan-3.png: USB-C fit "[No preference]" (flush now; the 4.6 mm / 1.36 mm gap to the shell's opening is
  for the shell round). Power switch: "i want to see bout versions" (A and B both built). The two rear cut-outs: "Drop
  them". Build it? "Yes, more changes" (to come). The GT01's walls (F30.18): **DONE (K1)**, straight, one 0.45 mm wall
  (Omron D2F-class construction; Gateron publishes no dimensions).
- **F30.20 DECIDED** `elc_sheet2` (F27): the no-RGB point goes on the encoder slide, his choice of "The encoder slide":
  `srf_encoder` becomes "nothing lights up but the sensor" (the magnetic encoder, the mechanical switches, no RGB LED,
  with their battery figures), next to the web software; `elc_sheet2` out of the film. **IN PROGRESS (K2).**
- **F30.21** His changes to plan 3: "the usb c connector probably stuck out for a reason, put it needs to hang out a little
  bit, but there shouldn't be a bump after the chamfer like there is now, the front should form a trapezoid only" / "the
  notches still don't look filleted, use an approach so that all the filets have the same apparent radius, also make the
  filets a little bigger" / "the scroll wheel cutout should have gold trim and the same radius filet as well". **IN
  PROGRESS (K2):** plan 4 (a trapezoid front with the receptacle hanging a little past it; every corner the same apparent
  size, a little bigger; a gold trim on the wheel bay), shown before the build.
- **F30.22** His changes to plan 4: "extend the left and right bottom corners so the bottom notch is as deep as the left and
  right notches" / "the front notch should have the same height as the back other botched depth, and all of their chanfers
  should be at the same angle". **IN PROGRESS (K2):** plan 5, one notch depth (the waist notches') for the rear notch and
  the front trapezoid, every chamfer at one angle.
- **F30.23** "make sure that scroll wheel hole is symmetrical as well, the whole footprint of the board should be
  symmetrical". **IN PROGRESS (K2), plan 5.**
- **F30.24** "and the gt01s walls don't look thick on the bottom housing" (after F30.18's 0.45 mm walls). **TODO (after the
  08:20 usage reset):** thicker bottom-housing walls, measured off Gateron's render.

## F32. A full revamp (2026-11-05 07:06 to 07:10)
- **F32.1** "i havent really seen any big changes from the feedback i gave with the ratings and notes tool, whats up with
  that?" Answered honestly: of 100 noted slides, 7 rebuilt (clicks), 12 out of the film, "khz" deck-wide; the board in
  progress; about 70 notes not started, because two builders at a time and deep work per slide made it slow.
- **F32.2 DECIDED** "wait until next refresh to fully redo the presentation, i was looking for a full revamp, not some tiny
  changes". Asked how: **"New story, fewer slides"** (re-plan the film from the thesis: fewer, denser slides, each the
  problem, then the fix, then what the player feels), **"Just build it"** (no outline approval first), **"As many as it
  takes"** (builders). **TODO (from the 08:20 reset):** REVAMP.md (the new story, each new slide with the old slides and
  his notes it answers), the rating panel showing those notes on each new slide, then the builders in parallel; the board
  (K2) and the GT01 walls (K1) carry on beside them.
- **F30.25** On board-plan-5.png: the USB-C conflict (its front leg slots cross the new 3.61 mm front edge by 0.61 mm),
  "whatever you think is best": **Claude's call: move the receptacle back 1.05 mm** (one depth kept; 0.44 mm of board at
  its legs; it still hangs 1.60 mm out; the bay's front edge to z 44.13; the mouth 4.05 mm short of the shell's opening
  until the shell round). Mounting holes: **"Mirror pairs"**. Build it? "chamfer and and filet the scroll wheel cutout,
  make the back notch the same length as the left and right, then builld". **TODO (K2, from the 08:20 reset):** the wheel
  bay's corners chamfered at the one angle with the 1.0 mm fillets, the rear notch as long as the side notches, then the
  3D build with both power switch versions; also the wheel slide's knurl strip redrawn straight (F30.8).

## F33. How the revamp must sell (2026-11-05 07:16, STANDING for the revamp)
- **F33.1** Builders: "the last answer was meant to be \"as many as it takes to be as thorough as possible without being
  wasteful\"" (refines F32.2's "As many as it takes").
- **F33.2** "you should try to be improving".
- **F33.3** "remember for the revamp you need to visualize what most mice do wrong mechanically, not just what we do right,
  and the viewer needs to understand/show how a feature can be the difference between then making and missing a shot, semi
  marketing by fear of \"what if this goes wrong and you miss\" or if it's something that happens passively all the time
  making them miss show that as well a sort of excuse". So every slide draws the rival's mechanical fault, and shows the
  shot it costs: the one bad moment ("what if this goes wrong and you miss"), or the quiet, constant loss the player
  never notices (the excuse they never knew they had).
- **F33.4** "the main thing is you're trying to sell this thing and you're trying to make sure you're selling solutions to
  problems, not just solutions".
- **F33.5** "i also want to lose any of the ideas i said were important, but executed wrong, those concepts need to be
  vastly improved, with more importance than the other features" (read as *not* losing them: the ideas he called important
  but badly executed stay, are vastly improved, and get more weight than the rest). From F27: `cutouts`, `clk_front`,
  `clk_wedge`, `arc`, `anchors`, `sidebuttons`, `thinwall`, `shlSpecific`, `shlNoPick`, `shlMargin`, `shlThin`,
  `shlWork`, `shcArms`, `tolerance`, `shlsheet1`'s cutout seams, `ntr_density`, `zerograms`, `market`, `grip`.
- **F33.6** "not every feature has to be the difference between missing and hitting a shot as that would get repetitive,
  prioritize the best problem the feature can solve" (refines F33.3: each slide sells the strongest problem its feature
  solves, whether that's a missed shot, wear, comfort, battery or weight; the missed shot only where it is the best case).
- **F33.7** "increasing the skill ceiling the product allows could be a selling point too, i also need you to put an
  emphasis on how this mouse makes ZERO compromises, and highlight compromises other flagships make". So: the skill
  ceiling Theseus raises is one more problem a feature can solve (F33.6), and the film's spine is ZERO compromises, with
  each flagship's own compromise named and shown (weight for battery, shape for weight, durability for weight, optical
  for battery, and so on), sourced.
- **F33.8** "when you teaching engineering concepts in the presentation, research the type of examples professors have used
  in students to help them intuitively understand a concept at a glance". So each engineering idea is taught with a classroom
  demonstration, researched and cited: for example, a ruler bent flat and then on edge (stiffness and shape), a sheet of paper
  tearing at a nick (stress at a notch), the Comet airliner's square windows (why corners get fillets), a square of straws
  that sags against a triangle that holds (triangulation), a hanging chain flipped upright (the thrust line, as in Gaudí's
  hanging models), wood splitting along its grain (fibre direction), stacked coins (tolerance stack-up).
