"""H2: the battery's clearances at a candidate place (F42.1), from the 3D assets.

  python3 -I clear.py                       # the three standard cases (H1's place, Brock's literal, corrected balance)
  python3 -I clear.py --fwd 4.24 --up 1.5   # one case: forward / up from H1's place (mm)
  python3 -I clear.py --now [--shell X.glb]  # the battery where board.py BATTERY has it now, against a shell GLB (S1: your new
                                             # shell; default 3d/shell/shell-theseus-1seam.glb)

Frames: layout x = the user's right, z = nose (board.py, parts.py); mouse X = -layout x (the user's left), Z = layout z - 2.88,
Y up from the pad; the board's top copper at mouse Y 5.03, 1.0 mm thick (pcb-layout.json). The battery is a sharp box
(conservative: the pouch's corners are rounded).

Clearances reported:
  shell ...... every shell mesh in the film's mouse (body, sideFront, sideRear, triggerL/R, usbC, wheelBay; no plate,
               the film's mouse has none; not 'core', a black light-blocker stand-in for the internals), sampled at <= 0.15 mm; the nearest point overall and per direction (above = the
               roof, behind = the tail, sides, below = the rim ledge); any sample inside the box is a collision
  board parts  every component of pcb.glb (its mesh vertices) whose plan overlaps the battery's plan grown by 3 mm, the
               vertical gap from its top to the battery's bottom, and the plan gap
  bosses ..... the shell's posts over MH3/MH4 (the board hangs from them, #54; screws driven from below): a cylinder r 2.65
               (3d/parts/fasteners.js stand-in boss, Ø5.3) and r 2.2 (b11_theseusInside draws them 4.4 wide), from the board
               top to the roof; plan gap to the battery
  screw heads  under the board (#54): mouse Y 4.03 - 1.3 .. 4.03; vertical gap to the battery's bottom (never in the way)
  antenna .... the keep-out (layout.py ANT_KEEPOUT) and the antenna itself (the module's front 3.5 mm, its PCB top at
               about board top + 0.8 mm); nearest 3D distance from the battery's metal (the whole pouch)
"""
import json, math, os, sys
import numpy as np
R3 = '/home/claude/theseus/3d'
sys.path.insert(0, os.path.join(R3, 'shell', 'tools')); sys.path.insert(0, os.path.join(R3, 'pcb', 'tools'))
os.environ.setdefault('PCB_VARIANT', 'A')
import glbio
import deps  # noqa: F401
import board as BD
from layout import ANT_KEEPOUT

LAY = json.load(open(os.path.join(R3, 'pcb', 'pcb-layout.json')))
DZ, YT, TH = LAY['boardOffsetZ_in_mouse'], LAY['boardTopY_in_mouse'], LAY['thickness']
H1 = dict(x0=-17.09, x1=17.91, z0=-34.57, z1=-9.57, t=4.0, yMid=7.46)      # H1's place (layout x, z; mouse yMid)


def box_of(fwd, up, B=H1):
    """mouse-frame box [X0, Y0, Z0, X1, Y1, Z1] of the battery moved fwd / up from H1's place"""
    return np.array([-B['x1'], B['yMid'] + up - B['t'] / 2, B['z0'] + fwd + DZ, -B['x0'], B['yMid'] + up + B['t'] / 2, B['z1'] + fwd + DZ])


def pt_box(P, bx):
    lo, hi = bx[:3], bx[3:]
    d = np.maximum(np.maximum(lo - P, 0), P - hi)
    return np.linalg.norm(d, axis=1)


def inside(P, bx):
    return np.all((P > bx[:3]) & (P < bx[3:]), axis=1)


# ---------------------------------------------------------------- shell samples (cached)
SHELL_MESHES = ['body', 'sideFront', 'sideRear', 'triggerL', 'triggerR', 'usbC', 'wheelBay']
_SH = {}


