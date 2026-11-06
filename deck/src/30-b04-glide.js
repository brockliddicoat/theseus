/* ============================================================================================
   B04, Glide: aim that goes where you put it (revamp v2, 2026-11-06). Eight slides, in film order:
   b04_card · b04_camera (camera, correlation and defocus in one) · b04_focus (a 0.2 mm window, not 0.4) · b04_sag (dots at
   the lens, not big skates) · b04_skates (skates where they count, plate off) · b04_module (the snap-on lens) ·
   b04_sensor (the PAW3970) · b04_reports (full 16-bit reports, no smoothing).
   Everything that moves is moved by something on screen (the hand, the pointer, the light, time). The pad is drawn, not
   rendered (Brock: the old one was "so realistic it's uncanny"): a flat two-tone weave whose one geometry gives both the
   drawing and the sensor's frames. Numbers come from datasheets, named reviews, or a model this file states.
   Helpers are b04_*; nothing here edits shared code.
   ============================================================================================ */
Object.assign(SRC, {
  b04_paw3395: { t: 'PixArt PAW3395DM-T6QU datasheet v1.2 (15 Nov 2022): lens 1:1; Z, lens reference plane to surface, 2.2 / 2.4 / 2.6 mm; 650 ips and 50 g (HP mode); up to 26,000 cpi in 50-cpi steps; lift cut-off 1 or 2 mm; "optically acquiring sequential surface images (frames) and mathematically determining the direction and magnitude of movement"; lens LM19-LSI assembled 18.85 × 21.15 × 9.81 mm, L0AE-LSI1 10.90 × 16.80 × 9.81 mm. §3.5: "Place the lens onto the base plate"; "The optical position reference for the PCB is set by the base plate and lens. Note that the PCB motion due to button presses must be minimized to maintain optical alignment"; "It is recommended to place mouse feet around the base plate opening to stabilize mouse tracking on the surface."', u: 'https://atta.szlcsc.com/upload/public/pdf/source/20251201/5A54B75DA77586FABF8CEFBD8F21947D.pdf' },
  b04_pmw3360: { t: 'PixArt PMW3360DM-T2QU datasheet: up to 12,000 frames a second; 1,296 raw values a frame; lens 1:1; Z 2.2 / 2.4 / 2.6 mm; "Lift detection height = nominal height + 2 mm (default value)"', u: 'https://datasheet.lcsc.com/datasheet/pdf/c018c3e1d470821feefadd37e2f785d5.pdf?productCode=C20612443' },
  b04_adns2610: { t: 'Agilent ADNS-2610 datasheet: 1,500 frames/s; 324 pixels (18 × 18); Z 2.3 / 2.4 / 2.5 mm, "results in ±0.2 mm DOF"; the sensor "measures changes in position by optically acquiring sequential surface images (frames)"; the picture can be read out: "It takes at least 324 frames to complete an image as we can only read 1 pixel per frame", each pixel 0 (black) to 63 (white)', u: 'https://fab.cba.mit.edu/classes/863.09/people/labrune/files/camera/ADNS2610.pdf' },
  b04_adns3080: { t: 'Avago ADNS-3080 datasheet: Z 2.3 to 2.5 mm, "results in ±0.2 mm DOF"; Fig. 11, "Mean Resolution vs. Z" (counts per inch change with the lens height); Fig. 27, "Mean SQUAL vs Z": "SQUAL is typically maximized when the navigation surface is at the optimum distance"; a frame read out as 900 bytes (30 × 30)', u: 'https://dtsheet.com/doc/729170/avago-adns-3080' },
  b04_razer: { t: 'Razer, Focus Pro 50K Optical Sensor Gen-3: 50,000 DPI in 1-DPI steps, 930 IPS, 90 G, 99.8% resolution accuracy, asymmetric cut-off in 26 steps, Frame Sync; "TRACKS FLAWLESSLY ON GLASS" (at least 4 mm clear glass); in the Viper V4 Pro, Basilisk V4 Pro and Naga V3 Pro', u: 'https://www.razer.com/mena-en/technology/razer-focus-pro-sensor' },
  b04_igor: { t: 'igor\'sLAB, Razer Viper V4 Pro review, page 2: the Focus Pro 50K Gen-3, 50,000 DPI in 1-DPI steps, 930 IPS, 90 G, true 8,000 Hz polling, 99.8% resolution accuracy, asymmetric cut-off with up to 26 levels', u: 'https://www.igorslab.de/en/razer-viper-v4-pro-review-49-grams-8-000-hz-competitive-gaming/2/' },
  b04_proset: { t: 'ProSettings.net, Razer Viper V4 Pro review: "two large skates along with a sensor ring"; the skates reshaped from the V3 Pro\'s; 49 g', u: 'https://prosettings.net/reviews/razer-viper-v4-pro/' },
  b04_xbab: { t: 'XBAB (qsxcv), "Modern sensors STILL have smoothing, at high DPI", 14 Jul 2026: smoothing is a moving average, lag about (N − 1) / 2 frame times, motion "delayed and distorted"; the PAW3950 (and 3955) smooth 16 frames for about 450 ms after every set-down, at every DPI; disabling smoothing cuts that to 2 frames, another register to about 12 ms; the PAW3395 sets down in 10 to 20 ms; high-performance framerates are under 8,000 Hz; on the Viper V4 Pro "the velocity trace suddenly jumps at 1500 ms", "quite repeatable"', u: 'https://xbabtech.com/blog/smoothing' },
  b04_tpu: { t: 'TechPowerUp, Razer Viper V4 Pro review: wireless counts capped at 12 bits (±2,047 per report); at least 2 (perhaps 16) frames of smoothing for about 1.5 s after a lift-off (recorded in research/validation-report-2026-11-03.md; TechPowerUp refuses this session\'s fetches)', u: 'https://www.techpowerup.com/review/razer-viper-v4-pro/' },
  b04_pcgV4: { t: 'PC Gamer (Jacob Fox, 22 May 2026): the reviewer Spec0\'s Viper V4 Pro, on third-party dot skates, was "unusable on multiple glasspads"; Razer replaced it and said it would "look into this sensor issue" (no cause given)', u: 'https://pcgamer.com/hardware/gaming-mice/replacing-the-viper-v4-pros-skates-gave-one-reviewer-some-razer-warranty-trouble-after-glass-pad-sensor-issues' },
  b04_pcgX2: { t: 'PC Gamer, Pulsar X2 CrazyLight Medium review: "39 g dot skates, 41 g PTFE (+/- 1 g)" (Pulsar\'s figures): big PTFE pads weigh about 2 g more than a dot set', u: 'https://www.pcgamer.com/hardware/gaming-mice/pulsar-x2-crazylight-medium-review/' },
  b04_zowie: { t: 'ZOWIE FAQ: original skates "approximately 0.5 mm thick"; "lag or tracking issues may occur if the new skates are thicker than the original ones"; "the sensor height may change"', u: 'https://zowie.benq.eu/en-eu/support/faq/product/explanation/zowiegear-faq-kn-00024.html' },
  b04_johnson: { t: 'Johnson, Hagberg, Hjelm & Rempel, "Measuring and characterizing force exposure during computer mouse use", Scand J Work Environ Health 2000;26(5):398-405: grip on the sides 0.35 to 0.43 N on average, the button 0.43 N, dragging 0.90 N', u: 'https://www.sjweh.fi/article/560' },
  b04_deleva: { t: 'de Leva 1996, "Adjustments to Zatsiorsky-Seluyanov\'s segment inertia parameters", J Biomech 29(9):1223-1230, Table 4: the hand is 0.61 % of body mass in men (reference body 73.0 kg), 0.56 % in women; so a 73 kg man\'s hand weighs 4.4 N (derived). No study measures the downward force on a mouse in play (research fill, 2026-11-06), so a resting hand\'s weight stands in', u: 'https://ebm.ufabc.edu.br/wp-content/uploads/2013/12/Leva-1996.pdf' },
  b04_insider: { t: 'Razer Insider, "Viper V4 Pro tracking issues on glass mousepad" (2026-09-29 to 10-03): owners report it "stops tracking and stutters sometimes" on a Pulsar meiy glass pad and a white Razer Atlas at Low or Medium Smart Tracking, with stock feet; anecdotal', u: 'https://insider.razer.com/razer-support-45/viper-v4-pro-tracking-issues-on-glass-mousepad-91843' },
  b04_valid: { t: 'This deck\'s validation report (research/validation-report-2026-11-03.md): Razer\'s Focus Pro 50K Gen-3 has no public PixArt part number; the historical pattern, Focus+ → PAW3395 and Focus Pro 30K → PAW3950, is an analogy; TechPowerUp: "a completely different package and a new tracking engine"', u: '' },
  b04_dempster: { t: 'Dempster\'s segment masses (as used by Visual3D): the hand is 0.006 of body mass, so 0.48 kg (4.7 N) for an 80 kg adult', u: 'https://wiki.has-motion.com/Segment_Mass' },
  b04_zk: { t: 'Zaunkoenig, "M1K weight in review": the PMW3360\'s lens weighed 0.8 g, more than the sensor (0.6 g)', u: 'https://zaunkoenig.co/blog/m1k-weight-in-review' },
  b04_tpuUlx: { t: 'TechPowerUp, Finalmouse UltralightX review: the rear screws sit under the rear skates', u: 'https://www.techpowerup.com/review/finalmouse-ultralightx/' },
  b04_brock: { t: 'Brock Liddicoat, "In Pursuit of an Objectively Better Mouse": #8 POM skates, PTFE in the box; #10 two dots a corner ("with only 1 dot per corner some softer pads cause the dots to sink in too much and the pad to scrape the bottom of the mouse"); #37 "a lens that only supports a single dot skate"; #52 screws not under the skates; #76 "The PAW 3395 can struggle on certain glass pads"; "0.65mm is the optimal skate height"; review notes F2.02 ("the sensors window to focus is actually only 0.2mm optimally"), F9.20, F20.2, F21.6', u: '' },
  b04_model: { t: 'This deck\'s pad model (b04_sag): a rigid mouse on its skates, pressed into a soft cloth pad (a Pasternak foundation: 4 mm of foam, the cloth dragged down within about 2 mm of each skate), set so one dot a corner reaches the base (0.65 mm) under a firm 10 N press (Brock, #10); solved at 5 N on the hump (z −20) and scaled to the slide\'s press (linear). The 3D shell\'s skates, plan 5\'s lens (KEY_PARTS). Solved on a 0.5 mm grid (handoff work/b04/model).', u: '' },
  b04_r3d: { t: 'This deck\'s 3D board (3d/, scene pcb) and skate sets (3d/parts/skates.js): the castellated module 8.4 × 9.8 × 0.62 mm, 16 castellations at 1.2 mm; the snap-on lens, 5.2 mm wide and 14.2 mm across its clips, an imaging lens 2.84 mm across and a light lens 2.0 mm; its two dots at +6.3 and −6.7 mm; the dot, 6.5 mm and 0.65 mm tall (glide 0.38, tape, PORON 0.17, tape)', u: '' }
});

/* ---------- where the lens is ----------
   Plan 5 (H1, 2026-11-06): the sensor module's centre at mouse z 16.57 mm, the imaging axis 1.1 mm ahead of it (17.67), the
   LED 1.9 mm behind (14.67), the clip-on lens's reference plane 2.40 mm over the pad, its two dots at z 22.87 and 9.87, the
   eight corner dots on the rim's ledges. All read from KEY_PARTS (deck/src/03-parts.js, generated from the 3D board and
   shell); the numbers below are only the fallback. The pad model (b04_sag) was solved at these same places. */
const B04 = { lensZ: 16.57, axis: 1.1, ldots: [6.3, -6.7], dot: 6.5, stack: 0.65, Z: 2.4 };
/** the sensor's places in the mouse's frame (z toward the nose, x toward the user's left), from KEY_PARTS */
function b04_key() {
  if (b04_key.v) return b04_key.v;
  let v = { lens: 16.57, axis: 17.67, led: 14.67, Z: 2.4, hw: 2.6, hl: 7.1, ldots: [22.87, 9.87],
    corner: [[13.72, 47.29], [19.97, 42.39], [17.2, -43.18], [10.82, -47.93], [-19.92, 42.53], [-13.49, 47.37], [-11.11, -47.83], [-17.4, -42.91]] };
  try {
    if (typeof KEY_PARTS !== 'undefined' && KEY_PARTS.lens) {
      const K = KEY_PARTS;
      v = { lens: -K.lens.c[1], axis: -K.lens.axis[1], led: -K.lens.led[1], Z: K.lens.y0, hw: K.lens.hw, hl: K.lens.hl,
        ldots: K.lensDots.pts.map(p => -p[1]), corner: K.skates.pts.map(p => [-p[0], -p[1]]) };
    }
  } catch (e) { }
  return (b04_key.v = v);
}
function b04_lensZ() { return b04_key().lens; }

/* ---------- the cloth, drawn ----------
   A plain weave: warp yarns along v, weft yarns along u, 0.32 mm apart, over one and under one, drawn as the textbook
   picture of a plain weave: bands that interlace, the one on top showing at each crossing and the one going under darkened
   beside it, flat in two greys with crisp edges (no lighting, no photo texture). Each yarn is a little
   off its place and its width (seeded), and a few stray fibres and specks lie on top: these are what the sensor locks onto,
   and they keep the pattern from repeating inside the search. The cloth repeats every 16 yarns (5.12 mm), so it can slide
   for ever. b04_tex lays the same cloth down as a brightness (0 dark to 1 light) for the sensor's frames. */
const B04W = (function () {
  const N = 16, p = 0.32, R = rng(20261106), P = N * p;
  const yarn = () => ({ d: (R() - 0.5) * 0.03, w: p * (0.74 + (R() - 0.5) * 0.08), tone: (R() - 0.5) * 0.06 });
  const warp = [], weft = []; for (let k = 0; k < N; k++) { warp.push(yarn()); weft.push(yarn()); }
  /* stray fibres: a few long, thin curves lying across the yarns (cubic, in mm, within the tile) */
  const fib = [];
  for (let k = 0; k < 7; k++) {
    const x0 = R() * P, y0 = R() * P, a = R() * TAU, L = 0.7 + R() * 1.3, bend = (R() - 0.5) * 0.9;
    const pts = []; for (let i = 0; i <= 16; i++) { const s = i / 16, aa = a + bend * (s - 0.5); pts.push([x0 + Math.cos(aa) * L * s, y0 + Math.sin(aa) * L * s]); }
    fib.push({ pts, w: 0.016 + R() * 0.01, v: 0.97 });
  }
  /* specks: dust and lint, dark and light, 25 to 60 µm */
  const spk = []; for (let k = 0; k < 46; k++) spk.push({ x: R() * P, y: R() * P, r: 0.012 + R() * 0.018, v: R() < 0.55 ? 0.04 : 0.98 });
  return { N, p, P, warp, weft, fib, spk, top: { warp: 0.80, weft: 0.60 }, gap: 0.13 };
})();
const b04_wrap = v => ((v % B04W.P) + B04W.P) % B04W.P;
/** the weave's brightness at (u, v) mm (yarns only), as the textbook drawing of a plain weave: warp bands along v and weft
   bands along u, 0.32 mm apart and about three quarters of that wide; where two cross, the one on top shows (the warp
   where i + j is even, the weft where it is odd); beside a crossing the band going under darkens for a few hundredths of
   a millimetre (the dip); between bands, the dark gap */
function b04_yarnAt(u, v) {
  const W = B04W, p = W.p, uu = b04_wrap(u), vv = b04_wrap(v);
  const i = Math.floor(uu / p) % W.N, j = Math.floor(vv / p) % W.N, wa = W.warp[i], we = W.weft[j];
  const du = Math.abs(uu - ((i + 0.5) * p + wa.d)), dv = Math.abs(vv - ((j + 0.5) * p + we.d));
  const inWarp = du <= wa.w / 2, inWeft = dv <= we.w / 2, warpTop = ((i + j) & 1) === 0, dip = 0.035;
  if (inWarp && inWeft) return warpTop ? W.top.warp + wa.tone : W.top.weft + we.tone;
  if (inWarp) return (!warpTop && dv <= we.w / 2 + dip) ? (W.top.warp + wa.tone) * 0.62 : W.top.warp + wa.tone;
  if (inWeft) return (warpTop && du <= wa.w / 2 + dip) ? (W.top.weft + we.tone) * 0.62 : W.top.weft + we.tone;
  return W.gap;
}
/** the cloth's greys, the same mapping for the drawing and the frames (the sensor sees in infrared: no colour) */
function b04_grey(v) { const g = Math.round(14 + 226 * Math.pow(clamp(v), 1.15)); return 'rgb(' + g + ',' + (g + 1) + ',' + Math.min(255, g + 3) + ')'; }
/** draw the cloth as vectors into a box: s px per mm, (u0, v0) the mm at the box's top left. The same bands as
   b04_yarnAt: the weft bands, then the warp bands over them, then at every weft-on-top crossing the weft's piece across
   it; each piece edged in a dark hairline, with the dip beside each crossing. o = { alpha, edge (outline alpha), fib } */
function b04_clothDraw(x, y, w, h, s, u0, v0, o = {}) {
  const W = B04W, p = W.p, a = o.alpha == null ? 1 : o.alpha; if (a <= 0.003) return;
  G.save(); G.globalAlpha = a; G.beginPath(); G.rect(x, y, w, h); G.clip();
  G.fillStyle = b04_grey(W.gap); G.fillRect(x, y, w, h);
  const i0 = Math.floor(u0 / p) - 1, i1 = Math.ceil((u0 + w / s) / p) + 1, j0 = Math.floor(v0 / p) - 1, j1 = Math.ceil((v0 + h / s) / p) + 1;
  const X = u => x + (u - u0) * s, Y = v => y + (v - v0) * s, lw = Math.max(1, Math.min(2, s * 0.005)), dip = 0.035;
  const edge = rgba('#000000', o.edge == null ? 0.5 : o.edge), yr = k => ((k % W.N) + W.N) % W.N;
  const bandH = j => { const we = W.weft[yr(j)], cv = (j + 0.5) * p + we.d; return [cv - we.w / 2, cv + we.w / 2, W.top.weft + we.tone]; };
  const bandV = i => { const wa = W.warp[yr(i)], cu = (i + 0.5) * p + wa.d; return [cu - wa.w / 2, cu + wa.w / 2, W.top.warp + wa.tone]; };
  const edgeLine = (x0, y0, x1, y1) => { G.beginPath(); G.moveTo(x0, y0); G.lineTo(x1, y1); G.strokeStyle = edge; G.lineWidth = lw; G.stroke(); };
  /* 1. the weft bands, full length, with their edges */
  for (let j = j0; j <= j1; j++) { const [a0, a1, tn] = bandH(j); G.fillStyle = b04_grey(tn); G.fillRect(x, Y(a0), w, (a1 - a0) * s); edgeLine(x, Y(a0), x + w, Y(a0)); edgeLine(x, Y(a1), x + w, Y(a1)); }
  /* 2. the warp bands over them */
  for (let i = i0; i <= i1; i++) { const [a0, a1, tn] = bandV(i); G.fillStyle = b04_grey(tn); G.fillRect(X(a0), y, (a1 - a0) * s, h); edgeLine(X(a0), y, X(a0), y + h); edgeLine(X(a1), y, X(a1), y + h); }
  /* 3. each crossing: the band on top shows across it, the one going under darkens beside it */
  for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
    const [u0b, u1b, tw0] = bandV(i), [v0b, v1b, tf] = bandH(j);
    if (((yr(i) + yr(j)) & 1) === 0) {
      /* warp on top: the weft dips beside it */
      G.fillStyle = b04_grey(tf * 0.62); G.fillRect(X(u0b - dip), Y(v0b), dip * s, (v1b - v0b) * s); G.fillRect(X(u1b), Y(v0b), dip * s, (v1b - v0b) * s);
    } else {
      /* weft on top: its piece across the warp, and the warp dips above and below it */
      G.fillStyle = b04_grey(tw0 * 0.62); G.fillRect(X(u0b), Y(v0b - dip), (u1b - u0b) * s, dip * s); G.fillRect(X(u0b), Y(v1b), (u1b - u0b) * s, dip * s);
      G.fillStyle = b04_grey(tf); G.fillRect(X(u0b) - 0.5, Y(v0b), (u1b - u0b) * s + 1, (v1b - v0b) * s);
      edgeLine(X(u0b), Y(v0b), X(u1b), Y(v0b)); edgeLine(X(u0b), Y(v1b), X(u1b), Y(v1b));
    }
  }
  /* fibres and specks, in every repeat of the tile that the box shows */
  const r0 = Math.floor(u0 / W.P) - 1, r1 = Math.floor((u0 + w / s) / W.P) + 1, q0 = Math.floor(v0 / W.P) - 1, q1 = Math.floor((v0 + h / s) / W.P) + 1;
  for (let r = r0; r <= r1; r++) for (let q = q0; q <= q1; q++) {
    const ox = r * W.P, oy = q * W.P;
    if (o.fib !== 0) for (const f of W.fib) { G.beginPath(); f.pts.forEach((pt, k) => (k ? G.lineTo(X(pt[0] + ox), Y(pt[1] + oy)) : G.moveTo(X(pt[0] + ox), Y(pt[1] + oy)))); G.strokeStyle = b04_grey(f.v); G.lineWidth = Math.max(1.4, f.w * s); G.lineCap = 'round'; G.stroke(); }
    for (const k of W.spk) { G.beginPath(); G.arc(X(k.x + ox), Y(k.y + oy), Math.max(1.2, k.r * s), 0, TAU); G.fillStyle = b04_grey(k.v); G.fill(); }
  }
  G.restore();
}
/** the cloth drawn once into a canvas of w × h px (at the deck's device scale, so it stays crisp), cached by key */
const B04CV = new Map();
const b04_res = () => (typeof APP !== 'undefined' && APP.scale ? clamp(Math.round(APP.scale * (APP.dpr || 1) * 4) / 4, 1, 2) : 1);
function b04_clothCv(key, w, h, s, u0, v0) {
  const k = b04_res(), id = key + '@' + k + ':' + Math.round(u0 * 1000) + ':' + Math.round(v0 * 1000);
  let c = B04CV.get(id); if (c) return c;
  c = document.createElement('canvas'); c.width = Math.round(w * k); c.height = Math.round(h * k);
  const g0 = G; G = c.getContext('2d'); G.setTransform(k, 0, 0, k, 0, 0);
  try { b04_clothDraw(0, 0, w, h, s, u0, v0); } finally { G = g0; }
  if (B04CV.size > 60) B04CV.delete(B04CV.keys().next().value);
  B04CV.set(id, c); return c;
}
/** a canvas drawn into a box with a disc blur of radius rpx: the picture copied round a disc of rpx (a real lens's blur
   is a disc, the circle of confusion), so a sharp picture softens the way a camera's does */
