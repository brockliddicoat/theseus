# P2 progress: polish b02, b03, b08 (Clicks I, Clicks II, Surface)

Brief: /home/claude/theseus/handoff/revamp2/p2-brief.md. List: /home/claude/work/POLISH.md (b02, b03, b08 sections).
Files I own: deck/src/30-b02-clicks.js, 30-b03-switch.js, 30-b08-surface.js (in /home/claude/theseus). Nothing else.
Builds: `cd /home/claude/theseus/deck && python3 tools/build.py main --out=p2 --own=<file>` (one file at a time; the
snapshot has the rest). Checks: `export NODE_PATH=/opt/npm-tools/node_modules; Q='&2d=1'`; errs, qa (T=settle, T=mid),
shoot PAR=1 frames 0 / mid / settle, desktop and phone (0.44x). Contact sheets: scripts/sheet.py out cols w imgs...
Note: the session's working directory jumps (/home/claude/live/deck, /home/claude/work) are someone else's; /home/claude/live
is a copy of the deck (not mine, not touched). I use absolute paths only.

## Status
- [x] 09:55 read: brief, POLISH.md, review b02/b03/b08, builders' PROGRESS b02/b03/b08, FEEDBACK F41-F45, BROADCAST 0930/0945,
      common.md, KIT.md, build.py, FILLS index, Q3 brief.
- [x] b03_rail (F44.1): NEW slide "Four ways to guide a side rail" (paper, settle 11.5), after b03_side by file order. One row
      of four at one scale (17 px/mm), one press at the tip, held: 14 mm guide dry 74-78 gf; two loose posts 195-306 (tilt
      together); 5 mm guide dry 195-306 -> wipeTo -> greased 58-60; two posts tied by a wire 56-59 (hero). Tilt and play drawn
      5x (said), contacts red, friction arrows, the guide's push grey, the force counted + a bar (switch 55 + friction), the
      drawer demoPanel (twists, jams at two corners), legend, locator, Derived foot line. Constants in B03.rail (μ from Q3).
      errs ok; qa settle + mid clean; phone read (shots/rail4_phone.png). Picture + options sent to the integrator (10:3x).
