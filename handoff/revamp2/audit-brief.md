# A: the independent feedback audit (did every note really land?)

You did not build any of these slides. Your job is to check, as Brock would, that every piece of his feedback was fully
taken into account in the revamped deck, "and it wasn't just some small change that archived the feedback" (F29.2), and
to report every gap. Brock today: "rely heavily on my feedback document, double check that all archived feedback has
actually been addressed". You only report; the integrator assigns the fixes.

Read /home/claude/theseus/handoff/revamp2/common.md (the bar every slide was built to), FEEDBACK.md (all of it), REVAMP.md,
and your scope below. Work folder: /home/claude/work/<your code>/ (PROGRESS.md, frames, the report).

## What to check
1. **Every clause of every note.** For each new slide in your scope: its `replaces` list and `answers` (read them in the
   slide's code, deck/src/30-*.js), and Brock's notes on the replaced slides (FEEDBACK F27, verbatim; also embedded as
   `F27R` in deck/src/05-f27.js). Split each note into its clauses. For each clause, look at the slide's frames and code
   and give a verdict:
   - **DONE**: the frames show it, plainly, at a glance where the clause is about the glance.
   - **PARTIAL**: something was done, but less than the clause asks (say what's missing).
   - **NOT DONE**: nothing on the slide answers it, or the answer moved it to a slide that doesn't do it either.
   - **OVERCLAIMED**: the `answers` text claims more than the frames show. Treat this as the most serious finding.
   - **SUPERSEDED**: a later decision in FEEDBACK replaced the clause (cite the ID).
2. **The archived slides first.** These eleven had Brock's scores archived as "revised" in the old deck, and he asked for
   exactly this check: `clicks`, `arc`, `clk_switch`, `tensioner`, `clk_tenmat`, `anchors`, `sidebuttons` (the click
   rebuild, v22), `cells`, `elecsheet1`, `cable`, `srf_encoder` (the board package). Check their notes clause by clause
   against the new slides that replace them, with extra care.
3. **Every standing rule, on every slide in scope**: the FEEDBACK items marked STANDING or DECIDED (F0 to F38), and
   common.md's bar (M1 to M10, "Clips and flow", the look). Grep and look: no "pts"/"points" metric, "khz" lowercase,
   "battery" never "cell", "weight" not "grams" for the idea, "Peak experienced stress (lower is better)", no dots between
   words, no peach skin, no outline round Theseus's marks, gradients only in type, blue only for Theseus, yellow sparing,
   red only for faults, header on the first frame (G9), before → after kept visible (F16.1), at-a-glance win (F14.10), the
   rival's fault drawn before the fix (F33.3), the simplified mouse for whole-mouse views (F38.8), sources only where they
   matter (F9.5, F9.7), no overlaps (F2.41), every lattice filleted (F9.27), the one-split seam (F9.28).
4. **The historical DONE items** in FEEDBACK for the chapters in your scope: an item marked DONE in the old deck is not
   proof it is in the new one. Check that the new slide still does it (or that it was deliberately dropped, and why).

## How
- Build the current deck: `cd /home/claude/theseus/deck && python3 tools/build.py main --out=<your code>` (all files
  live), and list the slide ids with `node tools/ids.js $PWD/dist/main-<your code>.html` (`NODE_PATH=/opt/npm-tools/node_modules`).
- Frames: `Q='&2d=1' PAR=1 node tools/shoot.js $PWD/dist/main-<code>.html /home/claude/work/<code>/shots 0 <id>:0.6 <id>:<mid> <id>:<settle>`
  for each slide (mid = 0.4 × settle). Look at every frame (downscaled to 960 px wide is enough for most clauses; zoom in
  where a clause is about a detail). One browser at a time (2 CPUs shared).
- Be concrete: quote the clause, say what the frame shows, give the verdict, and for anything short of DONE say exactly
  what the slide must change.

## Report
/home/claude/work/<code>/AUDIT.md: per slide, a table of clause, verdict, evidence (frame and time), fix. Then the
standing-rule findings, then the historical-DONE findings, then a short summary count. Finish with that summary and the
path.
