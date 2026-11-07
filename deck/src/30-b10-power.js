/* ============================================================================================
   B10, Electronics II: power, the board, the wires (revamp v2, 2026-11-06). Ten slides, in film order:
   b10_pmic, b10_charge, b10_battery, b10_board, b10_sealed, b10_wires, b10_twist, b10_cable, b10_lights, b10_software.
   Before: b09_life (battery life at every polling rate: b10_pmic opens on that battery and its reading). After:
   b07_shcard (a shape measured on hands: b10_software ends on the hand lifting the mouse).
   The spine (F33.7): most mice trade something in their power and wiring (a battery reading that lies, slow charging, a
   heavier battery, a second oven pass, a bare board, ribbons that tear, wires that hum, a stiff cable, lights that drain,
   an app to install); Theseus trades none. Every slide: the rival's fault drawn mechanically and named, the same input on
   Theseus, the payoff (common.md M1 to M10).
   Shared drawings only: the board is the 'pcb' scene's flat twin (view3D → GEO2D.pcb, rebuilt by H1 to plan 5) and its
   parts are found by name (v2dAt), the battery is the 'battery' twin, the encoder is encoderMM, the mouse is the kit's
   mouseSimple. Old helpers called from 10-f-elec.js / 10-f2-elec.js: elc_cell, elc_ribbon, elc_braid, elc_conn,
   elc_sleeve, elc_slab, elc_reject, elc_takeup, ELB (the braid's model and drawings Brock rated 8 and 7).
   ============================================================================================ */
Object.assign(SRC, {
  b10Nordic24: { t: 'Geir Kjosavik (Nordic Semiconductor), "My application needs accurate fuel gauging: what options are available?", Electronic Design, 2024-02-07: a voltage lookup table "yields errors of up to 20% with a large spread" (10 to 30% at −5 °C); the nPM1300 with Nordic\'s algorithm, "a maximum deviation from the reference of approximately 3%"; under load "the measured voltage will be lower than the actual voltage". Nordic\'s own benchmark', u: 'https://www.electronicdesign.com/technologies/power/article/21282297/nordic-semiconductor-my-application-needs-accurate-fuel-gaugingwhat-options-are-available', n: 'A maker\'s benchmark of its own part: claim-level for the nPM1300 figure.' },
  b10TpuGpx2: { t: 'TechPowerUp, Logitech G Pro X Superlight 2 review, page 8: "Logitech decided to not implement a fuel gauge IC"; the readings "aren\'t particularly reliable or accurate"; the reading would "suddenly sit at 60% after turning the mouse off and on again", "undoubtedly false"', u: 'https://www.techpowerup.com/review/logitech-g-pro-x-superlight-2/8.html' },
  b10TpuV3: { t: 'TechPowerUp, Razer Viper V3 Pro review, page 8: a fuel gauge IC, "very precise and consistent battery life readings"; "a snail-like charge speed of around 0.150 A"; the cable\'s "extraordinary stiffness prevents playing while charging virtually completely"', u: 'https://techpowerup.com/review/razer-viper-v3-pro/8.html' },
  b10HwbCarbonX: { t: 'Hardware Busters, Epomaker Carbon X teardown: a CL4056E linear charger; the USB-C port, the power switch, the DPI button and the lens housing on the board\'s underside; the side buttons on a second board in the top shell', u: 'https://hwbusters.com/peripherals/epomaker-carbon-x-mouse-review/4/' },
  b10HwbCarbonis: { t: 'Hardware Busters, Epomaker Carbonis teardown: a YX4068T linear Li-ion charger; two flat ribbon cables (main board to the side-button board, and on to the LCD)', u: 'https://hwbusters.com/peripherals/epomaker-carbonis-mouse-review/4/' },
  b10HwbCougar: { t: 'Hardware Busters, Cougar Revenger Pro 4K teardown: turning the board over shows the Type-C port, the power and DPI switches and the sensor\'s lens; the side-button switches sit on a daughterboard in the top shell, joined by a "flat ribbon cable"', u: 'https://hwbusters.com/peripherals/cougar-revenger-pro-4k-mouse-review/4/' },
  b10Npm: { t: 'Nordic nPM1300 product page: Li-ion and Li-poly charging 32 to 800 mA, JEITA, a battery NTC input for protection and fuel gauging, 22 V overvoltage protection, two 200 mA bucks "up to 93%" efficient, two LDOs / load switches, a fuel gauge (state of charge, state of health, cycles), watchdog, ship mode 370 nA, hibernate 500 nA, 5 × 5 mm QFN or 3.1 × 2.4 mm WLCSP', u: 'https://www.nordicsemi.com/Products/nPM1300' },
  b10Valid: { t: 'Theseus validation report (2026-11-03), the nPM1300: "replaces 4–6 support ICs with one, and adds JEITA, a gauge and a watchdog", against a discrete charger, LDO, gauge with its sense resistor, reset IC and watchdog; not against a bare charger and LDO', u: '', n: 'research/validation-report-2026-11-03.md' },
  b10Bu410: { t: 'Battery University BU-410, "Charging at high and low temperatures": no charge permitted below freezing ("plating of metallic lithium occurs on the anode during a sub-freezing charge", a permanent loss); fast charge from 5 °C to 45 °C; heat can swell a pouch', u: 'https://batteryuniversity.com/article/bu-410-charging-at-high-and-low-temperatures' },
  b10Bu409: { t: 'Battery University BU-409, "Charging lithium-ion": constant current, then a saturation stage at constant voltage; a higher current fills the battery to about 70% quickly but "does not hasten the full-charge state by much"', u: 'https://batteryuniversity.com/article/bu-409-charging-lithium-ion' },
  b10Keep10440: { t: 'Keeppower 10440 lithium-ion battery (bare): Ø10.2 × 43.6 mm, 350 mAh nominal (340 minimum), 3.7 V, "approximately 10g"', u: 'https://keeppower.com.cn/products_detail.php?id=711' },
  b10Liu06: { t: 'Liu, Geiger and Shangguan, "Component Candidacy of Second Side Reflow with Lead-Free Solder", Materials Transactions 47(6), 2006, 1577–1583: a part stays on the underside through the second reflow while its weight over its pad area is at most about 30 g/in² (the design rule); lead-free parts up to about 60 g/in² held in their tests, and the mean fall-off was about 99 g/in²; the break runs through the molten solder', u: 'https://www.jstage.jst.go.jp/article/matertrans/47/6/47_6_1577/_article/-char/en' },
  b10Nitk: { t: 'NITK virtual lab, "Surface tension by the drop weight method": a drop hangs from the tube until its weight beats the surface tension round the tip, "At equilibrium: 2πrγ = mg"', u: 'https://ph1-nitk.vlabs.ac.in/exp/surface-tension/theory.html' },
  b10Dtu12: { t: 'Verdingovas, Jellesen and Ambat (DTU), "Effect of ionic contamination on corrosion reliability of printed circuit board assemblies", EUROCORR 2012: a NaCl droplet across an 0805 part at 5 V DC; time to first failure "62s, 25s, 19s and 14s" as the salt rises "from 1.56 µg/cm2 to 15.6 µg/cm2", at "1 µl of solution over 1 mm2": 0.27 to 2.7 mmol/L in the drop (derived), below sweat\'s 10 to 90', u: 'https://backend.orbit.dtu.dk/ws/files/52391164/1350.pdf' },
  b10TpuXliteLod: { t: 'TechPowerUp, Pulsar Xlite V3 eS review (PAW3395), page 5: "two pre-defined LOD levels"; on 1 mm it "will not track at a height of one DVD" (under 1.2 mm); on 2 mm it tracks at one DVD but not two', u: 'https://techpowerup.com/review/pulsar-xlite-v3-es/5.html' },
  b10PulsarX3Lod: { t: 'pulsar-mouse-linux v0.1.23 release notes (a third-party tool that reads the mouse): "An X3 on its factory 1 mm"; "The dongle\'s own list is still 1 and 2 mm". One model, not Pulsar\'s own statement', u: 'https://github.com/packerlschupfer/pulsar-mouse-linux/releases/tag/v0.1.23' },
  b10RazerCutoff: { t: 'Razer, Viper V3 Pro page: Asymmetric Cut-Off, "Individually set a lift-off and landing distance from up to 26 levels"; Smart Tracking "auto-calibrates" (no mm, no default published)', u: 'https://www.razer.com/mena-en/gaming-mice/razer-viper-v3-pro' },
  b10Yoo24: { t: 'Yoo, Won and Kim, "Effect of conformal coating on electrochemical migration behavior of multi-layer ceramic capacitor for automotives based on water drop test", Coatings 14(3), 359, 2024: about 1 µL of 0.1 % or 0.3 % NaCl (17 or 51 mmol/L) on a coated capacitor at 3 to 12 V: "No failure was observed under any voltage conditions" ("the test time was limited to less than 200 s" as the drop dries); "ECM phenomenon by the water drop test did not occur". At 5 V in 0.3 % the coat over the anode was damaged; "the conformal coating at the cathode side was still stable"', u: 'https://www.mdpi.com/2079-6412/14/3/359' },
  b10Dfr: { t: 'Bumiller and Hillman (DfR Solutions), "A review of models for time-to-failure due to metallic migration mechanisms": "water drop tests can demonstrate dendritic growth in seconds"; chloride and bromide ions "tend to be the most harmful contaminants"', u: 'https://dev.smtnet.com/library/files/upload/Time-to-Failure_Metallic_Migration.pdf' },
  b10Medgyes13: { t: 'Medgyes, Illés and Harsányi, "Electrochemical migration of micro-alloyed low Ag solders in NaCl solution", Periodica Polytechnica EECS 57(2), 2013: the NaCl solution "simulates ... human perspiration"; metal ions dissolve at the anode and deposit at the cathode as needle and tree-like dendrites', u: 'https://pp.bme.hu/eecs/article/download/2068/6180' },
  b10Sweat: { t: 'Baker, Engel and Wolfe, "Sweat biomarkers for sports science applications", GSSI Sports Science Exchange #226, 2022: Na⁺ and Cl⁻ "are by far the most concentrated, ranging from 10 to 90 mmol/L" (Barnes et al. 2019)', u: 'https://www.gssiweb.org/sports-science-exchange/article/sweat-biomarkers-for-sports-science-applications' },
  b10Humiseal: { t: 'HumiSeal (Chase Corp), "The importance of conformal coating thickness": acrylic and urethane coats 25–75 µm, parylene 12.5–50 µm, the thicknesses of the standard tests (IPC-CC-830)', u: 'https://blog.chasecorp.com/humiseal/the-importance-of-conformal-coating-thickness' },
  b10Hyperx: { t: 'HyperX Pulsefire Haste Wireless product page: a hex shell with cutouts, "IP55 rated to withstand sweat and minor aquatic accidents, as well as dust, oil, and dirt"', u: 'https://row.hyperx.com/collections/riot/products/hyperx-pulsefire-haste-wireless' },
  b10AcsTin: { t: 'American Chemical Society outreach activity, "Tin Crystals" (2023): tin(II) chloride solution, a 9 V battery and two paper clips; tin metal grows at the cathode', u: 'https://www.acs.org/content/dam/acsorg/education/outreach/activities/activity-guides/growing-tin-crystals-san-diego-state.pdf' },
  b10Bates24: { t: 'Bates and Dean, "A total rip-off: crack propagation in paper", Physics Education 59, 035010 (2024): a 25 mm strip of printer paper takes about 95 N to break (students pull 25 to 35 N); "All students easily broke the paper with a 5 mm cut"', u: 'https://eprints.whiterose.ac.uk/210831/1/Bates_2024_Phys._Educ._59_035010.pdf' },
  b10Stoebe: { t: 'Stoebe (University of Washington), "Paper Clip Experiment: Properties and Failure" (Edmonds Community College, 2007): a clip bent back and forth fails by fatigue; a 180° bend breaks it "in less than half the number of bends" of a 90° bend', u: 'https://ate.community/downloads/46608/Paper_Clip_Experiment.pdf' },
  b10Harvard: { t: 'Harvard Natural Sciences Lecture Demonstrations, "Faraday\'s Law": a coil on a galvanometer and a magnet; current flows "when the magnetic flux through the coil changes"', u: 'https://sciencedemonstrations.fas.harvard.edu/presentations/faradays-law' },
  b10Astm1388: { t: 'ASTM D1388, stiffness of fabrics, cantilever test (Geocomp summary): a strip is slid over the edge of a horizontal surface until its tip droops to 41.5°; the overhang gives the bending length and flexural rigidity', u: 'https://www.geocomp.com/tests/standard-test-method-for-stiffness-of-fabrics/' },
  b10PulsarCable: { t: 'Pulsar USB-C Paracord Cable: a "Head Bent", L-shaped USB-C connector that "prevents cable drag against the desk"; 1.8 m', u: 'https://www.pulsar.gg/products/usb-c-cable' },
  b10MdtTmr: { t: 'MDT, TMR1228D (press release, 2026-07-13): always-on dual-axis magnetic switch, "as little as 1.5μA per axis", DC to 1 kHz, "Continuous (always-on) magnetic field detection without duty-cycling", for quadrature encoder systems', u: 'https://en.prnasia.com/releases/apac/mdt-introduces-tmr1228d-always-on-high-sensitivity-dual-axis-magnetic-switch-ic-with-microamp-level-power-consumption-540448.shtml' },
  b10Plan5: { t: 'Theseus board, placement plan 5 (approved by Brock, 2026-11-05): the PMIC in the left-middle spot beside the sensor (z 19.45), the radio module at the rear centre (z 4.80), J2 battery and J3 side lead at z 8.50, battery front z −4.82', u: '', n: 'handoff/plan-images/board-plan-5.jpg; 3d/pcb/plans/plan5.py' },
  b10Gpx2Hours: { t: 'TechPowerUp, Logitech G Pro X Superlight 2 review, page 7, Logitech\'s own figures: "if set to 1000 Hz, battery life will be 96 hours in optical switch mode and 104 hours in hybrid switch mode" (290 mAh). Running the two main switches\' optics full time costs 290/96 − 290/104 = 0.23 mA, 0.116 mA a switch: derived', u: 'https://techpowerup.com/review/logitech-g-pro-x-superlight-2/7.html' },
  b10G703: { t: 'Logitech G703 LIGHTSPEED spec sheet (2017): "up to 32 hours non-stop gaming at 1ms report rate with lights off", "24 hours non-stop gaming at 1ms report rate with RGB color cycling on"', u: 'https://logitech.com/assets/65259/2/g703-lightspeed-wireless-gaming-mouse.pdf' },
  b10Aqa: { t: 'AQA A-level Physics required practical, "Investigating EMF and internal resistance": a variable load, an ammeter and a voltmeter; V = ε − I r (Save My Exams revision notes)', u: 'https://www.savemyexams.com/a-level/physics/aqa/17/revision-notes/5-electricity/5-4-electromotive-force-and-internal-resistance/5-4-2-required-practical-investigating-emf-and-internal-resistance/' },
  b10Brock: { t: 'Brock Liddicoat, "In Pursuit of an Objectively Better Mouse": #19 angling the charging cable ("prone to sucking the cable in"; Lamzu and Pulsar do it), #20 a Goldilocks cable ("the tension in the bent cable is stronger than the weight of the mouse"), #51 wires instead of ribbon cables ("so easy to rip"), #69 braids not too tight ("wires are heavy"), #70 paracord, #98 a conformal urethane coat, #99 no RGB LED; "0.1 mm LOD steps is a must"; "very few companies advertise the use of the lithium polymer battery"', u: '', n: 'research/brock-doc-in-pursuit.txt' }
});

/* ============================================================================================ data
   Every number a slide shows is computed here from its sources, once. */
const B10 = (() => {
  const cell = typeof elc_cell === 'function' ? elc_cell() : { mAh: 370, g: 8, wh: 1.369, whV4: 1.184 };
  const whV4 = cell.whV4 || 1.184;
  /* the Viper V4 Pro's draw: its 1.184 Wh battery over Razer's 180 h at 1 khz and Razer's 45 h at 8 khz (claims, like for
     like with Theseus's derivation: the film's one 8 khz figure, BROADCAST-0930; TechPowerUp measured about 40 h, which
     the source lines keep as corroboration) */
  const w1 = whV4 / 180, w8 = whV4 / 45, h1 = cell.wh / w1;
  /* Theseus at 8 khz: the film's one figure (R3: b10_charge implied 52 h, b09_life prints 50): its 200 h target at 1 khz
     scaled as the V4 Pro's 180 → 45 h, read from b09's B09L where it exists, so Electronics I and II can't drift */
  const h8 = typeof B09L !== 'undefined' && B09L.ths && B09L.ths.h ? B09L.ths.h[3] : THESEUS.hours * 45 / 180;
  /* Li-ion in a steel can, mouse-sized (Brock, F27 cells: "look at smaller batteries"): two sellers' 10440s at 350 mAh */
  const cyl = [{ who: 'akkuteile', mAh: 350, g: 9, src: 'elc10440' }, { who: 'Keeppower', mAh: 350, g: 10, src: 'b10Keep10440' }]
    .map(c => Object.assign(c, { at: c.g * cell.mAh / c.mAh, whkg: c.mAh / 1000 * 3.6 / c.g * 1000 }));
  /* the can and the foil: a 10440's 0.18 mm nickel-plated steel can (Ø10.2 × 43.6 mm, 7.85 g/cm³) against the pouch's
     ≈0.11 mm aluminium laminate (≈1.7 g/cm³) over a 4 × 25 × 37 mm pouch: both derived */
  const can = (Math.PI * 10.2 * 43.6 + 2 * Math.PI * 5.1 * 5.1) * 0.18 * 7.85 / 1000;
  const foil = (2 * 25 * 37 + 2 * (4 * 37 + 4 * 25)) * 0.11 * 1.7 / 1000;
  return {
    cell, w1, w8, h1, h8,
    /* the V4 Pro charges at 0.169 A on 306 mAh (TechPowerUp): 0.55C. Theseus at its battery's rated 1C (Jauch) */
    v4: { mAh: 306, A: 0.169, c: 0.169 / 0.306, h1: 180, h8: 45 },
    cyl, can, foil, mass: THESEUS.mass,
    /* the coat: urethane at 1.05 g/cm³ over both sides with the parts' flanks (≈35.6 cm²), 25 / 50 / 75 µm */
    coat: [25, 50, 75].map(um => ({ um, g: 35.6 * um / 1e4 * 1.05 })),
    /* lights, against a Viper V4 Pro's average draw at 1 khz (306 mAh over 180 h). An optical switch: 0.116 mA, from
       Logitech's own hours for the G Pro X Superlight 2 (TechPowerUp: 96 h optical-only against 104 h hybrid at 1 khz, 290
       mAh), the lower of the film's two derivations and the one it claims (BROADCAST-0945; Omron's datasheet pulse, 5 mA for
       30 µs every 1 ms, would give 0.15 mA). Read from b03's B03 where it exists, so Clicks and this slide can't drift.
       An optical wheel's LED (Avago: pulsed 40 µs every 2 ms; 5 mA assumed, as Omron's), and a magnetic wheel on an
       always-on TMR sensor (MDT: 1.5 µA per axis, two axes) */
    lights: (() => {
      const B3 = typeof B03 !== 'undefined' ? B03 : null;
      const avg = B3 && B3.v4MA ? B3.v4MA : 306 / 180, swOne = B3 && B3.optMA ? B3.optMA : (290 / 96 - 290 / 104) / 2;
      const swOmron = B3 && B3.omronMA ? B3.omronMA : 5 * 0.030, sw = 2 * swOne, wh = 5 * 0.040 / 2.0, tmr = 0.003;
      /* Theseus's own: two mechanical switches read by strobed pull-ups (b03's 3 µA a switch) and the TMR; the gain is the
         same battery's hours with Theseus's draw in place of the lights (+23.4 %: shown +23 %, never rounded up) */
      const mUA = B3 && B3.mechUA ? B3.mechUA : 3, thsMA = 2 * mUA / 1000 + tmr, gain = avg / (avg - sw - wh + thsMA) - 1;
      return { avg, swOne, swOmron, sw, wh, tmr, mUA, thsMA, gain, share: (sw + wh) / avg, shareT: tmr / avg };
    })(),
    /* second-side reflow: 30 g per square inch of pad (Liu 2006) in mg per mm² */
    padRule: 30 / 645.16 * 1000
  };
})();

/** a named mouse's [length, width, height] in mm from research/data/mice.json (EloShapes), else fb */
function b10_dims(name, fb) {
  const r = (((typeof RDATA !== 'undefined' ? RDATA : {}).mice || {}).mice || []).find(q => q.name === name);
  const v = k => r && r[k] && typeof r[k].value === 'number' ? r[k].value : null;
  return r && v('length_mm') && v('width_mm') && v('height_mm') ? [v('length_mm'), v('width_mm'), v('height_mm')] : fb;
}
/** b10_lights' shares as printed (the rival's floored to 0.1 %), and the total as their sum, so the parts add up */
B10.lightsShown = () => { const L = B10.lights, f = v => Math.floor(v * 1000 + 1e-9) / 10, sw = f(L.swOne / L.avg), wh = f(L.wh / L.avg); return { sw, wh, total: Math.round((2 * sw + wh) * 10) / 10 }; };

/* ============================================================================================ models */
/** a CC/CV charge in C-rate units (10-f-elec.js's model: the battery's open-circuit voltage curve, 0.21 V per C of
   series resistance, stop at 10% of the set current). c (C), s0 (start state of charge). Cached. Returns
   { pts: [[min, soc]], cc: [min, soc] where constant voltage starts, end, t80, at(min) → soc } */
const B10_CCV = new Map();
function b10_ccv(c, s0 = 0.2) {
  const key = c.toFixed(4) + '|' + s0; if (B10_CCV.has(key)) return B10_CCV.get(key);
  const ocv = typeof elc_ocv === 'function' ? elc_ocv : (s => 3.0 + 1.2 * s), rq = 0.21, dt = 0.25, pts = [];
  let s = s0, tm = 0, cc = null, t80 = null;
  for (let i = 0; i < 4000; i++) {
    let I = c;
    if (!cc && ocv(s) + c * rq >= 4.2) cc = [tm, s];
    if (cc) I = Math.max(0, (4.2 - ocv(s)) / rq);
    pts.push([tm, s]); if (t80 == null && s >= 0.8) t80 = tm;
    if (cc && I <= 0.1 * c) break;
    s = Math.min(1, s + I * dt / 60); tm += dt;
  }
  const at = m => { if (m <= 0) return s0; const i = Math.min(pts.length - 1, Math.floor(m / dt)); return pts[i][1]; };
  const r = { pts, cc, end: pts[pts.length - 1], t80, at };
  B10_CCV.set(key, r); return r;
}
/** b10_charge's payoff: the hours of play at 8 khz that ten minutes of charge from 20 % buy, on the V4 Pro (0.55C) and on
   Theseus (1C): the share of a full charge each takes in, times its own battery's life at 8 khz: the V4 Pro's 45 h (Razer),
   Theseus's 50 h (B10.h8, b09_life's figure: one value for the film). The true values (4.14 and 8.33 h), and the shown
   ones rounded against Theseus (higher is better: the rival's up, Theseus's down, never in its favour): 4.2 → 8.3 h */
function b10_tenMin() {
  const A = b10_ccv(B10.v4.c, 0.2), Bc = b10_ccv(1.0, 0.2);
  const hA = (A.at(10) - 0.2) * B10.v4.h8, hB = (Bc.at(10) - 0.2) * B10.h8;
  return { hA, hB, sA: Math.ceil(hA * 10 - 1e-9) / 10, sB: Math.floor(hB * 10 + 1e-9) / 10 };
}

/** b10_pmic's session: one battery over one long session, read two ways. u: 0..1 through the session.
   The true state of charge falls from 0.46 to 0 (the battery dies at u = 1). Events along it: a power cycle at u 0.12 (a
   rested battery reads high: TechPowerUp's GPX2 "sat at 60% after turning the mouse off and on"), fights (load bursts:
   the voltage sags, the guess drops), a cold start at u 0.55 (a cold battery's resistance is several times higher). The
   voltage guess errs by up to 20% (Nordic's benchmark, 2024); the gauge by up to 3% (the same benchmark). An
   illustration of the measured error sizes, not a recording. Returns { s (true), v (the guess), g (the gauge), load
   (0..1), ev (the event name or ''), warm } */
function b10_session(u) {
  u = clamp(u);
  const s = 0.46 * (1 - u);
  const fights = [[0.2, 0.3], [0.38, 0.48], [0.62, 0.72], [0.82, 0.97]];
  let load = 0; for (const [a, b] of fights) load = Math.max(load, env(u, a, a + 0.02, b - 0.02, b, E.io3));
  const flick = load > 0 ? 0.5 + 0.5 * Math.abs(Math.sin(u * 160)) : 0;
  /* the guess: rested high after the power cycle (+14 pts, settling over the next 0.12), sags in fights (−6 to −9),
     cold start (−12, warming back), and it lags (firmware smoothing) so it still shows charge when the battery is gone */
  const rest = 0.14 * env(u, 0.12, 0.13, 0.16, 0.3, E.out3);
  const sag = -0.075 * load * flick;
  const cold = -0.12 * env(u, 0.55, 0.56, 0.6, 0.7, E.out3);
  const lag = 0.17 * ep(u, 0.78, 1.0, E.in3);
  const v = clamp(s + rest + sag + cold + lag, 0, 1);
  /* the gauge: its model takes the current and temperature in, so it stays within 3% (wobble) */
  const g = clamp(s + 0.012 * Math.sin(u * 23) + 0.008 * Math.sin(u * 71), 0, 1);
  const ev = u > 0.12 && u < 0.2 ? 'restart' : u > 0.55 && u < 0.66 ? 'cold' : load > 0.5 ? 'fight' : '';
  return { s, v, g, load: load * flick, ev };
}

/** a metal dendrite between two pads (electrochemical migration: metal leaves the anode and plates back at the cathode as a
   tree that grows toward the anode). A seeded, deterministic tree in a unit box: it starts on the cathode edge (x = 0)
   and grows toward x = 1. Returns segments [x0, y0, x1, y1, birth (0..1 of the growth), width] and the tip that reaches
   x = 1 first (its birth time = 1). Cached by seed */
