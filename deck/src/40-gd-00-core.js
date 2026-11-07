/* ============================================================================================
   40-gd: "Shape, by gradient descent", a mini presentation on the deck's core and motion kit (dist/gd.html, built by
   python3 tools/build.py gd). Brock, 2026-11-07: four local minima on a mouse shape (thumb left, pinky right, index and
   middle comfort grooves), the ring finger on the shoulder with no minimum, the strength of each set by the hand at rest
   in zero gravity, the shape made of arcs, descended. One minimum per finger (Brock, 12:55). Rebuilt after Brock's 13:33
   ("arcs that span the whole sides, not tiny ones" / "nothing like normal mice"): each side is a few LONG arcs (GD.la,
   deck/tools/gd/longarcs.py), each valley the gentlest arc a fingertip reliably feels where it lands, true scale throughout.
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
  gdDerler: { t: 'S. Derler and L.-C. Gerhardt, "Tribology of Skin: Review and Analysis of Experimental Results for the Friction Coefficient of Human Skin", Tribology Letters 45 (2012) 1-27: dry skin over 0.2, typically about 0.5; the index finger on nylon, phenolic, Plexiglas, polycarbonate and Teflon 0.09 to 0.61 (Dinc et al.), on two plastics 0.16 to 0.31 at 20 N (Lewis)', u: 'https://doc.rero.ch/record/315296/files/11249_2011_Article_9854.pdf' },
  gdGordon: { t: 'I. E. Gordon and V. Morison, "The haptic perception of curvature", Perception & Psychophysics 31(5) (1982) 446-450: absolute threshold 0.09 mm base-to-peak over a 20 mm strip (SD 0.03); over 20, 30 and 40 mm the threshold is a constant overall gradient of about 0.009 (height over half the length)', u: 'https://doi.org/10.3758/BF03204854' },
  gdPont: { t: 'S. C. Pont, A. M. L. Kappers and J. J. Koenderink, "Similar mechanisms underlie curvature comparison by static and dynamic touch", Perception & Psychophysics 61(5) (1999) 874-894: dynamic-touch thresholds 3.3 to 5.3 deg of attitude difference, not changing with length; static 1.6 to 2.8 deg (Experiment 1)', u: 'https://doi.org/10.3758/BF03206903' },
  gdGoodwin: { t: 'A. W. Goodwin, K. T. John and A. H. Marceglia, "Tactile discrimination of curvature by humans using only cutaneous information from the fingerpads", Experimental Brain Research 86 (1991) 663-672: with the finger still, a concave 5.4 /m (R 185 mm) told from flat at 75 % correct; convex 4.9 /m (R 204 mm)', u: 'https://doi.org/10.1007/BF00230540' },
  gdModel: { t: 'This study: the Sora V2 base fitted with arcs from 3d/shell/shell-sora.glb (plan 8 arcs, RMS 0.12 mm; section 7 arcs, 0.06 to 0.12 mm), regrouped into long arcs (nose, front, waist, hump, tail; crown, groove, shoulder); fingertip targets from the hand model; the felt strength, the loss and the descent in deck/tools/gd/longarcs.py (Adam on central differences)', u: '', n: 'derived' }
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

/* ---------- the trials' names (?trial=1..4 picks the one the result slides show) ---------- */
const GD_NAME = {
  heel_sym: ['Palm on the hump', 'Symmetric'], heel_fwd: ['Palm on the hump', 'Thumb pocket forward'],
  lifted_sym: ['Palm lifted, zero g', 'Symmetric'], lifted_fwd: ['Palm lifted, zero g', 'Thumb pocket forward']
};

/* ---------- the long-arc model (GD.la, deck/tools/gd/longarcs.py): each side is the Sora's chain regrouped into long arcs:
   nose cap (0-2) | front (3) | waist (4, concave) | hump (5) | rear corner (6) | tail tip (7); the section: crown (0) | groove (1,
   concave) | shoulder (2) | corner (3) | wall (4-6). A shape is its arc list [[L, turn], ...]; chains are G1 by construction. ---------- */
