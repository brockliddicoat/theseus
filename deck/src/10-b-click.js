/* ============================================================================================
   CHAPTER 01 · CLICKS. The path a press takes from the finger to the switch, and the microseconds after it.
   Every new top-level name here starts with clk_. Mechanism drawings come from 03-parts.js; the few helpers
   the intro file also defines are copied below, so this chapter never depends on another chapter's file.
   Idea sheets for this chapter are in 12-10-click.js.
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
  clk_razerSide: { t: 'Razer Viper V4 Pro page: side-button click latency 0.33 ms against "Brand X" 1.65 ms (maker claim)', u: 'https://www.razer.com/gaming-mice/razer-viper-v4-pro' }
});

/* ---------- local helpers ---------- */
/** one click: travel 0..1 with a hard stop, over a cycle phase c from cyc() */
const clk_curve = c => c < 0 ? 0 : c < 0.03 ? E.hit(c / 0.03) : c < 0.09 ? 1 : c < 0.13 ? 1 - E.out3((c - 0.09) / 0.04) : 0;
/** a snap-action switch pressed in a loop, with the contact's hysteresis (NO at 0.5 mm, back to NC at 0.3 mm) */
function clk_swc(t, t0, per) { const c = cyc(t, t0, per), pr = clk_curve(c), d = pr * SWG.TT, down = c >= 0 && c < 0.09; return { c, pr, state: (down ? d >= SWG.OP : d > 0.3) ? 'no' : 'nc' }; }
const CLK_SNAP = (() => { let no = 0, nc = 0; for (let c = 0; c < 0.2; c += 0.0002) { const d = clk_curve(c) * SWG.TT; if (!no && c < 0.09 && d >= SWG.OP) no = c; if (!nc && c > 0.09 && d <= 0.3) nc = c; } return { no, nc }; })();
function clk_spark(p, dt, col, s = 1, seed = 1) {
  if (!p || dt < 0 || dt > 0.16) return;
  const k = 1 - dt / 0.16; glow(p[0], p[1], 30 * s, col, 0.75 * k); glow(p[0], p[1], 9 * s, '#ffffff', 0.9 * k);
  const r = rng(seed); for (let i = 0; i < 7; i++) { const a = r() * TAU, d = (5 + dt * 280 * (0.6 + r() * 0.6)) * s; circle(p[0] + Math.cos(a) * d, p[1] + Math.sin(a) * d * 0.7, 1.6 * s, { fill: '#e8f2ff', alpha: k * 0.9 }); }
}
function clk_lamp(x, y, label, on, col, a = 1) { circle(x, y, 8, { fill: on ? col : 'rgba(0,0,0,0)', color: on ? col : C.faint, w: 2, alpha: a }); if (on) circle(x, y, 15, { color: col, w: 1.5, alpha: 0.35 * a }); text(label, x + 18, y + 8, { role: 'label', color: on ? col : C.faint, alpha: a }); }
/** a figure label: Fig. nn, then the name */
function clk_fig(t, t0, x, y, n, name) { rich([{ s: 'Fig. ' + pad2(n), role: 'label', size: 21, color: C.mute }, { s: name, role: 'small', size: 24, weight: 500, color: C.faint, sentence: true, gap: 16 }], x, y, { alpha: ep(t, t0, t0 + 0.4) }); }
/** a card's title row: mono label, evidence pills on the right (the Kunai card head) */
function clk_head(t, t0, x, y, w, label, ev) {
  const a = ep(t, t0, t0 + 0.4), ly = y + 46, ks = (ev || []).map(k => typeof k === 'string' ? { ev: k } : k);
  let xr = x + w - 24; for (let i = ks.length - 1; i >= 0; i--) { xr -= pillW(ks[i].ev, { text: ks[i].text }); pill(xr, ly + 2, ks[i].ev, a, { text: ks[i].text }); xr -= 10; }
  text(label, x + 26, ly, { role: 'label', color: C.ink, t, t0: t0 + 0.05, cps: 80, alpha: a, maxW: xr - x - 40 });
  return ly + 30;
}

/** a note under a drawing: a dot on the point, a leader that drops and runs to the note, the note in sentence case */
function clk_note(t, t0, p, x, y, label, o = {}) {
  const k = ep(t, t0, t0 + 0.5, E.snap); if (k <= 0 || !p) return;
  const col = o.color || C.ink, ly = y - 38;
  circle(p[0], p[1], 5 * k, { fill: col }); circle(p[0], p[1], 11 * k, { color: col, w: 1.5, alpha: 0.45 });
  poly([[p[0], p[1]], [p[0], ly], [x, ly]], { color: col, w: 1.5, p: k, alpha: 0.85 });
  const r = text(label, x, y, { role: 'small', size: 25, weight: 600, color: o.tcolor || col, t, t0: t0 + 0.3, cps: 80, maxW: o.maxW || 420, lh: 1.28 });
  if (o.sub) text(o.sub, x, y + r.h + 2, { role: 'small', size: 25, color: C.mute, t, t0: t0 + 0.6, cps: 100, maxW: o.maxW || 420, lh: 1.3 });
}

/* 3D. Scene names and state keys are the stable API. The two asset bugs that held this chapter in placeholder boxes are
   fixed in the bundle (2026-11-04): shell clickL/clickR gave NaN (hinge meta read per side, so the scene went blank) and the
   section caps of gt01 cutaway / claw section failed to compile (local clipping switched on too late). In 2D mode every
   shot here is the flat twin (08-v2d.js); dev2d brings back the labelled boxes for layout work. */
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
   version, an arrow runs across, then the Theseus step wipes in on a yellow edge. clk_stepsH gives the strip's height. */
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
  /* header: shipping today (with the kinds of evidence behind it), Theseus one step further (a proposal) */
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

/* ============================== 00. chapter card ============================== */
clk_S({
  id: 'clicks', ch: 'click', card: true, theme: 'night', title: 'Clicks', settle: 6, three: ['gt01'],
  sfxLoop: [{ t0: 2.4, per: 2.6, cues: [[0, 'click'], [0.11, 'release']] }],
  draw: t => {
    chapterCard(t, {
      name: 'Clicks', gloss: 'The path a press takes from your finger to the switch, and the microseconds after it.',
      list: [['#2', 'Switches turned to the trigger\'s arc'], ['#17 #18 #46–48', 'Triggers cut straight, flat at the front'], ['#3 #28', 'Two anchors per trigger, on POM'], ['#4 #49 #50 #59', 'Tensioners that bend where I choose'],
        ['#14', 'Switches that swap without solder'], ['#78 #79', 'Mechanical, counted at first contact'], ['Mag', 'A magnetic sensor under each button'], ['#80 #83 #29', 'Side buttons on rails']]
    });
    /* the part in the iris: the GT01, pressing */
    const pr = clk_curve(cyc(t, 2.4, 2.6)), a = ep(t, 1.0, 1.8);
    clk_v3('gt01', t, 1380 - 330, 580 - 250, 660, 470, { press: pr, view: 'left', yaw: 0.42, pitch: -0.08, zoom: 1.55 }, { alpha: a });
    text('Gateron GT01, representative model', 1380, 870, { role: 'label', size: 21, color: C.mute, align: 'center', alpha: ep(t, 2.0, 2.4) });
    text('Gateron has published no datasheet', 1380, 904, { role: 'label', size: 19, color: C.faint, align: 'center', alpha: ep(t, 2.2, 2.6) });
  }
});

