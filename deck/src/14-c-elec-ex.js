/* ============================================================================================
   electronics, data slides (chapter code elc): the fastest mice, what a faster poll buys, the cell, the frontier.
   Data: research/data/latency.json (piaknow 2026-09-15), mice.json, batteries.json (RDATA).
   ============================================================================================ */

/* ============================== the fastest mice, as a ranking ============================== */
S({
  id: 'motion', ch: 'elec', after: 'antenna', theme: 'night', title: 'The fastest mice, on one chart', settle: 10, ideas: ['latency'],
  src: ['exPiaknow', 'kunai', 'xbab'],
  draw: t => {
    header(t, 'The fastest mice, on one chart');
    captions(t, [[0.6, 'piaknow times each mouse from the moment it moves to the moment the PC sees it, on one rig, so every row compares.'], [5.2, 'The fastest wireless mouse measured is 0.34 ms. My target is 0.14 ms, measured the same way.']]);
    const rows0 = (((RD.latency || {}).motion_latency_piaknow_2026_09_15 || {}).rows || []).filter(r => rv(r.ms_8000Hz) != null);
    const nm = r => r.mouse.replace('Logitech G PRO X SUPERLIGHT 2', 'Logitech GPX2').replace('Logitech G PRO X2 SUPERSTRIKE', 'Logitech Superstrike').replace('HP HyperX Pulsefire Haste 2', 'HyperX Haste 2').replace('Endgame Gear ', 'Endgame ') + (r.footnote === '*' ? '*' : '');
    const wired = rows0.filter(r => r.connection === 'Wired').map(r => ({ name: nm(r), v: rv(r.ms_8000Hz), ref: r.mouse === 'XBAB XA25' }));
    const wless = rows0.filter(r => r.connection === 'Wireless').map(r => ({ name: nm(r), v: rv(r.ms_8000Hz), hollow: true, ref: r.mouse === 'Razer Viper V4 Pro' }));
    wless.push({ name: 'Theseus', qual: 'Target', v: 0.14, hero: true });
    wired.sort((a, b) => a.v - b.v); wless.sort((a, b) => a.v - b.v);
    const cw = (RM - LM - 40) / 2, y = 272, h = 610;
    [[LM, 'Wired, 8 kHz', wired, ['measured']], [LM + cw + 40, 'Wireless, 8 kHz', wless, ['measured', 'projected']]].forEach(([x, lab, rows, ev], i) => {
      demoWindow(x, y, cw, h, ep(t, 0.2 + i * 0.2, 0.6 + i * 0.2), { grid: true });
      cardHead(t, 0.3 + i * 0.2, x, y, cw, lab, ev);
      lollipop(t, { x: x + 26, y: y + 148, w: cw - 52, t0: 0.5 + i * 0.4, rows: rows.length ? rows : [{ name: 'placeholder', v: 0.3 }], xr: [0, 1.0], ticks: [0, 0.25, 0.5, 0.75, 1.0], tfmt: v => v.toFixed(2), fmt: v => v.toFixed(2), rowH: 43, labelW: 340, valW: 76, nsize: 25, target: i ? { v: 0.14 } : null, placeholder: !rows.length });
    });
    legend(t, 3.0, LM, 926, [{ kind: 'dot', color: '#8E8D88', label: 'Wired' }, { kind: 'ring', color: '#8E8D88', label: 'Wireless' }, { kind: 'dot', color: C.ink, label: 'Fastest of each' }, { kind: 'hero', label: 'Theseus target' }]);
    text('* Motion Sync forced on: {piaknow} flags these rows', RM, 926, { role: 'label', size: 21, color: C.faint, align: 'right', alpha: ep(t, 3.2, 3.6) });
    source(t, 'Data: piaknow, "Motion Latency of Some Computer Mice 2026-09-15", every 8 kHz row. Theseus 0.14 ms is projected from Kunai\'s timing model; not yet measured.', { t0: 3 });
  }
});