const LA = GD.la;
const LA_K = (() => { let k = LA.recommended; try { const m = /[?&]trial=([1-4])\b/.exec(location.search); if (m) k = LA.order[+m[1] - 1]; } catch (e) { } return k; })();
const laTr = k => LA.trials[k || LA_K];
const GD_REC = LA.recommended;
const laNo = k => LA.order.indexOf(k) + 1;
const laBest = () => LA.order.reduce((b, k) => (LA.trials[k].loss < LA.trials[b].loss ? k : b), LA.order[0]);
const LA_CH = new Map();
/** a chain of arcs from p0 at heading th0: { pts, idx (arc per point), ends (each arc's end), hs (headings) } (cached by identity) */
function laChain(p0, th0, arcs, ds = 0.5) {
  const c = LA_CH.get(arcs); if (c && c.ds === ds) return c;
  let x = p0[0], y = p0[1], th = th0; const pts = [[x, y]], idx = [0], ends = [[x, y]], hs = [th];
  arcs.forEach(([L, ph], i) => {
    const n = Math.max(2, Math.ceil(L / ds)), k = ph / Math.max(L, 1e-9), st = (u, t0) => (Math.abs(k) < 1e-9 ? [x + Math.cos(t0) * u, y + Math.sin(t0) * u] : [x + (Math.sin(t0 + k * u) - Math.sin(t0)) / k, y - (Math.cos(t0 + k * u) - Math.cos(t0)) / k]);
    for (let j = 1; j <= n; j++) { pts.push(st(L * j / n, th)); idx.push(i); }
    [x, y] = st(L, th); th += ph; ends.push([x, y]); hs.push(th);
  });
  const out = { pts, idx, ends, hs, ds }; LA_CH.set(arcs, out); return out;
}
const laPlan = arcs => laChain(LA.P0, LA.TH0, arcs, 0.5);
const laSec = arcs => laChain(LA.S0, LA.STH0, arcs, 0.2);
function laMix(a, b, k) { return a.map((q, i) => [lerp(q[0], b[i][0], k), lerp(q[1], b[i][1], k)]); }
/** the points of a chain on arcs i0..i1 */
function laPart(ch, i0, i1 = i0) { const o = []; ch.pts.forEach((q, j) => { if (ch.idx[j] >= i0 && ch.idx[j] <= i1) o.push(q); }); if (i0 > 0) o.unshift(ch.ends[i0]); return o; }
/** the side as u(z) from a plan chain (the side's run only) */
function laSideU(ch) { const q = ch.pts.filter(p => p[0] > 17).slice().sort((a, b) => a[1] - b[1]); const zs = q.map(p => p[1]), us = q.map(p => p[0]); return z => gdInterp(z, zs, us); }
/** the frame of a trial's descent at progress u (0..1): arc lists mixed between the recorded frames */
function laFrame(Tr, u) {
  const F = Tr.frames, n = F.length, fi = clamp(u) * (n - 1), i0 = Math.min(n - 2, Math.floor(fi)), k = fi - i0, A_ = F[i0], B_ = F[i0 + 1];
  return { planL: laMix(A_.planL, B_.planL, k), planR: laMix(A_.planR, B_.planR, k), sec: laMix(A_.sec, B_.sec, k), loss: lerp(A_.loss, B_.loss, k), p: A_.p.map((v, i) => lerp(v, B_.p[i], k)), it: lerp(A_.it, B_.it, k) };
}
/** a waist arc's chord, middle and depth point, from its chain (arc 4): for handles */
function laWaist(ch, wi = 4) {
  const A_ = ch.ends[wi], B_ = ch.ends[wi + 1], M = [(A_[0] + B_[0]) / 2, (A_[1] + B_[1]) / 2], dx = B_[0] - A_[0], dy = B_[1] - A_[1], L = Math.hypot(dx, dy), n = [-dy / L, dx / L];
  let best = null, bd = -1; ch.pts.forEach((q, j) => { if (ch.idx[j] !== wi) return; const d = Math.abs((q[0] - A_[0]) * n[0] + (q[1] - A_[1]) * n[1]); if (d > bd) { bd = d; best = q; } });
  return { A: A_, B: B_, M, c: L, d: bd, deep: best, ang: Math.atan2(dx, -dy) };
}