const B04DISC = (() => { const o = [[0, 0]]; for (const [n, rr0] of [[6, 0.42], [12, 0.78], [18, 1.0]]) for (let i = 0; i < n; i++) { const a = TAU * (i + (n === 12 ? 0.5 : 0)) / n; o.push([Math.cos(a) * rr0, Math.sin(a) * rr0]); } return o; })();
function b04_blit(cv, x, y, w, h, rpx, a = 1, o = {}) {
  if (a <= 0.003) return;
  G.save(); if (o.r != null) { rrPath(x, y, w, h, o.r); G.clip(); } else { G.beginPath(); G.rect(x, y, w, h); G.clip(); }
  G.imageSmoothingEnabled = !o.px; if (!o.px) G.imageSmoothingQuality = 'high';
  if (rpx < 0.35) { G.globalAlpha = a; G.drawImage(cv, x, y, w, h); }
  else {
    /* draw the copies at equal weight: each pass blends over the average so far (1/(k+1)) */
    G.globalAlpha = a; G.drawImage(cv, x, y, w, h);
    for (let k = 1; k < B04DISC.length; k++) { const [dx, dy] = B04DISC[k]; G.globalAlpha = a / (k + 1); G.drawImage(cv, x + dx * rpx, y + dy * rpx, w, h); }
  }
  G.restore();
}

/* ---------- the optics: a thin lens at 1:1 ----------
   PixArt's lenses image the pad 1:1 at Z = 2.4 mm from the lens reference plane (PAW3395, PMW3360); here the reference
   plane is the lens's principal plane, so u = Z, v0 = 2.4 mm and f = 1.2 mm. A pad at u images at v = 1 / (1/f − 1/u);
   on the die (still at v0) one point of the pad spreads into a disc, c = A·|v − v0| / v. A, the aperture, is the one free
   number: it is set from the datasheets' depth of field (ADNS-2610 and ADNS-3080: "±0.2 mm DOF"): at 0.2 mm off, the blur
   reaches one pixel (30 µm), the most a frame can take and stay sharp. The picture's scale on the die is v0 / u, so the
   counts for one move change with the height: about 4 % for every 0.1 mm (the ADNS-3080's "Mean Resolution vs. Z"). */
const B04O = { f: 1.2, v0: 2.4, z0: 2.4, A: 0.6, pix: 0.030, n: 36 };
(function () { const cc = z => { const v = 1 / (1 / B04O.f - 1 / z); return Math.abs(v - B04O.v0) / v; }; B04O.A = B04O.pix / ((cc(B04O.z0 - 0.2) + cc(B04O.z0 + 0.2)) / 2); })();
/** at lens height z (mm): { c (blur on the die, mm), cpx (in pixels), rmm (the blur's radius on the pad, mm), m (scale) } */
function b04_optics(z) {
  const u = Math.max(1.3, z), v = 1 / (1 / B04O.f - 1 / u), c = B04O.A * Math.abs(v - B04O.v0) / v, m = B04O.v0 / u;
  return { u, v, c, cpx: c / B04O.pix, rmm: c / m / 2, m, cpi: m };
}

/* ---------- frames: what the die records ----------
   The cloth is first laid down once as a texture: one tile (5.12 mm) at 10 µm a texel, 512 × 512: the yarns from b04_yarnAt, the fibres and specks stamped over them. A
   frame is n × n pixels of pix mm (the die's pitch; on the pad at 1:1), centred on (u, v) mm: the texture read at three
   samples a pixel (10 µm apart), blurred by the disc of the lens's circle of confusion (radius rmm, from b04_optics),
   then averaged 3 × 3 into each pixel. An auto-exposure divides by the mean (every PixArt part does), and a little read
   noise is added (seeded, so a frame is the same every time it is drawn). Cached. */
const B04T = { N: 512, mm: 0.010, tex: null };
function b04_tex() {
  if (B04T.tex) return B04T.tex;
  const N = B04T.N, mm = B04T.mm, T = new Float32Array(N * N), W = B04W;
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) T[j * N + i] = b04_yarnAt((i + 0.5) * mm, (j + 0.5) * mm);
  const wr = k => ((k % N) + N) % N;
  /* stamp the fibres (segments of width f.w) and the specks over the texels they cover, wrapping round the tile */
  for (const f of W.fib) for (let k = 1; k < f.pts.length; k++) {
    const a = f.pts[k - 1], b = f.pts[k], r = f.w / 2 + mm, i0 = Math.floor((Math.min(a[0], b[0]) - r) / mm), i1 = Math.ceil((Math.max(a[0], b[0]) + r) / mm), j0 = Math.floor((Math.min(a[1], b[1]) - r) / mm), j1 = Math.ceil((Math.max(a[1], b[1]) + r) / mm);
    const dx = b[0] - a[0], dy = b[1] - a[1], L2 = dx * dx + dy * dy || 1e-9;
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) { const px = (i + 0.5) * mm, py = (j + 0.5) * mm, q = clamp(((px - a[0]) * dx + (py - a[1]) * dy) / L2), d = Math.hypot(px - a[0] - q * dx, py - a[1] - q * dy); if (d <= f.w / 2 + mm * 0.35) T[wr(j) * N + wr(i)] = f.v; }
  }
  for (const s of W.spk) { const r = s.r + mm * 0.35, i0 = Math.floor((s.x - r) / mm), i1 = Math.ceil((s.x + r) / mm), j0 = Math.floor((s.y - r) / mm), j1 = Math.ceil((s.y + r) / mm); for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) { const px = (i + 0.5) * mm - s.x, py = (j + 0.5) * mm - s.y; if (px * px + py * py <= r * r) T[wr(j) * N + wr(i)] = s.v; } }
  return (B04T.tex = T);
}
/** the texture at (u, v) mm, bilinear, wrapping */
function b04_texAt(T, u, v) {
  const N = B04T.N, x = u / B04T.mm - 0.5, y = v / B04T.mm - 0.5, xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi;
  const w = k => ((k % N) + N) % N, x0 = w(xi), x1 = w(xi + 1), y0 = w(yi) * N, y1 = w(yi + 1) * N;
  return (T[y0 + x0] * (1 - fx) + T[y0 + x1] * fx) * (1 - fy) + (T[y1 + x0] * (1 - fx) + T[y1 + x1] * fx) * fy;
}
/** a disc blur of radius r (cells) on an S × S grid, edges clamped; prefix sums along rows, the disc's rim weighted by
   its cover so the blur grows smoothly with r */
function b04_disc(P, S, r) {
  if (r < 0.05) return P;
  const R = Math.floor(r) + 1, Wd = S + 2 * R, row = new Float32Array(Wd * Wd);
  for (let j = 0; j < Wd; j++) { const sy = clamp(j - R, 0, S - 1) * S; for (let i = 0; i < Wd; i++) row[j * Wd + i] = P[sy + clamp(i - R, 0, S - 1)]; }
  const W1 = Wd + 1, pre = new Float32Array(Wd * W1);
  for (let j = 0; j < Wd; j++) { let a = 0; for (let i = 0; i < Wd; i++) { a += row[j * Wd + i]; pre[j * W1 + i + 1] = a; } }
  const sp = [];
  for (let dy = -R; dy <= R; dy++) { const ady = Math.abs(dy); if (ady <= r) { const hw = Math.sqrt(Math.max(0, r * r - dy * dy)), n = Math.floor(hw); sp.push(dy, n, hw - n, 1); } else if (ady - r < 1) sp.push(dy, 0, 0, 1 - (ady - r)); }
  const ns = sp.length / 4; let wsum = 0; for (let q = 0; q < ns; q++) wsum += sp[q * 4 + 3] * (2 * sp[q * 4 + 1] + 1 + 2 * sp[q * 4 + 2]);
  const out = new Float32Array(S * S), inv = 1 / wsum;
  for (let j = 0; j < S; j++) for (let i = 0; i < S; i++) {
    let s = 0; const ci = i + R;
    for (let q = 0; q < ns; q++) { const rj = j + R + sp[q * 4], n = sp[q * 4 + 1], fr = sp[q * 4 + 2], b = rj * W1 + ci; let v = pre[b + n + 1] - pre[b - n]; if (fr > 0) { const rb = rj * Wd + ci; v += fr * (row[rb + n + 1] + row[rb - n - 1]); } s += sp[q * 4 + 3] * v; }
    out[j * S + i] = s * inv;
  }
  return out;
}
const B04F = new Map();
function b04_frame(u, v, z, seed = 1, o = {}) {
  const n = o.n || B04O.n, key = n + ':' + Math.round(u * 2000) + ':' + Math.round(v * 2000) + ':' + Math.round(z * 1000) + ':' + seed;
  let F = B04F.get(key); if (F) return F;
  const T = b04_tex(), op = b04_optics(z), pm = B04O.pix / op.m, k = 3, S = n * k, st = pm / k, P = new Float32Array(S * S);
  for (let j = 0; j < S; j++) for (let i = 0; i < S; i++) P[j * S + i] = b04_texAt(T, u + (i + 0.5 - S / 2) * st, v + (j + 0.5 - S / 2) * st);
  const Q = b04_disc(P, S, op.rmm / st), R = rng(seed * 7919 + 13);
  F = new Float32Array(n * n); let mean = 0;
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { let s = 0; for (let b = 0; b < k; b++) for (let a = 0; a < k; a++) s += Q[(j * k + b) * S + i * k + a]; F[j * n + i] = s / (k * k); mean += F[j * n + i]; }
  mean /= n * n;
  for (let q = 0; q < n * n; q++) F[q] = clamp(F[q] / (2 * mean) + (R() - 0.5) * 0.02);
  if (B04F.size > 160) B04F.delete(B04F.keys().next().value);
  B04F.set(key, F); return F;
}
/** a frame as a canvas (made once per frame array) */
const B04FC = new WeakMap();
function b04_frameCv(F, n = B04O.n) {
  let c = B04FC.get(F); if (c) return c;
  c = document.createElement('canvas'); c.width = n; c.height = n;
  const g = c.getContext('2d'), id = g.createImageData(n, n), d = id.data;
  for (let k = 0; k < n * n; k++) { const gv = Math.round(14 + 226 * Math.pow(clamp(F[k]), 1.15)); d[k * 4] = gv; d[k * 4 + 1] = gv + 1; d[k * 4 + 2] = Math.min(255, gv + 3); d[k * 4 + 3] = 255; }
  g.putImageData(id, 0, 0); B04FC.set(F, c); return c;
}
/** how much fine detail a frame holds (the datasheets' SQUAL idea): the RMS of what is left after taking each pixel's
   3 × 3 mean away. Defocus removes it first; the read noise sets the floor */
function b04_sharp(F, n = B04O.n) {
  let s = 0, c = 0;
  for (let j = 1; j < n - 1; j++) for (let i = 1; i < n - 1; i++) { const k = j * n + i; let m = 0; for (let b = -1; b <= 1; b++) for (let a = -1; a <= 1; a++) m += F[k + b * n + a]; const d = F[k] - m / 9; s += d * d; c++; }
  return Math.sqrt(s / c);
}
/** the DSP's search: the mean absolute difference between A shifted by (sx, sy) and B over their overlap, for every shift
   within ±S pixels; the best refined to a fraction of a pixel with a parabola. { map, S, best, sub, min, contrast } where
   contrast is how far the best stands below the average of the map (a sharp picture gives a deep, narrow minimum) */
function b04_match(A, B, n, S) {
  const D = 2 * S + 1, map = new Float32Array(D * D); let best = 1e9, bx = 0, by = 0, tot = 0;
  for (let sy = -S; sy <= S; sy++) for (let sx = -S; sx <= S; sx++) {
    let s = 0, c = 0;
    for (let j = Math.max(0, -sy); j < Math.min(n, n - sy); j++) for (let i = Math.max(0, -sx); i < Math.min(n, n - sx); i++) { s += Math.abs(A[(j + sy) * n + i + sx] - B[j * n + i]); c++; }
    const v = s / c; map[(sy + S) * D + sx + S] = v; tot += v; if (v < best) { best = v; bx = sx; by = sy; }
  }
  const at = (x, y) => map[(clamp(y, -S, S) + S) * D + clamp(x, -S, S) + S];
  const par = (m1, m0, p1) => { const d = m1 - 2 * m0 + p1; return d > 1e-9 ? clamp(0.5 * (m1 - p1) / d, -0.5, 0.5) : 0; };
  const fx = Math.abs(bx) < S ? par(at(bx - 1, by), best, at(bx + 1, by)) : 0, fy = Math.abs(by) < S ? par(at(bx, by - 1), best, at(bx, by + 1)) : 0;
  const avg = tot / (D * D);
  return { map, S, best: [bx, by], sub: [bx + fx, by + fy], min: best, avg, contrast: avg > 1e-9 ? 1 - best / avg : 0 };
}

/* ---------- the sensor in section, to scale ----------
   As the 3D board builds it (3d/parts/boardparts.js: buildSensorModule, buildSnapLens; plan 5's board), in the module's own
   frame: z along the mouse (mm, the module's centre at 0, + toward the nose), y up from the board's top face (the board is
   1.0 mm, y −1 to 0; its top 5.03 mm over the pad in the mouse). The castellated module (8.4 × 9.8 × 0.62) sits on the
   board, its die looking down through a 4.8 mm aperture; the LED 1.9 mm behind the centre, the imaging axis 1.1 mm ahead.
   The snap-on lens hangs under the board: an upper block 5.2 × 9.6, a lower block 4.4 × 7.2, a boss up into the aperture,
   the imaging dome (Ø2.84) and the light dome (Ø2.0) on its face, and a clip at each end (z ±6) whose peg snaps up
   through the board. Its lowest point, the imaging dome (the lens reference plane), is 2.63 mm under the board's top, so
   the cloth is PixArt's Z = 2.40 mm under it (H1, 2026-11-06: the lens made 1.12 mm shallower than the first 3D cut,
   which put the dome 1.28 mm over the pad). */
const B04S = { ref: -2.63, axis: 1.1, led: -1.9, slots: [6.0, -6.0], board: [-1.0, 0], top: 5.03, up: -1.75, lo: -2.13, col: -2.20 };
const B04M = {
  board: () => (TH ? '#202126' : '#232429'), copper: '#8C8C92', mod: () => (TH ? '#0E0F11' : '#0B0C0E'), gold: '#B4B7BD', goldD: '#8C8C92', solder: '#D2D4D9',
  clear: () => (TH ? 'rgba(214,226,232,0.70)' : 'rgba(214,226,232,0.22)'), clearE: () => (TH ? '#6F8187' : '#AFC1C8'),
  yarn: () => (TH ? '#3C3E43' : '#4A4C52'), yarnE: () => (TH ? '#1E1F22' : '#6A6D74'), foam: () => (TH ? '#8C8C90' : '#2D2E31'), foamE: () => (TH ? '#6E6E72' : '#3E3F43'), base: () => (TH ? '#2A2B2E' : '#17181B')
};
/** a filled or stroked path at an alpha (the deck's primitives reset G.globalAlpha, so drawings pass theirs to each call) */
function b04_shape(path, fill, stroke, lw, a = 1) {
  if (a <= 0.003) return;
  G.save(); G.globalAlpha = a; G.beginPath(); path();
  if (fill) { G.fillStyle = fill; G.fill(); }
  if (stroke) { G.strokeStyle = stroke; G.lineWidth = lw || 1.5; G.lineJoin = 'round'; G.stroke(); }
  G.restore();
}
/** the pad in section from x0 to x1 (px), its cloth's top at yS, s px per mm: the weft yarns cut across (0.32 mm apart),
   the warp weaving over and under them, the foam (o.foam mm, 4) and the rubber base. off (mm): how far the pad has slid.
   o.dip(xpx) → mm: the cloth pushed down at a point (a skate's sink, drawn); o.cells: the foam's open cells */
function b04_padSec(x0, x1, yS, s, off, a, o = {}) {
  if (a <= 0.003) return;
  const p = B04W.p, hc = 0.40, foam = o.foam == null ? 4 : o.foam, dip = o.dip || (() => 0), Ys = xx => yS + dip(xx) * s;
  /* the foam: its top follows the cloth, its bottom stays on the desk */
  b04_shape(() => { G.moveTo(x0, Ys(x0) + hc * s); for (let xx = x0; xx <= x1 + 0.1; xx += 3) G.lineTo(xx, Ys(xx) + hc * s); G.lineTo(x1, yS + foam * s); G.lineTo(x0, yS + foam * s); G.closePath(); }, B04M.foam(), null, 0, a);
  b04_shape(() => G.rect(x0, yS + foam * s, x1 - x0, 0.5 * s), B04M.base(), null, 0, a);
  if (o.cells !== false && s > 20) { const R = rng(77); G.save(); G.beginPath(); G.rect(x0, yS, x1 - x0, foam * s); G.clip(); for (let k = 0; k < (x1 - x0) * foam * s / 900; k++) { const cx = x0 + R() * (x1 - x0), cy = yS + (hc + 0.15 + R() * (foam - hc - 0.3)) * s + dip(cx) * s * (1 - (R() * 0.6)), r = (0.08 + R() * 0.12) * s; circle(cx, cy, r, { color: B04M.foamE(), w: 1.2, alpha: a * 0.8 }); } G.restore(); }
  /* the cloth: weft yarns cut across, flattened ellipses, and the warp ribbon over and under them */
  if (s >= 14) {
    G.save(); G.beginPath(); G.rect(x0, yS - 0.6 * s + Math.min(0, -2), x1 - x0, (hc + 1.4) * s + 400); G.clip();
    const j0 = Math.floor((-off) / p) - 2, j1 = j0 + Math.ceil((x1 - x0) / (p * s)) + 4, warp = [];
    for (let j = j0; j <= j1; j++) {
      const cx = x0 + ((j + 0.5) * p + off) * s, up = (j & 1) ? 1 : -1, cy = Ys(cx) + (0.19 + 0.045 * up) * s;
      b04_shape(() => G.ellipse(cx, cy, 0.142 * s, 0.085 * s, 0, 0, TAU), B04M.yarn(), B04M.yarnE(), 1.2, a);
      warp.push([cx, Ys(cx) + (0.19 - 0.045 * up - 0.095 * up) * s]);
    }
    if (warp.length > 2) { const pts = monoCurve(warp, 4); G.save(); G.globalAlpha = a; G.beginPath(); pts.forEach((q, i) => (i ? G.lineTo(q[0], q[1]) : G.moveTo(q[0], q[1]))); G.lineCap = 'round'; G.strokeStyle = B04M.yarnE(); G.lineWidth = 0.075 * s + 2; G.stroke(); G.strokeStyle = B04M.yarn(); G.lineWidth = 0.075 * s; G.stroke(); G.restore(); }
    G.restore();
  } else {
    /* far away: the cloth as one band */
    b04_shape(() => { G.moveTo(x0, Ys(x0)); for (let xx = x0; xx <= x1 + 0.1; xx += 3) G.lineTo(xx, Ys(xx)); for (let xx = x1; xx >= x0 - 0.1; xx -= 3) G.lineTo(xx, Ys(xx) + hc * s); G.closePath(); }, B04M.yarn(), null, 0, a);
    poly(Array.from({ length: Math.ceil((x1 - x0) / 3) + 1 }, (_, k) => { const xx = Math.min(x1, x0 + k * 3); return [xx, Ys(xx)]; }), { color: B04M.yarnE(), w: 1.5, alpha: a });
  }
}
/** the board in section (y −1 to 0) from z0 to z1, with the aperture and the two clip holes cut through it, copper inside */
function b04_boardSec(X, Y, z0, z1, a) {
  const holes = [[-6.85, -5.15], [-2.4, 2.4], [5.15, 6.85]], segs = []; let z = z0;
  for (const [h0, h1] of holes) { if (h1 < z0 || h0 > z1) continue; segs.push([z, Math.max(z0, h0)]); z = Math.min(z1, h1); } segs.push([z, z1]);
  for (const [za, zb] of segs) { if (zb - za <= 0) continue; b04_shape(() => G.rect(X(za), Y(0), X(zb) - X(za), Y(-1) - Y(0)), B04M.board(), null, 0, a); line(X(za), Y(0), X(zb), Y(0), { color: inkA(TH ? 0.35 : 0.25), w: 1.2, alpha: a }); }
  for (const yy of [-0.25, -0.75]) for (const [za, zb] of segs) if (zb > za) line(X(za), Y(yy), X(zb), Y(yy), { color: B04M.copper, w: 1, alpha: 0.35 * a });
}
/** the castellated module on the board, side view: black substrate, 8 gold half-holes along its edge with solder fillets
   onto the board's pads, and under it, in the aperture, the die (its pixel array facing down) and the LED */
