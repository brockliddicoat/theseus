/* ============================== a. the cover ============================== */
S({
  id: 'cover', replaces: 'cover', first: true, ch: 'intro', theme: 'night', chrome: false, title: 'Theseus: in pursuit of an objectively better mouse', settle: 7,
  sfx: [[2.15, 'tick'], [2.35, 'tick'], [2.55, 'tick'], [2.75, 'tick']],
  draw: t => {
    /* top row: the studio, and the rule the whole deck follows */
    chapterIcon('intro', LM, LAY.labelY - 19, 22, YEL, ep(t, 0.1, 0.4));
    text('Nitrite Labs', LM + 36, LAY.labelY, { role: 'label', color: C.ink2, t, t0: 0.15, cps: 40 });
    rich([{ s: 'Optimization', role: 'label', color: C.faint }, { s: 'over', role: 'label', color: C.faint, gap: 12 }, { s: 'opinion', role: 'label', color: YEL, gap: 12 }], RM, LAY.labelY, { align: 'right', alpha: ep(t, 0.4, 0.8) });
    /* a kicker over the word */
    text('A Nitrite Labs mouse, in development for years', LM, 214, { role: 'label', size: 22, color: C.mute, t, t0: 0.5, cps: 60 });
    /* THESEUS: each letter rises out of its own mask */
    const st = { role: 'hero', size: 316, track: -0.028 }, word = 'THESEUS', x0 = LM - 16, yb = 492;
    setFont(sty(st)); const ls = lsPx(sty(st));
    let xx = x0; const advs = [...word].map((ch, i) => { const w = G.measureText(word.slice(0, i + 1)).width - G.measureText(word.slice(0, i)).width; return w; });
    const wordW = advs.reduce((a, b) => a + b, 0) + ls * (word.length - 1);
    [...word].forEach((ch, i) => {
      const k = E.rise(prog(t, 0.25 + i * 0.07, 1.05 + i * 0.07));
      if (k > 0) { G.save(); G.beginPath(); G.rect(xx - 10, yb - 318 * 0.8, advs[i] + 20, 318 * 0.86); G.clip(); text(ch, xx, yb + (1 - k) * 318 * 0.82, Object.assign({}, st, { caps: false, color: C.ink })); G.restore(); }
      xx += advs[i] + ls;
    });
    /* a millimetre scale under the word, as if it had been measured, with a yellow segment for the 29 g */
    const ry = yb + 46, kr = ep(t, 1.0, 1.9, E.cam), rx1 = x0 + 14 + (wordW - 14) * kr;
    line(x0 + 14, ry, rx1, ry, { color: inkA(0.35), w: 1.5 });
    for (let i = 0; x0 + 14 + i * 12 <= rx1; i++) { const X = x0 + 14 + i * 12, L = i % 10 === 0 ? 16 : i % 5 === 0 ? 10 : 6; line(X, ry, X, ry + L, { color: inkA(i % 10 === 0 ? 0.5 : 0.25), w: 1.2 }); }
    rect(x0 + 14, ry - 3, 29 * 12 * ep(t, 1.6, 2.1, E.out3), 6, { fill: YEL });
    text('0', x0 + 14, ry + 40, { role: 'tick', size: 19, color: C.faint, alpha: ep(t, 1.4, 1.8) });
    text('29', x0 + 14 + 29 * 12, ry + 40, { role: 'tick', size: 19, color: YEL, align: 'center', alpha: ep(t, 1.9, 2.2) });
    text('mm', rx1, ry + 40, { role: 'tick', size: 19, color: C.faint, align: 'right', alpha: ep(t, 1.6, 2.0) });
    /* the subtitle in three voices: a mono run-in, the display claim, and the one yellow word */
    rich([
      { s: 'In pursuit of an', role: 'labelL', size: 28, color: C.mute, t0: 1.25, cps: 40 },
      { s: 'objectively better', role: 'h2', size: 60, color: C.ink, gap: 22, rise: [1.55, 0.8] },
      { s: 'mouse', role: 'h2', size: 60, color: YEL, gap: 18, rise: [1.7, 0.8] }
    ], LM, 652, { t });
    /* four numbers, XBAB-size next to mono units and labels */
    const cols = [
      { lab: 'Mass, target', n: '29', u: 'g', chip: 'Target' },
      { lab: 'Motion latency, wireless', n: '0.14', u: 'ms', sub: 'Target, on piaknow\'s scale' },
      { lab: 'Report rate', n: '8', u: 'kHz', sub: 'Wired and wireless' },
      { lab: 'Ideas', n: '100', u: '+', sub: 'Each with its evidence' }
    ];
    const cw = (RM - LM) / 4;
    cols.forEach((c, i) => {
      const x = LM + i * cw, t0 = 2.1 + i * 0.2, a = ep(t, t0, t0 + 0.4);
      if (i) line(x - 24, 760, x - 24, 760 + 190 * ep(t, t0 - 0.1, t0 + 0.5, E.cam), { color: inkA(0.14), w: 1.5 });
      text(c.lab, x, 776, { role: 'label', size: 21, color: C.mute, alpha: a, t, t0, cps: 60 });
      const r = rich([{ s: c.n, role: 'd1', size: 132, color: C.ink, tnum: true, count: [t0, 1.0] }, { s: c.u, font: c.u === '+' ? 'disp' : 'mono', size: c.u === '+' ? 96 : 38, weight: c.u === '+' ? 800 : 600, color: c.u === '+' ? YEL : C.mute, gap: c.u === '+' ? 2 : 10 }], x - 6, 912, { t, alpha: a });
      if (c.chip) rich([{ s: c.chip, role: 'label', size: 21, color: '#111111', chip: YEL }], x - 6 + r.w + 26, 912, { alpha: ep(t, t0 + 0.6, t0 + 0.9) });
      if (c.sub) text(c.sub, x, 956, { role: 'label', size: 19, color: C.faint, alpha: ep(t, t0 + 0.4, t0 + 0.8) });
    });
    /* the byline, on the chrome's rule */
    line(LM, LAY.ruleY, LM + (RM - LM) * ep(t, 0.3, 1.4, E.cam), LAY.ruleY, { color: C.hair, w: 1.5 });
    rich([{ s: 'Brock Liddicoat', role: 'foot', weight: 700, caps: true, track: 0.16, color: C.ink2 }, { s: '/', role: 'foot', color: C.faint, gap: 14 }, { s: 'Nitrite Labs', role: 'foot', caps: true, track: 0.12, color: C.mute, gap: 14 }, { s: '/', role: 'foot', color: C.faint, gap: 14 }, { s: 'Shape designer of the Finalmouse Starlight X', role: 'foot', caps: true, track: 0.12, color: C.faint, gap: 14 }], LM, LAY.footY, { alpha: ep(t, 2.6, 3.2) });
    text(`01 / ${pad2(DECK.slides.length)}`, RM, LAY.footY, { role: 'foot', weight: 600, color: C.mute, align: 'right', alpha: ep(t, 2.6, 3.2) });
    for (const [mx, my] of [[40, 160], [W - 40, 160], [40, 600], [W - 40, 600]]) regMark(mx, my, ep(t, 0.8, 1.3) * 0.4, 8, C.ink);
  }
});

