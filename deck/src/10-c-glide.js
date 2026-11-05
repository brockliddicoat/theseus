/* ============================================================================================
   chapter 02, glide and tracking: what touches the pad, and what sees it.
   card · skate sets (plate off: eight dots on the rim's ledges and two on the clip-on lens; plate on: two mirrored half-moons,
   cut round the corner dots, and a ring round the lens) ·
   dot skates (the same weight on more area) · [10-c2-glide.js: the camera, correlation, defocus, the 0.2 mm window, the
   dots at the lens, the snap-on lens] · the sensor (past the PAW3395) · full reports · where the sensor sits · set in
   the mouse. The idea sheet (POM, screws, skate height) is in 12-15-glide.js.
   Every comparison leads with a huge number in Theseus's colour and a chart it visibly wins (Brock, F14.10).
   ============================================================================================ */
Object.assign(SRC, {
  gld_kim20: { t: 'Kim, Lee, van Gemert & Oulasvirta, "Optimal Sensor Position for a Computer Mouse", CHI 2020: 14 gamers; throughput 5.77 bits/s at the centre, 5.16 at the front (10.7% lower), 4.97 at the rear (14.0% lower); path deviation 18.0, 22.1 and 21.6 px; each player\'s own best position 6.034 against 5.798 bits/s at the centre (+4.1%)', u: 'https://arxiv.org/abs/2001.03352', n: 'Positions 14.4 mm apart (20% steps). A two-sensor mouse emulates any position in 1% steps: x = (1 − p)·front + p·rear. Their calibration took about an hour.' },
  gld_baek26: { t: 'Baek & Kim, arXiv 2608.03168 (4 Aug 2026): a dual-sensor mouse simulates the path for every sensor position, to "reduce the calibration time from an hour to just five minutes" (preliminary)', u: 'https://arxiv.org/abs/2608.03168' },
  gld_next: { t: 'Brock Liddicoat, 2026-11-04 (22:00): Theseus uses the PixArt PAW3970. "The viper v4 pro is just a renamed PAW3970, razer only has exclusivity on it for 2 years ... use all of the viper v4 pro sensor specs, we are thinking ahead here" (his identification: Razer does not print the PixArt name)', u: '' },
  gld_igorV4: { t: 'igor\'sLAB, Razer Viper V4 Pro review, page 2: the Focus Pro 50K Optical Sensor Gen-3, 50,000 DPI in 1-DPI steps, 930 IPS, 90 G, true 8,000 Hz polling, 99.8 percent resolution accuracy, an asymmetric cut-off with 26 levels (Razer\'s figures; no PixArt part named)', u: 'https://www.igorslab.de/en/razer-viper-v4-pro-review-49-grams-8-000-hz-competitive-gaming/2/' },
  gld_paw3395: { t: 'PixArt PAW3395DM-T6QU datasheet v1.2 (15 Nov 2022): up to 26,000 cpi in 50-cpi steps; 650 ips, 50 g (HP mode); run current 1.7 mA HP and 1.3 mA LP at 1 ms polling, 10 mA in Corded Gaming mode at 0.125 ms (LED included); lift cut-off 1 mm or 2 mm, plus manual calibration; angle snapping and angle tunability; VDD 1.8 to 2.1 V; lens to surface 2.2 / 2.4 / 2.6 mm; round lens LM19-LSI (assembled 18.85 × 21.15 mm) or trim lens L0AE-LSI1 (10.90 × 16.80 mm)', u: 'https://atta.szlcsc.com/upload/public/pdf/source/20251201/5A54B75DA77586FABF8CEFBD8F21947D.pdf' },
  gld_eps3950: { t: 'EPS Global listing, PAW3950DM-T5QU: up to 30,000 cpi in 50-cpi steps; 750 ips and 50 g (HP mode); 1.3 mA typical run current, LED included; selectable lift height with manual calibration', u: 'https://www.epsglobal.com/products/semiconductors/sensing-and-haptics/optical-navigation/paw3950dm-t5qu-optical-gaming-navigation-chip', n: 'A distributor listing. Its PAW3395 currents (2.4 / 1.7 mA) did not match PixArt\'s datasheet (1.7 / 1.3 mA), so the 1.3 mA here is not confirmed.' },
  gld_nbcXm: { t: 'Notebookcheck, Xiaomi Gaming Mouse 2 (11 May 2026): "PixArt PAW3955XM sensor", 750 IPS, 60G', u: 'https://www.notebookcheck.net/Xiaomi-launches-new-affordable-8K-wireless-gaming-mouse-with-flagship-PixArt-sensor.1293650.0.html' },
  gld_akko3955: { t: 'IT Home, Akko V9 Master (7 May 2026): PAW3955, native 40,000 cpi, 750 ips, 60 G, 11 lift-off levels', u: 'https://www.ithome.com/0/947/389.htm' },
  gld_3955gen: { t: 'PAW3955 "generic" figures, 40,000 DPI / 850 IPS / 75 G, as compiled by mousemetric and EloShapes (validation report 2026-11-03; not re-opened in this pass)', u: 'https://mousemetric.com/', n: 'PAW3955 figures disagree by variant and by vendor: Xiaomi\'s XM and most retail listings give 750 IPS / 60 G. PixArt publishes no PAW3955 datasheet.' },
  gld_razerFocus: { t: 'Razer, Focus Pro 50K Gen-3: 50,000 DPI, 930 IPS, 90 G, 1-DPI steps, FrameSync; lift-off and landing set separately in "26 granular levels ... compared to only 3 in the previous version" (no millimetres given)', u: 'https://www.razer.com/mena-en/technology/razer-focus-pro-sensor' },
  gld_ninjaV3: { t: 'Ninjutso store, Sora V3 (published 11 Jun 2026): AIMNINJA 2 PRO 45K, "dual-optical engine sensor with gen-2 motionsync and up to 52% more power efficiency compared to PAW3950"', u: 'https://ninjutso.com/products/sora-v3-wireless-ultralight-gaming-mouse' },
  gld_ithomeAim: { t: 'IT Home (6 May 2026): PixArt says the AIMNINJA 2 is a custom sensor, not on its Next-Gen Sensor Platform and without FrameSync hardware; Ninjutso apologised for using the term "FrameSync"', u: 'https://www.ithome.com/0/946/904.htm' },
  gld_maxgV3: { t: 'MaxGaming listing, Ninjutso Sora V3: AIMNINJA 2, 45,000 dpi, 50 G maximum acceleration (retailer listing)', u: 'https://us.maxgaming.com/us/wireless-mouses/ninjutso-sora-v3-8k-superlight-wireless-gaming-mouse-black' },
  gld_tpuV4: { t: 'TechPowerUp, Razer Viper V4 Pro review: the Focus Pro 50K Gen-3 is "a completely different package and a new tracking engine"; wireless counts capped at 12 bits (±2,047 per report); at least 2 (perhaps 16) frames of smoothing for about 1.5 s after a lift-off; new skate sizes, so Viper V3 Pro skates do not fit', u: 'https://www.techpowerup.com/review/razer-viper-v4-pro/', n: 'As recorded in research/validation-report-2026-11-03.md; TechPowerUp refused this session\'s fetches.' },
  gld_pcgX2: { t: 'PC Gamer, Pulsar X2 CrazyLight Medium review: 39 g with dot skates, 41 g with PTFE skates (Pulsar spec, ±1 g)', u: 'https://www.pcgamer.com/hardware/gaming-mice/pulsar-x2-crazylight-medium-review/' },
  gld_ptfe: { t: 'Xometry, PTFE datasheet: density 2.16 g/cm³', u: 'https://xometry.asia/wp-content/uploads/2021/03/PTFE.pdf' },
  gld_zkLens: { t: 'Zaunkoenig, "M1K weight in review": the PMW3360\'s lens weighed 0.8 g, more than the sensor (0.6 g)', u: 'https://zaunkoenig.co/blog/m1k-weight-in-review' },
  gld_brock: { t: 'Brock Liddicoat, "In Pursuit of an Objectively Better Mouse", ideas #8, #10, #11, #27, #37, #52, #76, #87: skate cutouts caused tracking trouble on the WLMOUSE Huan and Ying and the G-Wolves HTM Plus; the V4 Pro\'s lens snaps on', u: '', n: 'research/brock-doc-in-pursuit.txt and its comment threads' },
  gld_skateSets: { t: 'Brock Liddicoat, 2026-11-04 (F14.1, F14.2, F20.1, F20.2, F20.4): with the bottom plate on, a sensor ring and two skates that are "a direct mirror"; "they shouldn\'t be pills, they should be half circles, with cutouts for the dots, they should both look like the rear viper v4 skate"; "Inboard, plate only"; with it off, a ledge for dots, "2 each corner, 1 or 2 on the sensor 9 or 10 total", the ones by the lens "part of the clip on lens like what g wolves does"', u: '', n: 'Half-moon size: the Viper V4 Pro rear skate measures about 53 x 24 mm off Brock\'s photo (scaled by its 63.9 mm width, EloShapes), an estimate; Theseus\'s are 40.3 x 19.4 mm, cut to its plate.' },
  gld_doc65: { t: 'Brock Liddicoat, "In Pursuit of an Objectively Better Mouse": "0.65mm is the optimal skate height, anything taller causes lod issues"; "0.1 mm LOD steps is a must for any future prod"; idea #10, two dots per corner, because "with only 1 dot per corner some softer pads cause the dots to sink in too much and the pad to scrape the bottom of the mouse"', u: '' },
  gld_shell3d: { t: 'This deck\'s 3D shell (3d/shell): Brock\'s Sora V2/V3 scan with eight 6.5 mm dots, four M2 screws and the lens at the middle of the length', u: '', n: 'Skate, screw and lens positions are read from assets/shell-theseus.json.' }
});

