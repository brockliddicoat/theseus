/* ============================================================================================
   chapter 02, glide and tracking, part two: the sensor is a camera.
   gld_camera (what is inside: LED, lens, image sensor, DSP) · gld_corr (frame correlation: two pictures become a count) ·
   gld_phone (depth of field, the phone test) · focus (a 0.2 mm window: the lens simulation) · gld_stack (what moves the
   height in use, and what goes wrong off focus).
   Everything on these slides is computed, not drawn to look right: a procedural pad (a plain-weave cloth lit at a low
   angle, fibres and specks), the sensor's frame sampled from it, a disc blur whose radius is the thin-lens circle of
   confusion, a feature count on the frame (the datasheets' SQUAL idea), and a sum-of-differences search for the shift.
   ============================================================================================ */
Object.assign(SRC, {
  gld_adns2610: { t: 'Agilent / Avago ADNS-2610 datasheet: "measures changes in position by optically acquiring sequential surface images (frames) and mathematically determining the direction and magnitude of movement"; 1500 frames/s; 12 in/s; a 324-value pixel dump (18 × 18), 0 to 63 each; Z (lens reference plane to surface) 2.3 min, 2.4 typ, 2.5 max mm, "results in ±0.2 mm DOF"; SQUAL is the number of features the sensor sees in the current frame; red LED, 639 nm', u: 'https://fab.cba.mit.edu/classes/863.09/people/labrune/files/camera/ADNS2610.pdf', n: 'Figure 14 plots resolution against Z for five surfaces; figure 32 plots SQUAL against the distance from nominal focus.' },
  gld_adns3080: { t: 'Avago ADNS-3080 datasheet: a frame of 900 pixels (30 × 30); up to 6469 frames/s; 40 in/s and 15 g; Z 2.3 to 2.5 mm, "results in ±0.2 mm DOF"; "SQUAL is typically maximized when the navigation surface is at the optimum distance from the imaging lens"', u: 'https://dtsheet.com/doc/729170/avago-adns-3080', n: 'Figures plot mean resolution and path deviation against Z.' },
  gld_pmw3360: { t: 'PixArt PMW3360DM-T2QU datasheet: frame rate up to 12000 fps; 1296 raw values a frame (36 × 36); 250 ips, 50 g; optical lens 1:1; Z 2.2 / 2.4 / 2.6 mm; "Lift detection height = nominal height + 2 mm (default value)", or + 3 mm; SQUAL is "a measure of the number of valid features visible by the chip in the current frame"', u: 'https://datasheet.lcsc.com/datasheet/pdf/c018c3e1d470821feefadd37e2f785d5.pdf?productCode=C20612443' },
  gld_paw3395o: { t: 'PixArt PAW3395DM-T6QU datasheet v1.2, optics: 850 nm IR LED; lens magnification 1:1; Z from the lens reference plane to the tracking surface 2.2 min, 2.4 typ, 2.6 max mm; "self-adjusting variable frame rate" with no number; no pixel array size given; "place mouse feet around the base plate opening to stabilize mouse tracking"', u: 'https://atta.szlcsc.com/upload/public/pdf/source/20251201/5A54B75DA77586FABF8CEFBD8F21947D.pdf' },
  gld_apple2cm: { t: 'Apple Newsroom, 25 Jan 2022: iPhone 13 Pro macro photography, "a minimum focus distance of 2 centimeters", from the Ultra Wide camera\'s new autofocus; "iPhone will automatically switch cameras as you get close"', u: 'https://www.apple.com/newsroom/2022/01/share-your-best-iphone-macro-photos-for-apples-shot-on-iphone-challenge/' },
  gld_zowie: { t: 'ZOWIE FAQ: the original skates are "approximately 0.5 mm thick"; "lag or tracking issues may occur if the new skates are thicker than the original ones", because "the sensor height may change"; the fix it gives is a Medium or High lift-off setting', u: 'https://zowie.benq.eu/en-eu/support/faq/product/explanation/zowiegear-faq-kn-00024.html' },
  gld_brock02: { t: 'Brock Liddicoat, review notes 2026-11-04: "the sensors window to focus is actually only 0.2mm optimally", while "most manufacturers only optimize for 0.4mm which can lead to issues"', u: '', n: 'His estimate from building and testing mice; no maker publishes an optimum inside the datasheet window.' }
});

/* ---------- the pad, procedurally ----------
   A plain-weave cloth, 10 µm a texel, tiling every 512 texels (5.12 mm): warp and weft yarns 0.32 mm apart going over and
   under each other, twisted fibres on each yarn, loose lint and specks, all as a height field lit from one side at 20°
   above the pad (an optical sensor's LED grazes the surface, so every bump throws a shadow). Built once, on first use. */
const GLDP = { N: 512, um: 10, tex: null, canv: null, cache: new Map(), curve: null };
function gld_tex() {
  if (GLDP.tex) return GLDP.tex;
  const N = GLDP.N, P = 32, R = rng(20261104), Hh = new Float32Array(N * N), Al = new Float32Array(N * N);
  const nT = N / P, yarnA = [], yarnPh = [];
  for (let i = 0; i < 2 * nT; i++) { yarnA.push(0.82 + R() * 0.3); yarnPh.push(R() * TAU); }
  const half = 0.43, Ay = 9, B = 3.2;
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const ci = Math.floor(x / P), cj = Math.floor(y / P), u = x / P - ci - 0.5, v = y / P - cj - 0.5;
    let h = -B - Ay * 0.75, al = 0.22;
    if (Math.abs(u) < half) {                                          /* the warp yarn, along y */
      const zw = B * Math.cos(Math.PI * (y / P - 0.5) + Math.PI * ci), hw = Ay * Math.sqrt(1 - (u / half) ** 2);
      const tw = 0.9 * Math.sin(TAU * (y * 0.19 + u * P * 0.55) / 5.2 + yarnPh[ci]);
      if (zw + hw + tw > h) { h = zw + hw + tw; al = 0.78 * yarnA[ci]; }
    }
    if (Math.abs(v) < half) {                                          /* the weft yarn, along x */
      const zf = -B * Math.cos(Math.PI * (x / P - 0.5) + Math.PI * cj), hf = Ay * Math.sqrt(1 - (v / half) ** 2);
      const tw = 0.9 * Math.sin(TAU * (x * 0.19 - v * P * 0.55) / 5.2 + yarnPh[nT + cj]);
      if (zf + hf + tw > h) { h = zf + hf + tw; al = 0.74 * yarnA[nT + cj]; }
    }
    Hh[y * N + x] = h + (R() - 0.5) * 0.9; Al[y * N + x] = al * (0.94 + R() * 0.12);
  }
  /* loose lint: thin curved fibres lying on top */
  for (let k = 0; k < 34; k++) {
    let x = R() * N, y = R() * N, a = R() * TAU; const L = 30 + R() * 90, bright = 0.8 + R() * 0.2;
    for (let s = 0; s < L; s += 0.5) {
      a += (R() - 0.5) * 0.08; x += Math.cos(a) * 0.5; y += Math.sin(a) * 0.5;
      const xi = ((Math.round(x) % N) + N) % N, yi = ((Math.round(y) % N) + N) % N, i = yi * N + xi;
      Hh[i] = Math.max(Hh[i], 9 + B) + 1.5; Al[i] = bright;
    }
  }
  /* specks: dirt (dark) and lint balls (bright), 15 to 45 µm */
  for (let k = 0; k < 170; k++) {
    const cx = R() * N, cy = R() * N, r = 1.2 + R() * 2.6, dark = R() < 0.5, lift = dark ? 0 : 2.5, ex = 0.6 + R() * 0.8, an = R() * Math.PI;
    for (let dy = -5; dy <= 5; dy++) for (let dx = -5; dx <= 5; dx++) {
      const qx = dx * Math.cos(an) + dy * Math.sin(an), qy = (-dx * Math.sin(an) + dy * Math.cos(an)) * ex, d = Math.hypot(qx, qy) * (0.85 + 0.3 * R()); if (d > r) continue;
      const xi = ((Math.round(cx + dx) % N) + N) % N, yi = ((Math.round(cy + dy) % N) + N) % N, i = yi * N + xi;
      Al[i] = dark ? Al[i] * 0.45 : Math.min(1.05, Al[i] + 0.28); Hh[i] += lift * (1 - d / r);
    }
  }
  /* light from -x at 20° above the pad: Lambert on the height field, and the shadows the yarns throw (a horizon swept along
     each row toward +x, twice round the tile so the shadows wrap) */
  const ta = Math.tan(20 * Math.PI / 180), ca = Math.cos(20 * Math.PI / 180), sa = Math.sin(20 * Math.PI / 180), I = new Float32Array(N * N);
  for (let y = 0; y < N; y++) {
    const yu = ((y - 1 + N) % N) * N, yd = ((y + 1) % N) * N, yr = y * N;
    let hor = -1e9;
    for (let pass = 0; pass < 2; pass++) for (let x = 0; x < N; x++) {
      const h0 = Hh[yr + x];
      if (pass) {
        const hx = (Hh[yr + (x + 1) % N] - Hh[yr + (x - 1 + N) % N]) / 2, hy = (Hh[yd + x] - Hh[yu + x]) / 2;
        let lit = Math.max(0, (hx * ca + sa) / Math.sqrt(1 + hx * hx + hy * hy));
        if (hor > h0 + 0.3) lit *= 0.38;
        I[yr + x] = Al[yr + x] * (0.2 + 0.8 * lit);
      }
      hor = Math.max(hor - ta, h0);
    }
  }
  /* normalise to 0..1 by the 1st and 99th percentiles */
  const sorted = Float32Array.from(I).sort(), lo = sorted[Math.floor(N * N * 0.01)], hi = sorted[Math.floor(N * N * 0.99)];
  for (let i = 0; i < N * N; i++) I[i] = clamp((I[i] - lo) / (hi - lo));
  GLDP.tex = I;
  return I;
}

