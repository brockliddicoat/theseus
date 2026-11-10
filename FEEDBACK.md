# Brock's feedback: the rolling list

Every piece of feedback Brock has given on the Theseus deck, in his words, with where it stands. It is kept for people
and for models: read it before working on the deck, and update it whenever feedback arrives or an item moves. Nothing is
deleted. An item that a later message changes is marked (OVERRULED, SUPERSEDED or DEFERRED) where it stands, with what
holds now. Since 2026-11-06 (F50.1) every message he sends is logged here, verbatim, and each entry about slides links
frames of those slides as they were when he wrote (feedback/frames/<entry>/), plus his screenshots and the sheets he
answered on (feedback/attachments/<entry>/).

**For a model picking this up:** STANDING items are rules for all future work. DECIDED items are Brock's answers and are
now rules too. Never follow an OVERRULED, SUPERSEDED or OVERRIDDEN item except where its replacement says so; a DEFERRED
item waits for what its marker names. Quote the item IDs in commits and briefs. IDs are stable; new feedback gets the
next section number. To see what he was looking at when he wrote, open the entry's frames.

Status words:
- **DONE**: in the deck and checked.
- **IN PROGRESS**: being built, with who is on it.
- **TODO**: not started.
- **DECIDED**: an answer to a question, now a rule.
- **STANDING**: a rule for all work, always in force.
- **NOTED**: a message with nothing to build (kept because every message is kept).
- **OVERRULED by Fxx**: he reversed it in a later message. (**OVERRIDDEN**, the older word, means the same.)
- **SUPERSEDED by Fxx**: replaced by a newer, more specific decision, or by research (named) that showed it wrong.
- **DEFERRED by Fxx**: put off until what the marker names; not in force now.
- **CONFIRMED by Fxx**: a later message said it again.

## How to log a message (F50.1)
1. **Every message, as it lands.** The integrator appends each message to the day's inbox (work/feedback-inbox.md) with
   the live version at the time; within minutes it goes here as the next section (F51, F52, ...) headed with its subject and time
   (Chicago), or as the next item of an open section when it only adds to it (each item keeps its own time).
2. **His words, verbatim:** typos, lowercase and his punctuation kept; " / " between parts of one message; an answer to a
   question as question → "the option's label" exactly as picked (with "(Recommended)" when it was). After it, marked
   "Reading:", what it means for the deck; then a status word. Never reword his words in an existing entry.
