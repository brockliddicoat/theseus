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
D['keepout'] = lay.get('antennaKeepout')
json.dump(D, open(dst, 'w'), separators=(',', ':'))
print('power paths', {k: len(v) for k, v in power.items()})