/* ============================== what a faster poll buys, and what wireless costs ============================== */
S({
  id: 'elc_rate', ch: 'elec', after: 'motion', theme: 'paper', title: 'What a faster poll buys', settle: 10, ideas: ['latency', 90],
  src: ['exPiaknow', 'usbHs', 'kunai'],
  draw: t => {
    header(t, 'What a faster poll buys');
    captions(t, [[0.6, 'From 1 to 8 kHz, the Viper V4 Pro\'s wireless latency falls from 1.35 to 0.34 ms. Waiting for the next report explains only 0.44 ms of that.'], [5.4, 'The same mouse is 0.08 ms slower wireless than wired. The worst pair on the chart gives up 0.45 ms.']]);
    const rows = (((RD.latency || {}).motion_latency_piaknow_2026_09_15 || {}).rows || []);
    const get = (mouse, conn) => { const r = rows.find(q => q.mouse === mouse && q.connection === conn); return r ? [1000, 2000, 4000, 8000].map(f => [f, rv(r['ms_' + f + 'Hz'])]).filter(p => p[1] != null) : []; };
    const S0 = [
      { name: 'Viper V4 Pro, wireless', pts: get('Razer Viper V4 Pro', 'Wireless'), ref: true, ring: true },
      { name: 'Viper V4 Pro, wired', pts: get('Razer Viper V4 Pro', 'Wired') },
      { name: 'OP1 8k V2, wired', pts: get('Endgame Gear OP1 8k V2', 'Wired') },
      { name: 'NP01-S V3, wireless', pts: get('VAXEE NP01-S V3', 'Wireless'), ring: true },
      { name: 'GPX2, wireless', pts: get('Logitech G PRO X SUPERLIGHT 2', 'Wireless'), ring: true }
    ].filter(s => s.pts.length);
    const lx = LM, ly = 272, lw = 1050, lh = 580;
    demoWindow(lx, ly, lw, lh, ep(t, 0.2, 0.6));
    cardHead(t, 0.4, lx, ly, lw, 'Motion latency against report rate, log scales', ['measured', 'derived']);
    const px = lx + 120, pw = lw - 120 - 260, py = ly + 104, ph = lh - 104 - 96;
    const lgx = v => Math.log10(v), X = f => px + pw * (lgx(f) - lgx(1000)) / (lgx(8000) - lgx(1000)), Y = v => py + ph - ph * (lgx(v) - lgx(0.05)) / (lgx(3) - lgx(0.05));
    const a0 = ep(t, 0.6, 1.1);
    for (const v of [0.1, 0.2, 0.5, 1, 2]) { line(px, Y(v), px + pw, Y(v), { color: C.hair, w: 1.2, alpha: a0 }); text(v + ' ms', px - 14, Y(v) + 7, { role: 'tick', color: C.mute, align: 'right', alpha: a0 }); }
    for (const f of [1000, 2000, 4000, 8000]) { line(X(f), py, X(f), py + ph, { color: C.hair, w: 1.2, alpha: a0 * 0.7 }); text(f / 1000 + ' kHz', X(f), py + ph + 34, { role: 'tick', color: C.mute, align: 'center', alpha: a0 }); }
    rect(px, py, pw, ph, { color: inkA(0.6), w: 1.5, alpha: a0 });
    /* the floor: on average, motion waits half a report interval */
    const T2 = [1000, 2000, 4000, 8000].map(f => [f, 1000 / (2 * f)]), kf2 = ep(t, 1.2, 2.2, E.io3);
    if (kf2 > 0.98) { G.save(); G.beginPath(); G.moveTo(X(1000), Y(0.5)); G.lineTo(X(8000), Y(0.0625)); G.lineTo(X(8000), py + ph); G.lineTo(X(1000), py + ph); G.closePath(); G.clip(); G.strokeStyle = inkA(0.12); G.lineWidth = 1; G.beginPath(); for (let s = -ph; s < pw + ph; s += 12) { G.moveTo(px + s, py); G.lineTo(px + s - ph, py + ph); } G.stroke(); G.restore(); }
    poly(T2.map(p => [X(p[0]), Y(p[1])]), { color: C.ink, w: 2.5, dash: [8, 6], p: kf2 });
    text('Half a report interval', X(1414), Y(0.36) + 34, { role: 'label', size: 21, color: C.ink, alpha: ep(t, 2.0, 2.4) });
    /* the mice */
    const ends = [];
    S0.forEach((s, i) => {
      const d = 1.6 + i * 0.3, k = ep(t, d, d + 1.2, E.io3), col = s.ref ? C.ink : (TH ? '#8E8D88' : '#8E8D88');
      poly(s.pts.map(p => [X(p[0]), Y(p[1])]), { color: col, w: s.ref ? 4 : 2.5, p: k });
      s.pts.forEach((p, j) => { const kk = ep(t, d + j * 0.3, d + j * 0.3 + 0.3); if (s.ring) { circle(X(p[0]), Y(p[1]), 7, { fill: C.panel, alpha: kk }); circle(X(p[0]), Y(p[1]), 7, { color: col, w: 2.5, alpha: kk }); } else circle(X(p[0]), Y(p[1]), 7, { fill: col, alpha: kk }); });
      const last = s.pts[s.pts.length - 1]; ends.push({ y: Y(last[1]), s, v: last[1], k: ep(t, d + 1.2, d + 1.6) });
    });
    /* the Theseus target at 8 kHz */
    const kt = ep(t, 4.0, 4.6, E.snap);
    if (kt > 0) { heroMark(X(8000), Y(0.14), 13 * kt, 1); ends.push({ y: Y(0.14), hero: true, v: 0.14, k: kt }); }
    /* end labels, spread so none overlap */
    ends.sort((a, b) => a.y - b.y); for (let i = 1; i < ends.length; i++) ends[i].ly = Math.max(ends[i].y, (ends[i - 1].ly || ends[i - 1].y) + 30); if (ends[0]) ends[0].ly = ends[0].y;
    ends.forEach(e => {
      const lx2 = X(8000) + 22;
      if (Math.abs(e.ly - e.y) > 2) line(X(8000) + 8, e.y, lx2 - 4, e.ly - 7, { color: C.faint, w: 1.2, alpha: e.k });
      if (e.hero) rich([{ s: 'Theseus target', role: 'label', size: 21, color: C.onHero, chip: C.heroChip }, { s: '0.14', font: 'mono', size: 22, weight: 700, color: C.ink, gap: 16 }], lx2 + 4, e.ly, { alpha: e.k });
      else rich([{ s: e.s.name, role: 'small', size: 25, weight: e.s.ref ? 700 : 500, color: C.ink }, { s: e.v.toFixed(2), font: 'mono', size: 22, weight: 700, color: C.ink, gap: 12 }], lx2, e.ly, { alpha: e.k });
    });
    legend(t, 2.6, lx + 26, ly + lh - 22, [{ kind: 'dot', color: '#8E8D88', label: 'Wired' }, { kind: 'ring', color: '#8E8D88', label: 'Wireless' }, { kind: 'dash', color: C.ink, label: 'Half the interval' }]);
    /* wired against wireless, same mouse */
    const rx = lx + lw + 30, rw = RM - rx;
    demoWindow(rx, ly, rw, lh, ep(t, 0.4, 0.8));
    cardHead(t, 0.6, rx, ly, rw, 'Wired to wireless, 8 kHz', ['measured', 'derived']);
    const pairs = (((RD.latency || {}).motion_latency_derived) || []).filter(d => d && d.value && d.value.wireless_penalty_ms != null).map(d => d.value);
    const prow = pairs.map(p => ({ name: p.mouse.replace('Razer ', '').replace('VAXEE ', '').replace('ELECOM VM800L', 'ELECOM VM800L*'), a: p.wired_ms, b: p.wireless_ms, d: p.wireless_penalty_ms })).sort((a, b) => a.d - b.d);
    prow.push({ name: 'Theseus', a: 0.13, b: 0.14, d: 0.01, hero: true });
    const dx0 = rx + 26, dw = rw - 52, DX = v => dx0 + dw * v / 0.8, dy0 = ly + 136;
    for (const v of [0, 0.2, 0.4, 0.6, 0.8]) { line(DX(v), dy0 - 6, DX(v), dy0 + prow.length * 96 - 30, { color: C.hair, w: 1.2, alpha: ep(t, 0.8, 1.2) }); text(v.toFixed(1), DX(v), dy0 - 16, { role: 'tick', color: C.mute, align: 'center', alpha: ep(t, 0.8, 1.2) }); }
    prow.forEach((p, i) => {
      const yy = dy0 + 56 + i * 96, k = ep(t, 1.4 + i * 0.3, 2.2 + i * 0.3, E.snap), ka = ep(t, 1.2 + i * 0.3, 1.6 + i * 0.3);
      text(p.name, dx0, yy - 22, { role: 'small', weight: p.hero ? 800 : 600, color: C.ink, alpha: ka });
      if (p.hero) text('Targets, projected', dx0 + tw('Theseus', { role: 'small', weight: 800 }) + 14, yy - 23, { role: 'label', size: 21, color: C.heroText, alpha: ka });
      const xa = DX(p.a), xb = lerp(xa, DX(p.b), k);
      line(xa, yy, xb, yy, { color: p.hero ? C.hero : C.ink, w: p.hero ? 5 : 3, alpha: ka });
      if (p.hero) { heroMark(xa, yy, 10, ka); heroMark(xb, yy, 10, k); }
      else { circle(xa, yy, 8, { fill: C.ink, alpha: ka }); circle(xb, yy, 8, { fill: C.panel, alpha: k }); circle(xb, yy, 8, { color: C.ink, w: 2.5, alpha: k }); }
      text('+' + p.d.toFixed(2) + ' ms', Math.max(xb, xa) + 18, yy + 8, { font: 'mono', size: 24, weight: 700, color: p.hero ? C.heroText : C.ink, alpha: k });
    });
    text('* Motion Sync forced on (piaknow\'s footnote).', rx + 26, ly + lh - 24, { role: 'label', size: 21, color: C.faint, alpha: ep(t, 3.4, 3.8) });
    gloss(t, 3.0, 'Report interval', 'One over the report rate: 125 µs at 8 kHz. On average, motion waits half of it before it can leave.');
    featureCard(t, 6.4, '8 kHz on one chip, wired and wireless', ['measured', 'projected'], 'Targets of 0.13 ms wired and 0.14 ms wireless, measured on piaknow\'s rig before launch.');
    source(t, 'piaknow 2026-09-15: every rate for these five mice. Floor: 1 ÷ (2 × rate), derived. Theseus 0.14 ms: Kunai timing model, projected.', { t0: 3 });
  }
});