/* ---------- optics: a thin lens at the lens reference plane ----------
   PixArt gives the lens as 1:1 at Z = 2.4 mm (PAW3395, PMW3360), so u = v = 2.4 mm and f = 1.2 mm. The aperture is the one
   free number: it is set so the blur on the die reaches one pixel 0.1 mm either side of focus, which is Brock's 0.2 mm
   window. The pixel (30 µm on the die, 36 × 36 of them, the PMW3360's frame) is a model value: PixArt publishes neither
   for the PAW3395. The disc on the die, referred back to the pad, is the blur radius the pad picture is convolved with. */
const GLDO = { f: 1.2, v0: 2.4, z0: 2.4, A: 0.72, pix: 0.030, n: 36, texMM: 0.010 };
function gld_optics(z) {
  const u = Math.max(1.25, z), v = 1 / (1 / GLDO.f - 1 / u), c = GLDO.A * Math.abs(v - GLDO.v0) / v, m = GLDO.v0 / u;
  return { u, v, c, m, cpx: c / GLDO.pix, rTex: c / m / 2 / GLDO.texMM, near: v > GLDO.v0 };
}
/* calibrate the aperture once: c = 1 pixel at z0 ± 0.1 mm (mean of the two sides) */
(function () { const cc = z => { const v = 1 / (1 / GLDO.f - 1 / z); return Math.abs(v - GLDO.v0) / v; }; GLDO.A = GLDO.pix / ((cc(GLDO.z0 - 0.1) + cc(GLDO.z0 + 0.1)) / 2); })();

/* ---------- pictures: a blurred patch of the pad, the sensor's frame of it, and what is in the frame ---------- */
/** S×S texels of the pad centred on texel (cx, cy) (integers), blurred by a disc of radius r texels. Row prefix sums, so each
   output texel costs one add per row of the disc; the disc's edge is weighted by its fractional cover, so the blur grows
   smoothly with r (no steps as the lens moves) */
function gld_blurPatch(cx, cy, S, r) {
  const T = gld_tex(), N = GLDP.N, R = Math.floor(r) + 1, W = S + 2 * R, x0 = cx - (S >> 1) - R, y0 = cy - (S >> 1) - R;
  const pre = new Float32Array(W * (W + 1)), row = new Float32Array(W * W);
  for (let j = 0; j < W; j++) {
    const ty = (((y0 + j) % N) + N) % N; let acc0 = 0; pre[j * (W + 1)] = 0;
    for (let i = 0; i < W; i++) { const v = T[ty * N + ((((x0 + i) % N) + N) % N)]; row[j * W + i] = v; acc0 += v; pre[j * (W + 1) + i + 1] = acc0; }
  }
  const out = new Float32Array(S * S), sp = [];
  for (let dy = -R; dy <= R; dy++) {
    const ady = Math.abs(dy);
    if (ady <= r) { const hw = Math.sqrt(Math.max(0, r * r - dy * dy)), n = Math.floor(hw); sp.push(dy, n, hw - n, 1); }
    else if (ady - r < 1) sp.push(dy, 0, 0, 1 - (ady - r));
  }
  const ns = sp.length / 4, sDy = new Int32Array(ns), sN = new Int32Array(ns), sF = new Float32Array(ns), sK = new Float32Array(ns);
  let wsum = 0;
  for (let q = 0; q < ns; q++) { sDy[q] = sp[q * 4]; sN[q] = sp[q * 4 + 1]; sF[q] = sp[q * 4 + 2]; sK[q] = sp[q * 4 + 3]; wsum += sK[q] * (2 * sN[q] + 1 + 2 * sF[q]); }
  const inv = 1 / wsum, W1 = W + 1;
  for (let j = 0; j < S; j++) for (let i = 0; i < S; i++) {
    let s = 0; const ci = i + R;
    for (let q = 0; q < ns; q++) {
      const rj = j + R + sDy[q], b = rj * W1 + ci, n = sN[q], fr = sF[q];
      let v = pre[b + n + 1] - pre[b - n];
      if (fr > 0) { const rb = rj * W + ci; v += fr * (row[rb + n + 1] + row[rb - n - 1]); }
      s += sK[q] * v;
    }
    out[j * S + i] = s * inv;
  }
  return out;
}
/** bilinear read of an S×S picture at fractional (x, y) (clamped at the edge) */
function gld_bil(P, S, x, y) {
  x = clamp(x, 0, S - 1.001); y = clamp(y, 0, S - 1.001);
  const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi, i = yi * S + xi;
  return (P[i] * (1 - fx) + P[i + 1] * fx) * (1 - fy) + (P[i + S] * (1 - fx) + P[i + S + 1] * fx) * fy;
}
/** the sensor's frame: n×n pixels, each `pix` texels on the pad, centred at (ox, oy) in the picture; k×k samples a pixel.
   An auto-exposure (as on every PixArt part) divides by the mean, and a little read noise is added (seeded, so a frame repeats) */
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
/** features in a frame, the datasheets' SQUAL idea: pixels where the picture changes by more than `thr` across them,
   that are the strongest change among their neighbours. Returns { n, pts } */
function gld_features(F, n, thr = 0.05) {
  const g = new Float32Array(n * n), pts = [];
  for (let j = 1; j < n - 1; j++) for (let i = 1; i < n - 1; i++) {
    const gx = (F[j * n + i + 1] - F[j * n + i - 1]) / 2, gy = (F[(j + 1) * n + i] - F[(j - 1) * n + i]) / 2;
    g[j * n + i] = Math.hypot(gx, gy);
  }
  for (let j = 2; j < n - 2; j++) for (let i = 2; i < n - 2; i++) {
    const v = g[j * n + i]; if (v < thr) continue;
    let mx = true;
    for (let b = -1; b <= 1 && mx; b++) for (let a = -1; a <= 1; a++) if ((a || b) && g[(j + b) * n + i + a] > v) { mx = false; break; }
    if (mx) pts.push([i, j]);
  }
  return { n: pts.length, pts };
}
/** the DSP's search: the mean absolute difference between frame A shifted by (sx, sy) and frame B, for every shift in ±S.
   Returns { map, S, best: [sx, sy], sub: [x, y] } (sub: the minimum refined to a fraction of a pixel by a parabola) */
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
/** everything the focus simulation needs at one lens height z (mm), cached by z to 0.002 mm:
   { o: optics, img: the lens's picture (L×L, the frame's field of view), frame (36×36), feat } */
function gld_view(z, cx = 256, cy = 256, L = 108) {
  const key = Math.round(z * 500) + ':' + cx + ':' + cy + ':' + L;
  let v = GLDP.cache.get(key); if (v) return v;
  const o = gld_optics(z), fov = L / o.m, S = Math.ceil(fov) + 6, P = gld_blurPatch(cx, cy, S, o.rTex);
  const img = new Float32Array(L * L), c0 = S / 2;
  for (let j = 0; j < L; j++) for (let i = 0; i < L; i++) img[j * L + i] = gld_bil(P, S, c0 + (i + 0.5 - L / 2) / o.m, c0 + (j + 0.5 - L / 2) / o.m);
  const frame = gld_frameOf(P, S, c0, c0, GLDO.n, (GLDO.pix / GLDO.texMM) / o.m, 7), feat = gld_features(frame, GLDO.n);
  v = { o, img, frame, feat, L };
  if (GLDP.cache.size > 60) GLDP.cache.delete(GLDP.cache.keys().next().value);
  GLDP.cache.set(key, v);
  return v;
}
/** how sharp a frame is: the RMS of what is left after taking away each pixel's 3×3 neighbourhood mean (the fine detail
   a correlation locks onto). Defocus takes this away first; the sensor's read noise sets the floor */
