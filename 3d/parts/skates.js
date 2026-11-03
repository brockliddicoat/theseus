// Dot skates (#10): Ø6.5 mm, 0.65 mm total (Brock: "0.65mm is the optimal skate height"), POM (default, #8)
// or PTFE glide disc on a PORON foam core with 3M transfer tape (Brock: "skates have 3m transfer tape and poron
// foam core"). Layer split is representative: glide 0.38 + tape 0.05 + PORON 0.17 + tape 0.05 = 0.65 mm.
// Frame: origin at the centre of the GLIDE face at Y = 0 (the pad); the stack rises to Y = 0.65.
// Set: 8 skates, 2 per corner, for a ~119 × 62 mm base, clear of screws (#52).
import * as THREE from 'three';
import { partMaterials } from './lib/materials.js';
import { lathe, arc, extrude, meshOf, disposeTree, clamp01, lerp, rng } from './lib/geom.js';

export const DOT_SKATE_SPEC = {
  name: 'Dot skate', label: 'representative (stack split); diameter/height per Brock',
  diameter: 6.5, height: 0.65,
  layers: [
    { name: 'glide', t: 0.38, material: 'POM (default) or PTFE' },
    { name: 'tapeLower', t: 0.05, material: '3M transfer tape (adhesive only)' },
    { name: 'poron', t: 0.17, material: 'PORON urethane foam' },
    { name: 'tapeUpper', t: 0.05, material: '3M transfer tape' },
  ],
  perCorner: 2, count: 8,
  sources: { brock: '#8 POM skates, #10 two dots per corner, "0.65mm is the optimal skate height", "3m transfer tape and poron foam core" [PR/CA]' },
};

// Base outline at pad level, derived from Brock's Sora V3 scan (convex hull of vertices with Y < 1.2 mm,
// resampled to 64 points). Placeholder for the shell's real base outline. [DV]
export const SORA_FOOTPRINT = [[-28.41,-24.84],[-28.2,-29.29],[-27.56,-33.7],[-25.98,-37.87],[-23.87,-41.8],[-21.19,-45.36],[-17.96,-48.42],[-14.32,-51],[-10.31,-52.93],[-6.03,-54.17],[-1.62,-54.79],[2.84,-54.72],[7.23,-53.98],[11.41,-52.47],[15.3,-50.31],[18.85,-47.61],[21.9,-44.36],[24.39,-40.67],[26.42,-36.7],[27.75,-32.45],[28.36,-28.04],[28.36,-23.58],[28.14,-19.12],[27.92,-14.67],[27.69,-10.21],[27.47,-5.75],[27.24,-1.3],[27.02,3.16],[26.79,7.62],[26.57,12.08],[26.34,16.53],[26.12,20.99],[25.9,25.45],[25.67,29.9],[25.45,34.36],[25.18,38.81],[24.35,43.18],[22.32,47.11],[18.82,49.82],[14.74,51.6],[10.48,52.92],[6.09,53.7],[1.65,54.05],[-2.81,54.02],[-7.23,53.44],[-11.6,52.52],[-15.84,51.13],[-19.84,49.18],[-22.97,46.09],[-24.61,41.97],[-25.15,37.55],[-25.42,33.09],[-25.65,28.63],[-25.88,24.18],[-26.11,19.72],[-26.34,15.26],[-26.57,10.81],[-26.8,6.35],[-27.03,1.9],[-27.26,-2.56],[-27.49,-7.02],[-27.72,-11.47],[-27.95,-15.93],[-28.18,-20.39]];
// Stand-in screw positions (X, Z) until the shell publishes its own: inboard of every skate pair.
export const STANDIN_SCREWS = [[-13.5, -31], [13.5, -31], [-12.5, 30], [12.5, 30]];

let _foamTex = null;
function foamBump() {
  // deterministic cell-noise bump for the PORON edge (tiny, shared, never disposed by builders)
  if (_foamTex) return _foamTex;
  const n = 128, d = new Uint8Array(n * n * 4), r = rng(7);
  const pts = Array.from({ length: 90 }, () => [r() * n, r() * n]);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    let m = 1e9;
    for (const [px, py] of pts) {
      for (const ox of [-n, 0, n]) for (const oy of [-n, 0, n]) { const dx = x - px - ox, dy = y - py - oy; m = Math.min(m, dx * dx + dy * dy); }
    }
    const v = Math.min(255, Math.sqrt(m) * 26);
    const i = (y * n + x) * 4; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255;
  }
  _foamTex = new THREE.DataTexture(d, n, n); _foamTex.wrapS = _foamTex.wrapT = THREE.RepeatWrapping; _foamTex.needsUpdate = true;
  return _foamTex;
}

