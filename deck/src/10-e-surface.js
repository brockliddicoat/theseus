/* ============================== surface and details (chapter code srf) ==============================
   #16 baked ceramic coat, #60 etched sides, #36 #62 #61 #33 #32 the marks, #34 #82 engravings and gates,
   #84 #30 the magnesium wheel and its tread, the optical encoder; #12 #7 #67 are on the idea sheet (12-30-surface.js).
   Scan-derived numbers (Brock's Sora scan) are measured in this deck; competitor numbers carry their source. */
Object.assign(SRC, {
  srf_doc: { t: 'Brock Liddicoat, "In Pursuit of an Objectively Better Mouse": numbered ideas, reasoning and brainstorm notes (private document, with its comment thread)', u: '', n: 'Brock\'s own statements and community reports: claim-level evidence, not measurements.' },
  srf_scan: { t: 'Brock Liddicoat\'s 3D scan of a Ninjutso Sora V3 (the Sora V2 shape), 119.2 × 62.5 × 38.1 mm: sections, widths, heights and areas measured from it in this deck', u: '', n: 'Measured here from the normalized scan (refs/scan). The scan is not watertight, so areas are approximate; lengths are good to about ±0.3 mm.' },
  srf_eloPmm: { t: 'EloShapes, PMM AIM 8K review: "a ceramic-based finish designed to enhance grip on their 3D-printed plastic"; "improves grip significantly"; 20 g', u: 'https://www.eloshapes.com/mouse/review/pmm-aim-8k' },
  srf_razerScroll: { t: 'Razer scroll wheel technologies: the optical scroll wheel is "3.3 times more reliable than traditional mechanical designs" (no measure given); Viper V4 Pro, DeathAdder V4 Pro, Cobra HyperSpeed', u: 'https://www.razer.com/mena-en/technology/razer-scroll-wheels' },
  srf_tpuV4: { t: 'TechPowerUp, Razer Viper V4 Pro review: the optical scroll encoder is "arguably the best one currently available" (quoted in the deck\'s validation report)', u: 'https://www.techpowerup.com/review/razer-viper-v4-pro/' },
  srf_az31b: { t: 'Tech Steel & Materials, magnesium AZ31B-H24 plate and sheet: density 1.77 g/cc', u: 'https://www.techsteel.net/alloy/az31b-h24' },
  srf_al6061: { t: 'Protolabs CNC material data sheet, aluminum 6061-T651/T6: nominal density 2.70 Mg/m³', u: 'https://www.protolabs.com/media/h54d0gnp/2026-026-cnc-material-data-sheet_aluminum-6061-t651_t6.pdf' },
  srf_ss304: { t: 'Protolabs CNC material data sheet, stainless steel 304: density 0.285 lb/in³ (7.89 g/cm³)', u: 'https://www.protolabs.com/media/tltj24um/2026-026-cnc-material-data-sheet_stainless-steel-304.pdf' },
  srf_delrin: { t: 'Delrin 150 data sheet (Plastics International): specific gravity 1.42; water absorption 0.25% in 24 h, 0.9% at saturation; dynamic μ 0.20 (ASTM D3702)', u: 'https://www.plasticsintl.com/media/05oith4t/delrin-150-data-sheet.pdf' },
  srf_wheel3d: { t: 'This deck\'s 3D scroll wheel (3d/parts/scrollwheel.js): Ø22 × 7 mm, six spokes, 48 curved grousers, 825 mm³ of wheel, 24-slot code disc; axle held 10.8 mm apart at the encoder boss and the support', u: '', n: 'A design model built for the deck, not a measured part.' },
  srf_register: { t: 'The Register: NASA\'s Perseverance wheels have 48 gently curved treads, double Curiosity\'s 24 chevrons, to better withstand sharp rocks', u: 'https://www.theregister.com/2020/04/06/nasa_reveals_perserverance_rover_grouser_wheel_design/' },
  srf_eloEnc: { t: 'EloShapes spec sheets via research/data/mice.json: encoder type of 35 mice (optical: Razer Viper V4 Pro, DeathAdder V4 Pro; ZOWIE EC2-DW, U2-DW)', u: 'https://www.eloshapes.com/' }
});

/* ---------- shared helpers (chapter code srf) ---------- */
/** a card with a Kunai head row; returns the y where its content starts */
function srf_card(t, t0, x, y, w, h, label, ev, o = {}) {
  demoWindow(x, y, w, h, ep(t, t0, t0 + 0.45), { hero: o.hero, grid: o.grid });
  return cardHead(t, t0 + 0.1, x, y, w, label, ev || [], { color: o.color || C.ink });
}
/** a 3D shot clipped to a rounded tile */
function srf_3d(t, t0, key, x, y, w, h, st, o = {}) {
  const a = ep(t, t0, t0 + 0.5) * (o.alpha == null ? 1 : o.alpha); if (a <= 0.003) return false;
  G.save(); rrPath(x, y, w, h, o.r == null ? 12 : o.r); G.clip();
  const ok = view3D(key, t, x, y, w, h, st, { alpha: a });
  G.restore();
  return ok;
}
/* the bridge camera (3d/integration/entry.js cameraFor), replicated so 2D callouts land on the 3D: (X, Y, Z) mm → stage px.
   r is the scene's framing radius (half its bounding-box diagonal), measured from renders: shell 71.4 mm. */
