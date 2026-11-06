/* ============================================================================================
   B01 (revamp v2): THE INTRO AND THE CLOSE. Every flagship compromises; Theseus gives up nothing (F33.7).
   Film order: b01_cover, b01_compromise, b01_battery, b01_targets, b01_lighter, b01_listed, b01_density, b01_illusion,
   b01_rank, b01_price, b01_budget (chapter intro), then b01_close (chapter end, the film's last word).
   Plan, research notes and storyboards: /home/claude/work/b01/PROGRESS.md.
   Data: research/data/*.json (RDATA, read with rv / evOf / exMouse / exWeight from 14-a-exdata.js) plus the mice this file
   adds (B01_MICE: launched after the research pass, or G-Wolves's line, which Brock asked for: "use eloshapes to take g
   wolves mice into account ... yes this will make the theseus look worse, but its more honest"). EloShapes loads its data
   in the browser and could not be read from this session; the G-Wolves figures are G-Wolves's own (the maker's figures
   EloShapes lists), and TechPowerUp's scale where it weighed one. Theseus's own numbers come from THESEUS / THS (05-data.js),
   so a change there reaches every slide here.
   Precision (G5): one precision per comparison. Weights to 0.1 g wherever mice are compared (Theseus 29.3); Theseus's own
   spec keeps 29.31 g where it stands alone (the cover, the budget).
   ============================================================================================ */
Object.assign(SRC, {
  b01X3: { t: 'Notebookcheck, 2026-09-23: Logitech G Pro X3 Superstrike launches: 59 g (61 g in Europe), up to 135 h, $199.99, haptic inductive triggers (HITS), shipping by October 6', u: 'https://www.notebookcheck.net/Logitech-G-Pro-X3-Superstrike-haptic-gaming-mouse-launches-with-boosted-battery-life.1404956.0.html' },
  b01X3Pcg: { t: 'PC Gamer: the X3 Superstrike has "+50% battery life, up to 135 hours from the original Superstrike\'s 90 hours at 1,000 Hz polling"', u: 'https://www.pcgamer.com/hardware/gaming-mice/oops-looks-like-the-logitech-x3-superstrike-has-leaked-on-amazon-and-the-rapid-trigger-gaming-mouse-will-have-50-percent-battery-life/' },
  b01X3Psn: { t: 'ProSettings, Logitech G Pro X3 Superstrike review, 2026-10-06: 59 g; "a weight saving of 2 grams"; "costs an eye-watering $199.99"', u: 'https://prosettings.net/reviews/logitech-g-pro-x3-superstrike/', n: 'Dimensions: Notebookcheck says they match the X2 Superstrike (EloShapes: 125.0 × 63.5 × 40.0 mm); ProSettings lists 118 × 62 × 39 mm.' },
  b01GwHtsU: { t: 'G-Wolves, HTS Ultra 8K: Standard ~32.9 g, Deluxe ~29.5 g / ~30.5 g by colour; 113 × 61 × 40 mm; a honeycomb semi-solid shell; $119 to $159', u: 'https://shop.g-wolves.com/products/hts-ultra-8k-wireless-gaming-mouse-29g-usb-type-c-port' },
  b01TpuHtsU: { t: 'TechPowerUp, G-Wolves Hati-S Ultra 8K review: "My scale shows around 31 g (+/- 1 g)"; "G-Wolves advertises up to 80 hours of battery life at 1000 Hz"; 113 × 61 × 40 mm; hexagonal holes over the whole shell', u: 'https://techpowerup.com/review/g-wolves-hati-s-ultra-8k/single-page.html' },
  b01TpuHtrPro: { t: 'TechPowerUp, G-Wolves Hati-R Pro 8K review: "My scale shows around 25 g (+/- 1 g)"; 92 × 57 × 33 mm; a 250 mAh battery; $169', u: 'https://www.techpowerup.com/review/g-wolves-hati-r-pro-8k/single-page.html' },
  b01Gw: { t: 'G-Wolves store, the wireless line (2026-11-06): each model\'s listed weight and its length × width × height from its own page', u: 'https://shop.g-wolves.com/collections/wired-mouse', n: 'The maker\'s figures, as EloShapes lists makers\' figures. EloShapes itself loads its database in the browser and could not be read from this session.' },
  b01GwPlusPro: { t: 'G-Wolves, HTS Plus Pro 8K: ~28 g; 117 × 61 × 40 mm; "Single-shell + carbon rod", "no hole pattern"; $159', u: 'https://shop.g-wolves.com/products/hts-plus-pro-8k-wireless-gaming-mouse-28g' },
  b01GwWarg: { t: 'G-Wolves, Warg 8K: ~28.9 g; 117 × 61 × 40 mm; "Single-shell, no holes", a carbon rod; $149', u: 'https://shop.g-wolves.com/products/g-wolves-warg-8k-wireless-gaming-mouse' },
  b01GwLycan: { t: 'PC Gamer, 2026-03-05: the G-Wolves Lycan 8K "weighs around 28.8 grams", "a regular size at 119 x 63 x 37 mm", without "poking holes in the shell"; $129 at preorder', u: 'https://www.pcgamer.com/hardware/gaming-mice/this-upcoming-gaming-mouse-weighs-just-over-28-grams-without-poking-holes-in-it/' },
  b01GwHtxMini: { t: 'G-Wolves, HTX Mini 8K: ~26.9 g; 109 × 60 × 35 mm; "250mAh; about 80h at 1K report rate"; $159', u: 'https://shop.g-wolves.com/products/htx-mini-8k-wireless-gaming-mouse-1' },
  b01X2f: { t: 'Pulsar X2F CrazyLight: 29 g ± 2 g, a 210 mAh battery, no battery life published, 87.5 × 61.1 × 31.6 mm, $149.95 (gaming-st.com and Prisjakt\'s review, quoting Pulsar)', u: 'https://gaming-st.com/peripherals/pulsar-x2f-crazylight-29g-vs-x2f/' },
  b01X2fWt: { t: 'The X2F CrazyLight at 29.5 g: reports online put it at 29.5 g or more on a scale (Brock); Pulsar lists 29 g ± 2 g', u: '', n: 'No independent scale figure was readable from this session. The slide uses 29.5 g, the best reported.' },
  b01X2Trace: { t: 'The X2F\'s outline: the Pulsar X2 family\'s top silhouette, traced from Pulsar\'s own product photo of the X2H CrazyLight\'s base, scaled to the X2F\'s 61.1 mm width and cut at its 87.5 mm length', u: '', n: 'EloShapes\' outlines load in the browser and could not be read from this session.' },
  b01TpuUlx: { t: 'TechPowerUp, Finalmouse UltralightX review: "The battery has a capacity of 250 mAh (3.87 V)"; Finalmouse states "up to two months"; about 20 h at 4000 Hz in the reviewer\'s use; 38 g on its scale', u: 'https://techpowerup.com/review/finalmouse-ultralightx/7.html' },
  b01RtUlx: { t: 'RTINGS, Ninjutso Sora V2 against the Finalmouse ULX Pro Series: the Sora V2 "feels solid", the ULX "flexes and creaks with pressure" (research/validation-report-2026-11-03.md)', u: 'https://www.rtings.com/mouse/tools/compare/finalmouse-ulx-pro-series-finalmouse-ultralightx-competition/58188/78570' },
  b01SlxBatt: { t: 'Finalmouse Starlight X technical overview: a Jauch 250 mAh battery, nRF54LM20 in the mouse and the receiver, 38 g; no hour rating (research/validation-report-2026-11-03.md)', u: 'https://cdn.shopify.com/s/files/1/2377/4861/files/26.5.27_Starlight_X_Technical_Overview.pdf?v=1779939240' },
  b01MiniSe: { t: 'Razer, Viper Mini Signature Edition: 49 g, a magnesium alloy chassis, Optical Mouse Switches Gen-3, true 8000 Hz', u: 'https://www.razer.com/gaming-mice/razer-viper-mini-signature-edition', n: 'Its $279.99 is Razer\'s launch price (2022); the page did not show a price to this session.' },
  b01M3k: { t: 'Zaunkoenig M3K: 24 g, "a wired 8,000 hertz connection", "The M3K costs €340 (~396 USD)"', u: 'https://www.zaunkoenig.co/m3k' },
  b01FmClick: { t: 'PC Gamer, Sept 2026, on Finalmouse\'s own click test: from the start of the press to the packet at the PC, mean of 50 presses: Starlight X 2.0 ms, Superstrike 3.0 ms, OP1 8K V2 5.7 ms, Viper V4 Pro 7.5 ms (a maker testing its own mouse and its rivals)', u: 'https://www.pcgamer.com/hardware/gaming-mice/finalmouse-claims-its-mouse-has-the-absolute-fastest-click-quicker-than-the-logitech-superstrike-and-razer-viper-v4-pro/' },
  b01OpenStax: { t: 'OpenStax, College Physics 2e, §4.3 Newton\'s second law, Fig. 4.6: "The same force exerted on systems of different masses produces different accelerations"; "acceleration is exactly inversely proportional to mass"', u: 'https://openstax.org/books/college-physics-2e/pages/4-3-newtons-second-law-of-motion-concept-of-a-system' },
  b01Optical: { t: 'Derived, as the clicks chapter: an optical switch pulses its LED at 5 mA for 30 µs every 1 ms (Omron D2FP\'s test pulse), 0.15 mA a switch; a Viper V4 Pro draws 306 mAh over 180 h at 1 khz, 1.70 mA; two optical mains take 0.30 ÷ 1.70 = 17.6 % of it', u: 'https://www.fa.omron.co.jp/data_pdf/cat/d2fp_cdva-002_1_1.pdf', n: 'Razer staff have said online that the switches and the encoder take almost half (Brock, F31.1): no public source, so the slide uses the derived 17.6 %.' },
  b01HandMass: { t: 'Body segment parameters (Dempster via Winter 2009; de Leva 1996): the hand is about 0.6 % of body mass, about 420 g at 70 kg (research/data/weight-science.json)', u: 'https://nbviewer.jupyter.org/github/demotu/BMC/blob/master/notebooks/BodySegmentParameters.ipynb' }
});

/* ================================ the mice this file adds ================================
   Each: { id, name (full), short, brand, conn ('wireless' | 'wired'), g (grams), gBy (who weighed or listed it), gEv
   ('measured' | 'claim' | 'reported'), L, W, H (mm), h1k (hours at 1 khz as listed), mAh, V (battery volts, when known),
   price (US $), shell (a few words), src (SRC keys) }. G-Wolves weights are the black (lightest) colour's, as listed. */
