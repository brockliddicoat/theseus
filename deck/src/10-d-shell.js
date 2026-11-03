/* ============================== shell and structure ============================== */
S({
  id: 'shellcard', ch: 'shell', card: true, theme: 'night', title: 'shell and structure', settle: 5,
  draw: t => {
    chapterCard(t, { name: 'shell', gloss: 'what the mouse is made of, and how it carries a hand pressing on it.', list: [['#5', 'carbon-filled polypropylene'], ['#94', 'the PCB as structure'], ['#75', 'triangles, not hexagons'], ['#53', 'arched, connected ribbing'], ['#57', 'a more unibody shell'], ['#15', 'a fully solid shell'], ['#95', 'mass low, near the fingers']] });
    /* after it seats, the screw backs out and goes back in, the way an owner would open it, and the brass takes it each time */
    const k = t < 5.5 ? ep(t, 1.6, 3.0, E.io3) : 1 - 0.5 * (0.5 - 0.5 * Math.cos((t - 5.5) * TAU / 5));
    part(1480, 640, 40, () => insertMM({ k, melt: ep(t, 2.6, 3.0) * (1 - ep(t, 3.4, 4.2)) }), { alpha: ep(t, 1.0, 1.7) });
    figLabel(t, 2.0, 1130, 920, 7, 'A screw in a brass insert');
  }
});
S({
  id: 'materials', ch: 'shell', theme: 'paper', title: 'stiffness per gram, for a thin shell', settle: 9, ideas: [5, 94, 6],
  src: ['denkaAbs', 'plabase10', 'plabase20', 'kyron', 'az91d', 'fr4', 'cfpps'],
  draw: t => {
    header(t, 'stiffness per gram, for a thin shell');
    const wx = LM, wy = 272, ww = 1120, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    text('Panel stiffness at equal mass: {E^(1/3) / ρ}', wx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(wx, wy, ww, ['datasheet', 'derived'], ep(t, 1.0, 1.4));
    hbars(t, { x: wx + 28, y: wy + 132, w: ww - 520, labelW: 400, rowH: 52, min: 1.0, max: 2.5, t0: 1.2, barH: 16, grid: [1.0, 1.5, 2.0, 2.5], gridFmt: v => v.toFixed(1), rows: [
      { label: 'ABS', v: 1.30, color: C.gray, text: '1.30', sub: '1.05 g/cm³, 2.55 GPa' },
      { label: 'FR4 (PCB core)', v0: 1.47, v: 1.56, color: C.gray, text: '1.47 to 1.56', sub: '1.85 g/cm³, 18 to 20 GPa' },
      { label: 'PPS, 30% carbon', v: 1.84, color: C.gray, text: '1.84', sub: '1.4 g/cm³, 17 GPa' },
      { label: 'magnesium AZ91D', v0: 1.98, v: 2.11, color: C.ink, text: '1.98 to 2.11', sub: '1.7 to 1.81 g/cm³, 46 GPa' },
      { label: 'Pyrofil PP, 10% carbon', v: 2.07, color: A, text: '2.07', sub: '0.96 g/cm³, 7.8 GPa' },
      { label: 'Pyrofil PP, 20% carbon', v: 2.36, color: A, text: '2.36', sub: '1.01 g/cm³, 13.5 GPa', bold: true },
      { label: 'KyronMAX PA66, 30%', v0: 2.28, v: 2.37, color: C.ink, dash: true, text: '~2.3*', sub: 'density not published' }
    ] });
    text('* KyronMAX density assumed 1.28 to 1.33 g/cm³. Pyrofil and ABS: flexural moduli.', wx + 28, wy + wh - 26, { role: 'small', size: 21, color: C.faint, alpha: ep(t, 3, 3.4), maxW: ww - 56 });
    const rx = 1260, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('tensile strength', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(rx, wy, rw, ['datasheet'], ep(t, 1.0, 1.4));
    const bars = [['FR4', 430, 430, A], ['AZ91D', 160, 220, C.ink], ['Pyrofil PP 20%', 120, 120, C.gray], ['ABS (yield)', 50, 50, C.gray]];
    bars.forEach(([l, a, b, col], i) => { const y = wy + 150 + i * 80, k = ep(t, 2.0 + i * 0.15, 2.8 + i * 0.15, E.snap), X = v => rx + 28 + (rw - 160) * v / 450; text(l, rx + 28, y - 12, { role: 'label', color: C.ink2, alpha: ep(t, 1.8 + i * 0.15, 2.2 + i * 0.15) }); rect(rx + 28, y, (X(b) - rx - 28) * k, 16, { fill: col, alpha: a !== b ? 0.45 : 1 }); if (a !== b) rect(rx + 28, y, (X(a) - rx - 28) * k, 16, { fill: col }); text(a === b ? a + ' MPa' : a + ' to ' + b + ' MPa', X(b) + 10, y + 14, { role: 'label', color: col, alpha: k }); });
    text('The PCB is about twice as strong as magnesium. Bolting the ribs to it uses weight the mouse carries anyway (#94).', rx + 28, wy + 470, { role: 'small', size: 24, color: C.ink, t, t0: 3.6, cps: 80, maxW: rw - 56, lh: 1.34 });
    gloss(t, 3.2, '{E^(1/3)/ρ}', 'Ashby\'s index for a light, stiff panel: a lighter material can be thicker, and stiffness grows with thickness cubed.');
    featureCard(t, 4.2, 'Carbon-filled polypropylene', ['datasheet', 'derived'], 'Less dense than ABS and about 5 times stiffer (#5). PPS carbon triggers on the pro model (#6).');
    captions(t, [[0.6, 'a mouse shell is a thin curved panel, and for panels the right comparison is stiffness per gram at equal mass.'], [3.4, 'by that measure 20% carbon polypropylene sits at the top, level with the best carbon nylons and ahead of magnesium.'], [6.2, 'and the strongest material in the mouse is the circuit board, so it should carry load too.']]);
  }
});

/* ---------- a mold only goes so thin: at a fixed weight a denser material gets a thinner wall ----------
   the same mass spread over the same 100 cm² of solid wall: t = m / (ρ A). carbon PP against magnesium, the
   doc's two real options for a light shell. densities from their datasheets; the floors from the sources named. */
const TW = { A: 100, pp: { rho: 1.01, name: 'carbon PP, 20%', floor: 0.89 }, mg: { rho: 1.81, name: 'magnesium AZ91D', floor: 0.7, floor2: 0.5 }, tol: 0.05 };
const twBudget = t => t < 3 ? 10 : 11 + 2 * Math.sin((t - 3) * TAU / 10 - Math.asin(0.5));
S({
  id: 'thinwall', ch: 'shell', theme: 'night', title: 'a mold only goes so thin', settle: 9, ideas: [5, 'wall'], src: ['protoWall', 'thixoDN', 'beall102', 'plabase20', 'az91d'],
  draw: t => {
    header(t, 'a mold only goes so thin');
    const wx = LM, wy = 272, ww = 1000, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    const m = twBudget(t), tp = m / (TW.pp.rho * TW.A) * 10, tm = m / (TW.mg.rho * TW.A) * 10;
    text('the same weight over the same 100 cm² of wall', wx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.8, cps: 70 });
    cardPills(wx, wy, ww, ['derived'], ep(t, 0.9, 1.3)); text('Magnesium is 1.8× as dense: its wall is 0.56 as thick', wx + 28, wy + 86, { role: 'small', size: 22, maxW: ww - 56, color: C.mute, alpha: ep(t, 1.0, 1.4) });
    const kb = ep(t, 1.0, 1.5);
    rich([{ s: 'Weight budget', role: 'label', size: 20, color: C.mute }, { s: m.toFixed(1) + ' g', font: 'disp', size: 40, weight: 800, color: A, tnum: true, gap: 14 }], wx + ww - 28, wy + 98, { align: 'right', alpha: kb });
    const S2 = 130, x0 = wx + 170, L = 470;
    [[TW.pp, tp, wy + 300, MT.shell], [TW.mg, tm, wy + 500, { g: ['#c9ced5', '#7f8790'] }]].forEach(([M, th, base, mt], j) => {
      const k = ep(t, 1.2 + j * 0.4, 1.8 + j * 0.4), h = th * S2, ok = th >= M.floor, col = ok ? A : C.red;
      text(M.name + ', ' + M.rho.toFixed(2) + ' g/cm³', x0 - 140, base - 136, { role: 'label', size: 20, color: C.ink, alpha: k });
      part(0, 0, 1, () => solid(() => { G.beginPath(); G.moveTo(x0, base - h); G.lineTo(x0 + L, base - h); brk(x0 + L, base - h, base, 6); G.lineTo(x0, base); brk(x0, base, base - h, -6); G.closePath(); }, mt, [x0, base - h, L, h], { hatch: { sp: 9 } }), { alpha: k });
      /* the floor: the thinnest wall the process fills well */
      const fy = base - M.floor * S2; line(x0 - 20, fy, x0 + L + 20, fy, { color: C.red, w: 1.6, dash: [7, 5], alpha: k });
      text(j ? 'Thixomolded walls: 0.7 mm' : 'Protolabs\' thinnest PP: 0.89 mm', x0 + L + 24, fy + 8, { role: 'small', size: 22, weight: 600, color: C.red, alpha: k });
      if (M.floor2) { const fy2 = base - M.floor2 * S2; line(x0 - 20, fy2, x0 + L + 20, fy2, { color: C.red, w: 1.2, dash: [3, 5], alpha: k * 0.7 }); text('Small parts: 0.5 mm', x0 + L + 24, fy2 + 8, { role: 'small', size: 22, weight: 600, color: C.red, alpha: k * 0.7 }); }
      /* the thickness, live */
      const dx = x0 - 34; line(dx, base - h, dx, base, { color: col, w: 2, alpha: k }); line(dx - 6, base - h, dx + 6, base - h, { color: col, w: 2, alpha: k }); line(dx - 6, base, dx + 6, base, { color: col, w: 2, alpha: k });
      text(th.toFixed(2) + ' mm', dx - 12, base - h / 2 + 8, { role: 'num', size: 22, color: col, align: 'right', alpha: k });
      text(ok ? 'Above its floor' : 'Below its floor: short shots', x0, base + 32, { role: 'label', size: 20, color: col, alpha: k });
    });
    
    /* the same tolerance on a thinner wall, and what equal mass does in bending */
    const rx = 1130, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('the same ±0.05 mm on a thinner wall', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(rx, wy, rw, ['derived'], ep(t, 1.0, 1.4)); text('Stiffness goes with thickness cubed: ±3 × 0.05 / t', rx + 28, wy + 86, { role: 'small', size: 22, maxW: rw - 56, color: C.mute, alpha: ep(t, 1.1, 1.5) });
    const mx = axes(t, { x: rx + 96, y: wy + 108, w: rw - 140, h: 170, xr: [0.4, 1.4], yr: [0, 40], xticks: [0.4, 0.6, 0.8, 1.0, 1.2, 1.4], yticks: [0, 10, 20, 30, 40], xfmt: v => v.toFixed(1), yfmt: v => '±' + v + '%', xlabel: 'wall, mm', t0: 1.2 });
    const pts = []; for (let x = 0.4; x <= 1.4001; x += 0.02) pts.push([x, 300 * TW.tol / x]);
    series(mx, pts, { color: C.ink2, w: 2.5, p: ep(t, 1.6, 2.6, E.lin) });
    [[tp, A, 'PP'], [tm, C.red, 'Mg']].forEach(([th, col, l], j) => { const k = ep(t, 2.6 + j * 0.2, 3.0 + j * 0.2), v = 300 * TW.tol / th; circle(mx.X(th), mx.Y(v), 7, { fill: col, alpha: k }); text(l + ' ±' + v.toFixed(0) + '%', mx.X(th) + 12, mx.Y(v) - 10, { role: 'label', color: col, alpha: k }); });
    rule(rx + 28, wy + 338, rx + rw - 28, ep(t, 3.0, 3.4));
    text('At the same weight', rx + 28, wy + 380, { role: 'label', color: C.ink, alpha: ep(t, 3.2, 3.6) }); pill(rx + rw - 24 - pillW('datasheet'), wy + 382, 'datasheet', ep(t, 3.2, 3.6));
    const rows = [['{Strength / weight, σ/ρ}', 'Mg 88 to 129, PP 119', 'about level'], ['{Bending strength, σ/ρ²}', 'PP 1.5 to 2.4× Mg', 'PP'], ['{Bending stiffness, E/ρ³}', 'PP 1.4 to 1.7× Mg', 'PP']];
    rows.forEach(([a2, b2, c2], i) => { const y = wy + 428 + i * 46, k = ep(t, 3.4 + i * 0.3, 3.8 + i * 0.3); if (i) line(rx + 28, y - 30, rx + rw - 28, y - 30, { color: C.hair, w: 1, alpha: k }); text(a2, rx + 28, y, { role: 'small', size: 22, color: C.mute, alpha: k }); text(b2, rx + rw - 28, y, { font: 'mono', size: 22, weight: 700, color: i ? A : C.ink2, align: 'right', alpha: k }); });
    gloss(t, 2.4, 'Minimum wall', 'The thinnest section a resin fills well. Below it the melt freezes early, and the extra pressure leaves stress that warps the part.');
    featureCard(t, 5.0, 'A lighter resin, a thicker wall', ['datasheet', 'derived', 'proposal'], 'Carbon PP at about 1 mm, clear of its floor, where a denser resin sits at the edge of its own (#5).');
    captions(t, [[0.6, 'a mold can only fill a wall so thin, and the thinner the wall, the harder its size is to hold.'], [3.6, 'at a fixed weight a denser material has to be thinner. magnesium\'s wall is barely more than half the thickness of carbon PP\'s.'], [6.6, 'so a lighter material can win even when its strength to weight looks no better: it gets a wall the mold can make, and a thick wall is stiffer and stronger in bending.']]);
  }
});

/* a 2D frame solver: Euler-Bernoulli beams, 3 dof per node, dense Gaussian elimination */
function frameSolve(nodes, els, fixed, loads) {
  const n = nodes.length * 3, K = Array.from({ length: n }, () => new Float64Array(n)), F = new Float64Array(n);
  for (const e of els) {
    const [i, j] = e.n, a = nodes[i], b = nodes[j], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), c = dx / L, s = dy / L;
    const EA = e.A, EI = e.I, k1 = EA / L, k2 = 12 * EI / L ** 3, k3 = 6 * EI / L ** 2, k4 = 4 * EI / L, k5 = 2 * EI / L;
    const kl = [[k1, 0, 0, -k1, 0, 0], [0, k2, k3, 0, -k2, k3], [0, k3, k4, 0, -k3, k5], [-k1, 0, 0, k1, 0, 0], [0, -k2, -k3, 0, k2, -k3], [0, k3, k5, 0, -k3, k4]];
    const T = [[c, s, 0, 0, 0, 0], [-s, c, 0, 0, 0, 0], [0, 0, 1, 0, 0, 0], [0, 0, 0, c, s, 0], [0, 0, 0, -s, c, 0], [0, 0, 0, 0, 0, 1]];
    const kg = Array.from({ length: 6 }, () => new Array(6).fill(0));
    for (let p = 0; p < 6; p++) for (let q = 0; q < 6; q++) { let v = 0; for (let r = 0; r < 6; r++) for (let u = 0; u < 6; u++) v += T[r][p] * kl[r][u] * T[u][q]; kg[p][q] = v; }
    const dof = [i * 3, i * 3 + 1, i * 3 + 2, j * 3, j * 3 + 1, j * 3 + 2];
    for (let p = 0; p < 6; p++) for (let q = 0; q < 6; q++) K[dof[p]][dof[q]] += kg[p][q];
  }
  for (const [k, fx, fy] of loads) { F[k * 3] += fx; F[k * 3 + 1] += fy; }
  for (const k of fixed) for (let d = 0; d < 3; d++) { const r = k * 3 + d; K[r].fill(0); for (let q = 0; q < n; q++) K[q][r] = 0; K[r][r] = 1; F[r] = 0; }
  for (let r = 0; r < n; r++) if (Math.abs(K[r][r]) < 1e-12) { K[r][r] = 1; F[r] = 0; }
  for (let col = 0; col < n; col++) {
    let piv = col; for (let r = col + 1; r < n; r++) if (Math.abs(K[r][col]) > Math.abs(K[piv][col])) piv = r;
    if (piv !== col) { const tmp = K[col]; K[col] = K[piv]; K[piv] = tmp; const tf = F[col]; F[col] = F[piv]; F[piv] = tf; }
    const d = K[col][col]; if (Math.abs(d) < 1e-14) continue;
    for (let r = col + 1; r < n; r++) { const f = K[r][col] / d; if (!f) continue; const Kr = K[r], Kc = K[col]; for (let q = col; q < n; q++) Kr[q] -= f * Kc[q]; F[r] -= f * F[col]; }
  }
  const U = new Float64Array(n);
  for (let r = n - 1; r >= 0; r--) { let v = F[r]; for (let q = r + 1; q < n; q++) v -= K[r][q] * U[q]; U[r] = K[r][r] ? v / K[r][r] : 0; }
  return U;
}
const LATTICE = (function () {
  const Wd = 300, Hd = 150, a = 40, h = a * Math.sqrt(3) / 2;
  const tri = { nodes: [], els: [] }, idx = {};
  for (let r = 0; r * h <= Hd + 0.1; r++) for (let c = 0; c * a + (r % 2) * a / 2 <= Wd + 0.1; c++) { idx[r + ',' + c] = tri.nodes.length; tri.nodes.push([c * a + (r % 2) * a / 2, r * h]); }
  for (const key in idx) { const [r, c] = key.split(',').map(Number), i = idx[key]; const nb = [[r, c + 1]].concat(r % 2 ? [[r + 1, c], [r + 1, c + 1]] : [[r + 1, c], [r + 1, c - 1]]); for (const [rr2, cc] of nb) { const j = idx[rr2 + ',' + cc]; if (j != null) tri.els.push({ n: [i, j] }); } }
  const hex = { nodes: [], els: [] }, key = p => Math.round(p[0] * 10) + ',' + Math.round(p[1] * 10), map = {};
  const R = 23.1, hw = Math.sqrt(3) * R;
  const addN = p => { const k = key(p); if (map[k] == null) { map[k] = hex.nodes.length; hex.nodes.push(p); } return map[k]; };
  for (let row = -1; row < 8; row++) for (let col = -1; col < 10; col++) {
    const cx = col * hw + (row % 2 ? hw / 2 : 0), cy = row * 1.5 * R; const vs = [];
    for (let k = 0; k < 6; k++) { const an = Math.PI / 6 + k * Math.PI / 3; vs.push([cx + R * Math.cos(an), cy + R * Math.sin(an)]); }
    for (let k = 0; k < 6; k++) { const p = vs[k], q = vs[(k + 1) % 6]; const inside = z => z[0] >= -0.1 && z[0] <= Wd + 0.1 && z[1] >= -0.1 && z[1] <= Hd + 0.1; if (inside(p) && inside(q)) { const i = addN(p), j = addN(q); if (!hex.els.some(e => (e.n[0] === i && e.n[1] === j) || (e.n[0] === j && e.n[1] === i))) hex.els.push({ n: [i, j] }); } }
  }
  const len = L => L.els.reduce((s2, e) => s2 + Math.hypot(L.nodes[e.n[1]][0] - L.nodes[e.n[0]][0], L.nodes[e.n[1]][1] - L.nodes[e.n[0]][1]), 0);
  const tt = 2.4, th = tt * len(tri) / len(hex);
  const solve = (L, t) => {
    for (const e of L.els) { e.A = t; e.I = t * t * t / 12; }
    const ys = L.nodes.map(p => p[1]), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const used = new Set(); L.els.forEach(e => { used.add(e.n[0]); used.add(e.n[1]); });
    const fixed = [], top = []; L.nodes.forEach((p, i) => { if (!used.has(i)) fixed.push(i); else if (p[1] < y0 + 1) fixed.push(i); else if (p[1] > y1 - 1) top.push(i); });
    const U = frameSolve(L.nodes, L.els, fixed, top.map(i => [i, 0, -1 / top.length]));
    const dmax = Math.max(...top.map(i => -U[i * 3 + 1]));
    return { U, top, dmean: top.reduce((s2, i) => s2 - U[i * 3 + 1], 0) / top.length, dmax, len: len(L), t };
  };
  const st = solve(tri, tt), sh = solve(hex, th);
  return { tri, hex, st, sh, ratio: sh.dmean / st.dmean, Wd, Hd };
})();
S({
  id: 'lattice', ch: 'shell', theme: 'night', title: 'triangles don\'t bend', settle: 9, ideas: [75], src: ['mitHoney', 'ashby06'],
  sfx: [[3.2, 'seat']],
  draw: t => {
    header(t, 'triangles don\'t bend');
    const wx = LM, wy = 272, ww = 1150, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    text('same panel, same mass of material, same load on top', wx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(wx, wy, ww, ['derived'], ep(t, 1.0, 1.4));
    text('Computed live by a frame solver in this page', wx + 28, wy + 86, { role: 'small', size: 22, color: C.mute, alpha: ep(t, 1.2, 1.6) });
    const ld = ep(t, 2.4, 4.0, E.io3) * (t > 4.0 ? 0.8 + 0.2 * Math.cos((t - 4.0) * 1.9) : 1), mag = 46 / LATTICE.sh.dmean;
    const drawL = (L, R, ox, oy, col, label, t0) => {
      const k = ep(t, t0, t0 + 0.8), sc = 1.45;
      const P = (i, f) => [ox + (L.nodes[i][0] + R.U[i * 3] * mag * f) * sc, oy - (L.nodes[i][1] + R.U[i * 3 + 1] * mag * f) * sc];
      G.save(); G.globalAlpha = k * 0.35; G.strokeStyle = C.faint; G.lineWidth = 1; G.beginPath(); for (const e of L.els) { const p = P(e.n[0], 0), q = P(e.n[1], 0); G.moveTo(p[0], p[1]); G.lineTo(q[0], q[1]); } G.stroke(); G.restore();
      G.save(); G.globalAlpha = k; G.strokeStyle = col; G.lineWidth = Math.max(1.5, R.t * sc * 0.9); G.lineCap = 'round'; G.beginPath(); for (const e of L.els) { const p = P(e.n[0], ld), q = P(e.n[1], ld); G.moveTo(p[0], p[1]); G.lineTo(q[0], q[1]); } G.stroke(); G.restore();
      part(0, 0, 1, () => solid(() => { G.beginPath(); G.rect(ox - 10, oy + 6, LATTICE.Wd * sc + 20, 12); }, MT.shell, [ox - 10, oy + 6, LATTICE.Wd * sc + 20, 12], { hatch: true }), { alpha: k });
      for (let x = 0; x <= LATTICE.Wd; x += 50) { const p = [ox + x * sc, oy - LATTICE.Hd * sc - 70]; arrow(p[0], p[1], p[0], p[1] + 44, { color: C.ink, w: 2.5, hs: 10, alpha: ep(t, 2.0, 2.4) }); }
      text(label, ox, oy + 60, { role: 'label', color: col, t, t0, cps: 60 });
    };
    drawL(LATTICE.tri, LATTICE.st, wx + 70, wy + 430, A, 'triangles', 1.2);
    drawL(LATTICE.hex, LATTICE.sh, wx + 620, wy + 430, C.red, 'hexagons', 1.5);
    text('deflection drawn ' + Math.round(mag) + '× real, the same for both', wx + ww - 28, wy + wh - 18, { role: 'small', color: C.faint, align: 'right', alpha: ep(t, 3, 3.4) });
    const rx = 1290, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    slam(t, 4.4, rx + 32, wy + 230, LATTICE.ratio.toFixed(0) + '×', '', { size: 120, color: A, label: 'More deflection for the hexagons: same load, same mass', maxW: rw - 64 });
    text('In-plane stiffness, textbook', rx + 32, wy + 400, { role: 'label', size: 20, color: C.ink2, alpha: ep(t, 5.4, 5.8) });
    text('Triangles ∝ density', rx + 32, wy + 436, { role: 'small', size: 25, weight: 700, color: A, alpha: ep(t, 5.6, 6.0) });
    text('Hexagons ∝ density³', rx + 32, wy + 470, { role: 'small', size: 25, weight: 700, color: C.red, alpha: ep(t, 5.8, 6.2) });
    text('Gibson and Ashby; MIT 3.054', rx + 32, wy + 504, { role: 'small', size: 21, color: C.faint, alpha: ep(t, 6.0, 6.4) });
    gloss(t, 2.6, 'Statically determinate', 'A triangle can\'t change shape without stretching a side. A hexagon can, by bending at its joints.');
    featureCard(t, 6.2, 'Triangles, not hexagons', ['derived'], 'For every cutout lattice: shell, bottom plate and trigger underside (#75).');
    captions(t, [[0.6, 'here are two panels with the same outline, the same total material, and the same weight pressing on top.'], [4.0, 'the triangles carry the load along their struts. the hexagons have to bend their walls to carry it.'], [6.6, 'it is very confusing why most mice use hexagons when triangles are this much stiffer for the same weight.']]);
  }
});

/* ---------- triangles at every density and under every load ---------- */
function latSolve(L, t, mode) {
  for (const e of L.els) { e.A = t; e.I = t * t * t / 12; }
  const ys = L.nodes.map(p => p[1]), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const used = new Set(); L.els.forEach(e => { used.add(e.n[0]); used.add(e.n[1]); });
  const fixed = [], top = []; L.nodes.forEach((p, i) => { if (!used.has(i)) fixed.push(i); else if (p[1] < y0 + 1) fixed.push(i); else if (p[1] > y1 - 1) top.push(i); });
  let loads, meas;
  if (mode === 'shear') { loads = top.map(i => [i, 1 / top.length, 0]); meas = U => top.reduce((a, i) => a + U[i * 3], 0) / top.length; }
  else if (mode === 'point') { const mid = top.reduce((b, i) => Math.abs(L.nodes[i][0] - 150) < Math.abs(L.nodes[b][0] - 150) ? i : b, top[0]); loads = [[mid, 0, -1]]; meas = U => -U[mid * 3 + 1]; }
  else { loads = top.map(i => [i, 0, -1 / top.length]); meas = U => -top.reduce((a, i) => a + U[i * 3 + 1], 0) / top.length; }
  const U = frameSolve(L.nodes, L.els, fixed, loads);
  return { U, d: meas(U) };
}
let LAT2 = null;
function lat2() {
  if (LAT2) return LAT2;
  const tri = LATTICE.tri, hex = LATTICE.hex, lt = LATTICE.st.len, lh = LATTICE.sh.len, area = LATTICE.Wd * LATTICE.Hd;
  const ts = [0.4, 0.6, 0.9, 1.3, 1.9, 2.7];
  const sweep = ts.map(t => { const a = latSolve(tri, t, 'press'), b = latSolve(hex, t * lt / lh, 'press'); return { rho: lt * t / area, kt: 1 / a.d, kh: 1 / b.d }; });
  const modes = ['press', 'shear', 'point'].map(m => { const a = latSolve(tri, 2.4, m), b = latSolve(hex, 2.4 * lt / lh, m); return { m, ratio: b.d / a.d }; });
  latSolve(tri, LATTICE.st.t, 'press'); latSolve(hex, LATTICE.sh.t, 'press');
  return (LAT2 = { sweep, modes });
}
S({
  id: 'lattice2', ch: 'shell', theme: 'paper', title: 'triangles win more as weight drops', settle: 9, ideas: [75], src: ['mitHoney', 'ashby06'],
  draw: t => {
    header(t, 'triangles win more as weight drops');
    const wx = LM, wy = 272, ww = 980, wh = 568, A = acc(), D = lat2();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    text('stiffness against how much material the panel holds', wx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(wx, wy, ww, ['derived'], ep(t, 1.0, 1.4)); text('both panels at equal mass, solved as frames in this page', wx + 28, wy + 86, { role: 'small', size: 22, maxW: ww - 56, color: C.mute, alpha: ep(t, 1.2, 1.6) });
    const ks = D.sweep.flatMap(r => [r.kt, r.kh]), kmin = Math.min(...ks), kmax = Math.max(...ks), rmin = D.sweep[0].rho, rmax = D.sweep[D.sweep.length - 1].rho;
    const m = axes(t, { x: wx + 110, y: wy + 120, w: ww - 170, h: 320, xr: [rmin * 0.9, rmax * 1.1], yr: [kmin * 0.6, kmax * 1.6], xlog: true, ylog: true, xticks: [0.04, 0.06, 0.1, 0.15, 0.2], yticks: [], xfmt: v => Math.round(v * 100) + '%', xlabel: 'Relative density', t0: 1.0 });
    text('stiffer', wx + 70, wy + 132, { role: 'label', color: C.mute, alpha: ep(t, 1.2, 1.6) }); text('softer', wx + 70, wy + 440, { role: 'label', color: C.mute, alpha: ep(t, 1.2, 1.6) });
    series(m, D.sweep.map(r => [r.rho, r.kt]), { color: A, w: 3.5, p: ep(t, 1.6, 2.8, E.lin) });
    series(m, D.sweep.map(r => [r.rho, r.kh]), { color: C.red, w: 3.5, p: ep(t, 2.0, 3.2, E.lin) });
    D.sweep.forEach((r, i) => { const k = ep(t, 1.6 + i * 0.2, 2.0 + i * 0.2); circle(m.X(r.rho), m.Y(r.kt), 5, { fill: A, alpha: k }); circle(m.X(r.rho), m.Y(r.kh), 5, { fill: C.red, alpha: k }); });
    const r0 = D.sweep[0], r5 = D.sweep[D.sweep.length - 1];
    text('triangles', m.X(r5.rho) - 8, m.Y(r5.kt) - 14, { role: 'label', color: A, align: 'right', alpha: ep(t, 3.0, 3.4) });
    text('hexagons', m.X(r5.rho) - 8, m.Y(r5.kh) + 26, { role: 'label', color: C.red, align: 'right', alpha: ep(t, 3.2, 3.6) });
    /* a probe walks the density range, reading the gap between the two panels as it goes */
    if (t > 6.5) {
      const pk = ep(t, 6.5, 7.0), u = 0.5 - 0.5 * Math.cos((t - 6.5) * TAU / 9), n = D.sweep.length - 1, f = u * n, i0 = Math.min(n - 1, Math.floor(f)), fr = f - i0, P0 = D.sweep[i0], P1 = D.sweep[i0 + 1];
      const L = (a, b) => Math.exp(lerp(Math.log(a), Math.log(b), fr)), rho = L(P0.rho, P1.rho), kt = L(P0.kt, P1.kt), kh = L(P0.kh, P1.kh), px = m.X(rho);
      line(px, m.Y(kt), px, m.Y(kh), { color: C.ink, w: 1.5, dash: [4, 4], alpha: pk * 0.6 });
      circle(px, m.Y(kt), 9, { color: A, w: 2, alpha: pk }); circle(px, m.Y(kh), 9, { color: C.red, w: 2, alpha: pk });
      text(`${(rho * 100).toFixed(0)}% material: ${(kt / kh).toFixed(kt / kh < 10 ? 1 : 0)}× stiffer`, px + (u > 0.55 ? -16 : 16), (m.Y(kt) + m.Y(kh)) / 2 + 5, { role: 'label', color: C.ink, align: u > 0.55 ? 'right' : 'left', alpha: pk });
    }
    const g0 = r0.kt / r0.kh, g5 = r5.kt / r5.kh;
    text(`Triangles ${g5.toFixed(0)}× stiffer at ${Math.round(r5.rho * 100)}% material, ${g0.toFixed(0)}× at ${Math.round(r0.rho * 100)}%`, wx + 28, wy + wh - 28, { role: 'small', size: 24, weight: 700, color: A, t, t0: 3.6, cps: 70 });
    const rx = 1110, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('same panels, three ways to load them', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(rx, wy, rw, ['derived'], ep(t, 1.0, 1.4)); text('how many times more the hexagons give', rx + 28, wy + 86, { role: 'small', size: 22, maxW: rw - 56, color: C.mute, alpha: ep(t, 1.2, 1.6) });
    const names = { press: 'pressed evenly from above', shear: 'pushed sideways at the top', point: 'one finger in the middle' };
    const rmaxv = Math.max(...D.modes.map(x => x.ratio));
    D.modes.forEach((x, i) => { const y = wy + 140 + i * 90, k = ep(t, 1.6 + i * 0.35, 2.4 + i * 0.35, E.snap), bw = (rw - 190) * Math.log10(x.ratio) / Math.log10(rmaxv * 1.15); text(names[x.m], rx + 28, y, { role: 'label', color: C.ink2, alpha: ep(t, 1.4 + i * 0.35, 1.8 + i * 0.35) }); rect(rx + 28, y + 14, Math.max(3, bw * k), 20, { fill: C.red }); text(x.ratio.toFixed(0) + '×', rx + 28 + bw * k + 10, y + 30, { role: 'label', color: C.red, alpha: k }); });
    text('Bar length on a log scale', rx + 28, wy + 418, { role: 'small', size: 21, color: C.faint, alpha: ep(t, 2.6, 3.0) });
    text('A triangle changes shape only by stretching a strut. A hexagon bends at its joints, the soft way to carry load.', rx + 28, wy + 462, { role: 'small', size: 24, color: C.ink, t, t0: 3.6, cps: 100, maxW: rw - 56, lh: 1.34 });
    gloss(t, 2.6, 'Relative density', 'The share of a panel that is material, not holes. A cutout shell runs low, where the gap is widest.');
    featureCard(t, 4.4, 'Triangles at every density', ['derived'], 'Stretching beats bending, and the lighter the panel, the bigger the win (#75).');
    captions(t, [[0.6, 'thin the struts to save weight and both panels get softer. the hexagons get softer much faster.'], [3.6, 'that is the textbook result: triangle stiffness scales with density, hexagon stiffness with density cubed. a light mouse lives at the bottom left of this chart.'], [6.2, 'and it holds for every way the hand loads the shell: pressing down, pushing sideways, or one finger in one spot.']]);
  }
});

/* ---------- filleting the lattice: what a rounded corner buys, and how big it should be ----------
   both slides read the study in 09-fillet-data.js: the same triangle lattice solved at eleven fillet radii, at
   the same mass (the struts thin as the fillets grow), pulled along one strut family. */
S({
  id: 'fillet', ch: 'shell', theme: 'night', title: 'round the lattice\'s corners', settle: 9, ideas: [75, 'fillet'], src: ['filletFE', 'beall106', 'doutre23'],
  draw: t => {
    header(t, 'round the lattice\'s corners');
    const wx = LM, wy = 272, ww = 1100, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    text('stress in the lattice, pulled along its struts', wx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.8, cps: 70 });
    cardPills(wx, wy, ww, ['derived'], ep(t, 0.9, 1.3)); text('finite elements, solved for this deck: the same mass at every radius', wx + 28, wy + 86, { role: 'small', size: 22, maxW: ww - 56, color: C.mute, alpha: ep(t, 1.0, 1.4) });
    const r = filR(t), f = filAt(r), sc = 1.28, ix = wx + 28, iy = wy + 104, iw = 512 * sc, ih = 354 * sc, ka = ep(t, 0.7, 1.4);
    const I0 = FILLET.img[f.i], I1 = FILLET.img[f.i + 1];
    G.save(); rrPath(ix, iy, iw, ih, 8); G.clip();
    G.globalAlpha = ka; G.fillStyle = '#121316'; G.fillRect(ix, iy, iw, ih);
    if (I0 && I0.complete) { G.globalAlpha = ka * (1 - f.k); G.drawImage(I0, ix, iy, iw, ih); }
    if (I1 && I1.complete && f.k > 0.001) { G.globalAlpha = ka * f.k; G.drawImage(I1, ix, iy, iw, ih); }
    G.restore(); G.globalAlpha = 1;
    rr(ix, iy, iw, ih, 8, null, inkA(0.14), 1.2, ka);
    /* the hottest point, ringed */
    const hs = FILLET.hot[f.k < 0.5 ? f.i : f.i + 1], hx = ix + hs[0] * FILLET.px * sc, hy = iy + hs[1] * FILLET.px * sc, kh = ep(t, 1.8, 2.2) * ka, pul = 0.5 + 0.5 * Math.sin(t * 5);
    circle(hx, hy, 9 + 4 * pul, { color: '#ffffff', w: 2, alpha: kh * 0.9 }); circle(hx, hy, 22 + 6 * pul, { color: A, w: 1.2, alpha: kh * 0.4 });
    const lx = hx < ix + iw / 2 ? hx + 34 : hx - 34, la = hx < ix + iw / 2 ? 'left' : 'right', ly = hy < iy + ih / 2 ? hy + 44 : hy - 30;
    line(hx + (la === 'left' ? 10 : -10), hy + (ly > hy ? 8 : -8), lx, ly - 6, { color: '#ffffff', w: 1.2, alpha: kh * 0.7 });
    text('peak ' + f.scf.toFixed(1) + '× the average', lx, ly + 8, { role: 'label', color: '#ffffff', align: la, alpha: kh });
    /* scale and legend */
    const k2 = ep(t, 1.4, 1.8); line(ix + 16, iy + ih - 18, ix + 16 + FILLET.px * sc, iy + ih - 18, { color: '#ffffff', w: 2, alpha: k2 * 0.8 }); text('1 mm', ix + 16 + FILLET.px * sc + 8, iy + ih - 13, { role: 'label', color: '#ffffff', alpha: k2 * 0.8 });
    const gx = ix + iw - 214, gy = iy + ih - 26, gw = 196, gr = G.createLinearGradient(gx, 0, gx + gw, 0);
    [[0, '#2a2c33'], [0.45, '#6e5a1f'], [0.62, '#c9a630'], [0.78, '#f2d860'], [1, '#ffffff']].forEach(([o, c]) => gr.addColorStop(o, c));
    G.save(); G.globalAlpha = k2; G.fillStyle = gr; G.fillRect(gx, gy, gw, 8); G.restore();
    text('0', gx, gy - 8, { role: 'label', size: 19, color: C.mute, alpha: k2 }); text('12×', gx + gw, gy - 8, { role: 'label', size: 19, color: C.mute, align: 'right', alpha: k2 });
    /* the readout */
    const ox = wx + 740, kr = ep(t, 1.2, 1.7), bw0 = ww - 740 - 32;
    const ro = (lab, y) => text(lab, ox, y, { role: 'label', size: 20, color: C.mute, alpha: kr });
    ro('Fillet radius', wy + 150); text(r.toFixed(2) + ' mm', ox, wy + 200, { font: 'disp', size: 46, weight: 800, color: A, alpha: kr, tnum: true });
    ro('Strut width', wy + 250); text(f.w.toFixed(2) + ' mm', ox, wy + 288, { font: 'disp', size: 34, weight: 800, color: C.ink, alpha: kr, tnum: true });
    ro('Peak stress', wy + 338); text(f.scf.toFixed(1) + '×', ox + bw0, wy + 338, { role: 'num', size: 24, color: f.scf > 12 ? C.red : A, align: 'right', alpha: kr });
    rr(ox, wy + 352, bw0, 12, 6, inkA(0.1), null, 0, kr); rr(ox, wy + 352, Math.max(12, bw0 * f.scf / 17), 12, 6, f.scf > 12 ? C.red : A, null, 0, kr);
    ro('Stiffness, same mass', wy + 408); const dE = (f.E / FILLET.ExM[0] - 1) * 100; text((dE >= 0 ? '+' : '') + dE.toFixed(1) + '%', ox, wy + 446, { font: 'disp', size: 34, weight: 800, color: dE > 0.5 ? A : C.ink, alpha: kr, tnum: true });
    text('vs a near-sharp corner', ox, wy + 478, { role: 'small', size: 22, color: C.faint, alpha: kr });
    /* what the radius buys */
    const rx = 1230, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('what the radius buys', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    const items = [
      ['Half the peak stress', ['derived'], 'From 16.6 to 8.3 times the average, at the same weight.'],
      ['A stiffer panel', ['derived'], '5.5% stiffer at 0.75 mm, for no added material.'],
      ['An easier fill', ['claim'], 'The melt turns the corner: lower pressure, less stress frozen in.'],
      ['And its cost', ['study'], 'A fillet is material. At equal mass it can weaken a lattice (Doutre).']
    ];
    let yy = wy + 96;
    items.forEach(([h2, ev, b], i) => { const k = ep(t, 1.6 + i * 0.7, 2.0 + i * 0.7); text(h2, rx + 28, yy, { role: 'label', color: i === 3 ? C.ink : A, alpha: k }); cardPills(rx, yy - 50, rw, ev, k); const rr2 = text(b, rx + 28, yy + 36, { role: 'small', size: 24, color: C.ink2, t, t0: 1.7 + i * 0.7, cps: 130, maxW: rw - 56, lh: 1.32 }); yy += 36 + rr2.h + 30; });
    gloss(t, 2.8, 'Fillet', 'A rounded inside corner. Here it rounds every triangular hole where the struts meet.');
    featureCard(t, 5.2, 'Filleted lattice corners', ['derived', 'proposal'], 'Every hole rounded at its corners, the radius solved at the panel\'s real weight (#75).');
    captions(t, [[0.6, 'a sharp corner in a lattice is a notch. the load running down a strut has to turn there, and it crowds into the corner.'], [3.4, 'round the corners and the same load turns gradually. at the same weight, the peak stress halves.'], [6.6, 'a fillet is material, though, so how big it should be gets solved, not guessed.']]);
  }
});
S({
  id: 'filletsize', ch: 'shell', theme: 'paper', title: 'how big the fillet should be', settle: 10, ideas: [75, 'fillet'], src: ['filletFE', 'beall106', 'protoWall'],
  draw: t => {
    header(t, 'how big the fillet should be');
    const wx = LM, wy = 272, ww = 1100, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    text('peak corner stress against fillet radius', wx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.8, cps: 70 });
    cardPills(wx, wy, ww, ['derived'], ep(t, 0.9, 1.3)); text('the lattice from the last slide, solved at eleven radii', wx + 28, wy + 86, { role: 'small', size: 22, maxW: ww - 56, color: C.mute, alpha: ep(t, 1.0, 1.4) });
    const m = axes(t, { x: wx + 110, y: wy + 118, w: ww - 170, h: 280, xr: [0, 1.25], yr: [4, 18], xticks: [0, 0.25, 0.5, 0.75, 1.0, 1.25], yticks: [4, 8, 12, 16], xfmt: v => v.toFixed(2) + ' mm', yfmt: v => v + '×', xlabel: 'fillet radius', t0: 1.0 });
    const R = FILLET.rs;
    /* the bottom of the curve, the pick, and where the struts get too thin to mold well */
    const kz = ep(t, 3.6, 4.2);
    rect(m.X(0.6), m.Y(18), m.X(1.05) - m.X(0.6), m.Y(4) - m.Y(18), { fill: rgba(A, 0.08), alpha: kz });
    rect(m.X(0.6), m.Y(18), m.X(0.75) - m.X(0.6), m.Y(4) - m.Y(18), { fill: rgba(A, 0.2), alpha: ep(t, 4.6, 5.2) });
    rect(m.X(1.05), m.Y(18), m.X(1.25) - m.X(1.05), m.Y(4) - m.Y(18), { fill: rgba(C.red, 0.08), alpha: ep(t, 5.4, 6.0) });
    text('Within 2% of the bottom', m.X(0.78), m.Y(17.4), { role: 'label', size: 19, color: A, align: 'center', alpha: kz });
    text('Thin', m.X(1.17), m.Y(17.4), { role: 'label', size: 19, color: C.red, align: 'center', alpha: ep(t, 5.4, 6.0) });
    series(m, R.map((r, i) => [r, FILLET.scfW[i]]), { color: C.gray, w: 2.5, dash: [7, 5], p: ep(t, 2.2, 3.4, E.lin) });
    series(m, R.map((r, i) => [r, FILLET.scfM[i]]), { color: A, w: 3.5, p: ep(t, 1.4, 2.8, E.lin) });
    R.forEach((r, i) => { const k = ep(t, 1.4 + i * 0.12, 1.8 + i * 0.12); circle(m.X(r), m.Y(FILLET.scfM[i]), 5, { fill: A, alpha: k }); });
    const ka = ep(t, 3.0, 3.4);
    text('Same mass: the struts thin as fillets grow', m.X(0.3), m.Y(10.9) - 28, { role: 'small', size: 23, weight: 600, color: A, alpha: ka });
    text('Same struts: lower, but 28% heavier', m.X(1.22), m.Y(FILLET.scfW[10]) + 30, { role: 'small', size: 23, weight: 600, color: C.mute, align: 'right', alpha: ep(t, 3.4, 3.8) });
    text('16.6×, near-sharp', m.X(0.05) + 12, m.Y(16.55) + 4, { role: 'label', color: C.ink2, alpha: ep(t, 1.6, 2.0) });
    /* a probe in step with the last slide's sweep */
    const r = filR(t), f = filAt(r), kp = ep(t, 2.6, 3.0);
    line(m.X(r), m.Y(4), m.X(r), m.Y(f.scf), { color: C.ink, w: 1.2, dash: [4, 4], alpha: kp * 0.5 });
    circle(m.X(r), m.Y(f.scf), 12, { color: C.ink, w: 1.5, alpha: kp * 0.4 }); circle(m.X(r), m.Y(f.scf), 6, { fill: C.ink, alpha: kp });
    text(r.toFixed(2) + ' mm: ' + f.scf.toFixed(1) + '×, struts ' + f.w.toFixed(2) + ' mm', m.X(r) + (r > 0.7 ? -16 : 16), m.Y(f.scf) - 18, { role: 'label', color: C.ink, align: r > 0.7 ? 'right' : 'left', alpha: kp });
    /* strut width at the same mass, under the chart */
    const sy = wy + 470, sx0 = m.X(0), sx1 = m.X(1.25), SY = v => sy + 44 - (v - 0.8) / 0.45 * 44, ks = ep(t, 2.0, 2.6);
    text('Strut width', wx + 28, sy + 14, { role: 'label', size: 20, color: C.mute, alpha: ks });
    poly(R.map((r2, i) => [m.X(r2), SY(FILLET.wM[i])]), { color: C.ink2, w: 2, alpha: ks });
    line(sx0, SY(0.9), sx1, SY(0.9), { color: C.red, w: 1.2, dash: [5, 4], alpha: ks });
    text('0.9 mm', sx1 - 4, SY(0.9) - 10, { role: 'label', size: 19, color: C.red, align: 'right', alpha: ks });
    /* how I pick it */
    const rx = 1230, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('how I pick it', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    const steps = [['Hold the weight', 'Solve every radius at the real mass.'], ['Find the bottom', 'The peak falls fast, then flattens past 0.6 mm.'], ['Take its small end', '0.6 to 0.75 mm: the gain, with wide struts.'], ['Check the mold', 'No strut under 0.9 mm, the floor for PP.']];
    steps.forEach(([h2, b], i) => { const y = wy + 100 + i * 96, k = ep(t, 1.6 + i * 0.6, 2.0 + i * 0.6); text(pad2(i + 1), rx + 28, y + 6, { font: 'disp', size: 36, weight: 800, color: A, alpha: k, tnum: true }); text(h2, rx + 84, y - 8, { role: 'label', color: C.ink, alpha: k }); text(b, rx + 84, y + 26, { role: 'small', size: 23, color: C.ink2, t, t0: 1.7 + i * 0.6, cps: 130, maxW: rw - 112, lh: 1.3 }); });
    text('About half the strut, where plastics guides land too (Beall).', rx + 28, wy + 512, { role: 'small', size: 23, weight: 600, color: C.mute, t, t0: 4.6, cps: 120, maxW: rw - 56, lh: 1.3 });
    gloss(t, 3.0, 'same mass', 'every design compared at the same weight. a mouse has a weight target, so any gain that adds grams isn\'t a free one.');
    featureCard(t, 5.6, 'a fillet sized by solving', ['derived', 'proposal'], 'about half the strut width, 0.6 to 0.75 mm here, re-solved for each lattice at its real mass.');
    captions(t, [[0.6, 'held at the same weight, a fillet trades corner stress against strut width, so the curve has a bottom.'], [3.8, 'most of the gain comes in the first half millimetre. past 0.75 mm the struts thin faster than the corners improve.'], [7.0, 'so the pick is the small end of the bottom: nearly all the benefit, and struts wide enough to mold and hold.']]);
  }
});

/* ---------- the fillet sweep, solved: the stress field of a test lattice at the same weight, radius by radius ----------
   reads the study in 09-fillet-data.js: one triangle lattice solved at eleven fillet radii, at the same mass (the
   struts thin as the fillets grow), pulled along one strut family, the worse of the two directions solved. */
function filAt(r) {
  const R = FILLET.rs; let i = 0; while (i < R.length - 2 && R[i + 1] < r) i++;
  const k = clamp((r - R[i]) / (R[i + 1] - R[i])), L = a => lerp(a[i], a[i + 1], k);
  return { i, k, scf: L(FILLET.scfM), w: L(FILLET.wM), E: L(FILLET.ExM), scfW: L(FILLET.scfW), rhoW: L(FILLET.rhoW) };
}
/** the radius on screen: near-sharp, then rounded to the bottom of the curve, then the whole range in a loop */
function filR(t) {
  if (t < 3.0) return 0.05;
  if (t < 8.5) return lerp(0.05, 0.75, ep(t, 3.0, 5.2, E.io3));
  const u = (t - 8.5) % 12;
  return u < 3 ? lerp(0.75, 1.2, E.io3(u / 3)) : u < 4 ? 1.2 : u < 7 ? lerp(1.2, 0.05, E.io3((u - 4) / 3)) : u < 8 ? 0.05 : u < 11 ? lerp(0.05, 0.75, E.io3((u - 8) / 3)) : 0.75;
}
S({
  id: 'filletfe', ch: 'shell', theme: 'night', title: 'the fillet, solved at the same weight', settle: 10, ideas: [75, 'fillet'], src: ['filletFE', 'doutre23', 'envaliorRadii', 'protoWall'],
  draw: t => {
    header(t, 'the fillet, solved at the same weight');
    const wx = LM, wy = 272, ww = 1100, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    text('stress in a test lattice, pulled along its struts', wx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.8, cps: 70 });
    cardPills(wx, wy, ww, ['derived'], ep(t, 0.9, 1.3)); text('finite elements, solved for this deck; the same mass at every radius', wx + 28, wy + 86, { role: 'small', size: 22, maxW: ww - 56, color: C.mute, alpha: ep(t, 1.0, 1.4) });
    const r = filR(t), f = filAt(r), sc = 1.28, ix = wx + 28, iy = wy + 104, iw = 512 * sc, ih = 354 * sc, ka = ep(t, 0.7, 1.4);
    const I0 = FILLET.img[f.i], I1 = FILLET.img[f.i + 1];
    G.save(); rrPath(ix, iy, iw, ih, 8); G.clip();
    G.globalAlpha = ka; G.fillStyle = '#121316'; G.fillRect(ix, iy, iw, ih);
    if (I0 && I0.complete) { G.globalAlpha = ka * (1 - f.k); G.drawImage(I0, ix, iy, iw, ih); }
    if (I1 && I1.complete && f.k > 0.001) { G.globalAlpha = ka * f.k; G.drawImage(I1, ix, iy, iw, ih); }
    G.restore(); G.globalAlpha = 1;
    rr(ix, iy, iw, ih, 8, null, inkA(0.14), 1.2, ka);
    /* the hottest point, ringed */
    const hs = FILLET.hot[f.k < 0.5 ? f.i : f.i + 1], hx = ix + hs[0] * FILLET.px * sc, hy = iy + hs[1] * FILLET.px * sc, kh = ep(t, 1.8, 2.2) * ka, pul = 0.5 + 0.5 * Math.sin(t * 5);
    circle(hx, hy, 9 + 4 * pul, { color: '#ffffff', w: 2, alpha: kh * 0.9 }); circle(hx, hy, 22 + 6 * pul, { color: A, w: 1.2, alpha: kh * 0.4 });
    const left = hx < ix + iw / 2, lx = left ? hx + 34 : hx - 34, ly = hy < iy + ih / 2 ? hy + 44 : hy - 30;
    line(hx + (left ? 10 : -10), hy + (ly > hy ? 8 : -8), lx, ly - 6, { color: '#ffffff', w: 1.2, alpha: kh * 0.7 });
    text('peak ' + f.scf.toFixed(1) + '× the average', lx, ly + 8, { role: 'label', color: '#ffffff', align: left ? 'left' : 'right', alpha: kh });
    /* scale and legend */
    const k2 = ep(t, 1.4, 1.8); line(ix + 16, iy + ih - 18, ix + 16 + FILLET.px * sc, iy + ih - 18, { color: '#ffffff', w: 2, alpha: k2 * 0.8 }); text('1 mm', ix + 16 + FILLET.px * sc + 8, iy + ih - 13, { role: 'label', color: '#ffffff', alpha: k2 * 0.8 });
    const gx = ix + iw - 214, gy = iy + ih - 26, gw = 196, gr = G.createLinearGradient(gx, 0, gx + gw, 0);
    [[0, '#2a2c33'], [0.45, '#6e5a1f'], [0.62, '#c9a630'], [0.78, '#f2d860'], [1, '#ffffff']].forEach(([o, c]) => gr.addColorStop(o, c));
    G.save(); G.globalAlpha = k2; G.fillStyle = gr; G.fillRect(gx, gy, gw, 8); G.restore();
    text('0', gx, gy - 8, { role: 'label', size: 19, color: '#c9c8c2', alpha: k2 }); text('12×', gx + gw, gy - 8, { role: 'label', size: 19, color: '#c9c8c2', align: 'right', alpha: k2 });
    /* the readout */
    const ox = wx + 740, kr = ep(t, 1.2, 1.7), bw0 = ww - 740 - 32;
    const ro = (lab, y) => text(lab, ox, y, { role: 'label', size: 20, color: C.mute, alpha: kr });
    ro('Fillet radius', wy + 150); text(r.toFixed(2) + ' mm', ox, wy + 200, { font: 'disp', size: 46, weight: 800, color: A, alpha: kr, tnum: true });
    ro('Strut width', wy + 250); text(f.w.toFixed(2) + ' mm', ox, wy + 288, { font: 'disp', size: 34, weight: 800, color: f.w < 0.9 ? C.red : C.ink, alpha: kr, tnum: true });
    ro('Peak stress', wy + 338); text(f.scf.toFixed(1) + '×', ox + bw0, wy + 338, { role: 'num', size: 24, color: f.scf > 12 ? C.red : A, align: 'right', alpha: kr });
    rr(ox, wy + 352, bw0, 12, 6, inkA(0.1), null, 0, kr); rr(ox, wy + 352, Math.max(12, bw0 * f.scf / 17), 12, 6, f.scf > 12 ? C.red : A, null, 0, kr);
    ro('Stiffness, same mass', wy + 408); const dE = (f.E / FILLET.ExM[0] - 1) * 100; text((dE >= 0 ? '+' : '') + dE.toFixed(1) + '%', ox, wy + 446, { font: 'disp', size: 34, weight: 800, color: dE > 0.5 ? A : C.ink, alpha: kr, tnum: true });
    text('vs a near-sharp corner', ox, wy + 478, { role: 'small', size: 22, color: C.faint, alpha: kr });
    /* the sweep as a curve */
    const rx = 1230, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('peak stress against radius', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    const m = axes(t, { x: rx + 78, y: wy + 84, w: rw - 112, h: 214, xr: [0, 1.25], yr: [5, 17], xticks: [0, 0.25, 0.5, 0.75, 1.0, 1.25], yticks: [6, 10, 14], xfmt: v => v.toFixed(2), yfmt: v => v + '×', xlabel: 'fillet radius, mm', t0: 1.0 });
    const R = FILLET.rs, kz = ep(t, 3.6, 4.2);
    rect(m.X(0.6), m.Y(17), m.X(1.05) - m.X(0.6), m.Y(5) - m.Y(17), { fill: rgba(A, 0.08), alpha: kz });
    rect(m.X(0.6), m.Y(17), m.X(0.75) - m.X(0.6), m.Y(5) - m.Y(17), { fill: rgba(A, 0.22), alpha: ep(t, 4.6, 5.2) });
    rect(m.X(1.05), m.Y(17), m.X(1.25) - m.X(1.05), m.Y(5) - m.Y(17), { fill: rgba(C.red, 0.1), alpha: ep(t, 5.4, 6.0) });
    text('pick', m.X(0.675), m.Y(16.1), { role: 'label', color: A, align: 'center', alpha: ep(t, 4.6, 5.2) });
    text('thin', m.X(1.15), m.Y(16.1), { role: 'label', color: C.red, align: 'center', alpha: ep(t, 5.4, 6.0) });
    series(m, R.map((r2, i) => [r2, FILLET.scfW[i]]), { color: C.gray, w: 2, dash: [6, 5], p: ep(t, 2.2, 3.4, E.lin) });
    series(m, R.map((r2, i) => [r2, FILLET.scfM[i]]), { color: A, w: 3, p: ep(t, 1.4, 2.8, E.lin) });
    R.forEach((r2, i) => { const k = ep(t, 1.4 + i * 0.12, 1.8 + i * 0.12); circle(m.X(r2), m.Y(FILLET.scfM[i]), 4, { fill: A, alpha: k }); });
    const kp = ep(t, 2.6, 3.0); circle(m.X(r), m.Y(f.scf), 11, { color: C.ink, w: 1.5, alpha: kp * 0.4 }); circle(m.X(r), m.Y(f.scf), 5, { fill: C.ink, alpha: kp });
    text('same weight', m.X(0.32), m.Y(11.6), { role: 'label', color: A, alpha: ep(t, 3.0, 3.4) });
    text('Dashed: same struts, 28% heavier', m.X(0.27), m.Y(5.55), { role: 'label', size: 19, color: C.mute, alpha: ep(t, 3.4, 3.8) });
    let ny = wy + 392;
    [['The bottom is broad: 0.6 to 1.05 mm all land within 2% of the best.', C.ink2], ['Take its small end, 0.6 to 0.75 mm, with the struts kept widest.', C.ink], ['Past 1.05 mm the struts drop under 0.9 mm, the floor for PP.', C.red]].forEach(([s2, col], i) => { const r2 = text(s2, rx + 28, ny, { role: 'small', size: 23, weight: i === 1 ? 700 : 500, color: col, t, t0: 3.8 + i * 0.8, cps: 120, maxW: rw - 56, lh: 1.32 }); ny += r2.h + 10; });
    gloss(t, 2.8, 'Finite elements', 'The panel split into tens of thousands of small triangles, each solved, so the stress shows everywhere.');
    featureCard(t, 5.6, 'A fillet sized by solving', ['derived', 'proposal'], 'Half to three quarters of the strut, re-solved for each lattice at its real weight (#75).');
    captions(t, [[0.6, 'this is that sweep, solved: a test lattice pulled along its struts, held at the same weight for every radius.'], [3.6, 'from a near-sharp corner to 0.75 mm the peak stress halves, and the panel gets 5.5% stiffer for no added material.'], [7.0, 'fillets aren\'t free: held to the same mass, they weakened 3D-printed octet trusses (Doutre et al.). here the bottom is broad, so the pick is its small end.']]);
  }
});
/* ---------- triangles that form arches ---------- */
let ARCH = null;
function archSolve() {
  if (ARCH) return ARCH;
  const span = 60, rise = 14, N = 24, yA = x => -rise * (1 - Math.pow(x / (span / 2), 2));
  const build = kind => {
    const nodes = [], els = [];
    if (kind === 'flat') { for (let i = 0; i <= N; i++) nodes.push([-30 + 60 * i / N, 0]); for (let i = 0; i < N; i++) els.push({ n: [i, i + 1] }); return { nodes, els, fixed: [0, N], top: i => i } }
    if (kind === 'arch') { for (let i = 0; i <= N; i++) { const x = -30 + 60 * i / N; nodes.push([x, yA(x)]); } for (let i = 0; i < N; i++) els.push({ n: [i, i + 1] }); return { nodes, els, fixed: [0, N] }; }
    /* a triangulated arch: an outer arch, an inner arch 5 mm below it, a zig-zag of struts between */
    const M = 12; for (let i = 0; i <= M; i++) { const x = -30 + 60 * i / M; nodes.push([x, yA(x)]); }
    const inner = []; for (let i = 0; i < M; i++) { const x = -30 + 60 * (i + 0.5) / M; inner.push(nodes.length); nodes.push([x, yA(x) + 5 * Math.sin(Math.PI * (i + 0.5) / M)]); }
    for (let i = 0; i < M; i++) { els.push({ n: [i, i + 1] }); els.push({ n: [i, inner[i]] }); els.push({ n: [inner[i], i + 1] }); if (i < M - 1) els.push({ n: [inner[i], inner[i + 1]] }); }
    return { nodes, els, fixed: [0, M] };
  };
  const len = D => D.els.reduce((a, e) => a + Math.hypot(D.nodes[e.n[1]][0] - D.nodes[e.n[0]][0], D.nodes[e.n[1]][1] - D.nodes[e.n[0]][1]), 0);
  const mass = 60 * 1.6;
  const run = (kind, xLoad) => {
    const D = build(kind), t = mass / len(D);
    for (const e of D.els) { e.A = t; e.I = t * t * t / 12; }
    let li = 0, bd = 1e9; D.nodes.forEach((p, i) => { const onTop = kind !== 'truss' || i <= 12; if (!onTop) return; const d = Math.abs(p[0] - xLoad); if (d < bd) { bd = d; li = i; } });
    const U = frameSolve(D.nodes, D.els, D.fixed, [[li, 0, -1]]);
    return { D, U, t, li, d: -U[li * 3 + 1] };
  };
  const kinds = ['flat', 'arch', 'truss'];
  ARCH = { centre: kinds.map(k => run(k, 0)), off: kinds.map(k => run(k, 15)) };
  return ARCH;
}
S({
  id: 'arches', ch: 'shell', theme: 'night', title: 'triangles that form arches', settle: 10, ideas: [53, 55], src: ['comsol'],
  draw: t => {
    header(t, 'triangles that form arches');
    const wx = LM, wy = 272, ww = 1728, wh = 568, A = acc(), R = archSolve();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    text('the same mass of material across a 60 mm span, ends on two screw bosses', wx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(wx, wy, ww, ['derived'], ep(t, 1.0, 1.4)); text('frames solved in this page; deflection drawn exaggerated, the same for all', wx + 28, wy + 86, { role: 'small', size: 22, maxW: ww - 56, color: C.mute, alpha: ep(t, 1.2, 1.6) });
    /* after the first pass the finger keeps alternating, middle then off-centre, so the gap between the designs stays on screen */
    const c9 = t >= 9 ? (t - 9) % 8 : -1;
    const off = c9 >= 0 ? (c9 < 0.6 || c9 >= 4.0) : t > 5.6, set = off ? R.off : R.centre, base = set[0].d;
    const ld = c9 >= 0 ? (c9 < 0.6 ? 1 - ep(c9, 0, 0.6) : c9 < 4 ? ep(c9, 0.7, 1.5) * (1 - ep(c9, 3.4, 4.0)) : ep(c9, 4.1, 4.9)) : ep(t, 1.8, 2.8, E.io3) * (off ? ep(t, 5.6, 6.4, E.io3) : 1 - ep(t, 5.2, 5.6));
    const swap = c9 >= 0 ? 1 - 0.75 * Math.max(env(c9, 0.35, 0.6, 0.6, 0.85), env(c9, 3.75, 4.0, 4.0, 4.25)) : 1;
    const mag = 6 / R.centre[0].d;
    const labels = [['a flat panel', C.red], ['an arch', C.ink2], ['a triangulated arch', A]];
    set.forEach((r, ci) => {
      const ox = wx + 290 + ci * 575, oy = wy + 330, sc = 7.2, k = ep(t, 0.8 + ci * 0.3, 1.4 + ci * 0.3), D = r.D;
      const P = (i, f) => [ox + (D.nodes[i][0] + r.U[i * 3] * mag * f) * sc, oy + (D.nodes[i][1] + r.U[i * 3 + 1] * mag * f) * sc];
      const f = ld;
      G.save(); G.globalAlpha = k * 0.35; G.strokeStyle = C.faint; G.lineWidth = 1.2; G.setLineDash([4, 4]); G.beginPath(); for (const e of D.els) { const p = P(e.n[0], 0), q = P(e.n[1], 0); G.moveTo(p[0], p[1]); G.lineTo(q[0], q[1]); } G.stroke(); G.setLineDash([]); G.restore();
      G.save(); G.globalAlpha = k; G.strokeStyle = labels[ci][1]; G.lineCap = 'round'; G.lineWidth = Math.max(2.2, r.t * sc * 0.55); G.beginPath(); for (const e of D.els) { const p = P(e.n[0], f), q = P(e.n[1], f); G.moveTo(p[0], p[1]); G.lineTo(q[0], q[1]); } G.stroke(); G.restore();
      for (const sx of [-1, 1]) part(0, 0, 1, () => solid(() => { G.beginPath(); G.rect(ox + sx * 30 * sc - 18, oy - 4, 36, 60); }, MT.shell, [ox + sx * 30 * sc - 18, oy - 4, 36, 60], { hatch: true }), { alpha: k });
      const lp = P(r.li, f); arrow(lp[0], lp[1] - 86, lp[0], lp[1] - 10, { color: C.ink, w: 3.5, hs: 13, alpha: ep(t, 1.6, 2.0) });
      text(labels[ci][0], ox, wy + 140, { role: 'label', color: labels[ci][1], align: 'center', t, t0: 0.8 + ci * 0.3, cps: 60 });
      const rel = base / r.d;
      text(rel >= 10 ? rel.toFixed(0) + '× the flat panel' : rel > 1.05 ? rel.toFixed(1) + '× the flat panel' : 'baseline', ox, wy + 470, { role: 'h3', size: 30, color: labels[ci][1], align: 'center', alpha: ep(t, 3.0 + ci * 0.3, 3.4 + ci * 0.3) * swap });
    });
    text(off ? 'finger off-centre, 15 mm from the middle' : 'finger in the middle', wx + ww / 2, wy + 520, { role: 'label', color: off ? C.red : C.mute, align: 'center', alpha: ep(t, 2.0, 2.4) * swap });
    keyPlan(t, 1.0, wx + ww - 60, wy + 150, { s: 0.7, hi: 'hump', cut: { type: 'long', x: 0, label: 'E' }, label: 'section E' });
    gloss(t, 3.2, 'arch', 'a curve that turns a downward push into compression along itself, delivered to its ends. it needs solid ends to push against, like screw bosses.');
    featureCard(t, 6.8, 'arches built from triangles', ['derived', 'proposal'], 'connected arches landing on the screw bosses (#53), struts in the low front (#55).');
    captions(t, [[0.6, 'a flat span carries a press by bending, which is the soft way. curve the same material into an arch and the press becomes compression, carried to the ends.'], [3.6, 'build the arch out of triangles and no member has to bend at all: 22 times the flat panel, at the same weight.'], [6.6, 'move the finger off-centre and every design gives more, but the triangulated arch stays about two and a half times stiffer than the plain one.']]);
  }
});

/* ---------- fewer parts, tighter tolerances ---------- */
let TOL = null;
function tolSim() {
  if (TOL) return TOL;
  const r = rng(29), gauss = () => { const u = Math.max(1e-9, r()), v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v); };
  const sigma = 0.05 / 3, spec = 0.05, n = 2400;
  const sets = [1, 3, 6].map(N => { const g = []; for (let i = 0; i < n; i++) { let s = 0; for (let k = 0; k < N; k++) s += gauss() * sigma; g.push(s); } const out = g.filter(v => Math.abs(v) > spec).length / n; return { N, g, out }; });
  return (TOL = { sets, sigma, spec, n });
}
S({
  id: 'tolerance', ch: 'shell', theme: 'paper', title: 'fewer parts, tighter gaps', settle: 10, ideas: [57], src: ['dfma', 'rtingsUlx', 'xt1'],
  draw: t => {
    header(t, 'fewer parts, tighter gaps');
    const wx = LM, wy = 272, ww = 1180, wh = 568, A = acc(), T = tolSim();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    text('2,400 simulated mice: one seam\'s gap', wx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(wx, wy, ww, ['derived'], ep(t, 1.0, 1.4)); text('Each part off by up to ±0.05 mm (3σ); the seam allows ±0.05 mm', wx + 28, wy + 86, { role: 'small', size: 22, maxW: ww - 56, color: C.mute, alpha: ep(t, 1.2, 1.6) });
    const fill = ep(t, 1.4, 4.4, E.lin);
    T.sets.forEach((st, ci) => {
      const ox = wx + 40 + ci * 375, oy = wy + 430, bw = 330, bins = 31, lo = -0.155, hi = 0.155, X = v => ox + bw * (v - lo) / (hi - lo), cnt = new Array(bins).fill(0);
      const shown = Math.floor(st.g.length * fill);
      for (let i = 0; i < shown; i++) { const b = Math.floor((st.g[i] - lo) / (hi - lo) * bins); if (b >= 0 && b < bins) cnt[b]++; }
      const cmax = T.n * 0.42, k = ep(t, 1.0 + ci * 0.2, 1.4 + ci * 0.2);
      rect(X(-T.spec), oy - 250, X(T.spec) - X(-T.spec), 250, { fill: rgba(A, 0.12), alpha: k });
      for (let b = 0; b < bins; b++) { const v0 = lo + (hi - lo) * b / bins, v1 = v0 + (hi - lo) / bins, h = Math.min(250, 250 * cnt[b] / cmax), inSpec = Math.abs((v0 + v1) / 2) <= T.spec; rect(X(v0) + 1, oy - h, X(v1) - X(v0) - 2, h, { fill: inSpec ? A : C.red }); }
      /* once the run is in, the line keeps building: each new mouse drops into its bin, red when its seam is out */
      if (t > 5) {
        const per = 0.42, j = Math.floor((t - 5) / per), ph = ((t - 5) % per) / per, v = st.g[(j * 7 + ci * 13) % st.g.length], b = Math.floor((v - lo) / (hi - lo) * bins);
        if (b >= 0 && b < bins) {
          const h = Math.min(250, 250 * cnt[b] / cmax), xx = X(lo + (hi - lo) * (b + 0.5) / bins), y1 = oy - h - 6, yy = lerp(oy - 250, y1, E.in3(clamp(ph / 0.7))), bad = Math.abs(v) > T.spec, la = ep(t, 5, 5.4);
          circle(xx, yy, 5, { fill: bad ? C.red : A, alpha: la * (1 - clamp((ph - 0.85) / 0.15)) });
          if (ph > 0.7) circle(xx, y1, 5 + (ph - 0.7) * 40, { color: bad ? C.red : A, w: 1.5, alpha: la * (1 - (ph - 0.7) / 0.3) * 0.7 });
        }
      }
      line(ox, oy, ox + bw, oy, { color: C.faint, w: 1.5, alpha: k });
      for (const v of [-0.1, 0, 0.1]) text((v > 0 ? '+' : '') + v.toFixed(1), X(v), oy + 24, { role: 'tick', size: 19, color: C.mute, align: 'center', alpha: k });
      text(st.N === 1 ? 'One part' : st.N + ' parts', ox, oy - 268, { role: 'label', color: C.ink, alpha: k });
      const outNow = shown ? st.g.slice(0, shown).filter(v => Math.abs(v) > T.spec).length / shown : 0;
      text((outNow * 100).toFixed(1) + '% out', ox, oy + 58, { role: 'num', size: 24, color: outNow > 0.05 ? C.red : A, alpha: ep(t, 1.8, 2.2) });
    });
    text('Gap error, {mm}', wx + ww - 28, wy + wh - 24, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: ep(t, 1.4, 1.8) });
    const rx = 1310, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('why one part can be perfected', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    const notes = [['Errors add: the spread grows with the square root of the parts, the worst case with the count.', C.ink], ['Features cut in one tool sit fixed to each other, so one part can be tuned in the steel.', C.ink], ['Across parts, every seam drifts on its own.', C.mute], ['In one DFMA case, halving the parts cut warranty cost to a tenth.', A]];
    let ny = wy + 104; notes.forEach(([s2, col], i) => { const r2 = text(s2, rx + 28, ny, { role: 'small', size: 23, weight: i ? 500 : 600, color: col, t, t0: 1.8 + i * 1.0, cps: 90, maxW: rw - 56, lh: 1.32 }); ny += Math.max(r2.h, 22) + 14; });
    gloss(t, 2.8, 'Tolerance stack', 'Every part is made slightly off. Where parts meet, their errors add up at the seam you see and feel.');
    featureCard(t, 6.2, 'A more unibody shell', ['derived', 'proposal'], 'Bottom rim, hump and sides as one part (#57): fewer seams, each tuned in the steel.');
    captions(t, [[0.6, 'every part is a little off its drawing. one part\'s error you can measure and correct in the mold.'], [3.8, 'stack the same seam through six parts and a fifth of the mice fall outside the gap, rattling or rubbing, even though every part is in spec.'], [6.8, 'that is the real case for fewer parts: each one left is a dimension you can actually perfect.']]);
  }
});

/* ---------- arches, struts and fewer parts: a generic slice across a thin shell, squeezed, solved as a frame ---------- */
const SLICE = (function () {
  /* a generic arch, 60 wide and 34 tall, clamped at the base. squeezed at mid-wall like a grip. mm and N, E folded in */
  const N = 56, nodes = [];
  for (let i = 0; i <= N; i++) { const th = Math.PI * (1 - i / N), c = Math.cos(th), s = Math.sin(th); nodes.push([30 * Math.sign(c) * Math.pow(Math.abs(c), 0.6), -34 * Math.pow(s, 0.7)]); }
  const near = (side) => { let best = 0, bd = 1e9; nodes.forEach((p, i) => { if (Math.sign(p[0]) !== side) return; const d = Math.abs(p[1] + 13); if (d < bd) { bd = d; best = i; } }); return best; };
  const iL = near(-1), iR = near(1);
  const elsFor = th => { const els = []; for (let i = 0; i < N; i++) { const t2 = th((nodes[i][1] + nodes[i + 1][1]) / 2); els.push({ n: [i, i + 1], A: t2, I: t2 * t2 * t2 / 12, t: t2 }); } return els; };
  const L = i => Math.hypot(nodes[i + 1][0] - nodes[i][0], nodes[i + 1][1] - nodes[i][1]);
  const flat = () => 1.2;
  const taperRaw = y => 0.7 + 0.6 * (1 + y / 34);                       /* thicker toward the bottom */
  let num = 0, den = 0; for (let i = 0; i < N; i++) { const y = (nodes[i][1] + nodes[i + 1][1]) / 2; num += 1.2 * L(i); den += taperRaw(y) * L(i); }
  const taper = y => taperRaw(y) * num / den;                           /* same mass as the flat wall */
  const run = (th, strut) => {
    const els = elsFor(th); if (strut) els.push({ n: [iL, iR], A: 1.6 * 1.5, I: 1.6 ** 3 / 12 * 1.5, t: 1.6, strut: true });
    const U = frameSolve(nodes, els, [0, N], [[iL, 1, 0], [iR, -1, 0]]);
    return { els, U, d: (U[iL * 3] - U[iR * 3]) / 2 };
  };
  const a = run(flat, false), b = run(taper, false), c = run(taper, true);
  return { nodes, iL, iR, a, b, c };
})();
S({
  id: 'ribs', ch: 'shell', theme: 'paper', title: 'arches, struts and fewer parts', settle: 9, ideas: [53, 55, 57, 93, 91], src: ['rtingsUlx', 'xt1', 'comsol'],
  draw: t => {
    header(t, 'arches, struts and fewer parts');
    const wx = LM, wy = 272, ww = 1000, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    text('A slice across a thin shell, squeezed', wx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(wx, wy, ww, ['derived'], ep(t, 1.0, 1.4));
    text('Generic arch, solved as a frame here; same mass in the first two', wx + 28, wy + 86, { role: 'small', size: 22, color: C.mute, alpha: ep(t, 1.2, 1.6) });
    const sq = ep(t, 2.2, 3.4, E.io3) * (t > 3.4 ? 0.8 + 0.2 * Math.cos((t - 3.4) * 1.9) : 1), mag = 4 / SLICE.a.d;
    const cases = [[SLICE.a, 'Even walls', C.red, 1.2], [SLICE.b, 'Thicker low', C.ink, 1.6], [SLICE.c, 'Plus the PCB', A, 2.0]];
    cases.forEach(([R, label, col, t0], ci) => {
      const ox = wx + 170 + ci * 330, oy = wy + 410, sc = 4.2, k = ep(t, t0, t0 + 0.6);
      const P = (i, f) => [ox + (SLICE.nodes[i][0] + R.U[i * 3] * mag * f) * sc, oy + (SLICE.nodes[i][1] + R.U[i * 3 + 1] * mag * f) * sc];
      G.save(); G.globalAlpha = k * 0.4; G.strokeStyle = C.faint; G.lineWidth = 1.2; G.setLineDash([4, 4]); G.beginPath(); SLICE.nodes.forEach((p, i) => { const q = P(i, 0); i ? G.lineTo(q[0], q[1]) : G.moveTo(q[0], q[1]); }); G.stroke(); G.setLineDash([]); G.restore();
      G.save(); G.globalAlpha = k; G.lineCap = 'round'; G.strokeStyle = TH ? '#2f3036' : '#3a3b41';
      for (const e of R.els) { const p = P(e.n[0], sq), q = P(e.n[1], sq); G.lineWidth = e.t * sc * 1.4; G.beginPath(); G.moveTo(p[0], p[1]); G.lineTo(q[0], q[1]); G.strokeStyle = e.strut ? A : '#3a3b41'; G.stroke(); }
      G.restore();
      part(0, 0, 1, () => solid(() => { G.beginPath(); G.rect(ox - 34 * sc, oy, 68 * sc, 10); }, MT.shell, [ox - 34 * sc, oy, 68 * sc, 10], { hatch: true }), { alpha: k });
      const pl = P(SLICE.iL, sq), pr2 = P(SLICE.iR, sq);
      arrow(pl[0] - 62, pl[1], pl[0] - 8, pl[1], { color: C.ink, w: 3, hs: 11, alpha: ep(t, 2.0, 2.4) }); arrow(pr2[0] + 62, pr2[1], pr2[0] + 8, pr2[1], { color: C.ink, w: 3, hs: 11, alpha: ep(t, 2.0, 2.4) });
      text(label, ox, oy + 44, { role: 'label', color: col, align: 'center', t, t0, cps: 70, maxW: 300 });
      const rel = R.d / SLICE.a.d;
      text(rel > 0.1 ? rel.toFixed(2) + '×' : rel.toFixed(3) + '×', ox, oy + 76, { role: 'h3', size: 30, color: col, align: 'center', alpha: ep(t, 3.6 + ci * 0.3, 4.0 + ci * 0.3) });
    });
    text('Squeeze relative to even walls; deflection exaggerated.', wx + ww - 28, wy + wh - 22, { role: 'small', size: 21, color: C.faint, align: 'right', alpha: ep(t, 4.4, 4.8) });
    const rx = 1140, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('gap stack-up, by number of parts', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(rx, wy, rw, ['derived'], ep(t, 1.0, 1.4));
    const m = axes(t, { x: rx + 104, y: wy + 110, w: rw - 140, h: 210, xr: [1, 6], yr: [0, 0.32], xticks: [1, 2, 3, 4, 5, 6], yticks: [0, 0.1, 0.2, 0.3], yfmt: v => v.toFixed(1) + ' mm', xlabel: 'Parts in the stack', t0: 1.0 });
    series(m, [[1, 0.05], [6, 0.30]], { color: C.red, w: 3, p: ep(t, 1.4, 2.2, E.lin) });
    const rss = []; for (let n = 1; n <= 6.01; n += 0.1) rss.push([n, 0.05 * Math.sqrt(n)]); series(m, rss, { color: C.ink, w: 2.5, dash: [6, 5], p: ep(t, 1.8, 2.6, E.lin) });
    text('worst case', m.X(6) - 4, m.Y(0.30) - 12, { role: 'label', color: C.red, align: 'right', alpha: ep(t, 2.2, 2.6) });
    text('typical (RSS)', m.X(6) - 4, m.Y(0.05 * Math.sqrt(6)) + 22, { role: 'label', color: C.ink, align: 'right', alpha: ep(t, 2.6, 3.0) });
    text('Fewer parts, fewer seams to creak. RTINGS heard creaking on a multi-part carbon shell; the one-part Carbon XT1 shell was built to stop it.', rx + 28, wy + 440, { role: 'small', color: C.ink2, t, t0: 4.2, cps: 120, maxW: rw - 56, lh: 1.45 });
    keyPlan(t, 1.0, wx + ww - 80, wy + 170, { s: 0.55, cut: { type: 'cross', y: 12, label: 'D' }, label: 'Section D' });
    gloss(t, 3.6, 'Load path', 'The route a force takes to where the part is held. A rib only helps if both ends land on something stiff.');
    featureCard(t, 5.0, 'Arches and a unibody shell', ['derived', 'proposal'], 'Arches on the bosses (#53), front struts (#55), thicker low walls (#93), side PCB as a rib (#91), fewer parts (#57).');
    captions(t, [[0.6, 'grip a thin shell and the walls bow in. moving material toward the bottom, where the bending is, helps at the same weight.'], [3.6, 'a strut across the shell carries the squeeze straight through. the side-button PCB is already there to be that strut.'], [5.6, 'and every part boundary is a tolerance that stacks. a more unibody shell has fewer of them to add up.']]);
  }
});
S({
  id: 'sealed', ch: 'shell', theme: 'night', title: 'a solid shell keeps the encoder clean', settle: 9, ideas: [15, 58, 26, 98], src: ['pulsarEnc'],
  draw: t => {
    header(t, 'a solid shell keeps the encoder clean');
    const wx = LM, wy = 272, ww = 1728, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    const r = rng(11), parts = [];
    for (let i = 0; i < 170; i++) parts.push([r(), r(), 0.6 + r() * 0.8]);
    const S2 = 19, pile = clamp((t - 2.2) / 7);
    const panel = (ox, holes, label, col) => {
      const w = 760, y0 = wy + 220, k = ep(t, 0.6, 1.2), hx = [], ex = ox + 230, ey = y0 + 150;
      if (holes) for (let x = ox + 34; x < ox + w - 40; x += 48) hx.push(x);
      /* the shell wall in section: a hatched strip, with or without holes */
      part(0, 0, 1, () => {
        const xs = [ox].concat(hx.flatMap(h => [h, h + 22])).concat([ox + w]);
        for (let i = 0; i < xs.length; i += 2) { const a = xs[i], b = xs[i + 1]; solid(() => { G.beginPath(); G.rect(a, y0, b - a, 26); }, MT.shell, [a, y0, b - a, 26], { hatch: true }); }
      }, { alpha: k });
      part(ex, ey, S2, () => encoderMM({}), { alpha: k });
      text('encoder', ex, ey + 5.0 * S2 + 52, { role: 'label', color: C.mute, align: 'center', alpha: k });
      const eTop = ey - 3.6 * S2, eL = ex - 3.8 * S2, eR = ex + 3.8 * S2;
      for (const [u, v, sp] of parts) {
        if (t < 1.6) continue;
        const tt = (t - 1.6) * sp * 0.45 + v, ph = tt % 1, cyc2 = Math.floor(tt);
        const x = ox + 20 + ((u * 7.31 + cyc2 * 0.37) % 1) * (w - 40); let y = wy + 70 + ph * 340;
        const overHole = hx.some(h2 => x > h2 + 2 && x < h2 + 20);
        if (y > y0 - 3 && !(holes && overHole)) y = y0 - 3;
        else if (y > y0 + 26) { if (!(x > eL && x < eR) && y > y0 + 70) continue; y = Math.min(y, x > eL && x < eR ? eTop - 3 : y); }
        circle(x, y, 2.2, { fill: y >= y0 + 26 ? C.red : C.ink2, alpha: 0.8 * (y >= y0 + 26 && !(x > eL && x < eR) ? 1 - clamp((y - y0 - 26) / 44) : 1) });
      }
      /* what builds up: inside the encoder with cutouts, on the outside without */
      const rp = rng(holes ? 5 : 9), n = Math.floor(pile * 46);
      for (let i = 0; i < n; i++) { const u = rp(), v2 = rp(); const px = holes ? lerp(eL + 10, eR - 10, u) : lerp(ox + 240, ox + 520, u), py = (holes ? eTop : y0) - 3 - v2 * 7 * Math.sin(u * Math.PI); circle(px, py, 2.6, { fill: holes ? C.red : C.ink2, alpha: k * 0.9 }); }
      if (!holes && pile > 0.4) text('on the outside: wipe it off', ox + 380, y0 - 26, { role: 'label', color: A, align: 'center', alpha: ep(t, 4.6, 5.0) });
      /* the scroll signal the encoder sends: clean pulses, or skips as dirt builds up */
      const sx = ox + 400, sy = y0 + 92, sw2 = 330, sh2 = 44, kk = ep(t, 1.4, 1.8);
      text('scroll signal', sx, sy - 14, { role: 'label', color: C.mute, alpha: kk });
      rr(sx, sy, sw2, sh2 + 14, 6, inkA(0.04), inkA(0.14), 1, kk);
      const off = (t * 70) % 22, pts = []; let skips = 0;
      for (let j = -1; j < sw2 / 22 + 1; j++) {
        const x0 = sx + 8 + j * 22 - off, id = Math.floor((t * 70) / 22) + j, h = Math.abs(Math.sin(id * 12.9898) * 43758.5453) % 1, bad = holes && h < pile * 0.42;
        if (bad) skips++;
        const hi = sy + 10, lo = sy + sh2 + 2;
        pts.push([x0, lo], [x0, bad ? lo : hi], [x0 + 11, bad ? lo : hi], [x0 + 11, lo]);
        if (bad) { G.save(); G.beginPath(); G.rect(sx + 2, sy, sw2 - 4, sh2 + 14); G.clip(); rect(x0 - 2, sy + 4, 15, sh2 + 4, { fill: rgba(C.red, 0.16), alpha: kk }); G.restore(); }
      }
      G.save(); G.beginPath(); G.rect(sx + 2, sy, sw2 - 4, sh2 + 14); G.clip(); poly(pts, { color: holes ? C.red : A, w: 2, alpha: kk }); G.restore();
      text(holes ? (pile > 0.15 ? 'Missed steps' : 'Clean, for now') : 'Clean', sx + sw2, sy + sh2 + 40, { role: 'label', color: holes && pile > 0.15 ? C.red : A, align: 'right', alpha: kk });
      text(label, ox, wy + 52, { role: 'label', color: col, t, t0: 1.0, cps: 60 });
    };
    panel(wx + 60, true, 'cutouts: dust and liquid reach the encoder', C.red);
    panel(wx + 900, false, 'solid: they stay on the outside, where you can wipe them', A);
    text('An illustration. Pulsar\'s support page blames jittery scrolling on dust, dirt or fluids in the encoder.', wx + 28, wy + wh - 22, { role: 'small', size: 21, color: C.faint, alpha: ep(t, 2.4, 2.8), maxW: ww - 56 });
    keyPlan(t, 1.0, wx + ww - 80, wy + 150, { s: 0.5, hi: 'wheel', label: 'Encoder' });
    gloss(t, 3.0, 'Encoder', 'The part that reads the wheel turning. It\'s open, so dirt inside shows up as skipped scrolling.');
    featureCard(t, 4.4, 'A fully solid shell', ['claim', 'proposal'], 'Easier to mold (#15), no cutout by the wheel (#58), a thin bottom sticker (#26), a coated PCB (#98).');
    captions(t, [[0.6, 'cutouts save weight, but every one is an open path to the most common failure point in a mouse.'], [3.6, 'a solid shell also molds more easily: no small isolated areas for the plastic to fill.'], [6.0, 'sweat shows on a solid surface a little more, and a good coating handles that. the gunk that builds up in holes doesn\'t wipe off.']]);
  }
});
S({
  id: 'mass', ch: 'shell', theme: 'paper', title: 'keep the mass low, near the fingers', settle: 9, ideas: [95, 31], src: ['xt1'],
  draw: t => {
    header(t, 'keep the mass low, near the fingers');
    const wx = LM, wy = 272, ww = 860, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    text('the mouse as a rigid block, in a flick', wx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.8, cps: 70 });
    const s = 8, gx = wx + 400, gy = wy + 420, hf = 11, low = ep(t, 5.0, 6.2, E.io3), hc = lerp(16, 11.5, low);
    const fl = Math.sin(Math.max(0, t - 2) * 2.2) * ep(t, 2, 2.5), M = 0.035 * 30 * (hc - hf);
    const tilt = -fl * M * 0.012;
    /* the pad */
    part(0, 0, 1, () => solid(() => { G.beginPath(); G.rect(wx + 30, gy, ww - 60, 18); }, MT.cloth, [wx + 30, gy, ww - 60, 18], {}), { alpha: ep(t, 0.4, 0.8) });
    part(gx, gy, s, () => {
      xabout(fl >= 0 ? 30 : -30, 0, tilt);
      solid(() => pathRR(-30, -34, 60, 34, 7), { g: ['#3b3c42', '#2a2b30'], dark: 1 }, [-30, -34, 60, 34], { lw: 1.3 });
      /* the heavy parts, dashed: battery and board, sliding down as the design improves */
      const by = lerp(-21, -9, low);
      G.setLineDash([lw(6), lw(4)]); G.strokeStyle = 'rgba(236,235,231,0.55)'; G.lineWidth = lw(1.4);
      pathRR(-14, by - 4, 20, 8, 1); G.stroke(); pathRR(-24, -6.5, 48, 2.2, 0.6); G.stroke(); G.setLineDash([]);
      G.save(); G.translate(-4, by + 1.3); G.scale(mmpx(), mmpx()); setFont({ role: 'label' }); G.fillStyle = 'rgba(236,235,231,0.7)'; G.textAlign = 'center'; G.fillText('battery', 0, 0); G.restore();
    }, { alpha: ep(t, 0.4, 0.9) });
    const pc = [gx - 4 * s, gy - hc * s], pg = [gx + 30 * s, gy - hf * s];
    arrow(pg[0] + 110, pg[1], pg[0] + 6, pg[1], { color: C.ink, w: 3.5, hs: 14, alpha: ep(t, 1.4, 1.8) });
    text('Fingers push here', wx + ww - 28, pg[1] - 44, { role: 'label', size: 20, color: C.ink, align: 'right', alpha: ep(t, 1.6, 2.0) });
    circle(pc[0], pc[1], 11, { fill: A, alpha: ep(t, 1.0, 1.4) }); circle(pc[0], pc[1], 11, { color: C.ink, w: 2, alpha: ep(t, 1.0, 1.4) });
    text('Centre of mass', pc[0] - 22, pc[1] - 18, { role: 'label', size: 20, color: A, align: 'right', alpha: ep(t, 1.2, 1.6) });
    line(wx + 40, pg[1], gx + 34 * s, pg[1], { color: C.faint, w: 1.2, dash: [4, 4], alpha: ep(t, 1.4, 1.8) });
    dim(t, 2.0, [wx + 64, gy], [wx + 64, gy - hf * s], hf + ' mm', -22);
    text('Rocking exaggerated. No reviewer publishes a centre of mass: I\'ll measure it.', wx + 28, wy + wh - 22, { role: 'small', size: 21, color: C.faint, alpha: ep(t, 2.4, 2.8), maxW: ww - 56 });
    const rx = 1000, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('tipping moment in a fast flick', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(rx, wy, rw, ['derived'], ep(t, 1.0, 1.4));
    text('M = m · a · (h − h_fingers); m = 35 g, a = 30 m/s²', rx + 28, wy + 112, { role: 'small', size: 22, color: C.mute, alpha: ep(t, 1.2, 1.6), maxW: rw - 56 });
    const m = axes(t, { x: rx + 100, y: wy + 160, w: rw - 160, h: 280, xr: [11, 18], yr: [0, 8], xticks: [11, 12, 13, 14, 15, 16, 17, 18], yticks: [0, 2, 4, 6, 8], xfmt: v => v + ' mm', yfmt: v => v + ' mN·m', xlabel: 'height of the centre of mass', t0: 1.0 });
    const Mh = h => 0.035 * 30 * (h - 11);
    series(m, [[11, 0], [18, Mh(18)]], { color: C.red, w: 3, p: ep(t, 1.6, 2.6, E.lin) });
    circle(m.X(hc), m.Y(Mh(hc)), 8, { fill: A }); text(`${Mh(hc).toFixed(1)} mN·m`, m.X(hc) + 16, m.Y(Mh(hc)) - 12, { role: 'num', size: 24, color: A });
    keyPlan(t, 1.0, wx + ww - 80, wy + 140, { s: 0.55, hi: 'battery', label: 'Battery' });
    gloss(t, 3.0, 'Tipping moment', 'The twist when you push at one height and the mass resists at another: the front lifts in a flick.');
    featureCard(t, 4.0, 'Mass low, near the fingers', ['derived', 'proposal'], 'Heavy parts low and close to the grip (#95). A modular bottom plate, as on the Carbon XT1 (#31).');
    captions(t, [[0.6, 'the fingers push the mouse low on its sides, and its mass pushes back at its centre of mass.'], [3.6, 'when those two heights differ, every flick puts a twist on the mouse that the hand has to hold down.'], [5.8, 'bring the mass down to the fingers and that twist goes toward zero, so the mouse feels easier to move.']]);
  }
});

/* ---------- fix the grind instead of greasing it (#96, #97, the doc's closing note) ---------- */
function rimMM(o = {}) {
  const pad = o.pad || 0, buzz = o.buzz || 0, A = o.accent || acc(), out = {};
  const jit = Math.sin(o.t * 90) * 0.06 * buzz;
  /* top shell wall coming down, with a groove the rim slides into */
  solid(() => { G.beginPath(); G.moveTo(-1.4, -9); G.lineTo(1.4, -9); G.lineTo(1.4, -1.0); G.lineTo(4.2, -1.0); G.lineTo(4.2, 1.2); G.lineTo(-1.4, 1.2); G.closePath(); }, MT.shell, [-1.4, -9, 5.6, 10.2], { hatch: true });
  /* the bottom rim, a separate part, slid in from the side */
  xsave(); xmove(jit, 0);
  solid(() => { G.beginPath(); G.moveTo(1.9, -0.6 + (pad ? 0.35 : 0)); G.lineTo(9, -0.6 + (pad ? 0.35 : 0)); G.lineTo(9, 2.6); G.lineTo(-1.4, 2.6); G.lineTo(-1.4, 1.5); G.lineTo(1.9, 1.5); G.closePath(); }, MT.black, [-1.4, -0.6, 10.4, 3.2], { hatch: { dir: -1 } });
  xrest();
  if (pad > 0) { xsave(); ga(pad); solid(() => { G.beginPath(); G.rect(1.9, -1.0, 2.3, 0.35); }, MT.foam, [1.9, -1.0, 2.3, 0.35], { lw: 0.8 }); const r = rng(3); G.strokeStyle = 'rgba(255,255,255,0.25)'; G.lineWidth = lw(0.8); for (let i = 0; i < 14; i++) { G.beginPath(); G.arc(2.0 + r() * 2.1, -0.82 + r() * 0.15, 0.05, 0, TAU); G.stroke(); } xrest(); }
  if (buzz > 0) { xsave(); ga(buzz); for (let k = 0; k < 3; k++) { const ph = (o.t * 2.4 + k / 3) % 1; G.beginPath(); G.arc(3.0, -0.8, 0.6 + ph * 2.6, -Math.PI * 0.95, -Math.PI * 0.05); G.strokeStyle = rgba(C.red, (1 - ph) * 0.8); G.lineWidth = lw(2); G.stroke(); } xrest(); }
  out.contact = SP(3.0, -0.8); out.rim = SP(7, 1.2); out.shell = SP(0, -6);
  return out;
}
S({
  id: 'grind', ch: 'shell', theme: 'night', title: 'fix the grind instead of greasing it', settle: 9, ideas: [97, 96], src: ['poron4701', 'plabase20'],
  draw: t => {
    header(t, 'fix the grind instead of greasing it');
    const wx = LM, wy = 272, ww = 1728, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    /* three fixes for the same joint: each gets the same squeeze, and a trace of the noise it makes */
    const cases = [[wx + 300, 'plastic on plastic', 'The rim rubs the shell and squeaks', 1, 0, C.red, 'stick'], [wx + 870, 'Krytox 205, in the groove', 'Quiet until it wears or collects dust', 0.25, 0, C.ink2, 'wear'], [wx + 1440, 'a thin Poron pad at the contact', 'A soft stop: nothing rubs, about 0.5 g', 0, 1, A, 'none']];
    const per = 2.6, sq = u => { const c = ((u % per) + per) % per / per; return c < 0.14 ? E.io3(c / 0.14) : c < 0.5 ? 1 : c < 0.64 ? 1 - E.io3((c - 0.5) / 0.14) : 0; };
    cases.forEach(([cx, l1, l2, buzz, pad, col, mode], i) => {
      const t0 = 0.6 + i * 0.5, k = ep(t, t0, t0 + 0.5), load = t > t0 + 1.0 ? sq(t - t0 - 1.0) : 0;
      const wearUp = mode === 'wear' ? 0.25 + 0.75 * clamp(((t - t0 - 1.0) % 10.4) / 10.4) : 1;
      const b2 = buzz * wearUp * load, s = 28, ox = cx - 150, oy = wy + 330;
      text(l1, cx, wy + 52, { role: 'label', color: col, align: 'center', t, t0, cps: 60 });
      const o = part(ox, oy - load * 0.12 * s, s, () => rimMM({ t, buzz: b2, pad: pad * (1 - 0.35 * load), accent: A }), { alpha: k });
      /* the squeeze: a hand pressing on the rim */
      const ax = ox + 6.6 * s, ay = oy - 0.6 * s - 8;
      arrow(ax, ay - 74 - 10 * load, ax, ay - 10 * load, { color: C.ink2, w: 3, hs: 12, alpha: k * (0.35 + 0.65 * load) });
      text('your grip', ax + 12, ay - 66, { role: 'label', color: C.mute, alpha: k });
      /* the noise, as a scope trace */
      const mx = cx - 160, my = wy + 416, mw = 320, mh = 52;
      rr(mx, my, mw, mh, 6, inkA(0.04), inkA(0.14), 1, k);
      text('noise', mx - 10, my + mh / 2 + 5, { role: 'label', color: C.faint, align: 'right', alpha: k });
      const pts = [];
      for (let j = 0; j <= 160; j++) {
        const u = t - t0 - 1.0 - (160 - j) * 0.012, L = u > 0 ? sq(u) : 0, amp = mode === 'stick' ? L : mode === 'wear' ? L * (0.25 + 0.75 * clamp(((u % 10.4) + 10.4) % 10.4 / 10.4)) * 0.8 : 0;
        const saw = ((u * 23) % 1) - 0.5, v = amp * (saw * 0.9 + 0.25 * Math.sin(u * 151)) + (mode === 'none' ? 0.03 * Math.sin(u * 40) : 0);
        pts.push([mx + 8 + (mw - 16) * j / 160, my + mh / 2 - v * (mh * 0.8)]);
      }
      poly(pts, { color: mode === 'none' ? A : col === C.ink2 ? C.orange : col, w: 1.8, alpha: k });
      if (mode === 'wear') text('louder as it wears', mx + mw, my - 8, { role: 'label', color: C.orange, align: 'right', alpha: k * ep(t, t0 + 3, t0 + 3.4) });
      text(l2, cx, wy + 500, { role: 'small', color: C.mute, align: 'center', t, t0: t0 + 0.4, cps: 90, maxW: 440 });
    });
    source(t, 'A modular rim slides into the top shell (#97). Noise traces are an illustration, not a recording.', { t0: 2.4 });
    keyPlan(t, 1.0, wx + ww - 80, wy + 150, { s: 0.55, hi: 'rim', label: 'Bottom rim' });
    gloss(t, 2.6, 'Poron', 'A microcellular urethane foam for gaskets, a third as dense as the shell. A thin layer stops hard parts rubbing.');
    featureCard(t, 3.6, 'A slide-in rim with a pad', ['proposal'], 'The rim slides into the top shell (#97). Grease hides the noise (#96); a foam pad removes it.');
    captions(t, [[0.6, 'a separate bottom rim makes the mouse easier to service, and every place two hard parts touch can grind.'], [3.0, 'grease quiets it for a while. it doesn\'t change the contact, so the noise comes back.'], [5.2, 'a thin foam pad at the contact point stops the parts rubbing at all, for about half a gram.']]);
  }
});

