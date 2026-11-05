/* ============================================================================================
   electronics, data slides (chapter code elc): the fastest mice, what a faster poll buys, the cell, the frontier.
   Data: research/data/latency.json (piaknow 2026-09-15), mice.json, batteries.json (RDATA).
   ============================================================================================ */

/* ============================== motion latency, ranked ============================== */
S({
  id: 'motion', ch: 'elec', after: 'antenna', theme: 'night', title: 'Motion latency, ranked', settle: 10, ideas: ['latency'],
  src: ['exPiaknow', 'kunai', 'xbab'],
  draw: t => {
    header(t, 'Motion latency, ranked');
    captions(t, [[0.6, 'piaknow times each mouse from the moment it moves to the moment the PC sees it, on one rig, so every row compares.'], [5.2, 'The fastest wireless mouse measured takes 0.34 ms. My target is 0.14 ms on the same rig: within 0.01 ms of the fastest wired mouse.']]);
    const rows0 = (((RD.latency || {}).motion_latency_piaknow_2026_09_15 || {}).rows || []).filter(r => rv(r.ms_8000Hz) != null);
    const nm = r => r.mouse.replace('Logitech G PRO X SUPERLIGHT 2', 'Logitech GPX2').replace('Logitech G PRO X2 SUPERSTRIKE', 'Logitech Superstrike').replace('HP HyperX Pulsefire Haste 2', 'HyperX Haste 2').replace('Endgame Gear ', 'Endgame ') + (r.footnote === '*' ? '*' : '');
    const wired = rows0.filter(r => r.connection === 'Wired').map(r => ({ name: nm(r), v: rv(r.ms_8000Hz), ref: r.mouse === 'XBAB XA25' }));
    const wless = rows0.filter(r => r.connection === 'Wireless').map(r => ({ name: nm(r), v: rv(r.ms_8000Hz), ref: r.mouse === 'Razer Viper V4 Pro' }));
    wired.sort((a, b) => a.v - b.v); wless.sort((a, b) => a.v - b.v);
    const best = wless[0] || { name: 'Razer Viper V4 Pro', v: 0.34 }, bw = wired[0] || { name: 'XBAB XA25', v: 0.13 };
    wless.unshift({ name: 'Theseus', qual: 'Target', v: 0.14, hero: true });
    /* the wireless ranking, big */
    const x = LM, y = 280, w = 1040, h = 680;
    demoWindow(x, y, w, h, tileA(t, 0.2, 0), { grid: true });
    cardHead(t, 0.3, x, y, w, 'Wireless at 8 kHz, motion to PC in ms (lower is better)', ['measured', 'projected']);
    lollipop(t, { x: x + 32, y: y + 150, w: w - 64, t0: 0.5, rows: wless.length > 1 ? wless.slice(0, 11) : [{ name: 'placeholder', v: 0.3 }], xr: [0, 1.0], ticks: [0, 0.25, 0.5, 0.75, 1.0], tfmt: v => v.toFixed(2), fmt: v => v.toFixed(2), rowH: 44, labelW: 360, valW: 80, nsize: 25, target: { v: 0.14 }, placeholder: wless.length <= 1 });
    text('* Motion Sync forced on: piaknow flags these rows', x + 32, y + h - 26, { role: 'label', size: 20, color: C.faint, alpha: ep(t, 3.2, 3.6) });
    /* the right column: by how much, before → after, and wired, quietly */
    const rx = 1160, rw = RM - rx;
    elc_hl(t, 4.0, rx, 430, fmtN(best.v / 0.14, 1) + '×', 'faster', { size: 140, label: 'Than the fastest wireless measured', sub: 'A 0.14 ms target against the ' + best.name.replace('*', '') + '\'s ' + best.v.toFixed(2) + ' ms, projected from Kunai\'s timing model.', subW: rw });
    elc_ba(t, 4.8, rx, 650, best.v.toFixed(2), '0.14', { size: 60, label: 'Fastest wireless, then Theseus', unit: 'ms', net: '−' + fmtN(best.v - 0.14, 2) + ' ms on the same rig', maxW: rw });
    const wy = 720, wh = 240;
    demoWindow(rx, wy, rw, wh, tileA(t, 0.3, 1));
    cardHead(t, 0.5, rx, wy, rw, 'Wired at 8 kHz (lower is better)', ['measured'], { dy: 44 });
    const wr = wired.slice(0, 3).concat([{ name: 'Theseus', qual: 'Target', v: 0.13, hero: true }]).sort((a, b) => a.v - b.v || (b.hero ? 1 : -1));
    lollipop(t, { x: rx + 32, y: wy + 112, w: rw - 64, t0: 0.9, rows: wr, xr: [0, 0.5], ticks: [0, 0.25, 0.5], tfmt: v => v.toFixed(2), fmt: v => v.toFixed(2), rowH: 30, labelW: 250, valW: 70, nsize: 22 });
    source(t, 'piaknow, "Motion Latency of Some Computer Mice 2026-09-15", every 8 kHz row. Theseus 0.14 ms wireless and 0.13 ms wired: Kunai\'s timing model, projected.', { t0: 3 });
  }
});


