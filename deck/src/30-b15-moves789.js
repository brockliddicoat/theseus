/* ============================================================================================
   V7 (2026-11-06): moves 7, 8 and 9 of the v23 refinement ("A finish that weighs nothing", "Built to be opened", "Zero
   compromises"). Brock (15:12, 15:15): "show the steps to level something up to where it becomes the best, it has to be a
   process"; "every slide should feel like it's pushing towards a compounding goal"; 15:57 (F64.4): Theseus's bars "fill up
   throughout the presentation"; the cover's tile (F64.14): 0 compromises, three bars to the line, "no tradeoffs".
   - v7_cardStat(n): the line under the loadout on the cards of moves 7, 8 and 9 (FILM.moves[n].stat). Moves 7 and 8 fill no
     bar (density's steps are moves 2, 3 and 6), so their cards say what they gain, as V5's move 4 card does; move 7's says
     what it keeps: the finish decides whether move 6's density lead survives (soft-touch on this shell weighs as much as the
     whole lead).
   - everybar: move 9's payoff, before the close. The giants' loadouts again (move 0's 'No flagship fills every bar'), on the
     three score bars the cover's tile shows, each giant's shortfall in red and its count of bars short of the line; then
     Theseus's row runs to the line and past it on all three at once, its count 0 (the cover's "0 compromises", earned here
     where the cover showed the target); then the build board comes up from the dock, complete, every move's link into the
     close lighting in turn.
   Figures: LO's table (the dock's own), B08, B08H, B11, OWN_FEEL, B03, ntr_thsBox, THESEUS: nothing typed here.
   Runs before 25-film.js (build order): FILM, LO and lo_* are read only inside functions, at draw time.
   ============================================================================================ */
const v7_dn = (v, d) => (Math.floor(v * Math.pow(10, d) + 1e-9) / Math.pow(10, d)).toFixed(d);
/** how much weight Theseus could add before its density met the XA25's line: the best density times Theseus's box, less its
   mass (derived; floored, never rounded our way) */
function v7_margin() { try { const T = lo_table(), bx = ntr_thsBox(); return T.best.density.v * bx.v - THESEUS.mass; } catch (e) { return null; } }
/** a giant's bars short of the line on the three score bars: measured short, or wired only (no battery, no radio). A blank
   (no rating, not measured) is not counted: it is unknown, not given up */
function v7_short(r) {
  let n = 0, unk = 0;
  for (const k of ['density', 'battery', 'motion']) { const x = r[k]; if (x.v != null) { if ((x.f || 0) < 0.995) n++; } else if (x.bad) n++; else unk++; }
  return { n, unk };
}
function v7_cardStat(n) {
  try {
    if (n === 7) {
      const m = v7_margin(), F = B08.film, g = Math.floor(B08.mu.gain * 100 + 1e-9);
      return 'No bar to fill: the finish has to keep density past the line move 6 set. Theseus’s lead over the XA25 there is ' + v7_dn(m, 2) + ' g (derived); soft-touch on this shell weighs ' + fmtN(F.softG, 2) + ' g or more: all of it. Cerakote’s ' + F.um + ' µm film adds about nothing once the blast takes its share, and its etch grips ' + g + ' % more where you pull, with no tape at all.';
    }
    if (n === 8) {
      const tools = B11.gpw.tools.filter(k => k !== 'heat').length;
      return 'No bar to fill. What it gains: ' + tools + ' tools to 1 to swap a worn switch (iFixit’s list for the G Pro Wireless); a joint that feels different after a re-screw ' + OWN_FEEL.insert + ' % of the time, not ' + OWN_FEEL.cf + ' % (Brock’s estimate); ' + v7_dn(B11.brass20, 1) + ' % of the hold after 20 heavy loads (3D People); ' + kitNum(B03.cycles, 0) + ' swaps a socket (Mill-Max).';
    }
    if (n === 9) {
      const T = lo_table(), all = T.rows.every(r => v7_short(r).n >= 1);
      return 'Density, battery and motion latency past the line together, the volume kept full' + (all ? ': every giant leaves at least one bar short of it.' : '.');
    }
  } catch (e) { return null; }
  return null;
}

/* ============================== everybar: Theseus fills every bar (move 9) ============================== */
const V7_Z = { hy: 298, y0: 368, rh: 46, yT: 718, x0: 560, cw: 340, cnt: 1604, silX: 120, sil: 0.48, nameX: 172, bh: 12 };
/* the timeline: the giants' bars (0.2 to 1.6), their counts (1.6 to 2.3); Theseus's row (2.6), its bars to the line together
   (3.0 to 4.1) and over it together (4.1 to 4.8), its 0 (5.0); the board comes up (5.8) and each move's link into the
   close lights in turn (6.3 on); the last caption (7.9) */
