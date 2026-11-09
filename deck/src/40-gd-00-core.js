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
  gdHand: { t: 'This study (G7): the hand drawn as the film draws a finger (06-motion.js, Brock\'s "A Line" with "A Soft" nails): the kit\'s own fingertip carried on through the middle and first bones and the knuckle into the back of the hand and the palm, bent exactly at the model\'s joints (Lee & Jung\'s angles on Buryanov & Kotiuk\'s bones, the ANSUR II mean hand; the thumb from its base, G5). The other fingers\' tips are the index\'s scaled by their last bone. Skin outlines beyond the kit\'s fingertip, finger thickness, the palm\'s outline and the spread between fingers are estimates', u: '', n: 'derived' },
  gdHandModel: { t: 'WebXR Input Profiles, generic hand model (npm @webxr-input-profiles/assets 1.0.20, dist/profiles/generic-hand/right.glb): 1,360 vertices on 25 joints. MIT License, Copyright (c) 2019 Amazon', u: 'https://github.com/immersive-web/webxr-input-profiles' },
  gdHand3: { t: 'This study (G8): one whole hand traced from the WebXR generic hand model (deck/tools/gd/hand_pose.py, hand_draw.py): scaled to the ANSUR II mean hand (193.3 mm, wrist joint to the middle fingertip); each finger\'s first and middle bones stretched to Buryanov & Kotiuk\'s lengths (scaled), the thumb\'s to Freivalds\'; every finger joint set to Lee & Jung\'s resting flexion about the model\'s own joint axis, from the bone before it; the thumb\'s knuckle 39 and tip joint 10 the same way. Estimates: the model\'s own fingertips (its index\'s last joint 11.8 mm from the skin\'s front; the study\'s last bone, joint to where the tip touches, 16.6 mm), the nails (typical sizes), the thumb\'s metacarpal turned 16 deg in toward the fingers (its base angle has no named reference), the finger spread and the skin\'s shape. Seen from the thumb\'s side the drawn bones are within 2.5 deg of the angles; the thumb\'s bends are shown from along its own bend, where they are true size', u: '', n: 'derived' },
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
/* ---------- the hand in side view: the joints as true kinematics ----------
   A finger is its three bones (GD.hand.bones: Buryanov & Kotiuk, scaled to the ANSUR II mean hand) flexed by its resting
   angles (GD.hand.cascade: Lee & Jung 2014), from its knuckle; k scales the angles (0: straight, 1: at rest), g tilts the
   metacarpals (rad, + = wrist back). The knuckles sit behind the middle's by the model's estimate (read from the data).
   gdHandPose gives the joints (for dots, arcs and labels); the hand itself is drawn in the film's finger (gdDigitGeo, gdPaint). */
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
/** the palm's skin line under the knuckles (the model's GD.hand.palm_skin, an estimate) at z, for a hand at (zK, yK, g) */
function gdSkinAt(zK, yK, g) { const ca = Math.cos(g); return z => yK - GD.hand.palm_skin / ca + (z - zK) * Math.tan(g); }

/* ---------- the hand, drawn as the film draws a finger (G7, after Brock 2026-11-09 10:38: "i didn't want a 3d model, i wanted
   the same style as the fingers we have on our presentation"). The kit's finger (06-motion.js: FNG_DIG, fngGeo, fngNail,
   fngPaint; Brock's "A Line" with "A Soft" nails, F52.1 and F60.1, grey, F9.24) draws a fingertip and its last joint. Here that
   same fingertip is carried on, in the same drawing, through the middle and first bones, their joints and the knuckle into the
   back of the hand, the palm and the forearm: one outline, the same lit and shadow greys, the same nail, creases and fade.
   The fingertip is the kit's own (the index exactly; the other fingers scaled: lengths by their last bone, thickness by an
   estimate). The rest is drawn to typical proportions (estimates) round the model's joints, which it bends exactly: Lee & Jung's
   angles on Buryanov & Kotiuk's bones (GD.hand). Nothing here changes 06-motion.js: the scaled digits are added to FNG_DIG in
   this page only. ---------- */
const GD_FTH = { index: 1, middle: 1.04, ring: 0.98, little: 0.88 };   /* thickness against the index's (estimate) */
const GD_DIG = {};
/** the kit's digit for a finger: the index itself; the others the index scaled (lengths by the last bone, thickness GD_FTH) */
function gdDig(f) {
  if (f === 'index' || f === 'thumb') return f;
  if (GD_DIG[f]) return GD_DIG[f];
  const I = FNG_DIG.index, kl = GD.hand.bones[f][2] / GD.hand.bones.index[2], kh = GD_FTH[f], N = I.nail, k = 'gd_' + f;
  FNG_DIG[k] = { side: I.side.map(([u, h]) => [u * kl, h * kh]), hw: I.hw.map(([u, w]) => [u * kl, w * kh]), cap: I.cap * kl, capP: I.capP,
    nail: { free: N.free * kl, corner: N.corner * kl, cut: N.cut * kl, sag: N.sag * kl, p: N.p, hw: N.hw.map(([u, w]) => [u * kl, w * kh]), smile: N.smile.map(v => v * kl), lunula: N.lunula },
    dip: I.dip * kl, belly: I.belly * kl, flex: I.flex };
  return (GD_DIG[f] = k);
}
/* the index's side, straight, in the kit's terms (u: mm back from the tip; h: mm above the pad's lowest point): the kit's own
   points to u 35, then (estimates) the middle bone, the middle joint (u 45.4), the first bone, the knuckle (u 87.3), the back of the
   hand, the wrist (about u 184) and the forearm; the palm's skin 20 mm under the knuckle line (GD.hand.palm_skin). The thumb's: the
   kit's to u 54, then its knuckle (u 63.3), its first bone over the ball of the thumb, its base (u 110.2). */
