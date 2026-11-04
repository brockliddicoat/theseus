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

/* binary assets ship as <name>.gz.b64.txt (artifact hosting serves no .glb or .bin; see integration/build.mjs).
   Every fetch of a .glb or .bin goes to that file instead and comes back as the original bytes, so GLTFLoader and the
   lattice's own loader work unchanged. Without DecompressionStream the fetch fails, and the deck draws the 2D twin. */
async function packedFetch(url, init) {
  const r = await nativeFetch(url + '.gz.b64.txt', init);
  if (!r.ok) return r;
  const s = await r.text(), bin = atob(s.trim()), u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  const raw = await new Response(new Blob([u8]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
  return new Response(raw, { status: 200, headers: { 'Content-Type': 'application/octet-stream' } });
}
const nativeFetch = typeof window !== 'undefined' && window.fetch ? window.fetch.bind(window) : null;
if (nativeFetch && !(typeof window !== 'undefined' && window.R3D_RAW_ASSETS)) {
  window.fetch = function (input, init) {
    const url = typeof input === 'string' ? input : input && input.url;
    if (url && /\.(glb|bin)(\?|#|$)/i.test(url) && !/^(data|blob):/.test(url)) return packedFetch(url.replace(/[?#].*$/, ''), init && init.signal ? { signal: init.signal } : undefined);
    return nativeFetch(input, init);
  };
}

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
      /* sections and cutaways (gt01, claw, screw, lattice) clip locally. The builders switch this on from onBeforeRender,
         which is too late for the first frame: its shaders compiled without clipping and the section caps failed
         ("'clippingPlanes' : undeclared identifier"). On from the start, every program compiles with it. */
      entry.studio.renderer.localClippingEnabled = true;
      entry.studio.ground.visible = true;
      Promise.resolve(f(entry.studio, THREE, mats(), R3D)).then(s => { entry.scene = s; entry.ready = true; entry.readyAt = performance.now(); })
        .catch(e => { entry.error = String(e && e.stack || e); console.error('R3D', key, entry.error); });
    } catch (e) { entry.error = String(e && e.stack || e); console.error('R3D', key, entry.error); }
    return entry;
  },
  ready(key, theme = 'paper') { const e = live.get(key + '|' + theme); return !!(e && e.ready); },
  /** when the scene became ready (performance.now()), or 0: the deck fades from the 2D twin to the render after it */
  readyAt(key, theme = 'paper') { const e = live.get(key + '|' + theme); return (e && e.readyAt) || 0; },
  /** true when the scene failed to build (the deck then draws its 2D twin) */
  failed(key, theme = 'paper') { const e = live.get(key + '|' + theme); return !!(e && e.error); },
  allReady() { for (const e of live.values()) if (!e.ready && !e.error) return false; return true; },
  /** Render scene `key` at slide time t into a w×h region (device pixels) and return the canvas, or null while loading.
     The canvas only grows: a shot smaller than it is drawn into its top-left w×h corner (viewport and scissor), and
     canvas.rect = [sx, sy, sw, sh] says where, so a slide that draws one scene into boxes of different sizes no longer
     reallocates the drawing buffer on every call (it did, several times a frame, which stutters on a real GPU). */
  render(key, t, state = {}, w = 1280, h = 720, theme = 'paper') {
    const e = R3D.prepare(key, theme);
    if (!e || !e.ready || e.error) return null;
    e.lastUse = performance.now();
    const r = e.studio.renderer, cam = e.studio.camera;
    if (w > e.w || h > e.h) { e.w = Math.max(e.w, w); e.h = Math.max(e.h, h); r.setSize(e.w, e.h, false); }
    if (cam.aspect !== w / h) { cam.aspect = w / h; cam.updateProjectionMatrix(); }
    const s = e.scene;
    if (s.update) s.update(state, t);
    if (s.camera) s.camera(cam, state, t); else if (!s._framed) { e.studio.frame(s.root, { view: state.view || 'threeQuarter' }); s._framed = true; }
    const y0 = e.h - h;                                   /* three.js viewports count from the bottom-left */
    r.setViewport(0, y0, w, h); r.setScissor(0, y0, w, h); r.setScissorTest(true);
    e.studio.render();
    r.setScissorTest(false);
    e.canvas.rect = [0, 0, w, h];
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