const SRF_VIEWS = { top: [0, 1, 0.0001], bottom: [0, -1, 0.0001], front: [0, 0.12, 1], back: [0, 0.12, -1], left: [-1, 0.08, 0], right: [1, 0.08, 0], threeQuarter: [-0.78, 0.62, 0.95], threeQuarterRight: [0.78, 0.62, 0.95], low: [-0.9, 0.22, 0.75] };
function srf_proj(x, y, w, h, st, r, margin = 1.12) {
  if (V2D.on) { const P2 = v2dProj(st.key2d || 'shell', st, [x, y, w, h]); return (X, Y, Z) => P2([X, Y, Z]); }
  const nrm = v => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  let d = nrm(Array.isArray(st.view) ? st.view : SRF_VIEWS[st.view || 'threeQuarter']);
  const yw = st.yaw || 0; d = [d[0] * Math.cos(yw) + d[2] * Math.sin(yw), d[1], -d[0] * Math.sin(yw) + d[2] * Math.cos(yw)];
  const fov = (st.fov || 22) * Math.PI / 180, asp = w / h, T = st.target || [0, 19, 0];
  const dist = r * margin / Math.sin(fov / 2) / Math.min(1, asp) / (st.zoom || 1);
  const P = [T[0] + d[0] * dist, T[1] + d[1] * dist, T[2] + d[2] * dist];
  const up = Math.abs(d[1]) > 0.99 ? [0, 0, -Math.sign(d[1])] : [0, 1, 0], xa = nrm(cross(up, d)), ya = cross(d, xa), tf = Math.tan(fov / 2);
  return (X, Y, Z) => { const v = [X - P[0], Y - P[1], Z - P[2]], vz = -dot(v, d); return [x + w / 2 + dot(v, xa) / (vz * tf * asp) * w / 2, y + h / 2 - dot(v, ya) / (vz * tf) * h / 2]; };
}
/** the step further: the best version shipping today (a grey rule), then the Theseus step (a yellow edge). returns the y under it */
function srf_step(t, t0, x, y, w, best, step, o = {}) {
  const k1 = ep(t, t0, t0 + 0.45), k2 = ep(t, t0 + 0.9, t0 + 1.35), lh = o.lh || 33, sz = o.size || 25;
  const pillsR = (kinds, yy, a) => { let xr = x + w; for (let i = kinds.length - 1; i >= 0; i--) { xr -= pillW(kinds[i]); pill(xr, yy + 1, kinds[i], a); xr -= 10; } };
  rect(x, y - 22, 5, 30, { fill: C.comp, alpha: k1 });
  text(o.bestLabel || 'Best today', x + 20, y, { role: 'label', size: 21, color: C.mute, alpha: k1 });
  pillsR(best.ev || [], y, k1);
  const r1 = para([{ s: best.who + '. ', role: 'small', size: sz, weight: 700, color: C.ink }, { s: best.line, role: 'small', size: sz, weight: 450, color: C.ink2 }], x + 20, y + 38, { maxW: w - 20, lh, t, t0: t0 + 0.15, cps: 150, alpha: k1, maxLines: best.lines || 3 });
  const y2 = y + 38 + r1.h + (o.gap || 26);
  if (k2 > 0.003) {
    const r2l = wrap(step.line, { role: 'small', size: sz, weight: 500 }, w - 20).length;
    rect(x, y2 - 22, 5, (38 + lh * Math.min(step.lines || 3, r2l)) * E.out3(k2), { fill: C.hero });
    rich([{ s: o.stepLabel || 'Theseus', role: 'label', size: 21, color: C.onHero, chip: C.heroChip }], x + 26, y2, { alpha: k2 });
    pillsR(step.ev || ['proposal'], y2, k2);
    const r2 = para([{ s: step.line, role: 'small', size: sz, weight: 500, color: C.ink }], x + 20, y2 + 38, { maxW: w - 20, lh, t, t0: t0 + 1.05, cps: 150, alpha: k2, maxLines: step.lines || 3 });
    return y2 + 38 + r2.h;
  }
  return y2;
}
/** horizontal bars with the value at the end. rows: [{ name, sub, v, lo, hi (a range), err (± whisker), hero, ref, color, dash, ev, label }] */
function srf_bars(t, t0, o) {
  const { x, y, w } = o, rh = o.rowH || 56, lw = o.labelW || 300, vw = o.valW || 120, bx = x + lw, bw = w - lw - vw, [lo, hi] = o.xr;
  const X = v => bx + bw * clamp((v - lo) / (hi - lo)), a0 = ep(t, t0, t0 + 0.4);
  if (o.ticks) for (const v of o.ticks) { line(X(v), y - 24, X(v), y + rh * o.rows.length - 26, { color: C.hair, w: 1.2, alpha: a0 }); text(o.tfmt ? o.tfmt(v) : String(v), X(v), y + rh * o.rows.length + 4, { role: 'tick', size: 19, color: C.mute, align: 'center', alpha: a0 }); }
  o.rows.forEach((r, i) => {
    const yy = y + i * rh, d = t0 + 0.15 + i * (o.stagger || 0.12), k = ep(t, d, d + 0.8, E.snap), a = ep(t, d - 0.1, d + 0.3), bh = o.barH || 16;
    const nm = text(r.name, x, yy + 7, { role: 'small', size: o.nsize || 24, weight: r.hero || r.ref ? 800 : 600, color: C.ink, alpha: a, maxW: lw - 14 });
    if (r.sub) text(r.sub, x, yy + 32, { role: 'label', size: 19, color: r.hero ? C.heroText : C.mute, alpha: a, maxW: lw - 14 });
    rr(bx, yy - bh / 2, bw, bh, bh / 2, C.track, null, 0, a);
    const col = r.color || (r.hero ? C.hero : r.ref ? C.ink : C.comp);
    if (r.dash) { G.save(); G.globalAlpha = a; G.setLineDash([6, 5]); rrPath(bx, yy - bh / 2, (X(r.v) - bx) * k, bh, bh / 2); G.strokeStyle = r.hero ? C.heroText : C.ink2; G.lineWidth = 2; G.stroke(); G.restore(); }
    else if (r.lo != null) { const xa = X(r.lo), xb = X(lo + (r.hi - lo) * k); rr(Math.min(xa, xb), yy - bh / 2, Math.max(bh, Math.abs(xb - xa)), bh, bh / 2, col, null, 0, a); }
    else { const L = Math.max(bh, (X(r.v) - bx) * k); rr(bx, yy - bh / 2, L, bh, bh / 2, col, r.hero && TH ? '#111111' : null, 1.3, a); glint(bx, yy - bh / 2, L, bh, t, d + 3.5 + i * 0.2, 9); }
    if (r.err && k > 0.95) { const xa = X(r.v - r.err), xb = X(r.v + r.err), ka = ep(t, d + 0.8, d + 1.1); line(xa, yy, xb, yy, { color: C.ink, w: 2, alpha: ka }); line(xa, yy - 9, xa, yy + 9, { color: C.ink, w: 2, alpha: ka }); line(xb, yy - 9, xb, yy + 9, { color: C.ink, w: 2, alpha: ka }); }
    const vs = r.label != null ? r.label : fmtN(r.v, o.dec == null ? 1 : o.dec) + (o.unit ? ' ' + o.unit : '');
    const cu = r.label == null && !r.dash ? (countUp(vs, k, lo) || vs) : vs;
    text(cu, x + w, yy + 9, { font: 'mono', size: 25, weight: r.hero || r.ref ? 800 : 600, color: r.hero ? C.heroText : C.ink, align: 'right', alpha: a, tnum: true });
    if (r.ev) evDot(x + w - tw(vs, { font: 'mono', size: 25, weight: 700 }) - 16, yy, r.ev, 5, a);
  });
  return y + rh * o.rows.length;
}
/** a vessel in elevation: base centre (cx, by), height h. fired = 0 (dried clay, matte grey) to 1 (fired, dark and glazed) */
function srf_pot(cx, by, h, fired, a) {
  if (a <= 0.003) return;
  const s = h / 180, P = [[24, -180], [20, -168], [26, -150], [58, -112], [70, -74], [64, -38], [46, -8], [40, 0]];
  const path = () => { G.beginPath(); G.moveTo(cx - P[0][0] * s, by + P[0][1] * s); for (let i = 1; i < P.length; i++) G.lineTo(cx - P[i][0] * s, by + P[i][1] * s); for (let i = P.length - 1; i >= 0; i--) G.lineTo(cx + P[i][0] * s, by + P[i][1] * s); G.closePath(); };
  const smooth = () => { G.beginPath(); const L = P.map(p => [cx - p[0] * s, by + p[1] * s]), R = P.map(p => [cx + p[0] * s, by + p[1] * s]).reverse(), Q = L.concat(R); G.moveTo(Q[0][0], Q[0][1]); for (let i = 1; i < Q.length - 1; i++) { const m = [(Q[i][0] + Q[i + 1][0]) / 2, (Q[i][1] + Q[i + 1][1]) / 2]; G.quadraticCurveTo(Q[i][0], Q[i][1], m[0], m[1]); } G.lineTo(Q[Q.length - 1][0], Q[Q.length - 1][1]); G.closePath(); };
  G.save(); G.globalAlpha = a;
  const g = G.createLinearGradient(cx - 70 * s, 0, cx + 70 * s, 0);
  const c0 = mix('#C9C8C3', '#3A3B40', fired), c1 = mix('#A9A8A2', '#16171A', fired);
  g.addColorStop(0, c1); g.addColorStop(0.35, c0); g.addColorStop(1, c1);
  smooth(); G.fillStyle = g; G.fill();
  /* unfired: a dusty grain. fired: a glaze highlight down one side */
  G.save(); smooth(); G.clip();
  if (fired < 1) { const r = rng(5); G.fillStyle = `rgba(80,80,76,${0.25 * (1 - fired)})`; for (let i = 0; i < 260; i++) G.fillRect(cx - 70 * s + r() * 140 * s, by - 180 * s + r() * 180 * s, 1.6, 1.6); }
  if (fired > 0) { const hg = G.createLinearGradient(cx - 40 * s, 0, cx - 18 * s, 0); hg.addColorStop(0, 'rgba(255,255,255,0)'); hg.addColorStop(0.5, `rgba(255,255,255,${0.38 * fired})`); hg.addColorStop(1, 'rgba(255,255,255,0)'); G.fillStyle = hg; G.fillRect(cx - 44 * s, by - 160 * s, 30 * s, 150 * s); }
  G.restore();
  smooth(); G.strokeStyle = inkA(0.55); G.lineWidth = 1.5; G.stroke();
  G.beginPath(); G.ellipse(cx, by - 180 * s, 24 * s, 5 * s, 0, 0, TAU); G.fillStyle = mix('#7F7E78', '#0D0E10', fired); G.fill(); G.stroke();
  G.restore();
}
/** a graphite pencil at 45°, its tip at (x, y), drawn up and to the right */
function srf_pencil(x, y, grade, a) {
  if (a <= 0.003) return;
  G.save(); G.globalAlpha = a; G.translate(x, y); G.rotate(-Math.PI / 4);
  G.fillStyle = '#2A2B2F'; G.beginPath(); G.moveTo(0, 0); G.lineTo(14, -5); G.lineTo(14, 5); G.closePath(); G.fill();
  G.fillStyle = '#D9D8D2'; G.beginPath(); G.moveTo(14, -5); G.lineTo(34, -11); G.lineTo(34, 11); G.lineTo(14, 5); G.closePath(); G.fill();
  rr(34, -11, 150, 22, 2, '#4A4B50', null, 0, 1); rr(184, -11, 18, 22, 2, '#9DA3AE', null, 0, 1);
  G.restore();
  text(grade, x + 70, y - 82, { role: 'label', size: 21, color: C.ink2, alpha: a });
}

