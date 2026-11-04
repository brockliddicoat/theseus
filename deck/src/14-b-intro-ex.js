/* ============================================================================================
   INTRO (chapter code ntr). The first impression, in this order:
     cover (the 3D hero) · thesis (how every number is labelled) · targets, targets2 (the bar) · flagships
     · zerograms · weightgap (listed against weighed) · pricefront (what a gram costs) · market (the empty corner)
     · budget (the 29 g decision) · map (seven areas on the exploded 3D shell)
   The close is in 10-i-close.js. Data comes from research/data (RDATA, read with rv / evOf / exMouse / exWeight from
   14-a-exdata.js). Theseus numbers are PROPOSAL (a target) or PROJECTED (a forecast, formula on screen).
   Validation report 2026-11-03 applied: the sensor is a "next-gen PixArt FrameSync-class sensor (proposal)", the
   Starlight X has no hour rating, the module is the Raytac AN54LM-20A, and the 29 g budget is an open decision.
   ============================================================================================ */
Object.assign(SRC, {
  exPrices: { t: 'US list prices: maker stores and product pages (Pulsar, Ninjutso, Lamzu, Keychron, Finalmouse, Razer, Logitech, WLMOUSE), via research/data/mice.json', n: 'A price range is plotted at its lowest price. Prices as listed when collected, 2026.' },
  ntrB2g: { t: 'Back2Gaming, Finalmouse Starlight X review: 41.58 g weighed; Finalmouse does not publish an hour rating', u: 'https://www.back2gaming.com/review/finalmouse-starlight-x-nightfall-wireless-mouse/' },
  ntrRtSlx: { t: 'RTINGS, Finalmouse Starlight X review: 41.7 g default weight (2026-10-22)', u: 'https://www.rtings.com/mouse/reviews/finalmouse/starlight-x' },
  ntrEloSlx: { t: 'EloShapes, Finalmouse Starlight X: 38 g as listed by Finalmouse', u: 'https://www.eloshapes.com/mouse/compare?p=finalmouse-starlight-x' },
  ntrTpuV4: { t: 'TechPowerUp, Razer Viper V4 Pro: 306 mAh at 3.87 V (1.184 Wh), about 40 h at 8 kHz, 0.169 A charging, 79 µs click latency wired at 8 kHz', u: 'https://www.techpowerup.com/review/razer-viper-v4-pro/', n: 'Values as recorded in the 2026-11-03 validation report; TechPowerUp refused this session.' },
  ntrXbabClick: { t: 'XBAB Tech on X, 2026-06-30: click latency on a Beagle USB 480 analyzer, XA25 72 µs against Endgame Gear OP1 8k v2 320 µs (NC release, mouse still, n = 500 each); a maker testing its own mouse and a rival', u: 'https://x.com/xbabtech/status/2071972219211985258' },
  ntrJauch: { t: 'Endrich (Jauch distributor), lithium-polymer packs, capacity and mass per part: LP402025JU 140 mAh 5 g, LP502030JH 250 mAh 7.5 g, LP422339JU 330 mAh 8 g, LP402535JU 370 mAh 8 g (rounded listing)', u: 'https://www.endrich.com/en/product-categories/accus-batteries/lithium-ion-cells/lithium-polymer-batteries?page=2', n: 'Farnell lists LP402535JU at 380 mAh; the lower figure is used.' },
  ntrGpx2: { t: 'PC Gamer, Logitech G Pro X Superlight 2 review: 95 h, $159 (2023)', u: 'https://www.pcgamer.com/logitech-g-pro-x-superlight-2-gaming-mouse-review/' },
  ntrGpx2c: { t: 'Logitech, Pro X Superlight 2c: 51 g, up to 95 h', u: 'https://www.logitechg.com/en-us/shop/p/pro-x-superlight-2c' },
  ntrDaV4: { t: 'Razer, DeathAdder V4 Pro: 150 h (report rate not stated)', u: 'https://www.razer.com/gaming-mice/razer-deathadder-v4-pro' },
  ntrZowie: { t: 'ZOWIE, EC2-DW and U2-DW: 80 h at 1 kHz, 60 g', u: 'https://zowie.benq.com/en-us/mouse/ec2-dw.html' },
  ntrXiaomi: { t: 'Notebookcheck, Xiaomi Gaming Mouse 2: 530 mAh, 160 h at 1 kHz, about 58 g', u: 'https://www.notebookcheck.net/Xiaomi-launches-new-affordable-8K-wireless-gaming-mouse-with-flagship-PixArt-sensor.1293650.0.html' },
  ntrKeychron: { t: 'Keychron, G3: 44 g, up to 160 h', u: 'https://www.keychron.com/products.json' },
  ntrRazerV4: { t: 'Razer, Viper V4 Pro: $159.99 US list', u: 'https://www.razer.com/gaming-mice/razer-viper-v4-pro' },
  ntrStores: { t: 'Maker stores: Finalmouse Starlight X $179, Ninjutso Sora V3 $119.99, Endgame Gear OP1 8k v2 $89.99, XBAB XA25 $169', u: 'https://ninjutso.com/products.json' },
  ntrScan: { t: 'The shape on screen is a placeholder: the Ninjutso Sora V2/V3, from Brock\'s own 3D scan (refs/scan, local only)', u: '' }
});

/* ---------- shared helpers ---------- */
const NTR = { primed: typeof WeakSet !== 'undefined' ? new WeakSet() : null };
/** a research field of a mouse: { v, ev } from its first entry (lists put the strongest evidence first) */
function ntr_fv(id, k) { const m = exMouse(id); if (!m || m[k] == null) return null; const x = Array.isArray(m[k]) ? m[k][0] : m[k]; const v = rv(x); return v == null ? null : { v, ev: evOf(x) }; }
/** the loads every Theseus battery forecast uses: a Viper V4 Pro's cell (TechPowerUp) over Razer's 180 h (1 kHz) and TechPowerUp's ~40 h (8 kHz) */
function ntr_loads() {
  const mp = (RD.batteries || {}).mouse_power_draw || [], r = mp.find(x => /cell energy/i.test(x.case || '')), wh = (r && rv(r.value)) || 1.184;
  const h1 = (ntr_fv('razer-viper-v4-pro', 'battery_claim_1k_h') || {}).v || 180, h8 = (ntr_fv('razer-viper-v4-pro', 'battery_measured_h') || {}).v || 40;
  return { wh, h1, h8, w1: wh / h1, w8: wh / h8 };
}
/** a Jauch pack from the distributor family: { part, mAh, g, wh } */
function ntr_pack(part) { const f = ((RD.batteries || {}).jauch_lipo_family || {}).rows || [], r = f.find(x => x.part === part); return r ? { part, mAh: rv(r.capacity), g: rv(r.mass), wh: rv(r.energy_Wh) } : null; }
/** the XA25 as XBAB weighed it, part by part */
function ntr_xa25() { const b = ((RD.weights || {}).breakdowns || []).find(x => /XA25/.test(x.mouse)); return b ? b.parts.map(p => ({ name: p.part, g: rv(p.mass) })) : null; }
/** a 3D scene caches its framing (and so what zoom means) from whatever state its first render had. Give each new scene
   instance one render of the mouse at rest first, so an exploded first frame doesn't shrink every later shot. The instance is
   the key: R3D frees idle scenes and builds them again, and a rebuilt scene needs priming again */
function ntr_prime(key, t, w, h) {
  if (V2D.on || typeof R3D === 'undefined' || !R3D.has(key) || !NTR.primed) return;
  const th = TH ? 'paper' : 'night', e = R3D.prepare(key, th);
  if (!e || !e.ready || e.error || NTR.primed.has(e)) return;
  NTR.primed.add(e);
  const k = (APP.scale || 1) * (APP.dpr || 1);
  try { R3D.render(key, t, { explode: 0, xray: 0 }, Math.max(64, Math.round(w * k)), Math.max(36, Math.round(h * k)), th); } catch (err) { console.error('ntr_prime', err); }
}
/** a chip in the Theseus yellow: mono caps on a yellow block */
function ntr_chip(s, x, y, a = 1, o = {}) { return rich([{ s, role: 'label', size: o.size || 21, color: C.onHero, chip: C.heroChip }], x + 7, y, { alpha: a, align: o.align }); }
/** a short arrowhead pointing along (dx, dy) at (x, y) */
function ntr_head(x, y, dx, dy, s, col, a = 1) { const l = Math.hypot(dx, dy) || 1, ux = dx / l, uy = dy / l; G.save(); G.globalAlpha = a; G.fillStyle = col; G.beginPath(); G.moveTo(x, y); G.lineTo(x - ux * s - uy * s * 0.5, y - uy * s + ux * s * 0.5); G.lineTo(x - ux * s + uy * s * 0.5, y - uy * s - ux * s * 0.5); G.closePath(); G.fill(); G.restore(); }
/** diagonal hatching inside a rectangle, for a region nobody has data for */
/** the map's anchors on the flat, exploded elevation: one point on the part each chapter rebuilds */
function ntr_mapAt(st, box) {
  const at = (re, f) => v2dAt('shell', st, box, re, f);
  return {
    click: at(/^explodeL\/.*\/triggerL$/, 'c'), surface: at(/\/wheel\/tread$/, [0.5, 0.75, 0.5]), elec: at(/^body\/lens/, [0.5, 0.5, 0.5]),
    glide: at(/DotSkate\/glide$/, [0.5, 0.2, 0.5]), shape: at(/^body\/body$/, [0.5, 0.97, 0.36]), shell: at(/^body\/body$/, [1, 0.42, 0.5]), own: at(/M2Screw\/head$/, [0.5, 0.5, 0.5])
  };
}
function ntr_hatch(x, y, w, h, col, a = 1, step = 14) { if (a <= 0.003 || w <= 0 || h <= 0) return; G.save(); G.beginPath(); G.rect(x, y, w, h); G.clip(); G.globalAlpha = a; G.strokeStyle = col; G.lineWidth = 1.2; G.beginPath(); for (let s = -h; s < w + h; s += step) { G.moveTo(x + s, y + h); G.lineTo(x + s + h, y); } G.stroke(); G.restore(); }