/* ---------- the underside, as the 3D shell has it (refreshed from assets/shell-theseus.json when the deck is served) ---------- */
const GLD = {
  dot: 6.5,                                                     /* mm: Brock's dot skate, the size of X-Raypad's Obsidian dots */
  skates: [[13.72, 47.29], [19.97, 42.39], [17.2, -43.18], [10.82, -47.93], [-19.92, 42.53], [-13.49, 47.37], [-11.11, -47.83], [-17.4, -42.91]],
  screws: [[21.52, 17.0], [-21.52, 17.0], [25.22, -24.0], [-25.22, -24.0]],
  sensor: [0, 1.12],                                            /* the board's sensor (pcb-layout U3 at board z 4.0, the board at mouse z -2.88): the plate's window, the ring skate and the clip-on lens sit there */
  R: 71.8                                                       /* mm: the radius view3D frames the shell by, read off a render */
};
(function () {
  try {
    if (typeof fetch !== 'function' || typeof location === 'undefined' || !/^https?:$/.test(location.protocol)) return;
    fetch('assets/shell-theseus-1seam.json').then(r => (r.ok ? r.json() : null)).then(j => {
      if (j && Array.isArray(j.skates) && j.skates.length === 8 && Array.isArray(j.screws)) { GLD.skates = j.skates; GLD.screws = j.screws; if (Array.isArray(j.sensor)) GLD.sensor = j.sensor; }
    }).catch(() => { });
  } catch (e) { /* file:// or no fetch: keep the copy above */ }
})();
const gld_area = n => n * Math.PI * GLD.dot * GLD.dot / 4;      /* mm², n dots */
/** px per mm in a view3D('shell', …, { view: 'bottom', target: [0, 0, 0], zoom }) box, and where a point (X, Z mm) lands.
   From below, the user's left (+X) is on the right and the nose (+Z) is up. */
function gld_scale(box, zoom) { return Math.min(box[2], box[3]) * zoom / (2 * GLD.R * 1.12 / Math.cos(11 * Math.PI / 180)); }
function gld_bot(box, zoom, X, Z) { const s = gld_scale(box, zoom); return [box[0] + box[2] / 2 + X * s, box[1] + box[3] / 2 - Z * s]; }
/** a leader from a point on a drawing to a line of text: a dot and a ring on the point, an elbow, a tail ending at `to` */
function gld_lead(t, t0, p, to, o = {}) {
  const k = ep(t, t0, t0 + 0.55, E.snap); if (k <= 0) return 0;
  const col = o.color || acc(), a = o.alpha == null ? 1 : o.alpha;
  circle(p[0], p[1], 4.5 * k, { fill: col, alpha: a });
  if (o.ring !== false) circle(p[0], p[1], (o.r || 11) * k, { color: col, w: 1.5, alpha: 0.6 * a });
  const ex = o.elbow != null ? o.elbow : to[0] - 36;
  poly([p, [ex, to[1]], to], { color: col, w: 1.5, p: k, alpha: 0.9 * a });
  return k;
}
/** a ring that keeps running out from a point, so a settled frame still shows where to look */
function gld_pulse(t, t0, p, r, col, per = 2.4) { if (t < t0) return; const ph = ((t - t0) % per) / per; circle(p[0], p[1], r + ph * r * 1.4, { color: col, w: 1.5, alpha: 0.45 * (1 - ph) }); }
/** a horizontal bar row in the 'cells' style: track, bar, value above its left end, an evidence dot at the right */
function gld_bar(t, t0, x, y, w, v, max, o = {}) {
  const k = ep(t, t0, t0 + 0.8, E.snap), a = ep(t, t0 - 0.1, t0 + 0.3) * (o.alpha == null ? 1 : o.alpha), bh = o.bh || 14;
  rr(x, y - bh / 2, w, bh, bh / 2, C.track, null, 0, a);
  if (v != null) {
    const col = o.hero ? C.hero : o.color || (o.ref ? C.ink : C.comp), wv = Math.max(bh, w * clamp(v / max) * k);
    if (o.v2 != null) rr(x, y - bh / 2, Math.max(bh, w * clamp(o.v2 / max) * k), bh, bh / 2, rgba(o.hero ? C.hero : TH ? '#111111' : '#F3F2EE', o.hero ? 0.4 : 0.16), null, 0, a);
    if (o.dash) { G.save(); G.globalAlpha = a; G.setLineDash([5, 4]); rrPath(x, y - bh / 2, wv, bh, bh / 2); G.strokeStyle = o.hero ? C.heroText : col; G.lineWidth = 2; G.stroke(); G.restore(); }
    else rr(x, y - bh / 2, wv, bh, bh / 2, col, o.hero && TH ? '#111111' : null, 1.3, a);
  }
  if (o.label != null) text(o.label, x, y - bh / 2 - 12, { font: 'mono', size: o.lsize || 24, weight: o.hero ? 800 : 600, color: o.lcolor || C.ink, alpha: a, tnum: true });
  if (o.note) text(o.note, x + w, y - bh / 2 - 12, { role: 'label', size: 19, color: o.ncolor || C.faint, align: 'right', alpha: a });
  if (o.ev) evDot(x + w + 16, y, o.ev, 5, a);
  return k;
}
/** the step-further strip in the band: BEST TODAY, THE CATCH, THESEUS, each a mono head, a pill and two lines */
function gld_steps(t, t0, cols, o = {}) {
  const y = o.y || LAY.bandY, n = cols.length, gap = 40, w = (RM - LM - gap * (n - 1)) / n;
  cols.forEach((c, i) => {
    const x = LM + i * (w + gap), tt = t0 + i * 0.35, a = ep(t, tt, tt + 0.45); if (a <= 0.003) return;
    const hero = i === n - 1;
    rect(x, y - 26, 28 * E.out3(a), 3, { fill: hero ? C.hero : acc(), alpha: a });
    const lw0 = text(c[0], x + 40, y - 14, { role: 'label', size: 21, color: hero ? C.heroText : C.faint, alpha: a });
    pill(x + w - pillW(c[2]), y - 13, c[2], a);
    text(c[1], x, y + 24, { role: 'small', size: 25, weight: hero ? 700 : 500, color: hero ? C.ink : C.ink2, maxW: w, lh: 1.3, t, t0: tt + 0.15, cps: 120, alpha: a });
  });
}

