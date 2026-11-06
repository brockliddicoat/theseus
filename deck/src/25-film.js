/* ============================================================================================
   THE FILM (V1, 2026-11-06: the v23 refinement). One manifest decides what plays and in what order, and the film's spine
   is drawn by the player's chrome from it.
   Brock (F63, 15:12, 15:15): "the whole side show needs to be grounded in interconnected themes"; "show the steps to level
   something up to where it becomes the best, it has to be a process"; "every slide should feel like it's pushing towards a
   compounding goal ... the concepts should visible and statically show how they build upon one another".
   The story (handoff/v23refine/PLAN.md): the giants each sell a flagship that wins one thing by giving up another; Theseus,
   the underdog, can't out-spend them, so it out-engineers them one move at a time, each move built on the ones before.
   - FILM.moves: the acts (moves 0 to 9), their names, what each builds on and unlocks.
   - FILM.edges: the build board's links, [from, to, what flows along it].
   - FILM.order: the film, move by move, as slide ids (v23's, the revamp's and this file's, mixed). At startup DECK.slides is
     rebuilt from it: anything unlisted is dropped and `replaces` is ignored (13-sort.js stands aside). ?film=0 turns the
     manifest off (the old chapter sort, every slide), for development.
   - The chrome (every slide): the build board docked small in the footer (the active move lit, its links), the move's
     name in the section label, and the slide's link to the chain (FILM.link: what it builds on or pushes toward).
   - Move cards (mv1 .. mv9): the board brought forward full size; the last move completes and hands on along its links,
     the new move lights; what it builds on, what it unlocks, and its figure (FILM.moves[n].stat).
   - The rule (end of move 0): the bar against the giants (the scoreboard), the underdog's rule, the plan (the whole board).
   Figures come from the deck's own constants and derivations (THESEUS, ntr_thsBox, ntr_budget, NTR_BAR_*, ntr_hours,
   ntr_dens); none is typed here.
   ============================================================================================ */
