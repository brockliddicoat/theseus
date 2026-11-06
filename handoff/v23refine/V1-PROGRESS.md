# V1: the v23 refinement, foundation and pilot (moves 0 and 1). Progress log

Started 2026-11-06 ~15:30. Branch claude/v23-refine-2026-11-06 (no commits; main commits).

## Tools (mine, /home/claude/work/v1/tools/film.js; one page load, many frames)
- `node tools/film.js check <html> <ids...>`: errors at 0.02,0.25,0.7,1.5,3,6,11 s and settle, one load per batch.
- `node tools/film.js strip <html> <outdir> <id>[:t0:t1] ... --step=0.25 --w=320 --cols=8`: frame strips.
- `node tools/film.js sheet <html> <out.png> id[:t|settle|mid] ... --w=480 --cols=4`: one cell per id.
- `node tools/film.js reel <html> <out.mp4> <ids...> --fps=12 --w=960`: the slides in order with the player's own transitions.
- `node tools/film.js frames <html> <outdir> id:t ...`: full-size PNGs.

## Decisions (pilot)
Move 0, the bar: b01_cover (v23 cover with his two fixes) · weightgap (10, kept) · ntr_sizewt (9, moved first: the X2F's
wrong idea first; outlines) · ntr_density (9, outlines) · ntr_densrank (9; G-Wolves, one decimal) · b01_battery (swap for
market 8: the battery shrinking along the giants' frontier is the "bigger argument") · b01_compromise (swap for flagships 6
and thesis 3; slowed to 1.5 s a flagship; the revamp's chapter-ledger fold removed) · targets (8; Dual 8khz) · rule (new).
Cut: thesis 3, ntr_stats 4, zerograms 5 (b01_lighter not clearly better: dense, small), targets2 7 (rows belong to later
moves; set-down/idle sleep out per his note), pricefront 7 (doesn't feed the chain), budget 6 (becomes the weight ledger),
market 8 (swapped).
Move 1, the shape: mv1 (move card) · b07_size (swap: X2F cut short against Theseus kept full, continues move 0) ·
shp_newton (v23, bolder than b07_newton) · grooves (v23) · emg (v23, calmer than b07_emg) · b07_sides (revamp; replaces
shbSides 4, which he asked to move to shape; equal pressure both sides) · mv2 (the move 2 card ends the pilot).

## State
- [ ] deck/src/25-film.js (manifest, moves, edges, board, chrome, cards, rule)
- [ ] build.py + 13-sort.js hooks
- [ ] slide fixes
- [ ] checks, strips, reel

## 16:40 state
- [x] deck/src/25-film.js: FILM (moves, edges, order, link, score), filmApply (one slide per id; a rebuild under its own
  id wins), the board (arc diagram: filmGeo/filmState/filmBoard), the chrome (filmChrome: rule, THESEUS / MOVE n, the
  slide's link line, the docked board, n / N), the scoreboard (filmScoreRows/filmScoreboard from NTR_BAR_*, ntr_dens,
  ntr_hours), the ledger (filmLedger from ntr_budget), move cards mv1..mv9 (filmCard), the rule slide.
- [x] build.py: 25-film.js after the slide files, before 13-sort.js; 13-sort.js returns when FILM.on. ?film=0: the old sort.
- [x] chapterInfo, slideChrome, updateBar replaced when FILM.on; DECK.chapters reordered to the film's order.
- [x] slide fixes: ntr_sizewt (outlines on the lids, X2F traced; one precision 29.0 / 29.3), ntr_density (outlines on the
  box's faces), ntr_densrank (G-Wolves's line, one precision, honest caption: 2nd behind the HTS Plus Pro 8K on its
  maker's figure), targets ("Dual 8khz"), b01_compromise (1.5 s a flagship in the film; the revamp's ledger fold off;
  "Gives up nothing" kept), prepare(): {piaknow}/piaknow → Piaknow (PIAKNOW in caps), Brock F27.
- Open: press to PC on targets (2.0 ms "same as the Starlight X" vs the revamp's derived "under 4.2 ms" mechanical): a
  question for Brock.

## 16:00 DONE (handed back to main)
- Build: /home/claude/theseus/deck/dist/main-v1.html (copy: /home/claude/work/v1/main-v1.html). 126 slides.
- Checks: film.js check on all 126 slides (batches of 15): 0 errors. tools/errs.js works (rule, mv1). tools/qa.js on the
  16 pilot slides at settle and mid: clean.
- Deliverables: clips/pilot_v1_2026-11-06.mp4 (164 s, 960 px, 12 fps, the player's own transitions; marks in
  .marks.json), strips/final/<id>.png (0.25 s steps), strips/final/00_pilot_settled.png, q_press_to_pc_2026-11-06.png.
- Later cards checked at settle: mv3, mv4 (scoreboard: click lands), mv6 (density, battery, motion land), mv9 (every link
  into the close, all rows).

## For the next move's builder
- Add your move's slide ids to FILM.order (25-film.js), their chain lines to FILM.link ({ s, to: [moves] }), sharpen the
  move's builds / unlocks in FILM.moves, set FILM.score[].at to the move that earns each row, and add ledger lines in
  filmLedger (from ntr_budget: boards, wheel, screws, inserts, battery).
- Moves 2-9 are v23's slides in v23's within-chapter order (move 6: battery slides first). srf_encoder sits in move 6
  (its ch is 'elec'; in move 7 it would split the move with a chapter flight). Keep every move's slides on one ch, or set
  flight: false on the odd one.
- Pacing tool: node tools/film.js strip <html> <dir> <ids> --step=0.25; reel for a run in order.
