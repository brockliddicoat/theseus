"""The mouse's balance (F30.10: "balance stays at the center of the mouse"; F21.15: the battery balances it; F42.1: "Forward
and up"). H1 job 3, corrected and extended by H2 (2026-11-06).

  python3 tools/balance.py                 # from 3d/pcb: the cases, the battery's place for CoM z 0, writes balance.json
  python3 tools/balance.py --h1            # H1's original model (for comparison: the numbers Brock's 5.9 mm came from)

The masses are the deck's weight budget (29.31 g: shell 10.35, of it 1.0 the side switches (F44.2) and about 1.32 the four
boss posts (estimate), buttons 3.328, board 5.6 target (F42.2), battery 8.0, wheel 1.02, screws 0.418, inserts 0.516,
wires 0.08). Where each one sits comes from the 3D assets:
  shell ..... the rest of the shell (10.35 - 1.0 - the posts) at the shell body's volume centroid (3d/shell/
              shell-theseus-1seam.glb, signed volumes)
  side sw ... two full-size SPDT switches, 0.5 g each (F44.2), at their body centres as shell.js places them behind the
              side buttons (X 22.40; Y 19.82 / 22.65; Z 15.00 / -3.55)
  posts ..... the four boss posts over MH1-MH4 (#54), ESTIMATED (not in the 3D shell yet): tubes Ø5.3 / Ø3.5 of CF-PP from the
              board's top to the first shell surface above each hole (MH1/MH2: the triggers' undersides, 20.6 mm, which a
              real post can't hang from, so it is an upper bound; MH3/MH4: the body, 29.3 mm): 1.32 g
  buttons ... the two triggers' volume centroids
  board ..... the board's own centre of mass at its 5.6 g target: the bare board (laminate, copper, mask: mass.py's figures)
              at the CORE's centroid (the outline less the wheel bay, the switch window and the four holes), each part at
              its place by mass.py's per-part masses, the wheel's encoder (ENCM) and support (WB1) included (F42.2 puts them
              inside the 5.6 g: "a lighter encoder" is one of the ways there), all scaled to 5.6 g
  wheel ..... meta.wheel.center (the magnesium wheel 0.900 + its axle 0.116; the encoder and support are the board's)
  screws .... the board's four M2 screws, driven from below into the shell's bosses (#54; b11_board: "Theseus has no bottom
              plate: four screws from below hold the board"), at the board's holes MH1-MH4 (board.py), their centroid at
              the head under the board (mouse y 4.0); the four brass inserts at the bottom of the bosses, over the holes
              (y 6.5: board top 5.03 + half of the 3.0 mm insert)
  wires ..... the side-button lead, (0, 8, 0)
  battery ... board.py BATTERY (layout box; its middle yMid over the pad)
Mouse frame: +X the user's left, Z the nose, Y up from the pad; the middle of the footprint at z 0; mouse z = layout z - 2.88.

What H2 changed in H1's model (F39.2, "no flawed model silently reused"), each with its effect on the centre of mass:
  1. the screws and inserts sat at the optional bottom plate's four screws (shell meta.screws, mean z -3.5): the film's mouse
     has no plate and its four screws are the board's (mean z +10.75): +0.45 mm
  2. the bare board sat at the OUTLINE's centroid (layout z 21.65); its material is the core's (19.99, the bay is a hole)
  3. the encoder (1.0 g) and the support (0.26 g) were in neither the board nor the wheel (both scaled away): now inside the
     board's 5.6 g target, at their places
  4. (integrator, 10:1x) the side switches (F44.2) out of the shell's allowance, at their places: +0.55 mm
  5. (integrator, 10:1x) the boss posts, estimated, out of the shell's allowance: about +0.8 mm (re-run when S1 models them)
  Not modelled: the battery's PCM end (its 8 g is placed at the box's centre); the bands and their anchors; the leads.
"""
import json, math, os, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); R3 = os.path.abspath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, HERE); sys.path.insert(0, os.path.join(R3, 'shell', 'tools'))
import deps  # noqa: F401
import glbio
from shapely.geometry import Polygon, Point
from shapely.ops import unary_union
import board as BD
from board import BATTERY

