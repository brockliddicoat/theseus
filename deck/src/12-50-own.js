/* ============================================================================================
   idea sheets: ownership. Each panel runs on its own clock (lt) and loops; ideaPanel() in 12-00-ideas.js
   lays out the label, pills, title and body under the drawing.
   ============================================================================================ */
Object.assign(SRC, {
  ownTpuDaV4: { t: 'TechPowerUp, Razer DeathAdder V4 Pro review: a branching flat flex cable inside (per the research pass of 2026-11-03; page not re-read)', u: 'https://www.techpowerup.com/review/razer-deathadder-v4-pro/' },
  ownRazerWarranty: { t: 'Razer Insider, Razer support reply (26 May 2026): issues Razer believes were caused by third-party skates can be excluded from the warranty', u: 'https://insider.razer.com/razer-support-45/razer-viper-v4-pro-skates-change-88874' },
  ownPcgSkates: { t: 'PC Gamer: a reviewer who replaced the Viper V4 Pro\'s skates was first refused an RMA; Razer later replaced the unit (May 2026)', u: 'https://pcgamer.com/hardware/gaming-mice/replacing-the-viper-v4-pros-skates-gave-one-reviewer-some-razer-warranty-trouble-after-glass-pad-sensor-issues' }
});

/** a panel's clock: 0 → 1 over 90% of a 12 s loop, then a quick rewind, so a settled frame shows the finished state */
function own_u(lt, per = 12) { const c = (lt % per) / per; return c <= 0.9 ? c : 0.9 * (1 - (c - 0.9) / 0.1); }
const own_seg = (u, a, b) => E.io3(clamp((u - a) / (b - a)));
/* ---------- #51: a ribbon in a flip-lock connector against a wire on a plug ---------- */
function own_ribbonPanel(lt, x, y, w, h, A, a) {
  const u = own_u(lt), n = Math.floor(lt / 12);
  const latch = own_seg(u, 0.04, 0.14), pull = own_seg(u, 0.16, 0.34);
  const tear = n % 2 === 1 && pull > 0.85;
  const half = w / 2 - 6, boardC = TH ? '#2b3a2f' : '#1f2b23', nylon = TH ? '#F3F1EA' : '#DCDAD3';
  /* left: the ribbon */
  const by = y + 168, bx0 = x + 18;
  text('Ribbon', bx0, y + 34, { role: 'label', size: 21, color: C.ink, alpha: a });
  rect(bx0, by, half - 20, 12, { fill: boardC, alpha: a });
  const cx0 = bx0 + 120, cw = 70;
  rr(cx0, by - 26, cw, 26, 3, '#2a2b30', null, 0, a);
  /* the latch, hinged at the connector's right end, swings up */
  G.save(); G.globalAlpha = a; G.translate(cx0 + cw, by - 26); G.rotate(-latch * 1.7); G.fillStyle = '#4a4b52'; G.fillRect(-cw + 4, -6, cw - 4, 6); G.restore();
  /* the ribbon: out of the mouth to the left, then lifted by the pull; a crease at the mouth */
  const mx = cx0, my = by - 13, ex = mx - 100 - 10 * pull, eyy = my - 110 * pull;
  G.save(); G.globalAlpha = a; G.strokeStyle = '#c98a4e'; G.lineWidth = 7; G.lineCap = 'butt'; G.beginPath(); G.moveTo(mx + 30, my); G.lineTo(mx, my); G.quadraticCurveTo(mx - 18, my - 2 * pull, mx - 22 - 10 * pull, my - 26 * pull); G.lineTo(ex, eyy); G.stroke();
  G.strokeStyle = 'rgba(255,240,220,0.5)'; G.lineWidth = 1.2; G.stroke(); G.restore();
  if (pull > 0.5) { const kc = clamp((pull - 0.5) * 2); circle(mx - 8, my - 4, 16, { color: C.red, w: 2, alpha: a * kc }); text(tear ? 'Torn' : 'Crease', mx - 30, my + 44, { role: 'label', size: 21, color: C.red, alpha: a * kc }); }
  if (tear) poly([[mx - 12, my - 9], [mx - 6, my - 3], [mx - 11, my + 2], [mx - 5, my + 7]], { color: C.red, w: 2.5, alpha: a });
  /* right: the wire harness on a side-entry plug, pulled straight */
  const rx = x + w / 2 + 6;
  text('Wire', rx + 6, y + 34, { role: 'label', size: 21, color: C.ink, alpha: a });
  rect(rx + 6, by, half - 20, 12, { fill: boardC, alpha: a });
  rr(rx + 150, by - 28, 62, 28, 3, nylon, inkA(0.5), 1.5, a);
  const px = rx + 96 - pull * 50;
  rr(px, by - 25, 56, 22, 3, nylon, inkA(0.5), 1.5, a);
  [C.red, '#222222', '#DDDDDD'].forEach((col, i) => { const yy = by - 20 + i * 6; G.save(); G.globalAlpha = a; G.strokeStyle = col; G.lineWidth = 3; G.beginPath(); G.moveTo(px, yy); G.bezierCurveTo(px - 40, yy, px - 50, yy - 40 - i * 4, px - 70, yy - 70 - i * 2); G.stroke(); G.restore(); });
  if (pull > 0.3) arrow(px - 14, by + 34, px - 74, by + 34, { color: A, w: 3, hs: 11, alpha: a * clamp((pull - 0.3) * 2) });
  text('Pulled straight', rx + 6, by + 76, { role: 'label', size: 21, color: A, alpha: a });
  /* the mass to beat */
  const my2 = y + h - 34;
  line(x + 18, my2 - 38, x + w - 18, my2 - 38, { color: C.hair, w: 1.2, alpha: a });
  rich([{ s: 'XA25, 2 flex cables', role: 'label', size: 21, color: C.ink2 }, { s: '0.121 g', font: 'mono', size: 25, weight: 700, color: C.ink, gap: 14 }], x + 18, my2, { alpha: a });
  evDot(x + w - 30, my2 - 8, 'claim', 5.5, a);
}

