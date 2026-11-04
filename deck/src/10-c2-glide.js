/* ============================================================================================
   chapter 02, glide and tracking, part two: the sensor is a camera, and its lens has a 0.2 mm window.
   gld_camera (LED, snap-on lens, image sensor, in section; the pad up close; one frame) · gld_corr (frame correlation:
   two pictures become a count) · gld_blur (defocus, the way a phone camera blurs too close) · focus (Brock's 0.2 mm
   window against the 0.4 mm most makers design to) · gld_sag (dots at the lens keep the base from sagging out of the
   window) · gld_module (the castellated module and the snap-on lens, drawn from Brock's photos and the 3D board).
   Everything here is computed, not drawn to look right: a procedural cloth (yarns, twisted filaments, stray fibres,
   dust) evaluated at the resolution it is shown at, a thin lens whose circle of confusion sets a disc blur, the
   sensor's 36 × 36 frame, a feature count, a sum-of-differences search for the shift, and a 2D beam for the sag.
   ============================================================================================ */
Object.assign(SRC, {
  gld_adns2610: { t: 'Agilent ADNS-2610 datasheet: the sensor "measures changes in position by optically acquiring sequential surface images (frames) and mathematically determining the direction and magnitude of movement"; 1,500 frames/s; 18 × 18 pixels; Z, lens reference plane to surface, 2.3 min, 2.4 typ, 2.5 max mm, "results in ±0.2 mm DOF"; SQUAL counts the features in the current frame', u: 'https://fab.cba.mit.edu/classes/863.09/people/labrune/files/camera/ADNS2610.pdf' },
  gld_adns3080: { t: 'Avago ADNS-3080 datasheet: 30 × 30 pixels; up to 6,469 frames/s; Z 2.3 to 2.5 mm, "results in ±0.2 mm DOF"; "SQUAL is typically maximized when the navigation surface is at the optimum distance from the imaging lens"', u: 'https://dtsheet.com/doc/729170/avago-adns-3080' },
  gld_pmw3360: { t: 'PixArt PMW3360DM-T2QU datasheet: up to 12,000 frames/s; a frame of 1,296 raw values (36 × 36); 250 ips, 50 g; lens 1:1; Z 2.2 / 2.4 / 2.6 mm; "Lift detection height = nominal height + 2 mm (default value)"', u: 'https://datasheet.lcsc.com/datasheet/pdf/c018c3e1d470821feefadd37e2f785d5.pdf?productCode=C20612443' },
  gld_paw3395o: { t: 'PixArt PAW3395DM-T6QU datasheet v1.2: 850 nm IR LED; lens 1:1; Z from the lens reference plane to the surface 2.2 min, 2.4 typ, 2.6 max mm; a self-adjusting frame rate with no number given; no pixel count given; "place mouse feet around the base plate opening to stabilize mouse tracking"', u: 'https://atta.szlcsc.com/upload/public/pdf/source/20251201/5A54B75DA77586FABF8CEFBD8F21947D.pdf' },
  gld_apple2cm: { t: 'Apple Newsroom, 25 Jan 2022: iPhone 13 Pro macro photography, "a minimum focus distance of 2 centimeters"', u: 'https://www.apple.com/newsroom/2022/01/share-your-best-iphone-macro-photos-for-apples-shot-on-iphone-challenge/' },
  gld_zowie: { t: 'ZOWIE FAQ: the original skates are "approximately 0.5 mm thick"; "lag or tracking issues may occur if the new skates are thicker than the original ones", because "the sensor height may change"', u: 'https://zowie.benq.eu/en-eu/support/faq/product/explanation/zowiegear-faq-kn-00024.html' },
  gld_pcgV4: { t: 'PC Gamer (Jacob Fox, 22 May 2026): after the reviewer Spec0 swapped the Razer Viper V4 Pro\'s stock skates for dot skates, the mouse was "unusable on multiple glasspads"; Razer replaced it and said it would "look into this sensor issue"', u: 'https://pcgamer.com/hardware/gaming-mice/replacing-the-viper-v4-pros-skates-gave-one-reviewer-some-razer-warranty-trouble-after-glass-pad-sensor-issues' },
  gld_brock02: { t: 'Brock Liddicoat, review notes 2026-11-04: "the sensors window to focus is actually only 0.2mm optimally", while "most manufacturers only optimize for 0.4mm which can lead to issues"; "one or 2 dot skates by the sensor to prevent sag and keeping the sensor focused correctly"', u: '' },
  gld_r3dSensor: { t: 'This deck\'s 3D board (3d/, scene pcb), modelled from Brock\'s photos: a castellated sensor module 8.4 × 9.8 × 0.62 mm, 16 castellations at 1.2 mm pitch; a snap-on lens, body 5.2 × 9.6 mm, 14.2 mm across its clips, an imaging lens 2.84 mm wide and a light lens 2.0 mm wide', u: '' }
});

/* ---------- the pad: a plain-weave cloth, computed where it is drawn ----------
   Brock (F14.4): the old pad picture "feels really low quality and uncanny". This one is a height field in mm, evaluated
   at the resolution it is drawn at, so it is crisp at any size: warp and weft yarns 0.32 mm apart going over and under
   each other, each a bundle of filaments twisted at about 20°, a few stray fibres lying across them and specks of dust.
   It is lit from the left at a low angle, the way the sensor's LED lights it, with the shadows the yarns throw. It
   repeats every 16 yarns (5.12 mm), so the sensor's frames can wrap round it. */
const GLDW = (function () {
  const N = 16, p = 0.32, R = rng(20261104);
  const yarn = () => ({ dx: (R() - 0.5) * 0.02, hw: 0.142 + (R() - 0.5) * 0.014, hy: 0.072 * (0.9 + R() * 0.2), al: 0.84 + R() * 0.22, ph: R(), ph2: R() * TAU, ph3: R() * TAU });
  const warp = [], weft = [];
  for (let k = 0; k < N; k++) { warp.push(yarn()); weft.push(yarn()); }
  const st = [];
  /* stray fibres: thin, lying across the yarns */
  for (let k = 0; k < 10; k++) {
    let u = R() * 5.12, v = R() * 5.12, a = R() * TAU; const L = 0.5 + R() * 1.4, r = 0.0045 + R() * 0.0025, al = 1.0 + R() * 0.25;
    for (let s = 0; s < L; s += 0.0025) { a += (R() - 0.5) * 0.045; u += Math.cos(a) * 0.0025; v += Math.sin(a) * 0.0025; st.push(u, v, r, 0.014, al); }
  }
  /* dust and lint: small irregular clusters, some dark, some bright */
  for (let k = 0; k < 40; k++) {
    const u = R() * 5.12, v = R() * 5.12, dark = R() < 0.5, n = 2 + Math.floor(R() * 4);
    for (let j = 0; j < n; j++) st.push(u + (R() - 0.5) * 0.024, v + (R() - 0.5) * 0.024, 0.004 + R() * 0.008, dark ? 0.003 : 0.012, dark ? 0.32 : 1.2);
  }
  return { N, p, P: N * p, warp, weft, st: Float32Array.from(st), B: 0.034, nF: 18, tw: 0.08, lo: 0.02, hi: 0.92 };
})();
/** the relief across a yarn: filaments about 15 µm apart twisted 11° off the yarn's axis, wandering a little, over five
   looser bundles about 50 µm apart. a = across the yarn (−1..1), s = along it (mm); kR, kC fade each where a pixel is too coarse */
function gld_fib(a, s, y, kR, kC) {
  const ph = a * GLDW.nF * 0.5 + s / GLDW.tw + y.ph + 0.35 * Math.sin(TAU * (a * 1.7 + s / 0.64) + y.ph2);
  return 0.0022 * kR * Math.sin(TAU * ph) * (0.65 + 0.35 * Math.sin(TAU * s / 0.32 + a * 2 + y.ph3)) + 0.0026 * kC * Math.sin(TAU * (a * 2.5 + s / 0.32 + y.ph * 0.5));
}
/** the cloth's height (mm) and albedo at (u, v) mm into out; kR, kC (0..1) fade the filaments and bundles where a pixel is too coarse */
function gld_weaveAt(u, v, kR, out, kC = 1) {
  const W = GLDW, p = W.p, N = W.N, B = W.B;
  let h = -0.16, al = 0.22;
  const i0 = Math.floor(u / p - 0.5);
  for (let i = i0; i <= i0 + 1; i++) {                               /* warp yarns, along v */
    const y = W.warp[((i % N) + N) % N], cx = (i + 0.5) * p + y.dx + 0.006 * Math.sin(TAU * v / 1.28 + y.ph2), a = (u - cx) / y.hw;
    if (a <= -1 || a >= 1) continue;
    const q = Math.sqrt(1 - a * a);
    let z = y.hy * Math.min(1, 1.12 * q) * (1 + 0.06 * Math.sin(TAU * v / 2.56 + y.ph3)) + B * Math.cos(Math.PI * (v / p - 0.5 + i));
    if (kC > 0) z += q * gld_fib(a, v, y, kR, kC);
    if (z > h) { h = z; al = y.al * (0.86 + 0.14 * q); }
  }
  const j0 = Math.floor(v / p - 0.5);
  for (let j = j0; j <= j0 + 1; j++) {                               /* weft yarns, along u */
    const y = W.weft[((j % N) + N) % N], cy = (j + 0.5) * p + y.dx + 0.006 * Math.sin(TAU * u / 1.28 + y.ph2), a = (v - cy) / y.hw;
    if (a <= -1 || a >= 1) continue;
    const q = Math.sqrt(1 - a * a);
    let z = y.hy * Math.min(1, 1.12 * q) * (1 + 0.06 * Math.sin(TAU * u / 2.56 + y.ph3)) - B * Math.cos(Math.PI * (u / p - 0.5 + j));
    if (kC > 0) z += q * gld_fib(a, u, y, kR, kC);
    if (z > h) { h = z; al = y.al * (0.86 + 0.14 * q); }
  }
  out[0] = h; out[1] = al;
}
/** the cloth on a grid: w × h pixels of mmpp mm, pixel (i, j) centred on (u0 + (i + 0.5)·mmpp, v0 + (j + 0.5)·mmpp). { H, A } */
function gld_field(w, h, mmpp, u0, v0) {
  const H = new Float32Array(w * h), A = new Float32Array(w * h), Fb = new Float32Array(w * h), o = [0, 0], kR = clamp(1.5 - 1.5 * mmpp / 0.006), kC = clamp(1.5 - 1.5 * mmpp / 0.016);
  for (let j = 0; j < h; j++) { const v = v0 + (j + 0.5) * mmpp, r0 = j * w; for (let i = 0; i < w; i++) { gld_weaveAt(u0 + (i + 0.5) * mmpp, v, kR, o, kC); H[r0 + i] = o[0]; A[r0 + i] = o[1]; } }
  /* fibres and dust, stamped at this resolution (they repeat with the weave) on a layer of their own, so overlapping stamps don't stack */
  const S = GLDW.st, P = GLDW.P, u1 = u0 + w * mmpp, v1 = v0 + h * mmpp;
  for (let k = 0; k < S.length; k += 5) {
    const r = Math.max(S[k + 2], mmpp * 0.6), dh = S[k + 3], al = S[k + 4];
    for (let ou = Math.floor((u0 - r - S[k]) / P); ou <= Math.floor((u1 + r - S[k]) / P); ou++) for (let ov = Math.floor((v0 - r - S[k + 1]) / P); ov <= Math.floor((v1 + r - S[k + 1]) / P); ov++) {
      const cu = S[k] + ou * P, cv = S[k + 1] + ov * P;
      const ia = Math.max(0, Math.floor((cu - r - u0) / mmpp)), ib = Math.min(w - 1, Math.floor((cu + r - u0) / mmpp)), ja = Math.max(0, Math.floor((cv - r - v0) / mmpp)), jb = Math.min(h - 1, Math.floor((cv + r - v0) / mmpp));
      for (let j = ja; j <= jb; j++) for (let i = ia; i <= ib; i++) {
        const du = u0 + (i + 0.5) * mmpp - cu, dv = v0 + (j + 0.5) * mmpp - cv, d2 = (du * du + dv * dv) / (r * r); if (d2 >= 1) continue;
        const q = Math.sqrt(1 - d2), idx = j * w + i, f = dh * q;
        if (f > Fb[idx]) { Fb[idx] = f; A[idx] = lerp(A[idx], al, Math.min(1, q * 1.6)); }
      }
    }
  }
  for (let i = 0; i < w * h; i++) H[i] += Fb[i];
  return { H, A };
}
/** light the cloth: from the left, el degrees above the pad, with the shadows the yarns throw (wrap: the field is one period,
   so the shadows run round it). Brightness on the deck's fixed scale (GLDW.lo..hi → 0..1) */
