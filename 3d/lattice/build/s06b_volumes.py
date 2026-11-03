"""Collect the fine-grid volumes (from the s04 --vol runs) into work/vol_final.json.
The triangle run predates the floor-recess fix: subtract the stray floor bumps it carried (measured from their meshes)."""
import json, re, sys
from common import *
def parse(log):
    for line in open(os.path.join(WORK, log)):
        if line.startswith('VOLUME'):
            d = eval(line.split('VOLUME mm3 ')[1].replace('np.float64', 'float')); return d
out = {}
for kind, log in (('tri', 'mesh_tri.log'), ('hex', 'mesh_hex.log')):
    out[kind] = parse(log)
stray = float(sys.argv[1]) if len(sys.argv) > 1 else 0.0
out['tri']['wall_body'] -= stray; out['tri']['all_body'] -= stray; out['tri']['stray_removed_mm3'] = stray
jdump(out, os.path.join(WORK, 'vol_final.json')); print(json.dumps(out, indent=1))
