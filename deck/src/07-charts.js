/* ============================================================================================
   charts: the comparison components. Comparisons sell mice, so they get the most care.
   One rule across all of them: Theseus is blue (C.hero; its gradient only on its type), the best mouse shipping today
   (the reference, the one to beat) is the second highlight, yellow (C.ref), every other mouse is grey (C.comp), and
   anything dominated or out of scope is a lighter grey (C.comp2). Marks and bars are flat colour.
   Every chart animates from its own t0 and is a pure function of t. Every chart takes an `ev` (evidence kind)
   and prints it as a pill. Placeholder data must say so: pass placeholder: true and the chart stamps itself.
   APIs are documented in DESIGN.md with an example each.
   ============================================================================================ */

/** colour of a datum by its role: { hero, ref, dim, color } */
function roleCol(d) { return d.color || (d.hero ? C.hero : d.ref ? C.ref : d.dim ? C.comp2 : C.comp); }
/** the Theseus marker: a blue diamond, slightly rounded (its shape, not only its colour, says Theseus) */
function heroMark(x, y, r = 12, a = 1, o = {}) {
  if (a <= 0.003) return;
  G.save(); G.globalAlpha = a; G.translate(x, y); G.rotate(Math.PI / 4);
  G.fillStyle = o.fill || C.hero; rrPath(-r * 0.75, -r * 0.75, r * 1.5, r * 1.5, r * 0.22); G.fill();
  if (o.edge) { G.strokeStyle = o.edge; G.lineWidth = 2; G.strokeRect(-r * 0.75, -r * 0.75, r * 1.5, r * 1.5); }
  G.restore();
}
/** a smooth curve through points sorted by x that never overshoots them (monotone cubic, Fritsch-Carlson), sampled
   every ~4 px: the frontier is a rounded edge, not a staircase, and it never bulges past a point it joins */
function monoCurve(P, step = 4) {
  const n = P.length; if (n < 2) return P.slice();
  const h = [], d = [], m = new Array(n);
  for (let i = 0; i < n - 1; i++) { h.push(Math.max(1e-6, P[i + 1][0] - P[i][0])); d.push((P[i + 1][1] - P[i][1]) / h[i]); }
  m[0] = d[0]; m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) {
    if (d[i - 1] * d[i] <= 0) { m[i] = 0; continue; }
    const w1 = 2 * h[i] + h[i - 1], w2 = h[i] + 2 * h[i - 1];
    m[i] = (w1 + w2) / (w1 / d[i - 1] + w2 / d[i]);
  }
  const out = [];
  for (let i = 0; i < n - 1; i++) {
    const x0 = P[i][0], y0 = P[i][1], y1 = P[i + 1][1], hh = h[i], N = Math.max(2, Math.ceil(Math.hypot(hh, y1 - y0) / step));
    for (let j = 0; j < N; j++) {
      const u = j / N, u2 = u * u, u3 = u2 * u;
      out.push([x0 + hh * u, (2 * u3 - 3 * u2 + 1) * y0 + (u3 - 2 * u2 + u) * hh * m[i] + (-2 * u3 + 3 * u2) * y1 + (u3 - u2) * hh * m[i + 1]]);
    }
  }
  out.push(P[n - 1].slice());
  return out;
}
/** stamp for charts built on placeholder numbers: a dashed frame in the problem colour and a tag. Remove when the data file lands */
function placeholderStamp(t, x, y, w, h, o = {}) {
  const a = ep(t, o.t0 || 0.3, (o.t0 || 0.3) + 0.4); if (a <= 0.003) return;
  G.save(); G.globalAlpha = a * 0.7; G.setLineDash([10, 8]); G.strokeStyle = C.bad; G.lineWidth = 2; rrPath(x - 6, y - 6, w + 12, h + 12, 6); G.stroke(); G.restore();
  const pw = pillW('placeholder');
  pill(x + w - pw - 8, y - 14, 'placeholder', a);
}
/** a legend row. items: [{ kind: 'hero' | 'ref' | 'comp' | 'dim' | 'ring' | 'line' | 'dash' | 'area', color, label }] → returns width */
function legend(t, t0, x, y, items, o = {}) {
  const gap = o.gap || 30, sz = o.size || 21;
  if (o.align === 'right') { const tot = items.reduce((a, it) => a + (it.kind === 'line' || it.kind === 'dash' ? 38 : 30) + tw(it.label, { role: 'label', size: sz }) + gap, 0) - gap; x -= tot; }
  let xx = x;
  items.forEach((it, i) => {
    const a = ep(t, t0 + i * 0.08, t0 + i * 0.08 + 0.35); const col = it.color || roleCol({ hero: it.kind === 'hero', ref: it.kind === 'ref', dim: it.kind === 'dim' });
    if (it.kind === 'hero') heroMark(xx + 9, y - 8, 9, a);
    else if (it.kind === 'ring') circle(xx + 9, y - 8, 7, { color: col, w: 2.5, alpha: a });
    else if (it.kind === 'line') line(xx, y - 8, xx + 26, y - 8, { color: col, w: 3, alpha: a });
    else if (it.kind === 'dash') line(xx, y - 8, xx + 26, y - 8, { color: col, w: 3, dash: [5, 4], alpha: a });
    else if (it.kind === 'area') rect(xx, y - 18, 22, 20, { fill: col, alpha: a * 0.5 });
    else if (it.kind === 'dot') circle(xx + 9, y - 8, 7, { fill: col, alpha: a });
    else rect(xx, y - 18, 20, 20, { fill: col, alpha: a });
    const w0 = it.kind === 'line' || it.kind === 'dash' ? 38 : 30;
    text(it.label, xx + w0, y, { role: 'label', size: o.size || 21, color: it.tcolor || C.mute, alpha: a });
    xx += w0 + tw(it.label, { role: 'label', size: o.size || 21 }) + gap;
  });
  return xx - x - gap;
}
/** a nice axis: ticks from a range */
function niceTicks(lo, hi, n = 5) {
  const span = hi - lo, step0 = span / n, mag = Math.pow(10, Math.floor(Math.log10(step0))), r = step0 / mag;
  const step = (r < 1.5 ? 1 : r < 3 ? 2 : r < 7 ? 5 : 10) * mag, out = [];
  for (let v = Math.ceil(lo / step - 1e-9) * step; v <= hi + 1e-9; v += step) out.push(+v.toFixed(10));
  return out;
}
const fmtN = (v, d) => d == null ? String(v) : Number(v).toFixed(d);

