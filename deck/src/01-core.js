/* ============================================================================================
   core: stage, colour, type, easing, time helpers, 2D drawing primitives.
   Every frame is a pure function of slide time t (seconds), so any frame can be captured.
   The design system is written down in DESIGN.md: read it before adding a slide.
   ============================================================================================ */
'use strict';
const W = 1920, H = 1080;

/* ---------- colour ----------
   Two grounds, from the old film: paper (TH = 1) and night (TH = 0). Paper is XBAB's light grey.
   Every neutral is a step on one ramp per ground; nothing warm, nothing tan.
   Blue is Theseus and only Theseus (HERO, C.hero, its gradient C.heroGrad): in a chart it marks our number and nothing
   else. Yellow, the deck's first hero colour, is now the second highlight: the next best, the one to beat (C.second,
   C.ref). Red means a problem: a failure, a gap, a breakage (C.red, C.bad). Stress heat runs amber to red (heatCol).
   The palette is the old vibrant one, pushed toward Apple's keynote colours (systemBlue, systemYellow, systemRed).
   Each chapter has one accent for its chrome (section label, chapter card, highlights in drawings). */
let TH = 0;
const PAPER = '#F7F6F2', NIGHT = '#0D0E0F';
/* Theseus's colour is a setting while Brock chooses: ?hue=blue | red | yellow (or THESEUS_HUE before the deck loads).
   Each hue brings its next best and its problem colour, so the three never collide: blue Theseus → yellow next best, red
   problems; red Theseus → yellow next best, problems in a flat grey; yellow Theseus (the deck's first) → blue next best,
   red problems. [paper, night] pairs. */
const HUES = {
  blue: { hero: ['#0A6CFF', '#2F8CFF'], text: ['#0058D6', '#64B0FF'], grad: [['#1F9BFF', '#0A6CFF', '#3D4FE0'], ['#7AD4FF', '#2F8CFF', '#6A63FF']],
          second: ['#E3A800', '#FDC316'], secondText: ['#8F6A00', '#FDC316'], bad: ['#E5484D', '#E5484D'] },
  red: { hero: ['#D9343B', '#E5484D'], text: ['#C8292F', '#FF6369'], grad: [['#F2555A', '#D9343B', '#B81E3F'], ['#FF8A80', '#E5484D', '#D6336C']],
         second: ['#E3A800', '#FDC316'], secondText: ['#8F6A00', '#FDC316'], bad: ['#8A8983', '#8E8D88'] },
  yellow: { hero: ['#E3A800', '#FDC316'], text: ['#8F6A00', '#FDC316'], grad: [['#F2B600', '#D99000', '#C77700'], ['#FFE066', '#FDC316', '#FFAA00']],
            second: ['#0A6CFF', '#4F9BFF'], secondText: ['#0058D6', '#7AB4FF'], bad: ['#E5484D', '#E5484D'] }
};
const HUE = (() => { try { const m = /[?&]hue=(red|blue|yellow)\b/.exec(location.search); if (m) return m[1]; } catch (e) { } return (typeof window !== 'undefined' && window.THESEUS_HUE) || 'blue'; })();
const HU = HUES[HUE] || HUES.blue;
const HERO = HU.hero[1], HERO_P = HU.hero[0];   /* Theseus: the fill on night, the fill on paper */
const YEL = '#FDC316';                         /* the deck's first yellow */
const RAMP = {
  /*           ink        ink2       mute       faint      hair       track      panel      line                    comp       comp2    */
  paper: ['#111111', '#2E2E2C', '#66655F', '#8A8983', '#DDDCD6', '#E7E6E1', '#FFFFFF', 'rgba(17,17,17,0.10)', '#B9B8B2', '#D3D2CC'],
  night: ['#F3F2EE', '#CFCEC9', '#96958F', '#6E6D68', '#26272A', '#1F2023', '#151619', 'rgba(255,255,255,0.09)', '#55554F', '#3A3A37']
};
const rampOf = i => (TH ? RAMP.paper : RAMP.night)[i];
const C = {
  redL: '#EF7275', redD: '#B8383D',
  blue: '#4385E4', blueL: '#609EFA', blueD: '#3466BF',
  purple: '#8A70DD', purpleL: '#A18BF3', purpleD: '#6F55C4',
  green: '#1FA466', greenL: '#46B86E', greenD: '#14824F',
  gray: '#9DA3AE', white: '#FFFFFF', yel: YEL,
  onHero: HUE === 'yellow' ? '#111111' : '#FFFFFF', heroChip: HERO_P        /* a solid block of Theseus's colour and the ink on it */
};
Object.defineProperties(C, {
  hero: { get: () => HU.hero[TH ? 0 : 1] },                      /* Theseus: its bar, point, line, column */
  heroText: { get: () => HU.text[TH ? 0 : 1] },                  /* Theseus as small text or a thin line */
  heroSoft: { get: () => rgba(HU.hero[TH ? 0 : 1], TH ? 0.12 : 0.16) },   /* a field of Theseus's colour behind something */
  /* Theseus's gradient: for its type only (big numbers, its name). Everything else is flat */
  heroGrad: { get: () => HU.grad[TH ? 0 : 1] },
  second: { get: () => HU.second[TH ? 0 : 1] },                  /* the next best: its bar, point, line */
  secondText: { get: () => HU.secondText[TH ? 0 : 1] },          /* the next best as small text or a thin line */
  /* a problem: a failure, a gap, a breakage, placeholder data (red, unless Theseus is red) */
  red: { get: () => HU.bad[TH ? 0 : 1] }, bad: { get: () => C.red }, badL: { get: () => C.redL }, badD: { get: () => C.redD },
  /* heat: stress and load in a drawing, low to high (amber, orange, red) */
  heat: { get: () => (TH ? '#E8590C' : '#FF7A2E') }, heatL: { get: () => (TH ? '#F0A020' : '#FFC24D') },
  bg: { get: () => (TH ? PAPER : NIGHT) },
  ink: { get: () => rampOf(0) },            /* headlines, hero numbers */
  ink2: { get: () => rampOf(1) },           /* body text */
  mute: { get: () => rampOf(2) },           /* secondary text, labels (≥ 5:1 on paper) */
  faint: { get: () => rampOf(3) },          /* tertiary: ticks, notes that can be missed */
  hair: { get: () => rampOf(4) },           /* rules, gridlines */
  track: { get: () => rampOf(5) },          /* the empty part of a bar (XBAB) */
  panel: { get: () => rampOf(6) },          /* card (tile) surface */
  line: { get: () => rampOf(7) },           /* card border */
  comp: { get: () => rampOf(8) },           /* a competitor's bar or point */
  comp2: { get: () => rampOf(9) },          /* a dimmed competitor (dominated, out of scope) */
  ref: { get: () => C.second },             /* the reference: the best one shipping today, the one to beat (yellow) */
  heroEdge: { get: () => 'rgba(0,0,0,0)' }, /* the old black edge round yellow bars on paper; blue needs none */
  dot: { get: () => (TH ? 'rgba(17,17,17,0.30)' : 'rgba(243,242,238,0.30)') }, /* one sample in a chart */
  good: { get: () => (TH ? '#14824F' : '#46B86E') },
  /* old names: yellow and gold meant Theseus when Theseus was yellow, so they answer with the hero colour;
     true yellow is C.yel / C.second */
  yellow: { get: () => C.hero }, gold: { get: () => C.hero },
  orange: { get: () => (TH ? '#D9701E' : '#F08A3C') },
  brown: { get: () => rampOf(2) }, brownL: { get: () => rampOf(2) },
  loss: { get: () => C.red }, steel: { get: () => C.gray }, cool: { get: () => C.purple }
});
function hexRgb(h) { const n = parseInt(h.slice(1), 16); return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]; }
function rgba(hex, a) { if (hex.startsWith('rgb')) return hex; const c = hexRgb(hex); return `rgba(${Math.round(c[0] * 255)},${Math.round(c[1] * 255)},${Math.round(c[2] * 255)},${a})`; }
function inkA(a) { return TH ? `rgba(17,17,17,${a})` : `rgba(243,242,238,${a})`; }
/** mix two hex colours */
function mix(a, b, k) { const x = hexRgb(a), y = hexRgb(b); return '#' + x.map((v, i) => Math.round((v + (y[i] - v) * k) * 255).toString(16).padStart(2, '0')).join(''); }
/** chapter accents: the deck's old set (Brock, 07:35: "Old chapter colours"). Clicks was blue, which is Theseus now, and
   glide's green is out ("the green you used looks bad"), so both are neutral, like the intro and the close */
