# V5: moves 4 and 5 of the v23 refinement ("Clicks the stiff shell makes possible", "Glide and tracking"). Progress log

Started 2026-11-06 ~18:20. Worktree /home/claude/work/v5, branch v5-moves45 (from a35843a). Build: `python3 tools/build.py main --out=v5`.

## Step 1: compare (v23 in the film against the revamp's replacements, ?film=0)
Sheets at settle: work/v5/cmp/v23_m4_*.png, rv_m4_*.png, v23_m5_*.png, rv_m5_*.png; motion strips (0.5 s) of the contested
pairs: cmp/strip/ (arc, b02_direct, anchors, b02_rails, tensioner, b02_tensioner, clk_tenmat, b02_stiff, b02_cutouts, b04_sag).

## Step 2: the choice
Rule (as V3): v23's peaks kept unless the revamp's replacement IS that slide with his notes done; a slide at 6 or below that
he called hard to understand, lazy or "combine" goes to the revamp's rebuild where it is better; what doesn't feed the chain
is cut.

MOVE 4 (15 + card): six upgrades, each built on the one before (FILM.steps[4]); the click bar stays off, so the card and the
ladder say what it gains.

| Upgrade | Slide in the film | Was (his score) | Call | Why |
|---|---|---|---|---|
| 1 direct drive | b02_direct | arc (7) | swap | His note: "needs to be demonstrated and sold better". The rebuild zooms from the mouse into the section, a finger presses, "what you feel"; same 34.2 % to 0.0 % and 6 % sooner (F31.2). arc is denser but static and abstract. |
| 1 | b02_wedge | clk_wedge (4) | swap | "Could be closer to the less parts is better demonstration, show after you've shown the problem with having more parts": the rebuild is that (3 extra parts to 0), and it now follows move 3's tolerance slide. Its chapter set to click (FILM.chOf). |
| 2 the bridge | b02_tensioner | tensioner (8) | swap, same drawing | The rebuild IS v23's tensioner (same animation, "As seen in Starlight X" / "Proposed solution", the trigger drawn as a T with no fillet at the bridge), with honest figures: the click the finger feels, GT01 included (68.2 to 49.0 gf) instead of the spring's part alone (26.9 to 7.7), and the break stress corrected (207 MPa bent). |
| 2 | b02_stiff | clk_tenmat (4) | swap | "Hard to understand, and stiffer is better doesn't seem right": the rebuild splits the two jobs (body stiff, spring light) with a classroom door, and ties the body to move 2's resin. |
| 3 straight cutouts | b02_cutouts | cutouts (3) | swap | "Worst graphic design … can hardly tell which part of the mouse": the rebuild shows the whole mouse, a finger, the Sora V2's smile against the straight cut, the classroom crease. |
| 3 | b02_seams | shlsheet1's seam panel (4) | swap (moved here) | "Should be back by the other cutouts slides": V3 cut shlsheet1 for this. |
| 4 dual rails | b02_rails | anchors (7) | swap | "Too abstract and difficult to tell what you're looking at … sell the benefit (cheap, wear)": the mouse from above, loupes on both posts, 0.39 to 0.05 mm, "Solid, not cheap". |
| 5 a flat front | b02_front, b02_flush | clk_front (8, "second worst execution") | swap | His note asked for exactly these: the grooved front that rocks against the flat one, then why the cutouts face the ceiling and the walls sit flush. |
| 6 the switch | b03_switch | clk_switch (5) | swap | Battery shown (+15 %), Razer staff's remark as theirs, the GT01 redrawn from Gateron's render. Feeds move 6 (link and edge 4 to 6). |
| 6 | b03_spdt | clk_spdt (5) | swap | "Difficult to understand": the rebuild has the classroom knife switch. |
| 6 | b03_timing | latency (6), clk_wait (3), clk_methods (3) | swap, combined | "Hard to tell what is changing", "combine": one slide, negative latency. |
| 6 | b03_debounce | clk_debounce (3) | swap | His Minecraft note: low by default and yours to set (0 to 20 ms). |
| all six | b03_side | sidebuttons (5) | swap | The two tied posts he chose (F44.1, F48.1) on full-size SPDT switches; the rail options sheet (b03_rail) not played. |
| recap | clickup (NEW) | | new | The six upgrades as a ladder, each rung's figure read from its own slide's constants (30-b13-moves45.js), what the finger gets, what it hands on (move 6, move 9). F64.13: "each slide and a recap with all the gains". |