/* ============================== 01. cover: THESEUS, and the shell assembling out of its parts ============================== */
const NTR_COV = { size: 280, x0: 64, yb: 462, v: [1222, 120, 730, 690], zoom: [1.06, 1.2] };
S({
  id: 'cover', first: true, ch: 'intro', theme: 'night', chrome: false, title: 'Theseus: in pursuit of an objectively better mouse', settle: 8, three: ['shell'],
  sfx: [[2.15, 'tick'], [2.35, 'tick'], [2.55, 'tick'], [2.75, 'tick']],
  src: ['exPiaknow', 'kunai', 'usbHs', 'ntrScan'],
  draw: t => {
    const C0 = NTR_COV, [vx, vy, vw, vh] = C0.v;
    /* top row: the studio, and the rule the whole deck follows */
    chapterIcon('intro', LM, LAY.labelY - 19, 22, C.hero, ep(t, 0.1, 0.4));
    text('Nitrite Labs', LM + 36, LAY.labelY, { role: 'label', color: C.ink2, t, t0: 0.15, cps: 40 });
    rich([{ s: 'Optimization', role: 'label', color: C.faint }, { s: 'over', role: 'label', color: C.faint, gap: 12 }, { s: 'opinion', role: 'label', color: C.hero, gap: 12 }], RM, LAY.labelY, { align: 'right', alpha: ep(t, 0.4, 0.8) });
    text('A Nitrite Labs mouse, in development for years', LM, 196, { role: 'label', size: 22, color: C.mute, t, t0: 0.5, cps: 60 });
    /* THESEUS: each letter rises out of its own mask */
    const st = { role: 'hero', size: C0.size, track: -0.028 }, word = 'THESEUS', x0 = C0.x0, yb = C0.yb;
    setFont(sty(st)); const ls = lsPx(sty(st));
    const advs = [...word].map((ch, i) => G.measureText(word.slice(0, i + 1)).width - G.measureText(word.slice(0, i)).width);
    const wordW = advs.reduce((a, b) => a + b, 0) + ls * (word.length - 1);
    let xx = x0;
    [...word].forEach((ch, i) => {
      const k = E.rise(prog(t, 0.25 + i * 0.07, 1.05 + i * 0.07));
      if (k > 0) { G.save(); G.beginPath(); G.rect(xx - 10, yb - C0.size * 0.8, advs[i] + 20, C0.size * 0.86); G.clip(); text(ch, xx, yb + (1 - k) * C0.size * 0.82, Object.assign({}, st, { caps: false, color: C.ink })); G.restore(); }
      xx += advs[i] + ls;
    });
    /* the hero, in front of the word: the shell assembles out of its parts while the camera turns, slowly, and stops */
    ntr_prime('shell', t, vw, vh);
    const as = ep(t, 0.6, 4.6, E.io3), cam = ep(t, 0.3, 7.6, E.io3), drift = t > 7.6 ? Math.sin((t - 7.6) * 0.22) : 0;
    /* in 2D: the side-button side, the parts coming together in elevation */
    /* the flat elevation is long and low: a narrower box keeps its nose clear of the word */
    const VB = V2D.on ? [1300, 150, 630, 640] : [vx, vy, vw, vh];
    view3D('shell', t, VB[0], VB[1], VB[2], VB[3], { view: 'threeQuarterRight', view2d: 'right', yaw: lerp(-0.5, 0.02, cam) + 0.05 * drift, pitch: 0.06 * (1 - cam), zoom: in2D(lerp(1.12, 1.18, cam), lerp(C0.zoom[0], C0.zoom[1], cam)), explode: 0.72 * (1 - as), colorway: 'black' }, { alpha: ep(t, 0.35, 1.4) });
    /* what you are looking at, said plainly: the shape is a placeholder */
    const kf0 = ep(t, 4.8, 5.4);
    rich([{ s: 'Fig. 00', role: 'label', size: 21, color: C.mute }, { s: 'Sora V2 shape, a placeholder', role: 'label', size: 21, color: C.faint, gap: 16 }], RM, 744, { align: 'right', alpha: kf0 });
    /* a millimetre scale under the word, with a yellow segment for the 29 g */
    const ry = yb + 44, kr = ep(t, 1.0, 1.9, E.cam), rx1 = x0 + 14 + (wordW - 14) * kr;
    line(x0 + 14, ry, rx1, ry, { color: inkA(0.35), w: 1.5 });
    for (let i = 0; x0 + 14 + i * 12 <= rx1; i++) { const X = x0 + 14 + i * 12, L = i % 10 === 0 ? 16 : i % 5 === 0 ? 10 : 6; line(X, ry, X, ry + L, { color: inkA(i % 10 === 0 ? 0.5 : 0.25), w: 1.2 }); }
    rect(x0 + 14, ry - 3, 29 * 12 * ep(t, 1.6, 2.1, E.out3), 6, { fill: C.hero });
    text('0', x0 + 14, ry + 40, { role: 'tick', size: 19, color: C.faint, alpha: ep(t, 1.4, 1.8) });
    text('29', x0 + 14 + 29 * 12, ry + 40, { role: 'tick', size: 19, color: C.hero, align: 'center', alpha: ep(t, 1.9, 2.2) });
    /* the subtitle in three voices: a mono run-in, the display claim, and the one yellow word */
    rich([
      { s: 'In pursuit of an', role: 'labelL', size: 28, color: C.mute, t0: 1.25, cps: 40 },
      { s: 'objectively better', role: 'h2', size: 60, color: C.ink, gap: 22, rise: [1.55, 0.8] },
      { s: 'mouse', role: 'h2', size: 60, color: C.hero, gap: 18, rise: [1.7, 0.8] }
    ], LM, 640, { t });
    /* four numbers, XBAB-size next to mono units; each a target, so each carries its pill */
    const cols = [
      { lab: 'Mass', n: '29', u: 'g', chip: 'Target', ev: 'proposal', sub: 'Weighed per unit' },
      { lab: 'Motion latency, wireless', n: '0.14', u: 'ms', ev: 'proposal', sub: 'On {piaknow}\'s rig' },
      { lab: 'Report rate', n: '8', u: 'kHz', ev: 'proposal', sub: 'Wired, wireless' },
      { lab: 'Ideas', n: '100', u: '+', sub: 'Each with its evidence' }
    ];
    const cw = (RM - LM) / 4;
    cols.forEach((c, i) => {
      const x = LM + i * cw, t0 = 2.1 + i * 0.2, a = ep(t, t0, t0 + 0.4);
      if (i) line(x - 24, 770, x - 24, 770 + 190 * ep(t, t0 - 0.1, t0 + 0.5, E.cam), { color: inkA(0.14), w: 1.5 });
      text(c.lab, x, 786, { role: 'label', size: 21, color: C.mute, alpha: a, t, t0, cps: 60 });
      const r = rich([{ s: c.n, role: 'd1', size: 132, color: C.ink, tnum: true, count: [t0, 1.0] }, { s: c.u, font: c.u === '+' ? 'disp' : 'mono', size: c.u === '+' ? 96 : 38, weight: c.u === '+' ? 800 : 600, color: c.u === '+' ? C.hero : C.mute, gap: c.u === '+' ? 2 : 10 }], x - 6, 916, { t, alpha: a });
      if (c.chip) ntr_chip(c.chip, x - 6 + r.w + 20, 916, ep(t, t0 + 0.6, t0 + 0.9));
      const ka = ep(t, t0 + 0.4, t0 + 0.8);
      let sx = x; if (c.ev) sx += pill(x, 962, c.ev, ka) + 12;
      text(c.sub, sx, 962, { role: 'label', size: 19, color: C.faint, alpha: ka });
    });
    /* the byline, on the chrome's rule */
    line(LM, LAY.ruleY, LM + (RM - LM) * ep(t, 0.3, 1.4, E.cam), LAY.ruleY, { color: C.hair, w: 1.5 });
    rich([{ s: 'Brock Liddicoat', role: 'foot', weight: 700, caps: true, track: 0.16, color: C.ink2 }, { s: '/', role: 'foot', color: C.faint, gap: 14 }, { s: 'Nitrite Labs', role: 'foot', caps: true, track: 0.12, color: C.mute, gap: 14 }, { s: '/', role: 'foot', color: C.faint, gap: 14 }, { s: 'Shape designer of the Finalmouse Starlight X', role: 'foot', caps: true, track: 0.12, color: C.faint, gap: 14 }], LM, LAY.footY, { alpha: ep(t, 2.6, 3.2) });
    text(`01 / ${pad2(DECK.slides.length)}`, RM, LAY.footY, { role: 'foot', weight: 600, color: C.mute, align: 'right', alpha: ep(t, 2.6, 3.2) });
    for (const [mx, my] of [[40, 160], [40, 600]]) regMark(mx, my, ep(t, 0.8, 1.3) * 0.4, 8, C.ink);
  }
});

/* ============================== 02. thesis: optimization over opinion, the six labels as one designed object ============================== */
/** the six specimens, all from this deck and one story: the Starlight X's weight, the cell it carries, the 29 g target */
function ntr_specimens() {
  const slx = id => ntr_fv('finalmouse-slx', id) || {}, me = slx('weight_measured_g').v, cl = slx('weight_claimed_g').v, gap = (ntr_fv('finalmouse-slx', 'weight_gap_pct') || {}).v;
  const ch = ((RD.batteries || {}).chemistries || []).find(c => c.id === 'li_polymer_pouch_mouse'), cell = ch ? rv(ch.mass) : null;
  const p140 = ntr_pack('LP402025JU'), L = ntr_loads(), h79 = p140 ? p140.wh / L.w1 : null;
  return [
    { ev: 'measured', who: 'Outside tester', shape: 'Filled', n: me != null ? fmtN(me, 1) : '–', u: 'g', what: 'Finalmouse Starlight X, on RTINGS\' scale', src: 'RTINGS, Oct 2026' },
    { ev: 'datasheet', who: 'The part maker', shape: 'Filled', n: cell != null ? fmtN(cell, 1) : '–', u: 'g', what: 'A 250 mAh Jauch pouch cell, as packed', src: 'Jauch datasheet' },
    { ev: 'claim', who: 'The mouse maker', shape: 'Ring', n: cl != null ? fmtN(cl, 0) : '–', u: 'g', what: 'Finalmouse Starlight X, as listed', src: 'Finalmouse listing' },
    { ev: 'derived', who: 'My arithmetic', shape: 'Ring', n: gap != null ? '+' + fmtN(gap, 1) : '–', u: '%', what: 'Weighed vs listed', formula: [me, cl], src: 'Formula on screen' },
    { ev: 'proposal', who: 'My target', shape: 'Dashed', n: '29', u: 'g', what: 'Theseus, the weight I am designing to', src: 'This deck' },
    { ev: 'projected', who: 'My forecast', shape: 'Half', n: h79 != null ? fmtN(h79, 0) : '–', u: 'h', what: 'Theseus at 1 kHz on a 140 mAh cell', src: p140 ? fmtN(p140.wh, 3) + ' Wh ÷ ' + fmtN(L.w1 * 1000, 2) + ' mW' : '' }
  ];
}
S({
  id: 'thesis', ch: 'intro', theme: 'paper', title: 'Optimization over opinion', settle: 10,
  src: ['ntrRtSlx', 'ntrEloSlx', 'exJauch', 'ntrJauch', 'ntrTpuV4', 'exNbcV4'],
  draw: t => {
    header(t, 'Optimization over opinion');
    captions(t, [[0.6, 'Every number in this deck says who stands behind it. Here is one of each kind, all from the pages ahead.'], [5.6, 'Same mouse, two weights: listed at 38 g, weighed at 41.7 g. The pill tells you which one you are reading.']]);
    const SP = ntr_specimens(), n = SP.length, gap = 24, cw = (RM - LM - gap * (n - 1)) / n, y0 = 296, ch = 500;
    /* who stands behind the number: the outside world on the left, me on the right */
    const ka = ep(t, 0.5, 0.9), xMe = LM + 4 * (cw + gap);
    line(LM, y0 - 6, xMe - gap, y0 - 6, { color: C.hair, w: 1.5, alpha: ka });
    line(xMe, y0 - 6, RM, y0 - 6, { color: C.heroText, w: 2, alpha: ka });
    text('Someone else', LM, y0 - 20, { role: 'label', size: 21, color: C.mute, alpha: ka });
    text('Me, before it exists', RM, y0 - 20, { role: 'label', size: 21, color: C.heroText, align: 'right', alpha: ka });
    SP.forEach((s, i) => {
      const x = LM + i * (cw + gap), t0 = 0.8 + i * 0.35, a = ep(t, t0, t0 + 0.45), mine = s.ev === 'proposal' || s.ev === 'projected';
      if (a <= 0.003) return;
      G.save(); G.translate(0, (1 - E.out3(a)) * 18);
      demoWindow(x, y0 + 20, cw, ch, a, { plain: true, hero: mine });
      text(s.who, x + 22, y0 + 62, { role: 'label', size: 21, color: mine ? C.heroText : C.mute, alpha: a, maxW: cw - 40 });
      pill(x + 22, y0 + 110, s.ev, a, { size: 21 });
      /* the dot, large: its shape is the strength of the evidence */
      const gx = x + 50, gy = y0 + 178, kg = ep(t, t0 + 0.2, t0 + 0.6, E.snap);
      G.save(); G.translate(gx, gy); G.scale(kg * 3.4, kg * 3.4); evDot(0, 0, s.ev, 6, a); G.restore();
      text(s.shape, x + 88, gy + 8, { role: 'label', size: 21, color: C.mute, alpha: a });
      /* the specimen */
      rich([{ s: s.n, role: 'stat', size: 88, color: C.ink, tnum: true, count: [t0 + 0.3, 0.9] }, { s: s.u, font: 'mono', size: 32, weight: 600, color: C.mute, gap: 8 }], x + 20, y0 + 314, { t, alpha: a });
      text(s.what, x + 22, y0 + 362, { role: 'small', size: 25, color: C.ink2, maxW: cw - 40, lh: 1.3, alpha: a });
      if (s.formula && s.formula[0] != null) {
        /* the formula carries the evidence of its inputs: a measured 41.7 and a claimed 38.0 */
        const fy = y0 + 424, kf = ep(t, t0 + 0.5, t0 + 0.9); let fx = x + 22;
        const run = (str, w) => { text(str, fx, fy, { font: 'mono', size: 22, weight: 600, color: C.ink, alpha: kf }); fx += tw(str, { font: 'mono', size: 22, weight: 600 }) + (w || 6); };
        run('('); evDot(fx + 6, fy - 8, 'measured', 5.5, kf); fx += 16; run(fmtN(s.formula[0], 1)); run('−'); evDot(fx + 6, fy - 8, 'claim', 5.5, kf); fx += 16; run(fmtN(s.formula[1], 1) + ')');
        fx = x + 22; const fy2 = fy + 32; text('÷', fx, fy2, { font: 'mono', size: 22, weight: 600, color: C.ink, alpha: kf }); evDot(fx + 30, fy2 - 8, 'claim', 5.5, kf); text(fmtN(s.formula[1], 1), fx + 42, fy2, { font: 'mono', size: 22, weight: 600, color: C.ink, alpha: kf });
      }
      line(x + 22, y0 + ch - 22, x + cw - 22, y0 + ch - 22, { color: C.hair, w: 1.2, alpha: a });
      text(s.src, x + 22, y0 + ch + 8, { role: 'foot', color: C.faint, alpha: a, maxW: cw - 40 });
      G.restore();
    });
    gloss(t, 6.2, 'Maker claim', 'A maker\'s figure for its own product. It stays a claim even when the maker says it measured it.');
    bandBlock(t, 6.6, W / 2 + 40, RM - (W / 2 + 40), 'The rule', 'No pill, no number', 'If I can\'t say how I know a number, it is not on a slide. Where data is missing, the slide says so.', { color: C.ink });
  }
});

