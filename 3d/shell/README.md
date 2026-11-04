# Theseus shell (`3d/shell/`)

The hero shell of Theseus: the **Ninjutso Sora V2/V3 shape rebuilt from Brock's own scan**, cleaned into an
injection-moulded-looking surface, split into real parts along the scan's own seams, and then given the Theseus
gestures from Brock's doc. Two variants ship from the same pipeline:

| variant | what it is | file |
|---|---|---|
| `theseus` (default) | Sora shape + Theseus gestures (#17, #58, #29, #80, #31, #75, #10, #11, #52, #37, #32/#36/#35, #62, #33/#61, #84/#30/#7 via the parts wheel) | `shell-theseus.glb` + `.json` |
| `sora` | the faithful, unbranded Sora V2 base (scan seams, curved rear cutouts, centre split, original side-button gap). Use for "before / after" | `shell-sora.glb` + `.json` |

## Handedness (read this first)
three.js is right-handed. With **+Y up and +Z forward (nose)**, the user's **left is +X** and the user's **right is −X**.
(CONVENTIONS.md originally said "+X = user's right"; the lead has corrected it.) The scan is in this physical frame and
so is everything here:

- side buttons, the divider and the gold Θ are on **+X** (user's left);
- `triggerL` = left click = **+X** trigger, legend "LT"; `triggerR` = right click = **−X** trigger, legend "RT" + the serial;
- `setClick('L'|'R')` drives exactly those; side-button index **0 = front (forward) button, 1 = rear (back) button**.
- `lib/studio.js` `VIEWS.threeQuarter` ([-0.78, 0.62, 0.95]) looks at the **right** side (no buttons) with the nose to the right — i.e. the mirror composition of the RTINGS photo. Use `SHELL_VIEWS.hero` (fitted to the photo) instead.

## Files
| file | what |
|---|---|
| `shell.js` | `buildShell(opts) → Promise<THREE.Group>`, `SHELL_VIEWS`, `applyView(camera, view)` |
| `standins.js` | stand-ins with the frozen `3d/parts/` signatures (wheel, dot skate, M2 screw); used only if `../parts/parts.js` is missing |
| `shell-theseus.glb` / `.json` | geometry (named nodes, exact normals, seam occlusion in COLOR_0) + mechanical metadata (hinges, wheel, skates, screws, sensor, footprint) |
| `shell-sora.glb` / `.json` | the Sora base variant |
| `test.html` | standalone page, see "Test page" |
| `shots/` | 2× finals, both themes, plus photo comparisons |
| `tools/` | the Python pipeline (below); `tools/render_finals.sh` re-renders `shots/` |
| `work/` | intermediates incl. scan-derived data — **git-ignored, local only** (contains the merged scan) |

## Driving it
```js
import { buildShell, SHELL_VIEWS, applyView } from '../shell/shell.js';
const shell = await buildShell({ variant: 'theseus', colorway: 'black', theme: 'paper' });
scene.add(shell);
applyView(camera, 'hero');            // or 'top' | 'left' | 'front' | 'bottom' | 'exploded' | 'cuEngrave' | 'cuChamfer' | 'cuWheel' | 'heroRear' ...
shell.setClick('L', k);               // k 0..1 -> trigger rotates about its hinge; 0.5 mm at the front edge (x opts.clickExaggeration)
shell.setScroll(rad);                 // + = top of the wheel moves toward +Z (scroll up), parts-API convention
shell.setSideButton(i, k);            // i 0 = front, 1 = rear; slides 0.45 mm along -X on its rails (#80)
shell.setExplode(k);                  // staggered: triggers up/out, wheel up, bay+centre cap up, buttons out, plate/screws/skates down, USB-C forward
shell.setXray(k);                     // shell fades to a fresnel edge-lit ghost (additive on night, dark rim on paper); hides the core
shell.setColorway('black' | 'white' | 'grey' | 'forged');
shell.userData.parts                  // body, triggerL/R (hinge pivots), explodeL/R, sideFront, sideRear, wheel, wheelBayGroup, bridge,
                                      // plate, lens, screws[], skates[], core, usbC, engraveSerial, engraveLT, engraveRT, sideMark
shell.userData.meta                   // hinge pivots/axes, wheel centre, skates, screws, sensor, footprint, triangle counts
shell.dispose();
```
Options: `variant`, `colorway`, `theme` (x-ray tint), `clickExaggeration` (1 = physical 0.5 mm), `grain` (baked-ceramic micro
texture, default 1), `core` (default true: a black stand-in for the internals so seams and the lattice don't show daylight; pass
`false` when the PCB is assembled inside), `wheelEncoder` (default false: the parts wheel's encoder belongs to the PCB assembly
and otherwise pokes through the left trigger), `skates` ('POM' | 'PTFE'), `parts` (inject a parts module), `glbUrl`, `metaUrl`.
All setters are pure functions of their arguments and clamp k to [0, 1].

Integration bridge: `R3D.register('shell', async (studio) => { const s = await buildShell({theme}); studio.scene.add(s);
return { root: s, update(st) { s.setExplode(st.explode||0); ... }, camera(cam) { applyView(cam, 'hero'); } }; })`.

## Test page
`node tools/shot.mjs shell/test.html out.png --q="view=hero&theme=night&colorway=forged"`
Params: `view` (any `SHELL_VIEWS` key), `theme`, `variant`, `colorway`, `click=L:1`, `scroll=0.6`, `side=0:1`, `explode=0.7`,
`xray=0.5`, `exag=6`, `grain=0`, `shadows=0`, `t=<s>` (demo timeline: L click, R click, scroll, side buttons, explode, x-ray),
`pick=x,y;…` (debug raycast → console). `view=bottom` turns the mouse onto its back like a product shot.

## How it was built (pipeline, `tools/`)
1. **Scan inspection** (`inspect_scan.py`, `groove.py`, `sections.py`): the normalized scan (75,000 verts after merging
   duplicate patch vertices, 150,000 tris) is **watertight but genus 1** (a handle at the wheel), scanned in ~25 patches
   (the left side is 10+ fragments), **bottom fully scanned** (2 crescent skates, sensor window, switch; diagonal scanner
   stripes), **wheel present** in the scan (circle fit Ø22.74 mm, centre y 17.03 / z 34.87), seams visible as 0.3–0.5 mm
   grooves, side buttons and the chin/USB-C recess present. A groove field (vertex offset from a smoothed copy along the
   normal) exposes every seam; the trigger's lower seam is single-valued as y(φ) around an axis at z = 10 (flat at
   y = 10.0 across the nose, rising to 32 at the rear-cutout junction), the rear "smile" is z = 4.84 + 0.00594x² + …
   (RMS 0.05 mm), the centre split is x ≈ 0 (0.38° / 0.3 mm normalisation residual), and the scan's mirror plane is
   x = 0 to 0.05 mm / 0.04°.
2. **Fair skin** (`prep_data.py`, `control_mesh2.py`, `loop.py`, `fit_skin.py`): target points = scan minus seam bands
   (1.6 mm), wheel, side buttons, USB recess, flat bottom, logo; **mirrored** about x = 0 (the −X wall fills the button
   area; the result is symmetric). A genus-0 control mesh (Poisson → isotropic remesh, 1.5 mm, refined to 0.75 mm at the
   nose and the rim band so the lip edge and rim crease survive) is fitted as a **Loop subdivision surface** (2 levels)
   by ICP-style sparse least squares (point-to-plane + 5 % point-to-point, thin-plate regulariser λ = 40).
   Fit: targets → surface **RMS 0.041 mm, p95 0.080, p99 0.128 mm**.
3. **Implicit skin** (`skin_grid.py`, `sdf.py`): level-3 samples (913k) → an IMLS signed-distance field, made exactly
   symmetric, cached on a 0.2 mm grid (exact within ±2.2 mm of the surface).
4. **Parts as SDFs** (`features.py`, `build_parts.py`): every part = skin ∩ analytic cutters with *rounded* booleans, so
   every moulded edge has a real radius: flat base at y = 0.65 (r 0.45), hollow walls (body 1.2 mm, triggers 1.4 mm),
   seams 0.25 mm wide with 0.28 mm edge rounds; the lip/side seam widens smoothly to 0.65 mm at the nose so a 0.5 mm
   click has clearance; rear-cutout ↔ side-seam junction on a 2.2 mm radius. Marching cubes (0.2 mm) → QEM decimation →
   Newton projection onto the exact field → **normals from the field gradient** (no faceting at any zoom) → seam-cavity
   occlusion per vertex (COLOR_0; IBL otherwise lights the inside of 0.25 mm gaps).
5. **Decals** (`decals.py`): Inter Display / Inter glyph outlines → earcut → subdivided to ≤0.35 mm → Newton-projected onto
   the skin → lifted 12–15 µm. Geometry, not textures, so they stay crisp at any zoom.
6. **Export** (`export_glb.py`) → one GLB per variant + JSON metadata. **Validation** (`silhouette.py`,
   `fit_rtings_cam*.py`, `validate.py`, `zebra.py`) after every major change; **renders** via `test.html` + `tools/shot.mjs`.

## Scan-derived vs modelled
| scan-derived (measured) | modelled (designed here) |
|---|---|
| the whole outer surface (fitted, symmetrised, fair) | flat base plane (y = 0.65) and its 0.45 mm edge round |
| centre split, rear "smile" seam (Sora variant), trigger side/lip seam | Theseus straight rear cutout (#17), centre cap ahead of the wheel (#58) |
| wheel opening (±4.7 × 28.4–46.4 mm), wheel centre & diameter | wall thicknesses, seam widths/rounds, click-clearance taper |
| side-button outlines and proudness (0.44 → 1.14 mm measured; modelled 0.7 → 1.2) | button pillow profile, rails (#80), divider rib (#29) |
| USB-C recess position/size (11.4 × 6.5 mm) | USB-C receptacle (USB-IF nominal 8.94 × 3.26) |
| gold-mark location (raycast of the RTINGS photo's 空) | Θ mark, serial / LT / RT engravings |
| — | bottom: rim with skate pads, modular plate, triangle lattice, sensor window, screws (#31 #75 #10 #11 #52 #37) |
| — | wheel bay, core light-blocker, hinges, explode/x-ray behaviour |

## Theseus gestures (doc idea numbers) and the calls I made
- **#17 straightened rear trigger cutouts**: z = 6.0 + 0.00055x² (0.45 mm of curve over the half-width, so it doesn't read concave in perspective); turns down into the side seam on a 2.2 mm radius.
- **#58 no split ahead of the wheel**: two independent triggers cannot share material ahead of the wheel, so the only physical way is a fixed **centre cap** between them. It is a separate part on the wheel bay ("inverted scroll wheel holder" note), the width of the wheel opening, and it stops at the lip seam so the lip line stays continuous across the nose. Honest trade-off: ahead of the wheel there are now two hairlines (cap edges) instead of one split, but neither edge belongs to both triggers, so a finger resting at the centre can't jam both clicks. It reads as a deliberate wheel channel in the hero/top views; judge `shots/theseus-cu-chamfer-*.png`. The Sora variant keeps the original split for comparison.
- **#46 flat front trigger cutouts**: the lip seam is exactly y = 10.0 across the nose (the scan was already flat to ±0.2 mm).
- **#32 / #36 / #35 serial**: "099" laser-etched (tone-on-tone, smoother than the coating) on the **right** click, rear-outer area, away from the finger-rest zone; 6.4 mm cap height, Inter Display Medium, reads correctly **for the user** (`SHELL_VIEWS.heroRear`). Design note: rotated 180° (e.g. the RTINGS-angle hero) "099" reads as "660"; any serial built from 0/6/9 has this ambiguity. A small "Nº" prefix or a period would disambiguate; I left the serial as Brock specified.
- **#62 LT / RT**: Inter SemiBold 2.3 mm, front-outer corners (GMK-style top-left placement mirrored for symmetry), same etch material.
- **#34 shallow engravings**: modelled as a 12 µm etch layer (texture change, no material removed), per Brock's comment that laser marking changes texture rather than stripping material.
- **#33 / #61 side decal**: a monoline geometric Θ (5.0 mm, 0.46 mm stroke, floating bar) in gold, exactly where the Sora's gold 空 sits (left front side wall, under the lip seam).
- **#84 / #30 / #7 wheel**: the `3d/parts/` magnesium wheel (Curiosity-style chevron grousers, spoked web, POM axle) is used automatically, placed on the scan's wheel centre (Ø22.4 in a 9.4 × 18 mm opening); the encoder is omitted here (belongs to the PCB assembly). `standins.js` has a 6-triangular-window stand-in with the same signature.
- **#29 divider** between the side buttons: a rounded rib of the unibody wall, 1.05 mm proud (just above the buttons) so the thumb can rest without actuating either; the gap was widened from 2.2 to 3.6 mm to fit it. **#80 rails**: two bars on each button's inner face; buttons translate along −X.
- **#31 modular plate / #75 triangle lattice / #10 2 dots per corner / #11 no cut-outs under skates / #52 rim screws clear of skates / #37 small lens window**: the body keeps a 3.2 mm rim with four solid corner pads carrying 8 × Ø6.5 dot skates (the mouse works without the plate, as Brock's notes require, so skates live on the rim); the plate fills the opening with complete equilateral triangles only (6.2 mm pitch, 1.15 mm struts, rounded 0.9 mm corners); four M2 screws sit at the plate edge (heads half on rim, half on plate) clear of every pad; the sensor window is Ø6.6 at the centre (Kim et al. 2020: centre is the best compromise).
- **#5 / #16 material**: matte black baked-ceramic look over CF-PP (with a subtle micro-grain normal texture that fades with distance); colorways `white`, `grey`, and **#12** `forged` (satin clear coat over procedural chopped-carbon flakes that only show in highlights — reads black off-axis).
