# THESEUS — handoff

Read this first if you are picking this project up in a new session.

## What this is
**Theseus** is Brock Liddicoat's concept flagship wireless gaming mouse (Brock owns Nitrite Labs and designed the shape of the Finalmouse Starlight X). This repo holds the motion-designed, data-first presentation that sells it, *In Pursuit of an Objectively Better Mouse — Optimization Over Opinion*, plus the 3D assets, research and references behind it. **Weight target: 29 g.**

Source of the ideas: Brock's Google Doc "In Pursuit of an Objectively Better Mouse" (id `1-rAJ-74g6W1C-OSezMz9047SVMvD5-WGqh1ShHLHEoo`), snapshot in `research/brock-doc-in-pursuit.txt` (ideas are numbered; the deck cites them as #n) with its comment threads in `research/brock-doc-comments.txt`.

## Live link
The deck is published as a claude.ai artifact on Brock's main account. See `PUBLISHING.md` for the slug and how to republish (always to the same slug, so his link stays live).

## Layout
```
deck/        the presentation (canvas-drawn film, 1920×1080 stage)
  src/       00-head.html + numbered JS files, concatenated in order by tools/build.py
  tools/     build.py (→ dist/main.html, dist/rec.html), shot.js (screenshots), errs.js (runtime-error check)
  dist/      built decks (main.html = the deck; rec.html = the recommendations deck)
  DESIGN.md  the design system (type, color, components) — read before touching slides
3d/          three.js assets (shell, pcb, parts, lattice), shared studio in lib/studio.js, rules in CONVENTIONS.md
research/    Brock's doc, validation report, sourced datasets in research/data/
refs/        photos and derived silhouettes (the raw Sora scan and the Kunai guide stay local: see .gitignore)
```

## Build and check
```
cd deck && python3 tools/build.py main rec          # writes dist/main.html, dist/rec.html
node tools/errs.js $PWD/dist/main.html <slide ids>   # prints "<id> ok" or the error
node tools/shot.js $PWD/dist/main.html <outdir> <id>:<t> ...   # 1920×1080 PNGs
```
Slide API: `S({ id, ch, theme: 'paper'|'night', title, settle, ideas: [#…], src: [sourceKeys], draw: t => { … } })`. Sources live in `src/05-data.js`. Every on-screen number is either cited (source key) or computed on screen and tagged *derived*; evidence tags: measured / datasheet / maker claim / derived / proposal.

## History (why things are the way they are)
- The deck was first built on Brock's other Claude account (2026-11-02/03). That session ran out before it could push anything; its machine was unreachable. This repo was **rebuilt by replaying that session's recorded file operations** from the shared chat. Everything the main session wrote came back exactly; the fillet and thin-wall slides were restored from its scratch files. **Lost:** five idea-sheet files written by helper agents (`src/12-10-click.js`, `12-20-shell.js`, `12-30-surface.js`, `12-45-elec.js`, `12-50-own.js`, 17 "idea sheets"). If Brock shares the old artifacts (main deck `claude.ai/code/artifact/49d56dc9-…`, recommendations `…/c9857f20-…`, both on his other account), their built HTML contains that code verbatim and can be split back into files.
- Brock's feedback that shaped the design (keep honoring it):
  - 2D first; never a lazy or blobby mouse. Full-mouse profiles were rejected early. Then (2026-11-03) he asked for a real 3D model built from his own scan of the **Ninjutso Sora V2/V3** (the placeholder shape), plus his features, and for the Sora's top silhouette (simplified) as the generic mouse icon.
  - Look: XBAB promotional material + the Kunai tester guide + the earlier GI film's grid (plus marks, white↔black transitions, chapter colors). Uppercase display type with mixed sizes and colors side by side, bigger type for phones, XBAB light grey `#F7F6F2` instead of tan.
  - Content: every idea gets an animated visualization; anything already in shipping mice also gets a "how Theseus goes a step further" beat; as many competitor comparisons as possible (bars, XY with sweet-spot gradients, Pareto frontiers).
  - Corrections from the 2026-11-03 research pass are in `research/validation-report-2026-11-03.md` (sensor naming, Raytac AN54LM-20A, nPM1300, Kim et al. CHI 2020 wording, no SLX battery-hour rating, single-sided reflow wording).

## Status (2026-11-04)
- [x] Deck restored and published on Brock's main account (see PUBLISHING.md).
- [x] Design system v2 (`deck/DESIGN.md`): embedded Inter Display / Inter / JetBrains Mono, uppercase type roles, XBAB grey, chart components (bars with samples + CI, breakdown, lollipop, scatter with sweet spot + Pareto, compare table), Sora key plan, exemplar slides (cover, zero grams, 29 g budget, price Pareto, battery chemistry, frontiers, motion ranking).
- [x] Sourced datasets in `research/data/` (35 mice, piaknow latency, XBAB click chart, weights, batteries, weight science, step-further for 30 features, claim checks, missing ideas).
- [x] 3D parts finished (`3d/parts/`, README has the API). Shell (`3d/shell/`), PCB (`3d/pcb/`) and lattice (`3d/lattice/`) are usable but their builders were stopped mid-refinement when the session ended; read each README + shots.
- [x] 3D in the deck: `deck/src/08-r3d.js` `view3D(key, t, x, y, w, h, state)`; bundle built by `cd 3d && npm install && node integration/build.mjs` (writes `deck/vendor/r3d.js` and compressed assets into `deck/dist/assets/`, both gitignored). The deck must be served over http (tools/serve.js does it for the checkers) and published as index.html + assets/.
- [~] Chapter rebuilds: seven builders worked ~1–3 h each and were stopped by a session restart before reporting. Their work is committed (WIP). The deck builds, 94 slides. Remaining per chapter: finish step-further beats, check every slide settled/mid/phone-scale with `tools/qa.js` and `tools/errs.js`, fill any idea still without a visualization (list: `grep -o "ideas: \[[^]]*\]" src/*.js`).
- [ ] Recommendations deck (`src/11-slides-rec.js`) restyle — partly done by the ownership builder; check.
- [ ] Lattice assets are ~20 MB raw (`3d/lattice/assets/*.bin`); quantize/compress before final publish.
- [ ] Push: create an empty GitHub repo `brockliddicoat/theseus` and push this repo (`git gc --prune=now` first).

## Open decisions for Brock
- 29 g budget vs 200 h target: built like the XA25, a 29 g wireless mouse leaves ~4.9 g for the battery (~140 mAh, ~146 h at 1 kHz); 250 mAh needs ~2.6 g cut elsewhere.
- Theseus price (the price Pareto shows a line, not a point).
- The raw Sora scan comes from findmymouse.com's viewer (sold there as a paid download, personal use). Brock says he made the scan; confirm with the site owner before publishing a mesh derived from it.
