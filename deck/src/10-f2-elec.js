/* ============================================================================================
   ELECTRONICS, the leads (chapter code elc): braided wires instead of a ribbon cable (#51, #69).
   Brock: three benefits, each its own simulation, each zoomed in on the part itself:
     elc_tear  the tear: a nicked film against three strands that share the pull
     elc_twist the noise: a pair's loop, and the twist that flips it every half turn
     elc_lay   how tight: the lay that cancels the noise against the copper it adds (Brock's caveat, #69)
     elc_flex  the bend: a crease against fine strands
   They follow elc_oneside. The lead is drawn at about 30 px per mm; every number is sourced or derived on the slide.
   ============================================================================================ */
Object.assign(SRC, {
  elcKapton: { t: 'DuPont Kapton HN polyimide film datasheet (copy hosted by Epec): 25 µm film, tensile strength 231 MPa (ASTM D882); tear strength initial (Graves, ASTM D1004) 7.2 N, propagating (Elmendorf, ASTM D1922) 0.07 N; MIT folding endurance 285,000 cycles (ASTM D2176); 1.42 g/cm³', u: 'https://www.epectec.com/downloads/DuPont-Kapton-HN-Polyimide-Film.pdf' },
  elcCu: { t: 'MakeItFrom, annealed (OS050) C11000 copper: ultimate tensile strength 220 MPa, elongation at break 50%, density 9.0 g/cm³', u: 'https://www.makeitfrom.com/material-properties/Annealed-OS050-C11000-Copper' },
  elcKlipec: { t: 'Klipec, "Reducing Electrical Noise in Instrument Circuits", IEEE Transactions on Industry and General Applications IGA-3(2), 1967: parallel wires in 1-inch steel conduit cut magnetic noise pickup by 27 dB; a pair twisted to a 2-inch lay was about five to six times more effective; shorter lays reject more, but the gain flattens, and 2 inches was about optimum for cost and rejection', u: 'https://www.jms-se.com/uploads/Reducing_Electrical_Noise_in_Instrument_Circuits.pdf' },
  elcNasaTem: { t: 'Bradley, Evans, Reed, Shimp, Fitzpatrick (NASA Langley), "TEM Cell Testing of Cable Noise Reduction Techniques from 2 MHz to 200 MHz, Part 1": with a dedicated return wire already run beside it, twisting the pair added little (about 0.4 dB below 20 MHz, and it measured worse at 100 to 200 MHz)', u: 'https://ntrs.nasa.gov/api/citations/20080021261/downloads/20080021261.pdf' },
  elcAlexander: { t: 'Alexander (Surprenant Mfg.), "Fatigue Life of Stranded Hook-Up Wire", 1953 (DTIC AD0656334), Table IX: #18 AWG vinyl hook-up wire on a rotating-bar machine, one cycle a 90° bend each way: 7 strands of #26, 351 cycles; 19 of #30, 874; 65 of #36, 2,892; 105 of #38, 2,908 (averages of at least six)', u: 'https://apps.dtic.mil/sti/pdfs/AD0656334.pdf' },
  elcShengyi: { t: 'Shengyi SF202 adhesiveless flexible copper-clad laminate datasheet: MIT folding endurance at R 0.38 mm, 4.9 N: at least 80 cycles (12.5 µm polyimide, 12 µm electrodeposited copper), at least 50 (25 µm polyimide, 12 µm copper)', u: 'https://a-contract.ru/fileadmin/datasheets/base-material/SF202.pdf' },
  elcAwg: { t: 'American Wire Gauge: d = 0.127 mm × 92^((36 − n) / 39); 32 AWG is 0.202 mm (0.0320 mm²), 40 AWG 0.0799 mm', u: 'https://en.wikipedia.org/wiki/American_wire_gauge' }
});

/* ---------- the model's numbers, in one place ---------- */
const ELB = {
  awg32: 0.0320,           /* mm², one 32 AWG conductor (elcAwg) */
  cuUts: 220,              /* MPa, annealed copper (elcCu) */
  cuRho: 9.0,              /* g/cm³ = mg/mm³ (elcCu) */
  leadL: 60,               /* mm, one lead, representative (the 3D layout's leads run 40 to 60 mm) */
  wires: 3,                /* per lead: VBAT, NTC, GND / SB5, SB4, GND (the 3D layout) */
  rHelix: 0.231,           /* mm, three 0.4 mm wires twisted: each centre 0.4 / √3 from the lead's axis */
  rPair: 0.2,              /* mm, a pair of 0.4 mm wires: half their spacing */
  h: 5,                    /* mm, the noise source's distance from the lead in the noise model */
  lay: 6                   /* mm, the lay Theseus proposes */
};
ELB.wireN = ELB.cuUts * ELB.awg32;                                       /* ≈ 7.0 N to break one conductor */
ELB.cuMg = 2 * ELB.wires * ELB.leadL * ELB.awg32 * ELB.cuRho;           /* both leads' copper, ≈ 104 mg */
/** extra length (and copper) of a twisted wire: a helix of radius r and lay p is √(1 + (2πr/p)²) times the lead */
const elc_takeup = (p, r = ELB.rHelix) => Math.sqrt(1 + Math.pow(TAU * r / p, 2)) - 1;
/** the noise a twisted pair still picks up, against an untwisted pair, from a source h mm to the side of a lead of
   length L, at xs along it: the source's normal field falls as (1 + (u/h)²)^-3/2 (a flat coil lying beside the lead); the
   pair's loop flips sign every half lay, so its pickup is the field's Fourier component at the lay. Worst case over the
   twist's phase. Returns the ratio (1 = no help) */
function elc_reject(p, h = ELB.h, L = ELB.leadL, xs = L / 2) {
  const n = 900, dx = L / n, k = TAU / p; let par = 0, re = 0, im = 0;
  for (let i = 0; i < n; i++) { const x = (i + 0.5) * dx, b = Math.pow(1 + Math.pow((x - xs) / h, 2), -1.5); par += b; re += b * Math.cos(k * x); im += b * Math.sin(k * x); }
  return Math.hypot(re, im) / par;
}
const elc_dB = r => 20 * Math.log10(Math.max(1e-9, r));
const ELB_REJ = new Map();
const elc_rejDB = p => { const key = Math.round(p * 200); if (!ELB_REJ.has(key)) ELB_REJ.set(key, elc_dB(elc_reject(key / 200))); return ELB_REJ.get(key); };

