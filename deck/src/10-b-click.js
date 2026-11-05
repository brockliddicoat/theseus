/* ============================================================================================
   CHAPTER 01 · CLICKS. The path a press takes from the finger to the switch, and the microseconds after it.
   Every new top-level name here starts with clk_. Mechanism drawings come from 03-parts.js and from the clk_ painters
   below; the force simulations use 07-sim.js. Rebuilt 2026-11-04 after Brock's review: concept titles, room, the vocabulary
   and the research in boxes on the slide, the bridge tensioner as a frame model, dual rail main clicks and side buttons.
   ============================================================================================ */
Object.assign(SRC, {
  clk_xbabClick: { t: 'XBAB Tech on X, 2026-06-30: XA25 vs OP1 8k v2 click latency on a Beagle USB 480 analyzer, four tests with means, 95% CIs and n (XBAB measured its own mouse: a maker claim)', u: 'https://x.com/xbabtech/status/2071972219211985258' },
  clk_tpuV4: { t: 'TechPowerUp, Razer Viper V4 Pro review: click latency 79 µs wired at 8 kHz (switch actuation to USB; as recorded in the 2026-11-03 validation report)', u: 'https://www.techpowerup.com/review/razer-viper-v4-pro/' },
  clk_gt01: { t: 'MechKeys, Gateron at ZFX Shenzhen: the GT01 operates at 55 ± 5 gf over 0.35 ± 0.10 mm, is rated for 100 million clicks, has no preload and is shaped for vertical pressing (maker claim; no datasheet published)', u: 'https://mechkeys.com/blogs/news/gateron-launched-magnetic-jade-gaming-switch-and-gt01-microswitch-at-zfx-shenzhen-exhibition' },
  clk_d2fp: { t: 'Omron D2FP-FN2 datasheet (mirror): 0.59 ± 0.15 N, 70 million operations min; LED forward voltage tested at 5 mA; transmission tested with 30 µs pulses every 1 ms', u: 'https://static.chipdip.ru/lib/509/DOC042509999.pdf' },
  clk_elo: { t: 'EloShapes spec sheets: each mouse\'s main switch and its rated clicks (maker figures), via research/data/mice.json', u: 'https://www.eloshapes.com/' },
  clk_brock: { t: 'Brock Liddicoat, "In Pursuit of an Objectively Better Mouse": numbered ideas, brainstorm notes and the reviewers\' comment thread (research/brock-doc-in-pursuit.txt, research/brock-doc-comments.txt)', u: '', n: 'Competitor details cited to this document (G-Wolves, Endgame Gear, Viper V3 Pro, SLX pads, Gilmouse, Hyperlight, Atlantis, Arye) were not independently verified.' },
  clk_millmax: { t: 'Mill-Max 3305 receptacle: takes 0.635 to 0.940 mm round leads, 1,000 insertions min, 10 mΩ max, BeCu C17200 contact (Cu 98.1 / Be 1.9) with 30 µin gold over nickel on the contact only', u: 'https://www.mill-max.com/products/receptacle/3305' },
  clk_eggSwap: { t: 'Endgame Gear store: OP1 Universal Switch Set (two switch PCBs, 14 switches) and seven switch packs for the OP1 8K', u: 'https://www.endgamegear.com/products.json' },
  clk_hwbSwap: { t: 'Hardware Busters, Epomaker Carbonis teardown: a hot-swap optical switch held by an alligator clip, no solder', u: 'https://hwbusters.com/peripherals/epomaker-carbonis-mouse-review/4/' },
  clk_razerSide: { t: 'Razer Viper V4 Pro page: side-button click latency 0.33 ms against "Brand X" 1.65 ms (maker claim)', u: 'https://www.razer.com/gaming-mice/razer-viper-v4-pro' },
  clk_protolabs: { t: 'Protolabs, "Understanding injection molding tolerances" (2023): its mold tools are machined to ±0.003 in. (0.076 mm); resin tolerance ±0.002 in./in. or more (a molder on its own process: maker claim)', u: 'https://www.protolabs.com/resources/blog/understanding-injection-molding-tolerances/' }
});

/* ---------- local helpers ---------- */
/** one click: travel 0..1 with a hard stop, over a cycle phase c from cyc() */
const clk_curve = c => c < 0 ? 0 : c < 0.03 ? E.hit(c / 0.03) : c < 0.09 ? 1 : c < 0.13 ? 1 - E.out3((c - 0.09) / 0.04) : 0;
/** a snap-action switch pressed in a loop, with the contact's hysteresis (NO at 0.5 mm, back to NC at 0.3 mm) */
function clk_swc(t, t0, per) { const c = cyc(t, t0, per), pr = clk_curve(c), d = pr * SWG.TT, down = c >= 0 && c < 0.09; return { c, pr, state: (down ? d >= SWG.OP : d > 0.3) ? 'no' : 'nc' }; }
const CLK_SNAP = (() => { let no = 0, nc = 0; for (let c = 0; c < 0.2; c += 0.0002) { const d = clk_curve(c) * SWG.TT; if (!no && c < 0.09 && d >= SWG.OP) no = c; if (!nc && c > 0.09 && d <= 0.3) nc = c; } return { no, nc }; })();
/** a contact landing: a flat ring that opens and a few sparks, for 0.16 s after dt = 0 (no glow: the deck is flat) */
function clk_spark(p, dt, col, s = 1, seed = 1) {
  if (!p || dt < 0 || dt > 0.16) return;
  const k = 1 - dt / 0.16; circle(p[0], p[1], (6 + 26 * (1 - k)) * s, { color: col, w: 2.5 * k + 0.5, alpha: k });
  const r = rng(seed); for (let i = 0; i < 7; i++) { const a = r() * TAU, d = (5 + dt * 280 * (0.6 + r() * 0.6)) * s; circle(p[0] + Math.cos(a) * d, p[1] + Math.sin(a) * d * 0.7, 1.8 * s, { fill: col, alpha: k * 0.9 }); }
}
function clk_lamp(x, y, label, on, col, a = 1) { circle(x, y, 8, { fill: on ? col : 'rgba(0,0,0,0)', color: on ? col : C.faint, w: 2, alpha: a }); if (on) circle(x, y, 15, { color: col, w: 1.5, alpha: 0.35 * a }); text(label, x + 18, y + 8, { role: 'label', color: on ? col : C.faint, alpha: a }); }
/** a tile: the deck's card with its head (label, evidence tags); returns the y under the head */
function clk_tile(t, t0, x, y, w, h, label, ev, o = {}) {
  demoWindow(x, y, w, h, ep(t, t0, t0 + 0.55), { grid: o.grid, hero: o.hero });
  return label ? cardHead(t, t0 + 0.2, x, y, w, label, ev || [], o) : y + 24;
}
/** a stack of boxes down a column: items = [[fn(y) → { h }], ...], 40 px apart. returns the y under the last */
function clk_stack(y, fns, gap = BOX.gap) { for (const f of fns) { const r = f(y); y += (r && r.h ? r.h : 0) + gap; } return y - gap; }
/** a live readout: a mono label over a big display number and its unit */
function clk_big(t, x, y, label, num, unit, o = {}) {
  const a = o.alpha == null ? 1 : o.alpha; if (a <= 0.003) return 0;
  if (label) text(label, x, y - (o.size || 72) - 18, { role: 'label', size: 21, color: o.lcolor || C.mute, alpha: a, align: o.align });
  const r = rich([{ s: num, role: 'd1', size: o.size || 72, color: o.color || C.ink, tnum: true }, unit ? { s: unit, font: 'sans', size: Math.max(24, Math.round((o.size || 72) * 0.34)), weight: 650, color: o.ucolor || C.mute, gap: 10 } : null], x, y, { alpha: a, align: o.align });
  return r.w;
}

/* ---------- at a glance (Brock, F14.10, F16.1): the headline number in Theseus's colour, and before → after readouts ---------- */
/** a headline: a huge number in Theseus's gradient, a word beside it in display caps, and under it, against what.
   (x, y) = the number's baseline, left (o.align 'right': x is the right edge). o = { size, sub, maxW, a, count }. Returns { w } */
function clk_hl(t, t0, x, y, num, word, o = {}) {
  const a = (o.a == null ? 1 : o.a) * ep(t, t0, t0 + 0.45); if (a <= 0.003) return { w: 0 };
  const sz = o.size || 150, k = E.out3(ep(t, t0, t0 + 0.7));
  G.save(); G.translate(0, (1 - k) * 18);
  const r = rich([{ s: num, role: 'd1', size: sz, weight: 800, track: -0.03, color: C.heroText, grad: C.heroGrad, tnum: true, count: o.count === false ? null : [t0, 0.9] },
    word ? { s: word, role: 'd2', size: Math.round(sz * 0.34), color: C.heroText, grad: C.heroGrad, gap: Math.round(sz * 0.09) } : null], x, y, { t, alpha: a, align: o.align });
  if (o.sub) text(o.sub, x, y + Math.round(sz * 0.2) + 26, { role: 'small', size: o.subSize || 25, weight: 600, color: C.ink2, align: o.align, alpha: a * ep(t, t0 + 0.3, t0 + 0.8), maxW: o.maxW || 900, lh: 1.3 });
  G.restore();
  return r;
}
/** before → after: the bad value stays on screen, grey and struck, beside the live one; the net change under them in
   Theseus's colour. (x, y) = the live value's baseline row, left. o = { label, before, after, net, size (the live value, 72),
   k (0..1, how far the change has gone: the before value and the net appear once it starts; the live value turns Theseus's
   colour when it lands), a, good (the live value's colour once landed: true = Theseus's) }. Returns the row's width */
function clk_ba(t, x, y, o) {
  const a = o.a == null ? 1 : o.a; if (a <= 0.003) return 0;
  const sz = o.size || 72, bs = Math.round(sz * 0.52), k = o.k == null ? 1 : o.k, kb = clamp(k * 6), landed = k > 0.985;
  if (o.label) text(o.label, x, y - sz * 0.74 - 22, { role: 'label', size: 21, color: C.mute, alpha: a });
  let xx = x;
  if (kb > 0.003) {
    const bw = tw(o.before, { role: 'd1', size: bs, weight: 800, tnum: true });
    text(o.before, xx, y, { role: 'd1', size: bs, weight: 800, track: -0.02, color: C.faint, tnum: true, alpha: a * kb });
    line(xx - 3, y - bs * 0.34, xx + bw + 3, y - bs * 0.34, { color: C.mute, w: Math.max(2, bs * 0.055), alpha: a * kb });
    const as = Math.max(21, Math.round(bs * 0.8));
    text('→', xx + bw + 14, y - bs * 0.06, { font: 'disp', size: as, weight: 700, color: C.faint, alpha: a * kb });
    xx += bw + 14 + tw('→', { font: 'disp', size: as, weight: 700 }) + 16;
  }
  const hero = (o.hero || landed) && o.good !== false, col = hero ? C.heroText : k <= 0.003 && o.bad ? o.bad : C.ink;
  const r = text(o.after, xx, y, { role: 'd1', size: sz, weight: 800, track: -0.03, color: col, grad: hero ? C.heroGrad : null, tnum: true, alpha: a });
  if (o.unit) { const us = Math.max(24, Math.round(sz * 0.34)); text(o.unit, xx + r.w + 10, y, { font: 'sans', size: us, weight: 650, color: C.mute, alpha: a }); r.w += 10 + tw(o.unit, { font: 'sans', size: us, weight: 650 }); }
  if (o.net && kb > 0.003) { if (o.netRight) text(o.net, xx + r.w + 28, y - Math.round(sz * 0.12), { role: 'small', size: o.netSize || 26, weight: 700, color: C.heroText, alpha: a * kb, maxW: o.netW || 640, lh: 1.25 }); else text(o.net, x, y + Math.round(sz * 0.18) + 24, { role: 'small', size: o.netSize || 24, weight: 700, color: C.heroText, alpha: a * kb }); }
  return xx + r.w - x;
}

/* 3D. Scene names and state keys are the stable API. In 2D mode every shot here is the flat twin (08-v2d.js); dev2d brings
   back labelled boxes for layout work. */
const CLK_3D = { click: true, cut: true, dev2d: false };
/** register a slide; in dev2d mode its 3D scenes are not even loaded */
const clk_S = o => S(CLK_3D.dev2d ? Object.assign(o, { three: undefined }) : o);
function clk_v3(key, t, x, y, w, h, st, o = {}) {
  const s = Object.assign({}, st);
  if (!CLK_3D.click) { delete s.clickL; delete s.clickR; }
  if (!CLK_3D.cut) { delete s.cutaway; delete s.section; }
  if (CLK_3D.dev2d) { rect(x, y, w, h, { color: inkA(0.2), w: 1.5 }); text('3D ' + key, x + w / 2, y + h / 2, { role: 'label', color: C.faint, align: 'center' }); return true; }
  return view3D(key, t, x, y, w, h, s, o);
}

/** where a part sits in the 3D shot just drawn into box: on the render (R3D.anchor) when the render was drawn, else on its flat
   twin (v2dAt). drawn = view3D's return value. The shared v3At does the same, but this works with either version of 08-r3d.js */
function clk_at3(key, st, box, drawn, re, f = [0.5, 0.5, 0.5]) {
  if (drawn && !V2D.on && !V3.proj && typeof R3D !== 'undefined' && R3D.anchor) {
    const uv = R3D.anchor(key, re, f, TH ? 'paper' : 'night');
    if (uv) return [box[0] + uv[0] * box[2], box[1] + uv[1] * box[3]];
  }
  return typeof v2dAt === 'function' ? v2dAt(key, st, box, re, f) : null;
}

/* ---------- step further: what ships today, and the step Theseus takes past it ----------
   rows: [{ n: '#3', who: 'G-Wolves', ev: 'claim', evText: 'Community', now: '...', step: '...' }]. Each row types the shipping
   version, an arrow runs across, then the Theseus step wipes in on an edge in the Theseus colour. clk_stepsH gives the strip's height. */
const CLK_ST = { hh: 46, lh: 33, pad: 22 };
function clk_stepLines(rows, w) {
  const lw = Math.round(w * 0.45), rwid = w - lw - 96 - 46;
  return rows.map(r => Math.max(
    para([{ s: r.who + '. ', role: 'small', weight: 700 }, { s: r.now, role: 'small' }], 0, 0, { maxW: lw - 74, lh: CLK_ST.lh, alpha: 0 }).lines,
    para([{ s: r.step, role: 'small', weight: 600 }], 0, 0, { maxW: rwid, lh: CLK_ST.lh, alpha: 0 }).lines));
}
const clk_stepsH = (rows, w) => CLK_ST.hh + clk_stepLines(rows, w).reduce((p, n) => p + n * CLK_ST.lh + CLK_ST.pad, 0) + 6;
function clk_steps(t, t0, x, y, w, rows, o = {}) {
  const lw = Math.round(w * 0.45), rx = x + lw + 96, rwid = x + w - rx - 46, a0 = ep(t, t0, t0 + 0.4), hh = CLK_ST.hh;
  const nl = clk_stepLines(rows, w), rhs = nl.map(n => n * CLK_ST.lh + CLK_ST.pad), h = clk_stepsH(rows, w);
  if (a0 <= 0.003) return y + h;
  G.save(); G.translate(0, (1 - E.out3(a0)) * 14);
  demoWindow(x, y, w, h, a0, { plain: true });
  text('Shipping today', x + 24, y + 32, { role: 'label', size: 21, color: C.mute, alpha: a0 });
  const kinds = []; rows.forEach(r => { if (!kinds.some(k => k.ev === r.ev && k.txt === r.evText)) kinds.push({ ev: r.ev, txt: r.evText }); });
  let px = x + lw - 6;
  for (let i = kinds.length - 1; i >= 0; i--) { const pw = pillW(kinds[i].ev, { text: kinds[i].txt }); px -= pw; pill(px, y + 34, kinds[i].ev, a0, { text: kinds[i].txt }); px -= 10; }
  const ka = ep(t, t0 + 0.5, t0 + 0.9);
  rich([{ s: 'Theseus', role: 'label', size: 21, color: C.onHero, chip: C.heroChip }, { s: 'One step further', role: 'label', size: 21, color: C.heroText, gap: 18 }], rx + 26, y + 32, { alpha: ka });
  pill(x + w - 24 - pillW('proposal'), y + 34, 'proposal', ka);
  line(x + 18, y + hh, x + w - 18, y + hh, { color: C.hair, w: 1.2, alpha: a0 });
  let yy = y + hh;
  rows.forEach((r, i) => {
    const tr = t0 + 0.35 + i * 0.9, ka2 = ep(t, tr, tr + 0.3), kb = ep(t, tr + 0.45, tr + 0.85, E.out3), kc = ep(t, tr + 0.75, tr + 1.1), rh = rhs[i];
    if (i) line(x + 18, yy, x + w - 18, yy, { color: C.hair, w: 1, alpha: ka2 });
    const cy = yy + 10 + CLK_ST.lh * nl[i] / 2;
    /* the idea number, then the maker: type only, no square between them (F9.5); the source is the tag in the strip's head */
    text(r.n, x + 24, yy + 33, { role: 'label', size: 21, color: C.faint, alpha: ka2 });
    para([{ s: r.who + '. ', role: 'small', weight: 700, color: C.ink }, { s: r.now, role: 'small', color: C.ink2 }], x + 84, yy + 33, { maxW: lw - 74, lh: CLK_ST.lh, t, t0: tr, cps: 150, alpha: ka2 });
    if (kb > 0) { const ax0 = x + lw + 14, ax1 = rx - 14; arrow(ax0, cy, lerp(ax0, ax1, kb), cy, { color: C.heroText, w: 3, hs: 13 }); }
    if (kc > 0) {
      G.save(); G.beginPath(); G.rect(rx, yy + 2, (x + w - rx) * E.out3(kc), rh - 4); G.clip();
      rect(rx, yy + 9, 6, rh - 18, { fill: C.hero });
      para([{ s: r.step, role: 'small', weight: 600, color: C.ink }], rx + 26, yy + 33, { maxW: rwid, lh: CLK_ST.lh, t, t0: tr + 0.75, cps: 150 });
      G.restore();
    }
    yy += rh;
  });
  G.restore();
  return y + h;
}

/* the content area every slide here shares, on the stage's 40 px grid: a big column (1040) and a small one (680), 40 apart,
   from y 280 to 960 (no band at the foot) */
const CLK_G = { a: [80, 1040], b: [1160, 680] }, CLK_TOP = 280, CLK_BOT = 960;
const clk_snap = h => Math.ceil(h / 40 - 1e-6) * 40;
/** a box on the grid: measured first (drawn at alpha 0), then drawn at its height rounded up to 40 px. o as noteBox */
function clk_box(t, t0, x, y, w, o) { const h = clk_snap(noteBox(t, 1e9, x, y, w, o).h); noteBox(t, t0, x, y, w, Object.assign({}, o, { h })); return { h }; }
const clk_gloss = (t, t0, x, y, w, term, def) => clk_box(t, t0, x, y, w, { label: 'Vocab', value: term, body: def });
const clk_src = (t, t0, x, y, w, who, finding, o = {}) => clk_box(t, t0, x, y, w, Object.assign({ value: who, body: finding, src: true, label: null }, o));

/* ============================== 00. chapter card ============================== */
clk_S({
  id: 'clicks', ch: 'click', card: true, theme: 'night', title: 'Clicks', settle: 6, three: ['gt01'],
  sfxLoop: [{ t0: 2.4, per: 2.6, cues: [[0, 'click'], [0.11, 'release']] }],
  draw: t => {
    chapterCard(t, {
      name: 'Clicks', gloss: 'The path a press takes from your finger to the switch, and the microseconds after it.',
      list: [['#2 #78', 'Direct Drive Actuation, on a mechanical switch'], ['#17 #18', 'Straight rear cutouts'], ['#49 #50', 'A bridge tensioner'], ['#3 #28', 'Dual rail main clicks, on POM pads'],
        ['#46–48', 'Flat front cutouts, flush walls'], ['#14', 'Switches that swap without solder'], ['#79', 'SPDT: single pole, double throw'], ['#80 #64', 'Dual rail side buttons, on full-size SPDT']]
    });
    /* the part in the iris: the GT01, pressing. In 2D it is this chapter's own drawing of it, from Gateron's images and the 3D
       model's numbers (Brock, F12.7, F14.3); in 3D, the model */
    const sw = clk_swc(t, 2.4, 2.6), pr = clk_curve(cyc(t, 2.4, 2.6)), a = ep(t, 1.0, 1.8);
    if (V2D.on) part(1407, 664, 26, () => clk_gt01MM({ press: sw.pr, state: sw.state }), { alpha: a });
    else clk_v3('gt01', t, 1380 - 330, 580 - 250, 660, 470, { press: pr, view: 'left', yaw: 0.42, pitch: -0.08, zoom: 1.55 }, { alpha: a });
    text('Gateron GT01, representative model', 1380, 870, { role: 'label', size: 21, color: C.mute, align: 'center', alpha: ep(t, 2.0, 2.4) });
    text('Gateron has published no datasheet', 1380, 904, { role: 'label', size: 19, color: C.faint, align: 'center', alpha: ep(t, 2.2, 2.6) });
  }
});

