# FG: fingers that look right (FEEDBACK F49.1) — PROGRESS

Brief: /home/claude/theseus/handoff/revamp2/fg-brief.md. Work folder /home/claude/work/fg/.

## Status
- 11:16 started. Read the brief, FEEDBACK (F49.1, F9.24, G3, F44.1), common.md, KIT.md (finger API + Changes).
- 11:20 film: copy of the 11:11 live build (LB_FAST) -> film/main-1111.html (105 slides). Not rebuilt (it was 4 min old
  and rebuilding wipes /home/claude/live under other agents).
- 11:25 inventory done (runtime scan, tools/scan.js -> scan-1111.json): 23 film slides draw a finger (below).
- 11:52 model + three directions drawn on a test page (src/19-fg-*.js, tools/build_test.py -> dist/fg-test.html).
- 12:01 SENT to main: sheets/fg_options.png (views paper + night, in-film frames, small sizes + thumb) and
  sheets/fg_now.png (today's 25 fingers at slide size). Recommended A (Line). WAITING for Brock's pick; refining meanwhile.
- Sheets: sheets/fg_views_paper.png, fg_views_night.png, fg_context.png (tools/sheet_ctx.py, from film/var-{A,B,C}.html made
  by tools/make_variant.py), fg_small_thumb.png, fg_now.png (tools/sheet_now.py).

## Tools (mine)
- tools/scan.js <html> <out.json> [step]: wraps every finger-drawing function, sweeps every slide, records calls.
- tools/shots.js <html> <outdir> id:t ...: fast frames from one page (go + __seek); checked against tools/shoot.js (max
  pixel diff 66/255 on 10 px of 2 M: antialiasing).
- tools/grid.py: lays crops out at 1:1. tools/build_test.py: the test page (snapshot's shared files + src/19-fg-*.js).

## Inventory: every finger in the film (11:11 build), stage px per mm, ground
| slide | ground | drawn by | view | px/mm | notes |
|---|---|---|---|---|---|
| b01_compromise | paper | kit finger via b01_bigFlex | side, ang 2.55 | 4.1-5.1 | presses the UltralightX's top at a slant (no surf) |
| b01_compromise | paper | kit finger via b01_tradeIcon | side, ang 2.55 | 0.55 | icon size: a grey dot |
| b02_cutouts | paper | kit finger | top | 4.6-8.7 | on the left button |
| b02_seams | night | kit finger (x2) | top | 4.6-13 | two fingertips on the buttons |
| b02_seams | night | b02_fingerEndMM | end (own) | 16.7 | the loupe "under the fingertip, from the front" |
| b02_flush | paper | b02_fingerEndMM + kit 'end' | end | 13.7-19.5 | the section across the mouse at the fingertips |
| b02_direct | night | kit finger | side | 12.5 | on the trigger (clickMM) |
| b02_rails | night | kit finger | top | 4.6-8.7 | |
| b02_wedge | paper | kit finger | side | 12.5 | on the trigger |
| b03_side | paper | kit finger (thumb) | side, ang -PI/2 | 24 | the thumb on the side button, huge: an index finger scaled up |
| b05_material | paper | kit finger | side, ang 0.42 | 4.5 | presses a level strip at 24° (no surf) |
| b05_cubed | night | kit finger | side, ang 0.42 | 4.6 | same |
| b05_nopick | night | kit finger + shadowBlur glow | side, ang 0.42 | 9 | the critic's "black capsule"; b05 added a pale glow |
| b05_hotspot | paper | kit finger | side, ang 0.42 | 8.7-18.6 | |
| b06_lattice | paper | kit finger (b06_press) | side, ang PI/2 and 0 | 4.2-6.2 | pointing straight down: touches with its end |
| b06_light | night | kit finger | side, ang PI/2 | 6.2 | |
| b06_arch | night | kit finger (egg: two, one flipped) | side, PI/2 / -PI/2 | 4.6-6.6 | the egg squeezed between "thumb and finger" (both index) |
| b06_thrust | paper | kit finger | side, PI/2 | 6.6 | |
| b07_arms | paper | kit finger (x2) | top, 0 / PI | 7.9 | squeezing the board's sides from above, nails up |
| b07_tolerance | night | kit finger in b07_seamInset | side | 1.6 | gliding over a seam; a 26 px pill |
| b07_newton | paper | b07_newtTile: a grey circle | (ball) | - | "a fingertip sliding over a mouse is that ball" |
| b08_uv | paper | kit finger (x2) | top | 4.4 | two fingertips on the buttons |
| b08_grip | night | kit finger, then b08_print | top / print | 4.9-29 | the finger vanishes into its print at the push-in |
| b08_gripmap | night | b08_print | print | - | a contact ellipse on the side view |
| b08_tape | paper | b08_tip | section | 150 | "Fingertip, in section": a blob with an S-kinked front |
Not in the film: fingerAt (10-g-shape.js), rec_fingerMM (11-slides-rec.js), gripMM's skin (03-parts.js), srf_tip.

## Diagnosis: why they look bad (frames in now/, crops in crops/)
1. Silhouette. Side: a capsule (a parallel tube with a round end), no joint, no crease, no pad belly; pressed, its whole
   underside goes flat for 7 mm: a slug. Top: a straight 16 mm tube with a half-round end: a popsicle stick; a real
   fingertip narrows from the joint (16) to the nail (14.3, AIST) and its tip is blunter than a half circle.
2. The nail. Side: a 1 mm sliver 16 mm long on the top edge (reads as a highlight). Top: a slab to the very tip. End: a
   crescent on an egg. Real index nail: 11.2 wide x 12.7 long, 78 % of the tip's width, its free edge ~2 mm short of the tip.
3. The far end fades over 16 mm; builders pass len 13 to 16, so the whole finger is fading: a ghost pill (night) or a
   smudge (paper).
4. Ground. Night skin #5F5E59 on near-black, no lit side: "a black capsule" (critic R-b05-2); b05's fix (a glow) makes a
   halo. Paper: flat #C4C3BD, no light/shadow side: a sticker.
5. The press: flattened along the finger's own axis, so a finger tilted onto a level part (b05 24°, b01 146°, b06 90°)
   flattens at an angle to the surface (hovers or sinks); pointing down it touches with its round end, like a pestle.
   The rigid part never moves toward the surface (a pad that swells, not one that compresses). Blanching is uniform.
6. Small sizes: no small version: at 4-5 px/mm the nail is 1-2 px (a pill), at 1.6 a grey bullet, at 0.55 a dot.
7. One style? No: b02's end pad (C.comp, its own crescent), b08_tip (a blob, front R 1.6 mm with an S-kink), b08_print
   (concentric ellipses), b07_newton (a circle), b03's thumb (the index scaled 7.5x: no thumb proportions), b05's glow.
8. Views: no thumb; end-on is a section-like oval (R-b02-10 "a grey blob"; b07 dropped it: "ear muffs").

## The new model (src/19-fg-model.js, src/19-fg-draw.js)
- One anatomical model drives every view: the side silhouette through landmarks (Catmull-Rom), the width from above,
  superellipse sections between; the nail a plate on the back (outline, free edge band, lunula on the thumb, folds).
- Index: DIP 16.0 across, mid-nail 14.3, depth at DIP 13.15, nail 11.2 x 12.7, free edge 1.9 mm from the tip. Thumb:
  IP 20.7, mid-nail 17.9, depth 17.5, nail 15.1 wide, nail base to tip 16.2 (AIST means x 1.03). Sources in the file.
- Pose: the DIP flexed 11.5° (thumb 8°), so only the fingertip's pad reaches the surface; with no `surf`, it rests along
  ang (middle phalanx 4.6° up); with `surf`, the fingertip meets the surface at ang - surf.
- Press: the rigid part moves 1.5 mm toward the surface (Jindrich 2003: 1.7-2.0 mm at a 2-4 N tap's peak); what passes
  the surface is laid on it (a ~10 mm contact, Serhat 2022's ~10 mm at 1 N), the skin beside bulges; the nail bed blanches
  from the free edge back.
- End view: projected from the sections, pitched (0.5 rad) and yawed (0.22) so the nail shows foreshortened.
- Drawn whole into a layer, then set down: the far end fades cleanly, alpha never shows pieces through each other.
- Styles: A line (outline + flat light/shadow tones, like the deck's parts), B shaded (soft gradient, faint outline,
  nail gloss), C graphic (flat silhouette, nail knocked out, no outline). Paper and night palettes, mono grey.

## Refinements while waiting (12:01 to now)
- End view: `ang` is its roll now (the pad turns to the wall; the finger still rises up behind); the contact is always the
  fingertip's pad; the projection is cached per pose and the press applied per frame (37 ms -> 1.8 ms a call).
- Side view with `surf`: the side the finger points into is the pad's side (an egg pressed from below, a poke at a wall
  find their surface with no flip); between 60° and 120° (a poke) the pad faces down the stage.
- New: `floor` + `floorKey` (the pad drapes over a step), `mark` (a stretch of the pad coloured), `ghost`, a return value
  { contact, tip } in the caller's units; line widths and detail follow the true stage scale (a call inside part() in mm
  works with s: 1).
- Sheets refreshed in place (12:2x): fg_context.png / fg_options.png now show b02_flush's ring finger rising up.
- Drafts: notes/FINGER-drafts.md (per builder: exact calls); kit/finger-body.js (the kit code, from src/, renamed fng*).

## Log
- 11:25 inventory, crops, diagnosis.
- 11:40 first model (h(u) splines): tip a flat wall, pinched crease, nail tooth-like. Rebuilt on a Catmull-Rom silhouette.
- 11:48 flexion sign fixed (it hyperextended the joint), default rest pitch, rounder sections, end view yawed.
- 12:17 BROCK PICKED "A Line" (via the coordinator, ~12:10). Phase 2: A into the kit's finger(), errs on every finger
  slide (batches), contact sheet of changed slides (settle + mid, downscaled) in sheets/, 2-3 line notes in review/<code>.md.
- 12:25 PHASE 2 INSTALLED: kit/06-motion.new.js (A Line only: kit/fng-model.js + kit/fng-draw.js + header) copied to
  deck/src/06-motion.js and deck/.snapshot/src/06-motion.js (both were identical, 10:55/11:03; old copies in backup/).
  deck/src/19-kit-test.js: kit_finger_p / kit_finger_n appended (backup in backup/).
- Checks: test film (base/ = copy of src + new kit) and the 12:26 live build: errs ok on all 25 fingertip slides (22 call
  the kit: + b03_debounce, b12_latopt, new since 11:11); every-slide sweep at 0.5 s: 0 console errors; kit page ok.
- Sheets: sheets/fg_after.png (22 slides, finger frame + settle), sheets/fg_after_zoom.png (before/after 1:1).
- Review notes appended (12:30): review/b01 (P3), b02, b03, b08 (P2), b05, b06, b07 (P4), b12 (no change).
- KIT.md: finger API text replaced, fingerPad added, Changes entry 12:25.
- 12:33 sent the sheet paths to main. DONE except the final report.