/* ---------- drawing the leads, zoomed in ---------- */
/** a slice of the one board, edge-on to the reader: a dark slab with gold pads (a board is dark in both themes) */
function elc_slab(x, y, w, h, a = 1, o = {}) {
  if (a <= 0.003) return;
  G.save(); G.globalAlpha = a;
  const g = G.createLinearGradient(x, y, x + w, y + h); g.addColorStop(0, '#22252B'); g.addColorStop(1, '#121317');
  rrPath(x, y, w, h, 18); G.fillStyle = g; G.fill();
  G.strokeStyle = 'rgba(255,255,255,0.08)'; G.lineWidth = 1.5; G.stroke();
  /* copper routes under the mask, faint */
  G.strokeStyle = 'rgba(214,170,92,0.16)'; G.lineWidth = 3;
  for (const yy of o.routes || []) { G.beginPath(); G.moveTo(x + 22, yy + 30); G.lineTo(x + w * 0.5, yy + 30); G.lineTo(x + w - 18, yy); G.stroke(); }
  G.fillStyle = 'rgba(222,183,96,0.55)';
  for (let i = 0; i < 6; i++) { G.beginPath(); G.arc(x + 30 + (i % 2) * 34, y + 40 + i * ((h - 80) / 5), 5, 0, TAU); G.fill(); }
  G.restore();
}
/** the three strands of a braided lead, side-on, back strands first, each glossy and tinted by the load it carries.
   x0..x1 along the lead, yc its axis, A the helix radius (px), p its lay (px), d a strand's thickness (px).
   o = { phase, heat: [3 loads, 0..1], cut: { i, x, gap }, alpha, sweep (x of a light that runs along it), end (taper the
   ends into a sleeve), cols } */
function elc_braid(x0, x1, yc, A, p, d, o = {}) {
  const a = o.alpha == null ? 1 : o.alpha; if (a <= 0.003 || x1 <= x0) return;
  const ph = o.phase || 0, step = 2.5;
  const cols = o.cols || (TH ? ['#2F3035', '#D9D6CE', '#8E8B84'] : ['#6A6B70', '#E4E2DC', '#A3A19A']);
  G.save(); G.globalAlpha = a; G.lineCap = 'butt';
  for (let x = x0; x < x1; x += step) {
    const xe = Math.min(x1, x + step + 0.8), segs = [];
    for (let i = 0; i < 3; i++) {
      if (o.cut && o.cut.i === i && xe > o.cut.x - o.cut.gap / 2 && x < o.cut.x + o.cut.gap / 2) continue;
      const q0 = TAU * (x - x0) / p + ph + i * TAU / 3, q1 = TAU * (xe - x0) / p + ph + i * TAU / 3;
      segs.push({ i, z: Math.cos((q0 + q1) / 2), y0: yc + A * Math.sin(q0), y1: yc + A * Math.sin(q1) });
    }
    segs.sort((u, v) => u.z - v.z);
    const sw = o.sweep == null ? 0 : Math.exp(-Math.pow((x - o.sweep) / 70, 2));
    for (const s of segs) {
      const hk = o.heat ? o.heat[s.i] : 0, near = (s.z + 1) / 2;
      const base = mix(cols[s.i], heatCol(hk), clamp(hk * 1.6) * 0.85), col = mix(base, TH ? '#101114' : '#050506', (1 - near) * 0.32);
      G.strokeStyle = col; G.lineWidth = d; G.beginPath(); G.moveTo(x, s.y0); G.lineTo(xe, s.y1); G.stroke();
      G.strokeStyle = `rgba(255,255,255,${(0.08 + 0.26 * near) * (1 + 1.6 * sw)})`; G.lineWidth = d * 0.26;
      G.beginPath(); G.moveTo(x, s.y0 - d * 0.24); G.lineTo(xe, s.y1 - d * 0.24); G.stroke();
    }
  }
  /* a cut strand shows its copper at both ends */
  if (o.cut && o.cut.gap > 1) {
    const i = o.cut.i;
    for (const sx of [o.cut.x - o.cut.gap / 2, o.cut.x + o.cut.gap / 2]) {
      const q = TAU * (sx - x0) / p + ph + i * TAU / 3, sy = yc + A * Math.sin(q);
      G.fillStyle = '#C98A4E'; G.beginPath(); G.ellipse(sx, sy, d * 0.22, d * 0.42, 0, 0, TAU); G.fill();
      G.fillStyle = 'rgba(255,230,190,0.7)'; G.beginPath(); G.arc(sx, sy - d * 0.12, d * 0.12, 0, TAU); G.fill();
    }
  }
  G.restore();
}
/** y of strand i of a braid at x (same parameters as elc_braid) */
const elc_strandY = (x, x0, yc, A, p, i, ph = 0) => yc + A * Math.sin(TAU * (x - x0) / p + ph + i * TAU / 3);
/** a ribbon cable (FPC) from above, zoomed in: a film of N load paths across its width, three copper traces, each part
   tinted by its load. The nick sits on the top edge at xn and has torn k of the N paths; Kt sets how hard the tip works.
   o = { N, k, xn, load (0..1, the nominal heat), Kt, dy (the free end lifted, px), alpha, x1 (its free end), tab } */
