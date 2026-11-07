/* ============================================================================================
   INTRO (chapter code ntr). The first impression, in this order:
     cover, thesis (how every number is labelled), targets, targets2, flagships, [ntr_stats: 14-d-intro.js],
     zerograms (F = m · a), weightgap (listed against weighed), [ntr_density, ntr_sizewt, ntr_densrank: 14-d-intro.js],
     pricefront (price against weight), market (battery life against weight), budget (THESEUS.mass, THESEUS.hours), map
   The close is in 10-i-close.js. Data comes from research/data (RDATA, read with rv / evOf / exMouse / exWeight from
   14-a-exdata.js). Theseus numbers are PROPOSAL (a target) or PROJECTED (a forecast, formula on screen).
   Validation report 2026-11-03 applied, then Brock (22:05): the sensor is the PixArt PAW3970, the Viper V4 Pro's (Razer's
   Focus Pro 50K Gen-3, its frame sync built in); "FrameSync" is Razer's name for it. The
   Starlight X has no hour rating, the module is the Raytac AN54LM-P20A, long antenna (Brock, 21:55). Theseus's numbers come
   from THS / THESEUS (05-data.js).
   ============================================================================================ */
Object.assign(SRC, {
  exPrices: { t: 'US list prices: maker stores and product pages (Pulsar, Ninjutso, Lamzu, Keychron, Finalmouse, Razer, Logitech, WLMOUSE), via research/data/mice.json', n: 'A price range is plotted at its lowest price. Prices as listed when collected, 2026.' },
  ntrB2g: { t: 'Back2Gaming, Finalmouse Starlight X review: 41.58 g weighed; Finalmouse does not publish an hour rating', u: 'https://www.back2gaming.com/review/finalmouse-starlight-x-nightfall-wireless-mouse/' },
  ntrRtSlx: { t: 'RTINGS, Finalmouse Starlight X review: 41.7 g default weight (2026-10-22)', u: 'https://www.rtings.com/mouse/reviews/finalmouse/starlight-x' },
  ntrEloSlx: { t: 'EloShapes, Finalmouse Starlight X: 38 g as listed by Finalmouse', u: 'https://www.eloshapes.com/mouse/compare?p=finalmouse-starlight-x' },
  ntrTpuV4: { t: 'TechPowerUp, Razer Viper V4 Pro: 306 mAh at 3.87 V (1.184 Wh), about 40 h at 8 khz, 0.169 A charging, 79 µs click latency wired at 8 khz', u: 'https://www.techpowerup.com/review/razer-viper-v4-pro/', n: 'Values as recorded in the 2026-11-03 validation report; TechPowerUp refused this session.' },
  ntrXbabClick: { t: 'XBAB Tech on X, 2026-06-30: click latency on a Beagle USB 480 analyzer, XA25 72 µs against Endgame Gear OP1 8k v2 320 µs (NC release, mouse still, n = 500 each); a maker testing its own mouse and a rival', u: 'https://x.com/xbabtech/status/2071972219211985258' },
  ntrJauch: { t: 'Endrich (Jauch distributor), lithium-polymer packs, capacity and mass per part: LP402025JU 140 mAh 5 g, LP502030JH 250 mAh 7.5 g, LP422339JU 330 mAh 8 g, LP402535JU 370 mAh 8 g (rounded listing)', u: 'https://www.endrich.com/en/product-categories/accus-batteries/lithium-ion-cells/lithium-polymer-batteries?page=2', n: 'Farnell lists LP402535JU at 380 mAh; the lower figure is used.' },
  ntrEemb: { t: 'EEMB, LP402535 lithium-polymer battery: 3.7 V, 320 mAh typical, 300 mAh minimum, approximately 6.40 g, 25.5 × 37.0 × 4.30 mm', u: 'https://www.eemb.com/product-214', n: 'Theseus\'s battery from 2026-11-06 (Brock: "the battery should only need to be 300mah"). The minimum capacity is used, as for Jauch; the mass is EEMB\'s approximate figure.' },
  ntrGpx2: { t: 'PC Gamer, Logitech G Pro X Superlight 2 review: 95 h, $159 (2023)', u: 'https://www.pcgamer.com/logitech-g-pro-x-superlight-2-gaming-mouse-review/' },
  ntrGpx2c: { t: 'Logitech, Pro X Superlight 2c: 51 g, up to 95 h', u: 'https://www.logitechg.com/en-us/shop/p/pro-x-superlight-2c' },
  ntrDaV4: { t: 'Razer, DeathAdder V4 Pro: 150 h (report rate not stated)', u: 'https://www.razer.com/gaming-mice/razer-deathadder-v4-pro' },
  ntrZowie: { t: 'ZOWIE, EC2-DW and U2-DW: 80 h at 1 khz, 60 g', u: 'https://zowie.benq.com/en-us/mouse/ec2-dw.html' },
  ntrXiaomi: { t: 'Notebookcheck, Xiaomi Gaming Mouse 2: 530 mAh, 160 h at 1 khz, about 58 g', u: 'https://www.notebookcheck.net/Xiaomi-launches-new-affordable-8K-wireless-gaming-mouse-with-flagship-PixArt-sensor.1293650.0.html' },
  ntrKeychron: { t: 'Keychron, G3: 44 g, up to 160 h', u: 'https://www.keychron.com/products.json' },
  ntrRazerV4: { t: 'Razer, Viper V4 Pro: $159.99 US list', u: 'https://www.razer.com/gaming-mice/razer-viper-v4-pro' },
  ntrStores: { t: 'Maker stores: Finalmouse Starlight X $179, Ninjutso Sora V3 $119.99, Endgame Gear OP1 8k v2 $89.99, XBAB XA25 $169', u: 'https://ninjutso.com/products.json' },
  ntrV4Sensor: { t: 'igor\'sLAB, Razer Viper V4 Pro review: Focus Pro 50K Gen-3 optical sensor, 50,000 DPI in 1-DPI steps, 930 IPS, 90 G, true 8,000 Hz polling, Frame Sync, a 26-level asymmetric cut-off, 99.8% resolution accuracy. Brock: the Focus Pro 50K Gen-3 is PixArt\'s PAW3970 under Razer\'s name (Razer has it alone for about two years); Theseus uses it', u: 'https://www.igorslab.de/en/razer-viper-v4-pro-review-49-grams-8-000-hz-competitive-gaming/2/' },
  ntrDelrinRho: { t: 'Delrin 150 data sheet (Plastics International): specific gravity 1.42 g/cc (ASTM D792)', u: 'https://www.plasticsintl.com/media/05oith4t/delrin-150-data-sheet.pdf' },
  ntrBrassRho: { t: 'Austral Wright Metals, C38500 free-cutting brass: density 8.47 g/cm³ at 20 °C', u: 'https://www.australwright.com.au/technical-data/alloys/copper-brass/c38500-free-cutting-brass/' },
  ntrTiRho: { t: 'ASM Aerospace Specification Metals, titanium Ti-6Al-4V (grade 5), annealed: density 4.43 g/cc', u: 'https://www.aerospacemetals.com/wp-content/uploads/2023/07/Titanium-Ti-6Al-4V-Grade-5-Annealed.pdf', n: 'Brock chose titanium screws (F25.4); they were brass-plated carbon steel.' },
  ntrGoreWire: { t: 'GORE PTFE hook-up wire, Type ET, 32 AWG (7/40), G01A180: outside diameter 0.020 to 0.024 in, nominal weight 0.49 lb per 1,000 ft (0.73 mg per mm)', u: 'https://kr.gore.com/system/files/2021-04/GORE_PTFE_Hook-Up_Wire.pdf', n: 'The 3D model\'s wires are 0.52 mm across, Type ET\'s size; Brock: three 32 AWG wires of 40 AWG strands (F21.10).' },
  ntrModel3d: { t: 'This deck\'s 3D model of Theseus (3d/): four M2 × 4 pan-head screws (3d/shell meta.screws, parts/fasteners.js, 23.6 mm³ each by its own mesh); the side-button lead, J3 to the two side switches (pcb/tools/components.py SIDELEAD, shell.js), three wires on a 6 mm lay, 109 mm of wire in all; the battery\'s lead belongs to the battery, which Jauch weighs with its leads', u: '', n: 'A design model built for the deck, not a weighed part.' },
  ntrScan: { t: 'The shape on screen is a placeholder: the Ninjutso Sora V2/V3, from Brock\'s own 3D scan (refs/scan, local only)', u: '' }
});

/* ---------- shared helpers ---------- */
const NTR = { primed: typeof WeakSet !== 'undefined' ? new WeakSet() : null };
/** a research field of a mouse: { v, ev } from its first entry (lists put the strongest evidence first) */
function ntr_fv(id, k) { const m = exMouse(id); if (!m || m[k] == null) return null; const x = Array.isArray(m[k]) ? m[k][0] : m[k]; const v = rv(x); return v == null ? null : { v, ev: evOf(x) }; }
/** the loads every Theseus battery forecast uses: a Viper V4 Pro's cell (TechPowerUp) over Razer's 180 h (1 khz) and TechPowerUp's ~40 h (8 khz) */
function ntr_loads() {
  const mp = (RD.batteries || {}).mouse_power_draw || [], r = mp.find(x => /cell energy/i.test(x.case || '')), wh = (r && rv(r.value)) || 1.184;
  const h1 = (ntr_fv('razer-viper-v4-pro', 'battery_claim_1k_h') || {}).v || 180, h8 = (ntr_fv('razer-viper-v4-pro', 'battery_measured_h') || {}).v || 40;
  return { wh, h1, h8, w1: wh / h1, w8: wh / h8 };
}
/** a pack from RDATA: Jauch's distributor family, or EEMB's (Theseus's own since 2026-11-06): { part, maker, mAh, g, wh } */
function ntr_pack(part) {
  for (const [k, maker] of [['jauch_lipo_family', 'Jauch'], ['eemb_lipo', 'EEMB']]) {
    const r = (((RD.batteries || {})[k] || {}).rows || []).find(x => x.part === part);
    if (r) return { part, maker: r.maker || maker, mAh: rv(r.capacity), mAhTyp: r.capacity_typical ? rv(r.capacity_typical) : null, g: rv(r.mass), wh: rv(r.energy_Wh) };
  }
  return null;
}
/** Theseus's battery (THESEUS.pack): EEMB's LP402535, 300 mAh minimum, about 6.40 g (Brock, 17:08: "the battery should
   only need to be 300mah", about the Viper V4 Pro's 306) */
const ntr_thsPack = () => ntr_pack(THESEUS.pack) || { part: 'LP402535', maker: 'EEMB', mAh: 300, mAhTyp: 320, g: 6.4, wh: 1.11 };
/** the pack it replaced, the one the 1.6 g saving is said against: Jauch's LP402535JU, 370 mAh, 8 g in Endrich's
   rounded listing (EEMB's 6.40 g is approximate, so the saving is too: about 1.6 g) */
const ntr_oldPack = () => ntr_pack('LP402535JU') || { part: 'LP402535JU', maker: 'Jauch', mAh: 370, g: 8, wh: 1.369 };
/** the share of the Viper V4 Pro's draw Theseus keeps: less its two optical switches (b03's B03.optShare, from Logitech's
   own hours: 13.7 %), with Theseus's two mechanical ones read by strobed pull-ups (B03.mechShare, 0.35 %), as the clicks
   chapter works it, so the two can't drift. Firmware gains are not counted: no figure for them exists */