const B10_TREE = new Map();
function b10_tree(seed = 7, n0 = 5) {
  if (B10_TREE.has(seed)) return B10_TREE.get(seed);
  const r = rng(seed), segs = [];
  const grow = (x, y, ang, len, w, t0, depth) => {
    let px = x, py = y, a = ang, t = t0;
    for (let i = 0; i < 40 && px < 1.02; i++) {
      a = a * 0.82 + (r() - 0.5) * 0.9 * (depth ? 1.3 : 0.8);        /* the field pulls it toward the anode (angle 0) */
      const step = len * (0.6 + r() * 0.6), nx = px + Math.cos(a) * step, ny = clamp(py + Math.sin(a) * step, 0.04, 0.96);
      const dt = step * (depth ? 1.5 : 1.0);
      segs.push([px, py, nx, ny, t, w]); t += dt; px = nx; py = ny; w = Math.max(0.25, w * 0.96);
      if (depth < 3 && r() < 0.32) grow(px, py, a + (r() < 0.5 ? -1 : 1) * (0.5 + r() * 0.7), len * 0.8, w * 0.7, t, depth + 1);
    }
    return t;
  };
  for (let k = 0; k < n0; k++) grow(0, 0.12 + 0.76 * (k + r() * 0.6) / n0, (r() - 0.5) * 0.6, 0.05, 1.0, r() * 0.25, 0);
  /* normalise: the first segment to cross x = 1 is the short circuit, at birth 1 */
  let hit = Infinity; for (const sg of segs) if (sg[2] >= 0.995) hit = Math.min(hit, sg[4]);
  if (!isFinite(hit)) hit = Math.max(...segs.map(s => s[4]));
  const out = { segs: segs.map(s => [s[0], s[1], Math.min(1, s[2]), s[3], s[4] / hit, s[5]]), seed };
  B10_TREE.set(seed, out); return out;
}

/** the reflow oven's temperature at a fraction f along it (a lead-free profile: preheat ramp, soak 150–200 °C, peak
   ≈245 °C above SAC305's 217 °C liquidus, cooling). Returns °C */
function b10_profile(f) {
  return kf(clamp(f), [[0, 25], [0.22, 150], [0.48, 200], [0.62, 245], [0.7, 238], [0.84, 120], [1, 45]], E.io3);
}
const B10_LIQ = 217;

/** b10_software's lift and reset at the end of a swipe, side on: the hand lifts the mouse at vz (m/s) while it still moves
   sideways at vx (m/s). Below the lift-off height the sensor still counts. Returns the sideways travel tracked while
   lifting (mm) for a lift-off h (mm), and the crosshair's turn (degrees) at cpi counts per inch and yaw degrees per count.
   An illustration: 0.15 m/s sideways, 0.1 m/s up, 800 cpi, 0.022° a count (a common game default at sensitivity 1) */
function b10_drift(h, o = {}) {
  const vx = o.vx || 0.15, vz = o.vz || 0.1, cpi = o.cpi || 800, yaw = o.yaw || 0.022;
  const mm = vx * h / vz, counts = mm / 25.4 * cpi;
  return { mm, counts, deg: counts * yaw };
}

/** b10_cable: the nose rides onto a cable of diameter d (mm) under the front skate, the mouse pivoting on its rear skates.
   The lens rises by d times its distance from the rear skates over the skates' span. Plan 5: the lens at mouse z 16.57; the
   skates at about ±45 mm (the dot ledges). Returns the lens lift (mm) */
function b10_lensLift(d, o = {}) {
  const zl = o.lens == null ? 16.57 : o.lens, zf = o.front || 45, zr = o.rear || -45;
  return d * (zl - zr) / (zf - zr);
}

/* ============================================================================================ drawings, in mm
   Painters in mm for part() (y down), in the deck's drawing style (03-parts.js): flat material fills with a soft two-stop
   shade, thin outlines in the ground's ink, nothing photographic. Each returns named points in stage px for callouts. */

/** the pouch's size, read from the shared battery twin (GEO2D.battery: the pouch, its protection board, its plug), so H1's
   battery reaches these drawings. mm: { w (across), l (along), th (thick), pcm: [x0, x1] along l of the protection board } */
function b10_pouchDims() {
  const S = (typeof GEO2D !== 'undefined' && GEO2D.battery) || null, m = S && S.meshes.find(q => /cell\/pouch$/.test(q.path)), pc = S && S.meshes.find(q => /pcm\/pcmBoard$/.test(q.path));
  if (!m || !m.bbox) return { w: 25, l: 37, th: 4, pcm: 2.8 };
  const b = m.bbox; return { w: b[1][0] - b[0][0], l: b[1][2] - b[0][2], th: b[1][1] - b[0][1], pcm: pc && pc.bbox ? pc.bbox[1][2] - pc.bbox[0][2] : 2.8 };
}

/** a 10440 lithium-ion battery from the side (Ø10.2 × 43.6 mm, the AAA size), centred on the origin, its + button to the
   right. A nickel-plated steel can under a printed wrap. o = { cut (0..1: a window opens in its side, showing the jelly roll
   and the can's wall), hiCan (0..1: the can's wall in the problem colour), label (true) }. Returns { can, roll, button, top } */
function b10_li10440MM(o = {}) {
  const L = 43.6, R = 5.1, hl = L / 2, cut = o.cut || 0, hc = o.hiCan || 0, out = {};
  const body = () => { G.beginPath(); G.moveTo(-hl + 0.6, -R); G.lineTo(hl - 0.6, -R); G.quadraticCurveTo(hl, -R, hl, -R + 0.6); G.lineTo(hl, R - 0.6); G.quadraticCurveTo(hl, R, hl - 0.6, R); G.lineTo(-hl + 0.6, R); G.quadraticCurveTo(-hl, R, -hl, R - 0.6); G.lineTo(-hl, -R + 0.6); G.quadraticCurveTo(-hl, -R, -hl + 0.6, -R); G.closePath(); };
  /* the + button: a raised nub on the right end */
  solid(() => pathRR(hl - 0.2, -2.0, 1.1, 4.0, 0.4), MT.steel, [hl - 0.2, -2, 1.1, 4], { lw: 0.9 });
  /* the steel can under its wrap: a round shade (light a third of the way down) */
  const g = G.createLinearGradient(0, -R, 0, R); g.addColorStop(0, '#3B3E45'); g.addColorStop(0.3, '#5A5E66'); g.addColorStop(0.55, '#34373D'); g.addColorStop(1, '#1D1F23');
  body(); G.fillStyle = g; G.fill();
  /* the wrap's printing: a pale band and the words, set small at stage scale */
  if (o.label !== false) {
    G.save(); body(); G.clip();
    G.fillStyle = 'rgba(255,255,255,0.08)'; G.fillRect(-hl, -R * 0.36, L, R * 0.72);
    G.save(); G.scale(mmpx(), mmpx()); const k = 1 / mmpx(); setFont({ font: 'sans', size: 1.9 * k, weight: 760 }); G.fillStyle = 'rgba(243,243,245,0.72)'; G.textAlign = 'center';
    G.fillText('Li-ion 10440  3.7 V  350 mAh', 0, 0.75 * k); G.restore();
    G.restore();
  }
  /* the can's bare steel at both ends, past the wrap */
  for (const sx of [-1, 1]) solid(() => { G.beginPath(); G.rect(sx > 0 ? hl - 1.2 : -hl, -R, 1.2, 2 * R); }, MT.steel, [sx > 0 ? hl - 1.2 : -hl, -R, 1.2, 2 * R], { lw: 0.6, ea: 0.3 });
  body(); G.strokeStyle = edgeCol(MT.black); G.lineWidth = lw(1.2); G.stroke();
  /* the cut: a window through the wrap and can, showing the wound layers inside and the wall's thickness */
  if (cut > 0.003) {
    const x0 = -hl + 5, x1 = lerp(x0, hl - 5, E.out3(cut)), wall = 0.55;   /* the wall drawn 3× its 0.18 mm so it reads */
    G.save(); G.beginPath(); G.rect(x0, -R, x1 - x0, 2 * R); G.clip();
    G.fillStyle = mix('#C9CDD3', '#E5484D', 0.85 * hc); G.fillRect(x0, -R, x1 - x0, 2 * R);
    /* the jelly roll: anode, separator, cathode, separator, wound round the core: seen side on, a stack of stripes */
    const cols = ['#B87333', '#E6E6E8', '#3A3B40', '#E6E6E8'];
    for (let y = -R + wall, i = 0; y < R - wall; y += 0.32, i++) { G.fillStyle = cols[i % 4]; G.fillRect(x0, y, x1 - x0, 0.33); }
    G.fillStyle = 'rgba(0,0,0,0.35)'; G.fillRect(x0, -0.5, x1 - x0, 1.0);            /* the hollow core */
    G.restore();
    G.strokeStyle = mix(TH ? '#111111' : '#F3F3F5', '#E5484D', hc); G.lineWidth = lw(1.4); G.strokeRect(x0, -R, x1 - x0, 2 * R);
    out.can = SP((x0 + x1) / 2, -R + wall / 2); out.roll = SP((x0 + x1) / 2, 0.9);
  }
  out.button = SP(hl + 0.9, 0); out.top = SP(0, -R); out.end = SP(-hl, 0);
  return out;
}

/** the Li-po pouch in cabinet oblique (its top face foreshortened up and to the right), sized from the battery twin:
   foil laminate with its sealed edges, a printed label, the protection board under amber tape at one end, three wires
   (VBAT, NTC, GND) to a JST plug. Origin: the middle of its front-bottom edge. o = { cut (0..1: the foil peels back from
   the front corner showing the stacked layers), hiFoil (0..1), plug (true), k (oblique depth factor, 0.42) }. Returns
   { top, front, foil, pcm, plug } */
function b10_pouchMM(o = {}) {
  const D = b10_pouchDims(), Lx = D.l, Wz = D.w, T = D.th, k = o.k || 0.42, ca = Math.cos(0.62) * k, sa = Math.sin(0.62) * k;
  const P = (x, z, y) => [x + z * ca, -y - z * sa];          /* x along the pouch, z back into the page, y up */
  const out = {}, hx = Lx / 2, cut = o.cut || 0, hf = o.hiFoil || 0;
  const quad = (a, b, c, d, fill, edge, w) => { G.beginPath(); G.moveTo(...a); G.lineTo(...b); G.lineTo(...c); G.lineTo(...d); G.closePath(); if (fill) { G.fillStyle = fill; G.fill(); } if (edge) { G.strokeStyle = edge; G.lineWidth = lw(w || 1.1); G.lineJoin = 'round'; G.stroke(); } };
  const ink = edgeCol(MT.steel, 0.55), foil0 = mix('#D9DCE1', '#E5484D', 0.6 * hf), foil1 = mix('#AEB3BA', '#E5484D', 0.6 * hf);
  /* the right end (seen side on), the front face, then the top face */
  quad(P(hx, 0, 0), P(hx, Wz, 0), P(hx, Wz, T), P(hx, 0, T), foil1, ink);
  const gF = G.createLinearGradient(0, P(0, 0, T)[1], 0, P(0, 0, 0)[1]); gF.addColorStop(0, foil0); gF.addColorStop(1, foil1);
  quad(P(-hx, 0, 0), P(hx, 0, 0), P(hx, 0, T), P(-hx, 0, T), gF, ink);
  const gT = G.createLinearGradient(...P(-hx, 0, T), ...P(hx, Wz, T)); gT.addColorStop(0, '#EEF0F3'); gT.addColorStop(0.5, foil0); gT.addColorStop(1, '#C4C8CE');
  quad(P(-hx, 0, T), P(hx, 0, T), P(hx, Wz, T), P(-hx, Wz, T), gT, ink);
  /* the sealed edges, a fold line inset along the long sides, and the label */
  G.save(); G.globalAlpha *= 0.55; quad(P(-hx + 0.8, 0.8, T), P(hx - 0.8, 0.8, T), P(hx - 0.8, Wz - 0.8, T), P(-hx + 0.8, Wz - 0.8, T), null, ink, 0.8); G.restore();
  quad(P(-hx + 5, 3.5, T), P(hx - 7, 3.5, T), P(hx - 7, Wz - 3.5, T), P(-hx + 5, Wz - 3.5, T), TH ? '#F4F4F6' : '#E8E8EB', 'rgba(0,0,0,0.25)', 0.8);
  /* the label's printing as three quiet rules (the words go in a callout: oblique type reads badly at this size) */
  for (const [z, l] of [[Wz * 0.62, 0.62], [Wz * 0.5, 0.45], [Wz * 0.38, 0.55]]) { G.beginPath(); G.moveTo(...P(-hx + 7, z, T)); G.lineTo(...P(-hx + 7 + (Lx - 16) * l, z, T)); G.strokeStyle = 'rgba(20,20,22,0.35)'; G.lineWidth = lw(1.4); G.stroke(); }
  /* the protection board at the left end under amber tape, and its three wires to the plug */
  const pz0 = 2.5, pz1 = Wz - 2.5, px0 = -hx - D.pcm - 0.4, px1 = -hx - 0.2, ty = T * 0.55;
  quad(P(px0, pz0, ty - 0.6), P(px1, pz0, ty - 0.6), P(px1, pz1, ty - 0.6), P(px0, pz1, ty - 0.6), '#1F5C35', 'rgba(0,0,0,0.4)', 0.8);
  quad(P(px0, pz0, ty), P(px1, pz0, ty), P(px1, pz1, ty), P(px0, pz1, ty), 'rgba(214,150,40,0.82)', 'rgba(120,70,0,0.55)', 0.8);
  out.pcm = SP(...P((px0 + px1) / 2, Wz / 2, ty));
  if (o.plug !== false) {
    /* three wires (VBAT red, NTC white, GND black) curl back over the pouch's top to the JST plug resting on it */
    const cols = ['#C8463D', '#EFEFF1', '#26272B'], ends = [], back = o.plug === 'back';
    cols.forEach((c, i) => {
      const z = Wz / 2 - 2 + i * 2, a = P(px0, z, ty - 0.2);
      const b = back ? P(px0 - 5, z + 1, T + 0.6) : P(px0 - 9, z + 3, ty - 0.2), cpt = back ? P(-hx + 9 + i * 0.4, Wz * 0.78 - i * 1.6, T + 0.4) : P(px0 - 16, z * 0.4 + 6, ty - 0.2);
      G.beginPath(); G.moveTo(...a); G.bezierCurveTo(b[0], b[1], cpt[0] - 3, cpt[1], cpt[0], cpt[1]); G.strokeStyle = c; G.lineWidth = lw(2.4); G.lineCap = 'round'; G.stroke();
      ends.push(cpt);
    });
    const pc = ends[1], pw = 5.5, ph = 3.2;
    solid(() => pathRR(pc[0] - (back ? 0 : pw * 0.9), pc[1] - ph / 2, pw, ph, 0.5), MT.white, [pc[0] - pw, pc[1] - ph / 2, pw, ph], { lw: 0.9 });
    out.plug = [pc[0] + (back ? pw * 0.5 : -pw * 0.4), pc[1]];
  }
  /* the cut: the foil peels from the front corner, the stacked layers under it */
  if (cut > 0.003) {
    const xc = lerp(hx, hx - 14, E.out3(cut)), y0 = 0, y1 = T, cols = ['#B87333', '#E6E6E8', '#3A3B40', '#E6E6E8'];
    G.save(); G.beginPath(); const a = P(xc, 0, 0), b = P(hx, 0, 0), c = P(hx, 0, T), d = P(xc, 0, T); G.moveTo(...a); G.lineTo(...b); G.lineTo(...c); G.lineTo(...d); G.closePath(); G.clip();
    for (let y = y0, i = 0; y < y1; y += 0.3, i++) { const p0 = P(xc, 0, y), p1 = P(hx, 0, y); G.fillStyle = cols[i % 4]; G.fillRect(p0[0], p0[1] - lw(1.1) * 0 - 0.3, p1[0] - p0[0], 0.31); }
    G.restore();
    G.strokeStyle = mix('#8E939B', '#E5484D', hf); G.lineWidth = lw(1.6); G.beginPath(); G.moveTo(...P(xc, 0, 0)); G.lineTo(...P(xc, 0, T)); G.stroke();
    out.foil = SP(...P((xc + hx) / 2, 0, T));
  }
  out.top = SP(...P(0, Wz / 2, T)); out.front = SP(...P(0, 0, T / 2)); out.left = SP(...P(-hx, 0, 0)); out.right = SP(...P(hx, Wz, 0));
  out.base = [SP(...P(-hx, 0, 0)), SP(...P(hx, 0, 0))];
  return out;
}

/** an equal-arm balance, the classroom one, in stage px: a foot, a pillar, the knife edge, the beam turned by theta (rad,
   + tips the right pan down), a pointer over a scale, and two pans hanging plumb on three cords each. (x, y) = the pivot;
   L = half the beam. o = { a, scale (true), tick (px per gram on the scale's arc, with the reading's unit), mark (a
   reading to set on the scale: text) }. Returns { left: [x, y] of the left pan's top centre, right, pivot } */
function b10_balance(x, y, L, theta, o = {}) {
  const a = o.a == null ? 1 : o.a; if (a <= 0.003) return {};
  const ink = TH ? '#2E2E30' : '#CECED2', metal = TH ? ['#E5E5E8', '#B8B8BC'] : ['#5C5D60', '#3A3B3F'], cs = Math.cos(theta), sn = Math.sin(theta);
  const end = s => [x + s * L * cs, y + s * L * sn];
  G.save(); G.globalAlpha *= a;
  /* foot and pillar */
  const fy = y + L * 1.05;
  const g1 = G.createLinearGradient(x - 40, 0, x + 40, 0); g1.addColorStop(0, metal[1]); g1.addColorStop(0.5, metal[0]); g1.addColorStop(1, metal[1]);
  G.fillStyle = g1; rrPath(x - 13, y + 8, 26, fy - y - 20, 4); G.fill();
  G.beginPath(); G.moveTo(x - 150, fy); G.lineTo(x + 150, fy); G.lineTo(x + 120, fy - 22); G.lineTo(x - 120, fy - 22); G.closePath(); G.fillStyle = g1; G.fill();
  G.strokeStyle = rgba(ink, 0.6); G.lineWidth = 1.5; G.stroke();
  /* the scale under the pointer */
  const sr = L * 0.55, arc = 0.32;
  if (o.scale !== false) {
    G.strokeStyle = rgba(ink, 0.7); G.lineWidth = 2; G.beginPath(); G.arc(x, y, sr, Math.PI / 2 - arc, Math.PI / 2 + arc); G.stroke();
    for (let i = -6; i <= 6; i++) { const ang = Math.PI / 2 + i * arc / 6, r0 = sr - (i % 3 ? 8 : 16); G.beginPath(); G.moveTo(x + Math.cos(ang) * r0, y + Math.sin(ang) * r0); G.lineTo(x + Math.cos(ang) * sr, y + Math.sin(ang) * sr); G.lineWidth = i ? 1.5 : 3; G.stroke(); }
  }
  /* the beam: tapered, the pointer down from the pivot */
  G.save(); G.translate(x, y); G.rotate(theta);
  const gb = G.createLinearGradient(0, -10, 0, 10); gb.addColorStop(0, metal[0]); gb.addColorStop(1, metal[1]);
  G.beginPath(); G.moveTo(-L, -3); G.quadraticCurveTo(0, -16, L, -3); G.lineTo(L, 4); G.quadraticCurveTo(0, 10, -L, 4); G.closePath(); G.fillStyle = gb; G.fill(); G.strokeStyle = rgba(ink, 0.7); G.lineWidth = 1.5; G.stroke();
  G.beginPath(); G.moveTo(-3, 6); G.lineTo(0, sr - 4); G.lineTo(3, 6); G.closePath(); G.fillStyle = TH ? '#111' : '#F3F3F5'; G.fill();
  for (const s of [-1, 1]) { G.beginPath(); G.arc(s * L, 0, 6, 0, TAU); G.fillStyle = metal[0]; G.fill(); G.stroke(); }
  G.restore();
  /* the knife edge */
  G.beginPath(); G.moveTo(x - 10, y + 10); G.lineTo(x, y - 4); G.lineTo(x + 10, y + 10); G.closePath(); G.fillStyle = TH ? '#111' : '#F3F3F5'; G.fill();
  /* the pans: cords from the beam's ends, the dish below, hanging plumb */
  const pans = {};
  for (const s of [-1, 1]) {
    const e = end(s), drop = L * 0.62, py = e[1] + drop, pw = L * 0.5;
    G.strokeStyle = rgba(ink, 0.75); G.lineWidth = 1.5;
    for (const dx of [-pw * 0.42, 0, pw * 0.42]) { G.beginPath(); G.moveTo(e[0], e[1] + 6); G.lineTo(e[0] + dx, py - 6); G.stroke(); }
    const gp = G.createLinearGradient(0, py - 8, 0, py + 10); gp.addColorStop(0, metal[0]); gp.addColorStop(1, metal[1]);
    G.beginPath(); G.moveTo(e[0] - pw / 2, py - 6); G.quadraticCurveTo(e[0], py + 22, e[0] + pw / 2, py - 6); G.closePath(); G.fillStyle = gp; G.fill(); G.strokeStyle = rgba(ink, 0.7); G.stroke();
    pans[s < 0 ? 'left' : 'right'] = [e[0], py - 6];
  }
  G.restore();
  return Object.assign(pans, { pivot: [x, y], needle: [x + Math.cos(Math.PI / 2 - theta) * sr, y + Math.sin(Math.PI / 2 - theta) * sr] });
}

/** small IC packages from above, mm, centred: 'sot5' / 'sot6' (2.9 × 1.6 mm body, gull-wing leads), 'dfn' (2 × 2),
   'qfn' (o.w, default 5), 'ind' (2.0 × 1.6 mm shielded inductor), 'cap' / 'res' (0402: 1.0 × 0.5). o = { hi (a colour),
   label (silk name beside it, mm size 0.9) } */
function b10_pkgMM(kind, o = {}) {
  const lead = '#C9CDD3', body = o.hi ? o.hi : null;
  if (kind === 'sot5' || kind === 'sot6') {
    const n = kind === 'sot5' ? [3, 2] : [3, 3];
    for (let side = 0; side < 2; side++) for (let i = 0; i < n[side]; i++) {
      const x = n[side] === 3 ? -0.95 + i * 0.95 : (i ? 0.95 : -0.95), y = side ? 0.8 : -1.4;
      solid(() => { G.beginPath(); G.rect(x - 0.2, y, 0.4, 0.6); }, MT.tin, [x - 0.2, y, 0.4, 0.6], { lw: 0.5, ea: 0.4 });
    }
    solid(() => pathRR(-1.45, -0.8, 2.9, 1.6, 0.12), body ? { g: [body, body] } : MT.epoxy, [-1.45, -0.8, 2.9, 1.6], { lw: 0.8 });
    G.beginPath(); G.arc(-1.05, 0.42, 0.13, 0, TAU); G.fillStyle = 'rgba(255,255,255,0.35)'; G.fill();
  } else if (kind === 'dfn') {
    for (let i = 0; i < 4; i++) for (const sx of [-1, 1]) solid(() => { G.beginPath(); G.rect(sx * 0.85 - 0.15, -0.75 + i * 0.5 - 0.12, 0.3, 0.24); }, MT.tin, [sx - 0.15, -0.9, 0.3, 1.8], { lw: 0.4, ea: 0.3 });
    solid(() => pathRR(-1, -1, 2, 2, 0.1), body ? { g: [body, body] } : MT.epoxy, [-1, -1, 2, 2], { lw: 0.8 });
  } else if (kind === 'qfn') {
    return chipMM({ w: o.w || 5, hi: !!o.hi, label: o.label });
  } else if (kind === 'ind') {
    solid(() => pathRR(-1.0, -0.8, 2.0, 1.6, 0.15), { g: ['#3A3B40', '#232428'], dark: 1 }, [-1, -0.8, 2, 1.6], { lw: 0.8 });
    for (const sx of [-1, 1]) solid(() => { G.beginPath(); G.rect(sx > 0 ? 0.62 : -1.0, -0.8, 0.38, 1.6); }, MT.tin, [-1, -0.8, 2, 1.6], { lw: 0.5, ea: 0.4 });
    G.beginPath(); G.arc(0, 0, 0.42, 0, TAU); G.strokeStyle = 'rgba(255,255,255,0.18)'; G.lineWidth = lw(1); G.stroke();
  } else {
    const r = kind === 'res', c = r ? '#26272B' : '#B49A6E';
    solid(() => { G.beginPath(); G.rect(-0.5, -0.25, 1.0, 0.5); }, { g: [c, c] }, [-0.5, -0.25, 1, 0.5], { lw: 0.5 });
    for (const sx of [-1, 1]) solid(() => { G.beginPath(); G.rect(sx > 0 ? 0.32 : -0.5, -0.25, 0.18, 0.5); }, MT.tin, [-0.5, -0.25, 1, 0.5], { lw: 0.4, ea: 0.3 });
  }
  return {};
}

/* ============================================================================================ the reflow oven, side on
   A conveyor oven cut open lengthwise: heater banks above and below the board's path, glowing with their zone's heat, and
   the edge rails that carry the board (its underside hangs free between them). The temperature along it, on a chart over
   the oven, with solder's 217 °C liquidus. In stage px. */
/** the oven as a tracking shot: the camera rides with the boards, so the tunnel's heater banks scroll past while the boards
   stay at the window's centre. box = [x, y, w, h] the window; fb = where the boards are along the oven (0 the mouth, 1 the
   exit; beyond either end the tunnel ends); Lp = the oven's length in px at this scale. o = { a, rows: [y, ...] (heater
   rows), rails: [y, ...] (the edge rails the boards ride on), trays: [y, ...] (what a falling part lands on) }.
   Returns { cx (the boards' x), FX: f → px } */
function b10_ovenWin(t, box, fb, Lp, o = {}) {
  const [x, y, w, h] = box, a = o.a == null ? 1 : o.a, cx = x + w / 2, FX = f => cx + (f - fb) * Lp, out = { cx, FX };
  if (a <= 0.003) return out;
  const rows = o.rows || [y + 40, y + h - 40], rails = o.rails || [y + h / 2], trays = o.trays || [];
  G.save(); G.globalAlpha *= a; G.beginPath(); G.rect(x, y, w, h); G.clip();
  /* the tunnel's walls between its mouth and its exit */
  const xa = Math.max(x, FX(0)), xb = Math.min(x + w, FX(1));
  if (xb > xa) {
    G.fillStyle = TH ? '#DCDCE0' : '#141518'; G.fillRect(xa, y, xb - xa, h);
    G.fillStyle = TH ? '#C8C8CC' : '#1D1E22'; G.fillRect(xa, y, xb - xa, 12); G.fillRect(xa, y + h - 12, xb - xa, 12);
    for (const ex of [FX(0), FX(1)]) if (ex > x - 20 && ex < x + w + 20) { G.fillStyle = TH ? '#B8B8BC' : '#2A2B30'; G.fillRect(ex - 9, y, 18, h); }
  }
  /* heater rods in rows, glowing with their zone's heat; fans in the cooling zone */
  const step = 118 / Lp;
  for (let f = 0.02; f < 1; f += step) {
    const px = FX(f); if (px < x - 60 || px > x + w + 60) continue;
    const T = b10_profile(f), k = clamp((T - 60) / 185), cool = f > 0.72;
    for (const ry of rows) {
      if (cool) { circle(px, ry, 15, { color: inkA(0.3), w: 1.5 }); for (let j = 0; j < 3; j++) { const an = j * TAU / 3 + 0.4; line(px, ry, px + Math.cos(an) * 13, ry + Math.sin(an) * 13, { color: inkA(0.3), w: 2 }); } continue; }
      glow(px, ry, 30 + 24 * k, k > 0.85 ? '#FF6A3D' : '#FF9F43', 0.1 + 0.42 * k);
      rr(px - 32, ry - 5, 64, 10, 5, mix(TH ? '#A8A8AC' : '#3A3B40', k > 0.85 ? '#FF6A3D' : '#FFAA55', k), null, 1, 1);
    }
  }
  /* trays under each lane: what a falling part lands on */
  if (xb > xa) for (const ty of trays) { G.fillStyle = TH ? 'rgba(17,17,17,0.08)' : 'rgba(243,243,245,0.06)'; G.fillRect(xa, ty, xb - xa, 5); line(xa, ty, xb, ty, { color: inkA(0.3), w: 1.5 }); }
  /* the edge rails that carry the boards: their chain links scroll with the oven */
  const off = ((-fb * Lp) % 24 + 24) % 24;
  for (const ry of rails) {
    line(x, ry, x + w, ry, { color: TH ? '#8A8A8F' : '#5C5C60', w: 3 });
    for (let px = x - 24 + off; px < x + w + 24; px += 24) circle(px, ry + 3, 3, { fill: TH ? '#8A8A8F' : '#5C5C60' });
  }
  G.restore();
  return out;
}

