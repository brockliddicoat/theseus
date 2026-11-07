/* ============================================================================================
   40-gd: "Shape, by gradient descent", a mini presentation on the deck's core and motion kit (dist/gd.html, built by
   python3 tools/build.py gd). Brock, 2026-11-07: four local minima on a mouse shape (thumb left, pinky right, index and
   middle comfort grooves), the ring finger on the shoulder with no minimum, the strength of each set by the hand at rest
   in zero gravity, the shape made of arcs, descended. One minimum per finger (Brock, 12:55).
   Data: GD (deck/tools/gd/out/gd-deck.json, computed by deck/tools/gd/*.py) and GDSRC (research/gd/shape-gd.json),
   embedded in this page only. Every outline is drawn from the fitted Sora V2 (3d/shell/shell-sora.glb), never by hand.
   ?trial=1..4 picks the trial the descent and before/after slides show (default: the lowest loss).
   ============================================================================================ */
const DECK = { chapters: [{ key: 'shape', name: 'Shape study' }], slides: [] };
const S = o => (DECK.slides.push(o), o);
function chapterIdeaCount() { return 0; }

Object.assign(SRC, {
  gdSts57: { t: 'F. E. Mount, M. Whitmore and S. L. Stealey, "Evaluation of Neutral Body Posture on Shuttle Mission STS-57 (SPACEHAB-1)", NASA/TM-2003-104805 (2003), Table 1: wrist extension 0 deg in every crew member but one (3 deg); finger flexion 42, 60, 30, 21, 57, 55, 47, 25 and 35 deg (9 hands, mean 41); "in a forward position with the fingers curled at the knuckles"', u: 'https://ntrs.nasa.gov/api/citations/20040200967/downloads/20040200967.pdf' },
  gdLeeJung: { t: 'K.-S. Lee and M.-C. Jung, "Flexion and Extension Angles of Resting Fingers and Wrist", JOSE 20(1) (2014) 91-101: resting fingers, forearm neutral (MCP / PIP / DIP): index 29 / 29 / 10, middle 32 / 30 / 11, ring 25 / 34 / 9, little 32 / 37 / 13 deg; thumb CMC 45, MCP 39, IP 10', u: 'https://yadda.icm.edu.pl/baztech/element/bwmeta1.element.baztech-785f4b91-56ad-477b-8b98-36d5dc7e344c/c/Lee.pdf' },
  gdAnsur: { t: 'ANSUR II public data, men (n = 4,082): hand length mean 193.3 mm (SD 9.9; 5th percentile 177, 95th 210), palm length 116.5 mm, hand breadth 88.3 mm (SD 4.4)', u: 'https://tools.openlab.psu.edu/publicData/ANSUR_II_MALE_Public.csv' },
  gdBuryanov: { t: 'Buryanov and Kotiuk, "Proportions of Hand Segments" (Int. J. Morphol. 2010), as tabulated in "Design, Implementation and Control of an Underactuated Hand Exoskeleton" (arXiv 2003.11598): phalanges, index 39.78 / 22.38 / 15.82 mm, middle 44.63 / 26.33 / 17.40, ring 41.37 / 25.65 / 17.30, little 32.74 / 18.11 / 15.96; scaled here by 1.052 to the ANSUR II mean hand', u: 'https://arxiv.org/pdf/2003.11598' },
  gdShi: { t: 'X. Q. Shi, H. L. Heung, Z. Q. Tang, K. Y. Tong and Z. Li, "Verification of Finger Joint Stiffness Estimation Method With Soft Robotic Actuator", Frontiers in Bioengineering and Biotechnology 8 (2020) 592637: passive stiffness of four healthy index MCP joints 0.0377, 0.0328, 0.0466 and 0.0393 N m/rad (mean 0.039); literature 0.025 to 0.058 (Esteki and Mansour 1996), 0.016 to 0.21 (Kuo and Deshpande 2012)', u: 'https://www.frontiersin.org/articles/10.3389/fbioe.2020.592637/full' },
  gdKuo: { t: 'P.-H. Kuo and A. D. Deshpande, "Muscle-tendon units provide limited contributions to the passive stiffness of the index finger metacarpophalangeal joint", J. Biomech. 45(15) (2012) 2531-2538: the capsule-ligament complex gives most of the passive stiffness', u: 'https://doi.org/10.1016/j.jbiomech.2012.07.034' },
  gdJohnson: { t: 'P. W. Johnson, M. Hagberg, E. Wigaeus Hjelm and D. Rempel, "Measuring and characterizing force exposure during computer mouse use", Scand J Work Environ Health 26(5) (2000) 398-405: regular work, mean force on the sides 0.43 N (SD 0.13), on the button 0.35 N (SD 0.06), sides 0.92 N in simulated use (n = 16; the abstract swaps sides and button, the table and text are used)', u: 'https://www.sjweh.fi/article/560' },
  gdSerhat: { t: 'G. Serhat, Y. Vardar and K. J. Kuchenbecker, "Contact evolution of dry and hydrated fingertips at initial touch", PLoS ONE 17(7) (2022) e0269722, Table 1: gross contact area A = 98.6 F^0.50 mm^2 (F in N); "around 1 cm^2" at 1 N in the literature', u: 'https://doi.org/10.1371/journal.pone.0269722' },
  gdTpu: { t: 'TechPowerUp, Finalmouse UltralightX review, shape: width front 5.88 cm, grip 5.66 cm, rear 6.16 cm; "the sides do curve in, but essentially are straight at the middle". The review adds that the ends barely flare, and that the main buttons have fairly deep comfort grooves', u: 'https://techpowerup.com/review/finalmouse-ultralightx/3.html' },
  gdBrock: { t: 'Brock Liddicoat, In Pursuit of an Objectively Better Mouse, brainstorm: Newtonian shape analysis takes the derivative of the edge to see whether it points off the mouse; a rate of change can be too extreme as well as too low; a comfort groove slopes on both sides, so the forces cancel and the finger feels hugged. And 2026-11-07: "there shouldn\'t be more than one local minima per figure" (figure: finger)', u: '', n: 'His reasoning: no tag.' },
  gdModel: { t: 'This study: the Sora V2 base fitted with arcs from 3d/shell/shell-sora.glb (plan 8 arcs, RMS 0.12 mm; section 7 arcs, 0.06 to 0.12 mm); fingertip targets from the hand model; the dips, the loss and the descent in deck/tools/gd/ (trials.py, Adam on central differences)', u: '', n: 'derived' }
});