function b04_moduleSec(X, Y, s, a) {
  b04_shape(() => rrPath(X(-4.9), Y(0.67), 9.8 * s, 0.62 * s, 0.08 * s), B04M.mod(), TH ? null : 'rgba(255,255,255,0.20)', 1.2, a);
  for (let k = 0; k < 8; k++) {
    const zc = (k - 3.5) * 1.2;
    b04_shape(() => { G.moveTo(X(zc - 0.5), Y(0)); G.quadraticCurveTo(X(zc), Y(0.42), X(zc + 0.5), Y(0)); G.closePath(); }, B04M.solder, null, 0, a);
    b04_shape(() => G.rect(X(zc - 0.27), Y(0.67), 0.54 * s, 0.62 * s), B04M.gold, null, 0, a);
    line(X(zc - 0.12), Y(0.62), X(zc - 0.12), Y(0.1), { color: 'rgba(255,255,255,0.5)', w: 1.2, alpha: a });
  }
  b04_shape(() => rrPath(X(B04S.axis - 0.8), Y(0.05), 1.6 * s, 0.38 * s, 2), '#2A2B30', null, 0, a);                          /* the die */
  b04_shape(() => G.rect(X(B04S.axis - 0.5), Y(-0.29), 1.0 * s, 0.06 * s), '#8C8C90', null, 0, a);                            /* its pixel array */
  b04_shape(() => rrPath(X(B04S.led - 0.38), Y(0.05), 0.76 * s, 0.3 * s, 2), '#3A3B40', null, 0, a);                           /* the LED */
  b04_shape(() => G.ellipse(X(B04S.led), Y(-0.25), 0.3 * s, 0.08 * s, 0, 0, TAU), '#D8D8DC', null, 0, a);
}
/** the snap-on lens in section: the two blocks, the boss, the domes, and a clip at each end through the board */
function b04_lensSec(X, Y, s, a) {
  const cf = B04M.clear(), ce = B04M.clearE(), box = (z0, z1, y0, y1, r) => b04_shape(() => rrPath(X(z0), Y(y1), X(z1) - X(z0), Y(y0) - Y(y1), r), cf, ce, 1.5, a);
  for (const sg of [1, -1]) {
    const zc = sg * 6.0;
    box(zc - 0.95, zc + 0.95, B04S.up, -1.1, 0.12 * s);                                                                       /* the arm */
    box(zc - 0.82, zc + 0.82, -1.1, 0.1, 0.06 * s);                                                                           /* the peg, up through the board */
    b04_shape(() => { G.moveTo(X(zc - 0.82), Y(0.1)); G.lineTo(X(zc - 1.02), Y(0.18)); G.lineTo(X(zc - 0.62), Y(0.72)); G.lineTo(X(zc + 0.62), Y(0.72)); G.lineTo(X(zc + 1.02), Y(0.18)); G.lineTo(X(zc + 0.82), Y(0.1)); G.closePath(); }, cf, ce, 1.5, a);   /* the split snap head */
    line(X(zc), Y(0.7), X(zc), Y(-0.3), { color: ce, w: 1.6, alpha: a });                                                     /* its split */
  }
  box(-4.8, 4.8, B04S.up, -1.0, 0.4 * s);                                                                                     /* the upper block */
  box(-3.3, 3.9, B04S.lo, B04S.up, 0.18 * s);                                                                                 /* the lower block */
  box(-1.12, 1.12, -1.0, -0.1, 0.1 * s);                                                                                      /* the boss */
  const dome = (zc, collar, bulge) => b04_shape(() => { G.moveTo(X(zc - collar), Y(B04S.lo)); G.lineTo(X(zc - collar), Y(B04S.col)); G.quadraticCurveTo(X(zc), Y(B04S.col - bulge * 2), X(zc + collar), Y(B04S.col)); G.lineTo(X(zc + collar), Y(B04S.lo)); G.closePath(); }, cf, ce, 1.5, a);
  dome(B04S.axis, 1.42, 0.43); dome(B04S.led, 1.0, 0.3);
  line(X(-4.4), Y(-1.12), X(4.4), Y(-1.12), { color: 'rgba(255,255,255,' + (TH ? 0.9 : 0.35) + ')', w: 2, alpha: a });           /* a moulded highlight: clear plastic */
}
/** the whole stack over the pad. (ox, oy) is the module's centre on the board's top face; s px per mm. o = { z0, z1 (mm,
   the span drawn), gap (lens to cloth, mm, 2.4), off (mm the pad has slid), alpha, pad (false: no pad), padA }.
   Returns anchor points for callouts and rays */
function b04_section(ox, oy, s, o = {}) {
  const a = o.alpha == null ? 1 : o.alpha, X = z => ox + z * s, Y = y => oy - y * s, gap = o.gap == null ? B04.Z : o.gap, yP = B04S.ref - gap;
  const z0 = o.z0 == null ? -8.4 : o.z0, z1 = o.z1 == null ? 8.4 : o.z1;
  if (a > 0.003) {
    if (o.pad !== false) b04_padSec(X(z0), X(z1), Y(yP), s, o.off || 0, a * (o.padA == null ? 1 : o.padA), { foam: o.foam == null ? 1.6 : o.foam });
    b04_boardSec(X, Y, z0, z1, a);
    b04_moduleSec(X, Y, s, a);
    b04_lensSec(X, Y, s, a);
  }
  return { X, Y, yP, led: [X(B04S.led), Y(-0.25)], ll: [X(B04S.led), Y(B04S.col - 0.6)], il: [X(B04S.axis), Y(B04S.ref)], die: [X(B04S.axis), Y(-0.29)], spot: [X(B04S.axis), Y(yP)],
    mod: [X(3.6), Y(0.67)], board: [X(z1 - 0.4), Y(-0.5)], clip: [X(6.0), Y(-1.55)], pad: [X(z0 + 1.0), Y(yP) + 0.6 * s] };
}

/* ---------- the pad model: what a press does to the lens (b04_sag) ----------
   From work/b04/model (sag_final.py, sag_profiles.py; the source b04_model says how): a rigid mouse on its skates, pressed
   into a soft cloth pad (a Pasternak foundation: 4 mm of foam, the cloth dragged down within about 2 mm of each skate),
   set so one dot a corner sinks the full 0.65 mm under a firm 10 N (Brock's report, #10), then pressed with the hand's
   weight, 5 N, on the hump (z −20). Solved on a 0.5 mm grid, at KEY_PARTS's places (lens 16.57, axis 17.67, lens dots
   22.87 and 9.87, the shell's eight corner dots). For each skate set: c0 + c2·z, the mouse's sink (mm) along its length;
   gap, the lens's drop toward the cloth under it (mm); area of skate (mm²); cl, the cloth's sink seen from the side (the
   deepest across the mouse at each mm of z from −62 to 62, µm). sweep: skates at the ends growing from the eight corner
   dots (k 0) toward V4 Pro-size pads (k 1), with the size that holds the lens as well as Theseus's two lens dots
   (k 0.259, 706 mm²). gPOM: grams per mm² of the 0.65 mm stack with a POM glide layer. Linear: a lighter press scales
   every sink by its share of 5 N. */
const B04SP = {"corners":{"c0":0.17451,"c2":-0.001684,"gap":0.1448,"area":265.8,"cl":[1,1,2,3,5,8,14,25,44,78,142,262,260,258,257,255,254,252,251,249,247,246,244,136,76,43,24,14,8,5,3,2,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,2,3,5,8,15,26,46,83,110,108,106,105,103,101,99,97,95,94,92,64,35,19,11,6,4,2,1,1,0,0,0]},"theseus":{"c0":0.14432,"c2":-0.001915,"gap":0.0753,"area":332.2,"cl":[1,1,1,3,4,8,13,23,40,72,132,243,241,239,238,236,234,232,230,229,227,225,223,124,69,39,22,13,7,4,2,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,3,4,8,13,24,42,75,131,129,127,125,124,122,119,66,40,29,29,39,63,106,104,102,101,99,97,95,50,27,15,9,5,3,2,3,5,9,17,30,53,70,68,66,64,62,60,58,56,54,52,50,35,19,10,6,3,2,1,1,0,0,0,0]},"sweep":[{"c0":0.17451,"c2":-0.001684,"gap":0.1448,"area":265.8,"cl":[1,1,2,3,5,8,14,25,44,78,142,262,260,258,257,255,254,252,251,249,247,246,244,136,76,43,24,14,8,5,3,2,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,2,3,5,8,15,26,46,83,110,108,106,105,103,101,99,97,95,94,92,64,35,19,11,6,4,2,1,1,0,0,0],"k":0},{"c0":0.10477,"c2":-0.001086,"gap":0.0856,"area":568.5,"cl":[1,1,2,3,6,10,16,28,48,83,161,161,160,159,158,157,156,155,154,153,152,151,149,83,47,26,15,9,5,3,2,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,2,3,5,8,15,27,48,63,62,61,60,59,57,56,55,54,53,52,36,20,11,7,4,2,1,1,1,0,0,0],"k":0.125},{"c0":0.09431,"c2":-0.001009,"gap":0.0765,"area":691.2,"cl":[1,1,2,3,5,9,15,26,44,76,147,146,146,145,144,143,142,141,140,139,138,137,136,76,43,25,14,8,5,3,2,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,2,4,6,10,16,26,43,55,55,54,53,52,51,50,49,48,47,46,45,31,17,10,6,3,2,1,1,0,0,0,0],"k":0.25},{"c0":0.09364,"c2":-0.001021,"gap":0.0756,"area":706.0,"cl":[1,1,2,3,5,9,15,26,44,76,147,146,145,145,144,142,142,141,140,139,138,137,136,76,43,25,14,8,5,3,2,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,2,3,4,7,12,20,33,55,54,54,53,52,51,50,49,48,47,46,45,44,31,17,9,6,3,2,1,1,0,0,0,0],"k":0.2593},{"c0":0.08295,"c2":-0.00093,"gap":0.0665,"area":860.0,"cl":[1,1,2,3,5,8,14,23,40,68,131,131,130,129,128,127,127,126,125,124,123,122,121,120,73,44,27,16,10,6,4,2,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,2,3,5,9,14,23,38,49,48,47,47,46,45,44,43,42,41,40,39,38,37,26,14,8,5,3,2,1,1,0,0,0,0],"k":0.375},{"c0":0.07479,"c2":-0.000877,"gap":0.0593,"area":1014.5,"cl":[1,1,2,3,5,8,13,22,37,63,120,120,119,118,117,117,116,115,114,113,112,111,111,110,109,84,51,31,19,11,7,4,3,2,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,2,3,5,8,13,21,35,45,44,43,42,41,41,40,39,38,37,36,35,34,33,32,32,22,12,7,4,2,1,1,1,0,0,0,0],"k":0.5},{"c0":0.05747,"c2":-0.000735,"gap":0.0444,"area":1442.8,"cl":[0,1,1,2,4,6,10,17,29,50,96,95,94,94,93,92,92,91,90,89,89,88,87,86,86,85,84,83,83,50,30,18,11,7,4,3,2,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,2,4,6,10,17,27,35,34,33,33,32,31,31,30,29,28,28,27,26,25,25,24,23,22,22,21,15,8,5,3,2,1,1,0,0,0,0,0],"k":0.75},{"c0":0.04311,"c2":-0.000606,"gap":0.0321,"area":2011.2,"cl":[0,1,1,2,3,5,8,14,23,39,75,74,73,73,72,72,71,70,70,69,69,68,67,67,66,66,65,64,64,63,63,62,48,29,18,11,7,4,2,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,2,3,5,8,13,21,27,26,26,25,24,24,23,23,22,21,21,20,19,19,18,18,17,16,16,15,15,14,13,13,9,5,3,2,1,1,0,0,0,0,0,0],"k":1.0}],"gPOM":0.0006940000000000001,"match":0.2593};
/** the cloth's sink (mm) at z for one solved set */
function b04_spCl(p, z) { const i = z + 62; if (i <= 0 || i >= 124) return 0; const i0 = Math.floor(i), f = i - i0; return (p.cl[i0] * (1 - f) + p.cl[i0 + 1] * f) / 1000; }
/** a solved set by name ('corners', 'theseus') as { c0, c2, gap, area, cl(z) } */
function b04_spSet(n) { const p = B04SP[n]; return { c0: p.c0, c2: p.c2, gap: p.gap, area: p.area, cl: z => b04_spCl(p, z) }; }
/** the end skates' sweep at skate area A (mm²), interpolated between solved sizes; k is the sweep's size parameter */
function b04_spSweep(A) {
  const S = B04SP.sweep; A = clamp(A, S[0].area, S[S.length - 1].area);
  let i = 1; while (i < S.length - 1 && A > S[i].area) i++;
  const a = S[i - 1], b = S[i], u = (A - a.area) / (b.area - a.area);
  return { c0: lerp(a.c0, b.c0, u), c2: lerp(a.c2, b.c2, u), gap: lerp(a.gap, b.gap, u), area: A, k: lerp(a.k, b.k, u), cl: z => lerp(b04_spCl(a, z), b04_spCl(b, z), u) };
}
/** the growing end skates at sweep size k, seen from the side and from below (mm): the front pad (a rounded rectangle
   ending 50 mm forward) and the rear half-moon (ending 52 mm back); below k 0.125 they grow in from nothing */
function b04_padsAt(k) {
  const g = clamp(k / 0.125), kk = Math.max(k, 0.125);
  const fw = (14 + 33.6 * kk) * g, fh = (8 + 15.8 * kk) * g, rw = (14 + 38 * kk) * g, rh = (8 + 13.5 * kk) * g;
  return { front: { z0: 50 - fh, z1: 50, w: fw }, rear: { z0: -52, z1: -52 + rh, w: rw } };
}
const b04_gOf = A => A * B04SP.gPOM;                                                    /* grams of skate, POM stack */

/* ============================== 1. The chapter card ==============================
   Replaces `glide` (7/10, no note). The kit's chapter card: the compromise (LEDGER: "Skates and sensors that cost your
   aim"), struck as the answer lands ("Aim that goes where you put it"); this chapter's slides in film order; the ledger
   strip. On the right, the chapter in one picture: the sensor in section over the cloth; the lens drifts 0.3 mm toward the
   pad (red, out of its window) while the compromise stands, and is held back at 2.40 mm (blue) as the answer lands. */
S({
  id: 'b04_card', ch: 'glide', card: true, first: true, theme: 'night', title: 'Glide and tracking', settle: 5.5,
  replaces: ['glide'],
  answers: [
    ['glide (7/10, no note)', 'Rebuilt in the kit\'s chapter-card family: the compromise most mice make here, struck as Theseus\'s answer lands in blue; the ledger strip; the chapter\'s seven slides in film order with Brock\'s idea numbers; on the right the sensor in section over the cloth, its lens drifting out of its 0.2 mm window and held back in it as the answer lands.'],
    ['F35.1: palette', 'Red only for the lens out of its window; blue for Theseus; everything else neutral.']
  ],
  draw: t => chapterCard2(t, {
    ch: 'glide', turn: 2.1,
    list: [['', 'Your sensor is a camera'], [11, 'A focus window of 0.2 mm'], [10, 'Dots at the lens'], [[10, 8, 52], 'Skates where they count'], [37, 'A snap-on lens, one dot wide'], [76, 'The PAW3970: the plan'], ['16-bit', 'Every frame as it comes']],
    part: (t, box, kt) => {
      const s = 34, cx = box[0] + box[2] / 2 + 40, yPad = box[1] + box[3] - 70, drift = 0.3 * ep(t, 0.6, 1.6, E.io3) * (1 - kt), Z = 2.4 - drift;
      clipped(box[0], box[1], box[2], box[3], () => {
        b04_padSec(box[0] + 40, box[0] + box[2] - 40, yPad, s, 0, 1, { foam: 1.6, cells: true });
        b04_section(cx, yPad - (2.63 + Z) * s, s, { pad: false, z0: -9.5, z1: 9.5 });
        /* the window, ±0.1 mm round 2.40 over the cloth, and the lens's lowest point against it */
        const ax = cx + B04S.axis * s, yW = yPad - 2.4 * s, hw = 0.1 * s, yL = yPad - Z * s, out = drift > 0.1, col = out ? C.red : kt > 0.5 ? C.hero : C.ink;
        rect(ax - 60, yW - hw, 120, hw * 2, { fill: inkA(0.14) });
        for (const yy of [yW - hw, yW + hw]) line(ax - 60, yy, ax + 60, yy, { color: C.ink2, w: 1.5, dash: [5, 4] });
        line(ax - 40, yL, ax + 40, yL, { color: col, w: 3.5 });
        rich([{ s: fmtN(Z, 2), role: 'd1', size: 44, weight: 800, color: out ? C.red : kt > 0.5 ? C.heroText : C.ink, tnum: true }, { s: 'mm', font: 'sans', size: 22, weight: 700, color: C.mute, gap: 6 }], box[0] + 40, box[1] + 96);
        text('Lens to pad', box[0] + 40, box[1] + 44, { role: 'label', size: 22, color: C.mute });
        text(out ? 'Out of its 0.2 mm window' : 'In its 0.2 mm window', box[0] + 40, box[1] + 134, { role: 'label', size: 22, color: out ? C.red : kt > 0.5 ? C.heroText : C.mute });
      });
    }
  })
});

/* ============================== 2. Your sensor is a camera ==============================
   Camera, correlation and defocus in one slide (Brock on gld_camera, gld_corr and gld_blur: "combine them"). The whole
   mouse from the side, the lens lit; the camera pushes in to the sensor in section, to scale; the LED lights a spot and the
   lens images it 1:1 onto the chip; the mouse moves and the chip takes pictures; two pictures are slid over each other
   until they line up, and the shift is the count. Then the pointer drags the lens 0.4 mm too far and 0.4 mm too close: the
   picture blurs (a phone held too close does the same) and the same move reads a different count (the picture's scale
   is 2.4 / Z). Theme paper. */
/* vel: the pad's speed under the lens (mm/s), set so one picture to the next is exactly 5 counts at 1,600 CPI in focus
   (5 × 25.4 / 1,600 = 0.079 mm a picture, every 0.45 s: slowed for the eye) */
const B04C = { vel: 5 * 25.4 / 1600 / 0.45, t0: 1.9, u0: 1.30, v0: 2.05, cap: 0.45, cpi: 1600 };
/** the shift (px) an exact match finds between two pictures at lens height z: the pad's move, imaged at 2.4 / z, in
   30 µm pixels. The readouts use this; the drawn search uses the frames' own match, which lands within a tenth of a pixel */