function gld_shade(F, w, h, mmpp, o = {}) {
  const Hh = F.H, A = F.A, el = (o.el || 34) * Math.PI / 180, ta = Math.tan(el) * mmpp, I = new Float32Array(w * h);
  let Lx = -Math.cos(el) * 0.95, Ly = -Math.cos(el) * 0.31, Lz = Math.sin(el); { const n = Math.hypot(Lx, Ly, Lz); Lx /= n; Ly /= n; Lz /= n; }
  let Hx = Lx, Hy = Ly, Hz = Lz + 1; { const n = Math.hypot(Hx, Hy, Hz); Hx /= n; Hy /= n; Hz /= n; }
  const wr = !!o.wrap, lo = GLDW.lo, sc = 1 / (GLDW.hi - GLDW.lo), i2 = 1 / (2 * mmpp);
  for (let j = 0; j < h; j++) {
    const ju = (wr ? (j - 1 + h) % h : Math.max(0, j - 1)) * w, jd = (wr ? (j + 1) % h : Math.min(h - 1, j + 1)) * w, jr = j * w;
    let hor = -1e9;
    for (let pass = wr ? 0 : 1; pass < 2; pass++) for (let i = 0; i < w; i++) {
      const h0 = Hh[jr + i];
      if (pass) {
        const il = wr ? (i - 1 + w) % w : Math.max(0, i - 1), ir = wr ? (i + 1) % w : Math.min(w - 1, i + 1);
        const gx = (Hh[jr + ir] - Hh[jr + il]) * i2, gy = (Hh[jd + i] - Hh[ju + i]) * i2, nl = 1 / Math.sqrt(1 + gx * gx + gy * gy);
        const nx = -gx * nl, ny = -gy * nl, nz = nl, dif = Math.max(0, nx * Lx + ny * Ly + nz * Lz), sp = Math.max(0, nx * Hx + ny * Hy + nz * Hz);
        const sh = clamp(1 - (hor - h0) / 0.01), ao = clamp((h0 + 0.1) / 0.2), s2 = sp * sp, s4 = s2 * s2, s8 = s4 * s4, s32 = s8 * s8 * s8 * s8;
        I[jr + i] = clamp(((A[jr + i] * (0.07 + 0.93 * dif * (0.3 + 0.7 * sh)) * (0.35 + 0.65 * ao) + 0.3 * s32 * sh) - lo) * sc);
      }
      hor = Math.max(hor - ta, h0);
    }
  }
  return I;
}
/** a w × h picture of the cloth at mmpp, its top left at (u0, v0) mm: rendered with a margin on the lit side so shadows reach in */
function gld_padPic(w, h, mmpp, u0, v0) {
  const mL = Math.min(160, Math.ceil(0.25 / mmpp)), W2 = w + mL, I = gld_shade(gld_field(W2, h, mmpp, u0 - mL * mmpp, v0), W2, h, mmpp), out = new Float32Array(w * h);
  for (let j = 0; j < h; j++) out.set(I.subarray(j * W2 + mL, j * W2 + mL + w), j * w);
  return out;
}
/** the sensor's texture: one period of the cloth at 10 µm a texel (512 × 512), wrapping, for the frames and the focus curve */
const GLDP = { N: 512, mm: 0.010, tex: null, cache: new Map(), curve: null };
function gld_tex() {
  if (!GLDP.tex) GLDP.tex = gld_shade(gld_field(512, 512, 0.010, 0, 0), 512, 512, 0.010, { wrap: true });
  return GLDP.tex;
}

/* ---------- optics: a thin lens at the lens reference plane ----------
   PixArt gives the lens as 1:1 at Z = 2.4 mm (PAW3395, PMW3360), so u = v = 2.4 mm and f = 1.2 mm; the die sits at v0 =
   2.4 mm. A pad at z images to v = 1 / (1/f − 1/z); the cone of light from one point of the pad meets the die as a disc,
   the circle of confusion, c = A·|v − v0| / v. The aperture A is the one free number: it is set so c reaches one pixel
   (30 µm, the PMW3360's pitch of 36 × 36 over its array, a model value) 0.1 mm either side of focus, Brock's window. Referred
   back to the pad (÷ m), half of c is the radius of the disc the pad's picture is blurred with. */
const GLDO = { f: 1.2, v0: 2.4, z0: 2.4, A: 0.72, pix: 0.030, n: 36 };
function gld_optics(z) {
  const u = Math.max(1.25, z), v = 1 / (1 / GLDO.f - 1 / u), c = GLDO.A * Math.abs(v - GLDO.v0) / v, m = GLDO.v0 / u;
  return { u, v, c, m, cpx: c / GLDO.pix, rmm: c / m / 2, near: v > GLDO.v0 };
}
(function () { const cc = z => { const v = 1 / (1 / GLDO.f - 1 / z); return Math.abs(v - GLDO.v0) / v; }; GLDO.A = GLDO.pix / ((cc(GLDO.z0 - 0.1) + cc(GLDO.z0 + 0.1)) / 2); })();

/* ---------- pictures: a disc blur, the sensor's frame, what is in it, and the DSP's search ---------- */
/** an S × S patch of the wrapping texture T (size N) centred on texel (cx, cy), blurred by a disc of radius r texels. Row
   prefix sums; the disc's edge is weighted by its fractional cover, so the blur grows smoothly with r */
function gld_blurPatch(cx, cy, S, r, T, N) {
  T = T || gld_tex(); N = N || GLDP.N;
  const R = Math.floor(r) + 1, Wd = S + 2 * R, x0 = cx - (S >> 1) - R, y0 = cy - (S >> 1) - R, wrapT = !!N;
  const row = new Float32Array(Wd * Wd);
  for (let j = 0; j < Wd; j++) { const ty = (((y0 + j) % N) + N) % N; for (let i = 0; i < Wd; i++) row[j * Wd + i] = T[ty * N + ((((x0 + i) % N) + N) % N)]; }
  return gld_discRows(row, Wd, S, R, r);
}
/** a whole S × S picture P blurred by a disc of radius r texels, edges clamped */
function gld_disc(P, S, r) {
  if (r < 0.05) return P;
  const R = Math.floor(r) + 1, Wd = S + 2 * R, row = new Float32Array(Wd * Wd);
  for (let j = 0; j < Wd; j++) { const sy = clamp(j - R, 0, S - 1) * S; for (let i = 0; i < Wd; i++) row[j * Wd + i] = P[sy + clamp(i - R, 0, S - 1)]; }
  return gld_discRows(row, Wd, S, R, r);
}
function gld_discRows(row, Wd, S, R, r) {
  const W1 = Wd + 1, pre = new Float32Array(Wd * W1);
  for (let j = 0; j < Wd; j++) { let acc0 = 0; for (let i = 0; i < Wd; i++) { acc0 += row[j * Wd + i]; pre[j * W1 + i + 1] = acc0; } }
  const sp = [];
  for (let dy = -R; dy <= R; dy++) {
    const ady = Math.abs(dy);
    if (ady <= r) { const hw = Math.sqrt(Math.max(0, r * r - dy * dy)), n = Math.floor(hw); sp.push(dy, n, hw - n, 1); }
    else if (ady - r < 1) sp.push(dy, 0, 0, 1 - (ady - r));
  }
  const ns = sp.length / 4; let wsum = 0;
  for (let q = 0; q < ns; q++) wsum += sp[q * 4 + 3] * (2 * sp[q * 4 + 1] + 1 + 2 * sp[q * 4 + 2]);
  const inv = 1 / wsum, out = new Float32Array(S * S);
  for (let j = 0; j < S; j++) for (let i = 0; i < S; i++) {
    let s = 0; const ci = i + R;
    for (let q = 0; q < ns; q++) {
      const rj = j + R + sp[q * 4], n = sp[q * 4 + 1], fr = sp[q * 4 + 2], b = rj * W1 + ci;
      let v = pre[b + n + 1] - pre[b - n];
      if (fr > 0) { const rb = rj * Wd + ci; v += fr * (row[rb + n + 1] + row[rb - n - 1]); }
      s += sp[q * 4 + 3] * v;
    }
    out[j * S + i] = s * inv;
  }
  return out;
}
/** bilinear read of an S × S picture at fractional (x, y), clamped at the edge */
function gld_bil(P, S, x, y) {
  x = clamp(x, 0, S - 1.001); y = clamp(y, 0, S - 1.001);
  const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi, i = yi * S + xi;
  return (P[i] * (1 - fx) + P[i + 1] * fx) * (1 - fy) + (P[i + S] * (1 - fx) + P[i + S + 1] * fx) * fy;
}
/** the sensor's frame: n × n pixels, each `pix` texels of the picture wide, centred on (ox, oy); 3 × 3 samples a pixel.
   An auto-exposure divides by the mean, as every PixArt part does, and a little read noise is added (seeded, so it repeats) */
function gld_frameOf(P, S, ox, oy, n, pix, seed = 1, noise = 0.012) {
  const F = new Float32Array(n * n), k = 3, R = rng(seed);
  let mean = 0;
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    let s = 0;
    for (let b = 0; b < k; b++) for (let a = 0; a < k; a++) s += gld_bil(P, S, ox + (i - n / 2 + (a + 0.5) / k) * pix, oy + (j - n / 2 + (b + 0.5) / k) * pix);
    F[j * n + i] = s / (k * k); mean += F[j * n + i];
  }
  mean /= n * n;
  for (let i = 0; i < n * n; i++) F[i] = clamp(F[i] / (2 * mean) + (R() - 0.5) * 2 * noise);
  return F;
}
/** features in a frame (the datasheets' SQUAL idea): pixels whose contrast with their neighbours tops thr and is the strongest round them */
function gld_features(F, n, thr = 0.05) {
  const g = new Float32Array(n * n), pts = [];
  for (let j = 1; j < n - 1; j++) for (let i = 1; i < n - 1; i++) g[j * n + i] = Math.hypot((F[j * n + i + 1] - F[j * n + i - 1]) / 2, (F[(j + 1) * n + i] - F[(j - 1) * n + i]) / 2);
  for (let j = 2; j < n - 2; j++) for (let i = 2; i < n - 2; i++) {
    const v = g[j * n + i]; if (v < thr) continue;
    let mx = true;
    for (let b = -1; b <= 1 && mx; b++) for (let a = -1; a <= 1; a++) if ((a || b) && g[(j + b) * n + i + a] > v) { mx = false; break; }
    if (mx) pts.push([i, j]);
  }
  return { n: pts.length, pts };
}
/** the DSP's search: the mean absolute difference between frame A shifted by (sx, sy) and frame B, for every shift in ±S;
   the best refined to a fraction of a pixel with a parabola. { map, S, best, sub, min } */
function gld_match(A, B, n, S) {
  const D = 2 * S + 1, map = new Float32Array(D * D);
  let best = 1e9, bx = 0, by = 0;
  for (let sy = -S; sy <= S; sy++) for (let sx = -S; sx <= S; sx++) {
    let s = 0, c = 0;
    for (let j = Math.max(0, -sy); j < Math.min(n, n - sy); j++) for (let i = Math.max(0, -sx); i < Math.min(n, n - sx); i++) { s += Math.abs(A[(j + sy) * n + i + sx] - B[j * n + i]); c++; }
    const v = s / c; map[(sy + S) * D + sx + S] = v;
    if (v < best) { best = v; bx = sx; by = sy; }
  }
  const at = (x, y) => map[(clamp(y, -S, S) + S) * D + clamp(x, -S, S) + S];
  const par = (m1, m0, p1) => { const d = m1 - 2 * m0 + p1; return d > 1e-9 ? clamp(0.5 * (m1 - p1) / d, -0.5, 0.5) : 0; };
  const fx = Math.abs(bx) < S ? par(at(bx - 1, by), best, at(bx + 1, by)) : 0, fy = Math.abs(by) < S ? par(at(bx, by - 1), best, at(bx, by + 1)) : 0;
  return { map, S, best: [bx, by], sub: [bx + fx, by + fy], min: best };
}
/** the frame at lens height z, the pad's spot centred on texel (cx, cy) of the 10 µm texture (cached) */
function gld_frameZ(z, cx = 256, cy = 256) {
  const key = Math.round(z * 1000) + ':' + cx + ':' + cy;
  let F = GLDP.cache.get(key); if (F) return F;
  const o = gld_optics(z), pixT = GLDO.pix / o.m / GLDP.mm, S = Math.ceil(GLDO.n * pixT) + 8, P = gld_blurPatch(cx, cy, S, o.rmm / GLDP.mm);
  F = gld_frameOf(P, S, S / 2, S / 2, GLDO.n, pixT, 7);
  if (GLDP.cache.size > 400) GLDP.cache.delete(GLDP.cache.keys().next().value);
  GLDP.cache.set(key, F); return F;
}
/** how sharp a frame is: the RMS of what is left after taking away each pixel's 3 × 3 mean (the fine detail a correlation
   locks onto). Defocus takes it away first; the read noise sets the floor */
function gld_sharp(F, n) {
  let s = 0, c = 0;
  for (let j = 1; j < n - 1; j++) for (let i = 1; i < n - 1; i++) {
    const k = j * n + i, m = (F[k - n - 1] + F[k - n] + F[k - n + 1] + F[k - 1] + F[k] + F[k + 1] + F[k + n - 1] + F[k + n] + F[k + n + 1]) / 9, d = F[k] - m;
    s += d * d; c++;
  }
  return Math.sqrt(s / c);
}
/** sharpness against lens height, as a share of the sharpness in focus: three spots of the pad, averaged. { pts: [[z, s]] } */
function gld_curve() {
  if (GLDP.curve) return GLDP.curve;
  const spots = [[256, 256], [118, 390], [402, 128]], f0 = spots.map(([x, y]) => gld_sharp(gld_frameZ(GLDO.z0, x, y), GLDO.n)), pts = [];
  for (let z = 1.80; z <= 3.0001; z += 0.025) pts.push([z, spots.reduce((s, [x, y], i) => s + gld_sharp(gld_frameZ(z, x, y), GLDO.n) / f0[i], 0) / spots.length]);
  GLDP.curve = { pts };
  return GLDP.curve;
}
function gld_sharpAt(z) {
  const P = gld_curve().pts; if (z <= P[0][0]) return P[0][1];
  for (let i = 1; i < P.length; i++) if (z <= P[i][0]) return lerp(P[i - 1][1], P[i][1], (z - P[i - 1][0]) / (P[i][0] - P[i - 1][0]));
  return P[P.length - 1][1];
}
/** what the lens shows at height z, for the big views: the cloth rendered at one of four scales (2.5 to 20 µm a texel,
   1.8 mm across), the coarsest that still holds the blur, then blurred by the circle of confusion. { o, lv, B, fov (mm) } */
