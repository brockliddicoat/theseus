## The name

**Theseus.** Nothing in the repo records a change of name. See "The name" at the top of this page.

## The headline numbers

The film's own numbers live in one place: `THESEUS` in deck/src/05-data.js. The film checks them against their derivations
at startup.

| | Now | Basis |
|---|---|---|
| Weight | **27.95 g** | target, built up part by part (the ledger below) |
| Price | $189 | Brock's target, 2026-11-04 |
| Size | 119.3 × 62.4 × 39.9 mm (L × W × H) | Brock (F12.11); the height is stated as 39.9 mm (F47.1) |
| Battery life | 194 h at 1 kHz | derived: 194.7 h, floored |
| Battery life at 8 kHz | 43 h, against the Viper V4 Pro's 40 h | derived; V4's caveat is in section 4 |
| The board | 5.60 g target; 5.68 g as built, accepted (F56.1) | built up part by part |

## The weight target, and how it got here

1. **2026-11-04, Brock's targets:** 29.31 g, $189, one board of about 5.6 g, and 200 h at 1 kHz.
2. **2026-11-06 17:08, F64.11:** "the battery should only need to be 300mah". EEMB's LP402535 (300 mAh minimum, about
   6.40 g) replaced Jauch's LP402535JU (370 mAh, 8 g).
   - Asked where the freed weight goes, he answered "Lighter mouse, 27.7 g (Recommended)".
   - So 29.31 − (8 − 6.40) = **27.71 g**.
3. **2026-11-07 ~02:00, F64.16:** the board's waterproof coat counts, "Add it: 27.95 g (Recommended)". 27.71 + 0.24 =
   **27.95 g**. Live since version 1794039339-1c54.
4. **The shell's allowance did not move** through either change.
5. **200 h is no longer claimed.** The film counts the pack's 300 mAh minimum: 194 h. 200 h would need EEMB's typical
   320 mAh (207.6 h), which is never counted.

**Open: the ledger still counts the board at its 5.60 g target.**

- F56.1 accepted the board at 5.68 g as built ("Accept 5.68 g (Recommended)"), with a TODO to change the budget's board line.
- `THESEUS.pcb` and the ledger still say 5.60 g.
- So 27.95 g holds only if the shell gives back 0.08 g, or the board meets its target. Otherwise the total is 28.03 g
  (derived).

## The full weight budget

**The ledger, as the live film computes it** (`b01_budget()`, read from the live build on 2026-11-10). Each row is typed
once in the deck's data; the shell's line is what is left.

| Part | Weight (g) | Basis | Note |
|---|---:|---|---|
| Battery, 300 mAh | 6.40 | sourced ("about") | EEMB LP402535 |
| One board | 5.60 | target | Radio, antenna and USB-C on it. As built 5.68 g (see above) |
| Buttons | 3.328 | claim | As XBAB weighed the XA25's (they stand in for Theseus's) |
| Side switches × 2 | 1.00 | estimate | Two full-size SPDT, about 0.5 g each, typical |
| Wheel and axle | 1.02 | derived | Magnesium wheel 0.90 g on a POM axle 0.12 g |
| Brass inserts × 4 | 0.516 | derived | 0.129 g each |
| Titanium screws × 4 | 0.418 | derived | M2 × 4, 0.105 g each |
| Side-button lead | 0.08 | derived | 32 AWG, braided |
| Board coat | 0.24 | derived | Urethane, 50 µm on both faces, plus 10 % for the parts' flanks, at 1.05 g/cm³ |
| **Everything above** | **18.60** | derived | |
| **Shell and skates** (what is left) | **9.35** | derived | 27.95 − 18.60; 2.81 g under the XA25's shell (12.16 g, XBAB) |
| **Total** | **27.95** | target | |

The older `budget` slide (`ntr_budget()`, not in the film) groups the two side switches into the shell's allowance. It
shows the same 27.95 g as a 10.35 g shell and 1.81 g under the XA25.

**The balance model** (3d/pcb/pcb-balance.json, from 3d/pcb/tools/balance.py). This is the same 27.95 g, part by part,
with where each part sits.

- Coordinates are in the mouse's frame, in mm: +X is the user's left (the side-button side), +Y is up, +Z is toward the
  nose.
- The shell's 9.35 g splits into the shell (8.031 g) and its four screw posts.
- The posts and the side switches sit at estimated places. The shape work (S2) was to place the real ones.

{BALANCE_TABLE}

## The redesigned board: board plan 5, built at 0.6 mm and two layers

**How it came to be.**

- **Plan 5 is the placement plan Brock approved** (F30). He reviewed plans 1 to 5 on 2026-11-05 between 05:22 and 07:15,
  and it was built on 2026-11-06 (H1).