/** the oven's temperature along its length, a chart in [x, x + w] × [y, y + h]: the profile, solder's 217 °C liquidus
   (dashed, its key above the chart), the liquid time shaded, the zones named under the axis, and the board's thermocouple
   as a dot at fb (with its reading). o = { a, pass (a label on the dot: 'Pass 2') }. Returns { X(f), Y(T) } */
function b10_profileChart(t, x, y, w, h, fb, o = {}) {
  const a = o.a == null ? 1 : o.a, X = f => x + w * f, Y = T => y + h - h * (T - 20) / 240;
  if (a <= 0.003) return { X, Y };
  G.save(); G.globalAlpha *= a;
  line(X(0), Y(20), X(1), Y(20), { color: C.faint, w: 1.5 });
  for (const T of [100, 200]) { line(X(0), Y(T), X(1), Y(T), { color: C.hair, w: 1.2 }); text(T + ' °C', X(0) - 14, Y(T) + 7, { role: 'tick', color: C.mute, align: 'right' }); }
  const pts = []; for (let i = 0; i <= 160; i++) { const f = i / 160; pts.push([X(f), Y(b10_profile(f))]); }
  G.save(); G.beginPath(); pts.forEach((p, i) => i ? G.lineTo(p[0], Math.min(p[1], Y(B10_LIQ))) : G.moveTo(p[0], Math.min(p[1], Y(B10_LIQ)))); G.lineTo(X(1), Y(B10_LIQ)); G.lineTo(X(0), Y(B10_LIQ)); G.closePath(); G.fillStyle = 'rgba(255,138,61,0.24)'; G.fill(); G.restore();
  poly(pts, { color: '#FF8A3D', w: 3.5 });
  line(X(0), Y(B10_LIQ), X(1), Y(B10_LIQ), { color: C.ink2, w: 1.6, dash: [8, 6] });
  /* the key, above the chart where the dot's reading never reaches */
  line(X(0), y - 25, X(0) + 30, y - 25, { color: C.ink2, w: 1.6, dash: [8, 6] });
  text('Solder melts above 217 °C', X(0) + 42, y - 18, { role: 'label', size: 19, color: C.ink2 });
  /* the zones, under the axis, with quiet ticks at their borders */
  for (const f of [0.22, 0.48, 0.72]) line(X(f), Y(20) - 6, X(f), Y(20) + 6, { color: C.faint, w: 1.5 });
  [[0.11, 'Preheat'], [0.35, 'Soak'], [0.6, 'Reflow'], [0.86, 'Cool']].forEach(([f, l]) => text(l, X(f), Y(20) + 27, { role: 'label', size: 19, color: C.mute, align: 'center' }));
  if (fb >= 0 && fb <= 1) {
    const T = b10_profile(fb), px = X(fb), py = Y(T);
    line(px, py, px, Y(20), { color: '#FF8A3D', w: 1.5, dash: [4, 4], alpha: 0.7 });
    circle(px, py, 9, { fill: '#FF8A3D' });
    rich([{ s: Math.round(T) + ' °C', role: 'num', size: 24, color: C.ink }, o.pass ? { s: o.pass, role: 'label', size: 20, color: C.mute, gap: 12 } : null], px + 16, py - 14, {});
  }
  G.restore();
  return { X, Y };
}

/** a board side on, in mm, for part(): an FR4 slab o.th thick (default 1.0 mm, a rival's own; Theseus's passes BOARD_T,
   0.6 mm since F47.4) with black mask both faces and copper just inside each face, from x 0 to L, centred on y 0, with
   parts on its two faces. Each part: { x (its left), w, h, kind ('qfn' | 'mod' | 'usb' | 'sw' | 'pas' | 'jst'), side
   ('a' or 'b': the face it is soldered to; face a is up when flip = 0), g (grams), pad (mm² of solder pad) }.
   o = { flip (0..1: turned over about its long axis; 1 = face b up), show: { a, b } (0..1: placed and visible), paste:
   { a, b } (1: that face's joints are still paste, never melted), melt (0..1: every joint on the board is liquid now: the
   whole board is above 217 °C), sag (mm: how far a liquid joint lets a hanging part sink; each part sinks by sag ×
   its own weight-to-pad ratio over 30 g/in²) }. A hanging part is one on the face that points down.
   Returns { parts: stage centre of each part } */
function b10_boardSideMM(L, parts, o = {}) {
  const flip = o.flip || 0, sy = Math.cos(Math.PI * flip), out = { parts: [] }, show = o.show || { a: 1, b: 1 }, paste = o.paste || {};
  const th = o.th || 1.0, hf = th / 2;
  xsave(); G.scale(1, sy); XF.m[2] *= sy; XF.m[3] *= sy;
  /* the slab: glass-fibre core, a copper layer just inside each face, black mask */
  solid(() => { G.beginPath(); G.rect(0, -hf, L, th); }, { g: ['#1C1D21', '#121316'], dark: 1 }, [0, -hf, L, th], { lw: 0.8 });
  G.fillStyle = 'rgba(214,170,92,0.5)'; G.fillRect(0, -hf + 0.06, L, 0.07); G.fillRect(0, hf - 0.13, L, 0.07);
  parts.forEach((p, i) => {
    const vis = show[p.side] == null ? 1 : show[p.side]; if (vis <= 0.003) { out.parts[i] = null; return; }
    const onA = p.side === 'a', dir = onA ? -1 : 1, face = onA ? -hf : hf;     /* in the board's frame face a is y < 0 */
    const hanging = onA ? sy < 0 : sy > 0, liquid = (o.melt || 0) > 0.5, pasteK = paste[p.side] ? 1 : 0;
    const ratio = p.g / Math.max(0.01, p.pad) * 645.16;                         /* g per square inch of pad */
    const dy = hanging && liquid ? (o.sag || 0) * clamp(ratio / 30, 0.05, 1.6) : 0;
    G.save(); G.globalAlpha *= vis;
    /* the joints: two fillets per part; matte grey paste, bright once melted; stretched to necks while a part hangs liquid */
    const jy0 = face, jy1 = face + dir * (0.12 + dy);
    const jcol = pasteK && !liquid ? '#8E9299' : liquid ? '#F2F4F6' : '#C9CDD3';
    for (const fx of [p.x + 0.1 * p.w, p.x + 0.9 * p.w]) {
      /* a hanging part's liquid joint stretches into a liquid bridge that thins as the part sinks: wide on the pad, pinched
         in the middle, wide again on the part's end (an hourglass) */
      const nw = hanging && liquid ? clamp(0.3 - dy * 0.3, 0.07, 0.3) : 0.32, jm = (jy0 + jy1) / 2;
      G.beginPath(); G.moveTo(fx - 0.45, jy0); G.bezierCurveTo(fx - 0.45, jy0 + dir * 0.08, fx - nw, jm - dir * (jy1 - jy0) * 0.2, fx - nw, jm);
      G.bezierCurveTo(fx - nw, jm + dir * Math.abs(jy1 - jy0) * 0.2, fx - 0.38, jy1 - dir * 0.06, fx - 0.38, jy1); G.lineTo(fx + 0.38, jy1);
      G.bezierCurveTo(fx + 0.38, jy1 - dir * 0.06, fx + nw, jm + dir * Math.abs(jy1 - jy0) * 0.2, fx + nw, jm); G.bezierCurveTo(fx + nw, jm - dir * (jy1 - jy0) * 0.2, fx + 0.45, jy0 + dir * 0.08, fx + 0.45, jy0); G.closePath();
      G.fillStyle = jcol; G.fill(); G.strokeStyle = 'rgba(0,0,0,0.35)'; G.lineWidth = lw(0.6); G.stroke();
      if (pasteK && !liquid) { G.fillStyle = 'rgba(0,0,0,0.3)'; for (let k = 0; k < 4; k++) G.fillRect(fx - 0.32 + k * 0.18, jy0 + dir * 0.06, 0.05, 0.05); }
    }
    xsave(); xmove(0, dir * dy);
    const y0 = face + dir * 0.12, yA = Math.min(y0, y0 + dir * p.h);
    const body = p.kind === 'usb' ? MT.steel : p.kind === 'mod' ? { g: ['#C3C7CD', '#8C9198'] } : p.kind === 'pas' ? { g: ['#B49A6E', '#8E7A55'] } : p.kind === 'jst' ? MT.white : p.kind === 'sw' ? { g: ['#2B2C31', '#1A1B1E'], dark: 1 } : MT.epoxy;
    solid(() => pathRR(p.x, yA, p.w, p.h, Math.min(0.25, p.h / 3)), body, [p.x, yA, p.w, p.h], { lw: 0.8 });
    if (p.kind === 'usb') { G.fillStyle = 'rgba(0,0,0,0.5)'; G.fillRect(p.x + p.w * 0.04, yA + p.h * 0.32, p.w * 0.9, p.h * 0.36); }
    if (p.kind === 'mod') { G.fillStyle = '#16171B'; G.fillRect(p.x, onA ? yA + p.h - 0.55 : yA, p.w, 0.55); }
    out.parts[i] = SP(p.x + p.w / 2, yA + p.h / 2);
    xrest(); G.restore();
  });
  xrest();
  return out;
}

/** the board slice the oven carries: the same parts in both builds. A two-sided build (the rival, as the Cougar Revenger
   Pro 4K: the Type-C, the switches and passives on the face reflowed first) and Theseus's (every part on face a). Masses
   and pad areas are estimates (the board model's table: the receptacle 0.40 g on about 6.5 mm² of SMD pad, so about
   40 g/in², over Liu's 30; every other part is far under). x along the slice, mm */
const B10_SLICE = {
  L: 44,
  parts: [
    { id: 'usb', x: 34.4, w: 8.9, h: 3.2, kind: 'usb', g: 0.40, pad: 6.5, rival: 'b' },
    { id: 'c1', x: 11.2, w: 1.0, h: 0.5, kind: 'pas', g: 0.001, pad: 0.5, rival: 'b' },
    { id: 'sw', x: 13.4, w: 4.6, h: 1.4, kind: 'sw', g: 0.06, pad: 2.8, rival: 'b' },
    { id: 'c2', x: 19.4, w: 1.0, h: 0.5, kind: 'pas', g: 0.001, pad: 0.5, rival: 'b' },
    { id: 'tact', x: 22.0, w: 3.5, h: 1.65, kind: 'sw', g: 0.04, pad: 2.4, rival: 'b' },
    { id: 'pmic', x: 12.6, w: 5.0, h: 0.85, kind: 'qfn', g: 0.06, pad: 13, rival: 'a' },
    { id: 'l1', x: 18.8, w: 2.0, h: 1.0, kind: 'qfn', g: 0.012, pad: 1.6, rival: 'a' },
    { id: 'c3', x: 21.8, w: 1.0, h: 0.5, kind: 'pas', g: 0.001, pad: 0.5, rival: 'a' },
    { id: 'mod', x: 26.6, w: 9.9, h: 2.0, kind: 'mod', g: 0.45, pad: 14, rival: 'a' },
    { id: 'c4', x: 37.6, w: 1.0, h: 0.5, kind: 'pas', g: 0.001, pad: 0.5, rival: 'a' },
    { id: 'jst', x: 39.4, w: 4.0, h: 2.95, kind: 'jst', g: 0.05, pad: 7, rival: 'a' }
  ]
};
B10_SLICE.parts.forEach(p => { p.ratio = p.g / p.pad * 645.16; });
/* Theseus puts every part on face a; its Type-C, switches and passives move to the same face (x shifted to fit) */
B10_SLICE.ths = B10_SLICE.parts.map(p => Object.assign({}, p, { side: 'a', x: { usb: 1.0, c1: 10.6, sw: 13.4, c2: 19.4, tact: 22.0, pmic: 12.6, l1: 18.8, c3: 21.8, mod: 26.6, c4: 37.6, jst: 39.4 }[p.id] }));
/* on Theseus's single face, the parts that shared x on the rival's two faces are re-spaced along the slice */
(() => { const order = ['jst', 'c4', 'mod', 'c3', 'pmic', 'l1', 'c1', 'sw', 'c2', 'tact', 'usb']; let x = 0.8; order.forEach(id => { const p = B10_SLICE.ths.find(q => q.id === id); p.x = x; x += p.w + (p.kind === 'pas' ? 0.9 : 1.3); }); B10_SLICE.thsL = x + 0.4; })();
B10_SLICE.rival = B10_SLICE.parts.map(p => Object.assign({}, p, { side: p.rival }));

/** where the boards are along the oven at the scene's time u (s): a speed ramp, quick through preheat and soak, slow
   through the reflow zone where the joints are liquid, easing to a stop in the cooling zone. f0 the start */
function b10_fb(u, f0 = 0.24) {
  return u < 0.9 ? lerp(f0, 0.5, E.io3(clamp(u / 0.9)) * 0.85 + 0.15 * clamp(u / 0.9)) : u < 2.8 ? lerp(0.5, 0.71, (u - 0.9) / 1.9) : lerp(0.71, 0.76, E.out3(clamp((u - 2.8) / 0.6)));
}
/* when the boards' joints go liquid and freeze again (the board lags the oven's air by 0.015 of its length), found once */
const B10_OV = (() => { let uMelt = null, uFreeze = null; for (let u = 0; u < 4; u += 0.005) { const liq = b10_profile(b10_fb(u) - 0.015) > B10_LIQ; if (liq && uMelt == null) uMelt = u; if (!liq && uMelt != null && uFreeze == null) uFreeze = u; } return { uMelt, uFreeze, sag: 0.3 }; })();
/** the state of one board on its lane at the scene's time u: mode 'rival' (pass 2 of 2: face b, reflowed first, hangs under
   the board; once the board is over 217 °C every joint is liquid and the hanging parts sink on their liquid joints, each by
   its weight-to-pad ratio, and stay sunk when the solder freezes) or 'ths' (pass 1 of 1: every part on top).
   Returns { parts, L, di (the receptacle's index), sag, liquid, T, th (the board's thickness: the rival's own 1.0 mm,
   Theseus's BOARD_T), st (b10_boardSideMM's options) } */
function b10_rideState(u, mode, fb) {
  const rival = mode === 'rival', T = b10_profile(fb - 0.015), liquid = T > B10_LIQ;
  const parts = rival ? B10_SLICE.rival : B10_SLICE.ths, L = rival ? B10_SLICE.L : B10_SLICE.thsL;
  const sag = rival ? B10_OV.sag * ep(u, B10_OV.uMelt, B10_OV.uMelt + 0.6, E.out3) : 0;
  const di = parts.findIndex(p => p.id === 'usb');
  const th = rival ? 1.0 : BOARD_T;
  const st = { flip: 0, show: { a: 1, b: 1 }, paste: { a: !liquid && u < B10_OV.uMelt ? 1 : 0, b: 0 }, melt: liquid ? 1 : 0, sag, th };
  return { parts, L, di, sag, liquid, T, th, st };
}
/** one board riding a lane of the oven, centred in its window. W: the oven (b10_ovenWin's return), rail (y), s px per mm.
   Returns the state (b10_rideState) and { bx, by, s, partPt (the receptacle's centre), partTop, under (a point under the
   board's middle) } */
function b10_boardRide(t, u, W, rail, s, mode, fb, o = {}) {
  const R = b10_rideState(u, mode, fb), bx = W.cx - R.L * s / 2, by = rail;
  const D = part(bx, by, s, () => b10_boardSideMM(R.L, R.parts, R.st), { alpha: o.a });
  const p = R.parts[R.di], partPt = D.parts && D.parts[R.di] ? D.parts[R.di] : [bx + (p.x + p.w / 2) * s, by];
  const partTop = [partPt[0], partPt[1] - p.h * s / 2], under = [bx + R.L * s * 0.5, by + R.th / 2 * s];
  return Object.assign(R, { bx, by, s, partPt, partTop, under, part: p });
}

/** the receptacle's joint, close up: the ride's board redrawn at sz px per mm with the first joint of the receptacle at the
   centre of rect, clipped to it (the classroom panel's second picture). ride: b10_boardRide's return */
function b10_neckZoom(rect, ride, sz, o = {}) {
  const [x, y, w, h] = rect, a = o.a == null ? 1 : o.a; if (a <= 0.003 || !ride) return;
  const p = ride.parts[ride.di], fx = p.x + 0.1 * p.w, fy = (ride.th || 1.0) / 2 + 0.12 + Math.min(1.6, ride.sag * clamp(p.ratio / 30, 0.05, 1.6)) * 0.5 + 0.25;
  G.save(); G.globalAlpha *= a; rrPath(x, y, w, h, 6); G.clip();
  G.fillStyle = TH ? '#DCDCE0' : '#141518'; G.fillRect(x, y, w, h);
  part(x + w / 2 - fx * sz, y + h / 2 - fy * sz, sz, () => b10_boardSideMM(ride.L, ride.parts, ride.st));
  G.restore();
  rr(x, y, w, h, 6, null, inkA(0.3), 1.5, a);
}

/** a drop growing at a dropper's tip until its weight beats the surface tension round the tip, then falling: the
   drop-weight lab (2πrγ = mg). In stage px: (x, y) the tip, r the tip's radius. k: 0..1 of the drop's growth to the break;
   fall (px it has fallen since). o = { a, col } */
function b10_pendant(x, y, r, k, fall, o = {}) {
  const a = o.a == null ? 1 : o.a; if (a <= 0.003) return;
  const col = o.col || 'rgba(120,190,255,0.85)';
  G.save(); G.globalAlpha *= a;
  /* the glass tube */
  const gt = G.createLinearGradient(x - r - 8, 0, x + r + 8, 0); gt.addColorStop(0, 'rgba(200,215,225,0.5)'); gt.addColorStop(0.5, 'rgba(240,248,252,0.25)'); gt.addColorStop(1, 'rgba(200,215,225,0.5)');
  G.fillStyle = gt; G.fillRect(x - r - 6, y - 150, 2 * r + 12, 150);
  G.strokeStyle = inkA(0.45); G.lineWidth = 1.5; G.strokeRect(x - r - 6, y - 150, 2 * r + 12, 150);
  G.fillStyle = col; G.fillRect(x - r, y - 150, 2 * r, 150);
  if (fall <= 0) {
    /* the hanging drop: a neck from the tip's rim to a sphere that grows and stretches */
    const R = r * (0.9 + 1.25 * Math.pow(k, 0.7)), cy = y + R * (0.75 + 0.55 * k), neck = r * (1 - 0.55 * k * k);
    G.beginPath(); G.moveTo(x - r, y); G.bezierCurveTo(x - neck, y + (cy - y) * 0.4, x - R, cy - R * 0.6, x - R, cy);
    G.arc(x, cy, R, Math.PI, 0, true); G.bezierCurveTo(x + R, cy - R * 0.6, x + neck, y + (cy - y) * 0.4, x + r, y); G.closePath();
    G.fillStyle = col; G.fill(); G.strokeStyle = 'rgba(70,130,190,0.8)'; G.lineWidth = 1.5; G.stroke();
    G.beginPath(); G.arc(x - R * 0.35, cy - R * 0.3, R * 0.18, 0, TAU); G.fillStyle = 'rgba(255,255,255,0.55)'; G.fill();
  } else {
    /* the drop has broken off: a sphere falling, and a new small drop at the tip */
    const R = r * 2.15, cy = y + R * 1.3 + fall;
    G.beginPath(); G.arc(x, cy, R, 0, TAU); G.fillStyle = col; G.fill(); G.strokeStyle = 'rgba(70,130,190,0.8)'; G.lineWidth = 1.5; G.stroke();
    G.beginPath(); G.arc(x, y + r * 0.35, r * 0.9, 0, Math.PI); G.fillStyle = col; G.fill();
  }
  G.restore();
}

/* ---------------------------------------------------------------- the cable: paracord, plugs, the chin -------------- */
/** a cable along pts (stage px), d px across, its sheath a 2/2 braid: m carriers each way (16 in all) cross at `angle` to
   the cable's axis; each diamond cell shows the yarn on top (over two, under two), with its fibres, the edge where it dives
   under in shadow, round shading over all and an optional tracer yarn. The weave is computed on the unrolled sleeve and
   wrapped round the visible half (v = sin φ), so it foreshortens at the edges like a real cylinder.
   o = { a, angle (0.56 rad), m (8), cols ([S yarns, Z yarns]), tracer (a colour for one S carrier), slide (px the weave has
   moved along the cable) }. Returns { at(u, v) (u px along, v across −1 top … 1 bottom), len, end, dir } */
function b10_paracord(pts, d, o = {}) {
  const S = [], step = 2;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], L = Math.hypot(x1 - x0, y1 - y0), n = Math.max(1, Math.ceil(L / step));
    for (let k = i === 1 ? 0 : 1; k <= n; k++) S.push([x0 + (x1 - x0) * k / n, y0 + (y1 - y0) * k / n]);
  }
  const N = S.length; if (N < 2) return { at: () => (pts[0] || [0, 0]), len: 0, end: pts[0] || [0, 0], dir: [1, 0] };
  const len = [0]; for (let i = 1; i < N; i++) len.push(len[i - 1] + Math.hypot(S[i][0] - S[i - 1][0], S[i][1] - S[i - 1][1]));
  const T = S.map((p, i) => { const q = S[Math.min(N - 1, i + 1)], r = S[Math.max(0, i - 1)], dx = q[0] - r[0], dy = q[1] - r[1], l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; });
  const total = len[N - 1], R = d / 2;
  const at = (u, v) => {
    u = clamp(u, 0, total); let lo = 0, hi = N - 1;
    while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (len[mid] < u) lo = mid; else hi = mid; }
    const k = len[hi] > len[lo] ? (u - len[lo]) / (len[hi] - len[lo]) : 0, x = lerp(S[lo][0], S[hi][0], k), y = lerp(S[lo][1], S[hi][1], k), t = T[lo];
    return [x - t[1] * v * R, y + t[0] * v * R];
  };
  const out = { at, len: total, end: S[N - 1], dir: T[N - 1] };
  const a = o.a == null ? 1 : o.a; if (a <= 0.003) return out;
  const m = o.m || 8, tn = Math.tan(o.angle || 0.56), P = 2 * Math.PI * R / m, sl = o.slide || 0, cols = o.cols || ['#2A2E36', '#3A404B'];
  const edge = () => { G.beginPath(); for (let i = 0; i < N; i += 2) { const q = at(len[i], -1); i ? G.lineTo(q[0], q[1]) : G.moveTo(q[0], q[1]); } for (let i = N - 1; i >= 0; i -= 2) { const q = at(len[i], 1); G.lineTo(q[0], q[1]); } G.closePath(); };
  G.save(); G.globalAlpha *= a;
  edge(); G.fillStyle = cols[0]; G.fill();
  G.save(); edge(); G.clip();
  /* the cells: S yarns run c − u·tan = i·P, Z yarns c + u·tan = j·P, in the unrolled sleeve (u along, c round) */
  const V = c => Math.sin(clamp(c / R, -Math.PI / 2, Math.PI / 2)), Pt = (A, B) => { const c = (A + B) / 2, u = (B - A) / (2 * tn) - sl; return at(u, V(c)); };
  const cMax = Math.PI * R / 2, i0 = Math.floor((-cMax - (total + sl) * tn) / P) - 1, i1 = Math.ceil((cMax - sl * tn) / P) + 1;
  G.lineJoin = 'round';
  for (let i = i0; i <= i1; i++) {
    const j0 = Math.floor((-2 * cMax - (i + 1) * P) / P) - 1, j1 = Math.ceil((2 * cMax - i * P) / P) + 1;
    for (let j = j0; j <= j1; j++) {
      const cc = (i + j + 1) * P / 2; if (Math.abs(cc) > cMax + P) continue;
      const uc = (j - i) * P / (2 * tn) - sl; if (uc < -P / tn || uc > total + P / tn) continue;
      const sTop = (((i - j) % 4) + 4) % 4 < 2, im = ((i % m) + m) % m, jm = ((j % m) + m) % m;
      const col = sTop ? (o.tracer && im === 0 ? o.tracer : cols[(im >> 1) % 2 ? 1 : 0]) : cols[(jm >> 1) % 2 ? 0 : 1];
      const p00 = Pt(i * P, j * P), p10 = Pt((i + 1) * P, j * P), p11 = Pt((i + 1) * P, (j + 1) * P), p01 = Pt(i * P, (j + 1) * P);
      G.beginPath(); G.moveTo(p00[0], p00[1]); G.lineTo(p10[0], p10[1]); G.lineTo(p11[0], p11[1]); G.lineTo(p01[0], p01[1]); G.closePath();
      G.fillStyle = col; G.fill();
      /* the fibres of the yarn on top, along its own direction; the end where it dives under, in shadow */
      const [qa, qb, qc, qd] = sTop ? [p00, p01, p10, p11] : [p00, p10, p01, p11];
      G.strokeStyle = 'rgba(255,255,255,0.13)'; G.lineWidth = Math.max(0.6, P * 0.05); G.beginPath();
      for (const f of [0.3, 0.55, 0.8]) { G.moveTo(lerp(qa[0], qc[0], f), lerp(qa[1], qc[1], f)); G.lineTo(lerp(qb[0], qd[0], f), lerp(qb[1], qd[1], f)); }
      G.stroke();
      G.strokeStyle = 'rgba(0,0,0,0.42)'; G.lineWidth = Math.max(0.8, P * 0.12); G.beginPath(); G.moveTo(qb[0], qb[1]); G.lineTo(qd[0], qd[1]); G.stroke();
      G.strokeStyle = 'rgba(0,0,0,0.22)'; G.lineWidth = 0.8; G.beginPath(); G.moveTo(p00[0], p00[1]); G.lineTo(p10[0], p10[1]); G.lineTo(p11[0], p11[1]); G.lineTo(p01[0], p01[1]); G.closePath(); G.stroke();
    }
  }
  /* round shading: dark toward both edges, a soft highlight a third of the way down from the top */
  const band = (v0, w0, col) => { G.beginPath(); for (let i = 0; i < N; i += 2) { const q = at(len[i], v0); i ? G.lineTo(q[0], q[1]) : G.moveTo(q[0], q[1]); } G.strokeStyle = col; G.lineWidth = w0; G.lineCap = 'butt'; G.stroke(); };
  band(0.86, d * 0.3, 'rgba(0,0,0,0.42)'); band(-0.88, d * 0.26, 'rgba(0,0,0,0.3)'); band(-0.4, d * 0.14, 'rgba(255,255,255,0.14)');
  G.restore();
  edge(); G.strokeStyle = 'rgba(0,0,0,0.6)'; G.lineWidth = 1; G.stroke();
  G.restore();
  return out;
}

