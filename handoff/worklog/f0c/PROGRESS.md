# F0c progress (chapter flight transitions, longer holds, both vertical clip kinds)

Brief: /home/claude/theseus/handoff/revamp2/f0c-brief.md. Started 2026-11-06 ~08:40.
Files I own: deck/src/20-app.js, deck/src/00-head.html (bar CSS only), deck/tools/clip.js, deck/DESIGN.md (§7, §11);
may add to deck/src/06-motion.js (no signature changes; then copy to .snapshot and log in KIT.md "Changes").
Integrator rules (msg): keep this file current (done / in flight / exact next step); no WebSearch (requests go to
/home/claude/work/research/REQUESTS.md).

## Status (09:30)
- [x] Phase 0 read everything (brief, common, KIT, DESIGN §7/§11, 20-app.js, clip.js, F0b notes, kit, sort, build).
- [x] Phase 1 design (below).
- [x] Phase 2 holds: HOLD = { base 1/3, cps 150, small .3, min 2, max 6, guess 3 } in src/20-app.js (not yet verified live).
- [x] Footer chrome drawn settled in the film (CHROME_T): verified it flickered before (shots/dis0/footer_strip.png).
- [x] Phase 3 flight in src/20-app.js: FLY table, flEnd/flPlan/flCam/flKit/flLit/flMouse, loft (flLoft/flLoftDraw), flStage,
      flCompose, flBareA/flBegin, wired into trKind (any chapter change, both ways; `flight: false` opts out), go(), frame(),
      compose(), capFrame() (t NaN/null = auto clock), __seek(null, ...).
- [x] Kit additions in src/06-motion.js (NOT yet copied to .snapshot, NOT yet logged in KIT.md): CARD2 { cap, rec, hide };
      mouseSimple records itself while chapterCard2 draws its part and skips drawing when CARD2.hide; chapterCard2's part
      moved into chapterCardPart(t, o, box, ka, kt) inside a try/finally that records CARD2.rec[slide id]; bottom view parts
      'base' (face + edge) and 'screws' (KEY_PARTS.board.holes, opt: drawn only when lit or shown); solid loop skips opt.
- [x] Checks so far (capture mode): sheets for 9 chapter changes forward + 2 back (shots/fl*.png); ends pixel-exact
      (scripts/edges.js: k=0 vs old slide, k=.98/.999 vs new card: max diff <= 2) for kit card, b09-style custom part,
      and both reverses; errs2.js: 89 builder slides x 7 times, 0 errors with my kit + player (pages/t2.html).
- [x] Phase 3b live checks: scripts/live.js (step both ways, mid-flight steps, autoplay hold 4.18 s then flight),
      cost.js (flight frames 3-25 ms at 1x in software GL, like a plain frame), loft build 8 ms (pre-built at idle),
      F0b's paneltest.js on my build (phone + desk OK), private kit page 13 slides 0 errors.
- [x] 09:44 copied src/06-motion.js and src/20-app.js to .snapshot (backups: work/f0c/snap_*.before.js); KIT.md logged;
      integrator messaged (publishable; asked b11 for `flight: { view: 'left', box: [1020, 230, 800, 440], pad: 0.05 }`).
      From now on: any further edit to 20-app.js or 06-motion.js must be re-copied to .snapshot after its checks.
- [ ] Phase 4 hand-off anchors (only if robust).
- [ ] Phase 5 clips (both kinds), DESIGN §7/§11.
- [ ] Phase 6 checks: errs across chapters on the real build; qa.js; panels with mocked window.claude; phone layout;
      clip exports (card + dense) with frames pulled out of the MP4s.

## Facts found (for resuming)
- Film chapters: intro, click, glide, shell, surface, elec, shape, own, end. Cards: b02_card, b04_card, b05_card,
  b08_card, b09_card (custom part using mouseFit: captured exactly), b07_shcard, b11_card (custom part drawing the left
  outline by hand: no capture -> "soft" landing in the card box; better: b11 adds flight: { view: 'left',
  box: [1020, 230, 800, 440], pad: 0.05 }); end = b01_close (not a card).
- Snapshot has no 30-*.js: `build.py main --own=20-app.js` gives the OLD film. My test pages: scripts/mkpage.py
  (pages/t1.html = old film + my test cards test/cards.js; pages/t2.html = + all builder files).
- Tools (mine): scripts/trsheet.js (n moments of a transition tiled), trone.js, edges.js (in-page pixel diff), endpair.js,
  errs2.js (no reload), load.js (reading load per slide), loaderr.js, slides.js.
- Calibration data: data/load_old.tsv, data/load_new.tsv.

## Design (decided)
- Holds: reading-load measure kept, mapped L=250 -> 2 s, L=850 -> 6 s (new median ~3 s, cards ~3 s, dense sheets 6 s).
- Flight timeline (FLY.T, s): rec 0-.4, up .03-.34, words 0-.24, theme .34-.66 (ground changes after the slide has gone),
  move .22-1.28 (E.cam, fixed-point zoom), off .3-.56, k2l .5-.58, turn .58-1.18, l2k 1.18-1.26, land 1.28, on 1.22-1.44,
  emerge 1.2-1.6, chrome .5-.9; D = 1.6 s.
- Ends: card (capture or slide.flight) exact; soft card (card: true, no capture) lands in the card box, cross-fades;
  slide = station (FLY.st: view, hi, focus, s), recedes/emerges bare (grid and footer never move).
- Stations: intro top whole; click top triggers; glide bottom sensor+skates; shell left shell+hump; surface left sides;
  elec top board (+battery); shape left shell (profile); own bottom base+screws; end top shell.

