# S2: Theseus's shape, round two (resume S1's work with Brock's picks)

S1 did Phase 1 of /home/claude/theseus/handoff/revamp2/s1-brief.md (read it: the jobs, the files, the rules) and was stopped
while starting Phase 2; you continue it. S1's work folder is /home/claude/work/s1/ (PROGRESS.md, the options sheets
s1_options_A.png and s1_options_B.png, its scripts under scripts/, its rim study tail_compare.png and scan_tail_*.png). It
left the 3D shell untouched (git status shows no change under 3d/shell), so nothing is half-built. Your own notes go in
/home/claude/work/s2/PROGRESS.md.

## Brock's decisions on S1's sheets (FEEDBACK F46, F47, F49; read them in full)
- **The wheel opening: O1**, an even 1.0 mm gap (9.0 × 19.3 mm, r 1.6), cut in the 3D and read by the slides from the twin
  without smoothing (b02_trigBase's smoothing made the "wacky" funnel; write a SHAPE note in review/b02.md for P2, who owns
  b02's file now).
- **The rear cutout's corners: K3 flowing** (curvature-continuous, smallest radius 1.8 mm, bends early and wraps in late).
- **The side profile: no change at all** (F46.3, F47.1: "don't change the side profile at all, just say it's 39.9 and we'll use
  that model until we can do something better later"). No hump move, no stretch to 39.9, in the 3D or the 2D; 39.9 mm is only
  the stated height. If MS_DIMS disagrees with the outlines as drawn, fix only the box constant so fits are right, without
  changing any drawn line. Don't raise the wheel or the encoder.
- **The bottom rim (F47.2): fix it to the scan**: "you did the bottom rim very wrong, it's supposed to slope down in a straight
  line from the back, you cut off way too much, reference the 3d scan". Compare the rim below the hard crease at the back, in
  the 3D shell, the 2D twin and the kit's side outline, against the scan itself (3d/shell/shell-sora.glb and the scan tools):
  it slopes down from the back in a straight line; nothing cut off. Send the integrator a before/after crop of that region
  (side view, true scale, the scan overlaid) before regenerating everything.
- **The trigger cutouts seen from the side (F49.2)**: "they should be smooth and naturally arching, an offset from the top of
  the profile, not jaggy like they are right now": the seam line where the triggers are cut from the body, as seen from the
  side, becomes a smooth arch offset below the top of the profile (blending into K3 at the back, running out at the nose),
  in the 3D seam first, then the 2D. Include it in the same before/after.
- **The creases above the wheel**: the Sora V2's soft chamfer either side of the split ahead of the wheel (S1 identified it;
  Brock didn't object), modelled as a soft crease about 0.3 mm deep, drawn from the 3D.
- **The simplified mouse's detail**: as S1's sheet showed (the creases and the lattice on full-size views, the lattice faint
  as an x-ray, stopping at the hard crease, F43.6; the small locator without the lattice). The lattice's cell and rib sizes
  will come from L1's study (watch /home/claude/work/review/b06.md for "LATTICE STUDY"; use the current 12.5 mm cells and
  1.0 to 1.2 mm ribs until then, from one constant you can change).
- **b04's skate ledges**: four identical 19.5 mm corner ledges, three slots each, the default dots at the ends 13 mm apart,
  2 mm fillets; tell the integrator which KEY_PARTS values change.
- **The four screw posts** down to the board's MH1-4 (#54): the rear pair from the body; the front pair on a body-side bridge
  or arms under the triggers' travel (never hanging from a trigger, which moves). Give their mass to the balance (H2's
  /home/claude/work/h2/tools: clear.py and balance.py; H2 has finished; its battery is at centre z -26.98, solved with a
  1.32 g post estimate): report the new balance point with the real posts.

## Also running, so coordinate
- H3 (or its successor) is making Theseus's board 0.6 mm (F47.4: BOARD_T / BOARD_TOP in 03-parts.js, the board's top face
  stays where it was); K's shared-code work is finished; P1 to P4 own the builders' 30-*.js files (write what they must change
  in /home/claude/work/review/<code>.md, dated, "SHAPE").
- Regenerate under the lock: `flock /home/claude/work/geo2d.lock ...` around the 2D twins and key_parts.py --write.
- Exact-string edits in shared files; apply your edit to the snapshot's copy when src holds someone else's unfinished work.
- When it lands, send the integrator one paragraph on what moved on screen. Don't commit, push or publish.
