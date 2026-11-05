# K1 progress (click mechanics, accurate)

Started 2026-11-05 ~04:15. Brief: scratchpad/handoff/k1-prompt.md + k-common.md.

## Order of work
1. GT01 plunger (clicks): settle shape/orientation -> GT01-PLUNGER.md for K2 -> 3D gt01.js + 2D clk_gt01MM
2. F26.1 tensioner research -> redraw tensioner / arc / clk_tenmat / clickMM / tensionerPlanMM
3. F26.2 uniform plungers: anchors, sidebuttons, 3D
4. clk_switch: Razer quote, battery effect, magnetic encoder; ask Brock for the bottom-housing reference

## Coordinator correction (04:2x)
- #59 (taller fulcrum) is ABANDONED (F12.6): not in Theseus's tensioner, not in any drawing. Atlantis may appear only as a rival.
- No fillets where the bridge meets the trigger (F27 tensioner note).
- Side switches held by the shell, no side board (F12.4).

## Status
- [x] 1 GT01 plunger + side profile (04:50): traced off 8e779cef (Brock's best ref), GT01-PLUNGER.md written for K2.
  3D: 3d/parts/gt01.js (body 1.02 lower, shoulder ys 2.5, cut-outs per render, plunger zs 2.0, cap turned 90° 1.5x2.1 round top
  0.80 proud, baked cover warped: hole turned+moved, recess end 1.3->0.7, skirt 2.0->2.5; skin bevel 0.22->0.12 so the holes cut).
  3d/shell/shell.js: gloveNub to z 2.0, y 7.83. Bundle rebuilt (vendor/r3d.js). 2D: clk_gt01MM in 10-b-click.js to the same numbers.
  Checked: node test (no NaN, nothing under the board, cap clears the hole), 3D shot of clicks, 2D shots clicks + clk_switch.
  TODO later: rebuild geo2d twins gt01 + shell.
- [~] 2 tensioner (05:30): research = Brock's 3 photos (G305, white shell, Lamzu: split blocks, one screw, hole grids, misaligned)
  + his doc (#4 ULX/FCC-1/RCC-1, #17 V2/V3 Pro, #59 Atlantis rival only) + TPU ULX lateral play. Public teardown text thin.
  DONE tensioner slide: real assembly (shell skin, rear cutout, boss + brass insert, one screw, block = trigger moulding, flexure,
  trigger skin/riser/post, switch); rows "As seen in Starlight X" / "Proposed solution"; clk_root fillets removed (square joints).
  DONE clickMM (03-parts.js, spliced): tensioner = trigger's own arm + bridge (no steel), block + one screw + insert, flat board,
  upright D2F crossfades to the mirrored GT01 (o.gt01), arc 20° (RC -1.4,0.2; foot 30,11.63) to match the GT01.
  DONE arc slide: no pts, 34.2%->0 sideways, +6.4% along, "6% sooner (1 - cos 20°)" box, rev 2.
  DONE clk_tenmat rethought: 3 tiles (ABS flat / PP-C-20A flat "as seen in Starlight X" / bridge), bars click force + trigger flex,
  both lower is better; headline 26.9 -> 7.7 gf; one-screw box kept.
  DONE tensionerPlanMM (03-parts.js): triggers' own arms, block + one screw, 10 mm bridge, plate; o.built = shipping-today
  hole grids + stacked boss; cutouts slide: arrows on the bridge, lean 19.5° (bridge's outer edge), no pts, label. No rev (K3's).
- [x] 3 plungers (06:00): anchors posts/guides/pads identical, new bottom row (2 -> 1 ways, What you feel). sidebuttons: glove
  = guide over the switch with POM pads + the main buttons' 2.4 mm post, stop on the guide; shipping side: side board + lead +
  rest ghost. 3D shell.js glove rebuilt (glovePost, guideWall/Pad/Skirt/Bridge/End; tiltG named sideSw<k>), bundle rebuilt.
- [x] 4 clk_switch (06:10): Razer quote NOT FOUND (razer.com page + blog, theshortcut, vortexgaming, xiaomitoday; TPU blocked).
  Derived: 0.15 mA/switch (Omron pulse), V4 Pro 306 mAh/180 h = 1.70 mA -> two mains 18%, +21% life. Wheel magnetic.
- Rating rule (05:15): rev 1 + answers on clicks, arc, clk_switch, tensioner, clk_tenmat, anchors, sidebuttons. cutouts: no rev.
- DONE (05:40): geo2d twins gt01+shell rebuilt; errs 2D all 18 click slides ok; errs 3D clicks/cutouts/sidebuttons/arc/tensioner ok;
  qa settle+mid clean on all 8 touched slides; final shots in final/ + sheet384.png. dist/main-k1.html = my build. Report sent.

## Notes clause checklist
All clauses answered in each slide's `answers` (clicks 2, arc 4, clk_switch 4, tensioner 3+F26.1, clk_tenmat 2, anchors 4,
sidebuttons 3). cutouts: drawing + pts only (its design note is K3's), no rev.

## Files touched
deck/src/10-b-click.js; deck/src/03-parts.js (CKG, clickGeo, clickMM, drawClick, tensionerPlanMM); 3d/parts/gt01.js;
3d/shell/shell.js (side glove); deck/vendor/r3d.js (bundle); deck/geo2d/gt01.json + shell.json; scratchpad/k1/GT01-PLUNGER.md

## Follow-up 06:45: GT01 walls straight, one thickness
Cover end walls carried down (render); housing back face plumb; side walls + all cut-out rims 0.45 mm (D2F-class cover wall);
skin bevel removed (it left the front hole and slot uncut). gt01.js + clk_gt01MM + bundle + gt01 twin + GT01-PLUNGER.md.
Checks: errs 2D+3D clicks, clk_switch ok; shots s9/17_clk_switch_9.png (2D), s9/3d/14_clicks_6.png (3D).
