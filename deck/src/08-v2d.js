/* ============================================================================================
   2D MODE
   Every 3D shot has a flat twin: the same parts drawn as an orthographic elevation (top, bottom, side, front or back,
   whichever is nearest the shot's camera), filled flat and outlined, from outlines traced off the 3D assets themselves
   (GEO2D, built by tools/geo2d from the same scenes view3D renders), so nothing is redrawn by hand or guessed.

   The film is 2D (Brock, 2026-11-06, F38.8: "mostly drop the 3d version, but don't delete its assets"): it always draws
   the flat twins, has no 2D / 3D control, and no URL turns 3D on in it. The twins stay derived from the 3D assets, which
   stay in the repo for development. 3D is drawn only on a development page that embeds the bundle and says so
   (tools/build.py three, or main --with3d: both set window.R3D_DEV); there the URL picks the view (?2d=1 forces 2D,
   ?2d=0 3D, also ?3d=, ?mode=, ?view=, #2d, #3d), 3D by default, and 2D stays the fallback when WebGL is missing or a
   scene fails to build. In 2D no WebGL context is created and no 3D asset is fetched.

     view2D(key, t, x, y, w, h, state, o)   draws the flat twin into the box (same state keys and camera keys as view3D)
     v2dProj(key, state, box)               where a point [X, Y, Z] (mm) lands on that drawing, for callouts
   ============================================================================================ */
const V2D = { on: true, forced: null, why: '', scenes: new Map(), pats: {} };
(function () {
  const dev = typeof R3D !== 'undefined' && typeof window !== 'undefined' && window.R3D_DEV === true;
  if (!dev) { V2D.on = true; V2D.can3D = false; V2D.why = typeof R3D === 'undefined' ? 'no 3D bundle' : 'the film is 2D (only a page with R3D_DEV draws 3D)'; return; }
  let on = null;
  try {
    const q = new URLSearchParams(location.search);
    for (const k of ['2d', 'mode', 'view']) if (q.has(k)) { const v = (q.get(k) || '').toLowerCase(); on = k === '2d' ? !(v === '0' || v === 'false' || v === 'off') : v === '2d'; V2D.forced = on; }
    if (q.has('3d')) { const v = (q.get('3d') || '').toLowerCase(); on = v === '0' || v === 'false' || v === 'off'; V2D.forced = on; }
    const hm = /^#(2d|3d)$/i.exec(location.hash || '');
    if (hm) { on = hm[1].toLowerCase() === '2d'; V2D.forced = on; V2D.fromHash = true; }
  } catch (e) { }
  V2D.on = !!on;
  /* no WebGL: 2D whatever the URL says */
  let gl = false;
  try { const c = document.createElement('canvas'); gl = !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { gl = false; }
  if (!gl) { V2D.on = true; V2D.why = 'no WebGL'; }
  V2D.can3D = gl;
})();
/** switch a development page between 2D and 3D (the console's; the film is always 2D) */
function setView2D(on) {
  if (!V2D.can3D) on = true;
  V2D.on = !!on;
  if (on && typeof R3D !== 'undefined' && R3D.gc) { try { R3D.gc(-1); } catch (e) { } }
  if (!on && typeof curSlide === 'function') { try { prepare3D(curSlide()); } catch (e) { } }
}

/* ---------- the scenes: outlines decoded once into Path2D, per mesh and per axis ---------- */
const V2D_AX = { 0: [2, 1], 1: [0, 2], 2: [0, 1] };            /* projected along X: (Z, Y); along Y: (X, Z); along Z: (X, Y) */
function v2dScene(key) {
  if (V2D.scenes.has(key)) return V2D.scenes.get(key);
  const D = typeof GEO2D !== 'undefined' && GEO2D[key];
  if (!D) { V2D.scenes.set(key, null); return null; }
  const q = 1 / D.q, meshes = [];
  for (const m of D.meshes) {
    const paths = {};
    for (const a of ['0', '1', '2']) {
      const rings = m.rings[a]; if (!rings || !rings.length) continue;
      const p = new Path2D();
      for (const r of rings) {
        let u = 0, v = 0; const d = r.d;
        for (let i = 0; i < d.length; i += 2) { u += d[i]; v += d[i + 1]; if (i) p.lineTo(u * q, v * q); else p.moveTo(u * q, v * q); }
        p.closePath();
      }
      paths[a] = p;
      /* the area centroid of the biggest outer ring: a point that is on the part in this view, for callouts */
      let best = null, bestA = 0;
      for (const r of rings) {
        if (r.h) continue;
        let u = 0, v = 0, A2 = 0, cx = 0, cy = 0; const pts = [];
        for (let i = 0; i < r.d.length; i += 2) { u += r.d[i]; v += r.d[i + 1]; pts.push([u * q, v * q]); }
        for (let i = 0; i < pts.length; i++) { const [x0, y0] = pts[i], [x1, y1] = pts[(i + 1) % pts.length], cr = x0 * y1 - x1 * y0; A2 += cr; cx += (x0 + x1) * cr; cy += (y0 + y1) * cr; }
        if (Math.abs(A2) > bestA) { bestA = Math.abs(A2); best = [cx / (3 * A2), cy / (3 * A2)]; }
      }
      if (best) (m.cent = m.cent || {})[a] = best;
    }
    /* feature lines (sharp edges, hidden lines already removed), one set per side of each axis: '+1' is seen from above */
    let lpaths = null;
    if (m.lines) {
      lpaths = {};
      for (const [k, ls] of Object.entries(m.lines)) {
        const p = new Path2D();
        for (const l of ls) { let u = 0, v = 0; const d = l.d; for (let i = 0; i < d.length; i += 2) { u += d[i]; v += d[i + 1]; if (i) p.lineTo(u * q, v * q); else p.moveTo(u * q, v * q); } }
        lpaths[k] = p;
      }
    }
    const c = [0, 1, 2].map(i => m.depth[i] ? m.depth[i][2] : 0);
    meshes.push(Object.assign({}, m, { paths, lpaths, c, rings: undefined, lines: undefined }));
  }
  const S = { key, D, meshes, byId: new Map(meshes.map(m => [m.id, m])), r: (V2D_R[key] || D.frame.r), center: D.frame.center };
  V2D.scenes.set(key, S);
  return S;
}
/* the framing radius each slide's own maths already assumes (10-c-glide GLD.R for the shell); the rest are measured at rest */
const V2D_R = { shell: 71.8, 'shell-sora': 71.8 };
/* the per-scene camera defaults of 3d/integration/entry.js */
const V2D_BASE = { shell: { view: 'threeQuarter' }, 'shell-sora': { view: 'threeQuarter' }, pcb: { view: 'threeQuarter' }, gt01: { view: 'threeQuarter', margin: 1.25 },
  wheel: { view: 'threeQuarter', margin: 1.25 }, claw: { view: 'threeQuarter', margin: 1.3 }, screw: { view: 'front', margin: 1.3 }, skates: { view: 'top' },
  battery: { view: 'threeQuarter', margin: 1.2 }, lattice: { view: 'threeQuarter' } };
const V2D_VIEWS = { top: [0, 1, 0.0001], bottom: [0, -1, 0.0001], front: [0, 0.12, 1], back: [0, 0.12, -1], left: [-1, 0.08, 0], right: [1, 0.08, 0],
  threeQuarter: [-0.78, 0.62, 0.95], threeQuarterRight: [0.78, 0.62, 0.95], low: [-0.9, 0.22, 0.75] };

/* ---------- small vector maths ---------- */
const v3 = {
  n: a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; },
  x: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]],
  d: (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
  rot: (v, k, ang) => { const c = Math.cos(ang), s = Math.sin(ang), kv = v3.x(k, v), kd = v3.d(k, v); return [0, 1, 2].map(i => v[i] * c + kv[i] * s + k[i] * kd * (1 - c)); }
};