/* ---------- XBAB bar chart: bars, every sample as a jittered dot, 95 % CI whiskers, the value above, n and CI below ----------
   o = { x, y, w, h (the plot frame), t0, dir: 'v' (default) | 'h',
         bars: [{ name, sub, v, ci: [lo, hi], n, samples: [..] | { n, sd, seed } (drawn as dots), hero, ref, dim, color, label, ev }],
         yr: [min, max], ticks, fmt (tick label), unit ('µs'), dec (value decimals), axis (axis title, mono caps),
         frame (draw the box, default true), foot (print CI and n under each bar, default when any bar has ci or n),
         barW (share of each slot, 0.56), title, ev, labelAt ('ci': put values above the whisker, not the dots), placeholder }
   Room: a vertical chart writes names and the CI foot in the ~130 px under its frame; a horizontal one writes names
   right-aligned in the space left of x. Real samples only: synthesised dots ({ n, sd }) are for sketches, and the slide must say so. */
function barChart(t, o) {
  const H_ = o.dir === 'h', n = o.bars.length, t0 = o.t0 || 0, a0 = ep(t, t0, t0 + 0.5);
  const [lo, hi] = o.yr || [0, Math.max(...o.bars.map(b => Math.max(b.v, b.ci ? b.ci[1] : 0))) * 1.15];
  const ticks = o.ticks || niceTicks(lo, hi, 5), fmt = o.fmt || (v => fmtN(v, o.tdec));
  const P = v => (v - lo) / (hi - lo);
  const { x, y, w, h } = o;
  /* frame and grid */
  if (o.frame !== false) rect(x, y, w, h, { color: inkA(TH ? 0.85 : 0.5), w: 1.5, alpha: a0 });
  for (const v of ticks) {
    if (H_) { const gx = x + w * P(v); line(gx, y, gx, y + h, { color: C.hair, w: 1.2, alpha: a0 }); text(fmt(v), gx, y + h + 32, { role: 'tick', color: C.mute, align: 'center', alpha: a0 }); }
    else { const gy = y + h - h * P(v); line(x, gy, x + w, gy, { color: C.hair, w: 1.2, alpha: a0 }); text(fmt(v), x - 14, gy + 7, { role: 'tick', color: C.mute, align: 'right', alpha: a0 }); }
  }
  if (o.axis) {
    if (H_) text(o.axis, x + w, y + h + 74, { role: 'label', size: 21, color: C.mute, align: 'right', alpha: a0 });
    else { G.save(); G.translate(x - (o.axisOff || 86), y + h / 2); G.rotate(-Math.PI / 2); text(o.axis, 0, 0, { role: 'label', size: 21, color: C.mute, align: 'center', alpha: a0 }); G.restore(); }
  }
  const slot = (H_ ? h : w) / n, bw = slot * (o.barW || 0.56);
  o.bars.forEach((b, i) => {
    const d = 0.18 + i * (o.stagger == null ? 0.14 : o.stagger), k = ep(t, t0 + d, t0 + d + 0.9, E.snap), col = roleCol(b);
    const c = (H_ ? y : x) + slot * (i + 0.5), v1 = lo + (b.v - lo) * k;
    /* the bar */
    if (H_) { const bx = x, by = c - bw / 2, bl = w * P(v1); if (bl > 0.5) { G.save(); rrPath(bx, by, bl, bw, Math.min(bw / 2, 10)); G.fillStyle = col; G.fill(); G.restore(); } }
    else { const bt = y + h - h * P(v1); if (y + h - bt > 0.5) { G.save(); rrPath(c - bw / 2, bt, bw, y + h - bt, Math.min(bw / 2, 10)); G.fillStyle = col; G.fill(); G.restore(); } }
    /* the samples: every measurement as a grey dot, jittered across the bar, landing one after another */
    const S = Array.isArray(b.samples) ? b.samples : b.samples ? synthSamples(b.v, b.samples) : null;
    if (S) {
      const r = rng(b.seed || 7 + i * 31), rad = S.length > 400 ? 1.8 : 2.4;
      G.save(); G.fillStyle = b.ref && !TH ? 'rgba(13,14,15,0.38)' : (b.ref && TH ? 'rgba(255,255,255,0.42)' : C.dot);
      for (let j = 0; j < S.length; j++) {
        const jit = (r() - 0.5) * bw * 0.86, dl = r() * 0.7, kk = ep(t, t0 + d + 0.25 + dl, t0 + d + 0.55 + dl, E.out3); if (kk <= 0) continue;
        const pv = P(S[j]);
        G.globalAlpha = kk * (o.dotA || 0.9);
        if (H_) { G.beginPath(); G.arc(x + w * pv, c + jit, rad, 0, TAU); G.fill(); }
        else { G.beginPath(); G.arc(c + jit, y + h - h * pv - (1 - kk) * 18, rad, 0, TAU); G.fill(); }
      }
      G.restore();
    }
    /* 95 % CI whisker */
    const kc = ep(t, t0 + d + 0.7, t0 + d + 1.0);
    if (b.ci && kc > 0) {
      const cw = Math.min(bw * 0.18, 16), wc = TH ? '#111111' : (b.ref ? '#0D0E0F' : C.ink);
      if (H_) { const xa = x + w * P(b.ci[0]), xb = x + w * P(b.ci[1]); line(xa, c, xb, c, { color: wc, w: 2.2, alpha: kc }); line(xa, c - cw, xa, c + cw, { color: wc, w: 2.2, alpha: kc }); line(xb, c - cw, xb, c + cw, { color: wc, w: 2.2, alpha: kc }); }
      else { const ya = y + h - h * P(b.ci[0]), yb = y + h - h * P(b.ci[1]); line(c, ya, c, yb, { color: wc, w: 2.2, alpha: kc }); line(c - cw, ya, c + cw, ya, { color: wc, w: 2.2, alpha: kc }); line(c - cw, yb, c + cw, yb, { color: wc, w: 2.2, alpha: kc }); }
    }
    /* the value, bold, above the bar (or past its end) */
    const lab = b.label != null ? b.label : fmtN(b.v, o.dec) + (o.unit ? ' ' + o.unit : '');
    const cu = countUp(lab, k, lo) || lab, top = b.ci ? Math.max(b.v, b.ci[1]) : b.v;
    const topS = S ? Math.max(top, ...S.slice(0, 400)) : top;
    /* above the highest dot as well as the whisker (samples spread wider than the CI of their mean); labelAt: 'ci' ignores the dots */
    const lt = o.labelAt === 'ci' ? top : topS;
    if (H_) text(cu, x + w * P(Math.min(hi, lt)) + 16, c + 10, { role: 'num', size: o.vsize || 28, weight: 800, color: C.ink, alpha: clamp(k * 1.5 - 0.4), tnum: true });
    else text(cu, c, y + h - h * P(Math.min(hi * 0.97, lt)) - 18, { font: 'disp', size: o.vsize || 34, weight: 800, track: -0.01, color: C.ink, align: 'center', alpha: clamp(k * 1.5 - 0.4), tnum: true });
    /* name under the bar, CI and n under that */
    const na = ep(t, t0 + d, t0 + d + 0.4);
    if (H_) {
      text(b.name, x - 18, c + (b.sub ? -2 : 9), { role: 'small', size: 26, weight: b.hero || b.ref ? 800 : 600, color: b.hero ? C.ink : C.ink, align: 'right', alpha: na });
      if (b.sub) text(b.sub, x - 18, c + 26, { role: 'label', size: 20, color: b.hero ? C.heroText : C.mute, align: 'right', alpha: na });
    } else {
      text(b.name, c, y + h + 40, { font: 'disp', size: o.nsize || 32, weight: 800, track: -0.01, color: C.ink, align: 'center', alpha: na });
      if (b.sub) text(b.sub, c, y + h + 70, { role: 'label', size: 20, color: b.hero ? C.heroText : C.mute, align: 'center', alpha: na });
      const fy = y + h + (b.sub ? 104 : 76);
      if (b.ci && o.foot !== false) text(`[${fmtN(b.ci[0], o.dec)}, ${fmtN(b.ci[1], o.dec)}]`, c, fy, { font: 'mono', size: 20, weight: 500, color: C.mute, align: 'center', alpha: na });
      if (b.n && o.foot !== false) text('n = ' + fmt3(b.n), c, fy + 27, { font: 'mono', size: 20, weight: 500, color: C.mute, align: 'center', alpha: na });
      if (i === 0 && o.foot !== false && (b.ci || b.n)) {
        if (b.ci) text('95% CI:', x - 14, fy, { font: 'mono', size: 20, weight: 500, color: C.mute, align: 'right', alpha: na });
        if (b.n) text('samples:', x - 14, fy + 27, { font: 'mono', size: 20, weight: 500, color: C.mute, align: 'right', alpha: na });
      }
    }
  });
  if (o.placeholder) placeholderStamp(t, x, y, w, h, { t0 });
}
const fmt3 = v => typeof v === 'number' ? v.toLocaleString('en-US') : String(v);
/** samples for illustration only, when a source gives a mean and spread but no raw data: { n, sd, seed }. Label them so. */
function synthSamples(mean, s) { const r = rng(s.seed || 11), out = []; for (let i = 0; i < (s.n || 200); i++) { const u = Math.max(1e-9, r()), v = r(); out.push(mean + (s.sd || mean * 0.2) * Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v)); } return out; }

