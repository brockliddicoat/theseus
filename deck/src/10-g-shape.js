/* ============================================================================================
   6 · SHAPE. The rules the shape follows. The outline itself will change until it ships, so it never appears here
   (HANDOFF): every profile is generic, built from its own curvature. Newtonian shape analysis (Brock's doc, the
   brainstorm: comfort grooves and "Newtonion Shape Analysis"), comfort grooves (#47), round but defined shoulders (#42),
   the size (#38 to #43), EMG on every revision (#45). Every top-level name starts with shp_ (fingerAt is kept, grey).
   ============================================================================================ */
Object.assign(SRC, {
  shpBrock: { t: 'Brock Liddicoat, In Pursuit of an Objectively Better Mouse, brainstorm: "Newtonian shape analysis is good, because you can take the derivative of the line at the edge and see if it points off the mouse or not"; "Rate of change can be too extreme just as it can be too low"; "if you follow the curve perfectly on a mouse with sharp shoulders it will send you off the mouse, but smooth shoulders smooths out the intensity of the curve near the end"; comfort grooves: "sloped surfaces on either side, which cancels out to your fingers feeling hugged"; "the intensity of the comfort grooves is somewhat irrelevant as long as it outpaces the general curvature of the mouse"; #42 round, yet defined shoulders; #47 grooves that shallow out near the front; a flat mouse is better too small than too big', u: '', n: 'His reasoning: no tag.' }
});

/** a fingertip in cross-section, mono-tone (F9.24: skin is grey, never peach) */
function fingerAt(x, y, r, a) {
  if (a <= 0.003) return;
  G.save(); G.globalAlpha = a; const g = G.createRadialGradient(x - r * 0.3, y - r * 0.4, r * 0.1, x, y, r);
  g.addColorStop(0, TH ? '#E2E1DC' : '#9A9994'); g.addColorStop(1, TH ? '#AEADA7' : '#62615C');
  G.beginPath(); G.arc(x, y, r, 0, TAU); G.fillStyle = g; G.fill(); G.strokeStyle = TH ? 'rgba(40,40,38,0.5)' : 'rgba(236,235,231,0.4)'; G.lineWidth = 1.5; G.stroke(); G.restore();
}

/* ---------- profiles from their curvature ----------
   A profile is made from κ(s), the rate of change of its slope (1/mm) along the arc, from the crown (s = 0, level,
   heading outward) round the shoulder to the side; y down, mm. Drawing it this way makes the analysis exact: the slope
   is θ(s) = ∫κ ds, the push is along the normal, and the rate of change is the κ we drew. */
function shp_profile(kfn, L) {
  const P = [], ds = 0.1; let x = 0, y = 0, th = 0;
  for (let s = 0; s <= L + 1e-9; s += ds) { const k = kfn(s); P.push({ x, y, th, k, s }); x += Math.cos(th + k * ds / 2) * ds; y += Math.sin(th + k * ds / 2) * ds; th += k * ds; }
  return P;
}
const shp_gauss = (s, c, sd, turn) => turn * Math.exp(-0.5 * ((s - c) / sd) ** 2) / (sd * Math.sqrt(TAU));
const SHP = {
  sharp: shp_profile(s => (s < 19 ? 1 / 90 : 0) + shp_gauss(s, 19.4, 0.55, 1.6), 37),
  soft: shp_profile(s => (s < 37 ? 1 / 21.5 : 0), 39),
  round: shp_profile(s => (s < 17.5 ? 1 / 90 : 0) + shp_gauss(s, 18.5, 2.7, 1.6), 38)
};
const shp_peak = P => P.reduce((m, q) => Math.max(m, q.k), 0) * 180 / Math.PI;   /* °/mm */
/** a finger following the profile 1:1 at a steady pace, pressed onto it. The press can only turn it as tightly as a
   radius ℓ (pace² × mass / press): where the curve turns tighter than that, the finger carries on along the derivative
   at that edge (Brock: "see if it points off the mouse or not"). u = 0..1 of the follow, s0..sEnd along the arc */
