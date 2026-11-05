# Theseus independent resource handoff

2026-11-05 · three independent reference packages · resources and calculations, not final-deck acceptance

This bundle adds qualified wheel component evidence, an independent mechanics/energy audit, and code-native reference geometry. The actively edited implementation checkout was read only. Nothing was committed, pushed, deployed or sent to Claude. No AI images or raw Sora scan assets are included.

Three GPT-6.1 Sol lanes were started in parallel. After Brock required MAX effort, completed work was preserved and each lane received an actual MAX-effort continuation or final review. The worker API did not support changing running workers in place. Latest palette steering, F35.1: Theseus blue is primary, yellow is for comparisons/secondary items, and the stage and most type remain neutral. This supersedes the intermediate all-yellow interpretation. The geometry reference sheet uses neutral outlines and secondary yellow dimensions.

## What is ready, and what remains open

| Package | Useful result | Evidence boundary |
|---|---|---|
| Wheel test group | Four useful named component-mass reports, two additional uncertain/incompatible reports, source registry, all 39 recorded search queries, and a reproducible weighing protocol. | No physical weighing here. None currently satisfies every material and common-boundary qualification. Group mean and savings remain null; F27's requested empirical group stays open. |
| X2F / clearances / reinforcing arms | Actual published EloShapes top and side SVG paths recovered from its rendered DOM, with raw-preserved paths and nominal millimetre scaling. | A published outline is not manufacturer CAD or a dimensional tolerance survey. Its small top-width discrepancy from nominal specifications is explicit. The personal broken-arm photographs were absent and were not inspected. |
| Mechanics and energy | Standalone Python calculations, deterministic JSON, detailed claim corrections and sources. | Calculation checks do not establish Theseus latency, battery life, shell performance or player advantage. Some inherited material inputs remain explicitly conditional. |

## Minimal changes for the implementation chat

Use scene/function IDs as anchors. The main checkout is evolving; line numbers and the context snapshot are observations, not a frozen source version. Several evidence boundaries are already present in the revamp; retain them and apply only the missing corrections in the implementation lane, then perform its normal render and feedback checks.

1. **`rv_wheel`, `deck/revamp/60-surface.js`: resolve the mass boundary before comparing bars.** The stated `508.5 mm³ × 1.77 g/cm³` gives **0.900045 g of magnesium**. The scene also depicts a POM axle/bushing. List the full rotating assembly—body, tyre if any, axle/pin, rotating magnet, adhesive and finish—or label the number as magnesium-body-only if that is its scope. This is an accounting gap, not a measured mass error. PMM's 1.0 g maker specification describes a polymer pin too. See the wheel evidence.

2. **Keep `F27.wheel.1` / `.2` pending.** Source cards may show M3 **3.2 g**, Ghero Pro **3.77 g**, X11 **approximately 2.5 g**, and OP1 **1.8 g** with owner-report/seller-claim labels and the documented uncertainty. Do not average them, call them an industry test group, or calculate savings against an unweighed Theseus assembly. The G502X **6.9 g** removable tilt/free-scroll mechanism has a larger assembly boundary and stays separate. A5 **“1.5g?”** remains a lead. The JSON and protocol state what must be measured to close the gap.

3. **`rv_density` / `rvi_outline`, `deck/revamp/10-intro.js`: replace the schematic with the recovered published paths at one physical scale.** Official X2F CrazyLight dimensions are **87.5 × 61.1 × 31.6 mm**. The raw EloShapes top/side paths are preserved; nominal scaling is a separate documented transform. Keep silhouette coordinates and dimension leaders in the same transform; at 3.1 px/mm, nominal width is **189.41 px**, whereas the observed current width leader spans 319 px. Verify leader endpoints against the actual outline. Call this a sourced published outline, not manufacturer CAD or a measured tolerance map. The one-owner 29.5 g mouse sample is separate from wheel mass and lies within the maker's 29 ±2 g specification.