const V7_ZT = { bars: 0.2, row: 0.14, cnt: 1.6, ths: 2.6, run: 3.0, line: 4.1, over: 4.8, zero: 5.0, board: 5.8, arcs: 6.3, per: 0.17, fin: 7.9 };
const V7_ZB = { x0: 430, x1: 1580, y: 898, r: 13, h1: 14, h9: 92 };
S({ id: 'everybar', ch: 'end', theme: 'night', title: 'Theseus fills every bar', settle: 10, loSelf: true,
  src: ['exRtings', 'b01TpuHtsU', 'b01GwHtsU', 'b01GwPlusPro', 'brockWeighed', 'xbabSite', 'b01X2f', 'exEloshapes', 'exNbcV4', 'logiSuperstrike', 'b01SlxBatt', 'exPiaknow', 'kunai', 'ntrEemb', 'b01Optical'],
  draw: t => {
    header(t, 'Theseus fills every bar');
    const Z = V7_Z, T = V7_ZT, LT = lo_table(), cols = ['density', 'battery', 'motion'].map(lo_cat), L = Math.floor((Z.cw - 52) / LO.max);
    captions(t, [[0.3, 'Move 0’s loadouts again, on the three bars that score. Each giant fills one or two and gives the others up: red is what it gives up.'],
      [T.ths - 0.2, 'Theseus, nine moves later: density, battery and motion latency past the line together, and nothing given up for any of them.'],
      [T.fin, 'No move traded for another: each was built on the ones before it and handed its gain to the next. Zero compromises.']]);
    const cx = i => Z.x0 + i * Z.cw, lastY = Z.yT + 30, a0 = ep(t, -1, 0);
    /* the column heads, and one line through every row of each */
    cols.forEach((c, i) => {
      text(c.name, cx(i), Z.hy, { role: 'label', size: 21, color: C.ink, alpha: a0 });
      text(c.mt5 || c.mt, cx(i), Z.hy + 26, { role: 'foot', size: 19, weight: 600, color: C.mute, alpha: a0, sentence: false });
      const kHit = env(t, T.line - 0.05, T.line + 0.1, T.line + 0.5, T.line + 1.4);
      line(cx(i) + L, Z.y0 - 24, cx(i) + L, lastY, { color: C.ink2, w: 1.6, alpha: 0.55 * a0 });
      if (kHit > 0.003) { G.save(); G.shadowColor = rgba(C.hero, 0.9); G.shadowBlur = 16; line(cx(i) + L, Z.y0 - 24, cx(i) + L, lastY, { color: C.heroText, w: 3.2, alpha: kHit }); G.restore(); }
    });
    text('Compromises', Z.cnt, Z.hy, { role: 'label', size: 21, color: C.ink, alpha: a0 });
    text('bars short of the line', Z.cnt, Z.hy + 26, { role: 'foot', size: 19, weight: 600, color: C.mute, alpha: a0, sentence: false });
    text('The line: the best of these ' + (['five', 'six', 'seven', 'eight'][LO.mice.length - 5] || LO.mice.length) + ' flagships', RM, Z.hy - 44, { role: 'foot', size: 19, weight: 600, color: C.mute, align: 'right', alpha: ep(t, 0.6, 1.1), sentence: false });
    /* the giants: a row each, as on move 0's slide, their shortfalls in red, then each one's count */
    LT.rows.forEach((r, j) => {
      const y = Z.y0 + j * Z.rh, M = r.M;
      lo_sil(M, Z.silX, y + 2, Z.sil, a0);
      rich([{ s: M.brand, role: 'label', size: 19, color: C.mute }, { s: M.name, role: 'h3', size: 23, weight: 750, color: C.ink, gap: 10, sentence: false }], Z.nameX, y + 9, { alpha: a0 });
      cols.forEach((c, i) => {
        const v = r[c.key], tb = T.bars + j * T.row + i * 0.06, kb = ep(t, tb, tb + 0.5, E.snap), kf = ep(t, tb + 0.15, tb + 0.45);
        text(lo_fmt(c, v), cx(i), y - 6, { role: 'num', size: 19, weight: 700, color: v.none ? (v.bad ? C.red : C.faint) : v.best ? C.ink : C.ink2, alpha: kf });
        lo_bar(cx(i), y + 2, L, Z.bh, { f: (v.f || 0) * kb, best: !!v.best, none: v.none, tick: false, gap: kb > 0.99 });
      });
      const sh = v7_short(r), kc = ep(t, T.cnt + j * 0.08, T.cnt + 0.35 + j * 0.08, E.snap);
      if (kc > 0.003) {
        rich([{ s: String(sh.n), role: 'num', size: 30, weight: 800, color: sh.n ? C.red : C.ink2, tnum: true }, sh.unk ? { s: sh.unk + ' not rated', role: 'foot', size: 19, weight: 600, color: C.faint, gap: 12, sentence: false } : null], Z.cnt, y + 13, { alpha: kc });
      }
    });
    /* Theseus's row: empty, then its three bars to the line together and past it together; its count, 0 */
    { const y = Z.yT, ka = ep(t, T.ths, T.ths + 0.5), rise = (1 - E.out3(ka)) * 16;
      if (ka > 0.003) {
        rr(LM - 16, y - 36 + rise, RM - LM + 32, Z.rh + 22, 6, rgba(C.hero, TH ? 0.07 : 0.12), null, 0, ka);
        lo_sil(null, Z.silX, y + 4 + rise, Z.sil * 1.08, ka);
        rich([{ s: 'Nitrite Labs', role: 'label', size: 19, color: C.heroText }, { s: 'Theseus', role: 'h3', size: 27, weight: 800, color: C.heroText, grad: C.heroGrad, gap: 10, sentence: false }], Z.nameX, y + 11 + rise, { alpha: ka });
        const kRun = ep(t, T.run, T.line, E.io3), kOver = ep(t, T.line, T.over, E.out3), kf = ep(t, T.over - 0.2, T.over + 0.3);
        cols.forEach((c, i) => {
          const th = LT.ths[c.key], F = th.f || 0, f = kOver > 0 ? lerp(1, F, kOver) : kRun, x = cx(i);
          lo_bar(x, y + 2 + rise, L, Z.bh + 2, { f, ths: true, d: 1, N: 1, a: ka, tick: false, pulse: prog(t, T.line, T.line + 0.9) });
          text(lo_fmt(c, th), x, y - 6 + rise, { role: 'num', size: 21, weight: 800, color: C.heroText, alpha: kf });
          if (F > LO.max && kOver > 0.98) text(lo_capTxt(F), x + L * LO.max + 6, y + Z.bh + 2 + rise, { role: 'num', size: 19, weight: 800, color: C.heroText, alpha: kf });
        });
        /* the cover's tile, earned: 0, and its words */
        const kz = ep(t, T.zero, T.zero + 0.4, E.snap), kzs = ep(t, T.zero + 0.3, T.zero + 0.7);
        if (kz > 0.003) {
          text('0', Z.cnt, y + 26 + rise, { role: 'd1', size: 76, color: C.heroText, grad: C.heroGrad, tnum: true, alpha: kz });
          text('no tradeoffs', Z.cnt + 58, y + 16 + rise, { role: 'label', size: 19, color: C.mute, alpha: kzs });
        }
      } }
    /* the build board, up from the dock, complete: every link among the moves drawn, then each move's link into the close
       lighting in turn, and the close filling */
    { const kFly = ep(t, T.board, T.board + 0.8, E.cam);
      if (kFly > 0.003) {
        const g = {}; for (const k of Object.keys(V7_ZB)) g[k] = lerp(FILM_DOCK[k], V7_ZB[k], kFly);
        const st = filmState(9), last = FILM.moves.length - 1;
        for (const e of FILM.edges) if (e[1] === last) { const t0 = T.arcs + (e[0] - 1) * T.per; st.k[filmEk(e)] = ep(t, t0, t0 + 0.5, E.io3); }
        const tF = T.arcs + (last - 1) * T.per; st.fill = ep(t, tF, tF + 0.4); st.pop = 1 + 0.18 * Math.sin(Math.PI * st.fill);
        filmBoard(g, st, { full: true, names: false, edgeLabels: false, numA: clamp((g.r - 8) / 5) });
        const kl = ep(t, T.board + 0.6, T.board + 1.0);
        text('The build board', LM, V7_ZB.y - 24, { role: 'label', size: 19, color: C.mute, alpha: kl });
        text('Every move feeds the next', LM, V7_ZB.y + 6, { role: 'small', size: 20, weight: 650, color: C.ink2, alpha: kl, sentence: false });
        text('Zero compromises', V7_ZB.x1 + 30, V7_ZB.y + 7, { role: 'small', size: 21, weight: 750, color: C.heroText, alpha: ep(t, tF + 0.2, tF + 0.6), sentence: false });
      } }
    source(t, 'Figures and lines as on the giants’ slide. Counted short: a bar measured under the line, or wired only; a blank is not counted. Theseus: ' + THS.massG + ' over its box, ' + THS.hours + ' derived, ' + lo_fmt(lo_cat('motion'), LT.ths.motion) + ' a target.', { t0: 1.0, maxW: RM - LM });
  }
});