const SHP_ELL = 2.2;
function shp_follow(P, u, s0, sEnd) {
  const ds = 0.1, last = P.length - 1, i0 = Math.round(s0 / ds), sNow = s0 + (sEnd - s0) * clamp(u), iNow = Math.min(last, Math.round(sNow / ds));
  let iSep = -1; for (let i = i0; i <= last; i++) if (P[i].k > 1 / SHP_ELL) { iSep = i; break; }
  if (iSep < 0 || iNow < iSep) { const q = P[iNow]; return { x: q.x, y: q.y, th: q.th, off: false, iSep, i: iNow }; }
  const q = P[iSep], tau = sNow - q.s;
  return { x: q.x + Math.cos(q.th) * tau, y: q.y + Math.sin(q.th) * tau, th: q.th, off: true, iSep, i: iSep, tau };
}
/** the half cross-section in mm: the body under the profile, cut (hatched), the centre line dashed */
function shp_body(P, o = {}) {
  const e = P[P.length - 1], base = e.y + (o.base || 2.5);
  const path = () => { G.beginPath(); G.moveTo(0, 0); for (const q of P) G.lineTo(q.x, q.y); G.lineTo(e.x - 0.4, base); G.lineTo(-1.2, base); G.lineTo(-1.2, 0); G.closePath(); };
  solid(path, o.mat || MT.shell, [-1.2, 0, e.x + 30, base], { hatch: { sp: 9 } });
  G.setLineDash([lw(10), lw(4), lw(3), lw(4)]); G.strokeStyle = inkA(0.4); G.lineWidth = lw(1.2); G.beginPath(); G.moveTo(0, -3); G.lineTo(0, base + 1.5); G.stroke(); G.setLineDash([]);
}

/** one analysis tile: the verdict, the profile with the finger following it, the push and the derivative at the finger,
   and under it the rate of change of the slope along the arc, with the zones */