const b04_shiftAt = z => B04C.vel * B04C.cap * (B04O.v0 / z) / B04O.pix;
/** where the pad is under the lens at slide time t (mm): it slides as the mouse moves, from B04C.t0 */
const b04_padU = t => B04C.u0 + B04C.vel * Math.max(0, t - B04C.t0);
/** the lens height over the slide: dragged too far, too close, and back by the pointer */
const B04ZK = [[0, 2.4], [6.2, 2.4], [6.8, 2.8], [7.3, 2.8], [8.0, 2.0], [8.5, 2.0], [9.1, 2.4]];
const b04_camZ = t => kf(t, B04ZK, E.io3);
S({
  id: 'b04_camera', ch: 'glide', theme: 'paper', title: 'Your sensor is a camera', settle: 12,
  replaces: ['gld_camera', 'gld_corr', 'gld_blur'],
  src: ['b04_pmw3360', 'b04_adns2610', 'b04_paw3395', 'b04_adns3080', 'b04_r3d'],
  answers: [
    ['gld_camera: "execution still feels lazy here for the visualization"', 'It is now a live demonstration in four beats: the whole mouse, a push-in to the sensor in section with the light running through it, the chip\'s pictures taken as the mouse moves, two pictures compared, then the lens dragged out of focus both ways.'],
    ['gld_camera: "the pad looks so realistic it\'s uncanny"', 'The pad is drawn, not rendered: a flat two-grey plain weave with crisp edges, a few fibres and specks. The chip\'s frames are that same drawing sampled at 36 × 36 pixels.'],
    ['gld_camera: "it\'s weird it\'s not drawn like everything else"', 'The weave, the cloth in section and the sensor are drawn in the deck\'s flat line style, on the kit\'s simplified mouse.'],
    ['gld_camera: "this slide could probably be combined with something else, like the next slide"', 'Combined: the camera, the frame correlation (gld_corr) and the defocus (gld_blur) are one slide.'],
    ['gld_corr: "cool slide"', 'Its idea is kept as the middle beat: the second picture slides over the first until they line up, and the shift becomes the count.'],
    ['gld_corr: "but it should probably be combined with the last slide"', 'Done: it is the second beat of this slide.'],
    ['gld_blur: "probably could be combined with the last 2 slides"', 'Done: the third beat. The pointer drags the lens 0.4 mm too far, then 0.4 mm too close; the picture blurs both ways and the count changes with it.'],
    ['F2.03: "show how the sensor works, and how it is just a camera"', 'An LED, a 1:1 lens and an image chip, to scale, taking pictures of the pad; the chip\'s own pixels shown.'],
    ['F2.03: "show how the lens unfocuses just like a smartphone camera if it gets too close to a surface or too far away, i need a blurriness visualization"', 'Both directions, live: the chip\'s picture blurs as the lens goes 0.4 mm too far and too close, beside a phone held too close to a page blurring the same way; the detail left is read out.'],
    ['F9.14: "the sensor and snap on lens are both not as accurate as id like"', 'Drawn to the 3D board\'s dimensions: the 8.4 × 9.8 mm castellated module, 16 half-holes at 1.2 mm, the snap-on lens 5.2 mm wide with its clips through the board, the imaging and light lenses where the 3D has them.'],
    ['F14.4: "the image you used for the mousepad ... feels really low quality and uncanny"', 'Replaced by the drawn weave, crisp at any size.']
  ],
  draw: t => {
    header(t, 'Your sensor is a camera');
    captions(t, [[0.5, 'An optical sensor is a camera. An LED lights the pad, a lens images one millimetre of it, and the chip takes thousands of pictures a second.'],
      [3.7, 'Nothing in it measures motion. It slides each picture over the last until they line up: that shift is how far you moved.'],
      [6.0, 'Drag the lens too far or too close and the picture blurs, as a phone\'s camera does at the wrong distance. The count changes with it.'],
      [9.2, 'Every count rests on a sharp picture. Built anywhere in PixArt\'s 0.4 mm, a lens can keep ' + Math.round(b04_detail(2.2) * 100) + ' % of the detail; held to the middle 0.2 mm, at least ' + Math.round(b04_detail(2.3) * 100) + ' %.']]);
    const lz = b04_lensZ(), z = b04_camZ(t), dz = z - B04.Z, u = b04_padU(t), top = B04S.top;
    /* ---- left: the whole mouse, then the sensor in section (the camera pushes in once) ---- */
    const box = [LM, 280, 920, 660], sx = lz;
    demoWindow(box[0], box[1], box[2], box[3], 1, { plain: true });                      /* frame one already shows the mouse */
    const est = establish(t, 0.05, box, { view: 'right', hi: [], col: 'ink', focus: [sx - 8.2, -9.2, 16.4, 10.6], hold: 0.5, dur: 1.15, locator: 'tl', fade: 0.22, mouse: { hide: ['skates'], show: ['board'], lineA: 1 } });
    const s = est.s, Pd = est.P, kd = est.kd, padY = Pd(0, 0)[1], o = Pd(sx, -(top + dz)), P = b04_section(o[0], o[1], s, { pad: false, alpha: 0 });
    clipped(box[0], box[1], box[2], box[3], () => {
      /* the pad under the whole mouse; it slides as the mouse moves (the cloth stays put when the lens is dragged) */
      b04_padSec(box[0] - 20, box[0] + box[2] + 20, padY, s, -(u - B04C.u0), 1, { foam: 2.6, cells: s > 20 });
      const ksec = ep(t, 0.12, 0.55);
      if (ksec > 0.003) b04_section(o[0], o[1], s, { pad: false, alpha: ksec, z0: -8.6, z1: 8.6 });
      /* the light: a soft beam from the light lens onto the spot under the imaging lens; from the spot, two rays through
         the imaging lens cross onto the chip (1:1, the picture upside down) */
      const kl = ep(t, 1.75, 2.25) * kd, sp = [P.il[0], padY], hwS = 0.54 * s;
      if (kl > 0.003) {
        /* drawn as a textbook ray diagram: the LED's light down through the clear lens to the light lens, then aimed at the
           spot; from the spot two rays through the imaging lens, crossing onto the chip */
        const kr = ep(t, 2.05, 2.65) * kd, ray = (pts, k, dash) => { poly(pts, { color: C.ink, w: 1.6, p: k, dash, alpha: kl }); };
        for (const dx of [-0.32, 0.32]) {
          const a0 = [P.led[0] + dx * s, P.led[1] + 0.2 * s], a1 = [P.ll[0] + dx * s * 1.2, P.ll[1] - 0.1 * s], a2 = [sp[0] + (dx > 0 ? hwS : -hwS), sp[1]];
          ray([a0, a1, a2], ep(t, 1.75, 2.35), [6, 5]);
          if (ep(t, 1.75, 2.35) >= 1) { const ang = Math.atan2(a2[1] - a1[1], a2[0] - a1[0]), mx = lerp(a1[0], a2[0], 0.62), my = lerp(a1[1], a2[1], 0.62); arrow(mx - Math.cos(ang) * 10, my - Math.sin(ang) * 10, mx + Math.cos(ang) * 6, my + Math.sin(ang) * 6, { color: C.ink, w: 1.6, hs: 9, alpha: kl }); }
        }
        poly([[sp[0] - hwS, sp[1]], [P.il[0] - 0.9 * s, P.il[1] + 0.06 * s], [P.die[0] + 0.5 * s, P.die[1]]], { color: C.ink, w: 2, p: kr });
        poly([[sp[0] + hwS, sp[1]], [P.il[0] + 0.9 * s, P.il[1] + 0.06 * s], [P.die[0] - 0.5 * s, P.die[1]]], { color: C.ink, w: 2, p: kr });
        rect(sp[0] - hwS, sp[1] - 2.5, hwS * 2, 5, { fill: C.ink, alpha: ep(t, 2.0, 2.3) * kd });
      }
      /* what slides the pad: the mouse moving over it (the pad goes the other way under the lens) */
      { const km = ep(t, 1.9, 2.3) * kd, ax0 = box[0] + box[2] / 2 - 40, ay = box[1] + 44; if (km > 0.003) { arrow(ax0, ay, ax0 + 80, ay, { color: C.ink, w: 2.5, hs: 12, alpha: km }); text('Mouse moving', ax0 + 96, ay + 8, { role: 'label', size: 22, color: C.mute, alpha: km }); } }
      /* the height, read out beside the lens */
      if (kd > 0.003) {
        const zx = Pd(sx - 4.7, 0)[0], ka = ep(t, 2.5, 2.9) * kd, inF = Math.abs(dz) <= 0.1 + 1e-6, col = inF ? C.ink : C.red, yRef = P.il[1];
        line(zx, yRef, zx, padY, { color: col, w: 2, alpha: ka }); for (const yy of [yRef, padY]) line(zx - 9, yy, zx + 9, yy, { color: col, w: 2, alpha: ka });
        line(zx + 9, yRef, P.il[0] - 1.5 * s, yRef, { color: inkA(0.3), w: 1.2, dash: [4, 4], alpha: ka });
        rich([{ s: fmtN(z, 1), role: 'd1', size: 50, weight: 800, color: col, tnum: true }, { s: 'mm', font: 'sans', size: 22, weight: 700, color: C.mute, gap: 6 }], zx - 18, (yRef + padY) / 2 + 26, { align: 'right', alpha: ka });
        text(inF ? 'Lens to pad' : dz > 0 ? 'Too far' : 'Too close', zx - 18, (yRef + padY) / 2 - 26, { role: 'label', size: 22, color: inF ? C.mute : C.red, align: 'right', alpha: ka });
      }
      /* the pointer drags the lens up and down by the board */
      if (t > 5.7) {
        const grab = [P.X(7.6), P.Y(-0.5)], drag = t > 6.2 && t < 9.1;
        cursorAt(t, [[5.7, [grab[0] + 70, grab[1] - 70]], [6.15, grab], [11.5, grab]], [6.2], { grab: drag, a: ep(t, 5.7, 6.0) * (1 - ep(t, 9.3, 9.7)) });
      }
      /* the parts, named, the labels clear of the light */
      const kn = kd;
      if (kn > 0.5) {
        callout(t, 2.0, [P.led[0], P.led[1] - 2], 'LED, 850 nm', { to: [box[0] + 250, box[1] + 128], side: 'l', color: C.ink2, tcolor: C.ink });
        callout(t, 2.2, [P.die[0] + 0.3 * s, P.die[1] - 4], 'Image chip', { to: [box[0] + box[2] - 230, box[1] + 128], side: 'r', color: C.ink2, tcolor: C.ink });
        callout(t, 2.5, [P.il[0] + 1.25 * s, P.il[1] - 0.15 * s], 'Lens, 1:1', { to: [box[0] + box[2] - 190, P.il[1] - 0.6 * s], side: 'r', color: C.ink2, tcolor: C.ink });
        text('Cloth over foam', box[0] + box[2] - 32, padY + 1.55 * s + 8, { role: 'label', size: 22, color: TH ? '#FFFFFF' : C.ink2, align: 'right', alpha: ep(t, 2.7, 3.1) });
      }
    });
    /* ---- right, top: what the chip sees: one millimetre of cloth, then the same as 36 × 36 pixels ---- */
    const rx = 1040, rw = RM - rx, vy = 280, kv = tileA(t, 2.3, 0), zq = Math.round(z / 0.02) * 0.02, op = b04_optics(z);
    demoWindow(rx, vy, rw, 320, kv);
    cardHead(t, 2.4, rx, vy, rw, 'What the chip sees', []);
    const vx = rx + 32, vyy = vy + 72, vsz = 216, fieldMM = B04O.n * B04O.pix / op.m, kpx = ep(t, 3.0, 3.6), capI = 1 + Math.floor(Math.max(0, t - B04C.t0) / B04C.cap), uF = B04C.u0 + B04C.vel * B04C.cap * (capI - 1), F = b04_frame(uF, B04C.v0, zq, capI), sharp0 = b04_sharp(b04_frame(uF, B04C.v0, B04.Z, capI));
    if (kv > 0.003) {
      const cv = b04_clothCv('cam', vsz, vsz, vsz / fieldMM, u - fieldMM / 2, B04C.v0 - fieldMM / 2);
      b04_blit(cv, vx, vyy, vsz, vsz, op.rmm * vsz / fieldMM, kv * (1 - kpx), { r: 4 });
      b04_blit(b04_frameCv(F), vx, vyy, vsz, vsz, 0, kv * kpx, { px: true, r: 4 });
      if (kpx > 0.003 && kpx < 0.999) { G.save(); G.globalAlpha = kv * Math.sin(kpx * Math.PI) * 0.5; G.strokeStyle = TH ? '#FFFFFF' : '#000000'; G.lineWidth = 1; for (let i = 1; i < B04O.n; i++) { const q = vx + i * vsz / B04O.n; G.beginPath(); G.moveTo(q, vyy); G.lineTo(q, vyy + vsz); G.stroke(); const r2 = vyy + i * vsz / B04O.n; G.beginPath(); G.moveTo(vx, r2); G.lineTo(vx + vsz, r2); G.stroke(); } G.restore(); }
      if (t > B04C.t0 + 0.4) { const ph = ((t - B04C.t0) % B04C.cap) / B04C.cap; if (ph < 0.35) { const yy = vyy + vsz * E.out3(ph / 0.35); line(vx, yy, vx + vsz, yy, { color: 'rgba(255,255,255,0.6)', w: 2, alpha: kv }); } }
      /* beside it: what it is, then (once the lens is dragged) the detail it keeps and a phone doing the same */
      const tx = vx + vsz + 40, kt1 = ep(t, 2.6, 3.0), kt2 = ep(t, 3.1, 3.5), kb = ep(t, 6.0, 6.5), kb2 = 1 - kb, kv9 = ep(t, 9.1, 9.4);
      text('About 1 mm of cloth', tx, vyy + 22, { role: 'label', size: 22, color: C.mute, alpha: kt1 });
      text(kpx < 0.5 ? 'As the lens sees it' : '36 × 36 pixels', tx, vyy + 56, { role: 'small', size: 25, weight: 600, color: C.ink2, alpha: kt1, maxW: 230 });
      if (kb2 > 0.003) {
        rich([{ s: '12,000', role: 'd1', size: 72, weight: 800, color: C.ink, tnum: true, count: [3.2, 1.0] }], tx - 4, vyy + 160, { t, alpha: kt2 * kb2 });
        text('Pictures a second in a PMW3360', tx, vyy + 196, { role: 'small', size: 25, weight: 600, color: C.ink2, alpha: kt2 * kb2, maxW: RM - 32 - tx });
        pill(tx, vyy + 230, 'datasheet', kt2 * kb2, { by: 'PMW3360' });
      }
      if (kb > 0.003) {
        const det = Math.round(b04_sharp(F) / sharp0 * 100), inF = Math.abs(dz) <= 0.1 + 1e-6;
        text('Detail kept', tx, vyy + 100, { role: 'label', size: 22, color: C.mute, alpha: kb * (1 - kv9) });
        rich([{ s: String(Math.min(100, det)), role: 'd1', size: 64, weight: 800, color: inF ? C.ink : C.red, tnum: true }, { s: '%', font: 'disp', size: 34, weight: 800, color: inF ? C.ink : C.red, gap: 10 }], tx - 3, vyy + 166, { alpha: kb * (1 - kv9) });
        /* the phone: its camera too close to a page, its screen the same cloth, blurred as much */
        const phx = RM - 40 - 96, phy = vyy - 8, phw = 96, phh = 168;
        b04_phone(phx, phy, phw, phh, op.rmm / fieldMM * (phw - 12) * 1.6, kb * (1 - kv9), u);
        text('A phone', phx + phw / 2, phy + phh + 28, { role: 'label', size: 22, color: C.mute, align: 'center', alpha: kb * (1 - kv9) });
        text(inF ? 'in focus' : dz > 0 ? 'too far' : 'too close', phx + phw / 2, phy + phh + 54, { role: 'label', size: 22, color: inF ? C.mute : C.red, align: 'center', alpha: kb * (1 - kv9) });
        /* the payoff: the worst picture a lens can take inside each window, PixArt's whole 0.4 mm against Theseus's 0.2 mm
           (the same frames, three spots of the cloth) */
        if (t > 9.1) verdict(t, 9.2, tx, vyy + 176, { from: Math.round(b04_detail(2.2) * 100), to: Math.round(b04_detail(2.3) * 100), unit: '%', dec: 0, label: 'Worst detail kept', better: 'higher', who: ['0.4 mm', 'Theseus'], size: 64, net: false });
      }
    }
    /* ---- right, bottom: two pictures in a row, slid over each other until they line up; the shift is the count ---- */
    const cy = 640, ch = 300, kc = tileA(t, 3.6, 0);
    demoWindow(rx, cy, rw, ch, kc);
    if (kc > 0.003) {
      const capN = Math.min(8, Math.max(1, Math.floor(Math.max(0, t - B04C.t0) / B04C.cap))), uA = B04C.u0 + B04C.vel * B04C.cap * (capN - 1), uB = uA + B04C.vel * B04C.cap;
      const A = b04_frame(uA, B04C.v0, zq, 101), B = b04_frame(uB, B04C.v0 + 0.004, zq, 102), m = b04_match(A, B, B04O.n, 5);
      const fs = 168, fy = cy + 80, ax = rx + 32, bx = ax + fs + 24, n = B04O.n, sc = fs / n;
      cardHead(t, 3.7, rx, cy, rw, 'Two pictures in a row', []);
      b04_blit(b04_frameCv(A), ax, fy, fs, fs, 0, kc, { px: true, r: 3 });
      b04_blit(b04_frameCv(B), bx, fy, fs, fs, 0, kc, { px: true, r: 3 });
      text('Picture n', ax, fy + fs + 30, { role: 'label', size: 22, color: C.mute, alpha: kc });
      text('n + 1', bx, fy + fs + 30, { role: 'label', size: 22, color: C.mute, alpha: kc });
      /* the search: n + 1's ghost slides over n, trying shifts, and settles where they match best */
      const ks = ep(t, 4.3, 5.4, E.cam), best = m.sub, path = [[0, 0], [-4, 3], [3, -2], [-1, 4], best];
      const seg = ks * (path.length - 1), i0 = Math.min(path.length - 2, Math.floor(seg)), f0 = seg - i0, cur = ks >= 1 ? best : [lerp(path[i0][0], path[i0 + 1][0], E.io3(f0)), lerp(path[i0][1], path[i0 + 1][1], E.io3(f0))];
      const kgh = ep(t, 4.1, 4.4) * kc;
      if (kgh > 0.003) {
        G.save(); rrPath(ax, fy, fs, fs, 3); G.clip();
        b04_blit(b04_frameCv(B), ax - cur[0] * sc, fy - cur[1] * sc, fs, fs, 0, kgh * 0.55, { px: true });
        G.restore();
        const D = 2 * m.S + 1, ci = clamp(Math.round(cur[0]) + m.S, 0, D - 1), cj = clamp(Math.round(cur[1]) + m.S, 0, D - 1), dv = ks >= 1 ? m.min : m.map[cj * D + ci], good = ks >= 1;
        const mx = bx + fs + 36, mw = rx + rw - 32 - mx;
        text('Difference', mx, fy + 14, { role: 'label', size: 22, color: C.mute, alpha: kgh });
        rr(mx, fy + 30, mw, 12, 6, C.track, null, 0, kgh);
        rr(mx, fy + 30, Math.max(12, mw * clamp(dv / (m.avg * 1.6))), 12, 6, good ? C.ink : C.comp, null, 0, kgh);
        /* the count: the chip turns pixels into counts at its own fixed scale, so a lens at the wrong height miscounts */
        const kfd = ep(t, 5.3, 5.6) * kc, cpx = 25.4 / B04C.cpi / B04O.pix, shN = b04_shiftAt(zq), cnt = shN / cpx, cnt0 = b04_shiftAt(B04.Z) / cpx, off = Math.abs(dz) > 0.1;
        rich([{ s: 'Shift', role: 'label', size: 22, color: C.mute }, { s: fmtN(shN, 1) + ' px', font: 'disp', size: 36, weight: 800, color: C.ink, gap: 12, tnum: true }], mx, fy + 92, { alpha: kfd });
        if (!off || kfd < 1) rich([{ s: fmtN(cnt, 1), font: 'disp', size: 52, weight: 800, color: C.ink, tnum: true }, { s: 'counts', role: 'small', size: 24, weight: 600, color: C.mute, gap: 10 }], mx, fy + 156, { alpha: kfd * (off ? 0 : 1) });
        if (off) {
          /* the same move, counted short or long, against the in-focus count (F16.1) */
          const net = Math.round((cnt / cnt0 - 1) * 100);
          rich([{ s: fmtN(cnt, 1), font: 'disp', size: 52, weight: 800, color: C.red, tnum: true }, { s: 'counts, not ' + fmtN(cnt0, 1), role: 'small', size: 24, weight: 600, color: C.mute, gap: 10, sentence: false }], mx, fy + 156, { alpha: kfd });
          text((net > 0 ? '+' : '−') + Math.abs(net) + ' % for the same move', mx, fy + 192, { role: 'small', size: 24, weight: 700, color: C.red, alpha: kfd });
        } else {
          const km = ep(t, 9.2, 9.7), pc = zz => { const v = Math.round((b04_shiftAt(zz) / b04_shiftAt(B04.Z) - 1) * 100); return (v > 0 ? '+' : '−') + Math.abs(v) + ' %'; };
          if (km > 0.003) { text('At 2.8 mm ' + pc(2.8), mx, fy + 184, { role: 'small', size: 24, weight: 700, color: C.red, alpha: km * kfd }); text('At 2.0 mm ' + pc(2.0), mx, fy + 214, { role: 'small', size: 24, weight: 700, color: C.red, alpha: km * kfd }); }
          else text('At 1,600 CPI', mx, fy + 192, { role: 'label', size: 22, color: C.faint, alpha: kfd });
        }
      }
    }
    source(t, 'PixArt PMW3360: up to 12,000 frames a second, 36 × 36 pixels, a 1:1 lens 2.4 mm over the pad; PAW3395: an 850 nm LED. ADNS-2610: "sequential surface images (frames)". Derived, a thin lens at 1:1: blur one pixel at the datasheets\' ±0.2 mm depth of field; detail kept, the fine contrast left; counts at the chip\'s fixed scale. Slowed for the eye.', { t0: 2.0, maxW: RM - LM });
  }
});

/* ============================== 3. A focus window of 0.2 mm, not 0.4 ==============================
   Brock (F2.02): "the sensors window to focus is actually only 0.2mm optimally but you should talk about how most
   manufacturers only optimize for 0.4mm which can lead to issues". PixArt's datasheets allow the lens anywhere from 2.2 to
   2.6 mm over the pad (PAW3395, PMW3360). The issues, shown on one lens: the chip's scale goes as 2.4 / Z (a 1:1 thin lens;
   ADNS-3080's "Mean Resolution vs. Z"), so the same flick lands 9 % long at 2.2 mm and 8 % short at 2.6 mm, and the
   picture loses detail; built to the middle 0.2 mm, the same flick lands within 4 % and the picture keeps more. Lift-off,
   set from the lens's nominal height (PMW3360), moves with it. The pointer sets the lens's height on the ruler; a hand
   makes the same flick each time. Theme night. */