def shell_samples(glb=os.path.join(R3, 'shell', 'shell-theseus-1seam.glb'), region=None, step=0.15):
    key = (glb, tuple(np.round(region, 2)) if region is not None else None, step)
    if key in _SH: return _SH[key]
    js, b = glbio.read(glb)
    names = [n.get('name') for n in js['nodes']]
    out = []
    for nm in SHELL_MESHES:
        if nm not in names: continue
        n, d = glbio.mesh_arrays(js, b, nm)
        P = d['POSITION'].astype(float) + np.array(n.get('translation', [0, 0, 0]))
        I = d['indices'].reshape(-1, 3)
        A, Bv, Cv = P[I[:, 0]], P[I[:, 1]], P[I[:, 2]]
        if region is not None:
            lo, hi = region[:3], region[3:]
            tmin = np.minimum(np.minimum(A, Bv), Cv); tmax = np.maximum(np.maximum(A, Bv), Cv)
            keep = np.all((tmax >= lo) & (tmin <= hi), axis=1)
            A, Bv, Cv = A[keep], Bv[keep], Cv[keep]
        L = np.maximum(np.maximum(np.linalg.norm(Bv - A, axis=1), np.linalg.norm(Cv - Bv, axis=1)), np.linalg.norm(A - Cv, axis=1))
        for k in np.unique(np.ceil(L / step).astype(int).clip(1, 60)):
            sel = np.ceil(L / step).astype(int).clip(1, 60) == k
            uv = [(i / k, j / k) for i in range(k + 1) for j in range(k + 1 - i)]
            U = np.array(uv)
            a, bb, c = A[sel], Bv[sel], Cv[sel]
            S = a[:, None, :] * (1 - U[:, 0] - U[:, 1])[None, :, None] + bb[:, None, :] * U[:, 0][None, :, None] + c[:, None, :] * U[:, 1][None, :, None]
            out.append((nm, S.reshape(-1, 3)))
    names_all = np.concatenate([[nm] * len(S) for nm, S in out])
    pts = np.concatenate([S for _, S in out])
    _SH[key] = (pts, names_all)
    return _SH[key]


SHELL_GLB = [None]


def shell_clear(bx, glb=None):
    glb = glb or SHELL_GLB[0]
    reg = np.concatenate([bx[:3] - 16, bx[3:] + np.array([16, 40, 16])])
    pts, nm = shell_samples(glb or os.path.join(R3, 'shell', 'shell-theseus-1seam.glb'), region=reg)
    d = pt_box(pts, bx); ins = inside(pts, bx)
    res = dict(n=len(pts), collide=int(ins.sum()))
    i = int(np.argmin(d)); res['min'] = (round(float(d[i]), 2), [round(float(v), 2) for v in pts[i]], str(nm[i]))
    X0, Y0, Z0, X1, Y1, Z1 = bx
    inXZ = (pts[:, 0] >= X0) & (pts[:, 0] <= X1) & (pts[:, 2] >= Z0) & (pts[:, 2] <= Z1)
    classes = {
        'roof (above, over the footprint)': inXZ & (pts[:, 1] >= Y1),
        'tail (behind the rear face)': (pts[:, 2] < Z0),
        'sides (beside, within its length)': ((pts[:, 0] < X0) | (pts[:, 0] > X1)) & (pts[:, 2] >= Z0) & (pts[:, 2] <= Z1),
        'below (under the footprint)': inXZ & (pts[:, 1] <= Y0),
    }
    for k, m in classes.items():
        if m.any():
            j = np.where(m)[0][np.argmin(d[m])]
            res[k] = (round(float(d[j]), 2), [round(float(v), 2) for v in pts[j]], str(nm[j]))
    return res


# ---------------------------------------------------------------- board parts (pcb.glb vertices, mouse frame)
_PC = {}


def pcb_parts(glb=os.path.join(R3, 'pcb', 'pcb.glb')):
    if glb in _PC: return _PC[glb]
    js, b = glbio.read(glb)
    N = js['nodes']
    def mat(n):
        if 'matrix' in n: return np.array(n['matrix'], float).reshape(4, 4).T
        M = np.eye(4)
        if 'translation' in n: M[:3, 3] = n['translation']
        return M
    def verts(i, M):
        n = N[i]; M = M @ mat(n); out = []
        if 'mesh' in n:
            for p in js['meshes'][n['mesh']]['primitives']:
                P = glbio.acc(js, b, p['attributes']['POSITION']).astype(float)
                out.append((np.c_[P, np.ones(len(P))] @ M.T)[:, :3])
        for c in n.get('children', []): out += verts(c, M)
        return out
    comps = next(i for i, n in enumerate(N) if n.get('name') == 'components')
    res = {}
    for c in N[comps]['children']:
        n = N[c]; V = verts(c, np.eye(4))
        if not V: continue
        V = np.concatenate(V); V[:, 1] += YT; V[:, 2] += DZ           # board-local -> mouse (X already mirrored)
        res[n.get('name')] = V
    _PC[glb] = res
    return res


