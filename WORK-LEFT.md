# Theseus: the work left to do (and the ideas not to lose)

Written 2026-11-06 at 14:00–14:40 Chicago, at Brock's request ("you should log all the work that is left to do though so you
don’t lost ideas"), when the revamp session stopped at a clean point for a live link. Read this with FEEDBACK.md (every one of
Brock's messages, verbatim, with frames; F38–F61 are today's), HANDOFF.md and PUBLISHING.md.

The working notes of every agent are archived in `handoff/worklog/` (copied from the session's scratch folder
`/home/claude/work/`, which won't survive the session): each agent's PROGRESS.md, the review files (`review/<code>.md`, the
critics' findings and the owners' replies), POLISH.md, INTEGRATOR.md, the feedback inbox, research FILLS/REQUESTS, and the
scripts (L1's lattice FE model, S2's shell scripts, H3's board tools are in the repo's 3d/ already). Images and builds were not
archived (too big); the repo's `feedback/` keeps every picture Brock answered on.

State at the stop: the live film is 107 slides, every one rebuilt in the revamp and passing the error check: live as
v1793996750-29cc (published 14:25, the 14:30 build, autoplay off; PUBLISHING.md). Completion was estimated at about 75–80 % (13:28): slides ~90 %, Brock's decisions ~90 %,
shape ~50 %, board ~90 %, feedback audit ~25 %, final review and clips not started.

## THE DIRECTION NOW (Brock, 14:41–14:53, F63): start from v23, not from the revamp

**In progress (15:25):** branch `claude/v23-refine-2026-11-06`; the plan is handoff/v23refine/PLAN.md (the underdog that
compounds: moves 0–9, a build board, a scoreboard against the giants, a weight ledger); Brock's old per-slide scores are
beside it. A builder is making the foundation (a film manifest, the persistent visuals) and the pilot (moves 0 and 1).
The comparison viewer below was "super broken" on his phone (15:12): don't rely on it; his direction replaced the need.

He judged the revamp a regression: "100 slides of waffling with no coherence"; "the average animation quality is much
better, but the peak animation quality is significantly reduced, there are no truly impressive animations anymore"; pacing
"nauseating to follow". The next version: "create a version of v23 that you think is as coherent as possible and try to
salvage/repurpose as much of the animations as possible, being honest within yourself as to which versions of the slides
were better, (newer or older) and then combining in some cases". How:
1. **His ratings first.** The comparison viewer (https://claude.ai/artifact/AEPJHpx9KNeqNdMRwQBNjn; handoff/compare/README.md)
   shows Opus v23, Opus today, Sol and Astra side by side on 51 topics, live; read his scores, "best" picks and
   keep/combine notes from its database before deciding anything.
2. **v23 (commit e73fc8d) is the base**, with its 3D; the revamp's work is a parts bin: corrected numbers and sources, the
   0.6 mm board and the lattice study, the fingers, the feedback log. Take a revamp, Sol or Astra slide only where it is
   better, and combine where that's better.
3. **Coherence first:** write the film's argument as one page before touching slides (what each chapter proves, in what
   order, what the viewer should feel at each peak); cut slides that don't serve it.
4. **A pilot:** one chapter end to end, shown to him in motion, before the rest.
5. **Judge in motion, not in stills:** every review watches the film playing; pacing (section 0) is part of every slide.
6. Lessons from the revamp (F63.2): don't replace what works; keep the peaks; don't apply the simplified mouse to hero
   shots; don't let rigour cost punch; one owner of the argument, not a dozen.

## 0. FIRST: the animation pacing (Brock, 14:22, F62)

"the animation pacing is very hard to follow and feels all over the place c largely a regression from the old video, the
autoplay was definitely a bad idea as well". Autoplay is now OFF by default (the viewer steps; ?auto=1 turns it on), live at
14:30. The pacing inside the slides is the biggest piece of work left, ahead of everything below. A plan to start from:
1. Watch the old video (the published v18–v22 decks are in git; FA extracted their pages, see feedback/frames/F27's README)
   beside the new film and write down, per chapter, what the old timing did that the new doesn't (beat length, one thing
   moving at a time, how long a result is held before the next thing starts).
2. A pacing pass over every slide: one idea per beat; a steady rhythm (a beat lands, holds, then the next begins); never
   several things moving at once unless they are one motion; the caption arrives with its motion, not before it; numbers
   count only when the eye is already on them; the verdict comes last and holds. Settle times today run 7 to 13 s with many
   overlapping cues; expect most slides to need re-timing, not redrawing.
3. Make one slide per chapter first, show Brock those few (short phone clips or the live link), agree the rhythm, then roll
   it out with a shared timing helper in the kit so every slide keeps the same beat.
4. The chapter flights and transitions (F0c) belong in the same review: keep what reads, cut what distracts.

## Evening, 2026-11-06 ~18:55: the v23 refinement, where it stands

Live: **v1794012733-b9cd** (110 slides; PUBLISHING.md). Moves 0–5 are refined (V1, V2, V3, V5); move 6's story is V4's (the
300 mAh battery) but its slides are still v23's; moves 7–9 are v23's with move cards. Notes: handoff/v23refine/
(PLAN.md, V1–V5-PROGRESS.md).
- **Done:** H5 (merged 183c77b, live 1794014491-96a5): the battery 7.34 mm back, balanced at the centre (F64.15). Left by H5:
  the 3D battery part (3d/parts/battery.js and its twin) is still a 20 x 30 x 5 mm stand-in pouch; b09_radio's push-in would
  cut off the battery's front edge; some b10 source lines still name Jauch's pack; KIT.md section 4 doesn't log the new
  shared pieces (KEY_PARTS.balance, msBattBox, the pinned twin tolerance). **H4 merge risk:** H4's half-done copy has
  board.py, components.py and balance.py as they were before H5: merge H4 file by file, never the folder whole.
- **Waiting on Brock:** his picks for the five testing pairs (F64.13: lattice/b06_lattice, shlThin/b06_light,
  shbArches/b06_arches, tolerance/b07_tolerance, grind/b07_poron; FILM_AB in 25-film.js, A plays first).
- **Done since:** move 6 (V6, merged 6dfee1b, live 1794014119-6690): four upgrades and the recap where three bars cross the
  line together (powerup); the 8 khz claim sourced (Logitech's own hours at 1, 2 and 4 khz: the switches' cost climbs with the
  rate). Row 6 went from 22 slides to 7; b10_sealed went to move 7, b10_wires to move 8; elc_oneside (7) is out until Brock asks.
- **Done:** V7 (merged 82a5639, live 1794015382-5983): moves 7, 8 and the close (everybar: the giants' bars short, Theseus's
  three crossing the line together, 0, no tradeoffs, the board lit). Every move has now been through the refinement.
- **Left by V7** (V7-PROGRESS.md): b10_sealed's board coat (+0.24 g) isn't in ntr_budget: Brock (~02:00): "Add it: 27.95 g", done (75df7d5); repair and
  b03_hotswap both print 1,000 swaps three slides apart; own_life types its 98.6 % (v23's); move 7 has no ladder recap (its
  card carries the compounding fact); the two new edges (1->7, 4->8) also show dashed on mv1's and mv4's cards and the rule's
  plan. "Every bar" means the film's bars only (the click bar is off; the Starlight X leads on Finalmouse's rig).
