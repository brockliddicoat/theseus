/* ============================================================================================
   model: the mouse, built from numbers. Units are millimetres; x right, y up, z forward (front = +z).
   Shape targets from the doc: 2-4% smaller than a GPX 2 / Viper V3 Pro (121 x 62 x 38.5 mm here), a low front,
   a straight and slightly pointed Sora V2-style front, reduced front flare, defined shoulders, comfort grooves
   that shallow out toward the front, straight rear trigger cutouts, a thumb side that curves in more than
   the pinky side (looks symmetric from the top).
   ============================================================================================ */
const MS = { L: 121, HW: 31.0, PEAK: 38.5 };
/** 1D Catmull-Rom through sorted [x, y] points */
function cr(pts, x) {
  if (x <= pts[0][0]) return pts[0][1];
  if (x >= pts[pts.length - 1][0]) return pts[pts.length - 1][1];
  let i = 1; while (pts[i][0] < x) i++;
  const p0 = pts[Math.max(0, i - 2)], p1 = pts[i - 1], p2 = pts[i], p3 = pts[Math.min(pts.length - 1, i + 1)];
  const t = (x - p1[0]) / (p2[0] - p1[0]);
  const m1 = (p2[1] - p0[1]) / (p2[0] - p0[0]) * (p2[0] - p1[0]), m2 = (p3[1] - p1[1]) / (p3[0] - p1[0]) * (p2[0] - p1[0]);
  const t2 = t * t, t3 = t2 * t;
  return (2 * t3 - 3 * t2 + 1) * p1[1] + (t3 - 2 * t2 + t) * m1 + (-2 * t3 + 3 * t2) * p2[1] + (t3 - t2) * m2;
}
const SHAPE = {
  /* top-view half width as a share of HW, back (0) to front (1) */
  w: [[0, 0], [0.012, 0.42], [0.04, 0.70], [0.09, 0.87], [0.17, 0.965], [0.28, 1.0], [0.40, 0.985], [0.52, 0.955], [0.62, 0.95], [0.74, 0.958], [0.85, 0.958], [0.92, 0.935], [0.962, 0.86], [0.985, 0.66], [0.996, 0.36], [1, 0]],
  /* height profile in mm: hump a touch behind centre and raised for claw, low front */
  h: [[0, 6], [0.03, 14.5], [0.08, 23.5], [0.16, 31.5], [0.26, 36.6], [0.37, 38.5], [0.46, 37.8], [0.56, 35.0], [0.66, 30.2], [0.76, 25.0], [0.86, 19.8], [0.94, 15.6], [0.985, 13.0], [1, 11.8]]
};
const SP = { uc: 0.52, smile: 0, groove: 1, asym: 1, frontH: 1, n1: 3.0, n2: 2.35 };
function halfW(zn) { return Math.max(0, cr(SHAPE.w, zn)) * MS.HW; }
function heightAt(zn) { const h = cr(SHAPE.h, zn); const k = clamp((zn - 0.7) / 0.3); return h * (1 - (1 - SP.frontH) * k); }
const zOf = zn => (zn - 0.5) * MS.L;
/** grooves: deepest around 72% of the length, shallow to nothing at the front so the front cutouts stay flat */
function grooveDepth(zn) { const a = smooth(clamp((zn - 0.55) / 0.12)), b = 1 - smooth(clamp((zn - 0.84) / 0.13)); return 0.95 * a * b * SP.groove; }
/** a point on the shell: zn along the length, v around the section (0 right base, 0.5 top, 1 left base) */
function shellPt(zn, v) {
  const a = halfW(zn), b = heightAt(zn), th = v * Math.PI, c = Math.cos(th), s = Math.sin(th);
  let x = a * Math.sign(c) * Math.pow(Math.abs(c), 2 / SP.n1), y = b * Math.pow(Math.abs(s), 2 / SP.n2);
  const ty = y / Math.max(b, 1e-3);
  const lean = x < 0 ? 0.125 + 0.03 * SP.asym : 0.105 - 0.015 * SP.asym; /* thumb side curves in more than the pinky side */
  x *= 1 - lean * Math.pow(ty, 1.7);
  if (zn > 0.5 && a > 1) { const r = Math.abs(x) / a, g = Math.exp(-Math.pow((r - 0.42) / 0.17, 2)) * smooth(clamp((ty - 0.55) / 0.3)); y -= grooveDepth(zn) * g; }
  return [x, y + 1.0, zOf(zn)];
}
function ucAt(v) { const k = (v - 0.5) / 0.32; return SP.uc - SP.smile * 0.05 * Math.max(0, 1 - k * k); }
const VS = 0.2;      /* where the side wall meets the trigger */
function gcAt(u) {   /* half gap between the triggers; opens into the wheel slot */
  const k = smooth(clamp((u - 0.68) / 0.025)) * (1 - smooth(clamp((u - 0.86) / 0.025)));
  return 0.0045 + 0.026 * k;
}

