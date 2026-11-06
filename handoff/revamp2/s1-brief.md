# S1: Theseus's shape: the wheel opening, the rear cutout corners, a centre hump, and a richer simplified mouse

Brock, 2026-11-06 09:31 (FEEDBACK F43, his marked-up screenshot: refs/photos/brock-2026-11-06b/0931-cutouts-markup.jpg):
- "i did not approve such a wacky scroll wheel wheel cutout design" (the wheel opening and the long tapered slot above and
  below it, top view);
- "the filets on the rear cutouts do not look natural or have good flow at all, they all are way to big, i’ve drawn in
  something closer to what i want but i want to to take what i drew and vastly improve it" (his red curves at both ends of
  the straight rear cutout: the turns must be much smaller and flow naturally into the side seams);
- "make the shape you’re using center humped like the starlight x, right the hump is way too far back/rear humped" /
  "this is in reference to the side profile not the top down";
- "the simplified mouse design you’re using in some places is a little too simple, i still need to be able to see things
  like the lattice and the creases above the scroll wheel the sora v2 has".

Read first: FEEDBACK.md F43, F38 (2D derived from 3D assets; the simplified mouse "clearly slightly simplified, only the parts
that matter"), F30 (the board and shell history), F12.11 (the dims), G3 (accurate, finished drawings in one style);
3d/shell/README.md and 3d/shell/tools (the scan-based shell: control mesh, skin fit, one seam, rear seam, groove, features);
3d/CONVENTIONS.md; handoff/revamp2/KIT.md (mouseSimple, msView, MS_DIMS, msLive) and /home/claude/work/f0a/ (how the
simplified mouse was extracted: ms_extract*.png, ms_consts.js); /home/claude/work/h1/PROGRESS.md and SHARED-CHANGES.md (the
plan-5 board, KEY_PARTS, the 2D twins). References: refs/photos/brock-2026-11-06/sora-v2-top.webp and sora-v2-side.webp
(the creases; the Sora's rear hump). Work folder /home/claude/work/s1/ (PROGRESS.md: done, in flight, next).

## Phase 1: an options sheet before any build (Brock reviews plans before builds, F30)
Make one review image (or two) at true scale, in the deck's line style, and send its path to the integrator with a short
note; wait for his answer before Phase 2 (keep working on research and tooling meanwhile):
1. **The wheel opening (top view)**: 2 or 3 clean options, each sized to the wheel (K2's 0.900 g six-arm wheel, its bay on
   the plan-5 board: x ±7.20, z 27.45 to 44.13) with even clearance; the Sora V2's own opening is the reference for
   "normal". No tapered slots.
2. **The rear cutout's corners**: his red curves digitised from the markup (scaled onto the real top outline), then 2 or 3
   improved versions: much smaller than now, curvature-continuous (no visible kink where a straight meets an arc: G2 blends
   or a clothoid, not a circular fillet), each a natural continuation of the straight cutout into the side seam. Show each
   at full mouse scale and zoomed.
3. **The side profile**: today's (rear hump) against a centre hump like the Finalmouse Starlight X, in 2 variants (the hump
   peak at about 50 % of the length, and one slightly behind), keeping the length, width and height (MS_DIMS 119.2 × 62.5 ×
   38.1 mm, from the scan per F12.11) unless Brock says otherwise. Find the Starlight X's side profile or at least its hump
   position and dims (you may use up to 12 WebSearch calls, standard mode; WebFetch freely); overlay it if you find an
   outline. Say where the hump's peak sits (mm from the front) for each.
4. **The richer simplified mouse**: the same views as mouseSimple (top, side, bottom) with the creases above the wheel (from
   the scan: show where they are) and the lattice visible (the shell's triangle lattice, drawn faintly, as an x-ray or a
   cutaway, at the lattice's real size; a separate study, L1, is now optimising the lattice's cell and rib sizes: use the
   current ones and leave a hook for L1's numbers). Show it at the sizes slides use (a full-stage view and a small locator)
   so the detail reads without clutter.

## Phase 2: build what he picks
- The 3D shell first (3d/shell: the shape, the openings, the corners, the creases kept; its meta), then the 2D twins
  (deck/tools/geo2d/build.sh) and the simplified mouse (deck/src/06-motion.js: mouseSimple / msView paths, MS_ constants),
  so slides, the 3D asset and the drawings agree (F0.2, F38). Replace any warm hex left in mouseSimple with the true greys
  of 01-core.js's ramps.
- The battery is being moved forward and up by H2 (F42.1: balance at the centre) at the same time: after your shell
  changes, re-check the battery's clearance to the new shell (tail and roof) and tell H2 and the integrator.
- Regenerate shared outputs under a lock so H2 and you don't clobber each other:
  `flock /home/claude/work/geo2d.lock bash deck/tools/geo2d/build.sh` (and the same lock around key_parts.py --write).
- 06-motion.js is shared with F0c (the chapter flight: CARD2 capture, the 'base' and 'screws' parts) and K (mouseRival, the
  verdict): edit with exact-string edits, never rewrite the file; when copying to deck/.snapshot/src, apply your edit to the
  snapshot's copy rather than copying the whole file if src holds someone else's unfinished work (diff first).
- Run errs (`Q='&2d=1'`) across every slide that draws the simplified mouse, the key plan or the shell twins, and shoot
  frame one and settle of a sample (b01_compromise, b02_cutouts, b03_side, b04_camera, b07 shape slides, the chapter cards);
  report what moved on screen in one paragraph so the integrator can broadcast it.
- Don't edit builders' 30-*.js files (write what they must change to /home/claude/work/review/<code>.md, dated, "SHAPE").
  Don't commit, push or publish. Questions for Brock as multiple-choice options.
