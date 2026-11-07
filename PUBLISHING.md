# Live artifacts

## brockabomb@gmail.com (the account the 2026-11-04 session ran on)
- **Main deck**: https://claude.ai/artifact/HH8yRD9aYxCvvgcT1jUkyv, first published 2026-11-04 (version 1793785122-a3a1),
  republished at each integration (v20 on 2026-11-05 at 04:1x Chicago, version 1793873254-4a5b: the ratings archive, 12 slides
  out, khz, engravings off, frame sync 202 → 42 µs). It declares the `db` and
  `user` capabilities (the slide ratings, collection `ratings`, readable by viewers, writable by editors): publish later
  versions **without** a `capabilities` parameter so the stored declaration carries forward (`{}` would clear it). It is
  published from
  `deck/dist/main.html` (served as index.html) plus every file in `deck/dist/assets/` except the raw `.glb` and `.bin`:
  the host serves neither, so their `.gz.b64.txt` copies (written by `3d/integration/build.mjs`) go instead, at the same
  paths (`assets/…`, `assets/assets/lattice_*`). 24.5 MB of assets, 4.4 MB page. Republish to this URL: from another
  session, read the artifact first, then publish with `url` set to it.
- Old deck, before the design system and the 3D: https://claude.ai/artifact/A7oboZ7PVeA6MMgAqLb8eo (artifact 49d56dc9).
  Left as it was; its HTML still holds the idea-sheet code lost in the rebuild (see HANDOFF.md).

## Brock's main account
- Main deck: slug 53c9f24b-6151-4df2-bb06-2f0f168fdc8b (https://claude.ai/artifact/BM6ym7q1adWFaNP6u5cTQv), published from
  deck/dist/main.html as index.html. Republish with publish_files + slug + base_version (last: 1794014119-6690, 2026-11-06 ~19:15 Chicago: the v23
  refinement, 97 slides: V6's move 6 merged (6dfee1b). Before it 1794012733-b9cd (~18:52, 110 slides: V5's moves 4 and 5
  merged onto V4's 300 mAh battery pass, 69b4c83). Before it 1794011041-ce3f (~18:24,
  V4's battery pass, 78641fa, 116 slides) and 1794010568-85c4 (~18:15: the cover's Compromises tile as 0 with three full
  bars, "no tradeoffs"; built from 294c539 without V4's then-uncommitted pass). The v23 refinement's versions, newest first: 1794008755-3f2b (testing pairs,
  2c32873), 1794008387-a9a5 (V3's moves 2 and 3, 88a2085; fixed b01_battery, broken from 17:19 to 17:39 by 1794007132-88b0),
  1794007132-88b0 (cover tile as text, 6722755), 1794006399-a29e, 1794005831-7601 (V2's loadout bars), 1794002308-7273 (the
  v23 refinement's pilot, V1). Before them 1793996750-29cc, 2026-11-06 14:25, the 14:30 revamp
  build, 107 slides, autoplay off by default (?auto=1 on); before it 1793991510-57ae at 12:58, the 12:53 revamp build; history 1793981126-8865 at 10:05, 1793716369-34d8 v1 new design system). Not reachable from the account above: update it from a session on that account, with the same files.