/** the 3D camera of a shot (3d/integration/entry.js cameraFor), and the flat view that stands in for it:
   the world axis nearest the camera direction, the in-plane axes nearest the camera's right and up, and the scale
   the 3D shot has at its target (so the drawing is the size the render was). */
function v2dFrame(key) {
  if (key === 'lattice') { const L = typeof GEO2D !== 'undefined' && GEO2D.lattice; return { r: L ? L.r : 69.83, center: L ? L.center : [0, 19.075, -0.04] }; }
  const S = v2dScene(key); return S ? { r: S.r, center: S.center } : { r: 50, center: [0, 0, 0] };
}
function v2dCam(key, st, box) {
  const F = v2dFrame(key), base = V2D_BASE[key] || {}, R = F.r;
  const view = st.view || base.view || 'threeQuarter';
  let d = v3.n(Array.isArray(view) ? view : (V2D_VIEWS[view] || V2D_VIEWS.threeQuarter));
  if (st.yaw) d = v3.rot(d, [0, 1, 0], st.yaw);
  if (st.pitch) { const r0 = v3.x(d, [0, 1, 0]); if (Math.hypot(...r0) > 1e-6) d = v3.rot(d, v3.n(r0), st.pitch); }
  const up = Math.abs(d[1]) > 0.99 ? [0, 0, -Math.sign(d[1])] : [0, 1, 0];
  const r = v3.n(v3.x(up, d)), u = v3.x(d, r);
  /* the flat view: the world axis nearest the camera, or st.view2d ('top', 'bottom', 'left', 'right', 'front', 'back')
     when a slide wants another; the drawing keeps the camera's right and up as nearly as the axes allow */
  let a, sg;
  const named = { top: [1, 1], bottom: [1, -1], right: [0, 1], left: [0, -1], front: [2, 1], back: [2, -1] }[st.view2d];
  if (named) [a, sg] = named;
  else { a = [0, 1, 2].reduce((b, i) => Math.abs(d[i]) > Math.abs(d[b]) ? i : b, 0); sg = Math.sign(d[a]) || 1; }
  const others = [0, 1, 2].filter(i => i !== a);
  const j = Math.abs(r[others[0]]) >= Math.abs(r[others[1]]) ? others[0] : others[1], k = others[0] === j ? others[1] : others[0];
  const sj = Math.sign(r[j]) || 1, sk = Math.sign(u[k]) || 1;
  const fov = (st.fov || base.fov || 22) * Math.PI / 180, margin = base.margin || 1.12, zoom = st.zoom || 1;
  const [bx, by, bw, bh] = box, asp = bw / bh;
  const s = (st.scale2d || 1) * bh * zoom * Math.min(1, asp) * Math.cos(fov / 2) / (2 * R * margin);
  const T = st.target ? st.target.slice() : F.center.slice(); if (st.lift) T[1] += st.lift;
  const cx = bx + bw / 2, cy = by + bh / 2;
  const P = p => [cx + s * sj * (p[j] - T[j]), cy - s * sk * (p[k] - T[k])];
  return { a, sg, j, k, sj, sk, s, T, cx, cy, P, d, box };
}
/** where [X, Y, Z] mm lands on the flat drawing of this shot */
function v2dProj(key, st, box) { return v2dCam(key, st || {}, box).P; }