const B01_MICE = [
  { id: 'logitech-x3', name: 'Logitech Pro X3 Superstrike', short: 'Pro X3 Superstrike', brand: 'Logitech', conn: 'wireless', g: 59.0, gBy: 'Logitech', gEv: 'claim', L: 125.0, W: 63.5, H: 40.0, h1k: 135, price: 199.99, shell: 'Solid', src: ['b01X3', 'b01X3Pcg', 'b01X3Psn'] },
  { id: 'gw-hts-ultra', name: 'G-Wolves HTS Ultra 8K', short: 'HTS Ultra 8K', brand: 'G-Wolves', conn: 'wireless', g: 31.0, gBy: 'TechPowerUp', gEv: 'measured', L: 113, W: 61, H: 40, h1k: 80, price: 119, shell: 'Honeycomb', src: ['b01TpuHtsU', 'b01GwHtsU'] },
  { id: 'gw-hts-plus-pro', name: 'G-Wolves HTS Plus Pro 8K', short: 'HTS Plus Pro 8K', brand: 'G-Wolves', conn: 'wireless', g: 28.0, gBy: 'G-Wolves', gEv: 'claim', L: 117, W: 61, H: 40, price: 159, shell: 'Solid, carbon rod', src: ['b01GwPlusPro'] },
  { id: 'gw-warg', name: 'G-Wolves Warg 8K', short: 'Warg 8K', brand: 'G-Wolves', conn: 'wireless', g: 28.9, gBy: 'G-Wolves', gEv: 'claim', L: 117, W: 61, H: 40, price: 149, shell: 'Solid, carbon rod', src: ['b01GwWarg'] },
  { id: 'gw-lycan', name: 'G-Wolves Lycan 8K', short: 'Lycan 8K', brand: 'G-Wolves', conn: 'wireless', g: 28.8, gBy: 'G-Wolves', gEv: 'claim', L: 119, W: 63, H: 37, price: 132, shell: 'Solid', src: ['b01GwLycan', 'b01Gw'] },
  { id: 'gw-htx-ultra', name: 'G-Wolves HTX Ultra 8K', short: 'HTX Ultra 8K', brand: 'G-Wolves', conn: 'wireless', g: 32.1, gBy: 'G-Wolves', gEv: 'claim', L: 119.7, W: 64.1, H: 37.1, price: 139, src: ['b01Gw'] },
  { id: 'gw-vuk', name: 'G-Wolves VUK 8K', short: 'VUK 8K', brand: 'G-Wolves', conn: 'wireless', g: 35.0, gBy: 'G-Wolves', gEv: 'claim', L: 124.8, W: 64.6, H: 38.1, price: 159, src: ['b01Gw'] },
  { id: 'gw-htm-plus', name: 'G-Wolves HTM Plus 8K', short: 'HTM Plus 8K', brand: 'G-Wolves', conn: 'wireless', g: 33.5, gBy: 'G-Wolves', gEv: 'claim', L: 127, W: 64, H: 37, price: 149, src: ['b01Gw'] },
  { id: 'gw-hts2-pro', name: 'G-Wolves HT-S2 Pro 8K', short: 'HT-S2 Pro 8K', brand: 'G-Wolves', conn: 'wireless', g: 28.4, gBy: 'G-Wolves', gEv: 'claim', L: 112, W: 61, H: 37, price: 159, src: ['b01Gw'] },
  { id: 'gw-hts2', name: 'G-Wolves HT-S2 8K', short: 'HT-S2 8K', brand: 'G-Wolves', conn: 'wireless', g: 32.9, gBy: 'G-Wolves', gEv: 'claim', L: 110, W: 61, H: 37, price: 139, src: ['b01Gw'] },
  { id: 'gw-htx-mini', name: 'G-Wolves HTX Mini 8K', short: 'HTX Mini 8K', brand: 'G-Wolves', conn: 'wireless', g: 26.9, gBy: 'G-Wolves', gEv: 'claim', L: 109, W: 60, H: 35, h1k: 80, mAh: 250, price: 159, src: ['b01GwHtxMini'] },
  { id: 'gw-htr-pro', name: 'G-Wolves HTR Pro 8K', short: 'HTR Pro 8K', brand: 'G-Wolves', conn: 'wireless', g: 25.0, gBy: 'TechPowerUp', gEv: 'measured', L: 92, W: 57, H: 33, mAh: 250, price: 169, src: ['b01TpuHtrPro'] },
  { id: 'gw-htr', name: 'G-Wolves HTR 8K', short: 'HTR 8K', brand: 'G-Wolves', conn: 'wireless', g: 28.0, gBy: 'G-Wolves', gEv: 'claim', L: 92, W: 57, H: 35, price: 149, src: ['b01Gw'] },
  { id: 'gw-fenrir-pro', name: 'G-Wolves Fenrir Pro 8K', short: 'Fenrir Pro 8K', brand: 'G-Wolves', conn: 'wireless', g: 18.9, gBy: 'G-Wolves', gEv: 'claim', L: 81.7, W: 61.2, H: 28.3, price: 159, src: ['b01Gw'] },
  { id: 'gw-fenrir-max', name: 'G-Wolves Fenrir Max 8K', short: 'Fenrir Max 8K', brand: 'G-Wolves', conn: 'wireless', g: 22.4, gBy: 'G-Wolves', gEv: 'claim', L: 75, W: 61, H: 31, price: 153, src: ['b01Gw'] },
  { id: 'gw-hsk-pro', name: 'G-Wolves HSK Pro v2.0 8K', short: 'HSK Pro v2.0 8K', brand: 'G-Wolves', conn: 'wireless', g: 26.8, gBy: 'G-Wolves', gEv: 'claim', L: 73.7, W: 56, H: 29, price: 149, src: ['b01Gw'] },
  { id: 'gw-hts-plus', name: 'G-Wolves HTS Plus 8K', short: 'HTS Plus 8K', brand: 'G-Wolves', conn: 'wireless', g: 46.0, gBy: 'G-Wolves', gEv: 'claim', L: 117, W: 61, H: 40, price: 159, src: ['b01Gw'] },
  { id: 'razer-viper-mini-se', name: 'Razer Viper Mini Signature Edition', short: 'Viper Mini SE', brand: 'Razer', conn: 'wireless', g: 49.0, gBy: 'Razer', gEv: 'claim', price: 279.99, shell: 'Magnesium alloy', src: ['b01MiniSe'] },
  { id: 'zaunkoenig-m3k', name: 'Zaunkoenig M3K', short: 'M3K', brand: 'Zaunkoenig', conn: 'wired', g: 24.0, gBy: 'Zaunkoenig', gEv: 'claim', price: 396, priceNote: '€340', src: ['b01M3k'] }
];
/* facts this file adds to mice already in mice.json (their batteries, where a review measured one) */
const B01_MORE = {
  'finalmouse-ulx': { mAh: 250, V: 3.87, src: ['b01TpuUlx'] },
  'finalmouse-slx': { mAh: 250, src: ['b01SlxBatt'] },
  'pulsar-x2f-crazylight': { g: 29.5, gBy: 'reported', gEv: 'reported', mAh: 210, src: ['b01X2f', 'b01X2fWt'] }
};

/* ================================ reading the mice ================================ */
/** every mouse this file knows, in one shape: mice.json (weighed by RTINGS where it was, else the maker's) with B01_MORE on
   top, then B01_MICE. { id, name, short, brand, conn, g, gBy, gEv, L, W, H, h1k, mAh, V, price } */
function b01_all() {
  if (b01_all.v) return b01_all.v;
  const out = [];
  for (const m of ((RD.mice || {}).mice || [])) {
    const w = exWeight(m.id), more = B01_MORE[m.id] || {};
    const me = rv(m.weight_measured_g), measured = me != null && evOf(m.weight_measured_g) === 'measured';
    out.push(Object.assign({
      id: m.id, name: exShort(m.name), short: typeof ntr_mk === 'function' ? ntr_mk(m.name) : exShort(m.name), brand: m.brand, conn: m.connection === 'wired' ? 'wired' : 'wireless',
      g: w ? w.g : null, gBy: measured ? 'RTINGS' : m.id === 'xbab-xa25' ? 'XBAB' : 'maker', gEv: w ? w.ev : 'claim',
      L: rv(m.length_mm), W: rv(m.width_mm), H: rv(m.height_mm), h1k: rv(m.battery_claim_1k_h), mAh: rv(m.battery_mAh), V: null,
      price: (() => { const p = parseFloat(String(rv(m.price_usd))); return isFinite(p) ? p : null; })()
    }, more));
  }
  for (const m of B01_MICE) out.push(Object.assign({ h1k: null, mAh: null, V: null }, m));
  return (b01_all.v = out);
}
const b01_get = id => b01_all().find(m => m.id === id) || null;
/** Theseus in the same shape (its own numbers, from THESEUS) */
function b01_ths() { const [L, W, H] = THESEUS.dims; return { id: 'theseus', name: 'Theseus', short: 'Theseus', brand: 'Nitrite Labs', conn: 'wireless', g: THESEUS.mass, gBy: 'target', gEv: 'proposal', L, W, H, h1k: THESEUS.hours, price: THESEUS.price, hero: true }; }
/** one precision for every weight in a comparison (G5): 0.1 g */
const b01_g = v => fmtN(v, 1);
/** density, Pwnage's way: weight over the box the mouse fits in, g/cm³ */
const b01_rho = m => m.g / (m.L * m.W * m.H / 1000);
/** the density table: every wireless mouse with a box and a weight, plus Theseus. o.wired: include wired ones (flagged) */
function b01_dens(o = {}) {
  const skip = ['finalmouse-ulx', 'mchose-l7-ultra'];   /* as on weightgap: RTINGS doesn't say which ULX size it weighed; the MCHOSE weighed 17.7 % over its listing */
  const R = b01_all().filter(m => m.L && m.W && m.H && m.g && !skip.includes(m.id) && (o.wired || m.conn !== 'wired')).map(m => Object.assign({}, m, { v: m.L * m.W * m.H / 1000, rho: b01_rho(m) }));
  if (o.theseus !== false) { const t = b01_ths(); R.push(Object.assign(t, { v: t.L * t.W * t.H / 1000, rho: b01_rho(t) })); }
  return R;
}

/* ================================ battery: hours at 1 khz ================================ */
/** the draw every derived hour in the deck uses: a Viper V4 Pro's battery (TechPowerUp: 306 mAh at 3.87 V, 1.184 Wh) over
   Razer's 180 h at 1 khz, 6.58 mW (ntr_loads in 14-b-intro-ex.js; the same derivation gives Theseus its 200 h) */
function b01_draw1k() { try { return ntr_loads().w1; } catch (e) { return 1.184 / 180; } }
/** Theseus's battery: the example part (LP402535JU) from the Jauch family in RDATA, its hours at that draw */
function b01_thsBatt() { const p = (typeof ntr_pack === 'function' && ntr_pack('LP402535JU')) || { part: 'LP402535JU', mAh: 370, g: 8, wh: 1.369 }; return Object.assign({}, p, { h: p.wh / b01_draw1k() }); }
/** the hours a battery would give at the V4 Pro's draw: an upper bound for a mouse that lists none (V nominal 3.7 unless known) */
const b01_hoursAt = (mAh, V) => mAh * (V || 3.7) / 1000 / b01_draw1k();
/** the battery chart's points: wireless mice with a weight. Listed hours where the maker lists them ({ h, kind: 'listed' });
   else, where the battery is known, its hours at the V4 Pro's draw ({ h, kind: 'derived' }); else none */
