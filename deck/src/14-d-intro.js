/* ============================================================================================
   INTRO, the new slides (chapter code ntr):
     ntr_stats (Theseus, by the numbers: the bento, after the flagships)
     ntr_density (Density, not weight) · ntr_sizewt (The size–weight illusion) · ntr_densrank (Ranked by density),
     after the weight slides (zerograms, weightgap)
   Density is Pwnage's: grams over the volume of the box a mouse fits in, length × width × height, in g/cm³. Lower is
   lighter for its size. Theseus's box is the Ninjutso Sora V2's published one (EloShapes, 119.2 × 62.0 × 37.7 mm): the
   shape is a placeholder and the 3D model is built from the Sora V2 (Brock, 2026-11-04).
   ============================================================================================ */
Object.assign(SRC, {
  ntrPwnVanta: { t: 'Pwnage, VANTA product page: total volume 288 cm³, total weight 49 g, density 0.17 g/cm³; "average gaming mouse density" 0.30 g/cm³; 120 × 61 × 39 mm. "Two mouses with the same weight can feel totally different ... because of the difference in density"', u: 'https://pwnage.com/products/vanta-gaming-mouse', n: 'A maker\'s figures for its own mice: claims. 120 × 61 × 39 mm is 285.5 cm³; Pwnage lists 288.' },
  ntrPwnTrinity: { t: 'Pwnage, Trinity CF product page: total volume 274 cm³, total weight 39 g, density 0.14 g/cm³; average gaming mouse 0.30 g/cm³; 118 × 60 × 39 mm', u: 'https://pwnage.com/products/trinity', n: '118 × 60 × 39 mm is 276.1 cm³; Pwnage lists 274. Both of its volumes are length × width × height to within 1 %.' },
  ntrSoraDim: { t: 'EloShapes, Ninjutso Sora V2: 119.2 × 62.0 × 37.7 mm, 39.0 g (the maker\'s figures). Brock\'s scan of a Sora V3 measures 119.2 × 62.5 × 38.1 mm (3d/CONVENTIONS.md)', u: 'https://www.eloshapes.com/mouse/compare?p=ninjutso-sora-v2', n: 'Theseus\'s box on these slides is the Sora V2\'s, a placeholder until the shape is final.' },
  ntrSwi: { t: 'Buckingham 2014, "Getting a grip on heaviness perception: a review of weight illusions and their probable causes", Experimental Brain Research 232(6):1623-1629: the size-weight illusion, "where a small object feels heavier than an identically weighted, but otherwise similar-looking, larger object"; over 100 years of research', u: 'https://doi.org/10.1007/s00221-014-3926-9' },
  ntrCharp: { t: 'Murray, Ellis, Bandomir & Ross 1999, "Charpentier (1891) on the size-weight illusion", Perception & Psychophysics 61(8):1681-1685: Charpentier\'s 1891 paper is the first experimental evidence for the illusion', u: 'https://doi.org/10.3758/BF03213127' },
  ntrRtUlxPro: { t: 'RTINGS, Finalmouse ULX Pro Series review: 35.9 g default weight (2024-06-11; the size of the unit tested is not stated)', u: 'https://www.rtings.com/mouse/reviews/finalmouse/ulx-pro-series' },
  ntrX2f: { t: 'Pulsar, X2F CrazyLight: 29 g, a front-half shell, 87.5 × 61.1 × 31.6 mm (EloShapes), $149.95 (Pulsar store)', u: 'https://www.eloshapes.com/mouse/compare?p=pulsar-x2f-crazylight' }
});

/* ---------- density: grams per cm³ of the box a mouse fits in ---------- */
const NTR_DN = {
  /* left out, as on the weightgap slide: RTINGS doesn't say which ULX size it weighed; the MCHOSE weighed 17.7 % over, likely another variant */
  skip: ['finalmouse-ulx', 'mchose-l7-ultra'],
  names: { 'pulsar-x2-crazylight-m': 'Pulsar X2 CrazyLight M', 'pulsar-x2f-crazylight': 'Pulsar X2F CrazyLight', 'vgn-f1-pro-max': 'VGN F1 Pro Max', 'logitech-gpx2-dex': 'Logitech GPX2 DEX', 'finalmouse-slx': 'Finalmouse Starlight X', 'lamzu-atlantis-mini-4k': 'Lamzu Atlantis Mini 4K', 'razer-deathadder-v4-pro': 'Razer DeathAdder V4 Pro' }
};
const ntr_dname = m => NTR_DN.names[m.id] || exShort(m.name);
/** a mouse's box: length × width × height as its maker lists them (EloShapes), and its volume in cm³ */
function ntr_box(id) { const m = exMouse(id); if (!m) return null; const L = rv(m.length_mm), Wd = rv(m.width_mm), Hh = rv(m.height_mm); return L && Wd && Hh ? { L, W: Wd, H: Hh, v: L * Wd * Hh / 1000 } : null; }
/** Theseus's box: the Sora V2's, published (a placeholder: the shape isn't final) */
function ntr_thsBox() { return ntr_box('ninjutso-sora-v2') || { L: 119.2, W: 62.0, H: 37.7, v: 278.617 }; }
const ntr_thsRho = () => THESEUS.mass / ntr_thsBox().v;
const ntr_rf = v => fmtN(v, 3);
/** every wireless mouse with a box and a weight: { id, name, g, ev, box, v, rho }; o.measured keeps RTINGS-weighed ones
   (plus o.keep), o.theseus adds Theseus (default) */