BUD = dict(shell=10.35, btn=3.328, board=5.6, batt=8.0, wheel=1.02, screws=0.418, ins=0.516, wires=0.08)
# F44.2 (Brock, "From the shell"): the two full-size SPDT side switches, about 0.5 g each, come out of the shell's allowance
# (10.35 -> 9.35 g); the total stays 29.31 g. They sit where the 3D shell puts them (shell.js: behind each side button)
SIDE_SW_G = 0.5
# the four boss posts the board hangs from (#54), part of the shell's moulding: an ESTIMATE until the 3D shell models them
# (S1): a CF-PP tube (1.06 g/cm3, assumed) Ø5.3 outside (3d/parts/fasteners.js's stand-in boss) and Ø3.5 inside (the
# insert's bore), from the board's top up to the first shell surface over each hole
POST = dict(ro=2.65, ri=1.75, rho=1.06e-3)
# per-part masses (g), as mass.py's PER_FP (typical for the package class / derived from the 3D parts)
FPM = {'0402': 0.001, '0603': 0.0045, '0805': 0.010, 'L2016': 0.015, 'QFN32': 0.060, 'SOT666': 0.003, 'SOD523': 0.0015,
       'MODULE': 0.45, 'SENSOR': 0.25, 'USBC': 0.40, 'JSTSH3': 0.05, 'SLIDE': 0.10, 'SLIDEB': 0.08, 'SLIDEE': 0.12,
       'TACT': 0.05, 'GT01': 0.50, 'LENS': 0.07, 'ENC': 0.0, 'ENCM': 1.00, 'BRACKET': 0.26}
# heights of each part's centre of mass over the board's top (mm): the tall ones from pcb.glb's boxes (H2)
FPY = {'ENCM': 7.2, 'BRACKET': 6.9, 'GT01': 3.7, 'USBC': 0.8, 'LENS': -0.6}
BARE = dict(laminate=2.82, copper=0.964, mask=0.102, barrels=0.02)        # mass.py (work/mass.json), plan 5, 1.0 mm, 4 layers
EXTRA = [('MM3305 x3 under SW1', 0.09, 'SW1'), ('MM3305 x3 under SW2', 0.09, 'SW2'), ('solder', 0.06, None)]
H1_FPM = dict(FPM, ENCM=0.0, BRACKET=0.0)
meta = json.load(open(os.path.join(R3, 'shell', 'shell-theseus-1seam.json')))
js, b = glbio.read(os.path.join(R3, 'shell', 'shell-theseus-1seam.glb'))
DZ = -2.88


def centroid(name):
    n, d = glbio.mesh_arrays(js, b, name)
    P = d['POSITION'].astype(float) + np.array(n.get('translation', [0, 0, 0])); I = d['indices'].reshape(-1, 3)
    a, bb, c = P[I[:, 0]], P[I[:, 1]], P[I[:, 2]]
    v6 = np.einsum('ij,ij->i', a, np.cross(bb, c)); V = v6.sum() / 6
    return (v6[:, None] * (a + bb + c)).sum(0) / (24 * V), V


def core_poly():
    ol = BD.theseus_outline()
    holes = [Point(x, z).buffer(d / 2, quad_segs=16) for x, z, d, _ in BD.SORA_HOLES.values()]
    return ol.difference(unary_union([BD.wheel_cut_poly(), BD.square_cut_poly()] + holes))


def board_com(layout, mass=BUD['board'], h1=False):
    """the board's centre of mass in the mouse frame (X, Y, Z) with everything on it, scaled to `mass` (F42.2's target)"""
    dz, y0 = layout['boardOffsetZ_in_mouse'], layout['boardTopY_in_mouse']
    if h1:      # H1's: laminate and ~1.5 copper layers at the outline's centroid, the encoder and support left out
        P = Polygon(layout['outline']); c = P.centroid
        lam = 0.00185 * (P.area * 0.895) + 0.00896 * P.area * 0.0525 + 0.0015 * P.area * 0.04
        mom = [(lam, c.x, y0 - 0.5, c.y)]
        fpm, fpy, extra = H1_FPM, {}, []
    else:       # mass.py's bare board at the core's centroid (mouse X = -layout x)
        c = core_poly().centroid
        mom = [(sum(BARE.values()), -c.x, y0 - 0.5, c.y)]
        fpm, fpy, extra = FPM, FPY, EXTRA
    comps = {k.get('ref'): k for k in layout['components']}
    for k in layout['components']:
        m = fpm.get(k.get('fp'), 0.0)
        if m: mom.append((m, k['x'], y0 + fpy.get(k.get('fp'), 0.6), k['z']))
    for _, m, ref in extra:
        if ref: mom.append((m, comps[ref]['x'], y0 + 0.4, comps[ref]['z']))
        else: mom.append((m, -c.x, y0 + 0.05, c.y))
    M = sum(m for m, *_ in mom)
    X, Y, Z = (sum(m * v[i] for m, *v in mom) / M for i in range(3))
    return np.array([X, Y, Z + dz]), M


