# THESEUS — handoff

Read this first if you are picking this project up in a new session.

**Latest (2026-11-06, the revamp session stopped at 14:30 Chicago at Brock's request for a live link):** start with
`WORK-LEFT.md` (everything left to do, what each agent stopped on, the decisions waiting on Brock, the ideas not to lose),
then `FEEDBACK.md` (every message of his, verbatim, with frames; F38–F61 are that day's) and `REVAMP.md`. The agents'
working notes, review findings and scripts are archived in `handoff/worklog/` (start at its README). The live film is the
107-slide revamp; `PUBLISHING.md` has its version.

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
- [x] Pushed to `brockliddicoat/theseus`.
- [x] 3D fixes and 2D mode (2026-11-04, below). Not yet pushed: this session had no GitHub write access, so the change
  went to Brock as a patch (`git apply theseus-3d-fixes-and-2d-mode.patch`, then rebuild `deck/dist`).

## Session 2026-11-04 (the 3D fixes and 2D mode)
Brock: "the 3D visualizations are broken in a lot of areas, and I want a setting to do 2D only for the presentation."
- **Fixed in the 3D bundle** (`3d/`): `shell.setClick` read `frontZ`/`travelFront` per side from `meta.hinge` (they live on
  `meta.hinge` itself) and gave NaN, so any click blanked the whole shell scene; local clipping was switched on too late,
  so the section caps of `gt01` cutaway, `claw` section, `screw` section failed to compile (`'clippingPlanes' :
  undeclared identifier`); every scene now applies its full rest state under each call (`REST` in
  `integration/entry.js`), so a key one slide leaves out no longer keeps the last slide's value (an exploded or
  recoloured shell on the next slide); scenes frame themselves at rest when built, so live playback (which enters at
  t = 0, often exploded) and screenshots frame a shot the same way.
- **Fixed in the deck**: the Clicks chapter had all its 3D switched off (labelled placeholder boxes: `CLK_3D.dev2d`) while
  those asset bugs stood; it is back on. The two `lab` framing slides were in the film; they now build only with `?lab=1`
  (92 slides). A scene that fails to build (assets missing, a shader error) now shows its 2D twin instead of a hole.
- **2D mode** (`deck/src/08-v2d.js`, documented in `deck/DESIGN.md` §7): a `2D / 3D` pill in the bar, the `D` key (`2` / `3`
  set it), `?2d=1` or `?2d=0` in the URL; the bar choice is remembered per browser. In 2D no WebGL context is made and no
  3D asset is fetched. Each 3D shot becomes a flat, outlined elevation of the same parts, traced off the same assets
  (`deck/geo2d/*.json`, ~1 MB, rebuilt by `sh deck/tools/geo2d/build.sh`); states (explode, press, insert, drive,
  scroll, x-ray, cutaway, section, power, reflow, colourway, the lattice's cut, build, stress, compare and fillet zoom)
  all show, and the callouts follow through `V3.proj` / `v2dAt`. Checkers take `Q='&2d=1'`.
- **Faster and safer 3D**: a scene's canvas now only grows and each shot renders into its corner (it was resized on every
  call, several times a frame on slides that draw one scene twice); while a scene streams in, its 2D twin stands in and
  the render fades in over it; binary assets also ship as `.gz.b64.txt` (the artifact host serves no `.glb` or `.bin`), and
  the bundle's fetch decodes them, so the builders are unchanged.
- **This machine**: npm's registry is blocked from this session, so `3d/node_modules` holds three r187 cloned from
  GitHub and a link to a preinstalled esbuild; `@gltf-transform` is missing, so `integration/build.mjs` copies the .glb
  files uncompressed (`deck/dist/assets/` is ~36 MB). Run `npm install` in `3d/` where the registry works to get the
  meshopt-compressed assets back.
- Published on the account this session ran on (brockabomb@gmail.com) as a new artifact: see `PUBLISHING.md`. The link on
  the main account (`BM6ym7q1adWFaNP6u5cTQv`) is not reachable from this account and was not updated.
- The old deck on this account (`claude.ai/artifact/A7oboZ7PVeA6MMgAqLb8eo`, artifact 49d56dc9) is the pre-design-system
  version; per the history above, its HTML is where the lost idea-sheet code lives.

## Session 2026-11-04 (evening into 11-05): the review-notes rework
Brock sent 40+ review notes, then steers through the day. **FEEDBACK.md** (repo root) holds every one of them verbatim
with an ID (F0 to F20) and a status, plus "Open with Brock" at the top: read it before changing anything. The rules that
now govern every slide are in `deck/DESIGN.md` §0 (items 9 to 12) and §2b.
- **The rule above all** (F14.10): better at a glance. Each comparison slide leads with a huge Theseus-blue number and a
  chart or simulation where Theseus visibly wins, with which way is better written on it; numbers that improve show the
  old value struck beside the new (before → after, F16.1); stress axes read "Peak experienced stress (lower is better)".
- **The deck:** 143 slides: the intro, seven chapters (clicks, glide, shell, surface, electronics, shape, ownership) and the close.
  Every chapter was rebuilt by its own builder, then integrated: dupscan, a full build, errors in 2D and 3D, layout qa at
  settle and mid, and contact sheets at 384 px.
- **New on the page:** a `rate` pill (only for people who can edit the artifact) opens a panel to rate the slide 1 to 10
  with a note (F16.2: the ratings guide which information to condense, not which slides to cut). Ratings are stored in
  the artifact's database, collection `ratings`, one document per slide (`rateKey(slide.id)`); read them with the
  ArtifactData tool (`list` on `ratings`). The capability is declared once; publish later versions without
  `capabilities` so it carries forward.
- **Edit text (2026-11-05):** an `edit text` pill (editors only; key E) lets Brock tap any string on a slide and retype
  it. Edits live in the artifact's db, collection `edits`, one document per string: `{ slide, title, n, from, to, at }`
  (`edDocId` in 20-app.js). The deck shows them to every viewer (01-core.js `edTxt`, used by `text`, `rich`, `para`
  and `tw`). To fold an edit into the source, find `from` in the slide's code, replace it with `to`, then delete the
  document (ArtifactData `delete`) so the override doesn't linger. The capability declaration now has two rules
  (`ratings` and `edits`, both read view, write admin).
- **3D:** one shell with one seam (`3d/shell/shell-theseus-1seam.glb`), the optional bottom plate (solid 0.6 mm outside, an
  X of struts closing into triangles and a fine lattice inside; its FE study is `3d/shell/tools/plate_fe/`, run order in
  `final.js`), half-moon skates like the Viper V4 Pro's rear one, the clip-on lens carrying the plate-off dots, the GT01's
  tongue lying flat, TTC's five-pin optical encoder, and the side switches held by the shell.
- **How the work was built** (useful if you run builders in parallel): `python3 tools/build.py main --out=<name>
  --own=<files>` builds with the named files from `src/` and the rest from `deck/.snapshot/` (refreshed by the
  integrator), so builders don't see each other's half-done files. Checks: `tools/errs.js` (`READY_MS=60000 Q='&2d=0'` for
  3D), `tools/qa.js` (`T=settle` or `T=mid`), `tools/shoot.js` (`PAR=1` on a busy machine).
- **Follow-ups found on the way:**
  - The headline and before → after helpers exist once per chapter (`clk_hl`/`clk_ba`, `gld_head`/`gld_ba`,
    `shellHL`/`shellBA`, `srf_hl`/`srf_ba`, `own_ba`/`own_bars`, and Electronics' own). One shared helper would keep them
    in step.
  - `3d/pcb/pcb-layout.json` still carries the old antenna keep-out and calls U1's antenna a chip antenna; `pcb.js` flips
    the module at load, so the render is right and the JSON is not.
  - `SP` is declared in both `03-model.js` and `03-parts.js` (the later one wins; harmless today).
  - `callout()` now flips a label whose forced side points back across its own leader.
- **Pushing:** the session could not push (the repo isn't in its authorized set); the branch
  `claude/review-notes-rework` is complete locally and the work also reaches Brock as the live link and a patch.

## Open decisions for Brock
- The questions the deck is waiting on are in FEEDBACK.md, "Open with Brock". The ones below are older.
- 29 g budget vs 200 h target: built like the XA25, a 29 g wireless mouse leaves ~4.9 g for the battery (~140 mAh, ~146 h at 1 kHz); 250 mAh needs ~2.6 g cut elsewhere.
- Theseus price (the price Pareto shows a line, not a point).
- The raw Sora scan comes from findmymouse.com's viewer (sold there as a paid download, personal use). Brock says he made the scan; confirm with the site owner before publishing a mesh derived from it.
