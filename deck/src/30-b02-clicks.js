/* ============================================================================================
   B02 · CLICKS I: THE MECHANICS THAT MATTER MOST (revamp v2, 2026-11-06)
   Twelve slides, in film order: the chapter card, straight rear cutouts, seams, a flat front, grooves, flush walls, Direct
   Drive Actuation, one flat board, the bridge tensioner, a stiff trigger, dual rail main clicks, POM pads.
   Every slide runs the rival's fault first, drawn mechanically and named, then the same input on Theseus's part, then what
   the player gets (common.md M1 to M10). Every top-level name here starts with b02_ / B02_. Parts come from the shared
   drawings (clk_gt01MM, clickMM, clk_ten / clk_ribbon / clk_lever, the 3D twins in GEO2D) and the motion kit (06-motion.js).
   ============================================================================================ */
Object.assign(SRC, {
  b02_scan: { t: 'The deck\'s 3D model of the Ninjutso Sora V2 (from Brock\'s scan) and of Theseus, top view of the left trigger (deck/geo2d shell-sora and shell): the Sora\'s rear cutout rises 4.8 mm from the centre to the outer corner; at the switch line (16 mm out, board plan 5) a 10 mm tensioner along it leans 13.2°', u: '', n: 'Derived from the 3D model; the raw scan is not published (F0.6).' },
  b02_tpuV3: { t: 'TechPowerUp, Razer Viper V3 Pro review: "the main buttons no longer extend across the entire width of the mouse, and are now framed by ledges"', u: 'https://techpowerup.com/review/razer-viper-v3-pro/3.html' },
  b02_tpuV2: { t: 'TechPowerUp, Razer Viper V2 Pro review: "lateral button movement is minimal and must be provoked to become noticeable"', u: 'https://techpowerup.com/review/razer-viper-v2-pro/4.html' },
  b02_tpuOp1: { t: 'TechPowerUp, Endgame Gear OP1 8K review: "The main and side buttons sit on their own PCBs screwed into the top shell", the former "connected through a 3-pin connector"; "The left button has low pre and moderate post-travel", the right "moderate pre and post-travel"', u: 'https://techpowerup.com/review/endgame-gear-op1-8k/4.html' },
  b02_osWork: { t: 'OpenStax, College Physics, §7.1 "Work: The Scientific Definition", Figure 7.2: "The work done by the force F on this lawn mower is Fd cos θ"; "F cos θ is the component of the force in the direction of motion"', u: 'https://openstax.org/books/college-physics/pages/7-1-work-the-scientific-definition' },
  b02_osStab: { t: 'OpenStax, College Physics for AP Courses, §9.3 "Stability": a marble at the bottom of a bowl is pushed back (stable equilibrium); a ball on top of a hill runs away once nudged (unstable)', u: 'https://openstax.org/books/college-physics-ap-courses/pages/9-3-stability' },
  b02_radwin: { t: 'Radwin & Jeng 1997, Human Factors 39(1): 130–140, "Activation force and travel effects on overexertion in repetitive key tapping": "Peak force during keying has been measured to be as much as 2.5 to 4.6 times the required activation force"', u: 'https://ergo.wisc.edu/wp-content/uploads/sites/901/2020/04/Radwin-and-Jeng-1997.pdf' },
  b02_johnson: { t: 'Johnson, Hagberg, Wigaeus Hjelm & Rempel 2000, Scand J Work Environ Health 26(5): 398–405: mean force on the mouse button 0.35 N, on the sides 0.43 N, over mouse use', u: 'https://www.sjweh.fi/article/560' },
  b02_dias: { t: 'Dias, Dudte, Mahadevan & Santangelo 2012, "Geometric Mechanics of Curved Crease Origami", Physical Review Letters: a closed curved crease "is frustrated by geometry, forcing it to buckle"', u: 'https://arxiv.org/abs/1206.0461' },
  b02_albers: { t: 'Erik Demaine, History of Curved Origami Sculpture: Josef Albers\' preliminary course at the Bauhaus, 1927–28: paper folded along concentric circles "will automatically twist into a saddle curve"', u: 'https://erikdemaine.org/curved/history/' }
});

/* ============================== shared geometry ==============================
   World frame for every b02 drawing in mm: x to the right as seen from above with the nose up (x = -X of the 3D scene, so
   the user's left trigger has x < 0), y up from the desk, z forward (the scene's +Z, the nose). */
const B02 = {
  sw: { x: 16.0, z: 36.72 },        /* the GT01s on board plan 5: x ±16.0, board z 39.6, board offset -2.88 (3d/pcb plan5.py) */
  seam: -KEY.seam,                  /* Theseus's straight rear cutout, z 4.84 (F12.9) */
  smile: [0.0059, 0.0461, 4.718],   /* the Sora V2's rear cutout, fitted to the 3D twin's left trigger: z = a x² + b|x| + c */
  arc: 20 * Math.PI / 180,          /* the post's arc at the plunger, off upright (clickGeo: crown (-1.4, 0.2), foot (30, 11.63)) */
  tw: 10,                           /* the tensioner's width along its bend line (CLK_TN.b) */
  gf: 55,                           /* the GT01's operating force, gf (Gateron via MechKeys, clk_gt01) */
  ex: 14                            /* motion drawn this many times its size in the 3D views */
};
const b02_smileZ = x => { const a = Math.abs(x), [p, q, r] = B02.smile; return p * a * a + q * a + r; };

/** the 3D twin's outline of a part seen from above, in world mm [[x, z], ...], decoded once (GEO2D rings, axis '1'). */
const B02_RING = new Map();
function b02_ring(scene, re) {
  const key = scene + '|' + re.source; if (B02_RING.has(key)) return B02_RING.get(key);
  let out = null;
  const D = typeof GEO2D !== 'undefined' && GEO2D[scene];
  if (D) {
    const q = 1 / D.q, m = D.meshes.find(mm => re.test(mm.path));
    const rings = m && m.rings && m.rings['1'];
    if (rings && rings.length) {
      let best = null;
      for (const r of rings) { if (r.h) continue; let u = 0, v = 0; const pts = []; for (let i = 0; i < r.d.length; i += 2) { u += r.d[i]; v += r.d[i + 1]; pts.push([-u * q, v * q]); } if (!best || pts.length > best.length) best = pts; }
      out = best;
    }
  }
  B02_RING.set(key, out);
  return out;
}

/* ---------- the left trigger, from above: its outline from the 3D model, with the rear edge as a morph ----------
   Theseus's trigger and the Sora's share every edge but the rear one (the Theseus shell is the scanned Sora with a straight
   rear cutout, F12.9), so the outline is built once: the inner, front and outer edges from Theseus's twin, and the rear edge
   sampled from the outer joint (x -28.1, z 12.0) to the inner corner (x -0.15) as a curve that blends from Theseus's straight
   edge and rounded corner (k 0) to the Sora's smile (k 1). Both rear curves are parameterised by arc length, so the morph
   slides point for point. */