function elc_ribbon(x0, x1, yc, w, o) {
  const a = o.alpha == null ? 1 : o.alpha; if (a <= 0.003) return;
  const N = o.N || 24, rh = w / N, top = yc - w / 2, dy = o.dy || 0, xn = o.xn, k = o.k || 0;
  const Y = (x, y) => y + dy * clamp((x - x0) / (x1 - x0));
  G.save(); G.globalAlpha = a;
  /* the film: a warm translucent amber, the copper laid in it */
  const tipY = top + k * rh;
  for (let x = x0; x < x1; x += 6) {
    const xe = Math.min(x1, x + 6.6);
    for (let j = 0; j < N; j++) {
      const y = top + j * rh, torn = j < k && x >= xn - 2;
      let heat;
      if (torn) heat = (o.load || 0) * 0.1 * (1 - Math.exp(-Math.abs(x - xn) / 60));
      else { const dd = Math.hypot(x + 3 - xn, (y + rh / 2) - tipY); heat = (o.load || 0) * 0.1 * (1 + ((o.Kt || 1) - 1) * Math.exp(-dd / 16)); }
      G.fillStyle = mix(TH ? '#E9DCC3' : '#4A3F2C', heatCol(heat), clamp(heat * 2.2));
      G.fillRect(x, Y(x, y), xe - x, rh + 0.6);
    }
  }
  /* copper traces, cut where the tear has passed them */
  for (const j of [5, 12, 19]) {
    const yy = top + (j + 0.5) * rh, cut = j < k;
    G.strokeStyle = '#C98A4E'; G.lineWidth = rh * 1.3; G.lineCap = 'butt';
    G.beginPath(); G.moveTo(x0, Y(x0, yy)); G.lineTo(cut ? xn - 3 : x1, Y(cut ? xn - 3 : x1, yy)); G.stroke();
    if (cut) { G.beginPath(); G.moveTo(xn + 3, Y(xn + 3, yy)); G.lineTo(x1, Y(x1, yy)); G.stroke(); }
    G.strokeStyle = 'rgba(255,236,200,0.35)'; G.lineWidth = rh * 0.35; G.beginPath(); G.moveTo(x0, Y(x0, yy) - rh * 0.3); G.lineTo(x1, Y(x1, yy) - rh * 0.3); G.stroke();
  }
  /* edges */
  G.strokeStyle = TH ? 'rgba(120,84,30,0.55)' : 'rgba(255,214,150,0.35)'; G.lineWidth = 1.5;
  G.beginPath(); G.moveTo(x0, Y(x0, top)); G.lineTo(x1, Y(x1, top)); G.moveTo(x0, Y(x0, top + w)); G.lineTo(x1, Y(x1, top + w)); G.stroke();
  /* the tear: an open V from the edge to its tip, the tile's own surface showing through */
  if (k > 0) {
    const open = 2 + 7 * (k / N);
    G.fillStyle = C.panel; G.beginPath(); G.moveTo(xn - open, Y(xn, top) - 2); G.lineTo(xn + open, Y(xn, top) - 2); G.lineTo(xn + 0.8, Y(xn, tipY)); G.lineTo(xn - 0.8, Y(xn, tipY)); G.closePath(); G.fill();
    G.strokeStyle = C.bad; G.lineWidth = 1.5; G.beginPath(); G.moveTo(xn - open, Y(xn, top)); G.lineTo(xn, Y(xn, tipY)); G.lineTo(xn + open, Y(xn, top)); G.stroke();
  }
  G.restore();
}
/** a connector on the board edge: 'zif' (an FPC latch) or 'jst' (a JST SH housing), at its mouth (x, y) */
function elc_conn(x, y, kind, a = 1, h = 112) {
  if (a <= 0.003) return;
  G.save(); G.globalAlpha = a;
  if (kind === 'zif') {
    const g = G.createLinearGradient(x - 46, 0, x, 0); g.addColorStop(0, '#3A3C42'); g.addColorStop(1, '#202226');
    rrPath(x - 46, y - h / 2, 46, h, 6); G.fillStyle = g; G.fill();
    rrPath(x - 16, y - h / 2 - 6, 18, h + 12, 4); G.fillStyle = '#5B5E66'; G.fill();
    G.fillStyle = 'rgba(222,183,96,0.7)'; for (let i = 0; i < 6; i++) G.fillRect(x - 40, y - h / 2 + 10 + i * (h - 20) / 5.4, 14, 4);
  } else {
    const g = G.createLinearGradient(x - 50, 0, x, 0); g.addColorStop(0, '#F2EEE4'); g.addColorStop(1, '#D8D2C4');
    rrPath(x - 50, y - 26, 50, 52, 6); G.fillStyle = g; G.fill(); G.strokeStyle = 'rgba(0,0,0,0.25)'; G.lineWidth = 1.2; G.stroke();
    G.fillStyle = 'rgba(0,0,0,0.18)'; G.fillRect(x - 44, y - 14, 30, 28);
  }
  G.restore();
}
/** a heat-shrink sleeve that gathers a braid's end: the bit the pointer holds */
function elc_sleeve(x, y, w, h, a = 1) {
  if (a <= 0.003) return;
  const g = G.createLinearGradient(0, y - h / 2, 0, y + h / 2); g.addColorStop(0, '#3C3E44'); g.addColorStop(0.45, '#25272C'); g.addColorStop(1, '#16171A');
  G.save(); G.globalAlpha = a; rrPath(x, y - h / 2, w, h, h / 2); G.fillStyle = g; G.fill();
  G.strokeStyle = 'rgba(255,255,255,0.16)'; G.lineWidth = 2; G.beginPath(); G.moveTo(x + 8, y - h / 2 + 5); G.lineTo(x + w - 8, y - h / 2 + 5); G.stroke(); G.restore();
}
/** a lane readout: a big number counting with the pull, its unit, and a verdict under it */
function elc_readout(t, x, y, v, unit, verdict, col, a, o = {}) {
  if (a <= 0.003) return;
  rich([{ s: v, role: 'stat', size: o.size || 64, color: C.ink, tnum: true }, { s: unit, font: 'mono', size: 24, weight: 600, color: C.mute, gap: 10 }], x, y, { alpha: a, align: o.align });
  if (verdict) text(verdict, x, y + 40, { role: 'label', size: 22, color: col, alpha: a * (o.va == null ? 1 : o.va), align: o.align });
}

