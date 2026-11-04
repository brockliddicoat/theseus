# Component models for the Theseus PCB. Each template is built in its footprint frame (pre-mirror layout frame:
# x right, z forward, y up from the board top at 0) and returned as {material: Mesh}. add_components() writes one
# glTF node per component (shared meshes per template), mirrored into the physical three.js frame.
import math
import numpy as np
from shapely.geometry import Polygon, Point, box, LineString
from shapely.ops import unary_union
from shapely import affinity
from geom import (Mesh, polys, cap, walls, raised, slab, box_mesh, rbox_mesh, extrude_mesh, cyl_mesh, tube_mesh,
                  grid_surface, fillet_mesh, transform, trs, hershey_text, outline_text, qr_modules, matrix_polys)
from board_geo import Y_PAD, T, Y_MASK
from parts import FP, GND

Y0 = Y_PAD + 0.018        # component seating plane (on the solder layer)
MIRROR = np.diag([-1.0, 1.0, 1.0, 1.0])


def mm(*pairs):
    out = {}
    for mat, m in pairs:
        if m is None or m.n == 0:
            continue
        if mat in out:
            out[mat].merge(m)
        else:
            out[mat] = m
    return out


def merge_into(d, mat, m, T_=None):
    if m is None or m.n == 0:
        return
    if mat not in d:
        d[mat] = Mesh()
    d[mat].merge(m, T_)


def text_mesh(g, y, up=True):
    m = Mesh()
    cap(m, g, y, up=up)
    return m


# ------------------------------------------------------------------ passive chips
CHIP = {  # L, W, H, cap length
    ('0402', 'C'): (1.0, 0.5, 0.5, 0.24), ('0402', 'R'): (1.0, 0.5, 0.33, 0.2),
    ('0603', 'C'): (1.6, 0.8, 0.8, 0.35), ('0603', 'R'): (1.6, 0.8, 0.45, 0.3),
}


def chip_template(size, kind, value=''):
    L, W, H, cl = CHIP[(size, kind)]
    fp = FP[size]()
    pad_out = max(p['x'] + p['w'] / 2 for p in fp['pads'])
    d = {}
    if kind == 'C':
        body = rbox_mesh(L - 2 * cl + 0.02, H * 0.995, W * 0.99, 0.03, rb=0.03)
        merge_into(d, 'ceramic', body, trs(0, Y0, 0))
    else:
        sub = rbox_mesh(L - 2 * cl + 0.02, H * 0.8, W, 0.02, rb=0.02)
        merge_into(d, 'white_plastic', sub, trs(0, Y0, 0))
        coat = rbox_mesh(L - 2 * cl - 0.04, H * 0.22, W * 0.9, 0.02, rb=0.03)
        merge_into(d, 'epoxy', coat, trs(0, Y0 + H * 0.8, 0))
        if value:
            code = {'4.7k': '472', '5.1k': '512'}.get(value, '')
            if code:
                g = hershey_text(code, W * 0.42, 0, 0, w=0.035, rot=0)
                merge_into(d, 'laser', text_mesh(g, Y0 + H + 0.002), None)
    for s in (-1, 1):
        c = rbox_mesh(cl, H + 0.012, W + 0.012, 0.035, rb=0.04)
        merge_into(d, 'tin', c, trs(s * (L / 2 - cl / 2), Y0 - 0.006, 0))
        f = fillet_mesh(0.0, (pad_out - L / 2) + 0.02, W * 0.98, H * (0.42 if kind == 'C' else 0.55), y0=Y_PAD - 0.002)
        if s < 0:
            f = transform(f, ry_deg=180)
        merge_into(d, 'solder', f, trs(s * L / 2, 0, 0))
    return d


def inductor_template():
    L, W, H = 2.0, 1.6, 1.0
    fp = FP['L2016']()
    pad_out = max(p['x'] + p['w'] / 2 for p in fp['pads'])
    d = {}
    body = rbox_mesh(L, H, W, 0.08, rb=0.06)
    merge_into(d, 'ferrite', body, trs(0, Y0 + 0.01, 0))
    for s in (-1, 1):
        e = box_mesh(0.03, 0.22, W * 0.7)
        merge_into(d, 'tin', e, trs(s * (L / 2 + 0.012), Y0 + 0.12, 0))
        f = fillet_mesh(0.0, pad_out - L / 2 + 0.02, W * 0.85, 0.36, y0=Y_PAD - 0.002)
        if s < 0:
            f = transform(f, ry_deg=180)
        merge_into(d, 'solder', f, trs(s * L / 2, 0, 0))
    g = Point(0.55, 0.42).buffer(0.09, quad_segs=6)
    merge_into(d, 'laser', text_mesh(g, Y0 + 0.01 + H + 0.002))
    return d


# ------------------------------------------------------------------ ICs
def qfn32_template():
    d = {}
    Hb = 0.85
    body = rbox_mesh(5.0, Hb, 5.0, 0.06, rb=0.05)
    merge_into(d, 'epoxy', body, trs(0, Y0 + 0.02, 0))
    # exposed lead ends on the four sides + toe fillets onto the PCB lands
    lead = box_mesh(0.24, 0.2, 0.06)
    for i in range(8):
        o = 1.75 - 0.5 * i
        for (x, z, ry) in ((-2.5, o, 90), (o, -2.5, 0), (2.5, -o, 90), (-o, 2.5, 0)):
            T_ = trs(x, Y0 + 0.12, z, ry_deg=ry)
            merge_into(d, 'tin', lead, T_)
            # toe fillet pointing outward
            f = fillet_mesh(0.0, 0.36, 0.24, 0.17, y0=Y_PAD - 0.002, nu=5, nv=7)
            if abs(x) > 2.4:
                ang = 0 if x > 0 else 180
            else:
                ang = -90 if z > 0 else 90
            merge_into(d, 'solder', f, trs(x, 0, z) @ trs(ry_deg=ang))
    # pin-1 dimple + laser marking (nPM1300 real part; lot/date code representative)
    dim = cyl_mesh(0.22, 0.02, seg=20, y0=Y0 + 0.02 + Hb - 0.015)
    merge_into(d, 'laser', dim, trs(-1.75, 0, 1.75))
    for t, z, h in (('N1300', 0.55, 0.62), ('QAAA0', -0.35, 0.42), ('2611D', -1.1, 0.42)):
        g = hershey_text(t, h, 0.15, z, w=0.07)
        merge_into(d, 'laser', text_mesh(g, Y0 + 0.02 + Hb + 0.002))
    return d


