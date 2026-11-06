# Research requests

Append new needs here: who, what, the query you would run, the slide it feeds, and how much it matters (changes a number on screen / sharpens a claim / nice to have).

- **H1 (hardware)**, Raytac AN54LM-P20A (nRF54LM20A module, long meander PCB antenna): body size (L x W x H), the antenna
  section's length and its recommended keep-out. Query: "Raytac AN54LM-P20A datasheet dimensions antenna keep-out" (or
  raytac.com product page). Feeds the board (3d/pcb, plan 5: footprint 9.9 x 13.3 from the AN54LM-20A, keep-out 4.3 mm
  past the antenna end) and every board slide (b07, b09). Matters: changes a number on screen (the module's size and the
  keep-out drawn on the board).
- **H1 (hardware)**, C&K PCM12 right-angle SMD slide switch: body L x W x H and how far the actuator stands past the
  board edge. Query: "C&K PCM12SMTR datasheet dimensions actuator". Feeds the board's variant B (edge power switch,
  F30.17; drawn 6.7 x 2.6 x 1.4, actuator 1.5 mm past the edge). Matters: sharpens a claim (variant B renders only).

## 08:55 integrator (from reviewing the live frames; claims already on screen, so high priority)
- Q1, b01_compromise (the film's second slide, so every fact must hold): verify each rival line as printed: "Pro X3
  Superstrike, Logitech, $199.99, haptic triggers, 59.0 g" (is the product the PRO X2 or X3 SUPERSTRIKE? the deck says X3,
  b01's notes mention an "X2 Superstrike" on EloShapes); "HTS Ultra 8K, G-Wolves, $119, 31.0 g, battery life 80 h" (does a
  model by that name exist? b07 also needs it); "Viper V4 Pro, Razer, $159.99, optical switches"; "ULX, Finalmouse, $189,
  38.0 g"; "X2F CrazyLight, Pulsar, $149.95, 29.5 g" (Pulsar: 29 ± 2 g); "XA25, XBAB, $169, 24.9 g, wired only". Name, price,
  weight (scale if any) and the trade named, each with its source.
- Q1, b03_side shows "0 other mice with SPDT side buttons": is there any mouse whose side buttons use 3-pin (SPDT) switches
  (teardowns: TechPowerUp, Igor's Lab, r/MouseReview)? If one exists the slide must change.
- Q1, b06_lattice / b06_light label the hexagon lattice "MOST MICE": which current mice use hexagonal (honeycomb) lattices
  or cut-outs vs solid shells (e.g. Finalmouse ULX, G-Wolves, Razer Viper Mini SE)? The label may need to become
  "honeycomb mice".
- Q2, b01_lighter ("back on the target in half the time"): masses of the finger segments that move a mouse in fingertip
  grip (distal and middle phalanges of index and middle fingers, g, from a segment-parameter source such as Chandler 1975,
  Clauser 1969 or a hand anthropometry paper); and any study measuring how mouse mass changes pointing or aiming
  performance (movement time, overshoot, accuracy).

## b01 (09:0x)
- **b01**, b01_compromise (critic R-b01-5): RTINGS's "Finalmouse UltralightX" review (rtings.com/mouse/reviews/finalmouse/
  ultralightx, Default Weight 38.0 g): which variant and size it is (UltralightX Competition, Prophecy, Pro Series; S/M/L)
  and its US price. RTINGS's compare page (ULX Pro Series vs UltralightX Competition) says the Competition showed
  "noticeable flexibility, popping, and creaking". Query: "RTINGS Finalmouse UltralightX review which size weight 38 g".
  Matters: changes a name and a weight on screen (the row now reads "UltralightX, $189, 38.0 g").