def parts_under(bx, grow=3.0, glb=None):
    out = []
    for ref, V in pcb_parts(glb or os.path.join(R3, 'pcb', 'pcb.glb')).items():
        m = (V[:, 0] >= bx[0] - grow) & (V[:, 0] <= bx[3] + grow) & (V[:, 2] >= bx[2] - grow) & (V[:, 2] <= bx[5] + grow)
        if not m.any(): continue
        W = V[m]
        d = pt_box(W, bx); j = int(np.argmin(d))
        inplan = (W[:, 0] >= bx[0]) & (W[:, 0] <= bx[3]) & (W[:, 2] >= bx[2]) & (W[:, 2] <= bx[5])
        top = float(W[:, 1].max()); topIn = float(W[inplan, 1].max()) if inplan.any() else None
        out.append(dict(ref=ref, gap3d=round(float(d[j]), 2), at=[round(float(v), 2) for v in W[j]], top=round(top, 2),
                        underPlan=bool(inplan.any()), vgap=(round(bx[1] - topIn, 2) if topIn is not None else None),
                        collide=int(inside(W, bx).sum())))
    return sorted(out, key=lambda r: r['gap3d'])


def board_under(bx):
    """the board's outline under the battery (area mm2, how far its front edge reaches over the board)"""
    from shapely.geometry import Polygon, box as sbox
    ol = Polygon([(-x, z + DZ) for x, z in BD.theseus_outline().exterior.coords])     # mouse X, Z
    fb = sbox(bx[0], bx[2], bx[3], bx[5]); inter = ol.intersection(fb)
    return dict(area=round(inter.area, 1), overlapZ=round(bx[5] - (min(z for x, z in ol.exterior.coords if abs(x) > 7.5)), 2) if inter.area > 0 else 0.0,
                boardRearLobes=round(min(z for x, z in ol.exterior.coords), 2), notchEdge=round(BD.ZN + DZ, 2) if hasattr(BD, 'ZN') else None)


# ---------------------------------------------------------------- bosses, screw heads, antenna
def bosses(bx):
    out = []
    for k in ('MH3', 'MH4'):
        x, z, dia, _ = BD.SORA_HOLES[k]; X, Z = -x, z + DZ
        for r, lab in ((2.65, 'stand-in Ø5.3 (fasteners.js)'), (2.2, "b11's drawing 4.4 wide")):
            # plan distance from the circle to the box footprint (negative = overlap depth)
            dx = max(bx[0] - X, 0, X - bx[3]); dz = max(bx[2] - Z, 0, Z - bx[5])
            dc = math.hypot(dx, dz) - r
            if dx == 0 and dz == 0:
                dc = -(r + min(X - bx[0], bx[3] - X, Z - bx[2], bx[5] - Z))
            out.append(dict(hole=k, X=X, Z=round(Z, 2), r=r, kind=lab, plan_gap=round(dc, 2), front_edge_gap=round((Z - r) - bx[5], 2)))
    return out


def screw_heads(bx):
    yb = YT - TH                      # the board's bottom face, mouse 4.03
    return dict(head_top=round(yb, 2), head_bottom=round(yb - 1.3, 2), vgap=round(bx[1] - yb, 2), note='heads under the board (#54): the battery is above the board, never over a head')