def sot666_template():
    d = {}
    body = rbox_mesh(1.2, 0.5, 1.6, 0.05, rb=0.04)
    merge_into(d, 'epoxy', body, trs(0, Y0 + 0.03, 0))
    for i, z in enumerate((0.5, 0.0, -0.5)):
        for s in (-1, 1):
            lead = box_mesh(0.32, 0.1, 0.22)
            merge_into(d, 'tin', lead, trs(s * 0.72, Y0 + 0.02, z))
            f = fillet_mesh(0.0, 0.18, 0.22, 0.12, y0=Y_PAD - 0.002, nu=4, nv=6)
            merge_into(d, 'solder', f, trs(s * 0.86, 0, z) @ trs(ry_deg=0 if s > 0 else 180))
    merge_into(d, 'laser', text_mesh(Point(-0.35, 0.55).buffer(0.08), Y0 + 0.532))
    return d


def sod523_template():
    d = {}
    body = rbox_mesh(0.9, 0.55, 0.8, 0.06, rb=0.05)
    merge_into(d, 'epoxy', body, trs(0, Y0 + 0.02, 0))
    for s in (-1, 1):
        lead = box_mesh(0.3, 0.12, 0.34)
        merge_into(d, 'tin', lead, trs(s * 0.55, Y0 + 0.03, 0))
        f = fillet_mesh(0.0, 0.25, 0.34, 0.13, y0=Y_PAD - 0.002, nu=4, nv=6)
        merge_into(d, 'solder', f, trs(s * 0.68, 0, 0) @ trs(ry_deg=0 if s > 0 else 180))
    band = box_mesh(0.14, 0.01, 0.7)
    merge_into(d, 'laser', band, trs(0.25, Y0 + 0.575, 0))
    return d


# ------------------------------------------------------------------ module, sensor, lens
def module_template():
    d = {}
    W, Lm, Hs = 9.9, 13.3, 0.8
    sub_h0 = Y0 + 0.01
    # substrate (blue mask) with its FR4 side edges
    sub = rbox_mesh(W, Hs, Lm, 0.05, rb=0.02)
    merge_into(d, 'module_pcb', sub, trs(0, sub_h0, 0))
    # castellations: gold half-hole strips on the long sides and rear edge + solder fillets onto the main-board lands
    fp = FP['MODULE']()
    for p in fp['pads']:
        x, z = p['x'], p['z']
        if p['name'].startswith('B'):
            strip = box_mesh(0.42, Hs - 0.04, 0.02)
            merge_into(d, 'enig', strip, trs(x, sub_h0 + 0.02, z - 0.005))
            hole = cyl_mesh(0.16, Hs - 0.02, seg=10, y0=sub_h0 + 0.01, top=False, bottom=False)
            merge_into(d, 'enig', hole, trs(x, 0, z + 0.03))
            f = fillet_mesh(0.0, 0.56, 0.4, 0.3, y0=Y_PAD - 0.002, nu=6, nv=8, side_flare=0.03)
            merge_into(d, 'solder', f, trs(x, 0, z) @ trs(ry_deg=90))
        else:
            s = 1 if x > 0 else -1
            strip = box_mesh(0.02, Hs - 0.04, 0.42)
            merge_into(d, 'enig', strip, trs(x + s * 0.005, sub_h0 + 0.02, z))
            hole = cyl_mesh(0.16, Hs - 0.02, seg=10, y0=sub_h0 + 0.01, top=False, bottom=False)
            merge_into(d, 'enig', hole, trs(x - s * 0.03, 0, z))
            f = fillet_mesh(0.0, 0.56, 0.4, 0.3, y0=Y_PAD - 0.002, nu=6, nv=8, side_flare=0.03)
            merge_into(d, 'solder', f, trs(x, 0, z) @ trs(ry_deg=0 if s > 0 else 180))
    # shield can (nickel silver), over the radio + passives; antenna end (z > 3.25) left open
    top = sub_h0 + Hs
    can_h = 2.0 - (top - Y0)
    can = rbox_mesh(W - 0.4, can_h, 9.55, 0.25, rb=0.12)
    zc = -6.65 + 0.2 + 9.55 / 2
    merge_into(d, 'nickel', can, trs(0, top, zc))
    # laser marking on the can (module identity per the brief; certifications are "intended", so no FCC ID printed)
    ytxt = top + can_h + 0.002
    for t, z, h, wl in (('Raytac', zc + 3.35, 0.72, 0.09), ('AN54LM-20A', zc + 2.25, 0.62, 0.08),
                        ('nRF54LM20A', zc + 1.35, 0.5, 0.07), ('2.4GHz  BLE 6.0', zc + 0.55, 0.42, 0.06)):
        g = hershey_text(t, h, -0.8, z, w=wl)
        merge_into(d, 'laser', text_mesh(g, ytxt))
    M = qr_modules('AN54LM-20A SN2611-0420', error='l')
    g = matrix_polys(M, 3.3, -0.8, zc - 2.5, invert=False, quiet=0)
    merge_into(d, 'laser', text_mesh(g, ytxt))
    g = hershey_text('MADE IN TAIWAN', 0.34, 2.75, zc - 2.5, w=0.05, rot=90)
    merge_into(d, 'laser', text_mesh(g, ytxt))
    # antenna end: chip antenna + matching network + white silk outline on the blue mask
    ya = top
    chip = rbox_mesh(3.2, 0.9, 1.6, 0.05, rb=0.04)
    merge_into(d, 'epoxy', chip, trs(-0.6, ya + 0.02, 5.25))
    for s in (-1, 1):
        e = rbox_mesh(0.35, 0.92, 1.62, 0.04, rb=0.04)
        merge_into(d, 'tin', e, trs(-0.6 + s * 1.43, ya + 0.015, 5.25))
    for (x, z) in ((2.6, 4.7), (2.6, 5.6), (3.4, 4.7)):
        c = rbox_mesh(0.6, 0.3, 0.3, 0.02, rb=0.02)
        merge_into(d, 'ceramic', c, trs(x, ya + 0.01, z))
        for s in (-1, 1):
            merge_into(d, 'tin', box_mesh(0.14, 0.31, 0.31), trs(x + s * 0.24, ya + 0.155, z))
    outline = box(-2.6, 4.2, 1.4, 6.3).exterior.buffer(0.05)
    merge_into(d, 'silk', text_mesh(unary_union([outline, hershey_text('ANT', 0.4, 2.9, 6.15, w=0.06)]), ya + 0.004))
    # module pads (gold) peeking on the substrate top near the antenna feed
    merge_into(d, 'enig', text_mesh(unary_union([box(1.9, 3.7, 2.4, 4.1), box(-3.4, 3.7, -2.9, 4.1)]), ya + 0.006))
    return d