- **Next, film-wide:** watch the whole film in order for pacing (one idea per beat), the grounds alternating light and dark
  (section 1 item 2), Brock's picks for the five testing pairs, then the clips.
- **Left by V6** (V6-PROGRESS.md): b09_latency prints "2.3× sooner" (the floor of the model's 0.142 ms) while the docked bars
  print "2.4×" (from the rounded 0.14 ms); the shared code was left alone.
- **Left by V4** (handoff/v23refine/V4-PROGRESS.md):
  - The 8 khz claim (43 h against the Viper's 40 h) assumes the switches' share of the draw is the same at 8 khz as at 1 khz
    (the deck's B09/B10 method); if the Viper's optical switches draw a fixed current, Theseus gets 38.6 h, and the 8 khz win
    rests on firmware, which nothing on screen counts. Say it on the power slide, or find the optical switches' real current.
  - elc_safe draws an "NTC lead" as the battery's third wire; neither Jauch's nor EEMB's pack lists one.
  - Slides outside the film still tell the 370 mAh story in their captions: shlGrams ("frees weight for the battery"), b10's
    370 mAh / 8 g / 10 °C, B09L's 8 khz figure on Razer's 45 h.
  - 200 h needs EEMB's typical 320 mAh (207.6 h); the film counts the 300 mAh minimum: 194 h.
- **Left by V5** (V5-PROGRESS.md): the grounds still alternate light and dark through move 4 (the film-wide background question,
  section 1 item 2); mv6's "Builds on" names move 4 only, while the board also links 5 → 6 ("Every frame").
- **Fixed this evening:** the grid's + knock-out under foot text only ever ran at 1920 px and 1x, so on a phone or a laptop
  the + marks showed through captions (01-core.js, 294c539).

## 1. Waiting on Brock

1. **Lattice pattern (F57.1, F61.1): "show both options in presentation".** Shown L2's phone-sized comparison (the shell's
   inside with each pattern, and the nodes against the 0.60 mm skin: feedback/attachments/F61 or worklog/l2), he chose not
   to pick: the film presents the woven kagome and true triangles as the two candidates. To do: b12_latopt (and b06 where it
   draws Theseus's node) shows both, side by side, with the facts from L2's images: a tie on flex (112.2 vs 111.6 µm,
   ±4 %); the kagome's nodes two ribs crossing (thickest spot 0.88 mm, 1.5 skins; 121 crossings), the triangles' six-rib
   knots (1.22 mm, 2.0 skins, a sink risk; 42 knots); the skin's hottest spot 14.6 % vs 20.7 %; coring the knots costs 42
   pins (4× their width, past the 2× guide), a weld line in each knot, saves 0.011 g. The slide's present claim that the
   woven one "wins on the rest" must become a comparison, not a verdict. Open with it: which pattern the film's mouse
   drawings (MS_LAT, S2's 3D lattice) show while both are candidates (kagome is the working pattern now). Everything else
   about the lattice is decided (ribs 0.36 × 1.80 mm, steel-safe at 1.5 first, skin 0.60 "to be proven", fillets 0.24 root
   / 0.22 node, the lattice stops at the crease, the rim below plain). Triangles' spacing at the same weight: 12.51 mm
   between parallel ribs (14.45 mm sides; L2 from L1's files); L2 drew them where L1 placed them, not centred on the midline.
2. **One background per run, film-wide? (FILM F38).** The ground flips white/black at about 94 of 104 seams. The five runs
   that share a part are being put on one ground (P5, P6); asked at 13:28 whether to extend the rule to the whole film: no
   answer yet.
3. **Rib-foot joint (F47.3: "keep as options, i haven't decided yet").** Sheet: worklog/p4 (rib-foot-joint-options.png
   was in /home/claude/work/p4/sheet/; regenerate from pages/joint.html if lost).
4. **b02_tensioner's red crown (optional).** R3 withdrew the finding because the colouring is his own F18.6 rule ("scale to
   peak"); P2 drew three alternatives (A as now, B no heat, C by share of strength) behind a lab-only `?tnheat=` switch.
   Ask only if he wants to revisit.
5. **b07_emg's ending (F55.4).** He didn't understand the question; the default (the rule "The revision that wins all three
   ships.") stays. Re-ask in plain words only if it matters.

## 2. Deferred to a more capable model

00. **"Specific density" (Brock, 16:42, an idea "to keep in the tank").** A grippable-area bar (maybe not a main bar) that
    penalizes mice with lots of holes, sharp edges or missing bottom rims (G-Wolves): divide a mouse's volume by the area
    a hand can actually grip, so mice that "cheat" on density by removing grippable shell score worse. Hard to calculate
    (it needs each mouse's real geometry); revisit with custom silhouettes or scans for every mouse.

0. **The x-ray silhouettes on the density slides (Brock, 16:30: "remember that").** "in the future when we have better
   models again i would like to bring back the xray effects that were on the old silhouettes for the density again" / "by
   xray silhouettes i mesh where it slides their a cross section or something similar, that was so cool". The old (v23-era)
   density slides slid a cross-section through each mouse's silhouette; bring that back once custom silhouettes for every
   mouse are possible (for now only the X2F has its own silhouette; the rest use the generic outline, 16:25). (his words: "i'm unsure if your model is advanced enough to solve it yet")

1. **The nose: where the trigger cutout meets the front (F51.1's front, F53.1, F54.1, F59.1).** Today's nose stays (the
   Sora V2 scan's own; Theseus matches it within 0.2 mm). What was learned, so the next attempt starts ahead:
   - "it needs to properly connect completely" read three ways: (i) one continuous cut, no stub where the cut stops on the
     lip; (ii) meets the nose's outline with no corner; (iii) reaches the very tip. All four flagships studied (Sora V2,
     Viper V3 Pro, Pulsar X2 V2, G Pro X Superlight 2) use one continuous cut, flat across the middle of the front and
     turning up at the corner, no separate slot; the Viper's button front overhangs its base (a shadow line under the lip).
   - The Sora V2 scan's own cut: flat at 10.0 mm to |x| 18, up 1.7 mm by |x| 24; from the side a ~3 mm knee into the flat,
     then 3.8 mm flat to the tip; the lip under the nose's round is 1.40 mm.
   - Rejected by him: the 11:50 hook (r ≈ 7 mm), B (the arch straight to the tip: can't be moulded, 0–0.7 mm of trigger at
     the lip's corners unless the nose is redesigned), A (the nearly flat lip with a scoop), C (one smooth run-out into the
     flat lip, r 16.7 mm). Shown but unanswered (image too small on his phone): candidate 1 = C's line + the body tucked
     0.8 mm under the lip ("proud lip"), candidate 2 = the Sora's knee + the same tuck. GLBs were in work/s2/build/nose/.
   - In the 2D drawings the front gap was drawn as a separate little slot, which may itself read as "not connected": draw
     it as the 3D has it when the 2D twins are regenerated.
   - Lesson: show him per-view crops at full size, one to three phone-sized images, not one huge sheet.
2. **The side profile's hump (F43.3 → F46.3, F47.1): "like the Starlight X", centre-humped.** Every option shown was
   rejected; the profile stays the scan's. The film states the height as 39.9 mm ("just say it's 39.9 and we'll use that
   model"): the 2D drawings are stretched from the model's 38.12 mm to 39.9 (so a 1.75° line shows at 1.83° in the 2D).

## 3. Shape (S2): in progress, NOT in the live film yet

All decided; the 3D shell is being built, then the film's drawings are regenerated from it. Status and resume rule: S2's
PROGRESS.md in the worklog (section 9 has its stop report).
1. The rim's crease: one straight line at **1.75°** (F55.1), fitted minimax to the scan's crease over the front two-thirds:
   y = 4.6408 − 0.030553 z (scene mm), 2.94 mm at the nose's lower corner, 4.64 at the middle, 6.42 at the tail where it
   meets the outline; the side view doesn't change; the top view moves ≤ 0.01 mm. File: worklog/s2/crease_line_175.json.
   2D/kit frame: y_kit = 4.857 − 0.03201 z_kit.
2. **O1**: the wheel opening an even 1.0 mm gap (F46.1). **K3**: flowing rear-cutout corners (F46.2).
3. The side-view trigger cutouts: smooth, naturally arching, offset from the top of the profile (F49.2, F51.1), with the
   front left as today (section 2).
4. The creases above the scroll wheel the Sora V2 has (F43.5), 0.3 mm; the skate ledges; four screw posts.
5. The lattice in the 3D (kagome working pattern, one switch), stopping at the crease; the rim below plain (F43.6).
6. Then the 2D twins (`deck/geo2d`, under the flock), `key_parts.py --write`, and the kit's mouseSimple/MS_ constants: a
   richer simplified mouse that shows the lattice and the creases (F43.5), in true greys.
7. Then re-check every slide that draws the mouse (errs + frames), including b02_cutouts / b02_seams with O1 and K3 (P2's
   note: move the joint search to S2's J ≈ (−28.31, 11.74)), and b04's skates/sag with the real ledges (P3's model in
   worklog/b04/model: sink.py's CORN, sag_final.py, skates_model.py; then B04SK/B04SP).
8. Then the balance with the real posts, and the battery's one move (section 4).

## 4. Board (H4): in progress, NOT in the live film yet

1. **USB 2.0 pair to ~90 Ω** (decided, H3's option A): drawn at 0.13 mm traces ~0.27 mm apart (152–216 Ω as a pair);
   widen to ~0.55 mm traces 0.15 mm apart over unbroken copper on the other face (0.565 mm FR4, εr 4.3), check with
   IPC-2141 / Wadell or a field solve, length-match D+/D−, DRC 0, gnd.py clean, both variants; then mass.py → BOARD_G.
2. **Battery: one move after S2's posts land.** Point balance.py at the real posts (it still estimates them), re-run, move
   the battery so the mouse's centre of mass is at z 0 (H3's estimate: 0.47 mm further back, centre −27.45), update
   KEY_PARTS, regenerate the twins, note b07_balance (P6) and b10 (P5).
3. Decided and done: the 0.6 mm two-layer board, 5.68 g as built and accepted (F56.1), BOARD_G = KEY_PARTS.board.g; pad B3
   with C10/C11 moved apart and a plain via. Not taken: H3's weight cuts B to F and the 0.5 mm board (sheet in
   feedback/attachments/F56/).

## 5. Lattice and structure slides

1. **b12 re-solve at the 1.75° crease.** L1's study used S2's earlier chord (2.77°). Re-solve the winner and the plain wall
   at the fine mesh (0.55 mm) with L1's model (worklog/l1/fe/), update b12_latopt / b12_ribs where numbers move; the foot
   says "the sloped crease line" until then. Final numbers to quote meanwhile: worklog/l1/out/results-final.json.
2. **b06 node drawings** (fibres, fillet, filletsize, mold) after the pattern pick (section 1.1): re-solve the node at the
   shell's proportions (0.36 mm ribs on the 0.60 skin, cells 20–40 rib widths long), not the old dense strip; P6's
   expectation: the fillet curve loses its "bottom" and the limit becomes the node's size (sink), not the peak. The open
   2D strip stays as the teaching example, labelled, with no Theseus number drawn from it.
3. **The 0.60 mm skin "to be proven" (F52.3).** Plan (integrator's default): a mould-flow study before steel is cut; a
   second gate at the chin as the fallback (it shortens the 105 mm melt path, 175 skins, inside PP's 150–280). Rib width
   stays 0.36 mm (60 % of the skin); Beall's appearance rule (0.27 mm, 45 %) is the noted alternative.
4. **b05_cubed's tolerance finding (P6, 13:2x):** at the mould's ±0.076 mm the ribbed section's stiffness swings −20.6 to
   +23.9 % (span 44 %), more than a plain wall of the same 9.35 g (span 30 %), because ±0.076 mm is ±21 % of a 0.36 mm
   rib. The slide no longer claims Theseus wins on tolerance; the rib tolerance is to be proven at first shots. If a
   source shows precision moulding holds small features tighter, revisit.

## 6. Fingers

1. **Nails: "A Soft" (F60.1)** — the nail a shade lighter than the skin with a soft sheen, the skin's fold as one soft line
   round its U-shaped base; anatomy fixed (10.3 × 12.7 mm, 72 % of the tip, base 7 mm ahead of the joint's crease, side
   view a ≤ 1.5 mm strip); the chisel tip fixed (shading wraps round the tip). FG2's status in section 9.
2. The per-slide finger notes ("## FINGER" in worklog/review/b01, b02, b03, b05, b06, b07, b08): status in section 9.
3. Idea: there is no hand drawing in the kit. R2-b06-4 (a palm on b06_thrust) and R2-b07-8 (a hand outline on b07_size)
   were declined for that reason; a kit hand() in the same "A Line" style would serve both.

## 7. Feedback audit

1. **A1 (the eleven archived slides, done):** 40 clauses: 32 DONE, 3 PARTIAL, 3 OVERCLAIMED, 2 SUPERSEDED; 16 standing-rule
   findings; idea #20 (the cable's Goldilocks thickness) not on screen. Report: worklog/a1/AUDIT.md. Fixes went to P5 as
   job 12 (status in section 9).
2. **Not yet audited: the rest of the film** (b01, b04–b09, b11, b12, and the standing rules on every slide), with
   handoff/revamp2/audit-brief.md. Add an ideas-coverage check: every number in Brock's ideas list → the slide that carries
   it (or where it went and why).

## 8. Film-level

1. FILM F38 (grounds): section 1.2.
2. FILM F23 (long chapters): sub-cards declined for now (the header's chapter counter says where we are; 107 slides
   against his 100–120); revisit if the final critic still finds the middle of Shell slow.
3. FILM F34 (Codex's ruler demo, F45): on b05_cubed, called back by b12_ribs; whether it belongs on b05_fallacy was P6's
   call (section 9).
4. A final whole-film critic pass after shape and polish land (handoff/revamp2/critic-brief.md); the last critic's open
   list is in worklog/r3/PROGRESS.md and review/FILM.md.
5. Kit: the grid's "+" marks show through text that sits off a card on every slide, title row included (P3); extend
   paperClear (FILM F10) beyond the foot band.
6. Rounding convention G5: 29.31 g prints as 29.3 g and "8.7 g lighter" for 8.69 rounds 0.01 g in Theseus's favour (P3);
   decide whether G5 should round against Theseus there too.
7. Social clips: `deck/tools/clip.js` (`--both`, `--vertical`) for the stand-alone cuts, holds 2–6 s (F40); not made yet.
8. Docs: HANDOFF.md, PUBLISHING.md and this file kept current.

## 9. Where each agent stopped (14:25)

(Filled in from their stop reports.)

- **P5 (b01–b04, b08–b11), stopped 14:05, all landed and checked** (errs and qa clean on its 75 slides): the three
  OVERCLAIMED fixes (b02_direct's "What you feel" note, b02_rails' "a rattle that feels cheap" + two loupes on the posts and
  POM pads, b03_switch's Logitech line), grip tape out of the box (b11_box: "Etched", 3 → 5 "of 5", tape aside; the trifold's
  spares are skates only), every A1 audit item replied in worklog/a1/AUDIT.md, idea #20 on b10_cable ("about 2 mm … thin
  enough not to tug a 29 g mouse; XBAB's 1.9 mm cable still passes USB high speed"; the cable on the pad now drawn 2 mm), the
  b10 figures (33 h, 144 → 171 Wh/kg, 4.2 → 8.3 h, the sensor's glow neutral infrared), BOARD_G as built against the 5.60
  target, delrin150 (static 0.20 / dynamic 0.35, DuPont), PAW3950 (750 → 930 ips, +24 %), one ground per run (b02_cutouts
  night, b02_tensioner paper, b04_focus paper), FG's finger notes. Open: b04 ledges (waits for S2's ledges: re-run
  worklog/b04/model sink.py, sag_final.py, skates_model.py, update B04SK/B04SP); each changed finger checked on the other
  ground (optional); review/b08's H3 12:35 note on b08_wheel's on-screen grams not checked.
- **P6 (b05–b07, b12), stopped 14:1x, all landed and checked** (errs on its 32 slides): fingers to scale with the pad flat,
  no glow; b05_cubed on plan B (magnesium 0.70 mm vs a generic 1.00 mm carbon-PP wall, 65 % → 46 %, "1.4× more alike"; one
  line that Theseus's skin is ribbed with tolerances proven at first shots; the finding at the top of review/b05.md;
  EDM'd rib slots at about ±0.02 mm would bring the swing near the skin-only ±11 %); b05_fallacy calls back to the ruler
  (it stays on b05_cubed, F34); grounds (b05_hotspot and b05_work night, b06_filletsize paper, b12_latopt night); b06's
  fingers, egg pinched; b06_lattice's foot gives the closed-skin result; b06_arches says "drawn 10.8 mm apart (the study's:
  about 12.6 mm)" (the shared SHB_LAT drawing still at 10.8); b07_arms' thumb and ring finger; b12_ribs' steel-safe line;
  b12_latopt says "sloped crease line". Integrator's fix at 14:18: b12_latopt's caption claimed "its ribs the least
  stressed", which is false (squares 12.6 % vs kagome 12.9 %); it now says "its peak stress the lowest of the five" (14.6 %
  against squares 15.8, diamonds 17.6, triangles 20.7, hexagons 26.4). **Done but not applied: the b12 re-solve at the
  1.75° crease** (worklog/p6/fe/run_crease.py, results in crease175/): the plain wall is unchanged (147.0 µm); with the same
  12.6 mm cells the lattice covers 4.4 % more, the skin falls to 0.591 mm and flex to 112.6 µm, which puts the 0.36 × 1.80
  rib just past both rules (61 % of the skin, 3.05 skins deep); by L1's sizing rule the cells grow to 13.0 mm (skin 0.600,
  111.5 µm); or keep 12.6 mm and a 0.60 skin at 9.43 g (+0.08 g). **Decision needed: 13.0 mm cells, a 0.59 skin, or 9.43
  g** (13.0 touches b06's "12.6", MS_LAT.pitch and L2's pictures). Caveat: the model's surface is still the old scan, whose
  fold sits up to 1.6 mm above the new line near the tail; both re-solves put the skin's hottest spot on the crease near the
  tail (14.5 %; 24 % at one spot with 13.0 mm cells): strength at the crease is unproven until solved on S2's shell. Open
  too: b06's node drawings (now: both patterns, section 1.1), b07_balance (waits for the battery move), and two
  shared-subject seams that still flip ground: b06_lattice → b06_light and b06_arch → b06_thrust.
- **S2 (shape), stopped ~14:06, nothing in the repo** (everything it had landed was put back to HEAD; the 3D bundle rebuilt
  on the original shell). A complete candidate shell is built: worklog/s2 (build/shell-s2-full.glb/.json/.report.json was
  in /home/claude/work/s2/build/; too big to archive, rebuild with its scripts): the offset-arch seam with K3 corners
  (det_min 0.654), today's nose, the rim crease on the 1.75° line (the last 2 mm before each meeting point keep the scan's
  surface; in the tail's and nose's big rounds the crease sits up to 1.4 mm above the line), O1 (9.0 × 19.3 mm, r 1.6), the
  creases at 0.3 mm, four posts, the b04 ledges. Checked: side/rear/top/bottom renders; errs on 20 slides with its twins.
  Not checked: a full-size 2D side view of the simplified mouse with the new seam, skirt and lattice; b02 reading O1 from
  the twin; b08's MS_SKIRT. Resume rule (five ordered steps) in worklog/s2/PROGRESS.md. On landing, KEY_PARTS changes only
  skates.pts (dots to the ledge ends, 13 mm apart) and KEY.wheel = [−4.5, −47.1, 9.0, 19.3]; SHAPE notes owed to b02 (O1)
  and b08 (msSkirtY(u)). **The real screw posts for the balance** (2.13 g in all, against H2's 1.32 g estimate; centroid z ≈
  +7.9; the ledges add about 0.1 g, not weighed): MH1 (−10.10, z 26.62, y 5.03–20.0, arm to the side wall) 0.436 g; MH2
  (+10.10, 26.62, same) 0.436 g; MH3 (−14.59, −5.13, y 5.03–34.65, from the hump) 0.627 g; MH4 (+14.59, −5.13, y 5.03–34.75)
  0.630 g. Run H2's clear.py and balance.py (worklog/h2/tools) on them, then the battery's one move (section 4.2).
- **FG2 (nails), landed 14:00 and checked:** "A Soft" is in the kit's finger() (src and snapshot; only the finger section
  changed), every one of the 22 finger slides and the kit slides pass errs, a 0.5 s sweep of all 107 slides is clean.
  Anatomy: U-shaped cuticle 2.75 mm deep, 14.6 mm back from the tip; free edge 1.9 mm short of the tip; 10.3 mm wide (72 %
  of the 14.3 mm tip); the thumb broader with its lunula; side view a ≤ 1.5 mm strip; the chisel fixed. One flaw left:
  b02_flush's ring finger, end-on against the wall, has a slightly lumpy shadow edge under the tip at 19 px/mm.
- **L2 (pattern images), done 14:02:** two images, final (worklog/l2; feedback/attachments/F61). To redraw them on S2's
  shell once it lands: rebuild L1's skin model on the new mesh, change the shell path in geo.py, rerun geo.py, render.py,
  sheet1.py, sheet2.py (steps in worklog/l2/PROGRESS.md). Stale figures elsewhere: S2's PROGRESS ("10.7 mm apart, 6.2 mm
  side") and b06_arches' drawing (10.8) predate L1's final 12.6 mm / 7.3 mm.
- **A1 (audit of the eleven), done 13:45;** all its findings fixed or replied by P5 (above).

- **H4 (board), stopped 14:10, repo untouched** (3d/pcb/tools byte-identical to its 13:10 backup; BOARD_G 5.68). USB pair:
  the impedance is settled by H4's own 2D field solver (checked within 0.14 % of Hammerstad-Jensen single-line and 0.2–0.7 %
  of Kirschning-Jansen coupled; grid and box converged): **0.465 mm traces 0.15 mm apart** with the same face's pour 0.5 mm
  away give Zdiff 90.1 Ω (91.6 Ω without the pour); all tolerance cases stay within ±15 % (gap ±0.025 mm: 93.9 / 85.8 Ω;
  35 µm plated: 86.3 Ω). H3's 0.55 / 0.15 estimate missed the solder mask in the gap (86.7 Ω with mask). Today's 0.13 mm pair
  is 157 Ω. The re-route is planned, not built: the pair and its unbroken reference band wall off the board's left half, so it
  needs **small moves to Brock's plan-5 placement, for him to confirm**: the PMIC block 1.1 mm east; the PMIC's TWI from its
  west to its east pins; SDA/SCL swapped on the module's representative pin map; R1, R2, R3, C20, C22, TP3, TP5–TP7 and FID3
  nudged. VBUS's join must cross the reference under the receptacle's four 0.2 mm breakout stubs (single row of pads): say so
  in the README. Sketch: worklog/h4 (usb_plan_2026-11-06_1405.png was in /home/claude/work/h4/shots/; not yet shown to him).
  The half-done work copy (pcbwork/tools: usb.py and parts.py placement edits) must never be installed as it stands; install
  into 3d/pcb only at DRC 0, all nets routed, gnd.py clean, both variants; skew target < 0.15 mm. Battery move: not started
  (waits for S2's posts); exact steps in worklog/h4/PROGRESS.md.

## 10. Process notes for the next session

- Agents that have finished can't be resumed (their transcripts are too large): brief a new one from the PROGRESS.md.
- The error checker crashes after ~45–50 page loads: run it in batches of 30 (worklog/int/errs_batches.sh).
- Never overwrite a picture that went to Brock; save every sheet under a dated name (FEEDBACK.md keeps what he saw).
- He reviews on his phone: one to three images about 1600 px wide, cropped close, plain labels; few, plain questions; he
  watches usage. Design questions come with pictures (F44: "it's hard to visualize these things with text").
- Every message he sends is logged verbatim in FEEDBACK.md with frames (F50, standing); the feedback inbox is the
  integrator's raw log (worklog/feedback-inbox.md); the archivist continues from the next F number.
- Web search is capped at 200 calls per turn, shared by every agent; it resets only on a new message after a reply ends.
- The machine has 2 CPUs: one browser at a time per agent; builds and renders are the bottleneck.
- `deck/.snapshot/src` (what `build.py --own=<file>` uses for every other file) is not in git: recreate it with
  `cp -r deck/src deck/.snapshot/` before the first agent builds. At the stop it was identical to deck/src.