/* ============================== 03, 04. the bar: the best figure anyone has shown, who holds it, how we know, my target ============================== */
/* each row: cat, best (as shown), bv (its value), who, note, ev, tgt (my target), tv, tq (the target's qualifier), better ('low' | 'high') */
const NTR_BAR_SPEED = [
  { cat: 'Motion latency, wired', best: '0.13 ms', bv: 0.13, who: 'XBAB XA25', note: '{piaknow}, 8 kHz, fw 1.08', ev: 'measured', tgt: '0.13 ms', tv: 0.13, tq: 'or less', better: 'low' },
  { cat: 'Motion latency, wireless', best: '0.34 ms', bv: 0.34, who: 'Razer Viper V4 Pro', note: '{piaknow}, 8 kHz', ev: 'measured', tgt: '0.14 ms', tv: 0.14, tq: 'on the same rig', better: 'low' },
  { cat: 'Frame sync', best: '163 µs', who: 'SensorLock vs FrameSync', note: 'XBAB and its developer', ev: 'claim', tgt: 'Every report', tq: 'synced, shown on a scope' },
  { cat: 'Click latency, wired', best: '65 µs', bv: 65, who: 'XBAB XA25', note: 'Contact to USB, own rig', ev: 'claim', tgt: '65 µs', tv: 65, tq: 'on an outside rig', better: 'low' },
  { cat: 'Click latency, wireless', best: '0.175 ms', bv: 0.175, who: 'VGN Dragonfly 3 Master GT', note: 'VGN, "as low as"', ev: 'claim', tgt: '0.1 ms', tv: 0.1, tq: 'or less', better: 'low' },
  { cat: 'Press to PC, with travel', best: '2.0 ms', bv: 2.0, who: 'Finalmouse Starlight X', note: 'Own rig, pre-release', ev: 'claim', tgt: '2.0 ms', tv: 2.0, tq: 'on an outside rig', better: 'low' },
  { cat: 'Report rate', best: '8 kHz', bv: 8, who: 'Wired and wireless', note: 'USB high speed, 125 µs', ev: 'datasheet', tgt: '8 kHz', tv: 8, tq: 'wired and wireless', better: 'high' },
  { cat: 'Lost reports rescued', best: '99 to 100%', bv: 99, who: 'Kunai Second Shot, 4 kHz', note: 'Its developer, unreleased', ev: 'claim', tgt: '99%', tv: 99, tq: 'or more, at every rate', better: 'high' }
];
const NTR_BAR_REST = [
  { cat: 'Battery, 1 kHz', best: '180 h', bv: 180, who: 'Razer Viper V4 Pro, 49 g', note: 'Razer; SLX: no rating', ev: 'claim', tgt: '200 h', tv: 200, tq: 'measured, not listed', better: 'high' },
  { cat: 'Battery, 8 kHz', best: '40 h', bv: 40, who: 'Razer Viper V4 Pro', note: 'TechPowerUp', ev: 'measured', tgt: '45 h', tv: 45, tq: 'measured', better: 'high' },
  { cat: 'Charge current', best: '0.28 A', who: 'Pulsar X2H', note: 'TechPowerUp', ev: 'measured', tgt: '1C', tq: 'if the cell is rated for it' },
  { cat: 'Weight, full shell', best: '29 g', bv: 29, who: 'Finalmouse ULX, small', note: 'Finalmouse, as listed', ev: 'claim', tgt: '29 g', tv: 29, tq: 'weighed, every unit', better: 'low' },
  { cat: 'Sensor', best: '930 IPS', who: 'Razer Focus Pro 50K', note: '90 G; Razer only', ev: 'claim', tgt: 'FrameSync-class', tq: 'next-gen PixArt, proposal' },
  { cat: 'Lift-off', best: '0.7 mm', bv: 0.7, who: 'PAW3955 mice, the SLX', note: '11 steps, 0.7 to 1.7 mm', ev: 'datasheet', tgt: '0.7 mm', tv: 0.7, tq: 'or less, measured', better: 'low' },
  { cat: 'Set-down smoothing', best: '12 ms', bv: 12, who: 'XBAB XA25, 2 frames', note: 'A 3950 by default: 450 ms', ev: 'claim', tgt: '12 ms', tv: 12, tq: 'or less, by default', better: 'low' },
  { cat: 'Button sensing', best: '40 × 0.01 mm', who: 'Finalmouse SLX, TMR-DS', note: 'Finalmouse', ev: 'claim', tgt: 'Analog, in mm', tq: 'on GT01-class switches' },
  { cat: 'Idle sleep', best: '10 s', bv: 10, who: 'Kunai Smart sleep', note: 'Its developer, unreleased', ev: 'claim', tgt: '10 s', tv: 10, tq: 'woken by a touch', better: 'low' },
  { cat: 'Software', best: 'Browser tab', who: 'XBAB Xpanel', note: 'Settings on the mouse', ev: 'claim', tgt: 'A browser tab', tq: 'every OS, no install' },
  { cat: 'Coating hardness', best: '8H pencil', who: 'Cerakote H-167', note: 'On steel, cured at 250 °F', ev: 'datasheet', tgt: '8H', tq: 'tested on the shell itself' }
];
/** the bar, as a table. A numeric row carries a gap track: the best shown (ink dot) and my target (yellow diamond), which
   slides out from the best to where I want it, with the change written at the end */
function ntr_bar(t, rows) {
  const x = LM, y = 304, w = RM - LM, n = rows.length, rh = Math.min(68, 640 / n);
  const cx = [x, x + 340, x + 530, x + 880, x + 1085, x + 1380], tx = cx[5], trW = 185;
  const a0 = ep(t, 0.4, 0.8), kc = ep(t, 0.6, 1.2, E.snap);
  rect(tx - 20, y - 46, RM - tx + 20, 6 * kc, { fill: C.hero });
  rect(tx - 20, y - 46, 2, (rh * n + 60) * kc, { fill: C.hero, alpha: 0.9 });
  ['Category', 'Best shown', 'Who, and on what', 'How we know', 'Best against mine'].forEach((h, i) => text(h, cx[i], y - 4, { role: 'label', size: 21, color: C.mute, alpha: a0 }));
  ntr_chip('Theseus target', tx, y - 4, a0);
  line(x, y + 14, RM, y + 14, { color: C.hair, w: 1.5, alpha: a0 });
  rows.forEach((r, i) => {
    const bt = y + 14 + rh * i, yy = bt + rh / 2 + 9, t0 = 0.9 + i * 0.12, k = ep(t, t0, t0 + 0.3);
    if (i) line(x, bt, RM, bt, { color: C.hair, w: 1, alpha: k });
    const cur = t > 6.2 ? Math.floor((t - 6.2) / 1.7) % n : -1, hl = cur === i ? Math.sin(clamp(((t - 6.2) % 1.7) / 1.7) * Math.PI) : 0;
    if (hl > 0) rect(x - 12, bt + 2, w + 24, rh - 4, { fill: inkA(0.035 * hl) });
    text(r.cat, cx[0], yy, { role: 'small', size: 25, weight: 600, color: C.ink, sentence: true, t, t0, cps: 130, maxW: 330 });
    text(r.best, cx[1], yy, { font: 'mono', size: 25, weight: 700, color: C.ink, t, t0: t0 + 0.08, cps: 100 });
    text(r.who, cx[2], bt + rh / 2 - 1, { role: 'small', size: 24, weight: 500, color: C.ink2, t, t0: t0 + 0.12, cps: 150 });
    text(r.note, cx[2], bt + rh / 2 + 22, { role: 'label', size: 19, color: C.faint, alpha: ep(t, t0 + 0.15, t0 + 0.45) });
    pill(cx[3], yy + 2, r.ev, ep(t, t0 + 0.15, t0 + 0.45));
    /* the gap track */
    if (r.bv != null && r.tv != null) {
      const hi = Math.max(r.bv, r.tv) * 1.18, X = v => cx[4] + 12 + (trW - 24) * v / hi, ty = bt + rh / 2, kt = ep(t, t0 + 0.3, t0 + 0.7), km = ep(t, t0 + 0.7, t0 + 1.5, E.io3);
      line(cx[4], ty, cx[4] + trW, ty, { color: C.hair, w: 2, alpha: kt });
      line(X(0), ty - 7, X(0), ty + 7, { color: C.faint, w: 1.5, alpha: kt });
      circle(X(r.bv), ty, 8 * kt, { fill: C.ink });
      const xt = lerp(X(r.bv), X(r.tv), km), same = Math.abs(r.tv - r.bv) < 1e-9;
      if (!same && km > 0.05) { line(X(r.bv), ty, xt, ty, { color: C.heroText, w: 3, alpha: kt }); }
      heroMark(xt, ty, 11 * kt, 1);
      const ch2 = same ? 'Same' : (r.tv > r.bv ? '+' : '−') + fmtN(Math.abs(100 * (r.tv - r.bv) / r.bv), 0) + '%';
      text(ch2, tx - 36, ty + 7, { font: 'mono', size: 21, weight: 700, color: same ? C.mute : C.heroText, align: 'right', alpha: ep(t, t0 + 1.2, t0 + 1.6) });
    }
    text(r.tgt, tx, bt + rh / 2 - 1, { role: 'small', size: 26, weight: 800, color: C.ink, t, t0: t0 + 0.2, cps: 100 });
    text(r.tq, tx, bt + rh / 2 + 22, { role: 'label', size: 19, color: C.mute, alpha: ep(t, t0 + 0.3, t0 + 0.6) });
  });
  return y + 14 + rh * n;
}
S({
  id: 'targets', ch: 'intro', theme: 'night', title: 'The bar, part one: speed', settle: 9,
  src: ['exPiaknow', 'kunai', 'xbab', 'xbabFw', 'xbabSensorLock', 'vgnClick', 'pcgSlx', 'usbHs', 'ntrTpuV4'],
  draw: t => {
    header(t, 'The bar, part one: speed');
    const yb = ntr_bar(t, NTR_BAR_SPEED);
    captions(t, [[0.6, 'Each row: the best number anyone has shown, who holds it, how we know, and my target. A maker\'s claim is labelled as one.'], [5.0, 'The hard one is wireless motion: 0.14 ms is 59% below the fastest wireless mouse anyone has measured.']]);
    legend(t, 3.2, LM, yb + 58, [{ kind: 'dot', color: C.ink, label: 'Best shown' }, { kind: 'hero', label: 'My target, a proposal' }]);
    source(t, 'Change = (target − best) ÷ best. Targets are proposals: none is measured yet.', { t0: 3.4 });
  }
});
S({
  id: 'targets2', ch: 'intro', theme: 'paper', title: 'The bar, part two: everything else', settle: 9,
  src: ['exNbcV4', 'ntrTpuV4', 'ntrB2g', 'tpuX2h', 'nbcUlx', 'razerFocus', 'mkb3955', 'xbabSmooth', 'slxPdf', 'slxXt', 'kunai', 'cerakoteH'],
  draw: t => {
    header(t, 'The bar, part two: everything else');
    ntr_bar(t, NTR_BAR_REST);
    captions(t, [[0.6, 'The same rule for the rest: the best figure shown anywhere, and a target at or past it.'], [5.0, 'One row I can\'t win outright: Razer\'s sensor is Razer\'s alone. Mine is a next-gen PixArt FrameSync-class part, a proposal.']]);
  }
});