def sensor_template():
    """next-gen PixArt FrameSync-class sensor (proposal): generic 9.0 x 11.0 x 2.2 mm package, 2 x 8 side lands."""
    d = {}
    H = 2.2
    body = rbox_mesh(9.0, H, 11.0, 0.18, rb=0.12)
    merge_into(d, 'epoxy', body, trs(0, Y0 + 0.02, 0))
    fp = FP['SENSOR']()
    for p in fp['pads']:
        s = 1 if p['x'] > 0 else -1
        strip = box_mesh(0.025, 0.85, 0.5)
        merge_into(d, 'enig', strip, trs(s * 4.505, Y0 + 0.02, p['z']))
        f = fillet_mesh(0.0, 0.62, 0.55, 0.45, y0=Y_PAD - 0.002, nu=6, nv=8)
        merge_into(d, 'solder', f, trs(s * 4.5, 0, p['z']) @ trs(ry_deg=0 if s > 0 else 180))
    ytop = Y0 + 0.02 + H + 0.002
    # top: shallow molded recess + marking (no part number: proposal)
    ring = Point(0, 1.6).buffer(1.35, quad_segs=24).difference(Point(0, 1.6).buffer(1.2, quad_segs=24))
    merge_into(d, 'laser', text_mesh(ring, ytop))
    for t, z, h in (('FS-NEXT', -1.2, 0.8), ('ES  2611', -2.6, 0.55), ('PROPOSAL', -3.7, 0.5)):
        merge_into(d, 'laser', text_mesh(hershey_text(t, h, 0, z, w=0.08), ytop))
    merge_into(d, 'laser', text_mesh(Point(-3.6, 4.6).buffer(0.25), ytop))
    return d


def lens_template():
    """smaller clip-on lens (#37) under the board; two arms pass through the PCB slots and snap over the package."""
    d = {}
    yb = -T - 0.07                    # just under the bottom mask
    body = rbox_mesh(7.6, 2.2, 8.6, 0.6, rb=0.3)
    merge_into(d, 'clear', transform(body, x=0, y=0, z=0, rx_deg=180), trs(0, yb, 0))      # hangs down from yb
    # imaging dome on the underside + light-guide prism
    dome = grid_surface(lambda u, v: (1.25 * math.sin(u * math.pi / 2) * math.cos(v * 2 * math.pi),
                                      -0.55 * math.cos(u * math.pi / 2),
                                      1.25 * math.sin(u * math.pi / 2) * math.sin(v * 2 * math.pi)), 10, 28)
    merge_into(d, 'clear', dome, trs(0, yb - 2.2, 0))
    prism = box_mesh(2.2, 1.6, 1.6)
    merge_into(d, 'clear', prism, trs(0, yb - 2.2 - 0.3, -3.0, rx_deg=35))
    # clip arms through the slots (z = +/-6.0) hooking over the package ends (z = +/-5.5, top at ~2.3)
    for s in (-1, 1):
        arm = box_mesh(1.6, 4.9, 0.5)
        merge_into(d, 'clear', arm, trs(0, yb + 4.9 / 2 - 0.3, s * 6.0))
        hook = box_mesh(1.6, 0.35, 0.95)
        merge_into(d, 'clear', hook, trs(0, 2.4, s * 5.65))
        bridge = box_mesh(1.6, 0.4, 2.0)
        merge_into(d, 'clear', bridge, trs(0, yb - 0.2, s * 5.2))
    return d


# ------------------------------------------------------------------ connectors
def stadium(w, h):
    r = h / 2
    return LineString([(-(w / 2 - r), 0), (w / 2 - r, 0)]).buffer(r, quad_segs=10)