const GD_EXT = {
  index: { back: [[387, 22.5], [287, 20.5], [217, 18.0], [187, 16.85], [162, 17.95], [132, 18.45], [107, 18.15], [95.3, 17.75], [89.8, 17.15], [85.3, 15.95], [80.3, 15.05], [67.3, 14.55], [55.3, 14.65], [49.9, 15.1], [46.4, 15.0], [42.9, 14.4], [39.4, 13.85]],
    pad: [[38, 0.45], [42.5, 0.7], [44.6, 1.2], [45.8, 1.3], [47.2, 1.05], [50.5, 0.25], [56, -0.45], [64, -0.85], [71, -0.75], [75.5, -0.25], [77.5, -0.5], [80.5, -2.2], [83.5, -5.4], [87, -8.8], [91.5, -11.2], [98, -12.3], [115, -12.7], [140, -13.6], [160, -14.3], [176, -13.2], [184, -9.8], [190, -9.9], [215, -12.5], [287, -17], [387, -19]], cut: 35 },
  thumb: { back: [[170, 18.5], [140, 19.0], [118, 19.4], [110, 19.6], [100, 19.8], [85, 20.0], [75, 20.25], [69, 20.55], [65.8, 20.4], [62.8, 19.7], [59.5, 19.05]],
    pad: [[58.5, 1.55], [61.2, 2.1], [62.6, 1.95], [65.5, 0.9], [70, -1.4], [78, -4.8], [90, -8.4], [102, -9.4], [112, -8.2], [122, -6.0], [140, -3.0], [170, -1.0]], cut: 54 }
};
/** the joints' u along a straight digit, last joint first, and its bones (first bone first) */
function gdJointsU(f) {
  const D = FNG_DIG[gdDig(f)];
  if (f === 'thumb') { const B = GD.hand.thumbBase.bones; return { J: [D.dip, D.dip + B[1], D.dip + B[1] + B[0]], B }; }
  const B = GD.hand.bones[f]; return { J: [D.dip, D.dip + B[1], D.dip + B[1] + B[0]], B };
}
const GD_STR = new Map();
/** a straight digit's side silhouette (cached by finger and mode): the kit's sampling (fngCR) through the kit's tip and the
   extension, its back and pad as functions of u, the joints' u, the axis's height c (the kit's last-joint centre). contact: the
   model ends the last bone on the surface it touches (trials.place), so the drawn skin's front must sit there: the last joint
   moves toward the tip by the difference and the skin between the nail's cuticle and that joint closes up (the nail as drawn) */
function gdStraight(f, contact) {
  const key = f + (contact ? '|c' : ''); if (GD_STR.has(key)) return GD_STR.get(key);
  const thumb = f === 'thumb', dig = gdDig(f), D = FNG_DIG[dig], E_ = GD_EXT[thumb ? 'thumb' : 'index'], I = FNG_DIG[thumb ? 'thumb' : 'index'];
  const kl = thumb ? 1 : D.dip / I.dip, kh = thumb ? 1 : GD_FTH[f];
  const { J: Ja, B } = gdJointsU(f), Ji = gdJointsU(thumb ? 'thumb' : 'index').J;
  /* the kit's points to the cut, then the extension; mapped from the index's joints to this finger's */
  const tipPts = I.side.filter(q => q[0] <= E_.cut), raw = E_.back.concat(tipPts, E_.pad);
  const c = (fngGeo(dig).top(D.dip) + fngGeo(dig).bot(D.dip)) / 2;
  /* where the skin's front crosses the axis (the model's tip, in contact) */
  let uf = 0; { const g = fngGeo(dig); for (let i = 1; i < g.sil.length; i++) { const p = g.sil[i - 1], q = g.sil[i]; if (p[0] < 2 && q[0] < 2 && (p[1] - c) * (q[1] - c) <= 0 && p[1] > g.tipH - 0.01) { uf = p[0] + (q[0] - p[0]) * (c - p[1]) / ((q[1] - p[1]) || 1); break; } } }
  const J = contact ? [uf + B[2], uf + B[2] + B[1], uf + B[2] + B[1] + B[0]] : Ja.slice();
  const cut = D.nail.cut, IJ = [0, I.nail.cut, Ji[0], Ji[1], Ji[2]], FJ = [0, cut, J[0], J[1], J[2]];
  const rm = u => { for (let i = 1; i < 5; i++) if (u <= IJ[i]) return FJ[i - 1] + (u - IJ[i - 1]) * (FJ[i] - FJ[i - 1]) / ((IJ[i] - IJ[i - 1]) || 1); return FJ[4] + (u - IJ[4]); };
  const sil = fngCR(raw.map(([u, h]) => [rm(u), h * kh]), 10);
  let it = 0; sil.forEach((p, i) => { if (p[0] < sil[it][0]) it = i; });
  const interp = arr => { const a = arr.slice().sort((p, q) => p[0] - q[0]); return u => gdInterp(u, a.map(q => q[0]), a.map(q => q[1])); };
  const out = { f, dig, thumb, sil, it, top: interp(sil.slice(0, it + 1)), bot: interp(sil.slice(it)), J, B, c, kl, kh, uf, contact: !!contact };
  GD_STR.set(key, out); return out;
}
/** the bend: a point of the straight digit (X = -u, Y = -h) turned about each joint's centre by its flexion (radians, toward the
   palm), last joint first, each eased over its own width as the kit eases its one joint (06-motion.js fngGeo.bender) */