/* ============================== chapter card ============================== */
S({
  id: 'surfacecard', ch: 'surface', card: true, theme: 'night', title: 'Surface and details', settle: 5, three: ['shell'],
  draw: t => {
    /* the shell in the forged colourway (#12) turns slowly inside the iris */
    const cx = 1380, cy = 580, R = ep(t, 0.2, 1.4, E.cam) * 400;
    if (R > 6) {
      G.save(); G.beginPath(); G.arc(cx, cy, R - 3, 0, TAU); G.clip();
      view3D('shell', t, cx - 420, cy - 300, 840, 600, { view: 'threeQuarterRight', view2d: 'right', yaw: -0.25 + 0.22 * Math.sin(t * 0.32), zoom: in2D(1.42, 1.25), target: in2D([0, 19, 0], [0, 17, 2]), colorway: 'forged', xray: 0, explode: 0 }, { alpha: ep(t, 0.5, 1.3) });
      G.restore();
    }
    chapterCard(t, {
      name: 'surface', gloss: 'What your hand touches, and the small marks that make a mouse look finished.',
      list: [['#16', 'A baked ceramic coat'], ['#60', 'Laser-etched grip on the sides'], ['#36', 'Your serial, lasered on the right click'], ['#34', 'Engravings half as deep'], ['#84', 'A magnesium wheel, counted with light'], ['#30', 'A rover\'s tread on the wheel'], ['#12', 'Satin clear over raw carbon']]
    });
    figLabel(t, 2.2, 1040, 1000 - 22, 8, 'The forged colourway: satin clear over raw carbon-filled PP (render)');
  }
});

/* ============================== #16 bake the coating ============================== */
const srf_GRADES = ['7B', '6B', '5B', '4B', '3B', '2B', 'B', 'HB', 'F', 'H', '2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H'];
S({
  id: 'coating', ch: 'surface', theme: 'paper', title: 'Bake the coating', settle: 10, ideas: [16],
  src: ['srf_eloPmm', 'srf_doc', 'cerakoteH', 'cerakoteC', 'cerakoteGuide', 'cerakoteCure', 'radtech', 'ppSurface', 'srf_scan'],
  draw: t => {
    header(t, 'Bake the coating');
    captions(t, [[0.6, 'Soft-touch rubber wears through. A ceramic coat needs heat to reach full strength, the way a pot does in a kiln.'], [5.8, 'Cerakote measured 8H on steel at 250 °F. Plastics cure at 150 to 180 °F, so I measure it again on the shell before I claim it.']]);
    /* left: dried in air or fired, a pencil across both, then the step further */
    const lx = LM, ly = LAY.top, lw = 860, lh = 580, by = ly + 252, P1 = lx + 215, P2 = lx + lw - 215;
    srf_card(t, 0.3, lx, ly, lw, lh, 'Dried in air, or fired', ['datasheet']);
    const fire = ep(t, 1.2, 3.0);
    [[P1, 0], [P2, fire]].forEach(([px, f], i) => {
      const a = ep(t, 0.6 + i * 0.2, 1.1 + i * 0.2);
      if (i === 1 && t > 1.0) {
        /* the kiln: a bed of heat and the air shimmering above it while the pot fires */
        const hk = ep(t, 1.0, 1.4) * (1 - ep(t, 3.0, 3.8));
        G.save(); G.globalAlpha = hk; const g = G.createRadialGradient(px, by + 4, 8, px, by + 4, 130); g.addColorStop(0, rgba(C.orange, 0.5)); g.addColorStop(1, rgba(C.orange, 0)); G.fillStyle = g; G.fillRect(px - 140, by - 120, 280, 140); G.restore();
        for (let k = 0; k < 5; k++) { const ph = (t * 0.7 + k / 5) % 1, xx = px - 56 + k * 28; G.save(); G.globalAlpha = hk * (1 - ph) * 0.7; G.strokeStyle = C.orange; G.lineWidth = 2; G.beginPath(); for (let s2 = 0; s2 <= 1; s2 += 0.1) G.lineTo(xx + 5 * Math.sin(s2 * 6 + t * 3 + k), by - 8 - ph * 140 - s2 * 30); G.stroke(); G.restore(); }
      }
      srf_pot(px, by, 140, f, a);
      line(px - 110, by + 2, px + 110, by + 2, { color: C.hair, w: 2, alpha: a });
      text(i ? 'Fired in a kiln' : 'Dried in air', px, ly + 92, { role: 'label', size: 22, color: C.ink, align: 'center', alpha: a });
    });
    /* the pencil test: a 4H lead marks the air-cured film (rated 3H) and not the baked one (rated 8H) */
    const loop = t >= 11 ? ((t - 11) % 7) / 7 : -1, pk = loop >= 0 ? env(loop, 0, 0.06, 0.62, 0.72) : env(t, 3.4, 3.7, 8.2, 8.6);
    const pc = loop >= 0 ? clamp(loop / 0.6) : clamp((t - 3.7) / 4.4);
    [[P1, 1], [P2, 0]].forEach(([px, marks], i) => {
      const u = clamp(pc * 2 - i), path = s2 => [px - 46 + 92 * E.io3(s2), by - 62 + 8 * Math.sin(s2 * Math.PI)];
      const done = loop >= 0 ? 1 : (i === 0 ? u : 0);
      if (marks && done > 0) { G.save(); G.globalAlpha = 0.9; G.strokeStyle = '#6C6B66'; G.lineWidth = 3; G.lineCap = 'round'; G.beginPath(); for (let s2 = 0; s2 <= done + 1e-6; s2 += 0.02) { const q = path(Math.min(s2, done)); G.lineTo(q[0], q[1]); } G.stroke(); G.restore(); }
      if (u > 0 && u < 1) { const q = path(u); srf_pencil(q[0], q[1], i ? '' : '4H', pk); }
      const kr = ep(t, 4.6 + i * 2.2, 5.0 + i * 2.2);
      text(marks ? '4H marks it' : '4H leaves no mark', px, by + 36, { role: 'label', size: 22, color: marks ? C.red : C.good, align: 'center', alpha: kr });
    });
    [['C-299, air-cured: 3H', P1], ['H-167, oven-cured: 8H on steel', P2]].forEach(([s2, px], i) => text(s2, px, by + 70, { role: 'small', size: 24, weight: 700, color: C.ink, align: 'center', alpha: ep(t, 5.2 + i * 0.3, 5.6 + i * 0.3) }));
    rule(lx + 26, ly + 354, lx + lw - 26, ep(t, 5.8, 6.2));
    srf_step(t, 6.2, lx + 26, ly + 388, lw - 52,
      { who: 'PMM AIM 8K', line: 'Air-dried ceramic: "improves grip significantly" (EloShapes). It wore (Brock). No hardness published.', lines: 2 },
      { line: 'Baked; hardness, adhesion and mass measured on the shell.', ev: ['proposal'], lines: 1 }, { gap: 14 });
    /* right: the pencil-hardness ladder, then wear */
    const rx = 980, rw = RM - rx, ry = LAY.top;
    srf_card(t, 0.5, rx, ry, rw, lh, 'Pencil hardness, ASTM D3363', ['study', 'datasheet', 'claim']);
    const gx0 = rx + 360, gw = rw - 500, GX = i => gx0 + gw * i / 17, a0 = ep(t, 0.9, 1.4), y0 = ry + 120, rg = 64, yb = y0 + 4 * rg + 34;
    srf_GRADES.forEach((g, i) => { line(GX(i), y0 - 26, GX(i), yb - 4, { color: C.hair, w: 1, alpha: a0 }); if (i % 2 === 1) text(g, GX(i), yb + 22, { role: 'tick', size: 19, color: C.mute, align: 'center', alpha: a0 }); });
    const rows = [['Soft-touch rubber', 'RadTech 2016', 4, C.comp, '7B–3B', 'study'], ['Air-cured ceramic', 'Cerakote C-299', 11, C.comp, '3H', 'datasheet'], ['Oven-cured, on steel', 'Cerakote H-167, 250 °F', 16, C.ink, '8H', 'datasheet'], ['Elite series', 'Cerakote', 17, C.comp, '>9H', 'claim']];
    rows.forEach(([l, sub, b, col, lab, ev], i) => {
      const y = y0 + i * rg, k = ep(t, 1.2 + i * 0.25, 2.0 + i * 0.25, E.snap), al = ep(t, 1.0 + i * 0.25, 1.4 + i * 0.25);
      evDot(rx + 30, y - 6, ev, 5, al);
      text(l, rx + 46, y + 2, { role: 'small', size: 24, weight: 700, color: C.ink, alpha: al });
      text(sub, rx + 46, y + 28, { role: 'label', size: 19, color: C.mute, alpha: al });
      rr(GX(0), y - 8, Math.max(16, (GX(b) - GX(0)) * k), 16, 8, col, null, 0, al);
      text(lab, GX(b) + 14, y + 8, { font: 'mono', size: 24, weight: 800, color: C.ink, alpha: ep(t, 1.8 + i * 0.25, 2.2 + i * 0.25) });
    });
    const ty = y0 + 4 * rg, kt = ep(t, 3.0, 3.5);
    rect(rx, ty - 26, 6, 56, { fill: C.hero, alpha: kt });
    evDot(rx + 30, ty - 6, 'proposal', 5, kt);
    text('Theseus, on CF-PP', rx + 46, ty + 2, { role: 'small', size: 24, weight: 800, color: C.ink, alpha: kt });
    text('150–180 °F cure', rx + 46, ty + 28, { role: 'label', size: 19, color: C.heroText, alpha: kt });
    G.save(); G.globalAlpha = kt; G.setLineDash([6, 5]); rrPath(GX(0), ty - 8, (GX(16) - GX(0)) * ep(t, 3.2, 4.0, E.cam), 16, 8); G.strokeStyle = C.heroText; G.lineWidth = 2; G.stroke(); G.restore();
    text('Aim 8H?', GX(16) + 14, ty + 8, { font: 'mono', size: 24, weight: 800, color: C.heroText, alpha: ep(t, 3.8, 4.2) });
    text('To measure on the shell', GX(8), ty - 18, { role: 'label', size: 19, color: C.heroText, align: 'center', alpha: ep(t, 3.8, 4.2) });
    rule(rx + 26, yb + 50, rx + rw - 26, ep(t, 4.0, 4.4));
    para([{ s: 'Wear. ', role: 'small', size: 25, weight: 700, color: C.ink }, { s: 'Soft-touch wore through in 31 to 300+ rub cycles (RadTech). Cerakote claims over 8,000 Taber cycles per mil for Elite. Different tests, so no shared axis.', role: 'small', size: 25, weight: 450, color: C.ink2 }], rx + 26, yb + 92, { maxW: rw - 52, lh: 33, t, t0: 4.2, cps: 150, maxLines: 3 });
    gloss(t, 6.8, 'Pencil hardness', 'Graded pencils are pushed across the film at 45°. The rating is the hardest one that leaves no mark; 9H is the top of the scale.');
    featureCard(t, 7.2, 'A baked ceramic coat', ['datasheet', 'derived', 'proposal'], 'Oven-cured, not air-dried (#16). One 1-mil coat: 34.7 g/m² × 133 cm² of shell, 0.35 to 0.46 g, at most 1.6% of 29 g.');
  }
});