const FILM_Q = (() => { try { return new URLSearchParams(location.search); } catch (e) { return new URLSearchParams(''); } })();
const FILM = {
  on: FILM_Q.get('film') !== '0',
  /* the moves. ch: the deck chapter whose slides make it (accent, icon, the player's bar); name: short (the board, the label);
     title: the card's; builds / unlocks: the card's two lines (successors: sharpen these as you pilot each move) */
  moves: [
    { n: 0, ch: 'intro', name: 'The bar', title: 'The bar, and the giants’ compromises',
      unlocks: 'The target: density, not size. Light for a full-size mouse, with nothing given up.' },
    { n: 1, ch: 'shape', name: 'The shape', title: 'The shape the hand wants',
      builds: 'Move 0’s bar: a mouse is light only for the volume it fills, so the volume stays full.',
      unlocks: 'A volume fixed by hands, not by weight: every later move must fill it without shrinking it.' },
    { n: 2, ch: 'shell', name: 'A light, stiff shell', title: 'A light, stiff shell',
      builds: 'Move 1’s shape, kept full: the volume to make light, and flat low sides to hold.',
      unlocks: 'Grams freed at the same stiffness, for every move after it.' },
    { n: 3, ch: 'shell', name: 'The weight you carry', title: 'Use the weight you already carry',
      builds: 'Move 2’s light, stiff shell: the skin the board can tie.',
      unlocks: 'Stiffer again, for zero added grams.' },
    { n: 4, ch: 'click', name: 'Clicks', title: 'Clicks the stiff shell makes possible',
      builds: 'The stiff top of moves 2 and 3: a top that doesn’t flex lets the click be direct.',
      unlocks: 'The same click wherever you press, and the latency to match.' },
    { n: 5, ch: 'glide', name: 'Glide and tracking', title: 'Glide and tracking',
      builds: 'A shell that doesn’t flex (moves 2 and 3) keeps the lens at its height.',
      unlocks: 'Aim that goes where you put it.' },
    { n: 6, ch: 'elec', name: 'Power', title: 'Power, paid for in grams',
      builds: 'The grams freed in moves 2 and 3 buy battery.',
      unlocks: 'The battery the light flagships gave up, at their weight.' },
    { n: 7, ch: 'surface', name: 'The finish', title: 'A finish that weighs nothing',
      builds: 'Move 2’s shell: a film-thin coat on it, no tape.',
      unlocks: 'Grip that holds, for no weight.' },
    { n: 8, ch: 'own', name: 'Built to open', title: 'Built to be opened',
      builds: 'The inserts and screws that hold move 3’s structure.',
      unlocks: 'A mouse you can open and repair.' },
    { n: 9, ch: 'end', name: 'Zero compromises', title: 'Zero compromises',
      builds: 'Every move, at once.',
      unlocks: 'Every axis at or past the best flagship, at the same time.' }
  ],
  /* the build board's links: [from, to, what flows]. From the plan: 1 fixes the volume (density, from 0); 2 frees grams at the
     same stiffness; 3 builds on 2; 4, 5 and 6 on 2 and 3; 7 on 2; 8 on 3; the close on every move */
  edges: [[0, 1, 'Density, not size'], [1, 2, 'The volume'], [2, 3, 'A stiff skin'], [2, 4, 'Stiffness'], [3, 4, 'Stiffness'],
    [2, 5, 'No flex'], [3, 5, 'No flex'], [2, 6, 'Grams'], [3, 6, 'Grams'], [2, 7, 'The skin'], [3, 8, 'Its screws'],
    [1, 9], [2, 9], [3, 9], [4, 9], [5, 9], [6, 9], [7, 9], [8, 9]],
  /* the film. Moves 0 and 1 are the pilot (V1); moves 2 to 9 are v23's slides in the plan's order until each is piloted
     (v23's chapter cards give way to the move cards; elc_sheet2 and ownsheet1 out, Brock F27: "remove this slide",
     "feels redundant") */
  order: [
    [0, ['b01_cover', 'weightgap', 'ntr_sizewt', 'ntr_density', 'ntr_densrank', 'b01_battery', 'b01_compromise', 'targets', 'rule']],
    [1, ['mv1', 'b07_size', 'shp_newton', 'grooves', 'emg', 'b07_sides']],
    [2, ['mv2', 'materials', 'shlSpecific', 'thinwall', 'shlScatter', 'shlPick', 'shlNoPick', 'shlHotspot', 'shlMargin', 'shlWork', 'shlShell3d',
      'lattice', 'shlDeterminate', 'shlThin', 'shbArches', 'shbPress', 'shbThrust', 'shbBend', 'shbFibres', 'fillet', 'filletsize', 'shbFlow',
      'shbWidth', 'shbMill', 'shbMillDirect', 'shbTol']],
    [3, ['mv3', 'shlPcbRib', 'shcCarry', 'shcArms', 'shlStructs', 'grind', 'mass', 'tolerance', 'shlsheet1', 'shlsheet2']],
    [4, ['mv4', 'arc', 'clk_wedge', 'clk_switch', 'clk_switch2', 'cutouts', 'tensioner', 'clk_tenmat', 'anchors', 'clk_pomtune', 'clk_front',
      'clk_hotswap', 'clk_spdt', 'latency', 'clk_debounce', 'clk_wait', 'clk_methods', 'sidebuttons']],
    [5, ['mv5', 'gld_under', 'dots', 'gld_camera', 'gld_corr', 'gld_blur', 'focus', 'gld_sag', 'gld_module', 'sensor', 'gld_reports', 'gld_soft', 'gld_sheet']],
    [6, ['mv6', 'power', 'cells', 'frontier', 'elc_pmic', 'elc_charge', 'elc_safe', 'onechip', 'elc_module', 'antenna', 'motion', 'elc_rate',
      'framesync', 'secondshot', 'elc_oneside', 'elecsheet1', 'elc_tear', 'elc_twist', 'elc_lay', 'elc_flex', 'cable', 'software', 'srf_encoder']],
    [7, ['mv7', 'coating', 'srf_texture', 'srf_weight', 'srf_uv', 'grip', 'srf_gripmap', 'srf_tape', 'srf_twotone', 'wheel']],
    [8, ['mv8', 'repair', 'ownscrew', 'own_insert', 'own_life', 'ownbatt', 'ownboard', 'box', 'ownsheet2']],
    [9, ['mv9', 'close']]
  ],
  /* each slide's place in the chain, said in the footer beside the board: what it builds on, or what it pushes toward.
     The pilot's; successors add theirs as they pilot each move */
  link: {
    weightgap: { s: 'Every gram from here on is counted on the scale, not the box' },
    ntr_sizewt: { s: 'The giants\u2019 shortcut: light by being less mouse. Move 1 keeps the mouse', to: [1] },
    ntr_density: { s: 'The bar every move answers to: weight per cm\u00B3 of a full-size box' },
    ntr_densrank: { s: 'Where the moves must take it: the lowest density at full size', to: [9] },
    b01_battery: { s: 'The trade move 6 refuses: the grams moves 2 and 3 free buy the battery back', to: [6] },
    b01_compromise: { s: 'Each giant wins one row by giving up another. Theseus must hold every row at once', to: [9] },
    targets: { s: 'The bar on speed: moves 4 to 6 must clear every row', to: [4, 5, 6] },
    b07_size: { s: 'Move 1 keeps the volume full: the volume moves 2 to 8 must make light', to: [2] },
    shp_newton: { s: 'The curve the finger rests on: the outline move 2\u2019s shell must hold', to: [2] },
    grooves: { s: 'The grip is in the shape: the skin move 7 coats keeps it', to: [7] },
    emg: { s: 'Measured on players before a single gram is cut' },
    b07_sides: { s: 'What the shape asks of the shell: flat low sides that hold. Move 2 builds it', to: [2] }
  },

  /* the scoreboard: the best flagship figure on each axis (the bar), and Theseus's once the move that earns it lands (at).
     Rows read the deck's own sources (the targets' NTR_BAR_* rows, ntr_dens, ntr_hours). Successors set `at` as they pilot */
  score: [
    { key: 'density', name: 'Density, weighed', better: 'lower', at: 6 },
    { key: 'battery8', name: 'Battery at 8 khz', better: 'higher', at: 6 },
    { key: 'click', name: 'Click latency, wireless', better: 'lower', at: 4 },
    { key: 'motion', name: 'Motion latency, wireless', better: 'lower', at: 6 }
  ]
};

