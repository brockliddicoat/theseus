/* ============================================================================================
   the shell chapter's running meter: one strip that follows every strength step in the chapter, so the gains add up
   on screen, slide after slide. Two bars, both at the same press and the same weight, with a plain wall as 100 %:
   FLEX (how far it gives) and PEAK EXPERIENCED STRESS (how close it gets to breaking), both "lower is better".
   Each step multiplies them by its own factors, and the bars drop.

   At a glance (Brock, F14.10, F16.1): Theseus's bars are Theseus's colour, never the heat scale (red on Theseus's side
   reads as Theseus losing); the plain wall stays on screen as the faint red track behind them (the bad case, 100 %),
   and every value reads before → after: the plain wall's 100 % struck, then where Theseus is now.

   The baseline, "a plain wall" (100 %): a plain thin wall, solid, with no ribbing, at Theseus's weight (F6.4). The first
   step is that wall becoming the triangle-lattice shell at the same weight (10-d-shell.js, slide shlShell3d); every later
   step is relative to the step before. The first slide that shows the meter says so.

     shellStep({ key, slide, label, flex, stress, ev, how })   register a step (call it at the top level of a slide file)
        key: a short id; slide: the id of the slide that shows it; label: 'Triangles' (a word or two);
        flex: the flex after the step ÷ the flex before it (0.45 = 55 % less flex); stress: the same for the peak stress
        (leave either out when the step does not change it); both from that slide's own model (getters work: they are
        read when the strip is drawn); ev: its evidence kind (usually 'derived'); how: one line on the model
        ('2D frame, PP-C-20A, 10 N at the crown')
     shellMeter(t, t0, key, x, y, w, o)   draw the strip with every step up to and including `key` (in deck order),
        the current step animating in. About 226 px tall (176 with o.compact, plus 30 when a ghost's name has to go on
        its own line). o = { alpha, compact, only: 'flex' | 'stress', ghost: { flex, stress, label } (a comparison that
        is not a step, against the same plain wall: a hollow mark on each bar, e.g. hexagon ribbing at the same weight),
        row (both bars side by side on one line, about 64 px tall, for a full-width slide where the strip only holds:
        it needs about 1,040 px and falls back to compact when narrower) }
        Returns the height it took.
     shellFactorAt(key, what)   the running factor after `key` ('flex' or 'stress'), 1 = the plain wall

   Shared by the shell chapter's slides (shl, shb):
     SHELL_PEAK_LAB            'Peak experienced stress {(lower is better)}': the label wherever peak stress is labelled (F14.8)
     shellHL(t, t0, x, y, num, word, o)   the headline: a huge number in Theseus's gradient and a word beside it (F14.10)
     shellBA(t, x, y, o)       before → after: the bad value grey and struck, an arrow, the live value (F16.1)

   The steps come from different slides and different models; the meter multiplies their factors, which assumes they
   stack. It says so in its own small print.
   ============================================================================================ */
const SHELL_STEPS = [];
function shellStep(o) { const i = SHELL_STEPS.findIndex(s => s.key === o.key); if (i >= 0) SHELL_STEPS[i] = o; else SHELL_STEPS.push(o); }
/** the steps in deck order (a step whose slide is not in the deck sorts last) */
function shellStepsOrdered() {
  const pos = s => { const i = DECK.slides.findIndex(x => x.id === s.slide); return i < 0 ? 1e6 + SHELL_STEPS.indexOf(s) : i; };
  return SHELL_STEPS.slice().sort((a, b) => pos(a) - pos(b));
}
/** the cumulative factor (1 = the plain wall) for 'flex' or 'stress' after the step `key`, or after all steps */
function shellFactorAt(key, what = 'flex') { let f = 1; for (const s of shellStepsOrdered()) { f *= s[what] == null ? 1 : s[what]; if (s.key === key) break; } return f; }

/** the label for peak stress, everywhere in the chapter (Brock, F14.8): the braces keep the note in lower case */
const SHELL_PEAK_LAB = 'Peak experienced stress {(lower is better)}';
const SHELL_FLEX_LAB = 'Flex {(lower is better)}';
const fmtPct = v => Math.round(v * 100) + '%';

