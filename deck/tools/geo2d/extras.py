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
# the antenna keep-out as pcb-layout.json has it (board frame). Board plan 5 (H1): the module is not turned any more, its
# long antenna faces forward and the keep-out sits in front of it, so there is nothing to mirror
D['keepout'] = lay.get('antennaKeepout')
# the camera frame (08-v2d.js frames every 2D view of the board from it: its centre is the target, r the distance). The
# exporter takes it from the whole scene, so the battery lead, which follows the battery (board.py BATTERY), moved and zoomed
# every board view when the battery moved (H2, F42.1: the lead grew 2 mm back; r 44.24 -> 45.03, centre z -1.0 mm, up to
# ~15 px on screen). Pinned to the plan-5 board's frame as H1 left it (09:17), so the board's views stay put; the scene's
# own frame is kept as frameScene. Re-pin on purpose if the board itself changes size.
PIN = {'center': [1.164677619934082, 14.372908143997194, 20.822985763549802],
       'size': [48.329355239868164, 28.054181575775146, 68.59402847290039], 'r': 44.23772265818224}
if 'frame' in D:
    D['frameScene'] = D.get('frameScene') or D['frame']
    D['frame'] = PIN
import os
json.dump(D, open(dst + '.tmp', 'w'), separators=(',', ':')); os.replace(dst + '.tmp', dst)
print('power paths', {k: len(v) for k, v in power.items()})