- **Then it was made 0.6 mm and two layers** (H3; F47.4, "0.6 mm, 5.63 g").
- **Then the battery behind it moved** (H5; F64.15).
- **Two builds share the outline:**
  - A, the deck's board: 3d/pcb/pcb-layout.json, with the power switch over its window.
  - B, used for renders: pcb-layout-b.json, with the power switch hanging off the edge (F30.17).

**The outline.**

- One mirrored outline, 38.06 × 59.06 mm: x ±19.03; layout z −7.61 to 51.45; mouse z = layout z − 2.88.
  - Derived from the layout: 1,991.6 mm² inside the outline, and 1,702 mm² of laminate net of the wheel bay, windows and
    holes (mass.py).
- The half-width is 19.03 mm, and 15.42 mm at the waist.
- One notch depth, 3.61 mm, serves the side notches, the rear notch and the front trapezoid. The rear notch is as long as
  the side notches (F30.22, F30.25).
- Every chamfer is at 35.24°. Every corner is filleted at one tangent length, 1.0 mm (F30.14).
- The wheel bay is centred on x 0, chamfered and filleted the same way, with a 0.35 mm gold trim (F30.21, F30.23).

**The stack.**

- 0.6 mm FR4 finished; two copper layers, 0.5 oz (17.5 µm) outer copper; ENIG; glossy black mask; tented vias. The fab line
  reads "2L 0.6mm ENIG".
- All parts are on the top side, so it takes one reflow pass.
- The bottom (L4) carries the long runs, the power crossings and the art: the triangle mosaic, "THESEUS", and a 7.2 mm QR.
  The QR still encodes a placeholder URL.
- The design rule check reports 0 errors on both builds. Every net is routed, and the ground is one piece.
- Bending stiffness is 21.6 % of the 1.0 mm board's; in its own plane, 60 % (derived).

**The layout** (3d/pcb/pcb-layout.json, build A). x is in the mouse's frame (+X the user's left); z is the layout's (+Z the
nose; mouse z = z − 2.88). The labels in brackets are the layout's own:

| Label | Meaning |
|---|---|
| DS | datasheet |
| REP | representative |
| PR | proposal |

{BOARD_TABLE}

Also on the board:

- **Mounting holes:** in mirror pairs. MH1 and MH2 at x ±10.10, z 29.50; MH3 and MH4 at x ±14.59, z −2.25.
- **The radio's antenna keep-out:** x ±6.6, z 7.95 to 12.25, on all layers.
- **The battery:** 37.0 × 25.5 × 4.3 mm, behind the board. Its centre is at mouse z −34.32, 7.46 mm over the pad.