Cut from move 4: clk_switch2 / b03_binning (2, "largely irrelevant"), clk_hotswap / b03_hotswap (4; doesn't build on the
stiff shell; a candidate for move 8, question 2), clk_pomtune / b02_pom (6; the rails slide carries the POM pads and the
0.05 mm; the UltraightX comparison goes with it), b03_rail (the options sheet he chose from), the chapter card `clicks` (7;
mv4 takes its place; the GT01 is drawn by b03_switch's newer model).

MOVE 5 (8 + card): five upgrades on one need, a lens held in focus (FILM.steps[5]).

| Upgrade | Slide in the film | Was (his score) | Call | Why |
|---|---|---|---|---|
| the problem | b04_camera | gld_camera (4), gld_corr (5), gld_blur (2) | swap, combined | All three: "combine". The camera, frames compared, defocus, on one slide. |
| 1 focus window | b04_focus | focus (no score) | swap | v23's focus prints "+26 PTS"; he wants no "pts" anywhere. The rebuild: the same flick's spread, 17 % to 8 %. |
| 2 dots at the lens | b04_sag | gld_sag (5), dots (6) | swap, combined | "Group with a comparison to bigger skates and weight efficiency": two dots do the work of 0.31 g of skate (0.05 g). |
| 2 | b04_skates | gld_under (4), gld_sheet (4) | swap, combined | Three dots on each corner ledge, no screw under a skate. |
| 3 snap-on lens | gld_module | gld_module (8) | keep v23 | "A good slide": a peak with no complaint. |
| 4 the sensor | b04_sensor | sensor (6) | swap | Says "suspected" and "Theseus's plan, after Razer's exclusivity", as he asked. |
| 4 | b04_reports | gld_reports (3) | swap | "Not a demonstration": the rebuild shows 16 frames averaged against 2, 44 px behind against 3. The motion bar's first step. |
| 5 lift-off | b10_software | gld_soft (7) | swap (moved here) | "Place near web software, better sell 0.1 mm configurable": the rebuild is the web-software slide, sold on cursor drift each lift (3.0 to 1.8 mm). Chapter set to glide. NOTE for main: move 6 still plays v23's `software`; with b10_software here, drop it from row 6 (question 1). |

Cut from move 5: the chapter card `glide` (mv5 takes it), gld_corr, gld_blur (combined), gld_sheet (combined).

## Step 3: the compounding (25-film.js)
- FILM.order rows 4 and 5; FILM.link lines for every slide in them (each under 80 characters, so the footer stays one line).
- FILM.steps[4] (six upgrades, done: "six upgrades, one click") and FILM.steps[5] (five; b04_camera is "the problem").
- FILM.moves[4] and [5]: builds / unlocks rewritten; a `stat` on each (v5_cardStat): move 4 says why it fills no bar and
  what it gains (34.2 to 0.0 % across the switch, felt click 49.0 not 68.2 gf, 0.05 mm of play, counted 1.4 ms before the
  switch closes, +15 % battery for move 6); move 5 says what earns the motion bar's first step (frames 2 at a time, not 16
  averaged, from a lens held in its 0.2 mm window).
- FILM.edges: [4, 6, 'Battery'] (the switches' saving), [5, 6, 'Every frame'] (the motion bar's second step). Move 6's card
  now lights them as what it builds on; its "Builds on" text (V4's) still names moves 2 and 3 only.
- FILM.chOf: b02_wedge and b10_software play in their move's chapter.
- Two one-line hooks in shared code: filmStep's last label reads `S0.done` (it said "one shell" for every move);
  filmCardStat returns FILM.moves[n].stat() when a move has one. Nothing else outside rows 4/5, their links and steps, the
  moves' 4 and 5 entries and their edges.
- Figures: none typed. The ladder and the card read B02, B02_CT, B02_RL, B02_FT, B02_TN, clk_ten, b02_clickGf2, b02_hinge,
  b02_front*, B03, B03_TM, B04R, lo_fm and b01_pressTgt. No battery-hour or weight literal (V4's change flows in).

## Files
- deck/src/25-film.js (rows 4, 5; links; steps 4, 5; moves 4, 5; two edges; chOf; filmStep's done label; filmCardStat's
  stat hook)
- deck/src/30-b13-moves45.js (NEW: v5_clickRungs, v5_upIcon, v5_cardStat, the clickup slide)

## Checks (18:40)
- film.js check, the whole film (110 slides, b07_balance through mv6 included) in batches of 15: 0 errors
  (work/v5/checks/film_check.txt).
- Settle frames of every slide in moves 4 and 5 looked at (cmp/new*.png, the v23/revamp sheets); mid frames
  (checks/mid_1.png); the reel at 1.5 s steps, one row a slide (checks/reel_sheet.png, reel_sheet2.png): something lands
  every beat, the verdict last; footer link lines one line each; &2d=1 (checks/2d_1.png): clickup, gld_module, mv4,
  b02_cutouts look the same as the film.
- Not changed: the grounds still alternate paper and night through move 4 (the revamp's; the film-wide grounds question,
  WORK-LEFT 1.2, is open).

## Deliverables
- Reel: work/v5/clips/moves45_v5.mp4 (b07_balance to mv6 as the film plays them: 304.2 s, 12 fps, 960 px; marks in
  moves45_v5.marks.json).
- Close-ups (1600 px): work/v5/out/v5_peak1_six_upgrades_one_click_2026-11-06.png (the ladder),
  v5_peak2_bridge_tensioner_felt_click_2026-11-06.png (v23's tensioner drawing, honest felt click),
  v5_peak3_move5_card_motion_step_2026-11-06.png (move 5's card: the motion bar's first step, edges into move 6).
- Build: deck/dist/main-v5.html (110 slides).

## For main (merge notes)
1. Row 6 still plays v23's `software`; b10_software (which replaces `software` and `gld_soft`) now ends move 5, so the web
   software shows twice until `software` leaves row 6 (question 1).
2. mv6's board lights the two new links in (4 to 6 "Battery", 5 to 6 "Every frame"); its "Builds on" line (V4's text) still
   names moves 2 and 3 only: add "and the switches and frames of moves 4 and 5" if V4 agrees.
3. Outside rows 4/5, their links/steps and the moves' 4/5 entries, 25-film.js changes four lines: the edges (one added
   line), chOf, filmStep's done label, filmCardStat's stat hook.
4. Cut b03_hotswap could go to move 8 (question 2).

## Questions for Brock (plain words, each with a recommendation)
1. Lift-off now ends the glide move, on the newer "Set it once, in the browser" slide, so it sits on the web software as
   you asked. The older web-software slide later in Power then repeats it. Drop that later one? Recommended: yes.
2. The hot-swap switch slide is out of Clicks: it doesn't build on the stiff shell. Move it to "Built to be opened"?
   Recommended: yes.
3. For Direct Drive and Dual Rails I used the newer versions (the finger and the mouse in view, as your notes asked). Want
   v23's originals side by side for testing, like the shell pairs? Recommended: no, the newer ones answer your notes.
