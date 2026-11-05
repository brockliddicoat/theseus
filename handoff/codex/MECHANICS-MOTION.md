# mechanics causal-motion handoff — 2026-11-05

## outcome

All twelve owned click/glide scenes now unfold as finite, deliberate mechanical demonstrations. The old repeated `rvCycle` press/fade treatment is gone from these scenes. Settle times are 20–22 seconds, with the bad case retained and the fixed case held under load where that is the meaningful comparison. The header exists on the first frame. Paragraphs remain at least 27 stage pixels; smaller type is reserved for labels, units and evidence footnotes.

Owned application files: `deck/revamp/20-clicks.js`, `deck/revamp/30-glide.js`, `deck/revamp/coverage-mechanics.json`. Shared source helpers and the original film were not edited in this pass. Build tools normally regenerate shared build/merged-coverage outputs. No commit, push, publish, Claude contact, image generation or fetched raster asset was used by this lane.

Colors use the shared `C.hero` / `C.heroText` tokens. The parent’s latest primary-blue / secondary-yellow decision therefore flows through without hardcoded chapter colors. Red is restricted to explanatory faults, clipped data and defocus.

## what actually moves

| Scene | Causal demonstration | Settle |
| --- | --- | ---: |
| `rv_direct_drive` | Pointer presses the source-detailed upright mechanism; the cap loads its guide sideways. An extra-fit wedge is shown and removed. The accurate GT01 housing physically rotates and lands on the same fixed flat PCB, then receives a separate aligned press. Sideways percentage follows the residual angle rather than showing zero before alignment. | 21 s |
| `rv_rear_cutouts` | Full mouse, wheel and split provide context; the camera zooms into those same trigger arms and screw blocks. The proposed cut straightens and its supports slide onto the switch axes. The loaded bad cap actually rotates; unequal versus equal press arrows remain together. | 21 s |
| `rv_front_contact` | Left press lands on the left side of a deep-grooved nose; the press releases, changes side and lands on the other edge. The proposed groove shallows along its length, not just across a section, then lands against the same fixed lip as a flat line. Contact math prevents lip interpenetration. | 21 s |
| `rv_shoulder_seams` | A fixed monochrome grip meets the proud side-facing edge as the trigger drops. The proposed wall changes its clearance before a separate press. Large source-derived shoulder sections and a whole-mouse section key keep the location explicit. | 20 s |
| `rv_tensioner` | The stiff flat arm is loaded first. The proposed crown forms, one screw clamps its block and the bridge is then pressed. Force bars reveal in that order; the flat/composite comparison remains visible. | 21 s |
| `rv_dual_rail` | Off-centre loading actually rolls the single-guide cap. Fixed guide walls slide into position, POM pads enter, identical posts land and the guided cap is pressed on both sides without rolling. | 22 s |
| `rv_spdt` | A local derivative of the original detailed `swMM` retains its physical geometry while continuously moving the actual leaf/rivet through NC release, open transit and NO landing. That same state drives the enlarged contact, numbered state and timeline marker. | 20 s |
| `rv_hotswap` | A soldering iron approaches an actual soldered pin on the left. The right spring jaws visibly grip, open and release before the switch lifts straight out. All three jaws and insertion axes derive from `SWG.pins`. | 20 s |
| `rv_sidebuttons` | The living-hinge cap bends beyond the clicked mini switch. A 2.4 mm main-post contact end and 0.6 mm POM dimension match-cut into the side guide; the detailed shell-held full-size switch then receives its own loaded press. | 21 s |
| `rv_sensor_camera` | The detailed lens clips into its board before the frames become sharp. The optics move too high and blur, return to focus, move right while matching pad detail shifts left, move too low and blur, then recover. Board, module, pegs and optical elements retain the original source geometry. | 22 s |
| `rv_sensor_support` | Corner dots land on integrated ledges. The lens carrier and its attached dots snap into the actual lens position. A subsequent press traces the shorter load route through the lens-side supports; the unsupported comparison stays visibly sagged. | 22 s |
| `rv_sensor_choice` | One oversized raw burst grows from +1,000 to +3,200 and feeds two outputs on the same scale. The 12-bit bar stops at +2,047 while a visible +1,153-count loss grows; 16-bit retains the full +3,200. | 21 s |

The camera’s earlier browser stalls were traced to applying canvas blur separately to hundreds of yarn primitives. The same code-drawn weave is now cached as an internal canvas and blurred once per exposure. This is code-generated art, not an external image asset or a replacement of the detailed lens geometry.

## exact evidence

The two review runs copied and tested the **same immutable HTML**, SHA-256:

`0a42aa148d7fc6f38f7acce4455f9e44d465b750d6ce2eedf41a0d0d0a969d31`

