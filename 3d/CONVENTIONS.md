# Theseus 3D — shared conventions (read this first)

## The project
**Theseus** is Brock Liddicoat's concept flagship wireless gaming mouse (Brock owns Nitrite Labs and designed the shape of the Finalmouse Starlight X / SLX). The deck that sells it is *In Pursuit of an Objectively Better Mouse — Optimization Over Opinion*: a science-first, motion-designed film of ~100 incremental improvements. **Weight target: 29 g.** Brock's standard is "ridiculously high production value and polish", inspired by ZOWIE, Razer, Logitech and XBAB promotional material. He will judge every render by eye against real products: lazy, blobby or low-detail geometry is the failure mode he has already rejected once (a procedural 3D mouse in an earlier session "looked like a blob").

The shape is a **placeholder**: Brock chose the **Ninjutso Sora V2** (same shape as the Sora V3) as the base, "then adding the gestures I want to it". Theseus features are listed in `/home/claude/theseus/research/brock-doc-in-pursuit.txt` (his doc; numbered ideas) and checked in `/home/claude/theseus/research/validation-report-2026-11-03.md` (research pass: part numbers, verdicts, honest wording). Read both before modeling anything that carries a claim.

## Files
- `refs/scan/sora-normalized.ply` / `.npz` — **Brock's own 3D scan of a Sora V3** (77,795 verts, 150,000 tris, already in mm), normalized to the axes below: bbox 62.49 W × 38.13 H × 119.21 L mm. Width profile matches the top photo to 0.78 mm RMS. It is a raw scan: some noise, possibly holes, no texture. Local reference only — do not commit it or publish the raw mesh.
- `refs/scan/sora-v3-scan.ply` — the raw scan (original orientation).
- `refs/photos/` — `sora-v2-top.webp` (top, front at image top), `sora-v2-side.webp` (left side, front at left), `sora-v2-three-quarter-rtings.jpg` (front-left 3/4: shows the **chamfer above the scroll wheel**, the button seams, gold 空 decal on the left front side), `sora-v2-in-hand-side.jpg`, `sora-v2-pcb-8.29g.jpg` (Sora V2 PCB + wheel, 8.29 g), `viper-v4-pro-pcb.jpg` (gold edge trim, stamped antenna, shielded module), `raytac-module.jpg`, `gateron-gt01-*.jpg` (3 GT01 images).
- `refs/derived/photo_profiles.json` — width/height profiles traced from the photos (front→back, 101 samples, divided by length). Photo heights are under-read where the top catches highlights; trust the scan for height.
- Official dims: Sora V2 119.2 × 59–62 × 37.3–37.7 mm, 39 g (EloShapes 119.2 × 62.0 × 37.7). RTINGS measured 120 × 63 × 38 mm, 40.9 g.

## Coordinates and units
- **Millimetres.** **+Y = up (Y = 0 is the pad), +Z = forward (toward the scroll wheel / nose), +X = the user's LEFT.** Footprint centred at X = 0, Z = 0. Right-handed, as three.js is: with +Y up and +Z forward, the user's right is −X. (An earlier version of this file said "+X = the user's right"; that was a left-handed reading and wrong.)
- Side buttons are on the user's left, which is **+X**. In a top view with the nose at the top of the image, +X is image-left.
- The scan is not mirrored: its side buttons sit at +X.

## Stack
- three.js r187 (`/home/claude/theseus/3d/node_modules/three`), ES modules, imported as `three` and `three/addons/...` through an import map:
  `<script type="importmap">{"imports":{"three":"/node_modules/three/build/three.module.js","three/addons/":"/node_modules/three/examples/jsm/"}}</script>`
- Shared look: `lib/studio.js` → `createStudio({canvas, theme:'paper'|'night'})` (AgX tone mapping, RoomEnvironment IBL, key/rim/fill lights, soft ground shadow, `frame(obj,{view})`, `ortho(obj,view)`) and `materials()` (shell, mask, gold, copper, silk, steel, magnesium, brass, POM, PTFE, epoxy, ceramic, clear/pink transmission, rubber, XBAB yellow accent). Tune or extend these freely, but keep one coherent look; document changes. Note: in the first smoke test the "black" shell rendered mid-grey and the solder mask looked pale because the IBL reflections are strong: calibrate materials against the reference photos (matte black should read near-black with soft highlights).
- Deck backgrounds: paper `#f7f6f2` (XBAB light grey) and night `#0d0e0f`. Accent yellow `#fdc316` (XBAB).
- Python tools available: numpy, scipy, scikit-image, opencv, trimesh, manifold3d (robust booleans), shapely, matplotlib, PIL. `pip install --break-system-packages <pkg>` works for PyPI; `npm install` works in `3d/`.
- Headless screenshots: `node tools/shot.mjs <page relative to 3d/> <out.png> [--w=1600 --h=900 --q="a=1&b=2" --scale=2]`. It serves `3d/` (and `/refs/...` from `theseus/refs/`), loads the page in Chromium with SwiftShader WebGL, waits for `window.__ready === true` (or `window.__error`), and saves the PNG. SwiftShader is slow: keep test renders ≤ 1600×900 at scale 1 while iterating; use `--scale=2` for finals. Look at your screenshots (the Read tool shows images) and iterate until they hold up to a close look.

## What every asset delivers
In its own folder (`3d/<asset>/`):
1. `<asset>.js` — an ES module exporting `build<Asset>(opts) → THREE.Group`, with `group.userData.parts` (named sub-objects for animation) and explicit state setters (e.g. `setExplode(k)`, `setPress(side, k)`, `setScroll(rad)`, `setXray(k)`) so the deck can drive it from its own timeline. No globals; dispose-safe; deterministic.
2. Heavy geometry as files next to it (`.glb` via GLTFExporter, or compact binary `.bin` + loader), loaded by the builder. Budget for real-time web: shell ≤ ~200k triangles, PCB ≤ ~300k (instance repeated parts), each small part ≤ ~50k.
3. `test.html` — standalone page using `lib/studio.js`, with URL params for view/theme/state/time, that sets `window.__ready`.
4. `shots/` — finals at 2× of the key views and states (hero 3/4, top, side, exploded, the animation's key moments), on both themes.
5. `README.md` — what was built, how, dimensions, what is measured vs representative, known gaps, and how to drive it.

## Honesty labels (on-screen claims must match)
- GT01 has no public datasheet: its model is **representative** (55 ± 5 gf, 0.35 ± 0.10 mm travel, 100 M clicks, "Zero Preload" are manufacturer claims).
- The sensor is a **"next-gen PixArt FrameSync-class sensor (proposal)"** in a generic package — never name it PAW39xx or Focus Pro.
- Module: **Raytac AN54LM-20A** (nRF54LM20A, chip antenna, 9.9 × 13.3 × 2.0 mm; certifications "intended").
- PMIC: **Nordic nPM1300** (QFN 5 × 5 mm or WLCSP 3.1 × 2.4 mm; 2 bucks need inductors).

## Coordination
Several builders work in parallel (shell, PCB, parts, lattice). Stay inside your folder; read others' folders but don't edit them. If you need something from another asset, use a clearly marked stand-in with the same interface and note it in your README.