function b01_battPts() {
  const out = [];
  for (const m of b01_all()) {
    if (m.conn === 'wired' || !m.g || m.id === 'mchose-l7-ultra') continue;
    if (m.h1k != null) out.push(Object.assign({}, m, { h: m.h1k, kind: 'listed' }));
    else if (m.mAh != null) out.push(Object.assign({}, m, { h: b01_hoursAt(m.mAh, m.V), kind: 'derived' }));
  }
  return out;
}
/** the Pareto frontier of a point set: the points no other point beats on both measures. better: { x: -1 (lower wins) |
   1, y: -1 | 1 }. Returned sorted by x */
function b01_front(P, better) {
  const bx = better.x, by = better.y, beats = (q, p) => bx * (q.x - p.x) >= 0 && by * (q.y - p.y) >= 0 && (q.x !== p.x || q.y !== p.y);
  return P.filter(p => !P.some(q => q !== p && beats(q, p))).sort((a, b) => a.x - b.x);
}
/** a frontier drawn as one smooth monotone curve (monoCurve) that carries on past both end points along its own end
   slopes for ext of the x range, easing flat, so it never kinks into a straight run (Brock on pricefront: "there should
   never be a kink in a pareto line"). P: [[x, y], ...] sorted by x, in data units. Returns data points */
function b01_frontCurve(P, ext = [0.06, 0.06], lim = null) {
  if (P.length < 2) return P.slice();
  const c = monoCurve(P, 0.05), n = c.length, span = P[P.length - 1][0] - P[0][0];
  const slope = (a, b) => (b[1] - a[1]) / Math.max(1e-9, b[0] - a[0]);
  const s0 = slope(c[0], c[Math.min(6, n - 1)]), s1 = slope(c[Math.max(0, n - 7)], c[n - 1]);
  const head = [], tail = [], N = 24;
  for (let i = N; i >= 1; i--) { const u = i / N, dx = -ext[0] * span * u; head.push([P[0][0] + dx, P[0][1] + s0 * dx * (1 - 0.5 * u)]); }
  for (let i = 1; i <= N; i++) { const u = i / N, dx = ext[1] * span * u; tail.push([P[P.length - 1][0] + dx, P[P.length - 1][1] + s1 * dx * (1 - 0.5 * u)]); }
  let out = head.concat(c, tail);
  if (lim) out = out.filter(p => p[0] >= lim.x[0] && p[0] <= lim.x[1] && p[1] >= lim.y[0] && p[1] <= lim.y[1]);
  return out;
}

/** the share of a Viper V4 Pro's battery its two optical main switches draw: Omron D2FP's LED test pulse (5 mA for 30 µs every
   1 ms, 0.15 mA a switch) over the mouse's 306 mAh in Razer's 180 h at 1 khz (1.70 mA): 17.6 %. The clicks chapter (b03) works it
   the same way. Shown to 0.1 %: rounding a rival's fault up would be rounding a claim in our favour */
const B01_OPT = (() => { const sw = 5 * 30 / 1000, mA = 306 / 180; return { sw, mA, share: 2 * sw / mA }; })();
/* ================================ the trades: what each flagship gives up ================================
   The film's spine (F33.7): every flagship gives one thing up; Theseus gives up nothing. Each: the mouse, what it gives up
   (red), the figure, what it bought with it, the evidence, and Theseus's answer (the close reads `ans`). The icon names the
   small demonstration drawn beside the row (b01_tradeIcon). */
const B01_TRADES = [
  { id: 'logitech-x3', brand: 'Logitech', name: 'Pro X3 Superstrike', price: '$199.99', small: 'Logitech, $199.99, haptic triggers', what: 'Weight', fig: '59.0 g', why: 'Haptic, inductive triggers', ev: 'claim', tag: 'Logitech 2026', src: ['b01X3', 'b01X3Psn'], icon: 'weight', ans: THS.massG },
  { id: 'gw-hts-ultra', brand: 'G-Wolves', name: 'HTS Ultra 8K', price: '$119', small: 'G-Wolves, $119, 31.0 g', what: 'Battery life', fig: '80 h', why: '31.0 g', ev: 'claim', tag: 'G-Wolves claim', src: ['b01TpuHtsU'], icon: 'battery', ans: THESEUS.hours + ' h' },
  { id: 'razer-viper-v4-pro', brand: 'Razer', name: 'Viper V4 Pro', price: '$159.99', small: 'Razer, $159.99, optical switches', what: 'Battery, to its clicks', fig: fmtN(B01_OPT.share * 100, 1) + ' %', why: 'Optical switches', ev: 'derived', tag: 'Derived', src: ['b01Optical'], icon: 'optical', ans: '0 %' },
  { id: 'finalmouse-ulx', brand: 'Finalmouse', name: 'ULX', price: '$189', small: 'Finalmouse, $189, 38.0 g', what: 'Strength', fig: 'Flexes, creaks', why: '38.0 g', ev: 'measured', tag: 'RTINGS', src: ['b01RtUlx'], icon: 'flex', ans: 'Solid, arched' },
  { id: 'pulsar-x2f-crazylight', brand: 'Pulsar', name: 'X2F CrazyLight', price: '$149.95', small: 'Pulsar, $149.95, 29.5 g', what: 'The shape', fig: 'Cut to 87.5 mm', why: '29.5 g', ev: 'claim', tag: 'Pulsar 2026', src: ['b01X2f', 'x2fCrazy'], icon: 'half', ans: 'A full 119.3 mm' },
  { id: 'xbab-xa25', brand: 'XBAB', name: 'XA25', price: '$169', small: 'XBAB, $169, 24.9 g', what: 'Wireless', fig: 'Wired only', why: '24.9 g', ev: 'claim', tag: 'XBAB 2026', src: ['exXbabWeight'], icon: 'wire', ans: 'Dual 8khz wired and wireless' }
];

/* ================================ outlines ================================ */
/** the X2F CrazyLight from above, mm, nose at y = 0, the cut at 87.5: half-widths traced from Pulsar's own photo of the X2
   family's base (refs/photos/brock-2026-11-06/pulsar-x2h-crazylight-base.png, work/b01/scripts/x2f_outline.py), scaled to
   61.1 mm wide. B01_X2_HALF is the whole X2 the X2F was cut from (120 mm), for the cut */
const B01_X2_HALF = [[0, 0], [0.6, 7.6], [1.2, 10.6], [2.0, 14.3], [3.0, 17.0], [4.0, 19.2], [6.0, 21.8], [8.0, 23.7], [10.0, 25.0], [12.0, 26.0], [14.0, 26.8], [16.0, 27.4], [18.0, 27.8], [20.0, 28.1], [22.0, 28.3], [24.0, 28.5], [26.0, 28.6], [28.0, 28.6], [32.0, 28.6], [36.0, 28.7], [40.0, 28.9], [44.0, 29.0], [48.0, 29.1], [52.0, 29.05], [56.0, 29.05], [60.0, 29.1], [64.0, 29.3], [68.0, 29.4], [72.0, 29.5], [76.0, 29.8], [80.0, 30.2], [84.0, 30.5], [86.0, 30.55], [88.0, 30.5], [90.0, 30.4], [92.0, 30.1], [94.0, 29.8], [96.0, 29.25], [98.0, 28.6], [100.0, 27.9], [102.0, 27.1], [104.0, 26.0], [106.0, 24.7], [108.0, 23.1], [110.0, 21.1], [112.0, 18.9], [114.0, 16.3], [116.0, 13.0], [118.0, 9.0], [119.4, 4.5], [120.0, 0]];
const B01_X2F = { L: 87.5, W: 61.1, H: 31.6, cut: 87.5, r: 5 };
/** a top outline (nose up, centred on x = 0) from half-widths [[y, w], ...] as a Path2D, cut flat at yCut with corners of
   radius r (mm). Mirrored about x = 0; points are joined with quadratic midpoints so the pixel steps of the trace vanish */
function b01_outline(half, yCut, r = 0) {
  const key = half.length + ':' + yCut + ':' + r; b01_outline.c = b01_outline.c || new Map(); if (b01_outline.c.has(key)) return b01_outline.c.get(key);
  const w = y => { for (let i = 1; i < half.length; i++) if (half[i][0] >= y) { const [y0, w0] = half[i - 1], [y1, w1] = half[i]; return w0 + (w1 - w0) * (y - y0) / Math.max(1e-9, y1 - y0); } return half[half.length - 1][1]; };
  const yc = yCut == null ? half[half.length - 1][0] : yCut, rs = half.filter(p => p[0] < yc - (r || 0.01)).map(p => [p[1], p[0]]);
  const wc = w(yc), pts = [];
  rs.forEach(p => pts.push(p));
  if (yCut != null && r > 0) { const steps = 6; for (let i = 0; i <= steps; i++) { const a = (i / steps) * Math.PI / 2; pts.push([wc - r + r * Math.cos(a), yc - r + r * Math.sin(a)]); } }
  else pts.push([wc, yc]);
  const right = pts, left = right.slice().reverse().map(([x, y]) => [-x, y]);
  const all = right.concat(left), p = new Path2D(), n = all.length;
  p.moveTo(all[0][0], all[0][1]);
  for (let i = 1; i < n - 1; i++) { const a = all[i], b = all[i + 1]; p.quadraticCurveTo(a[0], a[1], (a[0] + b[0]) / 2, (a[1] + b[1]) / 2); }
  p.lineTo(all[n - 1][0], all[n - 1][1]); p.closePath();
  const out = { path: p, w: 2 * Math.max(...all.map(q => Math.abs(q[0]))), h: yc };
  b01_outline.c.set(key, out); return out;
}

/* ================================ the weight budget, computed ================================
   Brock on `budget`: "it's a lot of work to keep updating this one". So nothing here is typed as a total: every part's
   weight comes from where the deck keeps it (THESEUS for the whole and the board; the Jauch family in RDATA for the
   battery; XBAB's breakdown in RDATA for the buttons; NTR_BUD, the 3D model's volumes and densities, for the wheel, axle,
   screws, inserts and lead), and the shell and skates get what is left (F21.1: "Budget is the target"). */
function b01_budget() {
  const B = (typeof ntr_budget === 'function') ? ntr_budget() : null, batt = b01_thsBatt();
  if (!B) return null;
  const parts = [
    { key: 'battery', name: 'Battery, ' + batt.mAh + ' mAh', g: B.cell.g, note: 'Example part, ' + batt.part, ev: 'datasheet', by: 'Jauch' },
    { key: 'board', name: 'One board', g: THESEUS.pcb, note: 'Radio, antenna and USB-C on it' },
    { key: 'buttons', name: 'Buttons', g: B.xa.btn, note: 'As XBAB weighed the XA25\'s', ev: 'claim', by: 'XBAB' },
    { key: 'wheel', name: 'Wheel and axle', g: B.wheel, note: 'Magnesium, 0.9 g, on a POM axle', ev: 'derived' },
    { key: 'inserts', name: 'Brass inserts', count: NTR_BUD.inserts, g: B.ins, note: fmtN(B.ins1, 2) + ' g each', ev: 'derived' },
    { key: 'screws', name: 'Titanium screws', count: NTR_BUD.screws, g: B.screws, note: 'M2 × 4, ' + fmtN(B.screw1, 2) + ' g each', ev: 'derived' },
    { key: 'wires', name: 'Side-button lead', g: B.wires, note: '32 AWG, braided', ev: 'derived' }
  ];
  const used = parts.reduce((s, p) => s + p.g, 0);
  return { parts, used, shell: THESEUS.mass - used, xaShell: B.xa.shell, hours: batt.h, batt, B };
}