/** sample a cubic Bézier into n + 1 points */
function b10_bez(p0, p1, p2, p3, n = 40) { const out = []; for (let i = 0; i <= n; i++) { const t = i / n, u = 1 - t; out.push([u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0], u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]]); } return out; }
/** a USB-C plug from the side, in stage px: its metal end in the port at (x, y) (the port's centre), s px per mm, dir = +1
   the plug runs right. angled: the body turns up at once (an L plug, as Pulsar's "Head Bent"); else it runs straight out
   (overmold 15 × 6.5 mm, then a 6 mm strain relief). cr: the cable's radius, mm. o = { a, rot (radians, turns the plug
   about the port with the mouse) }. Returns { out: where the cable leaves (stage px), dir: its heading (unit) } */
function b10_plug(x, y, s, dir, angled, o = {}) {
  const a = o.a == null ? 1 : o.a, cr = o.cr || 1.5, rot = o.rot || 0, cs = Math.cos(rot), sn = Math.sin(rot);
  const W = (px, py) => [x + px * cs - py * sn, y + px * sn + py * cs];
  const mold = TH ? ['#3D4047', '#1F2126'] : ['#4A4D55', '#25272C'];
  let out, d0;
  if (!angled) { out = [dir * 21 * s, 0]; d0 = [dir, 0]; } else { out = [dir * 3.5 * s, -21 * s]; d0 = [0, -1]; }
  if (a > 0.003) {
    G.save(); G.globalAlpha *= a; G.translate(x, y); G.rotate(rot);
    const gr = (x0, y0, x1, y1) => { const g = G.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, mold[0]); g.addColorStop(1, mold[1]); return g; };
    G.fillStyle = '#C4C8CE'; G.fillRect(dir > 0 ? -0.8 * s : 0, -1.25 * s, 0.8 * s, 2.5 * s);
    if (!angled) {
      rrPath(dir > 0 ? 0 : -15 * s, -3.25 * s, 15 * s, 6.5 * s, 1.4 * s); G.fillStyle = gr(0, -3.25 * s, 0, 3.25 * s); G.fill(); G.strokeStyle = 'rgba(0,0,0,0.5)'; G.lineWidth = 1; G.stroke();
      G.beginPath(); G.moveTo(dir * 15 * s, -2.4 * s); G.lineTo(dir * 21 * s, -cr * s); G.lineTo(dir * 21 * s, cr * s); G.lineTo(dir * 15 * s, 2.4 * s); G.closePath(); G.fillStyle = gr(0, -2.4 * s, 0, 2.4 * s); G.fill();
      G.strokeStyle = 'rgba(255,255,255,0.12)'; G.lineWidth = 1; G.beginPath(); G.moveTo(dir * 1.2 * s, -2.2 * s); G.lineTo(dir * 13.8 * s, -2.2 * s); G.stroke();
    } else {
      const x0 = dir > 0 ? 0 : -7 * s;
      rrPath(x0, -16 * s, 7 * s, 19.25 * s, 1.4 * s); G.fillStyle = gr(x0, 0, x0 + 7 * s, 0); G.fill(); G.strokeStyle = 'rgba(0,0,0,0.5)'; G.lineWidth = 1; G.stroke();
      const cx = dir * 3.5 * s;
      G.beginPath(); G.moveTo(cx - 2.4 * s, -16 * s); G.lineTo(cx - cr * s, -21 * s); G.lineTo(cx + cr * s, -21 * s); G.lineTo(cx + 2.4 * s, -16 * s); G.closePath(); G.fillStyle = gr(cx - 2.4 * s, 0, cx + 2.4 * s, 0); G.fill();
      G.strokeStyle = 'rgba(255,255,255,0.12)'; G.lineWidth = 1; G.beginPath(); G.moveTo(x0 + 1.2 * s, -14.6 * s); G.lineTo(x0 + 1.2 * s, 1.8 * s); G.stroke();
    }
    G.restore();
  }
  return { out: W(out[0], out[1]), dir: [d0[0] * cs - d0[1] * sn, d0[0] * sn + d0[1] * cs] };
}

/* the side view's geometry, mm: z forward from the mouse's centre, h up from the pad. The port is where the front of the
   outline crosses the port's centre height (5.25 mm: GEO2D.shell's usbC, y 3.62 to 6.88); the chin is the outline's
   bottom front; the skates (msLive: the plate-off dots) carry the mouse; the lens is the shell's lens window. */
const B10_CAB = (() => {
  const hP = 5.25; let zp = 56.7;
  for (let i = 1; i < MS_SIDE.length; i++) { const [z0, h0] = MS_SIDE[i - 1], [z1, h1] = MS_SIDE[i]; if (z0 > 40 && z1 > 40 && (h0 - hP) * (h1 - hP) <= 0 && h0 !== h1) { zp = z0 + (hP - h0) / (h1 - h0) * (z1 - z0); break; } }
  const chin = MS_SIDE.filter(p => p[0] > 50 && p[1] < 8.5 && p[1] > 0.7).sort((p, q) => p[0] - q[0]);
  /* dc: the stock cable, an illustration (none is published); dt: Theseus's paracord, about 2 mm (XBAB's XA25-class 1.9 mm
     passes USB 2.0 high speed: thin can still be full spec) */
  return { zp, hP, chin, dc: 3.0, dt: 2.0, lod: 1.0 };
})();
/** the live numbers: skates, pivot, lens (read when first asked, so H1's rebuilt shell is used) */
function b10_cabLive() {
  if (b10_cabLive.v) return b10_cabLive.v;
  const L = msLive(), zs = L.corner.map(c => c[1]), zf = Math.max(...zs), zr = Math.min(...zs) - 3.25, zl = (L.lens[2] + L.lens[5]) / 2;
  return (b10_cabLive.v = { zf, zr, zl });
}
/** a mouse's side geometry for the cable model, mm (z forward from its centre, h up from the pad): the port (zp, hP), the
   chin (the underside's front, rising to the port), the front skate (zf ± skHalf), the pivot (zr: the rear skates' back
   edge), the lens (zl) and the base's height. 'ths': Theseus's shell (B10_CAB, msLive). 'rival': most mice, drawn with the
   kit's neutral rival (mouseRival 'right', a typical 120 × 63 × 39 mm: its port 0.2 of its height up at the nose, a front
   and a rear skate, the sensor mid-length, the body 0.8 mm off the pad), so the rival's lift comes from the rival's shape */
function b10_geo(kind) {
  if (kind !== 'rival') { if (b10_geo.th) return b10_geo.th; const C = B10_CAB, L = b10_cabLive(); return (b10_geo.th = { zp: C.zp, hP: C.hP, chin: C.chin, zf: L.zf, skHalf: 3.25, zr: L.zr, zl: L.zl, base: 0.74 }); }
  if (b10_geo.rv) return b10_geo.rv;
  const o = {}, V = rvView('right', o), Lm = V.dims[0], cab = rvAt('right', 'cable', o), sF = rvAt('right', 'skateF', o), sR = rvAt('right', 'skateR', o), sn = rvAt('right', 'sensor', o);
  const skHalf = (RV_AT.skates[0][1] - RV_AT.skates[0][0]) * Lm / 2, hP = -cab[1];
  const chin = V.outPts.filter(p => p[0] > 0.3 * Lm && -p[1] < hP + 0.5 && -p[1] > RV_SK + 0.01).map(p => [p[0], -p[1]]).sort((a, b) => a[0] - b[0]);
  return (b10_geo.rv = { zp: cab[0], hP, chin, zf: sF[0], skHalf, zr: sR[0] - skHalf, zl: sn[0], base: RV_SK });
}
/** how high the underside sits above the pad at z when the mouse lies flat (skates 0, the base, the chin rising, the plug's
   underside if one is fitted: straight 2.0 mm under its overmold, its relief tapering to the cable). g: b10_geo(...) */
function b10_under(z, angled, g) {
  g = g || b10_geo('ths'); const ch = g.chin;
  if (Math.abs(z - g.zf) <= g.skHalf) return 0;
  if (z <= ch[0][0]) return g.base;
  if (z <= g.zp) { for (let i = 1; i < ch.length; i++) if (z <= ch[i][0]) return lerp(ch[i - 1][1], ch[i][1], (z - ch[i - 1][0]) / (ch[i][0] - ch[i - 1][0])); return g.hP; }
  if (angled) return z <= g.zp + 7 ? g.hP - 3.25 : 99;
  if (z <= g.zp + 15) return g.hP - 3.25;
  if (z <= g.zp + 21) return lerp(g.hP - 2.4, g.hP - 1.5, (z - g.zp - 15) / 6);
  return 99;
}
/** the pitch (radians, nose up, about the rear skates' back edge) that lets the underside clear a cable of dc mm lying on
   the pad from z0 forward. g: b10_geo(...) */
function b10_pitch(z0, dc, angled, g) {
  g = g || b10_geo('ths'); let th = 0;
  for (let z = Math.max(z0, g.zr + 5); z <= g.zp + 22; z += 0.25) { const need = dc - b10_under(z, angled, g); if (need > 0) th = Math.max(th, Math.atan(need / (z - g.zr))); }
  return th;
}
/** the flick: how far (mm) the mouse has moved over the pad by time t, from t0 over dur s, quick then easing */
function b10_flick(t, t0, dur, D) { return D * E.out3(clamp((t - t0) / dur)); }
/** a quiet aim inset: the cursor rides the flick (pr 0..1) toward the target, but freezes where the sensor stopped
   tracking (stop: the progress at that moment, or null); the click lands at tc. o = { label } */
function b10_aim(t, t0, rect, pr, stop, tc, o = {}) {
  const [x, y, w, h] = rect, a = ep(t, t0, t0 + 0.4); if (a <= 0.003) return;
  demoWindow(x, y, w, h, a, { fill: TH ? '#E9E9EC' : '#0B0C0D', plain: true });
  const sx = x + w * 0.16, sy = y + h * 0.62, tx = x + w * 0.78, ty = y + h * 0.4, tr = 13;
  const f = stop == null ? pr : Math.min(pr, stop), cx = lerp(sx, tx, f), cy = lerp(sy, ty, f), clicked = t >= tc, hit = stop == null || stop >= 0.97;
  clipped(x, y, w, h, () => {
    G.save(); G.globalAlpha = a;
    circle(tx, ty, tr * 2.4, { color: inkA(0.18), w: 1.5 }); circle(tx, ty, tr, { fill: TH ? '#111111' : '#F3F3F5' });
    line(sx, sy, cx, cy, { color: inkA(0.22), w: 2, dash: [5, 6] });
    if (clicked) { const kh = prog(t, tc, tc + 0.35);
      if (hit) { circle(tx, ty, tr * (1.4 + 1.6 * E.out3(kh)), { color: C.hero, w: 3 * (1 - kh) + 0.5, alpha: 1 - kh }); circle(cx, cy, tr * 0.42, { fill: C.hero }); }
      else { const r = tr * 0.6; line(cx - r, cy - r, cx + r, cy + r, { color: C.red, w: 3.5 }); line(cx - r, cy + r, cx + r, cy - r, { color: C.red, w: 3.5 }); } }
    const g = tr * 0.9, l2 = tr * 1.5, ch = TH ? '#111111' : '#FFFFFF';
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) line(cx + dx * g, cy + dy * g, cx + dx * (g + l2), cy + dy * (g + l2), { color: ch, w: 2.5 });
    circle(cx, cy, 1.8, { fill: ch });
    G.restore();
  });
  if (clicked) text(hit ? 'Hit' : 'Miss', x + w - 18, y + 36, { role: 'label', size: 22, color: hit ? C.heroText : C.red, align: 'right', alpha: a * ep(t, tc, tc + 0.25) });
  if (o.label) text(o.label, x + 18, y + h - 18, { role: 'label', size: 19, color: C.mute, alpha: a, maxW: w - 36 });
}


/* ---------------------------------------------------------------- the lights: an optical gate, a step counter ---------- */
/** an optical scroll encoder's gate, schematic, in stage px: an IR LED (left) shines through the slotted rim of the code
   wheel (the middle band; its slots run down as the wheel turns) into a photodiode (right). dust (0..1): specks fall into
   the gate and settle on the rim and the LED's window; a speck in the beam's path blocks it. ph: the wheel's turn in
   steps. Returns { lit (the diode sees the beam now) } */
function b10_optGate(x, y, w, h, ph, dust, o = {}) {
  const a = o.a == null ? 1 : o.a, cx = x + w / 2, cy = y + h / 2, pitch = 34, slot = 15;
  G.save(); G.globalAlpha *= a;
  /* the LED and the photodiode in their black blocks */
  rr(x + 8, cy - 34, 64, 68, 6, '#1E1F23', 'rgba(255,255,255,0.18)', 1.5); rr(x + w - 72, cy - 34, 64, 68, 6, '#1E1F23', 'rgba(255,255,255,0.18)', 1.5);
  circle(x + 58, cy, 9, { fill: '#5A4A6A' }); rr(x + w - 66, cy - 12, 12, 24, 2, '#2E3A4A', null, 1);
  /* the rim: slots running down */
  const off = ((ph * pitch) % pitch + pitch) % pitch;
  rr(cx - 18, y + 4, 36, h - 8, 4, '#3A3B40', null, 1);
  let open = false;
  G.save(); rrPath(cx - 18, y + 4, 36, h - 8, 4); G.clip();
  for (let sy = y - pitch + off; sy < y + h + pitch; sy += pitch) { G.fillStyle = '#0B0C0D'; G.fillRect(cx - 18, sy, 36, slot); if (cy > sy + 2 && cy < sy + slot - 2) open = true; }
  G.restore();
  /* dust: specks falling in, then settling on the rim and the LED's window (seeded, so every frame agrees) */
  const r = rng(11), n = 46; let blocked = false;
  for (let i = 0; i < n; i++) {
    const k0 = r(), k = clamp((dust - k0 * 0.85) / 0.15); if (k <= 0) { r(); r(); continue; }
    const sx = lerp(x + 60, x + w - 60, r()), sy0 = y - 10, sy1 = lerp(cy - 30, cy + 30, r()), py = lerp(sy0, sy1, E.in3(k));
    const px = k >= 1 ? lerp(sx, cx + (sx - cx) * 0.25, 0.6) : sx;
    circle(px, py, 2.6, { fill: 'rgba(196,186,170,0.85)' });
    if (k >= 1 && Math.abs(py - cy) < 6 && px > x + 66 && px < x + w - 70) blocked = true;
  }
  const lit = open && !blocked;
  /* the beam: through an open slot to the diode, cut short by a speck */
  if (open) { const xe = lit ? x + w - 66 : cx + (blocked ? -6 : 0); G.fillStyle = 'rgba(255,110,90,0.55)'; G.fillRect(x + 66, cy - 4, xe - x - 66, 8); glow(x + 58, cy, 22, '#FF6E5A', 0.5); }
  if (lit) glow(x + w - 60, cy, 26, '#FF6E5A', 0.45);
  G.restore();
  return { lit };
}
/** a row of step marks: n steps turned so far, each counted or missed (missed(i) → true), in stage px from (x, y), gap px
   apart; counted marks in col, missed ones as red gaps. Returns the number counted */
function b10_steps(x, y, n, total, gap, missed, col, o = {}) {
  let c = 0;
  for (let i = 0; i < total; i++) {
    const xx = x + i * gap;
    if (i >= n) { line(xx, y - 10, xx, y + 10, { color: inkA(0.14), w: 3 }); continue; }
    if (missed(i)) { line(xx, y - 10, xx, y + 10, { color: C.red, w: 1.5, dash: [3, 3] }); continue; }
    line(xx, y - 10, xx, y + 10, { color: col, w: 4 }); c++;
  }
  return c;
}


/* ---------------------------------------------------------------- the coat: two pads under a drop of sweat ---------- */
/** two powered pads seen from above, in mm for part(): the cathode (−) left, the anode (+) right, gap mm apart, on black
   mask. o = { drop: { r, k (0..1: fallen and spread), bead (0..1: beaded on a coat) }, ions (0..1), tree (0..1: grown to
   the first bridge at 1), coat (0..1), short (0..1: the flash), seed }. Returns { cath, anode, gapC, drop } in stage px */
function b10_padsMM(o = {}) {
  const gap = 0.5, pw = 1.1, ph = 1.25, out = {};
  G.fillStyle = '#1C1D21'; G.fillRect(-1.9, -1.15, 3.8, 2.3);
  for (const sg of [-1, 1]) solid(() => pathRR(sg < 0 ? -gap / 2 - pw : gap / 2, -ph / 2, pw, ph, 0.06), MT.tin, [sg < 0 ? -gap / 2 - pw : gap / 2, -ph / 2, pw, ph], { lw: 0.8 });
  G.fillStyle = 'rgba(17,17,17,0.55)'; setFont({ size: 0.42, weight: 800 }); G.textAlign = 'center'; G.fillText('−', -gap / 2 - pw / 2, 0.15); G.fillText('+', gap / 2 + pw / 2, 0.15);
  /* the metal tree: tin from the anode, carried over as ions and laid down at the cathode, growing back toward the anode */
  const tr = o.tree || 0;
  if (tr > 0) { const T = b10_tree(o.seed || 7); G.lineCap = 'round';
    for (const [x0, y0, x1, y1, b, w] of T.segs) { if (b > tr) continue; const k = clamp((tr - b) / 0.04);
      const X0 = -gap / 2 + x0 * gap, Y0 = -ph / 2 + y0 * ph, X1 = -gap / 2 + lerp(x0, x1, k) * gap, Y1 = -ph / 2 + lerp(y0, y1, k) * ph;
      G.beginPath(); G.moveTo(X0, Y0); G.lineTo(X1, Y1); G.strokeStyle = '#A9AFB7'; G.lineWidth = 0.012 + 0.02 * w; G.stroke(); } }
  /* the ions crossing the gap, from + to − */
  const io = o.ions || 0;
  if (io > 0) { const r = rng(3); for (let i = 0; i < 26; i++) { const ph0 = r(), y = (r() - 0.5) * ph * 0.9, f = ((ph0 + (o.t || 0) * 0.35) % 1);
      G.beginPath(); G.arc(gap / 2 - f * gap, y, 0.022, 0, TAU); G.fillStyle = rgba('#7AA7D6', 0.85 * io); G.fill(); } }
  /* the coat: a clear film over everything */
  if (o.coat) { G.fillStyle = rgba(C.hero, 0.16 * o.coat); G.fillRect(-1.9, -1.15, 3.8, 2.3); G.strokeStyle = rgba(C.hero, 0.5 * o.coat); G.lineWidth = lw(1.5); G.strokeRect(-1.88, -1.13, 3.76, 2.26); }
  /* the drop: spread wide on bare metal, beaded high on the coat */
  if (o.drop && o.drop.k > 0) { const k = o.drop.k, bead = o.drop.bead || 0, R = (o.drop.r || 1.05) * lerp(1, 0.72, bead) * (0.4 + 0.6 * k);
    const g = G.createRadialGradient(-R * 0.3, -R * 0.35, R * 0.05, 0, 0, R); g.addColorStop(0, 'rgba(255,255,255,0.55)'); g.addColorStop(0.5, 'rgba(160,200,235,0.28)'); g.addColorStop(1, 'rgba(110,160,210,0.42)');
    G.beginPath(); G.arc(0, 0, R, 0, TAU); G.fillStyle = g; G.fill(); G.strokeStyle = rgba('#5A8FC4', 0.6 + 0.3 * bead); G.lineWidth = lw(1.5 + 1.5 * bead); G.stroke();
    out.drop = SP(R * 0.7, -R * 0.7); }
  if (o.short > 0) { G.beginPath(); G.arc(0, 0, 0.32, 0, TAU); G.fillStyle = rgba('#FFE08A', 0.6 * o.short); G.fill(); }
  out.cath = SP(-gap / 2 - pw / 2, ph / 2); out.anode = SP(gap / 2 + pw / 2, ph / 2); out.gapC = SP(0, 0);
  return out;
}
/** the classroom version (ACS, "Tin Crystals"): a beaker of tin chloride solution, two paper clips on a 9 V battery's leads;
   tin grows from the − clip as a tree. In stage px: (x, y) the beaker's bottom centre, w its width. k: growth 0..1 */
function b10_beaker(x, y, w, k, o = {}) {
  const h = w * 0.95, a = o.a == null ? 1 : o.a; G.save(); G.globalAlpha *= a;
  G.fillStyle = 'rgba(150,190,225,0.22)'; G.fillRect(x - w / 2 + 4, y - h * 0.7, w - 8, h * 0.7 - 4);
  G.strokeStyle = inkA(0.6); G.lineWidth = 2.5; G.beginPath(); G.moveTo(x - w / 2, y - h); G.lineTo(x - w / 2, y - 6); G.quadraticCurveTo(x - w / 2, y, x - w / 2 + 6, y); G.lineTo(x + w / 2 - 6, y); G.quadraticCurveTo(x + w / 2, y, x + w / 2, y - 6); G.lineTo(x + w / 2, y - h); G.stroke();
  for (const [sg, col] of [[-1, '#26272B'], [1, '#C8463D']]) { const cx = x + sg * w * 0.24; line(cx, y - h - 40, cx, y - h * 0.15, { color: '#9AA0A8', w: 4 }); line(cx, y - h - 40, x + sg * 30, y - h - 70, { color: col, w: 3 }); }
  rr(x - 34, y - h - 104, 68, 44, 5, '#2B2C31', null, 1); text('9 V', x, y - h - 74, { role: 'label', size: 19, color: '#F3F3F5', align: 'center' });
  if (k > 0) { const T = b10_tree(19, 4), cx = x - w * 0.24, gx = w * 0.42, gy = h * 0.5; G.lineCap = 'round';
    for (const [x0, y0, x1, y1, b, ww] of T.segs) { if (b > k) continue; G.beginPath(); G.moveTo(cx + x0 * gx, y - h * 0.62 + y0 * gy); G.lineTo(cx + x1 * gx, y - h * 0.62 + y1 * gy); G.strokeStyle = '#8E939B'; G.lineWidth = 1 + 2 * ww; G.stroke(); } }
  G.restore();
}

/* ============================================================================================ the slides */

/* ---------------------------------------------------------------- 1. b10_pmic: a battery reading you can trust ---------
   Opens on the battery whose hours b09_life just showed. The demonstration: one battery, one session, two readings. The
   true charge falls; a voltage guess (as the G Pro X Superlight 2 reads it: no fuel gauge, TechPowerUp) dips in every fight,
   jumps up after a restart, reads low in the cold and still shows charge when the battery is empty; the voltmeter beside it
   is the school internal-resistance practical (V = E − Ir): the needle dips with each burst of load. Theseus's nPM1300
   gauge counts the charge in and out and stays within 3 % (Nordic's benchmark: a voltage table errs by up to 20 %). Then
   where the chip sits (plan 5, KEY_PARTS: the left-middle spot, 17.9 mm from the module) and the parts it replaces.
   Titled by what the player gets (R2-b10-12; was "One chip runs the power"): one chip for six parts is the second beat. */
