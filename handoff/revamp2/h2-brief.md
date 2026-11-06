# H2: the battery forward and up, and the board's weight as a target (hardware, round two)

H1 built board plan 5, KEY_PARTS, the GT01, the encoder and the 2D twins this morning and has finished; read its report in
/home/claude/work/h1/PROGRESS.md, its shared-change log /home/claude/work/h1/SHARED-CHANGES.md and KIT.md §4 first, then
FEEDBACK.md F42 (Brock's answers at 09:40) and F30 (the board's history). Work folder: /home/claude/work/h2/ (PROGRESS.md:
done, in flight, exact next step; keep it current so the work survives an interruption).

## The jobs
1. **F42.1, the battery "Forward and up":** move the LP402535JU about 5.9 mm forward and about 1.5 mm up, over the board's
   rear edge (over the mounting screws and the two capacitors there), so the mouse balances at its centre. Use H1's
   3d/pcb/tools/balance.py to land the balance point at mouse z 0 (±0.1 mm) and report the final offset, the height of the
   centre of mass, and the clearances: to the shell (tail and roof), to the board's parts under it, to the screws' heads,
   and to the antenna keep-out (F40.4: the module stays facing forward; say how far the battery's metal now sits from the
   antenna, since metal near the antenna was the point of F9.13). If any clearance fails, stop and report options rather
   than forcing it. How the battery is held there (the bands, b11_battplug: "a pouch that slides out of two bands") must
   still work: say how.
2. Regenerate KEY_PARTS (deck/tools/geo2d/key_parts.py --write), the 2D twins (tools/geo2d/build.sh) and the 3D shell / pcb
   assets that place the battery; keep MS_DIMS untouched. Copy changed shared files to deck/.snapshot/src (03-parts.js,
   06-motion.js only if you must touch it, the geo2d files) and log each change in KIT.md §4 and your PROGRESS.md.
3. **F42.2, the board's weight is a target (5.6 g):** in the hardware notes and the mass tool, carry 5.6 g as the target with
   the current estimate beside it (6.66 g board and parts; 7.92 g with the encoder and bracket) and list what gets it there
   (laminate thickness and layer count with their grams, a lighter encoder estimate with its basis). Don't redesign the
   board now; write the path.
4. Small items left by H1: the 2D encoder drawing's axle height (11 mm vs 12 mm in the mouse): make them one value;
   J2 and J3 sit 4.5 and 5.1 mm beside the antenna keep-out (b09's finding): Raytac publishes no keep-out for the
   AN54LM-P20A (Q1 confirmed it's behind registration), so record the distances and Taoglas's general 20 mm guidance
   (research/FILLS.md) and leave them unless they break a rule you can source.

## Coordination
- S1 is reshaping the shell at the same time (F43: a centre hump like the Starlight X, a new wheel opening, new rear cutout
  corners); it will re-check your battery's clearance against its new shell. Check against the current shell now, keep the
  clearance numbers in your PROGRESS.md, and message the integrator if a clearance is tight (under 1 mm).
- Regenerate shared outputs under a lock: `flock /home/claude/work/geo2d.lock bash deck/tools/geo2d/build.sh`, and the same
  lock around key_parts.py --write. 03-parts.js and 06-motion.js are shared with K and S1 (and F0c in 06-motion.js): exact-
  string edits only; when copying to deck/.snapshot/src, apply your edit to the snapshot's copy if src holds someone else's
  unfinished work (diff first).

## Rules
- Run errs (`Q='&2d=1'`) on every slide that draws the battery, the key plan or the simplified mouse after your change, and
  shoot frame one / settle of b01_battery, b07 (balance, if built), b10_battery, b11_battplug and the chapter cards that
  light the battery; report what moved on screen in one paragraph so the integrator can broadcast it.
- Don't edit builders' 30-*.js files. Don't commit, push or publish. Questions for Brock as multiple-choice options.