/* ---------- #69: three wires twisted at a lay that shortens, and what each lay costs ---------- */
const own_lay = p => Math.sqrt(1 + Math.pow(2 * Math.PI * (0.5 / Math.sqrt(3)) / p, 2)) - 1;
function own_twistPanel(lt, x, y, w, h, A, a) {
  const u = own_u(lt), p = 12 - 9 * own_seg(u, 0.04, 0.28) + 2 * own_seg(u, 0.34, 0.46);
  /* the lead: 40 mm across the panel, three insulated wires about one axis */
  const x0 = x + 30, x1 = x + w - 30, cy = y + 74, mmpx2 = (x1 - x0) / 40, amp = 9, cols = [C.red, TH ? '#26272b' : '#3a3b41', TH ? '#e9e8e3' : '#d9d8d2'];
  rect(x0 - 14, cy - 18, 14, 36, { fill: inkA(0.35), alpha: a }); rect(x1, cy - 18, 14, 36, { fill: inkA(0.35), alpha: a });
  const strands = [0, 1, 2].map(k => { const pts = []; for (let s = 0; s <= 160; s++) { const u = s / 160, xx = lerp(x0, x1, u), ph = TAU * (u * 40) / p + k * TAU / 3; pts.push([xx, cy + amp * Math.sin(ph), Math.cos(ph)]); } return pts; });
  /* back segments first, front on top, so the twist reads */
  for (const front of [false, true]) strands.forEach((pts, k) => { G.save(); G.globalAlpha = a; G.strokeStyle = cols[k]; G.lineWidth = 7; G.lineCap = 'round'; G.beginPath(); let on = false; for (const [xx, yy, z] of pts) { const f = z > 0; if (f === front) { if (!on) { G.moveTo(xx, yy); on = true; } else G.lineTo(xx, yy); } else on = false; } G.stroke(); if (TH && k === 2) { G.strokeStyle = 'rgba(0,0,0,0.25)'; G.lineWidth = 1; G.stroke(); } G.restore(); });
  rich([{ s: 'Lay', role: 'label', size: 21, color: C.mute }, { s: fmtN(p, 1) + ' mm', font: 'mono', size: 25, weight: 700, color: C.ink, gap: 10 }, { s: '+' + fmtN(own_lay(p) * 100, 1) + '% wire', font: 'mono', size: 25, weight: 700, color: C.ink, gap: 22 }], x + 30, y + 132, { alpha: a });
  /* the cost of a tighter lay */
  const m = miniAxes(x + 82, y + 170, w - 120, 104, { xr: [2, 12], yr: [0, 36], xticks: [2, 4, 6, 8, 10, 12], yticks: [0, 15, 30], yfmt: v => v + '%', alpha: a });
  G.save(); G.globalAlpha = a * 0.22; G.fillStyle = YEL; G.fillRect(m.X(5), y + 170, m.X(10) - m.X(5), 104); G.restore();
  text('Proposed', m.X(7.5), y + 192, { role: 'label', size: 19, color: C.heroText, align: 'center', alpha: a });
  const pts = []; for (let q = 2; q <= 12.001; q += 0.1) pts.push([m.X(q), m.Y(own_lay(q) * 100)]);
  poly(pts, { color: C.ink, w: 2.5, alpha: a });
  circle(m.X(p), m.Y(own_lay(p) * 100), 6, { fill: C.ink, alpha: a });
}

