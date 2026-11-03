/* ============================================================================================
   audio: mechanical sound design, synthesized (no samples, no whooshes). Off until the viewer turns it on.
   click: a microswitch contact, a short bright noise burst plus a decaying ping. release: the softer return.
   tick: a data mark landing. seat: parts closing together. snap: a hard contact.
   Slides list cues as [time, kind, options]; a cue fires once when slide time passes it.
   ============================================================================================ */
const AU = { ctx: null, on: false, master: null, noise: null };
function auInit() {
  if (AU.ctx) { if (AU.ctx.state === 'suspended') AU.ctx.resume(); return; }
  const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
  const c = new AC(); AU.ctx = c;
  AU.master = c.createGain(); AU.master.gain.value = 0.5;
  const comp = c.createDynamicsCompressor(); comp.threshold.value = -12; comp.ratio.value = 5; comp.attack.value = 0.002; comp.release.value = 0.15;
  AU.master.connect(comp); comp.connect(c.destination);
  const n = c.createBuffer(1, c.sampleRate * 0.5, c.sampleRate), d = n.getChannelData(0); let s = 1234567;
  for (let i = 0; i < d.length; i++) { s = (s * 1103515245 + 12345) & 0x7fffffff; d[i] = s / 0x3fffffff - 1; }
  AU.noise = n;
}
function auBurst(t, dur, f, q, g, type = 'bandpass') {
  const c = AU.ctx, src = c.createBufferSource(); src.buffer = AU.noise;
  const flt = c.createBiquadFilter(); flt.type = type; flt.frequency.value = f; flt.Q.value = q;
  const gn = c.createGain(); gn.gain.setValueAtTime(0, t); gn.gain.linearRampToValueAtTime(g, t + 0.0008); gn.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(flt); flt.connect(gn); gn.connect(AU.master); src.start(t, Math.random() * 0.3); src.stop(t + dur + 0.02);
}
function auTone(t, f0, f1, dur, g, type = 'sine') {
  const c = AU.ctx, o = c.createOscillator(); o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
  const gn = c.createGain(); gn.gain.setValueAtTime(0, t); gn.gain.linearRampToValueAtTime(g, t + 0.001); gn.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(gn); gn.connect(AU.master); o.start(t); o.stop(t + dur + 0.02);
}
function sfx(kind, o = {}) {
  if (!AU.on || !AU.ctx) return;
  const t = AU.ctx.currentTime + 0.004, v = o.gain == null ? 1 : o.gain, p = o.pitch || 1;
  if (kind === 'click') { auBurst(t, 0.018, 3800 * p, 2.5, 0.9 * v); auTone(t, 2300 * p, 1900 * p, 0.03, 0.22 * v, 'triangle'); auBurst(t, 0.05, 900 * p, 1.2, 0.18 * v); }
  else if (kind === 'release') { auBurst(t, 0.012, 4600 * p, 3, 0.45 * v); auTone(t, 2800 * p, 2500 * p, 0.018, 0.1 * v, 'triangle'); }
  else if (kind === 'mush') { auBurst(t, 0.04, 1500 * p, 1.1, 0.5 * v); }
  else if (kind === 'tick') { auBurst(t, 0.006, 6500 * p, 2, 0.28 * v, 'highpass'); }
  else if (kind === 'seat') { auTone(t, 150 * p, 70 * p, 0.09, 0.5 * v); auBurst(t, 0.03, 700 * p, 1, 0.25 * v, 'lowpass'); }
  else if (kind === 'snap') { auBurst(t, 0.01, 2600 * p, 4, 0.7 * v); auTone(t, 1250 * p, 900 * p, 0.04, 0.16 * v, 'square'); }
  else if (kind === 'blip') { auTone(t, 1400 * p, 1400 * p, 0.03, 0.07 * v); }
  else if (kind === 'scroll') { for (let i = 0; i < (o.n || 6); i++) auBurst(t + i * (o.dt || 0.045), 0.006, 5200 * p, 3, 0.3 * v); }
}
/** fire the cues of slide s whose time lies in (a, b]; loops: {t0, per, cues:[[phase, kind, o]]} */
function sfxRun(s, a, b) {
  if (!AU.on || b <= a || b - a > 0.5) return;
  for (const c of s.sfx || []) if (c[0] > a && c[0] <= b) sfx(c[1], c[2]);
  for (const L of s.sfxLoop || []) {
    if (b < L.t0) continue;
    const n0 = Math.floor((a - L.t0) / L.per), n1 = Math.floor((b - L.t0) / L.per);
    for (let n = Math.max(0, n0); n <= n1; n++) for (const c of L.cues) { const tc = L.t0 + n * L.per + c[0] * L.per; if (tc > a && tc <= b) sfx(c[1], c[2]); }
  }
}