function gld_sharp(F, n) {
  let s = 0, c = 0;
  for (let j = 1; j < n - 1; j++) for (let i = 1; i < n - 1; i++) {
    const k = j * n + i, m = (F[k - n - 1] + F[k - n] + F[k - n + 1] + F[k - 1] + F[k] + F[k + 1] + F[k + n - 1] + F[k + n] + F[k + n + 1]) / 9, d = F[k] - m;
    s += d * d; c++;
  }
  return Math.sqrt(s / c);
}
/** sharpness against lens height, as a fraction of the sharpness in focus: the curve on the focus slide. Three patches, averaged */
function gld_curve() {
  if (GLDP.curve) return GLDP.curve;
  const spots = [[256, 256], [128, 384], [400, 120]], f0 = spots.map(([x, y]) => gld_sharp(gld_view(GLDO.z0, x, y).frame, GLDO.n)), pts = [];
  for (let z = 1.80; z <= 3.0001; z += 0.025) pts.push([z, spots.reduce((s, [x, y], i) => s + gld_sharp(gld_view(z, x, y).frame, GLDO.n) / f0[i], 0) / spots.length]);
  GLDP.curve = { pts, s0: f0[0] };
  return GLDP.curve;
}

/* ---------- drawing the pictures ---------- */
const GLDC = new WeakMap();
/** a 0..1 picture (w × h) as a canvas, made once per array, in a cool neutral grey (the sensor sees in infrared: no colour) */
function gld_cv(P, w, h, o = {}) {
  let c = GLDC.get(P); if (c) return c;
  c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d'), id = g.createImageData(w, h), d = id.data, lo = o.lo == null ? 16 : o.lo, hi = o.hi == null ? 238 : o.hi, ga0 = o.gamma || 1;
  for (let i = 0; i < w * h; i++) { const v = lo + (hi - lo) * Math.pow(clamp(P[i]), ga0); d[i * 4] = v; d[i * 4 + 1] = v + 1; d[i * 4 + 2] = Math.min(255, v + 5); d[i * 4 + 3] = 255; }
  g.putImageData(id, 0, 0); GLDC.set(P, c); return c;
}
/** a picture canvas into a box: smoothed (the lens's image) or hard pixels (the sensor's frame), clipped to a rounded box */
function gld_pic(cv, x, y, w, h, o = {}) {
  G.save(); G.globalAlpha = o.alpha == null ? 1 : o.alpha;
  if (o.r) { rrPath(x, y, w, h, o.r); G.clip(); }
  G.imageSmoothingEnabled = !o.px; if (!o.px) G.imageSmoothingQuality = 'high';
  if (o.src) G.drawImage(cv, o.src[0], o.src[1], o.src[2], o.src[3], x, y, w, h); else G.drawImage(cv, x, y, w, h);
  G.restore();
}
/** the sensor's frame (36 × 36, in focus) with the pad's patch centred on texel (px, py): cached per frame number */
const GLDF = new Map();
function gld_frameAt(px, py, id) {
  const key = id + ':' + Math.round(px * 4) + ':' + Math.round(py * 4);
  let f = GLDF.get(key); if (f) return f;
  const S = 124, cx = Math.round(px), cy = Math.round(py), P = gld_blurPatch(cx, cy, S, 0);
  f = gld_frameOf(P, S, S / 2 + (px - cx), S / 2 + (py - cy), GLDO.n, GLDO.pix / GLDO.texMM, 11 + id);
  if (GLDF.size > 40) GLDF.delete(GLDF.keys().next().value);
  GLDF.set(key, f); return f;
}
/** the pad as a plane seen at a slant (an affine view: texel (u, v) → (X0 + sx·u + kx·v, Y0 + sy·v)), its centre texel at `off`,
   clipped to the quad between y0 and y1; a pool of light where the LED lands (o.pool = [u, v] relative to the centre, o.rad) */
function gld_plane(x0, x1, y0, y1, off, o = {}) {
  const sx = o.sx || 1.8, sy = o.sy || 0.76, kx = o.kx || 0.42, cx = o.cx, cy = o.cy, cv = gld_cv(gld_tex(), GLDP.N, GLDP.N), N = GLDP.N;
  G.save(); G.globalAlpha = o.alpha == null ? 1 : o.alpha;
  if (o.clipR) { rrPath(o.clipR[0], o.clipR[1], o.clipR[2], o.clipR[3], o.clipR[4]); G.clip(); }
  G.beginPath(); G.rect(x0, y0, x1 - x0, y1 - y0); G.clip();
  G.transform(sx, 0, kx, sy, cx - sx * off[0] - kx * off[1], cy - sy * off[1]);
  const u0 = Math.floor((off[0] - 1400 / sx) / N) * N, v0 = Math.floor((off[1] - 700 / sy) / N) * N;
  G.imageSmoothingEnabled = true; G.imageSmoothingQuality = 'high';
  for (let v = v0; v < off[1] + 700 / sy; v += N) for (let u = u0; u < off[0] + 1400 / sx; u += N) G.drawImage(cv, u, v, N, N);
  /* the light: a pool where the LED lands, the rest of the pad falls into shadow */
  const pu = off[0] + (o.pool ? o.pool[0] : 0), pv = off[1] + (o.pool ? o.pool[1] : 0), rad = o.rad || 260;
  const gr = G.createRadialGradient(pu, pv, rad * 0.15, pu, pv, rad);
  gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(6,7,9,' + (o.dark == null ? 0.78 : o.dark) + ')');
  G.fillStyle = gr; G.fillRect(off[0] - 1400 / sx, off[1] - 700 / sy, 2800 / sx, 1400 / sy);
  const P = (u, v) => [u, v];
  G.restore();
  return (u, v) => [cx + sx * (u - off[0]) + kx * (v - off[1]), cy + sy * (v - off[1])];
}
/** a lens in section: a biconvex glass element, cx, cy its centre, w its width, h its thickness */
function gld_lens(cx, cy, w, h, a = 1, o = {}) {
  if (a <= 0.003) return;
  G.save(); G.globalAlpha = a;
  const path = () => { G.beginPath(); G.moveTo(cx - w / 2, cy); G.quadraticCurveTo(cx, cy - h, cx + w / 2, cy); G.quadraticCurveTo(cx, cy + h, cx - w / 2, cy); G.closePath(); };
  path();
  const g = G.createLinearGradient(cx, cy - h / 2, cx, cy + h / 2);
  g.addColorStop(0, TH ? 'rgba(232,244,252,0.95)' : 'rgba(190,220,240,0.42)'); g.addColorStop(0.55, TH ? 'rgba(196,224,242,0.75)' : 'rgba(140,185,215,0.28)'); g.addColorStop(1, TH ? 'rgba(168,206,230,0.85)' : 'rgba(110,160,198,0.36)');
  G.fillStyle = g; G.fill(); G.strokeStyle = TH ? 'rgba(98,150,186,0.95)' : 'rgba(160,205,235,0.75)'; G.lineWidth = 2; G.stroke();
  /* a highlight along the upper face, and a soft caustic in the middle */
  G.beginPath(); G.moveTo(cx - w * 0.36, cy - h * 0.22); G.quadraticCurveTo(cx - w * 0.05, cy - h * 0.62, cx + w * 0.2, cy - h * 0.4); G.strokeStyle = 'rgba(255,255,255,' + (TH ? 0.95 : 0.5) + ')'; G.lineWidth = 3; G.lineCap = 'round'; G.stroke();
  if (o.glow) glow(cx, cy + h * 0.1, w * 0.32, o.glow, 0.22 * a);
  G.restore();
}
/** the image sensor: a die in its package, the pixel array on its lower face showing a strip of the current frame */
function gld_die(cx, cy, w, h, F, a = 1, o = {}) {
  if (a <= 0.003) return;
  G.save(); G.globalAlpha = a;
  const g = G.createLinearGradient(cx, cy - h / 2, cx, cy + h / 2); g.addColorStop(0, '#2b2c31'); g.addColorStop(1, '#151619');
  rrPath(cx - w / 2, cy - h / 2, w, h, 8); G.fillStyle = g; G.fill(); G.strokeStyle = TH ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.14)'; G.lineWidth = 1.5; G.stroke();
  /* the array: 36 columns, a few rows of the frame's middle, lit */
  const aw = w * 0.74, ax = cx - aw / 2, ay = cy + h / 2 - 10, n = GLDO.n, cw = aw / n, rows = 3;
  for (let r = 0; r < rows; r++) for (let i = 0; i < n; i++) {
    const v = F ? F[(16 + r) * n + i] : 0.3, gv = Math.round(30 + 200 * v);
    G.fillStyle = `rgb(${gv},${gv + 2},${Math.min(255, gv + 8)})`; G.fillRect(ax + i * cw + 0.5, ay - (rows - r) * cw * 0.9 + 0.5, cw - 1, cw * 0.9 - 1);
  }
  if (o.glow) glow(cx, ay, aw * 0.55, o.glow, 0.25);
  G.restore();
}
/** a small LED: a dome on a pad, lit */
function gld_led(x, y, col, a = 1, on = 1) {
  if (a <= 0.003) return;
  G.save(); G.globalAlpha = a;
  rrPath(x - 18, y - 6, 36, 14, 4); G.fillStyle = TH ? '#3a3b40' : '#2a2b30'; G.fill();
  G.beginPath(); G.arc(x, y - 6, 12, Math.PI, 0); G.closePath(); G.fillStyle = mix('#e9eef0', col, 0.35); G.fill(); G.strokeStyle = TH ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.3)'; G.lineWidth = 1.5; G.stroke();
  G.restore();
  if (on > 0) glow(x, y - 8, 46, col, 0.55 * a * on);
}
/** a dot running along a polyline, at fraction k (0..1), as a light */
function gld_photon(pts, k, col, a = 1, r = 4) {
  let L = 0; const seg = []; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); L += d; }
  let s = clamp(k) * L;
  for (let i = 0; i < seg.length; i++) { if (s <= seg[i] || i === seg.length - 1) { const u = seg[i] ? clamp(s / seg[i]) : 0, x = lerp(pts[i][0], pts[i + 1][0], u), y = lerp(pts[i][1], pts[i + 1][1], u); glow(x, y, r * 3.2, col, 0.5 * a); circle(x, y, r * 0.6, { fill: '#ffffff', alpha: 0.9 * a }); return [x, y]; } s -= seg[i]; }
}
/** where the pad is under the sensor at slide time t, in texels: a slow, slightly curving glide */
const gld_glide = t => [256 + 9.5 * t, 256 - 3.4 * t + 7 * Math.sin(0.45 * t)];