def usbc_template():
    d = {}
    L, Wo, Ho, t = 7.35, 8.94, 3.16, 0.2
    yb = Y0 + 0.02
    ring = stadium(Wo, Ho).difference(stadium(Wo - 2 * t, Ho - 2 * t))
    m = Mesh(); slab(m, ring, -L / 2, L / 2)                     # extruded along "y" in (x, z) -> rotate to z
    T_rot = trs(0, yb + Ho / 2, 0, rx_deg=90)
    merge_into(d, 'steel', m, T_rot)
    back = Mesh(); slab(back, stadium(Wo - 2 * t, Ho - 2 * t), -0.1, 0.1)
    merge_into(d, 'steel', back, trs(0, yb + Ho / 2, -L / 2 + 0.25, rx_deg=90))
    # seam along the bottom + two small dimples on top (stamped shell)
    seam = box_mesh(0.05, 0.02, L * 0.98)
    merge_into(d, 'epoxy', seam, trs(0.0, yb + 0.005, 0))
    for x in (-2.2, 2.2):
        merge_into(d, 'steel', cyl_mesh(0.35, 0.05, seg=16, y0=yb + Ho - 0.01), trs(x, 0, 1.2))
    # tongue with contacts
    tong = rbox_mesh(6.6, 0.7, 5.6, 0.12, rb=0.05)
    merge_into(d, 'black_plastic', tong, trs(0, yb + Ho / 2 - 0.35, 0.4))
    for i in range(12):
        x = -2.75 + i * 0.5
        merge_into(d, 'enig', box_mesh(0.25, 0.02, 2.4), trs(x, yb + Ho / 2 + 0.36, 1.9))
        merge_into(d, 'enig', box_mesh(0.25, 0.02, 2.4), trs(x, yb + Ho / 2 - 0.37, 1.9))
    # mounting legs into the plated slots + solder (top and bottom)
    for (x, z, lz) in ((-4.32, 0.78, 1.5), (4.32, 0.78, 1.5), (-4.32, -3.03, 1.1), (4.32, -3.03, 1.1)):
        leg = box_mesh(0.28, 2.0, lz)
        merge_into(d, 'steel', leg, trs(x, yb + 0.2 - 1.0, z))
        sol = cyl_mesh(0.55, 0.12, seg=16, y0=Y_PAD - 0.01, r_top=0.22)
        merge_into(d, 'solder', transform(sol, s=1.0), trs(x, 0, z) @ np.diag([0.9, 1, (lz + 0.5) / 1.1, 1]))
        solb = cyl_mesh(0.55, 0.35, seg=16, y0=0, r_top=0.18)
        merge_into(d, 'solder', solb, trs(x, -T - 0.04, z) @ np.diag([0.9, -1, (lz + 0.5) / 1.1, 1]))
    # SMD signal tails at the rear onto the 12 lands
    xs = [-3.2, -2.4, -1.75, -1.25, -0.75, -0.25, 0.25, 0.75, 1.25, 1.75, 2.4, 3.2]
    for x in xs:
        w = 0.42 if abs(x) > 2 else 0.2
        path = [(x, yb + 0.55, -L / 2 + 0.2), (x, yb + 0.55, -L / 2 - 0.15), (x, yb + 0.2, -L / 2 - 0.35), (x, Y0 + 0.02, -L / 2 - 0.55), (x, Y0 + 0.02, -4.35)]
        for a, b in zip(path[:-1], path[1:]):
            c = (np.array(a) + np.array(b)) / 2
            dv = np.array(b) - np.array(a); ln = np.linalg.norm(dv)
            ang = math.degrees(math.atan2(dv[1], -dv[2]))
            merge_into(d, 'tin', box_mesh(w, 0.08, ln + 0.02), trs(c[0], c[1], c[2], rx_deg=ang))
        f = fillet_mesh(0.0, 0.42, w + 0.05, 0.12, y0=Y_PAD - 0.002, nu=5, nv=6)
        merge_into(d, 'solder', f, trs(x, 0, -4.32) @ trs(ry_deg=90))
        f2 = fillet_mesh(0.0, 0.25, w + 0.05, 0.09, y0=Y_PAD - 0.002, nu=4, nv=6)
        merge_into(d, 'solder', f2, trs(x, 0, -3.95) @ trs(ry_deg=-90))
    return d


def jst_template():
    """JST SH 3-pin side-entry header, opening toward local +z; returns header only (plug separate)."""
    d = {}
    Wd, D, H = 4.0, 4.25, 2.95
    yb = Y0 + 0.02
    hous = rbox_mesh(Wd, H, D, 0.12, rb=0.1)
    merge_into(d, 'white_plastic', hous, trs(0, yb, 0))
    cav = box_mesh(3.2, 1.55, 0.02)
    merge_into(d, 'epoxy', cav, trs(0, yb + 1.45, D / 2 + 0.002))
    for i in range(3):
        x = -1.0 + i
        # contact tail from the back wall down onto the land
        merge_into(d, 'tin', box_mesh(0.22, 0.6, 0.12), trs(x, yb + 0.3, -D / 2 - 0.06))
        merge_into(d, 'tin', box_mesh(0.22, 0.08, 1.15), trs(x, Y0 + 0.02, -D / 2 - 0.5))
        f = fillet_mesh(0.0, 0.35, 0.3, 0.16, y0=Y_PAD - 0.002, nu=4, nv=6)
        merge_into(d, 'solder', f, trs(x, 0, -3.05) @ trs(ry_deg=90))
        merge_into(d, 'enig', box_mesh(0.2, 0.02, 1.6), trs(x, yb + 1.2, D / 2 - 0.9))
    for s in (-1, 1):
        tab = box_mesh(0.12, 1.9, 1.5)
        merge_into(d, 'tin', tab, trs(s * (Wd / 2 + 0.06), yb + 0.95, 0.4))
        foot = box_mesh(0.9, 0.1, 1.5)
        merge_into(d, 'tin', foot, trs(s * (Wd / 2 + 0.5), Y0 + 0.05, 0.4))
        f = fillet_mesh(0.0, 0.3, 1.5, 0.22, y0=Y_PAD - 0.002, nu=4, nv=8)
        merge_into(d, 'solder', f, trs(s * (Wd / 2 + 0.95), 0, 0.4) @ trs(ry_deg=0 if s > 0 else 180))
    return d


def jst_plug_template():
    d = {}
    hous = rbox_mesh(3.6, 2.6, 3.4, 0.15, rb=0.12)
    merge_into(d, 'white_plastic', hous, trs(0, Y0 + 0.22, 2.125 + 1.7 - 0.9))
    latch = box_mesh(1.6, 0.3, 1.8)
    merge_into(d, 'white_plastic', latch, trs(0, Y0 + 2.95, 2.125 + 1.4))
    return d


def slide_template():
    d = {}
    yb = Y0 + 0.02
    body = rbox_mesh(1.8, 1.0, 4.6, 0.08, rb=0.06)
    merge_into(d, 'black_plastic', body, trs(0, yb, 0))
    cover = rbox_mesh(1.86, 0.08, 4.66, 0.05, rb=0.02)
    merge_into(d, 'steel', cover, trs(0, yb + 1.0, 0))
    for s in (-1, 1):
        merge_into(d, 'steel', box_mesh(1.86, 0.9, 0.06), trs(0, yb + 0.45, s * 2.31))
        merge_into(d, 'tin', box_mesh(1.0, 0.08, 0.6), trs(0.15, Y0 + 0.04, s * 2.65))
        f = fillet_mesh(0.0, 0.3, 1.0, 0.18, y0=Y_PAD - 0.002, nu=4, nv=6)
        merge_into(d, 'solder', f, trs(0.15, 0, s * 2.85) @ trs(ry_deg=-90 * s))
    return d


