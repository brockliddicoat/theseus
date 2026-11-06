# P5 PROGRESS (polish: b01, b02, b03, b04, b08, b09, b10, b11 leftovers)

Brief: the integrator's P5 message (12:4x). Files I own: deck/src/30-b01-intro.js, 30-b02-clicks.js, 30-b03-switch.js,
30-b04-glide.js, 30-b08-surface.js, 30-b09-signal.js, 30-b10-power.js, 30-b11-own.js. Two narrow shared edits allowed:
05-data.js `delrin150` (job 5), 10-h-own.js own_trifold's Spares panel (job 2). Anything else: ask main.
Backups of the starting state: /home/claude/work/p5/backup/*.start (12:48). AUDIT.md before my replies: backup/AUDIT.md.pre-p5.
Build: cd /home/claude/theseus/deck && python3 tools/build.py main --out=p5 --own=30-b01-intro.js,30-b02-clicks.js,
  30-b03-switch.js,30-b04-glide.js,30-b08-surface.js,30-b09-signal.js,30-b10-power.js,30-b11-own.js,05-data.js,10-h-own.js
  (one line, no spaces) -> deck/dist/main-p5.html
Checks: export NODE_PATH=/opt/npm-tools/node_modules. errs: a "load" is one slide at one time, so keep slides x TIMES <= 40
  (TIMES=0.02,1.5,4,11 and 10 slides per call; 25+ slides at the default 7 times crashed the page twice). qa T=settle / T=mid
  (one load per slide, <= 40 slides per call). shoot PAR=1 -> /home/claude/work/p5/shots; judge at 960x540 and phone 0.44x.
Helpers: /home/claude/work/p5/scripts (evalq.js: eval in the page, e.g. text widths; srclines.js: foot-line count).

## STATE AT HAND-OFF (14:1x, main's stop at 14:25)
All my files parse. Build main-p5 at 14:0x: errs clean on all 75 slides of my 8 files plus `box` (own_trifold), in batches;
qa settle + mid clean on all 75. Nothing committed or published (main does that).
Main must copy the two shared edits into the snapshot: deck/src/05-data.js (delrin150) and deck/src/10-h-own.js
(own_trifold Spares). Old-slide answers fixes are in my files only (missing commas in b04_module and b08_tape answers).

## Checklist (status, then the exact next step for anything open)
- [x] 0 Read: common.md, KIT.md, POLISH.md, review b01-b04, b08-b11 (FINGER, R3, H3), p1/p2/p3 PROGRESS. (12:48)
- [x] 1 FG finger notes: CODED, frames shots/after1, tape2, tape3 (before: shots/before).
  - [x] b02 seam loupe + flush pad -> kit end view with floor; b02_fingerEndMM, b02_fingerFront deleted; len 30 on
        cutouts/direct/wedge
  - [x] b03_side digit 'thumb'; b03_debounce surf 0
  - [x] b08_grip ghost over print; b08_tip front from fingerPad (b08_tape)
  - [x] b01 surf = top line slope + the mouse's own scale (tradeIcon flex, bigFlex)
  - [ ] OPEN, optional: check each changed finger on the OTHER ground. Next step: shoot b02_seams, b02_flush, b03_side,
        b08_grip, b08_tape with the theme flipped (temporary `theme:` edit in a scratch copy, or the kit test page), judge at
        960x540, revert.
  - [x] Replied under FINGER in review/b01.md, b02.md, b03.md, b08.md (14:1x).
- [x] 2 Grip tape out of the box: CODED and verified (frame shots/a4/112_b11_box_11.png at 14:0x).
  - [x] b11_box: Theseus tape cell "Etched"; verdict 3 -> 5 "of 5" (who "Next best wireless"), label "...tape aside";
        answers, caption, source
  - [x] own_trifold (10-h-own.js): Spares panel skates only ("Skates" / "POM, PTFE"), true greys
  - [x] grep: no other on-screen string says Theseus ships tape (the old `box` slide's items list in 10-h-own.js is not in
        the film order).
  - [x] POLISH.md "R2-b11-5 / FILM F35" ticked with a P5 note; review/b11.md replied.
- [x] 3 b10 R3 coulds: CODED (b10_battery 33 h both places, 144 -> 171 Wh/kg; b10_charge B10.h8 = b09_life's 50 h,
      4.2 -> 8.3 h; b10_lights neutral IR glow). A1 confirmed (AUDIT S3, S13). Replied in review/b10.md.
- [x] 4 Board: B01_PCB_PATH.g = BOARD_G (no literal); "As built at 0.6 mm: 5.68 g" vs the 5.60 g target (b01 note, foot,
      answers); b10_board "Board target: 5.60 g" + "As built: " + BOARD_G; b11_board leaders (H3 12:35). Target unchanged.
      Replied in review/b01.md (H3 12:46), b10.md (H3 13:04), b11.md (H3 12:35).
- [x] 5 05-data.js delrin150 -> DuPont Module III Table 2, static 0.20 / dynamic 0.35 on steel. OPEN: main copies 05-data.js.
- [x] 6 b03_timing last caption: P2's fix is in the file ("Counted as the pole leaves NC, 1.4 ms before..."); qa clean.
      Replied in review/b03.md.
- [x] 7 PAW3950: B04SN foil (EPS Global, PixArt's distributor: 750 ips, 50 G, 30,000 cpi, 50-cpi steps), SRC b04_paw3950.
      Replied in review/b04.md (R3-b04-1).
- [x] 8 Brock answers: "Keep as is" (b04_module), "Eight, per chapter" (cover/close). Nothing changed. Logged in
      review/b04.md and review/b01.md.
- [ ] 9 b04 ledges: WAITING. KEY_PARTS.skates still holds the 8 corner points (S2 step 2/3 open at 13:4x). Next step when S2
      lands the ledges in KEY_PARTS: re-run /home/claude/work/b04/model sink.py (CORN), sag_final.py, skates_model.py at the
      new places, update B04SK / B04SP in 30-b04-glide.js, re-check b04_sag and b04_skates numbers, errs + qa, then POLISH.md
      line ~179 (b04 corner ledges) gets a P5 note.
- [x] 10 R3 replies written (14:1x): b04 R3-b04-1, b08 could, b10 three coulds, b11 grip tape; b01, b02, b03 R3 had nothing
      open. Not replied: b08.md H3 12:35 (b08_wheel, "no action" unless a caption gives the wheel assembly's grams; not checked).
      Next step if wanted: read b08_wheel's on-screen grams and say whether they are the wheel or the encoder assembly.
- [x] 11 FILM F38 one ground per run: b02_cutouts -> night, b02_tensioner -> paper, b04_focus -> paper (cards stay night).
      Frames shots/ground_cut.png, ground_ten.png, ground_foc.png, ground_seams.png; qa clean. Said in review/b02.md and b04.md replies
      (FILM.md not touched).
- [x] 12 A1 audit: ALL CODED and verified; replies written under each item in /home/claude/work/a1/AUDIT.md (14:10).
  - [x] O1 b02_direct "What you feel" noteBox (frame shots/a4/19_b02_direct_11.png)
  - [x] O2 b02_rails "Solid, not cheap" noteBox + "feels cheap" caption (shots/a4/22_b02_rails_11.png)
  - [x] O3 b03_switch Logitech line on screen (shots/a4/24_b03_switch_12.png)
  - [x] P b02_rails loupes on both posts with POM pads labelled; S b02_tensioner "Flat, no bridge, / modelled in the same
        resin" (shots/a4/20_b02_tensioner_11.png)
  - [x] R1-R6, C, confirmations (AUDIT S1-S16 replies)
  - [x] H #20 b10_cable: "Theseus's cable, about 2 mm" + "Thin enough not to tug a 29 g mouse; XBAB's 1.9 mm cable still
        passes USB high speed"; Theseus's pad slack now 2 mm (shots/a3/100_b10_cable_11.png, a3/close_46_73.png)
- [ ] Final: the only open items are the optional other-ground finger check (job 1) and job 9 (waiting on S2). Report sent
      to main 14:1x.

## Log
- 12:48 backups; baseline build p5 (8 files) ok.
- 13:0x job 1 CODED: b01 tradeIcon 'flex' + bigFlex: s (mouse's own), surf = the top line's slope at the press; b02 seam loupe +
  flush pad -> kit end view (floor, mark; default 13° yaw, NOT FG's yaw 0: Brock 12:40 via P6/main "end-on turned 13° default");
  flush drawn outside the mirror (floor/mark read X = fu - u) so the light stays the stage's; b02_fingerEndMM + b02_fingerFront
  deleted; FG's could: len 30 on b02_cutouts, b02_direct, b02_wedge; b03_side digit 'thumb'; b03_debounce surf 0; b08_grip:
  finger at the PRINT's place (pc, it slides with it; FG wrote home) drawn after the print, ghost 0.8*ep(1.3,1.7); b08_tape:
  b08_tip front = fingerPad(u) - 0.2 mm sink (contact ~7 mm), lifted front hangs from the contact's level (no drop at the
  edge while lifted), ridges along the curve; the path moved so the CONTACT crosses the edge (xc: bx+0.12bw -> ex+1.5 mm ->
  bx+0.2bw, x1 = xc + b08_tipReach()); fixTag label moved into the clear wedge under the front. Frames: shots/after1, tape2,
  tape3; before: shots/before. errs ok.
- 13:1x job 2 CODED: b11_box Theseus tape cell 'Etched' (heroText), verdict b11_boxBest() 3 -> b11_boxCount 5 'of 5', label
  'What a new owner needs in the box, tape aside', who 'Next best wireless' (the wired OP1's n/a pair not counted against it),
  answers + F52.2 row, caption 'spare skates', source 'with no grip tape: its grip is etched'; own_trifold Spares: skates
  only, 'Skates' (ink2, +52) over 'POM, PTFE' (mute, +88) on the Setup panel's text rows, true greys.
- 13:1x job 3 CODED: b10_battery whI ceil 144 -> whP floor 171 Wh/kg (dec 0, label 'Energy for the weight'), net and caption
  one figure dh = floor(hP - hI) = 33 h; b10_charge: B10.h8 = B09L.ths.h[3] (50 h, b09_life's) -> tenMin hA = frac x 45,
  hB = frac x 50 -> 4.2 -> 8.3 h; pmic axis follows (0.46 x 50); source/answers say so; b10_lights sensor glow C.ink 0.3,
  'Sensor, infrared' / 'Both have it, unseen', source + gld_paw3395o (850 nm).
- 13:1x job 4 CODED: B01_PCB_PATH.g = BOARD_G (no literal: main 13:0x, Brock accepted 5.68 as built); block note 'As built at
  0.6 mm: 5.68 g', foot line, data note, answers; b10_board 'Board target: 5.60 g' + 'As built: 5.68 g' (BOARD_G).
- 13:1x job 5 CODED: 05-data.js delrin150 -> DuPont Module III Table 2 static 0.20 / dynamic 0.35 on steel, PI sheet's label
  noted, u = DuPont guide (LBL copy). Old slides citing it (anchors, clk_pomtune, gld_sheet) are replaced; rec deck's
  glidefixes shows the McMaster table's POM 0.11-0.35, not this figure.
- 13:1x job 6: already done by P2 (last caption 'Counted as the pole leaves NC, 1.4 ms before the switch closes...').
- 13:2x job 7 CODED: PAW3950 = 750 ips, 50 G, 30,000 cpi, 50-cpi steps (EPS Global, PixArt's distributor; MechKeys 27 Apr 2024
  launch: 750 / 50 G / 30,000); GamesRadar 15 May 2025 prints 70 G unsourced (noted in SRC n). B04SN foil PAW3950; verdict
  750 -> 930 ips (+24 %); cardHead pill 'PixArt claim'; new SRC b04_paw3950; answers.
- 13:2x job 11 CODED: themes b02_cutouts night, b02_tensioner paper, b04_focus paper; frames shots/ground_*.png.
- 13:3x-13:5x job 12 CODED: O1 b02_direct (classroom panel -> noteBox 'What you feel', mower in ink, verdict 24 px clear);
  O2 b02_rails (caption 'a rattle that feels cheap', noteBox 'Solid, not cheap', b02_railLoupe x2 with 'POM pads');
  O3 b03_switch (Logitech line, rows respaced 782/816/852/920); S tensioner spec (sentence:false), key + locator crossfades;
  R1 b10_battery labels + THS.massG; R2 b03_side ('Classroom', door +100, wire tag ink callout); R5 b02_stiff (p2 3.6 s,
  hold 0.75, b02_hairFr captions, GPX 2 tie dropped); R6 blue -> ink (mower, cable rival lens); C b10_lights shares ink,
  b10_sealed clock x80; foot lines kept to 2 lines (srclines.js). Answers arrays checked well-formed in the page (two
  pre-existing missing commas fixed: b04_module, b08_tape).
- 13:4x #20 b10_cable: B10_CAB.dt = 2.0 (Theseus's cable; dc 3.0 the stock illustration); panel name 'Theseus's cable, about
  2 mm'; sub from 6.7 s 'Thin enough not to tug a 29 g mouse; XBAB's 1.9 mm cable still passes USB high speed' (29 from
  THESEUS.mass); band lowered on the right (P2/P3 y +40) to clear it; Theseus's pad slack 2 mm (was 3 mm under the arc).
  Left out "thick enough to charge at full speed": XBAB's page gives the eye test, not a current rating.
- 13:5x qa found b02_direct's classroom label under the note tile: demoPanel no longer drawn once the tile has landed
  (b02_direct Q.v+1.75, b02_rails Q.v+1.65; no visual change). errs + qa settle/mid clean on all 75 slides.
- 14:1x AUDIT.md replies under each item (sections 2, 3, 4, 6, 10, standing rules S1-S16, historical #20).