const GLDV = { lv: [], cache: new Map(), at: [2.63, 2.45] };
function gld_level(k) {
  if (!GLDV.lv[k]) { const s = 0.0025 * Math.pow(2, k), S = Math.round(1.8 / s); GLDV.lv[k] = { k, s, S, P: gld_padPic(S, S, s, GLDV.at[0] - S * s / 2, GLDV.at[1] - S * s / 2) }; }
  return GLDV.lv[k];
}
function gld_viewAt(z) {
  const o = gld_optics(z), k = o.rmm <= 0.00625 ? 0 : o.rmm <= 0.0125 ? 1 : o.rmm <= 0.025 ? 2 : 3, lv = gld_level(k), r = o.rmm / lv.s;
  const key = k + ':' + Math.round(r * 6);
  let B = GLDV.cache.get(key);
  if (!B) { B = gld_disc(lv.P, lv.S, Math.round(r * 6) / 6); if (GLDV.cache.size > 48) GLDV.cache.delete(GLDV.cache.keys().next().value); GLDV.cache.set(key, B); }
  return { o, lv, B, fov: GLDO.n * GLDO.pix / o.m };
}

/* ---------- drawing ---------- */
const GLDC = new WeakMap();
/** a 0..1 picture as a canvas, made once per array, in a cool neutral grey (the sensor sees in infrared: no colour) */
function gld_cv(P, w, h) {
  let c = GLDC.get(P); if (c) return c;
  c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d'), id = g.createImageData(w, h), d = id.data;
  for (let i = 0; i < w * h; i++) { const v = 12 + 222 * Math.pow(clamp(P[i]), 1.3); d[i * 4] = v; d[i * 4 + 1] = v + 1; d[i * 4 + 2] = Math.min(255, v + 4); d[i * 4 + 3] = 255; }
  g.putImageData(id, 0, 0); GLDC.set(P, c); return c;
}
/** a picture canvas into a box: smoothed (the lens's picture) or hard pixels (the sensor's frame), clipped to a rounded box */
function gld_pic(cv, x, y, w, h, o = {}) {
  const a = o.alpha == null ? 1 : o.alpha; if (a <= 0.003) return;
  G.save(); G.globalAlpha = a;
  if (o.r) { rrPath(x, y, w, h, o.r); G.clip(); }
  G.imageSmoothingEnabled = !o.px; if (!o.px) G.imageSmoothingQuality = 'high';
  if (o.src) G.drawImage(cv, o.src[0], o.src[1], o.src[2], o.src[3], x, y, w, h); else G.drawImage(cv, x, y, w, h);
  G.restore();
}
/** stage px to device px, so a picture rendered for a box is never stretched (1 at the deck's own 1920, 2 on a sharp screen) */
const gld_res = () => (typeof APP !== 'undefined' && APP.scale ? clamp(Math.round(APP.scale * (APP.dpr || 1) * 4) / 4, 1, 2) : 1);
/** the cloth for a w × h box at mmpp, its top left at (u0, v0) mm: rendered once at the box's device resolution */
const GLDK2 = new Map();
function gld_padCv(key, w, h, mmpp, u0, v0) {
  const k = gld_res(), id = key + '@' + k;
  let c = GLDK2.get(id); if (c) return c;
  const W2 = Math.round(w * k), H2 = Math.round(h * k);
  c = gld_cv(gld_padPic(W2, H2, mmpp / k, u0, v0), W2, H2); GLDK2.set(id, c); return c;
}
/** the lens's picture at height z in a square box: the cloth at the finest level that holds the blur, blurred by its circle of confusion */
const GLDV2 = new Map();
function gld_viewDraw(z, x, y, s, o = {}) {
  const V = gld_viewAt(z), L = V.lv, n = V.fov / L.s, off = (L.S - n) / 2, a = o.alpha == null ? 1 : o.alpha, r = o.r == null ? 6 : o.r;
  gld_pic(gld_cv(V.B, L.S, L.S), x, y, s, s, { src: [off, off, n, n], r, alpha: a });
  /* near focus, the cloth rendered at the box's own device resolution over it, so the sharp picture is crisp at any size
     (the levels above only have to hold a blur, which hides their texel) */
  const px = Math.round(s * gld_res());
  if (a > 0.003 && GLDO.n * GLDO.pix / px < L.s * 0.8 && V.o.rmm < 0.004) {
    let cv = GLDV2.get(px);
    if (!cv) { const mm = GLDO.n * GLDO.pix / px; cv = gld_cv(gld_padPic(px, px, mm, GLDV.at[0] - px * mm / 2, GLDV.at[1] - px * mm / 2), px, px); GLDV2.set(px, cv); }
    gld_pic(cv, x, y, s, s, { r, alpha: a * clamp((0.004 - V.o.rmm) / 0.002) });
  }
  return V;
}
/** a filled or stroked path at an alpha (the deck's primitives reset G.globalAlpha, so drawings pass theirs to each call) */
function gld_shape(path, fill, stroke, lw, a = 1) {
  if (a <= 0.003) return;
  G.save(); G.globalAlpha = a; G.beginPath(); path();
  if (fill) { G.fillStyle = fill; G.fill(); }
  if (stroke) { G.strokeStyle = stroke; G.lineWidth = lw || 1.5; G.lineJoin = 'round'; G.stroke(); }
  G.restore();
}
/** a dot running along a polyline at fraction k (0..1): a photon */
function gld_photon(pts, k, col, a = 1, r = 4) {
  let L = 0; const seg = []; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); L += d; }
  let s = clamp(k) * L;
  for (let i = 0; i < seg.length; i++) { if (s <= seg[i] || i === seg.length - 1) { const u = seg[i] ? clamp(s / seg[i]) : 0; circle(lerp(pts[i][0], pts[i + 1][0], u), lerp(pts[i][1], pts[i + 1][1], u), r, { fill: col, alpha: a }); return; } s -= seg[i]; }
}

/* ---------- the glance: a huge number in Theseus's colour, and before → after ----------
   Brock (F14.10): the eye lands first on a huge number that says by how much, and on a chart where Theseus visibly wins.
   (F16.1): never a bare countdown; the bad value stays beside the live one, with the net change in Theseus's colour. */
/** the headline: a label over a huge figure in Theseus's gradient, a line under it. (x, y) = left edge (or o.align), baseline */
function gld_head(t, t0, x, y, value, unit, o = {}) {
  const a = ep(t, t0, t0 + 0.5) * (o.alpha == null ? 1 : o.alpha); if (a <= 0.003) return 0;
  const size = o.size || 168, al = o.align || 'left';
  if (o.label) text(o.label, x, y - size * 0.8 - 18, { role: 'label', size: 22, color: C.heroText, alpha: a, align: al, maxW: o.maxW });
  const r = rich([{ s: value, role: 'd1', size, weight: 800, track: -0.035, color: C.heroText, grad: C.heroGrad, tnum: true, count: o.count ? [t0, 1.0, o.from == null ? 0 : o.from] : null },
    unit ? { s: unit, font: 'disp', size: Math.round(size * (o.uk || 0.36)), weight: 800, color: C.heroText, grad: C.heroGrad, gap: Math.round(size * 0.05), caps: o.ucaps !== false } : null], x, y, { t, align: al, alpha: a });
  if (o.sub) text(o.sub, x, y + (o.subDy || Math.round(size * 0.24 + 30)), { role: 'small', size: 26, weight: 600, color: C.ink2, align: al, alpha: ep(t, t0 + 0.3, t0 + 0.8) * (o.alpha == null ? 1 : o.alpha), maxW: o.maxW || 560, lh: 1.3 });
  return r.w;
}
/** before → after on one line: the old value struck through in grey, an arrow, the new one in Theseus's colour; the net
   change under it in Theseus's colour. o = { size, label (over the line), net, who: [old's name, new's name] } */
function gld_ba(t, t0, x, y, before, after, o = {}) {
  const a = ep(t, t0, t0 + 0.5) * (o.alpha == null ? 1 : o.alpha); if (a <= 0.003) return;
  const size = o.size || 64, st0 = { role: 'd1', size, weight: 800, color: C.faint, tnum: true }, wB = tw(before, st0);
  if (o.label) text(o.label, x, y - size * 0.82 - 16, { role: 'label', size: 21, color: C.mute, alpha: a, maxW: o.maxW });
  text(before, x, y, Object.assign({ alpha: a * 0.9 }, st0));
  line(x - 4, y - size * 0.3, x + wB + 4, y - size * 0.3, { color: C.faint, w: Math.max(3, size * 0.06), alpha: a * ep(t, t0 + 0.35, t0 + 0.7) });
  const ax = x + wB + size * 0.32;
  arrow(ax, y - size * 0.32, ax + size * 0.62, y - size * 0.32, { color: C.mute, w: Math.max(2.5, size * 0.05), hs: size * 0.22, alpha: a, p: ep(t, t0 + 0.2, t0 + 0.7) });
  const k = ep(t, t0 + 0.45, t0 + 0.95);
  rich([{ s: after, role: 'd1', size, weight: 800, color: C.heroText, grad: C.heroGrad, tnum: true }], ax + size * 0.95, y, { t, alpha: a * k });
  if (o.who) { text(o.who[0], x, y + 34, { role: 'label', size: 19, color: C.faint, alpha: a }); text(o.who[1], ax + size * 0.95, y + 34, { role: 'label', size: 19, color: C.heroText, alpha: a * k }); }
  if (o.net) text(o.net, x, y + (o.who ? 82 : 50), { role: 'small', size: 27, weight: 800, color: C.heroText, alpha: a * ep(t, t0 + 0.8, t0 + 1.2) });
}

/* ---------- the sensor in section, to scale (the 3D board's dimensions, scene pcb) ----------
   z runs along the mouse (mm, the module's centre at z 1.12), y up from the pad side (the board's faces at y 4.01 and
   5.05). The castellated module (8.4 × 9.8 × 0.62) sits on the board; the snap-on lens comes up through it from below:
   a light lens under the LED, an imaging lens under the die, two clips through slots in the board. The lens reference
   plane is the imaging lens's lowest face, y 1.28; the pad sits 2.4 mm under it. */
const GLDS = { ref: 1.28, pad: -1.12, axis: 2.22, led: -0.78 };
const GLD_MAT = {
  board: () => (TH ? '#1c1d21' : '#202126'), mask: () => (TH ? '#2a2c31' : '#2c2e34'), mod: () => (TH ? '#0e0f11' : '#0b0c0e'), gold: '#C9A15C', goldD: '#9C7A3E', solder: '#C9CCD1',
  clear: () => (TH ? 'rgba(222,232,236,0.62)' : 'rgba(214,226,232,0.20)'), clearE: () => (TH ? '#7F9197' : '#AFC1C8'), cloth: () => (TH ? '#2B2D31' : '#3A3C41'), clothE: () => (TH ? '#4A4C52' : '#5A5D63'), foam: () => (TH ? '#5D5F64' : '#2C2E32'), base: () => (TH ? '#1A1B1E' : '#151619')
};
/** the pad in section: a cloth of yarns cut across (the weft) with the warp running over and under them, on foam and a
   rubber base. x0..x1 the span, yS its top, s px per mm, off (mm) how far it has slid, a alpha */
function gld_padSec(x0, x1, yS, s, off, a, o = {}) {
  const p = GLDW.p, hc = 0.42, foam = o.foam == null ? 2.9 : o.foam;
  gld_shape(() => G.rect(x0, yS + hc * s, x1 - x0, (foam - hc) * s), GLD_MAT.foam(), null, 0, a);
  gld_shape(() => G.rect(x0, yS + foam * s, x1 - x0, 0.5 * s), GLD_MAT.base(), null, 0, a);
  /* the foam's open cells, a few rows of small rings (seeded) */
  const R = rng(77); G.save(); rrPath(x0, yS + hc * s, x1 - x0, (foam - hc) * s, 0); G.clip();
  for (let k = 0; k < (x1 - x0) * foam * s / 160; k++) { const cx = x0 + R() * (x1 - x0), cy = yS + (hc + R() * (foam - hc)) * s, r = (0.08 + R() * 0.12) * s; circle(cx, cy, r, { color: TH ? 'rgba(255,255,255,0.13)' : 'rgba(255,255,255,0.06)', w: 1.2, alpha: a }); }
  G.restore();
  /* the weft yarns, cut across: flattened ellipses 0.32 mm apart; the warp yarn weaves over and under them */
  G.save(); G.beginPath(); G.rect(x0, yS - 0.3 * s, x1 - x0, (hc + 0.35) * s); G.clip();
  const j0 = Math.floor((-off) / p) - 2, j1 = j0 + Math.ceil((x1 - x0) / (p * s)) + 4, warp = [];
  for (let j = j0; j <= j1; j++) {
    const cx = x0 + ((j + 0.5) * p + off) * s, up = (j & 1) ? 1 : -1, cy = yS + (0.19 + 0.045 * up) * s;
    gld_shape(() => G.ellipse(cx, cy, 0.142 * s, 0.085 * s, 0, 0, TAU), GLD_MAT.cloth(), GLD_MAT.clothE(), 1.2, a);
    warp.push([cx, yS + (0.19 - 0.045 * up - 0.095 * up) * s]);
  }
  if (warp.length > 2) { const pts = monoCurve(warp, 4); G.save(); G.globalAlpha = a; G.beginPath(); pts.forEach((q, i) => (i ? G.lineTo(q[0], q[1]) : G.moveTo(q[0], q[1]))); G.strokeStyle = GLD_MAT.clothE(); G.lineWidth = 0.075 * s + 2; G.lineCap = 'round'; G.stroke(); G.strokeStyle = GLD_MAT.cloth(); G.lineWidth = 0.075 * s; G.stroke(); G.restore(); }
  G.restore();
}
/** the snap-on lens in section (side view): the body in two steps, a boss up into the board, the light lens and the imaging
   lens bulging under it, a clip at each end through the board. X, Y map mm to px */
