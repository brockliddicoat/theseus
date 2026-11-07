# Theseus main PCB (`3d/pcb/`)

**0.6 mm, two layers (H3, 2026-11-06; F47.4, Brock: "0.6 mm, 5.63 g").** The board's path to its 5.6 g target (F42.2) is
built: plan 5, both variants, now **0.6 mm finished, two copper layers, half-ounce outer copper** (`tools/stackup.py`, one
place every tool reads: `T`, `LAYERS`, `CU`, `FAR`). Its top stays where it was in the mouse (5.03 mm over the pad: the
posts, the switches, the wheel's axle 12 mm up and the lens's focus are set from it); the underside comes up 0.4 mm. What
changed, and how it was checked:
- **Re-routed on two layers.** What ran on the inner L3 (power and long runs) runs on the bottom, L4, which also carries the
  underside's art (#63). The left channel (encoder, left switch, USB) leaves the PMIC's underside, runs down the board's left
  edge, round and under the art's QR and up through one column of vias left of the wordmark; the bottom's routes keep out of
  the QR, the wordmark and the fab block (`silk.art_zones`, `ART_KEEP`; the DRC checks it), so the art stays whole. The rest
  is the autorouter's (`tools/autoroute.py`; the bottom costs 1.25× the top per mm, a via 3 mm), each variant with its own
  fill-in (`routes_auto.py` A, `routes_auto_b.py` B: B's edge switch and right channel sit where A's runs). **DRC 0 (A and
  B), every net routed.** New rules: no via in or touching an SMD pad (the four-layer routing had eight vias biting into
  their pads; via-in-pad needs plugged, capped vias, so it is a question, not something the router does); other nets keep
  0.12 mm off the plated mounting holes' gold rings.
- **The ground is one piece** (`tools/gnd.py`: the build adds its repair vias; run on its own it is the check): with no L2 plane, the ground is the top pour, the bottom's
  art pour and the vias between. The triangle mosaic's corners are joined to their lattice vertices by 0.25 mm bars (the
  grooves still run nearly corner to corner), parts of the art too narrow for whole triangles are poured solid, a "repair"
  via goes wherever a cut-off piece overlaps the main ground on the other face (4 on A, 5 on B), and copper tied to no GND
  pad is removed (with the vias that only joined it). Result: one ground, no floating copper, on both variants.
- **Two placement changes, both small:** the module's VDD decoupling (C10, C11 under its bottom pads) moved apart (C11
  0.5 mm left, C10 0.3 mm right) to open one via site between them: on four layers the 1.8 V reached the module's B3 pad
  through a via in the pad; on two layers B3, C10's and C11's VDD pads were walled in by GND pads. CC1's via moved 0.15 mm
  off R3's pad. The encoder's footprint (ENCM) lost its two SMD feet pads (the lighter encoder has no frame to bend into
  feet) and gained two copper-free holes for its moulded locating pegs.
- **The stack-up shows:** the underside's fab line reads "2L 0.6mm ENIG" (was "4L 1.0mm ENIG"); X-ray shows the bottom's
  routes in teal through the board (no L2 veil); `pcb-layout.json` carries `thickness`, `layers`, `copperOuter_um`, `stackup`.
  The relief heights are drawn as for 1 oz (a 17.5 µm difference no view shows; drawn thinner, the gold pads sat level with
  the mask and the 2D twins hid them); the masses use the real stack.