def slide_knob_template():
    d = {}
    knob = rbox_mesh(1.0, 0.75, 0.9, 0.08, rb=0.08)
    merge_into(d, 'black_plastic', knob, trs(-1.25, Y0 + 0.2, 0))
    ridge = box_mesh(0.95, 0.06, 0.12)
    for z in (-0.25, 0.0, 0.25):
        merge_into(d, 'black_plastic', ridge, trs(-1.27, Y0 + 0.97, z))
    return d


# ------------------------------------------------------------------ mechanics
def encoder_template():
    """TTC-style vertical mechanical encoder (Sora V2 has a blue one), shaft toward local +x at the axle height."""
    d = {}
    AX = 12.0
    yb = Y0 + 0.05
    hous = rbox_mesh(3.4, 14.0, 9.4, 0.25, rb=0.25)
    merge_into(d, 'blue_plastic', hous, trs(-0.1, yb, 0))
    # steel frame: two end plates + top strap + outer side plate with a rivet boss
    for s in (-1, 1):
        merge_into(d, 'steel', box_mesh(3.7, 13.4, 0.18), trs(-0.1, yb + 6.75, s * 4.82))
    merge_into(d, 'steel', box_mesh(3.7, 0.18, 9.8), trs(-0.1, yb + 14.0, 0))
    # plate drawn in (u=z_enc, v=y_enc) on the (x,z) plane, thickness along y -> permute to (x=thickness, y=v, z=u)
    side = Mesh(); slab(side, box(-4.6, 0.8, 4.6, 13.6).difference(Point(0, AX).buffer(1.9)), -0.09, 0.09)
    PERM_U = np.array([[0, 1, 0, 0], [0, 0, 1, 0], [1, 0, 0, 0], [0, 0, 0, 1]], float)
    merge_into(d, 'steel', side, trs(-1.92, yb - 0.1, 0) @ PERM_U)
    rivet = cyl_mesh(1.25, 0.35, seg=28, axis='x')
    merge_into(d, 'steel', rivet, trs(-2.05 - 0.35, yb + AX - 0.1, 0))
    # shaft boss + D-hole toward the wheel
    boss = cyl_mesh(1.55, 0.7, seg=32, axis='x')
    merge_into(d, 'black_plastic', boss, trs(1.6, yb + AX - 0.05, 0))
    hole = cyl_mesh(1.05, 0.02, seg=24, axis='x')
    merge_into(d, 'epoxy', hole, trs(2.31, yb + AX - 0.05, 0))
    # pins (through-hole, pin-in-paste) + fillets top/bottom; frame tabs (SMD feet)
    for z in (2.5, 0.0, -2.5):
        pin = box_mesh(0.5, 3.2, 0.3)
        merge_into(d, 'tin', pin, trs(0.3, yb + 0.3 - 1.6 - 0.7, z))
        merge_into(d, 'solder', cyl_mesh(0.68, 0.14, seg=16, y0=Y_PAD - 0.01, r_top=0.32), trs(0.3, 0, z))
        merge_into(d, 'solder', transform(cyl_mesh(0.68, 0.4, seg=16, y0=0, r_top=0.26), ry_deg=0) , trs(0.3, -T - 0.04, z) @ np.diag([1, -1, 1, 1]))
    for z in (4.45, -4.45):
        merge_into(d, 'steel', box_mesh(1.0, 0.12, 1.2), trs(-1.55, Y0 + 0.06, z))
        merge_into(d, 'steel', box_mesh(0.12, 0.9, 1.2), trs(-2.0, Y0 + 0.5, z))
        f = fillet_mesh(0.0, 0.25, 1.15, 0.2, y0=Y_PAD - 0.002, nu=4, nv=6)
        merge_into(d, 'solder', f, trs(-1.05, 0, z))
    return d


def bracket_template():
    """wheel axle bracket (black POM) over the middle-click switch; boss toward local -x (the wheel)."""
    d = {}
    AX = 12.0
    yb = Y0 + 0.05
    base = Mesh()
    slab(base, box(-2.7, -3.95, 2.7, 3.95).difference(box(-1.9, -1.8, 1.9, 1.8)), yb + 0.0, yb + 2.4)
    merge_into(d, 'black_plastic', base, None)
    post = rbox_mesh(1.8, AX + 1.6 - 2.4, 3.6, 0.2, rb=0.3)
    merge_into(d, 'black_plastic', post, trs(-1.6, yb + 2.4, 0))
    boss = cyl_mesh(1.6, 2.6, seg=32, axis='x')
    merge_into(d, 'black_plastic', boss, trs(-2.5 - 2.6 + 1.3, yb + AX, 0))
    bore = cyl_mesh(0.75, 0.02, seg=24, axis='x')
    merge_into(d, 'epoxy', bore, trs(-2.5 - 2.6 + 1.3 - 1.31, yb + AX, 0))
    for (x, z) in ((-2.1, 3.45), (2.1, 3.45), (-2.1, -3.45), (2.1, -3.45)):
        merge_into(d, 'tin', box_mesh(1.0, 0.12, 0.8), trs(x, Y0 + 0.06, z))
        merge_into(d, 'tin', box_mesh(0.12, 1.2, 0.8), trs(x + (0.5 if x > 0 else -0.5), Y0 + 0.6, z))
        f = fillet_mesh(0.0, 0.18, 0.8, 0.22, y0=Y_PAD - 0.002, nu=4, nv=6)
        merge_into(d, 'solder', f, trs(x + (0.5 if x > 0 else -0.5), 0, z) @ trs(ry_deg=0 if x > 0 else 180))
    return d


def tact_template():
    d = {}
    body = rbox_mesh(3.5, 1.1, 2.9, 0.1, rb=0.05)
    merge_into(d, 'black_plastic', body, trs(0, Y0 + 0.02, 0))
    merge_into(d, 'steel', box_mesh(3.3, 0.08, 2.7), trs(0, Y0 + 1.16, 0))
    merge_into(d, 'black_plastic', cyl_mesh(0.55, 0.45, seg=20, y0=Y0 + 1.2))
    for s in (-1, 1):
        merge_into(d, 'tin', box_mesh(0.9, 0.08, 1.4), trs(s * 2.05, Y0 + 0.04, 0))
        f = fillet_mesh(0.0, 0.3, 1.4, 0.16, y0=Y_PAD - 0.002, nu=4, nv=6)
        merge_into(d, 'solder', f, trs(s * 2.45, 0, 0) @ trs(ry_deg=0 if s > 0 else 180))
    return d