- [x] b03_side (superseded 11:0x by F48.1, Brock picked "Tied posts (wire)"): b03_railMM redrawn as two posts in 5 mm POM-padded
      guides, a central nub on the switch (moved behind the guides), the stabiliser wire hidden under the section with its two
      pivot clips; readouts 59 / 55 / 59 gf (b03_tiedGf: the wire's pivots dry, conservative; greased 56 / 55 / 56); verdict
      125 → 4 gf ("Theseus", no "friction aside"); placeholder flag and T.flag removed; captions, blue line, labels (posts,
      wire), scale note (55 to 59 gf, about an egg's weight), foot line (derived, wire size assumed), answers updated.
      errs ok; qa settle + mid clean; frames 0 / 4.4 / 6.2 / 11 + phone: shots/side6/. b03_rail's tied column: "Theseus: a
      wire ties them"; fixed a map-index bug (mu.map(b03_tieF) passed the index as e) that showed 55 to 56: back to 56 to 59.
- [x] b03_debounce: third mode in the Click mode panel, "Double throw, safe: counted when the pole lands on NO, 1.4 ms later:
      a drop or a slam can't click"; answers row. errs ok; qa settle + mid clean; frames shots/deb1/ (0, 4.4, 11).
- [x] b08_wheel: Brock F47.5 (via integrator 10:4x): "Show the two found": drop the "to weigh" slots; OP1 1.8 g and Razer Viper
      V2 Pro 1.5 g (sellers' figures, said; the V2 Pro identification at Q3's medium confidence, worded so), PMM 1.0, Theseus 0.9.
- [x] b02_wedge: `ch: 'shell', after: 'b07_tolerance'`; callback first caption; the Clicks card's item "Direct Drive Actuation";
      verified in a b02+b07 build (the snapshot carries no builder files: build with --own=30-b02-clicks.js,30-b07-board-shape.js
      to see the shell chapter; b07's file read only). errs ok, qa clean.
- [x] S1-b02-1 (must): b02_trigBase smooths only where both neighbours are within 1 mm (the funnels gone: shots/cut_ba_full.png).
      AFTER S1's twin regen: re-check b02_trigRear's joint (near(src, -28.1, 12.6)) and the opening O1 on b02_cutouts / b02_seams.
- [x] (done 10:52, verified 11:2x) KIT shoulds (review/b02.md 10:31, 10:51): b02 line ~712 '%' → ' %'; b02_card's GT01 present from t = 0.
- [x] (done ~10:55-11:00 by the predecessor; R3 confirmed in frames 11:58) b08 R2 (10:18): R2-b08-9 verdict on the stock average (n = 2) 1.65 → 0.90 g; R2-b08-10 PMM's count lands before 4.6 s;
      the triangles callback in words. R2 (09:58) R2-b08-1..7 on uv, tape, twotone.
- [x] (replied FIXED / WHY NOT in review/b08.md; R3 confirmed 11:58) b08 open critic findings R2-b08-1..7 (09:58, no replies yet): weigh each, reply FIXED / WHY NOT.
- [ ] (still waiting at 12:2x: see the last line of this file) Watch: S1's SHAPE note in review/b02.md (b02_trigBase corner smoothing, the "wacky" funnel); wheel opening O1 (even 1.0 mm
      gap, 9.0 × 19.3 mm, r 1.6) drawn from the 3D twin once S1 regenerates it (snapshot geo2d). New RESEARCH / KIT lines.
- [x] (12:1x) POLISH.md marks + review replies (b03 done below; b02, b08 as they finish).
- [x] (12:2x) Report (SubagentHandback) sent; no new questions for Brock (R3 withdrew R3-b02-1; F35 is P1's question).

## Decisions and notes (as I go)
- 10:05 rail model checked (scripts/rail_model.py): at b03_side's tip spot (12.375 mm, e 5.125 mm), dry μ 0.2: 14 mm guide
  64.4 gf (×1.17), 5 mm 93.2 gf (×1.69), ~2 mm (b03_side as drawn) jams. F44.1's ×1.2 / ×1.85 / ×4.3 were at the old 13.0 mm
  spot (e 5.75): reproduced. Two UNTIED posts (5 mm guides, sharing equally) = 93.2 gf, the same as one post: a rigid button
  shifts both posts sideways alike, so they tilt together (near post only 76.7, far only 213.8: depends on clearances). Only a
  TIE (stabiliser wire / linked frame: equal travel forced) carries the tilt moment as axial forces: ×1.0.
- 10:08 messaged the integrator; reply: AGREED. Four designs (the tied pair added), keep "friction aside" on b03_side until
  Brock picks, send the picture with the options, flag b03_side's ~2 mm guide on its drawing.
- 10:15 Q3's POM friction landed (FILLS "b03_side-POM friction"): dry POM on POM kinetic 0.35-0.40 (DuPont Delrin); the 0.2 was
  DuPont's STATIC figure against STEEL. Plastics grease 0.02-0.04 (Molykote PG-54/PG-75, steel on POM, steady sliding);
  caveat: two papers find lubrication doesn't lower POM's static μ. Recomputed at e 5.125, gf rounded up: 14 mm dry 74-78;
  5 mm dry 195-306 (jam μ 0.488); two untied posts dry 195-306; 5 mm greased 58-60; b03_side's 1.95 mm guide jams dry (jam μ
  0.19), greased 62-70; tied: the tie's pivots only (assumed 0.6 mm wire on 3 mm arms, 4 joints): 56 to 59.
  Spread across b03_side's three spots (its verdict once Brock picks): A 14 mm dry 19-23 gf; B loose posts 140-251; C 5 mm
  greased 3-5; D tied 1-4; (14 mm greased 1-2). JND 7 % of 55 = 3.85 gf.
- Comma in the rail's source line looks like a period at 1x (antialiasing): checked at DSF 2, it's a comma.
- Models and conventions checked (rail): F = S / (1 − 2μe/L) re-derived (statics: thumb moment F·e answered by the guide's
  couple N·L, two contacts each μN; friction moments of the two faces cancel); units gf, mm; reproduced b03's and Q3's figures;
  the two-post case by explicit statics (equal share, near-only, far-only); the tie by its pivots' lever (assumed geometry,
  said on the slide). Rounding: Theseus's costs rounded up (ceil), ranges kept as ranges.

## Resumed 11:15 (P2 relaunched after the server restart; new agent, same brief)
- [x] 11:2x re-checked what the predecessor may have left half-done: node --check ok on 30-b02-clicks.js, 30-b03-switch.js,
      30-b08-surface.js; --own builds p2b2 / p2b3 / p2b8; errs ok on all 12 b02, 8 b03, 9 b08 slides. b02's ' %' and
      b02_card's GT01 at t = 0 are in the file (10:52). b08 R2 items -1..-10 replied FIXED in review/b08.md (11:00 edit was
      b08_tape's locator): to verify in frames.
- [x] (all done 11:3x-12:2x, below) Open items the old list missed: R2-b02-1 (MUST: b02_tensioner, b02_stiff empty at t = 0), R2-b02-2..8 (shoulds,
      no replies yet), R2-b03-1..5 (shoulds, no replies), R2-b03-6 (greased guide in neutral ink), R2-b03-8 (could);
      H3 HARDWARE must on b03 (Theseus's board 1.0 mm → BOARD_T in b03_switch / b03_spdt / b03_timing / b03_clawMM);
      POLISH "all polish agents" hand-off item (reply for b02 / b03 / b08) and the b02_card item ([x]).
- [x] 11:3x R2-b02-1 (MUST): b02_tensioner and b02_stiff draw their subject from t = 0 (both tensioners at rest with their
      readouts, the window, the locator; both buttons at rest, the locator, the classroom doors). Frames shots/ten2/.
- [x] 11:3x R2-b02-2 / FILM F33: b02_tensioner's key is the kit's heatKey (MPa against the hotter peak) + "Breaks at 207 MPa
      bent"; the margin by feUse (scripts/ten_margin.js: bridge 20.168×, axial 0.001 MPa; flat 20.92×) → "Peak: 20.1× under
      the break" (was 11.6× against 120); foot line: 207 bent, 120 stretched, the tensioner only bends.
- [x] 11:3x R2-b02-3: one number on both rows while the press is the same (the spring's part, 7.7 gf on both; flat then
      26.9), the GT01's 41.3 gf added once after both click (kG f1+0.2..0.8), then the bridge lands 68.2 → 49.0 "The felt click
      (lower is better)" (clk_ba k f1+0.8..1.3); neutral ink until it lands.
- [x] 11:3x R2-b02-4: b02_stiff's last caption says what Theseus gets ("your finger sinks 9 µm past the click, not 45"), the
      GPX 2 as corroboration; "a firm press" → "a hard click" (BROADCAST-0945 §3), its words only at the full 2 N; the arrow
      is gone between presses (was 0.50 N at rest). Rows moved up (470 / 690) so the second switch clears the foot line, the
      names clear the row above's base line (base line shortened to X(L + 8)).
- [x] 11:4x H3 HARDWARE must (b03): BOARD_T in b03_switch drawOurs, b03_spdt, b03_timing; b03_clawMM tP = BOARD_T (comment:
      0.6 mm, F47.4; hangs 1.82 mm below); B03_SW.yB = -BOARD_TOP (was literal -5.05). Rivals keep 1.0 / 1.2. errs, qa settle +
      mid clean on switch, spdt, timing, hotswap, rail; frames shots/brd1/.
- [x] 11:4x R2-b03-6: b03_rail's greased 5 mm guide in neutral ink (number and tag); only the tied pair is blue.
- [x] 11:5x R2-b02-5 (grooves verdict signed: "Push at the pad's edge, toward the middle (higher is better)" −22.7 % → 15.4 %,
      "Plain crown" / "Theseus"); R2-b02-6 (chained: b02_pom says its gain is the rails' 0.39 → 0.05 mm at the fingertip;
      rails' Theseus value 0.0435 now shown 0.05, rounded against us, net −87 %; b02_pom's misattributed "friction 0.20,
      Delrin 150" removed, delrin150 / tpuUlx dropped from src where unused); R2-b02-7 (pom: window, label and a top-view
      locator from t = 0); R2-b02-8 / FILM F22 (card: nine items, both halves); wedge could (counter fades as the verdict
      lands). Rails: foot line trimmed to 3 lines, box 650 → 628 tall (the foot line ran through the mouse). errs, qa settle +
      mid clean on all changed b02 slides; phone sheet shots/b02_phone_sheet.png. Replies in review/b02.md.
- [ ] Shared-code note for the integrator: 05-data.js SRC delrin150 says "dynamic friction 0.20"; Q3 found 0.20 is Delrin's
      STATIC figure against steel (dynamic 0.35). Not mine to edit.
- [x] 12:0x b03: R2-b03-1 (debounce: the drag drawn, a finger dragged along a button, the switch flashing at each NO
      closing; fades as Theseus's note takes the band); R2-b03-2 ("Wait to count a click", "Fnatic's advice" → "Theseus
      default"); R2-b03-3 (neutral counts); R2-b03-4 (binning: Endgame Gear 5.0 → 3.0 gf, its 60-65 band drawn yellow; bands
      re-spaced 354 / 404 / 450); R2-b03-5 (spdt verdict "Clicks from one press"); R3-b03-2 (timing: "When the click counts,
      from the switch closing" Single throw, at best 0.0 → −1.4 ms; 70 µs target vs XA25 72 as the stat under it; not R3's
      4.4 → 0, which would repeat debounce's 4 → 0); FILM F36 (b03_rail `before: 'b03_side'`; combined b02+b03 build checked:
      ... b03_hotswap > b03_rail > b03_side). errs ok on all 19 Clicks slides + b02_wedge in the combined build p2c; qa settle +
      mid clean on every changed slide. Replies in review/b03.md and FILM.md (F22, F23b, F33, F36).
- [x] 12:1x b08: R3-b08-1 (gripmap: two plain stats, 0.327 vs 0.285 N, 12 % less; the old 0.33 → 0.28 rounded both ends our
      way). The predecessor's b08 R2 work re-verified (errs all 9, qa settle + mid clean, frames shots/b8v/; R3 confirmed at 11:58).
- [x] 12:1x POLISH.md: b02_card item [x]; hand-off item [x] with P2's reply (none real in b02/b03/b08); per-chapter notes for
      today's review items under b02, b03, b08. FILM.md replies (F22, F23b, F33, F36).
- [x] 12:1x R3-b02-1 heat options sheet /home/claude/work/p2/opts/b02_tensioner_heat_options.png (lab switch ?tnheat=A|B|C in
      30-b02-clicks.js; the film is A). R3 then WITHDREW R3-b02-1 (F18.6 is Brock's): no question for Brock needed.
- [x] 12:2x R3-b02-2 (b02_front owner "Grooved to the edge"), R3's could on b03_timing's last caption. b03_side's "(next slide)"
      references fixed after the reorder (foot line and answers row); b03 file header lists eight slides in the new order.
- [x] 12:2x Final: combined build p2all (b02 + b03 + b08): errs ok on all 29; qa settle clean on all 20 Clicks slides, mid clean
      on the 20 + b08_gripmap; phone sheets shots/b02_phone_sheet.png, shots/b03_b08_phone_sheet.png.
- [ ] Still waiting (not mine to unblock): S2's regenerated twins (shell.json in the snapshot is 09:17). When they land:
      rebuild --own=30-b02-clicks.js; in b02_trigBase re-point the joint search i1 = near(src, -28.1, 12.6) to S2's J (about
      x -28.31, z 11.74 per S2's PROGRESS) and the inner corner i0 near (-0.15, 5.6) to the new cutout line (z 4.84); re-shoot
      b02_cutouts and b02_seams (0 / 4.2 / settle) and check the O1 opening (even 1.0 mm gap, r 1.6) isn't smoothed (the 1 mm
      neighbour rule leaves an r 1.6 arc within about 0.01 mm).