/* ---------- motion: each state key moves meshes by a sampled world-space transform ---------- */
const V2D_KEYS = ['explode', 'press', 'pressL', 'pressR', 'clickL', 'clickR', 'side0', 'side1', 'insert', 'drive'];
function v2dLerpMotion(tab, v) {
  /* tab: { '0.25': [12], '1': [12] }; identity at 0; piecewise linear between samples */
  const ks = Object.keys(tab).map(Number).sort((p, q) => p - q);
  if (!ks.length || v <= 0) return null;
  let k0 = 0, m0 = null;
  for (const k of ks) {
    const m1 = tab[String(k)] || tab[k];
    if (v <= k || k === ks[ks.length - 1]) {
      const f = k === k0 ? 1 : clamp((v - k0) / (k - k0));
      const A = m0 || [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0];
      return A.map((x, i) => x + (m1[i] - x) * f);
    }
    k0 = k; m0 = m1;
  }
  return null;
}
const mul34 = (A, B) => { /* (A ∘ B), each 3x4 row-major */
  const o = new Array(12);
  for (let r = 0; r < 3; r++) { for (let c = 0; c < 3; c++) o[r * 4 + c] = A[r * 4] * B[c] + A[r * 4 + 1] * B[4 + c] + A[r * 4 + 2] * B[8 + c]; o[r * 4 + 3] = A[r * 4] * B[3] + A[r * 4 + 1] * B[7] + A[r * 4 + 2] * B[11] + A[r * 4 + 3]; }
  return o;
};
function v2dRotM(rt, ang) { /* rotation by ang about rt.axis through rt.pivot, as 3x4 */
  const k = rt.axis, c = Math.cos(ang), s = Math.sin(ang), t = 1 - c, [x, y, z] = k;
  const Rm = [t * x * x + c, t * x * y - s * z, t * x * z + s * y, t * x * y + s * z, t * y * y + c, t * y * z - s * x, t * x * z - s * y, t * y * z + s * x, t * z * z + c];
  const p = rt.pivot, tx = p[0] - (Rm[0] * p[0] + Rm[1] * p[1] + Rm[2] * p[2]), ty = p[1] - (Rm[3] * p[0] + Rm[4] * p[1] + Rm[5] * p[2]), tz = p[2] - (Rm[6] * p[0] + Rm[7] * p[1] + Rm[8] * p[2]);
  return [Rm[0], Rm[1], Rm[2], tx, Rm[3], Rm[4], Rm[5], ty, Rm[6], Rm[7], Rm[8], tz];
}
function v2dPose(S, m, st) {
  let M = null;
  const D = S.D;
  for (const key of V2D_KEYS) {
    const v = st[key]; if (!v) continue;
    const tab = D.motion[key] && D.motion[key][m.id]; if (!tab) continue;
    const Mk = v2dLerpMotion(tab, v); if (Mk) M = M ? mul34(Mk, M) : Mk;
  }
  if (st.scroll && D.rot && D.rot[m.id]) { const Mr = v2dRotM(D.rot[m.id], st.scroll * D.rot[m.id].rate); M = M ? mul34(M, Mr) : Mr; }
  return M;
}
/** visibility and opacity of a mesh in this state: the nearest sampled value of each key that changes them */
function v2dVis(S, m, st) {
  let vis = m.vis, op = m.look.opacity == null ? 1 : m.look.opacity;
  for (const key of Object.keys(S.D.vis || {})) {
    const tab = S.D.vis[key][m.id]; if (!tab) continue;
    const v = st[key] === true ? 1 : +st[key] || 0;
    for (const [k, on] of Object.entries(tab)) if (v >= +k * 0.5) vis = on;
  }
  for (const key of Object.keys(S.D.look || {})) {
    const tab = S.D.look[key][m.id]; if (!tab) continue;
    const v = st[key] === true ? 1 : +st[key] || 0;
    const k = Object.keys(tab).map(Number)[0];
    if (v > 0 && k) op = lerp(op, tab[String(k)][0], clamp(v / k));
  }
  return { vis, op };
}

/* ---------- drawing order: what covers what, per scene and per side ----------
   rank first (higher is drawn later, so in front), then depth toward the camera. The shell's parts nest (the wheel and
   the board inside the body, the triggers on top of it), which depth alone can't sort. */
