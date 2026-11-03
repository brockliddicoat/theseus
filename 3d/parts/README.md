# Theseus small parts (`3d/parts/`)

Detailed, animatable small parts for the Theseus deck: Gateron GT01 switch, magnesium scroll wheel with optical encoder, Mill-Max 3305 receptacle, M2 screw + brass heat-set insert, dot skates, LiPo battery with PCM/JST and silicone bands. All geometry is procedural (three.js r187) except four boolean-heavy meshes baked offline with manifold3d; everything is synchronous and deterministic.

## API

```js
import {
  buildGT01, GT01_SPEC, gt01PinGeometry,
  buildScrollWheel, WHEEL_SPEC,
  buildMillMax3305, MILLMAX_3305_SPEC,
  buildM2Screw, buildHeatSetInsert, buildScrewJoint, FASTENER_SPEC,
  buildDotSkate, buildDotSkateSet, layoutDotSkates, DOT_SKATE_SPEC, SORA_FOOTPRINT, STANDIN_SCREWS,
  buildBattery, buildJstShHeader, BATTERY_SPEC,
  partMaterials, SectionPlane,
} from '../parts/parts.js';   // path relative to 3d/<asset>/
```

Common rules (every builder):
- Synchronous: `build*(opts) → THREE.Group`. No globals, no network, no randomness (a seeded PRNG where texture noise is needed), so the same opts give the same mesh.
- **Millimetres; +X right, +Y up, +Z forward** (CONVENTIONS.md). Each part has its own local origin (below); place it with `group.position / rotation`.
- `group.userData.parts`: named sub-objects (meshes/groups) for your own animation.
- `group.userData.spec`: dimensions and honesty labels (`datasheet` / `manufacturer claim` / `representative` / `proposal` / `derived`).
- State setters are **methods on the returned group** and are pure functions of their arguments (calling `setPress(0.5)` twice gives the same pose). Every `k` is clamped to [0, 1]. `getState()` returns the current state.
- `group.dispose()` frees every geometry, material and texture the builder created (materials you pass in `opts.materials` are left alone).
- Sections and cutaways use local clipping planes: the renderer needs `renderer.localClippingEnabled = true`. The builders set it themselves from an `onBeforeRender` hook, and **no stencil buffer is needed** (see "Section technique").
- Materials: `lib/studio.js` `materials()` plus the finishes in `parts/lib/materials.js` (`partMaterials()`). Override any by name with `opts.materials = { gold: myGold }`.
- Do not `clone()` a built group (setters are closures over its own meshes): build another one.

### 1. `buildGT01(opts)` — Gateron GT01 mouse micro switch (representative)
- **Origin:** PCB top surface (Y = 0) at the middle pin. Pins point down (−Y) into the board. Switch length along Z; **plunger toward +Z**. The body sits on its molded wedge, tilted about X so the plunger end is low; plunger travel direction is `spec.plungerAxis = [0, cos t, sin t]` (pointing up/out of the switch).
- **opts:** `tilt` (deg, default 20: measured from Gateron's cutaway image; Brock recalls a 30° wedge; 0 = a flat D2F-style switch), `cover` (`'pink'` | `'black'` | `'clear'`, default pink), `marking` (`'GT01'` default or `''`; other strings need `build_geo.py`), `pinLength` (3.3 mm below the PCB top), `edgeColor` (cutaway edge lines, default teal like Gateron's), `materials`.
- **Setters:** `setPress(k, {releasing = false}) → {travel, closed}`: plunger travel = k × 0.35 mm; the moving contact snaps NC→NO at the operating point (k ≥ 0.63, 0.22 mm) and back below the release point (k < 0.50, 0.175 mm) when `releasing` is true. `setCutaway(k)`: a section plane sweeps through the cover's near (−X) half, the cut face gets a pink cap and teal edge lines fade in (like Gateron's cutaway). `setExplode(k)`: cover, plunger, blade/tongue lift along the switch axis.
- **spec:** `envelope [12.8, 5.8, 6.5]`, `travel`, `opTravel`, `rpTravel`, `force`, `life`, `claims`, `pitch 5.08`, `pins [{name, x, z}]` (COM z = +5.08, NO z = 0, NC z = −5.08; local, Y = 0), `pinSection [0.6, 0.4]`, `keyPeg {x: 1.45, z: 2.54, d: 0.9}` (keyed orientation), `plungerTop` (rest, local), `plungerAxis`, `footprint` (XZ rectangle of the wedge foot), `heightMax`, `tiltDeg`.
- **parts:** `body` (the tilted switch-frame group), `base`, `core`, `cover`, `plunger`, `blade`, `tongue`, `contactNC`, `contactNO`, `contactCOM` (moving rivet), `terminals`, `pins[3]`.
- `gt01PinGeometry(len)`: the terminal blade alone (used by the Mill-Max demo; handy for the PCB builder).