/* ============================== 01. Direct Drive Actuation (#2): push the switch along its own axis ============================== */
clk_S({
  id: 'arc', ch: 'click', theme: 'paper', title: 'Direct Drive Actuation', settle: 10, ideas: [2],
  src: ['omronD2fPre', 'omronD2f', 'clk_brock'],
  sfxLoop: [{ t0: 2.6, per: 3, cues: [[0.0, 'click'], [0.09, 'release']] }],
  draw: t => {
    header(t, 'Direct Drive Actuation');
    captions(t, [[0.6, 'The trigger turns about the bend in its tensioner, so at the switch it moves on an arc.'], [3.6, 'An upright switch takes only the part of that arc along its axis. The rest pushes its plunger sideways.'], [6.6, 'Turn the switch to the arc and the whole press drives the plunger. That is Direct Drive Actuation.']]);
    const A = acc(), [wx, ww] = CLK_G.a, wy = CLK_TOP, wh = CLK_BOT - wy;
    clk_tile(t, 0.3, wx, wy, ww, wh, 'One trigger cut through, its plunger 31 mm from the bend', ['derived']);
    const tilt = ep(t, 5.0, 6.4, E.io3), c = cyc(t, 2.6, 3), pr = clk_curve(c) * 0.75, s = 13.5, ox = wx + 100 + 16 * s, oy = wy + 340;
    const o = drawClick(ox, oy, s, { press: pr, tilt, ghost: ep(t, 5.0, 5.6) * (tilt > 0.02 ? 1 : 0), pivot: ep(t, 1.0, 1.4), arc: ep(t, 1.6, 2.2), accent: A, alpha: Math.max(0.004, ep(t, 0.4, 1.0)) });
    /* the leader drops straight from the bend and turns left to the label's right end, so it never runs through the words */
    callout(t, 1.2, o.rc, 'The trigger turns about this bend', { to: [o.rc[0] - 26, o.rc[1] + 96], side: 'l', elbow: o.rc[0], color: C.ink2, tcolor: C.ink2, maxW: 236, prose: true });
    /* the pointer presses the trigger's front */
    if (o.trigTop) {
      const tp = o.trigTop(36), ka = ep(t, 1.7, 2.4, E.cam), st = [tp[0] + 170, tp[1] - 150];
      cursorPtr(lerp(st[0], tp[0], ka), lerp(st[1], tp[1], ka), { a: ep(t, 1.5, 1.9), press: c >= 0 && c < 0.1 ? c / 0.1 : 0 });
    }
    /* the motion at the plunger, split along the switch axis and across it, in a magnifier */
    const g = o.geo || {}, mis = g.mis || 0, ax = o.axisDir, mv = o.motion;
    const bx = wx + ww - 170, by = wy + 210, br = 104, kb = ep(t, 2.4, 2.9);
    if (kb > 0 && o.footW) {
      line(o.footW[0], o.footW[1], bx - br * 0.72, by + br * 0.7, { color: C.faint, w: 1.2, dash: [4, 4], alpha: kb });
      circle(bx, by, br, { fill: C.panel, color: C.ink, w: 1.5, alpha: kb });
      const L = 170, P0 = [bx - mv[0] * L * 0.5, by - mv[1] * L * 0.5], along = mv[0] * ax[0] + mv[1] * ax[1];
      const P1 = [P0[0] + mv[0] * L, P0[1] + mv[1] * L], Pa = [P0[0] + ax[0] * L * along, P0[1] + ax[1] * L * along];
      G.save(); G.beginPath(); G.arc(bx, by, br - 2, 0, TAU); G.clip();
      /* before → after: once the switch turns, the upright axis and the sideways push it made stay behind as ghosts */
      if (tilt > 0.02) {
        const ta = -(g.tilt || 0), ax0 = [ax[0] * Math.cos(ta) - ax[1] * Math.sin(ta), ax[0] * Math.sin(ta) + ax[1] * Math.cos(ta)], al0 = mv[0] * ax0[0] + mv[1] * ax0[1];
        const Pa0 = [P0[0] + ax0[0] * L * al0, P0[1] + ax0[1] * L * al0], kg = kb * ep(t, 5.0, 5.6) * 0.55;
        line(P0[0] - ax0[0] * 90, P0[1] - ax0[1] * 90, P0[0] + ax0[0] * 240, P0[1] + ax0[1] * 240, { color: C.faint, w: 1.5, dash: [3, 6], alpha: kg });
        arrow(Pa0[0], Pa0[1], P1[0], P1[1], { color: C.bad, w: 2.5, hs: 10, alpha: kg * 0.8, dash: [4, 4] });
      }
      line(P0[0] - ax[0] * 90, P0[1] - ax[1] * 90, P0[0] + ax[0] * 240, P0[1] + ax[1] * 240, { color: A, w: 1.5, dash: [5, 5], alpha: kb });
      arrow(P0[0], P0[1], P1[0], P1[1], { color: C.ink, w: 3.5, hs: 15, alpha: kb });
      arrow(P0[0], P0[1], Pa[0], Pa[1], { color: C.hero, w: 4, hs: 15, alpha: kb });
      if (Math.hypot(P1[0] - Pa[0], P1[1] - Pa[1]) > 4) arrow(Pa[0], Pa[1], P1[0], P1[1], { color: C.bad, w: 3.5, hs: 12, alpha: kb });
      G.restore();
      text('At the plunger', bx, by - br - 16, { role: 'label', size: 21, color: C.mute, align: 'center', alpha: kb });
    }
    /* the numbers, live as the switch turns, each beside the upright switch's (Brock, F16.1: before → after). The sideways share
       is the headline, top left where the tile is empty; the angle and the share along the axis sit under the trigger, clear of
       the switch and its board */
    const r0 = g.rad || 0, deg = mis * 180 / Math.PI, deg0 = r0 * 180 / Math.PI, sd = Math.sin(mis) * 100, sd0 = Math.sin(r0) * 100, al = Math.cos(mis) * 100, al0 = Math.cos(r0) * 100;
    { const kk = ep(t, 3.0, 3.5); G.save(); G.translate(0, (1 - E.out3(kk)) * 16);
      clk_ba(t, wx + 32, wy + 222, { label: 'Sideways at the plunger (lower is better)', before: sd0.toFixed(1) + '%', after: sd.toFixed(1) + '%', net: '−' + (sd0 - sd).toFixed(1) + ' pts sideways', size: 118, k: tilt, a: kk, bad: C.bad });
      G.restore(); }
    [['Off-axis angle', deg0.toFixed(1) + '°', deg.toFixed(1) + '°', '−' + (deg0 - deg).toFixed(1) + '° off the axis'], ['Along the axis', al0.toFixed(1) + '%', al.toFixed(1) + '%', '+' + (al - al0).toFixed(1) + ' pts along it']].forEach(([l, b, v, n], i) => {
      const kk = ep(t, 3.2 + i * 0.15, 3.7 + i * 0.15);
      G.save(); G.translate(0, (1 - E.out3(kk)) * 16); clk_ba(t, wx + 32 + i * 250, wy + wh - 78, { label: l, before: b, after: v, net: n, size: 48, k: tilt, a: kk }); G.restore();
    });
    /* the vocabulary and the source, right */
    const [cx, cw] = CLK_G.b;
    clk_stack(wy, [
      y => clk_gloss(t, 3.2, cx, y, cw, 'Off-axis load', 'The part of a press that pushes the plunger sideways, not down. It scrapes the guide and adds nothing to the click.'),
      y => clk_src(t, 4.4, cx, y, cw, 'Omron D2F datasheet', 'Mount the switch flat and press it straight: Omron gives no rating at all for a press off its axis.'),
      y => clk_box(t, 7.0, cx, y, cw, { label: 'Shipping today', value: 'Endgame Gear', head: 'Angled switches (#2)', body: 'Voted best click feel. Endgame Gear publishes no angle; I will.' })
    ]);
  }
});

