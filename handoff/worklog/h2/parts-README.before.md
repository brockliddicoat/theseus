# Theseus small parts (`3d/parts/`)

Detailed, animatable small parts for the Theseus deck: Gateron GT01 switch, six-arm magnesium scroll wheel (0.9 g, a fine straight knurl) with a TTC-style optical encoder, Mill-Max 3305 receptacle, M2 screw + brass heat-set insert, dot skates, LiPo battery with PCM/JST and silicone bands, and the board-mounted radio module, sensor module and snap-on lens. All geometry is procedural (three.js r187) except the GT01 cover, baked offline with manifold3d (`geo/gt01.geo.js`); the M2 head and its recess are now built exactly in JS (`lib/panhead.js`; `geo/fasteners.geo.js` is no longer imported). Everything is synchronous and deterministic.

## API

```js
import {
  buildGT01, GT01_SPEC, gt01PinGeometry,
  buildScrollWheel, WHEEL_SPEC,
  buildMillMax3305, MILLMAX_3305_SPEC,
  buildM2Screw, buildHeatSetInsert, buildScrewJoint, FASTENER_SPEC,
  buildDotSkate, buildDotSkateSet, layoutDotSkates, DOT_SKATE_SPEC, SORA_FOOTPRINT, STANDIN_SCREWS,
  buildBattery, buildJstShHeader, BATTERY_SPEC,
  buildRadioModule, buildSensorModule, buildSnapLens, RADIO_SPEC, SENSOR_SPEC, LENS_SPEC,
  partMaterials, SectionPlane,
} from '../parts/parts.js';   // path relative to 3d/<asset>/
```