const ACCENTS = {
  shell: ['#8A70DD', '#A18BF3'], surface: ['#C35AA4', '#DA76BB'], elec: ['#009DBD', '#00B5D4'], shape: ['#6E9A10', '#8FAC31'], own: ['#6F7C8F', '#8C98AA']
};
const ACC = Object.fromEntries(Object.keys(ACCENTS).map(k => [k, () => ACCENTS[k][TH ? 0 : 1]]));
ACC.intro = () => C.ink; ACC.end = () => C.ink; ACC.click = () => C.ink; ACC.glide = () => C.ink;
function acc(key) { const f = ACC[key || (typeof curSlide === 'function' && curSlide() ? curSlide().ch : 'intro')]; return f ? f() : C.ink; }

/* ---------- type ----------
   Inter Display (opsz 32) for display type, set in caps; Inter (opsz 14) for reading; JetBrains Mono for labels and numbers.
   Sizes are stage pixels on the 1920 × 1080 stage. A phone in landscape shows the stage at 844 px wide (× 0.44),
   so nothing a viewer must read goes below T.small (25 px → 11 px on the phone) and no label below T.label (22 → 9.7). */
/* Brock: "use more apple style fonts ... big and bold fonts look good right now, but the smaller skinnier ones look
   unprofessional". So labels, ticks and table values leave JetBrains Mono for Inter (Apple's SF is the model), and no
   text at 30 px or under is set lighter than 560. 'mono' still names the role's face, so old calls keep working;
   MONO_REAL says whether that face really is monospaced (it isn't now, so tabular figures are laid out by hand). */
