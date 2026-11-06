# P6 PROGRESS: polish b05, b06, b07 (takes over from P4 at 12:40)

Owned files: deck/src/30-b05-shell.js, 30-b06-lattice.js, 30-b07-board-shape.js. Work folder /home/claude/work/p6/.
Backups of the three files as P4 left them (12:48): /home/claude/work/p6/backup/.
Build: cd /home/claude/theseus/deck && python3 tools/build.py main --own=30-b05-shell.js,30-b06-lattice.js,30-b07-board-shape.js --out=p6
(dist/main-p6.html). errs in batches <= 40 page loads. PAR=1. Q='&2d=1'.

## Read (in order)
- [x] common.md, KIT.md (FG 12:25 finger), POLISH.md, review b05/b06/b07 (FINGER, R3, L1, P4 replies), b12.md, FILM F34/F42
- [x] P4 PROGRESS, L1 PROGRESS

## Jobs
- [x] 1. FG finger notes (b05 x4 surf:0, no glow; b06 slant presses + egg pinch, b06_hotspot? to scale; b07_arms thumb + ring
      finger along the sides). Brock 12:40: fingers TO SCALE on lattice slides (b06's 0.62x goes); end-on turned 13° default.
- [x] 2. b05_cubed: re-derive the swing for Theseus's ribbed section at the same weight (A), else generic wall (B). Keep ruler demo.
- [ ] 3. b06 node drawings (fibres, fillet, filletsize, mold) re-solved / redrawn on the kagome two-rib crossing.
- [x] 4. F34: ruler demo on b05_cubed vs b05_fallacy: decide on merits; tell L1 (a091dd3d5428c5b0b) if moved.
- [x] 5. b07_emg payoff: main 12:5x: keep the rule (Brock: "no idea what you're asking"; default stands). No change.
- [ ] 6. b07_balance: re-check when H3 posts new board CoM (main tells)
- [x] 7. Open CRITIC (R3) items without a reply: fix or WHY NOT.
- [x] 8. (main 12:5x) FILM F38: one ground per shared-subject run: b05_nopick → hotspot → margin → work (N P N P now) and
      b06_fillet → filletsize (P N). Change only `theme`; re-check each at its new ground (qa + frame); seams either side.
- [x] 9. (main 12:5x) L1's CONVERGED numbers (h 0.55) supersede: Theseus vs plain at 9.35 g: worst 112 vs 147 µm (−23 %),
      crown 64 vs 83, off 104 vs 132, squeeze 114 vs 142; patterns within 6 % (squares 108.6, tri 111.6, kagome 112.2,
      hex 114.6); hottest rib kagome 12.9 %, tri 13.7 %, hex 26.4 %. Spacing 12.6 mm (not 10.7). b06_lattice's foot line
      must become "about as stiff, hottest rib about half as stressed" (agree wording with L1). Also b06_arches 10.7 → 12.6.

## Job 2 working (b05_cubed)
- Flat ribbed-plate check (/home/claude/work/p6/fe/tbeam.py, smeared kagome, 3 families, draft): all moulded dims ±0.076
  (worst case, against Theseus): −33.1 to +41.5 % (span 74.6 %) ≈ bare 0.60 wall (76.4 %), worse than 0.70 wall (65.4 %).
  Skin only: −10.3 to +11.8 (22 %). Rib width alone ±17 % (34 % span): the 0.36 mm rib is the tolerance-sensitive part.
- 3D check on L1's model (read-only import): /home/claude/work/p6/fe/tol.json (9 designs, h 0.55), run_tol.py (waits for L1's
  solvers, nice 10), out/ → results. Asked L1 12:5x (message 1: wording, runs, spacing, F34 pending).

## Models and conventions checked

## Log
- 12:48 started; backups taken.