def millmax_template():
    """Mill-Max 3305-0 receptacle [DS]: flange 1.956 x 0.254 above the board, body 1.473, length 2.667 mm."""
    d = {}
    rF, rB, hF, Lh = 0.978, 0.7365, 0.254, 2.667
    y_top = Y_PAD + hF
    fl = cyl_mesh(rF, hF, seg=32, y0=Y_PAD, top=False, bottom=False)
    merge_into(d, 'tin', fl, None)
    ring = Point(0, 0).buffer(rF, quad_segs=10).difference(Point(0, 0).buffer(0.46, quad_segs=10))
    m = Mesh(); cap(m, ring, y_top, up=True); merge_into(d, 'tin', m)
    # bore with the gold contact visible inside
    bore = cyl_mesh(0.46, 0.5, seg=24, y0=y_top - 0.5, top=False, bottom=False)
    P, N, I = bore.arrays(); b2 = Mesh(); b2.add(P, -N, I[:, [0, 2, 1]])
    merge_into(d, 'enig', b2)
    merge_into(d, 'epoxy', text_mesh(Point(0, 0).buffer(0.46), y_top - 0.5))
    # body below the board
    yb = y_top - Lh
    body = cyl_mesh(rB, (-T - 0.04) - yb, seg=28, y0=yb, top=False, bottom=False)
    merge_into(d, 'tin', body)
    dome = grid_surface(lambda u, v: (rB * math.sin(u * math.pi / 2) * math.cos(v * 2 * math.pi), -0.25 * math.cos(u * math.pi / 2),
                                      rB * math.sin(u * math.pi / 2) * math.sin(v * 2 * math.pi)), 6, 24)
    merge_into(d, 'tin', dome, trs(0, yb, 0))
    # solder: pin-in-paste fillets top + bottom
    merge_into(d, 'solder', cyl_mesh(1.15, 0.1, seg=32, y0=Y_PAD - 0.01, r_top=0.99, bottom=False), None)
    merge_into(d, 'solder', cyl_mesh(1.15, 0.32, seg=32, y0=0, r_top=0.76, bottom=False), trs(0, -T - 0.04, 0) @ np.diag([1, -1, 1, 1]))
    return d


def gt01_standin_template(tilt=20.0):
    """same-footprint stand-in for parts/gt01.js (used only if that module is unavailable): wedge base + tilted body."""
    d = {}
    plunger = {}
    t = math.radians(tilt)
    Lb, Wb, Hb = 12.8, 5.8, 6.5
    y_base = Y_PAD + 0.26 + 0.02
    # wedge: thin at the front (+z), thick at the rear
    prof = Polygon([(-Lb / 2, 0), (Lb / 2, 0), (Lb / 2, 0.45), (-Lb / 2, 0.45 + Lb * math.tan(t))])   # (length, height)
    m = Mesh(); slab(m, prof, -Wb / 2, Wb / 2)                                                       # width along y
    PERM_W = np.array([[0, 1, 0, 0], [0, 0, 1, 0], [1, 0, 0, 0], [0, 0, 0, 1]], float)  # x<-y(width), y<-z(height), z<-x(length)
    merge_into(d, 'black_plastic', m, trs(0, y_base, 0) @ PERM_W)
    merge_into(d, 'black_plastic', cyl_mesh(0.42, 1.5, seg=18, y0=y_base - 1.5), trs(-1.45, 0, 2.54))   # key peg
    # tilted body: base block + translucent cover
    Tb = trs(0, y_base + 0.45 + Lb / 2 * math.tan(t), 0, rx_deg=math.degrees(t))
    merge_into(d, 'black_plastic', rbox_mesh(Wb, 2.0, Lb, 0.25, rb=0.1), Tb)
    merge_into(d, 'gt01_cover', rbox_mesh(Wb, Hb - 2.0, Lb, 0.4, rb=0.35), Tb @ trs(0, 2.0, 0))
    merge_into(d, 'nickel', box_mesh(1.0, 0.1, 7.2), Tb @ trs(0, 3.2, -0.5))
    for i, z in enumerate((5.08, 0.0, -5.08)):
        merge_into(d, 'enig', box_mesh(0.6, 2.6, 0.4), trs(0, y_base - 1.0, z))
    plunger['mesh'] = rbox_mesh(2.0, 0.9, 1.4, 0.25, rb=0.25)
    plunger['T'] = Tb @ trs(0, Hb - 0.25, 3.6)
    plunger['axis'] = [0.0, -math.cos(t), -math.sin(t)]
    return d, plunger


def wheel_standin_template(D=22.74, W=7.0, AX=12.0, n=48):
    """simple stand-in matching the shell/parts wheel envelope (diameter 22.74, width 7.0, axle 12 above the board)."""
    d = {}
    R = D / 2
    # knurled tread: star polygon in the (y,z) plane extruded along x
    pts = []
    for i in range(n * 2):
        a = i * math.pi / n
        r = R if i % 2 == 0 else R - 0.45
        pts.append((r * math.cos(a), r * math.sin(a)))
    star = Polygon(pts).difference(Point(0, 0).buffer(R - 1.6, quad_segs=24))
    m = Mesh(); slab(m, star, -W / 2 + 0.3, W / 2 - 0.3)
    rotx = np.array([[0, 1, 0, 0], [1, 0, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]], float)   # (x,y,z)->(y,x,z): axis y -> x
    rotx = trs(0, AX, 0) @ np.array([[0, 1, 0, 0], [1, 0, 0, 0], [0, 0, -1, 0], [0, 0, 0, 1]], float)
    merge_into(d, 'rubber', m, rotx)
    hubm = Mesh()
    web = Point(0, 0).buffer(R - 1.5, quad_segs=24)
    for k in range(6):
        a = k * math.pi / 3
        tri = Polygon([(0, 0), (8.2 * math.cos(a - 0.42), 8.2 * math.sin(a - 0.42)), (8.2 * math.cos(a + 0.42), 8.2 * math.sin(a + 0.42))])
        web = web.difference(affinity.scale(tri, 0.95, 0.95, origin=(0, 0)).buffer(-0.6).difference(Point(0, 0).buffer(3.2)))
    slab(hubm, web, -0.9, 0.9)
    merge_into(d, 'steel', hubm, rotx)
    axle = cyl_mesh(0.95, W + 3.2, seg=24, axis='x')
    merge_into(d, 'pom', axle, trs(-(W + 3.2) / 2, AX, 0))
    return d


