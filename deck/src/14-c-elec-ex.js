/* ============================== c. the cell: energy per gram, cycles, charge time, and its share of 29 g ============================== */
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
  id: 'cells', ch: 'elec', after: 'power', theme: 'paper', title: 'The cell, per gram', settle: 10, ideas: ['battery'],
  src: ['exJauch', 'exNcr', 'exE91', 'exEneloop', 'exL91', 'exBu107', 'exBu409'],
  draw: t => {
    header(t, 'The cell, per gram');
    captions(t, [[0.6, 'At a mouse\'s drain, a fresh AA holds as much energy per gram as a small LiPo: 163 against 123 to 153 Wh/kg.'], [4.6, 'It loses on everything else: one 23 g lump, used once, a quarter of its energy at 1 W, and below the radio\'s 1.7 V.']]);
    const D = exCells(), x = LM, y0 = 360, rh = 96, lw = 400, gap = 36, cw = (RM - x - lw - gap * 3) / 4;
    const cols = [
      { lab: 'Share of a 29 g mouse', unit: '% of 29 g', max: 100, val: r => r.g / 29 * 100, fmt: v => fmtN(v, 0) + '%', share: true },
      { lab: 'Energy per gram', unit: 'Wh/kg', max: 260, val: r => r.whkg, fmt: v => fmtN(v, 0), energy: true },
      { lab: 'Charge cycles', unit: 'to 80%, log', log: [1, 3000], val: r => r.cyc, fmt: v => Array.isArray(v) ? fmtN(v[0], 0) + '–' + fmtN(v[1], 0) : v === 1 ? '1' : fmtN(v, 0) },
      { lab: 'Time to full', unit: '{h}, fastest rated', max: 5, val: r => r.chg, fmt: v => Array.isArray(v) ? (v[0] === v[1] ? fmtN(v[0], v[0] < 1 ? 2 : 1) : fmtN(v[0], 0) + '–' + fmtN(v[1], 0)) : '', charge: true }
    ];
    const a0 = ep(t, 0.6, 1.0);
    cols.forEach((c, j) => {
      const cx = x + lw + j * (cw + gap);
      text(c.lab, cx, y0 - 50, { role: 'label', size: 21, color: C.ink, alpha: a0 });
      text(c.unit, cx, y0 - 22, { role: 'label', size: 19, color: C.faint, alpha: a0 });
    });
    line(x, y0 - 6, RM, y0 - 6, { color: C.hair, w: 1.5, alpha: a0 });
    D.rows.forEach((r, i) => {
      const y = y0 + i * rh, t0 = 0.9 + i * 0.16, a = ep(t, t0, t0 + 0.4);
      if (r.hero) rect(x - 18, y + 4, 6, rh - 12, { fill: YEL, alpha: a });
      line(x, y + rh - 4, RM, y + rh - 4, { color: C.hair, w: 1, alpha: a });
      text(r.name, x, y + 42, { role: 'h3', size: 30, color: C.ink, alpha: a });
      text(r.sub, x, y + 74, { role: 'label', size: 19, color: r.hero ? C.heroText : C.mute, alpha: a });
      cols.forEach((c, j) => {
        const cx = x + lw + j * (cw + gap), v = c.val(r), k = ep(t, t0 + 0.15 + j * 0.1, t0 + 0.95 + j * 0.1, E.snap), by = y + 52, bh = 16;
        rr(cx, by - bh / 2, cw, bh, bh / 2, C.track, null, 0, a);
        if (v == null) { text(c.energy ? 'Not digitised' : r.chgNote || 'n/a', cx, by - 18, { role: 'label', size: 19, color: C.faint, alpha: a }); return; }
        const P = q => c.log ? clamp(Math.log10(q / c.log[0]) / Math.log10(c.log[1] / c.log[0])) : clamp(q / c.max);
        const lo = Array.isArray(v) ? v[0] : v, hi = Array.isArray(v) ? v[1] : v;
        const col = r.hero ? YEL : r.ref ? C.ink : C.comp, wHi = Math.max(bh, cw * P(hi) * k), wLo = Math.max(bh, cw * P(lo) * k);
        if (hi !== lo) rr(cx, by - bh / 2, wHi, bh, bh / 2, rgba(r.hero ? YEL : '#111111', r.hero ? 0.45 : 0.18), null, 0, a);
        rr(cx, by - bh / 2, wLo, bh, bh / 2, col, r.hero ? '#111111' : null, 1.3, a);
        if (r.whkgLow && c.energy) { const wl = cw * P(r.whkgLow) * k; rr(cx, by - bh / 2, Math.max(bh, wl), bh, bh / 2, C.ink, null, 0, a); text('At 1 W: ' + r.whkgLow, cx, by + 36, { role: 'label', size: 19, color: C.red, alpha: ep(t, t0 + 1.0, t0 + 1.4) }); text('At 25 mW', cx + cw - 22, by - 18, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: a }); }
        if (c.share && r.g / 29 > 1) text('Does not fit', cx + cw, by + 34, { role: 'label', size: 19, color: C.red, align: 'right', alpha: ep(t, t0 + 1.0, t0 + 1.4) });
        text(c.fmt(v), cx, by - 18, { font: 'mono', size: 24, weight: r.hero ? 800 : 600, color: C.ink, alpha: a });
        const ev = c.energy ? r.whkgEv : c.log ? r.cycEv : c.charge ? r.chgEv : 'derived';
        if (ev) evDot(cx + cw - 8, by - 26, ev, 5, a);
        if (c.charge && r.chgNote) text(r.chgNote, cx + cw - 22, by - 18, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: a });
      });
    });
    legend(t, 1.4, RM, LAY.top, [{ kind: 'dot', color: evCol('datasheet'), label: 'Datasheet' }, { kind: 'ring', color: evCol('derived'), label: 'Derived' }, { kind: 'ring', color: evCol('claim'), label: 'Maker claim' }], { size: 19, gap: 26, align: 'right' });
    if (D.placeholder) placeholderStamp(t, x, y0 - 80, RM - x, rh * 5 + 80);
    gloss(t, 4.0, 'Boost converter', 'One AA gives 0.8 to 1.6 V; the nRF54 needs at least 1.7 V. An AA mouse spends more parts and some energy stepping it up.');
    featureCard(t, 4.4, 'A 250 mAh pouch cell', ['datasheet', 'derived'], '7.5 g, 26% of the mouse, 500 cycles, 0.5C. About 146 h at 1 kHz on a Viper V4 Pro\'s draw.');
  }
});