/* ============================== the wireless penalty, and what a faster poll buys ============================== */
S({
  id: 'elc_rate', ch: 'elec', after: 'motion', theme: 'paper', title: 'The wireless penalty', settle: 10, ideas: ['latency', 90],
  src: ['exPiaknow', 'usbHs', 'kunai'],
  draw: t => {
    header(t, 'The wireless penalty');
    captions(t, [[0.6, 'The same mouse is slower wireless than wired. At 8 kHz the Viper V4 Pro gives up 0.08 ms, and the worst pair on piaknow\'s chart 0.45 ms.'], [5.4, 'Theseus targets 0.13 ms wired and 0.14 ms wireless: a 0.01 ms penalty, with the radio timed to each poll the way the cable is.']]);
    const pairs = (((RD.latency || {}).motion_latency_derived) || []).filter(d => d && d.value && d.value.wireless_penalty_ms != null).map(d => d.value);
    const prow = pairs.map(p => ({ name: p.mouse.replace('Razer ', '').replace('VAXEE ', '').replace('ELECOM VM800L', 'ELECOM VM800L*'), a: p.wired_ms, b: p.wireless_ms, d: p.wireless_penalty_ms, ref: /V4 Pro/.test(p.mouse) })).sort((a, b) => a.d - b.d);
    prow.unshift({ name: 'Theseus', a: 0.13, b: 0.14, d: 0.01, hero: true });
    const v4 = prow.find(p => p.ref) || { d: 0.08 };
    /* the pairs: a dot wired, a ring wireless, the gap between them */
    const x = LM, y = 280, w = 920, h = 680;
    demoWindow(x, y, w, h, tileA(t, 0.2, 0));
    cardHead(t, 0.4, x, y, w, 'Wired to wireless at 8 kHz, in ms (the shorter the gap, the better)', ['measured', 'projected']);
    const dx0 = x + 290, dw = w - 290 - 180, DX = v => dx0 + dw * v / 0.8, dy0 = y + 190, rh = Math.min(120, (h - 240) / Math.max(1, prow.length - 1));
    const ka = ep(t, 0.8, 1.2);
    for (const v of [0, 0.2, 0.4, 0.6, 0.8]) { line(DX(v), dy0 - 40, DX(v), dy0 + rh * (prow.length - 1) + 30, { color: C.hair, w: 1.2, alpha: ka }); text(v.toFixed(1), DX(v), dy0 - 52, { role: 'tick', size: 20, color: C.mute, align: 'center', alpha: ka }); }
    prow.forEach((p, i) => {
      const yy = dy0 + i * rh, k = ep(t, 1.2 + i * 0.3, 2.0 + i * 0.3, E.snap), kl = ep(t, 1.0 + i * 0.3, 1.4 + i * 0.3);
      if (p.hero) heroTag(x + 32, yy + 9, 'Theseus', null, { a: kl, size: 24 });
      else text(p.name, x + 32, yy + 9, { role: 'small', size: 26, weight: p.ref ? 700 : 600, color: C.ink, alpha: kl, maxW: 250 });
      text(p.hero ? 'Targets' : p.ref ? 'The best pair measured' : 'Measured', x + 32, yy + 40, { role: 'label', size: 19, color: p.hero ? C.heroText : C.faint, alpha: kl });
      const xa = DX(p.a), xb = lerp(xa, DX(p.b), k), col = p.hero ? C.hero : p.ref ? C.ref : C.comp;
      line(xa, yy, xb, yy, { color: col, w: p.hero ? 7 : 4, cap: 'round', alpha: kl });
      if (p.hero) { heroMark(xa, yy, 11, kl); heroMark(xb, yy, 11, k); }
      else { circle(xa, yy, 9, { fill: col, alpha: kl }); circle(xb, yy, 9, { fill: C.panel, alpha: k }); circle(xb, yy, 9, { color: col, w: 3, alpha: k }); }
      text('+' + p.d.toFixed(2) + ' ms', x + w - 32, yy + 10, { font: 'mono', size: 27, weight: 800, color: p.hero ? C.heroText : C.ink, align: 'right', alpha: k });
    });
    legend(t, 2.6, x + 32, y + h - 30, [{ kind: 'dot', color: C.comp, label: 'Wired' }, { kind: 'ring', color: C.comp, label: 'Wireless' }]);
    text('* Motion Sync forced on (piaknow\'s footnote)', x + w - 32, y + h - 30, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: ep(t, 3.4, 3.8) });
    /* the right: by how much, then what a faster poll buys, on the Viper V4 Pro */
    const rx = 1040, rw = RM - rx;
    elc_hl(t, 4.2, rx, 430, fmtN(v4.d / 0.01, 0) + '×', 'smaller', { size: 140, label: 'The wireless penalty', sub: '+0.01 ms targeted, against +' + v4.d.toFixed(2) + ' ms for the best pair measured, the Viper V4 Pro.', subW: rw });
    const cy0 = 600, ch = 360;
    demoWindow(rx, cy0, rw, ch, tileA(t, 0.3, 1));
    cardHead(t, 0.6, rx, cy0, rw, 'Latency by polling rate (lower is better)', ['measured'], { dy: 44 });
    const rows = (((RD.latency || {}).motion_latency_piaknow_2026_09_15 || {}).rows || []);
    const get = (mouse, conn) => { const r = rows.find(q => q.mouse === mouse && q.connection === conn); return r ? [1000, 2000, 4000, 8000].map(f => [f, rv(r['ms_' + f + 'Hz'])]).filter(p => p[1] != null) : []; };
    const px = rx + 110, pw = rw - 110 - 60, py = cy0 + 80, ph = ch - 80 - 64;
    const X = f => px + pw * (Math.log10(f) - 3) / Math.log10(8), Y = v => py + ph - ph * (Math.log10(v) - Math.log10(0.05)) / (Math.log10(2) - Math.log10(0.05));
    const a0 = ep(t, 0.9, 1.3);
    for (const v of [0.1, 0.2, 0.5, 1]) { line(px, Y(v), px + pw, Y(v), { color: C.hair, w: 1.2, alpha: a0 }); text(v + ' ms', px - 12, Y(v) + 7, { role: 'tick', size: 20, color: C.mute, align: 'right', alpha: a0 }); }
    for (const f of [1000, 2000, 4000, 8000]) text(f / 1000 + ' kHz', X(f), py + ph + 30, { role: 'tick', size: 20, color: C.mute, align: 'center', alpha: a0 });
    const vW = get('Razer Viper V4 Pro', 'Wireless'), kw = ep(t, 1.8, 3.0, E.io3);
    if (vW.length) {
      poly(vW.map(p => [X(p[0]), Y(p[1])]), { color: C.ref, w: 4, p: kw });
      vW.forEach((p, j) => { const kk = ep(t, 1.8 + j * 0.3, 2.1 + j * 0.3); circle(X(p[0]), Y(p[1]), 7, { fill: C.panel, alpha: kk }); circle(X(p[0]), Y(p[1]), 7, { color: C.ref, w: 2.5, alpha: kk }); });
      text('Viper V4 Pro, wireless', X(1000) + 20, Y(0.22), { role: 'label', size: 20, color: C.secondText, alpha: ep(t, 3.0, 3.4) });
      text(vW[0][1].toFixed(2) + ' to ' + vW[vW.length - 1][1].toFixed(2) + ' ms', X(1000) + 20, Y(0.22) + 28, { font: 'mono', size: 22, weight: 700, color: C.ink, alpha: ep(t, 3.0, 3.4) });
    }
    const kt = ep(t, 3.6, 4.2, E.snap);
    if (kt > 0) { heroMark(X(8000), Y(0.14), 12 * kt, 1); text('Theseus 0.14', X(8000) - 22, Y(0.14) + 8, { role: 'label', size: 20, color: C.heroText, align: 'right', alpha: kt }); }
    source(t, 'piaknow 2026-09-15: wired and wireless rows of the same mice. Theseus: 0.13 and 0.14 ms targets, Kunai\'s timing model, projected.', { t0: 3 });
  }
});