/* ---------- XBAB weight breakdown: a huge name and total, numbered rows, bars on light tracks, grams and percent in mono ----------
   o = { x, y, w, t0, name: 'Theseus', sub: 'Weight budget', total (number), unit: 'g', totalLabel: 'Total', dec (3),
         rows: [{ name, count, g, ev, note, icon: (cx, cy, s, a) => draw, hero, dim }], rowH (66), max (bar scale, default the largest row / 0.55),
         barCol (default ink; C.hero for a Theseus budget), iconW (0 = no icons), foot: [left, right], placeholder } returns the y under it */
function breakdown(t, o) {
  const t0 = o.t0 || 0, { x, w } = o, rh = o.rowH || 66, iw = o.iconW || 0;
  let y = o.y;
  const a0 = ep(t, t0, t0 + 0.5);
  if (o.name != null) {
    text(o.name, x - 4, y + 112, { role: 'd1', size: o.nameSize || 132, caps: true, color: C.ink, t, rise: [t0 + 0.05, 0.9] });
    if (o.sub) text(o.sub, x, y + 160, { role: 'labelL', size: 28, weight: 400, track: 0.06, color: C.mute, t, t0: t0 + 0.6, cps: 50 });
    const totStr = fmtN(o.total, o.totalDec == null ? 2 : o.totalDec);
    const r = rich([{ s: totStr, role: 'd1', size: o.totalSize || 140, color: C.ink, tnum: true, count: [t0 + 0.4, 1.4] }, { s: o.unit || 'g', font: 'disp', size: Math.round((o.totalSize || 140) * 0.32), weight: 800, color: C.mute, gap: 12 }], x + w, y + 160, { t, align: 'right' });
    text(o.totalLabel || 'Total', x + w, y + 14, { role: 'label', size: 22, track: 0.24, color: C.mute, align: 'right', alpha: a0 });
    if (o.totalTag) o.totalTag(r.x0, y + 160);
    const nameW = tw(o.name, { role: 'd1', size: o.nameSize || 132, caps: true });
    line(x + nameW + 40, y + 76, lerp(x + nameW + 40, r.x0 - 40, ep(t, t0 + 0.3, t0 + 1.1, E.cam)), y + 76, { color: C.hair, w: 1.5 });
    y += 196;
    line(x, y, x + w * ep(t, t0 + 0.2, t0 + 1.0, E.cam), y, { color: C.hair, w: 1.5 });
  }
  const valW = o.pctCol === false ? 200 : 330, barX = x + iw + 90, barW = w - iw - 90 - valW - 30;
  const max = o.max || Math.max(...o.rows.map(r => r.g)) / 0.55;
  /* faint verticals behind the bars, at quarters */
  for (let q = 1; q <= 3; q++) line(barX + barW * q / 4, y + 6, barX + barW * q / 4, y + rh * o.rows.length, { color: C.hair, w: 1, alpha: a0 * 0.8 });
  o.rows.forEach((r, i) => {
    const ry = y + i * rh, d = 0.3 + i * (o.stagger || 0.1), k = ep(t, t0 + d, t0 + d + 0.9, E.snap), a = ep(t, t0 + d - 0.1, t0 + d + 0.3);
    if (i) line(x, ry, x + w, ry, { color: C.hair, w: 1, alpha: a * 0.9 });
    if (iw && r.icon) { G.save(); G.globalAlpha = a; r.icon(x + iw / 2, ry + rh / 2, Math.min(iw, rh) * 0.8, a); G.restore(); G.globalAlpha = 1; }
    text(pad2(i + 1), x + iw + 6, ry + rh * 0.44, { font: 'mono', size: 20, weight: 500, color: C.faint, alpha: a });
    const nm = rich([{ s: r.name, font: 'disp', size: o.nameS || 28, weight: 700, caps: true, track: 0.01, color: r.dim ? C.mute : C.ink }, r.count ? { s: `(${r.count})`, font: 'mono', size: 21, weight: 500, color: C.faint, gap: 12 } : null, r.ev ? null : null], barX, ry + rh * 0.47, { alpha: a });
    if (r.ev) pill(barX + nm.w + 18, ry + rh * 0.47 + 1, r.ev, a * 0.95, { by: r.by, text: r.evText });
    if (r.note) text(r.note, barX + barW, ry + rh * 0.47, { role: 'small', size: 21, color: C.faint, align: 'right', alpha: a * 0.9 });
    const bh = o.barH || 12, by = ry + rh * 0.72;
    rr(barX, by - bh / 2, barW, bh, bh / 2, C.track, null, 0, a);
    const bl = Math.max(bh, barW * clamp(r.g / max) * k);
    if (r.was) { /* what the reference spends here: a dashed ghost, so the cut reads at a glance */
      const gw = barW * clamp(r.was / max), kg = ep(t, t0 + d + 0.9, t0 + d + 1.3);
      G.save(); G.globalAlpha = a * kg; G.setLineDash([5, 4]); rrPath(barX, by - bh / 2 - 3, gw, bh + 6, (bh + 6) / 2); G.strokeStyle = C.ink2; G.lineWidth = 1.5; G.stroke(); G.restore();
      text((o.wasLabel || 'Was') + ' ' + fmtN(r.was, 2) + ' g', barX + gw + 12, by + 7, { role: 'label', size: 19, color: C.mute, alpha: a * kg });
    }
    rr(barX, by - bh / 2, bl, bh, bh / 2, r.hero ? C.hero : (r.color || o.barCol || C.ink), null, 1.5, a);
    /* grams, then the share, on one line (XBAB stacks them; a slide has less height than a poster) */
    const gs = countUp(fmtN(r.g, o.dec == null ? 3 : o.dec), k) || fmtN(r.g, o.dec == null ? 3 : o.dec), vy = ry + rh * 0.6;
    rich([{ s: gs, font: 'mono', size: 30, weight: 700, color: C.ink }, { s: o.unit || 'g', font: 'mono', size: 20, weight: 500, color: C.faint, gap: 8 }], x + w, vy, { align: 'right', alpha: a });
    if (o.pctCol !== false) text(fmtN(100 * r.g / (o.pctOf || o.total), 1) + ' %', x + w - 172, vy, { font: 'mono', size: 23, weight: 500, color: C.mute, align: 'right', alpha: a });
  });
  const yb = y + rh * o.rows.length;
  line(x, yb, x + w * ep(t, t0 + 0.4, t0 + 1.2, E.cam), yb, { color: C.hair, w: 1.5 });
  if (o.foot) { text(o.foot[0], x, yb + 38, { font: 'mono', size: 20, weight: 500, color: C.mute, alpha: a0 }); if (o.foot[1]) text(o.foot[1], x + w, yb + 38, { role: 'label', size: 20, track: 0.2, color: C.mute, align: 'right', alpha: a0 }); }
  if (o.placeholder) placeholderStamp(t, x, o.y, w, yb - o.y, { t0 });
  return yb;
}