/* ============================== 05. Theseus against the flagships: one column per mouse, bars where the numbers compare ============================== */
const NTR_FLAG = [
  { id: null, name: 'Theseus', brand: 'Nitrite Labs', hero: true },
  { id: 'razer-viper-v4-pro', name: 'Viper V4 Pro', brand: 'Razer' },
  { id: 'finalmouse-slx', name: 'Starlight X', brand: 'Finalmouse' },
  { id: 'logitech-gpx2', name: 'GPX2', brand: 'Logitech' },
  { id: 'ninjutso-sora-v3', name: 'Sora V3', brand: 'Ninjutso' },
  { id: 'xbab-xa25', name: 'XA25', brand: 'XBAB, wired' },
  { id: 'endgame-op1-8k-v2', name: 'OP1 8K V2', brand: 'Endgame, wired' }
];
const ntr_g = v => v % 1 ? fmtN(v, Math.abs(v * 10 % 1) > 1e-6 ? 2 : 1) : fmtN(v, 0);
/** every cell of the flagship table, read from the research files: { v (a number, for bars), s, u, ev, sub, na (no data: say so) }.
   Subs are mono caps in a 200 px column, so they stay under 14 characters */
function ntr_flagCells() {
  const pan = (((RD.latency || {}).click_latency_xbab_vs_op1_8k_v2 || {}).panels || []).find(p => /NC/.test(p.mode) && p.state === 'stationary') || {};
  const xbXa = pan.XA25 ? rv(pan.XA25) : null, xbOp = pan.OP1_8k_v2 ? rv(pan.OP1_8k_v2) : null;
  const wt = id => { const m = ntr_fv(id, 'weight_measured_g'), c = ntr_fv(id, 'weight_claimed_g'); if (!m) return { na: 'Not weighed' }; return { v: m.v, s: ntr_g(m.v), u: 'g', ev: m.ev, sub: id === 'xbab-xa25' ? 'By part, XBAB' : c && Math.abs(c.v - m.v) >= 0.5 ? 'Listed ' + ntr_g(c.v) + ' g' : 'Listed ' + ntr_g(c ? c.v : m.v) + ' g' }; };
  const hr = id => { const h = ntr_fv(id, 'battery_claim_1k_h'); return h ? { v: h.v, s: fmtN(h.v, 0), u: 'h', ev: h.ev } : { na: 'None found' }; };
  const mo = (id, sub) => { const m = ntr_fv(id, 'motion_latency'); return m ? { v: m.v, s: fmtN(m.v, 2), u: 'ms', ev: m.ev, sub } : { na: 'Not tested' }; };
  const v4c = ntr_fv('razer-viper-v4-pro', 'click_latency'), v48 = ntr_fv('razer-viper-v4-pro', 'battery_measured_h');
  return {
    w: [{ v: 29, s: '29', u: 'g', ev: 'proposal', sub: 'Weighed' }, wt('razer-viper-v4-pro'), wt('finalmouse-slx'), wt('logitech-gpx2'), wt('ninjutso-sora-v3'), wt('xbab-xa25'), wt('endgame-op1-8k-v2')],
    b: [{ v: 200, s: '200', u: 'h', ev: 'proposal', sub: 'Measured' }, Object.assign(hr('razer-viper-v4-pro'), { sub: v48 ? fmtN(v48.v, 0) + ' h at 8 kHz' : '' }),
      { na: 'None listed', sub: '250 mAh cell' }, hr('logitech-gpx2'), { na: 'None found' }, { na: 'Wired' }, { na: 'Wired' }],
    m: [{ v: 0.14, s: '0.14', u: 'ms', ev: 'proposal', sub: 'Wireless' }, mo('razer-viper-v4-pro', 'Wireless'), { na: 'Not tested' }, mo('logitech-gpx2', 'Wireless'), { na: 'Not tested' }, mo('xbab-xa25', 'Wired'), mo('endgame-op1-8k-v2', 'Wired')],
    c: [{ s: '65', u: 'µs', ev: 'proposal', sub: 'Or less' }, v4c ? { s: fmtN(v4c.v * 1000, 0), u: 'µs', ev: v4c.ev, sub: 'TPU rig' } : { na: 'Not tested' }, { na: 'Not tested' }, { na: 'Not tested' }, { na: 'Not tested' },
      xbXa != null ? { s: fmtN(xbXa, 0), u: 'µs', ev: 'claim', sub: 'XBAB rig' } : { na: 'Not tested' }, xbOp != null ? { s: fmtN(xbOp, 0), u: 'µs', ev: 'claim', sub: 'XBAB rig' } : { na: 'Not tested' }],
    s: [{ s: 'Next-gen PixArt,\nFrameSync-class', ev: 'proposal' }, { s: 'Focus Pro 50K Gen-3' }, { s: 'Finalmouse F1' }, { s: 'HERO 2' }, { s: 'AimNinja 2 Pro 45K' }, { s: 'PAW3950' }, { s: 'PAW3950' }],
    r: [{ s: 'Raytac AN54LM-20A\n{nRF54LM20A}', ev: 'proposal' }, { s: 'Airoha AB1623' }, { s: 'Nordic {nRF54LM20}' }, { s: 'Nordic {nRF52840}' }, { s: 'PixArt PAR2862' }, { s: 'Nuvoton M483' }, { s: 'Nuvoton M483' }],
    p: [{ s: 'Not set' }, { s: '$159.99' }, { s: '$179' }, { s: '$159', sub: '2023 list' }, { s: '$119.99' }, { s: '$169' }, { s: '$89.99' }]
  };
}
/** evidence dots as a legend line */
function ntr_evLegend(t, t0, x, y, kinds, o = {}) {
  let xx = x; const a = ep(t, t0, t0 + 0.4);
  kinds.forEach(k => { evDot(xx + 7, y - 7, k, 6, a); text(evLabel(k), xx + 22, y, { role: 'label', size: 20, color: C.mute, alpha: a }); xx += 22 + tw(evLabel(k), { role: 'label', size: 20 }) + 30; });
  return xx - x;
}
S({
  id: 'flagships', ch: 'intro', theme: 'night', title: 'Theseus against the flagships', settle: 10,
  src: ['exRtings', 'exEloshapes', 'exXbabWeight', 'exNbcV4', 'ntrTpuV4', 'ntrGpx2', 'ntrB2g', 'exPiaknow', 'ntrXbabClick', 'ntrRazerV4', 'ntrStores', 'raytac', 'slxPdf'],
  draw: t => {
    header(t, 'Theseus against the flagships');
    captions(t, [[0.6, 'Six of the best mice you can buy, against my targets. A blank cell means nobody has published that number.'], [5.4, 'Theseus doesn\'t lead every row: the wired XA25 is lighter, and 0.01 ms quicker in motion.']]);
    const D = ntr_flagCells(), n = NTR_FLAG.length, lw = 214, c0w = 290, cw = (RM - LM - lw - c0w) / (n - 1), y0 = 268, hh = 84;
    const rows = [
      { k: 'w', label: 'Weight', sub: 'As weighed', bar: 60, best: 'min', h: 100 },
      { k: 'b', label: 'Battery, 1 kHz', sub: 'Hours, listed', bar: 200, best: 'max', h: 100 },
      { k: 'm', label: 'Motion latency', sub: '{piaknow}, 8 kHz', bar: 1.0, best: 'min', h: 100 },
      { k: 'c', label: 'Click latency', sub: 'Contact to USB', h: 66 },
      { k: 's', label: 'Sensor', h: 70, wrap: true }, { k: 'r', label: 'Radio, MCU', h: 70, wrap: true }, { k: 'p', label: 'Price, US', h: 52 }
    ];
    const colX = j => LM + lw + (j ? c0w + (j - 1) * cw : 0), colW = j => j ? cw : c0w, total = hh + rows.reduce((a, r) => a + r.h, 0), a0 = ep(t, 0.3, 0.7);
    /* the Theseus column: a yellow cap and a rule */
    const kc = ep(t, 0.5, 1.1, E.snap);
    rect(colX(0), y0, c0w - 14, 6 * kc, { fill: C.hero });
    rect(colX(0), y0, 2, total * kc, { fill: C.hero, alpha: 0.9 });
    NTR_FLAG.forEach((f, j) => {
      const x = colX(j) + 18, a = ep(t, 0.4 + j * 0.08, 0.8 + j * 0.08);
      text(f.brand, x, y0 + 38, { role: 'label', size: 19, color: f.hero ? C.heroText : C.faint, alpha: a });
      text(f.name, x, y0 + 72, { role: 'h3', size: 27, weight: 800, color: C.ink, alpha: a });
    });
    line(LM, y0 + hh, RM, y0 + hh, { color: C.hair, w: 1.5, alpha: a0 });
    let ry = y0 + hh;
    rows.forEach((R, i) => {
      const t0 = 0.9 + i * 0.32, k = ep(t, t0, t0 + 0.4), cells = D[R.k];
      if (i) line(LM, ry, RM, ry, { color: C.hair, w: 1, alpha: k });
      const vy = ry + (R.bar ? 48 : 34), sy = vy + (R.bar ? 27 : 24);
      text(R.label, LM, vy, { role: 'small', size: 25, weight: 700, color: C.ink, alpha: k });
      if (R.sub) text(R.sub, LM, sy, { role: 'label', size: 19, color: C.faint, alpha: k });
      /* the best of the six (not Theseus), in ink */
      const have = cells.slice(1).map(c => c && c.v != null ? c.v : null).filter(v => v != null);
      const bestV = !have.length ? null : R.best === 'min' ? Math.min(...have) : R.best === 'max' ? Math.max(...have) : null;
      cells.forEach((c, j) => {
        if (!c) return;
        const x = colX(j) + 18, kj = ep(t, t0 + 0.08 * j, t0 + 0.08 * j + 0.4), hero = j === 0, best = !hero && R.best && c.v === bestV;
        if (c.na) {
          text(c.na, x, vy - (R.bar ? 6 : 0), { role: 'label', size: 20, color: C.faint, alpha: kj });
          if (c.sub) text(c.sub, x, sy, { role: 'label', size: 19, color: C.faint, alpha: kj * 0.8 });
          return;
        }
        let vx = x;
        if (c.ev) { evDot(x + 6, vy - (R.bar ? 13 : 8), c.ev, 6, kj); vx += 20; }
        if (R.bar) {
          const cu = c.v != null ? (countUp(c.s, ep(t, t0 + 0.1 + 0.08 * j, t0 + 1.0 + 0.08 * j, E.out3)) || c.s) : c.s;
          rich([{ s: cu, font: 'disp', size: 40, weight: 800, track: -0.01, color: C.ink, tnum: true }, { s: c.u, font: 'mono', size: 21, weight: 600, color: C.mute, gap: 8 }], vx, vy, { alpha: kj });
        } else text(c.s + (c.u ? '\u00A0' + c.u : ''), vx, vy, { role: 'small', size: R.wrap ? 23 : 25, weight: hero || best ? (R.wrap ? 700 : 800) : 600, color: C.ink, alpha: kj, maxW: colW(j) - (vx - x) - 30, lh: 1.2 });
        if (c.sub) text(c.sub, x, sy, { role: 'label', size: 19, color: hero ? C.heroText : C.mute, alpha: kj });
        if (R.bar && c.v != null) {
          const bw = colW(j) - 40, by = ry + R.h - 18, kb = ep(t, t0 + 0.2 + 0.08 * j, t0 + 1.1 + 0.08 * j, E.snap), L = bw * clamp(c.v / R.bar) * kb;
          rr(x, by, bw, 8, 4, C.track, null, 0, kj);
          rr(x, by, Math.max(8, L), 8, 4, hero ? C.hero : best ? C.ref : C.comp, hero && TH ? '#111111' : null, 1.2, kj);
        }
      });
      ry += R.h;
    });
    line(LM, ry, RM, ry, { color: C.hair, w: 1.5, alpha: a0 });
    ntr_evLegend(t, 3.6, LM, ry + 44, ['measured', 'claim', 'proposal']);
    text('Ink bar: the best of the six', RM, ry + 44, { role: 'label', size: 20, color: C.mute, align: 'right', alpha: ep(t, 3.8, 4.2) });
    source(t, 'Weights: RTINGS, the XA25 by XBAB. Hours: the makers. Motion: piaknow 2026-09-15. Click: TechPowerUp\'s rig (V4 Pro), XBAB\'s (XA25, OP1).', { t0: 4.0 });
  }
});

