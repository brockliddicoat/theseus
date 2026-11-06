# B02 progress: Clicks I, the mechanics that matter most

File: deck/src/30-b02-clicks.js (prefix `b02_`). Work: /home/claude/work/b02/ (shots/, refs/, scripts/).
Build: `cd /home/claude/theseus/deck && python3 tools/build.py main --out=b02 --own=30-b02-clicks.js`
Checks: `export NODE_PATH=/opt/npm-tools/node_modules`; `Q='&2d=1'` always; errs / qa (settle, mid) / shoot PAR=1.
Before my first slide: `b01_budget` (Where 29.31 g goes). After my last: `b03_switch` (A mechanical switch, for the battery).

## Status (update as I go)
- [x] Phase A reading: common.md, b02-brief.md, FEEDBACK (STANDING, DECIDED, F27 notes, F32 to F35, F38), REVAMP.md,
      DESIGN.md, old slides in 10-b-click.js (+ grooves in 10-g-shape.js, shlsheet1 in 12-20-shell.js), Brock's doc and
      comments, his tensioner and GT01 photos, the 3D twins (geo2d shell / shell-sora trigger outlines), board plan 5.
- [x] Research (web budget for the turn ran out after ~25 searches; what's needed is below).
- [x] Storyboards (below).
- [x] KIT.md landed 08:03 (read; the kit is in the snapshot: build with --own=30-b02-clicks.js only).
- [x] b02_cutouts built and checked (errs ok, qa clean settle+mid, frames judged) → CHECKPOINT1.md written (08:2x).
- [x] 08:40–08:50: cutouts headline re-aimed at what the finger feels (extra weight at the outer side 5.3 → 0.0 gf); the
      loupe keeps the switch's sideways travel 8.0 → 0.0 %; source states the model; greys to tokens; dev slide gated (?b02lab=1).
- [x] b02_front built (09:15): establish front view → push-in to the left trigger's lip (true scale, magnified 1 → 4×
      during the push), the end-on finger + press arrow, grooved lip rolls onto its ledge at 8 / 16.5 mm (red spot, wear
      marks, "Rocks 0.42 mm at the edge, 0.8° each way"), morph to flat, the whole front lands (blue), the last press held
      to settle; rocker vs flat block classroom; verdict "Rock at the button's outer edge 0.42 → 0.00 mm"; errs ok, qa
      clean at 3.7 / mid / settle.
- [x] Critic R-b02-1..8 on cutouts answered in review/b02.md (09:20): 1, 4, 5, 6, 8 FIXED; 2, 3, 7 WHY NOT with reasons.
- [x] BROADCAST-0850 (mouseSimple plan-5 parts): cutouts and front re-shot at 0 / mid / settle; nothing they point at moved
      (no callout targets the sensor, battery, antenna or board). B02.sw (GT01 at x 16.0, mouse z 36.72) is from board
      plan 5's notes, not in KEY_PARTS: asked in the report.
- [x] 09:00–09:45 built the other ten: b02_flush, b02_seams, b02_direct, b02_wedge, b02_rails, b02_grooves, b02_tensioner,
      b02_stiff, b02_pom, b02_card (film order in the file: card, cutouts, seams, front, grooves, flush, direct, wedge,
      tensioner, stiff, rails, pom). All 12: errs ok; qa clean at settle and mid; frame 0.6 sheet checked
      (/home/claude/work/b02/shots/all06/sheet.png).