let B02_TRIG = null;
function b02_trigBase() {
  if (B02_TRIG) return B02_TRIG;
  const P = b02_ring('shell', /explodeL\/triggerL\/Group\/triggerL$/);
  const S = b02_ring('shell-sora', /explodeL\/triggerL\/Group\/triggerL$/);
  /* fall back to a generic trigger if the twins are missing (the drawing still reads) */
  const fallback = () => { const pts = []; for (let i = 0; i <= 40; i++) { const u = i / 40; pts.push([-0.15, 5 + u * 54.8]); } for (let i = 0; i <= 30; i++) { const u = i / 30; pts.push([-0.15 - 29 * Math.sin(u * Math.PI / 2), 59.8 - 8 * (1 - Math.cos(u * Math.PI / 2))]); } for (let i = 1; i <= 30; i++) { const u = i / 30; pts.push([-29.2 + 1.1 * u, 51.8 - 39.8 * u]); } return pts; };
  const src = P || fallback();
  /* walk the outline from the inner-rear corner up the inner edge, round the front, down the outer edge to the joint */
  const near = (pts, x, z) => pts.reduce((b, p, i) => { const d = Math.hypot(p[0] - x, p[1] - z); return d < b.d ? { d, i } : b; }, { d: 1e9, i: 0 }).i;
  const n = src.length, i0 = near(src, -0.15, 5.6), i1 = near(src, -28.1, 12.6);
  /* the outline runs inner edge → front → outer edge in one direction round the ring: pick the direction that reaches the
     front (z max) before the joint */
  const walk = dir => { const out = []; for (let k = 0, i = i0; k < n; k++, i = (i + dir + n) % n) { out.push(src[i]); if (i === i1) break; } return out; };
  let fixed = walk(1); if (Math.max(...fixed.map(p => p[1])) < 50) fixed = walk(-1);
  /* light smoothing (the twin is quantised to 0.05 mm) */
  const sm = fixed.map((p, i) => { if (!i || i === fixed.length - 1) return p.slice(); const a = fixed[i - 1], b = fixed[i + 1]; return [(a[0] + 2 * p[0] + b[0]) / 4, (a[1] + 2 * p[1] + b[1]) / 4]; });
  /* the two rear curves, from the joint to the inner corner, N points each by arc length */
  const N = 48;
  const resample = pts => { const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); const T = L[L.length - 1], out = []; let j = 1; for (let k = 0; k < N; k++) { const s = T * k / (N - 1); while (j < L.length - 1 && L[j] < s) j++; const u = (s - L[j - 1]) / ((L[j] - L[j - 1]) || 1); out.push([lerp(pts[j - 1][0], pts[j][0], u), lerp(pts[j - 1][1], pts[j][1], u)]); } return out; };
  const joint = sm[sm.length - 1];
  /* Theseus: the twin's own corner and straight rear edge, walking on from the joint to the inner corner */
  const rest = []; { const dir = fixed.length > 1 && src.indexOf(fixed[1]) === (i0 + 1) % n ? 1 : -1; for (let k = 0, i = i1; k < n; k++, i = (i + dir + n) % n) { rest.push(src[i]); if (i === i0) break; } }
  const thR = rest.length > 4 ? rest : [joint, [-23.6, B02.seam], [-0.15, B02.seam]];
  /* the Sora: from the joint along its outer corner to the smile's end at x -24.9, then the smile to the centre */
  const so = [[joint[0], joint[1]], [-27.2, 10.3], [-26.3, 9.76]]; for (let k = 0; k <= 30; k++) { const x = lerp(-24.9, -0.15, k / 30); so.push([x, b02_smileZ(x)]); }
  B02_TRIG = { fixed: sm, rearT: resample(thR), rearS: resample(so), twin: !!P, sora: !!S };
  return B02_TRIG;
}
/** the left trigger's outline, from above, world mm: k = 0 Theseus (straight), 1 the Sora's smile. Closed, CCW-agnostic */
function b02_trigOutline(k = 0) {
  const T = b02_trigBase(), rear = T.rearT.map((p, i) => [lerp(p[0], T.rearS[i][0], k), lerp(p[1], T.rearS[i][1], k)]);
  return T.fixed.concat(rear.slice(1, -1));
}
/** the rear edge alone, from the outer joint to the inner corner, world mm */
function b02_trigRear(k = 0) { const T = b02_trigBase(); return T.rearT.map((p, i) => [lerp(p[0], T.rearS[i][0], k), lerp(p[1], T.rearS[i][1], k)]); }
/** the rear cutout's z at x for a blend k (0 straight, 1 smile) */
const b02_rearZ = (x, k) => lerp(B02.seam, b02_smileZ(x), k);

/** the top surface's height (y, mm) at (x, z), simplified from the 3D twin: the crown falls 0.3 mm per mm forward of the rear
   cutout (curving down to the nose) and 0.0113 x² across; behind the cutout the shell climbs to the hump at z -12. Fits the
   twin's side silhouette within about 1 mm, which is all a drawing this size needs */
function b02_h(x, z) {
  const c = z >= 5 ? 35.7 - 0.3 * (z - 5) - 0.0025 * (z - 5) * (z - 5) : 38.1 - 0.0082 * (z + 12) * (z + 12);
  return c - 0.0113 * x * x;
}

/* ---------- the trigger's hinge: the bend line the tensioner takes, and what a press does about it ----------
   A rigid trigger turns about its bend line. Its tensioner (10 mm wide, centred on the switch line, #18) bends along the rear
   cutout (#17), so the bend line is the cutout's chord over the tensioner's width. Straight cutout: square across. The
   Sora's smile: it leans. The physics is the hinge's: a press at P clicks when F·d(P) = F_switch·d(S) + M_spring, where d is
   the distance from the bend line in the plan (lever arms); the post's foot swings perpendicular to the line. */
function b02_hinge(k) {
  const xc = -B02.sw.x, a = xc + B02.tw / 2, b = xc - B02.tw / 2;              /* the tensioner spans x -11 .. -21 */
  const za = b02_rearZ(a, k), zb = b02_rearZ(b, k), zc = (za + zb) / 2;
  const ux = b - a, uz = zb - za, L = Math.hypot(ux, uz);                        /* along the line, inner → outer */
  return { a: [a, za], b: [b, zb], c: [xc, zc], u: [ux / L, uz / L], lean: Math.atan2(uz, Math.abs(ux)) };
}
/** the lever arm (mm) from the bend line to a point (x, z) in plan, on the trigger's side of it */
function b02_arm(H, x, z) { const dx = x - H.c[0], dz = z - H.c[1]; return Math.abs(dx * H.u[1] - dz * H.u[0]); }
/** the spring's own moment at the click, gf·mm: K1's bridge (clk_ten) clicks with 7.7 gf at 40 mm on its own */
function b02_springM() { try { const c = clk_ten('bridge', 'ppcf').clk; return c.gf * CLK_TN.XP; } catch (e) { return 7.7 * 40; } }
/** the finger force (gf) that clicks the switch, pressed at (x, z) on a trigger whose cutout blend is k */
function b02_clickGf(k, x, z) {
  const H = b02_hinge(k), dS = b02_arm(H, -B02.sw.x, B02.sw.z), dP = b02_arm(H, x, z);
  return (B02.gf * dS + b02_springM()) / dP;
}
/** the share of the post foot's travel that goes sideways (across the switch), for a bend line leaning `lean` and the post's
   20° arc: its swing is perpendicular to the bend line, so sin(lean) of its fore-aft part goes across */
const b02_sideShare = lean => { const r = Math.tan(B02.arc); return r * Math.sin(lean) / Math.hypot(r, Math.cos(lean)); };
/* the spring's moment scales with the turn the click needs (0.35 mm at the plunger over its lever), so it is taken at the
   model's 30 mm lever and scaled by 30 / d(S) */
function b02_clickGf2(k, x, z) {
  const H = b02_hinge(k), dS = b02_arm(H, -B02.sw.x, B02.sw.z), dP = b02_arm(H, x, z);
  return (B02.gf * dS + b02_springM() * CLK_TN.XS / dS) / dP;
}

/* ============================== a small 3D view for the drawings that need one ==============================
   Orthographic, as the deck's flat twins are, with a camera that can start straight overhead (matching the top view the kit
   establishes on) and tip back into a three-quarter view in one continuous move. */
/** a camera on a target T (world mm): yaw ψ about the vertical, pitch φ above the desk (π/2 = straight down, nose up on
   screen), s px per mm, the target at (cx, cy) on the stage. P(p) → [sx, sy, depth] (depth: larger is nearer) */
function b02_cam3(T, yaw, pitch, s, cx, cy) {
  const cp = Math.cos(pitch), sp = Math.sin(pitch), cs = Math.cos(yaw), sn = Math.sin(yaw);
  const R = [cs, 0, -sn], c = [-sn * cp, sp, -cs * cp];
  const U = [R[1] * c[2] - R[2] * c[1], R[2] * c[0] - R[0] * c[2], R[0] * c[1] - R[1] * c[0]];
  const P = p => { const d = [p[0] - T[0], p[1] - T[1], p[2] - T[2]]; return [cx + s * (d[0] * R[0] + d[1] * R[1] + d[2] * R[2]), cy - s * (d[0] * U[0] + d[1] * U[1] + d[2] * U[2]), d[0] * c[0] + d[1] * c[1] + d[2] * c[2]]; };
  return { P, R, U, c, s, T };
}
/** rotate p about the axis through A along unit k by angle a (Rodrigues) */
function b02_rot(p, A, k, a) {
  if (!a) return p;
  const v = [p[0] - A[0], p[1] - A[1], p[2] - A[2]], ca = Math.cos(a), sa = Math.sin(a), kv = k[0] * v[0] + k[1] * v[1] + k[2] * v[2];
  const x = [k[1] * v[2] - k[2] * v[1], k[2] * v[0] - k[0] * v[2], k[0] * v[1] - k[1] * v[0]];
  return [A[0] + v[0] * ca + x[0] * sa + k[0] * kv * (1 - ca), A[1] + v[1] * ca + x[1] * sa + k[1] * kv * (1 - ca), A[2] + v[2] * ca + x[2] * sa + k[2] * kv * (1 - ca)];
}
/** the hinge in 3D for a cutout blend k: a point on the bend line at the switch line, under the skin, and its direction;
   turn(p, a) rotates a trigger point by a press of angle a (positive a always takes the front down) */