function skateGeometries(o) {
  const R = (o.diameter ?? 6.5) / 2, H = o.height ?? 0.65;
  const scale = H / 0.65;
  const tG = 0.38 * scale, tT = 0.05 * scale, tP = 0.17 * scale, gap = 0.0015;
  const re = 0.2 * scale;                         // glide-edge radius (rounded leading edge)
  const glide = lathe([[0, 0], [R - re, 0], ...arc(R - re, re, re, -Math.PI / 2, 0, 8).slice(1), [R, tG - 0.04], [R - 0.04, tG], [0, tG]], { segments: 96, crease: 35 });
  const rI = R - 0.12;                            // tape and foam inset a hair from the glide disc edge
  const disc = (y0, t, r, c) => lathe([[0, y0], [r - c, y0], [r, y0 + c], [r, y0 + t - c], [r - c, y0 + t], [0, y0 + t]], { segments: 96, crease: 35 });
  const y1 = tG + gap, y2 = y1 + tT + gap, y3 = y2 + tP + gap;
  return {
    glide, tapeLower: disc(y1, tT - gap, rI, 0.008), poron: disc(y2, tP - gap, rI, 0.03), tapeUpper: disc(y3, tT - gap, rI, 0.008),
    levels: { glide: 0, tapeLower: y1, poron: y2, tapeUpper: y3 }, R, H,
  };
}

export function buildDotSkate(opts = {}) {
  const M = partMaterials(opts.materials);
  const userMats = new Set(Object.values(opts.materials || {}));
  const own = new Set(Object.values(M).filter(m => !userMats.has(m)));
  const G = skateGeometries(opts);
  const glideMat = (opts.material || 'POM').toUpperCase() === 'PTFE' ? M.ptfe : M.pom;
  M.poron.bumpMap = foamBump(); M.poron.bumpScale = 0.6;
  const root = new THREE.Group(); root.name = 'DotSkate';
  const layers = {
    glide: meshOf(G.glide, glideMat, 'glide'),
    tapeLower: meshOf(G.tapeLower, M.adhesive, 'tapeLower'),
    poron: meshOf(G.poron, M.poron, 'poron'),
    tapeUpper: meshOf(G.tapeUpper, M.adhesive, 'tapeUpper'),
  };
  for (const m of Object.values(layers)) root.add(m);
  root.setExplode = (k) => {
    k = clamp01(k);
    layers.tapeLower.position.y = 0.9 * k; layers.poron.position.y = 1.8 * k; layers.tapeUpper.position.y = 2.7 * k;
  };
  root.userData.spec = { ...DOT_SKATE_SPEC, material: glideMat === M.ptfe ? 'PTFE' : 'POM' };
  root.userData.parts = layers;
  root.dispose = () => { M.poron.bumpMap = null; disposeTree(root, userMats); for (const m of own) m.dispose?.(); };
  return root;
}

/** Inset a convex CCW/CW polygon by d (miter offset). */
function insetPolygon(poly, d) {
  const n = poly.length; let area = 0;
  for (let i = 0; i < n; i++) { const [x0, z0] = poly[i], [x1, z1] = poly[(i + 1) % n]; area += x0 * z1 - x1 * z0; }
  const s = area > 0 ? 1 : -1;                      // +1: CCW in (x, z)
  return poly.map((p, i) => {
    const a = poly[(i - 1 + n) % n], c = poly[(i + 1) % n];
    const e1 = [p[0] - a[0], p[1] - a[1]], e2 = [c[0] - p[0], c[1] - p[1]];
    const l1 = Math.hypot(...e1), l2 = Math.hypot(...e2);
    const n1 = [-e1[1] / l1 * s, e1[0] / l1 * s], n2 = [-e2[1] / l2 * s, e2[0] / l2 * s];   // inward
    let m = [n1[0] + n2[0], n1[1] + n2[1]]; const ml = Math.hypot(...m); m = [m[0] / ml, m[1] / ml];
    const k = d / Math.max(0.3, m[0] * n1[0] + m[1] * n1[1]);
    return [p[0] + m[0] * k, p[1] + m[1] * k];
  });
}
function pointAt(poly, cum, L, s) {
  s = ((s % L) + L) % L;
  let i = 0; while (i < cum.length - 1 && cum[i + 1] < s) i++;
  const a = poly[i], b = poly[(i + 1) % poly.length], t = (s - cum[i]) / ((cum[i + 1] - cum[i]) || 1);
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
}

/**
 * Eight positions [x, z] (two per corner) on a curve inset from the base outline, clear of screws.
 * opts: footprint ([[x,z]...], default SORA_FOOTPRINT), screws ([[x,z]...]), inset (centre-to-edge, 4.6),
 *       spacing (centre-to-centre within a pair, 7.6), clearance (edge gap to a screw head of Ø4, 1.5)
 */
