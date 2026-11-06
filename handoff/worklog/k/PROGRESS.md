# K (shared-code maintainer): progress

Brief: /home/claude/theseus/handoff/revamp2/k-brief.md. Started 2026-11-06 ~09:45 (machine clock). State: ALL ITEMS DONE
(11:45). Final full-film errs pass: 105 slides × 7 times, 0 errors (tests/errs2-film.txt); kit page 19 slides, 0 errors.
Report sent at the end (SubagentHandback).

## Boundaries kept
- 20-app.js: F0c's until it finished; the integrator handed it to K (~11:00) for the dissolve change only.
- F0c's CARD2 / base / screws, S1's mouseSimple geometry, H2's KEY_PARTS: untouched. Every 06-motion.js edit was an exact-
  string edit applied to src and .snapshot/src (apply_edit.py aborts unless each anchor occurs once); before each snapshot
  edit the snapshot was compared with K's backup (F0c changed it during the morning: CARD2.skip / msSameM; K's edits went on
  top). At the end every shared file in src equals .snapshot/src.

## Done (all in src AND .snapshot/src, logged in KIT.md §4)
1. mouseRival(view, o), rivalFit(box, view, o), rvBox(view, name, o), rvAt(view, name, o), RV_DIMS (09:52; integrator
   messaged 09:55; review notes b01, b09, b10). Kit slides kit_rival_n, kit_rival_p, kit_rival_dims.
2. verdict (10:30, 10:40): names never overlap; a space before %; maxW fits the row; the label keeps to align; no doubled
   value or unit during the morph (b08). breakdown() "12.3 %". Kit slide kit_verdict. Notes b01, b02, b04, b06, b08, b11.
3. sentence() keeps iFixit / iPhone / eBay / mAh (01-core.js). No on-screen string changes today.
4. feUse / feBreakAt (07-sim.js); shlHot's peak = r.smax and shlWorkShare against it (10-d-shell.js). Notes b05, b06.
5. SIM_MAT one value per material + matOf(); every old shared copy reads it; shlFr4 / shlAbs / shlPc carry the bending
   strengths. Notes b05, b07.
7. heatKey(t, t0, x, y, w, o) (06-motion.js). Kit slides kit_heat_n, kit_heat_p. Notes b05 (must), b06 (should).
8. common.md "Added 11:20" (today's conventions) + KIT.md §2 rules.
9. (coordinator) FILM F12: chapterCard2's frame one complete; flights pixel-exact both ways. Note b02 (its GT01 part).
10. (coordinator) 20-app.js dissolve: E.out5 over 0.45 s; DESIGN §7, §11.
- tools/build.py: `kit --out=<name>` → dist/kit-<name>.html.

## Checks run
- tests/t-rival-geo.js (rival geometry), tests/t-k-sim.js (feUse/feBreakAt vs M, SIM_MAT, b07 before/after),
  tests/callers.js (who calls what), tests/verdict-rows.js (rows vs maxW), tests/sentence-diff.js, tests/dissolve-live.js.
- QA at settle on all 84 verdict slides against a baseline build (b0/); errs on every slide calling a changed function;
  cards at t = 0 and settle; F0c's trsheet.js / edges.js for flights; kit page errs; full film errs2 (105 × 7).

## Models and conventions checked
- mouseRival's generic shape: not a model of any named mouse (documented as "a typical mouse"); default 120 × 63 × 39 mm;
  builders pass each rival's sourced dims. Parts' places illustrative, said so in KIT.md.
- M's feUse rule: reproduced exactly (shlHot 109.0 / 93.9 / 147.8 N; b06 strip 156.50 / 34.13 N with rigid zones skipped).
- shlHot r.peak: the samples' outer row sat inside the fibre (17.79 vs 18.99 MPa, −6.3 %): now r.smax.
- FR4: Gund gives 20 / 18 GPa (along / across) and 552 / 483 MPa; 19 GPa was an unsourced midpoint → E 18 (board models:
  the value that doesn't flatter Theseus), EL 20 (FR4 ranked as a material). Mg: MatWeb AZ91D-F 44.8 GPa (makeitfrom's 46
  retired; MatWeb is the cast alloy, and the deck already printed it).
- % spacing: SI Brochure 9th ed. §5.4.3 (a space before units; ° ′ ″ for angles attach), §5.4.7 (a space before %).
- F0b's dissolve: io5 over 0.55 s showed ~0 % for 0.2 s (2 % at 0.15 s) → out5 over 0.45 s (45 % at 50 ms, the 20 to 80 %
  band 104 ms, near F0b's ~0.1 s goal).