/* ---------- captions set on one line, or two balanced lines (no orphan): the narrowest width that still takes two ---------- */
const GD_CAPW = new Map();
function gdCapW(str, max = 1560) {
  const key = str + '|' + max; if (GD_CAPW.has(key)) return GD_CAPW.get(key);
  const st = { role: 'lead' }, s_ = sentence(str); let w = max;
  if (wrap(s_, st, max).length === 2) { let lo = 300, hi = max; while (hi - lo > 4) { const m = (lo + hi) / 2; if (wrap(s_, st, m).length <= 2) hi = m; else lo = m; } w = Math.ceil(hi) + 2; }
  GD_CAPW.set(key, w); return w;
}
function gdCaptions(t, steps, o = {}) {
  let cur = -1; for (let i = 0; i < steps.length; i++) if (t >= steps[i][0]) cur = i;
  captions(t, steps, Object.assign({}, o, { maxW: cur < 0 ? (o.maxW || 1560) : gdCapW(String(steps[cur][1]), o.maxW || 1560) }));
}

/* ---------- the trials, and which one the result slides show (?trial=1..4) ---------- */
const GD_NAME = {
  heel_sym: ['Palm on the hump', 'Symmetric'], heel_fwd: ['Palm on the hump', 'Thumb pocket forward'],
  lifted_sym: ['Palm lifted, zero g', 'Symmetric'], lifted_fwd: ['Palm lifted, zero g', 'Thumb pocket forward']
};
const GD_K = (() => { let k = GD.recommended; try { const m = /[?&]trial=([1-4])\b/.exec(location.search); if (m) k = GD.order[+m[1] - 1]; } catch (e) { } return k; })();
const gdTr = k => GD.trials[k || GD_K];
const gdNo = k => GD.order.indexOf(k) + 1;
const gdBest = () => GD.order.reduce((b, k) => (GD.trials[k].loss < GD.trials[b].loss ? k : b), GD.order[0]);