/* ============================== the cell: energy per gram, cycles, charge time, and its share of 29 g ============================== */
function exCells() {
  const ch = ((RD.batteries || {}).chemistries || []), by = id => ch.find(c => c.id === id) || {};
  const lipo = by('li_polymer_pouch_mouse'), li = by('li_ion_cylindrical'), aa = by('alkaline_aa'), ni = by('nimh_aa_lsd'), l91 = by('lithium_primary_aa');
  return {
    placeholder: !ch.length,
    rows: [
      { name: 'Li-polymer pouch', sub: '250 mAh, Jauch LP502030JH', hero: true, whkg: rv(lipo.gravimetric_energy_density) || 128, whkgEv: 'derived', cyc: rv(lipo.cycle_life) || 500, cycEv: 'datasheet', chg: [2, 3], chgEv: 'datasheet', chgNote: '0.5C max', g: rv(lipo.mass) || 7.5 },
      { name: 'Li-ion cylinder', sub: '18650, Panasonic NCR18650B', ref: true, whkg: rv(li.gravimetric_energy_density) || 243, whkgEv: 'datasheet', cyc: [500, 1000], cycEv: 'datasheet', chg: [4, 4], chgEv: 'datasheet', chgNote: '0.5C', g: rv(li.mass) || 48.5 },
      { name: 'Alkaline AA', sub: 'Energizer E91', whkg: rv(aa.gravimetric_energy_density_low_drain) || 163, whkgLow: rv(aa.gravimetric_energy_density_1W) || 40, whkgEv: 'derived', cyc: 1, cycEv: 'datasheet', chg: null, chgNote: 'Single use', g: rv(aa.mass) || 23 },
      { name: 'NiMH AA', sub: 'Panasonic eneloop', whkg: rv(ni.gravimetric_energy_density) || 84, whkgEv: 'derived', cyc: rv(ni.cycle_life) || 2100, cycEv: 'claim', chg: [0.95, 0.95], chgEv: 'datasheet', chgNote: '1C, 57 min', g: rv(ni.mass) || 27 },
      { name: 'Lithium AA', sub: 'Energizer L91', whkg: null, whkgEv: 'datasheet', cyc: 1, cycEv: 'datasheet', chg: null, chgNote: 'Single use', g: rv(l91.mass) || 15 }
    ]
  };
}
S({
  id: 'cells', ch: 'elec', after: 'elc_safe', theme: 'paper', title: 'The cell, per gram', settle: 10, ideas: ['battery'],
  src: ['exJauch', 'exNcr', 'exE91', 'exEneloop', 'exL91', 'exBu107', 'exBu409', 'nrf54'],
  draw: t => {
    header(t, 'The cell, per gram');
    captions(t, [[0.6, 'At a mouse\'s drain, a fresh AA holds as much energy per gram as a small LiPo: 163 against 123 to 153 Wh/kg.'], [4.8, 'It loses on everything else: one 23 g lump, used once, a quarter of its energy at 1 W, and below the radio\'s 1.7 V.']]);
    const D = exCells(), x = LM, y0 = 384, rh = 92, lw = 380, gap = 36, cw = (RM - x - lw - gap * 3) / 4;
    const cols = [
      { lab: 'Energy per gram', unit: 'Wh/kg', max: 260, val: r => r.whkg, fmt: v => fmtN(v, 0), energy: true },
      { lab: 'Longevity', unit: 'charge cycles, log', log: [1, 3000], val: r => r.cyc, fmt: v => Array.isArray(v) ? fmtN(v[0], 0) + '–' + fmtN(v[1], 0) : v === 1 ? '1' : fmtN(v, 0), cyc: true },
      { lab: 'Time to full', unit: 'hours, fastest rated', max: 5, val: r => r.chg, fmt: v => Array.isArray(v) ? (v[0] === v[1] ? fmtN(v[0], v[0] < 1 ? 2 : 1) : fmtN(v[0], 0) + '–' + fmtN(v[1], 0)) : '', charge: true },
      { lab: 'Share of a 29 g mouse', unit: '% of 29 g', max: 100, val: r => r.g / 29 * 100, fmt: v => fmtN(v, 0) + '%', share: true }
    ];
    const a0 = ep(t, 0.6, 1.0);
    cols.forEach((c, j) => { const cx = x + lw + j * (cw + gap); text(c.lab, cx, y0 - 56, { role: 'label', size: 22, color: C.ink, alpha: a0 }); text(c.unit, cx, y0 - 26, { role: 'label', size: 21, color: C.faint, alpha: a0 }); });
    line(x, y0 - 6, RM, y0 - 6, { color: C.hair, w: 1.5, alpha: a0 });
    /* the alkaline cell's energy falls with load: 25 mW (a mouse) against 1 W */
    const load = ep(t, 5.4, 6.6) * (1 - ep(t, 7.6, 8.6));
    D.rows.forEach((r, i) => {
      const y = y0 + i * rh, t0 = 0.9 + i * 0.16, a = ep(t, t0, t0 + 0.4);
      if (r.hero) rect(x - 18, y + 4, 6, rh - 12, { fill: C.hero, alpha: a });
      line(x, y + rh - 4, RM, y + rh - 4, { color: C.hair, w: 1, alpha: a });
      text(r.name, x, y + 42, { role: 'h3', size: 30, color: C.ink, alpha: a });
      text(r.sub, x, y + 74, { role: 'label', size: 21, color: r.hero ? C.heroText : C.mute, alpha: a });
      cols.forEach((c, j) => {
        const cx = x + lw + j * (cw + gap), v0 = c.val(r), k = ep(t, t0 + 0.15 + j * 0.1, t0 + 0.95 + j * 0.1, E.snap), by = y + 52, bh = 16;
        rr(cx, by - bh / 2, cw, bh, bh / 2, C.track, null, 0, a);
        if (v0 == null) { text(c.energy ? 'Not digitised' : r.chgNote || 'n/a', cx, by - 18, { role: 'label', size: 21, color: C.faint, alpha: a }); return; }
        const v = c.energy && r.whkgLow ? lerp(v0, r.whkgLow, load) : v0;
        const P = q => c.log ? clamp(Math.log10(q / c.log[0]) / Math.log10(c.log[1] / c.log[0])) : clamp(q / c.max);
        const lo = Array.isArray(v) ? v[0] : v, hi = Array.isArray(v) ? v[1] : v;
        const col = r.hero ? C.hero : r.ref ? C.ink : C.comp, wHi = Math.max(bh, cw * P(hi) * k), wLo = Math.max(bh, cw * P(lo) * k);
        if (hi !== lo) rr(cx, by - bh / 2, wHi, bh, bh / 2, rgba(r.hero ? C.hero : '#111111', r.hero ? 0.45 : 0.18), null, 0, a);
        rr(cx, by - bh / 2, wLo, bh, bh / 2, col, r.hero ? '#111111' : null, 1.3, a);
        if (r.whkgLow && c.energy) {
          const wl = cw * P(r.whkgLow) * k; rr(cx, by - bh / 2, Math.max(bh, wl), bh, bh / 2, C.red, null, 0, a);
          text('At 1 W: ' + r.whkgLow, cx, by + 34, { role: 'label', size: 21, color: C.red, alpha: ep(t, t0 + 1.0, t0 + 1.4) });
          text(load > 0.5 ? 'At 1 W' : 'At 25 mW', cx + cw - 22, by - 18, { role: 'label', size: 21, color: C.faint, align: 'right', alpha: a });
        }
        if (c.share && r.g / 29 > 1) text('Does not fit', cx + cw, by + 34, { role: 'label', size: 21, color: C.red, align: 'right', alpha: ep(t, t0 + 1.0, t0 + 1.4) });
        text(c.fmt(v), cx, by - 18, { font: 'mono', size: 25, weight: r.hero ? 800 : 600, color: C.ink, alpha: a });
        const ev = c.energy ? r.whkgEv : c.cyc ? r.cycEv : c.charge ? r.chgEv : 'derived';
        if (ev) evDot(cx + cw - 8, by - 26, ev, 5.5, a);
        if (c.charge && r.chgNote) text(r.chgNote, cx + cw - 22, by - 18, { role: 'label', size: 21, color: C.faint, align: 'right', alpha: a });
      });
    });
    legend(t, 1.4, RM, LAY.top, [{ kind: 'dot', color: evCol('datasheet'), label: 'Datasheet' }, { kind: 'ring', color: evCol('derived'), label: 'Derived' }, { kind: 'ring', color: evCol('claim'), label: 'Maker claim' }], { size: 21, gap: 26, align: 'right' });
    if (D.placeholder) placeholderStamp(t, x, y0 - 80, RM - x, rh * 5 + 80);
    gloss(t, 4.0, 'Boost converter', 'One AA gives 0.8 to 1.6 V; the nRF54 needs at least 1.7 V. An AA mouse spends parts and some energy stepping it up.');
    featureCard(t, 4.4, 'A 250 mAh pouch cell', ['datasheet', 'derived'], '7.5 g, 26% of the mouse, 500 cycles, 0.5C. About 146 h at 1 kHz on a Viper V4 Pro\'s draw.');
    source(t, 'Datasheets: Jauch, Panasonic, Energizer. Wh/kg derived: energy ÷ mass; E91 read from its constant-power curve. Cycles: Battery University, eneloop claim.', { t0: 3 });
  }
});