3. **What he was looking at.** A live version's number is its Unix publish time (`date -d @1793981126` → 10:05). Take
   the build that was live (work/int/film/, or the commit rebuilt in a worktree: `git worktree add --detach /tmp/wt
   <commit>; cd /tmp/wt; python3 deck/tools/build.py main`) and run `feedback/snap.sh <entry> <build.html> <slide:t>...`
   with WHEN, LIVE, COMMIT and NOTE set (the script's header explains them). Up to v23 (2026-11-05) each published page
   is in git itself: `git show <commit>:deck/dist/main.html`. Frame one, mid and settle for the slide he talks about,
   the moment he names, settle for the others; only the slides he refers to. Link the folder from the entry ("Frames:
   feedback/frames/<entry>/").
4. **What he sent or answered on:** his screenshots, and the option sheets or pictures he answered, copied unchanged into
   feedback/attachments/<entry>/ with a README (what it is, where from, his answer). Link it.
5. **What it overrules:** find the earlier items it reverses or replaces and mark each where it stands (OVERRULED,
   SUPERSEDED, DEFERRED by the new entry), with one line on what holds now. Then update "Last updated".

Builders: clk = Clicks, gld = Glide, shl / shb / shc = Shell A / B / C, srf = Surface, elc = Electronics, own =
Ownership and Shape, ntr = Intro and close, r3d = 3D models. The integrator does deck-wide items in the shared code
(deck/src/01-core.js, 04-ui.js, 07-charts.js, 07-sim.js, 03-parts.js, 20-app.js).

Last updated: 2026-11-06 17:00 (Chicago): F64 (the underdog that compounds; the loadout bars). Before that, 15:06: F63 (the revamp judged a regression; the next version starts from v23; the comparison viewer). Before that, 14:35: F62 (the pacing, a regression; autoplay off, live as v1793996750-29cc). Before that, 14:23: F61 completed: the lattice pattern (~14:15, F61.1, on L2's two sheets, now in
attachments/F61/; F57.1 and F43.4 point to it), the live link (13:58, F61.2; F38.6's live-link updates CONFIRMED) and
the work left (13:59, F61.3, answered by WORK-LEFT.md); F59.1 given the integrator's lesson. (13:56: F60, with FG2's
nail sheets; F58.1 points to it. 13:47: F59, with S2's nose sheet, the RTINGS photos left out; F51.1's front, F53.1 and
F54.1 marked DEFERRED by F59.1. 13:38: F58, with frames of the 22 finger slides and the 13:28 preview sheets; F52.1
marked DONE, pointers on F49.1 and F38.6. 13:18: F57, with L1's frames. 13:14: F56. 12:58: F54, F55. 12:38: F53. 12:22:
F52, F40.4's measure. 12:08: frames for the older entries, F9 to F31 and F27. 11:55: F51. 11:38: the missing messages,
frames and attachments for F39 to F49, overruled items marked, F50.1.)

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

## F38. The revamp, picked back up (2026-11-06 06:33 to 07:33)
- **F38.1** (06:33) "https://claude.ai/share/4ce6f186-6380-4611-a871-d79aeee98304 / pick back up with the revamp that
  was planned for yesterday before i ran out of usage / make sure you don't lose too much content, you should still have
  well over 100 slides, every animation should be vastly improved and more
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
  works from Claude's last commit (7d8f926); Codex's branch stays on GitHub untouched. One exception since: F45.1 (Codex's
  ruler demonstration, its message carried once).
- **F38.5 DECIDED** Palette: "Neutral + blue (Recommended)" (F35.1 over F11.2).
- **F38.6 STANDING** Usage: "this is an ultra account, it doesn't have 5 hour limits. i don't want you to worry about
  usage at all, i want you to be as thorough as possible, unless you're worried being inefficient with usage my result
  in a worse execution, again the bar for this presentation and how understandable and impactful it is is 10x higher
  than quality than the last one. i'd like you to check in often and post live updates you aren't drifting from what i
  want and you stay aligned". (F10.1's pacing is retired for this account; check-ins and live-link updates are
  standing.) Check-ins **CONFIRMED by F58.2** (13:18: a preview soon, with how complete it is); live-link updates
  **CONFIRMED by F61.2** (13:58: a live link soon, from a good stopping point).
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
  sensor-position drawing, Apple's M1 bento). Kept in refs/photos/brock-2026-11-06/ (INDEX.md). Asked about the photos
  (~06:50): "I'll attach them now"; then (~07:00): "here are all the old pictures that ships be relevant, this should be
  everything the other chat had".
- **F38.10** (~06:45) "do you have any other questions you could ask me that you think would improve your execution?"
  Reading: answered with four questions (~06:50): the photos (F38.9), the pace (F38.6), the audience (F38.7), the 3D
  (F38.8).
- **F38.11 STANDING** (07:33) "you have permission to access my computer or any website in any way you’d like that helps
  you create the best product possible, when you constantly ask me for permission to access a website instead of just
  doing it automatically it slows down our progress". Reading: look things up and open any site that helps without asking
  him first.

## F39. Keep evaluating; no flawed model reused; greys; more searching (2026-11-06 08:18 to 08:53)
Frames: feedback/frames/F39/ (the live film at 08:18, v1793972706-6cdc: the warm paper he meant, F39.3).
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
- **F39.4 NOTED** (08:36) "i’m sending another message so you js web search more". Reading: the web searches (200 a turn,
  shared by every agent) had run out at 08:30; a new message from him starts a new turn and a new allowance.
- **F39.5 NOTED** (08:53) "i’m sending another message so you can keeping search". Reading: the same, a second allowance.

## F40. Answers on the player and the radio (2026-11-06 ~08:30, logged at 09:00)
Frames: feedback/frames/F40/ (b09_radio in the live film, v1793975367-421d).
- **F40.1 DECIDED** Autoplay hold after a slide settles: "Longer, 2–6 s". **IN PROGRESS (F0c; F0b could not be resumed).**
  **OVERRULED by F62.2** (14:22: "the autoplay was definitely a bad idea"): autoplay is off by default; the holds apply
  only with ?auto=1.
- **F40.2 DECIDED** Chapter openings: "advanced motion transitions" (not a pass through black). **IN PROGRESS (F0c):** a
  camera flight across the simplified mouse from the last chapter's part to the next, landing in the chapter card.
- **F40.3 DECIDED** Vertical clips: "allow for both letterboxed and the same as before as options" (horizontal and 9:16
  letterboxed exports both kept).
- **F40.4 DECIDED** The radio module: "Keep facing forward (Recommended)" (plan 5: at the board's rear, the long antenna facing forward,
  28.2 mm from the wheel's axle against 12.4 mm on the old board; no 180° turn, which would put it about 3 mm from the
  battery). Supersedes the old 180° turn (F9.13's aim is met by the move). **Re-derived from the built plan-5 board
  (KEY_PARTS, b09, 09:15): 11.9 → 27.6 mm to the axle, 2.3×** (the antenna's place is its keep-out's centre). **The
  measure SUPERSEDED by F48.2** (P1's note; FILM F37): b09_radio leads with the clearance to the nearest big metal, the
  wheel's magnesium rim, 4.0 → 17.2 mm (4.3×), 2.8 mm short of Taoglas's 20 mm best; the axle figures are not the claim.

## F41. The strength rule for the shell slides (2026-11-06 08:58)
Frames: feedback/frames/F41/ (b05_nopick and b06_light as live, both judged at 120 MPa).
- **F41.1 DECIDED** Asked: the shell slides judged every break against carbon PP's tensile strength (120 MPa, F12.12),
  though most parts break by bending and the same datasheet gives 207 MPa in bending (JIS K7171), which quietly favoured
  triangles and arches (the model auditor's finding). His answer: **"Two strengths (Recommended)"**: 120 MPa for stretching, 207 MPa for
  bending, as the datasheet gives; a slide whose point doesn't survive leads with stiffness instead. Consequences shown to
  him: sized triangles against a solid web 1.91× → 1.36×; one-size triangles lose (1.42× → 0.86×); the arch against a flat
  plate 3.8× → 2.0×, and it buckles at 41 N first. **IN PROGRESS (b05, b06, b07; checked by M).**

## F42. The battery's place and the board's weight (2026-11-06 09:40)
Frames: feedback/frames/F42/ (the budget with the board at 5.6 g, and the battery on `mass`, as live).
- **F42.1 DECIDED** The battery: H1 found that the 2.23 mm move back (2026-11-05) came from a drawing of a 20 mm-wide battery
  in the board's notch; the real 35 mm LP402535JU sits behind the board's rear lobes, so the notch never limited it.
  Balance points: 2.23 mm back 1.6 mm behind centre; the old place 1.0 mm behind. His answer: **"Forward and up"**: about
  5.9 mm forward and 1.5 mm up, over the board's rear edge, so the mouse balances at its centre (the weight about 0.4 mm
  higher). **TODO (H2):** 3D, KEY_PARTS, the 2D twins, the balance figures; then the slides that draw the battery.
  **"About 5.9 mm forward and 1.5 mm up" SUPERSEDED by the corrected balance model** (H2, work/h2/PROGRESS.md; the
  integrator's call, F48's note): H1's model put the screws and inserts at the optional plate's holes and left out the
  wheel's encoder and support, the side switches and the shell's posts; with them, the mouse balances at its centre with
  the battery 2.03 mm behind H1's place, at the same height (no rise). His aim, the balance at the centre, holds.
- **F42.2 DECIDED** The board's weight: the budget's 5.6 g with everything on it (F12.1) against the plan-5 board built part
  by part with typical masses: 6.66 g (the 1.0 mm four-layer laminate 3.9 g, the two switches 1.0 g), 7.92 g with the
  wheel's encoder and bracket, which the budget doesn't list. His answer: **"Keep 5.6 g as target"**: the film stays at
  29.31 g and calls the board's figure a target; the board gets built to it (thinner laminate, fewer layers, a lighter
  encoder). **TODO:** slides that print 5.6 g say "target"; the hardware brief carries it. The path to it: F47.4 (0.6 mm,
  two layers, 5.63 g). **The 5.6 g target SUPERSEDED by F56.1:** the board as built, 5.68 g, accepted.
- Decided by the integrator from H1's report (no question needed): variant B's edge switch on the top side (one soldering
  pass, as the film's "one board, one side, one reflow" claims); the GT01's walls stay 0.70 mm (measured off Gateron's
  render); the bottom plate's lattice waits until the bottom cover is revisited (it is out of the film).

## F43. The shape, the cutouts, the lattice study and the simplified mouse (2026-11-06 09:31, with a marked-up screenshot)
His markup of b02_cutouts' top view: refs/photos/brock-2026-11-06b/0931-cutouts-markup.jpg (a red ring round the wheel
opening and the slot above and below it; red curves at the two ends of the straight rear cutout). Copied to
feedback/attachments/F43/. Frames: feedback/frames/F43/ (the live film at 09:31: b02_cutouts as he marked it, the side
profile on b01_lighter, the simplified mouse on b11_repair).
- **F43.1** "i did not approve such a wacky scroll wheel wheel cutout design": the wheel opening and its long tapered slot
  (top view) are rejected. **TODO (S1):** options shown before the build. **Decided: F46.1** (O1, an even 1.0 mm gap).
- **F43.2** "the filets on the rear cutouts do not look natural or have good glow at all, they all are way to big, i’ve drawn
  in something closer to what i want but i want to to take what i drew and vastly improve it": the corners where the straight
  rear cutout meets the sides: much smaller, natural, flowing (curvature-continuous) turns, starting from his red curves.
  **TODO (S1):** options shown before the build. **Decided: F46.2** (K3, flowing).
- **F43.3** "i need you to make the shape you’re using center jumped like the starlight x, right the hump is way too far
  back/rear humped" / "this is in reference to the side profile not the top down": the side profile's hump moves to the
  centre, like the Finalmouse Starlight X. **TODO (S1):** 3D shell first, the 2D drawings derived from it (F0.2, F38).
  **DEFERRED by F46.3 / F47.1:** every option shown was rejected; the side profile stays as the scan has it (no hump move,
  no stretch, in 3D or 2D) until a better model can make the change; 39.9 mm is only the stated height.
- **F43.4** "run a simulation to determine the perfect lattice and lattice beam dimension and filet size for the mouse and
  explain how that conclusion was arrived at in the presentation". **TODO (L1):** the study, and a shell-chapter slide that
  shows how the answer was reached. Since then: the skin 0.60 mm, to be proven (F52.3); ribs 1.80 mm deep, cut steel-safe
  (F57.2); the pattern: woven kagome and true triangles both shown, as the two candidates (F61.1).
- **F43.5** "i feel like the simplified mouse design you’re using in some places is a little too simple, i still need to be
  able to see things like the lattice and the creases above the scroll wheel the sora v2 has": the simplified mouse keeps
  the lattice and the creases above the wheel (from the scan). **TODO (S1).**
- **F43.6** (09:38) "the bottom rim (the lower part after the hard cease) of the shape shouldn’t have the lattice, it’ll make it
  too complicated to manufacture": the lattice stops at the hard crease; the rim below it is plain wall. **TODO (S1, L1,
  the 3D shell and the lattice study's design space).**

## F44. Side rail, the budget, POM pads, wheels (2026-11-06 ~10:05, answers)
Frames: feedback/frames/F44/ (b03_side, b01_budget, b02_pom and b08_wheel in the 09:52 publish, v1793980369-8a53).
- **F44.1 STANDING** Asked in words which side-rail design to use (an off-centre press tilts the post; POM on POM, μ ≈ 0.2:
  ×1.2 at the tip with a 14 mm guide, ×1.85 at 5 mm, ×4.3 at 3 mm, jams at 2 mm; or two posts). His answer: **"show all 3,
  it’s hard to visualize these things with text, that is the point of this presentation"**. So: (1) the film shows all three
  rail designs as a demonstration (b03_side or beside it): the press, the tilt, the friction, the force at the tip; (2) design
  questions to Brock come with pictures (an options sheet or the slide itself), not text alone. **The ×1.2 / ×1.85 / ×4.3
  figures (μ ≈ 0.2) SUPERSEDED by POM's measured friction** (dry on itself 0.35 to 0.40, DuPont; Q3): at the tip, for a
  55 gf switch, a 14 mm guide takes 74 to 78 gf and a 5 mm guide 195 to 306 gf dry (b03_rail, which shows all four
  designs); he chose the tied posts, 56 to 59 gf (F48.1). The rule (show them all; ask with pictures) holds.
- **F44.2 DECIDED** The two side switches (full-size SPDT, about 0.5 g each) missing from the 29.31 g budget: **"From the
  shell"**: the total stays 29.31 g; the shell's allowance drops from 10.35 g to about 9.35 g. **TODO:** the budget gets the
  line (b01), the shell chapters' and the lattice study's shell weight follow it.
- **F44.3 DECIDED** POM pads (#28): **"Fit each trigger"**: each trigger fitted at assembly from a tray of pads in 0.05 mm
  steps (b02_pom as built).
- **F44.4** The wheel test group (two sellers' figures and two "to weigh" slots): **"research more"**: find more stock
  wheels' weights, each sourced. **TODO (research).** Answered: F47.5 ("Show the two found").

## F45. The ruler, and beam sizes chosen for the mould (2026-11-06 09:50)
Frames: feedback/frames/F45/ (Codex's ruler demonstration, `rv_thin_wall`, rendered from its branch's built page).
- **F45.1** "the codex version had a good demo with a ruler to show that structure of material matters more than weight of
  materials (they had a better way of saying this tho)". Codex's slide (origin/codex/theseus-revamp-2026-11-05,
  deck/revamp/40-structure.js, rv_thin_wall): title "Shape buys more than thinning."; "Try bending a ruler flat. Release it.
  Turn it on its edge. Press again. The weight did not change."; "On edge. Same weight."; the same grams before and after, and
  how many times stiffer. **TODO:** the film carries this demonstration and this message (structure beats weight), once.
- **F45.2** "this could be tied tied into the how the dimensions of the beams in lattice/interwoven arches are chosen, also. also
  keep manufacturability in mind when you choose dimensions": the lattice study (F43.4) explains its rib and arch-beam
  proportions with the ruler (ribs are rulers on edge: as deep as the mould can fill), and every chosen dimension respects
  moulding limits (rib-to-wall ratio against sink, minimum rib width, draft, fillet minimums), cited. **TODO (L1, b05, b06).**

## F46. Shape answers on S1's options sheets (2026-11-06 ~10:30)
Sheets: /home/claude/work/s1/s1_options_A.png and s1_options_B.png (sent to him), copied to feedback/attachments/F46/.
Frames: feedback/frames/F46/ (b02_cutouts as live then, v1793981126-8865).
- **F46.1 DECIDED** The wheel opening: **"O1 even 1.0 mm"** (9.0 × 19.3 mm, r 1.6, the Sora's look with an even 1.0 mm gap).
  The "wacky" tapers he circled were a drawing artifact (b02_trigBase smoothed the 3D opening's corners).
- **F46.2 DECIDED** The rear cutout's corners: **"K3 flowing"** (curvature-continuous, smallest radius 1.8 mm, bends early
  and wraps in late, 3.3 × 7 mm).
- **F46.3 DECIDED (deferred)** The side profile: **"don’t change side profile, all of the options you presented are really
  bad so we’ll have to wait until there is a smarter model available to make a more involved changed like that apparently"**.
  F43.3 (a centre hump like the Starlight X) is deferred; the hump stays where the scan has it.
- **F46.4 DECIDED** The height: **"39.9 mm"** (his F12.11 number). **Clarified by F47.1: only the stated number.**

## F47. The profile stays, the rim, the rib feet, the board, the wheels (2026-11-06 ~10:40)
Attachments: feedback/attachments/F47/ (P4's rib-foot sheet; S1's sheet B, which F47.1 and F47.2 answer, is in
attachments/F46/). Frames: feedback/frames/F47/ (b07_board and b10_board as live; b08_wheel is in F44's).
- **F47.1 DECIDED** "don’t change the side profile at all, just say it’s 39.9 and we’ll use that model until we can dk something
  better later": no stretch, no hump move, in the 3D or the 2D; 39.9 mm is the stated height only.
- **F47.2** "also you did the bottom rim very wrong, it’s supposed to slope down in a straight line from the back, you cut off
  way too much, reference the 3d scan": the rim below the crease at the back must match the scan (a straight slope down
  from the back). **TODO (S1):** before/after at true scale, then the 3D and 2D. **The scan-following reading SUPERSEDED
  by F51.2 (a refinement):** the crease is one angled straight line, as his words said, not the scan's curve.
- **F47.3** The rib feet's joint to the board (P4's options sheet): "keep as options, i haven’t decided yet". Open; b07 makes
  no drop claim.
- **F47.4 DECIDED** The board's path to its 5.6 g target: **"0.6 mm, 5.63 g"**: a 0.6 mm, two-layer board, half-ounce outer
  copper, a lighter encoder (its nickel-silver frame dropped) and a cored support; it keeps 22 % of the 1.0 mm board's
  bending stiffness, so the shell slides that use the board as a tie re-derive with it. **TODO (H3, P4, P1).** **The
  5.63 g SUPERSEDED by F56.1:** built, it weighs 5.68 g, accepted as is.
- **F47.5 DECIDED** Stock wheels: **"Show the two found"** (OP1 1.8 g, Viper V2 Pro 1.5 g, both sellers' figures; PMM 1.0 g;
  Theseus 0.9 g). **TODO (P2).**
- Simplified mouse detail (S1's sheet, section 4): not answered directly; built "as shown" (creases and lattice on full-size
  views, the small locator without the lattice), F43.5.

## F48. The side rail and the antenna (2026-11-06 ~10:50, answered on pictures)
Attachments: feedback/attachments/F48/ (the two pictures he answered on: P2's b03_rail frame, P1's antenna sheet). Frames:
feedback/frames/F48/ (b09_radio as live; b03_side, unchanged, is in F44's).
- **F48.1 DECIDED** The side rail (b03_rail's four designs, real POM friction 0.35 to 0.40 dry): **"Tied posts (wire)"**: two
  posts linked by a stabiliser wire, 56 to 59 gf at the tip for a 55 gf switch; nothing tilts. **TODO (P2):** b03_side's rail
  redrawn as the tied pair, its verdict the tied design's spread, "friction aside" gone; b03_rail keeps the four, the tied one
  chosen.
- **F48.2 DECIDED** The antenna's clearance: **"A accept plan 5"**: 17.2 mm to the wheel's magnesium, 19.5 mm to the battery's
  foil (4.3× the first board's 4.0 mm), 2.8 mm short of Taoglas's 20 mm best, said on b09_radio.
- Integrator decisions on H2's small questions (no need to ask): the battery stays where it balances (2.03 mm behind H1's place,
  no rise); R1 and C35 near the antenna noted for the next board round; the battery drawn 35 × 25 mm until the pack's
  dimensions are confirmed; the 0.70 mm sideways balance left as is.

## F49. The fingers, and the trigger cutouts seen from the side (2026-11-06 10:06; delivered ~11:00)
Live link at the time: v1793981126-8865 (104 new slides; build saved as /home/claude/work/int/film/main-all.html).
Frames: feedback/frames/F49/ (fingers on b02_front, b02_rails, b06_arch, b08_grip; the trigger cutouts seen from the side
on b01_lighter and b07_balance; the 09:52 publish showed the same).
- **F49.1** "the fingers look really bad right now": every fingertip drawn on the slides (the kit's finger and the builders'
  own fingers). **TODO (FG):** a redesign, shown to him as an options sheet first, then rolled out across the film.
  **Decided: F52.1** ("A Line"). F58.1 (13:18): "the fingers look better", but the nails still don't look right.
- **F49.2** "and the trigger cutouts in the side profile also don’t look correct at all, they should be smooth and naturally
  arching, an offset from the top of the profile, not jaggy like they are right now": the line where the triggers are cut
  from the body, seen from the side (the simplified mouse's side views and the 3D twin it comes from), must be a smooth arch
  offset below the top of the profile. This doesn't change the profile itself (F47.1). **TODO (S1).** Refined by F51.1:
  smooth all the way to the front, with no step into the nose lip (that front part DEFERRED by F59.1).

## F50. Log every message, with what the slides looked like (2026-11-06 11:00) STANDING
- **F50.1 STANDING** "make sure pretty much every message i send is logged in feedback.md, with references of what each slide
  looked like when i sent the feedback, this way when smarter models come out they will have as much context as possible to
  make the presentation even better by looking at all of my feedback, make sure to mark when old feedback is outdated and
  has been overruled by new feedback". So: every message goes in this file, verbatim, with its time; each entry that is about
  slides links frames of those slides as they were when he wrote (feedback/frames/<entry>/, rendered from the build that was
  live then, with the live version and the git commit); and every item a later message overrules is marked OVERRULED (or
  SUPERSEDED, DEFERRED) with the entry that overrules it. **IN PROGRESS (FA, the feedback archivist).**
- **F50.2** (11:06) "the last 2 messages i sent were hanging for like 20 minutes so i hit send now, its information that you
  needed but it shouldn’t interrupt your work, read them and then proceed". (His stop at ~11:00 was only to push F49 and
  F50 through; the 0.6 mm board work, H3, carries on.)
- **F50.3 NOTED** (~11:10, after "[Request interrupted by user]") "Continue from where you left off." It may be the app's
  resume prompt rather than typed. Reading: after the server restart at ~11:00 stopped every agent, carry on; the agents
  were relaunched at 11:15.

## F51. The trigger cutouts from the side, and the bottom rim, on S2's before/after (2026-11-06 11:52)
At 11:45 the integrator sent him S2's sheet (/home/claude/work/s2/s2_rim_cutout_before_after.png: the bottom rim and the
side-view trigger cutout, before and after, over his scan) and said it was being applied; he answered on it, re-sending it as
an image. Attachments: feedback/attachments/F51/ (the sheet as he sent it back). No frames: the sheet is what he saw.
- **F51.1** "trigger cutouts are still very wonky from the side especially near the front,": the cutout seen from the
  side must be smooth all the way to the nose, with no step into the nose lip (S2's "after" still steps into it).
  Refines F49.2. **TODO (S2).** **The front DEFERRED by F59.1:** where the cutout meets the nose waits for a more
  capable model; today's nose, the scan's own, stays.
- **F51.2** "the bottom rim should be an angled straight line as this will be better for manufacturing (i think)": the
  crease above the rim becomes one angled straight line, not the scan-following curve S2 drew (8.6 mm at the tail tip, 6.8,
  5.5, 4.8 at 30 mm in, then about 4 mm to the nose). Refines F47.2. **TODO (S2).** Refined by F53.3: a straight line at
  about 2°, fitted over the front and middle.
- 12:16 (the integrator to him, not his message): S2's fix sent (/home/claude/work/s2/s2_f51_front_rim.png) with two
  questions: the front, one arch to the nose tip or the nearly flat lip eased in; the rim, one straight line from the tail
  tip (8.6 mm) to the nose's lower corner (3.0 mm), accepting a top-view trim of up to 0.6 mm round the tail, or filled
  out. Answered: F53.

## F52. Fingers, the grip tape in the box, the skin floor (2026-11-06 ~12:10, answers)
Answers to the integrator's questions. Attachments: feedback/attachments/F52/ (FG's finger sheets). Frames:
feedback/frames/F52/ (the film as it stood at 12:18, built from the working tree; nothing was published after 10:05).
- **F52.1 DECIDED** The fingers (FG's options sheet: A line, B shaded, C graphic): **"A Line"**. Reading: an outline with
  flat light and shadow tones, like the deck's drawn parts, in mono grey on paper and night (FG's recommendation). Settles
  F49.1. **DONE (FG, 12:25: rolled out across the film's 22 finger slides; live since the 12:58 publish).** The nails:
  F58.1.
- **F52.2 DECIDED** Grip tape in Theseus's box (FILM F35: b11_box listed grip tape among the spares while b08_tape says the
  best thickness is none): **"Drop it from the box"**. Reading: the tape goes; the other spares stay (skates and POM pads).
  His idea #72 ("extra sets of grip tape and skates") is **SUPERSEDED by F52.2** for the tape. **TODO (b11_box).**
- **F52.3 DECIDED** The skin floor (FILM F42: the lattice study's 0.60 mm skin, b12_ribs, against b05_wall's 0.89 mm
  moulding floor, which b06_filletsize and b06_mold also shade by): **"0.60 mm, to be proven"**. Reading: the film keeps the
  study's 0.60 mm skin and says it is still to be proven (a moulding trial); 0.89 mm (Protolabs' design-guide figure) is no
  longer a hard floor on any slide. No earlier FEEDBACK item set 0.89 mm. **TODO (L1, P4: b05_wall, b06_filletsize,
  b06_mold, b12_ribs).**

## F53. The cutout's front and the rim's angle, on S2's 12:16 sheet (2026-11-06 ~12:30 and 12:34)
Answers to the integrator's two questions on S2's fix for F51, then a correction. Attachments: feedback/attachments/F53/
(the sheet as he saw it: the integrator's 1300 px copy; S2 overwrote the full-size file at 12:21). No frames: the sheet is
what he saw.
- **F53.1** (~12:30) The cutout's front (one arch to the nose tip, recommended, or the lip kept nearly flat and eased
  into): typed, neither option: "it needs to properly connect completely". Reading: neither drawing joins the cutout to
  the front properly; the line must connect into the nose completely, nothing stopping short or left hanging. Refines
  F51.1. **TODO (S2):** shown to him again. Still open after F54.1 (both of the next options rejected too). **DEFERRED
  by F59.1** (to a more capable model; today's nose stays).
- **F53.2 OVERRULED by F53.3** (~12:30) The rim (the tail-tip-to-nose straight line with a top-view trim of up to 0.6 mm
  round the tail, or the tail widened to keep the outline): clicked **"Widen the tail"**, by accident (F53.3).
- **F53.3 DECIDED** (12:34) "i accidentally hit the wrong but on the last question, i was typing a new answer" / "i was
  saying the bottom rim line needs to be at ~2 degrees, prioritizing matching as much in the front and middle as possible
  instead of the back". Reading: "Widen the tail" is void; the rim's crease is one straight line at about 2°, fitted to the
  scan's crease over the front and middle, letting the back depart from it (not the tail-tip-to-nose chord S2 drew).
  Refines F51.2. **TODO (S2).** **"~2 degrees" SUPERSEDED by F55.1:** 1.75°.

## F54. The nose seam, the finger on the bridges, the targets' press time (2026-11-06 ~12:40, answers)
Answers to the integrator's questions, each asked on a picture. Attachments: feedback/attachments/F54/ (S2's 12:21 sheet,
FG's question sheet, P3's targets row). No frames: the pictures are what he saw.
- **F54.1** The nose seam (S2's sheet: C, one smooth run-out into the flat lip, or B, the arch to the nose tip, which needs
  a nose redesign?): typed: "i can’t tell, but both the options you presented in that image aren’t anywhere near good
  enough". Reading: neither; the front stays open (F51.1, F53.1) and needs a better proposal. **TODO (S2).** **DEFERRED
  by F59.1** (S2's 3D nose study, 13:33, was answered "stop wasting usage on this problem"; today's nose stays).
- **F54.2 DECIDED** The finger on the shell's lattice slides (FG's Q1: to scale, to scale and see-through, or smaller as
  b06 drew it): **"To scale (Recommended)"**.
- **F54.3 DECIDED** The finger seen end-on (FG's Q2: square to the viewer, or turned 13° so its side and nail show):
  **"Turned 13° (Recommended)"**.
- **F54.4 DECIDED** The targets' press-to-PC time (P3's row: the Starlight X's magnetic 2.0 ms, the OP1 8K V2's 5.7 ms, the
  Viper V4 Pro's 7.5 ms): **"Under 4.2 ms, derived (Recommended)"**. (His F27 note on `targets`: "press to pc should be
  shorter".)

## F55. The rim's angle, PixArt's warning, the compromise count, the EMG ending (2026-11-06 ~12:50, answers)
Answers to the integrator's questions, each asked on a picture. Attachments: feedback/attachments/F55/ (S2's 12:40 sheet,
P3's two pictures, P4's b07_emg frame). No frames: the pictures are what he saw.
- **F55.1 DECIDED** The rim's crease angle (S2's sheet: 2.0°, recommended, or 1.75°, closer to the scan over the front and
  middle): **"1.75°"**. Refines F53.3. **TODO (S2).**
- **F55.2 DECIDED** PixArt's warning on b04_module (a lens on the base plate, moved by the clicks, against Theseus's lens
  clipped to the board): **"Keep as is (Recommended)"**.