/* ============================== 06. zero grams: the claim, and what has been measured ============================== */
S({
  id: 'zerograms', ch: 'intro', theme: 'paper', title: 'The optimal weight is zero grams', settle: 10, ideas: ['weight'],
  src: ['exZk', 'exZkM1k', 'exConroy', 'exYan', 'exWang', 'exChen', 'exXbabWeight'],
  draw: t => {
    header(t, 'The optimal weight is zero grams');
    { const a = ep(t, 0.9, 1.3), w1 = tw('The optimal weight is zero grams', { role: 'h1' }); pill(LM + w1 + 28, LAY.titleY - 8, 'claim', a, { text: 'Maker claim, Zaunkoenig 2018' }); }
    captions(t, [[0.6, 'Zaunkoenig argued it in 2018, from physics, without a study. Here is everything that has been measured.'], [5.6, 'Lighter beat heavier down to the lightest mouse tested. Below 40 g, nobody has measured anything.']]);
    const ws = RD['weight-science'] || {}, studies = (ws.studies || []);
    const X0 = LM + 330, X1 = RM - 20, M = g => X0 + (X1 - X0) * g / 200, y0 = 352, a0 = ep(t, 0.4, 0.9);
    for (let g = 0; g <= 200; g += 20) { line(M(g), y0 - 6, M(g), 852, { color: C.hair, w: 1, alpha: a0 * (g % 100 ? 0.6 : 1) }); text(String(g), M(g), y0 - 18, { role: 'tick', color: C.mute, align: 'center', alpha: a0 }); }
    text('Mouse mass, {g}', LM, y0 - 18, { role: 'label', size: 21, color: C.mute, alpha: a0 });
    /* the gap: 0 to 40 g, where Theseus is and nobody has data. Red: a gap no one has filled */
    const kg = ep(t, 3.6, 4.4, E.io3);
    if (kg > 0) {
      G.save(); G.beginPath(); G.rect(M(0), y0, (M(40) - M(0)) * kg, 852 - y0); G.clip();
      G.fillStyle = rgba(C.red, TH ? 0.05 : 0.07); G.fillRect(M(0), y0, M(40) - M(0), 852 - y0); G.restore();
      ntr_hatch(M(0), y0, (M(40) - M(0)) * kg, 852 - y0, rgba(C.red, TH ? 0.22 : 0.3), 1, 16);
      line(M(40), y0, M(40), 852, { color: C.red, w: 1.5, dash: [5, 5], alpha: kg });
      text('No published data', M(20), y0 + 40, { role: 'label', size: 21, color: TH ? C.redD : C.redL, align: 'center', alpha: kg });
    }
    const rowsDef = [
      { id: 'conroy2022', name: 'Conroy et al. 2022', who: 'n = 72, gamers', pts: [[50, 'w'], [60, 'w'], [90, 'w'], [100, 'l']], note: '50, 60 and 90 g: 4% faster, 9% more accurate than 100 g' },
      { id: 'yan2022', name: 'Yan et al. 2022', who: 'n = 12, gamers', pts: [[40, 'l'], [60, 'w'], [140, 'n']], span: [40, 140], note: '40 g: the highest error rate. 60 g: most preferred' },
      { id: 'wang2023', name: 'Wang et al. 2023', who: 'n = 16, pros', pts: [[80, 'n'], [87, 'n']], note: '80 vs 87 g: no significant difference' },
      { id: 'chen2012', name: 'Chen et al. 2012', who: 'n = 25, office task', pts: [[70, 'n'], [100, 'n'], [130, 'w'], [160, 'n'], [190, 'n']], note: 'Least wrist motion and muscle activity at 130 g' }
    ];
    const rh = 90;
    rowsDef.forEach((r, i) => {
      const y = y0 + 70 + i * rh, t0 = 1.0 + i * 0.45, a = ep(t, t0, t0 + 0.4), found = studies.find(s => s.id === r.id);
      line(LM, y + 40, X1, y + 40, { color: C.hair, w: 1, alpha: a });
      text(r.name, LM, y - 2, { role: 'small', size: 26, weight: 700, color: C.ink, alpha: a });
      text(found ? 'n = ' + found.n + ', ' + r.who.split(', ')[1] : r.who, LM, y + 28, { role: 'label', size: 19, color: C.mute, alpha: a });
      if (r.span) line(M(r.span[0]), y - 10, M(r.span[1]), y - 10, { color: inkA(0.25), w: 6, cap: 'round', alpha: a * ep(t, t0 + 0.2, t0 + 0.6) });
      r.pts.forEach(([g, kind], j) => {
        const k = ep(t, t0 + 0.2 + j * 0.07, t0 + 0.5 + j * 0.07, E.snap), x = M(g), yy = y - 10;
        if (kind === 'w') circle(x, yy, 11 * k, { fill: C.good });
        else if (kind === 'l') { circle(x, yy, 10 * k, { fill: C.panel }); circle(x, yy, 10 * k, { color: C.red, w: 3 }); }
        else circle(x, yy, 8 * k, { fill: C.comp });
      });
      text(r.note, X1, y + 28, { role: 'small', size: 23, weight: 500, color: C.ink2, align: 'right', alpha: ep(t, t0 + 0.5, t0 + 0.9) });
    });
    const ym = y0 + 70 + 4 * rh - 2;
    const k1 = ep(t, 4.3, 4.7, E.snap), k2 = ep(t, 4.55, 4.95, E.snap), k3 = ep(t, 4.8, 5.2, E.snap);
    circle(M(0), ym, 9 * k1, { color: C.ink2, w: 2.5 }); text('Zaunkoenig: 0 {g}', M(0) + 2, ym - 26, { role: 'label', size: 19, color: C.ink2, alpha: k1 });
    circle(M(23.4), ym, 9 * k2, { color: C.ink2, w: 2.5 }); text('M1K 23.4 g', M(23.4) - 4, ym + 44, { role: 'label', size: 19, color: C.ink2, align: 'right', alpha: k2 });
    heroMark(M(29), ym, 14 * k3, 1); ntr_chip('Theseus 29 g', M(29) + 8, ym + 44, k3);
    legend(t, 5.2, X0, 296, [{ kind: 'dot', color: C.good, label: 'Did better' }, { kind: 'ring', color: C.red, label: 'Did worse' }, { kind: 'dot', color: C.comp, label: 'No difference' }]);
    gloss(t, 6.0, 'F = m · a', 'At the same acceleration, your hand adds force in proportion to the mouse\'s mass. At 29 g that is 48% of what a 60 g mouse asks for.');
    featureCard(t, 6.4, 'Theseus, tested below 40 g', ['study', 'claim', 'proposal'], 'Nobody has measured aim between 20 and 40 g. I will, on the same task as Conroy et al., and publish it.');
  }
});