const B04FO = {
  keys: [[0, 2.4], [1.1, 2.4], [1.5, 2.2], [2.2, 2.2], [2.65, 2.6], [4.0, 2.6], [4.4, 2.3], [5.1, 2.3], [5.55, 2.5], [8.4, 2.5], [9.0, 2.4]],
  drags: [[1.1, 1.5], [2.2, 2.65], [4.0, 4.4], [5.1, 5.55], [8.4, 9.0]],
  flicks: [[0.5, 2.4, 0], [1.6, 2.2, 0], [2.8, 2.6, 0], [4.5, 2.3, 1], [5.7, 2.5, 1]], fd: 0.5, D: 560
};
const b04_fZ = t => kf(t, B04FO.keys, E.io3);
/** the chip's detail at lens height z against the same spots in focus (three spots of the cloth, cached by 0.02 mm) */
const B04FD = new Map();
function b04_detail(z) {
  const zq = Math.round(z / 0.02) * 0.02, key = zq.toFixed(2); if (B04FD.has(key)) return B04FD.get(key);
  let a = 0, b = 0; for (const [u, v, sd] of [[1.3, 2.05, 3], [2.1, 1.2, 5], [0.6, 3.3, 7]]) { a += b04_sharp(b04_frame(u, v, zq, sd)); b += b04_sharp(b04_frame(u, v, B04.Z, sd)); }
  const r = Math.min(1, a / b); B04FD.set(key, r); return r;
}
S({
  id: 'b04_focus', ch: 'glide', ideas: [11], theme: 'night', title: 'A focus window of 0.2 mm, not 0.4', settle: 10.5,
  replaces: ['focus'],
  src: ['b04_paw3395', 'b04_pmw3360', 'b04_adns3080', 'b04_adns2610', 'b04_brock', 'b04_zowie'],
  answers: [
    ['F2.02: "the sensors window to focus is actually only 0.2mm optimally"', 'The ruler shows both windows on one scale: PixArt\'s 2.2 to 2.6 mm (yellow) and Theseus\'s 2.3 to 2.5 mm (blue); the chip\'s picture beside it keeps 65 % of its detail at 2.2 mm against 82 % at 2.3 mm.'],
    ['F2.02: "but you should talk about how most manufacturers only optimize for 0.4mm which can lead to issues"', 'Said in the narration and shown as issues a player feels: the pointer moves one lens to the edges of the 0.4 mm window and the same flick lands 9 % long and 8 % short (a 17 % spread); at the edges of the 0.2 mm window it lands within 4 % (8 %). The picture softens with it, and lift-off, set from the lens\'s height, moves by as much as the lens is off.'],
    ['Brief: "Tie it to the lift-off the player sets (on the software slide)"', 'The closing narration: lift-off is set from the lens\'s nominal height (PMW3360: nominal + 2 mm), so a lens built 0.2 mm off moves every lift-off setting by 0.2 mm.']
  ],
  draw: t => {
    header(t, 'A focus window of 0.2 mm, not 0.4');
    captions(t, [[0.3, 'PixArt\'s datasheets let the lens sit anywhere from 2.2 to 2.6 mm over the pad, and a mouse built to that whole window can land anywhere in it. The chip\'s scale goes with the height.'],
      [3.6, 'Theseus is built to the middle 0.2 mm, 2.3 to 2.5. The same flick lands within 4 %, and the picture keeps more of its detail.'],
      [8.3, 'Lift-off is set from the lens\'s height too: built 0.2 mm off, every lift-off setting is 0.2 mm off.']]);
    const Z = b04_fZ(t), F = B04FO;
    /* ---- left: the lens over the cloth, the chip's picture, and the ruler the pointer sets the height on ---- */
    const bx = LM, by = 280, bw = 860, bh = 660;
    demoWindow(bx, by, bw, bh, 1, { plain: true });
    const s = 30, ox = bx + 360, yPad = by + bh - 170;
    clipped(bx, by, bw, bh, () => {
      b04_padSec(bx - 10, bx + 590, yPad, s, 0, 1, { foam: 6, cells: true });
      b04_section(ox, yPad - (2.63 + Z) * s, s, { pad: false, z0: -6.8, z1: 6.8 });
      /* the lens's height, measured where the picture is taken */
      const ax = ox + B04S.axis * s, yL = yPad - Z * s, out = Z < 2.3 - 1e-6 || Z > 2.5 + 1e-6, col = out ? C.red : C.ink;
      line(ax, yL + 2, ax, yPad - 2, { color: col, w: 2, dash: [5, 4] });
      rich([{ s: fmtN(Z, 2), role: 'd1', size: 44, weight: 800, color: col, tnum: true }, { s: 'mm', font: 'sans', size: 22, weight: 700, color: C.mute, gap: 6 }], bx + 32, yPad - 12);
      text('Lens to pad', bx + 32, yPad - 60, { role: 'label', size: 22, color: C.mute });
      text('Cloth over foam', bx + 560, yPad + 1.5 * s + 8, { role: 'label', size: 22, color: C.ink2, align: 'right' });
    });
    /* the chip's picture at this height, and the detail it keeps */
    { const fx = bx + 32, fy = by + 40, fs = 150, zq = Math.round(Z / 0.02) * 0.02, Fr = b04_frame(1.3, 2.05, zq, 3), det = Math.round(b04_detail(Z) * 100), out = Z < 2.3 - 1e-6 || Z > 2.5 + 1e-6;
      b04_blit(b04_frameCv(Fr), fx, fy, fs, fs, 0, 1, { px: true, r: 4 });
      text('What the chip sees', fx + fs + 24, fy + 22, { role: 'label', size: 22, color: C.mute });
      text('Detail kept', fx + fs + 24, fy + 70, { role: 'label', size: 22, color: C.mute });
      rich([{ s: String(det), role: 'd1', size: 60, weight: 800, color: out ? C.red : C.ink, tnum: true }, { s: '%', font: 'disp', size: 32, weight: 800, color: out ? C.red : C.ink, gap: 10 }], fx + fs + 22, fy + 134); }
    /* the ruler: 2.0 to 2.8 mm, PixArt's window and Theseus's, a handle at the lens's height */
    const rx = bx + 620, yR = z => by + 600 - (z - 2.0) * 560, kB = ep(t, 3.6, 4.0);
    line(rx, yR(2.8), rx, yR(2.0), { color: C.faint, w: 2 });
    for (let v = 2.0; v <= 2.8001; v += 0.1) { const maj = Math.abs(v * 5 - Math.round(v * 5)) < 1e-6; line(rx - (maj ? 12 : 7), yR(v), rx, yR(v), { color: C.faint, w: 1.5 }); }
    rr(rx + 6, yR(2.6), 14, yR(2.2) - yR(2.6), 3, rgba(C.second, 0.85));
    text('PixArt ±0.2', rx + 34, yR(2.6) + 18, { role: 'label', size: 22, color: C.secondText });
    text('2.2–2.6 mm', rx + 34, yR(2.6) + 46, { role: 'small', size: 25, weight: 700, color: C.secondText });
    if (kB > 0.003) { rr(rx + 24, yR(2.5), 14, yR(2.3) - yR(2.5), 3, C.hero, null, 0, kB); text('Theseus ±0.1', rx + 48, yR(2.3) - 34, { role: 'label', size: 22, color: C.heroText, alpha: kB }); text('2.3–2.5 mm', rx + 48, yR(2.3) - 6, { role: 'small', size: 25, weight: 700, color: C.heroText, alpha: kB }); }
    text('Lens height', rx, yR(2.8) - 22, { role: 'label', size: 22, color: C.mute, align: 'center' });
    const hy = yR(Z), hcol = Z < 2.3 - 1e-6 || Z > 2.5 + 1e-6 ? C.red : C.ink;
    line(rx - 24, hy, rx + 6, hy, { color: hcol, w: 3 }); circle(rx - 24, hy, 9, { fill: C.panel, color: hcol, w: 3 });
    { const drag = F.drags.some(([a, b]) => t >= a - 0.05 && t <= b + 0.05), keys = [[0.7, [rx - 70, yR(2.4) + 60]], [1.05, [rx - 24, yR(2.4)]]].concat(F.keys.filter(k => k[0] >= 1.1).map(k => [k[0], [rx - 24, yR(k[1])]])).concat([[9.6, [rx - 80, yR(2.4) + 70]]]);
      cursorAt(t, keys, F.drags.map(d => d[0]), { grab: drag, a: ep(t, 0.7, 1.0) * (1 - ep(t, 9.2, 9.6)) }); }
    /* ---- right: the same flick, made by the same hand, landing where the lens's height sends it ---- */
    const qx = 980, qw = RM - qx;
    demoWindow(qx, by, qw, bh, 1);
    cardHead(t, 0, qx, by, qw, 'The same flick at each height', []);
    const sx0 = qx + 32, sw = qw - 64, rows = [[by + 60, 'Built anywhere in 2.2 to 2.6 mm', C.secondText], [by + 180, 'Built to 2.3 to 2.5 mm', C.heroText]], x0 = sx0 + 60, D = F.D, xt = x0 + D;
    const kR2 = ep(t, 3.6, 4.0);
    rows.forEach(([ry, lab, lc], i) => {
      const a = i === 0 ? 1 : kR2; if (a <= 0.003) return;
      rr(sx0, ry, sw, 110, 10, TH ? '#E9E9EC' : '#0A0A0C', null, 0, a);
      text(lab, sx0 + 18, ry + 30, { role: 'label', size: 22, color: lc, alpha: a });
      line(x0, ry + 66, xt + 90, ry + 66, { color: inkA(0.12), w: 2, alpha: a });
      circle(xt, ry + 66, 20, { color: C.ink2, w: 2.5, alpha: a }); circle(xt, ry + 66, 4, { fill: C.ink2, alpha: a });
    });
    /* the landings so far: red × where a 0.4 mm build sends it, blue ○ where Theseus's does */
    const mark = (j, a) => {
      const [t0, z, row] = F.flicks[j], f = 2.4 / z, x = x0 + D * f, ry = rows[row][0] + 66, pc = Math.round((f - 1) * 100);
      if (Math.abs(f - 1) < 1e-6) { text('On target at 2.4 mm', xt, ry - 30, { role: 'label', size: 22, color: C.ink2, align: 'center', alpha: a }); return; }
      if (row === 0) { const r = 9; line(x - r, ry - r, x + r, ry + r, { color: C.red, w: 3.5, alpha: a }); line(x - r, ry + r, x + r, ry - r, { color: C.red, w: 3.5, alpha: a }); }
      else circle(x, ry, 10, { color: C.hero, w: 3.5, alpha: a });
      text((pc > 0 ? '+' : '−') + Math.abs(pc) + ' %', x + (pc > 0 ? 18 : -18), ry + 34, { role: 'small', size: 24, weight: 800, color: row === 0 ? C.red : C.heroText, align: pc > 0 ? 'left' : 'right', alpha: a });
      text(fmtN(z, 1) + ' mm', x + (pc > 0 ? 18 : -18), ry - 18, { role: 'label', size: 22, color: C.mute, align: pc > 0 ? 'left' : 'right', alpha: a });
    };
    F.flicks.forEach(([t0], j) => { const a = ep(t, t0 + F.fd - 0.05, t0 + F.fd + 0.2); if (a > 0.003 && !(j === 0 && t > F.flicks[1][0])) mark(j, a); });
    /* the crosshair now: it rides the flick, then goes back with the hand for the next one */
    let ci = -1; F.flicks.forEach(([t0], j) => { if (t >= t0) ci = j; });
    const back = j => (j + 1 < F.flicks.length ? ep(t, F.flicks[j + 1][0] - 0.32, F.flicks[j + 1][0] - 0.04) : 0);
    let kf0 = 0, cRow = 0, cf = 1;
    if (ci >= 0) { const [t0, z, row] = F.flicks[ci]; kf0 = ep(t, t0, t0 + F.fd, E.io3) * (1 - back(ci)); cRow = row; cf = 2.4 / z; }
    { const cx = x0 + D * cf * kf0, cy = rows[cRow][0] + 66, a = cRow === 1 ? kR2 : 1;
      line(cx - 16, cy, cx - 5, cy, { color: C.ink, w: 3, alpha: a }); line(cx + 5, cy, cx + 16, cy, { color: C.ink, w: 3, alpha: a }); line(cx, cy - 16, cx, cy - 5, { color: C.ink, w: 3, alpha: a }); line(cx, cy + 5, cx, cy + 16, { color: C.ink, w: 3, alpha: a }); }
    /* the hand: the same 10 cm each time, a finger on the mouse */
    { const hy = by + 362, hx0 = sx0 + 190, H = 300, mx = hx0 + H * kf0, ms = 1.15, moving = ci >= 0 && t < F.flicks[ci][0] + F.fd && t >= F.flicks[ci][0];
      rr(sx0, hy - 4, sw, 8, 4, C.track);
      part(mx, hy - 4, ms, () => mouseSimple('right', { hide: ['skates'], lw: 1.6 }));
      /* the hand's push, on the mouse's back while it moves */
      forceArrow(mx - 60 * ms, hy - 18, 0, 70, { k: moving ? 1 : 0, color: C.ink, w: 3 });
      line(hx0, hy + 22, hx0 + H, hy + 22, { color: C.faint, w: 1.5 }); line(hx0, hy + 14, hx0, hy + 30, { color: C.faint, w: 1.5 }); line(hx0 + H, hy + 14, hx0 + H, hy + 30, { color: C.faint, w: 1.5 });
      text('Your hand: the same 10 cm each time', hx0 + H / 2, hy + 58, { role: 'label', size: 22, color: C.mute, align: 'center' }); }
    /* the verdict: how far apart the same flick lands */
    verdict(t, 6.3, qx + 36, by + 548, { from: (2.4 / 2.2 - 2.4 / 2.6) * 100, to: (2.4 / 2.3 - 2.4 / 2.5) * 100, unit: '%', dec: 0, label: 'Spread in where the same flick lands', better: 'lower', who: ['0.4 mm', 'Theseus'], size: 90 });
    source(t, 'PixArt PAW3395 and PMW3360 datasheets: Z, lens to surface, 2.2 / 2.4 / 2.6 mm; lift detection = nominal height + 2 mm (PMW3360). Avago ADNS-3080: "Mean Resolution vs. Z". Derived, a 1:1 thin lens: counts scale as 2.4 / Z; detail kept as on the camera slide. Brock: "the sensors window to focus is actually only 0.2mm optimally".', { t0: 0.8, maxW: RM - LM });
  }
});

/* ============================== 4. Dots at the lens keep it in focus ==============================
   Brock (F9.20): "the importance of having one or 2 dot skates by the sensor to prevent sag and keeping the sensor focused
   correctly"; on `dots`: "show how this is targeted and more weight efficient compared to how big of skates it takes to
   reduce the sink that aren't placed in the most optimal possible spots (viper v4 style)"; on gld_sag: "could be grouped
   with a comparison to bigger skates and weight efficiency". Above, the whole mouse from the side on a soft pad, to scale:
   where the hand presses and where the skates are. Below, the sensor in section on the cloth, 32 px a mm, its movement
   drawn 4× larger (said on screen; 4× keeps the floor clear of the cloth). The hand's weight presses: with skates only at
   the corners the lens comes down out of its 0.2 mm window. The pointer grows the end skates until the lens holds as well
   as two dots beside it would: 706 mm², 0.31 g more. The wipe: Theseus's two dots on its clip-on lens hold it the same for
   0.05 g. Every number from the pad model (B04SP). Theme paper. */
/* the press: a resting hand's weight, de Leva 1996 (0.61 % of a 73 kg man's mass): 4.4 N. The model was solved at 5 N and is
   linear, so every sink is scaled by 4.4 / 5; the size of skate that matches the lens dots does not depend on the press */
const B04HAND = 4.4;
const B04G = { box: [LM, 280, 1120, 660], s1: 5.0, ox1: 640, y1: 562, s2: 32, X4: 4, xc: 640, yC: 872 };
/** the whole mouse from the side, to scale, its skates in their colours: the eight corner dots (neutral), the end skates at
   sweep size k (the comparison's yellow), Theseus's two lens dots (blue). The press arrow is drawn by the caller */
function b04_sagMouse(o) {
  const g = B04G, s = g.s1, X = z => g.ox1 + z * s, K = b04_key(), box = g.box;
  b04_padSec(box[0] + 20, box[0] + box[2] - 20, g.y1, s, 0, 1, { foam: 2.2, cells: false });
  part(g.ox1, g.y1, s, () => mouseSimple('right', { hide: ['skates', 'skirt'], hi: o.lit ? ['sensor'] : [], col: o.lit || 'ink' }));
  /* the skates drawn 0.74 mm tall plus 4 px, so their colours read at this scale */
  const sk = (z0, z1, fill, stroke, a = 1) => b04_shape(() => rrPath(X(z0), g.y1 - 0.74 * s - 4, (z1 - z0) * s, 0.74 * s + 4, 1.5), fill, stroke, 1.4, a);
  const lineC = TH ? 'rgba(17,17,17,0.7)' : 'rgba(243,243,245,0.7)';
  for (const [, z] of K.corner) sk(z - 3.25, z + 3.25, TH ? '#8A8A8F' : '#8E8E93', lineC);
  if (o.pads && o.pads.front.w > 0.2) { const p = o.pads; sk(p.front.z0, p.front.z1, C.second, C.second); sk(p.rear.z0, p.rear.z1, C.second, C.second); }
  if (o.ldots > 0.003) for (const z of K.ldots) sk(z - 3.25, z + 3.25, C.hero, C.hero, o.ldots);
}
/** the sensor in section over the cloth, 32 px a mm, the press's movement drawn X4× larger: the pad dished by the skates
   near it, the mouse's floor round the lens opening, the board, module and clip-on lens (b04_section), and with Theseus's
   dots the clip-on lens's two legs down to them. P the solved set, pf the press (0..1). Returns the window's and the
   lens's places */