/** the step further as the slide's band: the best shipping version on the left (grey dash), the Theseus step on the right (yellow dash) */
function srf_pillsR(xr, y, kinds, a) { for (let i = kinds.length - 1; i >= 0; i--) { xr -= pillW(kinds[i]); pill(xr, y + 1, kinds[i], a); xr -= 10; } }
function srf_stepBand(t, t0, best, step) {
  const w = 820, x2 = W / 2 + 40, w2 = RM - x2;
  bandBlock(t, t0, LM, w, 'Best today', best.who, best.line, { color: C.comp, right: (y, a) => srf_pillsR(LM + w, y, best.ev || [], a) });
  bandBlock(t, t0 + 0.7, x2, w2, 'Theseus, one step further', step.who, step.line, { color: C.hero, right: (y, a) => srf_pillsR(RM, y, step.ev || ['proposal'], a) });
}

/* ============================== #60 grip where the fingers lift ============================== */
S({
  id: 'grip', ch: 'surface', theme: 'night', title: 'Grip where the fingers lift', settle: 10, ideas: [60, 'sides'],
  src: ['derler', 'srf_eloPmm', 'srf_doc'],
  draw: t => {
    header(t, 'Grip where the fingers lift');
    captions(t, [[0.6, 'Sweat cuts a fingertip\'s grip on smooth glass to 28%. On rough glass, the same sweat nearly triples it.'], [5.4, 'So I etch the coat where the fingers lift the mouse, on the sides, and leave the hump smooth so it never holds the palm.']]);
    const A = acc(), lx = LM, ly = LAY.top, lw = 960, lh = 580;
    srf_card(t, 0.3, lx, ly, lw, lh, 'Skin on glass, dry and wet', ['study']);
    /* two magnified sections: sweat floats the skin on a smooth film, drains into the pits of an etched one */
    const wet = t < 9 ? ep(t, 2.0, 3.0) : 0.5 + 0.5 * Math.cos((t - 9) * TAU / 8), s = 7.0, sy = ly + 182;
    [[lx + 40, 0, 'Smooth film'], [lx + 500, 1, 'Laser-etched film']].forEach(([px, etch, lab], i) => {
      const a = ep(t, 0.5 + i * 0.2, 1.0 + i * 0.2);
      part(px, sy, s, () => gripMM({ etch, wet, accent: A }), { alpha: a });
      text(lab, px, ly + 98, { role: 'label', size: 22, color: i ? A : C.ink, alpha: a });
      const st = wet > 0.5 ? (i ? 'Sweat drains into the pits' : 'Sweat floats the skin') : (i ? 'Dry: ridges meet the peaks' : 'Dry: full contact');
      text(st, px, sy + 96, { role: 'label', size: 21, color: wet > 0.5 ? (i ? A : C.red) : C.mute, alpha: ep(t, 1.2, 1.6) });
    });
    rule(lx + 26, ly + 304, lx + lw - 26, ep(t, 2.6, 3.0));
    srf_bars(t, 2.8, { x: lx + 26, y: ly + 356, w: lw - 52, xr: [0, 3.5], labelW: 230, valW: 130, rowH: 46, dec: 2,
      rows: [{ name: 'Smooth, dry', v: 2.18, err: 1.09 }, { name: 'Smooth, wet', v: 0.61, err: 0.37, color: C.red }, { name: 'Rough, dry', v: 0.53, err: 0.22 }, { name: 'Rough, wet', v: 1.43, err: 0.57, ref: true }].map(r => Object.assign(r, { label: 'μ ' + r.v.toFixed(2) })) });
    text('Derler & Gerhardt 2012. Glass: smooth Rz 0.05 µm, rough Rz 45 µm. Bars ± 1 SD.', lx + 26, ly + lh - 22, { role: 'label', size: 19, color: C.faint, alpha: ep(t, 3.6, 4.0) });
    /* right: how hard you squeeze to lift 29 g */
    const rx = 1064, rw = RM - rx;
    srf_card(t, 0.5, rx, ly, rw, lh, 'Squeeze to lift 29 g', ['derived']);
    text('Two fingers, each: N = m·g ÷ 2μ', rx + 26, ly + 90, { role: 'small', size: 24, color: C.mute, alpha: ep(t, 0.9, 1.3) });
    const N = u => 0.029 * 9.81 / (2 * u);
    const m = axes(t, { x: rx + 96, y: ly + 124, w: rw - 250, h: 176, xr: [0.25, 2.5], yr: [0, 0.6], xticks: [0.5, 1, 1.5, 2, 2.5], yticks: [0, 0.2, 0.4, 0.6], xfmt: v => 'μ ' + v, yfmt: v => v.toFixed(1) + ' N', t0: 1.0 });
    const pts = []; for (let u = 0.25; u <= 2.5; u += 0.02) pts.push([u, Math.min(0.6, N(u))]);
    series(m, pts, { color: C.ink2, w: 3, p: ep(t, 1.4, 2.6, E.lin) });
    [[0.61, C.red, 'Smooth, wet'], [1.43, C.ink, 'Etched, wet']].forEach(([u, col, l], i) => {
      const k = ep(t, 3.6 + i * 0.4, 4.0 + i * 0.4), v = N(u), ph = ((t - 4) % 2.4) / 2.4;
      if (t > 4.4) circle(m.X(u), m.Y(v), 10 + ph * 16, { color: col, w: 1.5, alpha: k * (1 - ph) * 0.5 });
      circle(m.X(u), m.Y(v), 8, { fill: col, alpha: k });
      circle(m.X(1.0) + 30, ly + 150 + i * 34 - 7, 7, { fill: col, alpha: k });
      rich([{ s: l, role: 'label', size: 21, color: col }, { s: v.toFixed(2) + ' N', font: 'mono', size: 24, weight: 800, color: col, gap: 12 }], m.X(1.0) + 46, ly + 150 + i * 34, { alpha: k });
    });
    keyPlan(t, 1.4, rx + rw - 74, ly + 196, { s: 0.62, hi: 'sides', label: 'Sides' });
    srf_step(t, 5.0, rx + 26, ly + 404, rw - 52,
      { who: 'PMM AIM 8K', line: 'A grippy coat everywhere, hump included.', lines: 1 },
      { line: 'Etched sides, smooth hump: grip where you lift.', ev: ['proposal'], lines: 1 }, { gap: 14 });
    gloss(t, 6.2, 'Friction coefficient', 'The sideways force a surface holds before it slips, divided by how hard you press into it. Higher means a lighter squeeze.');
    featureCard(t, 6.6, 'Laser-etched sides', ['study', 'derived', 'proposal'], 'A texture etched into the coat where the fingers lift (#60). With wet hands it asks for less than half the squeeze: 0.10 N against 0.23 N.');
  }
});