/** the headline (Brock, F14.10): a huge number in Theseus's gradient, a word beside it in display caps, and a line under
   it. (x, y) = the number's baseline (o.align 'right': x is the right edge, 'center' its middle).
   o = { size (150), wordK (the word's size over the number's, 0.3), sub, subSize, maxW, a, count (false: no count-up) }.
   Returns { w } */
function shellHL(t, t0, x, y, num, word, o = {}) {
  const a = (o.a == null ? 1 : o.a) * ep(t, t0, t0 + 0.45); if (a <= 0.003) return { w: 0 };
  const sz = o.size || 150, k = E.out3(ep(t, t0, t0 + 0.7)), ws = Math.round(sz * (o.wordK || 0.3));
  G.save(); G.translate(0, (1 - k) * 18);
  const r = rich([{ s: num, role: 'd1', size: sz, weight: 800, track: -0.03, color: C.heroText, grad: C.heroGrad, tnum: true, count: o.count === false ? null : [t0, 0.9] },
    word ? { s: word, role: 'd2', size: ws, color: C.heroText, grad: C.heroGrad, gap: Math.round(sz * 0.08) } : null], x, y, { t, alpha: a, align: o.align });
  if (o.sub) text(o.sub, x, y + Math.round(sz * 0.2) + 30, { role: 'small', size: o.subSize || 25, weight: 600, color: C.ink2, align: o.align, alpha: a * ep(t, t0 + 0.3, t0 + 0.8), maxW: o.maxW || 900, lh: 1.3 });
  G.restore();
  return r;
}
/** before → after (Brock, F16.1): the bad value stays on screen, grey and struck, beside the live one, with the net change
   under them in Theseus's colour. (x, y) = the row's baseline, left (o.align 'right': x is the right edge).
   o = { label (over it), before, after, unit, net, size (the live value, 72), k (0..1, how far the change has gone: the
   struck value and the net appear once it starts; the live value turns Theseus's colour when it lands), a,
   hero (Theseus's colour from the start), bad (the live value's colour before it moves), netSize, netRight (the net
   to the right of the row, not under it), netW }. Returns { w } */
function shellBA(t, x, y, o) {
  const a = o.a == null ? 1 : o.a; if (a <= 0.003) return { w: 0 };
  const sz = o.size || 72, bs = Math.max(21, Math.round(sz * (o.beforeK || 0.5))), k = o.k == null ? 1 : o.k, kb = clamp(k * 6), landed = k > 0.985;
  const bSt = { role: 'd1', size: bs, weight: 800, track: -0.02, tnum: true }, aSt = { font: 'disp', size: Math.max(21, Math.round(bs * 0.8)), weight: 700 };
  const aftSt = { role: 'd1', size: sz, weight: 800, track: -0.03, tnum: true }, us = Math.max(21, Math.round(sz * 0.34)), uSt = { font: 'sans', size: us, weight: 650, caps: false };
  const wB = tw(o.before, bSt), wA = tw('→', aSt), wL = tw(o.after, aftSt), wU = o.unit ? 10 + tw(o.unit, uSt) : 0;
  const total = (kb > 0.003 ? wB + 14 + wA + 16 : 0) + wL + wU;
  let xx = o.align === 'right' ? x - total : o.align === 'center' ? x - total / 2 : x;
  const x0 = xx;
  if (o.label) text(o.label, o.align === 'right' ? x : x0, y - sz * 0.74 - 20, { role: 'label', size: 19, color: C.mute, align: o.align === 'right' ? 'right' : 'left', alpha: a });
  if (kb > 0.003) {
    text(o.before, xx, y, Object.assign({ color: C.faint, alpha: a * kb }, bSt));
    line(xx - 3, y - bs * 0.34, xx + wB + 3, y - bs * 0.34, { color: C.mute, w: Math.max(2, bs * 0.06), alpha: a * kb });
    text('→', xx + wB + 14, y - bs * 0.06, Object.assign({ color: C.faint, alpha: a * kb }, aSt));
    xx += wB + 14 + wA + 16;
  }
  const hero = (o.hero || landed) && o.good !== false, col = hero ? C.heroText : k <= 0.003 && o.bad ? o.bad : C.ink;
  text(o.after, xx, y, Object.assign({ color: col, grad: hero ? C.heroGrad : null, alpha: a }, aftSt));
  if (o.unit) text(o.unit, xx + wL + 10, y, Object.assign({ color: C.mute, alpha: a }, uSt));
  if (o.net && kb > 0.003) {
    if (o.netRight) text(o.net, x0 + total + 26, y - Math.round(sz * 0.12), { role: 'small', size: o.netSize || 25, weight: 700, color: C.heroText, alpha: a * kb, maxW: o.netW || 600, lh: 1.25 });
    else text(o.net, o.align === 'right' ? x : x0, y + Math.round(sz * 0.2) + 26, { role: 'small', size: o.netSize || 24, weight: 700, color: C.heroText, align: o.align === 'right' ? 'right' : 'left', alpha: a * kb, maxW: o.netW || 900 });
  }
  return { w: total };
}

