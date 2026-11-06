# S2 progress (Theseus's shape, round two: build Brock's picks from S1's sheets)

Started 2026-11-06 ~11:10. Brief: /home/claude/theseus/handoff/revamp2/s2-brief.md (+ s1-brief.md, common.md).
S1's folder: /home/claude/work/s1/. Mine: /home/claude/work/s2/ (scripts/, shots/).
Resume rule: read this file top to bottom, then continue at the first unchecked item.

## Integrator messages (act on all)
- ~12:00: approved the before/after (sent to Brock as being applied); "go ahead with the plan as you listed it"; the lattice
  clip follows the new crease (F43.6: no lattice below it); keep sending what moves on screen.
- ~12:20 F51 (Brock 11:52 on my sheet): "trigger cutouts are still very wonky from the side especially near the front, the
  bottom rim should be an angled straight line as this will be better for manufacturing (i think)". Integrator: (1) front of
  the cutout smooth to the nose (no flat run/knee; fair the lip in or end the arch on the nose), comb check; (2) the crease one
  straight line (closest to the scan, from ~8.6 at the tail tip to where it meets the front), in the 3D crease, the 2D skirt,
  the lattice clip; outline unchanged. New before/after BEFORE regenerating.
  -> SENT ~12:50: /home/claude/work/s2/s2_f51_front_rim.png. Front: recommended B (scripts/front.py design_B: the arch's
  cubic continuation from J to the tip (59.65, 10.0), concave all the way; the lip from the front dips 2.1 mm: bends #46);
  alt A = design_S(-0.15) (lip within 1.1 mm of flat, scoop). Rim: chord (-59.58, 8.56) -> (55.4, 3.0); up to +2.3 vs scan;
  top view trimmed <= 0.6 mm at z -55..-35 (crease = widest point there). Asked Brock (a) B or A, (b) trim or fill.
  Proceeding with B + chord + trim unless told otherwise.
- ~12:55 FOUND: B NOT BUILDABLE (the lip at the nose is a 2.25 mm plate 10.35..12.6; B lifts the seam at its corners to 11.9 ->
  0-0.7 mm of trigger). Also a bug in design_F (bump integral double-counted s_a; its 'r 19.7' was false). Honest physics: flat
  lip => the seam turns ~25 deg in its last 10-15 mm; no-belly run-out is r 4-5 mm; gentler needs a small dip under the offset.
  -> option C (scripts/front_opt.py solve_capped(34, rise 0.30, y'' >= -0.020) -> front_C.json; front.design_C): r_min 16.7 mm,
  dip <= 0.69 mm under the offset, lip corners +0.30 (lip >= 1.6 mm), G2 into the lip, comb up once/down once.
  Correction sent to main (~13:00) + the sheet redrawn (front row: 11:50 | C | B 'not buildable'). Integrator (12:5x): the
  12:16 sheet (with B) went to Brock; told to keep going with "B + chord + trim" -> now C + chord + trim.
- L1 (direct, ~12:58): KAGOME woven lattice: 3 families at 60 deg, 10.7 mm apart, one across the shell (constant z); 2 ribs per
  node; triangles + hexagons 6.2 mm side; rear cutout midway between two cross-ribs; diagonals mirror-symmetric; above the
  crease only + a crease rib; ribs 0.36 (root) x 1.80, 0.5 deg draft, skin 0.60, fillets root 0.24 / node 0.22; rails 1.1x1.5
  (trigger openings), 1.15x2.0 (cutout); 9.35 g. Told L1 the crease is now the chord (not level 9.3) -> its region/weight move.

## Status
- [x] 0. Read: s2/s1 briefs, FEEDBACK F43-F50, common.md, S1 PROGRESS + scripts, 3d/shell README/tools, KIT.md (mouseSimple)
- [x] 1. Rim study (F47.2) + side-view seam (F49.2): /home/claude/work/s2/s2_rim_cutout_before_after.png (sent to main ~11:50)
- [ ] 2. 3D shell: seam (arch v5 rear + front B; nose needs its own chart: the polar (u,z) map breaks at the lip), rim crease
      to the chord (per-section chamfer carried up), O1 opening, creases 0.3 mm, skate ledges, 4 posts; meta
      Tooling done: scripts/skin.py (polar skin YC 5, fill_opening: the wheel hole had inflated u -> fold), s2_seam.py
      (rear_seam variant: Z_HI 52, held centre strip |u|<10 z>15, y_fix under both seams ahead of z 23.6, u from the arch's
      height). det_min was -9.2 (opening u inflation) -> 0.005 -> -0.27 (front blend); front now replaced by B anyway.
- [ ] 3. 2D twins (flock), key_parts.py --write (flock), mouseSimple/MS_ consts (creases, lattice hook, true greys)
- [ ] 4. Balance with real posts (H2 tools), battery clearance; tell H2/integrator
- [ ] 5. Review notes: review/b02.md (SHAPE, P2), others; KEY_PARTS changes to integrator
- [ ] 6. errs + shots; "what moved" paragraph -> main
- [ ] 7. Final report (SubagentHandback)

## Findings

- Session restarted ~11:11 (integrator: resume). Nothing was half-edited.
- S1 had built an unreported candidate (work/s1/build/shell-s1.glb, 11:03: steps K3 corners, O1, creases, posts, ledges via
  scripts/s1_build.py; NOT the rim or the seam arch). Repo 3d/shell untouched. Reuse its steps 2,3,5,6 after checking them.
- The raw scan mesh (refs/scan/sora-normalized.npz) is NOT on this machine; the raw scan's renders are
  (3d/shell/work/scan_sidePX.png: ortho, centre (0,19,0), 6.5 px/mm, px = 650 - Z*6.5, py = 260 - (Y-19)*6.5). Used as "the scan".
- Photo sora-v2-side registered on that render (scripts/photo_reg.py, IoU 0.9717, rot 0.06 deg): photo_reg.json, photo_mm20.png.
- RIM (F47.2): the 3D twin matches the raw scan everywhere incl. the tail (<0.4 mm). The fault is the 2D: the kit's MS_SKIRT
  draws the crease as a level line at 9.3 mm (and S1's sheet cut the lattice there). The scan's crease (S1 crease_side.json:
  8.56 at the tail tip z -59.6, 6.78 at -50, 5.53 at -40, 4.83 at -30, 4.58 at -20, ~4.1-4.4 to z 10, 3.8-3.9 to z 46, 3.0 at the
  nose) is confirmed by the registered photo's brightness step (scripts/crease_photo.py: within 0.1-0.3 mm from the tail to z -2).
  Fix = 2D only: the skirt line follows the crease; 'sides' region and the lattice clip follow it. 3D rim unchanged (it's the scan).
- SEAM (F49.2): the true 3D seam centreline (scripts/seam3d.py -> seam_ths_cloud.npy) runs 5.3-7.4 mm under the crown, then at
  z~12 kinks up to (5, 30) and climbs vertically; the kit's MS_SIDE_SEAM is the trigger PART's outline (incl. inner parts) => steps.
  New path (scripts/arch3.py + arch4.py -> seam_path_v4.json): normal offset of the crown T(z) (S1 profile_centre 'sil'),
  6.9 mm behind z 15 easing (quintic) to 5.5 at z 48, softplus run-out (0.55) into the flat lip y 10 (unchanged ahead of z 55.5);
  K3 on the arch's top-view tangent at J (28.31, 11.74), apex K (27.10, 4.84), legs d 2.85 (was 3.2: keeps rmin 1.80 because the
  arch arrives angled), e 7.0: span 4.05 x 6.90; cutout z 4.8418 to X 0.125. Within 1.0 mm of today's seam along the side
  (-1.0 at z 50, +0.16 at z 20). Polar skin for this: scripts/skin.py (rear_seam.Skin with YC 5, z -7..57), cached skin_ths.pkl.
  Rejected: constant offsets 5.0 (rear rises 2 mm -> top view sweeps inward 3 mm: the look Brock rejected in F43.2) and 6.9 const
  (nose run-out moves 4 mm back, a 'foot'); see shots/offsets_compare.png, arch_candidates.png.
- Frames: kit outlines (MS_SIDE etc.) = 3D twin x (KZ 119.3/119.41, KY 39.9/38.12) smoothed (f0a extract2.py). MS_DIMS.H 38.1
  vs drawn 39.9 -> fix only MS_DIMS.H (brief). New kit lines = 3D lines x (KZ, KY).

- 12:2x Brock (via main): rim "Widen the tail" (mis-tap) then 12:34 CORRECTION: "the bottom rim line needs to be at ~2 degrees,
  prioritizing matching as much in the front and middle as possible instead of the back". -> crease_line_2deg.json:
  y = 4.7063 - 0.034921 z (2.0 deg, minimax over z -20..55.4); meets the side outline at tail (-58.32, 6.74) and nose
  (55.52, 2.77); worst miss front -0.85 (z 46) / middle +0.85 (z -16) / back -1.34 (z -58); side view unchanged (crease on the
  outline beyond the two points); walls: up <= 0.94 mid, down <= 1.34 near the tail ('hold': the wall carried straight down);
  top view <= 0.03 mm. Sheet s2_rim_2deg_1240.png sent ~12:42. (scripts: crease_fit.py, rim_line.py, rimsec.py contour(),
  sheet_rim2.py). Front: Brock "it needs to properly connect completely" (neither B nor A) -> integrator asks for a close-up of
  C at the nose (side/front/top/3-4, >= 30 px/mm, no gaps/steps/stubs), NEW dated names (FA rule: never overwrite a sent sheet).
  Restored: s2_f51_front_rim_1216_as_sent.png (what he saw), s2_f51_front_rim_C_1221.png (C version).
- 3D seam: polar field (s2_seam.py: YC 5, Z_FRONT 50 with 2 mm ease, Z_HI 52, held centre strip, fill_opening + smooth_side
  on the skin, th_at_y_fit for the target) -> det_min 0.561, rear K3 + arch on target to z ~50 (seam_after1.png check).
  Polar map fails at the nose corner (z>51: the section turns horizontal) -> per-section nose move next (s2_nose.py).

## ~12:48 NEW NOSE JOB (integrator; latest wins) -- drop the C close-up
1. Reference study: Sora V2 scan's own seam at the nose (seam_sora_cloud.npy) + web photos (side, 3/4 front) of 4-6 flagships
   (Sora V2, Starlight-12/X, Viper V3/V4 Pro, GPX2, Pulsar X2, Zowie EC/FK): where the side cut turns into the front gap,
   one continuous cut under the lip?, radius, trigger front thickness.
2. Readings of "it needs to properly connect completely": (i) side cut + front gap one continuous cut, edge unbroken round
   the nose, no stub; (ii) seam meets the nose outline tangentially, no corner; (iii) seam reaches the very tip. Say which of
   11:50 / B / C fails which.
3. 2-3 candidates meeting all three as far as moulding allows (keep min trigger thickness ~1.4), shaded 3D at the nose: side,
   front, top, 3/4 front, >= 30 px/mm, beside the Sora scan's nose rendered the same way; plain labels + key numbers; NEW dated
   sheet name. Send to main.
RIM: 2 deg sheet went to Brock (2.0 vs 1.75); DON'T build the rim into 3D until main relays his answer.
Everything else (posts, ledges, creases, O1, K3, 2D twins) carries on. Hold lattice node pattern until L1's final.
Done so far: Sora scan nose renders shots/ref_sora_{side,front,34,nose}.png; Sora seam: flat lip y~10.0 z 55.5..tip, rises
10.18@55, 10.79@54, 11.47@53, 12.06@52, 13.11@50, 14.11@48 (knee r~3 just behind the lip corner, same structure as Theseus).
Web: dl_refs/gpx2_design.jpg (RTINGS GPX2 3/4 front: side cut wraps continuously under the lip, generous plan radius).
s2_nose.py per-section move -> faceting (shots/steps_nose.png); replace with polar relative-du targets.
- ~12:53 main: Brock (12:50) on the 2 deg sheet: "1.75°". BUILD the crease as one straight line at 1.75 deg, minimax over the
  front two-thirds (as for 2.0; my note said +-0.72 front/middle). Side outline unchanged (F47.1), no widening, lattice stops on
  the line. When in: post final numbers (heights at nose corner, middle, tail meet; worst miss front/middle/back; top-view
  change) to main AND L1 + one dated before/after frame. NOSE STUDY STAYS FIRST.
- ~13:16 main: (1) lattice NOT settled: Brock wants kagome vs true triangles side by side; L2 (a4745f5c9dbac7a75) makes it
  from L1's model + my shell. Keep kagome as working pattern but make the pattern ONE SWITCH in my lattice step (re-run, not
  rebuild). Answer L2 briefly if asked (render path / shell file). (2) When the 1.75 crease is in: post line equation + numbers
  to main, P6 (ae5f3fc6d680de7f4, owns b12, re-solves at that crease) and L2. Nose study first.
- 13:15 NOSE build tooling: scripts/vskin.py (vertical-axis chart R(phi,y) round (0, ZC 30), sigma up the skin),
  nose_seam.py (seam y(phi), lip_top), nose_design.py (side-view family; to_phi), nose_field.py (band move in the chart +
  geometric delta normals + 'proud lip' set-back pass, all depths). Base rebuilt: build/shell-s2-seam41.glb (polar field
  Z_FRONT 41 where v6 crosses today's seam; det_min 0.654) -> no bulge (the Z_FRONT 50 ease made a bump at z 48-50).
  Variants build/nose/{C_flush,C_proud,L_proud,S_flush,S_proud}.glb; copies in theseus/3d/shell/work/s2nose/ (gitignored)
  for real-material shots: node 3d/tools/shot.mjs shell/test.html out --q="glb=/shell/work/s2nose/X.glb&cam=..&target=..".
  Lip limit: today's lip (gap top to the 45-deg point of the nose round) is 1.37 mm at |x| 12-14 -> the front cutout can't
  rise for |x| <= 16 (flat run in side view >= 3.4 mm); 'proud lip' = body set back 0.8 under the lip (no chin/stub).
- 13:35 SENT nose study: /home/claude/work/s2/s2_nose_study_1333.png (real material grey, 30 px/mm; flagship photos (RTINGS:
  Sora V2, Viper V3 Pro, Pulsar X2 V2, GPX2), readings table (11:50 / B / C), rows: Sora scan | C flush | Cand 1 = C + proud lip
  0.8 | Cand 2 = Sora knee + proud lip 0.8). Numbers: nose_numbers.json. Dropped: long-low (L) and 1.5 tuck. Waiting for
  Brock's pick; the nose stays OUT of the final 3D until then (final base = shell-s2-seam41 + chosen nose).
  Scripts: nose_views.py (painter), nose_shots.sh (real), sheet_nose.py, nose_numbers.py.
- NEXT: 1.75 deg crease (rim_line.py with angle 1.75, minimax front two-thirds) -> 3D rim + numbers to main, P6, L2.
- 13:45 SENT 1.75 line to main, P6, L2: y = 4.6408 - 0.030553 z (crease_line_175.json); meets tail (-58.11, 6.42), nose
  (55.61, 2.94); z0 4.64; worst miss front -0.72 (z46) / middle +0.72 (z-16) / back -1.61 (tail meet); raised <= 0.75 (z -24),
  lowered <= 1.61 (tail); top view <= 0.01 (hold). Kit frame y_kit = 4.857 - 0.03201 z_kit (shows 1.83 deg in 2D; asked main).
  rim_line.py now defaults RIM_DEG 1.75 (env). TODO: 3D rim build (scripts/rim_build.py, arc-length remap per section so the
  crease row lands on the line; translation field, flange fixed), dated before/after frame, tell P6/L2 the shell path.
- ~13:58 main: STOP THE NOSE (Brock 13:40: too low-res to tell; deferred to a future model like the side profile). Keep today's
  nose (the scan's own = the 11:50 version) in the 3D: no candidate, no tuck, no sheets/questions. Exception: when regenerating
  the 2D twins, draw the front cut as the 3D has it if the separate slot was only a 2D artefact. 2D crease: physical line scaled
  with the drawing (1.83 deg in the stretched 2D); a slide stating the angle says 1.75. Carry on: 1.75 crease in 3D, posts,
  ledges, creases, O1, K3, 2D twins, BALANCE HAND-OFF TO H4 (a0111f97f92071087). LEAN: no sheets unless Brock's eye is needed.
- Base for the final: shell-s2-seam41 + nose field to the 11:50 line (arch + softplus, blended onto the base's OWN 3D seam over
  z 45..50 -> today's nose exactly ahead of 50) -> build/shell-s2-1150.glb; then rim_build (1.75; x-only hold on z-sections,
  full for z -55.5..52, eased to nothing over 2 mm beyond: the tail/nose rounds keep the scan's surface; cap 1.2) etc.

## ~14:05 WIND-DOWN (main 14:00: publishing; no writes to deck/src, deck/.snapshot, deck/geo2d, KEY_PARTS; 3d/shell as before
## or complete+checked; partial work stays in work/s2; report by 14:25)
REPO STATE NOW: everything of mine is OUT of the repo.
- 3d/shell/shell-theseus-1seam.glb/.json: restored from backup (identical to HEAD); bundle rebuilt (vendor/r3d.js + dist/assets
  carry the original shell again, 14:02).
- deck/geo2d/shell.json, skates.json: restored to HEAD (I had regenerated them at 13:46).
- deck/src/03-parts.js (KEY_PARTS skates + KEY.wheel) and 20-app.js (skirt line): restored, identical to HEAD.
- deck/src/06-motion.js: my edits removed one by one (exact strings). FG2 is editing this file at the same time (the nails):
  ITS changes are still there and are not mine. Backup of the pre-edit file: backup/06-motion.js.orig.
- Leftovers outside git: 3d/shell/work/s2nose/*.glb (gitignored scratch copies for shots); deck/dist/main-s2.html, kit-kit-s2.html.

BUILT AND CHECKED (in work/s2/build, not landed):
- shell-s2-seam41.glb: K3 + arch seam (polar field, Z_FRONT 41 where v6 crosses today's seam; det_min 0.654).
- shell-s2-1150.glb: + the nose field to the 11:50 line, blended onto the base's own seam over z 45..50 (today's nose ahead
  of 50; max move 0.19).
- shell-s2-rim.glb: + the rim crease on y = 4.6408 - 0.030553 z (rim_build.py; x-only per z-section 'hold'; full for z -55.5..52,
  eased to nothing over 2 mm beyond: the tail's/nose's big rounds keep the scan's surface; dx capped 1.2; top view <= 0.03 mm;
  side view unchanged by construction). Checked: side + rear-low renders (shots/rim_side_ba.png, rim_rear_ba.png).
- shell-s2-full.glb/.json/.report.json: + S1's steps 2,3,5,6 via scripts/s2_build_rest.py (copy of s1_build.py, crease
  depth 0.30): O1 (9.0 x 19.3, r 1.6), creases x +-4.5 0.3 mm deep, posts 2.13 g (MH1-4), ledges (dots 13 mm apart). Meta has
  rimCrease, seamPath, wheelOpen, creases, posts, ledges, skates. Checked: top/bottom renders (shots/full_tb.png); errs ok on
  20 slides with the twins + 2D built from it (check deck dist/main-s2.html, since reverted).
NOT CHECKED: the 2D simplified mouse's side view with the new seam/skirt/lattice (never seen on a slide); b02 (O1 read from
the twin); b08's MS_SKIRT use.

RESUME RULE (when main lifts the freeze), in this order, each step under `flock /home/claude/work/geo2d.lock`:
1. 3D (1.75 crease, posts, ledges, creases, O1, K3): copy build/shell-s2-full.glb/.json to 3d/shell/shell-theseus-1seam.*
   (originals in backup/), `cd 3d && node integration/build.mjs`. Rebuild from scratch if needed:
   s2_step1 with s2_seam.Z_FRONT=41 -> seam41; nose_field y_target (11:50 blend, see the 13:58 build command in this log)
   -> 1150; rim_build.py -> rim; s2_build_rest.py --steps 2,3,5,6 -> full; then add the meta fields (rimCrease, seamPath, note).
2. 2D twins: `cd deck && NODE_PATH=/opt/npm-tools/node_modules SCENES="shell skates" sh tools/geo2d/build.sh`;
   KEY_PARTS: `python3 tools/geo2d/key_parts.py --write` (only skates.pts change: the dots move to the ledge ends).
3. deck/src edits (re-apply by exact strings; my edit scripts are in this log's 13:5x commands, and ms_side_seam_new.txt):
   KEY.wheel -> [-4.5, -47.1, 9.0, 19.3]; 06-motion: MS_DIMS.H 39.9, MS_SIDE_SEAM (ms_side_seam_new.txt), MS_SKIRT_LINE +
   msSkirtY (kit y = 4.857 - 0.03201 z, z -58.06..55.56; shows 1.83 deg in the stretched 2D, slides say 1.75), sides
   region/latClip, front skirt at msSkirtY(52), top-view creases (soft lines x +-4.5, z 47.1..59.2), split broken at O1,
   true greys ('242,242,242', '#E8E8E8'), MS_LAT {pattern 'kagome'|'tri', pitch 12.6, rib 1.1, minScale 3} + msLattice +
   the lattice pass in mouseSimple; 20-app.js skirt on msSkirtY between the meet points and zW at O1. Leave MS_SKIRT = 9.3
   for b08 and write P5 a SHAPE note (review/b08.md: use msSkirtY(u)). Then LOOK at a full-size side view (kit page:
   tools/build.py kit --own=06-motion.js,19-kit-test.js...; kit_* slides) before landing.
4. Notes: review/b02.md SHAPE for P2 (O1 9.0 x 19.3 r 1.6, read from the twin without smoothing).
5. Balance: H4 (a0111f97f92071087) could NOT be resumed (transcript missing). Post data for whoever does it is in the 14:0x
   message text in the final report and build/shell-s2-full.report.json; run H2's tools (work/h2/tools clear.py, balance.py).
NOSE: deferred by Brock (13:40); keep today's nose; no more study.