/* ============================== 1. the tear: a nicked film against strands that share the pull (#51, #69) ============================== */
S({
  id: 'elc_tear', ch: 'elec', theme: 'night', title: 'Braided wires, not ribbon cables', settle: 12, ideas: [51, 69], after: 'elc_oneside',
  src: ['elcKapton', 'elcCu', 'elcAwg', 'inglis', 'elcBrock', 'elcLayout'],
  draw: t => {
    header(t, 'Braided wires, not ribbon cables');
    captions(t, [[0.6, 'Most mice reach the battery and the side buttons with a ribbon: copper printed on a film. Nick its edge, and a pull piles up at the nick until it tears across.'], [6.6, 'Theseus braids three wires on a JST plug. Pulled, the strands share the load. Cut one, and the other two still carry it.']]);
    const X = LM, Y = 280, Wd = 1200, Ht = 440, ka = ep(t, 0.2, 0.7, E.snap);
    demoWindow(X, Y, Wd, Ht, ka);
    const yA = Y + 132, yB = Y + 340, bx = X + 30, bw = 140, xc0 = bx + bw, xEnd = X + 1040, tabW = 56, wR = 90;
    elc_slab(bx, Y + 30, bw, Ht - 60, ep(t, 0.4, 0.9), { routes: [yA - 60, yB - 50] });
    text('One board', bx + bw / 2, Y + Ht - 52, { role: 'label', size: 21, color: '#E8E6E0', align: 'center', alpha: ep(t, 0.9, 1.3) });
    text('Pulls: illustration', X + Wd - 32, Y + 50, { role: 'label', size: 20, color: C.faint, align: 'right', alpha: ep(t, 3.0, 3.4) });
    /* the pointer: nick the ribbon, pull it till it tears; then cut a strand of the braid, pull, and it holds */
    const xn = xc0 + 120, tabX = xEnd + tabW / 2, cutX = xc0 + 540, sleeveX = xEnd + 30;
    const L2 = ep(t, 8.7, 10.1, E.io3), layPx = 190 * (1 + 0.06 * L2), Ab = 8 * (1 - 0.18 * L2);
    const sY = elc_strandY(cutX, xc0 + 8, yB, Ab, layPx, 1);
    const keys = [[1.9, [xn + 70, yA - 96]], [2.4, [xn, yA - wR / 2 - 2]], [2.7, [xn, yA - wR / 2 - 2]], [3.3, [tabX, yA + 4]], [3.5, [tabX, yA + 4]], [4.7, [tabX + 26, yA - 18]], [6.0, [tabX + 34, yA - 20]], [6.4, [tabX + 84, yA - 6]],
      [7.0, [cutX + 60, yB - 84]], [7.4, [cutX, sY]], [7.7, [cutX, sY]], [8.5, [sleeveX, yB + 2]], [8.7, [sleeveX, yB + 2]], [10.1, [sleeveX + 26, yB - 18]], [12.5, [sleeveX + 26, yB - 18]]];
    const P = t > 1.6 ? kf(t, keys, E.cam) : keys[0][1], Pr = kf(Math.min(t, 6.4), keys, E.cam);
    /* ---- the ribbon ---- */
    const kA = ep(t, 0.7, 1.7, E.cam), L1 = ep(t, 3.5, 4.7, E.io3), torn = t >= 6.0;
    const kRows = t < 2.5 ? 0 : t < 4.7 ? 4 : Math.round(lerp(4, 24, E.in3(prog(t, 4.7, 6.0))));
    const aNick = 0.5 * kRows / 4, Kt = kRows ? 1 + 2 * Math.sqrt(aNick / 0.02) : 1;
    const xr1 = lerp(xc0 + 6, xEnd, kA), liftA = t < 3.5 || torn ? 0 : P[1] - (yA + 4), tabCol = TH ? '#C9A86A' : '#8E7442';
    elc_conn(xc0 + 12, yA, 'zif', ep(t, 0.6, 1.0));
    if (!torn) {
      elc_ribbon(xc0 + 6, xr1, yA, wR, { k: kRows, xn, load: L1, Kt, dy: liftA, alpha: ka });
      if (kA > 0.98) rr(xEnd, yA - wR / 2 + liftA, tabW, wR, 8, tabCol, null, 1, ka);
      if (kRows && L1 > 0.05) warm(xn, yA - wR / 2 + kRows * wR / 24, 34 + 30 * L1, heatCol(1), 0.5 * L1);
    } else {
      /* torn through: the near half stays in the latch; the far half went with the pointer and stays where it let go */
      elc_ribbon(xc0 + 6, xn, yA, wR, { k: 24, xn, load: 0, alpha: ka });
      const ox = Pr[0] - tabX, oy = Pr[1] - (yA + 4), rot = 0.03 * ep(t, 6.0, 6.6);
      G.save(); G.translate(xn + ox, yA + oy); G.rotate(rot); G.translate(-xn, -yA);
      elc_ribbon(xn + 5, xEnd, yA, wR, { k: 0, xn: -1e4, load: 0, alpha: ka }); rr(xEnd, yA - wR / 2, tabW, wR, 8, tabCol, null, 1, ka);
      G.restore();
    }
    const la = ep(t, 1.2, 1.6);
    text('Ribbon cable (FPC)', xc0 + 24, yA - wR / 2 - 24, { role: 'label', size: 22, color: C.ink, alpha: la });
    text('Polyimide film, three copper traces', xc0 + 24 + tw('Ribbon cable (FPC)', { role: 'label', size: 22 }) + 22, yA - wR / 2 - 24, { role: 'small', size: 25, color: C.mute, alpha: la });
    if (kRows && t < 6.0) callout(t, 2.8, [xn, yA - wR / 2 + 4 * wR / 24], 'Kt ≈ 11 at the nick\'s tip', { to: [xn + 170, yA + wR / 2 + 30], side: 'r', color: C.bad, sub: 'a 0.5 mm nick, its tip 0.02 mm round', maxW: 600 });
    if (t > 3.5 && t < 6.4) text(fmtN(0.07 * L1, 2) + ' N', P[0] + 28, P[1] + 46, { font: 'mono', size: 24, weight: 700, color: C.ink, alpha: ep(t, 3.5, 3.8) });
    /* ---- the braid ---- */
    const kB = ep(t, 1.0, 2.0, E.cam), xb1 = lerp(xc0 + 8, xEnd, kB), cut = t >= 7.6, gap = cut ? 6 + 30 * E.out3(prog(t, 7.6, 8.0)) : 0;
    const FB = 2.0 * L2, per = cut ? FB / 2 : FB / 3, hk = per / ELB.wireN, heat = [hk, cut ? 0 : hk, hk];
    elc_conn(xc0 + 12, yB, 'jst', ep(t, 0.9, 1.3));
    glowField(t, (xc0 + xEnd) / 2, yB, 420, { a: 0.55 * kB });
    const liftB = t < 8.7 ? 0 : P[1] - (yB + 2);
    G.save(); if (liftB) { const s = liftB / (xEnd - xc0); G.transform(1, s, 0, 1, 0, -s * xc0); }
    elc_braid(xc0 + 8, xb1, yB, Ab, layPx, 13, { heat, cut: cut ? { i: 1, x: cutX, gap } : null, alpha: ka, sweep: t > 10.4 ? lerp(xc0 - 200, xEnd + 200, ((t - 10.4) % 3.2) / 3.2) : null });
    if (kB > 0.98) elc_sleeve(xEnd - 4, yB, 64, 34, ka);
    G.restore();
    const lb = ep(t, 1.5, 1.9), hw = heroTag(xc0 + 24, yB - 50, 'Theseus', 'braided', { a: lb });
    text('Three 32 AWG wires on a JST plug', xc0 + 24 + hw + 18, yB - 50, { role: 'small', size: 25, color: C.mute, alpha: lb });
    if (cut) callout(t, 7.8, [cutX, sY], 'One strand cut', { to: [cutX + 150, yB + 58], side: 'r', color: C.bad });
    if (t > 8.7) text(fmtN(FB, 2) + ' N', P[0] + 28, P[1] + 46, { font: 'mono', size: 24, weight: 700, color: C.ink, alpha: ep(t, 8.7, 9.0) });
    const down = (t > 3.5 && t < 6.4) || t > 8.7;
    if (t > 1.6) cursorAt(t, keys, [2.5, 3.5, 7.6, 8.7], { grab: down, ease: E.cam });
    /* ---- by how much, beside the drawing: the headline, then before → after ---- */
    const rx = X + Wd + 40, rw = RM - rx, FB2 = 2 * ELB.wireN;
    elc_hl(t, 10.2, rx, 440, fmtN(Math.round(FB2 / 0.07 / 10) * 10, 0) + '×', 'the pull', { size: 120, label: 'To tear it, one strand already cut', sub: 'The braid\'s two good strands hold ' + fmtN(FB2, 0) + ' N; a nick keeps tearing the film at 0.07 N.', subW: rw });
    elc_ba(t, 10.8, rx, 650, '0.07', fmtN(FB2, 0), { label: 'Force to tear, ribbon then braid', unit: 'N', net: 'Cut one strand, and two still carry it', maxW: rw });
    /* ---- the words, under it ---- */
    const by = Y + Ht + 40;
    glossBox(t, 2.0, X, by, 520, 'FPC', 'A flexible printed circuit: copper traces sealed in polyimide film. Most mice use one for the side buttons.', { size: 25 });
    sourceBox(t, 3.2, X + 560, by, 620, 'DuPont, Kapton HN', 'A 25 µm film takes 7.2 N to start a tear and 0.07 N to keep one going: nicked, a hundredth of the force.', { kind: 'datasheet', size: 25 });
    noteBox(t, 6.8, X + 1220, by, RM - X - 1220, { kind: 'estimate', label: 'Estimate', value: 'Brock', size: 25, body: 'Ribbons are the most common failure in assembly and repair (#51). A tester adds: the latch wears out.' });
    source(t, 'Each wire: 220 MPa × 0.032 mm² ≈ 7 N (annealed copper, 32 AWG); two left ≈ 14 N, derived. Film: DuPont Kapton HN datasheet.', { t0: 3 });
  }
});