export function layoutDotSkates(opts = {}) {
  const fp = opts.footprint || SORA_FOOTPRINT, screws = opts.screws || [];
  const inset = opts.inset ?? 4.6, spacing = opts.spacing ?? 7.6, clr = opts.clearance ?? 1.5;
  const rSk = 3.25, rHead = 2.0;
  const poly = insetPolygon(fp, inset);
  const cum = [0]; for (let i = 0; i < poly.length; i++) cum.push(cum[i] + Math.hypot(poly[(i + 1) % poly.length][0] - poly[i][0], poly[(i + 1) % poly.length][1] - poly[i][1]));
  const L = cum[cum.length - 1];
  let W = 0, H = 0; for (const [x, z] of fp) { W = Math.max(W, Math.abs(x)); H = Math.max(H, Math.abs(z)); }
  const out = [];
  for (const [sx, sz] of [[-1, 1], [1, 1], [-1, -1], [1, -1]]) {
    // corner apex: the inset point that maximises the normalised diagonal
    let best = -1e9, bi = 0;
    poly.forEach(([x, z], i) => { const v = sx * x / W + sz * z / H; if (v > best) { best = v; bi = i; } });
    const s0 = cum[bi];
    for (const side of [-1, 1]) {
      let s = s0 + side * spacing / 2, p = pointAt(poly, cum, L, s), guard = 0;
      const hits = (q) => screws.some(([x, z]) => Math.hypot(q[0] - x, q[1] - z) < rSk + rHead + clr);
      while (hits(p) && guard++ < 60) { s += side * 0.25; p = pointAt(poly, cum, L, s); }
      out.push([+p[0].toFixed(2), +p[1].toFixed(2)]);
    }
  }
  return out;
}

export function buildDotSkateSet(opts = {}) {
  const M = partMaterials(opts.materials);
  const userMats = new Set(Object.values(opts.materials || {}));
  const own = new Set(Object.values(M).filter(m => !userMats.has(m)));
  const fp = opts.footprint || SORA_FOOTPRINT;
  const screws = opts.screws || (opts.showFootprint === false ? [] : STANDIN_SCREWS);
  const pos = opts.positions || layoutDotSkates({ footprint: fp, screws });
  const G = skateGeometries(opts);
  const glideMat = (opts.material || 'POM').toUpperCase() === 'PTFE' ? M.ptfe : M.pom;
  M.poron.bumpMap = foamBump(); M.poron.bumpScale = 0.6;
  const root = new THREE.Group(); root.name = 'DotSkateSet';
  const skates = pos.map(([x, z], i) => {
    const g = new THREE.Group(); g.name = 'skate' + i; g.position.set(x, 0, z);
    g.add(meshOf(G.glide, glideMat, 'glide'), meshOf(G.tapeLower, M.adhesive, 'tapeLower'), meshOf(G.poron, M.poron, 'poron'), meshOf(G.tapeUpper, M.adhesive, 'tapeUpper'));
    root.add(g);
    return g;
  });
  let base = null;
  if (opts.showFootprint !== false) {
    // stand-in base plate: the outline at pad level, 1.6 mm thick, sitting on the skates (Y = 0.65)
    const sh = new THREE.Shape(fp.map(([x, z]) => new THREE.Vector2(x, -z)));
    const bg = extrude(sh, { depth: 1.6, back: { r: 0.5, s: 4 }, front: { r: 0.3, s: 2 }, curveSegments: 4 });
    bg.rotateX(-Math.PI / 2); bg.translate(0, G.H + 0.002, 0);
    base = meshOf(bg, M.cfpp, 'baseStandIn');
    root.add(base);
    // thin engraved guide rings around each skate (Brock: the ULX "just using a thin engraving to show where the
    // skates should be placed" instead of a recessed pocket)
    for (const [x, z] of pos) {
      const ring = meshOf(lathe([[3.55, G.H - 0.0], [3.55, G.H - 0.004], [3.68, G.H - 0.004], [3.68, G.H]], { segments: 96 }), M.pomBlack, 'guideRing');
      ring.position.set(x, 0.0005, z); root.add(ring);
    }
    // screw heads (stand-ins)
    for (const [x, z] of screws) {
      const h = meshOf(lathe([[0, 0], [2.0, 0], [2.0, 0.05], [0, 0.05]], { segments: 48 }), M.blackOxide, 'screwStandIn');
      h.position.set(x, G.H - 0.6, z); root.add(h);
    }
  }
  root.setExplode = (k) => { k = clamp01(k); skates.forEach((g, i) => { g.position.y = -(3 + 0.4 * i) * k; }); };
  root.userData.spec = { ...DOT_SKATE_SPEC, positions: pos, screws, footprint: opts.footprint ? 'custom' : 'SORA_FOOTPRINT (scan-derived stand-in)' };
  root.userData.parts = { skates, base };
  root.dispose = () => { M.poron.bumpMap = null; disposeTree(root, userMats); for (const m of own) m.dispose?.(); };
  return root;
}