- **F55.3 DECIDED** The compromise count on the cover and the close: **"Eight, per chapter (Recommended)"**.
- **F55.4 NOTED** b07_emg's ending (keep the rule, a target verdict, or a measured stat): typed: "i have no idea what you’re
  asking here". Reading: the question wasn't clear to him, even with the slide shown; the integrator kept the default (the
  rule stays). A question for him needs its choices drawn, not only named (F44.1).

## F56. The board's weight, as built (2026-11-06 ~13:05, answer)
Attachments: feedback/attachments/F56/ (H3's sheet "Where the last 0.08 g could come from"). No frames: the sheet is what he
saw.
- **F56.1 DECIDED** The 0.6 mm two-layer board as built weighs 5.68 g, against F47.4's 5.63 g and F42.2's 5.60 g target; H3's
  sheet drew the cuts that could close the gap (the encoder's housing walls, the Hall IC's small board, the support's walls,
  foot and seat; a 0.5 mm board; not the Hall IC on the main board, which doesn't work): **"Accept 5.68 g
  (Recommended)"**. Reading: the board is 5.68 g as built, with none of the cuts. **TODO:** the budget's board line and
  the slides that print the board's weight (the integrator, H3).

## F57. The lattice study: the pattern and the rib depth (2026-11-06 ~13:10, answers)
Asked on L1's frames of b12_latopt and b12_ribs. Attachments: feedback/attachments/F57/ (both frames). No other frames: the
pictures are what he saw.
- **F57.1** The lattice pattern (b12_latopt: woven kagome, recommended; squares; true triangles): typed: "show kagome and
  true triangles". Reading: show him the two side by side before he picks (the integrator's reading; a picture is being
  made). Open. **TODO (L1).** **DONE (L2's two sheets, 14:01, in attachments/F61/); answered: F61.1** (both shown in the
  film).
- **F57.2 DECIDED** The rib depth (b12_ribs: 1.80 mm cut steel-safe, 1.80 mm as is, or 1.08 mm): **"1.80, cut steel-safe
  (Recommended)"**.

## F58. The fingers' nails; a preview and how complete the film is (2026-11-06 13:18)
Live link at the time: v1793991510-57ae (published 12:58; the 12:52 build, saved as
/home/claude/work/int/film/main-1253.html), the first publish with FG's A Line finger (F52.1). Frames:
feedback/frames/F58/ (the 22 slides that draw the kit's finger, at the moment the finger shows and at settle; the nails
are clearest on b02_seams, b02_cutouts, b08_uv and b08_grip from above, b02_flush end-on, b03_side's thumb, and the side
views on b02_direct, b02_wedge and the shell slides). Attachments: feedback/attachments/F58/ (the preview sent in reply
to F58.2).
- **F58.1** "the fingers look better but the nails on them don’t look quite right still". Reading: the A Line finger is
  an improvement on what F49.1 called "really bad", but its nails still look wrong, in the drawing used on every finger
  slide. He didn't say what is wrong with them; the frames show the nails as he saw them. The nail needs another pass,
  then the 22 slides re-checked. **TODO (FG2, from 13:28; options shown to him first).** **Decided: F60.1** ("A Soft").
- **F58.2** "i need a preview of your progress soon and an estimate of how complete you are". Reading: a check-in
  (F38.6): send him a preview of the film as it stands, soon, with an estimate of how complete it is. **DONE (the
  integrator, 13:28):** three contact sheets of the live film, every slide at its settled frame (attachments/F58/), and
  the estimate: about 75 to 80 % complete, done about 17:30 to 18:30.

## F59. The nose, deferred; the lip's overhang (2026-11-06 ~13:40, answers)
Answers to the integrator's two questions on S2's 3D nose study (13:33: one cut from the side round the front, shaded 3D
at true scale, his Sora V2 scan and three noses from the side, the front, above and 3/4 front). Attachments:
feedback/attachments/F59/ (the sheet as sent, with the four RTINGS product photos in its top row replaced by labels:
third-party images stay out of the repo). No frames: the sheet is what he saw.
- **F59.1 DECIDED (deferred)** The nose (candidate 1, C's smooth bend with a proud lip; candidate 2, the Sora's own knee
  with a proud lip; or C without the tuck): typed: "image is too low resolution for me to tell. stop wasting usage on
  this problem, i’m unsure if your model is advanced enough to solve it yet.". Reading: no more work on the nose now; it
  waits for a more capable model, as the side profile's hump does (F46.3), and today's nose, the scan's own, stays. The
  sheet was a 4520 x 4330 px JPG, but he couldn't judge it at the size he saw it. F51.1's front, F53.1 and F54.1 are
  **DEFERRED by F59.1**. The integrator's lesson (13:42): send him each view as its own crop at full size, not one huge
  sheet; ask fewer, plainer questions; he watches usage.
- **F59.2 NOTED** The lip's overhang (how far the lip, the buttons' front edge, stands out over the body tucked under
  it: 0.8 mm as drawn, 1.2 or 0.5 mm; "the Viper V3 Pro’s is larger"): typed: "i have no idea what you are talking
  about". Reading: the question wasn't clear to him (as with F55.4); nothing decided, and with the nose deferred it
  falls with it.