function v2dGroup(key, m) {
  const p = m.path || '';
  if (key === 'shell' || key === 'shell-sora') {
    if (/^explode[LR]\//.test(p)) return /engrave/.test(p) ? 'engr' : 'trig';
    if (/^side(Front|Rear)/.test(p)) return 'side';
    if (/^body\/body/.test(p)) return 'body';
    if (/^body\/usbC/.test(p)) return 'usb';
    if (/^body\/sideMark/.test(p)) return 'mark';
    if (/^plate\//.test(p)) return 'plate';
    if (/DotSkate/.test(p)) return 'skate';
    if (/M2Screw/.test(p)) return 'screw';
    if (/^body\/lens/.test(p)) return 'lens';
    return 'inner';                                         /* wheel, wheel bay, core */
  }
  if (key === 'gt01') return /cover/.test(p) ? 'cover' : /^base\//.test(p) ? 'base' : /^pin/.test(p) ? 'pin' : 'inner';
  if (key === 'claw') return /^shell/.test(p) ? 'sleeve' : /^pcb\/(fr4|mask)/.test(p) ? 'board' : /^pcb\//.test(p) ? 'solder' : /^pin/.test(p) ? 'pin' : 'inner';
  if (key === 'screw') return /head/.test(p) ? 'head' : /^screw/.test(p) ? 'thread' : /^insert/.test(p) ? 'insert' : /^plate/.test(p) ? 'plate' : 'boss';
  return 'part';
}
function v2dRank(key, g, a, sg) {
  if (key === 'shell' || key === 'shell-sora') {
    if (a === 1 && sg > 0) return { plate: 0, skate: 0, screw: 0, lens: 0, usb: 0, inner: 1, body: 2, mark: 2, side: 3, trig: 4, engr: 5 }[g];          /* from above */
    if (a === 1) return { trig: 0, engr: 0, side: 0, body: 1, mark: 1, inner: 2, usb: 2, plate: 3, screw: 4, lens: 4, skate: 5 }[g];                 /* from below */
    if (a === 0) return { inner: 0, plate: 0, screw: 0, lens: 0, usb: 0, body: 1, skate: 2, trig: 2, mark: sg > 0 ? 2 : 0, side: sg > 0 ? 3 : 0, engr: 3 }[g]; /* from a side: +X is the side-button side */
    return { inner: 0, plate: 0, screw: 0, lens: 0, body: 1, skate: 2, side: 2, mark: 2, trig: 2, engr: 3, usb: sg > 0 ? 3 : 0 }[g];                    /* front or back */
  }
  if (key === 'gt01') return { inner: 0, pin: 0, base: 1, cover: 2 }[g];
  if (key === 'claw') return { inner: 0, pin: 0, sleeve: 1, board: 2, solder: 3 }[g];
  if (key === 'screw') return { insert: 0, thread: 0, boss: 1, plate: 2, head: 3 }[g];
  return 0;
}

/* ---------- looks: a flat tone per material, by ground; outlines in the ink of the ground ---------- */
function v2dColorway(cw) {
  if (V2D.pats[cw + TH] !== undefined) return V2D.pats[cw + TH];
  let p = null;
  if (cw === 'forged') {
    const c = document.createElement('canvas'); c.width = c.height = 160; const g = c.getContext('2d');
    g.fillStyle = '#2a2b2f'; g.fillRect(0, 0, 160, 160);
    const r = rng(7);
    for (let i = 0; i < 70; i++) {
      const x = r() * 160, y = r() * 160, s = 4 + r() * 16, a0 = r() * TAU, n = 5 + Math.floor(r() * 3), l = 60 + Math.floor(r() * 120);
      g.fillStyle = `rgb(${l},${l},${l + 4})`; g.globalAlpha = 0.35 + r() * 0.4; g.beginPath();
      for (let k = 0; k < n; k++) { const ang = a0 + k / n * TAU, rr = s * (0.4 + r() * 0.7); g[k ? 'lineTo' : 'moveTo'](x + Math.cos(ang) * rr, y + Math.sin(ang) * rr * 0.7); }
      g.closePath(); g.fill();
    }
    p = G.createPattern(c, 'repeat');
  }
  V2D.pats[cw + TH] = p;
  return p;
}
function v2dLook(key, m, g, st, op) {
  const lk = m.look || {}, L = lk.lum == null ? 0.5 : lk.lum, metal = lk.metal || 0, col = lk.color || '#808080';
  const ink = TH ? '17,17,17' : '243,242,238';
  const o = { fill: null, stroke: `rgba(${ink},${TH ? 0.62 : 0.5})`, lw: 1.2, dash: null, alpha: 1, solid: true };
  const dark = L < 0.3;
  if (key === 'shell' || key === 'shell-sora') {
    const cw = st.colorway || 'black';
    if (['body', 'trig', 'side', 'inner', 'plate'].includes(g) && dark) {
      o.fill = cw === 'white' ? '#ECEBE6' : cw === 'grey' ? '#8E8F93' : cw === 'forged' ? (v2dColorway('forged') || '#2a2b2f') : (TH ? '#2B2C30' : '#232428');
      if (g === 'inner' || g === 'plate') o.fill = cw === 'white' ? '#DAD9D3' : (TH ? '#3A3B40' : '#18191C');
      o.stroke = cw === 'white' ? 'rgba(17,17,17,0.55)' : (TH ? 'rgba(255,255,255,0.34)' : `rgba(${ink},0.5)`);
      if (g === 'engr') o.fill = TH ? '#45464B' : '#2E3034';
    }
    if (g === 'engr') { o.fill = cw === 'white' ? '#C9C8C2' : (TH ? '#4A4B50' : '#34363A'); o.stroke = null; }
  }
  if (!o.fill) {
    if (lk.transparent && (lk.opacity == null || lk.opacity < 0.05) && !(op > 0.05)) return null;
    if (lk.trans > 0.5 || (lk.transparent && op < 0.95)) {                    /* glass, clear covers, films: tinted, see-through */
      o.fill = rgba(col, TH ? 0.18 : 0.14); o.stroke = rgba(mix(col, TH ? '#111111' : '#ffffff', 0.35), 0.75); o.lw = 1.2; o.solid = false;
    } else if (metal > 0.5) {
      const warm = hexRgb(col); const gold = warm[0] > warm[2] * 1.25;
      o.fill = gold ? (TH ? '#D9B45A' : '#C9A24A') : (TH ? '#B9BEC4' : '#9AA1A9');
      o.stroke = TH ? 'rgba(17,17,17,0.55)' : 'rgba(0,0,0,0.55)';
      o.lineInk = TH ? 'rgba(17,17,17,0.5)' : 'rgba(0,0,0,0.5)';
    } else if (dark) { o.fill = TH ? mix('#2B2C30', col, 0.4) : mix('#232428', col, 0.4); o.stroke = TH ? 'rgba(255,255,255,0.3)' : `rgba(${ink},0.5)`; }
    else { o.fill = mix(col, TH ? '#FFFFFF' : '#000000', 0.08); o.stroke = 'rgba(17,17,17,0.5)'; }
  }
  /* x-ray / cutaway / section: the part that hides the inside becomes a phantom outline */
  if (op < 0.6) { o.fill = rgba(TH ? '#111111' : '#F3F2EE', TH ? 0.04 : 0.05); o.stroke = `rgba(${ink},${TH ? 0.5 : 0.45})`; o.dash = [5, 4]; o.lw = 1.1; o.phantom = true; o.solid = false; }
  return o;
}
/** the parts each state opens up: they draw as phantoms so what's inside shows */
function v2dPhantom(key, g, st) {
  if ((key === 'shell' || key === 'shell-sora') && st.xray > 0.3 && (g === 'body' || g === 'trig' || g === 'side' || g === 'plate' || g === 'engr')) return true;
  if (key === 'claw' && st.section > 0.3 && g === 'sleeve') return true;
  if (key === 'gt01' && st.cutaway > 0.3 && g === 'base') return false;
  if (key === 'screw' && st.section > 0.3 && g === 'boss') return true;
  return false;
}

/** the flat twin of a 3D shot. Returns the projector (mm → stage px) or false when the scene has no outlines.
   A camera between two axes (a turn in progress) gets both flat views, cross-faded by how near it is to each, so a
   camera move becomes a dissolve rather than a jump; a slide can name its view with st.view2d instead. */
const V2D_NAME = { '0,1': 'right', '0,-1': 'left', '1,1': 'top', '1,-1': 'bottom', '2,1': 'front', '2,-1': 'back' };
function view2D(key, t, x, y, w, h, st = {}, o = {}) {
  if (!st.view2d) {
    const cam = v2dCam(key, st, [x, y, w, h]), d = cam.d.map(Math.abs), a = cam.a;
    const b = [0, 1, 2].filter(i => i !== a).reduce((p, i) => d[i] > d[p] ? i : p, a === 0 ? 1 : 0), gap = d[a] - d[b], M = 0.2;
    if (gap < M) {
      const kb = 0.5 * (1 - gap / M), alpha = o.alpha == null ? 1 : o.alpha;
      const one = (ax, k) => view2D(key, t, x, y, w, h, Object.assign({}, st, { view2d: V2D_NAME[ax + ',' + (Math.sign(cam.d[ax]) || 1)] }), Object.assign({}, o, { alpha: alpha * k }));
      one(b, kb);
      return one(a, 1 - kb);
    }
  }
  if (key === 'lattice' && typeof lattice2D === 'function') return lattice2D(t, x, y, w, h, st, o);
  const S = v2dScene(key);
  if (!S) return false;
  const cam = v2dCam(key, st, [x, y, w, h]), a = cam.a, A = String(a), [iu, iv] = V2D_AX[a];
  const alpha = o.alpha == null ? 1 : o.alpha; if (alpha <= 0.003) return cam.P;
  const items = [];
  for (const m of S.meshes) {
    const path = m.paths[A]; if (!path) continue;
    if (st.hide2d && st.hide2d.test(m.path)) continue;
    const vo = v2dVis(S, m, st); if (!vo.vis) continue;
    const g = v2dGroup(key, m);
    let op = vo.op; if (v2dPhantom(key, g, st)) op = Math.min(op, 0.3);
    const look = v2dLook(key, m, g, st, op); if (!look) continue;
    if (st.hi2d && st.hi2d.re.test(m.path)) { look.hi = st.hi2d.color || C.hero; look.hiw = st.hi2d.w || 2.6; if (st.hi2d.fill) look.fill = st.hi2d.fill; }
    const M = v2dPose(S, m, st);
    /* depth toward the camera, at this state */
    const c = m.c, cw = M ? [M[0] * c[0] + M[1] * c[1] + M[2] * c[2] + M[3], M[4] * c[0] + M[5] * c[1] + M[6] * c[2] + M[7], M[8] * c[0] + M[9] * c[1] + M[10] * c[2] + M[11]] : c;
    /* a part that moves straight toward or away from the viewer can't be seen to move in a flat view: it fades instead
       (the skates dropping onto their plate, seen from below) */
    if (M) {
      const dv = [cw[0] - c[0], cw[1] - c[1], cw[2] - c[2]], along = Math.abs(dv[a]), side = Math.hypot(dv[iu], dv[iv]);
      if (along > 3 * side && along > 0.02 * S.r) { const f = 1 - smooth(clamp(along / (0.12 * S.r))); if (f <= 0.01) continue; look.alpha = f; }
    }
    items.push({ m, path, look, M, rank: v2dRank(key, g, a, cam.sg) || 0, z: cw[a] * cam.sg, g });
  }
  items.sort((p, q) => (p.rank - q.rank) || (p.z - q.z));
  /* the affine that takes a mesh's outline (plane mm) to the stage */
  const aff = (m, M) => {
    const R = M ? [[M[0], M[1], M[2]], [M[4], M[5], M[6]], [M[8], M[9], M[10]]] : [[1, 0, 0], [0, 1, 0], [0, 0, 1]], tm = M ? [M[3], M[7], M[11]] : [0, 0, 0];
    const col = i => [R[0][i], R[1][i], R[2][i]], eu = col(iu), ev = col(iv), ea = col(a), dep = m.c[a];
    const sx = cam.s * cam.sj, sy = -cam.s * cam.sk, j = cam.j, k = cam.k;
    return [sx * eu[j], sy * eu[k], sx * ev[j], sy * ev[k],
      cam.cx + sx * (ea[j] * dep + tm[j] - cam.T[j]), cam.cy + sy * (ea[k] * dep + tm[k] - cam.T[k])];
  };
  G.save();
  G.beginPath(); G.rect(x, y, w, h); G.clip();
  G.globalAlpha *= alpha;
  G.lineJoin = 'round'; G.lineCap = 'round';
  /* a ground line under side and front views, where the 3D had its floor and shadow */
  if (a !== 1 && o.ground !== false && st.ground2d !== false) {
    const gy = cam.P([cam.T[0], 0, cam.T[2]])[1];
    /* as long as the drawing is wide (its frame), not across the whole tile */
    const Fr = S.D.frame, hw = 0.5 * Math.max(Fr.size[cam.j] || 0, 1) * cam.s * 1.08, gx = cam.P(Fr.center)[0];
    const gx0 = Math.max(x + w * 0.04, gx - hw), gx1 = Math.min(x + w * 0.96, gx + hw);
    if (gy > y + 8 && gy < y + h - 4 && gx1 > gx0) { G.save(); G.globalAlpha *= 0.9; G.strokeStyle = inkA(TH ? 0.22 : 0.2); G.lineWidth = 1.5; G.beginPath(); G.moveTo(gx0, gy + 0.75); G.lineTo(gx1, gy + 0.75); G.stroke(); G.restore(); }
  }
  /* pass 1: the outer silhouette, heavier (the fills of pass 2 cover it everywhere but its outer edge) */
  const ink = TH ? '#111111' : '#F3F2EE';
  for (const it of items) {
    if (!it.look.solid || it.look.fill == null) continue;
    const T6 = aff(it.m, it.M), sc = Math.hypot(T6[0], T6[1]) || 1;
    G.save(); G.globalAlpha *= it.look.alpha; G.transform(...T6); G.lineWidth = (TH ? 3.6 : 3.4) / sc; G.strokeStyle = rgba(ink, TH ? 0.8 : 0.82); G.stroke(it.path); G.restore();
  }
  /* pass 2: every part, back to front, filled flat and outlined */
  for (const it of items) {
    const T6 = aff(it.m, it.M), sc = Math.hypot(T6[0], T6[1]) || 1, L = it.look;
    G.save(); G.globalAlpha *= L.alpha; G.transform(...T6);
    if (L.fill) { if (typeof CanvasPattern !== 'undefined' && L.fill instanceof CanvasPattern && L.fill.setTransform) L.fill.setTransform(new DOMMatrix().scale(1 / sc)); G.fillStyle = L.fill; G.fill(it.path, 'evenodd'); }
    if (L.stroke) { G.lineWidth = L.lw / sc; G.strokeStyle = L.stroke; if (L.dash) G.setLineDash(L.dash.map(v => v / sc)); G.stroke(it.path); G.setLineDash([]); }
    /* its feature lines, as a draughtsman would add them: thin, in the outline's ink, quieter on phantoms */
    const lp = it.m.lpaths && it.m.lpaths[(cam.sg > 0 ? '+' : '-') + A];
    if (lp && !(L.phantom && o.lines === false)) {
      G.lineWidth = (L.phantom ? 0.8 : 1.0) / sc; G.strokeStyle = L.lineInk || (TH ? `rgba(17,17,17,${L.phantom ? 0.22 : 0.4})` : `rgba(243,242,238,${L.phantom ? 0.2 : 0.36})`);
      G.stroke(lp);
    }
    G.restore();
  }
  /* highlighted parts: their outlines in the slide's colour, on top */
  for (const it of items) if (it.look.hi) {
    const T6 = aff(it.m, it.M), sc = Math.hypot(T6[0], T6[1]) || 1;
    G.save(); G.transform(...T6); G.lineWidth = it.look.hiw / sc; G.strokeStyle = it.look.hi; G.stroke(it.path); G.restore();
  }
  /* the reflow's heat front, a band of orange crossing the board from the nose back (the 3D's heat shader) */
  if (key === 'pcb' && st.reflow > 0 && st.reflow < 1) {
    const zf = 58 - st.reflow * 66 - 2.88, p = cam.P([19.3, 5.03, zf]), q = cam.P([-19.3, 5.03, zf]);
    G.save(); G.lineCap = 'round';
    G.strokeStyle = rgba(C.orange, 0.22); G.lineWidth = 34; G.beginPath(); G.moveTo(p[0], p[1]); G.lineTo(q[0], q[1]); G.stroke();
    G.strokeStyle = rgba(C.orange, 0.9); G.lineWidth = 3; G.stroke(); G.restore();
  }
  /* the board's current, as the 3D shows it: the charge path (yellow) or the run paths (blue), dashes running along them */
  if (key === 'pcb' && st.power > 0.003 && S.D.power) {
    const mode = st.powerMode || 'charge', modes = mode === 'both' ? ['charge', 'run'] : [mode];
    for (const md of modes) {
      const segs = S.D.power[md]; if (!segs) continue;
      const col = md === 'run' ? '#6FDCFF' : YEL, k = clamp(st.power), ph = (st.powerT == null ? t : st.powerT) * 26;
      G.save(); G.globalAlpha *= k; G.lineCap = 'round'; G.lineJoin = 'round';
      for (const seg of segs) {
        const pts = seg.map(cam.P);
        G.beginPath(); pts.forEach((q, i) => i ? G.lineTo(q[0], q[1]) : G.moveTo(q[0], q[1]));
        G.strokeStyle = rgba(col, 0.28); G.lineWidth = 7; G.stroke();
        G.strokeStyle = col; G.lineWidth = 2.4; G.setLineDash([10, 9]); G.lineDashOffset = -ph; G.stroke(); G.setLineDash([]);
      }
      G.restore();
    }
  }
  G.restore();
  if (o.after) o.after(cam);
  return cam.P;
}
/** where a part sits on a flat drawing: the point at fractions f of the bounding box of the first mesh whose path
   matches re, moved with the state. For callouts that the 3D slides placed by hand on the render. */
function v2dAt(key, st, box, re, f = [0.5, 0.5, 0.5]) {
  const S = v2dScene(key); if (!S) return null;
  const m = S.meshes.find(mm => re.test(mm.path)); if (!m || !m.bbox) return null;
  let p = [0, 1, 2].map(i => m.bbox[0][i] + (m.bbox[1][i] - m.bbox[0][i]) * (f === 'c' ? 0.5 : f[i]));
  if (f === 'c') { const cam = v2dCam(key, st, box), a = cam.a, [iu, iv] = V2D_AX[a], ce = m.cent && m.cent[a]; if (ce) { p[iu] = ce[0]; p[iv] = ce[1]; p[a] = m.c[a]; } }
  const M = v2dPose(S, m, st);
  const q = M ? [M[0] * p[0] + M[1] * p[1] + M[2] * p[2] + M[3], M[4] * p[0] + M[5] * p[1] + M[6] * p[2] + M[7], M[8] * p[0] + M[9] * p[1] + M[10] * p[2] + M[11]] : p;
  return v2dCam(key, st, box).P(q);
}
/** a 2D/3D pair for a slide: a in 2D mode, b in 3D */
const in2D = (a, b) => (V2D.on ? a : b);

/* ============================== the lattice study, flat ==============================
   GEO2D.lattice (tools/geo2d/lattice2d.py): from below, both lattices with the ribs banded by stress; cut on the midplane
   and seen from -X, the far half's ribs in the order the 3D grows them and the cut wall in Theseus's colour; and the
   fillet node, looked at along its normal, as a plan with contours of rib height. The cut wall and the tie points are
   Theseus's colour (C.hero, as the 3D's caps and ties); the stress bands the deck's heat scale (heatCol). */
const LAT2D = { paths: new Map() };
function latPath(rings, key) {
  if (key && LAT2D.paths.has(key)) return LAT2D.paths.get(key);
  const L = GEO2D.lattice, q = 1 / L.q, p = new Path2D();
  for (const r of rings || []) { let u = 0, v = 0; const d = r.d; for (let i = 0; i < d.length; i += 2) { u += d[i]; v += d[i + 1]; if (i) p.lineTo(u * q, v * q); else p.moveTo(u * q, v * q); } p.closePath(); }
  if (key) LAT2D.paths.set(key, p);
  return p;
}
function latRamp(k) { if (typeof heatCol === 'function') return heatCol(k); const R = GEO2D.lattice.ramp, s = clamp(k) * 4, i = Math.min(3, Math.floor(s)); return mix(R[i], R[i + 1], s - i); }
/** which flat view a lattice shot becomes: the node plan, from below, or the side (cut or whole) */
function latMode(st, cam) { if ((st.filletZoom || 0) >= 0.5) return 'node'; if (cam.a === 1) return 'bottom'; return 'side'; }
/** the node plan's frame: (p - c)·e1 across, (p - c)·e2 up, fitted to the box */
function latNodeCam(st, box) {
  const N = GEO2D.lattice.node, [x, y, w, h] = box, [u0, v0, u1, v1] = N.box, k = (st.zoom2d || 1.18);
  const s = Math.min(w / (u1 - u0), h / (v1 - v0)) * k, cu = (u0 + u1) / 2 + (st.pan2d ? st.pan2d[0] : 0), cv = (v0 + v1) / 2 + (st.pan2d ? st.pan2d[1] : 0);
  const cx = x + w / 2, cy = y + h / 2;
  const P = p => { const r = [p[0] - N.c[0], p[1] - N.c[1], p[2] - N.c[2]], u = v3.d(r, N.e1), v = v3.d(r, N.e2); return [cx + (u - cu) * s, cy - (v - cv) * s]; };
  return { s, cx, cy, cu, cv, P };
}
function lattice2DProj(st, box) {
  if (typeof GEO2D === 'undefined' || !GEO2D.lattice) return null;
  const cam = v2dCam('lattice', st, box), mode = latMode(st, cam);
  if (mode === 'node' && GEO2D.lattice.node) return latNodeCam(st, box).P;
  if (mode === 'bottom' && st.compare === 'both') return cam.P;
  return cam.P;
}
function lattice2D(t, x, y, w, h, st = {}, o = {}) {
  const L = typeof GEO2D !== 'undefined' && GEO2D.lattice; if (!L) return false;
  const alpha = o.alpha == null ? 1 : o.alpha; if (alpha <= 0.003) return lattice2DProj(st, [x, y, w, h]);
  const cam = v2dCam('lattice', st, [x, y, w, h]), mode = latMode(st, cam);
  const shellF = TH ? '#2B2C30' : '#18191C', inside = TH ? '#3A3B40' : '#202125', ribF = TH ? '#55565C' : '#3B3C42', ribS = TH ? 'rgba(255,255,255,0.28)' : 'rgba(243,242,238,0.32)';
  const edge = TH ? 'rgba(17,17,17,0.8)' : 'rgba(243,242,238,0.6)';
  G.save(); G.beginPath(); G.rect(x, y, w, h); G.clip(); G.globalAlpha *= alpha; G.lineJoin = 'round';
  /* draw rings that live in plane coordinates (u, v) with the plane-to-stage affine */
  const put = (aff, path, fill, stroke, lwPx, rule) => {
    G.save(); G.transform(...aff); const sc = Math.hypot(aff[0], aff[1]) || 1;
    if (fill) { G.fillStyle = fill; G.fill(path, rule || 'evenodd'); }
    if (stroke) { G.strokeStyle = stroke; G.lineWidth = lwPx / sc; G.stroke(path); }
    G.restore();
  };
  let P = cam.P;
  if (mode === 'node' && L.node) {
    const nc = latNodeCam(st, [x, y, w, h]); P = nc.P;
    const aff = [nc.s, 0, 0, -nc.s, nc.cx - nc.cu * nc.s, nc.cy + nc.cv * nc.s];
    const N = L.node, lev = Object.keys(N.lev).map(Number).sort((a, b) => a - b);
    /* dark whatever the ground, as the 3D close-up was, so the slide's light callouts read on it */
    G.fillStyle = '#141517'; G.fillRect(x, y, w, h);
    put(aff, latPath(N.have, 'node-have'), '#1C1D20', null);
    /* the rib, from its root fillet up: each band a step lighter, the outline of each a contour of height */
    lev.forEach((lv, i) => {
      const f = i / (lev.length - 1);
      put(aff, latPath(N.lev[String(lv)], 'node-' + lv), mix('#34353A', '#6A6B71', f), i === 0 ? 'rgba(243,242,238,0.62)' : 'rgba(243,242,238,0.3)', i === 0 ? 1.8 : 1);
    });
  } else if (mode === 'bottom') {
    /* from below: u = X, v = Z; the camera's own axes say which way they run on the stage */
    const vars = st.compare === 'both' ? [['tri', -L.gap / 2], ['hex', L.gap / 2]] : [[st.compare === 'hex' ? 'hex' : 'tri', 0]];
    const sk = Math.max(0, Math.min(1, st.stress || 0));
    for (const [kind, off] of vars) {
      const B = L.bottom[kind]; if (!B) continue;
      const p0 = cam.P([off, 0, 0]), pu = cam.P([off + 1, 0, 0]), pv = cam.P([off, 0, 1]);
      const aff = [pu[0] - p0[0], pu[1] - p0[1], pv[0] - p0[0], pv[1] - p0[1], p0[0], p0[1]];
      put(aff, latPath(B.outline, kind + '-out'), shellF, null);
      G.save(); G.globalAlpha *= 0.9; put(aff, latPath(B.outline, kind + '-out'), null, edge, 3.2); G.restore();
      put(aff, latPath(B.outline, kind + '-out'), shellF, null);
      put(aff, latPath(B.inside, kind + '-in'), inside, null);
      put(aff, latPath(B.ribs, kind + '-ribs'), ribF, ribS, 1);
      if (sk > 0.003) {
        G.save(); G.globalAlpha *= sk;
        B.bands.forEach((rings, b) => { if (rings.length) put(aff, latPath(rings, kind + '-b' + b), latRamp((b + 0.5) / B.bands.length), null); });
        G.restore();
      }
    }
  } else {
    /* the side, from -X: u = Z, v = Y */
    const Sd = L.side, p0 = cam.P([0, 0, 0]), pu = cam.P([0, 0, 1]), pv = cam.P([0, 1, 0]);
    const aff = [pu[0] - p0[0], pu[1] - p0[1], pv[0] - p0[0], pv[1] - p0[1], p0[0], p0[1]];
    const kc = smooth(clamp(st.cut || 0)), build = st.build == null ? 1 : st.build, win = 0.09, nO = Sd.grow.length;
    if (kc < 0.999) { G.save(); G.globalAlpha *= 1 - kc; put(aff, latPath(Sd.ext, 'side-ext'), shellF, edge, 2.2); G.restore(); }
    if (kc > 0.001) {
      G.save(); G.globalAlpha *= kc;
      put(aff, latPath(Sd.ext, 'side-ext'), null, TH ? 'rgba(17,17,17,0.35)' : 'rgba(243,242,238,0.28)', 1.2);
      put(aff, latPath(Sd.far, 'side-far'), inside, null);
      Sd.grow.forEach((rings, b) => {
        const g = clamp((build * (1 + win) - (b + 0.5) / nO) / win); if (g <= 0.003 || !rings.length) return;
        G.save(); G.globalAlpha *= smooth(g); put(aff, latPath(rings, 'side-g' + b), ribF, ribS, 1); G.restore();
      });
      /* the board stand-in and its tie points, as the 3D shows them (not with both lattices side by side) */
      if (st.compare !== 'both' && st.pcb !== 0 && Sd.pcb) {
        const a0 = cam.P([0, Sd.pcb.y0, Sd.pcb.z[0]]), a1 = cam.P([0, Sd.pcb.y0 + Sd.pcb.t, Sd.pcb.z[1]]);
        G.save(); G.globalAlpha *= 0.85 * clamp(build * 1.2 - 0.1); G.fillStyle = rgba('#2F6B4A', TH ? 0.55 : 0.6); G.strokeStyle = rgba('#6FAE86', 0.9); G.lineWidth = 1.2;
        G.beginPath(); G.rect(Math.min(a0[0], a1[0]), Math.min(a0[1], a1[1]), Math.abs(a1[0] - a0[0]), Math.abs(a1[1] - a0[1])); G.fill(); G.stroke(); G.restore();
        for (const tp of Sd.ties) if (tp[0] > 0) { const q = cam.P(tp); circle(q[0], q[1], 3.2, { fill: C.hero, alpha: clamp(build * 1.2 - 0.1) }); }
      }
      put(aff, latPath(Sd.cut, 'side-cut'), C.hero, null);
      G.restore();
    }
  }
  G.restore();
  return P;
}
