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
  b10Dtu12: { t: 'Verdingovas, Jellesen and Ambat (DTU), "Effect of ionic contamination on corrosion reliability of printed circuit board assemblies", EUROCORR 2012: a NaCl droplet across an 0805 part at 5 V DC; time to first failure "62s, 25s, 19s and 14s" as the salt increases', u: 'https://backend.orbit.dtu.dk/ws/files/52391164/1350.pdf' },
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
  b10Brock: { t: 'Brock Liddicoat, "In Pursuit of an Objectively Better Mouse": #19 angling the charging cable ("prone to sucking the cable in"; Lamzu and Pulsar do it), #20 a Goldilocks cable ("the tension in the bent cable is stronger than the weight of the mouse"), #51 wires instead of ribbon cables ("so easy to rip"), #69 braids not too tight ("wires are heavy"), #70 paracord, #98 a conformal urethane coat, #99 no RGB LED; "0.1 mm LOD steps is a must"; "very few companies advertise the use of the lithium polymer battery"', u: '', n: 'research/brock-doc-in-pursuit.txt' }
});

/* ============================================================================================ data
   Every number a slide shows is computed here from its sources, once. */
const B10 = (() => {
  const cell = typeof elc_cell === 'function' ? elc_cell() : { mAh: 370, g: 8, wh: 1.369, whV4: 1.184 };
  const whV4 = cell.whV4 || 1.184;
  /* the Viper V4 Pro's draw (its 1.184 Wh battery over Razer's 180 h at 1 khz, and TechPowerUp's 40 h measured at 8 khz) */
  const w1 = whV4 / 180, w8 = whV4 / 40, h1 = cell.wh / w1, h8 = cell.wh / w8;
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
    v4: { mAh: 306, A: 0.169, c: 0.169 / 0.306, h1: 180, h8: 40 },
    cyl, can, foil, mass: THESEUS.mass,
    /* the coat: urethane at 1.05 g/cm³ over both sides with the parts' flanks (≈35.6 cm²), 25 / 50 / 75 µm */
    coat: [25, 50, 75].map(um => ({ um, g: 35.6 * um / 1e4 * 1.05 })),
    /* lights, against a Viper V4 Pro's average draw at 1 khz (306 mAh over 180 h): Omron's optical switch pulse
       (5 mA for 30 µs every 1 ms), an optical wheel's LED (Avago: 40 µs every 2 ms; 5 mA assumed, as Omron's), and a
       magnetic wheel on an always-on TMR sensor (MDT: 1.5 µA per axis, two axes) */
    lights: (() => { const avg = 306 / 180, sw = 2 * 5 * 0.030, wh = 5 * 0.040 / 2.0, tmr = 0.003; return { avg, sw, wh, tmr, share: (sw + wh) / avg, shareT: tmr / avg, more: 1 / (1 - (sw + wh) / avg) - 1 }; })(),
    /* second-side reflow: 30 g per square inch of pad (Liu 2006) in mg per mm² */
    padRule: 30 / 645.16 * 1000
  };
})();

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

/** a board side on, in mm, for part(): a 1.0 mm FR4 slab (black mask both faces) from x 0 to L, centred on y 0, with
   parts on its two faces. Each part: { x (its left), w, h, kind ('qfn' | 'mod' | 'usb' | 'sw' | 'pas' | 'jst'), side
   ('a' or 'b': the face it is soldered to; face a is up when flip = 0), g (grams), pad (mm² of solder pad) }.
   o = { flip (0..1: turned over about its long axis; 1 = face b up), show: { a, b } (0..1: placed and visible), paste:
   { a, b } (1: that face's joints are still paste, never melted), melt (0..1: every joint on the board is liquid now: the
   whole board is above 217 °C), sag (mm: how far a liquid joint lets a hanging part sink; each part sinks by sag ×
   its own weight-to-pad ratio over 30 g/in²) }. A hanging part is one on the face that points down.
   Returns { parts: stage centre of each part } */
