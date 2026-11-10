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
  gdHand3: { t: 'This study (G8 to G12): one whole hand traced from the WebXR generic hand model (deck/tools/gd/hand_pose.py, hand_draw.py): scaled to the ANSUR II mean hand (193.3 mm, wrist joint to the middle fingertip); each finger\'s first and middle bones stretched to Buryanov & Kotiuk\'s lengths (scaled), the thumb\'s metacarpal to Haeri\'s (46.9 mm) and its two phalanges to Freivalds\'; every finger joint set to Lee & Jung\'s resting flexion about the model\'s own joint axis, from the bone before it, the thumb\'s knuckle 39 and tip joint 10 the same way: one pose for every view, no joint nudged to suit a view. The views were measured (hand_views.py): from the side the ring finger is wholly behind the index and middle fingers (four digits show); from the front and above (65 deg round, 35 deg up) all five are apart but the index\'s bends are drawn at a quarter of their size; so the index, middle and ring fingers are measured turned 35 deg round and 25 deg up, where each bend is drawn at 0.66 or more of its true size, and the little finger and the thumb from the front (0.72 or more), each arc in its joint\'s own bending plane. The fingertips are the model\'s own: the skin\'s front 22.5 mm past the index\'s last joint (the film\'s finger: 21.9). In gd_rest the side drawing is placed as the study places the hand: the index knuckle on the grip\'s, its metacarpal level, its own palm\'s skin on the study\'s palm line (the model\'s palm is 3.1 mm thinner than the 20 mm estimate), the thumb turned about its base until its tip is where the study puts it. Estimates: the little finger\'s spread (15 deg at its knuckle: the model\'s own closes it 9 deg onto the ring finger), the thumb\'s turn at its base (no named reference), the nails (typical sizes), the creases (the film\'s) and the skin\'s shape', u: '', n: 'derived' },
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

/* ---------- the fingertip on the section and side drawings (G12): the film's own finger (finger(), 06-motion.js: Brock's picks
   "A Line" with "A Soft" nails; grey on both grounds, F9.24), seen from the end, coming toward the viewer and fading out behind.
   A section drawing cuts the mouse, never the finger: the fingertip is drawn whole (the grey balls it replaces read as an
   unexplained slice). Its pad rests on the surface at (x, y); ang turns it about its own axis so the pad faces the surface
   (0: a level surface; a slope's angle on the stage, clockwise positive); s px per mm (the drawing's own where it is to scale).
   o = { digit ('index' | 'thumb'), press, len (mm of finger shown) } ---------- */
