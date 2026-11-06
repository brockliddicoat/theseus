# FG2: the fingernails (Brock 13:18: "the fingers look better but the nails on them don't look quite right still") — PROGRESS

Brief: from main (13:19), continuing FG's work (/home/claude/work/fg/PROGRESS.md). Work folder /home/claude/work/fg2/.
Scope: the nail in every view of the kit's finger() (deck/src/06-motion.js, FG's 12:25 rebuild), and the tip's shape if it
still reads as a chisel. Edit ONLY finger() and its private helpers (fng*); S2 may edit mouseSimple in the same file:
re-read before every edit; apply the exact hunk to deck/src AND deck/.snapshot/src (never copy the file over).

## Status
- 13:20 started. Read FG's PROGRESS, notes, KIT.md (finger API + 12:25), 06-motion.js (finger section lines ~705-1137),
  fg_after_zoom.png, common.md (true greys, no peach), P6's PROGRESS (b05/b06/b07 finger calls done: surf 0, to scale, len 24,
  from the upper right at 31.5 deg).
- 13:25 research done (below). Next: test page (tools/build_test.py -> dist/fg2-test.html), options sheet.

## Research (anatomy; for the proportions)
- Ha et al. / "Fingernail Configuration", Arch Plast Surg 2015; 42(6): 753-760 (koreascience JAKO201505555993948), 150 men,
  150 women: index nail width 12.3 +- 1.0 (men) / 11.1 (women), length 13.0 / 12.1, W/L 0.94 / 0.91, TRANSVERSE RADIUS
  8.9 +- 1.2 mm (men) / 7.4 (women); thumb 15.2 x 14.7, radius 11.4. Width measured between the lowest points in the lateral
  nail grooves (so it includes what the folds hide); length from the groove at the proximal fold.
  => across an 11.2 mm nail, R 8.9 drops 2.0 mm at the edges (the nail spans ~80 deg of arc): strongly curved, so from above
  its sides are foreshortened and darker, and from the side ~1.5-2 mm of it shows above the lateral fold (tapering to 0 at
  the cuticle corner).