/* ================================ small demonstrations of each trade ================================
   One per row of the ledger (b01_compromise) and the close: the simplified mouse (06-motion.js) with the part the trade
   costs lit red, and the cause acting on it once (M2): its weight sags a scale, its battery runs down, its switches draw
   current, a finger bows its shell, its back half comes away, a cable runs out of its nose. box = [x, y, w, h] px; the
   mouse sits nose right. o = { a (alpha), k0 (when the cause starts: t0), hero (draw Theseus's answer instead, blue) } */
function b01_tradeIcon(t, t0, kind, box, o = {}) {
  const [x, y, w, h] = box, a = o.a == null ? 1 : o.a; if (a <= 0.003) return;
  const lit = ep(t, t0, t0 + 0.35), k = ep(t, t0 + 0.1, t0 + 0.9, E.snap), hero = !!o.hero, col = hero ? 'hero' : 'bad', cc = hero ? C.hero : C.red;
  const base = { lw: 1.6, dim: 0.55 };
  /* the top view, nose right: the key plan's frame turned a quarter (its nose is at -y) */
  const top = (o2, draw, dx = 0) => { const V = msView('top'), s = Math.min((w - 8) / V.box[3], (h - 8) / V.box[2]); return part(x + w / 2 + dx, y + h / 2, s, () => { mouseSimple('top', Object.assign({}, base, o2)); if (draw) draw(s); }, { alpha: a, rot: Math.PI / 2 }); };
  /* the side view, nose right, standing on its pad line at yb */
  const sideS = (pad = 8) => { const V = msView('right'); return Math.min((w - pad) / V.box[2], (h - 14) / V.box[3]); };
  const side = (o2, draw, yb, s) => { const V = msView('right'), cx = V.box[0] + V.box[2] / 2; return part(x + w / 2 - cx * s, yb, s, () => { mouseSimple('right', Object.assign({}, base, o2)); if (draw) draw(s); }, { alpha: a }); };
  if (kind === 'weight') {
    /* set down on a scale: its weight presses down (the arrow grows to it), the pan sags under it and a spring settles it.
       59.0 g sags the pan twice as far as Theseus's 29.3 g would */
    const g = o.g || 59, s = sideS(30), sp = spring(t, t0 + 0.12, { f: 2.6, z: 0.45 }), sag = 0.11 * g * sp, drop = (1 - E.out3(clamp((t - t0) / 0.22))) * -8;
    const yb = y + h - 10 + sag + drop, px0 = x + 10, px1 = x + w - 10;
    /* the scale: its foot, and the pan the mouse stands on */
    rect(x + w / 2 - 22, y + h - 4, 44, 4, { fill: inkA(0.3), alpha: a * lit });
    line(x + w / 2, y + h - 4, x + w / 2, yb + 3, { color: inkA(0.3), w: 3, alpha: a * lit });
    rr(px0, yb, px1 - px0, 3.5, 1.5, cc, null, 0, a * lit);
    side({ lineA: 1 }, null, yb, s);
    /* the weight, an arrow through the mouse onto the pan, growing with the load (M2) */
    const ax = x + w / 2 - 6, len = 0.62 * g * sp;
    if (len > 3) arrow(ax, yb - len - 4, ax, yb - 3, { color: cc, w: 3, hs: 9, alpha: a * lit });
  } else if (kind === 'battery') {
    /* the battery, lit, runs down: its charge falls to 80 of the 200 h a Theseus battery holds */
    top({ hi: ['battery'], col, lit }, s => {
      const [bx, by, bw, bh] = MS_BATTERY, frac = hero ? 1 : lerp(1, 80 / THESEUS.hours, k);
      G.save(); G.globalAlpha = PA * a * lit * 0.55; G.fillStyle = cc; rrPath(bx + 1.2, by + 1.2 + (bh - 2.4) * (1 - frac), bw - 2.4, (bh - 2.4) * frac, 1.2); G.fill(); G.restore();
    });
  } else if (kind === 'optical') {
    /* the triggers' optical switches draw current from the battery: a dashed path runs from the battery to the switches */
    top({ hi: hero ? ['triggers'] : { triggers: 'bad' }, col, lit, show: ['battery'] }, s => {
      const sw = [[-11, -34], [11, -34]], [bx, by, bw, bh] = MS_BATTERY, src = [bx + bw / 2, by];
      for (const p of sw) {
        G.save(); G.globalAlpha = PA * a * lit; G.fillStyle = cc; rrPath(p[0] - 2.6, p[1] - 2.6, 5.2, 5.2, 0.8); G.fill(); G.restore();
        if (!hero) { const kk = clamp((t - t0 - 0.2) / 0.8); G.save(); G.globalAlpha = PA * a * Math.min(1, kk * 3) * (1 - 0.6 * ep(t, t0 + 1.2, t0 + 1.6)); G.strokeStyle = cc; G.lineWidth = lw(2); G.setLineDash([lw(5), lw(5)]); G.lineDashOffset = -(t - t0) * lw(40); G.beginPath(); G.moveTo(src[0], src[1]); G.lineTo(src[0], p[1] + 10); G.lineTo(p[0], p[1] + 2.6); G.stroke(); G.restore(); }
      }
    });
  } else if (kind === 'flex') {
    /* a fingertip presses the hump from behind and above, and the shell bows under it (a spring settles the bow), red where it bends */
    const V = msView('right'), s = sideS(10), cx = V.box[0] + V.box[2] / 2;
    const ox = x + w / 2 - cx * s, oy = y + h - 6, d = hero ? 0 : 3.4 * spring(t, t0 + 0.2, { f: 2.2, z: 0.5 });
    const hump = MS_SIDE.reduce((b, p) => (p[1] > b[1] ? p : b), [0, 0]), zc = hump[0] - 4, sig = 16;
    part(ox, oy, s, () => {
      mouseSimple('right', Object.assign({}, base, { hi: ['shell'], col, lit: hero ? lit : lit * 0.25 }));
      if (!hero) {
        const pts = MS_SIDE.filter(p => p[1] > 22 && p[0] > -42 && p[0] < 42).sort((p, q) => p[0] - q[0]).map(p => [p[0], -(p[1] - d * Math.exp(-Math.pow((p[0] - zc) / sig, 2)))]);
        G.save(); G.globalAlpha = PA * lit; G.strokeStyle = C.red; G.lineWidth = lw(2.8); G.beginPath(); pts.forEach((p, i) => i ? G.lineTo(p[0], p[1]) : G.moveTo(p[0], p[1])); G.stroke(); G.restore();
      }
    }, { alpha: a });
    if (!hero) { const pz = [ox + zc * s, oy - (hump[1] - d) * s]; finger(pz[0], pz[1], 2.55, { s: s * 0.62, press: clamp(d / 3.4), alpha: a * ep(t, t0, t0 + 0.25), len: 26 }); }
  } else if (kind === 'half') {
    /* the X2 from above, nose right: a cut runs across it and its back half comes away; the X2F is what's left (87.5 of 120 mm) */
    const s = Math.min((w - 20) / 120, (h - 8) / B01_X2F.W), full = b01_outline(B01_X2_HALF), cut = b01_outline(B01_X2_HALF, B01_X2F.cut, B01_X2F.r);
    const kc = hero ? 0 : ep(t, t0 + 0.05, t0 + 0.4, E.cam), kk = hero ? 0 : ep(t, t0 + 0.4, t0 + 1.0, E.snap), ox = x + w / 2 + 60 * s + 4, oy = y + h / 2;
    part(ox, oy, s, () => {
      if (!hero) {
        /* the rear piece, beyond the cut: sliding back and settling as a dashed red ghost of what was given up */
        G.save(); G.translate(0, kk * 9); G.globalAlpha = PA * lerp(1, 0.55, kk); G.beginPath(); G.rect(-40, B01_X2F.cut, 80, 40); G.clip();
        if (kk < 0.02) { G.fillStyle = C.panel; G.fill(full.path); G.strokeStyle = inkA(TH ? 0.78 : 0.7); G.lineWidth = lw(2); G.stroke(full.path); }
        else { G.setLineDash([lw(4), lw(3.5)]); G.strokeStyle = C.red; G.lineWidth = lw(1.8); G.stroke(full.path); }
        G.restore();
      }
      G.save(); G.globalAlpha = PA; G.fillStyle = C.panel; G.fill((hero ? full : cut).path); G.strokeStyle = hero ? C.hero : inkA(TH ? 0.78 : 0.7); G.lineWidth = lw(hero ? 2.2 : 2); G.stroke((hero ? full : cut).path); G.restore();
      if (!hero && kc > 0) { G.save(); G.globalAlpha = PA * lit; G.strokeStyle = C.red; G.lineWidth = lw(3); G.beginPath(); G.moveTo(-B01_X2F.W / 2 - 3, B01_X2F.cut); G.lineTo(-B01_X2F.W / 2 - 3 + (B01_X2F.W + 6) * kc, B01_X2F.cut); G.stroke(); G.restore(); }
    }, { alpha: a, rot: Math.PI / 2 });
  } else if (kind === 'wire') {
    /* a cable runs out of the nose: the mouse is tied to the PC */
    const V = msView('top'), s = Math.min((w - 34) / V.box[3], (h - 8) / V.box[2]), mx = x + w / 2 - 14;
    part(mx, y + h / 2, s, () => mouseSimple('top', Object.assign({}, base, { hi: hero ? ['shell'] : [], col, lit })), { alpha: a, rot: Math.PI / 2 });
    if (!hero) { const nx = mx + (-KEY.nose * MS_K.y) * s, ny = y + h / 2; poly([[nx - 1, ny], [nx + 8, ny], [nx + 18, ny + 5], [x + w + 4, ny + 8]], { color: C.red, w: 3, p: k, alpha: a * lit }); }
  } else if (kind === 'theseus') {
    top({ hi: ['shell'], col: 'hero', lit, show: ['battery'] });
  }
}

/* ================================ 2. Every flagship compromises (most important; the close answers it) ================================
   A stage, one flagship at a time (integrator, 08:35): each one drawn big while its compromise happens to it for about a
   second, caused by something you can see (M1, M2): the Pro X3 Superstrike's 59.0 g tips a balance against a 29.3 g mouse;
   the HTS Ultra 8K's battery runs dry at 80 h while the clock runs on to 200; the Viper V4 Pro's optical switches fire their
   beams and eat 17.6 % of its battery; a fingertip bows the ULX's shell, red where it bends; a cut takes the back half off the
   X2; a cable runs out of the XA25's nose. Each then shrinks into its row of the ledger on the right, keeping its red word
   and figure. Then Theseus lands, whole and blue, giving up nothing. Frame one is already mid-compromise (M6). */
