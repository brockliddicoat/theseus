# Research gaps snapshot 08:39 (live lists are each builder's PROGRESS.md "## Research gaps")

## b01
1. Razer Viper Mini Signature Edition: US price (using $279.99, Razer's 2022 launch price, from memory, flagged in SRC.b01MiniSe),
   battery hours, L x W x H. Query: "Razer Viper Mini Signature Edition price $ battery life hours dimensions mm"; URLs: Razer's
   2022 press release, rtings.com/mouse/reviews/razer/viper-mini-signature-edition (full data), techpowerup.com review (robots).
   Feeds b01_price.
2. Logitech Pro X3 Superstrike: a scale weight (RTINGS or TechPowerUp), battery capacity (mAh), and the dims conflict (EloShapes
   X2 Superstrike 125.0 x 63.5 x 40.0 vs ProSettings 118 x 62 x 39). Query: "Logitech G Pro X3 Superstrike RTINGS default weight",
   "Pro X3 Superstrike teardown battery mAh". Feeds b01_compromise, b01_battery, b01_price.
3. Pulsar X2F CrazyLight: an independent scale weight (Brock: reports say at least 29.5 g; Pulsar lists 29 g +/- 2). Query:
   "Pulsar X2F CrazyLight weighed grams review scale" (RTINGS when published, YouTube/Reddit reviewers). Feeds b01_compromise,
   b01_density, b01_illusion, b01_rank, b01_price.
4. EloShapes: the G-Wolves wireless line's weights and L x W x H as EloShapes lists them (used G-Wolves's own pages), and
   EloShapes top outlines of the X2F (used a trace of Pulsar's X2H base photo). URL: https://www.eloshapes.com/mouse/compare?p=
   g-wolves-hts-plus-pro-8k (data loads client-side; this session could not read it). Feeds b01_rank, b01_density, b01_illusion.
5. G-Wolves HTS Plus Pro 8K: an independent scale weight (it tops the density ranking at its maker's ~28 g: 0.098 vs Theseus
   0.099). Query: "G-Wolves HTS Plus Pro 8K review weight grams". Feeds b01_rank.
6. Ninjutso Sora V2 / V3: maker-listed hours at 1 khz and battery mAh (a retailer lists 80 or 90 h). Query: "Ninjutso Sora V2 8K
   battery life hours 1000 Hz mAh". Feeds b01_battery.
7. Zaunkoenig M2K: price, weight, dims (zaunkoenig.co/m2k failed to load). Query: "Zaunkoenig M2K price weight grams dimensions".
   Feeds b01_price.
8. Flick kinematics for b01_lighter's worked example (uses 0.5 m/s and a click's force as an illustration). Query: "gaming mouse
   flick peak velocity deceleration study FPS aiming kinematics". Feeds b01_lighter.
9. Size-weight illusion magnitude at a 1.76x volume ratio (to put a number on "feels lighter"). Query: "size-weight illusion
   magnitude volume ratio heaviness rating Buckingham 2014". Feeds b01_illusion.
10. Press to PC for a mechanical switch on Finalmouse's rig (to set Theseus's target honestly against the SLX's TMR 2.0 ms).
   Query: "end-to-end click latency finger press mechanical switch pre-travel ms". Feeds b01_targets.
11. Finalmouse Starlight X hours: Finalmouse publishes none (Back2Gaming). Not fillable by search; derived from its 250 mAh.

## b02
Each with the query or URL the next run needs and the slide it feeds. Stand-ins in use are marked on the slides.
1. Fingertip width (b02_seams pad size, b02_grooves contact model). Stand-in: the kit's FINGER.top 16 mm ("a fingertip,
   about 16 mm"). Query: "MIT Touch Lab average index fingertip width 16-20 mm Dandekar Raju Srinivasan 2003".
2. A review calling the Finalmouse Starlight X's clicks stiff or heavy (b02_tensioner, "As seen in Starlight X"). Stand-in:
   Brock's own observation (his F27 note), no tag. Query: "Finalmouse Starlight X review click stiffness heavy main buttons".