/* ============================== 07. listed against weighed: the scale doesn't round down ============================== */
const NTR_SHORT = { 'razer-deathadder-v4-pro': 'Razer DA V4 Pro', 'vgn-f1-pro-max': 'VGN F1 Pro Max', 'endgame-op1-8k-v2': 'OP1 8k v2, wired', 'lamzu-atlantis-mini-4k': 'Atlantis Mini 4K', 'vaxee-xe-wireless': 'VAXEE XE Wireless', 'logitech-gpx2-dex': 'Logitech GPX2 DEX' };
const ntr_gapName = m => NTR_SHORT[m.id] || exShort(m.name);
function ntr_gapRows() {
  const skip = ['finalmouse-ulx', 'mchose-l7-ultra', 'xbab-xa25'];
  return ((RD.mice || {}).mice || []).filter(m => !skip.includes(m.id)).map(m => {
    const g = ntr_fv(m.id, 'weight_gap_pct'), me = ntr_fv(m.id, 'weight_measured_g'), cl = ntr_fv(m.id, 'weight_claimed_g');
    if (!g || !me || !cl || me.ev !== 'measured') return null;
    return { id: m.id, name: ntr_gapName(m), c: cl.v, w: me.v, gap: g.v, big: /^(razer|logitech)-/.test(m.id) };
  }).filter(Boolean).sort((a, b) => b.gap - a.gap);
}
S({
  id: 'weightgap', ch: 'intro', theme: 'night', title: 'Listed against weighed', settle: 10, ideas: ['weight'],
  src: ['exRtings', 'exEloshapes', 'ntrB2g', 'ntrRtSlx', 'ntrEloSlx'],
  draw: t => {
    header(t, 'Listed against weighed');
    const R = ntr_gapRows(), big = R.filter(r => r.big), oth = R.filter(r => !r.big), nb = big.filter(r => Math.abs(r.gap) <= 3).length, nh = oth.filter(r => r.gap > 3).length;
    const slx = R.find(r => r.id === 'finalmouse-slx'), scy = R.find(r => r.id === 'scyrox-v8');
    captions(t, [[0.6, `Razer and Logitech: ${nb} of ${big.length} mice within 3% of the weight they list. ${nh} of the other ${oth.length} weigh more than 3% over.`],
      [5.6, 'So every Theseus gets weighed after assembly, and the weight on its card is the scale\'s, not mine.']]);
    const half = Math.ceil(R.length / 2), cols = [R.slice(0, half), R.slice(half)], colW = (RM - LM - 40) / 2, y0 = 300, rh = 42, lo = -7, hi = 13;
    cols.forEach((rows, ci) => {
      const x0 = LM + ci * (colW + 40), bx0 = x0 + 470, bw = colW - 470 - 92, X = v => bx0 + bw * (v - lo) / (hi - lo), a0 = ep(t, 0.4 + ci * 0.2, 0.8 + ci * 0.2);
      text('Mouse', x0, y0, { role: 'label', size: 21, color: C.mute, alpha: a0 });
      text('Listed → weighed', x0 + 448, y0, { role: 'label', size: 21, color: C.mute, align: 'right', alpha: a0 });
      /* the ±3% band and the gap axis */
      const yb0 = y0 + 18, yb1 = y0 + 18 + rh * (rows.length + (ci ? 1 : 0));
      rect(X(-3), yb0, X(3) - X(-3), yb1 - yb0, { fill: inkA(TH ? 0.05 : 0.06), alpha: a0 });
      for (const v of [-5, 0, 5, 10]) { line(X(v), yb0, X(v), yb1, { color: v ? C.hair : C.faint, w: v ? 1 : 1.5, alpha: a0 }); text((v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v) + '%', X(v), y0, { role: 'tick', size: 20, color: C.mute, align: 'center', alpha: a0 }); }
      rows.forEach((r, i) => {
        const y = yb0 + rh * i + rh / 2, t0 = 0.8 + ci * 0.5 + i * 0.07, k = ep(t, t0, t0 + 0.35), kb = ep(t, t0 + 0.15, t0 + 0.95, E.snap), out = Math.abs(r.gap) > 3;
        if (i) line(x0, y - rh / 2, x0 + colW, y - rh / 2, { color: C.hair, w: 1, alpha: k * 0.6 });
        text(r.name, x0, y + 8, { role: 'small', size: 24, weight: r.big ? 700 : 500, color: C.ink, alpha: k });
        text(ntr_g(r.c) + ' → ' + ntr_g(r.w) + '\u00A0g', x0 + 448, y + 8, { font: 'mono', size: 21, weight: 500, color: C.ink2, align: 'right', alpha: k });
        const xa = X(0), xb = X(r.gap * kb);
        rect(Math.min(xa, xb), y - 7, Math.abs(xb - xa), 14, { fill: r.big ? C.ref : C.comp, alpha: k });
        text((r.gap > 0 ? '+' : r.gap < 0 ? '−' : '') + fmtN(Math.abs(r.gap), 1) + '%', x0 + colW, y + 8, { font: 'mono', size: 24, weight: out ? 800 : 500, color: out ? C.ink : C.mute, align: 'right', alpha: k });
      });
      if (ci === 1) {
        /* Theseus: weighed, and the weighed number is the one printed. The gap is zero by construction */
        const y = yb0 + rh * rows.length + rh / 2, k = ep(t, 4.6, 5.1);
        line(x0, y - rh / 2, x0 + colW, y - rh / 2, { color: C.hair, w: 1.5, alpha: k });
        ntr_chip('Theseus', x0, y + 8, k);
        text('Weighed, printed', x0 + 448, y + 8, { font: 'mono', size: 21, weight: 600, color: C.ink, align: 'right', alpha: k });
        heroMark(X(0), y, 12 * k, 1);
        text('0.0%', x0 + colW, y + 8, { font: 'mono', size: 24, weight: 800, color: C.heroText, align: 'right', alpha: k });
      } else {
        legend(t, 4.4, x0, yb1 + rh / 2 + 8, [{ kind: 'comp', color: C.ref, label: 'Razer and Logitech' }, { kind: 'comp', color: C.comp, label: 'Every other brand' }]);
      }
    });
    gloss(t, 6.2, 'Gap', '(Weighed − listed) ÷ listed. Weighed: RTINGS\' default weight. Listed: the maker\'s own figure, via EloShapes.');
    featureCard(t, 6.6, 'The weight on the card', ['proposal'], 'Each Theseus weighed after assembly, and its own weight printed on its serial card, to 0.01 g.');
    source(t, 'Left out: the ULX (RTINGS doesn\'t say which size), the MCHOSE L7 Ultra (+17.7%, likely another variant), the XA25 (weighed by its maker).', { t0: 4.8 });
  }
});

/* ============================== 08. what a gram costs: weight against price, wireless ============================== */
/** wireless mice with a US price: { id, name, x: grams, y: dollars, hollow (maker weight), range (price was a range) } */
function exPricePoints() {
  return ((RD.mice || {}).mice || []).filter(m => m.connection !== 'wired' && rv(m.price_usd) != null && isFinite(parseFloat(rv(m.price_usd)))).map(m => {
    const w = exWeight(m.id), pv = String(rv(m.price_usd));
    return w ? { id: m.id, name: exShort(m.name), x: w.g, y: parseFloat(pv), hollow: w.ev !== 'measured', range: /-/.test(pv) } : null;
  }).filter(Boolean);
}
S({
  id: 'pricefront', ch: 'intro', theme: 'paper', title: 'What a gram costs', settle: 10, ideas: ['weight'],
  src: ['exRtings', 'exEloshapes', 'exPrices', 'x2fCrazy'],
  draw: t => {
    header(t, 'What a gram costs');
    captions(t, [[0.6, 'Every wireless mouse with a US list price, against its weight. Nothing has shipped past the black line.'], [5.4, 'The only 29 g wireless mouse gets there by leaving off the back half of the shell. Theseus aims for 29 g with the whole shell.']]);
    const P = exPricePoints();
    const named = ['pulsar-x2f-crazylight', 'pulsar-x2-crazylight-m', 'ninjutso-sora-v2', 'lamzu-maya', 'keychron-g3', 'finalmouse-slx', 'finalmouse-ulx', 'razer-viper-v4-pro', 'logitech-gpx2'];
    const pts = P.map(p => Object.assign({}, p, { label: named.includes(p.id) ? undefined : false, name: p.name.replace('Finalmouse Starlight X', 'Starlight X').replace('Finalmouse ULX', 'ULX') }));
    const x = LM + 110, py = 344, w = 1000, ph = 470;
    cardHead(t, 0.5, LM - 26, py - 80, w + 136, 'Weight against US list price, wireless', ['measured', 'claim']);
    const sc = scatter(t, {
      x, y: py, w, h: ph, t0: 0.6, xr: [25, 70], yr: [60, 200], xticks: [30, 40, 50, 60, 70], yticks: [60, 80, 100, 120, 140, 160, 180, 200],
      xfmt: v => v + ' g', yfmt: v => '$' + v, xlabel: 'Weight, {g}', better: { x: -1, y: -1 }, sweet: { label: 'Lighter and cheaper' }, frontier: true,
      points: pts.length ? pts : [{ name: 'placeholder', x: 40, y: 120 }], placeholder: !pts.length,
      targetX: { x: 29, name: 'Theseus, 29 g', sub: 'Price not set', t0: 2.6 }
    });
    const F = P.filter(p => !P.some(q => q !== p && q.x <= p.x && q.y <= p.y && (q.x < p.x || q.y < p.y))).sort((a, b) => a.x - b.x);
    const tx0 = 1290, tw0 = RM - tx0, ty = py - 34;
    const yEnd = compareTable(t, {
      x: tx0, y: ty, w: tw0, t0: 1.6, rowH: 60,
      cols: [{ key: 'm', label: 'On the frontier', w: 2.1 }, { key: 'g', label: 'Weight', w: 1, align: 'right' }, { key: 'p', label: 'Price', w: 1.15, align: 'right' }],
      rows: F.map(p => ({
        cells: {
          m: p.id === 'pulsar-x2f-crazylight' ? { v: p.name.replace('Pulsar ', ''), sub: 'Front half only' } : p.name.replace('Pulsar ', '').replace('Ninjutso ', ''),
          g: fmtN(p.x, p.x % 1 ? 1 : 0) + ' g',
          p: p.range ? { v: '$' + p.y.toFixed(2), sub: 'Lowest' } : '$' + (p.y % 1 ? p.y.toFixed(2) : p.y)
        },
        ev: { g: p.hollow ? 'claim' : 'measured' }
      }))
    });
    const kr = ep(t, 3.6, 4.1), ry = yEnd + 54;
    if (kr > 0) {
      rect(tx0, yEnd + 8, 6, 74 * kr, { fill: C.hero });
      ntr_chip('Theseus target', tx0 + 20, ry, kr);
      text('29 g', tx0 + tw0 * 3.1 / 4.25 - 16, ry, { font: 'mono', size: 25, weight: 800, color: C.ink, align: 'right', alpha: kr });
      text('Not set', RM - 16, ry, { font: 'mono', size: 25, weight: 500, color: C.mute, align: 'right', alpha: kr });
    }
    const un = pts.filter(p => p.label === false || (sc.unnamed || []).includes(p.name)).map(p => p.name.replace('Razer ', '').replace('Logitech ', '').replace('Ninjutso ', '').replace('Lamzu ', ''));
    if (un.length) text('Also plotted: ' + un.join(', ') + '.', tx0, yEnd + 150, { role: 'small', size: 22, color: C.mute, maxW: tw0, lh: 1.36, alpha: ep(t, 4.4, 4.9) });
    const dc = TH ? '#5F5E59' : '#B9B8B2';
    legend(t, 4.2, LM, 930, [{ kind: 'dot', color: dc, label: 'Weighed by RTINGS' }, { kind: 'ring', color: dc, label: 'Maker\'s weight' }, { kind: 'line', color: C.ink, label: 'Pareto frontier' }, { kind: 'dash', color: C.heroText, label: 'Theseus target' }]);
    source(t, 'Prices: US list, maker stores and reviews; a range is plotted at its lowest. Weights: RTINGS where weighed, else the maker.', { t0: 3 });
  }
});

