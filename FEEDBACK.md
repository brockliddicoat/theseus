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

Last updated: 2026-11-04 09:58 (Chicago).

## Open with Brock

- **Pushing:** this branch (claude/review-notes-rework) can't be pushed from the session. GitHub answers "not in this
  session's authorized repository set". Enabling the repo for Claude (claude.ai Settings → Connectors → GitHub) fixes
  it. Until then the work reaches him as the live link and a patch.
- **Answered at 09:28 (F12):** the intro, clicks and Shell A questions. Only the tensioner's real dimensions are
  still open (F12.5).
- **SPDT:** F9.4 says "single pull double throw". The standard term is **single pole, double throw**, and the deck uses
  that.

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

- **F2.01 IN PROGRESS (own)** "i need a slide on how metal threaded inserts increase longevity and increase chances of
  tolerances be correct when assembled the first time, show chances of getting tolerances right and chances of it
  feeling different after unscrewing it (it should be like a 90% chance for abs plastic, and slightly lower for carbon
  filled plastic, which be the other material you're comparing to)"
  - Decided: F3.3, F6.1.
- **F2.02 IN PROGRESS (gld)** "the sensors window to focus is actually only 0.2mm optimally but you should talk about how
  most manufacturers only optimize for 0.4mm which can lead to issues"
- **F2.03 IN PROGRESS (gld)** "you effect show how the sensor works, and how it is just a camera, and show how the lens
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
- **F2.08 IN PROGRESS (r3d, srf, own)** "the encoder and screws need a massive revamp to look proper"
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
- **F2.12 DONE in Shell A, IN PROGRESS (shb, shc)** "show more force distribution animations, i think those will be really helpful"
  - Built on 07-sim.js (feFlow, feDraw).
- **F2.13 IN PROGRESS (srf)** "improve how the texture of the cerakote looks and make the fibers look more accurate"
- **F2.14 IN PROGRESS (srf)** "visualize and show cerakote can be laser etched in different shapes and spacings to create
  grip in exactly the right places in exactly the right directions, curation that grip tape doesn't allow for, because
  you need extra grip in a specific direction everywhere on the mouse, while allowing mobility in every other
  direction"
- **F2.15 IN PROGRESS (srf)** "show how this is the solid state solution that doesn't need adhesives that wear down over
  time or collect gunk"
- **F2.16 IN PROGRESS (shb)** "talk about how triangles from continuous lines (and therefore arches in dome shape like a
  mouse, show nasa mars base triangle domes) right now the presentation shows triangulated arches/ triangles forming
  arches, when it should show interwoven arches forming triangles)"
- **F2.17 IN PROGRESS (shb)** "show how these continuous lines particularly increase strength for materials filled with
  fibers, because fiber alignments is extremely important (bring up specific research on how high the potential
  strength increases are)"
- **F2.18 IN PROGRESS (shb)** "show a fluid simulation of how a filleted lattice helps sign fibers (if there is anything
  else that can be down to the lattice to better align it show it)"
- **F2.19 DONE** (`sealed`: "The encoder: the number one failure point") "talk about how no dust getting in the encoder is particularly important given the fact
  that the encoder is the number one failure point in a mouse"
- **F2.20 IN PROGRESS (shb)** "show how the left and right sides of the mouse near the bottom being flatter and less
  arched, and how that means extra design intent has to be spent to make the lattice thicker in those wasted, as well as
  possibly specifically where the thumb rests"
- **F2.21 IN PROGRESS (srf)** "talk about how the cerakote etching lets us do 2 tone designs without having to worry about
  a second coat adding weight or coming off (as seen in the finalmouse prophecy series)"
- **F2.22 IN PROGRESS (srf)** "talk about how cerakote is film thin and is the only coating that doesn't add weight because
  the sandblasting process blasts off almost as much as it adds"
- **F2.23 IN PROGRESS (srf)** "talk about how with most coatings it's very hard to tell if they will yellow over time, but
  cerakote is by far one of the safest because of its industry leading chemical and uv resistance (like how the ulx
  pros yellowed)"
- **F2.24 IN PROGRESS (shb)** "i need an elaborate and in depth force simulation, bending simulation and and text
  explanation of why/how arches are so strong, as well as a comparison to flat planes"
- **F2.25 IN PROGRESS (shb)** "talk and visually about how the filets making milling the mold easier and reduce the
  tightest tolerance"
- **F2.26 IN PROGRESS (shc)** "i feel like the pcb being used as a reinforcement isn't demonstrated enough. i want to talk
  about how unexpectedly strong fr4 is (compared to even magnesium alloy directly). why in engineering it is so important
  to draw on all the resources you have access too. and how many mice just use small arms of fr4 to reinforce the pcb
  which are easy to break of or snap under force, but how we plan to use THE WHOLE PCB."
  - Decided: F6.3.
- **F2.27 DONE in the intro and Shell A (`shlGrams`), IN PROGRESS (elc)** "also dont worry about weight compared to the xa25, i have that covered, we will be
  able to cut weight elsewhere with my shell design to hit that 200hr"
- **F2.28 IN PROGRESS (ntr)** "after the comparisons, i think our solution needs a stats slide of their own with a bunch of
  important numbers on big fonts that tick up with an animation, maybe sometimes the "next best" is in a smaller lore
  darker font"
  - Done: `ntr_stats`, "Theseus, by the numbers", a bento whose tiles count up, with the next best smaller, darker and
    in yellow, with its source. Shared helper: statTile with `next` (now with `next.ev` / `next.by` / `next.src`).