/* ---------- small numeric helpers ---------- */
function gdInterp(x, xs, ys) {
  const n = xs.length; if (x <= xs[0]) return ys[0]; if (x >= xs[n - 1]) return ys[n - 1];
  let lo = 0, hi = n - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (xs[m] <= x) lo = m; else hi = m; }
  const k = (x - xs[lo]) / ((xs[hi] - xs[lo]) || 1); return ys[lo] + (ys[hi] - ys[lo]) * k;
}
const GD_RS = new Map();
/** a polyline resampled to n points by arc length (cached by identity) */
function gdRes(P, n = 160) {
  const key = P; let c = GD_RS.get(key); if (c && c.n === n) return c.v;
  const d = [0]; for (let i = 1; i < P.length; i++) d.push(d[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
  const L = d[d.length - 1], v = [];
  for (let j = 0; j < n; j++) { const s = L * j / (n - 1), x = gdInterp(s, d, P.map(q => q[0])), y = gdInterp(s, d, P.map(q => q[1])); v.push([x, y]); }
  GD_RS.set(key, { n, v }); return v;
}
function gdMix(A, B, k) { const a = gdRes(A), b = gdRes(B); return a.map((q, i) => [lerp(q[0], b[i][0], k), lerp(q[1], b[i][1], k)]); }
/** a side of the top outline as u(z): only where the side runs front to back */
function gdSide(P) {
  const q = P.filter(p => p[0] > 17).slice().sort((a, b) => a[1] - b[1]);
  const zs = q.map(p => p[1]), us = q.map(p => p[0]); return z => gdInterp(z, zs, us);
}
const GD_SORA_U = gdSide(GD.sora.plan);

/* ---------- views, in mm, true scale ---------- */
/** a top view as the hand sees it: nose up, the user's left (the thumb's side) on the image's left */
function gdTopFit(box, o = {}) {
  const [x, y, w, h] = box, zr = o.zr || [-61, 61], ur = o.ur || 33;
  const s = Math.min(w / (2 * ur), h / (zr[1] - zr[0])), cx = x + w / 2, cy = y + h / 2 + (zr[0] + zr[1]) / 2 * s;
  return { s, cx, cy, X: (u, sd) => cx + sd * u * s, Y: z => cy - z * s, P: (pts, sd) => pts.map(q => [cx + sd * q[0] * s, cy - q[1] * s]) };
}
/** the full outline from two half outlines (u >= 0, nose to tail): thumb side (L) left, pinky side (R) right */
function gdOutline(m, L, R) { return m.P(L, -1).concat(m.P(R, 1).slice().reverse()); }
/** a section across the buttons seen from behind, as the hand sees it: the index's side left, the ring's right */
function gdSecFit(box, o = {}) {
  const [x, y, w, h] = box, ur = o.ur || 34, yr = o.yr || [0, 40];
  const s = Math.min(w / (2 * ur), h / (yr[1] - yr[0])), cx = x + w / 2, by = y + h - (h - (yr[1] - yr[0]) * s) / 2;
  return { s, cx, by, X: (u, sd) => cx + sd * u * s, Y: v => by - v * s, P: (pts, sd) => pts.map(q => [cx + sd * q[0] * s, by - q[1] * s]) };
}
function gdSection(m, sec) { return m.P(sec, -1).slice().reverse().concat(m.P(sec, 1)); }
/** the section's two halves, with the wheel's slot (|x| < 4.8 mm at the buttons' station) left open */
function gdSecHalves(m, sec, slot = 4.8) { const q = sec.filter(p => p[0] >= slot); return [m.P(q, -1), m.P(q, 1)]; }
function gdSecDraw(m, sec, o) { for (const h of gdSecHalves(m, sec)) poly(h, o); }

/* ---------- the fingertip: grey, technical (F9.24: never peach) ---------- */
function gdTip(x, y, r, a = 1, o = {}) {
  if (a <= 0.003) return;
  G.save(); G.globalAlpha = a;
  const g = G.createRadialGradient(x - r * 0.3, y - r * 0.4, r * 0.1, x, y, r);
  g.addColorStop(0, TH ? '#E4E4E4' : '#A0A0A0'); g.addColorStop(1, TH ? '#B6B6B6' : '#5E5E5E');
  G.beginPath(); G.arc(x, y, r, 0, TAU); G.fillStyle = g; G.fill();
  G.strokeStyle = o.edge || (TH ? 'rgba(28,28,28,0.55)' : 'rgba(242,242,242,0.45)'); G.lineWidth = 1.5; G.stroke(); G.restore();
}
/* ---------- the hand in side view: the cascade as true kinematics, capsule phalanges, grey, no nails ----------
   A finger is its three bones (GD.hand.bones: Buryanov & Kotiuk, scaled to the ANSUR II mean hand) flexed by its resting
   angles (GD.hand.cascade: Lee & Jung 2014), from its knuckle; k scales the angles (0: straight, 1: at rest), g tilts the
   metacarpals (rad, + = wrist back). The knuckles sit behind the middle's by the model's estimate (read from the data). */
const GD_FINGERS = ['little', 'ring', 'middle', 'index'];        /* far to near, seen from the thumb's side */
const GD_KB = (() => { const L = GD.hand.grips.lifted, o = {}; for (const f of GD_FINGERS) o[f] = L.zK - L.joints[f][0][0]; return o; })();
function gdHandPose(zK, yK, g, k = 1) {
  const out = {};
  for (const f of GD_FINGERS) {
    const B = GD.hand.bones[f], A = GD.hand.cascade[f]; let p = [zK - GD_KB[f] * Math.cos(g), yK - GD_KB[f] * Math.sin(g)], c = 0; const P = [p];
    for (let i = 0; i < 3; i++) { c += A[i] * k * Math.PI / 180; const d = g - c; p = [p[0] + B[i] * Math.cos(d), p[1] + B[i] * Math.sin(d)]; P.push(p); }
    out[f] = P;
  }
  return out;
}
/** a capsule from a to b (screen px) of radius r; the end at b is flush with b when flush is set */
function gdCapsule(a, b, r, fill, edge, flush) {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), L = Math.hypot(b[0] - a[0], b[1] - a[1]), e = flush ? Math.max(0, L - r) / (L || 1) : 1;
  const bx = a[0] + (b[0] - a[0]) * e, by = a[1] + (b[1] - a[1]) * e;
  G.beginPath(); G.arc(a[0], a[1], r, ang + Math.PI / 2, ang + 3 * Math.PI / 2); G.arc(bx, by, r, ang - Math.PI / 2, ang + Math.PI / 2); G.closePath();
  G.fillStyle = fill; G.fill(); G.strokeStyle = edge; G.lineWidth = 1.6; G.stroke();
}
/* tones by depth: the near finger strongest, the far ones receding into the ground (true greys) */
const GD_TONE = { index: [0.0, '#8E8E8E', '#D0D0D0'], middle: [0.3, '#727272', '#ABABAB'], ring: [0.55, '#585858', '#878787'], little: [0.72, '#464646', '#6C6C6C'], palm: [0.42, '#636363', '#9A9A9A'] };
function gdTone(f) { const [d, fl, ed] = GD_TONE[f]; return TH ? [mix('#8A8A8A', '#E4E4E4', d), mix('#3C3C3C', '#B4B4B4', d)] : [fl, ed]; }
/** the phalanx radii (mm): drawn, not measured (an estimate of the finger's depth in side view) */
const GD_PR = { index: [8.4, 7.4, 6.4], middle: [8.8, 7.8, 6.6], ring: [8.2, 7.2, 6.2], little: [7.0, 6.2, 5.6] };
function gdFingerDraw(P, f, map) {
  const [fill, edge] = gdTone(f), S_ = P.map(q => [map.X(q[0]), map.Y(q[1])]);
  for (let i = 0; i < 3; i++) gdCapsule(S_[i], S_[i + 1], GD_PR[f][i] * map.s, fill, edge, i === 2);
  /* the joints' creases, quiet: a short line across each joint */
  for (let i = 1; i < 3; i++) { const a = S_[i - 1], b = S_[i], c = S_[i + 1], d1 = Math.atan2(b[1] - a[1], b[0] - a[0]), d2 = Math.atan2(c[1] - b[1], c[0] - b[0]), m = (d1 + d2) / 2 + Math.PI / 2, r = GD_PR[f][i] * map.s * 0.55;
    line(b[0] - Math.cos(m) * r, b[1] - Math.sin(m) * r, b[0] + Math.cos(m) * r, b[1] + Math.sin(m) * r, { color: edge, w: 1.2, alpha: 0.7 }); }
}
/** the palm in side view: the back of the hand nearly straight from the wrist to the knuckles, the underside the model's
   palm skin (20 mm under the knuckle line, an estimate) swelling into the heel behind the mouse; a short forearm fading out.
   Drawn, not measured, except that skin line. */
const GD_PALM = [[10, -2], [7, 7], [0, 10.5], [-40, 11.5], [-82, 10], [-104, 9], [-104, -14], [-90, -23], [-66, -21], [-30, -20], [-6, -20], [6, -15]];
function gdPalmDraw(zK, yK, g, map) {
  const [fill, edge] = gdTone('palm'), skin = GD.hand.palm_skin, ca = Math.cos(g), sa = Math.sin(g);
  const P = (u, n) => [map.X(zK + u * ca - n * sa), map.Y(yK + u * sa + n * ca)];
  /* the forearm: a band from the wrist back, fading */
  const w0 = P(-100, 0), w1 = P(-190, 0), gr = G.createLinearGradient(w0[0], w0[1], w1[0], w1[1]);
  gr.addColorStop(0, fill); gr.addColorStop(1, TH ? 'rgba(138,138,138,0)' : 'rgba(99,99,99,0)');
  const fa = [P(-96, 9.5), P(-190, 12), P(-190, -16), P(-96, -14)];
  G.beginPath(); fa.forEach((q, i) => (i ? G.lineTo(q[0], q[1]) : G.moveTo(q[0], q[1]))); G.closePath(); G.fillStyle = gr; G.fill();
  /* the palm: a closed Catmull-Rom curve through GD_PALM */
  const K = GD_PALM.map(q => P(q[0], q[1])), n = K.length, pts = [];
  for (let i = 0; i < n; i++) { const p0 = K[(i - 1 + n) % n], p1 = K[i], p2 = K[(i + 1) % n], p3 = K[(i + 2) % n];
    for (let j = 0; j < 8; j++) { const u = j / 8, u2 = u * u, u3 = u2 * u; pts.push([0, 1].map(c => 0.5 * (2 * p1[c] + (-p0[c] + p2[c]) * u + (2 * p0[c] - 5 * p1[c] + 4 * p2[c] - p3[c]) * u2 + (-p0[c] + 3 * p1[c] - 3 * p2[c] + p3[c]) * u3))); } }
  G.beginPath(); pts.forEach((q, i) => (i ? G.lineTo(q[0], q[1]) : G.moveTo(q[0], q[1]))); G.closePath(); G.fillStyle = fill; G.fill(); G.strokeStyle = edge; G.lineWidth = 1.6; G.stroke();
  return { skinAt: z => yK - skin / ca + (z - zK) * Math.tan(g) };   /* the skin line's height at z (mm) */
}
/** the joint angles on a finger: the bone axis, a dashed extension of the bone before, an arc, and the value (counting in
   with k) in a column to the right of the finger, each with a leader to its arc */
function gdAngles(P, f, g, k, map, a, o = {}) {
  if (a <= 0.003) return;
  const S_ = P.map(q => [map.X(q[0]), map.Y(q[1])]), col = TH ? C.ink : '#F2F2F2', A = GD.hand.cascade[f], nm = ['MCP', 'PIP', 'DIP'];
  poly(S_, { color: col, w: 1.6, alpha: a * 0.9 });
  const lx = o.x || Math.max(...S_.map(q => q[0])) + 90, LY = []; S_.slice(0, 3).forEach((q, i) => LY.push(i ? Math.max(q[1], LY[i - 1] + 48) : q[1]));
  let dir = -g;                                       /* screen angle of the bone before (y down): the metacarpal first */
  for (let i = 0; i < 3; i++) {
    const [x, y] = S_[i], nd = Math.atan2(S_[i + 1][1] - y, S_[i + 1][0] - x), R = (i === 2 ? 15 : 18) * map.s, ex = 28 * map.s;
    line(x, y, x + Math.cos(dir) * ex, y + Math.sin(dir) * ex, { color: col, w: 1.3, dash: [5, 5], alpha: a * 0.75 });
    G.save(); G.globalAlpha = a; G.strokeStyle = C.heroText; G.lineWidth = 2.6; G.beginPath(); G.arc(x, y, R, dir, nd, false); G.stroke(); G.restore();
    circle(x, y, 4.5, { fill: col, alpha: a });
    const mid = (dir + nd) / 2, ax = x + Math.cos(mid) * R, ay = y + Math.sin(mid) * R, ly = o.ys ? o.ys[i] : LY[i];
    poly([[ax, ay], [lx - 14, ly]], { color: C.heroText, w: 1.2, alpha: a * 0.6 });
    rich([{ s: nm[i], role: 'label', size: 19, color: C.mute }, { s: Math.round(A[i] * k) + '°', role: 'num', size: 26, color: col, gap: 9 }], lx, ly + 9, { alpha: a });
    dir = nd;
  }
}

/* ---------- the magnified strip: how far a side moves from the Sora, beside a true-scale top view ----------
   The outline itself stays true scale (Brock: a traditional mouse); this strip shows the millimetres. The Sora's side is
   the dashed yellow line; the blue line is the side's change, magnified (its factor written on it); 1 mm bar at the foot.
   side -1: the thumb's side (image left), +1: the pinky's. o = { x, w, z0, z1, mag, p } */
function gdStrip(t, a, m, side, P, o = {}) {
  if (a <= 0.003) return null;
  const w = o.w || 150, X0 = o.x, z0 = o.z0 == null ? -42 : o.z0, z1 = o.z1 == null ? 46 : o.z1, f = gdSide(P);
  const mag = o.mag || Math.max(3, Math.floor(0.6 * w / (4.2 * m.s))), L1 = m.s * mag;
  const y0 = m.Y(z1), y1 = m.Y(z0), zero = side < 0 ? X0 + w * 0.3 : X0 + w * 0.7;
  rr(X0, y0 - 48, w, y1 - y0 + 104, 6, TH ? '#FFFFFF' : '#141517', null, 0, a);
  line(zero, y0, zero, y1, { color: C.second, w: 2, dash: [6, 5], alpha: a });
  const pts = []; for (let z = z0; z <= z1 + 1e-9; z += 0.5) pts.push([zero + side * (f(z) - GD_SORA_U(z)) * L1, m.Y(z)]);
  poly(pts, { color: C.hero, w: 3, alpha: a, p: o.p == null ? 1 : o.p });
  const by = y1 + 22;
  line(zero, by, zero - side * L1, by, { color: C.mute, w: 2.5, alpha: a });
  text('1 mm', zero - side * L1 / 2, by + 26, { role: 'tick', size: 19, color: C.mute, align: 'center', alpha: a });
  text('×' + mag, X0 + w / 2, y0 - 18, { role: 'label', size: 20, color: C.mute, align: 'center', alpha: a });
  return { zero, L1, mag, X: d => zero + side * d * L1 };
}

/* ---------- a curvature comb along a polyline in mm (normals scaled by curvature) ---------- */
function gdComb(map, P, sd, o = {}) {
  const a = o.alpha == null ? 1 : o.alpha; if (a <= 0.003) return;
  const Q = gdRes(P, o.n || 140), k = o.k || 900, tips = [];
  G.save(); G.globalAlpha = a * 0.75; G.strokeStyle = o.color || C.hero; G.lineWidth = 1.2; G.beginPath();
  for (let i = 1; i < Q.length - 1; i++) {
    const [x0, y0] = Q[i - 1], [x1, y1] = Q[i], [x2, y2] = Q[i + 1];
    const ax = x1 - x0, ay = y1 - y0, bx = x2 - x1, by = y2 - y1, cr = ax * by - ay * bx, la = Math.hypot(ax, ay), lb = Math.hypot(bx, by), lc = Math.hypot(x2 - x0, y2 - y0);
    const kap = 2 * cr / ((la * lb * lc) || 1);   /* signed curvature, 1/mm */
    const nx = -(ay + by) / ((la + lb) || 1), ny = (ax + bx) / ((la + lb) || 1);
    const px = map.cx + sd * x1 * map.s, py = (map.cy != null ? map.cy : map.by) - y1 * map.s;
    const L = clamp(kap * k * (o.sign || 1), -60, 60), ex = px + sd * nx * L, ey = py - ny * L;
    G.moveTo(px, py); G.lineTo(ex, ey); tips.push([ex, ey]);
  }
  G.stroke(); G.restore();
  poly(tips, { color: o.color || C.hero, w: 1.5, alpha: a * 0.9 });
}

/* ---------- the dip, in JS (for the anatomy slide): curvature core kc over |t| <= a, easing over b ---------- */
function gdDip(a, b, kc, n = 241) {
  const E_ = a + b, ts = [], c = [];
  for (let i = 0; i < n; i++) {
    const t = E_ * i / (n - 1), x = clamp((t - a) / b), m = 0.5 + a / b, Hs = 1 - 3 * x * x + 2 * x * x * x, Bs = 30 * x * x * (1 - x) * (1 - x);
    ts.push(t); c.push(t <= a ? kc : kc * (Hs - m * Bs));
  }
  const sl = [0], h = [0];
  for (let i = 1; i < n; i++) { const dt = ts[i] - ts[i - 1]; sl.push(sl[i - 1] + (c[i] + c[i - 1]) / 2 * dt); h.push(h[i - 1] + (sl[i] + sl[i - 1]) / 2 * dt); }
  const hE = h[n - 1]; for (let i = 0; i < n; i++) h[i] -= hE;
  return { t: ts, c, slope: sl, h, depth: -h[0] };
}

/* ---------- the trial's tag: its name and number, quiet type ---------- */
function gdTrialTag(t, t0, x, y, k, o = {}) {
  const a = ep(t, t0, t0 + 0.4); if (a <= 0.003) return 0;
  const nm = GD_NAME[k];
  return rich([{ s: 'Trial ' + gdNo(k), role: 'label', size: o.size || 20, color: o.color || C.mute }, { s: nm[0] + ', ' + nm[1].toLowerCase(), role: 'small', size: (o.size || 20) + 3, weight: 650, color: C.ink2, gap: 12, sentence: false }], x, y, { alpha: a });
}

const GD_HEAT = new Map();
function gdHeat(key, grid, x, y, w, h, a, toGrey) {
  let cv = GD_HEAT.get(key);
  if (!cv) {
    const nk = grid.length, nz = grid[0].length; cv = document.createElement('canvas'); cv.width = nz; cv.height = nk;
    const g2 = cv.getContext('2d'), im = g2.createImageData(nz, nk);
    for (let r = 0; r < nk; r++) for (let c = 0; c < nz; c++) { const v = toGrey(grid[r][c]), i = ((nk - 1 - r) * nz + c) * 4; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
    g2.putImageData(im, 0, 0); GD_HEAT.set(key, cv);
  }
  G.save(); G.globalAlpha = a; G.imageSmoothingEnabled = true; G.imageSmoothingQuality = 'high'; G.drawImage(cv, x, y, w, h); G.restore();
}