def antenna(bx):
    a = ANT_KEEPOUT.bounds            # layout (x0, z0, x1, z1)
    ko = np.array([-a[2], YT - TH, a[1] + DZ, -a[0], YT + 2.0, a[3] + DZ])          # keep-out volume (all layers, to module top)
    # the antenna itself: the module's front 3.5 mm (layout z 7.95..11.45), its traces on the module PCB at about board top + 0.8
    ant = np.array([-4.95, YT + 0.8, 7.95 + DZ, 4.95, YT + 0.8, 11.45 + DZ])
    def box_box(a1, a2):
        d = np.maximum(np.maximum(a1[:3] - a2[3:], 0), a2[:3] - a1[3:])
        return float(np.linalg.norm(d)), d
    dk, vk = box_box(bx, ko); da, va = box_box(bx, ant)
    return dict(keepout=round(dk, 2), keepout_plan=round(float(math.hypot(vk[0], vk[2])), 2), antenna=round(da, 2), antenna_plan=round(float(math.hypot(va[0], va[2])), 2))


def report(fwd, up, tag=''):
    bx = box_of(fwd, up)
    print('=' * 110)
    print('%s  forward %.2f, up %.2f  -> mouse X %.2f..%.2f, Y %.2f..%.2f, Z %.2f..%.2f (centre Z %.2f, yMid %.2f); layout front z %.2f'
          % (tag, fwd, up, bx[0], bx[3], bx[1], bx[4], bx[2], bx[5], (bx[2] + bx[5]) / 2, (bx[1] + bx[4]) / 2, bx[5] - DZ))
    s = shell_clear(bx)
    print('  shell: samples %d, inside the battery %d; nearest %.2f mm at %s (%s)' % (s['n'], s['collide'], s['min'][0], s['min'][1], s['min'][2]))
    for k in ('roof (above, over the footprint)', 'tail (behind the rear face)', 'sides (beside, within its length)', 'below (under the footprint)'):
        if k in s: print('    %-36s %6.2f mm at %s (%s)' % (k, s[k][0], s[k][1], s[k][2]))
    bu = board_under(bx); print('  board under it: %.1f mm2 of board; front edge %.2f mm past the lobes\' rear edge (mouse z %.2f)' % (bu['area'], bu['overlapZ'], bu['boardRearLobes']))
    print('  parts near (plan within 3 mm):')
    for r in parts_under(bx):
        print('    %-9s 3D gap %5.2f  underPlan %-5s vgap %-6s top Y %.2f  collide %d  at %s' % (r['ref'], r['gap3d'], r['underPlan'], r['vgap'], r['top'], r['collide'], r['at']))
    for b in bosses(bx):
        print('  boss %s (%s) at X %+.2f Z %.2f r %.2f: plan gap %+.2f (front edge %+.2f behind its rear edge)' % (b['hole'], b['kind'], b['X'], b['Z'], b['r'], b['plan_gap'], b['front_edge_gap']))
    sh = screw_heads(bx); print('  screw heads (under the board, #54): top Y %.2f; battery bottom %.2f above them' % (sh['head_top'], sh['vgap']))
    an = antenna(bx); print('  antenna: keep-out %.2f mm (plan %.2f); the antenna itself %.2f mm (plan %.2f)' % (an['keepout'], an['keepout_plan'], an['antenna'], an['antenna_plan']))
    return dict(box=[round(float(v), 3) for v in bx], shell=s, board=bu, parts=parts_under(bx), bosses=bosses(bx), heads=sh, antenna=an)


if __name__ == '__main__':
    a = sys.argv[1:]
    if '--shell' in a: SHELL_GLB[0] = a[a.index('--shell') + 1]
    if '--now' in a:
        B = BD.BATTERY
        r = report(B['z1'] - H1['z1'], B['yMid'] - H1['yMid'], 'board.py BATTERY now')
        if '--json' in a: json.dump(r, open(a[a.index('--json') + 1], 'w'), indent=1, default=str)
    elif '--fwd' in a:
        fwd = float(a[a.index('--fwd') + 1]); up = float(a[a.index('--up') + 1]) if '--up' in a else 0.0
        r = report(fwd, up, 'case')
        if '--json' in a: json.dump(r, open(a[a.index('--json') + 1], 'w'), indent=1)
    else:
        out = {}
        for tag, f, u in (('H1 place (2.23 back)', 0.0, 0.0), ('old key-plan place', 2.23, 0.0), ('Brock literal 5.9/1.5', 5.90, 1.5)):
            out[tag] = report(f, u, tag)
        json.dump(out, open('/home/claude/work/h2/clear_cases.json', 'w'), indent=1, default=str)