/* ============================== e. the frontier: weight against latency and against battery life ============================== */
S({
  id: 'frontier', ch: 'elec', after: 'cells', theme: 'night', title: 'Past the frontier', settle: 11, ideas: ['latency', 'battery'],
  src: ['exPiaknow', 'exRtings', 'exEloshapes', 'exNbcV4', 'exJauch'],
  draw: t => {
    header(t, 'Past the frontier');
    captions(t, [[0.6, 'Every wireless mouse with a published number, against its weight. No mouse ships past the black line.'], [5.6, 'Theseus as budgeted sits past it on both: 29 g, a 0.14 ms target, and about 146 h at 1 kHz.']]);
    /* left: motion latency (piaknow, measured) */
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
    /* right: battery hours at 1 kHz (maker claims) */
    const mice = (RD.mice || {}).mice || [];
    const P2 = mice.filter(m => rv(m.battery_claim_1k_h) && m.connection !== 'wired').map(m => { const w = exWeight(m.id); return w ? { name: exShort(m.name).replace('Logitech G Pro X Superlight 2c', 'GPX2c').replace('Logitech GPX2c', 'GPX2c').replace('Razer DeathAdder V4 Pro', 'DeathAdder V4 Pro').replace('Xiaomi Gaming Mouse 2', 'Xiaomi GM2').replace('Logitech Superstrike', 'Superstrike').replace('ZOWIE ', ''), x: w.g, y: rv(m.battery_claim_1k_h), hollow: w.ev !== 'measured' } : null; }).filter(Boolean);
    const rx = LM + pw + 80;
    cardHead(t, 0.9, rx - 26, py - 76, pw + 26, 'Battery life at 1 kHz, claimed', ['claim']);
    const s2 = scatter(t, {
      x: rx + 96, y: py, w: pw - 96, h: ph, t0: 1.0, xr: [20, 70], yr: [0, 200], xticks: [20, 30, 40, 50, 60, 70], yticks: [0, 50, 100, 150, 200],
      xfmt: v => v + ' g', yfmt: v => v + ' h', xlabel: 'Weight, {g}', better: { x: -1, y: 1 }, sweet: { label: 'Lighter and longer' }, frontier: true,
      points: P2.length ? P2 : [{ name: 'placeholder', x: 49, y: 180 }], target: { x: 29, y: 146, name: 'Theseus, as budgeted', dx: 26, dy: -6 }, placeholder: !P2.length
    });
    /* the light mice that publish no battery life, as ticks on the axis */
    const nb = ['finalmouse-ulx', 'finalmouse-slx', 'ninjutso-sora-v2', 'wlmouse-beast-x', 'pulsar-x2-crazylight-m'].map(exWeight).filter(Boolean), kn = ep(t, 3.4, 3.9);
    nb.forEach((w, i) => { const X = rx + 96 + (pw - 96) * (w.g - 20) / 50; line(X, py + ph - 26, X, py + ph - 8, { color: C.red, w: 2.5, alpha: kn }); });
    if (nb.length) { const x1 = rx + 96 + (pw - 96) * (Math.min(...nb.map(w => w.g)) - 20) / 50 - 16; text('Nothing under 47 g publishes hours:\nULX, Starlight X, Sora V2,\nBeast X, X2 CrazyLight', rx + 96 + 16, py + ph - 96, { role: 'label', size: 19, color: C.red, lh: 1.3, alpha: kn }); }
    legend(t, 4.2, LM, 926, [{ kind: 'dot', color: '#B9B8B2', label: 'Weighed by RTINGS' }, { kind: 'ring', color: '#B9B8B2', label: 'Maker\'s weight' }, { kind: 'line', color: C.ink, label: 'Pareto frontier' }, { kind: 'hero', label: 'Theseus target, projected' }]);
    const un = [...new Set([...(s1.unnamed || []), ...(s2.unnamed || [])])];
    if (un.length) text('Unnamed dots: ' + un.join(', '), RM, 926, { role: 'small', size: 21, color: C.mute, align: 'right', alpha: ep(t, 4.6, 5.0), maxW: 480 });
    source(t, 'Latency: piaknow 2026-09-15, 8 kHz. Hours: maker claims. Theseus hours: 0.96 Wh at the V4 Pro\'s 6.6 mW, derived.', { t0: 3 });
  }
});