/* the value at a bar's end, before → after: the plain wall's 100 % struck, then the live value. Right-aligned at xr.
   Returns its width */
function shellMeterVal(xr, y, now, a, kb) {
  const vSt = { font: 'disp', size: 34, weight: 800, tnum: true }, bSt = { font: 'disp', size: 21, weight: 750, tnum: true }, aSt = { font: 'disp', size: 21, weight: 700 };
  const sv = fmtPct(now), wv = tw(sv, vSt);
  text(sv, xr, y, Object.assign({ color: C.heroText, grad: C.heroGrad, align: 'right', alpha: a }, vSt));
  if (kb <= 0.003) return wv;
  const wa = tw('→', aSt), wb = tw('100%', bSt), xa = xr - wv - 10 - wa, xb = xa - 10 - wb;
  text('→', xa, y - 3, Object.assign({ color: C.faint, alpha: a * kb }, aSt));
  text('100%', xb, y - 3, Object.assign({ color: C.faint, alpha: a * kb }, bSt));
  line(xb - 2, y - 10, xb + wb + 2, y - 10, { color: C.mute, w: 2, alpha: a * kb });
  return xr - xb;
}
const SHELL_VALW = 178;
/* one bar: the plain wall's 100 % as the faint red track (the bad case stays on screen), Theseus's bar over it, a notch
   where it stood before this step, a notch per earlier step, and the ghost's hollow mark */