function shp_tile(t, t0, r, P, o) {
  const [x, y, w, h] = r, a = tileA(t, t0, o.i || 0); if (a <= 0.003) return;
  demoWindow(x, y, w, h, a);
  const hero = !!o.hero, kv = ep(t, o.tv || 6.4, (o.tv || 6.4) + 0.5);
  text(o.name, x + 32, y + 52, { role: 'label', size: 21, color: hero ? C.heroText : C.mute, alpha: a });
  text(o.verdict, x + 32, y + 112, { role: 'h2', size: 46, color: hero ? C.heroText : C.bad, grad: hero ? C.heroGrad : null, alpha: a * kv });
  const s = 10.5, ox = x + 64, oy = y + 172, sEnd = P[P.length - 1].s - (o.stop || 6), u = ep(t, 1.6, 6.0, E.lin), F = shp_follow(P, u, 2, o.off ? Math.min(sEnd, P[0].s + o.off) : sEnd);
  const X = v => ox + v * s, Y = v => oy + v * s;
  part(ox, oy, s, () => shp_body(P), { alpha: a });
  /* where the finger has been: along the surface, then (if it left) its flight, dashed */
  const kp = ep(t, 1.6, 2.0) * a, i1 = F.off ? F.iSep : F.i;
  poly(P.slice(Math.round(2 / 0.1), i1 + 1).map(q => [X(q.x), Y(q.y)]), { color: hero ? C.hero : C.ink, w: 3.5, alpha: kp, cap: 'round' });
  if (F.off) {
    const q = P[F.iSep], pts = [[X(q.x), Y(q.y)], [X(F.x), Y(F.y)]];
    G.save(); G.setLineDash([9, 7]); poly(pts, { color: C.bad, w: 3, alpha: kp }); G.restore();
    /* the derivative at the edge, pointing off the mouse */
    const ke = ep(t, 3.6, 4.0) * a; arrow(X(q.x), Y(q.y), X(q.x) + Math.cos(q.th) * 150, Y(q.y) + Math.sin(q.th) * 150, { color: C.bad, w: 3, hs: 14, alpha: ke });
    circle(X(q.x), Y(q.y), 7, { fill: C.bad, alpha: ke });
  }
  /* the finger, the push (along the normal) and the tangent (the derivative) at its contact */
  const nx = Math.sin(F.th), ny = -Math.cos(F.th), rF = 5;
  fingerAt(X(F.x + nx * rF), Y(F.y + ny * rF), rF * s, a * ep(t, 1.2, 1.6));
  if (!F.off) {
    const kk = a * ep(t, 1.6, 2.0), cx = X(F.x), cy = Y(F.y), tx = Math.cos(F.th), ty = Math.sin(F.th);
    line(cx - tx * 62, cy - ty * 62, cx + tx * 62, cy + ty * 62, { color: C.ink2, w: 2, alpha: kk });
    arrow(cx, cy, cx + nx * 96, cy + ny * 96, { color: hero ? C.hero : C.ink, w: 3.5, hs: 15, alpha: kk });
    circle(cx, cy, 6, { fill: hero ? C.hero : C.ink, alpha: kk });
  }
  /* the rate of change of the slope along the arc, the zones behind it */
  const gx = x + 32, gw = w - 64 - 132, gy = y + h - 150, gh = 92, L = P[P.length - 1].s, ymax = 30, GX = v => gx + gw * v / L, GY = v => gy + gh * (1 - Math.min(v, ymax) / ymax), kg = ep(t, 0.9, 1.4) * a;
  rr(gx, GY(22), gw, GY(6) - GY(22), 4, rgba(C.hero, TH ? 0.13 : 0.17), null, 0, kg);
  text('Too extreme', x + w - 32, GY(27) + 7, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: kg });
  text('Defined', x + w - 32, GY(14) + 7, { role: 'label', size: 19, color: C.heroText, align: 'right', alpha: kg });
  text('Too low', x + w - 32, GY(2) + 2, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: kg });
  line(gx, gy + gh, gx + gw, gy + gh, { color: C.faint, w: 1.2, alpha: kg });
  const kc = ep(t, 1.0, 2.2, E.lin), curve = P.filter(q => q.s <= L * kc).map(q => [GX(q.s), GY(q.k * 180 / Math.PI)]);
  if (curve.length > 1) poly(curve, { color: hero ? C.hero : o.over ? C.bad : C.ink, w: 3, alpha: kg });
  const mk = P[Math.min(P.length - 1, F.i)];
  circle(GX(mk.s), GY(mk.k * 180 / Math.PI), 6, { fill: F.off ? C.bad : hero ? C.hero : C.ink, alpha: kg * ep(t, 1.6, 2.0) });
  text('Rate of change of the slope', gx, gy - 14, { role: 'label', size: 19, color: C.mute, alpha: kg });
  rich([{ s: 'Peak', role: 'label', size: 20, color: C.mute }, { s: fmtN(shp_peak(P), 1) + '°/mm', font: 'disp', size: 30, weight: 800, color: hero ? C.heroText : C.bad, gap: 12, caps: false }, { s: 'Derived', role: 'label', size: 19, color: C.faint, gap: 16 }], gx, y + h - 26, { alpha: kv });
}