3. Why Razer straightened the rear cutout from the Viper V2 Pro to the V3 Pro (b02_cutouts caption 3). Stand-in: stated as
   the design change only (Brock's doc says "likely ... after complaints"). Query: "Viper V2 Pro click feel complaints rear
   button cutout Viper V3 Pro straight".
4. Ceiling-facing vs sideways trigger cutouts, the Peripheral Awards vote "3× more popular", ARYE FCC-1 → RCC-1
   (b02_flush). Stand-in: Brock's doc (clk_brock). Query: "Peripheral Awards 2024 trigger cutouts poll ceiling facing side
   facing" and "ARYE RCC-1 trigger cutouts FCC-1".
5. Tactile threshold for a step under a sliding fingertip (b02_flush human scale). Candidate from memory, unverified:
   Skedung et al. 2013, Scientific Reports 3: 2617 ("Feeling small": wrinkles ~13 nm told apart). URL to check:
   https://www.nature.com/articles/srep02617. Until checked, not on a slide.
6. Logitech G Pro X Superlight 2 post-travel ("gpx-level post travel", b02_stiff). TechPowerUp blocked by robots for fetch.
   URL: https://www.techpowerup.com/review/logitech-g-pro-x-superlight-2/4.html. Stand-in: the ULX's "high post-travel"
   (tpuUlx, already in the deck) and Brock's own words.

## b03
- b03_timing: a sourced crosshair angular speed at the moment a flick shot is clicked (the shot inset uses a labelled
  example, 300 °/s). Query: "flick shot angular velocity at click FPS aim study deg/s" (NVIDIA esports aim papers,
  e.g. arXiv 2203.12050 "Mouse Sensitivity Effects in First-Person Targeting Tasks" may report it: WebFetch it).
- b03_side: a teaching source for the door / torque demonstration (OpenStax University Physics, Torque, the door pushed
  near its hinges). Query: "OpenStax torque door hinge example". Until then demoPanel's src reads "Torque = F × d".
- b03_side: a 2-pin low-profile side switch's operating force (TTC, Kailh or Omron D2LS datasheet) to replace the
  assumption that the hinged button's switch is the same 55 gf as the rail's. Query: "TTC 2-pin side switch operating force
  datasheet" / "Omron D2LS-21 operating force".
- b03_spdt: a teaching source for the knife switch in school labs (optional). Query: "SPDT knife switch school physics lab".
- b03_binning: (a) any public example of a mouse maker claiming "binned" or "tested" switches without published spreads
  (the slide says "claims you can't check", naming no one). Query: "binned switches" mouse; (b) RTINGS' measured click
  forces per mouse (their pages render client-side; WebFetch returned no body): https://www.rtings.com/mouse/learn/research/tactile-force
- b03_switch: the publish date of Logitech's LIGHTFORCE hybrid/optical-only support article (URL in SRC b03_logiHybrid);
  Razer staff's "almost half" (no public source; on screen as a claim via Brock, F31.1).

## b04
1. Soft cloth pad sink under load (b04_sag, b04_skates). Query: "mousepad foam compression mm under load soft XSoft
   measurement" / "dot skates sink soft mousepad measured". Stand-in: the Pasternak model calibrated on Brock's own report
   (#10: one dot a corner lets the cloth reach the base on soft pads), taken at a firm 10 N; marked Derived.
2. Downward hand force on a gaming mouse (b04_sag, b04_skates, M5). Query: "downward force gaming mouse aiming newtons
   study force sensing". Stand-in: the hand's own weight, 0.6 % of body mass (Dempster) = 4.7 N for 80 kg; Johnson 2000
   gives grip and click forces only.
3. Viper V4 Pro stock skate thickness and weight (b04_sag). Query: "Razer Viper V4 Pro stock skates thickness mm weight
   grams". Stand-in: area measured off Brock's photo (1,980 mm² of pads + a 109 mm² ring) × the same 0.65 mm stack in
   PTFE = 1.9 to 2.0 g, Derived; corroborated by the X2 CrazyLight (Pulsar: 41 g PTFE pads vs 39 g dots).
4. iPhone macro minimum focus, 2 cm (b04_camera phone analogy). URL (fetch refused):
   https://www.apple.com/newsroom/2022/01/share-your-best-iphone-macro-photos-for-apples-shot-on-iphone-challenge/
   Stand-in: the analogy without a figure.
5. TechPowerUp Viper V4 Pro review, pages 2, 5, 7, 8 (b04_reports: 12-bit wireless counts, smoothing after lift-off).
   URL (site refuses fetches): https://www.techpowerup.com/review/razer-viper-v4-pro/ . Stand-in: the record in
   research/validation-report-2026-11-03.md.
6. PAW3950 / 3955 / 3970 frame rate in motion (b04_reports: smoothing lag in ms). Query: "PAW3950 frame rate fps corded
   gaming mode" / "PixArt PAW3950 frames per second". Stand-in: XBAB's bound (high-performance framerates under 8,000 Hz),
   so 16 frames is at least 2 ms and the lag at least about 1 ms.
7. ADNS-3080 Fig. 11 values, resolution vs Z (b04_focus). URL (TLS fails here):
   https://people.ece.cornell.edu/land/courses/ece4760/FinalProjects/s2009/ncr6_wjw27/ncr6_wjw27/docs/adns_3080.pdf
   Stand-in: the figure's existence (dtsheet text) plus the thin-lens slope, about 4 % per 0.1 mm, Derived.
8. PAW3970 public facts and Razer's exclusivity term (b04_sensor). Query: "PixArt PAW3970" / "Razer Focus Pro 50K
   exclusive PixArt how long". Stand-in: Brock (F21.6) and the validation report's pattern (Focus+ → PAW3395, Focus Pro
   30K → PAW3950), worded as "suspected" and "the plan".
9. PAW3395 on glass pads (b04_sensor). Query: "PAW3395 glass mousepad tracking issues". Stand-in: Brock's doc #76 ("can
   struggle on certain glass pads"); Razer's "tracks flawlessly on glass" for the Focus Pro 50K Gen-3.


## b05
- b05_material scale note: "about a phone's weight" for 2 N is common knowledge, unsourced. URL to cite: Apple's iPhone 16 Pro
  tech specs page (199 g). Query: "iPhone 16 Pro weight 199 g tech specs".
- b05_material rival line "ABS, what most mice are made of": framed as Brock's baseline (his doc #5 and F2.01) with Finalmouse's
  own benchmark against ABS (b05Fm, fetched). A survey source would be better. Query: "gaming mouse shell material ABS
  polycarbonate list of mice materials".
- Human scale for a palm resting on a mouse (hand mass about 0.6 % of body mass): not used on any slide yet; would let a
  slide say "a resting palm, about 4 N". Query: "hand segment mass percent of body mass Winter Biomechanics Dempster 0.006".
- Gaming grip forces (peak squeeze in FPS play), to replace the office figures (Johnson 2000: 0.43 N mean, about 72 N max
  derived): query "gaming mouse grip force newtons FPS esports measured".
- b05_hotspot real-world "milled-out is stronger" example: NASA's isogrid (CR-124075, McDonnell Douglas 1973; panels
  machined from thick plate) is not cited because it could not be fetched. Query: "NASA CR-124075 isogrid design handbook
  pdf". The slide rests on Brock's own reasoning (his doc, no tag) and the 2D model (Derived).