function gdBender(S0, ang, bw) {
  const J = S0.J, c = S0.c;
  return p => {
    const u = -p[0]; let x = p[0], y = p[1];
    for (let j = 0; j < 3; j++) {
      const th = ang[j]; if (!th) continue;
      const q = clamp((J[j] + bw[j] - u) / (2 * bw[j])), w = q * q * (3 - 2 * q); if (w <= 0) continue;
      const a = th * w, cs = Math.cos(a), sn = Math.sin(a), dx = x + J[j], dy = y + c;
      x = -J[j] + dx * cs - dy * sn; y = -c + dx * sn + dy * cs;
    }
    return [x, y];
  };
}
/** remove the small loops a tight bend folds into the outline's palm side (the crease): where two of its segments cross, the
   points between go (the crease is the crossing) */
function gdUnloop(P, i0, i1) {
  const X = (a, b, c, d) => { const r = [b[0] - a[0], b[1] - a[1]], s = [d[0] - c[0], d[1] - c[1]], den = r[0] * s[1] - r[1] * s[0]; if (Math.abs(den) < 1e-12) return null;
    const t = ((c[0] - a[0]) * s[1] - (c[1] - a[1]) * s[0]) / den, u = ((c[0] - a[0]) * r[1] - (c[1] - a[1]) * r[0]) / den; return t > 0 && t < 1 && u > 0 && u < 1 ? [a[0] + r[0] * t, a[1] + r[1] * t] : null; };
  const out = P.slice(0, i0); let i = i0;
  while (i < Math.min(i1, P.length - 1)) {
    let hit = null;
    for (let j = Math.min(i1, P.length - 1, i + 90) - 1; j > i + 1; j--) { const q = X(P[i], P[i + 1], P[j], P[j + 1]); if (q) { hit = [j, q]; break; } }
    out.push(P[i]); if (hit) { out.push(hit[1]); i = hit[0] + 1; } else i++;
  }
  return out.concat(P.slice(i));
}
/** creases in the straight frame: [u, along (mm toward the tip), depth (mm into the skin), side (1 the back, -1 the palm)] */
function gdCrease(S0, u, len, side, lean = 1) {
  if (side > 0) { const y0 = -S0.top(u) + 0.3; return [[-u, y0], [-(u - 0.3 * lean), y0 + len * 0.55], [-(u - 0.12 * lean), y0 + len]]; }
  const y0 = -S0.bot(u) - 0.1; return [[-u, y0], [-(u - 0.45 * lean), y0 - len * 0.57], [-(u - 0.3 * lean), y0 - len]];
}
const GD_GEO = new Map();
/**
 * A whole digit in side view, as the film draws a finger, bent at its three joints. f: 'index' | 'middle' | 'ring' | 'little' |
 * 'thumb'; ang: flexion at [last joint, middle joint, knuckle] (radians; the thumb: [tip joint, knuckle, base]); o = { back (mm of
 * hand drawn behind the first joint, then faded), contact (the skin's front on the model's tip, for a finger on a surface), origin
 * (0: the knuckle; the thumb's 1: its base) }. Frame: mm, the knuckle (the thumb: o.origin) at (0, 0), the bone before it along +X,
 * the back up (-Y), the fingertip toward +X. Returns the kit's side geometry (fngPaint) and the joints (the knuckle first) and tip.
 */
