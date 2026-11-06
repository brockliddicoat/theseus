# P1: polish the finished chapters (b09 Electronics I, b10 Electronics II, b11 Ownership)

Three builders finished their slides this morning and can't be resumed. Since then the critic, the model auditor, the
research agents and the integrator have decided changes for their slides. You make them. The list, with the reasons, is
/home/claude/work/POLISH.md (the b09, b10 and b11 sections); also read each builder's review file
(/home/claude/work/review/b09.md, b10.md, b11.md: anything still open that the list doesn't cover, including the RESEARCH
lines), their PROGRESS.md (/home/claude/work/b09/, b10/, b11/: how their files are built, their checks, their models) and
the broadcasts /home/claude/work/BROADCAST-0930.md and BROADCAST-0945.md. Read handoff/revamp2/common.md and KIT.md for the
film's rules. Work folder /home/claude/work/p1/ (PROGRESS.md: done, in flight, next).

## Files you own now
deck/src/30-b09-signal.js, deck/src/30-b10-power.js, deck/src/30-b11-own.js. Nothing else. Build with
`python3 tools/build.py main --out=p1 --own=30-b09-signal.js,30-b10-power.js,30-b11-own.js` if build.py takes a list,
otherwise one file at a time (read build.py). The snapshot (deck/.snapshot/src) holds the shared code as it stands.

## How
- Work the list item by item; mark each [x] in POLISH.md with a one-line note of what you did (or WHY NOT).
- Items that wait on the kit's `mouseRival` (K is building it now: watch KIT.md "Changes"): do the rest first; when it
  lands, switch the rival mice in b09_chip, b10_lights and b10_cable (and any other whole rival mouse in your files).
- Every slide you touch: errs (`Q='&2d=1'`), qa at settle and mid, frames 0 / mid / settle at desktop and phone size
  (0.44 ×), and each slide's `answers` rows kept true. Keep each slide's frame one showing its subject (M6).
- Numbers: never round in Theseus's favour; one precision per comparison; a derivation says "derived".
- Don't commit, push or publish. Report at the end: what changed per slide, anything you couldn't do and why, and any
  question for Brock as multiple-choice options.