4. **`rv_direct_drive`, `deck/revamp/20-clicks.js`: retain the approved phrase with visible motion assumptions.** At 20°, `cos θ = 0.9396926`; alignment gives **94.0% → 100% along the axis**, a **6.4178% relative force-component gain**. Equal travel and equal prescribed trigger-path speed give **6.0307% sooner** for that local actuation segment. An alternative constant-force, zero-resistance acceleration model gives **3.0623% sooner**. Show “same travel, same press speed, ideal model” beside the approved 6% phrase. Neither is measured reaction time or press-to-PC latency. Distinguish force arrows from motion arrows.

5. **`rv_no_lights`, `deck/revamp/50-electronics.js`: retire the implied Razer energy breakdown.** The inherited 18% / +21% arithmetic uses assumed optical test pulses and currents at different voltage rails. It is not a measured Viper share. Keep “mechanical clicks need no light emitter”; the Razer “almost half” attribution remains Brock's report of staff online, without a located public quotation. A Hall replacement is not zero power and does not prove doubled runtime.

6. **Put the Hall operating mode beside its current.** TI's TMAG5253 **90.5 µA** is a manufacturer estimate for 50 µs enabled plus **1 ms sleep**, one sensor; the independent 2 mA rectangular model gives **95.26 µA**, with a 1.05 ms cycle. Startup/settling, channels, MCU/ADC and conversion losses must be counted. TMAG3001's very low wake-and-sleep example uses a **5-second interval**; its 1 ms examples draw more. Specify first-scroll wake on a stationary mouse before deriving endurance. Neither part is selected Theseus hardware.

7. **`rv_specific` / `rv_materials` / the beam and triangle scenes: name the structural job.** `E^(1/3)/rho` is a fixed-footprint, thickness-free bending mass index. At equal mass the corresponding bending stiffness scales as `E/rho^3`; cube the index ratio to obtain that stiffness ratio. The 60 × 10 × 3.3 mm classroom beam is **1.9998 g**, with **9.1827×** ideal bending-stiffness change on rotation, versus **3.0303×** equal-stress capacity. Neither is a shell test. A pin-jointed triangle removes a racking mechanism; real members still bend, buckle and depend on supports/joints. Use the final mechanics report's corrected rigidity wording.

8. **Keep the matched nominal battery example, with package boundaries.** The EEMB pouch and Boying cylinder are both **350 mAh / 3.7 V**, listed at about **7 g / 9 g**. Different minimum capacities and bare/finished-pack boundaries remain visible. This is one 2 g example, not a universal lithium-polymer advantage or a selected Theseus battery. **200 h at 1khz remains a design target.**

9. **Do not close `clk_pomtune` or `shcArms` from generic schematics.** A measured rail gap requires a named product, sample/revision, datums, instrument and relevant load state. A faithful break illustration needs the actual arm form/reference and a separately qualified scale. The absent personal photo cannot be described as inspected. Use the geometry report's exact confirmed/open findings.

## Package entry points