function ntr_swKeep() {
  let B = null; try { B = B03; } catch (e) { B = null; }   /* B03 is a const declared later (30-b03): before it runs, the same formula */
  const v4MA = (B && B.v4MA) || 306 / 180;
  const opt = B && B.optShare != null ? B.optShare : (290 / 96 - 290 / 104) / v4MA, mech = B && B.mechShare != null ? B.mechShare : 2 * 3 / 1000 / v4MA;
  return { opt, mech, keep: 1 - opt + mech };
}
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
/** Theseus's name or number as its own tag: type in Theseus's colour, no block */
function ntr_chip(s, x, y, a = 1, o = {}) { return heroTag(x, y, null, s, { a, size: o.size || 21, right: o.align === 'right' }); }
/** a short arrowhead pointing along (dx, dy) at (x, y) */
function ntr_head(x, y, dx, dy, s, col, a = 1) { const l = Math.hypot(dx, dy) || 1, ux = dx / l, uy = dy / l; G.save(); G.globalAlpha = a; G.fillStyle = col; G.beginPath(); G.moveTo(x, y); G.lineTo(x - ux * s - uy * s * 0.5, y - uy * s + ux * s * 0.5); G.lineTo(x - ux * s + uy * s * 0.5, y - uy * s - ux * s * 0.5); G.closePath(); G.fill(); G.restore(); }
/** a column of glossBox / sourceBox tiles on the stage's 40 px grid: each height rounded up to the grid, 40 between them.
   items: [{ t0, gloss: true | source, a (term | who), b (definition | finding), o }]. returns the y under the last */
function ntr_stack(t, x, y, w, items) {
  let yy = y;
  for (const it of items) {
    const f = it.gloss ? glossBox : sourceBox, m = f(-1, 1e9, x, yy, w, it.a, it.b, it.o || {}), h = Math.ceil(m.h / 40) * 40;
    f(t, it.t0, x, yy, w, it.a, it.b, Object.assign({}, it.o || {}, { h }));
    yy += h + 40;
  }
  return yy;
}
/** the map's anchors on the flat, exploded elevation: one point on the part each chapter rebuilds */
function ntr_mapAt(st, box) {
  const at = (re, f) => v2dAt('shell', st, box, re, f);
  return {
    click: at(/^explodeL\/.*\/triggerL$/, 'c'), surface: at(/\/wheel\/tread$/, [0.5, 0.75, 0.5]), elec: at(/^body\/lens/, [0.5, 0.5, 0.5]),
    glide: at(/DotSkate\/glide$/, [0.5, 0.2, 0.5]), shape: at(/^body\/body$/, [0.5, 0.97, 0.36]), shell: at(/^body\/body$/, [1, 0.42, 0.5]), own: at(/M2Screw\/head$/, [0.5, 0.5, 0.5])
  };
}
function ntr_hatch(x, y, w, h, col, a = 1, step = 14) { if (a <= 0.003 || w <= 0 || h <= 0) return; G.save(); G.beginPath(); G.rect(x, y, w, h); G.clip(); G.globalAlpha = a; G.strokeStyle = col; G.lineWidth = 1.2; G.beginPath(); for (let s = -h; s < w + h; s += step) { G.moveTo(x + s, y + h); G.lineTo(x + s + h, y); } G.stroke(); G.restore(); }

/* ============================== 01. cover: THESEUS, the gram scale under it, the line, four numbers ============================== */
/* Brock (07:20): keep this form (his reference image), drop the flat 2D mouse, new numbers. In 3D the shell still
   assembles beside the word; in 2D the word, the scale and the numbers carry the cover on their own. */
const NTR_COV = { size: 280, x0: 64, yb: 462, v: [1222, 120, 730, 690], zoom: [1.06, 1.2] };
S({
  id: 'cover', first: true, ch: 'intro', theme: 'night', chrome: false, title: 'Theseus: in pursuit of an objectively better mouse', settle: 8,
  sfx: [[2.15, 'tick'], [2.35, 'tick'], [2.55, 'tick'], [2.75, 'tick']],
  src: ['exPiaknow', 'kunai', 'usbHs', 'ntrScan'],
  draw: t => {
    const C0 = NTR_COV, [vx, vy, vw, vh] = C0.v;
    /* top row: the studio, and the rule the whole deck follows */
    chapterIcon('intro', LM, LAY.labelY - 19, 22, C.hero, ep(t, 0.1, 0.4));
    text('Nitrite Labs', LM + 36, LAY.labelY, { role: 'label', color: C.ink2, t, t0: 0.15, cps: 40 });
    rich([{ s: 'Optimization', role: 'label', color: C.faint }, { s: 'over', role: 'label', color: C.faint, gap: 12 }, { s: 'opinion', role: 'label', color: C.heroText, grad: C.heroGrad, gap: 12 }], RM, LAY.labelY, { align: 'right', alpha: ep(t, 0.4, 0.8) });
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
    /* Brock, F12.2: no shell on the cover in 3D mode either ("the 3d mode should not show the shell cover") */
    if (NTR_SHELL3D && !V2D.on) {
      ntr_prime('shell', t, vw, vh);
      const as = ep(t, 0.6, 4.6, E.io3), cam = ep(t, 0.3, 7.6, E.io3), drift = t > 7.6 ? Math.sin((t - 7.6) * 0.22) : 0;
      view3D('shell', t, vx, vy, vw, vh, { view: 'threeQuarterRight', view2d: 'right', yaw: lerp(-0.5, 0.02, cam) + 0.05 * drift, pitch: 0.06 * (1 - cam), zoom: lerp(C0.zoom[0], C0.zoom[1], cam), explode: 0.72 * (1 - as), colorway: 'black' }, { alpha: ep(t, 0.35, 1.4) });
      rich([{ s: 'Fig. 00', role: 'label', size: 21, color: C.mute }, { s: 'Sora V2 shape, a placeholder', role: 'label', size: 21, color: C.faint, gap: 16 }], RM, 744, { align: 'right', alpha: ep(t, 4.8, 5.4) });
    }
    /* the gram scale under the word, one tick a gram, with Theseus's weight (THS.mass) in its colour */
    const ry = yb + 44, kr = ep(t, 1.0, 1.9, E.cam), rx1 = x0 + 14 + (wordW - 14) * kr, gpx = 12, mx = x0 + 14 + THESEUS.mass * gpx;
    line(x0 + 14, ry, rx1, ry, { color: inkA(0.35), w: 1.5 });
    for (let i = 0; x0 + 14 + i * gpx <= rx1; i++) { const X = x0 + 14 + i * gpx, L = i % 10 === 0 ? 16 : i % 5 === 0 ? 10 : 6; line(X, ry, X, ry + L, { color: inkA(i % 10 === 0 ? 0.5 : 0.25), w: 1.2 }); }
    rect(x0 + 14, ry - 3, THESEUS.mass * gpx * ep(t, 1.6, 2.1, E.out3), 6, { fill: C.hero });
    text('0', x0 + 14, ry + 40, { role: 'tick', size: 19, color: C.faint, alpha: ep(t, 1.4, 1.8) });
    text(THS.mass, mx, ry + 40, { role: 'tick', size: 19, weight: 700, color: C.heroText, align: 'center', alpha: ep(t, 1.9, 2.2) });
    /* the subtitle in three voices: a quiet run-in, the display claim, and the one word in Theseus's colour */
    rich([
      { s: 'In pursuit of an', role: 'labelL', size: 28, color: C.mute, t0: 1.25, cps: 40 },
      { s: 'objectively better', role: 'h2', size: 60, color: C.ink, gap: 22, rise: [1.55, 0.8] },
      { s: 'mouse', role: 'h2', size: 60, color: C.heroText, grad: C.heroGrad, gap: 18, rise: [1.7, 0.8] }
    ], LM, 640, { t });
    /* four numbers, display figures next to their units */
    const cols = [
      { lab: 'Mass', n: THS.mass, u: 'g', sub: 'Weighed, every unit' },
      { lab: 'Motion latency, wireless', n: '0.14', u: 'ms', sub: 'On {piaknow}\'s rig' },
      { lab: 'Report rate', n: '8', u: 'khz', sub: 'Wired and wireless' },
      { lab: 'Ideas', n: '100', u: '+', sub: 'Each with its evidence' }
    ];
    const cw = (RM - LM) / 4;
    /* one size for all four, the widest one fitting its column */
    const nw = c => tw(c.n, { role: 'd1', size: 100, tnum: true }) / 100 + (c.u === '+' ? 0.75 : tw(c.u, { font: 'mono', size: 38, weight: 600 }) / 100 + 0.1);
    const nS = Math.min(132, Math.floor((cw - 44) / Math.max(...cols.map(nw))));
    cols.forEach((c, i) => {
      const x = LM + i * cw, t0 = 2.1 + i * 0.2, a = ep(t, t0, t0 + 0.4);
      if (i) line(x - 24, 770, x - 24, 770 + 190 * ep(t, t0 - 0.1, t0 + 0.5, E.cam), { color: inkA(0.14), w: 1.5 });
      text(c.lab, x, 786, { role: 'label', size: 21, color: C.mute, alpha: a, t, t0, cps: 60 });
      rich([{ s: c.n, role: 'd1', size: nS, color: C.ink, tnum: true, count: [t0, 1.0] }, { s: c.u, font: c.u === '+' ? 'disp' : 'mono', size: c.u === '+' ? Math.round(nS * 0.73) : 38, weight: c.u === '+' ? 800 : 600, color: c.u === '+' ? C.heroText : C.mute, grad: c.u === '+' ? C.heroGrad : null, gap: c.u === '+' ? 2 : 10 }], x - 6, 916, { t, alpha: a });
      text(c.sub, x, 962, { role: 'label', size: 19, color: C.faint, alpha: ep(t, t0 + 0.4, t0 + 0.8) });
    });
    /* the byline, on the chrome's rule */
    line(LM, LAY.ruleY, LM + (RM - LM) * ep(t, 0.3, 1.4, E.cam), LAY.ruleY, { color: C.hair, w: 1.5 });
    rich([{ s: 'Brock Liddicoat', role: 'foot', weight: 700, caps: true, track: 0.16, color: C.ink2 }, { s: '/', role: 'foot', color: C.faint, gap: 14 }, { s: 'Nitrite Labs', role: 'foot', caps: true, track: 0.12, color: C.mute, gap: 14 }, { s: '/', role: 'foot', color: C.faint, gap: 14 }, { s: 'Shape designer of the Finalmouse Starlight X', role: 'foot', caps: true, track: 0.12, color: C.faint, gap: 14 }], LM, LAY.footY, { alpha: ep(t, 2.6, 3.2) });
    text(`01 / ${pad2(DECK.slides.length)}`, RM, LAY.footY, { role: 'foot', weight: 600, color: C.mute, align: 'right', alpha: ep(t, 2.6, 3.2) });
    for (const [mx2, my] of [[40, 160], [40, 600]]) regMark(mx2, my, ep(t, 0.8, 1.3) * 0.4, 8, C.ink);
  }
});

/* ============================== 02. thesis: optimization over opinion. How every number in the deck is labelled ============================== */
/* Eight tiles. The top row: other people's numbers, each named by its source in quiet type (RTINGS, Jauch datasheet,
   Finalmouse claim) or marked Derived with its sum. The bottom row: my own (a target, an estimate, a forecast), which
   carry no tag: the words say whose they are. The last tile is the rule, and what missing data looks like. */
