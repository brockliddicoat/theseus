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

## Status (update this section as work lands)
- [x] Deck restored and published (v0, old look, XBAB grey).
- [ ] Design system v2 + exemplar slides (cover, 29 g budget, battery chemistry, Zaunkoenig zero-gram, Pareto).
- [ ] Sourced comparison datasets in `research/data/`.
- [ ] 3D: shell from scan + Theseus features; PCB; small parts; lattice arches.
- [ ] Chapter rebuild on the new system (step-further beats, comparisons, lost idea sheets, 3D integration).
- [ ] End-to-end check, publish, push.
