# THESEUS — storyboard for the rebuild

The deck keeps its chapter order. Every chapter gets (a) the new design system (`DESIGN.md`), (b) the research corrections (`../research/validation-report-2026-11-03.md`), (c) a **step-further beat** for every idea that already exists in shipping mice (`../research/data/step_further.json`), (d) as many **competitor comparisons** as the data supports (`../research/data/*.json`: bars first; XY with sweet-spot gradients; Pareto frontiers), and (e) 3D renders where they explain better than a drawing (`../3d/*`). Every idea number in Brock's doc keeps at least one animated visualization (full slide or an idea sheet).

Evidence tags on every number: MEASURED · DATASHEET · MAKER CLAIM · DERIVED (formula on screen) · PROPOSAL · PROJECTED.

## The step-further pattern
For an idea that already ships somewhere: show the best competitor implementation first (named, with its number and its known limitation, cited), then the Theseus version doing one more thing, ideally with a number that moves (bar grows, gap closes). One beat, not a new slide, unless the comparison deserves a chart.

## 0 · INTRO
- **cover** — THESEUS. Typographic composition; the shape as the simplified Sora silhouette or the 3D hero.
- **thesis** — "Optimization over opinion": how the deck labels evidence (the tag legend as a designed object).
- **29 G** — weight budget, XBAB breakdown style; competitors' totals beside it (Viper V4 Pro 49 g, SLX 38 g, Sora V2 39–41 g, XA25 24.94 g wired, ULX ~29–35 g).
- **zero grams** — Zaunkoenig's finding that the optimal mouse weight is zero grams, plus the other mass studies (Conroy 2022, Yan 2022): why every gram is fought for.
- **the market, on one chart** — Pareto frontier of weight vs battery life (and/or vs price) across flagships, with the sweet-spot gradient and Theseus' target.
- **targets / targets2** — "the bar": best figure anyone has shown per spec, who holds it, label, Theseus target (already exists; restyle as bar comparisons).
- **map** — seven areas, each down to the part (3D exploded view if ready).

## 1 · CLICKS (#2 3 4 14 17 18 28 29 46–50 56 59 64 78–80 83 91, magnetic)
arc (GT01 rotated, "Direct Drive Actuation" — 3D GT01 in the PCB), cutouts, anchors (dual plungers, G-Wolves → step further), tensioner, latency (SPDT; XBAB-style click-latency bars vs competitors: TPU/XBAB data; Viper V4 Pro 79 µs wired), magbuttons (SLX TMR-DS, Superstrike → step further), sidebuttons, **hot-swap claw sockets #14** (lost idea sheet; Mill-Max 3305 1,000 cycles, OP1 8K → step further: pin cover + keyed).

## 2 · GLIDE & TRACKING (#8 10 11 27 37 52 76 87, lod, xy dpi)
dots (8 dots; skate pressure), focus (0.4 mm window), sensor (FrameSync-class, proposal; V4 Pro 12-bit wireless counts and post-lift smoothing → step further: full reports, no smoothing), **sensor position #27** (Kim et al. CHI 2020 corrected: centre is the best default, 11–14% / 20–23% over front/rear, +4% individual calibration), lift-off steps (Razer 26-step asymmetric), lens.

## 3 · SHELL & STRUCTURE (#5 6 15 26 31 53 55 57 58 75 93–98)
materials (CF-PP ≈5× stiffer than ABS by modulus — DERIVED), thinwall, lattice, lattice2, fillet, filletsize, filletfe, arches (3D lattice cutaway + stress view), tolerance, ribs, sealed (RTINGS: Sora V2 solid vs ULX creaks), mass, grind.

## 4 · SURFACE & DETAILS (#7 12 16 30 32–34 60–62 67 82 84)
coating, grip, details (engravings; 3D close-up of the serial on the right click), wheel (**magnesium 6-spoke #84 + rover tread #30 + POM axle + optical encoder**; 3D wheel; Razer optical encoder "3.3×" MAKER CLAIM → step further).

## 5 · ELECTRONICS (#21–23 25 65 66 68 77 85–90 92 98–102, pmic, sync, link)
onechip (nRF54LM20A in the **Raytac AN54LM-20A**, #77 #102: certifications "intended"; 3D module + antenna keep-out), **PMIC (new)** (nPM1300: 32–800 mA, JEITA, gauge, watchdog, ship mode; V4 Pro charges at 0.169 A ≈ 0.55C vs 1C if the cell allows — DERIVED with the formula; heat (V_in − V_bat)·I; "replaces 4–6 support ICs with one" — never "fewer passives than a TP4054"), **one-sided assembly (new)** (one reflow pass vs two; parts hanging upside down on the second pass), **battery chemistry (new)** (Li-ion vs LiPo vs alkaline AA vs NiMH: Wh/kg, cycles, charge time), motion (lollipop chart), framesync, power, syncpower, antenna (3D), secondshot, dongle, cable, software, **haptics #89** (rec deck: unverified).

## 6 · SHAPE (#38–45 47, newton, size)
grooves, size, emg, **hump toward claw #41**, **contact-paint test #44**, the Sora V2 front as the reference for #38/#39 (Brock's doc names it).

## 7 · OWNERSHIP (#9 13 31 35 36 51 54 62 63 69–74 100)
repair, box, serial (**9-endings #35**: left-digit research), the PCB's bottom-side artwork (#63; 3D PCB underside).

## 8 · CLOSE
A closing line in Brock's voice; the 3D hero; THESEUS.

## Recommendations deck
Stays a separate page for now (contested ideas with verdicts); restyle it on the new system after the main deck.