function ntr_dens(o = {}) {
  const out = [];
  for (const m of ((RD.mice || {}).mice || [])) {
    if (m.connection === 'wired' || NTR_DN.skip.includes(m.id)) continue;
    const b = ntr_box(m.id), w = exWeight(m.id); if (!b || !w) continue;
    if (o.measured && w.ev !== 'measured' && !(o.keep || []).includes(m.id)) continue;
    out.push({ id: m.id, name: ntr_dname(m), g: w.g, ev: w.ev, box: b, v: b.v, rho: w.g / b.v });
  }
  if (o.theseus !== false) { const b = ntr_thsBox(); out.push({ id: 'theseus', name: 'Theseus', g: THESEUS.mass, ev: 'proposal', box: b, v: b.v, rho: THESEUS.mass / b.v, hero: true }); }
  return out;
}
/** the lightest wireless mouse anyone has weighed: the smallest RTINGS figure of any mouse (a mouse can have several) */
function ntr_lightest() {
  let best = null;
  for (const m of ((RD.mice || {}).mice || [])) {
    if (m.connection === 'wired') continue;
    const L = Array.isArray(m.weight_measured_g) ? m.weight_measured_g : m.weight_measured_g ? [m.weight_measured_g] : [];
    for (const e of L) { const v = rv(e); if (v == null || evOf(e) !== 'measured') continue; if (!best || v < best.g) best = { g: v, id: m.id, url: e.source_url || '', m }; }
  }
  if (best) best.name = /ulx-pro-series/.test(best.url) ? 'Finalmouse ULX Pro Series' : /ultralightx-competition/.test(best.url) ? 'Finalmouse ULX Competition' : ntr_dname(best.m);
  return best;
}

/* ---------- drawing helpers ---------- */
/** a light that passes over a region once (o.per: again every per seconds): the keynote sweep */
function ntr_sweep(t, t0, x, y, w, h, o = {}) {
  const per = o.per || 0, u = t - t0; if (u < 0) return;
  const c = per ? (u % per) / (o.dur || 1.4) : u / (o.dur || 1.4); if (c >= 1) return;
  const p = E.io3(c), bx = x - w * 0.25 + w * 1.5 * p, g = G.createLinearGradient(bx - 180, y, bx + 180, y + h * 0.3);
  g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, TH ? 'rgba(255,255,255,' + (o.a || 0.5) + ')' : 'rgba(255,255,255,' + (o.a || 0.07) + ')'); g.addColorStop(1, 'rgba(255,255,255,0)');
  G.save(); if (o.path) o.path(); else { G.beginPath(); G.rect(x, y, w, h); } G.clip(); G.globalAlpha = Math.sin(p * Math.PI); G.fillStyle = g; G.fillRect(x, y, w, h); G.restore();
}
/** the shell's box in mm, from its 2D twin: the union of every part's bounds at rest */
function ntr_shellBox() {
  if (NTR.sbox) return NTR.sbox;
  const S = typeof v2dScene === 'function' ? v2dScene('shell') : null;
  let b = null;
  if (S) for (const m of S.meshes) {
    if (!m.bbox || m.vis === false) continue;
    const [lo, hi] = m.bbox;
    b = b ? { x0: Math.min(b.x0, lo[0]), x1: Math.max(b.x1, hi[0]), y0: Math.min(b.y0, lo[1]), y1: Math.max(b.y1, hi[1]), z0: Math.min(b.z0, lo[2]), z1: Math.max(b.z1, hi[2]) } : { x0: lo[0], x1: hi[0], y0: lo[1], y1: hi[1], z0: lo[2], z1: hi[2] };
  }
  NTR.sbox = b || { x0: -31.3, x1: 31.3, y0: 0, y1: 38.1, z0: -59.6, z1: 59.5 };
  return NTR.sbox;
}
/** draw the shell's flat twin (view: 'top' | 'right' | 'front') through the affine that takes its drawing onto a plane:
   map(mm [X, Y, Z]) → stage px. k = px per mm on that plane, so the twin's outlines keep their weight */
function ntr_onFace(t, view, map, k, a, st0 = {}) {
  if (a <= 0.003 || typeof v2dCam !== 'function') return;
  const box = [0, 0, 1400, 1000], st = Object.assign({ view, view2d: view, ground2d: false, colorway: 'black' }, st0);
  const c0 = v2dCam('shell', st, box); st.scale2d = k / (c0.s || 1);
  const cam = v2dCam('shell', st, box), p = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]; p[1][cam.j] = 40; p[2][cam.k] = 40;
  const q = p.map(cam.P), r = p.map(map);
  const d1 = [q[1][0] - q[0][0], q[1][1] - q[0][1]], d2 = [q[2][0] - q[0][0], q[2][1] - q[0][1]];
  const e1 = [r[1][0] - r[0][0], r[1][1] - r[0][1]], e2 = [r[2][0] - r[0][0], r[2][1] - r[0][1]];
  const det = d1[0] * d2[1] - d2[0] * d1[1]; if (Math.abs(det) < 1e-9) return;
  const i00 = d2[1] / det, i01 = -d2[0] / det, i10 = -d1[1] / det, i11 = d1[0] / det;
  const A00 = e1[0] * i00 + e2[0] * i10, A01 = e1[0] * i01 + e2[0] * i11, A10 = e1[1] * i00 + e2[1] * i10, A11 = e1[1] * i01 + e2[1] * i11;
  const tx = r[0][0] - (A00 * q[0][0] + A01 * q[0][1]), ty = r[0][1] - (A10 * q[0][0] + A11 * q[0][1]);
  G.save(); G.transform(A00, A10, A01, A11, tx, ty);
  try { view2D('shell', t, box[0], box[1], box[2], box[3], st, { alpha: a, ground: false }); } catch (e) { console.error('ntr_onFace', e); }
  G.restore();
}
/** an isometric projector for the shell's box: l along Z (the nose at l = L), w along X (the side-button side at w = W),
   h up. O = where the box's back bottom corner lands; k = px per mm */