function b04_sagClose(P, pf, o = {}) {
  const g = B04G, s = g.s2, K = b04_key(), zc = K.lens, X = z => g.xc + (z - zc) * s, Z = x => zc + (x - g.xc) / s, box = g.box;
  const bx0 = box[0], bx1 = box[0] + box[2], sinkB = z => pf * (P.c0 + P.c2 * z), sinkC = z => pf * P.cl(z), k4 = g.X4;
  /* the cloth and foam, pushed down where the skates press */
  b04_padSec(bx0 - 4, bx1 + 4, g.yC, s, 0, 1, { foam: 4, cells: true, dip: xx => k4 * sinkC(Z(xx)) });
  /* the mouse and everything on it: its sink here, a drop and a slight tilt (a shear, drawn X4× larger) */
  const bxs = k4 * pf * P.c2, bys = k4 * s * pf * (P.c0 + P.c2 * zc) - bxs * g.xc;
  G.save(); G.transform(1, bxs, 0, 1, 0, bys);
  const oy = g.yC - 5.03 * s, Yb = y => oy - y * s, Xm = z => g.xc + z * s;           /* the board's frame: y up from its top, z from the module's centre */
  /* the floor of the shell, 1 mm thick, 0.73 mm over the cloth, open round the lens (the window, ±7.7 mm) */
  const fl = TH ? '#FFFFFF' : '#1A1B1E', fe = TH ? 'rgba(17,17,17,0.7)' : 'rgba(243,243,245,0.6)';
  for (const [z0, z1] of [[Z(bx0 - 40) - zc, -7.7], [7.7, Z(bx1 + 40) - zc]]) b04_shape(() => rrPath(Xm(z0), Yb(-3.3), (z1 - z0) * s, s, 3), fl, fe, 1.6, 1);
  text('Floor', Xm(-7.7) - 14, Yb(-3.3) + 23, { role: 'label', size: 22, color: C.mute, align: 'right' });
  const r = b04_section(g.xc, oy, s, { pad: false, z0: -10.5, z1: 10.5 });
  /* Theseus's two dots, on legs of the clear clip-on lens */
  if (o.ldots > 0.003) {
    const cf = B04M.clear(), ce = B04M.clearE();
    for (const zr of [K.ldots[0] - zc, K.ldots[1] - zc]) {
      b04_shape(() => rrPath(Xm(zr - 0.8), Yb(B04S.up), 1.6 * s, Yb(-4.38) - Yb(B04S.up), 3), cf, ce, 1.5, o.ldots);
      b04_shape(() => rrPath(Xm(zr - 3.25), Yb(-4.38), 6.5 * s, 0.65 * s, 6), rgba(C.hero, 0.55), C.hero, 2, o.ldots);
    }
  }
  G.restore();
  const ax = X(K.axis), yCl = g.yC + k4 * s * sinkC(K.axis), yW = yCl - 2.4 * s, yL = g.yC - 2.4 * s + k4 * s * sinkB(K.axis);
  return { ax, yW, yL, yCl, drop: sinkB(K.axis) - sinkC(K.axis), hw: 0.1 * k4 * s, X };
}
/** the focus window, tied to the cloth under the lens (±0.1 mm, drawn X4× larger), and the lens's lowest point against it */
function b04_sagWindow(r, col, a = 1) {
  if (a <= 0.003) return;
  const x0 = r.ax - 70, x1 = r.ax + 70;
  rect(x0, r.yW - r.hw, x1 - x0, r.hw * 2, { fill: inkA(TH ? 0.07 : 0.12), alpha: a });
  for (const yy of [r.yW - r.hw, r.yW + r.hw]) line(x0, yy, x1, yy, { color: C.ink2, w: 1.5, alpha: a, dash: [5, 4] });
  line(r.ax - 44, r.yL, r.ax + 44, r.yL, { color: col, w: 3.5, alpha: a });
}
S({
  id: 'b04_sag', ch: 'glide', ideas: [10], theme: 'paper', title: 'Dots at the lens keep it in focus', settle: 10.5,
  replaces: ['gld_sag', 'dots'],
  src: ['b04_model', 'b04_deleva', 'b04_brock', 'b04_paw3395', 'b04_proset', 'b04_r3d', 'b04_adns3080'],
  answers: [
    ['gld_sag: "visualization feels lazy and needs more detail"', 'Now a demonstration in two views: the whole mouse on a soft pad, to scale, with the hand\'s weight pressing; under it the sensor in section on the cloth (yarns, foam, the floor round the opening, board, module, clip-on lens, its focus window). The skates dish the cloth, the mouse tilts and the lens comes down out of its window, read out live in mm and as the change in your sensitivity.'],
    ['gld_sag: "could be grouped with a comparison to bigger skates and weight efficiency"', 'Grouped: the pointer grows the skates at the ends until the lens holds as well as two dots beside it would (706 mm², 0.31 g more), against Theseus\'s two lens dots (0.05 g). The verdict is the skate weight each takes.'],
    ['dots: "show how this is targeted and more weight efficient compared to how big of skates it takes to reduce the sink that aren\'t placed in the most optimal possible spots (viper v4 style)"', 'The end skates grow on screen (the mouse\'s side and the area scale, which marks V4 Pro-size pads); for the same hold they need 706 mm² against 332 mm² with the dots at the lens: 0.31 g of skate added against 0.05 g. The V4 Pro also rings its lens (said in the source line), so it is shown as a size, not as a fault.'],
    ['F9.20: "the importance of having one or 2 dot skates by the sensor to prevent sag and keeping the sensor focused correctly"', 'The whole slide: without dots by the sensor the lens leaves its 0.2 mm window under the hand\'s weight, 4.4 N (2.40 → 2.27 mm, sensitivity +6 %); with the two dots it stays inside (2.33 mm, +3 %).'],
    ['F20.2: the dots are part of the clip-on lens (G-Wolves style)', 'Drawn so: the two dots stand on legs of the clear clip-on lens, through the floor\'s opening.']
  ],
  draw: t => {
    header(t, 'Dots at the lens keep it in focus');
    captions(t, [[0.3, 'Rest a hand on the mouse and its skates sink into a soft pad; with skates only at the corners, the lens drops out of its focus window.'],
      [2.5, 'One cure is more skate. To hold the lens as well as two dots beside it would, the skates at the ends must grow to 706 mm².'],
      [4.9, 'Theseus puts the two dots on its clip-on lens. The cloth under the lens goes down with them, and the lens holds for 0.05 g.'],
      [8.1, 'PixArt says it too: put the feet around the sensor\'s opening. Two dots there do the work of 0.31 g of skate.']]);
    const g = B04G, box = g.box, K = b04_key();
    demoWindow(box[0], box[1], box[2], box[3], 1, { plain: true });
    /* the input, the same for every skate set: the hand's weight, 5 N, on the hump; and the pointer's drag of the skate size */
    const kp = ep(t, -0.1, 0.9, E.out3), pf = kp * B04HAND / 5,   /* the press is under way on frame one (R2-b04-1, M6) */
      kDrag = ep(t, 2.6, 4.4, E.io3), Am = B04SP.sweep.find(p => Math.abs(p.k - B04SP.match) < 1e-3).area;
    const A = lerp(B04SP.corners.area, Am, kDrag), R = b04_spSweep(A), TS = b04_spSet('theseus'), pads = b04_padsAt(R.k), kw = ep(t, 4.7, 5.6, E.cam);
    const res = {};
    clipped(box[0], box[1], box[2], box[3], () => {
      wipeTo(t, 4.7, 0.9, box, () => { b04_sagMouse({ pads }); res.rv = b04_sagClose(R, pf, {}); }, () => { b04_sagMouse({ ldots: 1 }); res.th = b04_sagClose(TS, pf, { ldots: 1 }); }, { rival: 'Bigger skates', ly: 594 });
      const r = kw >= 0.5 ? res.th : res.rv, out = Math.abs(r.drop) > 0.1 + 1e-6, colL = out ? C.red : kw >= 0.5 ? C.hero : C.ink;
      b04_sagWindow(r, colL);
      /* the legend: the window's dashed band and the lens's lowest point */
      { const lx = box[0] + 32, ly = 628; rect(lx, ly - 10, 46, 20, { fill: inkA(TH ? 0.07 : 0.12) }); for (const yy of [ly - 10, ly + 10]) line(lx, yy, lx + 46, yy, { color: C.ink2, w: 1.5, dash: [5, 4] }); line(lx + 6, ly + 4, lx + 40, ly + 4, { color: colL, w: 3.5 });
        text('The lens in its focus window (0.2 mm)', lx + 62, ly + 8, { role: 'label', size: 22, color: C.mute }); }
      /* the zoom: the stretch of the mouse's underside the section shows */
      const zx0 = g.ox1 + (K.lens - 17.5) * g.s1, zx1 = g.ox1 + (K.lens + 17.5) * g.s1, zy0 = g.y1 - 7 * g.s1, zy1 = g.y1 + 3;
      rr(zx0, zy0, zx1 - zx0, zy1 - zy0, 4, null, C.ink2, 1.5);
      line(zx0, zy1, box[0] + 6, 602, { color: inkA(0.35), w: 1.2, dash: [4, 4] }); line(zx1, zy1, box[0] + box[2] - 6, 602, { color: inkA(0.35), w: 1.2, dash: [4, 4] });
      /* the press: the hand's weight on the hump */
      const hz = -20, yH = g.y1 - 39.4 * g.s1;
      forceArrow(g.ox1 + hz * g.s1, yH - 2, Math.PI / 2, 74, { k: kp, N: B04HAND, dec: 1, label: 'your hand\'s weight',   /* forceArrow labels N × k itself */ color: C.ink, side: 'r' });
      /* what it costs: out of the window */
      const kf = 1 - ep(t, 2.6, 3.0);
      if (kw <= 0.001 && kf > 0.003) faultTag(t, 1.0, [r.ax + 44, r.yL], 'Out of its window', { to: [r.ax + 236, r.yL + 4], side: 'r', alpha: kf });
      /* the scale, said */
      text('Section at the lens: movement drawn ' + g.X4 + '× larger', box[0] + box[2] - 28, box[1] + box[3] - 20, { role: 'label', size: 22, color: TH ? '#FFFFFF' : C.ink2, align: 'right' });
    });
    /* ---- right, top: the lens's height over the cloth, live ---- */
    const rx = 1240, rw = RM - rx, ky = 280, kh = 320;
    demoWindow(rx, ky, rw, kh, 1);
    cardHead(t, 0, rx, ky, rw, 'Lens to cloth', []);
    {
      const drop = lerp(pf * R.gap, pf * TS.gap, kw), Z = 2.4 - drop, out = drop > 0.1 + 1e-6, colZ = out ? C.red : kw > 0.5 ? C.heroText : C.ink;
      rich([{ s: fmtN(Z, 2), role: 'd1', size: 76, weight: 800, color: colZ, tnum: true }, { s: 'mm', font: 'sans', size: 26, weight: 700, color: C.mute, gap: 8 }], rx + 32, ky + 150);
      text(out ? 'Out of the 0.2 mm window' : 'In the 0.2 mm window', rx + 32, ky + 192, { role: 'small', size: 25, weight: 700, color: out ? C.red : C.mute });
      /* the player's side of it: counts scale as 2.4 / Z, so the same move reads more while you press */
      const sens = Math.round((2.4 / Z - 1) * 100), ks = ep(t, 1.0, 1.4);
      text('Sensitivity', rx + rw - 32, ky + 96, { role: 'label', size: 22, color: C.mute, align: 'right', alpha: ks });
      rich([{ s: (sens > 0 ? '+' : '') + sens, role: 'd1', size: 56, weight: 800, color: out ? C.red : C.ink, tnum: true }, { s: '%', font: 'disp', size: 30, weight: 800, color: out ? C.red : C.ink, gap: 10 }], rx + rw - 32, ky + 150, { align: 'right', alpha: ks });
      text('while you press', rx + rw - 32, ky + 192, { role: 'small', size: 25, weight: 600, color: C.mute, align: 'right', alpha: ks });
      /* the scale: 2.2 to 2.6 mm, the window shaded, a marker at Z */
      const gx0 = rx + 32, gx1 = rx + rw - 32, gy = ky + 232, GX = z => lerp(gx0, gx1, (z - 2.2) / 0.4);
      rr(gx0, gy - 6, gx1 - gx0, 12, 6, C.track);
      rr(GX(2.3), gy - 6, GX(2.5) - GX(2.3), 12, 0, inkA(0.18));
      for (const v of [2.2, 2.3, 2.4, 2.5, 2.6]) { line(GX(v), gy + 9, GX(v), gy + 15, { color: C.faint, w: 1.5 }); text(fmtN(v, 1), GX(v), gy + 40, { role: 'tick', size: 21, color: C.faint, align: 'center' }); }
      const mx = GX(Z); G.save(); G.beginPath(); G.moveTo(mx, gy - 9); G.lineTo(mx - 9, gy - 22); G.lineTo(mx + 9, gy - 22); G.closePath(); G.fillStyle = colZ; G.fill(); G.restore();
      line(mx, gy - 8, mx, gy + 8, { color: colZ, w: 3 });
      /* once the dots are on, what the corners alone did stays on the scale (F16.1) */
      const km = ep(t, 5.7, 6.2);
      if (km > 0.003) {
        const Zc = 2.4 - B04SP.corners.gap * B04HAND / 5, cx2 = GX(Zc);
        G.save(); G.globalAlpha = km; G.beginPath(); G.moveTo(cx2, gy - 9); G.lineTo(cx2 - 8, gy - 21); G.lineTo(cx2 + 8, gy - 21); G.closePath(); G.strokeStyle = C.red; G.lineWidth = 2; G.stroke(); G.restore();
        text('Corner dots only: ' + fmtN(Zc, 2) + ' mm, +' + Math.round((2.4 / Zc - 1) * 100) + ' %', rx + 32, gy + 74, { role: 'small', size: 24, weight: 700, color: C.red, alpha: km });
      }
    }
    /* ---- right, bottom: the skates, their area and weight; then the verdict ---- */
    const sy = 620, sh = 320, kv = ep(t, 5.8, 6.1);
    demoWindow(rx, sy, rw, sh, 1);
    cardHead(t, 0, rx, sy, rw, kv < 0.5 ? 'Skates' : 'What holding the lens costs', []);
    if (kv < 0.999) {
      const a = 1 - kv, Ar = lerp(A, TS.area, kw), g0 = b04_gOf(B04SP.corners.area), add = lerp(b04_gOf(A) - g0, b04_gOf(TS.area) - g0, kw);
      const th = kw > 0.5, colW = th ? C.heroText : kDrag > 0.01 ? C.secondText : C.ink;
      rich([{ s: fmtN(Ar, 0), role: 'd1', size: 56, weight: 800, color: C.ink, tnum: true }, { s: 'mm²', font: 'sans', size: 24, weight: 700, color: C.mute, gap: 6 }], rx + 32, sy + 128, { alpha: a });
      text('Skate area', rx + 32, sy + 162, { role: 'label', size: 22, color: C.mute, alpha: a });
      rich([{ s: (add > 0.0005 ? '+' : '') + fmtN(add, 2), role: 'd1', size: 56, weight: 800, color: colW, tnum: true }, { s: 'g', font: 'sans', size: 24, weight: 700, color: C.mute, gap: 6 }], rx + 330, sy + 128, { alpha: a });
      text(th ? 'Two lens dots' : 'Skate added', rx + 330, sy + 162, { role: 'label', size: 22, color: th ? C.heroText : C.mute, alpha: a });
      /* the area scale the pointer drags along: 0 to 2,100 mm², the corner dots and V4 Pro-size pads marked */
      const tx0 = rx + 32, tx1 = rx + rw - 40, ty = sy + 236, TX = v => lerp(tx0, tx1, v / 2100);
      rr(tx0, ty - 5, tx1 - tx0, 10, 5, C.track, null, 0, a);
      if (kDrag > 0.01 || th) rr(tx0, ty - 5, TX(Ar) - tx0, 10, 5, th ? C.hero : C.second, null, 0, a);
      for (const [v, l, al] of [[B04SP.corners.area, 'Corner dots', 'left'], [2011, 'V4 Pro-size pads', 'right']]) { line(TX(v), ty + 10, TX(v), ty + 20, { color: C.faint, w: 1.5, alpha: a }); text(l, al === 'left' ? tx0 : tx1, ty + 48, { role: 'label', size: 22, color: C.faint, align: al, alpha: a }); }
      const kx = TX(Ar); circle(kx, ty, 13, { fill: C.panel, color: th ? C.hero : kDrag > 0.01 ? C.second : C.ink2, w: 3, alpha: a });
      /* the pointer grows the end skates */
      if (t > 2.1 && t < 5.2) cursorAt(t, [[2.1, [kx + 60, ty + 70]], [2.55, [TX(B04SP.corners.area), ty]], [4.4, [TX(Am), ty]], [5.2, [TX(Am) + 50, ty + 80]]], [2.6], { grab: t > 2.6 && t < 4.45, a: ep(t, 2.1, 2.4) * (1 - ep(t, 4.6, 5.0)) });
    }
    if (kv > 0.003) verdict(t, 5.8, rx + 36, sy + 212, { from: b04_gOf(Am) - b04_gOf(B04SP.corners.area), to: b04_gOf(TS.area) - b04_gOf(B04SP.corners.area), unit: 'g', dec: 2, label: 'Skate added to hold the lens', better: 'lower', who: ['Big skates', 'Theseus'], size: 90 });
    source(t, 'Derived (pad model): a rigid mouse on skates in a 4 mm soft pad, set so one dot a corner sinks 0.65 mm at a firm 10 N (Brock\'s report), pressed with a hand\'s weight, 4.4 N (de Leva 1996); all skates the same 0.65 mm POM stack; sensitivity 2.4 / Z. The V4 Pro also rings its lens (prosettings.net). PixArt: "place mouse feet around the base plate opening".', { t0: 0.8, maxW: RM - LM });
  }
});

/* ============================== 5. Skates where they count ==============================
   Brock on gld_under: the corner ledges "the same length as the sensor['s] skate ledge (possible to fit up to 3 skates)",
   "no gap between themselves and the shell", "fillet where the skate pills hit the shell", uniform and finished; and fold
   in "Three details under the mouse" (0.65 mm, POM / PTFE, screws clear). Plate off. Each corner ledge is centred on the
   3D shell's corner pair (KEY_PARTS.skates), along it, 19.5 mm long: the lens's two-dot span, three 6.5 mm slots; two dots
   at its ends by default (13 mm apart, like the lens's), the middle slot free for a third. Why two: the same pad model as
   b04_sag (work/b04/model/skates_model.py), a hard press of 10 N on the hump: one dot a corner sinks 0.94 mm at the rear,
   deeper than its 0.65 mm, so the floor drags on the cloth (Brock #10); two sink 0.48 mm, three 0.38. Theme night. */
const B04SK = {
  press: 10,
  /* per corner ledge (front +X, rear +X, front −X, rear −X): one dot (the middle slot), two (the ends), three (ends; the
     middle is their mean, the ledge being rigid) — each dot's sink, mm, at 10 N */
  one: [0.367, 0.931, 0.372, 0.935], two: [[0.176, 0.203], [0.461, 0.484], [0.195, 0.172], [0.48, 0.454]], three: [[0.139, 0.16], [0.366, 0.384], [0.155, 0.137], [0.382, 0.361]],
  stack: 0.65, lam: 2.0
};
/** the four corner ledges (mouse frame, mm): centre, direction along the rim, outward normal, the three slots */
function b04_ledges() {
  if (b04_ledges.v) return b04_ledges.v;
  const K = b04_key(), C = K.corner, out = [];
  for (const [i, j] of [[0, 1], [2, 3], [4, 5], [6, 7]]) {
    const p = C[i], q = C[j], c = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], L = Math.hypot(q[0] - p[0], q[1] - p[1]), u = [(q[0] - p[0]) / L, (q[1] - p[1]) / L];
    let n = [-u[1], u[0]]; if (n[0] * c[0] + n[1] * c[1] < 0) n = [-n[0], -n[1]];
    out.push({ c, u, n, slots: [-6.5, 0, 6.5].map(k => [c[0] + u[0] * k, c[1] + u[1] * k]) });
  }
  return (b04_ledges.v = out);
}
/** is a bottom-view point (bx, by) inside the shell's outline? */
function b04_inOutline(bx, by) {
  const P = msView('bottom').outPts; let ins = false;
  for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const a = P[i], b = P[j]; if ((a[1] > by) !== (b[1] > by) && bx < (b[0] - a[0]) * (by - a[1]) / (b[1] - a[1]) + a[0]) ins = !ins; }
  return ins;
}
/** the underside, plate off, in the bottom view's mm frame (call inside part()): each corner ledge grown out of the wall
   with a fillet at each end, its three slots, the dots in them (n: 1 the middle, 2 the ends, 3 all; k from 0 to 1 for a
   dot arriving), the lens with its two dots, the screws. o = { n, k3, scrape (0..1, the rear ledges in red), col, dim } */
function b04_underside(o) {
  const V = msView('bottom'), B = ([X, Z]) => [X * MS_K.x, -Z * MS_K.y], led = b04_ledges(), K = b04_key();
  const ledF = TH ? '#D9D9DD' : '#3A3B3F', ledE = TH ? 'rgba(17,17,17,0.55)' : 'rgba(243,243,245,0.45)', lwp = 1.4 / (Math.hypot(XF.m[0], XF.m[1]) || 1);
  G.save(); G.clip(V.out);
  for (let li = 0; li < 4; li++) {
    const L = led[li], u = L.u, n = L.n, half = 10.5, w0 = 4.25, P = (a, b) => B([L.c[0] + u[0] * a + n[0] * b, L.c[1] + u[1] * a + n[1] * b]);
    /* where each end of the ledge meets the wall: march out along the normal until outside the outline */
    const meet = a => { let lo = 0, hi = 16; for (let k = 0; k < 18; k++) { const m = (lo + hi) / 2, q = P(a, m); if (b04_inOutline(q[0], q[1])) lo = m; else hi = m; } return lo; };
    const ma = meet(-half), mb = meet(half), rf = 2.0;
    /* the ledge: a pill along the rim (rounded inner ends) and the web out to the wall, a 2 mm fillet where each end meets
       the wall; whatever lies past the wall is clipped away by the outline */
    const M = (aa, bb) => P(aa, bb);
    G.beginPath();
    G.moveTo(...M(-half, -w0)); G.lineTo(...M(half, -w0));
    G.quadraticCurveTo(...M(half + w0, -w0), ...M(half + w0, 0)); G.quadraticCurveTo(...M(half + w0, w0 * 0.6), ...M(half, w0 * 0.9));
    G.lineTo(...M(half, mb - rf)); G.quadraticCurveTo(...M(half, mb), ...M(half + rf, mb + 0.2)); G.lineTo(...M(half + rf, mb + 8));
    G.lineTo(...M(-half - rf, ma + 8)); G.lineTo(...M(-half - rf, ma + 0.2)); G.quadraticCurveTo(...M(-half, ma), ...M(-half, ma - rf));
    G.lineTo(...M(-half, w0 * 0.9)); G.quadraticCurveTo(...M(-half - w0, w0 * 0.6), ...M(-half - w0, 0)); G.quadraticCurveTo(...M(-half - w0, -w0), ...M(-half, -w0));
    G.closePath();
    G.fillStyle = o.scrape && (li === 1 || li === 3) ? mix(ledF, C.red, 0.45 * o.scrape) : ledF; G.fill(); G.strokeStyle = ledE; G.lineWidth = lwp; G.stroke();
    /* the slots and the dots in them */
    L.slots.forEach((sl, si) => {
      const q = B(sl), on = o.n === 1 ? si === 1 : o.n === 2 ? si !== 1 : true, k = si === 1 && o.n === 3 ? 0.5 * (o.k3 == null ? 1 : o.k3) : 1;   /* the third, optional: drawn lighter */
      G.beginPath(); G.arc(q[0], q[1], 3.25, 0, TAU); G.setLineDash([0.9, 0.7]); G.strokeStyle = ledE; G.lineWidth = lwp; G.stroke(); G.setLineDash([]);
      if (on && k > 0.003) { G.save(); G.globalAlpha *= k; G.beginPath(); G.arc(q[0], q[1], 3.25 * (0.6 + 0.4 * k), 0, TAU); G.fillStyle = o.col || C.hero; G.fill(); G.strokeStyle = TH ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.35)'; G.lineWidth = lwp; G.stroke(); G.restore(); }
    });
  }
  G.restore();
  /* the clip-on lens and its two dots: the same span as a corner ledge */
  const lz = K.lens, lc = B([0, lz]);
  G.beginPath(); rrPath(lc[0] - 2.6, lc[1] - 9.75, 5.2, 19.5, 2.6); G.fillStyle = B04M.clear(); G.fill(); G.strokeStyle = B04M.clearE(); G.lineWidth = lwp; G.stroke();
  for (const z of K.ldots) { const q = B([0, z]); G.beginPath(); G.arc(q[0], q[1], 3.25, 0, TAU); G.fillStyle = C.hero; G.fill(); }
  /* the screws: heads clear of every dot */
  for (const [X, Z] of [[21.52, 17.0], [-21.52, 17.0], [25.22, -24.0], [-25.22, -24.0]]) { const q = B([X, Z]); G.beginPath(); G.arc(q[0], q[1], 1.9, 0, TAU); G.fillStyle = TH ? '#BDBDC2' : '#6E6E73'; G.fill(); G.strokeStyle = ledE; G.lineWidth = lwp; G.stroke(); G.beginPath(); G.moveTo(q[0] - 1.1, q[1]); G.lineTo(q[0] + 1.1, q[1]); G.moveTo(q[0], q[1] - 1.1); G.lineTo(q[0], q[1] + 1.1); G.strokeStyle = TH ? '#2E2E30' : '#151619'; G.stroke(); }
}
/** a corner ledge in section along its length (the rear −X ledge, the deepest), the pad under it: sinks (mm) at the
   three slots (null where there is no dot), the press p (0..1 of 10 N). Draws at (cx, yC) the cloth's rest line, s px/mm */
