# F27: the rated slides as Brock saw them

Frames for FEEDBACK.md F27 (F50.1, job 3). On 2026-11-05, between 00:50 and 03:45 (Chicago), Brock rated 114 slides of
the old deck (143 slides) from 1 to 10 with the player's rating tool, 100 of them with a note. His notes, verbatim, are in
FEEDBACK.md F27; the slide numbers below are his ("slide 17"). One frame per slide, at its settle time (where its
animation comes to rest), 1280 px JPG.

- **Builds:** the published pages themselves, committed with each publish: v18 = `git show e6094e6:deck/dist/main.html`
  (published 00:45), v19 = `git show 6ec4864:deck/dist/main.html` (published 01:28; it changed the scroll wheel, the
  budget, frame sync and the note-saving bug). v20 went live at 04:07, after the last rating. Both have the same 143 slides
  in the same order.
- **Which version he rated:** the ratings carry no time of their own (the database kept one time for all). F24 (01:13)
  shows he had rated the intro through `map` (slide 15) before v19 went live, so the intro's frames are v18's and the rest
  v19's. 99 slides are pixel-identical in both; 7 differ only in a small detail (under 2,000 px), and only the
  likely version is kept; 8 differ visibly (v19's new six-arm wheel wherever the wheel is drawn, frame sync's 42 µs,
  the new budget and the numbers that follow from it), and both frames are kept.
- **The view:** the player opened in 3D by default then (2D if he had switched to it, remembered by his browser), so a
  slide with a 3D shot may have shown that shot instead of its 2D twin. The 3D assets on disk today are not 11-05's, so
  the 3D view can't be reproduced faithfully: these frames are the 2D view (`?2d=1`).
