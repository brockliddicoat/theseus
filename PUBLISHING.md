# Live artifacts

## brockabomb@gmail.com (the account the 2026-11-04 session ran on)
- **Main deck**: https://claude.ai/artifact/HH8yRD9aYxCvvgcT1jUkyv, first published 2026-11-04 (version 1793785122-a3a1),
  republished at each integration (v17 on 2026-11-05 at 00:0x Chicago, version 1793858838-90c9: every note through 22:10). It declares the `db` and
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
  deck/dist/main.html as index.html. Republish with publish_files + slug + base_version (last: 1793716369-34d8, v1 new
  design system). Not reachable from the account above: update it from a session on that account, with the same files.