function gdDigitGeo(f, ang, o = {}) {
  const key = [f, ang.map(v => v.toFixed(4)).join(','), o.back || 0, o.contact ? 1 : 0, o.origin || 0, (o.wrist || 0).toFixed(4)].join('|');
  if (GD_GEO.has(key)) return GD_GEO.get(key);
  const S0 = gdStraight(f, o.contact), dig = S0.dig, g = fngGeo(dig), D = g.D, N = D.nail, J = S0.J, c = S0.c;
  const bw = S0.thumb ? [3.5, 5.5, 6] : [3.2 * S0.kl, 4.6 * S0.kl, 6.5 * S0.kl];
  const uEnd = J[2] + (o.back || 30), bend0 = gdBender(S0, ang, bw);
  /* o.wrist: the forearm turned at the wrist (the crease 97 mm behind the knuckle, an estimate) against the hand, radians: with the
     wrist bent back g, the forearm stays level while the hand tilts */
  const uW = J[2] + 97 * S0.kl, bwW = 12, bend = !o.wrist ? bend0 : p => { const q = bend0(p), u = -p[0], w = smooth(clamp((u - uW + bwW) / (2 * bwW))); if (w <= 0) return q;
    const a_ = o.wrist * w, cs = Math.cos(a_), sn = Math.sin(a_), dx = q[0] + uW, dy = q[1] + c; return [-uW + dx * cs - dy * sn, -c + dx * sn + dy * cs]; };
  /* the outline: the far end across, the back to the tip, round it, the pad back to the far end */
  const body = [];
  for (const p of S0.sil) if (p[0] <= uEnd) body.push([-p[0], -p[1]]);
  body.unshift([-uEnd, -S0.top(uEnd)]); body.push([-uEnd, -S0.bot(uEnd)]);
  let iTip = 0; body.forEach((p, i) => { if (p[0] > body[iTip][0]) iTip = i; });
  /* the nail from the side (the kit's, 06-motion.js fngSide): its strip under the crest, the paler free edge, the fold, the sheen */
  const st = (u, z) => g.secTop(u, z), cov = 0.2, us = [];
  for (let u = N.free; u < N.cut; u += 0.12) us.push(u); us.push(N.cut);
  const lowAt = u => [-u, -st(u, Math.max(0, g.W(u) - cov))];
  const nail = us.map(u => [-u, -(g.top(u) + 0.01)]).concat(us.slice().reverse().map(lowAt));
  const fold = us.filter(u => u >= N.corner - 0.3).reverse().map(lowAt);
  const fedge = []; for (let i = 0; i <= 14; i++) { const z = (g.zc - cov) * (1 - i / 14), u = g.freeAt(z); fedge.push([-u, -st(u, z)]); }
  const NU = fngNail(dig), smile = [];
  for (let i = 0; i <= 14; i++) { const z = NU.zs * i / 14, u = g.freeAt(z) - 0.05; smile.push([-u, -st(u, z) - 0.01]); }
  for (let i = 14; i >= 0; i--) { const z = NU.zs * i / 14, u = g.freeAt(z) + NU.sm(z); smile.push([-u, -st(u, z)]); }
  const hl = []; for (let u = N.free + 1.1; u <= N.cut - 1.6; u += 0.4) hl.push([-u, -(g.top(u) - 0.3)]);
  /* creases: the last joint's as the kit draws them (three short wrinkles on the back, one on the palm side); the middle
     joint's deeper (five wrinkles, a double crease); the knuckle's crease where the finger meets the palm (the thumb's knuckle:
     four wrinkles and a double crease). Lengths scale with the finger's thickness */
  const kh = S0.kh, lines = [];
  for (const [d, len] of [[-1.3, 2.4], [0, 3.1], [1.25, 2.3]]) lines.push(gdCrease(S0, J[0] + d - 0.4, len * kh, 1));
  lines.push(gdCrease(S0, J[0], 2.3 * kh, -1));
  for (const [d, len] of (S0.thumb ? [[-1.8, 3.0], [-0.4, 4.0], [1.0, 4.2], [2.4, 3.0]] : [[-2.2, 2.6], [-0.8, 3.6], [0.7, 4.0], [2.1, 3.4], [3.4, 2.4]])) lines.push(gdCrease(S0, J[1] + d * S0.kl, len * kh, 1));
  for (const d of [-0.7, 0.8]) lines.push(gdCrease(S0, J[1] + d * S0.kl, 2.4 * kh, -1));
  if (S0.thumb) { for (const [d, len] of [[-2.0, 3.2], [-0.5, 4.4], [1.1, 4.6], [2.7, 3.4]]) lines.push(gdCrease(S0, J[1] + d, len, 1)); }
  else lines.push(gdCrease(S0, J[2] - 11.8 * S0.kl, 2.6 * kh, -1));
  /* the light/shadow line, 40 % up from the shadowed side (the kit's termA; termB from the back) */
  const termA = [], termB = [];
  for (let u = uEnd; u >= 4.4; u -= 0.4) { const t = S0.top(u), b = S0.bot(u); termA.push([-u, -(b + (t - b) * 0.4)]); termB.push([-u, -(b + (t - b) * 0.62)]); }
  /* bend, then the frame: the origin joint at (0, 0) */
  const oj = S0.thumb ? (o.origin === 1 ? 2 : 1) : 2, ox = J[oj], sh = p => [p[0] + ox, p[1] + c];
  const all = [body, nail, smile, fold, fedge, hl, termA, termB, ...lines].map(a => a.map(p => sh(bend(p))));
  /* the palm side's crease at each bent joint, unlooped: the outline's pad half, from the tip back */
  const B_ = gdUnloop(all[0], iTip, all[0].length - 1);
  /* the joints (knuckle first, then the middle joint, the last joint, the tip: the model's chain) */
  const jp = [J[2], J[1], J[0], J[0] - S0.B[2]].map(u => sh(bend([-u, -c])));
  const tot = ang[0] + ang[1] + ang[2];
  const geo = { body: B_, nail: all[1], free: all[2], fold: all[3], fedge: all[4], hl: all[5], termA: all[6], termB: all[7], lines: all.slice(8),
    flat: null, flatPts: null, far: [-uEnd + ox, -(S0.top(uEnd) + S0.bot(uEnd)) / 2 + c], axis: [1, 0], tipAx: [Math.cos(tot), Math.sin(tot)], L: o.back || 30,
    tip: B_.reduce((a, q) => (q[0] * Math.cos(tot) + q[1] * Math.sin(tot) > a[0] * Math.cos(tot) + a[1] * Math.sin(tot) ? q : a), B_[0]),
    joints: jp, S0, dig, ang };
  GD_GEO.set(key, geo); if (GD_GEO.size > 300) GD_GEO.delete(GD_GEO.keys().next().value);
  return geo;
}
let GD_LAYER = null;
/**
 * Paint a geometry of the kit's (side: gdDigitGeo; top: gdThumbTopGeo) as finger() paints its own: into a layer in the same
 * transform, then set down once (the far end fades cleanly, a partial alpha never shows the pieces through one another).
 * (x, y) on the stage: the frame's origin; rot: its turn (radians); s: px per mm. o = { alpha, clip (sets a clip on the stage
 * first), lod, view ('side' | 'top') }
 */