/* ---------- geometry builders ---------- */
function gridMesh(nu, nv, fn, uvfn) {
  const P = [], U = [], I = [];
  for (let i = 0; i <= nu; i++) for (let j = 0; j <= nv; j++) { const s = i / nu, t = j / nv; const r = fn(s, t); P.push(r[0], r[1], r[2]); const q = uvfn ? uvfn(s, t) : [s, t]; U.push(q[0], q[1]); }
  for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) { const a = i * (nv + 1) + j, b = a + nv + 1; I.push(a, b, a + 1, b, b + 1, a + 1); }
  return { P, U, I, N: normalsOf(P, I) };
}
function normalsOf(P, I) {
  const N = new Array(P.length).fill(0);
  for (let k = 0; k < I.length; k += 3) {
    const a = I[k] * 3, b = I[k + 1] * 3, c = I[k + 2] * 3;
    const e1 = [P[b] - P[a], P[b + 1] - P[a + 1], P[b + 2] - P[a + 2]], e2 = [P[c] - P[a], P[c + 1] - P[a + 1], P[c + 2] - P[a + 2]];
    const n = cross(e1, e2);
    for (const idx of [a, b, c]) { N[idx] += n[0]; N[idx + 1] += n[1]; N[idx + 2] += n[2]; }
  }
  for (let i = 0; i < N.length; i += 3) { const l = Math.hypot(N[i], N[i + 1], N[i + 2]) || 1; N[i] /= l; N[i + 1] /= l; N[i + 2] /= l; }
  return N;
}
function toMesh(g) { return mesh(g.P, g.N, g.U, g.I); }
/** a box centred at the origin, faces with their own uvs */
function boxGeo(sx, sy, sz) {
  const P = [], N = [], U = [], I = []; const hx = sx / 2, hy = sy / 2, hz = sz / 2;
  const faces = [[[1, 0, 0], [0, 0, -1], [0, 1, 0]], [[-1, 0, 0], [0, 0, 1], [0, 1, 0]], [[0, 1, 0], [1, 0, 0], [0, 0, -1]], [[0, -1, 0], [1, 0, 0], [0, 0, 1]], [[0, 0, 1], [1, 0, 0], [0, 1, 0]], [[0, 0, -1], [-1, 0, 0], [0, 1, 0]]];
  for (const [n, a, b] of faces) {
    const base = P.length / 3; const h = [hx, hy, hz];
    for (const [i, j] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      for (let k = 0; k < 3; k++) P.push((n[k] + a[k] * i + b[k] * j) * h[k]);
      N.push(...n); U.push((i + 1) / 2, (j + 1) / 2);
    }
    I.push(base, base + 1, base + 2, base, base + 2, base + 3);
  }
  return { P, N, U, I };
}
/** a cylinder along y, radius r (or fn(phi, y) -> r), height h, centred */
function cylGeo(r, h, seg = 40, caps = true) {
  const rf = typeof r === 'function' ? r : () => r;
  const g = gridMesh(seg, 1, (s, t) => { const ph = s * Math.PI * 2, y = (t - 0.5) * h, rr = rf(ph, t); return [Math.cos(ph) * rr, y, Math.sin(ph) * rr]; }, (s, t) => [s, t]);
  if (caps) for (const side of [-1, 1]) {
    const c = g.P.length / 3; g.P.push(0, side * h / 2, 0); g.N.push(0, side, 0); g.U.push(0.5, 0.5);
    for (let i = 0; i <= seg; i++) { const ph = i / seg * Math.PI * 2, rr = rf(ph, side > 0 ? 1 : 0); g.P.push(Math.cos(ph) * rr, side * h / 2, Math.sin(ph) * rr); g.N.push(0, side, 0); g.U.push(0.5 + Math.cos(ph) / 2, 0.5 + Math.sin(ph) / 2); }
    for (let i = 0; i < seg; i++) side > 0 ? g.I.push(c, c + 2 + i, c + 1 + i) : g.I.push(c, c + 1 + i, c + 2 + i);
  }
  return g;
}
/** a flat slab following the base outline (inset by `ins` mm), between y0 and y1, from zn a to b; uv = top-view position */
function outlineSlab(ins, y0, y1, a = 0.01, b = 0.99, n = 90) {
  const P = [], U = [], I = [];
  for (const [yy, up] of [[y1, 1], [y0, -1]]) {
    const base = P.length / 3;
    for (let i = 0; i <= n; i++) {
      const zn = lerp(a, b, i / n), w = Math.max(0, halfW(zn) - ins), z = zOf(zn);
      for (const sx of [-1, 1]) { P.push(sx * w, yy, z); U.push((sx * w + 34) / 68, (z + 62) / 124); }
    }
    for (let i = 0; i < n; i++) { const k = base + i * 2; up > 0 ? I.push(k, k + 2, k + 1, k + 1, k + 2, k + 3) : I.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
  }
  const N = []; for (let i = 0; i < P.length / 3; i++) N.push(0, i < P.length / 6 ? 1 : -1, 0);
  return { P, N, U, I };
}
/** a tube along a polyline */
function tubeGeo(pts, r, seg = 12) {
  const P = [], U = [], I = [];
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i], q = pts[Math.min(pts.length - 1, i + 1)], o = pts[Math.max(0, i - 1)];
    const tng = norm(sub(q, o)); let ref = Math.abs(tng[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
    const n1 = norm(cross(tng, ref)), n2 = cross(tng, n1);
    for (let j = 0; j <= seg; j++) { const a = j / seg * Math.PI * 2; const d = add(scl(n1, Math.cos(a) * r), scl(n2, Math.sin(a) * r)); P.push(...add(p, d)); U.push(i / (pts.length - 1), j / seg); }
  }
  for (let i = 0; i < pts.length - 1; i++) for (let j = 0; j < seg; j++) { const a = i * (seg + 1) + j, b = a + seg + 1; I.push(a, b, a + 1, b, b + 1, a + 1); }
  return { P, U, I, N: normalsOf(P, I) };
}

/* ---------- textures ---------- */
function canvasOf(w, h, fn) { const c = document.createElement('canvas'); c.width = w; c.height = h; fn(c.getContext('2d'), w, h); return c; }
function pcbTexture() {
  return canvasOf(512, 1024, (g, w, h) => {
    g.fillStyle = '#0e1712'; g.fillRect(0, 0, w, h);
    /* geometric triangle field (#63): the PCB is visible with the bottom rim off, so its bottom is designed */
    g.strokeStyle = 'rgba(214,170,80,0.55)'; g.lineWidth = 2;
    const s = 46, hh = s * Math.sqrt(3) / 2;
    for (let r = 0; r * hh < h + hh; r++) for (let c = -1; c * s < w + s; c++) {
      const x = c * s + (r % 2 ? s / 2 : 0), y = r * hh;
      if ((r * 7 + c * 3) % 5 === 0) { g.beginPath(); g.moveTo(x, y); g.lineTo(x + s, y); g.lineTo(x + s / 2, y + hh); g.closePath(); g.stroke(); }
    }
    /* gold edge trim */
    g.strokeStyle = 'rgba(226,174,79,0.95)'; g.lineWidth = 10; g.strokeRect(14, 14, w - 28, h - 28);
    /* traces */
    g.strokeStyle = 'rgba(214,170,80,0.35)'; g.lineWidth = 3;
    for (let i = 0; i < 14; i++) { g.beginPath(); const x = 80 + i * 26; g.moveTo(x, 120); g.lineTo(x, 380 + i * 8); g.lineTo(x + 60, 440 + i * 8); g.lineTo(x + 60, 820); g.stroke(); }
    /* power switch labels (#100) */
    g.fillStyle = 'rgba(236,235,229,0.85)'; g.font = '700 30px sans-serif'; g.fillText('ON', 70, 930); g.fillText('OFF', 380, 930);
    g.fillRect(150, 905, 210, 30); g.fillStyle = '#0e1712'; g.fillRect(156, 911, 96, 18);
  });
}
function plateMask() {
  /* bottom plate: a triangle lattice (#75); alpha 0 = cut out */
  return canvasOf(512, 1024, (g, w, h) => {
    g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); g.globalCompositeOperation = 'destination-out';
    const s = 44, hh = s * Math.sqrt(3) / 2, m = 5;
    for (let r = 2; r * hh < h - 80; r++) for (let c = 0; c * s < w; c++) {
      const x = c * s + (r % 2 ? s / 2 : 0) + 6, y = r * hh;
      if (x < 70 || x > w - 110 || (y > 430 && y < 600 && x > 170 && x < 330)) continue; /* rim and the sensor window stay solid */
      for (const up of [0, 1]) {
        g.beginPath();
        if (!up) { g.moveTo(x + m * 1.7, y + hh - m); g.lineTo(x + s - m * 1.7, y + hh - m); g.lineTo(x + s / 2, y + m * 1.8); }
        else { g.moveTo(x + s / 2 + m * 1.7, y + m); g.lineTo(x + s * 1.5 - m * 1.7, y + m); g.lineTo(x + s, y + hh - m * 1.8); }
        g.closePath(); g.fill();
      }
    }
  });
}