/* ---------- the manifest applied: DECK.slides rebuilt from FILM.order (13-sort.js stands aside when FILM.on) ---------- */
function filmApply() {
  /* one slide per id: where a file rebuilt a slide under its own id (S({ id: 'mass', replaces: 'mass' })), the rebuild */
  const byId = new Map(); for (const s of DECK.slides) if (!byId.has(s.id) || [].concat(s.replaces || []).includes(s.id)) byId.set(s.id, s);
  const out = [], missing = [];
  for (const [n, ids] of FILM.order) for (const id of ids) {
    const s = byId.get(id); if (!s) { missing.push(id); continue; }
    s.move = n; out.push(s);
  }
  if (missing.length) console.error('film: no slide', missing.join(', '));
  FILM.dropped = DECK.slides.filter(s => !out.includes(s)).map(s => s.id);
  DECK.slides.length = 0; out.forEach(s => DECK.slides.push(s));
  /* the player's bar: chapters in the film's order (each move's slides are one chapter's, so its segments stay in order) */
  const seen = []; for (const s of DECK.slides) if (!seen.includes(s.ch)) seen.push(s.ch);
  const chs = seen.map(k => DECK.chapters.find(c => c.key === k)).filter(Boolean);
  DECK.chapters.length = 0; chs.forEach(c => DECK.chapters.push(c));
  for (const c of DECK.chapters) { const ms = FILM.moves.filter(m => DECK.slides.some(s => s.ch === c.key && s.move === m.n)); if (ms.length) c.name = ms.map(m => 'Move ' + m.n + ': ' + m.name).join(', '); }
}
const filmMove = s => (s && s.move != null ? FILM.moves[s.move] : null);

/* ============================== the build board ==============================
   An arc diagram: the ten moves on one line in the film's order, each link an arc over it from the move that gives to the
   move that takes. Done moves are ink, the move in play blue (its links in: solid blue, what it builds on; its links out:
   dashed blue, what it unlocks), moves ahead hollow. By the close every arc runs into the last node.
   g: { x0, x1, y, r, h1, h9 } (stage px: the first and last node's x, the line's y, a node's radius, the arc height for a
   span of 1 and of 9). st: { act: the move in play (-1 none), k: { [edgeKey]: 0..1 drawn }, node: { [n]: 'done'|'act'|'ahead' },
   plan: 0..1 (the arcs ahead drawn faint, dashed), labels, names, a } */