S({
  id: 'b10_pmic', ch: 'elec', theme: 'paper', title: 'A battery reading you can trust', settle: 11, ideas: ['pmic'],
  src: ['b10Nordic24', 'b10TpuGpx2', 'b10Npm', 'b10Valid', 'b10Plan5', 'b10Aqa'],
  replaces: ['elc_pmic'],
  answers: [
    ['elc_pmic (not rated, no note)', 'Rebuilt as a demonstration: one battery through one session, the true charge, a voltage guess and Theseus\'s gauge drawn against each other, a voltmeter dipping with load beside them'],
    ['(F30.1) the PMIC far from the MCU', 'The locator shows plan 5\'s board from KEY_PARTS: the PMIC in the left-middle spot and its distance to the module, 17.9 mm'],
    ['(F30.3) sensor and MCU flipped, the PMIC in the empty left-middle spot', 'The same locator: the sensor centre, the module at the rear, the PMIC left-middle'],
    ['(F0.5) the nPM1300 named and described as validated', 'Named on the slide; it replaces a charger, regulators, a gauge with its sense resistor, a reset chip and a watchdog (validation report: 4 to 6 parts), said as "up to six"']
  ],
  draw: t => {
    header(t, 'A battery reading you can trust');
    captions(t, [[0.6, 'Most mice guess the charge from the battery\'s voltage, and that voltage moves with load, cold and every restart.'],
      [5.8, 'Theseus\'s nPM1300 counts charge in and out: it reads within 3 %, and does six parts\' work.']]);
    const u = clamp((t - 0.3) / 5.0), S0 = b10_session(u);
    /* the session chart: % left against hours of play (the session starts at 46 %: 23 h of Theseus's 50 h at 8 khz) */
    const cx = 170, cy = 300, cw = 980, ch = 400, X = v => cx + v * cw, Y = p => cy + ch - p / 0.6 * ch;
    for (const p of [0, 0.2, 0.4, 0.6]) { line(cx, Y(p), cx + cw, Y(p), { color: p ? C.hair : C.faint, w: p ? 1.2 : 1.5 }); text(Math.round(p * 100) + ' %', cx - 14, Y(p) + 7, { role: 'tick', color: C.mute, align: 'right' }); }
    const hrs = 0.46 * B10.h8; for (let h = 0; h <= hrs; h += 5) text(h + ' h', X(h / hrs), Y(0) + 30, { role: 'tick', color: C.mute, align: 'center' });
    text('Hours of play at 8 khz', cx + cw, Y(0) + 62, { role: 'label', size: 19, color: C.mute, align: 'right' });
    const N = 240, pts = k => { const out = []; for (let i = 0; i <= N; i++) { const v = i / N; if (v > u) break; const q = b10_session(v); out.push([X(v), Y(k(q))]); } return out; };
    /* the load: the fights, as bars under the axis */
    for (let i = 0; i < 200; i++) { const v = i / 200; if (v > u) break; const q = b10_session(v); if (q.load > 0.05) line(X(v), Y(0) - 2, X(v), Y(0) - 2 - 16 * q.load, { color: C.faint, w: 3 }); }
    { const all = []; for (let i = 0; i <= N; i++) { const q = b10_session(i / N); all.push([X(i / N), Y(q.s)]); } poly(all, { color: C.ink, w: 2.5, dash: [8, 7] }); }   /* the true charge, whole from frame one */
    poly(pts(q => q.v), { color: C.second, w: 4 });
    poly(pts(q => q.g), { color: C.hero, w: 4, alpha: ep(t, 0.3, 0.5) });
    /* the playhead: the three readings now */
    const yS = Y(S0.s), yV = Y(S0.v), yG = Y(S0.g);
    circle(X(u), yV, 7, { fill: C.second }); circle(X(u), yG, 7, { fill: C.hero });
    /* the guess's faults, named where they happen */
    const tagAt = v => { const q = b10_session(v); return [X(v), Y(q.v)]; };
    if (u > 0.15) callout(t, 0.3 + 0.15 * 5 + 0.1, tagAt(0.15), 'Jumps up after a restart', { to: [X(0.15) + 60, Y(0.58)], side: 'r', color: C.secondText, tcolor: C.secondText });
    if (u > 0.6) callout(t, 0.3 + 0.6 * 5 + 0.1, tagAt(0.6), 'Reads low in the cold', { to: [X(0.6) - 20, Y(0.07)], side: 'l', color: C.secondText, tcolor: C.secondText });
    if (u >= 1) faultTag(t, 5.4, [X(1), Y(b10_session(1).v)], 'Empty at ' + Math.round(b10_session(1).v * 100) + ' %', { to: [X(1) - 40, Y(0.42)], side: 'l', sub: 'The mouse dies mid-match (an illustration)' });
    /* the key */
    { const ky = 268; line(cx, ky - 6, cx + 30, ky - 6, { color: C.ink, w: 2.5, dash: [8, 7] }); text('Charge left', cx + 40, ky, { role: 'label', size: 19, color: C.mute });
      line(cx + 210, ky - 6, cx + 240, ky - 6, { color: C.second, w: 4 }); const wg = text('Voltage guess (G Pro X Superlight 2)', cx + 250, ky, { role: 'label', size: 19, color: C.secondText }).w;
      line(cx + 290 + wg, ky - 6, cx + 320 + wg, ky - 6, { color: C.hero, w: 4 }); text('Theseus\'s gauge', cx + 330 + wg, ky, { role: 'label', size: 19, color: C.heroText }); }
    /* the battery and its voltmeter: the internal-resistance practical (V = E − Ir) */
    { const px = 1220, py = 270, pw = 620, ph = 300;
      demoWindow(px, py, pw, ph, 1, { plain: true });
      text('The A-level practical: voltage under load', px + 24, py + 36, { role: 'label', size: 21, color: C.mute, maxW: pw - 48 });   /* one label, not two run together */
      const bx = px + 40, by = py + 76, bw2 = 140, bh = 166;
      rr(bx + bw2 / 2 - 22, by - 12, 44, 14, 3, C.faint, null, 1); rr(bx, by, bw2, bh, 10, null, C.ink2, 3);
      rr(bx + 8, by + 8 + (bh - 16) * (1 - S0.s / 0.6), bw2 - 16, (bh - 16) * S0.s / 0.6, 6, C.ink2, null, 1);
      text(Math.round(S0.s * 100) + ' %', bx + bw2 / 2, by + bh + 32, { role: 'num', size: 26, color: C.ink, align: 'center' });
      /* the dial: E falls with the charge; each burst of current pulls it down by I·r */
      const dx = px + 400, dy = py + 230, R = 150, Vn = 3.3 + 0.9 * clamp(S0.s / 0.6 + 0.1) - 0.22 * S0.load, ang = v => Math.PI * (1.15 + 0.7 * (v - 3.2) / 1.0);
      G.save(); G.strokeStyle = C.ink2; G.lineWidth = 2.5; G.beginPath(); G.arc(dx, dy, R, ang(3.2), ang(4.2)); G.stroke(); G.restore();
      for (let v = 3.2; v <= 4.21; v += 0.1) { const a = ang(v), r0 = R - (Math.round(v * 10) % 5 ? 10 : 20); line(dx + Math.cos(a) * r0, dy + Math.sin(a) * r0, dx + Math.cos(a) * R, dy + Math.sin(a) * R, { color: C.ink2, w: 2 }); }
      for (const v of [3.2, 3.7, 4.2]) { const a = ang(v); text(v.toFixed(1) + ' V', dx + Math.cos(a) * (R + 30), dy + Math.sin(a) * (R + 30) + 7, { role: 'tick', color: C.mute, align: 'center' }); }
      const a = ang(Vn); line(dx, dy, dx + Math.cos(a) * (R - 14), dy + Math.sin(a) * (R - 14), { color: S0.load > 0.2 ? C.secondText : C.ink, w: 4 }); circle(dx, dy, 8, { fill: C.ink });
      rich([{ s: 'V = E − I·r', role: 'num', size: 24, color: C.ink }, { s: 'dips with each burst of load', role: 'small', size: 20, weight: 600, color: C.mute, gap: 12, sentence: false }], px + 230, py + ph - 22, {});
    }
    /* where the chip sits on plan 5's board, and the parts it replaces */
    { const px = 1220, py = 600, pw = 620, ph = 300, k6 = ep(t, 6.4, 7.4, E.io3);
      demoWindow(px, py, pw, ph, 1, { plain: true });
      text('One chip for up to six parts', px + 24, py + 36, { role: 'label', size: 21, color: C.mute });
      const m = part(px + 100, py + 170, 1.85, () => { mouseSimple('top', { show: ['board'] }); const pm = KEY_PARTS.pmic, mo = KEY_PARTS.module;
        G.fillStyle = rgba(C.hero, 0.9); G.fillRect(pm.c[0] - pm.w / 2, pm.c[1] - pm.h / 2, pm.w, pm.h);
        G.strokeStyle = C.comp; G.lineWidth = lw(1.5); G.strokeRect(mo.c[0] - mo.w / 2, mo.c[1] - mo.h / 2, mo.w, mo.h);
        return { pm: SP(pm.c[0], pm.c[1]), mo: SP(mo.c[0], mo.c[1]) }; });
      if (m.pm) { line(m.pm[0], m.pm[1], m.mo[0], m.mo[1], { color: C.heroText, w: 1.5, dash: [4, 4] }); const d = Math.hypot(KEY_PARTS.pmic.c[0] - KEY_PARTS.module.c[0], KEY_PARTS.pmic.c[1] - KEY_PARTS.module.c[1]); callout(t, -1, m.pm, 'PMIC', { to: [px + 190, py + 100], side: 'r', color: C.hero, tcolor: C.heroText }); text(d.toFixed(1) + ' mm to the module', px + 202, py + 136, { role: 'small', size: 20, weight: 600, color: C.ink2 }); }
      const parts = ['Charger', 'Regulator', 'Regulator', 'Fuel gauge', 'Sense resistor', 'Reset, watchdog'], ox = px + 300, oy = py + 160;
      parts.forEach((n2, i) => { const c0 = [ox + (i % 2) * 153, oy + Math.floor(i / 2) * 44], c1 = [ox + 76, oy + 44], c = [lerp(c0[0], c1[0], k6), lerp(c0[1], c1[1], k6)];
        rr(c[0], c[1], 145, 36, 5, TH ? '#FFFFFF' : '#1E1F23', inkA(0.35), 1.5, 1 - k6); text(n2, c[0] + 10, c[1] + 25, { role: 'small', size: 19, weight: 600, color: C.ink2, alpha: 1 - k6 }); });
      if (k6 > 0.5) { const ka = ep(t, 7.0, 7.4); part(ox + 150, oy + 60, 8, () => chipMM({ w: 5, hi: true, label: 'nPM1300' }), { alpha: ka });
        text('nPM1300, 5 × 5 mm', ox + 150, oy + 122, { role: 'label', size: 19, color: C.heroText, align: 'center', alpha: ka }); }
    }
    /* the payoff */
    verdict(t, 6.2, 80, 880, { from: 20, to: 3, unit: '%', label: 'Battery reading error, worst case', better: 'lower', who: ['Guess', 'Theseus'], net: false, size: 96, maxW: 900 });
    source(t, 'Errors: Nordic (Kjosavik 2024): a voltage table errs by up to 20 %, the nPM1300\'s gauge stays within about 3 %. G Pro X Superlight 2: no fuel gauge; its reading "would suddenly sit at 60%" after a restart (TechPowerUp). Session drawn to show these behaviours; chip count: Theseus validation report.', { t0: 2.4 });
  }
});

/* ---------------------------------------------------------------- 2. b10_charge: fast charging, safely ----------------
   In from b10_pmic's empty battery. The demonstration: two batteries plugged in at 20 % on the same clock: the Viper V4
   Pro's at 0.169 A (TechPowerUp: 0.55C of its 306 mAh), Theseus's at its battery's rated 1C (Jauch: 370 mA). The current
   arrows are sized by amps, the fills rise, and the CC/CV curves (Battery University: constant current, then constant
   voltage) are drawn under them. Ten minutes: +9.2 % → 4.2 h against +16.7 % → 8.3 h at 8 khz (b10_tenMin). Then the four guards that
   make 1C safe act in turn, each a cause and its effect: cold, a bad charger, a short, storage. */
S({
  id: 'b10_charge', ch: 'elec', theme: 'night', title: 'Fast charging, safely', settle: 11, ideas: ['pmic', 'battery'],
  src: ['elcTpuV4', 'nbcV4', 'elcLp4025', 'b10Npm', 'b10Bu409', 'b10Bu410'],
  replaces: ['elc_charge', 'elc_safe'],
  answers: [
    ['elc_charge (not rated, no note)', 'Rebuilt as a demonstration: two batteries on one clock, current arrows sized by amps, fills rising, the CC/CV curve under each; ten minutes buy ' + b10_tenMin().sA.toFixed(1) + ' h on the V4 Pro, ' + b10_tenMin().sB.toFixed(1) + ' h on Theseus at 8 khz: the share charged times each battery\'s life at 8 khz (Razer\'s 45 h for the V4 Pro; Theseus\'s 50 h, b09_life\'s figure, so the two chapters agree)'],
    ['elc_safe (not rated, no note)', 'The four guards act in turn, each cause with its effect: cold (waits until 10 °C), a bad charger (stopped at the input, 22 V rated), a short (the battery\'s own board opens), storage (ship mode, 370 nA)'],
    ['(F0.5) honest wording: the PMIC is not the limit, the battery is', 'Said: Theseus charges at its battery\'s rated 1C; the nPM1300 could go to 800 mA. Its charger is linear too, so the guards, not less heat, make 1C safe']
  ],
  draw: t => {
    header(t, 'Fast charging, safely');
    captions(t, [[0.6, 'The Viper V4 Pro charges at 0.17 A, just over half its battery\'s capacity an hour. Theseus charges at its battery\'s rated 1C.'],
      [5.8, 'Four guards make 1C safe: cold, a bad charger, a short and storage are each caught in time.']]);
    const mins = 10 * ep(t, 0.8, 4.8, E.lin), V = B10.v4, A = b10_ccv(V.c, 0.2), Bc = b10_ccv(1.0, 0.2);
    const sA = A.at(mins), sB = Bc.at(mins);
    /* the two batteries, filling */
    const bat = (x, s, name, sub, col, colT, amps, tag) => {
      const y = 410, w = 120, h = 200;
      rr(x + w / 2 - 20, y - 12, 40, 14, 3, C.faint, null, 1); rr(x, y, w, h, 12, null, C.ink2, 3);
      const fh = (h - 16) * s; rr(x + 8, y + h - 8 - fh, w - 16, fh, 7, col, null, 1);
      line(x + 8, y + h - 8 - (h - 16) * 0.2, x + w - 8, y + h - 8 - (h - 16) * 0.2, { color: C.bg, w: 2, dash: [4, 4] });
      text(Math.floor(s * 1000) / 10 + ' %', x + w / 2, y + h + 40, { role: 'num', size: 30, color: C.ink, align: 'center' });
      /* the current: an arrow into the + end, as thick as the amps */
      const ka = mins > 0 ? 1 : 0.35, aw = 8 + amps * 60;
      arrow(x + w / 2, y - 92, x + w / 2, y - 16, { color: colT, w: aw, hs: aw * 1.4, alpha: ka });
      text(amps.toFixed(2) + ' A', x + w / 2 + aw / 2 + 16, y - 46, { role: 'num', size: 26, color: colT });
      ltag(x - 10, 286, name, null, { size: 22, color: colT });
      text(sub, x - 10, 314, { role: 'small', size: 20, weight: 600, color: C.mute });
    };
    bat(170, sA, 'Viper V4 Pro', '306 mAh at 0.55C', C.second, C.secondText, V.A, 'rival');
    bat(600, sB, 'Theseus', '370 mAh at 1C', C.hero, C.heroText, B10.cell.mAh / 1000, 'ths');
    /* the clock */
    { const mm = Math.floor(mins), ss = Math.floor((mins - mm) * 60); rich([{ s: mm + ':' + String(ss).padStart(2, '0'), role: 'num', size: 54, color: C.ink }, { s: 'min', role: 'label', size: 20, color: C.mute, gap: 8, caps: false }], 445, 520, { align: 'center' }); text('Plugged in at 20 %', 445, 558, { role: 'label', size: 19, color: C.mute, align: 'center' }); }
    /* the CC/CV curves under them: charge against minutes, the first ten lit */
    { const cx = 120, cy = 700, cw = 760, chh = 160, X = m => cx + m / 120 * cw, Y = s => cy + chh - s * chh;
      for (const p of [0.2, 0.6, 1.0]) { line(cx, Y(p), cx + cw, Y(p), { color: C.hair, w: 1.2 }); text(Math.round(p * 100) + ' %', cx - 12, Y(p) + 7, { role: 'tick', color: C.mute, align: 'right' }); }
      for (const m of [0, 30, 60, 90, 120]) text(m + ' min', X(m), cy + chh + 28, { role: 'tick', color: C.mute, align: 'center' });
      const crv = (R, col) => { poly(R.pts.filter(p => p[0] <= 120).map(p => [X(p[0]), Y(p[1])]), { color: col, w: 2, alpha: 0.35 }); poly(R.pts.filter(p => p[0] <= mins).map(p => [X(p[0]), Y(p[1])]), { color: col, w: 4 }); };
      crv(A, C.second); crv(Bc, C.hero);
      line(X(10), cy - 6, X(10), cy + chh, { color: C.ink2, w: 1.5, dash: [5, 5] }); text('10 min', X(10) + 8, cy + 14, { role: 'label', size: 19, color: C.ink2 });
      text('Constant current, then constant voltage', cx + cw, cy - 18, { role: 'label', size: 19, color: C.mute, align: 'right', alpha: ep(t, 2.0, 2.4) });
    }
    /* the four guards: each cause and its effect, in turn */
    { const px = 980, py = 280, pw = 860, ph = 412;
      demoWindow(px, py, pw, ph, 1, { plain: true });
      text('Four guards', px + 24, py + 36, { role: 'label', size: 21, color: C.mute });
      const G4 = [['Cold battery, 5 °C', 'Waits until it reaches 10 °C', 'The PMIC reads the battery\'s NTC'], ['A bad charger\'s 20 V spike', 'Stopped at the input', 'Rated to 22 V'], ['A short circuit', 'The battery\'s own board opens', 'Its protection chip and switches'], ['Stored, switched off', 'Ship mode: 370 nA', 'Under 1 % a year']];
      G4.forEach(([cause, effect, why], i) => { const t0 = 6.2 + i * 0.8, k = ep(t, t0, t0 + 0.4), kk = ep(t, t0 + 0.3, t0 + 0.7), y = py + 96 + i * 88;
        circle(px + 40, y - 7, 9, { fill: kk > 0.5 ? C.hero : C.faint, alpha: 0.3 + 0.7 * k });
        text(cause, px + 64, y, { role: 'small', size: 23, weight: 650, color: C.ink, alpha: 0.35 + 0.65 * k });
        arrow(px + 430, y - 7, px + 470, y - 7, { color: C.faint, w: 2, hs: 8, alpha: kk });
        text(effect, px + 484, y, { role: 'small', size: 23, weight: 650, color: C.heroText, alpha: kk });
        text(why, px + 484, y + 30, { role: 'small', size: 19, weight: 600, color: C.mute, alpha: kk }); });
    }
    /* the payoff */
    const H10 = b10_tenMin();
    verdict(t, 5.2, 980, 846, { from: H10.sA, to: H10.sB, unit: 'h', dec: 1, label: 'Play from a 10-minute charge, at 8 khz', better: 'higher', who: ['Viper V4 Pro', 'Theseus'], size: 110, maxW: 800 });
    source(t, 'V4 Pro: 0.169 A on 306 mAh (TechPowerUp). Theseus: Jauch LP402535JU, rated to 1.0C (370 mA); nPM1300: up to 800 mA, 22 V input, NTC, JEITA, ship mode 370 nA. CC/CV: the deck\'s battery model; hours derived from the share charged, at 8 khz: V4 Pro 45 h (Razer; TechPowerUp about 40), Theseus 50 h. Cold charging plates lithium (BU-410).', { t0: 2.4 });
  }
});

/* ---------------------------------------------------------------- 3. b10_battery: the battery, per gram ----------------
   Brock (F27 cells 4/10): "lithium ion numbers are way off", "look at smaller batteries", "a gram or two heavier ... same
   capacity"; F21.8 "battery", never "cell". The demonstration is the classroom balance: a mouse-sized Li-ion battery (the
   AAA-size 10440: 350 mAh, 9 g, akkuteile) on one pan, Theseus's Li-po pouch (LP402535JU: 370 mAh, 8 g, Jauch) on the
   other. Released, the beam swings and settles toward the Li-ion: a gram heavier for 20 mAh less. Cut open: the Li-ion's
   steel can is about 2.2 g of dead weight, the pouch's foil about 0.4 g. Payoff: energy for the weight, 144 → 171 Wh/kg,
   and in the same 8 g, 175 h → 208 h at 1 khz (derived). */
S({
  id: 'b10_battery', ch: 'elec', theme: 'paper', title: 'The battery, per gram', settle: 10, ideas: ['battery'],
  src: ['elc10440', 'b10Keep10440', 'elcLp4025', 'b10Brock'],
  replaces: ['cells'],
  answers: [
    ['"lithium ion numbers are way off"', 'The Li-ion is now a mouse-sized one, the AAA-size 10440, from two sellers\' datasheets: 350 mAh at 9 g (akkuteile) and about 10 g (Keeppower); not the 18650'],
    ['"look at smaller batteries"', 'The 10440 is the smallest common Li-ion that holds a mouse\'s charge; it sits on the balance against the 370 mAh pouch'],
    ['"a gram or two heavier ... same capacity"', 'On the balance the Li-ion is a gram heavier for 20 mAh less (scaled to 370 mAh: 9.5 to 10.6 g, so 1.5 to 2.6 g heavier); cut open, its steel can is about 2.2 g against the pouch\'s 0.4 g of foil'],
    ['(F21.8) "battery", never "cell"', 'Every word on the slide says battery; the example is named: Jauch LP402535JU']
  ],
  draw: t => {
    header(t, 'The battery, per gram');
    const cell = B10.cell, cy = B10.cyl[0], V = 3.7;
    const whkgI = cy.mAh / 1000 * V / cy.g * 1000, whkgP = cell.wh / cell.g * 1000, hI = whkgI * cell.g / 1000 / B10.w1, hP = cell.wh / B10.w1;
    /* one precision for the pair, each rounded against Theseus (R3: 140 rounded the 10440's 143.9 down): the 10440 up, the
       pouch down, 144 → 171 Wh/kg; the hours the same 8 g buys, floored, one figure for the caption and the verdict: +33 h */
    const whI = Math.ceil(whkgI - 1e-9), whP = Math.floor(whkgP + 1e-9), dh = Math.floor(hP - hI + 1e-9);
    captions(t, [[0.6, 'A Li-ion battery the size of a AAA holds 350 mAh in a steel can and weighs 9 g. Theseus\'s Li-po pouch holds 370 mAh in 8 g.'],
      [5.0, 'The can is about ' + B10.can.toFixed(1) + ' g of steel, the pouch\'s foil ' + B10.foil.toFixed(1) + ' g: the same 8 g of pouch runs ' + dh + ' h longer.']]);
    locator(t, -0.4, 94, 290, 46, 'top', msBox('top', 'battery'), { hi: ['battery'] });
    /* the balance: locked level while the batteries are set down, then released */
    const tr = 0.9, w = 2 * Math.PI * 0.9, z = 0.22, th0 = -0.11, u = Math.max(0, t - tr);
    const theta = t < tr ? 0 : th0 * (1 - Math.exp(-z * w * u) * (Math.cos(w * Math.sqrt(1 - z * z) * u) + z / Math.sqrt(1 - z * z) * Math.sin(w * Math.sqrt(1 - z * z) * u)));
    const B = b10_balance(640, 470, 330, theta, {});
    const s = 4.8, drop = 70 * (1 - ep(t, 0.0, 0.7, E.out3));
    if (B.left) {
      const L0 = B.left, R0 = B.right;
      part(L0[0], L0[1] - 5.1 * s - drop, s, () => b10_li10440MM({ label: true }));
      part(R0[0] - 8.5 * s / 2, R0[1] - drop, s, () => b10_pouchMM({ plug: 'back' }));
      ltag(L0[0] - 110, L0[1] + 60, '10440 Li-ion', null, { size: 21, color: C.secondText });
      text('350 mAh, 9 g', L0[0] - 110, L0[1] + 90, { role: 'small', size: 22, weight: 650, color: C.ink2 });
      heroTag(R0[0] - 60, R0[1] + 60, 'Li-po pouch', null, { size: 21 });
      text('370 mAh, 8 g', R0[0] - 60, R0[1] + 90, { role: 'small', size: 22, weight: 650, color: C.ink2 });
      /* the reading, under the pointer once the beam has settled */
      const kr = ep(t, 3.0, 3.4);
      if (kr > 0.003) rich([{ s: '1 g', role: 'num', size: 30, color: C.secondText }, { s: 'heavier, for 20 mAh less', role: 'small', size: 22, weight: 650, color: C.ink2, gap: 10, sentence: false }], 640, 866, { align: 'center', alpha: kr });
    }
    /* cut open: what the extra weight is */
    { const px = 1240, py = 270, pw = 600, ph = 420, kc = ep(t, 3.6, 4.6), kf = ep(t, 4.4, 4.9);
      demoWindow(px, py, pw, ph, ep(t, 3.4, 3.9));
      text('Cut open', px + 24, py + 36, { role: 'label', size: 21, color: C.mute, alpha: ep(t, 3.5, 3.9) });
      const o1 = part(px + pw / 2, py + 130, 9, () => b10_li10440MM({ cut: kc, hiCan: kc, label: true }), { alpha: ep(t, 3.4, 3.9) });
      const o2 = part(px + pw / 2 - 90, py + 340, 7.4, () => b10_pouchMM({ hiFoil: 0, plug: false }), { alpha: ep(t, 3.6, 4.1) });
      if (o1.can) callout(t, 4.4, o1.can, 'Steel can: ' + B10.can.toFixed(1) + ' g', { to: [px + 330, py + 226], side: 'l', color: C.red, tcolor: C.red, alpha: kc });
      if (o2.top) callout(t, 4.9, o2.top, 'Foil: ' + B10.foil.toFixed(1) + ' g', { to: [px + pw - 150, py + 300], side: 'r', color: C.hero, tcolor: C.heroText, alpha: kf });
    }
    /* the payoff */
    verdict(t, 5.6, 1240, 830, { from: whI, to: whP, unit: 'Wh/kg', dec: 0, label: 'Energy for the weight', better: 'higher', who: ['10440 Li-ion', 'Li-po pouch'], net: '+' + dh + ' h at 1 khz, same 8 g', size: 110, maxW: 600 });
    /* the mouse's weight as the film states it (F2.32: 29.31 g, from THS), the share from it, rounded down */
    scaleNote(80, 926, 'is ' + Math.floor(cell.g / THESEUS.mass * 100 + 1e-9) + ' % of Theseus\'s ' + THS.massG + ', set in the tail to balance it', { lead: cell.g + ' g of battery', t, t0: 6.6, size: 22 });
    source(t, 'Li-ion: akkuteile 10440, 350 mAh, 9 ± 1 g (Keeppower\'s: about 10 g). Li-po: Jauch LP402535JU, 370 mAh, 8 g. Energy at 3.7 V; hours at a Viper V4 Pro\'s draw at 1 khz. Can (0.18 mm steel) and foil (0.11 mm laminate) weights derived from their sizes.', { t0: 2.4 });
  }
});

/* ---------------------------------------------------------------- 4. b10_board: one board, one side, one reflow ----------
   Brock (F27, elc_oneside, 7/10): "good but i wish it was even better visualized". The demonstration: one reflow oven, two
   lanes, the same heat at the same moment, its temperature charted above it. A board with parts on both faces is on its
   second pass: its first face hangs upside down while that solder melts again, and the parts sink on liquid joints, held
   by surface tension alone; the Type-C, about 40 g per in² of pad, is over the 30 g/in² second-side rule (Liu 2006).
   Theseus: every part on one face, one pass, nothing hangs. The classroom version beside it: a drop hangs from a dropper
   until its weight beats the pull round the rim, and the Type-C's joint, zoomed, hangs the same way. Not shown: a part
   falling (at about 40 g/in² Liu's parts held; only heavier ones fell). */