- Rendered 2026-11-06 with feedback/snap.js (one browser, the deck's capture hook `?cap=1&s=<id>&t=<settle>&2d=1`).

| Slide | Id | Chapter | His score | t (s) | Frame | Version | Title |
|---|---|---|---|---|---|---|---|
| 1 | `cover` | intro | 8/10 | 8 | [001_cover.jpg](001_cover.jpg) | v18 = v19 | Theseus: in pursuit of an objectively better mouse |
| 2 | `thesis` | intro | 3/10 | 10 | [002_thesis.jpg](002_thesis.jpg) | v18 = v19 | Optimization over opinion |
| 3 | `targets` | intro | 8/10 | 9 | [003_targets_v18.jpg](003_targets_v18.jpg), [003_targets_v19.jpg](003_targets_v19.jpg) | v18 (likely); v18 and v19 differ (7399 px), both kept | Targets, part one: speed |
| 4 | `targets2` | intro | 7/10 | 9 | [004_targets2.jpg](004_targets2.jpg) | v18 = v19 | Targets, part two: everything else |
| 5 | `flagships` | intro | 6/10 | 10 | [005_flagships.jpg](005_flagships.jpg) | v18 = v19 | Theseus against the flagships |
| 6 | `ntr_stats` | intro | 4/10 | 9 | [006_ntr_stats.jpg](006_ntr_stats.jpg) | v18 (likely); the other differs only in a small detail (238 px) | Theseus, by the numbers |
| 7 | `zerograms` | intro | 5/10 | 10 | [007_zerograms.jpg](007_zerograms.jpg) | v18 = v19 | The optimal weight is zero grams |
| 8 | `weightgap` | intro | 10/10 | 10 | [008_weightgap.jpg](008_weightgap.jpg) | v18 = v19 | Listed against weighed |
| 9 | `ntr_density` | intro | 9/10 | 10 | [009_ntr_density.jpg](009_ntr_density.jpg) | v18 (likely); the other differs only in a small detail (1169 px) | Density, not weight |
| 10 | `ntr_sizewt` | intro | 9/10 | 10 | [010_ntr_sizewt.jpg](010_ntr_sizewt.jpg) | v18 (likely); the other differs only in a small detail (520 px) | The size–weight illusion |
| 11 | `ntr_densrank` | intro | 9/10 | 10 | [011_ntr_densrank.jpg](011_ntr_densrank.jpg) | v18 = v19 | Ranked by density |
| 12 | `pricefront` | intro | 7/10 | 10 | [012_pricefront.jpg](012_pricefront.jpg) | v18 = v19 | Price against weight |
| 13 | `market` | intro | 8/10 | 10 | [013_market.jpg](013_market.jpg) | v18 = v19 | Battery life against weight |
| 14 | `budget` | intro | 6/10 | 11 | [014_budget_v18.jpg](014_budget_v18.jpg), [014_budget_v19.jpg](014_budget_v19.jpg) | v18 (likely); v18 and v19 differ (50276 px), both kept | Weight budget: 29.31 g, 200 h |
| 15 | `map` | intro | 2/10 | 8 | [015_map_v18.jpg](015_map_v18.jpg), [015_map_v19.jpg](015_map_v19.jpg) | v18 (likely); v18 and v19 differ (6442 px), both kept | Seven areas, each down to the part |
| 16 | `clicks` | click | 7/10 | 6 | [016_clicks.jpg](016_clicks.jpg) | v18 = v19 | Clicks |
| 17 | `arc` | click | 7/10 | 10 | [017_arc.jpg](017_arc.jpg) | v18 = v19 | Direct Drive Actuation |
| 18 | `clk_wedge` | click | 4/10 | 8 | [018_clk_wedge.jpg](018_clk_wedge.jpg) | v19 (likely); the other differs only in a small detail (130 px) | A switch wedge, one flat board |
| 19 | `clk_switch` | click | 5/10 | 9 | [019_clk_switch.jpg](019_clk_switch.jpg) | v18 = v19 | A mechanical switch: Gateron GT01 |
| 20 | `clk_switch2` | click | 2/10 | 9 | [020_clk_switch2.jpg](020_clk_switch2.jpg) | v18 = v19 | Operating force and rated life |
| 21 | `cutouts` | click | 3/10 | 10 | [021_cutouts.jpg](021_cutouts.jpg) | v19 (likely); the other differs only in a small detail (612 px) | Straight rear cutouts |
| 22 | `tensioner` | click | 8/10 | 10 | [022_tensioner.jpg](022_tensioner.jpg) | v18 = v19 | Bridge tensioner: where it bends, how easily |
| 23 | `clk_tenmat` | click | 4/10 | 9 | [023_clk_tenmat.jpg](023_clk_tenmat.jpg) | v18 = v19 | A stiff trigger with a light click |
| 24 | `anchors` | click | 7/10 | 10 | [024_anchors.jpg](024_anchors.jpg) | v18 = v19 | Dual rail main clicks |
| 25 | `clk_pomtune` | click | 6/10 | 10 | [025_clk_pomtune.jpg](025_clk_pomtune.jpg) | v18 = v19 | POM pad thickness sets the tolerance |
| 26 | `clk_front` | click | 8/10 | 10 | [026_clk_front.jpg](026_clk_front.jpg) | v18 = v19 | Flat front cutouts, flush walls |
| 27 | `clk_hotswap` | click | 4/10 | 10 | [027_clk_hotswap.jpg](027_clk_hotswap.jpg) | v18 = v19 | Hot-swap switches on claw sockets |
| 28 | `clk_spdt` | click | 5/10 | 10 | [028_clk_spdt.jpg](028_clk_spdt.jpg) | v18 = v19 | SPDT |
| 29 | `latency` | click | 6/10 | 11 | [029_latency.jpg](029_latency.jpg) | v18 = v19 | Counted at first contact |
| 30 | `clk_debounce` | click | 3/10 | 9 | [030_clk_debounce.jpg](030_clk_debounce.jpg) | v18 = v19 | Debounce costs milliseconds |
| 31 | `clk_wait` | click | 3/10 | 11 | [031_clk_wait.jpg](031_clk_wait.jpg) | v18 = v19 | Clicks that never wait for motion |
| 32 | `clk_methods` | click | 3/10 | 9 | [032_clk_methods.jpg](032_clk_methods.jpg) | v18 = v19 | Every click number has a method |
| 33 | `sidebuttons` | click | 5/10 | 10 | [033_sidebuttons.jpg](033_sidebuttons.jpg) | v18 = v19 | Dual rail side buttons |
| 34 | `glide` | glide | 7/10 | 5 | [034_glide.jpg](034_glide.jpg) | v18 = v19 | Glide and tracking |
| 35 | `gld_under` | glide | 4/10 | 9 | [035_gld_under.jpg](035_gld_under.jpg) | v18 = v19 | Skate sets: ten dots, or half-moons and a ring |
| 36 | `dots` | glide | 6/10 | 9 | [036_dots.jpg](036_dots.jpg) | v18 = v19 | Dot skates: more area, less sink |
| 37 | `gld_camera` | glide | 4/10 | 11 | [037_gld_camera.jpg](037_gld_camera.jpg) | v18 = v19 | Optical sensor: just a camera |
| 38 | `gld_corr` | glide | 5/10 | 11.6 | [038_gld_corr.jpg](038_gld_corr.jpg) | v18 = v19 | Frame correlation: how a sensor sees motion |
| 39 | `gld_blur` | glide | 2/10 | 11 | [039_gld_blur.jpg](039_gld_blur.jpg) | v18 = v19 | Defocus: like a phone camera |
| 41 | `gld_sag` | glide | 5/10 | 11 | [041_gld_sag.jpg](041_gld_sag.jpg) | v18 = v19 | Sensor dots: no sag at the lens |
| 42 | `gld_module` | glide | 8/10 | 10 | [042_gld_module.jpg](042_gld_module.jpg) | v18 = v19 | Snap-on lens: one dot wide |
| 43 | `sensor` | glide | 6/10 | 10 | [043_sensor.jpg](043_sensor.jpg) | v18 = v19 | Next-gen sensor: PixArt PAW3970 |
| 44 | `gld_reports` | glide | 3/10 | 10 | [044_gld_reports.jpg](044_gld_reports.jpg) | v18 = v19 | Full 16-bit reports, no smoothing |
| 45 | `gld_position` | glide | 1/10 | 10 | [045_gld_position.jpg](045_gld_position.jpg) | v18 = v19 | Sensor position: the centre wins |
| 46 | `gld_soft` | glide | 7/10 | 10 | [046_gld_soft.jpg](046_gld_soft.jpg) | v18 = v19 | Set in the mouse: lift-off, position, X and Y |
| 47 | `gld_sheet` | glide | 4/10 | 10 | [047_gld_sheet.jpg](047_gld_sheet.jpg) | v18 = v19 | Three details under the mouse |
| 48 | `shellcard` | shell | 7/10 | 6 | [048_shellcard.jpg](048_shellcard.jpg) | v18 = v19 | Shell and structure |
| 49 | `materials` | shell | 6/10 | 9 | [049_materials.jpg](049_materials.jpg) | v18 = v19 | Carbon-filled polypropylene |
| 50 | `shlSpecific` | shell | 4/10 | 9.5 | [050_shlSpecific.jpg](050_shlSpecific.jpg) | v18 = v19 | Specific strength and specific stiffness |
| 51 | `thinwall` | shell | 3/10 | 10 | [051_thinwall.jpg](051_thinwall.jpg) | v18 = v19 | Minimum wall thickness |
| 52 | `shlScatter` | shell | 7/10 | 9.4 | [052_shlScatter.jpg](052_shlScatter.jpg) | v18 = v19 | Wall tolerance, cubed |
| 53 | `shlPick` | shell | 7/10 | 10 | [053_shlPick.jpg](053_shlPick.jpg) | v18 = v19 | The strength–weight fallacy |
| 54 | `shlNoPick` | shell | 3/10 | 10 | [054_shlNoPick.jpg](054_shlNoPick.jpg) | v18 = v19 | What if you didn't have to pick |
| 55 | `shlHotspot` | shell | 8/10 | 10 | [055_shlHotspot.jpg](055_shlHotspot.jpg) | v18 = v19 | Stress hotspots |
| 56 | `shlMargin` | shell | 2/10 | 9.6 | [056_shlMargin.jpg](056_shlMargin.jpg) | v18 = v19 | Peak stress decides the break |
| 57 | `shlWork` | shell | 8/10 | 10 | [057_shlWork.jpg](057_shlWork.jpg) | v18 = v19 | Putting that weight to work |
| 58 | `shlShell3d` | shell | 2/10 | 10 | [058_shlShell3d.jpg](058_shlShell3d.jpg) | v18 = v19 | The triangle lattice, same weight |
| 59 | `lattice` | shell | 7/10 | 10 | [059_lattice.jpg](059_lattice.jpg) | v18 = v19 | Triangle vs hexagon lattices |
| 60 | `shlDeterminate` | shell | 5/10 | 10 | [060_shlDeterminate.jpg](060_shlDeterminate.jpg) | v18 = v19 | Statically determinate triangles |
| 61 | `shlThin` | shell | 7/10 | 11 | [061_shlThin.jpg](061_shlThin.jpg) | v18 = v19 | Triangles on a light mouse |
| 62 | `shlLattice3d` | shell | 1/10 | 10 | [062_shlLattice3d.jpg](062_shlLattice3d.jpg) | v18 = v19 | Triangles vs hexagons in the 3D shell |
| 63 | `shbArches` | shell | 7/10 | 11 | [063_shbArches.jpg](063_shbArches.jpg) | v18 = v19 | Interwoven arches form triangles |
| 64 | `shbPress` | shell | 3/10 | 10 | [064_shbPress.jpg](064_shbPress.jpg) | v18 = v19 | Arch action vs a flat plate |
| 65 | `shbThrust` | shell | 3/10 | 10.6 | [065_shbThrust.jpg](065_shbThrust.jpg) | v18 = v19 | The thrust line |
| 66 | `shbBend` | shell | 3/10 | 10.2 | [066_shbBend.jpg](066_shbBend.jpg) | v18 = v19 | Arch thrust cancels bending |
| 67 | `shbFibres` | shell | 3/10 | 10.4 | [067_shbFibres.jpg](067_shbFibres.jpg) | v18 = v19 | Fibre alignment |
| 68 | `fillet` | shell | 4/10 | 9.5 | [068_fillet.jpg](068_fillet.jpg) | v18 = v19 | Fillets at every node |
| 69 | `filletsize` | shell | 10/10 | 10 | [069_filletsize.jpg](069_filletsize.jpg) | v18 = v19 | Fillet size, solved at equal mass |
| 71 | `shbGates` | shell | 1/10 | 10 | [071_shbGates.jpg](071_shbGates.jpg) | v18 = v19 | Gating: one gate, under the crown |
| 72 | `shbWidth` | shell | 3/10 | 9.4 | [072_shbWidth.jpg](072_shbWidth.jpg) | v18 = v19 | One rib width, a fillet at every node |
| 73 | `shbMill` | shell | 2/10 | 10.4 | [073_shbMill.jpg](073_shbMill.jpg) | v18 = v19 | Fillets make the mold easier to cut |
| 74 | `shbMillDirect` | shell | 2/10 | 9.6 | [074_shbMillDirect.jpg](074_shbMillDirect.jpg) | v18 = v19 | A milled core: no knife edges of steel |
| 75 | `shbTol` | shell | 3/10 | 10.4 | [075_shbTol.jpg](075_shbTol.jpg) | v18 = v19 | A fillet loosens the tightest tolerance |
| 76 | `shbSides` | shell | 4/10 | 10.4 | [076_shbSides.jpg](076_shbSides.jpg) | v18 = v19 | Flat low sides need a thicker lattice |
| 77 | `shlPcbRib` | shell | 6/10 | 9.5 | [077_shlPcbRib.jpg](077_shlPcbRib.jpg) | v18 = v19 | FR4 vs magnesium alloy |
| 78 | `shcCarry` | shell | 5/10 | 9.5 | [078_shcCarry.jpg](078_shcCarry.jpg) | v18 = v19 | Use the weight you already carry |
| 79 | `shcArms` | shell | 6/10 | 10 | [079_shcArms.jpg](079_shcArms.jpg) | v18 = v19 | Small FR4 arms vs the whole board |
| 80 | `shlStructs` | shell | 3/10 | 10 | [080_shlStructs.jpg](080_shlStructs.jpg) | v18 = v19 | A published deflection test |
| 81 | `tolerance` | shell | 7/10 | 10 | [081_tolerance.jpg](081_tolerance.jpg) | v19 (likely); the other differs only in a small detail (196 px) | Tolerance stack-up |
| 82 | `sealed` | shell | 1/10 | 9.5 | [082_sealed.jpg](082_sealed.jpg) | v18 = v19 | The encoder: the number one failure point |
| 83 | `shlGrams` | shell | 1/10 | 10 | [083_shlGrams.jpg](083_shlGrams.jpg) | v18 = v19 | The lattice frees weight for the battery |
| 84 | `mass` | shell | 5/10 | 9.5 | [084_mass_v19.jpg](084_mass_v19.jpg), [084_mass_v18.jpg](084_mass_v18.jpg) | v19 (likely); v18 and v19 differ (5558 px), both kept | Keep the mass low, near the fingers |
| 85 | `grind` | shell | 7/10 | 9 | [085_grind.jpg](085_grind.jpg) | v18 = v19 | Poron pads, not grease |
| 86 | `shlsheet1` | shell | 4/10 | 10 | [086_shlsheet1.jpg](086_shlsheet1.jpg) | v18 = v19 | PPS triggers, film sticker, closed wheel well |
| 87 | `shlsheet2` | shell | 5/10 | 10 | [087_shlsheet2.jpg](087_shlsheet2.jpg) | v18 = v19 | Optional base, graded walls, joined struts |
| 88 | `pltPlate` | shell | 3/10 | 10 | [088_pltPlate.jpg](088_pltPlate.jpg) | v18 = v19 | Bottom plate: solid outside, triangles inside |
| 89 | `pltSim` | shell | 3/10 | 10 | [089_pltSim.jpg](089_pltSim.jpg) | v18 = v19 | Bottom plate stiffness at the same weight |
| 90 | `pltOptions` | shell | 2/10 | 9 | [090_pltOptions.jpg](090_pltOptions.jpg) | v18 = v19 | Bottom plate options at the same weight |
| 91 | `surfacecard` | surface | 4/10 | 5 | [091_surfacecard_v19.jpg](091_surfacecard_v19.jpg), [091_surfacecard_v18.jpg](091_surfacecard_v18.jpg) | v19 (likely); v18 and v19 differ (5597 px), both kept | Surface and details |
| 92 | `coating` | surface | 5/10 | 10 | [092_coating.jpg](092_coating.jpg) | v18 = v19 | Baked ceramic coating |
| 93 | `srf_texture` | surface | 6/10 | 10 | [093_srf_texture.jpg](093_srf_texture.jpg) | v18 = v19 | Ceramic film over carbon fibre |
| 94 | `srf_weight` | surface | 4/10 | 10 | [094_srf_weight.jpg](094_srf_weight.jpg) | v18 = v19 | Film thin: no added weight |
| 95 | `srf_uv` | surface | 7/10 | 10 | [095_srf_uv.jpg](095_srf_uv.jpg) | v18 = v19 | UV and chemical resistance |
| 96 | `grip` | surface | 8/10 | 11.5 | [096_grip.jpg](096_grip.jpg) | v18 = v19 | Directional grip |
| 97 | `srf_gripmap` | surface | 5/10 | 10 | [097_srf_gripmap.jpg](097_srf_gripmap.jpg) | v18 = v19 | A grip map for the hand |
| 98 | `srf_tape` | surface | 8/10 | 10 | [098_srf_tape.jpg](098_srf_tape.jpg) | v18 = v19 | Solid state: no adhesive |
| 99 | `srf_twotone` | surface | 6/10 | 10 | [099_srf_twotone.jpg](099_srf_twotone.jpg) | v18 = v19 | Two-tone in one coat |
| 100 | `srf_marks` | surface | 1/10 | 10 | [100_srf_marks.jpg](100_srf_marks.jpg) | v19 (likely); the other differs only in a small detail (1831 px) | Laser-marked details |
| 101 | `details` | surface | 3/10 | 10 | [101_details.jpg](101_details.jpg) | v18 = v19 | Engrave half as deep |
| 102 | `wheel` | surface | 5/10 | 10 | [102_wheel_v19.jpg](102_wheel_v19.jpg), [102_wheel_v18.jpg](102_wheel_v18.jpg) | v19 (likely); v18 and v19 differ (302206 px), both kept | Six-arm magnesium wheel |
| 103 | `srf_encoder` | surface | 2/10 | 10 | [103_srf_encoder.jpg](103_srf_encoder.jpg) | v18 = v19 | Optical encoder |
| 104 | `eleccard` | elec | 7/10 | 5 | [104_eleccard_v19.jpg](104_eleccard_v19.jpg), [104_eleccard_v18.jpg](104_eleccard_v18.jpg) | v19 (likely); v18 and v19 differ (9082 px), both kept | Electronics |
| 116 | `cells` | elec | 4/10 | 10 | [116_cells.jpg](116_cells.jpg) | v18 = v19 | The pouch battery, per gram |
| 118 | `elc_oneside` | elec | 7/10 | 10 | [118_elc_oneside_v19.jpg](118_elc_oneside_v19.jpg), [118_elc_oneside_v18.jpg](118_elc_oneside_v18.jpg) | v19 (likely); v18 and v19 differ (10391 px), both kept | One board, one side, one reflow |
| 119 | `elecsheet1` | elec | 7/10 | 10 | [119_elecsheet1.jpg](119_elecsheet1.jpg) | v18 = v19 | Conformal coat, readable switch |
| 120 | `elc_tear` | elec | 8/10 | 12 | [120_elc_tear.jpg](120_elc_tear.jpg) | v18 = v19 | Braided wires, not ribbon cables |
| 123 | `elc_flex` | elec | 7/10 | 12 | [123_elc_flex.jpg](123_elc_flex.jpg) | v18 = v19 | Flex life: fine strands, no crease |
| 124 | `cable` | elec | 3/10 | 9 | [124_cable.jpg](124_cable.jpg) | v18 = v19 | Angled plug, paracord cable |
| 125 | `software` | elec | 6/10 | 10 | [125_software.jpg](125_software.jpg) | v18 = v19 | Web software, nothing to install |
| 126 | `elc_sheet2` | elec | 2/10 | 10 | [126_elc_sheet2.jpg](126_elc_sheet2.jpg) | v18 = v19 | No RGB LED, optional haptics |
| 133 | `repair` | own | 8/10 | 10 | [133_repair.jpg](133_repair.jpg) | v18 = v19 | Repairability: made to be opened |
| 134 | `ownscrew` | own | 7/10 | 9 | [134_ownscrew.jpg](134_ownscrew.jpg) | v18 = v19 | M2 combination drive screws |
| 140 | `serial` | own | 1/10 | 10 | [140_serial.jpg](140_serial.jpg) | v18 = v19 | A serial on the right click |
| 141 | `ownsheet1` | own | 2/10 | 10 | [141_ownsheet1.jpg](141_ownsheet1.jpg) | v18 = v19 | Wire leads, twisted pairs, skate files |
