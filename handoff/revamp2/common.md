# THESEUS revamp v2: the common brief for every builder (2026-11-06)

You are one of a team rebuilding Brock Liddicoat's Theseus deck: a canvas-drawn film (1920 × 1080, every frame a pure
function of slide time `t`) that sells Theseus, his 29.31 g wireless gaming mouse. Repo: /home/claude/theseus; the deck
is in deck/. Your own brief (handoff/revamp2/<code>-brief.md) lists your slides, the old slides each one replaces, and
Brock's rating and note on each, verbatim. Read this file, then your brief, then start.

## What Brock asked for today (verbatim)
- "pick back up with the revamp that was planned for yesterday ... make sure you don't lose too much content, you should
  still have well over 100 slides, every animation should be vastly improved and more intuitive ... rely heavily on my
  feedback document, double check that all archived feedback has actually been addressed ... set the bar for this new
  presentation 10x higher than it was before"
- Slide count: "at least 100 ... probably less than 120". The plan is 105.
- Palette: neutral, with Theseus blue (F35.1, confirmed today). Codex: "mostly ignore codex, the output was very poor and a
  step backwards on almost all fronts". Nothing Codex made is on this branch; don't go looking for it.
- Usage: "i don't want you to worry about usage at all, i want you to be as thorough as possible". Time is not your
  constraint; quality is. Don't waste effort either (no aimless loops), because waste never improves the result.
- Audience: "it's mostly clips that will be used on social media and for parts of the website, but the flow between clips
  has to be extremely good, the organization has to be as interconnected as possible for the most invested of customers
  and investors that sit down and watch the whole thing, the pacing also has to be amazing to keep people invested".
- 3D: "mostly drop the 3d version, but don't delete its assets, as many of the 2d visualizations should be derived from 3d
  assets as possible to make sure they stay consistent ... when you do full shell designs they should be based off a mouse
  that is clearly slightly simplified as well and only showing the parts of the design that matter for the concept because
  your last full design wasn't really up to par and i dont want people to think [it's] indicative of the end product".

## The story (STANDING: FEEDBACK F32, F33)
- **The spine is ZERO compromises** (F33.7). Every flagship gives something up; Theseus gives up nothing. Each chapter
  opens on the compromise most mice make in its area, and its slides answer it.