/* ============================== 2. the noise: a pair's loop, and the twist that flips it (#69) ============================== */
S({
  id: 'elc_twist', ch: 'elec', theme: 'paper', title: 'Twisted pairs cancel radio noise', settle: 11, ideas: [69], after: 'elc_tear',
  src: ['elcKlipec', 'elcNasaTem', 'antDetune', 'elcLayout'],
  draw: t => {
    header(t, 'Twisted pairs cancel radio noise');
    captions(t, [[0.6, 'Two wires side by side make one long loop. A changing field beside it, from the antenna or a regulator\'s coil, drives a current round the whole loop.'], [5.8, 'Twist them and the loop flips every half turn. Each half picks up the opposite of its neighbour, and the halves cancel.']]);
    const A = C.hero, X = LM, Y = 280, Wd = 1180, Ht = 460, ka = ep(t, 0.2, 0.7, E.snap);
    demoWindow(X, Y, Wd, Ht, ka);
    cardHead(t, 0.4, X, Y, Wd, 'A 60 mm lead, a coil 5 mm beside it', ['derived']);
    const S0 = 15, xL = X + 120, xR = xL + ELB.leadL * S0, ys = Y + 250, yP = ys - ELB.h * S0 - 6, yT = ys + ELB.h * S0 + 6, sep = 16;
    /* the source: the pointer drags it along the lead */
    const keys = [[2.0, [xL + 300, ys + 110]], [2.6, [xL + 470, ys + 6]], [2.8, [xL + 470, ys + 6]], [4.0, [xL + 200, ys + 6]], [5.2, [xL + 760, ys + 6]], [5.9, [xL + 470, ys + 6]], [6.4, [xL + 470, ys + 6]], [7.2, [xL + 980, ys + 150]], [11.5, [xL + 980, ys + 150]]];
    const P = kf(t, keys, E.cam), xsPx = t < 2.8 ? xL + 470 : t > 6.4 ? xL + 470 : P[0], xs = (xsPx - xL) / S0;
    const ks = ep(t, 2.0, 2.5), osc = Math.sin(t * 4.2), vis = 0.45 + 0.55 * Math.abs(osc);
    for (let i = 0; i < 7; i++) { const ph = ((t * 0.5 + i / 7) % 1), r = 14 + ph * 240; circle(xsPx, ys, r, { color: A, w: 2, alpha: ks * 0.4 * Math.pow(1 - ph, 1.6) }); }
    glowField(t, xsPx, ys, 150, { a: 0.9 * ks, cols: [A, A, C.ink] });
    G.save(); G.globalAlpha = ks; const gC = G.createRadialGradient(xsPx - 5, ys - 6, 2, xsPx, ys, 24); gC.addColorStop(0, '#FFFFFF'); gC.addColorStop(1, A); G.fillStyle = gC; G.beginPath(); G.arc(xsPx, ys, 20, 0, TAU); G.fill(); G.restore();
    for (let i = 0; i < 3; i++) circle(xsPx, ys, 8 + i * 4, { color: '#0D0E0F', w: 1.6, alpha: ks * 0.55 });
    text('Noise source', xsPx + 34, ys + 8, { role: 'label', size: 21, color: A, alpha: ks });
    const B = x => Math.pow(1 + Math.pow((x - xs) / ELB.h, 2), -1.5);
    const wireA = TH ? '#55565C' : '#D6D4CE', wireB = TH ? '#8E8B84' : '#8E8B84';
    /* the side-by-side pair: one loop; all of it pushes current the same way */
    const kP = ep(t, 0.9, 1.8, E.cam), xPe = lerp(xL, xR, kP);
    for (let x = xL; x < xPe; x += 4) { const b = B((x - xL) / S0); if (b < 0.015) continue; G.globalAlpha = ka * ks * 0.6 * b * vis; G.fillStyle = A; G.fillRect(x, yP - sep + 3, 4.4, sep * 2 - 6); }
    G.globalAlpha = 1;
    line(xL, yP - sep, xPe, yP - sep, { color: wireA, w: 5, cap: 'round', alpha: ka }); line(xL, yP + sep, xPe, yP + sep, { color: wireB, w: 5, cap: 'round', alpha: ka });
    if (kP > 0.98 && ks > 0) {
      for (let x = xL + 30; x < xR; x += 60) { const b = B((x - xL) / S0); if (b > 0.12) text('+', x, yP + 9, { font: 'mono', size: 24, weight: 700, color: '#FFFFFF', align: 'center', alpha: ka * clamp(b * 2) * ks }); }
      G.save(); G.setLineDash([12, 14]); G.lineDashOffset = -t * 150; G.strokeStyle = C.bad; G.globalAlpha = ks * (0.5 + 0.5 * vis); G.lineWidth = 3.5;
      G.beginPath(); G.moveTo(xL, yP - sep - 9); G.lineTo(xR + 9, yP - sep - 9); G.lineTo(xR + 9, yP + sep + 9); G.lineTo(xL, yP + sep + 9); G.stroke(); G.restore();
    }
    text('Side by side: one loop, the current adds up', xL, yP - sep - 34, { role: 'label', size: 22, color: C.ink, alpha: ep(t, 1.2, 1.6) });
    /* the twisted pair: lobes that flip sign every half lay */
    const lay = ELB.lay, lp = lay * S0, kT = ep(t, 1.2, 2.1, E.cam), xTe = lerp(xL, xR, kT);
    for (let x = xL; x < xTe; x += 3) {
      const u = (x - xL) / S0, b = B(u), wdt = Math.abs(Math.cos(TAU * u / lay)) * sep; if (b < 0.015) continue;
      G.globalAlpha = ka * ks * 0.6 * b * vis; G.fillStyle = Math.floor(2 * u / lay + 0.5) % 2 ? C.bad : A; G.fillRect(x, yT - wdt, 3.4, wdt * 2);
    }
    G.globalAlpha = 1;
    const strand = (ph0, col) => { const pts = []; for (let x = xL; x <= xTe; x += 3) pts.push([x, yT + sep * Math.cos(TAU * (x - xL) / lp + ph0)]); poly(pts, { color: col, w: 5, alpha: ka }); };
    strand(Math.PI, wireB); strand(0, wireA);
    if (kT > 0.98 && ks > 0) for (let hI = 0; hI < 2 * ELB.leadL / lay; hI++) {
      const u0 = hI * lay / 2, b = B(u0); if (b < 0.12) continue;
      text(hI % 2 ? '−' : '+', xL + u0 * S0, yT + 9, { font: 'mono', size: 24, weight: 700, color: '#FFFFFF', align: 'center', alpha: ka * clamp(b * 2) * ks });
    }
    text('Twisted, ' + lay + ' mm lay: each half cancels the next', xL, yT + sep + 50, { role: 'label', size: 22, color: C.ink, alpha: ep(t, 1.5, 1.9) });
    if (t > 1.7) cursorAt(t, keys, [2.8], { grab: t > 2.8 && t < 6.4, ease: E.cam });
    /* the two results, as tiles under the drawing */
    /* the strip under it: by how much, before → after (the coil at the lead's middle) */
    const r0 = elc_reject(lay), d0 = elc_dB(r0);
    elc_hl(t, 3.0, X, 900, fmtN(d0, 0) + ' dB', 'noise', { size: 120, count: false, label: 'Twisted at a ' + lay + ' mm lay, against side by side' });
    elc_ba(t, 3.4, X + 680, 900, '1', '1/' + fmtN(1 / r0, 0), { label: 'Noise picked up', unit: 'of it', net: 'A coil 5 mm away, at the middle of the lead', maxW: 500 });
    /* the right column: the measurement, the 2.4 GHz case, the word */
    const rx = X + Wd + 24, rw = RM - rx;
    const s1 = sourceBox(t, 3.6, rx, Y, rw, 'Klipec, IEEE 1967', 'Steel conduit cut magnetic pickup 27 dB. A pair twisted to a 2-inch lay did five to six times better: about 41 to 43 dB.', { kind: 'study', size: 25 });
    const s2 = noteBox(t, 6.2, rx, Y + s1.h + 24, rw, { label: 'At 2.4 GHz', value: 'λ 125 mm', size: 25, body: 'A 6 mm lay is λ/21, so the halves still cancel. Twisting can\'t stop the pair acting as one antenna (NASA, 2 to 200 MHz), so the leads keep out of the antenna\'s keep-out.' });
    glossBox(t, 7.0, rx, Y + s1.h + s2.h + 48, rw, 'Lay', 'The length of one full twist.', { size: 25 });
  }
});