/* ============================== the cell: energy per gram, cycles, and its share of the mouse's weight ============================== */
function elc_cells() {
  const ch = ((RD.batteries || {}).chemistries || []), by = id => ch.find(c => c.id === id) || {}, B = elc_cell();
  const li = by('li_ion_cylindrical'), aa = by('alkaline_aa'), ni = by('nimh_aa_lsd'), l91 = by('lithium_primary_aa');
  return {
    placeholder: !ch.length,
    rows: [
      { name: 'Li-polymer pouch', sub: 'Example: Jauch ' + B.part + ', ' + B.mAh + ' mAh', mAh: B.mAh, hero: true, whkg: Math.round(B.wh / B.g * 1000), whkgEv: 'derived', cyc: 300, cycEv: 'datasheet', g: B.g },
      { name: 'Li-ion cylinder', sub: '18650, Panasonic NCR18650B', whkg: rv(li.gravimetric_energy_density) || 243, whkgEv: 'datasheet', cyc: [500, 1000], cycEv: 'datasheet', g: rv(li.mass) || 48.5 },
      { name: 'Alkaline AA', sub: 'Energizer E91', ref: true, whkg: rv(aa.gravimetric_energy_density_low_drain) || 163, whkgLow: rv(aa.gravimetric_energy_density_1W) || 40, whkgEv: 'derived', cyc: 1, cycEv: 'datasheet', g: rv(aa.mass) || 23 },
      { name: 'NiMH AA', sub: 'Panasonic eneloop', whkg: rv(ni.gravimetric_energy_density) || 84, whkgEv: 'derived', cyc: rv(ni.cycle_life) || 2100, cycEv: 'claim', g: rv(ni.mass) || 27 },
      { name: 'Lithium AA', sub: 'Energizer L91', whkg: null, whkgEv: 'datasheet', cyc: 1, cycEv: 'datasheet', g: rv(l91.mass) || 15 }
    ]
  };
}
S({
  id: 'cells', ch: 'elec', after: 'elc_safe', theme: 'night', title: 'The pouch battery, per gram', settle: 10, ideas: ['battery'],
  src: ['elcLp4025', 'ntrJauch', 'exNcr', 'exE91', 'exEneloop', 'exL91', 'exBu107', 'nrf54'],
  draw: t => {
    const D = elc_cells(), M = THESEUS.mass, aa = D.rows.find(r => r.ref) || { g: 23 }, me = D.rows[0];
    header(t, 'The pouch battery, per gram');
    captions(t, [[0.6, 'At a mouse\'s drain a fresh AA holds about as much energy per gram as a pouch battery, but it is one ' + fmtN(aa.g, 0) + ' g lump, used once.'], [4.8, 'A ' + me.mAh + ' mAh pouch is ' + fmtN(me.g, 0) + ' g, ' + fmtN(100 * me.g / M, 0) + '% of the mouse, and charges again and again.']]);
    /* the table: the share of the mouse drawn as bars (it decides what fits); energy and cycles as plain figures */
    const x = LM, y0 = 400, rh = 104, lw = 330, xs = x + lw, sw = 320, xe = xs + sw + 56, xc = xe + 252, xr = 1200;
    const a0 = ep(t, 0.6, 1.0), load = ep(t, 5.4, 6.6) * (1 - ep(t, 7.6, 8.6));
    [[xs, 'Share of the mouse', '% of ' + THS.massG + ' (lower is better)'], [xe, 'Energy per gram', 'Wh/kg'], [xc, 'Longevity', 'charge cycles']].forEach(([cx, l, u]) => { text(l, cx, y0 - 66, { role: 'label', size: 22, color: C.ink, alpha: a0 }); text(u, cx, y0 - 36, { role: 'label', size: 19, color: C.faint, alpha: a0 }); });
    line(x, y0 - 10, xr, y0 - 10, { color: C.hair, w: 1.5, alpha: a0 });
    D.rows.forEach((r, i) => {
      const y = y0 + i * rh, t0 = 0.9 + i * 0.16, a = ep(t, t0, t0 + 0.4), k = ep(t, t0 + 0.15, t0 + 0.95, E.snap), by = y + 58, bh = 16;
      if (r.hero) rect(x - 18, y + 8, 6, rh - 22, { fill: C.hero, alpha: a });
      line(x, y + rh - 8, xr, y + rh - 8, { color: C.hair, w: 1, alpha: a });
      text(r.name, x, y + 44, { role: 'h3', size: 29, color: r.hero ? C.heroText : C.ink, alpha: a });
      text(r.sub, x, y + 76, { role: 'label', size: 19, color: r.hero ? C.heroText : C.mute, alpha: a, maxW: lw - 20 });
      const sh = r.g / M * 100, col = r.hero ? C.hero : sh > 50 ? C.bad : C.comp;
      rr(xs, by - bh / 2, sw, bh, bh / 2, C.track, null, 0, a);
      rr(xs, by - bh / 2, Math.max(bh, sw * clamp(sh / 100) * k), bh, bh / 2, col, null, 0, a);
      text(countUp(fmtN(sh, 0) + '%', k) || fmtN(sh, 0) + '%', xs, by - 20, { font: 'mono', size: 26, weight: 800, color: r.hero ? C.heroText : sh > 50 ? C.bad : C.ink, alpha: a });
      if (sh > 100) text('Heavier than the mouse', xs, by + 34, { role: 'label', size: 19, color: C.bad, alpha: ep(t, t0 + 1.0, t0 + 1.4) });
      const wv = r.whkg == null ? null : r.whkgLow ? Math.round(lerp(r.whkg, r.whkgLow, load)) : r.whkg;
      /* Theseus's pouch wins the share of the mouse, not energy per gram or cycles: those two columns are plain for every row */
      text(wv == null ? 'Not digitised' : fmtN(wv, 0), xe, by + 8, { font: 'mono', size: 25, weight: 600, color: wv == null ? C.faint : C.ink2, alpha: a });
      if (r.whkgLow) text(load > 0.5 ? 'at 1 W' : 'at 25 mW', xe + 70, by + 8, { role: 'label', size: 19, color: load > 0.5 ? C.bad : C.faint, alpha: a });
      const cv = Array.isArray(r.cyc) ? fmtN(r.cyc[0], 0) + '–' + fmtN(r.cyc[1], 0) : r.cyc === 1 ? 'Single use' : fmtN(r.cyc, 0) + (r.hero ? ' to 80%' : '');
      text(cv, xc, by + 8, { font: 'mono', size: 25, weight: 600, color: r.cyc === 1 ? C.bad : C.ink2, alpha: a });
    });
    if (D.placeholder) placeholderStamp(t, x, y0 - 80, xr - x, rh * 5 + 80);
    /* the right column: by how much, before → after, the word */
    const rx = 1240, rw = RM - rx;
    elc_hl(t, 4.0, rx, 440, fmtN(aa.g / me.g, 1) + '×', 'lighter', { label: 'Than an AA, and it recharges', sub: fmtN(me.g, 0) + ' g against ' + fmtN(aa.g, 0) + ' g, for ' + THS.hours + ' at 1 kHz and ' + me.cyc + ' charges to 80%.', subW: rw });
    elc_ba(t, 4.8, rx, 660, fmtN(100 * aa.g / M, 0), fmtN(100 * me.g / M, 0), { label: 'Share of the mouse: an AA, then the pouch', unit: '%', net: 'One battery, charged in about an hour', maxW: rw });
    glossBox(t, 5.6, rx, 750, rw, 'Boost converter', 'One AA gives 0.8 to 1.6 V and the nRF54 needs at least 1.7 V, so an AA mouse spends parts and energy stepping it up.', { size: 24 });
    source(t, 'Datasheets: Jauch, Panasonic, Energizer. Wh/kg derived: energy ÷ mass; E91 read from its constant-power curve. Cycles: datasheets, Battery University, the eneloop claim.', { t0: 3 });
  }
});


