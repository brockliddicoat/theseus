# GitHub Pages publication record

Preview: https://brockliddicoat.github.io/theseus-codex-preview/

## Current publication: comparison cycle 4

- **Verified live:** 2026-11-05T16:36:46Z, HTTP200, 47 scenes, zero browser page errors.
- Build and manifest ID: **e06360eb8101**.
- Fresh link: https://brockliddicoat.github.io/theseus-codex-preview/?v=e06360eb8101
- Preview commit: `d028898b3895cdf0da6197e289af04fc0e16102d`.
- Successful deployment: https://github.com/brockliddicoat/theseus-codex-preview/actions/runs/42065965902 . The redundant earlier same-commit job was cancelled by GitHub.
- Exact tested local HTML SHA-256: `d03279f5547da02f3124df6814eac8f0b72e1b5a5d45f038828ead77e55d4d08`.
- Public HTML SHA-256: `6808d31b3290d58c6979e7a0d0f4c7ec640fabf0d82d973a822fd27eb01d1292`.
- Public bytes equal the tested artifact after CRLF→LF normalization. Runtime Theseus `#1267D8` and secondary `#C7A20D` remain correct.

This release synchronizes wheel/fingertip contact, restores the click target’s moving-or-still scope, and preserves current autoplay/pause choices during safe refresh. See [CYCLE4-RELEASE.md](CYCLE4-RELEASE.md) and [CYCLE4-verification.json](CYCLE4-verification.json) for exact delta test scopes. The current hosted browser proof is [public-verification.json](public-verification.json).

## Initial complete 47-scene release

- 47-scene build: **b9ffd2d08636**.
- Preview repository commit: `4a78485f6a84e97eaec5865e1347409ea8c5778b`.
- Exact local HTML SHA-256: `f14eb56915da551d6d89a8a9fc64d38b42978a4b6ba80e689add68343d05b821`.
- Pushed the exact `deck/qa/final-film/tested-index.html`, not a later source rebuild.
- Successful deployment run: https://github.com/brockliddicoat/theseus-codex-preview/actions/runs/42062164399

**Verified live at 2026-11-05T16:14:49Z:** HTTP200, 47 scenes, inline build ID and version manifest both `b9ffd2d08636`, actual runtime Theseus `#1267D8` / secondary `#C7A20D`, zero browser page errors. The successful Pages run and build API both identify commit `4a78485f6a84e97eaec5865e1347409ea8c5778b`. Fresh-load URL: https://brockliddicoat.github.io/theseus-codex-preview/?v=b9ffd2d08636

Public HTML SHA-256 is `38b836799ea3ebd44af01dc6f7858d070ead54f14693b30b87cfb9332f158504`; it is **byte-identical to the tested local HTML after CRLF→LF normalization** (35,509 local CRLFs, zero public CRLFs). The difference is recorded rather than passing a mismatched raw hash off as identical. Compact initial browser evidence is [public-verification-b9ffd2d08636.json](public-verification-b9ffd2d08636.json).

The first deployment run (`42061307833`) returned HTTP500 from `actions/deploy-pages`. Re-requesting the complete Pages build succeeded without changing the tested source or artifact. The prior 46-scene build `892e938cbb91` is now historical, not the current publication.

## The stale-link fixes

Two separate causes were observed:

1. Old open tabs could keep an old document indefinitely. Current players show their content build ID, poll the no-store version manifest, notify on a new build, and preserve the scene hash and saved local reviews before refresh. A tab from before this feature needs one cache-busted fresh load.
2. A successful source push did not automatically request a classic Pages build in this setup. The publish helper now explicitly requests `POST /repos/brockliddicoat/theseus-codex-preview/pages/builds`, including recovery when the source is already current. It refuses to call a failed build live.

The helper's `-VerifiedReport` mode checks the immutable tested HTML hash and zero-error layout report before copying. Publication and source identity are kept distinct; the public CDN may normalize local CRLF/LF bytes. The embedded content build ID, corresponding version JSON, scene count, palette runtime and browser errors are verified directly.

## Site boundary

This public deployment is separate from Claude's artifact and source branch. It contains the built presentation and generated runtime/model assets, not the raw Sora scan. Browser-local ratings/text edits are not an online multi-user database; export/import moves those reviews. The independent Astra experiment has its own checkout and must use a different preview repository/site.
