# The Theseus revamp: the common brief for every builder (2026-11-05)

You are one of seven builders redoing Brock Liddicoat's Theseus deck (repo /home/claude/theseus; the deck is a canvas film
pitching his 29.31 g gaming mouse). He asked for "a full revamp, not some tiny changes": **a new story with fewer, denser
slides** (131 → 76), built straight away, with as many builders "as it takes to be as thorough as possible without being
wasteful". Your brief (revamp/<code>-brief.md) lists your new slides, the old slides each one replaces, and his notes on
those old slides, verbatim.

## The story
- **The spine: ZERO compromises.** Every flagship gives something up (battery for weight, durability for weight, an
  optical switch's battery, shape, price); Theseus gives up nothing. Each chapter opens on the compromise most mice make in
  its area, as a problem, and its slides fix it.
- **Sell solutions to problems, not just solutions** (F33.4). Every slide runs: what most mice get wrong, *drawn
  mechanically* (the rival's fault, named and sourced), then Theseus's fix, then what the player gets.
- **Each feature sells its best problem** (F33.6): a missed shot only where that is the strongest case ("what if this goes
  wrong and you miss", or the quiet, constant loss a player never notices, the excuse they never knew they had);
  otherwise wear, a cheap feel, comfort, battery, weight, or a **higher skill ceiling** (F33.7). Don't repeat one pitch.
- **His important ideas lead** (F33.5): the ideas he called important but badly executed get the most care and weight.
- **Teach engineering with classroom demonstrations** (F33.8): research the examples professors use (a ruler bent flat
  and on edge, paper tearing at a nick, the Comet's square windows, straws in a square and a triangle, a hanging chain
  flipped upright, wood splitting along its grain, stacked coins), cite them, and draw them in the deck's style.

## The lessons from his ratings (FEEDBACK.md F27 has them in full)
G1 problem, then fix, then what the player feels · G2 real-world examples and forces you can feel, said on the slide ·
G3 accurate, finished drawings in one style, researched, nothing lazy or photo-real · G4 fewer, denser slides · G5 honest,
complete numbers, one precision per comparison, rivals included even when Theseus looks worse · G6 no "pts" or "points";
"khz" (lowercase); Piaknow is a name; "Dual 8khz wired and wireless"; "battery", never "cell"; plain words · G7 sell what
the player gets, at a glance · G8 uniform parts where uniformity is the claim · G9 the opening frame is the header, never
a lone phrase · G10 software and latency slides simple.

## Read first
1. Your brief, and this file.
2. /home/claude/theseus/FEEDBACK.md, selectively, since it's 100 KB: every **STANDING** and **DECIDED** item (`grep -n
   -E "STANDING|DECIDED" FEEDBACK.md`), F32 and F33, and every line that names one of your old slide ids. Never regress a
   decision.
3. /home/claude/theseus/deck/DESIGN.md, section 0 (items 9 to 12) and section 2b: the deck's look and the honesty tags.
4. The old slides you replace: grep their ids in deck/src. Reuse what's good (their drawings, data, sources and helper
   functions, by calling them), rebuild what he called lazy, wrong or confusing.

## How to build
- **Your file only:** deck/src/30-<code>.js (create it). New helpers go in it, named `<code>_…`. Don't edit any other
  file. Call existing helpers and data freely; if one needs changing for your slide, copy it into your file under your
  prefix. No 3D source edits, no bundle or 2D twin rebuilds: K1 (the GT01) and K2 (the board, the encoder) own the 3D, and
  your slides pick their work up when it lands. Use the shared board and switch drawing functions (boardMM, keyPlanMM,
  clk_gt01MM and so on) rather than redrawing those parts, so the new board and the GT01's walls reach your slides.
- **Each new slide:** `S({ id: '<code>_…', ch: '<chapter key>', theme, title, settle, ideas, src, replaces: [old ids],
  answers: [[his clause, what you did], …], draw })`.
  - `replaces` takes the old slides out of the film, and the rating panel shows him his notes on them beside your
    `answers`.
  - Give one answer per clause of his notes on every slide you replace, including clauses you couldn't do (say why) and
    clauses you moved to another builder's slide (say which). This is how he checks nothing was missed.
  - A chapter card takes `first: true`. Within a chapter, slides play in file order (30-r2 before 30-r3).
- **Build:** `cd /home/claude/theseus/deck && python3 tools/build.py main --out=<code> --own=30-<code>.js`. Everything
  else comes from deck/.snapshot, which is current.
- **Check** with `NODE_PATH=/opt/npm-tools/node_modules`:
  - `tools/errs.js <abs html> <ids>` in 2D (`Q='&2d=1'`), and in 3D for slides with 3D (`Q='&2d=0' READY_MS=60000`);
  - `tools/qa.js` at `T=settle` and `T=mid`;
  - screenshots (`tools/shoot.js`, `Q='&2d=1'`), downscaled before you look;
  - a contact sheet of all your slides, checked for the header on frame one (G9), overlaps and anything lazy.
- **Research** with WebSearch and WebFetch. Image hosts are often blocked; describe what you can't fetch. Every number
  is sourced or derived and marked, and you never invent a figure or weaken a rival.

## Rules
- Scratchpad: /tmp/claude-0/-home-claude/17d0b892-9041-5973-afc8-9659df39052b/scratchpad. Keep <code>/PROGRESS.md
  there as you go; the container restarts sometimes.
- Don't commit, push or publish. Never `pkill` Chromium broadly.
- **Pace:** thorough without waste. Plan all your slides first (a few lines each in PROGRESS.md), then build them in
  order of importance, finishing each before the next. Read big files in parts. Look at shots downscaled.
- Questions for Brock go in your report as choices (he answers with a multiple-choice tool). Don't stop to ask; take
  the best reading and say which.

## Report (short)
Per new slide: what it shows (one line), the old slides it replaces, every clause answered or why not, sources added.
Then the checks you ran, and your questions for Brock.
