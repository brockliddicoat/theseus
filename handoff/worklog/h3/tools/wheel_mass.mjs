// H3: the wheel's encoder and support grams as drawn (3d/parts/scrollwheel.js's own spec), written for mass.py.
//   node wheel_mass.mjs [--write]   (also prints the old framed encoder for comparison)
import fs from 'node:fs';
import { buildScrollWheel } from '/home/claude/theseus/3d/parts/scrollwheel.js';
const now = buildScrollWheel({ diameter: 22.74, width: 7.0, axleHeight: 12, encoderSide: 'left' }).userData.spec;
const old = buildScrollWheel({ diameter: 22.74, width: 7.0, axleHeight: 12, encoderSide: 'left', encoderFrame: true }).userData.spec;
const out = { note: 'H3, F47.4: the lighter encoder (no nickel-silver frame, 0.4 mm walls) and the cored support, as drawn in 3d/parts/scrollwheel.js (volumes x densities: WHEEL_SPEC.densities); made by work/h3/tools/wheel_mass.mjs', encoder_g: now.encoderMass_g, encoderParts_g: now.encoderMassParts_g, support_g: now.supportMass_g, supportParts_g: now.supportMassParts_g, wheel_g: now.massEstimate_g, axle_g: now.axleMass_g, framedEncoder_g: old.encoderMass_g, framedEncoderParts_g: old.encoderMassParts_g };
console.log(JSON.stringify(out, null, 1));
if (process.argv.includes('--write')) fs.writeFileSync('/home/claude/theseus/3d/parts/tools/wheel-mass.json', JSON.stringify(out, null, 1) + '\n');