function filmGeo(g) {
  const n = FILM.moves.length, xs = FILM.moves.map((m, i) => lerp(g.x0, g.x1, i / (n - 1)));
  return Object.assign({}, g, { xs, h: span => lerp(g.h1, g.h9, (span - 1) / (n - 2)) });
}
const filmEk = e => e[0] + '>' + e[1];
/* a link into the close: drawn when the close is in play, or in the plan, not as every move's link out */
const filmToEnd = e => e[1] === FILM.moves.length - 1;
function filmArcPts(G0, e, p = 1) {
  const xa = G0.xs[e[0]], xb = G0.xs[e[1]], cx = (xa + xb) / 2, rx = (xb - xa) / 2, ry = G0.h(e[1] - e[0]), pts = [], N = 44;
  for (let i = 0; i <= N * p; i++) { const th = Math.PI + Math.PI * i / N; pts.push([cx + rx * Math.cos(th), G0.y + ry * Math.sin(th)]); }
  if (p < 1 && p > 0) { const th = Math.PI + Math.PI * p; pts.push([cx + rx * Math.cos(th), G0.y + ry * Math.sin(th)]); }
  return { pts, apex: [cx, G0.y - ry], cx, ry };
}
function filmStroke(pts, col, w, a, dash) {
  if (pts.length < 2 || a <= 0.003) return;
  G.save(); G.globalAlpha = a; G.strokeStyle = col; G.lineWidth = w; G.lineCap = 'round'; G.lineJoin = 'round'; if (dash) G.setLineDash(dash);
  G.beginPath(); pts.forEach((q, i) => (i ? G.lineTo(q[0], q[1]) : G.moveTo(q[0], q[1]))); G.stroke(); G.restore();
}
/** the state of the board while move `act` is in play: every move before it done, its links among done moves drawn */
function filmState(act, o = {}) {
  const st = { act, k: {}, node: {}, plan: o.plan || 0, a: o.a == null ? 1 : o.a };
  FILM.moves.forEach(m => (st.node[m.n] = m.n < act ? 'done' : m.n === act ? 'act' : 'ahead'));
  for (const e of FILM.edges) { if (e[1] < act || (e[1] === act && e[0] < act)) st.k[filmEk(e)] = 1; else if (e[0] === act && !filmToEnd(e)) st.k[filmEk(e)] = o.out == null ? 1 : o.out; }
  return st;
}
function filmBoard(g, st, o = {}) {
  const G0 = filmGeo(g), A = st.a == null ? 1 : st.a, full = !!o.full, act = st.act;
  if (A <= 0.003) return G0;
  const ink = TH ? '17,17,17' : '243,243,245', col = { done: `rgba(${ink},${TH ? 0.34 : 0.3})`, plan: `rgba(${ink},0.2)` };
  const wv = full ? { done: 2, inn: 3.2, out: 2.4, plan: 1.5 } : { done: 1.2, inn: 1.8, out: 1.4, plan: 1 };
  const dash = full ? { out: [9, 7], plan: [4, 7] } : { out: [3, 3], plan: [2, 3] };
  /* the plan: every link not yet drawn, faint and dashed (the rule slide shows the whole board this way) */
  if (st.plan > 0) for (const e of FILM.edges) { const kk = st.k[filmEk(e)] || 0; if (kk >= 1) continue; const P = filmArcPts(G0, e, Math.min(1, st.plan * (st.planK ? st.planK(e) : 1))); filmStroke(P.pts, col.plan, wv.plan, A, dash.plan); }
  /* the links drawn: done (both ends behind the move in play), in (into the move in play: what it builds on), out (what it unlocks) */
  const labels = [];
  for (const e of FILM.edges) {
    const kk = st.k[filmEk(e)] || 0; if (kk <= 0) continue;
    const P = filmArcPts(G0, e, kk), into = e[1] === act && act >= 0, outof = e[0] === act && act >= 0;
    if (into) filmStroke(P.pts, C.heroText, wv.inn, A);
    else if (outof) filmStroke(P.pts, C.heroText, wv.out, A * 0.75, dash.out);
    else {
      filmStroke(P.pts, col.done, wv.done, A);
      const hot = st.hot && st.hot[filmEk(e)]; if (hot > 0) filmStroke(P.pts, C.heroText, lerp(wv.done, wv.inn, hot), A * hot);
    }
    if (full && e[2] && (into || outof) && kk >= 1 && o.edgeLabels !== false) labels.push([P, e, into]);
  }
  /* the nodes over the arcs' ends */
  FILM.moves.forEach((m, i) => {
    const x = G0.xs[i], y = G0.y, s = st.node[i], r = g.r * (s === 'act' && st.pop != null ? st.pop : 1);
    const fillA = s === 'act' ? (st.fill == null ? 1 : st.fill) : 1;
    G.save(); G.globalAlpha = A;
    G.beginPath(); G.arc(x, y, r + (full ? 3 : 1.5), 0, TAU); G.fillStyle = C.bg; G.fill();
    G.beginPath(); G.arc(x, y, r, 0, TAU);
    if (s === 'done') { G.fillStyle = TH ? '#3A3B3E' : '#C9CACD'; G.fill(); if (st.was && st.was.n === i && st.was.k > 0) { G.globalAlpha = A * st.was.k; G.fillStyle = C.hero; G.fill(); G.globalAlpha = A; } }
    else if (s === 'act') { G.fillStyle = C.bg; G.fill(); G.globalAlpha = A * fillA; G.fillStyle = C.hero; G.fill(); G.globalAlpha = A; G.strokeStyle = C.heroText; G.lineWidth = full ? 2.5 : 1.5; G.stroke(); if (!full) { G.beginPath(); G.arc(x, y, r + 3.2, 0, TAU); G.globalAlpha = A * 0.5; G.lineWidth = 1.2; G.stroke(); } }
    else { G.strokeStyle = `rgba(${ink},${TH ? 0.36 : 0.32})`; G.lineWidth = full ? 2 : 1.2; G.stroke(); }
    G.restore();
    if (full) {
      const nc = s === 'act' ? (fillA > 0.5 ? (HUE === 'yellow' ? '#111111' : '#FFFFFF') : C.heroText) : s === 'done' ? (TH ? '#FFFFFF' : '#111214') : C.mute;
      text(String(i), x, y + 7, { role: 'label', size: 20, weight: 800, color: nc, align: 'center', alpha: A * (o.numA == null ? 1 : o.numA), track: 0 });
      if (o.names !== false) {
        const na = (o.nameA ? o.nameA(i) : 1) * A, nm = m.name, sz = 21, mw = (G0.xs[1] - G0.xs[0]) - 14;
        const ls = wrap(sentence(nm), { role: 'small', size: sz, weight: 650 }, mw);
        ls.forEach((ln, j) => text(ln, x, y + r + 34 + j * 26, { role: 'small', size: sz, weight: s === 'act' ? 750 : 600, color: s === 'act' ? C.heroText : s === 'done' ? C.ink2 : C.mute, align: 'center', alpha: na, sentence: false }));
      }
    }
  });
  /* the labels of the move's own links, at each arc's top, on a scrap of ground so the arcs under them don't cut the words */
  for (const [P, e, into] of labels) {
    const s = e[2], w0 = tw(s, { role: 'small', size: 20, weight: 700 }) + 16, [ax, ay] = P.apex, la = A * (o.labelA ? o.labelA(e) : 1);
    if (la <= 0.003) continue;
    G.save(); G.globalAlpha = la; G.fillStyle = C.bg; G.fillRect(ax - w0 / 2, ay - 15, w0, 28); G.restore();
    text(s, ax, ay + 7, { role: 'small', size: 20, weight: 700, color: into ? C.heroText : C.mute, align: 'center', alpha: la, sentence: false });
  }
  return G0;
}
/* the dock: the board's place in the footer, beside the page count */
const FILM_DOCK = { x0: 1250, x1: 1690, y: 1040, r: 4.2, h1: 6, h9: 24 };
const FILM_FULL = { x0: 170, x1: 1750, y: 850, r: 17, h1: 60, h9: 285 };
const FILM_RULE = { x0: 170, x1: 1750, y: 900, r: 15, h1: 34, h9: 170 };   /* the rule slide's plan: move 1's card picks the board up from there */

