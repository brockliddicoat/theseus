"""KEY_PARTS: where the hardware sits in the key plan, generated from the 3D assets (H1, 2026-11-06).

  python3 tools/geo2d/key_parts.py            # print the object
  python3 tools/geo2d/key_parts.py --write    # replace the block between the KEY_PARTS markers in src/03-parts.js

Key-plan mm: x = the user's right (the 3D scene's -X, the board layout's x), y = toward the tail (the scene's -Z), the
mouse's middle at 0, 0. Sources:
  the board ......... 3d/pcb/tools (board.py's plan-5 outline, parts.py's placement, layout.py's antenna keep-out), placed
                      in the mouse by 3d/pcb/pcb-layout.json's boardOffsetZ_in_mouse (layout z - 2.88)
  the lens .......... 3d/shell/shell-theseus-1seam.json (meta.sensor) and plate-layout.json (the window), the clip-on lens's
                      stadium and its two dots as 3d/shell/shell.js builds them (3d/parts/skates.js SKATE_SETS.lensDots)
  the corner dots ... meta.skates
  the battery ....... BATTERY in 3d/pcb/tools/board.py (the LP402535JU's place: H1 job 3)
"""
import json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
DECK = os.path.abspath(os.path.join(HERE, '..', '..'))
R3 = os.path.abspath(os.path.join(DECK, '..', '3d'))
sys.path.insert(0, os.path.join(R3, 'pcb', 'tools'))
os.environ.setdefault('PCB_VARIANT', 'A')
import deps  # noqa: F401
import board as BD
import parts as PT
from layout import ANT_KEEPOUT
from board_geo import T as BOARD_T            # the finished thickness (F47.4: 0.6 mm, H3)

lay = json.load(open(os.path.join(R3, 'pcb', 'pcb-layout.json')))
DZ = lay.get('boardOffsetZ_in_mouse', -2.88)
meta = json.load(open(os.path.join(R3, 'shell', 'shell-theseus-1seam.json')))
plate = json.load(open(os.path.join(R3, 'shell', 'plate-layout.json')))
r2 = lambda v: round(float(v) + 0.0, 2)
def K(x, z):                       # board layout (x right, z nose) -> key plan
    return [r2(x), r2(-(z + DZ))]
def KS(X, Z):                      # 3D scene (X the user's left, Z nose) -> key plan
    return [r2(-X), r2(-Z)]
comp = {c['ref']: c for c in PT.C}

# the board: the plan-5 outline (mirrored, equal-tangent fillets), simplified to 0.01 mm
def mirrored(poly):
    """the polygon's right half (x >= 0), simplified to 0.01 mm, and its mirror image: exactly symmetric (F30.23)"""
    from shapely.geometry import box
    half = poly.intersection(box(0, -200, 200, 200)).simplify(0.01)
    c = list(half.exterior.coords)[:-1]
    k = max(range(len(c)), key=lambda i: (abs(c[i][0]) < 1e-6, c[i][1]))      # start at the front point on the centre line
    c = c[k:] + c[:k]
    if c[1][0] < 1e-6: c = [c[0]] + c[1:][::-1]                                  # go round the right side first
    right = [q for q in c if q[0] > 1e-6]
    return right + [(-x, z) for x, z in reversed(right)]
ol = BD.theseus_outline()
pts = [K(x, z) for x, z in mirrored(ol)]
xs, ys = [p[0] for p in pts], [p[1] for p in pts]
# t: the finished thickness (board_geo.T); top: its top face over the pad in the mouse (pcb-layout.json: the shell's posts,
# the switches and the wheel's axle are set from it, so a thinner board keeps its top and brings its underside up)
board = dict(anchor=K(0, 0), t=r2(BOARD_T), top=r2(lay.get('boardTopY_in_mouse', 5.03)), box=[min(xs), min(ys), max(xs), max(ys)], pts=pts,
             holes=[K(v[0], v[1]) + [v[2] / 2] for k, v in sorted(BD.SORA_HOLES.items())],
             bay=[K(x, z) for x, z in mirrored(BD.wheel_cut_poly())])
# the parts on it
def part(ref, w=None, h=None):
    c = comp[ref]; fp = PT.FP[c['fp']](); bw, bh = fp['body']
    if c['rot'] % 180: bw, bh = bh, bw
    return dict(c=K(c['x'], c['z']), w=r2(w or bw), h=r2(h or bh))
sensor = part('U3'); sensor['r'] = 3.6
module = part('U1'); pmic = part('U2')
a = ANT_KEEPOUT.bounds                          # (x0, z0, x1, z1), layout
antenna = dict(x=r2(a[0]), y=r2(-(a[3] + DZ)), w=r2(a[2] - a[0]), h=r2(a[3] - a[1]))
win = BD.WIN
power = dict(A=dict(c=K(*win['c']), w=win['w'], h=win['h'], r=BD.T_FIL, note='variant A (default): a slide switch over its window, the knob reached from below'),
             B=dict(c=K(BD.WX - 1.3, win['c'][1]), w=2.6, h=6.7, tip=r2(BD.WX + 1.5), note='variant B: a right-angle slide switch at the right waist edge, its knob 1.5 mm past the edge'))
# the lens: meta.sensor is the window's (and the clip-on lens's) centre; the optics 1.1 ahead / 1.9 behind (shell.js)
sx, sz = meta['sensor']; W = plate['window']
lens = dict(c=KS(sx, sz), hw=2.6, hl=7.1, y0=2.40, axis=KS(sx, sz + 1.1), led=KS(sx, sz - 1.9))
window = dict(c=KS(*W['c']), hw=W['hw'], hl=W['hl'])
lensDots = dict(pts=[KS(sx + dx, sz + dz) for dx, dz in ((0, 6.3), (0, -6.7))], r=3.25)
skates = dict(pts=[KS(X, Z) for X, Z in meta['skates']], r=3.25)
B = BD.BATTERY
battery = dict(x=r2(B['x0']), y=r2(-(B['z1'] + DZ)), w=r2(B['x1'] - B['x0']), h=r2(B['z1'] - B['z0']), r=2, t=B['t'], yMid=B['yMid'], part=B['part'])
KP = dict(board=board, sensor=sensor, lens=lens, window=window, lensDots=lensDots, skates=skates, battery=battery,
          antenna=antenna, power=power, module=module, pmic=pmic)

def js(o, ind=2):
    """compact JS: short arrays on one line"""
    s = json.dumps(o, separators=(', ', ': '))
    s = re.sub(r'"([A-Za-z_][A-Za-z0-9_]*)": ', r'\1: ', s)
    return s
order = ['sensor', 'lens', 'window', 'lensDots', 'skates', 'battery', 'antenna', 'power', 'module', 'pmic', 'board']
body = '\n'.join('  %s: %s,' % (k, js(KP[k])) for k in order)
block = ('/* KEY_PARTS:BEGIN (generated by deck/tools/geo2d/key_parts.py from the 3D assets; edit the assets, then re-run it) */\n'
         'const KEY_PARTS = {\n' + body + '\n};\n/* KEY_PARTS:END */')
if '--write' in sys.argv:
    p = os.path.join(DECK, 'src', '03-parts.js'); s = open(p).read()
    m = re.search(r'/\* KEY_PARTS:BEGIN.*?/\* KEY_PARTS:END \*/', s, re.S)
    if not m: sys.exit('no KEY_PARTS markers in 03-parts.js')
    s = s[:m.start()] + block + s[m.end():]
    open(p + '.tmp', 'w').write(s); os.replace(p + '.tmp', p)
    print('03-parts.js: KEY_PARTS written (%d chars)' % len(block))
else:
    print(block)