/* ============================== 01. rotate the switch to the trigger's arc (#2) ============================== */
const CLK_ARC_STEP = [{ n: '#2', who: 'Endgame Gear', ev: 'claim', evText: 'Community', now: 'Angles its switches; voted best click feel (my doc, award unverified). No angle published.', step: 'The wedge is in the switch, so the board stays one flat piece. The angle follows the measured arc, and I publish it.' }];
clk_S({
  id: 'arc', ch: 'click', theme: 'paper', title: 'Push the switch along its own axis', settle: 10, ideas: [2],
  src: ['omronD2fPre', 'omronD2f', 'clk_gt01', 'clk_brock'], three: ['pcb'],
  sfxLoop: [{ t0: 2.6, per: 3, cues: [[0.0, 'click'], [0.09, 'release']] }],
  draw: t => {
    header(t, 'Push the switch along its own axis');
    captions(t, [[0.6, 'The trigger turns about the bend in its tensioner, so at the switch it moves on an arc, not straight down.'], [3.6, 'A switch standing straight up takes only the part of that motion along its axis. The rest pushes its plunger sideways.'], [6.6, 'Turn the switch to the arc and the whole press drives the plunger. I call it Direct Drive Actuation.']]);
    const A = acc(), sh = clk_stepsH(CLK_ARC_STEP, RM - LM), sy = 840 - sh, wx = LM, wy = LAY.top, ww = 900, wh = sy - 18 - wy;
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    text('Example: plunger 31 mm from the bend', wx + 28, wy + 44, { role: 'label', size: 21, color: C.mute, alpha: ep(t, 0.8, 1.2) });
    const tilt = ep(t, 5.0, 6.4, E.io3), pr = clk_curve(cyc(t, 2.6, 3)) * 0.75;
    const o = drawClick(wx + 196, wy + 118, 9.4, { press: pr, tilt, ghost: ep(t, 5.0, 5.6) * (tilt > 0.02 ? 1 : 0), pivot: ep(t, 1.0, 1.4), arc: ep(t, 1.6, 2.2), accent: A, alpha: Math.max(0.004, ep(t, 0.4, 1.0)) });
    callout(t, 1.2, o.rc, 'The trigger turns about this bend', { to: [wx + 196, wy + 222], side: 'r', color: C.ink2, tcolor: C.ink2, maxW: 200, prose: true });
    /* the motion at the plunger, split along the switch axis and across it, in a magnifier */
    const g = o.geo || {}, mis = g.mis || 0, ax = o.axisDir, mv = o.motion;
    const bx = wx + ww - 118, by = wy + 150, br = 86, kb = ep(t, 2.4, 2.9);
    if (kb > 0 && o.footW) {
      line(o.footW[0], o.footW[1], bx - br * 0.72, by + br * 0.7, { color: C.faint, w: 1.2, dash: [4, 4], alpha: kb });
      circle(bx, by, br, { fill: C.panel, color: C.ink, w: 1.5, alpha: kb });
      const L = 136, P0 = [bx - mv[0] * L * 0.5, by - mv[1] * L * 0.5], along = mv[0] * ax[0] + mv[1] * ax[1];
      const P1 = [P0[0] + mv[0] * L, P0[1] + mv[1] * L], Pa = [P0[0] + ax[0] * L * along, P0[1] + ax[1] * L * along];
      G.save(); G.beginPath(); G.arc(bx, by, br - 2, 0, TAU); G.clip();
      line(P0[0] - ax[0] * 80, P0[1] - ax[1] * 80, P0[0] + ax[0] * 200, P0[1] + ax[1] * 200, { color: A, w: 1.5, dash: [5, 5], alpha: kb });
      arrow(P0[0], P0[1], P1[0], P1[1], { color: C.ink, w: 3.5, hs: 14, alpha: kb });
      arrow(P0[0], P0[1], Pa[0], Pa[1], { color: A, w: 4, hs: 14, alpha: kb });
      if (Math.hypot(P1[0] - Pa[0], P1[1] - Pa[1]) > 4) arrow(Pa[0], Pa[1], P1[0], P1[1], { color: C.red, w: 3.5, hs: 11, alpha: kb });
      G.restore();
      text('At the plunger', bx, by - br - 14, { role: 'label', size: 21, color: C.mute, align: 'center', alpha: kb });
    }
    /* the numbers, live as the switch turns */
    const deg = mis * 180 / Math.PI, k3 = ep(t, 3.0, 3.4);
    [['Off-axis angle', deg.toFixed(1) + '°', C.ink], ['Along the axis', (Math.cos(mis) * 100).toFixed(1) + '%', A], ['Sideways, sin θ', (Math.sin(mis) * 100).toFixed(1) + '%', C.red]].forEach(([l, v, c], i) => {
      const x = wx + 30 + i * 240; text(l, x, wy + wh - 70, { role: 'label', size: 21, color: C.mute, alpha: k3 }); text(v, x, wy + wh - 22, { font: 'disp', size: 48, weight: 800, track: -0.01, color: c, alpha: k3, tnum: true });
    });
    pill(wx + ww - 24 - pillW('derived'), wy + wh - 68, 'derived', k3);
    /* the Theseus way: the wedge is part of the switch, the board stays one flat piece */
    const cx0 = 1004, cw = RM - cx0;
    demoWindow(cx0, wy, cw, wh, ep(t, 0.5, 0.9));
    clk_head(t, 0.9, cx0, wy, cw, 'The wedge is in the switch', ['claim', 'proposal']);
    clk_v3('pcb', t, cx0 + 10, wy + 64, cw - 20, wh - 136, { pressR: clk_curve(cyc(t, 2.6, 3)), view: 'left', yaw: 0.5, pitch: -0.12, zoom: in2D(5.2, 4.2), target: in2D([-16, 9.5, 37.5], [-16, 9.5, 36.7]), hide2d: /\/WHEEL\//, hi2d: { re: /\/SW2\//, color: acc() } }, { alpha: ep(t, 1.2, 1.8) });
    const kc = ep(t, 2.2, 2.6);
    text('GT01 on its own 20° wedge; the board stays flat.', cx0 + 26, wy + wh - 52, { role: 'small', size: 25, weight: 600, color: C.ink, alpha: kc, maxW: cw - 52 });
    text('Representative model: Gateron has published no datasheet', cx0 + 26, wy + wh - 18, { role: 'label', size: 19, color: C.faint, alpha: kc });
    clk_steps(t, 7.0, LM, sy, RM - LM, CLK_ARC_STEP);
    gloss(t, 3.0, 'Off-axis load', 'The part of a press that pushes the plunger sideways instead of down. It scrapes the plunger in its guide and adds nothing to the click.');
    featureCard(t, 3.4, 'Direct Drive Actuation', ['derived', 'proposal'], 'The switch is turned to the trigger\'s arc at its plunger. Omron rates no off-axis load: it asks for a flat mount and a straight stroke.');
  }
});

/* ============================== 02. the switch itself: mechanical, made to be pushed straight (#78) ============================== */
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
clk_S({
  id: 'clk_switch', ch: 'click', theme: 'night', title: 'A mechanical switch, pushed straight', settle: 10, ideas: [78],
  src: ['clk_gt01', 'omronD2f', 'clk_d2fp', 'omronD2fp', 'paw3395', 'logiHybrid', 'clk_elo', 'clk_brock'], three: ['gt01'],
  sfxLoop: [{ t0: 1.6, per: 2.4, cues: [[0.03, 'click'], [0.12, 'release']] }],
  draw: t => {
    header(t, 'A mechanical switch, pushed straight');
    captions(t, [[0.6, 'Gateron\'s GT01 is built to be pressed straight down its own axis, with no preload. No datasheet yet, so this model is representative.'], [4.2, 'It\'s mechanical: it draws no current until it\'s pressed. An optical switch keeps pulsing an LED the whole time the mouse is awake.'], [7.2, 'Against the switches in today\'s flagships: lighter than both Omrons, and rated for 100 million clicks by its maker.']]);
    const A = acc(), wy = LAY.top, ax0 = LM, aw = 720, ah = 318;
    /* A: the switch, pressing */
    demoWindow(ax0, wy, aw, ah, ep(t, 0.3, 0.7));
    clk_head(t, 0.6, ax0, wy, aw, 'Gateron GT01, pressed', ['claim']);
    const c = cyc(t, 1.6, 2.4), pr = clk_curve(c), down = c >= 0 && c < 0.09, no = down ? pr >= 0.63 : pr > 0.5;
    clk_v3('gt01', t, ax0 + 8, wy + 60, 470, ah - 96, { press: pr, cutaway: 1, view: 'left', yaw: 0.32, pitch: -0.06, zoom: 1.75 }, { alpha: ep(t, 0.8, 1.4) });
    /* travel gauge: 0 to 0.35 mm, the snap to NO at 0.22 mm (k 0.63) */
    const gx = ax0 + 548, gy0 = wy + 96, gy1 = wy + ah - 104, kg = ep(t, 1.2, 1.6), GY = mm => gy0 + (gy1 - gy0) * mm / 0.35;
    rr(gx - 7, gy0, 14, gy1 - gy0, 7, C.track, null, 0, kg);
    rr(gx - 7, gy0, 14, Math.max(14, (GY(0.35 * pr) - gy0)), 7, no ? A : C.comp, null, 0, kg);
    for (const [mm, lab] of [[0, '0'], [0.22, '0.22 snap'], [0.35, '0.35 mm']]) { line(gx - 14, GY(mm), gx + 14, GY(mm), { color: mm === 0.22 ? A : C.faint, w: 2, alpha: kg }); text(lab, gx + 24, GY(mm) + 7, { role: 'label', size: 19, color: mm === 0.22 ? A : C.mute, alpha: kg }); }
    text('Travel', gx - 14, gy0 - 16, { role: 'label', size: 19, color: C.faint, alpha: kg });
    clk_lamp(gx - 4, gy1 + 44, 'NC', !no, A, kg); clk_lamp(gx + 74, gy1 + 44, 'NO', no, A, kg);
    text('Representative model: Gateron has published no datasheet', ax0 + 26, wy + ah - 18, { role: 'label', size: 19, color: C.faint, alpha: ep(t, 1.6, 2.0) });
    /* D: idle current per switch (#78) */
    const dy0 = wy + ah + 16, dh = 840 - dy0;
    demoWindow(ax0, dy0, aw, dh, ep(t, 0.5, 0.9));
    clk_head(t, 3.9, ax0, dy0, aw, 'Idle current', ['datasheet', 'derived']);
    const rowsD = [['GT01, mechanical', 0, '0 mA', true], ['Optical, Omron\'s test pulse', 0.15, '0.15 mA']];
    const bx0 = ax0 + 380, bw0 = aw - 380 - 140, BX = v => bx0 + bw0 * v / 0.2;
    rowsD.forEach(([l, v, s2, hero], i) => {
      const yy = dy0 + 96 + i * 44, k = ep(t, 4.2 + i * 0.25, 4.9 + i * 0.25, E.snap), a = ep(t, 4.1 + i * 0.25, 4.4 + i * 0.25);
      text(l, ax0 + 26, yy + 8, { role: 'small', size: 25, weight: hero ? 700 : 500, color: C.ink, alpha: a });
      rr(bx0, yy - 7, bw0, 14, 7, C.track, null, 0, a);
      if (v > 0) rr(bx0, yy - 7, Math.max(14, (BX(v) - bx0) * k), 14, 7, C.comp, null, 0, a); else heroMark(bx0 + 7, yy, 10, a);
      text(s2, ax0 + aw - 26, yy + 8, { role: 'num', size: 24, weight: 700, color: hero ? C.heroText : C.ink, align: 'right', alpha: a });
    });
    text('5 mA for 30 µs in every 1 ms = 0.15 mA. Two optical mains: 0.30 mA, 18% of a PAW3395\'s 1.7 mA.', ax0 + 26, dy0 + 180, { role: 'small', size: 25, color: C.mute, alpha: ep(t, 5.0, 5.4), maxW: aw - 52, lh: 1.32 });
    /* B: operating force */
    const bxc = ax0 + aw + 24, bwc = RM - bxc, bh = 262;
    demoWindow(bxc, wy, bwc, bh, ep(t, 0.6, 1.0));
    clk_head(t, 6.6, bxc, wy, bwc, 'Operating force, gf', ['claim', 'datasheet', { ev: 'claim', text: 'Community' }]);
    const F = [
      { name: 'Gateron GT01', qual: 'Theseus', lo: 50, hi: 60, mid: 55, txt: '55 ± 5 gf', ev: 'claim', hero: true },
      { name: 'Omron D2FP, optical', qual: 'Sora V2', lo: 44.9, hi: 75.5, mid: 60.2, txt: '0.59 ± 0.15 N', ev: 'datasheet' },
      { name: 'Logitech GPX2', qual: 'My notes', mid: 70, txt: '≈ 70 gf', ev: 'claim', ring: true },
      { name: 'Omron D2F-01F', qual: 'Mechanical', hi: 75.5, txt: '0.74 N max', ev: 'datasheet', max: true }
    ];
    const fx0 = bxc + 470, fw = bwc - 470 - 236, FX = v => fx0 + fw * v / 80, fy0 = wy + 98;
    for (const v of [0, 20, 40, 60, 80]) { line(FX(v), fy0 - 22, FX(v), fy0 + 4 * 38 - 18, { color: C.hair, w: 1.2, alpha: ep(t, 6.7, 7.1) }); text(String(v), FX(v), fy0 + 4 * 38 + 8, { role: 'tick', color: C.mute, align: 'center', alpha: ep(t, 6.7, 7.1) }); }
    F.forEach((r, i) => {
      const yy = fy0 + i * 38, k = ep(t, 6.9 + i * 0.2, 7.6 + i * 0.2, E.snap), a = ep(t, 6.8 + i * 0.2, 7.1 + i * 0.2);
      evDot(bxc + 34, yy - 6, r.ev, 6, a);
      const nm = text(r.name, bxc + 52, yy + 3, { role: 'small', size: 25, weight: r.hero ? 800 : 600, color: C.ink, alpha: a });
      text(r.qual, bxc + 52 + nm.w + 12, yy + 2, { role: 'label', size: 19, color: r.hero ? C.heroText : C.faint, alpha: a });
      const col = r.hero ? C.hero : C.comp;
      if (r.max) { G.save(); G.globalAlpha = a; G.setLineDash([6, 5]); G.strokeStyle = C.comp; G.lineWidth = 2; G.strokeRect(FX(0), yy - 13, (FX(r.hi) - FX(0)) * k, 14); G.restore(); line(FX(r.hi), yy - 19, FX(r.hi), yy + 7, { color: C.ink2, w: 2.5, alpha: a * k }); }
      else if (r.lo != null) { const xa = FX(lerp(r.mid, r.lo, k)), xb = FX(lerp(r.mid, r.hi, k)); rr(xa, yy - 13, Math.max(4, xb - xa), 14, 7, col, r.hero && TH ? '#111111' : null, 1.5, a); line(FX(r.mid), yy - 19, FX(r.mid), yy + 7, { color: r.hero ? C.ink : C.ink2, w: 2.5, alpha: a }); }
      else { circle(FX(r.mid), yy - 6, 8 * k, { fill: C.panel, alpha: a }); circle(FX(r.mid), yy - 6, 8 * k, { color: C.comp, w: 3, alpha: a }); }
      text(r.txt, bxc + bwc - 26, yy + 3, { role: 'num', size: 24, weight: r.hero ? 800 : 600, color: r.hero ? C.heroText : C.ink, align: 'right', alpha: a });
    });
    /* C: rated life (maker figures) */
    const cy0 = wy + bh + 16, ch2 = 840 - cy0;
    demoWindow(bxc, cy0, bwc, ch2, ep(t, 0.7, 1.1));
    clk_head(t, 7.6, bxc, cy0, bwc, 'Rated life, million clicks', ['claim']);
    lollipop(t, { x: bxc + 26, y: cy0 + 112, w: bwc - 52, t0: 7.8, rows: clk_life(), xr: [0, 180], ticks: [0, 50, 100, 150], tfmt: v => v + ' M', fmt: v => v + ' M', labelW: 470, rowH: 31, valW: 96 });
    gloss(t, 4.6, 'Optical switch', 'An LED shines across a gap the plunger blocks. No contact to wear or bounce, but the LED needs current whenever the mouse is listening.');
    featureCard(t, 5.0, 'Mechanical mains', ['claim', 'proposal'], 'A GT01-class switch on its own wedge (#78). Rated life is the maker\'s figure for every switch on this slide.');
  }
});
/* ============================== 03. straight rear cutouts (#17), tensioners centred on their switches (#18) ============================== */
const CLK_CUT_STEP = [{ n: '#17', who: 'Razer Viper V3 Pro', ev: 'claim', evText: 'Community', now: 'Went straight after the V2 Pro\'s angled cutouts drew click complaints (my doc).', step: 'Straight, with each tensioner centred on its switch (#18). I publish the click force at five points across each button.' }];
clk_S({
  id: 'cutouts', ch: 'click', theme: 'paper', title: 'Cut the rear cutouts straight', settle: 10, ideas: [17, 18],
  src: ['clk_brock'], three: ['shell-sora', 'shell'],
  draw: t => {
    header(t, 'Cut the rear cutouts straight');
    captions(t, [[0.6, 'The tensioner bends along the rear cutout, so it takes the cutout\'s shape.'], [3.2, 'Curve the cutout into a smile and each arm bends on a diagonal: part of every press goes sideways.'], [6.2, 'Cut it straight and centre each tensioner on its switch, and the bend sits square to the press.']]);
    const A = acc(), sh = clk_stepsH(CLK_CUT_STEP, RM - LM), sy = 840 - sh, wx = LM, wy = LAY.top, ww = 900, wh = sy - 18 - wy;
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    clk_head(t, 0.8, wx, wy, ww, 'The tensioners, flat, from above', ['derived']);
    const sm = 1 - ep(t, 3.4, 5.0, E.io3), k18 = ep(t, 6.2, 7.4, E.io3), s = 12, cx = wx + 330, cy = wy + 76 + 14.6 * s;
    const o = part(cx, cy, s, () => tensionerPlanMM({ smile: sm, accent: A }), { alpha: ep(t, 0.4, 0.9) });
    /* each arm swings square to its bend line: on a curve that is a diagonal */
    const ka = ep(t, 1.6, 2.2), col = sm > 0.5 ? C.red : A;
    if (o.arms) for (const arm of o.arms) for (let i = 0; i < 4; i++) {
      const x = lerp(arm.xl + 3, arm.xr - 3, i / 3), slope = arm.slope(x), y = o.edgeY(x) - 1.6, nl = Math.hypot(slope, 1), nx = slope / nl, ny = -1 / nl;
      const p = o.P(x, y - 1.6), q = o.P(x + nx * 5.6, y - 1.6 + ny * 5.6);
      arrow(p[0], p[1], q[0], q[1], { color: col, w: 3, hs: 11, alpha: ka });
    }
    /* #18: the switch plunger ahead of each arm, slid onto the arm's centre line */
    if (o.P) {
      const k = ep(t, 5.4, 5.9);
      for (const sgn of [-1, 1]) {
        const hx = sgn * 10.7, ey = o.edgeY(hx), off = sgn * 5 * (1 - k18), st = o.P(hx, ey - 5.2), pl = o.P(hx + off, ey - 10.6);
        line(st[0], st[1], pl[0], pl[1], { color: k18 > 0.95 ? A : C.red, w: 2, dash: [6, 5], alpha: k });
        rr(pl[0] - 15, pl[1] - 15, 30, 30, 5, C.panel, k18 > 0.95 ? A : C.ink2, 2, k); circle(pl[0], pl[1], 5, { fill: k18 > 0.95 ? A : C.ink2, alpha: k });
      }
      callout(t, 5.6, o.P(-10.7 - 5 * (1 - k18), o.edgeY(-10.7) - 10.6 - 1.4), 'Switch plunger', { to: [wx + 240, wy + 92], side: 'r', color: C.ink2, tcolor: C.ink2 });
    }
    /* the readout: how far the bend line leans at the arm's outer end, and what that sends sideways */
    const ang = Math.atan(0.4554 * sm), kr = ep(t, 2.6, 3.0), rx = wx + 630;
    [['Bend lean, end', (ang * 180 / Math.PI).toFixed(1) + '°', C.ink], ['Sideways, sin θ', (Math.sin(ang) * 100).toFixed(1) + '%', sm > 0.02 ? C.red : A], ['Switch offset', (5 * (1 - k18)).toFixed(1) + ' mm', k18 > 0.98 ? A : C.ink]].forEach(([l, v, c2], i) => {
      const yy = wy + 132 + i * 92; text(l, rx, yy, { role: 'label', size: 21, color: C.mute, alpha: kr }); text(v, rx, yy + 50, { font: 'disp', size: 46, weight: 800, track: -0.01, color: c2, tnum: true, alpha: kr });
    });
    text('Example: a 4.6 mm smile across a 40 mm pair', wx + 26, wy + wh - 22, { role: 'label', size: 19, color: C.faint, alpha: ep(t, 2.8, 3.2) });
    /* the shapes: the Sora V2's curved rear cutouts against Theseus's straight ones */
    const bx0 = 1004, bw = RM - bx0, vw = (bw - 36) / 2, vh = wh - 112;
    demoWindow(bx0, wy, bw, wh, ep(t, 0.5, 0.9));
    clk_head(t, 1.0, bx0, wy, bw, 'Sora V2 against Theseus', []);
    const cam = { view: [0, 1, -0.3], zoom: 1.32, target: [0, 18, 24] };
    /* in 2D the triggers' outlines carry the point, so they are drawn in the colour of each label */
    clk_v3('shell-sora', t, bx0 + 12, wy + 60, vw, vh, Object.assign({}, cam, { hi2d: { re: /^explode[LR]\/.*trigger[LR]$/, color: C.red, w: 3 } }), { alpha: ep(t, 1.2, 1.8) });
    clk_v3('shell', t, bx0 + 24 + vw, wy + 60, vw, vh, Object.assign({}, cam, { hi2d: { re: /^explode[LR]\/.*trigger[LR]$/, color: A, w: 3 } }), { alpha: ep(t, 1.6, 2.2) });
    text('Sora V2: a smile', bx0 + 12 + vw / 2, wy + wh - 26, { role: 'label', size: 21, color: C.red, align: 'center', alpha: ep(t, 2.2, 2.6) });
    text('Theseus: straight', bx0 + 24 + vw * 1.5, wy + wh - 26, { role: 'label', size: 21, color: A, align: 'center', alpha: ep(t, 2.4, 2.8) });
    clk_steps(t, 7.6, LM, sy, RM - LM, CLK_CUT_STEP);
    gloss(t, 2.4, 'Tensioner', 'The spring arm under each button. It sets how hard the button presses and how fast it comes back.');
    featureCard(t, 4.6, 'Straight rear cutouts', ['derived', 'proposal'], 'The bend sits square to the press (#17), and each tensioner sits on its switch\'s line (#18).');
  }
});

/* ============================== 04. flat front cutouts (#46), grooves that run out (#47), flush walls (#48) ============================== */
/** the comfort groove across the button, at a distance z (mm) from its front edge: depth runs from 0.6 mm to nothing at the edge.
    profiles drawn with the depth exaggerated (o.ex) so a tenth of a millimetre reads */
const clk_grooveD = z => 0.6 * smooth(clamp(z / 20));
function clk_grooveMM(o = {}) {
  const A = o.accent || acc(), ex = o.ex || 5, zs = o.zs || [24, 16, 8, 0], live = o.live, out = { tags: [] };
  const prof = (z, x) => ex * clk_grooveD(z) * Math.pow(Math.cos(Math.PI * x / 26), 2);
  zs.forEach((z, i) => {
    const y0 = i * 7.2, a = o.k == null ? 1 : clamp((o.k - i * 0.22) / 0.3);
    if (a <= 0) return;
    xsave(); ga(a * 0.9);
    const pts = []; for (let x = -13; x <= 13.01; x += 0.25) pts.push([x, y0 + prof(z, x)]);
    solid(() => { G.beginPath(); pts.forEach((p, j) => j ? G.lineTo(p[0], p[1]) : G.moveTo(p[0], p[1])); for (let j = pts.length - 1; j >= 0; j--) G.lineTo(pts[j][0], pts[j][1] + 1.2); G.closePath(); }, MT.shell, [-13, y0 - 3, 26, 4.2], { hatch: true });
    mmLine(pts.map(p => [p[0], p[1] + 0.05]), 'rgba(255,255,255,0.25)', 1);
    if (z === 0) mmLine([[-13, y0 + prof(0, -13) - 0.05], [13, y0 + prof(0, 13) - 0.05]], A, 2.2, { dash: [6, 4] });
    xrest();
    out.tags.push({ z, p: SP(13.6, y0 + prof(z, 13) + 0.4), mid: SP(0, y0 + prof(z, 0)), a });
  });
  if (live != null) { const y0 = live.i * 7.2; out.live = SP(0, y0 + prof(live.z, 0)); }
  return out;
}
clk_S({
  id: 'clk_front', ch: 'click', theme: 'night', title: 'Flat and flush at the front', settle: 10, ideas: [46, 47, 48],
  src: ['clk_brock'],
  sfxLoop: [{ t0: 1.6, per: 2.6, cues: [[0, 'click'], [0.1, 'release']] }],
  draw: t => {
    header(t, 'Flat and flush at the front');
    captions(t, [[0.6, 'At the front two flat faces meet. The gap between them is the post-travel, and a flat face is the easiest thing to recut in a mold.'], [3.8, 'For the front to be flat, the comfort grooves must run out before it: they shallow to nothing at the edge.'], [6.8, 'Beside the button, the walls sit level with it when it\'s pressed, so a pressed finger feels no step.']]);
    const A = acc(), wy = LAY.top, h = 840 - wy, gap = 24, w = (RM - LM - 2 * gap) / 3, X = i => LM + i * (w + gap);
    /* 1: the front cutout in section */
    demoWindow(X(0), wy, w, h, ep(t, 0.3, 0.7));
    clk_head(t, 0.7, X(0), wy, w, 'Front cutout, section', ['proposal']);
    const fp = clk_curve(cyc(t, 1.6, 2.6)), fo = part(X(0) + w / 2 - 10, wy + 236, 16, () => frontStopMM({ press: fp, gapMark: ep(t, 1.8, 2.2), accent: A }), { alpha: ep(t, 0.8, 1.3) });
    if (fo.dimAt) text('Gap', fo.dimAt[0] - 10, fo.dimAt[1] + 7, { role: 'label', size: 21, color: A, align: 'right', alpha: ep(t, 2.0, 2.4) });
    clk_note(t, 2.0, fo.stop, X(0) + 34, wy + 430, 'Both faces flat, level with the ground', { color: A, maxW: w - 68, sub: 'The gap is the post-travel. Cut steel off one face to tune it.' });
    /* 2: the groove, front to back */
    demoWindow(X(1), wy, w, h, ep(t, 0.5, 0.9));
    clk_head(t, 3.4, X(1), wy, w, 'Groove, front to back', ['proposal']);
    const kg = ep(t, 3.6, 5.6, E.lin), zs = [24, 16, 8, 0];
    const go = part(X(1) + w / 2 - 50, wy + 150, 12, () => clk_grooveMM({ accent: A, k: kg * 1.2, zs }), { alpha: ep(t, 3.4, 3.8) });
    (go.tags || []).forEach(g2 => { if (g2.a <= 0) return; text((g2.z ? g2.z + ' mm' : 'Edge'), g2.p[0] + 14, g2.p[1] + 4, { role: 'label', size: 21, color: g2.z ? C.mute : A, alpha: g2.a }); text(clk_grooveD(g2.z).toFixed(2) + ' mm', g2.p[0] + 14, g2.p[1] + 30, { role: 'num', size: 22, weight: 700, color: g2.z ? C.ink2 : A, alpha: g2.a }); });
    text('Distance from the front edge, and depth', X(1) + 26, wy + h - 66, { role: 'small', size: 25, color: C.mute, alpha: ep(t, 4.2, 4.6), maxW: w - 52 });
    text('Depth drawn 5 times deeper', X(1) + 26, wy + h - 24, { role: 'label', size: 19, color: C.faint, alpha: ep(t, 4.2, 4.6) });
    /* 3: beside the button, from the front */
    demoWindow(X(2), wy, w, h, ep(t, 0.7, 1.1));
    clk_head(t, 6.4, X(2), wy, w, 'Beside the button', ['proposal']);
    const lp = clk_curve(cyc(t, 6.8, 2.6)), lo = part(X(2) + 210, wy + 250, 17, () => flushMM({ press: lp, ref: ep(t, 7.0, 7.4), accent: A }), { alpha: ep(t, 6.5, 7.0) });
    clk_note(t, 7.0, lo.wall, X(2) + 34, wy + 430, 'Wall level with the pressed button', { color: A, maxW: w - 68, sub: 'The front bottoms out first; the rear sits 0.4 mm higher, so the walls take the average.' });
    gloss(t, 2.6, 'Post-travel', 'How far a button keeps moving after the switch has clicked. Too much feels mushy; none at all feels harsh.');
    featureCard(t, 4.8, 'Flat front, flush walls', ['proposal'], 'Flat front faces (#46), grooves that run out before the edge (#47), walls level with a pressed button (#48).');
  }
});

/* ============================== 05. two anchors per trigger (#3), POM pads beside the plunger (#28) ============================== */
const CLK_ANC_STEP = [
  { n: '#3', who: 'G-Wolves', ev: 'claim', evText: 'Community', now: 'Owners: "either super stiff or mushy".', step: 'POM-padded rails, no added preload; play published.' },
  { n: '#28', who: 'Starlight X', ev: 'claim', evText: 'Community', now: 'POM pads; an LA-1 with pads still ground.', step: 'Front-post pads on 0.05 mm shims; rub force published.' }
];
clk_S({
  id: 'anchors', ch: 'click', theme: 'paper', title: 'Two anchors per trigger', settle: 11, ideas: [3, 28],
  src: ['tpuUlx', 'delrin150', 'delrinAF', 'clk_brock'],
  sfxLoop: [{ t0: 2.2, per: 2.4, cues: [[0, 'click'], [0.09, 'release']] }],
  draw: t => {
    header(t, 'Two anchors per trigger');
    captions(t, [[0.6, 'One plunger and one tensioner give a trigger a single line to roll about. Press near the edge and it rolls.'], [4.6, 'A second plunger far from the first takes that line away, so every part of the button presses the same way.'], [7.4, 'POM pads where the posts slide keep them square, without carbon-filled plastic\'s grinding.']]);
    const A = acc(), sh = clk_stepsH(CLK_ANC_STEP, RM - LM), sy = 840 - sh, wx = LM, wy = LAY.top, ww = 880, wh = sy - 18 - wy;
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    clk_head(t, 0.7, wx, wy, ww, 'One button, from above', ['measured', 'proposal']);
    const dual = t > 4.6, c = cyc(t, 2.2, 2.4), pr = clk_curve(c), sway = dual ? 0 : 0.07 * pr;
    const o = part(wx + 44, wy + 96, 7.6, () => plateMM({ accent: A }), { alpha: ep(t, 0.4, 0.9), rot: Math.PI / 2 + sway });
    const hinge = o.hinge, a1 = o.p1, a2 = o.p2, press = o.edgePress;
    if (hinge) {
      circle(hinge[0], hinge[1], 8, { fill: C.ink, alpha: ep(t, 0.9, 1.3) });
      circle(a1[0], a1[1], 9, { fill: A, alpha: ep(t, 1.0, 1.4) }); text('Plunger 1', a1[0], a1[1] - 20, { role: 'label', size: 21, color: '#F3F2EE', align: 'center', alpha: ep(t, 1.2, 1.6) });
      const a2k = ep(t, 4.6, 5.1, E.snap); if (a2k > 0) { circle(a2[0], a2[1], 9 * a2k, { fill: A }); text('Plunger 2', a2[0] - 14, a2[1] + 36, { role: 'label', size: 21, color: '#F3F2EE', align: 'right', alpha: a2k }); }
      const ex = [a1[0] + (a1[0] - hinge[0]) * 0.32, a1[1] + (a1[1] - hinge[1]) * 0.32], ex0 = [hinge[0] - (a1[0] - hinge[0]) * 0.06, hinge[1] - (a1[1] - hinge[1]) * 0.06];
      line(ex0[0], ex0[1], ex[0], ex[1], { color: C.red, w: 2.5, dash: [6, 5], alpha: (1 - a2k) * ep(t, 1.6, 2.0) });
      circle(press[0], press[1], 14 + 10 * pr, { color: C.ink, w: 2.5, alpha: ep(t, 2.0, 2.3) });
      if (!dual && pr > 0.05) arrow(press[0], press[1] + 20, press[0], press[1] + 20 + 50 * pr, { color: C.red, w: 4, hs: 14 });
      callout(t, 1.0, hinge, 'Tensioner', { to: [hinge[0] + 40, wy + wh - 30], side: 'r', color: C.ink2, tcolor: C.ink2 });
    }
    const tx = wx + 500;
    text(dual ? 'Pressed near the edge, the button stays put' : 'Pressed near the edge, it rolls about one line', tx, wy + 112, { role: 'small', size: 26, weight: 700, color: dual ? A : C.red, alpha: ep(t, 2.2, 2.6), maxW: ww - 520, lh: 1.3 });
    text('"Can move laterally quite a bit when pushed": TechPowerUp, on the ULX.', tx, wy + 220, { role: 'small', color: C.mute, alpha: ep(t, 3.0, 3.4), maxW: ww - 520, lh: 1.36 });
    /* the plunger guide, cut across: POM pads, shimmed */
    const sx = wx + ww + 24, sw = RM - sx;
    demoWindow(sx, wy, sw, wh, ep(t, 0.5, 0.9));
    clk_head(t, 0.9, sx, wy, sw, 'Section through the plunger guide', ['datasheet', 'proposal']);
    const shim = t > 7.9 ? 0.5 : 0, pk = 1 + 0.0714 * shim * 2;
    const gs = Math.min(24, (wh - 96) / 13.6), gp = clk_curve(cyc(t, 2.2, 2.4)), g = part(sx + 230, wy + 70 + 5.4 * gs, gs, () => guideMM({ press: gp, pads: ep(t, 6.8, 7.3, E.snap) * pk, accent: A }), { alpha: ep(t, 0.6, 1.1) });
    callout(t, 7.0, g.padR, 'POM pads, both sides', { to: [sx + 430, wy + 130], side: 'r', color: A, maxW: 300, sub: 'Delrin 150: μ 0.20, dry' });
    callout(t, 1.4, g.plunger, 'Switch plunger', { to: [sx + 430, wy + wh - 40], side: 'r', color: C.ink2, tcolor: C.ink2 });
    if (t > 7.6) text('Pad ' + (0.70 + 0.05 * shim * 2).toFixed(2) + ' mm', sx + 442, wy + 236, { role: 'num', size: 24, weight: 700, color: A, alpha: ep(t, 7.6, 7.9) });
    clk_steps(t, 8.2, LM, sy, RM - LM, CLK_ANC_STEP);
    gloss(t, 2.6, 'Lateral play', 'How far a button moves sideways when pressed near its edge. It reads as wobble and moves the click.');
    featureCard(t, 5.4, 'Dual Rail Triggers', ['measured', 'proposal'], 'A second plunger far from the first (#3), on POM pads where the posts slide (#28).');
  }
});

/* ============================== 06. where the tensioner bends (#50) and how long it is (#59) ============================== */
function clk_beam(n, bridge) {
  /* cantilever, fixed at x = 0, tip load at x = 1. h(x): thickness; curvature k = M/EI with M = (1 - x), I ~ h^3. deflection by double integration. */
  const xs = [], h = [], kap = [], y = [];
  for (let i = 0; i <= n; i++) { const x = i / n; xs.push(x); const hh = bridge ? 1 - 0.5 * Math.exp(-Math.pow((x - 0.55) / 0.13, 2)) : 1; h.push(hh); kap.push((1 - x) / Math.pow(hh, 3)); }
  let a = 0, d = 0; y.push(0);
  for (let i = 1; i <= n; i++) { a += (kap[i] + kap[i - 1]) / 2 / n; d += a / n; y.push(d); }
  return { xs, h, kap, y };
}
const CLK_BU = clk_beam(120, false), CLK_BB = clk_beam(120, true);
const CLK_TEN_STEP = [{ n: '#59', who: 'Lamzu Atlantis', ev: 'claim', evText: 'Community', now: 'Its tensioners sit 10 mm below the peak, for leverage (my doc).', step: 'The fulcrum height comes from k = 3EI/L³, and the stiffness is published in N/mm.' }];
clk_S({
  id: 'tensioner', ch: 'click', theme: 'night', title: 'Decide where the tensioner bends', settle: 10, ideas: [50, 59],
  src: ['clk_brock'],
  draw: t => {
    header(t, 'Decide where the tensioner bends');
    captions(t, [[0.6, 'A flat tensioner bends hardest at its screw, so where it bends is set by the fastener, not by design.'], [2.8, 'Thin the middle into a bridge and the bend moves to the thin part. The curve under each arm is the bending, computed.'], [5.8, 'Stiffness falls with the cube of free length, so a taller fulcrum is the cheapest way to a lighter click.']]);
    const A = acc(), sh = clk_stepsH(CLK_TEN_STEP, RM - LM), sy = 840 - sh, wx = LM, wy = LAY.top, ww = 900, wh = sy - 18 - wy;
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    clk_head(t, 0.6, wx, wy, ww, 'The tensioner, side on, loaded at its tip', ['derived']);
    const load = 0.5 + 0.5 * Math.sin(Math.max(0, t - 2.6) * 2.2 - Math.PI / 2), kmax = Math.max(...CLK_BB.kap);
    const drawBeam = (B, y0, label, col, t0) => {
      const x0 = wx + 120, L = 560, k = ep(t, t0, t0 + 0.6);
      text(label, x0 - 64, y0 - 36, { role: 'label', size: 21, color: C.ink, t, t0, cps: 60 });
      part(0, 0, 1, () => {
        solid(() => { G.beginPath(); G.rect(x0 - 64, y0 + 6, 64, 30); }, MT.shell, [x0 - 64, y0 + 6, 64, 30], { hatch: true });
        solid(() => { G.beginPath(); G.rect(x0 - 64, y0 - 26, 64, 16); }, MT.shell, [x0 - 64, y0 - 26, 64, 16], { hatch: true });
        const top = [], bot = [];
        for (let i = 0; i <= 120; i++) { const x = x0 + B.xs[i] * L, dy = B.y[i] / CLK_BU.y[120] * 40 * load; top.push([x, y0 - B.h[i] * 7 + dy]); bot.push([x, y0 + B.h[i] * 7 + dy]); }
        solid(() => { G.beginPath(); G.moveTo(x0 - 64, y0 - 7); top.forEach(p => G.lineTo(p[0], p[1])); for (let i = bot.length - 1; i >= 0; i--) G.lineTo(bot[i][0], bot[i][1]); G.lineTo(x0 - 64, y0 + 7); G.closePath(); }, MT.spring, [x0, y0 - 9, L, 18], {});
      }, { alpha: k });
      /* curvature along the arm: where it actually bends */
      const yb = y0 + 104;
      G.save(); G.globalAlpha = ep(t, t0 + 0.8, t0 + 1.4); G.beginPath(); G.moveTo(x0, yb);
      for (let i = 0; i <= 120; i++) G.lineTo(x0 + B.xs[i] * L, yb - B.kap[i] / kmax * 52);
      G.lineTo(x0 + L, yb); G.closePath(); G.fillStyle = rgba(col, 0.3); G.fill(); G.strokeStyle = col; G.lineWidth = 2; G.stroke(); G.restore();
      text('Bending', x0 + L + 16, yb - 4, { role: 'label', size: 21, color: C.mute, alpha: ep(t, t0 + 1.0, t0 + 1.4) });
      arrow(x0 + L, y0 - 66, x0 + L, y0 - 12 + B.y[120] / CLK_BU.y[120] * 40 * load, { color: C.ink, w: 3, hs: 12, alpha: ep(t, 2.4, 2.8) });
    };
    const span = wh - 96;
    drawBeam(CLK_BU, wy + 92 + span * 0.12, 'Flat arm: bends at the screw', C.gray, 0.6);
    drawBeam(CLK_BB, wy + 92 + span * 0.62, 'Bridge arm: bends where it\'s thin', A, 1.4);
    /* stiffness against free length */
    const cx = wx + ww + 24, cw = RM - cx;
    demoWindow(cx, wy, cw, wh, ep(t, 0.5, 0.9));
    clk_head(t, 4.8, cx, wy, cw, 'Stiffness against free length', ['derived']);
    const m = axes(t, { x: cx + 100, y: wy + 100, w: cw - 150, h: wh - 230, xr: [0.8, 1.3], yr: [0, 2], xticks: [0.8, 0.9, 1, 1.1, 1.2, 1.3], yticks: [0, 0.5, 1, 1.5, 2], xfmt: v => v.toFixed(1) + '×', yfmt: v => v.toFixed(1) + '×', xlabel: 'Free length, relative', t0: 5.0 });
    const pts = []; for (let Lr = 0.8; Lr <= 1.301; Lr += 0.01) pts.push([Lr, 1 / (Lr * Lr * Lr)]);
    series(m, pts, { color: A, w: 3, p: ep(t, 5.2, 6.2, E.lin) });
    const k11 = ep(t, 6.4, 6.8); circle(m.X(1.1), m.Y(1 / 1.331), 7, { fill: A, alpha: k11 });
    text('10% longer: 25% less stiff', m.X(1.1) + 14, m.Y(1 / 1.331) - 16, { role: 'label', size: 21, color: A, alpha: k11 });
    text('k = 3EI / L³', cx + cw - 30, wy + 140, { font: 'mono', size: 28, weight: 700, color: C.ink, align: 'right', alpha: ep(t, 5.4, 5.8) });
    clk_steps(t, 7.4, LM, sy, RM - LM, CLK_TEN_STEP);
    gloss(t, 3.2, 'Free length', 'The part of the tensioner that can bend. A taller fulcrum gives it more, so the click gets lighter.');
    featureCard(t, 3.6, 'Bridge tensioner', ['derived', 'proposal'], 'Thin in the middle, so it bends where I choose (#50); a taller fulcrum for leverage (#59).');
  }
});
/* ============================== 07. switches that swap without solder (#14) ============================== */
const CLK_HS_STEP = [
  { n: '#14', who: 'Endgame Gear OP1 8K', ev: 'measured', evText: 'Review', now: 'Swappable; TechRadar: the terminal is "hard to remove and easy to insert backwards".', step: 'A keyed, moulded pin cover: a switch cannot go in backwards. Orientation errors: zero, by design.' },
  { n: '#14', who: 'Epomaker Carbonis', ev: 'measured', evText: 'Review', now: 'An optical switch held by an alligator clip, no solder (Hardware Busters).', step: 'Firmware names the switch from its bounce and tracks spring health. Contact resistance after 100 swaps, published.' }
];
/** a pin in, a pause, a pin out: 0..1 over a 4.2 s loop */
const clk_insert = t => { const u = ((t % 4.2) + 4.2) % 4.2; return u < 1.4 ? E.io3(u / 1.4) : u < 3.2 ? 1 : 1 - E.io3((u - 3.2) / 1.0); };
clk_S({
  id: 'clk_hotswap', ch: 'click', theme: 'night', title: 'Swap a switch without solder', settle: 10, ideas: [14],
  src: ['clk_millmax', 'millmax', 'clk_eggSwap', 'trOp1', 'clk_hwbSwap', 'clk_brock'], three: ['claw'],
  sfx: [[2.0, 'seat']],
  draw: t => {
    header(t, 'Swap a switch without solder');
    captions(t, [[0.6, 'Each switch leg drops into a Mill-Max 3305: a sleeve soldered into the board, with a gold-plated beryllium-copper claw inside.'], [4.0, 'Rated for 1,000 insertions at 10 mΩ or less. Swap a switch every week and the socket lasts 19 years.'], [7.0, 'The OP1 8K already swaps switches. Mine adds a keyed pin cover, so a switch can\'t go in backwards.']]);
    const A = acc(), sh = clk_stepsH(CLK_HS_STEP, RM - LM), sy = 840 - sh, wx = LM, wy = LAY.top, ww = 700, wh = sy - 18 - wy;
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    clk_head(t, 0.6, wx, wy, ww, 'A switch leg entering its socket', ['datasheet']);
    const ins = t < 1.2 ? 0 : clk_insert(t - 1.2);
    clk_v3('claw', t, wx + 10, wy + 60, ww - 20, wh - 120, { insert: ins, section: 1, view: 'threeQuarter', yaw: 0.2, pitch: -0.05, zoom: in2D(2.6, 1.45), target: in2D([0, 0.8, 0], undefined) }, { alpha: ep(t, 0.8, 1.4) });
    text('BeCu claw, 30 µin gold on the contact only', wx + 26, wy + wh - 52, { role: 'small', size: 25, weight: 600, color: C.ink, alpha: ep(t, 1.8, 2.2) });
    text('Takes leads 0.635 to 0.940 mm across', wx + 26, wy + wh - 18, { role: 'label', size: 19, color: C.faint, alpha: ep(t, 2.0, 2.4) });
    /* the numbers */
    const cx = wx + ww + 24, cw = RM - cx, gw = (cw - 20) / 2, gh = (wh - 20) / 2;
    statCard(t, 2.4, cx, wy, gw, gh, { label: 'Rated insertions', ev: 'datasheet', value: '1,000', unit: 'min' });
    statCard(t, 2.7, cx + gw + 20, wy, gw, gh, { label: 'Contact resistance', ev: 'datasheet', pre: '≤', value: '10', unit: 'mΩ' });
    statCard(t, 4.2, cx, wy + gh + 20, gw, gh, { label: 'Swapped weekly', ev: 'derived', value: '19', unit: 'years', body: '1,000 insertions ÷ 52 a year', hero: true });
    statCard(t, 4.6, cx + gw + 20, wy + gh + 20, gw, gh, { label: 'Six sockets, mass', ev: 'derived', pre: '≈', value: '0.66', unit: 'g', body: '6 × 0.11 g, my figure; Mill-Max lists none' });
    clk_steps(t, 7.2, LM, sy, RM - LM, CLK_HS_STEP);
    gloss(t, 3.0, 'Claw-spring socket', 'A sleeve soldered into the board with spring fingers inside that grip a lead, so a part plugs in instead of being soldered.');
    featureCard(t, 3.4, 'Hot-swap mains', ['datasheet', 'derived', 'proposal'], 'Mill-Max 3305 sockets under both main switches (#14); the switch is a part you can replace.');
  }
});

/* ============================== 08. SPDT: counted at first contact (#79) ============================== */
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
  src: ['tpuAtlantis', 'tomsBounce', 'tomsDebounce', 'tpuOp1', 'clk_xbabClick', 'clk_tpuV4', 'tpuHyper'],
  sfx: [[8.2, 'snap']], sfxLoop: [{ t0: 1.2, per: 2.6, cues: [[0, 'click'], [0.1, 'release']] }],
  jolt: t => joltAt(t, 8.1),
  draw: t => {
    header(t, 'Counted at first contact');
    captions(t, [[0.6, 'A switch has two fixed contacts. A single-throw mouse reads one of them, so it has to wait out the bounce before it trusts a press.'], [4.2, 'A double-throw switch can be read the moment the common contact leaves NC: about 1.5 ms before it even reaches NO.'], [7.6, 'The wait is real time on every click. TechPowerUp measured it on one mouse: a 4 ms debounce made it 3 ms slower.']]);
    const A = acc(), wx = LM, wy = LAY.top, ww = 700, wh = 840 - wy;
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    clk_fig(t, 0.6, wx + 28, wy + 44, 1, 'Snap-action switch, cover clear');
    const sc = clk_swc(t, 1.2, 2.6), X0 = wx + 40, Y0 = wy + 360, s = 31;
    const o = drawSwitch(X0, Y0, s, { press: sc.pr, state: sc.state, clear: true, accent: A, alpha: ep(t, 0.4, 1.0) });
    if (sc.c >= 0) { const ts = sc.c * 2.6, n = Math.floor((t - 1.2) / 2.6); clk_spark(o.contact, ts - CLK_SNAP.no * 2.6, A, 0.8, 11 + n); clk_spark(o.contact, ts - CLK_SNAP.nc * 2.6, A, 0.5, 53 + n); }
    callout(t, 1.0, o.com, 'COM', { to: [X0 + 0.6 * s, Y0 - 8.2 * s], side: 'r', color: C.ink2, tcolor: C.ink2 });
    callout(t, 1.2, o.nc, 'NC: closed at rest', { to: [X0 + 13.6 * s, Y0 - 8.6 * s], side: 'r', color: C.ink2, tcolor: C.ink2, maxW: 160, prose: true });
    callout(t, 1.4, o.no, 'NO: closed when pressed', { to: [X0 + 13.6 * s, Y0 - 1.2 * s], side: 'r', color: C.ink2, tcolor: C.ink2, maxW: 160, prose: true });
    clk_lamp(X0 + 2 * s, Y0 + 5.0 * s, 'NC', sc.state === 'nc', A, ep(t, 1.6, 2.0)); clk_lamp(X0 + 5.6 * s, Y0 + 5.0 * s, 'NO', sc.state === 'no', A, ep(t, 1.6, 2.0));
    text('Single throw reads NO only. Double throw reads both.', wx + 28, wy + wh - 26, { role: 'small', color: C.mute, alpha: ep(t, 2.0, 2.4), maxW: ww - 56 });
    /* the traces: one press, four ways of reading it */
    const rx = wx + ww + 24, rw = RM - rx, th = 372;
    demoWindow(rx, wy, rw, th, ep(t, 0.5, 0.9));
    clk_head(t, 0.9, rx, wy, rw, 'One press, four ways to read it', ['derived']);
    const x0 = rx + 250, x1 = rx + rw - 30, T = 14, X = ms => x0 + (x1 - x0) * ms / T, now = clamp((t - 1.6) / 3.4) * T;
    for (let ms = 0; ms <= T; ms += 2) { line(X(ms), wy + 70, X(ms), wy + th - 50, { color: C.hair, w: 1, alpha: ep(t, 0.9, 1.3) }); text(ms + ' ms', X(ms), wy + th - 22, { role: 'tick', color: C.mute, align: 'center', alpha: ep(t, 0.9, 1.3) }); }
    const lanes = [['SPST, new', ['new'], 5.5, 'After a 3 ms wait'], ['SPST, worn', ['worn'], 12.6, 'Still bouncing: a double click'], ['SPDT, latch on NO', ['no', 'nc'], CLK_E.no, 'At NO, no wait'], ['SPDT, NC release', ['no', 'nc'], CLK_E.nc, 'At NC: 1.5 ms sooner']];
    lanes.forEach(([label, sig, reg, note], i) => {
      const yb = wy + 120 + i * 64, amp = 34, spdt = sig.length > 1;
      text(label, rx + 26, yb - 8, { role: 'label', size: 21, color: C.ink, t, t0: 1.0 + i * 0.15, cps: 70 });
      sig.forEach((sg, j) => {
        const pts = []; let prev = clk_sig(sg, 0);
        for (let ms = 0; ms <= now; ms += 0.01) { const v = clk_sig(sg, ms); if (v !== prev) pts.push([X(ms), yb - prev * amp]); pts.push([X(ms), yb - v * amp]); prev = v; }
        poly(pts, { color: j ? C.faint : (spdt ? A : C.ink), w: 2.2, dash: j ? [5, 4] : null });
      });
      if (now > reg) {
        const good = i >= 2, col = i === 3 ? A : good ? C.ink : C.red;
        line(X(reg), yb - amp - 10, X(reg), yb + 6, { color: col, w: 3 });
        const right = X(reg) + 12 + tw(note, { role: 'small', size: 23, weight: 600 }) < x1;
        text(note, right ? X(reg) + 12 : X(reg) - 12, yb - amp + 2, { role: 'small', size: 23, weight: 600, color: col, align: right ? 'left' : 'right' });
      }
    });
    text('NO solid, NC dashed', rx + 26, wy + 120 + 3 * 64 + 26, { role: 'label', size: 19, color: C.faint, alpha: ep(t, 1.6, 2.0) });
    /* the measured cost of waiting, TechPowerUp's method throughout */
    const by0 = wy + th + 16, bh = 840 - by0;
    demoWindow(rx, by0, rw, bh, ep(t, 0.7, 1.1));
    clk_head(t, 7.0, rx, by0, rw, 'Click latency, measured by TechPowerUp', ['measured']);
    lollipop(t, { x: rx + 26, y: by0 + 110, w: rw - 300, t0: 7.2, xr: [0, 6], ticks: [0, 2, 4, 6], tfmt: v => v + ' ms', fmt: v => (v < 0.1 ? v.toFixed(3) : v.toFixed(1)) + ' ms', labelW: 470, rowH: 33, valW: 120,
      rows: [{ name: 'Razer Viper V4 Pro', qual: 'Wired, 8 kHz', v: 0.079, ref: true }, { name: 'Hitscan Hyperlight', qual: '0 ms debounce', v: 0.4 }, { name: 'Lamzu Atlantis', qual: '0 ms debounce', v: 2.4 }, { name: 'Lamzu Atlantis', qual: '4 ms debounce', v: 5.4 }] });
    slam(t, 8.1, RM - 40, by0 + bh - 46, '+3.0', 'ms', { size: 72, color: C.red, align: 'right' });
    text('Atlantis: debounce 4 ms vs 0', RM - 40, by0 + bh - 18, { role: 'label', size: 19, color: C.red, align: 'right', alpha: ep(t, 8.4, 8.8) });
    gloss(t, 2.4, 'Debounce', 'The wait a mouse adds after a contact closes, so the bouncing metal isn\'t read as extra clicks.');
    featureCard(t, 5.0, 'SPDT, read on both throws', ['measured', 'derived', 'proposal'], 'The press counts when NC opens; the NO contact confirms it, so a worn switch can\'t double click (#79).');
  }
});