function ntr_iso(O, k, B) {
  const c = Math.cos(Math.PI / 6) * k, s = 0.5 * k;
  return p => { const l = p[2] - B.z0, w = p[0] - B.x0, h = p[1] - B.y0; return [O[0] + (l - w) * c, O[1] + (l + w) * s - h * k]; };
}
/** a face as a path */
function ntr_quad(Q) { G.beginPath(); G.moveTo(Q[0][0], Q[0][1]); for (let i = 1; i < Q.length; i++) G.lineTo(Q[i][0], Q[i][1]); G.closePath(); }
/** a box in cabinet projection: the front face L × H toward us, the depth W receding up and right at 45°, half scale.
   (x, yb) = the front face's bottom left; k = px per mm. o = { a, edge, fill, face (draws on the front face: fn(map)) }.
   returns { fw, fh, dx, dy, top } */
function ntr_cab(x, yb, L, Wd, H, k, o = {}) {
  const a = o.a == null ? 1 : o.a, dx = Wd * k * 0.5 * Math.SQRT1_2, dy = -dx, fw = L * k, fh = H * k;
  const F = [[x, yb], [x + fw, yb], [x + fw, yb - fh], [x, yb - fh]], Bk = F.map(p => [p[0] + dx, p[1] + dy]);
  if (a <= 0.003) return { fw, fh, dx, dy };
  const edge = o.edge || inkA(TH ? 0.7 : 0.6);
  G.save(); G.globalAlpha = a;
  ntr_quad([F[3], F[2], Bk[2], Bk[3]]); G.fillStyle = inkA(TH ? 0.05 : 0.07); G.fill();   /* top */
  ntr_quad([F[1], Bk[1], Bk[2], F[2]]); G.fillStyle = inkA(TH ? 0.09 : 0.11); G.fill();   /* side */
  ntr_quad(F); G.fillStyle = o.fill || inkA(TH ? 0.025 : 0.035); G.fill();                /* front */
  G.restore();
  if (o.face) o.face(a);
  G.save(); G.globalAlpha = a; G.strokeStyle = edge; G.lineWidth = o.lw || 1.6; G.lineJoin = 'round';
  ntr_quad(F); G.stroke(); ntr_quad([F[3], F[2], Bk[2], Bk[3]]); G.stroke(); ntr_quad([F[1], Bk[1], Bk[2], F[2]]); G.stroke();
  G.restore();
  return { fw, fh, dx, dy, F, Bk };
}
/** a soft shadow on the ground under something set down */
function ntr_shadow(cx, cy, rx, ry, a) { if (a <= 0.003) return; G.save(); G.globalAlpha = a; const g = G.createRadialGradient(cx, cy, 0, cx, cy, rx); g.addColorStop(0, inkA(TH ? 0.16 : 0.5)); g.addColorStop(1, inkA(0)); G.fillStyle = g; G.translate(cx, cy); G.scale(1, ry / rx); G.translate(-cx, -cy); G.beginPath(); G.arc(cx, cy, rx, 0, TAU); G.fill(); G.restore(); }

/* ============================== the stats bento: Theseus's numbers, the next best under each ============================== */
/* Apple's summary grid (bento) with this deck's extra data: each tile has its evidence at the top, one big number in
   Theseus's gradient that ticks up, what it is, and at the foot the next best in a smaller, darker yellow figure with
   its own evidence. The centre tile is the mouse, small, turning. */