/* ============================== the frontier: weight against latency and against battery life ============================== */
S({
  id: 'frontier', ch: 'elec', after: 'cells', theme: 'paper', title: 'Past the Pareto frontier', settle: 11, ideas: ['latency', 'battery'],
  src: ['exPiaknow', 'exRtings', 'exEloshapes', 'exNbcV4', 'elcLp4025', 'kunai'],
  draw: t => {
    header(t, 'Past the Pareto frontier');
    captions(t, [[0.6, 'Every wireless mouse with a published number, against its weight. No mouse ships past the black line on either chart.'], [5.6, 'Theseus sits past both: ' + THS.massG + ', a 0.14 ms target and ' + THS.hours + ' at 1 kHz.']]);
    const lat = ((RD.latency || {}).motion_latency_piaknow_2026_09_15 || {}).rows || [];
    const idOf = { 'Razer Viper V4 Pro': 'razer-viper-v4-pro', 'Scyrox V8': 'scyrox-v8', 'WLMOUSE Beast X 8K': 'wlmouse-beast-x', 'VAXEE NP01-S V3': 'vaxee-np01s-v3', 'ELECOM VM800L': 'elecom-vm800l', 'Razer Viper V3 Pro': 'razer-viper-v3-pro', 'Logitech G PRO X2 SUPERSTRIKE': 'logitech-superstrike', 'Logitech G PRO X SUPERLIGHT 2': 'logitech-gpx2' };
    const P1 = lat.filter(r => r.connection === 'Wireless' && rv(r.ms_8000Hz) != null && idOf[r.mouse]).map(r => { const w = exWeight(idOf[r.mouse]); return w ? { name: exShort(w.name).replace('Logitech G Pro X2 Superstrike', 'Superstrike'), x: w.g, y: rv(r.ms_8000Hz), hollow: w.ev !== 'measured', id: idOf[r.mouse] } : null; }).filter(Boolean);
    const pw = (RM - LM - 80) / 2, ph = 360, py = 340;
    cardHead(t, 0.5, LM - 26, py - 76, pw + 26, 'Motion latency at 8 kHz, wireless (lower is better)', ['measured']);
    const s1 = scatter(t, {
      x: LM + 96, y: py, w: pw - 96, h: ph, t0: 0.6, xr: [20, 70], yr: [0, 1.0], xticks: [20, 30, 40, 50, 60, 70], yticks: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
      xfmt: v => v + ' g', yfmt: v => v.toFixed(1) + ' ms', xlabel: 'Weight, {g}', better: { x: -1, y: -1 }, sweet: {}, frontier: true,
      points: P1.length ? P1 : [{ name: 'placeholder', x: 49, y: 0.34 }], target: { x: THESEUS.mass, y: 0.14, name: 'Theseus', dx: 26, dy: -6 }, placeholder: !P1.length
    });
    /* the sweet spot's words, in the open part of its field: in the corner they sat under Theseus's mark */
    text('Lighter and faster', s1.X(20) + 22, s1.Y(0.42), { role: 'label', size: 21, color: C.heroText, alpha: ep(t, 1.2, 1.7) });
    const mice = (RD.mice || {}).mice || [];
    const P2 = mice.filter(m => rv(m.battery_claim_1k_h) && m.connection !== 'wired').map(m => { const w = exWeight(m.id); return w ? { name: exShort(m.name).replace('Logitech G Pro X Superlight 2c', 'GPX2c').replace('Logitech GPX2c', 'GPX2c').replace('Razer DeathAdder V4 Pro', 'DeathAdder V4 Pro').replace('Xiaomi Gaming Mouse 2', 'Xiaomi GM2').replace('Logitech Superstrike', 'Superstrike').replace('ZOWIE ', ''), x: w.g, y: rv(m.battery_claim_1k_h), hollow: w.ev !== 'measured' } : null; }).filter(Boolean);
    const rx = LM + pw + 80;
    cardHead(t, 0.9, rx - 26, py - 76, pw + 26, 'Battery life at 1 kHz, claimed (higher is better)', ['claim']);
    const s2 = scatter(t, {
      x: rx + 96, y: py, w: pw - 96, h: ph, t0: 1.0, xr: [20, 70], yr: [0, 220], xticks: [20, 30, 40, 50, 60, 70], yticks: [0, 50, 100, 150, 200],
      xfmt: v => v + ' g', yfmt: v => v + ' h', xlabel: 'Weight, {g}', better: { x: -1, y: 1 }, sweet: true, frontier: true,
      points: P2.length ? P2 : [{ name: 'placeholder', x: 49, y: 180 }], target: { x: THESEUS.mass, y: THESEUS.hours, name: 'Theseus', dx: 26, dy: -6 }, placeholder: !P2.length
    });
    const nb = ['finalmouse-ulx', 'finalmouse-slx', 'ninjutso-sora-v2', 'wlmouse-beast-x', 'pulsar-x2-crazylight-m'].map(exWeight).filter(Boolean), kn = ep(t, 3.4, 3.9);
    nb.forEach(w => { const X = rx + 96 + (pw - 96) * (w.g - 20) / 50; line(X, py + ph - 26, X, py + ph - 8, { color: C.bad, w: 2.5, alpha: kn }); });
    if (nb.length) text('Under 47 g, none publish hours', rx + 96 + 16, py + ph - 40, { role: 'label', size: 20, color: C.bad, alpha: kn });
    /* the strip: by how much, before → after, the legend */
    const v4 = P1.find(p => p.id === 'razer-viper-v4-pro') || { x: 49, y: 0.34 };
    elc_hl(t, 5.4, LM, 880, '−' + fmtN(100 * (1 - THESEUS.mass / v4.x), 0) + '%', 'weight', { size: 110, label: 'Against the fastest wireless mouse, and faster', sub: THS.massG + ' against its ' + fmtN(v4.x, 0) + ' g, and 0.14 ms against ' + v4.y.toFixed(2) + '.', subW: 820 });
    elc_ba(t, 6.0, 1000, 880, '180', String(THESEUS.hours), { size: 64, label: 'At 1 kHz, the longest listed', unit: 'h', net: 'At ' + fmtN(100 * THESEUS.mass / v4.x, 0) + '% of its weight', maxW: 420 });
    [[{ kind: 'dot', color: '#B9B8B2', label: 'Weighed by RTINGS' }], [{ kind: 'ring', color: '#B9B8B2', label: 'Maker\'s weight' }], [{ kind: 'line', color: C.ink, label: 'Pareto frontier' }], [{ kind: 'hero', label: 'Theseus, derived' }]].forEach((it, i) => legend(t, 4.2 + i * 0.08, 1500, 800 + i * 34, it, { size: 20 }));
    const un = [...new Set([...(s1.unnamed || []), ...(s2.unnamed || [])].map(n => n.replace(/^(Razer|Logitech|ZOWIE|Lamzu|Pulsar|Finalmouse|Ninjutso) /, '')))];
    if (un.length) text('Unnamed: ' + un.join(', '), 1500, 938, { role: 'label', size: 19, color: C.faint, alpha: ep(t, 4.6, 5.0), maxW: RM - 1500 });
    source(t, 'Latency: piaknow 2026-09-15, 8 kHz. Hours: maker claims. Theseus: ' + THS.hours + ' at 1 kHz, derived (the example battery at the V4 Pro\'s draw); 0.14 ms, Kunai\'s model.', { t0: 3 });
  }
});