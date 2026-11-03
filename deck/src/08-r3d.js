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
   ============================================================================================ */
const V3 = { pending: 0 };
function view3D(key, t, x, y, w, h, state = {}, o = {}) {
  const ok = typeof R3D !== 'undefined' && R3D.has(key);
  if (!ok) { v3Wait(x, y, w, h, key, t); return false; }
  const theme = o.theme || (TH ? 'paper' : 'night');
  const k = (APP.scale || 1) * (APP.dpr || 1) * (o.res || 1);
  const pw = Math.max(64, Math.round(w * k)), ph = Math.max(36, Math.round(h * k));
  let c = null;
  try { c = R3D.render(key, t, state, pw, ph, theme); } catch (e) { console.error('view3D', key, e); }
  if (!c) { V3.pending++; v3Wait(x, y, w, h, key, t); return false; }
  G.save(); if (o.alpha != null) G.globalAlpha *= o.alpha; G.drawImage(c, x, y, w, h); G.restore();
  return true;
}
/** a quiet placeholder while a scene streams in: corner marks and a mono label, nothing that flashes */
function v3Wait(x, y, w, h, key, t) {
  const a = 0.5;
  G.save(); G.strokeStyle = inkA(0.18 * a); G.lineWidth = 1.5;
  const m = 14;
  for (const [cx, cy, sx, sy] of [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]]) { G.beginPath(); G.moveTo(cx + sx * m, cy); G.lineTo(cx, cy); G.lineTo(cx, cy + sy * m); G.stroke(); }
  G.restore();
}
function prepare3D(slide) {
  if (typeof R3D === 'undefined' || !slide || !slide.three) return;
  const theme = themeOf(slide) ? 'paper' : 'night';
  for (const k of slide.three) if (R3D.has(k)) R3D.prepare(k, theme);
}
