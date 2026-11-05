# Theseus — the independent Codex revamp

A new **47-scene code-native film** built from the imported Claude handoff, not a succession of small patches to its old sequence. The story starts with **zero compromises**, shows the problem before the correction, and connects the mechanical behavior to control, feel, wear, battery life or repair. No AI-generated images are used.

## Open it

- Live preview: https://brockliddicoat.github.io/theseus-codex-preview/
- Local self-contained 2D film: `deck/dist/index.html`.
- Exact deployed build, artifact identity and public verification: [PUBLICATION.md](handoff/codex/PUBLICATION.md).
- Source branch: `codex/theseus-revamp-2026-11-05`, isolated from Claude’s branch.
- Imported baseline: `7d8f926ebb8fca1653b3d30509ef6f8f60ac093e`.

## The look and motion

Theseus is blue. Yellow is sparse and secondary, mainly comparisons. The stage, type and chapters are black/grey/white; restrained red shows faults. The original Inter fonts and deliberately quiet grid remain. Gradients are limited to selected Theseus headline type/numbers.

Motion now performs the explanation: a loaded ruler unloads before rotating; a square racks without changing straw lengths before receiving its diagonal; a chain flips into an arch; material is removed and relocated before reloading; the GT01 housing rotates onto a fixed board; the SPDT contact moves NC → open → NO; guides and uniform pads assemble before an off-centre press; lens height blurs and recovers; a battery plug disconnects before the battery lifts. Before states and net changes stay visible.

## Feedback integrity

[FEEDBACK.md](FEEDBACK.md) preserves F0–F33 and later direct steering. [The source audit](handoff/codex/FEEDBACK-AUDIT.md) inventories the supplied K1–K8 briefs, notes and missing references. [The coverage ledger](handoff/codex/FEEDBACK-COVERAGE.md) traces all **114 ratings / 100 verbatim notes / 283 clause records** to an implementation response, an explicit pending boundary, or a deliberate removal/deferment.

**283 mapped clauses are not 283 accepted features.** The independent [final feedback review](handoff/codex/FINAL-FEEDBACK-REVIEW.md) caught real omissions: the missing failure-margin lesson, incorrect partial states, cross-scene feedback lookup, stale replacement IDs and overstated coverage. Those source-level defects were corrected and checked. Missing empirical data and user-deferred designs remain open. Historical DONE/archive labels were never taken as fresh proof.

The player shows original notes beside responses, links to the scene where a shared clause is addressed, and lets Brock reopen a clause. Ratings and text edits are browser-local, with JSON export/import; no cloud-sync claim. Rating/note attribution is bound to the slide being edited. Revisions are explicit; a palette/text tweak does not auto-archive feedback.

## Actual hardware carried through

F30.25’s approved symmetric board plan was built in both power-switch variants, with common-depth notches/chamfers/fillets, the moved USB socket, mirrored mounting holes, moved sensor/MCU/PMIC, restored artwork, and traces retained. Lens, aperture and sensor dots move coherently. GT01 walls are thicker and inferred from the reference rather than misrepresented as datasheet dimensions. The film draws the actual generated A/B vectors.

This is presentation/design geometry, **not fabrication approval**. Current relocated routing has 718 electrical DRC issues. The requested shorter rear board notch overlaps the old battery-front plan envelope by 3.720 mm². Final battery fit and centre balance are unresolved. See [HARDWARE.md](handoff/codex/HARDWARE.md); old DRC-zero statements are historical only.

## Research and independent lanes

- Exact published EloShapes X2F top/side SVG geometry is integrated, fitted to its nominal bounding box and labelled not measured CAD.
- The [independent resource pack](research/codex-resources/RESOURCE-HANDOFF.md) contains reproducible code-native geometry, mechanics/energy calculations and the unresolved wheel-weighing protocol.
- Main implementation and final review workers used GPT-6.1 Sol at max after Brock’s explicit instruction; earlier workers had used high. No Astra worker was silently substituted in this Sol lane.
- The separate comparison chat rendered the accessible supplied Opus baseline, not an inaccessible newer Opus revamp. Its tested fixes were incorporated or retired when the active builder independently supplied them. No claim of beating unseen Opus output is made.
- Brock separately authorized an **Astra ultra** lead / **Astra max only** worker experiment, starting from the same original baseline in its own checkout/site. Its full brief is [ASTRA-ULTRA-ASSIGNMENT.md](handoff/codex/ASTRA-ULTRA-ASSIGNMENT.md). It must not overwrite this Sol build.