function b02_hinge3(k) {
  const H = b02_hinge(k), A = [H.c[0], b02_h(H.c[0], H.c[1]) - 1.2, H.c[1]];
  let K = [H.u[0], 0, H.u[1]];
  if (b02_rot([A[0], A[1], A[2] + 10], A, K, 0.1)[1] > A[1]) K = K.map(v => -v);
  return { H, A, K, turn: (p, a) => b02_rot(p, A, K, a) };
}
/** the x range of the trigger's outline at depth z (its inner and outer edges), from a closed outline */
function b02_spanAt(pts, z) {
  const xs = [];
  for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; if ((a[1] - z) * (b[1] - z) <= 0 && a[1] !== b[1]) xs.push(a[0] + (b[0] - a[0]) * (z - a[1]) / (b[1] - a[1])); }
  return xs.length >= 2 ? [Math.min(...xs), Math.max(...xs)] : null;
}
/** the plate a trigger's top makes, lifted onto the crown (b02_h), turned by a press about its hinge, projected */
function b02_lift(pts, cam, turn, a, dy = 0) { return pts.map(([x, z]) => { const p = turn ? turn([x, b02_h(x, z) + dy, z], a) : [x, b02_h(x, z) + dy, z]; return cam.P(p); }); }
const b02_pathOf = (q, close = true) => { G.beginPath(); q.forEach((p, i) => i ? G.lineTo(p[0], p[1]) : G.moveTo(p[0], p[1])); if (close) G.closePath(); };
/** the left trigger in the 3D view. o = { k (0 straight .. 1 smile), a (press angle, rad), cam, alpha, fill, edge, lit (the
   rear edge's colour), litW, iso (alpha of the lines across), ghost (alpha of the outline at rest), mirror (the right
   trigger: x → -x, not pressed) }. Returns { rear: [stage pts of the rear edge], at(x, z) → stage point on the plate } */
function b02_plate(o) {
  const k = o.k || 0, cam = o.cam, a = o.a || 0, al = o.alpha == null ? 1 : o.alpha, mir = o.mirror ? -1 : 1;
  if (al <= 0.003) return {};
  const hg = b02_hinge3(k), turn = mir < 0 ? null : hg.turn;
  const out2 = b02_trigOutline(k).map(([x, z]) => [x * mir, z]);
  const q = b02_lift(out2, cam, turn, a);
  G.save(); G.globalAlpha = al;
  /* the rest outline, faint and dashed, once it has moved */
  if (o.ghost > 0 && a) { const q0 = b02_lift(out2, cam, null, 0); b02_pathOf(q0); G.setLineDash([7, 6]); G.strokeStyle = inkA(0.35 * o.ghost); G.lineWidth = 1.5; G.stroke(); G.setLineDash([]); }
  /* the surface: flat, one step off the ground, a touch lighter toward the rear (the light is behind the camera's left) */
  b02_pathOf(q);
  const ys = q.map(p => p[1]), g = G.createLinearGradient(0, Math.min(...ys), 0, Math.max(...ys));
  const f0 = o.fill || (TH ? '#E9E8E3' : '#25262A'), f1 = o.fill2 || (TH ? '#DCDBD5' : '#1C1D20');
  g.addColorStop(0, f0); g.addColorStop(1, f1); G.fillStyle = g; G.fill();
  /* the lines across: constant z every 5 mm, so a tilt or a twist shows as the lines tipping */
  if (o.iso > 0) {
    G.save(); b02_pathOf(q); G.clip();
    G.strokeStyle = inkA((TH ? 0.16 : 0.14) * o.iso); G.lineWidth = 1.2;
    for (let z = 10; z <= 56; z += 5) {
      const sp = b02_spanAt(out2, z); if (!sp) continue;
      const row = []; for (let i = 0; i <= 18; i++) row.push([lerp(sp[0], sp[1], i / 18), z]);
      b02_pathOf(b02_lift(row, cam, turn, a), false); G.stroke();
    }
    G.restore();
  }
  b02_pathOf(q); G.strokeStyle = o.edge || inkA(TH ? 0.55 : 0.5); G.lineWidth = o.edgeW || 1.8; G.lineJoin = 'round'; G.stroke();
  /* the rear edge: the cutout, drawn in its own colour */
  const rear = b02_trigRear(k).map(([x, z]) => [x * mir, z]), qr = b02_lift(rear, cam, turn, a);
  if (o.lit) { b02_pathOf(qr, false); G.strokeStyle = o.lit; G.lineWidth = o.litW || 4; G.lineCap = 'round'; G.stroke(); }
  G.restore();
  return { rear: qr, at: (x, z, dy = 0) => cam.P(turn ? turn([x, b02_h(x, z) + dy, z], a) : [x, b02_h(x, z) + dy, z]), hinge: hg };
}
/** the shell behind the rear cutout, both halves, as one fixed plate from the cutout (0.35 mm back: the gap) to z -18 */
function b02_rearShell(o) {
  const k = o.k || 0, cam = o.cam, al = o.alpha == null ? 1 : o.alpha; if (al <= 0.003) return;
  const gap = 0.45, hw = z => keyHalfW(-z) - 0.2, edge = [];
  for (let i = 0; i <= 40; i++) { const x = lerp(-hw(b02_rearZ(-29, k)), hw(b02_rearZ(29, k)), i / 40); edge.push([x, b02_rearZ(x, k) - gap]); }
  const side = s => { const pts = []; for (let i = 0; i <= 12; i++) { const z = lerp(b02_rearZ(29, k) - gap, -18, i / 12); pts.push([s * hw(z), z]); } return pts; };
  const poly2 = edge.concat(side(1), side(-1).reverse());
  const q = b02_lift(poly2, cam, null, 0);
  G.save(); G.globalAlpha = al;
  b02_pathOf(q); const ys = q.map(p => p[1]), g = G.createLinearGradient(0, Math.min(...ys), 0, Math.max(...ys));
  g.addColorStop(0, TH ? 'rgba(220,219,213,0)' : 'rgba(28,29,32,0)'); g.addColorStop(0.55, TH ? '#E2E1DB' : '#202125'); g.addColorStop(1, TH ? '#E6E5DF' : '#232428');
  G.fillStyle = g; G.fill();
  b02_pathOf(b02_lift(edge, cam, null, 0), false); G.strokeStyle = o.edge || inkA(TH ? 0.5 : 0.45); G.lineWidth = 1.8; G.stroke();
  G.restore();
}

/* ============================== the left trigger from above (plan), for the cutouts slide ==============================
   Drawn in key-plan mm (x right, y = -z, the nose up), so it lies exactly over the kit's top view of the mouse.
   o = { k (0 straight .. 1 the Sora's smile), press (0..1 of the click), field (0..1: the travel shading and its contours),
         xray (0..1: the tensioner, the switch and the post seen through the shell), axis (0..1: the bend line drawn across the
         trigger, with its lean), lit (the rear cutout's colour), axisCol, alpha }
   Returns stage points: { cut (the cutout at the switch line), sw (the switch), post, bend: [a, b], at(x, z), axisEnd } */
