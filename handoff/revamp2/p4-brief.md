# P4: polish the finished Shell and Shape chapters (b05, b06, b07)

Three builders finished their slides this morning and can't be resumed. Since then Brock, the critic, the model auditor,
the research agents and the integrator have decided changes. You make them. The list, with the reasons, is
/home/claude/work/POLISH.md (the b05, b06 and b07 sections). Also read each builder's review file
(/home/claude/work/review/b05.md, b06.md, b07.md: anything still open, including RESEARCH and KIT lines that land while you
work), their PROGRESS.md (/home/claude/work/b05/, b06/, b07/: how the files are built, their checks and models), FEEDBACK.md
F41 to F45 (Brock's newest answers) and the broadcasts /home/claude/work/BROADCAST-0930.md and BROADCAST-0945.md; then
handoff/revamp2/common.md and KIT.md for the film's rules. Work folder /home/claude/work/p4/ (PROGRESS.md).

## Files you own now
deck/src/30-b05-shell.js, deck/src/30-b06-lattice.js, deck/src/30-b07-board-shape.js. Nothing else. (b05 reads b06's B06_STRIP at draw time, so build them together: --own with both files, if build.py takes a list.) Build with build.py's --own
for the file you're changing (read build.py); the snapshot (deck/.snapshot/src) holds the shared code.

## How
- Three streams land on these files over the next hours: L1's lattice study (its winning rib and arch-beam sizes, written to
  review/b06.md as "LATTICE STUDY": put them into B06_STRIP and the arch models in one place each, re-run what depends on
  them); H2's corrected battery place and balance (review/b07.md "HARDWARE"); and the critic's (R2's) findings. Act on each as
  it lands; check the review files every 15 minutes or so.
- The rib-foot joint question for Brock needs a picture (FEEDBACK F44.1): make the options sheet image early and send its
  path to the integrator (SendMessage to: "main"), then carry on.
- L1 adds its own slide after b06's (deck/src/30-b12-latopt.js) and calls back to b05_cubed's ruler (FEEDBACK F45): keep the
  ruler's numbers stable, and coordinate wording with L1 if you change b05_cubed.
- Mark each POLISH.md item [x] with a one-line note (or WHY NOT). Every slide you touch: errs (`Q='&2d=1'`), qa at settle
  and mid, frames 0 / mid / settle at desktop and phone size, `answers` rows kept true, frame one shows the subject.
- Numbers: never round in Theseus's favour; one precision per comparison; derivations say "derived".
- Don't commit, push or publish. Report at the end: what changed per slide, anything you couldn't do and why, questions for
  Brock as multiple-choice options with a picture (an image path) for anything visual (F44.1).