## b06
- b06_arch: a whole hen egg's breaking force squeezed end to end (N), to put a number on the egg demo. Query: "hen egg static
  compression breaking force N loaded along long axis poultry science". (Liu, Jiang, Wang arXiv 2211.00190's 49 N is for
  half-shell specimens, so not used.) Stand-in: the qualitative IOP Spark and Science World demonstrations, no number.
- b06_lattice: the year of PBS Building Big's "Straw Shapes" activity (printed as "PBS Building Big", no year). Query: "PBS
  Building Big Straw Shapes WGBH year" or https://www.pbs.org/wgbh/buildingbig/ (about page).
- b06_fillet: the Comet 1's real window size and corner radius (the FE uses an illustrative squarish 100 × 110 mm window
  with r 6 mm, labelled illustrative). Query: "de Havilland Comet 1 cabin window dimensions corner radius inches".
- Chapter-wide: a measured squeeze or press force on a gaming mouse in play (the deck uses 10 N, "a firm press, about a
  1 kg bag of sugar", as b07 does; Johnson 2000 measured office use only: grip 0.43 N, click 0.35 N). Query: "gaming
  mouse grip force measured newtons esports study".

## b07
Each: what is missing, the stand-in used, the query or URL that fills it, the slide it feeds.
1. A sourced grip-squeeze force on a mouse (N). Stand-in: 10 N each side, said as "a 1 kg bag of sugar's weight", not
   claimed typical. Query: "computer mouse grip force newtons study" / "gaming mouse squeeze force measured". Feeds
   b07_board, b07_arms, b07_sides (human scale, M5).
2. A public source for players fitting Poron/foam where a G-Wolves board meets the shell to stop creaking. Stand-in: Brock's
   own note (no tag, F9.5) plus the keyboard world's Poron PCB gaskets and Rogers' gap-filling page. Query: "g-wolves creak
   foam pcb mod" / "hati creaking fix foam tape". Feeds b07_poron.
3. FR4 tensile strength check: the Gund PDF fetch was refused. Stand-in: the deck's vetted `shlFr4` (Gund 430 MPa LW) and
   Wikipedia FR-4 (flexural > 415 MPa LW). URL: https://thegundcompany.com/wp-content/uploads/2024/03/NEMA-FR4-Glass-Epoxy-Laminate-by-The-Gund-Co.pdf
   Feeds b07_board (pull test 1.8×).
4. Why some people push for a higher battery: no authoritative source found (retailer blogs only; periview.gg and
   Notebookcheck on the Zeromouse's rear battery). Stand-in: the physics stated plainly (twist = m·a·(CoM height − grip
   height): a higher grip argues for a higher battery), attributed to no one. Query: "mouse battery placement higher center
   of gravity argument reddit MouseReview" / "Optimum zeromouse battery moment arm explanation". Feeds b07_balance.