/** a small status lamp: a ring that fills when on, and its label */
function gld_lamp(x, y, label, on, col, a = 1) { circle(x, y, 8, { fill: on ? col : null, color: on ? null : C.faint, w: 2, alpha: a }); if (on) circle(x, y, 15, { color: col, w: 1.5, alpha: 0.35 * a }); text(label, x + 20, y + 8, { role: 'label', size: 21, color: on ? col : C.faint, alpha: a }); }
/** a label on top of a 3D render: a panel-coloured plate under mono caps (or a sentence), so it reads over any pixels */
function gld_tag(x, y, s, o = {}) {
  const st = o.prose ? { role: 'small', size: 25, weight: 600 } : { role: 'label', size: 21 }, w0 = tw(s, st), a = o.alpha == null ? 1 : o.alpha, x0 = o.align === 'right' ? x - w0 : x;
  if (a <= 0.003) return;
  rr(x0 - 10, y - 24, w0 + 20, 34, 6, rgba(TH ? '#FFFFFF' : '#141517', 0.88), inkA(0.18), 1, a);
  text(s, x0, y, Object.assign({}, st, { color: o.color || C.ink, alpha: a }));
}


/* ---------- the underside from below, drawn to Brock's skate decisions (F12.10, F14.1, F14.2, F20.1, F20.2, F20.4) ----------
   Plate off: a ledge in the shell's rim seats two dots at each corner, and the clip-on lens carries two more (Brock: "part of
   the clip on lens like what g wolves does"), one on a pad at each of its ends, under its clip pegs, so the lens stays one dot
   wide (#37). Plate on: a half-moon at each end, after the Viper V4 Pro's rear skate (straight edge toward the sensor),
   mirrored about the middle of the base and cut round the corner dots, which stay on the ledges; and a ring round the lens window. Corner
   dots are where the 3D shell puts them (GLD.skates); GLD_HALF is the front half-moon as the plate layout cuts it
   (3d/shell/plate-layout.json skates.front, the back one its mirror). */
const GLD_SDOT = [[0, 6.3], [0, -6.7]];                     /* the clip-on lens's two dots, from the sensor (gld_sdot() places them) */
const gld_sdot = () => GLD_SDOT.map(([x, z]) => [GLD.sensor[0] + x, GLD.sensor[1] + z]);
const GLD_HALF = [[1.29,49.97],[-2.16,49.91],[-3.21,49.76],[-4.08,49.4],[-4.53,49.07],[-5.17,48.3],[-5.5,47.49],[-5.71,46.35],[-6.16,45.3],[-6.64,44.58],[-7.5,43.73],[-8.1,43.31],[-8.82,42.95],[-9.54,42.68],[-10.71,42.41],[-11.52,41.96],[-12.16,41.28],[-12.67,40.32],[-13.18,39.57],[-13.86,38.87],[-14.43,38.42],[-15.33,37.94],[-15.93,37.73],[-16.47,37.6],[-17.34,37.55],[-17.94,37.4],[-18.45,37.16],[-18.9,36.83],[-19.42,36.24],[-19.75,35.64],[-20.17,34.02],[-20.17,33.09],[-20.05,32.58],[-19.78,31.98],[-19.45,31.53],[-18.72,30.92],[-18.21,30.68],[-17.61,30.53],[17.61,30.56],[18.33,30.74],[19.14,31.25],[19.76,31.98],[20.09,32.79],[20.15,34.02],[19.91,35.1],[19.52,36.06],[19.18,36.51],[18.87,36.83],[18.06,37.34],[17.31,37.55],[16.44,37.6],[15.9,37.73],[15.3,37.94],[14.19,38.57],[13.04,39.72],[12.14,41.28],[11.49,41.96],[10.68,42.41],[9.24,42.77],[8.07,43.31],[7.65,43.58],[6.83,44.34],[6.26,45.09],[5.84,45.93],[5.33,47.94],[5.03,48.48],[4.5,49.07],[4.05,49.4],[3.18,49.76]];
const GLD_HALFZ = 30.5;                                     /* the half-moons' straight edges, z = +/-30.5 */
function gld_halfPath(X, Y, sg) { GLD_HALF.forEach(([x, z], i) => { const px = X(x), py = Y(sg * z); if (i) G.lineTo(px, py); else G.moveTo(px, py); }); G.closePath(); }
const GLD_WIN = { w: 6.4, h: 15.4 };
const GLD_SKC = () => (TH ? '#FFFFFF' : '#D9D7D0');
/** the underside, nose up; X(x) = cx + x·s (the user's left on the right, as seen from below), Y(z) = cy − z·s */
function gld_bottom(cx, cy, s, set, a, o = {}) {
  const X = x => cx + x * s, Y = z => cy - z * s, path = k => () => { KEY_PTS.forEach(([x, y], i) => { const px = cx + x * k[0] * s, py = cy + y * k[1] * s; if (i) G.lineTo(px, py); else G.moveTo(px, py); }); G.closePath(); };
  const k1 = o.k == null ? 1 : o.k, kS = ep(k1, 0, 0.35), kK = ep(k1, 0.3, 0.75), kL = ep(k1, 0.6, 1);
  if (set === 'on') {
    gld_shape(path([1, 1]), TH ? '#DCDBD5' : '#26272C', inkA(0.4), 2, a * kS);
    gld_shape(() => rrPath(X(GLD.sensor[0] - GLD_WIN.w / 2), Y(GLD.sensor[1] + GLD_WIN.h / 2), GLD_WIN.w * s, GLD_WIN.h * s, GLD_WIN.w / 2 * s), TH ? '#2A2B30' : '#0B0C0E', null, 0, a * kS);
  } else {
    gld_shape(path([1, 1]), TH ? '#CFCEC8' : '#2E2F34', inkA(0.4), 2, a * kS);
    gld_shape(path([(31.2 - 4.2) / 31.2, (59.5 - 4.2) / 59.5]), TH ? '#2C2D32' : '#121315', null, 0, a * kS);    /* open: the board and lattice inside */
    /* the ledge the corner dots sit on, reaching in from the rim */
    for (let q = 0; q < 4; q++) { const A0 = GLD.skates[2 * q], B0 = GLD.skates[2 * q + 1]; G.save(); G.globalAlpha = a * kS; G.strokeStyle = TH ? '#CFCEC8' : '#2E2F34'; G.lineCap = 'round'; G.lineWidth = 9.2 * s; G.beginPath(); G.moveTo(X(A0[0]), Y(A0[1])); G.lineTo(X(B0[0]), Y(B0[1])); G.stroke(); G.restore(); }
  }
  /* the snap-on lens at the centre of the length, seen from below */
  gld_lensBot(X(GLD.sensor[0]), Y(GLD.sensor[1]), s, a * kS);
  /* screws, clear of every skate (#52) */
  for (const [x, z] of GLD.screws) { circle(X(x), Y(z), 1.9 * s, { fill: TH ? '#9A9993' : '#55565B', alpha: a * kS }); line(X(x) - 1.1 * s, Y(z), X(x) + 1.1 * s, Y(z), { color: TH ? '#55544F' : '#1A1B1E', w: 2, alpha: a * kS }); line(X(x), Y(z) - 1.1 * s, X(x), Y(z) + 1.1 * s, { color: TH ? '#55544F' : '#1A1B1E', w: 2, alpha: a * kS }); }
  /* the skates */
  const sk = (fn, hero) => gld_shape(fn, hero ? C.hero : GLD_SKC(), hero ? null : inkA(0.45), 1.5, a);
  if (set === 'on') {
    /* the corner dots stay on the rim's ledges, in the half-moons' cutouts */
    GLD.skates.forEach(p => { if (kS > 0.003) gld_shape(() => G.arc(X(p[0]), Y(p[1]), GLD.dot / 2 * s, 0, TAU), GLD_SKC(), inkA(0.45), 1.5, a * kS); });
    for (const sg of [1, -1]) { const k = sg > 0 ? kK : ep(k1, 0.42, 0.85); if (k > 0.003) gld_shape(() => gld_halfPath(X, Y, sg), GLD_SKC(), inkA(0.45), 1.5, a * k); }
    if (kL > 0.003) gld_shape(() => { rrPath(X(GLD.sensor[0] - GLD_WIN.w / 2 - 2), Y(GLD.sensor[1] + GLD_WIN.h / 2 + 2), (GLD_WIN.w + 4) * s, (GLD_WIN.h + 4) * s, (GLD_WIN.w / 2 + 2) * s); G.save(); G.restore(); }, null, C.hero, 2 * s, a * kL);
  } else {
    GLD.skates.forEach((p, i) => { const k = ep(k1, 0.3 + i * 0.04, 0.55 + i * 0.04); if (k > 0.003) gld_shape(() => G.arc(X(p[0]), Y(p[1]), GLD.dot / 2 * s, 0, TAU), GLD_SKC(), inkA(0.45), 1.5, a * k); });
    /* the clip-on lens's two dots, each on a clear pad at one end of the lens */
    gld_sdot().forEach(p => { if (kL > 0.003) gld_shape(() => G.arc(X(p[0]), Y(p[1]), 3.65 * s, 0, TAU), GLD_MAT.clear(), GLD_MAT.clearE(), 1.8, a * kL); });
    gld_sdot().forEach(p => { if (kL > 0.003) gld_shape(() => G.arc(X(p[0]), Y(p[1]), GLD.dot / 2 * s, 0, TAU), C.hero, null, 0, a * kL); });
  }
  return { X, Y };
}

