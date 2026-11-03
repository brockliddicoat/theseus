// usage: node tools/ids.js <abs html>   prints the deck's slide ids in order
const { chromium } = require('playwright');
const { pageUrl } = require('./serve.js');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage();
  await p.goto((await pageUrl(process.argv[2])) + '?cap=1&s=0&t=0.01');
  await p.waitForFunction('window.__ready === true', null, { timeout: 60000 }).catch(() => {});
  console.log(await p.evaluate(() => DECK.slides.map(s => s.id).join(' ')));
  await b.close();
})();
