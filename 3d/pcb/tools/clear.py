"""The battery's clearances at its place, from the 3D assets (H2's method, work/h2/tools/clear.py; H5: made a repo tool, the
box read from board.py BATTERY, and the skates, the side-button lead, the bands and the way out added).

  python3 tools/clear.py                         # board.py BATTERY as it is; writes work/clear.json
  python3 tools/clear.py --z -34.32 [--y 7.46] [--x -0.41]   # the same pack with its centre at mouse (X, Y, Z)
  python3 tools/clear.py --sweep -27 -40 0.25    # the shell's nearest point as the centre moves back (mouse z)
  python3 tools/clear.py --shell X.glb           # against another shell GLB (S1/S2: your new shell)

Frames: layout x = the user's right, z = nose (board.py); mouse X = -layout x (the user's left), Z = layout z - 2.88, Y up
from the pad; the board's top at mouse Y 5.03 (pcb-layout.json). The battery is a sharp box (conservative: the pouch's
corners are rounded). Clearances reported (mm):
  shell ...... every shell mesh in the film's mouse (body, sideFront, sideRear, triggerL/R, usbC, wheelBay; no plate, the
               film's mouse has none; not 'core', a black light-blocker stand-in), sampled at <= 0.15 mm: the nearest point
               and per direction (roof above, tail behind, sides, below: the rim's ledge); a sample inside is a collision
  bands ...... the two silicone bands round the pouch at 0.28 and 0.72 of its length from the front (b11 draws them there),
               0.62 thick and 2.6 wide (3d/parts/battery.js): the band's outside against the shell
  board ...... the board's outline under the battery, the parts of pcb.glb within 3 mm in plan (BATLEAD is the battery's
               own lead and ends at its front face by design), the shell's posts over MH3/MH4 (Ø5.3 fasteners.js stand-in,
               Ø4.4 as b11 draws them), the screw heads under the board (#54)
  skates ..... the corner dots on the rim's ledge (meta.skates, Ø6.5): plan overlap with the battery and the height from the
               shell's top over each dot to the battery's bottom
  side lead .. the side-button lead (components.py SIDELEAD, then up the left wall to the rear side switch, as the deck's
               budget lays it): its nearest point to the battery
  antenna .... the keep-out (layout.py ANT_KEEPOUT) and the antenna itself; nearest 3D distance from the pouch's foil
  way out .... the pouch leaves through the open bottom: how far it can slide forward before the rear posts, and whether
               the rim's ledge is under it there
"""
import json, math, os, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); R3 = os.path.abspath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, HERE); sys.path.insert(0, os.path.join(R3, 'shell', 'tools'))
os.environ.setdefault('PCB_VARIANT', 'A')
import deps  # noqa: F401
import glbio
import board as BD
from layout import ANT_KEEPOUT

LAY = json.load(open(os.path.join(R3, 'pcb', 'pcb-layout.json')))
DZ, YT, TH = LAY['boardOffsetZ_in_mouse'], LAY['boardTopY_in_mouse'], LAY['thickness']
META = json.load(open(os.path.join(R3, 'shell', 'shell-theseus-1seam.json')))
SHELL_GLB = [os.path.join(R3, 'shell', 'shell-theseus-1seam.glb')]
BAND = dict(at=(0.28, 0.72), t=0.62, w=2.6)


def box_of(B=BD.BATTERY, centre=None):
    """mouse-frame box [X0, Y0, Z0, X1, Y1, Z1] of the pack B (layout box), or of the same pack with its centre at mouse
    (X, Y, Z)"""
    bx = np.array([-B['x1'], B['yMid'] - B['t'] / 2, B['z0'] + DZ, -B['x0'], B['yMid'] + B['t'] / 2, B['z1'] + DZ], float)
    if centre is not None:
        c0 = (bx[:3] + bx[3:]) / 2; d = np.asarray(centre, float) - c0; bx = bx + np.r_[d, d]
    return bx


def pt_box(P, bx):
    lo, hi = bx[:3], bx[3:]
    d = np.maximum(np.maximum(lo - P, 0), P - hi)
    return np.linalg.norm(d, axis=1)


def inside(P, bx):
    return np.all((P > bx[:3]) & (P < bx[3:]), axis=1)


# ---------------------------------------------------------------- shell samples (cached)
SHELL_MESHES = ['body', 'sideFront', 'sideRear', 'triggerL', 'triggerR', 'usbC', 'wheelBay']
_SH = {}