- **F2.29 DONE in shared code, IN PROGRESS per slide (elc, r3d)** "we don't have a front and back pcb," / "it'll be a
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
- **F2.38 IN PROGRESS (elc)** "show a simulation benefit of the and statistic of braiding the wires"
  - The benefits to show: F3.6.
- **F2.39 STANDING, IN PROGRESS (all)** "whenever there is a simulation it needs to be given lots of screen real estate
  those are very convincing and a lot of work goes into them"
- **F2.40 IN PROGRESS (shc)** "the keeping the mass low near the fingers slide needs to be revamped to be much better and
  make a better argument/be more intuitive"
- **F2.41 STANDING, IN PROGRESS (all)** "make sure no assets overlap where they shouldn't"
- **F2.42 IN PROGRESS (elc)** "remove any slides about the dongle as i'm unsure if i want to do the side arm system or not"
- **F2.43 STANDING, IN PROGRESS (all)** "i like the animations where you show the mouse cursor moving things"
  - Shared helper: cursorAt.
- **F2.44 IN PROGRESS (own), STANDING for titles (all)** "i want you to specifically mention newtonian shape analysis, i'm
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
- **F9.13 IN PROGRESS (r3d, elc)** "the raytac module needs to be flipped so it's further from the scroll wheels metal, and
  id lowk you to use the long antenna design i've attached"
- **F9.14 IN PROGRESS (r3d, gld)** "the sensor and snap on lens are both not as accurate as id like, you need to squeak out
  a lot more accuracy using the images i've attached"
- **F9.15 DONE in 2D (`clk_switch`), IN PROGRESS in 3D (r3d)** "the internals on the gt01 switch are not right and it bothers me, before the old switch
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
- **F9.20 IN PROGRESS (gld)** "we need to talk about the importance of having one or 2 dot skates by the sensor to prevent
  sag and keeping the sensor focused correctly"
- **F9.21 DONE in the shared 2D drawing (`encoderMM`, TTC's form) and `sealed`, IN PROGRESS (r3d, srf)** "the encoder you are using is wrong, optical encoders look no different than normal mouse
  encoders, i've attached picture of what the interior looks of an modern mouse optical encoder is like, usually they're
  a little taller than that though"
- **F9.22 STANDING** "again this is just me giving you more guidance, do not abandon any of my old guidance unless i've
  intentionally overwritten it"
- **F9.23 DONE in Shell A (`shlMargin`: the plane cracks at 67 N, the triangles hold to 126 N) and the heat scale, IN PROGRESS (shb, shc)** "you need to better explain how lower peak force hotspots are
  better, and peak force areas should also be colored in red so the viewer knows they're bad. show the risk of breakage.
  this should tie in with a lot of the other advice i've given you, you should try to make as many concepts tie together
  as possible"
- **F9.24 DONE in shared code, IN PROGRESS per slide** "i dislike anywhere where you use peach tones, especially if it's
  depicting skin (it's hard to tell) skin tones should always been mono tone"
- **F9.25 IN PROGRESS (r3d, elc)** "i'd like you to modify the way the raytac module looks, it should be black instead of
  blue"
- **F9.26 DONE** (zerograms argues it from F = m·a) "it feels like you're arguing against me when you say that there's no research to support zero
  grams is actually the optimal weight, it is well known in the enthusiast community that less weight feels better because
  f=ma, so mass means less inertia means quicker target switching when changing directions, there should also be other
  theories that are all but proven, the inertia thing means it should be objective easier to switch targets, even though
  there isn't a study to prove it, it feels pretty solid to me"
- **F9.27 DONE in shared code (feDraw fillet) and Shell A, IN PROGRESS (shb, shc, r3d)** "we have slides about the
  importance of filleting the lattice, but none of the lattices in our visualizations other than those slides are
  filleted, this is an issue"
- **F9.28 DONE in the shared key plan and clicks, IN PROGRESS in 3D (r3d)** "we talk about how it's better to have 1 seam in our slides
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
- **F10.2 IN PROGRESS** "i'd also like you go back to giving me a live link that you update so i can see the progress
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
- **F12.3 DECIDED** "yes density should be ranked among wireless mice only, show the xa25 but shoe it not be taken into
  account for be wired". **TODO (intro):** `ntr_densrank` shows the XA25, marked wired and not ranked.
- **F12.4 DECIDED** "the shell holds the switched instead of a pcb". **TODO (clicks):** the full-size side switches are
  held by the shell, not by a side board.
- **F12.5 OPEN** The tensioner's real width, span and crown: "unknown yet". The slide keeps its labelled example.
- **F12.6 DECIDED** "abandon idea #59". **TODO (clicks):** remove #59 (the taller fulcrum) everywhere.
- **F12.7 TODO (clicks, r3d)** The GT01: "it looks fine besides the fact that everywhere you draw it looks like there's a 4
  extra pin in the front and that's not right".

New notes:
- **F12.8 STANDING** "in the future use the question tool to ask me questions instead of doing it the old fashioned way"
- **F12.9 TODO (clicks, r3d, shared key plan)** "right now the rear trigger cutouts have a sort of notch in both
  visualizations instead of being an entirely straight line, which looks funny, also the straight light version needs
  to go back future"
  - Asked how far back: "To the smile's deepest point", level with the deepest point of the Sora V2's curved cutout.
- **F12.10 TODO (new base-plate builder, after r3d)** "the optional bottom plate has big holes instead of tiny triangle
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