const b02_K = () => (typeof MS_K !== 'undefined' ? MS_K : { x: 1, y: 1 });
const b02_P = (x, z) => { const k = b02_K(); return [x * k.x, -z * k.y]; };
function b02_trigTopMM(o = {}) {
  const k = o.k || 0, press = clamp(o.press || 0), H = b02_hinge(k), out = {};
  const outline = b02_trigOutline(k).map(([x, z]) => b02_P(x, z));
  const path = () => b02_pathOf(outline);
  /* the travel at the click, mm, at a plan point: the hinge's turn times the lever. The switch's plunger travels its 0.35 mm
     along its 20° axis, so the post's foot moves 0.35 / cos 20° there; everything else scales with its lever */
  const dS = b02_arm(H, -B02.sw.x, B02.sw.z), per = 0.35 / Math.cos(B02.arc) / dS;
  /* the trigger: a flat panel, the travel shading over it, its contours, the outline */
  path(); G.fillStyle = o.fill || (TH ? '#ECEBE6' : '#232428'); G.fill();
  if (o.field > 0 && press > 0) {
    G.save(); path(); G.clip();
    /* the shading runs perpendicular to the bend line: unmoved at the line, deepest at the far front */
    const nx = -H.u[1], nz = H.u[0], sg = (0 - H.c[0]) * nx + (60 - H.c[1]) * nz > 0 ? 1 : -1, N = [nx * sg, nz * sg];
    const p0 = b02_P(H.c[0], H.c[1]), dMax = 62, p1 = b02_P(H.c[0] + N[0] * dMax, H.c[1] + N[1] * dMax);
    const g = G.createLinearGradient(p0[0], p0[1], p1[0], p1[1]);
    const col = o.fieldCol || (TH ? '17,17,17' : '243,242,238'), A = 0.15 * o.field * press;
    g.addColorStop(0, `rgba(${col},0)`); g.addColorStop(1, `rgba(${col},${A})`);
    G.fillStyle = g; G.fillRect(-60, -80, 120, 120);
    /* contours: the lines of equal travel, every 0.1 mm at the click, parallel to the bend line */
    G.strokeStyle = `rgba(${col},${0.34 * o.field})`; G.lineWidth = lw(1.3);
    for (let mm = 0.1; mm < 0.75; mm += 0.1) {
      const d = mm / per, c0 = [H.c[0] + N[0] * d, H.c[1] + N[1] * d], u = H.u;
      const a = b02_P(c0[0] - u[0] * 80, c0[1] - u[1] * 80), b = b02_P(c0[0] + u[0] * 80, c0[1] + u[1] * 80);
      G.beginPath(); G.moveTo(a[0], a[1]); G.lineTo(b[0], b[1]); G.setLineDash([lw(2), lw(5)]); G.stroke(); G.setLineDash([]);
    }
    G.restore();
  }
  path(); G.strokeStyle = o.edge || inkA(TH ? 0.6 : 0.55); G.lineWidth = lw(1.8); G.lineJoin = 'round'; G.stroke();
  /* the rear cutout: the edge the tensioner bends along */
  const rear = b02_trigRear(k).map(([x, z]) => b02_P(x, z));
  if (o.lit) { b02_pathOf(rear, false); G.strokeStyle = o.lit; G.lineWidth = lw(o.litW || 4); G.lineCap = 'round'; G.stroke(); }
  /* seen through the shell: the tensioner (10 mm wide, centred on the switch line, #18), its bend line, the switch, the post */
  if (o.xray > 0) {
    xsave(); ga(o.xray);
    const t0 = [H.a[0], H.a[1]], t1 = [H.b[0], H.b[1]], back = 3.2, fwd = 2.4, nrm = [-H.u[1], H.u[0]];
    const sgn = nrm[1] > 0 ? 1 : -1, nf = [nrm[0] * sgn, nrm[1] * sgn];
    const band = [[t0[0] - nf[0] * back, t0[1] - nf[1] * back], [t1[0] - nf[0] * back, t1[1] - nf[1] * back], [t1[0] + nf[0] * fwd, t1[1] + nf[1] * fwd], [t0[0] + nf[0] * fwd, t0[1] + nf[1] * fwd]].map(p => b02_P(p[0], p[1]));
    b02_pathOf(band); G.fillStyle = rgba(o.axisCol || C.ink, 0.10); G.fill(); G.setLineDash([lw(5), lw(4)]); G.strokeStyle = o.axisCol || inkA(0.6); G.lineWidth = lw(1.6); G.stroke(); G.setLineDash([]);
    /* the bend line itself, along the cutout over the tensioner */
    const ba = b02_P(t0[0], t0[1]), bb = b02_P(t1[0], t1[1]);
    G.beginPath(); G.moveTo(ba[0], ba[1]); G.lineTo(bb[0], bb[1]); G.strokeStyle = o.axisCol || C.ink; G.lineWidth = lw(3.2); G.lineCap = 'round'; G.stroke();
    out.bend = [SP(ba[0], ba[1]), SP(bb[0], bb[1])];
    /* the GT01 under the trigger: its footprint, 5.8 × 12.8 mm, its long axis fore-aft; the post over its plunger */
    const sx = -B02.sw.x, sz = B02.sw.z, f0 = b02_P(sx - 2.9, sz + 6.4);
    G.setLineDash([lw(4), lw(3)]); pathRR(f0[0], f0[1], 5.8, 12.8, 0.6); G.strokeStyle = inkA(0.5); G.lineWidth = lw(1.3); G.stroke(); G.setLineDash([]);
    const pp = b02_P(sx, sz); G.beginPath(); G.arc(pp[0], pp[1], 1.05, 0, TAU); G.fillStyle = inkA(0.75); G.fill();
    out.sw = SP(pp[0] + 2.9, pp[1]); out.post = SP(pp[0], pp[1]);
    xrest();
  }
  /* the bend line carried across the trigger: the axis the whole trigger turns about, and its lean against square */
  if (o.axis > 0) {
    xsave(); ga(o.axis);
    const c = H.c, u = H.u, e0 = b02_P(c[0] - u[0] * 14, c[1] - u[1] * 14), e1 = b02_P(c[0] + u[0] * 16, c[1] + u[1] * 16);
    G.beginPath(); G.moveTo(e0[0], e0[1]); G.lineTo(e1[0], e1[1]); G.setLineDash([lw(9), lw(6)]); G.strokeStyle = o.axisCol || C.ink; G.lineWidth = lw(2.2); G.stroke(); G.setLineDash([]);
    out.axisEnd = SP(e1[0], e1[1]); out.axisC = SP(...b02_P(c[0], c[1]));
    xrest();
  }
  out.cut = SP(...b02_P(-B02.sw.x, b02_rearZ(-B02.sw.x, k)));
  const M = XF.m.slice(); out.at = (x, z) => SPm(M, ...b02_P(x, z)); out.H = H; out.per = per;
  return out;
}

/* ============================== the front of the trigger, head-on (b02_front) ==============================
   Seen from the nose (the kit's front view: the user's left trigger on the right). u runs from the centre split out to the
   trigger's outer end, mm; y up. The trigger's front lip lands on a ledge in the shell's nose (#46). Heavy comfort grooves
   run to the edge on most mice, so the lip and its ledge are curves; two molded curves never match (Protolabs: ±0.076 mm a
   face), so the lip lands on one spot first and rolls on it: a rocker. With the grooves run out before the front (#47) the
   lip and the ledge are flat and parallel to the ground (#46): the whole lip lands at once. */
const B02_FR = { W: 20, uc: 10, d: 0.9, mis: 0.1, gap: 0.7, face: 2.6, ex: 4, lip: 22 };
/** the groove's valley across the lip, 0..1: a cos² centred on the button (u 12), 0 at the centre split and the outer end */
const b02_c = u => { const x = (u - B02_FR.uc) / B02_FR.uc; return Math.abs(x) >= 1 ? 0 : Math.pow(Math.cos(x * Math.PI / 2), 2); };
const b02_cd = u => { const x = (u - B02_FR.uc) / B02_FR.uc; return Math.abs(x) >= 1 ? 0 : -Math.PI / (2 * B02_FR.uc) * Math.sin(x * Math.PI); };
/** where a press at u makes the lip land: the contact rolls from the valley's bottom toward the press, at most a quarter of
   the valley out (where the curves' slopes differ most); k 0 (flat) lands along the whole lip */
const b02_contact = (u, k) => B02_FR.uc + clamp((u - B02_FR.uc) * 0.75, -B02_FR.uc / 2, B02_FR.uc / 2) * (k > 0.5 ? 1 : 0);
/** the roll the lip makes, landed at contact cu, true radians (the slope difference of the two curves there) */
const b02_rollAt = (cu, k) => { const F = B02_FR; return Math.atan(-(F.d - F.mis) * k * b02_cd(cu)) - Math.atan(-F.d * k * b02_cd(cu)); };
/** the front, head-on, in mm with heights drawn ex times (B02_FR.ex), y up in the model and down on the canvas.
   o = { k (1 grooves to the edge .. 0 a flat front), drop (0..1: the lip comes down its gap onto the ledge), cu (the contact,
   when landed), lit (the lip's colour), hit (0..1: contact marks), hitCol, mirror (the other trigger, dimmed, not pressed) } */
function b02_frontMM(o = {}) {
  const F = B02_FR, k = o.k == null ? 1 : o.k, ex = F.ex, out = {};
  const Lg = u => -(F.d - F.mis) * k * ex * b02_c(Math.abs(u));               /* the ledge's top */
  const L = u => (-F.d * b02_c(Math.min(u, F.W)) + F.mis) * k * ex;                           /* the lip's underside, landed at the valley */
  const dLg = u => -(F.d - F.mis) * k * ex * b02_cd(u), dL = u => -F.d * k * ex * b02_cd(u);
  const lift = (1 - clamp(o.drop || 0)) * F.gap * ex;
  /* landed and rolled onto the ledge at cu: turn the lip about its point at cu until it is tangent to the ledge there */
  const cu = o.cu == null ? F.uc : o.cu, landed = clamp(o.drop || 0);
  const th = k > 0.01 ? (Math.atan(dLg(cu)) - Math.atan(dL(cu))) * landed : 0, ty = (Lg(cu) - L(cu)) * landed;
  const T = (u, y) => { const dx = u - cu, dy = y - L(cu), c = Math.cos(th), sn = Math.sin(th); return [cu + dx * c - dy * sn, -(L(cu) + dx * sn + dy * c + ty + lift)]; };
  const shell = o.noseFill || (TH ? '#D9D8D2' : '#2B2C31'), trig = o.fill || (TH ? '#EFEEE9' : '#3B3C42'), edge = inkA(TH ? 0.55 : 0.5);
  /* the nose under both triggers, its ledge the lips land on */
  const U0 = o.mirror ? -F.lip - 2 : -1.6, U1 = F.lip + 2;
  const lg = []; for (let u = U0; u <= U1 + 1e-9; u += 0.2) lg.push([u, -Lg(Math.min(Math.abs(u), F.W))]);
  G.beginPath(); lg.forEach((p, i) => i ? G.lineTo(p[0], p[1]) : G.moveTo(p[0], p[1])); G.lineTo(U1, 7); G.lineTo(U0, 7); G.closePath(); G.fillStyle = shell; G.fill();
  G.beginPath(); lg.forEach((p, i) => i ? G.lineTo(p[0], p[1]) : G.moveTo(p[0], p[1])); G.strokeStyle = edge; G.lineWidth = lw(1.6); G.stroke();
  out.ledge = u => SP(u, -Lg(u));
  /* a lip: its underside, then its top (the face's height above it), rounded at the outer end */
  const lipPts = (mir) => {
    const pts = [], s = mir ? -1 : 1;
    for (let u = 0.3; u <= F.lip + 1e-9; u += 0.2) pts.push(mir ? [-u, -(L(u) + lift)] : T(u, L(u)));
    for (let u = F.lip; u >= 0.3 - 1e-9; u -= 0.2) { const r = u > F.lip - 1.2 ? (F.lip - u) / 1.2 : 1, y = L(u) + F.face * Math.sqrt(Math.max(0, 1 - (1 - r) * (1 - r))); pts.push(mir ? [-u, -(y + lift)] : T(u, y)); }
    return pts;
  };
  const drawLip = (pts, a, lit) => {
    G.save(); G.globalAlpha *= a; b02_pathOf(pts); G.fillStyle = trig; G.fill(); G.strokeStyle = edge; G.lineWidth = lw(1.6); G.lineJoin = 'round'; G.stroke();
    if (lit) { const n = Math.floor(pts.length / 2); b02_pathOf(pts.slice(0, n), false); G.strokeStyle = lit; G.lineWidth = lw(3); G.lineCap = 'round'; G.stroke(); }
    G.restore();
  };
  if (o.mirror) drawLip(lipPts(true), 0.5, null);
  drawLip(lipPts(false), 1, o.lit);
  out.top = u => SP(...T(u, L(u) + F.face)); out.lip = u => SP(...T(u, L(u))); out.topM = u => -T(u, L(u) + F.face)[1];
  out.roll = th / ex;   /* the true roll, radians */
  if (o.hit > 0) {
    xsave(); ga(o.hit);
    if (k > 0.5) { const p = T(cu, L(cu)); G.beginPath(); G.arc(p[0], p[1], 0.5, 0, TAU); G.fillStyle = o.hitCol || C.red; G.fill(); G.beginPath(); G.arc(p[0], p[1], 1.0, 0, TAU); G.strokeStyle = o.hitCol || C.red; G.lineWidth = lw(1.5); G.stroke(); out.hitAt = SP(p[0], p[1]); }
    else { const pts = []; for (let u = 0.6; u <= F.lip - 0.6; u += 0.2) pts.push(T(u, L(u))); b02_pathOf(pts, false); G.strokeStyle = o.hitCol || C.hero; G.lineWidth = lw(3.6); G.lineCap = 'round'; G.stroke(); out.hitAt = SP(...T(F.uc, L(F.uc))); }
    xrest();
  }
  return out;
}

