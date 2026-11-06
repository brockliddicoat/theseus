# V2: the loadout bars (Brock 15:57). Progress log

Started 2026-11-06 ~16:10. Branch claude/v23-refine-2026-11-06 (no commits; main commits). Build: main-v2.

## Decisions
- Categories (real, comparable figures for the flagships shown; deck data only):
  weight as weighed (g), density (g per cm³ of its box), battery (h at 1 khz, makers' ratings), motion latency (wireless
  8 khz, PIAKNOW'S rig). Click (press to PC, Finalmouse's rig) built but OFF by default (?click=1): Theseus's derived
  "under 4.2 ms" loses to the magnetic Starlight X 2.0 ms and the inductive X2 Superstrike 3.0 ms, so it can't be full.
  Battery at 8 khz: only the V4 Pro has a figure (one rival), so 1 khz.
- Flagships (fullest data): Viper V4 Pro (4/4), G Pro X2 Superstrike (4/4; the X3 is neither weighed nor timed yet),
  HTS Ultra 8K (3/4), Starlight X (2/4). X2F out (never weighed: listing only), XA25 out (wired).
- Scale: the best of the four = the line (100 %); lower is better: best / figure. Only Theseus passes the line; overflow to
  scale to 130 %, past that a break and "2.4x".
- Theseus fills: weight 2,3,7,8; density 1,2,3,7,8; battery 6; motion 5,6; (click 4). A step per move toward the line, the
  figure with the last step (overflows at 6 and 8). Move 4 fills nothing unless click is on (question 1).
- Dock: one strip on the label row, top right (the IDEA chips hidden in the film there). Board stays in the footer.

## State
- [ ] LO data + bar + dock + panel (25-film.js)
- [ ] loadouts slide (replaces b01_compromise in the film)
- [ ] rule slide + move cards use the panel
- [ ] targets: press to PC "Under 4.2 ms, derived"
- [ ] checks, qa, reel, sheets, close-ups, question picture

## 16:55 state (after Brock's 16:25, 16:30, 16:42 notes via main)
- [x] LO (25-film.js): cats weight->density, size (hollow, not a score), battery 1 khz, motion; click built, off (?click=1).
  Seven flagships: X2 Superstrike, V4 Pro, Starlight X, HTS Ultra 8K, X2F, HTS Plus Pro 8K, XA25; tags in red on the
  lightness bar (holes, no rim / half a shell / no rim / wired).
- [x] loadouts slide (move 0, b01_compromise's slot): rows, generic silhouettes (mouseRival; X2F traced; Theseus simple),
  weight / size division -> density, Theseus's empty row docks top right.
- [x] dock in filmChrome (lo_dockOn), chips hidden there; panel on move cards (steps, move numbers, pulse), rule = plan panel.
- [x] data: EX_WEIGHED (XA25 25.37, X2F 29.5, Brock), EX_DIMS XA25 117x63x36 (XBAB), exDims; b01_all + ntr_box use them.
- [x] ntr_sizewt: three silhouettes per box (ntr_boxSils); ntr_density: Weight wording, XA25 row; ntr_densrank: XA25
  ranked (Theseus 3rd, caption names who is ahead and why); targets: press to PC "Under 4.2 ms, derived".
- [x] wording: grams -> weight in moves, edges, links, ledger.
- Honest result: Theseus's density 0.0987 is short of the wired XA25 (0.0956) and the Plus Pro (0.0981, listed):
  its density bar ends at 97 % of the line. Question 1 for Brock. Click: question 2.

## 17:00 DONE (handed back to main)
- Build: deck/dist/main-v2.html (copy: /home/claude/work/v2/main-v2.html). 126 slides. ?click=1 turns the click bar on.
- Checks: film.js check, all 126 slides in 9 batches: 0 errors. errs.js (loadouts, rule, mv4): ok. qa.js settle on 12
  changed slides + mid on 7: clean (one source-line overlap on ntr_densrank fixed).
- Reel: clips/pilot_v2_2026-11-06.mp4 (163.3 s, 960 px, 12 fps; marks in .marks.json). Reviewed at 1 frame/s around the
  new slide: something changes every second; caption fix ("seven") re-rendered.
- Images (out/): v2_pilot_settled_2026-11-06.png, v2_giants_loadout_2026-11-06.png, v2_theseus_bars_2026-11-06.png,
  v2_q1_density_2026-11-06.png, v2_q2_click_2026-11-06.png. compose.py makes them from f3/ and fq/ frames.
- Files: 25-film.js, 14-a-exdata.js, 14-d-intro.js, 14-b-intro-ex.js, 30-b01-intro.js, 30-b07-board-shape.js.
- Open for Brock: Q1 density comparison (Theseus 97 % today), Q2 click bar. Not built: specific density (future).