/* ---------- the chrome, when the film is on: the rule, THESEUS / MOVE n, the slide's link to the chain, the docked board,
   n / N. Drawn settled (it is the stage's) ---------- */
function filmChrome(t, s) {
  if (s.chrome === false) return;
  const i = DECK.slides.indexOf(s), N = DECK.slides.length, m = filmMove(s), y = LAY.footY;
  line(LM, LAY.ruleY, RM, LAY.ruleY, { color: C.hair, w: 1.5 });
  const px = LM + (RM - LM - 28) * (i / Math.max(1, N - 1));
  rect(px, LAY.ruleY - 1.5, 28, 3, { fill: C.ink2 });
  const r = rich([{ s: 'Theseus', role: 'foot', weight: 700, track: 0.24, caps: true, color: C.ink2 }, { s: '/', role: 'foot', color: C.faint, gap: 14 },
    { s: m ? 'Move ' + m.n : '', role: 'foot', caps: true, track: 0.12, color: C.faint, gap: 14 }], LM, y);
  /* the link: what this slide builds on or pushes toward */
  const lk = FILM.link[s.id];
  if (lk) {
    const x0 = LM + r.w + 34, mw = FILM_DOCK.x0 - 60 - x0;
    text('→', x0, y, { role: 'foot', size: 20, weight: 700, color: C.heroText });
    text(lk.s, x0 + 27, y, { role: 'foot', size: 20, weight: 650, color: C.ink2, maxW: mw, sentence: false });
  }
  if (!s.filmCard && m) {
    const G0 = filmBoard(FILM_DOCK, filmState(m.n));
    /* the moves this slide pushes toward: a blue ring on each */
    for (const n of (lk && lk.to) || []) if (n !== m.n) { G.save(); G.beginPath(); G.arc(G0.xs[n], G0.y, FILM_DOCK.r + 3.4, 0, TAU); G.strokeStyle = C.heroText; G.lineWidth = 1.6; G.stroke(); G.restore(); }
  }
  text(`${pad2(i + 1)} / ${pad2(N)}`, RM, y, { role: 'foot', weight: 600, color: C.mute, align: 'right' });
}

/* ============================== the scoreboard: the bar against the giants ==============================
   Each row: the best flagship figure anyone has shown (the targets' sources), who holds it, and Theseus's once the move that
   earns it has landed; until then the row is open. One precision per row (G5). */
function filmScoreRows() {
  const sp = typeof NTR_BAR_SPEED !== 'undefined' ? NTR_BAR_SPEED : [], rs = typeof NTR_BAR_REST !== 'undefined' ? NTR_BAR_REST : [];
  const row = (arr, re) => arr.find(r => re.test(r.cat)) || {};
  const dn = typeof ntr_dens === 'function' ? ntr_dens({ measured: true, theseus: false }).sort((a, b) => a.rho - b.rho)[0] : null;
  const h8 = typeof ntr_hours === 'function' ? Math.round(ntr_hours().h8) : null, b8 = row(rs, /Battery, 8 khz/), ck = row(sp, /Click latency, wireless/), mo = row(sp, /Motion latency, wireless/);
  const R = {
    density: dn ? { best: fmtN(dn.rho, 3), unit: 'g/cm³', who: dn.name.replace(/^Pulsar /, 'Pulsar ') + ', weighed by RTINGS', ths: fmtN(ntr_thsRho(), 3), d: (ntr_thsRho() - dn.rho) / dn.rho } : null,
    battery8: b8.bv != null && h8 ? { best: fmtN(b8.bv, 0), unit: 'h', who: (b8.who || '').replace(/, TechPowerUp$/, '') + ', TechPowerUp', ths: fmtN(h8, 0), d: (h8 - b8.bv) / b8.bv, note: 'derived' } : null,
    click: ck.bv != null ? { best: fmtN(ck.bv * 1000, 0), unit: 'µs', who: ck.who + ', its maker\u2019s \u201Cas low as\u201D', ths: fmtN(ck.tv * 1000, 0), d: (ck.tv - ck.bv) / ck.bv } : null,
    motion: mo.bv != null ? { best: fmtN(mo.bv, 2), unit: 'ms', who: mo.who + ', PIAKNOW’S rig', ths: fmtN(mo.tv, 2), d: (mo.tv - mo.bv) / mo.bv } : null
  };
  return FILM.score.map(r => Object.assign({}, r, R[r.key] || {})).filter(r => r.best != null);
}
/** the scoreboard at (x, y), w wide: rows land one after another from t0; `act` is the move in play (Theseus's figure shows
   from its row's move on) */
