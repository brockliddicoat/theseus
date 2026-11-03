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