const B01_STAGE = { box: [80, 384, 1010, 410], beat: 1.05, t0: -0.45, list: { x: 1180, y: 330, rh: 80, icon: [118, 62] } };
/* beat i starts at b01_beatT(i): the first is already playing at frame one and holds a little longer (the hook), then one a second */
const b01_beatT = i => i <= 0 ? -0.35 : 1.15 + (i - 1) * 1.0;
/** the ledger list's row i (0..5; 6 = Theseus): its top y */
const b01_rowY = i => B01_STAGE.list.y + i * B01_STAGE.list.rh + (i >= 6 ? 18 : 0);
/** draw fn while its box flies from `from` to `to` (stage px), k 0..1: a zoom about a moving centre, so the drawing shrinks into
   its row (M9). Kept in the deck's transform stack (xsave / xmove / xscale), so lw() and part() still know the scale */
function b01_fly(k, from, to, fn) {
  if (k <= 0.0005) { fn(); return; }
  const [x0, y0, w0, h0] = from, [x1, y1, w1, h1] = to, e = E.cam(clamp(k)), sc = Math.pow(Math.min(w1 / w0, h1 / h0), e);
  const cx = lerp(x0 + w0 / 2, x1 + w1 / 2, e), cy = lerp(y0 + h0 / 2, y1 + h1 / 2, e);
  if (!XF.st.length) XF.m = [1, 0, 0, 1, 0, 0];
  xsave(); xmove(cx, cy); xscale(sc); xmove(-(x0 + w0 / 2), -(y0 + h0 / 2));
  try { fn(); } finally { xrest(); }
}
/* ---------- the six demonstrations, drawn big in box = [x, y, w, h] (stage px); s0 = when the beat starts; o.textA fades
   their small readouts as they fly ---------- */
/** a plain dish hung from its beam end by two strings */
function b01_pan(px, py, w, col, a) { poly([[px - w / 2, py - 7], [px - w / 2 + 10, py], [px + w / 2 - 10, py], [px + w / 2, py - 7]], { color: col, w: 3, alpha: a }); }
function b01_bigWeight(t, s0, box, o = {}) {
  const [x, y, w, h] = box, cx = x + w / 2, py = y + 58, half = 300, hang = 150, ta = o.textA == null ? 1 : o.textA;
  /* the X3 falls onto the left pan (free fall, 0.22 s), then the beam tips to its stop and a spring settles it */
  const kd = clamp((t - s0) / 0.2), fall = 1 - kd * kd, th = 0.2 * spring(t, s0 + 0.12, { f: 1.8, z: 0.5 });
  const L = [cx - half * Math.cos(th), py + half * Math.sin(th)], R = [cx + half * Math.cos(th), py - half * Math.sin(th)];
  const ink = inkA(TH ? 0.7 : 0.62);
  /* the stand: a foot, a post, the pivot */
  rr(cx - 70, y + h - 12, 140, 12, 4, inkA(TH ? 0.18 : 0.22));
  line(cx, y + h - 12, cx, py, { color: ink, w: 5 });
  line(L[0], L[1], R[0], R[1], { color: C.ink, w: 6, cap: 'round' });
  circle(cx, py, 9, { fill: C.bg, color: C.ink, w: 3 });
  const panW = 270, LP = [L[0], L[1] + hang], RP = [R[0], R[1] + hang];
  for (const [E0, P0] of [[L, LP], [R, RP]]) { line(E0[0], E0[1], P0[0] - panW / 2 + 4, P0[1] - 6, { color: ink, w: 1.6 }); line(E0[0], E0[1], P0[0] + panW / 2 - 4, P0[1] - 6, { color: ink, w: 1.6 }); }
  b01_pan(LP[0], LP[1], panW, C.red, 1); b01_pan(RP[0], RP[1], panW, ink, 1);
  /* the mice on the pans, side view (nose right), 2 px per mm */
  const V = msView('right'), s = 2.0, mcx = V.box[0] + V.box[2] / 2;
  part(RP[0] - mcx * s, RP[1] - 2, s, () => mouseSimple('right', { lw: 1.6, lineA: 0.55, fill: 'rgba(0,0,0,0)' }));
  part(LP[0] - mcx * s, LP[1] - 2 - fall * 230, s, () => mouseSimple('right', { lw: 2, hi: ['shell'], col: 'bad', lit: ep(t, s0 + 0.15, s0 + 0.45) }));
  text('59.0 g', LP[0], LP[1] + 46, { role: 'num', size: 30, weight: 800, color: C.red, align: 'center', alpha: ta });
  text('29.3 g', RP[0], RP[1] + 46, { role: 'num', size: 30, weight: 700, color: C.mute, align: 'center', alpha: ta });
}
function b01_bigBattery(t, s0, box, o = {}) {
  const [x, y, w, h] = box, ta = o.textA == null ? 1 : o.textA;
  /* the clock runs from 0 to 200 h; the battery holds 80 */
  const hrs = 200 * clamp((t - s0 - 0.04) / 0.7), frac = clamp(1 - hrs / 80), dead = hrs >= 80;
  /* left: the mouse, nose right, its battery lit and emptying with the gauge */
  const V = msView('top'), sm = 2.55, mx = x + 150, my = y + h / 2;
  part(mx, my, sm, () => {
    mouseSimple('top', { lw: 2, hi: ['battery'], col: 'bad', lit: ep(t, s0, s0 + 0.3) });
    const [bx, by, bw, bh] = MS_BATTERY;
    G.save(); G.globalAlpha = PA * 0.6; G.fillStyle = C.red; rrPath(bx + 1.2, by + 1.2 + (bh - 2.4) * (1 - frac), bw - 2.4, (bh - 2.4) * frac, 1.2); G.fill(); G.restore();
  }, { rot: Math.PI / 2 });
  /* right: the battery, big, with the hours under it */
  const gx = x + 360, gy = y + 110, gw = 560, gh = 150;
  rr(gx, gy, gw, gh, 14, null, C.ink, 4); rr(gx + gw + 4, gy + gh / 2 - 26, 16, 52, 5, C.ink);
  if (frac > 0) rr(gx + 10, gy + 10, (gw - 20) * frac, gh - 20, 8, frac < 0.3 ? C.red : inkA(TH ? 0.42 : 0.5));
  if (dead) { const k = ep(t, s0 + 0.04 + 0.7 * 0.4, s0 + 0.04 + 0.7 * 0.4 + 0.18); line(gx + gw / 2 - 40, gy + gh / 2 - 40, gx + gw / 2 + 40, gy + gh / 2 + 40, { color: C.red, w: 8, alpha: k, cap: 'round' }); line(gx + gw / 2 - 40, gy + gh / 2 + 40, gx + gw / 2 + 40, gy + gh / 2 - 40, { color: C.red, w: 8, alpha: k, cap: 'round' }); }
  /* the hour axis: the cursor runs on past the empty point */
  const ay = gy + gh + 56, X = v => gx + gw * v / 200;
  line(gx, ay, gx + gw, ay, { color: inkA(0.3), w: 2 });
  line(X(80), ay, X(Math.min(hrs, 200)), ay, { color: C.red, w: 2, dash: [6, 6] });
  line(gx, ay, X(Math.min(hrs, 80)), ay, { color: C.ink, w: 4 });
  for (const v of [0, 80, 200]) { line(X(v), ay - 8, X(v), ay + 8, { color: v === 80 ? C.red : inkA(0.45), w: 2 }); text(v + ' h', X(v), ay + 36, { role: 'num', size: 26, weight: v === 80 ? 800 : 600, color: v === 80 ? C.red : C.mute, align: 'center', alpha: ta }); }
  const cxr = X(Math.min(hrs, 200)); G.save(); G.fillStyle = C.ink; G.beginPath(); G.moveTo(cxr, ay - 10); G.lineTo(cxr - 8, ay - 24); G.lineTo(cxr + 8, ay - 24); G.closePath(); G.fill(); G.restore();
}
function b01_bigOptical(t, s0, box, o = {}) {
  const [x, y, w, h] = box, ta = o.textA == null ? 1 : o.textA;
  /* left: the mouse from above, nose right; its two optical switches fire their beams and draw current from the battery */
  const sm = 3.3, mx = x + 230, my = y + h / 2 - 6, on = ep(t, s0 + 0.03, s0 + 0.16), eat = ep(t, s0 + 0.1, s0 + 0.7, E.io3);
  const sw = [[-11, -34], [11, -34]];
  part(mx, my, sm, () => {
    mouseSimple('top', { lw: 2, hi: { triggers: 'bad' }, lit: on * 0.8, show: ['battery'] });
    const [bx, by, bw] = MS_BATTERY, src = [bx + bw / 2, by];
    for (const p of sw) {
      G.save(); G.globalAlpha = PA; G.fillStyle = C.panel; G.strokeStyle = C.red; G.lineWidth = lw(2.2); rrPath(p[0] - 4, p[1] - 3.2, 8, 6.4, 0.8); G.fill(); G.stroke();
      /* the beam across the switch: its LED firing (dashes running from emitter to receiver) */
      G.globalAlpha = PA * on; G.setLineDash([lw(5), lw(4)]); G.lineDashOffset = -(t - s0) * lw(60); G.lineWidth = lw(3); G.beginPath(); G.moveTo(p[0] - 3, p[1]); G.lineTo(p[0] + 3, p[1]); G.stroke();
      /* the current, from the battery to the switch */
      G.lineWidth = lw(2.2); G.setLineDash([lw(6), lw(6)]); G.lineDashOffset = -(t - s0) * lw(55); G.beginPath(); G.moveTo(src[0] + p[0] * 0.3, src[1]); G.lineTo(src[0] + p[0] * 0.3, p[1] + 9); G.lineTo(p[0], p[1] + 9); G.lineTo(p[0], p[1] + 3.2); G.stroke(); G.restore();
    }
  }, { rot: Math.PI / 2 });
  /* name the switches on the drawing (the rotated frame: key plan (px, py) lands at (mx - py s, my + px s)) */
  const sp = [mx - sw[1][1] * sm, my + sw[1][0] * sm];
  faultTag(t, s0 + 0.1, sp, 'Optical switches', { dx: 90, dy: 96, alpha: ta });
  /* right: its battery, the share its switches eat turning red and emptying */
  const gx = x + 470, gy = y + 110, gw = 500, gh = 140, eatW = (gw - 20) * B01_OPT.share;
  rr(gx, gy, gw, gh, 14, null, C.ink, 4); rr(gx + gw + 4, gy + gh / 2 - 24, 16, 48, 5, C.ink);
  rr(gx + 10, gy + 10, gw - 20 - eatW * eat, gh - 20, 8, inkA(TH ? 0.42 : 0.5));
  if (eat > 0.01) { G.save(); G.setLineDash([10, 8]); G.strokeStyle = C.red; G.lineWidth = 3; rrPath(gx + 10 + gw - 20 - eatW, gy + 10, eatW, gh - 20, 8); G.globalAlpha = eat; G.stroke(); G.restore(); }
  text(fmtN(B01_OPT.share * 100, 1) + ' %', gx + gw - 10 - eatW / 2, gy + gh + 46, { role: 'num', size: 30, weight: 800, color: C.red, align: 'center', alpha: ta * eat });
  text('to the switches', gx + gw - 10 - eatW / 2, gy + gh + 78, { role: 'label', size: 19, color: C.red, align: 'center', alpha: ta * eat });
}
function b01_bigFlex(t, s0, box, o = {}) {
  const [x, y, w, h] = box, ta = o.textA == null ? 1 : o.textA;
  /* the side view, nose right, big; a fingertip presses the top and the shell bows under it, a spring settling the bow */
  const V = msView('right'), s = Math.min((w - 120) / V.box[2], (h - 70) / V.box[3]), cx = V.box[0] + V.box[2] / 2, ox = x + w / 2 - cx * s, oy = y + h - 20;
  const d = 3.0 * spring(t, s0 + 0.06, { f: 2.4, z: 0.42 }), hump = MS_SIDE.reduce((b, p) => (p[1] > b[1] ? p : b), [0, 0]), zc = hump[0] - 4, sig = 17;
  const bow = p => d * Math.exp(-Math.pow((p[0] - zc) / sig, 2));
  part(ox, oy, s, () => {
    mouseSimple('right', { lw: 2, lineA: 1 });
    /* the bowed stretch of the top, coloured by how hard it bends (red at the peak) */
    const pts = MS_SIDE.filter(p => p[1] > 20 && p[0] > -48 && p[0] < 44).sort((p, q) => p[0] - q[0]);
    for (let i = 1; i < pts.length; i++) {
      const a0 = pts[i - 1], a1 = pts[i], k = (bow(a0) + bow(a1)) / 2 / 3.0;
      G.save(); G.globalAlpha = PA; G.strokeStyle = heatCol(k); G.lineWidth = lw(4); G.lineCap = 'round'; G.beginPath(); G.moveTo(a0[0], -(a0[1] - bow(a0))); G.lineTo(a1[0], -(a1[1] - bow(a1))); G.stroke(); G.restore();
    }
    /* creaks: two short ticks where the bow ends meet the stiff wall, at the peak of the press */
    const ck = clamp(d / 3.0) * ep(t, s0 + 0.22, s0 + 0.36) * (1 - ep(t, s0 + 0.62, s0 + 0.74));
    for (const zz of [zc - 30, zc + 30]) { const p = MS_SIDE.reduce((b, q) => (Math.abs(q[0] - zz) < Math.abs(b[0] - zz) && q[1] > 20 ? q : b), [99, 0]); G.save(); G.globalAlpha = PA * ck; G.strokeStyle = C.red; G.lineWidth = lw(2.4); for (const r of [3, 5.5]) { G.beginPath(); G.arc(p[0], -p[1], r, -Math.PI * 0.95, -Math.PI * 0.05); G.stroke(); } G.restore(); }
  });
  const pz = [ox + zc * s, oy - (hump[1] - d) * s];
  finger(pz[0], pz[1], 2.15, { s: s * 0.7, press: clamp(d / 3.0), len: 34 });
  text('A firm press', pz[0] + 150, pz[1] - 120, { role: 'label', size: 21, color: C.ink2, alpha: ta * ep(t, s0 + 0.1, s0 + 0.3) });
  text('Bend drawn larger than life', x + w, y + h + 22, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: ta * 0.9 });
}
function b01_bigHalf(t, s0, box, o = {}) {
  const [x, y, w, h] = box, ta = o.textA == null ? 1 : o.textA;
  /* the X2 from above, nose right; a cut runs across it at 87.5 mm and its back half comes away and dissolves */
  const s = Math.min((w - 120) / 120, (h - 80) / B01_X2F.W), full = b01_outline(B01_X2_HALF), cut = b01_outline(B01_X2_HALF, B01_X2F.cut, B01_X2F.r);
  const ox = x + w / 2 + 60 * s + 30, oy = y + h / 2 - 10, kc = ep(t, s0 + 0.02, s0 + 0.26, E.cam), kk = ep(t, s0 + 0.26, s0 + 0.72, E.snap);
  part(ox, oy, s, () => {
    /* the back half: solid until the cut has run, then sliding back, fading to a dashed red ghost */
    G.save(); G.translate(0, kk * 14); G.beginPath(); G.rect(-40, B01_X2F.cut, 80, 40); G.clip();
    if (kk < 0.03) { G.globalAlpha = PA; G.fillStyle = C.panel; G.fill(full.path); G.strokeStyle = inkA(TH ? 0.78 : 0.7); G.lineWidth = lw(2); G.stroke(full.path); }
    else { G.globalAlpha = PA * lerp(1, 0.6, kk); G.setLineDash([lw(6), lw(5)]); G.strokeStyle = C.red; G.lineWidth = lw(2.2); G.stroke(full.path); }
    G.restore();
    G.save(); G.globalAlpha = PA; G.fillStyle = C.panel; G.fill(cut.path); G.strokeStyle = inkA(TH ? 0.78 : 0.7); G.lineWidth = lw(2.2); G.stroke(cut.path); G.restore();
    if (kc > 0) { G.save(); G.globalAlpha = PA; G.strokeStyle = C.red; G.lineWidth = lw(4); G.beginPath(); G.moveTo(-B01_X2F.W / 2 - 6, B01_X2F.cut); G.lineTo(-B01_X2F.W / 2 - 6 + (B01_X2F.W + 12) * kc, B01_X2F.cut); G.stroke(); G.restore(); }
  }, { rot: Math.PI / 2 });
  /* its length, against the whole mouse's */
  const yd = oy + B01_X2F.W / 2 * s + 34, xn = ox, xc = ox - B01_X2F.cut * s, x0 = ox - 120 * s;
  if (ta > 0.5) dim(t, s0 + 0.3, [xc, yd - 22], [xn, yd - 22], '87.5 mm', 22);
  line(x0, yd, xc - 6, yd, { color: C.red, w: 1.6, dash: [5, 5], alpha: ta * kk });
}
function b01_bigWire(t, s0, box, o = {}) {
  const [x, y, w, h] = box;
  /* from above, nose right; a cable runs out of the nose, snaking as it pays out, to the edge of the stage: tied to the PC */
  const V = msView('top'), sm = 3.2, mx = x + 270, my = y + h / 2 - 10, k = ep(t, s0 + 0.04, s0 + 0.7, E.out3);
  part(mx, my, sm, () => mouseSimple('top', { lw: 2 }), { rot: Math.PI / 2 });
  const nx = mx + (-KEY.nose * MS_K.y) * sm, ny = my, xe = x + w + 40, pts = [];
  for (let i = 0; i <= 60; i++) { const u = i / 60, xx = lerp(nx, xe, u), amp = 46 * Math.sin(u * Math.PI) * (1 - 0.6 * u), yy = ny + amp * Math.sin(u * TAU * 1.25 - 0.4) * (1 - 0.35 * k); pts.push([xx, yy]); }
  poly(pts, { color: C.red, w: 6, p: k, cap: 'round' });
  rr(nx - 6, ny - 9, 16, 18, 4, C.red);
}
function b01_bigTheseus(t, s0, box, o = {}) {
  const [x, y, w, h] = box, k = spring(t, s0, { f: 1.8, z: 0.7 }), a = ep(t, s0, s0 + 0.3);
  /* whole, blue, nose right: nothing given up */
  const sm = 3.6 * lerp(0.9, 1, k);
  part(x + 218, y + h / 2 - 6, sm, () => mouseSimple('top', { lw: 2.2, hi: ['shell'], col: 'hero', lit: ep(t, s0 + 0.1, s0 + 0.5), show: ['battery'] }), { alpha: a, rot: Math.PI / 2 });
}
const B01_BIG = { weight: b01_bigWeight, battery: b01_bigBattery, optical: b01_bigOptical, flex: b01_bigFlex, half: b01_bigHalf, wire: b01_bigWire };
/** the ledger on the right: six rows waiting from the first frame; each fills as its flagship flies in. o.answer (the close):
   { t0, step } strikes each red figure and writes Theseus's answer beside it in blue */