/* ---------- Kunai lollipop ranking: name and a mono qualifier, a stem and a dot (filled or a ring), the value right-aligned ----------
   o = { x, y, w, t0, rows: [{ name, qual, v, hero, ref, hollow, dim }], xr: [0, max], ticks, fmt (value), tfmt (tick),
         labelW (520), rowH (44), title (mono caps, card header), ev, target: { v, label } (a vertical line), better: 'low' | 'high' } */
function lollipop(t, o) {
  const t0 = o.t0 || 0, rh = o.rowH || 44, lw = o.labelW || 520, vw = o.valW || 110;
  const x0 = o.x + lw, pw = o.w - lw - vw - 20, [lo, hi] = o.xr, X = v => x0 + pw * clamp((v - lo) / (hi - lo));
  const a0 = ep(t, t0, t0 + 0.5), y0 = o.y, ticks = o.ticks || niceTicks(lo, hi, 5);
  for (const v of ticks) { line(X(v), y0 - 18, X(v), y0 + rh * o.rows.length - rh * 0.4, { color: C.hair, w: 1.2, alpha: a0 }); text(o.tfmt ? o.tfmt(v) : String(v), X(v), y0 - 30, { role: 'tick', size: 20, color: C.mute, align: 'center', alpha: a0 }); }
  if (o.target) {
    const k = ep(t, t0 + 0.6, t0 + 1.2), tx = X(o.target.v);
    line(tx, y0 - 18, tx, y0 - 18 + (rh * o.rows.length) * k, { color: C.heroText, w: 2, dash: [6, 5] });
  }
  o.rows.forEach((r, i) => {
    const y = y0 + i * rh, d = 0.15 + i * (o.stagger || 0.05), k = ep(t, t0 + d, t0 + d + 0.8, E.snap), a = ep(t, t0 + d - 0.1, t0 + d + 0.25);
    line(o.x, y + rh * 0.5, o.x + o.w, y + rh * 0.5, { color: C.hair, w: 1, alpha: a * 0.7 });
    const nm = text(r.name, o.x, y + 9, { role: 'small', size: o.nsize || 25, weight: r.hero ? 800 : r.ref ? 700 : 500, color: r.dim ? C.mute : C.ink, alpha: a });
    if (r.qual) text(r.qual, o.x + nm.w + 12, y + 8, { role: 'label', size: 19, track: 0.08, color: r.hero ? C.heroText : C.faint, alpha: a });
    const col = r.hero ? C.hero : r.ref ? C.ref : r.dim ? C.comp2 : (TH ? '#9F9E98' : '#8E8D88'), xe = lerp(X(lo), X(r.v), k);
    line(X(lo), y, xe, y, { color: r.hero ? C.hero : col, w: r.hero ? 6 : 3, alpha: a, cap: 'round' });
    if (r.hero) { heroMark(xe, y, 13, a); }
    else if (r.hollow) { circle(xe, y, 9, { fill: C.panel, alpha: a }); circle(xe, y, 9, { color: col, w: 3, alpha: a }); }
    else circle(xe, y, 9, { fill: col, alpha: a });
    const vs = o.fmt ? o.fmt(r.v) : String(r.v);
    text(countUp(vs, k) || vs, o.x + o.w, y + 9, { role: 'num', size: 25, weight: r.hero ? 800 : 600, color: r.hero ? C.heroText : C.ink, align: 'right', alpha: a });
  });
  if (o.placeholder) placeholderStamp(t, o.x, y0 - 50, o.w, rh * o.rows.length + 40, { t0 });
  return y0 + rh * o.rows.length;
}

/* ---------- XY scatter with a sweet spot, labelled points, the Pareto frontier, and the Theseus target ----------
   o = { x, y, w, h, t0, xr, yr, xticks, yticks, xfmt, yfmt, xlabel, ylabel, xlog, ylog,
         better: { x: -1 | 1, y: -1 | 1 } (which way is better on each axis: -1 = lower is better),
         sweet: true (a gradient toward the better corner) | { x, y, r } (centre in data units, radius in px),
         points: [{ name, x, y, ev, hollow, ref, dx, dy (fixed label offset), label: false (a dot with no name) }],
         frontier: true (the Pareto frontier of the points, dominated points dimmed; a point with offFront: true is
         drawn and named but kept out of the frontier, e.g. a mouse with half a shell),
         target: { x, y, name, dx, dy, sub } (Theseus, a point),
         targetX: { x, name, sub, t0 } (Theseus known on the x axis only: a dashed line, e.g. a weight with no price yet),
         looseLabels: true (a dominated point may be named on the far side of the frontier, with a leader),
         lsize (22), frontierLabel, placeholder }
   Labels never cover a dot, a line or another label: a dominated point that finds no free spot goes unnamed.
   Returns { X, Y, unnamed: [names] } so the slide can list the unnamed points in a note. */
