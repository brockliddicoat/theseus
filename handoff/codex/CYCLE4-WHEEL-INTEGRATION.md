# cycle 4 wheel-contact integration review

## decision: go

The two-line `wheel-contact-coupling.patch` is a correct, narrow presentation-geometry fix for the existing finite contact stroke. It couples the wheel's rotation to the fingertip's angular travel rather than depicting unexplained extra wheel spin while the finger remains at the rim.

The old wheel traveled `TAU/3` = 120°, while the rim-following finger traveled 0.55 rad = 31.51°. The patch uses `rot=.55*turn` and derives the finger angle from `rot`. The same clockwise stroke now drives the face, six arms and straight tread. The previous 120° turn was also a multiple of the six-spoke symmetry, returning the finished wheel to an indistinguishable orientation; the 31.5° final pose makes the finite stroke easier to read.

This is one stylized contact stroke, **not a measured friction test or a solved contact/torque/bearing simulation**. The existing fingertip shape, near-surface placement, contact timing and release are not altered by this patch.

## independent source review

Read the supplied `outputs/cycle4/visual/REVIEW.md`, `PATCHES.json`, two-line patch, `draw-verification.json`, and the supplied actual-draw runner. Read the current primary wheel helper and slide. The primary raw source initially matched the required base exactly:

- Base `60-surface.js`: `c8a8621fc26622e8525974c5bf99775b493eb1f6179ce00419ae218c357a4267`.
- Suggested/result source: `ed0b3569c70dd549f3485570cc5bf440f4c9f89291e57eb9902dfa2d29ca7066`.
- Patch: `8ecd2532fd1db9f4cbee9382426d5a3e992f99dadad3d1b9ca8444273150a4e3`.
- The primary source was subsequently reread after **root** applied it and matched that result hash. This lane did not edit it.

The helper actually applies `rot` to the front-face/arm drawing transform and uses it for the tread positions. All three illustrative control wheels receive the same rotation. The two-line delta does not change the six-arm/rim assembly, 144-groove completion, the 0.90 g metal-only mass scope, separate POM axle/bushing, test-group geometry or qualification, text, layout coordinates, or timeline duration. Both the proposed source and the new probe pass `node --check`.

## actual-draw integration probe

Added `deck/tools/check-wheel-contact.cjs`, adapted from the supplied review runner with a stronger actual-drawing check. It renders **only `rv_wheel`**, snapshots the exact supplied HTML bytes, and records its runtime build identity.

It intercepts:

- `rvs_wheel` calls, including both main-wheel draws and all three controls;
- the actual six arm segments sent to `rvLine`, including their canvas transforms, proving that the helper's rotation was used in the drawing;
- `rvFinger`'s parent canvas transform and position, independently deriving the fingertip's radial angle from its observed position around the drawn wheel center;
- full on-stage text calls, to retain the metal-only/axle-exclusion and illustrative-control wording checks.

It does **not** read `__structureMotion` or reproduce the slide's easing/interpolation formula as its coupling test.

The probe samples 30 frames, including 24 within the contact stroke. It captures seven actual frames: before contact, contact start, quarter, middle, three-quarter, end, and released. Twelve checks cover observed drawing calls, six arms,144 straight-groove input, main/control rotation consistency, contact presence/release, angular phase and per-step travel, finite motion/end hold, retained evidence-scope copy, and text layout.

Usage from the primary root:

```powershell
$env:NODE_PATH='C:\Users\brock\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules'
node deck/tools/check-wheel-contact.cjs <root-built-candidate.html> <qa-output-directory>
```

Both arguments are optional; defaults are `deck/dist/index.html` and `deck/qa/wheel-contact`. The output contains `tested-wheel.html`, `report.json`, and the seven named PNGs. A coupling failure writes the evidence report and exits nonzero.

## probe validation: positive and negative controls

| tested document | runtime build | raw HTML SHA-256 | result |
|---|---|---|---|
| local primary baseline `deck/dist/index.html` | `b9ffd2d08636` | `f14eb56915da551d6d89a8a9fc64d38b42978a4b6ba80e689add68343d05b821` | correctly fails only the two angular-coupling checks |
| supplied isolated review suggestion | `visual-8513c7191f9c` | `9d1d57a3fb90fc88ea29ac2919b84dcd65c8217473462f1221fd2ab741dcbd14` | all 12 checks pass |

The local baseline is not substituted for the review packet's fetched public HTML, whose raw hash is separately recorded there as `38b836799ea3ebd44af01dc6f7858d070ead54f14693b30b87cfb9332f158504`. They share the named runtime build but are not asserted byte-identical documents.

### positive result

- 30 wheel-only frames; 24 contact samples; 12 checks pass; 0 page/runtime errors; 0 text-layout issues.
- Observed wheel stroke: 0.55 rad.
- Maximum actual wheel-body versus fingertip radial phase discrepancy: `6.686329806493417e-8`rad.
- Maximum wheel-body versus fingertip parent-frame discrepancy: `1.6653345369377348e-16`rad.
- Maximum per-step angular-travel difference: `8.843990945139879e-8`rad.
- Tolerance: `1e-6`rad, allowing canvas-transform/position floating-point rounding. These tiny residuals are numerical, not measured physical slip.
- Evidence: `deck/qa/cycle4-wheel/review-positive/report.json` and its seven PNGs. Contact start, middle and end were visually inspected.

### negative result

- The unchanged baseline correctly fails angular phase and per-step angular travel, with maximum phase discrepancy `1.5443951405566314`rad.
- It still passes the other 10 checks and has 0 page/runtime errors. This establishes that the probe detects the actual mismatch rather than indiscriminately rejecting the scene.
- Evidence: `deck/qa/cycle4-wheel/baseline-negative/report.json` and its seven PNGs.

## final integration gate and scope

Root has applied the exact source-result bytes and will run this probe once against the **root-built combined cycle 4 candidate**. The supplied review suggestion's positive result is not acceptance evidence for that later combined artifact. Root's eventual report must retain that candidate's own raw HTML hash and runtime identity.

Root is also updating the old capture runner's `rotation>1rad` assertion to a meaningful positive-clockwise-stroke check. That old magnitude threshold is deliberately obsolete for this31.5° stroke; accurate angular coupling belongs to this actual-draw probe. Earlier 85-frame reports remain historical evidence for their original snapshots.

This lane added only the probe, this handoff and its narrow QA outputs. It did not edit `60-surface.js`, coverage, build code, player code, or other scene source; did not run the other 15 scenes; and did not commit, push, publish, or contact Claude.

## Root integration completed

The final root-built artifact is build `e06360eb8101`, raw HTML SHA-256 `d03279f5547da02f3124df6814eac8f0b72e1b5a5d45f038828ead77e55d4d08`. Its actual-draw probe passed all12 checks over30 frames/24 contact samples, with max angular phase error6.69e-8rad, zero runtime/layout errors. Root also shortened the unchanged wheel mass/method disclosure to a single line above the footer rule; the source no longer equals the original two-line patch-result hash after this additional copy correction. The final source hash and candidate evidence are in `CYCLE4-verification.json`. Start/mid/end frames and the final one-line disclosure were visually inspected.
