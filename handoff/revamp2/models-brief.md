# M: the model and convention auditor

Brock, 2026-11-06 08:18: "make sure no bad conventions are carried forward without thinking about them or flawed models are
silently used again without evaluating them for errors first". The old deck's models have been wrong before: the bottom
plate's FE study had three errors that favoured the plain grid (FEEDBACK F20.3, F21.14), and the old cutouts slide's
"33.4 % sideways" turned out to be sin(lean), the share of the button's motion that is a roll, not of the press going
sideways (found today). The revamp reuses many of these models. Your job: find every one, check it for errors, and say
what must change, before the new slides lean on them.

Read first: /home/claude/theseus/handoff/revamp2/common.md, REVAMP.md, FEEDBACK.md (the decisions that set numbers:
F12.11 dimensions, F12.12 120 MPa, F20, F21, F22, F25, F26.10, F31.2 and so on). Work folder: /home/claude/work/<your code>/.

## What to audit
1. **Every model and computed number the new slides use**, found by reading the builders' files (deck/src/30-*.js) and the old
   files they call (deck/src/07-sim.js, 10-d-shell.js, 10-d2-arches.js, 10-d3-board.js, 10-d-0-meter.js, 09-fillet-data.js,
   10-c-glide.js, 10-c2-glide.js, 10-b-click.js, 10-e*.js, 10-f*.js, 10-h*.js, 14-*.js, 05-data.js, research/data/*.json).
   At least:
   - the 2D frame solver (07-sim.js): beam and truss formulations, units (mm, N, MPa), the stress it reports (bending plus
     axial?), how `feEngaged` counts "grams that work", the load scaling, the fillet treatment, the materials (SIM_MAT:
     moduli, densities, strengths, sources). Verify it against textbook cases (a cantilever's PL³/3EI, a simply supported
     beam, a pin-jointed triangle and square) with a small test script;
   - the shell studies (flat plane against triangles, hexagons, arches; the 12 N and 45 N plate and arch; the "−51 % flex";
     the meter's baseline; the 15.2 g study body against the budget), the fillet size study, the specific-strength ranking;
   - the click geometry (Direct Drive's 6 % and 34 % → 0 %, the cutouts' lean, the tensioner's 26.9 → 7.7 gf and its
     example dimensions (F12.5: still unknown, labelled), the POM pad tolerance, debounce and latency figures, the 72 → 70
     µs target, the derived 18 % of battery for optical switches and +21 %);
   - glide: the defocus model, the 0.2 / 0.4 mm focus window, sag (150 → 0 µm, an illustration per F18.8), skate areas;
   - the weight budget and density (29.31 g, 297.0 cm³, 0.099 g/cm³, every rival's weight and box, one precision per
     comparison), battery hours against polling (200 h at 1 khz, the battery's mAh and mass, Li-ion against Li-po per his
     note on `cells`), charging at 1C, the wheel's 0.900 g (volume × density, the alloy), the titanium screws' numbers, the
     braided wire figures (200× the pull, −36 dB), the inserts (70 % → 0 %), thread wear (98.6 %, 82.8 %, 43.3 %), coating
     film weight;
   - every place a number is labelled measured, datasheet, claim or derived: is the label right?
2. **Conventions carried from the old deck** that may be wrong: chart scales that exaggerate (a non-zero baseline on a bar,
   a squared heat scale, F19.3 chose it "to make triangles look better": check it is disclosed), colour meanings, rounding
   rules, "lower is better" placement, evidence tags, how "next best" is chosen, how ranges are reported.

## How
- For each item: where it is defined (file and function), what it assumes, a check (by hand, a script, a textbook case or
  the cited source in the repo), and a verdict: **OK**, **FLAWED** (with the correction and its effect on the slide's
  number), or **UNCLEAR** (what would settle it).
- Write the audit to /home/claude/work/models/MODELS-AUDIT.md, grouped by chapter. For every FLAWED or UNCLEAR item a slide
  relies on, also append a "MODEL" finding to /home/claude/work/review/<builder code>.md (newest first, dated), so the
  builder fixes it.
- Don't edit deck files. If a shared model (07-sim.js and the like) is wrong, write the exact fix in the audit; the
  integrator applies it.
- No web search is left in this run: rely on first principles and the repo's sources; mark what can't be verified.
- Finish with a report: the FLAWED items first (with the slides they affect), then UNCLEAR, then a count of OK.