Common rules (every builder):
- Synchronous: `build*(opts) → THREE.Group`. No globals, no network, no randomness (a seeded PRNG where texture noise is needed), so the same opts give the same mesh.
- **Millimetres; +Y up, +Z forward, +X = the user's LEFT** (CONVENTIONS.md, corrected: three.js is right-handed, so with +Y up and +Z forward the user's right is −X; side buttons are at +X). Each part has its own local origin (below); place it with `group.position / rotation`. Left/right options below are named in the user's terms.
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
- **Inside: a standard SPDT microswitch** (Brock: "the gt01 switch is literally just a normal SPDT switch with a special bottom housing to rotate it"): a switch base on the rotating wedge, the plunger, a stamped actuator spring (blade with its cut tongue, clamped at the COM post, bowed into a snap), the moving contact rivet at its tip between the NC contact (upper arm) and the NO contact (lower), and the three terminals (COM, NO, NC) running down through the wedge to the pins. `spec.mechanism` lists the parts and the order they move in.
- **Setters:** `setPress(k, {releasing = false}) → {travel, closed}`: plunger travel = k × 0.35 mm; the moving contact snaps NC→NO at the operating point (k ≥ 0.63, 0.22 mm) and back below the release point (k < 0.50, 0.175 mm) when `releasing` is true. `setCutaway(k)`: a section plane sweeps through the −X half of the cover, the switch base and the wedge (the switch's own −X side; for a switch placed unrotated that is the user's right); the cut faces get caps and teal edge lines fade in (like Gateron's cutaway). `setExplode(k)`: cover, plunger, blade/tongue lift along the switch axis.
- **spec:** `envelope [12.8, 5.8, 6.5]`, `travel`, `opTravel`, `rpTravel`, `force`, `life`, `claims`, `pitch 5.08`, `pins [{name, x, z}]` (COM z = +5.08, NO z = 0, NC z = −5.08; local, Y = 0), `pinSection [0.6, 0.4]`, `plungerTop` (rest, local), `plungerAxis`, `footprint` (XZ rectangle of the wedge foot), `heightMax`, `tiltDeg`.
- **parts:** `body` (the tilted switch-frame group), `base` (the wedge), `core`, `switchBase`, `cover`, `plunger`, `blade`, `tongue`, `contactNC`, `contactNO`, `contactCOM` (moving rivet), `terminals`, `terminalRuns`, `pins[3]`.
- `gt01PinGeometry(len)`: the terminal blade alone (used by the Mill-Max demo; handy for the PCB builder).

### 2. `buildScrollWheel(opts)` — magnesium wheel + POM axle + optical encoder
- **Origin:** PCB top surface directly below the wheel centre. Axle along X, wheel centre at `Y = axleHeight`. **Encoder on the user's right (−X) by default, as on the Sora V2 PCB; support bracket on +X.** (Changed after the handedness fix: the first API draft said "encoder on +X"; pass `encoderSide: 'left'` for that layout.) The wheel bottom is at `axleHeight − diameter/2` (0 by default: the PCB needs a wheel cut-out, as on the Sora V2).
- **opts:** `diameter` (22.74, the Theseus shell's wheel), `width` (7.0), `crownRadius` (default = diameter/2, a spherical crown), `knurl` (144 grooves), `knurlDepth` (0.12), `arms` (6), `skinEdge` (0.55) / `skinCentre` (0.98) (the rim's thickness; 0.98 sizes the wheel to 0.900 g), `steps` (24), `axleHeight` (11), `encoderSide` (`'right'` default = −X | `'left'` = +X; an exact X-mirror, scroll sign unchanged), `encoder` (true), `support` (true), `materials`.
- **Encoder, as TTC builds one** (Brock's TTC photo): outside a normal mouse encoder, a black plastic body with a chamfered top corner, a tin-plated steel frame on the wheel side (drawn bushing collar round the rotor, heat-stake pegs, folded tabs, two J-hook legs into the board) and five pins in a row (1.25 mm pitch), taller than the photo's because the axle sits 11 mm up. Inside: the rotor with a 24-slot code disc, a white photo-interrupter holder straddling the disc's rim at the bottom (over the pins), an IR emitter (clear epoxy, die, reflector cup) in one arm and a dual phototransistor (windows A and B a quarter-cycle apart) in the other, a lead frame down to the pins, and a 24-lobe detent star under a leaf spring. The far journal sits in a POM support bracket (U seat with lead-in chamfers, a foot with two locating pegs, a gusset).
- **Setters:** `setScroll(rad) → {step, A, B, gateA, gateB}`: rotates wheel, axle, code disc and detent star about +X (positive = top of the wheel moves toward +Z, i.e. scroll up/away); the two light gates (A/B, 90° electrical apart) open and close as slots pass. `setExplode(k)`: axle and support out to one side, the encoder's parts spread along +X, the interrupter's parts up a little. `setXray(k)`: the body and frame turn to smoke glass and the holder thins, so the emitter, receiver and the beams (flat highlight colour, drawn on top) read inside. `setHighlight(color)`: the beams' colour (the deck passes C.hero).
- **spec:** `diameter, width, crownRadius, sagitta, knurl {grooves, perStep, depth, angleDeg, pitch, band, runOut}, arms {n, width, thickness}, hub {diameter, width}, skin {edge, centre, spine, inside}, steps, axleHeight, axleDiameter 2.4, hexAF 2.0, encoderBox {min, max}`, `encoderBody {thickness, width, height, pins, pitch, pinRowX}`, `supportBox`, `wheelVolume_mm3`, `massEstimate_g` (AZ31B 1.77 g/cm³), `massAluminium_g` (the same wheel in 6061, 2.70), `volumeParts_mm3`, `axleVolume_mm3`, `axleMass_g` (POM 1.42).
- **parts:** `wheel, rim, tread (= knurl), arms (= web), hub, axle, disc, detentStar, rotor, rotorHub, encoder, housing, frame, pins, leads, interrupter, emitter, detector, beamA, beamB, detent, support, spin`.

### 3. `buildMillMax3305(opts)` — Mill-Max 3305 claw-spring receptacle
- **Origin:** PCB top surface at the hole centre; flange 0.25 mm above the board, body down (−Y), open bottom.
- **opts:** `variant` (0 | 1 | 2 → length .105 / .130 / .155 in, default 0), `shell` (`'tin'` default = -80- plating | `'gold'` = -15-), `pcb` (true: a 6 × 6 mm board slice with plated hole, pads and solder), `pcbThickness` (1.2), `pin` (true: GT01-style pin stand-in), `sock` (false: Brock's insulative boot under the board), `materials`.
- **Setters:** `setInsert(k)`: 0 = pin tip 2 mm above the flange, 1 = seated; each of the six fingers flexes by the width of the flat pin in its own direction as the tip passes the throat. `setSection(k)`: section plane sweeps to the axis (the three near fingers are clipped whole, the far three stay intact). `setExplode(k)`: contact clip lifts out of the shell.
- **spec:** datasheet numbers below plus `protrudesBelowPCB`.

### 4. Fasteners — `buildM2Screw(opts)`, `buildHeatSetInsert(opts)`, `buildScrewJoint(opts)`
- **Screw origin:** centre of the head's bearing face; shank along −Y. opts: `length` (5), `finish` (`'titanium'` Ti-6Al-4V grade 5, default (F25.4) | `'brass'` brass-plated steel | `'steel'` | `'black'`), `detail` (`'high'` default | `'low'` for screws seen only by their heads), `phase` (thread start angle).
- **Insert origin:** centre of the insert's top face; body along −Y. opts: `length` (3.0), `od` (3.5).
- **Joint:** origin at the boss top face (insert flush). CF-PP boss on a floor stand-in, insert, 1.0 mm clamped plate (PCB stand-in), screw. Setters: `setDrive(k) → {turns}` (k = 0: tip 0.6 mm above the plate; k = 1 seated; the screw turns clockwise seen from above, 360° per 0.4 mm, and its thread stays meshed with the insert's at every k), `setSection(k)` (plane through the axis: steel core under the plating, brass insert teeth, plastic boss), `setExplode(k)`.

### 5. Dot skates — `buildDotSkate(opts)`, `buildDotSkateSet(opts)`, `layoutDotSkates(opts)`
- **Skate origin:** centre of the **glide face at Y = 0** (the pad); the stack rises to the mounting face at `Y = 0.65`, so a skate placed at `(x, 0, z)` is already correct in mouse coordinates.
- **opts:** `material` (`'POM'` default | `'PTFE'`), `diameter` (6.5), `height` (0.65). `setExplode(k)` separates the layers.
- **Set:** `buildDotSkateSet({positions, screws, footprint, showFootprint, material})`: 8 skates in mouse coordinates; with `showFootprint` (default) a stand-in base plate with the real M2 pan heads (the fasteners' head, titanium) sunk in Ø4.5 counterbores, domes 0.15 mm inside the plate face. `setExplode(k)` drops the skates off the base.
- `layoutDotSkates({footprint, screws, inset = 4.6, spacing = 7.6, clearance = 1.5}) → [[x, z] × 8]`: two per corner on a curve inset from the outline, slid along it until each skate clears every screw head (Ø4) by `clearance`. **Shell builder: pass your real base outline and screw positions.**

### 6. Battery — `buildBattery(opts)`, `buildJstShHeader(opts)`
- **Battery origin:** centre of the cell's bottom face (lying flat); width X, thickness Y, length Z; PCM/tab end toward +Z. The lead leaves the PCM on the `connectorSide` (`'left'` default = +X, the user's left | `'right'` = −X, an exact mirror of PCM, lead, plug and header; the label is never mirrored). The demo header sits at `headerAt` (default `[±15.5, 0, 24]`, battery frame, on a small board tile) with its opening facing the cell, so the plug goes in **sideways** (#71).
- **opts:** `connectorSide` (`'left'` | `'right'`), `bands` (true), `bandColor` (`'smoke'` default | `'accent'` XBAB yellow), `headerAt`, `tile` (true), `labelLine1`, `labelLine2`, `weight` (printed on the label only if given), `materials`.
- **Setters:** `setExplode(k)`, `setPlug(k)` (0 = plug 6 mm out, 1 = mated; the twisted lead follows), `setBands(k)` (0 = bands lifted off, 1 = on).
- **Header:** `buildJstShHeader()`: side-entry SH 3-pin; origin on the PCB top surface at the footprint centre, opening toward −X, body 4.25 deep along X, 5.0 wide (Z), 3.0 tall.
- `setHighlight(color)`: the label's stripe (and `'accent'` bands) in Theseus's colour; the deck passes C.hero.

### 7. Board parts — `buildRadioModule(opts)`, `buildSensorModule(opts)`, `buildSnapLens(opts)` (`boardparts.js`)
- **Origin:** the main board's top surface at the part's centre (+Y up, mm; the board is 1.0 thick). The PCB builder swaps them in for its U1, U3 and LENS (`pcb.js`, `swap()`), passing its board materials.
- **Radio module** (`RADIO_SPEC`, 9.9 × 13.3 × 2.0): black substrate (Brock: "it should be black instead of blue"), a drawn nickel-silver shield can over the radio end, castellated gold half-holes on both long sides and the rear, and the long meander PCB antenna of the Raytac MDBT50Q-style modules at the far end (copper under the black mask, read as relief, ~6 turns, with its 0402 matching part at the feed; Brock: "use the long antenna design i've attached"). No maker's logos, IDs or certification marks. `parts: substrate, shield, castellations, antenna`.
- **Sensor module** (`SENSOR_SPEC`, 8.4 × 9.8 × 0.6, proposal): a small module board with stepped corners, soldered to the main board through 2 × 8 castellated half-holes at 1.2 mm pitch (with the fillets running out onto the main board's pads), test pads, fiducials and a label with a 2D code (an L-finder pattern, not scannable). Drawn from Brock's four photos; the sensor is "next-gen PixArt FrameSync-class", never a named part. `parts: substrate, castellations, label`.
- **Snap-on lens** (`LENS_SPEC`, body 5.2 × 9.6 × 2.2, proposal): clear PC under the board: a body with a shoulder step along its length, a boss up into the board's sensor aperture, the imaging dome and a smaller illumination dome on short collars on its bottom face, and at each end an arm to a Ø1.7 peg through the board with a split snap head above it. `parts: body, clips`.

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
| Mechanism | a standard SPDT snap-action switch on the wedge: BeCu actuator spring anchored on the COM post, cut-out tongue bowed against a fulcrum, moving contact at its tip between the NC arm (above) and the NO tab (below) | Brock [PR] ("a normal SPDT switch with a special bottom housing") / [REP] geometry |
| Contacts | silver (AgNi-class) rivets Ø0.84 (NC above, NO below, double-dome moving contact), contact gap 0.30 mm | [REP] |
| Pin cover | the molded wedge encloses the terminals down to the board (only pin tips exist below it); no locating peg (Brock, 2026-11-04: it read as a fourth pin), the three terminals key it | [REP] per Brock's note [PR] |

Built from (2026-11-04, to Gateron's three photos): the bottom housing as ONE black block from the board up to the cover's edge (its bottom flat on the board, its top the switch's base plane at 20°, both ends leaning with the switch), an extruded side profile split into two 1 mm skins and a 3.8 mm core; each skin has the photographed cut-outs, a Ø1.9 hole high at the back, a right triangle low at the back (4.2 × 2.25, pointing forward), a 1.8 × 0.72 slot along the tilt in the middle and a Ø1.7 hole toward the plunger end, read as holes over a deep matte core; the switch base on it with the COM post, the fulcrum and the NC/NO posts; a CSG cover (minkowski-rounded box, plunger hole with chamfer, 0.06 mm label recess with raised "GT01" traced from Inter Bold, latch windows); swept terminal strips with their runs down through the wedge; lathe rivets; a deformable leaf (gold-plated, 2.2 wide, 0.08 thick, a 1.16 mm window; Hermite bend from the clamp through the plunger to the contact tip) and its tongue, a flat strip of the same leaf (0.96 wide) from the window's tip end down to the fulcrum notch, nearly straight, its slight arch turning over at the snap (no bowed "noodle"); an ordinary plunger: a 1.5 × 2.1 cap 0.45 mm proud of the cover with a softly domed top, a 2.3 × 2.9 flange under the ceiling, a 1.3 × 1.1 nose on the leaf; three pins, no locating peg. Triangles: ≈ 24 k (36 meshes).

### Scroll wheel + optical encoder (`scrollwheel.js`)
| Item | Value | Label |
|---|---|---|
| Wheel | Ø22.74 × 7.0 mm, the Theseus shell's `wheel` (Sora V2 wheel measured ≈ 22–23.5 × 7.5–8 mm from Brock's PCB photo, scaled by the 8.94 mm USB-C shell) | [DV] size / [REP] |
| Form (F22.1, 2026-11-04; F25.2) | after PMM's magnesium wheel (1.0 g, its page; its photos could not be loaded from the build machine) but with six arms, as Brock asked, and then thinner ("thinners arms"): six arms 60° apart, tapered 0.95 → 0.55 mm wide and 1.3 → 0.9 mm thick from hub to rim, on an open hub (a Ø4.1 × 3.6 mm ring with the 2.0 mm hex bore); a thin rim (skin 0.55 mm at the edges, 1.108 at the centre plane, where the knurl's teeth cut in) with a 0.45 mm spine where the arms meet it; every bay corner filleted (r 0.5 at the rim, 0.32 at the hub), fillet rings at the spine and the hub | [PR] |
| Surface | torus section, crown radius = wheel radius (11 mm), sagitta 0.57 mm over the 7 mm width: the top of the wheel is locally spherical, so the fingertip sees the same curvature rolling and across ("find the perfect surface arc") | [PR] |
| Tread | coarse diamond knurl (F25.1: "coarse and diamond are my favorites"): the DIN 82 / IS 3403 left-right knurl with raised points, its points flattened: two families of 90° V-grooves at 30° to the axis each way, 72 teeth round (0.99 mm pitch round the crown, 0.86 normal to the grooves, three to an encoder step), 0.215 mm deep; each tooth a truncated pyramid with a top as wide as the grooves; 12 grid rows make a 5.16 mm band, plain turned bands at the edges. Exact on its mesh: a quarter-pitch grid along the grooves, each quad split by both diagonals | [PR] (#30) |
| Material | magnesium AZ31B (1.77 g/cm³), bare machined | [REP] (#84) |
| Mass | 0.900 g: 508.4 mm³ × 1.77 g/cm³ (`spec.massEstimate_g`; skin 431.2, the knurl's grooves −30.5, arms with spine and flange 79.4, hub 34.7, overlaps −9.6, fillet rings 3.3 mm³), Brock's 0.9 g; the thinner arms gave up 17.8 mm³ and the deeper knurl 19.8, put back in the skin under the knurl; the same wheel in aluminium 6061 1.373 g; the POM axle 84.3 mm³, 0.120 g (not in the 0.9 g, as PMM's 1.0 g is "the magnesium wheel only") | [DV] / [PR] |
| Axle | POM, Ø2.4 journals, 2.0 mm A/F hex keyed in the hub, D-flat drive into the encoder | [REP] (#7) |
| Encoder (outside) | as TTC's optical encoder (Brock's photo): black body 4.85 thick × 11 wide, axle 11 up so the body is a little taller than the photo's; tin-plated steel frame with a drawn bushing collar, heat-stake pegs, folded tabs and two J-hook legs; 5 pins at 1.25 mm | [PR] form / [REP] dimensions |
| Encoder (inside) | 24-slot code disc on the rotor; a photo-interrupter at the bottom of the disc (white holder, IR emitter: clear epoxy, die, reflector cup; dual phototransistor: windows A/B a quarter-cycle apart = 90° electrical); lead frame to the pins; 24-lobe detent star + leaf spring | [REP] from Honeywell HOA0901 (slotted optical switch) [DS], US6380927 and US12228433 (optical scroll encoders) [DS], Igor's Lab's Basilisk V3 Pro teardown [IM]; "3.3× more reliable" is Razer's [MC] |
| Support | POM bracket for the far journal: U seat with lead-in chamfers, foot with two locating pegs, gusset | [REP] |

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
| Screw | M2 × 0.4 × 5, pan head dk 4.0 × k 1.6, rf 3.2, r 0.1 under the head (ISO 7045 envelope), cross recess No. 0 (type H: m ≈ 1.9, penetration 1.0, with its centre cone) + a slot 0.5 wide × 0.8 deep across it (ISO 1580 M2: n 0.5, t ≥ 0.5), built exactly (no CSG): polar dome grids, rectilinear floor grids and walls meeting on shared edges (`lib/panhead.js`) | [REP] per #9; ISO envelopes [DS] |
| Finish | titanium Ti-6Al-4V grade 5, bare (F25.4; it was brass-plated carbon steel): 4.43 g/cm³, 36 HRC (349 HV), 950 MPa (ASM); the section shows solid titanium; the rolled thread a little rougher than the head. M2 × 4 (the shell's): 23.59 mm³, 0.1045 g (`spec.massEstimate_g`) | [PR] / [DS] |
| Thread modelling | ISO 68-1 basic profile in phase space (60° flanks, crest flat P/8, external root radius 0.18P ≥ ISO 965's 0.125P): crest Ø1.97 / root Ø1.50; the run-out rises out of the Ø1.74 blank under the head (x ≤ 1.0, ISO 7045) and the point is a 45° chamfer (ISO 4753); internal groove Ø2.04 / crest Ø1.60, with clearance so screw and insert never intersect | [REP] |
| Insert | M2, 3.0 long, Ø3.5, two knurl bands of 18 sharp teeth each with opposed helix (lead ±19.6 mm) and chamfered ends, groove, pilot, 90° countersink; mass estimate 0.13 g (Brock: 0.16–0.18 g) | [REP] / [DV] |
| Boss | CF-PP stand-in Ø5.3 with four gussets on a floor, clearance hole Ø2.24; the clamped board slice carries an ENIG pad and a plated barrel | [REP] |

### Dot skates (`skates.js`)
| Item | Value | Label |
|---|---|---|
| Diameter / height | 6.5 / 0.65 mm | Brock [PR] |
| Stack | glide 0.38 (POM default, PTFE option) + 3M transfer tape 0.05 + PORON 0.17 + tape 0.05 | [REP] split; materials per Brock |
| Glide edge | 0.2 mm radius on the glide side, 0.04 chamfer on the back | [REP] |
| Layout | 2 per corner on a curve 4.6 mm inside the base outline, pairs 7.6 mm apart, clear of screw heads by ≥ 1.5 mm | [PR] (#10, #52) |
| Base outline | `SORA_FOOTPRINT`: convex hull of Brock's scan below Y = 1.2 mm, 64 points, 56.8 × 108.8 mm at pad level, in the scan's own (unmirrored) frame, so +X is the side-button side | [DV] (stand-in for the shell's real outline) |
| Screws | `STANDIN_SCREWS` (4 positions) until the shell publishes its own; the heads are the fasteners' M2 pan heads in Ø4.5 counterbores, 0.15 mm inside the plate face | stand-in positions / [REP] heads |

### Battery (`battery.js`)
| Item | Value | Label |
|---|---|---|
| Cell | 502030 class: 5.0 × 20 × 30 mm, 3.7 V, 250 mAh, 0.925 Wh (retail 502030 listings, e.g. Akyga AKY0106: 6 g with leads) | [MC] of a typical cell / [REP] |
| Why this size | 250 mAh matches the SLX's Jauch cell [MC]; the V4 Pro's 306 mAh [IM] would be a 602030-class 6 mm cell. 502030 is the common 250 mAh pouch | [DV] |
| Pouch | deep-drawn body with rounded edges, folded side seals, top seal flange, Al (+) and Ni (−) tabs | [REP] |
| PCM | protection IC + dual MOSFET (SOT-23-6 class), passives, NTC, 3 pads, under amber Kapton | [REP] |
| Lead | 3 wires (red +, black −, white NTC), twisted (#69), ~40 mm, fanning into a JST SH 3-pin plug (SHR-03V-S-B class: 4.0 mm wide per JST's B = A + 2.0) into a side-entry header (#71) | [DS] width / [REP] rest |
| Retaining | two silicone bands instead of adhesive (Brock's note) | [PR] |
| Label | "LITHIUM POLYMER / 3.7 V   250 mAh   0.93 Wh / Li-Po 502030   PCM   NTC / THESEUS" with a stripe in Theseus's colour (C.hero via `setHighlight`); weight only if `opts.weight` is given (Brock likes weight printed on the battery, but no verified number exists yet) | [PR] |

## Look, materials, technique
- **Materials** (`lib/materials.js`): calibrated under the studio's AgX + RoomEnvironment rig. Black plastics use low `specularIntensity` so they read near-black (the studio's warning about mid-grey blacks); `maskBlack` is a macro-safe solder mask (the studio `mask` reads silver at grazing angles in close-ups). Gold `#f3c35a`, satin gold for stamped terminals. Pink PC: near-white transmission tint + short pink attenuation + a pink grazing sheen lobe, so the faces stay clear and the rims glow pink (Gateron's look) on both backgrounds. Magnesium: anisotropic with a per-vertex **circumferential tangent** attribute (no UV seams) and `anisotropyRotation = π/2`, the lathe-turned read.
- **Section technique** (`lib/section.js`, `SectionPlane`): each registered mesh gets the plane as a material clipping plane and a back-face twin whose fragment normal is forced to the plane normal (`-clippingPlanes[0].xyz`). For closed meshes only the cut exposes back faces, so the twin reads as a solid cap: no stencil buffer, works in the deck's renderer as-is. Rules learned: caps must not receive shadows (they would be sampled at the hidden back faces), and adjacent solids need hairline gaps (2–6 µm) or their coplanar faces fight in the cap.
- **Edges** for the GT01 cutaway: screen-space fat lines (`LineSegments2`) with a small clip-space depth bias so the surface they lie on does not hide them.
- **Baked occlusion:** the screw head, thread, insert and knurls carry occlusion in a `color` attribute (darker in the recess, the thread roots and the knurl valleys) and draw with copies of their materials that multiply by it, with no clearcoat (its highlight would ignore the occlusion). Section caps switch vertex colours off.
- **Theseus's colour:** flat, never emissive and never a gradient in 3D. `lib/studio.js` `HIGHLIGHT` is the fallback per theme; at run time the deck's `C.hero` (which follows `?hue`) reaches each scene's `setHighlight(color)` (the encoder's beams, the battery's label stripe, the lattice's caps, ties and marks). Red stays for problems; the PCB's charge flow stays yellow.
- **Offline CSG** (`tools/build_geo.py`, manifold3d): GT01 cover (two markings), M2 head recess. Output is quantized (uint16) base64 in ES modules so imports stay synchronous; normals are re-creased in JS at 1e-4 mm hashing (three's `toCreasedNormals` hashes at 0.01 units, too coarse for 0.05 mm features).
- Triangle budget (measured): GT01 24 k; wheel + axle + encoder + support 76 k (the wheel alone 42 k: knurl 14 k, rim 10 k, arms 10 k); Mill-Max demo 9.8 k; screw joint 92 k (the screw at `detail: 'low'` 13 k); insert 33 k; one skate 4.4 k, set of 8 + base + 4 heads 78 k; battery + plug + header 37 k; radio module 9.9 k, sensor module 4.1 k, lens 6.6 k.

## Test bench and shots
- `test.html?part=gt01|wheel|millmax|joint|screw|insert|skate|skates|battery&theme=paper|night` with sliders for every setter, a part selector, drag-to-orbit. URL params: `view` (studio view names) or `dir=x,y,z`, `zoom` (frame margin), `target=x,y,z&radius=r` (close-up in the part's frame), `flip=1`, `ui=0`, plus states (`press, releasing, explode, cutaway, scroll, xray, insert, section, drive, plug, bands`) and options (`tilt, cover, marking, steps, grousers, encoder=0, support=0, variant, sock=1, pin=0, pcb=0, material=PTFE, base=0, bandColor=accent`). Sets `window.__ready`.
- `shots/`: 2× finals (3200 × 1800) on both themes, named `<part>-<view or state>-<theme>.png`; `shots/contact-sheet.jpg` shows them all. Regenerate from `3d/` with `node parts/tools/shoot.mjs parts/tools/shots.json --scale=2 --jobs=1 --skip=1` (one browser restarted every 8 shots, generous timeouts, refuses lost WebGL contexts; `--only=<substr>` for a subset), then `python3 -I parts/tools/validate_shots.py --delete` to drop blank frames and rerun with `--skip=1`. Run one job at a time: SwiftShader is multi-threaded and two instances on this 2-CPU box thrash (the shared `tools/shot.mjs` also times out on 2× transmission renders under load).
- `tools/peval.mjs "<query>" "<js>"`: load the bench headless and evaluate an expression (debugging).

## Handedness (after the CONVENTIONS fix)
+X is the user's LEFT. What that means here:
- Skates: the layout is mirror-symmetric (two per corner) and the footprint comes from the unmirrored scan, so nothing moved. `STANDIN_SCREWS` are symmetric.
- Scroll wheel: default encoder side is now the user's right (−X), matching the Sora V2 PCB photo (top view, nose up: encoder image-right). The wheel shots were re-rendered with mirrored cameras.
- Battery: lead and header on the user's left (+X) by default, `connectorSide: 'right'` mirrors them. No reference fixes this side; the PCB layout should decide.
- GT01: symmetric about its own X except the cutaway side (−X half removed); the locating peg is gone (2026-11-04).
- The studio's `threeQuarter` view looks from the front-right of the user (camera at −X); `threeQuarterRight` from the front-left.

## H1 changes (2026-11-06, board plan 5)
- **GT01 bottom housing (`gt01.js`, F30.18, F30.24):** one housing wall, **0.70 mm** (it was 0.45, the D2F cover's): the median web
  measured on Gateron's side-on render (cut-out to edge 0.39 to 0.43, cut-out to cut-out 0.62 to 1.27; work/h1/gt01/measure.py).
  Side skins 0.70; every cut-out 0.70 from the edges round it (the triangle's bottom and back by the wall; the round holes keep
  the render's centres, radii 0.76 back and 0.79 front); the webs between cut-outs 0.92 mm or more. The slot moved to where the
  render has it, (0.15, 2.30), 2.11 x 1.10 (v23's sat 1.07 mm high). The cover's end walls stay 0.45 (`COVER_WALL`).
  `spec.profile` carries `wall`, `coverWall`, `holes`. The 2D twin (`clk_gt01MM`, deck 10-b-click.js) has the same numbers.
- **Encoder and support (`scrollwheel.js`), to sit on the plan-5 board:** the frame's J-hook legs stood in the frame's plane, 6.65
  to 6.90 mm from the wheel's centre, over the wheel bay (x +/-7.20): they are now the side tabs run down to the board and bent
  out into two SMD feet (7.88 to 8.82 from the centre, z +/-5.55 to 6.51) on the board's F1/F2 pads. The support stands on the
  board's bracket footprint WB1 (10.4 from the centre): a base 7.75 to 13.05 with a window over the middle-click tact switch,
  four tin hold-down tabs on WB1's pads (8.3 and 12.5, z +/-3.45), a post at the bay's edge (7.9 to 9.7) and the U seat
  cantilevered over the bay (5.3 to 7.9); the axle's left end 7.7 (was 8.3, which ran into the post). Masses from the meshes:
  encoder 1.59 g as modelled solid (about 1.0 g with 0.5 mm housing shells, the figure mass.py uses), support 0.26 g.
- **Lens (`boardparts.js`):** 1.12 mm shallower, so its lowest point (the imaging dome) is 2.40 mm over the pad, PixArt's lens
  reference plane (`LENS_SPEC.referencePlaneOverPad`); it was 1.28, out of focus.
- **Skate sets (`skates.js`):** `buildSkateSets({ sensor, lensY })`: the stand-in base's lens window, the lens ring and the clip-on
  lens with its two dots sit on the sensor (meta.sensor, z 16.57 since plan 5); the lens's pads reach from the dots to its face.

## Known gaps / stand-ins
- GT01 has no public datasheet: footprint, pin form, internal mechanism and pin cover are representative. The snap mechanism is kinematic (no spring physics); hysteresis needs the caller to say `releasing`.
- Wheel: the rim, arm and hub sizes are design values sized to Brock's 0.9 g, not an FEA result; PMM's photos were not visible from the build machine (its page text was), so the form follows Brock's description, not a measurement of PMM's wheel. The encoder's dimensions are read off a launch photo, not a drawing; its body is a shell around the interrupter, seen through in x-ray mode, not a moulding with draft and ribs.
- The boss, floor, plate, board slices and the skate set's base plate are **stand-ins** for shell/PCB geometry, clearly named `*StandIn` / `boss` / `plate` / `pcbTile`; the skate set's screw positions are too (`STANDIN_SCREWS`), its heads are real.
- Board parts: the radio module is drawn to the MDBT50Q-style form with the board's U1 footprint size, not a Raytac drawing; the sensor module and the lens are proposals drawn from Brock's photos.
- Battery label text is a proposal; no verified cell weight, so none is printed by default.
- `marking` strings other than `GT01`/`''` need `python3 -I parts/tools/build_geo.py gt01` after editing the list there.