function ntr_statsData() {
  const lw = ntr_lightest(), dn = ntr_dens({ measured: true, theseus: false }).sort((a, b) => a.rho - b.rho)[0];
  const mo = ntr_fv('razer-viper-v4-pro', 'motion_latency'), bt = ntr_fv('razer-viper-v4-pro', 'battery_claim_1k_h');
  const ulx = exMouse('finalmouse-ulx'), ulxP = ulx ? rv(ulx.price_usd) : null;
  return [
    { value: THS.mass, unit: 'g', label: 'Weight, every unit weighed', ev: 'proposal', by: 'Brock', next: lw && { value: fmtN(lw.g, 1), unit: 'g', who: lw.name.replace('Finalmouse ', ''), ev: 'measured', by: 'RTINGS', head: 'Lightest weighed' } },
    { value: ntr_rf(ntr_thsRho()), unit: 'g/cm³', label: 'Density: grams per {cm³} of its box', ev: 'derived', next: dn && { value: ntr_rf(dn.rho), unit: '', who: dn.name.replace('Pulsar ', ''), ev: 'derived', head: 'Next best' } },
    { value: THS.price, unit: '', label: 'US list price', ev: 'proposal', by: 'Brock', next: ulxP && { value: '$' + ulxP, unit: '', who: 'ULX at launch, 2023', ev: 'datasheet', by: 'Notebookcheck', head: 'Same as', grey: true } },
    { value: '0.14', unit: 'ms', label: 'Motion latency, wireless', ev: 'proposal', next: mo && { value: fmtN(mo.v, 2), unit: 'ms', who: 'Viper V4 Pro', ev: mo.ev, by: '{piaknow}', head: 'Fastest measured' } },
    { product: true },
    { value: String(THESEUS.hours), unit: 'h', label: 'Battery at 1 kHz, measured', ev: 'proposal', next: bt && { value: fmtN(bt.v, 0), unit: 'h', who: 'Viper V4 Pro', ev: bt.ev, by: 'Razer', head: 'Longest listed' } }
  ];
}
/** a stat tile, centred: evidence, the number, what it is, and the next best (smaller, darker, yellow) with its evidence */
function ntr_statTile(t, t0, rect, d) {
  const [x, y, w, h] = rect, a = ep(t, t0, t0 + 0.55, E.snap); if (a <= 0.003) return;
  demoWindow(x, y, w, h, a);
  const pad = 36, cx = x + w / 2, ka = ep(t, t0 + 0.15, t0 + 0.6);
  { const pw = pillW(d.ev, { by: d.by }); pill(cx - pw / 2, y + pad + 18, d.ev, ka, { by: d.by }); }
  /* the number, as big as the tile allows */
  const uS = 0.34, uw = s => s ? tw(s, { font: 'disp', size: 100, weight: 700 }) / 100 : 0, nw = tw(d.value, { role: 'd1', size: 100, weight: 800, tnum: true }) / 100;
  const vs = Math.round(Math.min(150, (w - pad * 2) / (nw + (d.unit ? uS * uw(d.unit) + 0.07 : 0))));
  const ny = y + pad + 44 + vs * 0.76;
  rich([{ s: d.value, role: 'd1', size: vs, weight: 800, track: -0.03, color: C.heroText, grad: C.heroGrad, tnum: true, count: [t0 + 0.3, 1.2] },
    d.unit ? { s: d.unit, font: 'disp', size: Math.round(vs * uS), weight: 700, color: C.heroText, grad: C.heroGrad, gap: vs * 0.07, caps: false } : null], cx, ny, { t, align: 'center', alpha: ka });
  text(d.label, cx, ny + 46, { role: 'small', size: 26, weight: 600, color: C.ink2, align: 'center', alpha: ka, maxW: w - pad * 2 });
  if (d.next) {
    const nx = d.next, kn = ep(t, t0 + 1.0, t0 + 1.45), fy = y + h - pad - 28;
    rich([{ s: nx.head, role: 'label', size: 19, color: C.faint },
      { s: nx.value + (nx.unit ? '\u00A0' + nx.unit : ''), font: 'disp', size: 34, weight: 800, color: nx.grey ? C.mute : C.secondText, tnum: true, gap: 14, caps: false, count: nx.grey ? null : [t0 + 1.05, 0.8] },
      { s: nx.who, role: 'small', size: 23, weight: 600, color: C.mute, gap: 14, caps: false }], cx, fy, { t, align: 'center', alpha: kn });
    const pw = pillW(nx.ev, { by: nx.by, size: 19 }); pill(cx - pw / 2, fy + 34, nx.ev, kn, { by: nx.by, size: 19 });
  }
}
function ntr_productTile(t, t0, rect) {
  const [x, y, w, h] = rect, a = ep(t, t0, t0 + 0.6, E.snap); if (a <= 0.003) return;
  demoWindow(x, y, w, h, a, { hero: true });
  if (typeof glowField === 'function') { G.save(); rrPath(x, y, w, h, 28); G.clip(); glowField(t, x + w / 2, y + h * 0.5, w * 0.5, { a: a * 0.85 }); G.restore(); }
  /* the mouse, small, turning slowly the whole time the slide is up */
  const vb = [x + 30, y + 40, w - 60, h - 140];
  ntr_prime('shell', t, vb[2], vb[3]);
  view3D('shell', t, vb[0], vb[1], vb[2], vb[3], { view: 'threeQuarter', view2d: 'right', yaw: -0.6 + 0.09 * t, pitch: 0.06, zoom: in2D(1.25, 1.2), colorway: 'black' }, { alpha: ep(t, t0 + 0.2, t0 + 0.9) });
  const ka = ep(t, t0 + 0.7, t0 + 1.2);
  text('Theseus', x + w / 2, y + h - 66, { role: 'h2', size: 40, color: C.ink, align: 'center', alpha: ka, track: 0.14 });
  const s2 = '8 kHz, wired and wireless', w2 = tw(s2, { role: 'label', size: 20 }), pw = pillW('proposal'), x2 = x + w / 2 - (w2 + 18 + pw) / 2;
  text(s2, x2, y + h - 28, { role: 'label', size: 20, color: C.mute, alpha: ka });
  pill(x2 + w2 + 18, y + h - 28, 'proposal', ka);
}
S({
  id: 'ntr_stats', ch: 'intro', theme: 'paper', title: 'Theseus, by the numbers', settle: 9, after: 'flagships', three: ['shell'],
  sfx: [[0.9, 'tick'], [1.0, 'tick'], [1.1, 'tick'], [1.2, 'tick'], [1.3, 'tick']],
  src: ['ntrRtUlxPro', 'exRtings', 'exEloshapes', 'ntrSoraDim', 'exPiaknow', 'exNbcV4', 'nbcUlx', 'usbHs', 'ntrScan'],
  draw: t => {
    header(t, 'Theseus, by the numbers');
    captions(t, [[0.6, 'The targets, one tile each. At the foot of each, in yellow, the best shipping figure I could find.']]);
    const D = ntr_statsData(), y0 = 276, y1 = 948, cell = bento(LM, y0, RM - LM, y1 - y0, 3, 2, 24);
    /* the mouse first, then the tiles round it */
    const order = [4, 1, 3, 5, 0, 2];
    D.forEach((d, i) => {
      const r = cell(i % 3, Math.floor(i / 3)), t0 = 0.3 + order.indexOf(i) * 0.14;
      if (d.product) ntr_productTile(t, t0, r); else ntr_statTile(t, t0, r, d);
    });
    /* once everything has landed, one light passes over the whole grid */
    ntr_sweep(t, 3.6, LM, y0, RM - LM, y1 - y0, { dur: 1.8, a: 0.45 });
    source(t, 'Density: 29.31 g in the Sora V2\'s 119.2 × 62.0 × 37.7 mm box, a placeholder. Next best: RTINGS\'s weight in the maker\'s box.', { t0: 2.4 });
  }
});