function shellMeterBar(bx, by, bw, list, what, before, now, k, a, ga, o) {
  const bh = 16, r = bh / 2, val = s => s[what] == null ? 1 : s[what];
  rr(bx, by, bw, bh, r, C.track, null, 0, a);
  rr(bx, by, bw, bh, r, rgba(C.bad, TH ? 0.16 : 0.24), null, 0, a);
  rr(bx, by, Math.max(bh, bw * clamp(now)), bh, r, C.hero, null, 0, a);
  if (list.length > 1 || before !== 1) { const px = bx + bw * clamp(before); rr(px - 1.5, by - 4, 3, bh + 8, 1.5, inkA(0.35), null, 0, a * (1 - k * 0.5)); }
  let f = 1; list.forEach((s, i) => { f *= val(s); if (i < list.length - 2 && val(s) !== 1) rr(bx + bw * clamp(f) - 1.5, by - 4, 3, bh + 8, 1.5, inkA(0.3), null, 0, a); });
  if (o.ghost && o.ghost[what] != null) { const gx = bx + bw * clamp(o.ghost[what]); rr(gx - 5, by - 5, 10, bh + 10, 5, null, C.ink2, 2, ga); }
}
function shellMeter(t, t0, key, x, y, w, o = {}) {
  const steps = shellStepsOrdered(), upto = Math.max(0, steps.findIndex(s => s.key === key)), list = steps.slice(0, upto + 1);
  const a = ep(t, t0, t0 + 0.5) * (o.alpha == null ? 1 : o.alpha); if (a <= 0.003 || !list.length) return 0;
  const k = ep(t, t0 + 0.5, t0 + 1.8, E.cam);
  const rows = o.only ? [o.only] : ['flex', 'stress'];
  const fac = what => { const v = s => s[what] == null ? 1 : s[what]; const before = list.slice(0, -1).reduce((f, s) => f * v(s), 1), after = before * v(list[list.length - 1]); return { before, after, now: lerp(before, after, k) }; };
  const labOf = what => what === 'flex' ? SHELL_FLEX_LAB : SHELL_PEAK_LAB, labSt = { role: 'label', size: 19, color: C.ink2 };
  const ga = a * ep(t, t0 + 1.2, t0 + 1.8);
  const hd = ['Same press, same weight', 'vs a plain wall'];
  /* one line, both bars side by side: the header in two lines at the left, then a block per bar (label over it) */
  if (o.row) {
    const hw = Math.max(tw(hd[0], { role: 'label', size: 19 }), tw(hd[1], { role: 'label', size: 19 })) + 40;
    const need = rows.map(wh => Math.max(tw(labOf(wh), labSt), 160) + SHELL_VALW + 20);
    if (hw + need.reduce((s, v) => s + v, 0) + 40 * (rows.length - 1) <= w) {
      text(hd[0], x, y + 20, { role: 'label', size: 19, color: C.mute, alpha: a });
      text(hd[1], x, y + 46, { role: 'label', size: 19, color: C.ink2, alpha: a });
      const bw0 = (w - hw - 40 * (rows.length - 1)) / rows.length;
      rows.forEach((what, ri) => {
        const bx0 = x + hw + ri * (bw0 + 40), F = fac(what), kb = list.length > 1 || F.before !== 1 || k > 0.003 ? 1 : 0;
        text(labOf(what), bx0, y + 16, Object.assign({ alpha: a }, labSt));
        shellMeterBar(bx0, y + 30, bw0 - SHELL_VALW, list, what, F.before, F.now, k, a, ga, o);
        shellMeterVal(bx0 + bw0, y + 50, F.now, a, kb);
      });
      return 64;
    }
    o = Object.assign({}, o, { compact: true });
  }
  const head = ltag(x, y + 14, hd[0], hd[1], { a, size: 19, color: C.mute, vcolor: C.ink2 });
  /* the ghost's name: a hollow mark and the words, at the right end of the header row when it fits there, else on a
     line of its own under the bars */
  const gl = o.ghost && o.ghost.label, glw = gl ? tw(gl, { role: 'label', size: 19 }) + 22 : 0, glUp = gl && head + 32 + glw <= w;
  const ghostLegend = (gx, gy, ga2) => { text(gl, gx, gy, { role: 'label', size: 19, color: C.mute, align: 'right', alpha: ga2 }); rr(gx - glw, gy - 15, 10, 20, 5, null, C.ink2, 2, ga2); };
  if (glUp) ghostLegend(x + w, y + 14, ga);
  rows.forEach((what, ri) => {
    const ry = y + 52 + ri * 62, F = fac(what), kb = list.length > 1 || F.before !== 1 || k > 0.003 ? 1 : 0;
    /* the label over the bar; the bar; the value, before → after, at its right */
    text(labOf(what), x, ry - 6, Object.assign({ alpha: a, maxW: w - 8 }, labSt));
    shellMeterBar(x, ry + 6, w - SHELL_VALW, list, what, F.before, F.now, k, a, ga, o);
    shellMeterVal(x + w, ry + 26, F.now, a, kb);
  });
  let ny = y + 52 + rows.length * 62 + 8;
  if (gl && !glUp) { ghostLegend(x + w, ny, ga); ny += 30; }
  if (o.compact) return ny - y;
  /* the step names, in order, the current one in ink */
  let xx = x; const sep = '  ›  ';
  list.forEach((s, i) => { const last = i === list.length - 1, r = text((i ? sep : '') + s.label, xx, ny, { role: 'label', size: 19, color: last ? C.ink : C.faint, alpha: a * (last ? Math.max(0.4, k) : 1) }); xx += r.w; });
  text('Each step\'s factors come from its own model; the strip multiplies them.', x, ny + 32, { role: 'foot', color: C.faint, alpha: a * 0.9, maxW: w, sentence: true });
  return ny + 44 - y;
}