- **Sell solutions to problems, not just solutions** (F33.4). Every slide runs: what most mice get wrong, *drawn
  mechanically* (the rival's fault, named and sourced), then Theseus's fix, then what the player gets (F33.3, G1).
- **Each feature sells its best problem** (F33.6): the missed shot only where it is the strongest case ("what if this goes
  wrong and you miss", or the quiet constant loss a player never notices, "the excuse they never knew they had");
  otherwise wear, a cheap feel, comfort, battery, weight, or a **higher skill ceiling** (F33.7). Don't repeat one pitch.
- **His important ideas lead** (F33.5): the ideas he called important but badly executed get the most care.
- **Teach engineering with classroom demonstrations** (F33.8): research the examples professors use (a ruler bent flat
  and on edge, paper tearing at a nick, the Comet's square windows, straws in a square and a triangle, a hanging chain
  flipped upright, wood splitting along its grain, stacked coins), cite the teaching source when you can, draw them in
  the deck's style, then show the same principle in the mouse.

## The bar: what "10x" means on a slide
His ratings averaged 5/10. The words that recur in his notes are the failures to kill: "lazy" (15 notes), "hard to
understand", "too abstract and difficult to tell what you're looking at", "you can hardly tell which part of the mouse
you're looking at", "it's a graphic but it's not a demonstration", "need real world examples and it's just unintuitive for
a social media brain", "the pad looks so realistic it's uncanny", "feels lazy compared to another mouse's tolerances".
The two slides he rated 10 (weightgap, filletsize) are plain, honest and live: real data, a real simulation, the win
obvious. Every new slide must be better than those. Concretely:

**M1. A demonstration, not a graphic.** The main visual is something happening that proves the point: a press, a load, a
flow, a flick, a race, a bake, a pull. The viewer watches the cause and then its effect. A chart may follow or sit
beside it; it never carries the slide alone.

**M2. Causal motion only.** Everything that moves is moved by something visible (a finger, the pointer, a force arrow,
the melt front, light, current, time) and moves the way it physically would: eased camera moves; damped springs for
mechanisms (a trigger bottoming out, a snap, a rebound); stress, heat and bending that grow with the load rather than
fading in. No decorative loops, pulses, floating or spinning.

**M3. Problem, fix, payoff, in that order, with the same input.** The rival's mechanism first, failing, named; then the
very same input (same press, same load, same scale, same camera) on Theseus's; then the payoff number and what the player
feels. Side by side on one scale, or the rival morphing into Theseus in place (a wipe or a morph), never two unrelated
drawings.

**M4. Establish, then push in.** Any part-level view starts with where the part sits on the mouse (the kit's simplified
mouse with the part lit), then the camera pushes in continuously to the part; a small locator stays in a corner. The
viewer always knows what they're looking at.

**M5. Human scale, said on the slide.** Forces a hand really makes (a click is under 1 N; a grip squeeze several N; a
palm press or a drop much more: research and cite the figures you use), sizes against things people know (a hair, a
credit card, a coin). G2.

**M6. The first second is a hook; the last frames are a payoff.** These are social clips. Frame one already shows the
header and the subject (G9: never a lone phrase); the problem is visibly happening within about a second; the fix lands
by about 5 to 7 s; the payoff number and the player's gain are on screen by about 8 s; `settle` (usually 9 to 12 s) is
the held, finished frame. Nothing important appears after settle. Pace each slide like a short film, not a slow build.

**M7. One focal point at a time.** Lead the eye: what is in play is full strength, what isn't is dimmed. At most two
regions animate at once. The text is sparse (Apple: one idea per slide).

**M8. Every mid-frame is designed.** A frame at 40 % of settle must read on its own. QA screenshots it.

**M9. Continuity.** Elements transform rather than cut: the rival part becomes Theseus's in the same place; a number
re-counts from the old value to the new with the old one struck (F16.1). Your consecutive slides should hand off: the
last state of one sets up the next (a shared part, a shared camera, a callback in the words).

**M10. Simulations get the stage** (F2.39): at least 60 % of the content area, often the full width.

## Clips and flow (from today's answer)
- **Every slide stands alone as a silent clip.** Someone who sees only that slide on social media must get the problem,
  the fix and the payoff from what is on screen: the header names the concept (F2.44: titles name the concept), the
  demonstration explains it, the headline number lands. No "as we saw" dependence.
- **The whole film is interconnected** for the investor who watches it all. Use the threads the kit gives you: the
  compromise ledger (the intro's grid of flagship compromises; each chapter card names its compromise; the close answers
  them all), callbacks in the words where a slide reuses an earlier idea (the fillet that lowers the peak is the fillet that
  aligns the fibres and eases the mold, F9.23, DESIGN §0.10), and hand-offs between your own consecutive slides. Your
  brief names the slide before your first and after your last: make the seams smooth.
- **Pacing:** vary slide length with content (a chapter card 5 to 6 s, a dense demonstration 11 to 13 s); never dead air.

## 2D only, drawn from the 3D assets
- The film is 2D. The 3D bundle is not built into the film; the 3D assets stay in the repo for development.
- Draw parts from the shared drawings, which are traced from the 3D assets or built from the same data: `view3D(key, ...)`
  in 2D mode draws a scene's flat twin from deck/geo2d (DESIGN §7 "3D shots and their 2D twins"), and 03-parts.js has
  `boardMM`, `encoderMM`, `keyPlanMM`, `part()`; 10-b-click.js has `clk_gt01MM`. H1 is updating the board (plan 5), the
  GT01's walls, the battery and sensor positions: use the shared drawings so the update reaches your slides. Never draw
  your own private version of the board, the switch or the shell.
- **Whole-mouse views use the kit's simplified mouse** (`mouseSimple`): clearly a slightly simplified mouse, showing only the
  parts that matter to the concept. Never a full detailed shell that reads as the final product.

## The look (STANDING)
- **Palette (F35.1):** black, grey and white for the stage, type and chrome (chapter accents are ink now). Blue is
  Theseus and only Theseus: its results, mechanisms and primary marks (`C.hero`, `C.heroText`, `C.heroGrad`). Yellow is for
  comparisons and secondary items, used sparingly ("you're using too much yellow"): the one rival to beat (`C.second`).
  Other rivals are grey (`C.comp`). Red is only for faults (`C.red`, heat peaks). Explanatory drawings may use functional
  colour (stress heat, a light beam) but no new vibrant colours (F34.6). Skin is mono grey (F9.24), never peach.
- **Apple keynote direction** (F7.5, DESIGN §0): one idea per slide, room round it ("don't be afraid of black space",
  F2.36), a little more data than Apple. Gradients only in type (F8.1). Tiles barely rounded (radius 6), on the 40 px grid
  (F9.18, F9.19), no outline the colour of their text (F9.2), lesser specs ink on grey (F9.6). No dots between words, no
  capsules (F9.5). Small type Inter, never lighter than 560 (F9.8). No black outline on coloured marks (F9.10).
- **At a glance first** (F14.10, F15.1): a huge headline number in Theseus's colour saying by how much, plus a
  demonstration or chart where Theseus visibly wins with "which way is better" written on it. A glance must never read as
  Theseus losing (no longer bar for a worse number without "lower is better" right there, no red on Theseus's side, no
  rival number set bigger than ours). Rethink a slide that can't read at a glance; don't patch it.
- **Before → after** (F16.1): the bad value stays visible, struck or grey, beside the new one, with the net change.
- **Words** (G6, F14.8, F14.9, F21.8): "Peak experienced stress (lower is better)"; "weight", not "grams", for the idea;
  "khz" all lowercase; Piaknow is a name (PIAKNOW'S in caps); "Dual 8khz wired and wireless"; "battery", never "cell";
  plain words over jargon; never "pts" or "points" as a metric. Sell with conviction (F9.29: no "might", "could", "aims
  to"), and keep every number honest (G5): one precision per comparison, derive blanks rather than leave them, rivals
  included even when Theseus looks worse.
- **Sources only where they matter** (F9.5, F9.7): a rival's figure, a study, a derivation. Research is named by source
  and year ("Zaunkoenig **2018**"), not labelled "research". Brock's own figures carry no tag. Only derivations say
  "Derived".
- **Structure** (DESIGN §2b): every lattice filleted (F9.27), peaks red and the margin shown (F9.23), one seam split as on
  the Sora (F9.28), the pointer shown when something is moved (F2.43), nothing overlapping (F2.41).
- Out of the deck: magnetic clicks (F9.9), the dongle (F2.42), engravings and serials (F26.11), the bottom plate (later),
  idea #59 (F12.6).

## The motion kit (deck/src/06-motion.js)
F0 is writing a shared kit so every builder speaks one visual language. Its API is in handoff/revamp2/KIT.md once it lands
(`ls` it). Use it instead of private versions: `mouseSimple` and `establish` (where on the mouse, then the push-in),
`finger`, `forceArrow`, `spring`, `pressCurve`, `abSplit` and `wipeTo` (rival then Theseus), `verdict` (the one headline
for every before → after), `shotInset` (the missed or made shot, used only where it is the best problem), `demoPanel`
(a classroom demonstration), `scaleNote`, and the chapter-card and ledger helpers. Until it lands, do phase A below; if
your slide needs something the kit lacks, write it in your file under your prefix and say so in your report.

## How to work
**Phase A (first, while the kit is written): plan.** In /home/claude/work/<code>/PROGRESS.md write, for each slide:
the problem and its named rival (with the source you will cite), the demonstration beat by beat with times (0 s, ~1 s,
~5 s, ~8 s, settle), the headline number, the classroom demonstration if one teaches it, how it hands off to the next
slide, and every clause of Brock's notes with how you will answer it. Do the research now (WebSearch, WebFetch; image
hosts are often blocked, so describe what you can't fetch). Read the old slides you replace (grep their ids in
deck/src) and decide what to reuse (their data, sources, solver models and drawings, by calling them).

**Phase B starts when handoff/revamp2/KIT.md exists** (check with `ls`; while it doesn't, keep deepening phase A and
write the parts of your file that don't need the kit: data tables, solver models, part drawings in mm; poll every few
minutes with `sleep 120`). Brock's reference photos are in refs/photos/brock-2026-11-06/ (INDEX.md says what each shows
and who uses it) and refs/photos/: open the ones your slides need. They are references only: nothing photographic
goes on a slide (F34.1).

**Phase B: build, most important slide first, one finished slide at a time.**
- **Your file only:** deck/src/<your file> (create it). Helpers you need go in it, named `<code>_…`. Don't edit any other
  file; if a shared function needs a change, copy it into your file under your prefix and tell the integrator.
- **Each slide:** `S({ id, ch, theme, title, settle, ideas, src, replaces: [old ids], answers: [[his clause, what you
  did], …], draw: t => { … } })`.
  - `replaces` takes the old slides out of the film. The rating panel shows him his old notes on them beside your
    `answers`, and an independent reviewer will check every answer against the slide's frames.
  - One answer per clause of his notes on every slide you replace: quote the clause, say exactly what the slide now
    does. Include clauses you could not do (say why) and clauses that belong to another slide (name it). An answer that
    claims more than the frames show is a failure. This is how he checks "archived feedback was fully taken into account
    and it wasn't just some small change" (F29.2).
  - Also answer the FEEDBACK items your brief lists for the slide (cite their IDs).
  - A chapter card takes `first: true`. Within a chapter, slides play in file order, files in name order.
  - Alternate `paper` and `night` themes where it helps the flow; a demonstration may want the night stage.
- **Build:** `cd /home/claude/theseus/deck && python3 tools/build.py main --out=<code> --own=<your file>` writes
  dist/main-<code>.html with your file live and everything else from deck/.snapshot (kept current by the integrator).
- **Check** (`export NODE_PATH=/opt/npm-tools/node_modules`, and `Q='&2d=1'` on every run):
  - errors: `node tools/errs.js $PWD/dist/main-<code>.html <ids>`;
  - layout: `T=settle node tools/qa.js $PWD/dist/main-<code>.html <ids>` and again with `T=mid`;
  - frames: `PAR=1 node tools/shoot.js $PWD/dist/main-<code>.html /home/claude/work/<code>/shots 0 <id>:0.6 <id>:<mid> <id>:<settle>`;
    look at them downscaled (python3 -c "from PIL import Image; ...resize((960,540))") and judge them as Brock would,
    against M1 to M10 and his notes. Check a phone-size view too (the stage at 0.44 ×).
  - the machine has 2 CPUs shared by every builder: one browser at a time (PAR=1), and never `pkill` Chromium.
- **Checkpoint:** when your most important slide is finished and checked, write /home/claude/work/<code>/CHECKPOINT1.md
  (the slide id, the frame paths, two lines on what it does) and carry on with the next slide. The integrator reviews it
  and may message you; act on what it says before finishing.
- Keep /home/claude/work/<code>/PROGRESS.md current (the machine restarts sometimes; resume from it).
- Don't commit, push or publish. Don't touch deck/.snapshot, deck/dist/main.html or other builders' files.

## Report (when every slide is done and checked)
Per slide: what it shows in one line, the old slides it replaces, every clause answered (or why not), the sources added,
and the hand-offs. Then the checks you ran, anything you needed from shared code, and questions for Brock as
multiple-choice options (he answers with a question tool; never stop to wait for him: take the best reading and say
which).

## Added 08:45 (Brock, 08:18): keep improving, check every model, true greys
- **Your review file.** A standing critic keeps evaluating finished slides ("continually evaluate slides even after they are
  done ... so the watcher can learn better, understand at a glance better, or so that the slides are more convincing and
  flow better/inter connect better between eachother or in the most persuasive order"), and a model auditor checks every
  reused model. Both write to /home/claude/work/review/<your code>.md. Read it before starting each slide and before your
  report; act on every "must", weigh every "should", and reply in the file under the finding (FIXED / WHY NOT) so the
  critic can re-check. A slide is never finished while its file has an open "must".
- **No model, number or convention carried forward unchecked.** "make sure no bad conventions are carried forward without
  thinking about them or flawed models are silently used again without evaluating them for errors first". Before you reuse
  anything from the old slides (a solver model, a figure, a chart convention, a label), check it: units, assumptions, the
  physics, the source, the evidence label, the rounding. Record each in PROGRESS.md under "## Models and conventions
  checked" (what, where, the check, the verdict). Example found today: the old cutouts slide's "33.4 % sideways" was
  sin(lean), the share of the button's motion that is a roll, not of the press going sideways.
- **True greys.** "some of the backgrounds i'm seeing still feel yellowish to me instead of gray". Paper is now #F5F5F7 and
  every neutral on both grounds is a true grey (01-core.js); a guard turns any warm grey you hard-code into a true grey, but
  use the tokens (C.bg, C.panel, C.ink, C.mute, C.faint, C.hair, C.track, C.comp) and never a warm hex.
- **Frame one.** header() now sets the label and title at t = 0; your subject must be on screen at t = 0 too.
- **The player** (F0b, finished): 2D only, smooth transitions (dissolve on the same ground, a wipe between paper and
  night; a chapter change is a camera flight across the simplified mouse from the last chapter's part into the chapter card, F40.2, F0c), autoplay holds of 2 to 6 s by reading load (F40.1), `?clip=<id>` and tools/clip.js for MP4
  clips. Screenshots now start at the true top of the stage (the page's 8 px margin is gone).

## Added 10:15 (integrator): the film is complete in its first pass; what holds now
- All 104 slides are new; builders have finished and polish agents own their files (/home/claude/work/POLISH.md).
- In-chapter hand-offs (M9) can now be exact: `handoff: { out: d }` on a slide and `handoff: { in: d }` on the next, d = the
  mouseFit / establish call as made ({ view, box, pad, focus }); the player moves (and turns) the one mouse between them in
  1.0 s, and falls back to the usual dissolve when the declarations don't match what is drawn (F0c, DESIGN §7).
- Design questions to Brock come with a picture (F44.1). Decisions since 09:00: FEEDBACK F40 to F45 and the broadcasts
  BROADCAST-0930.md, BROADCAST-0945.md in /home/claude/work.

## Added 11:20 (K, the shared-code maintainer): the conventions decided today, in one place
Decided this morning by Brock, the integrator and the model auditor (BROADCAST-0930 and -0945, review/FILM.md,
models/MODELS-AUDIT.md). Follow them on every slide; the kit enforces what it can (KIT.md §2).
- **The verdict's grammar** (FILM F8, F15): the struck grey value is always the rival's (or most mice's, or an old
  design's), the blue one Theseus's. Never strike Theseus's own alternative: show an internal contrast (one direction
  against the map, the first layout against plan 5, an air-cured against a baked coat) as two plain stats, each named.
- **Click weights in gf** (FILM F3): every Clicks slide that claims "the same click wherever you press" uses one verdict,
  "Click force spread across the button (lower is better)", in gf; newtons only in small print where a physics step needs
  them (the GT01: 55 gf = 0.54 N, `SCALE.click`).
- **The hard press** (BROADCAST-0945 §3): no measurement of grip or press force during gaming exists. Measured at a desk: a
  squeeze of 0.4 to 1 N on average, peaks about 2 N (Johnson 2000; Won 2009); a resting hand weighs about 4.4 N (0.61 % of
  body mass, de Leva 1996). The shell chapters' 10 N is "a hard press" ("10 N, a hard press: a 1 kg bag of sugar, about
  five times the hardest grip measured at a desk"), never "a firm press" or "typical"; a resting palm is 4.4 N; "the hardest
  a hand can squeeze" needs a source or goes.
- **One test strip for the shell chapters** (FILM F4): b05 and b06 use b06's `B06_STRIP` (30-b06-lattice.js: 60 mm across
  the top of a 62.5 mm-wide mouse, 5 cells of 12 mm, PP-C-20A, 10 N on a 10 mm pad) unless a slide's point needs another
  specimen, and then it says why. Strength by F41.1's two strengths, 120 MPa stretched and 207 MPa bent (`feUse`,
  `feBreakAt` in 07-sim.js), so the numbers chain from slide to slide.
- **The board's colours** (M, 09:08): Theseus's board, in every view, is black solder mask with gold (ENIG) pads and trim;
  a rival's board is grey (`C.comp`; `pcbSec(..., { rival: true })`), in its real colour only where its teardown is the
  point, sourced; never green by default. Bought-in parts keep their own look (the battery's protection board, the radio
  module, the sensor module).
- **One value per material** (M): every material property comes from `SIM_MAT` (07-sim.js; `matOf(key)` in GPa and
  g/cm³), never a private copy. FR4 has two directions: the board's models take the lower (18 GPa across the weave), a
  slide that ranks FR4 as a material the higher (20 GPa along it), and says which. Magnesium is MatWeb's AZ91D-F, 44.8 GPa.
- **Units**: a space before % and before every unit ("17.6 %", "0.54 N"); only ° (an angle) and × (a factor) attach
  ("19.5°", "2.3×"), as the SI Brochure has it (§5.4.3, §5.4.7). `verdict` does it; write your own strings the same way.
- **Rivals** (FILM F9): any mouse that isn't Theseus is drawn with the kit's `mouseRival` (grey; yellow only for the one
  rival a slide names and beats), never with `mouseSimple`, which is Theseus alone.
- **The heat key** (F19.3): every slide that colours parts by heat draws `heatKey` beside them; where the slide talks
  about breaking, colour by the share of strength used (`feUse`), not MPa.
- Also decided (see the broadcasts for the details): the optical switches take 13.6 % of a Viper V4 Pro's battery
  (derived, Logitech's hours), so Theseus gains +15 % (switches) and +23 % (with the magnetic wheel); the V4 Pro at 8 khz
  is Razer's 45 h; the UltralightX is named as one model with that model's price, weight and fault; "most mice" only with
  a source or a count (FILM F20); a chapter card's first frame shows its name and compromise (FILM F12, now the kit's).