- **The parts that ride on it:** the clip-on lens's optics hang from the board's top (`boardparts.js` `buildSnapLens`,
  `boardThickness`, PixArt's Z unchanged: the dome 2.63 mm under the top); the lighter encoder and the cored support
  (`3d/parts/scrollwheel.js`, see the parts README); the stand-in encoder in `pcb.glb` follows.
- **Numbers:** 5.68 g with everything the 5.6 g target covers (table below): 0.08 g over the target, 0.05 g over the 5.63
  the path predicted, because the encoder and support as drawn weigh 0.475 g and 0.202 g against the 0.45 and 0.16
  estimated. Bending stiffness: 21.6 % of the 1.0 mm board's (t³); stretched in its own plane, 60 % (t).
- **Not done here, said:** the USB pair is still 0.13 mm (see "Two layers: what it costs"); the battery's place was not
  moved then (0.47 mm back would have put the centre of mass at z 0); H5 moved it for EEMB's lighter pack (below).


**Board plan 5 (H1, 2026-11-06; Brock's approved plan, F30).** One mirrored outline (W 19.03, waist 15.42, one notch depth
3.61 mm for the side notches, the rear notch and the front trapezoid, every chamfer at 35.24°, every corner filleted at one
tangent length, 1.0 mm), the rear notch as long as the side notches (F30.25), the wheel bay centred on x 0, chamfered and
filleted the same way with a 0.35 mm gold trim, the USB-C receptacle 1.05 mm back and hanging 1.60 mm past the front, the
mounting holes in mirror pairs (MH1/MH2 +/-10.10, 29.50; MH3/MH4 +/-14.59, -2.25), SH1, SH2, LH1, LH2 dropped. The sensor
(PixArt PAW3970) as far forward as it goes and the Raytac **AN54LM-P20A** module behind it (black, its long meander antenna
at its front end facing the sensor, no 180° turn; keep-out x +/-6.6, layout z 7.95 to 12.25), equal 1.60 mm gaps down the
centre line; the nPM1300 PMIC in the left-middle spot; the battery JST (J2) opening to the back; the side-button JST (J3)
opening to the left wall; the rail test pads in a row at z 13.0. **Two builds**: A (`pcb.glb`, `pcb-layout.json`, the deck's
board) with the power switch over its window on the x +10 axis; B (`pcb-b.glb`, `pcb-layout-b.json`, renders) with a
right-angle slide switch at the right waist edge (on the top side, so the board stays one reflow, #92; plan 5 drew it on the
underside: a question for Brock). Every net routed (hand routes + `tools/autoroute.py`), DRC 0 for both. The underside's art
is the old design's, adapted (plan 5's zones). Build: `PCB_OUT=<dir> PCB_VARIANT=A|B python3 tools/build_pcb.py`. The
battery's place for the 2D drawings and the balance: `BATTERY` in `tools/board.py`; the balance: `python3 tools/balance.py`
(H2, F42.1: it sets the battery where the centre of mass lands at mouse z 0: front 3.99 mm behind the rear lobes, 2.03 mm
behind H1's place, at the same height. The model now has the board's screws at its holes, the bare board at its core's
centroid, the encoder and support inside the 5.6 g, the side switches (F44.2) and the shell's four boss posts, the last an
estimate until the 3D shell has them; `--h1` gives H1's model; the battery lead in `components.py` follows `BATTERY`).
H3 (F47.4): the board as built (0.6 mm, 2.25 g bare, the encoder 0.475 g, the support 0.202 g, all scaled to the 5.6 g
target) puts the board's centre of mass at mouse (+0.39, 6.58, +24.11) and the mouse's at z +0.13 with the battery where
`BATTERY` has it (centre z −26.98): z 0 wants it 0.47 mm further back (−27.45). Not moved: the shell's posts are still
estimates (S2 is placing the real ones), and 0.13 mm is inside their uncertainty. `balance.json` now goes to `work/`
(`--out=` to change it).
H5 (2026-11-06, F64.11: EEMB's 300 mAh LP402535, about 6.40 g, for Jauch's 8 g pack; Brock: "Move it back"): `BATTERY`
reads its pack from `research/data/batteries.json` (37.0 across, the product page's length, the larger of EEMB's two; 25.5
along; 4.3 thick: the maximums) and `balance.py` reads the budget from the deck (THESEUS: 27.71 g, the board 5.6 g; the shell
what is left). Run `mass.py` first (the board as built), then `balance.py`: at the 8 g pack's place the lighter pack left
the centre of mass 1.69 mm ahead of the middle; the battery's centre goes to mouse z −34.32 (layout `BATT_ZC` −31.44,
7.34 mm further back, same height), and the centre of mass is at z 0.00, 12.91 mm up, 0.68 mm toward the side buttons.
`tools/clear.py` (H2's clearance method as a tool, plus the bands, the skate dots, the side-button lead and the way out) checks
it against the shell: nearest 1.55 mm (the tail corner on the user's right, low), roof 4.02, rim below 2.85, sides 1.97,
bands 2.84; contact would start with the centre at about z −36.8. `balance.py` also writes `pcb-balance.json` (committed),
which `deck/tools/geo2d/key_parts.py` puts in KEY_PARTS.balance, so b07_balance's model is this one, place for place.
The 2D drawings (deck `boardMM`, `keyPlanMM`, the kit's mouse) come from these tools: deck/tools/geo2d/board2d.py and
key_parts.py. The text below is the v1 board's description (2026-11-04), kept for its method and honesty labels.

![top](shots/top_paper.png)

| | |
|---|---|
| ![hero](shots/hero_night.png) | ![exploded](shots/exploded_paper.png) |
| ![module](shots/module_night.png) | ![pmic](shots/pmic_paper.png) |
| ![keep-out](shots/antenna_keepout_night.png) | ![x-ray](shots/xray_night.png) |
| ![charge](shots/power_charge_night.png) | ![bottom](shots/bottom_night.png) |

`shots/compare_sora_v2_vs_theseus_{paper,night}.png`: the Sora V2 photo next to the Theseus top render, same scale,
numbered callouts on what changed.

## Files

| File | What |
|---|---|
| `pcb.js` | `buildPcb(opts) → THREE.Group` + state setters. Loads `pcb.glb` + `pcb-layout.json`. |
| `pcb.glb` | All geometry, 145.9k triangles, 6.36 MB (2.06 MB with the deck's meshopt FILTER compression; H3, 0.6 mm two-layer build; `pcb-b.glb` variant B). Nodes carry `extras` (`kind`, `ref`, `layer`, `value`, `label`, `smd`) → `userData`. |
| `pcb-layout.json` | Outline, antenna keep-out, component list (position, value, honesty label), every route and via, power-flow paths and nodes. Mouse frame (see below). |
| `pcb-mass.json` | The board as built, in grams (`tools/mass.py`, H3): as built with the encoder and support 5.68, board and parts 5.01, bare 2.25, the target 5.6, the stiffness shares. The deck's `BOARD_G` reads it (deck/tools/geo2d/key_parts.py → `KEY_PARTS.board.g`). |
| `test.html` | Standalone viewer (URL params below), sets `window.__ready`. |
| `shots/` | Finals at 2× (paper `#f7f6f2` and night `#0d0e0f`); `top_transparent.png` has an alpha background for slides. |
| `tools/` | Python generators: `board.py` (photo trace), `parts.py` (footprints + pin maps), `stackup.py` (thickness, layers, copper: H3), `routes.py` (hand routing), `autoroute.py` (grid router: `routes_auto.py` A, `routes_auto_b.py` B), `layout.py` (build + DRC), `gnd.py` (two-layer ground check), `board_geo.py` (pours, vias, mask relief, trim, inner layers), `silk.py` (silkscreen, bottom art, QR), `components.py` (3D parts), `power_paths.py`, `geom.py` (mesh + GLB writer), `build_pcb.py` (writes the GLB + JSON), `mass.py` (mass estimate), `compare.py` (Sora vs Theseus image), `render_finals.sh` / `shot.mjs` / `shot.sh` (renders). |

Rebuild everything (deterministic, ~10 s a variant): `cd 3d/pcb/tools && python3 build_pcb.py [--qr URL]` (`PCB_VARIANT=B`,
`PCB_OUT=<dir>`); re-route: `python3 autoroute.py` and `PCB_VARIANT=B python3 autoroute.py` (~5 min each); the ground:
`python3 gnd.py` (one piece, no floating copper);
DRC: `python3 layout.py` (currently **0 issues**); mass: `python3 mass.py`; comparison: `python3 compare.py paper|night`;
finals: `bash tools/render_finals.sh` (skips existing files).

## Driving it

```js
import { buildPcb, PCB_INFO } from './pcb/pcb.js';
import { buildGT01, buildMillMax3305, buildScrollWheel, buildRadioModule, buildSensorModule, buildSnapLens } from './parts/parts.js';
const pcb = await buildPcb({ placement: 'mouse', gt01: buildGT01, millmax: buildMillMax3305, wheel: buildScrollWheel,
  radio: buildRadioModule, sensor: buildSensorModule, lens: buildSnapLens });   // optional: the parts' module, sensor and lens
// with `radio`, U1 turns 180° (antenna to the rear) and the keep-out follows it: copper on every layer inside the new
// rectangle is dropped at load, the silk keep-out marking moves, U.layout.antennaKeepout is updated (the GLB is unchanged)
scene.add(pcb);
const U = pcb.userData;
U.setExplode(k);                      // 0..1 layers lift in a cascade: passives, PMIC + inductors, sensor (lens drops),
                                      //       module, Mill-Max sockets, switches (also slide outward), connectors, wheel
U.setPower(k, { mode, t });           // k 0..1, mode 'charge' | 'run' | 'both', t seconds: comet pulses (~14 mm/s) along
                                      //   the real copper: USB-C → nPM1300 → battery, or battery → bucks → module + sensor
U.setReflow(k);                       // 0 finished board; 0<k<1 one heat front crosses nose → tail: matte paste ahead,
                                      //   wetted joints behind, parts self-align as it passes; 1 done
U.setXray(k);                         // mask clears: L1 routing in copper, GND pour dimmed, the bottom's routes teal (two
                                      //   layers: no L2 veil; on four layers L3 teal, L2 a faint veil),
                                      //   via barrels; the bottom mask stays as a dark floor; antenna keep-out reads as void
U.setPress('L' | 'R', k);             // GT01 plunger (parts model: real 0.35 mm travel + contact snap). 'L' = SW1 = +X
U.parts['U1'], U.parts['SW1_MM2'] …   // every component node by refdes; U.layers[layer] lists them by explode layer
U.dispose();
```

Options: `placement` (`'mouse'` default: board top at y = 5.03, shifted −2.88 mm in z so the wheel axle meets the
shell's wheel centre (0, 17.03, 34.87); `'origin'`: board centred, top copper at y = 0), `boardY`, `boardZ`, `glb`,
`layout` (asset URLs), `gt01` / `millmax` / `wheel` (parts factories; without them same-footprint stand-ins show),
`encoderSide` (default `'left'`), `switchTilt` (20), `gt01Cover` (`'pink'`), `partMaterials`, `materials` (override
any PCB material by name), `pressTravel` / `pressExaggerate` (stand-in only). `useParts` is accepted and ignored.

**Deck integration notes.** No dynamic `import()` (factories are passed in, as `integration/entry.js` does); the GLB
loader has the meshopt decoder set, so the compressed GLB loads as is. Materials are matched **by name** (`mask`,
`mask_b`, `mask_cu`, `mask_tr`, `mask_cub`, `enig`, `edge_gold`, `silk`, `cu_l2`, `cu_l3`, `cu_via`, …); every GLB
material has unique factors so gltf-transform `dedup()` cannot merge them (verified: 35 materials and all 62 node
extras survive `integration/compress.mjs`). Shader effects (reflow front) run in board-local coordinates, so they
follow the group wherever the deck moves it.

`test.html` params: `view=hero|exploded|top|bottom|side|front|low|back|module|antenna|pmic|sensor|switch|usb`,
`ortho=1` (`halfh`, `cz`), `theme=paper|night`, `transparent=1`, `ground=0`, `placement`, `explode`, `power` + `mode`
+ `t`, `reflow`, `xray`, `pressL` / `pressR`, `hide=REF,…`, `lift=REF:mm`, `dir=x,y,z` + `margin`, `cam` / `target`
/ `fov`, `glb=url`, `parts=0` (stand-ins), `anim=1`, `hud=1`.

## Frame (handedness fix)

Mouse frame of `CONVENTIONS.md` (corrected): mm, **+X = the user's LEFT** (side-button side), +Y up, +Z forward,
right-handed. The board was authored in the photo's frame (top view, nose up, x = image right = user's right) and is
**mirrored x → −x at export** (geometry, winding and node transforms), so all text and QR codes read correctly.
Checked against the correction: the side-button connector J3 and its lead are at +X (12.0), the left main switch SW1
at +X (16.0), SW2 at −X; the power slide (in the Sora's square window) at −X; no flip was needed. In the Sora photo
(top side, nose up, text not mirrored) the blue encoder is image-left = **+X**, which is where this board's encoder
footprint is; the parts wheel defaults to −X since its handedness change, so `buildPcb` passes `encoderSide: 'left'`.
Top ortho shots: nose up, user's right on the right. The bottom shot turns the board over about its long axis (as on a
bench), so the user's left is on the right there.

## The board

- **Outline + holes**: traced from the de-rotated photo (0.72°) at 15.15 px/mm, cross-checked on the USB-C shell
  (8.94 mm), the 2.0 mm programming-pad pitch and the sensor pin pitch: **±1.5 %** [MEAS]. 38.64 × 57.52 mm
  (x ±19.32, z −5.02 … 52.5), 1863 mm² outline, 1532 mm² net of the wheel bay (14.4 × 17.5 mm), the square power-switch
  window (3.8 × 4.3 mm), sensor aperture, 4 mounting holes (2 × Ø2.9 plated rear, 2 × Ø2.2 front) and slots.
- **Stack** (F47.4, H3): 2-layer FR4, **0.6 mm** finished, 0.5 oz (17.5 µm) outer copper, ENIG. L1 signals + GND pour;
  L4 the bottom: its routes (the long runs and power crossings) and the GND pour cut into the triangle mosaic, its corners
  joined. Rules (own DRC): 0.12 mm clearance, 0.20 mm pour clearance, copper 0.65 mm from the plated edge, 0.45/0.2 mm
  tented vias, no via in a pad, antenna keep-out on all layers, the bottom's routes and vias out of the art's QR,
  wordmark and fab block; connectivity checked across layers, the ground by gnd.py. 120 vias on A (50 routing; 70 GND:
  the stitching fence along the edges and bays, QFN thermal vias, module GND vias, 4 repair). *Plan 5 as first built:
  4-layer FR4, 1.0 mm (the Sora's laminate reads the same in the photo), L2 solid GND, L3 power + long runs, 1 oz outer.*
- **Routing** (real pads to real pads): USB D+/D− routed as a pair through a flow-through ESD array to the module's
  USB pins; CC1/CC2 to local 5.1 k Rd; VBUS bus → TVS + bulk caps → the bottom's spine → nPM1300; VBAT (0.5 mm) to the battery
  JST + NTC; buck 1 (1.8 V) → module + sensor I/O; buck 2 → sensor core; TWI + interrupt PMIC ↔ module; sensor SPI +
  motion; switch NO/NC pairs (both throws, for debounce-free latching), encoder A/B, side buttons, power switch → PMIC
  SHPHLD (ship mode), SWD to test pads. Raised copper under glossy black mask with tented vias (relief modelled).
- **Gold trim**: plated outline edge + 0.35 mm ENIG band on top and bottom, plated wheel-bay and square-window edges,
  gold rings on the plated holes, gold pads and test points, Mill-Max flanges (tin shell, gold contact), Viper-V4-Pro-like.
- **Silkscreen**: Sora-style part outlines, refdes, pin-1 marks, polarity (+/BAT at the battery JST, cathode bar),
  **ON ↑ / OFF ↓** at the power switch (#100), dashed RF keep-out with "ANT", "THESEUS MAIN PCB V1.0", L/R switch marks,
  a 4.3 mm QR "WEB APP" (#90). Bottom (#63, no components): triangle-mosaic GND pour with a duotone gradient (ENIG
  triangles from one corner, silk-outlined triangles from the other), "THESEUS", a 7.2 mm QR "SCAN FOR THE WEB SOFTWARE",
  ON/OFF/POWER arrows at the window, rail test-pad labels, fab block (94V-0, 2L 0.6 mm ENIG; was 4L 1.0 mm). The QR encodes a
  **placeholder** (`https://theseus.example/software`): rebuild with `--qr <real URL>`.

## Two layers: what it costs (H3, F47.4)

- **Stiffness.** A plate bends with its thickness cubed (E t³ / 12): the 0.6 mm board keeps **21.6 %** of the 1.0 mm
  board's bending stiffness, and **60 %** of its stiffness stretched in its own plane (t). It leans on the shell's posts and
  ribs (b07_board's tie); where the posts land decides how far it sags under a click. No FEA behind either number.
- **The USB pair.** USB 2.0 high speed wants 90 Ω ± 15 % differential. With no L2 plane, the pair's reference is the other
  face's copper, 0.565 mm away. The pair is 0.13 mm wide and about 76 mm long (27 mm on the top, 47 to 49 on the bottom),
  its gap 0.15 to 0.87 mm (median 0.27 on the bottom, 0.37 on the top): about 120 Ω single-ended and 150 to 215 Ω as a
  pair (IPC-2141 microstrip, εr 4.3). About 90 Ω on this stack wants ~0.55 mm traces 0.15 mm apart over unbroken copper
  on the other face, or a coplanar pair with the pour beside it. The drawing keeps 0.13 mm, representative: which way is
  a question for Brock (the handoff's report, H3).
- **The ground.** Two faces and their vias, not a plane: `gnd.py` checks it is one piece with no floating copper (A and
  B). Return currents under the bottom's routes cross the top pour's cuts; the stitching fence and the repair vias are the
  representative answer, not a simulated one.
- **No via in a pad.** The four-layer routing had eight vias biting into SMD pads; now every via keeps 0.05 mm off them.
  The one place that forced a change is the module's B3 (VDD 1.8 V): C10 and C11 moved apart (C11 0.5 mm left, C10 0.3 mm
  right) for one via site between them, the 1.8 V reaching B3 on the top. A plugged, capped via in B3's pad would leave
  them where they were; a question for Brock.
- **The Mill-Max sockets.** The 3305's body is fixed (Ø1.473, 2.667 long, its flange 0.25 over the board): on the 0.6 mm
  board 0.4 mm more of it stands below the underside (1.81 mm instead of 1.41); its tip stays where it was in the mouse
  (the board's top did not move). It is soldered in (DigiKey lists the 3305 as "No Tail Solder"), so what changes is the
  joint: 0.6 mm of plated barrel to solder to instead of 1.0, the joint that holds the socket when a switch is pulled
  out. Mill-Max's minimum board thickness for it is not in the model; worth a line to them before the board is made.

## Components (all on the top side: one reflow pass)

Labels: [MEAS] traced from the photo · [DS] datasheet · [REP] representative · [PR] proposal · [MC] manufacturer claim.

| Ref | Part | Size (mm) | Label |
|---|---|---|---|
| U1 | Raytac nRF54LM20A module (footprint of the **AN54LM-20A**, HS USB), castellated, black substrate, nickel-silver can (no logos, no FCC ID: certifications "intended"), the long meander PCB antenna at the end facing the board's rear (`parts/boardparts.js` `buildRadioModule`, turned 180°) | 9.9 × 13.3 × 2.0 | [DS] footprint; [REP] antenna form (MDBT50Q-style, per Brock); keep-out 13.2 × 3.7 mm all layers under the antenna end, board z 13.75 → 17.45 (mouse z 10.87 → 14.57) |
| U2 | Nordic **nPM1300** QFN32 with exposed pad + 9 thermal vias | 5.0 × 5.0 × 0.85 | [DS] package, [REP] pin map |
| L1, L2 | 2.2 µH buck inductors, Isat > 350 mA, far from the antenna feed | 2.0 × 1.6 × 1.0 | [REP] part, [DS] requirement |
| C30–C36, C10–C11, C20–C22, C1–C2 | MLCCs (VBUS 1 µF / 2.2 µF + 100 nF, VBUSOUT 1 µF, VSYS + VBAT 10 µF 0603, buck outputs 10 µF, module 4.7 µF + 100 nF, sensor 1 µF ×2 + 100 nF) | 0402: 1.0 × 0.5 × 0.5; 0603: 1.6 × 0.8 × 0.8 | [REP] values |
| R1–R4 | 4.7 k TWI pull-ups, 5.1 k USB-C CC Rd | 0402 | [REP] |
| U3 | **next-gen PixArt FrameSync-class sensor (proposal)** as a small module board on 2 × 8 castellated half-holes, 1.2 mm pitch, label with a 2D code (`buildSensorModule`, from Brock's four photos) | 8.4 × 9.8 × 0.6 | [PR]; board z 4.0 (near the centre) |
| LENS | smaller snap-on lens, clear PC: imaging + illumination domes, a boss into the sensor aperture, a Ø1.7 peg with a split snap head at each end through the board (`buildSnapLens`) | body 5.2 × 9.6 × 2.2 (under the board) | [PR] (#37) |
| SW1, SW2 | Gateron **GT01** (parts builder model), on its 20° wedge, no locating peg (pcb.js caps the board's 1.0 mm peg hole beside each, still drilled in pcb.glb); 55 ± 5 gf, 0.35 ± 0.10 mm, 100 M clicks | 12.8 × 5.8 × 6.5 envelope | [REP] ([MC] figures); positions [MEAS] |
| SW1_MM1–3, SW2_MM1–3 | **Mill-Max 3305** claw receptacles (gold BeCu contact, tin shell) on 5.08 mm pitch | flange Ø1.956, body Ø1.473 × 2.667, hole Ø1.575 | [DS] dims (parts model) |
| J1 | USB-C 16-pin receptacle, 4 shell legs | 8.94 × 7.35 × 3.16 | [REP] part, [MEAS] position |
| U4 | USB ESD array, flow-through (USBLC6-2P6 class) | SOT-666 1.6 × 1.6 × 0.55 | [REP] |
| D1 | VBUS TVS (at the Sora's diamond position) | SOD-523 1.2 × 0.8 × 0.6 | [REP] |
| J2 | JST SH 3-pin side-entry, **turned sideways** (#71): VBAT / NTC / GND | 4.0 × 4.25 × 2.95 | [REP] |
| J3 | JST SH 3-pin side-entry for the side-button wires (#51): SB5 / SB4 / GND | 4.0 × 4.25 × 2.95 | [REP] |
| J2_plug, J3_plug + leads | mated plugs, 3 lightly twisted wires each (#69); battery lead with NTC bead + Kapton, side lead drawn as a stub | AWG ~32 | [REP] |
| SW3 | micro side-actuated slide in the Sora's square window → nPM1300 SHPHLD (ship mode) | 1.8 × 4.6 × 1.0 | [REP] |
| SW4 | SMD tact, middle click (next to the wheel support) | 3.5 × 2.9 × 1.65 | [REP] |
| WHEEL | parts builder magnesium wheel + POM axle + optical encoder + support | Ø22.74 × 7.0, axle 12 above the board | [PR] (parts) |
| ENC1, WB1 | TTC-style encoder + wheel bracket footprints at the Sora positions (stand-ins hidden when the parts wheel loads) | 3.8 × 10 / 5.4 × 7.9 | [MEAS] position, [REP] shape |
| TP1–TP13, FID1–3 | gold test pads (VBUS, VBAT, 1V8, GND, SWD…), fiducials | Ø0.9 / Ø1.6 THT / Ø1.0 | [REP] |

## Power: what the PMIC does (honest wording from the validation report)

USB-C VBUS (5 V; nPM1300 input 4.0–5.5 V with **22 V transient OVP**) → nPM1300 charger (32–800 mA in 2 mA steps,
**JEITA + NTC** on the battery lead, die-temperature limits) → battery. Battery → two **200 mA bucks** (1.8 V for the
module and sensor I/O; a second rail for the sensor core) → the loads. Only two inductors and a handful of MLCCs.
- *Faster charging*: the Viper V4 Pro charges at 0.169 A ≈ 0.55C (306 mAh); at 1C the CC phase roughly halves **if the
  cell is rated for 1C**: the PMIC is not the limit, the cell datasheet is. (Not "20× faster".)
- *Fewer power parts*: replaces 4–6 support ICs (charger, LDO, gauge + sense resistor, reset, watchdog) with one and adds
  JEITA, a gauge and a watchdog; **not** true against a bare TP4054 + LDO.
- *Safer battery / less heat*: a linear charger dissipates (V_in − V_bat) × I ≈ (5 − 3.7) V × 0.3 A ≈ 0.39 W; thermal
  regulation, JEITA and ship mode are what make it safer.
- *Manufacturing*: single-sided assemblies go through reflow once; double-sided boards need a second pass during which
  first-side parts hang upside down and re-melt (a source of dropped parts and re-flowed joints). `setReflow` shows the
  single pass.

## Mass estimate (`tools/mass.py`)

FR4 **1.85 g/cm³**, **0.6 mm** finished board (0.565 mm dielectric), copper 8.96 g/cm³ (two layers, 17.5 µm, on the real
copper areas), mask 2 × 20 µm. Component masses are typical values for the package class, not weighed parts; the
encoder and the support are as drawn (volumes × densities, `3d/parts/tools/wheel-mass.json`, H3).

| Item (F47.4, H3 2026-11-06: 0.6 mm, 2 layers; plan 5 as first built, 1.0 mm and 4 layers, in brackets) | g |
|---|---:|
| Laminate (1702 mm² core × 0.565 mm) [× 0.895 mm: 2.82] | 1.78 |
| Copper (L1 1189 mm², L4 1091 mm², 17.5 µm) + via barrels [four layers: 0.98] | 0.37 |
| Solder mask [0.10] | 0.10 |
| **Bare board** [3.91] | **2.25** |
| GT01 × 2 (~0.5 g each, typical micro switch) | 1.00 |
| Raytac module (geometry estimate) | 0.45 |
| USB-C receptacle | 0.40 |
| Sensor (0.25) + clip-on lens (0.07) | 0.32 |
| Mill-Max 3305 × 6 (0.03 g each from geometry; **Brock: 0.11 g each**) | 0.18 (0.66) |
| JST × 2, slide, tact, PMIC, inductors, passives, ESD, TVS, solder | 0.41 |
| **Board + on-board parts** [6.66] | **5.01** |
| Wheel assembly: six-arm magnesium wheel 0.900 + POM axle 0.116 (parts spec) + the lighter encoder 0.475 + the cored support 0.202 (as drawn) [encoder ~1.0, support 0.26: 2.28] | 1.69 |
| **Total, comparable to the Sora V2's "PCB & wheel" 8.29 g** [≈ 8.9] | **6.70 (7.18 with Brock's Mill-Max figure)** |

Leads and plugs are excluded (not in the Sora's 8.29 g either). The bare board is a third of it (2.25 of 6.70).
Uncertain lines: the Mill-Max sockets (Brock: 0.11 g each, +0.48 g on the 0.03 g modelled), the GT01s (0.5 g each,
typical, not weighed), the encoder and support (from their 3D models, not weighed parts).

**One board.** Brock: "we don't have a front and back pcb, it'll be a single ~5.6g pcb." Every scene has exactly one
board: `pcb.glb` (one outline, top-side assembly), the lattice's single PCB stand-in, none in the shell.

**5.6 g is the target (F42.2, Brock: "Keep 5.6 g as target"); the board is built on its path (F47.4, Brock: "0.6 mm,
5.63 g").** The film stays at 29.31 g and calls the board's figure a target. It covers the board with everything on it,
the wheel's encoder and support included. The model is the path's end, as built: 0.6 mm, two layers, half-ounce outer
copper, the lighter encoder, the cored support (F21.11's "keep it as 1mm for now" held until F47.4). `mass.py` prints the
path and writes it to `work/mass.json` (`target`: each step, the stiffness, the uncertain lines):

| | g | total (g) |
|---|---:|---:|
| Plan 5 as first built: 1.0 mm, 4 layers (1 oz outer, 0.5 oz inner), board + parts 6.66, encoder ~1.0 (hollow-shell estimate), support 0.26 | | **7.92** (2.32 over) |
| 1. Laminate 1.0 → 0.8 mm finished (1702 mm² × 0.2 mm × 1.85 g/cm³) | −0.63 | 7.29 |
| 2. 4 → 2 layers (no GND plane, no inner power layer; their copper becomes laminate at the same thickness) | −0.13 | 7.16 |
| 3. The lighter encoder as drawn, 0.475 g: no nickel-silver frame, 0.4 mm housings, the Hall IC on its own small board (estimated −0.55, to ~0.45 g, with the IC on the main board) | −0.53 | 6.63 |
| 4. The cored support as drawn, 0.202 g: a tube post, a slotted foot, the seat solid (estimated −0.10, to ~0.16 g) | −0.06 | 6.58 |
| 5. Laminate 0.8 → 0.6 mm | −0.63 | 5.94 |
| 6. Outer copper 1 oz → 0.5 oz (35 → 17.5 µm) | −0.25 | 5.69 |
| 7. Re-routed on two layers, as built (the bottom's routes, the art pour's joints, the repair vias) | −0.01 | **5.68** |
| **Target** | | **5.60** |

**It lands at 5.68 g, not 5.63:** 0.08 g over the target, 0.05 g over Brock's figure. Steps 1, 2, 5 and 6 came in as
estimated; the encoder and the support, drawn, weigh 0.475 and 0.202 g against the 0.45 and 0.16 estimated (the Hall IC
keeps its small board, 0.066 g: on the main board it would sit ~10 mm from the magnet; the support's seat stays solid).
The 0.08 g left is a question for Brock (the handoff's report, H3), not something the model hides. Where it could come
back, each the 3D builder re-run with the change (none applied): the encoder's housings 0.40 → 0.35 mm walls (−0.032 g),
its sensor board 0.5 → 0.4 mm (−0.013), the support post's walls 0.55 → 0.45 mm (−0.011), its foot 2.4 → 1.8 mm tall
(−0.013), its seat 0.6 mm shorter along the axle (−0.010). The first three bring it to 5.63 g, all five to 5.60; each
thins a moulding that is already under general moulding guidance (micro-moulding). The Hall IC on the main board (the
first estimate's assumption) would save 0.097 g but sits 12 mm from the magnet's centre, 0.3 to 0.6 mT against ~110 mT
at 0.4 mm: not recommended. A 0.5 mm board would save 0.32 g at 12.5 % of the 1.0 mm board's bending stiffness.

What it says: the thickness is the big lever (0.63 g per 0.2 mm); fewer layers barely help by weight at the same
thickness; the encoder's frame was the heaviest single part to lose (0.50 g as drawn). The cost: **bending stiffness 21.6 %**
of the 1.0 mm board's (in-plane 60 %), the USB pair's impedance, and the Mill-Max sockets' solder joints (see "Two layers:
what it costs").

## Shots (`shots/`, 2×)

`hero_{paper,night}`, `top_{paper,night}`, `top_transparent` (alpha), `bottom_{paper,night}`, `side_{paper,night}`,
`exploded_{paper,night}`, `module_{paper,night}` (module + antenna end), `antenna_keepout_{paper,night}` (X-ray with the
module and wheel removed: the copper-free keep-out), `pmic_{paper,night}` (nPM1300 + inductors), `power_charge_*`,
`power_run_*`, `xray_{paper,night}`, `xray_hero_night`, `reflow_{paper,night}`, `reflow_pmic_night`,
`switch_hotswap_{paper,night}` (SW1 lifted out of its Mill-Max sockets), `compare_sora_v2_vs_theseus_{paper,night}`.

## Metal near the antenna (H2, 2026-11-06)

Raytac publishes no keep-out for the AN54LM-P20A (its datasheet and design guide are behind project registration;
research Q1), so `antennaKeepout` stays representative: the module's antenna end and 0.8 mm past it, x ±6.6, layout z
7.95–12.25. The one published rule found is Taoglas's PCB antenna note (APN-13-8-001.A, research/FILLS.md b09-1):
"clearances of minimum 4mm are kept from other metal components" and "20mm or more for best gain and radiation
efficiency". Distances in the board's plane from each part's metal (pcb.glb), to the keep-out / to the antenna (the
module's front 3.5 mm, x ±4.95):

| part | to the keep-out (mm) | to the antenna (mm) | against Taoglas |
|---|---:|---:|---|
| J3, side-button connector (its solder) | 4.50 | 6.15 | over the 4 mm minimum; kept |
| J2, battery connector | 4.65 | 6.30 | over the 4 mm minimum; kept |
| SW3, power switch (variant A) | 4.85 | 6.53 | over |
| U2, nPM1300 | 4.70 | 6.17 | over |
| battery lead | 8.67 | 9.83 | over |
| **the battery** (its pouch is metal foil; F42.1 place) | **19.55** | **19.55** | just under the 20 mm best (17.52 at H1's place) |
| R1, SDA pull-up (0402) | **0.83** | **2.48** | **under 4 mm** if the rule covers small passives |
| C35, VSYS cap (0603) | 2.01 | **3.81** | **under 4 mm**, same reading |
| C36, VBAT cap (0603) | 3.06 | 4.90 | over |

J2 and J3 break no rule I can source, so they stay where plan 5 put them. R1 and C35 are outside the keep-out but closer
to the antenna than Taoglas's 4 mm. Module makers usually ask only that the keep-out stays clear, so this is a question,
not a fault: moving R1 about 1.6 mm and C35 about 0.3 mm outboard would meet it (a placement change and a re-route,
left for the next board round, F21.11).

## Measured vs representative, and known gaps

- **Measured** from the photo: outline, holes, cut-outs, switch / encoder / bracket / USB-C / TVS positions (±1.5 %).
  Everything else is datasheet (module, PMIC package, Mill-Max), representative (passives, connectors, routing, pin
  maps) or proposal (sensor, lens, wheel).
- **Shell fit** (for the lead): with the axle aligned to the shell wheel centre, the USB-C receptacle face lands at mouse
  z ≈ 51.2, about **4.5 mm behind** the shell's USB opening (z 55.78): the photo's wheel-to-USB spacing (16.4 mm) is
  shorter than the shell's (20.9 mm). Either the nose tab grows or the receptacle moves forward. The sensor centre lands
  at mouse z ≈ +1.1 vs the shell's z = 0.
- Which of the Sora's two rear connectors is battery vs side buttons is inferred, not verified (the rest of the Sora
  identification comes from the validation report: Omron D2FP-FN2, nRF52840, PAW3395, TTC encoder).
- GT01 tilt is the parts default 20° (Gateron's cutaway); the scan suggests ~25°, Brock recalls 30°.
- The parts wheel models no middle-click mechanism; the board keeps an SMD tact (SW4) beside the support.
- `setPress` uses the real 0.35 mm travel (subtle); the parts GT01 has its own `setCutaway` for the snap.
- Power-flow ribbons are a visualisation along the real copper (speed is illustrative, not physical).
- Materials: three.js ignores a material's `envMapIntensity` when it falls back to `scene.environment`;
  `pcb.js` binds the environment per material at render time so the calibrated values (matte black mask, ENIG) hold.
  Flat black surfaces also pick up the studio rim light near the mirror direction of the 3/4 views; the mask uses a low
  `specularIntensity` (F90) for that.