/* ---------- skate template: last year's skate on a new base, then the DXF, then the dots ---------- */
const own_DOTS = [[-21, -47], [-15, -53], [21, -47], [15, -53], [-23, 45], [-16, 51], [23, 45], [16, 51]];
function own_skatePanel(lt, x, y, w, h, A, a) {
  const c = own_u(lt);
  const s = 2.35, bx = x + 168, byy = y + 150;
  /* the base from below, nose to the right: the outline and the skate pockets only */
  part(bx, byy, s, () => { keyPath(); G.fillStyle = inkA(TH ? 0.05 : 0.07); G.fill(); own_keyOutline(); }, { alpha: a, rot: Math.PI / 2 });
  /* the pockets the new base has, thin */
  const P = ([px, pz]) => [bx - pz * s, byy + px * s];
  for (const d of own_DOTS) { const q = P(d); circle(q[0], q[1], 3.25 * s, { color: inkA(0.45), w: 1.2, alpha: a }); }
  /* last year's skate: a pad that does not match the pockets */
  const k1 = own_seg(c, 0.03, 0.14) * (1 - own_seg(c, 0.26, 0.32));
  if (k1 > 0.01) {
    const ox = lerp(-60, 0, k1);
    G.save(); G.globalAlpha = a * k1; G.setLineDash([6, 5]); G.strokeStyle = C.mute; G.lineWidth = 2; G.beginPath(); G.ellipse(bx + 120 * 0 + 112 + ox, byy - 46, 34, 14, 0.25, 0, TAU); G.stroke(); G.beginPath(); G.ellipse(bx + 112 + ox, byy + 46, 34, 14, -0.25, 0, TAU); G.stroke(); G.restore();
    if (k1 > 0.95) { for (const q of [P([-21, -47]), P([21, -47])]) circle(q[0], q[1], 10, { color: C.red, w: 2.5, alpha: a }); text('Last year\'s skate: no fit', x + 18, y + h - 18, { role: 'label', size: 21, color: C.red, alpha: a }); }
  }
  /* the DXF, sliding in from the right */
  const k2 = own_seg(c, 0.32, 0.44), sx = lerp(x + w + 10, x + w - 176, k2), sy = y + 30;
  if (k2 > 0) {
    rr(sx, sy, 160, 200, 4, TH ? '#FFFFFF' : '#1d1e22', inkA(0.35), 1.5, a);
    part(sx + 80, sy + 92, 1.15, () => { own_keyOutline(); for (const [px, pz] of own_DOTS) { G.beginPath(); G.arc(px, pz, 3.25, 0, TAU); G.strokeStyle = inkA(0.7); G.lineWidth = lw(1.2); G.stroke(); } }, { alpha: a });
    text('.DXF', sx + 80, sy + 188, { role: 'label', size: 21, color: C.ink, align: 'center', alpha: a });
  }
  /* Theseus dots land in their pockets */
  const k3 = clamp((c - 0.46) / 0.16);
  own_DOTS.forEach((d, i) => { const kk = E.out3(clamp(k3 * 8 - i * 0.8)); if (kk <= 0) return; const q = P(d); circle(q[0], q[1] - (1 - kk) * 30, 3.25 * s, { fill: rgba(YEL, 0.85), alpha: a * kk }); circle(q[0], q[1] - (1 - kk) * 30, 3.25 * s, { color: TH ? '#111111' : YEL, w: 1.5, alpha: a * kk }); });
  if (k3 >= 1) text('Day one: the file is public', x + 18, y + h - 18, { role: 'label', size: 21, color: C.heroText, alpha: a });
}
/** the key plan outline alone, in mm (no fills), for drawings at a small scale */
function own_keyOutline() { keyPath(); G.strokeStyle = inkA(0.7); G.lineWidth = lw(1.2); G.stroke(); }

