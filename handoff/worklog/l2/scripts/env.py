"""L2 shared setup: import L1's geometry (read-only), no bytecode written into L1's folder. The crease (where the lattice
stops) is chosen by L2_CREASE:
  's2'  (default) S2's final line, Brock 12:50 "1.75 deg": y = 4.6408 - 0.030553 z (s2/crease_line_175.json, 13:3x)
  'l1'  the line L1's study used: y = 8.56 - 0.04837 (z + 59.58) (l1geo.y_crease 'slope', 2.77 deg)
Patched in this process only (l1geo.y_crease is looked up at call time by l1geo.Chart)."""
import os, sys
import numpy as np
sys.dont_write_bytecode = True
os.environ['L1_CREASE'] = 'slope'
sys.path.insert(0, '/home/claude/work/l1/fe')
import l1geo  # noqa
assert l1geo.CREASE == 'slope'
W2 = '/home/claude/work/l2'
CREASE = os.environ.get('L2_CREASE', 's2')
_l1_line = l1geo.y_crease


def y_crease_s2(z):
    z = np.asarray(z, float)
    return 4.6408 - 0.030553 * z


if CREASE == 's2':
    l1geo.y_crease = y_crease_s2
CREASE_TEXT = {'s2': 'the 1.75° crease (S2, y = 4.64 − 0.0306 z)', 'l1': "L1's crease (y = 8.56 − 0.0484 (z + 59.58), 2.8°)"}[CREASE]