/* ============================== 02. the wedge is in the switch: one flat board ============================== */
clk_S({
  id: 'clk_wedge', ch: 'click', theme: 'night', title: 'A switch wedge, one flat board', settle: 8, ideas: [2],
  src: ['clk_gt01', 'clk_brock'], three: ['pcb'],
  sfxLoop: [{ t0: 2.0, per: 3, cues: [[0.0, 'click'], [0.09, 'release']] }],
  draw: t => {
    header(t, 'A switch wedge, one flat board');
    captions(t, [[0.6, 'I put the angle in the switch itself: the GT01 sits on its own 20° wedge, turned to the trigger\'s arc.'], [4.0, 'So the board stays one flat piece, and the angle follows the measured arc. I will publish both.']]);
    const lx = LM, lw = 640, vx = 760, vw = RM - vx, wy = CLK_TOP, wh = CLK_BOT - wy;
    /* the shot, big, on the right: the right main switch, pressing, on its wedge */
    clk_tile(t, 0.3, vx, wy, vw, wh, 'Theseus, right main switch, side on', ['claim', 'proposal']);
    const pr = clk_curve(cyc(t, 2.0, 3)), push = ep(t, 0.6, 3.2, E.cam);
    clk_v3('pcb', t, vx + 10, wy + 70, vw - 20, wh - 140, { pressR: pr, view: 'left', yaw: 0.5 + 0.06 * (1 - push), pitch: -0.12, zoom: in2D(lerp(4.4, 5.2, push), lerp(3.6, 4.2, push)), target: in2D([-16, 9.5, 37.5], [-16, 9.5, 36.7]), hide2d: /\/WHEEL\//, hi2d: { re: /\/SW2\//, color: C.hero } }, { alpha: ep(t, 0.9, 1.5) });
    text('Representative model: Gateron has published no datasheet', vx + 28, wy + wh - 26, { role: 'label', size: 19, color: C.faint, alpha: ep(t, 1.6, 2.0) });
    /* the left column: the step past what ships, and the one board */
    clk_stack(wy, [
      y => clk_box(t, 1.4, lx, y, lw, { label: 'Theseus', value: 'One step further', head: 'The wedge is in the switch', body: 'The board stays one flat piece. The angle follows the measured arc, and I publish it.' }),
      y => { statTile(t, 2.6, [lx, y, lw, 240], { hero: true, pre: 'Second boards to tilt the switch', value: '0', label: 'One flat board, about ' + THESEUS.pcb + ' g' }); return { h: 240 }; },
      y => clk_gloss(t, 3.8, lx, y, lw, 'Bottom housing', 'A sloped seat under the switch: it stands at the arc\'s angle while its legs stay square to the board.')
    ]);
  }
});

/* ============================== 03. a mechanical switch, pushed straight (#78) ============================== */
/** rated life per switch, from mice.json (maker figures via EloShapes): computed on first use, since RDATA helpers load later */
let CLK_LIFE = null;
function clk_life() {
  if (CLK_LIFE) return CLK_LIFE;
  const pick = (id, name, qual, o = {}) => { const m = typeof exMouse === 'function' ? exMouse(id) : null, v = m ? /(\d+)M\s*$/.exec(String(rv(m.main_switches) || '')) : null; return v ? Object.assign({ name, qual, v: +v[1] }, o) : null; };
  CLK_LIFE = [pick('vgn-dragonfly-3-master-gt', 'VGN × Kailh optical', 'Dragonfly 3', { ref: true }), pick('keychron-g3', 'Huano yellow', 'Keychron G3'),
    { name: 'Gateron GT01', qual: 'Theseus', v: 100, hero: true }, pick('razer-viper-v4-pro', 'Razer optical Gen-4', 'Viper V4 Pro'),
    pick('finalmouse-slx', 'Huano blue, pink dot', 'SLX, ULX'), pick('ninjutso-sora-v2', 'Omron optical', 'Sora V2')].filter(Boolean);
  return CLK_LIFE;
}
/** the Gateron GT01 as Gateron's images show it (Brock, F12.7, F14.3), in the 3D model's own numbers. A black bottom housing
   sits flat on the board: its top is the switch's base plane at 20°, both ends lean with the switch, and four cut-outs go
   through its 1 mm skin (two round holes, a slot along the tilt, a triangle). On it, a standard SPDT microswitch, 12.8 mm long:
   the cover; a normal plunger (a rounded cap 0.45 mm proud of the cover, a captive flange, a nose on the leaf, 0.35 mm of
   travel); the flat gold leaf, riveted on the COM tab at the plunger end, carrying the moving contact at its free end between
   NC above and NO below (0.30 mm apart); its tongue, a flat strip from the window's tip to the fulcrum notch, nearly straight
   with a 0.12 mm arch that turns over at the snap. Three flat pins go straight down through the board: COM at the plunger end,
   NO in the middle, NC at the back. No fourth pin, no noodle.
   Side view, y down, mm, origin on the board's top under the housing's middle, the plunger end (the front, the low end) on the
   left. o = { press 0..1 (of the plunger's 0.35 mm), state 'nc' | 'no', clear (cover clear, default true) }. Returns stage points */
const CLK_G1 = { c: Math.cos(Math.PI / 9), s: Math.sin(Math.PI / 9), oy: 2.69, yL: 4.5, zA: 4.25, zN: 3.4, zE: -4.55, zC: -4.0, gap: 0.3, tr: 0.35 };
function clk_gt01MM(o = {}) {
  const K = CLK_G1, d = clamp(o.press || 0) * K.tr, no = o.state ? o.state === 'no' : d >= 0.2, clear = o.clear !== false, out = {};
  const W = (z, y) => [-z, -y];                                                  /* world (z to the plunger end, y up) → drawing */
  const S = (zs, ys) => W(zs * K.c + ys * K.s, K.oy - zs * K.s + ys * K.c);      /* the switch's own frame → drawing */
  const path = (pts, r = 0) => {
    const n = pts.length; G.beginPath();
    if (!r) { pts.forEach((p, i) => i ? G.lineTo(p[0], p[1]) : G.moveTo(p[0], p[1])); G.closePath(); return; }
    G.moveTo((pts[0][0] + pts[n - 1][0]) / 2, (pts[0][1] + pts[n - 1][1]) / 2);
    for (let i = 0; i < n; i++) { const p = pts[i], q = pts[(i + 1) % n], ri = Array.isArray(r) ? r[i] : r; if (ri > 0) G.arcTo(p[0], p[1], q[0], q[1], ri); else G.lineTo(p[0], p[1]); }
    G.closePath();
  };
  const boxS = (z0, z1, y0, y1) => [S(z0, y0), S(z1, y0), S(z1, y1), S(z0, y1)];
  const fill = (fn, f, e, px = 1) => { fn(); G.fillStyle = f; G.fill(); if (e) { G.strokeStyle = e; G.lineWidth = lw(px); G.lineJoin = 'round'; G.stroke(); } };
  const blk = TH ? '#2B2C31' : '#26272C', pocket = TH ? '#121316' : '#0C0D0F', inner = TH ? '#3A3B41' : '#34353B', eB = edgeCol(MT.black);
  const brass = TH ? '#C79B45' : '#B98F3E', eM = 'rgba(70,48,10,0.7)', gold = '#D9AA4C', silver = TH ? '#D9DDE2' : '#C3C8CE', eS = 'rgba(40,44,50,0.65)';
  /* the board, with three plated holes, and the three flat pins straight down through it */
  pcbSec(-9.2, 9.2, 0, 1.2, { holes: [-5.08, 0, 5.08] });
  for (const z of [5.08, 0, -5.08]) { const [x] = W(z, 0); fill(() => path([[x - 0.3, -0.4], [x + 0.3, -0.4], [x + 0.3, 2.95], [x + 0.12, 3.3], [x - 0.12, 3.3], [x - 0.3, 2.95]]), gold, eM, 0.8); }
  out.legs = [5.08, 0, -5.08].map(z => SP(W(z, 0)[0], 3.3));
  /* the bottom housing, one black block: flat on the board, its top the switch's base plane, both ends leaning with it */
  const hp = [W(-6.01, 0), W(6.01, 0), W(6.01, 0.5), W(6.7, 2.38), W(-5.33, 6.75), W(-6.01, 4.88)];
  fill(() => path(hp, [0.1, 0.1, 0.12, 0.3, 0.3, 0.12]), blk, eB, 1.1);
  /* the four cut-outs through its skin, dark pockets with a lit lower rim */
  const cut = (fn) => { fill(fn, pocket, null); G.save(); fn(); G.clip(); fn(); G.strokeStyle = 'rgba(255,255,255,0.13)'; G.lineWidth = lw(2.2); G.stroke(); G.restore(); fn(); G.strokeStyle = 'rgba(0,0,0,0.5)'; G.lineWidth = lw(1); G.stroke(); };
  cut(() => { const p = W(-3.6, 4.73); G.beginPath(); G.arc(p[0], p[1], 0.95, 0, TAU); });
  cut(() => { const p = W(2.9, 2.2); G.beginPath(); G.arc(p[0], p[1], 0.85, 0, TAU); });
  { const p = W(-0.4, 2.45), u = [-K.c, K.s], v = [-K.s, -K.c], h = 0.54, r = 0.36, a = Math.atan2(v[1], v[0]), ccw = u[0] * v[1] - u[1] * v[0] < 0;
    cut(() => { G.beginPath(); G.moveTo(p[0] + u[0] * h + v[0] * r, p[1] + u[1] * h + v[1] * r); G.lineTo(p[0] - u[0] * h + v[0] * r, p[1] - u[1] * h + v[1] * r);
      G.arc(p[0] - u[0] * h, p[1] - u[1] * h, r, a, a + Math.PI, ccw); G.lineTo(p[0] + u[0] * h - v[0] * r, p[1] + u[1] * h - v[1] * r); G.arc(p[0] + u[0] * h, p[1] + u[1] * h, r, a + Math.PI, a, ccw); G.closePath(); }); }
  cut(() => path([W(-5.56, 0.75), W(-1.4, 0.75), W(-5.56, 3.0)], 0.3));
  out.housing = SP(...W(-1.0, 1.05)); out.wedge = SP(...W(4.4, 2.6)); out.foot = SP(0, 0.6); out.ang = Math.PI / 9;
  /* the switch: inside the cover first (seen through it when it is clear) */
  const leafY = z => { if (z >= K.zA) return K.yL; if (z >= K.zN) { const u = (K.zA - z) / (K.zA - K.zN); return K.yL - d * u * u * (3 - 2 * u); } const u = (K.zN - z) / (K.zN - K.zE), yE = no ? K.yL - K.gap : K.yL; return K.yL - d + (yE - K.yL + d) * u * u * (3 - 2 * u); };
  if (clear) {
    /* the base's own moulding under the contacts: pedestals and a low guide rail */
    for (const [z0, z1, y1] of [[-6.0, -5.23, 4.63], [-4.58, -3.31, 3.65], [4.69, 5.96, 3.01], [-3.51, 3.91, 2.57]]) fill(() => path(boxS(z0, z1, 1.98, y1), 0.06), inner, eB, 0.8);
    /* the terminals: NC post and arm (back), NO riser and tab, COM post with its tab and its fulcrum notch (plunger end) */
    const term = pts => fill(() => path(pts, 0.04), brass, eM, 0.8);
    term([S(-5.23, 1.98), S(-4.92, 1.98), S(-4.92, 4.8), S(-3.39, 4.8), S(-3.39, 5.06), S(-5.23, 5.06)]);
    term([S(-3.66, 1.98), S(-3.34, 1.98), S(-3.34, 3.91), S(-4.65, 3.91), S(-4.65, 3.64), S(-3.66, 3.64)]);
    term([S(4.93, 1.98), S(5.24, 1.98), S(5.24, 4.46), S(4.25, 4.46), S(4.25, 4.2), S(4.93, 4.2), S(4.93, 3.34), S(4.01, 3.34), S(4.13, 3.205), S(4.01, 3.07), S(4.93, 3.07)]);
    /* the fixed contacts: NC under the arm, NO on the tab, silver domes */
    const dome = (zc, yb, up, hh = 0.16) => fill(() => { const a = S(zc - 0.42, yb), b = S(zc + 0.42, yb), m = S(zc, yb + (up ? hh : -hh)); G.beginPath(); G.moveTo(a[0], a[1]); G.quadraticCurveTo(2 * m[0] - (a[0] + b[0]) / 2, 2 * m[1] - (a[1] + b[1]) / 2, b[0], b[1]); G.closePath(); }, silver, eS, 0.7);
    dome(K.zC, 4.81, false); dome(K.zC, 3.88, true);
    out.nc = SP(...S(K.zC, 4.93)); out.no = SP(...S(K.zC, 3.77));
    /* the tongue: a flat strip from the window's tip (on the leaf) to the fulcrum notch, nearly straight; its 0.12 mm arch turns over at the snap */
    const tA = S(-3.15, leafY(-3.15) - 0.02), tB = S(4.09, 3.205), tn = [tB[1] - tA[1], -(tB[0] - tA[0])], tl = Math.hypot(tn[0], tn[1]), ar = (no ? -0.24 : 0.24) / tl;
    const tC = [(tA[0] + tB[0]) / 2 + tn[0] * ar, (tA[1] + tB[1]) / 2 + tn[1] * ar];
    G.beginPath(); G.moveTo(tA[0], tA[1]); G.quadraticCurveTo(tC[0], tC[1], tB[0], tB[1]); G.strokeStyle = '#B7893A'; G.lineWidth = 0.1; G.lineCap = 'butt'; G.stroke();
    out.tongue = SP((tA[0] + tB[0]) / 2 + tn[0] * ar / 2, (tA[1] + tB[1]) / 2 + tn[1] * ar / 2);
    /* the leaf: flat gold strip, clamped on the COM tab, pressed by the nose, its free end on NC or NO */
    const lp = []; for (let z = 5.21; z >= K.zE - 1e-9; z -= 0.05) lp.push(S(z, leafY(z)));
    G.beginPath(); lp.forEach((p, i) => i ? G.lineTo(p[0], p[1]) : G.moveTo(p[0], p[1])); G.strokeStyle = gold; G.lineWidth = 0.12; G.lineCap = 'butt'; G.lineJoin = 'round'; G.stroke();
    G.beginPath(); lp.forEach((p, i) => { const q = [p[0] - 0.035 * K.s, p[1] - 0.035 * K.c]; i ? G.lineTo(q[0], q[1]) : G.moveTo(q[0], q[1]); }); G.strokeStyle = 'rgba(255,240,200,0.7)'; G.lineWidth = 0.03; G.stroke();
    /* the rivet on the COM tab, and the moving contact riveted through the leaf's free end */
    fill(() => { const a = S(4.36, 4.55), b = S(4.96, 4.55), m = S(4.66, 4.66); G.beginPath(); G.moveTo(a[0], a[1]); G.quadraticCurveTo(2 * m[0] - (a[0] + b[0]) / 2, 2 * m[1] - (a[1] + b[1]) / 2, b[0], b[1]); G.closePath(); }, silver, eS, 0.7);
    const yc = leafY(K.zC);
    dome(K.zC, yc + 0.03, true, 0.12); dome(K.zC, yc - 0.03, false, 0.12);
    out.contact = SP(...S(K.zC, yc)); out.leaf = SP(...S(2.2, leafY(2.2))); out.com = SP(...S(5.08, 2.6)); out.fulcrum = SP(...S(4.1, 3.2));
  }
  /* the plunger: cap, captive flange, nose; it moves along the switch's axis */
  const pl = (z0, z1, y0, y1, r) => fill(() => path(boxS(z0, z1, y0 - d, y1 - d), r), TH ? '#45464C' : '#4A4B52', eB, 0.9);
  if (clear) { pl(2.85, 3.95, 4.56, 5.57, [0.18, 0.18, 0, 0]); pl(1.95, 4.85, 5.55, 5.99, 0.08); }
  /* the cover */
  const cov = boxS(-6.4, 6.4, 2.0, 6.52);
  if (clear) {
    fill(() => path(cov, [0, 0, 0.5, 0.5]), TH ? 'rgba(40,60,80,0.05)' : 'rgba(200,215,232,0.06)', null);
    path(boxS(-5.95, 5.95, 2.0, 6.07), [0, 0, 0.2, 0.2]); G.strokeStyle = inkA(0.2); G.lineWidth = lw(1); G.stroke();
    path(cov, [0, 0, 0.5, 0.5]); G.strokeStyle = inkA(0.62); G.lineWidth = lw(1.25); G.stroke();
    const sh = G.createLinearGradient(...S(-6.4, 6.5), ...S(0, 2)); sh.addColorStop(0, 'rgba(255,255,255,0.10)'); sh.addColorStop(0.4, 'rgba(255,255,255,0)'); path(cov, [0, 0, 0.5, 0.5]); G.fillStyle = sh; G.fill();
  } else {
    fill(() => path(cov, [0, 0, 0.5, 0.5]), blk, eB, 1.1);
    mmLine([S(-5.9, 6.44), S(5.9, 6.44)], 'rgba(255,255,255,0.14)', 1);
  }
  /* the cap, 0.45 mm proud of the cover's top, corners r 0.4 */
  pl(2.35, 4.45, 5.95, 6.97, [0, 0, 0.4, 0.4]);
  out.plunger = SP(...S(3.4, 6.97 - d)); out.body = SP(...S(0, 4)); out.top = SP(...S(0, 6.52)); out.left = SP(...S(6.4, 4)); out.right = SP(...S(-6.4, 4));
  out.hole = out.plunger; out.isNO = no; out.d = d;
  if (!clear) { out.nc = out.no = out.contact = out.leaf = out.com = out.tongue = out.body; }
  return out;
}
clk_S({
  id: 'clk_switch', ch: 'click', theme: 'paper', title: 'A mechanical switch: Gateron GT01', settle: 9, ideas: [78],
  src: ['clk_gt01', 'clk_d2fp', 'omronD2fp', 'paw3395'],
  sfxLoop: [{ t0: 2.0, per: 2.6, cues: [[0.03, 'click'], [0.12, 'release']] }],
  draw: t => {
    header(t, 'A mechanical switch: Gateron GT01');
    captions(t, [[0.6, 'Inside, the GT01 is a standard SPDT microswitch. Its bottom housing turns it 20° to meet the trigger\'s arc.'], [4.4, 'Mechanical, so it draws no current until it is pressed. An optical switch keeps pulsing an LED.']]);
    const [wx, ww] = CLK_G.a, wy = CLK_TOP, wh = CLK_BOT - wy;
    /* the switch, big, cover clear, pressing: the camera settles in slowly */
    clk_tile(t, 0.3, wx, wy, ww, wh, 'Gateron GT01, cover clear, side on', ['claim']);
    const c = cyc(t, 2.0, 2.6), sw = clk_swc(t, 2.0, 2.6), push = ep(t, 0.4, 6.0, E.cam), s = lerp(29, 31, push);
    const o = part(wx + 560, wy + 500 + lerp(10, 0, push), s, () => clk_gt01MM({ press: sw.pr, state: sw.state }), { alpha: ep(t, 0.6, 1.2) });
    if (o.contact && sw.c >= 0) { const ts = sw.c * 2.6, n = Math.floor((t - 2.0) / 2.6); clk_spark(o.contact, ts - CLK_SNAP.no * 2.6, C.hero, 0.9, 11 + n); clk_spark(o.contact, ts - CLK_SNAP.nc * 2.6, C.ink2, 0.6, 53 + n); }
    /* the parts, named on both sides, each side in the order its parts sit top to bottom: the plunger end on the left, one pole
       and its two throws on the right */
    if (o.plunger) {
      /* each label takes the room its lines need (h), and none goes lower than the board */
      const side = (lab, x, sd, t0) => { lab.sort((p, q) => p[1][1] - q[1][1]); let ly = wy + 150; const tail = i => lab.slice(i + 1).reduce((s0, e) => s0 + e[2], 0); lab.forEach(([l, p, h], i) => { ly = Math.max(ly, Math.min(p[1] - 24, wy + wh - 190 - tail(i))); callout(t, t0 + i * 0.18, p, l, { to: [x, ly], side: sd, color: C.ink2, tcolor: C.ink, maxW: 224, prose: true }); ly += h; }); };
      side([['Plunger', o.plunger, 60], ['Leaf spring', o.leaf, 60], ['Tongue: it snaps the leaf over', o.tongue, 92], ['COM: the leaf is riveted to it', o.com, 92]], wx + 262, 'l', 1.4);
      side([['NC: closed at rest', o.nc, 60], ['Pole: the moving contact', o.contact, 92], ['NO: closed when pressed', o.no, 92], ['Bottom housing, 20°', o.housing, 92]], wx + 788, 'r', 1.6);
    }
    clk_lamp(wx + 48, wy + 118, 'NC', sw.state === 'nc', C.ink, ep(t, 1.8, 2.2)); clk_lamp(wx + 168, wy + 118, 'NO', sw.state === 'no', C.hero, ep(t, 1.8, 2.2));
    text('Drawn from Gateron\'s images; Gateron has published no datasheet', wx + 32, wy + wh - 30, { role: 'small', size: 22, color: C.faint, alpha: ep(t, 1.6, 2.0) });
    /* right: idle current, the headline (lower is better); the word, the source */
    const [cx, cw] = CLK_G.b;
    clk_stack(wy, [
      y => {
        const h = 240, a = ep(t, 4.6, 5.1);
        clk_tile(t, 0.5, cx, y, cw, h, 'Idle current (lower is better)', ['derived']);
        clk_hl(t, 4.6, cx + 32, y + 178, '0', 'mA', { size: 120, count: false });
        text('GT01, mechanical, a switch', cx + 36, y + 214, { role: 'small', size: 22, weight: 600, color: C.heroText, alpha: a });
        clk_big(t, cx + cw - 32, y + 178, null, '0.15', 'mA', { size: 64, color: C.ink2, alpha: ep(t, 4.9, 5.4), align: 'right' });
        text('Optical, at Omron\'s pulse', cx + cw - 32, y + 214, { role: 'small', size: 22, color: C.mute, align: 'right', alpha: ep(t, 4.9, 5.4) });
        return { h };
      },
      y => clk_gloss(t, 5.2, cx, y, cw, 'Optical switch', 'An LED shines across a gap the plunger blocks. It needs current whenever the mouse is listening.'),
      y => clk_src(t, 5.8, cx, y, cw, 'Omron D2FP datasheet', 'The LED is tested at 5 mA in 30 µs pulses every 1 ms: 0.15 mA a switch, 18% of a PAW3395\'s 1.7 mA for two.')
    ]);
  }
});

/* ============================== 04. operating force and rated life ============================== */
/* At a glance (F14.10): the GT01's win here is its tolerance, ±5 gf against the D2FP datasheet's ±15.3 gf, so that leads, big, on
   the force chart. Rated life is every maker's own figure and the GT01 is not the highest rated, so it is a quiet tile with the
   whole range in words, not a ranking that could read as Theseus losing */
clk_S({
  id: 'clk_switch2', ch: 'click', theme: 'night', title: 'Operating force and rated life', settle: 9, ideas: [78],
  src: ['clk_gt01', 'omronD2f', 'clk_d2fp', 'clk_elo', 'clk_brock'],
  draw: t => {
    header(t, 'Operating force and rated life');
    captions(t, [[0.6, 'The GT01 holds its operating force to ±5 gf. Omron\'s D2FP datasheet allows ±15 gf.'], [3.6, 'It is lighter than both Omrons, and its maker rates it for 100 million clicks.']]);
    const [wx, ww] = CLK_G.a, wy = CLK_TOP, wh = CLK_BOT - wy;
    clk_tile(t, 0.3, wx, wy, ww, wh, 'Operating force, gf', ['claim', 'datasheet']);
    const gt = { lo: 50, hi: 60 }, om = { lo: 44.9, hi: 75.5 }, ratio = (om.hi - om.lo) / (gt.hi - gt.lo);
    clk_hl(t, 1.0, wx + 32, wy + 204, ratio.toFixed(0) + '×', 'tighter', { size: 136, sub: 'GT01: 55 ± 5 gf, a Gateron claim. Omron D2FP: 60.2 ± 15.3 gf, its datasheet.', maxW: ww - 64 });
    const F = [
      { name: 'Gateron GT01', qual: 'Theseus', lo: gt.lo, hi: gt.hi, mid: 55, txt: '55 ± 5', ev: 'claim', hero: true },
      { name: 'Omron D2FP, optical', qual: 'Sora V2', lo: om.lo, hi: om.hi, mid: 60.2, txt: '60.2 ± 15.3', ev: 'datasheet' },
      { name: 'Logitech GPX2', qual: 'my notes', mid: 70, txt: '≈ 70', ev: 'claim', ring: true },
      { name: 'Omron D2F-01F', qual: 'mechanical', hi: 75.5, txt: '75.5 max', ev: 'datasheet', max: true }
    ];
    const fx0 = wx + 380, fw = ww - 380 - 262, FX = v => fx0 + fw * v / 80, fy0 = wy + 384, rh = 64, a0 = ep(t, 0.8, 1.2);
    for (const v of [0, 20, 40, 60, 80]) { line(FX(v), fy0 - 34, FX(v), fy0 + 4 * rh - 36, { color: C.hair, w: 1.2, alpha: a0 }); text(String(v), FX(v), fy0 + 4 * rh - 4, { role: 'tick', color: C.mute, align: 'center', alpha: a0 }); }
    text('A narrower band is a tighter switch; further left, a lighter click', wx + 32, fy0 + 4 * rh + 38, { role: 'small', size: 23, weight: 600, color: C.mute, alpha: a0 });
    F.forEach((r, i) => {
      const yy = fy0 + i * rh, k = ep(t, 1.0 + i * 0.2, 1.7 + i * 0.2, E.snap), a = ep(t, 0.9 + i * 0.2, 1.2 + i * 0.2);
      evDot(wx + 34, yy - 8, r.ev, 6, a);
      text(r.name, wx + 52, yy, { role: 'small', size: 25, weight: r.hero ? 800 : 600, color: C.ink, alpha: a });
      text(r.qual, wx + 52, yy + 28, { role: 'label', size: 19, color: r.hero ? C.heroText : C.faint, alpha: a });
      const col = r.hero ? C.hero : C.comp;
      if (r.max) { G.save(); G.globalAlpha = a; G.setLineDash([6, 5]); G.strokeStyle = C.comp; G.lineWidth = 2; G.strokeRect(FX(0), yy - 16, (FX(r.hi) - FX(0)) * k, 16); G.restore(); line(FX(r.hi), yy - 22, FX(r.hi), yy + 6, { color: C.ink2, w: 2.5, alpha: a * k }); }
      else if (r.lo != null) { const xa = FX(lerp(r.mid, r.lo, k)), xb = FX(lerp(r.mid, r.hi, k)); rr(xa, yy - 17, Math.max(4, xb - xa), 18, 4, col, null, 1.5, a); line(FX(r.mid), yy - 24, FX(r.mid), yy + 7, { color: r.hero ? C.ink : C.ink2, w: 2.5, alpha: a }); }
      else { circle(FX(r.mid), yy - 8, 8 * k, { fill: C.panel, alpha: a }); circle(FX(r.mid), yy - 8, 8 * k, { color: C.comp, w: 3, alpha: a }); }
      rich([{ s: r.txt, role: 'num', size: 26, weight: r.hero ? 800 : 600, color: r.hero ? C.heroText : C.ink }, { s: 'gf', role: 'label', size: 19, color: C.mute, gap: 8 }], wx + ww - 32, yy, { align: 'right', alpha: a });
    });
    /* right: the tolerance in a reader's terms (the most two buttons can differ: each band's full width), rated life in words
       (the GT01 is not the highest rated, so it gets no big number: review item 23), and the step */
    const [cx, cw] = CLK_G.b, L = clk_life(), lo = L.reduce((m, r) => (!m || r.v < m.v ? r : m), null), hi = L.reduce((m, r) => (!m || r.v > m.v ? r : m), null);
    clk_stack(wy, [
      y => clk_gloss(t, 2.0, cx, y, cw, 'Operating force', `The force at which a switch clicks. At ±5 gf your two buttons differ by ${fmtN(gt.hi - gt.lo, 0)} gf at most; at the D2FP's ±15.3 gf, by ${fmtN(om.hi - om.lo, 1)} gf.`),
      y => clk_src(t, 4.4, cx, y, cw, 'Rated life, EloShapes', lo && hi ? `Each maker rates its own switch: the GT01 for 100 M clicks, the flagships' mains from ${lo.v} M (${lo.name}) to ${hi.v} M (${hi.name}).` : 'Each maker rates its own switch: the GT01 for 100 M clicks.'),
      y => clk_box(t, 5.2, cx, y, cw, { label: 'Theseus', value: 'Mechanical mains (#78)', head: 'A GT01 on its bottom housing', body: 'Mechanical for the power it saves, SPDT for the speed, pushed straight for the feel.' })
    ]);
  }
});

/* ============================== 05. straight rear cutouts (#17), tensioners centred on their switches (#18) ============================== */
clk_S({
  id: 'cutouts', ch: 'click', theme: 'paper', title: 'Straight rear cutouts', settle: 10, ideas: [17, 18],
  src: ['clk_brock'], three: ['shell-sora', 'shell'],
  draw: t => {
    header(t, 'Straight rear cutouts');
    captions(t, [[0.6, 'The tensioner bends along the rear cutout, so it takes the cutout\'s shape.'], [3.2, 'Curve the cutout into a smile and each arm bends on a diagonal: part of every press goes sideways.'], [6.2, 'Cut it straight and centre each tensioner on its switch: the bend sits square to the press. Razer did it for the V3 Pro.']]);
    const A = acc(), [wx, ww] = CLK_G.a, wy = CLK_TOP, wh = CLK_BOT - wy;
    clk_tile(t, 0.3, wx, wy, ww, wh, 'Two tensioners, from above', [{ ev: 'derived', text: 'Derived from a 4.6 mm smile across a 40 mm pair' }]);
    const sm = 1 - ep(t, 3.4, 5.0, E.io3), k18 = ep(t, 6.2, 7.4, E.io3), s = 16, cx = wx + ww / 2, cy = wy + 336;
    const o = part(cx, cy, s, () => tensionerPlanMM({ smile: sm, accent: A }), { alpha: ep(t, 0.4, 0.9) });
    /* each arm swings square to its bend line: on a curve that is a diagonal */
    const ka = ep(t, 1.6, 2.2), col = sm > 0.5 ? C.bad : C.hero;
    if (o.arms) for (const arm of o.arms) for (let i = 0; i < 4; i++) {
      const x = lerp(arm.xl + 3, arm.xr - 3, i / 3), slope = arm.slope(x), y = o.edgeY(x) - 1.6, nl = Math.hypot(slope, 1), nx = slope / nl, ny = -1 / nl;
      const p = o.P(x, y - 1.6), q = o.P(x + nx * 5.6, y - 1.6 + ny * 5.6);
      arrow(p[0], p[1], q[0], q[1], { color: col, w: 3, hs: 11, alpha: ka });
    }
    /* #18: the switch plunger ahead of each arm, slid onto the arm's centre line */
    if (o.P) {
      const k = ep(t, 5.4, 5.9);
      for (const sgn of [-1, 1]) {
        const hx = sgn * 10.7, ey = o.edgeY(hx), off = sgn * 5 * (1 - k18), st = o.P(hx, ey - 5.2), pl = o.P(hx + off, ey - 10.6), on = k18 > 0.95;
        line(st[0], st[1], pl[0], pl[1], { color: on ? C.hero : C.bad, w: 2, dash: [6, 5], alpha: k });
        rr(pl[0] - 16, pl[1] - 16, 32, 32, 6, C.panel, on ? C.hero : C.ink2, 2, k); circle(pl[0], pl[1], 5, { fill: on ? C.hero : C.ink2, alpha: k });
      }
      /* the leader rises from the plunger and turns left to the label's right end: it never crosses the word */
      const pp = o.P(-10.7 - 5 * (1 - k18), o.edgeY(-10.7) - 10.6 - 1.4);
      callout(t, 5.6, pp, 'Switch plunger', { to: [pp[0] - 36, wy + 118], side: 'l', elbow: pp[0], color: C.ink2, tcolor: C.ink2 });
    }
    /* the readout, under the plates: how far the bend line leans at the arm's outer end, what that sends sideways, and how far
       the plunger sits off the arm's centre, each beside the smile's figure (Brock, F16.1: before → after). Sideways leads */
    const ang = Math.atan(0.4554 * sm), a0 = Math.atan(0.4554), sd = Math.sin(ang) * 100, sd0 = Math.sin(a0) * 100, dg = ang * 180 / Math.PI, dg0 = a0 * 180 / Math.PI, off = 5 * (1 - k18);
    [[wx + 32, 'Sideways at the end (lower is better)', sd0.toFixed(1) + '%', sd.toFixed(1) + '%', '−' + (sd0 - sd).toFixed(1) + ' pts sideways', 84, 1 - sm, C.bad],
     [wx + 490, 'Bend lean, end', dg0.toFixed(1) + '°', dg.toFixed(1) + '°', '−' + (dg0 - dg).toFixed(1) + '° of lean', 42, 1 - sm, null],
     [wx + 712, 'Switch offset', '5.0 mm', off.toFixed(1) + ' mm', '−' + (5 - off).toFixed(1) + ' mm off centre', 42, k18, null]].forEach(([x, l, b, v, n, sz, k, bad], i) => {
      const kk = ep(t, 2.6 + i * 0.15, 3.1 + i * 0.15);
      G.save(); G.translate(0, (1 - E.out3(kk)) * 16); clk_ba(t, x, wy + wh - 70, { label: l, before: b, after: v, net: n, size: sz, k, a: kk, bad }); G.restore();
    });
    /* right: the two shells, what ships today, the word */
    const [bx0, bw] = CLK_G.b;
    clk_stack(wy, [
      y => {
        const h = 440, vw = (bw - 36) / 2, vh = h - 120, cam = { view: [0, 1, -0.3], zoom: 1.32, target: [0, 18, 24] };
        clk_tile(t, 0.5, bx0, y, bw, h, 'Sora V2 against Theseus', []);
        /* in 2D the triggers' outlines carry the point, so they are drawn in the colour of each label */
        clk_v3('shell-sora', t, bx0 + 12, y + 62, vw, vh, Object.assign({}, cam, { hi2d: { re: /^explode[LR]\/.*trigger[LR]$/, color: C.bad, w: 3 } }), { alpha: ep(t, 1.2, 1.8) });
        clk_v3('shell', t, bx0 + 24 + vw, y + 62, vw, vh, Object.assign({}, cam, { hi2d: { re: /^explode[LR]\/.*trigger[LR]$/, color: C.hero, w: 3 } }), { alpha: ep(t, 1.6, 2.2) });
        text('Sora V2: a smile', bx0 + 12 + vw / 2, y + h - 22, { role: 'label', size: 21, color: C.bad, align: 'center', alpha: ep(t, 2.2, 2.6) });
        text('Theseus: straight', bx0 + 24 + vw * 1.5, y + h - 22, { role: 'label', size: 21, color: C.heroText, align: 'center', alpha: ep(t, 2.4, 2.8) });
        return { h };
      },
      y => clk_gloss(t, 2.4, bx0, y, bw, 'Tensioner', 'The spring arm under each button: it sets how hard the button presses back, and where it bends. More on the next slide.')
    ]);
  }
});

/* ============================== 06. the bridge tensioner (#50): a frame model, the flat plane against the bridge ============================== */
/* The model (07-sim.js), in mm, N and MPa, y up. The screw clamps the plate at x ≤ 0 (one screw per tensioner, #49); the tensioner runs
   from 0 to S; the trigger, a stiff 2.4 mm beam, runs on to the fingertip at XP, the switch plunger under it at XS. Flat: 0.8 mm all
   along. Bridge (#50): an arch with a 1.6 mm rise, 0.8 mm at its feet thinning to 0.4 mm at its crown. The press is a point load at the
   fingertip; the click comes after 0.35 mm at the plunger (the GT01's pre-travel, a maker claim). The switch's own force comes on top.
   The model is linear, so one solve per case gives every load: the force to the click is pre / (plunger travel per newton). */
const CLK_TN = { S: 8, n: 32, h0: 0.8, hc: 0.4, rise: 1.6, b: 10, XP: 40, XS: 30, pre: 0.35, ht: 2.4, bt: 20 };
const CLK_GF = 1000 / 9.80665;
/** PP-C-20A's tensile breaking stress, MPa (Pyrofil datasheet, shlPyrofil; Brock, F12.12: the part counts as broken there) */
const CLK_BREAK = 120;
const clk_tenH = (kind, x, P) => kind === 'bridge' ? P.h0 - (P.h0 - P.hc) * Math.pow(Math.sin(Math.PI * clamp(x / P.S)), 2) : P.h0;
function clk_tenModel(kind, E0, o = {}) {
  const P = Object.assign({}, CLK_TN, o), br = kind === 'bridge', nodes = [], els = [], fix = { 0: 'xyr' };
  for (let i = 0; i <= P.n; i++) { const x = P.S * i / P.n; nodes.push([x, br ? P.rise * Math.sin(Math.PI * x / P.S) : 0]); if (o.clampTo && x <= o.clampTo + 1e-9) fix[i] = 'xyr'; }
  for (let i = 0; i < P.n; i++) els.push({ i, j: i + 1, w: P.b, h: clk_tenH(kind, P.S * (i + 0.5) / P.n, P), E: E0, rho: 1e-3 });
  let prev = P.n, iS = -1, iP = -1;
  for (let x = P.S + 2; x <= P.XP + 1e-9; x += 2) { nodes.push([x, 0]); const k = nodes.length - 1; els.push({ i: prev, j: k, w: P.bt, h: P.ht, E: E0, rho: 1e-3 }); prev = k; if (Math.abs(x - P.XS) < 1e-6) iS = k; if (Math.abs(x - P.XP) < 1e-6) iP = k; }
  return { nodes, els, fix, loads: { [iP]: [0, -1, 0] }, iS, iP, nStrip: P.n, P, kind };
}
/** solve a case once (simSolve caches it) and derive what the slides print: plunger travel per newton (cS), the force to the click
   (F, gf), the curvature along the tensioner per newton (kap), the shortest stretch that holds half its bend (half), and the peak
   stress at the click (sig, MPa, at x = at) */
function clk_ten(kind, mat, o = {}) {
  const r = simSolve(['clk_ten', kind, mat, o.clampTo || 0, o.S || CLK_TN.S, o.rise || CLK_TN.rise].join(':'), () => clk_tenModel(kind, SIM_MAT[mat].E, o));
  if (r.clk) return r;
  const m = r.model, n = m.nStrip, cS = -r.d[m.iS * 3 + 1], kap = [];
  for (let e = 0; e < n; e++) { const el = m.els[e]; kap.push(Math.abs(r.d[el.j * 3 + 2] - r.d[el.i * 3 + 2]) / r.L[e]); }
  const tot = kap.reduce((a, k, e) => a + k * r.L[e], 0);
  let half = { len: Infinity, a: 0, b: 0 };
  for (let a = 0; a < n; a++) { let s = 0; for (let b = a; b < n; b++) { s += kap[b] * r.L[b]; if (s >= 0.5 * tot - 1e-12) { const len = m.nodes[b + 1][0] - m.nodes[a][0]; if (len < half.len - 1e-9) half = { len, a: m.nodes[a][0], b: m.nodes[b + 1][0] }; break; } } }
  const F = m.P.pre / cS, sig = r.sig.slice(0, n), smax = Math.max(...sig);
  r.clk = { cS, F, gf: F * CLK_GF, kap, kmax: Math.max(...kap), half, sig: smax * F, at: (m.nodes[sig.indexOf(smax)][0] + m.nodes[sig.indexOf(smax) + 1][0]) / 2 };
  return r;
}
/** a point at (dx, dy) from node i, moved with it: its displacement and its turn, scaled by sc (small angles) */
function clk_at(r, i, sc, dx = 0, dy = 0) { const m = r.model, th = r.d[i * 3 + 2] * sc; return [m.nodes[i][0] + dx + r.d[i * 3] * sc - dy * th, m.nodes[i][1] + dy + r.d[i * 3 + 1] * sc + dx * th]; }
/** the tensioner as a ribbon of its true thickness, bent by the solved frame (feElPts) and coloured by stress (heatCol: red at
   the peak kh scales to). It is drawn as one part with the two it joins (Brock, F18.6: the bridge didn't "properly connect the 2
   pieces"): the band starts as the plate clamped under the screw (x from -7.5 to 0, fixed in the model, so it stays cool), turns
   into the tensioner with a mitred joint (the normals there bisect the turn, so the band keeps its thickness through it), and
   runs on along the trigger's axis, where it is cut off 2 px inside the trigger's face: no seam at the clamp, no wedge or gap at
   the trigger. clk_root then fillets the trigger's root into it. P maps model mm (y up) to stage px; sc scales the
   displacements; kh turns the element stress per newton into heat. Returns the edges and the trigger's face, in stage px */
function clk_ribbon(r, P, sc, kh, o = {}) {
  const m = r.model, n = m.nStrip, hT = m.P.ht / 2, pts = [{ p: [-7.5, 0], e: -1, x: 0 }, { p: [-0.25, 0], e: -1, x: 0 }];
  for (let e = 0; e < n; e++) { const q = feElPts(r, e, sc, 3), x0 = m.nodes[m.els[e].i][0], x1 = m.nodes[m.els[e].j][0]; q.forEach((p, j) => { if (e && !j) return; pts.push({ p, e, x: lerp(x0, x1, j / 3) }); }); }
  const iN = pts.length - 1;
  for (const dx of [0.3, 0.8]) pts.push({ p: clk_at(r, n, sc, dx, 0), e: n - 1, x: m.P.S });
  /* each point's normal bisects the two segments beside it; at a turn the offset grows by 1 / cos(half the turn) (a mitre) */
  const top = [], bot = [], u = (a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; };
  pts.forEach((q, i) => {
    const t0 = i ? u(pts[i - 1].p, q.p) : null, t1 = i < pts.length - 1 ? u(q.p, pts[i + 1].p) : null;
    let tx = (t0 ? t0[0] : 0) + (t1 ? t1[0] : 0), ty = (t0 ? t0[1] : 0) + (t1 ? t1[1] : 0); const l = Math.hypot(tx, ty) || 1; tx /= l; ty /= l;
    const mi = t0 && t1 ? 1 / Math.max(0.7, tx * t1[0] + ty * t1[1]) : 1, h = clk_tenH(m.kind, q.x, m.P) / 2 * mi;
    top.push(P([q.p[0] - ty * h, q.p[1] + tx * h])); bot.push(P([q.p[0] + ty * h, q.p[1] - tx * h]));
  });
  /* the trigger's face (stage px), its direction up the face, and the way into the trigger */
  const ft = P(clk_at(r, n, sc, 0, hT)), fb = P(clk_at(r, n, sc, 0, -hT)), fu = u(fb, ft), ins = P(clk_at(r, n, sc, 2, 0));
  let fv = [-fu[1], fu[0]]; if ((ins[0] - fb[0]) * fv[0] + (ins[1] - fb[1]) * fv[1] < 0) fv = [-fv[0], -fv[1]];
  G.save(); G.globalAlpha = o.alpha == null ? 1 : o.alpha;
  { const off = 2, A = [ft[0] + fu[0] * 3000 + fv[0] * off, ft[1] + fu[1] * 3000 + fv[1] * off], B = [fb[0] - fu[0] * 3000 + fv[0] * off, fb[1] - fu[1] * 3000 + fv[1] * off];
    G.beginPath(); G.moveTo(A[0], A[1]); G.lineTo(B[0], B[1]); G.lineTo(B[0] - fv[0] * 6000, B[1] - fv[1] * 6000); G.lineTo(A[0] - fv[0] * 6000, A[1] - fv[1] * 6000); G.closePath(); G.clip(); }
  for (let i = 0; i < pts.length - 1; i++) {
    const col = pts[i].e < 0 ? heatCol(0) : heatCol(r.sig[pts[i].e] * kh);
    G.beginPath(); G.moveTo(top[i][0], top[i][1]); G.lineTo(top[i + 1][0], top[i + 1][1]); G.lineTo(bot[i + 1][0], bot[i + 1][1]); G.lineTo(bot[i][0], bot[i][1]); G.closePath();
    G.fillStyle = col; G.fill(); G.strokeStyle = col; G.lineWidth = 1; G.stroke();
  }
  G.beginPath(); top.forEach((p, i) => i ? G.lineTo(p[0], p[1]) : G.moveTo(p[0], p[1])); for (let i = bot.length - 1; i >= 0; i--) G.lineTo(bot[i][0], bot[i][1]); G.closePath();
  G.strokeStyle = o.edge || inkA(0.55); G.lineWidth = 1.5; G.lineJoin = 'round'; G.stroke();
  G.restore();
  return { top, bot, iN, face: { ft, fb, fu, fv } };
}
/** the trigger's root, filleted into the tensioner where it meets the trigger's face: in each corner between the face and
   the band's edge, a curve d mm along each, filled in the trigger's colour, so the two read as one moulded part.
   R = clk_ribbon's result; s = px per mm */
function clk_root(R, s, o = {}) {
  const { ft, fb, fu, fv } = R.face, a = o.alpha == null ? 1 : o.alpha; if (a <= 0.003) return;
  const sd = p => (p[0] - fb[0]) * fv[0] + (p[1] - fb[1]) * fv[1];          /* signed distance from the face, + into the trigger */
  G.save(); G.globalAlpha = a; G.lineJoin = 'round';
  for (const [edge, up, dmm] of [[R.top, 1, 0.7], [R.bot, -1, 0.55]]) {
    let i = edge.findIndex((p, j) => j < edge.length - 1 && sd(p) <= 0 && sd(edge[j + 1]) > 0); if (i < 0) continue;
    const p0 = edge[i], p1 = edge[i + 1], f = sd(p0) / (sd(p0) - sd(p1)), I = [lerp(p0[0], p1[0], f), lerp(p0[1], p1[1], f)], d = dmm * s;
    const F = [I[0] + fu[0] * up * d, I[1] + fu[1] * up * d];
    /* back along the band's edge by d, keeping the points passed so the fill closes along the edge itself */
    let left = d, Q = I, k = i, last = I; const run = [];
    while (k >= 0 && left > 0) { const q = edge[k], l = Math.hypot(last[0] - q[0], last[1] - q[1]); if (l >= left) { Q = [lerp(last[0], q[0], left / l), lerp(last[1], q[1], left / l)]; left = 0; break; } left -= l; last = q; Q = q; run.push(q); k--; }
    /* the fill reaches 2 px into the trigger, over the face's own hairline, so the outline runs face → fillet → band */
    G.beginPath(); G.moveTo(I[0] + fv[0] * 2, I[1] + fv[1] * 2); G.lineTo(F[0] + fv[0] * 2, F[1] + fv[1] * 2); G.lineTo(F[0], F[1]); G.quadraticCurveTo(I[0], I[1], Q[0], Q[1]); for (let j = run.length - 1; j >= 0; j--) G.lineTo(run[j][0], run[j][1]); G.lineTo(I[0], I[1]); G.closePath();
    G.fillStyle = o.fill || CLK_PC.graph(); G.fill();
    G.beginPath(); G.moveTo(F[0], F[1]); G.quadraticCurveTo(I[0], I[1], Q[0], Q[1]); G.strokeStyle = o.edge || inkA(0.45); G.lineWidth = 1.4; G.stroke();
  }
  G.restore();
}
/** a rounded box from model corners (x0, y0) to (x1, y1), y up, in one flat colour with a hairline edge */
function clk_mbox(P, x0, y0, x1, y1, r, fill, o = {}) {
  const a = P([x0, Math.max(y0, y1)]), b = P([x1, Math.min(y0, y1)]), w = b[0] - a[0], h = b[1] - a[1]; if (w <= 0 || h <= 0) return;
  rrPath(a[0], a[1], w, h, Math.min(r * P.s, w / 2, h / 2)); G.fillStyle = fill; G.fill();
  if (o.edge !== false) { G.strokeStyle = o.edge || inkA(0.4); G.lineWidth = 1.2; G.stroke(); }
}
/* flat part colours for the drawings here: graphite for the trigger and the shell, steel, POM, the switch body */
const CLK_PC = { graph: () => TH ? '#4B4C53' : '#3A3B42', light: () => TH ? '#C9C8C2' : '#55554F', steel: () => TH ? '#B8BEC6' : '#8E959E', pom: () => TH ? '#FBFAF6' : '#E9E7E1', body: () => TH ? '#2C2D32' : '#2E2F35' };
/** the clamp (the boss above, the one screw's head below, #49), the trigger beyond the tensioner with its post, and the switch, fixed */
function clk_lever(r, P, sc, o = {}) {
  const m = r.model, n = m.nStrip, P0 = m.P, hT = P0.ht / 2, a = o.alpha == null ? 1 : o.alpha; if (a <= 0.003) return {};
  G.save(); G.globalAlpha = a;
  /* the switch, fixed: a body fading out below, and its plunger, pushed down by the post */
  const vS = r.d[m.iS * 3 + 1] * sc;
  clk_mbox(P, P0.XS - 3.6, -3.7, P0.XS + 3.6, -5.6, 0.4, CLK_PC.body(), { edge: inkA(0.3) });
  clk_mbox(P, P0.XS - 0.75, -3.7, P0.XS + 0.75, -3.0 + vS, 0.25, CLK_PC.pom(), { edge: inkA(0.35) });
  /* the clamp: the boss, its face flat on the plate (the plate itself is the start of clk_ribbon's band), the screw head under it */
  { const b0 = P([-7.5, 2.6]), b1 = P([0, 0.4]), rb = Math.min(0.35 * P.s, (b1[0] - b0[0]) / 2, (b1[1] - b0[1]) / 2);
    G.beginPath(); G.moveTo(b0[0], b1[1]); G.lineTo(b0[0], b0[1] + rb); G.quadraticCurveTo(b0[0], b0[1], b0[0] + rb, b0[1]); G.lineTo(b1[0] - rb, b0[1]); G.quadraticCurveTo(b1[0], b0[1], b1[0], b0[1] + rb); G.lineTo(b1[0], b1[1]); G.closePath();
    G.fillStyle = CLK_PC.graph(); G.fill(); G.strokeStyle = inkA(0.4); G.lineWidth = 1.2; G.stroke(); }
  clk_mbox(P, -5.0, -0.4, -1.4, -1.5, 0.3, CLK_PC.steel(), { edge: inkA(0.4) });
  /* the trigger: a dark lever from the tensioner's end to its nose, and its post on the plunger */
  const ids = []; for (let i = n; i < m.nodes.length; i++) ids.push(i);
  const last = ids[ids.length - 1], top = ids.map(i => P(clk_at(r, i, sc, 0, hT))), bot = ids.map(i => P(clk_at(r, i, sc, 0, -hT)));
  const nt = P(clk_at(r, last, sc, 1.0, hT)), nn = P(clk_at(r, last, sc, 1.6, 0)), nb = P(clk_at(r, last, sc, 1.0, -hT));
  const pc = [[-0.9, -hT + 0.1], [0.9, -hT + 0.1], [0.9, -3.0], [-0.9, -3.0]].map(([dx, dy]) => P(clk_at(r, m.iS, sc, dx, dy)));
  const g = CLK_PC.graph();
  G.beginPath(); G.moveTo(pc[0][0], pc[0][1]); pc.forEach(p => G.lineTo(p[0], p[1])); G.closePath(); G.fillStyle = g; G.fill(); G.strokeStyle = inkA(0.4); G.lineWidth = 1.2; G.stroke();
  G.beginPath(); top.forEach((p, i) => i ? G.lineTo(p[0], p[1]) : G.moveTo(p[0], p[1])); G.lineTo(nt[0], nt[1]); G.quadraticCurveTo(nn[0] + (nn[0] - nt[0]) * 0.2, nn[1], nb[0], nb[1]); for (let i = bot.length - 1; i >= 0; i--) G.lineTo(bot[i][0], bot[i][1]); G.closePath();
  G.fillStyle = g; G.fill(); G.strokeStyle = inkA(0.45); G.lineWidth = 1.4; G.stroke();
  /* a thin line of light along the lever's top edge (line work, not a gradient) */
  G.beginPath(); top.forEach((p, i) => i ? G.lineTo(p[0], p[1] + 2) : G.moveTo(p[0], p[1] + 2)); G.strokeStyle = 'rgba(255,255,255,0.16)'; G.lineWidth = 1.5; G.stroke();
  G.restore();
  return { tip: P(clk_at(r, m.iP, sc, 0, hT)), sw: P([P0.XS + 3.6, -4.4]), screw: P([-3.2, -1.5]), plunger: P([P0.XS, -3.0 + vS]) };
}
/* the press, in time: the same press on both (to the bridge's click), then more on the flat plane until it clicks too; then the camera
   pushes in on the two tensioners */
const CLK_TT = { p0: 2.3, p1: 3.6, f0: 4.4, f1: 5.8, c0: 6.2, c1: 7.9, kap: 7.7, ex: 6 };
clk_S({
  id: 'tensioner', ch: 'click', theme: 'night', title: 'Bridge tensioner: where it bends, how easily', settle: 10, ideas: [50, 4],
  src: [SIM_MAT.ppcf.src, 'clk_gt01', 'clk_brock'],
  sfx: [[CLK_TT.p1, 'click'], [CLK_TT.f1, 'click']],
  draw: t => {
    const rF = clk_ten('flat', 'ppcf'), rB = clk_ten('bridge', 'ppcf'), cF = rF.clk, cB = rB.clk, TT = CLK_TT;
    const sameF = cF.cS * cB.F, ratio = cF.F / cB.F;
    header(t, 'Bridge tensioner: where it bends, how easily');
    captions(t, [[0.6, 'A flat tensioner is a plane: it bends all along. The bridge is an arch that thins toward its crown.'],
      [3.0, `The same ${cB.gf.toFixed(1)} gf on both: the bridge reaches the click. The flat plane has moved ${sameF.toFixed(2)} of 0.35 mm.`],
      [5.0, `To reach the click the flat plane needs ${cF.gf.toFixed(1)} gf, ${ratio.toFixed(1)} times as much, and it bends hardest at its screw.`],
      [8.0, 'Up close: the same bend in a different place. The bridge bends at its crown, where I put it.']]);
    const wy = CLK_TOP, wh = CLK_BOT - wy, rowH = wh / 2, X0 = LM, XW = 1360, xr = 1480, kc = ep(t, TT.c0, TT.c1, E.cam);
    demoWindow(LM, wy, RM - LM, wh, ep(t, 0.2, 0.7), {});
    line(LM + 24, wy + rowH, RM - 24, wy + rowH, { color: C.hair, w: 1.2, alpha: ep(t, 0.6, 1.0) });
    /* the camera: the crown (x = 4 mm) slides from 380 to 720 px while the scale grows from 25 to 62 px per mm */
    const s = 25 * Math.pow(62 / 25, kc), X4 = lerp(X0 + 300, X0 + 640, kc);
    /* stress is coloured against the hotter of the two peaks, each at its own click (Brock, F18.6: "scale to peak"), so the
       peak reads red; the scale says where PP-C-20A breaks (120 MPa, F12.12), more than ten times higher (F9.23) */
    const sref = Math.max(cF.sig, cB.sig), kref = cB.kmax * cB.F;
    const rows = [
      { r: rF, c: cF, name: 'Flat plane', spec: '0.8 mm all along', F: cB.F * ep(t, TT.p0, TT.p1) + (cF.F - cB.F) * ep(t, TT.f0, TT.f1), hero: false, t0: 0.5 },
      { r: rB, c: cB, name: 'Bridge', spec: '0.8 to 0.4 mm, a 1.6 mm arch', F: cB.F * ep(t, TT.p0, TT.p1), hero: true, t0: 0.8 }
    ];
    rows.forEach((R, i) => {
      const top = wy + i * rowH, cy = top + 200, P = p => [X4 + (p[0] - 4) * s, cy - p[1] * s], ka = ep(t, R.t0, R.t0 + 0.7); P.s = s;
      const sc = R.F * TT.ex, tr = R.c.cS * R.F, clicked = tr >= CLK_TN.pre - 1e-6;
      clipped(X0 + 2, top + 2, XW, rowH - 4, () => {
        G.save(); G.translate((1 - E.out3(ka)) * -30, 0);
        const L = clk_lever(R.r, P, sc, { alpha: ka });
        clk_root(clk_ribbon(R.r, P, sc, R.F / sref, { alpha: ka }), s, { alpha: ka });
        /* the screw's shank through the boss and the plate, hidden: dashed, over both */
        { const s1 = P([-4.0, -0.4]), s2 = P([-2.4, 2.0]); G.save(); G.globalAlpha = ka; G.setLineDash([5, 4]); G.strokeStyle = inkA(0.35); G.lineWidth = 1.2; G.strokeRect(s1[0], s2[1], s2[0] - s1[0], s1[1] - s2[1]); G.restore(); }
        /* wide-shot labels, the click lamp, the pointer on the fingertip */
        const kw = ka * (1 - ep(t, TT.c0, TT.c0 + 0.5));
        if (kw > 0.01 && L.sw) {
          text('Screw', L.screw[0], L.screw[1] + 34, { role: 'label', size: 19, color: C.faint, align: 'center', alpha: kw });
          clk_lamp(L.sw[0] + 26, L.sw[1] - 4, 'Click', clicked, R.hero ? C.hero : C.ink, kw);
        }
        if (L.tip) {
          const kp = ep(t, 1.5, 2.2, E.cam), st = [L.tip[0] + 150, L.tip[1] - 130];
          cursorPtr(lerp(st[0], L.tip[0], kp), lerp(st[1], L.tip[1], kp), { a: ep(t, 1.3, 1.7), s: 1.1, press: prog(t, 2.25, 2.75) > 0 && prog(t, 2.25, 2.75) < 1 ? prog(t, 2.25, 2.75) : 0 });
        }
        /* up close: where it bends. Curvature along the tensioner, both rows on one scale, so equal areas mean an equal bend */
        const kk = ep(t, TT.kap, TT.kap + 0.8);
        if (kk > 0) {
          const base = cy + 116, H = 60, n = R.r.model.nStrip, pts = [];
          for (let e = 0; e < n; e++) { const xm = CLK_TN.S * (e + 0.5) / n; pts.push([P([xm, 0])[0], base - H * R.c.kap[e] * R.F / kref * kk]); }
          const x0 = P([0, 0])[0], x1 = P([CLK_TN.S, 0])[0], col = R.hero ? C.hero : C.ink2;
          G.save(); G.beginPath(); G.moveTo(x0, base); pts.forEach(p => G.lineTo(p[0], p[1])); G.lineTo(x1, base); G.closePath(); G.fillStyle = rgba(R.hero ? C.hero : '#9a9993', R.hero ? 0.28 : 0.22); G.fill(); G.restore();
          poly([[x0, base]].concat(pts, [[x1, base]]), { color: col, w: 2.5, alpha: kk });
          line(x0, base, x1, base, { color: C.faint, w: 1.2, alpha: kk });
          const ha = P([R.c.half.a, 0])[0], hb = P([R.c.half.b, 0])[0];
          line(ha, base + 12, hb, base + 12, { color: col, w: 3, alpha: kk }); line(ha, base + 6, ha, base + 18, { color: col, w: 2, alpha: kk }); line(hb, base + 6, hb, base + 18, { color: col, w: 2, alpha: kk });
          text('Bend along the tensioner', x0 - 18, base + 6, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: kk });
          const hot = R.hero ? P([R.c.at, CLK_TN.rise + 0.2]) : P([0.25, 0.4]);
          callout(t, TT.kap + 0.3, hot, R.hero ? 'Bends at the crown' : 'Hardest at the screw', { to: [R.hero ? P([CLK_TN.S, 0])[0] + 70 : hot[0] + 110, cy - 96], side: 'r', color: col, tcolor: R.hero ? C.heroText : C.ink });
        }
        G.restore();
      });
      /* the readout: force at the fingertip, live, and the travel to the click */
      const kr = ep(t, R.t0 + 0.4, R.t0 + 0.9);
      G.save(); G.translate(0, (1 - E.out3(kr)) * 14);
      text(R.name, xr, cy - 118, { role: 'label', size: 22, color: R.hero ? C.heroText : C.ink, alpha: kr });
      text(R.spec, xr, cy - 84, { role: 'small', size: 25, color: C.mute, alpha: kr });
      /* the bridge keeps the flat plane's force beside its own once both have clicked (F16.1: before → after) */
      if (R.hero) clk_ba(t, xr, cy - 10, { before: (cF.F * CLK_GF).toFixed(1), after: (R.F * CLK_GF).toFixed(1), unit: 'gf', net: ratio.toFixed(1) + '× lighter to the click', netSize: 27, size: 84, k: ep(t, TT.f1, TT.f1 + 0.5), a: kr, hero: true });
      else clk_big(t, xr, cy + 4, null, (R.F * CLK_GF).toFixed(1), 'gf', { size: 56, color: C.ink2, alpha: kr });
      if (!R.hero || t < TT.f1) text('Fingertip force: lower is lighter', xr, cy + 40, { role: 'small', size: 21, weight: 600, color: C.faint, alpha: kr * (R.hero ? 1 - ep(t, TT.f1, TT.f1 + 0.3) : 1) });
      const by = cy + 70, bw = 330, kh = ep(t, TT.kap, TT.kap + 0.6);
      rr(xr, by, bw, 10, 5, C.track, null, 0, kr * (1 - kh)); rr(xr, by, Math.max(10, bw * clamp(tr / CLK_TN.pre)), 10, 5, clicked ? (R.hero ? C.hero : C.ink) : C.comp, null, 0, kr * (1 - kh));
      text(tr.toFixed(2) + ' of 0.35 mm to the click', xr, by + 40, { role: 'small', size: 25, color: C.mute, alpha: kr * (1 - kh) });
      /* up close, what the bridge wins: where it bends, and its margin to the break. Each tensioner's peak is taken at its own
         click, and the bridge's (it does all its bending in its thin crown) sits a little above the flat plane's, so no
         stress line is set side by side (review item 2): the bridge states its margin, the peak against PP-C-20A's 120 MPa
         (F12.12), rounded down */
      const uy = R.hero ? by - 12 : by + 10;
      text('Half the bend in ' + R.c.half.len.toFixed(1) + ' mm', xr, uy, { role: 'small', size: 25, weight: 700, color: R.hero ? C.heroText : C.ink, alpha: kh, maxW: RM - xr });
      if (R.hero) {
        const mg = Math.floor(CLK_BREAK / R.c.sig * 10) / 10;
        text(`Peak: ${mg.toFixed(1)}× under the break`, xr, uy + 34, { role: 'small', size: 23, weight: 600, color: C.mute, alpha: kh, maxW: RM - xr });
      }
      G.restore();
    });
    /* the heat scale, and the model in one line */
    const lx = X0 + XW - 430, ly = wy + 40, kl = ep(t, 1.2, 1.6);
    text('Stress', lx - 40, ly + 6, { role: 'label', size: 19, color: C.faint, alpha: kl });
    for (let i = 0; i < 40; i++) rect(lx + 50 + i * 4, ly - 6, 4.5, 12, { fill: heatCol(i / 39), alpha: kl });
    text('0', lx + 50, ly + 32, { role: 'label', size: 19, color: C.faint, alpha: kl }); text(sref.toFixed(1) + ' MPa', lx + 210, ly + 32, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: kl });
    text('Red: the peak', lx + 226, ly + 6, { role: 'label', size: 19, color: C.faint, alpha: kl }); text('Breaks at ' + CLK_BREAK + ' MPa', lx + 226, ly + 32, { role: 'label', size: 19, color: C.faint, alpha: kl });
    pill(RM - 24 - pillW('derived'), ly + 6, 'derived', kl);
    text(`2D frame model, ${SIM_MAT.ppcf.name} at ${(SIM_MAT.ppcf.E / 1000).toFixed(1)} GPa: tensioner 10 mm wide over an 8 mm span, pressed 40 mm out, plunger at 30 mm. Motion drawn ${CLK_TT.ex}×.`, LM, 994, { role: 'foot', color: C.faint, alpha: ep(t, 1.0, 1.6) });
  }
});