- [x] Broadcasts 0845 / 0850 / 0930 / 0945 applied: true greys; plan-5 parts (re-shot); GT01 walls (re-shot direct, wedge,
      card); FILM F3 (cutouts verdict "Click force spread across the button"); F20 (no unsourced "most": flush says "the
      default way"); research fills applied (nickel, LaMotte, Dandekar, GPX2, the JND not used on a slide).
- [x] Review file: R-b02-9..15 and M-b02-1..6 answered (09:45), all musts FIXED.
- [ ] Each slide: built, errs ok, qa settle+mid clean, frames 0.6 / mid / settle judged at 960×540 and phone (0.44×).
- [ ] Integrator feedback acted on. Final report.

## Shared code I call (no private copies of the board, switch or shell)
- `clk_gt01MM(o)` (10-b-click.js, H1 updates its walls): the GT01 side view, press 0..1, state 'nc'|'no', clear, board.
- `clickMM` / `drawClick` + `clickGeo` (03-parts.js): the click mechanism side section (shell, boss, insert, one screw,
  block, bridge, trigger, post, board, upright switch or GT01 via o.gt01). CKG: crown RC (-1.4, 0.2), foot (30, 11.63):
  the arc at the plunger is 20.0°. `swMM` (upright D2F-class switch).
- `clk_ten(kind, mat, o)`, `clk_ribbon`, `clk_lever`, CLK_TN (K1's frame model of the tensioner, 07-sim.js solver).
  flat/bridge in PP-C-20A: 26.9 / 7.7 gf at the fingertip (40 mm out) from the tensioner alone, to 0.35 mm at the plunger.
- `SIM_MAT` (PP-C-20A 13.5 GPa, ABS 2.55 GPa), `heatCol`, `feElPts`.
- Kit (when it lands): mouseSimple, establish, locator, finger, forceArrow, spring, pressCurve, abSplit, wipeTo, verdict,
  shotInset (sparingly), demoPanel, scaleNote, chapterCard2, LEDGER/ledger.
- 3D-derived data: GEO2D['shell'] / GEO2D['shell-sora'] trigger outlines (top view = axis '1', (X, Z) mm, +X = user's
  left, +Z forward). Sora rear edge fit: z = 0.0059x² + 0.0461x + 4.718 (rises 4.8 mm centre → x 24.9). Theseus: straight
  at z ≈ 4.85 (KEY.seam -4.84). Board plan 5: GT01s at x ±16.0, board z 39.6 (mouse z 36.7, board offset -2.88).

## Human scale used on the slides (M5)
- A click: the GT01 operates at 55 ± 5 gf (MechKeys/Gateron claim) ≈ the weight of a large egg (~57 g, USDA large);
  0.54 N. Fingers press 2.5 to 4.6× the activation force at peak (Radwin & Jeng 1997, Human Factors 39(1):130, citing
  earlier studies): so a press is ~1.5 to 2.5 N. Mean button force over mouse use 0.35 N (Johnson et al. 2000, SJWEH 26(5)).
- Sizes: 0.05 mm ≈ a hair (~0.07 mm); 0.35 mm pre-travel ≈ 3 to 4 sheets of paper (0.1 mm); a credit card is 0.76 mm
  (ISO/IEC 7810 ID-1). Fingertip ≈ 16 mm wide (commonly cited MIT Touch Lab range 16 to 20 mm: not verified this turn,
  web budget out; use "about 16 mm" and say it is typical, or drop the number).
- Skin friction on a hard textured surface μ ≈ 0.42 to 0.53 at 1 N (Zhang et al. 2017, Tribology Letters: srf_zhang17).

## Classroom demonstrations (F33.8), cited
- Cutouts: fold a sheet along a square crease: the flap lands on itself; along a diagonal: it swings off to the side. (And
  curved creases fight the fold: Albers' Bauhaus course 1927–28, concentric circles pop into a saddle (Demaine's history
  page); Dias, Dudte, Mahadevan & Santangelo 2012, PRL: "frustrated by geometry, forcing it to buckle".) Use the diagonal
  fold as the main image; the curved crease as one quiet line if room.
- Front: a rocking chair rocks onto a new spot wherever you lean; a flat-footed stool lands the same way every time.
- Grooves: a marble in a bowl is pushed back; a ball on a hill runs off (OpenStax College Physics §9.3, Stability).
- Direct drive: the lawn mower pushed at an angle: only F cos θ moves it (OpenStax College Physics §7.1, Figure 7.2).
- Wedge: stacked parts, each with its tolerance, add up (worst case: the sum; statistically root-sum-square). Same law as
  b07_tolerance's stacked coins: say "more in the shell chapter" (callback) and keep the visual on mouse parts.
- Tensioner: a living hinge (a flip-top cap): a thin section decides where plastic bends, and how easily.
- Stiff: a door and its hinge: a stiff door goes where you push, the hinge's spring sets how hard; a floppy door bends
  first (mush). (Brief suggested a diving board; a door reads better: the board itself is the spring on a springboard.)
- Rails: a drawer on one runner wobbles and rubs; on two runners it slides straight.
- POM: a shim: machinists fill a measured gap with the shim that fits.

## Sources found (for SRC entries, b02_ keys)
- TechPowerUp Viper V3 Pro review p3: "the main buttons no longer extend across the entire width of the mouse, and are now
  framed by ledges" (https://techpowerup.com/review/razer-viper-v3-pro/3.html).
- TechPowerUp Viper V2 Pro p4: "lateral button movement is minimal and must be provoked to become noticeable".
- TechPowerUp OP1 8K p4: "The main and side buttons sit on their own PCBs screwed into the top shell", "connected through a
  3-pin connector"; "The left button has low pre and moderate post-travel", right "moderate pre and post-travel"
  (https://techpowerup.com/review/endgame-gear-op1-8k/4.html). = the sub-board rival for b02_wedge.
- Back2Gaming Starlight X (shlB2gSlx, existing): openings "limited to a few cutouts flanking the scroll wheel and the inner
  edges of the main buttons" = the seams rival.
- TechPowerUp ULX (tpuUlx, existing): high post-travel, lateral play; anchors' quote "can move laterally quite a bit when
  pushed" = rails / pom / stiff rival.
- Protolabs 2023 (clk_protolabs, existing): molds ±0.076 mm.
- Delrin 150 (delrin150): dynamic friction 0.20. Omron D2F (omronD2f, omronD2fPre): flat mount, no off-axis rating.
- OpenStax College Physics §7.1 Fig 7.2 (lawn mower, Fd cos θ) and §9.3 Stability (marble in a bowl, ball on a hill).
- Radwin & Jeng 1997 (peak keying force 2.5 to 4.6× activation). Johnson et al. 2000 (0.35 N mean on the button).
- Dias et al. 2012 PRL (curved crease buckles); Demaine, history of curved origami (Albers 1927–28).
- Brock's doc (clk_brock): #2, #3, #17, #18, #28, #46, #47, #48, #49, #50, #58, ceiling-facing (#1 flat-base list:
  FCC-1 → RCC-1, voted 3× more popular at last year's Peripheral Awards, no ring-finger pinch), brainstorm lines (front
  bottoms out at the same time; grooves "hugged"; "2 axis comfort grooves"; GPX-level post travel; LA-1 POM pads still
  ground; "either super stiff or mushy" dual plungers (comment thread)).
- Not found (web): a review calling the Starlight X's clicks stiff: it is Brock's own observation (no tag, F9.5); a source
  for why Razer straightened the V3 Pro's cutouts (his doc says "likely ... after complaints": say it as his reading).

---------------------------------------------------------------------------------------------------------------------
## The slides (film order). Times are slide seconds. Theme alternates: card night, then paper / night ...

### 1. b02_card (chapter `click`, first: true, night, settle ~5.5): Clicks that land the same, every time
- Replaces `clicks` 7/10: "switch plunger on the gt01s is still turned vertical, bottom part looks fine but the part that
  actually sticks out above the housing looks like it needs to be turned 90 degrees". F32.1.
- The kit's chapterCard2: compromise "A click that changes with where and how you press" → answer "Lands the same, every
  time". The part: the GT01 from clk_gt01MM (H1's walls, the cap turned 90°: side-on 1.5 mm with a round top, 0.80 mm
  proud; across it 2.1 mm), pressing in a slow damped loop (spring) under a fingertip arrow. Ledger strip focused on clicks.
