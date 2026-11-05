# Comparison review: cycle 4 integration

Baseline source: `29d2fb51a917462b5871df5f869edf0982037bd8`. Baseline public release: 47-scene `b9ffd2d08636`. The separate comparison chat supplied three narrow patches, each checked against the exact primary source hash before application.

## Changes

- **Wheel contact:** the wheel and contacting fingertip now share the same finite 0.55rad clockwise stroke. Actual canvas-transform checks detect the old 1.544rad mismatch and pass the correction. Assembly, 144 grooves, comparison masses and the metal-only weight boundary remain. Root shortened the wheel disclosure to one line after observing it cross the footer rule; its meaning is retained.
- **Click target:** the SPDT footer restores F18.5’s **70µs, moving or still** electrical-target scope. NC release remains the counted edge. The slowed-sequence and added mechanical-travel qualifications remain.
- **Preview refresh:** the URL carries the viewer’s current manual/autoplay mode and playing/paused state. Startup restores a deliberate pause through the normal player initialization. A version refresh keeps the scene and flushes pending notes; continuing playback remains playing.

No slide `rev` was raised and no ratings or notes were archived by these corrections. The original empirical/photo/deferred design boundaries remain open.

## Final checked artifact

- Build: **e06360eb8101**.
- Exact local HTML SHA-256: `d03279f5547da02f3124df6814eac8f0b72e1b5a5d45f038828ead77e55d4d08`.
- Immutable candidate: `deck/qa/cycle4-film/tested-index.html`.
- Final focused canvas checks: **2 changed scenes / 20 samples**, zero text-layout/runtime issues.
- Actual wheel drawing probe: **30 frames / 24 contact samples / 12 checks passed**; maximum radial phase error `6.69e-8rad`, below the `1e-6rad` numerical tolerance. This checks the drawing, not friction physics.
- Final Chromium refresh fixture: **4 cases passed**, including manual/autoplay changes in both directions, pauses after notes or seeking, settled automatic refresh, and continuing playback. Scene, note flush and Play/Pause labels agree. The fixture fulfills document/version responses from disk; it is not a hosted-deployment test.
- **28 full player regression groups passed** after the three review patches, before the only later change: shortening the wheel footer. Player source bytes did not change; the four refresh cases were rerun on the final artifact.
- Original 47-scene/470-sample checks remain evidence for the initial release. Unchanged scenes were not rerendered in this bounded patch cycle.
- All **283 original feedback clause records** remain mapped; the added F18.5 standing-response link is explicit. Mapping is not blanket acceptance.

Compact current proof and source hashes are in [CYCLE4-verification.json](CYCLE4-verification.json). The original independent assessments are [CYCLE4-CLICK-INTEGRATION.md](CYCLE4-CLICK-INTEGRATION.md) and [CYCLE4-WHEEL-INTEGRATION.md](CYCLE4-WHEEL-INTEGRATION.md).

## Reproduce

```powershell
python -X utf8 deck/tools/build_revamp.py --out=cycle4-candidate.html
node deck/tools/check-film.cjs deck/dist/cycle4-candidate.html deck/qa/cycle4-film rv_wheel rv_spdt
node deck/tools/check-wheel-contact.cjs deck/qa/cycle4-film/tested-index.html deck/qa/cycle4-wheel
node deck/tools/check-preview-refresh.cjs deck/qa/cycle4-film/tested-index.html deck/qa/cycle4-refresh fixed
python -X utf8 deck/tools/audit_revamp.py --report deck/qa/cycle4-film/report.json
```

The old broad structure capture’s arbitrary `rotation>1rad` threshold was replaced by a positive-clockwise-stroke check; accurate coupling is now tested from actual drawing transforms. Its original reports remain historical. The film checker emits the full current scene manifest even during a focused render so accountability can be checked without claiming that all 47 scenes were rendered again.

Actual public verification is recorded separately in [PUBLICATION.md](PUBLICATION.md).