/* ============================== d. zero grams: the claim, and what has been measured ============================== */
S({
  id: 'zerograms', ch: 'intro', after: 'targets2', theme: 'night', title: 'The optimal weight is zero grams', settle: 10, ideas: ['weight'],
  src: ['exZk', 'exZkM1k', 'exConroy', 'exYan', 'exWang', 'exChen', 'exXbabWeight'],
  draw: t => {
    header(t, 'The optimal weight is zero grams');
    { const a = ep(t, 0.9, 1.3), w1 = tw('The optimal weight is zero grams', { role: 'h1' }); pill(LM + w1 + 28, LAY.titleY - 8, 'claim', a, { text: 'Maker claim, Zaunkoenig 2018' }); }
    captions(t, [[0.6, 'Zaunkoenig argued it in 2018. It is physics, not a study. Here is everything that has been measured.'], [5.6, 'Lighter beat heavier down to the lightest mouse tested. Below 40 g, nobody has measured anything.']]);
    const ws = RD['weight-science'] || {}, studies = (ws.studies || []);
    const X0 = LM + 330, X1 = RM - 20, M = g => X0 + (X1 - X0) * g / 200, y0 = 352, a0 = ep(t, 0.4, 0.9);
    /* the axis: grams, 0 to 200 */
    for (let g = 0; g <= 200; g += 20) { line(M(g), y0 - 6, M(g), 852, { color: C.hair, w: 1, alpha: a0 * (g % 100 ? 0.6 : 1) }); text(String(g), M(g), y0 - 18, { role: 'tick', color: C.mute, align: 'center', alpha: a0 }); }
    text('Mouse mass, {g}', LM, y0 - 18, { role: 'label', size: 21, color: C.mute, alpha: a0 });
    /* the gap: 0 to 40 g, where Theseus is and nobody has data */
    const kg = ep(t, 3.6, 4.4, E.io3);
    if (kg > 0) {
      G.save(); G.beginPath(); G.rect(M(0), y0, (M(40) - M(0)) * kg, 852 - y0); G.clip();
      G.fillStyle = rgba(YEL, 0.07); G.fillRect(M(0), y0, M(40) - M(0), 852 - y0);
      G.strokeStyle = rgba(YEL, 0.16); G.lineWidth = 1.2; G.beginPath(); for (let s = -600; s < 400; s += 16) { G.moveTo(M(0) + s, 852); G.lineTo(M(0) + s + 560, y0); } G.stroke(); G.restore();
      line(M(40), y0, M(40), 852, { color: YEL, w: 1.5, dash: [5, 5], alpha: kg });
      text('No published data', M(20), y0 + 40, { role: 'label', size: 21, color: YEL, align: 'center', alpha: kg });
    }
    /* the study rows */
    const rowsDef = [
      { id: 'conroy2022', name: 'Conroy et al. 2022', who: 'n = 72, gamers', pts: [[50, 'w'], [60, 'w'], [90, 'w'], [100, 'l']], note: '50, 60 and 90 g: 4% faster, 9% more accurate than 100 g', ev: 'study' },
      { id: 'yan2022', name: 'Yan et al. 2022', who: 'n = 12, gamers', pts: [[40, 'l'], [60, 'w'], [140, 'n']], span: [40, 140], note: '40 g: the highest error rate. 60 g: most preferred', ev: 'study' },
      { id: 'wang2023', name: 'Wang et al. 2023', who: 'n = 16, pros', pts: [[80, 'n'], [87, 'n']], note: '80 vs 87 g: no significant difference', ev: 'study' },
      { id: 'chen2012', name: 'Chen et al. 2012', who: 'n = 25, office task', pts: [[70, 'n'], [100, 'n'], [130, 'w'], [160, 'n'], [190, 'n']], note: 'Least wrist motion and muscle activity at 130 g', ev: 'study' }
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
    /* the masses that matter here, on the axis: the claim, the M1K, the XA25, Theseus */
    const ym = y0 + 70 + 4 * rh - 2, km = ep(t, 4.2, 4.8);
    const k1 = ep(t, 4.3, 4.7, E.snap), k2 = ep(t, 4.55, 4.95, E.snap), k3 = ep(t, 4.8, 5.2, E.snap);
    circle(M(0), ym, 9 * k1, { color: C.ink2, w: 2.5 }); text('Zaunkoenig: 0 {g}', M(0) + 2, ym - 26, { role: 'label', size: 19, color: C.ink2, alpha: k1 });
    circle(M(23.4), ym, 9 * k2, { color: C.ink2, w: 2.5 }); text('M1K 23.4 g', M(23.4) - 4, ym + 44, { role: 'label', size: 19, color: C.ink2, align: 'right', alpha: k2 });
    heroMark(M(29), ym, 14 * k3, 1); rich([{ s: 'Theseus 29 g', role: 'label', size: 21, color: '#111111', chip: YEL }], M(29) + 14, ym + 44, { alpha: k3 });
    legend(t, 5.2, X0, 296, [{ kind: 'dot', color: C.good, label: 'Did better' }, { kind: 'ring', color: C.red, label: 'Did worse' }, { kind: 'dot', color: C.comp, label: 'No difference' }]);
    /* the physics, derived */
    gloss(t, 6.0, 'F = m · a', 'At the same acceleration, your hand adds force in proportion to the mouse\'s mass. At 29 g that is 48% of what a 60 g mouse asks for.');
    featureCard(t, 6.4, 'Theseus, tested below 40 g', ['study', 'claim', 'proposal'], 'Nobody has measured aim between 20 and 40 g. I will, on the same task as Conroy et al., and publish it.');
  }
});

/* ============================== b. the 29 g budget, XBAB-style ============================== */
function exBudget() {
  const wt = RD.weights || {}, xa = (wt.breakdowns || []).find(b => /XA25/.test(b.mouse));
  const part = re => { const p = xa && xa.parts.find(q => re.test(q.part)); return p ? rv(p.mass) : null; };
  const jauch = ((RD.batteries || {}).chemistries || []).find(c => c.id === 'li_polymer_pouch_mouse');
  const bat = jauch ? rv(jauch.mass) : 7.5;
  const rows = [
    { name: 'Shell + skates', g: 0, ev: 'proposal', key: 'shell', was: part(/^Shell/) || 12.16 },
    { name: 'Battery, 250 mAh', g: bat, ev: 'datasheet' },
    { name: 'Buttons', g: part(/^Button/) || 3.328, ev: 'claim' },
    { name: 'Front PCB', g: part(/^Front PCB/) || 3.178, ev: 'claim' },
    { name: 'Main PCB', g: part(/^Main PCB/) || 2.895, ev: 'claim' },
    { name: 'Scroll wheel', g: part(/^Scroll/) || 0.931, ev: 'claim' },
    { name: 'Side PCB', g: part(/^Side PCB/) || 0.788, ev: 'claim' },
    { name: 'Screws', count: 11, g: part(/^Screws/) || 0.708, ev: 'claim' },
    { name: 'FPC cables', count: 2, g: part(/^FPC/) || 0.121, ev: 'claim' }
  ];
  const rest = rows.slice(1).reduce((a, r) => a + r.g, 0);
  rows[0].g = +(29 - rest).toFixed(3);
  return { rows, placeholder: !xa };
}
S({
  id: 'budget', ch: 'intro', after: 'zerograms', theme: 'paper', title: 'Theseus weight budget', settle: 10, ideas: ['weight'],
  src: ['exXbabWeight', 'exJauch', 'exZkM1k', 'exRtings', 'exEloshapes', 'x2fCrazy'],
  draw: t => {
    sectionLabel(t, 0.05, LM, LAY.labelY);
    const B = exBudget();
    const icons = [
      (x, y, s, a) => part(x, y, s / 132, () => keyPlanMM({ hi: 'shell', accent: YEL }), { alpha: a }),
      (x, y, s, a) => { rr(x - 24, y - 14, 48, 28, 4, TH ? '#E7E6E1' : '#2a2b2e', inkA(0.5), 1.5, a); rect(x + 24, y - 6, 5, 12, { fill: inkA(0.5), alpha: a }); },
      (x, y, s, a) => part(x, y, s / 132, () => keyPlanMM({ hi: ['trigL', 'trigR'], accent: YEL }), { alpha: a }),
      (x, y, s, a) => part(x, y, s / 46, () => boardMM({}), { alpha: a }),
      (x, y, s, a) => part(x, y, s / 46, () => boardMM({}), { alpha: a }),
      (x, y, s, a) => part(x, y, s / 30, () => wheelSideMM({ rot: t * 0.3 }), { alpha: a }),
      (x, y, s, a) => { rr(x - 22, y - 8, 44, 16, 3, '#1c3a29', null, 0, a); rect(x - 12, y - 5, 8, 10, { fill: '#2b2c31', alpha: a }); rect(x + 4, y - 5, 8, 10, { fill: '#2b2c31', alpha: a }); },
      (x, y, s, a) => { for (const [dx, dy] of [[-10, -6], [6, -8], [-4, 8], [12, 6]]) part(x + dx, y + dy, 2.6, () => screwHeadMM(), { alpha: a }); },
      (x, y, s, a) => { rr(x - 24, y - 9, 48, 7, 1.5, '#D9D7D0', inkA(0.35), 1, a); rr(x - 24, y + 3, 48, 7, 1.5, '#D9D7D0', inkA(0.35), 1, a); rect(x - 24, y - 9, 6, 7, { fill: '#3B6BC9', alpha: a }); rect(x + 18, y + 3, 6, 7, { fill: '#3B6BC9', alpha: a }); }
    ];
    B.rows.forEach((r, i) => { r.icon = icons[i]; if (i === 0) r.hero = true; });
    const yb = breakdown(t, {
      x: LM, y: 96, w: 1130, t0: 0.1, name: 'Theseus', sub: 'Weight budget, wireless', total: 29, totalDec: 2, unit: 'g', totalLabel: 'Target',
      rows: B.rows, rowH: 60, iconW: 76, dec: 3, barCol: C.ink, nameSize: 124, totalSize: 128, max: 16, wasLabel: 'XA25',
      totalTag: (x, y) => { }, placeholder: B.placeholder
    });
    /* the trade: built like the XA25, 29 g leaves 4.9 g for a cell; anything bigger comes out of the shell */
    const sc = ((RD.weights || {}).theseus_29g_budget || {}).scenarios || [], scen = [['140 mAh', 5.0, 'Fits as built', 18], ['250 mAh', 7.5, 'Shell −2.61 g', 31], ['330 mAh', 8.0, 'Shell −3.11 g', 41]].map((d, i) => { const m = sc.find(x => x.scenario.includes(d[0].split(' ')[0] + ' mAh')); return m ? [d[0], d[1], m.vs_29g > 0.2 ? 'Shell −' + fmtN(m.vs_29g, 2) + ' g' : 'Fits as built', rv(m.runtime_8kHz_h)] : d; });
    const ty = yb + 34, ka = ep(t, 2.2, 2.6);
    text('The trade', LM, ty + 10, { role: 'label', size: 20, color: C.ink, alpha: ka });
    text('At 8 kHz', LM, ty + 42, { role: 'label', size: 19, color: C.faint, alpha: ka });
    scen.forEach(([cap, g, cut, hrs], i) => {
      const x = LM + 250 + i * 300, k = ep(t, 2.3 + i * 0.15, 2.7 + i * 0.15), hero = i === 1;
      if (hero) rect(x - 16, ty - 18, 4, 70, { fill: YEL, alpha: k });
      rich([{ s: cap, font: 'mono', size: 24, weight: 700, color: C.ink }, { s: fmtN(g, 1) + ' g', font: 'mono', size: 19, weight: 500, color: C.mute, gap: 10 }], x, ty + 10, { alpha: k });
      rich([{ s: cut, role: 'small', size: 22, weight: 600, color: hero ? C.ink : C.ink2 }, { s: hrs + ' h', font: 'mono', size: 22, weight: 700, color: C.ink, gap: 14 }], x, ty + 42, { alpha: k });
    });
    source(t, 'Built from the XA25\'s weighed parts (XBAB), cable swapped for a Jauch cell. Radio, PMIC and USB-C not counted: 29 g is a floor.', { t0: 2.8 });
    /* against the lightest mice: totals, Theseus yellow */
    const cx = 1290, cw = RM - cx, list = [
      { name: 'Theseus', g: 29, hero: true, q: 'Target' },
      { id: 'xbab-xa25', q: 'Wired' }, { name: 'Zaunkoenig M1K', g: 23.4, q: 'Wired', ev: 'claim' },
      { id: 'finalmouse-ulx', q: '' }, { id: 'pulsar-x2-crazylight-m', q: '' }, { id: 'wlmouse-beast-x', q: '' }, { id: 'ninjutso-sora-v2', q: '' },
      { id: 'finalmouse-slx', q: '' }, { id: 'razer-viper-v4-pro', q: '' }, { id: 'logitech-gpx2', q: '' }
    ].map(r => { if (r.id) { const w = exWeight(r.id); return w ? Object.assign(r, { name: exShort(w.name), g: w.g, ev: w.ev }) : null; } return r; }).filter(Boolean);
    const a0 = ep(t, 0.8, 1.2);
    text('Against the lightest mice', cx, 120, { role: 'label', size: 22, color: C.ink, alpha: a0 });
    text('Whole mouse, g. RTINGS weighed every one it could; the rest are the maker\'s figures.', cx, 158, { role: 'small', size: 22, color: C.mute, maxW: cw, lh: 1.3, alpha: a0 });
    const rh = 66, bw = cw - 92, y1 = 268;
    list.forEach((r, i) => {
      const y = y1 + i * rh, k = ep(t, 1.2 + i * 0.08, 2.0 + i * 0.08, E.snap), a = ep(t, 1.1 + i * 0.08, 1.4 + i * 0.08);
      if (i) line(cx, y - 40, RM, y - 40, { color: C.hair, w: 1, alpha: a });
      const nm = text(r.name, cx, y - 6, { role: 'small', size: 24, weight: r.hero ? 800 : 600, color: C.ink, alpha: a });
      if (r.q) text(r.q, cx + nm.w + 12, y - 7, { role: 'label', size: 19, color: r.hero ? C.heroText : C.faint, alpha: a });
      rr(cx, y + 8, bw, 10, 5, C.track, null, 0, a);
      rr(cx, y + 8, Math.max(10, bw * (r.g / 62) * k), 10, 5, r.hero ? YEL : (r.q === 'Wired' ? C.comp : C.ink), r.hero ? '#111111' : null, 1.2, a);
      line(cx + bw * 29 / 62, y + 3, cx + bw * 29 / 62, y + 23, { color: '#A87C00', w: 2, alpha: a * ep(t, 2.4, 2.8) });
      text(fmtN(r.g * k, 1), RM, y + 18, { font: 'mono', size: 25, weight: r.hero ? 800 : 600, color: C.ink, align: 'right', alpha: a, tnum: true });
    });
  }
});

/* ============================== b2. what a gram costs: weight against price, wireless ============================== */
Object.assign(SRC, {
  exPrices: { t: 'US list prices: maker stores and product pages (Pulsar, Ninjutso, Lamzu, Keychron, Finalmouse, Razer, Logitech, WLMOUSE), via research/data/mice.json', n: 'A price range is plotted at its lowest price. Prices as listed when collected, 2026.' }
});
/** wireless mice with a US price: { id, name, x: grams, y: dollars, hollow (maker weight), range (price was a range) } */
function exPricePoints() {
  return ((RD.mice || {}).mice || []).filter(m => m.connection !== 'wired' && rv(m.price_usd) != null && isFinite(parseFloat(rv(m.price_usd)))).map(m => {
    const w = exWeight(m.id), pv = String(rv(m.price_usd));
    return w ? { id: m.id, name: exShort(m.name), x: w.g, y: parseFloat(pv), hollow: w.ev !== 'measured', range: /-/.test(pv) } : null;
  }).filter(Boolean);
}
S({
  id: 'pricefront', ch: 'intro', after: 'budget', theme: 'night', title: 'What a gram costs', settle: 10, ideas: ['weight'],
  src: ['exRtings', 'exEloshapes', 'exPrices', 'x2fCrazy'],
  draw: t => {
    header(t, 'What a gram costs');
    captions(t, [[0.6, 'Every wireless mouse with a US list price, against its weight. Nothing has shipped past the black line.'], [5.4, 'The only 29 g wireless mouse gets there by leaving off the back half of the shell. Theseus aims for 29 g with the whole shell.']]);
    const P = exPricePoints();
    const named = ['pulsar-x2f-crazylight', 'pulsar-x2-crazylight-m', 'ninjutso-sora-v2', 'lamzu-maya', 'keychron-g3', 'finalmouse-slx', 'finalmouse-ulx', 'razer-viper-v4-pro', 'logitech-gpx2'];
    const pts = P.map(p => Object.assign({}, p, { label: named.includes(p.id) ? undefined : false, name: p.name.replace('Finalmouse Starlight X', 'Starlight X').replace('Finalmouse ULX', 'ULX') }));
    /* left: the scatter */
    const x = LM + 110, py = 344, w = 1000, ph = 470, xr = [25, 70], yr = [60, 200];
    cardHead(t, 0.5, LM - 26, py - 80, w + 136, 'Weight against US list price, wireless', ['measured', 'datasheet']);
    const sc = scatter(t, {
      x, y: py, w, h: ph, t0: 0.6, xr, yr, xticks: [30, 40, 50, 60, 70], yticks: [60, 80, 100, 120, 140, 160, 180, 200],
      xfmt: v => v + ' g', yfmt: v => '$' + v, xlabel: 'Weight, {g}', better: { x: -1, y: -1 }, sweet: { label: 'Lighter and cheaper' }, frontier: true,
      points: pts.length ? pts : [{ name: 'placeholder', x: 40, y: 120 }], placeholder: !pts.length,
      /* Theseus has a weight and no price yet: a line, not a point */
      targetX: { x: 29, name: 'Theseus, 29 g', sub: 'Price not set', t0: 2.6 }
    });
    /* right: the frontier as a table, lightest first */
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
    /* the Theseus row, on a yellow edge */
    const kr = ep(t, 3.6, 4.1), ry = yEnd + 54;
    if (kr > 0) {
      rect(tx0, yEnd + 8, 6, 74 * kr, { fill: YEL });
      rich([{ s: 'Theseus target', role: 'label', size: 21, color: '#111111', chip: YEL }], tx0 + 26, ry, { alpha: kr });
      text('29 g', tx0 + tw0 * 3.1 / 4.25 - 16, ry, { font: 'mono', size: 25, weight: 800, color: C.ink, align: 'right', alpha: kr });
      text('Not set', RM - 16, ry, { font: 'mono', size: 25, weight: 500, color: C.mute, align: 'right', alpha: kr });
    }
    /* the dots left unnamed on the chart, named here */
    const un = pts.filter(p => p.label === false || (sc.unnamed || []).includes(p.name)).map(p => p.name.replace('Razer ', '').replace('Logitech ', '').replace('Ninjutso ', '').replace('Lamzu ', ''));
    if (un.length) text('Also plotted: ' + un.join(', ') + '.', tx0, yEnd + 150, { role: 'small', size: 22, color: C.mute, maxW: tw0, lh: 1.36, alpha: ep(t, 4.4, 4.9) });
    legend(t, 4.2, LM, 930, [{ kind: 'dot', color: '#8E8D88', label: 'Weighed by RTINGS' }, { kind: 'ring', color: '#8E8D88', label: 'Maker\'s weight' }, { kind: 'line', color: C.ink, label: 'Pareto frontier' }, { kind: 'dash', color: YEL, label: 'Theseus target' }]);
    source(t, 'Prices: US list, maker stores and reviews; a range is plotted at its lowest. Weights: RTINGS where weighed, else the maker.', { t0: 3 });
  }
});

