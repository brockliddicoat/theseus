/* ============================================================================================
   V6 (2026-11-06): move 6 of the v23 refinement, "More hours from the same battery". Brock (15:12, 15:15): "show the steps
   to level something up to where it becomes the best, it has to be a process"; "the concepts should visible and statically
   show how they build upon one another and combine to supercharge and compound on eachother"; 15:57 (F64.4): "whenever
   theseus does something that is better than best in class, those bars overfill"; 17:08 (F64.11): "the battery should only
   need to be 300mah ... beat the viper v4 pro battery with the same size battery as it using much newer and optimized
   firmware and no opticals".
   - V6_OPT: what an optical switch costs at each polling rate, from Logitech's own hours for the G Pro X Superlight 2 in
     optical and hybrid modes at 1, 2 and 4 khz (TechPowerUp, from G HUB's calculator). It is the basis of the 8 khz hours:
     the deck (ntr_hours) takes the Viper V4 Pro's switches at the same share of its draw at 8 khz as at 1 khz (13.7 %), which
     needs them to cost 1.05 mA there; Logitech's figures have the cost climbing with the rate (0.23, 0.52, 0.86 mA), not
     fixed (a fixed 0.23 mA would leave Theseus 38.6 h at 8 khz, under the Viper's 40). Said on the power slide.
   - v6_cardStat(): move 6's card line (FILM.moves[6].stat).
   - powerup: move 6's last beat. Theseus's three bars that move 6 finishes (density, battery, motion latency) fill step by
     step in the order of the moves that earned them (2, 3; 5; move 4's switches banked for the battery), then move 6
     lands on all three at once: they reach the line together and overfill together. Figures read from LO's table (the dock's
     own), nothing typed here.
   Runs after 25-film.js's top level only inside draw functions (FILM, LO, lo_* are read at draw time).
   ============================================================================================ */
Object.assign(SRC, {
  v6Gpx2Rates: { t: 'TechPowerUp, Logitech G Pro X Superlight 2 review, page 7 (from G HUB\'s battery calculator, 290 mAh): "if set to 1000 Hz, battery life will be 96 hours in optical switch mode and 104 hours in hybrid switch mode"; "Set to 2000 Hz, battery life will be 55 hours in optical switch mode and 61 hours in hybrid switch mode"; "at 4000 Hz, battery life will be 42 hours in optical switch mode and 48 hours in hybrid switch mode". The two switches\' optics cost 290/96 − 290/104 = 0.23 mA, 0.52 mA and 0.86 mA: derived', u: 'https://techpowerup.com/review/logitech-g-pro-x-superlight-2/7.html' }
});
/** what the two optical switches cost at each rate (Logitech's hours, 290 mAh), and the cost the deck's 8 khz hours assume
   for the Viper V4 Pro's (its 1 khz share of its 8 khz draw: 306 mAh over TechPowerUp's 40 h) */
const V6_OPT = (() => {
  const mAh = 290, rows = [[1, 96, 104], [2, 55, 61], [4, 42, 48]].map(([khz, hO, hH]) => ({ khz, mA: mAh / hO - mAh / hH, share: (mAh / hO - mAh / hH) / (mAh / hO) }));
  let share1 = 0.1367; try { share1 = ntr_swKeep().opt; } catch (e) { /* the same formula, before 14-b runs */ }
  const v4mA8 = 306 / 40, need8 = share1 * v4mA8;
  /* the fixed case: the Viper's switches at their 1 khz cost at 8 khz too (energy method, as ntr_hours) */
  let fixed8 = null;
  try { const H = ntr_hours(), L = H.L, S = H.S, wSw = L.w1 * S.opt, wMech = L.w1 * S.mech; fixed8 = H.cell.wh / (L.w8 - wSw + wMech); } catch (e) { fixed8 = null; }
  return { rows, share1, v4mA8, need8, fixed8, climb: rows[2].mA / rows[0].mA };
})();
/** a current as the slide prints it: two decimals, never rounded our way (the switches' cost is a rival's: floored) */
const v6_mA = v => (Math.floor(v * 100 + 1e-9) / 100).toFixed(2);

/** move 6's card line: the battery against the pack it replaced (the ledger's), and the hours, derived */
function v6_cardStat() {
  try {
    const L = filmLedger(), ln = L && L.lines.find(l => l.move === 6), H = ntr_hours(); if (!ln) return null;
    const o = ln.old, c = L.B.cell;
    return c.mAh + ' mAh, about ' + fmtN(c.g, 1) + ' g (' + c.maker + '), not a ' + o.mAh + ' mAh pack at ' + fmtN(o.g, 0) + ' g (' + o.maker + ', rounded): about ' + fmtN(o.g - c.g, 1) + ' g off, ' + THS.massG + ' in all. ' +
      THESEUS.hours + ' h at 1 khz and ' + Math.floor(H.h8 + 1e-9) + ' at 8 khz, derived without the Viper V4 Pro’s optical switches, before any firmware gains.';
  } catch (e) { return null; }
}