- Preview build: `deck/dist/motion-click.html`.
- Automated temporal record: `deck/qa/mechanics-motion/report.json` and its `tested-index.html`.
- **120 samples** across these twelve scenes: start, 1.5, 3, 5, 7, 9, 12, mid, settle and settle + 2 seconds. **0 issue frames, 0 runtime errors.** Start/mid/settle PNGs are saved.
- Event record: `deck/qa/mechanics-motion-events/report.json` and its `tested-index.html`.
- **44 event-specific PNGs**, including both contact sides, assembly states, loaded frames, actual SPDT transit, released claws, high/low blur and count clipping. **0 browser errors.** The exact filenames are in the manifest; use scene IDs rather than memorized slide indices.
- Viewed all four temporal contact sheets and full-resolution critical frames. Further visual fixes included the enlarged shoulder/side sections, grip position, side overtravel copy, force stem clearance and the camera’s unassembled-lens state.
- Visible-state/pixel checks: `deck/qa/mechanics-motion-events/proof.json`.
  - Asserted NC closed → opening counted during actual leaf transit → NO landed.
  - Asserted +1,000 fits and +3,200 becomes +2,047 / 1,153 lost in 12-bit while +3,200 survives in 16-bit.
  - Found the identical drawn frame-B patch at **−40 px** relative to frame A; mean absolute channel difference **0.0005833** on the selected unbordered patch.
  - Confirmed the high/low graphic becomes blurred and the calibrated graphic returns to the same higher edge contrast. These are pixel checks of this explanation, **not sensor-sharpness measurements**.
  - Asserted both JavaScript sources, normalized only for line endings/BOM, are contained in the tested HTML.

Source SHA-256 values recorded in `proof.json`:

| File | SHA-256 |
| --- | --- |
| `deck/revamp/20-clicks.js` | `2f8624c511c0b76f53e254fc7948c96f920d3e6a95fd94065263bd650712670f` |
| `deck/revamp/30-glide.js` | `90ea58893a71b10c1763c706c966a8130bba277aa22bffef106d411f1efb72d6` |
| `deck/revamp/coverage-mechanics.json` | `553047745bc9278e92df8dada2294b9891b3070a11e4d262cf430c4445004eb2` |

The shared film had **47 slides** at this exact build because other lanes were integrating concurrently. This lane still owns twelve. Older index-numbered screenshots that were no longer referenced by the current manifests were moved to each QA folder’s `earlier-builds/`; current top-level numbered PNGs match the current manifests.

## reproducibility

Use the installed Node dependencies:

```powershell
$env:NODE_PATH='C:\Users\brock\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules'
python -X utf8 handoff/codex/build-mechanics-coverage.py
python -X utf8 deck/tools/build_revamp.py --out motion-click.html
node deck/tools/check-film.cjs deck/dist/motion-click.html deck/qa/mechanics-motion rv_direct_drive rv_rear_cutouts rv_front_contact rv_shoulder_seams rv_tensioner rv_dual_rail rv_spdt rv_hotswap rv_sidebuttons rv_sensor_camera rv_sensor_support rv_sensor_choice
node handoff/codex/check-mechanics-motion.cjs deck/dist/motion-click.html deck/qa/mechanics-motion-events
python -X utf8 handoff/codex/make-mechanics-motion-proof.py
```

Both browser checks use one page and run sequentially. `check-mechanics-motion.cjs` uses event times rather than assuming that a cycle happens to be pressed at `mid`. `implement-spdt-motion.py` reproduces the scoped detailed switch derivative without editing shared `swMM`.

## boundaries that remain open

- The coverage map still has **86 exact F27 clauses and one `open-evidence` clause**: `F27.clk_pomtune.3`. No matched rival guide-clearance dataset was found. Example POM factory steps are not invented competitor tolerances.
- F31.4 side-guide final acceptance is still pending the user’s review.
- F12.5 tensioner dimensions remain unknown; bridge force and deformation are labelled illustrations, not physical tests.
- 70 µs is an electrical target, not measured PC latency. SPDT transit is deliberately slowed logic, not a timing trace. Final switch SKU is undecided.
- The 0.2 mm preferred optical window comes from the design brief. The drawing and blur are explanatory, not captured sensor imagery.
- PAW3970/Viper relation remains suspected; access after exclusivity is a plan, not confirmed supply. Publicly named specs are attributed to Razer maker claims, not an unavailable PAW3970 datasheet.
- Deformation is exaggerated. No simulated shot advantage, unsupported endurance result, fabricated skate grams or measured rival fault was introduced.
- Electronics/binning/software clauses listed in the coverage file remain integration responsibilities outside this lane.

This handoff establishes implementation and exact rendering evidence. It does not turn design proposals into physical validation or final user approval.