### 2. `buildScrollWheel(opts)` — magnesium wheel + POM axle + optical encoder
- **Origin:** PCB top surface directly below the wheel centre. Axle along X, wheel centre at `Y = axleHeight`. Encoder on +X, axle support bracket on −X. The wheel bottom is at `axleHeight − diameter/2` (0 by default: the PCB needs a wheel cut-out, as on the Sora V2).
- **opts:** `diameter` (22), `width` (7), `crownRadius` (default = diameter/2, a spherical crown), `grousers` (48), `steps` (24), `axleHeight` (11), `encoderSide` (+1 / −1 mirrors), `encoder` (true), `support` (true), `materials`.
- **Setters:** `setScroll(rad) → {step, A, B, gateA, gateB}`: rotates wheel, axle, code disc and detent star about +X (positive = top of the wheel moves toward +Z, i.e. scroll up/away); the two light gates (A/B, 90° electrical apart) pulse as slots pass and the detector windows glow. `setExplode(k)`: parts spread along the axle. `setXray(k)`: encoder housing becomes a smoke ghost and the IR beams become visible.
- **spec:** `diameter, width, crownRadius, sagitta, grousers, steps, axleHeight, axleDiameter 2.4, hexAF 2.0, encoderBox {min, max}`, `supportBox`, `wheelVolume_mm3`, `massEstimate_g` (AZ31B 1.77 g/cm³).
- **parts:** `wheel, tread, grousers, web, hub, axle, disc, detentStar, encoder, housing, emitter, detector, beamA, beamB, detent, support, spin`.