function filmScoreboard(t, t0, x, y, w, act, o = {}) {
  const rows = filmScoreRows(), rh = o.rh || 92, cB = x + (o.cB || 0), cT = x + w - (o.cT || 230);
  const a0 = ep(t, t0, t0 + 0.4);
  text('Best flagship, as shown', cB, y, { role: 'label', size: 19, color: C.mute, alpha: a0 });
  text('Theseus, so far', x + w, y, { role: 'label', size: 19, color: C.heroText, align: 'right', alpha: a0 });
  rows.forEach((r, i) => {
    const yy = y + 34 + i * rh, k = ep(t, t0 + 0.25 + i * 0.32, t0 + 0.75 + i * 0.32, E.snap);
    if (k <= 0.003) return;
    line(x, yy - 4, x + w, yy - 4, { color: C.hair, w: 1.2, alpha: k });
    rich([{ s: r.name, role: 'label', size: 19, color: C.ink2 }, o.compact ? null : { s: '(' + r.better + ' is better)', role: 'label', size: 19, color: C.faint, gap: 10 }], x, yy + 26, { alpha: k });
    rich([{ s: r.best, role: 'num', size: o.compact ? 30 : 36, weight: 800, color: C.secondText, tnum: true }, { s: r.unit, role: 'small', size: 20, weight: 600, color: C.mute, gap: 6, sentence: false }], cB, yy + (o.compact ? 60 : 70), { alpha: k });
    if (!o.compact) text(r.who, cB + tw(r.best, { role: 'num', size: 36, weight: 800 }) + tw(r.unit, { role: 'small', size: 20 }) + 26, yy + 66, { role: 'small', size: 19, weight: 600, color: C.mute, alpha: k, maxW: cT - cB - 210, sentence: false });
    const landed = act >= r.at;
    if (landed) {
      rich([{ s: r.ths, role: 'num', size: o.compact ? 30 : 36, weight: 800, color: C.heroText, grad: C.heroGrad, tnum: true }, { s: r.unit, role: 'small', size: 20, weight: 600, color: C.mute, gap: 6, sentence: false }], x + w, yy + (o.compact ? 60 : 70), { alpha: k, align: 'right' });
    } else {
      /* open: a dashed slot, and the move that will fill it */
      const sw = 150, sx = x + w - sw;
      const sy = yy + (o.compact ? 30 : 38);
      G.save(); G.globalAlpha = k; G.setLineDash([5, 5]); G.strokeStyle = inkA(TH ? 0.3 : 0.28); G.lineWidth = 1.5; G.strokeRect(sx, sy, sw, 40); G.restore();
      text('Move ' + r.at, sx + sw / 2, sy + 28, { role: 'label', size: 19, color: C.faint, align: 'center', alpha: k });
    }
  });
  return { h: 34 + rows.length * rh, rows };
}

/* ============================== the weight ledger ==============================
   Grams saved and grams spent, against the lightest flagship weighed part by part (the XA25, on XBAB's scale), from the
   deck's own budget (ntr_budget, 14-b-intro-ex.js). Each move puts its line on it; the running total ends at 29.31 g with
   a battery the XA25 doesn't carry. The pilot shows move 2's goal on its card; successors add their moves' lines. */
function filmLedger() {
  if (typeof ntr_budget !== 'function') return null;
  const B = ntr_budget(); if (!B || !B.ok) return null;
  return { B, lines: [
    { move: 2, name: 'Shell and skates', was: B.xa.shell, now: B.shell, why: 'the goal: lighter than the lightest flagship’s, at full size' },
    { move: 6, name: 'Battery, ' + B.cell.mAh + ' mAh', was: 0, now: B.cell.g, why: 'bought with the grams moves 2 and 3 free' }
  ] };
}

/* ============================== the move cards ==============================
   The board comes forward from the dock (0 to 0.9 s); the move before completes and hands on along its links (to 1.6 s);
   what this move builds on lights blue and the move fills (1.6 to 2.6 s); what it unlocks draws out, dashed (2.8 to 3.9 s).
   Frame one carries the label and the title (the thumbnail); the lines type with their motion. */
