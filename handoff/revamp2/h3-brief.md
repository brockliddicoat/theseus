# H3: the 0.6 mm board (Brock's path to the 5.6 g target)

Brock, 2026-11-06 (FEEDBACK F47.4): the board's path to its 5.6 g target is **"0.6 mm, 5.63 g"**: H2's plan (read its report
in /home/claude/work/h2/PROGRESS.md and the table in 3d/pcb's README / mass.py): a 0.6 mm board, two layers, half-ounce outer
copper, a lighter encoder (its nickel-silver frame dropped, about 0.45 g) and a cored support. It keeps 22 % of the 1.0 mm
board's bending stiffness. H1 built plan 5 and H2 placed the battery; both have finished. Read their PROGRESS.md and
SHARED-CHANGES.md, KIT.md §4, FEEDBACK F30, F42, F47, F48. Work folder /home/claude/work/h3/ (PROGRESS.md, kept current).

## The jobs, in order
1. **The film's drawings first** (they're what Brock sees): find every shared drawing and constant that assumes a 1.0 mm
   board (pcbSec's default thickness, boardMM's side view, KEY_PARTS, the 2D twins, own_jointMM, encoder/support drawings,
   any `1.0` board thickness in 03-parts.js, 06-motion.js, 10-*.js shared files) and make them read one shared constant at
   0.6 mm; regenerate the 2D twins under the lock (`flock /home/claude/work/geo2d.lock ...`). Builders' 30-*.js files are
   owned by polish agents (P1: b09-b11, P2: b02, b03, b08, P3: b01, b04, P4: b05-b07): don't edit them; list in each owner's
   review file (/home/claude/work/review/<code>.md, dated, "HARDWARE") exactly what they must change (a constant, a label
   such as "1.0 mm FR4", a stiffness).
2. **The numbers:** mass.py and the board README carry the 5.63 g build (with each step's grams), the board's new bending
   stiffness (and its share of the old), and the encoder and support as drawn. The weight budget's board stays "5.6 g, a
   target" (F42.2); if the path lands at 5.63, say so where the budget shows the target.
3. **The 3D board:** rebuild plan 5 A and B at 0.6 mm, two layers, half-ounce outer copper: re-route on two layers
   (3d/pcb/tools: autoroute.py, routes.py), design-rule check 0 errors, every net routed; if two layers can't route a net
   cleanly, report it (a via-in-pad or a jumper is a question for Brock, not a silent fix). Install; rebuild the 3D bundle
   if the tooling expects it. The lighter encoder and the cored support in 3d/parts. Re-run balance.py (H2's tool) and
   report whether the battery's place moves.
4. Report what moved on screen in one paragraph (so the integrator can broadcast) and send it as soon as job 1 lands.

## Rules
- S1 is reshaping the shell at the same time (the wheel opening, the rear corners, the creases, the skate ledges, the screw
  posts, the rear rim); keep away from 3d/shell and coordinate through the lock and KIT.md §4.
- Exact-string edits in shared files; when copying to deck/.snapshot/src, apply your edit to the snapshot's copy if src has
  someone else's unfinished work (diff first).
- errs (`Q='&2d=1'`) on every slide that draws the board or a board section; frames of a sample (b03_switch, b07_board,
  b10_board, b11_board, b11_inserts). Don't commit, push or publish. Questions for Brock as multiple-choice options with a
  picture for anything visual (F44.1).