/* ============================== the sensor is a camera ============================== */
const GLD_FPS = [
  { name: 'ADNS-2610', arr: '18 × 18', fps: 1500, ips: 12 },
  { name: 'ADNS-3080', arr: '30 × 30', fps: 6469, ips: 40 },
  { name: 'PMW3360', arr: '36 × 36', fps: 12000, ips: 250 },
  { name: 'PAW3395', arr: 'Not given', fps: null, ips: 650 }
];
S({
  id: 'gld_camera', ch: 'glide', theme: 'paper', title: 'Optical sensor: a camera', settle: 11, after: 'dots',
  src: ['gld_adns2610', 'gld_adns3080', 'gld_pmw3360', 'gld_paw3395o'],
  draw: t => {
    header(t, 'Optical sensor: a camera');
    captions(t, [[0.6, 'An optical sensor is a camera. An LED lights the pad at a low angle, a lens images a small patch of it, and an image sensor takes thousands of pictures a second.'], [6.0, 'Nothing in it measures motion. It compares each picture with the last, so everything depends on the picture being sharp.']]);
    const A = acc(), top = 300, bot = 976, gap = 48, lw0 = 960, rx = LM + lw0 + gap, rw = RM - rx;
    /* ---- left: inside the sensor, in section (not to scale) ---- */
    const x = LM, y = top, w = lw0, h = bot - top;
    demoWindow(x, y, w, h, ep(t, 0.2, 0.7));
    cardHead(t, 0.4, x, y, w, 'Inside the sensor, in section', ['datasheet']);
    const off = gld_glide(t), fid = Math.floor(Math.max(0, t - 1.0) / 0.25), offF = gld_glide(1.0 + fid * 0.25), F = gld_frameAt(offF[0], offF[1], fid);
    const cx = x + 580, pcy = y + 572, kp = ep(t, 0.5, 1.4);
    /* the pad: a plane at a slant, sliding under the sensor; the light pool sits under the lens */
    const map = gld_plane(x, x + w, y + 470, y + h, off, { cx, cy: pcy, sx: 1.9, sy: 0.8, kx: 0.5, rad: 210, pool: [-20, 0], alpha: kp, clipR: [x, y, w, h, Math.min(28, w / 6, h / 6)] });
    /* the patch the lens images (the frame's field of view, 108 texels), outlined on the plane */
    const q = [[-54, -54], [54, -54], [54, 54], [-54, 54]].map(([du, dv]) => map(off[0] + du, off[1] + dv)), kq = ep(t, 1.6, 2.1);
    poly(q.concat([q[0]]), { color: A, w: 2.5, alpha: kq, close: true });
    /* the LED, low on the left, and its light grazing the pad */
    const led = [x + 120, y + 462], kl = ep(t, 1.0, 1.5), on = kl * (0.85 + 0.15 * Math.sin(t * 9));
    G.save(); G.globalAlpha = 0.55 * kl; const lg = G.createLinearGradient(led[0], led[1], cx, pcy); lg.addColorStop(0, rgba(A, 0.6)); lg.addColorStop(1, rgba(A, 0.0));
    G.beginPath(); G.moveTo(led[0], led[1] - 8); G.lineTo(q[1][0] + 30, q[1][1] + 6); G.lineTo(q[2][0] - 20, q[2][1] + 4); G.lineTo(led[0], led[1] + 4); G.closePath(); G.fillStyle = lg; G.fill(); G.restore();
    gld_led(led[0], led[1], A, kl, on);
    /* the lens and the die above it; rays from three points of the patch, crossed (the picture lands upside down) */
    const ly = y + 330, lwid = 380, dy0 = y + 168, kL = ep(t, 1.3, 1.9), kD = ep(t, 1.5, 2.1), kr = ep(t, 2.0, 2.8);
    const objs = [map(off[0] - 46, off[1]), map(off[0], off[1]), map(off[0] + 46, off[1])], imgs = [[cx + 100, dy0 + 25], [cx, dy0 + 25], [cx - 100, dy0 + 25]];
    if (kr > 0) objs.forEach((p, i) => { for (const ax of [-0.3, 0.3]) { const L = [cx + ax * lwid, ly]; poly([p, L, imgs[i]], { color: rgba(A, i === 1 ? 0.75 : 0.4), w: i === 1 ? 2 : 1.5, p: kr }); } });
    glowField(t, cx, ly + 10, 260, { a: 0.9 * kL, cols: [A, mix(A, '#ffffff', 0.4), A] });
    gld_lens(cx, ly, lwid, 74, kL, { glow: A });
    gld_die(cx, dy0, 330, 50, F, kD, { glow: A });
    if (t > 2.8) for (let k = 0; k < 3; k++) { const ph = ((t - 2.8) * 0.55 + k / 3) % 1; gld_photon([objs[k], [cx + (k - 1) * 0.15 * lwid, ly], imgs[k]], ph, A, ep(t, 2.8, 3.2)); }
    /* labels: the parts on the right, the LED above itself, the patch on the pad in light ink */
    callout(t, 1.7, [cx + lwid / 2 - 6, ly], 'Lens, 1:1', { to: [cx + lwid / 2 + 50, ly - 50], side: 'r', color: C.ink2, tcolor: C.ink });
    callout(t, 1.9, [cx + 165, dy0], 'Image sensor', { to: [cx + lwid / 2 + 40, dy0 - 50], side: 'r', color: C.ink2, tcolor: C.ink });
    text('LED, 850 {nm} infrared', led[0] - 22, led[1] - 40, { role: 'label', size: 22, color: C.ink, alpha: ep(t, 1.3, 1.7) });
    callout(t, 2.2, q[3], 'The patch it images', { to: [q[3][0] - 70, y + h - 34], side: 'l', color: '#E9E8E3', tcolor: '#E9E8E3' });
    text('"Optically acquiring sequential surface images (frames)"', x + 32, y + 104, { role: 'small', size: 25, weight: 600, color: C.ink2, maxW: 330, lh: 1.32, alpha: ep(t, 2.6, 3.0) });
    pill(x + 32, y + 214, 'datasheet', ep(t, 2.8, 3.2), { text: 'ADNS-2610' });
    /* ---- right top: one frame, as the sensor records it ---- */
    const ty = top, th = 330;
    demoWindow(rx, ty, rw, th, ep(t, 0.5, 1.0));
    cardHead(t, 0.6, rx, ty, rw, 'One frame, as recorded', ['datasheet']);
    const fs = 220, fx = rx + 28, fy = ty + 84, kf0 = ep(t, 1.2, 1.8);
    gld_pic(gld_cv(F, GLDO.n, GLDO.n), fx, fy, fs, fs, { px: true, r: 10, alpha: kf0 });
    /* each new frame: a quick light sweep down the picture */
    { const ph = ((t - 1.0) % 0.25) / 0.25; if (t > 1.2 && ph < 0.6) { G.save(); rrPath(fx, fy, fs, fs, 10); G.clip(); const yy = fy + fs * E.out3(ph / 0.6), gg = G.createLinearGradient(0, yy - 40, 0, yy); gg.addColorStop(0, 'rgba(255,255,255,0)'); gg.addColorStop(1, 'rgba(255,255,255,0.22)'); G.fillStyle = gg; G.fillRect(fx, yy - 40, fs, 40); G.restore(); } }
    const tx = fx + fs + 44, tmw = RM - 26 - tx;
    rich([{ s: '1,296', role: 'stat', size: 76, color: C.ink, count: [1.6, 1.0] }], tx, ty + 150, { t, alpha: ep(t, 1.5, 1.8) });
    text('Pixels a frame, PMW3360', tx, ty + 190, { role: 'small', size: 25, color: C.mute, maxW: tmw, lh: 1.3, alpha: ep(t, 1.8, 2.2) });
    text('36 × 36', tx, ty + 226, { role: 'label', size: 21, color: C.faint, alpha: ep(t, 1.9, 2.3) });
    rich([{ s: 'Frame', role: 'label', size: 21, color: C.mute }, { s: fmt(1 + fid), font: 'mono', size: 30, weight: 700, color: A, tnum: true, gap: 16 }], tx, ty + 282, { alpha: ep(t, 2.0, 2.4) });
    text('3,000 × slower than life', tx, ty + 318, { role: 'label', size: 19, color: C.faint, alpha: ep(t, 2.2, 2.6) });
    /* ---- right bottom: frames a second, as each maker publishes them, and how far the pad moves in one ---- */
    const by = ty + th + 30, bh = bot - by;
    demoWindow(rx, by, rw, bh, ep(t, 0.8, 1.3));
    cardHead(t, 0.9, rx, by, rw, 'Frames a second', ['datasheet', 'derived']);
    const bx = rx + 270, bw = 190, ca = ep(t, 2.8, 3.2);
    text('Sensor', rx + 26, by + 92, { role: 'label', size: 19, color: C.faint, alpha: ca });
    text('Frames a second', bx, by + 92, { role: 'label', size: 19, color: C.faint, alpha: ca });
    text('Moves a frame', RM - 26, by + 92, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: ca });
    GLD_FPS.forEach((r, i) => {
      const yy = by + 136 + i * 40, tt = 3.0 + i * 0.25, a = ep(t, tt, tt + 0.4), k = ep(t, tt + 0.1, tt + 1.0, E.snap);
      if (a <= 0.003) return;
      const nw = text(r.name, rx + 26, yy, { font: 'mono', size: 23, weight: 700, color: C.ink, alpha: a }).w;
      if (!r.fps) { text('Frame rate and array not published; 650 ips', rx + 26 + nw + 18, yy, { role: 'small', size: 25, color: C.faint, alpha: a }); return; }
      text(r.arr, rx + 26 + nw + 14, yy, { role: 'label', size: 19, color: C.mute, alpha: a });
      rr(bx, yy - 13, bw, 12, 6, C.track, null, 0, a); rr(bx, yy - 13, Math.max(12, bw * r.fps / 12000 * k), 12, 6, C.comp, null, 0, a);
      text(fmt(Math.round(r.fps * k)), bx + bw + 16, yy, { font: 'mono', size: 23, weight: 700, color: C.ink, tnum: true, alpha: a });
      text(fmtN(r.ips * 25.4 / r.fps, 2) + ' mm', RM - 26, yy, { font: 'mono', size: 23, weight: 700, color: C.ink, align: 'right', alpha: a * ep(t, tt + 0.6, tt + 1.0) });
    });
    text('Max ips × 25.4 ÷ frames a second', RM - 26, by + bh - 22, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: ep(t, 4.4, 4.8) });
  }
});