def shell_samples(region, step=0.15):
    glb = SHELL_GLB[0]; key = (glb, tuple(np.round(region, 2)), step)
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
        lo, hi = region[:3], region[3:]
        tmin = np.minimum(np.minimum(A, Bv), Cv); tmax = np.maximum(np.maximum(A, Bv), Cv)
        keep = np.all((tmax >= lo) & (tmin <= hi), axis=1)
        A, Bv, Cv = A[keep], Bv[keep], Cv[keep]
        L = np.maximum(np.maximum(np.linalg.norm(Bv - A, axis=1), np.linalg.norm(Cv - Bv, axis=1)), np.linalg.norm(A - Cv, axis=1))
        kk = np.ceil(L / step).astype(int).clip(1, 60)
        for k in np.unique(kk):
            sel = kk == k
            U = np.array([(i / k, j / k) for i in range(k + 1) for j in range(k + 1 - i)])
            a, bb, c = A[sel], Bv[sel], Cv[sel]
            S = a[:, None, :] * (1 - U[:, 0] - U[:, 1])[None, :, None] + bb[:, None, :] * U[:, 0][None, :, None] + c[:, None, :] * U[:, 1][None, :, None]
            out.append((nm, S.reshape(-1, 3)))
    names_all = np.concatenate([[nm] * len(S) for nm, S in out])
    pts = np.concatenate([S for _, S in out])
    _SH[key] = (pts, names_all)
    return _SH[key]


def _region(bx):
    return np.concatenate([bx[:3] - 16, bx[3:] + np.array([16, 40, 16])])


def shell_clear(bx):
    pts, nm = shell_samples(_region(bx))
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


def bands(bx):
    """each band's outside (the pouch's section grown by the band's thickness, BAND['w'] long) against the shell"""
    out = []
    pts, nm = shell_samples(_region(bx))
    for f in BAND['at']:
        z = bx[5] - f * (bx[5] - bx[2]); t = BAND['t']
        bb = np.array([bx[0] - t, bx[1] - t, z - BAND['w'] / 2, bx[3] + t, bx[4] + t, z + BAND['w'] / 2])
        d = pt_box(pts, bb); i = int(np.argmin(d))
        out.append(dict(at=f, z=round(float(z), 2), gap=round(float(d[i]), 2), where=[round(float(v), 2) for v in pts[i]], mesh=str(nm[i]),
                        collide=int(inside(pts, bb).sum())))
    return out


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


def parts_near(bx, grow=3.0):
    out = []
    for ref, V in pcb_parts().items():
        m = (V[:, 0] >= bx[0] - grow) & (V[:, 0] <= bx[3] + grow) & (V[:, 2] >= bx[2] - grow) & (V[:, 2] <= bx[5] + grow)
        if not m.any(): continue
        W = V[m]; d = pt_box(W, bx); j = int(np.argmin(d))
        inplan = (W[:, 0] >= bx[0]) & (W[:, 0] <= bx[3]) & (W[:, 2] >= bx[2]) & (W[:, 2] <= bx[5])
        topIn = float(W[inplan, 1].max()) if inplan.any() else None
        out.append(dict(ref=ref, gap3d=round(float(d[j]), 2), at=[round(float(v), 2) for v in W[j]], underPlan=bool(inplan.any()),
                        vgap=(round(bx[1] - topIn, 2) if topIn is not None else None), collide=int(inside(W, bx).sum()),
                        note='the battery\'s own lead: ends at its front face by design' if ref == 'BATLEAD' else ''))
    return sorted(out, key=lambda r: r['gap3d'])


def board_under(bx):
    from shapely.geometry import Polygon, box as sbox
    ol = Polygon([(-x, z + DZ) for x, z in BD.theseus_outline().exterior.coords])     # mouse X, Z
    fb = sbox(bx[0], bx[2], bx[3], bx[5]); inter = ol.intersection(fb)
    rear = min(z for x, z in ol.exterior.coords)
    return dict(area=round(inter.area, 1), front_behind_lobes=round(rear - bx[5], 2), boardRearLobes=round(rear, 2))


def bosses(bx):
    out = []
    for k in ('MH3', 'MH4'):
        x, z, dia, _ = BD.SORA_HOLES[k]; X, Z = -x, z + DZ
        for r, lab in ((2.65, 'stand-in Ø5.3 (fasteners.js)'), (2.2, "b11's drawing 4.4 wide")):
            dx = max(bx[0] - X, 0, X - bx[3]); dz = max(bx[2] - Z, 0, Z - bx[5])
            dc = math.hypot(dx, dz) - r
            if dx == 0 and dz == 0: dc = -(r + min(X - bx[0], bx[3] - X, Z - bx[2], bx[5] - Z))
            out.append(dict(hole=k, X=X, Z=round(Z, 2), r=r, kind=lab, plan_gap=round(dc, 2)))
    return out


