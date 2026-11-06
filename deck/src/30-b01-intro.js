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
  b01X2fWt: { t: 'The X2F CrazyLight\'s weight: Pulsar lists 29 g ± 2 g; no independent scale weight is published (research Q1, 2026-11-06, English and Japanese sources); Brock\'s note says reports online put it at 29.5 g or more', u: '', n: 'Shown at the maker\'s 29.0 g until the report Brock saw is found.' },
  b01X2Trace: { t: 'The X2F\'s outline: the Pulsar X2 family\'s top silhouette, traced from Pulsar\'s own product photo of the X2H CrazyLight\'s base, scaled to the X2F\'s 61.1 mm width and cut at its 87.5 mm length', u: '', n: 'EloShapes\' outlines load in the browser and could not be read from this session.' },
  b01TpuUlx: { t: 'TechPowerUp, Finalmouse UltralightX review (the medium): $189 in its spec table; "My scale shows around 38 g (+/- 1 g)"; build quality: "minor creaking and significant flexing of the shell can be observed", "when applying pressure exactly at the top, the entire top contracts"; "The battery has a capacity of 250 mAh (3.87 V)"; Finalmouse states "up to two months"', u: 'https://techpowerup.com/review/finalmouse-ultralightx/4.html', n: 'Research Q1 (FILLS, INT-b01_compromise): the medium size; Finalmouse\'s later ULX Competition has "solid sides" (b05Peri).' },
  b01RtUlx: { t: 'RTINGS, Finalmouse ULX Pro Series against the UltralightX Competition: "noticeable flexibility, popping, and creaking in the body of the UltralightX Competition we tested" (the Pro Series: "a mushy button feel"); RTINGS weighed its UltralightX at 38.0 g; in its Sora V2 review the ULX "flexes and creaks with pressure" (research/validation-report-2026-11-03.md)', u: 'https://www.rtings.com/mouse/tools/compare/finalmouse-ulx-pro-series-finalmouse-ultralightx-competition/58188/78570', n: 'Which UltralightX variant and size RTINGS weighed is not stated on the pages read; Finalmouse\'s later ULX Competition is reported stiffer (b05Peri).' },
  b01SlxBatt: { t: 'Finalmouse Starlight X technical overview: a Jauch 250 mAh battery, nRF54LM20 in the mouse and the receiver, 38 g; no hour rating (research/validation-report-2026-11-03.md)', u: 'https://cdn.shopify.com/s/files/1/2377/4861/files/26.5.27_Starlight_X_Technical_Overview.pdf?v=1779939240' },
  b01MiniSe: { t: 'Razer Viper Mini Signature Edition: $279.99 at launch (KitGuru, 2023-02-02; TechSpot); 49 g; about 119 × 62 × 39 mm; a magnesium alloy chassis; "up to 60 hours" on HyperSpeed wireless (no polling rate given)', u: 'https://www.kitguru.net/blog/2023/02/02/the-razer-viper-mini-signature-edition-arrives-with-eye-watering-price-tag/', n: 'Razer\'s page now lists only "< 49 g" and 8000 Hz (research Q1, FILLS b01-1).' },
  b01M2k: { t: 'Zaunkoenig M2K: €299 (TechPowerUp, Club386, The FPS Review); Zaunkoenig claims 24 g, TechPowerUp\'s scale "around 23 g (+/- 1 g)"; wired', u: 'https://techpowerup.com/review/zaunkoenig-m2k/2.html', n: 'Plotted in dollars at the M3K\'s own rate (€340 ~ $396): about $348. Research Q1 (FILLS b01-7).' },
  b01M3k: { t: 'Zaunkoenig M3K: 24 g, "a wired 8,000 hertz connection", "The M3K costs €340 (~396 USD)"', u: 'https://www.zaunkoenig.co/m3k' },
  b01FmClick: { t: 'PC Gamer, Sept 2026, on Finalmouse\'s own click test: from the start of the press to the packet at the PC, mean of 50 presses: Starlight X 2.0 ms, Superstrike 3.0 ms, OP1 8K V2 5.7 ms, Viper V4 Pro 7.5 ms (a maker testing its own mouse and its rivals)', u: 'https://www.pcgamer.com/hardware/gaming-mice/finalmouse-claims-its-mouse-has-the-absolute-fastest-click-quicker-than-the-logitech-superstrike-and-razer-viper-v4-pro/' },
  b01OpenStax: { t: 'OpenStax, College Physics 2e, §4.3 Newton\'s second law, Fig. 4.6: "The same force exerted on systems of different masses produces different accelerations"; "acceleration is exactly inversely proportional to mass"', u: 'https://openstax.org/books/college-physics-2e/pages/4-3-newtons-second-law-of-motion-concept-of-a-system' },
  b01Optical: { t: 'Derived from Logitech\'s own figures, as TechPowerUp reports them: the G Pro X Superlight 2 lasts 96 h in optical switch mode and 104 h in hybrid mode at 1000 Hz on its 290 mAh battery, so running its two main switches\' optics full time costs 0.23 mA (0.116 mA a switch); on a Viper V4 Pro\'s 306 mAh over 180 h at 1 khz (1.70 mA) that is 13.6 %. Omron\'s D2FP test pulse (5 mA for 30 µs each 1 ms) would give 17.6 %: the film claims the lower', u: 'https://techpowerup.com/review/logitech-g-pro-x-superlight-2/7.html', n: 'Research Q1 (FILLS); integrator decision BROADCAST-0945 #1.' },
  b01Wolf: { t: 'Wolf, Bergmann Tiest & Drewing 2018, "A mass-density model can account for the size-weight illusion", PLOS ONE 13(2):e0190624: equal 200 g objects, 32 and 596 cm³; matched in a precision grip the big one felt like 161 g, the small 211 g (in the whole hand 134 and 202 g); perceived heaviness mixes a mass and a density estimate', u: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0190624', n: 'Research Q2 (FILLS b01-9); the mice figure is derived from its model.' },
  b01FingerMass: { t: 'Mirakhorlo et al. 2016, "Anatomical parameters for musculoskeletal modeling of the hand and wrist", International Biomechanics 3(1), Table 1 (one specimen, segment masses estimated): index middle phalanx 6.74 g; middle finger middle 6.41, distal 5.84 g; ring middle 5.77, distal 4.83 g; thumb distal 10.08 g. Derived: the tips of the four fingers that hold a mouse, about 45 g, an upper estimate (fingers rotate as well as move)', u: 'https://research.tudelft.nl/files/4755868/Anatomical_parameters_for_musculoskeletal_modeling_of_the_hand_and_wrist.pdf', n: 'Research Q2 (FILLS, INT-0855 + b01-8).' },
  b01HandMass: { t: 'Body segment parameters (Dempster via Winter 2009; de Leva 1996): the hand is about 0.6 % of body mass, about 420 g at 70 kg (research/data/weight-science.json)', u: 'https://nbviewer.jupyter.org/github/demotu/BMC/blob/master/notebooks/BodySegmentParameters.ipynb' }
});

/* ================================ the mice this file adds ================================
   Each: { id, name (full), short, brand, conn ('wireless' | 'wired'), g (grams), gBy (who weighed or listed it), gEv
   ('measured' | 'claim' | 'reported'), L, W, H (mm), h1k (hours at 1 khz as listed), mAh, V (battery volts, when known),
   price (US $), shell (a few words), src (SRC keys) }. G-Wolves weights are the black (lightest) colour's, as listed. */
const B01_MICE = [
  { id: 'logitech-x3', name: 'Logitech Pro X3 Superstrike', short: 'Pro X3 Superstrike', brand: 'Logitech', conn: 'wireless', g: 59.0, gBy: 'Logitech', gEv: 'claim', L: 125.0, W: 63.5, H: 40.0, h1k: 135, price: 199.99, shell: 'Solid', src: ['b01X3', 'b01X3Pcg', 'b01X3Psn'] },
  { id: 'gw-hts-ultra', name: 'G-Wolves HTS Ultra 8K', short: 'HTS Ultra 8K', brand: 'G-Wolves', conn: 'wireless', g: 31.0, gBy: 'TechPowerUp', gEv: 'measured', L: 113, W: 61, H: 40, h1k: 80, price: 149, shell: 'Honeycomb', src: ['b01TpuHtsU', 'b01GwHtsU'] },
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
  { id: 'zaunkoenig-m3k', name: 'Zaunkoenig M3K', short: 'M3K', brand: 'Zaunkoenig', conn: 'wired', g: 24.0, gBy: 'Zaunkoenig', gEv: 'claim', price: 396, priceNote: '€340', src: ['b01M3k'] },
  { id: 'zaunkoenig-m2k', name: 'Zaunkoenig M2K', short: 'M2K', brand: 'Zaunkoenig', conn: 'wired', g: 23.0, gBy: 'TechPowerUp', gEv: 'measured', price: Math.round(299 * 396 / 340), priceNote: '€299', src: ['b01M2k'] }
];
/* facts this file adds to mice already in mice.json (their batteries, where a review measured one) */
const B01_MORE = {
  'finalmouse-ulx': { mAh: 250, V: 3.87, src: ['b01TpuUlx'] },
  'finalmouse-slx': { mAh: 250, src: ['b01SlxBatt'] },
  'pulsar-x2f-crazylight': { g: 29.0, gBy: 'Pulsar', gEv: 'claim', mAh: 210, src: ['b01X2f', 'b01X2fWt'] }
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
/* ---- rivals are drawn with the kit's neutral rival mouse (mouseRival, FILM F9; K 09:58): only Theseus is mouseSimple ---- */
/** a mouse's box [L, W, H] mm for mouseRival: its sourced dims (EloShapes' makers' figures in mice.json, or B01_MICE), else
   the kit's typical mouse */
const b01_dims = id => { const m = b01_get(id); return m && m.L && m.W && m.H ? [m.L, m.W, m.H] : RV_DIMS; };
/** between two mice's dims at k (0..1), quantised to 0.25 mm so a morph reuses the kit's cached outlines (rvView caches by dims) */
const b01_dimsLerp = (a, b, k) => a.map((v, i) => Math.round(lerp(v, b[i], clamp(k)) * 4) / 4);
/** a rival's battery from above (mm, mouseRival's top frame): the kit's typical place, rvBox's focus box less its 6 mm margin */
function b01_rvBatt(dims) { const b = rvBox('top', 'battery', { dims }); return [b[0] + 6, b[1] + 6, b[2] - 12, b[3] - 12]; }
/** the rival grey (the kit's rvCols: the outline and the body), for a rival drawn from its own traced outline (the X2F) */
const b01_rvCol = () => typeof rvCols === 'function' ? rvCols('grey') : { out: mix(C.comp, C.mute, 0.4), body: mix(C.bg, C.comp2, 0.5) };
/** a rival's main switch body from above, mm [across, along] (the kit's Omron-size switch, RV_AT.swS) */
const b01_rvSw = () => (typeof RV_AT !== 'undefined' && RV_AT.swS) || [5.8, 12.8];
/** the top stretch of a rival's side outline ('right': nose right, the pad at y = 0, y negative up): points higher than
   frac of its height, between x0 and x1, sorted by x */
function b01_rvTop(pts, H, x0, x1, frac = 0.55) { return pts.filter(p => p[1] < -frac * H && p[0] > x0 && p[0] < x1).sort((p, q) => p[0] - q[0]); }
/** the height of that top line at x (mm, negative up), interpolated */
function b01_rvTopAt(top, x) { for (let i = 1; i < top.length; i++) if (top[i][0] >= x) { const [x0, y0] = top[i - 1], [x1, y1] = top[i]; return y0 + (y1 - y0) * (x - x0) / Math.max(1e-9, x1 - x0); } return top.length ? top[top.length - 1][1] : 0; }
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
/** the hours a battery would give at the V4 Pro's draw: an estimate, not a bound (each mouse's draw is its own; V nominal 3.7
   unless known). Used for Theseus's own hours; rivals' are not plotted (models checked #9) */
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
   1 ms, 0.15 mA a switch) over the mouse's 306 mAh in Razer's 180 h at 1 khz (1.70 mA) gave 17.6 %; the film now claims Logitech's own figure, 13.6 % (BROADCAST-0945). The clicks chapter (b03) works it
   the same way. Shown to 0.1 %: rounding a rival's fault up would be rounding a claim in our favour */
/** Theseus's two mechanical switches' share of the same draw (b03's B03.mechShare: a strobed pull-up, about 3 µA a switch),
   printed as b03_switch prints it: to 0.1 %, rounded up (never in Theseus's favour) */
function b01_mechPct() { const sh = (typeof B03 !== 'undefined' && B03.mechShare) || 2 * 3 / 1000 / (306 / 180); return (Math.ceil(sh * 1000 - 1e-9) / 10).toFixed(1) + ' %'; }
const B01_OPT = (() => { const gpx = { mAh: 290, hOpt: 96, hHyb: 104 }, sw = (gpx.mAh / gpx.hOpt - gpx.mAh / gpx.hHyb) / 2, mA = 306 / 180; return { sw, mA, share: 2 * sw / mA }; })();
/** the share as printed: to 0.1 %, rounded down (a rival's fault is never rounded up in our favour) */
const b01_optPct = () => (Math.floor(B01_OPT.share * 1000 + 1e-9) / 10).toFixed(1) + ' %';
/* ================================ the trades: what each flagship gives up ================================
   The film's spine (F33.7): every flagship gives one thing up; Theseus gives up nothing. Each: the mouse, what it gives up
   (red), the figure, what it bought with it, the evidence, and Theseus's answer (the close reads `ans`). The icon names the
   small demonstration drawn beside the row (b01_tradeIcon). */