function b01_ledgerList(t, o = {}) {
  const Lt = B01_STAGE.list, x = Lt.x, r = RM, a0 = ep(t, 0, 0.4);
  text(o.head || 'Six flagships, six trades', x, Lt.y - 14, { role: 'label', size: 20, color: C.mute, alpha: a0 });
  B01_TRADES.forEach((tr, i) => {
    const y = b01_rowY(i), tf = o.rowT ? o.rowT(i) : -1, kf = ep(t, tf, tf + 0.3), ki = ep(t, tf + 0.1, tf + 0.35);
    line(x, y, r, y, { color: C.hair, w: 1.2, alpha: a0 });
    if (kf <= 0.003) return;
    b01_tradeIcon(t, -10, tr.icon, [x, y + 9, Lt.icon[0], Lt.icon[1]], { a: ki });
    const nx = x + Lt.icon[0] + 22;
    text(tr.name, nx, y + 34, { role: 'h3', size: 26, weight: 750, color: C.ink, alpha: kf, sentence: false });
    text(tr.small, nx, y + 63, { role: 'small', size: 20, weight: 600, color: C.mute, alpha: kf, sentence: false, maxW: r - nx - 150 });
    const ans = o.answer ? ep(t, o.answer.t0 + i * o.answer.step, o.answer.t0 + i * o.answer.step + 0.45) : 0;
    const figC = ans > 0 ? mix(C.red, C.faint, ans) : C.red;
    text(tr.what, r, y + 30, { role: 'label', size: 19, color: figC, align: 'right', alpha: kf });
    const fw = text(tr.fig, r, y + 64, { role: 'num', size: 30, weight: 800, color: figC, align: 'right', alpha: kf }).w;
    if (ans > 0) {
      line(r - fw - 4, y + 54, r - fw - 4 + (fw + 8) * clamp(ans * 1.6), y + 54, { color: C.mute, w: 2.5 });
      text(tr.ans, r - fw - 24, y + 64, { role: 'num', size: 30, weight: 800, color: C.heroText, align: 'right', alpha: ans });
    }
  });
  /* Theseus's row */
  const tT = o.thsT == null ? 99 : o.thsT, kT = ep(t, tT, tT + 0.4), y = b01_rowY(6);
  line(x, y - 8, x + (r - x) * ep(t, tT - 0.1, tT + 0.5, E.cam), y - 8, { color: C.hero, w: 2.5 });
  if (kT > 0.003) {
    b01_tradeIcon(t, tT, 'theseus', [x, y + 9, Lt.icon[0], Lt.icon[1]], { a: kT });
    const nx = x + Lt.icon[0] + 22;
    text('Theseus', nx, y + 36, { role: 'h3', size: 28, weight: 800, color: C.heroText, grad: C.heroGrad, alpha: kT, sentence: false });
    text('Nitrite Labs, ' + THS.price + ', 29.3 g', nx, y + 64, { role: 'small', size: 20, weight: 650, color: C.heroText, alpha: kT, sentence: false });
    text('Gives up', r, y + 30, { role: 'label', size: 19, color: C.heroText, align: 'right', alpha: kT });
    text('Nothing', r, y + 66, { role: 'num', size: 32, weight: 800, color: C.heroText, grad: C.heroGrad, align: 'right', alpha: kT });
  }
}
S({
  id: 'b01_compromise', ch: 'intro', theme: 'paper', title: 'Every flagship compromises', settle: 9,
  replaces: ['flagships', 'thesis'],
  src: ['b01X3', 'b01X3Psn', 'b01X3Pcg', 'b01TpuHtsU', 'b01GwHtsU', 'b01Optical', 'clk_d2fp', 'ntrTpuV4', 'b01RtUlx', 'rtingsUlx', 'b01X2f', 'b01X2fWt', 'x2fCrazy', 'b01X2Trace', 'exXbabWeight', 'ntrStores', 'ntrRazerV4', 'nbcUlx', 'exRtings'],
  answers: [
    ['flagships: "need to derive all empty data"', 'No blanks left: each flagship shows the one thing it trades, and every one has its figure, sourced (Logitech, TechPowerUp, RTINGS, Pulsar, XBAB) or derived and marked so (the Viper V4 Pro\'s 17.6 %, worked from Omron\'s optical pulse and its own battery). The other numbers sit in each row\'s small print, none blank'],
    ['flagships: "it bothers me when one number has more decimal places than others"', 'One precision per kind: every weight to 0.1 g (59.0, 31.0, 38.0, 29.5, 24.9, and Theseus 29.3), hours whole, the optical share to 0.1 % (17.6 %, not rounded up to 18)'],
    ['flagships: "superstrike x3 is more of a flagship than gpx2"', 'The GPX2 is gone; Logitech\'s flagship is the Pro X3 Superstrike (launched 2026-09-23): its 59.0 g tips a balance against a 29.3 g mouse'],
    ['thesis: "all of these numbers feel very random"', 'The eight specimen tiles are gone. Every number here belongs to a named flagship\'s trade, with its source in the foot line'],
    ['thesis: "the message is good but you can add it to the slide about other companies misadvertising weights"', 'Done: b01_listed (Listed against weighed) carries it ("the weight on the card is the scale\'s"); here it closes the slide in one line, "Optimization over opinion: measure every trade, then design it out"'],
    ['F18.4 (keep price charted)', 'Each flagship\'s price stands in its row\'s small print, and price against weight is charted on b01_price, with the Viper Mini Signature Edition, the Zaunkoenig M3K and the X3 Superstrike added'],
    ['F33.7 (zero compromises; highlight the compromises other flagships make)', 'The film\'s problem slide: six flagships, each shown big while its compromise happens to it (weight, battery, battery to optical clicks, strength, the shape, wireless), each landing in the ledger in red; Theseus lands whole and gives up nothing. The close answers the same six rows']
  ],
  draw: t => {
    header(t, 'Every flagship compromises');
    captions(t, [[0.3, 'Six flagships, six trades: each one gives something up to win something else.'],
      [6.1, 'Theseus gives up nothing. Optimization over opinion: measure every trade, then design it out.']]);
    const SB = B01_STAGE.box, n = B01_TRADES.length, Lt = B01_STAGE.list, tT = b01_beatT(n) + 0.05;
    /* the stage: the beat in play, big; as it ends it flies into its row */
    B01_TRADES.forEach((tr, i) => {
      const s0 = b01_beatT(i), end = b01_beatT(i + 1), kin = ep(t, s0 - 0.22, s0 + 0.04), kout = ep(t, end - 0.26, end);
      if (t < s0 - 0.22 || kout >= 1) return;
      const row = [Lt.x, b01_rowY(i) + 9, Lt.icon[0], Lt.icon[1]], ta = 1 - clamp(kout * 3);
      b01_fly(kout, SB, row, () => { G.globalAlpha = 1; B01_BIG[tr.icon](t, s0, SB, { textA: ta * kin }); });
      /* the beat's words: maker and name over the drawing, what it gives up under it, in red */
      const kw = kin * (1 - ep(t, end - 0.38, end - 0.22));
      text(tr.brand, LM, 312, { role: 'label', size: 22, color: C.mute, alpha: kw });
      text(tr.name, LM - 2, 364, { role: 'h2', size: 50, color: C.ink, alpha: kw });
      text('Gives up ' + tr.what.toLowerCase(), LM, 838, { role: 'label', size: 22, color: C.red, alpha: kw });
      const fr = text(tr.fig, LM - 3, 928, { role: 'd1', size: 88, weight: 800, track: -0.02, color: C.red, alpha: kw, tnum: false });
      text('for ' + tr.why.charAt(0).toLowerCase() + tr.why.slice(1), LM + fr.w + 36, 922, { role: 'small', size: 27, weight: 600, color: C.ink2, alpha: kw, sentence: false });
    });
    /* Theseus lands: whole, blue, nothing given up, and the six trades it doesn't make */
    const kT = ep(t, tT, tT + 0.3);
    if (kT > 0.003) {
      b01_bigTheseus(t, tT, SB);
      text('Nitrite Labs', LM, 312, { role: 'label', size: 22, color: C.heroText, alpha: kT });
      text('Theseus', LM - 2, 364, { role: 'h2', size: 50, color: C.heroText, grad: C.heroGrad, alpha: kT });
      text('Gives up', LM, 838, { role: 'label', size: 22, color: C.heroText, alpha: kT });
      text('Nothing', LM - 3, 928, { role: 'd1', size: 88, weight: 800, track: -0.02, color: C.heroText, grad: C.heroGrad, alpha: kT, rise: [tT + 0.12, 0.6], t });
      [['Weight', '29.3 g'], ['Battery', '200 h'], ['To its clicks', '0 %'], ['Strength', 'Solid, arched'], ['The shape', 'Full, 119.3 mm'], ['Wireless', 'Dual 8khz wired and wireless']].forEach(([wd, v], j) => {
        const yy = 436 + j * 60, kj = ep(t, tT + 0.4 + j * 0.07, tT + 0.75 + j * 0.07);
        if (j) line(560, yy - 40, 1110, yy - 40, { color: C.hair, w: 1, alpha: kj });
        text(wd, 560, yy, { role: 'label', size: 20, color: C.mute, alpha: kj });
        text(v, 1110, yy, { role: 'h3', size: 28, weight: 750, color: C.heroText, align: 'right', alpha: kj, sentence: false });
      });
    }
    b01_ledgerList(t, { rowT: i => b01_beatT(i + 1) - 0.04, thsT: tT + 0.25 });
    source(t, 'Weights to 0.1 g: TechPowerUp and RTINGS scales, makers\' figures, the X2F as reported (Pulsar: 29 g ± 2). 17.6 %: Omron\'s optical pulse over the V4 Pro\'s 306 mAh in 180 h.', { t0: 0.6 });
  }
});

