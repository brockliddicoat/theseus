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
  b04_dempster: { t: 'Dempster\'s segment masses (as used by Visual3D): the hand is 0.006 of body mass, so 0.48 kg (4.7 N) for an 80 kg adult', u: 'https://wiki.has-motion.com/Segment_Mass' },
  b04_zk: { t: 'Zaunkoenig, "M1K weight in review": the PMW3360\'s lens weighed 0.8 g, more than the sensor (0.6 g)', u: 'https://zaunkoenig.co/blog/m1k-weight-in-review' },
  b04_tpuUlx: { t: 'TechPowerUp, Finalmouse UltralightX review: the rear screws sit under the rear skates', u: 'https://www.techpowerup.com/review/finalmouse-ultralightx/' },
  b04_brock: { t: 'Brock Liddicoat, "In Pursuit of an Objectively Better Mouse": #8 POM skates, PTFE in the box; #10 two dots a corner ("with only 1 dot per corner some softer pads cause the dots to sink in too much and the pad to scrape the bottom of the mouse"); #37 "a lens that only supports a single dot skate"; #52 screws not under the skates; #76 "The PAW 3395 can struggle on certain glass pads"; "0.65mm is the optimal skate height"; review notes F2.02 ("the sensors window to focus is actually only 0.2mm optimally"), F9.20, F20.2, F21.6', u: '' },
  b04_model: { t: 'This deck\'s pad model (b04_sag): a rigid mouse on its skates, pressed into a soft cloth pad (a Pasternak foundation: 4 mm of foam, the cloth dragged down within about 2 mm of each skate), set so one dot a corner reaches the base (0.65 mm) under a firm 10 N press (Brock, #10); pressed with the hand\'s weight, 5 N, on the hump. The 3D shell\'s skates, plan 5\'s lens. Solved on a 0.5 mm grid (handoff work/b04/model).', u: '' },
  b04_r3d: { t: 'This deck\'s 3D board (3d/, scene pcb) and skate sets (3d/parts/skates.js): the castellated module 8.4 × 9.8 × 0.62 mm, 16 castellations at 1.2 mm; the snap-on lens, 5.2 mm wide and 14.2 mm across its clips, an imaging lens 2.84 mm across and a light lens 2.0 mm; its two dots at +6.3 and −6.7 mm; the dot, 6.5 mm and 0.65 mm tall (glide 0.38, tape, PORON 0.17, tape)', u: '' }
});

/* ---------- where the lens is ----------
   H1 moves the sensor forward on plan 5's board: the module's centre from mouse z 1.12 to 16.57 mm (lens clip slots 6 mm
   either side of it). The kit reads the lens from the 3D shell's flat twin (msLive); when that is built in, it wins. The
   imaging lens sits 1.1 mm ahead of the module's centre; the clip-on lens carries a dot 6.3 mm ahead and 6.7 mm behind. */
const B04 = { lensZ: 16.57, axis: 1.1, ldots: [6.3, -6.7], dot: 6.5, stack: 0.65, Z: 2.4 };
function b04_lensZ() {
  try { if (typeof msLive === 'function') { const v = msLive(); if (v && v.lens) return (v.lens[2] + v.lens[5]) / 2; } } catch (e) { }
  return B04.lensZ;
}

/* ---------- the cloth, drawn ----------
   A plain weave: warp yarns along v, weft yarns along u, 0.32 mm apart, over one and under one. Seen from above every
   crossing shows the yarn on top as a short capsule, so the cloth reads as a checker of capsules turned alternately: the
   look of a cloth pad, drawn flat in two greys with crisp edges (no lighting, no photo texture). Each yarn is a little
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
   From work/b04/model/sag_final.py (the source b04_model says how): a rigid mouse on its skates, pressed into a soft
   cloth pad, solved on a 0.5 mm grid. For each skate set, at the demonstration press (the hand's weight, 5 N, on the hump):
   c, the mouse's rigid sink (mm) = c0 + c1·x + c2·z at any point (x across, z along, the 3D shell's frame, + toward the
   nose); dip, how far the cloth under the imaging axis is pressed down by skates near it; gap, the lens's drop toward the
   cloth under it (sink at the lens − dip); area of skate (mm²); grams of the 0.65 mm stack (POM dots, PTFE pads).
   The model is linear: a lighter press scales every number by its share of 5 N. */