/* ============================== the chapter card ============================== */
S({
  id: 'glide', ch: 'glide', card: true, theme: 'night', title: 'Glide and tracking', settle: 5,
  draw: t => {
    chapterCard(t, {
      name: 'glide', gloss: 'What touches the pad, and what sees it.', list: [
        [10, 'Two dots per corner, two on the lens'], ['plate', 'With the plate: two half-moons and a ring'], [11, 'Solid skate pads, a 0.2 mm focus window'], [8, 'POM by default, PTFE in the box'],
        [52, 'Screws clear of the skates'], [37, 'A snap-on lens, one dot wide'], [76, 'The PixArt PAW3970 sensor'], ['{16-bit}', 'Full reports, no smoothing'],
        [27, 'The sensor at the centre of the length'], [87, 'Virtual position, lift-off in 0.1 mm steps']
      ]
    });
    /* inside the iris: the castellated sensor module, close up, pushing in slowly */
    const k = ep(t, 0.9, 1.9), s = lerp(26, 31, ep(t, 0.6, 5.0, E.cam));
    gld_modTop(1380, 580, s, k);
    rich([{ s: 'The sensor module, 8.4 × 9.8 mm', role: 'small', size: 25, weight: 600, color: C.mute }], 1380, 880, { align: 'center', alpha: ep(t, 2.0, 2.4) });
  }
});

/* ============================== skate sets: ten dots, or half-moons and a ring ============================== */
S({
  id: 'gld_under', ch: 'glide', theme: 'paper', title: 'Skate sets: ten dots, or half-moons and a ring', settle: 9, ideas: [10, 11, 52, 27],
  src: ['gld_skateSets', 'gld_shell3d', 'gld_paw3395o', 'gld_brock'],
  draw: t => {
    header(t, 'Skate sets: ten dots, or half-moons and a ring');
    captions(t, [[0.6, 'Without the plate, a ledge in the rim takes two dots at each corner, and the clip-on lens carries two more: ten in all.'], [5.2, 'With the plate on, a half-moon at each end, cut round the corner dots and mirrored about the middle, and a ring circles the lens.']]);
    const sets = [[LM, 'Plate off: ten dots', 'off', 0.8], [1000, 'Plate on: two half-moons and a ring', 'on', 4.6]];
    sets.forEach(([x, nm, set, t0], i) => {
      const y = 280, w = 840, h = 680, s = 5.0, cx = x + 236, cy = y + 384;
      demoWindow(x, y, w, h, tileA(t, 0.15, i));
      cardHead(t, 0.35 + i * 0.2, x, y, w, nm, []);
      const B = gld_bottom(cx, cy, s, set, ep(t, 0.5 + i * 0.2, 1.0 + i * 0.2), { k: prog(t, t0 - 0.4, t0 + 2.2) });
      const lx = x + 488, C0 = (p, d) => [B.X(p[0]) + d, B.Y(p[1])];
      if (set === 'off') {
        callout(t, t0 + 0.6, C0(GLD.skates[1], GLD.dot / 2 * s), 'Two dots a corner', { to: [lx, y + 156], side: 'r', color: C.ink2, tcolor: C.ink, sub: 'On a ledge in the rim', maxW: 320 });
        callout(t, t0 + 1.6, C0(gld_sdot()[0], 3.65 * s), 'Two on the lens', { to: [lx, y + 300], side: 'r', color: C.heroText, tcolor: C.heroText, sub: 'One at each end of it', maxW: 320 });
        callout(t, t0 + 2.0, C0(GLD.screws[0], 1.9 * s), 'Screws clear', { to: [lx, y + 444], side: 'r', color: C.ink2, tcolor: C.ink, sub: 'Open it without lifting a skate', maxW: 320 });
        callout(t, t0 + 2.3, C0(GLD.skates[2], GLD.dot / 2 * s), '6.5 mm dots', { to: [lx, y + 588], side: 'r', color: C.ink2, tcolor: C.ink, sub: 'POM, 0.65 mm tall', maxW: 320 });
      } else {
        callout(t, t0 + 0.6, [B.X(20.2), B.Y(GLD_HALFZ + 3)], 'Front half-moon', { to: [lx, y + 156], side: 'r', color: C.ink2, tcolor: C.ink, sub: 'Cut round the corner dots', maxW: 320 });
        callout(t, t0 + 1.6, [B.X(GLD.sensor[0] + GLD_WIN.w / 2 + 2), B.Y(GLD.sensor[1])], 'Ring round the lens', { to: [lx, y + 330], side: 'r', color: C.heroText, tcolor: C.heroText, sub: 'The skate at the lens', maxW: 320 });
        callout(t, t0 + 1.1, [B.X(20.2), B.Y(-GLD_HALFZ - 3)], 'Back half-moon', { to: [lx, y + 560], side: 'r', color: C.ink2, tcolor: C.ink, sub: 'A mirror of the front', maxW: 320 });
        /* the mirror: both straight edges the same distance from the middle of the base (F14.2) */
        const dx = B.X(-31.5), km = ep(t, t0 + 1.4, t0 + 2.0);
        for (const sg of [1, -1]) { line(dx, B.Y(0), dx, B.Y(sg * GLD_HALFZ), { color: C.mute, w: 1.5, alpha: km }); line(dx - 8, B.Y(sg * GLD_HALFZ), dx + 8, B.Y(sg * GLD_HALFZ), { color: C.mute, w: 1.5, alpha: km }); text('d', dx - 14, B.Y(sg * GLD_HALFZ / 2) + 8, { role: 'label', size: 22, color: C.ink, align: 'right', alpha: km, caps: false }); }
        line(dx - 12, B.Y(0), B.X(-GLD_WIN.w / 2 - 2.4), B.Y(0), { color: C.mute, w: 1.5, dash: [4, 4], alpha: km });
      }
    });
    source(t, 'Corner dots, screws, lens and half-moons: this deck\'s 3D shell and plate. Half-moons after the Viper V4 Pro\'s rear skate, about 53 × 24 mm, estimated from Brock\'s photo.', { t0: 3 });
  }
});

