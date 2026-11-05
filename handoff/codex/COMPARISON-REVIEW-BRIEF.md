# Codex / Opus comparison reviewer

Brock's direct request: "create a 3rd chat that reviews the world and points out differences and short comings compared to the opus presentation, then creates and sends suggested patches so we can continually be evolving". Interpret "world" as the ongoing work, not unrelated world news. This is authorization to create the third chat, compare both presentations, create suggested patches, and send concise findings/patch links to the primary Codex task. It does not authorize talking to Claude or its agents.

## Primary task and isolation

Primary thread: `01a1ac05-145e-7bb0-a097-5778a9c908b7`, host `local`.

Primary source (READ ONLY): `C:/Users/brock/Documents/Codex/2026-11-05/https-claude-ai-share-4ce6f186-6380/theseus-codex`.

Live Codex progress: https://brockliddicoat.github.io/theseus-codex-preview/ . Deployment repo `brockliddicoat/theseus-codex-preview`, main. The live site currently lags the source; always record the actual source/deployment commit and scene count you reviewed.

Never edit the primary checkout, its index, assets or hosting. In your own task directory, create a separate snapshot/review checkout. The implementation is actively dirty; copy only named source/build/reference files if a current snapshot is needed, or use the built static preview. Do not reset, stash or commit another task's files. Produce unified patches against the exact files/versions reviewed. Your patches are suggestions until the integrator applies and verifies them.

## Opus evidence

- Supplied branch snapshot: `import/claude-review-notes` / commit `7d8f926` in the primary repository's git object store. It is the known pre-revamp handoff, NOT proof of the later Opus revamp.
- Existing Opus artifact: https://claude.ai/artifact/HH8yRD9aYxCvvgcT1jUkyv . Read it if accessible using normal web/file tools. Do not converse with Claude or solicit its design decisions. The public chat share is `https://claude.ai/share/4ce6f186-6380-4611-a871-d79aeee98304`; web reader failed and public snapshot API returned403 earlier. Do not waste time retrying the same inaccessible route or bypass browser safety.
- Later Opus files/resources may be read if they become available. Clearly distinguish current verified Opus, old baseline, and inaccessible updates. Never claim a head-to-head victory over a version you have not seen.

## Read first

Read `FEEDBACK.md` completely, `handoff/README.md`, `handoff/briefs/k-common.md`, relevant K1-K8 briefs, `deck/DESIGN.md` with the later-feedback overrides, `handoff/codex/FEEDBACK-AUDIT.md`, `handoff/codex/HARDWARE.md`, and `deck/revamp/coverage-*.json`.

The brief is a full revamp: new story, fewer/denser scenes, important poorly executed ideas receive MORE emphasis. Every idea needs an animated explanation, the strongest problem comes first, then the fix and player benefit. No AI-generated images: all visuals code-native, polished mechanics, purposeful motion and a human tone. Keep at-a-glance benefits, honest rival comparisons even when Theseus loses, before/better values simultaneously visible, Theseus blue/next best yellow/problems red, no dot separators or peach, restrained gradients only in display type. Whole-mouse shapes are not permitted on the cover/close. Important F27/F33 requirements override older default 'one idea per slide' guidance.

Known technical boundaries: 29.31g/$189/200h at1khz/Dual8khz are design targets, not measured prototype results. Density is bounding-box mass/volume, not physical material density. Current PCB geometry is a presentation model with718 electrical DRC issues and a known3.720mm² old-battery envelope overlap; do not present it as manufacturing-ready. The6% mechanical-click wording is an approved ideal-model estimate, not a measured latency. Hall encoders are not zero-current. Raw Sora scan must not be published.

## Review cycles and useful patches

Use three GPT-6.1 Sol reviewers if concurrency allows (no Astra):

1. Visual story and motion: compare meaningful equivalent scenes at first/mid/settled frames. Can a new viewer identify the problem, the part, the change and the benefit? Find real regressions versus the Opus baseline, not just stylistic differences. Watch abstraction, repetitive layouts, inadequate simulated area, and missing teaching examples.
2. Feedback and evidence: compare every substantive clause and archived-feedback answer to what is actually on screen. An answer string or a higher rev is not completion. Find dropped ideas, misleading numerical claims and uneven precision. Do not merely repeat the main ledger; locate concrete misses.
3. Product/player: test phone controls, review-note provenance, direct text editing, saved ratings, replay/seeking, performance and source access with headless local tests. Do not touch the user's Chrome/Claude session or send data externally.

Build a ranked `COMPARISON.md` with screenshot pairs and exact inspected versions. For each useful fix, implement it only in your own snapshot, run the relevant tests, and export a small named `.patch` with a base-file SHA256 and a `PATCHES.json` manifest. Patches should be narrow enough for the main task to apply while its builders continue. Prefer concrete code fixes to a long critique. No main-branch push or publication.

Send the primary task a concise user-visible message through the task messaging tool after each substantial batch: current comparison boundary, top findings, exact patch paths, touched files/base hashes, tests and any required integrator judgment. Brock's request above explicitly authorizes these messages to that task; do not message anyone else. If cross-task messaging is unavailable, save the same packet in your own outputs and report it in your final reply.

Continue new review cycles when the live preview publishes a materially different version. Avoid repeatedly rendering an unchanged build. Work usefully on your current batch while updates are pending. Do not create a scheduled automation or claim unattended perpetual monitoring; continue within this active task and leave a reproducible review harness and final state when it ends.

## Tooling

Python source must be UTF-8 (`python -X utf8`). Local headless dependencies:

`NODE_PATH=C:/Users/brock/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules`

Playwright Chromium1234 is installed. In a source snapshot, `python -X utf8 deck/tools/build_revamp.py` writes `deck/dist/index.html`; original `deck/tools/shoot.js`, `qa.js`, `errs.js` work with `Q=&2d=1`. The original film is reachable in the new build via `?legacy=<oldSlideId>&2d=1`. Never count a source-only audit or an unviewed screenshot as visual acceptance.