function scatter(t, o) {
  const t0 = o.t0 || 0, { x, y, w, h } = o, bx = (o.better && o.better.x) || -1, by = (o.better && o.better.y) || 1;
  const mp = (v, r, lg) => lg ? (Math.log10(v) - Math.log10(r[0])) / (Math.log10(r[1]) - Math.log10(r[0])) : (v - r[0]) / (r[1] - r[0]);
  const X = v => x + w * mp(v, o.xr, o.xlog), Y = v => y + h - h * mp(v, o.yr, o.ylog);
  const a0 = ep(t, t0, t0 + 0.6);
  /* where the sweet-spot label starts: in its corner, or just past a target line that runs through the corner */
  const swX = cx => bx < 0 ? (o.targetX ? Math.max(cx + 22, X(o.targetX.x) + 22) : cx + 22) : cx - 22;
  /* the sweet spot: a field that brightens toward the better corner, with iso-lines like a contour map */
  const ks = ep(t, t0 + 0.4, t0 + 1.6);
  if (o.sweet && ks > 0) {
    const cx = o.sweet.x != null ? X(o.sweet.x) : (bx < 0 ? x : x + w), cy = o.sweet.y != null ? Y(o.sweet.y) : (by > 0 ? y : y + h), R = o.sweet.r || Math.hypot(w, h) * 0.62;
    G.save(); G.beginPath(); G.rect(x, y, w, h); G.clip();
    const g = G.createRadialGradient(cx, cy, 0, cx, cy, R * ks);
    g.addColorStop(0, rgba(C.hero, TH ? 0.34 : 0.26)); g.addColorStop(0.45, rgba(C.hero, TH ? 0.12 : 0.09)); g.addColorStop(1, rgba(C.hero, 0));
    G.fillStyle = g; G.fillRect(x, y, w, h);
    G.strokeStyle = TH ? rgba(C.heroText, 0.28) : rgba(C.hero, 0.22); G.lineWidth = 1.2; G.setLineDash([3, 6]);
    for (let q = 1; q <= 4; q++) { G.beginPath(); G.arc(cx, cy, R * ks * q / 4.6, 0, TAU); G.stroke(); }
    G.setLineDash([]); G.restore();
    if (o.sweet.label) text(o.sweet.label, swX(cx), cy + (by > 0 ? 40 : -24), { role: 'label', size: 21, color: C.heroText, align: bx < 0 ? 'left' : 'right', alpha: ks });
  }
  /* frame */
  for (const v of o.yticks || []) { line(x, Y(v), x + w, Y(v), { color: C.hair, w: 1.2, alpha: a0 }); text(o.yfmt ? o.yfmt(v) : String(v), x - 14, Y(v) + 7, { role: 'tick', color: C.mute, align: 'right', alpha: a0 }); }
  for (const v of o.xticks || []) { line(X(v), y, X(v), y + h, { color: C.hair, w: 1.2, alpha: a0 * 0.6 }); text(o.xfmt ? o.xfmt(v) : String(v), X(v), y + h + 34, { role: 'tick', color: C.mute, align: 'center', alpha: a0 }); }
  rect(x, y, w, h, { color: inkA(TH ? 0.7 : 0.4), w: 1.5, alpha: a0 });
  if (o.xlabel) text(o.xlabel, x + w, y + h + 74, { role: 'label', size: 21, color: C.mute, align: 'right', alpha: a0 });
  if (o.ylabel) text(o.ylabel, x, y - 22, { role: 'label', size: 21, color: C.mute, alpha: a0 });
  /* better-direction arrows, only when asked (the sweet spot usually says it) */
  const ka = ep(t, t0 + 0.5, t0 + 0.9);
  if (o.betterLabels && ka > 0) {
    const ax = bx < 0 ? x + 16 : x + w - 16;
    arrow(ax + (bx < 0 ? 70 : -70), y + h - 16, ax, y + h - 16, { color: C.mute, w: 2, hs: 10, alpha: ka * 0.8 });
    text('Better', ax + (bx < 0 ? 80 : -80), y + h - 9, { role: 'label', size: 19, color: C.mute, align: bx < 0 ? 'left' : 'right', alpha: ka * 0.8 });
  }
  /* coincident points become one point with both names */
  const pts = [];
  o.points.forEach(p => { const q = pts.find(r => Math.abs(r.x - p.x) < 1e-6 && Math.abs(r.y - p.y) < 1e-6); if (q) q.name += ', ' + p.name; else pts.push(Object.assign({}, p)); });
  /* the Pareto frontier: no other point is better on both axes */
  const dom = (a, b) => (bx * (b.x - a.x) >= 0 && by * (b.y - a.y) >= 0) && (b.x !== a.x || b.y !== a.y);   /* b dominates a */
  /* a point marked offFront (a mouse that isn't comparable: half a shell) is drawn and named but neither joins the
     frontier nor pushes others off it */
  pts.forEach(p => { p.front = !p.offFront && !pts.some(q => q !== p && !q.offFront && dom(p, q)); });
  const kf2 = ep(t, t0 + 1.4, t0 + 2.4, E.io3);
  const obs = [], box = (x0, y0, x1, y1) => obs.push({ x0, y0, x1, y1 });
  let st = null;
  if (o.frontier) {
    const F = pts.filter(p => p.front).sort((a, b) => a.x - b.x);
    if (F.length) {
      /* a rounded edge through the frontier, run out to the frame: the edge of what has shipped. It starts at the frame
         a little to the better side of the first point (so it can bend into it, not kink), passes through every
         frontier point without overshooting, and leaves the last point flat, out to the far side of the frame */
      const seq = bx < 0 ? F : F.slice().reverse(), first = seq[0], last = seq[seq.length - 1];
      const fx = X(first.x), fy = Y(first.y), edgeY = by > 0 ? y + h : y, edgeX = bx < 0 ? x + w : x;
      const gap0 = seq.length > 1 ? Math.abs(X(seq[1].x) - fx) : w * 0.3, r0 = clamp(gap0 * 0.35, 14, 60) * (bx < 0 ? -1 : 1);
      const knots = [[clamp(fx + r0, x, x + w), edgeY]].concat(seq.map(p => [X(p.x), Y(p.y)]), [[edgeX, Y(last.y)]]);
      if (knots[0][0] === knots[1][0]) knots[0][0] += bx < 0 ? -1 : 1;
      const asc = knots.slice().sort((a, b) => a[0] - b[0]);
      st = monoCurve(asc, 4); if (bx > 0) st.reverse();
      if (kf2 > 0.98) {
        G.save(); G.beginPath(); G.moveTo(st[0][0], st[0][1]); st.forEach(p => G.lineTo(p[0], p[1]));
        G.lineTo(edgeX, edgeY); G.closePath(); G.clip();
        G.strokeStyle = inkA(TH ? 0.07 : 0.08); G.lineWidth = 1; G.beginPath(); for (let s2 = -h; s2 < w + h; s2 += 14) { G.moveTo(x + s2, y); G.lineTo(x + s2 - h, y + h); } G.stroke(); G.restore();
      }
      poly(st, { color: C.ink, w: 2.5, p: kf2 });
      for (let i = 0; i < st.length; i += 2) box(st[i][0] - 5, st[i][1] - 5, st[i][0] + 5, st[i][1] + 5);
    }
  }
  /* obstacles for labels: points, the target and its chip, the sweet-spot label */
  pts.forEach(p => box(X(p.x) - 12, Y(p.y) - 12, X(p.x) + 12, Y(p.y) + 12));
  if (o.target) {
    const tx = X(o.target.x), ty = Y(o.target.y), nm = o.target.name || 'Theseus target', cwid = tw(nm, { role: 'label', size: 22 }) + 16, dl = o.target.dx < 0;
    const tl = tx + (o.target.dx != null ? o.target.dx : 26) + (dl ? -8 : 8), tyy = ty + (o.target.dy != null ? o.target.dy : -14);
    box(tx - 22, ty - 22, tx + 22, ty + 22); box(dl ? tl - cwid : tl - 8, tyy - 26, dl ? tl + 8 : tl + cwid, tyy + 10);
  }
  if (o.sweet && o.sweet.label) { const cx = bx < 0 ? x : x + w, cy = by > 0 ? y : y + h, lwid = tw(o.sweet.label, { role: 'label', size: 21 }); const lx = bx < 0 ? swX(cx) : swX(cx) - lwid, ly = cy + (by > 0 ? 40 : -24); box(lx - 4, ly - 22, lx + lwid + 4, ly + 6); }
  const hit = b => obs.some(q => b.x0 < q.x1 && b.x1 > q.x0 && b.y0 < q.y1 && b.y1 > q.y0) || b.x0 < x + 6 || b.x1 > x + w - 6 || b.y0 < y + 6 || b.y1 > y + h - 6;
  /* a dominated point's label stays on the dominated side of the frontier, so nothing reads as past it */
  const FR = pts.filter(p => p.front), ix = px => o.xr[0] + (px - x) / w * (o.xr[1] - o.xr[0]), iy = py => o.yr[0] + (y + h - py) / h * (o.yr[1] - o.yr[0]);
  const domPt = (cx, cy) => FR.some(f => bx * (f.x - ix(cx)) >= 0 && by * (f.y - iy(cy)) >= 0);
  const domBox = b => !o.frontier || o.xlog || o.ylog || [[b.x0, b.y0], [b.x1, b.y0], [b.x0, b.y1], [b.x1, b.y1]].every(([cx, cy]) => domPt(cx, cy));
  /* a target known on one axis only (a weight with no price yet): a dashed line through the plot, its chip at the first free spot along it */
  let TX = null;
  if (o.targetX) {
    const lx = X(o.targetX.x), nm = o.targetX.name || 'Theseus target', sub = o.targetX.sub;
    const bw = Math.max(tw(nm, { role: 'label', size: 22 }) + 16, sub ? tw(sub, { role: 'small', size: 22 }) : 0) + 6, hb = sub ? 66 : 34;
    for (let yy = y; yy < y + h; yy += 10) box(lx - 7, yy, lx + 7, yy + 10);
    let cy = null;
    for (let c2 = y + 40; c2 <= y + h - hb + 20; c2 += 10) { const b = { x0: lx + 12, y0: c2 - 26, x1: lx + 20 + bw, y1: c2 - 26 + hb }; if (!hit(b)) { cy = c2; box(b.x0, b.y0, b.x1, b.y1); break; } }
    TX = { lx, cy, nm, sub };
  }
  /* place labels: frontier points first, then the rest; the nearest free spot in eight directions, a leader line when it had to move */
  const order = pts.map((p, i) => i).sort((i, j) => (pts[j].front ? 1 : 0) - (pts[i].front ? 1 : 0));
  const LB = [];
  const sz = o.lsize || 22;
  const DIRS = [[1, 0], [-1, 0], [0, -1], [0, 1], [1, -1], [-1, -1], [1, 1], [-1, 1]];
  const seek = (p, px, py, lwid, ds, strict) => {
    for (const d of ds) for (const [ddx, ddy] of DIRS) {
      const lx = ddx > 0 ? px + d : ddx < 0 ? px - d - lwid : px - lwid / 2;
      const ly = ddy < 0 ? py - d : ddy > 0 ? py + d + sz * 0.72 : py + sz * 0.36;
      const b = { x0: lx - 3, y0: ly - sz * 0.78, x1: lx + lwid + 3, y1: ly + sz * 0.22 };
      if (!hit(b) && (!strict || p.front || p.offFront || domBox(b))) return { lx, ly, far: d > 20, b };
    }
    return null;
  };
  for (const i of order) {
    const p = pts[i]; if (p.label === false) continue;
    const px = X(p.x), py = Y(p.y), lwid = tw(p.name, { role: 'small', size: sz, weight: 600 }) + 2;
    let best = null;
    if (p.dx != null || p.dy != null) { const lx = px + (p.dx || 0), ly = py + (p.dy || 0); best = { lx: p.dx < 0 ? lx - lwid : lx, ly, far: true }; }
    else best = seek(p, px, py, lwid, [16, 30, 48, 72, 100, 136, 176], true) || (o.looseLabels || p.front || p.offFront ? seek(p, px, py, lwid, [16, 30, 48, 72, 100, 136, 176, 220], false) : null);
    /* a crowded dominated point goes unnamed rather than have its name run over a dot; a frontier point is always named */
    if (!best && !p.front) continue;
    if (!best) best = { lx: px + 16, ly: py + sz * 0.36, far: false };
    const b = best.b || { x0: best.lx - 3, y0: best.ly - sz * 0.78, x1: best.lx + lwid + 3, y1: best.ly + sz * 0.22 };
    obs.push(b); LB[i] = Object.assign(best, { b, lwid });
  }
  /* points, leaders, labels */
  pts.forEach((p, i) => {
    const d = 0.6 + i * 0.07, k = ep(t, t0 + d, t0 + d + 0.5, E.snap), px = X(p.x), py = Y(p.y);
    const dimmed = o.frontier && !p.front && kf2 > 0;
    const col = p.ref ? C.ref : dimmed ? lerpCol(TH ? '#5F5E59' : '#B9B8B2', TH ? '#BDBCB6' : '#55554F', kf2) : (TH ? '#5F5E59' : '#B9B8B2');
    if (p.hollow) { circle(px, py, 9 * k, { fill: C.panel }); circle(px, py, 9 * k, { color: col, w: 3 }); } else circle(px, py, 9 * k, { fill: col });
    const L = LB[i]; if (!L) return;
    if (L.far) { const bx0 = clamp(px, L.b.x0, L.b.x1), by0 = clamp(py, L.b.y0, L.b.y1); line(px, py, bx0, by0, { color: dimmed ? C.faint : C.mute, w: 1.2, alpha: k * 0.8 }); }
    text(p.name, L.lx, L.ly, { role: 'small', size: sz, weight: p.front || p.ref ? 700 : 500, color: dimmed ? C.faint : C.ink, alpha: k });
  });
  if (st && kf2 > 0.6 && o.frontierLabel !== false) {
    /* name the frontier where it runs flattest over the label's width: above it first, then under it */
    const lab = o.frontierLabel || 'Pareto frontier', lw2 = tw(lab, { role: 'label', size: 19 });
    const asc = st.slice().sort((a, b) => a[0] - b[0]), yAt = (x0, x1) => { let lo = Infinity, hi = -Infinity; for (const q of asc) if (q[0] >= x0 && q[0] <= x1) { lo = Math.min(lo, q[1]); hi = Math.max(hi, q[1]); } return [lo, hi]; };
    const cands = [];
    for (let sx = x + 10; sx + lw2 < x + w - 10; sx += 12) { const [lo, hi] = yAt(sx, sx + lw2); if (lo === Infinity) continue; cands.push({ sx, lo, hi, flat: hi - lo }); }
    cands.sort((a, b) => a.flat - b.flat);
    let placed = null;
    for (const c of cands.slice(0, 40)) {
      for (const ly of [c.lo - 12, c.hi + 28]) { const b = { x0: c.sx - 2, y0: ly - 18, x1: c.sx + lw2 + 2, y1: ly + 4 }; if (!hit(b)) { placed = { lx: c.sx, ly }; break; } }
      if (placed) break;
    }
    if (placed) text(lab, placed.lx, placed.ly, { role: 'label', size: 19, color: C.ink, alpha: ep(t, t0 + 2.0, t0 + 2.4) });
  }
  if (TX) {
    const d0 = t0 + (o.targetX.t0 != null ? o.targetX.t0 : 2.6), k = ep(t, d0, d0 + 0.8, E.cam), ka = ep(t, d0 + 0.6, d0 + 1.0);
    if (k > 0) line(TX.lx, y + h, TX.lx, y + h - h * k, { color: C.heroText, w: 3, dash: [10, 8] });
    if (ka > 0 && TX.cy != null) {
      rich([{ s: TX.nm, role: 'label', size: 22, color: C.onHero, chip: C.heroChip }], TX.lx + 20, TX.cy, { alpha: ka });
      if (TX.sub) text(TX.sub, TX.lx + 20, TX.cy + 36, { role: 'small', size: 22, color: C.ink2, alpha: ka });
    }
  }
  /* Theseus: the target, beyond the frontier, with a ring that keeps breathing */
  if (o.target) {
    const d = 0.8 + pts.length * 0.07 + 0.4, k = ep(t, t0 + d, t0 + d + 0.6, E.snap), tx = X(o.target.x), ty = Y(o.target.y);
    if (k > 0) {
      const ph = ((t - t0 - d) % 2.4) / 2.4; circle(tx, ty, 16 + ph * 26, { color: C.heroText, w: 2, alpha: (1 - ph) * 0.6 * k });
      heroMark(tx, ty, 15 * k, 1);
      const nm = o.target.name || 'Theseus target', dl = o.target.dx < 0, tl = tx + (o.target.dx != null ? o.target.dx : 26) + (dl ? -8 : 8), tyy = ty + (o.target.dy != null ? o.target.dy : -14);
      rich([{ s: nm, role: 'label', size: 22, color: C.onHero, chip: C.heroChip }], tl, tyy, { alpha: k, align: dl ? 'right' : 'left' });
      if (o.target.sub) text(o.target.sub, tl, tyy + 34, { role: 'small', size: 22, color: C.ink2, alpha: k, align: dl ? 'right' : 'left' });
    }
  }
  if (o.placeholder) placeholderStamp(t, x, y, w, h, { t0 });
  return { X, Y, unnamed: pts.filter((p, i) => !LB[i]).map(p => p.name) };
}
function lerpCol(a, b, k) { return mix(a, b, clamp(k)); }