const FONT = {
  disp: '"Inter Display", "Inter", system-ui, sans-serif',
  sans: '"Inter", system-ui, sans-serif',
  mono: '"Inter", system-ui, sans-serif'
};
const MONO_REAL = false;
const isMono = o => MONO_REAL && o.font === 'mono';
const T = {
  hero: { font: 'disp', size: 300, weight: 900, track: -0.04, lh: 0.84, caps: true },   /* the cover word */
  d1: { font: 'disp', size: 200, weight: 800, track: -0.035, lh: 0.88 },                /* a number that is the slide */
  d2: { font: 'disp', size: 120, weight: 800, track: -0.03, lh: 0.9, caps: true },      /* chapter names, big stats */
  h1: { font: 'disp', size: 62, weight: 800, track: -0.004, lh: 1.0, caps: true },      /* slide titles */
  h2: { font: 'disp', size: 44, weight: 800, track: -0.002, lh: 1.04, caps: true },      /* a title inside a slide */
  stat: { font: 'disp', size: 84, weight: 800, track: -0.025, lh: 1 },                  /* stat-card numbers */
  h3: { font: 'sans', size: 32, weight: 700, track: -0.012, lh: 1.2, sentence: true },                  /* card titles, sentence case */
  lead: { font: 'sans', size: 31, weight: 560, track: -0.006, lh: 1.34, sentence: true },               /* the narration under a title */
  body: { font: 'sans', size: 28, weight: 560, track: -0.004, lh: 1.42, sentence: true },               /* reading text */
  small: { font: 'sans', size: 25, weight: 600, lh: 1.36, sentence: true },                             /* the smallest reading text */
  labelL: { font: 'sans', size: 26, weight: 700, track: 0.05, caps: true },             /* section labels */
  label: { font: 'sans', size: 22, weight: 700, track: 0.055, caps: true },             /* every other label */
  num: { font: 'sans', size: 28, weight: 700, track: -0.005, tnum: true },              /* values in tables and charts */
  numS: { font: 'sans', size: 24, weight: 680, track: 0, tnum: true },
  tick: { font: 'sans', size: 21, weight: 600, track: 0.01, tnum: true },               /* axis ticks */
  foot: { font: 'sans', size: 19, weight: 600, track: 0.02 }                            /* sources and the footer only */
};
const TYPE_MIN = { read: 25, label: 21, foot: 19 };
const NATIVE_LS = typeof CanvasRenderingContext2D !== 'undefined' && 'letterSpacing' in CanvasRenderingContext2D.prototype;

/* ---------- math ---------- */
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, k) => a + (b - a) * k;
const prog = (t, a, b) => clamp((t - a) / (b - a));
const smooth = x => x * x * (3 - 2 * x);
const E = {
  lin: x => x,
  out2: x => 1 - (1 - x) * (1 - x),
  out3: x => 1 - Math.pow(1 - x, 3),
  out5: x => 1 - Math.pow(1 - x, 5),
  in3: x => x * x * x,
  io3: x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,
  io5: x => x < .5 ? 16 * Math.pow(x, 5) : 1 - Math.pow(-2 * x + 2, 5) / 2,
  cam: bezier(0.7, 0, 0.2, 1),      /* strong asymmetric in-out: camera moves */
  snap: bezier(0.2, 0, 0, 1),       /* fast attack, long settle: things arriving */
  hit: bezier(0.55, 0, 1, 0.45),    /* accelerates into contact: a plunger meeting a switch */
  rise: bezier(0.16, 1, 0.3, 1)     /* type rising out of its mask */
};
/** cubic bezier easing (x1, y1, x2, y2), solved by Newton iterations */
function bezier(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx, cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const fx = s => ((ax * s + bx) * s + cx) * s, fy = s => ((ay * s + by) * s + cy) * s, dx = s => (3 * ax * s + 2 * bx) * s + cx;
  return x => {
    if (x <= 0) return 0; if (x >= 1) return 1;
    let s = x;
    for (let i = 0; i < 8; i++) { const d = dx(s); if (Math.abs(d) < 1e-6) break; s -= (fx(s) - x) / d; }
    return fy(clamp(s));
  };
}
/** eased progress of t through [a, b] */
const ep = (t, a, b, e = E.io3) => e(prog(t, a, b));
/** rises over [a, b] and falls over [c, d] */
const env = (t, a, b, c, d, e = E.io3) => Math.min(ep(t, a, b, e), 1 - ep(t, c, d, e));
/** keyframes [[t, v], ...] with easing between neighbours */
function kf(t, keys, e = E.io3) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (t <= keys[i][0]) { const [t0, v0] = keys[i - 1], [t1, v1] = keys[i]; const k = (keys[i][2] || e)(prog(t, t0, t1)); return Array.isArray(v0) ? v0.map((v, j) => lerp(v, v1[j], k)) : lerp(v0, v1, k); }
  }
  return keys[keys.length - 1][1];
}
/** periodic event: phase 0..1 inside a cycle of `per` seconds starting at t0 (negative before t0) */
const cyc = (t, t0, per) => t < t0 ? -1 : ((t - t0) % per) / per;
/** seeded random */
function rng(seed) { let s = seed >>> 0 || 1; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }
const fmt = (v, d = 0) => v.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

/* ---------- case ----------
   Display type and labels are set in caps; units keep their case (8 khz, 0.14 ms, 29 g; Brock writes khz), so caps() protects them. */