/* ---------- the rig ---------- */
const RIG = { parts: [], byName: {}, key: '', ready: false, tex: {}, screenCv: null };
function addPart(name, geo, o) {
  const p = Object.assign({ name, mesh: toMesh(geo), M0: M4.id(), col: [0.085, 0.088, 0.095], ex: [0, 0, 0], grp: 'int', iso: 0, isoN: [4, 4] }, o);
  if (RIG.byName[name]) RIG.parts[RIG.parts.indexOf(RIG.byName[name])] = p; else RIG.parts.push(p);
  RIG.byName[name] = p; return p;
}
const SHELL_COL = [0.105, 0.108, 0.115];
function buildShell() {
  const isoN = [MS.L / 5, 30];
  const uvS = (u, v) => [u, v];
  const nu = 110;
  /* rear shell: back to the rear trigger cutout (which may be a "smile") */
  addPart('shell', gridMesh(70, 96, (s, t) => { const v = t, u = lerp(0.003, ucAt(v), s); return shellPt(u, v); }, (s, t) => uvS(lerp(0.003, ucAt(t), s), t)), { grp: 'shell', col: SHELL_COL, iso: 1, isoN, ex: [0, 46, -10], spec: 0.35 });
  for (const side of [0, 1]) {
    const v0 = side ? 1 - VS : 0, v1 = side ? 1 : VS;
    addPart(side ? 'sideL' : 'sideR', gridMesh(56, 14, (s, t) => { const v = lerp(v0, v1, t), u = lerp(ucAt(v), 1.0, s); return shellPt(u, v); }, (s, t) => { const v = lerp(v0, v1, t); return uvS(lerp(ucAt(v), 1.0, s), v); }), { grp: 'shell', col: SHELL_COL, iso: 1, isoN, ex: [side ? -26 : 26, 40, 6], spec: 0.35 });
  }
  for (const side of [0, 1]) {
    const gS = 0.006;
    const vr = (u, t) => side ? lerp(0.5 + gcAt(u), 1 - VS - gS, t) : lerp(VS + gS, 0.5 - gcAt(u), t);
    addPart(side ? 'trigL' : 'trigR', gridMesh(64, 30, (s, t) => { const u = lerp(SP.uc + 0.006, 1.0, s); return shellPt(Math.max(u, ucAt(vr(u, t)) + 0.006), vr(u, t)); }, (s, t) => { const u = lerp(SP.uc + 0.006, 1.0, s); return uvS(u, vr(u, t)); }), { grp: 'trig', col: [0.11, 0.113, 0.12], iso: 1, isoN, ex: [side ? -6 : 6, 72, 4], spec: 0.35 });
  }
}
function buildRig() {
  RIG.tex.pcb = texFromCanvas(pcbTexture()); RIG.tex.plate = texFromCanvas(plateMask());
  buildShell();
  RIG.key = shapeKey();
  const zs = zn => zOf(zn);
  addPart('plate', outlineSlab(1.2, 0.8, 1.6, 0.012, 0.99), { grp: 'bottom', col: [0.07, 0.072, 0.077], tex: RIG.tex.plate, texMode: 2, ex: [0, -26, 0], iso: 0 });
  addPart('pcb', outlineSlab(4.2, 2.4, 3.6, 0.075, 0.935), { grp: 'elec', col: [0.06, 0.1, 0.075], tex: RIG.tex.pcb, texMode: 1, ex: [0, 8, 0] });
  for (const [nm, x] of [['swL', -12.8], ['swR', 12.8]]) {
    const p = addPart(nm, boxGeo(5.8, 6.5, 12.8), { grp: 'click', col: [0.16, 0.16, 0.17], ex: [x > 0 ? 6 : -6, 30, 0], iso: 0.35, isoN: [3, 3] });
    p.M0 = M4.tr(x, 3.6 + 3.25, zs(0.82));
    const pl = addPart(nm.replace('sw', 'pl'), cylGeo(1.15, 1.6, 20), { grp: 'click', col: [0.78, 0.77, 0.72], ex: [x > 0 ? 6 : -6, 30, 0] });
    pl.M0 = M4.tr(x, 3.6 + 6.5 + 0.8, zs(0.82) + 2.6);
  }
  /* a second plunger per trigger, as far from the first as the trigger allows (#3), and POM pads either side of the main plunger (#28) */
  for (const [nm, x] of [['pqL', -4.8], ['pqR', 4.8]]) {
    const zn = 0.935, top = heightAt(zn) + 1 - 1.4, bot = 3.6 + 0.6, h = top - bot;
    const q = addPart(nm, cylGeo(1.0, h, 18), { grp: 'dual', col: [0.78, 0.77, 0.72], ex: [x > 0 ? 6 : -6, 60, 0] });
    q.M0 = M4.tr(x, bot + h / 2, zOf(zn));
    const pad = addPart(nm + 'pad', boxGeo(3.2, 0.6, 3.2), { grp: 'dual', col: [0.92, 0.9, 0.86] }); pad.M0 = M4.tr(x, 3.6 + 0.3, zOf(zn));
  }
  for (const [nm, x] of [['pomL1', -15.9], ['pomL2', -9.7], ['pomR1', 9.7], ['pomR2', 15.9]]) {
    const pd = addPart(nm, boxGeo(0.8, 3.4, 4.2), { grp: 'pom', col: [0.93, 0.92, 0.88], ex: [x > 0 ? 6 : -6, 30, 0] });
    pd.M0 = M4.tr(x, 3.6 + 6.5 + 1.2, zOf(0.82) + 2.6);
  }
  /* scroll wheel: 6 spokes inside, a knurled tyre (5 rows), POM axle */
  const R = 10.2;
  const wheel = addPart('wheel', cylGeo((ph, t) => R + 0.45 * Math.pow(Math.abs(Math.sin(ph * 18)), 3), 7, 144), { grp: 'wheel', col: [0.86, 0.85, 0.82], ex: [0, 34, 0], iso: 0.5, isoN: [36, 5], spec: 0.5 });
  wheel.M0 = M4.mul(M4.tr(0, heightAt(0.765) + 1 + 3.2 - R, zs(0.765)), M4.rz(Math.PI / 2));
  const axle = addPart('axle', cylGeo(1.2, 15, 16), { grp: 'wheel', col: [0.9, 0.88, 0.82], ex: [0, 34, 0] });
  axle.M0 = M4.mul(M4.tr(0, heightAt(0.765) + 1 + 3.2 - R, zs(0.765)), M4.rz(Math.PI / 2));
  const enc = addPart('encoder', boxGeo(4.5, 12, 12), { grp: 'wheel', col: [0.14, 0.14, 0.15], ex: [10, 22, 0], isoN: [3, 3], iso: 0.3 });
  enc.M0 = M4.tr(8.6, 3.6 + 6, zs(0.765));
  const sen = addPart('sensor', boxGeo(9, 3, 9), { grp: 'sensor', col: [0.12, 0.12, 0.13], ex: [0, -14, 0], iso: 0.4, isoN: [3, 3] });
  sen.M0 = M4.tr(0, 2.4 - 1.5, zs(0.515));
  const lens = addPart('lens', cylGeo(3.1, 1.2, 28), { grp: 'sensor', col: [0.55, 0.62, 0.68], ex: [0, -20, 0], spec: 0.9 });
  lens.M0 = M4.tr(0, 0.85, zs(0.515));
  const bat = addPart('battery', boxGeo(18, 5.2, 27), { grp: 'elec', col: [0.13, 0.13, 0.14], ex: [0, 26, -16], iso: 0.3, isoN: [5, 6] });
  bat.M0 = M4.tr(0, 3.6 + 2.6, zs(0.24));
  const mcu = addPart('mcu', boxGeo(6, 0.9, 6), { grp: 'elec', col: [0.1, 0.1, 0.11], ex: [0, 10, 0] });
  mcu.M0 = M4.tr(-6, 4.1, zs(0.62));
  const ant = addPart('antenna', boxGeo(18, 0.6, 3.2), { grp: 'elec', col: [0.85, 0.66, 0.3], ex: [0, 10, 12] });
  ant.M0 = M4.tr(0, 3.9, zs(0.905));
  /* side buttons on rails with a divider between them (#29, #80): thin plates that follow the left wall */
  for (const [nm, z0, z1] of [['sb1', 0.535, 0.645], ['sb2', 0.405, 0.515]]) {
    const g = gridMesh(16, 6, (s, t) => { const zn = lerp(z0, z1, s), b = heightAt(zn); const yy = lerp(15.5, 21.5, t); const v = 1 - Math.asin(Math.pow(clamp((yy - 1) / b, 0, 0.999), SP.n2 / 2)) / Math.PI; const q = shellPt(zn, v); q[0] -= 0.9; return q; }, (s, t) => [s, t]);
    addPart(nm, g, { grp: 'side', col: [0.13, 0.13, 0.14], ex: [-24, 8, 0], iso: 0.15, isoN: [4, 2], spec: 0.5 });
  }
  /* skates: two dots per corner (#10) */
  const dots = [[-19, 0.12], [-11.5, 0.085], [19, 0.12], [11.5, 0.085], [-22, 0.86], [-15, 0.9], [22, 0.86], [15, 0.9]];
  dots.forEach(([x, zn], i) => { const s = addPart('skate' + i, cylGeo(3.25, 0.8, 30), { grp: 'glide', col: [0.92, 0.91, 0.88], ex: [0, -40, 0], spec: 0.3 }); s.M0 = M4.tr(x, 0.4, zs(zn)); });
  /* screws away from the skates (#52), brass heat-set inserts above them (#101) */
  [[-21, 0.33], [21, 0.33], [-17, 0.7], [17, 0.7]].forEach(([x, zn], i) => {
    const sc = addPart('screw' + i, cylGeo(1.9, 1.4, 20), { grp: 'repair', col: [0.55, 0.56, 0.58], ex: [0, -58, 0], spec: 0.8 }); sc.M0 = M4.tr(x, 0.9, zs(zn));
    const ins = addPart('insert' + i, cylGeo(1.6, 3.0, 20), { grp: 'repair', col: [0.85, 0.64, 0.28], ex: [0, 14, 0], spec: 0.9 }); ins.M0 = M4.tr(x, 5.6, zs(zn));
  });
  buildDongle();
  RIG.ready = true;
}
function buildDongle() {
  const d = addPart('dongle', boxGeo(42, 9, 16), { grp: 'dongle', col: [0.09, 0.09, 0.1], iso: 0.25, isoN: [6, 3] });
  d.M0 = M4.tr(0, 4.5, 0);
  RIG.screenCv = canvasOf(512, 192, () => { });
  const sg = { P: [-14, 0, -5.2, 14, 0, -5.2, 14, 0, 5.2, -14, 0, 5.2], N: [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0], U: [0, 1, 1, 1, 1, 0, 0, 0], I: [0, 2, 1, 0, 3, 2] };
  const s = addPart('dscreen', sg, { grp: 'dongle', col: [0.02, 0.02, 0.02] });
  s.M0 = M4.tr(-4, 9.06, 0);
  RIG.tex.screen = texFromCanvas(RIG.screenCv); s.tex = RIG.tex.screen; s.texMode = 1;
  for (const [nm, x] of [['dbtn1', 15], ['dbtn2', 19.5]]) { const b = addPart(nm, cylGeo(1.6, 1.2, 18), { grp: 'dongle', col: [0.75, 0.74, 0.7] }); b.M0 = M4.tr(x, 9.4, 0); }
  for (const [nm, x] of [['dport1', -21.2], ['dport2', 21.2]]) { const b = addPart(nm, boxGeo(0.6, 3.2, 9), { grp: 'dongle', col: [0.0, 0.0, 0.0] }); b.M0 = M4.tr(x, 4.5, 0); }
}
/** draw text onto the dongle's screen (monochrome, low resolution on purpose) */
function dongleScreen(lines) {
  const key = JSON.stringify(lines); if (RIG.screenKey === key) return; RIG.screenKey = key;
  const g = RIG.screenCv.getContext('2d'); g.fillStyle = '#040505'; g.fillRect(0, 0, 512, 192);
  g.fillStyle = '#e7e6e1'; g.textBaseline = 'middle';
  lines.forEach((l, i) => { g.font = `${l.w || 600} ${l.s || 54}px ${FONT.mono}`; g.textAlign = l.a || 'left'; g.fillText(l.t, l.x == null ? 34 : l.x, l.y == null ? 60 + i * 70 : l.y); });
  texFromCanvas(RIG.screenCv, RIG.tex.screen);
}
function shapeKey() { return [SP.uc, SP.smile, SP.groove, SP.asym, SP.frontH].map(v => v.toFixed(3)).join(','); }
/** rebuild the shell when the shape parameters changed (only slides that morph the shape do this) */
function shellSync(params) {
  Object.assign(SP, { smile: 0, groove: 1, asym: 1, frontH: 1 }, params || {});
  for (const k of ['smile', 'groove', 'asym', 'frontH']) SP[k] = Math.round(SP[k] * 40) / 40;
  const key = shapeKey(); if (key !== RIG.key) { buildShell(); RIG.key = key; }
}
/** a part's world transform for state s */
function partM(p, s) {
  let M = p.M0;
  const ex = s.explode || 0, k = (s.exp && s.exp[p.grp] != null) ? s.exp[p.grp] : ex;
  if (k) M = M4.mul(M4.tr(p.ex[0] * k, p.ex[1] * k, p.ex[2] * k), M);
  if (p.name === 'trigL' || p.name === 'trigR') {
    const c = p.name === 'trigL' ? (s.clickL || 0) : (s.clickR || 0);
    if (c) { const zp = zOf(SP.uc), yp = heightAt(SP.uc) + 1; M = M4.mul(M4.mul(M4.tr(0, yp, zp), M4.rx(c * 0.05)), M4.mul(M4.tr(0, -yp, -zp), M)); }
  }
  if ((p.name === 'sb1' || p.name === 'sb2') && s[p.name]) M = M4.mul(M4.tr(0.9 * s[p.name], 0, 0), M);
  if ((p.name === 'trigL' && s.rollL) || (p.name === 'trigR' && s.rollR)) { const r = p.name === 'trigL' ? s.rollL : s.rollR, x0 = p.name === 'trigL' ? -12.8 : 12.8, y0 = 12, z0 = 0; M = M4.mul(M4.mul(M4.tr(x0, y0, z0), M4.rz(r)), M4.mul(M4.tr(-x0, -y0, -z0), M)); }
  if (p.name === 'plL' || p.name === 'plR') { const c = p.name === 'plL' ? (s.clickL || 0) : (s.clickR || 0); if (c) M = M4.mul(M4.tr(0, -0.5 * c, 0), M); }
  if (p.name === 'wheel' && s.wheel) { const c = M0Center(p); M = M4.mul(M4.mul(M4.tr(c[0], c[1], c[2]), M4.rx(s.wheel)), M4.mul(M4.tr(-c[0], -c[1], -c[2]), M)); }
  if (s.swTilt && (p.name === 'swL' || p.name === 'swR' || p.name === 'plL' || p.name === 'plR')) { const zc = zOf(0.82), yc = 3.6; M = M4.mul(M4.mul(M4.tr(0, yc, zc), M4.rx(s.swTilt)), M4.mul(M4.tr(0, -yc, -zc), M)); }
  if (p.grp === 'dongle') M = M4.mul(s.dongleM || M4.tr(95, 0, 10), M);
  return M4.mul(s.M || M4.id(), M);
}
function M0Center(p) { return [p.M0[12], p.M0[13], p.M0[14]]; }
/** world anchor of a part (its centre, or an offset in its own frame) under state s */
function anchor(name, s, off = [0, 0, 0]) { const p = RIG.byName[name]; if (!p) return [0, 0, 0]; const q = M4.ap(partM(p, s), off); return [q[0], q[1], q[2]]; }
const GROUPS_SHELL = { shell: 1, trig: 1 };
/** draw the rig for state s (see slides for the fields) */
function rigDraw(s) {
  if (!RIG.ready) return;
  const hide = s.hide || {}, only = s.only;
  const xray = s.xray || 0, iso = s.iso == null ? 0.55 : s.iso, dim = s.dim == null ? 1 : s.dim;
  const opaque = [], trans = [];
  for (const p of RIG.parts) {
    if (hide[p.name] || hide[p.grp]) continue;
    if (only && !(only[p.name] || only[p.grp])) continue;
    if (p.grp === 'dongle' && !s.dongle) continue;
    if ((p.grp === 'dual' || p.grp === 'pom') && !s.dual) continue;
    const isShell = GROUPS_SHELL[p.grp];
    let alpha = isShell ? lerp(1, 0.09, xray) : 1;
    if (s.alpha && s.alpha[p.grp] != null) alpha = s.alpha[p.grp];
    if (s.alpha && s.alpha[p.name] != null) alpha = s.alpha[p.name];
    const hi = (s.hi && (s.hi[p.name] != null ? s.hi[p.name] : s.hi[p.grp])) || 0;
    const o = { M: partM(p, s), col: p.col, alpha, hi, hiCol: (s.hiCol && (s.hiCol[p.name] || s.hiCol[p.grp])) || RGB.gold,
      iso: (p.iso || 0) * iso * (isShell ? lerp(1, 1.6, xray) : 1), isoN: p.isoN, tex: p.tex, texMode: p.texMode, spec: p.spec, clip: s.clip,
      rim: isShell ? 0.65 : 0.4, dim: (s.dimMap && s.dimMap[p.grp] != null) ? s.dimMap[p.grp] : dim };
    (alpha < 0.999 ? trans : opaque).push([p, o]);
  }
  for (const [p, o] of opaque) glDraw(p.mesh, o);
  for (const [p, o] of trans) glDraw(p.mesh, o);
}