/* the long arcs grouped as a designer names them, with the tones that tell them apart (handles at the joins) */
const LA_PLAN_REG = [[0, 2, 'Nose'], [3, 3, 'Front'], [4, 4, 'Waist'], [5, 5, 'Hump'], [6, 7, 'Tail']];
const LA_SEC_REG = [[0, 0, 'Crown'], [1, 1, 'Groove'], [2, 2, 'Shoulder'], [3, 3, 'Corner'], [4, 6, 'Side']];
/** draw a chain region by region: o = { t, t0, dt (arrival per region), hl (region index in blue), w, alpha, handles, slot (open the wheel's slot) } */
function laRegions(map, ch, sd, regs, o = {}) {
  const a = o.alpha == null ? 1 : o.alpha; if (a <= 0.003) return;
  regs.forEach(([i0, i1], r) => {
    const k = o.t == null ? 1 : ep(o.t, o.t0 + r * (o.dt || 0.3), o.t0 + r * (o.dt || 0.3) + 0.5, E.io3); if (k <= 0) return;
    let pts = laPart(ch, i0, i1); if (o.slot) pts = pts.filter(q => q[0] >= o.slot);
    const col = o.color || (r === o.hl ? C.hero : o.tones ? o.tones[r % 2] : r % 2 ? C.ink : mix(C.ink, C.bg, 0.45));
    poly(map.P(pts, sd), { color: col, w: r === o.hl ? (o.w || 3) + 1 : (o.w || 3), p: k, alpha: a });
    if (k >= 1 && o.handles !== false && r < regs.length - 1) { const q = map.P([ch.ends[i1 + 1]], sd)[0]; circle(q[0], q[1], 5, { fill: C.panel, color: C.ink, w: 1.6, alpha: a }); }
  });
}
/** the section's two halves, as the hand sees it (index left), the wheel's slot open */
function laSecDraw(ms, ch, o = {}) { for (const sd of [-1, 1]) poly(ms.P(ch.pts.filter(q => q[0] >= 4.8), sd), o); }
/** a side's own chord: the straight edge laid on u(z) that touches it on either side of z (the upper hull's segment over z),
   from za to zb; returns { z0, z1, gap(z) } with the gap >= 0 between the two touch points */
function laChordOf(f, z, za = -32, zb = LA.nose_z - 1) {
  const H = []; for (let q = za; q <= zb + 1e-9; q += 0.25) { const p = [q, f(q)]; while (H.length >= 2 && (H[H.length - 1][0] - H[H.length - 2][0]) * (p[1] - H[H.length - 2][1]) - (H[H.length - 1][1] - H[H.length - 2][1]) * (p[0] - H[H.length - 2][0]) >= 0) H.pop(); H.push(p); }
  let i = 0; while (i < H.length - 2 && H[i + 1][0] < z) i++;
  const [z0, u0] = H[i], [z1, u1] = H[i + 1];
  return { z0, z1, gap: q => (u0 + (u1 - u0) * (q - z0) / ((z1 - z0) || 1)) - f(q) };
}
/** an inset that plots a side against its own chord, depth x2 at most, so it shows its one valley; the Sora (yellow) against
   its own chord the same way. box: [x, y, w, h]; o = { mag, ref, z (the finger's rest), zr: [z from, z to] (the inset's span) } */
function laChordInset(t, a, box, U, o = {}) {
  if (a <= 0.003) return null;
  const [x, y, w, h] = box, mag = o.mag || 2, zr = o.zr || [-30, 44];
  rr(x, y, w, h, 6, TH ? '#F3F3F5' : '#0B0C0D', null, 0, a);
  const s = (h - 100) / (zr[1] - zr[0]), X0 = x + 34, Y = z => y + 58 + (zr[1] - z) * s, Xg = g => X0 + g * mag * s;
  const draw = (f, col, wd, p) => { const c = laChordOf(f, o.z == null ? 10 : o.z); const zs = []; for (let q = c.z0; q <= c.z1 + 1e-9; q += 0.25) zs.push(q); poly(zs.map(q => [Xg(Math.max(0, c.gap(q))), Y(q)]), { color: col, w: wd, alpha: a, p }); return c; };
  line(X0, Y(zr[1]), X0, Y(zr[0]), { color: C.mute, w: 1.5, dash: [5, 4], alpha: a });
  const cr = o.ref ? draw(o.ref, C.second, 2, o.pRef == null ? 1 : o.pRef) : null;
  const c = draw(U, C.hero, 3.2, o.p == null ? 1 : o.p);
  text(o.title || 'Against its own chord, depth ×' + mag, x + 16, y + 30, { role: 'label', size: 18, color: C.ink2, alpha: a });
  line(x + w - 24 - mag * s, y + h - 20, x + w - 24, y + h - 20, { color: C.mute, w: 2.5, alpha: a });
  text('1 mm', x + w - 24 - mag * s / 2, y + h - 30, { role: 'tick', size: 17, color: C.mute, align: 'center', alpha: a });
  return { X: Xg, Y, c, cr, s };
}
/** count the valleys of a gap profile (local maxima of the gap, ignoring wiggles under tol) */
function laValleys(gap, z0, z1, tol = 0.004) {
  const zs = [], g = []; for (let z = z0; z <= z1 + 1e-9; z += 0.1) { zs.push(z); g.push(gap(z)); }
  let n = 0; for (let j = 1; j < g.length - 1; j++) if (g[j] >= g[j - 1] && g[j] > g[j + 1]) { const L = g.slice(0, j).reverse(), R = g.slice(j + 1); if (L.some(v => v < g[j] - tol) && R.some(v => v < g[j] - tol)) n++; }
  return n;
}

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