S({
  id: 'b10_board', ch: 'elec', theme: 'night', title: 'One board, one side, one reflow', settle: 10.5, ideas: [92],
  src: ['b10Liu06', 'b10Nitk', 'b10HwbCougar', 'b10HwbCarbonX', 'dsReflow', 'b10Valid', 'b10Plan5', 'elcBrock'],
  replaces: ['elc_oneside'],
  answers: [
    ['"good but i wish it was even better visualized"', 'Rebuilt as a demonstration: two boards ride one reflow oven at the same moment, the camera riding with them and the oven\'s heat charted above with a dot for the boards. The two-faced board is on its second pass, its first face hanging upside down; as that solder melts again the parts sink on liquid joints and the Type-C is tagged over the 30 g/in² rule. Theseus\'s board, every part on top, rides the same heat once with nothing underneath. A classroom panel says why it matters: a drop hangs from a dropper until its weight beats surface tension and falls, beside the Type-C\'s joint zoomed ×4, hanging the same way'],
    ['(F2.29) "we don\'t have a front and back pcb" / "it\'ll be a single ~5.6g pcb"', 'Theseus\'s lane reads "Every part on top. Board target: ' + fmtN(THESEUS.pcb, 2) + ' g. As built: ' + fmtN(BOARD_G, 2) + ' g" (the budget\'s figure, a target: F42.2; beside it the 0.6 mm two-layer board of F47.4 as H3 built it, drawn thinner than the two-faced one) and a tag under its board says "Nothing underneath"; the verdict is oven passes 2 → 1'],
    ['(F0.5) the single-sided reflow wording', 'As validated: one pass for a one-sided board; a two-sided board\'s second pass hangs its first face upside down while it melts again. Not claimed: weaker re-melted joints (Wirth et al. saw no change in shear strength), or that the Type-C falls (Liu\'s parts held at about 40 g/in²; the slide says only that it is over the 30 g/in² rule; the drop that falls is water)']
  ],
  draw: t => {
    header(t, 'One board, one side, one reflow');
    captions(t, [[0.6, 'Parts on both faces need two oven passes. In the second, the first face hangs in melted solder.'],
      [4.4, 'Theseus puts every part on one face: one pass, every joint melted once, and nothing ever hangs.']]);
    const u = Math.max(0, t - 0.3), fb = b10_fb(u), Lp = 4200, s = 16;
    /* the map: the oven's heat along its length, the boards' thermocouple riding it; where the board sits in the mouse */
    b10_profileChart(t, 300, 290, 1000, 84, fb, {});
    locator(t, -0.4, 94, 290, 46, 'top', msBox('top', 'board'), { hi: ['board'] });
    /* one oven, two lanes, the camera riding with the boards */
    const box = [300, 420, 1000, 482], rows = [450, 696, 884], rails = [530, 792];
    const W = b10_ovenWin(t, box, fb, Lp, { rows, rails });
    let R1 = null, R2 = null;
    clipped(box[0], box[1], box[2], box[3], () => {
      R1 = b10_boardRide(t, u, W, rails[0], s, 'rival', fb, {});
      R2 = b10_boardRide(t, u, W, rails[1], s, 'ths', fb, {});
    });
    /* the lanes, named in the margin beside them */
    const l1 = 1, l2 = 1;
    text('Two faces', 80, 512, { role: 'label', size: 22, color: C.secondText, alpha: l1 });
    text('Pass 2 of 2', 80, 546, { role: 'label', size: 24, color: C.ink, alpha: l1 });
    text('As in the Cougar Revenger Pro 4K', 80, 578, { role: 'small', size: 19, weight: 600, color: C.mute, maxW: 200, lh: 1.25, alpha: l1 });
    text('Theseus', 80, 768, { role: 'label', size: 22, color: C.heroText, alpha: l2 });
    text('Pass 1 of 1', 80, 802, { role: 'label', size: 24, color: C.ink, alpha: l2 });
    text('Every part on top', 80, 834, { role: 'small', size: 19, weight: 600, color: C.mute, alpha: l2 });
    text('Board target: ' + fmtN(THESEUS.pcb, 2) + ' g', 80, 858, { role: 'small', size: 19, weight: 600, color: C.mute, alpha: l2, maxW: 214 });   /* the budget's figure, a target (F42.2, R3-b10-1) */
    /* and the board as built on Brock's 0.6 mm path (H3's hardware model, the shared BOARD_G), beside the target, never for it */
    text('As built: ' + fmtN(BOARD_G, 2) + ' g', 80, 882, { role: 'small', size: 19, weight: 600, color: C.mute, alpha: l2, maxW: 214 });
    /* the fault, named while it happens: the receptacle hangs in liquid solder, over the rule */
    if (R1) faultTag(t, 0.3 + B10_OV.uMelt + 0.4, [R1.partPt[0] - R1.part.w * s * 0.3, R1.partPt[1] + R1.part.h * s * 0.5], 'Melted again, upside down', { to: [R1.partPt[0] - 110, 632], side: 'l', sub: 'About 40 g per in² of pad; the rule is 30', maxW: 460 });
    if (R2) fixTag(t, 4.7, [R2.under[0] - 120, R2.under[1]], 'Nothing underneath', { to: [R2.under[0] - 60, 842], side: 'r' });
    /* the classroom version: a drop on a dropper, and the Type-C's joint beside it, hanging the same way */
    const r = demoPanel(t, 0.2, [1340, 262, 500, 400], {});
    { const kd = ep(t, 0.4, 0.8), uB = 4.0, grow = clamp((t - 2.6) / (uB - 2.6)), fall = t > uB ? 0.5 * 900 * Math.pow(t - uB, 2) : 0;
      clipped(r[0], r[1], 160, 196, () => b10_pendant(r[0] + 78, r[1] + 92, 13, 0.15 + 0.85 * grow, Math.min(fall, 400), { a: kd }));
      text('A water drop', r[0] + 78, r[1] + 224, { role: 'label', size: 19, color: C.mute, align: 'center', alpha: kd });
      if (R1) b10_neckZoom([r[0] + 170, r[1], 274, 196], R1, 70, { a: kd });
      text('The Type-C\'s joint, ×4', r[0] + 307, r[1] + 224, { role: 'label', size: 19, color: C.mute, align: 'center', alpha: kd });
      text('Each hangs until its weight beats the pull round its rim: 2πrγ = mg.', r[0], r[1] + 262, { role: 'small', size: 21, weight: 600, color: C.ink2, maxW: r[2], lh: 1.3, alpha: ep(t, 4.1, 4.5) });
    }
    /* the payoff */
    verdict(t, 5.2, 1340, 836, { from: 2, to: 1, label: 'Oven passes', better: 'lower', who: ['Two faces', 'Theseus'], net: 'Nothing hangs', size: 150, maxW: 500 });
    source(t, 'Second-side rule: Liu, Geiger and Shangguan, Materials Transactions 2006 (30 g of part per in² of pad, with a safety factor). The Type-C, 0.40 g on about 6.5 mm² of pad (about 40 g/in²): estimates from the board model. Oven: a lead-free profile, about 4 minutes a pass shown in 3 s; the sag is drawn larger than life.', { t0: 2.4 });
  }
});

/* ---------------------------------------------------------------- 5. b10_sealed: a coat that keeps water out ----------
   Brock (F27 elecsheet1 7/10): "show joe this protects against water for very little weight, something few might do". The
   demonstration: a drop of sweat (salt water: Na⁺ and Cl⁻, 10 to 90 mmol/L) lands across two pads at battery voltage.
   Bare, tin goes into the water at the + pad and comes out at the − pad as a growing metal tree (electrochemical
   migration) until it bridges them: DTU shorted a part under a salty drop at 5 V in 14 to 62 s, the saltier the sooner (its
   drops 0.27 to 2.7 mmol/L, derived: sweat is saltier than all four), so the clock stops at the saltiest drop's 14 s. Wipe
   to Theseus: the same drop sits on a 50 µm coat, off the metal, and the clock runs to 2 minutes with no short: Yoo 2024
   saw no failure on a coated part under sweat-salty drops (17 and 51 mmol/L) at 3 to 12 V in tests run until the drop
   dried (under 200 s; the paper gives no exact length, so the clock stops well inside it). Classroom: tin crystals from a 9 V battery and two paper clips (ACS). Cost: about 0.23 g of coat, plan 5's board. */
S({
  id: 'b10_sealed', ch: 'elec', theme: 'paper', title: 'A coat that keeps water out', settle: 11, ideas: [98],
  src: ['b10Sweat', 'b10Dtu12', 'b10Yoo24', 'b10Dfr', 'b10Medgyes13', 'b10Humiseal', 'b10Hyperx', 'b10AcsTin', 'b10Plan5'],
  replaces: ['elecsheet1'],
  answers: [
    ['"show joe this protects against water"', 'A drop of sweat across two powered pads: bare, a tin tree grows across and shorts them (DTU: 14 to 62 s at 5 V, the saltier the sooner; sweat is saltier than all four of its drops); wiped to Theseus\'s coated board, the drop sits on the film and the clock runs to 2 minutes with no short (a coated part under sweat-salty drops at 3 to 12 V: Yoo 2024, no failure in tests run until the drop dried, under 200 s)'],
    ['"for very little weight"', 'About 0.2 g of coat at 50 µm over both faces of plan 5\'s board (0.1 to 0.3 g for 25 to 75 µm, derived), under 1 % of the mouse'],
    ['"something few might do"', 'Said: few mice protect the board; HyperX\'s Pulsefire Haste Wireless (IP55, "to withstand sweat") is named as the exception'],
    ['(elecsheet1) the ON/OFF switch panel', 'Not on this slide: the switch\'s place is the bottom cover (F29.3) and ship mode is on b10_charge']
  ],
  draw: t => {
    header(t, 'A coat that keeps water out');
    captions(t, [[0.6, 'Sweat is salt water. Across two powered pads it grows a tin tree from one to the other: on a bare board, a short in seconds.'],
      [6.0, 'Theseus\'s board is coated: the same drop sits on the film, off the metal, and two minutes on there is still no short.']]);
    const P = KEY_PARTS.board.pts; let A2 = 0; for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length]; A2 += a[0] * b[1] - b[0] * a[1]; }
    const area = Math.abs(A2) / 2 / 100, coatG = um => 2 * area * 1.1 * um / 1e4 * 1.05;   /* cm², both faces + 10 % for the parts' flanks, urethane 1.05 g/cm³ */
    locator(t, -0.4, 94, 290, 46, 'top', msBox('top', 'board'), { hi: ['board'] });
    const box = [200, 280, 900, 560], s = 166, cx = box[0] + box[2] / 2, cy = box[1] + box[3] / 2 + 46;
    const fall = ep(t, 0.0, 0.5, E.in3), grow = clamp((t - 1.0) / 3.2), clockA = 14 * grow, sh = env(t, 4.2, 4.25, 4.6, 5.0);
    const tB = Math.max(0, t - 6.0), clockB = Math.min(120, tB * 80);   /* the coated clock: 2 minutes (by 7.5 s, so the payoff lands by about 8 s: A1, M6), twice DTU's slowest bare 62 s, inside Yoo's under-200 s tests */
    demoWindow(box[0], box[1], box[2], box[3], 1, { plain: true });
    let R = null;
    clipped(box[0], box[1], box[2], box[3], () => wipeTo(t, 5.0, 0.9, box,
      k => { R = part(cx, cy, s, () => b10_padsMM({ drop: { r: 1.05, k: fall }, ions: ep(t, 0.8, 1.2) * (1 - ep(t, 4.2, 4.6)), tree: grow, short: sh, t, seed: 7 })); },
      k => { part(cx, cy, s, () => b10_padsMM({ drop: { r: 1.05, k: 1, bead: 1 }, coat: 1, t })); }, { rival: 'Bare board', right: 'Theseus' }));
    /* the clock and the state of the pair */
    { const theseus = t >= 5.9, clk = theseus ? clockB : clockA, shorted = !theseus && grow >= 1;
      rich([{ s: Math.floor(clk) + ' s', role: 'num', size: 48, color: shorted ? C.red : C.ink }, { s: theseus ? 'coated' : 'bare', role: 'label', size: 20, color: theseus ? C.heroText : C.secondText, gap: 12 }], box[0] + 28, box[1] + 64, {});
      text(shorted ? 'Shorted: DTU\'s saltiest drop (sweat is saltier)' : theseus ? 'No current' : 'Tin crossing the gap', box[0] + 28, box[1] + 100, { role: 'label', size: 21, color: shorted ? C.red : theseus ? C.heroText : C.mute });
      text('5 V across a 0.5 mm gap', box[0] + box[2] - 24, box[1] + 40, { role: 'label', size: 19, color: C.mute, align: 'right' });
      if (theseus) text('Coat drawn as a tint: it is 50 µm thick', box[0] + box[2] - 24, box[1] + box[3] - 22, { role: 'label', size: 19, color: C.faint, align: 'right' }); }
    if (R && R.gapC && t < 5.0) { faultTag(t, 4.25, R.gapC, 'Shorted at 14 s', { to: [R.gapC[0] + 150, box[1] + box[3] - 70], side: 'r', maxW: 300 }); }   /* no sub: it could not type in before the wipe; the status line names the drop */
    /* the classroom version */
    { const px = 1160, py = 280, pw = 680, ph = 372, r = demoPanel(t, 0.2, [px, py, pw, ph], { src: 'ACS 2023' });
      b10_beaker(r[0] + 130, r[1] + r[3] - 6, 140, clamp((t - 1.2) / 3.0), {});
      text('Tin chloride solution, a 9 V battery and two paper clips: tin grows from the − clip.', r[0] + 300, r[1] + 40, { role: 'small', size: 21, weight: 600, color: C.ink2, maxW: r[2] - 300, lh: 1.3 }); }
    /* the payoff: the time to a short, and what the coat costs */
    { const k1 = ep(t, 7.6, 8.0), k2 = ep(t, 7.9, 8.3);
      text('A sweat drop on powered pads', 1160, 704, { role: 'label', size: 22, color: C.mute, alpha: k1 });
      rich([{ s: '14 to 62 s', role: 'num', size: 60, color: C.secondText }, { s: 'to a short, bare', role: 'small', size: 24, weight: 650, color: C.ink2, gap: 14, sentence: false }], 1160, 776, { alpha: k1 });
      rich([{ s: 'None', role: 'd1', size: 60, color: C.heroText, grad: C.heroGrad }, { s: 'in 2 minutes, coated', role: 'small', size: 24, weight: 650, color: C.ink2, gap: 14, sentence: false }], 1160, 850, { alpha: k2 });
      /* the coat's cost, rounded up (against Theseus); its share from the printed grams, said as "under 1 %" */
      const gC = Math.ceil(coatG(50) * 100 - 1e-9) / 100;
      scaleNote(1160, 914, 'of coat (50 µm, both faces): ' + (gC / THESEUS.mass < 0.01 ? 'under 1 %' : Math.ceil(gC / THESEUS.mass * 100) + ' %') + ' of the mouse', { lead: '+' + gC.toFixed(2) + ' g', t, t0: 8.3, size: 22 }); }
    text('Few mice protect the board: HyperX rates its Pulsefire Haste Wireless IP55 against sweat.', 200, 880, { role: 'small', size: 21, weight: 600, color: C.mute, alpha: ep(t, 8.6, 9.0), maxW: 900 });
    source(t, 'Sweat: Na⁺ and Cl⁻ 10 to 90 mmol/L (GSSI). Bare: DTU 2012, a NaCl drop on an 0805 part at 5 V, 62 s down to 14 s as the drop goes from 0.27 to 2.7 mmol/L (derived). Coated: Yoo 2024, a coated part under 17 and 51 mmol/L drops at 3 to 12 V: no failure in tests run until the drop dried (under 200 s). Coat: 25 to 75 µm (HumiSeal); weight from plan 5\'s board, ' + area.toFixed(1) + ' cm² a face: ' + coatG(25).toFixed(2) + ' to ' + coatG(75).toFixed(2) + ' g. Pads 166× life size; growth time-lapsed.', { t0: 2.4 });
  }
});

/* ---------------------------------------------------------------- 6. b10_wires: braided, not ribbon -------------------
   Brock rated the old elc_tear 8/10 and elc_flex 7/10 (no notes): their demonstration is kept, on one stage, with the
   kit's verdict, and with one number corrected (08:45 rule: no model carried forward unchecked): the old slide said a
   nicked ribbon tears at 0.07 N, Kapton's propagating tear, and headlined 200×; but the tear must also break each copper
   trace it reaches, about 0.26 N for a 0.1 mm × 12 µm trace (220 MPa, derived), so the honest gap is about 45× (0.3 → 14.0 N). */
S({
  id: 'b10_wires', ch: 'elec', theme: 'night', title: 'Braided, not ribbon', settle: 12, ideas: [51, 69],
  src: ['elcKapton', 'elcCu', 'elcAwg', 'elcShengyi', 'elcAlexander', 'b10HwbCougar', 'b10Brock'],
  replaces: ['elc_tear', 'elc_flex'],
  answers: [
    ['elc_tear (8/10, rated, no note)', 'Kept: the nicked ribbon and the braid with a cut strand on one stage, pulled by the pointer; the ribbon tears across, the braid holds. Corrected: the tear force now counts the copper traces the tear must break (about 0.26 N each, derived), not only the film\'s 0.07 N, so the verdict says about 45× (0.3 → 14.0 N), not the old 200×'],
    ['elc_flex (7/10, rated, no note)', 'Kept as its numbers under the demonstration: a ribbon\'s copper takes the whole fold on one line (copper-clad film rated for 50 to 80 folds at 0.38 mm), finer strands last longer (Alexander 1953: 351 bends for 7 strands, 2,908 for 105)'],
    ['(F2.38) the simulation and its statistic on the slide', 'The pull is read out live beside the pointer, and the verdict gives the ratio'],
    ['(F3.6) "Won\'t tear like ribbon" and "Flex life" here, "Less radio noise" on b10_twist', 'As asked']
  ],
  draw: t => {
    header(t, 'Braided, not ribbon');
    captions(t, [[0.6, 'Many mice reach the side buttons with a ribbon: copper printed on film. Nick its edge, and a pull piles up at the nick until it tears across, as paper does.'], [6.6, 'Theseus braids three wires on a JST plug: pulled, they share the load; cut one, and two still carry it.']]);
    const X = 80, Y = 280, Wd = 1200, Ht = 440, ka = 1;
    demoWindow(X, Y, Wd, Ht, ka, { plain: true });
    const yA = Y + 132, yB = Y + 340, bx = X + 30, bw = 140, xc0 = bx + bw, xEnd = X + 1040, tabW = 56, wR = 90;
    elc_slab(bx, Y + 30, bw, Ht - 60, 1, { routes: [yA - 60, yB - 50] });
    text('One board', bx + bw / 2, Y + Ht - 52, { role: 'label', size: 21, color: '#E8E8EB', align: 'center' });
    text('Pulls: illustration', X + Wd - 32, Y + 50, { role: 'label', size: 20, color: C.faint, align: 'right', alpha: ep(t, 3.0, 3.4) });
    const xn = xc0 + 120, tabX = xEnd + tabW / 2, cutX = xc0 + 540, sleeveX = xEnd + 30;
    const L2 = ep(t, 8.7, 10.1, E.io3), layPx = 190 * (1 + 0.06 * L2), Ab = 8 * (1 - 0.18 * L2);
    const sY = elc_strandY(cutX, xc0 + 8, yB, Ab, layPx, 1);
    const keys = [[1.9, [xn + 70, yA - 96]], [2.4, [xn, yA - wR / 2 - 2]], [2.7, [xn, yA - wR / 2 - 2]], [3.3, [tabX, yA + 4]], [3.5, [tabX, yA + 4]], [4.7, [tabX + 26, yA - 18]], [6.0, [tabX + 34, yA - 20]], [6.4, [tabX + 84, yA - 6]],
      [7.0, [cutX + 60, yB - 84]], [7.4, [cutX, sY]], [7.7, [cutX, sY]], [8.5, [sleeveX, yB + 2]], [8.7, [sleeveX, yB + 2]], [10.1, [sleeveX + 26, yB - 18]], [12.5, [sleeveX + 26, yB - 18]]];
    const P = t > 1.6 ? kf(t, keys, E.cam) : keys[0][1], Pr = kf(Math.min(t, 6.4), keys, E.cam);
    /* the ribbon: nicked, pulled, torn across (the film tears at 0.07 N; each trace it meets takes about 0.26 N) */
    const kA = 1, L1 = ep(t, 3.5, 4.7, E.io3), torn = t >= 6.0;
    const kRows = t < 2.5 ? 0 : t < 4.7 ? 4 : Math.round(lerp(4, 24, E.in3(prog(t, 4.7, 6.0))));
    const aNick = 0.5 * kRows / 4, Kt = kRows ? 1 + 2 * Math.sqrt(aNick / 0.02) : 1;
    const xr1 = lerp(xc0 + 6, xEnd, kA), liftA = t < 3.5 || torn ? 0 : P[1] - (yA + 4), tabCol = '#8E7442';
    elc_conn(xc0 + 12, yA, 'zif', 1);
    if (!torn) {
      elc_ribbon(xc0 + 6, xr1, yA, wR, { k: kRows, xn, load: L1, Kt, dy: liftA, alpha: ka });
      rr(xEnd, yA - wR / 2 + liftA, tabW, wR, 8, tabCol, null, 1, ka);
      if (kRows && L1 > 0.05) warm(xn, yA - wR / 2 + kRows * wR / 24, 34 + 30 * L1, heatCol(1), 0.5 * L1);
    } else {
      elc_ribbon(xc0 + 6, xn, yA, wR, { k: 24, xn, load: 0, alpha: ka });
      const ox = Pr[0] - tabX, oy = Pr[1] - (yA + 4), rot = 0.03 * ep(t, 6.0, 6.6);
      G.save(); G.translate(xn + ox, yA + oy); G.rotate(rot); G.translate(-xn, -yA);
      elc_ribbon(xn + 5, xEnd, yA, wR, { k: 0, xn: -1e4, load: 0, alpha: ka }); rr(xEnd, yA - wR / 2, tabW, wR, 8, tabCol, null, 1, ka);
      G.restore();
    }
    text('Ribbon cable (FPC)', xc0 + 24, yA - wR / 2 - 24, { role: 'label', size: 22, color: C.ink });
    text('Polyimide film, three copper traces', xc0 + 24 + tw('Ribbon cable (FPC)', { role: 'label', size: 22 }) + 22, yA - wR / 2 - 24, { role: 'small', size: 25, color: C.mute });
    if (kRows && t < 6.0) callout(t, 2.8, [xn, yA - wR / 2 + 4 * wR / 24], 'Kt ≈ 11 at the nick\'s tip', { to: [xn + 170, yA + wR / 2 + 30], side: 'r', color: C.bad, sub: 'a 0.5 mm nick, its tip 0.02 mm round', maxW: 600 });
    const onTrace = [5, 12, 19].some(j => Math.abs(kRows - j - 0.5) < 1.2) && t > 4.7, FA = t < 4.7 ? 0.07 * L1 : onTrace ? 0.26 : 0.07;
    if (t > 3.5 && t < 6.4) text(fmtN(FA, 2) + ' N', P[0] + 28, P[1] + 46, { font: 'mono', size: 24, weight: 700, color: onTrace ? C.bad : C.ink, alpha: ep(t, 3.5, 3.8) });
    /* the braid: one strand cut, pulled, and the other two hold */
    const kB = 1, xb1 = lerp(xc0 + 8, xEnd, kB), cut = t >= 7.6, gap = cut ? 6 + 30 * E.out3(prog(t, 7.6, 8.0)) : 0;
    const FB = 2.0 * L2, per = cut ? FB / 2 : FB / 3, hk = per / ELB.wireN, heat = [hk, cut ? 0 : hk, hk];
    elc_conn(xc0 + 12, yB, 'jst', 1);
    const liftB = t < 8.7 ? 0 : P[1] - (yB + 2);
    G.save(); if (liftB) { const sk = liftB / (xEnd - xc0); G.transform(1, sk, 0, 1, 0, -sk * xc0); }
    elc_braid(xc0 + 8, xb1, yB, Ab, layPx, 13, { heat, cut: cut ? { i: 1, x: cutX, gap } : null, alpha: ka, sweep: t > 10.4 ? lerp(xc0 - 200, xEnd + 200, ((t - 10.4) % 3.2) / 3.2) : null });
    elc_sleeve(xEnd - 4, yB, 64, 34, ka);
    G.restore();
    const hw = heroTag(xc0 + 24, yB - 50, 'Theseus', 'braided', {});
    text('Three 32 AWG wires on a JST plug', xc0 + 24 + hw + 18, yB - 50, { role: 'small', size: 25, color: C.mute });
    if (cut) callout(t, 7.8, [cutX, sY], 'One strand cut', { to: [cutX + 150, yB + 58], side: 'r', color: C.bad });
    if (t > 8.7) text(fmtN(FB, 2) + ' N', P[0] + 28, P[1] + 46, { font: 'mono', size: 24, weight: 700, color: C.ink, alpha: ep(t, 8.7, 9.0) });
    const down = (t > 3.5 && t < 6.4) || t > 8.7;
    if (t > 1.6) cursorAt(t, keys, [2.5, 3.5, 7.6, 8.7], { grab: down, ease: E.cam });
    /* the payoff, beside the drawing */
    const rx = X + Wd + 40, FB2 = 2 * ELB.wireN;
    verdict(t, 10.2, rx, 520, { from: 0.3, to: Math.floor(FB2), unit: 'N', dec: 1, label: 'Pull to tear it, once damaged', better: 'higher', who: ['Ribbon', 'Theseus'], net: 'about 45×', size: 96, maxW: 520 });   /* 14.0 / 0.3 = 46.7, said to the figure the 0.3 allows */
    text('Nicked ribbon: 0.07 N through the film, about 0.26 N at each trace. Braid, one strand cut: two strands of ' + fmtN(ELB.wireN, 1) + ' N each.', rx, 668, { role: 'small', size: 21, weight: 600, color: C.mute, maxW: RM - rx, lh: 1.3, alpha: ep(t, 10.8, 11.2) });
    /* the words under it, and the bend (the old flex slide's numbers) */
    const by = Y + Ht + 28;
    glossBox(t, 2.0, X, by, 520, 'FPC', 'Copper traces sealed in polyimide film: many mice\'s side-button lead.', { size: 21 });
    sourceBox(t, 3.2, X + 560, by, 640, 'Folded hard', 'A ribbon takes the fold on one line: rated for 50 to 80 folds at 0.38 mm (Shengyi). Finer strands last longer (Alexander 1953).', { kind: 'datasheet', size: 21 });
    noteBox(t, 6.8, X + 1240, by, RM - X - 1240, { kind: 'estimate', label: 'Estimate', value: 'Brock', size: 21, body: 'Ribbons are the most common failure in assembly and repair (#51).' });
    source(t, 'Kapton HN: propagating tear 0.07 N. A trace: 0.1 mm × 12 µm × 220 MPa ≈ 0.26 N (typical sizes, derived). A wire: 220 MPa × 0.032 mm² ≈ 7 N (32 AWG), derived.', { t0: 3 });
  }
});

/* ---------------------------------------------------------------- 7. b10_twist: twisted pairs, a quiet radio -----------
   The old elc_twist and elc_lay (not rated) merged: their demonstration kept (the pointer drags a pulsing coil along two
   60 mm leads: side by side, one loop and the current adds up; twisted, the loop flips every half lay and the halves
   cancel), with the lay's trade beside it (tighter cancels more and adds copper, Brock's caveat #69) and the kit's verdict.
   Checked before reuse (08:45): the model is an ideal twist (a perfect helix, a coil's field falling as a dipole's), so
   its −36 dB is said to be derived; Klipec's measurement (a 2-inch lay five to six times better than steel conduit) and
   NASA's caveat (twisting adds little when a return wire is already beside it, at 2 to 200 MHz) are kept in view.
   Colours (F35.1): the coil and its field in neutral ink, the side-by-side loop's current in red (the fault), the twisted
   pair's alternating halves in two neutral tones; blue only for the 6 mm mark and the verdict. The radio: on plan 5 the
   side-button lead (J3) leaves the board about 6 mm from the antenna (the module's front 3.5 mm, 0.8 mm up; J3's nearest
   solder 6.2 mm, GEO2D.pcb). */
