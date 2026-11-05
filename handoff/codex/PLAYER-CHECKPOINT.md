# player / review checkpoint for replacement MAX agent

2026-11-05. Stopped at a safe checkpoint on root instruction after the current isolated smoke finished. Do not restart the implementation from scratch. No commits, pushes, publication, account login or external messaging occurred.

## ownership and saved changes

- `deck/revamp/99-review.js`: browser-local review provider, explicit storage failure status, validated atomic import, flush-before-export, actual JSON download, original ratings plus exact clauses, mapped-but-pending status, reopening persistence, accessible panel close buttons, same-slide replay, slider updates, responsive player fitting, docked editor, input/contenteditable/touch navigation guards. Exposes `window.RV_DB` for inspection/export; no cloud-save claim or account database calls.
- `deck/revamp/player.css`: wrapping player controls, full viewport-width bar independent of stage width, fixed in-viewport rating/source drawers, sticky accessible close buttons, wrapping status text, bottom editor dock and responsive panel sizing.
- `deck/tools/review-smoke.cjs`: reusable meaningful real-UI acceptance smoke using fresh isolated Playwright contexts on localhost. Does not use the user's browser or authentication.
- One requested bounded intro patch in `deck/revamp/10-intro.js`: C1-continuous monotone cubic visual guide through non-dominated plotted X2F → HTX Mini → wired M3K price/mass points. Common tangent prevents a hard kink. Guide, wired inclusion and differing price bases are labelled; no intermediate shipping products or predicted performance are asserted.
- `deck/revamp/coverage-evidence.json`: F27.pricefront.1 now maps the actual smooth-guide implementation and is no longer in pending. Earlier source-verification/electronics work remains preserved.

## latest actual test result

**PASS: all 23 test groups**, in `deck/qa/review-smoke/report.json`, with `errors: []`. Current smoke process finished exit0; its browser was closed. No owned test process remains pending. Do not terminate unrelated node/chrome processes.

Tested at **1920×1080, 440×956, 956×440**, each in its own browser context:

1. player/stage/button/seek extents fit the viewport;
2. all ratings1–10; note before score; note flush when changing slides; no wrong-slide carryover; typing ArrowRight does not navigate;
3. original note visible, exact original clauses listed, mapped answer remains visibly pending, reopening recorded;
4. real canvas tap-select of THESEUS, new words typed, edit saved, per-slide scope, page reload persistence;
5. seek pauses at3.25s, resume advances, pause works, explicit replay restarts same slide;
6. actual browser JSON download then file import after clearing that isolated review store restores ratings, edits and reopened clauses, including subsequent reload;
7. controls still fit after editing.

Additional contexts:

- Storage get/set denial: clear Not saved status in player and rating panel, in-memory score remains exportable, no fake Saved message.
- `?legacy=weightgap&2d=1`: opens original scene and its original feedback.

### bugs found and fixed by the smoke

- Explicit replay initially restarted at the settled frame when reduced-motion preference was set. Replay now resets time after forced navigation.
- Landscape rating drawer's inherited bottom anchoring put its close button above the viewport. Rating/source drawers now use fixed top anchoring and sticky close controls.
- Explicit executablePath to full `chrome.exe` produced `spawn UNKNOWN`; default Playwright headless launch succeeds with the installed runtime. The smoke therefore uses default launch unless RV_CHROME is explicitly supplied.

## reproduce

PowerShell from repository root:

```powershell
$env:NODE_PATH='C:\Users\brock\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules'
python -X utf8 deck/tools/build_revamp.py
node deck/tools/review-smoke.cjs
```

Installed browser family: `C:\Users\brock\AppData\Local\ms-playwright\chromium-1234`. Default Playwright headless launch is the verified route, not an explicit full-browser executable path.

Artifacts:

- `deck/qa/review-smoke/report.json` — structured final result, all23pass.
- `deck/qa/review-smoke/run.log` — console log of final successful run.
- `deck/qa/review-smoke/1920x1080.png`, `440x956.png`, `956x440.png`, `storage-denied.png` — generated real-UI screenshots.
- Three `*-backup.json` files — real exported browser downloads from isolated smoke contexts, not user data.
- `deck/qa/evidence-pareto.log` — rv_tradeoffs settle text QA clean0issues after curve patch.
- `deck/qa/evidence-pareto/01_rv_tradeoffs_18.png` — curve screenshot generated.

## exact pending work / evidence boundaries

- **No new intro/electronics motion pass was begun after the MAX-effort instruction.** Replacement owns any such work.
- The new player screenshots and smooth-guide screenshot were generated but **not visually inspected** before this stop. Replacement should inspect those (and optionally an editor-open landscape capture) before declaring visual acceptance.
- Current root build script was still reading `deck/revamp/coverage.json` when this lane began. Root owns merging coverage-*.json. The smoke deliberately injects a temporary in-page mapped+pending fixture to prove rendering behavior even before merge. It does not write that fixture into project coverage files or user storage. Rebuild after root's merge and inspect actual pending statuses.
- Do not confuse smoke success with broad slide/art QA or hardware/firmware acceptance. Earlier14slide runtime/text/contact-sheet results are in the prior lane handoff; this follow-on only covered player/review behavior and the bounded Pareto patch.
- Storage-denied edit failure and malformed-import rejection are implemented but not individually exercised by the final smoke. The final denial test covers rating writes/status and exportable memory. Add only justified cases, not tests mirroring implementation.
- Original exact X2F outline remains a proportional schematic, not a traced verified silhouette. Finished conformal coating mass remains unweighed. Those existing honest boundaries were not changed by player work.

## preserved source context

Do not overwrite the earlier evidence dataset. `research/data/codex-verified.json` contains10mice/30sources including verified X3 US59g/135+h/$199.99/dual8khz, matched350mAh3.7V pouch7g/cylinder9g examples, Hall awake/duty-cycle data, G-Wolves competitors, and demonstration sources. `handoff/codex/EVIDENCE.md` explains measured/spec/derived/target boundaries.