TEMPLATES = {}


def template_for(c):
    fp = c['fp']; v = c['value']; ref = c['ref']
    if fp in ('0402', '0603'):
        kind = 'R' if ref.startswith('R') else 'C'
        key = (fp, kind, v if kind == 'R' else '')
        if key not in TEMPLATES:
            TEMPLATES[key] = chip_template(fp, kind, v if kind == 'R' else '')
        return key
    key = fp
    if key not in TEMPLATES:
        TEMPLATES[key] = {'L2016': inductor_template, 'QFN32': qfn32_template, 'MODULE': module_template,
                          'SENSOR': sensor_template, 'USBC': usbc_template, 'SOT666': sot666_template,
                          'SOD523': sod523_template, 'JSTSH3': jst_template, 'SLIDE': slide_template,
                          'ENC': encoder_template, 'BRACKET': bracket_template, 'TACT': tact_template}.get(fp, lambda: {})()
    return key


def place_T(x, z, rot):
    """layout placement -> physical (mirrored) node matrix: T(-x, 0, z) . Ry(+rot)"""
    return trs(-x, 0, z) @ trs(ry_deg=rot)


def mirrored(m):
    """mirror a component-local mesh into the physical frame (x -> -x, winding flipped)"""
    P, N, I = m.arrays()
    P = P.copy(); N = N.copy(); P[:, 0] *= -1; N[:, 0] *= -1
    out = Mesh(); out.add(P, N, I[:, [0, 2, 1]]); return out


def add_components(glb, L, B):
    nodes, meta, ntri = [], [], 0
    mesh_cache = {}

    def mesh_ids(key, d, name):
        if key in mesh_cache:
            return mesh_cache[key]
        ids = []
        for mat, m in d.items():
            mi = glb.mesh('%s_%s' % (name, mat), [(mirrored(m), mat)])
            if mi is not None:
                ids.append((mi, mat, m.ntri))
        mesh_cache[key] = ids
        return ids

    for c, fp in L['comps']:
        if c['fp'] in ('TP', 'TPTHT', 'FID', 'GT01'):
            continue
        key = template_for(c)
        d = TEMPLATES[key]
        ids = mesh_ids(key, d, str(key).replace("'", '').replace(' ', ''))
        kids = []
        for mi, mat, nt in ids:
            kids.append(glb.node('%s_%s' % (c['ref'], mat), mesh=mi))
            ntri += nt
        layer = c['layer']
        smd = c['fp'] not in ('ENC', 'BRACKET')
        ex = dict(kind='component', ref=c['ref'], layer=layer, value=c['value'], label=c['label'], fp=c['fp'],
                  x=-c['x'], z=c['z'], smd=smd)
        nodes.append(glb.node(c['ref'], children=kids, T=place_T(c['x'], c['z'], c['rot']), extras=ex))
        meta.append(dict(ref=c['ref'], fp=c['fp'], value=c['value'], label=c['label'], layer=layer, x=round(-c['x'], 3), z=round(c['z'], 3), rot=c['rot']))
        # extras per part
        if c['fp'] == 'SENSOR':
            lk = 'LENS'
            ld = lens_template()
            lids = mesh_ids('LENS', ld, 'lens')
            lkids = [glb.node('LENS_%s' % mat, mesh=mi) for mi, mat, nt in lids]
            ntri += sum(nt for _, _, nt in lids)
            nodes.append(glb.node('LENS', children=lkids, T=place_T(c['x'], c['z'], c['rot']),
                                  extras=dict(kind='component', ref='LENS', layer='lens', value='clip-on lens',
                                              label='[PR] smaller clip-on lens (#37), clear PC; clips through two PCB slots', smd=False)))
            meta.append(dict(ref='LENS', fp='LENS', value='clip-on lens', label='[PR] smaller clip-on lens', layer='lens', x=round(-c['x'], 3), z=round(c['z'], 3), rot=0))
        if c['fp'] == 'SLIDE':
            kd = slide_knob_template()
            kids2 = [glb.node('SW3_knob_%s' % mat, mesh=mi) for mi, mat, nt in mesh_ids('KNOB', kd, 'knob')]
            nodes.append(glb.node('SW3_knob', children=kids2, T=place_T(c['x'], c['z'] + 0.55, c['rot']),
                                  extras=dict(kind='component', ref='SW3_knob', layer='connectors', smd=False, value='ON')))
        if c['fp'] == 'JSTSH3':
            pd = jst_plug_template()
            pk = [glb.node('%s_plug_%s' % (c['ref'], mat), mesh=mi) for mi, mat, nt in mesh_ids('PLUG', pd, 'plug')]
            nodes.append(glb.node(c['ref'] + '_plug', children=pk, T=place_T(c['x'], c['z'], c['rot']),
                                  extras=dict(kind='component', ref=c['ref'] + '_plug', layer='wires', smd=False)))
    # GT01 stand-ins + Mill-Max sockets at the switch footprints
    gd, pl = gt01_standin_template(20.0)
    g_ids = mesh_ids('GT01', gd, 'gt01')
    pl_id = glb.mesh('gt01_plunger', [(mirrored(pl['mesh']), 'pom')])
    mmd = millmax_template()
    mm_ids = mesh_ids('MM3305', mmd, 'mm3305')
    for c, fp in L['comps']:
        if c['fp'] != 'GT01':
            continue
        kids = [glb.node('%s_%s' % (c['ref'], mat), mesh=mi) for mi, mat, nt in g_ids]
        ntri += sum(nt for _, _, nt in g_ids)
        kids.append(glb.node(c['ref'] + '_plunger', children=[glb.node(c['ref'] + '_plunger_mesh', mesh=pl_id)],
                             T=MIRROR @ pl['T'] @ MIRROR, extras=dict(axis=[0.0, pl['axis'][1], pl['axis'][2]])))
        nodes.append(glb.node(c['ref'], children=kids, T=place_T(c['x'], c['z'], 0),
                              extras=dict(kind='component', ref=c['ref'], layer='switches', value=c['value'], label=c['label'], smd=False,
                                          standIn=True, x=-c['x'], z=c['z'])))
        meta.append(dict(ref=c['ref'], fp='GT01', value=c['value'], label=c['label'], layer='switches', x=round(-c['x'], 3), z=round(c['z'], 3), rot=0))
        for i, (pn, zz) in enumerate((('COM', 5.08), ('NO', 0.0), ('NC', -5.08))):
            r = '%s_MM%d' % (c['ref'], i + 1)
            kk = [glb.node('%s_%s' % (r, mat), mesh=mi) for mi, mat, nt in mm_ids]
            ntri += sum(nt for _, _, nt in mm_ids)
            nodes.append(glb.node(r, children=kk, T=place_T(c['x'], c['z'] + zz, 0),
                                  extras=dict(kind='component', ref=r, layer='sockets', value='Mill-Max 3305-0', smd=False,
                                              label='[DS] Mill-Max 3305 claw-spring receptacle (gold contact, tin shell)')))
    meta.append(dict(ref='MM3305 x6', fp='MM3305', value='Mill-Max 3305-0', label='[DS] claw-spring receptacles under SW1/SW2', layer='sockets'))
    # wheel stand-in (hidden when the parts/ wheel assembly is supplied)
    wd = wheel_standin_template()
    w_ids = mesh_ids('WHEEL', wd, 'wheel')
    kids = [glb.node('WHEEL_%s' % mat, mesh=mi) for mi, mat, nt in w_ids]
    ntri += sum(nt for _, _, nt in w_ids)
    nodes.append(glb.node('WHEEL', children=kids, T=place_T(0.0, 37.75, 0),
                          extras=dict(kind='component', ref='WHEEL', layer='wheel', smd=False, standIn=True,
                                      label='stand-in: replace with parts/ buildScrollWheel (axleHeight 12)')))
    # wires
    wn, wt = add_wires(glb)
    nodes += wn; ntri += wt
    return nodes, meta, ntri