/* ============================== #36 #62 #61 #33 #32 the marks ============================== */
S({
  id: 'srf_marks', ch: 'surface', theme: 'paper', title: 'Marks you see, not feel', settle: 10, ideas: [36, 62, 61, 33, 32], three: ['shell', 'shell-sora'],
  src: ['srf_doc', 'ulxComp', 'gmk', 'srf_scan'],
  draw: t => {
    header(t, 'Marks you see, not feel');
    captions(t, [[0.6, 'Every mark is lasered after moulding, so it cuts no groove into the wall, and a new colourway is a new file, not a new tool.'], [5.6, 'And none of them sits where a fingertip rests: the serial at the back of the right click, the legends at the front corners.']]);
    const base = { colorway: 'black', xray: 0, explode: 0 };
    /* left: the top view, the Sora base wiping into Theseus */
    const lx = LM, ly = LAY.top, lw = 700, lh = 580, tv = Object.assign({ view: [0, 1, -0.15], fov: 10, zoom: 1.2, target: [0, 19, 0] }, base);
    demoWindow(lx, ly, lw, lh, ep(t, 0.3, 0.7));
    const wp = ep(t, 1.0, 3.2, E.io3), wx = lx + lw * wp;
    if (wp < 1) srf_3d(t, 0.4, 'shell-sora', lx, ly, lw, lh, tv);
    if (wp > 0) { G.save(); G.beginPath(); G.rect(lx, ly, wx - lx, lh); G.clip(); srf_3d(t, 0.4, 'shell', lx, ly, lw, lh, tv); G.restore(); }
    if (wp > 0 && wp < 1) {
      line(wx, ly + 8, wx, ly + lh - 8, { color: C.ink, w: 2 });
      rich([{ s: 'Theseus', role: 'label', size: 21, color: C.onHero, chip: C.heroChip }], wx - 14, ly + 50, { align: 'right' });
      text('Sora V2 base', wx + 14, ly + 50, { role: 'label', size: 21, color: C.mute });
    }
    const pj = srf_proj(lx, ly, lw, lh, tv, 71.4), kz = ep(t, 3.4, 3.9);
    if (kz > 0) {
      /* where the fingertips rest: the trigger centres (#32) */
      for (const sx of [1, -1]) {
        const c = pj(sx * 13, 23, 36), e1 = pj(sx * 13, 23, 50), e2 = pj(sx * 13 + 8.5, 23, 36);
        G.save(); G.globalAlpha = kz; G.setLineDash([7, 6]); G.strokeStyle = acc(); G.lineWidth = 2.5; G.beginPath(); G.ellipse(c[0], c[1], Math.abs(e2[0] - c[0]), Math.abs(e1[1] - c[1]), 0, 0, TAU); G.stroke(); G.setLineDash([]); G.fillStyle = rgba(acc(), 0.12); G.fill(); G.restore();
      }
      const ft = pj(-13, 23, 36);
      text('Fingertips rest here', ft[0] + 40, ft[1] + 6, { role: 'label', size: 21, color: acc(), alpha: kz });
    }
    const pS = pj(-15.9, 31, 13.5), pL = pj(19.2, 14.8, 50.5), pR = pj(-19.2, 14.8, 50.5);
    callout(t, 4.0, [pS[0] + 4, pS[1] + 10], 'Serial (#36)', { to: [lx + lw - 30, ly + lh - 120], side: 'l', color: C.ink, elbow: pS[0] + 60 });
    callout(t, 4.3, [pL[0], pL[1] - 6], 'LT (#62)', { to: [lx + 40, ly + 120], side: 'r', color: C.ink, elbow: lx + 100 });
    callout(t, 4.5, [pR[0], pR[1] - 6], 'RT (#62)', { to: [lx + lw - 40, ly + 120], side: 'l', color: C.ink, elbow: lx + lw - 100 });
    /* right top: the serial up close, a laser spot running over it */
    const sx0 = 810, sw = 600, sh = 300, sv = Object.assign({ view: [0, 1, -0.15], fov: 10, zoom: 6.2, target: [-15.9, 31, 14.0] }, base);
    demoWindow(sx0, ly, sw, sh, ep(t, 0.6, 1.0));
    srf_3d(t, 0.7, 'shell', sx0, ly, sw, sh, sv);
    const ps = srf_proj(sx0, ly, sw, sh, sv, 71.4), d0 = ps(-7.7, 31, 13.5), d1 = ps(-24.2, 31, 13.5), lz = (t >= 3.6 && t < 5.4) ? (t - 3.6) / 1.8 : (t >= 11 ? (((t - 11) % 8) < 1.8 ? ((t - 11) % 8) / 1.8 : -1) : -1);
    if (lz >= 0) {
      const lxp = lerp(Math.min(d0[0], d1[0]) - 6, Math.max(d0[0], d1[0]) + 6, E.io3(lz)), lyp = (d0[1] + d1[1]) / 2 + 22 * Math.sin(lz * 34);
      line(lxp, ly + 6, lxp, lyp, { color: rgba(acc(), 0.5), w: 2 });
      glow(lxp, lyp, 26, acc(), 0.55); circle(lxp, lyp, 4, { fill: '#ffffff' });
    }
    rr(sx0 + 18, ly + 18, 300, 40, 8, rgba('#FFFFFF', 0.86), null, 0, ep(t, 1.0, 1.4));
    text('Serial, right click', sx0 + 32, ly + 46, { role: 'label', size: 21, color: C.ink, alpha: ep(t, 1.0, 1.4) });
    text('3 digits, 6.4 mm tall', sx0 + sw - 22, ly + sh - 22, { role: 'label', size: 19, color: C.ink2, align: 'right', alpha: ep(t, 4.6, 5.0) });
    /* right top: the side mark, wiped in, then carried through every colourway */
    const mx0 = 1434, mw = RM - mx0, cyc0 = t >= 7 ? Math.floor((t - 7) / 1.6) % 4 : -1, cws = ['white', 'grey', 'forged', 'black'], cw = cyc0 < 0 ? 'black' : cws[cyc0];
    const mv = Object.assign({}, base, { view: 'right', fov: 10, zoom: 6.4, target: [29, 11.6, 40.5], colorway: cw });
    demoWindow(mx0, ly, mw, sh, ep(t, 0.9, 1.3));
    const mwp = ep(t, 4.6, 5.8, E.io3), mxw = mx0 + mw * mwp;
    if (mwp < 1) srf_3d(t, 1.0, 'shell-sora', mx0, ly, mw, sh, Object.assign({}, mv, { colorway: 'black' }));
    if (mwp > 0) { G.save(); G.beginPath(); G.rect(mx0, ly, mxw - mx0, sh); G.clip(); srf_3d(t, 1.0, 'shell', mx0, ly, mw, sh, mv); G.restore(); }
    if (mwp > 0 && mwp < 1) line(mxw, ly + 8, mxw, ly + sh - 8, { color: C.ink, w: 2 });
    rr(mx0 + 18, ly + 18, 220, 40, 8, rgba('#FFFFFF', 0.86), null, 0, ep(t, 1.3, 1.7));
    text('Side mark', mx0 + 32, ly + 46, { role: 'label', size: 21, color: C.ink, alpha: ep(t, 1.3, 1.7) });
    if (cyc0 >= 0) text(caps(cw) + ' colourway', mx0 + mw - 22, ly + sh - 22, { role: 'label', size: 19, color: cw === 'white' || cw === 'grey' ? C.ink : C.ink2, align: 'right' });
    /* right bottom: the step further, as a table */
    const ty = ly + sh + 24, th = LAY.bottom - ty;
    demoWindow(sx0, ty, RM - sx0, th, ep(t, 4.8, 5.2));
    compareTable(t, { x: sx0 + 26, y: ty + 46, w: RM - sx0 - 52, t0: 5.0, rowH: 82,
      cols: [{ key: 'm', label: 'Mark', w: 0.62 }, { key: 'b', label: 'Best today', w: 1.5, mono: false }, { key: 'th', label: 'Theseus', w: 1.5, mono: false, hero: true }],
      rows: [{ cells: { m: 'Serial', b: 'ULX Competition: a run of 10,000 numbered units', th: 'Three digits, lasered big on the right click' }, ev: { th: 'proposal' } },
        { cells: { m: 'Side mark', b: 'Waizowl Triaina: side engravings (per Brock)', th: 'A lasered mark per colourway, same mould' }, ev: { th: 'proposal' } }] });
    gloss(t, 6.6, 'Laser marking', 'A laser changes the colour or texture of the surface itself. A moulded engraving is a groove cut into the tool, and into every shell it makes.');
    featureCard(t, 7.0, 'Lasered marks, off the finger rests', ['proposal'], 'Serial (#36), LT and RT legends (#62), a side mark that can change per colourway (#61, #33), none on the trigger centres (#32).');
  }
});