function gdPaint(geo, x, y, rot, s, o = {}) {
  const a = o.alpha == null ? 1 : o.alpha; if (!(a > 0.003)) return;
  const view = o.view || 'side', P = fngPal(), cr = Math.cos(rot), sr = Math.sin(rot), Lx = FNG_LIGHT[0] * cr + FNG_LIGHT[1] * sr, Ly = -FNG_LIGHT[0] * sr + FNG_LIGHT[1] * cr;
  const T0 = G.getTransform(), dev = (typeof APP !== 'undefined' && APP.scale ? APP.scale * (APP.dpr || 1) : 1), sEff = s * Math.hypot(T0.a, T0.b) / dev;
  const px = 1 / sEff, lod = o.lod != null ? o.lod : sEff >= 2.6 ? 2 : sEff >= 1.2 ? 1 : 0;
  const G0 = G; G0.save(); G0.translate(x, y); G0.rotate(rot); G0.scale(s, s); const M = G0.getTransform(); G0.restore();
  let bx0 = 1e9, by0 = 1e9, bx1 = -1e9, by1 = -1e9;
  for (const q of geo.body) { const X = M.a * q[0] + M.c * q[1] + M.e, Y = M.b * q[0] + M.d * q[1] + M.f; if (X < bx0) bx0 = X; if (X > bx1) bx1 = X; if (Y < by0) by0 = Y; if (Y > by1) by1 = Y; }
  const cw = G0.canvas.width, ch = G0.canvas.height;
  bx0 = Math.max(0, Math.floor(bx0) - 6); by0 = Math.max(0, Math.floor(by0) - 6); bx1 = Math.min(cw, Math.ceil(bx1) + 6); by1 = Math.min(ch, Math.ceil(by1) + 6);
  if (!(bx1 > bx0 && by1 > by0)) return;
  const lw0 = bx1 - bx0, lh0 = by1 - by0;
  if (!GD_LAYER) GD_LAYER = document.createElement('canvas');
  if (GD_LAYER.width < lw0 || GD_LAYER.height < lh0) { GD_LAYER.width = Math.max(GD_LAYER.width, lw0); GD_LAYER.height = Math.max(GD_LAYER.height, lh0); }
  const LC = GD_LAYER.getContext('2d');
  LC.setTransform(1, 0, 0, 1, 0, 0); LC.globalAlpha = 1; LC.globalCompositeOperation = 'source-over'; LC.clearRect(0, 0, lw0, lh0);
  LC.setTransform(M.a, M.b, M.c, M.d, M.e - bx0, M.f - by0);
  G = LC;
  try {
    fngPaint(geo, view, P, 0, px, lod, Lx, Ly, geo.L, 0.5, geo.dig, FNG_NAIL);
    /* o.fade: mm over which the far end fades (longer than the kit's 12 mm), inside the layer only */
    if (o.fade) { const f0 = geo.far, ax = geo.axis, f1 = [f0[0] + ax[0] * o.fade, f0[1] + ax[1] * o.fade];
      LC.save(); LC.globalCompositeOperation = 'destination-out'; const gf = LC.createLinearGradient(f0[0], f0[1], f1[0], f1[1]);
      gf.addColorStop(0, 'rgba(0,0,0,1)'); gf.addColorStop(0.45, 'rgba(0,0,0,0.55)'); gf.addColorStop(1, 'rgba(0,0,0,0)'); LC.fillStyle = gf; LC.fillRect(-500, -500, 1000, 1000); LC.restore(); }
  } finally { G = G0; }
  G0.save(); if (o.clip) o.clip(); G0.setTransform(1, 0, 0, 1, 0, 0); G0.globalAlpha = G0.globalAlpha * a;
  G0.drawImage(GD_LAYER, 0, 0, lw0, lh0, bx0, by0, lw0, lh0); G0.restore();
}
/** the thumb seen on its nail (the kit's top view, 06-motion.js fngTop), carried on past its knuckle (u 63.3) to its base and
   the ball of the thumb (widths past the kit's u 68: estimates). Frame: the pad's centre at (0, 0), the tip toward +X. L: mm shown */
const GD_THW = [[60, 11.1], [68, 11.3], [76, 11.9], [88, 13.0], [100, 14.2], [112, 15.2], [130, 16.0], [160, 16.5]];
function gdThumbTopGeo(L) {
  const key = 'tt|' + L.toFixed(2); if (GD_GEO.has(key)) return GD_GEO.get(key);
  const dig = 'thumb', g = fngGeo(dig), D = g.D, uc = D.belly, U = u => -u + uc, ext = fngMono(GD_THW);
  const hw = u => (u <= 60 ? g.hw(u) : u >= 68 ? ext(u) : lerp(g.hw(u), ext(u), smooth((u - 60) / 8)));
  const half = []; for (let u = 0; u <= L + 1e-6; u += 0.25) half.push([U(u), hw(u)]);
  const body = half.map(q => [q[0], -q[1]]).reverse().concat(half.slice(1).map(q => [q[0], q[1]]));
  const NU = fngNail(dig), T = q => [U(q[0]), q[1]], lines = [], { J } = gdJointsU('thumb');
  for (const [u0, f] of [[D.dip - 1.6, 0.4], [D.dip - 0.3, 0.55], [D.dip + 0.95, 0.38], [J[1] - 1.8, 0.42], [J[1] - 0.2, 0.6], [J[1] + 1.5, 0.45]]) {
    const w = hw(u0) * f, l = []; for (let i = 0; i <= 10; i++) { const z = -w + 2 * w * i / 10; l.push([U(u0 - 0.5 * (1 - Math.pow(z / w, 2))), z]); } lines.push(l); }
  const geo = { body, nail: NU.out.map(T), free: NU.free.map(T), lun: NU.lun.map(T), fold: NU.fold.map(T), pfold: NU.pfold.map(T), hlL: NU.hl(-1).map(T), hlR: NU.hl(1).map(T), cross: NU.cross.map(T),
    lines, uc, far: [U(L), 0], axis: [1, 0], tipAx: [1, 0], L, hwAt: hw, U, dig };
  GD_GEO.set(key, geo); return geo;
}

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
/** the forearm fades out at a box's left edge: a gradient of the panel's colour over the first w px */
function gdFadeLeft(box, w, a = 1) {
  const gr = G.createLinearGradient(box[0], 0, box[0] + w, 0), c = C.panel;
  gr.addColorStop(0, rgba(c, a)); gr.addColorStop(0.55, rgba(c, a * 0.6)); gr.addColorStop(1, rgba(c, 0));
  G.save(); G.fillStyle = gr; G.fillRect(box[0], box[1], w, box[3]); G.restore();
}
/** (G7) a digit's joint angles drawn round it, for gd_joints. The bones' directions as lines a little off the back of the digit
   (parallel to each bone, so their turns are exactly the joints' angles); at each joint a dashed line goes straight on along the
   bone before, and an arc runs from it to the next bone, with its number (counting in as it bends). At the tip, one larger arc from
   the reference (the back of the hand; the thumb's first bone) to the tip's direction: every bend added up, ticked where each
   joint's share ends. geo: gdDigitGeo; A: the joints' angles, knuckle first (deg, the full values); kk: each joint's progress
   (0..1); M: { X, Y, s } (mm to px); o = { a (alpha), kSum (the total's arrival), off (mm off the back), ref (the reference's
   name), labels: [[dx, dy] px nudges per joint] } */