/* ============================== powerup: three bars past the line (move 6's last beat) ============================== */
/* the timeline: the rows set (0.5); the steps moves 2, 3 and 5 earned land in their order, move 4's switches banked beside
   the battery (1.1 to 3.3); move 6's chips (4.0); the three bars run to the line together (4.5 to 5.2) and over it together
   (5.2 to 5.9), each overflow ringing once; the figures and the lines they passed (5.9 on); the close (7.4) */
const V6_UP_T = { rows: 0.5, m: { 2: 1.1, 3: 1.8, 4: 2.5, 5: 3.2 }, six: 4.0, run: 4.5, line: 5.2, over: 5.9, figs: 5.9, close: 7.4 };
/** the three bars move 6 finishes, in the loadout's order, with what move 6 adds to each */
function v6_upRows() {
  const T = lo_table(), H = (() => { try { return ntr_hours(); } catch (e) { return null; } })(), Ld = (() => { try { return filmLedger(); } catch (e) { return null; } })();
  const ln6 = Ld && Ld.lines.find(l => l.move === 6), save = ln6 ? fmtN(ln6.old.g - Ld.B.cell.g, 1) : null;
  const row = (key, o) => { const c = lo_cat(key), b = T.best[key], th = T.ths[key]; return Object.assign({ c, b, th, F: th.f, N: (c.earn || []).length || 1 }, o); };
  return [
    row('density', { what: 'A battery ' + (save ? save + ' g' : '') + ' lighter, on moves 2 and 3’s shell', how: 'Derived: the weight over its box', lineNote: 'wired' }),
    row('battery', { what: 'The Viper’s battery size, with nothing lit but the sensor', how: 'Derived, before any firmware gains', bank: 4, bankS: 'No optical switches' }),
    row('motion', { what: 'Move 5’s frames, sent at 8 khz, synced to each poll', how: 'Target: Kunai’s timing model' })
  ];
}
/** a move's chip: a numbered node, as the build board draws them. lit: 0..1 (hollow to blue); a: alpha */
function v6_chip(x, y, n, lit, a, r = 15) {
  if (a <= 0.003) return;
  G.save(); G.globalAlpha = a;
  G.beginPath(); G.arc(x, y, r, 0, TAU); G.fillStyle = C.bg; G.fill();
  if (lit > 0.003) { G.globalAlpha = a * lit; G.fillStyle = C.hero; G.fill(); G.globalAlpha = a; }
  G.lineWidth = 2; G.strokeStyle = lit > 0.5 ? C.heroText : inkA(TH ? 0.45 : 0.5); G.stroke();
  G.restore();
  text(String(n), x, y + 7, { role: 'label', size: 19, weight: 800, color: lit > 0.5 ? (HUE === 'yellow' ? '#111111' : '#FFFFFF') : C.mute, align: 'center', alpha: a, track: 0 });
}
S({ id: 'powerup', ch: 'elec', theme: 'night', title: 'Three bars past the line', settle: 9.8, loSelf: true,
  src: ['exPiaknow', 'kunai', 'exRtings', 'exXbabWeight', 'ntrEemb', 'ntrJauch', 'b01Optical', 'ntrTpuV4', 'v6Gpx2Rates'],
  draw: t => {
    header(t, 'Three bars past the line');
    const T = V6_UP_T, R = v6_upRows();
    captions(t, [[0.3, 'Before move 6, none of these bars had reached the best flagship’s line. Moves 2, 3 and 5 had filled them part of the way.'],
      [T.six - 0.3, 'Move 6 spends what they handed on: move 4’s idle switches buy the hours, move 5’s frames go out at 8 khz, the lighter battery finishes the shell’s density.'],
      [T.close, 'Three bars past the line at once, from one move built on four. Each giant fills one or two by giving others up.']]);
    /* the geometry: names at the left, the bars, the figures at the right; one line through all three rows */
    const bx = 600, L = 600, bh = 26, y0 = 352, rh = 196, figX = bx + L * LO.max + 56, kRows = ep(t, T.rows - 0.4, T.rows + 0.2);
    const xLine = bx + L, yTop = y0 - 36, yBot = y0 + 2 * rh + bh + 74;
    /* the steps each bar had before move 6, landing in the order of the moves that earned them */
    const before = r => (r.c.earn || []).filter(m => m < 6);
    const dOf = r => before(r).reduce((s, m) => s + ep(t, T.m[m], T.m[m] + 0.55, E.snap), 0);
    /* move 6, on all three at once: to the line together, then over it together */
    const kRun = ep(t, T.run, T.line, E.io3), kOver = ep(t, T.line, T.over, E.out3), kSolid = ep(t, T.run, T.run + 0.25);
    /* the line: one for all three rows, lit as the bars reach it together */
    { const kL = ep(t, T.rows, T.rows + 0.5), kHit = env(t, T.line - 0.05, T.line + 0.1, T.line + 0.5, T.line + 1.4);
      line(xLine, yTop, xLine, yBot, { color: C.ink2, w: 2, alpha: kL });
      if (kHit > 0.003) { G.save(); G.shadowColor = rgba(C.hero, 0.9); G.shadowBlur = 18; line(xLine, yTop, xLine, yBot, { color: C.heroText, w: 3.5, alpha: kHit }); G.restore(); }
      text('The line: the best flagship', xLine - 12, yTop - 16, { role: 'label', size: 20, color: C.mute, align: 'right', alpha: kL });
      text('Past it', xLine + 12, yTop - 16, { role: 'label', size: 20, color: C.heroText, alpha: ep(t, T.line, T.line + 0.4) }); }
    R.forEach((r, i) => {
      const y = y0 + i * rh, by = y + 22, N = r.N, F = r.F, dB = dOf(r), fB = dB / N;
      /* the name, what it measures, and what move 6 adds */
      text(r.c.name, LM, y + 12, { role: 'h3', size: 32, weight: 800, color: C.ink, alpha: kRows, sentence: false });
      text(r.c.ms, LM, y + 44, { role: 'small', size: 20, weight: 600, color: C.mute, alpha: kRows, sentence: false });
      text('Move 6: ' + r.what, LM, y + 92, { role: 'small', size: 21, weight: 650, color: C.heroText, alpha: ep(t, T.six, T.six + 0.4), maxW: bx - LM - 40, lh: 1.3, sentence: false });
      /* the bar: its steps before move 6 at half strength, then solid as move 6 runs it to the line and past */
      if (kSolid < 1) lo_bar(bx, by, L, bh, { f: fB, ths: true, d: dB, N, a: kRows * (1 - kSolid), tick: false });
      if (kSolid > 0) { const f = kOver > 0 ? lerp(1, F, kOver) : lerp(before(r).length / N, 1, kRun);
        lo_bar(bx, by, L, bh, { f, ths: true, d: N, N, a: kRows * kSolid, tick: false, pulse: prog(t, T.line, T.line + 0.9) }); }
      /* under each step, the move that earned it; the battery's step is move 6's, on move 4's switches (banked, no step) */
      const X = v => bx + Math.min(v, LO.max) * L, cy = by + bh + 32;
      (r.c.earn || []).forEach((m, j) => {
        const six = m === 6, a1 = six ? Math.min(F, LO.max) : (j + 1) / N, cx = (X(j / N) + X(a1)) / 2;
        const ka = six ? ep(t, T.six, T.six + 0.35, E.snap) : ep(t, T.m[m] - 0.1, T.m[m] + 0.3), lit = six ? ep(t, T.run, T.run + 0.4) : ep(t, T.m[m] + 0.2, T.m[m] + 0.5);
        v6_chip(cx, cy, m, lit, ka * kRows);
      });
      if (r.bank) {
        const kb = ep(t, T.m[r.bank] - 0.1, T.m[r.bank] + 0.3), cx = bx + 22;
        v6_chip(cx, cy, r.bank, ep(t, T.m[r.bank] + 0.2, T.m[r.bank] + 0.5) * (1 - 0.5 * ep(t, T.run, T.run + 0.4)), kb * kRows);
        text(r.bankS + ': banked for move 6', cx + 26, cy + 7, { role: 'small', size: 20, weight: 650, color: C.ink2, alpha: kb * (1 - ep(t, T.six - 0.2, T.six + 0.1)), sentence: false });
        /* banked: an arrow from move 4's chip to move 6's as move 6 spends it */
        const c6 = (X(0) + X(Math.min(F, LO.max))) / 2, ka = ep(t, T.six + 0.1, T.six + 0.6, E.io3);
        if (ka > 0.003) arrow(cx + 20, cy, lerp(cx + 20, c6 - 22, ka), cy, { color: C.hero, w: 2.2, hs: 8, p: 1, alpha: ka });
      }
      /* the figures: Theseus's, then the line it passed */
      const kf = ep(t, T.figs + i * 0.2, T.figs + 0.4 + i * 0.2), th = r.th, b = r.b;
      if (kf > 0.003 && b) {
        rich([{ s: fmtN(th.v, r.c.dec), font: 'disp', size: 58, weight: 800, color: C.heroText, grad: C.heroGrad, tnum: true }, { s: r.c.unit, font: 'disp', size: 26, weight: 700, color: C.heroText, gap: 8, caps: false }], figX, by + bh - 2, { alpha: kf });
        text(r.how, figX, by + bh + 30, { role: 'small', size: 19, weight: 600, color: C.mute, alpha: kf, sentence: false });
        rich([{ s: 'The line', role: 'label', size: 19, color: C.mute }, { s: b.who.brand + ' ' + b.who.name + ', ' + lo_fmt(r.c, b) + (r.lineNote ? ', ' + r.lineNote : ''), role: 'small', size: 20, weight: 650, color: C.secondText, gap: 10, sentence: false }], figX, by + bh + 62, { alpha: kf });
      }
    });
    source(t, 'The line in each bar is the best of the giants’ slide: density as weighed over its box (the XA25 on XBAB’s scale), battery as rated at 1 khz, motion at 8 khz on PIAKNOW’S rig. Theseus: ' + THS.massG + ' over its box; ' + THS.hours + ' derived (EEMB’s 300 mAh at the Viper V4 Pro’s draw less its optical switches); 0.14 ms a target.', { t0: 1.2, maxW: RM - LM });
  }
});
