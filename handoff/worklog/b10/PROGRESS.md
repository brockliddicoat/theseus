# B10 progress (Electronics II: power, the board, the wires)

Brief: /home/claude/theseus/handoff/revamp2/b10-brief.md (+ common.md). File: deck/src/30-b10-power.js.
Build: cd /home/claude/theseus/deck && python3 tools/build.py main --out=b10 --own=30-b10-power.js
Checks: export NODE_PATH=/opt/npm-tools/node_modules; Q='&2d=1'; errs / qa (settle, mid) / shoot PAR=1.

## Status
- [x] Read common.md, b10-brief.md, FEEDBACK.md (all STANDING/DECIDED, F27 notes, F30-F35, F38), REVAMP.md, DESIGN.md,
      01-core.js, 04-ui.js, 03-parts.js (boardMM, encoderMM = k2_encMagFront, cableMM, chipMM, keyPlanMM), 08-v2d.js
- [x] Read the old slides: 10-f-elec.js (elc_pmic, elc_charge, elc_safe, elc_oneside, cable, software),
      10-f2-elec.js (elc_tear, elc_twist, elc_lay, elc_flex), 14-c-elec-ex.js (cells), 12-40-elec.js (elecsheet1),
      12-45-elec.js (elc_sheet2, hidden), 10-e-surface.js (srf_encoder), 10-c-glide.js (gld_soft), 10-d-shell.js (sealed, hidden)
- [x] Phase A research (web-search budget for the turn ran out at the end: the software install-size figure is unsourced, so
      the software slide names the apps without a size)
- [x] Phase A storyboard for all 10 slides (below)
- [x] Phase B started 08:03 (KIT.md out). Data, models and mm drawings in 30-b10-power.js (b10_ prefix)
- [x] b10_board DONE 08:50: errs ok; qa clean at settle (10.5) and mid (4.2); frames 0 / 2.6 / 4.2 / 7 / 10.5 and phone (0.44×)
      reviewed (work/b10/shots/board). Honesty fix on review: the Type-C no longer falls (Liu's parts held to ~60 g/in², mean
      fall-off ~99; ours ~40) → tagged "Melted again, upside down / About 40 g per in² of pad; the rule is 30"; the drop that
      falls is the classroom water drop. Frame one shows the oven and both boards (08:45 rule). True greys (08:45 rule).
- [x] CHECKPOINT1.md written (b10_board)
- [x] b10_cable DONE 09:35: errs ok; qa clean (settle 11, mid 4.4); frames 0 / 2.2 / 4.4 / 7 / 11 + phone reviewed
      (work/b10/shots/cable). Lift computed live from the shell (KEY_PARTS: lens z 16.57, skates, pivot −51.18): a 3 mm cable
      under the front skate lifts the lens 2.1 mm (> 1 mm lift-off) → the cursor freezes, MISS; Theseus's L plug: 0 mm, HIT.
- [x] 08:50 broadcast (plan 5 in the shared drawings): b10_board re-shot (frames 0 / 2.6 / 4.2 / 7 / 10.5; the slide is now
      107 in the deck); its locator uses msBox('top','board') from KEY_PARTS. 5.6 g re-checked against plan 5's outline (see
      Models and conventions checked). b10_cable reads KEY_PARTS through msLive.