/* ============================== #34 #82 engravings and gates ============================== */
S({
  id: 'details', ch: 'surface', theme: 'night', title: 'Engrave half as deep', settle: 10, ideas: [34, 82],
  src: ['inglis', 'fracMech', 'vernier', 'curiosity', 'srf_doc'],
  draw: t => {
    header(t, 'Engrave half as deep');
    captions(t, [[0.6, 'An engraving is a notch, and a notch multiplies stress at its tip. Half the depth takes the peak from 5 times the wall\'s stress to 3.8.'], [5.4, 'The eye catches a broken edge at 0.012 mm, a twelfth of the smallest dot it sees. So a gate mark has to be hidden, not just made small.']]);
    const A = acc(), lx = LM, ly = LAY.top, lw = 900, lh = 580;
    srf_card(t, 0.3, lx, ly, lw, lh, 'A notch in a 1.6 mm wall, under load', ['derived']);
    const a = t < 9 ? lerp(0.6, 0.3, ep(t, 3.2, 4.4, E.io3)) : lerp(0.3, 0.6, 0.5 - 0.5 * Math.cos((t - 9) * TAU / 8)), rho = 0.15;
    part(lx + 54, ly + 118, 44, () => notchMM({ depth: a, rho, accent: A }), { alpha: ep(t, 0.4, 0.9) });
    for (const dx of [0, 1]) { const x = dx ? lx + 54 + 18 * 44 + 8 : lx + 46; arrow(x, ly + 118 + 35, x + (dx ? 40 : -40), ly + 118 + 35, { color: C.ink2, w: 3, hs: 11, alpha: ep(t, 1.0, 1.4) }); }
    const kt = 1 + 2 * Math.sqrt(a / rho);
    text(`Depth ${a.toFixed(2)} mm, tip radius ${rho} mm`, lx + 54, ly + 222, { role: 'label', size: 21, color: C.mute, alpha: ep(t, 1.2, 1.6) });
    rich([{ s: 'Kt = 1 + 2√(a/ρ) =', font: 'mono', size: 24, weight: 600, color: C.mute }, { s: kt.toFixed(2), role: 'stat', size: 56, color: kt > 4.5 ? C.red : C.ink, gap: 14, tnum: true }], lx + lw - 30, ly + 274, { align: 'right', alpha: ep(t, 1.4, 1.8) });
    const m = axes(t, { x: lx + 110, y: ly + 306, w: lw - 170, h: 160, xr: [0, 0.8], yr: [1, 6], xticks: [0, 0.2, 0.4, 0.6, 0.8], yticks: [1, 2, 3, 4, 5, 6], xfmt: v => v.toFixed(1) + ' mm', yfmt: v => v + '×', xlabel: 'Engraving depth', t0: 1.6 });
    const pts = []; for (let d = 0; d <= 0.8; d += 0.01) pts.push([d, 1 + 2 * Math.sqrt(d / rho)]);
    series(m, pts, { color: C.ink2, w: 3, p: ep(t, 2.0, 3.0, E.lin) });
    for (const [d, col] of [[0.6, C.red], [0.3, A]]) { const k = ep(t, 3.0 + (d < 0.5 ? 1.4 : 0), 3.4 + (d < 0.5 ? 1.4 : 0)), v = 1 + 2 * Math.sqrt(d / rho); circle(m.X(d), m.Y(v), 7, { fill: col, alpha: k }); text(v.toFixed(2) + '×', m.X(d) + 12, m.Y(v) + (d < 0.5 ? 26 : -12), { font: 'mono', size: 22, weight: 700, color: col, alpha: k }); }
    circle(m.X(a), m.Y(kt), 12, { color: C.ink, w: 1.5, alpha: ep(t, 3.0, 3.4) * 0.6 });
    text('Half the depth: 23% less peak stress', m.X(0.3), m.Y(1.55), { role: 'small', size: 25, weight: 700, color: A, alpha: ep(t, 4.6, 5.0) });
    /* right: what the eye catches */
    const rx = 1004, rw = RM - rx;
    srf_card(t, 0.5, rx, ly, rw, lh, 'What the eye catches at 50 cm', ['study']);
    text('Drawn 400× life size', rx + rw - 26, ly + 88, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: ep(t, 1.2, 1.6) });
    const ex0 = rx + 60, ex1 = rx + rw - 60, ey = ly + 170, k1 = ep(t, 1.6, 2.2), step = 0.012 * 400;
    line(ex0, ey, lerp(ex0, (ex0 + ex1) / 2, k1), ey, { color: C.ink, w: 3 });
    if (k1 >= 1) line((ex0 + ex1) / 2, ey + step, lerp((ex0 + ex1) / 2, ex1, ep(t, 2.2, 2.8)), ey + step, { color: C.ink, w: 3 });
    rich([{ s: 'A break in an edge', role: 'small', size: 25, weight: 700, color: C.ink }, { s: '0.012 mm', font: 'mono', size: 25, weight: 800, color: A, gap: 14 }], rx + 60, ey + 52, { alpha: ep(t, 2.6, 3.0) });
    text('Vernier acuity: 2 to 5 arcseconds', rx + 60, ey + 86, { role: 'small', size: 25, color: C.mute, alpha: ep(t, 2.8, 3.2) });
    const dd = 0.145 * 400, dk = ep(t, 3.4, 3.9, E.snap), cyD = ly + 352;
    circle(rx + 60 + dd / 2, cyD, dd / 2 * dk, { fill: C.ink });
    rich([{ s: 'The smallest dot', role: 'small', size: 25, weight: 700, color: C.ink }, { s: '0.145 mm', font: 'mono', size: 25, weight: 800, color: C.ink, gap: 14 }], rx + 90 + dd, cyD - 4, { alpha: dk });
    text('Acuity: about 60 arcseconds', rx + 90 + dd, cyD + 30, { role: 'small', size: 25, color: C.mute, alpha: dk });
    rule(rx + 26, ly + 430, rx + rw - 26, ep(t, 4.4, 4.8));
    text('A gate mark breaks an edge, so it shows at a twelfth of the size of detail. It goes on a face you never see.', rx + 26, ly + 472, { role: 'small', size: 25, weight: 600, color: C.ink, t, t0: 4.6, cps: 110, maxW: rw - 200, lh: 1.36 });
    keyPlan(t, 1.0, rx + rw - 84, ly + 474, { s: 0.42, hi: ['trigL', 'trigR'], detail: { x: -13, y: -36, r: 9 }, label: 'Not here' });
    gloss(t, 6.2, 'Stress concentration', 'Load crowds around the tip of a notch. A deep, sharp notch multiplies the local stress several times over, and cracks start there.');
    featureCard(t, 6.6, 'Half-depth engravings, hidden gates', ['derived', 'study', 'proposal'], 'Engravings half as deep (#34), and gate marks moved to faces you never see, not just made smaller (#82).');
  }
});

