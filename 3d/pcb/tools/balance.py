"""The mouse's balance (F30.10: "balance stays at the center of the mouse"; F21.15: the battery balances it), H1 job 3.

  python3 tools/balance.py [old_pcb_layout.json] [new_pcb_layout.json]      (from 3d/pcb)

The masses are the deck's weight budget (29.31 g: shell 10.35, buttons 3.328, board 5.6, battery 8.0, wheel 1.02, screws
0.418, inserts 0.516, wires 0.08). Where each one sits comes from the 3D assets: the shell body's and the triggers' volume
centroids (3d/shell/shell-theseus-1seam.glb), the wheel's centre (meta.wheel), the four plate screws (meta.screws), the
battery's box (board.py BATTERY), and the board's own centre of mass (its laminate and copper at the outline's centroid, each
part at its place, by mass.py's per-part masses, scaled to the budget's 5.6 g). Mouse frame: +X the user's left, Z the
nose, the middle of the footprint at z 0. Prints the centre of mass before (the v1 board, battery at the key plan's old
place) and after (plan 5, battery 2.23 mm back), and the battery place that would put it at z 0.
"""
import json, os, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); R3 = os.path.abspath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, HERE); sys.path.insert(0, os.path.join(R3, 'shell', 'tools'))
import deps  # noqa: F401
import glbio
from shapely.geometry import Polygon
from board import BATTERY

BUD = dict(shell=10.35, btn=3.328, board=5.6, batt=8.0, wheel=1.02, screws=0.418, ins=0.516, wires=0.08)
FPM = {'0402': 0.001, '0603': 0.0045, '0805': 0.010, 'L2016': 0.015, 'QFN32': 0.060, 'SOT666': 0.003, 'SOD523': 0.0015,
       'MODULE': 0.45, 'SENSOR': 0.25, 'USBC': 0.40, 'JSTSH3': 0.05, 'SLIDE': 0.10, 'SLIDEB': 0.08, 'SLIDEE': 0.12,
       'TACT': 0.05, 'GT01': 0.50, 'LENS': 0.07, 'ENC': 0.0, 'ENCM': 0.0, 'BRACKET': 0.0}   # the wheel's parts count as 'wheel'
meta = json.load(open(os.path.join(R3, 'shell', 'shell-theseus-1seam.json')))
js, b = glbio.read(os.path.join(R3, 'shell', 'shell-theseus-1seam.glb'))


def centroid(name):
    n, d = glbio.mesh_arrays(js, b, name)
    P = d['POSITION'].astype(float) + np.array(n.get('translation', [0, 0, 0])); I = d['indices'].reshape(-1, 3)
    a, bb, c = P[I[:, 0]], P[I[:, 1]], P[I[:, 2]]
    v6 = np.einsum('ij,ij->i', a, np.cross(bb, c)); V = v6.sum() / 6
    return (v6[:, None] * (a + bb + c)).sum(0) / (24 * V), V


def board_com(layout, mass=BUD['board']):
    """the board's centre of mass in the mouse frame (X, Y, Z), its parts by mass.py's masses, scaled to `mass`"""
    dz, y0 = layout['boardOffsetZ_in_mouse'], layout['boardTopY_in_mouse']
    P = Polygon(layout['outline']); c = P.centroid
    lam = 0.00185 * (P.area * 0.895) + 0.00896 * P.area * 0.0525 + 0.0015 * P.area * 0.04     # FR4 + ~1.5 copper layers + mask
    mom = [(lam, c.x, y0 - 0.5, c.y)]
    for k in layout['components']:
        m = FPM.get(k.get('fp'), 0.0)
        if m: mom.append((m, k['x'], y0 + 0.6, k['z']))
    M = sum(m for m, *_ in mom); s = mass / M
    X, Y, Z = (sum(m * v[i] for m, *v in mom) / M for i in range(3))
    return np.array([X, Y, Z + dz]), M


def com(parts):
    M = sum(m for m, p in parts.values())
    return sum(m * np.asarray(p, float) for m, p in parts.values()) / M, M


def mouse(board_xyz, batt_z, batt_x=-0.41):
    body, _ = centroid('body'); tl, _ = centroid('triggerL'); tr, _ = centroid('triggerR')
    sc = np.array([[x, 0, z] for x, z in meta['screws']]).mean(0)
    wc = meta['wheel']['center']
    return {
        'shell': (BUD['shell'], body), 'btn': (BUD['btn'], (tl + tr) / 2), 'board': (BUD['board'], board_xyz),
        'batt': (BUD['batt'], [batt_x, BATTERY['yMid'], batt_z]), 'wheel': (BUD['wheel'], wc),
        'screws': (BUD['screws'], [sc[0], 3.0, sc[2]]), 'ins': (BUD['ins'], [sc[0], 6.0, sc[2]]), 'wires': (BUD['wires'], [0, 8.0, 0]),
    }


if __name__ == '__main__':
    old_p = sys.argv[1] if len(sys.argv) > 1 else '/home/claude/work/h1/pcb-layout.v1.json'
    new_p = sys.argv[2] if len(sys.argv) > 2 else os.path.join(R3, 'pcb', 'pcb-layout.json')
    bo, mo = board_com(json.load(open(old_p))); bn, mn = board_com(json.load(open(new_p)))
    zc_new = (BATTERY['z0'] + BATTERY['z1']) / 2 - 2.88; zc_old = zc_new + 2.23
    out = {}
    for tag, bxyz, bz in (('before (v1 board, battery at the key plan\'s old place)', bo, zc_old),
                          ('plan 5, battery unmoved', bn, zc_old), ('after (plan 5, battery 2.23 mm back)', bn, zc_new)):
        c, M = com(mouse(bxyz, bz))
        out[tag] = dict(com=[round(v, 2) for v in c], board_com=[round(v, 2) for v in bxyz], battery_z=round(bz, 2), total_g=round(M, 2))
        print('%-55s CoM X %+.2f  Y %.2f  Z %+.2f   (board CoM z %+.2f, battery z %+.2f)' % (tag, c[0], c[1], c[2], bxyz[2], bz))
    # the battery's place for z 0, everything else as plan 5
    parts = mouse(bn, 0.0); rest = sum(m * np.asarray(p, float)[2] for k, (m, p) in parts.items() if k != 'batt')
    z_need = -rest / BUD['batt']
    out['battery z for CoM z 0'] = round(z_need, 2)
    print('battery centre for a CoM at z 0: mouse z %+.2f (its front edge at %+.2f; plan 5\'s rear lobes end at mouse z %+.2f)'
          % (z_need, z_need + 12.5, -7.61 - 2.88))
    json.dump(out, open('/home/claude/work/h1/balance.json', 'w'), indent=1)