## Important remaining boundaries

The 29.31 g mass, 200 h at 1khz, $189 price and Theseus latency figures are design targets, not prototype measurements. The 120 MPa margin is a labelled linear-model extrapolation, excluding buckling/contact, not mouse failure capacity. Mechanical projection is not measured aim improvement. Hall sensing is not zero-current. The 0.90 g wheel figure excludes its separately budgeted POM axle.

No measured retail plastic/rubber wheel average or matched competitor guide-clearance dataset was invented. Exact personal broken-arm photos were absent. Net cured coating mass remains unweighed. The final grip map/guide form still needs Brock’s visual review. Real tensioner dimensions remain unknown. Bottom cover, side seam, and numerical first-fit/rethread studies remain deferred as requested.

## Reproduce

From this repository, use Python 3 in UTF-8 mode and Node with Playwright/Chromium available:

```powershell
python -X utf8 deck/tools/build_revamp.py --out=review.html
node deck/tools/check-film.cjs deck/dist/review.html deck/qa/my-review
$env:RV_HTML='deck/dist/review.html'
node deck/tools/review-smoke.cjs
node deck/tools/review-smoke.cjs --panels-only
node deck/tools/review-smoke.cjs --coverage-only
node deck/tools/check-archive.cjs deck/dist/review.html deck/qa/my-archive
```

`NODE_PATH` must point to the local Playwright package when it is not installed in the current project. The full optional 3D bundle is rebuilt with `node 3d/integration/build.mjs` after installing the pinned 3D dependencies. Original 3D/source workflows remain in their READMEs. The default 2D film embeds its fonts and drawings and is playable without the optional 3D assets.

Publish the **exact tested artifact**, not a rebuild of changing source:

```powershell
& deck/tools/publish_preview.ps1 -VerifiedReport deck/qa/my-review/report.json -Message 'Update checked Theseus preview'
```

The helper verifies the tested HTML hash and refuses failed layout reports. Confirm the Pages build, served build manifest and real browser runtime before reporting a deployment live. An old pre-updater tab needs a fresh cache-busted URL once; current players show new-build notices and flush local review writes before refresh.

## The new film