- **b01**, b01_battery: battery capacities (mAh) of the Keychron G3, Logitech Pro X3 Superstrike, Razer DeathAdder V4 Pro,
  Logitech GPX2 / GPX2c, Razer Viper V3 Pro, ZOWIE EC2-DW / U2-DW (teardowns: TechPowerUp, Igor's Lab). Query: "<mouse>
  teardown battery mAh". Matters: sharpens a claim (draws each listed mouse's battery to scale beside its hours).

## R, critic (09:1x machine clock)
- **R**, b01_compromise + b05_fallacy (FILM.md F17): the same mouse gets opposite build verdicts. b01 cites RTINGS (UltralightX
  Competition: "noticeable flexibility, popping, and creaking"); b05_fallacy cites Periview (ULX Competition: "The sides are
  solid", less flex than earlier models) as the light mouse built better than the GPX 2. Which holds for the current ULX
  Competition? Query: "TechPowerUp Finalmouse ULX Competition review build quality creak flex" and "RTINGS UltralightX
  Competition build quality". Matters: changes a claim on two slides (one must change).
- **R**, b10_lights: "Logitech's G703 lasts 30 h with its lighting off, 22 h with RGB cycling" has no source entry in
  30-b10-power.js. Query: "Logitech G703 LIGHTSPEED battery life lighting off hours" (Logitech's spec page lists hours with and
  without lighting). Matters: changes a number on screen.
- **R**, b03_timing: the slide says "most mice read NO, then wait out the bounce" (4 ms debounce, +3.0 ms, TechPowerUp), but
  b03_switch counts 16 to 19 of 35 flagships as optical (no debounce). What default debounce do the mechanical-switch flagships
  ship with (2025-26: e.g. Logitech GPX2, Lamzu, Pulsar, VAXEE, ZOWIE)? Query: "<mouse> default debounce time ms review".
  Matters: sharpens a claim (who "most mice" is on that slide).
- **R**, b08_grip (nice to have): a measured fingertip friction coefficient on mouse grip tape (Lizard Skins DSP, Pulsar
  SuperGrip) and on soft-touch coating, so the slide's rival column can carry numbers. Query: "fingertip friction coefficient
  grip tape" / "skin friction soft touch coating coefficient". Matters: nice to have.

## M, model auditor (09:14)
- **M**, b04_focus: the ADNS-3080 datasheet's Fig. 11 "Mean Resolution vs. Z": do counts fall as the lens rises, and by
  about 4 % per 0.1 mm? (the slide's 9 % long / 8 % short / within 4 % come from a thin-lens scale v0/u). Query: "ADNS-3080
  datasheet mean resolution vs Z". Matters: changes numbers on screen (sign and size).
- **M**, b07_arms and b05_specific (Brock's F41.1, two strengths): The Gund Company NEMA FR4 datasheet's flexural strength,
  lengthwise and crosswise (b07 uses 483 MPa crosswise, not in the cited entry), and flexural strength or modulus of
  rupture for Denka ABS GR-2000, Covestro Makrolon 2405, magnesium AZ91D (cast) and aluminium 6061-T6. Query: "<material>
  flexural strength datasheet". Matters: changes the strength ranking on b05_specific and b07's FR4 figure.
- **M**, b03_switch: Nordic nRF54L15 (or nRF54LM20A) GPIO pull-up resistance, typical and range (the SPDT's NC contact is
  closed at rest; an always-on pull-up draws V/R). Query: "nRF54L15 datasheet GPIO pull-up resistance". Sharpens a claim.
- **M**, b02_pom: thickness tolerance of precision POM (acetal) shim sheet in 0.55 to 0.85 mm. Query: "acetal shim stock
  thickness tolerance 0.5 mm". Nice to have.
- **M**, b02_tensioner: the Finalmouse Starlight X's shell or trigger composite modulus (flexural), if published. Query:
  "Finalmouse Starlight X carbon composite modulus". Sharpens a claim (the rival is modelled in PP-C-20A now).

## L1, the lattice study (09:5x)
- **L1**, b12_latopt (the lattice study slide, F43.4): a moulding guide's **rib rules** for polypropylene or carbon-filled PP,
  verbatim with the URL: rib thickness as a % of the nominal wall to avoid sink marks (the usual "40 to 60 %", and whether
  PP / filled grades get a different figure), rib height limit (× wall), rib root radius (× wall), minimum rib thickness or
  the smallest practical rib for a 0.6 to 1.0 mm wall. Already have (from URLs in the deck): Envalior radii (25 to 60 % of
  the wall, at least 0.5 mm; SCF 1.5 at 0.5 t, 3 at 0.1 t), RapidDirect (inside radius at least 0.5 t; past about 0.75 t
  "may induce sink or thick-section issues"), Beall 106 (25 / 50 / 75 %), Protolabs (PP wall 0.889 to 3.81 mm; "thinner
  walls ... no less than 40-60% the width of adjacent walls"). Query: "rib thickness percentage of wall thickness
  polypropylene sink marks design guide" (Protolabs rib design tip, Covestro/BASF/DuPont/Celanese part design guides,
  Xometry). Matters: the study's moulding constraint and the slide's constraint line.

## R3, the critic (12:1x)
- **R3**, b04_sensor (P3): PixArt **PAW3950** datasheet figures, verbatim with the URL: maximum tracking speed (ips),
  maximum acceleration (G), maximum cpi and cpi step, frame rate. The slide strikes the older PAW3395 (650 ips, 50 G,
  26,000 cpi in 50-cpi steps) though the film names the PAW3950 as the flagships' sensor (b09_sync, XA25). Query: "PixArt
  PAW3950 datasheet IPS acceleration DPI" (PixArt product page, a maker's spec sheet citing it, or TechPowerUp's XA25 /
  Superlight review). Matters: the verdict's struck value (G5, never in Theseus's favour).
- **R3**, FILM F42 (integrator, L1, P4): the **minimum wall** for injection-moulded PP or 20 % carbon-filled PP: Protolabs
  gives 0.889 mm in its design guidelines and 0.635 mm (0.025 in) on its Injection Molding Basics page; which applies to a
  0.60 mm skin over 1.8 mm-deep ribs with a ~60 mm flow length? Query: "minimum wall thickness polypropylene injection
  molding flow length ratio carbon fiber filled PP thin wall 0.6 mm". Matters: b05_wall's "fills down to 0.89 mm" against
  L1's 0.60 mm skin and 0.36 mm ribs (b12_ribs).