/* ============================== 07. why the bridge matters on a stiff trigger: PP-C-20A against ABS ============================== */
clk_S({
  id: 'clk_tenmat', ch: 'click', theme: 'paper', title: 'A stiff trigger with a light click', settle: 9, ideas: [50, 49],
  src: [SIM_MAT.ppcf.src, SIM_MAT.abs.src, 'clk_gt01', 'clk_brock'],
  draw: t => {
    const cA = clk_ten('flat', 'abs').clk, cP = clk_ten('flat', 'ppcf').clk, cB = clk_ten('bridge', 'ppcf').clk, ratio = SIM_MAT.ppcf.E / SIM_MAT.abs.E;
    header(t, 'A stiff trigger with a light click');
    captions(t, [[0.6, 'I want a stiff trigger: it has to be strong on its own, or it flexes into post-travel.'], [2.8, `But ${SIM_MAT.ppcf.name} is ${ratio.toFixed(1)} times as stiff as ABS, so the same flat plane clicks ${ratio.toFixed(1)} times as hard.`], [5.4, `The bridge brings it back: a stiff trigger, and a click ${(cB.gf - cA.gf).toFixed(1)} gf from an ABS one.`]]);
    /* rethought (F15.1; review item 3): the old force-against-travel lines put ABS's 5.1 gf under the bridge's, so the next best
       won the chart. Here both axes are on: trigger stiffness (the same shape, so it goes with the flexural modulus) against the
       click force at the GT01's 0.35 mm pre-travel. ABS is light but flexy, a flat PP-C-20A plane stiff but heavy, and only
       the bridge reaches the corner that is better on both. The pointer flips the material, then the tensioner, and the live
       point moves with it; the states it leaves stay as ghosts with their values */
    const [wx, ww] = CLK_G.a, wy = CLK_TOP, wh = CLK_BOT - wy;
    clk_tile(t, 0.3, wx, wy, ww, wh, 'Trigger stiffness against click force', ['derived']);
    /* the two switches the pointer flips: material, then tensioner */
    const t1 = 2.9, t2 = 5.3, mat = t < t1 ? 'ABS' : SIM_MAT.ppcf.name, ten = t < t2 ? 'Flat plane' : 'Bridge', ty = wy + 104, ka = ep(t, 0.8, 1.2);
    const w1 = ltagW('Material', mat, { size: 20 }), w1max = ltagW('Material', SIM_MAT.ppcf.name, { size: 20 });
    ltag(wx + 26, ty, 'Material', mat, { a: ka, size: 20, solid: t < t1 ? C.second : C.ink2, on: C.bg, color: C.mute });
    ltag(wx + 26 + w1max + 24, ty, 'Tensioner', ten, { a: ka, size: 20, solid: t < t2 ? C.ink2 : C.heroChip, on: t < t2 ? C.bg : C.onHero, color: C.mute });
    const p1 = [wx + 26 + w1 * 0.75, ty - 4], p2 = [wx + 26 + w1max + 24 + ltagW('Tensioner', ten, { size: 20 }) * 0.8, ty - 4];
    /* the pointer flips both, then leaves, so it never rests on a label */
    cursorAt(t, [[1.8, [p1[0] + 140, p1[1] + 120]], [2.6, p1], [4.6, p1], [5.1, p2], [5.9, p2], [6.9, [p2[0] + 260, p2[1] + 150]]], [t1, t2], { a: ep(t, 1.6, 2.0) * (1 - ep(t, 6.3, 6.9)) });
    /* the frame, and the corner that is better on both axes: a soft field toward it, as on the deck's other sweet spots */
    const fx = wx + 130, fy = wy + 196, fw = ww - 200, fh = 310, ks = ep(t, 1.0, 2.2);
    if (ks > 0) {
      G.save(); G.beginPath(); G.rect(fx, fy, fw, fh); G.clip();
      const g = G.createRadialGradient(fx + fw, fy + fh, 0, fx + fw, fy + fh, fw * 0.62 * ks);
      g.addColorStop(0, rgba(C.hero, TH ? 0.30 : 0.24)); g.addColorStop(0.5, rgba(C.hero, TH ? 0.10 : 0.08)); g.addColorStop(1, rgba(C.hero, 0));
      G.fillStyle = g; G.fillRect(fx, fy, fw, fh); G.restore();
      text('Better on both', fx + fw - 18, fy + fh - 20, { role: 'label', size: 19, color: C.heroText, align: 'right', alpha: ks });
    }
    const m = axes(t, { x: fx, y: fy, w: fw, h: fh, xr: [0, 6], yr: [0, 30], xticks: [0, 1, 2, 3, 4, 5, 6], yticks: [0, 10, 20, 30], xfmt: v => v ? v + '×' : '0', yfmt: v => v + ' gf', xlabel: 'Trigger stiffness, × ABS (higher is stiffer)', ylabel: 'Click force at the plunger (lower is lighter)', t0: 0.6 });
    /* the three states and the live point */
    const SA = [1, cA.gf], SP2 = [ratio, cP.gf], SB = [ratio, cB.gf], k1 = ep(t, t1 + 0.1, t1 + 0.8, E.snap), k2 = ep(t, t2 + 0.1, t2 + 0.8, E.snap);
    const PX = p => [m.X(p[0]), m.Y(p[1])], [ax, ay] = PX(SA), [px, py] = PX(SP2), [bx, by] = PX(SB);
    /* a state's name, value and verdict, two lines beside its point (right: x is the right edge) */
    const tag2 = (x, y, name, val, say, col, a, right) => { if (a <= 0.003) return; const al = right ? 'right' : 'left';
      rich([{ s: name, role: 'label', size: 19, color: col }, { s: val, role: 'num', size: 24, weight: 800, color: col, gap: 12 }], x, y, { align: al, alpha: a });
      text(say, x, y + 30, { role: 'small', size: 23, weight: 600, color: C.mute, align: al, alpha: a }); };
    if (t > t1 + 0.1) circle(ax, ay, 8, { fill: C.second, alpha: ep(t, t1 + 0.1, t1 + 0.4) });
    if (t > t2 + 0.1) circle(px, py, 8, { fill: C.bad, alpha: ep(t, t2 + 0.1, t2 + 0.4) });
    /* the bridge's drop at the same stiffness, before → after, on the chart */
    if (k2 > 0) { const xa = px - 34; arrow(xa, py + 14, xa, lerp(py + 14, by - 16, k2), { color: C.heroText, w: 3, hs: 12 });
      text('−' + ((1 - cB.gf / cP.gf) * 100).toFixed(0) + '%', xa - 14, (py + by) / 2 + 9, { role: 'num', size: 28, weight: 800, color: C.heroText, align: 'right', alpha: ep(t, t2 + 0.6, t2 + 1.0) }); }
    const live = t < t2 ? [lerp(ax, px, k1), lerp(ay, py, k1)] : [lerp(px, bx, k2), lerp(py, by, k2)], la = ep(t, 0.9, 1.4);
    if (t > t2 + 0.6) heroMark(live[0], live[1], 14, la); else circle(live[0], live[1], 10, { fill: t < t1 + 0.4 ? C.second : C.bad, alpha: la });
    tag2(ax + 20, ay - 50, 'ABS, flat plane', cA.gf.toFixed(1) + ' gf', 'Light, but the trigger flexes', C.secondText, ep(t, 1.4, 1.8));
    tag2(px - 60, py - 4, SIM_MAT.ppcf.name + ', flat plane', cP.gf.toFixed(1) + ' gf', 'Stiff, but a heavy click', C.bad, ep(t, t1 + 0.8, t1 + 1.2), true);
    tag2(bx - 60, by - 42, SIM_MAT.ppcf.name + ', bridge', cB.gf.toFixed(1) + ' gf', 'Stiff and light', C.heroText, ep(t, t2 + 0.9, t2 + 1.3), true);
    text(`Each at the GT01's 0.35 mm pre-travel. The same trigger shape, so its stiffness goes with the flexural modulus: ${SIM_MAT.ppcf.name} ${(SIM_MAT.ppcf.E / 1000).toFixed(1)} GPa, ABS ${(SIM_MAT.abs.E / 1000).toFixed(2)} GPa.`, wx + 32, wy + wh - 56, { role: 'small', size: 22, weight: 600, color: C.faint, maxW: ww - 64, lh: 1.3, alpha: ep(t, 2.4, 2.8) });
    /* right: at a glance (F14.10), the stiffness the trigger gains and the click force the bridge wins back, the flat plane's
       figure kept beside it (F16.1: before → after); under it, what the screw does (#49). The tile fills the column down to
       the box, so both columns end on the same line */
    const fl5 = clk_ten('flat', 'ppcf', { clampTo: 0.5 }).clk, br5 = clk_ten('bridge', 'ppcf', { clampTo: 0.5 }).clk;
    const pc = (a, b) => '+' + ((b.F / a.F - 1) * 100).toFixed(1) + '%', [cx, cw] = CLK_G.b;
    const scr = { value: 'One screw (#49)', body: `Clamp 0.5 mm more of the plate under the screw: the flat plane clicks ${pc(cP, fl5)} harder, the bridge only ${pc(cB, br5)}. The crown sets the bend, not the screw.`, src: true, label: null, kind: 'derived' };
    const hS = clk_snap(noteBox(t, 1e9, cx, 0, cw, scr).h), gh = CLK_BOT - hS - 40 - wy;
    { const a = ep(t, 1.4, 1.95, E.snap); demoWindow(cx, wy, cw, gh, a);
      text('Trigger stiffness against ABS (higher is better)', cx + 32, wy + 50, { role: 'label', size: 19, color: C.mute, alpha: a, maxW: cw - 64 });
      clk_hl(t, 1.6, cx + 32, wy + 190, ratio.toFixed(1) + '×', 'stiffer', { size: 140, count: false });
      const a2 = ep(t, t2 + 0.4, t2 + 0.95, E.snap);
      text('Click force (lower is lighter)', cx + 32, wy + gh - 132, { role: 'label', size: 19, color: C.mute, alpha: a2, maxW: cw - 64 });
      clk_ba(t, cx + 32, wy + gh - 52, { before: cP.gf.toFixed(1), after: cB.gf.toFixed(1), unit: 'gf', size: 76, k: ep(t, t2 + 0.6, t2 + 1.2), a: a2, hero: true, net: '−' + ((1 - cB.gf / cP.gf) * 100).toFixed(0) + '%', netRight: true, netSize: 30 }); }
    noteBox(t, 6.4, cx, CLK_BOT - hS, cw, Object.assign({}, scr, { h: hS }));
  }
});

