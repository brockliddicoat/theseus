# H1: the hardware the slides draw (the board to plan 5, the GT01, the battery, the sensor, the wheel, the encoder)

Read /home/claude/theseus/handoff/revamp2/common.md first (the 2D-only rule and why the 2D drawings must come from the 3D
assets), then FEEDBACK.md F26, F29, F30 (all of it, including F30.25), F31 and F21.11, F21.15, F22, F25, then the history of
this work: handoff/K2-PROGRESS.md, handoff/K1-PROGRESS.md, handoff/GT01-PLUNGER.md, handoff/INTEGRATOR-NOTES.md,
handoff/briefs/k2-prompt.md, 3d/CONVENTIONS.md, 3d/pcb/README.md, 3d/pcb/plans/plan5.py and outline_v5.json, and the plan
image Brock approved: handoff/plan-images/board-plan-5.jpg. Work folder: /home/claude/work/h1/ (PROGRESS.md).

Brock reviewed the board through five plans and approved plan 5 with these last changes (F30.25): "chamfer and filet the
scroll wheel cutout, make the back notch the same length as the left and right, then build". The build never finished:
the session ran out. The 3D mode is leaving the film, but its assets stay, and every 2D drawing of these parts must be
derived from them (Brock today: "as many of the 2d visualizations should be derived from 3d assets as possible to make
sure they stay consistent, and then those assets are also usable for development").

Ignore anything Codex made (it is not on this branch): Brock called it "a step backwards on almost all fronts".

## Jobs, in order
1. **Tooling.** npm and pip work here now: `cd 3d && npm install`, and `pip install --break-system-packages shapely
   mapbox-earcut` (and whatever 3d/pcb/tools needs). Prefer the real libraries to K2's shim (3d/pcb/tools/shim), but keep
   the shim. Build into a scratch folder first (PCB_OUT), as K2 did.
2. **The board to plan 5**, with every change Brock asked for: one mirrored outline (the whole footprint symmetric, F30.23),
   one notch depth (3.61 mm) for the side and rear notches and the front trapezoid, the rear notch as long as the side
   notches, every chamfer at one angle (35.2°) with straight chamfers whose ends carry the same apparent fillet, the wheel
   bay chamfered and filleted the same way with a gold trim (F30.21, F30.25), the USB-C receptacle moved back 1.05 mm and
   hanging 1.6 mm past the front (F30.25), the mounting holes in exact mirror pairs, SH1, SH2, LH1, LH2 dropped and no new
   cut-outs (F30.13, F30.16, F30.19), the sensor and MCU swapped so the sensor sits as far forward as possible with equal
   1.6 mm gaps down the centre line (F30.3, F30.12), the PMIC in the left-middle spot far from the MCU (F30.1), the battery
   connector J2 opening to the back (F26.4), the power switch in both versions (A in its window, the default; B at the
   edge) (F30.17, F30.19), every trace present and the full underside artwork (the old design's dark triangles, gold
   clusters, wordmark, labels and QR) adapted to the new outline with each triangle filleted (F30.7, F30.15), the PAW3970
   marking on the sensor (F26.9). The board must be at least as detailed as the old one (F30.7). Check it against
   board-plan-5.jpg and the plan's numbers.
3. **The battery and the balance.** The longer rear notch may clash with the battery's front corners: the decision on
   2026-11-05 was to keep his notch length and move the battery back 2.23 mm, checking it still clears the shell in the
   tail; if it doesn't, keep plan 5's notch and say why. The balance point stays at the centre of the mouse (F30.10,
   F21.15).
4. **The sensor moved forward**: the shell's lens window, the clip-on lens and the dots it carries move with it (F20.2,
   F30.10), in 3D and 2D.
5. **The GT01's bottom housing**: straight walls of one consistent thickness, visibly thicker than the 0.45 mm of v23,
   measured off Gateron's images (refs/photos/gateron-gt01-*.jpg; F30.18, F30.24). The side profile stays traced from
   Gateron's render (F28.1). The plunger cap above the housing turned 90° (F27 on `clicks`). Three pins (F12.7).
6. **The wheel and the encoder**: the six-arm 0.900 g magnesium wheel with the straight-line tread Brock prefers (F30.8;
   thinner arms, F25.2); the magnetic (Hall-effect) encoder with a transparent top housing so a failure can be seen (F27 on
   `sealed` and `clk_switch`). Check what K2's WIP commit already did before redoing it.
7. **The 2D drawings**: regenerate the flat twins (deck/geo2d via deck/tools/geo2d/build.sh, which needs the 3D bundle built
   first), and bring the hand-coded shared drawings in step with the assets: `boardMM`, `encoderMM` and `keyPlanMM`
   (deck/src/03-parts.js: the board outline, the sensor, battery and antenna positions in the key plan) and `clk_gt01MM`
   (deck/src/10-b-click.js). Never change their names or signatures: 104 new slides call them. Where a drawing can be
   generated from the asset data instead of hand-coded, do that.
8. **A review image** for Brock: the board top and underside, A and B, the GT01's side profile, the battery and sensor in
   the key plan, before beside after. Write it to /home/claude/work/h1/review.png; the integrator sends it.

## Rules
- Your files: 3d/** (except 3d/node_modules in git), deck/geo2d/**, deck/tools/geo2d/**, and in deck/src only the
  functions named in job 7 and their private helpers. Nothing else.
- Check the deck still builds and the slides that draw these parts render without errors in 2D (tools/errs.js, `Q='&2d=1'`)
  after each change to the shared drawings; tell the integrator which shared functions changed so it refreshes the
  builders' snapshot.
- Keep the 3D assets and their sources in the repo (the large binaries as they are today; git ignores node_modules).
- Don't commit, push or publish. Report: what changed, its numbers, what you couldn't do and why, and questions for Brock
  as multiple-choice options.