function ntr_specimens() {
  const slx = id => ntr_fv('finalmouse-slx', id) || {}, me = slx('weight_measured_g').v, cl = slx('weight_claimed_g').v, gap = (ntr_fv('finalmouse-slx', 'weight_gap_pct') || {}).v;
  const ch = ((RD.batteries || {}).chemistries || []).find(c => c.id === 'li_polymer_pouch_mouse'), cell = ch ? rv(ch.mass) : null;
  const H = ntr_hours(), p370 = H.cell, L = H.L, h370 = H.h1;
  return [
    { value: me != null ? fmtN(me, 1) : '–', unit: 'g', label: 'Starlight X, weighed', ev: 'measured', by: 'RTINGS' },
    { value: cell != null ? fmtN(cell, 1) : '–', unit: 'g', label: 'A 250 mAh battery, packed', ev: 'datasheet', by: 'Jauch' },
    { value: cl != null ? fmtN(cl, 0) : '–', unit: 'g', label: 'Starlight X, as listed', ev: 'claim', by: 'Finalmouse' },
    { value: gap != null ? '+' + fmtN(gap, 1) : '–', unit: '%', label: `(${fmtN(me || 0, 1)} − ${fmtN(cl || 0, 1)}) ÷ ${fmtN(cl || 0, 1)}`, ev: 'derived' },
    { value: THS.mass, unit: 'g', label: 'The weight I build to', head: 'My target', hero: true },
    { value: fmtN(THESEUS.pcb, 1), unit: 'g', label: 'Its one board', head: 'My estimate' },
    { value: h370 != null ? fmtN(Math.floor(h370), 0) : '–', unit: 'h', label: p370 ? `${fmtN(p370.wh, 3)} Wh ÷ ${fmtN(L.w1 * H.S.keep * 1000, 2)} mW` : '', head: 'My forecast, 1 khz' },
    { rule: true }
  ];
}
S({
  id: 'thesis', ch: 'intro', theme: 'paper', title: 'Optimization over opinion', settle: 10,
  src: ['ntrRtSlx', 'ntrEloSlx', 'exJauch', 'ntrJauch', 'ntrTpuV4', 'exNbcV4'],
  draw: t => {
    header(t, 'Optimization over opinion');
    captions(t, [[0.6, 'Every number in this deck names where it comes from: the tester who weighed it, the datasheet, the maker, or the sum.'],
      [5.4, 'My own numbers carry no tag: they are my targets and my plan, and the words say so. No source, no number.']]);
    const SP = ntr_specimens(), cell = bento(LM, 280, RM - LM, 680, 4, 2);
    SP.forEach((s, i) => {
      const r = cell(i % 4, Math.floor(i / 4)), t0 = 0.8 + i * 0.22;
      if (!s.rule) { statTile(t, t0, r, Object.assign({ quiet: !s.hero, align: 'center', size: s.hero ? 120 : 112 }, s)); return; }
      /* the rule, and what a gap looks like */
      const [x, y, w, h] = r, a = ep(t, t0, t0 + 0.55, E.snap); if (a <= 0.003) return;
      demoWindow(x, y, w, h, a);
      const ka = ep(t, t0 + 0.2, t0 + 0.7);
      text('The rule', x + 36, y + 58, { role: 'label', size: 20, color: C.mute, alpha: ka });
      text('No source, no number.', x + 36, y + 122, { role: 'h2', size: 40, color: C.ink, alpha: ka, maxW: w - 72, lh: 1.05 });
      text('Where nobody has the data, the slide says so, in red:', x + 36, y + h - 92, { role: 'small', size: 24, weight: 600, color: C.ink2, maxW: w - 72, lh: 1.3, alpha: ep(t, t0 + 0.5, t0 + 0.9) });
      pill(x + 36, y + h - 34, 'placeholder', ep(t, t0 + 0.7, t0 + 1.1));
    });
  }
});

/* ============================== 03, 04. the bar: the best figure anyone has shown, who holds it, how we know, my target ============================== */
/* each row: cat, best (as shown), bv (its value), who, note, ev, tgt (my target), tv, tq (the target's qualifier), better ('low' | 'high') */
const NTR_BAR_SPEED = [
  { cat: 'Motion latency, wired', sub: 'Same as the XBAB XA25', best: '0.13 ms', bv: 0.13, who: 'XBAB XA25', note: '{piaknow}, 8 khz, fw 1.08', ev: 'measured', tgt: '0.13 ms', tv: 0.13, tq: 'or less', better: 'low' },
  { cat: 'Motion latency, wireless', best: '0.34 ms', bv: 0.34, who: 'Razer Viper V4 Pro', note: '{piaknow}, 8 khz', ev: 'measured', tgt: '0.14 ms', tv: 0.14, tq: 'on the same rig', better: 'low' },
  /* Brock (F22.2): "Match SensorLock, 42 µs", frame to USB through Theseus's own firmware (Razer's FrameSync: 205 µs, on the same
     developer's rig); a match, so it sits with the quiet tiles, and the tile says whose figure it matches */
  { cat: 'Frame sync, frame to USB', sub: 'Same as XBAB SensorLock', best: '42 µs', bv: 42, who: 'XBAB SensorLock', note: 'Its developer, 8 khz; FrameSync 205 µs', ev: 'claim', tgt: '42 µs', tv: 42, tq: 'in its own firmware', better: 'low' },
  /* counted at NC release on XBAB's analyzer, as Theseus counts (the clicks chapter, CLK_TGT): the XA25's 72 µs there, not its "about
     65 µs" claim, which matches its SR latch mode, a clock that starts at NO, about 1.5 ms later in the press (Brock, F18.5: "Tighten it") */
  { cat: 'Click latency, wired', best: '72 µs', bv: 72, who: 'XBAB XA25, NC release', note: 'XBAB\'s analyzer, n = 500', ev: 'claim', tgt: '70 µs', tv: 70, tq: 'moving or still', better: 'low' },
  { cat: 'Click latency, wireless', best: '0.175 ms', bv: 0.175, who: 'VGN Dragonfly 3 Master GT', note: 'VGN, "as low as"', ev: 'claim', tgt: '0.1 ms', tv: 0.1, tq: 'or less', better: 'low' },
  /* Brock, F54.4: "Under 4.2 ms, derived" (V2): the fastest mechanical switch on Finalmouse's rig, the OP1 8K V2's 5.7 ms, less
     the 1.5 ms of the snap that reading NC saves, rounded up (b01_pressTgt). The magnetic Starlight X's 2.0 ms is a faster
     technology, named in the foot line */
  { cat: 'Press to PC, with travel', best: '5.7 ms', bv: 5.7, who: 'OP1 8K V2, the fastest mechanical', note: 'Finalmouse\u2019s rig', ev: 'claim', get tgt() { return 'Under ' + fmtN(typeof b01_pressTgt === 'function' ? b01_pressTgt() : 4.2, 1) + ' ms'; }, get tv() { return typeof b01_pressTgt === 'function' ? b01_pressTgt() : 4.2; }, tq: 'derived', better: 'low' },
  { cat: 'Report rate', sub: 'Wired and wireless', best: '8 khz', bv: 8, who: 'Wired and wireless', note: 'USB high speed, 125 µs', ev: 'datasheet', tgt: 'Dual 8khz', tv: 8, tq: 'wired and wireless', better: 'high' },   /* Brock, F27: "marker it as dual 8khz" (V1) */
  { cat: 'Lost reports rescued', sub: 'Same as Kunai Second Shot', best: '99 to 100%', bv: 99, who: 'Kunai Second Shot, 4 khz', note: 'Its developer, unreleased', ev: 'claim', tgt: '99%', tv: 99, tq: 'or more, at every rate', better: 'high' }
];
/* Theseus doesn't exist yet, so its hours are derived, never measured (review item 10): its battery at the Viper V4 Pro's
   draw less the V4 Pro's optical switches, one derivation for the whole deck (ntr_hours). The 8 khz row reads it */
const NTR_BAR_REST = [
  { cat: 'Battery, 1 khz', best: '180 h', bv: 180, who: 'Razer Viper V4 Pro, 49 g', note: 'Razer; SLX: no rating', ev: 'claim', tgt: THS.hours, tv: THESEUS.hours, tq: 'derived', better: 'high' },
  { cat: 'Battery, 8 khz', best: '40 h', bv: 40, who: 'Razer Viper V4 Pro, TechPowerUp', note: 'TechPowerUp', ev: 'measured', get tgt() { return Math.floor(ntr_hours().h8 + 1e-9) + ' h'; }, get tv() { return Math.floor(ntr_hours().h8 + 1e-9); }, tq: 'derived', better: 'high' },
  { cat: 'Charge current', sub: 'If the battery is rated for it', best: '0.28 A', who: 'Pulsar X2H', note: 'TechPowerUp', ev: 'measured', tgt: '1C', tq: 'if the battery is rated for it' },
  { cat: 'Weight, full shell', best: '29 g', bv: 29, who: 'Finalmouse ULX, small', note: 'Listed, not weighed', ev: 'claim', tgt: THS.massG, tv: THESEUS.mass, tq: 'weighed, every unit', better: 'low' },
  /* Brock (22:05): Theseus uses the PixArt PAW3970, the Viper V4 Pro's sensor under Razer's name (Focus Pro 50K Gen-3), so it
     matches the best sensor shipping: 930 IPS, 90 G, frame sync built in (ntrV4Sensor) */
  { cat: 'Sensor', sub: 'PAW3970 (the V4 Pro\'s; Brock)', best: '930 IPS', who: 'Razer Viper V4 Pro, Focus Pro 50K Gen-3', note: '90 G; Razer\'s for now', ev: 'claim', tgt: '930 IPS', tq: 'PAW3970, the Viper V4 Pro\'s sensor' },
  { cat: 'Lift-off', sub: 'Same as the PAW3955 mice', best: '0.7 mm', bv: 0.7, who: 'PAW3955 mice, the SLX', note: '11 steps, 0.7 to 1.7 mm', ev: 'datasheet', tgt: '0.7 mm', tv: 0.7, tq: 'or less, measured', better: 'low' },
  { cat: 'Set-down smoothing', sub: 'Same as the XBAB XA25', best: '12 ms', bv: 12, who: 'XBAB XA25, 2 frames', note: 'A 3950 by default: 450 ms', ev: 'claim', tgt: '12 ms', tv: 12, tq: 'or less, by default', better: 'low' },
  /* an SPDT advantage the clicks chapter shows (clk_debounce); F9.9 took analog and magnetic sensing out */
  { cat: 'Debounce', sub: 'SPDT, read at NC release', best: '0 ms', who: 'SPDT mice, the XBAB XA25', note: 'The latch reads both throws', ev: 'claim', tgt: '0 ms', tq: 'SPDT, new switch or worn' },
  { cat: 'Idle sleep', sub: 'Same as Kunai Smart sleep', best: '10 s', bv: 10, who: 'Kunai Smart sleep', note: 'Its developer, unreleased', ev: 'claim', tgt: '10 s', tv: 10, tq: 'woken by a touch', better: 'low' },
  { cat: 'Software', sub: 'Every OS, no install', best: 'Browser tab', who: 'XBAB Xpanel', note: 'Settings on the mouse', ev: 'claim', tgt: 'A browser tab', tq: 'every OS, no install' },
  /* as the coating slide: Cerakote's baked F-Series, 9H on its test panels (srf_f130) */
  { cat: 'Coating hardness', sub: 'Baked F-Series, its test panels', best: '9H pencil', who: 'Cerakote F-130', note: 'ASTM D3363, on its panels', ev: 'datasheet', tgt: '9H', tq: 'baked F-Series' }
];
/** Theseus's battery hours, derived (one derivation for the deck): its pack's energy (EEMB LP402535, 300 mAh at 3.7 V,
   1.110 Wh) over the Viper V4 Pro's draw (its 1.184 Wh battery over Razer's 180 h at 1 khz, and over TechPowerUp's 40 h
   at 8 khz) less the V4 Pro's optical switches, with Theseus's mechanical ones (ntr_swKeep): 194.7 h and 43.3 h, before
   any firmware gains. The 8 khz figure takes the switches' share as at 1 khz. same1 / same8: at the V4 Pro's whole draw,
   as every rival battery is put (b01_battery's rings). { h1, h8, same1, same8, wh, L, S, cell } */
