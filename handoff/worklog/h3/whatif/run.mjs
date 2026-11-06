const cases = [[0.4, 0.55], [0.35, 0.55], [0.35, 0.45]];
for (const [w, pw] of cases) {
  globalThis.__WALL = w; globalThis.__PW = pw;
  const { buildScrollWheel } = await import('./sw_thin.js?' + w + '_' + pw);
  const sp = buildScrollWheel({ diameter: 22.74, width: 7.0, axleHeight: 12, encoderSide: 'left' }).userData.spec;
  console.log('wall', w, 'post wall', pw, 'encoder', sp.encoderMass_g, 'support', sp.supportMass_g, JSON.stringify(sp.encoderMassParts_g), JSON.stringify(sp.supportMassParts_g));
}