- 0 s header + card name + compromise in red; ~1 s the GT01 pressing; ~2.5 s the answer turns blue; 4 s list settled.
- Hand-off from b01_budget (weights) → "the click is where the weight meets the finger" (no: keep the card standalone);
  hand-off to cutouts: the list's first item is "Straight rear cutouts" and the card's GT01 is the switch the cutouts
  slide's plunger lands on.
- Answers: [the plunger above the housing turned 90°] → drawn by the shared clk_gt01MM (K1 v22 + H1): show the cap's
  1.5 mm side with its round top; zoomed inset? (only if the card has room: a 3× loupe on the cap). [bottom part looks
  fine] → kept, with H1's thicker straight walls.

### 2. b02_cutouts (paper, settle ~11): Straight rear cutouts  ← MOST IMPORTANT, build first, CHECKPOINT1
- Replaces `cutouts` 3/10: clauses: (a) "everything here is among the most important concepts" (b) "probably has the worst
  graphic design in the entire deck" (c) "it's super unintuitive to understand because you can hardly tell which part of
  the mouse you're looking at it's so abstract" (d) "also the benefit to the player isn't really sold". F33.5.
- Problem: the Sora V2's smile (the rear cutout dips 4.8 mm at the centre: Brock's scan via the 3D twin). The trigger's
  spring arm (tensioner) bends along the cutout (#17: it "has to take the shape"), so at the switch line (x 16 mm) the bend
  line leans 13.2° (chord of the scanned smile over a 10 mm tensioner). The trigger turns about a diagonal: it tips toward
  the middle as it goes down ("bends inward diagonally"), the plunger is pushed sideways (sin 20° × sin 13.2° = 7.8 % of
  its travel: the 20° is the post's arc, CKG), and the lever to a press depends on where across the button it lands:
  pressed 8 mm inside the switch line ≈ 47 gf, 8 mm outside ≈ 52 gf (≈10 % apart; force JND is ~7 to 10 %, so you feel
  it). Same switch (GT01 55 gf at the plunger) and same bridge (7.7 gf) on both: only the cutout differs (M3).
  Razer: V2 Pro angled → V3 Pro straight (Brock's doc; TPU: V3 Pro's buttons "framed by ledges").
- Fix: straight cutout, each tensioner centred on its own switch (#17, #18): the bend line is square, the trigger tips
  straight, nothing sideways, the same click anywhere across the button (49 gf).
- Demonstration (M1 to M4): establish on the simplified mouse from above (kit), the rear cutout drawn as the Sora's smile
  in red, the tensioners dashed under it; push in to the left trigger; the camera tips from top-down into a 3/4 view of
  the trigger as a 3D plate (my b02_ projector: the trigger outline from GEO2D + a gentle crown), hinged on its bend line,
  the post and switch under it. Finger presses (kit finger + pressCurve), motion drawn 20×.
  - 0.0: header, whole mouse top view, smile lit red + "Ninjutso Sora V2: a smile". Caption 1.
  - 0.6–2.0: push-in + tilt to 3/4; locator in the corner; the bend line dashed along the smile, its 13.2° lean arc.
  - 2.0–3.4: press 1 at the inner side: the plate corkscrews toward the middle; the post foot's swing arrow leans (red
    sideways part); readout 47 gf. 3.4–4.6: press 2 at the outer side: readout 52 gf. Both stay as two marks.
  - 4.8–6.0: wipeTo / morph in place: the cutout straightens (smile → line), the bend line swings square, the tensioner
    slides onto the switch line. Same two presses: straight tip, 49 / 49 gf.
  - 6.6–8.0: verdict (kit): Sideways at the switch 7.8 % → 0 % (lower is better), with lean 13.2° → 0° and "inner vs outer
    edge 10 % → 0 %". Player line: "The same click wherever your finger lands across the button."
  - classroom (small demoPanel, beside, quiet): a paper flap folded on a square crease lands on itself; on a diagonal it
    swings to the side. Runs with the rival phase, then dims.
- Headline: SIDEWAYS 7.8 % → 0 % (and the click force spread). Hand-off: ends on the top view of the straight cutout and
  the trigger; seams starts on the same top view, front half.
- Answers: (a) kept as the chapter's lead idea with the most care; (b)/(c) establish on the whole mouse, push-in, locator,
  the trigger drawn as the trigger (its own outline from the 3D model), not abstract blocks; (d) the benefit stated and
  shown: the same click anywhere across the button, nothing wasted sideways. F33.5.

### 3. b02_seams (night, settle ~10): Seams that keep your fingers out
- Replaces `shlsheet1` 4/10: (a) "most important thing here is the right cutouts thing" (b) "and it should be back by the
  other cutouts slides" (c) "and it needs a lot more detail" (d) "especially how the further the seams are from the center
  the easier they are to get your fingers caught in them" (e) "we don't have to talk about the pro model yet" (f) "and i'm
  unsure about the the sticker". F33.5.
- Problem: a cutout round the wheel (Starlight X: "cutouts flanking the scroll wheel and the inner edges of the main
  buttons", Back2Gaming) puts two seams at the triggers' inner edges, ±4.7 mm out, right under the index and middle
  fingertips in a claw / 1-3-1 grip (#58). A seam between a moving trigger and a fixed part opens a step when you press:
  the fingertip's skin drapes into it and catches (and pinches on the way back up).
- Fix: the Sora's one split from the nose to the rear seam with the wheel in it (F11.3): one seam, in the middle, which
  sits in the gap between the two fingers.
- Demonstration: top view of the front half (kit mouseSimple top, pushed in), two fingertip pads (kit finger, from above)
  resting; the pads' outline shows which seams are under skin (red where a seam crosses a pad). The index finger presses
  and slides inward a few mm (as on a flick); a magnifier (front view) at the seam: the pressed trigger drops 0.5 mm below
  the strip, the pad drapes into the step and snags (red). Wipe: the slot closes into the one split; same press and slide:
  nothing under the pads, the magnifier shows a flat continuous surface.
- Headline: Seams under your fingertips 2 → 0 (lower is better); "gaps your finger can catch: 2 → 1, and that one sits
  between your fingers". Classroom: a door's hinge-side gap pinches; keep fingers out of gaps that move (pinch points).
- Answers: (a) #58 is the slide; (b) placed right after the rear cutouts; (c) more detail: a magnified fingertip at the
  seam, the step, the snag; (d) shown: seams at ±4.7 mm sit under the fingertips, one at 0 sits between them; (e) the pro
  model (PPS triggers) is not on the slide; (f) the sticker is not on the slide (it may come back with the bottom cover,
  later).
- Hand-off: ends with the fingers on the front of the triggers; front slide looks at the triggers' front edge.

### 4. b02_front (paper, settle ~11): A flat front: no wobble
- Replaces `clk_front` 8/10 (shared with b02_grooves and b02_flush). Clauses this slide answers: (a) "this slide has second
  worst execution in the deck" (b) "it fails to intuitively communicate what is going on. if they were not my ideas i'd be
  very lost" (c) "the left needs to compare to what happens when you don't have a straight front, like when there is heavy
  front comfort grooves" (d) "and how that can cause wobble side to side, because the front will never reach the bottom in
  the same spot at the same, and where it reaches the bottom first will depend on where you press it" (e) "create wobble
  which makes the parts feel cheap and wear out faster" (h) "these are all very important concepts and probably should be
  spread out over multiple slides, but still dense in information, not too many slides" (→ three slides: front, grooves,
  flush). Clauses answered on other slides: (f) cross sections / shallower grooves → b02_grooves; (g) lock fingers in,
  surface area → b02_grooves; (i)(j) right half, gaps, ceiling or wall → b02_flush.
- Problem: heavy comfort grooves that run to the front edge curve the trigger's front edge (a dip in the middle) and the
  ledge it lands on ("trigger underwear"). Two molded curves never match exactly (Protolabs ±0.076 mm): the front lands on
  one spot first and rocks on it, and which spot depends on where you press. Wobble side to side: feels cheap; every
  bottom-out hammers one small spot: it wears.
- Fix: #46 + #47: the grooves shallow to nothing before the front, so the front edge and its ledge are flat and parallel
  to the ground: the whole edge lands at once, on the same line, every press; and flat faces are easy to recut to tune
  post-travel (#46).
- Demonstration: establish on mouseSimple front view (the triggers' front edges lit), push in to the left trigger's front
  face, drawn as an elevation (solid, no hatching). Finger presses left of the groove: the trigger tips left and lands on a
  contact dot A; presses right: tips right, lands on B; it rocks between them (motion drawn 20×; contact dots ring).
  Wipe to the flat front: same two presses, the edge lands flat along a line (the whole line lights), no tilt.
  Model: groove depth at the front edge 0.6 mm (heavy), edge/ledge mismatch Δ = 0.1 mm (inside two ±0.076 mm molds):
  rocking range θmax = Δπ/W ≈ 0.69° on a 26 mm wide button, contact spot travels ±6.5 mm, ±0.16 mm at the outer edge.
- Headline: Rock at the front ±0.7° → 0° (lower is better); "lands on one line, every press". Classroom: rocking chair
  vs a flat stool (small panel, synced with the rival's rocking).
- Hand-off: ends on the flat front edge with the grooves running out before it → grooves slide (what the grooves do).

### 5. b02_grooves (night, settle ~10): Grooves that lock your fingers in
- Replaces `grooves` (not rated; no clauses). Also answers clk_front's (f) "i don't think cross sections are the best way to
  communicate the comfort grooves that get shallower near the front" and (g) "also it needs to be explained that these
  help lock your fingers in across another plane of motion and increase surface area contact since the front has more
  surface area too". F33.5.
- Problem: a plain crown pushes the finger outward: at the pad's edge 23 % of the press points outward (crown R 30, pad
  ±7 mm) → the fingertip drifts off the switch line over a session, and a sideways load slides it off.
- Fix: #47 comfort grooves that outpace the crown (R 18): the push turns inward (15 %) from both sides and holds the
  finger ("hugged", Brock's doc): locked across, while the trigger moves down (another plane of motion). The groove
  cradles the pad: contact patch ~51 % wider (geometry: gap = x²/2 (1/Rf ± 1/Rs), Rf 8 mm). It shallows toward the front
  (0.6 mm at 20 mm back → 0 at the edge), where the fingertip's front sits: more contact there too, and it lets the front
  stay flat (callback to b02_front).
- Demonstration: the button in perspective (a 3/4 view of the trigger's surface, shaded, the groove as a soft valley that
  fades toward the front; no sections). A fingertip (kit finger, front view) presses; arrows along the surface normals at
  the pad's edges; a sideways nudge (forceArrow, ~0.3 N, a flick's side load): on the crown the finger slides off toward
  the edge; in the groove it stays. Classroom: marble in a bowl vs ball on a hill (OpenStax §9.3).
- Headline: Sideways push at the pad's edge 23 % out → 15 % in. Second: contact width +51 %.
- Hand-off: the finger held on the button → flush: what the finger feels at the button's outer edge.

### 6. b02_flush (paper, settle ~11): Flush walls, small gaps
- New slide; its notes from clk_front's right half: (i) "for the right visualization, it genuinely took me so long to
  realize that you weren't demonstrating an alternative to the the left demonstration" (j) "you need to show how some mice
  do that concept wrong to create larger gaps than there should be and how we do it right" (k) "this is also an amazing
  opportunity to demonstrate why the cutouts are ceiling or wall facing". (These clauses are answered in b02_front's
  answers too, pointing here, since flush replaces nothing.)
- Problem 1: wall-facing (sideways) cutouts: the gap runs along the side, in the direction the trigger moves, so a press
  closes it: a ring finger resting across it is pinched (Brock's doc: ceiling-facing voted 3× more popular at last year's
  Peripheral Awards; ARYE went FCC-1 → RCC-1). Problem 2: ceiling-facing but the wall set level with the trigger at rest
  (the default way, #48): a press sinks the trigger 0.6 mm below the wall: a step and a deep gap under the pressed finger;
  raised too high is just as bad (#48).
- Fix: ceiling-facing cutouts with the shoulder walls level with the pressed trigger (#48; averaged along the trigger,
  since the rear starts 0.4 mm higher when pressed: Brock's doc): at the click, flush: no step, smallest gap, nothing to
  pinch.
- Demonstration: one front view of the trigger's outer edge and the shoulder (establish: front view, the edge lit; push
  in), a finger pad lying across. Same press each time. Rival A wall-facing: the gap closes on the skin (red pinch); morph
  the cutout to ceiling-facing with a low wall (rival B: the step opens, the pad drops into it, red); then the wall rises
  to the pressed height (Theseus): flush at the click (blue line, the step reading 0.00 mm).
- Headline: Step under your finger at the click 0.6 mm → 0 mm; pinch points 1 → 0. Human scale: 0.6 mm ≈ most of a credit
  card's thickness (0.76 mm).
- Hand-off: from front views to the side: "the trigger's press is straight down at the edge; inside it swings on an arc"
  → b02_direct.

### 7. b02_direct (night, settle ~11): Direct Drive Actuation
- Replaces `arc` 7/10: (a) "tensioner doesn't look accurate" (b) "i dont like the use of the metrics "pts" or "points"
  anywhere" (c) "this is a really important slide the concept is good but it needs to be demonstrated and sold better" (d)
  "i think direct drive means the peak theoretical reaction time should be 20% faster because 20% more of the force goes
  where you actually intend it". F15.1, F16.1, F31.2 (keep "6 % sooner" with why not 20 %), F33.5.
- Problem: an upright switch (D2F-class, mounted flat per Omron) under a trigger that swings about its bridge's crown: at
  the plunger the post moves 20° off the switch's axis: 34.2 % of its motion shoves the plunger sideways into its guide
  (scrape, mush, wear); only 94 % runs along the axis.
- Fix: the GT01's bottom housing turns the switch 20° onto the arc: 100 % along, 0 % sideways. The click lands 6 % sooner
  at the same press speed (1 − cos 20°); not 20 %, because the sideways third is at right angles to the axis, so turning
  the switch only lifts the along-axis part from 94 to 100 %.
- Demonstration: establish (side view, the left trigger and its switch lit), push in to the post and switch (drawClick with
  the K1 tensioner: shell skin, cutout, boss, brass insert, one screw, block, bridge, trigger, post). Rival: the pointer /
  finger presses; the post's path drawn as an arc; at the plunger a loupe: the along and sideways parts as arrows, the
  plunger rubbing its guide (scuffs accumulate per click). Classroom: the lawn mower (OpenStax Fig 7.2) as a small panel:
  F cos θ moves it. Then the switch turns 20° in place (morph via o.tilt), the same press: the arrow lies along the axis.
- Headline: SIDEWAYS 34 % → 0 % (one precision: 34.2 % → 0.0 %); 6 % sooner as the second line with its why.
  Callback: "Possible because the rear cutout is straight: the swing stays in one plane, so one tilt meets it."
- Answers: (a) the tensioner drawn from the shared clickMM (block, one screw, bridge, square joints) after his photos;
  (b) no pts anywhere; (c) a demonstration (rival scraping, same press on the GT01, the loupe, the lawn mower) and the
  sell (no scrape, no mush, no wear, 6 % sooner); (d) 6 %, with the reason on the slide (F31.2).

### 8. b02_wedge (paper, settle ~10): One flat board, fewer parts
- Replaces `clk_wedge` 4/10: (a) "important concept, very poor execution" (b) "could be closer to the less parts is better
  demonstration" (c) "show after youve shown the problem with having more parts". F33.5.
- Problem: to tilt a switch, mice add parts: Endgame Gear's OP1 8K puts the switches on their own boards screwed into the
  top shell with a 3-pin connector (TechPowerUp). Each part (the shell's boss, the sub-board, its screw, the connector, the
  solder seat) adds its tolerance to the switch's angle and height, and each joint can shift over time.
- Fix: the GT01's bottom housing holds the angle: the switch stands straight-legged on the one flat board (5.6 g).
- Demonstration: side view, the rival's chain built up part by part (each drops in with its ± band: a small fan of
  possible positions), the switch's axis fan widening as the parts stack (worst case = the sum); a screw loosens a
  little over time (the fan shifts). Wipe: the chain collapses to the GT01 on the flat board, one fan, narrow.
- Numbers: parts between the board and the angled switch 4 → 0; angle error worst case ±X° → ±Y° (stated per-part
  values, "illustrative tolerances": e.g. boss ±0.05 mm, board ±0.08 mm thickness, screw seat ±0.05 mm, solder seat
  ±0.05 mm over a 10 mm footprint). Link: "Stack-up in full: the shell chapter" (b07_tolerance).
- Answers: (a) rebuilt as a demonstration; (b) the stack of parts with their tolerances adding up, the same law as the
  stacked coins (b07); (c) the many-part chain first, then the one-part answer.

### 9. b02_tensioner (night, settle ~11): The bridge tensioner
- Replaces `tensioner` 8/10: (a) "reference the starlight x's stufd clicks from using such a stiff composite materiak with
  no bridge" (b) "market top as "as seen in starlight x" or something like that, and bottom as proposed solution" (c)
  "also the rounding where the bridges meets the trigger looks bad, ie needs to connect without filets". F2.04, F26.1,
  F18.6 (scale to peak; the bridge connects the two pieces).
- Problem: a flat tensioner in a stiff composite (as seen in Starlight X, Brock): it bends all along, hardest at the screw,
  and the click comes stiff. Fix (#50): a bridge, an arch thinning to its crown: it bends there, easily.
- Demonstration: K1's frame model (clk_ten flat/bridge, PP-C-20A), drawn as it sits in a mouse (clk_lever / clk_ribbon:
  the shell skin, the cutout, the boss with the brass insert, one screw, the block, the band, the trigger riser and post,
  the switch), square joints. Establish: side view with the tensioner lit; push in. Same press on both (7.7 gf): the bridge
  clicks, the flat plane has moved 0.10 of 0.35 mm; then the flat needs 26.9 gf. Stress heat to the peak (red), the
  curvature trace under each.
- Headline: Click force at the fingertip 68 → 49 gf (switch included: 55 gf at the plunger is 41 gf at the fingertip) and
  the spring's own share 27 → 8 gf. Classroom: a living hinge (flip-top cap).
- Answers: (a) top row reads "As seen in Starlight X" with the stiff composite and no bridge, the click stiff; (b) top
  "As seen in Starlight X", bottom "Proposed solution"; (c) square joints, no fillets (clk_ribbon cut square).

### 10. b02_stiff (paper, settle ~10): A stiff trigger, a light click
- Replaces `clk_tenmat` 4/10: (a) "hard to understand" (b) "and stiffer is better doesn't seem right". F2.04.
- Two jobs, said plainly: the body must not bend (crisp, short post-travel: Brock "gpx-level post travel"); the bridge alone
  sets the force. Rival: soft everywhere (ABS): the press bends the button before the switch trips (mush), and after the
  click it springs (post-travel). TPU on the ULX: high post-travel. Theseus: a stiff body (PP-C-20A, 13.5 GPa, 5.3× ABS)
  and a light bridge.
- Demonstration: one trigger side-on, the finger presses with the same force: ABS body bends (exaggerated, the curvature
  shown), the fingertip travels further before the click, then overshoots after; Theseus body stays straight, the bridge
  turns. Classroom: a door and its hinge.
- Headline: Fingertip travel lost to flex (lower is better) X → Y mm (from the frame model with each E), and "same light
  click: 49 gf". Answers: (a) two jobs, one demonstration; (b) "stiffer" only for the body; the spring is the bridge.

### 11. b02_rails (night, settle ~11): Dual rail main clicks
- Replaces `anchors` 7/10: (a) "locking the motion to one plane/ direction needs to be better explained" (b) "and the
  visualization here is too abstract and difficult to tell what you're looking at" (c) "i also dislike how the dual
  plungers and pads aren't uniform" (d) "and you need to sell the benefit here a little better, talk about how the bad
  version feels cheap and causes more wear over time fork being losing" (e) "good information, execution just need medium
  improvement". F2.06, F26.2, G8, F33.5.
- Problem: one post in a bare guide (ULX: "can move laterally quite a bit when pushed", TPU): pressed off its line the
  trigger rolls about the post and rubs the guide: it rattles, feels cheap, and the rub wears the guide so the play grows.
- Fix (#3, #28): two identical posts, as far apart as the trigger allows, on identical POM pads, in guides: the trigger can
  only move straight down (one plane), wherever you press.
- Demonstration: establish (front view, trigger lit), push in to a 3/4 cutaway of the trigger with its posts and guides
  (shell phantom). Press near the outer edge: rival rolls and rubs (wear marks build over clicks, play grows); wipe:
  second post appears, same size as the first (and as the switch post), pads on both; the same press goes straight down.
  Classroom: a drawer on one runner vs two.
- Headline: roll at the edge X° → ~0° (from clearances 0.30 mm bare vs 0.05 mm padded, post height); "ways to move 2 → 1"
  as words. Answers: (a) one plane drawn as a plane the posts slide in; (b) establish + locator + 3/4 view; (c) the posts
  and pads identical (G8, F26.2); (d) cheap feel + wear over time shown (play grows with the rub); (e) the information kept.

### 12. b02_pom (paper, settle ~11): POM pads set the tolerance
- Replaces `clk_pomtune` 6/10: (a) "more cornered should be rounded here in the visualization" (b) "this one also just feels
  lazy compare to another mouse's tolerances directly". F2.06.
- Problem: molded guides: the gap lands anywhere in a 0.30 mm band (±0.076 mm per mold face, Protolabs), so off the line
  some triggers rattle and some scrape (the ULX's lateral play, TPU; the LA-1's pads still ground until sanded, Brock's doc).
- Fix (#28): the factory measures each trigger's gap and fits the POM pad that fills it, in 0.05 mm steps (no steel recut).
- Demonstration: a row of five triggers off the line, each with its gap (rival: shipped as they are: two rattle, one
  scrapes); then a feeler gauge reads each, the pointer swaps in a thicker pad, the gaps close to within 0.05 mm; all
  corners rounded (radius on pads, posts, guides).
- Headline: Gap spread 0.30 → 0.05 mm (6× tighter). Answers: (a) rounded corners everywhere; (b) compared directly with a
  molded guide's band and with the ULX's play.
- Hand-off to b03_switch: the pad and post sit over the switch; b03 opens on the GT01 itself.

## Build notes (phase B)
- The cutouts slide uses the kit's establish (top view) with my overlay drawn in its camera (b02_cutOverlay: both triggers
  from the 3D twin outlines, rear edge morph smile → straight, body outline restroked), then b02_trigTopMM (field,
  x-ray spring + switch, bend line), the kit finger (top view, len 22), a loupe (b02_swingLoupe), a classroom fold
  (b02_fold in the small 3D camera), verdict + a 'What you feel' noteBox.
- Model numbers (live in code): lean 13.2°, sideways 8.0 %, presses 10 mm ahead of the switch at ±9 mm: 47.0 / 52.3 gf
  (smile) → 48.8 / 48.8 gf (straight).
- Painters written but not yet used in slides: b02_frontMM (rocker, needs polish), b02_flushMM (messy 'wall' branch: rewrite),
  b02_fingerEndMM (end-on fingertip), b02_cam3/b02_plate/b02_rearShell (3D plate: kept for grooves).

## Models and conventions checked (Brock 08:18: nothing carried forward unchecked; the auditor cross-checks these)
Each: what, where it is used, the check, the verdict.
- Old `cutouts` "33.4 % of the press sideways" (old slide). Check: = sin 19.5°, the share of the button's motion that is a
  roll about the leaning line, not a share of anything at the switch. Verdict: NOT carried forward (coordinator, 08:40).
- Bend-line lean, 13.2° (b02_cutouts). Model: the trigger turns about the chord of its rear cutout across its spring, a
  10 mm spring centred on the switch's line 16 mm out (board plan 5; the Sora's own spring position is unknown, so both get
  the same spring). Sora V2 rear edge from the 3D twin of Brock's scan, fit z = 0.0059 x² + 0.0461 x + 4.718 (|x| mm);
  chord slope over x 11..21 = 2·0.0059·16 + 0.0461 = 0.2349 → atan = 13.2° (a quadratic's chord slope equals its slope at
  the midpoint). Units mm; checked by hand. Verdict: OK, labelled "Derived" with the assumption on the slide.
- Sideways travel at the switch, 8.0 % (b02_cutouts loupe). Model: a point on the post moves as v = a × r about the bend
  axis a = (cos θ, 0, sin θ); r from the hinge to the post foot from clickGeo (crown (-1.4, 0.2) → foot (30, 11.63):
  ry/rz = 11.43/31.4 = tan 20.0°, the same 20° the GT01 is tilted to). The angle φ between v and the switch's axis:
  sin φ = tan20·sinθ / √(tan²20 + cos²θ) (derived in full; at θ = 0 it is 0). θ = 13.2° → 8.0 %: the share of the post's
  travel at the plunger at right angles to the switch's axis. NOT a share of force, and the travel lost along the axis is
  only 1 − cos φ = 0.3 %, so no latency claim is made from it. Verdict: OK, worded "of the travel there, sideways".
- Click weight at the fingertip, 47.0 / 52.3 gf (smile) → 48.8 gf (straight) (b02_cutouts tags, headline 5.3 → 0.0 gf).
  Model: moments about the bend line: F = (55 gf · dS + M0 · XS / dS) / dP, dS / dP the switch's and the press's
  perpendicular distances from the line; M0 = 7.7 gf × 40 mm, the bridge's moment at the click from K1's frame model
  (clk_ten 'bridge' 'ppcf'), scaled by XS / dS because a nearer switch needs more turn (0.35 mm / dS) for the same plunger
  travel. Hand check: dS 28.96, dP 40.75 / 36.65 mm (smile), 31.88 / 41.88 (straight) → 46.9 / 52.2 and 48.8 gf (code
  47.0 / 52.3 from the exact twin edge). Caveat: K1's XS = 30 is from the strip's root, not the bridge's crown (≈ 26 mm),
  so absolute values carry ±5 %; the inner/outer difference comes from the lever arms and stands. Verdict: OK, headline.
- K1's tensioner frame model (clk_ten, CLK_TN: strip 8 mm, b 10, h 0.8 → bridge crown 0.4, rise 1.6; arm b 20, h 2.4;
  XP 40, XS 30, pre 0.35 mm; E = PP-C-20A 13,500 MPa flexural (shlPyrofil datasheet)). Hand check of the flat strip by
  Euler–Bernoulli: EI = 13500 · 10 · 0.8³ / 12 = 5760 N·mm²; v(30) for a load at 40 = ∫₀⁸ (40−x)(30−x) dx / EI =
  1.31 mm/N → 0.35 mm needs 0.268 N = 27.3 gf; K1: 26.9 gf. Units N, mm, MPa; gf = N × 1000 / 9.80665. Caveat: the modulus
  is flexural (the right one for bending). Verdict: OK (used: 7.7 gf in cutouts; 26.9 / 7.7 gf in b02_tensioner).
- GT01 55 gf at the plunger (clk_gt01): Gateron's claim via MechKeys, 55 ± 5 gf over 0.35 ± 0.10 mm; maker claim, no
  datasheet. Verdict: OK, the source says "maker claim".
- Human scale: 48.8 gf "a little under an egg's weight" (SCALE.egg 57 g, USDA large) OK; 5.3 gf "a US nickel" (5.000 g,
  US Mint coin specifications, the table SCALE uses for the penny and quarter; not re-fetched: the fetch needed approval).
- Chart and colour conventions (kit verdict): "(lower is better)" label, the old value struck, Theseus's figure in its
  gradient; yellow only for the one named rival (Sora V2), blue only Theseus, red only faults; greys from the tokens
  (C.track / C.hair / C.comp2 / C.comp; the body fill = mouseSimple's own) since 08:45. Checked against F35.1 / 08:45.

- b02_front rocker (mine): lip and ledge dip together (cos² valley, 0.9 mm, ±10 mm), the lip 0.1 mm deeper; the lip lands at
  the valley and rolls to the press (contact clamped at the inflections, where the slopes differ most); roll = slope
  difference at the contact. Checked numerically (/tmp script): 0.84° / 0.87°, the button's outer edge (u 26) moves
  0.42 mm between the presses. Example groove (auditor M-b02-4): said on the slide. Drawn: heights 4×, mismatch 10×.
- b02_flush step: 0.35 mm at the switch × 41.9 / 31.9 = 0.46 mm at the fingertip (auditor M-b02-5 OK); the wall at the
  pressed height leaves the button 0.46 mm proud at rest (said). LaMotte 1–3 µm bump threshold (FILLS) beside it.
- b02_seams: 2 → 0 seams under the pads (geometry: pads 16 mm, seams at ±5.6 mm, the split at 0); the 0.46 mm step reused.
- b02_direct: sin 20° = 34.2 % of the travel across the switch, cos 20° = 94.0 % along, 6 % sooner = 1 − cos 20° (auditor
  M-b02-2: travel, not force; done). The loupe's numbers come from the arc's angle at rest (the drawn motion turns 1° more
  under the press: not used for numbers).
- b02_wedge: no tolerance numbers; the part count 3 → 0 per switch, from TechPowerUp's OP1 8K text (a board, its screws, the
  connector and cable).
- b02_tensioner: K1's frame model (checked above) + the GT01's 55 gf × 30/40 = 41.3 gf at the fingertip: felt 68.2 → 49.0 gf
  (auditor M-b02-3; done). The Starlight X row is its layout in our resin (said).
- b02_stiff (mine): the body's bend after the switch takes the post: overhang δ = F a² (L + a) / 3EI, 20 × 2.4 mm body, L 30,
  a 10, F 2 N (Radwin & Jeng: peaks 2.5–4.6× the activation force): ABS 45 µm, PP-C-20A 9 µm (5.3×). Example body.
- b02_rails (mine): play at the fingertip = 2 × gap × lever (fingertip 41.9 mm from the spring; one post at 31.9, two posts
  the front one at 48.2): bare ±0.15 mm → 0.39 mm; padded ±0.025 → 0.04 mm. Two posts one behind the other (side by side
  would not stop a roll: each post's guide sets that).
- b02_pom: bare molded gap up to 0.30 mm (±0.076 a face, two faces, clearance for every unit); padded to the nearest 0.05 mm,
  pads measured (stock POM shim ±5 % would add ±0.04 mm each: said; auditor M-b02-6).
- b02_grooves: SHP_GR checked (22.7 % out, 15.4 % in at the pad's edge, the groove cut into the crown); the old +51 %
  contact width was the groove alone: corrected to +24 % (net hollow R 45 under an R 8 pad).

## Research gaps (web-search budget used up at ~08:00; integrator broadcast 08:30)
Each with the query or URL the next run needs and the slide it feeds. Stand-ins in use are marked on the slides.
1. Fingertip width (b02_seams pad size, b02_grooves contact model). Stand-in: the kit's FINGER.top 16 mm ("a fingertip,
   about 16 mm"). Query: "MIT Touch Lab average index fingertip width 16-20 mm Dandekar Raju Srinivasan 2003".
2. A review calling the Finalmouse Starlight X's clicks stiff or heavy (b02_tensioner, "As seen in Starlight X"). Stand-in:
   Brock's own observation (his F27 note), no tag. Query: "Finalmouse Starlight X review click stiffness heavy main buttons".
3. Why Razer straightened the rear cutout from the Viper V2 Pro to the V3 Pro (b02_cutouts caption 3). Stand-in: stated as
   the design change only (Brock's doc says "likely ... after complaints"). Query: "Viper V2 Pro click feel complaints rear
   button cutout Viper V3 Pro straight".
4. Ceiling-facing vs sideways trigger cutouts, the Peripheral Awards vote "3× more popular", ARYE FCC-1 → RCC-1
   (b02_flush). Stand-in: Brock's doc (clk_brock). Query: "Peripheral Awards 2024 trigger cutouts poll ceiling facing side
   facing" and "ARYE RCC-1 trigger cutouts FCC-1".
5. Tactile threshold for a step under a sliding fingertip (b02_flush human scale). Candidate from memory, unverified:
   Skedung et al. 2013, Scientific Reports 3: 2617 ("Feeling small": wrinkles ~13 nm told apart). URL to check:
   https://www.nature.com/articles/srep02617. Until checked, not on a slide.
6. Logitech G Pro X Superlight 2 post-travel ("gpx-level post travel", b02_stiff). TechPowerUp blocked by robots for fetch.
   URL: https://www.techpowerup.com/review/logitech-g-pro-x-superlight-2/4.html. Stand-in: the ULX's "high post-travel"
   (tpuUlx, already in the deck) and Brock's own words.
7. US nickel's mass, 5.000 g (b02_cutouts headline's human scale, SRC b02_nickel, u: ''). Stand-in: the kit's own SCALE
   cites "US Mint coin specifications" for the penny and quarter. URL to fetch: the US Mint coin specifications page
   (usmint.gov, "Coin Specifications"); the fetch needed approval at 08:50 and was not retried.
8. Typical depth of heavy front comfort grooves at the trigger's front edge (b02_front: the rival uses 0.9 mm, labelled
   derived/illustrative). Query: "mouse comfort grooves depth mm main buttons front edge" or a teardown measuring one
   (G502, Lamzu Atlantis, Pulsar X2 grooves). Feeds the source line's "0.9 mm groove".
9. Just-noticeable difference for fingertip force, ~7 % (b02_cutouts: the 5.3 gf extra on the outer side is 11 % of
   the click; not claimed as noticeable until checked). Query: "force discrimination Weber fraction fingertip 7 percent
   Jones 1989 Pang Tan Durlach 1991".
(09:45) Filled by the research agents (FILLS.md): 1 fingertip 16–20 mm (Dandekar 2003, now cited on b02_seams); 2 no review
calls the Starlight X stiff (Brock's own, kept); 3 no source for Razer's reason (the caption states the change only);
4 Peripheral Awards poll not findable (clk_brock kept); 5 LaMotte 1–3 µm (on b02_flush); 6 GPX2 "low post-travel" (on
b02_stiff); 7 nickel 5.000 g (US Mint, archived); 9 JND 7 % measured at 2.5–10 N (not used on a slide). Open: 8 groove depth.
