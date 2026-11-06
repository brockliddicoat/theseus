const base = { __WALL: 0.4, __PW: 0.55, __SB: 0.5, __BH: 2.4, __SEATCUT: 0 };
const cases = {
  'as built': {},
  'B encoder walls 0.35': { __WALL: 0.35 },
  'C sensor board 0.4': { __SB: 0.4 },
  'D post walls 0.45': { __PW: 0.45 },
  'E foot 1.8 tall': { __BH: 1.8 },
  'F seat 0.6 shorter': { __SEATCUT: 0.6 },
  'B+C+D': { __WALL: 0.35, __SB: 0.4, __PW: 0.45 },
  'B+C+D+E+F': { __WALL: 0.35, __SB: 0.4, __PW: 0.45, __BH: 1.8, __SEATCUT: 0.6 },
};
const res = {};
let i = 0;
for (const [k, v] of Object.entries(cases)) {
  Object.assign(globalThis, base, v);
  const { buildScrollWheel } = await import('./sw_thin.js?c' + (i++));
  const sp = buildScrollWheel({ diameter: 22.74, width: 7.0, axleHeight: 12, encoderSide: 'left' }).userData.spec;
  res[k] = { enc: sp.encoderMass_g, sup: sp.supportMass_g, encParts: sp.encoderMassParts_g, supParts: sp.supportMassParts_g };
}
const b = res['as built'];
for (const [k, r] of Object.entries(res)) {
  const d = (r.enc - b.enc) + (r.sup - b.sup);
  console.log(k.padEnd(22), 'enc', r.enc.toFixed(3), 'sup', r.sup.toFixed(3), 'delta', d.toFixed(3), 'board', (5.684 + d).toFixed(3), JSON.stringify(r.supParts));
}
import fs from 'node:fs'; fs.writeFileSync('options.json', JSON.stringify(res, null, 1));