/* ============================== 09. the empty corner: weight against listed battery life at 1 kHz ============================== */
const ntr_mk = n => exShort(n).replace(/^(Razer|Logitech|ZOWIE|Lamzu|Pulsar|Ninjutso|Finalmouse|WLMOUSE|Hitscan|Scyrox) /, '').replace('Xiaomi Gaming Mouse 2', 'Xiaomi GM2').replace('Starlight X', 'Starlight X');
S({
  id: 'market', ch: 'intro', theme: 'night', title: 'The empty corner', settle: 10, ideas: ['weight', 'battery'],
  src: ['exRtings', 'exEloshapes', 'exNbcV4', 'ntrKeychron', 'ntrDaV4', 'ntrXiaomi', 'ntrGpx2', 'ntrGpx2c', 'razerBatt', 'logiSuperstrike', 'ntrZowie', 'ntrB2g'],
  draw: t => {
    header(t, 'The empty corner');
    const mice = ((RD.mice || {}).mice || []).filter(m => m.connection !== 'wired');
    const rated = mice.filter(m => rv(m.battery_claim_1k_h) != null).map(m => { const w = exWeight(m.id); return w ? { id: m.id, name: ntr_mk(m.name) + (m.id === 'razer-deathadder-v4-pro' ? '*' : ''), x: w.g, y: rv(m.battery_claim_1k_h), hollow: w.ev !== 'measured' } : null; }).filter(Boolean);
    const unr = mice.filter(m => rv(m.battery_claim_1k_h) == null && m.id !== 'mchose-l7-ultra').map(m => { const w = exWeight(m.id); return w && w.g <= 50 ? { id: m.id, name: NTR_SHORT[m.id] || exShort(m.name), g: w.g, ev: w.ev } : null; }).filter(Boolean).sort((a, b) => a.g - b.g);
    const light = rated.reduce((a, p) => (!a || p.x < a.x ? p : a), null);
    captions(t, [[0.6, `Every wireless mouse that lists hours at 1 kHz, against its weight. The lightest is the ${light ? light.name + ', ' + ntr_g(light.x) + ' g' : '–'} as weighed.`],
      [5.4, 'Nothing lighter comes with an hour rating I could find. That corner is my target: 29 g and 200 h at 1 kHz, measured.']]);
    const x = LM + 100, py = 330, w = 1150, ph = 480, xr = [25, 62], yr = [0, 220], X = g => x + w * (g - xr[0]) / (xr[1] - xr[0]);
    cardHead(t, 0.5, LM - 26, py - 76, w + 126, 'Listed hours at 1 kHz against weight, wireless', ['measured', 'claim']);
    /* the corner nobody has rated: left of the lightest rated mouse */
    const kz = ep(t, 3.0, 3.8, E.io3);
    if (light && kz > 0) line(X(light.x), py, X(light.x), py + ph * kz, { color: C.red, w: 1.5, dash: [6, 6] });
    const sc = scatter(t, {
      x, y: py, w, h: ph, t0: 0.6, xr, yr, xticks: [30, 40, 50, 60], yticks: [0, 50, 100, 150, 200],
      xfmt: v => v + ' g', yfmt: v => v + ' h', xlabel: 'Weight, {g}', better: { x: -1, y: 1 }, sweet: true, frontier: true,
      points: rated.length ? rated : [{ name: 'placeholder', x: 49, y: 180 }], placeholder: !rated.length,
      target: { x: 29, y: 200, name: 'Theseus target', sub: '29 g, 200 h, measured', dx: 26, dy: 10 }
    });
    /* every light mouse with no rating: a red tick on the axis where it sits */
    const kt = ep(t, 3.4, 3.9);
    unr.forEach((u, i) => { const ux = X(u.g); if (ux >= x && ux <= x + w) line(ux, py + ph - 22, ux, py + ph - 4, { color: C.red, w: 2.5, alpha: kt }); });
    if (light) text('No rating found', X(light.x) - 14, py + ph - 34, { role: 'label', size: 20, color: C.redL, align: 'right', alpha: kt });
    /* the list, so every red tick has a name */
    const lx = 1400, ly = py - 30, lk = ep(t, 3.6, 4.0);
    text('No 1 kHz rating found', lx, ly, { role: 'label', size: 21, color: C.redL, alpha: lk });
    line(lx, ly + 16, RM, ly + 16, { color: C.hair, w: 1.5, alpha: lk });
    unr.forEach((u, i) => {
      const yy = ly + 56 + i * 39, k = ep(t, 3.7 + i * 0.05, 4.1 + i * 0.05);
      line(lx, yy - 9, lx + 14, yy - 9, { color: C.red, w: 2.5, alpha: k });
      text(u.name + (u.id === 'finalmouse-slx' ? ' †' : ''), lx + 26, yy, { role: 'small', size: 24, weight: 600, color: C.ink, alpha: k });
      text(ntr_g(u.g) + '\u00A0g', RM, yy, { font: 'mono', size: 22, weight: 600, color: u.ev === 'measured' ? C.ink2 : C.mute, align: 'right', alpha: k });
    });
    const dc = TH ? '#5F5E59' : '#B9B8B2';
    legend(t, 4.2, LM, 920, [{ kind: 'dot', color: dc, label: 'Weighed by RTINGS' }, { kind: 'ring', color: dc, label: 'Maker\'s weight' }, { kind: 'line', color: C.ink, label: 'Pareto frontier' }, { kind: 'hero', label: 'Theseus target' }]);
    const un = (sc.unnamed || []);
    source(t, (un.length ? 'Unnamed: ' + un.join(', ') + '. ' : '') + '* Report rate not stated. † Finalmouse publishes no hour rating (Back2Gaming). Hours are the makers\' own figures.', { t0: 4.4 });
  }
});

/* ============================== 10. 29 g: the decision. Built like the XA25, the cell gets 4.9 g ============================== */
function ntr_budget() {
  const P = ntr_xa25() || [], cable = P.find(p => /cable \(interior\)/i.test(p.name)), total = P.reduce((a, p) => a + p.g, 0);
  const body = P.filter(p => p !== cable).map(p => ({ name: p.name.replace(/\s*\(main-button part\)/, '').replace(/^Button$/, 'Buttons'), g: p.g }));
  const base = total - (cable ? cable.g : 0), room = 29 - base, L = ntr_loads();
  const fam = (((RD.batteries || {}).jauch_lipo_family || {}).rows || []).map(r => ({ part: r.part, mAh: rv(r.capacity), g: rv(r.mass), wh: rv(r.energy_Wh) })).map(p => Object.assign(p, { h1: p.wh / L.w1, h8: p.wh / L.w8 }));
  const opt = ['LP402025JU', 'LP502030JH', 'LP402535JU'].map((id, i) => { const p = fam.find(q => q.part === id); return p ? Object.assign({ key: 'ABC'[i] }, p) : null; }).filter(Boolean);
  return { body, base, room, total, cable, L, fam, opt, ok: P.length > 0 && fam.length > 0 };
}
/** a band block with my own label and its pills on the right */
function ntr_band(t, t0, label, head, body, kinds) {
  const x = W / 2 + 40, w = RM - x;
  bandBlock(t, t0, x, w, label, head, body, { right: (y, a) => { let xr = x + w; for (let i = kinds.length - 1; i >= 0; i--) { const pw = pillW(kinds[i]); xr -= pw; pill(xr, y + 1, kinds[i], a); xr -= 10; } } });
}
S({
  id: 'budget', ch: 'intro', theme: 'paper', title: '29 g: the decision', settle: 11, ideas: ['weight', 'battery'],
  src: ['exXbabWeight', 'exJauch', 'ntrJauch', 'ntrTpuV4', 'exNbcV4', 'x2fCrazy'],
  draw: t => {
    header(t, '29 g: the decision');
    const B = ntr_budget();
    const A = B.opt[0], Bo = B.opt[1], Co = B.opt[2], fmt1 = v => fmtN(v, 1), cut = p => p.g - B.room;
    const drop = p => 100 * (1 - p.wh / 200 / B.L.w1);
    captions(t, [[0.6, `Built like the XBAB XA25, a 29 g wireless Theseus has ${fmt1(B.room)} g left for its cell: a ${A ? A.mAh : '–'} mAh pack, about ${A ? fmtN(A.h1, 0) : '–'} h at 1 kHz. My target is 200 h.`],
      [5.8, `Three ways to 200 h: cut ${Co ? fmt1(cut(Co)) : '–'} g from the shell for a ${Co ? Co.mAh : '–'} mAh cell, draw ${A ? fmtN(drop(A), 0) : '–'}% less than a Viper V4 Pro, or let it weigh ${Co ? fmtN(B.base + Co.g, 0) : '–'} g. I haven't chosen.`]]);
    /* left: everything but the cell, part by part, as XBAB weighed it */
    const lx = LM, lw = 640, y0 = 300, rh = 42, scale = 13;
    cardHead(t, 0.4, lx - 26, y0 - 46, lw + 26, 'An XA25 without its cable', ['claim']);
    B.body.forEach((p, i) => {
      const y = y0 + 40 + i * rh, t0 = 0.6 + i * 0.08, k = ep(t, t0, t0 + 0.35), kb = ep(t, t0 + 0.1, t0 + 0.9, E.snap);
      text(p.name, lx, y, { role: 'small', size: 25, weight: 600, color: C.ink, alpha: k });
      text(fmtN(p.g, 2) + '\u00A0g', lx + lw, y, { font: 'mono', size: 24, weight: 700, color: C.ink, align: 'right', alpha: k });
      rr(lx, y + 9, lw - 130, 7, 3.5, C.track, null, 0, k);
      rr(lx, y + 9, Math.max(7, (lw - 130) * p.g / scale * kb), 7, 3.5, C.ink, null, 0, k);
    });
    const ys = y0 + 40 + B.body.length * rh + 8, ks = ep(t, 1.6, 2.0);
    line(lx, ys - 22, lx + lw, ys - 22, { color: C.ink, w: 1.5, alpha: ks });
    rich([{ s: 'Before a cell', role: 'small', size: 25, weight: 700, color: C.ink }], lx, ys + 8, { alpha: ks });
    text(fmtN(B.base, 2) + '\u00A0g', lx + lw, ys + 8, { font: 'mono', size: 26, weight: 800, color: C.ink, align: 'right', alpha: ks });
    text(`${fmtN(B.total, 2)} − ${fmtN(B.cable ? B.cable.g : 0, 2)} cable`, lx, ys + 36, { role: 'label', size: 19, color: C.faint, alpha: ks });
    const yc = ys + 76, kc = ep(t, 2.0, 2.5);
    rect(lx - 16, yc - 34, 6, 52 * kc, { fill: C.hero });
    text('Left for a cell at 29 g', lx, yc, { role: 'small', size: 25, weight: 800, color: C.ink, alpha: kc });
    rich([{ s: fmtN(B.room, 2), role: 'stat', size: 52, color: C.ink, tnum: true, count: [2.0, 0.8] }, { s: 'g', font: 'mono', size: 24, weight: 600, color: C.mute, gap: 8 }], lx + lw, yc + 6, { t, align: 'right', alpha: kc });
    pill(lx, yc + 32, 'derived', kc);
    text('29 − ' + fmtN(B.base, 2), lx + pillW('derived') + 12, yc + 32, { font: 'mono', size: 21, weight: 600, color: C.mute, alpha: kc });
    /* right: every Jauch pouch cell, mass against hours at 1 kHz; the 29 g line and the 200 h line cross in an empty corner */
    const px = 930, py = 392, pw = RM - px - 30, ph = 356, xr = [0, 13], yr = [0, 350];
    const PX = g => px + pw * (g - xr[0]) / (xr[1] - xr[0]), PY = h => py + ph - ph * (h - yr[0]) / (yr[1] - yr[0]);
    cardHead(t, 0.8, px - 110, y0 - 46, RM - px + 110, 'Cell mass against hours, 1 kHz', ['datasheet', 'projected']);
    const a0 = ep(t, 1.0, 1.5);
    for (const v of [0, 100, 200, 300]) { line(px, PY(v), px + pw, PY(v), { color: C.hair, w: 1.2, alpha: a0 }); text(v + ' h', px - 14, PY(v) + 7, { role: 'tick', color: C.mute, align: 'right', alpha: a0 }); }
    for (const v of [2, 4, 6, 8, 10, 12]) { line(PX(v), py + ph, PX(v), py + ph + 8, { color: C.faint, w: 1.5, alpha: a0 }); text(v + ' g', PX(v), py + ph + 34, { role: 'tick', color: C.mute, align: 'center', alpha: a0 }); }
    rect(px, py, pw, ph, { color: inkA(0.7), w: 1.5, alpha: a0 });
    text('Cell mass', px - 14, py + ph + 34, { role: 'label', size: 20, color: C.mute, align: 'right', alpha: a0 });
    /* the top axis: the same grams, as the whole mouse built like the XA25 */
    text('Whole mouse', px - 14, py - 16, { role: 'label', size: 20, color: C.mute, align: 'right', alpha: a0 });
    for (const m of [26, 32, 34, 36]) { const g = m - B.base; if (g < xr[0] || g > xr[1]) continue; line(PX(g), py - 8, PX(g), py, { color: C.faint, w: 1.5, alpha: a0 }); text(String(m), PX(g), py - 16, { role: 'tick', size: 20, color: C.mute, align: 'center', alpha: a0 }); }
    const k29 = ep(t, 1.8, 2.6, E.cam), k200 = ep(t, 2.2, 3.0, E.cam), xr29 = PX(B.room), y200 = PY(200);
    /* the empty corner: lighter than 29 g and longer than 200 h. No cell is there */
    const kz = ep(t, 3.0, 3.6);
    ntr_hatch(px, py, (xr29 - px), (y200 - py), rgba(C.red, 0.28), kz, 14);
    text('No cell here', px + 16, py + 40, { role: 'label', size: 20, color: C.redD, alpha: kz });
    line(xr29, py + ph, xr29, py + ph - ph * k29, { color: C.heroText, w: 2.5, dash: [9, 7] });
    line(px, y200, px + pw * k200, y200, { color: C.heroText, w: 2.5, dash: [9, 7] });
    ntr_chip('29 g', xr29 - 34, py - 16, ep(t, 2.4, 2.8));
    text('200 h target', px + pw - 12, y200 - 14, { role: 'label', size: 20, color: C.heroText, align: 'right', alpha: ep(t, 2.8, 3.2) });
    /* every pack in the family, grey; my three candidates, yellow */
    B.fam.forEach((p, i) => { if (B.opt.some(o => o.part === p.part)) return; const k = ep(t, 1.2 + i * 0.05, 1.6 + i * 0.05, E.snap); circle(PX(p.g), PY(p.h1), 8 * k, { fill: '#5F5E59' }); });
    const labs = { A: { dx: 18, dy: 30, al: 'left' }, B: { dx: 18, dy: 12, al: 'left' }, C: { dx: -18, dy: -30, al: 'right' } };
    B.opt.forEach((o, i) => {
      const k = ep(t, 3.4 + i * 0.35, 3.9 + i * 0.35, E.snap), ox = PX(o.g), oy = PY(o.h1), L = labs[o.key], lx2 = ox + L.dx, ly2 = oy + L.dy;
      heroMark(ox, oy, 13 * k, 1);
      const c2 = cut(o), fits = c2 <= 0.2;
      rich([{ s: o.key, font: 'disp', size: 30, weight: 800, color: C.ink }, { s: o.mAh + ' mAh', font: 'mono', size: 22, weight: 700, color: C.ink, gap: 10 }], lx2, ly2, { alpha: k, align: L.al });
      text(fmtN(o.h1, 0) + ' h, ' + (fits ? 'fits at ' + fmtN(B.base + o.g, 1) + ' g' : 'cut ' + fmtN(c2, 1) + ' g'), lx2, ly2 + 28, { role: 'small', size: 23, weight: 600, color: C.ink2, align: L.al, alpha: k });
    });
    /* the third lever: the same cell, a lower draw */
    if (Bo) {
      const kd = ep(t, 5.0, 5.8, E.io3), bx = PX(Bo.g) - 4, by0 = PY(Bo.h1) - 18, by1 = y200 + 10;
      if (kd > 0) { line(bx, by0, bx, lerp(by0, by1, kd), { color: C.heroText, w: 2, dash: [5, 5] }); if (kd > 0.95) ntr_head(bx, by1, 0, -1, 12, C.heroText); }
      text('−' + fmtN(drop(Bo), 0) + '% draw', bx - 14, (by0 + by1) / 2 + 6, { role: 'label', size: 20, color: C.heroText, align: 'right', alpha: ep(t, 5.6, 6.0) });
    }
    gloss(t, 6.4, 'Hours = Wh ÷ draw', `At 1 kHz, ${fmtN(B.L.w1 * 1000, 2)} mW: a Viper V4 Pro's ${fmtN(B.L.wh, 3)} Wh cell over Razer's ${B.L.h1} h. A cell: 3.7 V × its listed mAh.`);
    ntr_band(t, 6.8, 'The decision', 'Not made yet', `A fits, at ${A ? fmtN(A.h1, 0) : '–'} h. C makes ${Co ? fmtN(Co.h1, 0) : '–'} h if ${Co ? fmt1(cut(Co)) : '–'} g comes out of ${fmtN((B.body[0] || {}).g || 0, 1)} g of shell and skates. B needs ${Bo ? fmt1(cut(Bo)) : '–'} g out and ${Bo ? fmtN(drop(Bo), 0) : '–'}% less draw.`, ['proposal', 'projected']);
    source(t, 'XA25 parts: XBAB\'s own scale. Cells: Jauch via Endrich, rounded. Radio, PMIC, antenna and USB-C are not counted: every total is a floor.', { t0: 3 });
  }
});