/* ============================== chapter card ============================== */
S({
  id: 'shapecard', ch: 'shape', card: true, theme: 'night', title: 'Shape', settle: 6,
  draw: t => {
    chapterCard(t, {
      name: 'Shape', gloss: 'The outline will change until it ships. What stays fixed are the rules it has to pass.', list: [
        ['newton', 'Newtonian shape analysis, on every curve'], ['#47', 'Comfort grooves that hold the finger'], ['#42', 'Round, defined shoulders'],
        ['#40', 'A lower front'], ['#38', 'A straighter, pointier front'], ['size', 'Sized against real hands'], ['#45', 'EMG on every revision']]
    });
    /* in the iris: a generic shoulder, the finger following it, the push at a right angle to the surface */
    const P = SHP.round, s = 15, ox = 1380 - 150, oy = 580 - 170, a = ep(t, 1.0, 1.7), u = 0.5 + 0.5 * Math.sin((t - 1.6) * 0.55 - Math.PI / 2), F = shp_follow(P, t < 1.6 ? 0 : u, 2, 30);
    part(ox, oy, s, () => shp_body(P), { alpha: a });
    const nx = Math.sin(F.th), ny = -Math.cos(F.th), cx = ox + F.x * s, cy = oy + F.y * s;
    fingerAt(cx + nx * 5 * s, cy + ny * 5 * s, 5 * s, a);
    arrow(cx, cy, cx + nx * 130, cy + ny * 130, { color: C.hero, w: 4, hs: 18, alpha: a * ep(t, 2.0, 2.4) });
    line(cx - Math.cos(F.th) * 80, cy - Math.sin(F.th) * 80, cx + Math.cos(F.th) * 80, cy + Math.sin(F.th) * 80, { color: C.ink2, w: 2, alpha: a * ep(t, 2.0, 2.4) });
    figLabel(t, 2.2, 1130, 920, 14, 'The push from a curve, at a right angle to it');
  }
});

/* ============================== Newtonian shape analysis ============================== */
S({
  id: 'shp_newton', ch: 'shape', theme: 'paper', title: 'Newtonian shape analysis', settle: 9, ideas: ['newton', 42], after: 'shapecard',
  src: ['shpBrock'],
  draw: t => {
    header(t, 'Newtonian shape analysis');
    captions(t, [[0.6, 'Press a curve and it pushes back at a right angle to itself. Follow the curve 1:1, and its derivative at the edge says where the push sends you.'], [5.4, 'Turn too fast and the finger is thrown off the mouse. Too gently, and there is no shoulder to rest on. Round but defined lands it on the side.']]);
    const cell = bento(LM, 280, RM - LM, 640, 3, 1);
    shp_tile(t, 0.2, cell(0, 0), SHP.sharp, { i: 0, name: 'Sharp shoulder', verdict: 'Off the mouse', off: 32, over: true });
    shp_tile(t, 0.2, cell(1, 0), SHP.soft, { i: 1, name: 'Shoulder too gentle', verdict: 'Nowhere to rest', stop: 7 });
    shp_tile(t, 0.2, cell(2, 0), SHP.round, { i: 2, name: 'Round, defined: Theseus\'s rule', verdict: 'Onto the side', stop: 7, hero: true });
    source(t, 'Generic profiles, drawn from their curvature. The finger follows each 1:1; where a curve turns tighter than the press holds it (2.2 mm), it carries on along the derivative at that edge.', { t0: 2, maxW: 1760 });
  }
});

/* ============================== comfort grooves (#47) ============================== */
/* the button across the finger: a crown (R 30) and, on Theseus, a groove (R 18) that outpaces it. The finger pad spans
   ±7 mm. The surface pushes along its normal: on a crown every push leans outward and spreads the pad; in the groove
   they lean in from both sides and hold it */