ideaSheet({
  id: 'ownsheet1', ch: 'own', theme: 'paper', title: 'Inside, and underneath', src: ['ownTpuDaV4', 'exXbabWeight', 'ownJstSh', 'ownPsV4', 'ownRazerWarranty', 'ownPcgSkates'],
  panels: [
    {
      n: 51, ev: ['claim', 'proposal'], title: 'Wires where others run ribbons',
      body: 'That ribbons fail most is unverified: I found no failure data. Razer\'s DeathAdder V4 Pro runs a branching flex cable. So I will count it: 50 open-close cycles, ribbon against wire.',
      note: 'XBAB weight breakdown; DeathAdder V4 Pro teardown (TechPowerUp).',
      draw: (lt, x, y, w, h, A, a) => own_ribbonPanel(lt, x, y, w, h, A, a)
    },
    {
      n: 69, ev: ['derived', 'proposal'], title: 'Twisted, not tight',
      body: 'Twisted leads stay together when the shell comes off. Mass is not what limits the twist: a 5 mm lay adds 6% wire, about 0.004 g of copper on a 40 mm, three-wire lead.',
      note: '√(1 + (2πr/p)²) − 1, r = d/√3, d = 0.5 mm (assumed). AWG 30 copper.',
      draw: (lt, x, y, w, h, A, a) => own_twistPanel(lt, x, y, w, h, A, a)
    },
    {
      n: 'Skate DXF', ev: ['measured', 'proposal'], title: 'The skate template, on day one',
      body: 'Razer reshaped the Viper V4 Pro\'s skates, so V3 Pro sets do not fit, and its support says third-party skates can void the warranty. I publish the DXF at launch; a swap never voids mine.',
      note: 'ProSettings; Razer support, May 2026. Skate shapes are illustrations.',
      draw: (lt, x, y, w, h, A, a) => own_skatePanel(lt, x, y, w, h, A, a)
    }
  ],
  captions: [[0.6, 'Three things an owner meets with the shell open: the cables, the battery lead, and the skates.']]
});

/* ---------- #13: a keycap set's colours, measured onto the mouse ---------- */
const own_SET = ['#E6DFD0', '#2E2F34', '#C98F86'];
function own_gmkPanel(lt, x, y, w, h, A, a) {
  const c = own_u(lt);
  /* a row of keycaps in the set's three colours */
  const caps = [0, 0, 1, 2, 0, 1], kx = x + 22, ky = y + 46;
  caps.forEach((ci, i) => { const xx = kx + i * 50; rr(xx, ky, 44, 44, 7, own_SET[ci], inkA(0.45), 1.5, a); rr(xx + 6, ky + 4, 32, 30, 5, rgba('#FFFFFF', ci === 1 ? 0.06 : 0.18), null, 0, a); });
  text('Keycap set', kx, ky - 12, { role: 'label', size: 21, color: C.mute, alpha: a });
  /* the mouse, filling with the same colours, top view */
  const fill = own_seg(c, 0.05, 0.25), mx = x + w - 96, my = y + 100;
  part(mx, my, 1.25, () => {
    keyPath(); G.fillStyle = own_SET[0]; G.globalAlpha = PA * fill; G.fill(); G.globalAlpha = PA;
    G.save(); keyPath(); G.clip(); G.fillStyle = own_SET[1]; G.globalAlpha = PA * fill; G.fillRect(-40, -70, 80, 64.5); G.restore(); G.globalAlpha = PA;
    const [wx, wy, ww, wh] = KEY.wheel; G.beginPath(); pathRR(wx, wy, ww, wh, 3.6); G.fillStyle = own_SET[2]; G.globalAlpha = PA * fill; G.fill(); G.globalAlpha = PA;
    keyPath(); G.strokeStyle = inkA(0.6); G.lineWidth = lw(1.5); G.stroke();
  }, { alpha: a });
  /* a spectrophotometer reading, cap against shell */
  const kd = own_seg(c, 0.3, 0.38);
  if (kd > 0) { circle(kx + 22, ky + 22, 26, { color: C.ink, w: 2, alpha: a * kd }); circle(mx, my + 20, 26, { color: C.ink, w: 2, alpha: a * kd }); line(kx + 48, ky + 22, mx - 26, my + 20, { color: C.ink, w: 1.5, dash: [5, 5], alpha: a * kd }); rich([{ s: 'ΔE ≤ 1.0', role: 'small', size: 25, weight: 700, sentence: false, color: C.ink }, { s: 'Target', role: 'label', size: 19, color: '#111111', chip: YEL, gap: 16 }], kx, ky + 96, { alpha: a * kd }); }
  /* Knight & Haslam: work done in an office by who arranged it */
  const bars = [['Lean office', 0], ['Decorated for you', 17], ['Arranged by you', 32]], b0 = y + 196;
  bars.forEach(([l, v], i) => { const yy = b0 + i * 38, kk = own_seg(c, 0.36 + i * 0.03, 0.46 + i * 0.03); text(l, kx, yy + 7, { role: 'label', size: 19, color: C.ink2, alpha: a }); const bw2 = (w - 330) * v / 35; rect(kx + 236, yy - 7, Math.max(3, bw2 * kk), 14, { fill: i === 2 ? C.ink : C.comp, alpha: a }); text(v ? '+' + v + '%' : 'Baseline', kx + 246 + bw2 * kk, yy + 7, { font: 'mono', size: 21, weight: 700, color: C.ink, alpha: a }); });
}