/* ---------- line chart: curves over x, end labels, optional shaded bands ----------
   o = { x, y, w, h, t0, xr, yr, xticks, yticks, xfmt, yfmt, xlabel, ylabel,
         series: [{ name, pts: [[x, y], ..], hero, ref, color, dash, w, label: true | 'text', labelAt: x }],
         bands: [{ x0, x1, label, color }], markers: [{ x, y, label, hero }], ev, placeholder } */
function lineChart(t, o) {
  const t0 = o.t0 || 0;
  const m = axes(t, Object.assign({}, o, { t0 }));
  const a0 = ep(t, t0 + 0.2, t0 + 0.8);
  for (const b of o.bands || []) {
    const xa = m.X(b.x0), xb = m.X(b.x1);
    rect(xa, o.y, xb - xa, o.h, { fill: b.color || (b.hero ? rgba(C.hero, TH ? 0.22 : 0.16) : inkA(0.05)), alpha: a0 });
    if (b.label) text(b.label, xa + 10, o.y + 30, { role: 'label', size: 20, color: b.hero ? C.heroText : C.mute, alpha: a0 });
  }
  o.series.forEach((s, i) => {
    const d = 0.4 + i * 0.25, k = ep(t, t0 + d, t0 + d + 1.2, E.io3), col = s.color || roleCol(s);
    series(m, s.pts, { color: col, w: s.w || (s.hero ? 5 : s.ref ? 3.5 : 3), dash: s.dash, p: k });
    if (s.label !== false && k > 0.95) {
      const P = s.labelAt != null ? s.pts.reduce((a, b) => Math.abs(b[0] - s.labelAt) < Math.abs(a[0] - s.labelAt) ? b : a) : s.pts[s.pts.length - 1];
      const nm = s.label === true || s.label == null ? s.name : s.label, lw = tw(nm, { role: 'label', size: 21 }) + (s.hero ? 22 : 0);
      let lx = m.X(P[0]) + (s.ldx || 12), ly = m.Y(P[1]) + (s.ldy || 7), al = 'left';
      /* no room past the end of the line: the label sits above its end, right-aligned, still on stage */
      if (s.ldx == null && lx + lw > W - 40) { lx = m.X(P[0]) - 12; ly = m.Y(P[1]) - 16; al = 'right'; }
      if (s.hero) rich([{ s: nm, role: 'label', size: 21, color: C.ink, chip: C.heroChip }], al === 'left' ? lx + 6 : lx - 6, ly, { alpha: ep(t, t0 + d + 1.0, t0 + d + 1.4), align: al });
      else text(nm, lx, ly, { role: 'label', size: 21, color: s.ref ? C.ink : C.mute, align: al, alpha: ep(t, t0 + d + 1.0, t0 + d + 1.4) });
    }
  });
  for (const mk of o.markers || []) {
    const k = ep(t, t0 + 1.4, t0 + 1.8), mx = m.X(mk.x), my = m.Y(mk.y);
    if (mk.hero) heroMark(mx, my, 11, k); else circle(mx, my, 7, { fill: C.ink, alpha: k });
    if (mk.label) { const right = mx + 16 + tw(mk.label, { role: 'label', size: 20 }) < W - 40; text(mk.label, right ? mx + 16 : mx - 16, right ? my - 12 : my + 32, { role: 'label', size: 20, color: C.ink2, align: right ? 'left' : 'right', alpha: k }); }
  }
  if (o.placeholder) placeholderStamp(t, o.x, o.y, o.w, o.h, { t0 });
  return m;
}

