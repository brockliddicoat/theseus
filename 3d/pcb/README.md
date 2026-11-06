# Theseus main PCB (`3d/pcb/`)

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
battery's place for the 2D drawings and the balance: `BATTERY` in `tools/board.py`; the balance: `python3 tools/balance.py`.
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
| `pcb.glb` | All geometry, 141.8k triangles, 5.45 MB (1.78 MB with the deck's meshopt FILTER compression). Nodes carry `extras` (`kind`, `ref`, `layer`, `value`, `label`, `smd`) → `userData`. |
| `pcb-layout.json` | Outline, antenna keep-out, component list (position, value, honesty label), every route and via, power-flow paths and nodes. Mouse frame (see below). |
| `test.html` | Standalone viewer (URL params below), sets `window.__ready`. |
| `shots/` | Finals at 2× (paper `#f7f6f2` and night `#0d0e0f`); `top_transparent.png` has an alpha background for slides. |
| `tools/` | Python generators: `board.py` (photo trace), `parts.py` (footprints + pin maps), `routes.py` (hand routing), `layout.py` (build + DRC), `board_geo.py` (pours, vias, mask relief, trim, inner layers), `silk.py` (silkscreen, bottom art, QR), `components.py` (3D parts), `power_paths.py`, `geom.py` (mesh + GLB writer), `build_pcb.py` (writes the GLB + JSON), `mass.py` (mass estimate), `compare.py` (Sora vs Theseus image), `render_finals.sh` / `shot.mjs` / `shot.sh` (renders). |

Rebuild everything (deterministic, ~10 s): `cd 3d/pcb/tools && python3 build_pcb.py [--qr URL]`;
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
U.setXray(k);                         // mask clears: L1 routing in copper, GND pour dimmed, L3 teal, L2 a faint veil,
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
- **Stack**: 4-layer FR4, **1.0 mm** finished (the Sora's laminate reads the same in the photo), ENIG.
  L1 signals + GND pour, L2 solid GND, L3 power + long runs, L4 GND pour cut into the triangle mosaic.
  Rules (own DRC): 0.12 mm clearance, 0.20 mm pour clearance, copper 0.65 mm from the plated edge, 0.45/0.2 mm tented
  vias, antenna keep-out on all layers; connectivity checked across layers. 86 vias (stitching fence along edges and
  bays, QFN thermal vias, module GND vias).
- **Routing** (real pads to real pads): USB D+/D− routed as a pair through a flow-through ESD array to the module's
  USB pins; CC1/CC2 to local 5.1 k Rd; VBUS bus → TVS + bulk caps → L3 spine → nPM1300; VBAT (0.5 mm) to the battery
  JST + NTC; buck 1 (1.8 V) → module + sensor I/O; buck 2 → sensor core; TWI + interrupt PMIC ↔ module; sensor SPI +
  motion; switch NO/NC pairs (both throws, for debounce-free latching), encoder A/B, side buttons, power switch → PMIC
  SHPHLD (ship mode), SWD to test pads. Raised copper under glossy black mask with tented vias (relief modelled).
- **Gold trim**: plated outline edge + 0.35 mm ENIG band on top and bottom, plated wheel-bay and square-window edges,
  gold rings on the plated holes, gold pads and test points, Mill-Max flanges (tin shell, gold contact), Viper-V4-Pro-like.
- **Silkscreen**: Sora-style part outlines, refdes, pin-1 marks, polarity (+/BAT at the battery JST, cathode bar),
  **ON ↑ / OFF ↓** at the power switch (#100), dashed RF keep-out with "ANT", "THESEUS MAIN PCB V1.0", L/R switch marks,
  a 4.3 mm QR "WEB APP" (#90). Bottom (#63, no components): triangle-mosaic GND pour with a duotone gradient (ENIG
  triangles from one corner, silk-outlined triangles from the other), "THESEUS", a 7.2 mm QR "SCAN FOR THE WEB SOFTWARE",
  ON/OFF/POWER arrows at the window, rail test-pad labels, fab block (94V-0, 4L 1.0 mm ENIG). The QR encodes a
  **placeholder** (`https://theseus.example/software`): rebuild with `--qr <real URL>`.

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

FR4 **1.85 g/cm³**, 1.0 mm finished board (0.895 mm dielectric), copper 8.96 g/cm³ (outer 35 µm, inner 17.5 µm, on the
real copper areas), mask 2 × 20 µm. Component masses are typical values for the package class, not weighed parts.

| Item (plan 5, H1 2026-11-06; v1 in brackets) | g |
|---|---:|
| Laminate (1703 mm² core × 0.895 mm) [1532 mm²: 2.54] | 2.82 |
| Copper (L1 1233 mm², L2 1426, L3 117, L4 1069) + via barrels [0.88] | 0.98 |
| Solder mask [0.09] | 0.10 |
| **Bare board** [3.50] | **3.91** |
| GT01 × 2 (~0.5 g each, typical micro switch) | 1.00 |
| Raytac module (geometry estimate) | 0.45 |
| USB-C receptacle | 0.40 |
| Sensor (0.25) + clip-on lens (0.07) | 0.32 |
| Mill-Max 3305 × 6 (0.03 g each from geometry; **Brock: 0.11 g each**) | 0.18 (0.66) |
| JST × 2, slide, tact, PMIC, inductors, passives, ESD, TVS, solder | 0.40 |
| **Board + on-board parts** [6.28] | **6.66** |
| Wheel assembly: six-arm magnesium wheel 0.900 + POM axle 0.116 (parts spec) + magnetic encoder ~1.0 (hollow-shell estimate) + support 0.26 [2.42] | 2.28 |
| **Total, comparable to the Sora V2's "PCB & wheel" 8.29 g** [≈ 8.7] | **≈ 8.9 (9.4 with Brock's Mill-Max figure), ± ~1 g** |

Leads and plugs are excluded (not in the Sora's 8.29 g either). The board is ~40 % of it; a 0.8 mm board would save
≈ 0.5 g of laminate, and the wheel + encoder estimate is the least certain line.

**One board.** Brock: "we don't have a front and back pcb, it'll be a single ~5.6g pcb." Every scene has exactly one
board: `pcb.glb` (one outline, top-side assembly), the lattice's single PCB stand-in, none in the shell. The model's
board + on-board parts estimate (6.66 g on plan 5; 6.28 on v1) is 1.1 g over Brock's ~5.6 g, about the component-mass
uncertainty (the two GT01s alone are "typical micro switch" guesses at 1.0 g); plan 5's larger outline adds 0.41 g of
laminate and copper.

## Shots (`shots/`, 2×)

`hero_{paper,night}`, `top_{paper,night}`, `top_transparent` (alpha), `bottom_{paper,night}`, `side_{paper,night}`,
`exploded_{paper,night}`, `module_{paper,night}` (module + antenna end), `antenna_keepout_{paper,night}` (X-ray with the
module and wheel removed: the copper-free keep-out), `pmic_{paper,night}` (nPM1300 + inductors), `power_charge_*`,
`power_run_*`, `xray_{paper,night}`, `xray_hero_night`, `reflow_{paper,night}`, `reflow_pmic_night`,
`switch_hotswap_{paper,night}` (SW1 lifted out of its Mill-Max sockets), `compare_sora_v2_vs_theseus_{paper,night}`.

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