/* ============================== a fingertip seen end-on (the kit draws it from the side and from above) ==============================
   For the front views (flush walls, grooves, seams): the fingertip's cross-section near the pad, mono grey (F9.24), 16 mm
   across (the kit's FINGER.top), its nail on top. Its pad lies on the surface it presses: where the pad's resting curve,
   pushed down by sink, would pass below the surface, it flattens onto it (skin conforms), so the contact patch and any skin
   that drapes into a step come out of the geometry. In mm, y up in the model; drawn with y down. o = { cx (the finger's
   centre u), base (the pad's lowest point at rest, y), sink (mm the pad is pushed into the surface), surf(u) → y (the surface
   under it; default flat at base), tilt (radians: the finger leaning), w (16), h (13), alpha, mark: [u0, u1, colour] (a stretch
   of the pad to colour: a pinch) }. Returns { contact: [u0, u1] (where the pad touches), top: [u, y], pad: [u, y] } (model mm) */
function b02_fingerEndMM(o = {}) {
  const w = o.w || 16, hh = o.h || 13, a = w / 2, cx = o.cx || 0, base = o.base || 0, sink = o.sink || 0, surf = o.surf || (() => base - 9);
  const skin = TH ? '#C4C3BD' : '#5F5E59', edge = TH ? 'rgba(40,40,38,0.6)' : 'rgba(230,230,225,0.45)', nail = TH ? '#DCDBD6' : '#7A7973';
  /* the pad's resting underside: a flattened ellipse 16 mm wide, its lowest point at base; pushed down by sink */
  const rest = u => { const x = (u - cx) / a; return Math.abs(x) >= 1 ? base + hh * 0.42 : base + hh * 0.42 * (1 - Math.sqrt(1 - x * x)) * 1.0; };
  const bot = [], cont = [];
  for (let u = cx - a; u <= cx + a + 1e-9; u += 0.1) { const y0 = rest(u) - sink, ys = surf(u), y = Math.max(y0, ys); bot.push([u, y]); if (y0 <= ys + 1e-3 && Math.abs(u - cx) < a - 0.3) cont.push(u); }
  const topY = base + hh - sink * 0.15;
  G.save(); G.globalAlpha *= (o.alpha == null ? 1 : o.alpha); G.translate(cx, 0); G.rotate(-(o.tilt || 0)); G.translate(-cx, 0);
  G.beginPath(); bot.forEach(([u, y], i) => i ? G.lineTo(u, -y) : G.moveTo(u, -y));
  G.bezierCurveTo(cx + a * 1.04, -(base + hh * 0.55), cx + a * 0.86, -topY, cx, -topY);
  G.bezierCurveTo(cx - a * 0.86, -topY, cx - a * 1.04, -(base + hh * 0.55), bot[0][0], -bot[0][1]); G.closePath();
  G.fillStyle = skin; G.fill(); G.strokeStyle = edge; G.lineWidth = lw(1.4); G.lineJoin = 'round'; G.stroke();
  /* the nail on top, end-on: a shallow arch */
  G.beginPath(); G.moveTo(cx - a * 0.62, -(topY - 1.7)); G.quadraticCurveTo(cx, -(topY + 1.0), cx + a * 0.62, -(topY - 1.7)); G.quadraticCurveTo(cx, -(topY - 0.4), cx - a * 0.62, -(topY - 1.7)); G.closePath();
  G.fillStyle = nail; G.fill(); G.strokeStyle = edge; G.lineWidth = lw(1.1); G.stroke();
  if (o.mark) { const [u0, u1, col] = o.mark; G.beginPath(); bot.filter(([u]) => u >= u0 && u <= u1).forEach(([u, y], i) => i ? G.lineTo(u, -y) : G.moveTo(u, -y)); G.strokeStyle = col || C.red; G.lineWidth = lw(4); G.lineCap = 'round'; G.stroke(); }
  G.restore();
  return { contact: cont.length ? [Math.min(...cont), Math.max(...cont)] : null, top: [cx, topY], pad: [cx, Math.max(rest(cx) - sink, surf(cx))] };
}

/* ============================== flush walls (#48) and which way a cutout faces: one trigger edge, head-on ==============================
   The trigger's outer edge beside the shoulder at the wall's length, seen from the nose (the user's left trigger on the
   right), mm, y up (drawn y down). u is the distance out from the centre split. Three set-ups, morphable:
     face 'wall'    the trigger wraps over the shoulder and its seam runs along the side: the gap is under the trigger's
                    edge, in the direction it moves, so a press closes it on whatever lies across it (a pinch);
     face 'ceiling' the trigger stops on top and a wall rises beside it: the gap opens upward; a press slides the trigger
                    down past the wall and closes nothing. wall (0..1): the wall's top from level with the trigger at rest
                    (0, the default way, #48) to level with it pressed (1, Theseus).
   o = { face, wall, press (0..1 of the travel at the click), tr (that travel, mm), ex (motion drawn ex×), finger (0..1),
   fu (the finger's centre u), lit } → stage points and the step (mm, true) */