/* ============================== density 1: the definition, on the mouse's own box ============================== */
S({
  id: 'ntr_density', ch: 'intro', theme: 'night', title: 'Density, not weight', settle: 10, after: 'weightgap', ideas: ['weight'],
  src: ['ntrPwnTrinity', 'ntrPwnVanta', 'ntrSoraDim', 'ntrScan'],
  draw: t => {
    header(t, 'Density, not weight');
    captions(t, [[0.6, 'Weight alone rewards a small mouse. Density asks how much mouse you get for each gram.'],
      [5.4, 'Pwnage divides the grams by the box the mouse fits in, as physics does. So do I: lower is lighter for its size.']]);
    const B = ntr_shellBox(), bx = ntr_thsBox(), k = 4.2, O = [530, 505], P = ntr_iso(O, k, B);
    const c = (X, Y, Z) => P([X, Y, Z]);
    /* the corners: back bottom (hidden) b0; the box is drawn edge by edge, then the three views land on its faces */
    const b0 = c(B.x0, B.y0, B.z0), bL = c(B.x0, B.y0, B.z1), bW = c(B.x1, B.y0, B.z0), bLW = c(B.x1, B.y0, B.z1);
    const t0_ = c(B.x0, B.y1, B.z0), tL = c(B.x0, B.y1, B.z1), tW = c(B.x1, B.y1, B.z0), tLW = c(B.x1, B.y1, B.z1);
    const kE = i => ep(t, 0.5 + i * 0.12, 1.1 + i * 0.12, E.cam);
    /* hidden edges, dashed */
    for (const [p, q, i] of [[b0, bL, 0], [b0, bW, 1], [b0, t0_, 2]]) line(p[0], p[1], lerp(p[0], q[0], kE(i)), lerp(p[1], q[1], kE(i)), { color: inkA(0.28), w: 1.4, dash: [6, 6] });
    /* the glass: three faces, faintly lit, a light passing over them once */
    const kf = ep(t, 1.3, 2.1), faces = { top: [t0_, tL, tLW, tW], side: [bW, bLW, tLW, tW], end: [bL, bLW, tLW, tL] };
    if (kf > 0) {
      G.save(); G.globalAlpha = kf;
      ntr_quad(faces.top); G.fillStyle = inkA(0.05); G.fill(); ntr_quad(faces.side); G.fillStyle = inkA(0.03); G.fill(); ntr_quad(faces.end); G.fillStyle = inkA(0.04); G.fill();
      G.restore();
    }
    /* the mouse, three times: plan on the lid, the side-button side on the left face, the nose on the right face */
    ntr_onFace(t, 'top', p => P([p[0], B.y1, p[2]]), k, ep(t, 1.8, 2.6));
    ntr_onFace(t, 'right', p => P([B.x1, p[1], p[2]]), k, ep(t, 2.2, 3.0));
    ntr_onFace(t, 'front', p => P([p[0], p[1], B.z1]), k, ep(t, 2.6, 3.4));
    for (const f of ['top', 'side', 'end']) ntr_sweep(t, 3.2 + (f === 'side' ? 0.15 : f === 'end' ? 0.3 : 0), Math.min(...faces[f].map(q => q[0])), Math.min(...faces[f].map(q => q[1])), 760, 600, { path: () => ntr_quad(faces[f]), a: 0.09, dur: 1.3 });
    /* visible edges */
    const vis = [[bW, bLW], [bLW, bL], [bW, tW], [bLW, tLW], [bL, tL], [t0_, tL], [tL, tLW], [tLW, tW], [tW, t0_]];
    vis.forEach(([p, q], i) => line(p[0], p[1], lerp(p[0], q[0], kE(i + 3)), lerp(p[1], q[1], kE(i + 3)), { color: C.ink, w: 1.8, alpha: 0.9 }));
    /* the three dimensions, as published for the Sora V2 */
    dim(t, 3.4, bW, bLW, 'L ' + fmtN(bx.L, 1) + ' mm', 46);
    dim(t, 3.6, bLW, bL, 'W ' + fmtN(bx.W, 1) + ' mm', 46);
    { const kh = ep(t, 3.8, 4.4, E.snap), xh = bW[0] - 44, yb = bW[1], yt = tW[1];
      if (kh > 0) {
        line(bW[0] - 10, yb, xh - 10, yb, { color: C.mute, w: 1.2, alpha: kh }); line(tW[0] - 10, yt, xh - 10, yt, { color: C.mute, w: 1.2, alpha: kh });
        const ym = (yb + yt) / 2; line(xh, ym, xh, lerp(ym, yb, kh), { color: C.mute, w: 1.5 }); line(xh, ym, xh, lerp(ym, yt, kh), { color: C.mute, w: 1.5 });
        text('H ' + fmtN(bx.H, 1) + ' mm', xh - 16, ym + 8, { role: 'num', size: 22, weight: 700, color: C.ink, align: 'right', alpha: ep(t, 4.1, 4.5) });
      } }
    rich([{ s: 'Fig. 01', role: 'label', size: 21, color: C.mute }, { s: 'Sora V2 shape and box, a placeholder', role: 'label', size: 21, color: C.faint, gap: 16 }], LM, 318, { alpha: ep(t, 4.4, 5.0) });
    /* the sum, in the right column: mass over the box's volume */
    const fx = 1236, fw = RM - fx, a1 = ep(t, 4.2, 4.6), a2 = ep(t, 4.6, 5.0), a3 = ep(t, 5.2, 5.6);
    text('Mass', fx, 324, { role: 'label', size: 21, color: C.mute, alpha: a1 });
    rich([{ s: THS.mass, role: 'stat', size: 66, color: C.ink, tnum: true, count: [4.25, 0.8] }, { s: 'g', font: 'mono', size: 26, weight: 600, color: C.mute, gap: 8 }], fx, 400, { t, alpha: a1 });
    pill(fx, 444, 'proposal', a1, { by: 'Brock' });
    const vx = fx + 330;
    text('Volume of its box', vx, 324, { role: 'label', size: 21, color: C.mute, alpha: a2 });
    rich([{ s: fmtN(bx.v, 1), role: 'stat', size: 66, color: C.ink, tnum: true, count: [4.65, 0.8] }, { s: '{cm³}', font: 'mono', size: 26, weight: 600, color: C.mute, gap: 8 }], vx, 400, { t, alpha: a2 });
    pill(vx, 444, 'derived', a2);
    text('÷', vx - 36, 392, { font: 'disp', size: 52, weight: 700, color: C.mute, align: 'center', alpha: a2 });
    text(fmtN(bx.L, 1) + ' × ' + fmtN(bx.W, 1) + ' × ' + fmtN(bx.H, 1) + ' mm ÷ 1000', fx, 496, { font: 'mono', size: 21, weight: 500, color: C.mute, alpha: a2 });
    line(fx, 532, fx + fw * ep(t, 5.0, 5.6, E.cam), 532, { color: C.ink, w: 2 });
    text('Density', fx, 586, { role: 'label', size: 21, color: C.mute, alpha: a3 });
    pill(RM - pillW('derived'), 586, 'derived', a3);
    rich([{ s: ntr_rf(ntr_thsRho()), role: 'd1', size: 118, color: C.hero, grad: C.heroGrad, tnum: true, count: [5.25, 1.1] }, { s: 'g/cm³', font: 'mono', size: 34, weight: 600, color: C.mute, gap: 12 }], fx - 4, 696, { t, alpha: a3 });
    sourceBox(t, 6.2, fx, 752, fw, 'Pwnage', 'Its Trinity CF: 0.14 g/cm³. Its Vanta: 0.17. The average gaming mouse, by its count: 0.30.', { kind: 'claim', label: 'Maker claim', value: 'Pwnage' });
    source(t, 'Pwnage\'s volumes are length × width × height to within 1 %. Volume per gram would rank the mice the same way, upside down.', { t0: 6.6, maxW: 1080 });
  }
});