def screw_heads(bx):
    yb = YT - TH
    return dict(head_top=round(yb, 2), vgap=round(bx[1] - yb, 2), note='heads under the board (#54); the battery is behind the board')


def skates(bx):
    """the rear corner dots (meta.skates, r 3.25, on the rim's ledge): plan overlap with the footprint, and the height from
    the shell's highest point over the dot to the battery's bottom"""
    pts, _ = shell_samples(_region(bx))
    out = []
    for X, Z in META['skates']:
        if Z > bx[5] + 10: continue
        dx = max(bx[0] - X, 0, X - bx[3]); dz = max(bx[2] - Z, 0, Z - bx[5]); plan = math.hypot(dx, dz) - 3.25
        m = (pts[:, 0] - X) ** 2 + (pts[:, 2] - Z) ** 2 <= 3.25 ** 2
        m &= pts[:, 1] < bx[1] + 0.01
        top = float(pts[m, 1].max()) if m.any() else None
        out.append(dict(at=[round(X, 2), round(Z, 2)], plan_gap=round(plan, 2), ledge_top=round(top, 2) if top is not None else None,
                        vgap=round(bx[1] - top, 2) if top is not None else None))
    return out


def side_lead(bx):
    """the side-button lead: components.py SIDELEAD (layout x, board-local y, z), then up the left wall to the rear side
    switch (balance.py side_switches), as the deck's budget lays it (ntr_budget: 'on up the wall to the rear switch')"""
    import components as CP
    import inspect
    src = inspect.getsource(CP.add_wires)
    import re as _re
    m = _re.search(r"'SIDELEAD': dict\(path=(\[[^\]]*\])", src)
    path = eval(m.group(1)) if m else [(-19.1, 1.5, 7.9), (-24.8, 6.0, 9.6)]
    P = [np.array([-x, y + YT, z + DZ]) for x, y, z in path]
    P.append(np.array([22.40 - 3.25, 22.65, -3.55]))          # the rear side switch's inner face (balance.py side_switches)
    best = (1e9, None)
    for a, c in zip(P[:-1], P[1:]):
        for u in np.linspace(0, 1, 200):
            q = a + u * (c - a); d = float(pt_box(q[None, :], bx)[0])
            if d < best[0]: best = (d, q)
    return dict(gap=round(best[0], 2), at=[round(float(v), 2) for v in best[1]])


def antenna(bx):
    a = ANT_KEEPOUT.bounds
    ko = np.array([-a[2], YT - TH, a[1] + DZ, -a[0], YT + 2.0, a[3] + DZ])
    ant = np.array([-4.95, YT + 0.8, 7.95 + DZ, 4.95, YT + 0.8, 11.45 + DZ])
    def box_box(a1, a2):
        d = np.maximum(np.maximum(a1[:3] - a2[3:], 0), a2[:3] - a1[3:])
        return float(np.linalg.norm(d))
    return dict(keepout=round(box_box(bx, ko), 2), antenna=round(box_box(bx, ant), 2))


def way_out(bx):
    """slide forward until the rear posts (Ø5.3) stop it, then down: is any shell point under the footprint there?"""
    post = min(z for k, (x, z, d, _) in BD.SORA_HOLES.items() if k in ('MH3', 'MH4')) + DZ - 2.65
    slide = post - bx[5]
    pts, _ = shell_samples(_region(np.r_[bx[:3], bx[3:5], bx[5] + max(slide, 0)]))
    for s in (0.0, max(slide - 0.5, 0), max(slide, 0)):
        b2 = bx + np.array([0, 0, s, 0, 0, s])
        m = (pts[:, 0] > b2[0]) & (pts[:, 0] < b2[3]) & (pts[:, 2] > b2[2]) & (pts[:, 2] < b2[5]) & (pts[:, 1] < b2[1])
        if not m.any():
            return dict(slide_to_posts=round(slide, 2), drops_after=round(s, 2), note='clear below once slid %.1f mm forward' % s)
    zs = pts[(pts[:, 0] > bx[0]) & (pts[:, 0] < bx[3]) & (pts[:, 1] < bx[1]), 2]
    return dict(slide_to_posts=round(slide, 2), drops_after=None, ledge_front=round(float(zs.max()), 2) if len(zs) else None,
                note='the rim\'s ledge is still under its rear when it meets the posts: it comes out tilted (rear up first)')