## 3D tolerance result (13:25, L1's model, h 0.55, slope crease; out/*.json; nominal reproduces L1's 112.19 / 147.04 µm)
| case (±0.076 mm) | worst-press stiffness swing | span |
|---|---|---|
| Theseus, every moulded dim (skin, rib w, rib h) | −20.6 to +23.9 % | 44.4 % |
| Theseus, skin only | −10.5 to +11.6 % | 22.1 % |
| plain wall, same 9.35 g (0.744 mm) | −14.2 to +16.1 % | 30.4 % |
| plain 0.70 mm | (pending) | |
Flat cube law for comparison: 0.70 → 65.4 %, 1.00 → 45.7 %, 0.60 → 76.4 %. => Job 2 A FAILS (Theseus's ribbed section swings
more than a same-weight plain wall); B: generic 1.00 mm row (neutral), verdict → two plain stats, one line: Theseus's skin is
ribbed, tolerance proven at first shots. Told main 13:2x (also asked: hold job 3 until Brock's pattern pick?).
- 13:2x main: L1 finished: I own 30-b12-latopt.js too. Job 10 (b12): (a) b12_ribs tooling line (cut 1.5, deepen to 1.8 after
  trials); (b) "final crease" → "sloped crease" until S2's 1.75° line, then re-solve winner + plain (fine mesh) at it;
  (c) pattern NOT settled (L2 making kagome vs triangles picture): change nothing about the pattern; (d) rib 0.36 and the
  skin-proving note stay; R3-b12-5 check the frame reads answered.
- Fingers (job 1) done so far: b05 x4 (surf 0, to scale, glow gone; material/cubed from the upper right), b06 bridges at
  8 px/mm (YS 520) and arches at 10 px/mm, finger from the upper right at 31.5°, len 24, force arrows left, b06_light's gauge
  mirrored right; egg pinched (finger + thumb, 57 mm egg scale), b07_arms thumb + ring finger along the sides.
  Bug found: b06_filletsize and b06_mold `answers` miss a comma between rows (the array indexes itself → [undefined]).
- 13:4x job 2 DONE (plan B on b05_cubed: generic 1.00 mm row neutral, two plain stats 65 % → 46 %, 1.4×, ribbed line, foot
  "Walls: flat"; src + b12Study); note posted at the top of review/b05.md (with the 3D table; plain 0.70: −14.4/+16.4, 30.7 %).
- 13:4x job 9 DONE: b06_lattice foot line → closed-skin result (all patterns within 6 % in flex, the hexagons' hottest rib about
  twice as hard, 26.4 vs 13.7 %; results-final.json); b06_arches source "drawn 10.8 mm apart (the study's: about 12.6)"
  (the drawing is shared SHB_LAT, true triangles a 12.5: left until the pattern pick). Fixed the two broken answers lists.
- 13:4x job 10 (b12): (a) tooling line under the depth chart + answers row; (b) "final" → "sloped crease line"; (c)/(d) untouched.
- 13:4x job 8: grounds chosen from frames on both (themetest/): run b05_nopick..work → NIGHT (heat parts read best; flips at
  fallacy→nopick and work→lattice are idea changes); run b06_fillet, filletsize → PAPER and b12_latopt → NIGHT (b12_latopt +
  b12_ribs are a shared-subject pair; flips now fibres→fillet, filletsize→latopt, ribs→mold, all idea changes).
  Not done (proposed): b06_lattice→b06_light and b06_arch→b06_thrust are shared-subject seams that still flip.
- Job 3 ON HOLD (main 13:3x) until Brock's pattern pick; then re-solve the node at the shell's proportions.

- 13:5x finals: captions that wrapped onto panel labels shortened (b06_lattice 3.0/8.6, b06_light 3.0, b06_thrust 5.0, b06_fillet
  4.6, b06_filletsize 5.2); b06_arches source one line; b05_cubed row labels one style ("(and lighter)"); b12 root-fillet chart -10 px.
  errs ok on all 32 (b05 x10, b06 x9, b12 x2, b07 x11), qa clean settle + mid on all 32 (re-run on the changed ones after the last
  edits); answers checked in the page (anscheck.js). Frames: shots/final (0/mid/settle of 17 changed slides), final2 + phone_sheet.png.
- Replies posted: review/b05.md (top, the tolerance table), b06.md (top), b07.md (top), b12.md (top), FILM.md (13:5x F34/F38);
  POLISH.md P6 section.
- WAITING (main relays): job 3 (Brock's pattern pick), job 6 (H3/S2 board CoM + battery), job 10b (S2's 1.75° crease → re-solve).
- Owned since 13:3x: deck/src/30-b12-latopt.js too (backup in backup/). Build for checks now:
  python3 tools/build.py main --own=30-b05-shell.js,30-b06-lattice.js,30-b07-board-shape.js,30-b12-latopt.js,03-parts.js,05-data.js,06-motion.js,20-app.js --out=p6live
  (my four files + every shared file that differs from .snapshot, so the check matches the live src). errs: tools/errs_all.sh
  (5 slides = 35 page loads per batch, one batch at a time).
- 13:4x-13:5x job 10b WORK (S2 13:45 posted the line directly: y = 4.6408 - 0.030553 z, scene frame, /home/claude/work/s2/crease_line_175.json).
  NOT APPLIED to any slide: main 14:0x HELD the 1.75° re-solve. Results, for whoever resumes (see OPEN below).

## STATE AT HANDBACK (14:2x, main: publish at a clean stopping point; job 3 and the 1.75° re-solve held)
All four owned files unchanged since 13:34 (the last errs/qa-clean state); node --check ok. errs ok on all 32 slides
(14:00-14:03, 7 batches of <= 35 page loads) against the live shared files (06-motion.js and 03-parts.js changed 13:51):
shots/errs_live_1403.log. Frames with the live finger kit (b05_cubed, b06_light, b06_arch, b07_arms): shots/live1405/.

## OPEN (first open item first; each with its exact next step)
1. Job 10b, b12 at Brock's 1.75° crease (HELD by main 14:0x). Done, in /home/claude/work/p6/fe/:
   - run_crease.py: L1's model imported read-only, the crease replaced in memory (l1geo.y_crease and l1fe.y_crease; L1's code
     writes nothing: only nose_area.json, which exists). Waits for any other solver and for 4.6 GB free (an h 0.55 solve peaks
     over 3 GB: OOM-killed once, 13:50). Run with L1_CREASE=level (the design dicts carry crease 'slope175'). lam175.py: the
     budget bookkeeping only (no solve), for L1's stage-F rule. Results: crease175/*.json.
   - Plain wall: identical to L1's (147.0 worst / 82.8 crown / 132.1 off / 6.22 palm / 141.5 squeeze µm; skin 0.742). Its model
     has no crease in it (kind 'none': no crease line in the mesh, t_rim = t), so neither plain wall ever needs a re-solve.
   - Winner, same cells (lam 0.2382, 12.59 mm): the lattice covers 4.4 % more shell (A_lat 7851 → 8200 mm², ribs 1.367 → 1.427 g),
     so the skin falls 0.5979 → 0.5914. Worst 112.6 (was 112.2), crown 64.4 (64.3), off 104.3 (103.8), palm 5.35 (5.45), squeeze
     112.5 (113.5) µm; strength used skin 0.147, ribs 0.129, rails 0.120 (was 0.146/0.129/0.119). The 0.36 × 1.80 rib is then
     61 % of the skin and 3.05 skins deep (just past both rules), and b12_ribs' skin readout would turn red (f[1] < 0.594).
   - Winner by L1's own rule (stage F: ribs at the limits, the skin on the 0.60 floor, the density from the 9.35 g budget; scan
     lam 0.222 → t 0.6004, 0.230 → 0.5998, 0.2382 → 0.5914, rib length steps as lines enter/leave): lam 0.230 = 13.04 mm cells,
     skin 0.5998. Worst 111.5, crown 63.9, off 103.3, palm 5.33, squeeze 112.3 µm; strength skin 0.243 (!), ribs 0.134, rails 0.119.
   - Third way: 12.6 mm cells and a 0.60 skin weigh 9.43 g (+0.08; +0.06 for L1's 0.598 skin): over the 9.35 g budget (F44.2).
   - CAVEAT: the model's surface is still the old scan's (L1's geo/chart.npz from shell-theseus-1seam.glb); its fold is up to 1.6 mm
     above the new line near the tail (S2: lowered ≤ 1.61 at z −58), so the crease rib sits off the fold there. Both new-crease
     solves put the skin's hottest spot in the crease zone near the tail (0.145 at z −34.9 for the same cells; 0.243 at
     (−26.4, 6.0, −44.6) for 13.0 mm cells, one spot, p99 0.042), where the 2.77° chord had 0.05-0.06. Crease-zone strength is
     unproven until S2's reshaped shell is meshed. Stiffness is robust: 112.2 → 112.6 or 111.5; the plain wall doesn't move.
   - NEXT STEP when main lifts the hold: (a) get the decision: 13.0 mm cells (L1's rule; touches b06's "12.6", MS_LAT.pitch 12.6
     in 06-motion.js, L2's picture) vs a 0.59 skin vs 9.43 g; (b) best: re-solve on S2's reshaped 3D shell, not the old surface.
     S2 14:0x: the line stands; the shell is NOT in the repo (shared writes frozen for the publish); candidate geometry at
     /home/claude/work/s2/build/shell-s2-full.glb ("don't wait on a repo update"). Rebuild L1's chart from it into
     /home/claude/work/p6/fe/ (L1's geo tools copied, output to my folder only) and re-solve there;
     (c) then regenerate the B12 data block (L1's tools/b12_export.py + b12_tojs.py, copied to my folder with OUT pointed at
     /home/claude/work/p6/fe/out; never L1's out/) for win (t, worst, crown, off, palm, sq, use, ub, where, trip, H), the depth
     family (5 solves) and the other four patterns (4 solves) at the same crease, one solve at a time; (d) re-check every string
     that quotes them: b12_latopt fixTag (spacing, skin), the 147 → 112 verdict and the "% less flex" (b12_dn), b12_ribs' skin
     readout and red threshold, the source line ("on the sloped crease line" → name the 1.75° line), b06_lattice's foot line,
     b06_arches' source ("about 12.6 mm"), b06 answers rows, b05_cubed's 3D note; errs + qa on b12, b06, b05.
2. Job 3, b06 node drawings (HELD until main relays Brock's pattern pick, kagome vs true triangles; L2 is making the picture).
   NEXT STEP: re-solve the node in plane stress at the shell's proportions (0.36 mm ribs on the 0.60 skin, cells 20-40 rib widths
   long), SCF against r at the same weight plus the node's inscribed size (sink); if the curve loses its bottom and the limit
   becomes the node's size, say exactly that (chains into b12_ribs' "set by the mould"). Every Theseus fillet number on b06 from
   that solve or L1 (root 0.24, node 0.22). The open-lattice strip (09-fillet-data.js) may stay as the teaching example, labelled,
   no Theseus number from it. Redraw b06_fibres, fillet, filletsize, mold; b06_arches draws SHB_LAT (true triangles, a 12.5,
   shared 10-d2-arches.js: ask main) with a six-arm node icon.
3. Job 6, b07_balance (WAITING for main to relay H3/H4/S2's new board centre of mass and battery place; 03-parts.js changed 13:51).
   NEXT STEP: read the CoM the slide uses against the relayed one; update the drawing, numbers and verdict; errs + qa.
4. Proposed, not done (main to decide): F38 seams b06_lattice → b06_light and b06_arch → b06_thrust still flip grounds on a shared
   subject.