/* ---------- comparison table: rows of specs, a column per mouse, the Theseus column marked in yellow ----------
   o = { x, y, w, t0, cols: [{ key, label, w (share), align, hero, mono }], rows: [{ cells: {key: value}, ev: {key: kind}, best: key }],
         rowH (64), head (true) } values may be strings or { v, sub } */
function compareTable(t, o) {
  const t0 = o.t0 || 0, rh = o.rowH || 64, tot = o.cols.reduce((a, c) => a + (c.w || 1), 0);
  let xx = o.x; const cx = o.cols.map(c => { const cw = o.w * (c.w || 1) / tot, r = { x: xx, w: cw }; xx += cw; return r; });
  const a0 = ep(t, t0, t0 + 0.4), y0 = o.y;
  o.cols.forEach((c, j) => {
    const X0 = cx[j].x + (j ? 18 : 0);
    if (c.hero) { const k = ep(t, t0 + 0.3, t0 + 0.8, E.snap); rect(cx[j].x, y0 - 40, cx[j].w, 6 * k, { fill: C.hero }); rect(cx[j].x, y0 - 40, 2, (rh * o.rows.length + 52) * k, { fill: C.hero, alpha: 0.9 }); }
    text(c.label, c.align === 'right' ? cx[j].x + cx[j].w - 16 : X0, y0, { role: 'label', size: 21, color: c.hero ? C.ink : C.mute, align: c.align === 'right' ? 'right' : 'left', alpha: a0, maxW: cx[j].w - 30 });
  });
  line(o.x, y0 + 22, o.x + o.w * a0, y0 + 22, { color: C.hair, w: 1.5 });
  o.rows.forEach((r, i) => {
    const yy = y0 + 22 + rh * (i + 0.66), tt = t0 + 0.4 + i * 0.1, k = ep(t, tt, tt + 0.35);
    if (i) line(o.x, yy - rh * 0.66, o.x + o.w, yy - rh * 0.66, { color: C.hair, w: 1, alpha: k });
    o.cols.forEach((c, j) => {
      let v = r.cells[c.key]; if (v == null) return; const sub = typeof v === 'object' ? v.sub : null; v = typeof v === 'object' ? v.v : v;
      const X0 = c.align === 'right' ? cx[j].x + cx[j].w - 16 : cx[j].x + (j ? 18 : 0), best = r.best === c.key;
      const st = j === 0 ? { role: 'small', size: 25, weight: 600, color: C.ink2, sentence: true } : { font: c.mono === false ? 'sans' : 'mono', size: 25, weight: c.hero || best ? 800 : 500, color: c.hero ? C.ink : best ? C.ink : C.ink2 };
      text(v, X0, yy - (sub ? 6 : 0), Object.assign(st, { align: c.align === 'right' ? 'right' : 'left', alpha: k, maxW: cx[j].w - 30 }));
      if (sub) text(sub, X0, yy + 22, { role: 'label', size: 19, color: C.faint, align: c.align === 'right' ? 'right' : 'left', alpha: k, maxW: cx[j].w - 30 });
      if (r.ev && r.ev[c.key]) evDot(c.align === 'right' ? X0 - tw(v, st) - 14 : X0 - 13, yy - 8 - (sub ? 6 : 0), r.ev[c.key], 5, k);
    });
  });
  return y0 + 22 + rh * o.rows.length;
}