const B02_FL = { tr: 0.42, gap: 0.35, uE: 24.0, skin: 1.3, wallW: 3.4 };
function b02_flushMM(o = {}) {
  const F = B02_FL, face = o.face || 'ceiling', ex = o.ex || 6, tr = (o.tr || F.tr), d = clamp(o.press || 0) * tr, out = {};
  const top = u => 21.6 - 0.0113 * u * u;                                       /* the crown across, at the wall's length */
  const shell = TH ? '#D9D8D2' : '#2B2C31', trig = TH ? '#EFEEE9' : '#3B3C42', edge = inkA(TH ? 0.55 : 0.5);
  const fill = (pts, col) => { b02_pathOf(pts.map(([u, y]) => [u, -y])); G.fillStyle = col; G.fill(); G.strokeStyle = edge; G.lineWidth = lw(1.6); G.lineJoin = 'round'; G.stroke(); };
  const dy = -d * ex;
  if (face === 'wall') {
    /* the trigger runs over the shoulder and down the side to its seam at y 12.6; the side shell continues below the gap */
    const ySeam = 12.6, tp = [];
    for (let u = 12; u <= 27.2; u += 0.25) tp.push([u, top(u) + dy]);
    const side = u => 27.2 + (top(27.2) - 0 - 0) * 0;                           /* (the side face) */
    const skinIn = []; for (let u = 27.2; u >= 12; u -= 0.25) skinIn.push([u - 0.0, top(u) - F.skin + dy]);
    const tri = [[12, top(12) + dy], ...tp, [28.6, top(27.2) - 1.6 + dy], [29.4, ySeam + F.gap * ex * 1 + dy - 0.0], [28.1, ySeam + F.gap * ex + dy], [27.2 - 0.9, top(27.2) - F.skin - 1.0 + dy], ...skinIn.slice(4)];
    fill(tri, trig);
    /* the side shell under the seam, fixed */
    fill([[29.4, ySeam], [29.9, 6], [28.5, 6], [28.0, ySeam]], shell);
    out.gapTop = SP(29.4, -(ySeam + F.gap * ex + dy)); out.gapBot = SP(29.4, -ySeam); out.seamY = ySeam; out.gap = Math.max(0, F.gap + (dy / ex) * 0) - d;
    out.edge = SP(28.6, -(top(27.2) - 1.6 + dy));
  } else {
    /* ceiling-facing: the trigger ends on top at uE with a short edge face; the shoulder wall beside it, its top at wallTop */
    const uE = F.uE, wTop = top(uE) - lerp(0, tr, clamp(o.wall || 0)) * ex;
    const tp = []; for (let u = 12; u <= uE + 1e-9; u += 0.25) tp.push([u, top(u) + dy]);
    const tri = [[12, top(12) + dy], ...tp, [uE, top(uE) - 2.0 + dy], [uE - 1.2, top(uE) - 2.0 + dy], [uE - 1.2, top(uE) - F.skin + dy]];
    for (let u = uE - 1.2; u >= 12; u -= 0.25) tri.push([u, top(u) - F.skin + dy]);
    fill(tri, trig);
    /* the wall: from the gap out and down the side */
    const w0 = uE + F.gap, wall = [[w0, wTop - 3.2], [w0, wTop], [w0 + 2.2, wTop - 0.25], [w0 + F.wallW + 1.2, wTop - 1.6], [w0 + F.wallW + 2.0, wTop - 4.4], [w0 + F.wallW + 2.4, wTop - 8], [w0 + F.wallW + 1.1, wTop - 8], [w0 + F.wallW + 0.7, wTop - 4.6], [w0 + 1.3, wTop - 1.4], [w0 + 1.3, wTop - 3.2]];
    fill(wall, shell);
    out.wallTop = SP(w0 + 0.6, -wTop); out.trigEdge = SP(uE - 0.3, -(top(uE) + dy)); out.step = (top(uE) - d) - (top(uE) - lerp(0, tr, clamp(o.wall || 0)));
    out.wTop = wTop; out.tTop = top(uE) + dy;
  }
  out.top = u => top(u) + dy; out.d = d;
  return out;
}

/* ============================== b02_cutouts: the readouts ============================== */
/** the switch from above in a loupe: the GT01's footprint (its long axis fore-aft, the plane its 20° tilt lies in), the
   post's foot and the way it swings when the trigger turns: along that plane (fine: the tilt meets it, Direct Drive) and,
   when the bend line leans, across it (red: no switch tilt can meet that). (x, y) the centre, r the radius, o = { lean
   (radians), k (0..1 how far it has swung), a, col (the along arrow's colour) } */
function b02_swingLoupe(t, x, y, r, o = {}) {
  const a = o.a == null ? 1 : o.a; if (a <= 0.003) return;
  const lean = o.lean || 0, k = o.k == null ? 1 : o.k, s = r / 9.5;
  G.save(); G.globalAlpha = a;
  circle(x, y, r, { fill: C.panel }); circle(x, y, r, { color: inkA(0.5), w: 1.5 });
  G.save(); G.beginPath(); G.arc(x, y, r - 1.5, 0, TAU); G.clip();
  /* the switch's footprint and its plunger cap (turned 90°: 2.1 mm across, 1.5 mm along), seen through the trigger */
  G.setLineDash([6, 5]); rrPath(x - 2.9 * s, y - 6.4 * s, 5.8 * s, 12.8 * s, 0.6 * s); G.strokeStyle = inkA(0.55); G.lineWidth = 1.5; G.stroke(); G.setLineDash([]);
  rrPath(x - 1.05 * s, y - 2.0 * s - 0.75 * s, 2.1 * s, 1.5 * s, 0.4 * s); G.fillStyle = inkA(0.6); G.fill();
  /* the plane the GT01's tilt lies in: fore-aft through the plunger */
  line(x, y - r, x, y + r, { color: inkA(0.25), w: 1.5, dash: [3, 6] });
  /* the foot's swing in plan: back (down on screen), turned by the lean; its across part in red */
  const L = r * 0.66 * k, ang = Math.PI / 2 + lean * (o.side || -1), ex = x + Math.cos(ang) * L, ey = y - 2.0 * s + Math.sin(ang) * L, py = y - 2.0 * s;
  if (k > 0.02) {
    arrow(x, py, x, py + Math.sin(ang) * L, { color: o.col || C.ink, w: 3.5, hs: 13 });
    if (Math.abs(lean) > 0.005) { line(x, py + Math.sin(ang) * L, ex, ey, { color: C.red, w: 4 }); arrow(x, py, ex, ey, { color: C.red, w: 2, hs: 11, alpha: 0.75 }); }
  }
  G.restore();
  G.restore();
  return { tip: [ex, ey], cross: [(x + ex) / 2, ey] };
}

/* ============================== 2. b02_cutouts: Straight rear cutouts (#17, #18) ==============================
   His most important idea in this chapter (F33.5), the old slide his worst rated (3/10: "you can hardly tell which part of
   the mouse you're looking at", "the benefit to the player isn't really sold"). So: the whole mouse first, the cutout lit;
   one push-in to the left trigger; the bend line the spring takes, drawn on the trigger; the same two presses on the Sora's
   smile and on Theseus's straight cutout; what the switch and the finger get. */
const B02_CT = { press: { down: 0.16, hold: 0.55, up: 0.22 }, p1: 1.65, p2: 2.7, mo: [3.7, 0.95], p3: 4.85, p4: 5.9, v: 6.2, zP: B02.sw.z + 10, dx: 9 };
/** the overlay on the kit's top view, in its camera (mm): both triggers with the rear cutout blended k (1 smile .. 0
   straight), the body's outline restroked over them, the lit rear edge, then the left trigger's own drawing */
function b02_cutOverlay(k, o = {}) {
  const V = msView('top'), bodyF = TH ? '#FFFFFF' : '#1A1B1E', ink = TH ? '17,17,17' : '243,242,238';
  G.save(); G.clip(V.out);
  /* cover the kit's straight rear line where the smile leaves it, then lay both triggers over the body */
  G.fillStyle = bodyF; G.fillRect(-34, -14 * b02_K().y, 68, 12.4);
  for (const m of [1, -1]) { b02_pathOf(b02_trigOutline(k).map(([x, z]) => b02_P(x * m, z))); G.fillStyle = bodyF; G.fill(); }
  G.restore();
  G.save(); G.lineJoin = 'round'; G.lineCap = 'round';
  /* the split between the triggers (the wheel sits in it) and each trigger's inner edges, as the kit draws its key lines */
  for (const m of [1, -1]) { b02_pathOf(b02_trigOutline(k).map(([x, z]) => b02_P(x * m, z))); G.save(); G.clip(V.out); G.strokeStyle = `rgba(${ink},${TH ? 0.42 : 0.4})`; G.lineWidth = lw(1.3); G.stroke(); G.restore(); }
  /* the rear cutout across both triggers, lit */
  for (const m of [1, -1]) { b02_pathOf(b02_trigRear(k).map(([x, z]) => b02_P(x * m, z)), false); G.strokeStyle = o.lit || C.second; G.lineWidth = lw(o.litW || 3.2); G.globalAlpha = o.litA == null ? 1 : o.litA; G.stroke(); G.globalAlpha = 1; }
  G.strokeStyle = `rgba(${ink},${TH ? 0.78 : 0.7})`; G.lineWidth = lw(2); G.stroke(V.out);
  G.restore();
}
/** the classroom version: a sheet with a flap folded along a crease, in a small 3D view. slant (radians): the crease's lean
   off square; f (0..1): how far the flap has folded (to 160°). The flap's far corner traces its path: straight back over a
   square crease, swung off to the side over a slanted one. (cx, cy) the sheet's centre on the stage, s px per mm */