- [Wheel evidence](C:/Users/brock/Documents/Codex/2026-11-05/theseus-independent-reference-lab/outputs/theseus-independent-resources/wheel/wheel-evidence.md) and [machine-readable wheel reports / search / protocol](C:/Users/brock/Documents/Codex/2026-11-05/theseus-independent-reference-lab/outputs/theseus-independent-resources/wheel/wheel-test-group.json).
- [Geometry evidence](C:/Users/brock/Documents/Codex/2026-11-05/theseus-independent-reference-lab/outputs/theseus-independent-resources/geometry-evidence.md), [top/side reference sheet](C:/Users/brock/Documents/Codex/2026-11-05/theseus-independent-reference-lab/outputs/theseus-independent-resources/reference-geometry/x2f-crazylight-reference-sheet.svg), [nominal-mm top](C:/Users/brock/Documents/Codex/2026-11-05/theseus-independent-reference-lab/outputs/theseus-independent-resources/reference-geometry/x2f-crazylight-top.mm.svg), [nominal-mm side](C:/Users/brock/Documents/Codex/2026-11-05/theseus-independent-reference-lab/outputs/theseus-independent-resources/reference-geometry/x2f-crazylight-side.mm.svg), and [normalized commands](C:/Users/brock/Documents/Codex/2026-11-05/theseus-independent-reference-lab/outputs/theseus-independent-resources/reference-geometry/x2f-crazylight.normalized.json).
- [Mechanics and energy corrections](C:/Users/brock/Documents/Codex/2026-11-05/theseus-independent-reference-lab/outputs/theseus-independent-resources/mechanics-energy/claims-review.md), [calculation script](C:/Users/brock/Documents/Codex/2026-11-05/theseus-independent-reference-lab/outputs/theseus-independent-resources/mechanics-energy/calculate.py), and [generated values](C:/Users/brock/Documents/Codex/2026-11-05/theseus-independent-reference-lab/outputs/theseus-independent-resources/mechanics-energy/mechanics-energy.json).
- [Interactive Direct Drive reference](C:/Users/brock/Documents/Codex/2026-11-05/theseus-independent-reference-lab/outputs/theseus-independent-resources/mechanics-energy/direct-drive-demo.html): standalone HTML/SVG/JavaScript, neutral stage, two physical models, one shared clock, scrubbing and threshold states. Numerical/control checks passed; browser rendering remains unverified after the local-file navigation block.

The package reports place supporting primary-source URLs beside their claims. Source claims, firsthand reports, estimates, conditional calculations and Theseus targets remain distinct. A successful bundle check is not a source-truth or hardware-acceptance test.

## Verification and reproducibility

Parent verification reproduced the mechanics JSON byte-for-byte from the final Python script, with all 11 built-in numerical/units/round-trip checks passing. It separately ran the geometry generator's read-only `--check`: all six generated geometry files match, both original DOM path fingerprints match, and normalized command round-trips pass. MAX package reviews provide additional evidence and their actual limits in their validation notes.

The lead also ran the delivered independent mechanics audit (**85 assertions**, including numerical strain-energy integration) and the delivered offline demo audit (**107 assertions** for the two models, clock, thresholds and controls). Both passed. The review-time 390 count additionally included preservation comparisons against the incoming artifact; the portable delivered audit is the 85-assertion version. Exact executed checks and limits are recorded in [parent-verification.json](C:/Users/brock/Documents/Codex/2026-11-05/theseus-independent-reference-lab/outputs/theseus-independent-resources/parent-verification.json).

Reproduce the mechanics package with Python 3, standard library only:

```powershell
python .\mechanics-energy\calculate.py --output .\mechanics-energy\mechanics-energy.json --check
python .\mechanics-energy\verify.py
node .\mechanics-energy\verify-demo.cjs
```

Check the geometry package without modifying its files, then verify bundle packaging:

```powershell
python .\reference-geometry\generate_geometry.py --check
python .\verify_bundle.py
```

The bundle verifier checks required files, all JSON for valid finite values/duplicate keys, Python syntax, pure-vector SVG dependencies and local Markdown targets. It writes [bundle-validation.json](C:/Users/brock/Documents/Codex/2026-11-05/theseus-independent-reference-lab/outputs/theseus-independent-resources/bundle-validation.json) and the [full manifest](C:/Users/brock/Documents/Codex/2026-11-05/theseus-independent-reference-lab/outputs/theseus-independent-resources/RESOURCE-MANIFEST.json).

The browser safety review rejected opening the local demo's `file:` URL and prohibited alternate routes. That block was respected. Offline JavaScript/model/control checks do not substitute for visual or real-browser interaction verification. No final-deck rendering or acceptance is claimed by these resources.

The source-context snapshot records the read-only files inspected near the start of this lane. The main worktree was active, so a later file may differ. This lane did not run its deck build, render its unfinished film, change its rating/acceptance ledger, or publish a competing preview.