/* ============================== the frontier: weight against latency and against battery life ============================== */
S({
  id: 'frontier', ch: 'elec', after: 'cells', theme: 'night', title: 'Past the frontier', settle: 11, ideas: ['latency', 'battery'],
  src: ['exPiaknow', 'exRtings', 'exEloshapes', 'exNbcV4', 'exJauch'],
  draw: t => {
    header(t, 'Past the frontier');
    captions(t, [[0.6, 'Every wireless mouse with a published number, against its weight. No mouse ships past the black line.'], [5.6, 'Theseus as budgeted sits past it on both: 29 g, a 0.14 ms target, and about 146 h at 1 kHz.']]);
    const lat = ((RD.latency || {}).motion_latency_piaknow_2026_09_15 || {}).rows || [];
    const idOf = { 'Razer Viper V4 Pro': 'razer-viper-v4-pro', 'Scyrox V8': 'scyrox-v8', 'WLMOUSE Beast X 8K': 'wlmouse-beast-x', 'VAXEE NP01-S V3': 'vaxee-np01s-v3', 'ELECOM VM800L': 'elecom-vm800l', 'Razer Viper V3 Pro': 'razer-viper-v3-pro', 'Logitech G PRO X2 SUPERSTRIKE': 'logitech-superstrike', 'Logitech G PRO X SUPERLIGHT 2': 'logitech-gpx2' };
    const P1 = lat.filter(r => r.connection === 'Wireless' && rv(r.ms_8000Hz) != null && idOf[r.mouse]).map(r => { const w = exWeight(idOf[r.mouse]); return w ? { name: exShort(w.name).replace('Logitech G Pro X2 Superstrike', 'Superstrike'), x: w.g, y: rv(r.ms_8000Hz), hollow: w.ev !== 'measured' } : null; }).filter(Boolean);
    const pw = (RM - LM - 80) / 2, ph = 450, py = 340;
    cardHead(t, 0.5, LM - 26, py - 76, pw + 26, 'Motion latency at 8 kHz, wireless', ['measured']);
    const s1 = scatter(t, {
      x: LM + 96, y: py, w: pw - 96, h: ph, t0: 0.6, xr: [20, 70], yr: [0, 1.0], xticks: [20, 30, 40, 50, 60, 70], yticks: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
      xfmt: v => v + ' g', yfmt: v => v.toFixed(1) + ' ms', xlabel: 'Weight, {g}', better: { x: -1, y: -1 }, sweet: { label: 'Lighter and faster' }, frontier: true,
      points: P1.length ? P1 : [{ name: 'placeholder', x: 49, y: 0.34 }], target: { x: 29, y: 0.14, name: 'Theseus', dx: 26, dy: -6 }, placeholder: !P1.length
    });
    const mice = (RD.mice || {}).mice || [];
    const P2 = mice.filter(m => rv(m.battery_claim_1k_h) && m.connection !== 'wired').map(m => { const w = exWeight(m.id); return w ? { name: exShort(m.name).replace('Logitech G Pro X Superlight 2c', 'GPX2c').replace('Logitech GPX2c', 'GPX2c').replace('Razer DeathAdder V4 Pro', 'DeathAdder V4 Pro').replace('Xiaomi Gaming Mouse 2', 'Xiaomi GM2').replace('Logitech Superstrike', 'Superstrike').replace('ZOWIE ', ''), x: w.g, y: rv(m.battery_claim_1k_h), hollow: w.ev !== 'measured' } : null; }).filter(Boolean);
    const rx = LM + pw + 80;
    cardHead(t, 0.9, rx - 26, py - 76, pw + 26, 'Battery life at 1 kHz, claimed', ['claim']);
    const s2 = scatter(t, {
      x: rx + 96, y: py, w: pw - 96, h: ph, t0: 1.0, xr: [20, 70], yr: [0, 200], xticks: [20, 30, 40, 50, 60, 70], yticks: [0, 50, 100, 150, 200],
      xfmt: v => v + ' g', yfmt: v => v + ' h', xlabel: 'Weight, {g}', better: { x: -1, y: 1 }, sweet: { label: 'Lighter and longer' }, frontier: true,
      points: P2.length ? P2 : [{ name: 'placeholder', x: 49, y: 180 }], target: { x: 29, y: 146, name: 'Theseus, as budgeted', dx: 26, dy: -6 }, placeholder: !P2.length
    });
    const nb = ['finalmouse-ulx', 'finalmouse-slx', 'ninjutso-sora-v2', 'wlmouse-beast-x', 'pulsar-x2-crazylight-m'].map(exWeight).filter(Boolean), kn = ep(t, 3.4, 3.9);
    nb.forEach(w => { const X = rx + 96 + (pw - 96) * (w.g - 20) / 50; line(X, py + ph - 26, X, py + ph - 8, { color: C.red, w: 2.5, alpha: kn }); });
    if (nb.length) text('Nothing under 47 g publishes hours:\nULX, Starlight X, Sora V2,\nBeast X, X2 CrazyLight', rx + 96 + 16, py + ph - 100, { role: 'label', size: 21, color: C.red, lh: 1.3, alpha: kn });
    legend(t, 4.2, LM, 926, [{ kind: 'dot', color: '#B9B8B2', label: 'Weighed by RTINGS' }, { kind: 'ring', color: '#B9B8B2', label: 'Maker\'s weight' }, { kind: 'line', color: C.ink, label: 'Pareto frontier' }, { kind: 'hero', label: 'Theseus target, projected' }]);
    const un = [...new Set([...(s1.unnamed || []), ...(s2.unnamed || [])])];
    if (un.length) text('Unnamed dots: ' + un.join(', '), RM, 926, { role: 'small', size: 25, color: C.mute, align: 'right', alpha: ep(t, 4.6, 5.0), maxW: 480 });
    source(t, 'Latency: piaknow 2026-09-15, 8 kHz. Hours: maker claims. Theseus hours: 0.96 Wh at the V4 Pro\'s 6.6 mW, derived.', { t0: 3 });
  }
});
