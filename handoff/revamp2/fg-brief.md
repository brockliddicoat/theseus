# FG: fingers that look right

Brock, 2026-11-06 10:06 (FEEDBACK F49.1): "the fingers look really bad right now". Every fingertip and thumb drawn on the
slides is in scope: the kit's `finger(x, y, ang, o)` (deck/src/06-motion.js, ~line 716; KIT.md documents it) and every
builder's own (grep the 30-*.js files for finger, thumb, fingertip, pad: e.g. b02's `b02_fingerEndMM`, b05's pale stand-in on
night slides, the shape chapter's `fingerAt` in 10-g-shape.js). The critic said earlier "the finger reads as a black capsule
on the night stage". Read FEEDBACK.md's look rules (mono-grey skin, never peach; G3: accurate, finished drawings in one style,
nothing lazy, abstract or photo-real; F44.1: design questions come with pictures), handoff/revamp2/common.md (the look) and
KIT.md. Work folder /home/claude/work/fg/ (PROGRESS.md).

## Phase 1: see what's wrong, then an options sheet (before any rollout)
- Render the film's slides that draw a finger or thumb (build the live film: `LB_FAST=1 bash /home/claude/scripts/livebuild.sh`;
  copy the html before shooting; one browser, PAR=1) and make a contact sheet of every finger as it is now, at the size
  each slide shows it. Write down what makes them look bad (silhouette, proportions, the nail, the pad, how they press,
  how they read on paper and on night, at small sizes).
- Design two or three directions for a fingertip in the deck's line style, true to anatomy and to scale (an index
  fingertip is about 16 to 20 mm wide: research/FILLS.md, Dandekar 2003; a thumb wider): the views the slides need (from
  above with the nail, from the side with the pad's curve, end-on, and pressing: the pad flattening against a surface, the
  nail staying rigid), mono-grey skin with a light and a shadow side, legible on paper and on night, at full size and at a
  locator's size. Draw them in code with the deck's own primitives (a test page, not in the film) and put them on one sheet
  beside today's fingers, with the same press shown on a trigger. Send the sheet's path to the integrator (SendMessage to:
  "main") and wait for Brock's pick (keep refining meanwhile).

## Phase 2: roll it out
- Build the picked design into the kit's `finger()` (all views and the pressing state; same signature, new options allowed),
  check every kit slide and every film slide that calls it (errs `Q='&2d=1'`, qa, frames), copy to deck/.snapshot/src
  (apply your edit to the snapshot's copy if src holds someone else's work in progress), and log it in KIT.md "Changes".
- For each builder file that draws its own finger, write in /home/claude/work/review/<code>.md (dated, "FINGER") exactly
  what its owner (polish agents P1 to P4) must replace with the kit's finger, and with which call.
- Don't edit the 30-*.js files yourself. Don't commit, push or publish.