5. G-Wolves "HTS Ultra": model name as Brock wrote it (F6.3), unverified. Query: "G-Wolves HTS Ultra". Feeds b07_arms.
6. Coin thickness tolerance (US Mint publishes nominal only). Stand-in: the coin demo uses relative error ("coins drawn
   thick"), mm only for mouse parts (Protolabs ±0.076). Query: "US Mint coin thickness tolerance" / "Royal Mint coin
   thickness tolerance specification". Feeds b07_tolerance.
7. Shipping-drop accelerations (ISTA 1A drop heights, peak g in a box). Stand-in: no drop load claimed; the tab's snap is
   given as tip movement (0.36 mm, fixed-guided beam, derived). Query: "ISTA 1A drop test height peak acceleration small
   package g". Feeds b07_arms.
8. A size rule (mouse length vs hand length by grip). Stand-in: none claimed; hands drawn to scale from ANSUR II. Query:
   "mouse length hand length ratio grip study". Feeds b07_size.

## b08
1. b08_wheel, the test group Brock asked for: measured weights of stock plastic scroll wheels with rubber tyres (wheel
   alone, no axle). Queries: "stock scroll wheel weight grams rubber" ; "Logitech G Pro X Superlight scroll wheel weight
   grams" ; "Razer Viper V2 Pro scroll wheel weight" ; "Pulsar X2 scroll wheel weight grams" ; "Ninjutso Sora scroll wheel
   weight" ; "aftermarket aluminium scroll wheel weight stock wheel comparison" ; r/MouseReview "weighed my scroll wheel".
   Need n ≥ 4 wheels, each with its source. Until then the slide shows the test group as a labelled placeholder.
2. b08_uv, a real-world/classroom yellowing example with a source: "Retrobright ABS yellowing bromine flame retardant"
   (Wikipedia "Retr0bright"), or "newspaper yellows in sunlight lignin classroom experiment". Optional; the slide stands
   without it.
3. b08_uv, a measured colour shift for an unprotected white coating or ABS after QUV exposure (ΔE or ΔYI at 500 to 1,000 h):
   "ABS QUV 1000 hours yellowness index" ; "white polyurethane coating QUV-A 1000 h delta E". Today the rival panel is
   drawn from ULX Pro owners' reports, no rate implied.
4. b08_film, the soft-touch film actually used on mice (the slide uses RadTech 2016's 2 mil test film): "soft touch coating
   thickness microns consumer electronics mouse".
5. b08_film, blast removal on polypropylene: "abrasive blast material removal depth polypropylene 220 grit 30 psi micron"
   or Cerakote's plastics blasting guidance. Brock's "almost as much as it adds" stays his claim, unnumbered (F21.10).
6. b08_twotone, owner reports of painted two-tone wear on mice: "Finalmouse Prophecy paint chipping" / "ULX Prophecy paint
   wear". The slide shows the mechanism (layers on top can chip), not a claim about Prophecy units.

## b09
- b09_radio: a published number for how much nearby metal costs a 2.4 GHz PCB antenna vs distance (efficiency / dB at
  5, 10, 20, 30 mm). Candidate: Casado et al., "2.45 GHz printed IFA on metallic environments: clearance distance and
  retuning considerations", EuCAP 2012, DOI 10.1109/EuCAP.2012.6205978 (closed access). Stand-in on the slide: distance only
  (12.4 → 28.2 mm), the mechanism from Antenova and Finalmouse, the foil demo.
- b09_radio: Raytac AN54LM-P20A preliminary datasheet / design guide (keep-out, clearance to metal). Query: "AN54LM-P20A
  datasheet keep-out" (registration-gated per Raytac's page). Stand-in: MDBT50Q spec ver. K §2.3.
- b09_life: Razer's Viper V4 Pro battery hours at 2000 and 4000 Hz (Razer support page for RZ01-0563). Stand-in: derived
  from the 180 h / 45 h claims with a fixed + per-report draw, marked Derived.
- b09_second: the Kunai tester guide's Second Shot section (private, from Brock): confirm 99 % rescued at 4 khz, ~92 % beside
  a headset base station, 0.67 % → 0.007 % lost, 15 of 220,017. Stand-in: the numbers as the old `secondshot` slide carried.


## b10
1. Stock charging-cable diameters of the flagships (Viper V3/V4 Pro, GPX2, ULX). Query: "Razer Viper V3 Pro cable diameter mm"
   / "Superlight 2 USB-C cable thickness mm" / TechPowerUp review page 2 of each. Feeds b10_cable (now: a 3 mm cable, said as
   an illustration; the lens-lift figure scales with it: 0.68 mm per mm of cable).
2. Install size and background footprint of Razer Synapse 4 and Logitech G HUB. Query: "Razer Synapse 4 system requirements
   disk space" / "Logitech G HUB disk space". Feeds b10_software (now: the apps named, no size claimed).
3. The LED current of an optical scroll-wheel encoder (Avago ADNK-3043 gives only the timing: 40 µs every 2 ms). Query:
   "optical scroll wheel encoder IR LED drive current mA" / the TTC or Razer optical encoder datasheet. Feeds b10_lights (now:
   5 mA assumed, as Omron's switch LED, said on the slide).
4. A teaching source for "a magnet acts through card; light does not". Query: "magnetic force through paper classroom
   demonstration" (e.g. a national curriculum or Science Buddies page). Feeds b10_lights' classroom panel (now uncited).
5. The school internal-resistance practical (V = E − Ir). Query: "AQA A-level physics required practical EMF internal
   resistance". Feeds b10_pmic (the voltmeter that dips under load; now uncited, drawn as part of the demonstration).
6. A USB-C mid-mount receptacle's mass and SMD pad area (e.g. GCT USB4105-GF-A datasheet). Feeds b10_board (now: 0.40 g from
   the board model's table, about 6.5 mm² of pad: an estimate, said in the source line).
7. Measured static friction of PTFE skates on a cloth pad. Query: "mouse skate static friction coefficient measured cloth".
   Would let b10_cable put a number on Brock's #20 (a bent stiff cable pushing a 29 g mouse); now not quantified.


## b11
- Thread-wear classroom source (b11_wear, b11_inserts): a teaching or extension source that a wood or particleboard screw
  re-driven into its hole holds less each time (query: "repeated screw insertion particleboard withdrawal resistance
  second insertion"; the two papers found test one insertion only). Until then the classroom panel cites no paper.
- JST SH unmating force per contact (b11_battplug human scale; query: "JST SH SHR-03V-S withdrawal force per contact
  specification"); not on Mouser's catalogue page. Until then no newton figure on the plug.
- Viper V4 Pro and G Pro X Superlight 2 disassembly (b11_repair, b11_board; TechPowerUp pages could not be read: client
  error and robots). The rival stays the G Pro Wireless (iFixit) and the Viper V3 Pro (TechPowerUp).
- Box contents re-check for 2026 flagships beyond the X3 Superstrike and the Viper V4 Pro (b11_box; URLs already in SRC:
  ownSoraBox, ownX2Box, ownTrOp1Box, ownB2gSlx).
- 08:50 b11_repair rebuilt as a three-step job sheet (open it, reach the board, free the switch): most mice (G Pro Wireless,
  iFixit) above, Theseus below (dimmed until its turn), tools kept in their cells, verdict 5 → 1. errs ok, qa clean (settle,
  mid). CHECKPOINT1.md written (frames 125_b11_repair_0.6 / 4.8 / 12).
- 08:29 b11_inserts built: establish on Theseus's front boss (side view), split into carbon-filled | brass, one pointer
  drives both in, out and in again 2° off; red second thread vs the same thread; verdict 70 % → 0 %; bars; first fit in words.
  errs ok, qa clean (settle, mid). Frame one shows the mouse and its bosses.
- 08:45 broadcast acted on: review file (none yet for b11), models table above, warm greys converted, frame one checked
  (b11_repair and b11_inserts both show their subject at t = 0).
- 08:38 b11_wear built (night): two rows read left to right (the joint in section, a loupe on its thread, a dial): plastic
  re-assembled 10 times (flank magnified, red slivers pile up, dial follows Cumbicus PF-30), the brass insert pulled 20
  times to 80 % of failure, then measured (98.6 %); verdict 82.8 → 98.6 %; bars name each test; 255 N = 26 kg; hand-off to
  the battery. errs ok, qa clean (settle, mid).
- 08:38 b11_screws built (night): establish from below on the four heads, push in to one, dip to steel | titanium: the same
  twist and two slips (cam-out arrow, burrs, dents from above sized by 220/349); Vickers panel; verdict 220 → 349 HV; four
  screws 0.75 → 0.42 g; three plain lines (slot fallback, threads strip in the brass, not magnetic). errs ok, qa clean.
- Next: b11_battplug, b11_board, b11_box, b11_card; then remove the lab slides, full checks, report.
- Was next: b11_inserts (establish on the board's front boss, split into plastic | brass, drive, back out, drive 2° off; verdict
  70 % → 0 %; bars ABS 90, CF 70, brass 0; first fit in words), then b11_wear, b11_screws, b11_battplug, b11_board, b11_box,
  b11_card.