/* ---------- #35: what the 9-ending research covers, and what it does not ---------- */
function own_nineRow(x, y, w, a, label, ok) {
  text(label, x, y, { role: 'label', size: 21, color: ok ? C.ink : C.red, alpha: a });
  if (ok) own_tick(x + w - 16, y - 8, 24, C.ink, a); else { G.save(); G.globalAlpha = a; G.setLineDash([4, 4]); rr(x + w - 128, y - 26, 128, 34, 17, null, C.red, 1.8, 1); G.restore(); text('No study', x + w - 64, y - 2, { role: 'label', size: 19, color: C.red, align: 'center', alpha: a }); }
}
function own_ninePanel(lt, x, y, w, h, A, a) {
  const c = own_u(lt), roll = own_seg(c, 0.06, 0.26);
  const box = (bx, by, bw, s, col) => { rr(bx, by, bw, 50, 6, TH ? '#1c1d21' : '#25262b', null, 0, a); text(s, bx + bw / 2, by + 37, { font: 'mono', size: 30, weight: 700, color: col || '#ECEBE7', align: 'center', alpha: a, tnum: true }); };
  /* 1 · a price: $180 → $179 */
  box(x + 18, y + 22, 140, roll < 0.5 ? '$180' : '$179');
  own_nineRow(x + 176, y + 56, w - 194, a, 'Prices: demand up', true);
  /* 2 · an odometer across 80,000 miles, and the price step */
  const mi = Math.round(79990 + 20 * roll);
  box(x + 18, y + 104, 140, String(mi).replace(/(\d\d)(\d\d\d)$/, '$1,$2'), mi >= 80000 ? C.red : null);
  own_nineRow(x + 176, y + 138, w - 194, a, 'Odometers: −$210', true);
  /* 3 · a serial run that ends in 9 */
  box(x + 18, y + 186, 140, '042/999');
  own_nineRow(x + 176, y + 220, w - 194, a, 'Serials', false);
  text('Supported: $179 over $180', x + 18, y + h - 18, { role: 'label', size: 21, color: C.ink, alpha: a * own_seg(c, 0.3, 0.36) });
}