/* ============================== frame correlation: two pictures become a count ============================== */
/* a capture every GLDK.P s of slide time (slowed down: a real sensor takes thousands a second). The pad moves about 2.5 px
   between captures; the DSP tries every shift in ±5 px, keeps the best, refines it to a fraction of a pixel, and the shift
   times the pixel's size on the pad becomes counts at the CPI setting */
const GLDK = { t0: 1.6, P: 2.6, S: 5, cpi: 800 };
function gld_kpos(k) { let x = 180, y = 300; for (let i = 0; i < k; i++) { x += 7.4 + 1.6 * Math.sin(i * 1.3); y += -3.3 + 1.3 * Math.cos(i * 0.9); } return [x, y]; }
const GLDM = new Map();
function gld_kcycle(k) {
  let c = GLDM.get(k); if (c) return c;
  const pa = gld_kpos(k), pb = gld_kpos(k + 1), A = gld_frameAt(pa[0], pa[1], 1000 + k), B = gld_frameAt(pb[0], pb[1], 1001 + k), m = gld_match(A, B, GLDO.n, GLDK.S), px = GLDO.pix / GLDO.texMM;
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
    const A = acc(), top = 300, th = 460, gap = 40, tw0 = (RM - LM - 2 * gap) / 3, X0 = i => LM + i * (tw0 + gap), n = GLDO.n;
    const u = Math.max(0, t - GLDK.t0), k = Math.floor(u / GLDK.P), ph = (u % GLDK.P) / GLDK.P, live = t >= GLDK.t0;
    const c = gld_kcycle(k), prev = k > 0 ? gld_kcycle(k - 1) : null;
    const scan = live ? prog(ph, 0.15, 0.62) : 0, nS = 2 * GLDK.S + 1, nT = nS * nS, iScan = Math.min(nT - 1, Math.floor(scan * nT)), found = live && ph >= 0.62;
    /* ---- tile 1: two frames ---- */
    { const x = X0(0); demoWindow(x, top, tw0, th, ep(t, 0.2, 0.7));
      cardHead(t, 0.3, x, top, tw0, 'Two frames in a row', ['derived']);
      const fs = (tw0 - 56 - 24) / 2, fy = top + 92, ka = ep(t, 0.8, 1.3), flash = live && ph < 0.15 ? 1 - ph / 0.15 : 0;
      gld_pic(gld_cv(c.A, n, n), x + 28, fy, fs, fs, { px: true, r: 10, alpha: ka });
      gld_pic(gld_cv(c.B, n, n), x + 28 + fs + 24, fy, fs, fs, { px: true, r: 10, alpha: ka });
      if (flash > 0) rr(x + 28 + fs + 24, fy, fs, fs, 10, 'rgba(255,255,255,' + (0.5 * flash) + ')', null, 0, 1);
      /* three features: where they are in frame n, and where they went in frame n + 1 */
      const sc = fs / n, kf1 = ep(t, 2.2, 2.6), sh = c.d;
      c.fa.forEach(([fx0, fy0]) => {
        const pA = [x + 28 + (fx0 + 0.5) * sc, fy + (fy0 + 0.5) * sc], pB = [x + 28 + fs + 24 + (fx0 + 0.5 - sh[0]) * sc, fy + (fy0 + 0.5 - sh[1]) * sc], pB0 = [x + 28 + fs + 24 + (fx0 + 0.5) * sc, fy + (fy0 + 0.5) * sc];
        circle(pA[0], pA[1], 9, { color: A, w: 2.5, alpha: kf1 });
        circle(pB0[0], pB0[1], 9, { color: A, w: 1.5, dash: [3, 3], alpha: 0.7 * kf1 });
        arrow(pB0[0], pB0[1], pB[0], pB[1], { color: A, w: 2.5, hs: 8, alpha: kf1 });
        circle(pB[0], pB[1], 9, { color: A, w: 2.5, alpha: kf1 });
      });
      text('Frame n', x + 28, fy + fs + 36, { role: 'label', size: 21, color: C.mute, alpha: ka });
      text('Frame n + 1', x + 28 + fs + 24, fy + fs + 36, { role: 'label', size: 21, color: C.mute, alpha: ka });
      const um = Math.hypot(c.d[0], c.d[1]) * GLDO.pix * 1000;
      text('The pad moved ' + fmtN(um, 0) + ' µm between them: the same features, a little to one side.', x + 28, fy + fs + 86, { role: 'small', size: 25, color: C.ink2, maxW: tw0 - 56, lh: 1.32, alpha: ep(t, 2.4, 2.8) }); }
    /* ---- tile 2: every shift, compared ---- */
    { const x = X0(1); demoWindow(x, top, tw0, th, ep(t, 0.4, 0.9));
      cardHead(t, 0.5, x, top, tw0, 'Every shift, compared', ['derived']);
      const ds = 226, ms = tw0 - 56 - 24 - ds, cs = ms / nS, fy = top + 92, ka = ep(t, 1.0, 1.5);
      const tri = found ? c.m.best : [(iScan % nS) - GLDK.S, Math.floor(iScan / nS) - GLDK.S], D = found ? (c.Dbest || (c.Dbest = gld_diff(c.A, c.B, n, c.m.sub[0], c.m.sub[1]))) : gld_diff(c.A, c.B, n, tri[0], tri[1]);
      gld_pic(gld_cv(D, n, n), x + 28, fy, ds, ds, { px: true, r: 10, alpha: ka });
      /* the match map: each cell one shift, brighter for a better match; filled in the order the DSP tries them */
      const mx = x + 28 + ds + 24, mm = c.m.map; let lo = 1e9, hi = -1e9; for (const v of mm) { lo = Math.min(lo, v); hi = Math.max(hi, v); }
      const shown = live ? (found ? nT : iScan + 1) : 0;
      G.save(); G.globalAlpha = ka; rrPath(mx - 4, fy - 4, ms + 8, ms + 8, 10); G.fillStyle = TH ? '#EEEDE8' : '#0F1012'; G.fill(); G.restore();
      for (let q = 0; q < nT; q++) {
        const ci = q % nS, cj = Math.floor(q / nS), qx = mx + ci * cs, qy = fy + cj * cs;
        if (q >= shown) { rr(qx + 1.5, qy + 1.5, cs - 3, cs - 3, 3, inkA(0.06), null, 0, ka); continue; }
        const good = 1 - (mm[q] - lo) / Math.max(1e-6, hi - lo);
        rr(qx + 1.5, qy + 1.5, cs - 3, cs - 3, 3, mix(TH ? '#E2E1DC' : '#1B1C20', A, Math.pow(good, 3)), null, 0, ka);
      }
      if (live && !found) rr(mx + (iScan % nS) * cs, fy + Math.floor(iScan / nS) * cs, cs, cs, 4, null, C.ink, 2, ka);
      if (found) { const bi = c.m.best[0] + GLDK.S, bj = c.m.best[1] + GLDK.S, pr = ep(ph, 0.62, 0.7, E.snap); rr(mx + bi * cs - 3, fy + bj * cs - 3, cs + 6, cs + 6, 6, null, C.ink, 2.5, pr); gld_pulse(t, GLDK.t0 + (k + 0.62) * GLDK.P, [mx + (bi + 0.5) * cs, fy + (bj + 0.5) * cs], 16, A, 1.2); }
      line(mx + (GLDK.S + 0.5) * cs, fy - 12, mx + (GLDK.S + 0.5) * cs, fy - 4, { color: C.faint, w: 1.5, alpha: ka });
      line(mx - 12, fy + (GLDK.S + 0.5) * cs, mx - 4, fy + (GLDK.S + 0.5) * cs, { color: C.faint, w: 1.5, alpha: ka });
      text('Difference', x + 28, fy + ds + 36, { role: 'label', size: 21, color: C.mute, alpha: ka });
      text('Match, ±5 px', mx, fy + ds + 36, { role: 'label', size: 21, color: C.mute, alpha: ka });
      const sxy = live ? tri : [0, 0];
      rich([{ s: 'Shift', role: 'label', size: 21, color: C.mute }, { s: (sxy[0] >= 0 ? '+' : '−') + Math.abs(sxy[0]) + ', ' + (sxy[1] >= 0 ? '+' : '−') + Math.abs(sxy[1]), font: 'mono', size: 30, weight: 700, color: found ? A : C.ink, gap: 16, tnum: true }, { s: 'px', role: 'label', size: 21, color: C.mute, gap: 10 }, { s: found ? 'Best match' : 'Trying', role: 'label', size: 21, color: found ? A : C.faint, gap: 26 }], x + 28, fy + ds + 96, { alpha: ep(t, 1.4, 1.8) }); }
    /* ---- tile 3: the shift, as counts ---- */
    { const x = X0(2); demoWindow(x, top, tw0, th, ep(t, 0.6, 1.1));
      cardHead(t, 0.7, x, top, tw0, 'The shift, as counts', ['derived']);
      const show = found || (prev && live), cc = found ? c : prev, kk = found ? ep(ph, 0.62, 0.8) : 1, sub = cc ? cc.m.sub : [0, 0], ka = ep(t, 1.2, 1.6) * (show ? 1 : 0.35);
      const cnt = v => v * GLDO.pix * GLDK.cpi / 25.4, sg = v => (v >= 0 ? '+' : '−') + fmtN(Math.abs(v), 2);
      [['ΔX', sub[0]], ['ΔY', sub[1]]].forEach(([nm, v], i) => {
        const yy = top + 168 + i * 86;
        rich([{ s: nm, role: 'label', size: 22, color: C.mute }, { s: show ? sg(v) : '0.00', role: 'stat', size: 70, color: C.ink, gap: 22, tnum: true }, { s: 'px', font: 'mono', size: 24, weight: 600, color: C.mute, gap: 12 }], x + 28, yy, { alpha: ka });
        text(show ? sg(cnt(v)) + ' counts' : '', x + tw0 - 28, yy, { font: 'mono', size: 26, weight: 700, color: A, align: 'right', alpha: ka * kk });
      });
      text('Sub-pixel: a parabola through the best three scores. × 30 µm a pixel, at 800 CPI.', x + 28, top + 300, { role: 'small', size: 25, color: C.mute, maxW: tw0 - 56, lh: 1.3, alpha: ep(t, 2.0, 2.4) });
      /* a small screen: the pointer moves by the counts the reports carry */
      const sx0 = x + 28, sy0 = top + 352, sw = tw0 - 56, sh0 = 82, kS = ep(t, 1.6, 2.0);
      rr(sx0, sy0, sw, sh0, 10, TH ? '#EEEDE8' : '#0F1012', inkA(0.12), 1.5, kS);
      let cxp = 0, cyp = 0; for (let i = 0; i < k; i++) { const s0 = gld_kcycle(i).m.sub; cxp += s0[0]; cyp += s0[1]; }
      if (found) { cxp += c.m.sub[0] * kk; cyp += c.m.sub[1] * kk; }
      const scr = 9, ox = sx0 + 40, oy = sy0 + sh0 / 2 + 10;
      clipped(sx0, sy0, sw, sh0, () => { line(ox, oy, ox + cxp * scr, oy + cyp * scr, { color: rgba(A, 0.5), w: 2, dash: [4, 4], alpha: kS }); cursorPtr(ox + cxp * scr, oy + cyp * scr, { a: kS, s: 0.8 }); }); }
    /* ---- the strip: the word, and where the method comes from ---- */
    const sy = top + th + 34, hw = (RM - LM - 40) / 2;
    glossBox(t, 3.2, LM, sy, hw, 'Correlation', 'Sliding one picture over another and scoring how well they match at each offset; the best score is the shift.');
    sourceBox(t, 3.5, LM + hw + 40, sy, hw, 'ADNS-2610', 'The frames "are processed by the DSP to determine the direction and distance of motion." Model here: 36 × 36 frame, 30 µm pixels.', { kind: 'datasheet' });
  }
});

