# L1: the lattice study: the best lattice, beam size and fillet size, and the slide that shows how we know

Brock, 2026-11-06 09:31 (FEEDBACK F43.4): "run a simulation to determine the perfect lattice and lattice beam dimension and
filet size for the mouse and explain how that conclusion was arrived at in the presentation".

Read first: FEEDBACK.md F41.1 (his strength rule: PP-C-20A breaks at 120 MPa stretched, 207 MPa bent), F19 (the heat scale),
F33 (selling rules), G1 to G10; handoff/revamp2/common.md (the bar) and KIT.md; the existing models: deck/src/07-sim.js (the 2D
frame/FE solver, which passes 35 textbook checks), the 3D stiffened-shell study in 3d/lattice (CST/DKT shells with eccentric
rib beams, 9,304 nodes; deck/src/10-d-shell.js SHL_FE and shlLattice describe it), the fillet-size study
(deck/src/09-fillet-data.js), b06's slides (deck/src/30-b06-lattice.js: the 62.5 mm strip, the honeycomb vs triangles, the
fillet slide); the model auditor's /home/claude/work/models/MODELS-AUDIT.md (what was wrong before: bending peaks against the
tensile strength, buckling ignored, ribs-only stiffness quoted as the shell's, peak sampled inside the part; its buckling
solver /home/claude/work/models/tests/buckle.js) and the research in /home/claude/work/research/FILLS.md (forces: a resting
hand 4.4 N, office squeezes 0.4 to 2 N, 10 N "a hard press"). Work folder /home/claude/work/l1/ (PROGRESS.md).

## The study
- **Design variables:** the lattice's topology (at least: triangles (isogrid), hexagons, squares/diamonds, and the plain
  wall of the same mass as the baseline; add others if they're credible for an injection-moulded shell), the cell size,
  the rib (beam) width and height, the skin (wall) thickness, and the fillet radius at the nodes and rib roots.
- **Loads:** the crown press (10 N, a hard press; and 4.4 N, a resting hand), the side squeeze (2 N, the measured office
  peak, and 10 N), off-centre presses; report each.
- **Measures:** stiffness (deflection under each load), strength by F41.1 (share of strength used: stretched against 120,
  bent against 207), buckling of ribs and skin, stress concentration at the fillets (the fillet study), all per gram.
- **Constraints:** the shell's weight budget (the budget leaves about 10.35 g for the shell; see ntr_budget in
  deck/src/14-b-intro-ex.js), moulding (minimum rib width and the rib-to-wall ratio for PP-C-20A that avoids sink marks;
  minimum fillet a mould can make; cite a moulding guide), and the space under the shell (the board, the battery).
- **Method:** a sweep on the 2D models to map the space, then the best few candidates (and the baseline) in the 3D shell
  study, which decides. Converge (refine near the optimum), check sensitivity (how flat the optimum is), and be honest: if a
  solid wall or another topology wins on a measure, the study says so; the slide shows what the simulation found, not what
  we hoped. Keep each run reproducible (a script and its inputs in your work folder; results as JSON).
- 2 CPUs are shared by about fifteen agents: keep runs lean (node or python, no browser for the solving), cache results.

## The slide (or two)
Add them in a new file of your own, deck/src/30-b12-latopt.js, placed in the shell chapter after b06's lattice slides with
the sort anchors (`after:`; read deck/src/13-sort.js and how b06's slides are ordered in REVAMP.md and the live ids). The
story, at a glance (common.md's bar: frame one shows the subject; the problem first; a verdict; a source line): what we
varied, how each design was tested (the press, the squeeze, drawn), the map of results (a Pareto front of stiffness and
strength per gram, every design a point, the baseline marked), the winner and why it wins, its numbers (cell, rib width ×
height, wall, fillet), and what it means for the player (no flex, no creak, at its weight). Use the kit (KIT.md: verdict,
demoPanel, scaleNote, establish) and its heat key if K has added one (watch KIT.md "Changes"). Check: errs (`Q='&2d=1'`),
qa at settle and mid, frames at desktop and phone size.

## Hand-offs
- When the winner is known, tell the integrator at once: the shell (S1, which is adding the lattice to the simplified mouse,
  F43.5) and the 3D shell should use the optimised numbers, and b06's slides may need to quote them (write the facts to
  /home/claude/work/review/b06.md, dated, "LATTICE STUDY").
- Don't edit other builders' files or shared files (ask the integrator; K maintains the shared code). Don't commit, push or
  publish. Report: the method, the winner with its numbers and margins, what surprised you, and questions for Brock as
  multiple-choice options.
