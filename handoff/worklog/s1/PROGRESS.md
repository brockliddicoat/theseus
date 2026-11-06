# S1 progress (Theseus's shape: wheel opening, rear cutout corners, centre hump, richer simplified mouse)

Started 2026-11-06 ~09:34. Brief: /home/claude/theseus/handoff/revamp2/s1-brief.md (+ common.md).
Resume rule: read this file top to bottom, then continue at the first unchecked item.

## Integrator messages (act on all)
- 09:4x F43.6 (Brock 09:38): "the bottom rim (the lower part after the hard crease) of the shape shouldn't have the
  lattice, it'll make it too complicated to manufacture". The lattice stops at the hard crease (the skirt line, MS_SKIRT
  9.3 mm over the pad); the rim below it is plain wall. Apply in the options sheet (lattice only above the crease) and in
  the 3D shell build.

- 09:5x Phase 2 inputs: (1) H2: the shell has no screw-boss posts; the board is screwed from below into MH1-4 (#54,
  b11_board): model four posts down to the board (~Ø5.3 stand-in); integrator says the front pair hangs from the
  triggers' underside (first surface above MH1/MH2) -> CAUTION: the triggers move (click); a boss on a trigger clamps it
  to the board. Flag + propose (a body bridge/arch under the triggers, or the wheel-bay frame). Give post mass to H2
  (balance); keep the battery clear (H2's battery: centre z -21.94, 1.5 mm up). (2) b04 skate ledges (gld_under): four
  identical 19.5 mm corner ledges, three slots each, default pair at the ledge ends 13 mm apart, grown from the wall with
  2 mm fillets; 3D shell ledges + KEY_PARTS corner dots (now 7.94 mm apart) must match; tell H2 which KEY_PARTS values change.

- 10:0x Height pair: F12.11 stated 119.3 x 62.4 x 39.9 but "Use the numbers only" kept the scan (38.1 tall; MS_DIMS
  119.2 x 62.5 x 38.1). F0c: the kit's side/front outlines are 39.9 tall while MS_DIMS.H is 38.1 (boxes disagree). Show
  the new profile at both heights (38.1 scan, 39.9 stated) as one more pair; whatever he picks, make the outlines,
  MS_DIMS and the 3D shell agree. (Plan: the height scales about the crease too: y' = 9.3 + (y-9.3) k(z) sH,
  sH = 30.6/28.8 = 1.0625 for 39.9.)

## Status
- [x] 0. Read: brief, FEEDBACK F43 (F43.1-F43.6), F38, F30, F12.9/F12.11, F11.3, G3, F0.2; 3d/shell/README.md,
      3d/CONVENTIONS.md (Brock designed the Starlight X / SLX shape!), KIT.md (mouseSimple API), f0a extraction,
      h1 PROGRESS + SHARED-CHANGES, 06-motion.js msView/mouseSimple, b02 trigger outline code (b02_trigBase).
- [x] 1. Phase 1 research + digitising (scripts in work/s1/scripts; see Findings)
- [x] 2. Options sheets: /home/claude/work/s1/s1_options_A.png (1 wheel opening O1/O2/O3 + today + Sora; 2 rear corners
      K1/K2/K3 + today + Brock's sketch, full, zoom with curvature comb, side view) and s1_options_B.png (3 hump H50/H54
      + today, height change; 3b height pair 38.1/39.9; 4 richer mouse: top/left/bottom at 6.5 px/mm, small sizes, the
      creases reference). Built by scripts/sheet_a.py, sheet_b.py. Sent to main (SendMessage) ~10:2x.
- [ ] 3. While waiting: tooling for the 3D shell changes (hump warp, corner, opening), research
- [ ] 4. Phase 2 (after Brock's picks): 3D shell, meta, geo2d twins (flock), mouseSimple, KEY_PARTS, battery clearance
      (tell H2 + integrator), errs + shots, review notes for builders (SHAPE)

## Findings so far
- 8 of 12 WebSearch used (SLX). SLX: 124.8 x 58.9 x 39.5 mm, 38 g, symmetric, "a fuller rear hump" (gadgetpilipinas,
  back2gaming, xiaomitoday, mouselog, maxgaming); no orthographic side outline public; apex ~52 +/- 3 % read off
  Finalmouse's side render (back2gaming SLX_shot2). Images in work/s1/dl/slx (reference only).
- Markup registration: screenshot = stage x 0.6371 + (47.90, 27.42); b02 camera camFit([-34,-60.5,44,66],[80,270,860,650],
  0.06): s 8.6667, centre (-12,-27.5) at (510,595). Left red: vertical at kit x -28.2 (3D inset ~1.7) to Z 7.5, turn to
  (-26.5, 4.85); right: x 29.3 (inset ~0.5) to Z 8.6, turn ~3.8 x 3.8. markup_digitised.json.
- The funnel ("wacky" slot) is b02_trigBase's (a+2p+b)/4 smoothing of the sparse twin ring (corners at the opening): the
  3D opening is a plain 9.7 x 18.5 rect (x +-4.85, z 28.31..46.8, r ~0.5). -> b02 review note (SHAPE): no smoothing across
  corners (or read the new opening from the twin).
- Wheel through-wall footprint (inner skin, 1.4 wall): z 28.8..46.1 at x 0 (17.3 long), 29.1..45.6 at x 3.3; outer skin
  30.4..45.7. Wheel proud 2.91 mm over the crown. Sora opening 9.4 x 18 (x +-4.7, z 28.4..46.4).
- KEY outline (SORA_HALF) is 0.6 mm wider than the 3D body at z -0.4..11 (photo trace incl. the side buttons?);
  everywhere else within 0.2. -> mouseSimple top should come from the 3D twin (Phase 2).
- Creases above the wheel = the Sora V2's soft chamfer each side of the split ahead of the wheel (RTINGS photo: an edge
  ~58 px from the split, parallel to it); the fitted skin lost it; the 1seam's residue strips at x +-4.2/5.25 are not it.
- Lattice asset (3d/lattice) built on the scan (rear hump), a 12.5, ribs 1.0-1.2, fillets 0.6-0.75; its front arch
  follows the OLD smile (z 4.8 + 0.0058x^2) and its bosses are at (+-25.6,-31.8),(+-23.7,9.3), not the board's MH1-4;
  ribs run down to the rim (F43.6 says stop at the crease 9.3). All need the regenerated lattice (L1 / Phase 2).
- Hump warp (scripts/hump.py): y' = 9.3 + (y - 9.3) k(z) [x sH for 39.9]; k from h_new(z) = h_old(phi(z)), phi a C2
  quintic bump (z_t -42, z_f 46). H50: apex z 0.08 (59.7 from the front), lift max +3.04 at z 13.8, drop -1.47 at z -20;
  H54: apex z -4.69 (64.5), +1.92 / -1.11. Wheel crown +0.59 (H50) / +0.30 (H54); 39.9: +1.64 / +1.33.
  Smooth centre profile: scripts/heightmap.py -> profile_centre.json (opening filled by the crown; seams closed).
- Corner options (scripts/corners.py): quintic Bezier, 3 control points on each straight, evenly spaced: K1 D 2.0
  (rmin 1.51, 2.0 x 2.0), K2 D 3.0 (rmin 2.27, 3.0 x 3.0), K3 d 3.2 / e 7.0 (rmin 1.83, 3.3 x 7.0). Side seam: straight,
  inset 1.2 from the 3D outline (y ~26.3-27.0 at z 7-12), blended into today's trace over z 16..24.
- The 3D twin's wheel opening (shell.json axis 1, triggers' inner edges): a plain rectangle x ±4.7, z 28.4..46.5, small
  corner rounds; wheel bay ±5.6 x 26.8..48.0. The tapered slot Brock circled is in b02's drawing (b02_trigBase smooths the
  twin's ring and draws both triggers' inner edges: TODO confirm where the taper comes from).
- The rear corners in top view: the side seam runs back along the side wall at 23.4 -> 30.5 mm high, so from above it
  sweeps inward from the outline in a big curve (x -29.3 at z 17 to x -23.6 at z 4.84): that is the "fillet" he sees.
  3D corner itself is r 2 mm (rear_seam.py).
- Side profile: MS_SIDE peak at Z ~ -14 (mm, scene), i.e. ~73.5 mm from the nose of 119.2 = 62 % back (rear hump).
- Simplified mouse top view = KEY_PTS (Sora outline) scaled by MS_K; side/front = 3D twin; rear cutout = straight line.

## Decisions / numbers
- Frames: scene X = user's left, Z = nose, Y up. Key plan x = -X, y = -Z. MS_DIMS 119.2 x 62.5 x 38.1.