/* ============================== density 2: why it beats weight. Same grams, more mouse ============================== */
S({
  id: 'ntr_sizewt', ch: 'intro', theme: 'paper', title: 'The size–weight illusion', settle: 10, after: 'ntr_density', ideas: ['weight'],
  src: ['ntrSwi', 'ntrCharp', 'ntrPwnVanta', 'ntrX2f', 'ntrSoraDim', 'exEloshapes'],
  draw: t => {
    header(t, 'The size–weight illusion');
    const X2F = ntr_dens({ theseus: false }).find(r => r.id === 'pulsar-x2f-crazylight'), bx = ntr_thsBox(), rhoT = ntr_thsRho();
    const more = X2F ? 100 * (bx.v / X2F.v - 1) : 0;
    captions(t, [[0.6, 'Two mice that weigh the same. The Pulsar X2F is light because there is less of it: the front half of a shell.'],
      [5.6, `Theseus puts the same grams into ${fmtN(more, 0)}% more box. At equal mass, the bigger object feels lighter.`]]);
    const k = 3.45, gy = 700;
    const items = [
      { key: 'x2f', name: 'Pulsar X2F CrazyLight', g: X2F ? X2F.g : 29, ev: 'claim', by: 'Pulsar', box: X2F ? X2F.box : { L: 87.5, W: 61.1, H: 31.6, v: 168.9 }, rho: X2F ? X2F.rho : 0.1717, x: 150, t0: 1.1 },
      { key: 'ths', name: 'Theseus', g: THESEUS.mass, gs: THS.mass, ev: 'proposal', box: bx, rho: rhoT, x: 610, t0: 2.7, hero: true }
    ];
    /* the pointer brings each box in and sets it down */
    const lift = 210;
    const pos = it => { const kd = ep(t, it.t0, it.t0 + 0.8, E.cam); return { y: gy - lift * (1 - kd), kd }; };
    items.forEach(it => {
      const { y, kd } = pos(it), a = ep(t, it.t0 - 0.5, it.t0 - 0.1), B = it.box, fw = B.L * k, dxp = B.W * k * 0.5 * Math.SQRT1_2;
      ntr_shadow(it.x + fw / 2 + dxp * 0.5, gy + 6, fw * 0.62, 16, a * kd);
      ntr_cab(it.x, y, B.L, B.W, B.H, k, {
        a, edge: it.hero ? C.hero : inkA(0.62), lw: it.hero ? 2 : 1.6,
        face: it.hero ? aa => { const S0 = ntr_shellBox(); ntr_onFace(t, 'right', p => [it.x + (S0.z1 - p[2]) * k * (B.L / (S0.z1 - S0.z0)), y - (p[1] - S0.y0) * k * (B.H / (S0.y1 - S0.y0))], k, aa); } : null
      });
      /* above: the name and the weight, with its evidence */
      const ka = ep(t, it.t0 + 0.7, it.t0 + 1.1), ty = 340;
      text(it.name, it.x, ty, { role: 'h3', size: 30, weight: 800, color: it.hero ? C.heroText : C.ink, alpha: ka });
      const r = rich([{ s: it.gs || ntr_g(it.g), role: 'stat', size: 72, color: it.hero ? C.hero : C.ink, grad: it.hero ? C.heroGrad : null, tnum: true, count: [it.t0 + 0.8, 0.7] }, { s: 'g', font: 'mono', size: 26, weight: 600, color: C.mute, gap: 8 }], it.x - 3, ty + 84, { t, alpha: ka });
      pill(it.x, ty + 124, it.ev, ka, { by: it.by });
      /* under: the box and what it gives */
      const kb = ep(t, 4.3 + (it.hero ? 0.3 : 0), 4.8 + (it.hero ? 0.3 : 0)), uy = gy + 66;
      text(fmtN(B.L, 1) + ' × ' + fmtN(B.W, 1) + ' × ' + fmtN(B.H, 1) + ' mm', it.x, uy, { font: 'mono', size: 21, weight: 500, color: C.mute, alpha: kb });
      rich([{ s: fmtN(B.v, 1), font: 'mono', size: 30, weight: 700, color: C.ink, tnum: true, count: [4.4 + (it.hero ? 0.3 : 0), 0.7] }, { s: '{cm³}', font: 'mono', size: 21, weight: 600, color: C.mute, gap: 8 }], it.x, uy + 46, { t, alpha: kb });
      const kd2 = ep(t, 5.0 + (it.hero ? 0.35 : 0), 5.5 + (it.hero ? 0.35 : 0));
      const rd = rich([{ s: ntr_rf(it.rho), role: 'stat', size: 64, color: it.hero ? C.hero : C.ink2, grad: it.hero ? C.heroGrad : null, tnum: true, count: [5.05 + (it.hero ? 0.35 : 0), 0.8] }, { s: 'g/cm³', font: 'mono', size: 22, weight: 600, color: C.mute, gap: 8 }], it.x - 2, uy + 126, { t, alpha: kd2 });
      pill(it.x + rd.w + 18, uy + 126, 'derived', kd2);
    });
    const P0 = items[0], P1 = items[1], y0 = gy - lift;
    const gp = it => [it.x + it.box.L * k * 0.5, y0 - it.box.H * k * 0.5];
    cursorAt(t, [[0.7, [P0.x + 120, y0 - 260]], [1.05, gp(P0)], [1.9, [gp(P0)[0], gp(P0)[1] + lift]], [2.3, [gp(P1)[0] - 60, y0 - 160]], [2.65, gp(P1)], [3.5, [gp(P1)[0], gp(P1)[1] + lift]], [4.3, [gp(P1)[0] + 260, gp(P1)[1] + lift + 40]]], [1.05, 2.65], { a: env(t, 0.5, 0.8, 4.1, 4.4) });
    /* the ground */
    line(LM, gy + 1, 1140, gy + 1, { color: C.hair, w: 1.5, alpha: ep(t, 0.4, 0.9) });
    /* the words, in the right column */
    const cx = 1228, cw = RM - cx;
    const g1 = glossBox(t, 5.8, cx, 300, cw, 'Size–weight illusion', 'Of two things with the same mass, the smaller one feels heavier. Charpentier showed it in 1891.');
    const g2 = sourceBox(t, 6.3, cx, 300 + g1.h + 32, cw, 'Buckingham, 2014', 'The best-known weight illusion, and still not fully explained after 100 years of study. The studies lift objects: I found none on mice.');
    sourceBox(t, 6.8, cx, 300 + g1.h + g2.h + 64, cw, 'Pwnage', '"Two mouses with the same weight can feel totally different."', { kind: 'claim', label: 'Maker claim', value: 'Pwnage' });
    source(t, 'Weights: the X2F\'s is Pulsar\'s, Theseus\'s my target. Boxes: the makers\' L × W × H (EloShapes); Theseus\'s is the Sora V2\'s, a placeholder.', { t0: 5.0, maxW: 1060 });
  }
});