def side_switches():
    """the two side switches' body centres, as shell.js places them (xTop = min(bbox max x, 30.3) - 0.95 - 3.7, the switch
    6.5 tall from xTop - 6.5; at the button's mid-height; 1.2 mm behind its middle)"""
    out = []
    for sb in meta['sideButtons']:
        n, d = glbio.mesh_arrays(js, b, sb['name']); P = d['POSITION'].astype(float) + np.array(n.get('translation', [0, 0, 0]))
        mn, mx = P.min(0), P.max(0); xTop = min(mx[0], 30.3) - 0.95 - 3.7
        out.append(np.array([xTop - 3.25, (mn[1] + mx[1]) / 2, (mn[2] + mx[2]) / 2 - 1.2]))
    return out


def _first_above(X, Z, y0, names=('body', 'triggerL', 'triggerR', 'wheelBay')):
    """the lowest shell surface over (X, Z) above y0 (a vertical ray through the meshes)"""
    best = None
    for nm in names:
        n, d = glbio.mesh_arrays(js, b, nm); P = d['POSITION'].astype(float) + np.array(n.get('translation', [0, 0, 0]))
        I = d['indices'].reshape(-1, 3); A, Bv, Cv = P[I[:, 0]], P[I[:, 1]], P[I[:, 2]]
        v0, v1 = Bv - A, Cv - A
        d00 = v0[:, 0] ** 2 + v0[:, 2] ** 2; d01 = v0[:, 0] * v1[:, 0] + v0[:, 2] * v1[:, 2]; d11 = v1[:, 0] ** 2 + v1[:, 2] ** 2
        w0, w1 = X - A[:, 0], Z - A[:, 2]; d20 = w0 * v0[:, 0] + w1 * v0[:, 2]; d21 = w0 * v1[:, 0] + w1 * v1[:, 2]
        den = d00 * d11 - d01 * d01; ok = np.abs(den) > 1e-12; den = np.where(ok, den, 1)
        v = (d11 * d20 - d01 * d21) / den; u = (d00 * d21 - d01 * d20) / den
        m = ok & (u >= 0) & (v >= 0) & (u + v <= 1)
        y = A[m, 1] + v[m] * v0[m, 1] + u[m] * v1[m, 1]; y = y[y > y0]
        if len(y) and (best is None or y.min() < best[0]): best = (float(y.min()), nm)
    return best


def posts(y0=5.03):
    """the four boss posts over MH1-MH4 (estimate): [(g, [X, Y, Z], length, what is above)]"""
    out = []
    for k, (x, z, dia, _) in sorted(BD.SORA_HOLES.items()):
        X, Z = -x, z + DZ; top, nm = _first_above(X, Z, y0); L = top - y0
        g = math.pi * (POST['ro'] ** 2 - POST['ri'] ** 2) * L * POST['rho']
        out.append((g, [X, (y0 + top) / 2, Z], L, nm, k))
    return out


def com(parts):
    M = sum(m for m, p in parts.values())
    return sum(m * np.asarray(p, float) for m, p in parts.values()) / M, M


def board_screws():
    """the board's four screws (MH1-MH4), mouse X, Z"""
    return np.array([[-x, z + DZ] for x, z, d, _ in BD.SORA_HOLES.values()])


_PO = {}


def mouse(board_xyz, batt_xyz, h1=False, side=True, post=True):
    """every mass of the 29.31 g at its place. h1: H1's model (no side switches, no posts, the plate's screws)"""
    body, _ = centroid('body'); tl, _ = centroid('triggerL'); tr, _ = centroid('triggerR')
    wc = meta['wheel']['center']
    out = {}
    shell = BUD['shell']
    if h1:
        sc = np.array([[x, 0, z] for x, z in meta['screws']]).mean(0); scr, ins = [sc[0], 3.0, sc[2]], [sc[0], 6.0, sc[2]]
    else:
        s = board_screws().mean(0); scr, ins = [s[0], 4.0, s[1]], [s[0], 6.5, s[1]]
        if side:
            for i, p in enumerate(side_switches()): out['sideSw%d' % (i + 1)] = (SIDE_SW_G, p); shell -= SIDE_SW_G
        if post:
            if 'p' not in _PO: _PO['p'] = posts()
            for g, p, L, nm, k in _PO['p']: out['post ' + k] = (g, p); shell -= g
    out.update({
        'shell': (shell, body), 'btn': (BUD['btn'], (tl + tr) / 2), 'board': (BUD['board'], board_xyz),
        'batt': (BUD['batt'], batt_xyz), 'wheel': (BUD['wheel'], wc),
        'screws': (BUD['screws'], scr), 'ins': (BUD['ins'], ins), 'wires': (BUD['wires'], [0, 8.0, 0]),
    })
    return out