/* ============================== 3. how tight: the lay against the copper it adds (Brock's caveat, #69) ============================== */
S({
  id: 'elc_lay', ch: 'elec', theme: 'night', title: 'Braid lay: noise against weight', settle: 12, ideas: [69], after: 'elc_twist',
  src: ['elcKlipec', 'elcCu', 'elcAwg', 'elcBrock', 'elcLayout'],
  draw: t => {
    header(t, 'Braid lay: noise against weight');
    captions(t, [[0.6, 'Every twist adds wire: each strand runs a helix, longer than the lead. Braid it too tight and the copper adds up, as Brock warns.'], [6.4, 'At about 6 mm the noise is already 36 dB down and the copper has barely moved. That is the lay I\'d set: 3 mg over both leads.']]);
    const X = LM, Y = 280, ka = ep(t, 0.2, 0.7, E.snap);
    /* the lead at the lay the pointer sets, drawn big along the top */
    const Hl = 140; demoWindow(X, Y, RM - X, Hl, ka);
    const cy0 = Y + Hl + 24, cw = 1140, ch = 948 - cy0;
    const Lmin = 1.5, Lmax = 24, px0 = X + 124, pw = 900, py0 = cy0 + 96, ph = ch - 96 - 96;
    const LX = p => px0 + pw * Math.log(p / Lmin) / Math.log(Lmax / Lmin), PX = x => Lmin * Math.pow(Lmax / Lmin, (x - px0) / pw);
    const keys = [[3.4, [LX(6) + 60, py0 + ph + 70]], [3.9, [LX(6), py0 + ph + 2]], [4.1, [LX(6), py0 + ph + 2]], [5.0, [LX(20), py0 + ph + 2]], [5.4, [LX(20), py0 + ph + 2]], [6.6, [LX(1.6), py0 + ph + 2]], [7.0, [LX(1.6), py0 + ph + 2]], [8.4, [LX(6), py0 + ph + 2]], [8.8, [LX(6), py0 + ph + 2]], [9.6, [LX(6) + 90, py0 + ph + 80]], [13, [LX(6) + 90, py0 + ph + 80]]];
    const P = kf(t, keys, E.cam), lay = t < 4.1 || t > 8.8 ? ELB.lay : clamp(PX(P[0]), Lmin, Lmax);
    const xb0 = X + 60, xb1 = RM - 260, ybr = Y + Hl / 2 + 14;
    glowField(t, (xb0 + xb1) / 2, ybr, 380, { a: 0.5 * ka });
    elc_braid(xb0, lerp(xb0, xb1, ep(t, 0.4, 1.4, E.cam)), ybr, 8, lay * 30, 13, { alpha: ka, sweep: lerp(xb0 - 200, xb1 + 200, ((t - 1.4) % 4) / 4) });
    text('The lead at ' + fmtN(lay, 1) + ' mm lay, 30 px per mm', xb0, Y + 40, { role: 'label', size: 21, color: C.mute, alpha: ep(t, 1.0, 1.4) });
    const tk = elc_takeup(lay), mg = ELB.cuMg * tk;
    rich([{ s: '+' + fmtN(tk * 100, 1) + '%', font: 'mono', size: 30, weight: 700, color: C.ink }, { s: 'wire', role: 'label', size: 21, color: C.mute, gap: 10 }], RM - 32, ybr + 10, { align: 'right', alpha: ep(t, 1.0, 1.4) });
    /* the chart */
    demoWindow(X, cy0, cw, ch, ep(t, 0.6, 1.1, E.snap));
    cardHead(t, 0.8, X, cy0, cw, 'Noise picked up and copper added, against lay', ['derived']);
    const a0 = ep(t, 1.0, 1.5), FLOOR = -60;
    const RY = d => py0 + ph * clamp(-d / -FLOOR), TY = pc => py0 + ph - ph * clamp(pc / 40);
    for (const d of [0, -20, -40, -60]) { line(px0, RY(d), px0 + pw, RY(d), { color: C.hair, w: 1.2, alpha: a0 }); text(d + ' dB', px0 - 14, RY(d) + 7, { role: 'tick', color: C.mute, align: 'right', alpha: a0 }); }
    for (const pc of [0, 10, 20, 30, 40]) text('+' + pc + '%', px0 + pw + 14, TY(pc) + 7, { role: 'tick', color: C.bad, alpha: a0 });
    for (const p of [1.5, 2, 3, 4, 6, 9, 12, 18, 24]) { line(LX(p), py0 + ph, LX(p), py0 + ph + 8, { color: C.faint, w: 1.5, alpha: a0 }); text(fmtN(p, p < 2 ? 1 : 0) + ' mm', LX(p), py0 + ph + 34, { role: 'tick', color: C.mute, align: 'center', alpha: a0 }); }
    text('Lay', px0 + pw, py0 + ph + 72, { role: 'label', size: 21, color: C.mute, align: 'right', alpha: a0 });
    text('Tighter', px0, py0 + ph + 72, { role: 'label', size: 21, color: C.faint, alpha: a0 });
    const kz = ep(t, 8.6, 9.2);
    rect(LX(4.5), py0, LX(8) - LX(4.5), ph, { fill: C.heroSoft, alpha: kz });
    text('Sweet spot', (LX(4.5) + LX(8)) / 2, py0 + 28, { role: 'label', size: 21, color: C.heroText, align: 'center', alpha: kz });
    const kc = ep(t, 1.4, 2.8, E.io3), Rp = [], Tp = [];
    for (let x = px0; x <= px0 + pw; x += 4) { const p = PX(x); Rp.push([x, RY(Math.max(FLOOR, elc_rejDB(p)))]); Tp.push([x, TY(100 * elc_takeup(p))]); }
    poly(Rp, { color: C.ink, w: 3.5, p: kc });
    poly(Tp, { color: C.bad, w: 3, dash: [9, 6], p: kc });
    const kl = ep(t, 2.6, 3.0);
    text('Noise, from a coil 5 mm away', px0 + pw - 16, RY(-34), { role: 'label', size: 21, color: C.ink, align: 'right', alpha: kl });
    text('Copper added', LX(2.2) + 20, TY(100 * elc_takeup(2.2)) - 16, { role: 'label', size: 21, color: C.bad, alpha: kl });
    text('−60 dB or less', px0 + 12, RY(FLOOR) - 14, { role: 'label', size: 19, color: C.faint, alpha: kl });
    const kk = ep(t, 3.2, 3.6), kx = LX(lay), dNow = elc_rejDB(lay);
    if (kk > 0) {
      line(kx, py0, kx, py0 + ph, { color: C.heroText, w: 2, dash: [5, 5], alpha: kk });
      heroMark(kx, RY(Math.max(FLOOR, dNow)), 11, kk); circle(kx, TY(100 * tk), 8, { fill: C.bad, alpha: kk });
      circle(kx, py0 + ph, 11, { fill: C.hero, alpha: kk }); circle(kx, py0 + ph, 18, { color: C.hero, w: 2, alpha: kk * 0.5 });
    }
    if (t > 3.2) cursorAt(t, keys, [4.1], { grab: t > 4.1 && t < 8.8, ease: E.cam });
    /* the two numbers that trade, and Brock's caveat */
    const rx = X + cw + 40, rw = RM - rx, d6 = elc_rejDB(ELB.lay), tk6 = elc_takeup(ELB.lay), mg6 = ELB.cuMg * tk6;
    const mgT = ELB.cuMg * elc_takeup(1.5);
    noteBox(t, 2.0, rx, cy0, rw, { size: 22, head: 'Logitech braids these wires in every GPX (#69)', body: 'It publishes no lay. Braided too tight, the weight adds up: wires are heavy.' });
    elc_hl(t, 9.0, rx, cy0 + 296, fmtN(mgT / mg6, 0) + '×', 'less copper', { size: 100, label: 'Than a tight 1.5 mm braid' });
    elc_ba(t, 9.4, rx, cy0 + 436, fmtN(mgT, 0), fmtN(mg6, 1), { size: 56, label: 'Copper added, a 1.5 mm lay then mine', unit: 'mg', net: 'And still ' + fmtN(d6, 0) + ' dB of noise picked up', maxW: rw });
    source(t, 'Model: two 60 mm leads of three 32 AWG wires, copper only (' + fmtN(ELB.cuMg, 0) + ' mg at 9.0 g/cm³). Wire = √(1 + (2πr/lay)²), r 0.23 mm. Noise: a coil 5 mm beside the lead.', { t0: 2 });
  }
});