/* ============================== dot skates: more area, less sink (#10) ============================== */
const GLD_N = { four: 4, ten: 10 };
S({
  id: 'dots', ch: 'glide', theme: 'night', title: 'Dot skates: more area, less sink', settle: 9, ideas: [10],
  src: ['obsidianDots', 'gld_doc65', 'gld_skateSets'],
  draw: t => {
    header(t, 'Dot skates: more area, less sink');
    captions(t, [[0.6, 'One dot per corner is the usual dot set. On a soft pad a firm press sinks four small dots until the pad scrapes the base.'], [5.0, 'Ten dots carry the same press on two and a half times the area. The pressure falls by 60%, and so does the sink.']]);
    const F = THESEUS.mass * 9.80665 / 1000, A4 = gld_area(4), A10 = gld_area(10), p4 = F / A4 * 1000, p10 = F / A10 * 1000, cut = Math.round((1 - A4 / A10) * 100);
    /* ---- left: one dot of each set in section, on a soft pad, under the same press ---- */
    const x = LM, y = 280, w = 1000, h = 680;
    demoWindow(x, y, w, h, tileA(t, 0.15, 0));
    cardHead(t, 0.35, x, y, w, 'One dot of each set, the same press', ['derived']);
    const press = ep(t, 2.0, 3.4, E.io3), s = 40, H0 = 0.65;
    [[x + 40, '4 dots: one a corner', 1, false], [x + w / 2 + 20, 'Theseus: 10 dots', A10 / A4, true]].forEach(([cx0, nm, rel, hero], i) => {
      const cw = w / 2 - 60, mid = cx0 + cw / 2, yS = y + 470, sink = H0 * press / rel, a = ep(t, 0.6 + i * 0.2, 1.1 + i * 0.2), scrape = !hero && press > 0.995;
      text(nm, cx0 + 8, y + 118, { role: 'label', size: 21, color: hero ? C.heroText : C.mute, alpha: a });
      /* the pad: its surface dips under the dot (flat under it, easing out round it), cloth over foam */
      const surf = xx => { const d = Math.abs(xx - mid) / s - 3.25; return yS + sink * s * (d <= 0 ? 1 : Math.exp(-d / 1.4)); };
      G.save(); G.globalAlpha = a; G.beginPath(); G.moveTo(cx0, surf(cx0)); for (let xx = cx0; xx <= cx0 + cw; xx += 4) G.lineTo(xx, surf(xx)); G.lineTo(cx0 + cw, yS + 3.4 * s); G.lineTo(cx0, yS + 3.4 * s); G.closePath(); G.fillStyle = '#2C2E32'; G.fill(); G.restore();
      G.save(); G.globalAlpha = a; G.beginPath(); for (let xx = cx0; xx <= cx0 + cw; xx += 4) (xx === cx0 ? G.moveTo(xx, surf(xx)) : G.lineTo(xx, surf(xx))); G.strokeStyle = '#4A4C52'; G.lineWidth = 0.4 * s; G.stroke(); G.restore();
      /* the dot and the base it hangs from, pushed down by the press */
      const yDot = yS + sink * s, yBase = yDot - H0 * s;
      rr(mid - 3.25 * s, yDot - H0 * s, 6.5 * s, H0 * s, 6, hero ? C.hero : GLD_SKC(), null, 0, a);
      rr(cx0, yBase - 1.2 * s, cw, 1.2 * s, 4, '#3A3B40', null, 0, a);
      if (scrape) { const k = ep(t, 3.0, 3.3); for (const sd of [-1, 1]) { const xx = mid + sd * (3.25 + 2.6) * s; circle(xx, yBase + 2, 12, { color: C.bad, w: 3, alpha: k * a }); } text('The pad scrapes the base', mid, yS + 3.4 * s + 44, { role: 'label', size: 21, color: C.bad, align: 'center', alpha: ep(t, 3.0, 3.4) * a }); }
      /* the press, and the sink written beside it */
      for (const dx of [-0.32, 0, 0.32]) arrow(mid + dx * cw, yBase - 1.2 * s - 92, mid + dx * cw, yBase - 1.2 * s - 14, { color: C.mute, w: 2.5, hs: 12, alpha: ep(t, 1.6, 2.1) * a });
      rich([{ s: 'Sink', role: 'label', size: 20, color: C.mute }, { s: Math.round(100 / rel) + '%', role: 'd1', size: 44, weight: 800, color: hero ? C.heroText : C.ink, grad: hero ? C.heroGrad : null, gap: 12, tnum: true }], mid, y + 196, { align: 'center', alpha: ep(t, 2.2, 2.6) * a });
    });
    cursorAt(t, [[1.3, [x + w / 2, y + 260]], [2.0, [x + w / 2 + 4, y + 300]], [3.4, [x + w / 2 + 4, y + 312]], [8.0, [x + w / 2 + 4, y + 312]], [8.6, [x + w / 2 + 60, y + 240]]], [2.05], { a: ep(t, 1.0, 1.3) * (1 - ep(t, 8.2, 8.6)) });
    /* ---- right: the glance ---- */
    gld_head(t, 3.8, 1120, 480, '−' + cut, '%', { label: 'Pressure on the pad', size: 176, uk: 0.42, sub: 'The same weight on ten dots instead of four. Lower is better.', maxW: 700 });
    gld_ba(t, 4.2, 1120, 660, fmtN(p4, 2), fmtN(p10, 2) + ' kPa', { size: 60, who: ['4 dots', 'Theseus, 10 dots'] });
    /* the two sets, from below, small */
    const ry = 760, rh = 200, kk = tileA(t, 4.6, 0);
    demoWindow(1120, ry, RM - 1120, rh, kk);
    [[1120 + 150, 'four', fmtN(A4, 0) + ' mm²'], [1120 + 470, 'ten', fmtN(A10, 0) + ' mm²']].forEach(([cx, n, lab], i) => {
      const s2 = 1.45, X = xx => cx + xx * s2, Y = z => ry + rh / 2 - z * s2;
      gld_shape(() => { KEY_PTS.forEach(([xx, yy], j) => (j ? G.lineTo(cx + xx * s2, ry + rh / 2 + yy * s2) : G.moveTo(cx + xx * s2, ry + rh / 2 + yy * s2))); G.closePath(); }, '#26272C', inkA(0.35), 1.5, kk);
      const dots = n === 'four' ? [0, 3, 4, 7].map(j => GLD.skates[j]) : GLD.skates.concat(gld_sdot());
      dots.forEach((p, j) => circle(X(p[0]), Y(p[1]), 3.25 * s2, { fill: n === 'ten' && j >= 8 ? C.hero : GLD_SKC(), alpha: kk }));
      text(lab, cx + 60, ry + rh / 2 + 8, { font: 'disp', size: 30, weight: 800, color: i ? C.heroText : C.ink2, alpha: kk });
      text(i ? 'Theseus' : 'One a corner', cx + 60, ry + rh / 2 - 34, { role: 'label', size: 19, color: i ? C.heroText : C.mute, alpha: kk });
    });
    source(t, 'p = F ÷ A: the mouse\'s ' + THS.massG + ' on 6.5 mm dots (X-Raypad Obsidian size). Sink in proportion to pressure, the four-dot set drawn at Brock\'s scrape; the dot is his 0.65 mm.', { t0: 3 });
  }
});

/* ============================== the sensor: the PixArt PAW3970 (#76) ============================== */
/* Brock, 22:00 (it replaces F18.3's unnamed part): Theseus uses the PixArt PAW3970, which he identifies as the Viper V4 Pro's
   sensor (Razer sells it as the Focus Pro 50K Gen-3 and prints no PixArt name), with the V4 Pro's own figures (igor'sLAB; Razer's
   page). Against it, the PAW3395 by its datasheet: the part in the ULX and the Sora V2, and eight more of the mice in
   research/data/mice.json. The PAW3950 is about as common there, so the slide names the mice rather than saying "most".
   Every row is a win, so the bars run straight, the old value kept beside the new (F16.1) */