function filmCardStat(n) {
  if (n === 1 && typeof ntr_thsBox === 'function') { const b = ntr_thsBox(); return { label: 'The volume to keep', value: fmtN(b.v, 1), unit: 'cm³', sub: fmtN(b.L, 1) + ' × ' + fmtN(b.W, 1) + ' × ' + fmtN(b.H, 1) + ' mm, a full-size mouse: the box every later move must fill', ev: 'derived' }; }
  const L = filmLedger(), ln = L && L.lines.find(l => l.move === n);
  if (ln && ln.was) return { label: 'The weight ledger: this move’s goal', value: '−' + fmtN(ln.was - ln.now, 2), unit: 'g', sub: ln.name + ': ' + fmtN(ln.now, 2) + ' g against the XA25’s ' + fmtN(ln.was, 2) + ' g on XBAB’s scale, the lightest flagship weighed part by part; the grams move 6 spends on battery', ev: 'derived' };
  return null;
}
function filmCard(t, n) {
  const m = FILM.moves[n], prev = n - 1, kFly = ep(t, 0, 0.9, E.cam);
  /* the label row and the title: set at frame one */
  chapterIcon(m.ch, LM, LAY.labelY - 19, 22, C.ink2, 1);
  rich([{ s: 'Move ' + pad2(n), role: 'label', size: 22, color: C.ink2 }, { s: '/ ' + pad2(FILM.moves.length - 1), role: 'label', size: 22, color: C.faint, gap: 12 }], LM + 36, LAY.labelY);
  const ttl = caps(m.title), size = Math.min(112, Math.floor(1700 / Math.max(1, tw(ttl, { role: 'd2', size: 1, weight: 900, caps: false }))));
  text(ttl, LM - size * 0.04, 236, { role: 'd2', size, weight: 900, color: C.ink, caps: false });
  /* the two lines: what it builds on, what it unlocks */
  const stat = filmCardStat(n), tx = LM, tw0 = stat || n === FILM.moves.length - 1 || FILM.score.some(r => r.at === n) ? 1020 : 1500;
  if (m.builds) rich([{ s: 'Builds on', role: 'label', size: 20, color: C.heroText }], tx, 318, { alpha: ep(t, 0.9, 1.2) });
  if (m.builds) text(m.builds, tx, 356, { role: 'lead', size: 30, color: C.ink2, t, t0: 1.0, cps: 75, maxW: tw0, lh: 1.3 });
  const yU = 356 + (m.builds ? wrap(sentence(m.builds), { role: 'lead', size: 30 }, tw0).length * 39 + 34 : 0);
  rich([{ s: 'Unlocks', role: 'label', size: 20, color: C.mute }], tx, yU, { alpha: ep(t, 2.6, 2.9) });
  text(m.unlocks, tx, yU + 38, { role: 'lead', size: 30, color: C.ink2, t, t0: 2.7, cps: 75, maxW: tw0, lh: 1.3 });
  /* the move's figure, at the right: the scoreboard where this move lands a row against the giants, else its own figure */
  const lands = n === FILM.moves.length - 1 || FILM.score.some(r => r.at === n);   /* the close shows the whole board against the giants */
  if (lands) filmScoreboard(t, 4.0, 1200, 300, RM - 1200, n, { rh: 66, compact: true, cT: 150 });
  else if (stat) {
    const sx = 1200, ka = ep(t, 4.1, 4.5);
    rich([{ s: stat.label, role: 'label', size: 19, color: C.mute }], sx, 318, { alpha: ka });
    rich([{ s: stat.value, role: 'stat', size: 84, color: C.heroText, grad: C.heroGrad, tnum: true, count: [4.15, 0.8] }, { s: stat.unit, role: 'small', size: 28, weight: 650, color: C.mute, gap: 10, sentence: false }], sx, 408, { t, alpha: ka });
    text(stat.sub, sx, 452, { role: 'small', size: 21, weight: 600, color: C.mute, maxW: RM - sx, lh: 1.3, alpha: ep(t, 4.5, 4.9) });
  }
  /* the board, from the dock to full size */
  const from = n === 1 ? FILM_RULE : FILM_DOCK, g = {}; for (const k of Object.keys(FILM_FULL)) g[k] = lerp(from[k], FILM_FULL[k], kFly);
  /* before 0.95 s the board is as the last slide's dock had it (the move before in play); then that move completes (its
     node to ink, its links in fade from blue), this move's links in draw solid blue, it fills, and its links out draw dashed */
  const kDone = ep(t, 0.95, 1.4), kIn = ep(t, 1.3, 2.3, E.io3), kFill = ep(t, 2.0, 2.5), kOut = ep(t, 2.9, 3.9, E.io3);
  const st = filmState(prev, { out: 1 });
  if (kDone > 0) {
    st.act = n; st.node[prev] = 'done'; st.was = { n: prev, k: 1 - kDone }; st.hot = {};
    for (const e of FILM.edges) {
      const key = filmEk(e);
      if (e[1] === prev) st.hot[key] = 1 - kDone;                               /* the links into the move before: blue to ink */
      if (e[0] === prev && e[1] !== n) st.k[key] = 0;                            /* its other links out wait for their own moves */
      if (e[1] === n) st.k[key] = e[0] === prev ? 1 : kIn;                      /* what this move builds on */
      if (e[0] === n && !filmToEnd(e)) st.k[key] = kOut;                         /* what it unlocks */
    }
    st.node[n] = 'act'; st.fill = kFill; st.pop = 1 + 0.18 * Math.sin(Math.PI * kFill);
  }
  filmBoard(g, st, { full: true, numA: clamp((g.r - 10) / 6), nameA: () => ep(t, 0.6, 1.0), labelA: e => e[1] === n ? ep(t, 1.6, 2.0) : ep(t, 3.4, 3.8) });
}
for (let n = 1; n < FILM.moves.length; n++) {
  const m = FILM.moves[n];
  S({ id: 'mv' + n, ch: m.ch, card: true, filmCard: true, flight: false, theme: 'night', title: 'Move ' + n + ': ' + m.title, settle: 5.6,
    src: n === 1 ? ['ntrScan'] : n === 2 ? ['exXbabWeight'] : [],
    draw: t => filmCard(t, n) });
}

