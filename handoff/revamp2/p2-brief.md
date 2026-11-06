# P2: polish the finished Clicks and Surface chapters (b02, b03, b08)

Three builders finished their slides this morning and can't be resumed. Since then Brock, the critic, the model auditor,
the research agents and the integrator have decided changes. You make them. The list, with the reasons, is
/home/claude/work/POLISH.md (the b02, b03 and b08 sections). Also read each builder's review file
(/home/claude/work/review/b02.md, b03.md, b08.md: anything still open, including RESEARCH and KIT lines that land while you
work), their PROGRESS.md (/home/claude/work/b02/, b03/, b08/: how the files are built, their checks and models), FEEDBACK.md
F41 to F45 (Brock's newest answers) and the broadcasts /home/claude/work/BROADCAST-0930.md and BROADCAST-0945.md; then
handoff/revamp2/common.md and KIT.md for the film's rules. Work folder /home/claude/work/p2/ (PROGRESS.md).

## Files you own now
deck/src/30-b02-clicks.js, deck/src/30-b03-switch.js, deck/src/30-b08-surface.js. Nothing else. Build with build.py's --own
for the file you're changing (read build.py); the snapshot (deck/.snapshot/src) holds the shared code.

## How
- The heaviest item is b03's rail (F44.1): Brock wants all three side-rail designs shown, because "it's hard to visualize
  these things with text, that is the point of this presentation". Build it as a real demonstration (the same off-centre
  press on each, the tilt and the friction drawn, the force at the tip counted), with the model's numbers (b03's PROGRESS
  has the formula F = S / (1 − 2μe/Lg)) and a sourced μ once research/FILLS.md has it (Q3 is searching now; until then use
  b03's μ = 0.2, say "dry POM, assumed", and keep a constant you can change).
- b08_wheel waits on Q3's wheel weights (FILLS.md); do it last.
- Mark each POLISH.md item [x] with a one-line note (or WHY NOT). Every slide you touch: errs (`Q='&2d=1'`), qa at settle
  and mid, frames 0 / mid / settle at desktop and phone size, `answers` rows kept true, frame one shows the subject.
- Numbers: never round in Theseus's favour; one precision per comparison; derivations say "derived".
- Don't commit, push or publish. Report at the end: what changed per slide, anything you couldn't do and why, questions for
  Brock as multiple-choice options with a picture (an image path) for anything visual (F44.1).