- [x] b10_lights DONE 10:00: errs ok; qa clean (settle 12, mid 4.8); frames 2 / 7.5 / 12 reviewed. V4 Pro ("all in on
      optical", Razer) lights: switches 8.8 % each, wheel 5.8 % (5 mA assumed) → Theseus 0 / 0 / 0.2 % (rounded up);
      verdict 23.5 → 0.2 %, +30 % hours; dust test (optical gate vs encoderMM), counts said to be an illustration.
- [x] b10_battery DONE 10:15: errs ok; qa clean (settle 10, mid 4); frames 0 / 1.6 / 4.6 / 10 reviewed. Balance: 10440
      Li-ion (350 mAh, 9 g, akkuteile) vs LP402535JU (370 mAh, 8 g) at their real capacities (no scaling on screen); can
      2.2 g vs foil 0.4 g; verdict 144 → 171 Wh/kg (3.7 V both), +33 h at 1 khz from the same 8 g; locator on KEY_PARTS'
      battery.
- [x] b10_pmic DONE 10:35: errs ok; qa clean (settle 11, mid 4.4); frames 0 / 6.8 / 11. Session chart (true charge, voltage
      guess as the GPX2, Theseus's gauge), voltmeter V = E − I·r, PMIC on plan 5 (KEY_PARTS: 17.9 mm to the module), up to
      six parts → nPM1300; verdict reading error 20 → 3 %.
- [x] b10_charge DONE 10:50: errs ok; qa clean (settle 11, mid 4.4); frames 0 / 3 / 11. V4 Pro 0.169 A vs 1C 0.37 A from
      20 % on one clock, CC/CV curves, four guards; verdict 3.7 → 7.7 h at 8 khz (2.0×).
- [x] b10_sealed DONE 11:10: errs ok; qa clean (settle 11, mid 4.4); frames 0 / 3 / 4.6 / 11. Pads (rewritten b10_padsMM)
      under a sweat drop: bare grows a tin tree and shorts at 14 s (DTU 14–62 s), wipe to coated: beads, no current; ACS
      tin-crystal panel; coat weight re-derived from plan 5's board (19.9 cm² a face): +0.2 g at 50 µm (0.12–0.35 g).
- [x] b10_wires DONE 11:30: the old elc_tear demonstration (8/10) kept on one stage, the kit's verdict, the tear force corrected
      (copper traces ≈0.26 N each, not only the film's 0.07 N: ≈47×, not the old 200×); elc_flex's numbers kept as a box.
- [x] b10_twist DONE 11:45: the old elc_twist demonstration kept, elc_lay's trade as a chart beside it (6 mm: −36 dB for
      3 mg), verdict 100 → 2 % pickup (ideal twist, derived), Klipec measured.
- [x] b10_software DONE 12:10: push-in to the sensor lifting at the end of a swipe, the lens's path red below the lift-off
      (still tracking), the browser tab's 0.1 mm slider dragged 2.0 → 0.8, saved on the mouse; verdict drift 3.0 → 1.2 mm
      (illustration, speeds said).
- [x] Review file /home/claude/work/review/b10.md: all findings answered in place (1 must + 1 research must FIXED; shoulds
      FIXED except M-b10-2, kept TechPowerUp's measured 8 khz draw: WHY NOT given).
- [x] Final checks 12:20: errs ok on all ten; qa clean at settle on all ten (mid checked per slide while building). · b10_pmic · b10_charge · b10_sealed · b10_wires · b10_twist · b10_software
      (register each in FILM order in the file: pmic, charge, battery, board, sealed, wires, twist, cable, lights, software)
- [x] Test bench removed (09:05). NOTE: b10_pads, b10_padsSection, b10_galvo were lost before the 08:13 save (not in git
      either); rewrite them inside b10_sealed / b10_twist when those are built.
- Research fills: check /home/claude/work/research/FILLS.md before each slide that needs a number; new needs go to the
  gaps list below or /home/claude/work/research/REQUESTS.md (no WebSearch from here).
- Standing (08:45): read /home/claude/work/review/b10.md before each slide and before the report; reply FIXED / WHY NOT.

## Neighbours and seams
- before: b09_life (b09): battery life at every polling rate (hours, the frontier). My b10_pmic opens on those hours'
  battery and its reading: "200 hours mean nothing if the reading lies".
- after: b07_shcard (b07): a shape measured on hands. b10_software ends on the hand lifting the mouse in profile: the hand.
- b09's decision (integrator, 07:5x): plan 5 puts the module at the board's rear (MCU z 4.80), antenna facing forward.
- Plan 5 (handoff/plan-images/board-plan-5.jpg; x = the user's right there, z to the nose): PMIC left-middle (x -10, z 19.45),
  sensor centre z 19.45 (lens in the mouse z 16.57), power switch SW3 right (x +10, z 19.45), J3 side lead left and J2 battery
  right (x -/+14.5, z 8.50), MCU module rear centre (z 4.80), rear holes z -2.25, battery front z -4.82. PMIC centre to module
  centre about 17.7 mm. Draw the board only through the shared twin (view3D('pcb') → GEO2D.pcb) and keyPlanMM, so H1's
  rebuild reaches the slides; place callouts with v2dAt('pcb', st, box, /components\/U2/ ...), never hard-coded.

## Themes (alternate; lights must be night)
pmic paper · charge night · battery paper · board night · sealed paper · wires night · twist paper · cable paper ·
lights night · software paper. (twist/cable both paper: the one double; cable reads well on paper.)

## Numbers (scripts/nums.js, from the deck's own models and the sources)
- Charge (CC/CV model of 10-f-elec.js, rq 0.21 V/C, stop 10%): 1C: 10→80% in 42 min, full 68 min; 0.55C (V4 Pro 0.169 A /
  306 mAh): 76.5 min, 112 min. 10 min from 20%: Theseus +16.7% = 7.7 h at 8 khz (35 h at 1 khz); V4 Pro +9.2% = 3.7 h
  (17 h). Linear charger heat (5 − 3.7) V × I: 0.22 W at 0.169 A, 0.48 W at 0.37 A (the nPM1300's charger is linear too:
  the guards, not less heat, make 1C safe).
- Theseus hours: 1.369 Wh at the V4 Pro's draw: 208 h at 1 khz (THS says 200 h), 46 h at 8 khz.
- Battery: Jauch LP402535JU 370 mAh min / 380 typ, ≈8 g, 171 Wh/kg, 27.3% of 29.31 g. 10440 Li-ion: akkuteile 350 mAh, 9 g
  (140 Wh/kg); Keeppower 350 mAh, ≈10 g (126 Wh/kg). At 370 mAh: 9.5 and 10.6 g → +1.5 to +2.6 g. Why: a 10440's steel can
  ≈2.2 g (0.18 mm steel) against the pouch's foil ≈0.4 g. Same 8 g as a cylinder: 166 h against 208 h.
- Coat: 25/50/75 µm urethane, both sides (≈35.6 cm² with part sides): 0.09 / 0.19 / 0.28 g; top only 0.05 / 0.10 / 0.15 g.
- Twist (elc_reject, coil 5 mm beside a 60 mm lead): 6 mm lay −35.7 dB (1/61), copper +2.9% = 3.0 mg over both leads
  (104 mg copper); 1.5 mm lay +40.6 mg (13.6×); 12 mm −15 dB.
- Wires: one 32 AWG ≈7.0 N, two 14.1 N; ribbon nick propagates at 0.07 N → 201×. Strain d/2R at R 2.5 mm: 40 AWG strand
  1.60%, solid 32 AWG 4.04% → 2.5×.
- Lights (V4 Pro at 1 khz: 306 mAh / 180 h = 1.70 mA): two optical mains 0.30 mA = 17.6% (Omron 5 mA, 30 µs per ms; as
  Clicks' b03_switch); an optical wheel 0.10 mA = 5.9% (Avago: LED 40 µs every 2 ms; 5 mA assumed, said); together 23.5% →
  +31% life from the same battery. Magnetic TMR 2 axes × 1.5 µA = 3 µA = 0.18%. (A 0.8 mA Hall wheel would be 47%: a
  question for Brock.) RGB: G703 30 → 22 h = 27% fewer hours (Logitech).
- Reflow: 30 g/in² = 46.5 mg per mm² of pad. USB-C receptacle 0.40 g on ≈6.5 mm² of SMD pad ≈ 40 g/in² (over); nPM1300 QFN
  3 g/in²; 0402 0.8 g/in²; JST SH 4.6 g/in².

## Sources gathered (to add to SRC as b10_*)
- Kjosavik (Nordic), Electronic Design, 2024-02-07 "My application needs accurate fuel gauging": voltage lookup "errors of up
  to 20% with a large spread"; at −5 °C 10–30%; nPM1300 + algorithm "maximum deviation ≈3%"; "the battery voltage drops only
  80 mV or 2% from an 80% to 20% SOC"; sag under load: "the measured voltage will be lower than the actual voltage".
  https://www.electronicdesign.com/technologies/power/article/21282297/nordic-semiconductor-my-application-needs-accurate-fuel-gaugingwhat-options-are-available
- TechPowerUp GPX2 p8: "Logitech decided to not implement a fuel gauge IC"; readings "aren't particularly reliable or
  accurate"; "suddenly sit at 60% after turning the mouse off and on again" ("undoubtedly false"). (deck key tpuGpx2)
- TechPowerUp Viper V3 Pro p8: fuel gauge IC "very precise and consistent"; "a snail-like charge speed of around 0.150 A";
  cable "extraordinary stiffness prevents playing while charging virtually completely". (deck key tpuVv3p)
- hwbusters teardowns: Epomaker Carbon X (CL4056E linear charger; USB-C, power and DPI switches and lens on the underside;
  side-button daughterboard), Epomaker Carbonis (YX4068T linear charger; two flat ribbon cables), Cougar Revenger Pro 4K
  (underside: Type-C, power and DPI switches, lens; side-button daughterboard on a "flat ribbon cable").
- nPM1300 page: 32–800 mA, JEITA, battery NTC, 22 V OVP, 2 bucks 200 mA "up to 93%", 2 LDO/load switches, fuel gauge
  (SoC, SoH, cycles), watchdog, ship 370 nA, hibernate 500 nA, QFN 5×5 / WLCSP 3.1×2.4. (deck key elcNpm)
- Validation report: nPM1300 "replaces 4–6 support ICs with one, and adds JEITA, a gauge and a watchdog" (vs discrete
  charger + LDO + gauge + sense resistor + reset IC + watchdog); single-sided wording; Nordic gauge 8 µA vs up to 50 µA.
- Jauch LP402535JU datasheet (elcLp4025): ≈8 g; 380 typ / 370 min; 4.2 V; std 0.2C, max 1.0C charge; charge +10..+45 °C;
  300 cycles to 80%; PCM overcharge 4.28 V, over-discharge 3.00 V, over-current 1.0–4.0 A.
- Battery University BU-410: no charge below freezing (lithium plating, permanent); fast charge 5–45 °C; heat can swell a
  pouch. BU-409: 0.5–1C; higher current fills to ≈70% quickly; saturation is slow.
- TechPowerUp charge currents: ULX 0.131 A, V4 Pro 0.169 A, V3 Pro 0.150 A, X2H 0.27–0.28 A (deck keys).
- akkuteile 10440 (9 g ± 1, 350/300 mAh) (deck key elc10440); Keeppower 10440 (≈10 g, 350/340 mAh)
  https://keeppower.com.cn/products_detail.php?id=711
- Brock's G-Wolves photo: YJ601530 3.7 V 250 mAh 0.925 Wh (a mouse-sized Li-po).
- Liu, Geiger, Shangguan, "Component Candidacy of Second Side Reflow with Lead-Free Solder", Materials Transactions 47(6)
  2006: weight ÷ pad area ≤ 30 g/in² stays on; lead-free parts ≤ 60 g/in² held; mean fall-off ≈99 g/in²; breaks in the
  molten solder. https://www.jstage.jst.go.jp/article/matertrans/47/6/47_6_1577/_article/-char/en
- Wirth, Rendl, Steiner (Pilsen): IMC grows with reflows but shear force "did not vary greatly": so NO claim that re-melted
  joints are weaker. ALLPCB (dsReflow): second pass can drop first-side parts; under ≈5 g less likely; < 1.6 mm boards sag.
- NITK virtual lab, drop-weight method: "At equilibrium: 2πrγ = mg". https://ph1-nitk.vlabs.ac.in/exp/surface-tension/theory.html
- Verdingovas, Jellesen, Ambat (DTU), EUROCORR 2012: NaCl droplet across an 0805 part at 5 V: time to first failure
  "62s, 25s, 19s and 14s" as NaCl rises. https://backend.orbit.dtu.dk/ws/files/52391164/1350.pdf
- Bumiller & Hillman (DfR): "water drop tests can demonstrate dendritic growth in seconds"; chloride the most harmful.
  https://dev.smtnet.com/library/files/upload/Time-to-Failure_Metallic_Migration.pdf
- Medgyes, Illés, Harsányi 2013 (Periodica Polytechnica): NaCl "simulates ... human perspiration"; ions from the anode
  deposit at the cathode (needle, tree-like). https://pp.bme.hu/eecs/article/download/2068/6180
- Sweat Na+/Cl− 10–90 mmol/L (Barnes 2019, in Baker, Engel & Wolfe, GSSI SSE #226, 2022).
  https://www.gssiweb.org/sports-science-exchange/article/sweat-biomarkers-for-sports-science-applications
- HumiSeal (Chase Corp): acrylic/urethane 25–75 µm, parylene 12.5–50 µm (the IPC-CC-830 test thicknesses).
  https://blog.chasecorp.com/humiseal/the-importance-of-conformal-coating-thickness
- HyperX Pulsefire Haste Wireless: hex shell, "IP55 rated to withstand sweat and minor aquatic accidents".
  https://row.hyperx.com/collections/riot/products/hyperx-pulsefire-haste-wireless
- ACS "Tin Crystals" outreach activity (2023): SnCl2, a 9 V battery, two paper clips; tin grows at the cathode.
  https://www.acs.org/content/dam/acsorg/education/outreach/activities/activity-guides/growing-tin-crystals-san-diego-state.pdf
- Bates & Dean, "A total rip-off: crack propagation in paper", Physics Education 59 035010 (2024): 25 mm strips, uncut ≈95 N
  (students pull 25–35 N); "All students easily broke the paper with a 5 mm cut".
  https://eprints.whiterose.ac.uk/210831/1/Bates_2024_Phys._Educ._59_035010.pdf
- Stoebe (U. Washington), "Paper Clip Experiment: Properties and Failure" (Edmonds CC 2007): a 180° bend breaks the clip in
  "less than half the number of bends". https://ate.community/downloads/46608/Paper_Clip_Experiment.pdf
- Harvard Natural Sciences Lecture Demonstrations, "Faraday's Law": coil, galvanometer, magnet; current when flux changes.
  https://sciencedemonstrations.fas.harvard.edu/presentations/faradays-law ; UCSB 72.03 (needle direction flips).
- ASTM D1388 (Geocomp summary): a strip slid over a ledge until its tip droops to 41.5°; the overhang gives bending length
  and flexural rigidity. https://www.geocomp.com/tests/standard-test-method-for-stiffness-of-fabrics/
- Pulsar USB-C Paracord Cable: "Head Bent", L-shaped, "prevents cable drag against the desk". https://www.pulsar.gg/products/usb-c-cable
- MDT TMR1228D (2026-07-13): always-on, "as little as 1.5 µA per axis", DC–1 kHz, "ideal for quadrature encoder systems".
  https://en.prnasia.com/releases/apac/mdt-introduces-tmr1228d-always-on-high-sensitivity-dual-axis-magnetic-switch-ic-with-microamp-level-power-consumption-540448.shtml
- MDT TMR gaming (TechPowerUp 2024): "less than 0.3mA ... Hall-effect sensors that consume 5-10 times more" (srf_mdtTmr).
- Deck keys reused: logiRgb, pulsarEnc, srf_fmSupport, srf_mpsMag, srf_razerAllOptical, srf_avagoWheel, srf_kailhEnc,
  clk_razerV4bat, webhid, gld_paw3395, gld_razerFocus, elcKapton, elcShengyi, elcAlexander, elcKlipec, elcNasaTem, elcAwg,
  elcCu, elcXa25, tpuCables, elcLp4025, elcNpm, elcNpmJeita, elcNpmChg, elcGauge, elcBu802, dsReflow, elcCoat, elcBrock.
- WLMOUSE Huan M already does 0.7–1.7 mm lift-off in 0.1 mm steps (step_further.json): sell what fine steps DO, not uniqueness.

## Storyboards

### 1. b10_pmic "One chip runs the power" (paper, settle 11)
Problem (best: the reading that lies, then the mouse dies mid-match): most mice guess the battery from its voltage, or add a
chip for it. GPX2: no fuel gauge IC, its reading "suddenly sat at 60% after turning the mouse off and on" (TechPowerUp).
Under load a battery's voltage sags, and from 80% to 20% the whole curve spans 80 mV (Nordic): a voltage guess errs by up to
20% (Nordic's benchmark). Rival named: Logitech GPX2 (and the Viper's separate gauge IC: one more chip).
Demonstration: one battery, one session, two readings. A big example battery with its true charge as a fill; a voltmeter
whose needle dips with every load burst (8 khz, clicks, radio: bars under the time axis) and recovers at rest: the school
internal-resistance practical in miniature (V = E − Ir). Chart: % against hours (compressed): true charge (ink, dashed),
the voltage guess (grey: jumps with bursts, jumps UP after a power cycle "60% after a restart", then a cliff), Theseus's
gauge (blue, within 3%, a "time left" readout). Then where it lives and what it replaces: a locator (key plan / board twin,
PMIC lit, plan 5's left-middle spot, ≈18 mm from the module) and the handful → one morph: six labelled power parts
(charger, two regulators, gauge + sense resistor, reset, watchdog) collapse into one 5 × 5 mm nPM1300 and its two coils.
Beats: 0 s header + both readouts on the battery at 100%; ~1 s first bursts: needle dips, the guess drops 9 points while
the fill barely moves; ~3 s power cycle: guess jumps to 60% (red tick "after a restart"); ~4.5 s the guess dies at "18%"
(red: "Dead at 18%"), the true fill at 0; ~5.5 s Theseus's line drawn, hugging the truth, "2 h 10 min left" earlier;
~7 s verdict "Reading error: up to 20% → 3%" (Nordic 2024); ~8 s six parts → one chip ("6 → 1"); settle 11.
Headline: up to 20% → 3% (reading error), with "6 → 1 power chips" second.
Classroom: the voltmeter's dip is the internal-resistance practical; drawn as part of the demo, not a separate panel.
Hand-off: ends on the gauge at 4% "plug in". Opens on the battery that b09_life's hours came from.
Old slide elc_pmic: not rated, no note. FEEDBACK: F30.1 (PMIC far from the MCU: locator shows plan 5's left-middle spot
and the distance), F30.3 (sensor and MCU flipped, PMIC in the empty left-middle spot: same locator), F0.5 (nPM1300 name),
F21.11 (board kept, no re-solve).

### 2. b10_charge "Fast charging, safely" (night, settle 11)
Problem: flagships charge slowly by design: 0.131 A ULX, 0.150 A V3 Pro ("snail-like", TechPowerUp), 0.169 A V4 Pro,
0.27–0.28 A X2H. Faster without guards ages the battery: charged below freezing it plates lithium for good; hot, a pouch
swells (Battery University). Rival named: Viper V4 Pro (0.169 A ≈ 0.55C of 306 mAh).
Fix: the battery's own 1C (Jauch rates the LP402535JU for 1.0C: 370 mA), watched by four guards.
Demonstration: two batteries plugged in at 20%, same 10-minute clock: the V4 Pro's fills at 0.55C, Theseus's at 1C
(current arrows sized by amps, the CC/CV curve drawn under each). At 10 min: +9.2% → 3.7 h vs +16.7% → 7.7 h at 8 khz.
Then the four guards act in turn, each a cause and its effect: (1) a cold battery at 5 °C: the PMIC reads its NTC and
holds, charging only once it reaches 10 °C; (2) a bad charger's 20 V spike stops at the input (22 V rated); (3) a short:
the battery's own protection opens at 1–4 A; (4) off: ship mode 370 nA, under 1% a year.
Beats: 0 s both batteries + cables; ~1 s current flows, fills rise, clock runs; ~5 s the 10-minute mark, hours count;
~7 s verdict "10 minutes of charge: 3.7 → 7.7 h at 8 khz"; ~7.5–10 s the four guards light one after another; settle 11.
Headline: 7.7 h of play from a 10-minute charge (3.7 h struck), "2× the charge rate" as label.
Classroom: Battery University's CC then CV ("fills to ≈70% quickly") shown as the curve's shape (named on the chart).
Hand-off: in from b10_pmic's "plug in"; out on the full battery (b10_battery weighs it).
Old slides elc_charge, elc_safe: not rated, no notes. F0.5 honest wording: the PMIC is not the limit, the battery is.

### 3. b10_battery "The battery, per gram" (paper, settle 10)
Problem: Li-ion in a steel can weighs more for the same charge: at 370 mAh a 10440 Li-ion battery weighs 9.5 to 10.6 g
(akkuteile, Keeppower), the Li-po pouch 8 g (Jauch). The can (≈2.2 g of steel) is dead weight; the pouch's foil ≈0.4 g.
Brock: very few makers say they use Li-po, though it costs more.
Demonstration: a balance (the classroom instrument). Left pan: a 10440 Li-ion battery; right pan: the Li-po pouch (the
shared battery twin, GEO2D.battery). Both labelled 370 mAh. Released together, the beam tips toward the Li-ion and settles
(damped spring) on +1.5 g; the second Li-ion figure (+2.6 g) ghosted. Cut-away: the can's wall lights red (≈2.2 g) vs
the foil (≈0.4 g). Payoff: at the same 8 g, hours: 166 h (Li-ion) vs 208 h (Li-po) at 1 khz.
Beats: 0 s balance level, both batteries above their pans; ~1 s set down, beam tips; ~3 s settles, "+1.5 g" on the beam;
~4.5 s cut-away: the can; ~6.5 s verdict "Battery weight at 370 mAh: 9.5 → 8.0 g"; ~8 s "same 8 g: 166 → 208 h";
settle 10. Also: 8 g is 27% of the mouse, set in the tail to balance it (F21.15).
Headline: 9.5 → 8.0 g (−1.5 g) at the same 370 mAh.
Clauses (cells 4/10): "lithium ion numbers are way off" → the Li-ion now a mouse-sized 10440 from two sellers'
datasheets, 350 mAh at 9 and ≈10 g (126–140 Wh/kg), not the 18650; "look at smaller batteries" → AAA-size Li-ion beside
the 370 mAh pouch; "a gram or two heavier ... same capacity" → on the balance at 370 mAh: +1.5 to +2.6 g, and why (the can).
F21.8: "battery" only on screen, never "cell"; LP402535JU named as the example battery.
Hand-off: in: the charged battery from b10_charge; out: its plug (J2) leads to the board.

### 4. b10_board "One board, one side, one reflow" (night, settle 12)
Problem: most mice build a board with parts on both sides (Cougar Revenger Pro 4K: Type-C, switches and lens on the
underside, a second board for the side buttons on a flat ribbon; hwbusters). Both sides means a second oven pass with the
first side's parts hanging upside down while their solder melts again; a part stays only while its weight is under about
30 g per square inch of pad (Liu 2006). Heavy ones drop (ALLPCB).
Demonstration: a reflow oven in side view, full width: conveyor, heater zones, a temperature line across the top (preheat,
soak, 217 °C liquidus, ≈245 °C peak, cooling). Rival: pass 1 (paste goes matte → shiny as the board crosses the liquidus),
then the flip, pass 2: the underside's USB-C receptacle hangs; as its joints melt again it sags and drops (red "Dropped").
Wipe in place to Theseus: the same oven, every part on top, one pass, nothing hangs. Classroom panel (demoPanel): a drop
hanging from a dropper until its weight beats surface tension (2πrγ = mg, the drop-weight lab, NITK), then the same rule
for a part on molten solder (≤30 g/in², Liu 2006).
Beats: 0 s oven + rival board entering (header names it); ~1 s pass 1 melts; ~3 s flip, pass 2 starts, parts upside down;
~4.5 s the receptacle drops; ~5.5 s wipe to Theseus, one pass; ~8 s verdict "Oven passes: 2 → 1" and "0 parts upside
down"; a statTile: one 5.6 g board (radio module, PMIC, antenna and USB-C included, F12.1); settle 12.
Headline: 2 → 1 passes; second: 5.6 g, one board (no daughterboard, no ribbon).
Clause (elc_oneside 7/10): "good but i wish it was even better visualized" → the oven drawn as a tunnel with its heat
profile, the rival's flip and second pass with parts hanging while their solder melts again and the heavy receptacle
dropping, the same oven for Theseus's one pass, and the pendant-drop panel that says why. F2.29 / F12.1: one ~5.6 g board,
everything included. F0.5: the validated wording. NOT claimed: weaker re-melted joints (Wirth et al. found no change).
Hand-off: in from b10_battery (the plug, J2, on the board); out: the board leaves the oven → b10_sealed coats it.

### 5. b10_sealed "A coat that keeps water out" (paper, settle 11)
Problem: sweat is salt water (Na⁺ and Cl⁻ 10–90 mmol/L). A drop across two powered pads grows a metal tree from one to the
other (electrochemical migration): a salty drop on a part at 5 V shorted it in 14 to 62 s (DTU 2012); "water drop tests can
demonstrate dendritic growth in seconds" (DfR). Few mice protect the board (HyperX rates its hex Haste IP55 against sweat).
Demonstration: establish (mouseSimple, a drop of sweat at the grip falls inside along the seam onto the board; push in to
two pads of a part at battery voltage). Rival (bare board): the drop lands across the pads, a meter on the pair; ions
drift (anode → cathode), a branching tin dendrite grows across in a time-lapse clock to 14 s, the meter spikes: "Short".
Wipe to Theseus: the same drop on the coat (50 µm film over the pads, drawn thick and named "drawn 20× thick"), it beads,
the meter stays at 0, the clock runs past 60 s: "Dry underneath". Classroom panel: tin crystals grown with a 9 V battery and
two paper clips in salt water (ACS 2023): the same metal tree.
Beats: 0 s header + mouse with the drop; ~1 s the drop falls, push-in; ~2–4.5 s the dendrite grows, short at "14 s"; ~5 s
wipe; ~6.5 s the coated drop sits; ~8 s verdict "Time to a short: 14 s → never" with "+0.2 g" (0.1–0.3 g for 25–75 µm,
both sides, derived), under 1% of the mouse; settle 11.
Headline: +0.2 g; the short 14 s → none.
Clauses (elecsheet1 7/10): "show [how] this protects against water" → the drop on the bare pads grows a dendrite and shorts,
on the coat it beads and nothing flows; "for very little weight" → +0.2 g derived, 0.1–0.3 g range, under 1%;
"something few might do" → "Few mice coat their boards" with HyperX's IP55 Haste as the exception named. The old sheet's
second panel (the ON/OFF power switch, #100) is not on this slide: F29.3 leaves the switch's place to the bottom cover, and
ship mode is on b10_charge; say so in the answers.
Hand-off: in: the board from the oven; out: the coat stops at the connectors (masked) → what plugs in: the leads.

### 6. b10_wires "Braided, not ribbon" (night, settle 12)
Problem: most mice reach the side buttons with a ribbon (Cougar's "flat ribbon cable", hwbusters; the DeathAdder V4 Pro's
branching FFC; FPC sockets on the Viper V4 Pro's board, Brock's photo). Brock (#51): ribbons are the most common failure in
assembly and repair, "so easy to rip". A nicked film keeps tearing at 0.07 N (Kapton); folded hard, its copper creases on
one line (copper-clad film: ≥80 folds at R 0.38 mm, Shengyi).
Fix: three braided 32 AWG wires of 40 AWG strands on a JST plug (F21.10).
Demonstration (keep the 8/10 tear and the 7/10 flex, one stage): the ribbon and the braid side by side off the board's edge;
the pointer nicks the ribbon and pulls: the stress piles at the nick (red tip), it tears through at 0.07 N; the pointer cuts
one strand of the braid and pulls: the two left hold 14 N. Then both are folded over the board edge three times: the ribbon
creases on one line (the copper cracks: red), the braid rolls round its own radius (strain 2.5× lower).
Classroom panel: Bates & Dean 2024: a paper strip takes ≈95 N uncut; with a 5 mm nick every student tears it.
Beats: 0 s both leads, labels; ~1 s nick; ~1.5–3.5 s pull, tear; ~4–5.5 s cut a strand, pull, holds; ~6–8 s folds;
~8.5 s verdict "Force to tear: 0.07 → 14 N (200×)"; settle 12.
Headline: 200× the pull. Second: 2.5× less strain on the bend.
Clauses: elc_tear 8/10 and elc_flex 7/10 had no notes: keep both demonstrations and their numbers, make them read faster
(one stage, same input). F2.38: the simulation and its statistic, on the slide. F3.6: "Won't tear like ribbon" and "Flex
life" here; "Less radio noise" on b10_twist.
Hand-off: in: the masked connectors; out: the braid's twist → b10_twist.

### 7. b10_twist "Twisted pairs, a quiet radio" (paper, settle 11)
Problem: two wires side by side (a ribbon's traces) make one long loop: a changing field from the PMIC's coil or the radio
drives current round all of it (Faraday), and the loop's noise sits next to the antenna. Klipec (IEEE 1967): twisting beat
steel conduit five- to sixfold.
Fix: twisted, the loop flips every half lay and the halves cancel: −36 dB at a 6 mm lay (1/61 of the noise, derived). The
lay is the trade Brock warned of: tighter adds copper (1.5 mm lay +41 mg; 6 mm +3 mg).
Demonstration: Faraday's demo made mechanical: the pointer drags a coil's pulsing field along two leads; on each a meter:
the flat pair's needle swings with the field, the twisted pair's barely moves (the + and − lobes drawn on the loop cancel).
Then the pointer tightens the lay along a slider: the noise falls, the copper rises; the sweet spot at 6 mm.
Classroom panel: Harvard's Faraday demonstration: magnet into a coil, the galvanometer swings; the figure-eight loop beside it
stays still.
Beats: 0 s both pairs, the coil; ~1 s field on, flat needle swings; ~3 s drag along; ~5 s twisted needle still; ~6.5 s lay
slider; ~8 s verdict "Noise picked up: 1 → 1/61 (−36 dB)" and "+3 mg"; settle 11.
Headline: −36 dB for +3 mg.
Old slides elc_twist, elc_lay: not rated. F2.38, F3.6 ("Less radio noise"); Brock #69 caveat (braids too tight add weight).
Hand-off: in: the braid; out: the same braided conductors inside the charging cable → b10_cable.

### 8. b10_cable "An angled plug, a paracord cable" (paper, settle 12)
Problem: stock cables are stiff (TechPowerUp: the V3 Pro's "extraordinary stiffness prevents playing while charging", the
ULX's "supremely stiff", the GPX2's below-average flex) and a straight plug leaves at pad height, where the chin rides onto
it (Brock #19). The nose lifts; on plan 5 the lens sits at z +16.6, so it rises ≈0.68 of the nose's lift: a 3 mm cable
puts it ≈2 mm up, past a 1 or 2 mm lift-off (PAW3395): tracking stops mid-flick. A stiff, bent cable also pushes a 29 g
mouse by itself (Brock #20).
Fix: an angled plug that lifts the cable off the pad (Pulsar ships one: "prevents cable drag against the desk"), and
paracord over braided conductors that drapes instead of springing.
Demonstration (main, full width): the kit's mouse in profile charging; the pointer flicks it forward: straight plug: the chin
meets the cable, the nose rides up, the lens line crosses the lift-off band, a shot inset freezes short of the target
(MISS); wipe: the angled plug, the cable arcs up and away, same flick, the chin passes, the inset hits (HIT). Second beat:
the classroom fabric test (ASTM D1388): both cables slid over a ledge; the stock one sticks far out before it bends, the
paracord droops at once. The paracord drawn properly: a 16-carrier 2/2 twill sheath (yarn bundles over and under, a
tracer), the cut end showing the sheath, filler and four braided conductors.
Beats: 0 s profile, cable on the pad; ~1 s flick, chin rides up, lens past lift-off; ~2.5 s inset MISS; ~4 s wipe to angled;
~5.5 s same flick, HIT; ~7 s verdict "Lens lift with the cable under the chin: 2.1 → 0 mm"; ~8–10 s cantilever; settle 12.
Headline: 2.1 → 0 mm (a 3 mm cable, derived, said as an illustration).
Clauses (cable 3/10): "extremely lazy visualizations" → a real demonstration on the kit's mouse in profile (the chin, the
cable, the lens and its lift-off, the shot), and the classroom stiffness test; "paracord needs better assets" → a woven
16-carrier sheath with yarn bundles, over-under shading and a tracer along a curved path, its cut end, all in mm.
Hand-off: in: braided conductors; out: unplugged, the room goes dark → b10_lights.

### 9. b10_lights "Nothing lights up but the sensor" (night, settle 12)
Problem: light costs battery and dust blinds light. Optical mains pulse LEDs (two: 18% of a V4 Pro's battery, Omron's
pulse, as in Clicks); an optical wheel pulses another (Avago: every 2 ms; ≈6% at an assumed 5 mA); RGB cycling cut a G703
from 30 to 22 h (Logitech). Razer staff put the switches and wheel at almost half (claim, via Brock, F31.1). The wheel's
encoder is the number one failure point (Finalmouse support, via Brock): dust blocks an optical gate (Pulsar support; MPS),
contacts wear (Razer: ghost inputs, reverse scrolling).
Fix: mechanical GT01s (nothing until pressed), a magnetic wheel (always-on TMR: 1.5 µA per axis, MDT), no RGB LED: only the
sensor lights. The magnet counts through dust; the clear top housing shows the spring and magnet, so a failure is seen.
Demonstration: the dark stage; the kit's mouse from above in x-ray: the rival's lights pulse (two switch LEDs, the wheel's
LED, an RGB glow), a battery bar drains; one by one they go dark in Theseus, only the sensor's glow is left under the
mouse; the bar's drain slows: +31%. Then establish → push in to the wheel's encoder (encoderMM = k2_encMagFront): dust
falls into both gates: the optical beam is blocked, its count skips (a scroll counter misses steps), the magnet's field
passes the specks, the count holds; the clear top called out.
Classroom panel: a magnet moves a paper clip through a card; light stops at it.
Beats: 0 s dark mouse with lights; ~1 s battery drains; ~3–5 s lights go out one by one; ~5.5 s verdict "Battery to
lights: 24% → 0.2%" (+31% hours, derived); ~6.5 s push-in to the encoder; ~7.5–9.5 s dust; settle 12.
Headline: 24% → 0.2% of the battery (derived, V4 Pro at 1 khz).
Clauses: srf_encoder 2/10 no note → rebuilt as a demonstration (lights out on the mouse, the battery, the dust test);
(sealed) "still drawing the encoder poorly" → the shared encoder drawing, pushed in, with its parts named;
(sealed) "magnetic encoder that doesn't get affected by dust" → the dust test; (sealed) "transparent top housing to see when
it's broken like switches" → the clear top called out, spring and magnet visible; (elc_sheet2) "remove this slide" → stays
out; "add the no rgb light to the slide about having no optical components" → the RGB light is one of the lights here;
"put it next to the web software" → this slide plays just before b10_software. F2.08, F9.21 (encoder drawn as a normal
encoder: the shared k2_encMagFront), F30.20 (decided), clk_switch's "double the battery efficiency" read through the
Razer-staff claim; the derived +31% shown.
Hand-off: in: unplugged, dark; out: "no LED: the battery shows in the browser" → b10_software.

### 10. b10_software "Set it once, in the browser" (paper, settle 11)
Problem: (1) most mice need an app installed that runs in the background (Razer Synapse, Logitech G HUB: named, no size
claimed); (2) lift-off in coarse steps: the PAW3395 offers 1 or 2 mm (PixArt). Set too high, the sensor keeps tracking
while you lift to reset, so the crosshair drifts every reposition.
Fix: a browser tab (WebHID, Chrome and Edge 89+), nothing installed, settings saved on the mouse; lift-off in 0.1 mm steps,
set just above the pad (Brock: 0.65 mm skates; "0.1 mm LOD steps is a must"). X and Y counted apart (quiet row).
Demonstration: profile of the mouse and hand at the end of a swipe, lifting to reset while still moving; the lift-off line
at 2.0 mm (rival) then 0.8 mm (Theseus, set for a speed pad); below the line the sensor still counts, so a shot inset's
crosshair drifts: 2.0 mm → 2.5× the drift of 0.8 mm (illustration: 0.15 m/s sideways, 0.1 m/s up, 800 DPI). Then the
browser tab (the pointer drags the lift-off slider in 0.1 mm steps, 2.0 → 0.8) and "Saved on the mouse".
Beats: 0 s browser tab + profile; ~1 s rival lift, drift; ~3 s pointer drags 2.0 → 0.8 in 0.1 steps; ~5 s same lift,
little drift; ~7 s verdict "Tracked while lifting: 2.0 → 0.8 mm"; "0 installs"; settle 11.
Headline: lift-off 2.0 → 0.8 mm (−60% drift), set in 0.1 mm steps.
Clauses: software 6/10 no note → kept: no install, saved on the mouse, limits stated (Chrome and Edge); gld_soft 7/10
"place near web software" → merged into it; "better sell the importance of liftoff distance being 0.1mm configurable" →
the lift-and-reset demonstration shows what coarse steps cost and fine steps fix. G10: simple.
Hand-off: in from the lights' "battery in the browser"; out: the hand on the mouse → b07_shcard.

## Questions for Brock (multiple choice, for the report)
1. The wheel's magnetic sensor: (a) TMR, always on, ≈3 µA (MDT TMR1228D class) [my reading]; (b) Hall, 0.8 mA (KTH5791
   class: ≈47% of a V4 Pro's 1 khz draw); (c) Hall, duty-cycled.
2. The coat: (a) urethane 50 µm both sides, ≈0.2 g [drawn]; (b) 25 µm, ≈0.1 g; (c) top side only.
3. The cable-under-chin figure uses a 3 mm stock cable as the illustration: (a) keep 3 mm; (b) measure a V3 Pro / GPX2 cable.

## Research gaps (web-search budget used up at ~08:10; each with the query or URL that would fill it, and the slide it feeds)
1. Stock charging-cable diameters of the flagships (Viper V3/V4 Pro, GPX2, ULX). Query: "Razer Viper V3 Pro cable diameter mm"
   / "Superlight 2 USB-C cable thickness mm" / TechPowerUp review page 2 of each. Feeds b10_cable (now: a 3 mm cable, said as
   an illustration; the lens-lift figure scales with it: about 0.5 mm per mm of cable with the shell's lens at z 1.1, 0.66
   with plan 5's lens at z 16.6).
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
8. Bending stiffness of a stock mouse cable against a paracord cable (cantilever bending length, ASTM D1388 style, or
   flexural rigidity in N·m²). Query: "mouse cable stiffness measurement paracord bending length" / "USB cable flexural
   rigidity N m2". Feeds b10_cable's stiffness beat (now dropped: no numbers; the slide shows the drag at the chin instead).
9. The lift-off setting rival mice ship with (Razer, Logitech default LOD in mm). Query: "Viper V3 Pro default lift-off
   distance mm" / "G Pro X Superlight 2 lift off distance default". Feeds b10_cable (now: 1 mm, the PAW3395's lower setting).

## Models and conventions checked (08:45 rule: nothing reused unchecked)
| What | Where from | Check | Verdict |
|---|---|---|---|
| THESEUS.pcb = 5.6 g | 05-data.js | Brock F2.29 "a single ~5.6g pcb", F12.1 (module, PMIC, antenna, USB-C included) | OK; b10_board reads it from THESEUS.pcb, not typed |
| dsReflow (ALLPCB) | 10-f-elec.js SRC | says the second pass "can make first-side parts fall off"; heavier parts are the risk | OK as cited; the old slide's sourceBox wording ("the heavy ones can drop") not reused |
| Old elc_oneside "one heat front, once" 3D sweep, step lists | 10-f-elec.js | a convention (process as text steps) Brock rated 7, "wish it was even better visualized" | Not reused: replaced by the oven demonstration |
| Second-side rule 30 g/in² | Liu 2006 (new) | units: g of part per in² of pad; 30 is the design rule with a safety factor; tests held to ~60, mean fall-off ~99 | OK; slide shows 30 as "the rule" and does NOT show a ~40 g/in² part falling |
| Type-C 0.40 g on 6.5 mm² (≈ 39.7 g/in²) | my board-model estimate | arithmetic 0.40/6.5×645.16 = 39.7; mass and pad area unsourced (research gap 6) | Labelled "estimates" in the source line |
| Reflow profile (25→150→200→245 peak→cool; liquidus 217 °C) | my model | SAC305 liquidus 217–220 °C; lead-free peaks 235–250 °C; ~4 min a pass | OK; "shown in 3 s" said on the slide |
| Sag of hanging parts | my model | real sag unknown and small | Drawn larger than life, and said so in the source line |
| Board 5.6 g (THESEUS.pcb) against plan 5 | KEY_PARTS.board (08:50) | outline area 1,992 mm²: bare FR4 2.9 g at 0.8 mm (3.7 g at 1.0 mm) + copper ≈ 0.5–1 g + parts ≈ 1.5–2 g → 5–6.5 g | Plausible; Brock's figure kept (F2.29) |
| PMIC to module distance | KEY_PARTS (pmic −10.2, −16.57; module 0, −1.92) | 17.85 mm (was 17.7 on the old layout) | Re-derived; b10_pmic must use KEY_PARTS |
| elc_plugSide (old plug drawing) | 10-f-elec.js | overmold 15 × 6.5 mm and 6 mm relief are typical USB-C sizes; L plug 7 mm body | Re-drawn as b10_plug with the same sizes; no number claimed |
| cableMM (cable cut across) | 03-parts.js | R 1.2 mm (2.4 mm cable); 4 conductors of 7 strands ≈ 32 AWG each; sheath two layers | Used as a drawing only; labels say "Woven nylon sheath", "Four conductors" (not "braided conductors": the drawing shows stranded) |
| Old cable slide's "1.9 mm, XA25-class" headline and reviewer table | 10-f-elec.js, tpuCables | tpuCables is one vague entry (one URL for four reviews) | Not reused; the V3 Pro quote cited from b10TpuV3 (its own page) |
| Lift-off 1 mm | gld_paw3395 (PixArt datasheet: 1 or 2 mm) | the rival's shipped setting unknown (gap 9) | Shown as "Lift-off, 1 mm"; the lift is 2.1 mm, past both settings |
| Cable 3 mm under the front skate | illustration | stock diameters unmeasured (gap 1); lens lift 0.71 mm per mm of cable at plan 5's lens | Said in the source line as an illustration |
| Lights shares (Omron pulse, Avago timing, V4 Pro 1.70 mA) | B10.lights; b03 uses the same Omron pulse | 5 mA × 30 µs/1 ms = 0.15 mA a switch; wheel 5 mA assumed (srf_avagoWheel gives no current: the old slide gave no mA for it); V4 Pro all-optical (srf_razerAllOptical) | Shown, with "5 mA (assumed)" in the source; Theseus's share rounded up, the rival's down |
| Razer staff "almost half" (F31.1) | Brock | a claim, not a measurement | Not shown as a fact; answered in the slide's answers |