/* ============================== 09. a click should never wait for motion (#79): XBAB's four tests ============================== */
let CLK_XB = null;
function clk_xbab() {
  if (CLK_XB) return CLK_XB;
  const X = (typeof RD !== 'undefined' && RD.latency) ? RD.latency.click_latency_xbab_vs_op1_8k_v2 : null;
  CLK_XB = X ? X.panels.map(p => ({ mode: p.mode, still: p.state === 'stationary', xa: p.XA25, op: p.OP1_8k_v2 })) : [];
  return CLK_XB;
}
const CLK_WAIT_STEP = [{ n: '#79', who: 'G-Wolves, Endgame Gear, Sora V3', ev: 'claim', evText: 'Maker claim', now: 'SPDT ships today. On XBAB\'s analyzer, the OP1 8k v2 adds 121 to 125 µs to a click while moving.', step: 'NC release on a path that never waits for motion: 75 µs or less, moving or still, published with n ≥ 300 and a 95% CI.' }];
clk_S({
  id: 'clk_wait', ch: 'click', theme: 'night', title: 'A click should never wait for motion', settle: 11, ideas: [79],
  src: ['clk_xbabClick', 'xbab', 'tpuOp1', 'clk_brock'],
  draw: t => {
    header(t, 'A click should never wait for motion');
    captions(t, [[0.6, 'XBAB put its XA25 against the OP1 8k v2 on a USB analyzer: two read modes, still and moving, each with its 95% confidence interval.'], [4.6, 'Still, the OP1\'s release mode is quick. Moving, the same click arrives 121 to 125 µs later: it waits behind motion.'], [8.0, 'My target: 75 µs or less, moving or still, published the same way, with n and the interval.']]);
    const A = acc(), P = clk_xbab(), sh = clk_stepsH(CLK_WAIT_STEP, RM - LM), sy = 840 - sh;
    const pw = 352, gap = 74, px0 = LM + 74, py = 360, ph = 210, top = 600, Y = v => py + ph - ph * v / top;
    legend(t, 0.5, RM, 300, [{ kind: 'ref', label: 'XBAB XA25' }, { kind: 'comp', label: 'OP1 8k v2' }, { kind: 'dash', color: C.hero, label: 'Theseus target, 75 µs' }], { align: 'right' });
    rich([{ s: 'Electrical latency, µs', role: 'label', size: 21, color: C.mute }, { s: 'Beagle USB 480 analyzer', role: 'label', size: 19, color: C.faint, gap: 18 }], LM, 300, { alpha: ep(t, 0.5, 0.9) });
    pill(LM + 600, 302, 'claim', ep(t, 0.6, 1.0));
    P.forEach((p, i) => {
      const x = px0 + i * (pw + gap), t0 = 0.8 + i * 0.5, a = ep(t, t0, t0 + 0.4);
      const mode = /NC/.test(p.mode) ? 'NC release · GX Speed' : 'SR latch · GX Safe';
      text(mode, x, py - 44, { role: 'label', size: 21, color: C.mute, alpha: a });
      text(p.still ? 'Still' : 'Moving', x, py - 14, { font: 'disp', size: 30, weight: 800, color: p.still ? C.ink2 : C.ink, caps: true, alpha: a });
      barChart(t, { x, y: py, w: pw, h: ph, t0, yr: [0, top], ticks: i ? [] : [0, 200, 400, 600], unit: 'µs', dec: 1, foot: false, labelAt: 'ci', vsize: 28, nsize: 28, barW: 0.58,
        bars: [{ name: 'XA25', v: rv(p.xa), ci: p.xa.ci95_us, n: p.xa.n, ref: true }, { name: 'OP1 8k v2', v: rv(p.op), ci: p.op.ci95_us, n: p.op.n }] });
      if (i) for (const v of [200, 400]) line(x, Y(v), x + pw, Y(v), { color: C.hair, w: 1.2, alpha: a * 0.8 });
      /* the foot: 95% CI and n, one decimal */
      [p.xa, p.op].forEach((b, j) => {
        const cx = x + pw * (j + 0.5) / 2, fa = ep(t, t0 + 0.6, t0 + 1.0);
        text('[' + b.ci95_us.map(v => v.toFixed(1)).join(', ') + ']', cx, py + ph + 72, { font: 'mono', size: 20, weight: 500, color: C.mute, align: 'center', alpha: fa });
        text('n = ' + fmt3(b.n), cx, py + ph + 98, { font: 'mono', size: 20, weight: 500, color: C.mute, align: 'center', alpha: fa });
      });
      /* the Theseus target, and what moving costs the OP1 */
      const kt = ep(t, 8.2 + i * 0.12, 8.7 + i * 0.12, E.cam);
      if (kt > 0) line(x, Y(75), x + pw * kt, Y(75), { color: C.hero, w: 3, dash: [10, 7] });
      if (!p.still) {
        const st = P.find(q => q.mode === p.mode && q.still), kd = ep(t, 5.0 + i * 0.3, 5.5 + i * 0.3);
        if (st && kd > 0) {
          const cx = x + pw * 0.75, bw2 = pw / 2 * 0.58, y0 = Y(rv(st.op)), y1 = Y(rv(p.op));
          G.save(); G.globalAlpha = kd; G.setLineDash([6, 5]); G.strokeStyle = C.red; G.lineWidth = 2.5; G.strokeRect(cx - bw2 / 2, y0, bw2, Y(0) - y0); G.restore();
          text('+' + (rv(p.op) - rv(st.op)).toFixed(1), cx, (y0 + y1) / 2 + 9, { font: 'mono', size: 24, weight: 800, color: C.red, align: 'center', alpha: kd });
        }
      }
    });
    if (!P.length) placeholderStamp(t, LM, py, RM - LM, ph);
    text('Red dashes: the same click, still. XA25 moving: no change within its interval.', LM, py + ph + 132, { role: 'small', size: 25, color: C.mute, alpha: ep(t, 5.6, 6.0) });
    pill(LM + 1010, py + ph + 134, 'derived', ep(t, 5.6, 6.0));
    clk_steps(t, 8.6, LM, sy, RM - LM, CLK_WAIT_STEP);
    gloss(t, 2.6, 'NC release', 'Counting the press when the common contact leaves NC, before it lands on NO. Endgame Gear calls it GX Speed.');
    featureCard(t, 3.0, 'Clicks first', ['claim', 'proposal'], 'XBAB\'s numbers are its own test of its own mouse: a maker claim, with the method shown (#79).');
  }
});

