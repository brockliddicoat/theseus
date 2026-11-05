# mechanics safe checkpoint — 2026-11-05

**Historical transition checkpoint.** The subsequent MAX pass completed the causal-motion rebuild and immutable temporal rerender. Current implementation, 120 clean automated samples, 44 event frames, pixel proof and remaining design/evidence boundaries are in [MECHANICS-MOTION.md](MECHANICS-MOTION.md). The earlier record below is preserved rather than rewritten as if its checks had already been complete at the transition.

Stopped immediately on root's MAX-only reviewer transition. No commit, publication, push, Claude contact, or AI-image use.

## Source owned and changed

- `deck/revamp/20-clicks.js`: all nine click scenes. Visible **6% SOONER / IDEAL TRAVEL ESTIMATE**; extra-part alignment problem before angled-housing solution. Rear cutout whole-mouse view now includes wheel/centre split, screw-block and bend-axis leaders and unequal/equal press arrows. Front stop is now an oblique grooved solid surface, with longitudinal groove fading, fixed shell lip, computed press-dependent first-contact point and no lip interpenetration at full press. Shoulder section now has grip contact and a whole-mouse section key. Main guides now have a fixed shell, switch end-view, truly identical 2.4-mm posts and identical POM pads; bad cap actually rotates. SPDT has NC/open/NO states, animated contact/timeline, adjustable debounce and honest target language. Hot-swap pins and claws now derive from exactly the same `SWG.pins` positions, and the left switch is actually soldered to a PCB. Side-button art no longer crosses explanatory copy or the win line.
- `deck/revamp/30-glide.js`: all three glide scenes. Camera uses original detailed castellated-module / PCB-window / snap-on-lens drawing helpers. Matching irregular code-drawn texture and moving correspondence patch, high/in-focus/low blur cycle. Corner ledges are connected to rim, mirrored, 23 mm long and filleted; third-dot capacity outlined, two dots fitted. Actual narrow lens body and connected lens-carried ±11.5-mm supports drawn. Sag support points and less-footprint/material trade-off explicit; higher pad pressure distinguished from structural sag. Report example now numerically clips raw counts to +2047 for 12-bit while preserving them for 16-bit, on shared 0–4096 display scale.
- Scoped shared helper `deck/src/10-b-click.js`, **clk_gt01MM only**: preserve outside silhouette and 0.45-mm clear end walls; 0.80-mm bottom skin; back/front holes r0.66/r0.69 at supplied coordinates, 1.70×0.50 slot, supplied triangle and radii.
- `deck/tools/geo2d/extras.py`: skip legacy antenna keepout reflection for `designRevision == F30.25-plan5-approved`.
- `deck/revamp/coverage-mechanics.json`: 86 exact F27 clauses mapped, one explicit `open-evidence` clause. Reproducible with `handoff/codex/build-mechanics-coverage.py`.

## Evidence already obtained

- `python -X utf8 deck/tools/build_revamp.py` passes. Most recent build output: **7,820,773 characters** (other builders were working concurrently; not an immutable snapshot).
- Twelve scene `qa.js` settle: **TOTAL 0**, after fixing the shoulder paragraph overlap.
- Twelve scene `qa.js` mid: **TOTAL 0**.
- Eight-time runtime sweep (`0.02,0.25,0.7,1.5,3,6,11,18`): all click scenes, sensor support, sensor choice `ok`. Camera had two 8-second readiness timeouts during concurrent heavy screenshot jobs; no JS exception was reported.
- Camera rerun at six times with `READY_MS=30000`: **ok**. Front contact/support/choice also `ok` in that rerun.
- Viewed before and after 640-px-wide contact sheets via `view_image`, plus individual 1920×1080 hot-swap, side-button, shoulder and sensor-choice frames. Existing automatic QA missed art/text intrusion and offstage art: fixed by looking, not by relying only on text boxes.
- Screenshot folders: `deck/qa/mechanics-before`, `deck/qa/mechanics`, `deck/qa/mechanics-final`. Last final screenshot job was already running at stop request, session **74664**. It may contain a mixed build because shared `index.html` was rebuilt while pages were being captured.

## Next MAX reviewer checks (do not claim done yet)

1. Freeze/rebuild once and rerun twelve scenes settle/mid/runtime. Last small changes **after** previous full clean text QA: front-contact fixed-lip contact math; camera correspondence sentence; support one-dot-wide text; report bar scale/ticks; hot-swap right stack shifted +40 px to avoid header/art contact; sensor-choice scale reduced 35→26 to stop left-edge clipping; shorter SPDT footer. These need final exact-current rerender, even though previous checks were clean.
2. Capture and **view** settle, mid and a full-press time (e.g. t=8) for current twelve scenes. Default rvCycle can be at rest at both settle and mid, so a separate loaded-time frame is necessary. Root explicitly wants source-accurate mechanical drawings, not only text-box-clean screens.
3. `F27.clk_pomtune.3` is open: no matched rival guide-clearance measurements found in supplied sources. The POM ladder says example factory steps. Do not invent rival tolerance numbers.
4. F31.4 side-guide final acceptance, F12.5 tensioner real dimensions, final switch SKU, physical deflection/latency remain open design or test boundaries, not new film defects silently declared accepted.
5. Check detailed SPDT physical leaf versus enlarged conceptual open-contact timing; `swMM` itself supports only NC/NO while the large logic diagram also shows transit. Footnote says logic illustration, not timing trace. Consider making the physical housing a reference exterior or synchronizing the detailed leaf if this mismatch is confusing.
6. Externally owned coverage: `F27.clk_switch.2-.5` / F31.1 should be in electronics (battery claim attributed via Brock, Hall encoder, no unproven double-efficiency claim); `F27.clk_switch2.3/.4` needs provable binning and Hall binning as proposal; `F27.gld_soft.1/.2` belongs beside web software. Root was notified.

## Commands

PowerShell environment: `NODE_PATH=C:\Users\brock\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules`, `Q=&2d=1`.

IDs: `rv_direct_drive rv_rear_cutouts rv_front_contact rv_shoulder_seams rv_tensioner rv_dual_rail rv_spdt rv_hotswap rv_sidebuttons rv_sensor_camera rv_sensor_support rv_sensor_choice`.

Use `deck/tools/errs.js`, `deck/tools/qa.js`, `deck/tools/shoot.js` (not nonexistent root `tools/shoot.js`). Windows PowerShell does not expand PNG globs passed to Python; collect `Get-ChildItem` full paths then splat to `deck/tools/sheet.py`. For readable sheet labels, pass relative paths with forward slashes, not absolute backslash paths.