/* ============================== focus: a 0.2 mm window ============================== */
/* the lens height over the slide: the pointer drags the pad too close, then too far, then back to 2.4 mm */
const GLDZ = [[0, 2.4], [2.2, 2.4], [4.0, 2.0], [4.7, 2.0], [7.2, 2.86], [7.9, 2.86], [9.5, 2.4]];
const gld_zAt = t => kf(t, GLDZ, E.io3);
/** the state at a height: Brock's window (sharp), PixArt's window (soft), or out of both (lost, under 30 % sharpness) */
function gld_state(z, sh) { return Math.abs(z - 2.4) <= 0.1 + 1e-6 ? 0 : (Math.abs(z - 2.4) <= 0.2 + 1e-6 && sh >= 0.3) ? 1 : sh >= 0.3 ? 1 : 2; }
const GLD_ST = [{ l: 'Sharp', c: () => C.hero }, { l: 'Soft: fewer features', c: () => C.second }, { l: 'Lost: nothing to match', c: () => C.bad }];
function gld_sharpAt(z) { const P = gld_curve().pts; if (z <= P[0][0]) return P[0][1]; for (let i = 1; i < P.length; i++) if (z <= P[i][0]) { const k = (z - P[i - 1][0]) / (P[i][0] - P[i - 1][0]); return lerp(P[i - 1][1], P[i][1], k); } return P[P.length - 1][1]; }
S({
  id: 'focus', ch: 'glide', theme: 'night', title: 'Focus: a 0.2 mm window', settle: 14, replaces: 'focus', after: 'gld_corr', ideas: [11],
  src: ['gld_brock02', 'gld_paw3395o', 'gld_pmw3360', 'gld_adns2610', 'gld_adns3080'],
  draw: t => {
    header(t, 'Focus: a 0.2 mm window');
    captions(t, [[0.6, 'The lens has one height where the pad is sharp. Bring the pad closer or push it away and every fibre spreads into a disc of blur.'], [9.6, 'PixArt allows 2.2 to 2.6 mm, a 0.4 mm window, and most makers design to all of it. I\'ve found the sensor is at its best in the middle 0.2 mm.']]);
    const A = acc(), top = 296, bot = 952, gap = 24, bx = LM, bw = 1000, bh = bot - top, rx = bx + bw + gap, rw = RM - rx;
    const z = gld_zAt(t), o = gld_optics(z), sh = gld_sharpAt(z), st = gld_state(z, sh), SC = GLD_ST[st].c();
    /* ---------------- the lens, close up ---------------- */
    demoWindow(bx, top, bw, bh, tileA(t, 0.15, 0));
    cardHead(t, 0.35, bx, top, bw, 'The lens, in section', ['derived']);
    const lx = bx + 450, lyy = top + 318, sv = 90, shh = 720, Ymm = mm => lyy + mm * sv, ap = GLDO.A * shh / 2, k0 = tileA(t, 0.3, 1);
    const yPad = Ymm(z), yDie = lyy - GLDO.v0 * sv, yImg = lyy - o.v * sv;
    /* the pad, a lit plane whose top edge is the surface at z */
    gld_plane(bx, bx + bw, yPad, top + bh, [260, 250], { cx: lx, cy: yPad + 70, sx: 2.2, sy: 0.85, kx: 0.45, rad: 220, dark: 0.82, alpha: k0, clipR: [bx, top, bw, bh, 28] });
    line(bx + 28, yPad, bx + bw - 160, yPad, { color: rgba('#ffffff', 0.35), w: 1.5, alpha: k0 });
    /* the in-focus plane, 2.4 mm under the lens */
    line(bx + 28, Ymm(2.4), bx + bw - 160, Ymm(2.4), { color: inkA(0.28), w: 1.5, dash: [6, 6], alpha: ep(t, 1.0, 1.4) });
    text('In focus, 2.4 mm', bx + 32, Ymm(2.4) - 12, { role: 'label', size: 19, color: C.mute, alpha: ep(t, 1.0, 1.4) * (Math.abs(yPad - Ymm(2.4)) > 30 ? 1 : 0) });
    /* the light: a cone from one point of the pad through the lens, converging toward the image, cut by the die */
    const pObj = [lx, yPad], L = [lx - ap, lyy], R = [lx + ap, lyy], cHalf = (GLDO.A / 2) * Math.abs(1 - GLDO.v0 / o.v) * shh, kc = ep(t, 0.9, 1.6);
    G.save(); G.globalAlpha = kc; G.globalCompositeOperation = TH ? 'source-over' : 'lighter';
    const g1 = G.createLinearGradient(0, yPad, 0, lyy); g1.addColorStop(0, rgba(A, 0.55)); g1.addColorStop(1, rgba(A, 0.18));
    G.beginPath(); G.moveTo(pObj[0], pObj[1]); G.lineTo(L[0], L[1]); G.lineTo(R[0], R[1]); G.closePath(); G.fillStyle = g1; G.fill();
    const g2 = G.createLinearGradient(0, lyy, 0, yDie); g2.addColorStop(0, rgba(A, 0.2)); g2.addColorStop(1, rgba(A, 0.6)); G.fillStyle = g2;
    if (o.v >= GLDO.v0) { G.beginPath(); G.moveTo(L[0], L[1]); G.lineTo(lx - cHalf, yDie); G.lineTo(lx + cHalf, yDie); G.lineTo(R[0], R[1]); G.closePath(); G.fill(); }
    else { G.beginPath(); G.moveTo(L[0], L[1]); G.lineTo(lx, yImg); G.lineTo(R[0], R[1]); G.closePath(); G.fill(); G.beginPath(); G.moveTo(lx, yImg); G.lineTo(lx - cHalf, yDie); G.lineTo(lx + cHalf, yDie); G.closePath(); G.fill(); }
    G.restore();
    for (const [a0, b0] of [[L, -1], [R, 1]]) { const e0 = [lx + b0 * -cHalf * (o.v >= GLDO.v0 ? -1 : 1), yDie]; poly([pObj, a0, o.v >= GLDO.v0 ? [lx + b0 * cHalf, yDie] : [lx, yImg]], { color: rgba(A, 0.9), w: 1.5, alpha: kc }); if (o.v < GLDO.v0) line(lx, yImg, lx - b0 * cHalf, yDie, { color: rgba(A, 0.9), w: 1.5, alpha: kc }); }
    if (o.v > GLDO.v0 + 0.01) { line(lx, yImg, lx, yDie, { color: rgba(A, 0.5), w: 1.5, dash: [3, 4], alpha: kc }); circle(lx, yImg, 4, { fill: A, alpha: kc }); text('Sharp image would form here', lx + 14, yImg + 6, { role: 'label', size: 19, color: C.mute, alpha: kc * clamp((yDie - yImg - 14) / 30) }); }
    glowField(t, lx, lyy, 300, { a: 0.75 * kc, cols: [A, mix(A, '#ffffff', 0.35), A] });
    gld_lens(lx, lyy, ap * 2 + 60, 80, k0, { glow: A });
    /* the die, and the circle of confusion on it: a glowing disc as wide as the blur */
    { const dw = 700, kd = tileA(t, 0.4, 2);
      G.save(); G.globalAlpha = kd; const gd = G.createLinearGradient(0, yDie - 44, 0, yDie); gd.addColorStop(0, '#26272c'); gd.addColorStop(1, '#141518'); rrPath(lx - dw / 2, yDie - 40, dw, 40, 10); G.fillStyle = gd; G.fill(); G.strokeStyle = 'rgba(255,255,255,0.12)'; G.lineWidth = 1.5; G.stroke(); G.restore();
      for (let i = -24; i <= 24; i++) rect(lx + i * 13 - 5, yDie - 7, 10, 5, { fill: 'rgba(255,255,255,0.07)', alpha: kd });
      const cw0 = Math.max(6, 2 * cHalf); glow(lx, yDie, cw0 * 0.9 + 18, A, 0.7 * kc); G.save(); G.globalAlpha = kc; G.beginPath(); G.ellipse(lx, yDie - 2, cw0 / 2, 7, 0, 0, TAU); G.fillStyle = mix(A, '#ffffff', 0.55); G.fill(); G.restore();
      text('Image sensor', lx - dw / 2 + 18, yDie - 54, { role: 'label', size: 19, color: C.mute, alpha: kd });
      /* the blur, written where it lands */
      const lab = o.cpx < 0.25 ? 'One point, one point' : 'Circle of confusion ' + fmtN(o.c * 1000, 0) + ' µm, ' + fmtN(o.cpx, 1) + ' pixels';
      text(lab, lx + dw / 2 - 18, yDie - 54, { role: 'label', size: 19, color: o.cpx < 1.0 ? C.mute : SC, align: 'right', alpha: kd * kc }); }
    /* the ruler: lens to pad, with the two windows, and the knob the pointer drags */
    const rlx = bx + bw - 118, kr = ep(t, 1.1, 1.6);
    G.save(); G.globalAlpha = kr;
    rr(rlx - 14, Ymm(2.2), 28, Ymm(2.6) - Ymm(2.2), 8, rgba(C.second, 0.32), null, 0, 1);
    rr(rlx - 14, Ymm(2.3), 28, Ymm(2.5) - Ymm(2.3), 8, gradH(rlx - 14, 28, C.heroGrad), null, 0, 1);
    G.restore();
    line(rlx, Ymm(1.8), rlx, Ymm(3.0), { color: inkA(0.3), w: 1.5, alpha: kr });
    for (let v = 1.8; v <= 3.0001; v += 0.1) { const maj = Math.abs(v * 5 - Math.round(v * 5)) < 1e-6; line(rlx - (maj ? 22 : 12), Ymm(v), rlx - 14, Ymm(v), { color: inkA(0.35), w: 1.2, alpha: kr }); if (maj) text(fmtN(v, 1), rlx - 30, Ymm(v) + 7, { role: 'tick', size: 19, color: C.mute, align: 'right', alpha: kr }); }
    text('0.2 mm', rlx + 26, Ymm(2.4) + 7, { font: 'mono', size: 22, weight: 700, color: C.heroText, alpha: ep(t, 9.8, 10.3) });
    text('0.4 mm', rlx + 26, Ymm(2.62) + 16, { font: 'mono', size: 22, weight: 700, color: C.secondText, alpha: ep(t, 10.1, 10.6) });
    text('Lens to pad, mm', rlx + 10, Ymm(1.8) - 22, { role: 'label', size: 19, color: C.mute, align: 'right', alpha: kr });
    const knob = [rlx, Ymm(z)], drag = t > 2.0 && t < 9.7;
    circle(knob[0], knob[1], 13, { fill: TH ? '#FFFFFF' : '#F3F2EE', alpha: kr }); circle(knob[0], knob[1], 13, { color: SC, w: 3, alpha: kr });
    const ptr = cursorAt(t, [[1.3, [rlx + 90, Ymm(2.4) + 70]], [1.9, [knob[0] + 4, Ymm(2.4) + 4]], [2.2, [rlx + 4, Ymm(2.4) + 4]], [4.0, [rlx + 4, Ymm(2.0) + 4]], [4.7, [rlx + 4, Ymm(2.0) + 4]], [7.2, [rlx + 4, Ymm(2.86) + 4]], [7.9, [rlx + 4, Ymm(2.86) + 4]], [9.5, [rlx + 4, Ymm(2.4) + 4]], [10.3, [rlx + 70, Ymm(2.4) + 90]]], [2.0], { grab: drag, a: ep(t, 1.2, 1.5) * (1 - ep(t, 10.2, 10.8)) });
    /* the big number: how far the pad is from the lens */
    text('Lens to pad', bx + 32, top + 108, { role: 'label', size: 21, color: C.mute, alpha: ep(t, 0.7, 1.1) });
    rich([{ s: fmtN(z, 2), role: 'stat', size: 84, color: C.ink, tnum: true }, { s: 'mm', font: 'mono', size: 26, weight: 600, color: C.mute, gap: 12 }], bx + 28, top + 190, { alpha: ep(t, 0.8, 1.2) });
    text('Widths drawn × 8', bx + 32, top + 226, { role: 'label', size: 19, color: C.faint, alpha: ep(t, 1.2, 1.6) });
    /* ---------------- what the sensor sees ---------------- */
    const vy = top, vh = 400;
    demoWindow(rx, vy, rw, vh, tileA(t, 0.15, 1));
    cardHead(t, 0.45, rx, vy, rw, 'What the sensor sees', ['derived']);
    const V = gld_view(z), vs = 288, vx = rx + 32, vyy = vy + 84, kv = tileA(t, 0.5, 3);
    gld_pic(gld_cv(V.img, V.L, V.L), vx, vyy, vs, vs, { r: 18, alpha: kv });
    const tx = vx + vs + 36;
    rich([{ s: String(Math.round(sh * 100)), role: 'stat', size: 76, color: C.ink, tnum: true }, { s: '%', font: 'disp', size: 34, weight: 700, color: C.mute, gap: 6 }], tx, vyy + 70, { alpha: kv });
    text('Sharpness, of in focus', tx, vyy + 104, { role: 'label', size: 19, color: C.mute, alpha: kv });
    gld_lamp(tx + 10, vyy + 156, GLD_ST[st].l, true, SC, kv);
    /* three fixed views, so a still frame tells it too: too close, in focus, too far */
    const thz = [[1.9, 'Too close'], [2.4, 'In focus'], [2.9, 'Too far']], ts = 96, tgap = (RM - 32 - tx - 3 * ts) / 2;
    thz.forEach(([zz, nm], i) => { const Vt = gld_view(zz), xx = tx + i * (ts + tgap), a = ep(t, 1.8 + i * 0.15, 2.2 + i * 0.15); gld_pic(gld_cv(Vt.img, Vt.L, Vt.L), xx, vyy + 192, ts, ts, { r: 12, alpha: a }); text(fmtN(zz, 1) + ' mm', xx, vyy + 192 + ts + 26, { role: 'label', size: 19, color: C.mute, alpha: a }); });
    /* ---------------- sharpness against height ---------------- */
    const cy0 = vy + vh + gap, ch = bot - cy0;
    demoWindow(rx, cy0, rw, ch, tileA(t, 0.15, 2));
    cardHead(t, 0.55, rx, cy0, rw, 'Sharpness against lens height', ['derived']);
    const P = gld_curve().pts, gx = rx + 70, gw = rw - 70 - 32, gy = cy0 + 84, gh = ch - 84 - 56, X = v => gx + gw * (v - 1.8) / 1.2, Y = v => gy + gh * (1 - v), kg = ep(t, 1.0, 1.5);
    G.save(); G.globalAlpha = kg; G.fillStyle = rgba(C.second, 0.16); G.fillRect(X(2.2), gy, X(2.6) - X(2.2), gh); G.fillStyle = rgba(C.hero, 0.22); G.fillRect(X(2.3), gy, X(2.5) - X(2.3), gh); G.restore();
    for (const v of [0, 0.5, 1]) { line(gx, Y(v), gx + gw, Y(v), { color: C.hair, w: 1, alpha: kg }); text(Math.round(v * 100) + '%', gx - 12, Y(v) + 7, { role: 'tick', size: 19, color: C.mute, align: 'right', alpha: kg }); }
    for (const v of [1.8, 2.0, 2.2, 2.4, 2.6, 2.8, 3.0]) text(fmtN(v, 1), X(v), gy + gh + 28, { role: 'tick', size: 19, color: C.mute, align: 'center', alpha: kg });
    line(gx, Y(0.3), gx + gw, Y(0.3), { color: C.bad, w: 1.5, dash: [5, 5], alpha: kg });
    text('Lost', gx + gw - 4, Y(0.3) - 8, { role: 'label', size: 19, color: C.bad, align: 'right', alpha: kg });
    /* the curve draws itself as the pointer explores, and is whole once it lets go */
    const seen = t < 2.2 ? [2.4, 2.4] : t < 4.0 ? [z, 2.4] : t < 7.2 ? [2.0, Math.max(2.4, z)] : [2.0, 2.86], full = ep(t, 9.6, 11.0);
    const lo0 = lerp(seen[0], 1.8, full), hi0 = lerp(seen[1], 3.0, full), pts = P.filter(p => p[0] >= lo0 - 1e-6 && p[0] <= hi0 + 1e-6).map(p => [X(p[0]), Y(p[1])]);
    if (pts.length > 1) poly(monoCurve(pts, 3), { color: C.ink, w: 3, alpha: kg });
    circle(X(z), Y(sh), 8, { fill: SC, alpha: kg }); circle(X(z), Y(sh), 15, { color: SC, w: 1.5, alpha: 0.5 * kg });
    text('Lens to pad, mm', gx + gw, gy - 14, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: kg });
    /* the model, in a line */
    source(t, 'Model: thin lens at 1:1 and 2.4 mm (PixArt), aperture set so the blur is one 30 µm pixel at ±0.1 mm. Sharpness: fine contrast of the simulated frame. 0.2 mm: Brock\'s estimate; 0.4 mm: PixArt\'s window.', { t0: 2 });
  }
});