function gdJointMarks(geo, A, kk, M, o = {}) {
  const a = o.a == null ? 1 : o.a; if (a <= 0.003) return;
  const s = M.s, P = q => [M.X(q[0]), M.Y(q[1])], J = geo.joints, n = A.length;   /* J: [knuckle, middle joint, last joint, tip] */
  const ink = TH ? C.ink : '#F2F2F2', d = o.off || 11.5;
  const ph = [0]; for (let i = 0; i < n; i++) ph.push(ph[i] + A[i] * kk[i] * Math.PI / 180);
  const dir = f => [Math.cos(f), Math.sin(f)], nb = f => [Math.sin(f), -Math.cos(f)];
  /* the guide of segment i (0: the reference before the first joint) passes J[max(0, i - 1)] + d n(ph_i) */
  const base = i => { const q = J[Math.max(0, i - 1)], m = nb(ph[i]); return [q[0] + d * m[0], q[1] + d * m[1]]; };
  const meet = i => {   /* the vertex at joint i (1..n): guides i - 1 and i */
    const p1 = base(i - 1), d1 = dir(ph[i - 1]), p2 = base(i), d2 = dir(ph[i]), den = d1[0] * d2[1] - d1[1] * d2[0];
    if (Math.abs(den) < 1e-6) { const q = J[i - 1], m = nb(ph[i - 1]); return [q[0] + d * m[0], q[1] + d * m[1]]; }
    const t = ((p2[0] - p1[0]) * d2[1] - (p2[1] - p1[1]) * d2[0]) / den; return [p1[0] + d1[0] * t, p1[1] + d1[1] * t];
  };
  const V = [null]; for (let i = 1; i <= n; i++) V.push(meet(i));
  /* the tip's vertex: on the last guide, level with the skin's front */
  const tq = geo.tip, dl = dir(ph[n]), b3 = base(n), tV = (V[n][0] - b3[0]) * dl[0] + (V[n][1] - b3[1]) * dl[1], tt = Math.max((tq[0] - b3[0]) * dl[0] + (tq[1] - b3[1]) * dl[1], tV + (o.minTip || 6)), Vt = [b3[0] + dl[0] * (tt + 2), b3[1] + dl[1] * (tt + 2)];
  /* the guides: from the reference's start, through every vertex, to the tip's vertex */
  const g0 = [V[1][0] - (o.refLen || 26), V[1][1]], path = [g0].concat(V.slice(1), [Vt]).map(P);
  const kG = clamp(Math.max(...kk) * 3); if (kG > 0) poly(path, { color: ink, w: 1.5, alpha: a * 0.55 * kG });
  for (let i = 1; i <= n; i++) {
    const ki = kk[i - 1]; if (ki <= 0 || (o.skip && o.skip[i - 1])) continue;
    const v = P(V[i]), f0 = ph[i - 1], f1 = ph[i], R = (o.R || 16) * s, ex = (o.ex || 21) * s, al = a * clamp(ki * 3);
    line(v[0], v[1], v[0] + Math.cos(f0) * ex, v[1] + Math.sin(f0) * ex, { color: ink, w: 1.4, dash: [5, 4], alpha: al * 0.8 });
    if (f1 - f0 > 0.004) { G.save(); G.globalAlpha = al; G.strokeStyle = ink; G.lineWidth = 2.6; G.lineCap = 'round'; G.beginPath(); G.arc(v[0], v[1], R, f0, f1, false); G.stroke(); G.restore(); }
    circle(v[0], v[1], 3.4, { fill: ink, alpha: al });
    /* the number: over the dashed line, on the side away from the bend, near the arc */
    const m0 = nb(f0), nud = (o.labels && o.labels[i - 1]) || [0, 0], r_ = R + 12;
    const lx = v[0] + Math.cos(f0) * r_ + m0[0] * 17 + nud[0], ly = v[1] + Math.sin(f0) * r_ + m0[1] * 17 + nud[1];
    text(Math.round(A[i - 1] * ki) + '°', lx, ly + 9, { role: 'num', size: 25, color: ink, align: 'center', alpha: al });
  }
  /* the total: from the skin's tip, the reference's direction and the tip's, one arc between, ticked at each joint's share; the
     arc fills in as the joints bend, so the sum builds where the tip points */
  const kS = o.kSum == null ? 1 : o.kSum, tot = ph[n];
  if (tot > 0.004 && kS > 0) {
    const v = P(geo.tip), R = (o.Rt || 14) * s, ex = R + 16, al = a * kS;
    line(v[0], v[1], v[0] + ex, v[1], { color: C.heroText, w: 1.5, dash: [5, 4], alpha: al * 0.9 });
    line(v[0], v[1], v[0] + Math.cos(tot) * ex, v[1] + Math.sin(tot) * ex, { color: C.heroText, w: 1.5, dash: [5, 4], alpha: al * 0.9 });
    G.save(); G.globalAlpha = al * 0.24; G.fillStyle = C.hero; G.beginPath(); G.moveTo(v[0], v[1]); G.arc(v[0], v[1], R, 0, tot, false); G.closePath(); G.fill(); G.restore();
    G.save(); G.globalAlpha = al; G.strokeStyle = C.heroText; G.lineWidth = 3; G.lineCap = 'round'; G.beginPath(); G.arc(v[0], v[1], R, 0, tot, false); G.stroke(); G.restore();
    for (let i = 1; i < n; i++) { const f = ph[i]; if (f <= 0.004 || f >= tot - 0.004) continue; line(v[0] + Math.cos(f) * (R - 7), v[1] + Math.sin(f) * (R - 7), v[0] + Math.cos(f) * (R + 7), v[1] + Math.sin(f) * (R + 7), { color: C.heroText, w: 2.2, alpha: al }); }
    const ma = Math.min(tot / 2, 0.45), r_ = R + 26, nt = o.totLab || [0, 0];
    text(Math.round(tot * 180 / Math.PI) + '°', v[0] + Math.cos(ma) * r_ + 12 + nt[0], v[1] + Math.sin(ma) * r_ + 10 + nt[1], { role: 'num', size: 27, color: C.heroText, align: 'center', alpha: al });
    if (o.ref) text(o.ref, v[0] + ex + 8, v[1] + 6, { role: 'label', size: 15, color: C.heroText, alpha: al * 0.85 });
  }
  return { V: V.map(q => q && P(q)), Vt: P(Vt) };
}
/** (G7) a column that adds the joints up: one row per joint (its plain name, its angle counting in as it bends), a rule, the
   sum. rows: [[name, deg, k]], sum: [name, deg, k], note: a line under it. (x, y): the column's top left, w its width */