/* ============================== density 3: the same mice ranked by weight, then by density ============================== */
S({
  id: 'ntr_densrank', ch: 'intro', theme: 'night', title: 'Ranked by density', settle: 10, after: 'ntr_sizewt', ideas: ['weight'],
  src: ['exRtings', 'exEloshapes', 'ntrX2f', 'ntrSoraDim', 'ntrPwnTrinity'],
  draw: t => {
    header(t, 'Ranked by density');
    const R = ntr_dens({ measured: true, keep: ['pulsar-x2f-crazylight'] });
    const byW = R.slice().sort((a, b) => a.g - b.g || a.rho - b.rho), byD = R.slice().sort((a, b) => a.rho - b.rho || a.g - b.g);
    byW.forEach((r, i) => { r.rw = i; }); byD.forEach((r, i) => { r.rd = i; });
    const nb = byD.find(r => !r.hero), x2f = R.find(r => r.id === 'pulsar-x2f-crazylight'), da = R.find(r => r.id === 'razer-deathadder-v4-pro');
    if (nb) nb.ref = true; if (x2f) x2f.story = true; if (da) da.story = true;
    const ord = n => { const s = ['th', 'st', 'nd', 'rd'], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); };
    captions(t, [[0.6, `The same ${R.length} wireless mice, ranked twice: by weight on the left, by density on the right.`],
      [5.8, (x2f ? `The X2F falls from ${ord(x2f.rw + 1)} to ${ord(x2f.rd + 1)}: it is light because it is short. ` : '') + (da ? `The DeathAdder V4 Pro climbs from ${ord(da.rw + 1)} to ${ord(da.rd + 1)}.` : '')]]);
    const n = R.length, y0 = 330, y1 = 936, p = (y1 - y0) / (n - 1), xL = 560, xR = 1352, Y = i => y0 + i * p;
    const a0 = ep(t, 0.3, 0.8);
    text('By weight, lightest first', xL - 14, y0 - 40, { role: 'label', size: 21, color: C.mute, align: 'right', alpha: a0 });
    text('By density, lowest first', xR + 14, y0 - 40, { role: 'label', size: 21, color: C.mute, alpha: a0 });
    const kH = ep(t, 4.8, 5.6), lineT = r => 1.5 + r.rw * 0.09;
    /* the lines: an S from each mouse's weight rank to its density rank, drawn left to right */
    const order = R.slice().sort((a, b) => (a.hero ? 3 : a.ref ? 2 : a.story ? 1 : 0) - (b.hero ? 3 : b.ref ? 2 : b.story ? 1 : 0));
    const curve = (r, kk) => { const ya = Y(r.rw), yb = Y(r.rd), x0 = xL + 8, x1 = xR - 8, dx = x1 - x0, pts = []; const N = 48; for (let i = 0; i <= N * kk; i++) { const u = i / N, mt = 1 - u; const bx = mt * mt * mt * x0 + 3 * mt * mt * u * (x0 + dx * 0.45) + 3 * mt * u * u * (x1 - dx * 0.45) + u * u * u * x1, by = mt * mt * mt * ya + 3 * mt * mt * u * ya + 3 * mt * u * u * yb + u * u * u * yb; pts.push([bx, by]); } return pts; };
    order.forEach(r => {
      const kk = ep(t, lineT(r), lineT(r) + 1.0, E.io3); if (kk <= 0) return;
      const col = r.hero ? C.hero : r.ref ? C.second : r.story ? C.ink : C.comp, wd = r.hero ? 5 : r.ref ? 3.4 : r.story ? 2.6 : 1.6;
      const al = r.hero || r.ref || r.story ? 1 : lerp(0.95, 0.5, kH);
      poly(curve(r, kk), { color: col, w: wd, alpha: al });
    });
    /* a light runs along Theseus's line now and then */
    { const th = R.find(r => r.hero), c0 = cyc(t, 6.2, 3.2); if (th && c0 >= 0 && c0 < 0.5) { const pts = curve(th, 1), q = pts[Math.min(pts.length - 1, Math.floor(E.io3(c0 / 0.5) * (pts.length - 1)))]; glow(q[0], q[1], 26, C.hero, 0.55 * Math.sin(c0 / 0.5 * Math.PI)); } }
    /* the labels: name and weight on the left, density and name on the right, and how far each moved */
    R.forEach(r => {
      const kl = ep(t, 0.5 + r.rw * 0.05, 0.9 + r.rw * 0.05), kr = ep(t, lineT(r) + 0.8, lineT(r) + 1.2);
      const strong = r.hero || r.ref || r.story;
      const st = { role: 'small', size: 24, weight: strong ? 700 : 500, color: r.hero ? C.heroText : r.ref ? C.secondText : strong ? C.ink : C.mute };
      const ya = Y(r.rw) + 8, yb = Y(r.rd) + 8;
      text(pad2(r.rw + 1), LM, ya, { font: 'mono', size: 19, weight: 500, color: C.faint, alpha: kl });
      text(r.name, LM + 40, ya, Object.assign({ alpha: kl }, st));
      text((r.hero ? THS.mass : ntr_g(r.g)) + ' g', xL - 14, ya, { font: 'mono', size: 21, weight: strong ? 700 : 500, color: strong ? C.ink : C.mute, align: 'right', alpha: kl });
      if (r.ev !== 'measured') evDot(xL - 22 - tw((r.hero ? THS.mass : ntr_g(r.g)) + ' g', { font: 'mono', size: 21, weight: 700 }) - 6, ya - 7, r.ev, 5, kl);
      text(ntr_rf(r.rho), xR + 14, yb, { font: 'mono', size: 21, weight: strong ? 700 : 500, color: strong ? C.ink : C.mute, alpha: kr });
      text(r.name, xR + 96, yb, Object.assign({ alpha: kr }, st));
      const mv = r.rw - r.rd, ms = mv > 0 ? '▲' + mv : mv < 0 ? '▼' + (-mv) : '–';
      text(ms, RM, yb, { font: 'mono', size: 19, weight: strong ? 700 : 500, color: strong ? (mv > 0 ? C.ink : C.ink2) : C.faint, align: 'right', alpha: kr });
    });
    source(t, 'Weights: RTINGS where weighed; the X2F\'s is Pulsar\'s, Theseus\'s my target. Boxes: the makers\' L × W × H (EloShapes). Theseus: the Sora V2\'s box, a placeholder. Left out: the ULX (size not stated) and the MCHOSE L7 Ultra.', { t0: 6.0 });
  }
});