/* ============================== f. the fastest mice, rebuilt as a Kunai ranking ============================== */
S({
  id: 'motion', replaces: 'motion', ch: 'elec', after: 'onechip', theme: 'night', title: 'The fastest mice, on one chart', settle: 10, ideas: ['latency'],
  src: ['exPiaknow', 'kunai', 'xbab'],
  draw: t => {
    header(t, 'The fastest mice, on one chart');
    captions(t, [[0.6, 'piaknow times each mouse from the moment it moves to the moment the PC sees it, on one rig, so every row compares.'], [5.2, 'The fastest wireless mouse measured is 0.34 ms. My target is 0.14 ms, measured the same way.']]);
    const rows0 = (((RD.latency || {}).motion_latency_piaknow_2026_09_15 || {}).rows || []).filter(r => rv(r.ms_8000Hz) != null);
    const nm = r => r.mouse.replace('Logitech G PRO X SUPERLIGHT 2', 'Logitech GPX2').replace('Logitech G PRO X2 SUPERSTRIKE', 'Logitech Superstrike').replace('HP HyperX Pulsefire Haste 2', 'HyperX Haste 2').replace('Endgame Gear ', 'Endgame ') + (r.footnote === '*' || /footnote \*$/.test((r.ms_8000Hz || {}).note || '') ? '*' : '');
    const wired = rows0.filter(r => r.connection === 'Wired').map(r => ({ name: nm(r), v: rv(r.ms_8000Hz), ref: r.mouse === 'XBAB XA25' }));
    const wless = rows0.filter(r => r.connection === 'Wireless').map(r => ({ name: nm(r), v: rv(r.ms_8000Hz), hollow: true, ref: r.mouse === 'Razer Viper V4 Pro' }));
    wless.push({ name: 'Theseus', qual: 'Target', v: 0.14, hero: true });
    wired.sort((a, b) => a.v - b.v); wless.sort((a, b) => a.v - b.v);
    const cw = (RM - LM - 40) / 2, y = 272, h = 600;
    [[LM, 'Wired, 8 kHz', wired, ['measured']], [LM + cw + 40, 'Wireless, 8 kHz', wless, ['measured', 'projected']]].forEach(([x, lab, rows, ev], i) => {
      demoWindow(x, y, cw, h, ep(t, 0.2 + i * 0.2, 0.6 + i * 0.2), { grid: true });
      cardHead(t, 0.3 + i * 0.2, x, y, cw, lab, ev);
      lollipop(t, { x: x + 26, y: y + 148, w: cw - 52, t0: 0.5 + i * 0.4, rows: rows.length ? rows : [{ name: 'placeholder', v: 0.3 }], xr: [0, 1.0], ticks: [0, 0.25, 0.5, 0.75, 1.0], tfmt: v => v.toFixed(2), fmt: v => v.toFixed(2), rowH: 43, labelW: 330, valW: 76, nsize: 24, target: i ? { v: 0.14 } : null, placeholder: !rows.length });
    });
    legend(t, 3.0, LM, 916, [{ kind: 'dot', color: '#8E8D88', label: 'Wired' }, { kind: 'ring', color: '#8E8D88', label: 'Wireless' }, { kind: 'dot', color: C.ink, label: 'Fastest of each' }, { kind: 'hero', label: 'Theseus target' }]);
    text('* Motion Sync forced on: {piaknow} flags these rows', RM, 916, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: ep(t, 3.2, 3.6) });
    source(t, 'Data: piaknow, "Motion Latency of Some Computer Mice 2026-09-15", every 8 kHz row. piaknow has not measured Theseus.', { t0: 3 });
  }
});