function b04_ledgeSec(cx, yC, s, sinks, a, o = {}) {
  const X = x => cx + x * s, slots = [-6.5, 0, 6.5], have = sinks.map(v => v != null);
  /* the ledge is rigid: its sink along x is the line through the dots it stands on */
  const pts = slots.map((x, i) => [x, sinks[i]]).filter(p => p[1] != null);
  const lin = x => pts.length === 1 ? pts[0][1] : pts[0][1] + (pts[pts.length - 1][1] - pts[0][1]) * (x - pts[0][0]) / (pts[pts.length - 1][0] - pts[0][0]);
  const stack = B04SK.stack, floorAt = x => lin(x) - stack;                     /* the floor's height under the cloth's rest line (mm, + down) */
  /* the cloth's sink: under a dot, the dot's; beside it, dragged down over about 2 mm (Pasternak); never above the floor */
  const dip = x => { let w = 0; slots.forEach((sx, i) => { if (!have[i]) return; const d = Math.max(0, Math.abs(x - sx) - 3.25); w = Math.max(w, sinks[i] * Math.exp(-d / B04SK.lam)); }); return Math.max(w, floorAt(x)); };
  b04_padSec(X(-11), X(11), yC, s, 0, a, { foam: 3.4, cells: true, dip: xx => dip((xx - cx) / s) });
  /* the floor and the ledge above it, sinking with the dots */
  const yF = x => yC + lin(x) * s - stack * s, touch = floorAt(0) > -0.005 || floorAt(-11) > -0.005 || floorAt(11) > -0.005;
  b04_shape(() => { G.moveTo(X(-11), yF(-11)); G.lineTo(X(11), yF(11)); G.lineTo(X(11), yF(11) - 1.6 * s); G.lineTo(X(-11), yF(-11) - 1.6 * s); G.closePath(); }, TH ? '#D9D9DD' : '#3A3B3F', TH ? 'rgba(17,17,17,0.55)' : 'rgba(243,243,245,0.45)', 1.6, a);
  slots.forEach((sx, i) => {
    const yb = yC + (have[i] ? sinks[i] : lin(sx)) * s;
    if (!have[i]) { b04_shape(() => rrPath(X(sx - 3.25), yb - stack * s, 6.5 * s, stack * s, 4), null, TH ? 'rgba(17,17,17,0.25)' : 'rgba(243,243,245,0.25)', 1.2, a); return; }
    /* the stack: glide 0.38 under tape, PORON 0.17, tape */
    b04_shape(() => rrPath(X(sx - 3.25), yb - 0.38 * s, 6.5 * s, 0.38 * s, 4), C.hero, null, 0, a);
    b04_shape(() => G.rect(X(sx - 3.25), yb - 0.60 * s, 6.5 * s, 0.17 * s), TH ? '#9A9AA0' : '#6E6E73', null, 0, a);
    b04_shape(() => G.rect(X(sx - 3.25), yb - stack * s, 6.5 * s, 0.05 * s), TH ? '#5E5E63' : '#AEAEB2', null, 0, a);
  });
  /* where the floor reaches the cloth: red */
  if (touch && a > 0.003) for (let x = -11; x < 11; x += 0.5) if (floorAt(x) > -0.01 && floorAt(x + 0.5) > -0.01) line(X(x), yF(x) + 2, X(x + 0.5), yF(x + 0.5) + 2, { color: C.red, w: 4, alpha: a });
  return { X, yF, touch, top: yF(0) - 1.6 * s };
}
S({
  id: 'b04_skates', ch: 'glide', ideas: [10, 8, 52], theme: 'night', title: 'Skates where they count', settle: 11,
  replaces: ['gld_under', 'gld_sheet'],
  src: ['b04_model', 'b04_brock', 'b04_r3d', 'b04_tpuUlx', 'b04_zowie'],
  answers: [
    ['gld_under: "corner dots ledges should be the same length as the sensor distance between the sensor skate ledge (possible to fit up to 3 skates)"', 'Each corner ledge is 19.5 mm, the span of the clip-on lens\'s two dots, with three 6.5 mm slots: two dots at its ends by default (13 mm apart, like the lens\'s), the middle slot for a third. The pointer adds the third on screen.'],
    ['gld_under: "they shouldn\'t have a gap between themselves and the shell"', 'Each ledge grows out of the wall: no gap between ledge and shell.'],
    ['gld_under: "we need filet where the skate pills hit the shell"', 'A 2 mm fillet where each end of a ledge meets the wall.'],
    ['gld_under: "the current execution looks very lazy and not uniform"', 'Four identical ledges, mirrored, the same length as the lens\'s, drawn as built from the 3D shell\'s corner positions; and a demonstration of why there are two dots a corner (the press on a soft pad, the sink, the clearance).'],
    ['gld_under: "the right visualization is not what i wanted at all"', 'The V4 Pro half-moons are gone (V4 Pro-size pads appear on b04_sag as a size). The right side is now a corner ledge in section: the dots, their 0.65 mm stack, the pad, the press and the clearance.'],
    ['gld_sheet: "visualizations feel lazy"', 'Its three details are demonstrated here: the 0.65 mm stack (glide 0.38, tape, PORON 0.17, tape) in the section; POM by default, PTFE in the box (narration and label); no screw under a dot, against the UltralightX\'s rear screws under its skates (TechPowerUp).'],
    ['F14.1: plate off, "there should only be [a] ledge to fit the 8 dot skates"', 'Plate off: four ledges for the eight corner dots (two a corner), plus the lens\'s two on the clip-on lens. The plate\'s pill shapes belong with the plate (later, F27).']
  ],
  draw: t => {
    header(t, 'Skates where they count');
    captions(t, [[0.3, 'Press hard on a soft pad and each dot sinks in. With one dot a corner it sinks deeper than it is tall, and the floor drags on the cloth.'],
      [2.7, 'Each corner of Theseus has a ledge as long as the lens\'s, 19.5 mm: two dots by default, room for a third. The same press sinks half as far.'],
      [6.4, 'Every dot is 6.5 mm and 0.65 mm tall, POM by default with PTFE in the box, and no screw sits under one: opening the mouse never costs a skate.']]);
    const kp = ep(t, 0.6, 1.4, E.io3), kw = ep(t, 2.6, 3.5, E.cam), k3 = ep(t, 4.4, 4.9, E.snap);
    /* ---- left: the underside, plate off ---- */
    const bx = LM, by = 280, bw = 1000, bh = 660, s = 6.0, ox = bx + 500, oy = by + 236;
    demoWindow(bx, by, bw, bh, 1, { plain: true });
    const one = { n: 1, col: C.second, scrape: ep(t, 1.2, 1.5) * (1 - kw) }, th = { n: t > 4.4 ? 3 : 2, k3, col: C.hero };
    wipeTo(t, 2.6, 0.9, [bx, by, bw, bh], () => part(ox, oy, s, () => { mouseSimple('bottom', { hide: ['skates', 'sensor'], show: ['board'], lw: 2 }); b04_underside(one); }, { rot: Math.PI / 2 }),
      () => part(ox, oy, s, () => { mouseSimple('bottom', { hide: ['skates', 'sensor'], show: ['board'], lw: 2 }); b04_underside(th); }, { rot: Math.PI / 2 }), { rival: 'One dot a corner', ly: by + 474 });
    /* the ledge in the section, located */
    const PB = (X, Z) => [ox + s * Z * MS_K.y, oy + s * X * MS_K.x], L3 = b04_ledges()[3], lp = PB(...L3.c);
    rr(lp[0] - 74, lp[1] - 40, 148, 80, 10, null, C.ink2, 1.5);
    text('In section', lp[0] - 84, lp[1] + 8, { role: 'label', size: 22, color: C.mute, align: 'right' });
    /* the screws: clear of every dot (gld_sheet's third detail) */
    { const ks = ep(t, 6.6, 7.0); if (ks > 0.003) for (const [X, Z] of [[21.52, 17.0], [-21.52, 17.0], [25.22, -24.0], [-25.22, -24.0]]) { const sp = PB(X, Z); circle(sp[0], sp[1], 10 + 4 * (1 - ks), { color: C.hero, w: 2.5, alpha: ks }); } }
    text('Plate off, from below', bx + bw - 28, by + 34, { role: 'label', size: 22, color: C.mute, align: 'right' });
    /* ---- right: the rear corner's ledge in section, a hard press on a soft pad ---- */
    const qx = 1120, qw = RM - qx;
    demoWindow(qx, by, qw, bh, 1);
    cardHead(t, 0, qx, by, qw, 'A rear corner, in section', []);
    const s2 = 30, cx = qx + qw / 2, yC = by + 470;
    const sk1 = [null, B04SK.one[3] * kp, null], two = B04SK.two[3], th3 = B04SK.three[3];
    const sk2 = t > 4.4 ? [lerp(two[0], th3[0], k3) * kp, lerp((two[0] + two[1]) / 2, (th3[0] + th3[1]) / 2, k3) * kp, lerp(two[1], th3[1], k3) * kp] : [two[0] * kp, null, two[1] * kp];
    const k3a = t > 4.4 ? k3 : 0;
    let sec = null;
    clipped(qx, by, qw, bh, () => {
      wipeTo(t, 2.6, 0.9, [qx, by, qw, bh], () => { sec = b04_ledgeSec(cx, yC, s2, sk1, 1); }, () => { sec = b04_ledgeSec(cx, yC, s2, k3a > 0.003 ? sk2 : [sk2[0], null, sk2[2]], 1); }, { labels: false });
    });
    /* the press: 10 N, a hard one, on the ledge */
    forceArrow(cx, (sec ? sec.top : yC - 60) - 4, Math.PI / 2, 90, { k: kp, N: B04SK.press, dec: 0, label: 'a hard press',   /* forceArrow labels N × k itself */ color: C.ink, side: 'r' });
    /* the readout: the deepest dot's sink against its own height */
    { const sNow = kw < 0.5 ? B04SK.one[3] * kp : Math.max(...sk2.filter(v => v != null)), clr = B04SK.stack - sNow, drag = clr < 0, col = drag ? C.red : kw >= 0.5 ? C.heroText : C.ink;
      /* labelled in place (R2-b04-2): this live meter ends on the ledge with a third dot added; the verdict is as shipped */
      text(k3a > 0.5 ? 'Deepest dot\'s sink, a third dot added' : kw >= 0.5 ? 'Deepest dot\'s sink, two dots' : 'Deepest dot\'s sink, one dot', qx + 32, by + 104, { role: 'label', size: 22, color: C.mute });
      rich([{ s: fmtN(sNow, 2), role: 'd1', size: 60, weight: 800, color: col, tnum: true }, { s: 'mm', font: 'sans', size: 24, weight: 700, color: C.mute, gap: 6 }], qx + 32, by + 164);
      text(drag ? 'Deeper than its 0.65 mm: the floor drags' : 'The floor clears the cloth by ' + fmtN(clr, 2) + ' mm', qx + 32, by + 204, { role: 'small', size: 24, weight: 700, color: drag ? C.red : C.mute, maxW: qw - 64 });
      /* the stack, named once */
      const ka = ep(t, 6.4, 6.8); if (ka > 0.003) { text('Each dot 6.5 mm across, 0.65 mm tall;', qx + 32, by + bh - 62, { role: 'small', size: 24, weight: 600, color: C.ink2, alpha: ka }); text('no screw under one (ringed, left)', qx + 32, by + bh - 30, { role: 'small', size: 24, weight: 600, color: C.heroText, alpha: ka, sentence: false }); }
    }
    /* the third dot: the pointer puts it in the free slot of the ledge in section */
    if (t > 3.8 && t < 5.6) { const tp = [cx, yC - 10]; cursorAt(t, [[3.8, [tp[0] + 120, tp[1] + 120]], [4.3, tp], [5.6, [tp[0] + 90, tp[1] + 130]]], [4.35], { a: ep(t, 3.8, 4.0) * (1 - ep(t, 5.0, 5.4)) }); }
    if (t > 4.3) text('A third, for the softest pads', cx, yC + 136, { role: 'label', size: 22, color: C.heroText, align: 'center', alpha: ep(t, 4.4, 4.8) * (1 - ep(t, 6.2, 6.5)) });
    /* the verdict: one dot a corner against Theseus's two */
    /* the verdict, as shipped: one dot a corner (the layout Brock found scraping; no mouse is named for it: none was found
       sourced) against Theseus's two dots a corner */
    verdict(t, 5.6, bx + 40, by + 540, { from: B04SK.one[3], to: Math.max(...B04SK.two[3]), unit: 'mm', dec: 2, label: 'Deepest sink, hard press', better: 'lower', who: ['One dot a corner', 'Theseus, two dots'], size: 72 });
    /* why 10 N here and 4.4 N on b04_sag (R2-b04-2): the model is linear, so a resting hand sinks one dot only 0.41 mm, inside
       its 0.65; the floor drags under a hard press, which is the case this slide tests */
    source(t, 'Derived (pad model, previous slide): 10 N, a hard press, on the hump; only then does the floor drag (a resting hand, 4.4 N, sinks one dot ' + fmtN(B04SK.one[3] * B04HAND / B04SK.press, 2) + ' mm). Brock, of one dot a corner: "some softer pads cause the dots to sink in too much and the pad to scrape the bottom of the mouse". TechPowerUp: the UltralightX\'s rear screws sit under its skates.', { t0: 0.8, maxW: RM - LM });
  }
});

/* ============================== 6. Snap-on lens: one dot wide ==============================
   Brock liked gld_module (8/10: "a good slide, just your normal above average slide"): kept (the module and the lens in
   section, the lenses' footprints to scale) and re-framed problem first. PixArt's own assembly (PAW3395 datasheet §3.5): the
   lens is placed on the base plate, the board goes over it onto the plate's posts ("The optical position reference for the
   PCB is set by the base plate and lens"), and "There must be a feature in the top case to press down onto the PCB
   assembly"; "the PCB motion due to button presses must be minimized to maintain optical alignment". Theseus's lens clips
   up through two slots in the board around the castellated module (the 3D board): the board alone holds it, so the plate can
   come off, and it is one dot wide. Footprints are bounding boxes: PixArt's round LM19-LSI 18.85 × 21.15 mm, its trim
   L0AE-LSI1 10.90 × 16.80 mm, the snap-on lens 5.2 × 14.2 mm (KEY_PARTS). Theme paper. */
/** PixArt's stack in section, schematic (mm over the pad, z along the mouse): the base plate, the lens on it, the board on
   the lens, the chip on the board, the top case's post pressing down. k (0..1) brings the parts together from apart */
function b04_pixStack(ox, yP, s, k, a = 1) {
  const X = z => ox + z * s, Y = h => yP - h * s, sep = (i) => (1 - E.io3(clamp(k * 4 - i))) * (i + 1) * 1.6;   /* each part arrives in turn */
  const plate = TH ? '#C9C9CE' : '#4A4B50', plateE = TH ? 'rgba(17,17,17,0.5)' : 'rgba(243,243,245,0.4)', cf = B04M.clear(), ce = B04M.clearE();
  /* the base plate, 1.5 mm, with the opening the lens looks through */
  const d0 = -sep(0) * 0.6;
  for (const [z0, z1] of [[-14, -3.2], [3.2, 14]]) b04_shape(() => rrPath(X(z0), Y(2.15 + d0), (z1 - z0) * s, 1.5 * s, 3), plate, plateE, 1.4, a);
  /* the lens: a clear body 16.8 mm long resting on the plate, its imaging dome down in the opening (the reference plane 2.40) */
  const d1 = sep(1);
  b04_shape(() => rrPath(X(-8.4), Y(4.35 + d1), 16.8 * s, 2.2 * s, 6), cf, ce, 1.5, a);
  b04_shape(() => { G.moveTo(X(-2.6), Y(2.15 + d1)); G.lineTo(X(-2.6), Y(2.6 + d1)); G.quadraticCurveTo(X(0), Y(2.0 + d1), X(2.6), Y(2.6 + d1)); G.lineTo(X(2.6), Y(2.15 + d1)); G.closePath(); }, cf, ce, 1.5, a);
  b04_shape(() => G.rect(X(-2.6), Y(4.35 + d1) , 5.2 * s, 2.2 * s), cf, null, 0, a * 0.0);
  /* the board on the lens, the chip on the board looking down through it */
  const d2 = sep(2);
  b04_shape(() => G.rect(X(-14), Y(5.95 + d2), 28 * s, 1.6 * s), B04M.board(), null, 0, a);
  b04_shape(() => rrPath(X(-6.5), Y(7.95 + d2), 13 * s, 2.0 * s, 3), B04M.mod(), null, 0, a);
  /* the top case's post, pressing the board down onto the lens */
  const d3 = sep(3);
  b04_shape(() => rrPath(X(-1.5), Y(12.5 + d3), 3 * s, (12.5 - 7.95) * s, 3), plate, plateE, 1.4, a);
  return { X, Y, post: [X(0), Y(12.5 + d3)], plate: [X(-10), Y(1.4 + d0)], lens: [X(6), Y(3.3 + d1)], board: [X(11), Y(5.15 + d2)], chip: [X(4), Y(6.95 + d2)] };
}
S({
  id: 'b04_module', ch: 'glide', ideas: [37], theme: 'paper', title: 'Snap-on lens: one dot wide', settle: 10,
  replaces: ['gld_module'],
  src: ['b04_paw3395', 'b04_r3d', 'b04_brock'],
  answers: [
    ['gld_module: "i like this slide, it feels like a good slide"', 'Kept: the castellated module and the clip-on lens in section, drawn from the 3D board, and the lenses\' footprints to scale.'],
    ['gld_module: "just your normal above average slide right here"', 'Raised: it now opens on the problem, PixArt\'s own assembly (the lens sits on the base plate, the board on the lens, the top case presses it down, and PixArt warns that a click moving the board moves the optics), builds that stack, then snaps Theseus\'s lens up through the board; the verdict is against PixArt\'s smaller (trim) lens, not its biggest.'],
    ['R2-b04-3 (the rival\'s fault drawn; the payoff said)', 'PixArt\'s own warning is named on its board in red ("Clicks move it") and said in full in the narration and the foot line; Theseus\'s clip is labelled for what it does ("Clipped round the chip": chip and lens held as one, by the board alone); the closing line says what one dot wide buys: the lens carries its own two dots, the dots that keep it in focus (Dots at the lens). Not animated: PixArt gives no mechanism or size for the motion'],
    ['F9.14: "the sensor and snap on lens are both not as accurate as id like"', 'Drawn to the 3D board: the 8.4 × 9.8 × 0.62 mm castellated module, its half-holes at 1.2 mm, the clip-on lens 5.2 × 14.2 mm with a clip through the board at each end, the imaging and light lenses where the 3D has them.']
  ],
  draw: t => {
    header(t, 'Snap-on lens: one dot wide');
    captions(t, [[0.2, 'PixArt\'s lens sits on the base plate under the board, and the top case must press the board down: PixArt warns that clicks moving it break the alignment.'],
      [3.0, 'Theseus\'s lens clips up through the board around the sensor module: chip and lens held as one, by the board alone, so the base plate can come off.'],
      [7.0, 'It is one dot wide, 5.2 mm across, so it carries its own two dots: the dots at the lens that keep it in focus, on a fraction of the board.']]);
    const K = b04_key(), kA = ep(t, 0.6, 2.4), kS = ep(t, 2.9, 3.7, E.out3), bx = LM, by = 280, bw = 1000, bh = 660, s = 20;
    demoWindow(bx, by, bw, bh, 1, { plain: true });
    /* ---- top: PixArt's stack ---- */
    { const yP = by + 316, ox = bx + 340;
      line(bx + 40, yP, bx + 640, yP, { color: C.ink2, w: 2 }); text('Pad', bx + 40, yP + 28, { role: 'label', size: 22, color: C.mute });
      let r = null; clipped(bx, by + 56, bw, 290, () => { r = b04_pixStack(ox, yP, s, kA); });
      text('PixArt\'s lens, on the base plate', bx + 32, by + 44, { role: 'label', size: 22, color: C.secondText });
      const kl = ep(t, 1.8, 2.3), lx = bx + 690;
      for (const [p, l, dy] of [[r.post, 'Top case presses down', -10], [r.chip, 'Chip', 0], [r.board, 'Board', 0], [r.lens, 'Lens', 0], [r.plate, 'Base plate', 0]]) {
        line(p[0], p[1], lx - 10, p[1] + dy, { color: inkA(0.3), w: 1.2, alpha: kl }); text(l, lx, p[1] + dy + 7, { role: 'label', size: 22, color: C.ink2, alpha: kl });
      }
      if (kA > 0.7) forceArrow(r.post[0] + 4, r.post[1] + 6, 2.25, 52, { k: ep(t, 2.0, 2.4), color: C.ink, w: 3 });
      /* the rival's fault, in PixArt's own words (R2-b04-3): "PCB motion due to button presses must be minimized to maintain optical
         alignment" (datasheet §3.5, step 6). Named on its board, not animated: PixArt gives no mechanism or size to draw */
      faultTag(t, 2.5, [r.X(-13), r.Y(5.95)], 'Clicks move it', { dx: 0, dy: -84 });
    }
    line(bx + 30, by + 340, bx + bw - 30, by + 340, { color: C.hair, w: 1.5 });
    /* ---- bottom: Theseus's: the module on the board, the lens snapping up through it; no plate ---- */
    { const s = 24, yP = by + 612, ob = yP - 5.03 * s, ox = bx + 340;
      line(bx + 40, yP, bx + 640, yP, { color: C.ink2, w: 2 }); text('Pad', bx + 40, yP + 28, { role: 'label', size: 22, color: C.mute });
      text('Theseus\'s lens, clipped to the board', bx + 32, by + 384, { role: 'label', size: 22, color: C.heroText });
      /* the board and module, then the lens rising from below into its slots (a little overshoot: it snaps) */
      const lift = (1 - kS) * 2.6 + Math.sin(Math.min(1, kS) * Math.PI) * -0.25;
      const X = z => ox + z * s, Y = y => ob - y * s;
      b04_boardSec(X, Y, -10.5, 10.5, 1); b04_moduleSec(X, Y, s, 1);
      G.save(); G.beginPath(); G.rect(bx, by + 350, bw, bh - 350); G.clip(); G.translate(0, lift * s); b04_lensSec(X, Y, s, 1);
      /* its two dots, on the lens's legs, down to the pad */
      for (const zr of [K.ldots[0] - K.lens, K.ldots[1] - K.lens]) { b04_shape(() => rrPath(X(zr - 0.8), Y(B04S.up), 1.6 * s, Y(-4.38) - Y(B04S.up), 2), B04M.clear(), B04M.clearE(), 1.4, 1); b04_shape(() => rrPath(X(zr - 3.25), Y(-4.38), 6.5 * s, 0.65 * s, 3), C.hero, null, 0, 1); }
      G.restore();
      const kl = ep(t, 3.6, 4.1), lx = bx + 690;
      for (const [p, l, ly] of [[[X(-3.2), Y(0.67)], 'Module on the board', by + 418], [[X(6.0), Y(0.72)], 'Clipped round the chip', by + 456], [[X(2.5), Y(-2.2)], 'Lens, 5.2 mm wide', by + 540], [[X(K.ldots[0] - K.lens + 3.0), Y(-4.6)], 'A dot at each end', by + 590]]) {
        poly([[p[0], p[1]], [lx - 40, ly], [lx - 10, ly]], { color: inkA(0.3), w: 1.2, alpha: kl }); text(l, lx, ly + 7, { role: 'label', size: 22, color: l === 'Lens, 5.2 mm wide' || l === 'A dot at each end' || l === 'Clipped round the chip' ? C.heroText : C.ink2, alpha: kl });
      }
      if (kS > 0.02 && kS < 0.98) arrow(X(-12.5), Y(-6.5), X(-12.5), Y(-4.0), { color: C.ink2, w: 2.5, hs: 10, alpha: Math.sin(kS * Math.PI) });
      text('No base plate under it', bx + 690, by + 636, { role: 'label', size: 22, color: C.mute, alpha: ep(t, 3.8, 4.2) });
    }
    /* ---- right: the board each lens takes, from below, to scale ---- */
    const rx = 1120, rw = RM - rx;
    demoWindow(rx, by, rw, bh, 1);
    cardHead(t, 0, rx, by, rw, 'Board under the lens, to scale', []);
    { const sc = 11, base = by + 330, L = [['Round lens', 'PixArt LM19-LSI', 18.85, 21.15, C.comp, 0.5], ['Trim lens', 'PixArt L0AE-LSI1', 10.9, 16.8, C.second, 0.6], ['Snap-on lens', 'Theseus', 2 * K.hw, 2 * K.hl, C.hero, 0.6]];
      let x = rx + 44;
      L.forEach(([nm, who, w, h, col, al], i) => {
        const a = ep(t, 4.0 + i * 0.25, 4.5 + i * 0.25), W = w * sc, Hh = h * sc;
        rr(x, base - Hh, W, Hh, i === 0 ? Math.min(W, Hh) * 0.42 : i === 1 ? 14 : W / 2, rgba(col, al * 0.45), col, 2, a);
        text(nm, x, base + 38, { role: 'label', size: 22, color: i === 2 ? C.heroText : i === 1 ? C.secondText : C.mute, alpha: a });
        text(fmtN(w * h, 0) + ' mm²', x, base + 74, { role: 'small', size: 25, weight: 700, color: C.ink, alpha: a });
        x += W + 46;
      });
      verdict(t, 5.0, rx + 40, by + 548, { from: 10.9 * 16.8, to: 4 * K.hw * K.hl, unit: 'mm²', dec: 0, label: 'Board under the lens', better: 'lower', who: ['PixArt trim', 'Theseus'], size: 84 });
    }
    source(t, 'PixArt PAW3395 datasheet §3.5: "Place the lens onto the base plate"; "The optical position reference for the PCB is set by the base plate and lens. Note that the PCB motion due to button presses must be minimized to maintain optical alignment"; the top case must "press down onto the PCB". Outlines: PixArt (bounding boxes), the 3D board.', { t0: 0.8, maxW: RM - LM });
  }
});