/* ============================== 10. every click number, with its method ============================== */
clk_S({
  id: 'clk_methods', ch: 'click', theme: 'paper', title: 'Every click number has a method', settle: 10, ideas: [79],
  src: ['xbab', 'clk_xbabClick', 'vgnClick', 'clk_razerSide', 'slxPdf', 'pcgSlx'],
  draw: t => {
    header(t, 'Every click number has a method');
    captions(t, [[0.6, 'Makers time their own clicks, each in its own way. Read a number only beside the way it was taken.'], [4.6, 'Timed from the start of the finger\'s press, analog sensing wins by milliseconds. That test was run by Finalmouse, on its own mouse.']]);
    const wy = LAY.top, h = 840 - wy, lw = 1000, lx = LM, rx = lx + lw + 24, rw = RM - rx;
    demoWindow(lx, wy, lw, h, ep(t, 0.3, 0.7));
    clk_head(t, 0.6, lx, wy, lw, 'Switch to USB, each maker\'s own test', ['claim', 'proposal']);
    lollipop(t, { x: lx + 26, y: wy + 140, w: lw - 52, t0: 0.9, xr: [0, 1.8], ticks: [0, 0.5, 1, 1.5], tfmt: v => v + ' ms', fmt: v => v.toFixed(3) + ' ms', labelW: 560, rowH: 50, valW: 130, target: { v: 0.075 },
      rows: [{ name: 'XBAB XA25', qual: '"about 65 µs"', v: 0.065, ref: true }, { name: 'XBAB XA25', qual: 'NC release, still', v: 0.07204 }, { name: 'VGN Dragonfly 3 MGT', qual: '"as low as"', v: 0.175 },
        { name: 'Finalmouse SLX', qual: '"end to end"', v: 0.223 }, { name: 'Endgame Gear OP1 8k v2', qual: 'GX Speed, by XBAB', v: 0.32029 }, { name: 'Razer Viper V4 Pro', qual: 'side buttons', v: 0.33 }, { name: '"Brand X"', qual: 'side buttons, per Razer', v: 1.65 }] });
    const kt = ep(t, 2.2, 2.6);
    rich([{ s: 'Theseus target', role: 'label', size: 21, color: C.onHero, chip: C.heroChip }, { s: '75 µs, moving or still', role: 'label', size: 21, color: C.heroText, gap: 16 }], lx + 26 + 560 + (lw - 52 - 560 - 130 - 20) * 0.075 / 1.8 + 12, wy + 108, { alpha: kt });
    text('Methods differ: the bars share an axis, not a test.', lx + 26, wy + h - 22, { role: 'small', size: 25, color: C.mute, alpha: ep(t, 2.6, 3.0) });
    /* end to end, from the start of the press */
    demoWindow(rx, wy, rw, h, ep(t, 0.5, 0.9));
    clk_head(t, 4.4, rx, wy, rw, 'From the start of the press', ['claim']);
    barChart(t, { x: rx + 250, y: wy + 112, w: rw - 330, h: 300, dir: 'h', t0: 4.6, yr: [0, 8], ticks: [0, 2, 4, 6, 8], fmt: v => v + ' ms', unit: 'ms', dec: 1, barW: 0.62, foot: false,
      bars: [{ name: 'Finalmouse SLX', sub: 'TMR-DS', v: 2.0, ref: true }, { name: 'Superstrike', sub: 'Inductive', v: 3.0 }, { name: 'OP1 8K V2', sub: 'Mechanical', v: 5.7 }, { name: 'Viper V4 Pro', sub: 'Optical', v: 7.5 }] });
    text('Finalmouse\'s rig: copper tape and a press machine, 50 clicks each, a pre-production SLX at its shallowest setting.', rx + 26, wy + h - 92, { role: 'small', size: 25, color: C.mute, maxW: rw - 52, lh: 1.36, alpha: ep(t, 5.6, 6.0) });
    gloss(t, 3.2, 'Click latency', 'The time from a press to its report reaching the computer. Where the clock starts, at the switch or at the finger, changes the number by milliseconds.');
    featureCard(t, 6.2, 'Published, with the method', ['proposal'], 'I\'ll publish Theseus on XBAB\'s analyzer method and on a finger-press rig, with n and the interval for both.');
  }
});
/* ============================== 11. a magnetic sensor under each main button ============================== */
/** one press as a button sensor sees it: travel in mm against time in ms (an illustration on the example switch) */
function clk_travel(ms) {
  const seg = (a, b, v0, v1) => v0 + (v1 - v0) * E.io3(clamp((ms - a) / (b - a)));
  if (ms < 10) return 0; if (ms < 18) return seg(10, 18, 0, 0.03); if (ms < 30) return 0.03;
  if (ms < 48) return seg(30, 48, 0.03, 0.8); if (ms < 70) return 0.8; if (ms < 88) return seg(70, 88, 0.8, 0.03);
  if (ms < 104) return 0.03; if (ms < 112) return seg(104, 112, 0.03, 0); return 0;
}
const CLK_MAG = (() => { let fire = 0, rel = 0, rt = 0; for (let ms = 0; ms < 120; ms += 0.05) { const d = clk_travel(ms); if (!fire && ms < 60 && d >= 0.5) fire = ms; if (!rt && ms > 60 && d <= 0.58) rt = ms; if (!rel && ms > 60 && d <= 0.3) rel = ms; } return { fire, rel, rt, t0: 1.4, dur: 4.4 }; })();
const clk_magT = ms => CLK_MAG.t0 + CLK_MAG.dur * ms / 120;
const CLK_MAG_STEP = [
  { n: 'Mag', who: 'Finalmouse SLX, TMR-DS', ev: 'claim', evText: 'Maker claim', now: '40 steps of 0.01 mm; reviewers flag a learning curve and drop-only stock.', step: 'Each button learns its own switch\'s snap and fires there, nothing to tune; manual millimetres stay for experts.' },
  { n: 'Mag', who: 'Logitech Superstrike', ev: 'claim', evText: 'Maker claim', now: 'Inductive, 0.6 mm, 10 levels and haptics; many players stay at level 3 or 4.', step: 'Actuation and release points published per button, in mm, with their spread over 1,000 clicks.' }
];
clk_S({
  id: 'magbuttons', ch: 'click', theme: 'night', title: 'A sensor under each main button', settle: 11, ideas: ['magnetic'],
  src: ['slxPdf', 'slxXt', 'slxB2g', 'logiSuperstrike', 'pcgSlx', 'kunai'],
  sfx: [[clk_magT(CLK_MAG.fire), 'click'], [clk_magT(CLK_MAG.rel), 'release']],
  draw: t => {
    header(t, 'A sensor under each main button');
    captions(t, [[0.6, 'A switch tells the mouse pressed or not. A magnetic sensor under the button tells it where the button is, all the time.'], [3.4, 'So the click can fire exactly at the snap, let go the instant it snaps back, or let go early for rapid trigger.'], [7.0, 'Finalmouse and Logitech already sense travel. The step past them: learn each switch\'s own snap, and publish how tightly clicks land.']]);
    const A = acc(), sh = clk_stepsH(CLK_MAG_STEP, RM - LM), sy = 840 - sh, wx = LM, wy = LAY.top, ww = 1060, wh = sy - 18 - wy;
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    clk_head(t, 0.8, wx, wy, ww, 'One press, as the sensor sees it', ['proposal']);
    const px0 = wx + 150, px1 = wx + ww - 40, py0 = wy + 84, py1 = wy + wh - 72, X = ms => px0 + (px1 - px0) * ms / 120, Y = d => py0 + (py1 - py0) * d / 0.8, a0 = ep(t, 1.0, 1.4);
    for (const ms of [0, 20, 40, 60, 80, 100, 120]) { line(X(ms), py0, X(ms), py1, { color: C.hair, w: 1, alpha: a0 }); text(ms + ' ms', X(ms), py1 + 30, { role: 'tick', color: C.mute, align: 'center', alpha: a0 }); }
    for (const d of [0, 0.4, 0.8]) text(d.toFixed(1) + ' mm', px0 - 14, Y(d) + 7, { role: 'tick', color: C.mute, align: 'right', alpha: a0 });
    text('Travel', px0 - 14, py1 + 30, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: a0 });
    for (const [d, l] of [[0.5, 'Snaps closed, 0.5 mm'], [0.3, 'Snaps open, 0.3 mm']]) { line(px0, Y(d), px1, Y(d), { color: C.faint, w: 1.2, dash: [6, 5], alpha: ep(t, 1.2, 1.6) }); text(l, px1 - 8, Y(d) - 10, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: ep(t, 1.2, 1.6) }); }
    const now = clamp((t - CLK_MAG.t0) / CLK_MAG.dur) * 120;
    const tru = [], rd = []; for (let ms = 0; ms <= now; ms += 0.2) { const d = clk_travel(ms); tru.push([X(ms), Y(d)]); const q = Math.round(d / 0.01) * 0.01; if (rd.length) rd.push([X(ms), rd[rd.length - 1][1]]); rd.push([X(ms), Y(q)]); }
    poly(tru, { color: inkA(0.35), w: 5 }); poly(rd, { color: A, w: 2 });
    if (now > 0 && now < 120) { circle(X(now), Y(clk_travel(now)), 6, { fill: A }); circle(X(now), Y(clk_travel(now)), 12, { color: A, w: 1.5, alpha: 0.4 }); }
    const mark = (ms, label, col, dash, ly, left) => { const k = ep(t, clk_magT(ms), clk_magT(ms) + 0.3); if (k <= 0) return; line(X(ms), py0, X(ms), py1, { color: col, w: 2.5, dash, alpha: k }); text(label, X(ms) + (left ? -10 : 10), ly, { role: 'small', size: 25, weight: 600, color: col, alpha: k, align: left ? 'right' : 'left' }); };
    mark(CLK_MAG.fire, 'Fires at the snap', A, null, py0 + 26);
    mark(CLK_MAG.rt, 'Rapid trigger lets go here', C.ink, [5, 4], py1 - 16, true);
    mark(CLK_MAG.rel, 'Release at the snap back', A, null, Y(0.68));
    const kf = ep(t, clk_magT(18), clk_magT(18) + 0.4); text('A finger resting on it', X(4), Y(0.03) + 40, { role: 'small', size: 25, weight: 600, color: C.ink2, alpha: kf });
    /* the step: a marker locks onto the learned snap; later clicks land in a tight band (an illustration, no data yet) */
    const kl = ep(t, 7.4, 8.0);
    if (kl > 0) {
      const r = rng(5), xs = X(CLK_MAG.fire);
      for (let i = 0; i < 26; i++) { const dx = (r() - 0.5) * 9 * (1 - 0.6 * kl); circle(xs + dx, Y(0.5) + (r() - 0.5) * 6, 3.2, { fill: A, alpha: 0.5 * kl }); }
      rr(xs - 10, Y(0.5) - 15, 20, 30, 4, null, A, 2.5, kl);
      text('Learned snap', xs + 18, Y(0.5) + 36, { role: 'label', size: 21, color: A, alpha: kl });
      text('Illustration: no data yet', px1 - 8, py0 + 26, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: kl });
    }
    text('Colour: what the sensor reports, in 0.01 mm steps. Grey: the button.', wx + 26, wy + wh - 20, { role: 'small', size: 25, color: C.faint, alpha: ep(t, 2.0, 2.4), maxW: ww - 52 });
    /* who already senses travel */
    const rx = wx + ww + 24, rw = RM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    clk_head(t, 0.9, rx, wy, rw, 'Who already reads the travel', ['claim']);
    const blocks = [['Finalmouse SLX, TMR-DS', 'A magnet per button, 40 steps of 0.01 mm. A Huano switch still clicks.'], ['Logitech Superstrike', 'Inductive sensing over 0.6 mm, 10 levels, haptics for the click.'], ['Kunai, pre-production', 'Fires at each switch\'s own snap and learns it. Not shipping yet.']];
    let yy = wy + 104;
    blocks.forEach(([h2, b], i) => { const k = ep(t, 1.2 + i * 0.5, 1.6 + i * 0.5); text(h2, rx + 26, yy, { role: 'label', size: 21, color: A, alpha: k }); const r2 = text(b, rx + 26, yy + 38, { role: 'small', color: C.ink2, t, t0: 1.3 + i * 0.5, cps: 130, maxW: rw - 52, lh: 1.36 }); yy += 38 + r2.h + 24; });
    clk_steps(t, 8.4, LM, sy, RM - LM, CLK_MAG_STEP);
    gloss(t, 2.4, 'TMR', 'Tunnel magnetoresistance: a sensor whose resistance follows a magnet\'s field closely enough to read a hundredth of a millimetre.');
    featureCard(t, 5.4, 'A sensor per button', ['claim', 'proposal'], 'Magnetic sensing for timing, rapid trigger and a resting finger; the switch stays for the snap you feel.');
  }
});