S({
  id: 'b10_twist', ch: 'elec', theme: 'paper', title: 'Twisted pairs, a quiet radio', settle: 11, ideas: [69],
  src: ['elcKlipec', 'elcNasaTem', 'elcCu', 'elcAwg', 'antDetune', 'b10Harvard', 'b10Brock'],
  replaces: ['elc_twist', 'elc_lay'],
  answers: [
    ['elc_twist (not rated, no note)', 'Kept as the demonstration: the pointer drags a pulsing coil along the two leads; the side-by-side pair\'s one loop lights and its current runs round, the twisted pair\'s lobes flip sign and cancel'],
    ['elc_lay (not rated, no note)', 'Beside it, the lay\'s trade: noise and copper against lay, the 6 mm sweet spot marked (−36 dB for 3 mg over both leads, against 41 mg at a tight 1.5 mm)'],
    ['(Brock #69) braided too tight, the weight adds up', 'Shown on the lay chart: the copper curve, and why 6 mm and not tighter'],
    ['(F3.6) "Less radio noise" here', 'As asked']
  ],
  draw: t => {
    header(t, 'Twisted pairs, a quiet radio');
    captions(t, [[0.6, 'A ribbon\'s traces run side by side: one long loop. A changing field beside it, from a regulator\'s coil, drives current round all of it.'], [5.8, 'Twist them, and the loop flips every half turn: each half picks up the opposite of the last, and they cancel.'],
      [8.8, 'On plan 5 the side-button lead leaves the board about 6 mm from the radio\'s antenna: twisted, it carries less of the coil\'s noise past it.']]);
    const A = TH ? '#5E5F66' : '#B8B8BF', X = 80,   /* the coil and its field: neutral ink (blue is Theseus's alone) */ Y = 280, Wd = 1180, Ht = 460, ka = 1;
    demoWindow(X, Y, Wd, Ht, 1, { plain: true });
    text('A 60 mm lead, a coil 5 mm beside it', X + 24, Y + 36, { role: 'label', size: 21, color: C.mute });
    const S0 = 15, xL = X + 120, xR = xL + ELB.leadL * S0, ys = Y + 250, yP = ys - ELB.h * S0 - 6, yT = ys + ELB.h * S0 + 6, sep = 16;
    /* the source: the pointer drags it along the lead */
    const keys = [[2.0, [xL + 300, ys + 110]], [2.6, [xL + 470, ys + 6]], [2.8, [xL + 470, ys + 6]], [4.0, [xL + 200, ys + 6]], [5.2, [xL + 760, ys + 6]], [5.9, [xL + 470, ys + 6]], [6.4, [xL + 470, ys + 6]], [7.2, [xL + 980, ys + 150]], [11.5, [xL + 980, ys + 150]]];
    const P = kf(t, keys, E.cam), xsPx = t < 2.8 ? xL + 470 : t > 6.4 ? xL + 470 : P[0], xs = (xsPx - xL) / S0;
    const ks = 1, osc = Math.sin(t * 4.2), vis = 0.45 + 0.55 * Math.abs(osc);   /* the coil is on from frame one */
    for (let i = 0; i < 7; i++) { const ph = ((t * 0.5 + i / 7) % 1), r = 14 + ph * 240; circle(xsPx, ys, r, { color: A, w: 2, alpha: ks * 0.4 * Math.pow(1 - ph, 1.6) }); }
    G.save(); G.globalAlpha = ks; const gC = G.createRadialGradient(xsPx - 5, ys - 6, 2, xsPx, ys, 24); gC.addColorStop(0, '#FFFFFF'); gC.addColorStop(1, A); G.fillStyle = gC; G.beginPath(); G.arc(xsPx, ys, 20, 0, TAU); G.fill(); G.restore();
    for (let i = 0; i < 3; i++) circle(xsPx, ys, 8 + i * 4, { color: '#0D0E0F', w: 1.6, alpha: ks * 0.55 });
    text('Noise source', xsPx + 34, ys + 8, { role: 'label', size: 21, color: C.ink2, alpha: ks });
    const B = x => Math.pow(1 + Math.pow((x - xs) / ELB.h, 2), -1.5);
    const wireA = TH ? '#55565C' : '#D6D4CE', wireB = TH ? '#8E8B84' : '#8E8B84';
    /* the side-by-side pair: one loop; all of it pushes current the same way */
    const kP = 1, xPe = lerp(xL, xR, kP);
    for (let x = xL; x < xPe; x += 4) { const b = B((x - xL) / S0); if (b < 0.015) continue; G.globalAlpha = ka * ks * 0.6 * b * vis; G.fillStyle = C.bad; G.fillRect(x, yP - sep + 3, 4.4, sep * 2 - 6); }   /* the current that adds up: the fault, red */
    G.globalAlpha = 1;
    line(xL, yP - sep, xPe, yP - sep, { color: wireA, w: 5, cap: 'round', alpha: ka }); line(xL, yP + sep, xPe, yP + sep, { color: wireB, w: 5, cap: 'round', alpha: ka });
    if (kP > 0.98 && ks > 0) {
      for (let x = xL + 30; x < xR; x += 60) { const b = B((x - xL) / S0); if (b > 0.12) text('+', x, yP + 9, { font: 'mono', size: 24, weight: 700, color: '#FFFFFF', align: 'center', alpha: ka * clamp(b * 2) * ks }); }
      G.save(); G.setLineDash([12, 14]); G.lineDashOffset = -t * 150; G.strokeStyle = C.bad; G.globalAlpha = ks * (0.5 + 0.5 * vis); G.lineWidth = 3.5;
      G.beginPath(); G.moveTo(xL, yP - sep - 9); G.lineTo(xR + 9, yP - sep - 9); G.lineTo(xR + 9, yP + sep + 9); G.lineTo(xL, yP + sep + 9); G.stroke(); G.restore();
    }
    text('Side by side, as in a ribbon: one loop, the current adds up', xL, yP - sep - 34, { role: 'label', size: 22, color: C.ink, alpha: ep(t, 1.2, 1.6) });
    /* the twisted pair: lobes that flip sign every half lay */
    const lay = ELB.lay, lp = lay * S0, kT = 1, xTe = lerp(xL, xR, kT), lobeP = TH ? '#6E6F76' : '#A9A9B0', lobeM = TH ? '#C9C9CF' : '#4A4B52';   /* + and − halves: two neutral tones */
    for (let x = xL; x < xTe; x += 3) {
      const u = (x - xL) / S0, b = B(u), wdt = Math.abs(Math.cos(TAU * u / lay)) * sep; if (b < 0.015) continue;
      G.globalAlpha = ka * ks * 0.6 * b * vis; G.fillStyle = Math.floor(2 * u / lay + 0.5) % 2 ? lobeM : lobeP; G.fillRect(x, yT - wdt, 3.4, wdt * 2);
    }
    G.globalAlpha = 1;
    const strand = (ph0, col) => { const pts = []; for (let x = xL; x <= xTe; x += 3) pts.push([x, yT + sep * Math.cos(TAU * (x - xL) / lp + ph0)]); poly(pts, { color: col, w: 5, alpha: ka }); };
    strand(Math.PI, wireB); strand(0, wireA);
    if (kT > 0.98 && ks > 0) for (let hI = 0; hI < 2 * ELB.leadL / lay; hI++) {
      const u0 = hI * lay / 2, b = B(u0); if (b < 0.12) continue;
      text(hI % 2 ? '−' : '+', xL + u0 * S0, yT + 9, { font: 'mono', size: 24, weight: 700, color: hI % 2 ? C.ink : '#FFFFFF', align: 'center', alpha: ka * clamp(b * 2) * ks });
    }
    text('Twisted, ' + lay + ' mm lay: each half cancels the next', xL, yT + sep + 50, { role: 'label', size: 22, color: C.ink, alpha: ep(t, 1.5, 1.9) });
    if (t > 1.7 && t < 7.7) cursorAt(t, keys, [2.8], { grab: t > 2.8 && t < 6.4, ease: E.cam, a: ep(t, 1.7, 2.0) * (1 - ep(t, 7.2, 7.6)) });   /* gone once it lets go */
    /* the lay's trade: noise and copper against lay, the sweet spot */
    { const px = 1300, py = 280, pw = 540, ph = 380, x0 = px + 100, x1 = px + pw - 50, y0 = py + 80, y1 = py + ph - 70, Lmin = 1.5, Lmax = 24;
      demoWindow(px, py, pw, ph, 1, { plain: true });
      text('How tight to twist', px + 24, py + 36, { role: 'label', size: 21, color: C.mute });
      const LX = p => x0 + (x1 - x0) * Math.log(p / Lmin) / Math.log(Lmax / Lmin), RY = d => y0 + (y1 - y0) * clamp(-d / 60), TY = mg => y1 - (y1 - y0) * clamp(mg / 45);
      for (const d of [0, -20, -40, -60]) { line(x0, RY(d), x1, RY(d), { color: C.hair, w: 1.2 }); text(d + ' dB', x0 - 10, RY(d) + 7, { role: 'tick', color: C.mute, align: 'right' }); }
      for (const p of [1.5, 3, 6, 12, 24]) text(fmtN(p, p < 2 ? 1 : 0) + ' mm', LX(p), y1 + 30, { role: 'tick', color: C.mute, align: 'center' });
      text('Lay', x1, y1 + 58, { role: 'label', size: 19, color: C.mute, align: 'right' });
      const Rp = [], Tp = []; for (let x = x0; x <= x1; x += 4) { const p = Lmin * Math.pow(Lmax / Lmin, (x - x0) / (x1 - x0)); Rp.push([x, RY(Math.max(-60, elc_rejDB(p)))]); Tp.push([x, TY(ELB.cuMg * elc_takeup(p))]); }
      poly(Rp, { color: C.ink, w: 3 }); poly(Tp, { color: C.second, w: 3, dash: [9, 6] });
      text('Noise', x1 - 6, RY(-32) - 10, { role: 'label', size: 19, color: C.ink, align: 'right' });
      text('Copper added', LX(1.9) + 8, TY(ELB.cuMg * elc_takeup(1.9)) + 26, { role: 'label', size: 19, color: C.secondText });
      const k6 = ep(t, 7.0, 7.4), x6 = LX(ELB.lay);
      line(x6, y0, x6, y1, { color: C.heroText, w: 2, dash: [5, 5], alpha: k6 }); circle(x6, RY(elc_rejDB(ELB.lay)), 9, { fill: C.hero, alpha: k6 }); circle(x6, TY(ELB.cuMg * elc_takeup(ELB.lay)), 7, { fill: C.second, alpha: k6 });
      text('Theseus: 6 mm', x6 + 10, y0 + 18, { role: 'label', size: 19, color: C.heroText, alpha: k6 }); }
    sourceBox(t, 3.6, 1300, 690, 540, 'Klipec, IEEE 1967', 'Measured: a pair twisted to a 2-inch lay picked up five to six times less than wires in steel conduit.', { kind: 'study', size: 21 });
    /* the payoff */
    const r0 = elc_reject(ELB.lay), mg6 = ELB.cuMg * elc_takeup(ELB.lay);
    verdict(t, 7.6, 80, 866, { from: 100, to: Math.ceil(r0 * 100), unit: '%', label: 'Noise picked up, against side by side (a coil 5 mm away; an ideal twist, derived)', better: 'lower', who: ['Side by side', 'Twisted'], net: false, size: 96, maxW: 1100 });
    scaleNote(560, 866, 'of copper over both leads, against ' + fmtN(ELB.cuMg * elc_takeup(1.5), 0) + ' mg at a tight 1.5 mm lay', { lead: '+' + fmtN(mg6, 0) + ' mg', t, t0: 8.4, size: 22 });
    source(t, 'Model (derived, an ideal twist): two 60 mm leads of three 32 AWG wires; the coil\'s field falls as a dipole\'s; pickup is the field\'s part at the lay. Copper: wire = √(1 + (2πr/lay)²), r 0.23 mm, 9.0 g/cm³. NASA: twisting adds little where a return wire already runs beside.', { t0: 2.4 });
  }
});

/* ---------------------------------------------------------------- 8. b10_cable: an angled plug, a paracord cable ---------
   Brock (F27, cable 3/10): "extremely lazy visualizations, paracord needs better assets"; the brief: the paracord drawn
   properly, the angled plug on the shell, the drag it removes. The demonstration, the mouse in profile with the camera
   riding it (the pad slides under): a straight plug brings the cable down to the pad at the chin, where its slack lies; a
   flick forward runs the chin onto it, the mouse pitches about its rear skates, and the sensor rises past its 1 mm
   lift-off: the cursor freezes mid-flick and the shot misses. Rewind, wipe to Theseus: the plug turns up, the paracord
   arcs over the pad and comes down far ahead; the same flick, nothing reaches the chin, the shot lands. Beside it the
   cable close up: the woven sheath (16 carriers, over two and under two, a tracer yarn) and the cable cut across. */
S({
  id: 'b10_cable', ch: 'elec', theme: 'paper', title: 'An angled plug, a paracord cable', settle: 11, ideas: [19, 20, 70],
  src: ['b10PulsarCable', 'b10TpuV3', 'gld_paw3395', 'b10Brock', 'elcXa25'],
  replaces: ['cable'],
  answers: [
    ['"extremely lazy visualizations"', 'Rebuilt as a demonstration on the mouse in profile, the camera riding it: with a straight plug the cable comes down to the pad at the chin; a flick runs the chin onto its slack, the mouse pitches about its rear skates and the sensor rises past its 1 mm lift-off, so the cursor freezes mid-flick and the shot misses. Rewound and wiped to Theseus: the plug turns up, the cable arcs over the pad, the same flick passes clean and the shot lands. Each lift is computed on its own mouse: most mice drawn as the film\'s neutral rival mouse (its chin, skates, port and sensor), Theseus from its shell'],
    ['"paracord needs better assets"', 'The paracord is drawn as a woven sheath: 16 carriers crossing over two and under two, each yarn with its fibres and the edge where it dives under in shadow, foreshortened round the cylinder, with a blue tracer yarn; and the cable cut across (sheath, filler, four stranded conductors)'],
    ['(brief) the angled plug on the shell, the drag it removes', 'The L plug sits in the nose\'s port and lifts the cable straight up, so none of it lies on the pad at the chin (Pulsar sells the same idea: it "prevents cable drag against the desk")'],
    ['#20 (Brock\'s doc): a Goldilocks cable, "the tension in the bent cable is stronger than the weight of the mouse"', 'Said on the close-up: its name gives the thickness, "Theseus\'s cable, about ' + fmtN(B10_CAB.dt, 0) + ' mm", and from 6.7 s why: "Thin enough not to tug a ' + fmtN(THESEUS.mass, 0) + ' g mouse; XBAB\'s 1.9 mm cable still passes USB high speed" (XBAB\'s XA25 page: 1.9 mm, 6.9 g/m, passes the USB 2.0 high-speed eye test). Theseus\'s cable is 2 mm on the pad too, not only in its arc. The angled plug above is the other half: no cable under the chin']
  ],
  draw: t => {
    header(t, 'An angled plug, a paracord cable');
    captions(t, [[0.6, 'A straight plug brings the cable down to the pad at the chin. Flick forward, and the chin rides onto it: the sensor lifts off and stops tracking.'],
      [3.8, 'Theseus\'s plug turns up, so its paracord arcs over the pad: the same flick, and nothing at the chin.']]);
    /* two mice: most mice's (the kit's neutral rival, its own chin, skates, port and sensor) with a straight plug, Theseus's
       shell with its angled plug; each lift is computed on its own mouse's shape (b10_geo) */
    const C0 = B10_CAB, GR = b10_geo('rival'), GT = b10_geo('ths'), s = 6.4, mx = 470, py = 668, dc = C0.dc;
    const box = [80, 270, 1220, 450];
    /* the flicks: A (straight plug) 0.9 s, rewound from 2.4 s; B (Theseus) 4.1 s: the same distance. Δ = how far the mouse has
       gone over the pad: enough to run the straight plug's slack back under the rival's front skate */
    const zh0 = GR.zp + 21 + 4, D1 = zh0 - (GR.zf - 4);
    const dA = b10_flick(t, 0.9, 0.55, D1) * (1 - ep(t, 2.4, 3.0, E.io3)), dB = b10_flick(t, 4.1, 0.55, D1), D = t < 3.4 ? dA : dB;
    const liftAt = (dd, angled) => angled ? 0 : (GR.zl - GR.zr) * Math.sin(b10_pitch(zh0 - dd, dc, false, GR));
    /* where tracking stops in flick A: the first Δ at which the lens has risen past the lift-off */
    const stopA = (() => { for (let k = 0; k <= 200; k++) if (liftAt(D1 * k / 200, false) >= C0.lod) return k / 200; return null; })();
    const L1 = liftAt(D1, false);
    const scene = mode => {
      const ths = mode === 'ths', g = ths ? GT : GR, th = ths ? 0 : b10_pitch(zh0 - D, dc, false, GR), sn = Math.sin(th), cs = Math.cos(th);
      /* mouse frame (z, h) → stage, the mouse pitched about the rear skates' back edge; pad points don't pitch */
      const M = (z, h) => { const zz = g.zr + (z - g.zr) * cs - h * sn, hh = (z - g.zr) * sn + h * cs; return [mx + zz * s, py - hh * s]; };
      const Pd = (z, h) => [mx + z * s, py - h * s];
      /* the pad, its weave marks sliding back as the mouse moves */
      G.fillStyle = TH ? '#E4E4E7' : '#1A1B1E'; G.fillRect(box[0], py, box[2], box[1] + box[3] - py);
      line(box[0], py, box[0] + box[2], py, { color: C.faint, w: 1.5 });
      for (let z = -120; z < 160; z += 10) { const x = mx + (z - (D % 10)) * s; if (x > box[0] && x < box[0] + box[2]) line(x, py + 3, x, py + 9, { color: inkA(0.18), w: 1.5 }); }
      /* the slack: the cable lying on the pad from its far end back to where it doubles over */
      const zEdge = (box[0] + box[2] - mx) / s + 10, zSl = ths ? GT.zp + 64 - D : zh0 - D;
      /* Theseus's slack is its own 2 mm paracord (A1, #20: it was drawn at the stock cable's 3 mm under the 2 mm arc) */
      if (ths) b10_paracord([Pd(zSl, C0.dt / 2), Pd(zEdge, C0.dt / 2)], C0.dt * s, { cols: ['#2A2E36', '#3A404B'], tracer: C.hero, slide: -D * s });
      else b10_paracord([Pd(zSl, dc / 2), Pd(zEdge, dc / 2)], dc * s, { cols: TH ? ['#3A3F48', '#4A505B'] : ['#4A505B', '#5A616D'], slide: -D * s });
      /* the mouse: Theseus's simplified mouse, or most mice's neutral rival (FILM F9: a rival never wears Theseus's outline) */
      part(mx, py, s, () => { xabout(g.zr, 0, -th); if (ths) mouseSimple('right', { show: ['sensor', 'skates'] }); else mouseRival('right', { show: ['sensor'] }); });
      /* the plug in the port, the cable from it */
      const port = M(g.zp, g.hP), cr = ths ? C0.dt / 2 : dc / 2;
      const pl = b10_plug(port[0], port[1], s, 1, ths, { rot: -th, cr });
      let path;
      if (!ths) {
        const T = Math.max(zh0 + 6 - D, (pl.out[0] - mx) / s + 5), E0 = pl.out, Tp = Pd(T, dc / 2), dx = Tp[0] - E0[0];
        path = b10_bez(E0, [E0[0] + dx * 0.5, E0[1]], [Tp[0] - dx * 0.5, Tp[1]], Tp, 30).concat([Pd(zEdge, dc / 2)]);
        b10_paracord(path, dc * s, { cols: ['#2A2E36', '#3A404B'], slide: 0 });
      } else {
        const E0 = pl.out, Tz = GT.zp + 72 - D, Tp = Pd(Tz, C0.dt / 2);
        path = b10_bez(E0, [E0[0], E0[1] - 16 * s], [mx + (GT.zp + 30 - D * 0.35) * s, py - (37 + D * 0.12) * s], Tp, 40).concat([Pd(zEdge, C0.dt / 2)]);
        b10_paracord(path, C0.dt * s, { cols: ['#2A2E36', '#3A404B'], tracer: C.hero, slide: 0 });
      }
      /* the gap under the lens, marked when it opens */
      const lens = M(g.zl, 0), gap = py - lens[1];
      if (!ths && gap > 2) { const col = gap / s >= C0.lod ? C.red : C.mute; line(lens[0], py, lens[0], lens[1], { color: col, w: 2.5 }); line(lens[0] - 7, lens[1], lens[0] + 7, lens[1], { color: col, w: 2.5 }); line(lens[0] - 7, py, lens[0] + 7, py, { color: col, w: 2.5 }); }
      /* the name of what is drawn */
      if (ths) heroTag(104, 310, 'Theseus', 'Angled plug, paracord', { size: 22 });
      else ltag(104, 310, 'Most mice', 'Straight plug', { size: 22, color: C.mute, vcolor: C.secondText });
      return { th, chin: ths ? M(g.chin[0][0] + 1.5, 1.2) : M(g.zf + g.skHalf - 1.5, 0.4), lens };
    };
    demoWindow(box[0], box[1], box[2], box[3], 1, { plain: true });
    let R = null;
    clipped(box[0], box[1], box[2], box[3], () => { wipeTo(t, 3.0, 0.8, box, k => { R = scene('rival'); }, k => { R = scene('ths'); }, { rival: 'Most mice', right: 'Theseus', labels: false }); });
    /* the flick, named while it happens */
    { const kf = Math.max(env(t, 0.75, 0.9, 1.45, 1.75), env(t, 3.95, 4.1, 4.65, 4.95));
      if (kf > 0.003) { arrow(mx - 80, 372, mx + 80, 372, { color: C.ink2, w: 3, hs: 12, alpha: kf }); text('Flick', mx, 356, { role: 'label', size: 21, color: C.ink2, align: 'center', alpha: kf }); } }
    if (R && t < 2.6) faultTag(t, 1.35, R.chin, 'Chin on the cable', { to: [R.chin[0] + 150, 470], side: 'r', sub: 'The mouse tips back on its rear skates', maxW: 300, alpha: 1 - ep(t, 2.3, 2.6) });
    /* the sensor's height over the pad, magnified, against its lift-off */
    { const gx = 80, gy = 748, gw = 560, gh = 196, lift = t < 3.4 ? liftAt(dA, false) : 0, over = lift >= C0.lod;
      demoWindow(gx, gy, gw, gh, 1, { plain: true });
      text('Sensor lift', gx + 24, gy + 36, { role: 'label', size: 21, color: C.mute });
      rich([{ s: (Math.floor(lift * 10) / 10).toFixed(1), role: 'num', size: 54, color: over ? C.red : C.ink }, { s: 'mm', role: 'label', size: 22, color: C.mute, gap: 8, caps: false }], gx + 24, gy + 112, {});
      text(over ? 'Tracking stops' : 'Tracking', gx + 24, gy + 152, { role: 'label', size: 21, color: over ? C.red : (t < 3.4 ? C.ink2 : C.heroText) });
      const k = 40, base = gy + gh - 26, x0 = gx + 300, x1 = gx + gw - 24;
      G.fillStyle = TH ? '#E4E4E7' : '#1A1B1E'; G.fillRect(x0 - 10, base, x1 - x0 + 20, 16);
      line(x0 - 10, base, x1 + 10, base, { color: C.faint, w: 1.5 });
      line(x0 - 10, base - C0.lod * k, x1 + 10, base - C0.lod * k, { color: C.red, w: 1.5, dash: [7, 6], alpha: 0.8 });
      text('Lift-off, 1 mm', x1, base - C0.lod * k - 10, { role: 'label', size: 19, color: C.red, align: 'right' });
      const bx = x0 + 30, bw2 = 120, by = base - lift * k;
      rr(bx, by - 38, bw2, 38, 4, TH ? '#FFFFFF' : '#2A2B2F', inkA(0.6), 1.5);
      rr(bx + bw2 / 2 - 20, by - 7, 40, 7, 2, over ? C.red : t < 3.4 ? C.ink2 : C.hero, null, 1);   /* the rival's lens in ink, blue once it is Theseus's (A1, F35.1) */
      text('Lens', bx + bw2 / 2, by - 15, { role: 'label', size: 19, color: C.mute, align: 'center' });
      text('×6', x1, gy + 36, { role: 'label', size: 19, color: C.faint, align: 'right' });
      /* human scale: credit cards (0.76 mm, ISO/IEC 7810) stacked under the lens */
      { const nc = lift / SCALE.card.mm; if (nc >= 1.5) text((nc >= 2.6 ? 'Nearly three' : nc >= 1.9 ? 'About two' : 'Over one and a half') + ' credit cards', gx + 24, gy + 180, { role: 'small', size: 19, weight: 600, color: C.mute, alpha: ep(nc, 1.5, 1.9) }); }
    }
    /* the shot: the cursor rides the flick, and freezes where the sensor stopped tracking */
    { const rect = [672, 748, 520, 196];
      if (t < 3.0) b10_aim(t, -1, rect, b10_flick(t, 0.9, 0.55, D1) / D1, stopA, 1.55, { label: 'The cursor freezes mid-flick' });
      else b10_aim(t, 3.0, rect, dB / D1, null, 4.75, { label: 'The cursor follows the flick' });
    }
    /* the payoff */
    verdict(t, 5.4, 1240, 885, { from: Math.floor(L1 * 10) / 10, to: 0, unit: 'mm', dec: 1, label: 'Sensor lift, same flick', better: 'lower', who: ['Straight plug', 'Theseus'], size: 130, maxW: 600 });
    /* the cable, close up: the woven sheath, and the cable cut across */
    { const px = 1340, py2 = 270, pw = 500, ph = 450, kc = ep(t, 5.9, 6.3), kin = ep(t, 3.8, 4.3);
      if (kin > 0.003) {
      demoWindow(px, py2, pw, ph, kin);
      /* his #20, the Goldilocks cable (A1: listed in ideas, never said): its thickness in the panel's name, and why under it;
         the woven band runs lower on the right to leave the two lines clear */
      text('Theseus\'s cable, about ' + fmtN(C0.dt, 0) + ' mm', px + 24, py2 + 36, { role: 'label', size: 21, color: C.heroText, alpha: kin });
      text('Thin enough not to tug a ' + fmtN(THESEUS.mass, 0) + ' g mouse; XBAB\'s 1.9 mm cable still passes USB high speed.', px + 24, py2 + 70, { role: 'small', size: 20, weight: 600, color: C.ink2, maxW: pw - 48, lh: 1.3, alpha: kin * ep(t, 6.7, 7.1) });
      G.save(); G.globalAlpha *= kin;
      clipped(px, py2, pw, ph, () => b10_paracord(b10_bez([px - 20, py2 + 210], [px + 170, py2 + 230], [px + 260, py2 + 130], [px + pw + 20, py2 + 140], 60), 46, { tracer: C.hero, slide: Math.max(0, t - 5.9) * 30 }));
      const o = part(px + pw - 110, py2 + 330, 52, () => cableMM({}));
      text('Cut across', px + pw - 110, py2 + ph - 22, { role: 'label', size: 19, color: C.faint, align: 'center' });
      G.restore();
      if (o.sheath && kin > 0.5) {
        callout(t, 6.1, o.sheath, 'Woven nylon sheath', { to: [px + pw - 230, py2 + 262], side: 'l', color: C.heroText, tcolor: C.ink, alpha: kc, maxW: 220 });
        callout(t, 6.4, o.core, 'Four conductors', { to: [px + pw - 230, py2 + 372], side: 'l', color: C.heroText, tcolor: C.ink, alpha: kc, maxW: 220 });
      }
      }
    }
    source(t, 'Lift from each mouse\'s outline, skates and lens: a typical rival (120 × 63 × 39 mm, port 7.8 mm up) and Theseus\'s shell; a 3 mm stock cable, an illustration (none is published). Lift-off 1 mm: the PAW3395\'s lower setting. Pulsar\'s bent plug "prevents cable drag against the desk"; the Viper V3 Pro\'s stiff cable "prevents playing while charging" (TechPowerUp).', { t0: 2.4 });
  }
});