function gdLedger(t, x, y, w, title, rows, sum, a, o = {}) {
  if (a <= 0.003) return;
  const ink = TH ? C.ink : '#F2F2F2', rh = o.rh || 33, xr = x + w;
  text(title, x, y, { role: 'h3', size: 26, color: C.ink, alpha: a });
  rows.forEach(([nm, v, k], i) => {
    const yy = y + 46 + i * rh, on = clamp(k * 4), last = i === rows.length - 1;
    text(nm, x, yy, { role: 'label', size: 18, color: k >= 1 ? C.mute : C.ink2, alpha: a * (0.35 + 0.65 * on) });
    text(Math.round(v * clamp(k)) + '°', xr, yy + 2, { role: 'num', size: 25, color: ink, align: 'right', alpha: a * (0.25 + 0.75 * on) });
    if (last && rows.length > 1) text('+', xr - 62, yy + 2, { role: 'num', size: 25, color: C.mute, align: 'right', alpha: a * (sum ? sum[2] : 0) });
  });
  if (!sum) return;
  const ks = sum[2], yr = y + 46 + rows.length * rh - 20;
  line(x, yr, x + w * ks, yr, { color: C.mute, w: 1.6, alpha: a });
  text(sum[0], x, yr + 34, { role: 'label', size: 18, color: C.heroText, alpha: a * ks });
  text(Math.round(sum[1]) + '°', xr, yr + 37, { role: 'num', size: 30, color: C.heroText, align: 'right', alpha: a * ks });
  if (o.note) text(o.note, x, yr + 62, { role: 'small', size: 17, weight: 600, color: C.mute, alpha: a * ks });
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
const GH_NEAR = ['thumb', 'index', 'middle', 'ring', 'little'];           /* nearest first, from the thumb's side */
function ghView(v) {
  if (GH_V.has(v)) return GH_V.get(v);
  const D = GDHAND[v], q = D.q;
  const pts = a => { const o = []; for (let i = 0; i < a.length; i += 2) o.push([a[i] / q, -a[i + 1] / q]); return o; };
  const path = (L, close) => { const p = new Path2D(); for (const a of L) { const P = pts(a); P.forEach((c, i) => (i ? p.lineTo(c[0], c[1]) : p.moveTo(c[0], c[1]))); if (close) p.closePath(); } return p; };
  const one = d => ({ sil: path(d.sil, true), sh: path(d.sh, true), edges: path(d.edges, false), nail: path(d.nail || [], true), free: path(d.free || [], true), silPts: d.sil.map(pts) });
  const out = Object.assign(one(D), { parts: {}, J: {}, box: D.box, v });
  for (const k in D.parts) out.parts[k] = one(D.parts[k]);
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
let GH_L = [null, null];
function ghCanvas(i, w, h) {
  let c = GH_L[i]; if (!c) c = GH_L[i] = document.createElement('canvas');
  if (c.width < w || c.height < h) { c.width = Math.max(c.width, w); c.height = Math.max(c.height, h); }
  const X = c.getContext('2d'); X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1; X.globalCompositeOperation = 'source-over'; X.clearRect(0, 0, w, h); return X;
}
/** fill, shadow, lines (in the layer's mm frame); outline: also stroke the silhouette (the whole hand: yes; a digit: its edges only) */
function ghBody(X, d, P, px, outline) {
  X.fillStyle = P.lit; X.fill(d.sil);
  X.save(); X.clip(d.sil); X.fillStyle = P.sh; X.fill(d.sh, 'evenodd');
  /* the nails, as the film's ("A Soft"): the skin's greys a little lighter, the free edge paler, the skin's fold round them */
  const NS = FNG_NAIL, k = P.k;
  X.fillStyle = rgba('#FFFFFF', NS.tone[k]); X.fill(d.nail);
  X.save(); X.clip(d.nail); X.fillStyle = rgba('#FFFFFF', NS.free[k]); X.fill(d.free); X.restore();
  X.strokeStyle = P.line; X.globalAlpha *= NS.fold[k]; X.lineWidth = 1.0 * px; X.stroke(d.nail); X.globalAlpha /= NS.fold[k];
  X.restore();
  X.lineJoin = 'round'; X.lineCap = 'round'; X.strokeStyle = P.edge; X.lineWidth = P.ew * px;
  X.stroke(d.edges); if (outline) X.stroke(d.sil);
}
/**
 * The hand, view v ('side' | 'thumb'), its origin at (x, y) on the stage, s px per mm. o = { alpha, hl (a digit lifted out of
 * the rest), kH (0..1: how far), dim (how far the rest recedes, 0.62), fade: [x0, x1] (mm: the forearm fades out from x1 back to
 * x0), ghost (the nearer digits' lines over the lifted one, 0.5) }. The lifted digit is drawn whole over the receding hand, its
 * base fading into the palm behind its knuckle; the digits nearer the viewer stay as faint lines over it.
 */
function ghPaint(v, x, y, s, o = {}) {
  const a = o.alpha == null ? 1 : o.alpha; if (!(a > 0.003)) return;
  const H = ghView(v), P = fngPal(), [bx, by, bw, bh] = H.box;
  const T0 = G.getTransform(), dev = (typeof APP !== 'undefined' && APP.scale ? APP.scale * (APP.dpr || 1) : 1), sEff = s * Math.hypot(T0.a, T0.b) / dev, px = 1 / sEff;
  const G0 = G; G0.save(); G0.translate(x, y); G0.scale(s, s); const M = G0.getTransform(); G0.restore();
  /* the box in device pixels (y down: the box's top is -by) */
  const cs = [[bx, -by], [bx + bw, -by], [bx, -by + bh], [bx + bw, -by + bh]].map(q => [M.a * q[0] + M.c * q[1] + M.e, M.b * q[0] + M.d * q[1] + M.f]);
  const cw = G0.canvas.width, ch = G0.canvas.height;
  const x0 = Math.max(0, Math.floor(Math.min(...cs.map(q => q[0]))) - 4), y0 = Math.max(0, Math.floor(Math.min(...cs.map(q => q[1]))) - 4);
  const x1 = Math.min(cw, Math.ceil(Math.max(...cs.map(q => q[0]))) + 4), y1 = Math.min(ch, Math.ceil(Math.max(...cs.map(q => q[1]))) + 4);
  if (!(x1 > x0 && y1 > y0)) return;
  const ramp = (gr, k0 = 1) => { for (let i = 0; i <= 8; i++) { const u = i / 8; gr.addColorStop(u, 'rgba(0,0,0,' + (k0 * (1 - u * u * (3 - 2 * u))).toFixed(3) + ')'); } return gr; };
  const lw = x1 - x0, lh = y1 - y0, fadeOut = X => { if (!o.fade) return; const [f0, f1] = o.fade; X.save(); X.globalCompositeOperation = 'destination-out';
    X.fillStyle = ramp(X.createLinearGradient(f0, 0, f1, 0)); X.fillRect(bx - 50, -by - 50, f1 - bx + 50, bh + 100); X.restore(); };
  const lifts = (o.lifts || (o.hl ? [[o.hl, o.kH == null ? 1 : o.kH]] : [])).filter(q => q[1] > 0.003), kH = lifts.reduce((m, q) => Math.max(m, clamp(q[1])), 0);
  /* the whole hand */
  const L0 = ghCanvas(0, lw, lh); L0.setTransform(M.a, M.b, M.c, M.d, M.e - x0, M.f - y0);
  ghBody(L0, H, P, px, true); fadeOut(L0);
  G0.save(); G0.setTransform(1, 0, 0, 1, 0, 0); G0.globalAlpha = G0.globalAlpha * a * (1 - (o.dim == null ? 0.45 : o.dim) * kH);
  G0.drawImage(GH_L[0], 0, 0, lw, lh, x0, y0, lw, lh); G0.restore();
  for (const [f, k] of lifts) ghLift(v, H, f, clamp(k), P, px, M, x0, y0, lw, lh, a, ramp, o);
}
/** one digit lifted out of the hand (ghPaint): whole, its base fading behind the knuckle into the palm, the nearer digits as faint
   lines over it, set down at k */
function ghLift(v, H, f, kH, P, px, M, x0, y0, lw, lh, a, ramp, o) {
  const G0 = G, [bx, by, bw, bh] = H.box;
  const d = H.parts[f], J = ghJoints(v, f), L1 = ghCanvas(1, lw, lh); L1.setTransform(M.a, M.b, M.c, M.d, M.e - x0, M.f - y0);
  ghBody(L1, d, P, px, false);
  { const k0 = f === 'thumb' ? J[1] : J[0], k1 = J[f === 'thumb' ? 2 : 1], ux = k1[0] - k0[0], uy = k1[1] - k0[1], ul = Math.hypot(ux, uy) || 1, e = [ux / ul, uy / ul];
    /* fully gone just past the knuckle (where the layer's own edge crosses the skin), whole 12 mm on: no edge across the finger */
    const GR = { thumb: [-6, 8], index: [7, 19], middle: [9, 21], ring: [12, 24], little: [12, 24] }, [g0, g1] = GR[f];   /* the far fingers' knuckles sit under the palm's edge: start further out */
    L1.save(); L1.globalCompositeOperation = 'destination-out';
    L1.fillStyle = ramp(L1.createLinearGradient(k0[0] + e[0] * g0, k0[1] + e[1] * g0, k0[0] + e[0] * g1, k0[1] + e[1] * g1));
    L1.fillRect(bx - 50, -by - 50, bw + 100, bh + 100); L1.restore(); }
  /* the nearer digits: faint lines over it, so it reads as behind them */
  const near = GH_NEAR.slice(0, GH_NEAR.indexOf(f));
  if (near.length) { L1.save(); L1.lineJoin = 'round'; L1.lineCap = 'round'; L1.strokeStyle = P.edge; L1.lineWidth = P.ew * px; L1.globalAlpha = o.ghost == null ? 0.32 : o.ghost;
    for (const n of near) L1.stroke(H.parts[n].edges); L1.restore(); }
  G0.save(); G0.setTransform(1, 0, 0, 1, 0, 0); G0.globalAlpha = G0.globalAlpha * a * kH;
  G0.drawImage(GH_L[1], 0, 0, lw, lh, x0, y0, lw, lh); G0.restore();
}