/* ============================== 7. The PAW3970 ==============================
   Brock (sensor, 6/10): "says it's the 'suspected' sensor inside the viper v4 pro and that this is the plan, AFTER
   exclusivity expires"; F21.6: "the viper v4 pro is just a renamed PAW3970, razer only has exclusivity on it for 2 years
   ... it was the same process with razer viper mini signature edition sensor really just being a renamed 3950, use all
   of the viper v4 pro sensor specs". The pattern so far (the deck's validation report, an analogy): Razer's Focus+ became
   PixArt's PAW3395, its Focus Pro 30K the PAW3950; both now in 10 of the 35 mice in this deck's data. The third: the
   Viper V4 Pro's Focus Pro 50K Gen-3 (marked FP-3), suspected to be the PAW3970, Theseus's plan once Razer's exclusivity
   ends. Specs: the PAW3395's datasheet against Razer's figures for the V4 Pro's sensor. Razer's glass claim is tagged as
   Razer's, with the stalls owners and one reviewer report. Theme night. */
const B04SN = {
  rows: [['Tracking speed', 'ips', 650, 930, 'higher'], ['Acceleration', 'G', 50, 90, 'higher'], ['Highest CPI', 'cpi', 26000, 50000, 'higher'], ['CPI step', 'cpi', 50, 1, 'lower']]
};
/** a sensor package, drawn: a dark DIP body with its lens window and a few leads; label under it */
function b04_chip(x, y, w, h, col, a, mark) {
  if (a <= 0.003) return;
  for (let i = 0; i < 4; i++) { rect(x + 8 + i * (w - 16) / 3 - 2, y - 6, 4, 6, { fill: C.faint, alpha: a }); rect(x + 8 + i * (w - 16) / 3 - 2, y + h, 4, 6, { fill: C.faint, alpha: a }); }
  rr(x, y, w, h, 6, TH ? '#1F2023' : '#0B0C0E', col, 2, a);
  circle(x + w * 0.62, y + h / 2, Math.min(w, h) * 0.17, { fill: TH ? '#3A3B40' : '#2A2B30', color: col, w: 1.5, alpha: a });
  if (mark) text(mark, x + 10, y + h / 2 + 7, { role: 'label', size: 21, color: TH ? '#E6E6EA' : '#CECED2', alpha: a, caps: false });
}
S({
  id: 'b04_sensor', ch: 'glide', ideas: [76], theme: 'night', title: 'The PAW3970: the plan', settle: 10,
  replaces: ['sensor'],
  src: ['b04_paw3395', 'b04_razer', 'b04_igor', 'b04_brock', 'b04_pcgV4', 'b04_insider', 'b04_valid'],
  answers: [
    ['sensor: "says it\'s the \\"suspected\\" sensor inside the viper v4 pro"', 'On screen in those words: "suspected", under the Viper V4 Pro\'s Focus Pro 50K Gen-3 (FP-3) and again in the narration.'],
    ['sensor: "and that this is the plan, AFTER exclusivity expires"', 'The third row of the timeline ends in "Theseus\'s plan, after Razer\'s exclusivity (about two years)", drawn dashed until then; the narration says the same. The pattern before it (Focus+ → PAW3395, Focus Pro 30K → PAW3950) is shown as the reason, labelled an analogy.'],
    ['F21.6: "use all of the viper v4 pro sensor specs"', 'The spec rows use Razer\'s figures for the V4 Pro\'s sensor (930 ips, 90 G, 50,000 cpi in 1-cpi steps) against the PAW3395\'s datasheet; the verdict is tracking speed, 650 → 930 ips.']
  ],
  draw: t => {
    header(t, 'The PAW3970: the plan');
    captions(t, [[0.3, 'Razer gets PixArt\'s newest sensor first. Its Focus+ became PixArt\'s PAW3395, its Focus Pro 30K the PAW3950: between them, 20 of the 35 mice in this deck\'s data.'],
      [3.4, 'The Viper V4 Pro\'s sensor is suspected to be the next one, the PAW3970. Theseus plans on it once Razer\'s exclusivity ends, in about two years.'],
      [7.4, 'Razer says it tracks flawlessly on glass; a few owners and one reviewer report stalls on some glass pads. It goes in when it\'s sold to everyone.']]);
    const bx = LM, by = 280, bw = 900, bh = 660;
    demoWindow(bx, by, bw, bh, 1, { plain: true });
    text('Razer first', bx + 40, by + 52, { role: 'label', size: 22, color: C.mute }); text('Then PixArt, for everyone', bx + 520, by + 52, { role: 'label', size: 22, color: C.mute });
    const rows = [['Focus+', 'PixArt PAW3395', 'In 10 of 35 mice', 0.5, false], ['Focus Pro 30K', 'PixArt PAW3950', 'In 10 of 35 mice', 1.3, false], ['Focus Pro 50K Gen-3', 'PAW3970, suspected', 'Theseus\'s plan, after Razer\'s exclusivity', 2.3, true]];
    rows.forEach(([rz, px, note, t0, plan], i) => {
      const y = by + 110 + i * 170, a = 1, ka = ep(t, t0, t0 + 0.7, E.io3);
      b04_chip(bx + 40, y, 150, 74, plan ? C.ink2 : C.comp, a, '');
      text(rz, bx + 40, y + 112, { role: 'small', size: 25, weight: 700, color: C.ink, alpha: a });
      if (plan) text('In the Viper V4 Pro, marked FP-3', bx + 40, y + 144, { role: 'label', size: 22, color: C.mute });
      /* the arrow across: solid where it happened, dashed for the one to come */
      const ax0 = bx + 230, ax1 = bx + 500;
      if (ka > 0.003) { if (plan) poly([[ax0, y + 37], [lerp(ax0, ax1, ka), y + 37]], { color: C.hero, w: 3, dash: [10, 8] }); else arrow(ax0, y + 37, lerp(ax0, ax1, ka), y + 37, { color: C.ink2, w: 3, hs: 14 }); }
      if (plan && ka > 0.99) arrow(ax1 - 30, y + 37, ax1, y + 37, { color: C.hero, w: 3, hs: 14 });
      if (plan) text('About two years', (ax0 + ax1) / 2, y + 24, { role: 'label', size: 22, color: C.heroText, align: 'center', alpha: ep(t, t0 + 0.4, t0 + 0.8) });
      const kb = ep(t, t0 + 0.5, t0 + 0.9);
      b04_chip(bx + 520, y, 150, 74, plan ? C.hero : C.comp, kb, '');
      text(px, bx + 520, y + 112, { role: 'small', size: 25, weight: 700, color: plan ? C.heroText : C.ink, alpha: kb });
      text(note, bx + 520, y + 144, { role: 'label', size: 22, color: plan ? C.heroText : C.mute, alpha: kb, maxW: bw - 560 });
    });
    /* ---- right: what it brings, row by row: PixArt's datasheet for the PAW3395, Razer's figures for the V4 Pro's sensor ---- */
    const rx = 1020, rw = RM - rx;
    demoWindow(rx, by, rw, bh, 1);
    cardHead(t, 0, rx, by, rw, 'What it brings', [{ ev: 'datasheet', by: 'PixArt' }, { ev: 'claim', by: 'Razer' }]);
    const nf = v => v >= 10000 ? Math.round(v).toLocaleString('en-US') : fmtN(v, 0);
    B04SN.rows.forEach(([lab, unit, A, B, better], i) => {
      const y = by + 120 + i * 72, k = ep(t, 3.6 + i * 0.25, 4.4 + i * 0.25, E.io3), mx = Math.max(A, B), x0 = rx + 260, L = rw - 260 - 180;
      text(lab, rx + 32, y + 8, { role: 'label', size: 22, color: C.ink2 });
      rr(x0, y - 16, Math.max(6, L * A / mx), 12, 6, C.comp, null, 0, 1);
      rr(x0, y + 2, Math.max(6, L * lerp(A, B, k) / mx), 12, 6, C.hero, null, 0, 1);
      text(nf(A), x0 + Math.max(6, L * A / mx) + 10, y - 4, { role: 'num', size: 22, weight: 700, color: C.mute, tnum: true });
      const vx = x0 + Math.max(6, L * lerp(A, B, k) / mx) + 10, vw = text(nf(Math.round(lerp(A, B, k))) + ' ' + unit, vx, y + 16, { role: 'num', size: 24, weight: 800, color: C.heroText, tnum: true, caps: false }).w || 0;
      /* a row where the shorter bar wins says so on the row, beside its value (F14.10; R2-b04-4): a 1 cpi step is finer than 50 */
      if (better === 'lower') text('Finer is better', vx + vw + 16, y + 16, { role: 'label', size: 19, color: C.mute, alpha: k });
    });
    verdict(t, 5.2, rx + 36, by + 494, { from: 650, to: 930, unit: 'ips', dec: 0, label: 'Tracking speed', better: 'higher', who: ['PAW3395', 'PAW3970, planned'], size: 90 });
    source(t, 'PixArt PAW3395 datasheet (2022). Razer\'s figures for the Focus Pro 50K Gen-3 (igor\'sLAB) and its "tracks flawlessly on glass". Stalls on glass: PC Gamer 2026-05-22 (after a skate swap), Razer Insider 2026-10 (stock feet). PAW3970, two years: Brock. Focus+ → PAW3395, Focus Pro 30K → PAW3950: validation report (an analogy).', { t0: 0.8, maxW: RM - LM });
  }
});

/* ============================== 8. Full reports, no smoothing ==============================
   Brock (gld_reports, 3/10): "i don't understand what is being demonstrated this slide, it's a graphic but it's not a
   demonstration. i would have to understand it to know if the information is good or not". One plain demonstration: set
   the mouse down and flick, slowed 20×. XBAB (2026): the PAW3950 averages its last 16 frames for about 450 ms after every
   set-down; turning smoothing off leaves 2 frames; XBAB's corded test runs it at 20,000 frames a second (high-performance
   modes run under 8,000). A moving average of N frames runs (N − 1) / 2 frames behind: 7.5 frames, 0.375 ms, against 0.5
   frame, 0.025 ms. The flick: 10 cm in 100 ms, a smooth (minimum-jerk) stroke, peak 1.9 m/s; at 1,600 cpi, 63 counts a
   mm, one count a pixel. Two screens follow the hand at 1:1 pixels: the averaged cursor trails it by up to 44 px; Theseus's
   by 3. Theme paper. */
const B04R = { D: 100, T: 100, t0: 50, slow: 20, cpi: 1600, fps: 20000, nR: 16, nT: 2, tStart: 1.0, tAgain: 5.2 };
/** the flick's position (mm) and speed (mm/ms) at event time tau (ms after the set-down) */
function b04_flick(tau) { const R = B04R, s = clamp((tau - R.t0) / R.T); return { x: R.D * (10 * s ** 3 - 15 * s ** 4 + 6 * s ** 5), v: tau < R.t0 || tau > R.t0 + R.T ? 0 : R.D / R.T * (30 * s * s - 60 * s ** 3 + 30 * s ** 4) }; }
/** how far behind the hand an N-frame average puts the cursor at tau, in pixels at 1,600 cpi (the average of the last N
   frames' positions, exactly) */
function b04_lagPx(tau, N) { const R = B04R, ft = 1000 / R.fps; let s = 0; for (let i = 0; i < N; i++) s += b04_flick(tau - i * ft).x; return (b04_flick(tau).x - s / N) * R.cpi / 25.4; }
S({
  id: 'b04_reports', ch: 'glide', theme: 'paper', title: 'Every frame as it comes', settle: 11.5,
  replaces: ['gld_reports'],
  src: ['b04_xbab', 'b04_tpu', 'b04_valid'],
  answers: [
    ['gld_reports: "i don\'t understand what is being demonstrated this slide"', 'One demonstration: the mouse is set down and flicked, slowed 20 times; a timeline shows the 450 ms after the set-down in which the PAW3950 averages its frames, and two screens follow the hand at 1:1 pixels: the averaged cursor falls up to 44 px behind it at the flick\'s peak, Theseus\'s 3 px.'],
    ['gld_reports: "it\'s a graphic but it\'s not a demonstration"', 'The main visual is now the event in motion: the set-down, the flick, and the cursor trailing the hand on screen.'],
    ['gld_reports: "i would have to understand it to know if the information is good or not"', 'Every number sits on the event it describes, in plain words, with the test it comes from (XBAB, PAW3950, 16 frames for about 450 ms, at the test\'s 20,000 frames a second) and the arithmetic said (an average of 16 frames runs 7.5 frames behind).']
  ],
  draw: t => {
    header(t, 'Every frame as it comes');
    captions(t, [[0.3, 'Many sensors still smooth: for about 450 ms after every set-down, the PAW3950 averages its last 16 frames (XBAB, 2026). Set down, flick, slowed 20×.'],
      [2.7, 'The averaged cursor runs behind your hand, most at the flick\'s peak: 44 pixels at 1,600 cpi in XBAB\'s test, more than twice that in slower modes.'],
      [5.3, 'Theseus\'s firmware turns it off: two frames, the least the sensor allows, and full 16-bit counts. The same set-down and flick again; the test will be published.']]);
    const R = B04R, again = t >= R.tAgain, tau = Math.max(0, (t - (again ? R.tAgain : R.tStart)) * 1000 / R.slow), fl = b04_flick(tau), hi = again ? 1 : 0;
    /* ---- top: the 600 ms after the set-down, the smoothing window, the flick in it ---- */
    const bx = LM, by = 280, bw = 1120, bh = 250;
    demoWindow(bx, by, bw, bh, 1);
    cardHead(t, 0, bx, by, bw, 'After you set the mouse down', []);
    const tx0 = bx + 40, tx1 = bx + bw - 40, ty = by + 170, TX = ms => lerp(tx0, tx1, ms / 600);
    line(tx0, ty, tx1, ty, { color: C.faint, w: 2 });
    for (const ms of [0, 100, 200, 300, 400, 500, 600]) { line(TX(ms), ty, TX(ms), ty + 8, { color: C.faint, w: 1.5 }); text(ms + ' ms', TX(ms), ty + 34, { role: 'tick', size: 21, color: C.mute, align: ms === 0 ? 'left' : ms === 600 ? 'right' : 'center' }); }
    const kw = ep(t, 0.6, 1.2);
    rr(TX(0), ty - 52, (TX(450) - TX(0)) * kw, 18, 4, rgba(C.red, 0.75));
    text('PAW3950: 16 frames averaged, about 450 ms', TX(0) + 8, ty - 60, { role: 'label', size: 22, color: C.red, alpha: kw });
    rr(TX(0), ty - 26, 6, 18, 2, C.hero, null, 0, ep(t, 5.3, 5.7));
    text('Theseus: 2 frames', TX(0) + 16, ty - 11, { role: 'label', size: 22, color: C.heroText, alpha: ep(t, 5.3, 5.7) });
    /* the flick on the timeline, and the playhead */
    rr(TX(R.t0), ty - 4, TX(R.t0 + R.T) - TX(R.t0), 8, 4, C.ink2, null, 0, ep(t, 1.4, 1.8));
    text('The flick', TX(R.t0 + R.T) + 12, ty + 64, { role: 'label', size: 22, color: C.ink2, alpha: ep(t, 1.4, 1.8) });
    const ph = TX(Math.min(600, tau));
    if (t > R.tStart) { line(ph, ty - 70, ph, ty + 10, { color: C.ink, w: 2.5 }); circle(ph, ty, 6, { fill: C.ink }); }
    text('Set down', TX(0), ty + 64, { role: 'label', size: 22, color: C.mute });
    /* ---- the verdict, beside the timeline ---- */
    const peak = b04_lagPx(R.t0 + R.T / 2, R.nR), peakT = b04_lagPx(R.t0 + R.T / 2, R.nT);
    verdict(t, 8.4, 1250, by + 166, { from: peak, to: peakT, unit: 'px', dec: 0, label: 'Behind your hand at the peak', better: 'lower', who: ['PAW3950', 'Theseus'], size: 80 });
    /* ---- bottom: two screens following the hand at 1:1 pixels ---- */
    const sy = 556, sh = 384, sw = (RM - LM - 40) / 2;
    [[LM, 'Averaged: 16 frames (PAW3950, XBAB\'s test)', R.nR, C.red], [LM + sw + 40, 'Theseus: 2 frames', R.nT, C.hero]].forEach(([x, lab, N, col], i) => {
      const a = i === 0 ? 1 : ep(t, 5.3, 5.8);
      demoWindow(x, sy, sw, sh, 1);
      text(lab, x + 32, sy + 46, { role: 'label', size: 22, color: i === 0 ? C.red : C.heroText, alpha: i === 0 ? 1 : Math.max(0.35, a) });
      const scx = x + 32, scy = sy + 70, scw = sw - 64, sch = sh - 150, cx = scx + scw / 2, cy = scy + sch / 2;
      rr(scx, scy, scw, sch, 10, TH ? '#1E1F22' : '#0A0A0C');
      /* the game's world sliding past as the hand turns: a wall of panels, 1:1 pixels, the view centred on the hand */
      const px = fl.x * R.cpi / 25.4;
      clipped(scx, scy, scw, sch, () => {
        const sp = 120, off = ((-px % sp) + sp) % sp;
        for (let xx = scx - sp + off; xx < scx + scw + sp; xx += sp) { rect(xx, scy + 40, 4, sch - 80, { fill: 'rgba(255,255,255,0.10)' }); }
        rect(scx, cy + 50, scw, 3, { fill: 'rgba(255,255,255,0.08)' });
      });
      /* where the hand is (a ring) and the cursor the game draws (a crosshair) */
      const lag = b04_lagPx(tau, N), ccx = cx - lag;
      circle(cx, cy, 22, { color: 'rgba(255,255,255,0.55)', w: 2 });
      const ca = i === 0 ? 1 : Math.max(0.35, a), cc = i === 0 ? '#FF6B6B' : '#7AB8FF';
      for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) line(ccx + dx * 6, cy + dy * 6, ccx + dx * 18, cy + dy * 18, { color: cc, w: 3, alpha: ca });
      if (lag > 1.5) { line(ccx, cy - 34, cx, cy - 34, { color: cc, w: 2, alpha: ca }); }
      text('Your hand', cx, cy + 48, { role: 'label', size: 22, color: '#CECED2', align: 'center' });
      /* the readout: live while the flick rises, then the most it fell behind, held big (R2-b04-5: the settled frame shows
         the two peaks, 44 against 3, not two live zeros). The averaged screen keeps its peak through Theseus's replay */
      const mid = R.t0 + R.T / 2, held = i === 0 ? again || tau > mid : again && tau > mid, show = held ? b04_lagPx(mid, N) : Math.abs(lag);
      rich([{ s: fmtN(show, 0), role: 'd1', size: 48, weight: 800, color: i === 0 ? C.red : C.heroText, tnum: true }, { s: held ? 'px behind, at the peak' : 'px behind', role: 'small', size: 24, weight: 600, color: C.mute, gap: 10, sentence: false }], x + 32, sy + sh - 30, { alpha: i === 0 ? 1 : Math.max(0.35, a) });
    });
    source(t, 'XBAB (qsxcv), 2026: the PAW3950 averages 16 frames for about 450 ms after every set-down, 2 with smoothing off; tested at 20,000 frames a second (high-performance modes run under 8,000). Derived: an N-frame average runs (N − 1) / 2 frames behind; a 10 cm flick in 100 ms at 1,600 cpi. Slowed 20×. V4 Pro wireless: 12-bit counts (TechPowerUp).', { t0: 0.8, maxW: RM - LM });
  }
});

/** a phone, its camera too close to a page: the screen shows the same cloth, blurred by r px */
function b04_phone(x, y, w, h, r, a, u) {
  if (a <= 0.003) return;
  rr(x, y, w, h, 16, TH ? '#1A1B1E' : '#2A2B2F', null, 0, a);
  const sw = w - 12, sh = h - 12, cv = b04_clothCv('phone', sw, sh, sw / 1.3, u - 0.65, 1.4);
  b04_blit(cv, x + 6, y + 6, sw, sh, r, a, { r: 11 });
  rr(x + w / 2 - 14, y + 11, 28, 7, 3.5, '#0B0B0D', null, 0, a);
}
