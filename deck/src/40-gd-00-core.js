/* ============================================================================================
   40-gd: "Shape, by gradient descent", a mini presentation on the deck's core and motion kit (dist/gd.html, built by
   python3 tools/build.py gd). Brock, 2026-11-07: four local minima on a mouse shape (thumb left, pinky right, index and
   middle comfort grooves), the ring finger on the shoulder with no minimum, the strength of each set by the hand at rest
   in zero gravity, the shape made of arcs, descended. One minimum per finger (Brock, 12:55). Rebuilt after Brock's 13:33
   ("arcs that span the whole sides, not tiny ones" / "nothing like normal mice"): each side is a few LONG arcs (GD.la,
   deck/tools/gd/longarcs.py), each valley the gentlest arc a fingertip reliably feels, true scale throughout. Felt on the
   sides over the whole slide as you grip (F65.6, G3: GD.la.slide, from the hand model), on the buttons where the tip lands;
   a groove's one low point counted against the button's own slope (F65.7).
   Data: GD (deck/tools/gd/out/gd-deck.json, computed by deck/tools/gd/*.py) and GDSRC (research/gd/shape-gd.json),
   embedded in this page only. Every outline is drawn from the fitted Sora V2 (3d/shell/shell-sora.glb), never by hand.
   ?trial=1..4 picks the trial the descent and before/after slides show (default: LA.recommended, the lowest loss among the
   mirror-symmetric trials, trial 3; G4 after Brock 17:18). Each side valley is placed on its finger's slide as you grip.
   ============================================================================================ */
const DECK = { chapters: [{ key: 'shape', name: 'Shape study' }], slides: [] };
const S = o => (DECK.slides.push(o), o);
function chapterIdeaCount() { return 0; }