### 3. `buildMillMax3305(opts)` — Mill-Max 3305 claw-spring receptacle
- **Origin:** PCB top surface at the hole centre; flange 0.25 mm above the board, body down (−Y), open bottom.
- **opts:** `variant` (0 | 1 | 2 → length .105 / .130 / .155 in, default 0), `shell` (`'tin'` default = -80- plating | `'gold'` = -15-), `pcb` (true: a 6 × 6 mm board slice with plated hole, pads and solder), `pcbThickness` (1.2), `pin` (true: GT01-style pin stand-in), `sock` (false: Brock's insulative boot under the board), `materials`.
- **Setters:** `setInsert(k)`: 0 = pin tip 2 mm above the flange, 1 = seated; each of the six fingers flexes by the width of the flat pin in its own direction as the tip passes the throat. `setSection(k)`: section plane sweeps to the axis (the three near fingers are clipped whole, the far three stay intact). `setExplode(k)`: contact clip lifts out of the shell.
- **spec:** datasheet numbers below plus `protrudesBelowPCB`.

### 4. Fasteners — `buildM2Screw(opts)`, `buildHeatSetInsert(opts)`, `buildScrewJoint(opts)`
- **Screw origin:** centre of the head's bearing face; shank along −Y. opts: `length` (5), `finish` (`'brass'` brass-plated steel, default | `'steel'` | `'black'`).
- **Insert origin:** centre of the insert's top face; body along −Y. opts: `length` (3.0), `od` (3.5).
- **Joint:** origin at the boss top face (insert flush). CF-PP boss on a floor stand-in, insert, 1.0 mm clamped plate (PCB stand-in), screw. Setters: `setDrive(k) → {turns}` (k = 0: tip 0.6 mm above the plate; k = 1 seated; the screw turns clockwise seen from above, 360° per 0.4 mm, and its thread stays meshed with the insert's at every k), `setSection(k)` (plane through the axis: steel core under the plating, brass insert teeth, plastic boss), `setExplode(k)`.

### 5. Dot skates — `buildDotSkate(opts)`, `buildDotSkateSet(opts)`, `layoutDotSkates(opts)`
- **Skate origin:** centre of the **glide face at Y = 0** (the pad); the stack rises to the mounting face at `Y = 0.65`, so a skate placed at `(x, 0, z)` is already correct in mouse coordinates.
- **opts:** `material` (`'POM'` default | `'PTFE'`), `diameter` (6.5), `height` (0.65). `setExplode(k)` separates the layers.
- **Set:** `buildDotSkateSet({positions, screws, footprint, showFootprint, material})`: 8 skates in mouse coordinates; with `showFootprint` (default) a stand-in base plate and stand-in screw heads are drawn. `setExplode(k)` drops the skates off the base.
- `layoutDotSkates({footprint, screws, inset = 4.6, spacing = 7.6, clearance = 1.5}) → [[x, z] × 8]`: two per corner on a curve inset from the outline, slid along it until each skate clears every screw head (Ø4) by `clearance`. **Shell builder: pass your real base outline and screw positions.**

### 6. Battery — `buildBattery(opts)`, `buildJstShHeader(opts)`
- **Battery origin:** centre of the cell's bottom face (lying flat); width X, thickness Y, length Z; PCM/tab end toward +Z. The demo header sits at `headerAt` (default `[15.5, 0, 24]`, on a small board tile) with its opening toward −X, i.e. the plug goes in **sideways** (#71).
- **opts:** `bands` (true), `bandColor` (`'smoke'` default | `'accent'` XBAB yellow), `headerAt`, `tile` (true), `labelLine1`, `labelLine2`, `weight` (printed on the label only if given), `materials`.
- **Setters:** `setExplode(k)`, `setPlug(k)` (0 = plug 6 mm out, 1 = mated; the twisted lead follows), `setBands(k)` (0 = bands lifted off, 1 = on).
- **Header:** `buildJstShHeader()`: side-entry SH 3-pin; origin on the PCB top surface at the footprint centre, opening toward −X, body 4.25 deep along X, 5.0 wide (Z), 3.0 tall.

## What was built, and how honest each number is

Labels: **[DS]** datasheet / official spec · **[MC]** manufacturer claim · **[DV]** derived or measured by me · **[REP]** representative (chosen to look and behave right, not measured) · **[PR]** Brock's proposal.

### Gateron GT01 (`gt01.js`, cover baked in `geo/gt01.geo.js`)
| Item | Value | Label |
|---|---|---|
| Operating force | 55 ± 5 gf | [MC] (MechKeys, ZFX Shenzhen launch) |
| Travel | 0.35 ± 0.10 mm (animation uses 0.35) | [MC] |
| Life | 100 M clicks | [MC] |
| "Zero Preload and Zero Delay", "Special Shape for Vertical Pressing" | modelled as: plunger nose rests on the blade with no gap; body tilted on a molded wedge | [MC] claims / [REP] geometry |
| Body envelope | 12.8 × 5.8 × 6.5 mm (Omron D2F class), terminal pitch 5.08 mm, terminal t 0.4 | [DS] of the D2F class; **no GT01 dimensions were found** |
| Wedge tilt | 20° (measured off Gateron's cutaway render; Brock recalls 30°: `tilt` option) | [DV] |
| Operate / release points | 0.22 / 0.175 mm (snap at k = 0.63, hysteresis on release) | [REP] |
| Pins | flat 0.9 → 0.6 mm stepped blades, 0.4 thick, 3.3 mm below the board, pointed | [REP] (look of the reference) |
| Contacts | gold rivets Ø0.9 (NC above, NO below, double-dome moving contact), contact gap 0.30 mm | [REP] |
| Pin cover | the molded wedge encloses the terminals down to the board (only pin tips exist below it) + a keyed locating peg | [REP] per Brock's note / research "molded pin cover + keyed orientation" [PR] |

Built from: an extruded side profile (wedge + lower base) split into two 1 mm skins with filleted pocket cut-outs and a 3.8 mm core, so the pockets are real blind pockets with rounded rims; filleted internal pedestals; a CSG cover (minkowski-rounded box, plunger hole with chamfer, 0.06 mm label recess with raised "GT01" traced from Inter Bold, latch windows); swept terminal strips; lathe rivets; a deformable blade (Hermite bend from the clamp through the plunger to the contact tip) and a re-swept tongue whose bow flips at the snap. Triangles: ≈ 21 k (30 meshes).

### Scroll wheel + optical encoder (`scrollwheel.js`)
| Item | Value | Label |
|---|---|---|
| Wheel | Ø22 × 7 mm (Sora V2 wheel measured ≈ 22–23.5 × 7.5–8 mm from Brock's PCB photo, scaled by the 8.94 mm USB-C shell) | [DV] size / [REP] |
| Surface | torus section, crown radius = wheel radius (11 mm), sagitta 0.57 mm over the 7 mm width: the top of the wheel is locally spherical, so the fingertip sees the same curvature rolling and across ("find the perfect surface arc") | [PR] |
| Tread | 48 gently curved grousers (NASA: Perseverance 48 gently curved vs Curiosity 24 chevron), 0.22 mm tall, flat 0.34 mm lands, 2 per encoder step; turned groove floor (anisotropic), milled lands | [PR] (#30) |
| Spokes | 6 spokes, 1.0 mm wide, cutting the 1.2 mm web into 6 equilateral-triangle windows (apex truncated at the hub) | [PR] (brainstorm) |
| Material | magnesium AZ31B-class, bare machined; rim 1.75 mm thick | [REP] (#84) |
| Mass estimate | 1.46 g (825 mm³ × 1.77 g/cm³; `spec.massEstimate_g`) | [DV] |
| Axle | POM, Ø2.4 journals, 2.0 mm A/F hex keyed in the hub, D-flat drive into the encoder | [REP] (#7) |
| Encoder | IR LED (clear dome), photo-etched stainless code disc (24 slots, 7.5° each), dual phototransistor (A/B 1¼ slot pitch apart = 90° electrical), 24-lobe detent star + phosphor-bronze leaf spring, black housing 7.6 × 9.4 × (axleHeight + 4.9) mm | [REP]; optical encoders "3.3× more reliable" is Razer's [MC] |

### Mill-Max 3305 (`millmax3305.js`)
| Item | Value | Label |
|---|---|---|
| Mounting hole | .062" (1.575 mm) | [DS] |
| Flange / body | Ø .077" (1.956) / Ø .058" (1.473); .010" (0.25 mm) above board | [DS] |
| Length | .105 / .130 / .155" (2.667 / 3.302 / 3.937 mm) for -0/-1/-2 | [DS] |
| Accepts | round leads .025–.037" (0.635–0.940 mm); square/rect .019–.026" | [DS] |
| Contact | BeCu C17200 (Cu 98.1 / Be 1.9), 6 fingers, 30 µin Au over Ni on the contact only | [DS] |
| Shell | brass, 200–300 µin matte Sn over Ni (-80-) or 10 µin Au (-15-) | [DS] |
| 1,000 cycles min, 10 mΩ max | | [DS] (research report) |
| Finger shape, throat Ø0.54, barrel | | [REP] |
| Board, plated barrel, ENIG pads, solder fillets | 1.2 mm board | [REP] |
| Insulative sock | silicone boot under the board | [PR] (Brock's brainstorm) |

### M2 screw + heat-set insert (`fasteners.js`, head baked in `geo/fasteners.geo.js`)
| Item | Value | Label |
|---|---|---|
| Screw | M2 × 0.4 × 5, pan head dk 4.0 × k 1.6 (ISO 7045 envelope), Phillips H0 + slot combination recess | [REP] per #9; ISO envelope |
| Finish | brass-plated carbon steel (section shows the steel core) | [PR] (#9, comments) |
| Thread modelling | external crest Ø1.96 / root Ø1.50, internal groove Ø2.04 / crest Ø1.60, ISO 60° form (flat crest P/8, root P/4), with clearance so screw and insert never intersect | [REP] |
| Insert | M2, 3.0 long, Ø3.5, two 18-ridge knurl bands with opposed helix (lead ±19 mm), groove, pilot, countersunk lead-in; mass estimate 0.15 g (Brock: 0.16–0.18 g) | [REP] / [DV] |
| Boss | CF-PP stand-in Ø5.3, blind hole 4.9 deep | [REP] |

### Dot skates (`skates.js`)
| Item | Value | Label |
|---|---|---|
| Diameter / height | 6.5 / 0.65 mm | Brock [PR] |
| Stack | glide 0.38 (POM default, PTFE option) + 3M transfer tape 0.05 + PORON 0.17 + tape 0.05 | [REP] split; materials per Brock |
| Glide edge | 0.2 mm radius on the glide side, 0.04 chamfer on the back | [REP] |
| Layout | 2 per corner on a curve 4.6 mm inside the base outline, pairs 7.6 mm apart, clear of screw heads by ≥ 1.5 mm | [PR] (#10, #52) |
| Base outline | `SORA_FOOTPRINT`: convex hull of Brock's scan below Y = 1.2 mm, 64 points, 56.8 × 108.8 mm at pad level | [DV] (stand-in for the shell's real outline) |
| Screws | `STANDIN_SCREWS` (4 positions) until the shell publishes its own | stand-in |

### Battery (`battery.js`)
| Item | Value | Label |
|---|---|---|
| Cell | 502030 class: 5.0 × 20 × 30 mm, 3.7 V, 250 mAh, 0.925 Wh (retail 502030 listings, e.g. Akyga AKY0106: 6 g with leads) | [MC] of a typical cell / [REP] |
| Why this size | 250 mAh matches the SLX's Jauch cell [MC]; the V4 Pro's 306 mAh [IM] would be a 602030-class 6 mm cell. 502030 is the common 250 mAh pouch | [DV] |
| Pouch | deep-drawn body with rounded edges, folded side seals, top seal flange, Al (+) and Ni (−) tabs | [REP] |
| PCM | protection IC + dual MOSFET (SOT-23-6 class), passives, NTC, 3 pads, under amber Kapton | [REP] |
| Lead | 3 wires (red +, black −, white NTC), twisted (#69), ~40 mm, fanning into a JST SH 3-pin plug (SHR-03V-S-B class: 4.0 mm wide per JST's B = A + 2.0) into a side-entry header (#71) | [DS] width / [REP] rest |
| Retaining | two silicone bands instead of adhesive (Brock's note) | [PR] |
| Label | "LITHIUM POLYMER / 3.7 V · 250 mAh · 0.93 Wh / Li-Po 502030 · PCM · NTC / THESEUS"; weight only if `opts.weight` is given (Brock likes weight printed on the battery, but no verified number exists yet) | [PR] |

## Look, materials, technique
- **Materials** (`lib/materials.js`): calibrated under the studio's AgX + RoomEnvironment rig. Black plastics use low `specularIntensity` so they read near-black (the studio's warning about mid-grey blacks); `maskBlack` is a macro-safe solder mask (the studio `mask` reads silver at grazing angles in close-ups). Gold `#f3c35a`, satin gold for stamped terminals. Pink PC: near-white transmission tint + short pink attenuation + a pink grazing sheen lobe, so the faces stay clear and the rims glow pink (Gateron's look) on both backgrounds. Magnesium: anisotropic with a per-vertex **circumferential tangent** attribute (no UV seams) and `anisotropyRotation = π/2`, the lathe-turned read; grouser lands are isotropic so the tread pattern keeps definition.
- **Section technique** (`lib/section.js`, `SectionPlane`): each registered mesh gets the plane as a material clipping plane and a back-face twin whose fragment normal is forced to the plane normal (`-clippingPlanes[0].xyz`). For closed meshes only the cut exposes back faces, so the twin reads as a solid cap: no stencil buffer, works in the deck's renderer as-is. Rules learned: caps must not receive shadows (they would be sampled at the hidden back faces), and adjacent solids need hairline gaps (2–6 µm) or their coplanar faces fight in the cap.
- **Edges** for the GT01 cutaway: screen-space fat lines (`LineSegments2`) with a small clip-space depth bias so the surface they lie on does not hide them.
- **Offline CSG** (`tools/build_geo.py`, manifold3d): GT01 cover (two markings), M2 head recess. Output is quantized (uint16) base64 in ES modules so imports stay synchronous; normals are re-creased in JS at 1e-4 mm hashing (three's `toCreasedNormals` hashes at 0.01 units, too coarse for 0.05 mm features).
- Triangle budget (measured): GT01 21 k · wheel + axle + encoder + support 51 k (the wheel alone 36 k) · Mill-Max demo 9.8 k · screw joint 41 k · one skate 4.4 k, set of 8 + base 42 k · battery + plug + header 37 k.

## Test bench and shots
- `test.html?part=gt01|wheel|millmax|joint|screw|insert|skate|skates|battery&theme=paper|night` with sliders for every setter, a part selector, drag-to-orbit. URL params: `view` (studio view names) or `dir=x,y,z`, `zoom` (frame margin), `target=x,y,z&radius=r` (close-up in the part's frame), `flip=1`, `ui=0`, plus states (`press, releasing, explode, cutaway, scroll, xray, insert, section, drive, plug, bands`) and options (`tilt, cover, marking, steps, grousers, encoder=0, support=0, variant, sock=1, pin=0, pcb=0, material=PTFE, base=0, bandColor=accent`). Sets `window.__ready`.
- `shots/`: 2× finals (3200 × 1800) on both themes, named `<part>-<view or state>-<theme>.png`; `shots/contact-sheet.jpg` shows them all. Regenerate from `3d/` with `node parts/tools/shoot.mjs parts/tools/shots.json --scale=2 --jobs=1 --skip=1` (one browser restarted every 8 shots, generous timeouts, refuses lost WebGL contexts; `--only=<substr>` for a subset), then `python3 -I parts/tools/validate_shots.py --delete` to drop blank frames and rerun with `--skip=1`. Run one job at a time: SwiftShader is multi-threaded and two instances on this 2-CPU box thrash (the shared `tools/shot.mjs` also times out on 2× transmission renders under load).
- `tools/peval.mjs "<query>" "<js>"`: load the bench headless and evaluate an expression (debugging).

## Known gaps / stand-ins
- GT01 has no public datasheet: footprint, pin form, internal mechanism and pin cover are representative. The snap mechanism is kinematic (no spring physics); hysteresis needs the caller to say `releasing`.
- Wheel: rim/web thickness and the mass estimate are design values, not an FEA result. The encoder housing is a solid block (no modelled cavity); x-ray mode makes it a ghost instead.
- The boss, floor, plate, board slices, base plate and screw heads in the skate set are **stand-ins** for shell/PCB geometry, clearly named `*StandIn` / `boss` / `plate` / `pcbTile`.
- Battery label text is a proposal; no verified cell weight, so none is printed by default.
- `marking` strings other than `GT01`/`''` need `python3 -I parts/tools/build_geo.py gt01` after editing the list there.