/* ============================== the underdog's rule (move 0's last slide) ==============================
   The bar against the giants (each row held by a flagship that gives another up; Theseus's column open), the rule, and the
   plan: the whole board, faint, with move 0 done and its link to move 1 lit. */
S({ id: 'rule', ch: 'intro', theme: 'night', title: 'The underdog’s rule', settle: 9.6, src: ['exPiaknow', 'ntrTpuV4', 'vgnClick', 'exRtings', 'exEloshapes', 'ntrJauch'],
  draw: t => {
    header(t, 'The underdog’s rule');
    captions(t, [[0.4, 'Each giant holds a row by giving up another. Theseus has no factory and no budget to out-spend them.'],
      [3.6, 'So it never trades. Each move is built so its gain pays for the next, and the gains compound.']]);
    /* the bar: four rows, held by different flagships; Theseus's column open, each slot naming the move that fills it */
    filmScoreboard(t, 1.0, LM, 292, 960, -1, { rh: 82, cT: 200 });
    /* the rule */
    const rx = 1180, kR = ep(t, 3.4, 3.9);
    text('Never trade.', rx - 4, 410, { role: 'd2', size: 96, weight: 900, color: C.heroText, grad: C.heroGrad, caps: false, alpha: kR, rise: [3.4, 0.6], t });
    text('Make each gain pay for the next.', rx, 470, { role: 'h3', size: 34, weight: 700, color: C.ink, alpha: ep(t, 3.9, 4.4), maxW: RM - rx });
    text('Ten moves, each built on the ones before it.', rx, 528, { role: 'small', size: 24, weight: 600, color: C.mute, alpha: ep(t, 4.6, 5.0), maxW: RM - rx });
    /* the plan: the whole board, faint; the nodes arrive along the line, the arcs draw by the move they feed; then move 0
       lights and hands its bar to move 1 */
    const g = FILM_RULE, kN = i => ep(t, 4.4 + i * 0.12, 4.8 + i * 0.12, E.snap);
    const kP = ep(t, 5.4, 7.2, E.io3), k0 = ep(t, 7.5, 7.9), k01 = ep(t, 7.7, 8.5, E.io3);
    const st = filmState(-1, { plan: 1 });
    st.planK = e => clamp(kP * 1.4 - (e[1] - 1) * 0.05);
    FILM.moves.forEach(m => (st.node[m.n] = 'ahead'));
    if (k0 > 0) { st.node[0] = 'act'; st.fill = k0; st.act = 0; st.k['0>1'] = k01; st.pop = 1 + 0.18 * Math.sin(Math.PI * k0); }
    text('The plan: what each move builds on', LM, 704, { role: 'label', size: 19, color: C.mute, alpha: ep(t, 4.4, 4.8) });
    /* the nodes arrive along the line: the board drawn clipped to what has arrived */
    G.save(); const xr = lerp(g.x0 - 40, W, ep(t, 4.4, 5.8, E.io3));
    G.beginPath(); G.rect(0, 712, xr, 290); G.clip();
    filmBoard(g, st, { full: true, nameA: i => kN(i), labelA: () => ep(t, 8.3, 8.7) });
    G.restore();
  }
});

/* ---------- switch the film on ---------- */
if (FILM.on) {
  filmApply();
  chapterInfo = function (s) {
    const m = filmMove(s), list = DECK.slides.filter(x => x.move === s.move && !x.card);
    return { name: m ? 'Move ' + m.n + ': ' + m.name : '', n: list.indexOf(s) + 1, of: list.length, num: m ? m.n : 0 };
  };
  slideChrome = filmChrome;
  updateBar = function () {
    const s = DECK.slides[APP.i], m = filmMove(s);
    $('count').textContent = (APP.i + 1) + ' / ' + DECK.slides.length;
    $('chap').textContent = m ? 'Move ' + m.n + ': ' + m.name : '';
    document.querySelectorAll('.seg').forEach(b => b.classList.toggle('on', b.dataset.ch === s.ch));
    rateSync();
  };
}