Object.assign(SRC, {
  gdSts57: { t: 'F. E. Mount, M. Whitmore and S. L. Stealey, "Evaluation of Neutral Body Posture on Shuttle Mission STS-57 (SPACEHAB-1)", NASA/TM-2003-104805 (2003), Table 1: wrist extension 0 deg in every crew member but one (3 deg); wrist ulnar bend 0 deg (two hands 9 and 3 deg); finger flexion 42, 60, 30, 21, 57, 55, 47, 25 and 35 deg (9 hands, mean 41; which joint is not stated); no thumb or finger-spread data; "in a forward position with the fingers curled at the knuckles". The ISS Body Measures study (Rajulu, Young and Kim) reports no hand joint angles', u: 'https://ntrs.nasa.gov/api/citations/20040200967/downloads/20040200967.pdf' },
  gdLeeJung: { t: 'K.-S. Lee and M.-C. Jung, "Flexion and Extension Angles of Resting Fingers and Wrist", JOSE 20(1) (2014) 91-101: resting fingers, forearm neutral (MCP / PIP / DIP): index 29 / 29 / 10, middle 32 / 30 / 11, ring 25 / 34 / 9, little 32 / 37 / 13 deg; thumb CMC 45, MCP 39, IP 10 (40 participants, Vicon; on the ground; the article does not say which segment the CMC angle is measured against); no spread', u: 'https://yadda.icm.edu.pl/baztech/element/bwmeta1.element.baztech-785f4b91-56ad-477b-8b98-36d5dc7e344c/c/Lee.pdf' },
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
  gdVeeger: { t: 'Joint centres of the hand from Veeger et al. 1997, as tabulated by B. Goislard de Monsabert et al., "Importance of Consistent Datasets in Musculoskeletal Modelling: A Study of the Hand and Wrist", Annals of Biomedical Engineering 46 (2018) 71-85, ESM Table S3 (203 mm hand): the thumb\'s CMC axes at y -34.5 and -28.8 mm, the index MCP at -87.6 mm along the forearm: the CMC 55.9 mm behind the index knuckle, 0.275 hand lengths (derived)', u: 'https://doi.org/10.1007/s10439-017-1936-z' },
  gdHaeri: { t: 'S. M. J. Haeri et al., "Human thumb consists of three phalanges and lacks metacarpal? A morphometric study on the long bones of the hand", Surgical and Radiologic Anatomy 44 (2022) 1101-1109: X-rays of 80 right hands; the thumb metacarpal\'s length differs from no long bone but the middle finger\'s proximal phalanx (P = 1). Used: the thumb metacarpal as long as that phalanx (Buryanov, scaled: 46.9 mm)', u: 'https://doi.org/10.1007/s00276-022-02986-9' },
  gdFreivalds: { t: 'Freivalds, phalanx lengths as a percent of hand length (32 subjects), as tabulated in "A Functional Anatomy Based Kinematic Human Hand Model with Simple Size Adaptation", Table II: thumb proximal 17.1 %, distal 12.1 % (33.1 and 23.4 mm for the ANSUR II mean hand)', u: 'https://core.ac.uk/download/11151516.pdf' },
  gdBrockThumb: { t: 'Brock Liddicoat (designer\'s observation), 2026-11-08, on trial 3\'s waist moved to z 24: "actually no, the thumb never goes that far forward, that\'s unnatural". The study had put the thumb\'s tip level with the index\'s DIP joint (an estimate, no source); it now starts from the thumb\'s own base', u: '', n: 'His observation: a constraint, no tag.' },
  gdHandModel: { t: 'WebXR Input Profiles, generic hand model (npm @webxr-input-profiles/assets 1.0.20, dist/profiles/generic-hand/right.glb): 1,360 vertices on 25 joints. MIT License, Copyright (c) 2019 Amazon', u: 'https://github.com/immersive-web/webxr-input-profiles' },
  gdHand3: { t: 'This study (G8 to G10): one whole hand traced from the WebXR generic hand model (deck/tools/gd/hand_pose.py, hand_draw.py): scaled to the ANSUR II mean hand (193.3 mm, wrist joint to the middle fingertip); each finger\'s first and middle bones stretched to Buryanov & Kotiuk\'s lengths (scaled), the thumb\'s metacarpal to Haeri\'s (46.9 mm) and its two phalanges to Freivalds\'; every finger joint set to Lee & Jung\'s resting flexion about the model\'s own joint axis, from the bone before it, turned until the drawing shows it (within 0.1 deg); the thumb\'s knuckle 39 and tip joint 10 the same way. The fingertips are the model\'s own: the skin\'s front 22.5 mm past the index\'s last joint (the film\'s finger: 21.9). In gd_rest the drawing is placed as the study places the hand: the index knuckle on the grip\'s, its metacarpal level, its own palm\'s skin on the study\'s palm line (the model\'s palm is 3.2 mm thinner than the 20 mm estimate), the thumb turned about its base until its tip is where the study puts it. Estimates: the nails (typical sizes) and the creases (the film\'s), the thumb\'s turn at its base (no named reference), the finger spread and the skin\'s shape', u: '', n: 'derived' },
  gdModel: { t: 'This study: the Sora V2 base fitted with arcs from 3d/shell/shell-sora.glb (plan 8 arcs, RMS 0.12 mm; section 7 arcs, 0.06 to 0.12 mm), regrouped into long arcs (nose, front, waist, hump, tail; crown, groove, shoulder); fingertip targets from the hand model, the thumb from its base (G5); the felt strength, the loss and the descent in deck/tools/gd/longarcs.py (Adam on central differences)', u: '', n: 'derived' }
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
/* the result (G4, Brock 17:18): the lowest loss among the mirror-symmetric trials, trial 3; a traditional mouse is mirrored */
const GD_REC = LA.recommended;
const laNo = k => LA.order.indexOf(k) + 1;
const laBest = () => LA.order.reduce((b, k) => (LA.trials[k].loss < LA.trials[b].loss ? k : b), LA.order[0]);
/** mm off a finger's path as you grip, [rear, front] in z (0 on it) */
const laOff = (z, P) => Math.max(0, P[0] - z, z - P[1]);
/** a side's one valley with its bottom on its finger's path (G4: placed on the slide, F65.6), to half a millimetre */
const laOnPath = (s_, P) => s_.n_minima === 1 && laOff(s_.z_bottom, P) < 0.5;
/** a loss as printed: three decimals under 0.1 (trial 4's 0.008 would read 0.01), else two */
const gdLoss = v => fmtN(v, v < 0.1 ? 3 : 2);
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
/* ---------- the palm's skin line under the knuckles (the study's GD.hand.palm_skin, an estimate) at z, for a hand whose index
   knuckle line is at (zK, yK) tilted g (rad); gd_rest's gap is measured to it (G10: G7's drawn fingers, gdDigitGeo and the rest,
   are gone: every hand in this page is the traced one, ghPaint and ghPaintGrip) ---------- */
function gdSkinAt(zK, yK, g) { const ca = Math.cos(g); return z => yK - GD.hand.palm_skin / ca + (z - zK) * Math.tan(g); }

/** a clip that keeps the box but not the Sora's body under its side profile (GD.sora.profile, down to the pad line) */
function gdClipOutSora(map, box) {
  const P = GD.sora.profile; G.beginPath(); G.rect(box[0], box[1], box[2], box[3]);
  G.moveTo(map.X(P[0][0]), map.Y(-2)); P.forEach(q => G.lineTo(map.X(q[0]), map.Y(q[1]))); G.lineTo(map.X(P[P.length - 1][0]), map.Y(-2)); G.closePath();
  G.clip('evenodd');
}
/** the Sora's body under its side profile, as a clip (the far layer's part that fades as the Sora appears) */
function gdClipInSora(map) {
  const P = GD.sora.profile; G.beginPath(); G.moveTo(map.X(P[0][0]), map.Y(-2)); P.forEach(q => G.lineTo(map.X(q[0]), map.Y(q[1]))); G.lineTo(map.X(P[P.length - 1][0]), map.Y(-2)); G.closePath(); G.clip();
}
/* ---------- (G8) the hand, one whole hand drawn from a real hand's shape (Brock 2026-11-09 11:25: "why are you so bad at drawing
   hands" / "i also didn't want to see all the fingers separated" / "the area where the finger meets the hand/palm(?) looks by far
   the weirdest"). The shape is the open WebXR generic hand model (MIT, (c) 2019 Amazon), fitted to the study's hand (the ANSUR II
   mean, 193.3 mm; the study's bones) and posed at Lee & Jung's resting angles (deck/tools/gd/hand_pose.py), then traced as flat
   vector paths in the film's finger style (hand_draw.py): the lit grey, the shadow grey beyond one smooth line, the light outline
   round the hand and wherever one part passes in front of another, never across the skin where a finger runs on into the palm.
   GDHAND.side: seen from the thumb's side, fingers right; GDHAND.thumb: seen along the thumb's knuckle axis, where its bends show
   at true size. Paths in mm (1/q), x toward the fingertips, y up, the origin the index's knuckle (the thumb's view: the thumb's).
   Each digit is also its own layer (its whole shape, the palm in front of it kept), so one can be lifted out of the rest. ---------- */
const GH_V = new Map();
/* nearest first, as each view sees them: from the thumb's side; from the palm, along the thumb's bend (the thumb nearest) */
const GH_NEAR = { side: ['thumb', 'index', 'middle', 'ring', 'little'], thumb: ['thumb', 'index', 'middle', 'ring', 'little'] };
function ghView(v) {
  if (GH_V.has(v)) return GH_V.get(v);
  const D = GDHAND[v], q = D.q;
  const pts = a => { const o = []; for (let i = 0; i < a.length; i += 2) o.push([a[i] / q, -a[i + 1] / q]); return o; };
  const path = (L, close) => { const p = new Path2D(); for (const a of L) { const P = pts(a); P.forEach((c, i) => (i ? p.lineTo(c[0], c[1]) : p.moveTo(c[0], c[1]))); if (close) p.closePath(); } return p; };
  const one = d => ({ sil: path(d.sil, true), sh: path(d.sh || [], true), edges: path(d.edges, false), nail: path(d.nail || [], true), free: path(d.free || [], true), silPts: d.sil.map(pts), edgePts: d.edges.map(pts),
    crease: path(d.crease || [], false), fold: path(d.fold || [], false), out: d.out ? path(d.out, false) : null });
  const out = Object.assign(D.sil ? one(D) : { sh: path(D.sh, true) }, { parts: {}, J: {}, box: D.box, v });
  for (const k in D.parts || {}) out.parts[k] = one(D.parts[k]);
  /* (G10) gd_rest's grips: two layers (far: the middle, ring and little fingers where they show; near: the rest), one shadow */
  if (D.layers) { out.layers = {}; for (const k in D.layers) { out.layers[k] = one(D.layers[k]); out.layers[k].sh = out.sh; } }
  for (const k in D.joints) out.J[k] = [D.joints[k][0], -D.joints[k][1]];
  GH_V.set(v, out); return out;
}
const GH_JN = { index: 'index-finger', middle: 'middle-finger', ring: 'ring-finger', little: 'pinky-finger' };
/** a digit's joints in the view (mm, y down): fingers [knuckle, middle joint, tip joint, tip]; the thumb [base, knuckle, tip joint, tip] */
function ghJoints(v, f) {
  const J = ghView(v).J;
  if (f === 'thumb') return ['metacarpal', 'phalanx-proximal', 'phalanx-distal', 'tip'].map(s => J['thumb-' + s]);
  return ['phalanx-proximal', 'phalanx-intermediate', 'phalanx-distal', 'tip'].map(s => J[GH_JN[f] + '-' + s]);
}
/** the skin's front of a digit along a direction (radians, y down): its outline's farthest point that way */
function ghTip(v, f, dir) {
  const c = Math.cos(dir), s_ = Math.sin(dir); let best = null, bd = -1e9;
  for (const P of ghView(v).parts[f].silPts) for (const q of P) { const d = q[0] * c + q[1] * s_; if (d > bd) { bd = d; best = q; } }
  return best;
}
let GH_L = [];
function ghCanvas(i, w, h) {
  let c = GH_L[i]; if (!c) c = GH_L[i] = document.createElement('canvas');
  if (c.width < w || c.height < h) { c.width = Math.max(c.width, w); c.height = Math.max(c.height, h); }
  const X = c.getContext('2d'); X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1; X.globalCompositeOperation = 'source-over'; X.filter = 'none'; X.clearRect(0, 0, w, h); return X;
}
/** fill, shadow, nails, lines (in the layer's mm frame). outline: also stroke the silhouette (the whole hand: yes); lines: the
   edges at all (a digit drawn under a see-through nearer one: no); dpm: device px per mm (the nails' soft edge) */
function ghBody(X, d, P, px, outline, dpm, lines = true) {
  X.fillStyle = P.lit; X.fill(d.sil);
  X.save(); X.clip(d.sil); X.fillStyle = P.sh; X.fill(d.sh, 'evenodd');
  /* the nails, as the film's ("A Soft"): the skin's greys a little lighter, the free edge paler. No line of their own (G9: the
     thumbnail's closed outline read as a button): the tone's edge is soft instead, feathered over a few tenths of a millimetre */
  const NS = FNG_NAIL, k = P.k;
  X.save(); X.filter = 'blur(' + Math.max(0.4, 0.16 * dpm).toFixed(2) + 'px)';
  X.fillStyle = rgba('#FFFFFF', NS.tone[k]); X.fill(d.nail);
  X.save(); X.clip(d.nail); X.fillStyle = rgba('#FFFFFF', NS.free[k]); X.fill(d.free); X.restore();
  X.restore();
  X.restore();
  /* (G10) the film's marks: the skin's fold round each nail (its sides and cuticle; the free edge has none) and each joint's
     creases, in the film's crease line (fngPaint: P.line, 1 px; the fold at A Soft's alpha) */
  X.lineJoin = 'round'; X.lineCap = 'round'; X.strokeStyle = P.line;
  if (d.fold) { X.save(); X.globalAlpha *= Math.min(1, NS.fold[k]); X.lineWidth = 1.0 * px * Math.max(1, NS.fold[k]); X.stroke(d.fold); X.restore(); }
  if (d.crease) { X.lineWidth = px; X.stroke(d.crease); }
  if (!lines) return;
  X.strokeStyle = P.edge; X.lineWidth = P.ew * px;
  X.stroke(d.edges); if (outline) X.stroke(d.out || d.sil);
}
/**
 * The hand, view v ('side' | 'thumb'), its origin at (x, y) on the stage, s px per mm. o = { alpha, hl (the digit whose turn it
 * is), kH (0..1: how far it is marked), lifts: [[digit, k]] (instead of hl, kH: two at a handover), fade: [x0, x1] (mm: the forearm
 * fades out from x1 back to x0), see (how see-through the nearer digits get over it, 0.5) }.
 * (G9, after the 2026-11-09 review of G8's highlight: its fade across the finger's base put a light band at the knuckle, "the area
 * where the finger meets the hand" Brock called the weirdest, and the dimmed rest read as a dark blob.) The whole hand is always
 * drawn in its own tones. The digit whose turn it is is marked by its outline only: a brighter line along its own edge, fading
 * out over its last few millimetres where the edge runs into the palm (never a fill fade, never across the skin). Where a nearer
 * digit covers it, that nearer digit turns see-through over it (only there), so the whole digit shows.
 */
function ghPaint(v, x, y, s, o = {}) {
  const a = o.alpha == null ? 1 : o.alpha; if (!(a > 0.003)) return;
  const H = ghView(v), P = fngPal(), [bx, by, bw, bh] = H.box;
  const T0 = G.getTransform(), dev = (typeof APP !== 'undefined' && APP.scale ? APP.scale * (APP.dpr || 1) : 1), sEff = s * Math.hypot(T0.a, T0.b) / dev, px = 1 / sEff;
  const G0 = G; G0.save(); G0.translate(x, y); G0.scale(s, s); const M = G0.getTransform(); G0.restore();
  const dpm = Math.hypot(M.a, M.b);
  /* the box in device pixels (y down: the box's top is -by) */
  const cs = [[bx, -by], [bx + bw, -by], [bx, -by + bh], [bx + bw, -by + bh]].map(q => [M.a * q[0] + M.c * q[1] + M.e, M.b * q[0] + M.d * q[1] + M.f]);
  const cw = G0.canvas.width, ch = G0.canvas.height;
  const x0 = Math.max(0, Math.floor(Math.min(...cs.map(q => q[0]))) - 4), y0 = Math.max(0, Math.floor(Math.min(...cs.map(q => q[1]))) - 4);
  const x1 = Math.min(cw, Math.ceil(Math.max(...cs.map(q => q[0]))) + 4), y1 = Math.min(ch, Math.ceil(Math.max(...cs.map(q => q[1]))) + 4);
  if (!(x1 > x0 && y1 > y0)) return;
  const ramp = (gr, k0 = 1) => { for (let i = 0; i <= 8; i++) { const u = i / 8; gr.addColorStop(u, 'rgba(0,0,0,' + (k0 * (1 - u * u * (3 - 2 * u))).toFixed(3) + ')'); } return gr; };
  const lw = x1 - x0, lh = y1 - y0, fadeOut = X => { if (!o.fade) return; const [f0, f1] = o.fade; X.save(); X.globalCompositeOperation = 'destination-out';
    X.fillStyle = ramp(X.createLinearGradient(f0, 0, f1, 0)); X.fillRect(bx - 50, -by - 50, f1 - bx + 50, bh + 100); X.restore(); };
  const lifts = (o.lifts || (o.hl ? [[o.hl, o.kH == null ? 1 : o.kH]] : [])).filter(q => q[1] > 0.003);
  const put = (i, al) => { G0.save(); G0.setTransform(1, 0, 0, 1, 0, 0); G0.globalAlpha = G0.globalAlpha * al; G0.drawImage(GH_L[i], 0, 0, lw, lh, x0, y0, lw, lh); G0.restore(); };
  const lay = i => { const X = ghCanvas(i, lw, lh); X.setTransform(M.a, M.b, M.c, M.d, M.e - x0, M.f - y0); return X; };
  /* the whole hand, in its own tones */
  const L0 = lay(0); ghBody(L0, H, P, px, true, dpm); fadeOut(L0); put(0, a);
  for (const [f, k] of lifts) ghMark(v, H, f, clamp(k), P, px, dpm, lay, put, a, o, fadeOut);
}
/**
 * (G10) gd_rest's hand: one layer ('far' | 'near') of a grip's drawing (GDHAND.grip, GDHAND.heel), its origin (the index knuckle)
 * at (x, y) on the stage, turned by rot (radians; the hand on the hump is the lifted drawing's pose turned 15 deg about the knuckle),
 * s px per mm, then o.dy mm down and o.r2 radians more (place.sh, place.lev). views: [[name, weight], ...]: one drawing, or two cross-dissolved (their weights summed per pixel, 'lighter': where
 * the two drawings agree the hand stays solid; only what differs, the thumb, dissolves). o = { alpha, clip (a clip set on the stage
 * first), fade: [x0, x1] (mm: the forearm fades out from x1 back to x0) }
 */
function ghPaintGrip(views, layer, x, y, s, rot, o = {}) {
  const a = o.alpha == null ? 1 : o.alpha; views = views.filter(q => q[1] > 0.003); if (!(a > 0.003) || !views.length) return;
  const P = fngPal(), T0 = G.getTransform(), dev = (typeof APP !== 'undefined' && APP.scale ? APP.scale * (APP.dpr || 1) : 1), px = 1 / (s * Math.hypot(T0.a, T0.b) / dev);
  const G0 = G; G0.save(); G0.translate(x, y); G0.rotate(rot); G0.scale(s, s); G0.translate(0, o.dy || 0); G0.rotate(o.r2 || 0); const M = G0.getTransform(); G0.restore();
  const dpm = Math.hypot(M.a, M.b), cw = G0.canvas.width, ch = G0.canvas.height;
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (const [v] of views) { const [bx, by, bw, bh] = ghView(v).box; for (const q of [[bx, -by], [bx + bw, -by], [bx, -by + bh], [bx + bw, -by + bh]]) { const X_ = M.a * q[0] + M.c * q[1] + M.e, Y_ = M.b * q[0] + M.d * q[1] + M.f; x0 = Math.min(x0, X_); x1 = Math.max(x1, X_); y0 = Math.min(y0, Y_); y1 = Math.max(y1, Y_); } }
  x0 = Math.max(0, Math.floor(x0) - 4); y0 = Math.max(0, Math.floor(y0) - 4); x1 = Math.min(cw, Math.ceil(x1) + 4); y1 = Math.min(ch, Math.ceil(y1) + 4);
  if (!(x1 > x0 && y1 > y0)) return;
  const lw = x1 - x0, lh = y1 - y0;
  const ramp = gr => { for (let i = 0; i <= 8; i++) { const u = i / 8; gr.addColorStop(u, 'rgba(0,0,0,' + (1 - u * u * (3 - 2 * u)).toFixed(3) + ')'); } return gr; };
  views.forEach(([v], i) => {
    const H = ghView(v), d = H.layers[layer], X = ghCanvas(4 + i, lw, lh); X.setTransform(M.a, M.b, M.c, M.d, M.e - x0, M.f - y0);
    ghBody(X, d, P, px, true, dpm);
    if (o.fade) { const [f0, f1] = o.fade, [bx, by, bw, bh] = H.box; X.save(); X.globalCompositeOperation = 'destination-out'; X.fillStyle = ramp(X.createLinearGradient(f0, 0, f1, 0)); X.fillRect(bx - 50, -by - 50, f1 - bx + 50, bh + 100); X.restore(); }
  });
  let src = GH_L[4];
  if (views.length > 1) {
    const C_ = ghCanvas(6, lw, lh); C_.globalAlpha = views[0][1]; C_.drawImage(GH_L[4], 0, 0, lw, lh, 0, 0, lw, lh);
    C_.globalCompositeOperation = 'lighter'; C_.globalAlpha = views[1][1]; C_.drawImage(GH_L[5], 0, 0, lw, lh, 0, 0, lw, lh);
    C_.globalCompositeOperation = 'source-over'; C_.globalAlpha = 1; src = GH_L[6];
  }
  G0.save(); if (o.clip) o.clip(); G0.setTransform(1, 0, 0, 1, 0, 0); G0.globalAlpha = G0.globalAlpha * a * (views.length > 1 ? 1 : views[0][1]);
  G0.drawImage(src, 0, 0, lw, lh, x0, y0, lw, lh); G0.restore();
}
/** (G9) the digit whose turn it is, marked over the whole hand (ghPaint): the nearer digits see-through where they cover it, then
   its outline brighter, fading out where it runs into the palm */
function ghMark(v, H, f, k, P, px, dpm, lay, put, a, o, fadeOut) {
  const d = H.parts[f], near = GH_NEAR[v].slice(0, GH_NEAR[v].indexOf(f)).filter(n => H.parts[n]);
  /* (G10, after G9's note: the see-through nearer fingers on the ring's and little finger's turns looked milky and busy) no fill
     over the nearer digits: where they cover it, only its outline shows through, dimmer (a hidden line, as a drawing shows one) */
  if (near.length) { const L2 = lay(2); L2.fillStyle = '#000'; for (const n of near) L2.fill(H.parts[n].sil); }
  /* its outline, brighter: each run of its edge stroked in short pieces, fading over its last FADE mm at either end (a run ends
     where the edge runs into the palm, or behind the palm); behind a see-through nearer digit, a little fainter */
  const L3 = lay(3), FADE = 9, wq = P.ew * 1.55 * px;
  L3.lineCap = 'round'; L3.lineJoin = 'round'; L3.strokeStyle = TH ? 'rgba(17,17,17,0.95)' : 'rgba(250,250,252,0.97)'; L3.lineWidth = wq;
  for (const R of d.edgePts) {
    if (R.length < 2) continue;
    const cum = [0]; for (let i = 1; i < R.length; i++) cum.push(cum[i - 1] + Math.hypot(R[i][0] - R[i - 1][0], R[i][1] - R[i - 1][1]));
    const L = cum[cum.length - 1], closed = Math.hypot(R[0][0] - R[R.length - 1][0], R[0][1] - R[R.length - 1][1]) < 0.6;
    for (let i = 1; i < R.length; i++) {
      const m = (cum[i] + cum[i - 1]) / 2, e = closed ? 1 : smooth(clamp(Math.min(m, L - m) / FADE));
      if (e <= 0.01) continue;
      L3.globalAlpha = e; L3.beginPath(); L3.moveTo(R[i - 1][0], R[i - 1][1]); L3.lineTo(R[i][0], R[i][1]); L3.stroke();
    }
  }
  L3.globalAlpha = 1;
  if (near.length) { L3.save(); L3.setTransform(1, 0, 0, 1, 0, 0); L3.globalCompositeOperation = 'destination-out'; L3.globalAlpha = 0.55; L3.drawImage(GH_L[2], 0, 0); L3.restore(); }
  fadeOut(L3); put(3, a * k);
}
/** (G9) a digit's bends marked on the hand itself (2026-11-09 review: G8's guides floated about 25 mm over the joints; "the dots
   must clearly belong to the joints"). A thin line through its joints, the bones as straight lines: in along the bone before the
   first joint (a finger's long hand bone, under the back of the hand; the thumb's first bone), then joint to joint to the
   fingertip. A dot on each joint and beside it, dashed, the bone before carried straight on, and the arc from there to the next
   bone with its number, counting in. At the fingertip, in blue: the back of the hand's direction and the fingertip's, one arc
   ticked at each joint's share, and the sum. The lines run through the drawing's own joints and the arcs span its own bends; the
   hand is posed so those are the study's (hand_draw.posed: within 0.1 deg), so line, arc and number agree.
   v, f: view and digit; A: the joints' angles (deg, the study's); kk: each joint's progress (0..1); M: { X, Y, s } (mm to px);
   o = { a, kSum, R (mm, the arcs), Rt (mm, the sum's arc), refLen (mm of the bone before shown), lab: [[dx, dy] px per joint], totLab };
   M.P: a mapping of whole points instead of X and Y (a turned view) */
function ghMarks(v, f, A, kk, M, o = {}) {
  const a = o.a == null ? 1 : o.a; if (a <= 0.003) return;
  const Jv = ghView(v).J, s = M.s, P = M.P || (q => [M.X(q[0]), M.Y(q[1])]);
  const names = f === 'thumb' ? ['metacarpal', 'phalanx-proximal', 'phalanx-distal', 'tip'].map(x => 'thumb-' + x)
    : ['metacarpal', 'phalanx-proximal', 'phalanx-intermediate', 'phalanx-distal', 'tip'].map(x => GH_JN[f] + '-' + x);
  /* (G10) the line ends at the fingertip's skin (its front along the last bone, the same line): the model's own 'tip' marker sits
     inside the fingertip (11.8 mm past the index's last joint; the skin's front 22.5 mm, the film's finger 21.9) */
  const fr = (f === 'thumb' ? 'thumb' : GH_JN[f]) + '-front'; if (Jv[fr]) names[names.length - 1] = fr;
  const Q = names.map(n => P(Jv[n])), n = Q.length - 2;     /* Q[0]: the bone before's start; Q[1..n]: the joints; Q[n + 1]: the tip */
  const ph = []; for (let i = 0; i <= n; i++) ph.push(Math.atan2(Q[i + 1][1] - Q[i][1], Q[i + 1][0] - Q[i][0]));
  const wrap = x => { while (x > Math.PI) x -= TAU; while (x < -Math.PI) x += TAU; return x; };
  const tn = []; for (let i = 1; i <= n; i++) tn.push(wrap(ph[i] - ph[i - 1]));
  const ink = TH ? C.ink : '#F4F4F6', halo = TH ? 'rgba(255,255,255,0.55)' : 'rgba(12,12,14,0.5)', kG = clamp(Math.max(...kk) * 3);
  const dir = f_ => [Math.cos(f_), Math.sin(f_)];
  const stroke = (pts, w, col, al, dash) => { if (al <= 0.003) return; G.save(); G.globalAlpha = al; G.lineJoin = 'round'; G.lineCap = 'round'; G.setLineDash(dash || []);
    G.beginPath(); pts.forEach((q, i) => (i ? G.lineTo(q[0], q[1]) : G.moveTo(q[0], q[1]))); G.strokeStyle = halo; G.lineWidth = w + 3; G.stroke(); G.strokeStyle = col; G.lineWidth = w; G.stroke(); G.restore(); };
  const arcS = (c, R, f0, f1, w, col, al) => { if (al <= 0.003 || Math.abs(f1 - f0) < 0.002) return; G.save(); G.globalAlpha = al; G.lineCap = 'round';
    G.beginPath(); G.arc(c[0], c[1], R, f0, f1, f1 < f0); G.strokeStyle = halo; G.lineWidth = w + 3; G.stroke(); G.strokeStyle = col; G.lineWidth = w; G.stroke(); G.restore(); };
  /* the line: the bone before (refLen mm of it), then joint to joint to the fingertip */
  const r0 = Math.min((o.refLen || 26) * s, Math.hypot(Q[1][0] - Q[0][0], Q[1][1] - Q[0][1])), d0 = dir(ph[0]);
  stroke([[Q[1][0] - d0[0] * r0, Q[1][1] - d0[1] * r0]].concat(Q.slice(1)), 2, ink, a * 0.8 * kG);
  /* each joint */
  for (let i = 1; i <= n; i++) {
    const ki = kk[i - 1]; if (ki <= 0) continue;
    const c = Q[i], f0 = ph[i - 1], t_ = tn[i - 1], f1 = f0 + t_ * ki, R = (o.R || 8.5) * s, ex = R + 12, al = a * clamp(ki * 3), sg = t_ >= 0 ? 1 : -1;
    stroke([c, [c[0] + Math.cos(f0) * ex, c[1] + Math.sin(f0) * ex]], 1.5, ink, al * 0.85, [5, 4]);
    arcS(c, R, f0, f1, 2.8, ink, al);
    G.save(); G.globalAlpha = al; G.fillStyle = halo; G.beginPath(); G.arc(c[0], c[1], 6.5, 0, TAU); G.fill(); G.fillStyle = ink; G.beginPath(); G.arc(c[0], c[1], 4.6, 0, TAU); G.fill(); G.restore();
    /* the number: past the dashed line's end, on the side away from the bend (o.side[i] < 0: past the next bone, on the bend's
       side, where the fingertip's sum would crowd it) */
    const inside = o.side && o.side[i - 1] < 0, fb = inside ? ph[i] : f0, q_ = inside ? -1 : 1;
    const nb = [Math.sin(fb) * sg * q_, -Math.cos(fb) * sg * q_], nud = (o.lab && o.lab[i - 1]) || [0, 0], rr = R + 16;
    const lx = c[0] + Math.cos(fb) * rr + nb[0] * 20 + nud[0], ly = c[1] + Math.sin(fb) * rr + nb[1] * 20 + nud[1];
    text(Math.round(A[i - 1] * ki) + '°', lx, ly + 9, { role: 'num', size: 26, color: ink, align: 'center', alpha: al, glow: halo, glowR: 9 });
  }
  /* the sum at the fingertip */
  const kS = o.kSum == null ? 1 : o.kSum, tot = tn.reduce((p, q) => p + q, 0) * clamp(kS), sum = A.reduce((p, q) => p + q, 0);
  if (kS > 0.004 && Math.abs(tot) > 0.004) {
    const c = Q[n + 1], R = (o.Rt || 9.5) * s, ex = R + 18, al = a * clamp(kS * 2), f0 = ph[0], sg = tot >= 0 ? 1 : -1;
    stroke([c, [c[0] + Math.cos(f0) * ex, c[1] + Math.sin(f0) * ex]], 1.6, C.heroText, al * 0.9, [5, 4]);
    stroke([c, [c[0] + Math.cos(f0 + tot) * ex, c[1] + Math.sin(f0 + tot) * ex]], 1.6, C.heroText, al * 0.9, [5, 4]);
    G.save(); G.globalAlpha = al * 0.24; G.fillStyle = C.hero; G.beginPath(); G.moveTo(c[0], c[1]); G.arc(c[0], c[1], R, f0, f0 + tot, tot < 0); G.closePath(); G.fill(); G.restore();
    arcS(c, R, f0, f0 + tot, 3, C.heroText, al);
    let acc = f0; for (let i = 0; i < n - 1; i++) { acc += tn[i]; if (Math.abs(acc - f0) >= Math.abs(tot) - 0.004) break; const u = dir(acc);
      stroke([[c[0] + u[0] * (R - 7), c[1] + u[1] * (R - 7)], [c[0] + u[0] * (R + 7), c[1] + u[1] * (R + 7)]], 2.2, C.heroText, al); }
    const ma = f0 + sg * Math.min(Math.abs(tot) / 2, 0.45), r_ = R + 28, nt = o.totLab || [0, 0];
    text(Math.round(sum * clamp(kS)) + '°', c[0] + Math.cos(ma) * r_ + 10 + nt[0], c[1] + Math.sin(ma) * r_ + 10 + nt[1], { role: 'num', size: 28, color: C.heroText, align: 'center', alpha: al, glow: halo, glowR: 9 });
  }
  return { Q, ph, tn };
}