const B01_TRADES = [
  { id: 'logitech-x3', brand: 'Logitech', name: 'Pro X3 Superstrike', price: '$199.99', small: 'Logitech, $199.99, haptic triggers', what: 'Weight', fig: '59.0 g', why: 'Haptic, inductive triggers', ev: 'claim', tag: 'Logitech 2026', src: ['b01X3', 'b01X3Psn'], icon: 'weight', ans: THS.massG },
  { id: 'gw-hts-ultra', brand: 'G-Wolves', name: 'HTS Ultra 8K', price: '$149', small: 'G-Wolves, $149, 31.0 g', what: 'Battery life at 1 khz', fig: '80 h', why: '31.0 g', ev: 'claim', tag: 'G-Wolves claim', src: ['b01TpuHtsU'], icon: 'battery', ans: THESEUS.hours + ' h' },
  { id: 'razer-viper-v4-pro', brand: 'Razer', name: 'Viper V4 Pro', price: '$159.99', small: 'Razer, $159.99, optical switches', what: 'Battery spent on clicks', fig: b01_optPct(), why: 'Optical switches', ev: 'derived', tag: 'Derived', src: ['b01Optical'], icon: 'optical', get ans() { return b01_mechPct(); } },
  { id: 'finalmouse-ulx', brand: 'Finalmouse', name: 'UltralightX', price: '$189', small: 'Finalmouse 2023, $189, 38.0 g', what: 'Strength', fig: 'Flexes, creaks', why: '38.0 g', ev: 'measured', tag: 'TechPowerUp', src: ['b01TpuUlx'], icon: 'flex', ans: 'Solid, arched' },
  { id: 'pulsar-x2f-crazylight', brand: 'Pulsar', name: 'X2F CrazyLight', price: '$149.95', small: 'Pulsar, $149.95, 29.0 g', what: 'The shape', fig: 'Cut to 87.5 mm', why: '29.0 g', ev: 'claim', tag: 'Pulsar 2026', src: ['b01X2f', 'x2fCrazy'], icon: 'half', ans: 'A full 119.3 mm' },
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

/* ================================ 1. The cover (replaces cover; the form kept, F9.11) ================================
   His notes: "PIAKNOW'S should be all capital"; "instead of 8kh it should say something about there being zero
   compromises"; "8khz is pretty much standard now"; and on ntr_stats, density "could be on the cover instead of the 100+
   ideas". So the four figures are Weight 29.31 g, Motion latency 0.14 ms, Compromises 0 (counting down from the six the
   next slide shows) and Density 0.099 g/cm³. No mouse drawing and no shell (F12.2). Theseus's own figures keep their
   own precision here (29.31 g); comparisons elsewhere use 29.3 g. */
const B01_COV = { size: 280, x0: 64, yb: 462 };
S({
  id: 'b01_cover', first: true, ch: 'intro', theme: 'night', chrome: false, title: 'Theseus: in pursuit of an objectively better mouse', settle: 7.5,
  replaces: ['cover'],
  sfx: [[2.15, 'tick'], [2.35, 'tick'], [2.55, 'tick'], [2.75, 'tick']],
  src: ['kunai', 'piaknow', 'ntrScan'],
  answers: [
    ['cover: "PIAKNOW\'S should be all capital"', 'Set as PIAKNOW\'S, every letter a capital ("Target, by PIAKNOW\'S measure" under the motion latency)'],
    ['Integrator (10:2x): no figure may read as a measurement it isn\'t', 'No Theseus has been weighed or timed yet, so the weight (29.31 g, the budget\'s target), the motion latency (0.14 ms, the timing model\'s target, as on Targets) and the density (the target weight over its box) each read "Target" first; the weight\'s line keeps the promise in Listed against weighed\'s words, every unit weighed. "0 compromises" is the design\'s claim and the next slide shows the six it answers'],
    ['cover: "instead of 8kh it should say something about there being zero compromises"', 'The third figure is now Compromises: it counts down to 0 from the eight in the film\'s ledger (the next slide\'s six flagships fold into them), and the close counts the same eight down to 0 before THESEUS'],
    ['cover: "8khz is pretty much standard now"', '8 khz is off the cover; dual 8 khz, wired and wireless, is on the targets slide'],
    ['ntr_stats: density "could be on the cover instead of the 100+ ideas"', 'The fourth figure is density, 0.099 g/cm³ (weight per cm³ of the box it fills, rounded up, against Theseus)'],
    ['F9.11 (keep the cover\'s form, no 2D mouse) and F12.2 (no shell on the cover)', 'Kept: the studio row, THESEUS rising letter by letter, the gram scale with 29.31 g in blue, the subtitle in three voices, four figures and the byline; no mouse and no shell']
  ],
  draw: t => {
    const C0 = B01_COV;
    /* top row: the studio, and the rule the whole deck follows */
    chapterIcon('intro', LM, LAY.labelY - 19, 22, C.hero, ep(t, 0.1, 0.4));
    text('Nitrite Labs', LM + 36, LAY.labelY, { role: 'label', color: C.ink2, t, t0: 0.15, cps: 40 });
    rich([{ s: 'Optimization', role: 'label', color: C.faint }, { s: 'over', role: 'label', color: C.faint, gap: 12 }, { s: 'opinion', role: 'label', color: C.heroText, grad: C.heroGrad, gap: 12 }], RM, LAY.labelY, { align: 'right', alpha: ep(t, 0.4, 0.8) });
    text('A Nitrite Labs mouse, in development for years', LM, 196, { role: 'label', size: 22, color: C.mute, t, t0: 0.5, cps: 60 });
    /* THESEUS: each letter rises out of its own mask; the first is already rising on frame one */
    const st = { role: 'hero', size: C0.size, track: -0.028 }, word = 'THESEUS', x0 = C0.x0, yb = C0.yb;
    setFont(sty(st)); const ls = lsPx(sty(st));
    const advs = [...word].map((ch, i) => G.measureText(word.slice(0, i + 1)).width - G.measureText(word.slice(0, i)).width);
    const wordW = advs.reduce((a, b) => a + b, 0) + ls * (word.length - 1);
    let xx = x0;
    [...word].forEach((ch, i) => {
      const k = E.rise(prog(t, -0.3 + i * 0.07, 0.6 + i * 0.07));
      if (k > 0) { G.save(); G.beginPath(); G.rect(xx - 10, yb - C0.size * 0.8, advs[i] + 20, C0.size * 0.86); G.clip(); text(ch, xx, yb + (1 - k) * C0.size * 0.82, Object.assign({}, st, { caps: false, color: C.ink })); G.restore(); }
      xx += advs[i] + ls;
    });
    /* the gram scale under the word, one tick a gram, with Theseus's 29.31 g in its colour */
    const ry = yb + 44, kr = ep(t, 0.8, 1.7, E.cam), rx1 = x0 + 14 + (wordW - 14) * kr, gpx = 12, mx = x0 + 14 + THESEUS.mass * gpx;
    line(x0 + 14, ry, rx1, ry, { color: inkA(0.35), w: 1.5 });
    for (let i = 0; x0 + 14 + i * gpx <= rx1; i++) { const X = x0 + 14 + i * gpx, L = i % 10 === 0 ? 16 : i % 5 === 0 ? 10 : 6; line(X, ry, X, ry + L, { color: inkA(i % 10 === 0 ? 0.5 : 0.25), w: 1.2 }); }
    rect(x0 + 14, ry - 3, THESEUS.mass * gpx * ep(t, 1.4, 1.9, E.out3), 6, { fill: C.hero });
    text('0', x0 + 14, ry + 40, { role: 'tick', size: 19, color: C.faint, alpha: ep(t, 1.2, 1.6) });
    text(THS.mass, mx, ry + 40, { role: 'tick', size: 19, weight: 700, color: C.heroText, align: 'center', alpha: ep(t, 1.7, 2.0) });
    /* the subtitle in three voices: a quiet run-in, the display claim, and the one word in Theseus's colour */
    rich([
      { s: 'In pursuit of an', role: 'labelL', size: 28, color: C.mute, t0: 1.1, cps: 40 },
      { s: 'objectively better', role: 'h2', size: 60, color: C.ink, gap: 22, rise: [1.4, 0.8] },
      { s: 'mouse', role: 'h2', size: 60, color: C.heroText, grad: C.heroGrad, gap: 18, rise: [1.55, 0.8] }
    ], LM, 640, { t });
    /* four figures, display numbers next to their units */
    const rho = b01_rhoTxt(THESEUS.mass / (THESEUS.dims[0] * THESEUS.dims[1] * THESEUS.dims[2] / 1000), true);
    /* no figure may read as a measurement it isn't (integrator, 10:2x): no Theseus exists to weigh or time yet, so the
       weight (the budget's target, F21.1), the motion latency (Kunai's timing model's target, as b01_targets and b09_latency
       say) and the density (the target weight over its box) each say "Target" first, in a brighter voice than the rest of
       the line; the weight keeps b01_listed's promise in its words (every unit weighed) */
    const cols = [
      { lab: 'Weight', n: THS.mass, u: 'g', tgt: true, sub: 'every unit weighed' },
      { lab: 'Motion latency, wireless', n: '0.14', u: 'ms', tgt: true, sub: 'by PIAKNOW\'S measure' },
      { lab: 'Compromises', n: '0', u: '', sub: 'Eight that most mice make', down: 8 },
      { lab: 'Density', n: rho, u: 'g/cm³', tgt: true, sub: 'weight per cm³ of its box' }
    ];
    const cw = (RM - LM) / 4;
    const nw = c => tw(c.n, { role: 'd1', size: 100, tnum: true }) / 100 + (c.u ? tw(c.u, { font: 'mono', size: 38, weight: 600 }) / 100 + 0.1 : 0);
    const nS = Math.min(132, Math.floor((cw - 44) / Math.max(...cols.map(nw))));
    cols.forEach((c, i) => {
      const x = LM + i * cw, t0 = 2.0 + i * 0.2, a = ep(t, t0, t0 + 0.4);
      if (i) line(x - 24, 770, x - 24, 770 + 190 * ep(t, t0 - 0.1, t0 + 0.5, E.cam), { color: inkA(0.14), w: 1.5 });
      text(c.lab, x, 786, { role: 'label', size: 21, color: C.mute, alpha: a, t, t0, cps: 60 });
      if (c.down) {
        /* the film's eight compromises (its ledger: the next slide's six flagships fold into them), each mark struck in turn and
           the count stepping down with each strike, to none; the close counts the same eight down again (R2-b01-3) */
        const kjs = Array.from({ length: c.down }, (_, j) => ep(t, t0 + 0.1 + j * 0.15, t0 + 0.3 + j * 0.15)), v = c.down - kjs.filter(k => k >= 0.5).length, done = v === 0;
        text(String(v), x - 6, 916, { role: 'd1', size: nS, color: done ? C.heroText : C.ink, grad: done ? C.heroGrad : null, tnum: true, alpha: a });
        const xs = x + tw('0', { role: 'd1', size: nS, tnum: true }) + 26;
        kjs.forEach((kj, j) => { const sx = xs + j * 26; line(sx, 860, sx, 900, { color: C.mute, w: 3, alpha: a * 0.8 }); if (kj > 0) line(sx - 8, 896, sx - 8 + 16 * kj, 864, { color: C.red, w: 3, alpha: a }); });
      } else rich([{ s: c.n, role: 'd1', size: nS, color: C.ink, tnum: true, count: [t0, 1.0] }, c.u ? { s: c.u, font: 'mono', size: 38, weight: 600, color: C.mute, gap: 10, caps: false } : null], x - 6, 916, { t, alpha: a });
      const ks = ep(t, t0 + 0.4, t0 + 0.8);
      /* knock: the stage grid's + row at y 960 is knocked out from under the words (FILM F10) */
      if (c.tgt) rich([{ s: 'Target', role: 'label', size: 19, color: C.ink2, knock: true }, { s: c.sub, role: 'label', size: 19, color: C.faint, gap: 12, knock: true }], x, 962, { alpha: ks });
      else text(c.sub, x, 962, { role: 'label', size: 19, color: C.faint, alpha: ks, knock: true });
    });
    /* the byline, on the chrome's rule */
    line(LM, LAY.ruleY, LM + (RM - LM) * ep(t, 0.3, 1.4, E.cam), LAY.ruleY, { color: C.hair, w: 1.5 });
    rich([{ s: 'Brock Liddicoat', role: 'foot', weight: 700, caps: true, track: 0.16, color: C.ink2 }, { s: '/', role: 'foot', color: C.faint, gap: 14 }, { s: 'Nitrite Labs', role: 'foot', caps: true, track: 0.12, color: C.mute, gap: 14 }, { s: '/', role: 'foot', color: C.faint, gap: 14 }, { s: 'Shape designer of the Finalmouse Starlight X', role: 'foot', caps: true, track: 0.12, color: C.faint, gap: 14 }], LM, LAY.footY, { alpha: ep(t, 2.6, 3.2) });
    text(`01 / ${pad2(DECK.slides.length)}`, RM, LAY.footY, { role: 'foot', weight: 600, color: C.mute, align: 'right', alpha: ep(t, 2.6, 3.2) });
    for (const [mx2, my] of [[40, 160], [40, 600]]) regMark(mx2, my, ep(t, 0.8, 1.3) * 0.4, 8, C.ink);
  }
});

/* ================================ the weight budget, computed ================================
   Brock on `budget`: "it's a lot of work to keep updating this one". So nothing here is typed as a total: every part's
   weight comes from where the deck keeps it (THESEUS for the whole and the board; the Jauch family in RDATA for the
   battery; XBAB's breakdown in RDATA for the buttons; NTR_BUD, the 3D model's volumes and densities, for the wheel, axle,
   screws, inserts and lead), and the shell and skates get what is left (F21.1: "Budget is the target"). */
/* the board's path to its 5.6 g target (F47.4, Brock: "0.6 mm, 5.63 g"): a 0.6 mm (BOARD_T) two-layer board with
   half-ounce outer copper, a lighter encoder (its nickel-silver frame dropped) and a cored support: 5.63 g in the hardware
   model (mass.py; derived). The budget keeps 5.6 g, the target (F42.2, THESEUS.pcb); the path is said beside it (H3 11:05).
   H3's rebuild reports the final figure: if it moves off 5.63, or a shared field comes to carry it, change it here only */
const B01_PCB_PATH = { g: 5.63 };
function b01_budget() {
  const B = (typeof ntr_budget === 'function') ? ntr_budget() : null, batt = b01_thsBatt();
  if (!B) return null;
  const parts = [
    { key: 'battery', name: 'Battery, ' + batt.mAh + ' mAh', g: B.cell.g, note: 'Example part, ' + batt.part, ev: 'datasheet', by: 'Jauch' },
    { key: 'board', name: 'One board, a target', g: THESEUS.pcb, note: 'Radio, antenna and USB-C on it; a ' + fmtN(BOARD_T, 1) + ' mm two-layer board builds to ' + fmtN(B01_PCB_PATH.g, 2) + ' g, derived (F47.4)' },
    { key: 'buttons', name: 'Buttons', g: B.xa.btn, note: 'As XBAB weighed the XA25\'s', ev: 'claim', by: 'XBAB' },
    /* Brock, F44.2: the two side switches, full-size SPDT, about 0.5 g each (H1's typical figure), "from the shell" */
    { key: 'sideSw', name: 'Side switches', count: 2, g: 2 * 0.5, note: 'Two full-size SPDT, about 0.5 g each, typical', ev: 'estimate' },
    { key: 'wheel', name: 'Wheel and axle', g: B.wheel, note: 'Magnesium, 0.9 g, on a POM axle', ev: 'derived' },
    { key: 'inserts', name: 'Brass inserts', count: NTR_BUD.inserts, g: B.ins, note: fmtN(B.ins1, 2) + ' g each', ev: 'derived' },
    { key: 'screws', name: 'Titanium screws', count: NTR_BUD.screws, g: B.screws, note: 'M2 × 4, ' + fmtN(B.screw1, 2) + ' g each', ev: 'derived' },
    { key: 'wires', name: 'Side-button lead', g: B.wires, note: '32 AWG, braided', ev: 'derived' }
  ];
  const used = parts.reduce((s, p) => s + p.g, 0);
  return { parts, used, shell: THESEUS.mass - used, xaShell: B.xa.shell, cut: B.xa.shell - (THESEUS.mass - used), hours: batt.h, batt, B };
}

/* ================================ small demonstrations of each trade ================================
   One per row of the ledger (b01_compromise): the flagship drawn as the kit's neutral rival mouse (mouseRival, grey, sized
   from its sourced dims: only Theseus is the simplified mouse, FILM F9), its fault drawn on it in red, and the cause acting on
   it once (M2): its weight sags a scale, its battery runs down, its switches draw current, a finger bows its shell, its back
   half comes away (the X2F's own traced outline), a cable runs out of its nose. box = [x, y, w, h] px; the mouse sits nose
   right. o = { a (alpha), dims ([L, W, H] mm, the rival's), g (the weight's grams), hero (draw Theseus's answer instead) } */
function b01_tradeIcon(t, t0, kind, box, o = {}) {
  const [x, y, w, h] = box, a = o.a == null ? 1 : o.a; if (a <= 0.003) return;
  const lit = ep(t, t0, t0 + 0.35), k = ep(t, t0 + 0.1, t0 + 0.9, E.snap), hero = !!o.hero, cc = hero ? C.hero : C.red, dims = o.dims || RV_DIMS;
  const base = { lw: 1.6, dim: 0.55 }, rb = { dims, lw: 1.6 };
  /* the top view, nose right: the frame turned a quarter (the nose is at -y). Theseus: mouseSimple; a rival: mouseRival */
  const top = (o2, draw, dx = 0) => { const V = msView('top'), s = Math.min((w - 8) / V.box[3], (h - 8) / V.box[2]); return part(x + w / 2 + dx, y + h / 2, s, () => { mouseSimple('top', Object.assign({}, base, o2)); if (draw) draw(s); }, { alpha: a, rot: Math.PI / 2 }); };
  const rtop = (o2, draw) => { const B = rvBox('top', null, { dims }), s = Math.min((w - 8) / B[3], (h - 8) / B[2]); return part(x + w / 2, y + h / 2, s, () => { const m = mouseRival('top', Object.assign({}, rb, o2)); if (draw) draw(m, s); }, { alpha: a, rot: Math.PI / 2 }); };
  /* the rival's side view, nose right, standing on its pad line at yb (its frame's x = 0 is the length's middle) */
  const rsideS = (pad = 8) => { const B = rvBox('right', null, { dims }); return Math.min((w - pad) / B[2], (h - 14) / B[3]); };
  if (kind === 'weight') {
    /* set down on a scale: its weight presses down (the arrow grows to it), the pan sags under it and a spring settles it.
       59.0 g sags the pan twice as far as Theseus's 29.3 g would */
    const g = o.g || 59, s = rsideS(30), sp = spring(t, t0 + 0.12, { f: 2.6, z: 0.45 }), sag = 0.11 * g * sp, drop = (1 - E.out3(clamp((t - t0) / 0.22))) * -8;
    const yb = y + h - 10 + sag + drop, px0 = x + 10, px1 = x + w - 10;
    /* the scale: its foot, and the pan the mouse stands on */
    rect(x + w / 2 - 22, y + h - 4, 44, 4, { fill: inkA(0.3), alpha: a * lit });
    line(x + w / 2, y + h - 4, x + w / 2, yb + 3, { color: inkA(0.3), w: 3, alpha: a * lit });
    rr(px0, yb, px1 - px0, 3.5, 1.5, cc, null, 0, a * lit);
    part(x + w / 2, yb, s, () => mouseRival('right', rb), { alpha: a });
    /* the weight, an arrow through the mouse onto the pan, growing with the load (M2) */
    const ax = x + w / 2 - 6, len = 0.62 * g * sp;
    if (len > 3) arrow(ax, yb - len - 4, ax, yb - 3, { color: cc, w: 3, hs: 9, alpha: a * lit });
  } else if (kind === 'battery') {
    /* its battery runs down, red: the charge falls to 80 of the 200 h a Theseus battery holds */
    rtop({ show: ['battery'] }, () => {
      const [bx, by, bw, bh] = b01_rvBatt(dims), frac = lerp(1, 80 / THESEUS.hours, k);
      G.save(); G.globalAlpha = PA * lit * 0.55; G.fillStyle = cc; rrPath(bx + 1.2, by + 1.2 + (bh - 2.4) * (1 - frac), bw - 2.4, (bh - 2.4) * frac, 1.2); G.fill();
      G.globalAlpha = PA * lit; G.strokeStyle = cc; G.lineWidth = lw(1.6); rrPath(bx, by, bw, bh, 2); G.stroke(); G.restore();
    });
  } else if (kind === 'optical') {
    /* its two optical main switches draw current from the battery: red bodies, a dashed path running from the battery to each */
    rtop({ show: ['battery'] }, () => {
      const [sa, sl] = b01_rvSw(), [bx, by, bw] = b01_rvBatt(dims), src = [bx + bw / 2, by];
      for (const p of ['switchL', 'switchR'].map(n => rvAt('top', n, { dims }))) {
        G.save(); G.globalAlpha = PA * lit; G.fillStyle = cc; rrPath(p[0] - sa / 2, p[1] - sl / 2, sa, sl, 0.8); G.fill(); G.restore();
        const kk = clamp((t - t0 - 0.2) / 0.8); G.save(); G.globalAlpha = PA * Math.min(1, kk * 3) * (1 - 0.6 * ep(t, t0 + 1.2, t0 + 1.6)); G.strokeStyle = cc; G.lineWidth = lw(2); G.setLineDash([lw(5), lw(5)]); G.lineDashOffset = -(t - t0) * lw(40); G.beginPath(); G.moveTo(src[0] + p[0] * 0.3, src[1]); G.lineTo(src[0] + p[0] * 0.3, p[1] + sl / 2 + 4); G.lineTo(p[0], p[1] + sl / 2 + 4); G.lineTo(p[0], p[1] + sl / 2); G.stroke(); G.restore();
      }
    });
  } else if (kind === 'flex') {
    /* a fingertip presses the top near the hump, and the shell bows under it (a spring settles the bow), red where it bends */
    const s = rsideS(10), ox = x + w / 2, oy = y + h - 6, d = 3.4 * spring(t, t0 + 0.2, { f: 2.2, z: 0.5 });
    const top = b01_rvTop(mouseRival('right', { dims, alpha: 0 }).pts, dims[2], -42, 42, 0.58), zc = rvAt('right', 'hump', { dims })[0] - 4, sig = 16;
    part(ox, oy, s, () => {
      mouseRival('right', rb);
      const pts = top.map(p => [p[0], p[1] + d * Math.exp(-Math.pow((p[0] - zc) / sig, 2))]);
      G.save(); G.globalAlpha = PA * lit; G.strokeStyle = C.red; G.lineWidth = lw(2.8); G.beginPath(); pts.forEach((p, i) => i ? G.lineTo(p[0], p[1]) : G.moveTo(p[0], p[1])); G.stroke(); G.restore();
    }, { alpha: a });
    const pz = [ox + zc * s, oy + (b01_rvTopAt(top, zc) + d) * s]; finger(pz[0], pz[1], 2.55, { s: s * 0.62, press: clamp(d / 3.4), alpha: a * ep(t, t0, t0 + 0.25), len: 26 });
  } else if (kind === 'half') {
    /* the X2 from above, nose right: a cut runs across it and its back half comes away; the X2F is what's left (87.5 of 120 mm).
       Its own traced outline (a real shape is the point), in the rival's grey like every other flagship */
    const s = Math.min((w - 20) / 120, (h - 8) / B01_X2F.W), full = b01_outline(B01_X2_HALF), cut = b01_outline(B01_X2_HALF, B01_X2F.cut, B01_X2F.r), rc = b01_rvCol();
    const kc = hero ? 0 : ep(t, t0 + 0.05, t0 + 0.4, E.cam), kk = hero ? 0 : ep(t, t0 + 0.4, t0 + 1.0, E.snap), ox = x + w / 2 + 60 * s + 4, oy = y + h / 2;
    part(ox, oy, s, () => {
      if (!hero) {
        /* the rear piece, beyond the cut: sliding back and settling as a dashed red ghost of what was given up */
        G.save(); G.translate(0, kk * 9); G.globalAlpha = PA * lerp(1, 0.55, kk); G.beginPath(); G.rect(-40, B01_X2F.cut, 80, 40); G.clip();
        if (kk < 0.02) { G.fillStyle = rc.body; G.fill(full.path); G.strokeStyle = rc.out; G.lineWidth = lw(1.6); G.stroke(full.path); }
        else { G.setLineDash([lw(4), lw(3.5)]); G.strokeStyle = C.red; G.lineWidth = lw(1.8); G.stroke(full.path); }
        G.restore();
      }
      G.save(); G.globalAlpha = PA; G.fillStyle = hero ? C.panel : rc.body; G.fill((hero ? full : cut).path); G.strokeStyle = hero ? C.hero : rc.out; G.lineWidth = lw(hero ? 2.2 : 1.6); G.stroke((hero ? full : cut).path); G.restore();
      if (!hero && kc > 0) { G.save(); G.globalAlpha = PA * lit; G.strokeStyle = C.red; G.lineWidth = lw(3); G.beginPath(); G.moveTo(-B01_X2F.W / 2 - 3, B01_X2F.cut); G.lineTo(-B01_X2F.W / 2 - 3 + (B01_X2F.W + 6) * kc, B01_X2F.cut); G.stroke(); G.restore(); }
    }, { alpha: a, rot: Math.PI / 2 });
  } else if (kind === 'wire') {
    /* a cable runs out of its nose: the mouse is tied to the PC */
    const B = rvBox('top', null, { dims }), s = Math.min((w - 34) / B[3], (h - 8) / B[2]), mx = x + w / 2 - 14, ca = rvAt('top', 'cable', { dims });
    part(mx, y + h / 2, s, () => mouseRival('top', rb), { alpha: a, rot: Math.PI / 2 });
    /* the rotated frame: (px, py) mm lands at (mx - py s, my + px s) */
    const nx = mx - ca[1] * s, ny = y + h / 2 + ca[0] * s; poly([[nx - 1, ny], [nx + 8, ny], [nx + 18, ny + 5], [x + w + 4, ny + 8]], { color: C.red, w: 3, p: k, alpha: a * lit });
  } else if (kind === 'theseus') {
    top({ hi: ['shell'], col: 'hero', lit, show: ['battery'] });
  }
}

/* ================================ 2. Every flagship compromises (most important; the close answers it) ================================
   A stage, one flagship at a time (integrator, 08:35): each one drawn big while its compromise happens to it for about a
   second, caused by something you can see (M1, M2): the Pro X3 Superstrike's 59.0 g tips a balance against a 29.3 g mouse;
   the HTS Ultra 8K's battery runs dry at 80 h while the clock runs on to 200; the Viper V4 Pro's optical switches fire their
   beams and eat 13.6 % of its battery; a fingertip bows the ULX's shell, red where it bends; a cut takes the back half off the
   X2; a cable runs out of the XA25's nose. Each then shrinks into its row of the ledger on the right, keeping its red word
   and figure. Then Theseus lands, whole and blue, giving up nothing. Frame one is already mid-compromise (M6). */
const B01_STAGE = { box: [80, 384, 1010, 410], beat: 1.05, t0: -0.45, list: { x: 1180, y: 300, rh: 72, icon: [118, 60] }, fold: 7.4, strip: 852 };
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
  /* the mice on the pans, side view (nose right), 2 px per mm: Theseus the simplified mouse in blue, the X3 the kit's rival
     (grey, its own 125 × 63.5 × 40 mm; the fault, its weight, is the red pan it drops) */
  const V = msView('right'), s = 2.0, mcx = V.box[0] + V.box[2] / 2;
  part(RP[0] - mcx * s, RP[1] - 2, s, () => mouseSimple('right', { lw: 1.8, hi: ['shell'], col: 'hero', lit: 0.8 }));
  part(LP[0], LP[1] - 2 - fall * 230, s, () => mouseRival('right', { dims: o.dims || RV_DIMS, lw: 2 }));
  text('59.0 g', LP[0], LP[1] + 46, { role: 'num', size: 30, weight: 800, color: C.red, align: 'center', alpha: ta });
  text('29.3 g', RP[0], RP[1] + 46, { role: 'num', size: 30, weight: 800, color: C.heroText, align: 'center', alpha: ta });
  text('Theseus', RP[0], RP[1] + 76, { role: 'label', size: 20, color: C.heroText, align: 'center', alpha: ta });
}
function b01_bigBattery(t, s0, box, o = {}) {
  const [x, y, w, h] = box, ta = o.textA == null ? 1 : o.textA;
  /* the clock runs from 0 to 200 h; the battery holds 80 */
  const hrs = 200 * clamp((t - s0 - 0.04) / 0.7), frac = clamp(1 - hrs / 80), dead = hrs >= 80;
  /* left: the mouse (the kit's rival, its own 113 × 61 mm), nose right, its battery outlined red and emptying with the gauge */
  const dims = o.dims || RV_DIMS, sm = 2.55, mx = x + 150, my = y + h / 2, kl = ep(t, s0, s0 + 0.3);
  part(mx, my, sm, () => {
    mouseRival('top', { dims, lw: 2, show: ['battery'] });
    const [bx, by, bw, bh] = b01_rvBatt(dims);
    G.save(); G.globalAlpha = PA * 0.6; G.fillStyle = C.red; rrPath(bx + 1.2, by + 1.2 + (bh - 2.4) * (1 - frac), bw - 2.4, (bh - 2.4) * frac, 1.2); G.fill();
    G.globalAlpha = PA * kl; G.strokeStyle = C.red; G.lineWidth = lw(2); rrPath(bx, by, bw, bh, 2); G.stroke(); G.restore();
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
  /* left: the mouse from above (the kit's rival, its own 127.1 × 63.9 mm), nose right; its two optical switches, at the
     rival's switch places and size, fire their beams and draw current from its battery */
  const dims = o.dims || RV_DIMS, sm = 3.3, mx = x + 230, my = y + h / 2 - 6, on = ep(t, s0 + 0.03, s0 + 0.16), eat = ep(t, s0 + 0.1, s0 + 0.7, E.io3);
  const sw = ['switchL', 'switchR'].map(n => rvAt('top', n, { dims })), [sa, sl] = b01_rvSw();
  part(mx, my, sm, () => {
    mouseRival('top', { dims, lw: 2, show: ['battery'] });
    const [bx, by, bw] = b01_rvBatt(dims), src = [bx + bw / 2, by];
    for (const p of sw) {
      G.save(); G.globalAlpha = PA; G.fillStyle = C.panel; G.strokeStyle = C.red; G.lineWidth = lw(2.2); rrPath(p[0] - sa / 2, p[1] - sl / 2, sa, sl, 0.8); G.fill(); G.stroke();
      /* the beam across the switch: its LED firing (dashes running from emitter to receiver) */
      G.globalAlpha = PA * on; G.setLineDash([lw(5), lw(4)]); G.lineDashOffset = -(t - s0) * lw(60); G.lineWidth = lw(3); G.beginPath(); G.moveTo(p[0] - sa / 2 + 0.8, p[1]); G.lineTo(p[0] + sa / 2 - 0.8, p[1]); G.stroke();
      /* the current, from the battery to the switch */
      G.lineWidth = lw(2.2); G.setLineDash([lw(6), lw(6)]); G.lineDashOffset = -(t - s0) * lw(55); G.beginPath(); G.moveTo(src[0] + p[0] * 0.3, src[1]); G.lineTo(src[0] + p[0] * 0.3, p[1] + sl / 2 + 3); G.lineTo(p[0], p[1] + sl / 2 + 3); G.lineTo(p[0], p[1] + sl / 2); G.stroke(); G.restore();
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
  text(b01_optPct(), gx + gw - 10 - eatW / 2, gy + gh + 46, { role: 'num', size: 30, weight: 800, color: C.red, align: 'center', alpha: ta * eat });
  text('to the switches', gx + gw - 10 - eatW / 2, gy + gh + 78, { role: 'label', size: 19, color: C.red, align: 'center', alpha: ta * eat });
}
function b01_bigFlex(t, s0, box, o = {}) {
  const [x, y, w, h] = box, ta = o.textA == null ? 1 : o.textA, dims = o.dims || RV_DIMS;
  /* the side view (the kit's rival, its own 121.3 × 62 × 37 mm), nose right, big; a fingertip presses the top and the shell
     bows under it, a spring settling the bow. TechPowerUp: "when applying pressure exactly at the top, the entire top contracts" */
  const B = rvBox('right', null, { dims }), s = Math.min((w - 120) / B[2], (h - 70) / B[3]), ox = x + w / 2, oy = y + h - 20;
  const top = b01_rvTop(mouseRival('right', { dims, alpha: 0 }).pts, dims[2], -48, 44, 0.53);
  const d = 3.0 * spring(t, s0 + 0.06, { f: 2.4, z: 0.42 }), zc = rvAt('right', 'hump', { dims })[0] - 4, sig = 17;
  const bow = p => d * Math.exp(-Math.pow((p[0] - zc) / sig, 2));
  part(ox, oy, s, () => {
    mouseRival('right', { dims, lw: 2 });
    /* the bowed stretch of the top, coloured by how hard it bends (red at the peak) */
    for (let i = 1; i < top.length; i++) {
      const a0 = top[i - 1], a1 = top[i], k = (bow(a0) + bow(a1)) / 2 / 3.0;
      G.save(); G.globalAlpha = PA; G.strokeStyle = heatCol(k); G.lineWidth = lw(4); G.lineCap = 'round'; G.beginPath(); G.moveTo(a0[0], a0[1] + bow(a0)); G.lineTo(a1[0], a1[1] + bow(a1)); G.stroke(); G.restore();
    }
    /* creaks: two short ticks where the bow ends meet the stiff wall, at the peak of the press */
    const ck = clamp(d / 3.0) * ep(t, s0 + 0.22, s0 + 0.36) * (1 - ep(t, s0 + 0.62, s0 + 0.74));
    for (const zz of [zc - 30, zc + 30]) { const yz = b01_rvTopAt(top, zz); G.save(); G.globalAlpha = PA * ck; G.strokeStyle = C.red; G.lineWidth = lw(2.4); for (const r of [3, 5.5]) { G.beginPath(); G.arc(zz, yz, r, -Math.PI * 0.95, -Math.PI * 0.05); G.stroke(); } G.restore(); }
  });
  const pz = [ox + zc * s, oy + (b01_rvTopAt(top, zc) + d) * s];
  finger(pz[0], pz[1], 2.15, { s: s * 0.7, press: clamp(d / 3.0), len: 34 });
  text('Pressed at the top', pz[0] + 150, pz[1] - 120, { role: 'label', size: 21, color: C.ink2, alpha: ta * ep(t, s0 + 0.1, s0 + 0.3) });
  text('Bend drawn larger than life', x + w, y + h + 22, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: ta * 0.9 });
}
function b01_bigHalf(t, s0, box, o = {}) {
  const [x, y, w, h] = box, ta = o.textA == null ? 1 : o.textA;
  /* the X2 from above, nose right; a cut runs across it at 87.5 mm and its back half comes away and dissolves. Its own traced
     outline (the cut shape is the point), in the rival grey every other flagship wears (FILM F9) */
  const s = Math.min((w - 120) / 120, (h - 80) / B01_X2F.W), full = b01_outline(B01_X2_HALF), cut = b01_outline(B01_X2_HALF, B01_X2F.cut, B01_X2F.r), rc = b01_rvCol();
  const ox = x + w / 2 + 60 * s + 30, oy = y + h / 2 - 10, kc = ep(t, s0 + 0.02, s0 + 0.26, E.cam), kk = ep(t, s0 + 0.26, s0 + 0.72, E.snap);
  part(ox, oy, s, () => {
    /* the back half: solid until the cut has run, then sliding back, fading to a dashed red ghost */
    G.save(); G.translate(0, kk * 14); G.beginPath(); G.rect(-40, B01_X2F.cut, 80, 40); G.clip();
    if (kk < 0.03) { G.globalAlpha = PA; G.fillStyle = rc.body; G.fill(full.path); G.strokeStyle = rc.out; G.lineWidth = lw(2); G.stroke(full.path); }
    else { G.globalAlpha = PA * lerp(1, 0.6, kk); G.setLineDash([lw(6), lw(5)]); G.strokeStyle = C.red; G.lineWidth = lw(2.2); G.stroke(full.path); }
    G.restore();
    G.save(); G.globalAlpha = PA; G.fillStyle = rc.body; G.fill(cut.path); G.strokeStyle = rc.out; G.lineWidth = lw(2); G.stroke(cut.path); G.restore();
    if (kc > 0) { G.save(); G.globalAlpha = PA; G.strokeStyle = C.red; G.lineWidth = lw(4); G.beginPath(); G.moveTo(-B01_X2F.W / 2 - 6, B01_X2F.cut); G.lineTo(-B01_X2F.W / 2 - 6 + (B01_X2F.W + 12) * kc, B01_X2F.cut); G.stroke(); G.restore(); }
  }, { rot: Math.PI / 2 });
  /* its length, against the whole mouse's */
  const yd = oy + B01_X2F.W / 2 * s + 34, xn = ox, xc = ox - B01_X2F.cut * s, x0 = ox - 120 * s;
  if (ta > 0.5) dim(t, s0 + 0.3, [xc, yd - 22], [xn, yd - 22], '87.5 mm', 22);
  line(x0, yd, xc - 6, yd, { color: C.red, w: 1.6, dash: [5, 5], alpha: ta * kk });
}
function b01_bigWire(t, s0, box, o = {}) {
  const [x, y, w, h] = box;
  /* from above (the kit's rival, its own 116.8 × 63 mm), nose right; a cable runs out of its nose, snaking as it pays out, to
     the edge of the stage: tied to the PC. The rotated frame: (px, py) mm lands at (mx - py sm, my + px sm) */
  const dims = o.dims || RV_DIMS, sm = 3.2, mx = x + 270, my = y + h / 2 - 10, k = ep(t, s0 + 0.04, s0 + 0.7, E.out3), ca = rvAt('top', 'cable', { dims });
  part(mx, my, sm, () => mouseRival('top', { dims, lw: 2 }), { rot: Math.PI / 2 });
  const nx = mx - ca[1] * sm, ny = my + ca[0] * sm, xe = x + w + 40, pts = [];
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
    b01_tradeIcon(t, -10, tr.icon, [x, y + 9, Lt.icon[0], Lt.icon[1]], { a: ki, dims: b01_dims(tr.id) });
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
/* ---- the fold (FILM F1, one ledger): the six trades fly into the film's eight-chapter ledger, the strip every chapter
   card carries (the kit's ledgerStrip geometry: eight bars across the stage, 16 px apart, the name under each). Each
   flagship lands in the chapter whose compromise it makes; glide, surface and ownership light red as "most mice". The
   close answers the same strip (b01_close) ---- */
const B01_FOLD = { 'logitech-x3': 'intro', 'gw-hts-ultra': 'intro', 'razer-viper-v4-pro': 'click', 'finalmouse-ulx': 'shell', 'pulsar-x2f-crazylight': 'shape', 'xbab-xa25': 'elec' };
const B01_FLAGS = { intro: 'X3, HTS Ultra 8K', click: 'Viper V4 Pro', shell: 'UltralightX', shape: 'X2F CrazyLight', elec: 'XA25' };
/** the strip's bars: { ch: [x, w] } over [x, x + w] (the kit's ledgerStrip geometry) */
function b01_stripGeo(x, w) { const n = LEDGER.length, gap = 16, cw = (w - gap * (n - 1)) / n, out = {}; LEDGER.forEach((e, i) => (out[e.ch] = [x + i * (cw + gap), cw])); return out; }
/** the strip itself: o.red(ch) 0..1 (an open compromise filling red), o.blue(ch) 0..1 (answered, filling blue over it),
   o.flag(ch) the small print under the name (o.flagA(ch) its alpha, o.flagCol(ch) its colour) */
function b01_strip(t, y, o = {}) {
  const G0 = b01_stripGeo(LM, RM - LM), a0 = o.a == null ? 1 : o.a; if (a0 <= 0.003) return G0;
  LEDGER.forEach(e => {
    const [x, w] = G0[e.ch], kr = o.red ? o.red(e.ch) : 0, kb = o.blue ? o.blue(e.ch) : 0;
    rect(x, y, w, 4, { fill: C.track, alpha: a0 });
    if (kr > 0) rect(x, y, w * kr, 4, { fill: C.red, alpha: a0 });
    if (kb > 0) rect(x, y, w * kb, 4, { fill: C.hero, alpha: a0 });
    text(e.name, x, y + 32, { role: 'label', size: 21, color: kb > 0.5 ? C.ink2 : kr > 0.5 ? C.ink : C.faint, alpha: a0 });
    const f = o.flag ? o.flag(e.ch) : null;
    if (f) text(f, x, y + 60, { role: 'small', size: 19, weight: 650, color: o.flagCol ? o.flagCol(e.ch) : C.red, alpha: a0 * (o.flagA ? o.flagA(e.ch) : 1), sentence: false, maxW: w });
  });
  return G0;
}
function b01_fold(t, t0) {
  const a0 = ep(t, t0, t0 + 0.4); if (a0 <= 0.003) return;
  const y = B01_STAGE.strip, land = {}, step = 0.18, fly = 0.55;
  B01_TRADES.forEach((tr, i) => { const ch = B01_FOLD[tr.id], tl = t0 + 0.2 + i * step + fly; land[ch] = Math.min(land[ch] == null ? 99 : land[ch], tl); });
  const tMost = t0 + 0.2 + B01_TRADES.length * step + fly + 0.2;
  const redOf = ch => land[ch] != null ? ep(t, land[ch], land[ch] + 0.35, E.out3) : ep(t, tMost, tMost + 0.45, E.out3);
  const G0 = b01_strip(t, y, { a: a0, red: redOf, flag: ch => B01_FLAGS[ch] || 'Most mice', flagA: ch => land[ch] != null ? ep(t, land[ch], land[ch] + 0.3) : ep(t, tMost + 0.2, tMost + 0.5), flagCol: ch => B01_FLAGS[ch] ? C.red : C.mute });
  text('The film\'s ledger: one compromise a chapter', LM, y - 22, { role: 'label', size: 20, color: C.mute, alpha: a0 });
  /* each trade's red figure flies from its row to its chapter's bar */
  B01_TRADES.forEach((tr, i) => {
    const ts = t0 + 0.2 + i * step, k = prog(t, ts, ts + fly); if (k <= 0 || k >= 1) return;
    const [bx, bw] = G0[B01_FOLD[tr.id]], x0 = RM - 70, y0 = b01_rowY(i) + 58, x1 = bx + bw / 2, y1 = y, e = E.io3(k);
    const px = lerp(x0, x1, e), py = lerp(y0, y1, e) - Math.sin(Math.PI * e) * 40, sc = lerp(1, 0.82, e);
    const lab = tr.fig, wv = tw(lab, { role: 'num', size: 24 * sc, weight: 800 }) + 18;
    rr(px - wv / 2, py - 18 * sc, wv, 30 * sc, 8, C.red, null, 0, 1 - ep(t, ts + fly - 0.1, ts + fly));
    text(lab, px, py + 3 * sc, { role: 'num', size: 24 * sc, weight: 800, color: '#FFFFFF', align: 'center', alpha: 1 - ep(t, ts + fly - 0.1, ts + fly) });
  });
}
S({
  id: 'b01_compromise', ch: 'intro', theme: 'paper', title: 'Every flagship compromises', settle: 10.5,
  replaces: ['flagships', 'thesis'],
  src: ['b01X3', 'b01X3Psn', 'b01X3Pcg', 'b01TpuHtsU', 'b01GwHtsU', 'b01Optical', 'clk_d2fp', 'ntrTpuV4', 'b01RtUlx', 'rtingsUlx', 'b01X2f', 'b01X2fWt', 'x2fCrazy', 'b01X2Trace', 'exXbabWeight', 'ntrStores', 'ntrRazerV4', 'nbcUlx', 'exRtings'],
  answers: [
    ['flagships: "need to derive all empty data"', 'No blanks left: each flagship shows the one thing it trades, and every one has its figure, sourced (Logitech, TechPowerUp, RTINGS, Pulsar, XBAB) or derived and marked so (the Viper V4 Pro\'s 13.6 %, worked from Logitech\'s own optical and hybrid hours for the G Pro X Superlight 2, on the V4 Pro\'s battery). The other numbers sit in each row\'s small print, none blank'],
    ['flagships: "it bothers me when one number has more decimal places than others"', 'One precision per kind: every weight to 0.1 g (59.0, 31.0, 38.0, 29.0, 24.9, and Theseus 29.3), hours whole, the optical share to 0.1 % (13.6 %, rounded down, never up)'],
    ['flagships: "superstrike x3 is more of a flagship than gpx2"', 'The GPX2 is gone; Logitech\'s flagship is the Pro X3 Superstrike (launched 2026-09-23): its 59.0 g tips a balance against a 29.3 g mouse'],
    ['thesis: "all of these numbers feel very random"', 'The eight specimen tiles are gone. Every number here belongs to a named flagship\'s trade, with its source in the foot line'],
    ['thesis: "the message is good but you can add it to the slide about other companies misadvertising weights"', 'Done: b01_listed (Listed against weighed) carries it ("the weight on the card is the scale\'s"); here it closes the slide in one line, "Optimization over opinion: measure every trade, then design it out"'],
    ['F18.4 (keep price charted)', 'Each flagship\'s price stands in its row\'s small print, and price against weight is charted on b01_price, with the Viper Mini Signature Edition, the Zaunkoenig M3K and the X3 Superstrike added'],
    ['F33.7 (zero compromises; highlight the compromises other flagships make)', 'The film\'s problem slide: six flagships, each shown big while its compromise happens to it (weight, battery, battery to optical clicks, strength, the shape, wireless), each landing in the ledger in red; Theseus lands whole and gives up nothing; the six then fold into the film\'s eight-chapter ledger, which the close answers row by row'],
    ['FILM F9 / kit (rivals drawn as Theseus)', 'Every flagship is drawn as the kit\'s neutral rival mouse, grey, at its own sourced size (EloShapes\' makers\' figures), its fault drawn on it in red (the battery, the switches, the bowed top, the cable); the X2F keeps its own traced outline, also grey. Only Theseus is the simplified mouse, in blue'],
    ['BROADCAST-0945 #3 (never "a firm press")', 'The fingertip on the UltralightX is labelled "Pressed at the top", TechPowerUp\'s own finding ("when applying pressure exactly at the top, the entire top contracts"); no force is claimed']
  ],
  draw: t => {
    header(t, 'Every flagship compromises');
    captions(t, [[0.3, 'Six flagships, six trades: each one gives something up to win something else.'],
      [6.1, 'Theseus gives up nothing. Optimization over opinion: measure every trade, then design it out.'],
      [7.7, 'Eight chapters, eight compromises: each trade lands in its chapter, and three more that most mice make.']]);
    const SB = B01_STAGE.box, n = B01_TRADES.length, Lt = B01_STAGE.list, tT = b01_beatT(n) + 0.05;
    /* the stage: the beat in play, big; as it ends it flies into its row */
    B01_TRADES.forEach((tr, i) => {
      const s0 = b01_beatT(i), end = b01_beatT(i + 1), kin = ep(t, s0 - 0.22, s0 + 0.04), kout = ep(t, end - 0.26, end);
      if (t < s0 - 0.22 || kout >= 1) return;
      const row = [Lt.x, b01_rowY(i) + 9, Lt.icon[0], Lt.icon[1]], ta = 1 - clamp(kout * 3);
      b01_fly(kout, SB, row, () => { G.globalAlpha = 1; B01_BIG[tr.icon](t, s0, SB, { textA: ta * kin, dims: b01_dims(tr.id) }); });
      /* the beat's words: maker and name over the drawing, what it gives up under it, in red */
      const kw = kin * (1 - ep(t, end - 0.38, end - 0.22));
      text(tr.brand, LM, 312, { role: 'label', size: 22, color: C.mute, alpha: kw });
      text(tr.name, LM - 2, 364, { role: 'h2', size: 50, color: C.ink, alpha: kw });
      text('Gives up ' + tr.what.toLowerCase(), LM, 813, { role: 'label', size: 22, color: C.red, alpha: kw });
      const fr = text(tr.fig, LM - 3, 903, { role: 'd1', size: 88, weight: 800, track: -0.02, color: C.red, alpha: kw, tnum: false });
      text('for ' + tr.why.charAt(0).toLowerCase() + tr.why.slice(1), LM + fr.w + 36, 897, { role: 'small', size: 27, weight: 600, color: C.ink2, alpha: kw, sentence: false });
    });
    /* Theseus lands: whole, blue, nothing given up, and the six trades it doesn't make */
    const kT = ep(t, tT, tT + 0.3);
    if (kT > 0.003) {
      b01_bigTheseus(t, tT, SB);
      text('Nitrite Labs', LM, 312, { role: 'label', size: 22, color: C.heroText, alpha: kT });
      text('Theseus', LM - 2, 364, { role: 'h2', size: 50, color: C.heroText, grad: C.heroGrad, alpha: kT });
      const kG = kT * (1 - ep(t, B01_STAGE.fold - 0.3, B01_STAGE.fold));
      text('Gives up', LM, 813, { role: 'label', size: 22, color: C.heroText, alpha: kG });
      text('Nothing', LM - 3, 903, { role: 'd1', size: 88, weight: 800, track: -0.02, color: C.heroText, grad: C.heroGrad, alpha: kG, rise: [tT + 0.12, 0.6], t });
      /* no figure reads as a measurement it isn't (integrator, the cover's rule): Theseus's answers are its targets */
      text('Theseus\'s targets', 560, 398, { role: 'label', size: 19, color: C.mute, alpha: ep(t, tT + 0.35, tT + 0.7) });
      [['Weight', '29.3 g'], ['Battery life at 1 khz', THESEUS.hours + ' h'], ['Spent on clicks', b01_mechPct()], ['Strength', 'Solid, arched'], ['The shape', 'Full, 119.3 mm'], ['Wireless', 'Dual 8khz wired and wireless']].forEach(([wd, v], j) => {
        const yy = 436 + j * 60, kj = ep(t, tT + 0.4 + j * 0.07, tT + 0.75 + j * 0.07);
        if (j) line(560, yy - 40, 1110, yy - 40, { color: C.hair, w: 1, alpha: kj });
        text(wd, 560, yy, { role: 'label', size: 20, color: C.mute, alpha: kj });
        text(v, 1110, yy, { role: 'h3', size: 28, weight: 750, color: C.heroText, align: 'right', alpha: kj, sentence: false });
      });
    }
    b01_ledgerList(t, { rowT: i => b01_beatT(i + 1) - 0.04, thsT: tT + 0.25 });
    b01_fold(t, B01_STAGE.fold);
    source(t, 'Weights to 0.1 g: TechPowerUp\'s scale (HTS Ultra 8K, ± 1 g; UltralightX, 2023 medium, which it found to "flex" and "creak"), else makers\' (X3; X2F, Pulsar\'s 29 g ± 2; XA25). ' + b01_optPct() + ' and ' + b01_mechPct() + ', derived: Logitech\'s own 96 h optical against 104 h hybrid (G Pro X Superlight 2, 290 mAh, 1 khz) put two switches\' optics at 0.23 mA, on a Viper V4 Pro\'s 306 mAh over 180 h; a mechanical read, about 3 µA', { t0: 0.6 });
  }
});

/* ================================ 5. Why lighter wins (his important idea, F9.26, F33.5) ================================
   Argued from F = m · a, not "overall speed" (his note): the same push stops and turns half the mass in half the time.
   The classroom version first (two carts, the same push back on each: OpenStax College Physics 2e §4.3), then the same
   physics on the mouse: it crosses its target at 0.5 m/s and the same push, 0.54 N (one GT01 click's force, the kit's
   SCALE.click), brakes it and brings it back. Time since crossing τ: brake to a stop in m v / F over m v² / 2F, then back
   to the target in 2 √(d m / F) (push half way, brake half way): (1 + √2) m v / F in all, linear in the moving mass.
   In a hand, the fingers move too: the total is k × (fingers + mouse), and the mouse's own part, k × mouse, is the same
   whatever the fingers weigh. So the slide claims exactly that part (the model auditor's M-b01-1): Pro X3 Superstrike
   59.0 g adds 132 ms to a correction, Theseus 29.3 g adds 66 ms, and half the force goes into the mouse. No shot at a
   fixed time: a hit or a miss would depend on the fingers' unknown mass. No pad friction (said in the foot line). */
const B01_LT = { v: 0.5, F: SCALE.click.N, slow: 20, mR: 0.059, tF: 3.3, tc: 0.3 };
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
S({
  id: 'b01_lighter', ch: 'intro', theme: 'night', title: 'Why lighter wins', settle: 10.5, ideas: ['weight'],
  replaces: ['zerograms'],
  src: ['b01OpenStax', 'exZk', 'exConroy', 'b01X3', 'clk_gt01', 'b01FingerMass', 'b01HandMass'],
  answers: [
    ['zerograms: "needs more reasoning, argument feels weak here"', 'The argument is worked on screen from F = m · a: first the classroom demonstration (two carts given the same push back; the one with half the mass stops in half the time and half the distance and turns back first; OpenStax College Physics 2e §4.3), then the same physics on a flick, where the same 0.54 N finger push brings a 29.3 g Theseus back onto its target in 66 ms against 132 ms for the 59.0 g Pro X3 Superstrike'],
    ['zerograms: "it should be more about theoretical ease of control and target changing speed"', 'It is now only that: how fast each mouse stops, turns and settles back on its target under the same push (the time the mouse itself adds to a correction, 132 → 66 ms, run on a bar in real milliseconds), and ease of control said outright: half the force spent on the mouse'],
    ['zerograms: "overall speed feels outlandish"', 'Gone: no claim about overall speed or time to cross the screen. The only numbers are the mouse\'s own stop and turn under one push, labelled on screen as the mouse\'s own part'],
    ['F9.26 (argue it from F = m · a, don\'t argue against it)', 'Argued from F = m · a and sold without a hedge, in words that are exactly true: "Half the force spent on the mouse", the mouse\'s share of every correction halved'],
    ['F33.5 (an important idea, vastly improved)', 'A classroom demonstration, then the same physics on two named mice with the same push, the time each adds running on a bar, and the verdict, in place of three lanes of pucks'],
    ['F33.7 (a higher skill ceiling as a selling point)', 'The payoff line: the same hands, finer control, a higher skill ceiling'],
    ['Integrator: the headline must hold exactly as printed (the hand weighs far more than the mouse)', 'Scoped to where it is exact: every time grows with all the moving mass (k × (fingers + mouse)), so the slide claims the mouse\'s own part, k × mouse, which halves whatever the fingers weigh: the lanes, the time bars and the verdict say "the time the mouse itself adds", the caption names the arm\'s and the fingers\' parts, and the 70 ms shot is gone (it held only with no finger mass)'],
    ['M-b01-1 (finger mass: the headline holds only if nothing but the mouse moves)', 'Fixed by claiming the mouse\'s additive part, exact for any finger mass; with Q2\'s finger masses in (Mirakhorlo 2016), the slide adds the honest floor for a real hand: up to 45 g of fingertip moving too, at least 28 % less, derived'],
    ['M-b01-2 (say no pad friction and the constant push)', 'The foot line says both: 0.54 N, a GT01 click, and no pad friction'],
    ['R-b01-8 (headline what does not depend on the assumptions)', 'The verdict\'s label now names its conditions (0.5 m/s and 0.54 N) and its net, −50 %, is the part fixed by the masses; beside it the honest floor for a player\'s hand: with up to 45 g of fingertip moving too (Mirakhorlo 2016, derived), at least 28 % less time'],
    ['R-b01-9 (the shot\'s 70 ms is picked)', 'Removed: no shot at a chosen time'],
    ['R-b01-10 (dim the classroom once the flick starts)', 'The classroom panel dims to half as the mouse lanes start'],
    ['M-b01-3 (don\'t imply studies show lighter aims better)', 'Nothing on the slide cites a study of aim; it is a physics argument from F = m · a only'],
    ['FILM F9 / kit (rivals drawn as Theseus)', 'The Pro X3 Superstrike\'s lane is the kit\'s rival mouse at its own 125 × 63.5 × 40 mm, in the yellow of the one rival this slide names; Theseus is the simplified mouse, in blue']
  ],
  draw: t => {
    header(t, 'Why lighter wins');
    captions(t, [[0.3, 'The classroom version: the same push on two carts. Half the mass stops and turns back in half the time.'],
      [2.9, 'The arm moves the hand; your fingers finish by pushing the mouse, and its part of that halves at 29.3 g.'],
      [6.3, 'Whatever your fingers weigh, the mouse\'s share of each correction halves. A higher skill ceiling.']]);
    /* ---- the classroom version: two carts rolling right at the same speed, the same push back on each. On screen from
       frame one (M6): the panel is drawn and the carts are already rolling ---- */
    const PN = [80, 262, 720, 552], inner = demoPanel(t, -0.8, PN, { src: 'OpenStax 2e, §4.3' });
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
    { const kd = ep(t, B01_LT.tF - 0.4, B01_LT.tF + 0.3) * 0.5; if (kd > 0.003) rr(PN[0] - 4, PN[1] - 4, PN[2] + 8, PN[3] + 8, 14, C.bg, null, 0, kd); }
    text('Half the mass stops in half the time and half the distance, and is first to turn back.', inner[0], PN[1] + PN[3] - 62, { role: 'small', size: 24, weight: 600, color: C.ink2, maxW: inner[2], alpha: ep(t, 2.0, 2.4), lh: 1.3 });
    /* ---- the mouse's own part of a correction: the same push on a 59.0 g and a 29.3 g mouse, slowed 20×, moves 5× larger.
       Every time here grows with all the mass that moves (k × (fingers + mouse)), so the mouse's part, k × mouse, is its own
       and halves whatever the fingers weigh (M-b01-1): the lanes and the verdict claim only that part ---- */
    const lanes = [{ m: B01_LT.mR, name: 'Pro X3 Superstrike, 59.0 g', col: C.secondText, bar: C.second, y: 292 }, { m: THESEUS.mass / 1000, name: 'Theseus, 29.3 g', col: C.heroText, bar: C.hero, y: 500, hero: true }];
    const tF = B01_LT.tF, SL = B01_LT.slow, xt = 1110, sD = 1.6, sM = 8;
    /* each lane's mouse, side view, nose right, about its length's middle at x = 0 in both frames: Theseus the simplified mouse; the X3 the
       kit's rival at its own 125 × 63.5 × 40 mm, in the yellow of the one rival this slide names and beats (FILM F9, F35.1) */
    const dX3 = b01_dims('logitech-x3'), laneBox = L => L.hero ? msView('right').box : rvBox('right', null, { dims: dX3 });
    const laneMouse = (L, o) => L.hero ? mouseSimple('right', Object.assign({ hi: ['shell'], col: 'hero', lit: 0.6 }, o)) : mouseRival('right', Object.assign({ dims: dX3, col: 'rival' }, o));
    text('The mouse\'s own part, slowed 20×: the same 0.54 N push on each', 840, 300, { role: 'small', size: 22, weight: 600, color: C.mute, maxW: 1000 });
    /* the time bars: 0 to 150 ms of real time since the mouse crossed its target */
    const BX = 1470, BW = 370, msX = ms => BX + BW * Math.min(ms, 150) / 150;
    lanes.forEach((L, j) => {
      const yT = L.y + 168, I = b01_flickInfo(L.m), tau = (t - tF) / SL, p = b01_flickP(L.m, Math.max(tau, -0.02));
      text(L.name, 840, L.y + 52, { role: 'label', size: 22, color: L.col });
      line(840, yT, 1410, yT, { color: inkA(0.35), w: 2 });
      line(xt, yT + 10, xt, L.y + 74, { color: inkA(0.5), w: 1.5, dash: [6, 6] });
      if (!j) text('Target', xt + 10, L.y + 94, { role: 'label', size: 21, color: C.mute });
      /* the sensor's path: a tick every 10 ms of the real flick, and a dashed ghost where it stopped */
      for (let g = -0.02; g < tau - 0.004; g += 0.01) { const xg = xt + b01_flickP(L.m, g) * sM; line(xg, yT + 4, xg, yT + 14, { color: L.hero ? C.hero : C.ink2, w: 2, alpha: 0.75 }); }
      if (tau > I.ts) { const xs = xt + I.d * sM; part(xs, yT - 1, sD, () => L.hero ? mouseSimple('right', { lw: 1.4, lineA: 0.45, fill: 'rgba(0,0,0,0)' }) : mouseRival('right', { dims: dX3, col: 'rival', lw: 1.4, lineA: 0.45, fill: 'rgba(0,0,0,0)', hide: ['wheel', 'skates'] }), { alpha: 0.8 });
        text(fmtN(I.d, 1) + ' mm past', xs, yT + 40, { role: 'label', size: 19, color: L.hero ? C.heroText : C.mute, align: 'center', alpha: ep(t, tF + I.ts * SL, tF + I.ts * SL + 0.3) }); }
      const xm = xt + p * sM;
      part(xm, yT - 1, sD, () => laneMouse(L, { lw: 2 }));
      /* the push: back while it brakes and heads home, forward as it eases onto the target */
      const dir = b01_flickPush(L.m, tau), VB = laneBox(L);
      if (dir) { const tip = dir < 0 ? xm + (VB[0] + VB[2]) * sD : xm + VB[0] * sD; const fx = tip + (dir < 0 ? 4 : -4), fl = 56; forceArrow(fx, yT - 34, dir < 0 ? Math.PI : 0, fl, { k: 1, color: L.hero ? C.hero : C.ink }); text(fmtN(B01_LT.F, 2) + ' N', fx + (dir < 0 ? fl / 2 : -fl / 2), yT - 50, { role: 'num', size: 22, weight: 750, color: L.hero ? C.heroText : C.ink, align: 'center' }); }
      /* the time it adds, in real milliseconds: the bar runs while the mouse is off its target and stops when it is back */
      const by = L.y + 150, msNow = Math.max(0, Math.min(tau, I.total) * 1000), back = tau >= I.total, kb = ep(t, tF + I.total * SL, tF + I.total * SL + 0.3);
      if (!j) text('Time the mouse adds, ms', BX, L.y + 52, { role: 'label', size: 20, color: C.mute });
      rr(BX, by - 9, BW, 18, 9, C.track);
      for (const v of [0, 50, 100, 150]) { line(msX(v), by + 14, msX(v), by + 22, { color: inkA(0.4), w: 1.5 }); if (!j) text(String(v), msX(v), by + 46, { role: 'tick', color: C.mute, align: 'center' }); }
      if (msNow > 0) rr(BX, by - 9, Math.max(18, msX(msNow) - BX), 18, 9, L.bar);
      if (back) line(msX(I.total * 1000), by - 20, msX(I.total * 1000), by + 20, { color: L.col, w: 3, alpha: kb });
      if (kb > 0) rich([{ s: fmtN(I.total * 1000, 0) + ' ms', role: 'num', size: 30, weight: 800, color: L.col }, { s: 'back on target', role: 'label', size: 19, color: C.mute, gap: 10 }], 1840, L.y + 112, { align: 'right', alpha: kb });
    });
    /* ---- the payoff ---- */
    const Rr = b01_flickInfo(B01_LT.mR), Tt = b01_flickInfo(THESEUS.mass / 1000);
    verdict(t, 6.3, 840, 880, { from: Math.round(Rr.total * 1000), to: Math.round(Tt.total * 1000), unit: 'ms', dec: 0, size: 96, label: 'The time the mouse itself adds, at 0.5 m/s and 0.54 N', better: 'lower', who: ['59.0 g', '29.3 g'], maxW: 1000 });
    /* with the fingertips moving too: the honest floor (Q2: up to about 45 g of fingertip; times scale with all moving mass) */
    { const mf = 45, cut = Math.floor((1 - (THESEUS.mass + mf) / (B01_LT.mR * 1000 + mf)) * 100 + 1e-9), kf = ep(t, 8.2, 8.7);
      text('With your fingertips too', 1440, 862, { role: 'label', size: 21, color: C.mute, alpha: kf });
      text('At least ' + cut + ' % less', 1440, 910, { role: 'h3', size: 34, weight: 800, color: C.heroText, alpha: kf, sentence: false });
      text('Up to ' + mf + ' g of fingertip moving with it. Derived', 1440, 948, { role: 'small', size: 22, weight: 600, color: C.mute, alpha: kf, maxW: 400, sentence: false }); }
    const kp2 = ep(t, 7.4, 7.9);
    text('Half the force spent on the mouse.', LM, 858, { role: 'h3', size: 34, weight: 800, color: C.ink, alpha: kp2, sentence: false });
    text('The same hands, finer control: a higher skill ceiling.', LM, 898, { role: 'small', size: 26, weight: 600, color: C.heroText, alpha: ep(t, 7.7, 8.2), sentence: false });
    source(t, 'Derived: m v ÷ F to stop, 2 √(d m ÷ F) back, at 0.5 m/s and 0.54 N (a GT01 click), no pad friction. Times grow with all the mass that moves; these are the mouse\'s own. Moves drawn 5× larger.', { t0: 3.0, maxW: 740 });
  }
});

/* ================================ 4. Battery life, traded for weight (F33.5; replaces market) ================================
   His note on market: "make a bigger argument how most mice compromise battery life for weight; research harder to find
   missing weights or derive". The argument, demonstrated: every wireless mouse that lists hours at 1 khz, by weight, and
   the frontier of the most hours listed at each weight. The pointer drags a mouse lighter along that frontier, from the
   Viper V4 Pro (48.9 g, 306 mAh, 180 h) to the G-Wolves HTX Mini 8K (26.9 g, 250 mAh, 80 h); on the right its battery,
   drawn to scale by capacity inside it (the kit's rival mouse, sized from one end's dims to the other's), shrinks as the hours fall (cause on screen, M2). The lightest list
   80 h, or none: five light mice list no hours and are shown with their batteries (210 to 300 mAh). Then Theseus at
   29.3 g carries a battery bigger than the Viper's (370 mAh) and leaves the frontier for 200 h.
   Not plotted: hours derived for rivals. A mouse's draw is its own (G-Wolves's 250 mAh lists 80 h; at the V4 Pro's draw it
   would give 141 h), so a derived rival point would be a guess; their batteries are facts. Theseus's 200 h is derived at
   the V4 Pro's draw and says so (models checked #2, #9). In between the two named mice the readouts are the frontier's,
   in grey: no product sits there. */
const B01_BT = { grab: 1.0, d0: 1.2, d1: 4.2, none: 4.6, ths: 5.2, verdict: 6.6, line: 7.6 };
const B01_BT_NAME = { 'razer-viper-v4-pro': 'Viper V4 Pro', 'gw-htx-mini': 'HTX Mini 8K', 'gw-hts-ultra': 'HTS Ultra 8K', 'keychron-g3': 'Keychron G3', 'logitech-x3': 'Pro X3 Superstrike', 'gw-htr-pro': 'HTR Pro 8K', 'pulsar-x2f-crazylight': 'X2F', 'finalmouse-ulx': 'UltralightX', 'wlmouse-beast-x': 'Beast X', 'finalmouse-slx': 'Starlight X' };
function b01_btData() {
  if (b01_btData.v) return b01_btData.v;
  const P = b01_battPts(), listed = P.filter(p => p.kind === 'listed'), none = P.filter(p => p.kind !== 'listed' && p.mAh).sort((a, b) => a.g - b.g);
  const F = b01_front(listed.map(p => ({ x: p.g, y: p.h, p })), { x: -1, y: 1 }), curve = b01_frontCurve(F.map(q => [q.x, q.y]), [0.08, 0.08]);
  const at = g => { for (let i = 1; i < curve.length; i++) if (curve[i][0] >= g) { const [x0, y0] = curve[i - 1], [x1, y1] = curve[i]; return y0 + (y1 - y0) * (g - x0) / Math.max(1e-9, x1 - x0); } return curve[curve.length - 1][1]; };
  return (b01_btData.v = { listed, none, F, curve, at, hi: F[F.length - 1].p, lo: F[0].p });
}
/** a battery drawn to scale by capacity in the top view's mm (the example pouch, 35 × 25 mm at 4 mm thick, holds 370 mAh;
   c mAh at the same thickness keeps its shape and scales its area by c / 370), centred where the key plan puts it */
function b01_battRect(c, at) { const B = KEY_PARTS.battery, k = Math.sqrt(c / 370), [cx, cy] = at || b01_battC(), w = B.w * k * MS_K.x, h = B.h * k * MS_K.y; return [cx - w / 2, cy - h / 2, w, h]; }
/** where Theseus keeps its battery in the top view (mm): the key plan's place (KEY_PARTS, so H2's move reaches it) */
function b01_battC() { const B = KEY_PARTS.battery; return [(B.x + B.w / 2) * MS_K.x, (B.y + B.h / 2) * MS_K.y]; }
S({
  id: 'b01_battery', ch: 'intro', theme: 'paper', title: 'Battery life, traded for weight', settle: 11, ideas: ['battery', 'weight'],
  replaces: ['market'],
  src: ['exRtings', 'b01TpuHtsU', 'b01GwHtsU', 'b01Gw', 'exNbcV4', 'razerBatt', 'ntrKeychron', 'ntrDaV4', 'ntrXiaomi', 'ntrGpx2', 'ntrGpx2c', 'logiSuperstrike', 'ntrZowie', 'b01X3', 'b01X2f', 'b01TpuUlx', 'b01SlxBatt', 'ntrJauch'],
  answers: [
    ['market: "we need to make a bigger argument here how most mice compromise battery life for weight"', 'Demonstrated instead of plotted: the pointer drags a mouse lighter along the frontier of every mouse that lists hours, from the Viper V4 Pro (48.9 g, 180 h) to the HTX Mini 8K (26.9 g, 80 h), and its battery, drawn to scale inside it, shrinks from 306 to 250 mAh as the hours fall; the five lightest that list no hours appear with their batteries (210 to 300 mAh); then Theseus at 29.3 g carries 370 mAh, more than the Viper, and leaves the frontier for 200 h'],
    ['market: "research harder to find missing weights or derive"', 'Twelve mice with listed hours and weights (scale weights where weighed), five more found with weights and batteries but no hours. Derived, all on one basis: every known battery at the Viper V4 Pro\'s draw, drawn as rings that rise to their hours (X2F 118 h, the 250 mAh mice 141 h, the Beast X 169 h), and Theseus\'s 370 mAh at the same draw, 200 h; the legend says "Battery at the same draw" and the foot line says how (an estimate at the V4 Pro\'s draw, never a bound)'],
    ['F33.5 (an important idea, vastly improved)', 'One causal demonstration: weight down, battery smaller, hours down, then the answer off the curve, with the verdict on one basis, 141 → 200 h (under 32 g, the same draw), and what it means at 6 h a day'],
    ['R-b01-4 (hours need their polling rate)', 'Every hour figure on the slide is at 1 khz and the axis says so'],
    ['F27 (one precision per column) and F2.32', 'Weights to 0.1 g, hours whole, capacities in whole mAh; Theseus 29.3 g like the rest'],
    ['FILM F9 / kit (rivals drawn as Theseus)', 'Along the frontier the mouse on the right is the kit\'s rival mouse, sized from the Viper V4 Pro (127.1 × 63.9 mm) to the HTX Mini 8K (109 × 60 mm) as it is dragged; Theseus\'s simplified mouse takes its place only when Theseus lands, its battery moving to where Theseus keeps it']
  ],
  draw: t => {
    header(t, 'Battery life, traded for weight');
    captions(t, [[0.3, 'Every wireless mouse that lists its battery life at 1 khz, by weight. The lighter it gets, the fewer the hours.'],
      [4.0, 'Going lighter, the battery shrinks and the hours go: the lightest list 80 hours, or none.'],
      [5.6, 'Give every light mouse the same draw: their batteries last 118 to 169 hours. Theseus\'s 370 mAh, 200.']]);
    const D = b01_btData(), T = B01_BT, x0 = 190, y0 = 300, w = 820, h = 470;
    const m = axes(t, { t0: -1, x: x0, y: y0, w, h, xr: [20, 64], yr: [0, 220], xticks: [20, 30, 40, 50, 60], yticks: [0, 50, 100, 150, 200], xfmt: v => v + ' g', yfmt: v => v + ' h', ylabel: 'Battery life at 1 khz' });
    text('Weight', x0 + w + 18, y0 + h + 34, { role: 'label', size: 21, color: C.mute });
    legend(t, -1, x0, y0 + h + 72, [{ kind: 'line', color: C.ink, label: 'Most hours listed' }, { kind: 'dot', color: C.comp, label: 'Hours listed' }, { kind: 'ring', color: C.comp, label: 'Battery at the same draw' }], { size: 20 });
    /* the drag: a weight along the frontier, from the Viper V4 Pro to the HTX Mini 8K */
    const kd = E.io3(prog(t, T.d0, T.d1)), g = lerp(D.hi.g, D.lo.g, kd), hrs = D.at(g), onEnd = t < T.d0 + 0.05 || t > T.d1 - 0.05;
    const kT = ep(t, T.ths, T.ths + 0.4), kAll = ep(t, T.d1, T.d1 + 0.6);
    /* the frontier: drawn as the marker traces it, then whole (its extensions carry on its own slopes, no kink) */
    { const pts = D.curve.filter(p => p[0] >= Math.min(g, D.hi.g) - 1e-6 && p[0] <= D.hi.g + 1e-6).map(p => [m.X(p[0]), m.Y(p[1])]);
      if (t > T.d0 && pts.length > 1) poly(pts, { color: C.ink, w: 3 });
      if (kAll > 0) poly(D.curve.filter(p => p[0] >= 20 && p[0] <= 64).map(p => [m.X(p[0]), m.Y(p[1])]), { color: C.ink, w: 3, alpha: kAll }); }
    /* the market: every mouse that lists hours (grey; the ledger's HTS Ultra 8K in the rival's yellow) */
    for (const p of D.listed) {
      const rival = p.id === 'gw-hts-ultra', px = m.X(p.g), py = m.Y(p.h);
      circle(px, py, rival ? 8 : 7, { fill: rival ? C.second : C.comp });
      const nm = B01_BT_NAME[p.id]; if (!nm || p.id === 'gw-htx-mini' && t < T.d1 - 0.3) continue;
      const right = !['razer-viper-v4-pro', 'keychron-g3', 'gw-htx-mini'].includes(p.id), dy = { 'keychron-g3': 16, 'gw-hts-ultra': 26, 'gw-htx-mini': 30 }[p.id] || -12;
      /* the Keychron's label sits in the clear band between the same-draw rings, its end short of the frontier's curve (at
         dy 22, 14 px off, the curve cut its "g" and two rings sat under it: P3's re-watch) */
      const dx = p.id === 'keychron-g3' ? -40 : right ? 14 : -14;
      text(nm + ', ' + fmtN(p.g, 1) + ' g', px + dx, py + dy, { role: 'label', size: 19, color: rival ? C.secondText : C.mute, align: right ? 'left' : 'right' });
    }
    /* the lightest that list no hours: on the axis, with their batteries */
    { const kn = ep(t, T.none, T.none + 0.5), rows = [], RH = 26;
      if (kn > 0) {
        text('No hours listed at 1 khz', x0 + w - 6, y0 + h - 18, { role: 'label', size: 19, color: C.mute, align: 'right', alpha: kn * (1 - ep(t, T.ths + 0.2, T.ths + 0.5)) });
        D.none.forEach((p, i) => {
          const px = m.X(p.g), lab = (B01_BT_NAME[p.id] || p.short) + ' ' + p.mAh + ' mAh', lw0 = tw(lab, { role: 'label', size: 19 }) + 16;
          let r = 0; while (rows[r] != null && rows[r] > px - lw0 / 2) r++; rows[r] = px + lw0 / 2;
          const ka = kn * ep(t, T.none + i * 0.08, T.none + i * 0.08 + 0.3), ly = y0 + h - 20 - r * RH;
          /* at Theseus's beat every battery is given the same draw as Theseus's: it rises to its hours there (hollow) */
          const kr = E.io3(prog(t, T.ths + 0.4 + i * 0.06, T.ths + 1.3 + i * 0.06)), hy = lerp(y0 + h, m.Y(b01_hoursAt(p.mAh, p.V)), kr), kl = ka * (1 - ep(t, T.ths + 0.2, T.ths + 0.5));
          circle(px, hy, 7, { fill: C.bg, alpha: ka }); circle(px, hy, 7, { color: C.comp, w: 2.5, alpha: ka });
          if (kl > 0.003) { line(px, y0 + h - 9, px, ly + 6, { color: C.hair, w: 1.2, alpha: kl }); text(lab, px, ly, { role: 'label', size: 19, color: C.ink2, align: 'center', alpha: kl }); }
          if (p.id === 'pulsar-x2f-crazylight' && kr > 0.5) text('X2F, ' + fmtN(b01_hoursAt(p.mAh, p.V), 0) + ' h', px + 12, hy - 10, {   /* above its ring: below it the curve cut its "h" */ role: 'label', size: 19, color: C.ink2, alpha: ep(t, T.ths + 1.2, T.ths + 1.5) });
        });
        /* the HTX Mini 8K's own battery at the same draw: above its listed 80 h */
        { const lo = D.lo, hl = b01_hoursAt(lo.mAh, lo.V), kr = E.io3(prog(t, T.ths + 0.5, T.ths + 1.4));
          if (kr > 0.003) { line(m.X(lo.g), m.Y(lo.h) - 8, m.X(lo.g), lerp(m.Y(lo.h), m.Y(hl), kr) + 8, { color: C.comp, w: 1.5, dash: [4, 4] }); circle(m.X(lo.g), lerp(m.Y(lo.h), m.Y(hl), kr), 7, { fill: C.bg }); circle(m.X(lo.g), lerp(m.Y(lo.h), m.Y(hl), kr), 7, { color: C.comp, w: 2.5 }); }
          }
        } }
    /* the marker the pointer drags, and the pointer */
    const kM = 1 - kT;
    if (kM > 0.01) { const mx = m.X(g), my = m.Y(hrs); circle(mx, my, 14, { color: C.ink, w: 3, alpha: kM }); circle(mx, my, 5, { fill: C.ink, alpha: kM });
      cursorPtr(mx + 6, my + 8, { a: ep(t, T.grab - 0.3, T.grab) * (1 - ep(t, T.d1 + 0.1, T.d1 + 0.4)), press: t > T.grab && t < T.grab + 0.45 ? prog(t, T.grab, T.grab + 0.45) : 0, grab: t > T.grab && t < T.d1 + 0.1 }); }
    /* Theseus leaves the frontier: from the frontier's hours at its weight up to its own */
    const gT = THESEUS.mass, hF = D.at(gT), kR = E.out3(prog(t, T.ths + 0.2, T.ths + 1.2)), hNow = lerp(hF, THESEUS.hours, kR);
    if (kT > 0.003) {
      line(m.X(gT), m.Y(hF), m.X(gT), m.Y(hNow), { color: C.hero, w: 2.5, dash: [6, 6], alpha: kT });
      heroMark(m.X(gT), m.Y(hNow), 12, kT);
      text('Theseus, 29.3 g, ' + fmtN(hNow, 0) + ' h', m.X(gT), m.Y(hNow) - 24, { role: 'label', size: 21, color: C.heroText, align: 'center', alpha: kT });
    }
    /* the mouse on the right, its battery drawn to scale by capacity. Along the frontier it is a rival (the kit's rival
       mouse, grey: FILM F9), sized from the Viper V4 Pro's 127.1 × 63.9 mm at the start to the HTX Mini 8K's 109 × 60 mm at
       the end; Theseus (the simplified mouse) takes its place as it lands, and the battery moves to where Theseus keeps it */
    const rival = D.hi.mAh + (D.lo.mAh - D.hi.mAh) * (D.hi.g - g) / (D.hi.g - D.lo.g), cap = lerp(rival, 370, E.out3(prog(t, T.ths + 0.1, T.ths + 0.9)));
    const V = msView('top'), sc = 3.5, mcx = 1385, mcy = 575, ox = mcx - (V.box[0] + V.box[2] / 2) * sc, oy = mcy - (V.box[1] + V.box[3] / 2) * sc;
    const dR = b01_dimsLerp(b01_dims(D.hi.id), b01_dims(D.lo.id), kd), cR = rvAt('top', 'battery', { dims: dR }), cT = b01_battC();
    const bAt = [lerp(cR[0], cT[0], kT), lerp(cR[1], cT[1], kT)];
    part(ox, oy, sc, () => {
      if (kT < 1) mouseRival('top', { dims: dR, lw: 2.2, alpha: 1 - kT });
      if (kT > 0) mouseSimple('top', { lw: 2.2, hi: ['shell'], col: 'hero', lit: kT * 0.75, alpha: kT });
      const [bx, by, bw, bh] = b01_battRect(cap, bAt), heroB = kT > 0.5;
      G.save(); G.globalAlpha = PA; rrPath(bx, by, bw, bh, 1.6); G.fillStyle = heroB ? 'rgba(10,132,255,0.22)' : inkA(TH ? 0.12 : 0.2); G.fill(); G.lineWidth = lw(2.2); G.strokeStyle = heroB ? C.hero : C.ink; G.stroke();
      if (kT > 0) { const [gx, gy, gw, gh] = b01_battRect(D.lo.mAh, cT); G.globalAlpha = PA * kT; G.setLineDash([lw(5), lw(4)]); G.lineWidth = lw(1.6); G.strokeStyle = C.ink2; rrPath(gx, gy, gw, gh, 1.6); G.stroke(); }
      G.restore();
    });
    { const [bx, by, bw, bh] = b01_battRect(cap, bAt); text(fmtN(cap, 0) + ' mAh', ox + (bx + bw / 2) * sc, oy + (by + bh / 2) * sc + 7, { role: 'num', size: 20, weight: 750, color: kT > 0.5 ? C.heroText : (onEnd ? C.ink : C.mute), align: 'center' }); }
    /* the readouts: whose mouse, its weight, its battery life */
    const RX = 1590, who = kT > 0.5 ? ['Nitrite Labs', 'Theseus'] : t < T.d0 + 0.05 ? ['Razer', 'Viper V4 Pro'] : t > T.d1 - 0.05 ? ['G-Wolves', 'HTX Mini 8K'] : ['Along the frontier', 'No product here'];
    const ink = kT > 0.5 ? C.heroText : onEnd ? C.ink : C.mute, gNow = lerp(g, gT, E.out3(prog(t, T.ths + 0.2, T.ths + 0.8))), hShow = kT > 0 ? lerp(D.lo.h, THESEUS.hours, kR) : hrs;
    text(who[0], RX, 360, { role: 'label', size: 20, color: kT > 0.5 ? C.heroText : C.mute });
    text(who[1], RX, 398, { role: 'h3', size: 30, weight: 750, color: ink, sentence: false });
    text('Weight', RX, 456, { role: 'label', size: 20, color: C.mute });
    rich([{ s: fmtN(gNow, 1), role: 'd1', size: 56, weight: 800, color: ink, tnum: true }, { s: 'g', role: 'small', size: 26, weight: 700, color: C.mute, gap: 8, sentence: false }], RX, 516);
    text('Battery life at 1 khz', RX, 576, { role: 'label', size: 20, color: C.mute });
    rich([{ s: fmtN(hShow, 0), role: 'd1', size: 56, weight: 800, color: ink, grad: kT > 0.5 ? C.heroGrad : null, tnum: true }, { s: 'h', role: 'small', size: 26, weight: 700, color: C.mute, gap: 8, sentence: false }], RX, 636);
    if (kT > 0.5) pill(RX, 670, 'derived', kT, { by: 'V4 Pro draw' });
    /* the verdict and what it means */
    const same = Math.ceil(b01_hoursAt(D.lo.mAh, D.lo.V));   /* a rival's figure rounded up: against Theseus */
    /* both owners named under the row (R3's could: the struck 141 h is the HTX Mini 8K's 250 mAh at the Viper's draw, D.lo);
       the row sits 35 px higher and a little smaller so the owners and the net clear the foot rule and the label clears the
       mouse drawing */
    verdict(t, T.verdict, 1180, 900, { from: same, to: THESEUS.hours, unit: 'h', dec: 0, size: 76, label: 'Under 32 g, same draw', better: 'higher', maxW: 660, who: [D.lo.short || D.lo.name, 'Theseus'] });
    { const k = ep(t, T.line, T.line + 0.5), day = 6;
      rich([{ s: 'At ' + day + ' hours a day:', role: 'small', size: 28, weight: 700, color: C.ink }, { s: 'a charge every ' + Math.floor(THESEUS.hours / day) + ' days, not every ' + Math.floor(same / day) + '.', role: 'small', size: 28, weight: 700, color: C.heroText, gap: 10 }], x0 - 110, 888, { alpha: k }); }
    source(t, 'Dots: makers\' listed hours at 1 khz. Rings: each battery at the Viper V4 Pro\'s draw (1.184 Wh over 180 h), as Theseus\'s 370 mAh (1.369 Wh) gives 208 h, shown as 200. That draw includes the Viper\'s optical switches and wheel, so Theseus\'s own save more on top.', { t0: 0.8, maxW: 1080 });
  }
});

/* ================================ 5. Listed against weighed (replaces weightgap, rated 10/10) ================================
   Kept: the data (every mouse RTINGS weighed against the weight its maker lists), the honesty (the signed gap, the ±3 %
   band, Razer and Logitech singled out) and the thesis's message he asked for ("companies misadvertising weights"). Raised:
   the motion. Each row's weight starts at the card's figure and runs to the scale's, its gap bar growing as it goes; a
   mouse heavier than its card by more than 3 % turns red (the buyer was told less). Theseus comes last as a promise, not a
   weighing (no unit exists yet): every unit weighed after assembly, the scale's figure printed on its card (models
   checked #1). One precision: 0.1 g. */
S({
  id: 'b01_listed', ch: 'intro', theme: 'night', title: 'Listed against weighed', settle: 10, ideas: ['weight'],
  replaces: ['weightgap'],
  src: ['exRtings', 'exEloshapes', 'ntrB2g', 'ntrRtSlx', 'ntrEloSlx'],
  answers: [
    ['weightgap (10/10, no note)', 'Kept its data, its signed gap and its ±3 % band; raised the motion (each weight runs from the card\'s figure to the scale\'s as its bar grows; over 3 % heavier turns red) and gave Theseus\'s row as a promise, not a weighing'],
    ['thesis: "a message about companies misadvertising weights"', 'The slide ends on it: "The weight on the card is the scale\'s", the worst gap struck against Theseus\'s 0.0 %, by design'],
    ['F27 (one precision)', 'Every weight to 0.1 g']
  ],
  draw: t => {
    header(t, 'Listed against weighed');
    const R = typeof ntr_gapRows === 'function' ? ntr_gapRows() : [], big = R.filter(r => r.big), oth = R.filter(r => !r.big), nb = big.filter(r => Math.abs(r.gap) <= 3).length, nh = oth.filter(r => r.gap > 3).length;
    captions(t, [[0.3, `Each mouse on a scale, against the weight its maker lists. Razer and Logitech: ${nb} of ${big.length} within 3 %.`],
      [3.4, `${nh} of the other ${oth.length} weigh more than 3 % over their card: the buyer was told less than he got.`],
      [6.0, 'Theseus: every unit weighed after assembly, and the weight on its card is the scale\'s.']]);
    const all = R.concat([{ theseus: true }]), half = Math.ceil(all.length / 2), cols = [all.slice(0, half), all.slice(half)], colW = (RM - LM - 40) / 2, y0 = 300, rh = 38, lo = -7, hi = 13;
    cols.forEach((rows, ci) => {
      const x0 = LM + ci * (colW + 40), bx0 = x0 + 470, bw = colW - 470 - 92, X = v => bx0 + bw * (v - lo) / (hi - lo);
      text('Mouse', x0, y0, { role: 'label', size: 21, color: C.mute });
      text('Card → scale', x0 + 448, y0, { role: 'label', size: 21, color: C.mute, align: 'right' });
      const yb0 = y0 + 18, yb1 = y0 + 18 + rh * rows.length;
      rect(X(-3), yb0, X(3) - X(-3), yb1 - yb0, { fill: inkA(TH ? 0.05 : 0.07) });
      for (const v of [-5, 0, 5, 10]) { line(X(v), yb0, X(v), yb1, { color: v ? C.hair : C.faint, w: v ? 1 : 1.5 }); text((v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v) + ' %', X(v), y0, { role: 'tick', size: 20, color: v ? C.mute : C.ink, align: 'center' }); }
      rows.forEach((r, i) => {
        const y = yb0 + rh * i + rh / 2;
        if (r.theseus) {
          const k = ep(t, 5.6, 6.1);
          rect(x0 - 8, y - rh / 2 + 2, colW + 16, rh - 4, { fill: C.heroSoft, alpha: k });
          text('Theseus', x0, y + 8, { role: 'small', size: 24, weight: 800, color: C.heroText, alpha: k, sentence: false });
          text('Every unit weighed', x0 + 448, y + 8, { role: 'small', size: 21, weight: 650, color: C.heroText, align: 'right', alpha: k, sentence: false });
          heroMark(X(0), y, 12 * k, 1);
          text('0.0 %', x0 + colW, y + 8, { role: 'num', size: 24, weight: 800, color: C.heroText, align: 'right', alpha: k });
          return;
        }
        /* the card's figure runs to the scale's while the gap bar grows: one row after another, from the top */
        const t0 = -0.3 + (ci * half + i) * 0.17, k = ep(t, t0, t0 + 0.3), kb = E.out3(prog(t, t0 + 0.15, t0 + 0.95)), over = r.gap > 3, wNow = lerp(r.c, r.w, kb);
        if (i) line(x0, y - rh / 2, x0 + colW, y - rh / 2, { color: C.hair, w: 1, alpha: k * 0.6 });
        text(r.name, x0, y + 8, { role: 'small', size: 24, weight: r.big ? 700 : 500, color: C.ink, alpha: k, sentence: false });
        rich([{ s: fmtN(r.c, 1), role: 'num', size: 21, weight: 500, color: C.mute }, { s: '→', role: 'num', size: 21, color: C.faint, gap: 8 }, { s: fmtN(wNow, 1) + ' g', role: 'num', size: 21, weight: 700, color: over && kb > 0.6 ? C.red : C.ink2, gap: 8 }], x0 + 448, y + 8, { align: 'right', alpha: k });
        const xa = X(0), xb = X(r.gap * kb);
        rect(Math.min(xa, xb), y - 7, Math.abs(xb - xa), 14, { fill: over ? C.red : r.big ? C.ink2 : C.comp, alpha: k });
        text((r.gap > 0 ? '+' : r.gap < 0 ? '−' : '') + fmtN(Math.abs(r.gap) * kb, 1) + ' %', x0 + colW, y + 8, { role: 'num', size: 24, weight: over ? 800 : 500, color: over ? C.red : C.mute, align: 'right', alpha: k });
      });
      if (ci === 1) legend(t, 4.6, x0, yb1 + rh / 2 + 8, [{ kind: 'comp', color: C.ink2, label: 'Razer, Logitech' }, { kind: 'comp', color: C.comp, label: 'Other brands' }, { kind: 'comp', color: C.red, label: 'Over 3 % heavy' }]);
    });
    /* at a glance: the worst listed gap against Theseus's, which is zero by design (every unit weighed) */
    { const worst = R.reduce((m, r) => (!m || Math.abs(r.gap) > Math.abs(m.gap) ? r : m), null);
      if (worst) verdict(t, 6.6, LM, 930, { from: '+' + fmtN(worst.gap, 1), to: '0.0', unit: '%', dec: 1, size: 80, label: 'Card against scale: the worst, then Theseus', better: 'closest to 0', net: false, maxW: 900 });
      const k = ep(t, 7.6, 8.1); text('The weight on the card is the scale\'s.', 960, 930, { role: 'h3', size: 36, weight: 800, color: C.heroText, alpha: k, sentence: false }); }
    source(t, 'Gap = (weighed − listed) ÷ listed. Weighed: RTINGS\' default weight; listed: the maker\'s, via EloShapes. Left out: the ULX (RTINGS doesn\'t say which size), the MCHOSE L7 Ultra (+17.7 %, likely another variant), the XA25 (weighed by its maker).', { t0: 0.8 });
  }
});

/* ================================ 6. Density, not weight (F33.5; replaces ntr_density) ================================
   His notes: "only use the outline or silhouette"; "good understandable demonstration" (the box); "sell why low density is
   important a little better"; "the x2f having the wrong idea should come first, show the problem first". So: the problem
   first, the X2F CrazyLight's way to 29 g: the X2 family's shape (traced from Pulsar's photo) cut to 87.5 mm, its back
   gone from under the palm. Then Theseus, outline only, the whole 119.3 mm at 29.3 g. Then the fix to the comparison:
   each mouse in the box it fills (L × W × H, drawn in cabinet projection), the volume, and weight ÷ volume. Densities to
   3 decimals, rounded against Theseus (the X2F's down, Theseus's up); the next slide shows why the bigger mouse at the
   same weight feels lighter. */
const B01_DN = { cut: 0.3, slide: 0.75, palm: 1.3, ths: 2.4, box: 3.6, calc: 4.8, verdict: 6.4, line: 7.6 };
/** density to 3 decimals, rounded against Theseus: a rival's down, Theseus's up (never in our favour) */
function b01_rhoTxt(v, ths) { const k = 1000, r = ths ? Math.ceil(v * k - 1e-9) / k : Math.floor(v * k + 1e-9) / k; return r.toFixed(3); }
/** a box in cabinet projection around a top view: footprint (x, y, w, l) px on the pad, its top face lifted by the height
   h px and drawn up and to the right at half depth (45°) */
function b01_cabinet(x, y, w, l, hpx, o = {}) {
  const k = o.k == null ? 1 : o.k, d = 0.354 * hpx * k, col = o.color || C.ink, a = o.a == null ? 1 : o.a; if (a <= 0.003 || k <= 0.003) return;
  const P = [[x, y], [x + w, y], [x + w, y + l], [x, y + l]], Q = P.map(([px, py]) => [px + d, py - d]);
  G.save(); G.globalAlpha = a; G.strokeStyle = col; G.lineWidth = 2;
  G.beginPath(); P.forEach(([px, py], i) => i ? G.lineTo(px, py) : G.moveTo(px, py)); G.closePath(); G.stroke();
  G.globalAlpha = a * 0.75; G.setLineDash([6, 5]); G.lineWidth = 1.6;
  G.beginPath(); Q.forEach(([px, py], i) => i ? G.lineTo(px, py) : G.moveTo(px, py)); G.closePath(); G.stroke();
  G.beginPath(); for (let i = 0; i < 4; i++) { G.moveTo(P[i][0], P[i][1]); G.lineTo(Q[i][0], Q[i][1]); } G.stroke();
  G.restore();
  return { P, Q, d };
}
S({
  id: 'b01_density', ch: 'intro', theme: 'paper', title: 'Density, not weight', settle: 11, ideas: ['weight'],
  replaces: ['ntr_density'],
  src: ['b01X2f', 'b01X2fWt', 'b01X2Trace', 'x2fCrazy'],
  answers: [
    ['ntr_density: "only use the outline or silhouette"', 'Outlines only, both: the X2F CrazyLight from the X2 family\'s silhouette traced from Pulsar\'s photo, Theseus from the film\'s one simplified mouse, its outline alone'],
    ['ntr_density: "good understandable demonstration"', 'The box stays, now drawn as a box (cabinet projection) around each outline with its three dimensions, the volume counted, then weight ÷ volume worked on screen'],
    ['ntr_density: "sell why low density is important a little better"', 'The problem is shown first (a light weight bought by cutting the mouse short, the palm left with nothing under it), and the payoff names what the player keeps: a whole mouse under the palm at a cut-down mouse\'s weight; the next slide shows why it then feels lighter still'],
    ['ntr_density: "the x2f having the wrong idea should come first, show the problem first"', 'The cut opens the slide: on frame one the X2 shape is being cut to 87.5 mm and its back slides away'],
    ['F27 (one precision) and F2.32', 'Weights 29.0 g (Pulsar\'s claim, ± 2) and 29.3 g, densities to 3 decimals, rounded against Theseus (0.171 and 0.099)']
  ],
  draw: t => {
    header(t, 'Density, not weight');
    captions(t, [[0.3, 'The X2F CrazyLight gets to 29 g by being less mouse: 87.5 mm long, its back stops short of your palm.'],
      [2.4, 'Theseus weighs about the same with the whole mouse there. Weight alone hides that; the box it fills shows it.'],
      [6.4, 'Density, the weight in the box a mouse fills: Theseus is 42 % less dense than the X2F.']]);
    const T = B01_DN, s = 3.2, ny = 340, X2 = B01_X2F, x2c = 520, thc = 1010, slideMM = 10;
    /* ---- the X2F: the X2 family's shape, cut to 87.5 mm, its back sliding off (outline only) ---- */
    const full = b01_outline(B01_X2_HALF), cut = b01_outline(B01_X2_HALF, X2.cut, X2.r), kc = ep(t, T.cut - 0.3, T.cut + 0.2, E.cam), kk = ep(t, T.slide - 0.2, T.slide + 0.45, E.snap);
    part(x2c, ny, s, () => {
      G.save(); G.translate(0, kk * slideMM); G.beginPath(); G.rect(-40, X2.cut, 80, 40); G.clip();
      G.globalAlpha = PA * lerp(1, 0.75, kk); if (kk > 0.03) G.setLineDash([lw(6), lw(5)]); G.strokeStyle = kk > 0.03 ? C.red : inkA(TH ? 0.78 : 0.7); G.lineWidth = lw(2.2); G.stroke(full.path); G.restore();
      G.save(); G.globalAlpha = PA; G.strokeStyle = C.ink; G.lineWidth = lw(2.6); G.stroke(cut.path); G.restore();
      if (kc > 0 && kk < 1) { G.save(); G.globalAlpha = PA * (1 - kk); G.strokeStyle = C.red; G.lineWidth = lw(4); G.beginPath(); G.moveTo(-X2.W / 2 - 6, X2.cut); G.lineTo(-X2.W / 2 - 6 + (X2.W + 12) * kc, X2.cut); G.stroke(); G.restore(); }
    });
    /* where the palm rests on a full-length mouse: on nothing here */
    { const kp = ep(t, T.palm, T.palm + 0.4), yp = ny + (X2.cut + slideMM + 14) * s;
      text('Your palm rests here,', x2c - X2.W / 2 * s - 22, yp - 6, { role: 'label', size: 20, color: C.red, align: 'right', alpha: kp });
      text('on nothing', x2c - X2.W / 2 * s - 22, yp + 22, { role: 'label', size: 20, color: C.red, align: 'right', alpha: kp }); }
    const nameY = ny + (120 + slideMM) * s + 46;
    text('Pulsar X2F CrazyLight', x2c, nameY, { role: 'label', size: 22, color: C.ink, align: 'center' });
    text('29.0 g', x2c, nameY + 36, { role: 'num', size: 30, weight: 800, color: C.ink, align: 'center' });
    /* ---- Theseus: the whole mouse, outline only ---- */
    const V = msView('top'), kT = ep(t, T.ths, T.ths + 0.5), kTs = spring(t, T.ths, { f: 1.6, z: 0.75 });
    if (kT > 0.003) {
      part(thc, ny - V.box[1] * s, s * lerp(0.94, 1, kTs), () => { G.save(); G.globalAlpha = PA; G.strokeStyle = C.hero; G.lineWidth = lw(2.6); G.stroke(V.out); G.restore(); }, { alpha: kT });
      text('Theseus', thc, nameY, { role: 'label', size: 22, color: C.heroText, align: 'center', alpha: kT });
      text('29.3 g', thc, nameY + 36, { role: 'num', size: 30, weight: 800, color: C.heroText, align: 'center', alpha: kT });
    }
    /* ---- the boxes they fill: the footprint on the pad, the top face lifted by the height (cabinet projection) ---- */
    const kb = ep(t, T.box, T.box + 0.6, E.io3), kb2 = ep(t, T.box + 0.25, T.box + 0.85, E.io3), L2 = X2.L * s, W2 = X2.W * s, L3 = THESEUS.dims[0] * s, W3 = THESEUS.dims[1] * s;
    b01_cabinet(x2c - W2 / 2, ny, W2, L2, X2.H * s, { k: kb, a: kb, color: C.ink2 });
    b01_cabinet(thc - W3 / 2, ny, W3, L3, THESEUS.dims[2] * s, { k: kb2, a: kb2, color: C.hero });
    if (kb > 0.5) { dim(t, T.box + 0.4, [x2c - W2 / 2, ny], [x2c - W2 / 2, ny + L2], fmtN(X2.L, 1) + ' mm', 30);
      text(fmtN(X2.H, 1) + ' mm high', x2c + W2 / 2 + 0.354 * X2.H * s + 10, ny - 0.354 * X2.H * s + 22, { role: 'label', size: 20, color: C.ink2, alpha: ep(t, T.box + 0.6, T.box + 1.0) }); }
    if (kb2 > 0.5) { dim(t, T.box + 0.65, [thc - W3 / 2, ny], [thc - W3 / 2, ny + L3], fmtN(THESEUS.dims[0], 1) + ' mm', 30, { tcolor: C.heroText });
      text(fmtN(THESEUS.dims[2], 1) + ' mm high', thc + W3 / 2 + 0.354 * THESEUS.dims[2] * s + 10, ny - 0.354 * THESEUS.dims[2] * s + 22, { role: 'label', size: 20, color: C.heroText, alpha: ep(t, T.box + 0.85, T.box + 1.25) }); }
    /* ---- the arithmetic, worked: volume, then weight ÷ volume ---- */
    const RX = 1330, v2 = X2.L * X2.W * X2.H / 1000, v3 = THESEUS.dims[0] * THESEUS.dims[1] * THESEUS.dims[2] / 1000, r2 = 29.0 / v2, r3 = THESEUS.mass / v3;
    [[0, 'X2F CrazyLight', X2.L, X2.W, X2.H, v2, '29.0', r2, false, C.ink], [1, 'Theseus', ...THESEUS.dims, v3, '29.3', r3, true, C.heroText]].forEach(([j, nm, l, w, hh, v, g, r, ths, col]) => {
      const y = 360 + j * 200, k1 = ep(t, T.calc + j * 0.5, T.calc + j * 0.5 + 0.4), k2 = ep(t, T.calc + j * 0.5 + 0.5, T.calc + j * 0.5 + 0.9);
      text(nm, RX, y, { role: 'label', size: 22, color: col, alpha: k1 });
      text(fmtN(l, 1) + ' × ' + fmtN(w, 1) + ' × ' + fmtN(hh, 1) + ' mm = ' + fmtN(v, 1) + ' cm³', RX, y + 44, { role: 'small', size: 25, weight: 650, color: C.ink2, alpha: k1, sentence: false });
      rich([{ s: g + ' g ÷ ' + fmtN(v, 1) + ' cm³ =', role: 'small', size: 25, weight: 650, color: C.ink2, sentence: false }, { s: b01_rhoTxt(r, ths), role: 'num', size: 40, weight: 800, color: col, gap: 12 }, { s: 'g/cm³', role: 'small', size: 22, weight: 700, color: C.mute, gap: 8, sentence: false }], RX, y + 100, { alpha: k2 });
    });
    verdict(t, T.verdict, RX, 930, { from: b01_rhoTxt(r2, false), to: b01_rhoTxt(r3, true), unit: 'g/cm³', dec: 3, size: 84, label: 'Density', better: 'lower', maxW: RM - RX });
    { const k = ep(t, T.line, T.line + 0.5); text('A whole mouse under your palm, at a cut-down mouse\'s weight.', LM, 900, { role: 'h3', size: 30, weight: 750, color: C.ink, alpha: k, sentence: false }); }
    source(t, 'Dimensions: Pulsar (X2F), Brock (Theseus). Weights: the X2F, Pulsar\'s claim (29 g ± 2; none weighed is published); Theseus\'s target. Density: weight ÷ (L × W × H), rounded against Theseus. X2F outline: the X2 family\'s, traced from Pulsar\'s photo, cut to 87.5 mm.', { t0: 0.8, maxW: 1180 });
  }
});

/* ================================ 7. The size-weight illusion (replaces ntr_sizewt) ================================
   His notes: "find an outline of the x2f to add to the box"; "the theseus should only be the shape outline". The classroom
   version first, measured: two blocks of 200 g, 32 and 596 cm³; a balance says they are equal; lifted, the big one felt
   like 161 g and the small one 211 g (precision grip; Wolf, Bergmann Tiest & Drewing 2018, PLOS ONE). Then the mice: the
   X2F and Theseus weigh the same and Theseus fills 1.76 × the box. No study measures mice; Wolf's model gives 12 to 16 %
   lighter by hand at 1.76 ×, and it overstates the measured effect by about a fifth: "roughly a tenth" (research Q2,
   FILLS b01-9), shown as a bar about a tenth shorter with its range, labelled derived. */
const B01_IL = { lift1: 0.7, lift2: 1.7, mice: 3.2, felt: 4.6, line: 6.4 };
function b01_beamLevel(cx, py, half, hang, panW, col) {
  rr(cx - 60, py + hang + 46, 120, 10, 4, inkA(TH ? 0.18 : 0.22));
  line(cx, py + hang + 46, cx, py, { color: col, w: 4 }); line(cx - half, py, cx + half, py, { color: C.ink, w: 5, cap: 'round' });
  circle(cx, py, 8, { fill: C.bg, color: C.ink, w: 3 });
  for (const x of [cx - half, cx + half]) { line(x, py, x - panW / 2 + 4, py + hang - 6, { color: col, w: 1.5 }); line(x, py, x + panW / 2 - 4, py + hang - 6, { color: col, w: 1.5 }); b01_pan(x, py + hang, panW, col, 1); }
}
S({
  id: 'b01_illusion', ch: 'intro', theme: 'night', title: 'Same weight, more mouse, feels lighter', settle: 10, ideas: ['weight'],
  replaces: ['ntr_sizewt'],
  src: ['b01Wolf', 'ntrSwi', 'ntrCharp', 'b01X2f', 'b01X2Trace'],
  answers: [
    ['ntr_sizewt: "find an outline of the x2f to add to the box"', 'The X2F is drawn from the X2 family\'s outline traced from Pulsar\'s own photo, cut to its 87.5 mm and 61.1 mm, in its box'],
    ['ntr_sizewt: "the theseus should only be the shape outline"', 'Theseus is its outline only, in blue'],
    ['F33.5 (show it, don\'t assert it)', 'The illusion is demonstrated with measured numbers first (two 200 g blocks: 161 g and 211 g felt, Wolf 2018), then applied to the two mice with the size of the effect derived and labelled (roughly a tenth lighter)']
  ],
  draw: t => {
    header(t, 'Same weight, more mouse, feels lighter');
    captions(t, [[0.3, 'Two blocks of the same 200 g: the balance says they are equal. Lift them, and the big one feels lighter.'],
      [2.6, 'Measured: lifted, the big block felt like 161 g and the small one 211 g (Wolf 2018). The size-weight illusion.'],
      [4.5, 'The X2F and Theseus weigh about the same, and Theseus fills 1.76 times the box: in the hand it should feel about a tenth lighter.']]);
    const T = B01_IL;
    /* ---- the classroom version: two 200 g blocks, small and big, level on a balance; lifted, they feel different ---- */
    const PN = [80, 262, 760, 590], inner = demoPanel(t, -0.8, PN, { src: 'Wolf 2018, PLOS ONE' });
    const cx = 460, py = 400, half = 200, hang = 120, ink = inkA(TH ? 0.7 : 0.62);
    b01_beamLevel(cx, py, half, hang, 170, ink);
    const cm = 13, sS = Math.cbrt(32) * cm, sB = Math.cbrt(596) * cm, l1 = Math.sin(Math.PI * clamp((t - T.lift1) / 0.8)) * 34, l2 = Math.sin(Math.PI * clamp((t - T.lift2) / 0.8)) * 34;
    rr(cx - half - sS / 2, py + hang - 7 - sS - l1, sS, sS, 4, inkA(0.3), C.ink, 2);
    rr(cx + half - sB / 2, py + hang - 7 - sB - l2, sB, sB, 6, inkA(0.3), C.ink, 2);
    text('200 g', cx - half, py + hang + 34, { role: 'num', size: 24, weight: 750, color: C.ink, align: 'center' });
    text('200 g', cx + half, py + hang + 34, { role: 'num', size: 24, weight: 750, color: C.ink, align: 'center' });
    text('32 cm³', cx - half, py + hang + 62, { role: 'label', size: 19, color: C.mute, align: 'center' });
    text('596 cm³', cx + half, py + hang + 62, { role: 'label', size: 19, color: C.mute, align: 'center' });
    /* the felt weight: where each block lands when lifted (precision grip, matched against a reference) */
    const gx = inner[0] + 150, gw = inner[2] - 170, gv = v => gx + gw * (v - 120) / (240 - 120), gy = PN[1] + 470;
    text('Felt like', inner[0], gy - 34, { role: 'label', size: 20, color: C.mute });
    line(gx, gy, gx + gw, gy, { color: inkA(0.35), w: 2 });
    for (const v of [120, 160, 200, 240]) { line(gv(v), gy - 6, gv(v), gy + 6, { color: inkA(0.4), w: 1.5 }); text(v + ' g', gv(v), gy + 32, { role: 'tick', color: C.mute, align: 'center' }); }
    line(gv(200), gy - 26, gv(200), gy + 8, { color: C.ink2, w: 1.5, dash: [4, 4] });
    [[T.lift1, 211, 'Small'], [T.lift2, 161, 'Big']].forEach(([t0, v, nm], j) => {
      const k = E.out3(prog(t, t0 + 0.3, t0 + 1.0)), x = gv(lerp(200, v, k)), a = ep(t, t0 + 0.2, t0 + 0.4);
      circle(x, gy, 9, { fill: j ? C.ink : C.comp, alpha: a });
      text(nm + ', ' + Math.round(lerp(200, v, k)) + ' g', x, gy - 20 - j * 0, { role: 'label', size: 19, color: C.ink, align: j ? 'right' : 'left', alpha: a });
    });
    /* ---- the mice: the same weight, Theseus in 1.76 × the box ---- */
    const s2 = 2.6, ny = 320, xa = 1130, xb = 1590, X2 = B01_X2F, V = msView('top'), km = ep(t, T.mice, T.mice + 0.5);
    if (km > 0.003) {
      const cut = b01_outline(B01_X2_HALF, X2.cut, X2.r);
      part(xa, ny, s2, () => { G.save(); G.globalAlpha = PA; G.strokeStyle = C.ink; G.lineWidth = lw(2.4); G.stroke(cut.path); G.restore(); }, { alpha: km });
      part(xb, ny - V.box[1] * s2, s2, () => { G.save(); G.globalAlpha = PA; G.strokeStyle = C.hero; G.lineWidth = lw(2.4); G.stroke(V.out); G.restore(); }, { alpha: km });
      b01_cabinet(xa - X2.W * s2 / 2, ny, X2.W * s2, X2.L * s2, X2.H * s2, { a: km * 0.9, color: C.ink2 });
      b01_cabinet(xb - THESEUS.dims[1] * s2 / 2, ny, THESEUS.dims[1] * s2, THESEUS.dims[0] * s2, THESEUS.dims[2] * s2, { a: km * 0.9, color: C.hero });
      const wy = ny + THESEUS.dims[0] * s2 + 44;
      text('X2F CrazyLight', xa, wy, { role: 'label', size: 21, color: C.ink, align: 'center', alpha: km });
      text('29.0 g, 168.9 cm³', xa, wy + 32, { role: 'small', size: 24, weight: 700, color: C.ink, align: 'center', alpha: km, sentence: false });
      text('Theseus', xb, wy, { role: 'label', size: 21, color: C.heroText, align: 'center', alpha: km });
      text('29.3 g, 297.0 cm³', xb, wy + 32, { role: 'small', size: 24, weight: 700, color: C.heroText, align: 'center', alpha: km, sentence: false });
      text('=', (xa + xb) / 2, wy + 32, { role: 'h2', size: 40, color: C.mute, align: 'center', alpha: km });
    }
    /* ---- how heavy each should feel: the X2F the reference, Theseus about a tenth lighter (derived, with its range) ---- */
    { const kf = ep(t, T.felt, T.felt + 0.4), fx = 960, fw = 820, fy = 790, k = E.out3(prog(t, T.felt + 0.3, T.felt + 1.3));
      if (kf > 0.003) {
        text('Should feel, in the hand', fx, fy - 40, { role: 'label', size: 20, color: C.mute, alpha: kf });
        rr(fx, fy - 12, fw, 24, 12, C.track, null, 0, kf); rr(fx, fy - 12, fw, 24, 12, C.comp, null, 0, kf);
        text('X2F', fx + fw + 14, fy + 8, { role: 'label', size: 20, color: C.ink, alpha: kf });
        const f = lerp(1, 0.9, k), y2 = fy + 52;
        rr(fx, y2 - 12, fw, 24, 12, C.track, null, 0, kf);
        rr(fx + fw * 0.84, y2 - 18, fw * 0.10, 36, 6, 'rgba(10,132,255,0.16)', null, 0, kf * k);
        rr(fx, y2 - 12, fw * f, 24, 12, C.hero, null, 0, kf);
        text('Theseus', fx + fw + 14, y2 + 8, { role: 'label', size: 20, color: C.heroText, alpha: kf });
        text('Roughly a tenth lighter. Derived', fx + fw * 0.84 - 12, y2 + 46, { role: 'small', size: 22, weight: 650, color: C.heroText, align: 'right', alpha: kf * k, sentence: false });
      } }
    { const k = ep(t, T.line, T.line + 0.5); text('Same weight, more mouse: next to an X2F, Theseus feels lighter.', LM, 920, { role: 'h3', size: 30, weight: 750, color: C.ink, alpha: k, sentence: false, maxW: 1100 }); }
    source(t, 'Wolf, Bergmann Tiest & Drewing 2018, PLOS ONE: 200 g blocks of 32 and 596 cm³, precision grip, matched at 211 and 161 g; first shown by Charpentier, 1891. Derived for the mice, 1.76 × the volume: 12 to 16 % lighter by hand in Wolf\'s model, which overstates by about a fifth, so roughly a tenth; no study has measured mice.', { t0: 0.8 });
  }
});

/* ================================ 8. Ranked by density (replaces ntr_densrank) ================================
   His note: the X2F "lacks decimal points ... at least 29.5g"; "theseus has an extra decimal point"; "use eloshapes to take
   g wolves mice into account for there weights and density, yes this will make the theseus look worse, but its more
   honest". The twelve lightest wireless mice, listed by weight (Theseus 12th, the X2F now at Pulsar's 29.0 g), re-sort to their density ranks among all
   48 wireless mice the deck has dimensions for (Theseus 2nd, the X2F 33rd). Sixteen G-Wolves mice are in, at G-Wolves's
   own figures (the ones EloShapes aggregates; EloShapes itself loads in the browser and couldn't be read here), a scale
   weight where TechPowerUp weighed one; the one ahead of Theseus ranks on its maker's ~28 g (none published, Q1). Wired
   mice are shown, not ranked (F12.3). One precision: weights 0.1 g, densities 0.001, rounded against Theseus. */
const B01_RK = { sort: 2.4, dur: 1.5, note: 5.2, verdict: 6.2 };
S({
  id: 'b01_rank', ch: 'intro', theme: 'paper', title: 'Ranked by density, not weight', settle: 11, ideas: ['weight'],
  replaces: ['ntr_densrank'],
  src: ['b01Gw', 'b01GwPlusPro', 'b01GwWarg', 'b01GwLycan', 'b01TpuHtsU', 'b01TpuHtrPro', 'b01X2f', 'b01X2fWt', 'exXbabWeight', 'exRtings'],
  answers: [
    ['ntr_densrank: "it bother me the the x2f is lighter and lacks decimal points ... at least 29.5g"', 'The X2F is shown to 0.1 g like every other mouse, at Pulsar\'s own 29.0 g (± 2): no scale weight is published (research Q1, in English and Japanese), so the 29.5 g reports could not be sourced (a question for Brock)'],
    ['ntr_densrank: "i also don\'t like how the theseus has an extra decimal point"', 'Theseus is 29.3 g here, the same precision as every mouse it is ranked against'],
    ['ntr_densrank: "you also need to use eloshapes to take g wolves mice into account ... more honest"', 'Sixteen G-Wolves wireless mice are ranked at G-Wolves\'s own figures (what EloShapes aggregates; EloShapes itself could not be read from this session) or TechPowerUp\'s scale where it weighed one. Theseus falls to 2nd of 48, behind the HTS Plus Pro 8K at its maker\'s ~28 g, and the slide says so'],
    ['F12.3 (rank wireless only; the XA25 unranked)', 'The XA25 is shown under the list, wired, not ranked']
  ],
  draw: t => {
    header(t, 'Ranked by density, not weight');
    const _all = b01_dens(), _byW = _all.slice().sort((a, b) => a.g - b.g), _byR = _all.slice().sort((a, b) => a.rho - b.rho), _rk = id => _byR.findIndex(m => m.id === id) + 1, _ord = n => n + (n % 10 === 1 && n !== 11 ? 'st' : n % 10 === 2 && n !== 12 ? 'nd' : n % 10 === 3 && n !== 13 ? 'rd' : 'th');
    captions(t, [[0.3, 'The twelve lightest wireless mice, by weight. Theseus is ' + _ord(_byW.findIndex(m => m.id === 'theseus') + 1) + '.'],
      [2.4, 'Ranked by density among all ' + _all.length + ', by the box each one fills: Theseus is ' + _ord(_rk('theseus')) + ', the X2F ' + _ord(_rk('pulsar-x2f-crazylight')) + '.'],
      [5.2, 'Only the HTS Plus Pro 8K ranks ahead, on its maker\'s 28 g: no scale weight is published for it.']]);
    const T = B01_RK, all = b01_dens(), byW = all.slice().sort((a, b) => a.g - b.g), byR = all.slice().sort((a, b) => a.rho - b.rho), N = all.length;
    const rows = byW.slice(0, 12), dOrder = rows.slice().sort((a, b) => a.rho - b.rho);
    const y0 = 320, rh = 47, xR = 128, xN = 160, xG = 720, xD = 860, bx = 890, bw = 380, bmax = 0.25;
    text('By weight', xR - 40, y0 - 44, { role: 'label', size: 20, color: C.mute, alpha: 1 - ep(t, T.sort, T.sort + 0.4) });
    text('By density, of ' + N, xR - 40, y0 - 44, { role: 'label', size: 20, color: C.heroText, alpha: ep(t, T.sort, T.sort + 0.4) });
    text('Weight', xG, y0 - 44, { role: 'label', size: 20, color: C.mute, align: 'right' });
    text('g/cm³', xD, y0 - 44, { role: 'label', size: 20, color: C.mute, align: 'right' });
    text('Lower is better', bx + bw, y0 - 44, { role: 'label', size: 20, color: C.mute, align: 'right', alpha: ep(t, T.sort, T.sort + 0.4) });
    rows.forEach((m, i) => {
      const j = dOrder.indexOf(m), stag = j * 0.02, k = E.io3(prog(t, T.sort + stag, T.sort + stag + T.dur)), y = lerp(y0 + i * rh, y0 + j * rh, k);
      const wRank = i + 1, dRank = byR.indexOf(m) + 1, rk = Math.round(lerp(wRank, dRank, k)), ths = m.id === 'theseus', x2f = m.id === 'pulsar-x2f-crazylight';
      const dip = Math.abs(j - i) > 0 ? 1 - 0.5 * Math.sin(Math.PI * k) : 1, xo = j < i ? 80 * Math.sin(Math.PI * k) : 0;
      if (ths) rr(xR - 52 + xo, y - 34, bx + bw - xR + 66, rh - 6, 10, 'rgba(10,132,255,0.10)');
      line(xR - 52 + xo, y + rh - 26, bx + bw + 14 + xo, y + rh - 26, { color: C.hair, w: 1 });
      const col = ths ? C.heroText : x2f ? C.secondText : C.ink;
      text(String(rk), xR + xo, y, { role: 'num', size: 30, weight: 800, color: col, align: 'right', tnum: true, alpha: dip });
      rich([{ s: m.brand === 'Nitrite Labs' ? 'Theseus' : (m.short || m.name), role: 'small', size: 25, weight: 750, color: col, sentence: false }, { s: ths ? 'Nitrite Labs' : m.brand, role: 'label', size: 19, color: C.mute, gap: 12 }], xN + xo, y, { alpha: dip });
      text(b01_g(m.g) + ' g', xG + xo, y, { role: 'num', size: 25, weight: 700, color: col, align: 'right', alpha: dip });
      text(b01_rhoTxt(m.rho, ths), xD + xo, y, { role: 'num', size: 25, weight: 750, color: col, align: 'right', alpha: dip });
      const kb = ep(t, T.sort + 0.2, T.sort + 1.2, E.out3);
      rr(bx + xo, y - 16, bw, 14, 7, C.track, null, 0, dip); rr(bx + xo, y - 16, Math.max(14, bw * Math.min(m.rho, bmax) / bmax * kb), 14, 7, ths ? C.hero : x2f ? C.second : C.comp, null, 0, dip);
      if (m.id === 'gw-hts-plus-pro') text('Maker\'s weight', bx + bw * m.rho / bmax + 16, y - 3, { role: 'label', size: 19, color: C.mute, alpha: ep(t, T.note, T.note + 0.4) });
    });
    /* the wired one, shown and not ranked (F12.3) */
    { const xa = all.length ? b01_dens({ wired: true }).find(m => m.id === 'xbab-xa25') : null, y = y0 + 12 * rh + 18;
      if (xa) { text('Wired, not ranked', xR - 40, y, { role: 'label', size: 19, color: C.mute });
        rich([{ s: 'XA25', role: 'small', size: 23, weight: 700, color: C.ink2, sentence: false }, { s: 'XBAB', role: 'label', size: 19, color: C.mute, gap: 12 }], xN + 160, y);
        text(b01_g(xa.g) + ' g', xG, y, { role: 'num', size: 23, weight: 650, color: C.ink2, align: 'right' }); text(b01_rhoTxt(xa.rho, false), xD, y, { role: 'num', size: 23, weight: 650, color: C.ink2, align: 'right' }); } }
    /* the headline: Theseus's rank, by weight and by density */
    { const ths = byR.find(m => m.id === 'theseus'), wR = byW.indexOf(ths) + 1, dR = byR.indexOf(ths) + 1, k = ep(t, T.verdict, T.verdict + 0.4), kn = ep(t, T.verdict + 0.5, T.verdict + 1.0, E.snap);
      text('Theseus\'s rank of ' + N + ' wireless mice', 1380, 470, { role: 'label', size: 22, color: C.mute, alpha: k });
      rich([{ s: wR + (wR % 10 === 1 && wR !== 11 ? 'st' : wR % 10 === 2 && wR !== 12 ? 'nd' : wR % 10 === 3 && wR !== 13 ? 'rd' : 'th'), role: 'd1', size: 64, weight: 800, color: C.mute }, { s: 'by weight, as mice are sold', role: 'label', size: 20, color: C.mute, gap: 14 }], 1380, 560, { alpha: k });   /* the old ruler, not a rival (R2's could) */
      line(1376, 540, 1376 + 104 * kn, 540, { color: C.mute, w: 4, alpha: k });
      rich([{ s: dR + (dR === 2 ? 'nd' : dR === 1 ? 'st' : dR === 3 ? 'rd' : 'th'), role: 'd1', size: 150, weight: 800, color: C.heroText, grad: C.heroGrad }, { s: 'by density', role: 'label', size: 22, color: C.heroText, gap: 16 }], 1380, 720, { alpha: kn });
      text('Lighter for its size than all but one.', 1380, 780, { role: 'small', size: 26, weight: 700, color: C.ink, alpha: ep(t, T.verdict + 1.0, T.verdict + 1.4), maxW: 460, sentence: false }); }
    source(t, 'Weights: TechPowerUp and RTINGS scales where weighed, else the maker\'s (G-Wolves\'s own figures, what EloShapes aggregates); the X2F, Pulsar\'s claim (29 g ± 2). Density: weight ÷ (L × W × H), rounded against Theseus, at its 29.31 g target. 48 wireless mice with all three dimensions; wired ones are not ranked.', { t0: 0.8 });
  }
});

/* ================================ 9. Price against weight (replaces pricefront; F18.4 keeps price charted) ================================
   His note: "the bottom pareto line instantly going straight bothers me a lot ... there should never be a kink in a pareto
   line, i think the viper mini signature edition and zaunkoenig mice need to be on this table as well, and the x3
   superstrike". Every mouse with a price and a weight, wireless as dots, wired as rings: the frontier (the cheapest at each
   weight, lighter and cheaper both better) drawn as one smooth curve carried on its own end slopes, never a kink; the
   Viper Mini SE ($279.99), Zaunkoenig's M3K and M2K (in euros, converted) and the Pro X3 Superstrike ($199.99) on it. Honest
   reading: G-Wolves sells lighter for less (and lists 80 h, or none: the battery slide), so Theseus is not on the price
   frontier; its claim is the flagship price: $189, the UltralightX's, 8.7 g lighter, with no flex. */
const B01_PR = { front: 0.8, band: 2.6, lab: 3.4, ths: 4.6, verdict: 6.0 };
S({
  id: 'b01_price', ch: 'intro', theme: 'night', title: 'Price against weight', settle: 10, ideas: ['weight'],
  replaces: ['pricefront'],
  src: ['exPrices', 'exRtings', 'b01MiniSe', 'b01M3k', 'b01M2k', 'b01X3', 'b01TpuUlx', 'b01Gw', 'b01X2f'],
  answers: [
    ['pricefront: "the bottom pareto line instantly going straight bothers me a lot ... continue on the trajectory"', 'The frontier is one smooth monotone curve through the cheapest mouse at each weight, carried on past both ends along its own end slopes: no straight run, no kink'],
    ['pricefront: "the viper mini signature edition and zaunkoenig mice need to be on this table as well, and the x3 superstrike"', 'On it: Viper Mini SE $279.99 (49 g), Zaunkoenig M3K (€340, 24 g) and M2K (€299, 23 g on TechPowerUp\'s scale), both wired, and the Pro X3 Superstrike ($199.99, 59 g)'],
    ['F18.4 (keep price charted)', 'Charted, and said honestly: G-Wolves sells lighter for less; Theseus is priced as a flagship, $189, the UltralightX\'s launch price, 8.7 g lighter']
  ],
  draw: t => {
    header(t, 'Price against weight');
    captions(t, [[0.3, 'Price against weight, every mouse with a US price. The line is the cheapest at each weight.'],
      [2.6, 'Flagships cost $160 to $200. Lab-built ones cost more: the Viper Mini SE $279.99, Zaunkoenig\'s M3K about $396.'],
      [4.6, 'Theseus is priced as a flagship, $189: the UltralightX\'s launch price, 8.7 g lighter and without the flex.']]);
    const T = B01_PR, x0 = 200, y0 = 290, w = 1060, h = 560, xr = [15, 65], yr = [50, 420];
    const m = axes(t, { t0: -1, x: x0, y: y0, w, h, xr, yr, xticks: [20, 30, 40, 50, 60], yticks: [100, 200, 300, 400], xfmt: v => v + ' g', yfmt: v => '$' + v, ylabel: 'US price' });
    text('Weight', x0 + w + 18, y0 + h + 34, { role: 'label', size: 21, color: C.mute });
    const P = b01_all().filter(q => q.price && q.g), wl = P.filter(q => q.conn !== 'wired');
    /* the flagship band: the ledger's flagships' prices */
    { const kb = ep(t, T.band, T.band + 0.5); if (kb > 0) { rect(x0, m.Y(199.99), w, m.Y(159.99) - m.Y(199.99), { fill: inkA(0.08), alpha: kb }); } }
    /* the frontier: the cheapest at each weight among wireless mice, one smooth curve with no kink */
    { const F = b01_front(wl.map(q => ({ x: q.g, y: q.price, q })), { x: -1, y: -1 }), curve = b01_frontCurve(F.map(f => [f.x, f.y]), [0.1, 0.1], { x: xr, y: yr });
      const kf = ep(t, T.front, T.front + 1.4, E.io3), pts = curve.filter(c => c[0] <= lerp(curve[0][0], curve[curve.length - 1][0], kf)).map(c => [m.X(c[0]), m.Y(c[1])]);
      if (pts.length > 1) poly(pts, { color: C.ink, w: 3 });
      if (kf > 0.95) text('Cheapest at each weight', m.X(F[F.length - 1].x) - 6, m.Y(F[F.length - 1].y) + 34, { role: 'label', size: 19, color: C.ink2, alpha: ep(t, T.front + 1.4, T.front + 1.8) }); }
    /* every mouse: wireless dots, wired rings; the named ones labelled */
    const lab = { 'razer-viper-mini-se': ['Viper Mini SE, $279.99', 1], 'zaunkoenig-m3k': ['M3K, €340, wired', 1], 'zaunkoenig-m2k': ['M2K, €299, wired', 1], 'logitech-x3': ['Pro X3 Superstrike, $199.99', 1, 1], 'finalmouse-ulx': ['UltralightX, $189', 0], 'gw-lycan': ['Lycan 8K, $132', 0] };
    P.forEach(q => {
      const px = m.X(q.g), py = m.Y(q.price), rv = q.id === 'finalmouse-ulx', wired = q.conn === 'wired';
      if (wired) { circle(px, py, 7, { fill: C.bg }); circle(px, py, 7, { color: C.comp, w: 2.5 }); }
      else circle(px, py, rv ? 9 : 7, { fill: rv ? C.second : C.comp });
      const L = lab[q.id]; if (!L) return;
      const kl = ep(t, L[1] ? T.lab : T.ths - 0.4, (L[1] ? T.lab : T.ths - 0.4) + 0.4);
      text(L[0], px + (L[2] ? -14 : 14), py + (q.id === 'gw-lycan' ? 34 : L[2] ? -14 : 7), { role: 'label', size: 19, color: rv ? C.secondText : C.ink2, align: L[2] ? 'right' : 'left', alpha: kl });
    });
    /* Theseus at the UltralightX's price: the same $189, 8.7 g to the left */
    { const kT = ep(t, T.ths, T.ths + 0.4), ka = ep(t, T.ths + 0.2, T.ths + 1.0, E.io3), ulx = P.find(q => q.id === 'finalmouse-ulx'), py = m.Y(THESEUS.price);
      if (kT > 0.003 && ulx) {
        arrow(m.X(ulx.g) - 12, py, lerp(m.X(ulx.g) - 12, m.X(THESEUS.mass) + 16, ka), py, { color: C.hero, w: 3, hs: 12, p: 1, alpha: kT });
        heroMark(m.X(THESEUS.mass), py, 12, kT * ep(t, T.ths + 0.8, T.ths + 1.1));
        text('Theseus, 29.3 g, $189', m.X(THESEUS.mass), py - 22, { role: 'label', size: 21, color: C.heroText, align: 'center', alpha: ep(t, T.ths + 0.9, T.ths + 1.2) });
      } }
    legend(t, -1, x0, y0 + h + 72, [{ kind: 'line', color: C.ink, label: 'Cheapest at each weight' }, { kind: 'dot', color: C.comp, label: 'Wireless' }, { kind: 'ring', color: C.comp, label: 'Wired' }, { kind: 'area', color: C.ink2, label: 'Flagships, $160 to $200' }], { size: 20 });
    verdict(t, T.verdict, 1330, 760, { from: 38.0, to: 29.3, unit: 'g', dec: 1, size: 96, label: 'Weight at $189: the UltralightX, then Theseus', better: 'lower', maxW: RM - 1330, who: ['UltralightX', 'Theseus'] });
    { const k = ep(t, T.verdict + 1.4, T.verdict + 1.9); text('G-Wolves sells lighter for less, and lists 80 h of battery, or none.', 1330, 470, { role: 'small', size: 24, weight: 650, color: C.ink2, alpha: ep(t, T.lab + 0.6, T.lab + 1.0), maxW: 500, sentence: false }); }
    source(t, 'Prices: makers\' US list prices; the Zaunkoenig mice sell in euros, plotted at the M3K\'s own rate (€340 ~ $396). Weights: scales where weighed, else makers\' (the X2F, Pulsar\'s 29 g ± 2). The UltralightX: TechPowerUp\'s 2023 medium, $189, 38 g. Theseus\'s $189 and 29.3 g are targets.', { t0: 0.8, maxW: 1160 });
  }
});

/* ================================ 10. Targets (replaces targets and targets2) ================================
   His notes: "marker it as dual 8khz, press to pc should be shorter, we've done numerous things to optimize mechanical
   latency"; "compare to starlight x weight for the headline value. set down and idle sleep settings are not important
   enough to talk about this early". So: the headline is weight against the Starlight X (41.7 g on RTINGS's scale → 29.3 g);
   "Dual 8khz wired and wireless"; set-down and idle sleep are gone. The latency targets race: the best anyone has shown
   against Theseus's target, each pulse running to its time on one track (shorter is better), a row at a time (M7).
   Press to PC: Finalmouse's rig times from the touch on the button, so it includes the switch's travel; the Starlight X's
   2.0 ms is a magnetic switch at 0.01 mm, near the rig's own floor. Theseus's switch is mechanical, so the row compares
   mechanical switches (R2-b01-2): the fastest on that rig, the OP1 8K V2, 5.7 ms, against Theseus's derived target. The
   GT01 is a snap switch: its NC contact opens at the snap, after the pre-travel, so reading NC saves the snap's flight
   (B03.flightMs, 1.5 ms, XBAB: the clicks chapter's own figure), not the travel. 5.7 − 1.5 = 4.2 ms, if Finalmouse ran the
   OP1 without its own NC mode (Endgame Gear's GX Speed mode, which it says is about 1.4 ms quicker); Direct Drive's 6 % of the
   travel comes on top, so "under 4.2". The magnetic Starlight X stays on the track, labelled, as the faster technology. */
/** Theseus's press-to-PC target on Finalmouse's rig (derived): the fastest mechanical there (OP1 8K V2, 5.7 ms) less the
   snap's flight that reading NC saves (b03's B03.flightMs when present, else its 1.5 ms), rounded up (against Theseus) */
function b01_pressTgt() { const fl = (typeof B03 !== 'undefined' && B03.flightMs) || 1.5; return Math.ceil((5.7 - fl) * 10 - 1e-9) / 10; }
const B01_TG = [
  { cat: 'Press to PC, with travel', unit: 'ms', best: 5.7, who: 'OP1 8K V2, the fastest mechanical, Finalmouse\'s rig', get tgt() { return b01_pressTgt(); }, get tgtTxt() { return 'Under ' + fmtN(b01_pressTgt(), 1); }, tgtNote: 'derived', under: true, max: 8, dec: 1, extra: [['Starlight X, magnetic', 2.0], ['Viper V4 Pro', 7.5]] },
  { cat: 'Motion latency, wireless', unit: 'ms', best: 0.34, who: 'Viper V4 Pro, PIAKNOW\'S rig', tgt: 0.14, tgtTxt: '0.14', max: 0.4, dec: 2 },
  { cat: 'Click latency, wired', unit: 'µs', best: 72, who: 'XA25 at NC release, XBAB', tgt: 70, tgtTxt: '70', max: 80, dec: 0 },
  { cat: 'Frame sync, frame to USB', unit: 'µs', best: 42, who: 'XBAB SensorLock', tgt: 42, tgtTxt: '42, a match', max: 50, dec: 0 }
];
S({
  id: 'b01_targets', ch: 'intro', theme: 'paper', title: 'Targets', settle: 10, ideas: ['weight', 'latency'],
  replaces: ['targets', 'targets2'],
  src: ['b01FmClick', 'pcgSlx', 'exPiaknow', 'kunai', 'ntrXbabClick', 'xbabSensorLock', 'ntrV4Sensor', 'ntrRtSlx', 'ntrJauch', 'exNbcV4'],
  answers: [
    ['targets: "marker it as dual 8khz"', 'Set as "Dual 8khz, wired and wireless"'],
    ['targets: "press to pc should be shorter, we\'ve done numerous things to optimize mechanical latency"', 'Shorter, and derived from the clicks chapter: under 4.2 ms on Finalmouse\'s rig against the fastest mechanical there, the OP1 8K V2\'s 5.7 ms. Reading the switch\'s NC contact (Clicks) saves the snap\'s 1.5 ms flight, and Direct Drive\'s 6 % of the travel comes on top; the foot line says the one assumption (the OP1 timed without its own NC mode). The magnetic Starlight X\'s 2.0 ms stays on the track, labelled: a magnetic switch reads at 0.01 mm, and Theseus\'s is mechanical (R2-b01-2)'],
    ['targets2: "compare to starlight x weight for the headline value"', 'The headline: the Starlight X, 41.7 g on RTINGS\'s scale, against Theseus\'s 29.3 g'],
    ['targets2: "set down and idle sleep settings are not important enough to talk about this early"', 'Both removed'],
    ['F33.5 (show, don\'t list)', 'Each latency target races the best shown on one time track, a row at a time']
  ],
  draw: t => {
    header(t, 'Targets');
    captions(t, [[0.3, 'For each figure, the best anyone has shown, against Theseus\'s target. Shorter is faster.'],
      [5.4, 'The headline: the Starlight X weighs 41.7 g on RTINGS\'s scale; Theseus\'s target is 29.3 g.']]);
    const x0 = LM, tx = 520, tw0 = 640, y0 = 330, rh = 140;
    B01_TG.forEach((r, i) => {
      /* frame one shows every row's label and track (R2-b01-4); the row racing is full strength, the rest wait at half (M7) */
      const y = y0 + i * rh, t0 = 0.2 + i * 1.1, a = lerp(0.5, 1, ep(t, t0 - 0.3, t0)), X = v => tx + tw0 * Math.min(v, r.max) / r.max;
      text(r.cat, x0, y, { role: 'label', size: 21, color: C.ink, alpha: a });
      text(r.who, x0, y + 30, { role: 'small', size: 20, weight: 600, color: C.mute, alpha: a, maxW: tx - x0 - 30, sentence: false });
      /* the track: 0 to its max, ticks at the start and end */
      line(tx, y + 6, tx + tw0, y + 6, { color: C.track, w: 6, alpha: a });
      text('0', tx, y + 40, { role: 'tick', color: C.mute, alpha: a, align: 'center' });
      /* the pulses: each runs from 0 at the same speed and stops at its time (the race) */
      const run = v => clamp((t - t0) / 1.0 * r.max / Math.max(v, 1e-6)), lanes = [[r.best, C.comp, C.ink2, fmtN(r.best, r.dec)]].concat((r.extra || []).map(e => [e[1], inkA(0.25), C.mute, fmtN(e[1], 1), e[0]]));
      lanes.forEach(([v, c, tc, txt, nm], j) => {
        const k = clamp((t - t0) / 1.0 / (v / r.max)), xe = lerp(tx, X(v), Math.min(1, k)), yy = y + 6;
        if (k <= 0) return;
        line(tx, yy, xe, yy, { color: c, w: 6, alpha: a });
        circle(xe, yy, j ? 6 : 8, { fill: c, alpha: a });
        if (k >= 1) text(txt + (j ? '' : ' ' + r.unit), X(v), yy - 16 - (j ? 0 : 0), { role: 'num', size: j ? 19 : 22, weight: j ? 600 : 750, color: tc, align: 'center', alpha: a });
        if (k >= 1 && nm) text(nm, X(v), yy + 28, { role: 'label', size: 19, color: C.mute, align: 'center', alpha: a });
      });
      /* Theseus's target, in blue, on its own track just under */
      const kT = clamp((t - t0 - 0.15) / 1.0 / (r.tgt / r.max)), yT = y + 50, xe = lerp(tx, X(r.tgt), Math.min(1, kT));
      if (kT > 0) { line(tx, yT, tx + tw0, yT, { color: C.track, w: 6, alpha: a * 0.6 }); line(tx, yT, xe, yT, { color: C.hero, w: 6, alpha: a }); heroMark(xe, yT, 9, a);
        if (kT >= 1) text(r.tgtTxt + (r.tgtTxt.includes('match') ? '' : ' ' + r.unit) + (r.tgtNote ? ', ' + r.tgtNote : ''), X(r.tgt) + 20, yT + 8, { role: 'num', size: 24, weight: 800, color: C.heroText, alpha: ep(t, t0 + 0.15 + r.tgt / r.max, t0 + 0.45 + r.tgt / r.max) }); }
      if (i < B01_TG.length - 1) line(x0, y + rh - 46, tx + tw0, y + rh - 46, { color: C.hair, w: 1, alpha: a });
    });
    legend(t, -1, tx, y0 - 44, [{ kind: 'dot', color: C.comp, label: 'Best shown' }, { kind: 'hero', label: 'Theseus\'s target' }], { size: 19 });
    /* the right column: the headline, then the quiet tiles */
    verdict(t, 5.4, 1330, 470, { from: 41.7, to: 29.3, unit: 'g', dec: 1, size: 110, label: 'Weight: the Starlight X on RTINGS\'s scale, then Theseus', better: 'lower', who: ['Starlight X', 'Theseus, target'], maxW: RM - 1330 });
    [['Report rate', 'Dual 8khz', 'Wired and wireless'], ['Sensor', 'PAW3970', 'The Viper V4 Pro\'s'], ['Battery, 1 khz', '200 h', 'Derived, its 370 mAh']].forEach(([lab, v, sub], j) => {
      const y = 700 + j * 92, a = ep(t, 6.6 + j * 0.15, 7.0 + j * 0.15);
      line(1330, y - 40, RM, y - 40, { color: C.hair, w: 1, alpha: a });
      text(lab, 1330, y - 8, { role: 'label', size: 19, color: C.mute, alpha: a });
      text(v, RM, y + 8, { role: 'h3', size: 30, weight: 800, color: C.heroText, align: 'right', alpha: a, sentence: false });
      text(sub, 1330, y + 22, { role: 'small', size: 19, weight: 600, color: C.mute, alpha: a, sentence: false });
    });
    source(t, 'Best shown: Finalmouse\'s own rig (PC Gamer, Sept 2026), from the touch on the button, so the switch\'s travel counts: Starlight X 2.0 ms (magnetic), OP1 8K V2 5.7 ms (the fastest mechanical), Viper V4 Pro 7.5 ms; PIAKNOW\'S rig at 8 khz; XBAB\'s analyzer and SensorLock by their developers. Theseus: targets (its weight and hours planned); press to PC derived: the OP1\'s 5.7 ms less the snap\'s ' + fmtN((typeof B03 !== 'undefined' && B03.flightMs) || 1.5, 1) + ' ms flight that reading NC saves (Clicks), if Finalmouse ran it without its own NC mode; Direct Drive\'s gain, 6 % of the travel, comes on top, unquantified.', { t0: 0.8, maxW: 1160 });
  }
});

/* ================================ 11. The weight budget (replaces budget and ntr_stats) ================================
   His note on budget: "it's a lot of work to keep updating this one". So nothing is typed: every part comes from b01_budget()
   (ntr_budget, THESEUS, the Jauch family in RDATA, the deck's wheel, titanium screws, brass inserts and wire). The parts drop
   onto one long scale pan, each as long as it is heavy, the display counting up; then what is left of 29.31 g is the
   shell's (F21.1, "Budget is the target"), drawn against the lightest shell anyone has weighed, the XA25's 12.16 g on
   XBAB's scale. The buttons are the XA25's, a stand-in, and the slide says so (models checked #11). ntr_stats's contents
   went where they belong: density on the cover and its own slide, PIAKNOW'S on the cover, Dual 8khz on the targets. */
S({
  id: 'b01_budget', ch: 'intro', theme: 'night', title: 'The weight budget', settle: 11, ideas: ['weight', 'battery'],
  replaces: ['budget', 'ntr_stats'],
  src: ['exXbabWeight', 'ntrJauch', 'exJauch', 'srf_pmm', 'srf_wheel3d', 'srf_az31b', 'ntrDelrinRho', 'ntrModel3d', 'ntrTiRho', 'ntrGoreWire', 'ntrBrassRho'],
  answers: [
    ['budget: "it\'s a lot of work to keep updating this one"', 'Nothing on it is typed: every part, the total and the shell\'s remainder are computed when the slide draws, from the shared data (the Jauch battery, the board target, the wheel, the titanium screws, the inserts, the wire), so a change anywhere updates it'],
    ['ntr_stats: "density is so important it could be on the cover"', 'Density is on the cover (0.099 g/cm³) and has its own slide'],
    ['ntr_stats: "capitalize the P in Piaknow"; "8khz wired and wireless is better market as Dual 8khz"; "don\'t capitalize the H in khz"', 'PIAKNOW\'S on the cover; "Dual 8khz, wired and wireless" on the targets; khz in lower case throughout'],
    ['ntr_stats: "all of this information is important but would fit better in other slides"', 'Moved: weight and hours here, density on the cover and its slide, price on the price slide, latency on the targets'],
    ['F21.1 (budget is the target)', 'The shell\'s allowance is shown as what the budget leaves, never as a weighed or computed shell'],
    ['F44.2 (the two side switches, "From the shell")', 'A line for the two full-size SPDT side switches, about 0.5 g each (typical), taken from the shell: the total stays 29.31 g and the shell\'s allowance falls to about 9.35 g, computed'],
    ['F42.2 (keep 5.6 g as a target)', 'The board\'s block reads "One board, a target"'],
    ['F47.4 (the board\'s path, "0.6 mm, 5.63 g")', 'Said over the board\'s block, "At 0.6 mm: 5.63 g, derived", and in the foot line (two layers, a lighter encoder, a cored support); the block stays 5.60 g, the target (F42.2), so the shell\'s allowance and the 2.8 g read the same at the printed precision (H3, 11:05)']
  ],
  draw: t => {
    header(t, 'The weight budget');
    const BG = b01_budget();
    captions(t, [[0.3, 'Every part on one scale, each drawn to its weight: the weight budget, from the parts list.'],
      [5.4, 'What is left of 29.31 g is the shell\'s: about ' + (BG ? fmtN(BG.shell, 1) : '–') + ' g with its skates, ' + (BG ? fmtN(BG.cut, 1) : '–') + ' g under the XA25\'s shell on XBAB\'s scale.']]);
    if (!BG) return;
    const x0 = 160, x1 = 1660, gpx = (x1 - x0) / THESEUS.mass, py = 650, bh = 96, step = 0.5, tS = 0.3 + BG.parts.length * step + 0.3;
    /* the pan: one long scale, with its gram ticks */
    rr(x0 - 20, py, x1 - x0 + 40, 12, 6, inkA(TH ? 0.18 : 0.24));
    for (let g = 0; g <= THESEUS.mass + 1e-6; g += 5) { line(x0 + g * gpx, py + 16, x0 + g * gpx, py + 28, { color: inkA(0.4), w: 1.5 }); text(g + ' g', x0 + g * gpx, py + 54, { role: 'tick', color: C.mute, align: 'center' }); }
    /* the parts drop in, one after another, each as long as it is heavy */
    let gx = 0, total = 0;
    /* over the board's block, where its path lands (F47.4; the block itself says "a target") */
    const noteOf = { battery: 'Example part, ' + BG.batt.part, board: 'At ' + fmtN(BOARD_T, 1) + ' mm: ' + fmtN(B01_PCB_PATH.g, 2) + ' g, derived', buttons: 'The XA25\'s, a stand-in' };
    /* the small parts' labels: one list under the pan, past the last small part, nearest part on top, each on an elbow
       leader from its block, so no leader crosses a label or another leader; the leaders break round the gram labels
       (the two-row fan ran a leader through "Wheel and axle" and two through "20 g": P3's re-watch, 11:30) */
    const small = BG.parts.filter(p => p.g * gpx <= 150), sX = x0 + BG.used * gpx + 56, sRow = p => py + 92 + (small.length - 1 - small.indexOf(p)) * 30;
    const tickBox = []; for (let g = 0; g <= THESEUS.mass + 1e-6; g += 5) { const wT = tw(g + ' g', { role: 'tick' }); tickBox.push([x0 + g * gpx - wT / 2 - 6, py + 34, wT + 12, 30]); }
    BG.parts.forEach((p, i) => {
      const t0 = 0.3 + i * step, k = spring(t, t0, { f: 2.2, z: 0.62 }), kl = ep(t, t0 + 0.25, t0 + 0.5), x = x0 + gx * gpx, w = p.g * gpx;
      if (t >= t0) {
        const drop = (1 - Math.min(1, k)) * -260;
        rr(x + 1, py - bh + drop, Math.max(2, w - 2), bh - 2, 6, i === 0 ? inkA(TH ? 0.3 : 0.36) : inkA(TH ? 0.18 : 0.24), C.ink2, 1.5);
        if (t >= t0 + 0.2) total += p.g;
        if (w > 150) { text(p.name, x + 14, py - bh + 34, { role: 'label', size: 20, color: C.ink, alpha: kl }); text(p.key === 'battery' ? fmtN(p.g, 0) + ' g, listed' : fmtN(p.g, 2) + ' g', x + 14, py - bh + 70, { role: 'num', size: 28, weight: 800, color: C.ink, alpha: kl }); }
        else { /* small parts: a row of the list, on an elbow leader from its block */
          const lab = p.name + ', ' + fmtN(p.g, 2) + ' g', bx = x + w / 2, ly = sRow(p), ym = ly - 7;
          G.save(); G.beginPath(); G.rect(-W, -H, 3 * W, 3 * H); for (const b of tickBox) G.rect(b[0], b[1], b[2], b[3]); G.clip('evenodd');
          poly([[bx, py + 32], [bx, ym], [sX - 12, ym]], { color: C.hair, w: 1.2, alpha: kl });
          G.restore();
          text(lab, sX, ly, { role: 'label', size: 19, color: C.ink2, alpha: kl }); }
        if (noteOf[p.key] && w > 150) text(noteOf[p.key], x + 14, py - bh - 14, { role: 'small', size: 19, weight: 600, color: C.mute, alpha: kl, sentence: false, maxW: Math.max(w - 20, 280) });
      }
      gx += p.g;
    });
    /* what is left: the shell's budget, against the lightest shell anyone has weighed */
    { const k = ep(t, tS, tS + 0.6, E.io3), x = x0 + gx * gpx, w = BG.shell * gpx, kx = ep(t, tS + 0.8, tS + 1.3);
      if (k > 0) {
        G.save(); G.globalAlpha = k; G.setLineDash([8, 6]); G.strokeStyle = C.hero; G.lineWidth = 2.5; rrPath(x + 2, py - bh, w - 4, bh - 2, 6); G.stroke(); G.restore();
        rr(x + 2, py - bh, w - 4, bh - 2, 6, 'rgba(10,132,255,0.16)', null, 0, k);
        text('Shell and skates: what is left', x + 14, py - bh + 34, { role: 'label', size: 20, color: C.heroText, alpha: k });
        text('About ' + fmtN(BG.shell, 1) + ' g', x + 14, py - bh + 72, { role: 'num', size: 30, weight: 800, color: C.heroText, alpha: k });
        /* the XA25's shell, 12.16 g on XBAB's scale: the lightest weighed, and longer than the budget leaves */
        const xa = BG.xaShell * gpx, yb = py - bh - 70;
        line(x, yb, x + xa * kx, yb, { color: C.comp, w: 4, alpha: kx });
        line(x, yb - 10, x, yb + 10, { color: C.comp, w: 2, alpha: kx }); if (kx > 0.98) line(x + xa, yb - 10, x + xa, yb + 10, { color: C.comp, w: 2 });
        text('The XA25\'s shell, ' + fmtN(BG.xaShell, 2) + ' g (XBAB)', x, yb + 30, { role: 'label', size: 19, color: C.mute, alpha: kx });
        /* the gap to the XA25's shell, in neutral ink: not a fault left open on Theseus's side, a problem handed to the Shell
           chapter (R2-b01-5), on its own line under the XA25's label */
        if (kx > 0.98) { line(x + w, yb, x + xa, yb, { color: C.ink2, w: 4 }); text('About ' + fmtN(BG.cut, 1) + ' g lighter than the XA25\'s: the Shell chapter shows how', x + xa - 4, yb + 56, { role: 'label', size: 19, color: C.ink2, align: 'right', alpha: ep(t, tS + 1.3, tS + 1.6) }); }
        total += BG.shell * k;
      } }
    /* the scale's display */
    { const shown = Math.min(THESEUS.mass, total);
      text('On the scale', RM, 300, { role: 'label', size: 21, color: C.mute, align: 'right' });
      rich([{ s: fmtN(shown, 2), role: 'd1', size: 110, weight: 800, color: shown >= THESEUS.mass - 1e-6 ? C.heroText : C.ink, grad: shown >= THESEUS.mass - 1e-6 ? C.heroGrad : null, tnum: true }, { s: 'g', role: 'small', size: 36, weight: 700, color: C.mute, gap: 10, sentence: false }], RM, 420, { align: 'right' });
      text('Battery: ' + BG.batt.mAh + ' mAh, ' + fmtN(Math.floor(BG.hours), 0) + ' h at 1 khz (derived), the ' + THESEUS.hours + ' h target covered', RM, 466, { role: 'small', size: 22, weight: 650, color: C.ink2, align: 'right', alpha: ep(t, 0.8, 1.2), sentence: false }); }
    source(t, 'Battery: Jauch LP402535JU, 8 g (the distributor lists it to the gram, so the shell\'s share is good to about ± 0.5 g). Board: ' + fmtN(THESEUS.pcb, 2) + ' g, the target; at ' + fmtN(BOARD_T, 1) + ' mm on two layers, with a lighter encoder and a cored support, it builds to ' + fmtN(B01_PCB_PATH.g, 2) + ' g (derived). Buttons: the XA25\'s, as XBAB weighed them, a stand-in. Wheel: 0.9 g magnesium on a 0.12 g POM axle. Inserts: 4 × 15.23 mm³ of brass at 8.47 g/cm³. Screws: 4 × 23.59 mm³ of Ti-6Al-4V at 4.43 g/cm³. Side switches: two full-size SPDT at about 0.5 g each, typical. Wire: 109.1 mm of 32 AWG at 0.729 mg/mm. The shell gets what is left of the 29.31 g target.', { t0: 0.8 });
  }
});

/* ================================ 12. The close (replaces close) ================================
   FILM F1: the close answers the film's one ledger: the eight chapters' compromises (the kit's LEDGER, as every chapter card
   carried them), each struck and answered in Theseus's blue, row by row, with the flagship that made it named in red under
   it (from b01_compromise's B01_TRADES), struck as its chapter is answered. Then THESEUS, the way the film opened, and the
   byline. No mouse drawing and no shell (F12.2). */
S({
  id: 'b01_close', ch: 'end', theme: 'night', chrome: false, title: 'Close', settle: 9,
  replaces: ['close'],
  src: ['b01X3', 'b01TpuHtsU', 'b01Optical', 'b01TpuUlx', 'b01X2f', 'exXbabWeight'],
  answers: [
    ['close (not rated)', 'The close now answers the film\'s ledger: the eight compromises every chapter card carried, struck and answered in blue one by one, each with the flagship that made it (Pro X3 Superstrike and HTS Ultra 8K, Viper V4 Pro, UltralightX, X2F CrazyLight, XA25) struck under it; then THESEUS, as the film opened'],
    ['FILM F1 (c): the close answers the eight bars and the six flagships inside them', 'Done: the kit\'s ledger, answered row by row, and B01_TRADES\' flagships under their chapters, read live'],
    ['R2-b01-3 (the bookends count differently; zero never lands)', 'The cover\'s counter runs again here: "Compromises" 8, a mark struck as each row is answered, down to 0 in blue just before THESEUS rises; the cover counts the same eight (the film\'s ledger, its six flagships inside)']
  ],
  draw: t => {
    chapterIcon('intro', LM, LAY.labelY - 19, 22, C.hero, ep(t, 0.1, 0.4));
    text('Nitrite Labs', LM + 36, LAY.labelY, { role: 'label', color: C.ink2, t, t0: 0.15, cps: 40 });
    rich([{ s: 'Eight compromises', role: 'label', color: C.faint }, { s: 'answered', role: 'label', color: C.heroText, grad: C.heroGrad, gap: 12 }], RM, LAY.labelY, { align: 'right', alpha: ep(t, 0.4, 0.8) });
    const area = [LM, 150, RM - LM, 720], rh = 88, turn = 0.6, step = 0.42;
    ledger(t, -0.6, area, { answered: 'all', turn, turnStep: step, rh, nameW: 230 });
    /* the flagships under their chapters, struck as their chapter is answered */
    LEDGER.forEach((e, i) => {
      const by = area[1] + i * rh + rh * 0.62 + 30, tt = turn + i * step, kt = ep(t, tt, tt + 0.5);
      const ids = Object.keys(B01_FOLD).filter(id => B01_FOLD[id] === e.ch), names = ids.map(id => (B01_TRADES.find(x => x.id === id) || {}).name).filter(Boolean);
      const lab = names.length ? names.join(', ') + ': ' + ids.map(id => { const x = B01_TRADES.find(y => y.id === id); return x ? x.fig.charAt(0).toLowerCase() + x.fig.slice(1) : ''; }).join(', ') : 'Most mice';
      const x = area[0] + 230, wv = tw(lab, { role: 'small', size: 19, weight: 650 });
      text(lab, x, by, { role: 'small', size: 19, weight: 650, color: names.length ? mix(C.red, C.faint, kt) : C.faint, sentence: false, alpha: ep(t, -0.4, 0.2) });
      if (kt > 0) line(x - 2, by - 6, x - 2 + (wv + 4) * clamp(kt * 1.6), by - 6, { color: C.mute, w: 1.5 });
    });
    /* the cover's counter, run again as the rows are answered (R2-b01-3): "Compromises" 8, a mark struck with each answer, the
       count stepping down with each strike, landing on 0 in Theseus's blue just before THESEUS rises: the film's spine, zero */
    { const n = LEDGER.length, kjs = LEDGER.map((e, i) => ep(t, turn + i * step, turn + i * step + 0.25)), v = n - kjs.filter(k => k >= 0.5).length, done = v === 0, a = ep(t, -0.4, 0.2);
      text('Compromises', RM, 430, { role: 'label', size: 21, color: C.mute, align: 'right', alpha: a });
      text(String(v), RM, 590, { role: 'd1', size: 150, color: done ? C.heroText : C.ink, grad: done ? C.heroGrad : null, tnum: true, align: 'right', alpha: a });
      kjs.forEach((kj, j) => { const sx = RM - 8 - (n - 1 - j) * 26; line(sx, 622, sx, 662, { color: C.mute, w: 3, alpha: a * 0.8 }); if (kj > 0) line(sx - 8, 658, sx - 8 + 16 * kj, 626, { color: C.red, w: 3, alpha: a }); }); }
    /* THESEUS, rising letter by letter, the way the film opened */
    const t0 = turn + LEDGER.length * step + 0.4, st = { role: 'hero', size: 120, track: -0.028 }, word = 'THESEUS', x0 = LM - 6, yb = 976;
    setFont(sty(st)); const ls = lsPx(sty(st));
    const advs = [...word].map((ch, i) => G.measureText(word.slice(0, i + 1)).width - G.measureText(word.slice(0, i)).width);
    let xx = x0;
    [...word].forEach((ch, i) => {
      const k = E.rise(prog(t, t0 + i * 0.06, t0 + 0.7 + i * 0.06));
      if (k > 0) { G.save(); G.beginPath(); G.rect(xx - 6, yb - st.size * 0.8, advs[i] + 12, st.size * 0.86); G.clip(); text(ch, xx, yb + (1 - k) * st.size * 0.82, Object.assign({}, st, { caps: false, color: C.ink })); G.restore(); }
      xx += advs[i] + ls;
    });
    rich([{ s: 'In pursuit of an', role: 'labelL', size: 26, color: C.mute }, { s: 'objectively better', role: 'labelL', size: 26, color: C.ink2, gap: 12 }, { s: 'mouse', role: 'labelL', size: 26, color: C.heroText, grad: C.heroGrad, gap: 12 }], RM, yb - 8, { align: 'right', alpha: ep(t, t0 + 0.8, t0 + 1.3) });
    line(LM, LAY.ruleY, LM + (RM - LM) * ep(t, 0.3, 1.4, E.cam), LAY.ruleY, { color: C.hair, w: 1.5 });
    rich([{ s: 'Brock Liddicoat', role: 'foot', weight: 700, caps: true, track: 0.16, color: C.ink2 }, { s: '/', role: 'foot', color: C.faint, gap: 14 }, { s: 'Nitrite Labs', role: 'foot', caps: true, track: 0.12, color: C.mute, gap: 14 }, { s: '/', role: 'foot', color: C.faint, gap: 14 }, { s: 'Shape designer of the Finalmouse Starlight X', role: 'foot', caps: true, track: 0.12, color: C.faint, gap: 14 }], LM, LAY.footY, { alpha: ep(t, t0 + 1.0, t0 + 1.5) });
    text(`${pad2(DECK.slides.length)} / ${pad2(DECK.slides.length)}`, RM, LAY.footY, { role: 'foot', weight: 600, color: C.mute, align: 'right', alpha: ep(t, t0 + 1.0, t0 + 1.5) });
  }
});