/* ================================ 5. Why lighter wins (his important idea, F9.26, F33.5) ================================
   Argued from F = m · a, not "overall speed" (his note): the same push stops and turns half the mass in half the time.
   The classroom version first (two carts, the same push back on each: OpenStax College Physics 2e §4.3), then the same
   physics on a flick: a mouse crosses its target at 0.5 m/s and the same finger push, 0.54 N (one GT01 click's force, the
   kit's SCALE.click), brakes it and brings it back. Time since crossing τ: brake to a stop in m v / F over m v² / 2F, then
   back to the target in 2 √(d m / F) (push half way, brake half way). Pro X3 Superstrike 59.0 g: 132 ms; Theseus 29.3 g:
   66 ms. The player fires at 70 ms: Theseus is on the target, the X3 is 12.6 mm past it. The mouse's own inertia only: the
   hand's comes on top (b01HandMass), said in the foot line. */
const B01_LT = { v: 0.5, F: SCALE.click.N, slow: 20, mR: 0.059, tF: 3.3, fire: 0.07, tc: 0.3 };
/** the flick's numbers for a mass m (kg): { a (m/s²), ts (s to stop), d (mm of overshoot), tr (s back to the target), total } */
function b01_flickInfo(m) { const F = B01_LT.F, v = B01_LT.v, a = F / m, ts = m * v / F, d = v * v / (2 * a), tr = 2 * Math.sqrt(d / a); return { a, ts, d: d * 1000, tr, total: ts + tr }; }
/** mm past the target, τ s after the mouse crosses it (negative before) */
function b01_flickP(m, tau) {
  const I = b01_flickInfo(m), v = B01_LT.v, a = I.a, d = I.d / 1000;
  if (tau < 0) return v * tau * 1000;
  if (tau < I.ts) return (v * tau - 0.5 * a * tau * tau) * 1000;
  const u = tau - I.ts;
  if (u < I.tr / 2) return (d - 0.5 * a * u * u) * 1000;
  if (u < I.tr) return 0.5 * a * (I.tr - u) * (I.tr - u) * 1000;
  return 0;
}
/** which way the finger pushes at τ: -1 back (braking, then heading home), +1 forward (easing it onto the target), 0 none */
function b01_flickPush(m, tau) { const I = b01_flickInfo(m); return tau < 0 || tau >= I.total ? 0 : tau < I.ts + I.tr / 2 ? -1 : 1; }
/** a classroom dynamics cart: (x, yT) = its body's left edge and the track's top; mult 1 or 2 (a block on top) */
function b01_cart(x, yT, mult, o = {}) {
  const a = o.a == null ? 1 : o.a; if (a <= 0.003) return;
  const bw = 124, bh = 40, wr = 12, by = yT - wr * 2 - bh + 6, ln = o.line || inkA(TH ? 0.75 : 0.7);
  rr(x, by, bw, bh, 6, o.fill || (C.panel), ln, 2, a);
  for (const wx of [x + 28, x + bw - 28]) { circle(wx, yT - wr, wr, { fill: C.panel, alpha: a }); circle(wx, yT - wr, wr, { color: ln, w: 2, alpha: a }); circle(wx, yT - wr, 3, { fill: ln, alpha: a }); }
  if (mult === 2) rr(x + 22, by - 34, bw - 44, 34, 4, inkA(TH ? 0.16 : 0.22), ln, 2, a);
  if (!o.ghost) text(mult === 2 ? '2×' : '1×', x + bw / 2, mult === 2 ? by - 10 : by + 27, { role: 'label', size: 19, color: C.ink2, align: 'center', alpha: a });
}
/** the player's screen for one lane: a target, the crosshair moved by the mouse (p mm past the target), and the shot at
   fire time: HIT (a blue ring) or MISS (a red ×), in the kit's shotInset look, but driven by the flick's own physics */
