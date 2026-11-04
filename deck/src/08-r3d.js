/* ============================================================================================
   3D SHOTS
   The three.js assets in 3d/ are bundled into vendor/r3d.js (window.R3D) and rendered offscreen, then
   composited into the stage with drawImage, so 2D labels, callouts and transitions stay on top and the
   3D moves on the slide's own clock (deterministic in t: screenshots at a given t repeat).

     view3D('shell', t, x, y, w, h, { view: 'threeQuarter', yaw: 0.3 * ep(t, 0, 6), explode: ep(t, 2, 4) })

   Scenes: shell, shell-sora, pcb, gt01, wheel, claw, screw, skates, battery, lattice (3d/integration/entry.js).
   State: explode, xray, clickL/clickR (shell), pressL/pressR (pcb), press (gt01), scroll, side0/side1, power +
   powerMode ('charge'|'run'), reflow, cut, build, stress + stressCase, compare ('tri'|'hex'), cutaway, section,
   insert, drive, colorway, filletZoom.  Camera: view (named), yaw / pitch (radians), zoom, target [x,y,z] mm,
   lift (mm), fov (deg).
   Declare the scenes a slide uses with S({ three: ['shell', ...] }) so they start loading on slide entry.
   Each scene applies its full rest state under every call (3d/integration/entry.js REST), so a key left out is at rest.
   Every shot has a flat twin (08-v2d.js): drawn instead in 2D mode, while the scene streams in, and if it fails to build.
   ============================================================================================ */
const V3 = { pending: 0, proj: null, failed: {} };
function view3D(key, t, x, y, w, h, state = {}, o = {}) {
  /* 2D mode (08-v2d.js): the flat twin, same box, same state; V3.proj is its projector for callouts */
  if (V2D.on) { V3.proj = view2D(key, t, x, y, w, h, state, o) || null; return !!V3.proj; }
  V3.proj = null;
  const ok = typeof R3D !== 'undefined' && R3D.has(key);
  if (!ok) { V3.proj = view2D(key, t, x, y, w, h, state, o) || null; if (!V3.proj) v3Wait(x, y, w, h, key, t); return !!V3.proj; }
  const theme = o.theme || (TH ? 'paper' : 'night');
  const k = (APP.scale || 1) * (APP.dpr || 1) * (o.res || 1);
  const pw = Math.max(64, Math.round(w * k)), ph = Math.max(36, Math.round(h * k));
  let c = null;
  try { c = R3D.render(key, t, state, pw, ph, theme); } catch (e) { console.error('view3D', key, e); V3.failed[key] = true; }
  /* a scene that failed to build falls back to its flat twin rather than leaving a hole in the slide */
  if (!c && (V3.failed[key] || (R3D.failed && R3D.failed(key, theme)))) { V3.failed[key] = true; V3.proj = view2D(key, t, x, y, w, h, state, o) || null; if (V3.proj) return true; }
  /* while the scene streams in, its 2D twin stands in (screenshots still wait for the render: V3.pending) */
  if (!c) { V3.pending++; if (!view2D(key, t, x, y, w, h, state, o)) v3Wait(x, y, w, h, key, t); return false; }
  /* and when it arrives, it fades in over the twin (live playback only: a captured frame is always the render) */
  const a0 = o.alpha == null ? 1 : o.alpha, ra = R3D.readyAt ? R3D.readyAt(key, theme) : 0;
  const kin = APP.frozenT != null || !ra ? 1 : clamp((performance.now() - ra) / 450);
  if (kin < 1) view2D(key, t, x, y, w, h, state, Object.assign({}, o, { alpha: a0 * (1 - kin) }));
  /* the scene's canvas only grows; the shot is the top-left pw × ph of it (c.rect) */
  const R = c.rect || [0, 0, c.width, c.height];
  G.save(); G.globalAlpha *= a0 * kin; G.drawImage(c, R[0], R[1], R[2], R[3], x, y, w, h); G.restore();
  return true;
}
/** a quiet placeholder for a scene with no 2D twin while it streams in: corner marks, nothing that flashes */
function v3Wait(x, y, w, h, key, t) {
  const a = 0.5;
  G.save(); G.strokeStyle = inkA(0.18 * a); G.lineWidth = 1.5;
  const m = 14;
  for (const [cx, cy, sx, sy] of [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]]) { G.beginPath(); G.moveTo(cx + sx * m, cy); G.lineTo(cx, cy); G.lineTo(cx, cy + sy * m); G.stroke(); }
  G.restore();
}
function prepare3D(slide) {
  if (typeof R3D === 'undefined' || !slide || !slide.three || V2D.on) return;
  const theme = themeOf(slide) ? 'paper' : 'night';
  for (const k of slide.three) if (R3D.has(k)) R3D.prepare(k, theme);
}