const GLD_SPEC = [
  { lab: 'Max speed', unit: 'ips', a: 650, b: 930, max: 1000 },
  { lab: 'Acceleration', unit: 'G', a: 50, b: 90, max: 100 },
  { lab: 'Top CPI', unit: 'CPI', a: 26000, b: 50000, max: 56000 }
];
S({
  id: 'sensor', ch: 'glide', theme: 'paper', title: 'Next-gen sensor: PixArt PAW3970', settle: 10, ideas: [76],
  src: ['gld_paw3395', 'gld_next', 'gld_igorV4', 'gld_razerFocus', 'gld_brock'],
  draw: t => {
    header(t, 'Next-gen sensor: PixArt PAW3970');
    captions(t, [[0.6, 'The ULX and the Sora V2 track on the PAW3395, PixArt\'s flagship of 2022, and it struggles on some glass pads.'], [5.4, 'Theseus takes the PAW3970, the sensor inside the Viper V4 Pro: 930 ips, 90 G and 50,000 CPI.']]);
    const f = GLD_SPEC[0], gain = Math.round((f.b / f.a - 1) * 100);
    gld_head(t, 3.4, LM, 500, '+' + gain, '%', { label: 'Tracking speed', size: 176, uk: 0.42, sub: 'The PAW3970 against the PAW3395 in the ULX and Sora V2. Higher is better.', maxW: 560 });
    gld_ba(t, 3.8, LM, 700, fmt(f.a), fmt(f.b) + ' ips', { size: 60, who: ['PAW3395', 'Theseus, PAW3970'] });
    /* the specs, row by row: the PAW3395 in grey by its datasheet, the PAW3970 in blue by the V4 Pro's figures */
    const x = 720, y = 280, w = RM - x, h = 460;
    demoWindow(x, y, w, h, tileA(t, 0.15, 0));
    cardHead(t, 0.35, x, y, w, 'PAW3395 against PAW3970. Higher is better', [{ ev: 'datasheet', by: 'PixArt' }, { ev: 'claim', by: 'Razer' }]);
    const bx = x + 260, bw = w - 260 - 240;
    GLD_SPEC.forEach((r, i) => {
      const yy = y + 130 + i * 108, a = ep(t, 0.8 + i * 0.3, 1.2 + i * 0.3), k = ep(t, 1.0 + i * 0.3, 1.9 + i * 0.3, E.snap), kb = ep(t, 2.2 + i * 0.25, 3.1 + i * 0.25, E.snap), La = bw * r.a / r.max, Lb = bw * r.b / r.max;
      text(r.lab, x + 32, yy + 10, { role: 'h3', size: 30, color: C.ink, alpha: a });
      text(r.unit, x + 32, yy + 44, { role: 'label', size: 19, color: C.faint, alpha: a, caps: r.unit !== 'ips' });
      rr(bx, yy - 22, Math.max(14, La * k), 18, 9, C.comp, null, 0, a);
      text(fmt(Math.round(r.a * k)), bx + La * k + 14, yy - 6, { role: 'num', size: 24, weight: 700, color: C.ink2, alpha: a, tnum: true });
      rr(bx, yy + 10, Math.max(14, lerp(La, Lb, kb) * k), 18, 9, C.hero, null, 0, a);
      text(fmt(Math.round(lerp(r.a, r.b, kb))), bx + lerp(La, Lb, kb) * k + 14, yy + 26, { role: 'num', size: 26, weight: 800, color: C.heroText, alpha: a, tnum: true });
      text('+' + Math.round((r.b / r.a - 1) * 100) + '%', x + w - 32, yy + 26, { role: 'num', size: 28, weight: 800, color: C.heroText, align: 'right', alpha: a * kb });
    });
    legend(t, 1.4, x + w - 32, y + h - 34, [{ kind: 'comp', label: 'PAW3395, 2022' }, { kind: 'hero', label: 'Theseus: PAW3970 (the Viper V4 Pro\'s sensor; Brock)' }], { size: 19, gap: 26, align: 'right' });
    /* where the figures come from, and the words in plain terms */
    const ny = y + h + 40, nw = (w - 40) / 2;
    sourceBox(t, 5.6, x, ny, nw, 'igor\'sLAB', 'The Viper V4 Pro\'s sensor: 50,000 CPI in steps of 1, 930 ips, 90 G, true 8,000 Hz and 99.8% resolution accuracy, Razer\'s figures.', { h: 960 - ny });
    glossBox(t, 5.9, x + nw + 40, ny, nw, 'Ips and G', 'How fast and how hard you can swing the mouse before it loses track: inches a second, and multiples of gravity.', { h: 960 - ny });
    source(t, 'PAW3395: PixArt\'s datasheet. PAW3970: Brock\'s name for the Viper V4 Pro\'s Focus Pro 50K Gen-3, with Razer\'s figures.', { t0: 3, maxW: 580, y: 960 });
  }
});

/* ============================== full reports, no smoothing (the V4 Pro step for #76) ============================== */
S({
  id: 'gld_reports', ch: 'glide', theme: 'night', title: 'Full 16-bit reports, no smoothing', settle: 10, three: ['pcb'], ideas: [76, 37],
  src: ['gld_tpuV4', 'xbabSmooth', 'gld_razerFocus', 'gld_paw3395'],
  draw: t => {
    header(t, 'Full 16-bit reports, no smoothing');
    captions(t, [[0.6, 'TechPowerUp found the Viper V4 Pro sends its wireless counts in 12 bits, and smooths motion for about 1.5 s after each lift.'], [5.4, 'Theseus sends full 16-bit counts and stops smoothing the moment the lens lands. I\'ll publish the test that shows both.']]);
    /* ---- the glance ---- */
    gld_head(t, 3.6, LM, 480, '16', '×', { label: 'Counts a report can carry', size: 176, uk: 0.5, ucaps: false, sub: '±32,767 in 16 bits, against ±2,047 in 12. Higher is better.', maxW: 560 });
    gld_ba(t, 4.0, LM, 712, '1,500', '0 ms', { size: 64, label: 'Smoothing after a lift', who: ['Viper V4 Pro', 'Theseus'] });
    /* the board from above, in 3D (the 2D twin in 2D mode): the module and the snap-on lens */
    const bx = LM, by0 = 780, bw0 = 560, bh0 = 180;
    demoWindow(bx, by0, bw0, bh0, tileA(t, 0.15, 2));
    view3D('pcb', t, bx + 8, by0 + 8, bw0 - 16, bh0 - 16, { view: 'threeQuarter', view2d: 'top', target: [0, 6.2, 1.12], zoom: in2D(5.6, 8.2), yaw: 0.12 * Math.sin(t * 0.35), explode: 0, xray: 0 }, { alpha: ep(t, 0.4, 0.9) });
    /* ---- right top: how fast a hand can move before a report runs out of digits ---- */
    const rx = 720, rw = RM - rx, ch = 400, ly = 280;
    demoWindow(rx, ly, rw, ch, tileA(t, 0.15, 0));
    cardHead(t, 0.5, rx, ly, rw, 'Fastest hand a report can carry, at 1 kHz', ['derived']);
    const cx0 = rx + 120, cw0 = rw - 120 - 330, cy0 = ly + 100, ch0 = 210, xs = [400, 51200], ys = [10, 100000];
    const pts = (bits, hz) => { const out = []; for (let c = 400; c <= 51200 * 1.0001; c *= 1.12) out.push([c, Math.min(1e5, ((1 << (bits - 1)) - 1) * hz / c)]); out.push([51200, ((1 << (bits - 1)) - 1) * hz / 51200]); return out; };
    lineChart(t, {
      x: cx0, y: cy0, w: cw0, h: ch0, t0: 0.8, xr: xs, yr: ys, xlog: true, ylog: true, xticks: [400, 1600, 6400, 25600], yticks: [10, 100, 1000, 10000, 100000], xfmt: v => fmt(v), yfmt: v => (v >= 1000 ? fmt(v / 1000) + 'k' : String(v)),
      series: [
        { name: 'Rated 930 ips', pts: [[400, 930], [51200, 930]], color: C.comp, dash: [6, 5], w: 2, labelAt: 400, ldy: 26 },
        { name: '12-bit, V4 Pro', pts: pts(12, 1000), color: C.comp },
        { name: '16-bit, Theseus', pts: pts(16, 1000), hero: true }
      ]
    });
    text('CPI', cx0 + cw0 + 18, cy0 + ch0 + 34, { role: 'label', size: 19, color: C.mute, alpha: ep(t, 1.0, 1.4) });
    text('ips. Higher is better', cx0 - 14, cy0 - 18, { role: 'label', size: 19, color: C.ink2, alpha: ep(t, 1.0, 1.4) });
    { const k = ep(t, 3.0, 3.5), xc = cx0 + cw0 * Math.log10(2201 / 400) / Math.log10(51200 / 400), yc = cy0 + ch0 - ch0 * Math.log10(930 / 10) / 4;
      circle(xc, yc, 7 * k, { fill: C.red }); circle(xc, yc, 14 * k, { color: C.red, w: 1.5, alpha: 0.5 * k });
      text('Above 2,201 CPI a 12-bit report can\'t carry 930 ips.', rx + 32, ly + ch - 26, { role: 'small', size: 25, weight: 600, color: C.red, alpha: k }); }
    /* ---- right bottom: smoothing after the mouse lands ---- */
    const sy = ly + ch + 40, sh = 960 - sy;
    demoWindow(rx, sy, rw, sh, tileA(t, 0.15, 1));
    cardHead(t, 0.8, rx, sy, rw, 'Smoothing after a lift, ms. Lower is better', []);
    [['Viper V4 Pro, wireless', 'TechPowerUp', 1500, false], ['PAW3950 and 3955 default', 'XBAB, 16 frames', 450, false], ['XBAB XA25', 'XBAB, 2 frames', 12, false], ['Theseus', 'Target', 0, true]].forEach(([nm, sub, v, hero], i) => {
      const yy = sy + 96 + i * 40, tt = hero ? 5.4 : 1.2 + i * 0.2, a = ep(t, tt, tt + 0.4), bxx = rx + 380, bww = rw - 380 - 360;
      if (a <= 0.003) return;
      text(nm, rx + 32, yy + 8, { role: 'small', size: 25, weight: hero ? 800 : 600, color: hero ? C.heroText : C.ink, alpha: a });
      const k = ep(t, tt + 0.1, tt + 0.9, E.snap), bl = Math.max(12, bww * v / 1500 * k);
      if (v > 0) rr(bxx, yy - 6, bl, 12, 6, C.comp, null, 0, a); else heroMark(bxx + 8, yy, 10, a);
      text(fmt(Math.round(v * k)) + ' ms', bxx + (v > 0 ? bl + 14 : 26), yy + 8, { role: 'num', size: 23, weight: 700, color: hero ? C.heroText : C.ink, alpha: a });
      text(sub, RM - 32, yy + 7, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: a });
    });
    source(t, 'TechPowerUp, Viper V4 Pro review (12-bit counts, smoothing). XBAB on PAW3950 and 3955 smoothing. Curves: counts × 1,000 Hz ÷ CPI.', { t0: 3, y: 992 });
  }
});

