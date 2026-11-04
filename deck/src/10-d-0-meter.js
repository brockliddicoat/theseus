/* ============================================================================================
   the shell chapter's running meter: one strip that follows every strength step in the chapter, so the gains add up
   on screen, slide after slide. Two bars, both at the same press and the same mass, with a plain wall as 100 %:
   FLEX (how far it gives) and PEAK STRESS (how close it gets to breaking). Each step multiplies them by its own
   factors, and the bars drop.

   The baseline, "a plain wall" (100 %): a plain thin wall, solid, with no ribbing, at Theseus's mass. The first step is
   that wall becoming the triangle-lattice shell at the same mass (10-d-shell.js, slide shlShell3d); every later step is
   relative to the step before. The first slide that shows the meter says so.

     shellStep({ key, slide, label, flex, stress, ev, how })   register a step (call it at the top level of a slide file)
        key: a short id; slide: the id of the slide that shows it; label: 'Triangles' (a word or two);
        flex: the flex after the step ÷ the flex before it (0.45 = 55 % less flex); stress: the same for the peak stress
        (leave either out when the step does not change it); both from that slide's own model; ev: its evidence kind
        (usually 'derived'); how: one line on the model ('2D frame, PP-C-20A, 10 N at the crown')
     shellMeter(t, t0, key, x, y, w, o)   draw the strip with every step up to and including `key` (in deck order),
        the current step animating in. About 190 px tall (140 with o.compact). o = { alpha, compact, only: 'flex' | 'stress',
        ghost: { flex, stress, label } (a comparison that is not a step, against the same plain wall: a hollow mark on
        each bar, e.g. hexagon ribbing at the same mass) }
     shellFactorAt(key, what)   the running factor after `key` ('flex' or 'stress'), 1 = the plain wall

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
function shellMeter(t, t0, key, x, y, w, o = {}) {
  const steps = shellStepsOrdered(), upto = Math.max(0, steps.findIndex(s => s.key === key)), list = steps.slice(0, upto + 1);
  const a = ep(t, t0, t0 + 0.5) * (o.alpha == null ? 1 : o.alpha); if (a <= 0.003 || !list.length) return;
  const k = ep(t, t0 + 0.5, t0 + 1.8, E.cam);
  const rows = o.only ? [o.only] : ['flex', 'stress'];
  ltag(x, y + 14, 'Same press, same mass', 'vs a plain wall', { a, size: 19, color: C.mute, solid: C.ink2, on: C.bg });
  /* the ghost's name, as a legend at the right end of the header row: a hollow mark and the words */
  if (o.ghost && o.ghost.label) {
    const ga = a * ep(t, t0 + 1.2, t0 + 1.8), lw = tw(o.ghost.label, { role: 'label', size: 19 });
    text(o.ghost.label, x + w, y + 14, { role: 'label', size: 19, color: C.mute, align: 'right', alpha: ga });
    rr(x + w - lw - 22, y - 1, 10, 20, 5, null, C.ink2, 2, ga);
  }
  rows.forEach((what, ri) => {
    const ry = y + 52 + ri * 62, val = s => s[what] == null ? 1 : s[what];
    const before = list.slice(0, -1).reduce((f, s) => f * val(s), 1), after = before * val(list[list.length - 1]), now = lerp(before, after, k);
    ltag(x, ry + 15, what === 'flex' ? 'Flex' : 'Peak stress', null, { a, size: 19, color: C.ink2 });
    const bx = x + 170, bw = w - 170 - 110, bh = 16, r = bh / 2;
    /* the plain wall's 100 %, a soft track; Theseus's bar, rounded, in its gradient, eased down to the running factor */
    rr(bx, ry + 1, bw, bh, r, C.track, null, 0, a);
    const fw = Math.max(bh, bw * clamp(now));
    G.save(); G.globalAlpha = a; rrPath(bx, ry + 1, fw, bh, r); G.fillStyle = gradH(bx, Math.max(fw, 60), C.heroGrad); G.fill(); G.restore();
    /* a light that runs along the bar while it moves */
    if (k > 0 && k < 1) { const lx = bx + bw * clamp(now); G.save(); G.globalAlpha = a * Math.sin(k * Math.PI) * 0.7; const g = G.createRadialGradient(lx, ry + 2 + r, 0, lx, ry + 2 + r, 26); g.addColorStop(0, rgba(C.hero, 0.55)); g.addColorStop(1, rgba(C.hero, 0)); G.fillStyle = g; G.fillRect(lx - 26, ry + 2 + r - 26, 52, 52); G.restore(); }
    /* where each earlier step left the bar: a small rounded notch */
    let f = 1; list.forEach((s, i) => { f *= val(s); if (i < list.length - 1 && val(s) !== 1) rr(bx + bw * clamp(f) - 1.5, ry - 3, 3, bh + 10, 1.5, inkA(0.45), null, 0, a); });
    /* a comparison against the same plain wall that is not a step (o.ghost): a hollow rounded mark and its name */
    if (o.ghost && o.ghost[what] != null) {
      const gx = bx + bw * clamp(o.ghost[what]), ga = a * ep(t, t0 + 1.2, t0 + 1.8);
      rr(gx - 5, ry - 4, 10, bh + 12, 5, null, C.ink2, 2, ga);
    }
    text(fmtPct(now), x + w, ry + 19, { font: 'disp', size: 34, weight: 800, color: C.heroText, grad: C.heroGrad, align: 'right', tnum: true, alpha: a });
  });
  /* the step names, in order, the current one in ink */
  const ny = y + 52 + rows.length * 62 + 8;
  if (!o.compact) {
    let xx = x; const sep = '  ›  ';
    list.forEach((s, i) => { const last = i === list.length - 1, r = text((i ? sep : '') + s.label, xx, ny, { role: 'label', size: 19, color: last ? C.ink : C.faint, alpha: a * (last ? Math.max(0.4, k) : 1) }); xx += r.w; });
    text('Each step\'s factors come from its own model; the strip multiplies them.', x, ny + 32, { role: 'foot', color: C.faint, alpha: a * 0.9, maxW: w, sentence: true });
  }
}
const fmtPct = v => Math.round(v * 100) + '%';
