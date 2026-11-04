/* ============================================================================================
   the shell chapter's running meter: one strip that follows every strength step in the chapter, so the gains add up
   on screen, slide after slide. Two bars, both at the same press and the same mass, with an industry-standard shell
   as 100 %: FLEX (how far it gives) and PEAK STRESS (how close it gets to breaking). Each step multiplies them by its
   own factors, and the bars drop.

   The baseline, "a standard shell": a thin solid wall with hexagon ribbing, at Theseus's mass, as most light shells
   are built. The first slide that shows the meter says so.

     shellStep({ key, slide, label, flex, stress, ev, how })   register a step (call it at the top level of a slide file)
        key: a short id; slide: the id of the slide that shows it; label: 'Triangles' (a word or two);
        flex: the flex after the step ÷ the flex before it (0.45 = 55 % less flex); stress: the same for the peak stress
        (leave either out when the step does not change it); both from that slide's own model; ev: its evidence kind
        (usually 'derived'); how: one line on the model ('2D frame, PP-C-20A, 10 N at the crown')
     shellMeter(t, t0, key, x, y, w, o)   draw the strip with every step up to and including `key` (in deck order),
        the current step animating in. About 190 px tall (140 with o.compact). o = { alpha, compact, only: 'flex' | 'stress' }

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
/** the cumulative factor (1 = the standard shell) for 'flex' or 'stress' after the step `key`, or after all steps */
function shellFactorAt(key, what = 'flex') { let f = 1; for (const s of shellStepsOrdered()) { f *= s[what] == null ? 1 : s[what]; if (s.key === key) break; } return f; }
function shellMeter(t, t0, key, x, y, w, o = {}) {
  const steps = shellStepsOrdered(), upto = Math.max(0, steps.findIndex(s => s.key === key)), list = steps.slice(0, upto + 1);
  const a = ep(t, t0, t0 + 0.5) * (o.alpha == null ? 1 : o.alpha); if (a <= 0.003 || !list.length) return;
  const k = ep(t, t0 + 0.5, t0 + 1.8, E.cam);
  const rows = o.only ? [o.only] : ['flex', 'stress'];
  ltag(x, y + 14, 'Same press, same mass', 'vs a standard shell', { a, size: 19, color: C.mute, solid: C.ink2, on: C.bg });
  rows.forEach((what, ri) => {
    const ry = y + 52 + ri * 62, val = s => s[what] == null ? 1 : s[what];
    const before = list.slice(0, -1).reduce((f, s) => f * val(s), 1), after = before * val(list[list.length - 1]), now = lerp(before, after, k);
    text(what === 'flex' ? 'Flex' : 'Peak stress', x, ry + 15, { role: 'label', size: 19, color: C.ink2, alpha: a });
    const bx = x + 170, bw = w - 170 - 96, bh = 14;
    G.save(); G.globalAlpha = a; G.fillStyle = C.track; G.fillRect(bx, ry + 2, bw, bh); G.fillStyle = C.hero; G.fillRect(bx, ry + 2, bw * clamp(now), bh); G.restore();
    /* where each earlier step left the bar */
    let f = 1; list.forEach((s, i) => { f *= val(s); if (i < list.length - 1 && val(s) !== 1) line(bx + bw * clamp(f), ry - 3, bx + bw * clamp(f), ry + bh + 7, { color: C.ink, w: 1.2, alpha: a * 0.6 }); });
    text(fmtPct(now), x + w, ry + 17, { role: 'num', size: 28, weight: 800, color: C.heroText, align: 'right', tnum: true, alpha: a });
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