const SHP_GR = { Rc: 30, Rg: 18, W: 8.2, pad: 7 };
const shp_gY = (x, g) => { const G0 = SHP_GR, sp = u => 0.25 * Math.log(1 + Math.exp(u / 0.25)); return x * x / (2 * G0.Rc) + (g ? sp((G0.W * G0.W - x * x) / (2 * G0.Rg)) - sp(0) * 0 : 0); };
const shp_gS = (x, g) => (shp_gY(x + 0.01, g) - shp_gY(x - 0.01, g)) / 0.02;
/** the share of the press that pushes sideways at the pad's edge (+ outward), for a groove of curvature cg (1/mm) */
const shp_side = cg => { const s = SHP_GR.pad * (1 / SHP_GR.Rc - cg); return s / Math.hypot(1, s); };
function shp_grooveTile(t, t0, r, g, i) {
  const [x, y, w, h] = r, a = tileA(t, t0, i); if (a <= 0.003) return;
  demoWindow(x, y, w, h, a);
  const s = 16, cx = x + w / 2, oy = y + 262, press = ep(t, 1.6, 2.6, E.io3), X = v => cx + v * s, A = g ? C.hero : C.bad;
  text(g ? 'Comfort groove: Theseus' : 'Plain crown', x + 32, y + 52, { role: 'label', size: 21, color: g ? C.heroText : C.mute, alpha: a });
  text(g ? 'Held in place' : 'Pushed apart', x + 32, y + 108, { role: 'h2', size: 46, color: g ? C.heroText : C.bad, grad: g ? C.heroGrad : null, alpha: a * ep(t, 3.2, 3.7) });
  /* the button, cut */
  part(cx, oy, s, () => {
    const path = () => { G.beginPath(); G.moveTo(-15, shp_gY(-15, g)); for (let v = -15; v <= 15.001; v += 0.1) G.lineTo(v, shp_gY(v, g)); G.lineTo(15, 5.4); G.lineTo(-15, 5.4); G.closePath(); };
    solid(path, MT.shell, [-15, -1, 30, 6.5], { hatch: { sp: 9 } });
  }, { alpha: a });
  /* the finger pad, pressed: its underside takes the surface's shape */
  const sink = 0.5 * press, top = -6.2;
  G.save(); G.globalAlpha = a; G.beginPath(); G.moveTo(X(-7.6), oy + (shp_gY(-7.6, g) - 0.6) * s);
  for (let v = -7.6; v <= 7.601; v += 0.2) G.lineTo(X(v), oy + (shp_gY(v, g) - 0.05) * s);
  G.bezierCurveTo(X(9.0), oy + (shp_gY(7.6, g) - 2.8) * s, X(6), oy + (top - sink) * s, X(0), oy + (top - sink) * s);
  G.bezierCurveTo(X(-6), oy + (top - sink) * s, X(-9.0), oy + (shp_gY(-7.6, g) - 2.8) * s, X(-7.6), oy + (shp_gY(-7.6, g) - 0.6) * s); G.closePath();
  const fg = G.createLinearGradient(0, oy + (top - 1) * s, 0, oy); fg.addColorStop(0, TH ? '#E2E1DC' : '#9A9994'); fg.addColorStop(1, TH ? '#AEADA7' : '#62615C');
  G.fillStyle = fg; G.fill(); G.strokeStyle = TH ? 'rgba(40,40,38,0.5)' : 'rgba(236,235,231,0.4)'; G.lineWidth = 1.5; G.stroke(); G.restore();
  /* the pushes along the normals, and their sideways parts at the pad's edges */
  const kq = ep(t, 2.2, 2.8) * a;
  for (const v of [-6.2, -3.1, 0, 3.1, 6.2]) {
    const sl = shp_gS(v, g), L = Math.hypot(1, sl), nx = sl / L, ny = -1 / L, px = X(v), py = oy + shp_gY(v, g) * s;
    arrow(px, py, px + nx * 82 * press, py + ny * 82 * press, { color: inkA(0.6), w: 2.5, hs: 11, alpha: kq });
  }
  /* the sideways part at each edge of the pad: out from the pad on the crown, in to the pad in the groove */
  for (const sd of [-1, 1]) {
    const v = 6.6 * sd, sl = shp_gS(v, g), nx = sl / Math.hypot(1, sl), L = (60 + 260 * Math.abs(nx)) * press, py = oy + (shp_gY(v, g) - 2.4) * s, ex = X(sd * 9.6);
    if (nx * sd > 0) arrow(ex, py, ex + sd * L, py, { color: A, w: 5, hs: 18, alpha: kq }); else arrow(ex + sd * L, py, ex, py, { color: A, w: 5, hs: 18, alpha: kq });
  }
  cursorAt(t, [[1.0, [cx + 70, oy - 200]], [1.6, [cx + 10, oy - 6.4 * s]], [2.6, [cx + 10, oy - 5.9 * s]], [20, [cx + 10, oy - 5.9 * s]]], [1.65], { a: ep(t, 0.8, 1.1) });
  const sh = Math.round(shp_side(g ? 1 / SHP_GR.Rg : 0) * 100);
  text((sh > 0 ? 'Outward ' : 'Inward ') + Math.abs(sh) + ' % of the press, at the pad\'s edge', x + 32, y + h - 26, { role: 'small', size: 25, weight: 700, color: g ? C.heroText : C.ink2, alpha: a * ep(t, 3.4, 3.8) });
}
S({
  id: 'grooves', ch: 'shape', theme: 'night', title: 'Comfort grooves', settle: 9, ideas: [47, 'newton'],
  src: ['shpBrock', 'kuijt'],
  draw: t => {
    header(t, 'Comfort grooves');
    captions(t, [[0.6, 'On a plain crown every push leans outward, so pressing spreads the finger off the middle of the button.'], [4.6, 'A groove puts a slope on each side of the pad. The pushes meet in the middle and hold it, as soon as the groove outpaces the crown.']]);
    shp_grooveTile(t, 0.2, [LM, 280, 840, 400], false, 0);
    shp_grooveTile(t, 0.2, [LM + 880, 280, 880, 400], true, 1);
    /* the glance: the sideways push flips inward */
    const out = Math.round(shp_side(0) * 100), inn = -Math.round(shp_side(1 / SHP_GR.Rg) * 100);
    own_ba(t, 3.6, LM, 856, out + ' % out', inn + ' % in', { sb: 60, sa: 112, label: 'Sideways push at the edge of the pad', net: 'The push turns inward and holds the finger' });
    /* the chart: the push against the groove's curvature, crossing zero where the groove outpaces the crown */
    const cx = LM + 880, cy = 720, cw = 880, ch = 220, ka = tileA(t, 4.0, 0);
    demoWindow(cx, cy, cw, ch, ka);
    const gx = cx + 120, gw = cw - 160, gy = cy + 36, gh = ch - 92, xr = [0, 0.08], yr = [-0.3, 0.3], GX = v => gx + gw * (v - xr[0]) / (xr[1] - xr[0]), GY = v => gy + gh * (1 - (v - yr[0]) / (yr[1] - yr[0]));
    rr(GX(1 / SHP_GR.Rc), gy, GX(xr[1]) - GX(1 / SHP_GR.Rc), gh, 3, rgba(C.hero, TH ? 0.12 : 0.16), null, 0, ka);
    line(gx, GY(0), gx + gw, GY(0), { color: C.faint, w: 1.5, alpha: ka });
    text('Outward', gx - 14, GY(0.2) + 7, { role: 'label', size: 19, color: C.mute, align: 'right', alpha: ka });
    text('Inward', gx - 14, GY(-0.2) + 7, { role: 'label', size: 19, color: C.heroText, align: 'right', alpha: ka });
    const pts = []; for (let v = xr[0]; v <= xr[1] + 1e-9; v += 0.001) pts.push([GX(v), GY(shp_side(v))]);
    poly(pts.slice(0, Math.max(2, Math.round(pts.length * ep(t, 4.3, 5.6, E.lin)))), { color: C.ink, w: 3, alpha: ka });
    const kz = ep(t, 5.4, 5.9);
    line(GX(1 / SHP_GR.Rc), gy, GX(1 / SHP_GR.Rc), gy + gh, { color: C.ink2, w: 1.5, alpha: kz * ka, dash: [6, 5] });
    text('Groove = crown', GX(1 / SHP_GR.Rc) - 10, gy + 20, { role: 'label', size: 19, color: C.ink2, align: 'right', alpha: kz * ka });
    circle(GX(0), GY(shp_side(0)), 8, { fill: C.bad, alpha: kz * ka });
    heroMark(GX(1 / SHP_GR.Rg), GY(shp_side(1 / SHP_GR.Rg)), 12, kz * ka);
    text('Theseus', GX(1 / SHP_GR.Rg) + 20, GY(shp_side(1 / SHP_GR.Rg)) + 8, { role: 'label', size: 20, color: C.heroText, alpha: kz * ka });
    text('Groove curvature, 1/R', gx + gw, gy + gh + 34, { role: 'label', size: 19, color: C.mute, align: 'right', alpha: ka });
    text('Right of the line holds the finger', gx, gy + gh + 34, { role: 'label', size: 19, color: C.heroText, alpha: ka });
    source(t, 'Derived: the push is along the normal; at the pad\'s edge, 7 mm off the middle, its sideways share is the sine of the tilt. Crown R 30, groove R 18, generic. Shallow near the front (#47).', { t0: 2, maxW: 1760 });
  }
});