/* ---------- #74: a cover over the cell, and what each material weighs over it ---------- */
function own_coverPanel(lt, x, y, w, h, A, a) {
  const c = own_u(lt), slide = own_seg(c, 0.05, 0.25);
  /* the cell from above, 21 × 31 mm, and the cover sliding over it */
  const s = 4.4, cx = x + 26, cy = y + 34, cw = 31 * s, ch = 21 * s;
  rr(cx, cy, cw, ch, 5, TH ? '#c9ccd2' : '#7d828a', inkA(0.5), 1.5, a);
  text('Li-Po', cx + cw / 2, cy + ch / 2 + 8, { role: 'label', size: 21, color: '#1d1e22', align: 'center', alpha: a });
  G.save(); G.beginPath(); G.rect(cx - 4, cy - 4, cw + 8, ch + 8); G.clip();
  const ox = cx + cw * (1 - slide) * 1.1;
  rr(ox, cy, cw, ch, 5, TH ? '#E9E5DA' : '#2a2b30', inkA(0.5), 1.5, a);
  for (let i = 0; i < 6; i++) line(ox + 10 + i * 22, cy + 6, ox + 2 + i * 22, cy + ch - 6, { color: inkA(0.06), w: 6, alpha: a });
  G.restore();
  text('21 × 31 {mm}', cx, cy + ch + 30, { role: 'label', size: 19, color: C.mute, alpha: a });
  /* the laminate, in section */
  const lx = x + 200, ly = y + 46;
  text('Section', lx, ly - 12, { role: 'label', size: 19, color: C.mute, alpha: a });
  rect(lx, ly, w - 222, 12, { fill: TH ? 'rgba(170,200,230,0.6)' : 'rgba(170,200,230,0.35)', alpha: a });
  rect(lx, ly + 12, w - 222, 30, { fill: TH ? '#E9E5DA' : '#3a3b40', alpha: a });
  text('PET film, 25 {µm}', lx + 8, ly + 66, { role: 'label', size: 19, color: C.ink2, alpha: a });
  text('Satin paper, 120 {g/m²}', lx + 8, ly + 92, { role: 'label', size: 19, color: C.ink2, alpha: a });
  /* the masses */
  const rows = [['Paper + PET', 0.101, true], ['PC, 0.2 {mm}', 0.156], ['CF-PP, 0.5 {mm}', 0.329]], b0 = y + 200;
  rows.forEach(([l, v, hero], i) => { const yy = b0 + i * 38, kk = own_seg(c, 0.28 + i * 0.03, 0.38 + i * 0.03), bw2 = (w - 330) * v / 0.35; text(l, x + 22, yy + 7, { role: 'label', size: 19, color: hero ? C.ink : C.ink2, alpha: a }); rr(x + 250, yy - 7, Math.max(10, bw2 * kk), 14, 3, hero ? YEL : C.comp, hero && TH ? '#111111' : null, 1.2, a); text(fmtN(v, 2) + ' g', x + 260 + bw2 * kk, yy + 7, { font: 'mono', size: 21, weight: 700, color: C.ink, alpha: a }); });
}

ideaSheet({
  id: 'ownsheet2', ch: 'own', theme: 'night', title: 'Colour, a number, a cover', src: ['gmk', 'knight', 'andersonSim', 'thomasMorwitz', 'lacetera', 'plabase20'],
  panels: [
    {
      n: 13, ev: ['study', 'proposal'], title: 'Colourways matched to GMK sets',
      body: 'GMK sets take months to arrive, so their owners plan the desk around them. Each colourway is measured against its set, and the colour difference is published.',
      note: 'ΔE in CIEDE2000, a target. Knight & Haslam 2010: office workers.',
      draw: (lt, x, y, w, h, A, a) => own_gmkPanel(lt, x, y, w, h, A, a)
    },
    {
      n: 35, ev: ['measured', 'proposal'], title: 'Serials ending in 9: a choice',
      body: 'In all three of Anderson & Simester\'s field tests a 9-ending raised demand; used-car prices step down at each 10,000 miles. That backs $179 over $180. Nothing tests serials.',
      note: 'Anderson & Simester 2003; Lacetera, Pope & Sydnor 2012.',
      draw: (lt, x, y, w, h, A, a) => own_ninePanel(lt, x, y, w, h, A, a)
    },
    {
      n: 74, ev: ['derived', 'proposal'], title: 'A battery cover in laminated paper',
      body: 'A covered cell stops a mouse looking like a prototype. Laminated satin paper over the cell weighs about 0.1 g, under a third of a 0.5 mm carbon PP plate.',
      note: 'Mass = area × areal mass. PET 1.39, PC 1.20, CF-PP 1.01 g/cm³.',
      draw: (lt, x, y, w, h, A, a) => own_coverPanel(lt, x, y, w, h, A, a)
    }
  ],
  captions: [[0.6, 'Three on the outside: a colourway for the keyboard you own, a number, and the cover over the cell.']]
});