## Exact file inventory

29 files: 27 content files plus the generated manifest and validation report. The manifest excludes itself and the validation report to avoid circular hashing. Every content file is listed below with its exact local path.

- [RESOURCE-HANDOFF.md](C:/Users/brock/Documents/Codex/2026-11-05/theseus-independent-reference-lab/outputs/theseus-independent-resources/RESOURCE-HANDOFF.md) — consolidated integration actions and evidence boundaries.
- [RESOURCE-MANIFEST.json](C:/Users/brock/Documents/Codex/2026-11-05/theseus-independent-reference-lab/outputs/theseus-independent-resources/RESOURCE-MANIFEST.json) — SHA-256 and exact bytes for the 27 content files.
- [bundle-validation.json](C:/Users/brock/Documents/Codex/2026-11-05/theseus-independent-reference-lab/outputs/theseus-independent-resources/bundle-validation.json) — packaging and syntax verification result.
- [context-source-snapshot.json](C:/Users/brock/Documents/Codex/2026-11-05/theseus-independent-reference-lab/outputs/theseus-independent-resources/context-source-snapshot.json) — read-only initial source-context hashes.
- [parent-verification.json](C:/Users/brock/Documents/Codex/2026-11-05/theseus-independent-reference-lab/outputs/theseus-independent-resources/parent-verification.json) — lead's executed numerical and geometry checks.
- [verify_bundle.py](C:/Users/brock/Documents/Codex/2026-11-05/theseus-independent-reference-lab/outputs/theseus-independent-resources/verify_bundle.py) — standalone integrity verifier; regenerates manifest and check report.
- [geometry-evidence.md](C:/Users/brock/Documents/Codex/2026-11-05/theseus-independent-reference-lab/outputs/theseus-independent-resources/geometry-evidence.md) — published outline recovery, sources and unresolved geometry evidence.
- [wheel/wheel-test-group.json](C:/Users/brock/Documents/Codex/2026-11-05/theseus-independent-reference-lab/outputs/theseus-independent-resources/wheel/wheel-test-group.json) — qualified reports, 39 queries, exclusions, null group statistics and weighing protocol.
- [wheel/wheel-evidence.md](C:/Users/brock/Documents/Codex/2026-11-05/theseus-independent-reference-lab/outputs/theseus-independent-resources/wheel/wheel-evidence.md) — wheel evidence and assembly-boundary correction.
- [wheel/FINAL-VALIDATION.md](C:/Users/brock/Documents/Codex/2026-11-05/theseus-independent-reference-lab/outputs/theseus-independent-resources/wheel/FINAL-VALIDATION.md) — MAX final source and data review.
- [mechanics-energy/calculate.py](C:/Users/brock/Documents/Codex/2026-11-05/theseus-independent-reference-lab/outputs/theseus-independent-resources/mechanics-energy/calculate.py) — standalone standard-library calculation generator.
- [mechanics-energy/mechanics-energy.json](C:/Users/brock/Documents/Codex/2026-11-05/theseus-independent-reference-lab/outputs/theseus-independent-resources/mechanics-energy/mechanics-energy.json) — generated numerical values, assumptions, units and sources.
- [mechanics-energy/claims-review.md](C:/Users/brock/Documents/Codex/2026-11-05/theseus-independent-reference-lab/outputs/theseus-independent-resources/mechanics-energy/claims-review.md) — claim corrections and saleable wording.
- [mechanics-energy/direct-drive-demo.html](C:/Users/brock/Documents/Codex/2026-11-05/theseus-independent-reference-lab/outputs/theseus-independent-resources/mechanics-energy/direct-drive-demo.html) — interactive code-native physical reference, with model assumptions.
- [mechanics-energy/verify.py](C:/Users/brock/Documents/Codex/2026-11-05/theseus-independent-reference-lab/outputs/theseus-independent-resources/mechanics-energy/verify.py) — independent mechanics audit, 85 assertions and deterministic reproduction.
- [mechanics-energy/verify-demo.cjs](C:/Users/brock/Documents/Codex/2026-11-05/theseus-independent-reference-lab/outputs/theseus-independent-resources/mechanics-energy/verify-demo.cjs) — offline JavaScript/control audit, 107 assertions.
- [mechanics-energy/FINAL-VALIDATION.md](C:/Users/brock/Documents/Codex/2026-11-05/theseus-independent-reference-lab/outputs/theseus-independent-resources/mechanics-energy/FINAL-VALIDATION.md) — MAX review corrections, commands and visual-QA limit.
- [reference-geometry/source-capture.json](C:/Users/brock/Documents/Codex/2026-11-05/theseus-independent-reference-lab/outputs/theseus-independent-resources/reference-geometry/source-capture.json) — preserved public SVG path data and browser fingerprints.
- [reference-geometry/generate_geometry.py](C:/Users/brock/Documents/Codex/2026-11-05/theseus-independent-reference-lab/outputs/theseus-independent-resources/reference-geometry/generate_geometry.py) — offline geometry generator and read-only checker.
- [reference-geometry/x2f-crazylight-top.raw.svg](C:/Users/brock/Documents/Codex/2026-11-05/theseus-independent-reference-lab/outputs/theseus-independent-resources/reference-geometry/x2f-crazylight-top.raw.svg) — original published top contour and aspect.
- [reference-geometry/x2f-crazylight-side.raw.svg](C:/Users/brock/Documents/Codex/2026-11-05/theseus-independent-reference-lab/outputs/theseus-independent-resources/reference-geometry/x2f-crazylight-side.raw.svg) — original published side contour and aspect.
- [reference-geometry/x2f-crazylight-top.mm.svg](C:/Users/brock/Documents/Codex/2026-11-05/theseus-independent-reference-lab/outputs/theseus-independent-resources/reference-geometry/x2f-crazylight-top.mm.svg) — top contour mapped to official nominal millimetres.
- [reference-geometry/x2f-crazylight-side.mm.svg](C:/Users/brock/Documents/Codex/2026-11-05/theseus-independent-reference-lab/outputs/theseus-independent-resources/reference-geometry/x2f-crazylight-side.mm.svg) — side contour mapped to official nominal millimetres.
- [reference-geometry/x2f-crazylight.normalized.json](C:/Users/brock/Documents/Codex/2026-11-05/theseus-independent-reference-lab/outputs/theseus-independent-resources/reference-geometry/x2f-crazylight.normalized.json) — normalized commands, source hashes and physical transforms.
- [reference-geometry/x2f-crazylight-reference-sheet.svg](C:/Users/brock/Documents/Codex/2026-11-05/theseus-independent-reference-lab/outputs/theseus-independent-resources/reference-geometry/x2f-crazylight-reference-sheet.svg) — neutral top/side sheet with secondary yellow dimensions.
- [reference-geometry/mechanical-reference-gaps.json](C:/Users/brock/Documents/Codex/2026-11-05/theseus-independent-reference-lab/outputs/theseus-independent-resources/reference-geometry/mechanical-reference-gaps.json) — clearance/arm sources, search boundary and null dimensions.
- [reference-geometry/measurement-protocol.md](C:/Users/brock/Documents/Codex/2026-11-05/theseus-independent-reference-lab/outputs/theseus-independent-resources/reference-geometry/measurement-protocol.md) — competitor measurement and faithful-reference acquisition protocol.
- [reference-geometry/measurements-template.csv](C:/Users/brock/Documents/Codex/2026-11-05/theseus-independent-reference-lab/outputs/theseus-independent-resources/reference-geometry/measurements-template.csv) — header-only measurement record, no invented readings.
- [reference-geometry/README.md](C:/Users/brock/Documents/Codex/2026-11-05/theseus-independent-reference-lab/outputs/theseus-independent-resources/reference-geometry/README.md) — outline integration, axes, scaling and reproduction instructions.