| scene | title | replaces original scenes |
| --- | --- | --- |
| `rv_cover` | Zero compromises. | `cover`, `targets`, `targets2`, `ntr_stats` |
| `rv_tradeoffs` | Flagships still ask you to choose. | `flagships`, `market`, `pricefront` |
| `rv_density` | Less mouse isn't the only way. | `ntr_density`, `ntr_sizewt` |
| `rv_density_rank` | Keep the rivals that beat the story. | `ntr_densrank` |
| `rv_inertia` | The part you have to stop. | `zerograms`, `targets2` |
| `rv_weight_truth` | A weight you can actually buy. | `weightgap`, `thesis`, `budget`, `targets2` |
| `rv_direct_drive` | Direct Drive Actuation | `clicks`, `arc`, `clk_wedge` |
| `rv_rear_cutouts` | Straight rear trigger cutouts | `cutouts`, `shlsheet1` |
| `rv_front_contact` | A flat front stop. A steady click. | `clk_front`, `grooves` |
| `rv_shoulder_seams` | Keep seams out of your grip | `clk_front`, `shlsheet1` |
| `rv_tensioner` | Bridge click tensioning | `tensioner`, `clk_tenmat` |
| `rv_dual_rail` | Dual rail main clicks | `anchors`, `clk_pomtune` |
| `rv_spdt` | Single pole, double throw | `clk_spdt`, `latency`, `clk_debounce`, `clk_wait`, `clk_methods`, `clk_switch2`, `clk_switch` |
| `rv_binning` | Provable switch binning | `clk_switch2` |
| `rv_hotswap` | A switch should be replaceable | `clk_hotswap` |
| `rv_sidebuttons` | Main-switch feel. On the side. | `sidebuttons` |
| `rv_sensor_camera` | Your sensor is a camera | `glide`, `gld_camera`, `gld_corr`, `gld_blur`, `focus` |
| `rv_sensor_support` | Support the lens, not just the corners | `gld_under`, `dots`, `gld_sag`, `gld_module`, `gld_sheet` |
| `rv_sensor_choice` | The sensor is only the start | `sensor`, `gld_reports` |
| `rv_thin_wall` | Shape buys more than thinning. | `materials`, `thinwall`, `shlScatter` |
| `rv_specific` | Choose the material for the job. | `shlSpecific` |
| `rv_hotspots` | Putting that weight to work | `shlHotspot`, `shlMargin`, `shlWork` |
| `rv_triangles` | A triangle cannot fold like a hexagon. | `lattice`, `shlDeterminate` |
| `rv_light_structure` | The lighter it gets, the more shape matters. | `shlThin`, `shlPick`, `shlNoPick`, `shlShell3d`, `shlLattice3d` |
| `rv_arches` | Turn a hanging chain upside down. | `shbArches`, `shbPress`, `shbThrust`, `shbBend` |
| `rv_fibres_fillets` | Give the fibres a clean path. | `shbFibres`, `fillet`, `filletsize`, `shbFlow`, `shbWidth`, `shbMill`, `shbMillDirect`, `shbTol` |
| `rv_whole_pcb` | Use the structure you already carry. | `shlPcbRib`, `shcCarry`, `shcArms`, `shlStructs` |
| `rv_tolerance` | Tolerance stack-up | `tolerance` |
| `rv_contact` | Stop the creak at the contact | `grind` |
| `rv_shape` | Newtonian shape analysis | `shapecard`, `shp_newton`, `grooves`, `shbSides` |
| `rv_fit` | Fit comes before a weight record | `size`, `emg` |
| `rv_balance` | Balance the mass around the grip | `mass` |
| `rv_board` | One board. No assembly maze. | `eleccard`, `onechip`, `elc_oneside`, `elecsheet1`, `ownboard` |
| `rv_power` | Keep the battery. Lose the baggage. | `cells`, `power`, `elc_pmic`, `elc_charge`, `elc_safe`, `frontier` |
| `rv_radio` | Give the antenna room to work. | `elc_module`, `antenna`, `onechip` |
| `rv_firmware` | A fresh position, not an old packet. | `motion`, `framesync`, `secondshot`, `elc_rate`, `latency`, `clk_methods`, `clk_wait` |
| `rv_web` | Set the mouse. Close the tab. | `software`, `gld_soft`, `motion`, `elc_sheet2` |
| `rv_no_lights` | Spend power on the input. | `srf_encoder`, `clk_switch`, `elc_sheet2` |
| `rv_cable` | Charging should not change the glide. | `cable`, `elc_tear`, `elc_twist`, `elc_lay`, `elc_flex` |
| `rv_wiring` | Three wires. Three reasons. | `elc_tear`, `elc_twist`, `elc_lay`, `elc_flex`, `ownsheet1` |
| `rv_coating` | Thin film. Tough surface. | `surfacecard`, `coating`, `srf_texture`, `srf_weight`, `srf_uv`, `srf_twotone` |
| `rv_grip` | Grip without the grip tape. | `grip`, `srf_gripmap`, `srf_tape` |
| `rv_wheel` | Less wheel. Same control. | `wheel` |
| `rv_inserts` | Open it. Keep the same fit. | `own_insert`, `own_life`, `ownsheet1` |
| `rv_screws` | A head worth reopening. | `ownscrew`, `ownsheet1` |
| `rv_repair` | Replace the part. Not the mouse. | `repair`, `ownbatt`, `ownboard`, `box`, `clk_hotswap`, `ownsheet1`, `owncard` |
| `rv_close` | Zero compromises. | `close`, `ntr_stats`, `targets`, `targets2` |