## F60. The nails: A Soft (2026-11-06 ~13:52, answer)
Answer to FG2's question for F58.1, asked on two options sheets (13:51). Attachments: feedback/attachments/F60/ (both
sheets). No frames: the sheets are what he saw; the nails as they were live are in feedback/frames/F58/.
- **F60.1 DECIDED** The nails (FG2's sheets: today's nail, "White, outlined, square-based: a sticker from above, a visor
  from the side", against three treatments, the same finger in every row, its tip's shading now wrapping round "so it
  reads round, not as a chisel"): **"A Soft (Recommended)"**. Reading: the nail becomes "Skin grey, a shade lighter; a
  soft sheen; the skin's fold drawn round its sides, base" (not B Line's lines for the fold, free edge and cuticle's
  crease, nor C Tone's brighter, line-free nail); the rounder tip shading comes with it. Settles F58.1. **TODO (FG2):**
  into the kit's finger, then the 22 finger slides checked.

## F61. The pattern, both; a live link from a stopping point; the work left, logged (2026-11-06 13:58 to ~14:15)
The session's last three messages. F61.1 is the latest (~14:15) but comes first because WORK-LEFT.md cites it as F61.1;
F61.2 (13:58) and F61.3 (13:59) keep their own times. Live link then: v1793991510-57ae (published 12:58); the next
build, main-1420 (14:20), was publishing at about 14:35. Attachments: feedback/attachments/F61/ (L2's two sheets, for
F61.1). No frames: F61.1 was answered on the sheets, and F61.2 and F61.3 name no slide (the whole film as it was live
then is in feedback/attachments/F58/, the 13:28 preview sheets).
- **F61.1 DECIDED** (~14:15) The lattice pattern, asked again on L2's two sheets (14:00, 14:01: woven kagome,
  recommended, against true triangles, inside the shell at the same 9.35 g: flex 112.2 against 111.6 µm, "a tie"; the
  skin's hottest spot 14.6 against 20.7 %; the thickest spot at a node 0.88 against 1.22 mm, where a sink could start):
  typed: "show both options in presentation". Reading: no single winner; the film presents woven kagome and true
  triangles as the two candidates, with what each does (the integrator's reading). Answers F57.1. **TODO (the next
  session; WORK-LEFT.md, section 1):** b12_latopt, and b06 where it draws Theseus's node, show both.
- **F61.2** (13:58) "i need a live presentation link relatively soon, you need to get to a good stopping point that
  doesn’t waste work". Reading: publish a new live link soon, but first bring the work to a clean stopping point, so
  nothing half-done is thrown away: each agent finishes the item it is on and checkpoints, then the film is built,
  checked and published. The integrator's plan: every agent done and checkpointed by 14:25, publish at about 14:40, the
  handoff documents updated. **DONE (the integrator):** published v1793996750-29cc at 14:25 (the 14:30 build, main-1430:
  107 slides, errs ok on all 107; autoplay off, F62.2).
- **F61.3** (13:59) "you should log all the work that is left to do though so you don’t lost ideas". Reading: before
  stopping, write down all the work still to do and every idea not yet used, so the next session loses none of them.
  **DONE (the integrator, 14:00 to 14:40): WORK-LEFT.md** at the repo's root; the agents' working notes go to
  handoff/worklog/.


## F62. The pacing, a regression; autoplay off (2026-11-06 14:22)
Live then: v1793991510-57ae (the 12:53 build; the film he had been watching). Frames: the whole film as it was live is in
feedback/attachments/F58/ (the 13:28 preview sheets).
- **F62.1 TODO, FIRST (the next session; WORK-LEFT.md, section 0)** "the animation pacing is very hard to follow and feels
  all over the place c largely a regression from the old video". Reading: the motion inside the slides has too many cues
  at once and no steady rhythm; the old video (v18–v22) was easier to follow. A pacing pass over every slide against the
  old video's timing: one idea per beat, a steady rhythm, the caption with its motion, the verdict last and held; one slide
  per chapter shown to him first, then a shared timing helper rolled out.
- **F62.2 DONE** "the autoplay was definitely a bad idea as well". Reading: the film should not advance by itself. **DONE
  (the integrator, 14:25):** autoplay off by default in the player (20-app.js; ?auto=1 turns it on); each slide plays once
  and waits; the viewer steps with the arrows, a click or a swipe. Live as v1793996750-29cc. Overrules F40.1's holds as
  the default (they apply only with ?auto=1).


## F63. The revamp judged a regression; the way back (2026-11-06 14:41 to 14:53)
Live then: v1793996750-29cc (the 14:30 build). Frames: the whole film is in feedback/attachments/F58/ (the 13:28 sheets).
- **F63.1** (14:41) "i’m really disappointed in this new version, the animation pacing is very horrible and 100% regressed
  and this new one really doesn’t feel like it’s making any good arguments or making anything look that impressive, it
  kinda just feels like a watered down version of the old one that is very hard to follow at a glance and nauseating to
  follow if you try to watch the full thing" / "i asked you to make it better and instead i feel like you wasted my whole
  weeks usage on getting virtually nowhere, it feels way too different from what we had before, it’s not refined it’s
  just watered down".
- **F63.2** (14:53) "this version is prettier in some places, but it feels like it’s just 100 slides of waffling with no
  coherence" / "the average animation quality is much better, but the peak animation quality is significantly reduced,
  there are no truly impressive animations anymore" / "i dont understand how things got so incoherent, what is your
  theory? how could i have instructed you better?" (answered in the session: no one owned the argument; every slide
  replaced instead of refined, so v23's one-off peaks were lost to a shared kit style; 2D-only with the simplified mouse
  even in hero shots; rigour drained the punch; pacing never judged in motion; better instructions: a keep list, a pilot
  chapter first, coherence and impact over rigour, "I'll judge it by watching it").
- **F63.3 DECIDED, THE NEXT DIRECTION** (14:53) "maybe you should pick and choose the feedback from and just try to create
  a version of v23 that you think is as coherent as possible and try to salvage/repurpose as much of the animations as
  possible, being honest within yourself as to which versions of the slides were better, (newer or older) and then
  combining in some cases" / "maybe the simplified mouse request was where things went wrong, i’m not sure". Reading: the
  next version starts from v23 (commit e73fc8d), not from the revamp; per topic it takes the stronger slide (v23, today,
  Sol or Astra), combines where that's better, keeps the peak animations, and is built for coherence first. **TODO (the
  next session; WORK-LEFT.md, the top).** Supersedes the revamp's "every slide new" plan (F38.1's "new story").
- **F63.4 DONE** (14:53) "i’d also like a visualization where i can look at the different presentation between sol, astra
  opus v23 and opus today and compare and rate equivalent slides to guide you better". **DONE (the integrator, 15:05):**
  https://claude.ai/artifact/AEPJHpx9KNeqNdMRwQBNjn (51 topics, each version live in its own player, ratings saved to the
  page's database); handoff/compare/README.md says how it was made and how to read his ratings.


## F64. The underdog that compounds; the loadout bars (2026-11-06 15:06 to 2026-11-07 ~02:00)
Live then: the revamp (v1793996750-29cc) until 15:58, then the v23 refinement's pilot (v1794002308-7273), then the pilot
with the loadout bars (v1794005831-7601). Pictures he answered on: /home/claude/work/v2/out/ (archived in
handoff/v23refine/ notes). The raw messages, verbatim, are in handoff/worklog/feedback-inbox.md (15:06 onward).
- **F64.1** (15:06) "“There's no hierarchy of what matters most, and no slide builds on the one before.” i don’t
  understand how this happened, it was something i explicitly asked for maximum flow and most compelling slide order
  multiple times". Answered in the session (how "flow" was read as links between slides instead of structure).
- **F64.2 STANDING** (15:12) "the whole side show needs to be grounded in interconnected themes" / "people like to watch
  videos where you show the steps to level something up to where it becomes the best, it has to be a process, not self
  contained where every slide shows something a mouse is insignificantly good at" / "your comparison tool was super
  broken, just proceed with the v23 refinement" (the viewer is dropped).
- **F64.3 STANDING** (15:15) "people love a story about a underdog winning, every slide should feel like it’s pushing
  towards a compounding goal instead of just win after win where it gets building, the concepts should visible and
  statically show how they build upon one another and combine to supercharge and compound on eachother". **IN PLACE:**
  handoff/v23refine/PLAN.md (moves 0–9), the build board and move cards (V1).
- **F64.4 STANDING** (15:57) Call of Duty-style stat bars for every flagship, "never fully filled in all the
  categories"; Theseus's bars "fill up throughout the presentation" and "whenever theseus does something that is better
  than best in class, those bars overfill". **IN PLACE (V2):** the giants' loadouts slide and Theseus's docked bars.
- **F64.5 STANDING** (16:25) The generic mouse outline "that we know is good" for every rival; only the X2F keeps a custom
  silhouette (for now); the box views show every silhouette (top, side, front); one bar starts as "weight" ("not grams")
  and switches to density; the XA25 in the density metrics. **DONE (V2).**
- **F64.6** (16:30) A size bar by volume; density shown as the weight bar divided by the size bar (**DONE, V2**). "remember
  that": bring back the old x-ray (sliding cross-section) silhouettes on the density slides with a better model
  (**DEFERRED**, WORK-LEFT.md section 2).
- **F64.7** (16:42) The XA25 weighs 25.37 g; the X2F 29.5 g ("you never updated that"): **DONE (V2)**, as weighed, beside
  the makers' 25 ± 1 g and 29 ± 2 g. "Specific density" (volume over grippable area, penalizing holes, sharp edges and
  missing rims) is an idea "to keep in the tank" (**DEFERRED**, WORK-LEFT.md).
- **F64.8 DECIDED** (~17:00) Density: "Every mouse (as now)": Theseus's bar ends at 97 %, the wired XA25 holding the line,
  the tags saying why. Click bar: "Leave it out (Recommended)".
- **F64.9 DONE (V3)** (17:04, on a screenshot of the loadout rows: feedback/attachments/F64/1704-loadout-silhouettes-as-he-sent.png)
  "these use the wrong generic mouse silhouette, they should be using the same one as theseus" / "we need a separate
  silhouette of a half theseus to use for pure fingertip mice as well". Rivals are drawn with Theseus's own silhouette
  at their sizes (film_rival); the X2F is half a Theseus (film_half). Committed 88a2085.
- **F64.10 SUPERSEDED by F64.14** (17:05) "remove the comprise red cross outs from the title card and make the tile all
  text, the cross outs look bad".
- **F64.11 DECIDED, IN PROGRESS (V4)** (17:08) "the battery should only need to be 300mah, there’s no reason that we
  wouldn’t be able to beat the viper v4 pro battery with the same size battery as it using much newer and optimized
  firmware and no opticals". ~17:10, on where the freed weight goes: "Lighter mouse, 27.7 g (Recommended)". EEMB's
  LP402535 (300 mAh minimum, about 6.40 g) replaces Jauch's 370 mAh pack: mass 27.71 g, density past the XA25's.
- **F64.12 STANDING** (17:18, on a phone screenshot of the cover: feedback/attachments/F64/1718-cover-tile-as-he-saw-it.png)
  "the zero compromises tile needed to be revamped, you can’t just rip out part of it and leave it like that, it looks
  weird now". When part of a design goes, rebuild the whole element; never leave it with a hole.
- **F64.13 DECIDED** (~17:42) The ladder: "each slide and a recap with all the gains". The five slides he rated 7, v23's
  against the rebuild: "show them side by side just for treating and i’ll pick soon" ("treating": testing). **IN PLACE:**
  the testing pairs (FILM_AB, 25-film.js, 2c32873); waiting on his picks.
- **F64.14 DONE** (18:03, on the cover in v1794008755-3f2b) "i’m not sure how i feel about spelling out zero for 0
  compromises, i was hoping for something different and i don’t think the text about the 8 thing on the bottom makes
  sense". ~18:12, of two options (feedback/attachments/F64/1810-compromises-tile-options-sent.png: A, 0 as text, "nothing
  given up"; B, 0 with Theseus's three bars past the line, "every bar full"): "i liked the bars that were full but not
  overflowing more, the small gray text should read “no tradeoffs”". The tile: 0 in Theseus's blue, beside his three score
  bars filled to the line and no further, "Target, no tradeoffs". Live as v1794010568-85c4 (294c539). With it, the grid's +
  knock-out under foot text now works on every screen; it had only ever run at 1920 px and 1x, so on his phone the +
  marks showed through captions.
- **F64.15 DONE (H5, live 1794014491-96a5)** (~18:27, on the 300 mAh battery live in v1794011041-ce3f) The lighter battery moves the
  balance point 1.6 mm toward the front (front 14.4 g, rear 13.3 g; b07_balance says so in red). Asked: move the battery
  about 7 mm back to re-centre it, after checking it fits in the tail? **"Move it back (Recommended)"**. H5 re-runs the
  balance with EEMB's box (37 × 25.5 × 4.3 mm), checks the fit in the tail, and updates board.py, KEY_PARTS, the 3D and
  b07_balance (F21.15, F30.10, F42.1 hold: the balance at the centre). **Result:** the battery's centre 7.34 mm back (mouse z
  -34.32, the same 7.46 mm up; 7.3 not 6.7 because the slide's copy of the model still had the old 1.0 mm board); the scales
  13.9 g front, 13.8 g rear; 1.55 mm to the shell at the tightest point (EEMB's 37.0 x 25.5 x 4.3 mm as a sharp box);
  b07_balance back in blue. Picture: feedback/attachments/F64/1922-battery-moved-back-clearance.png.
- **F64.16 DONE (H5, live 1794039339-1c54)** (asked ~19:37, answered ~02:00 on 2026-11-07, on the close, live in v1794015382-5983) The board's waterproof coat (b10_sealed,
  which he rated 7 as elecsheet1: "protects against water for very little weight"; 50 µm urethane, both faces: 0.24 g, rounded
  up) wasn't in the weight budget. **"Add it: 27.95 g (Recommended)"**: the total goes up and the shell's allowance stays at
  10.35 g; density 0.0941 is still past the XA25's 0.0956.
  **Result:** 27.95 g; the coat 0.230 g by b10_sealed's formula, 0.24 g rounded up; density 0.094 on every slide (the cover
  had rounded it up to 0.095); the balance 0.16 mm ahead of the middle, front 14.1 g, rear 13.8 g, "within 1 mm" holds; move
  7's card: soft-touch weighs 0.68 g or more, more than the 0.44 g lead over the XA25.

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
  - XBAB light grey #F7F6F2, not tan. **#F7F6F2 SUPERSEDED by F39.3:** the paper is #F5F5F7, a neutral grey (#F7F6F2
    read as yellowish); "grey, not tan" holds.
  - Tags and colours have since been replaced: F7.3, F7.4, F11.2; the colours again by F35.1 / F38.5 (neutral + blue,
    chapters in ink), which overrule F11.2.
- **F0.4 STANDING** Content:
  - Every idea gets an animated visualization.
  - Anything already in shipping mice gets a "how Theseus goes a step further" beat.
  - As many competitor comparisons as possible: bars, XY plots with sweet spots, Pareto frontiers.
- **F0.5 STANDING** The corrections in research/validation-report-2026-11-03.md:
  - sensor naming;
  - Raytac AN54LM-20A (**SUPERSEDED by F21.4:** the AN54LM-P20A, long antenna);
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
  - Decided: F3.3, F6.1. **Carbon-filled's 85 % SUPERSEDED by F21.3 / F21.5:** 70 % (ABS 90 %, brass 0 %).
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
  - **The rounding SUPERSEDED by F9.19:** the boxes are now barely rounded (radius 6).
