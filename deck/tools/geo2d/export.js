// Export the deck's 3D scenes as raw geometry + per-state mesh poses, for the 2D drawings.
//   node export.js <dist/main.html> <outdir> [scene ...]
// For each scene: meshes (name path, material look), geometry (local positions + index, base64), and for every state
// sample the world matrix and visibility of each mesh. Python (silhouettes.py) turns this into 2D outlines.
const { chromium } = require('playwright');
const { pageUrl } = require('../serve.js');
const fs = require('fs');

const R = (k, vals, extra = {}) => vals.map(v => Object.assign({ [k]: v }, extra));
const SAMPLES = {
  shell: [{}, ...R('explode', [0.25, 0.5, 0.75, 1]), ...R('clickL', [1]), ...R('clickR', [1]), ...R('side0', [1]), ...R('side1', [1]), ...R('scroll', [0.2]), ...R('xray', [1])],
  'shell-sora': [{}, ...R('explode', [0.25, 0.5, 0.75, 1]), ...R('side0', [1]), ...R('side1', [1]), ...R('xray', [1])],
  pcb: [{}, ...R('explode', [0.25, 0.5, 0.75, 1]), ...R('pressL', [1]), ...R('pressR', [1]), ...R('xray', [1])],
  gt01: [{}, ...R('press', [0.5, 0.63, 1]), ...R('explode', [0.5, 1]), ...R('cutaway', [1])],
  wheel: [{}, ...R('scroll', [0.2]), ...R('explode', [0.5, 1]), ...R('xray', [1])],
  claw: [{}, ...R('insert', [0.25, 0.5, 0.75, 1]), ...R('explode', [1]), ...R('section', [1])],
  screw: [{}, ...R('drive', [0.25, 0.5, 0.75, 1]), ...R('explode', [1]), ...R('section', [1])],
  skates: [{}, ...R('explode', [0.25, 0.5, 0.75, 1])],
  battery: [{}, ...R('explode', [0.25, 0.5, 0.75, 1])],
};
(async () => {
  const [file, out, ...want] = process.argv.slice(2);
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 640, height: 360 } });
  p.on('pageerror', e => console.log('PAGEERR', e.message));
  await p.goto((await pageUrl(file)) + '?cap=1&s=thesis&t=0.01', { waitUntil: 'domcontentloaded', timeout: 240000 });
  await p.waitForFunction('window.__ready === true', null, { timeout: 240000 });
  for (const key of (want.length ? want : Object.keys(SAMPLES))) {
    const t0 = Date.now();
    const res = await p.evaluate(async ({ key, samples }) => {
      const e = R3D.prepare(key, 'paper');
      const tEnd = performance.now() + 180000;
      while (!e.ready && !e.error && performance.now() < tEnd) await new Promise(r => setTimeout(r, 200));
      if (!e.ready) return { error: e.error || 'timeout' };
      /* one render so lazy setters (applied on first frame) settle */
      R3D.render(key, 0, {}, 320, 180, 'paper');
      const s = e.scene, root = s.root, THREE = R3D.THREE;
      const b64 = arr => { const u = new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength); let str = ''; for (let i = 0; i < u.length; i += 32768) str += String.fromCharCode.apply(null, u.subarray(i, i + 32768)); return btoa(str); };
      const meshes = [], geos = {}, ids = new Map();
      root.updateMatrixWorld(true);
      const pathOf = o => { const n = []; let q = o; while (q && q !== root) { n.unshift(q.name || q.type); q = q.parent; } return n.join('/'); };
      root.traverse(o => {
        if (!(o.isMesh || o.isInstancedMesh) || !o.geometry || !o.geometry.attributes.position) return;
        const g = o.geometry, gid = g.uuid;
        if (!geos[gid]) {
          const pa = g.attributes.position; let pos;
          if (pa.isInterleavedBufferAttribute || pa.normalized || !(pa.array instanceof Float32Array)) { pos = new Float32Array(pa.count * 3); for (let i = 0; i < pa.count; i++) { pos[i * 3] = pa.getX(i); pos[i * 3 + 1] = pa.getY(i); pos[i * 3 + 2] = pa.getZ(i); } }
          else pos = pa.array.slice(0, pa.count * 3);
          const idx = g.index ? new Uint32Array(g.index.array) : null;
          geos[gid] = { pos: b64(pos), idx: idx ? b64(idx) : null, n: pa.count, dr: g.drawRange ? [g.drawRange.start, g.drawRange.count] : null };
        }
        const m = Array.isArray(o.material) ? o.material[0] : o.material;
        const col = m && m.color ? '#' + m.color.getHexString() : null;
        const id = meshes.length; ids.set(o, id);
        meshes.push({ id, name: o.name, path: pathOf(o), geo: gid, inst: o.isInstancedMesh ? o.count : 0, mat: m ? { type: m.type, name: m.name, color: col, opacity: m.opacity, transparent: m.transparent, metal: m.metalness, rough: m.roughness, trans: m.transmission || 0, side: m.side, wire: !!m.wireframe, clip: !!(m.clippingPlanes && m.clippingPlanes.length) } : null });
      });
      const snap = () => {
        root.updateMatrixWorld(true);
        const M = [], V = [], O = [];
        for (const [o, id] of ids) {
          let vis = true, q = o; while (q) { if (!q.visible) { vis = false; break; } q = q.parent; }
          M[id] = Array.from(o.matrixWorld.elements).map(v => +v.toFixed(5)); V[id] = vis;
          const m = Array.isArray(o.material) ? o.material[0] : o.material; O[id] = m ? [+(m.opacity).toFixed(3), m.clippingPlanes && m.clippingPlanes.length ? 1 : 0, m.color ? '#' + m.color.getHexString() : null] : [1, 0, null];
        }
        return { M, V, O };
      };
      const out = [];
      /* every key the samples touch, reset explicitly: the scenes keep whatever a call leaves out */
      const base = {};
      for (const st of samples) for (const k of Object.keys(st)) base[k] = 0;
      for (const st of samples) { const full = Object.assign({}, base, st); s.update(full, 0); R3D.render(key, 0, full, 320, 180, 'paper'); out.push(Object.assign({ state: st }, snap())); }
      s.update(base, 0); R3D.render(key, 0, base, 320, 180, 'paper');
      const box = new THREE.Box3().setFromObject(root), c = new THREE.Vector3(), sz = new THREE.Vector3(); box.getCenter(c); box.getSize(sz);
      return { key, meshes, geos, samples: out, frame: { center: c.toArray(), size: sz.toArray(), r: 0.5 * sz.length() } };
    }, { key, samples: SAMPLES[key] || [{}] });
    if (res.error) { console.log(key, 'ERROR', res.error.slice(0, 300)); continue; }
    fs.writeFileSync(`${out}/${key}.json`, JSON.stringify(res));
    console.log(key, res.meshes.length, 'meshes', Object.keys(res.geos).length, 'geos', 'r=' + res.frame.r.toFixed(2), (Date.now() - t0) + 'ms');
  }
  await b.close();
})();