def twisted(path, r_wire, n=3, pitch=6.0, spread=0.36):
    """3 wires lightly twisted around a centre path (#69 'lightly braided')"""
    path = np.asarray(path, float)
    # resample
    seg = np.linalg.norm(np.diff(path, axis=0), axis=1)
    s = np.r_[0, np.cumsum(seg)]
    S = np.linspace(0, s[-1], max(16, int(s[-1] / 0.25)))
    P = np.stack([np.interp(S, s, path[:, k]) for k in range(3)], 1)
    Tn = np.gradient(P, axis=0); Tn /= np.linalg.norm(Tn, axis=1, keepdims=True)
    ref = np.array([0, 1, 0])
    out = []
    for w in range(n):
        pts = []
        for i in range(len(P)):
            t = Tn[i]
            a = np.cross(t, ref);
            if np.linalg.norm(a) < 1e-6:
                a = np.cross(t, [1, 0, 0])
            a /= np.linalg.norm(a); b = np.cross(t, a)
            ang = 2 * math.pi * (S[i] / pitch) + w * 2 * math.pi / n
            pts.append(P[i] + spread * (a * math.cos(ang) + b * math.sin(ang)))
        out.append(np.array(pts))
    return out


def add_wires(glb):
    """battery lead (J2) and side-button lead (J3): 3 thin wires each, lightly twisted; layout frame then mirrored."""
    nodes, ntri = [], 0
    leads = {
        # J2: plug mouth at layout x ~ 18.3 (opening faces +x), lead runs to the battery tab behind the board
        'BATLEAD': dict(path=[(18.0, 1.5, 3.2), (19.6, 1.6, 3.2), (20.3, 1.8, 1.8), (20.1, 1.9, -2.5), (18.6, 2.0, -6.5), (14.0, 2.2, -8.6), (9.5, 2.4, -9.2)],
                        mats=['wire_red', 'wire_white', 'wire_black']),
        # J3: plug mouth at layout x ~ -16.2 (opening faces -x); the lead heads for the side-button board on the left
        # wall and is drawn as a short stub (the side board belongs to the shell asset)
        'SIDELEAD': dict(path=[(-16.2, 1.5, 3.4), (-18.0, 1.7, 3.5), (-20.0, 2.6, 4.0), (-21.8, 4.2, 4.9), (-23.0, 5.8, 5.9)],
                         mats=['wire_black', 'wire_white', 'wire_yellow']),
    }
    for name, L_ in leads.items():
        ws = twisted(L_['path'], 0.26)
        d = {}
        for w, mat in zip(ws, L_['mats']):
            merge_into(d, mat, tube_mesh(w, 0.26, seg=10))
        # heat-shrink sleeve at the far end + NTC bead on the battery lead
        end = np.array(L_['path'][-1]); prev = np.array(L_['path'][-2])
        dirv = (end - prev) / np.linalg.norm(end - prev)
        sleeve = tube_mesh([end - dirv * 2.2, end], 0.62, seg=16)
        merge_into(d, 'wire_black', sleeve)
        if name == 'BATLEAD':
            bead = tube_mesh([end - dirv * 0.4 + np.array([0, 0.9, 0]), end + dirv * 0.6 + np.array([0, 0.9, 0])], 0.45, seg=14)
            merge_into(d, 'epoxy', bead)
            tape = box_mesh(3.0, 0.06, 2.0)
            merge_into(d, 'kapton', tape, trs(*(end + dirv * 0.2 + np.array([0, 0.5, 0]))))
        kids = []
        for mat, m in d.items():
            mi = glb.mesh('%s_%s' % (name, mat), [(mirrored(m), mat)])
            kids.append(glb.node('%s_%s' % (name, mat), mesh=mi))
            ntri += m.ntri
        nodes.append(glb.node(name, children=kids, T=np.eye(4),
                              extras=dict(kind='component', ref=name, layer='wires', smd=False,
                                          label='3-wire lead, lightly twisted (#51 wires instead of FPC, #69 braided)')))
    return nodes, ntri