/* ---------------------------------------------------------------- 9. b10_lights: nothing lights up but the sensor -------
   Brock (F27 srf_encoder 2/10; sealed: "still drawing the encoder poorly", "a magnetic encoder that doesn't get affected by
   dust and have a transparent top housing to see when it's broken like switches"; elc_sheet2: "add the no rgb light to the
   slide about having no optical components", "put it next to the web software"). The demonstration, on a dark stage: the
   mouse from above in x-ray as the Viper V4 Pro builds it ("all in on optical", Razer): two optical switches and an
   optical wheel, each LED pulsing whether or not anything is pressed, each with its share of the battery (Omron's pulse,
   Avago's timing with 5 mA assumed). They go out one by one: mechanical switches draw nothing until pressed, the magnetic
   wheel's TMR sensor 3 µA; only the sensor's light is left. Then the dust test: both wheels turn the same steps while dust
   falls in; the optical gate's beam is cut by a speck and steps go missing; the magnet's field passes the dust and every
   step counts, its clear top showing the spring and magnet. */
S({
  id: 'b10_lights', ch: 'elec', theme: 'night', title: 'Nothing lights up but the sensor', settle: 12, ideas: ['encoder', 78, 84, 99],
  src: ['srf_razerAllOptical', 'b10Gpx2Hours', 'b03_logiHybrid', 'b03_d2fp', 'srf_avagoWheel', 'b10MdtTmr', 'b10G703', 'srf_mpsMag', 'pulsarEnc', 'srf_fmSupport', 'gld_paw3395o'],
  replaces: ['srf_encoder'],
  answers: [
    ['srf_encoder (2/10, rated, no note)', 'Rebuilt as a demonstration: the Viper V4 Pro from above in x-ray (drawn as the film\'s neutral rival mouse, at its size) with its three pulsing LEDs (two optical switches, an optical wheel), each with its share of the battery; they go out one by one as it hands over to Theseus\'s mouse, where only the sensor lights; then a dust test with both wheels turning the same steps'],
    ['(sealed) "still drawing the encoder poorly"', 'The shared magnetic encoder drawing (the clear top over the rotor, detent star, leaf spring and magnet, its field turning), large, in the dust test'],
    ['(sealed) "a magnetic encoder that doesn\'t get affected by dust"', 'Dust falls into both gates: a speck cuts the optical beam and steps go missing; the magnet\'s field passes the dust and every step is counted'],
    ['(sealed) "transparent top housing to see when it\'s broken like switches"', 'Called out on the encoder: "Clear top: the spring and magnet in sight"'],
    ['(elc_sheet2) "add the no rgb light to the slide about having no optical components"', 'The RGB light is here with its cost: Logitech rates the G703 for 32 h with the lights off, 24 h with RGB cycling (spec sheet); Theseus has none'],
    ['(elc_sheet2) "put it next to the web software"', 'Placed just before b10_software'],
    ['(F31.1) Razer staff: the switches and wheel cost "almost half" the battery', 'Not repeated as a fact: the slide derives its own share, about a fifth at 1 khz (' + B10.lightsShown().total.toFixed(1) + ' %, the printed parts\' sum): the switches from Logitech\'s own hours for the G Pro X Superlight 2 (0.116 mA a switch, the lower of the film\'s two derivations; Omron\'s pulse would say 0.15), the wheel from Avago\'s timing with its 5 mA said to be assumed. So the same battery lasts ' + Math.floor(B10.lights.gain * 100 + 1e-9) + ' % longer with Theseus\'s switches and wheel in their place (their own 9 µA counted), the film\'s figure (b03_switch shows the switches alone, +15 %)'],
    ['(V6, move 6) one saving, one figure', 'The verdict counts the switches alone, as the film\'s hours do (13.6 to 0.4 %, +15 %, 194 h); the wheel\'s share keeps its row, named assumed and not counted']
  ],
  draw: t => {
    header(t, 'Nothing lights up but the sensor');
    /* V6: the film counts the switches alone (ntr_hours, b03_switch, b01_battery: +15 %, 194 h); the wheel's share rests on an
       assumed 5 mA, so it is shown and named as not counted (it was in the verdict: +23 %, a second figure for one saving) */
    const swPct = (2 * B10.lightsShown().sw).toFixed(1) + ' %';
    captions(t, [[0.6, 'The Viper V4 Pro\'s optical switches pulse their LEDs hundreds of times a second, pressed or not: ' + swPct + ' of its battery, and its optical wheel more.'],
      [4.4, 'Mechanical switches and a magnetic wheel draw nothing until used: only Theseus\'s sensor lights up.']]);
    const L = B10.lights, off = [ep(t, 2.6, 2.9), ep(t, 2.9, 3.2), ep(t, 3.3, 3.6)];   /* left switch, right switch, wheel */
    /* the Viper V4 Pro from above, in x-ray, drawn as the kit's neutral rival at its own size (EloShapes; FILM F9: a rival never
       wears Theseus's outline), its lights pulsing; as they go out it hands over to Theseus's simplified mouse */
    const kX = ep(t, 2.6, 3.6, E.io3), box = [80, 300, 420, 560];
    const mR = rivalFit(box, 'top', { dims: b10_dims('Razer Viper V4 Pro', [127.1, 63.9, 39.9]), show: ['sensor', 'board', 'switches'], fill: '#151619', alpha: Math.max(0.004, 1 - kX) });
    const mT = mouseFit(box, 'top', { show: ['sensor', 'board'], fill: '#151619', alpha: Math.max(0.004, kX) });
    const alR = { trigL: 'switchL', trigR: 'switchR' }, atR = n => mR.at(alR[n] || n);
    const at = n => { const a = atR(n), b = mT.at(n); return [lerp(a[0], b[0], kX), lerp(a[1], b[1], kX)]; }, pulse = (ph, f) => 0.55 + 0.45 * Math.max(0, Math.sin(t * f + ph));
    const lights = [{ p: atR('trigL'), k: 1 - off[0], ph: 0 }, { p: atR('trigR'), k: 1 - off[1], ph: 1.3 }, { p: atR('wheel'), k: 1 - off[2], ph: 2.1 }];
    lights.forEach(l => { if (l.k > 0.003) { glow(l.p[0], l.p[1], 46, C.second, 0.55 * l.k * pulse(l.ph, 9)); circle(l.p[0], l.p[1], 5, { fill: C.second, alpha: l.k }); } });
    /* the sensor's light: both mice have it. Its LED is infrared (PixArt: 850 nm), unseen, so it is drawn as the film draws
       light (b04_camera's LED, in ink), a soft neutral glow, never in red, the faults' colour (R3) */
    { const p = at('sensor'); glow(p[0], p[1], 40, C.ink, 0.3); circle(p[0], p[1], 4, { fill: C.ink }); }
    /* each light named, with its share of the battery (against the V4 Pro's whole draw at 1 khz) */
    const lx = 560, row = (y, p, name, val, k, thsName, thsVal) => {
      const a = k, b = 1 - k;
      line(p[0] + 12, p[1], lx - 16, y - 8, { color: a > 0.5 ? C.second : C.hero, w: 1.5, alpha: 0.7 });
      if (a > 0.003) { text(name, lx, y, { role: 'label', size: 21, color: C.mute, alpha: a }); text(val, lx, y + 34, { role: 'num', size: 30, color: C.ink2, alpha: a }); }   /* the shares in ink: the glows carry the yellow (A1, F35.1 sparingly) */
      if (b > 0.003) { text(thsName, lx, y, { role: 'label', size: 21, color: C.heroText, alpha: b }); text(thsVal, lx, y + 34, { role: 'num', size: 30, color: C.ink, alpha: b }); }
    };
    /* the rival's shares rounded down, Theseus's up: neither rounding favours Theseus */
    const pc = v => (Math.floor(v * 1000) / 10).toFixed(1) + ' %', pcU = v => (Math.ceil(v * 1000) / 10).toFixed(1) + ' %';
    row(392, at('wheel'), 'Optical wheel, assumed', B10.lightsShown().wh.toFixed(1) + ' %', lights[2].k, 'Magnetic wheel', pcU(L.tmr / L.avg));
    /* a mechanical switch draws only its pull-up's trickle: b03's 3 µA a switch (B03.mechUA), so the three slides agree */
    const mSh = L.mUA / 1000 / L.avg;
    row(492, at('trigR'), 'Optical switch', B10.lightsShown().sw.toFixed(1) + ' %', lights[1].k, 'Mechanical switch', pcU(mSh));
    row(592, at('trigL'), 'Optical switch', B10.lightsShown().sw.toFixed(1) + ' %', lights[0].k, 'Mechanical switch', pcU(mSh));
    { const p = at('sensor'); line(p[0] + 12, p[1], lx - 16, 684, { color: C.faint, w: 1.5, alpha: 0.7 }); text('Sensor, infrared', lx, 692, { role: 'label', size: 21, color: C.mute }); text('Both have it, unseen', lx, 724, { role: 'small', size: 22, weight: 600, color: C.ink2 }); }
    text(t < 3.6 ? 'Viper V4 Pro' : 'Theseus', 290, 900, { role: 'label', size: 22, color: t < 3.6 ? C.secondText : C.heroText, align: 'center' });
    text('No RGB either: Logitech rates its G703 for 32 h with the lights off, 24 h with RGB cycling.', lx, 790, { role: 'small', size: 22, weight: 600, color: C.mute, maxW: 360, lh: 1.3, alpha: ep(t, 4.0, 4.4) });
    /* the payoff */
    { const mPct = Math.ceil(2 * mSh * 1000 - 1e-9) / 10, gain = typeof B03 !== 'undefined' ? b03_floor(B03.lifeGain * 100, 0) : String(Math.floor((L.avg / (L.avg - L.sw + 2 * L.mUA / 1000) - 1) * 100 + 1e-9));
      verdict(t, 4.9, 980, 846, { from: 2 * B10.lightsShown().sw, to: mPct, unit: '%', dec: 1, label: 'Battery to the switches (the wheel, assumed, not counted)', better: 'lower', who: ['Viper V4 Pro', 'Theseus'], net: '+' + gain + ' % hours, same battery', size: 96, maxW: 700 }); }
    /* the dust test: both wheels turn the same steps while dust falls in */
    { const px = 980, py = 290, pw = 860, ph = 420, hw = (pw - 24) / 2, kd = ep(t, 6.4, 8.6, E.lin), turn = Math.max(0, t - 6.0) * 4, total = 16, n = Math.min(total, Math.floor(turn));
      demoWindow(px, py, pw, ph, 1, { plain: true });
      text('Dust in the wheel', px + 24, py + 36, { role: 'label', size: 21, color: C.mute });
      text('Optical, as the V4 Pro', px + 24, py + 76, { role: 'label', size: 20, color: C.secondText });
      text('Magnetic, Theseus', px + hw + 48, py + 76, { role: 'label', size: 20, color: C.heroText });
      /* which steps the optical gate missed: the beam cut by settled dust at that step (seeded) */
      const r2 = rng(5), miss = []; for (let i = 0; i < total; i++) { const at_t = 6.0 + (i + 0.5) / 4, d = clamp((at_t - 6.4) / 2.2); miss.push(r2() < 0.75 * d * d + 0.1 * d); }
      const gy = py + 112, gx = px + 40, gw = hw - 60;
      b10_optGate(gx, gy, gw, 196, turn, kd);
      text('IR LED', gx + 40, gy + 52, { role: 'label', size: 19, color: C.faint, align: 'center' });
      text('Slots', gx + gw / 2, gy - 6, { role: 'label', size: 19, color: C.faint, align: 'center' });
      text('Light sensor', gx + gw - 40, gy + 52, { role: 'label', size: 19, color: C.faint, align: 'center' });
      const enc = part(px + hw + 110, py + 160, 12, () => encoderMM({ th: turn * TAU / 24, field: 1, dust: kd }));   /* H2: the 2D encoder's axle is 12 mm up */
      if (t >= 6.0) {
        const cO = b10_steps(px + 40, py + 342, n, total, 22, i => miss[i], C.second);
        const cM = b10_steps(px + hw + 48, py + 342, n, total, 22, () => false, C.hero);
        text('Counted ' + cO + ' of ' + n, px + 40, py + 390, { role: 'label', size: 21, color: cO < n ? C.red : C.mute });
        text('Counted ' + cM + ' of ' + n, px + hw + 48, py + 390, { role: 'label', size: 21, color: C.heroText });
      }
      if (enc.cover) callout(t, 9.2, enc.cover, 'Clear top', { to: [px + pw - 150, py + 130], side: 'r', color: C.heroText, tcolor: C.ink, sub: 'Spring and magnet in sight', maxW: 140 });
    }
    source(t, 'Shares of a Viper V4 Pro\'s 1.70 mA at 1 khz (306 mAh, 180 h), derived: an optical switch 0.116 mA, from Logitech\'s 96 h optical-only against 104 h hybrid (Superlight 2; Omron\'s pulse: 0.15 mA); its wheel LED 40 µs every 2 ms (Avago) at 5 mA, assumed, so not in Theseus\'s hours; TMR 1.5 µA an axis (MDT); a mechanical switch 3 µA. Sensor LED: infrared (PixArt). Dust: illustrative (MPS).', { t0: 2.4 });
  }
});

/* ---------------------------------------------------------------- 10. b10_software: set it once, in the browser -------
   Brock (F27 software 6/10, no note; gld_soft 7/10: "place near web software", "better sell the importance of liftoff
   distance being 0.1mm configurable"). The demonstration: the mouse in profile at the end of a swipe, lifted to reset while
   the hand still moves; below the lift-off height the sensor keeps counting, so the cursor drifts. The fair case (R2-b10-9,
   FILLS Q3): a PAW3395 rival ships at 1 mm, so the coarse step only costs a player whose pad loses tracking at 1 mm (it
   reads under 1.2 mm, TechPowerUp): a 1-or-2 sensor must then sit at 2 mm, while 0.1 mm steps stop at 1.2. Drift 3.0 → 1.8
   mm, 40 % less (illustration: 0.15 m/s sideways, 0.1 m/s up; the pad is an example). Razer's software has 26 levels, said.
   The setting is made in a browser tab (WebHID: Chrome and Edge), nothing installed, and saved on the mouse. Ends on the
   hand lifting the mouse: b07_shcard's hands follow. */
S({
  id: 'b10_software', ch: 'elec', theme: 'paper', title: 'Set it once, in the browser', settle: 11, ideas: [23, 65, 66, 87, 'lod'],
  src: ['webhid', 'gld_paw3395', 'b10TpuXliteLod', 'b10PulsarX3Lod', 'b10RazerCutoff', 'b10Brock'],
  replaces: ['software', 'gld_soft'],
  answers: [
    ['software (6/10, rated, no note)', 'Kept and sharpened: a browser tab, nothing installed, the settings saved on the mouse, the limits stated (Chrome and Edge, WebHID)'],
    ['(gld_soft) "place near web software"', 'Merged: its lift-off, X and Y and saved-on-the-mouse are in this slide, which follows b10_lights'],
    ['(gld_soft) "better sell the importance of liftoff distance being 0.1mm configurable"', 'Demonstrated: the mouse lifts to reset mid-swipe; below the lift-off the sensor keeps counting and the cursor drifts. On a pad that loses tracking at 1 mm, a 1-or-2 mm sensor (the PAW3395) must sit at 2; the pointer drags Theseus\'s lift-off from 2.0 down to 1.2 mm in 0.1 mm steps, and the same lift drifts 40 % less (illustration, speeds and pad said; Razer\'s 26 levels named)'],
    ['(G10) simple', 'One demonstration and one tab']
  ],
  draw: t => {
    header(t, 'Set it once, in the browser');
    captions(t, [[0.6, 'Lift to reset, and the sensor counts until it clears its lift-off height: set high, the cursor drifts on every lift.'], [5.4, 'Theseus sets lift-off in 0.1 mm steps, just above where your pad stops tracking: in a browser tab, saved on the mouse.']]);
    /* the lift-off the pointer sets: 2.0 mm, dragged to 1.2 in 0.1 mm steps; this pad (an example) loses tracking below 1.2 */
    const FLOOR = 1.2, lod = Math.round(lerp(2.0, FLOOR, ep(t, 3.2, 4.6, E.io3)) * 10) / 10;
    /* the lift, twice: the first at 2.0 mm (0.9 to 2.6 s), the second at 1.2 mm (5.2 to 6.9 s) */
    const cyc = t < 4.0 ? clamp((t - 0.9) / 1.7) : clamp((t - 5.2) / 1.7), hNow = 4.5 * E.io3(clamp((cyc - 0.15) / 0.7)), D = b10_drift(lod);
    /* the sensor, close up, at the end of a swipe: the hand lifts the mouse to reset while still moving it sideways */
    const px = 80, py = 280, pw = 980, ph = 470, s = 24, pad = py + ph - 80, zl = b10_cabLive().zl, y0 = KEY_PARTS.lens.y0;
    const sw = 7 * E.out3(cyc), mx = px + pw / 2 - zl * s - 3.5 * s + sw * s;
    demoWindow(px, py, pw, ph, 1, { plain: true });
    clipped(px, py, pw, ph, () => {
      G.fillStyle = TH ? '#E4E4E7' : '#1A1B1E'; G.fillRect(px, pad, pw, py + ph - pad);
      line(px, pad, px + pw, pad, { color: C.faint, w: 1.5 });
      const lodY = pad - (y0 + lod) * s;
      line(px, pad - y0 * s, px + pw, pad - y0 * s, { color: C.faint, w: 1, dash: [3, 6] });
      line(px, lodY, px + pw, lodY, { color: C.red, w: 2, dash: [8, 6], alpha: 0.85 });
      part(mx, pad - hNow * s, s, () => mouseSimple('right', { show: ['sensor'], fill: TH ? '#E6E6E9' : '#232428', lw: 3 }));
      /* the lens's path through the lift: red while it is still under the lift-off (still counting) */
      const pts = []; for (let k = 0; k <= 60; k++) { const c = k / 60 * cyc, h = 4.5 * E.io3(clamp((c - 0.15) / 0.7)); pts.push([px + pw / 2 - 3.5 * s + 7 * E.out3(c) * s, pad - (y0 + h) * s, h]); }
      const below = pts.filter(q => q[2] <= lod), above = pts.filter(q => q[2] >= lod);
      if (below.length > 1) poly(below.map(q => [q[0], q[1]]), { color: C.red, w: 5 });
      if (above.length > 1) poly(above.map(q => [q[0], q[1]]), { color: C.faint, w: 2, dash: [4, 5] });
      text('Lift-off ' + lod.toFixed(1) + ' mm', px + 24, lodY - 10, { role: 'label', size: 20, color: C.red });
      if (below.length > 1) { const q = below[0]; text('Still tracking', q[0] - 14, q[1] + 30, { role: 'label', size: 19, color: C.red, align: 'right' }); }   /* left of the red path's start, clear of the lens label */
      text('Lens at rest, ' + y0.toFixed(1) + ' mm over the pad', px + pw - 24, pad - y0 * s + 26, { role: 'label', size: 19, color: C.mute, align: 'right' });
    });
    locator(t, -0.4, px + 30, py + 150, 70, 'right', msBox('right', 'sensor'), { hi: ['sensor'] });
    /* what the drift does in a game (R2-b10-10): the crosshair slides off the target as the lens rises through the lift-off,
       then the player re-aims for the next lift. 800 cpi at 0.022° a count (an illustration, said); 1° = 40 px */
    { const ix = px + pw - 312, iy = py + 22, iw = 288, ih = 178, tx = ix + iw / 2, ty = iy + ih / 2 + 16, PX = 40;
      const f = cyc > 0 ? clamp(hNow / lod) : 0, off = f * D.deg * PX, ka = ep(t, 0.6, 1.0);
      rr(ix, iy, iw, ih, 10, TH ? '#FFFFFF' : '#151619', inkA(0.18), 1.5, ka);
      text('Your crosshair', ix + 16, iy + 30, { role: 'label', size: 19, color: C.mute, alpha: ka });
      circle(tx, ty, 16, { fill: inkA(0.16), alpha: ka }); circle(tx, ty, 16, { color: inkA(0.45), w: 1.5, alpha: ka });
      const cxh = tx + off, col = f > 0.02 ? C.red : C.ink;
      line(cxh - 22, ty, cxh - 7, ty, { color: col, w: 2.5, alpha: ka }); line(cxh + 7, ty, cxh + 22, ty, { color: col, w: 2.5, alpha: ka });
      line(cxh, ty - 22, cxh, ty - 7, { color: col, w: 2.5, alpha: ka }); line(cxh, ty + 7, cxh, ty + 22, { color: col, w: 2.5, alpha: ka });
      const dShown = lod > FLOOR ? Math.floor(D.deg * 10 + 1e-9) / 10 : Math.ceil(D.deg * 10 - 1e-9) / 10;   /* against Theseus: the 2 mm step's down, Theseus's up */
      if (f > 0.02) text(dShown.toFixed(1) + '° off', ix + iw - 16, iy + ih - 16, { role: 'num', size: 22, color: C.red, align: 'right', alpha: ka * clamp(f * 3) }); }
    text('Counted while lifting', px + 24, py + 40, { role: 'label', size: 20, color: C.red });
    rich([{ s: D.mm.toFixed(1), role: 'num', size: 48, color: lod > FLOOR ? C.secondText : C.heroText }, { s: 'mm of cursor drift a lift', role: 'small', size: 22, weight: 650, color: C.ink2, gap: 10, sentence: false }], px + 24, py + 100, {});
    /* the browser tab: nothing installed; the lift-off slider in 0.1 mm steps; saved on the mouse */
    { const bx = 1100, by = 280, bw = 740, bh = 470;
      rr(bx, by, bw, bh, 10, TH ? '#FFFFFF' : '#151619', inkA(0.18), 1.5);
      rr(bx, by, bw, 46, 10, inkA(0.05), null, 1); for (let i = 0; i < 3; i++) circle(bx + 24 + i * 20, by + 23, 6, { fill: inkA(0.22) });
      rr(bx + 100, by + 9, 360, 28, 6, inkA(0.06), null, 1); text('Theseus · settings', bx + 116, by + 30, { role: 'label', size: 19, color: C.mute });
      const sx0 = bx + 48, sx1 = bx + bw - 48, sy = by + 150, X = v => lerp(sx0, sx1, (v - 0.5) / 1.5);
      text('Lift-off', sx0, sy - 44, { role: 'label', size: 22, color: C.ink });
      text(lod.toFixed(1) + ' mm', sx1, sy - 44, { role: 'num', size: 26, color: lod > FLOOR ? C.ink : C.heroText, align: 'right' });
      line(sx0, sy, sx1, sy, { color: C.hair, w: 6 });
      /* below this pad's floor the sensor loses the pad: the track's low end in red, an example pad */
      line(X(0.5), sy, X(FLOOR - 0.05), sy, { color: C.red, w: 6, alpha: 0.35 });
      text('This pad loses tracking', X(0.5), sy - 14, { role: 'label', size: 19, color: C.red, alpha: 0.9 });
      line(X(FLOOR), sy, X(lod), sy, { color: C.hero, w: 6 });
      for (let v = 0.5; v <= 2.001; v += 0.1) line(X(v), sy + 12, X(v), sy + (Math.abs(v * 10 % 5) < 0.01 ? 26 : 20), { color: C.faint, w: 1.5 });
      for (const v of [0.5, 1.0, 1.5, 2.0]) text(v.toFixed(1), X(v), sy + 50, { role: 'tick', color: C.mute, align: 'center' });
      circle(X(lod), sy, 13, { fill: C.hero }); circle(X(lod), sy, 13, { color: '#FFFFFF', w: 2 });
      text('0.1 mm steps. The PAW3395 offers 1 or 2 mm, so on this pad it sits at 2. Razer\'s software: 26 levels.', sx0, sy + 88, { role: 'small', size: 20, weight: 600, color: C.mute, maxW: sx1 - sx0, lh: 1.25 });
      const rows = [['DPI', '800'], ['X and Y', 'set apart'], ['Polling', '8 khz']];
      rows.forEach(([l, v], i) => { const yy = by + 300 + i * 46; text(l, sx0, yy, { role: 'label', size: 20, color: C.ink2 }); text(v, sx1, yy, { role: 'small', size: 21, weight: 650, color: C.ink, align: 'right' }); line(sx0, yy + 16, sx1, yy + 16, { color: C.hair, w: 1 }); });
      const ks = ep(t, 4.8, 5.2); text('Saved on the mouse', sx1, by + bh - 30, { role: 'label', size: 19, color: C.heroText, align: 'right', alpha: ks });   /* plain blue text, no capsule (F9.5) */
      if (t > 2.8 && t < 5.0) { const kx = X(lod), ky = sy; cursorPtr(kx + 4, ky + 6, { a: ep(t, 2.8, 3.1) * (1 - ep(t, 4.7, 5.0)), grab: t > 3.2 && t < 4.6 }); }
    }
    /* the payoff */
    const D2 = b10_drift(2.0), D8 = b10_drift(FLOOR);
    verdict(t, 7.2, 80, 880, { from: D2.mm, to: D8.mm, unit: 'mm', dec: 1, label: 'Cursor drift each lift, on a pad that loses tracking at 1 mm (an example)', better: 'lower', who: ['2 mm step', 'Theseus, 1.2 mm'], net: false, size: 96, maxW: 980 });
    scaleNote(1100, 862, 'to install: it runs in Chrome or Edge (WebHID)', { lead: 'Nothing', t, t0: 7.6, size: 22 });
    source(t, 'Drift: the hand still moving 0.15 m/s sideways while lifting at 0.1 m/s, so the sensor counts for lift-off ÷ 0.1 m/s, at 800 cpi and 0.022° a count: an illustration. PAW3395: 1 or 2 mm (PixArt); its 1 mm stops under 1.2 mm (TechPowerUp); a Pulsar X3 ships at 1 mm (a third-party tool). Razer: 26 levels. WebHID: Chrome and Edge 89+.', { t0: 2.4 });
  }
});
