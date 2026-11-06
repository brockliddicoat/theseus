"""S2 shared helpers: the kit's constants (06-motion.js), the 2D twins, the raw scan's side render, S1's crease."""
import json, re, sys
import numpy as np
sys.path.insert(0, '/home/claude/work/s1/scripts')
sys.path.insert(0, '/home/claude/theseus/3d/shell/tools')
REPO = '/home/claude/theseus'
SRC = REPO + '/deck/src/06-motion.js'

def js_const(name, src=SRC):
    """the JSON-ish value of `const NAME = ...;` in a deck source file"""
    t = open(src).read()
    m = re.search(r'const ' + re.escape(name) + r' = (.*?);\s*(/\*|\n)', t, re.S)
    if not m: raise KeyError(name)
    v = m.group(1)
    return json.loads(v)

def ms():
    return dict(SIDE=np.array(js_const('MS_SIDE')), SEAM=[np.array(s) for s in js_const('MS_SIDE_SEAM')],
                BTN=[np.array(s) for s in js_const('MS_SIDE_BTN')], WHEEL=np.array(js_const('MS_SIDE_WHEEL')),
                FRONT=np.array(js_const('MS_FRONT')))

# the raw scan's side renders (3d/shell/tools/inspect_scan.py): ortho, centre (0, 19, 0), half height 40 mm, 1300 x 520 px
SCAN_PX = REPO + '/3d/shell/work/scan_sidePX.png'      # camera on +X (the user's left), nose on the left
SCAN_NX = REPO + '/3d/shell/work/scan_sideNX.png'      # camera on -X, nose on the right
SCAN_S = 260 / 40.0                                     # 6.5 px/mm
def scan_px(Z, Y, side='PX'):
    """scene (Z, Y) -> pixel in the scan render"""
    Z = np.asarray(Z, float); Y = np.asarray(Y, float)
    px = 650 + (-Z if side == 'PX' else Z) * SCAN_S
    py = 260 - (Y - 19) * SCAN_S
    return px, py

def crease_s1():
    c = json.load(open('/home/claude/work/s1/crease_side.json'))
    return np.array(c['z']), np.array(c['y'])