const B04SAG = {
  press: 5, lam: 2.0, foamE: 0.193, lensZ: 16.57, axisZ: 17.67, zPress: -20,
  corners: { c: [0.17451, 0.000108, -0.001684], dip: 0, gap: 0.1448, area: 266, g: 0.184 },
  theseus: { c: [0.14432, 0.000095, -0.001915], dip: 0.0352, gap: 0.0753, area: 332, g: 0.231 },
  v4pads: { c: [0.04367, 0, -0.000618], dip: 0.0003, gap: 0.0324, area: 1980, g: 1.931 },
  v4ring: { c: [0.04115, 0, -0.000641], dip: 0.0124, gap: 0.0174, area: 2089, g: 2.037 },
  /* skates far from the lens, growing from the eight corner dots toward V4 Pro-size pads (k 0 to 1): area (mm²), the
     lens's drop (mm), the weight in the same stack with PTFE (g) */
  sweep: [[0, 266, 0.1448, 0.259], [0.125, 568, 0.0856, 0.554], [0.25, 691, 0.0765, 0.674], [0.375, 860, 0.0665, 0.839], [0.5, 1014, 0.0593, 0.989], [0.625, 1213, 0.0519, 1.183], [0.75, 1443, 0.0444, 1.407], [0.875, 1691, 0.0382, 1.649], [1, 2011, 0.0321, 1.961]]
};
/** the sweep at k: [area, gap, grams], interpolated */
function b04_sweepAt(k) { const S = B04SAG.sweep; k = clamp(k); for (let i = 1; i < S.length; i++) if (k <= S[i][0]) { const u = (k - S[i - 1][0]) / (S[i][0] - S[i - 1][0]); return [lerp(S[i - 1][1], S[i][1], u), lerp(S[i - 1][2], S[i][2], u), lerp(S[i - 1][3], S[i][3], u)]; } return S[S.length - 1].slice(1); }

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
const B04ZK = [[0, 2.4], [6.4, 2.4], [7.2, 2.8], [7.9, 2.8], [8.8, 2.0], [9.5, 2.0], [10.2, 2.4]];
const b04_camZ = t => kf(t, B04ZK, E.io3);
S({
  id: 'b04_camera', ch: 'glide', theme: 'paper', title: 'Your sensor is a camera', settle: 11.5,
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
      [6.3, 'Drag the lens too far or too close and the picture blurs, as a phone\'s camera does at the wrong distance. The count changes with it.'],
      [10.2, 'Every count rests on a sharp picture, taken from the right height.']]);
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
      if (t > 5.9) {
        const grab = [P.X(7.6), P.Y(-0.5)], drag = t > 6.4 && t < 10.2;
        cursorAt(t, [[5.9, [grab[0] + 70, grab[1] - 70]], [6.35, grab], [11.5, grab]], [6.4], { grab: drag, a: ep(t, 5.9, 6.2) * (1 - ep(t, 10.5, 10.9)) });
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
      const tx = vx + vsz + 40, kt1 = ep(t, 2.6, 3.0), kt2 = ep(t, 3.1, 3.5), kb = ep(t, 6.2, 6.7), kb2 = 1 - kb;
      text('About 1 mm of cloth', tx, vyy + 22, { role: 'label', size: 22, color: C.mute, alpha: kt1 });
      text(kpx < 0.5 ? 'As the lens sees it' : '36 × 36 pixels', tx, vyy + 56, { role: 'small', size: 25, weight: 600, color: C.ink2, alpha: kt1, maxW: 230 });
      if (kb2 > 0.003) {
        rich([{ s: '12,000', role: 'd1', size: 72, weight: 800, color: C.ink, tnum: true, count: [3.2, 1.0] }], tx - 4, vyy + 160, { t, alpha: kt2 * kb2 });
        text('Pictures a second', tx, vyy + 196, { role: 'small', size: 25, weight: 600, color: C.ink2, alpha: kt2 * kb2 });
        pill(tx, vyy + 230, 'datasheet', kt2 * kb2, { by: 'PMW3360' });
      }
      if (kb > 0.003) {
        const det = Math.round(b04_sharp(F) / sharp0 * 100), inF = Math.abs(dz) <= 0.1 + 1e-6;
        text('Detail kept', tx, vyy + 100, { role: 'label', size: 22, color: C.mute, alpha: kb });
        rich([{ s: String(Math.min(100, det)), role: 'd1', size: 64, weight: 800, color: inF ? C.ink : C.red, tnum: true }, { s: '%', font: 'disp', size: 34, weight: 800, color: inF ? C.ink : C.red, gap: 4 }], tx - 3, vyy + 166, { alpha: kb });
        /* the phone: its camera too close to a page, its screen the same cloth, blurred as much */
        const phx = RM - 40 - 96, phy = vyy - 8, phw = 96, phh = 168;
        b04_phone(phx, phy, phw, phh, op.rmm / fieldMM * (phw - 12) * 1.6, kb, u);
        text('A phone', phx + phw / 2, phy + phh + 28, { role: 'label', size: 22, color: C.mute, align: 'center', alpha: kb });
        text(inF ? 'in focus' : dz > 0 ? 'too far' : 'too close', phx + phw / 2, phy + phh + 54, { role: 'label', size: 22, color: inF ? C.mute : C.red, align: 'center', alpha: kb });
        /* once the lens is back, what the two wrong heights cost stays on screen (F16.1) */
        const km = ep(t, 10.2, 10.7);
        if (km > 0.003) { const dAt = zz => { const tt = zz > B04.Z ? 7.55 : 9.15, ci = 1 + Math.floor((tt - B04C.t0) / B04C.cap), uu = B04C.u0 + B04C.vel * B04C.cap * (ci - 1); return Math.round(b04_sharp(b04_frame(uu, B04C.v0, zz, ci)) / b04_sharp(b04_frame(uu, B04C.v0, B04.Z, ci)) * 100); }; text('At 2.8 mm ' + dAt(2.8) + '%', tx, vyy + 202, { role: 'small', size: 24, weight: 700, color: C.red, alpha: km * kb }); text('At 2.0 mm ' + dAt(2.0) + '%', tx, vyy + 230, { role: 'small', size: 24, weight: 700, color: C.red, alpha: km * kb }); }
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
          /* the same move, counted short or long: the true count struck beside it (F16.1) */
          const net = Math.round((cnt / cnt0 - 1) * 100);
          rich([{ s: fmtN(cnt0, 1), font: 'disp', size: 30, weight: 800, color: C.faint, tnum: true }, { s: '→', font: 'sans', size: 26, weight: 700, color: C.faint, gap: 10 }, { s: fmtN(cnt, 1), font: 'disp', size: 52, weight: 800, color: C.red, gap: 10, tnum: true }], mx, fy + 156, { alpha: kfd });
          line(mx - 2, fy + 145, mx + tw(fmtN(cnt0, 1), { font: 'disp', size: 30, weight: 800 }) + 2, fy + 145, { color: C.faint, w: 2.5, alpha: kfd });
          text((net > 0 ? '+' : '−') + Math.abs(net) + '% for the same move', mx, fy + 192, { role: 'small', size: 24, weight: 700, color: C.red, alpha: kfd });
        } else {
          const km = ep(t, 10.2, 10.7), pc = zz => { const v = Math.round((b04_shiftAt(zz) / b04_shiftAt(B04.Z) - 1) * 100); return (v > 0 ? '+' : '−') + Math.abs(v) + '%'; };
          if (km > 0.003) { text('At 2.8 mm ' + pc(2.8), mx, fy + 184, { role: 'small', size: 24, weight: 700, color: C.red, alpha: km * kfd }); text('At 2.0 mm ' + pc(2.0), mx, fy + 214, { role: 'small', size: 24, weight: 700, color: C.red, alpha: km * kfd }); }
          else text('At 1,600 CPI', mx, fy + 192, { role: 'label', size: 22, color: C.faint, alpha: kfd });
        }
      }
    }
    source(t, 'PixArt PMW3360: up to 12,000 frames a second, 36 × 36 pixels, a 1:1 lens 2.4 mm over the pad; PAW3395: an 850 nm LED. ADNS-2610: "sequential surface images (frames)". Derived, a thin lens at 1:1: blur one pixel at the datasheets\' ±0.2 mm depth of field; detail kept, the fine contrast left; counts at the chip\'s fixed scale. Slowed for the eye.', { t0: 2.0, maxW: RM - LM });
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
