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
  const r = rich([{ s: num, role: 'd1', size: o.size || 72, color: o.color || C.ink, tnum: true }, unit ? { s: unit, font: 'mono', size: Math.max(24, Math.round((o.size || 72) * 0.34)), weight: 600, color: o.ucolor || C.mute, gap: 10 } : null], x, y, { alpha: a, align: o.align });
  return r.w;
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

/* ---------- step further: what ships today, and the step Theseus takes past it ----------
   rows: [{ n: '#3', who: 'G-Wolves', ev: 'claim', evText: 'Community', now: '...', step: '...' }]. Each row types the shipping
   version, an arrow runs across, then the Theseus step wipes in on an edge in the Theseus colour. clk_stepsH gives the strip's height. */
const CLK_ST = { hh: 46, lh: 33, pad: 22 };
function clk_stepLines(rows, w) {
  const lw = Math.round(w * 0.45), rwid = w - lw - 96 - 46;
  return rows.map(r => Math.max(
    para([{ s: r.who + '. ', role: 'small', weight: 700 }, { s: r.now, role: 'small' }], 0, 0, { maxW: lw - 92, lh: CLK_ST.lh, alpha: 0 }).lines,
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
    text(r.n, x + 24, yy + 33, { role: 'label', size: 21, color: C.faint, alpha: ka2 });
    evDot(x + 84, yy + 26, r.ev, 6, ka2);
    para([{ s: r.who + '. ', role: 'small', weight: 700, color: C.ink }, { s: r.now, role: 'small', color: C.ink2 }], x + 102, yy + 33, { maxW: lw - 92, lh: CLK_ST.lh, t, t0: tr, cps: 150, alpha: ka2 });
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
      list: [['#2 #78', 'Direct Drive Actuation, on a mechanical switch'], ['#17 #18', 'Straight rear cutouts'], ['#49 #50 #59', 'A bridge tensioner'], ['#3 #28', 'Dual rail main clicks, on POM pads'],
        ['#46–48', 'Flat front cutouts, flush walls'], ['#14', 'Switches that swap without solder'], ['#79', 'SPDT: single pole, double throw'], ['#80 #64', 'Dual rail side buttons, on full-size SPDT']]
    });
    /* the part in the iris: the GT01, pressing */
    const pr = clk_curve(cyc(t, 2.4, 2.6)), a = ep(t, 1.0, 1.8);
    clk_v3('gt01', t, 1380 - 330, 580 - 250, 660, 470, { press: pr, view: 'left', yaw: 0.42, pitch: -0.08, zoom: 1.55 }, { alpha: a });
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
    callout(t, 1.2, o.rc, 'The trigger turns about this bend', { to: [wx + 70, wy + wh - 250], side: 'r', elbow: o.rc[0], color: C.ink2, tcolor: C.ink2, maxW: 260, prose: true });
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
      line(P0[0] - ax[0] * 90, P0[1] - ax[1] * 90, P0[0] + ax[0] * 240, P0[1] + ax[1] * 240, { color: A, w: 1.5, dash: [5, 5], alpha: kb });
      arrow(P0[0], P0[1], P1[0], P1[1], { color: C.ink, w: 3.5, hs: 15, alpha: kb });
      arrow(P0[0], P0[1], Pa[0], Pa[1], { color: C.hero, w: 4, hs: 15, alpha: kb });
      if (Math.hypot(P1[0] - Pa[0], P1[1] - Pa[1]) > 4) arrow(Pa[0], Pa[1], P1[0], P1[1], { color: C.bad, w: 3.5, hs: 12, alpha: kb });
      G.restore();
      text('At the plunger', bx, by - br - 16, { role: 'label', size: 21, color: C.mute, align: 'center', alpha: kb });
    }
    /* the numbers, live as the switch turns */
    const deg = mis * 180 / Math.PI, k3 = ep(t, 3.0, 3.5);
    [['Off-axis angle', deg.toFixed(1) + '°', C.ink], ['Along the axis', (Math.cos(mis) * 100).toFixed(1) + '%', C.hero], ['Sideways, sin θ', (Math.sin(mis) * 100).toFixed(1) + '%', C.bad]].forEach(([l, v, col], i) => {
      const x = wx + 40 + i * 320, kk = ep(t, 3.0 + i * 0.15, 3.5 + i * 0.15);
      G.save(); G.translate(0, (1 - E.out3(kk)) * 16); clk_big(t, x, wy + wh - 46, l, v, null, { size: 60, color: col, alpha: kk }); G.restore();
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
    captions(t, [[0.6, 'I put the angle in the switch itself: the GT01 sits on its own 20° wedge, turned to the trigger\'s arc.'], [4.0, 'So the board stays one flat piece, and the angle can follow the measured arc. I\'ll publish both.']]);
    const lx = LM, lw = 640, vx = 760, vw = RM - vx, wy = CLK_TOP, wh = CLK_BOT - wy;
    /* the shot, big, on the right: the right main switch, pressing, on its wedge */
    clk_tile(t, 0.3, vx, wy, vw, wh, 'Theseus, right main switch, side on', ['claim', 'proposal']);
    const pr = clk_curve(cyc(t, 2.0, 3)), push = ep(t, 0.6, 3.2, E.cam);
    clk_v3('pcb', t, vx + 10, wy + 70, vw - 20, wh - 140, { pressR: pr, view: 'left', yaw: 0.5 + 0.06 * (1 - push), pitch: -0.12, zoom: in2D(lerp(4.4, 5.2, push), lerp(3.6, 4.2, push)), target: in2D([-16, 9.5, 37.5], [-16, 9.5, 36.7]), hide2d: /\/WHEEL\//, hi2d: { re: /\/SW2\//, color: C.hero } }, { alpha: ep(t, 0.9, 1.5) });
    text('Representative model: Gateron has published no datasheet', vx + 28, wy + wh - 26, { role: 'label', size: 19, color: C.faint, alpha: ep(t, 1.6, 2.0) });
    /* the left column: the step past what ships, and the one board */
    clk_stack(wy, [
      y => clk_box(t, 1.4, lx, y, lw, { label: 'Theseus', value: 'One step further', head: 'The wedge is in the switch', body: 'The board stays one flat piece. The angle follows the measured arc, and I publish it.' }),
      y => { statTile(t, 2.6, [lx, y, lw, 200], { quiet: true, pre: 'One board, about', value: String(THESEUS.pcb), unit: 'g', label: 'No second board to tilt the switch' }); return { h: 200 }; },
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
/** the Gateron GT01 as it is built: a standard SPDT snap-action microswitch (its internals from 03-parts swMM, cover clear:
   plunger, leaf spring and its tongue, the moving contact, COM, NO and NC) in a bottom housing that tilts it 20° to the
   trigger's arc, the housing's own three legs into the one flat board. y down, mm, origin on the board's top under the
   housing's middle. o = { press, state, ang (deg), hold }. Returns the switch's stage points plus housing, wedge, legs */
function clk_gt01MM(o = {}) {
  const ang = (o.ang == null ? 20 : o.ang) * Math.PI / 180, L = SWG.L, H0 = 1.5, xl = -L * Math.cos(ang) / 2, lc = L * Math.cos(ang), ls = L * Math.sin(ang);
  const flat = (mt, f) => ({ fill: f, ec: edgeCol(mt) });
  pcbSec(-10, 10, 0, 1.2, { holes: [xl + 1.6, 0, -xl - 1.6] });
  /* the switch, tilted on the housing's sloped top about its bottom-left corner */
  xsave(); xmove(xl, -H0); xturn(-ang);
  const out = swMM({ press: o.press || 0, state: o.state, clear: true, glow: false });
  /* the cover's two mounting holes, seen through it */
  for (const ex of [2.4, 10.4]) { G.beginPath(); G.arc(ex, -4.2, 0.55, 0, TAU); G.strokeStyle = inkA(0.32); G.lineWidth = lw(1.1); G.setLineDash([lw(4), lw(3)]); G.stroke(); G.setLineDash([]); }
  out.hole = SP(10.4, -4.2);
  xrest();
  /* the bottom housing: a wedge from the board to the switch's base; it hides the switch's own legs */
  const wedge = () => { G.beginPath(); G.moveTo(xl - 0.7, 0); G.lineTo(xl + lc + 0.7, 0); G.lineTo(xl + lc + 0.7, -H0 - ls + 0.25); G.lineTo(xl + lc, -H0 - ls); G.lineTo(xl, -H0); G.lineTo(xl - 0.7, -H0 + 0.25); G.closePath(); };
  solid(wedge, MT.black, [xl - 0.7, -H0 - ls, lc + 1.4, H0 + ls], flat(MT.black, TH ? '#2B2C31' : '#26272C'));
  /* the switch's three legs, hidden in the housing, and the housing's three legs out of its foot into the board */
  for (const px of SWG.pins) { const a0 = rotAbout([xl + px, -H0], [xl, -H0], -ang), a1 = rotAbout([xl + px, -H0 + 1.0], [xl, -H0], -ang); mmLine([a0, a1], inkA(0.35), 1.2, { dash: [4, 3] }); }
  for (const px of [xl + 1.6, 0, -xl - 1.6]) solid(() => { G.beginPath(); G.rect(px - 0.26, -0.2, 0.52, 2.6); }, MT.tin, [px - 0.26, -0.2, 0.52, 2.6], flat(MT.tin, '#C9CDD2'));
  out.housing = SP(xl + lc * 0.62, -H0 * 0.4 - ls * 0.3); out.wedge = SP(xl + lc, -H0 - ls * 0.5); out.foot = SP(0, 0.6); out.ang = ang;
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
    const c = cyc(t, 2.0, 2.6), sw = clk_swc(t, 2.0, 2.6), push = ep(t, 0.4, 6.0, E.cam), s = lerp(27, 31, push);
    const o = part(wx + 400, wy + 540 + lerp(10, 0, push), s, () => clk_gt01MM({ press: sw.pr, state: sw.state }), { alpha: ep(t, 0.6, 1.2) });
    if (o.contact && sw.c >= 0) { const ts = sw.c * 2.6, n = Math.floor((t - 2.0) / 2.6); clk_spark(o.contact, ts - CLK_SNAP.no * 2.6, C.hero, 0.9, 11 + n); clk_spark(o.contact, ts - CLK_SNAP.nc * 2.6, C.ink2, 0.6, 53 + n); }
    /* the parts, named, in one column on the right, in the order they sit top to bottom: one pole, two throws */
    if (o.plunger) {
      const lab = [['Plunger', o.plunger], ['NC, closed at rest', o.nc], ['Moving contact: the pole', o.contact], ['Leaf spring', o.leaf], ['NO, closed when pressed', o.no], ['COM', o.com], ['Bottom housing, 20°', o.housing]]
        .sort((p, q) => p[1][1] - q[1][1]);
      let ly = wy + 110;
      lab.forEach(([l, p], i) => { ly = Math.max(ly, Math.min(p[1], wy + wh - 150 - (lab.length - 1 - i) * 62)); callout(t, 1.4 + i * 0.18, p, l, { to: [wx + 770, ly], side: 'r', elbow: wx + 720, color: C.ink2, tcolor: C.ink, maxW: 240, prose: true }); ly += 62; });
    }
    clk_lamp(wx + 48, wy + wh - 92, 'NC', sw.state === 'nc', C.ink, ep(t, 1.8, 2.2)); clk_lamp(wx + 168, wy + wh - 92, 'NO', sw.state === 'no', C.hero, ep(t, 1.8, 2.2));
    text('Drawn from a standard microswitch: Gateron has published no datasheet', wx + 32, wy + wh - 36, { role: 'small', size: 22, color: C.faint, alpha: ep(t, 1.6, 2.0) });
    /* right: idle current, the word, the source */
    const [cx, cw] = CLK_G.b;
    clk_stack(wy, [
      y => {
        const h = 200, a = ep(t, 4.6, 5.1);
        clk_tile(t, 0.5, cx, y, cw, h, 'Idle current, per main switch', ['derived']);
        clk_big(t, cx + 32, y + 158, null, '0', 'mA', { size: 76, color: C.hero, alpha: a });
        text('GT01, mechanical', cx + 32, y + 188, { role: 'small', size: 22, color: C.mute, alpha: a });
        clk_big(t, cx + cw / 2 + 20, y + 158, null, '0.15', 'mA', { size: 76, color: C.ink2, alpha: ep(t, 4.9, 5.4) });
        text('Optical, at Omron\'s test pulse', cx + cw / 2 + 20, y + 188, { role: 'small', size: 22, color: C.mute, alpha: ep(t, 4.9, 5.4) });
        return { h };
      },
      y => clk_gloss(t, 5.2, cx, y, cw, 'Optical switch', 'An LED shines across a gap the plunger blocks. It needs current whenever the mouse is listening.'),
      y => clk_src(t, 5.8, cx, y, cw, 'Omron D2FP datasheet', 'The LED is tested at 5 mA in 30 µs pulses every 1 ms: 0.15 mA a switch, 18% of a PAW3395\'s 1.7 mA for two.')
    ]);
  }
});

/* ============================== 04. operating force and rated life ============================== */
clk_S({
  id: 'clk_switch2', ch: 'click', theme: 'night', title: 'Operating force and rated life', settle: 9, ideas: [78],
  src: ['clk_gt01', 'omronD2f', 'clk_d2fp', 'clk_elo', 'clk_brock'],
  draw: t => {
    header(t, 'Operating force and rated life');
    captions(t, [[0.6, 'Against the switches in today\'s flagships, the GT01 is lighter than both Omrons.'], [3.6, 'And its maker rates it for 100 million clicks. Every life on this slide is the maker\'s own figure.']]);
    const wy = CLK_TOP, gap = 80, w = 840, h = 400, x2 = LM + w + gap;
    /* operating force: ranges where the maker gives a tolerance */
    const hy = clk_tile(t, 0.3, LM, wy, w, h, 'Operating force, gf', ['claim', 'datasheet']);
    const F = [
      { name: 'Gateron GT01', qual: 'Theseus', lo: 50, hi: 60, mid: 55, txt: '55 ± 5 gf', ev: 'claim', hero: true },
      { name: 'Omron D2FP, optical', qual: 'Sora V2', lo: 44.9, hi: 75.5, mid: 60.2, txt: '0.59 ± 0.15 N', ev: 'datasheet' },
      { name: 'Logitech GPX2', qual: 'my notes', mid: 70, txt: '≈ 70 gf', ev: 'claim', ring: true },
      { name: 'Omron D2F-01F', qual: 'mechanical', hi: 75.5, txt: '0.74 N max', ev: 'datasheet', max: true }
    ];
    const fx0 = LM + 360, fw = w - 360 - 200, FX = v => fx0 + fw * v / 80, fy0 = hy + 64, rh = 68;
    for (const v of [0, 20, 40, 60, 80]) { const a = ep(t, 0.8, 1.2); line(FX(v), fy0 - 30, FX(v), fy0 + 4 * rh - 40, { color: C.hair, w: 1.2, alpha: a }); text(String(v), FX(v), fy0 + 4 * rh - 6, { role: 'tick', color: C.mute, align: 'center', alpha: a }); }
    F.forEach((r, i) => {
      const yy = fy0 + i * rh, k = ep(t, 1.0 + i * 0.2, 1.7 + i * 0.2, E.snap), a = ep(t, 0.9 + i * 0.2, 1.2 + i * 0.2);
      evDot(LM + 34, yy - 8, r.ev, 6, a);
      text(r.name, LM + 52, yy, { role: 'small', size: 25, weight: r.hero ? 800 : 600, color: C.ink, alpha: a });
      text(r.qual, LM + 52, yy + 28, { role: 'label', size: 19, color: r.hero ? C.heroText : C.faint, alpha: a });
      const col = r.hero ? C.hero : C.comp;
      if (r.max) { G.save(); G.globalAlpha = a; G.setLineDash([6, 5]); G.strokeStyle = C.comp; G.lineWidth = 2; G.strokeRect(FX(0), yy - 15, (FX(r.hi) - FX(0)) * k, 14); G.restore(); line(FX(r.hi), yy - 21, FX(r.hi), yy + 5, { color: C.ink2, w: 2.5, alpha: a * k }); }
      else if (r.lo != null) { const xa = FX(lerp(r.mid, r.lo, k)), xb = FX(lerp(r.mid, r.hi, k)); rr(xa, yy - 15, Math.max(4, xb - xa), 14, 7, col, null, 1.5, a); line(FX(r.mid), yy - 21, FX(r.mid), yy + 5, { color: r.hero ? C.ink : C.ink2, w: 2.5, alpha: a }); }
      else { circle(FX(r.mid), yy - 8, 8 * k, { fill: C.panel, alpha: a }); circle(FX(r.mid), yy - 8, 8 * k, { color: C.comp, w: 3, alpha: a }); }
      text(r.txt, LM + w - 26, yy, { role: 'num', size: 24, weight: r.hero ? 800 : 600, color: r.hero ? C.heroText : C.ink, align: 'right', alpha: a });
    });
    /* rated life (maker figures) */
    const hy2 = clk_tile(t, 0.5, x2, wy, w, h, 'Rated life, million clicks', ['claim']);
    lollipop(t, { x: x2 + 26, y: hy2 + 80, w: w - 52, t0: 3.6, rows: clk_life(), xr: [0, 180], ticks: [0, 50, 100, 150], tfmt: v => v + ' M', fmt: v => v + ' M', labelW: 400, rowH: 46, valW: 96 });
    /* where the numbers come from */
    const by = wy + h + 40;
    clk_src(t, 5.0, LM, by, w, 'EloShapes', 'Each mouse\'s main switch and the clicks its maker rates it for. Every rating here is the maker\'s own test.');
    clk_box(t, 5.6, x2, by, w, { label: 'Theseus', value: 'Mechanical mains (#78)', head: 'A GT01 on its bottom housing', body: 'Mechanical for the power it saves, SPDT for the speed, pushed straight for the feel.' });
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
    clk_tile(t, 0.3, wx, wy, ww, wh, 'The two tensioners, flat, from above', [{ ev: 'derived', text: 'Derived from a 4.6 mm smile across a 40 mm pair' }]);
    const sm = 1 - ep(t, 3.4, 5.0, E.io3), k18 = ep(t, 6.2, 7.4, E.io3), s = 18, cx = wx + ww / 2, cy = wy + 110 + 16 * s;
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
      callout(t, 5.6, o.P(-10.7 - 5 * (1 - k18), o.edgeY(-10.7) - 10.6 - 1.4), 'Switch plunger', { to: [wx + 110, wy + 120], side: 'r', color: C.ink2, tcolor: C.ink2 });
    }
    /* the readout: how far the bend line leans at the arm's outer end, and what that sends sideways */
    const ang = Math.atan(0.4554 * sm);
    [['Bend lean, end', (ang * 180 / Math.PI).toFixed(1) + '°', C.ink], ['Sideways, sin θ', (Math.sin(ang) * 100).toFixed(1) + '%', sm > 0.02 ? C.bad : C.hero], ['Switch offset', (5 * (1 - k18)).toFixed(1) + ' mm', k18 > 0.98 ? C.hero : C.ink]].forEach(([l, v, c2], i) => {
      const kk = ep(t, 2.6 + i * 0.15, 3.1 + i * 0.15);
      G.save(); G.translate(0, (1 - E.out3(kk)) * 16); clk_big(t, wx + 40 + i * 320, wy + wh - 46, l, v, null, { size: 56, color: c2, alpha: kk }); G.restore();
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
/** the tensioner as a ribbon of its true thickness, bent by the solved frame (feElPts) and coloured by stress (heatCol, never red).
   P maps model mm (y up) to stage px; sc scales the displacements; kh turns the element stress per newton into heat */
function clk_ribbon(r, P, sc, kh, o = {}) {
  const m = r.model, n = m.nStrip, pts = [];
  for (let e = 0; e < n; e++) { const q = feElPts(r, e, sc, 3), x0 = m.nodes[m.els[e].i][0], x1 = m.nodes[m.els[e].j][0]; q.forEach((p, j) => { if (e && !j) return; pts.push({ p, e, x: lerp(x0, x1, j / 3) }); }); }
  const top = [], bot = [];
  pts.forEach((q, i) => {
    const p0 = pts[Math.max(0, i - 1)].p, p1 = pts[Math.min(pts.length - 1, i + 1)].p, l = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) || 1;
    const nx = -(p1[1] - p0[1]) / l, ny = (p1[0] - p0[0]) / l, h = clk_tenH(m.kind, q.x, m.P) / 2;
    top.push(P([q.p[0] + nx * h, q.p[1] + ny * h])); bot.push(P([q.p[0] - nx * h, q.p[1] - ny * h]));
  });
  G.save(); G.globalAlpha = o.alpha == null ? 1 : o.alpha;
  for (let i = 0; i < pts.length - 1; i++) {
    const col = heatCol(r.sig[pts[i].e] * kh);
    G.beginPath(); G.moveTo(top[i][0], top[i][1]); G.lineTo(top[i + 1][0], top[i + 1][1]); G.lineTo(bot[i + 1][0], bot[i + 1][1]); G.lineTo(bot[i][0], bot[i][1]); G.closePath();
    G.fillStyle = col; G.fill(); G.strokeStyle = col; G.lineWidth = 1; G.stroke();
  }
  G.beginPath(); top.forEach((p, i) => i ? G.lineTo(p[0], p[1]) : G.moveTo(p[0], p[1])); for (let i = bot.length - 1; i >= 0; i--) G.lineTo(bot[i][0], bot[i][1]); G.closePath();
  G.strokeStyle = o.edge || inkA(0.55); G.lineWidth = 1.5; G.lineJoin = 'round'; G.stroke();
  G.restore();
  return { top, bot };
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
  /* the clamp: the boss and the plate's clamped end, the screw head under them */
  clk_mbox(P, -7.5, 0.4, 0, 2.6, 0.35, CLK_PC.graph());
  clk_mbox(P, -7.5, -0.4, 0, 0.4, 0.05, CLK_PC.light(), { edge: inkA(0.3) });
  clk_mbox(P, -5.0, -0.4, -1.4, -1.5, 0.3, CLK_PC.steel(), { edge: inkA(0.4) });
  const s1 = P([-4.0, -0.4]), s2 = P([-2.4, 2.0]);
  G.setLineDash([5, 4]); G.strokeStyle = inkA(0.35); G.lineWidth = 1.2; G.strokeRect(s1[0], s2[1], s2[0] - s1[0], s1[1] - s2[1]); G.setLineDash([]);
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
        clk_ribbon(R.r, P, sc, R.F / sref, { alpha: ka });
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
          text('Bend along the tensioner', x0 - 18, base - 8, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: kk });
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
      clk_big(t, xr, cy + 4, null, (R.F * CLK_GF).toFixed(1), 'gf', { size: 76, color: R.hero ? C.hero : C.ink, alpha: kr });
      text('Force at the fingertip', xr, cy + 40, { role: 'label', size: 19, color: C.faint, alpha: kr });
      const by = cy + 70, bw = 330, kh = ep(t, TT.kap, TT.kap + 0.6);
      rr(xr, by, bw, 10, 5, C.track, null, 0, kr * (1 - kh)); rr(xr, by, Math.max(10, bw * clamp(tr / CLK_TN.pre)), 10, 5, clicked ? (R.hero ? C.hero : C.ink) : C.comp, null, 0, kr * (1 - kh));
      text(tr.toFixed(2) + ' of 0.35 mm to the click', xr, by + 40, { role: 'small', size: 25, color: C.mute, alpha: kr * (1 - kh) });
      text('Half the bend in ' + R.c.half.len.toFixed(1) + ' mm', xr, by + 14, { role: 'small', size: 25, weight: 700, color: R.hero ? C.heroText : C.ink, alpha: kh });
      text(`Peak ${R.c.sig.toFixed(1)} MPa, ${R.hero ? 'at the crown' : 'at the screw'}`, xr, by + 48, { role: 'small', size: 25, color: C.mute, alpha: kh });
      G.restore();
    });
    /* the heat scale, and the model in one line */
    const lx = X0 + XW - 300, ly = wy + 40, kl = ep(t, 1.2, 1.6);
    text('Stress', lx, ly + 6, { role: 'label', size: 19, color: C.faint, alpha: kl });
    for (let i = 0; i < 40; i++) rect(lx + 90 + i * 4, ly - 6, 4.5, 12, { fill: heatCol(i / 39), alpha: kl });
    text('low', lx + 90, ly + 32, { role: 'label', size: 19, color: C.faint, alpha: kl }); text('high', lx + 250, ly + 32, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: kl });
    pill(RM - 24 - pillW('derived'), ly + 6, 'derived', kl);
    text(`2D frame model, ${SIM_MAT.ppcf.name} at ${(SIM_MAT.ppcf.E / 1000).toFixed(1)} GPa: tensioner 10 mm wide over an 8 mm span, pressed 40 mm out, plunger at 30 mm. Motion drawn ${CLK_TT.ex}×.`, LM, 994, { role: 'foot', color: C.faint, alpha: ep(t, 1.0, 1.6) });
  }
});

/* ============================== 07. why the bridge matters on a stiff trigger: PP-C-20A against ABS ============================== */
clk_S({
  id: 'clk_tenmat', ch: 'click', theme: 'paper', title: 'A stiff trigger with a light click', settle: 9, ideas: [50, 49, 59],
  src: [SIM_MAT.ppcf.src, SIM_MAT.abs.src, 'clk_gt01', 'clk_brock'],
  draw: t => {
    const cA = clk_ten('flat', 'abs').clk, cP = clk_ten('flat', 'ppcf').clk, cB = clk_ten('bridge', 'ppcf').clk, ratio = SIM_MAT.ppcf.E / SIM_MAT.abs.E;
    header(t, 'A stiff trigger with a light click');
    captions(t, [[0.6, 'I want a stiff trigger: it has to be strong on its own, or it flexes into post-travel.'], [2.8, `But ${SIM_MAT.ppcf.name} is ${ratio.toFixed(1)} times as stiff as ABS, so the same flat plane clicks ${ratio.toFixed(1)} times as hard.`], [5.4, `The bridge brings it back: a stiff trigger, and a click ${(cB.gf - cA.gf).toFixed(1)} gf from an ABS one.`]]);
    const [wx, ww] = CLK_G.a, wy = CLK_TOP, ch = 440;
    clk_tile(t, 0.3, wx, wy, ww, ch, 'Tensioner force against travel at the plunger', ['derived']);
    /* the two switches the pointer flips: material, then tensioner */
    const t1 = 2.9, t2 = 5.3, mat = t < t1 ? 'ABS' : SIM_MAT.ppcf.name, ten = t < t2 ? 'Flat plane' : 'Bridge', ty = wy + 104, ka = ep(t, 0.8, 1.2);
    const w1 = ltagW('Material', mat, { size: 20 }), w1max = ltagW('Material', SIM_MAT.ppcf.name, { size: 20 });
    ltag(wx + 26, ty, 'Material', mat, { a: ka, size: 20, solid: t < t1 ? C.second : C.ink2, on: C.bg, color: C.mute });
    ltag(wx + 26 + w1max + 24, ty, 'Tensioner', ten, { a: ka, size: 20, solid: t < t2 ? C.ink2 : C.heroChip, on: t < t2 ? C.bg : C.onHero, color: C.mute });
    const p1 = [wx + 26 + w1 * 0.75, ty - 4], p2 = [wx + 26 + w1max + 24 + ltagW('Tensioner', ten, { size: 20 }) * 0.8, ty - 4];
    cursorAt(t, [[1.8, [p1[0] + 140, p1[1] + 120]], [2.6, p1], [4.6, p1], [5.1, p2], [9, p2]], [t1, t2], { a: ep(t, 1.6, 2.0) });
    const m = axes(t, { x: wx + 110, y: wy + 160, w: ww - 330, h: 200, xr: [0, 0.5], yr: [0, 30], xticks: [0, 0.1, 0.2, 0.3, 0.4, 0.5], yticks: [0, 10, 20, 30], xfmt: v => v.toFixed(1), yfmt: v => v + ' gf', xlabel: 'Travel at the plunger, mm', t0: 0.6 });
    const slope = c => c.gf / CLK_TN.pre, kx = 0.35, lineTo = (g, col, w, a, dash) => { const x1 = Math.min(0.5, 30 / g); series(m, [[0, 0], [x1, g * x1]], { color: col, w, alpha: a, dash }); };
    /* the click: the GT01's 0.35 mm pre-travel */
    const kv = ep(t, 1.0, 1.4); line(m.X(kx), m.Y(0), m.X(kx), m.Y(30) - 6, { color: C.ink2, w: 1.5, dash: [6, 5], alpha: kv });
    text('The GT01 clicks, 0.35 mm', m.X(kx) + 10, m.Y(30) + 4, { role: 'label', size: 19, color: C.mute, alpha: kv });
    /* the ghosts of the states the pointer left behind, then the live line */
    const gA = slope(cA), gP = slope(cP), gB = slope(cB), k1 = ep(t, t1 + 0.1, t1 + 0.8, E.snap), k2 = ep(t, t2 + 0.1, t2 + 0.8, E.snap);
    if (t > t1) lineTo(gA, C.second, 3, ep(t, t1, t1 + 0.4));
    if (t > t2) lineTo(gP, C.bad, 3, ep(t, t2, t2 + 0.4));
    const gL = t < t2 ? lerp(gA, gP, k1) : lerp(gP, gB, k2), colL = t < t1 ? C.second : t < t2 ? C.bad : C.hero;
    lineTo(gL, colL, 5, ep(t, 0.9, 1.5));
    /* the values at the click */
    const dot = (g, col, lab, a, below) => { if (a <= 0.003) return; const px = m.X(kx), py = m.Y(g * kx); circle(px, py, 7, { fill: col, alpha: a }); text(lab, px - 14, py + (below ? 30 : -14), { role: 'num', size: 24, weight: 700, color: col, align: 'right', alpha: a }); };
    dot(gA, C.secondText, cA.gf.toFixed(1) + ' gf', ep(t, 1.4, 1.8) * (t < t1 ? 1 : 1), true);
    dot(gP, C.bad, cP.gf.toFixed(1) + ' gf', ep(t, t1 + 0.7, t1 + 1.0));
    dot(gB, C.heroText, cB.gf.toFixed(1) + ' gf', ep(t, t2 + 0.7, t2 + 1.0));
    /* the line names, set along each line where nothing else is */
    const nm = (g, x, lab, col, a, dy) => { if (a > 0.003) text(lab, m.X(x) + 12, m.Y(g * x) + dy, { role: 'label', size: 19, color: col, alpha: a }); };
    nm(gA, 0.47, 'Flat plane, ABS', C.secondText, ep(t, 1.6, 2.0), 30);
    nm(gB, 0.47, 'Bridge, ' + SIM_MAT.ppcf.name, C.heroText, ep(t, t2 + 0.9, t2 + 1.3), -14);
    if (t > t1 + 0.8) text('Flat plane, ' + SIM_MAT.ppcf.name, m.X(28 / gP) - 14, m.Y(28) + 8, { role: 'label', size: 19, color: C.bad, align: 'right', alpha: ep(t, t1 + 0.8, t1 + 1.2) });
    /* the three cases, as numbers */
    const sy = wy + ch + 40, sw = 320, sh = CLK_BOT - sy;
    statTile(t, 1.4, [wx, sy, sw, sh], { value: cA.gf.toFixed(1), unit: 'gf', label: 'Flat plane, ABS', ev: 'derived', color: C.secondText });
    statTile(t, t1 + 0.6, [wx + sw + 40, sy, sw, sh], { value: cP.gf.toFixed(1), unit: 'gf', label: 'Flat plane, ' + SIM_MAT.ppcf.name, ev: 'derived', color: C.bad });
    statTile(t, t2 + 0.6, [wx + 2 * (sw + 40), sy, sw, sh], { value: cB.gf.toFixed(1), unit: 'gf', label: 'Bridge, ' + SIM_MAT.ppcf.name, ev: 'derived', hero: true });
    /* right: the word, and what the screw and the span do (#49, #59) */
    const fl5 = clk_ten('flat', 'ppcf', { clampTo: 0.5 }).clk, br5 = clk_ten('bridge', 'ppcf', { clampTo: 0.5 }).clk, b10 = clk_ten('bridge', 'ppcf', { S: 10, rise: 2.0 }).clk;
    const pc = (a, b) => '+' + ((b.F / a.F - 1) * 100).toFixed(1) + '%', [cx, cw] = CLK_G.b;
    clk_stack(wy, [
      y => clk_gloss(t, 2.6, cx, y, cw, 'Flexural modulus', `How hard a material is to bend: ${SIM_MAT.ppcf.name} ${(SIM_MAT.ppcf.E / 1000).toFixed(1)} GPa, ABS ${(SIM_MAT.abs.E / 1000).toFixed(2)} GPa.`),
      y => clk_src(t, 6.4, cx, y, cw, 'One screw (#49)', `Let the screw clamp 0.5 mm more of the plate: the flat plane clicks ${pc(cP, fl5)} harder, the bridge only ${pc(cB, br5)}. The crown sets the bend, not the screw.`, { kind: 'derived' }),
      y => clk_src(t, 7.2, cx, y, cw, 'A taller fulcrum (#59)', `Give the arch a 10 mm span instead of 8 and the bridge clicks at ${b10.gf.toFixed(1)} gf instead of ${cB.gf.toFixed(1)}.`, { kind: 'derived' })
    ]);
  }
});