/* ============================== sized against real hands ============================== */
const SHP_HAND = 193.7;   /* mm: ANSUR II, mean male hand length (the deck's partial sample) */
S({
  id: 'size', ch: 'shape', theme: 'paper', title: 'Sized against real hands', settle: 9, ideas: ['size', 40, 38, 39, 43], after: 'grooves',
  src: ['ansur', 'elo', 'tpuGpx2front', 'coelho', 'shpBrock'],
  draw: t => {
    header(t, 'Sized against real hands');
    captions(t, [[0.6, 'Hand size moves muscle activity more than mouse geometry does, so the size is the first decision.'], [4.6, 'A flat mouse is better a little too small than too big: a big hand can still fingertip a small mouse, a small hand cannot palm a big one.']]);
    const L = THESEUS.dims[0], pc = L / SHP_HAND * 100;
    own_ba(t, 1.0, LM, 520, null, fmtN(pc, 1), { unit: '%', sa: 190, label: 'Theseus\'s length, against the average hand', net: fmtN(L, 1) + ' mm on a ' + fmtN(SHP_HAND, 1) + ' mm hand, the shortest of the flagships' });
    const cell = bento(LM, 680, 640, 280, 2, 1);
    statTile(t, 1.8, cell(0, 0), { value: fmtN(THESEUS.dims[1], 1), unit: 'mm', label: 'Width', quiet: true, count: false });
    statTile(t, 1.9, cell(1, 0), { value: fmtN(THESEUS.dims[2], 1), unit: 'mm', label: 'Height', quiet: true, count: false });
    /* the chart: length as a share of the hand, Theseus against the flagships */
    const rx = LM + 720, rw = RM - rx, ry = 280, rh = 680, ka = tileA(t, 0.3, 0);
    demoWindow(rx, ry, rw, rh, ka);
    cardHead(t, 0.5, rx, ry, rw, 'Length as a share of the hand', [{ ev: 'datasheet', by: 'Maker' }]);
    const ids = [['razer-viper-v4-pro', 'Viper V4 Pro'], ['logitech-gpx2', 'G Pro X Superlight 2'], ['finalmouse-ulx', 'UltralightX']];
    const rows = ids.map(([id, nm]) => { const m = exMouse(id); return m ? { label: nm, v: rv(m.length_mm) / SHP_HAND * 100, mm: rv(m.length_mm) } : null; }).filter(Boolean);
    rows.push({ label: 'Theseus', v: pc, mm: L, hero: true });
    own_bars(t, 1.2, rx + 40, ry + 130, rw - 80, rows.map((r, i) => ({ label: r.label + ', ' + fmtN(r.mm, 1) + ' mm', v: r.v - 55, s: fmtN(r.v, 1) + ' %', kind: r.hero ? 'hero' : i === rows.length - 2 ? 'second' : 'comp' })), { max: 12, title: 'Share of the hand, bars from 55 %', better: 'Smaller fits more hands', rh: 80 });
    glossBox(t, 3.4, rx + 40, ry + rh - 186, rw - 80, 'Shape rules', 'A lower front (#40) puts the fingers near the pad; a straighter, pointier front (#38); sides that look straight from above (#39); a slightly wider hump over a slimmer grip (#43).', { size: 25 });
    source(t, 'ANSUR II mean male hand length, 193.7 mm (partial sample). Lengths: maker datasheets. Coelho & Lourenço 2021: hand size outweighed device geometry.', { t0: 2 });
  }
});