/* ============================== 12. side buttons on rails (#80), through slots in the side PCB (#83) ============================== */
clk_S({
  id: 'sidebuttons', ch: 'click', theme: 'paper', title: 'Side buttons on rails', settle: 10, ideas: [80, 83],
  src: ['clk_brock'], three: ['shell'],
  sfxLoop: [{ t0: 2.4, per: 2.6, cues: [[0, 'click'], [0.1, 'release']] }],
  draw: t => {
    header(t, 'Side buttons on rails');
    captions(t, [[0.6, 'A hinged side button is a lever: press near the hinge and it takes far more force than at the tip.'], [3.4, 'On rails the whole button slides straight in, so it feels the same wherever your thumb lands.'], [6.4, 'The rails run through slots in the side PCB, so the shell needs no rail features of its own.']]);
    const A = acc(), wx = LM, wy = LAY.top, ww = 820, wh = 840 - wy;
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    clk_fig(t, 0.6, wx + 28, wy + 44, 4, 'A side button in section, pressed downward');
    const pr = clk_curve(cyc(t, 2.4, 2.6)), o = part(wx + 300, wy + 200, 19, () => railMM({ press: pr, accent: A }), { alpha: ep(t, 0.4, 0.9) });
    callout(t, 1.2, o.rail, 'Two POM rails', { to: [wx + 580, wy + 170], side: 'r', color: A });
    callout(t, 1.5, o.boardSlot, 'Slots in the side PCB guide them (#83)', { to: [wx + 580, wy + 300], side: 'r', color: A, maxW: 210, prose: true });
    callout(t, 1.8, o.hook, 'Hooks set the end of travel', { to: [wx + 580, wy + 430], side: 'r', color: A, maxW: 210, prose: true });
    keyPlan(t, 1.0, wx + 110, wy + wh - 120, { s: 0.55, hi: 'side', cut: { type: 'cross', y: -18, label: 'B' }, label: 'Section B' });
    /* the shell's side buttons, sliding on their rails */
    const cx = wx + ww + 24, cw = RM - cx, ch = 296;
    demoWindow(cx, wy, cw, ch, ep(t, 0.5, 0.9));
    clk_head(t, 0.9, cx, wy, cw, 'Theseus, left side', ['proposal']);
    const s0 = clk_curve(cyc(t, 2.4, 2.6)), s1 = clk_curve(cyc(t, 3.7, 2.6));
    clk_v3('shell', t, cx + 10, wy + 52, cw - 20, ch - 60, { view: 'right', yaw: -0.18, pitch: -0.08, zoom: in2D(2.3, 1.5), side0: s0, side1: s1, target: in2D([20, 19, 2], [20, 22, 4]), hi2d: { re: /^side(Front|Rear)/, color: A, w: 2.6 } }, { alpha: ep(t, 1.0, 1.6) });
    /* force needed against where the thumb lands */
    const fy = wy + ch + 16, fh = 840 - fy;
    demoWindow(cx, fy, cw, fh, ep(t, 0.7, 1.1));
    clk_head(t, 1.1, cx, fy, cw, 'Force needed, by where you press', ['derived']);
    const m = axes(t, { x: cx + 96, y: fy + 76, w: cw - 140, h: fh - 176, xr: [0.15, 1], yr: [0, 4], xticks: [0.2, 0.4, 0.6, 0.8, 1], yticks: [0, 2, 4], xfmt: v => Math.round(v * 100) + '%', yfmt: v => v + '×', xlabel: 'Press position, from the hinge end', t0: 1.2 });
    const hinge = []; for (let d = 0.15; d <= 1.001; d += 0.01) hinge.push([d, 0.6 / d]);
    series(m, hinge, { color: C.red, w: 3, p: ep(t, 1.5, 2.6, E.lin) });
    series(m, [[0.15, 1], [1, 1]], { color: A, w: 3.5, p: ep(t, 2.4, 3.2, E.lin) });
    text('Hinged: F ∝ 1 / distance', m.X(0.3), m.Y(3.3), { role: 'small', size: 25, weight: 600, color: C.red, alpha: ep(t, 2.4, 2.8) });
    text('On rails: the same everywhere', m.X(0.5), m.Y(1) - 16, { role: 'small', size: 25, weight: 600, color: A, alpha: ep(t, 3.0, 3.4) });
    gloss(t, 3.4, 'Dual rail', 'The button slides straight in on two guides, like a keyboard switch, instead of bending on a hinge.');
    featureCard(t, 6.0, 'Side buttons on rails', ['derived', 'proposal'], 'The buttons ride on rails (#80) through slots in the side PCB (#83). The divider, the PCB and its support are on the next sheet.');
  }
});
