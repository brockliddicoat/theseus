# K: the shared-code maintainer (kit, sim, data)

The film's builders, critic and model auditor have filed requests against the shared code. F0a (the kit's author), H1 and
M have finished. You own the shared files now, except deck/src/20-app.js and the flight/card-capture code F0c is adding to
06-motion.js (CARD2, the 'base' and 'screws' parts of mouseSimple): F0c (still running) owns those; mouseSimple's geometry
and msView paths, which S1 is reworking for Brock's new shape (F43); and 03-parts.js's KEY_PARTS block and the geo2d twins,
which H2 regenerates. Coordinate through KIT.md "Changes" and keep your edits away from them (exact-string edits only).

Read: handoff/revamp2/common.md, KIT.md, /home/claude/work/review/FILM.md (F8, F9, F10, F12, F15), the model auditor's
/home/claude/work/models/MODELS-AUDIT.md (its "For you to apply in shared code" items are below) and
/home/claude/work/review/b05.md "MODEL UPDATE 09:03" (feUse / feBreakAt code). Work folder /home/claude/work/k/
(PROGRESS.md: done, in flight, next; keep it current).

## The list (in this order)
1. **mouseRival(view, o)** (FILM F9; builders b01, b09, b10 wait for it): rivals are drawn today with Theseus's simplified
   outline, which blurs whose mouse is whose. Make a neutral rival mouse for the views mouseSimple has (top, bottom, left /
   side, right, front): a plain rounded outline in the rival grey (C.comp family), no Theseus details (no seam, no trigger
   cut-outs, no lit parts), sized from o.dims [L, W, H] (default a typical 120 × 63 × 39), with optional anchors for
   callouts (the switch fronts, the sensor, the cable exit) so builders can point at parts. Same calling style as
   mouseSimple/mouseFit (box fitting). Document it in KIT.md and add a kit test slide in 19-kit-test.js.
2. **verdict()**: (a) the `who` labels collide when the old value is short (b11): lay them out so they never overlap; (b)
   numbers print without a space before "%" ("0.007%") while the film writes "17.6 %": one rule, a space before % and units.
3. **sentence()** (04-ui.js / 01-core.js): it capitalises the first letter, turning "iFixit" into "IFixit"; leave words
   with an internal capital (iFixit, iPhone, eBay) alone.
4. **F41.1 in the shared solver**: add feUse / feBreakAt to deck/src/07-sim.js (120 MPa stretched, 207 MPa bent for
   PP-C-20A; the code M wrote is in review/b05.md); in 10-d-shell.js read r.smax where anything still reads shlHot's r.peak.
5. **One value per material** (M): FR4 is 19 GPa in one file and 20 in another, magnesium 46 vs 44.8 GPa: pick the sourced
   value, put it in SIM_MAT (or the one shared constant), point every file that has its own copy at it (only shared files;
   for builders' 30-*.js files, list who must change what in their review files), and merge b05's b05Fr4Flex (Gund FR4
   flexural 552 / 483 MPa) into shlFr4.
6. (Moved to S1, who is reworking mouseSimple's geometry: leave mouseSimple's internals alone so your edits don't collide.)
7. **The heat scale's key** (M's must): b05 and b06 use the squared heat scale (F19.3) with no key on screen; give the kit a
   small key helper (`heatKey`: the scale's colours with "share of strength used" or MPa ticks, per M's convention: colour by
   share of strength used where a slide talks about breaking) and tell b05 and b06 in their review files.
8. **KIT.md and common.md**: write the conventions decided this morning where builders will read them: the verdict grammar
   (FILM F8/F15: the struck value is the rival's), click weights in gf (F3), the hard-press convention (BROADCAST-0945 §3),
   one test strip for the shell chapters (F4), the board colour rule (black and gold, rival grey).

## Rules
- Each change: node --check, then build (`python3 tools/build.py main --out=k`) and run errs (`Q='&2d=1'`) on the kit test
  slides and on every slide that calls the function you changed (grep the 30-*.js files); look at the frames.
- When a shared file passes, copy it to deck/.snapshot/src/ (builders build against the snapshot) and log the change in
  KIT.md "Changes"; for 06-motion.js copy only after diffing against the snapshot, so F0c's unfinished code doesn't leak
  into the snapshot (if src has F0c's work in progress, apply your change to the snapshot's copy by the same edit).
- Don't edit builders' 30-*.js files; write what they must change in /home/claude/work/review/<code>.md (append, dated,
  "KIT"). Don't commit, push or publish. Report at the end: what changed, the new helpers' signatures, who must act.