function b01_scope(t, x, y, w, h, p, shotT, o = {}) {
  const a = o.a == null ? 1 : o.a; if (a <= 0.003) return;
  demoWindow(x, y, w, h, a, { fill: C.track });
  const tx = x + w * 0.42, ty = y + h * 0.5, tr = 10, k = o.k || 7, cx = tx + p * k, ch = C.ink;
  clipped(x, y, w, h, () => {
    circle(tx, ty, tr * 2.4, { color: inkA(0.18), w: 1.5, alpha: a }); circle(tx, ty, tr, { fill: C.ink, alpha: a });
    if (t >= shotT) {
      const kh = prog(t, shotT, shotT + 0.4), hit = Math.abs(o.pShot * k) < tr * 0.8, sx = tx + o.pShot * k;
      if (hit) { circle(tx, ty, tr * (1.4 + 1.6 * E.out3(kh)), { color: C.hero, w: 3 * (1 - kh) + 0.5, alpha: a * (1 - kh * 0.7) }); circle(sx, ty, tr * 0.42, { fill: C.hero, alpha: a }); }
      else { const r = tr * 0.6; line(sx - r, ty - r, sx + r, ty + r, { color: C.red, w: 3.5, alpha: a }); line(sx - r, ty + r, sx + r, ty - r, { color: C.red, w: 3.5, alpha: a }); }
      text(hit ? 'Hit' : 'Miss', x + w - 18, y + 34, { role: 'label', size: 22, color: hit ? C.heroText : C.red, align: 'right', alpha: a * ep(t, shotT, shotT + 0.2) });
    }
    const g = tr * 0.9, l2 = tr * 1.5;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) line(cx + dx * g, ty + dy * g, cx + dx * (g + l2), ty + dy * (g + l2), { color: ch, w: 2.5, alpha: a });
    circle(cx, ty, 1.8, { fill: ch, alpha: a });
  });
  if (o.label) text(o.label, x + 18, y + h - 16, { role: 'label', size: 19, color: C.mute, alpha: a });
}
S({
  id: 'b01_lighter', ch: 'intro', theme: 'night', title: 'Why lighter wins', settle: 10.5, ideas: ['weight'],
  replaces: ['zerograms'],
  src: ['b01OpenStax', 'exZk', 'exConroy', 'b01X3', 'clk_gt01', 'b01HandMass'],
  answers: [
    ['zerograms: "needs more reasoning, argument feels weak here"', 'The argument is worked on screen from F = m · a: first the classroom demonstration (two carts given the same push back; the one with half the mass stops in half the time and half the distance and turns back first; OpenStax College Physics 2e §4.3), then the same physics on a flick, where the same 0.54 N finger push brings a 29.3 g Theseus back onto its target in 66 ms against 132 ms for the 59.0 g Pro X3 Superstrike'],
    ['zerograms: "it should be more about theoretical ease of control and target changing speed"', 'It is now only that: how fast each mouse stops, turns and settles on a new target under the same push (back on target 132 → 66 ms, the shot at 70 ms a miss and a hit), and ease of control said outright: half the mass needs half the push for the same move'],
    ['zerograms: "overall speed feels outlandish"', 'Gone: no claim about overall speed or time to cross the screen. The only numbers are the mouse\'s own stop and turn under one push, and the foot line says they are the mouse\'s share (the hand\'s own mass comes on top)'],
    ['F9.26 (argue it from F = m · a, don\'t argue against it)', 'Argued from F = m · a and sold: "Half the push for the same move", no hedge'],
    ['F33.5 (an important idea, vastly improved)', 'A classroom demonstration, a physics-driven flick on two named mice with the same input, the shot it decides, and the verdict, in place of three lanes of pucks'],
    ['F33.7 (a higher skill ceiling as a selling point)', 'The payoff line: the same hands, finer control, a higher skill ceiling']
  ],
  draw: t => {
    header(t, 'Why lighter wins');
    captions(t, [[0.3, 'The classroom version: the same push on two carts. Half the mass stops and turns back in half the time.'],
      [2.9, 'Your flick is the same physics: the same finger push stops and turns 29.3 g twice as fast as 59.0 g.'],
      [6.3, 'Back on the target in half the time, with half the push for the same move. That raises the skill ceiling.']]);
    /* ---- the classroom version: two carts rolling right at the same speed, the same push back on each. On screen from
       frame one (M6): the panel is drawn and the carts are already rolling ---- */
    const PN = [80, 262, 720, 572], inner = demoPanel(t, -0.8, PN, { src: 'OpenStax 2e, §4.3' });
    text('F = m · a', PN[0] + 28, PN[1] + 118, { role: 'h2', size: 44, color: C.ink, caps: false });
    text('Two carts, one twice the mass, the same push on each', PN[0] + 28, PN[1] + 156, { role: 'small', size: 24, weight: 600, color: C.mute, maxW: PN[2] - 56 });
    const tc = B01_LT.tc, v = 230, x0 = 236, aH = 115, tEnd = 2.3, tracks = [[PN[1] + 270, 2, aH], [PN[1] + 410, 1, aH * 2]];
    tracks.forEach(([yT, mult, acc]) => {
      const tau = Math.min(t - tc, tEnd), X = u => x0 + v * u - (u > 0 ? 0.5 * acc * u * u : 0);
      line(PN[0] + 24, yT, PN[0] + PN[2] - 24, yT, { color: inkA(0.45), w: 2 });
      /* ghosts every 0.25 s since the push began: the cart's path stays on the settled frame */
      for (let g = 0.25; g < tau - 0.05; g += 0.25) b01_cart(X(g), yT, mult, { a: 0.12, ghost: true, fill: 'rgba(0,0,0,0)' });
      const xc = X(tau); b01_cart(xc, yT, mult, {});
      /* the same push back on both, its tip on the cart's front, while it acts */
      const kp = ep(t, tc - 0.05, tc + 0.2) * (1 - ep(t, tc + tEnd - 0.1, tc + tEnd + 0.15));
      if (kp > 0.01) forceArrow(xc + 124, yT - 38, Math.PI, 66, { k: kp, label: 'same push', color: C.ink, side: 'end' });
      /* where it stopped and turned, and when */
      const ts = v / acc, xs = X(ts) + 124, kst = ep(t, tc + ts, tc + ts + 0.25);
      if (kst > 0) { line(xs, yT - 6, xs, yT + 16, { color: C.ink, w: 2.5, alpha: kst }); text(mult === 2 ? 'Turns at {2t}' : 'Turns at {t}', xs, yT + 44, { role: 'label', size: 20, color: mult === 2 ? C.mute : C.ink, align: 'center', alpha: kst }); }
    });
    text('Half the mass stops in half the time and half the distance, and is first to turn back.', inner[0], PN[1] + PN[3] - 62, { role: 'small', size: 24, weight: 600, color: C.ink2, maxW: inner[2], alpha: ep(t, 2.0, 2.4), lh: 1.3 });
    /* ---- your flick: the same finger push on a 59.0 g and a 29.3 g mouse, slowed 20×, its movement drawn 5× larger ---- */
    const lanes = [{ m: B01_LT.mR, name: 'Pro X3 Superstrike, 59.0 g', col: C.secondText, y: 292 }, { m: THESEUS.mass / 1000, name: 'Theseus, 29.3 g', col: C.heroText, y: 500, hero: true }];
    const tF = B01_LT.tF, SL = B01_LT.slow, xt = 1110, sD = 1.6, sM = 8, V = msView('right'), shotT = tF + B01_LT.fire * SL;
    text('Your flick, slowed 20×: the same 0.54 N push on both, one click\'s force', 840, 300, { role: 'small', size: 22, weight: 600, color: C.mute, maxW: 1000 });
    lanes.forEach((L, j) => {
      const yT = L.y + 168, ka = 1, I = b01_flickInfo(L.m), tau = (t - tF) / SL, p = b01_flickP(L.m, Math.max(tau, -0.02));
      if (ka <= 0.003) return;
      text(L.name, 840, L.y + 52, { role: 'label', size: 22, color: L.col, alpha: ka });
      line(840, yT, 1410, yT, { color: inkA(0.35), w: 2, alpha: ka });
      line(xt, yT + 10, xt, L.y + 74, { color: inkA(0.5), w: 1.5, dash: [6, 6], alpha: ka });
      /* the sensor's path: a tick every 10 ms of the real flick, and a dashed ghost where it stopped */
      for (let g = -0.02; g < tau - 0.004; g += 0.01) { const xg = xt + b01_flickP(L.m, g) * sM; line(xg, yT + 4, xg, yT + 14, { color: L.hero ? C.hero : C.ink2, w: 2, alpha: ka * 0.75 }); }
      if (tau > I.ts) { const xs = xt + I.d * sM; part(xs, yT - 1, sD, () => mouseSimple('right', { lw: 1.4, lineA: 0.45, fill: 'rgba(0,0,0,0)' }), { alpha: ka * 0.8 });
        text(fmtN(I.d, 1) + ' mm past', xs, yT + 40, { role: 'label', size: 19, color: L.hero ? C.heroText : C.mute, align: 'center', alpha: ka * ep(t, tF + I.ts * SL, tF + I.ts * SL + 0.3) }); }
      const xm = xt + p * sM;
      part(xm, yT - 1, sD, () => mouseSimple('right', { lw: 2, hi: L.hero ? ['shell'] : [], col: 'hero', lit: L.hero ? 0.6 : 0 }), { alpha: ka });
      /* the finger's push: back while it brakes and heads home, forward as it eases onto the target */
      const dir = b01_flickPush(L.m, tau);
      if (dir) { const tip = dir < 0 ? xm + (V.box[0] + V.box[2]) * sD : xm + V.box[0] * sD; const fx = tip + (dir < 0 ? 4 : -4), fl = 56; forceArrow(fx, yT - 34, dir < 0 ? Math.PI : 0, fl, { k: 1, color: L.hero ? C.hero : C.ink }); text(fmtN(B01_LT.F, 2) + ' N', fx + (dir < 0 ? fl / 2 : -fl / 2), yT - 50, { role: 'num', size: 22, weight: 750, color: L.hero ? C.heroText : C.ink, align: 'center' }); }
      /* back on the target: when, in real milliseconds */
      const kb = ep(t, tF + I.total * SL, tF + I.total * SL + 0.3);
      b01_scope(t, 1460, L.y + 56, 380, 150, p, shotT, { a: ka, pShot: b01_flickP(L.m, B01_LT.fire), label: j ? '' : 'Fired at 70 ms', k: 7 });
      if (kb > 0) rich([{ s: fmtN(I.total * 1000, 0) + ' ms', role: 'num', size: 30, weight: 800, color: L.col }, { s: 'back on target', role: 'label', size: 19, color: C.mute, gap: 10 }], 1840, L.y + 232, { align: 'right', alpha: kb });
    });
    /* ---- the payoff ---- */
    const Rr = b01_flickInfo(B01_LT.mR), Tt = b01_flickInfo(THESEUS.mass / 1000);
    verdict(t, 6.3, 840, 880, { from: Math.round(Rr.total * 1000), to: Math.round(Tt.total * 1000), unit: 'ms', dec: 0, size: 96, label: 'Back on target after a turn', better: 'lower', who: ['59.0 g', '29.3 g'] });
    const kp2 = ep(t, 7.4, 7.9);
    text('Half the push for the same move.', LM, 884, { role: 'h3', size: 34, weight: 800, color: C.ink, alpha: kp2, sentence: false });
    text('The same hands, finer control: a higher skill ceiling.', LM, 926, { role: 'small', size: 26, weight: 600, color: C.heroText, alpha: ep(t, 7.7, 8.2), sentence: false });
    source(t, 'Derived: m v ÷ F to stop, 2 √(d m ÷ F) back, at 0.5 m/s and 0.54 N (a GT01 click, Gateron). Moves drawn 5× larger. The mouse\'s own inertia only.', { t0: 3.0, maxW: 720 });
  }
});