def report(bx, tag=''):
    print('=' * 110)
    print('%s: mouse X %.2f..%.2f, Y %.2f..%.2f, Z %.2f..%.2f (centre Z %.2f, yMid %.2f); layout front z %.2f'
          % (tag, bx[0], bx[3], bx[1], bx[4], bx[2], bx[5], (bx[2] + bx[5]) / 2, (bx[1] + bx[4]) / 2, bx[5] - DZ))
    s = shell_clear(bx)
    print('  shell: samples %d, inside the battery %d; nearest %.2f mm at %s (%s)' % (s['n'], s['collide'], s['min'][0], s['min'][1], s['min'][2]))
    for k in ('roof (above, over the footprint)', 'tail (behind the rear face)', 'sides (beside, within its length)', 'below (under the footprint)'):
        if k in s: print('    %-36s %6.2f mm at %s (%s)' % (k, s[k][0], s[k][1], s[k][2]))
    bd = bands(bx)
    for r in bd: print('  band at %.2f of its length (z %.2f): %.2f mm to the shell at %s (%s), inside %d' % (r['at'], r['z'], r['gap'], r['where'], r['mesh'], r['collide']))
    bu = board_under(bx); print('  board under it: %.1f mm2; its front %.2f mm behind the rear lobes (mouse z %.2f)' % (bu['area'], bu['front_behind_lobes'], bu['boardRearLobes']))
    pn = parts_near(bx)
    for r in pn: print('    part %-9s 3D gap %5.2f  underPlan %-5s collide %d  %s' % (r['ref'], r['gap3d'], r['underPlan'], r['collide'], r['note']))
    bs = bosses(bx)
    for b in bs: print('  post %s (%s) at X %+.2f Z %.2f: plan gap %+.2f' % (b['hole'], b['kind'], b['X'], b['Z'], b['plan_gap']))
    sh = screw_heads(bx); print('  screw heads: top Y %.2f; battery bottom %.2f above them' % (sh['head_top'], sh['vgap']))
    sk = skates(bx)
    for r in sk: print('  skate dot at %s: plan gap %+.2f (negative: under the battery), shell top over it Y %s, battery %s above' % (r['at'], r['plan_gap'], r['ledge_top'], r['vgap']))
    sl = side_lead(bx); print('  side-button lead: %.2f mm at %s' % (sl['gap'], sl['at']))
    an = antenna(bx); print('  antenna: keep-out %.2f mm; the antenna itself %.2f mm' % (an['keepout'], an['antenna']))
    wo = way_out(bx); print('  way out: %s (slide to the posts %.2f mm)' % (wo['note'], wo['slide_to_posts']))
    return dict(box=[round(float(v), 3) for v in bx], shell=s, bands=bd, board=bu, parts=pn, posts=bs, heads=sh, skates=sk,
                side_lead=sl, antenna=an, way_out=wo)


if __name__ == '__main__':
    a = sys.argv[1:]
    if '--shell' in a: SHELL_GLB[0] = a[a.index('--shell') + 1]
    bx = box_of()
    if '--z' in a:
        c = (bx[:3] + bx[3:]) / 2
        g = lambda k, d: float(a[a.index(k) + 1]) if k in a else d
        bx = box_of(centre=[g('--x', c[0]), g('--y', c[1]), g('--z', c[2])])
    if '--sweep' in a:
        i = a.index('--sweep'); z0, z1, st = float(a[i + 1]), float(a[i + 2]), float(a[i + 3]) if len(a) > i + 3 else 0.5
        c = (bx[:3] + bx[3:]) / 2
        for z in np.arange(z0, z1 - 1e-9, -abs(st)):
            b2 = box_of(centre=[c[0], c[1], z]); s = shell_clear(b2); bd = bands(b2)
            print('centre z %+7.2f  shell %5.2f (%s at %s)  bands %s  inside %d' % (z, s['min'][0], s['min'][2], s['min'][1], [r['gap'] for r in bd], s['collide']))
        sys.exit(0)
    r = report(bx, 'battery %s (%s)' % (BD.BATTERY['part'], BD.BATTERY.get('maker', '')))
    dst = next((x[7:] for x in a if x.startswith('--json=')), os.path.join(R3, 'pcb', 'work', 'clear.json'))
    os.makedirs(os.path.dirname(dst), exist_ok=True); json.dump(r, open(dst, 'w'), indent=1, default=str); print('wrote', dst)