function gdTip(x, y, ang, s, a = 1, o = {}) {
  if (a <= 0.003) return;
  finger(x, y, ang, Object.assign({ view: 'end', s, press: 0.2, len: 30, alpha: a }, o));
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
/* ---------- the hand: one whole hand traced from a real hand's shape, in the film's finger style (G8 to G12).
   Brock 2026-11-09: "why are you so bad at drawing hands" / "i also didn't want to see all the fingers separated" (11:25); "the hand
   looks more natural there, but not perfect" (13:14); "the angle needs to be towards the side at a like 3/4ths view (or similar) in
   at least one visualizations because it's near impossible to tell the fingers apart from just the side profile, and in many
   cases the hand looks 4 fingers" (13:50).
   The shape is the open WebXR generic hand model (MIT, (c) 2019 Amazon), fitted to the study's hand (the ANSUR II mean, 193.3 mm;
   the study's bones) and posed with every joint at Lee & Jung's resting bend about its own axis (deck/tools/gd/hand_pose.py), ONE
   pose for every view, then traced as flat vector paths (hand_draw.py): the lit grey, the shadow grey beyond one clean line per
   digit, the light outline round the hand and wherever one part passes in front of another or two digits touch, never across the
   skin where a finger runs on into the palm; nails with the skin's fold round them, creases on every joint.
   GDHAND (hand_draw.build_all), paths in mm (1/q), x right, y up, the origin the index's knuckle:
     tq0 .. tq8   the hand turning: from just off the side view (tq0) round toward the fingertips and up over the back of the hand
                  (tq8). GH_VB (tq4): the fingers' and the thumb's bends read (each drawn at 0.66 or more of its true size);
                  GH_VA (tq8): all five digits plainly apart, the little finger's bends read. Those two carry each digit's own
                  outline (parts) and every view the joints' bending planes (arcs), so a bend is drawn where it is, in its plane
     rx0 .. rx3   the hand relaxing from straight, in GH_VA's view
     grip, heel   the side view as gd_rest places it, two layers (far: the middle, ring and little fingers where they show, each a
                  step darker; near: the rest); gh0 .. gh2 the thumb on its way between the two ---------- */
const GH_V = new Map();
const GH_N = GDHAND.pose.turn.length, GH_VB = 'tq' + GDHAND.pose.vb, GH_VA = 'tq' + GDHAND.pose.va;
function ghView(v) {
  if (GH_V.has(v)) return GH_V.get(v);
  const D = GDHAND[v], q = D.q;
  const pts = a => { const o = []; for (let i = 0; i < a.length; i += 2) o.push([a[i] / q, -a[i + 1] / q]); return o; };
  const path = (L, close) => { const p = new Path2D(); for (const a of (L || [])) { const P = pts(a); P.forEach((c, i) => (i ? p.lineTo(c[0], c[1]) : p.moveTo(c[0], c[1]))); if (close) p.closePath(); } return p; };
  const one = d => ({ sil: path(d.sil, true), sh: path(d.sh, true), edges: path(d.edges, false), nail: path(d.nail, true), free: path(d.free, true), lun: path(d.lun, true),
    crease: path(d.crease, false), fold: path(d.fold, false), out: d.out ? path(d.out, false) : null,
    dark: Object.keys(d.dark || {}).map(k => [path(d.dark[k].p, true), d.dark[k].k]) });
  const out = Object.assign(D.sil ? one(D) : { sh: path(D.sh, true) }, { parts: {}, J: {}, A: {}, box: D.box, v });
  for (const k in D.parts || {}) out.parts[k] = { edgePts: D.parts[k].edges.map(pts), hid: path(D.parts[k].hid, true) };
  if (D.layers) { out.layers = {}; for (const k in D.layers) { out.layers[k] = one(D.layers[k]); out.layers[k].sh = out.sh; } }
  for (const k in D.joints) out.J[k] = [D.joints[k][0], -D.joints[k][1]];
  /* each joint's bending plane: [x, y, e0, e1, deg] with y down */
  const fl = a => [a[0], -a[1], [a[2], -a[3]], [a[4], -a[5]], a[6]];
  for (const k in D.arcs || {}) { const a = D.arcs[k]; out.A[k] = { j: a.j.map(fl), tip: fl(a.tip), back: [a.back[0], -a.back[1]] }; }
  if (D.fade) out.fade = D.fade.map(c => [c[0], -c[1]]);
  GH_V.set(v, out); return out;
}
const GH_JN = { index: 'index-finger', middle: 'middle-finger', ring: 'ring-finger', little: 'pinky-finger', thumb: 'thumb' };
/** the skin's front of a digit's tip in a view (mm, y down) */
function ghFront(v, f) { return ghView(v).J[GH_JN[f] + '-front']; }
let GH_L = [];
function ghCanvas(i, w, h) {
  let c = GH_L[i]; if (!c) c = GH_L[i] = document.createElement('canvas');
  if (c.width < w || c.height < h) { c.width = Math.max(c.width, w); c.height = Math.max(c.height, h); }
  const X = c.getContext('2d'); X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1; X.globalCompositeOperation = 'source-over'; X.filter = 'none'; X.clearRect(0, 0, w, h); return X;
}
/** one drawing's fill, shadow, steps, nails and lines (in its own mm frame). dpm: device px per mm (the nails' soft edge) */
function ghBody(X, d, P, px, dpm) {
  X.fillStyle = P.lit; X.fill(d.sil);
  X.save(); X.clip(d.sil); X.fillStyle = P.sh; X.fill(d.sh, 'evenodd');
  /* (G12) the side view: each farther finger a step darker where it shows, so the fingers behind the index read as behind it
     (ink over its own greys; every such patch ends on a line) */
  for (const [pth, k] of d.dark) { X.fillStyle = rgba(P.inkHex, k); X.fill(pth, 'evenodd'); }
  /* the nails, as the film's ("A Soft"): the skin's greys a little lighter, the free edge paler, the thumb's lunula. No line of
     their own (G9: a closed outline read as a button): the tone's edge is soft, feathered over a few tenths of a millimetre */
  const NS = FNG_NAIL, k = P.k;
  X.save(); X.filter = 'blur(' + Math.max(0.4, 0.16 * dpm).toFixed(2) + 'px)';
  X.fillStyle = rgba('#FFFFFF', NS.tone[k]); X.fill(d.nail);
  X.save(); X.clip(d.nail); X.fillStyle = rgba('#FFFFFF', NS.free[k]); X.fill(d.free); X.fillStyle = rgba('#FFFFFF', NS.free[k] * 0.45); X.fill(d.lun); X.restore();
  X.restore();
  X.restore();
  /* the film's marks: the skin's fold round each nail (its sides and cuticle; the free edge has none) and each joint's creases,
     in the film's crease line (fngPaint: P.line, 1 px; the fold at A Soft's alpha) */
  X.lineJoin = 'round'; X.lineCap = 'round'; X.strokeStyle = P.line;
  X.save(); X.globalAlpha *= Math.min(1, NS.fold[k]); X.lineWidth = 1.0 * px * Math.max(1, NS.fold[k]); X.stroke(d.fold); X.restore();
  X.lineWidth = px; X.stroke(d.crease);
  X.strokeStyle = P.edge; X.lineWidth = P.ew * px;
  X.stroke(d.edges); X.stroke(d.out || d.sil);
}
/**
 * The hand. views: a drawing's name ('tq8'), a layer of one ('grip:near'), or [[name, weight], ...] to dissolve between drawings
 * (their weights summed per pixel, 'lighter': where they agree the hand stays solid, only what differs dissolves). The drawing's
 * origin (the index's knuckle) at (x, y) on the stage, s px per mm. o = { alpha; rot, dy, r2 (the drawing turned by rot about its
 * origin, then set dy mm down and turned r2 more: gd_rest's placement); clip (a clip set on the stage first); fade: false for no
 * fade (the forearm fades out along its own line otherwise; fadeK: over that share of the line's length, from the wrist's end);
 * fadeTo: [[x, y], [x, y]] on the stage, gone at the first point and whole by the second (so a window's edge never cuts the arm);
 * hl, kH (the digit whose turn it is, 0..1) or lifts: [[digit, k]] }.
 * The whole hand is always drawn in its own tones; the digit whose turn it is is marked by its outline only (ghMark): never a fill
 * fade, never a band across the skin where it meets the palm (G9).
 */
function ghPaint(views, x, y, s, o = {}) {
  const a = o.alpha == null ? 1 : o.alpha; views = (typeof views === 'string' ? [[views, 1]] : views).filter(q => q[1] > 0.003); if (!(a > 0.003) || !views.length) return;
  const P = fngPal(), T0 = G.getTransform(), dev = (typeof APP !== 'undefined' && APP.scale ? APP.scale * (APP.dpr || 1) : 1), px = 1 / (s * Math.hypot(T0.a, T0.b) / dev);
  const G0 = G; G0.save(); G0.translate(x, y); G0.rotate(o.rot || 0); G0.scale(s, s); G0.translate(0, o.dy || 0); G0.rotate(o.r2 || 0); const M = G0.getTransform(); G0.restore();
  const dpm = Math.hypot(M.a, M.b), cw = G0.canvas.width, ch = G0.canvas.height;
  const spec = views.map(([v, w]) => { const [nm, lay] = v.split(':'), H = ghView(nm); return { H, d: lay ? H.layers[lay] : H, w }; });
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (const { H } of spec) { const [bx, by, bw, bh] = H.box; for (const q of [[bx, -by], [bx + bw, -by], [bx, -by + bh], [bx + bw, -by + bh]]) { const X_ = M.a * q[0] + M.c * q[1] + M.e, Y_ = M.b * q[0] + M.d * q[1] + M.f; x0 = Math.min(x0, X_); x1 = Math.max(x1, X_); y0 = Math.min(y0, Y_); y1 = Math.max(y1, Y_); } }
  x0 = Math.max(0, Math.floor(x0) - 4); y0 = Math.max(0, Math.floor(y0) - 4); x1 = Math.min(cw, Math.ceil(x1) + 4); y1 = Math.min(ch, Math.ceil(y1) + 4);
  if (!(x1 > x0 && y1 > y0)) return;
  const lw = x1 - x0, lh = y1 - y0;
  const lay = i => { const X = ghCanvas(i, lw, lh); X.setTransform(M.a, M.b, M.c, M.d, M.e - x0, M.f - y0); return X; };
  /* the forearm fades out along its own line (opaque at the line's second point, gone by its first) */
  const fadeOut = (X, H) => { const F = o.fade === false ? null : H.fade; if (!F) return; const [bx, by, bw, bh] = H.box, fk = o.fadeK == null ? 1 : o.fadeK;
    const gr = X.createLinearGradient(F[1][0] + (F[0][0] - F[1][0]) * fk, F[1][1] + (F[0][1] - F[1][1]) * fk, F[1][0], F[1][1]);
    for (let i = 0; i <= 8; i++) { const u = i / 8; gr.addColorStop(u, 'rgba(0,0,0,' + (1 - u * u * (3 - 2 * u)).toFixed(3) + ')'); }
    X.save(); X.globalCompositeOperation = 'destination-out'; X.fillStyle = gr; X.fillRect(bx - 400, -by - 400, bw + 800, bh + 800); X.restore(); };
  /* o.fadeTo: [[x, y], [x, y]] on the stage: gone at the first point, whole by the second (a window's edge the arm must not be cut by) */
  const fadeTo = X => { if (!o.fadeTo) return; const q = o.fadeTo.map(c => [T0.a * c[0] + T0.c * c[1] + T0.e - x0, T0.b * c[0] + T0.d * c[1] + T0.f - y0]), gr = X.createLinearGradient(q[0][0], q[0][1], q[1][0], q[1][1]);
    for (let i = 0; i <= 8; i++) { const u = i / 8; gr.addColorStop(u, 'rgba(0,0,0,' + (1 - u * u * (3 - 2 * u)).toFixed(3) + ')'); }
    X.save(); X.setTransform(1, 0, 0, 1, 0, 0); X.globalCompositeOperation = 'destination-out'; X.fillStyle = gr; X.fillRect(0, 0, lw, lh); X.restore(); };
  spec.forEach((sp, i) => { const X = lay(4 + i); ghBody(X, sp.d, P, px, dpm); fadeOut(X, sp.H); fadeTo(X); });
  let src = GH_L[4];
  if (spec.length > 1) {
    const C_ = ghCanvas(6, lw, lh); C_.globalAlpha = spec[0].w; C_.drawImage(GH_L[4], 0, 0, lw, lh, 0, 0, lw, lh);
    C_.globalCompositeOperation = 'lighter'; C_.globalAlpha = spec[1].w; C_.drawImage(GH_L[5], 0, 0, lw, lh, 0, 0, lw, lh);
    C_.globalCompositeOperation = 'source-over'; C_.globalAlpha = 1; src = GH_L[6];
  }
  const put = (cv, al) => { G0.save(); if (o.clip) o.clip(); G0.setTransform(1, 0, 0, 1, 0, 0); G0.globalAlpha = G0.globalAlpha * al; G0.drawImage(cv, 0, 0, lw, lh, x0, y0, lw, lh); G0.restore(); };
  put(src, a * (spec.length > 1 ? 1 : spec[0].w));
  const lifts = (o.lifts || (o.hl ? [[o.hl, o.kH == null ? 1 : o.kH]] : [])).filter(q => q[1] > 0.003);
  if (spec.length === 1) for (const [f, k] of lifts) { const H = spec[0].H; if (!H.parts[f]) continue; const L3 = lay(3); ghMark(L3, H.parts[f], P, px); fadeOut(L3, H); fadeTo(L3); put(GH_L[3], a * clamp(k)); }
}
/** the digit whose turn it is, marked on the whole hand: its own outline brighter, each run fading out over its last few
   millimetres where the edge runs on into the palm; where the rest of the hand hides it, fainter (a hidden line, as a drawing
   shows one), so a finger behind another can still be followed */
function ghMark(L3, d, P, px) {
  const FADE = 9, wq = P.ew * 1.7 * px;
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
  L3.globalAlpha = 0.62; L3.globalCompositeOperation = 'destination-out'; L3.fillStyle = '#000'; L3.fill(d.hid, 'evenodd');
  L3.globalAlpha = 1; L3.globalCompositeOperation = 'source-over';
}
/** the hand turning: position p along the turn's drawings (0: tq0 ... GH_N - 1: the last), as the views to dissolve between. Each
   drawing is held for part of its step and dissolved into the next over the rest, so it reads as one hand turning, not a blur */
function ghTurn(p, hold = 0.72) {
  p = Math.max(0, Math.min(GH_N - 1, p)); const i = Math.min(GH_N - 2, Math.floor(p)), k = smooth(clamp((p - i - hold / 2) / (1 - hold)));
  return k <= 0.003 ? [['tq' + i, 1]] : k >= 0.997 ? [['tq' + (i + 1), 1]] : [['tq' + i, 1 - k], ['tq' + (i + 1), k]];
}
/** a point that every drawing of the turn has (a joint's or a fingertip's name), at position p along it (mm, y down) */
function ghTurnAt(p, name) {
  p = Math.max(0, Math.min(GH_N - 1, p)); const i = Math.min(GH_N - 2, Math.floor(p)), k = p - i, A_ = ghView('tq' + i).J[name], B_ = ghView('tq' + (i + 1)).J[name];
  return [lerp(A_[0], B_[0], k), lerp(A_[1], B_[1], k)];
}
/** (G12) a digit's bends marked on the hand, each where it is and in its own bending plane (hand_draw.arcs_data), so the marks
   lie on the finger in any view: a thin line through its joints (in along the bone before the first one: a finger's long hand
   bone under the back of the hand; the thumb's first bone), a dot on each joint; at each, dashed, the bone before carried
   straight on, and the arc from there round to the next bone, a circle's arc in the joint's plane (part of an ellipse as drawn),
   with its number counting in. At the fingertip, in blue: the back of the hand's direction and the fingertip's, one arc ticked at
   each joint's share, and the sum. The arcs span the drawing's own bends, posed at the study's angles: line, arc and number agree.
   v, f: the drawing and the digit; A: the joints' angles (deg, the study's); kk: each joint's progress (0..1);
   M: { x, y, s } (the drawing's origin on the stage, px per mm); o = { a, kSum, R (mm, the arcs: one or one per joint), Rt (mm, the sum's), refLen (mm of the bone before
   shown), lab: [[dx, dy] px per joint], side: [1 | -1 per joint: the number past the straight-on line (1) or past the next bone
   (-1)], totLab: [dx, dy] } */
function ghMarks3(v, f, A, kk, M, o = {}) {
  const a = o.a == null ? 1 : o.a; if (a <= 0.003) return;
  const H = ghView(v), D = H.A[f], s = M.s, P = q => [M.x + q[0] * s, M.y + q[1] * s], n = D.j.length;
  const ink = TH ? C.ink : '#F4F4F6', halo = TH ? 'rgba(255,255,255,0.55)' : 'rgba(12,12,14,0.5)', kG = clamp(Math.max(...kk) * 3);
  const stroke = (pts, w, col, al, dash) => { if (al <= 0.003 || pts.length < 2) return; G.save(); G.globalAlpha = al; G.lineJoin = 'round'; G.lineCap = 'round'; G.setLineDash(dash || []);
    G.beginPath(); pts.forEach((q, i) => (i ? G.lineTo(q[0], q[1]) : G.moveTo(q[0], q[1]))); G.strokeStyle = halo; G.lineWidth = w + 3; G.stroke(); G.strokeStyle = col; G.lineWidth = w; G.stroke(); G.restore(); };
  /* a point of joint j's plane: r mm from it at angle ph from the straight-on line (px) */
  const at = (j, c, ph, r) => [c[0] + r * s * (Math.cos(ph) * j[2][0] + Math.sin(ph) * j[3][0]), c[1] + r * s * (Math.cos(ph) * j[2][1] + Math.sin(ph) * j[3][1])];
  const arcP = (j, c, a0, a1, r) => { const m = Math.max(2, Math.ceil(Math.abs(a1 - a0) / 0.035)), out = []; for (let q = 0; q <= m; q++) out.push(at(j, c, a0 + (a1 - a0) * q / m, r)); return out; };
  const unit = (p, c) => { const dx = p[0] - c[0], dy = p[1] - c[1], l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; };
  /* the line: the bone before (refLen mm of it), then joint to joint to the fingertip's skin */
  const Q = D.j.map(j => P(j)), tip = P(ghFront(v, f)), r0 = (o.refLen || 24) * s;
  stroke([[Q[0][0] - D.back[0] * r0, Q[0][1] - D.back[1] * r0]].concat(Q, [tip]), 2, ink, a * 0.8 * kG);
  D.j.forEach((j, i) => {
    const ki = kk[i]; if (!(ki > 0)) return;
    const c = Q[i], ang = j[4] * Math.PI / 180, R = (Array.isArray(o.R) ? o.R[i] : o.R) || 8.5, al = a * clamp(ki * 3), pe = at(j, c, 0, R + 3.6);
    stroke([c, pe], 1.5, ink, al * 0.85, [5, 4]);
    stroke(arcP(j, c, 0, ang * ki, R), 2.8, ink, al);
    G.save(); G.globalAlpha = al; G.fillStyle = halo; G.beginPath(); G.arc(c[0], c[1], 6.5, 0, TAU); G.fill(); G.fillStyle = ink; G.beginPath(); G.arc(c[0], c[1], 4.6, 0, TAU); G.fill(); G.restore();
    /* the number: past the straight-on line's end, on the side away from the bend (side -1: past the next bone, on the bend's side) */
    const inside = o.side && o.side[i] < 0, pb = inside ? at(j, c, ang, R + 3.6) : pe, d0 = unit(pb, c), po = unit(at(j, c, inside ? ang + 0.6 : -0.6, R), c);
    const nb = [po[0] - d0[0] * (po[0] * d0[0] + po[1] * d0[1]), po[1] - d0[1] * (po[0] * d0[0] + po[1] * d0[1])], nl = Math.hypot(nb[0], nb[1]) || 1, nud = (o.lab && o.lab[i]) || [0, 0];
    text(Math.round(A[i] * ki) + '°', pb[0] + d0[0] * 12 + nb[0] / nl * 20 + nud[0], pb[1] + d0[1] * 12 + nb[1] / nl * 20 + nud[1] + 9, { role: 'num', size: 26, color: ink, align: 'center', alpha: al, glow: halo, glowR: 9 });
  });
  /* the sum at the fingertip */
  const kS = o.kSum == null ? 1 : clamp(o.kSum), T = D.tip, sum = A.reduce((p, q) => p + q, 0);
  if (kS > 0.004) {
    const c = P(T), S_ = T[4] * Math.PI / 180 * kS, R = o.Rt || 10, al = a * clamp(kS * 2);
    stroke([c, at(T, c, 0, R + 5)], 1.6, C.heroText, al * 0.9, [5, 4]);
    stroke([c, at(T, c, S_, R + 5)], 1.6, C.heroText, al * 0.9, [5, 4]);
    const w = arcP(T, c, 0, S_, R);
    G.save(); G.globalAlpha = al * 0.24; G.fillStyle = C.hero; G.beginPath(); G.moveTo(c[0], c[1]); w.forEach(q => G.lineTo(q[0], q[1])); G.closePath(); G.fill(); G.restore();
    stroke(w, 3, C.heroText, al);
    let acc = 0; for (let i = 0; i < n - 1; i++) { acc += A[i] * Math.PI / 180; if (acc >= S_ - 0.004) break; stroke([at(T, c, acc, R - 1.8), at(T, c, acc, R + 1.8)], 2.2, C.heroText, al); }
    const pm = at(T, c, S_ / 2, R), dm = unit(pm, c), nt = o.totLab || [0, 0];
    text(Math.round(sum * kS) + '°', pm[0] + dm[0] * 34 + nt[0], pm[1] + dm[1] * 34 + 10 + nt[1], { role: 'num', size: 28, color: C.heroText, align: 'center', alpha: al, glow: halo, glowR: 9 });
  }
}
