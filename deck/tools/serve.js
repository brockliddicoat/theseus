// Serve a built deck over http so it can fetch its own files (assets/*.glb for the 3D shots).
// The deck tools call pageUrl(file) instead of 'file://' + file:
//   const { pageUrl } = require('./serve.js');  const base = await pageUrl('/abs/path/dist/main.html');  p.goto(base + '?cap=1&s=...')
const http = require('http');
const fs = require('fs');
const path = require('path');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.json': 'application/json', '.glb': 'model/gltf-binary', '.bin': 'application/octet-stream', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2' };
const servers = new Map();
function serveDir(dir) {
  if (servers.has(dir)) return servers.get(dir);
  const p = new Promise(resolve => {
    const srv = http.createServer((req, res) => {
      const rel = decodeURIComponent(req.url.split('?')[0].split('#')[0]);
      const f = path.join(dir, rel);
      if (!f.startsWith(dir)) { res.writeHead(403); return res.end(); }
      fs.readFile(f, (err, buf) => {
        if (err) { res.writeHead(404); return res.end('404'); }
        res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' });
        res.end(buf);
      });
    });
    srv.listen(0, '127.0.0.1', () => { srv.unref(); resolve(`http://127.0.0.1:${srv.address().port}`); });
  });
  servers.set(dir, p);
  return p;
}
async function pageUrl(file) {
  const abs = path.resolve(file);
  const origin = await serveDir(path.dirname(abs));
  return origin + '/' + path.basename(abs);
}
module.exports = { pageUrl, serveDir };