/** uppercase Latin letters only: Greek (θ, σ, ρ) and µ keep their case, as in maths */
const upLatin = s => s.replace(/[a-zà-öø-ÿ]/g, c => c.toUpperCase());
const UNIT_ANY = /^(?:µs|us|ms|ns|khz|kHz|Hz|MHz|GHz|mm|µm|cm|mAh|mA|µA|mV|mW|Wh|Wh\/kg|Wh\/L|dB|dBm|dpi|cpi|kg|mg|g\/cm³|N·m|mN·m|mN|kPa|MPa|GPa|nRF\w*|µ\w*)$/;
const UNIT_AFTER_NUM = /^(?:s|h|g|m|min|kg|N|V|W|A|K|x|×|°|°C|%|mm²|cm²|gf|mΩ|Ω|lb|in)$/;
function capsWord(w, prev) {
  const m = /^([("'\[]*)(.*?)([.,;:)"'\]!?]*)$/.exec(w), core = m[2];
  if (!core) return w;
  const num = /^[-−+~≈]?\d[\d.,]*(.*)$/.exec(core);
  if (num) { const u = num[1]; return u && (UNIT_ANY.test(u) || UNIT_AFTER_NUM.test(u)) ? w : m[1] + upLatin(core) + m[3]; }
  if (UNIT_ANY.test(core)) return w;
  if (UNIT_AFTER_NUM.test(core) && prev && /\d[%°]?$/.test(prev)) return w;
  return m[1] + upLatin(core) + m[3];
}
/** uppercase, keeping units in their own case. Anything in {braces} is left exactly as written (the braces are dropped
   when drawn): 'Mass, {g}' → 'MASS, g'; '{piaknow} measured it' keeps the handle lowercase in sentence case too. */
function caps(s) {
  let prev = '';
  return String(s).split(/(\{[^}]*\})/).map(seg => {
    if (seg.startsWith('{')) { prev = seg; return seg; }
    return seg.split(/(\s+)/).map(w => { if (/^\s+$/.test(w) || !w) return w; const r = capsWord(w, prev); prev = w; return r; }).join('');
  }).join('');
}
/** sentence case: a capital at the start of each sentence; leaves the rest alone (brand names keep their capitals) */
function sentence(s) { return String(s).replace(/(^|[.!?]\s+|\n)([a-z])/g, (m, a, b) => a + b.toUpperCase()); }

/* ---------- 2D drawing (stage units 1920 x 1080) ---------- */
let G = null; /* the overlay context, set by the app each frame */
/** resolve a style: a role from T, then explicit properties on top */
function sty(o = {}) {
  const r = o.role ? T[o.role] : null;
  if (!r && !o.__legacy) return o;
  return r ? Object.assign({}, r, o) : o;
}
function fontStr(o) { const sz = o.size || 28, wt = sz <= 30 ? Math.max(o.weight || 400, 560) : (o.weight || 400); return `${o.italic ? 'italic ' : ''}${wt} ${sz}px ${FONT[o.font || 'sans'] || o.font}`; }
/** letter spacing in px: ls is px (old code), track is em (the system) */
const lsPx = o => o.ls != null ? o.ls : (o.track || 0) * (o.size || 28);
function setFont(o) {
  o = sty(o);
  G.font = fontStr(o);
  try { G.fontStretch = o.stretch || 'normal'; } catch (e) { /* older canvas */ }
  if (NATIVE_LS) G.letterSpacing = '0px';
}
const DIGW = new Map();
function digitW(font) { let w = DIGW.get(font); if (w == null) { w = 0; for (let d = 0; d <= 9; d++) w = Math.max(w, G.measureText(String(d)).width); DIGW.set(font, w); } return w; }
/** natural advance of each character of s (font already set), tracking excluded; tnum puts digits on equal slots */
function advances(s, tn) {
  const out = []; const chars = [...s]; const dw = tn ? digitW(G.font) : 0;
  let prev = 0;
  for (let i = 0; i < chars.length; i++) {
    if (tn && /\d/.test(chars[i])) { out.push(dw); continue; }
    if (tn) { out.push(G.measureText(chars[i]).width); continue; }
    const w = G.measureText(chars.slice(0, i + 1).join('')).width; out.push(w - prev); prev = w;
  }
  return out;
}
/** width of a prepared string in the current font, with tracking and tabular figures */
function measureStr(s, o) {
  const ls = lsPx(o), n = [...s].length;
  if (o.tnum && !isMono(o)) return advances(s, true).reduce((a, b) => a + b, 0) + Math.max(0, n - 1) * ls;
  return G.measureText(s).width + Math.max(0, n - 1) * ls;
}
/** draw a prepared string left-aligned at x (font set) */
function drawStr(s, x, y, o) {
  const ls = lsPx(o);
  if (!ls && !(o.tnum && !isMono(o))) { G.fillText(s, x, y); return; }
  if (!(o.tnum && !isMono(o)) && NATIVE_LS) { G.letterSpacing = ls + 'px'; G.fillText(s, x, y); G.letterSpacing = '0px'; return; }
  const chars = [...s], adv = advances(s, o.tnum && !isMono(o)), dw = o.tnum ? digitW(G.font) : 0;
  let xx = x;
  for (let i = 0; i < chars.length; i++) {
    if (o.tnum && /\d/.test(chars[i])) { G.textAlign = 'center'; G.fillText(chars[i], xx + dw / 2, y); G.textAlign = 'left'; }
    else G.fillText(chars[i], xx, y);
    xx += adv[i] + ls;
  }
}
/** apply the role's case rules to a string */
/** a number and its unit never part at a line break: '60 g' is glued with a no-break space */
const GLUE = /(\d) (?=(?:g|ms|µs|us|ns|mm|µm|khz|kHz|Hz|MHz|h|s|min|%|mAh|mA|Wh|V|W|mW|N|gf|dB|dBm|C|°C|K|cycles|mm²)\b)/g;
function prepare(s, o) { s = String(s); if (o.caps) s = caps(s); else if (o.sentence) s = sentence(s); if (s.indexOf('{') >= 0) s = s.replace(/[{}]/g, ''); return s.replace(GLUE, '$1\u00A0'); }
/** width of a string in the given style */
function tw(s, o = {}) { o = sty(o); setFont(o); return measureStr(prepare(edTxt(s), o), o); }
/** split text into lines that fit maxW */
function wrap(s, o, maxW) {
  o = sty(o); setFont(o);
  const out = []; for (const para of prepare(s, o).split('\n')) {
    const words = para.split(' '); let line = '';
    for (const w of words) { const test = line ? line + ' ' + w : w; if (line && measureStr(test, o) > maxW) { out.push(line); line = w; } else line = test; }
    out.push(line);
  }
  return out;
}
/** typing: how many characters of s are visible at time t when typing starts at t0 */
function typed(s, t, t0, cps = 55) {
  if (t0 == null) return s.length;
  return clamp(Math.floor((t - t0) * cps), 0, s.length);
}
/* QA: with ?qa=1 every line of text and every card records its box in stage units (tools/qa.js reads them) */
const QA = { on: false, text: [], boxes: [] };
function qaText(s, x, y, w, size, o) {
  if (!QA.on || !s) return;
  const m = G.getTransform(), k = (typeof APP !== 'undefined' ? APP.scale * APP.dpr : 1) || 1;
  const P = (px, py) => [(m.a * px + m.c * py + m.e) / k, (m.b * px + m.d * py + m.f) / k];
  const asc = o.font === 'mono' ? 0.76 : 0.74, a = P(x, y - size * asc), b = P(x + w, y + size * 0.2);
  const sc = Math.hypot(m.a, m.b) / k;
  QA.text.push({ s: String(s).slice(0, 60), x0: Math.min(a[0], b[0]), y0: Math.min(a[1], b[1]), x1: Math.max(a[0], b[0]), y1: Math.max(a[1], b[1]), px: +(size * sc).toFixed(1), a: G.globalAlpha });
}
/* EDIT (Brock, 2026-11-05: "a tool where i can tap a button then be able to select and directly edit any text on a
   slide"). text(), rich() and para() pass each string, as the slide gave it, through edTxt(): an edit made on this slide
   replaces it (edits live in the artifact's db, edits/<doc>, see 20-app.js). While edit mode is on they also record the
   string's box in canvas pixels (edBox), so a tap can find it. EDIT.depth > 0 inside rich() and para(), so their words
   and runs aren't taken one by one. */
const EDIT = { on: false, rec: false, slide: null, depth: 0, boxes: [], map: {}, live: {} };
function edTxt(s) {
  if (EDIT.depth || EDIT.slide == null || s == null) return s;
  const k = String(s), lv = EDIT.live[EDIT.slide + '\u0001' + k];
  if (lv != null) return lv;
  const m = EDIT.map[EDIT.slide];
  return m && m.has(k) ? m.get(k) : s;
}
function edBox(raw, x0, y0, x1, y1) {
  if (!EDIT.rec || EDIT.depth || raw == null || String(raw).trim() === '' || G.globalAlpha < 0.05) return;
  const m = G.getTransform(), P = (px, py) => [m.a * px + m.c * py + m.e, m.b * px + m.d * py + m.f];
  const q = [P(x0, y0), P(x1, y0), P(x0, y1), P(x1, y1)], xs = q.map(v => v[0]), ys = q.map(v => v[1]);
  EDIT.boxes.push({ k: String(raw), x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) });
}
/**
 * text: o = { role (a key of T), size, weight, font ('sans' | 'disp' | 'mono'), color, alpha, align, base,
 *             track (em) or ls (px), caps, sentence, tnum, maxW, lh, t, t0 (typing start), cps, caret,
 *             wipe (0..1 left-to-right reveal), rise: [t0, dur] (each line rises out of a mask) }
 * returns { w, h, lines }. Lines are laid out by the system (left edge computed once), so typed text never shifts.
 */
function text(s, x, y, o = {}) {
  const raw = s; s = edTxt(s);
  o = sty(o);
  /* labels are short: a label longer than 48 characters is set as small sentence text instead (caps are for names, not sentences) */
  if (o.role === 'label' && !o.forceCaps && String(s).length > 48) o = Object.assign({}, o, { role: 'small', font: 'sans', size: Math.max(22, Math.min(25, (o.size || 22) + 1)), weight: 600, caps: false, sentence: true, track: 0, ls: undefined });
  /* old big numbers (size 36 and up, bold, no role): set in the display face with tabular figures */
  else if (!o.role && !o.font && (o.size || 28) >= 36 && (o.weight || 400) >= 700) o = Object.assign({}, o, { font: 'disp', tnum: true, track: -0.01 });
  setFont(o);
  G.textBaseline = o.base || 'alphabetic'; G.textAlign = 'left';
  const size = o.size || 28, str = prepare(s, o);
  const lines = o.maxW ? wrap(str, Object.assign({}, o, { caps: false, sentence: false }), o.maxW) : str.split('\n');
  setFont(o);
  const lh = (o.lh || 1.22) * size;
  const total = lines.reduce((n, l) => n + l.length, 0);
  const shown = o.t0 != null ? typed(str, o.t, o.t0, o.cps || 55) : Infinity;
  const a = o.alpha == null ? 1 : o.alpha;
  if (a <= 0.001) return { w: 0, h: lines.length * lh, lines };
  G.globalAlpha = a; G.fillStyle = o.color || C.ink;
  let maxw = 0, k = 0, bx0 = Infinity, bx1 = -Infinity;
  for (let i = 0; i < lines.length; i++) {
    const L = lines[i], n = clamp(shown - k, 0, L.length); k += L.length + 1;
    const vis = L.slice(0, n), ly = y + i * lh;
    const fullW = measureStr(L, o); maxw = Math.max(maxw, fullW);
    const x0 = o.align === 'center' ? x - fullW / 2 : o.align === 'right' ? x - fullW : x;
    if (EDIT.rec) { bx0 = Math.min(bx0, x0); bx1 = Math.max(bx1, x0 + fullW); }
    /* a gradient across the line (Apple's big numbers): o.grad = [colours], left to right with a slight fall */
    if (o.grad) { const gr = G.createLinearGradient(x0, ly - size * 0.8, x0 + Math.max(1, fullW), ly + size * 0.15); o.grad.forEach((c, j) => gr.addColorStop(o.grad.length > 1 ? j / (o.grad.length - 1) : 0, c)); G.fillStyle = gr; }
    if (o.glow && n) { G.save(); G.shadowColor = o.glow; G.shadowBlur = o.glowR || size * 0.45; drawStr(vis, x0, ly, o); G.restore(); }
    if (o.rise) {
      const [r0, rd] = Array.isArray(o.rise) ? o.rise : [o.t0 || 0, 0.8], kk = E.rise(prog(o.t, r0 + i * 0.09, r0 + i * 0.09 + (rd || 0.8)));
      if (kk <= 0) continue;
      G.save(); G.beginPath(); G.rect(x0 - size * 0.2, ly - size * 1.02, fullW + size * 0.4, size * 1.3); G.clip();
      G.globalAlpha = a * clamp(kk * 1.6); drawStr(L, x0, ly + (1 - kk) * size * 1.05, o); G.restore(); G.globalAlpha = a;
    } else if (o.wipe != null && o.wipe < 1) {
      if (o.wipe <= 0) continue;
      G.save(); G.beginPath(); G.rect(x0 - 4, ly - size * 1.2, (fullW + 8) * o.wipe, size * 1.7); G.clip();
      drawStr(vis, x0, ly, o); G.restore();
    } else drawStr(vis, x0, ly, o);
    if (QA.on && n) qaText(vis, x0, ly, measureStr(vis, o), size, o);
    if (o.caret && o.t0 != null && n < L.length && n > 0 && shown < total) {
      const cw = measureStr(vis, o);
      G.fillRect(x0 + cw + 3, ly - size * 0.74, Math.max(2, size * 0.09), size * 0.86);
    }
  }
  if (EDIT.rec && bx1 > bx0) { G.globalAlpha = a; edBox(raw, bx0, y - size * 0.82, bx1, y + (lines.length - 1) * lh + size * 0.26); }
  G.globalAlpha = 1; G.shadowBlur = 0;
  return { w: maxw, h: lines.length * lh, lines };
}
/**
 * rich: runs of different size, weight, colour, case or font on one baseline (the Theseus type signature: a huge
 * "29" next to a small "g" and a yellow mono "TARGET").
 * runs: [{ s, role, size, weight, font, color, caps, track, alpha, gap (px before this run), dy, valign ('base' | 'cap' | 'mid'),
 *          count: [t0, dur, from] (count the number up), t0 + cps (type it), rise: [t0, dur], chip: colour (a marker behind it) }]
 * o: { align, t, alpha }. Returns { w, x0, xs: [left of each run], ws }.
 */
function rich(runs, x, y, o = {}) {
  const R = runs.filter(Boolean).map(r => sty(r));
  const ws = [], strs = [];
  let capMax = 0;
  for (const r of R) {
    let s = prepare(edTxt(r.s), r);
    if (r.count) { const [c0, cd, from] = r.count; const cu = countUp(s, ep(o.t == null ? 99 : o.t, c0, c0 + (cd || 0.9), E.out3), from || 0); if (cu != null) s = cu; }
    strs.push(s); setFont(r); ws.push(measureStr(s, r)); capMax = Math.max(capMax, (r.size || 28) * (r.font === 'mono' ? 0.73 : 0.727));
  }
  const gaps = R.map((r, i) => i ? (r.gap != null ? r.gap : (R[i - 1].size || 28) * 0.18) : 0);
  const total = ws.reduce((a, b) => a + b, 0) + gaps.reduce((a, b) => a + b, 0);
  let xx = o.align === 'center' ? x - total / 2 : o.align === 'right' ? x - total : x;
  const x0 = xx, xs = [];
  R.forEach((r, i) => {
    xx += gaps[i]; xs.push(xx);
    const cap = (r.size || 28) * (r.font === 'mono' ? 0.73 : 0.727);
    const dy = (r.dy || 0) + (r.valign === 'cap' ? -(capMax - cap) : r.valign === 'mid' ? -(capMax - cap) / 2 : 0);
    const a = (o.alpha == null ? 1 : o.alpha) * (r.alpha == null ? 1 : r.alpha);
    const heroChip = r.chip && (r.chip === C.heroChip || r.chip === HERO || r.chip === HERO_P || r.chip === C.hero);
    if (r.chip && !heroChip && a > 0.003) { const pz = (r.size || 28) * 0.32; G.save(); G.globalAlpha = a * 0.9; G.fillStyle = rgba(r.chip, 0.18); rrPath(xx - pz, y + dy - cap - pz * 0.9, ws[i] + pz * 2, cap + pz * 1.8, (cap + pz * 1.8) * 0.3); G.fill(); G.restore(); }
    const extra = heroChip ? { color: C.heroText, grad: C.heroGrad, weight: Math.max(700, r.weight || 700) } : r.chip ? { color: r.chip } : {};
    if (EDIT.rec && a > 0.05) { G.globalAlpha = a; edBox(r.s, xx, y + dy - cap * 1.12, xx + ws[i], y + dy + cap * 0.3); G.globalAlpha = 1; }
    EDIT.depth++;
    try { text(strs[i], xx, y + dy, Object.assign({}, r, extra, { role: undefined, caps: false, sentence: false, alpha: a, t: o.t, rise: r.rise })); } finally { EDIT.depth--; }
    xx += ws[i];
  });
  return { w: total, x0, xs, ws };
}
function line(x1, y1, x2, y2, o = {}) {
  const p = o.p == null ? 1 : o.p; if (p <= 0) return;
  G.globalAlpha = o.alpha == null ? 1 : o.alpha; G.strokeStyle = o.color || C.ink; G.lineWidth = o.w || 2;
  G.lineCap = o.cap || 'butt'; G.setLineDash(o.dash || []);
  G.beginPath(); G.moveTo(x1, y1); G.lineTo(lerp(x1, x2, p), lerp(y1, y2, p)); G.stroke();
  G.setLineDash([]); G.globalAlpha = 1;
}
function poly(pts, o = {}) {
  if (pts.length < 2) return;
  const p = o.p == null ? 1 : o.p; if (p <= 0) return;
  G.globalAlpha = o.alpha == null ? 1 : o.alpha;
  G.beginPath();
  let total = 0; const seg = [];
  for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); total += d; }
  let left = total * p; G.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) {
    if (left >= seg[i - 1]) { G.lineTo(pts[i][0], pts[i][1]); left -= seg[i - 1]; }
    else { const k = left / seg[i - 1]; G.lineTo(lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k)); break; }
  }
  if (o.close && p >= 1) G.closePath();
  if (o.fill) { G.fillStyle = o.fill; G.fill(); }
  if (o.color !== null) { G.strokeStyle = o.color || C.ink; G.lineWidth = o.w || 2; G.lineJoin = 'round'; G.lineCap = o.cap || 'round'; G.setLineDash(o.dash || []); G.stroke(); G.setLineDash([]); }
  G.globalAlpha = 1;
}
function rect(x, y, w, h, o = {}) {
  G.globalAlpha = o.alpha == null ? 1 : o.alpha;
  if (o.fill) { G.fillStyle = o.fill; G.fillRect(x, y, w, h); }
  if (o.color) { G.strokeStyle = o.color; G.lineWidth = o.w || 1.5; G.strokeRect(x, y, w, h); }
  G.globalAlpha = 1;
}
function circle(x, y, r, o = {}) {
  G.globalAlpha = o.alpha == null ? 1 : o.alpha;
  G.beginPath(); G.arc(x, y, Math.max(0, r), o.a0 || 0, o.a1 == null ? Math.PI * 2 : o.a1);
  if (o.fill) { G.fillStyle = o.fill; G.fill(); }
  if (o.color) { G.strokeStyle = o.color; G.lineWidth = o.w || 2; G.setLineDash(o.dash || []); G.stroke(); G.setLineDash([]); }
  G.globalAlpha = 1;
}
/** an arrow from (x1,y1) to (x2,y2), drawn to progress p, head size hs */
function arrow(x1, y1, x2, y2, o = {}) {
  const p = o.p == null ? 1 : o.p; if (p <= 0.001) return;
  const x = lerp(x1, x2, p), y = lerp(y1, y2, p), a = Math.atan2(y - y1, x - x1), hs = o.hs || 16, w = o.w || 3;
  const len = Math.hypot(x - x1, y - y1);
  const back = Math.min(hs, len);
  line(x1, y1, x - Math.cos(a) * back * 0.6, y - Math.sin(a) * back * 0.6, { color: o.color, w, alpha: o.alpha });
  G.globalAlpha = o.alpha == null ? 1 : o.alpha; G.fillStyle = o.color || C.ink;
  G.beginPath(); G.moveTo(x, y);
  G.lineTo(x - Math.cos(a - 0.42) * back, y - Math.sin(a - 0.42) * back);
  G.lineTo(x - Math.cos(a + 0.42) * back, y - Math.sin(a + 0.42) * back); G.closePath(); G.fill(); G.globalAlpha = 1;
}
/** clip all drawing in fn to a rectangle */
function clipped(x, y, w, h, fn) { G.save(); G.beginPath(); G.rect(x, y, w, h); G.clip(); fn(); G.restore(); }