/* ---------- Kunai stat card: mono label, evidence pill, a big number with its unit, one or two lines of body ----------
   o = { label, ev, value, unit, pre ('About'), mid ('to', between value and value2), value2, body, hero (accent edge),
         size (value size), font ('disp' | 'mono'), count (true), valueColor, bodyW }
   Height: about 170 px for a label and a value, 240 with one line of body. Keep the label to one line beside its pill. */
function statCard(t, t0, x, y, w, h, o) {
  const a = ep(t, t0, t0 + 0.45); if (a <= 0.003) return;
  G.save(); G.translate(0, (1 - E.out3(a)) * 16);
  demoWindow(x, y, w, h, a, { hero: o.hero, plain: true, fill: o.fill });
  const hy = cardHead(t, t0 + 0.1, x, y, w, o.label, o.ev ? [o.ev] : [], { dy: 46 });
  const vs = o.size || T.stat.size, ff = o.font === 'mono' ? { font: 'mono', size: vs * 0.92, weight: 600, track: -0.02 } : { role: 'stat', size: vs };
  const runs = [];
  if (o.pre) runs.push({ s: o.pre, font: ff.font || 'disp', size: vs * 0.9, weight: 800, track: -0.02, color: C.ink });
  runs.push(Object.assign({ s: o.value, color: o.valueColor || (o.hero ? C.heroText : C.ink), grad: o.hero && !o.valueColor ? C.heroGrad : undefined, tnum: true, count: o.count === false ? null : [t0 + 0.3, 1.0] }, ff, { gap: runs.length ? vs * 0.22 : 0 }));
  if (o.mid) runs.push({ s: o.mid, font: 'mono', size: Math.round(vs * 0.36), weight: 600, color: C.mute, gap: vs * 0.2 });
  if (o.value2) runs.push(Object.assign({ s: o.value2, color: o.valueColor || C.ink, tnum: true, count: o.count === false ? null : [t0 + 0.5, 1.0] }, ff, { gap: vs * 0.2 }));
  if (o.unit) runs.push({ s: o.unit, font: 'mono', size: Math.max(24, Math.round(vs * 0.36)), weight: 600, color: C.mute, gap: vs * 0.1 });
  const vy = hy + vs * 0.86;
  rich(runs, x + 26, vy, { t, alpha: a });
  if (o.body) text(o.body, x + 26, vy + 48, { role: 'small', size: 25, color: C.ink2, sentence: true, maxW: o.bodyW || w - 52, lh: 1.36, alpha: a, t, t0: t0 + 0.4, cps: 140 });
  G.restore();
}
