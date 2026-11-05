# GT01: side profile and plunger, settled by K1 (2026-11-05 ~04:40; walls revised 06:45)

Source: Gateron's "Vertical push mouse switch" render, the one Brock marked "best GT01 Reference"
(/mnt/user-data/attachments/17d0b892-9041-5973-afc8-9659df39052b/8e779cef-image.jpg, the same render as 4de29879-image.jpg),
traced side-on. Cross-checked against Gateron's exploded view (416482d1-image.jpg) and its pair photo (0e4e9ea4-image.jpg) for
the plunger's orientation. Brock: "priories sus profile accuracy over everything else".

Scale: Gateron publishes no dimensions, so the trace is scaled so that the cover's top edge is 12.8 mm (the D2F-class body
the model already uses): 14.53 px/mm. Measured tilt 19.8 deg; the model keeps 20 deg.

## Frames (the same as 3d/parts/gt01.js)
- World (the part's root): origin on the board's top at the middle pin, +Y up, +Z toward the plunger end (the front, the low
  end), X across the switch (its 5.8 mm width).
- Switch frame S (the tilted body): zs along the switch (+ toward the plunger end), ys up its axis (0 = the switch's base
  plane, 6.5 = the cover's top). S -> world: Y = ys cos20 - zs sin20 + lift, Z = ys sin20 + zs cos20.

## What changes
1. **The whole switch sits 1.02 mm lower.** lift = 6.4 sin20 - 0.52 = 1.669 mm (it was 2.689: H_MIN 0.5 -> -0.52). The render's
   front face runs from the top-front corner straight to the board, so the base plane's front corner would be 0.52 mm under the
   board: nothing below the board is drawn (in gt01.js the internal base block is trimmed to ys >= 0.6).
2. **The silhouette** (world z, y in mm) is unchanged from the trace: front foot on the board (6.20, 0); the front face, the
   switch's own end face, square to its top (so it overhangs), up to the top-front corner (8.24, 5.59); the top (20 deg) to the
   top-back corner (-3.79, 9.97); the back end face down to the switch's back-bottom corner (-6.01, 3.86); then the bottom
   housing's back face **plumb** to the board (-6.01, 0). Footprint 12.23 mm, height 9.97 mm.
3. **Walls straight and one thickness (revised 06:45, Brock: "the walls aren't straight ... and they aren't a consistent
   thickness for the bottom housing").** One wall, **0.45 mm**, everywhere: the wall of the D2F-class cover this model already
   uses for the switch (Omron D2F-class construction; Gateron publishes nothing, so it is representative).
   - **The cover's two end walls run on down past the shoulder**, as in Gateron's render: the back one (zs -6.4 to -5.95) down
     to the switch's base plane (ys 0), the front one (zs 5.95 to 6.4) down to the board. They are cover material (clear).
   - **The bottom housing fits between them:** its outline is (world z, y) back foot (-6.014, 0), front foot on the board at
     the front end wall's inner face (5.724, 0), up that face to the shoulder (6.445, 1.979), along the shoulder (ys 2.5) to
     (-4.737, 6.049), down the back end wall's inner face to the base plane (-5.591, 3.704), back along it to the switch's
     back-bottom corner (-6.014, 3.858), and down the plumb back face. Every edge straight.
   - **Side walls 0.45 mm thick** (they were 1.0), no edge bevel.
4. **The cut-outs, each one wall (0.45 mm) from the edges round it** (world z, y; both sides alike; sizes from the render):
   - front round hole: centre (3.44, 1.49), r 1.04 (0.45 above the board and under the shoulder)
   - back round hole: centre (-2.86, 3.81), r 1.01 (0.45 under the shoulder)
   - slot: centre (0.22, 3.37), 2.0 long x 0.74 wide, along the tilt (0.45 under the shoulder)
   - the long rounded triangle: (0.07, 0.45) r 0.35, (-5.564, 3.03) r 0.25, (-5.564, 0.45) r 0.25 (its bottom 0.45 above the
     board, its back edge 0.45 in from the plumb back face)
   (Superseded: the first trace's leaning back face, the shoulder corners at the switch's ends and the cut-outs at 0.27 to 0.57 mm
   from the edges.)
5. **The plunger** moves along the switch to **zs = 2.0** (was 3.4): the render's plunger block spans zs 0.6 to 3.5.
   - **The cap (the part above the cover) is turned 90 deg** (Brock: "the part that actually sticks out above the housing looks
     like it needs to be turned 90 degrees"): **1.5 mm along the switch (zs) x 2.1 mm across it (X)**, its top a half-cylinder
     of radius 0.75 mm about an axis along X, so side-on it is an inverted U and from the front a 2.1 mm bar with a rounded top
     (as in the pair photo). It stands **0.80 mm proud** of the cover's top (its apex at ys = 7.30; it was 0.45). Measured 0.76
     to 0.87.
   - The cover's plunger hole turns with it: 2.3 mm across (X) x 1.75 mm along (zs), r 0.45, the same 0.1 mm chamfer.
   - **Below the cover, unchanged** ("bottom part looks fine"): the flange 2.3 (X) x 2.9 (zs) x 0.43, under the ceiling at
     ys 5.55 to 5.98, and the nose 1.3 (X) x 1.1 (zs) down to the leaf. Both move with the plunger to zs = 2.0.
   - Plunger axis (world, unit, out of the switch): [0, cos20, sin20] = [0, 0.9397, 0.3420]. Rest apex (world): (X 0, Y 7.85,
     Z 4.38). Travel 0.35 mm along the axis (unchanged).
6. **Pins:** unchanged, COM / NO / NC straight down at world z = +5.08 / 0 / -5.08.

## In one line, for the board's switches
Lower the body 1.02 mm, raise the shoulder to ys 2.5, carry the cover's end walls down, make the housing's back face plumb and every wall 0.45 mm (side walls too), move the plunger to zs 2.0, and turn its cap so it is 2.1 mm across x 1.5
mm along with a rounded top, 0.80 mm proud, the cover's hole turned to 2.3 x 1.75.

## Uniformity (F26.2)
The same plunger (cap, flange, nose) is used for every switch: both mains and both side buttons (the side switches are this
switch at tilt 0, held by the shell, no side board: F12.4). In 2D the trigger posts and the side button's post are drawn at one
size too.