/* ============================== 08. dual rail main clicks (#3) on POM pads (#28) ============================== */
/** one trigger cut across through its posts, looking forward: the centre split on the left, the outer edge on the right.
   One post: pressed at the edge, the trigger rolls about it and the post grinds its bare guide. dual: a second post on its own
   rail, both posts in POM-padded guides, and the trigger goes straight down. press 0..1, motion exaggerated. y down, mm, origin
   on the board under the switch. Returns stage points for callouts */
function clk_railFrontMM(o = {}) {
  const dual = !!o.dual, p = clamp(o.press || 0), out = {}, X1 = -0.5, X2 = 8.8, pw = 2.4, tip1 = -3.4, tip2 = -2.4, th = 1.4;
  const roll = dual ? 0 : 0.1 * p, dv = dual ? 1.1 * p : 0.35 * p, yt = x => -10.4 - 0.9 * (1 - (x / 13) * (x / 13)) + 0.045 * x;
  const F = (mt, f, h) => Object.assign({ fill: f, ec: edgeCol(mt) }, h ? { hatch: true } : {});
  solid(() => { G.beginPath(); G.moveTo(-14.5, 0); G.lineTo(14.5, 0); brk(14.5, 0, 1.0, 0.3); G.lineTo(-14.5, 1.0); brk(-14.5, 1.0, 0, 0.3); G.closePath(); }, MT.fr4, [-14.5, 0, 29, 1], F(MT.fr4, TH ? '#55613C' : '#424D2D'));
  solid(() => pathRR(X1 - 3.3, -2.2, 6.6, 2.2, 0.35), MT.black, [X1 - 3.3, -2.2, 6.6, 2.2], F(MT.black, CLK_PC.body()));
  const pd = Math.min(1.15, dv);
  solid(() => pathRR(X1 - 0.7, tip1 + pd, 1.4, -2.2 - (tip1 + pd), 0.25), MT.pom, [X1 - 0.7, tip1, 1.4, 1.2], F(MT.pom, CLK_PC.pom()));
  const gap = dual ? 0.06 : 0.3, tp = 0.6, tw = 1.5;
  const guide = (x, y0, y1, pads, key) => {
    for (const s of [-1, 1]) {
      const fi = x + s * (pw / 2 + gap), po = fi + s * (pads ? tp : 0), wo = po + s * tw;
      solid(() => pathRR(Math.min(po, wo), y0, tw, y1 - y0, 0.4), MT.shell, [Math.min(po, wo), y0, tw, y1 - y0], F(MT.shell, CLK_PC.light(), true));
      if (pads) solid(() => pathRR(Math.min(fi, po), y0 + 0.25, tp, y1 - y0 - 0.5, 0.15), MT.pom, [Math.min(fi, po), y0, tp, y1 - y0], F(MT.pom, CLK_PC.pom()));
      if (s < 0 && key) out[key] = SP((fi + po) / 2, y0 + 0.6);
    }
  };
  guide(X1, -7.2, -4.4, dual, 'guide1'); if (dual) guide(X2, -7.0, -3.4, true, 'guide2');
  xsave(); xmove(0, dv); xabout(X1, tip1, roll);
  const fl = CLK_PC.graph(), post = (x, tip) => solid(() => pathRR(x - pw / 2, yt(x) + th - 0.4, pw, tip - (yt(x) + th - 0.4), 0.5), MT.shell, [x - pw / 2, yt(x), pw, 8], F(MT.shell, fl));
  post(X1, tip1); if (dual) post(X2, tip2);
  solid(() => { G.beginPath(); G.moveTo(-13, yt(-13) + 0.3); for (let x = -13; x <= 13.01; x += 0.25) G.lineTo(x, yt(x)); G.quadraticCurveTo(13.5, yt(13), 13.4, yt(13) + th * 0.6); G.lineTo(13, yt(13) + th); for (let x = 13; x >= -13; x -= 0.25) G.lineTo(x, yt(x) + th); G.closePath(); }, MT.shell, [-13, -12.5, 26, 3], F(MT.shell, fl));
  mmLine(Array.from({ length: 53 }, (_, i) => { const x = -12.6 + i * 0.48; return [x, yt(x) + 0.14]; }), 'rgba(255,255,255,0.22)', 1.2);
  out.edge = SP(12.0, yt(12.0)); out.post2 = SP(X2, -5.4); out.rub = SP(X1 + pw / 2, -6.9);
  xrest();
  return out;
}
clk_S({
  id: 'anchors', ch: 'click', theme: 'night', title: 'Dual rail main clicks', settle: 10, ideas: [3, 28],
  src: ['tpuUlx', 'delrin150', 'clk_brock'],
  sfx: [[3.3, 'click'], [6.9, 'click']],
  draw: t => {
    header(t, 'Dual rail main clicks');
    captions(t, [[0.6, 'Press a trigger near its edge. On one post it rolls about that post, and the post grinds its guide.'], [4.2, 'Dual rail adds a second post, as far from the first as the trigger allows, each on its own rail.'], [7.0, 'Both posts slide on POM pads. Now the trigger goes one way only: straight down, square to the switch.']]);
    const wy = CLK_TOP, h = 440, w = 840, pr = ep(t, 2.4, 3.4, E.io3) - ep(t, 5.0, 5.6, E.io3) + ep(t, 6.2, 7.0, E.io3);
    [false, true].forEach((dual, i) => {
      const x = LM + i * (w + 80), t0 = 0.3 + i * 0.25;
      demoWindow(x, wy, w, h, tileA(t, t0, 0), { hero: dual });
      cardHead(t, t0 + 0.3, x, wy, w, dual ? 'Dual rail, on POM pads' : 'One post, in a bare guide', []);
      const o = part(x + 500, wy + 400, 22, () => clk_railFrontMM({ dual, press: pr }), { alpha: ep(t, t0 + 0.4, t0 + 0.9) });
      /* the plan, small, top left: where the posts sit, and the line a one-post trigger rolls about */
      const ki = ep(t, t0 + 0.8, t0 + 1.3), q = part(x + 48, wy + 250, 2.6, () => plateMM({}), { alpha: ki });
      if (q.hinge && ki > 0) {
        if (!dual) { const d = [q.p1[0] - q.hinge[0], q.p1[1] - q.hinge[1]]; line(q.hinge[0] - d[0] * 0.05, q.hinge[1] - d[1] * 0.05, q.p1[0] + d[0] * 0.75, q.p1[1] + d[1] * 0.75, { color: C.bad, w: 2, dash: [5, 4], alpha: ki }); }
        circle(q.hinge[0], q.hinge[1], 4, { fill: C.ink2, alpha: ki }); circle(q.p1[0], q.p1[1], 5, { fill: C.hero, alpha: ki });
        if (dual) circle(q.p2[0], q.p2[1], 5, { fill: C.hero, alpha: ki });
        circle(q.edgePress[0], q.edgePress[1], 7, { color: C.ink, w: 2, alpha: ki });
        text('From above', x + 48, wy + 290, { role: 'small', size: 22, color: C.faint, alpha: ki });
      }
      /* the pointer presses the outer edge */
      if (o.edge) { const ka = ep(t, 1.6, 2.3, E.cam), st = [o.edge[0] + 90, o.edge[1] - 110]; cursorPtr(lerp(st[0], o.edge[0], ka), lerp(st[1], o.edge[1], ka), { a: ep(t, 1.4, 1.8), press: prog(t, 2.4, 2.9) > 0 && prog(t, 2.4, 2.9) < 1 ? prog(t, 2.4, 2.9) : 0 }); }
      if (!dual) {
        if (o.edge) callout(t, 3.4, o.edge, 'It rolls about its one post', { to: [o.edge[0] - 14, wy + 110], side: 'l', color: C.bad, tcolor: C.ink, maxW: 240, prose: true });
        if (pr > 0.8 && o.rub) { circle(o.rub[0], o.rub[1], 9 + 5 * Math.sin(t * 9), { color: C.bad, w: 2.5 }); }
        callout(t, 3.7, o.rub, 'Grinds its bare guide', { to: [x + 576, wy + 330], side: 'r', color: C.bad, tcolor: C.ink, maxW: 240, prose: true });
      } else {
        if (o.post2) callout(t, 7.2, o.post2, 'A second post, on its own rail', { to: [o.post2[0] - 14, wy + 110], side: 'l', color: C.hero, tcolor: C.ink, maxW: 240, prose: true });
        callout(t, 7.5, o.guide1, 'POM pads', { to: [x + 250, wy + 330], side: 'l', color: C.hero, tcolor: C.ink });
      }
    });
    /* the word, the review, what ships */
    const by = 760, bw = 560;
    /* at a glance: the headline first, then the word (with what ships), then the review */
    { const a = ep(t, 7.0, 7.5, E.snap), hh = 200; demoWindow(LM, by, bw, hh, a);
      text('Ways it can move (fewer is better)', LM + 32, by + 44, { role: 'label', size: 19, color: C.mute, alpha: a });
      clk_hl(t, 7.2, LM + 32, by + 136, '1', 'way to move', { size: 96, count: false, sub: 'Straight down; one post also lets it roll', subSize: 22, maxW: bw - 64 }); }
    clk_gloss(t, 4.6, LM + bw + 40, by, bw, 'Dual rail', 'Two posts per trigger, far apart, each in its own guide. G-Wolves made two plungers popular (#3); Finalmouse put POM pads in the SLX (#28).');
    clk_src(t, 5.0, LM + 2 * (bw + 40), by, bw, 'TechPowerUp', 'On the ULX, with one post and no pads: it "can move laterally quite a bit when pushed".');
    text('Illustration: roll and travel exaggerated', LM, 994, { role: 'foot', color: C.faint, alpha: ep(t, 3.0, 3.4) });
  }
});