/* ============================== where the sensor sits (#27) ============================== */
S({
  id: 'gld_position', ch: 'glide', theme: 'paper', title: 'Sensor position: the centre wins', settle: 10, ideas: [27],
  src: ['gld_kim20', 'chi2020', 'gld_baek26', 'gld_shell3d', 'gld_brock'],
  draw: t => {
    header(t, 'Sensor position: the centre wins');
    captions(t, [[0.6, 'I wanted the sensor further forward. The best study of it found the centre beat both the front and the rear, across 14 gamers.'], [5.6, 'Setting each player\'s own best spot added about 4% more. So Theseus defaults to the centre, and the software can find yours.']]);
    const gain = Math.round((5.77 / 5.16 - 1) * 100);
    gld_head(t, 3.4, LM, 500, '+' + gain, '%', { label: 'Throughput at the centre', size: 176, uk: 0.42, sub: 'Against the front, across 14 gamers. Higher is better.', maxW: 560 });
    gld_ba(t, 3.8, LM, 690, '5.16', '5.77 bits/s', { size: 60, who: ['Front', 'Centre, Theseus'] });
    /* the positions on the key plan: front, centre, rear, 14.4 mm steps */
    const lx = LM, ly = 780, lw0 = 560, lh0 = 180;
    demoWindow(lx, ly, lw0, lh0, tileA(t, 0.15, 3));
    /* drawn at 2.8 px per mm so the three marks sit about 100 px apart and their names never run together (review item 19) */
    { const kx = lx + lw0 / 2, ky = ly + 72, s = 2.8, ko = ep(t, 0.5, 1.0), mk = ep(t, 1.0, 1.4);
      gld_shape(() => { KEY_PTS.forEach(([xx, yy], j) => (j ? G.lineTo(kx + yy * s, ky + xx * s * 0.62) : G.moveTo(kx + yy * s, ky + xx * s * 0.62))); G.closePath(); }, TH ? '#E4E3DE' : '#26272C', inkA(0.4), 1.5, ko);
      const zNow = kf(t, [[1.3, 36], [2.0, 36], [2.7, -36], [3.3, -36], [4.0, 0]], E.io3);
      for (const [z, nm] of [[36, 'Front'], [0, 'Centre'], [-36, 'Rear']]) { const xx = kx - z * s; line(xx, ky - 26, xx, ky + 26, { color: z === 0 ? C.heroText : C.faint, w: 2, alpha: mk }); text(nm, xx, ly + lh0 - 20, { role: 'label', size: 19, color: z === 0 ? C.heroText : C.mute, align: 'center', alpha: mk }); }
      circle(kx - zNow * s, ky, 9 * mk, { fill: C.hero });
      text('Nose', kx - 59.4 * s - 10, ky + 7, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: ko }); }
    /* right: the study's numbers, Theseus's position in blue */
    const rx = 720, rw = RM - rx, cw = (rw - 40) / 2, y = 280;
    [[rx, 'Throughput. Higher is better', [5.16, 5.77, 4.97], [0, 6.5], [0, 2, 4, 6], ['−10.7%', 'Theseus', '−14.0%'], 2], [rx + cw + 40, 'Path deviation. Lower is better', [22.1, 18.0, 21.6], [0, 25], [0, 10, 20], ['+22.5%', 'Theseus', '+19.9%'], 1]].forEach(([x, lab, vals, yr, ticks, deltas, dec], j) => {
      demoWindow(x, y, cw, 440, tileA(t, 0.15, j));
      cardHead(t, 0.5 + j * 0.2, x, y, cw, lab, []);
      barChart(t, { x: x + 90, y: y + 120, w: cw - 120, h: 170, t0: 0.9 + j * 0.3, yr, ticks, dec, frame: false, foot: false, vsize: 30, nsize: 26, barW: 0.5,
        bars: ['Front', 'Centre', 'Rear'].map((nm, i) => ({ name: nm, sub: deltas[i], v: vals[i], hero: i === 1 })) });
    });
    /* each player's own best spot: +4.1% over the centre */
    const cy = y + 480, chh = 960 - cy;
    demoWindow(rx, cy, rw, chh, tileA(t, 0.15, 2));
    cardHead(t, 1.0, rx, cy, rw, 'Each player\'s own best spot', []);
    [['At the centre', 5.798, false, 4.8], ['At their own best position', 6.034, true, 5.6]].forEach(([nm, v, hero, t0], i) => {
      const yy = cy + 96 + i * 44, a = ep(t, t0, t0 + 0.4), bx = rx + 420, bw = rw - 420 - 320;
      text(nm, rx + 32, yy + 8, { role: 'small', size: 25, weight: hero ? 800 : 600, color: hero ? C.heroText : C.ink, alpha: a });
      gld_bar(t, t0 + 0.1, bx, yy, bw, v, 6.5, { hero, color: hero ? null : C.comp, bh: 12, alpha: a });
      text(fmtN(v, 3) + ' bits/s' + (hero ? ', +4.1%' : ''), RM - 32, yy + 8, { role: 'num', size: 23, weight: 700, color: hero ? C.heroText : C.ink, align: 'right', alpha: a });
    });
    source(t, 'Kim, Lee, van Gemert & Oulasvirta, "Optimal Sensor Position for a Computer Mouse", CHI 2020: 14 gamers, a mouse with a sliding sensor, positions 14.4 mm apart.', { t0: 3, y: 992 });
  }
});

