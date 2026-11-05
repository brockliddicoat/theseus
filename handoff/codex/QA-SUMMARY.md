# Final Sol film: checked artifact

The later comparison-review integration is documented in [CYCLE4-RELEASE.md](CYCLE4-RELEASE.md). It records the current three-patch scope and final artifact separately. The full 47-scene evidence below belongs to the initial release.

## Exact candidate

- Content build ID: **b9ffd2d08636**.
- HTML SHA-256: `f14eb56915da551d6d89a8a9fc64d38b42978a4b6ba80e689add68343d05b821`.
- Immutable checked copy: `deck/qa/final-film/tested-index.html`.
- Delivery copy: `deck/dist/index.html`, copied byte-for-byte from that checked artifact, not rebuilt after testing.
- Current public deployment identity is recorded separately in [PUBLICATION.md](PUBLICATION.md). A source push is not proof of publication.

## Final combined checks

| check | actual result |
| --- | --- |
| all new scenes | 47 |
| deterministic text/layout samples | 470; zero detected issue frames |
| page/runtime errors during combined film checks | zero |
| full player/review smoke | 28 groups passed |
| focused desktop/real-mobile panels | 9 groups passed |
| global-clause feedback resolution | 6 groups passed |
| exact hidden-source archive routes | 14 passed; rejected scenes remain absent from the new film |
| feedback accountability | 283/283 original clause records mapped; zero traceability errors |

The full player smoke covers ratings 1–10, note-before-score, saving to the correct slide before navigation, no note carryover, typing/keyboard guards, direct canvas text selection, per-slide edits, reload persistence, actual JSON export/import, seek/play/replay, opt-in autoplay pause behavior, version-update notices and flush-before-refresh, and storage-denial behavior. Local data is explicitly labelled browser-local.

The final panel tests use Chromium **isMobile + hasTouch**, DPR3, 440×956 and 956×440, plus desktop 1920×1080. Actual taps exercise notes/text selection; viewport metadata prevents the 980px mobile layout. Reading panels remain above navigation and have reachable close controls. Short landscape editing uses a side editor with a usable scene. These are browser-emulation results, not physical iPhone/Safari/keyboard certification.

The global-clause tests cover cross-scene navigation, local response preference, clauses answered in binning/no-lights/shoulder scenes, globally reopened state, prose ID-prefix matching, and genuine partial/missing-photo boundaries. Structured verification is readable, not `[object Object]`.

## Causal-motion evidence is separate from text QA

- [MECHANICS-MOTION.md](MECHANICS-MOTION.md): 12 scenes, 120 timeline samples, 44 event captures, actual SPDT/transit/report states, blur/correlation pixel checks. The matched fabric feature shifts by −40px in the explanatory frame pair. These are drawing checks, not sensor or latency tests.
- [INTRO-MOTION-REVIEW.md](INTRO-MOTION-REVIEW.md): 14 scenes, 140 timeline samples, 43 event captures and draw-helper input assertions, plus later focused player/line checks. Different snapshots are explicitly distinguished.
- `deck/qa/structure-motion/HANDBACK.md`: 15 scenes, 150 timeline samples and 85 event captures with 15 mechanism assertions. It verifies equal masses/loads, unload-before-turn, constant straw lengths, operation order, the wheel and repair sequence.
- `deck/qa/structure-motion/hotspot-margin/CLOSURE-HANDBACK.md`: a later focused two-scene correction, 20 layout samples, 15 event captures and 11 assertions. It restores the actual 120MPa linear margin and whole-board/owner-report copy.
- `deck/qa/integrator-motion-final/report.json`: six root scenes, 60 timeline samples, all clean; settled and transition geometry inspected.

Those lane snapshots are not passed off as the final combined HTML. Their scopes and exact hashes remain in their handoffs. The final combined report above tests the actual delivery bytes. Four final contact sheets covering all 47 settled scenes were inspected; event-specific full-resolution frames were inspected by the owners and selected again by the integrator.

## Feedback acceptance boundary

The independent [FINAL-FEEDBACK-REVIEW.md](FINAL-FEEDBACK-REVIEW.md) found real source/ledger defects rather than trusting old archived scores. The missing margin lesson, partial-state classification, cross-scene response lookup, stale replacement IDs, graph orientation and overstated PCB coverage were corrected. No unresolved source-level P1 from that review remains.

**Traceability and a tested presentation are not blanket user or hardware acceptance.** The [coverage ledger](FEEDBACK-COVERAGE.md) keeps partial claims, missing empirical data, original-photo fidelity and deferred design decisions open. Source-level review does not turn an illustrative mechanism into a production simulation or measured player benefit.

## Reproducible runners

- `deck/tools/check-film.cjs`
- `deck/tools/review-smoke.cjs` (`RV_HTML` selects the exact candidate; focused flags are documented in the file)
- `deck/tools/check-archive.cjs`
- `deck/tools/audit_revamp.py`
- `deck/tools/capture-structure-motion.cjs`
- `deck/tools/check-material-margin.cjs`
- `handoff/codex/check-mechanics-motion.cjs`
- `handoff/codex/make-mechanics-motion-proof.py`
- `handoff/codex/intro-motion-frames.cjs`

Large captures and intermediate HTML remain local under ignored `deck/qa/`. The compact [final-verification.json](final-verification.json) and [feedback-coverage-report.json](feedback-coverage-report.json) retain final artifact identity, counts and source hashes. Use the actual report/hash when comparing future builds.