/* ============================== #84 #30 a magnesium wheel with a rover's tread ============================== */
/** one strip of tread, unrolled: n grousers round the wheel, `kind` 'chevron' or 'curve', scrolled by off (0..1 of a pitch) */
function srf_tread(x, y, w, h, n, kind, off, col, a) {
  if (a <= 0.003) return;
  const pitch = w / (n / 4);   /* a quarter of the wheel shows */
  G.save(); G.globalAlpha = a; rrPath(x, y, w, h, 6); G.clip();
  G.fillStyle = TH ? '#E2E1DC' : '#25262A'; G.fillRect(x, y, w, h);
  G.strokeStyle = col; G.lineWidth = kind === 'chevron' ? 5 : 4; G.lineCap = 'round';
  for (let i = -2; i < n / 4 + 2; i++) {
    const x0 = x + (i + off) * pitch;
    G.beginPath();
    if (kind === 'chevron') { G.moveTo(x0, y + 6); G.lineTo(x0 + pitch * 0.42, y + h / 2); G.lineTo(x0, y + h - 6); }
    else { G.moveTo(x0, y + 6); G.quadraticCurveTo(x0 + pitch * 0.32, y + h / 2, x0, y + h - 6); }
    G.stroke();
  }
  G.restore();
  rr(x, y, w, h, 6, null, inkA(0.25), 1.2, a);
}
S({
  id: 'wheel', ch: 'surface', theme: 'paper', title: 'Magnesium, with a rover\'s tread', settle: 10, ideas: [84, 30], three: ['wheel'],
  src: ['srf_register', 'curiosity', 'srf_wheel3d', 'srf_az31b', 'srf_al6061', 'srf_ss304', 'srf_delrin', 'exXbabWeight', 'srf_doc'],
  draw: t => {
    header(t, 'Magnesium, with a rover\'s tread');
    captions(t, [[0.6, 'Curiosity\'s 24 chevron treads cracked on sharp rock. Perseverance rolls on 48 gently curved ones, and so does this wheel.'], [5.6, 'Magnesium is the lightest metal for it: the same wheel in aluminium would weigh 53% more, in stainless steel four times as much.']]);
    const lx = LM, ly = LAY.top, lw = 900, lh = 580;
    demoWindow(lx, ly, lw, lh, ep(t, 0.3, 0.7));
    const wv = { view: [0.55, 0.45, 0.9], zoom: 1.75, scroll: 0.22 * t, xray: 0, explode: 0.3 * env(t, 1.6, 2.6, 4.2, 5.2) };
    const pt = { g: [lx + 520, ly + 180], sp: [lx + 470, ly + 360], cr: [lx + 400, ly + 250], ax: [lx + 560, ly + 300] };
    if (V2D.on) {
      /* two views of one wheel: from the side (the spokes and the treads, turning) and from the front (the crown, the axle) */
      const sb = [lx + 24, ly + 84, 380, 440], fb = [lx + 396, ly + 84, 236, 440];
      const sv = Object.assign({}, wv, { view2d: 'right', zoom: 1.34, target: [0, 11, 0], explode: 0, hide2d: /encoder|support/ }), fv = Object.assign({}, wv, { view2d: 'front', zoom: 1.32, target: [-1.85, 11, 0] });
      srf_3d(t, 0.4, 'wheel', sb[0], sb[1], sb[2], sb[3], sv);
      srf_3d(t, 0.6, 'wheel', fb[0], fb[1], fb[2], fb[3], fv);
      const k = ep(t, 0.6, 1.0);
      text('Side', sb[0] + sb[2] / 2, sb[1] + sb[3] + 22, { role: 'label', size: 19, color: C.faint, align: 'center', alpha: k });
      text('Front', fb[0] + fb[2] / 2, fb[1] + fb[3] + 22, { role: 'label', size: 19, color: C.faint, align: 'center', alpha: k });
      pt.g = v2dAt('wheel', sv, sb, /wheel\/grousers$/, [0.5, 1, 0.5]) || pt.g; pt.sp = v2dAt('wheel', sv, sb, /wheel\/web$/, [0.5, 0.3, 0.5]) || pt.sp;
      pt.cr = v2dAt('wheel', fv, fb, /wheel\/tread$/, [0.5, 1, 0.5]) || pt.cr; pt.ax = v2dAt('wheel', fv, fb, /axle\/axleR$/, [0.5, 0.5, 0.5]) || pt.ax;
    } else srf_3d(t, 0.4, 'wheel', lx, ly, lw, lh, wv);
    rich([{ s: 'Fig. 01', role: 'label', size: 21, color: C.mute }, { s: V2D.on ? 'Magnesium wheel and POM axle, two views' : 'Magnesium wheel, POM axle, optical encoder (render)', role: 'small', size: 24, color: C.faint, gap: 16 }], lx + 26, ly + 46, { alpha: ep(t, 0.6, 1.0) });
    callout(t, 2.0, pt.g, '48 curved grousers', { to: [lx + 610, ly + 120], side: 'r', color: C.ink });
    callout(t, 2.4, pt.sp, 'Six spokes', { to: [lx + 648, ly + 420], side: 'r', color: C.ink, sub: 'Triangular windows' });
    callout(t, 2.8, pt.cr, 'Crown, R 11 mm both ways', { to: in2D([lx + 648, ly + 220], [lx + 60, ly + 140]), side: 'r', color: C.ink, prose: true, maxW: in2D(220, 260) });
    callout(t, 3.2, pt.ax, 'POM axle', { to: [lx + 648, ly + 330], side: 'r', color: C.ink });
    /* right top: rover treads, unrolled */
    const rx = 1004, rw = RM - rx, th = 262;
    srf_card(t, 0.5, rx, ly, rw, th, 'Rover treads, unrolled', ['datasheet']);
    const sx = rx + 250, swd = rw - 276, rowsT = [['Curiosity', '24 chevrons', 24, 'chevron', C.comp], ['Perseverance', '48 curved', 48, 'curve', C.ink], ['Theseus wheel', '48 curved', 48, 'curve', C.hero]];
    rowsT.forEach(([nm, sub, n, kind, col], i) => {
      const y = ly + 92 + i * 56, a = ep(t, 1.0 + i * 0.3, 1.4 + i * 0.3);
      if (i === 2) rect(rx, y - 6, 6, 50, { fill: C.hero, alpha: a });
      text(nm, rx + 26, y + 18, { role: 'small', size: 24, weight: i === 2 ? 800 : 700, color: C.ink, alpha: a });
      text(sub, rx + 26, y + 42, { role: 'label', size: 19, color: i === 2 ? C.heroText : C.mute, alpha: a });
      srf_tread(sx, y, swd, 44, n, kind, (t * 0.35) % 1, i === 2 ? (TH ? '#9A9890' : '#C9C8C2') : col, a);
      if (i === 2) rr(sx, y, swd, 44, 6, null, C.hero, 2.5, a);
    });
    /* right bottom: the same wheel in other materials */
    const my = ly + th + 24, mh = LAY.bottom - my;
    srf_card(t, 0.8, rx, my, rw, mh, 'This wheel, by material', ['derived']);
    text('825 mm³ × density', rx + 26, my + 84, { role: 'small', size: 24, color: C.mute, alpha: ep(t, 1.2, 1.6) });
    const V = 0.825, mats = [['POM', 'Delrin 150, 1.42', 1.42], ['Magnesium AZ31B', '1.77 g/cm³', 1.77, true], ['Aluminium 6061', '2.70 g/cm³', 2.70], ['Stainless 304', '7.89 g/cm³', 7.89]];
    const yEnd = srf_bars(t, 1.6, { x: rx + 26, y: my + 132, w: rw - 52, xr: [0, 7], labelW: 280, valW: 110, rowH: 44, dec: 2, unit: 'g',
      rows: mats.map(([n, s2, d, hero]) => ({ name: n, v: V * d, hero, label: fmtN(V * d, 2) + ' g' })) });
    const kx = ep(t, 3.4, 3.8), bx = rx + 26 + 280, bw = rw - 52 - 280 - 110, xx = bx + bw * 0.931 / 7;
    line(xx, my + 104, xx, yEnd - 14, { color: C.ink, w: 2, dash: [5, 4], alpha: kx });
    text('XA25 wheel, weighed: 0.931 g', xx + 10, my + 106, { role: 'label', size: 19, color: C.ink, alpha: kx });
    srf_stepBand(t, 6.4, { who: 'Metal wheels', line: 'All high-end mice have one now (Brock), and some add a rubber ring over the metal for grip.' },
      { who: 'Magnesium, tread and ceramic', line: 'The grousers and a ceramic coat grip, so there is no rubber to wear. Weighed and slip-tested wet and dry before I publish it.', ev: ['proposal'] });
  }
});

