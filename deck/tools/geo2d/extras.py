"""Extras the 2D twins need beside the outlines: the board's power paths (pcb-layout.json), in the mouse frame.

  python3 tools/geo2d/extras.py ../3d/pcb/pcb-layout.json geo2d/pcb.json
"""
import sys, json
lay = json.load(open(sys.argv[1])); dst = sys.argv[2]
D = json.load(open(dst))
y0, dz = lay['boardTopY_in_mouse'], lay['boardOffsetZ_in_mouse']
power = {}
for mode, v in lay.get('power', {}).items():
    if not isinstance(v, dict) or 'segments' not in v: continue
    power[mode] = [[[round(x, 3), round(y0 + 0.06, 3), round(z + dz, 3)] for x, z in seg['pts']] for seg in v['segments']]
D['power'] = power
# the radio module is turned so its antenna end sits away from the wheel (3d/pcb/pcb.js, Brock 2026-11-04): the keep-out
# moves with it, mirrored about the module's centre (board frame, as in pcb-layout.json)
k = lay.get('antennaKeepout')
u1 = next((c for c in lay.get('components', []) if c.get('ref') == 'U1'), None)
if k and u1 and lay.get('designRevision') != 'F30.25-plan5-approved':
    zc = u1['z']; k = [k[0], round(2 * zc - k[3], 3), k[2], round(2 * zc - k[1], 3)]
D['keepout'] = k
import os
json.dump(D, open(dst + '.tmp', 'w'), separators=(',', ':')); os.replace(dst + '.tmp', dst)
print('power paths', {k: len(v) for k, v in power.items()})