function gld_lensSec(X, Y, s, a) {
  const cf = GLD_MAT.clear(), ce = GLD_MAT.clearE(), box = (z0, z1, y0, y1, r) => gld_shape(() => rrPath(X(z0), Y(y1), X(z1) - X(z0), Y(y0) - Y(y1), r), cf, ce, 1.5, a);
  box(-5.58, -3.68, 3.03, 3.93, 3); box(5.92, 7.82, 3.03, 3.93, 3);                  /* the clip arms */
  box(-5.9, -4.88, 3.93, 5.75, 3); box(6.98, 8.0, 3.93, 5.75, 3);                     /* the pegs, up through the board */
  gld_shape(() => { G.moveTo(X(-5.9), Y(5.45)); G.lineTo(X(-6.25), Y(5.25)); G.lineTo(X(-5.9), Y(5.05)); }, cf, ce, 1.5, a);   /* their barbs */
  gld_shape(() => { G.moveTo(X(8.0), Y(5.45)); G.lineTo(X(8.35), Y(5.25)); G.lineTo(X(8.0), Y(5.05)); }, cf, ce, 1.5, a);
  box(-3.68, 5.92, 2.78, 4.03, 6); box(-2.18, 5.02, 1.83, 2.79, 5);                 /* the body: upper and lower steps */
  box(-0.2, 3.3, 4.02, 4.93, 3);                                                     /* the boss into the board's window */
  /* the two elements: convex faces under the body */
  const bulge = (zc, hw, y0, y1) => gld_shape(() => { G.moveTo(X(zc - hw), Y(y0)); G.quadraticCurveTo(X(zc), Y(y1 - (y0 - y1) * 0.9), X(zc + hw), Y(y0)); G.closePath(); }, cf, ce, 1.5, a);
  bulge(GLDS.axis, 1.42, 1.83, GLDS.ref); bulge(GLDS.led, 1.0, 1.83, 1.41);
  /* moulded highlights so it reads as clear plastic */
  line(X(-3.3), Y(3.85), X(5.4), Y(3.85), { color: 'rgba(255,255,255,' + (TH ? 0.9 : 0.35) + ')', w: 2, alpha: a });
}
/** the board in section (y 4.01..5.05) from z0 to z1, with the lens's window and the two clip slots cut through it */
function gld_boardSec(X, Y, z0, z1, a) {
  const holes = [[-6.0, -4.78], [-0.4, 3.5], [6.88, 8.1]], f = GLD_MAT.board(), segs = []; let z = z0;
  for (const [h0, h1] of holes) { segs.push([z, h0]); z = h1; } segs.push([z, z1]);
  for (const [za, zb] of segs) { gld_shape(() => G.rect(X(za), Y(5.05), X(zb) - X(za), Y(4.01) - Y(5.05)), f, null, 0, a); line(X(za), Y(5.05), X(zb), Y(5.05), { color: TH ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.18)', w: 1.2, alpha: a }); }
  /* the copper inside it, a hairline each side of the core */
  for (const yy of [4.33, 4.73]) for (const [za, zb] of segs) line(X(za), Y(yy), X(zb), Y(yy), { color: GLD_MAT.goldD, w: 1, alpha: 0.3 * a });
}
/** the castellated module on the board, side view: black substrate, 8 plated half-holes along its edge, solder fillets
   onto the board's pads, the die hanging under it in the board's window, and the LED beside the die */
function gld_moduleSec(X, Y, s, a) {
  gld_shape(() => rrPath(X(-3.78), Y(5.70), X(6.02) - X(-3.78), Y(5.08) - Y(5.70), 2), GLD_MAT.mod(), TH ? null : 'rgba(255,255,255,0.22)', 1.2, a);
  for (let k = 0; k < 8; k++) {
    const zc = -3.08 + 1.2 * k;
    gld_shape(() => { G.moveTo(X(zc - 0.56), Y(5.05)); G.quadraticCurveTo(X(zc), Y(5.5), X(zc + 0.56), Y(5.05)); G.closePath(); }, GLD_MAT.solder, null, 0, a);  /* the fillet */
    gld_shape(() => G.rect(X(zc - 0.27), Y(5.72), 0.54 * s, Y(5.08) - Y(5.72)), GLD_MAT.gold, null, 0, a);                                                 /* the plated half-hole */
    line(X(zc - 0.12), Y(5.66), X(zc - 0.12), Y(5.14), { color: 'rgba(255,255,255,0.55)', w: 1.2, alpha: a });
  }
  gld_shape(() => rrPath(X(1.42), Y(5.08), X(3.02) - X(1.42), Y(4.70) - Y(5.08), 2), '#2a2b30', null, 0, a);       /* the die */
  gld_shape(() => G.rect(X(1.72), Y(4.74), X(2.72) - X(1.72), 0.07 * s), '#8E8C86', null, 0, a);                      /* its pixel array, facing down */
  gld_shape(() => rrPath(X(-1.15), Y(5.08), X(-0.4) - X(-1.15), Y(4.80) - Y(5.08), 2), '#3a3b40', null, 0, a);       /* the LED */
  gld_shape(() => G.ellipse(X(-0.78), Y(4.80), 0.3 * s, 0.09 * s, 0, 0, TAU), '#D9D7D0', null, 0, a);
}
/** the whole stack; returns anchor points for callouts and rays */
function gld_section(t, ox, oy, s, o = {}) {
  const a = o.alpha == null ? 1 : o.alpha, X = z => ox + z * s, Y = y => oy - y * s, yP = o.pad == null ? GLDS.pad : o.pad;
  if (a > 0.003) {
    gld_padSec(X(o.z0 == null ? -6.6 : o.z0), X(o.z1 == null ? 8.8 : o.z1), Y(yP), s, o.off || 0, a);
    gld_boardSec(X, Y, o.z0 == null ? -6.6 : o.z0, o.z1 == null ? 8.8 : o.z1, a);
    gld_moduleSec(X, Y, s, a);
    gld_lensSec(X, Y, s, a);
  }
  return { X, Y, yP, led: [X(GLDS.led), Y(4.80)], ll: [X(GLDS.led), Y(1.45)], il: [X(GLDS.axis), Y(GLDS.ref)], die: [X(GLDS.axis), Y(4.74)], spot: [X(GLDS.axis), Y(yP)],
    mod: [X(5.4), Y(5.4)], board: [X(8.6), Y(4.5)], clip: [X(7.5), Y(3.5)], pad: [X(-5.0), Y(yP) + 0.6 * s], foam: [X(-5.0), Y(yP) + 1.8 * s] };
}

/* ============================== optical sensor: just a camera ============================== */
/** where the lens is over the pad at slide time t, mm in the close-up's frame: a slow drift, as a hand moves the mouse */
const gld_camAt = t => { const u = clamp(t - 1.0, 0, 11); return [1.0 + 0.11 * u, 1.36 + 0.05 * Math.sin(0.55 * u)]; };
S({
  id: 'gld_camera', ch: 'glide', theme: 'paper', title: 'Optical sensor: just a camera', settle: 11, after: 'dots',
  src: ['gld_adns2610', 'gld_pmw3360', 'gld_paw3395o', 'gld_r3dSensor'],
  draw: t => {
    header(t, 'Optical sensor: just a camera');
    captions(t, [[0.6, 'An optical sensor is a camera. An LED lights the pad at a low angle, a lens images one millimetre of it, and an image sensor takes thousands of pictures a second.'], [6.0, 'Nothing in it measures motion. It compares each picture with the last, so everything rests on the picture being sharp.']]);
    /* ---- left: the sensor in section, to scale ---- */
    const x = LM, y = 280, w = 1160, h = 680, s = 42, ox = x + 580 - 1.1 * s, oy = y + 472;
    demoWindow(x, y, w, h, tileA(t, 0.15, 0));
    cardHead(t, 0.35, x, y, w, 'In section, to scale', []);
    const glide = 0.11 * Math.max(0, t - 1.0), k0 = ep(t, 0.4, 1.0);
    const P = gld_section(t, ox, oy, s, { alpha: k0, off: -glide, z0: -6.4, z1: 8.6 });
    /* the light: LED → light lens → across the pad; the patch → imaging lens → die (1:1, so the picture lands upside down) */
    const kr = ep(t, 1.4, 2.2), spotL = [P.spot[0] - 0.55 * s, P.spot[1]], spotR = [P.spot[0] + 0.55 * s, P.spot[1]];
    const inA = [P.led, [P.ll[0] - 0.2 * s, P.ll[1]], spotL], inB = [P.led, [P.ll[0] + 0.3 * s, P.ll[1]], spotR];
    const outA = [spotL, [P.il[0] - 1.0 * s, P.il[1]], [P.die[0] + 0.45 * s, P.die[1]]], outB = [spotR, [P.il[0] + 1.0 * s, P.il[1]], [P.die[0] - 0.45 * s, P.die[1]]];
    for (const pts of [inA, inB]) poly(pts, { color: rgba(C.ink2, 0.45), w: 1.5, dash: [5, 5], p: kr, alpha: k0 });
    for (const pts of [outA, outB]) poly(pts, { color: C.ink, w: 1.8, p: ep(t, 2.0, 2.8), alpha: k0 });
    gld_shape(() => G.rect(spotL[0], spotL[1] - 3, spotR[0] - spotL[0], 6), C.ink, null, 0, ep(t, 1.9, 2.3) * k0);
    if (t > 2.8) for (let k = 0; k < 4; k++) { const ph = ((t - 2.8) * 0.42 + k / 4) % 1; gld_photon(ph < 0.5 ? (k & 1 ? inA : inB) : (k & 1 ? outA : outB), (ph % 0.5) * 2, C.ink, ep(t, 2.8, 3.2), 4); }
    /* Z: lens reference plane to pad */
    { const zx = P.X(-4.2), ka = ep(t, 2.4, 3.0), ym = (P.Y(GLDS.ref) + P.Y(P.yP)) / 2;
      line(zx - 12, P.Y(GLDS.ref), P.X(GLDS.axis) - 1.42 * s, P.Y(GLDS.ref), { color: C.mute, w: 1.2, dash: [4, 4], alpha: ka });
      line(zx, P.Y(GLDS.ref), zx, P.Y(P.yP), { color: C.ink, w: 2, alpha: ka });
      for (const yy of [P.Y(GLDS.ref), P.Y(P.yP)]) line(zx - 10, yy, zx + 10, yy, { color: C.ink, w: 2, alpha: ka });
      rich([{ s: '2.4', role: 'd1', size: 56, weight: 800, color: C.ink }, { s: 'mm', font: 'sans', size: 22, weight: 700, color: C.mute, gap: 6 }], zx - 22, ym + 22, { align: 'right', alpha: ka });
      text('Lens to pad', zx - 22, ym - 34, { role: 'label', size: 20, color: C.mute, align: 'right', alpha: ka }); }
    /* the parts, named: the labels sit in the tile's margins, clear of the drawing */
    const L = x + 252, R = x + w - 226;
    callout(t, 1.5, P.led, 'LED, 850 nm', { to: [L, y + 236], side: 'l', color: C.ink2, tcolor: C.ink });
    callout(t, 2.5, [P.ll[0] - 0.8 * s, P.ll[1] - 2], 'Light lens', { to: [L, y + 398], side: 'l', color: C.ink2, tcolor: C.ink });
    callout(t, 1.7, [P.die[0] + 0.5 * s, P.die[1] - 4], 'Image sensor', { to: [R, y + 236], side: 'r', color: C.ink2, tcolor: C.ink });
    callout(t, 1.9, P.mod, 'Module', { to: [R, y + 296], side: 'r', color: C.ink2, tcolor: C.ink, sub: '8.4 × 9.8 mm, castellated', maxW: 210 });
    callout(t, 2.1, P.clip, 'Snap-on lens', { to: [R, y + 410], side: 'r', color: C.ink2, tcolor: C.ink });
    callout(t, 2.3, [P.il[0] + 1.3 * s, P.il[1] - 2], 'Imaging lens', { to: [R, y + 480], side: 'r', color: C.ink2, tcolor: C.ink, sub: '1:1', maxW: 260 });
    text('Cloth over foam', P.X(-6.0), P.Y(P.yP) + 2.0 * s, { role: 'label', size: 20, color: '#F3F2EE', alpha: ep(t, 2.7, 3.1) });
    text('"Optically acquiring sequential surface images (frames)"', x + 32, y + 104, { role: 'small', size: 25, weight: 600, color: C.ink2, maxW: 560, lh: 1.32, alpha: ep(t, 3.0, 3.4) });
    pill(x + 32, y + 172, 'datasheet', ep(t, 3.2, 3.6), { by: 'Agilent ADNS-2610' });
    /* ---- right top: the pad up close, and the millimetre the lens sees ---- */
    const rx = 1280, rw = 560, ty = 280, th = 380, py0 = ty + 80, ph = th - 80, mmpp = 2.8 / rw, u0 = 0.3, v0 = 0.6;
    demoWindow(rx, ty, rw, th, tileA(t, 0.15, 1));
    cardHead(t, 0.45, rx, ty, rw, 'The pad, up close', []);
    G.save(); rrPath(rx, ty, rw, th, 6); G.clip();
    gld_pic(gld_padCv('cam', rw, ph, mmpp, u0, v0), rx, py0, rw, ph, { alpha: ep(t, 0.5, 1.1) });
    G.restore();
    const pc = gld_camAt(t), qs = GLDO.n * GLDO.pix / mmpp, qx = rx + (pc[0] - u0) / mmpp - qs / 2, qy = py0 + (pc[1] - v0) / mmpp - qs / 2, kq = ep(t, 1.2, 1.7);
    rr(qx, qy, qs, qs, 3, null, '#FFFFFF', 2.5, kq);
    text('What the lens sees', qx, qy + qs + 28, { role: 'label', size: 20, color: '#FFFFFF', alpha: kq });
    { const bx = rx + 28, byy = ty + th - 28, k = ep(t, 1.0, 1.4); line(bx, byy, bx + 1 / mmpp, byy, { color: '#FFFFFF', w: 3, alpha: k }); text('1 mm', bx, byy - 12, { role: 'label', size: 20, color: '#FFFFFF', alpha: k }); }
    /* ---- right bottom: one frame, as the sensor records it ---- */
    const by = 700, bh = 260, fid = Math.floor(Math.max(0, t - 1.0) / 0.25), pf = gld_camAt(1.0 + fid * 0.25), F = gld_frameAt(pf[0] / GLDP.mm, pf[1] / GLDP.mm, fid);
    demoWindow(rx, by, rw, bh, tileA(t, 0.15, 2));
    const fs = 196, fx = rx + 32, fy = by + 32, kf0 = ep(t, 1.2, 1.8);
    gld_pic(gld_cv(F, GLDO.n, GLDO.n), fx, fy, fs, fs, { px: true, r: 4, alpha: kf0 });
    { const phs = ((t - 1.0) % 0.25) / 0.25; if (t > 1.2 && phs < 0.5) { const yy = fy + fs * E.out3(phs / 0.5); line(fx, yy, fx + fs, yy, { color: 'rgba(255,255,255,0.55)', w: 2, alpha: kf0 }); } }
    const tx = fx + fs + 36;
    text('One frame of 36 × 36', tx, by + 64, { role: 'label', size: 20, color: C.mute, alpha: ep(t, 1.4, 1.8) });
    rich([{ s: '12,000', role: 'd1', size: 76, weight: 800, color: C.ink, tnum: true, count: [1.6, 1.2] }], tx - 4, by + 150, { t, alpha: ep(t, 1.5, 1.8) });
    text('Frames a second', tx, by + 192, { role: 'small', size: 25, weight: 600, color: C.ink2, alpha: ep(t, 1.8, 2.2) });
    pill(tx, by + 228, 'datasheet', ep(t, 2.0, 2.4), { by: 'PMW3360' });
  }
});

/* ============================== frame correlation: two pictures become a count ============================== */
/** the sensor's frame (36 × 36, in focus) with the pad's spot centred on texel (px, py) of the 10 µm texture: cached */
const GLDF = new Map();
function gld_frameAt(px, py, id) {
  const key = id + ':' + Math.round(px * 4) + ':' + Math.round(py * 4);
  let f = GLDF.get(key); if (f) return f;
  const S = 124, cx = Math.round(px), cy = Math.round(py), P = gld_blurPatch(cx, cy, S, 0);
  f = gld_frameOf(P, S, S / 2 + (px - cx), S / 2 + (py - cy), GLDO.n, GLDO.pix / GLDP.mm, 11 + id);
  if (GLDF.size > 40) GLDF.delete(GLDF.keys().next().value);
  GLDF.set(key, f); return f;
}
/* a capture every GLDK.P s of slide time (slowed down: a real sensor takes thousands a second). The pad moves about 2.5 px
   between captures; the DSP tries every shift in ±5 px, keeps the best, refines it to a fraction of a pixel, and the shift
   times the pixel's size on the pad becomes counts at the CPI setting */
const GLDK = { t0: 1.6, P: 2.6, S: 5, cpi: 800 };
function gld_kpos(k) { let x = 180, y = 300; for (let i = 0; i < k; i++) { x += 7.4 + 1.6 * Math.sin(i * 1.3); y += -3.3 + 1.3 * Math.cos(i * 0.9); } return [x, y]; }
const GLDM = new Map();
function gld_kcycle(k) {
  let c = GLDM.get(k); if (c) return c;
  const pa = gld_kpos(k), pb = gld_kpos(k + 1), A = gld_frameAt(pa[0], pa[1], 1000 + k), B = gld_frameAt(pb[0], pb[1], 1001 + k), m = gld_match(A, B, GLDO.n, GLDK.S), px = GLDO.pix / GLDP.mm;
  const fa = []; for (const p of gld_features(A, GLDO.n, 0.07).pts) { if (p[0] < 8 || p[0] > GLDO.n - 9 || p[1] < 8 || p[1] > GLDO.n - 9) continue; if (fa.every(q => Math.hypot(q[0] - p[0], q[1] - p[1]) > 10)) fa.push(p); if (fa.length === 3) break; }
  c = { A, B, m, d: [(pb[0] - pa[0]) / px, (pb[1] - pa[1]) / px], fa };
  if (GLDM.size > 12) GLDM.delete(GLDM.keys().next().value);
  GLDM.set(k, c); return c;
}
/** |A shifted by s − B| over the overlap, as a picture (bright = the two frames disagree) */
function gld_diff(A, B, n, sx, sy) {
  const D = new Float32Array(n * n);
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { const jj = j + sy, ii = i + sx; D[j * n + i] = (jj < 0 || jj > n - 1 || ii < 0 || ii > n - 1) ? 0.05 : clamp(Math.abs(gld_bil(A, n, ii, jj) - B[j * n + i]) * 2.2); }
  return D;
}
S({
  id: 'gld_corr', ch: 'glide', theme: 'night', title: 'Frame correlation: how a sensor sees motion', settle: 11.6, after: 'gld_camera',
  src: ['gld_adns2610', 'gld_pmw3360', 'gld_adns3080'],
  draw: t => {
    header(t, 'Frame correlation: how a sensor sees motion');
    captions(t, [[0.6, 'The sensor slides each new frame over the last one and scores the match at every shift. The best match is how far the pad moved.'], [6.4, 'That shift, in pixels, becomes counts. At 800 CPI one count is 31.75 µm of travel, and each report carries the counts since the last.']]);
    const top = 280, th = 480, gap = 40, tw0 = (RM - LM - 2 * gap) / 3, X0 = i => LM + i * (tw0 + gap), n = GLDO.n, A = C.ink;
    const u = Math.max(0, t - GLDK.t0), k = Math.floor(u / GLDK.P), ph = (u % GLDK.P) / GLDK.P, live = t >= GLDK.t0;
    const c = gld_kcycle(k), prev = k > 0 ? gld_kcycle(k - 1) : null;
    const scan = live ? prog(ph, 0.15, 0.62) : 0, nS = 2 * GLDK.S + 1, nT = nS * nS, iScan = Math.min(nT - 1, Math.floor(scan * nT)), found = live && ph >= 0.62;
    /* ---- tile 1: two frames ---- */
    { const x = X0(0); demoWindow(x, top, tw0, th, tileA(t, 0.15, 0));
      cardHead(t, 0.3, x, top, tw0, 'Two frames in a row', ['derived']);
      const fs = (tw0 - 64 - 24) / 2, fy = top + 96, ka = ep(t, 0.8, 1.3), flash = live && ph < 0.15 ? 1 - ph / 0.15 : 0;
      gld_pic(gld_cv(c.A, n, n), x + 32, fy, fs, fs, { px: true, r: 4, alpha: ka });
      gld_pic(gld_cv(c.B, n, n), x + 32 + fs + 24, fy, fs, fs, { px: true, r: 4, alpha: ka });
      if (flash > 0) rr(x + 32 + fs + 24, fy, fs, fs, 4, 'rgba(255,255,255,' + (0.5 * flash) + ')', null, 0, 1);
      const sc = fs / n, kf1 = ep(t, 2.2, 2.6), sh = c.d;
      c.fa.forEach(([fx0, fy0]) => {
        const pA = [x + 32 + (fx0 + 0.5) * sc, fy + (fy0 + 0.5) * sc], pB = [x + 32 + fs + 24 + (fx0 + 0.5 - sh[0]) * sc, fy + (fy0 + 0.5 - sh[1]) * sc], pB0 = [x + 32 + fs + 24 + (fx0 + 0.5) * sc, fy + (fy0 + 0.5) * sc];
        circle(pA[0], pA[1], 9, { color: '#FFFFFF', w: 2.5, alpha: kf1 });
        circle(pB0[0], pB0[1], 9, { color: '#FFFFFF', w: 1.5, dash: [3, 3], alpha: 0.7 * kf1 });
        arrow(pB0[0], pB0[1], pB[0], pB[1], { color: '#FFFFFF', w: 2.5, hs: 8, alpha: kf1 });
        circle(pB[0], pB[1], 9, { color: '#FFFFFF', w: 2.5, alpha: kf1 });
      });
      text('Frame n', x + 32, fy + fs + 38, { role: 'label', size: 21, color: C.mute, alpha: ka });
      text('Frame n + 1', x + 32 + fs + 24, fy + fs + 38, { role: 'label', size: 21, color: C.mute, alpha: ka });
      const um = Math.hypot(c.d[0], c.d[1]) * GLDO.pix * 1000;
      text('The pad moved ' + fmtN(um, 0) + ' µm between them: the same fibres, a little to one side.', x + 32, fy + fs + 90, { role: 'small', size: 25, color: C.ink2, maxW: tw0 - 64, lh: 1.32, alpha: ep(t, 2.4, 2.8) }); }
    /* ---- tile 2: every shift, compared ---- */
    { const x = X0(1); demoWindow(x, top, tw0, th, tileA(t, 0.15, 1));
      cardHead(t, 0.5, x, top, tw0, 'Every shift, compared', ['derived']);
      const ds = 226, ms = tw0 - 64 - 24 - ds, cs = ms / nS, fy = top + 96, ka = ep(t, 1.0, 1.5);
      const tri = found ? c.m.best : [(iScan % nS) - GLDK.S, Math.floor(iScan / nS) - GLDK.S], D = found ? (c.Dbest || (c.Dbest = gld_diff(c.A, c.B, n, c.m.sub[0], c.m.sub[1]))) : gld_diff(c.A, c.B, n, tri[0], tri[1]);
      gld_pic(gld_cv(D, n, n), x + 32, fy, ds, ds, { px: true, r: 4, alpha: ka });
      const mx = x + 32 + ds + 24, mm = c.m.map; let lo = 1e9, hi = -1e9; for (const v of mm) { lo = Math.min(lo, v); hi = Math.max(hi, v); }
      const shown = live ? (found ? nT : iScan + 1) : 0;
      rr(mx - 4, fy - 4, ms + 8, ms + 8, 6, '#0F1012', null, 0, ka);
      for (let q = 0; q < nT; q++) {
        const ci = q % nS, cj = Math.floor(q / nS), qx = mx + ci * cs, qy = fy + cj * cs;
        if (q >= shown) { rr(qx + 1.5, qy + 1.5, cs - 3, cs - 3, 2, inkA(0.06), null, 0, ka); continue; }
        const good = 1 - (mm[q] - lo) / Math.max(1e-6, hi - lo);
        rr(qx + 1.5, qy + 1.5, cs - 3, cs - 3, 2, mix('#1B1C20', '#F3F2EE', Math.pow(good, 3)), null, 0, ka);
      }
      if (live && !found) rr(mx + (iScan % nS) * cs, fy + Math.floor(iScan / nS) * cs, cs, cs, 3, null, C.ink, 2, ka);
      if (found) { const bi = c.m.best[0] + GLDK.S, bj = c.m.best[1] + GLDK.S, pr = ep(ph, 0.62, 0.7, E.snap); rr(mx + bi * cs - 3, fy + bj * cs - 3, cs + 6, cs + 6, 4, null, C.ink, 2.5, pr); gld_pulse(t, GLDK.t0 + (k + 0.62) * GLDK.P, [mx + (bi + 0.5) * cs, fy + (bj + 0.5) * cs], 16, C.ink, 1.2); }
      text('Difference', x + 32, fy + ds + 38, { role: 'label', size: 21, color: C.mute, alpha: ka });
      text('Match, ±5 px', mx, fy + ds + 38, { role: 'label', size: 21, color: C.mute, alpha: ka });
      const sxy = live ? tri : [0, 0];
      rich([{ s: 'Shift', role: 'label', size: 21, color: C.mute }, { s: (sxy[0] >= 0 ? '+' : '−') + Math.abs(sxy[0]) + ', ' + (sxy[1] >= 0 ? '+' : '−') + Math.abs(sxy[1]), font: 'sans', size: 30, weight: 700, color: C.ink, gap: 16, tnum: true }, { s: 'px', role: 'label', size: 21, color: C.mute, gap: 10 }, { s: found ? 'Best match' : 'Trying', role: 'label', size: 21, color: found ? C.ink : C.faint, gap: 26 }], x + 32, fy + ds + 98, { alpha: ep(t, 1.4, 1.8) }); }
    /* ---- tile 3: the shift, as counts ---- */
    { const x = X0(2); demoWindow(x, top, tw0, th, tileA(t, 0.15, 2));
      cardHead(t, 0.7, x, top, tw0, 'The shift, as counts', ['derived']);
      const show = found || (prev && live), cc = found ? c : prev, kk = found ? ep(ph, 0.62, 0.8) : 1, sub = cc ? cc.m.sub : [0, 0], ka = ep(t, 1.2, 1.6) * (show ? 1 : 0.35);
      const cnt = v => v * GLDO.pix * GLDK.cpi / 25.4, sg = v => (v >= 0 ? '+' : '−') + fmtN(Math.abs(v), 2);
      [['ΔX', sub[0]], ['ΔY', sub[1]]].forEach(([nm, v], i) => {
        const yy = top + 172 + i * 88;
        rich([{ s: nm, role: 'label', size: 22, color: C.mute }, { s: show ? sg(v) : '0.00', role: 'stat', size: 70, color: C.ink, gap: 22, tnum: true }, { s: 'px', font: 'sans', size: 24, weight: 600, color: C.mute, gap: 12 }], x + 32, yy, { alpha: ka });
        text(show ? sg(cnt(v)) + ' counts' : '', x + tw0 - 32, yy, { font: 'sans', size: 26, weight: 700, color: C.ink, align: 'right', alpha: ka * kk });
      });
      text('Sub-pixel: a parabola through the best three scores.', x + 32, top + 306, { role: 'small', size: 25, color: C.mute, maxW: tw0 - 64, lh: 1.3, alpha: ep(t, 2.0, 2.4) });
      const sx0 = x + 32, sy0 = top + 362, sw = tw0 - 64, sh0 = 86, kS = ep(t, 1.6, 2.0);
      rr(sx0, sy0, sw, sh0, 6, '#0F1012', inkA(0.12), 1.5, kS);
      let cxp = 0, cyp = 0; for (let i = 0; i < k; i++) { const s0 = gld_kcycle(i).m.sub; cxp += s0[0]; cyp += s0[1]; }
      if (found) { cxp += c.m.sub[0] * kk; cyp += c.m.sub[1] * kk; }
      const scr = 9, ox = sx0 + 40, oy = sy0 + sh0 / 2 + 10;
      clipped(sx0, sy0, sw, sh0, () => { line(ox, oy, ox + cxp * scr, oy + cyp * scr, { color: rgba(C.ink, 0.45), w: 2, dash: [4, 4], alpha: kS }); cursorPtr(ox + cxp * scr, oy + cyp * scr, { a: kS, s: 0.8 }); }); }
    /* ---- the word, and where the method comes from ---- */
    const sy = top + th + 40, hw = (RM - LM - 40) / 2;
    glossBox(t, 3.2, LM, sy, hw, 'Correlation', 'Sliding one picture over another and scoring how well they match at each offset. The best score is the shift.');
    sourceBox(t, 3.5, LM + hw + 40, sy, hw, 'ADNS-2610 datasheet', 'The frames "are processed by the DSP to determine the direction and distance of motion." Here: a 36 × 36 frame with 30 µm pixels.');
  }
});

/* ============================== defocus: like a phone camera ============================== */
/* the lens height over the slide: the pointer drags the pad too close, back through focus, too far, and home */
const GLDZB = [[0, 2.4], [2.2, 2.4], [3.8, 2.0], [4.8, 2.0], [6.9, 2.8], [7.9, 2.8], [9.4, 2.4]];
const gld_zB = t => kf(t, GLDZB, E.io3);
/** what the picture is at height z: in Brock's 0.2 mm window, in PixArt's 0.4 mm, or out of both */
const gld_zone = z => (Math.abs(z - 2.4) <= 0.1 + 1e-6 ? 0 : Math.abs(z - 2.4) <= 0.2 + 1e-6 ? 1 : 2);
const gld_zoneCol = k => (k === 0 ? C.hero : k === 1 ? C.second : C.bad);
const gld_zoneTx = (k, z) => (k === 0 ? 'In focus' : k === 1 ? 'Soft' : z < 2.4 ? 'Too close' : 'Too far');
/** a phone, face on, its screen showing the cloth blurred by r texels of the 10 µm picture */
const GLDPH = new Map();
function gld_phone(x, y, w, h, r, a) {
  if (a <= 0.003) return;
  rr(x, y, w, h, 22, '#17181B', TH ? null : 'rgba(255,255,255,0.18)', 1.5, a);
  const L = gld_level(2), key = Math.round(r * 4);
  let B = GLDPH.get(key); if (!B) { B = gld_disc(L.P, L.S, r); GLDPH.set(key, B); }
  const n = L.S * 0.62, off = (L.S - n) / 2;
  gld_pic(gld_cv(B, L.S, L.S), x + 8, y + 8, w - 16, h - 16, { src: [off + 6, off - 10, n * (w - 16) / (h - 16), n], r: 16, alpha: a });
  rr(x + w / 2 - 22, y + 16, 44, 10, 5, '#0B0B0D', null, 0, a);
}
S({
  id: 'gld_blur', ch: 'glide', theme: 'paper', title: 'Defocus: like a phone camera', settle: 11, after: 'gld_corr',
  src: ['gld_apple2cm', 'gld_paw3395o', 'gld_adns2610', 'gld_brock02'],
  draw: t => {
    header(t, 'Defocus: like a phone camera');
    captions(t, [[0.6, 'The lens focuses at one height, 2.4 mm. Bring the pad closer or push it away and every fibre spreads into a disc of blur, as a phone blurs when you hold it too close.'], [9.6, 'A phone refocuses. The sensor can\'t: whatever moves the lens moves the picture out of focus.']]);
    const z = gld_zB(t), x = LM, y = 280, w = 1000, h = 680;
    /* ---- the live view, as big as the tile allows ---- */
    demoWindow(x, y, w, h, tileA(t, 0.15, 0));
    cardHead(t, 0.35, x, y, w, 'What the sensor sees', ['derived']);
    const vs = 580, vx = x + 32, vy = y + 76, kv = ep(t, 0.5, 1.1), V = gld_viewDraw(z, vx, vy, vs, { alpha: kv }), zn = gld_zone(z), zc = gld_zoneCol(zn);
    /* readouts and the height control, right of the view */
    const cx0 = vx + vs + 44, ka = ep(t, 0.8, 1.2);
    text('Lens to pad', cx0, vy + 30, { role: 'label', size: 21, color: C.mute, alpha: ka });
    rich([{ s: fmtN(z, 2), role: 'd1', size: 76, weight: 800, color: C.ink, tnum: true }, { s: 'mm', font: 'sans', size: 24, weight: 700, color: C.mute, gap: 8 }], cx0 - 4, vy + 112, { alpha: ka });
    text('Blur on the pad', cx0, vy + 178, { role: 'label', size: 21, color: C.mute, alpha: ka });
    rich([{ s: fmtN(V.o.rmm * 2000, 0), role: 'd1', size: 56, weight: 800, color: C.ink, tnum: true }, { s: 'µm', font: 'sans', size: 22, weight: 700, color: C.mute, gap: 8 }], cx0 - 3, vy + 240, { alpha: ka });
    circle(cx0 + 8, vy + 290, 8, { fill: zc, alpha: ka }); text(gld_zoneTx(zn, z), cx0 + 26, vy + 298, { role: 'label', size: 22, color: zn === 0 ? C.heroText : zn === 1 ? C.secondText : C.bad, alpha: ka });
    /* the height control: a ruler from 1.9 to 2.9 mm with both windows on it, and the knob the pointer drags */
    const rlx = x + w - 120, r0 = vy + 336, r1 = y + h - 40, Yr = v => r0 + (r1 - r0) * (v - 1.9) / 1.0, kr = ep(t, 1.0, 1.5);
    rr(rlx - 10, Yr(2.2), 20, Yr(2.6) - Yr(2.2), 4, rgba(C.second, 0.45), null, 0, kr);
    rr(rlx - 10, Yr(2.3), 20, Yr(2.5) - Yr(2.3), 4, C.hero, null, 0, kr);
    line(rlx, r0, rlx, r1, { color: inkA(0.3), w: 1.5, alpha: kr });
    for (let v = 1.9; v <= 2.9001; v += 0.1) { const maj = Math.abs(v * 5 - Math.round(v * 5)) < 1e-6; line(rlx - (maj ? 30 : 20), Yr(v), rlx - 12, Yr(v), { color: inkA(0.35), w: 1.2, alpha: kr }); if (maj) text(fmtN(v, 1), rlx - 38, Yr(v) + 7, { role: 'tick', size: 20, color: C.mute, align: 'right', alpha: kr }); }
    text('0.2 mm', rlx + 22, Yr(2.4) + 7, { role: 'label', size: 20, color: C.heroText, alpha: kr });
    text('0.4', rlx + 22, Yr(2.25) - 6, { role: 'label', size: 20, color: C.secondText, alpha: kr });
    const knob = [rlx, Yr(z)], drag = t > 2.0 && t < 9.6;
    circle(knob[0], knob[1], 13, { fill: '#FFFFFF', alpha: kr }); circle(knob[0], knob[1], 13, { color: zc, w: 3.5, alpha: kr });
    cursorAt(t, [[1.4, [rlx + 60, Yr(2.4) + 80]], [2.0, [rlx + 4, Yr(2.4) + 4]], [2.2, [rlx + 4, Yr(2.4) + 4]], [3.8, [rlx + 4, Yr(2.0) + 4]], [4.8, [rlx + 4, Yr(2.0) + 4]], [6.9, [rlx + 4, Yr(2.8) + 4]], [7.9, [rlx + 4, Yr(2.8) + 4]], [9.4, [rlx + 4, Yr(2.4) + 4]], [10.2, [rlx + 56, Yr(2.4) + 90]]], [2.05], { grab: drag, a: ep(t, 1.2, 1.5) * (1 - ep(t, 10.0, 10.6)) });
    /* ---- right top: a phone camera held too close ---- */
    const rx = 1120, rw = RM - rx, ty = 280, th = 340;
    demoWindow(rx, ty, rw, th, tileA(t, 0.15, 1));
    cardHead(t, 0.5, rx, ty, rw, 'A phone camera, too close', [{ ev: 'claim', by: 'Apple' }]);
    const pw = 140, phh = 214, pa = ep(t, 0.9, 1.5);
    gld_phone(rx + 40, ty + 84, pw, phh, 26, pa); gld_phone(rx + 40 + pw + 40, ty + 84, pw, phh, 0, pa);
    const tx = rx + 40 + 2 * pw + 80;
    text('1 cm away', tx, ty + 120, { role: 'label', size: 20, color: C.mute, alpha: pa });
    text('Blurred', tx, ty + 154, { role: 'h3', size: 30, color: C.ink, alpha: pa });
    text('2 cm away', tx, ty + 214, { role: 'label', size: 20, color: C.mute, alpha: pa });
    text('Sharp', tx, ty + 248, { role: 'h3', size: 30, color: C.ink, alpha: pa });
    text('{iPhone} 13 Pro: 2 cm minimum focus', tx, ty + 300, { role: 'small', size: 25, color: C.ink2, maxW: RM - 32 - tx, lh: 1.3, alpha: ep(t, 1.4, 1.8) });
    /* ---- right bottom: the same pad at three heights, so a still frame tells it too ---- */
    const by = ty + th + 40, bh = y + h - by;
    demoWindow(rx, by, rw, bh, tileA(t, 0.15, 2));
    const ss = Math.min((rw - 64 - 48) / 3, bh - 32 - 84);
    [[2.0, 'Too close'], [2.4, 'In focus'], [2.8, 'Too far']].forEach(([zz, nm], i) => {
      const xx = rx + 32 + i * (ss + 24), a = ep(t, 1.6 + i * 0.15, 2.0 + i * 0.15), k = gld_zone(zz);
      gld_viewDraw(zz, xx, by + 32, ss, { alpha: a });
      text(nm, xx, by + 32 + ss + 34, { role: 'label', size: 21, color: k === 0 ? C.heroText : C.bad, alpha: a });
      text(fmtN(zz, 1) + ' mm', xx, by + 32 + ss + 62, { role: 'label', size: 20, color: C.mute, alpha: a });
    });
    source(t, 'Model: a thin lens at 1:1 and 2.4 mm (PixArt), its aperture set so the blur reaches one 30 µm pixel at ±0.1 mm. The pad: a computed plain-weave cloth.', { t0: 2 });
  }
});

/* ============================== focus window: 0.2 mm, not 0.4 ============================== */
/* the curve draws itself, the two windows land on it, then the pointer drags the lens to each window's worst edge */
const GLDZF = [[0, 2.4], [6.2, 2.4], [7.4, 2.2], [8.4, 2.2], [9.4, 2.3], [10.4, 2.3], [11.2, 2.4]];
S({
  id: 'focus', ch: 'glide', theme: 'night', title: 'Focus window: 0.2 mm, not 0.4', settle: 12, after: 'gld_blur', ideas: [11],
  src: ['gld_brock02', 'gld_paw3395o', 'gld_adns2610', 'gld_adns3080', 'gld_pmw3360', 'gld_zowie', 'gld_pcgV4'],
  draw: t => {
    header(t, 'Focus window: 0.2 mm, not 0.4');
    captions(t, [[0.6, 'PixArt allows 2.2 to 2.6 mm, a 0.4 mm window, and most makers design to all of it. At its edge the picture has lost half its fine detail.'], [6.4, 'I design to the middle 0.2 mm, where the picture stays sharp, and leave the rest of PixArt\'s window for what moves the lens in use.']]);
    const sh = v => Math.round(gld_sharpAt(v) * 100), wT = Math.min(sh(2.3), sh(2.5)), wO = Math.min(sh(2.2), sh(2.6)), z = kf(t, GLDZF, E.io3);
    /* ---- the glance: by how much, and before → after ---- */
    gld_head(t, 4.4, LM, 470, '+' + (wT - wO), 'pts', { label: 'Sharper at the window\'s edge', size: 176, uk: 0.3, sub: 'The worst picture inside each window, computed from the frame.', maxW: 520 });
    gld_ba(t, 4.8, LM, 662, wO + '%', wT + '%', { size: 72, who: ['0.4 mm window', 'Theseus, 0.2 mm'] });
    /* ---- the chart: sharpness against lens height, both windows on it ---- */
    const cx = 680, cy = 280, cw = RM - cx, ch = 420;
    demoWindow(cx, cy, cw, ch, tileA(t, 0.15, 0));
    cardHead(t, 0.35, cx, cy, cw, 'Sharpness of the frame against lens height', ['derived']);
    const gx = cx + 96, gw = cw - 96 - 300, gy = cy + 100, gh = ch - 100 - 70, X = v => gx + gw * (v - 1.9) / 1.0, Y = v => gy + gh * (1 - v / 100), kg = ep(t, 0.6, 1.1);
    const kO = ep(t, 3.0, 3.6), kT = ep(t, 3.6, 4.2);
    rr(X(2.2), gy, X(2.6) - X(2.2), gh, 3, rgba(C.second, 0.16), null, 0, kO);
    rr(X(2.3), gy, X(2.5) - X(2.3), gh, 3, rgba(C.hero, 0.30), null, 0, kT);
    for (const v of [0, 50, 100]) { line(gx, Y(v), gx + gw, Y(v), { color: C.hair, w: 1, alpha: kg }); text(v + '%', gx - 14, Y(v) + 7, { role: 'tick', size: 20, color: C.mute, align: 'right', alpha: kg }); }
    for (let v = 1.9; v <= 2.9001; v += 0.1) { const maj = Math.abs(v * 5 - Math.round(v * 5)) < 1e-6; if (maj) text(fmtN(v, 1), X(v), gy + gh + 30, { role: 'tick', size: 20, color: C.mute, align: 'center', alpha: kg }); }
    text('Lens to pad, mm', gx + gw, gy + gh + 62, { role: 'label', size: 20, color: C.mute, align: 'right', alpha: kg });
    text('Higher is better', gx - 14, gy - 22, { role: 'label', size: 20, color: C.ink2, alpha: kg });
    text('Most makers: 0.4 mm', (X(2.2) + X(2.6)) / 2, gy + gh - 16, { role: 'label', size: 19, color: C.secondText, align: 'center', alpha: kO * (kT < 1 ? 1 - kT : 0) });
    const pts = gld_curve().pts.filter(p => p[0] >= 1.9 - 1e-6 && p[0] <= 2.9 + 1e-6), drawTo = lerp(1.9, 2.9, ep(t, 1.0, 2.8, E.io3));
    const cpts = pts.filter(p => p[0] <= drawTo + 1e-6).map(p => [X(p[0]), Y(p[1] * 100)]);
    if (cpts.length > 1) poly(monoCurve(cpts, 3), { color: C.ink, w: 3.5, alpha: kg });
    /* the worst edge of each window, marked and labelled where the eye goes */
    { const kM = ep(t, 4.2, 4.7), zO = sh(2.2) <= sh(2.6) ? 2.2 : 2.6, zT = sh(2.3) <= sh(2.5) ? 2.3 : 2.5;
      circle(X(zO), Y(wO), 9, { fill: C.second, alpha: kM }); text(wO + '%', X(zO) - 16, Y(wO) + 8, { font: 'disp', size: 34, weight: 800, color: C.secondText, align: 'right', alpha: kM });
      heroMark(X(zT), Y(wT), 12, kM); text(wT + '%', X(zT) - 18, Y(wT) - 14, { font: 'disp', size: 40, weight: 800, color: C.heroText, align: 'right', alpha: kM }); }
    /* the window bands named on the right, as a legend */
    { const lx = gx + gw + 40, a1 = ep(t, 3.6, 4.0);
      rr(lx, gy + 10, 28, 16, 3, rgba(C.hero, 0.6), null, 0, a1); text('Theseus: 0.2 mm', lx + 40, gy + 26, { role: 'label', size: 20, color: C.heroText, alpha: a1 });
      text('2.3 to 2.5 mm', lx + 40, gy + 54, { role: 'small', size: 25, color: C.ink2, alpha: a1 });
      rr(lx, gy + 96, 28, 16, 3, rgba(C.second, 0.5), null, 0, kO); text('Most makers: 0.4', lx + 40, gy + 112, { role: 'label', size: 20, color: C.secondText, alpha: kO });
      text('2.2 to 2.6 mm', lx + 40, gy + 140, { role: 'small', size: 25, color: C.ink2, alpha: kO });
      /* the picture at the pointer's height */
      const ivs = 130, ivx = lx, ivy = gy + 164, kv = ep(t, 6.0, 6.5);
      if (kv > 0.003) { const zn = gld_zone(z); gld_viewDraw(z, ivx, ivy, ivs, { alpha: kv }); rr(ivx, ivy, ivs, ivs, 6, null, gld_zoneCol(zn), 3, kv); text(fmtN(z, 2) + ' mm', ivx + ivs + 14, ivy + 26, { role: 'label', size: 20, color: C.mute, alpha: kv }); text(sh(z) + '%', ivx + ivs + 14, ivy + 64, { font: 'disp', size: 34, weight: 800, color: zn === 0 ? C.heroText : zn === 1 ? C.secondText : C.bad, alpha: kv }); } }
    /* the live point on the curve, and the pointer dragging it */
    { const kp = ep(t, 5.8, 6.3), drag = t > 6.2 && t < 11.2; if (kp > 0.003) { const zn = gld_zone(z); circle(X(z), Y(gld_sharpAt(z) * 100), 8, { fill: gld_zoneCol(zn), alpha: kp }); circle(X(z), Y(gld_sharpAt(z) * 100), 16, { color: gld_zoneCol(zn), w: 1.5, alpha: 0.5 * kp });
      cursorAt(t, [[5.8, [X(2.4) + 40, Y(100) + 90]], [6.2, [X(2.4) + 4, Y(gld_sharpAt(2.4) * 100) + 4]], [7.4, [X(2.2) + 4, Y(gld_sharpAt(2.2) * 100) + 4]], [8.4, [X(2.2) + 4, Y(gld_sharpAt(2.2) * 100) + 4]], [9.4, [X(2.3) + 4, Y(gld_sharpAt(2.3) * 100) + 4]], [10.4, [X(2.3) + 4, Y(gld_sharpAt(2.3) * 100) + 4]], [11.2, [X(2.4) + 4, Y(100) + 4]], [11.9, [X(2.4) + 60, Y(100) + 80]]], [6.25], { grab: drag, a: kp * (1 - ep(t, 11.6, 12.0)) }); } }
    /* ---- what moves the lens in use: the margin a 0.2 mm design keeps for it ---- */
    const cell = bento(LM, 760, RM - LM, 200, 4, 1), items = [
      ['Thicker skates', 'Thicker than stock: lag or tracking issues.', { ev: 'claim', by: 'ZOWIE' }],
      ['A skate swap', 'A Viper V4 Pro on dots: unusable on glass pads.', { ev: 'measured', by: 'PC Gamer 2026' }],
      ['Lift-off', 'Set from the lens height: nominal plus 2 mm.', { ev: 'datasheet', by: 'PMW3360' }],
      ['A sagging base', 'Press the base and it bows toward the pad. Next.', null]];
    items.forEach(([hd, body, ev], i) => {
      const r = cell(i, 0), t0 = 7.0 + i * 0.25, a = tileA(t, t0, 0);
      demoWindow(r[0], r[1], r[2], r[3], a);
      text(hd, r[0] + 28, r[1] + 46, { role: 'label', size: 21, color: C.ink, alpha: a });
      text(body, r[0] + 28, r[1] + 88, { role: 'small', size: 25, color: C.ink2, maxW: r[2] - 56, lh: 1.3, alpha: a });
      if (ev) pill(r[0] + 28, r[1] + r[3] - 28, ev.ev, a, { by: ev.by });
    });
    text('What moves the lens in use', LM, 736, { role: 'label', size: 21, color: C.mute, alpha: ep(t, 6.8, 7.2) });
    source(t, 'Sharpness: fine contrast of the simulated 36 × 36 frame against the frame in focus; thin lens at 1:1, one pixel of blur at ±0.1 mm. 0.2 mm: Brock. 0.4 mm: PixArt\'s Z, 2.2 to 2.6 mm.', { t0: 2 });
  }
});

/* ============================== sensor dots: no sag at the lens ============================== */
/* The base in side section as a 2D beam (07-sim.js): 100 mm, PP-C-20A, pressed evenly between the corner skates. With skates
   only at the corners (z ±45 mm) the lens sits at mid-span; with a dot each side of it (z ±11 mm) it sits on a short span.
   The beam is linear, so the share of the sag that reaches the lens holds at any press and any stiffness: that ratio is the
   number on the slide. The bow drawn is a 0.15 mm sag at the middle, for scale against the window. */
function gld_sag(dots) {
  return simSolve('gld_sag' + (dots ? 2 : 0), () => {
    const n = 100, nodes = [], els = [], fix = {}, loads = {}, E0 = SIM_MAT.ppcf.E, rho = SIM_MAT.ppcf.rho;
    for (let i = 0; i <= n; i++) nodes.push([i - 50, 0]);
    for (let i = 0; i < n; i++) els.push({ i, j: i + 1, w: 30, h: 1.4, E: E0, rho });
    fix[5] = 'xy'; fix[95] = 'y'; if (dots) { fix[39] = 'y'; fix[61] = 'y'; }
    for (let i = 6; i < 95; i++) loads[i] = [0, -1 / 89, 0];
    return { nodes, els, fix, loads };
  });
}
const GLD_SAG0 = 0.15;      /* mm: the sag drawn at the middle with corner skates only, for scale (the ratio is the model's) */
S({
  id: 'gld_sag', ch: 'glide', theme: 'paper', title: 'Sensor dots: no sag at the lens', settle: 11, after: 'focus', ideas: [10],
  src: ['gld_paw3395o', 'gld_brock02', 'shlPyrofil'],
  draw: t => {
    header(t, 'Sensor dots: no sag at the lens');
    captions(t, [[0.6, 'With skates only at the corners, the lens sits halfway along an open span. Press the base and it bows, and the lens drops toward the pad.'], [6.4, 'A dot each side of the lens holds it at the skates\' height. PixArt\'s own datasheet says to put feet round the lens opening.']]);
    const r0 = gld_sag(false), r2 = gld_sag(true), d0 = -r0.d[50 * 3 + 1], d2 = -r2.d[50 * 3 + 1], ratio = d2 / d0, cut = Math.round((1 - ratio) * 100);
    const press = ep(t, 2.0, 3.4, E.io3);
    const rows = [{ y: 280, nm: 'Corner skates only', r: r0, dots: false, d: d0 }, { y: 640, nm: 'Theseus: a dot each side of the lens', r: r2, dots: true, d: d2 }];
    const bx0 = LM + 50, bw = 900, Xz = z => bx0 + bw * (z + 50) / 100;
    rows.forEach((R, ri) => {
      const x = LM, y = R.y, w = 1200, h = 320, a = tileA(t, 0.15, ri), hero = R.dots;
      demoWindow(x, y, w, h, a);
      cardHead(t, 0.35 + ri * 0.2, x, y, w, R.nm, ['derived'], { color: hero ? C.heroText : C.mute });
      const yb = y + 150, yPad = y + 262, ka = ep(t, 0.6 + ri * 0.2, 1.1 + ri * 0.2);
      /* the pad, and the skates on it */
      line(x + 32, yPad, Xz(50) + 30, yPad, { color: C.ink2, w: 2, alpha: ka });
      const sk = [-45, 45].concat(R.dots ? [-11, 11] : []);
      /* the base, bowed by the press (drawn × vk), and the skates hanging from it */
      const dv = i => -R.r.d[i * 3 + 1] / d0 * GLD_SAG0 * (74 / GLD_SAG0) * press;
      const pts = []; for (let i = 0; i <= 100; i++) pts.push([Xz(i - 50), yb + dv(i)]);
      poly(pts, { color: C.ink, w: 9, alpha: ka, cap: 'round' });
      for (const zs of sk) { const i = zs + 50, xx = Xz(zs), yy = yb + dv(i); rr(xx - 3.25 * bw / 100, yy + 5, 6.5 * bw / 100, yPad - yy - 5, 3, hero && Math.abs(zs) < 20 ? C.hero : C.comp, null, 0, ka); }
      /* the lens under the middle, and the gap it keeps to the pad */
      const yl = yb + dv(50), lc = Xz(0);
      gld_shape(() => { rrPath(lc - 26, yl + 4, 52, 30, 6); }, TH ? 'rgba(222,232,236,0.9)' : 'rgba(214,226,232,0.3)', GLD_MAT.clearE(), 1.5, ka);
      gld_shape(() => { G.moveTo(lc - 16, yl + 34); G.quadraticCurveTo(lc, yl + 48, lc + 16, yl + 34); G.closePath(); }, TH ? 'rgba(222,232,236,0.9)' : 'rgba(214,226,232,0.3)', GLD_MAT.clearE(), 1.5, ka);
      text('Lens', lc, yl + 74, { role: 'label', size: 20, color: C.mute, align: 'center', alpha: ka });
      /* the press: arrows along the span, and the pointer pushing the middle */
      const kp = ep(t, 1.6, 2.2);
      for (let zz = -36; zz <= 36; zz += 12) { const xx = Xz(zz), yy = yb + dv(zz + 50); arrow(xx, yy - 64 - 12 * press, xx, yy - 12, { color: C.mute, w: 2, hs: 10, alpha: kp * ka }); }
      if (ri === 0) cursorAt(t, [[1.4, [lc + 70, yb - 150]], [2.0, [lc + 4, yb - 82]], [3.4, [lc + 4, yb - 82 + 74 * press]], [12, [lc + 4, yb - 82 + 74 * press]]], [2.05], { a: ep(t, 1.2, 1.5) });
      /* the gauge: the lens's height against both windows (the 0.15 mm sag drawn to the same scale) */
      const gxx = x + w - 130, gc = y + 168, gk = 74 / GLD_SAG0, kgg = ep(t, 1.0, 1.5);
      rr(gxx - 12, gc - 0.2 * gk, 24, 0.4 * gk, 4, rgba(C.second, 0.42), null, 0, kgg);
      rr(gxx - 12, gc - 0.1 * gk, 24, 0.2 * gk, 4, C.hero, null, 0, kgg);
      line(gxx - 26, gc, gxx + 26, gc, { color: C.ink, w: 1.5, alpha: kgg });
      const drop = Math.max(0, R.d / d0 * GLD_SAG0 * press), ok = drop <= 0.1 + 1e-6;
      gld_shape(() => { const yy = gc + drop * gk; G.moveTo(gxx - 40, yy); G.lineTo(gxx - 24, yy - 9); G.lineTo(gxx - 24, yy + 9); G.closePath(); }, ok ? C.hero : C.bad, null, 0, kgg);
      text('Lens', gxx + 22, gc + 7, { role: 'label', size: 19, color: C.mute, alpha: kgg });
      rich([{ s: fmtN(drop * 1000, 0), role: 'd1', size: 48, weight: 800, color: ok ? C.heroText : C.bad, grad: ok && hero ? C.heroGrad : null, tnum: true }, { s: 'µm', font: 'sans', size: 20, weight: 700, color: C.mute, gap: 6 }], gxx - 52, y + h - 34, { align: 'right', alpha: kgg });
      text('Lens drop', gxx - 52, y + h - 86, { role: 'label', size: 19, color: C.mute, align: 'right', alpha: kgg });
    });
    /* ---- the glance ---- */
    gld_head(t, 4.2, 1320, 470, '0', 'µm', { label: 'Lens drop, dots at the lens', size: 176, uk: 0.36, ucaps: false, sub: 'The dots carry the press beside the lens, so the bow never reaches it. Lower is better.', maxW: 520 });
    gld_ba(t, 4.6, 1320, 680, fmtN(GLD_SAG0 * 1000, 0), Math.round(Math.max(0, ratio) * GLD_SAG0 * 1000) + ' µm', { size: 64, who: ['Corners only', 'Theseus'] });
    sourceBox(t, 5.4, 1320, 800, 520, 'PixArt PAW3395 datasheet', '"Place mouse feet around the base plate opening to stabilize mouse tracking."');
    source(t, '2D beam: the base in side section, PP-C-20A, pressed evenly between the corner skates; the bow drawn for a 0.15 mm sag at the middle.', { t0: 2 });
  }
});

/* ============================== the module and the snap-on lens, from Brock's photos ============================== */
/** the castellated module from above, on the board: (cx, cy) its centre, s px per mm, +z up the screen */
function gld_modTop(cx, cy, s, a, o = {}) {
  const X = x => cx + x * s, Y = z => cy - (z - 1.12) * s, R = rng(3360);
  /* the board round it, with the two clip slots the lens comes through, and its silkscreen */
  rr(X(-6.4), Y(8.9), 12.8 * s, 15.6 * s, 6, GLD_MAT.mask(), null, 0, a);
  for (const [z0, z1] of [[-6.0, -4.78], [6.88, 8.1]]) rr(X(-1.8), Y(z1), 3.6 * s, (z1 - z0) * s, 0.6 * s, '#050506', null, 0, a);
  for (let k = 0; k < 8; k++) for (const sd of [-1, 1]) rr(X(sd * 4.2) - (sd < 0 ? 0.85 * s : 0), Y(-3.08 + 1.2 * k) - 0.32 * s, 0.85 * s, 0.64 * s, 2, GLD_MAT.solder, null, 0, a);
  /* the module: black substrate, gold castellations (half-holes at the edge, pads running in), test pads, fiducials, the label */
  rr(X(-4.2), Y(6.02), 8.4 * s, 9.8 * s, 0.35 * s, GLD_MAT.mod(), TH ? null : 'rgba(255,255,255,0.16)', 1.2, a);
  for (let k = 0; k < 8; k++) for (const sd of [-1, 1]) {
    const zc = -3.08 + 1.2 * k, ex = X(sd * 4.2), y0 = Y(zc);
    rr(sd < 0 ? ex : ex - 0.95 * s, y0 - 0.29 * s, 0.95 * s, 0.58 * s, 0.25 * s, GLD_MAT.gold, null, 0, a);
    gld_shape(() => G.arc(ex, y0, 0.26 * s, sd < 0 ? -Math.PI / 2 : Math.PI / 2, sd < 0 ? Math.PI / 2 : Math.PI * 1.5), GLD_MAT.goldD, null, 0, a);
  }
  for (const [x0, z0] of [[0.75, 4.75], [1.95, 4.75], [-2.85, -2.95], [-1.65, -2.95]]) rr(X(x0), Y(z0 + 0.8), 0.9 * s, 0.8 * s, 0.12 * s, GLD_MAT.gold, null, 0, a);
  for (const [x0, z0] of [[-3.32, 5.14], [3.32, -2.9]]) { circle(X(x0), Y(z0), 0.32 * s, { color: GLD_MAT.gold, w: 0.16 * s, alpha: a }); }
  circle(X(-2.3), Y(4.6), 0.38 * s, { fill: '#202126', alpha: a }); circle(X(2.5), Y(-2.2), 0.3 * s, { fill: '#202126', alpha: a });
  rr(X(-2.4), Y(3.67), 4.8 * s, 5.1 * s, 0.15 * s, '#ECEBE6', null, 0, a);
  /* a QR-style code on the label (seeded modules, three finder squares), and a line of type down its side */
  const q = 21, qs = 3.3 * s / q, qx = X(-2.15), qy = Y(3.35);
  G.save(); G.globalAlpha = a; G.fillStyle = '#141414';
  for (let j = 0; j < q; j++) for (let i = 0; i < q; i++) {
    const fin = (i < 7 && j < 7) || (i > 13 && j < 7) || (i < 7 && j > 13);
    let on = R() < 0.48;
    if (fin) { const fi = i > 13 ? i - 14 : i, fj = j > 13 ? j - 14 : j; on = fi === 0 || fi === 6 || fj === 0 || fj === 6 || (fi >= 2 && fi <= 4 && fj >= 2 && fj <= 4); }
    else if ((i === 7 || j === 7 || i === 13 || j === 13) && (i < 8 || j < 8)) on = false;
    if (on) G.fillRect(qx + i * qs, qy + j * qs, qs + 0.3, qs + 0.3);
  }
  G.restore();
  G.save(); G.translate(X(1.65), Y(2.2)); G.rotate(Math.PI / 2); text('{T5A1606ZV}', 0, 0, { role: 'label', size: Math.max(19, 0.62 * s), color: '#141414', alpha: a, caps: false, track: 0.02 }); G.restore();
  return { X, Y };
}
/** the snap-on lens from below: a clear body in two steps, the imaging lens and the light lens, a clip at each end */
function gld_lensBot(cx, cy, s, a) {
  const X = x => cx + x * s, Y = z => cy - (z - 1.12) * s, cf = GLD_MAT.clear(), ce = GLD_MAT.clearE();
  const box = (x0, x1, z0, z1, r) => gld_shape(() => rrPath(X(x0), Y(z1), (x1 - x0) * s, (z1 - z0) * s, r), cf, ce, 1.8, a);
  box(-1.2, 1.2, -5.58, -3.4, 4); box(-1.2, 1.2, 5.64, 7.82, 4);                 /* the clip arms */
  box(-1.02, 1.02, -5.98, -4.9, 3); box(-1.02, 1.02, 7.06, 8.22, 3);            /* the pegs, seen end on */
  line(X(0), Y(-5.9), X(0), Y(-5.0), { color: ce, w: 2, alpha: a }); line(X(0), Y(7.14), X(0), Y(8.12), { color: ce, w: 2, alpha: a });   /* the slit in each */
  box(-2.6, 2.6, -3.68, 5.92, 0.5 * s); box(-2.2, 2.2, -2.18, 5.02, 0.4 * s);
  /* the elements: dark through the clear body, with a highlight */
  for (const [zc, r] of [[GLDS.axis, 1.42], [GLDS.led, 1.0]]) {
    circle(X(0), Y(zc), r * s, { fill: TH ? 'rgba(40,46,52,0.55)' : 'rgba(10,12,14,0.7)', color: ce, w: 1.8, alpha: a });
    circle(X(-0.35 * r), Y(zc + 0.35 * r), 0.32 * r * s, { fill: 'rgba(255,255,255,0.8)', alpha: a });
  }
  if (s >= 46) text('{HDL-0420}', X(0), Y(4.5), { role: 'label', size: Math.max(12, 0.42 * s), color: ce, align: 'center', alpha: a * 0.8, caps: false });
  return { X, Y };
}
const GLD_LENS = [{ nm: 'Round lens', who: 'PixArt LM19-LSI', w: 18.85, h: 21.15, ev: 'datasheet' }, { nm: 'Trim lens', who: 'PixArt L0AE-LSI1', w: 10.9, h: 16.8, ev: 'datasheet' }, { nm: 'Snap-on lens', who: 'Theseus', w: 5.2, h: 14.2 }];
S({
  id: 'gld_module', ch: 'glide', theme: 'night', title: 'Snap-on lens: one dot wide', settle: 10, after: 'gld_sag', ideas: [37],
  src: ['gld_r3dSensor', 'gld_paw3395', 'gld_zkLens', 'gld_brock'],
  draw: t => {
    header(t, 'Snap-on lens: one dot wide');
    captions(t, [[0.6, 'The sensor rides on a castellated module, 8.4 by 9.8 mm, soldered along both edges. The lens snaps up through the board from below.'], [5.6, 'The lens is one dot wide. It covers a fifth of the board PixArt\'s round lens does, and leaves room for the dots beside it.']]);
    const s = 32;
    /* ---- the module, from above ---- */
    const ax = LM, ay = 280, aw = 720, ah = 680;
    demoWindow(ax, ay, aw, ah, tileA(t, 0.15, 0));
    cardHead(t, 0.35, ax, ay, aw, 'Sensor module, from above', []);
    const ka = ep(t, 0.5, 1.1), M = gld_modTop(ax + 260, ay + 372, s, ka), la = ep(t, 1.4, 1.8), lx = ax + 484;
    line(M.X(-4.2), M.Y(-6.55), M.X(4.2), M.Y(-6.55), { color: C.mute, w: 1.5, alpha: la }); for (const xx of [M.X(-4.2), M.X(4.2)]) line(xx, M.Y(-6.2), xx, M.Y(-6.9), { color: C.mute, w: 1.5, alpha: la });
    text('8.4 mm', M.X(0), M.Y(-6.55) + 30, { role: 'label', size: 20, color: C.mute, align: 'center', alpha: la });
    callout(t, 1.6, [M.X(4.2), M.Y(4.12)], '16 castellations, 1.2 mm apart', { to: [lx, ay + 170], side: 'r', color: C.ink2, tcolor: C.ink, prose: true, maxW: 200 });
    callout(t, 1.8, [M.X(1.9), M.Y(3.0)], 'A label with its code', { to: [lx, ay + 330], side: 'r', color: C.ink2, tcolor: C.ink, prose: true, maxW: 200 });
    callout(t, 2.0, [M.X(1.8), M.Y(-5.4)], 'Slots for the lens\'s clips', { to: [lx, ay + 560], side: 'r', color: C.ink2, tcolor: C.ink, prose: true, maxW: 200 });
    /* ---- the lens, from below: a 6.5 mm dot drawn behind it, the lens a hair narrower ---- */
    const bx = 840, bw = 400;
    demoWindow(bx, ay, bw, ah, tileA(t, 0.15, 1));
    cardHead(t, 0.5, bx, ay, bw, 'The lens, from below', []);
    const kb = ep(t, 0.8, 1.4), lcx = bx + 132, lcy = ay + 372;
    { const kd = ep(t, 3.0, 3.6), dy = lcy - (GLDS.axis - 1.12) * s; circle(lcx, dy, 3.25 * s, { color: C.heroText, w: 2, dash: [6, 5], alpha: kd }); }
    const Lb = gld_lensBot(lcx, lcy, s, kb), lx2 = bx + 262;
    callout(t, 2.0, [Lb.X(1.0), Lb.Y(GLDS.axis + 0.7)], 'Imaging lens', { to: [lx2, ay + 250], side: 'r', color: C.ink2, tcolor: C.ink, prose: true, maxW: 118 });
    callout(t, 2.2, [Lb.X(0.8), Lb.Y(GLDS.led - 0.4)], 'Light lens', { to: [lx2, ay + 470], side: 'r', color: C.ink2, tcolor: C.ink, prose: true, maxW: 118 });
    callout(t, 2.4, [Lb.X(1.2), Lb.Y(7.3)], 'Clip', { to: [lx2, ay + 130], side: 'r', color: C.ink2, tcolor: C.ink, prose: true, maxW: 118 });
    callout(t, 3.2, [lcx + 3.25 * s * 0.71, lcy - (GLDS.axis - 1.12) * s + 3.25 * s * 0.71], 'A 6.5 mm dot', { to: [lx2, ay + 360], side: 'r', color: C.heroText, tcolor: C.heroText, prose: true, maxW: 118 });
    { const la2 = ep(t, 2.6, 3.0); line(Lb.X(-2.6), Lb.Y(-6.7), Lb.X(2.6), Lb.Y(-6.7), { color: C.mute, w: 1.5, alpha: la2 }); for (const xx of [Lb.X(-2.6), Lb.X(2.6)]) line(xx, Lb.Y(-6.35), xx, Lb.Y(-7.05), { color: C.mute, w: 1.5, alpha: la2 }); text('5.2 mm', Lb.X(0), Lb.Y(-6.7) + 30, { role: 'label', size: 20, color: C.mute, align: 'center', alpha: la2 }); }
    /* ---- the glance: how much less board, and the three lenses to scale ---- */
    const areas = GLD_LENS.map(L => L.w * L.h), cut = Math.round((1 - areas[2] / areas[0]) * 100);
    gld_head(t, 3.6, 1280, 470, '−' + cut, '%', { label: 'Less board under the lens', size: 176, uk: 0.42, sub: 'Than PixArt\'s round lens, the one most high-end mice still use.', maxW: 540 });
    const fx = 1280, fy = 640, fw = RM - fx, fh = 320, k3 = ep(t, 4.2, 4.8);
    demoWindow(fx, fy, fw, fh, tileA(t, 4.0, 0));
    text('Footprint, to scale. Smaller is better', fx + 28, fy + 44, { role: 'label', size: 20, color: C.mute, alpha: k3 });
    const fs = 9.4, fcx = fx + 150, fcy = fy + 190;
    GLD_LENS.forEach((L, i) => {
      const w0 = L.w * fs, h0 = L.h * fs, a = ep(t, 4.3 + i * 0.25, 4.7 + i * 0.25), hero = i === 2, col = hero ? C.hero : i === 1 ? C.second : C.comp;
      if (hero) rr(fcx - w0 / 2, fcy - h0 / 2, w0, h0, 2.5 * fs, C.hero, null, 0, a);
      else { G.save(); G.globalAlpha = a; G.setLineDash(i === 0 ? [7, 5] : []); rrPath(fcx - w0 / 2, fcy - h0 / 2, w0, h0, (i === 0 ? 9 : 1.6) * fs); G.strokeStyle = col; G.lineWidth = 2.5; G.stroke(); G.restore(); }
      const ty = fy + 118 + i * 66;
      text(L.nm, fx + 300, ty, { role: 'label', size: 20, color: hero ? C.heroText : i === 1 ? C.secondText : C.mute, alpha: a });
      text(fmtN(areas[i], 0) + ' mm²', fx + 300, ty + 32, { font: 'disp', size: 28, weight: 800, color: hero ? C.heroText : C.ink2, alpha: a });
    });
    source(t, 'Round and trim lens: PixArt PAW3395 datasheet, assembled outlines. Snap-on lens and module: this deck\'s 3D board, from Brock\'s photos. Areas are bounding boxes.', { t0: 2 });
  }
});