/* ============================== 09. POM pad thickness: the factory's tolerance knob (#28) ============================== */
const CLK_PADS = [0.55, 0.60, 0.65, 0.70, 0.75, 0.80, 0.85], CLK_GAP = 0.78;
clk_S({
  id: 'clk_pomtune', ch: 'click', theme: 'paper', title: 'POM pad thickness sets the tolerance', settle: 10, ideas: [28],
  src: ['clk_protolabs', 'delrin150', 'clk_brock'],
  sfx: [[2.6, 'seat'], [5.6, 'seat']],
  draw: t => {
    header(t, 'POM pad thickness sets the tolerance');
    captions(t, [[0.6, 'Every molded gap lands where its mold puts it. So the factory measures each trigger\'s gap.'], [3.9, 'Then it fits the pad that fills it. The pads come in steps of 0.05 mm.'], [6.6, 'Whatever the mold does, every trigger ends within 0.05 mm of a perfect fit, and no steel is recut.']]);
    const [wx, ww] = CLK_G.a, wy = CLK_TOP, wh = CLK_BOT - wy, s = 150, g = CLK_GAP, pick = CLK_PADS.filter(v => v <= g + 1e-9).pop(), left = g - pick;
    clk_tile(t, 0.3, wx, wy, ww, wh, 'One rail of an example trigger, cut across, close up', []);
    const fx = wx + 470, mouth = wy + 170, y1 = wy + 460, pfx = fx + g * s, ka = ep(t, 0.6, 1.2);
    /* the gauge: a taper, 0.30 mm at its tip, widening 0.25 mm per mm, riding the post's face; it stops where it fills the gap */
    const dTip = (g - 0.30) / 0.25, kin = ep(t, 1.6, 2.6, E.io3), kout = ep(t, 3.2, 3.8, E.io3);
    const tipY = lerp(mouth - 90, mouth + dTip * s, kin) - kout * (dTip * s + 300);
    /* the pad: picked from the tray, carried into the gap, set against the wall */
    const trayY = wy + 520, trayX = []; let tx = wx + 92; CLK_PADS.forEach(v => { trayX.push(tx); tx += v * s + 20; });
    const ip = CLK_PADS.indexOf(pick), kp = ep(t, 4.7, 5.6, E.cam), padX = lerp(trayX[ip], fx, kp), padY = lerp(trayY, mouth, kp), padH = lerp(80, y1 - mouth + 20, kp);
    clipped(wx + 32, wy + 120, ww - 64, y1 - wy - 120, () => {
      G.save(); G.globalAlpha = ka;
      /* the wall (a guide in the shell, cut, so it is hatched), its face square to the press */
      rr(wx + 20, mouth, fx - wx - 20, y1 - mouth + 60, 8, CLK_PC.light(), inkA(0.45), 1.5);
      G.save(); rrPath(wx + 20, mouth, fx - wx - 20, y1 - mouth + 60, 8); G.clip(); G.strokeStyle = inkA(0.16); G.lineWidth = 1.2; G.beginPath(); for (let k = -400; k < 800; k += 22) { G.moveTo(wx + k, y1 + 60); G.lineTo(wx + k + 400, y1 - 340); } G.stroke(); G.restore();
      /* the post (the trigger's), coming down from above */
      rr(pfx, wy + 100, 2.6 * s, y1 - wy, 18, CLK_PC.graph(), inkA(0.45), 1.5);
      G.restore();
      /* the gauge */
      if (kout < 1 && kin > 0) {
        const L = 6, sl = [], sr = [];
        for (let d = 0; d <= L + 1e-9; d += 0.25) { const yy = tipY - d * s, w2 = (0.30 + 0.25 * d) * s; sl.push([pfx - w2, yy]); sr.push([pfx, yy]); }
        G.save(); G.beginPath(); sl.forEach((p, i) => i ? G.lineTo(p[0], p[1]) : G.moveTo(p[0], p[1])); for (let i = sr.length - 1; i >= 0; i--) G.lineTo(sr[i][0], sr[i][1]); G.closePath();
        G.fillStyle = CLK_PC.steel(); G.fill(); G.strokeStyle = inkA(0.55); G.lineWidth = 1.5; G.stroke(); G.restore();
        for (const wv of [0.5, 0.6, 0.7, 0.8, 0.9, 1.0]) { const d = (wv - 0.30) / 0.25, yy = tipY - d * s; line(pfx - wv * s + 6, yy, pfx - 6, yy, { color: inkA(0.5), w: 1.5 }); }
      }
      /* the pad, in place or on its way */
      if (kp > 0) { rr(padX, padY, pick * s, padH, 4, CLK_PC.pom(), inkA(0.5), 1.5); }
    });
    /* the reading, the pick, what is left */
    const kr1 = ep(t, 2.5, 2.9), kr2 = ep(t, 4.5, 4.9), kr3 = ep(t, 5.7, 6.1), ry = wy + 100;
    rich([{ s: 'Gap', role: 'label', size: 21, color: C.mute }, { s: countUp(g.toFixed(2) + ' mm', ep(t, 2.5, 3.1)) || g.toFixed(2) + ' mm', role: 'num', size: 28, weight: 800, color: C.ink, gap: 14 }], wx + 32, ry, { alpha: kr1 });
    rich([{ s: 'Pad', role: 'label', size: 21, color: C.mute }, { s: pick.toFixed(2) + ' mm', role: 'num', size: 28, weight: 800, color: C.ink, gap: 14 }], wx + 330, ry, { alpha: kr2 });
    rich([{ s: 'Left', role: 'label', size: 21, color: C.mute }, { s: left.toFixed(2) + ' mm', role: 'num', size: 28, weight: 800, color: C.heroText, gap: 14 }], wx + 610, ry, { alpha: kr3 });
    if (kr3 > 0) { const xa = fx + pick * s, xb = pfx, yy = mouth + 150; line(xa, yy, xb, yy, { color: C.hero, w: 2, alpha: kr3 }); callout(t, 5.8, [(xa + xb) / 2, yy], left.toFixed(2) + ' mm', { to: [xb + 70, mouth + 60], side: 'r', color: C.hero, tcolor: C.ink }); }
    /* the tray: one pad per 0.05 mm step, drawn to scale */
    const kt = ep(t, 3.6, 4.2);
    CLK_PADS.forEach((v, i) => {
      const a = kt * (i === ip && kp > 0 ? 0 : 1);
      if (i === ip && kp > 0) rr(trayX[i], trayY, v * s, 80, 4, null, inkA(0.3), 1.5, kt);
      else rr(trayX[i], trayY, v * s, 80, 4, CLK_PC.pom(), inkA(0.5), 1.5, a);
      text(v.toFixed(2), trayX[i] + v * s / 2, trayY + 116, { role: 'num', size: 22, weight: 700, color: i === ip ? C.heroText : C.mute, align: 'center', alpha: kt });
    });
    text('POM pads, one every 0.05 mm, to scale', wx + 92, trayY + 156, { role: 'small', size: 22, color: C.faint, alpha: kt });
    /* the pointer: rides the gauge in and out, then carries the pad */
    const gp = [pfx - 0.6 * s, tipY - 4.4 * s], tp = [trayX[ip] + pick * s / 2, trayY + 30], pp = [padX + pick * s / 2, padY + 30];
    const ptr = t < 3.8 ? gp : t < 4.6 ? [lerp(gp[0], tp[0], ep(t, 3.8, 4.5, E.cam)), lerp(Math.max(gp[1], wy + 140), tp[1], ep(t, 3.8, 4.5, E.cam))] : t < 5.7 ? pp : [lerp(pp[0], pp[0] + 120, ep(t, 5.8, 6.4, E.cam)), lerp(pp[1], pp[1] - 80, ep(t, 5.8, 6.4, E.cam))];
    cursorPtr(ptr[0], Math.max(ptr[1], wy + 130), { a: ep(t, 1.2, 1.6), grab: (t > 1.6 && t < 3.8) || (t > 4.6 && t < 5.7), press: prog(t, 4.55, 4.9) > 0 && prog(t, 4.55, 4.9) < 1 ? prog(t, 4.55, 4.9) : 0 });
    /* right: the spread before and after, the source, the word */
    const [cx, cw] = CLK_G.b, band = 2 * 2 * 0.076;
    clk_stack(wy, [
      y => {
        /* at a glance: the worst gap left, one pad for every trigger → a pad fitted to each (F16.1: before → after) */
        const h = 200; clk_tile(t, 0.5, cx, y, cw, h, 'Gap left, at most (lower is better)', [{ ev: 'derived', text: 'Derived' }]);
        clk_ba(t, cx + 32, y + 140, { before: band.toFixed(2), after: '0.05', unit: 'mm', net: (band / 0.05).toFixed(0) + '× tighter: one pad for every trigger, then one fitted to each', size: 84, k: ep(t, 6.8, 7.6), a: ep(t, 6.6, 7.0), hero: true, netSize: 22 });
        return { h };
      },
      y => clk_src(t, 6.0, cx, y, cw, 'Protolabs 2023', 'Its molds are machined to ±0.076 mm. A gap between two molded faces can swing twice that each way: a 0.30 mm band.'),
      y => clk_gloss(t, 6.4, cx, y, cw, 'POM', 'Polyoxymethylene, sold as Delrin: hard and self-lubricating, friction 0.20 dry. A post slides on it without grinding.')
    ]);
  }
});

/* ============================== 10. flat front cutouts (#46), grooves that run out (#47), flush walls (#48) ============================== */
/** a note under a drawing: a dot on the point, a leader that drops and runs to the note, the note in sentence case */
function clk_note(t, t0, p, x, y, label, o = {}) {
  const k = ep(t, t0, t0 + 0.5, E.snap); if (k <= 0 || !p) return;
  const col = o.color || C.ink, ly = y - 38;
  circle(p[0], p[1], 5 * k, { fill: col }); circle(p[0], p[1], 11 * k, { color: col, w: 1.5, alpha: 0.45 });
  poly([[p[0], p[1]], [p[0], ly], [x, ly]], { color: col, w: 1.5, p: k, alpha: 0.85 });
  const r = text(label, x, y, { role: 'small', size: 25, weight: 700, color: o.tcolor || col, t, t0: t0 + 0.3, cps: 80, maxW: o.maxW || 420, lh: 1.28 });
  if (o.sub) text(o.sub, x, y + r.h + 2, { role: 'small', size: 24, weight: 600, color: C.mute, t, t0: t0 + 0.6, cps: 100, maxW: o.maxW || 420, lh: 1.3 });
}
/** the comfort groove across the button, at a distance z (mm) from its front edge: 0.6 mm deep, running out to nothing at the
   edge. Profiles drawn with the depth exaggerated (o.ex) so a tenth of a millimetre reads */
const clk_grooveD = z => 0.6 * smooth(clamp(z / 20));
function clk_grooveMM(o = {}) {
  const ex = o.ex || 5, zs = o.zs || [24, 16, 8, 0], out = { tags: [] };
  const prof = (z, x) => ex * clk_grooveD(z) * Math.pow(Math.cos(Math.PI * x / 26), 2);
  zs.forEach((z, i) => {
    const y0 = i * 7.2, a = o.k == null ? 1 : clamp((o.k - i * 0.22) / 0.3);
    if (a <= 0) return;
    xsave(); ga(a * 0.9);
    const pts = []; for (let x = -13; x <= 13.01; x += 0.25) pts.push([x, y0 + prof(z, x)]);
    solid(() => { G.beginPath(); pts.forEach((p, j) => j ? G.lineTo(p[0], p[1]) : G.moveTo(p[0], p[1])); for (let j = pts.length - 1; j >= 0; j--) G.lineTo(pts[j][0], pts[j][1] + 1.2); G.closePath(); }, MT.shell, [-13, y0 - 3, 26, 4.2], { hatch: true, fill: CLK_PC.graph() });
    if (z === 0) mmLine([[-13, y0 + prof(0, -13) - 0.05], [13, y0 + prof(0, 13) - 0.05]], C.hero, 2.2, { dash: [6, 4] });
    xrest();
    out.tags.push({ z, p: SP(13.6, y0 + prof(z, 13) + 0.4), a });
  });
  return out;
}
clk_S({
  id: 'clk_front', ch: 'click', theme: 'night', title: 'Flat front cutouts, flush walls', settle: 10, ideas: [46, 47, 48],
  src: ['clk_brock'],
  sfxLoop: [{ t0: 1.6, per: 2.6, cues: [[0, 'click'], [0.1, 'release']] }],
  draw: t => {
    header(t, 'Flat front cutouts, flush walls');
    captions(t, [[0.6, 'At the front, two flat faces meet. The gap between them is the post-travel, and a flat face is easy to recut.'], [3.8, 'For the front to be flat, the comfort grooves run out before it: they shallow to nothing at the edge.'], [6.8, 'Beside the button, the walls sit level with it when it is pressed, so a pressed finger feels no step.']]);
    const wy = CLK_TOP, h = 480, w = 560, X = i => LM + i * (w + 40);
    /* 1: the front cutout in section */
    clk_tile(t, 0.3, X(0), wy, w, h, 'Front cutout, in section', []);
    const fp = clk_curve(cyc(t, 1.6, 2.6)), fo = part(X(0) + w / 2 - 10, wy + 200, 16, () => frontStopMM({ press: fp, gapMark: ep(t, 1.8, 2.2), accent: C.hero }), { alpha: ep(t, 0.8, 1.3) });
    if (fo.dimAt) text('Gap', fo.dimAt[0] - 10, fo.dimAt[1] + 7, { role: 'label', size: 21, color: C.heroText, align: 'right', alpha: ep(t, 2.0, 2.4) });
    clk_note(t, 2.0, fo.stop, X(0) + 34, wy + 350, 'Both faces flat, level with the ground', { color: C.hero, tcolor: C.ink, maxW: w - 68, sub: 'The gap is the post-travel: cut one face to tune it.' });
    /* 2: the groove, front to back */
    clk_tile(t, 0.5, X(1), wy, w, h, 'Groove, front to back', []);
    const kg = ep(t, 3.6, 5.6, E.lin), go = part(X(1) + w / 2 - 50, wy + 120, 10, () => clk_grooveMM({ k: kg * 1.2 }), { alpha: ep(t, 3.4, 3.8) });
    (go.tags || []).forEach(g2 => { if (g2.a <= 0) return; text((g2.z ? g2.z + ' mm' : 'Edge'), g2.p[0] + 14, g2.p[1] + 4, { role: 'label', size: 21, color: g2.z ? C.mute : C.heroText, alpha: g2.a }); text(clk_grooveD(g2.z).toFixed(2) + ' mm', g2.p[0] + 14, g2.p[1] + 30, { role: 'num', size: 22, weight: 700, color: g2.z ? C.ink2 : C.heroText, alpha: g2.a }); });
    text('Distance from the front edge, and depth', X(1) + 32, wy + h - 70, { role: 'small', size: 25, weight: 600, color: C.mute, alpha: ep(t, 4.2, 4.6), maxW: w - 64 });
    text('Depth drawn 5 times deeper', X(1) + 32, wy + h - 32, { role: 'small', size: 22, color: C.faint, alpha: ep(t, 4.2, 4.6) });
    /* 3: beside the button, from the front */
    clk_tile(t, 0.7, X(2), wy, w, h, 'Beside the button', []);
    /* drawn right of centre, so the side wall's section ends clear of the note under it (review item 19) */
    const lp = clk_curve(cyc(t, 6.8, 2.6)), lo = part(X(2) + 300, wy + 230, 17, () => flushMM({ press: lp, ref: ep(t, 7.0, 7.4), accent: C.hero }), { alpha: ep(t, 6.5, 7.0) });
    clk_note(t, 7.0, lo.wall, X(2) + 34, wy + 350, 'Wall level with the pressed button', { color: C.hero, tcolor: C.ink, maxW: w - 68, sub: 'The front bottoms out first; the walls meet the average.' });
    clk_gloss(t, 2.6, LM, 800, 840, 'Post-travel', 'How far a button moves on after its switch has clicked.');
    clk_src(t, 3.0, LM + 880, 800, RM - LM - 880, 'My doc, #46', 'Flat faces make the travel easy to tune in the mold\'s steel.');
  }
});

/* ============================== 11. switches that swap without solder (#14) ============================== */
const CLK_HS_STEP = [{ n: '#14', who: 'Endgame Gear OP1 8K', ev: 'measured', evText: 'TechRadar', now: 'Swaps switches; TechRadar: the terminal is "hard to remove and easy to insert backwards".', step: 'A keyed, moulded pin cover: a switch cannot go in backwards. Orientation errors: zero, by design.' }];
/** a pin in, a pause, a pin out: 0..1 over a 4.2 s loop */
const clk_insert = t => { const u = ((t % 4.2) + 4.2) % 4.2; return u < 1.4 ? E.io3(u / 1.4) : u < 3.2 ? 1 : 1 - E.io3((u - 3.2) / 1.0); };
clk_S({
  id: 'clk_hotswap', ch: 'click', theme: 'paper', title: 'Hot-swap switches on claw sockets', settle: 10, ideas: [14],
  src: ['clk_millmax', 'millmax', 'clk_eggSwap', 'trOp1', 'clk_brock'], three: ['claw'],
  sfx: [[2.0, 'seat']],
  draw: t => {
    header(t, 'Hot-swap switches on claw sockets');
    captions(t, [[0.6, 'Each switch leg drops into a Mill-Max 3305: a sleeve in the board with a gold-plated beryllium-copper claw.'], [4.0, 'Rated for 1,000 insertions at 10 mΩ or less: swap a switch every week and the socket lasts 19 years.'], [7.0, 'The OP1 8K already swaps switches. Mine adds a keyed pin cover, so a switch cannot go in backwards.']]);
    const [wx, ww] = CLK_G.a, wy = CLK_TOP, wh = 440;
    clk_tile(t, 0.3, wx, wy, ww, wh, 'A switch leg entering its socket, cut through', [{ ev: 'datasheet', by: 'Mill-Max' }]);
    const ins = t < 1.2 ? 0 : clk_insert(t - 1.2), push = ep(t, 0.4, 7.0, E.cam);
    clk_v3('claw', t, wx + 10, wy + 70, ww - 20, wh - 150, { insert: ins, section: 1, view: 'threeQuarter', yaw: 0.2 + 0.08 * (1 - push), pitch: -0.05, zoom: in2D(lerp(2.3, 2.6, push), lerp(1.3, 1.45, push)), target: in2D([0, 0.8, 0], undefined) }, { alpha: ep(t, 0.8, 1.4) });
    text('BeCu claw, 30 µin gold on the contact only', wx + 32, wy + wh - 50, { role: 'small', size: 25, weight: 600, color: C.ink, alpha: ep(t, 1.8, 2.2) });
    text('Takes leads 0.635 to 0.940 mm across', wx + 32, wy + wh - 20, { role: 'small', size: 22, color: C.faint, alpha: ep(t, 2.0, 2.4) });
    const [cx, cw] = CLK_G.b;
    statTile(t, 2.4, [cx, wy, 320, 200], { value: '1,000', label: 'Insertions, at least', ev: 'datasheet', by: 'Mill-Max', quiet: true });
    statTile(t, 4.2, [cx + 360, wy, 320, 200], { value: '19', unit: 'years', label: 'Swapped every week', ev: 'derived', hero: true });
    clk_gloss(t, 3.0, cx, wy + 240, cw, 'Claw-spring socket', 'A sleeve soldered into the board with spring fingers inside, so a part plugs in instead of being soldered.');
    clk_steps(t, 7.2, LM, 760, RM - LM, CLK_HS_STEP);
  }
});

/* ============================== 12. SPDT: single pole, double throw (#79), in big letters ============================== */
/** one press as the pole sees it, ms → { a: the pole, -1 on NC to +1 on NO; nc, no: 1 while that throw is closed }. It leaves NC,
   flies, lands on NO and bounces three times; on release it flies back and bounces on NC */