/* ---------- the film's paper: a still 40 px grid, a + on every fourth crossing ---------- */
function paper(a = 1) {
  if (a <= 0.003) return;
  G.save(); G.globalAlpha = a; G.lineWidth = 1;
  G.strokeStyle = inkA(TH ? 0.042 : 0.03); G.beginPath();
  for (let x = 0; x <= W + 40; x += 40) { G.moveTo(x + 0.5, 0); G.lineTo(x + 0.5, H); }
  for (let y = 0; y <= H + 40; y += 40) { G.moveTo(0, y + 0.5); G.lineTo(W, y + 0.5); }
  G.stroke();
  G.strokeStyle = inkA(TH ? 0.26 : 0.2); G.lineWidth = 1.5; G.beginPath();
  for (let x = 0; x <= W + 160; x += 160) for (let y = 0; y <= H + 160; y += 160) { G.moveTo(x - 7, y); G.lineTo(x + 7, y); G.moveTo(x, y - 7); G.lineTo(x, y + 7); }
  G.stroke(); G.restore();
}
/** rounded rectangle path */
function rrPath(x, y, w, h, r) { r = Math.max(0, Math.min(r, w / 2, h / 2)); G.beginPath(); G.moveTo(x + r, y); G.arcTo(x + w, y, x + w, y + h, r); G.arcTo(x + w, y + h, x, y + h, r); G.arcTo(x, y + h, x, y, r); G.arcTo(x, y, x + w, y, r); G.closePath(); }
function rr(x, y, w, h, r, fill, stroke, lw = 1.5, a = 1) { G.save(); G.globalAlpha = a; rrPath(x, y, w, h, r); if (fill) { G.fillStyle = fill; G.fill(); } if (stroke) { G.strokeStyle = stroke; G.lineWidth = lw; G.stroke(); } G.restore(); }
/** a card: a tile, as in Apple's keynotes. A big radius, a flat surface one step off the ground, no hard edge (a whisper
   of one on paper), and an entrance that settles. Flat on purpose: in this deck gradients live in type.
   o = { r (28), fill, plain (no entrance), grid (a faint 40 px grid inside), hero (a thin blue rim: Theseus) } */