/* ============================== 11. the map: seven areas, each pointed at the part it rebuilds, on the exploded shell ============================== */
/* anchors are stage px on the settled frame (camera still from t = 3.4); each chapter points at one part */
const NTR_MAP = {
  v: [470, 236, 980, 760],
  cam: { view: 'threeQuarterRight', yaw: 0.0, pitch: 0.12, zoom: 1.06 },
  items: [
    { key: 'click', part: 'The triggers', side: 'l', y: 330, at: [760, 455] },
    { key: 'surface', part: 'Wheel and coating', side: 'l', y: 500, at: [792, 514] },
    { key: 'elec', part: 'Board and radio', side: 'l', y: 670, at: [722, 845] },
    { key: 'glide', part: 'Skates and lens', side: 'l', y: 840, at: [757, 888] },
    { key: 'shape', part: 'The hump', side: 'r', y: 380, at: [1040, 525] },
    { key: 'shell', part: 'Shell and base', side: 'r', y: 600, at: [1150, 600] },
    { key: 'own', part: 'Screws you can reach', side: 'r', y: 820, at: [1123, 800] }
  ]
};
S({
  id: 'map', ch: 'intro', theme: 'night', title: 'Seven areas, each down to the part', settle: 8, three: ['shell'],
  src: ['ntrScan'],
  draw: t => {
    header(t, 'Seven areas, each down to the part');
    captions(t, [[0.6, 'One chapter per area, and every part of the mouse belongs to one of them.']]);
    const M0 = NTR_MAP, [vx, vy, vw, vh] = M0.v, c = M0.cam;
    ntr_prime('shell', t, vw, vh);
    const ke = ep(t, 0.5, 3.0, E.io3), kc = ep(t, 0.2, 3.4, E.cam);
    const mst = { view: c.view, view2d: 'right', yaw: c.yaw - 0.35 * (1 - kc), pitch: c.pitch - 0.05 * (1 - kc), zoom: lerp(c.zoom * 0.9, c.zoom, kc), explode: ke, colorway: 'black' };
    view3D('shell', t, vx, vy, vw, vh, mst, { alpha: ep(t, 0.2, 0.9) });
    /* in 2D the leaders land on the parts of the exploded elevation, wherever the explode has carried them */
    const AT2 = V2D.on ? ntr_mapAt(mst, M0.v) : null;
    /* the chapters, as callouts: number and icon in the chapter's colour, the name, the part it rebuilds, its idea count */
    M0.items.forEach((it0, i) => {
      const it = AT2 && AT2[it0.key] ? Object.assign({}, it0, { at: AT2[it0.key] }) : it0;
      const t0 = 3.4 + i * 0.16, k = ep(t, t0, t0 + 0.45), A = acc(it.key), ci = DECK.chapters.findIndex(ch => ch.key === it.key), ch = DECK.chapters[ci] || {};
      if (k <= 0.003) return;
      const n = chapterIdeaCount(it.key), cnt = n ? n + (n === 1 ? ' idea' : ' ideas') : '';
      const bw = Math.max(tw(ch.name || it.key, { role: 'h3', size: 30 }), tw(it.part, { role: 'label', size: 20 }) + (cnt ? 40 + tw(cnt, { role: 'label', size: 20 }) : 0));
      const left = it.side === 'l', bx = left ? LM : RM, ex = left ? LM + bw + 18 : RM - bw - 18, ey = it.y - 8;
      /* leader: from the block's edge, an elbow to the part, a dot on the part */
      const kl = ep(t, t0 + 0.15, t0 + 0.7, E.snap);
      poly([[ex + (left ? 12 : -12), ey], [lerp(ex, it.at[0], 0.35), ey], [it.at[0], it.at[1]]], { color: A, w: 1.5, p: kl, alpha: 0.9 });
      if (kl > 0.95) { circle(it.at[0], it.at[1], 5, { fill: A }); circle(it.at[0], it.at[1], 11, { color: A, w: 1.5, alpha: 0.5 }); }
      chapterIcon(it.key, left ? bx : bx - 22, it.y - 72, 22, A, k);
      text(pad2(ci), left ? bx + 34 : bx - 34, it.y - 54, { role: 'label', size: 21, color: A, align: left ? 'left' : 'right', alpha: k });
      text(ch.name || it.key, bx, it.y - 10, { role: 'h3', size: 30, color: C.ink, align: left ? 'left' : 'right', alpha: k });
      rich([{ s: it.part, role: 'label', size: 20, color: C.mute }, cnt ? { s: '/', role: 'label', size: 20, color: C.faint, gap: 14 } : null, cnt ? { s: cnt, role: 'label', size: 20, color: C.faint, gap: 14 } : null], bx, it.y + 22, { alpha: k, align: left ? 'left' : 'right' });
    });
    rich([{ s: 'Fig. 00', role: 'label', size: 21, color: C.mute }, { s: 'Sora V2 shape, a placeholder', role: 'label', size: 21, color: C.faint, gap: 16 }], LM, LAY.ruleY - 24, { alpha: ep(t, 4.6, 5.2) });
    if (typeof location !== 'undefined' && /ntrgrid/.test(location.search)) { for (let gx = 400; gx <= 1500; gx += 50) { line(gx, 230, gx, 1000, { color: '#ff3355', w: gx % 100 ? 0.5 : 1, alpha: 0.6 }); if (gx % 100 === 0) text(String(gx), gx + 2, 244, { font: 'mono', size: 12, color: '#ff3355' }); } for (let gy = 250; gy <= 1000; gy += 50) { line(400, gy, 1500, gy, { color: '#ff3355', w: gy % 100 ? 0.5 : 1, alpha: 0.6 }); if (gy % 100 === 0) text(String(gy), 404, gy - 2, { font: 'mono', size: 12, color: '#ff3355' }); } }
  }
});