- AIST (Kouchi 2012) via FG: nail base to fingertip 14.2 (x1.03 = 14.6), nail breadth 10.9 (11.2), tip breadth at mid-nail
  13.9 (14.3). FG's DIP at 21.9 mm from the tip -> the cuticle is ~7 mm FORWARD of the joint's crease (NOT at the crease, as
  the brief's "from about the last joint's skin crease forward" says: that would make a 20 mm claw).
- Radiopaedia (nail unit): plate <= 0.65 mm thick on ultrasound (draw 0.5). Held laterally and proximally by overlapping
  skin ridges (the folds); lunula = the matrix's convex distal margin (usually hidden under the fold on the index).
- Photos studied (not embedded anywhere; refdl/a/, Wikimedia Commons): Fingernail_label.jpg (thumb, labelled),
  Human_fingers_both_sides_2.jpg (dorsal fingers), Human_nail_anatomy.jpg + Nail_hariadhi.png (diagrams: top + section).
  What they show: the plate only a little lighter than the skin; edges read by soft tone + the folds' crease shadow, no
  outline; a U-shaped cuticle (sagitta ~25-30 % of the nail's width); a thin pale free edge; skin showing either side.

## Log
- 13:30-13:51 dev copy of the kit's finger section as finger2 (src/19-fg2-model.js = notes/f2-renamed.js lines 1-57 +
  notes/f2-body.js; rebuild with: (sed -n '1,57p' notes/f2-renamed.js; cat notes/f2-body.js) > src/19-fg2-model.js).
  Test page: python3 tools/build_test.py -> dist/fg2-test.html (snapshot's shared files + src/19-fg2-*.js); frames:
  Q='&2d=1' node tools/shots.js dist/fg2-test.html <outdir> id:t ...
  New in finger2 (all treatments): nail geometry (U cuticle 2.75 mm deep, rounded free edge p 1.9, 10.3 mm wide = 72 % of
  the tip, smile band, thumb lunula); side view strip from the sections (<= 1.5 mm, tapering both ends) + fold line +
  crest sheen; contact corners rounded (f2gRound); shadow wraps the tip (f2gShadow: terminator + Bezier to the outline
  point square to the light + the outline's shadow arc); end view terminator traced on the 3D model (two branches from
  the tip, bridged through the tip's darkest rim point); top view terminator at 0.72 hw (clear of the nail).
  Treatments (o.nail): 'soft' (A, recommended), 'line' (B), 'tone' (C): F2G_NAILS.
- 13:51 SHEET: fg2_nail_options_1351_a.png (paper, large: above / side pressing at a slant / end-on) and
  fg2_nail_options_1351_b.png (night large + the film's sizes 1:1). tools/sheet_opts.py <HHMM> composes from opt/.
  (1350_a/b were drafts, deleted before reporting.) Sending to main; WAITING for Brock's pick.
- 13:52 BROCK PICKED "A Soft" (via main). kit/finger-section.soft.js + kit/06-motion.soft.js made by tools/make_kit.py soft (only FNG_NAIL = soft; no nail option, no debug). Next: test film (base/ = copy of deck/src + new kit), errs, then install the hunk in src + snapshot.
- 13:52-14:00 TEST FILM (deck/dist/main-fg2test.html: base/src = copy of deck/src 13:52 + kit/06-motion.soft.js) and kit page
  (deck/dist/kit-fg2test.html): 0.5 s sweep of all 107 slides (tools/scan.js -> scan-fg2test.json): 0 exceptions, 0 console
  errors; 22 slides call finger() (finger_ids.json). errs (Q='&2d=1', 7 times each, batches of 5): all 22 ok; kit_finger_p,
  kit_finger_n, kit_agents, kit_zoom, kit_demo ok.
- 14:00 INSTALLED: the finger section (notes/finger-section-orig.js -> kit/finger-section.soft.js) replaced by exact text in
  deck/src/06-motion.js (md5 1bca4130...) and deck/.snapshot/src/06-motion.js (md5 06f57973...); verified only the section
  changed in each (S2's 13:51 mouseSimple edit in src kept; the snapshot keeps its own 12:25 rest). Backups:
  backup/06-motion.{src,snapshot}.pre-install.140014.js (and the 13:30 copies). TO UNDO: copy those two backups back.
- 14:01 FINAL CHECK on the build from the installed deck/src (deck/dist/main-fg2final.html, 107 slides): 0.5 s sweep of
  every slide (scan-fg2final.json): 0 exceptions, 0 console errors; 22 finger slides.
- 14:01 SHEET: fg2_after_zoom_1401_1.png and _2.png (before = deck/dist/main-fg2before.html, the 13:52 src copy + the
  old kit; after = deck/dist/main-fg2test.html, the same copy + the new kit: they differ only in the finger section;
  frames: frames.json, fr_before/, fr_after/; tools/sheet_zoom.py <HHMM>).
- 14:02 KIT.md: finger API text (the nail, the round tip) + Changes entry 14:00. DONE; reported to main.

## State for a successor
- The kit's finger() is FG2's (A Soft) in deck/src and deck/.snapshot/src. Source of truth for further work:
  notes/f2-body.js (dev names f2g*/finger2, all three treatments) -> tools/make_kit.py <soft|line|tone> writes
  kit/finger-section.<pick>.js; install by exact replacement of the CURRENT section text (the installed one is
  kit/finger-section.soft.js; notes/finger-section-orig.js is FG's 12:25 section) in both files, never a file copy.
- Undo: copy backup/06-motion.src.pre-install.140014.js -> deck/src/06-motion.js and
  backup/06-motion.snapshot.pre-install.140014.js -> deck/.snapshot/src/06-motion.js (only if no one edited them since:
  otherwise replace the section text back with notes/finger-section-orig.js).
- Known small things (not done): the end view rolled to a wall (b02_flush's ring finger) has a slightly lumpy shadow edge
  under the tip at 19 px/mm (eased, still visible up close); top views' shadow band is narrower than FG's (0.72 of the
  half-width, was 0.32) so the nail stays lit; the end view's line tracing costs ~30-60 ms once per pose (cached).