/* ============================== set in the mouse: lift-off, virtual position, X and Y (#87) ============================== */
S({
  id: 'gld_soft', ch: 'glide', theme: 'night', title: 'Set in the mouse: lift-off, position, X and Y', settle: 10, ideas: [87, 'lod', '{XY CPI}'],
  src: ['gld_kim20', 'gld_baek26', 'gld_paw3395', 'gld_akko3955', 'gld_razerFocus', 'gld_doc65', 'gld_brock'],
  draw: t => {
    header(t, 'Set in the mouse: lift-off, position, X and Y');
    captions(t, [[0.6, 'Three settings that live in the mouse, not the PC: when it stops tracking, where the sensor seems to sit, and how each axis counts.'], [5.6, 'Lift-off goes in 0.1 mm steps, set apart from landing. Moving the sensor needs a second one, so that is an option, not a default.']]);
    gld_head(t, 3.6, LM, 500, '10', '×', { label: 'Finer lift-off steps', size: 176, uk: 0.5, ucaps: false, sub: '0.1 mm steps, against the PAW3395\'s 1 and 2 mm. Shorter is finer.', maxW: 560 });
    gld_ba(t, 4.0, LM, 690, '1 mm', '0.1 mm', { size: 64, who: ['PAW3395', 'Theseus'] });
    const y = 280, h = 680, gap = 40, X0 = 720, w = (RM - X0 - gap) / 2;
    /* 1. lift-off: one threshold going up, another coming down, in 0.1 mm steps */
    { const x = X0; demoWindow(x, y, w, h, tileA(t, 0.15, 0));
      cardHead(t, 0.4, x, y, w, 'Lift-off and landing, set apart', []);
      const padY = y + 330, S2 = 84, up = 1.2, dn = 0.8, ph = cyc(t, 1.2, 4.0), hgt = ph < 0 ? 0 : 1.6 * Math.pow(Math.sin(Math.PI * ph), 2), rising = ph >= 0 && ph < 0.5, tracking = rising ? hgt < up : hgt < dn;
      line(x + 32, padY, x + w - 32, padY, { color: C.ink2, w: 2, alpha: ep(t, 0.7, 1.1) });
      text('Pad', x + w - 32, padY + 28, { role: 'label', size: 19, color: C.mute, align: 'right', alpha: ep(t, 0.7, 1.1) });
      [[up, 'Lift-off'], [dn, 'Landing']].forEach(([v, nm], i) => { const yy = padY - v * S2, a = ep(t, 1.0 + i * 0.2, 1.4 + i * 0.2); line(x + 100, yy, x + w - 32, yy, { color: C.heroText, w: 1.5, dash: [6, 5], alpha: a }); text(nm + ' ' + fmtN(v, 1) + ' mm', x + w - 32, yy - 10, { role: 'label', size: 19, color: C.heroText, align: 'right', alpha: a }); });
      for (let k2 = 0; k2 <= 12; k2++) { const yy = padY - (0.6 + k2 * 0.1) * S2; line(x + 44, yy, x + (k2 % 5 ? 58 : 70), yy, { color: C.faint, w: 1.2, alpha: ep(t, 1.4, 1.8) }); }
      const mx = x + w / 2 - 20, my = padY - hgt * S2, ka = ep(t, 0.8, 1.2);
      rr(mx - 80, my - 44, 160, 38, 8, TH ? '#2a2b2e' : '#3a3b41', null, 0, ka);
      rr(mx - 72, my - 6, 144, 6, 3, '#d9d7d0', null, 0, ka);
      gld_lamp(x + 40, y + 116, tracking ? 'Tracking' : 'Stopped', tracking, tracking ? C.hero : C.red, ep(t, 1.2, 1.6));
      text('Ticks: 0.1 mm', x + 40, y + 154, { role: 'label', size: 19, color: C.faint, alpha: ep(t, 1.4, 1.8) });
      const by = y + 420, rowsL = [['PAW3395', 1.0, { ev: 'datasheet', by: 'PixArt' }], ['PAW3955', 0.1, { ev: 'claim', by: 'Akko' }], ['Theseus', 0.1, null]];
      text('Step, mm. Shorter is finer', x + 32, by, { role: 'label', size: 20, color: C.ink2, alpha: ep(t, 2.0, 2.4) });
      rowsL.forEach(([nm, v, ev], i) => {
        const yy = by + 52 + i * 56, a = ep(t, 2.2 + i * 0.2, 2.6 + i * 0.2), hero = nm === 'Theseus', bx = x + 210, bw = w - 210 - 120;
        text(nm, x + 32, yy + 8, { role: 'small', size: 25, weight: hero ? 800 : 600, color: hero ? C.heroText : C.ink, alpha: a });
        const bl = Math.max(10, bw * v * ep(t, 2.3 + i * 0.2, 3.0 + i * 0.2, E.snap)); rr(bx, yy - 7, bl, 14, 7, hero ? C.hero : C.comp, null, 0, a);
        text(fmtN(v, 1), bx + bl + 12, yy + 8, { role: 'num', size: 23, weight: 700, color: hero ? C.heroText : C.ink, alpha: a });
        if (ev) pill(x + 32, yy + 34, ev.ev, a, { by: ev.by });
      });
    }
    /* 2. virtual position: the mouse turns about the wrist, so a point further forward moves further */
    { const x = X0 + w + gap, hh = 360; demoWindow(x, y, w, hh, tileA(t, 0.15, 1));
      cardHead(t, 0.6, x, y, w, '#87 Virtual position', [{ ev: 'measured', by: 'Kim et al. 2020' }]);
      const ang = 0.2 * Math.sin(Math.max(0, t - 1.0) * 1.1) * ep(t, 1.0, 1.6), kpS = 1.5, px = x + 110, py = y + hh - 40;
      const rot = (dx, dy) => [px + dx * Math.cos(ang) - dy * Math.sin(ang), py + dx * Math.sin(ang) + dy * Math.cos(ang)];
      const mc = rot(0, -120);
      part(mc[0], mc[1], kpS, () => keyPlanMM({ hi: [] }), { alpha: ep(t, 0.4, 0.9), rot: ang });
      for (const [dz, col] of [[36, C.ink2], [0, C.hero], [-36, C.ink2]]) { const q = rot(0, -120 - dz * kpS); circle(q[0], q[1], dz ? 6 : 8, { fill: col, alpha: ep(t, 1.0, 1.4) }); }
      circle(px, py, 6, { fill: C.ink2, alpha: ep(t, 0.6, 1.0) }); text('Wrist', px + 14, py + 8, { role: 'label', size: 19, color: C.mute, alpha: ep(t, 0.6, 1.0) });
      text('Two sensors place the point you aim with anywhere along the mouse, from front to rear.', x + 230, y + 130, { role: 'small', size: 25, color: C.ink2, maxW: w - 262, lh: 1.3, alpha: ep(t, 3.0, 3.4) });
      text('Calibration: 1 h → 5 min', x + 230, y + 300, { role: 'label', size: 20, color: C.mute, alpha: ep(t, 3.3, 3.7) });
    }
    /* 3. X and Y apart: a round hand path turns into an oval when the axes count differently */
    { const x = X0 + w + gap, yy = y + 400, hh = h - 400; demoWindow(x, yy, w, hh, tileA(t, 0.15, 2));
      cardHead(t, 0.8, x, yy, w, 'X and Y apart', []);
      const cxL = x + 96, cxR = x + 268, cyy = yy + 150, R = 56, ang = (t - 1.0) * 1.4, k = ep(t, 1.0, 1.5), cx = 800, cyc2 = lerp(800, 640, ep(t, 2.0, 3.0, E.io3));
      circle(cxL, cyy, R, { color: C.faint, w: 1.5, dash: [4, 4], alpha: k });
      G.save(); G.globalAlpha = k; G.beginPath(); G.ellipse(cxR, cyy, R * cx / 800, R * cyc2 / 800, 0, 0, TAU); G.setLineDash([4, 4]); G.strokeStyle = C.heroText; G.lineWidth = 1.5; G.stroke(); G.restore();
      circle(cxL + R * Math.cos(ang), cyy + R * Math.sin(ang), 7, { fill: C.ink2, alpha: k });
      circle(cxR + R * cx / 800 * Math.cos(ang), cyy + R * cyc2 / 800 * Math.sin(ang), 7, { fill: C.hero, alpha: k });
      arrow(cxL + R + 14, cyy, cxR - R - 12, cyy, { color: C.mute, w: 2, hs: 10, alpha: k });
      text('Hand', cxL, cyy + R + 34, { role: 'label', size: 19, color: C.mute, align: 'center', alpha: k });
      text('Cursor', cxR, cyy + R + 34, { role: 'label', size: 19, color: C.heroText, align: 'center', alpha: k });
      rich([{ s: 'X', role: 'label', size: 21, color: C.mute }, { s: '800', role: 'num', size: 28, weight: 700, color: C.ink, gap: 10 }], x + 372, cyy - 30, { alpha: ep(t, 2.0, 2.4) });
      rich([{ s: 'Y', role: 'label', size: 21, color: C.mute }, { s: String(Math.round(cyc2)), role: 'num', size: 28, weight: 700, color: C.heroText, gap: 10, tnum: true }], x + 372, cyy + 14, { alpha: ep(t, 2.0, 2.4) });
      text('1-count steps', x + 372, cyy + 52, { role: 'label', size: 19, color: C.mute, alpha: ep(t, 2.6, 3.0) });
    }
    source(t, 'PixArt (PAW3395: lift cut-off 1 or 2 mm). Akko (PAW3955: 11 levels, 0.7 to 1.7 mm). Kim et al., CHI 2020; Baek & Kim 2026. 0.1 mm steps: Brock. Heights drawn to show the idea.', { t0: 3, y: 992 });
  }
});