## Notes for the integrator (report)
- MS_SIDE/MS_FRONT still peak at 39.9 mm while MS_DIMS.H = 38.1 (KIT.md 08:40 says 38.1).
- b11's file broke the assembled page at ~09:00 (escaped quote); fixed by 09:25.
- F0b's dissolve (E.io5 over .55 s) shows no change for ~.2 s after a press (responsiveness); left as is so far.

## Next step
Live checks (scripts to write: live.js), then copy kit + player to snapshot, log KIT.md, message integrator.

## 09:58 update
- [x] Real-film flights rendered (pages/t2.html, all builder files): b01_budget->b02_card (soft bare: GT01 part),
      b04_reports->b05_card (exact), b07_sheet->b08_card (soft bare: swatch), b07_balance->b11_card (soft with the
      settled-frame hint: exact placement). Added: flBegin's settled probe (hint), soft-bare cards light the station part
      on landing and last 1.85 s, intro station lights the battery. Live test on b07_balance/b11_card passed. Re-copied.
- [x] Phase 5 clips: tools/clip.js --both (16:9 + 9:16 in one run); exports of b09_card and b02_cutouts in both kinds
      (work/f0c/clips/*.mp4, frames pulled out: clips_sheet.png; ffprobe: yuv420p bt709 30 fps, 210/360 frames).
- [x] DESIGN.md §7 (slide props hold/trans/flight/irisAt) and §11 (flow: flight, settled footer; pacing 2-6 s; two
      kinds of clip; exporting --both; capture t=auto) rewritten. 20-app.js header comment updated; TRS.flight = .8.
- Findings for the integrator: chapterCard2's horizontal clip frame one is nearly bare (name rises from t=0);
  b02_card's GT01 fades in at 0.8-1.6 s (show from frame one, M6); common.md 08:45 note still says "pass through black".
- Next: Phase 6 full check pass on the real build (errs2 all slides, qa.js settle+mid on a sample, holds table),
  then decide Phase 4 (hand-off anchors), then final report.

## 10:08 update
- [x] Phase 6 so far: errs2 104 real slides x 7 times 0 errors; all 8 chapter changes fwd + back on the real film
      (shots/all_fwd.png, all_back.png) no errors; qa.js settle+mid clean on 7 cards + 4 dense; holds over the real film
      min 2.0 p10 2.4 median 3.04 p90 3.76 max 6.0 (cards 2.1-2.8; film ~23.6 min slide time) (data/load_t2.tsv);
      phone viewport flight live OK (shots/phone_flight.png).
- [ ] Phase 4 (IN FLIGHT): hand-off. Kit: CARD2.skip [{ view, m, hit }] -> mouseSimple at that exact placement records
      the hit (o, a0) and does not draw. Player: placements from s.handoff.in/out or s.flight ({ view, box, pad, focus });
      reject if the mouse's bbox leaves the box (clipped); kind 'handoff' (same chapter, both placements HIT in the
      bare renders, else fall back to dissolve/wipe); per-plan timeline pl.T (handoff D = 1.0 s); flight ends declared on
      slides become exact only when their skip hits.

## 10:12 FINAL STATE (work complete; report sent through SubagentHandback)
- [x] Phase 4 hand-off: kit CARD2.skip + msSameM (patched into src AND .snapshot 06-motion.js; KIT.md 10:08 entry);
      player: flPlace, HAND timeline (1.0 s), kind 'handoff' in trKind/go/capFrame/frame/compose, declared flight ends
      exact only when hit. Tests: test/handoff.js (pages/t3.html): f0h_a->f0h_b (top->side turn, paper->night) and
      f0h_d->f0h_e (same view) pixel-exact both ends (edges.js max 0); wrong declarations fall back (dissolve); live OK.
- [x] .snapshot/src/20-app.js = src/20-app.js (10:09). DESIGN.md §7 + §11 (hand-off added). Integrator messaged.
- [x] Final checks: real film 104 slides x 7 times 0 errors; 8 chapter changes fwd+back clean (all_fwd2.png);
      snapshot main build loads; private kit page (17 slides) 0 errors.

## Models and conventions checked (F39.2)
- F0b's holdOf: measure kept (24 px read / small x0.3, alpha >= .25, dedup, nothing under the rule); constants were
  1.2-4 s at 250 cps (median ~2.1 s on the new slides) -> recalibrated on measured loads to 2-6 s (median 3.0 s).
- slideChrome's per-slide draw-in (rule 0-0.9 s, labels 0.05-0.6 s): contradicted §11's "the footer holds still"
  (verified: footer dims and redraws mid-dissolve, shots/dis0/footer_strip.png) -> drawn settled in the film.
- F0b's dissolve (E.io5 over 0.55 s): 20-80 % in 0.09 s (fine), but ~0.2 s of no visible change after a press
  (responsiveness). Left as is; question for Brock.
- F0b's chapter move (pass through black): Brock declined it (F40.2); kept only as opt-in trans 'chapter'.
- E.cam bezier(0.7,0,0.2,1): x-derivative >= 0.37, Newton solve well-conditioned; reused for the camera.
- camLerp-style fixed-point zoom: reused for the flight's camera (reads as one push/pull).
- clip.js (F0b): frame timing i/fps, held settled frame, BT.709 matrix + tags consistent, yuv420p, even sizes,
  faststart: correct; restructured for --both.
- trClock for tools: approximate for flights (TRS.flight .8); t=auto added for exact clocks.
- Kit: MS_SIDE/MS_FRONT peak at 39.9 mm vs MS_DIMS.H 38.1 (KIT.md 08:40 says 38.1): flagged; loft uses the arrays.