const CLK_PT = { off: 2.0, on: 3.5, bo: 4.4, rel: 8.0, back: 9.5, bb: 10.2, end: 12 };
function clk_pole(ms) {
  const T = CLK_PT, hop = u => { const ph = clamp(u) * 3, k = Math.min(2, Math.floor(ph)); return Math.pow(0.45, k) * Math.sin(Math.PI * (ph - k)); };
  let a;
  if (ms < T.off) a = -1;
  else if (ms < T.on) a = -1 + 2 * E.hit((ms - T.off) / (T.on - T.off));
  else if (ms < T.bo) a = 1 - 0.32 * hop((ms - T.on) / (T.bo - T.on));
  else if (ms < T.rel) a = 1;
  else if (ms < T.back) a = 1 - 2 * E.hit((ms - T.rel) / (T.back - T.rel));
  else if (ms < T.bb) a = -1 + 0.32 * hop((ms - T.back) / (T.bb - T.back));
  else a = -1;
  return { a, nc: a <= -0.985 ? 1 : 0, no: a >= 0.985 ? 1 : 0, click: ms >= T.on && ms < T.back ? 1 : 0 };
}
clk_S({
  id: 'clk_spdt', ch: 'click', theme: 'night', title: 'SPDT', settle: 10, ideas: [79],
  src: ['tomsBounce', 'tomsDebounce', 'clk_brock'],
  sfx: [[2.2 + 4.2 * CLK_PT.on / CLK_PT.end, 'click'], [2.2 + 4.2 * CLK_PT.back / CLK_PT.end, 'release']],
  draw: t => {
    header(t, 'SPDT');
    captions(t, [[0.6, 'Every Theseus click runs on SPDT switches. One moving contact, two places it can land.'], [3.4, 'The pole leaves NC, lands on NO and bounces. The click counts at the first touch, and the bounce never counts.'], [6.8, 'On release it lands back on NC, and that counts the release. No timer, no guessing.']]);
    /* the name, in big letters: the initials in Theseus's colour */
    const runs = [['S', 'ingle '], ['P', 'ole, '], ['D', 'ouble '], ['T', 'hrow']], sz = 92, R = [];
    runs.forEach(([i0, rest], k) => { const t0 = 0.35 + k * 0.22; R.push({ s: i0, role: 'd2', size: sz, color: C.heroText, gap: 0, rise: [t0, 0.8] }, { s: rest, role: 'd2', size: sz, color: C.ink, gap: 0, rise: [t0 + 0.05, 0.8] }); });
    const rr0 = rich(R, LM - 4, 400, { t });
    const xsP = rr0.xs, xsEnd = i => xsP[i] + rr0.ws[i];
    text('One moving contact: the pole', xsP[0] + 4, 452, { role: 'small', size: 25, weight: 600, color: C.mute, alpha: ep(t, 1.3, 1.7) });
    text('Two places it can land: NC and NO', xsP[4] + 4, 452, { role: 'small', size: 25, weight: 600, color: C.mute, alpha: ep(t, 1.6, 2.0) });
    /* the pole, abstract, and what each throw reads */
    const wy = 520, [wx, ww] = CLK_G.a, wh = CLK_BOT - wy, ms = clamp((t - 2.2) / 4.2) * CLK_PT.end, st = clk_pole(ms), kt = ep(t, 1.4, 1.9);
    clk_tile(t, 1.4, wx, wy, ww, wh, 'One press, slowed down: an illustration', []);
    /* the pole: compact, on the left; the throws' wires run on into the traces */
    const px = wx + 96, py = wy + 250, L = 220, ang = 0.26 * st.a, tip = [px + L * Math.cos(ang), py + L * Math.sin(ang)];
    const ncP = [px + L * Math.cos(-0.26), py + L * Math.sin(-0.26)], noP = [px + L * Math.cos(0.26), py + L * Math.sin(0.26)];
    const live = st.nc ? 'nc' : st.no ? 'no' : null, flow = (pts, on) => { poly(pts, { color: on ? C.hero : inkA(0.32), w: on ? 3.5 : 2, alpha: kt }); if (on) { G.save(); G.globalAlpha = kt; G.strokeStyle = C.onHero; G.lineWidth = 2; G.setLineDash([5, 14]); G.lineDashOffset = -t * 60; G.beginPath(); pts.forEach((p, i) => i ? G.lineTo(p[0], p[1]) : G.moveTo(p[0], p[1])); G.stroke(); G.restore(); } };
    const amp = 40, lanes = { nc: wy + 170, no: wy + 280, click: wy + 390 }, x0 = wx + 420, x1 = wx + ww - 48, X = m => x0 + (x1 - x0) * m / CLK_PT.end;
    flow([[ncP[0] + 22, ncP[1] - 8], [ncP[0] + 50, ncP[1] - 8], [ncP[0] + 50, lanes.nc - amp], [x0, lanes.nc - amp]], live === 'nc');
    flow([[noP[0] + 22, noP[1] + 8], [noP[0] + 50, noP[1] + 8], [noP[0] + 50, lanes.no - amp], [x0, lanes.no - amp]], live === 'no');
    flow([[px, py], [px, py + 120]], !!live);
    for (const [p, nm, on] of [[ncP, 'NC', live === 'nc'], [noP, 'NO', live === 'no']]) {
      rr(p[0] - 2, p[1] + (nm === 'NC' ? -30 : 10), 26, 20, 3, on ? C.hero : CLK_PC.steel(), null, 0, kt);
      text(nm, p[0] - 14, p[1] + (nm === 'NC' ? -16 : 32), { role: 'label', size: 22, color: on ? C.heroText : C.mute, align: 'right', alpha: kt });
    }
    line(px, py, tip[0], tip[1], { color: live ? C.hero : C.ink2, w: 12, cap: 'round', alpha: kt });
    circle(px, py, 16, { fill: C.panel, color: C.ink2, w: 3, alpha: kt }); circle(tip[0], tip[1], 8, { fill: live ? C.hero : C.ink2, alpha: kt });
    text('COM', px - 26, py + 8, { role: 'label', size: 22, color: C.mute, align: 'right', alpha: kt });
    text('Pole', px + 70, py - 30 + 52 * st.a * 0.26, { role: 'label', size: 22, color: C.ink2, alpha: kt });
    /* the traces: what the mouse reads on each throw, and the click it builds from them */
    for (const m of [0, 4, 8, 12]) { line(X(m), wy + 110, X(m), wy + wh - 44, { color: C.hair, w: 1, alpha: kt }); text(m + ' ms', X(m), wy + wh - 16, { role: 'tick', color: C.mute, align: 'center', alpha: kt }); }
    for (const key of ['nc', 'no', 'click']) {
      const yb = lanes[key], pts = []; let prev = clk_pole(0)[key];
      for (let m = 0; m <= ms; m += 0.01) { const v = clk_pole(m)[key]; if (v !== prev) pts.push([X(m), yb - prev * amp]); pts.push([X(m), yb - v * amp]); prev = v; }
      poly(pts, { color: key === 'click' ? C.hero : C.ink2, w: key === 'click' ? 4 : 2.4, alpha: kt });
    }
    text('Click', x0 - 14, lanes.click - 12, { role: 'label', size: 22, color: C.heroText, align: 'right', alpha: kt });
    /* where it counts: the press at NO's first touch, the release at NC's; the bounce on NO counts for nothing */
    const mk = (m, label) => { const k = ep(t, 2.2 + 4.2 * m / CLK_PT.end, 2.5 + 4.2 * m / CLK_PT.end); if (k <= 0) return; line(X(m), wy + 112, X(m), lanes.click + 8, { color: C.hero, w: 2, dash: [6, 5], alpha: k }); text(label, X(m), wy + 100, { role: 'small', size: 22, weight: 700, color: C.heroText, align: 'center', alpha: k }); };
    mk(CLK_PT.on, 'Click counts'); mk(CLK_PT.back, 'Release counts');
    const kb = ep(t, 2.2 + 4.2 * CLK_PT.bo / CLK_PT.end, 2.5 + 4.2 * CLK_PT.bo / CLK_PT.end);
    text('Bounce, not counted', X(CLK_PT.bo) + 12, lanes.no - amp - 12, { role: 'small', size: 22, weight: 600, color: C.mute, alpha: kb });
    /* right: what the second throw buys */
    const [cx, cw] = CLK_G.b, items = [['No debounce wait', 'It counts at the first touch on NO.'], ['No false double clicks', 'A bounce on NO cannot count twice.'], ['An active release', 'It counts the instant the pole lands on NC.']];
    clk_tile(t, 1.8, cx, wy, cw, wh, 'What the second throw buys', []);
    items.forEach(([hd, bd], i) => {
      const yy = wy + 130 + i * 112, k = ep(t, 7.2 + i * 0.35, 7.7 + i * 0.35);
      G.save(); G.translate(0, (1 - E.out3(k)) * 12);
      text(hd, cx + 32, yy, { role: 'h3', size: 32, weight: 700, color: C.ink, alpha: k });
      text(bd, cx + 32, yy + 40, { role: 'small', size: 25, weight: 560, color: C.mute, alpha: k, maxW: cw - 64 });
      G.restore();
    });
  }
});

/* ============================== 13. counted at first contact (#79): the real switch, four ways to read it ============================== */
/** a switch's signals (0..1) against time (ms). The common contact leaves NC at 1.0 ms and lands on NO 1.5 ms later: XBAB's figure for that gap */
const CLK_E = { nc: 1.0, no: 2.5 };
function clk_sig(kind, ms) {
  if (kind === 'nc') return ms < CLK_E.nc ? 1 : 0;
  if (kind === 'no') return ms < CLK_E.no ? 0 : 1;
  const end = kind === 'worn' ? 12.6 : CLK_E.no + 0.7;
  if (ms < CLK_E.no) return 0; if (ms > end) return 1;
  const n = Math.floor((ms - CLK_E.no) / (kind === 'worn' ? 0.22 : 0.07));
  return (Math.sin(n * 12.9898 + (kind === 'worn' ? 3 : 1)) * 43758.5453 % 1 + 1) % 1 > 0.42 ? 1 : 0;
}
clk_S({
  id: 'latency', ch: 'click', theme: 'paper', title: 'Counted at first contact', settle: 11, ideas: [79],
  src: ['tomsBounce', 'tomsDebounce', 'clk_xbabClick', 'clk_gt01'],
  sfxLoop: [{ t0: 1.2, per: 2.6, cues: [[0, 'click'], [0.1, 'release']] }],
  draw: t => {
    header(t, 'Counted at first contact');
    captions(t, [[0.6, 'A single-throw mouse reads one contact, so it has to wait out the bounce before it trusts a press.'], [4.2, 'The GT01 is double throw, so it counts the press the moment the pole leaves NC: 1.5 ms before it reaches NO.']]);
    const wy = CLK_TOP, lx = LM, lw = 680, sh = 440, rx = lx + lw + 40, rw = RM - rx, rh = CLK_BOT - wy;
    /* left: the GT01, cover clear, pressing */
    clk_tile(t, 0.3, lx, wy, lw, sh, 'Gateron GT01, cover clear', ['claim']);
    const sc = clk_swc(t, 1.2, 2.6), o = part(lx + 360, wy + 358, 22, () => clk_gt01MM({ press: sc.pr, state: sc.state }), { alpha: ep(t, 0.4, 1.0) });
    if (sc.c >= 0 && o.contact) { const ts = sc.c * 2.6, n = Math.floor((t - 1.2) / 2.6); clk_spark(o.contact, ts - CLK_SNAP.no * 2.6, C.hero, 0.8, 11 + n); clk_spark(o.contact, ts - CLK_SNAP.nc * 2.6, C.ink2, 0.5, 53 + n); }
    clk_lamp(lx + 48, wy + 110, 'NC', sc.state === 'nc', C.ink, ep(t, 1.6, 2.0)); clk_lamp(lx + 168, wy + 110, 'NO', sc.state === 'no', C.hero, ep(t, 1.6, 2.0));
    clk_gloss(t, 2.4, lx, wy + sh + 40, lw, 'Debounce', 'The wait a single-throw mouse adds after a contact closes, so the bouncing metal is not read as extra clicks.');
    /* right: one press, four ways to read it */
    clk_tile(t, 0.5, rx, wy, rw, rh, 'One press, four ways to read it', [{ ev: 'derived', text: 'Derived' }]);
    const x0 = rx + 300, x1 = rx + rw - 40, T = 14, X = ms => x0 + (x1 - x0) * ms / T, now = clamp((t - 1.6) / 3.6) * T;
    /* the headline: how much sooner the NC release counts the press (XBAB's 1.5 ms from leaving NC to landing on NO) */
    clk_hl(t, 4.4, rx + 32, wy + 160, '1.5', 'ms sooner', { size: 96, sub: 'Counted as the pole leaves NC, not when it lands on NO', maxW: rw - 64 });
    for (let ms = 0; ms <= T; ms += 2) { line(X(ms), wy + 236, X(ms), wy + rh - 80, { color: C.hair, w: 1, alpha: ep(t, 0.9, 1.3) }); text(ms + ' ms', X(ms), wy + rh - 50, { role: 'tick', color: C.mute, align: 'center', alpha: ep(t, 0.9, 1.3) }); }
    const lanes = [['SPST, new', ['new'], 5.5, 'After a 3 ms wait'], ['SPST, worn', ['worn'], 12.6, 'Still bouncing: a double click'], ['SPDT, latch on NO', ['no', 'nc'], CLK_E.no, 'At NO, no wait'], ['SPDT, NC release', ['no', 'nc'], CLK_E.nc, 'At NC: 1.5 ms sooner']];
    lanes.forEach(([label, sig, reg, note], i) => {
      const yb = wy + 300 + i * 100, amp = 40, spdt = sig.length > 1;
      text(label, rx + 32, yb - 14, { role: 'label', size: 21, color: spdt ? C.heroText : C.ink, t, t0: 1.0 + i * 0.15, cps: 70 });
      sig.forEach((sg, j) => {
        const pts = []; let prev = clk_sig(sg, 0);
        for (let ms = 0; ms <= now; ms += 0.01) { const v = clk_sig(sg, ms); if (v !== prev) pts.push([X(ms), yb - prev * amp]); pts.push([X(ms), yb - v * amp]); prev = v; }
        poly(pts, { color: j ? C.faint : (spdt ? C.hero : C.ink), w: 2.4, dash: j ? [5, 4] : null });
      });
      if (now > reg) {
        const col = i === 3 ? C.heroText : i === 2 ? C.ink : i === 1 ? C.bad : C.ink2;
        line(X(reg), yb - amp - 10, X(reg), yb + 6, { color: col, w: 3 });
        const right = X(reg) + 12 + tw(note, { role: 'small', size: 23, weight: 600 }) < x1;
        text(note, right ? X(reg) + 12 : X(reg) - 12, yb - amp - 12, { role: 'small', size: 23, weight: 700, color: col, align: right ? 'left' : 'right' });
      }
    });
    text('NO solid, NC dashed', rx + 32, wy + rh - 50, { role: 'small', size: 22, color: C.faint, alpha: ep(t, 1.6, 2.0) });
  }
});

/* ============================== 14. what a debounce costs, measured ============================== */
clk_S({
  id: 'clk_debounce', ch: 'click', theme: 'night', title: 'Debounce costs milliseconds', settle: 9, ideas: [79],
  src: ['tpuAtlantis', 'clk_tpuV4', 'tpuHyper', 'tomsBounce'],
  sfx: [[5.2, 'snap']], jolt: t => joltAt(t, 5.1),
  draw: t => {
    header(t, 'Debounce costs milliseconds');
    captions(t, [[0.6, 'The wait is real time on every click. TechPowerUp measured it on one mouse, with its debounce on and off.'], [4.6, 'A 4 ms debounce made the Lamzu Atlantis 3 ms slower. SPDT needs no debounce at all.']]);
    const [wx, ww] = CLK_G.a, wy = CLK_TOP, wh = CLK_BOT - wy;
    clk_tile(t, 0.3, wx, wy, ww, wh, 'Click latency, switch to computer', [{ ev: 'measured', text: 'TechPowerUp' }]);
    /* Theseus's own row (review item 8): its target, counted at NC release on XBAB's analyzer method (the next slide but one says
       how methods differ), so the quickest row on the chart is Theseus's and not the V4 Pro's */
    const LR = 76;
    lollipop(t, { x: wx + 32, y: wy + 160, w: ww - 64, t0: 0.9, xr: [0, 6], ticks: [0, 2, 4, 6], tfmt: v => v + ' ms', fmt: v => (v < 0.1 ? v.toFixed(3) : v.toFixed(1)) + ' ms', labelW: 440, rowH: LR, valW: 130,
      rows: [{ name: 'Theseus', qual: 'target, NC release', v: CLK_TGT / 1000, hero: true }, { name: 'Razer Viper V4 Pro', qual: 'wired, 8 kHz', v: 0.079, ref: true }, { name: 'Hitscan Hyperlight', qual: '0 ms debounce', v: 0.4 }, { name: 'Lamzu Atlantis', qual: '0 ms debounce', v: 2.4 }, { name: 'Lamzu Atlantis', qual: '4 ms debounce', v: 5.4 }] });
    /* the cost on the chart: a bracket between the Atlantis with and without its debounce (lower is quicker) */
    { const lx0 = wx + 32 + 440, lpw = ww - 64 - 440 - 130 - 20, LX = v => lx0 + lpw * v / 6, yb = wy + 160 + 3.5 * LR, kb = ep(t, 5.1, 5.6, E.snap);
      if (kb > 0) { line(LX(2.4), yb, LX(2.4) + (LX(5.4) - LX(2.4)) * kb, yb, { color: C.bad, w: 2.5 }); line(LX(2.4), yb - 8, LX(2.4), yb + 8, { color: C.bad, w: 2.5 }); if (kb > 0.98) line(LX(5.4), yb - 8, LX(5.4), yb + 8, { color: C.bad, w: 2.5 });
        text('+3.0 ms of debounce', (LX(2.4) + LX(5.4)) / 2, yb - 14, { role: 'small', size: 23, weight: 700, color: C.bad, align: 'center', alpha: kb }); }
      text('Lower is quicker', wx + ww - 32, wy + 96, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: ep(t, 1.0, 1.4) }); }
    /* the headline is SPDT's, and the XA25 is SPDT too: the sub says so, and the box says where Theseus pulls ahead of it */
    clk_hl(t, 5.4, wx + 32, wy + wh - 72, '0', 'ms debounce', { size: 104, count: false, sub: 'SPDT, as on the XA25: nothing to wait out, new switch or worn', subSize: 23 });
    const [cx, cw] = CLK_G.b;
    clk_stack(wy, [
      y => clk_src(t, 2.2, cx, y, cw, 'TechPowerUp', 'Lamzu Atlantis: 2.4 ms with no debounce, 5.4 ms with 4 ms of it. The same mouse, the same rig.'),
      y => clk_src(t, 2.8, cx, y, cw, 'Tom\'s Hardware', 'A worn switch bounces for longer, so a single-throw mouse needs a longer wait, or it double clicks.'),
      y => clk_box(t, 5.8, cx, y, cw, { label: 'Theseus', value: 'SPDT', head: 'No debounce, ever', body: 'Nothing to wait out, new switch or worn. The XA25 is SPDT too: against it, my target wins the whole click, 72 → ' + CLK_TGT + ' µs.' })
    ]);
  }
});

/* ============================== 15. a click should never wait for motion (#79): XBAB's four tests ============================== */
let CLK_XB = null;
function clk_xbab() {
  if (CLK_XB) return CLK_XB;
  const X = (typeof RD !== 'undefined' && RD.latency) ? RD.latency.click_latency_xbab_vs_op1_8k_v2 : null;
  CLK_XB = X ? X.panels.map(p => ({ mode: p.mode, still: p.state === 'stationary', xa: p.XA25, op: p.OP1_8k_v2 })) : [];
  return CLK_XB;
}
/** Theseus's click-latency target, µs, moving or still, counted at NC release on XBAB's analyzer method (Brock, F18.5: "Tighten it",
   under the XA25's measured 72) */
const CLK_TGT = 70;
const CLK_WAIT_STEP = [{ n: '#79', who: 'Endgame Gear OP1 8k v2', ev: 'claim', evText: 'XBAB', now: 'Moving, it adds 121 to 125 µs to a click.', step: 'NC release that never waits for motion: 70 µs or less, under the XA25\'s 72.' }];
clk_S({
  id: 'clk_wait', ch: 'click', theme: 'paper', title: 'Clicks that never wait for motion', settle: 11, ideas: [79],
  src: ['clk_xbabClick', 'xbab', 'tpuOp1', 'clk_brock'],
  draw: t => {
    header(t, 'Clicks that never wait for motion');
    captions(t, [[0.6, 'XBAB put its XA25 against the OP1 8k v2 on a USB analyzer, with the mouse still and moving.'], [4.6, 'Still, the OP1\'s release mode is quick. Moving, the same click arrives 121 to 125 µs later: it waits behind motion.'], [8.0, 'My target: 70 µs or less, moving or still, under the XA25\'s 72. Published the same way, with n and the interval.']]);
    /* Rebuilt after the review (item 9). Only the two NC-release tests are charted, because that is the clock Theseus's target
       runs on (NC edge to USB). XBAB's SR-latch tests (GX Safe) time from the NO edge, about 1.5 ms later in the same press, so
       their 64 µs cannot sit beside a 70 µs NC-release target: a note says what they found. Each panel carries Theseus's
       target bar in blue. The XA25 adds nothing moving either, so the glance is what Theseus wins over it: 72 → 70 µs */
    const P = clk_xbab().filter(p => /NC/.test(p.mode)), pw = 760, gap = 100, px0 = LM + 74, py = 384, ph = 200, top = 500, Y = v => py + ph - ph * v / top;
    legend(t, 0.5, RM, 300, [{ kind: 'hero', label: 'Theseus target' }, { kind: 'ref', label: 'XBAB XA25' }, { kind: 'comp', label: 'OP1 8k v2' }], { align: 'right' });
    rich([{ s: 'Electrical latency, µs', role: 'label', size: 21, color: C.mute }, { s: 'Beagle USB 480 analyzer', role: 'small', size: 22, weight: 600, color: C.faint, gap: 18 }], LM, 300, { alpha: ep(t, 0.5, 0.9) });
    pill(LM + 600, 300, 'claim', ep(t, 0.6, 1.0), { by: 'XBAB' });
    P.forEach((p, i) => {
      const x = px0 + i * (pw + gap), t0 = 0.8 + i * 0.5, a = ep(t, t0, t0 + 0.4), slot = pw / 3;
      text('NC release, GX Speed', x, py - 44, { role: 'label', size: 21, color: C.mute, alpha: a });
      text(p.still ? 'Still' : 'Moving', x, py - 12, { font: 'disp', size: 30, weight: 800, color: p.still ? C.ink2 : C.ink, caps: true, alpha: a });
      barChart(t, { x, y: py, w: pw, h: ph, t0, yr: [0, top], ticks: i ? [] : [0, 100, 200, 300, 400, 500], unit: 'µs', dec: 1, foot: false, labelAt: 'ci', vsize: 28, nsize: 28, barW: 0.46,
        bars: [{ name: 'Theseus', v: CLK_TGT, label: CLK_TGT + ' µs', hero: true }, { name: 'XA25', v: rv(p.xa), ci: p.xa.ci95_us, n: p.xa.n, ref: true }, { name: 'OP1 8k v2', v: rv(p.op), ci: p.op.ci95_us, n: p.op.n }] });
      if (i) for (const v of [100, 200, 300, 400]) line(x, Y(v), x + pw, Y(v), { color: C.hair, w: 1.2, alpha: a * 0.8 });
      const fa = ep(t, t0 + 0.6, t0 + 1.0);
      text('Target', x + slot * 0.5, py + ph + 72, { role: 'label', size: 20, color: C.heroText, align: 'center', alpha: fa });
      [p.xa, p.op].forEach((b, j) => {
        const cx = x + slot * (j + 1.5);
        text('[' + b.ci95_us.map(v => v.toFixed(1)).join(', ') + ']', cx, py + ph + 72, { role: 'small', size: 22, weight: 600, color: C.mute, align: 'center', alpha: fa });
        text('n = ' + fmt3(b.n), cx, py + ph + 100, { role: 'small', size: 22, weight: 600, color: C.mute, align: 'center', alpha: fa });
      });
      if (!p.still) {
        const st = P.find(q => q.still), kd = ep(t, 5.0, 5.5);
        if (st && kd > 0) {
          const cx = x + slot * 2.5, bw2 = slot * 0.46, y0 = Y(rv(st.op)), y1 = Y(rv(p.op));
          G.save(); G.globalAlpha = kd; G.setLineDash([6, 5]); G.strokeStyle = C.bad; G.lineWidth = 2.5; G.strokeRect(cx - bw2 / 2, y0, bw2, Y(0) - y0); G.restore();
          text('+' + (rv(p.op) - rv(st.op)).toFixed(1), cx, (y0 + y1) / 2 + 9, { role: 'num', size: 26, weight: 800, color: C.bad, align: 'center', alpha: kd });
        }
      }
    });
    if (!P.length) placeholderStamp(t, LM, py, RM - LM, ph);
    const sr = clk_xbab().filter(p => !/NC/.test(p.mode)), srM = sr.find(p => !p.still), srS = sr.find(p => p.still), srAdd = srM && srS ? Math.round(rv(srM.op) - rv(srS.op)) : null;
    text('Red dashes: the same click, still. The XA25 moving: no change within its interval.', LM, py + ph + 140, { role: 'small', size: 24, weight: 600, color: C.mute, alpha: ep(t, 5.6, 6.0) });
    text('Not charted: XBAB\'s SR-latch tests (GX Safe) start the clock at NO, about 1.5 ms after NC' + (srAdd != null ? `. Moving, the OP1 adds ${srAdd} µs there too.` : '.'), LM, py + ph + 172, { role: 'small', size: 24, weight: 600, color: C.faint, alpha: ep(t, 6.2, 6.6) });
    /* at a glance: what Theseus wins over the XA25, moving or still (Brock, F18.5: "Tighten it"), the XA25's figure kept beside it */
    { const a = ep(t, 8.2, 8.7, E.snap); demoWindow(LM, 800, 560, 160, a);
      text('Click latency (lower is better)', LM + 32, 838, { role: 'label', size: 19, color: C.mute, alpha: a, maxW: 500 });
      clk_ba(t, LM + 32, 918, { before: '72', after: String(CLK_TGT), unit: 'µs', net: 'Moving or still', netRight: true, size: 76, k: ep(t, 8.4, 9.0), a, hero: true, netSize: 24 }); }
    clk_steps(t, 8.6, LM + 600, 800, RM - LM - 600, CLK_WAIT_STEP);
  }
});