function b10_boardSideMM(L, parts, o = {}) {
  const flip = o.flip || 0, sy = Math.cos(Math.PI * flip), out = { parts: [] }, show = o.show || { a: 1, b: 1 }, paste = o.paste || {};
  xsave(); G.scale(1, sy); XF.m[2] *= sy; XF.m[3] *= sy;
  /* the slab: glass-fibre core, copper planes, black mask */
  solid(() => { G.beginPath(); G.rect(0, -0.5, L, 1.0); }, { g: ['#1C1D21', '#121316'], dark: 1 }, [0, -0.5, L, 1], { lw: 0.8 });
  G.fillStyle = 'rgba(214,170,92,0.5)'; G.fillRect(0, -0.44, L, 0.07); G.fillRect(0, 0.37, L, 0.07);
  parts.forEach((p, i) => {
    const vis = show[p.side] == null ? 1 : show[p.side]; if (vis <= 0.003) { out.parts[i] = null; return; }
    const onA = p.side === 'a', dir = onA ? -1 : 1, face = onA ? -0.5 : 0.5;     /* in the board's frame face a is y < 0 */
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
   Returns { parts, L, di (the receptacle's index), sag, liquid, T, st (b10_boardSideMM's options) } */
function b10_rideState(u, mode, fb) {
  const rival = mode === 'rival', T = b10_profile(fb - 0.015), liquid = T > B10_LIQ;
  const parts = rival ? B10_SLICE.rival : B10_SLICE.ths, L = rival ? B10_SLICE.L : B10_SLICE.thsL;
  const sag = rival ? B10_OV.sag * ep(u, B10_OV.uMelt, B10_OV.uMelt + 0.6, E.out3) : 0;
  const di = parts.findIndex(p => p.id === 'usb');
  const st = { flip: 0, show: { a: 1, b: 1 }, paste: { a: !liquid && u < B10_OV.uMelt ? 1 : 0, b: 0 }, melt: liquid ? 1 : 0, sag };
  return { parts, L, di, sag, liquid, T, st };
}
/** one board riding a lane of the oven, centred in its window. W: the oven (b10_ovenWin's return), rail (y), s px per mm.
   Returns the state (b10_rideState) and { bx, by, s, partPt (the receptacle's centre), partTop, under (a point under the
   board's middle) } */
function b10_boardRide(t, u, W, rail, s, mode, fb, o = {}) {
  const R = b10_rideState(u, mode, fb), bx = W.cx - R.L * s / 2, by = rail;
  const D = part(bx, by, s, () => b10_boardSideMM(R.L, R.parts, R.st), { alpha: o.a });
  const p = R.parts[R.di], partPt = D.parts && D.parts[R.di] ? D.parts[R.di] : [bx + (p.x + p.w / 2) * s, by];
  const partTop = [partPt[0], partPt[1] - p.h * s / 2], under = [bx + R.L * s * 0.5, by + 0.5 * s];
  return Object.assign(R, { bx, by, s, partPt, partTop, under, part: p });
}

/** the receptacle's joint, close up: the ride's board redrawn at sz px per mm with the first joint of the receptacle at the
   centre of rect, clipped to it (the classroom panel's second picture). ride: b10_boardRide's return */
function b10_neckZoom(rect, ride, sz, o = {}) {
  const [x, y, w, h] = rect, a = o.a == null ? 1 : o.a; if (a <= 0.003 || !ride) return;
  const p = ride.parts[ride.di], fx = p.x + 0.1 * p.w, fy = 0.5 + 0.12 + Math.min(1.6, ride.sag * clamp(p.ratio / 30, 0.05, 1.6)) * 0.5 + 0.25;
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
  return { zp, hP, chin, dc: 3.0, lod: 1.0 };
})();
/** the live numbers: skates, pivot, lens (read when first asked, so H1's rebuilt shell is used) */
function b10_cabLive() {
  if (b10_cabLive.v) return b10_cabLive.v;
  const L = msLive(), zs = L.corner.map(c => c[1]), zf = Math.max(...zs), zr = Math.min(...zs) - 3.25, zl = (L.lens[2] + L.lens[5]) / 2;
  return (b10_cabLive.v = { zf, zr, zl });
}
/** how high the underside sits above the pad at z when the mouse lies flat (skates 0, base plate 0.74, the chin rising,
   the plug's underside if one is fitted: straight 2.0 mm under its overmold, its relief tapering to the cable) */
function b10_under(z, angled) {
  const { zf } = b10_cabLive(), C = B10_CAB, ch = C.chin;
  if (Math.abs(z - zf) <= 3.25) return 0;
  if (z <= ch[0][0]) return 0.74;
  if (z <= C.zp) { for (let i = 1; i < ch.length; i++) if (z <= ch[i][0]) return lerp(ch[i - 1][1], ch[i][1], (z - ch[i - 1][0]) / (ch[i][0] - ch[i - 1][0])); return C.hP; }
  if (angled) return z <= C.zp + 7 ? C.hP - 3.25 : 99;
  if (z <= C.zp + 15) return C.hP - 3.25;
  if (z <= C.zp + 21) return lerp(C.hP - 2.4, C.hP - 1.5, (z - C.zp - 15) / 6);
  return 99;
}
/** the pitch (radians, nose up, about the rear skates' back edge) that lets the underside clear a cable of dc mm lying on
   the pad from z0 forward */
function b10_pitch(z0, dc, angled) {
  const { zr } = b10_cabLive(); let th = 0;
  for (let z = Math.max(z0, zr + 5); z <= B10_CAB.zp + 22; z += 0.25) { const need = dc - b10_under(z, angled); if (need > 0) th = Math.max(th, Math.atan(need / (z - zr))); }
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

/* ============================================================================================ the slides */

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
    ['(F2.29) "we don\'t have a front and back pcb" / "it\'ll be a single ~5.6g pcb"', 'Theseus\'s lane reads "One 5.6 g board, every part on top" and a tag under its board says "Nothing underneath"; the verdict is oven passes 2 → 1'],
    ['(F0.5) the single-sided reflow wording', 'As validated: one pass for a one-sided board; a two-sided board\'s second pass hangs its first face upside down while it melts again. Not claimed: weaker re-melted joints (Wirth et al. saw no change in shear strength), or that the Type-C falls (Liu\'s parts held at about 40 g/in²; the slide says only that it is over the 30 g/in² rule; the drop that falls is water)']
  ],
  draw: t => {
    header(t, 'One board, one side, one reflow');
    captions(t, [[0.6, 'Parts on both faces need two oven passes. In the second, the first face hangs in melted solder.'],
      [4.4, 'Theseus puts every part on one face: one board, one pass, and nothing ever hangs.']]);
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
    text('One ' + THESEUS.pcb + ' g board,', 80, 834, { role: 'small', size: 19, weight: 600, color: C.mute, alpha: l2 });
    text('every part on top', 80, 858, { role: 'small', size: 19, weight: 600, color: C.mute, alpha: l2 });
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
    ['"extremely lazy visualizations"', 'Rebuilt as a demonstration on the mouse in profile, the camera riding it: with a straight plug the cable comes down to the pad at the chin; a flick runs the chin onto its slack, the mouse pitches about its rear skates and the sensor rises past its 1 mm lift-off, so the cursor freezes mid-flick and the shot misses. Rewound and wiped to Theseus: the plug turns up, the cable arcs over the pad, the same flick passes clean and the shot lands. The lift is computed from the shell\'s own outline, skates and lens'],
    ['"paracord needs better assets"', 'The paracord is drawn as a woven sheath: 16 carriers crossing over two and under two, each yarn with its fibres and the edge where it dives under in shadow, foreshortened round the cylinder, with a blue tracer yarn; and the cable cut across (sheath, filler, four stranded conductors)'],
    ['(brief) the angled plug on the shell, the drag it removes', 'The L plug sits in the nose\'s port and lifts the cable straight up, so none of it lies on the pad at the chin (Pulsar sells the same idea: it "prevents cable drag against the desk")']
  ],
  draw: t => {
    header(t, 'An angled plug, a paracord cable');
    captions(t, [[0.6, 'A straight plug brings the cable down to the pad at the chin. Flick forward, and the chin rides onto it: the sensor lifts off and stops tracking.'],
      [3.8, 'Theseus\'s plug turns up, and its paracord cable arcs over the pad: the same flick, and nothing reaches the chin.']]);
    const C0 = B10_CAB, Lv = b10_cabLive(), s = 6.4, mx = 470, py = 668, dc = C0.dc;
    const box = [80, 270, 1220, 450];
    /* the flicks: A (straight plug) 0.9 s, rewound from 2.4 s; B (Theseus) 4.1 s. Δ = how far the mouse has gone over the pad */
    const zh0 = C0.zp + 21 + 4, D1 = zh0 - (Lv.zf - 4);
    const dA = b10_flick(t, 0.9, 0.55, D1) * (1 - ep(t, 2.4, 3.0, E.io3)), dB = b10_flick(t, 4.1, 0.55, D1), D = t < 3.4 ? dA : dB;
    const liftAt = (dd, angled) => angled ? 0 : (Lv.zl - Lv.zr) * Math.sin(b10_pitch(zh0 - dd, dc, false));
    /* where tracking stops in flick A: the first Δ at which the lens has risen past the lift-off */
    const stopA = (() => { for (let k = 0; k <= 200; k++) if (liftAt(D1 * k / 200, false) >= C0.lod) return k / 200; return null; })();
    const L1 = liftAt(D1, false);
    const scene = mode => {
      const ths = mode === 'ths', th = ths ? 0 : b10_pitch(zh0 - D, dc, false), sn = Math.sin(th), cs = Math.cos(th);
      /* mouse frame (z, h) → stage, the mouse pitched about the rear skates' back edge; pad points don't pitch */
      const M = (z, h) => { const zz = Lv.zr + (z - Lv.zr) * cs - h * sn, hh = (z - Lv.zr) * sn + h * cs; return [mx + zz * s, py - hh * s]; };
      const Pd = (z, h) => [mx + z * s, py - h * s];
      /* the pad, its weave marks sliding back as the mouse moves */
      G.fillStyle = TH ? '#E4E4E7' : '#1A1B1E'; G.fillRect(box[0], py, box[2], box[1] + box[3] - py);
      line(box[0], py, box[0] + box[2], py, { color: C.faint, w: 1.5 });
      for (let z = -120; z < 160; z += 10) { const x = mx + (z - (D % 10)) * s; if (x > box[0] && x < box[0] + box[2]) line(x, py + 3, x, py + 9, { color: inkA(0.18), w: 1.5 }); }
      /* the slack: the cable lying on the pad from its far end back to where it doubles over */
      const zEdge = (box[0] + box[2] - mx) / s + 10, zSl = ths ? C0.zp + 64 - D : zh0 - D;
      b10_paracord([Pd(zSl, dc / 2), Pd(zEdge, dc / 2)], dc * s, { cols: TH ? ['#3A3F48', '#4A505B'] : ['#4A505B', '#5A616D'], slide: -D * s });
      /* the mouse */
      part(mx, py, s, () => { xabout(Lv.zr, 0, -th); mouseSimple('right', { show: ['sensor', 'skates'], hi: ths ? null : (th > 0.004 ? { sensor: 'bad' } : null) }); });
      /* the plug in the port, the cable from it */
      const port = M(C0.zp, C0.hP), cr = ths ? 1.0 : dc / 2;
      const pl = b10_plug(port[0], port[1], s, 1, ths, { rot: -th, cr });
      let path;
      if (!ths) {
        const T = Math.max(zh0 + 6 - D, (pl.out[0] - mx) / s + 5), E0 = pl.out, Tp = Pd(T, dc / 2), dx = Tp[0] - E0[0];
        path = b10_bez(E0, [E0[0] + dx * 0.5, E0[1]], [Tp[0] - dx * 0.5, Tp[1]], Tp, 30).concat([Pd(zEdge, dc / 2)]);
        b10_paracord(path, dc * s, { cols: ['#2A2E36', '#3A404B'], slide: 0 });
      } else {
        const E0 = pl.out, Tz = C0.zp + 72 - D, Tp = Pd(Tz, 1.0);
        path = b10_bez(E0, [E0[0], E0[1] - 16 * s], [mx + (C0.zp + 30 - D * 0.35) * s, py - (37 + D * 0.12) * s], Tp, 40).concat([Pd(zEdge, 1.0)]);
        b10_paracord(path, 2.0 * s, { cols: ['#2A2E36', '#3A404B'], tracer: C.hero, slide: 0 });
      }
      /* the gap under the lens, marked when it opens */
      const lens = M(Lv.zl, 0), gap = py - lens[1];
      if (!ths && gap > 2) { const col = gap / s >= C0.lod ? C.red : C.mute; line(lens[0], py, lens[0], lens[1], { color: col, w: 2.5 }); line(lens[0] - 7, lens[1], lens[0] + 7, lens[1], { color: col, w: 2.5 }); line(lens[0] - 7, py, lens[0] + 7, py, { color: col, w: 2.5 }); }
      /* the name of what is drawn */
      if (ths) heroTag(104, 310, 'Theseus', 'Angled plug, paracord', { size: 22 });
      else ltag(104, 310, 'Most mice', 'Straight plug', { size: 22, color: C.mute, vcolor: C.secondText });
      return { th, chin: M(C0.chin[0][0] + 1.5, 1.2), lens };
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
      const k = 62, base = gy + gh - 30, x0 = gx + 300, x1 = gx + gw - 24;
      G.fillStyle = TH ? '#E4E4E7' : '#1A1B1E'; G.fillRect(x0 - 10, base, x1 - x0 + 20, 16);
      line(x0 - 10, base, x1 + 10, base, { color: C.faint, w: 1.5 });
      line(x0 - 10, base - C0.lod * k, x1 + 10, base - C0.lod * k, { color: C.red, w: 1.5, dash: [7, 6], alpha: 0.8 });
      text('Lift-off, 1 mm', x1, base - C0.lod * k - 10, { role: 'label', size: 19, color: C.red, align: 'right' });
      const bx = x0 + 30, bw2 = 120, by = base - lift * k;
      rr(bx, by - 46, bw2, 46, 4, TH ? '#FFFFFF' : '#2A2B2F', inkA(0.6), 1.5);
      rr(bx + bw2 / 2 - 20, by - 8, 40, 8, 2, over ? C.red : C.hero, null, 1);
      text('Lens', bx + bw2 / 2, by - 18, { role: 'label', size: 19, color: C.mute, align: 'center' });
      text('×10', x1, gy + 36, { role: 'label', size: 19, color: C.faint, align: 'right' });
    }
    /* the shot: the cursor rides the flick, and freezes where the sensor stopped tracking */
    { const rect = [672, 748, 520, 196];
      if (t < 3.0) b10_aim(t, -1, rect, b10_flick(t, 0.9, 0.55, D1) / D1, stopA, 1.55, { label: 'The cursor stops where tracking stopped' });
      else b10_aim(t, 3.0, rect, dB / D1, null, 4.75, { label: 'The cursor follows the whole flick' });
    }
    /* the payoff */
    verdict(t, 5.4, 1240, 885, { from: Math.floor(L1 * 10) / 10, to: 0, unit: 'mm', dec: 1, label: 'Sensor lift, same flick', better: 'lower', who: ['Straight plug', 'Theseus'], size: 130, maxW: 600 });
    /* the cable, close up: the woven sheath, and the cable cut across */
    { const px = 1340, py2 = 270, pw = 500, ph = 450, kc = ep(t, 5.9, 6.3);
      demoWindow(px, py2, pw, ph, 1, { plain: true });
      text('The cable, close up', px + 24, py2 + 36, { role: 'label', size: 21, color: C.mute });
      clipped(px, py2, pw, ph, () => b10_paracord(b10_bez([px - 20, py2 + 210], [px + 170, py2 + 230], [px + 260, py2 + 90], [px + pw + 20, py2 + 100], 60), 46, { tracer: C.hero, slide: Math.max(0, t - 5.9) * 30 }));
      const o = part(px + 150, py2 + 340, 52, () => cableMM({}));
      text('Cut across', px + 150, py2 + ph - 18, { role: 'label', size: 19, color: C.faint, align: 'center' });
      if (o.sheath) {
        callout(t, 6.1, o.sheath, 'Woven nylon sheath', { to: [px + 270, py2 + 300], side: 'r', color: C.heroText, tcolor: C.ink, alpha: kc, maxW: 200 });
        callout(t, 6.4, o.core, 'Four fine-stranded conductors', { to: [px + 270, py2 + 380], side: 'r', color: C.heroText, tcolor: C.ink, alpha: kc, maxW: 200 });
      }
    }
    source(t, 'Lift from the shell model: its outline, port (5.25 mm up), skates and lens; a 3 mm stock cable for illustration (diameters unmeasured). Lift-off 1 mm: the PAW3395\'s lower setting. Pulsar\'s bent plug "prevents cable drag against the desk"; TechPowerUp on the Viper V3 Pro\'s cable: its "extraordinary stiffness prevents playing while charging".', { t0: 2.4 });
  }
});