**What moved, against the board in the Nov 5 deck** (the Sora V2's board traced from a photo, 38.64 × 57.52 mm, with
Theseus's parts on it):

1. **The sensor and the radio module swapped** (F30.3):
   - The sensor (PixArt PAW3970) goes as far forward as it can.
   - The Raytac module sits behind it, with its long meander antenna at its front end, facing the sensor (F40.4: "Keep
     facing forward").
   - Equal 1.60 mm gaps run down the centre line: wheel bay to sensor, sensor to module, module to the edge (F30.12).
2. **The power chip** (nPM1300) went to the left-middle spot, away from the radio (F30.1, F30.3).
3. **The battery plug** (J2) opens toward the tail (F26.4, F30.9). The side-button plug (J3) opens to the left wall.
4. **The USB-C receptacle** is 1.05 mm further back and hangs 1.60 mm past the front edge (F30.21, F30.25).
5. **The outline** became one mirrored shape, as above. The back notch is kept and every fillet is the same (F30.2,
   F30.14, F30.22, F30.23).
6. **Holes:**
   - The mounting holes are in mirror pairs.
   - SH1, SH2, LH1 and LH2 are dropped, and cutouts are added where they fit (F30.16).
   - The rail test pads are in a row at z 13.0.
7. **The old back artwork stays** (F30.15).
8. **0.6 mm, two layers** (H3, F47.4):
   - Everything that ran on the inner layers now runs on the bottom, kept out of the art.
   - The module's two decoupling capacitors moved apart (C11 0.5 mm left, C10 0.3 mm right) to open a via site.
   - CC1's via moved 0.15 mm off R3's pad.
   - The encoder's footprint lost its two solder feet and gained two holes for its moulded pegs.
9. **The battery moved 7.34 mm back** (H5, F64.15: "Move it back"):
   - Its centre went to mouse z −34.32 (layout −31.44) so the lighter pack balances the mouse.
   - Before the coat, the centre of mass sat at z 0.00, 12.91 mm up and 0.68 mm toward the side buttons.
   - With the coat (0.24 g at the board's centroid) it sits at z +0.16, 12.84 mm up and 0.67 mm toward the side buttons.
   - balance.py puts the battery at z −35.02 for exactly 0 (derived, pcb-balance.json).

**Its mass** (3d/pcb/pcb-mass.json and 3d/pcb/README.md, from 3d/pcb/tools/mass.py). Component masses are typical values for
each package class, not weighed parts.

| Item | g |
|---|---:|
| Laminate (1,702 mm² × 0.565 mm, FR4 at 1.85 g/cm³) | 1.78 |
| Copper (two layers, 17.5 µm, on the real copper areas) and via barrels | 0.37 |
| Solder mask | 0.10 |
| **Bare board** | **2.25** |
| Gateron GT01 × 2 (about 0.5 g each, typical, not weighed) | 1.00 |
| Raytac module | 0.45 |
| USB-C receptacle | 0.40 |
| Sensor 0.25 and clip-on lens 0.07 | 0.32 |
| Mill-Max 3305 × 6 (0.03 g each from geometry) | 0.18 |
| Two JSTs, the slide and tact switches, the PMIC, inductors, passives, ESD, TVS, solder | 0.41 |
| **Board and the parts on it** | **5.01** |
| The magnetic encoder, as drawn | 0.475 |
| The cored wheel support, as drawn | 0.202 |
| **As built, what the 5.6 g target covers** | **5.68** |

- Target 5.60 g (F42.2), predicted 5.63 g (F47.4); 5.68 g as built, accepted (F56.1). The board started at 7.92 g as first
  built (1.0 mm, four layers).
- **Most uncertain lines:**
  - The Mill-Max sockets: Brock's figure is 0.11 g each, which would add 0.48 g.
  - The GT01s: typical figures, not weighed.
  - The encoder and support: from their 3D models.
- **Not counted:** the leads and plugs.
- **Including the wheel itself** (0.90 g and its 0.116 g axle), the board and wheel together weigh 6.70 g. That is the
  figure comparable to the Sora V2's "PCB & wheel", 8.29 g.

## The picks

**Main switches: Gateron GT01 × 2.**

- A vertical-push mouse switch. Gateron's figures (claim): 55 ± 5 gf over 0.35 ± 0.10 mm, no preload, 100 million clicks.
  No datasheet is published.
- Mechanical, not optical. The battery story counts this: it beats the Viper V4 Pro, which runs two optical switches.
- Each sits in three Mill-Max 3305 claw receptacles, so it hot-swaps.
- Each stands on a 20° wedge, so its axis lies on the trigger's arc. The bottom housing has straight 0.45 mm walls (v23,
  F30.18); Brock asked for them thicker (F30.24), still to do.
- Gateron's own render of the GT01 is the reference for every drawing (F28).

**Scroll encoder: magnetic (Hall), Theseus's own design (proposal).**

- Chosen over TTC's optical encoder (F27: a magnetic encoder that dust doesn't affect).
- Inside: a Ø3.0 × 0.8 mm diametric NdFeB magnet on a POM rotor, 0.4 mm from a 3D Hall angle sensor (KTH5791 class, A/B
  quadrature) on its own small board.
- A 24-lobe detent star and a clear top housing.
- No metal frame: moulded locating pegs instead (F47.4, H3).
- 0.475 g as drawn.
- It sits on a six-arm magnesium wheel (0.90 g, Ø22.74 × 7.0 mm) on a POM axle, beside a cored POM support over the middle
  click (an SMD tact switch).
- In the board's layout: 3d/parts/scrollwheel.js, ENC1.

**Sensor: PixArt PAW3970.** The Viper V4 Pro's sensor (F21.6).

- In a castellated module, as far forward on the board as it goes (F30.3).
- Under a smaller clip-on lens of clear PC, whose lowest point sits 2.40 mm over the pad.

**Battery: EEMB LP402535.**

- 300 mAh minimum (320 typical), 3.7 V, 1.11 Wh, about 6.40 g.
- 37.0 × 25.5 × 4.3 mm, its largest listed size.
- Behind the board, its centre at mouse z −34.32 (H5).
- 194 h at 1 kHz and 43 h at 8 kHz (derived from the Viper V4 Pro's draw, less its two optical switches).
- Replaced Jauch's 370 mAh, 8 g pack (F64.11).

**Also on the board:**

- **Raytac AN54LM-P20A:** an nRF54LM20A module with BLE 6.0, high-speed USB and a long meander PCB antenna facing forward.
  Raytac lists its certifications as intended.
- **Nordic nPM1300 PMIC:** charging at 32 to 800 mA, with JEITA temperature limits, a fuel gauge and two bucks. The power
  slide switch puts the mouse into ship mode.
- **The side buttons:** two full-size SPDT switches, about 0.5 g each, taken from the shell's allowance (F44.2).
  - Each button presses through two posts tied by a stabiliser wire, so nothing tilts (F48.1: "Tied posts (wire)"). That
    gives 56 to 59 gf at the tip for a 55 gf switch.
  - A 32 AWG lead runs to J3.
- **The mechanical parts:**
  - POM pads, fitted to each trigger from a tray of sizes (F31.3, F44.3).
  - Four titanium M2 screws into brass inserts.