function ntr_hours() {
  const cell = ntr_thsPack(), L = ntr_loads(), S = ntr_swKeep();
  return { h1: cell.wh / (L.w1 * S.keep), h8: cell.wh / (L.w8 * S.keep), same1: cell.wh / L.w1, same8: cell.wh / L.w8, wh: cell.wh, L, S, cell };
}
/* at a glance (Brock, F14.10, F16.1): the helpers live with the clicks chapter (10-b-click.js); the intro calls them by these names */
const ntr_hl = (...a) => clk_hl(...a), ntr_ba = (...a) => clk_ba(...a);
/** the targets, rethought for a glance (F14.10): the rows where Theseus moves past the best figure anyone has shown get a headline and
   a before → after chart (the best shown in grey, my target in blue under it, which way is better on every row); the rows where it
   matches the best, or where the target is a method, sit to the right as quiet tiles. rows: as NTR_BAR_*; o = { head: [num, word, sub],
   headRow: the category the headline comes from } */
function ntr_targets(t, rows, o) {
  const win = rows.filter(r => r.bv != null && r.tv != null && (r.better === 'low' ? r.tv < r.bv : r.tv > r.bv)).sort((p, q) => (q.cat === o.first) - (p.cat === o.first)), rest = rows.filter(r => !win.includes(r));
  const [lx, lw] = [LM, 940], [rx, rw] = [1060, RM - 1060], y0 = 280;
  /* the headline */
  ntr_hl(t, 0.5, lx, y0 + 150, o.head[0], o.head[1], { size: 150, sub: o.head[2], maxW: lw });
  /* the chart: two bars a row on the row's own scale, the change at its right end */
  const cy0 = y0 + 300, rh = Math.min(150, (960 - cy0) / Math.max(1, win.length)), bx0 = lx + 4, bw = lw - 600;
  win.forEach((r, i) => {
    const y = cy0 + i * rh, t0 = 1.0 + i * 0.35, a = ep(t, t0, t0 + 0.4), kb = ep(t, t0 + 0.2, t0 + 1.0, E.snap), kt = ep(t, t0 + 0.7, t0 + 1.5, E.snap);
    const hi = Math.max(r.bv, r.tv), Lb = bw * r.bv / hi, Lt = bw * r.tv / hi, dir = r.better === 'low' ? 'lower is better' : 'higher is better';
    rich([{ s: r.cat, role: 'label', size: 21, color: C.ink }, { s: '(' + dir + ')', role: 'label', size: 19, color: C.faint, gap: 12 }], bx0, y + 4, { alpha: a });
    rr(bx0, y + 22, Math.max(10, Lb * kb), 22, 4, C.comp, null, 0, a);
    rich([{ s: r.best, role: 'num', size: 25, weight: 700, color: C.ink2 }, { s: r.who, role: 'small', size: 21, weight: 600, color: C.mute, gap: 12 }], bx0 + Lb * kb + 14, y + 41, { alpha: a });
    rr(bx0, y + 58, Math.max(10, Lt * kt), 22, 4, C.hero, null, 0, a);
    rich([{ s: r.tgt, role: 'num', size: 25, weight: 800, color: C.heroText }, { s: 'Theseus, ' + r.tq, role: 'small', size: 21, weight: 600, color: C.heroText, gap: 12 }], bx0 + Lt * kt + 14, y + 77, { alpha: a * ep(t, t0 + 1.0, t0 + 1.4) });
    const ch = (r.tv > r.bv ? '+' : '−') + fmtN(Math.abs(100 * (r.tv - r.bv) / r.bv), 0) + '%';
    text(ch, lx + lw, y + 77, { role: 'd1', size: 44, weight: 800, color: C.heroText, grad: C.heroGrad, align: 'right', alpha: ep(t, t0 + 1.2, t0 + 1.6) });
  });
  /* the rest: quiet tiles, two a row, on the 40 px grid */
  const cols = 2, rowsN = Math.ceil(rest.length / cols), th = Math.floor((680 - 40 * (rowsN - 1)) / rowsN / 20) * 20, tw2 = (rw - 40) / 2;
  text(o.restHead || 'Matches the best shown', rx, y0 - 14, { role: 'label', size: 21, color: C.mute, alpha: ep(t, 2.0, 2.4) });
  rest.forEach((r, i) => {
    const x = rx + (i % cols) * (tw2 + 40), y = y0 + Math.floor(i / cols) * (th + 40), t0 = 2.2 + i * 0.12, a = ep(t, t0, t0 + 0.5, E.snap);
    demoWindow(x, y, tw2, th, a);
    const ka = ep(t, t0 + 0.2, t0 + 0.6), big = th >= 160, mw = tw2 - 56, vs0 = big ? 46 : 36, vs = Math.min(vs0, Math.floor(vs0 * mw / Math.max(1, tw(r.tgt, { role: 'd1', size: vs0, weight: 800 }))));
    text(r.cat, x + 28, y + 40, { role: 'label', size: 19, color: C.mute, alpha: ka, maxW: mw });
    text(r.tgt, x + 28, y + th - (big ? 62 : 46), { role: 'd1', size: vs, weight: 800, color: C.ink, alpha: ka });
    text(r.sub || r.tq, x + 28, y + th - (big ? 24 : 16), { role: 'small', size: 21, weight: 600, color: C.faint, alpha: ka });
  });
}
S({
  id: 'targets', ch: 'intro', theme: 'night', title: 'Targets: speed', settle: 9,   /* was "part one": the film has no part two (targets2's rows belong to the moves that earn them; V1) */
  src: ['exPiaknow', 'kunai', 'xbab', 'ntrXbabClick', 'xbabFw', 'xbabSensorLock', 'vgnClick', 'pcgSlx', 'usbHs', 'ntrTpuV4'],
  draw: t => {
    header(t, 'Targets: speed');
    captions(t, [[0.6, 'For every speed figure, the best anyone has shown, and my target. Theseus matches or beats every one.'], [5.0, 'The big one is wireless motion: 0.14 ms, 59% under the fastest wireless mouse anyone has measured.']]);
    const m = NTR_BAR_SPEED.find(r => /wireless/.test(r.cat) && /Motion/.test(r.cat));
    ntr_targets(t, NTR_BAR_SPEED, { head: ['−' + fmtN(100 * (m.bv - m.tv) / m.bv, 0) + '%', 'latency', 'Wireless motion: ' + m.tgt + ' against ' + m.best + ', the fastest measured ({piaknow}, 8 khz)'] });
    source(t, 'Change = (target − best) ÷ best. Best shown: piaknow, Razer, VGN and Finalmouse rigs as named; Kunai and XBAB by their developers. Press to PC: Finalmouse\u2019s own rig, from the touch, so travel counts; the magnetic Starlight X 2.0 ms is faster, the OP1 8K V2 the fastest mechanical. Theseus\u2019s, derived: the OP1\u2019s 5.7 ms less the 1.5 ms snap that reading NC saves.', { t0: 3.4 });
  }
});
S({
  id: 'targets2', ch: 'intro', theme: 'paper', title: 'Targets, part two: everything else', settle: 9,
  src: ['exNbcV4', 'ntrTpuV4', 'ntrJauch', 'ntrB2g', 'tpuX2h', 'nbcUlx', 'ntrRtUlxPro', 'ntrV4Sensor', 'mkb3955', 'xbabSmooth', 'kunai', 'srf_f130'],
  draw: t => {
    header(t, 'Targets, part two: everything else');
    const lw0 = ntr_lightest(), H = ntr_hours(), h8 = Math.floor(H.h8 + 1e-9);
    const rows = NTR_BAR_REST.map(r => r.cat === 'Weight, full shell' && lw0 ? Object.assign({}, r, { best: fmtN(lw0.g, 1) + ' g', bv: lw0.g, who: lw0.name.replace('Finalmouse ', '') + ', RTINGS' })
      : r.cat === 'Battery, 8 khz' ? Object.assign({}, r, { tgt: h8 + ' h', tv: h8 }) : r);
    const w = rows.find(r => r.cat === 'Weight, full shell');
    captions(t, [[0.6, 'The same rule for everything else: the best figure shown anywhere, and where Theseus sits against it.'], [5.0, 'Weighed against weighed: the ULX small lists 29 g, but no one has put it on a scale.']]);
    ntr_targets(t, rows, { head: ['−' + fmtN(100 * (w.bv - w.tv) / w.bv, 0) + '%', 'weight', 'Weighed, against the lightest wireless full shell anyone has weighed: ' + w.who.replace(', RTINGS', '') + ', ' + w.best + ' (RTINGS)'], restHead: 'Matches the best, or my method', first: 'Weight, full shell' });
    source(t, 'Battery, derived: ' + H.cell.maker + '\'s ' + H.cell.mAh + ' mAh (' + fmtN(H.wh, 3) + ' Wh) at the Viper V4 Pro\'s draw, its ' + fmtN(H.L.wh, 3) + ' Wh over Razer\'s ' + H.L.h1 + ' h at 1 khz and TechPowerUp\'s ' + H.L.h8 + ' h at 8 khz, less its optical switches (' + (typeof b01_optPct === 'function' ? b01_optPct() : '13.6 %') + '), before any firmware gains.', { t0: 3.0 });
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
    w: [{ v: THESEUS.mass, s: THS.mass, u: 'g', ev: 'proposal', sub: 'Weighed' }, wt('razer-viper-v4-pro'), wt('finalmouse-slx'), wt('logitech-gpx2'), wt('ninjutso-sora-v3'), wt('xbab-xa25'), wt('endgame-op1-8k-v2')],
    b: [{ v: 200, s: '200', u: 'h', ev: 'derived', sub: 'Derived' }, Object.assign(hr('razer-viper-v4-pro'), { sub: v48 ? fmtN(v48.v, 0) + ' h at 8 khz' : '' }),
      { na: 'None listed', sub: '250 mAh battery' }, hr('logitech-gpx2'), { na: 'None found' }, { na: 'Wired' }, { na: 'Wired' }],
    m: [{ v: 0.14, s: '0.14', u: 'ms', ev: 'proposal', sub: 'Wireless' }, mo('razer-viper-v4-pro', 'Wireless'), { na: 'Not tested' }, mo('logitech-gpx2', 'Wireless'), { na: 'Not tested' }, mo('xbab-xa25', 'Wired'), mo('endgame-op1-8k-v2', 'Wired')],
    c: [{ s: '70', u: 'µs', ev: 'proposal', sub: 'Moving or still' }, v4c ? { s: fmtN(v4c.v * 1000, 0), u: 'µs', ev: v4c.ev, sub: 'TPU rig' } : { na: 'Not tested' }, { na: 'Not tested' }, { na: 'Not tested' }, { na: 'Not tested' },
      xbXa != null ? { s: fmtN(xbXa, 0), u: 'µs', ev: 'claim', sub: 'XBAB rig' } : { na: 'Not tested' }, xbOp != null ? { s: fmtN(xbOp, 0), u: 'µs', ev: 'claim', sub: 'XBAB rig' } : { na: 'Not tested' }],
    s: [{ s: 'PixArt PAW3970,\nthe V4 Pro\'s sensor', ev: 'proposal' }, { s: 'Focus Pro 50K Gen-3' }, { s: 'Finalmouse F1' }, { s: 'HERO 2' }, { s: 'AimNinja 2 Pro 45K' }, { s: 'PAW3950' }, { s: 'PAW3950' }],
    r: [{ s: 'Raytac AN54LM-P20A\n{nRF54LM20A}', ev: 'proposal' }, { s: 'Airoha AB1623' }, { s: 'Nordic {nRF54LM20}' }, { s: 'Nordic {nRF52840}' }, { s: 'PixArt PAR2862' }, { s: 'Nuvoton M483' }, { s: 'Nuvoton M483' }],
    p: [{ s: THS.price, ev: 'proposal' }, { s: '$159.99' }, { s: '$179' }, { s: '$159', sub: '2023 list' }, { s: '$119.99' }, { s: '$169' }, { s: '$89.99' }]
  };
}
/** evidence dots as a legend line */
function ntr_evLegend(t, t0, x, y, kinds, o = {}) {
  let xx = x; const a = ep(t, t0, t0 + 0.4);
  kinds.forEach(k => { evDot(xx + 7, y - 7, k, 6, a); text(evLabel(k), xx + 22, y, { role: 'label', size: 20, color: C.mute, alpha: a }); xx += 22 + tw(evLabel(k), { role: 'label', size: 20 }) + 30; });
  return xx - x;
}
/** the flagships as one chart (Brock, F18.4: "Keep price charted"): a row a mouse, a column a measure, so each mouse's price sits on
   the same line as its weight, hours and motion, and a glance along a row shows what a lower price buys. Each column: its name,
   which way is better, a headline (Theseus against the best wireless rival, in Theseus's colour; price, the one Theseus doesn't
   lead, in ink), rival → Theseus under it (F16.1), then a bar a mouse on the column's own scale, its value at the column's right.
   Theseus in blue, the best wireless rival yellow, the rest grey, the wired two dimmed (shown, not ranked). A column's ref is a
   dashed line at a value ({ v, label }). A neutral column (price: charted, not a contest) has no "better" line, no headline,
   and every bar in quiet ink, Theseus's too. cols: [{ k, x, w, label, dir, max, hs, head, quiet, ba: [before, after], who (the
   rival the headline is against, named before its struck value), ref, refCol, noBest, neutral }];
   rows: [{ name, hero, wired, [k]: { v, s, u, na, note } }] */
function ntr_flagBoard(t, x, y, w, h, cols, rows) {
  demoWindow(x, y, w, h, ep(t, 0.3, 0.85, E.snap));
  const nx = x + 32, r0 = y + 262, rh = 54, gap = 16, iw = rows.findIndex(r => r.wired), rowY = i => r0 + rh / 2 + i * rh + (iw >= 0 && i >= iw ? gap : 0);
  rows.forEach((r, i) => {
    const yy = rowY(i), a = ep(t, 0.6 + i * 0.08, 1.0 + i * 0.08);
    if (i === iw) line(nx, yy - rh / 2 - gap / 2, x + w - 32, yy - rh / 2 - gap / 2, { color: C.hair, w: 1.2, dash: [5, 5], alpha: a });
    else if (i) line(nx, yy - rh / 2, x + w - 32, yy - rh / 2, { color: C.hair, w: 1, alpha: a * 0.6 });
    rich([{ s: r.name, role: 'small', size: 23, weight: r.hero ? 800 : 600, color: r.hero ? C.heroText : r.wired ? C.mute : C.ink }, r.wired || r.hero ? { s: r.hero ? 'Targets' : 'Wired', role: 'label', size: 19, color: C.faint, gap: 10 } : null], nx, yy + 8, { alpha: a * (r.wired ? 0.8 : 1) });
  });
  cols.forEach((c, ci) => {
    const t0 = 0.9 + ci * 0.55, ka = ep(t, t0, t0 + 0.45), bw = c.w - 120, xv = c.x + c.w, hy = y + 172, by = y + 218;
    text(c.label, c.x, y + 46, { role: 'label', size: 19, color: C.mute, alpha: ka });
    if (c.dir) text(c.dir === 'low' ? 'Lower is better' : 'Higher is better', c.x, y + 72, { role: 'label', size: 19, color: C.faint, alpha: ka });
    if (c.head && c.quiet) text(c.head, c.x, hy, { role: 'd1', size: c.hs, weight: 800, track: -0.03, color: C.ink, tnum: true, alpha: ep(t, t0 + 0.3, t0 + 0.75) });
    else if (c.head) ntr_hl(t, t0 + 0.3, c.x, hy, c.head, null, { size: c.hs, count: false });
    const kb = ep(t, t0 + 0.6, t0 + 1.0), refCol = c.refCol || C.ref;
    if (c.ba) {
      /* the rival the headline is against, named in its own yellow, then its value struck → Theseus's */
      const st = { role: 'num', size: 27, weight: 700 }, w0 = tw(c.ba[0], st), bx = c.x + (c.who ? text(c.who, c.x, by, { role: 'label', size: 19, color: C.secondText, alpha: kb }).w + 12 : 0);
      rich([{ s: c.ba[0], role: 'num', size: 27, weight: 700, color: C.faint }, { s: '→', font: 'disp', size: 24, weight: 700, color: C.faint, gap: 12 }, { s: c.ba[1], role: 'num', size: 27, weight: 800, color: C.heroText, gap: 12 }], bx, by, { alpha: kb });
      line(bx - 3, by - 9, bx + w0 + 3, by - 9, { color: C.mute, w: 2, alpha: kb });
    }
    if (c.ref) { line(c.x, by - 8, c.x + 30, by - 8, { color: refCol, w: 3, dash: [7, 5], alpha: kb }); text(c.ref.label, c.x + 42, by, { role: 'small', size: 21, weight: 600, color: C.mute, alpha: kb }); }
    let best = null;
    if (!c.noBest) { const vs = rows.filter(r => !r.hero && !r.wired && r[c.k] && r[c.k].v != null).map(r => r[c.k].v); if (vs.length) best = c.dir === 'low' ? Math.min(...vs) : Math.max(...vs); }
    rows.forEach((r, i) => {
      const cell = r[c.k]; if (!cell) return;
      const yy = rowY(i), d = t0 + 0.4 + i * 0.07, k = ep(t, d, d + 0.8, E.snap), a = ka * (r.wired ? 0.75 : 1);
      if (cell.na) { text(cell.na, c.x, yy + 7, { role: 'small', size: 19, weight: 600, color: C.faint, alpha: a }); return; }
      const L = Math.max(8, bw * clamp(cell.v / c.max) * k);
      const bc = c.neutral ? (r.wired ? C.comp2 : C.mute) : r.hero ? C.hero : best != null && !r.wired && cell.v === best ? C.ref : r.wired ? C.comp2 : C.comp;
      rr(c.x, yy - 7, L, 14, 4, bc, null, 0, a);
      if (cell.note) text(cell.note, c.x + L + 16, yy + 7, { role: 'small', size: 19, weight: 600, color: C.faint, alpha: a * ep(t, d + 0.5, d + 0.9) });
      const hv = r.hero && !c.neutral;
      rich([{ s: cell.s, role: 'num', size: 23, weight: hv ? 800 : 700, color: hv ? C.heroText : r.wired ? C.mute : c.neutral ? C.ink2 : C.ink }, cell.u ? { s: cell.u, role: 'label', size: 19, color: C.mute, gap: 5, caps: false } : null], xv, yy + 8, { align: 'right', alpha: a * ep(t, d + 0.4, d + 0.8) });
    });
    if (c.ref) { const X = c.x + bw * clamp(c.ref.v / c.max), k = ep(t, t0 + 0.9, t0 + 1.5, E.cam), y1 = rowY(rows.length - 1) + rh / 2 - 6, y0 = r0 + 4; line(X, y0, X, y0 + (y1 - y0) * k, { color: refCol, w: 2.5, dash: [7, 5], alpha: ka }); }
  });
}
S({
  id: 'flagships', ch: 'intro', theme: 'night', title: 'Theseus against the flagships', settle: 10,
  src: ['exRtings', 'exEloshapes', 'exXbabWeight', 'exNbcV4', 'ntrTpuV4', 'ntrGpx2', 'ntrB2g', 'exPiaknow', 'ntrXbabClick', 'ntrRazerV4', 'ntrStores', 'nbcUlx', 'raytac', 'slxPdf'],
  draw: t => {
    header(t, 'Theseus against the flagships');
    const ulx = (ntr_fv('finalmouse-ulx', 'price_usd') || { v: 189 }).v, cheap = '$' + fmtN(ulx, 0);
    captions(t, [[0.6, 'Six of the best mice you can buy, against my targets, where someone has published the number.'],
      [5.4, 'Theseus leads the wireless flagships on weight, hours and motion, for ' + THS.price + ': what the ULX cost at launch. Every cheaper wireless one is heavier, and none lists more hours or measures quicker in motion.']]);
    const D = ntr_flagCells(), F = NTR_FLAG, wired = j => /wired/.test(F[j].brand);
    const price = c => { const v = parseFloat(String(c.s).replace(/[^0-9.]/g, '')); return isFinite(v) ? { v, s: c.s } : { na: c.s }; };
    const motion = j => { const c = D.m[j]; if (F[j].hero) return Object.assign({}, c, { note: 'Wired: 0.13 ms' }); return wired(j) && c.v != null ? { na: 'Wired: ' + c.s + ' ms' } : c; };
    const all = F.map((f, j) => ({ name: f.hero ? 'Theseus' : f.name, hero: !!f.hero, wired: wired(j), w: D.w[j], b: D.b[j], m: motion(j), p: price(D.p[j]) }));
    const byW = (p, q) => (p.w.v == null ? 1e9 : p.w.v) - (q.w.v == null ? 1e9 : q.w.v), th = all[0];
    const rows = [th].concat(all.filter(r => !r.hero && !r.wired).sort(byW), all.filter(r => r.wired).sort(byW));
    /* each headline: Theseus against the best wireless rival on that measure */
    const rival = (k, dir) => rows.filter(r => !r.hero && !r.wired && r[k] && r[k].v != null).reduce((m, r) => !m || (dir === 'low' ? r[k].v < m[k].v : r[k].v > m[k].v) ? r : m, null);
    const head = (k, dir) => { const b = rival(k, dir); return b ? (th[k].v >= b[k].v ? '+' : '−') + fmtN(Math.abs(100 * (th[k].v - b[k].v) / b[k].v), 0) + '%' : ''; };
    const ba = (k, dir, u) => { const b = rival(k, dir); return b ? [b[k].s, th[k].s + ' ' + u] : null; };
    /* each headline names the mouse it is against: this set's lightest is the Starlight X, not the lightest ever weighed
       (the ULX Pro Series, on targets2 and the stats), so the weight figure says whose it is */
    const who = (k, dir) => { const b = rival(k, dir); return b ? b.name.replace('Viper ', '') : null; };
    /* price is charted (Brock, F18.4) but not a contest: no "better" line, no headline, every bar in quiet ink */
    ntr_flagBoard(t, LM, 280, RM - LM, 680, [
      { k: 'w', x: 340, w: 430, label: 'Weight, as weighed', dir: 'low', max: 62, hs: 104, head: head('w', 'low'), ba: ba('w', 'low', 'g'), who: who('w', 'low') },
      { k: 'b', x: 810, w: 320, label: 'Battery at 1 khz', dir: 'high', max: 220, hs: 80, head: head('b', 'high'), ba: ba('b', 'high', 'h'), who: who('b', 'high') },
      { k: 'm', x: 1170, w: 320, label: 'Motion latency, 8 khz', dir: 'low', max: 1.0, hs: 80, head: head('m', 'low'), ba: ba('m', 'low', 'ms'), who: who('m', 'low') },
      { k: 'p', x: 1530, w: 278, label: 'Price, US list', dir: null, max: 200, neutral: true, noBest: true, ref: { v: ulx, label: 'The ULX at launch, ' + cheap }, refCol: C.mute }
    ], rows);
    source(t, 'Weights: RTINGS; the XA25, XBAB by part. Hours: makers; Theseus\'s derived. Motion: piaknow, 8 khz. Price: US list; the GPX2 at its 2023 list, the ULX at launch (Notebookcheck).', { t0: 4.0 });
  }
});

/* ============================== 06. zero grams: F = m · a. The same push, three masses, and who stops on the target first ============================== */
/* Brock (07:20): argue for it. Less mass is less inertia: the same push accelerates and brakes a lighter mouse harder, so
   it reaches the target and stops on it sooner (bang-bang: full push to halfway, full brake after, t = 2 √(d · m ÷ F)).
   Its own weight on the skates falls with it, and so does the friction it makes. Times are the mouse's share alone. */
const NTR_ZG = { T100: 3.2, t0: 1.5, lanes: [{ m: 100, sub: 'Conroy\'s heavy mouse' }, { m: 60, sub: 'About a Logitech GPX2' }, { m: THESEUS.mass, sub: 'Theseus', hero: true }] };
/** the mouse from above, nose to the right, s px per mm */
function ntr_puck(x, y, s, col, a = 1) { if (a <= 0.003) return; G.save(); G.globalAlpha = a; G.translate(x, y); G.rotate(Math.PI / 2); G.scale(s, s); keyPath(); G.fillStyle = col; G.fill(); G.restore(); }
S({
  id: 'zerograms', ch: 'intro', theme: 'night', title: 'The optimal weight is zero grams', settle: 10, ideas: ['weight'],
  src: ['exZk', 'exZkM1k', 'exConroy'],
  draw: t => {
    header(t, 'The optimal weight is zero grams');
    captions(t, [[0.6, 'The same push, three masses. F = m · a: the lighter the mouse, the sooner it reaches the target and stops on it.'],
      [5.4, 'Every bit of weight I take out is weight your hand never has to start, stop or turn. Theseus is ' + THS.massG + ', with the whole shell.']]);
    const Z = NTR_ZG, x0 = 360, x1 = 920, ys = [420, 560, 700], a0 = ep(t, 0.4, 0.9);
    text('Mass', LM, 332, { role: 'label', size: 20, color: C.mute, alpha: a0 });
    text('The same push, the same distance', x0, 332, { role: 'label', size: 20, color: C.mute, alpha: a0 });
    text('Time', 1080, 332, { role: 'label', size: 20, color: C.mute, align: 'right', alpha: a0 });
    /* the target: one line through every lane */
    const kT = ep(t, 0.8, 1.4, E.cam);
    line(x1, 380, x1, 380 + (ys[2] + 60 - 380) * kT, { color: inkA(0.5), w: 1.5, dash: [6, 6] });
    text('Target', x1, 372, { role: 'label', size: 19, color: C.mute, align: 'center', alpha: kT });
    Z.lanes.forEach((L, i) => {
      const y = ys[i], T = Z.T100 * Math.sqrt(L.m / 100), u = clamp((t - Z.t0) / T), ka = ep(t, 0.6 + i * 0.15, 1.0 + i * 0.15);
      const f = u < 0.5 ? 2 * u * u : 1 - 2 * (1 - u) * (1 - u), px = lerp(x0, x1 - 32, f), col = L.hero ? C.hero : C.comp;
      /* the lane */
      rich([{ s: L.hero ? THS.mass : String(L.m), role: 'stat', size: 52, color: L.hero ? C.heroText : C.ink, grad: L.hero ? C.heroGrad : null, tnum: true }, { s: 'g', font: 'disp', size: 22, weight: 700, color: C.mute, gap: 6 }], LM, y + 10, { alpha: ka });
      text(L.sub, LM, y + 46, { role: 'small', size: 23, weight: 600, color: L.hero ? C.heroText : C.mute, alpha: ka });
      line(x0 - 20, y + 46, x1 + 40, y + 46, { color: C.hair, w: 1.5, alpha: ka });
      /* the push: behind it while it speeds up, in front of it while it brakes; the same arrow in every lane */
      if (u > 0 && u < 1) { const k2 = Math.min(1, Math.min(u, 1 - u) * 12); if (u < 0.5) arrow(px - 118, y, px - 62, y, { color: C.ink2, w: 3, hs: 14, alpha: k2 }); else arrow(px + 100, y, px + 50, y, { color: C.ink2, w: 3, hs: 14, alpha: k2 }); }
      /* the strobe: where it was every 0.2 s, so the settled frame still shows who was quicker */
      for (let tk = 0.2; tk < Math.min(t - Z.t0, T); tk += 0.2) { const uk = tk / T, fk = uk < 0.5 ? 2 * uk * uk : 1 - 2 * (1 - uk) * (1 - uk); ntr_puck(lerp(x0, x1 - 32, fk), y, 0.5, col, ka * 0.16); }
      ntr_puck(px, y, 0.5, col, ka);
      /* the time, when it has stopped on the target: a share of the 100 g mouse's */
      const kd = ep(t, Z.t0 + T, Z.t0 + T + 0.35);
      if (kd > 0) rich([{ s: fmtN(100 * Math.sqrt(L.m / 100), 0), role: 'stat', size: 52, color: L.hero ? C.heroText : C.ink2, grad: L.hero ? C.heroGrad : null, tnum: true }, { s: '%', font: 'disp', size: 24, weight: 700, color: C.mute, gap: 4 }], 1080, y + 10, { align: 'right', alpha: kd });
    });
    /* the sum, under the lanes */
    /* the headline: Theseus's time against the 100 g mouse's, from the same push (F14.10) */
    const zT = NTR_ZG.lanes.find(l => l.hero), cut = 100 * (1 - Math.sqrt(zT.m / 100));
    ntr_hl(t, 5.2, LM, 900, '−' + fmtN(cut, 0) + '%', 'time', { size: 112, count: false, sub: 'Derived: t = 2 √(d · m ÷ F), the same push as the 100 g mouse. Lower is better.', maxW: 1000 });
    /* the words: the physics, the man who said it first, and the biggest study */
    ntr_stack(t, 1160, 320, RM - 1160, [
      { t0: 5.8, gloss: true, a: 'F = m · a', b: 'The same push gives half the mass twice the acceleration: it starts, stops and turns sooner, and presses half as hard on its skates.' },
      { t0: 6.3, a: 'Zaunkoenig 2018', b: 'The optimal weight of a gaming mouse is zero grams. Its M1K got to 23.4 g, wired.' },
      { t0: 6.8, a: 'Conroy et al. 2022', b: '72 gamers aimed 4% faster and 9% more accurately with 50, 60 and 90 g mice than with a 100 g one.' }
    ]);
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
  id: 'weightgap', ch: 'intro', theme: 'paper', title: 'Listed against weighed', settle: 10, ideas: ['weight'],
  src: ['exRtings', 'exEloshapes', 'ntrB2g', 'ntrRtSlx', 'ntrEloSlx'],
  draw: t => {
    header(t, 'Listed against weighed');
    const R = ntr_gapRows(), big = R.filter(r => r.big), oth = R.filter(r => !r.big), nb = big.filter(r => Math.abs(r.gap) <= 3).length, nh = oth.filter(r => r.gap > 3).length;
    const slx = R.find(r => r.id === 'finalmouse-slx'), scy = R.find(r => r.id === 'scyrox-v8');
    captions(t, [[0.6, `Razer and Logitech: ${nb} of ${big.length} mice within 3% of the weight they list. ${nh} of the other ${oth.length} weigh more than 3% over.`],
      [5.6, 'So every Theseus gets weighed after assembly, and the weight on its card is the scale\'s, not mine.']]);
    /* the gap is signed, and zero is the best a card can do: so Theseus's 0.0% leads the list, on the zero line, and the
       label says "closest to 0 is best" (a mouse lighter than its card is as far off as one heavier) */
    const all = [{ theseus: true }].concat(R), half = Math.ceil(all.length / 2), cols = [all.slice(0, half), all.slice(half)], colW = (RM - LM - 40) / 2, y0 = 300, rh = 38, lo = -7, hi = 13;
    cols.forEach((rows, ci) => {
      const x0 = LM + ci * (colW + 40), bx0 = x0 + 470, bw = colW - 470 - 92, X = v => bx0 + bw * (v - lo) / (hi - lo), a0 = ep(t, 0.4 + ci * 0.2, 0.8 + ci * 0.2);
      text('Mouse', x0, y0, { role: 'label', size: 21, color: C.mute, alpha: a0 });
      text('Listed → weighed', x0 + 448, y0, { role: 'label', size: 21, color: C.mute, align: 'right', alpha: a0 });
      /* the ±3% band and the gap axis */
      const yb0 = y0 + 18, yb1 = y0 + 18 + rh * rows.length;
      rect(X(-3), yb0, X(3) - X(-3), yb1 - yb0, { fill: inkA(TH ? 0.05 : 0.06), alpha: a0 });
      for (const v of [-5, 0, 5, 10]) { line(X(v), yb0, X(v), yb1, { color: v ? C.hair : C.faint, w: v ? 1 : 1.5, alpha: a0 }); text((v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v) + '%', X(v), y0, { role: 'tick', size: 20, color: v ? C.mute : C.ink, align: 'center', alpha: a0 }); }
      rows.forEach((r, i) => {
        const y = yb0 + rh * i + rh / 2;
        if (r.theseus) {
          /* Theseus: weighed, and the weighed number is the one printed. The gap is zero by construction */
          const k = ep(t, 4.6, 5.1);
          rect(x0 - 8, y - rh / 2 + 2, colW + 16, rh - 4, { fill: C.heroSoft, alpha: k });
          ntr_chip('Theseus', x0, y + 8, k);
          text('Weighed, printed', x0 + 448, y + 8, { font: 'mono', size: 21, weight: 600, color: C.ink, align: 'right', alpha: k });
          heroMark(X(0), y, 12 * k, 1);
          text('0.0%', x0 + colW, y + 8, { font: 'mono', size: 24, weight: 800, color: C.heroText, align: 'right', alpha: k });
          return;
        }
        const t0 = 0.8 + ci * 0.5 + i * 0.07, k = ep(t, t0, t0 + 0.35), kb = ep(t, t0 + 0.15, t0 + 0.95, E.snap), out = Math.abs(r.gap) > 3;
        if (i) line(x0, y - rh / 2, x0 + colW, y - rh / 2, { color: C.hair, w: rows[i - 1].theseus ? 1.5 : 1, alpha: k * 0.6 });
        text(r.name, x0, y + 8, { role: 'small', size: 24, weight: r.big ? 700 : 500, color: C.ink, alpha: k });
        text(ntr_g(r.c) + ' → ' + ntr_g(r.w) + ' g', x0 + 448, y + 8, { font: 'mono', size: 21, weight: 500, color: C.ink2, align: 'right', alpha: k });
        const xa = X(0), xb = X(r.gap * kb);
        rect(Math.min(xa, xb), y - 7, Math.abs(xb - xa), 14, { fill: r.big ? C.ink2 : C.comp, alpha: k });
        text((r.gap > 0 ? '+' : r.gap < 0 ? '−' : '') + fmtN(Math.abs(r.gap), 1) + '%', x0 + colW, y + 8, { font: 'mono', size: 24, weight: out ? 800 : 500, color: out ? C.ink : C.mute, align: 'right', alpha: k });
      });
      if (ci === 1) legend(t, 4.4, x0, yb1 + rh / 2 + 8, [{ kind: 'comp', color: C.ink2, label: 'Razer and Logitech' }, { kind: 'comp', color: C.comp, label: 'Every other brand' }]);
    });
    /* at a glance: the worst listed gap, either way, against Theseus's, which is zero because every unit is weighed (F14.10, F16.1) */
    { const worst = R.reduce((m, r) => (!m || Math.abs(r.gap) > Math.abs(m.gap) ? r : m), null), a = ep(t, 6.2, 6.7);
      if (worst) { text('Gap between the weight on the card and the scale (closest to 0 is best): the worst listed, then Theseus', LM, 818, { role: 'label', size: 21, color: C.mute, alpha: a });
        ntr_ba(t, LM, 916, { before: (worst.gap > 0 ? '+' : '−') + fmtN(Math.abs(worst.gap), 1) + '%', after: '0.0%', net: 'Every Theseus weighed after assembly: its own weight on its card, to 0.01 g.', netRight: true, netW: 980, netSize: 26, size: 86, k: ep(t, 6.4, 7.0), a, hero: true }); } }
    source(t, 'Gap = (weighed − listed) ÷ listed. Weighed: RTINGS\' default weight; listed: the maker\'s, via EloShapes. Left out: the ULX (RTINGS doesn\'t say which size), the MCHOSE L7 Ultra (+17.7%, likely another variant), the XA25 (weighed by its maker).', { t0: 4.8 });
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
  id: 'pricefront', ch: 'intro', theme: 'paper', title: 'Price against weight', settle: 10, ideas: ['weight'],
  src: ['exRtings', 'exEloshapes', 'exPrices', 'x2fCrazy', 'nbcUlx'],
  draw: t => {
    header(t, 'Price against weight');
    captions(t, [[0.6, 'Every wireless mouse with a US list price, against its weight. No full shell has shipped past the black line.'],
      [5.4, 'Theseus goes past it: ' + THS.massG + ' with the whole shell, for ' + THS.price + '. That is what the ULX launched at, ' + fmtN(38.0 - THESEUS.mass, 1) + ' g heavier.']]);
    const P = exPricePoints(), x2f = P.find(p => p.id === 'pulsar-x2f-crazylight'), full = P.filter(p => p !== x2f);
    const named = ['pulsar-x2-crazylight-m', 'ninjutso-sora-v2', 'lamzu-maya', 'keychron-g3', 'finalmouse-slx', 'finalmouse-ulx', 'razer-viper-v4-pro', 'logitech-gpx2'];
    const nm = p => p.name.replace('Finalmouse Starlight X', 'Starlight X').replace('Finalmouse ULX', 'ULX');
    const pts = full.map(p => Object.assign({}, p, { label: named.includes(p.id) ? undefined : false, name: nm(p), ref: p.id === 'finalmouse-ulx' }));
    const x = LM + 120, py = 360, w = 1000, ph = 480;
    cardHead(t, 0.5, LM - 32, py - 84, w + 152, 'Weight against US list price, wireless', [{ ev: 'measured', by: 'RTINGS' }]);
    const sc = scatter(t, {
      x, y: py, w, h: ph, t0: 0.6, xr: [25, 70], yr: [60, 200], xticks: [30, 40, 50, 60, 70], yticks: [60, 80, 100, 120, 140, 160, 180, 200],
      xfmt: v => v + ' g', yfmt: v => '$' + v, xlabel: 'Weight, {g}', better: { x: -1, y: -1 }, sweet: { label: 'Lighter and cheaper' }, frontier: true,
      points: pts.length ? pts : [{ name: 'placeholder', x: 40, y: 120 }], placeholder: !pts.length,
      target: { x: THESEUS.mass, y: THESEUS.price, name: 'Theseus', sub: THS.massG + ', ' + THS.price, dx: 28, dy: 8 }
    });
    /* the X2F: lighter and cheaper, but half a shell, so it sits off the frontier of full shells */
    if (x2f) {
      const kx = ep(t, 3.0, 3.5), qx = sc.X(x2f.x), qy = sc.Y(x2f.y);
      circle(qx, qy, 9 * kx, { fill: C.panel }); circle(qx, qy, 9 * kx, { color: C.faint, w: 2.5, dash: [3, 3] });
      text('X2F, half a shell', qx + 18, qy + 8, { role: 'small', size: 22, weight: 600, color: C.mute, alpha: kx });
    }
    const F = full.filter(p => !full.some(q => q !== p && q.x <= p.x && q.y <= p.y && (q.x < p.x || q.y < p.y))).sort((a, b) => a.x - b.x);
    const tx0 = 1320, tw0 = RM - tx0, ty = py - 30;
    const yEnd = compareTable(t, {
      x: tx0, y: ty, w: tw0, t0: 1.6, rowH: 60,
      cols: [{ key: 'm', label: 'On the frontier', w: 2.1 }, { key: 'g', label: 'Weight', w: 1, align: 'right' }, { key: 'p', label: 'Price', w: 1.15, align: 'right' }],
      rows: F.map(p => ({ cells: { m: nm(p).replace('Pulsar ', '').replace('Ninjutso ', ''), g: fmtN(p.x, p.x % 1 ? 1 : 0) + ' g', p: p.range ? '$' + p.y.toFixed(2) + '*' : '$' + (p.y % 1 ? p.y.toFixed(2) : p.y) } }))
    });
    const kr = ep(t, 3.6, 4.1), ry = yEnd + 56;
    if (kr > 0) {
      ntr_chip('Theseus', tx0, ry, kr, { size: 24 });
      text(THS.massG, tx0 + tw0 * 3.1 / 4.25 - 16, ry, { role: 'small', size: 25, weight: 800, color: C.heroText, align: 'right', alpha: kr });
      text(THS.price, RM - 16, ry, { role: 'small', size: 25, weight: 800, color: C.heroText, align: 'right', alpha: kr });
    }
    /* the headline: Theseus against the ULX at the ULX's own launch price (F14.10) */
    { const ulx = P.find(p => p.id === 'finalmouse-ulx');
      if (ulx) ntr_hl(t, 5.4, tx0, 852, '−' + fmtN(100 * (ulx.x - THESEUS.mass) / ulx.x, 0) + '%', 'weight', { size: 100, count: false, sub: 'The ULX\'s own ' + THS.price + ': ' + THS.massG + ' against ' + ntr_g(ulx.x) + ' g', maxW: tw0, subSize: 23 }); }
    legend(t, 4.2, LM, 940, [{ kind: 'dot', color: C.comp, label: 'Weighed by RTINGS' }, { kind: 'ring', color: C.comp, label: 'Maker\'s weight' }, { kind: 'line', color: C.ink, label: 'Pareto frontier, full shells' }, { kind: 'ref', label: 'The ULX at launch' }, { kind: 'hero', label: 'Theseus' }]);
    source(t, 'Prices: US list, maker stores and reviews; * a range, plotted at its lowest. Weights: RTINGS where weighed, else the maker; the ULX is the UltralightX at its 2023 launch price.' + (x2f ? ` Off the frontier: the X2F CrazyLight, ${ntr_g(x2f.x)} g and $${x2f.y}, is the front half of a shell.` : ''), { t0: 3 });
  }
});

/* ============================== 09. the empty corner: weight against listed battery life at 1 khz ============================== */
const ntr_mk = n => exShort(n).replace(/^(Razer|Logitech|ZOWIE|Lamzu|Pulsar|Ninjutso|Finalmouse|WLMOUSE|Hitscan|Scyrox) /, '').replace('Xiaomi Gaming Mouse 2', 'Xiaomi GM2').replace('Starlight X', 'Starlight X');
S({
  id: 'market', ch: 'intro', theme: 'night', title: 'Battery life against weight', settle: 10, ideas: ['weight', 'battery'],
  src: ['exRtings', 'exEloshapes', 'exNbcV4', 'ntrKeychron', 'ntrDaV4', 'ntrXiaomi', 'ntrGpx2', 'ntrGpx2c', 'razerBatt', 'logiSuperstrike', 'ntrZowie', 'ntrB2g'],
  draw: t => {
    header(t, 'Battery life against weight');
    const mice = ((RD.mice || {}).mice || []).filter(m => m.connection !== 'wired');
    const rated = mice.filter(m => rv(m.battery_claim_1k_h) != null).map(m => { const w = exWeight(m.id); return w ? { id: m.id, name: ntr_mk(m.name) + (m.id === 'razer-deathadder-v4-pro' ? '*' : ''), x: w.g, y: rv(m.battery_claim_1k_h), hollow: w.ev !== 'measured', ref: m.id === 'razer-viper-v4-pro' } : null; }).filter(Boolean);
    const unr = mice.filter(m => rv(m.battery_claim_1k_h) == null && m.id !== 'mchose-l7-ultra').map(m => { const w = exWeight(m.id); return w && w.g <= 50 ? { id: m.id, name: NTR_SHORT[m.id] || exShort(m.name), g: w.g, ev: w.ev } : null; }).filter(Boolean).sort((a, b) => a.g - b.g);
    const light = rated.reduce((a, p) => (!a || p.x < a.x ? p : a), null);
    captions(t, [[0.6, `Every wireless mouse that lists hours at 1 khz, against its weight. The lightest is the ${light ? light.name + ', ' + ntr_g(light.x) + ' g' : '–'} as weighed.`],
      [5.4, 'Nothing lighter comes with an hour rating. That corner is Theseus: ' + THS.massG + ' and ' + THS.hours + ' at 1 khz for ' + THS.price + ', its hours derived from its battery at the V4 Pro\'s draw, less its optical switches.']]);
    const x = 720, py = 330, w = 1100, ph = 480, xr = [25, 62], yr = [0, 220], X = g => x + w * (g - xr[0]) / (xr[1] - xr[0]);
    cardHead(t, 0.5, x - 120, py - 80, w + 120, 'Listed hours at 1 khz against weight, wireless', [{ ev: 'measured', by: 'RTINGS' }, { ev: 'claim', by: 'Maker' }]);
    /* the corner nobody has rated: left of the lightest rated mouse */
    const kz = ep(t, 3.0, 3.8, E.io3);
    if (light && kz > 0) line(X(light.x), py, X(light.x), py + ph * kz, { color: C.red, w: 1.5, dash: [6, 6] });
    const sc = scatter(t, {
      x, y: py, w, h: ph, t0: 0.6, xr, yr, xticks: [30, 40, 50, 60], yticks: [0, 50, 100, 150, 200],
      xfmt: v => v + ' g', yfmt: v => v + ' h', xlabel: 'Weight, {g}', better: { x: -1, y: 1 }, sweet: true, frontier: true,
      points: rated.length ? rated : [{ name: 'placeholder', x: 49, y: 180 }], placeholder: !rated.length,
      target: { x: THESEUS.mass, y: THESEUS.hours, name: 'Theseus', sub: THS.massG + ', ' + THS.hours + ', ' + THS.price, dx: 26, dy: 10 }
    });
    /* every light mouse with no rating: a red tick on the axis where it sits */
    const kt = ep(t, 3.4, 3.9);
    unr.forEach((u, i) => { const ux = X(u.g); if (ux >= x && ux <= x + w) line(ux, py + ph - 22, ux, py + ph - 4, { color: C.red, w: 2.5, alpha: kt }); });
    if (light) text('No rating found', X(light.x) - 14, py + ph - 34, { role: 'label', size: 20, color: C.redL, align: 'right', alpha: kt });
    /* the list, so every red tick has a name */
    const lx = LM, lr = LM + 480, ly = py - 30, lk = ep(t, 3.6, 4.0);
    text('No 1 khz rating found', lx, ly, { role: 'label', size: 21, color: C.redL, alpha: lk });
    line(lx, ly + 16, lr, ly + 16, { color: C.hair, w: 1.5, alpha: lk });
    unr.forEach((u, i) => {
      const yy = ly + 50 + i * 31, k = ep(t, 3.7 + i * 0.05, 4.1 + i * 0.05);
      line(lx, yy - 9, lx + 14, yy - 9, { color: C.red, w: 2.5, alpha: k });
      text(u.name + (u.id === 'finalmouse-slx' ? ' †' : ''), lx + 26, yy, { role: 'small', size: 22, weight: 600, color: C.ink, alpha: k });
      text(ntr_g(u.g) + '\u00A0g', lr, yy, { font: 'mono', size: 22, weight: 600, color: u.ev === 'measured' ? C.ink2 : C.mute, align: 'right', alpha: k });
    });
    /* the headline: Theseus's hours against the longest listed, under the list (F14.10) */
    { const lng = rated.reduce((m, p) => (!m || p.y > m.y ? p : m), null), hy = Math.max(ly + 50 + unr.length * 31 + 96, 820);
      if (lng) ntr_hl(t, 5.6, lx, hy, '+' + fmtN(100 * (THESEUS.hours - lng.y) / lng.y, 0) + '%', 'hours', { size: 92, count: false, sub: THS.hours + ' at 1 khz against the longest listed, the ' + lng.name.replace('*', '') + ': ' + fmtN(lng.y, 0) + ' h at ' + ntr_g(lng.x) + ' g.', maxW: 520, subSize: 22 }); }
    const dc = TH ? '#5F5E59' : '#B9B8B2';
    legend(t, 4.2, x - 100, 920, [{ kind: 'dot', color: dc, label: 'Weighed by RTINGS' }, { kind: 'ring', color: dc, label: 'Maker\'s weight' }, { kind: 'line', color: C.ink, label: 'Pareto frontier' }, { kind: 'ref', label: 'The longest listed' }, { kind: 'hero', label: 'Theseus' }]);
    const un = (sc.unnamed || []);
    source(t, (un.length ? 'Unnamed: ' + un.join(', ') + '. ' : '') + '* Report rate not stated. † Finalmouse publishes no hour rating (Back2Gaming). Hours are the makers\' own figures; Theseus\'s are derived: ' + ntr_thsPack().maker + '\'s ' + ntr_thsPack().mAh + ' mAh battery at the Viper V4 Pro\'s draw, less its optical switches.', { t0: 4.4 });
  }
});

/* ============================== 10. the weight budget: where THESEUS.mass goes, with its battery (THS.hours) ============================== */
/* Brock decided (2026-11-04): his shell design takes weight out elsewhere so the cell for 200 h fits; at 21:55, "Budget is the
   target": the shell gets whatever the budget leaves. The budget, part by part: the cell from Jauch's datasheet, the one board
   his figure, Theseus's own parts (the magnesium wheel at his 0.9 g on its POM axle; F22.3, "Derive Theseus's own": the four M2
   screws and the side-button lead from the 3D model; the four brass heat-set inserts), the buttons as XBAB weighed them in the
   XA25, and the shell and skates what is left (derived), against the XA25's 12.16 g. */
const NTR_BUD = {
  wheel: 0.9,                     /* Brock (F22.1): "ours will be 0.9g", the magnesium wheel alone, as PMM's 1.0 g is "the magnesium
                                     wheel only" (srf_pmm); the 3D wheel hits it: 508.8 mm³ of AZ31B at 1.77 g/cm³ (srf_wheel3d) */
  axleMm3: 84.3, pom: 1.42,       /* the same part's POM axle: two journals, the hex in the hub and the D drive, 84.3 mm³ by its own
                                     meshes (spec.axleVolume_mm3); Delrin 150, 1.42 g/cm³ (ntrDelrinRho) */
  screws: 4, screwMm3: 23.59, ti: 4.43,   /* four M2 × 4 pan-head screws in the 3D shell (3d/shell meta.screws, shell.js length 4),
                                     23.59 mm³ each by the screw's own mesh (head 14.42 with its recess, thread 7.38, point 1.79),
                                     in titanium Ti-6Al-4V grade 5 at 4.43 g/cm³ (ntrTiRho; Brock, F25.4: "Titanium"). In the carbon
                                     steel they were (7.9 g/cm³) the four weighed 0.75 g */
  leadMm: 109.1, wireMgMm: 0.729, /* the side-button lead, J3 to the two side switches (ntrModel3d): its 8.9 mm in the board model
                                     (SIDELEAD) and on up the wall to the rear switch, 21.5 mm with three wires; SB4 on to the rear
                                     switch's NO, GND and SB5 on to the front switch's COM and NO; ×1.069 for the 6 mm lay: 109.1 mm
                                     of 32 AWG wire at 0.729 mg/mm (GORE Type ET, 0.49 lb per 1,000 ft, ntrGoreWire). The battery's
                                     own lead is in Jauch's weight for the battery */
  inserts: 4, insMm3: 15.23, brass: 8.47   /* four M2 screws in the 3D shell (3d/shell meta.screws), each in an M2 × 3.0 × Ø3.5
                                     insert (3d/parts/fasteners.js, as own_insert draws it): 15.23 mm³ of brass by its own mass
                                     estimate, at 8.47 g/cm³ (free-cutting brass, ntrBrassRho) */
};
/* the board's waterproof coat (b10_sealed; Brock ~19:40: "Add it: 27.95 g (Recommended)"): urethane 50 µm on both faces of
   the board (KEY_PARTS.board's outline) plus 10 % for the parts' flanks, at 1.05 g/cm³ (HumiSeal's coats run 25 to 75 µm).
   One figure for the budget, the balance (3d/pcb/tools/balance.py reads these constants) and b10_sealed */
const NTR_COAT = { um: 50, faces: 2, flanks: 1.1, rho: 1.05 };
/** one face of the board, cm² (the shoelace over KEY_PARTS.board's outline) */
function ntr_coatArea() { const P = KEY_PARTS.board.pts; let A2 = 0; for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length]; A2 += a[0] * b[1] - b[0] * a[1]; } return Math.abs(A2) / 2 / 100; }
/** the coat's weight (g) at um µm (default 50): rounded UP to 0.01 g, against Theseus; exact: the unrounded figure */
function ntr_coat(um = NTR_COAT.um, exact = false) {
  const g = NTR_COAT.faces * ntr_coatArea() * NTR_COAT.flanks * um / 1e4 * NTR_COAT.rho;
  return exact ? g : Math.ceil(g * 100 - 1e-9) / 100;
}
function ntr_budget() {
  const P = ntr_xa25() || [], by = re => (P.find(p => re.test(p.name)) || {}).g || 0;
  const xa = { shell: by(/^Shell/), btn: by(/^Button/), wheel: by(/^Scroll/), screws: by(/^Screws/), fpc: by(/^FPC/), boards: by(/^Front PCB/) + by(/^Main PCB/) + by(/^Side PCB/) };
  const cell = ntr_thsPack(), L = ntr_loads(), N = NTR_BUD, H = ntr_hours();
  const wheelMg = N.wheel, axle = N.axleMm3 * N.pom / 1000, wheel = wheelMg + axle, ins1 = N.insMm3 * N.brass / 1000, ins = N.inserts * ins1;
  const screw1 = N.screwMm3 * N.ti / 1000, screws = N.screws * screw1, wires = N.leadMm * N.wireMgMm / 1000;
  /* the board's coat counts in the weight (Brock ~19:40): the total went up by it, the shell's allowance did not move */
  const coat = ntr_coat(), ref = xa.btn, shell = THESEUS.mass - cell.g - THESEUS.pcb - ref - wheel - ins - screws - wires - coat;
  return { xa, cell, L, ref, wheel, wheelMg, axle, ins, ins1, screws, screw1, wires, coat, shell, cut: xa.shell - shell, hours: H.h1, H, ok: P.length > 0 };
}
S({
  id: 'budget', ch: 'intro', theme: 'paper', title: 'Weight budget: ' + THS.massG + ', ' + THS.hours, settle: 11, ideas: ['weight', 'battery'],
  src: ['exXbabWeight', 'ntrEemb', 'ntrJauch', 'exJauch', 'ntrTpuV4', 'exNbcV4', 'srf_pmm', 'srf_wheel3d', 'srf_az31b', 'ntrDelrinRho', 'ntrModel3d', 'ntrTiRho', 'ntrGoreWire', 'ntrBrassRho'],
  draw: t => {
    header(t, 'Weight budget: ' + THS.massG + ', ' + THS.hours);
    const B = ntr_budget(), f2 = v => fmtN(v, 2);
    captions(t, [[0.6, `Where ${THS.massG} goes: one board instead of three, a ${B.cell.mAh} mAh battery for ${fmtN(Math.floor(B.hours), 0)} h at 1 khz, a 0.9 g magnesium wheel, ${NTR_BUD.screws} titanium M2 screws in ${NTR_BUD.inserts} brass inserts, one braided lead, and the buttons as XBAB weighed them.`],
      [5.6, `That leaves ${f2(B.shell)} g for the shell and skates, ${f2(B.cut)} g under the XA25's. My shell design takes that out, and the battery fits.`]]);
    const rows = [
      { name: 'Shell and skates', g: B.shell, was: B.xa.shell, ev: 'derived', hero: true },
      { name: 'Battery, ' + B.cell.mAh + ' mAh', g: B.cell.g, ev: 'datasheet', note: B.cell.maker + ', about' },
      { name: 'One board', g: THESEUS.pcb, was: B.xa.boards, note: 'Radio, antenna, USB-C on it' },
      { name: 'Buttons', g: B.xa.btn, ev: 'claim', note: 'As in the XA25' },
      { name: 'Wheel and axle', g: B.wheel, ev: 'derived', note: '0.9 g + POM axle' },
      { name: 'Screws', count: NTR_BUD.screws, g: B.screws, ev: 'derived', note: 'M2 × 4 titanium, ' + f2(B.screw1) + ' g each' },
      { name: 'Brass inserts', count: NTR_BUD.inserts, g: B.ins, ev: 'derived', note: f2(B.ins1) + ' g each' },
      { name: 'Wires', g: B.wires, ev: 'derived', note: 'Side-button lead, 32 AWG' },
      { name: 'Board coat', g: B.coat, ev: 'derived', note: 'Urethane, ' + NTR_COAT.um + ' µm, both faces' }
    ];
    breakdown(t, { x: LM, y: 280, w: 1040, t0: 0.4, name: 'Theseus', sub: 'Weight budget', total: THESEUS.mass, unit: 'g', totalLabel: 'Total', dec: 2, rows, rowH: 54, stagger: 0.09, wasLabel: 'XA25', foot: ['Dashed: the XA25\'s part, as XBAB weighed it (its three boards for the board)', ''] });
    /* the two things the plan rests on: the cell's hours, and the shell's grams */
    ntr_stack(t, 1200, 320, RM - 1200, [
      { t0: 5.0, gloss: true, a: 'Hours = Wh ÷ draw', b: `${B.cell.mAh} mAh at 3.7 V holds ${fmtN(B.cell.wh, 3)} Wh. A Viper V4 Pro draws ${fmtN(B.L.w1 * 1000, 2)} mW at 1 khz (its ${fmtN(B.L.wh, 3)} Wh over Razer's ${B.L.h1} h), ${fmtN(B.L.w1 * B.H.S.keep * 1000, 2)} mW without its optical switches, so the battery runs ${fmtN(Math.floor(B.hours), 0)} h.` },
      { t0: 5.8, a: 'XBAB 2026', b: `The XA25, weighed part by part: 24.94 g in nine parts, shell and skates ${f2(B.xa.shell)} g. Its buttons stand in for mine; the screws and the lead are my own, from the 3D model.` }
    ]);
    { const ka = ep(t, 6.6, 7.2), y = 868;
      rich([{ s: f2(B.cut), role: 'stat', size: 64, color: C.heroText, grad: C.heroGrad, tnum: true, count: [6.7, 0.8] }, { s: 'g', font: 'disp', size: 26, weight: 700, color: C.mute, gap: 6 }], 1200, y, { t, alpha: ka });
      text('out of the shell: the one number the plan asks of my design', 1200 + 210, y - 22, { role: 'small', size: 24, weight: 600, color: C.ink2, maxW: RM - 1410, lh: 1.3, alpha: ka }); }
    source(t, `Derived from the 3D model: the axle ${fmtN(NTR_BUD.axleMm3, 0)} mm³ of POM at ${NTR_BUD.pom}; each screw ${fmtN(NTR_BUD.screwMm3, 1)} mm³ of titanium at ${NTR_BUD.ti}; the lead ${fmtN(NTR_BUD.leadMm, 0)} mm at ${fmtN(NTR_BUD.wireMgMm, 2)} mg/mm; each insert ${fmtN(NTR_BUD.insMm3, 1)} mm³ of brass at ${NTR_BUD.brass}.`, { t0: 3 });
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
/* out of the film, 2026-11-05 (Brock, F27: "poor execution and not super needed"). Kept, not registered. */
const HIDDEN_map = ({
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