function b02_fold(cx, cy, s, slant, f, o = {}) {
  const cam = b02_cam3([0, 0, 0], -0.12, 1.12, s, cx, cy), W2 = 14, L0 = -20, L1 = 20, cz = 0;
  const ax = [Math.cos(slant), 0, Math.sin(slant)], A = [0, 0, cz];
  const creaseZ = x => cz + Math.tan(slant) * x;
  const base = [[-W2, L0], [W2, L0], [W2, creaseZ(W2)], [-W2, creaseZ(-W2)]].map(([x, z]) => cam.P([x, 0, z]));
  const flap0 = [[-W2, creaseZ(-W2)], [W2, creaseZ(W2)], [W2, L1], [-W2, L1]];
  let K = ax; if (b02_rot([0, 0, cz + 5], A, K, 0.2)[1] < 0) K = K.map(v => -v);
  const ang = 2.8 * clamp(f), flap = flap0.map(([x, z]) => cam.P(b02_rot([x, 0, z], A, K, ang)));
  const paperC = TH ? '#FFFFFF' : '#26272B', backC = TH ? '#E3E2DC' : '#34353A', ed = inkA(TH ? 0.5 : 0.45);
  G.save(); G.globalAlpha *= (o.alpha == null ? 1 : o.alpha); G.lineJoin = 'round';
  b02_pathOf(base); G.fillStyle = paperC; G.fill(); G.strokeStyle = ed; G.lineWidth = 1.5; G.stroke();
  /* the crease */
  const c0 = cam.P([-W2, 0, creaseZ(-W2)]), c1 = cam.P([W2, 0, creaseZ(W2)]);
  line(c0[0], c0[1], c1[0], c1[1], { color: o.col || C.ink, w: 2.5, dash: [6, 4] });
  /* where the flap started, faint; where its far corner goes */
  b02_pathOf(flap0.map(([x, z]) => cam.P([x, 0, z]))); G.setLineDash([4, 4]); G.strokeStyle = inkA(0.3); G.lineWidth = 1.2; G.stroke(); G.setLineDash([]);
  const facing = ang > Math.PI / 2;
  b02_pathOf(flap); G.fillStyle = facing ? backC : paperC; G.fill(); G.strokeStyle = ed; G.lineWidth = 1.5; G.stroke();
  const tip = cam.P(b02_rot([0, 0, L1], A, K, ang));
  circle(tip[0], tip[1], 5, { fill: o.col || C.ink });
  G.restore();
  return { tip, crease: [c0, c1] };
}
/** a click force at a press point: the value, and once Theseus's press lands the rival's value struck before it (F16.1) */
function b02_gfTag(x, y, a, val, o = {}) {
  if (a <= 0.003) return;
  const al = o.align || 'left', runs = [];
  if (o.before != null) runs.push({ s: o.before, role: 'num', size: 26, weight: 700, color: C.faint, tnum: true }, { s: '→', font: 'disp', size: 24, weight: 700, color: C.faint, gap: 10 });
  runs.push({ s: val, role: 'num', size: o.size || 34, weight: 800, color: o.col || C.ink, tnum: true, gap: o.before != null ? 10 : 0 }, { s: 'gf', role: 'label', size: 20, color: C.mute, gap: 6 });
  const r = rich(runs, x, y, { alpha: a, align: al });
  if (o.before != null) { const w0 = tw(o.before, { role: 'num', size: 26, weight: 700, tnum: true }), x0 = r.x0; line(x0 - 2, y - 9, x0 + w0 + 2, y - 9, { color: C.mute, w: 2.2, alpha: a }); }
  return r;
}
S({
  id: 'b02_cutouts', ch: 'click', theme: 'paper', title: 'Straight rear cutouts', settle: 10.5, ideas: [17, 18],
  replaces: ['cutouts'],
  src: ['b02_scan', 'clk_gt01', 'clk_brock', 'b02_tpuV3'],
  answers: [
    ['everything here is among the most important concepts', 'It leads the chapter right after the card, with the most care: the whole mouse, one push-in, the same two presses on the smile and on the straight cutout, and the numbers that come out of the hinge'],
    ['but probably has the worst graphic design in the entire deck', 'Rebuilt from nothing: the abstract grey blocks are gone; the trigger is the trigger, traced from the 3D model, and it is pressed by a finger'],
    ['it\'s super unintuitive to understand because you can hardly tell which part of the mouse you\'re looking at it\'s so abstract', 'It opens on the whole simplified mouse from above with the rear cutout lit, pushes in to the left trigger in one move and keeps a locator in the corner; the spring, the switch and the bend line are drawn through the shell where they really sit'],
    ['also the benefit to the player isn\'t really sold', 'Sold twice and shown: the click weighs the same wherever your finger lands across the button (47 or 52 gf on the smile, 49 gf either way straight), and none of the press goes sideways into the switch (8.0 % → 0 %, the headline)'],
    ['(F33.5) important ideas executed wrong get vastly improved, with more importance', 'It is this chapter\'s lead slide and its checkpoint'],
    ['(#18) the tensioner aligned with the switch', 'Each spring is drawn centred on its switch\'s line, and the caption says so; the Sora\'s own spring position is not public, so no before number is claimed for it']
  ],
  sfx: [[pressCross(B02_CT.p1, B02_CT.press, 0.7), 'click'], [pressCross(B02_CT.p2, B02_CT.press, 0.7), 'click'], [pressCross(B02_CT.p3, B02_CT.press, 0.7), 'click'], [pressCross(B02_CT.p4, B02_CT.press, 0.7), 'click']],
  draw: t => {
    const Q = B02_CT, H1 = b02_hinge(1);
    header(t, 'Straight rear cutouts');
    captions(t, [[0.5, 'The spring under each trigger bends along the rear cutout. Most mice curve that cutout into a smile, as on the Sora V2.'],
      [Q.p1 - 0.1, 'So the trigger turns about a line 13° off square: part of every press swings the switch sideways, and the outer edge clicks heavier.'],
      [Q.mo[0], 'Cut it straight, with each spring centred on its own switch, and the trigger turns square to the press. Razer did the same from the Viper V2 Pro to the V3 Pro.'],
      [Q.v + 0.4, 'Nothing goes sideways, and the click weighs the same wherever your finger lands across the button.']]);
    const km = 1 - ep(t, Q.mo[0], Q.mo[0] + Q.mo[1], E.io3), lean = H1.lean * km, rival = km > 0.5;
    const prs = [Q.p1, Q.p2, Q.p3, Q.p4].map(p => pressCurve(t, p, Q.press)), dNow = Math.max(...prs);
    const pts = [[-B02.sw.x + Q.dx, Q.zP], [-B02.sw.x - Q.dx, Q.zP]];
    const xr = ep(t, 1.05, 1.45), ax = ep(t, 0.3, 0.7), litC = rival ? C.second : C.hero, axC = rival ? C.red : C.hero;
    const box = [80, 270, 860, 650];
    let A = null;
    const est = establish(t, 0, box, { view: 'top', focus: [-34, -60.5, 44, 66], hold: 0.4, dur: 1.0, locator: 'tl', locW: 64,
      draw: () => {
        b02_cutOverlay(km, { lit: litC });
        G.save(); G.clip(msView('top').out);
        A = b02_trigTopMM({ k: km, press: dNow, field: 1, xray: xr, axis: ax, lit: litC, axisCol: axC, fill: rgba(litC, TH ? 0.07 : 0.1), edge: inkA(0.001) });
        G.restore();
      } });
    /* the lean, measured against square at the spring: a dashed square reference, an arc to the bend line, the angle */
    if (A && A.bend && xr > 0) {
      const [b0, b1] = A.bend, c = [(b0[0] + b1[0]) / 2, (b0[1] + b1[1]) / 2], R = 64;
      let aOut = Math.atan2(b1[1] - c[1], b1[0] - c[0]); if (aOut < 0) aOut += TAU;
      line(c[0] - R * 1.3, c[1], c[0] - 8, c[1], { color: C.faint, w: 1.5, dash: [4, 5], alpha: xr });
      if (aOut - Math.PI > 0.004) { G.save(); G.globalAlpha = xr; G.beginPath(); G.arc(c[0], c[1], R, Math.PI, aOut, false); G.strokeStyle = C.red; G.lineWidth = 2.5; G.stroke(); G.restore(); }
      const deg = Math.abs(lean) * 180 / Math.PI;
      const lxx = Math.min(c[0] - R * 1.45, est.P(-msHalfW(-6.5), -6.5)[0] - 18);
      text(deg.toFixed(1) + '°', lxx, c[1] + 8, { role: 'num', size: 34, weight: 800, color: rival ? C.red : C.heroText, align: 'right', alpha: xr });
      text(rival ? 'Bend line, off square' : 'Bend line, square', lxx, c[1] + 38, { role: 'label', size: 21, color: C.mute, align: 'right', alpha: xr, maxW: 300 });
    }
    /* name what the x-ray shows: the spring on the switch's line, the switch under the trigger */
    if (A && A.bend && A.sw) {
      const bc = [(A.bend[0][0] + A.bend[1][0]) / 2, (A.bend[0][1] + A.bend[1][1]) / 2];
      callout(t, 1.2, [bc[0] + 30, bc[1] + 14], 'The spring', { to: [bc[0] + 150, bc[1] + 92], side: 'r', color: C.ink2, tcolor: C.ink2, alpha: 1 - ep(t, Q.v - 0.3, Q.v) * 0 });
    }
    /* the finger: arrives over the inner point, presses, moves out, presses; lifts for the cut to straighten; again */
    if (A && A.at) {
      const P1 = A.at(...pts[0]), P2 = A.at(...pts[1]);
      const fx = kf(t, [[0.9, [P1[0] + 60, P1[1] + 260]], [Q.p1 - 0.05, P1], [Q.p2 - 0.45, P1], [Q.p2 - 0.05, P2], [Q.mo[0] + 0.1, P2], [Q.mo[0] + 0.7, [P2[0] - 30, P2[1] + 200]], [Q.p3 - 0.5, [P1[0] + 40, P1[1] + 160]], [Q.p3 - 0.05, P1], [Q.p4 - 0.45, P1], [Q.p4 - 0.05, P2]], E.cam);
      const fa = ep(t, 0.9, 1.2) * (1 - 0.65 * ep(t, Q.mo[0] + 0.1, Q.mo[0] + 0.5)) + 0.65 * ep(t, Q.p3 - 0.7, Q.p3 - 0.3);
      finger(fx[0], fx[1], -Math.PI / 2 - 0.12, { s: est.s, press: dNow, view: 'top', alpha: clamp(fa), len: 22 });
      /* the click force at each point, once its press lands */
      const gf = pts.map(([x, z]) => [b02_clickGf2(1, x, z), b02_clickGf2(0, x, z)]);
      const kA = [Q.p1, Q.p2].map(p => ep(t, p + 0.15, p + 0.4)), kB = [Q.p3, Q.p4].map(p => ep(t, p + 0.15, p + 0.4));
      [P1, P2].forEach((pp, j) => {
        const right = j === 0, x = pp[0] + (right ? 150 : -96), y = pp[1] + (right ? 12 : 120);
        if (kB[j] > 0) b02_gfTag(x, y, kB[j], gf[j][1].toFixed(1), { before: gf[j][0].toFixed(1), col: C.heroText, align: right ? 'left' : 'right' });
        else b02_gfTag(x, y, kA[j] * (1 - ep(t, Q.mo[0], Q.mo[0] + 0.4) * 0), gf[j][0].toFixed(1), { col: C.ink, align: right ? 'left' : 'right' });
        if (kA[j] > 0) text(right ? 'Inner side' : 'Outer side', x, y + 32, { role: 'label', size: 21, color: C.mute, align: right ? 'left' : 'right', alpha: Math.max(kA[j], kB[j]) });
      });
    }
    /* the classroom version, top right: fold a page on a square crease and on a slanted one */
    { const r = demoPanel(t, 0.15, [1320, 280, 520, 340], { label: 'The classroom version' }), kf0 = ep(t, 0.45, 1.45, E.io3), ka = ep(t, 0.3, 0.6);
      const half = r[2] / 2;
      b02_fold(r[0] + half * 0.5, r[1] + r[3] * 0.44, 4.0, 0, kf0, { alpha: ka, col: C.ink });
      b02_fold(r[0] + half * 1.5, r[1] + r[3] * 0.44, 4.0, 0.42, kf0, { alpha: ka, col: C.red });
      text('Square crease', r[0] + half * 0.5, r[1] + r[3] - 22, { role: 'label', size: 21, color: C.ink2, align: 'center', alpha: ka });
      text('Lands on itself', r[0] + half * 0.5, r[1] + r[3] + 6, { role: 'small', size: 22, weight: 600, color: C.mute, align: 'center', alpha: ka });
      text('Slanted crease', r[0] + half * 1.5, r[1] + r[3] - 22, { role: 'label', size: 21, color: C.red, align: 'center', alpha: ka });
      text('Swings to the side', r[0] + half * 1.5, r[1] + r[3] + 6, { role: 'small', size: 22, weight: 600, color: C.mute, align: 'center', alpha: ka }); }
    /* right: at the switch, from above */
    const lx = 1120, ly = 450, lr = 124, kl = ep(t, Q.p1 - 0.3, Q.p1 + 0.2);
    if (A && A.post && kl > 0) { const sp = A.post; line(sp[0] + 12, sp[1], lx - lr * 0.98, ly, { color: C.faint, w: 1.2, dash: [4, 4], alpha: kl }); }
    text('At the switch', lx, ly - lr - 22, { role: 'label', size: 21, color: C.mute, align: 'center', alpha: kl });
    const swing = Math.max(dNow, ep(t, Q.p1, Q.p1 + 0.3) * 0.55 * (1 - ep(t, Q.mo[0] - 0.2, Q.mo[0])) + ep(t, Q.p3, Q.p3 + 0.3) * 0.55);
    b02_swingLoupe(t, lx, ly, lr, { lean, k: clamp(swing), a: kl, col: rival ? C.ink : C.hero, side: -1 });
    const share = b02_sideShare(lean) * 100;
    if (kl > 0) {
      text(share.toFixed(1) + '%', lx, ly + lr + 50, { role: 'num', size: 34, weight: 800, color: share > 0.05 ? C.red : C.heroText, align: 'center', alpha: kl });
      text('of its travel, sideways', lx, ly + lr + 80, { role: 'label', size: 21, color: C.mute, align: 'center', alpha: kl });
    }
    /* what the player gets, in words, beside the headline */
    { const g0 = b02_clickGf2(0, -B02.sw.x + Q.dx, Q.zP);
      noteBox(t, Q.v + 1.3, 1480, 650, 360, { label: 'What you feel', value: null, head: 'The same click, either side', body: `${g0.toFixed(1)} gf, a little under an egg's weight, wherever your finger lands across it. None of the press goes sideways.` }); }
    /* the verdict: what the switch gets, then what the finger gets */
    verdict(t, Q.v, 980, 890, { from: (b02_sideShare(H1.lean) * 100).toFixed(1), to: '0.0', unit: '%', label: 'Sideways push', better: 'lower', who: ['Sora V2', 'Theseus'], size: 112, maxW: 480 });
    source(t, 'Derived. The Sora V2\'s rear cutout from Brock\'s scan (the 3D model); a 10 mm spring on the switch\'s line, 16 mm out (board plan 5); the same GT01 (55 gf) and bridge (7.7 gf) on both; presses 10 mm ahead of the switch, ' + B02_CT.dx + ' mm either side of its line.', { t0: 1.6, maxW: 1360 });
  }
});