/* ============================== the optical encoder ============================== */
/** wheel angle (rad) over time: up for 6 s, back down for 6 s */
const srf_scrollAt = t => { const p = ((t % 12) + 12) % 12; return 0.55 * (p < 6 ? p : 12 - p); };
S({
  id: 'srf_encoder', ch: 'surface', theme: 'night', title: 'Count the steps with light', settle: 10, ideas: ['encoder', 84], three: ['wheel'],
  src: ['srf_razerScroll', 'srf_tpuV4', 'pulsarEnc', 'srf_eloEnc', 'srf_wheel3d'],
  draw: t => {
    header(t, 'Count the steps with light');
    captions(t, [[0.6, 'A mechanical encoder counts with sliding contacts, and dust or a spill makes them skip. An optical one counts with light, and nothing touches.'], [5.4, 'Four of the 35 mice in my data use one: two Razers, two ZOWIEs. Razer calls its own 3.3 times more reliable, without saying how it measured that.']]);
    const A = acc(), lx = LM, ly = LAY.top, lw = 1000, lh = 580, th = srf_scrollAt(t);
    demoWindow(lx, ly, lw, lh, ep(t, 0.3, 0.7));
    const ev = { view: [-0.35, 0.32, 1], target: [-5.5, 10.5, 0], zoom: 2.25, scroll: th, xray: ep(t, 0.8, 2.0), explode: 0 };
    srf_3d(t, 0.4, 'wheel', lx, ly, lw, lh, ev);
    text('X-ray, encoder side', lx + 26, ly + 46, { role: 'label', size: 21, color: C.mute, alpha: ep(t, 0.6, 1.0) });
    const eb = [lx, ly, lw, lh], ea = (re, f, p) => (V2D.on && v2dAt('wheel', ev, eb, re, f)) || p;
    callout(t, 2.2, ea(/emitter\/emitterBody$/, [0.5, 0.5, 0.5], [lx + 300, ly + 250]), 'IR emitter', { to: [lx + 120, ly + 150], side: 'r', color: C.ink });
    callout(t, 2.5, ea(/encoderRotor\/disc$/, [0.5, 0.12, 0.5], [lx + 330, ly + 330]), 'Code disc, 24 slots', { to: [lx + 90, ly + 430], side: 'r', color: C.ink });
    callout(t, 2.8, ea(/detector\/detectorBody$/, [0.5, 0.5, 0.5], [lx + 420, ly + 270]), 'Detectors A and B', { to: [lx + 560, ly + 120], side: 'r', color: C.ink });
    callout(t, 3.1, ea(/axle\/axleR$/, [0.6, 0.5, 0.5], [lx + 520, ly + 360]), 'POM axle', { to: [lx + 760, ly + 500], side: 'r', color: C.ink });
    /* right top: the two light gates, a quarter-step apart, as a logic trace */
    const rx = 1104, rw = RM - rx, sh = 270;
    srf_card(t, 0.6, rx, ly, rw, sh, 'Two light gates, a quarter-step apart', ['derived']);
    const deg = 180 / Math.PI, slot = 15, gA = a => (((a % slot) + slot) % slot) < slot / 2 ? 1 : 0, gB = a => gA(a - slot / 4);
    const x0 = rx + 76, x1 = rx + rw - 30, N = 180, win = 3.0, ka = ep(t, 1.2, 1.6);
    [['A', gA, 0], ['B', gB, 1]].forEach(([nm, fn, i]) => {
      const yb = ly + 150 + i * 70, hh = 36;
      text(nm, rx + 30, yb - 6, { font: 'mono', size: 24, weight: 800, color: i ? C.ink : A, alpha: ka });
      G.save(); G.globalAlpha = ka; G.strokeStyle = i ? C.ink : A; G.lineWidth = 3; G.beginPath();
      for (let j = 0; j <= N; j++) { const tt = t - win + win * j / N, v = fn(srf_scrollAt(Math.max(0, tt)) * deg), xx = lerp(x0, x1, j / N), yy = yb - v * hh; j ? G.lineTo(xx, yy) : G.moveTo(xx, yy); }
      G.stroke(); G.restore();
    });
    const stepN = Math.floor(th * deg / slot), up = ((t % 12) + 12) % 12 < 6;
    rich([{ s: 'Step', role: 'label', size: 21, color: C.mute }, { s: String(stepN).padStart(2, '0'), font: 'mono', size: 30, weight: 800, color: C.ink, gap: 12, tnum: true }, { s: up ? 'A leads: up' : 'B leads: down', role: 'label', size: 21, color: A, gap: 24 }], rx + 30, ly + sh - 28, { alpha: ka });
    /* right bottom: 35 mice by encoder */
    const my = ly + sh + 24, mh = LAY.bottom - my;
    srf_card(t, 0.9, rx, my, rw, mh, '35 mice, by encoder', ['datasheet']);
    const mice = ((RD.mice || {}).mice || []), opt = mice.filter(m => /optical/i.test(String(rv(m.encoder)))), n = mice.length || 35;
    const cols = 7, gx = rx + 40, gy = my + 104, sp = 34;
    for (let i = 0; i < n; i++) { const c = i % cols, r = Math.floor(i / cols), k = ep(t, 1.4 + i * 0.03, 1.8 + i * 0.03), X = gx + c * sp, Y = gy + r * sp; if (i < opt.length) circle(X, Y, 11 * k, { fill: C.ink }); else circle(X, Y, 10 * k, { color: C.comp, w: 2.5 }); }
    const tx = gx + cols * sp + 30, kt = ep(t, 2.6, 3.0);
    rich([{ s: String(opt.length || 4), font: 'mono', size: 30, weight: 800, color: C.ink }, { s: 'optical', role: 'label', size: 21, color: C.ink, gap: 12 }], tx, gy + 6, { alpha: kt });
    text(opt.map(m => exShort(m.name).replace('Razer ', '').replace('ZOWIE ', '')).join(', ') || 'Viper V4 Pro, DeathAdder V4 Pro, EC2-DW, U2-DW', tx, gy + 40, { role: 'small', size: 24, color: C.ink2, maxW: RM - tx - 26, lh: 1.3, alpha: kt });
    rich([{ s: String(n - opt.length), font: 'mono', size: 30, weight: 800, color: C.ink2 }, { s: 'mechanical', role: 'label', size: 21, color: C.mute, gap: 12 }], tx, gy + 128, { alpha: ep(t, 2.9, 3.3) });
    srf_stepBand(t, 6.2, { who: 'Razer optical wheel', line: '"3.3 times more reliable than traditional mechanical designs", with no measure given. TechPowerUp: "arguably the best one currently available".', ev: ['claim'] },
      { who: 'Optical, sealed, published', line: 'An optical encoder in a closed wheel bay on a POM axle, with its detent torque and its missed steps after a dust test published.', ev: ['proposal'] });
  }
});