/* ============================== 4. the bend: a crease against fine strands (#69, #51) ============================== */
/** a lead leaving a clamp at (ex, y) along the board's tilt a (rad, screen: + turns the exit downward), bending back to
   horizontal over a radius rb, then straight to ex + len. returns { pts, arc } */
function elc_bendPts(ex, y, a, rb, len) {
  const pts = [[ex, y]], arc = [[ex, y]], sg = Math.sign(a) || 1, arcL = Math.abs(a) * rb, n = Math.max(2, Math.ceil(arcL / 2));
  let x = ex, yy = y, psi = a;
  for (let i = 0; i < n; i++) { const ds = arcL / n; psi -= sg * ds / rb; x += Math.cos(psi) * ds; yy += Math.sin(psi) * ds; pts.push([x, yy]); arc.push([x, yy]); }
  pts.push([ex + len, yy]);
  return { pts, arc };
}
/** the board, rotated about its clamp by a: a slab of length Ls to the left of (ex, y) */
function elc_tiltSlab(ex, y, a, Ls, al) {
  if (al <= 0.003) return [ex - Ls, y];
  G.save(); G.translate(ex, y); G.rotate(a); elc_slab(-Ls, -34, Ls, 68, al); G.restore();
  return [ex - Ls * Math.cos(a), y - Ls * Math.sin(a)];
}
S({
  id: 'elc_flex', ch: 'elec', theme: 'paper', title: 'Flex life: fine strands, no crease', settle: 12, ideas: [69, 51], after: 'elc_lay',
  src: ['elcAlexander', 'elcShengyi', 'elcKapton', 'elcAwg', 'elcBrock'],
  draw: t => {
    header(t, 'Flex life: fine strands, no crease');
    captions(t, [[0.6, 'Every battery swap bends these leads. A ribbon bends one way only, and folded hard it creases: its copper takes the whole bend on one line.'], [6.2, 'A braid has no flat side. Its fine strands slide past each other, so each one bends only as hard as its own thickness.']]);
    const X = LM, Y = 280, Wd = 1180, Ht = 680, ka = ep(t, 0.2, 0.7, E.snap);
    demoWindow(X, Y, Wd, Ht, ka);
    cardHead(t, 0.4, X, Y, Wd, 'Lifting the board out, over and over', ['derived']);
    /* the pointer lifts the board by its far end; each lead bends where it leaves the clamp */
    const c0 = 2.6, per = 2.0, tilt = t < c0 ? 0 : -Math.sin(TAU * (t - c0) / per) * 0.8 * ep(t, c0, c0 + 1.0), bends = t < c0 ? 0 : Math.floor((t - c0) / per * 2 + 0.25);
    const ex = X + 380, Ls = 270, len = 660, yR = Y + 300, yBr = Y + 520, hk = clamp(Math.abs(tilt) / 0.8);
    const kR = ep(t, 0.8, 1.6, E.cam), kB = ep(t, 1.0, 1.8, E.cam);
    /* the ribbon: a thin film; all of the bend lands on the clamp's edge */
    const hR = elc_tiltSlab(ex, yR, tilt, Ls, ep(t, 0.6, 1.1));
    const R = elc_bendPts(ex, yR, tilt, 3, len * kR);
    poly(R.pts, { color: TH ? '#C9A86A' : '#A9874C', w: 14, alpha: kR, cap: 'butt' }); poly(R.pts, { color: '#E0A060', w: 3, alpha: kR, cap: 'butt' });
    warm(ex, yR, 36 + 34 * hk, heatCol(1), 0.8 * hk * kR); circle(ex, yR, 7, { fill: heatCol(hk), alpha: kR });
    text('All of the bend on one line', ex + 40, yR + 58, { role: 'label', size: 21, color: C.bad, alpha: kR * ep(t, 3.0, 3.4) });
    /* the braid: a round lead that rolls round a radius of its own, the bend spread over the arc */
    const hB = elc_tiltSlab(ex, yBr, tilt, Ls, ep(t, 0.8, 1.3));
    const Bp = elc_bendPts(ex, yBr, tilt, 76, len * kB);
    glowField(t, ex + 260, yBr, 320, { a: 0.6 * kB });
    poly(Bp.pts, { color: TH ? '#2F3035' : '#6A6B70', w: 30, alpha: kB, cap: 'butt' });
    if (Bp.arc.length > 2) poly(Bp.arc, { color: heatCol(hk * 0.32), w: 30, alpha: kB * 0.85, cap: 'butt' });
    /* its strands: fine lines along it that slide against each other as it bends */
    for (const off of [-9, -3, 3, 9]) {
      const pts = Bp.pts.map((p, i) => { const q = Bp.pts[Math.min(Bp.pts.length - 1, i + 1)], r0 = Bp.pts[Math.max(0, i - 1)], dx = q[0] - r0[0], dy = q[1] - r0[1], l = Math.hypot(dx, dy) || 1; return [p[0] - dy / l * off, p[1] + dx / l * off]; });
      G.save(); G.setLineDash([22, 10]); G.lineDashOffset = off * tilt * 6; G.strokeStyle = 'rgba(255,255,255,0.2)'; G.lineWidth = 2; G.globalAlpha = kB; G.beginPath(); pts.forEach((p, i) => i ? G.lineTo(p[0], p[1]) : G.moveTo(p[0], p[1])); G.stroke(); G.restore();
    }
    text('Spread over the arc', ex + 120, yBr + 74, { role: 'label', size: 21, color: C.heroText, alpha: kB * ep(t, 3.0, 3.4) });
    /* the pointer lifts both boards by their far ends */
    if (t > 1.8) { const hx = (hR[0] + hB[0]) / 2 + 20, hy = (hR[1] + hB[1]) / 2; line(hR[0] + 20, hR[1], hB[0] + 20, hB[1], { color: C.faint, w: 2, dash: [4, 6], alpha: ep(t, 1.8, 2.2) }); cursorPtr(hx, hy, { a: ep(t, 1.8, 2.2), grab: t > c0 }); }
    text('Ribbon: it creases on the edge', ex + 60, yR - 52, { role: 'label', size: 22, color: C.bad, alpha: ep(t, 1.0, 1.4) });
    const hw = heroTag(ex + 60, yBr - 62, 'Theseus', 'braid', { a: ep(t, 1.3, 1.7) });
    text('it rolls round the edge', ex + 60 + hw + 16, yBr - 62, { role: 'label', size: 22, color: C.mute, alpha: ep(t, 1.3, 1.7) });
    rich([{ s: String(bends), role: 'stat', size: 64, color: C.ink, tnum: true }, { s: 'bends', font: 'mono', size: 22, weight: 600, color: C.mute, gap: 10 }], X + Wd - 40, Y + 130, { align: 'right', alpha: ep(t, 2.6, 3.0) });
    /* the strain, in one line: a 40 AWG strand against a solid 32 AWG wire */
    const sy = Y + Ht - 46, ks = ep(t, 4.0, 4.6), dS = 0.202, dF = 0.0799;
    rule(X + 32, sy - 62, X + Wd - 32, ks);
    rich([{ s: '50+', role: 'stat', size: 54, color: C.bad, tnum: true }, { s: 'folds at 0.38 mm: copper-clad film\'s rating. The film lasts 285,000; the copper cracks.', role: 'small', size: 23, weight: 600, color: C.ink2, gap: 16 }], X + 40, sy, { alpha: ks });
    /* the right column: by how much, then the strands' life in a test */
    const rx = X + Wd + 24, rw = RM - rx, R2 = 2.5;
    elc_hl(t, 6.6, rx, 440, fmtN(dS / dF, 1) + '×', 'less strain', { size: 110, label: 'A fine strand against a solid wire', sub: 'Bent over the same ' + R2 + ' mm, a 40 AWG strand strains ' + fmtN(100 * dF / (2 * R2), 1) + '% and a solid 32 AWG wire ' + fmtN(100 * dS / (2 * R2), 1) + '% (ε = d / 2R).', subW: rw });
    const cy = 600, ch = 360;
    demoWindow(rx, cy, rw, ch, ep(t, 0.6, 1.1, E.snap));
    cardHead(t, 0.8, rx, cy, rw, 'Bends to failure by strand size (higher is better)', [{ ev: 'study', by: 'Alexander 1953' }], { dy: 44 });
    const rows = [['0.40 mm × 7', 351], ['0.25 mm × 19', 874], ['0.13 mm × 65', 2892], ['0.10 mm × 105', 2908]], bx0 = rx + 190, bw0 = rw - 190 - 110;
    rows.forEach(([l, v], i) => {
      const yy = cy + 106 + i * 48, k = ep(t, 1.2 + i * 0.25, 2.2 + i * 0.25, E.snap);
      text(l, rx + 32, yy + 8, { role: 'small', size: 22, weight: 600, color: C.ink, alpha: ep(t, 1.0 + i * 0.25, 1.4 + i * 0.25) });
      rr(bx0, yy - 9, bw0, 18, 9, C.track, null, 1, k);
      rr(bx0, yy - 9, Math.max(18, bw0 * v / 3000 * k), 18, 9, i >= 2 ? C.ink2 : C.comp, null, 1, k);
      text(countUp(fmt(v), k) || fmt(v), rx + rw - 32, yy + 8, { font: 'mono', size: 23, weight: 700, color: C.ink, align: 'right', alpha: k });
    });
    text('18 AWG wire, 90° each way. Theseus\'s strands are 0.08 mm, finer still.', rx + 32, cy + ch - 50, { role: 'small', size: 21, weight: 600, color: C.ink2, maxW: rw - 64, lh: 1.3, alpha: ep(t, 2.6, 3.0) });
    source(t, 'Strain ε = d / 2R, derived. Bends to failure: Alexander 1953, Table IX. Fold rating: Shengyi SF202; the film: DuPont Kapton HN.', { t0: 2 });
  }
});