/* ============================== 16. every click number has a method ============================== */
/** the methods chart: groups of rows, each under its head, a divider between groups. A row is a name over its method (two lines,
   in a column of their own, so the stems start after them), a stem from 0 and a dot (Theseus's diamond; the next best yellow
   with ref; a dim group grey and faint), the value at the right. A value past xmax runs to the axis's end behind an arrow.
   (x, y) = the top left, w = the width. groups: [{ head, dim, rows: [{ name, qual, v, hero, ref }] }]; o = { xmax, ticks, t0 } */
function clk_methodsChart(t, x, y, w, groups, o) {
  const lw = 380, vw = 140, x0 = x + lw, pw = w - lw - vw - 30, xm = o.xmax, X = v => x0 + pw * clamp(v / xm), a0 = ep(t, o.t0, o.t0 + 0.5);
  const rows = []; let yy = y + 60;
  groups.forEach((g, gi) => {
    const ka = ep(t, o.t0 + gi * 0.7, o.t0 + gi * 0.7 + 0.4);
    if (gi) line(x, yy - 32, x + w, yy - 32, { color: C.hair, w: 1.5, alpha: ka });
    text(g.head, x, yy, { role: 'label', size: 19, color: g.dim ? C.faint : C.mute, alpha: ka });
    if (!gi) text('Lower is quicker', x + w, yy, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: ka });
    g.rows.forEach((r, i) => rows.push(Object.assign({ y: yy + 40 + i * 60, dim: g.dim, d: gi * 0.7 + i * 0.12 }, r)));
    yy += 40 + (g.rows.length - 1) * 60 + 74;
  });
  const yEnd = rows.length ? rows[rows.length - 1].y + 20 : y + 60;
  for (const v of o.ticks) { line(X(v), y + 30, X(v), yEnd, { color: C.hair, w: 1.2, alpha: a0 }); text(v ? v + ' ms' : '0', X(v), y + 18, { role: 'tick', size: 20, color: C.mute, align: 'center', alpha: a0 }); }
  rows.forEach(r => {
    const a = ep(t, o.t0 + r.d, o.t0 + r.d + 0.35), k = ep(t, o.t0 + r.d + 0.1, o.t0 + r.d + 0.9, E.snap), off = r.v > xm; if (a <= 0.003) return;
    text(r.name, x, r.y - 2, { role: 'small', size: 25, weight: r.hero ? 800 : r.dim ? 560 : 650, color: r.dim ? C.mute : C.ink, alpha: a });
    text(r.qual, x, r.y + 23, { role: 'label', size: 19, color: r.hero ? C.heroText : C.faint, alpha: a });
    const sy = r.y - 10, col = r.hero ? C.hero : r.dim ? C.comp2 : r.ref ? C.ref : (TH ? '#9F9E98' : '#8E8D88'), xe = lerp(X(0), off ? X(xm) + 22 : X(r.v), k);
    if (off) arrow(X(0), sy, xe, sy, { color: col, w: 3, hs: 11, alpha: a });
    else { line(X(0), sy, xe, sy, { color: col, w: r.hero ? 6 : 3, alpha: a, cap: 'round' }); if (r.hero) heroMark(xe, sy, 13, a); else circle(xe, sy, 9, { fill: col, alpha: a }); }
    const vs = r.v.toFixed(3) + ' ms';
    text(countUp(vs, k) || vs, x + w, r.y - 2, { role: 'num', size: 25, weight: r.hero ? 800 : r.dim ? 560 : 650, color: r.hero ? C.heroText : r.dim ? C.faint : C.ink, align: 'right', alpha: a });
  });
}
clk_S({
  id: 'clk_methods', ch: 'click', theme: 'night', title: 'Every click number has a method', settle: 9, ideas: [79],
  src: ['xbab', 'clk_xbabClick', 'vgnClick', 'clk_razerSide'],
  draw: t => {
    header(t, 'Every click number has a method');
    captions(t, [[0.6, 'Makers time their own clicks, each in their own way. Read a number only beside the way it was taken.'], [4.4, 'I will publish Theseus on XBAB\'s analyzer method, with n and the interval: ' + CLK_TGT + ' µs, moving or still, under the XA25\'s 72.']]);
    const [wx, ww] = CLK_G.a, wy = CLK_TOP, wh = CLK_BOT - wy;
    clk_tile(t, 0.3, wx, wy, ww, wh, 'Switch to USB, each maker\'s own test', [{ ev: 'claim', text: 'Maker claims' }]);
    /* rebuilt after the review (item 4): the numbers taken on XBAB's analyzer, Theseus's target among them, above a divider; the
       makers' own claims (method not given) faint under it, so a bare "about 65 µs" never sits in ink under Theseus's row. The
       axis runs 0 to 0.4 ms so 65, 70 and 72 µs are not squeezed together, and "Brand X" runs off it behind an arrow. Each
       label takes two lines, name over method, so no stem runs through one */
    clk_methodsChart(t, wx + 32, wy + 96, ww - 64, [
      { head: 'On XBAB\'s analyzer: NC edge to USB', rows: [{ name: 'Theseus', qual: 'Target, NC release', v: CLK_TGT / 1000, hero: true }, { name: 'XBAB XA25', qual: 'NC release, still', v: 0.07204, ref: true }, { name: 'Endgame Gear OP1 8k v2', qual: 'GX Speed, still', v: 0.32029 }] },
      { head: 'Makers\' own claims, method not given', dim: true, rows: [{ name: 'XBAB XA25', qual: '"About 65 µs"', v: 0.065 }, { name: 'VGN Dragonfly 3 MGT', qual: '"As low as"', v: 0.175 }, { name: 'Razer Viper V4 Pro', qual: 'Side buttons', v: 0.33 }, { name: '"Brand X"', qual: 'Side buttons, per Razer', v: 1.65 }] }
    ], { xmax: 0.4, ticks: [0, 0.1, 0.2, 0.3, 0.4], t0: 0.9 });
    const [cx, cw] = CLK_G.b;
    /* the glance: the XA25's analyzer figure struck, Theseus's target beside it (F14.10, F16.1) */
    { const a = ep(t, 3.6, 4.15, E.snap); demoWindow(cx, wy, cw, 200, a);
      text('Click latency (lower is better)', cx + 32, wy + 44, { role: 'label', size: 19, color: C.mute, alpha: a });
      clk_ba(t, cx + 32, wy + 128, { before: '72.0', after: String(CLK_TGT), unit: 'µs', net: 'Under the XA25\'s 72.0, moving or still', size: 80, k: ep(t, 3.9, 4.5), a, hero: true, netSize: 23 }); }
    clk_gloss(t, 2.4, cx, wy + 240, cw, 'Click latency', 'The time from a press to its report reaching the computer. Where the clock starts changes the number.');
    clk_box(t, 4.8, cx, wy + 480, cw, { label: 'Theseus', value: 'Published', head: 'With its method', body: 'XBAB\'s analyzer method, n and the 95% interval, on every number I print.' });
  }
});

/* ============================== 17. dual rail side buttons (#80), full-size SPDT switches, arms on the switch (#64) ============================== */
/** a side button as Theseus builds it, cut across: a glove over a full-size SPDT switch seen end on. The glove's two walls ride the
   switch's own sides (the two rails), two arms land on its shoulders as the end stop, a nub drives the plunger. The shell holds the
   switch (Brock, F12.4): its wall turns in to a pocket round the switch's back half, with a floor the three legs pass through to
   their wires. No side board. y down, mm, origin on the shell's outer face; travel drawn twice. press 0..1 → travel 0 to 0.5 mm.
   Returns stage points */
function clk_gloveMM(o = {}) {
  const p = clamp(o.press || 0), tr = 0.5 * clamp(p / 0.7), d = 2 * tr, out = { tr };
  const F = (mt, f, h) => Object.assign({ fill: f, ec: edgeCol(mt) }, h ? { hatch: true } : {});
  const bx = 2.9, top = 3.2 + 0.5, bot = top + 6.5, fl = bot + 0.15, fb = fl + 1.1;
  /* the shell: its outer wall either side of the button, turning in to the pocket that holds the switch */
  for (const s of [-1, 1]) solid(() => { G.beginPath(); G.moveTo(s * 8.4, 0); G.lineTo(s * 15, 0); brk(s * 15, 0, 1.4, 0.3 * s); G.lineTo(s * 9.6, 1.4); G.lineTo(s * 9.6, fb - 0.4); G.quadraticCurveTo(s * 9.6, fb, s * 9.2, fb); G.lineTo(0, fb); G.lineTo(0, fl); G.lineTo(s * 4.0, fl); G.lineTo(s * 4.0, bot - 2.6); G.lineTo(s * 3.0, bot - 2.6); G.lineTo(s * 3.0, bot - 1.9); G.lineTo(s * 3.4, bot - 1.9); G.lineTo(s * 3.4, fl - 0.6); G.lineTo(s * 8.4, fl - 0.6); G.lineTo(s * 8.4, 1.4); G.closePath(); }, MT.shell, [Math.min(s * 8.4, s * 15), 0, 6.6, fb], F(MT.shell, CLK_PC.graph(), true));
  /* the three legs through the pocket's floor, each to its wire (no side board) */
  for (const lx of [-1.6, 0, 1.6]) { mmLine([[lx, fb + 0.3], [lx, fb + 0.9], [lx + 1.6 + lx * 0.5, fb + 2.2]], TH ? '#B87333' : '#C98A4E', 1.6); solid(() => { G.beginPath(); G.rect(lx - 0.25, bot - 0.2, 0.5, fb - bot + 0.6); }, MT.tin, [lx - 0.25, bot, 0.5, 1.8], F(MT.tin, '#C9CDD2')); }
  out.pocket = SP(-6.4, fl + 0.6); out.floor = SP(6.2, fb);
  solid(() => pathRR(-bx, top, 2 * bx, bot - top, 0.35), MT.black, [-bx, top, 2 * bx, bot - top], F(MT.black, CLK_PC.body()));
  mmLine([[-2.0, top + 3.2], [1.7, top + 3.0]], inkA(0.28), 1.2); mmLine([[1.7, top + 2.6], [2.2, top + 2.6]], inkA(0.28), 1.2); mmLine([[1.7, top + 3.5], [2.2, top + 3.5]], inkA(0.28), 1.2);
  solid(() => pathRR(-0.75, 2.35 + d, 1.5, top - 2.35 - d + 0.2, 0.25), MT.pom, [-0.75, 2.35, 1.5, 1.4], F(MT.pom, CLK_PC.pom()));
  /* the glove: one outline round the cap, the two rail walls, the two arms and the nub */
  xsave(); xmove(0, d);
  const gl = () => { G.beginPath(); G.moveTo(-7.9, 0.15); G.quadraticCurveTo(0, -0.35, 7.9, 0.15); G.lineTo(7.9, 1.4); G.lineTo(3.75, 1.4); G.lineTo(3.75, 6.9); G.lineTo(2.95, 6.9); G.lineTo(2.95, 1.4);
    G.lineTo(2.45, 1.4); G.lineTo(2.45, 2.7); G.lineTo(1.55, 2.7); G.lineTo(1.55, 1.4); G.lineTo(0.85, 1.4); G.lineTo(0.85, 2.35); G.lineTo(-0.85, 2.35); G.lineTo(-0.85, 1.4);
    G.lineTo(-1.55, 1.4); G.lineTo(-1.55, 2.7); G.lineTo(-2.45, 2.7); G.lineTo(-2.45, 1.4); G.lineTo(-2.95, 1.4); G.lineTo(-2.95, 6.9); G.lineTo(-3.75, 6.9); G.lineTo(-3.75, 1.4); G.lineTo(-7.9, 1.4); G.closePath(); };
  solid(gl, MT.shell, [-7.9, -0.4, 15.8, 7.3], F(MT.shell, CLK_PC.graph(), true));
  out.cap = SP(4.5, -0.1); out.press = SP(5.2, 0.02); out.arm = SP(2.0, 2.7); out.rail = SP(3.35, 5.2);
  xrest();
  /* the two rails: where the glove's walls ride the switch's sides */
  for (const s of [-1, 1]) mmLine([[s * 2.92, top + 0.2], [s * 2.92, 6.9 + d]], C.hero, 2.4);
  out.shoulder = SP(2.0, top); out.sw = SP(-bx, top + 4.5); out.top = top;
  return out;
}
/** the side button that ships today, cut across: a cap on a living hinge at its left end over a mini switch. Pressed past the
   click it bends, and only the switch stops it. press 0..1 */
function clk_hingeMM(o = {}) {
  const p = clamp(o.press || 0), n = 1.2 * clamp(p / 0.6), b = 1.6 * clamp((p - 0.6) / 0.4), out = {}, hx = -8.15, hy = 0.55, th = n / 8.15;
  const F = (mt, f, h) => Object.assign({ fill: f, ec: edgeCol(mt) }, h ? { hatch: true } : {});
  for (const s of [-1, 1]) solid(() => { G.beginPath(); G.moveTo(s * 8.4, 0); G.lineTo(s * 15, 0); brk(s * 15, 0, 1.4, 0.3 * s); G.lineTo(s * 8.4, 1.4); G.closePath(); }, MT.shell, [Math.min(s * 8.4, s * 15), 0, 6.6, 1.4], F(MT.shell, CLK_PC.graph(), true));
  /* the mini switch under the cap's middle, its actuator pushed by the nub */
  solid(() => pathRR(-2.2, 4.0, 4.4, 3.2, 0.3), MT.black, [-2.2, 4.0, 4.4, 3.2], F(MT.black, CLK_PC.body()));
  for (const lx of [-1.2, 1.2]) solid(() => { G.beginPath(); G.rect(lx - 0.22, 7.0, 0.44, 1.6); }, MT.tin, [lx - 0.22, 7.0, 0.44, 1.6], F(MT.tin, '#C9CDD2'));
  const act = Math.min(1.0, n);
  solid(() => pathRR(-0.5, 2.6 + act, 1.0, 4.0 - 2.6 - act + 0.15, 0.2), MT.pom, [-0.5, 2.6, 1, 1.4], F(MT.pom, CLK_PC.pom()));
  /* the cap: turned about its hinge and bent beyond the nub */
  const Yd = x => (x - hx) * th + (x > 0 ? b * (x / 7.9) * (x / 7.9) : 0), yt = x => 0.15 - 0.25 * (1 - (x / 7.9) * (x / 7.9)), top = [], bot = [];
  for (let x = -7.9; x <= 7.9 + 1e-9; x += 0.25) { top.push([x, yt(x) + Yd(x)]); bot.push([x, 1.4 + Yd(x)]); }
  const fl = F(MT.shell, CLK_PC.graph(), true);
  solid(() => { G.beginPath(); G.rect(-8.45, 0.35, 0.6, 0.5); }, MT.shell, [-8.45, 0.35, 0.6, 0.5], fl);
  solid(() => { G.beginPath(); G.moveTo(-0.85, 1.3 + Yd(-0.85)); G.lineTo(0.85, 1.3 + Yd(0.85)); G.lineTo(0.85, 2.6 + Yd(0.85)); G.lineTo(-0.85, 2.6 + Yd(-0.85)); G.closePath(); }, MT.shell, [-0.85, 1.3, 1.7, 1.3], fl);
  solid(() => { G.beginPath(); top.forEach((q, i) => i ? G.lineTo(q[0], q[1]) : G.moveTo(q[0], q[1])); for (let i = bot.length - 1; i >= 0; i--) G.lineTo(bot[i][0], bot[i][1]); G.closePath(); }, MT.shell, [-7.9, -0.4, 15.8, 4], fl);
  const at = (arr, x) => arr[Math.round((x + 7.9) / 0.25)];
  out.press = SP(6.0, at(top, 6.0)[1] + 0.02); out.hinge = SP(hx, hy); out.bend = SP(6.6, at(bot, 6.6)[1]); out.sw = SP(0, 5.6); out.over = n >= 1.0;
  return out;
}
clk_S({
  id: 'sidebuttons', ch: 'click', theme: 'paper', title: 'Dual rail side buttons', settle: 10, ideas: [80, 64], three: ['shell'],
  src: ['clk_gt01', 'omronD2f', 'clk_brock'],
  sfx: [[3.0, 'click'], [6.6, 'click']],
  draw: t => {
    header(t, 'Dual rail side buttons');
    captions(t, [[0.6, 'A side button on a hinge bends, and nothing stops it but the switch it presses: it goes in too far.'], [3.6, 'Mine is a glove over a full-size SPDT switch. It rides the switch\'s own two sides: dual rails, straight in.'], [6.8, 'Two arms land on the switch\'s shoulders just past the click: a hard stop, no flex. No mouse ships SPDT side buttons.']]);
    const wy = CLK_TOP, h = 440, w = 840, pr = ep(t, 2.4, 3.6, E.io3) - ep(t, 4.8, 5.4, E.io3) + ep(t, 6.0, 7.2, E.io3);
    [false, true].forEach((glove, i) => {
      const x = LM + i * (w + 80), t0 = 0.3 + i * 0.25;
      demoWindow(x, wy, w, h, tileA(t, t0, 0), { hero: glove });
      cardHead(t, t0 + 0.3, x, wy, w, glove ? 'Theseus: a dual rail glove, full-size SPDT' : 'Shipping today: a hinge on a mini switch', []);
      /* 3D (F17.3): the full-size SPDT switch in its glove, held by the shell (sideSw x-rays the shell, hides the core and turns the
         glove Theseus's colour; side0 presses the front button), in place of the section. 2D keeps the section */
      const in3 = glove && !V2D.on;
      let o;
      if (in3) {
        const box = [x + 8, wy + 64, 480, h - 72], st = { view: [0.15, 0.4, 1], target: [24, 19.5, 14], zoom: 6, sideSw: 1, side0: pr };
        const drawn = view3D('shell', t, box[0], box[1], box[2], box[3], st, { alpha: ep(t, t0 + 0.4, t0 + 0.9) });
        const at = (re, f) => clk_at3('shell', st, box, drawn, re, f), fl = at(/^sideFront\/.*gloveRail$/, [0, 0.5, 0.5]);
        /* the pocket the shell holds the switch in: read off the render, beside the rails' inner end */
        o = { press: at(/^sideFront\/sideFront$/, [1, 0.5, 0.5]), rail: at(/^sideFront\/.*gloveRail$/, [0.5, 0.5, 0.5]), arm: at(/^sideFront\/.*gloveArm$/, [0.5, 0.5, 0.5]), floor: fl ? [fl[0] - 46, fl[1] + 91] : null, tr: 0.5 * clamp(pr / 0.7) };
      } else o = part(x + 400, wy + 122, 21, () => glove ? clk_gloveMM({ press: pr }) : clk_hingeMM({ press: pr }), { alpha: ep(t, t0 + 0.4, t0 + 0.9) });
      const pp = o.press;
      if (pp) { const ka = ep(t, 1.6, 2.3, E.cam), st = [pp[0] + 90, pp[1] - 100]; cursorPtr(lerp(st[0], pp[0], ka), lerp(st[1], pp[1], ka), { a: ep(t, 1.4, 1.8), press: prog(t, 2.4, 2.9) > 0 && prog(t, 2.4, 2.9) < 1 ? prog(t, 2.4, 2.9) : 0 }); }
      if (glove) {
        const trm = o.tr || 0, k = ep(t, 3.6, 4.0);
        const cx3 = x + 508;
        if (o.rail) callout(t, 4.0, o.rail, 'The rails: the switch\'s own sides', { to: in3 ? [cx3, wy + 180] : [x + 618, wy + 250], side: 'r', color: C.hero, tcolor: C.ink, maxW: in3 ? 270 : 196, prose: true });
        if (o.arm) callout(t, 7.0, o.arm, 'Arms on the shoulders: the stop', { to: in3 ? [cx3, wy + 268] : [x + 186, wy + 236], side: in3 ? 'r' : 'l', color: C.hero, tcolor: C.ink, maxW: in3 ? 270 : 150, prose: true });
        if (o.floor) callout(t, 5.0, o.floor, 'Held by the shell: no side board', { to: in3 ? [cx3, wy + 356] : [x + 618, wy + 360], side: 'r', color: in3 ? C.hero : C.ink2, tcolor: C.ink, maxW: in3 ? 270 : 196, prose: true });
        const said = trm >= 0.5 - 1e-6 ? 'held by the arms' : trm >= 0.35 ? 'clicked' : '';
        if (in3) { rich([{ s: 'Travel', role: 'label', size: 21, color: C.mute }, { s: trm.toFixed(2) + ' mm', role: 'num', size: 28, weight: 800, color: C.heroText, gap: 14 }], cx3 + 12, wy + 100, { alpha: k }); if (said) text(said[0].toUpperCase() + said.slice(1), cx3 + 12, wy + 132, { role: 'small', size: 22, weight: 600, color: C.mute, alpha: k }); }
        else rich([{ s: 'Travel', role: 'label', size: 21, color: C.mute }, { s: trm.toFixed(2) + ' mm', role: 'num', size: 28, weight: 800, color: C.heroText, gap: 14 }, { s: said, role: 'small', size: 22, weight: 600, color: C.mute, gap: 14 }], x + w - 32, wy + 92, { alpha: k, align: 'right' });
      } else {
        callout(t, 3.2, o.bend, 'It bends past the click', { to: [x + 570, wy + 300], side: 'r', color: C.bad, tcolor: C.ink, maxW: 240, prose: true });
        callout(t, 1.4, o.hinge, 'Hinge', { to: [x + 150, wy + 220], side: 'l', color: C.ink2, tcolor: C.ink2 });
        if (o.over) circle(o.sw[0], o.sw[1], 30 + 4 * Math.sin(t * 8), { color: C.bad, w: 2.5 });
        text('Only the switch stops it', x + 32, wy + h - 36, { role: 'small', size: 24, weight: 700, color: C.bad, alpha: ep(t, 3.4, 3.8) });
      }
    });
    text((V2D.on ? 'Travel drawn twice.' : 'Hinge travel drawn twice.') + ' The shell holds each switch in a pocket, its legs wired to the one board. The arms rest on the switch, as on Hitscan\'s Hyperlight (#64).', LM, 994, { role: 'foot', color: C.faint, alpha: ep(t, 7.6, 8.0) });
    /* what it buys, in three numbers */
    const by = 760, bw = 560, bh = 200;
    statTile(t, 7.4, [LM, by, bw, bh], { pre: 'Mice that ship SPDT side buttons', value: '0', label: 'Theseus is the first', hero: true });
    statTile(t, 7.6, [LM + bw + 40, by, bw, bh], { pre: 'One rail design, four switches', value: '2×', label: 'The practice at its tolerance', quiet: true });
    statTile(t, 7.8, [LM + 2 * (bw + 40), by, bw, bh], { pre: 'Four full-size switches, and still', value: THESEUS.mass.toFixed(2), unit: 'g', label: 'Nothing traded for the weight', hero: true });
  }
});