/* ============================== 4. b02_front: A flat front: no wobble (#46, #47) ==============================
   His note on clk_front, left half: "the left needs to compare to what happens when you don't have a straight front, like
   when there is heavy front comfort grooves, and how that can cause wobble side to side, because the front will never reach
   the bottom in the same spot at the same, and where it reaches the bottom first will depend on where you press it, create
   wobble which makes the parts feel cheap and wear out faster". Not a section: the front of the mouse, head-on. */
const B02_FT = { press: { down: 0.18, hold: 0.62, up: 0.24 }, p1: 1.75, p2: 2.95, mo: [4.05, 0.9], p3: 5.15, p4: 6.2, v: 6.7, u: [4.5, 15.5] };
/** the classroom version: a rocker (a half-round bottom) and a flat block on a floor, pressed on one side, then the other.
   The rocker rolls onto a new spot each time (rolling without slipping: its centre moves R·φ); the block stays put */
function b02_rockers(t, r, roll, pressAt, a) {
  const [x, y, w, h] = r, fy = y + h - 30, s = Math.min(w / 260, h / 150), R = 34 * s, c1 = x + w * 0.28, c2 = x + w * 0.74;
  G.save(); G.globalAlpha *= a;
  line(x + 10, fy, x + w - 10, fy, { color: inkA(0.45), w: 2 });
  const body = TH ? '#FFFFFF' : '#2A2B30', ed = inkA(TH ? 0.6 : 0.55);
  /* the rocker */
  { const cx = c1 - R * roll, cy = fy - R; G.save(); G.translate(cx, cy); G.rotate(roll);
    G.beginPath(); G.moveTo(-R, 0); G.arc(0, 0, R, Math.PI, 0, true); G.lineTo(R, -R * 1.1); G.lineTo(-R, -R * 1.1); G.closePath(); G.fillStyle = body; G.fill(); G.strokeStyle = ed; G.lineWidth = 2; G.stroke(); G.restore();
    circle(cx, fy, 5, { fill: C.red }); }
  /* the flat block */
  { const bw = R * 2, bh = R * 2.1; rr(c2 - bw / 2, fy - bh, bw, bh, 4, body, ed, 2); line(c2 - bw / 2 + 3, fy, c2 + bw / 2 - 3, fy, { color: C.hero, w: 4 }); }
  /* the press, on one side or the other, the same on both */
  if (pressAt) { const [side, k] = pressAt; for (const [cx, top] of [[c1, fy - R * 2.1], [c2, fy - R * 2.1]]) { const px = cx + side * R * 0.7; arrow(px, top - 48, px, top - 6, { color: C.ink, w: 3, hs: 11, alpha: k }); } }
  G.restore();
  return { c1, c2, fy, R };
}
/* DEV PREVIEW (remove before handing in) */
S({ id: 'b02_dev', ch: 'click', theme: 'paper', title: 'dev', settle: 4, draw: t => {
  header(t, 'b02 flush preview');
  [['wall', 0, 160], ['ceiling', 0, 760], ['ceiling', 1, 1360]].forEach(([face, wall, x0]) => {
    const pr = ep(t, 1, 2);
    part(x0 - 12 * 26, 860, 26, () => {
      const r = b02_flushMM({ face, wall, press: pr });
      const surf = u => { if (face === 'wall') return u < 28.4 ? r.top(Math.min(u, 27.2)) : 0; return u < B02_FL.uE ? r.top(u) : u < B02_FL.uE + B02_FL.gap ? Math.min(r.top(B02_FL.uE), r.wTop) - 3 : r.wTop; };
      b02_fingerEndMM({ cx: face === 'wall' ? 30.5 : 24.6, base: face === 'wall' ? 12 : r.top(24) + 0.0, sink: 0.6, surf, tilt: face === 'wall' ? -1.2 : 0 });
    });
    text(face + ' wall ' + wall, x0, 330, { role: 'label', align: 'center' });
  });
} });