def battery_place(B=BATTERY):
    """the battery's centre in the mouse frame from board.py's BATTERY (layout box)"""
    return [-(B['x0'] + B['x1']) / 2, B['yMid'], (B['z0'] + B['z1']) / 2 + DZ]


def z_for_zero(board_xyz, h1=False, side=True, post=True):
    parts = mouse(board_xyz, [0, 0, 0], h1, side, post)
    rest = sum(m * np.asarray(p, float)[2] for k, (m, p) in parts.items() if k != 'batt')
    return -rest / BUD['batt']


if __name__ == '__main__':
    h1 = '--h1' in sys.argv
    lay = json.load(open(os.path.join(R3, 'pcb', 'pcb-layout.json')))
    old = '/home/claude/work/h1/pcb-layout.v1.json'
    bn, mn = board_com(lay, h1=h1)
    H1_PLACE = dict(x=-0.41, z=-24.95, y=7.46)          # H1's place (2.23 mm back of the old key plan), mouse
    cases = [('old key-plan place (2.23 fwd of H1\'s)', [H1_PLACE['x'], 7.46, H1_PLACE['z'] + 2.23]),
             ('H1\'s place (2.23 back)', [H1_PLACE['x'], 7.46, H1_PLACE['z']]),
             ('Brock\'s literal (5.90 fwd, 1.5 up)', [H1_PLACE['x'], 8.96, H1_PLACE['z'] + 5.90]),
             ('board.py BATTERY now', battery_place())]
    out = dict(model='H1 (2026-11-06 08:57)' if h1 else 'H2 (screws at the board holes, core centroid, encoder + support in the board)',
               board_com=[round(v, 2) for v in bn], board_parts_g_before_scaling=round(mn, 3))
    print('model:', out['model']); print('board CoM (mouse X, Y, Z): %+.2f %.2f %+.2f  (its parts %.2f g before scaling to %.2f g)' % (*bn, mn, BUD['board']))
    if not h1:
        print('masses (g) and places (mouse X, Y, Z):')
        for k, (m, p) in mouse(bn, battery_place(), h1).items():
            print('  %-10s %6.3f  (%+6.2f, %5.2f, %+6.2f)' % (k, m, *p))
        out['posts'] = [dict(hole=k, g=round(g, 3), centre=[round(v, 2) for v in p], length=round(L, 2), from_=nm) for g, p, L, nm, k in posts()]
        out['side_switches'] = [[round(v, 2) for v in p] for p in side_switches()]
    for tag, bp in cases:
        c, M = com(mouse(bn, bp, h1))
        out[tag] = dict(com=[round(v, 3) for v in c], battery=[round(v, 2) for v in bp], total_g=round(M, 2))
        print('%-44s CoM X %+.2f  Y %.2f  Z %+.3f   (battery centre z %+.2f, y %.2f)' % (tag, c[0], c[1], c[2], bp[2], bp[1]))
    if not h1:
        for tag, sd, po in (('without the posts (side switches in)', True, False), ('without the side switches and the posts', False, False)):
            zt = z_for_zero(bn, h1, sd, po); out['battery z for CoM z 0, ' + tag] = round(zt, 3)
            print('battery centre for CoM z 0 %-40s mouse z %+.3f (%+.3f mm from H1\'s place)' % (tag + ':', zt, zt - H1_PLACE['z']))
    zn = z_for_zero(bn, h1)
    out['battery z for CoM z 0'] = round(zn, 3); out['forward of H1\'s place'] = round(zn - H1_PLACE['z'], 3)
    print('battery centre for a CoM at z 0: mouse z %+.3f (%.3f mm forward of H1\'s place; front edge at mouse z %+.2f = layout %+.2f;'
          ' plan 5\'s rear lobes end at mouse z %+.2f)' % (zn, zn - H1_PLACE['z'], zn + 12.5, zn + 12.5 - DZ, BD.ZB + DZ))
    dst = '/home/claude/work/h2/balance%s.json' % ('_h1' if h1 else '')
    json.dump(out, open(dst, 'w'), indent=1); print('wrote', dst)
