# B02 checkpoint 1: `b02_cutouts` (Straight rear cutouts), built and checked

Frames (2D, paper, full size): /home/claude/work/b02/shots/checkpoint1/
- 31_b02_cutouts_0.6.png (the hook: the whole simplified mouse, the Sora's smile lit in yellow, the classroom panel opening)
- 31_b02_cutouts_2.1.png (the rival under the first press: the trigger turns about a bend line 13.2° off square; 47.0 gf
  on the inner side; at the switch 8.0 % of the travel goes sideways)
- 31_b02_cutouts_4.2.png (mid-frame, 0.4 × settle: the cutout straightening in place)
- 31_b02_cutouts_5.3.png (Theseus under the same press: the bend line square, 47.0 → 48.8 gf, 0.0 % sideways)
- 31_b02_cutouts_10.5.png (settle: 52.3 → 48.8 and 47.0 → 48.8 gf, the verdict 8.0 % → 0.0 % sideways push, what you feel)

What it does: it opens on the kit's whole mouse from above with the Sora V2's smile-shaped rear cutout lit, pushes in once
to the left trigger (locator kept), shows the spring under the cutout and the bend line it forces (13.2° off square, from the
smile in Brock's scan via the 3D model), and presses the same finger at the same two points before and after the cutout
morphs straight in place. The numbers come from one hinge model (lever arms about the bend line, the GT01's 55 gf, the
bridge's 7.7 gf): the click weighs 47.0 / 52.3 gf across the button on the smile and 48.8 / 48.8 gf straight, and the
switch's sideways share falls 8.0 % → 0 %, with a classroom panel (a page folded on a square crease lands on itself; on a
slanted one it swings aside).

Checks: errs ok; qa clean at settle (10.5) and mid (4.2); frames judged at 960 × 540 and phone width (845).
Shared code: none changed. My helpers are `b02_` (trigger outlines decoded from GEO2D shell / shell-sora, a plan-view
trigger painter, the hinge model, a small 3D camera kept for later slides).