/* ============================== EMG on every revision (#45) ============================== */
S({
  id: 'emg', ch: 'shape', theme: 'night', title: 'EMG on every shape revision', settle: 9, ideas: [45], after: 'size',
  src: ['wang23', 'liwang', 'tang23'],
  draw: t => {
    header(t, 'EMG on every shape revision');
    captions(t, [[0.6, 'The forearm extensors carry the aim, and in pro players they never rest. Electrodes on the skin read how hard they work.'], [4.8, 'So every shape revision is measured on players, with aim and comfort scored beside it: EMG alone misses what comfort catches.']]);
    const x0 = LM, y0 = 280, w0 = 960, h0 = 640, ka = tileA(t, 0.15, 0);
    demoWindow(x0, y0, w0, h0, ka);
    cardHead(t, 0.35, x0, y0, w0, 'Surface EMG, two forearm muscles, a flick task', []);
    text('Signal illustrative', x0 + w0 - 32, y0 + 400, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: ka });
    const tr = [['Extensor digitorum', 1.0], ['Extensor carpi radialis', 0.72]];
    tr.forEach(([nm, amp], i) => {
      const yy = y0 + 170 + i * 150, xA = x0 + 330, xB = x0 + w0 - 40, k = ep(t, 0.8 + i * 0.3, 1.2 + i * 0.3) * ka;
      text(nm, x0 + 32, yy + 8, { role: 'small', size: 25, weight: 700, color: C.ink, alpha: k });
      G.save(); G.globalAlpha = k; G.beginPath(); G.strokeStyle = C.ink2; G.lineWidth = 1.6;
      for (let xx = xA; xx <= xB; xx += 1.5) { const u = (xx - xA) / (xB - xA), tt = u * 6 + t * 0.8, burst = Math.pow(Math.max(0, Math.sin(tt * 2.1)), 6), n = ((Math.sin(xx * 12.9898 + Math.floor(t * 30) * 0.7) * 43758.5453) % 1), v = (0.15 + burst) * amp * n * 46; xx === xA ? G.moveTo(xx, yy + v) : G.lineTo(xx, yy + v); }
      G.stroke(); G.restore();
    });
    /* what the study found, as bars */
    const by = y0 + 450;
    own_bars(t, 2.4, x0 + 32, by, w0 - 64, [
      { label: 'Extensor digitorum', v: 5, s: '> 5 %', kind: 'comp' },
      { label: 'Extensor carpi radialis', v: 5, s: '> 5 %', kind: 'comp' }
    ], { max: 10, title: 'Of their maximum force, the whole time they played', better: 'Wang 2023, n = 16', rh: 64 });
    /* right: the glance, and the plan */
    const rx = x0 + w0 + 40, rw = RM - rx;
    own_ba(t, 1.0, rx, 440, null, 'Every', { unit: 'revision', sa: 140, label: 'Measured with EMG on players', net: 'Today only Zowie tests its shapes on muscle activity (Brock).' });
    const steps = [['16 players or more', 'Split by hand size and grip: medium hands are the most sensitive to shape.'], ['EMG and fatigue', 'Static load across a session, on the extensors that aim.'], ['Comfort, scored', 'EMG alone missed 5 mm hump changes that comfort caught (Li & Wang 2025).']];
    let yy = 540; steps.forEach(([hd, b], i) => { const r = noteBox(t, 2.0 + i * 0.3, rx, yy, rw, { head: hd, body: b, size: 25, pad: 26 }); yy += r.h + 16; });
    source(t, 'Wang et al. 2023: pro Overwatch players, two extensors above 5 % of maximum voluntary contraction throughout. Li & Wang 2025. Tang 2023: five ZOWIE shapes, n = 16.', { t0: 2, maxW: 1760 });
  }
});
