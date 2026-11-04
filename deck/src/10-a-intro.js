/* ============================================================================================
   main deck: in pursuit of an objectively better mouse. Every feature the best possible mouse needs,
   and why each one objectively helps. Voice: Brock, first person, straight and technical.
   The mouse's shape never appears: the shape is the part most likely to change. Every visual is a
   single part, a section through one, or a chart.
   ============================================================================================ */
const DECK = {
  chapters: [
    { key: 'intro', name: 'Intro' }, { key: 'click', name: 'Clicks' }, { key: 'glide', name: 'Glide and tracking' },
    { key: 'shell', name: 'Shell and structure' }, { key: 'surface', name: 'Surface and details' }, { key: 'elec', name: 'Electronics' },
    { key: 'shape', name: 'Shape' }, { key: 'own', name: 'Ownership' }, { key: 'end', name: 'Close' }
  ],
  slides: []
};
const S = o => (DECK.slides.push(o), o);
function chapterIdeaCount(key) { const set = new Set(); DECK.slides.filter(s => s.ch === key).forEach(s => (s.ideas || []).forEach(i => set.add(String(i)))); return set.size; }
/** a click: trigger travel 0..1 with a hard stop, in a cycle; phase c from cyc() */
function clickCurve(c) { return c < 0 ? 0 : c < 0.03 ? E.hit(c / 0.03) : c < 0.09 ? 1 : c < 0.13 ? 1 - E.out3((c - 0.09) / 0.04) : 0; }
/** a switch pressed in a loop, with the contact's hysteresis: it snaps to NO at 0.5 mm and back at 0.3 mm */
function swCycle(t, t0, per) { const c = cyc(t, t0, per), pr = clickCurve(c), d = pr * SWG.TT, down = c >= 0 && c < 0.09; return { c, pr, state: (down ? d >= SWG.OP : d > 0.3) ? 'no' : 'nc' }; }
/* when the moving contact lands, on NO and again back on NC: the phase of each, found once */
const SNAPC = (() => { let no = 0, nc = 0; for (let c = 0; c < 0.2; c += 0.0002) { const d = clickCurve(c) * SWG.TT; if (!no && c < 0.09 && d >= SWG.OP) no = c; if (!nc && c > 0.09 && d <= 0.3) nc = c; } return { no, nc }; })();
/** a contact landing: a flash and a few sparks for 0.16 s after dt = 0 */
function contactSpark(p, dt, col, s = 1, seed = 1) {
  if (!p || dt < 0 || dt > 0.16) return;
  const k = 1 - dt / 0.16; glow(p[0], p[1], 30 * s, col, 0.75 * k); glow(p[0], p[1], 9 * s, '#ffffff', 0.9 * k);
  const r = rng(seed); for (let i = 0; i < 7; i++) { const a = r() * TAU, d = (5 + dt * 280 * (0.6 + r() * 0.6)) * s; circle(p[0] + Math.cos(a) * d, p[1] + Math.sin(a) * d * 0.7, 1.6 * s, { fill: '#e8f2ff', alpha: k * 0.9 }); }
}
/** a small indicator lamp */
function lamp(x, y, label, on, col, a = 1) { circle(x, y, 8, { fill: on ? col : 'rgba(0,0,0,0)', color: on ? col : C.faint, w: 2, alpha: a }); if (on) circle(x, y, 15, { color: col, w: 1.5, alpha: 0.35 * a }); text(label, x + 18, y + 8, { role: 'label', color: on ? col : C.faint, alpha: a }); }
/** a figure label in the drafting style: number and name */
function figLabel(t, t0, x, y, n, name, o = {}) { const a = ep(t, t0, t0 + 0.4); rich([{ s: 'Fig. ' + pad2(n), role: 'label', size: 21, color: o.color || C.mute }, { s: name, role: 'small', size: 24, weight: 500, color: C.faint, sentence: true, gap: 16 }], x, y, { alpha: a }); }

/* The intro's slides (cover, thesis, the bar, the flagships, the weight story, the 29 g decision, the map) live in
   14-b-intro-ex.js, in order; the close is in 10-i-close.js. groovePart stays here: the shape chapter draws it. */
function groovePart(t) {
  /* a slice through a grip surface, generic: a soft curve, and the push it gives back to a fingertip */
  const A = acc('shape');
  solid(() => { G.beginPath(); for (let x = -9; x <= 9; x += 0.3) G.lineTo(x, -0.035 * x * x); for (let x = 9; x >= -9; x -= 0.3) G.lineTo(x, -0.035 * x * x + 1.2); G.closePath(); }, MT.shell, [-9, -3, 18, 4.4], { hatch: true });
  for (const x of [-5, 0, 5]) { const nx = 0.07 * x, ny = 1, l = Math.hypot(nx, ny), y = -0.035 * x * x, ux = -nx / l, uy = -ny / l, x1 = x + ux * 4.2, y1 = y + uy * 4.2; mmLine([[x + ux * 0.3, y + uy * 0.3], [x1, y1]], A, 2.4); G.beginPath(); G.moveTo(x1 + ux * 0.9, y1 + uy * 0.9); G.lineTo(x1 - uy * 0.45, y1 + ux * 0.45); G.lineTo(x1 + uy * 0.45, y1 - ux * 0.45); G.closePath(); G.fillStyle = A; G.fill(); }
}
