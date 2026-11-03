// R3D: the bridge between the canvas-drawn deck and the three.js assets.
// The deck draws on a 2D canvas every frame. A 3D shot is rendered into an offscreen WebGL canvas
// (one per active scene, created lazily, released when unused) and the deck composites it with drawImage,
// so 2D labels, callouts and transitions stay on top and in sync with the slide's own clock.
//
//   R3D.register('shell', async (studio, THREE, M) => ({ root, update(state, t) {...}, camera(state, t) {...} }));
//   // in a slide's draw(t):  view3D('shell', t, x, y, w, h, { explode: k, view: 'threeQuarter' })
//
// Everything is deterministic in t, so screenshots at a given time are repeatable.
import * as THREE from 'three';
import { createStudio, materials, VIEWS } from '../lib/studio.js';

const factories = new Map();   // key -> async (studio, THREE, M) => scene
const live = new Map();        // key -> { studio, scene, canvas, lastUse, ready, error }
const M = { cache: null };
let assetBase = '';            // where .glb/.bin files live (relative to the page)

function mats() { return M.cache || (M.cache = materials()); }

export const R3D = {
  THREE, VIEWS,
  setAssetBase(b) { assetBase = b; },
  assetUrl(name) { return assetBase + name; },
  register(key, factory) { factories.set(key, factory); },
  has(key) { return factories.has(key); },
  /** Start building a scene ahead of time (call on slide entry). */
  prepare(key, theme = 'paper') {
    const id = key + '|' + theme;
    if (live.has(id)) return live.get(id);
    const f = factories.get(key);
    if (!f) return null;
    const canvas = document.createElement('canvas');
    canvas.width = 16; canvas.height = 9;
    const entry = { canvas, studio: null, scene: null, lastUse: performance.now(), ready: false, error: null, w: 0, h: 0 };
    live.set(id, entry);
    try {
      entry.studio = createStudio({ canvas, theme, width: 16, height: 9, pixelRatio: 1, transparent: true });
      entry.studio.ground.visible = true;
      Promise.resolve(f(entry.studio, THREE, mats(), R3D)).then(s => { entry.scene = s; entry.ready = true; })
        .catch(e => { entry.error = String(e && e.stack || e); console.error('R3D', key, entry.error); });
    } catch (e) { entry.error = String(e && e.stack || e); console.error('R3D', key, entry.error); }
    return entry;
  },
  ready(key, theme = 'paper') { const e = live.get(key + '|' + theme); return !!(e && e.ready); },
  allReady() { for (const e of live.values()) if (!e.ready && !e.error) return false; return true; },
  /** Render scene `key` at slide time t into a w×h canvas (device pixels) and return it, or null while loading. */
  render(key, t, state = {}, w = 1280, h = 720, theme = 'paper') {
    const e = R3D.prepare(key, theme);
    if (!e || !e.ready || e.error) return null;
    e.lastUse = performance.now();
    if (e.w !== w || e.h !== h) { e.studio.resize(w, h); e.w = w; e.h = h; }
    const s = e.scene;
    if (s.update) s.update(state, t);
    if (s.camera) s.camera(e.studio.camera, state, t); else if (!s._framed) { e.studio.frame(s.root, { view: state.view || 'threeQuarter' }); s._framed = true; }
    e.studio.render();
    return e.canvas;
  },
  /** Free WebGL contexts not used for `ms` (call once per frame). */
  gc(ms = 8000) {
    const now = performance.now();
    for (const [id, e] of live) if (now - e.lastUse > ms && e.ready) {
      try { e.studio.renderer.dispose(); e.studio.renderer.forceContextLoss(); } catch (err) {}
      live.delete(id);
    }
  },
};

if (typeof window !== 'undefined') window.R3D = R3D;
export default R3D;