- **F2.06 DONE** (`anchors`, now "Dual rail main clicks"; `clk_pomtune`) "the dual rail main clicks needs to be better explained and visualized (right now you're
  calling it something with anchors) also explain how the pom pad thickness allows for easy factory tolerance
  modification and perfection"
- **F2.07 DONE as changed by F9.16** (`sidebuttons`) "the side button on rails slide (which should just be called dual rail
  side buttons should show the mini microswitch being used as as support by 2 additional arms as well to keep the
  button from bending in too far"
  - Now full-size SPDT switches with a glove (F9.16). **The glove SUPERSEDED by F48.1:** two posts in POM-padded guides,
    tied by a stabiliser wire (b03_side).
- **F2.08 DONE** (3D: TTC-style optical encoder, ISO screws, a knurled insert; 2D: `srf_encoder`, and `ownscrew`, `own_insert` and `own_life` drawn from the 3D model's exact head, recess, thread and insert) "the encoder and screws need a massive revamp to look proper"
  - Encoder form: F9.21. **The optical encoder SUPERSEDED by F27** (magnetic, Hall effect: "Yes, switch everywhere"), and
    the steel screws by F25.4 (titanium).
- **F2.09 DONE** (`shlThin`, `shlShell3d`, `shlLattice3d`, and the meter strip through the chapter) "id like you to elaborate more and do more animations on how triangles are more helpful on a
  lower weight mouse. throughout all the strength increases from industry standards i'd like to see a bar of flex or
  strength to weight dropping"
  - This is the shell meter (10-d-0-meter.js); its baseline is F6.4. **The meter OVERRULED by F27** (`shlShell3d`: "cut
    the strength graphs that last multiple slides, they were a bad idea"): no strip across slides; each slide makes its
    own comparison.
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
  - **The Mars base domes OVERRULED by F22.1** ("we can get rid of the mars base dome slide as well"); the interwoven
    arches stand.
- **F2.17 DONE** (`shbFibres`: Krenchel's curve, Choi 2024 1.7×, Hexcel 33×) "show how these continuous lines particularly increase strength for materials filled with
  fibers, because fiber alignments is extremely important (bring up specific research on how high the potential
  strength increases are)"
- **F2.18 DONE** (`shbFlow`: a melt-flow simulation, sharp against filleted; `shbGates`: gating, rib width, fillets) "show a fluid simulation of how a filleted lattice helps sign fibers (if there is anything
  else that can be down to the lattice to better align it show it)"
  - **`shbGates` (the gating) OVERRULED by F27** ("not sure if needed", 1/10): out of the film.
- **F2.19 DONE** (`sealed`: "The encoder: the number one failure point") "talk about how no dust getting in the encoder is particularly important given the fact
  that the encoder is the number one failure point in a mouse"
  - **SUPERSEDED by F27** (`sealed`: "remove, ... i want to use a magnetic encoder that doesn’t get affected by dust"):
    the encoder is magnetic and the sealing slide is out.
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
  - **The break numbers SUPERSEDED by F41.1:** judged at 207 MPa in bending, the plate cracks at 20.5 N and the arch
    buckles at 41 N first (2.0×, b06_arch); the 21× stiffness stands.
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
  - **The stats slide SUPERSEDED by F27** (`ntr_stats`, 4/10: "all of this information is important but would fit better
    in other slides"): its figures went to the cover (density, as he suggested) and b01_budget.
- **F2.29 DONE** (shared code, 3D, and `elc_oneside`: one board, one side, one reflow, 5.6 g) "we don't have a front and back pcb," / "it'll be a
  single ~5.6g pcb."
  - Shared constant: THS.pcb. Since F42.2 the 5.6 g was a target; the 0.6 mm board as built, 5.68 g, is accepted (F56.1).
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
  - 90 % for ABS, a bit lower for carbon-filled, both screwed straight in, as his estimate. (Carbon-filled: 70 %,
    **SUPERSEDED by F21.5**.)
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
  for ABS. Carbon-filled is "a bit lower": 85 %, his estimate. **85 % SUPERSEDED by F21.3 / F21.5:** "i would think
  carbon filled would be lower than 85%": 70 %.
- **F6.2 OVERRIDDEN by F12.11** Density: use the Ninjutso Sora V2's L × W × H for Theseus, labelled a placeholder.
- **F6.3 DECIDED** FR4 arms: "All G Wolves mice, I even had the arms on an HTS Ultra break during shipping once".
- **F6.4 DECIDED** The shell meter's baseline: a plain thin wall (no ribbing) at the same mass. The meter itself is cut
  (**OVERRULED by F27**, see F2.09); a plain wall at the same weight is still the shell slides' baseline (b05_nopick).

## F7. 2026-11-04 04:52: the Apple direction (with four keynote slides)
Frames: feedback/frames/F9/ (the nearest committed build, 04:45, seven minutes before this message: the look he meant).

- **F7.1 STANDING** "make sure to keep working after your compactions"
- **F7.2 DONE in shared code, IN PROGRESS per slide** "from the slides i'm seeing the visual quality took a massive step
  backwards, i don't like the new super straight aesthetic"
- **F7.3 DONE** "i don't think the david crowley style boxes are a good fit, but i also don't think the old pill ones with a
  dot were good either"
  - Tags are type now.
- **F7.4 DONE, refined by F8.1 and F11.2** "i don't like the new colors you've chosen, the old ones were better, if you're
  gonna go in any new direction, go in the apple direction, but don't stray too far from the primary color scheme colors
  we chose originally"
  - **The colours SUPERSEDED by F35.1 / F38.5:** neutral + blue (black, grey and white; blue for Theseus, yellow for
    comparisons, red for faults); the Apple direction stands.
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
  - **The vibrant colours OVERRULED by F34.6 / F35.1 / F38.5** ("Other vibrant colors made it less professional"; neutral
    + blue); the premium motion stands (F38.3).
- **F7.10 DECIDED (F11.1)** "i also think blue should be the main theseus color after some thought red makes it seem like
  it's bad, and we can't do green because razer is green"
- **F7.11 STANDING** "don't forget to do every task from my original 40+ pieces of feedback, this is just me steering you
  more in the right direction"

## F8. 2026-11-04 05:12
Frames: feedback/frames/F9/ (the same build, 04:45: where the gradients were).

- **F8.1 DONE in shared code, STANDING** "gradients make the most sense in the font, you need to use them everywhere else
  very sparingly other than where they are resided so the presentation doesn't look too vibe coded"
  - Gradients appear only on Theseus's big numbers and name.
  - Tiles, bars, marks, the stage and transitions are flat.

## F9. 2026-11-04 07:20 (with eight photos)
Frames: feedback/frames/F9/ (the nearest committed build before it, 04:45: the cover, magnetic clicks, the radio module,
the GT01, the side buttons, the encoder, zero grams, an unfilleted lattice).

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
  - **The 180° flip SUPERSEDED by F40.4:** on plan 5 the module sits at the board's rear, the antenna facing forward,
    17.2 mm from the wheel's magnesium rim against 4.0 mm on the first board (F48.2); the aim, further from the wheel's
    metal, holds, and so does the long antenna.
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
  - **The glove SUPERSEDED by F48.1:** two posts in POM-padded guides, tied by a stabiliser wire; the full-size SPDT
    switches, held by the shell, stand. **"no company has spdt side buttons yet" SUPERSEDED by research**
    (BROADCAST-0945): the Gamesense MVP's side buttons are full-size Kailh GM 4.0s (TechPowerUp), so b03_side doesn't
    claim it.
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
  - **Theseus's optical encoder SUPERSEDED by F27:** the scroll encoder is magnetic (Hall effect), "Yes, switch
    everywhere"; his note on how optical encoders look still holds for the rivals' drawings.
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
  - **OVERRULED by F38.6:** an ultra account, no 5-hour limits ("i don't want you to worry about usage at all");
    thoroughness first.
- **F10.2 DONE, STANDING** (the live link, republished at each integration; v14 at 20:5x) "i'd also like you go back to giving me a live link that you update so i can see the progress
  updates often as soon as you make them"
  - The link: https://claude.ai/artifact/HH8yRD9aYxCvvgcT1jUkyv, republished as work lands.
- **F10.3 DONE (this file), STANDING** "you should have a rolling list of all the feedback i've given you somewhere in the
  github, its status on how much you've addressed it and whether or not it's still relevant/been overridden" / "this list
  should be readable for both humans and llms, i want this so you don't forget about anything i've told you in any of my
  messages"
  - On branch claude/review-notes-rework. Pushing it needs the repo enabled for the session (see "Open with Brock").
  - Extended by F50.1: every message logged verbatim, with frames of the slides as they were, overruled items marked.
- **F10.4 STANDING** "if you have any questions to improve your execution you should ask them as well"

## F11. Answers to the third questions (2026-11-04 07:35)

- **F11.1 DECIDED** Theseus's colour: **blue**. The next best is yellow and problems are red.
- **F11.2 DECIDED, OVERRULED by F35.1 / F38.5** Chapter colours: **the old set**. Now: every chapter in ink (black, grey
  and white); blue for Theseus, yellow for comparisons, red for faults.
  - Shell purple, surface pink, electronics cyan, shape olive, ownership slate.
  - Clicks (blue, now Theseus's) and glide (green, out) are neutral.
- **F11.3 DECIDED** The seam: "it forks which it shouldn't, it has a center strip, which it shouldn't".
  - One split runs from the nose to the rear seam, with the wheel sitting in it, as on the Sora.
- **F11.4 DECIDED** "No company has SPDT side buttons yet": "I've checked, state it". **SUPERSEDED by research**
  (BROADCAST-0945): TechPowerUp shows the Gamesense MVP's side buttons on full-size Kailh GM 4.0 switches, so the film
  doesn't say it (b03_side).

## F12. 2026-11-04 09:28 (answers, new notes, six reference photos of mouse bases)
Frames: feedback/frames/F12/ (the nearest committed build before it, 08:47: the notched rear cutouts, the base with big holes).

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
  - **DEFERRED by F27** (`pltSim`: "none are what i wanted we will worry about the bottom cover later"): the plate is out
    of the film until the bottom cover is revisited (so are F14.1's and F18.1's plate skates, F20 and F21.2).
- **F12.11 DECIDED** "also the dimensions of theseus will be 119.3 x 62.4 x 39.9". Asked whether to resize the 3D shell:
  "Use the numbers only".
  - The scanned shape stays.
  - Density and specs use 119.3 × 62.4 × 39.9 mm, which is 297.0 cm³ and 0.099 g/cm³.
  - **DONE** in the shared constants (`THESEUS.dims`, `THS.dims`) and the intro's density slides.
  - **CONFIRMED by F47.1** (2026-11-06): "just say it’s 39.9 and we’ll use that model"; the scanned profile stays.

Answers to the Shell A questions:
- **F12.12 DECIDED** "tensile strength": the shell counts as broken at 120 MPa. **SUPERSEDED by F41.1:** two strengths,
  120 MPa stretched and 207 MPa bent (JIS K7171), as the datasheet gives.
- **F12.13 DECIDED** "cite the finalmouse support staff" for "the encoder is the number one failure point". **DONE**
  (`sealed`). **SUPERSEDED by F27:** `sealed` is out and the encoder magnetic; the claim isn't in the film.

## F13. Answers to the Shell B questions (2026-11-04 ~10:20)
Frames: feedback/frames/F13/ (Shell B as rebuilt at 10:10, the nearest committed build: arches, fibres, the mold, the
gates, the low sides).

- **F13.1 DECIDED** The strength bar on the arch and fibre slides. First answer: "i'm confused what you're asking".
  Asked again more plainly: "Show it, holding".
  - The strip appears on those slides at the triangle lattice's value. The arch is already inside that number, because
    it's the same dome.
  - **DONE.**
  - **OVERRULED by F27** (`shlShell3d`: "cut the strength graphs that last multiple slides, they were a bad idea"): no
    strength strip.
- **F13.2 DECIDED** How the mold is made: "Not decided yet". **DONE:** `shbMill` (EDM) and a new `shbMillDirect`
  (a milled core) both carry the fillet's advantage.
- **F13.3 DECIDED** Where the gate goes: "decide where you think is optimal". **DONE:** `shbGates` puts one gate inside under the
  crown, from the fill model: no weld line, the shortest flow, and fibres along the arches.
- **F13.4 DECIDED** The thumb band: "Both sides". **DONE** (`shbSides`).

## F14. 2026-11-04 10:17 (with three Gateron GT01 images), and answers to the questions after it
Frames: feedback/frames/F14/ (the nearest committed build before it, 10:10: the GT01 on the clicks card, the dots, the
mousepad image, the fallacy slide, the question alone on the next slide, the slide he retitled).

- **F14.1 DONE** (3D and `gld_under`: wide front and back pills and a ring; plate off, two dots per corner plus two by the lens) "when you start on the bottom plate the 2 dot skates should join together to form a pill shape,
  not 2 independent circles like they do now, and without the bottom plate, there should only be be ledge to fit the 8
  dot skates"
  - Asked what the skates are with the plate on: "Pills + sensor ring". That means a front pill and a back pill,
    mirrored, plus a ring round the sensor.
  - Asked where the dots sit with the plate off: "2 each corner, 1 or 2 on the sensor 9 or 10 total". They sit on a
    ledge on the shell rim.
  - **The pills (plate on) SUPERSEDED by F20.4** (two half-moons after the Viper V4 Pro's rear skate), and the plate
    **DEFERRED by F27**; the dots with the plate off stand.
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
Frames: feedback/frames/F16/ (`arc` mid and settle in the nearest committed build before it, 10:10; his screenshot wasn't kept).

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
  **The name SUPERSEDED by F21.4:** AN54LM-P20A.
- **F17.2 NEXT ITERATION** The side seam meets the side seams about 30.5 mm above the base: "I'll check and say". See F21.16: it bothers him; fix it after this iteration.
- **F17.3 DONE** (3D, and the shot on `sidebuttons`) A 3D shot of the full-size SPDT side switches in their
  glove: "Yes, model it".
- **F17.4 DECIDED** The GT01 cover's taller end walls from the photo: "No, it's fine".

## F18. Answers to the Intro, Clicks and Glide builders' questions (2026-11-04 ~13:05)
Frames: none of this time; the slides it names as they were after it, in v19 (11-05): frames/F27/ (035_gld_under,
005_flagships, 029_latency, 022_tensioner, 043_sensor).

- **F18.1 DECIDED** The pills with the plate on: "One wide front, one wide back". Two pills, mirrored about the sensor,
  each spanning most of the width, plus the ring. **DONE.** **SUPERSEDED by F20.4** (half-moons), then **DEFERRED by
  F27** with the plate.
- **F18.2 DECIDED** Where the dots by the sensor sit with the plate off: "research and decide". **DONE:** left and right of the
  lens at ±11.5 mm (a third less worst sag under a palm press; front and back would clash with the lens clip). **TO CHECK
  (K4):** Glide's dots by the sensor at ±11.5 mm.
- **F18.3 DECIDED** Theseus's sensor: "Unannounced next part". Call it PixArt's next flagship, with no part name. **DONE.**
  **OVERRULED by F21.6:** the PAW3970, with the Viper V4 Pro's specs.
- **F18.4 DECIDED** The price row on `flagships`: "Keep price charted". **DONE:** one chart, price on each row, Theseus's
  $189 ending on the ULX's launch price.
- **F18.5 DECIDED** The click-latency target against the XA25's measured 72 µs: "Tighten it". **DONE:** 70 µs, moving or still, at NC
  release.
- **F18.6 DECIDED** The tensioner's stress colours: "scant to peak and also it's been bothering me that the bridge
  tensioner doesn't properly connect the 2 pieces". **DONE:** the heat runs to the hotter part's peak, and
  the plate, bridge and trigger are drawn as one continuous band with filleted roots. **The filleted roots OVERRULED by
  F27** (`tensioner`: "the rounding where the bridges meets the trigger looks bad, ie needs to connect without filets"): no
  fillets there since v22.
- **F18.7 DONE** The Viper V4 Pro's skate sizes: "Estimate from photos". Measured off his own photo (F20.4) instead: the rear half-moon is about 53 × 24 mm, labelled an estimate from his photo (`gld_under`).
- **F18.8 DECIDED** Measured sag or sink figures: "No, keep the models". The labelled illustrations stay.

## F19. Answers to the Shell at-a-glance builder's questions (2026-11-04 ~15:00)
Frames: the gate and the thumb band as Shell B first had them: frames/F13/; as they were in v19: frames/F27/ (071_shbGates,
076_shbSides).

- **F19.1 DECIDED** The gate inside under the crown (needs a hot drop or a three-plate mold): "Fine, keep it".
- **F19.2 DECIDED** The thumb side band against the fingers' side: "Same on both".
- **F19.3 DECIDED** The heat scale on the plane-against-triangles drawings: "do what makes triangles look better". The
  squared scale stays: calm triangles, the red peak on the plane.

## F20. Answers to the plate builder's questions (2026-11-04 ~15:20)
**DEFERRED by F27** (all of F20): the plate is out of the film ("none are what i wanted we will worry about the bottom
cover later"; `pltOptions`: "none are good options"); it comes back with the bottom cover.
Frames: feedback/frames/F20/ (the plate at 15:13, the nearest committed build); later versions: frames/F21/ (21:44) and
frames/F27/ (v19: 088_pltPlate, 089_pltSim, 090_pltOptions, the ones he rated 3, 3 and 2).

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
Frames: feedback/frames/F21/ (the nearest committed build, 21:44: the inserts, thread wear, Newtonian profiles, the size
slide, the plate).
- **F21.0** "how far are you into integrating all my feedback?" Answered with the counts above, the review and the fixers.
- **F21.1 DECIDED** The shell's weight: "Budget is the target". The shell (with its skates) gets what the weight budget
  leaves; the Shell chapter's 15.2 g body is labelled a stress study, not the final shell. **DONE (fixK, fixI)**:
  the labels, and the budget recounted with the deck's own magnesium wheel and brass inserts.
- **F21.2 OPEN** The plate's back skate: "i'll have to see all 3 options". Being rendered side by side: (A) v3 as now,
  (B) the back skate weighted harder, (C) thinner ribs (0.30 mm lattice, 0.40 mm struts). **DEFERRED by F27**
  (`pltOptions`: "none are good options and we don’t need to worry abt this into later into development").
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
  for small spec changes between redesigns. **The power chip's place SUPERSEDED by F30.1 / F30.3** (as far from the MCU
  as possible, in the left middle); **the 1 mm board SUPERSEDED by F47.4** (0.6 mm, two layers, 5.63 g). The standing
  rule holds: re-derive at a redesign.
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
Frames: feedback/frames/F22/ (v16, published 22:50: the wheel he called bulky, the Mars dome slide, frame sync, the budget).
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
  side-button lead, 0.08 g. With the 0.9 g wheel the shell and skates get **10.02 g** (2.14 g under the XA25's). **The
  steel screws SUPERSEDED by F25.4** (titanium, 0.42 g for four: 10.35 g), and that by F44.2 (about 9.35 g).

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
Frames: in feedback/frames/F27/ (v19, live then): 102_wheel_v19.jpg, 134_ownscrew.jpg, 014_budget_v19.jpg.
- **F25.1 DONE** (a coarse diamond knurl, 72 teeth at 1.0 mm pitch, 30° each way, flat tops; IS 3403) The wheel's tread: "research what you think is best, if assumed, coarse and diamond are my favorites".
  **DONE (whl).** **OVERRULED by F30.8** ("i liked the scroll wheel version with lines better"): straight lines, as in F22.1.
- **F25.2 DONE** The wheel's form: "thinners arms". Arms 0.95 → 0.55 mm, the weight held at 0.900 g.
- **F25.3 DECIDED** The side-button lead: "Keep 3 wires". **DONE** (no change).
- **F25.4 DONE** The screws: "Titanium" (instead of steel): grade 5, 0.42 g for four; shell and skates 10.35 g. **DONE (whl):** the budget, the 3D screws and the
  Ownership slides (no more magnetic pickup). **The shell's 10.35 g SUPERSEDED by F44.2:** the two side switches come
  out of the shell, about 9.35 g; the total stays 29.31 g.
- **F25.5 DONE** (head hardness 220 → 349 HV against class 4.8, sourced; thread stripping stays in the brass, said so) "mentioned the improved strength of the titanium screws compared to steel leading to less stripping,
  find research to back". **DONE (whl):** sourced, against the steel the screws would really be (stainless A2 or
  class 4.8 / 8.8; class 12.9 alloy steel is stronger than grade 5 titanium), and clear about which stripping the evidence
  supports (the recess, by hardness; the thread usually strips in the brass insert, not the screw).

## F26. Notes at 01:43 (2026-11-05)
Frames: feedback/frames/F26/ (frame sync, v19, live then); the other slides it names are in frames/F27/ (the same v19):
022_tensioner, 023_clk_tenmat, 017_arc, 024_anchors, 033_sidebuttons, 118_elc_oneside_v19, 042_gld_module, 043_sensor,
100_srf_marks, 101_details, 140_serial. The board's notes (F26.4 to F26.9) were also about its 3D model, not reproduced.
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
  pcb should be back width as the front". **IN PROGRESS (K2).** **The front's extension SUPERSEDED by F30.5 / F30.11:**
  only as far as the GT01's angled overhang.
- **F26.6** "give the triangles on the back of PCB design the proper fliletting". **IN PROGRESS (K2).**
- **F26.7** "the 2 back holes need slightly more padding on the pcb, but the holes can't change location at all".
  **IN PROGRESS (K2).**
- **F26.8** "the power switch should be moved to the middle of the notch so it's easier to access". **IN PROGRESS (K2).**
  **DEFERRED by F29.3:** placed with the bottom cover (centred in the board's window for now); both board variants were
  built, the window (A) and the edge switch (B) (F30.17, F30.19), B's on the top side (F42's note).
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
Frames: feedback/frames/F27/ (every rated slide at its settle time, from the published v18 for the intro and v19 for the
rest, both where they differ; the README lists his score beside each frame; the 2D view, see the README).
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
  - `ntr_densrank` (intro, slide 11) **9/10**: "it bother me the the x2f is lighter and lacks decimal points, this probably isn’t the most exact weight available for the x2f crazylight (reports online say it’s at least 29.5g), i also don’t like how the theseus has an extra decimal point. you also need to use eloshapes to take g wolves mice into account for there weights and density, yes this will make the theseus look worse, but its more honest" (The X2F's "at least 29.5g": **SUPERSEDED by research** (BROADCAST-0945; Q1 searched English and Japanese reviews): no measured weight is published; the film uses Pulsar's claim, 29 g ± 2.)
  - `pricefront` (intro, slide 12) **7/10**: "the bottom pareto lineinstantly going straight bothers me a lot i should continue on the trajectory it was at for a little but bit, there should never be a kink in a pareto line, i think the viper mini signature edition and zaunkoenig mice need to be on this table as well, and the x3 superstrike"
  - `market` (intro, slide 13) **8/10**: "we need to man’s a bigger argument here how most mice compromise battery life for weight, research harder to find missing weights or derive"
  - `budget` (intro, slide 14) **6/10**: "it’s a lot of work to keep updating this one"
  - `map` (intro, slide 15) **2/10**: "poor execution and not super needed"
  - `clicks` (click, slide 16) **7/10**: "switch plunger on the gt01s is still turned vertical, bottom part looks fine but the part that actually sticks out above the housing looks like it needs to be turned 90 degrees"
  - `arc` (click, slide 17) **7/10**: "tensioner doesn’t look accurate, i dont like the use of the metrics “pts” or “points” anywhere. this is a really important slide the concept is good but it needs to be demonstrated and sold better, i think direct drive means the peak theoretical reaction time should be 20% faster because 20% more of the force goes where you actually intend it." (The 20 %: **SUPERSEDED by F31.2**, "Keep "6% sooner"", with why it isn't 20 %.)
  - `clk_wedge` (click, slide 18) **4/10**: "important concept, very poor execution, could be closer to the less parts is better demonstration, show after youve shown the problem with having more parts"
  - `clk_switch` (click, slide 19) **5/10**: "bottom housing doesn’t look very accurate at all, i’ll attach a new reference when you ask, show the effect on battery life, razer says their optical encoder and switched account for almost half the battery life in the viper v4 pro (find quote), also i’d like to switch to using a halling effect/ magnetic encoder so we can say we should have double the battery luce efficiency as razer" ("Double": **SUPERSEDED by research** (BROADCAST-0945): the film claims what it derives, +15 % hours from the mechanical switches and +23 % with the magnetic wheel; Razer staff's "almost half" only as their remark, F31.1.)
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
  - `shlPick` (shell, slide 53) **7/10**: "gpx 2 has worse build quality than the ulx even though it was heavier, this demonstrates the fallacy, i dont like that it says the gpx 2 has good build quality, also i think the line might be unintuitive at a glance, i think the axes need to be formatted and labeled differently, also you expect the right to mean weaker and lighter at a glance be because it has the least area under the curve, not the other way around, maybe y should measure strength not flex, i feel as if that would be more intuitive to understand." (The ULX example: **SUPERSEDED by research** (BROADCAST-0945): the ULX Competition's build is disputed, RTINGS's unit creaked and Periview's had solid sides, so b05_fallacy weighs the GPX 2, 59.4 g, which creaks, against the Sora V2, 40.9 g, "feels solid".)
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
Frames: in feedback/frames/F27/ (v19; v20, live from 04:07, differs on these only in small details such as the slide
counter): 016_clicks and 019_clk_switch (the GT01), 022_tensioner (F28.2), 079_shcArms (F28.3). His photos are
third-party and stay out of the repo (refs/photos/; the G-Wolves and tensioner photos re-sent 2026-11-06 are listed in
refs/photos/brock-2026-11-06/INDEX.md).
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
Frames: the 13 slides of F29.2 as he had rated them are in frames/F27/ (v18 or v19).
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
Frames: feedback/frames/F30/ (the wheel with the diamond knurl he turned down in F30.8, from v20). Of the plan sheets he
answered on, only plan 5 is kept: handoff/plan-images/board-plan-5.jpg (F30.25).
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
  built. **The halved corner fillets SUPERSEDED by F30.14 / F30.21:** one radius everywhere, then a little bigger.
- **F30.12** "also the spacing between the scroll wheel hole and sensor, sensor and mcu and mcu and edge of the board all
  needs to be equal right now it looks like there are some thin parts that could easily break". **IN PROGRESS (K2):** the
  three gaps along the centre line equal, no thin webs (shown in mm on the revised plan).

## F31. Answers on the click work (2026-11-05 ~06:30, on K1's questions)
Frames: feedback/frames/F31/ (v22, published 06:01: clk_switch, arc, anchors, sidebuttons).
- **F31.1** Razer's "almost half the battery" (clk_switch): asked where he saw it, "Razer staff online". No public source:
  it goes on the slide as a claim, attributed to Razer staff online via Brock, beside the derived 18 % → +21 % for the
  two switches. **TODO (K3).** **The 18 % → +21 % SUPERSEDED by research** (BROADCAST-0945): the switches' share is
  13.6 % (from Logitech's own hours; Omron's pulse gives up to 17.6 %), so +15 % hours from the mechanical switches and
  +23 % with the magnetic wheel (b03_switch, b10, b01). The attributed remark stands.
- **F31.2 DECIDED** Direct Drive's speed: "Keep \"6% sooner\"" (with why it isn't 20 %). **DONE (v22).**
- **F31.3 DECIDED** The pads: "POM everywhere" (idea #28). **DONE (v22)**; the side buttons' answer drops "say if you want
  PTFE" (K3).
- **F31.4** The side-button guide as a fixed part over the full-size switch: "i'd have to see". It's on `sidebuttons` in
  v22 (2D and 3D); his rating or note there decides it. **SUPERSEDED by F44.1 / F48.1:** shown every design with
  pictures (b03_rail), he chose two posts tied by a wire.
- **F30.13** On board-plan-2.png: build it? "Changes first" (his changes to come). Rear outer corners: "[No preference]"
  (fillets r 0.75 as drawn). SH1/SH2: **"Drop SH1 and SH2"** (sides stay 19.03). USB-C front legs: **"Keep as today"**. **The USB-C answer OVERRULED by F30.14** ("i think i answered your
  question wrong before"), then F30.21 and F30.25 (it hangs 1.60 mm out of a trapezoid front).
- **F30.14** His changes to plan 2: "every filet on the board should be the same radius, the changers don't have filets, you
  filet them the chamfers without turning them into filets" (one radius everywhere, the tab's corners too; each chamfer
  stays straight, with that fillet where it meets the next edge). And, overriding F30.13's USB-C answer: "i think i
  answered your question wrong before and the usb port should be moved back so it doesn't stick out oddly like it does
  now". **IN PROGRESS (K2):** plan 3, shown before the build. **"moved back so it doesn't stick out" SUPERSEDED by
  F30.21** ("the usb c connector probably stuck out for a reason, put it needs to hang out a little bit").
- **F30.15** "i'm also not sure how i feel about the new board back, i really liked the old designs artwork, you should try
  the match/adapt the old designs back artwork as best you can". **IN PROGRESS (K2):** today's underside artwork adapted
  to the new outline (its dark triangles, gold clusters, wordmark, labels, QR), triangles filleted, shown in plan 3.
- **F30.16** "drop the other 2 small holes and add your own cutouts wherever you see fit" (LH1 and LH2 go; cutouts of
  K2's choosing, each with its reason and weight, every web 1 mm or more). **IN PROGRESS (K2), plan 3.** **The
  cutouts OVERRULED by F30.19** ("The two rear cut-outs: Drop them").
- **F30.17** "i also want a variant of the pcb where the switch hangs off the edge instead if in a hole". **IN PROGRESS
  (K2):** plan 3 shows variant B (the power switch at the board's edge, no window) beside A (the window).
- **F30.18** "also on the gt01 switch the walls aren't straight for some reason and they aren't a consistent thickness for
  the bottom housing, you messed up the design". **IN PROGRESS (K1, resumed):** straight walls of one thickness, 3D and
  2D; the board's switches follow. The thickness, 0.45 mm, **SUPERSEDED by F30.24** ("don't look thick"): 0.70 mm
  (H1, measured off Gateron's render; F42's note).
- **F30.19** On board-plan-3.png: USB-C fit "[No preference]" (flush now; the 4.6 mm / 1.36 mm gap to the shell's opening is
  for the shell round). Power switch: "i want to see bout versions" (A and B both built). The two rear cut-outs: "Drop
  them". Build it? "Yes, more changes" (to come). The GT01's walls (F30.18): **DONE (K1)**, straight, one 0.45 mm wall
  (Omron D2F-class construction; Gateron publishes no dimensions). (Then 0.70 mm: F30.24.)
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
  08:20 usage reset):** thicker bottom-housing walls, measured off Gateron's render. Done 2026-11-06 by H1: 0.70 mm
  (F42's note, BROADCAST-0930).

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

## F65. Shape by gradient descent: a new mini presentation (2026-11-07 12:19)

- **F65.1 IN PROGRESS (G1, work/g1, branch g1-shape-gd)** Verbatim: "make some slides applying gradient descent to making an
  objectively better mouse shape" / "new mini presentation, same assets and art style" / "the concept i am thinking bout is
  having 4 local minima on a mouse shape" / "one for the thumb on the left side, one for the pinky on the right side (the
  standard pockets made by a mouse a wide hump width and lots of front flare , like the ulx" / "ring finger would still sit
  on the shoulder, no local minima, part is just calculating some derivatives with newtonian shape analysis" / "try to
  estimate optimal gradient strength given resting position on the hand at rest in zero gravity" / "this is not some new
  concept that should output a wildly novel shape, it is a concept to optimize the curvature on existing shape concepts, i’m
  looking to make shape science more objective" / "start with the sora v2 shape we have and then modify it to have more of an
  arched middle on the sides and better comfort grooves to showcase the  concept, then" / "the goal is to model a dynamic
  shape made of arcs that you can customize the depth, length and angle of which we can then use the data from the shape
  research on resting position and gradient descent to modify to create the best shape possible" / "remember it still needs
  to look like a traditional gaming mouse and the concept should not be that out there" / "you need to make the animations
  easy to understand and as possible, with excellent motion design and lots do detail and layers".
  Main's reading (to confirm with him on the first preview): the four minima are the thumb pocket (left side), the index and
  middle fingers' comfort grooves (main buttons) and the pinky pocket (right side); the ring finger rests on the right
  shoulder, its slope from derivatives; the rest pose is NASA's zero-g neutral posture on the ANSUR II mean male hand
  (193.3 mm), a relaxed claw; a separate deck (build target 'gd'), published as its own artifact.
- **F65.2 DECIDED** (~12:50, on G1's phase 1 preview, feedback/attachments/F65/1245-gd-phase1-preview.png) Grip, palm on the hump
  (relaxed finger angles, the wrist tilted about 15°) or palm lifted (the exact zero-g pose): **"trial both"**. Pockets, symmetric
  or the thumb's further forward (the relaxed thumb lands about 20 mm ahead of the pinky): **"trial both"**. The study runs all
  four and shows them side by side with their numbers. Also told him: the optimum strengths (grooves R about 29 mm, pockets R
  about 47 mm, derived); a 30 mm pocket at R 47 comes out about 2.5 mm deep, the ULX's; phase 1's descent barely moved (under
  1 mm) because it penalised any move off the Sora, so phase 2 starts from the modified base he described.
- **F65.3 STANDING (shape study)** (12:55) "there shouldn’t be more than one local minima per figure" ("figure": finger). Each
  finger gets exactly one local minimum (the ring finger none): every pocket and groove one smooth valley, no raised rims or
  ripples making a second dip in that finger's region. Phase 1's notch (rounded edges at half the radius, bulging past the base)
  read bump-dip-bump in the ×10 inset of the right side. Counted per finger in every trial, and shown as a rule on a slide.
- **F65.4 DECIDED** (~13:35, on the first cut, published 13:30 as its own artifact) Front flare: at rest the loss doesn't want it
  (left free it pulls the front in about 0.5 mm; flare helps lifting, which isn't modelled). **"Let the numbers decide
  (Recommended)"**: no added flare; the slides show the UltralightX's 1.1 mm beside it and say lifting isn't modelled yet.
- **F65.5 STANDING (shape study), IN PROGRESS (G2)** (13:33, on the first cut) "you should be able to configure arcs that span
  the hole sides, not tiny ones like that" / "snd they look way too extreme and nothing like normal mice". The arcs are the
  shape: whole-side arcs (the rear round the hump, one long waist arc, the front corner) and wide groove arcs across each
  button, each with depth, length and angle; no notches. Every main view true scale; at most one small ×2 inset. Main's
  diagnosis: the strength estimate (R 29 / R 47, the pocket's pull matched to the finger's passive stiffness) left out skin
  friction, which holds a finger on a near-flat surface; at R 47 a whole side would be ~10 mm deep. Re-derived with friction
  and the fingertip's threshold for feeling slope, within the range normal mice use (the Sora's waist R 376 mm).
- **F65.6 DECIDED** (~14:20, on the rework, live 1794082358-a29b) The side arcs are "felt" over **the whole distance the thumb
  slides as you grip**, not just where it lands (about 10 mm, which gave R 155, 1 mm deep over 36 mm): "Over the whole slide".
  A gentler arc running along more of the side; applied to both side arcs (thumb and pinky).
- **F65.7 DECIDED** (~14:20) A comfort groove's one low point is counted against the button's own slope (the direction the
  finger presses), not against level: "The button's slope (Recommended)".


- **F65.8 DECIDED** (~17:10, on the shape study live in 1794087621-8d3a) The side arcs are set for the average hand's slide
  (21 mm thumb, 24.9 mm pinky: R about 351 and 413 mm, close to the Sora's own 381), not the smallest hand's (R about 190):
  **"Average hand (Recommended)"**. No change. The finding to keep: felt over the slide, the rule asks for almost exactly the
  Sora's own waist, slid under each finger.

- **F65.9 DECIDED, IN PROGRESS (G4)** (17:18, on a phone screenshot of the Trials slide, feedback/attachments/F65/
  1718-trials-slide-as-he-saw-it.png) "trial 3 is by far my favorite the right 2 don’t look right at all". Trial 3 (palm
  lifted, symmetric) becomes the result. Symmetry becomes a rule: a traditional mouse is mirror-symmetric, and the
  thumb-forward shells (trials 2 and 4) read lopsided. Main's fix to the scoring, which ranked trial 3 worst (49.52) because one
  mirrored valley can't sit at two rests 20 mm apart: a valley's bottom is scored against the path each finger slides as you
  grip (F65.6), not its exact rest.

- **F65.10 STANDING (shape study), IN PROGRESS (G5)** (2026-11-08 07:21) After answering "both" to "keep trial 3's waist at
  the rescored spot (z 24) or put it back where you liked it (z 14)": "actually no, the thumb never goes that far forward,
  that’s unnatural". The model's thumb rests at z 24 at grip and lands at z 45 with the palm on the hump. Both come from G1's
  unsourced placement, "the relaxed thumb tip level with the index's middle joint". G5 re-places the thumb with a natural,
  defensible placement (his observation as a constraint), re-derives its slide, and reruns the trials.

- **F65.11 DECIDED** (~08:05, on G5's trial 3, live 1794146456-6edb) "green looks rightish": the thumb modelled from its own base
  (grips about z -4, lands about z 13) and trial 3's waist at z 4 stand.
- **F65.12 STANDING, DONE (G6, live 1794151207-5df0)** (~08:05) "the hand in the presentation looks horrible super unrealistic and i’d also like
  the breakdown of each joints angling at rest in zero gravity". The hand is rebuilt to look real: a grey clay hand rendered in 3D,
  anatomically proportioned and posed by the joint angles. A per-joint breakdown of the rest posture in zero gravity goes on the
  slide with its sources: wrist; thumb CMC, MCP and IP; each finger's MCP, PIP and DIP.

- **F65.13 STANDING (shape study), DONE (G7, live 1794244526-ca02)** (2026-11-09 10:38, on the clay hand and gd_joints) "i didn’t want a 3d
  model, i wanted the same style as the fingers we have on our presentation, that still looks very bad, i also am only seeing the
  angles of one finger here and i dont understand how 29 + 29 + 10 equals 41" / "the whole thing should be self explanatory to
  someone with no anatomy background, just basic math reasoning as a glance and it should communicate the angles of each joint
  individually at whatever view works best".
  - The hand is drawn in the film's own 2D finger style (the kit's finger(): the A Line finger with A Soft nails, F52.1 and
    F60.1), extended to whole fingers. No 3D renders.
  - Every finger shows each joint's angle on its own, named in plain words ("knuckle", "middle joint", "tip joint"), with the
    sum worked out: "29° + 29° + 10° = 68°, how far the fingertip turns".
  - The orbit's 41° (NASA doesn't say which joint) is no longer set against the per-joint sum. No number on the slide may look
    like it should equal a sum and not.
  - Sent 11:17: gd_joints and the finger-style check (feedback/attachments/F65/1115-gd_joints.png, 1115-finger-style-match.png).
    Open for the next round: on gd_rest (t 14.5) the blue "Thumb, from its base" and the red "Was z 24, pinned to the index's
    tip joint" run together on one line; and the check image's labels used code names (finger(), fngGeo), not plain words.

- **F65.14 STANDING (shape study), OPEN** (2026-11-09 11:25, on G7's gd_joints and the finger-style check, live 1794244526-ca02)
  "why are you so bad at drawing hands, those are genuinely scary and make me very uncomfortable, they look very unnatural " /
  "i also didn’t want to see all the fingers separated" / "the way you broke down the angles was good but that’s it" / "the area
  where the finger meets the hand/palm(?) looks by far the weirdest, and there isn’t really anything to signify it’s a cross
  section".
  - Keep: the angle breakdown (each joint in plain words, the angles adding up to the fingertip's turn).
  - Replace: the drawing. One whole hand with the fingers together, not six cut-out fingers. It must look like a real hand,
    above all where the fingers meet the palm, and must not read as an unexplained slice through a hand.
  - G8 (11:47-12:20, worktree g8, branch g8-shape-gd): the hand traced from an open hand model (WebXR generic hand, MIT,
    © 2019 Amazon) fitted to the study's hand and posed at Lee & Jung's angles, drawn flat in the film's greys.
  - Sent 12:13: the plain new hand (feedback/attachments/F65/1213-new-hand-plain.png). G8's settle still was held back: its
    lifted finger faded in across the knuckle (a light band right at the finger-palm junction), its angle guides floated about
    25 mm off the joints, and its thumb view from below read like a glove. G9 is fixing those.
  - G9 (12:15-12:40): the hand keeps its own tones; the current finger marked by a bright edge along its outline (fading out
    along the line into the palm, never across the fill); a line through the joints with a dot on each; drawn = labelled within
    0.1°; "FINGERTIP"; the thumb's bends in a circle "The thumb, seen from the palm". Live 1794249698-dff5 (gd_rest still G7's).
  - Sent 12:41: feedback/attachments/F65/1241-gd_joints-one-hand.png and 1241-thumb-circle.png.

- **F65.15 OPEN (shape study)** (2026-11-09 13:14, on 1241-gd_joints-one-hand.png and the live link) "the hand looks more
  natural there, but not perfect, and that also isn’t the hand in the presentation you’ve linked, the link still has the old
  version".
  - Checked 13:16: the artifact serves 1794249698-dff5 (published 12:41, the new hand on gd_joints). gd_rest (slide 3, the
    first hand in the deck) still had G7's drawing; an app's saved copy may also show the old version.
  - To do: the new hand on every slide (gd_rest first), and a realism pass on the drawing itself.
  - G10 (13:17-13:40): gd_rest on the traced hand; creases and nail folds in the film's style; a bigger thumb circle. Live
    1794253362-7b17. Sent 13:42: feedback/attachments/F65/1342-gd_rest-new-hand.png, 1342-hand-detail-2x.png.
  - Still open (G10's and my review): the little finger shows as a stub under the palm (same grey as the near hand, so it
    doesn't read as behind); pale lit spots in the shadow read as blobs; the index's nail doesn't show from the side; the
    thumbnail is still a little sticker-like; the two thumb poses overlap for about 0.5 s mid-move on gd_rest; the fingers no
    longer relax from straight; gdTip's fingertip balls on gd_landscape and gd_strength still drawn the old way.

- **F65.16 STANDING (shape study), OPEN** (2026-11-09 13:50, on the side-view hand, live 1794253362-7b17; the session's model
  was switched to Fable 5.2 just before) "the angle needs to be towards the side at a like 3/4ths view ( or similar) in at least
  one visualizations because it’s near impossible to tell the the fingers apart from just the side profile, and in many cases
  the hand looks 4 fingers, j also want you to redo your research using fable 5.2 max, a much smarter model now that you have
  access to it".
  - At least one visualization shows the hand in a three-quarter view (or similar), so all five digits can be told apart. A
    pure side profile reads as four fingers.
  - The shape study's research is redone from the sources up by Fable 5.2 at max effort (the reading taken: the research
    behind this mini presentation: the rest posture and joint angles, the hand's sizes, the thumb, friction, forces, what a
    finger can feel, and the derivations built on them).
  - G11 (the side view's polish, on the old model) was stopped at 13:52; its list carries over to the next agent.
  - Started 14:00, all on Fable 5.2: G12 (worktree g12, branch g12-shape-gd): a traced three-quarter view chosen by
    measurement, gd_joints rebuilt on it, gd_rest opening on it and turning to the side, far fingers a step darker in the side
    view, nails and creases, the section slides' fingertips. RA (worktree ra, ra-research-redo, max effort): the hand redone
    from the sources (rest posture in orbit and on the ground, sizes, the thumb, the hand on a mouse, an audit of hand.py).
    RB (worktree rb, rb-research-redo, max effort): what a finger can feel, friction, forces, finger stiffness, what "optimal
    gradient strength" should mean, an audit of the optimisation. Reports go to research/gd/redo/ in each worktree; nothing
    in the slides' numbers changes until Brock has seen what the redo found.
  - About 14:50 the account's weekly usage limit stopped all three agents (the notices gave its reset as Nov 13, 6am).
    Their work was saved: G12 had the view study and every trace done (out/00_view_candidates.png; nine views from the side
    round to the front), RA and RB each had an interim commit.

- **F65.17** (2026-11-09 20:32) "continue".
  - 20:35: RA and RB resumed where they stopped. G12 could not be resumed (its transcript would not load), so G13 took over
    its worktree as it stood (g12, uncommitted) to finish the slides on the three-quarter views.
  - G12's finding, measured: no one view shows five separate digits and also draws every bend at 60 % or more of true size.
    Its choice: view A (yaw 65°, raised 35°, all five apart) to open and settle on, view B (yaw 35°, raised 25°) to measure
    the index, middle and ring fingers, the hand turning between them.
  - Sent 20:40: feedback/attachments/F65/2037-three-quarter-views.png (the two views, raw traces), with one question: may
    the little finger go behind while the other three are measured, or should the hand stay on view A throughout?

- **F65.18 STANDING (shape study), OPEN** (2026-11-09 20:44, on 2037-three-quarter-views.png, which he attached back:
  feedback/attachments/F65/2044-brock-attached-three-quarter-views.png) "the thumb doesn’t look right here, double check it, it
  looks like it’s sticking out too much, make sure all the dimensions are right ( i’d like the average dimensions on the hand
  too not just the angle)" / "also the nails don’t look like the new revamped ones i wanted".
  - The thumb, checked: hand_pose.py's fit() (G10, 13:40) stretched the model's first thumb bone from 33.2 to 46.9 mm (the
    study's figure) so the drawn thumb could reach the study's contact point; everything beyond moved out 13.7 mm. The drawn
    hand's outside dimensions were never checked against measured averages.
  - Rule from now: the drawn hand's skin is fitted to the average hand's measured outside dimensions (each with its survey
    and definition) and to nothing else; the average sizes are shown on the hand as well as the angles. A check picture first
    (the flat hand from the back, every dimension on it), then the slides.
  - The nails: the picture was a raw preview (G12's quick trace, pale patches). The slides' nails must be the film's revamped
    ones (A Soft, F60.1: fngNail's shape, FNG_NAIL's paint), proven side by side from real page captures. My mistake: only
    captures from the built page go to him from now on.
  - He did not answer the A or B question; the two-view plan stands until he does.
  - 20:50: RA asked for the averages first (research/gd/redo/hand-sizes.json in its worktree); G13 told to take the stretch
    out, build the measuring tool, fit to the averages, redo the nails with the kit's own nail code, and make the two checks.

- **F65.19 STANDING (shape study), OPEN** (2026-11-09 20:54) "also the hand needs to be mirrored and in a position where all
  the fingers can still be seen correctly" / "the mouse goes in the right hand not the left one".
  - Checked: the traced hand is a left hand. hand_draw.py's side view mirrors on purpose so the fingers point right like the
    deck's z (the first trace's choice, mine), and the three-quarter views inherit it. A mirrored right hand is a left hand.
  - Rule: a right hand everywhere. In the side view the fingers then point left (a right hand seen from its thumb side), so
    gd_rest's diagram flips, the mouse's nose pointing left.
  - Read as his answer to A or B as well: every three-quarter view shows all five digits. gd_joints stays on the one
    five-digit view; view B (little finger hidden) is dropped there; each joint's angle is a number with a small true-size
    angle marker, since the bends flatten in that view.
  - 20:58, RA's first delivery (research/gd/redo/hand-sizes.json in its worktree, commit a49286f): 81 survey rows, 50 targets
    for men scaled to the 193.3 mm hand (ANSUR II, Greiner 1991, Garrett 1970; Buryanov & Kotiuk read in the primary). The
    thumb: 46 to 49 mm is the whole first bone between its joint surfaces; between joint centres the first link is 36 to
    39 mm, so the model's own 33.2 mm was close and the stretch made the thumb about 10 mm too long. Relaxed thumb: X-rays
    (Cooney 1981, 19 adults) give 10 to 15° at the knuckle and at the tip joint, against Lee & Jung's 39° and 10° from skin
    markers; RA recommends 12.5° and 12.5° (provisional). Brock asked 21:02 whether to switch the thumb's row.
  - 21:00: G13 told all of this in one consolidated note (right hand, one five-digit view, fit to hand-sizes.json, thumb
    links 37 / 35 / 32 mm, the thumb's bends as inputs built at 12.5° and 12.5° for now).

- **F65.20 DECIDED** (2026-11-09 21:01, answer to the question on the thumb's row) "yes it’s okay to switch the thumb to x ray
  values". The relaxed thumb's knuckle and tip joint take the X-ray figures (RA: 12.5° and 12.5°, Cooney 1981, being read
  again in the primary); the joint slide's thumb row becomes 12.5° + 12.5° = 25°, with the X-ray source in the source line.
  - 21:03: G13 told (no longer provisional). RA asked to compute the corrected thumb in a variant of hand.py (links
    37 / 35 / 32 mm, its base position, the X-ray bends) and write research/gd/redo/hand-variant.json; RB told a rerun of the
    trials on those paths will follow. The result's before and after go to Brock before any slide's result changes.

## F66. Renders at product-shot quality (2026-11-07 14:30)

- **F66.1 IN PROGRESS (R1, R2)** With a product render of two clear-housing mouse switches
  (feedback/attachments/F66/1430-reference-switch-render-as-he-sent.png): "these renders i’d switches also put anything you’ve
  ever made to shame, launch some sub agents to try to meet or beat the model detail, material and lighting quality". Two
  agents race on Theseus's GT01: R1 models it from scratch in Blender and renders in Cycles; R2 refines the deck's own GT01
  geometry (3d/parts/gt01.js) and path traces it. The bar: clear polycarbonate with real refraction and thickness, bevelled
  edges catching highlights, gold spring and contacts, black plunger and base, tin pins, soft studio lighting on a dark
  gradient, no noise. No maker logos or wordmarks.
- **F66.1 (state ~17:15)** The server restarted at about 15:40 and stopped R1 and R2 after about 68 minutes each. First pass
  (feedback/attachments/F66/1715-first-pass-4up.png: the reference, R1, R2's hero and inside view): both are below the
  reference. R1 has the best composition, but its cover reads blue-grey and milky. R2 has the clearest plastic and the best
  internals, but its gold is pale and its hero is composed edge-on. Both are short on edge highlights and micro-detail
  (the plunger's collar ring, moulded marks, tin pins). R2 resumed; R1 couldn't be (its transcript was too large), so R3
  continues R1's line from its script.
- **F66.2 STANDING (renders)** (~18:20, on round 2 of both renders beside his reference) "geometry needs to be further improved;
  some parts don’t feel thick enough, a lot of parts are lacking a very tiny filet to feel realistic, some renders don’t have the
  darker parts on the bottom illuminated properly". Every part at a real micro switch's thickness (cover walls about 0.6 to
  0.8 mm, terminals about 0.5 mm sheet); a tiny fillet on every edge (sheet metal about 0.03 to 0.08 mm, plastic 0.05 to
  0.15 mm); the black base, wedge and pins lit to show their form while still reading black. Round 3 for both lines (R2, R3).
- **F66.3 (state 2026-11-08 07:25)** Round 3 of both renders done overnight (R2 22906a0; R3 0bb6d7f): real part thicknesses,
  fillets on every edge, the dark bottom lit (feedback/attachments/F66/0725-*.png). R3's close view, gold mechanism through the
  side wall, is the strongest frame either line has made. Left: the gold under R3's hero tops reads pale champagne (R3's
  guess: the rim strips seen through the PC; a 7-minute fix), and R2's internals are thickened rather than remodelled.
- **F66.4 STANDING (renders), IN PROGRESS (R4)** (07:25, on R3's line, which he picked to push) "bottom material feels too matte
  instead of satin and in particular is where is missing fillets" / "around the holes and where the top and bottom pieces meet
  are where the holes are needed" ("holes": fillets). The black base and wedge in satin (roughness about 0.25 to 0.35, a soft
  sheen that follows the form), not matte; fillets that read at hero scale (about 0.2 to 0.3 mm) round every hole and cut-out,
  and along the seam where the clear cover meets the black base.
- **F66.5 DECIDED, IN PROGRESS (R4)** (07:44) "i’d like you to modify the top housing to have the angled clip on mechanism that
  the ttc switch has" / "but i don’t like the texts you added on top". The clear cover clips onto the base the way TTC's micro
  switch covers do, with angled snap clips in the side walls (researched, then modelled as a real snap-fit with fillets). The
  ">PC<" and date-wheel marks come off the top, which stays clean apart from the plunger's collar and plain moulding.
- **F66.6 (state 2026-11-08 08:30)** Round 4 done (R4, 75accd0 on r1-switch-render): the satin black base, round lips on every
  hole, a rounded parting seam, TTC-style side clips (inferred from TTC Gold product photos; the hook itself not visible), the
  text off the top, the gold reading gold (feedback/attachments/F66/0830-*.png). R4 found R3's fillets had never been built:
  Blender's bevel clamp shrank them to almost nothing, and a naming bug kept the back switch from every light link. Left: the clip
  reads modestly in the hero (clear over black); the back switch's base reads mid-grey; the hero's composition still differs from
  the reference.