const TILE = { r: 6 };   /* Brock: tiles much less rounded, so the deck keeps its own language */
function tileFill(x, y, w, h, o = {}) { return o.fill || C.panel; }   /* flat, as Apple's are: gradients belong to type */
function demoWindow(x, y, w, h, a = 1, o = {}) {
  if (a <= 0.003) return;
  const r = o.r == null ? Math.min(TILE.r, w / 6, h / 6) : Math.min(o.r, TILE.r * 2), p = E.out3(clamp(a));
  if (QA.on) QA.boxes.push({ x0: x, y0: y, x1: x + w, y1: y + h });
  G.save(); G.globalAlpha = clamp(a * 1.4);
  /* on the way in the tile settles from a hair larger and a little lower */
  if (!o.plain && a < 1) { const sc = 1 + 0.015 * (1 - p), cx = x + w / 2, cy = y + h / 2; G.translate(cx, cy + (1 - p) * 14); G.scale(sc, sc); G.translate(-cx, -cy); }
  rrPath(x, y, w, h, r); G.fillStyle = tileFill(x, y, w, h, o); G.fill();
  G.save(); rrPath(x, y, w, h, r); G.clip();
  if (o.grid) {
    G.strokeStyle = inkA(TH ? 0.03 : 0.025); G.lineWidth = 1; G.beginPath();
    for (let gx = Math.ceil(x / 40) * 40; gx < x + w; gx += 40) { G.moveTo(gx + 0.5, y); G.lineTo(gx + 0.5, y + h); }
    for (let gy = Math.ceil(y / 40) * 40; gy < y + h; gy += 40) { G.moveTo(x, gy + 0.5); G.lineTo(x + w, gy + 0.5); }
    G.stroke();
  }
  G.restore();
  if (TH) { G.strokeStyle = 'rgba(17,17,17,0.05)'; G.lineWidth = 1; rrPath(x + 0.5, y + 0.5, w - 1, h - 1, r); G.stroke(); }
  /* Theseus's tile has no outline of its own (an outline in the type's colour looked bad): its numbers say it */
  G.restore();
}
/** the stage's own light: none. Brock: gradients belong in the type, and very sparingly anywhere else, so the ground
   stays flat (the app still calls this, so a slide could light one moment if it ever earns it) */
function stageLight(t, key) { }
/** a soft glow of light in Theseus's colours (or o.cols) behind a part, as Apple lights a chip. RARE: Brock wants
   gradients in the type and very sparingly anywhere else; save this for one or two hero moments in the whole deck.
   o = { a, cols, spin (rad/s) } */
function glowField(t, x, y, r, o = {}) {
  const a = o.a == null ? 1 : o.a; if (a <= 0.003) return;
  const cols = o.cols || C.heroGrad, n = cols.length, sp = o.spin == null ? 0.25 : o.spin;
  G.save(); G.globalCompositeOperation = TH ? 'multiply' : 'lighter';
  cols.forEach((c, i) => {
    const ang = (t || 0) * sp + i * TAU / n, px = x + Math.cos(ang) * r * 0.28, py = y + Math.sin(ang) * r * 0.2;
    const g = G.createRadialGradient(px, py, 0, px, py, r);
    g.addColorStop(0, rgba(c, (TH ? 0.16 : 0.22) * a)); g.addColorStop(0.55, rgba(c, (TH ? 0.06 : 0.08) * a)); g.addColorStop(1, rgba(c, 0));
    G.fillStyle = g; G.fillRect(px - r, py - r, r * 2, r * 2);
  });
  G.restore();
}
