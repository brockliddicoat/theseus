#!/usr/bin/env python3
"""The GT01's clear cover, rebuilt for the Cycles renders (manifold3d), to the deck model's dimensions (3d/parts/gt01.js and
handoff/GT01-PLUNGER.md): 12.8 x 5.8 envelope, the shoulder at ys 2.5, the top at 6.5, 0.45 mm walls, a 0.5 mm top, the
end walls carried down past the shoulder (the back one to the base plane, the front one to the board), the plunger hole
turned 90 deg at zs 2.0 (2.3 across x 1.75 along, r 0.45, 0.1 chamfer), the latch windows in both end walls.

Added for the close-up (detail the web model leaves out): a 0.18 mm round on the top edges, real internal ribs (vertical ribs
on the side walls, two cross ribs under the ceiling, a guide frame round the plunger's flange), a round collar ring round the
plunger hole, a parting-line step, generic moulded marks (a date wheel, a cavity mark), the label recess (polished, with a border bead; no marking), the end walls' skirts below the shoulder frosted (EDM finish), four ejector-pin witnesses on the
ceiling and a gate vestige on the back end wall.

Output: render/build/cover.npz with V (switch frame S: x across, y up, z along, plunger toward +z), T (triangles) and
F (per-triangle finish: 0 polished, 1 frosted).
    python3 -I render/refine_geo.py   (after node render/export_gt01.mjs, which writes build/gt01.json)
"""
import os
import numpy as np
import manifold3d as m3
from manifold3d import Manifold, CrossSection, JoinType

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'build')
os.makedirs(OUT, exist_ok=True)
SEG = 64
m3.set_circular_segments(SEG)

L, W, H = 12.8, 5.8, 6.5
Y_SH, WALL, TOP = 2.5, 0.45, 0.5
CEIL = H - TOP                    # 6.0, the cavity's ceiling
RC, RT = 0.55, 0.18               # plan corner radius, top-edge round
ZP = 2.0                          # plunger axis
YS_FRONT = 0.56                   # the front end wall's foot (gt01.js: ysF + 0.17)

# manifold frame: X = x, Y = -z, Z = y (a proper rotation of S)
def rrect(w, h, r, cx=0.0, cy=0.0):
    r = min(r, w / 2 - 1e-4, h / 2 - 1e-4)
    cs = CrossSection.square([w, h], center=True)
    if r > 0:
        cs = cs.offset(-r, JoinType.Round).offset(r, JoinType.Round, circular_segments=SEG)
    return cs.translate([cx, cy])

def slab(cs, z0, z1):
    return cs.extrude(z1 - z0).translate([0, 0, z0])

def chamfer_cutter(cs, z_face, depth, c):
    straight = slab(cs, z_face - depth, z_face + 0.5)
    a = slab(cs, z_face - c, z_face - c + 1e-3)
    b = slab(cs.offset(c, JoinType.Round), z_face, z_face + 0.3)
    return straight + Manifold.hull(a + b)

def rounded_top_box(w, l, rc, rt, z0, z1):
    """Plan rounded rectangle (corner rc) from z0 to z1, its top edges rounded by rt: the hull of four corner posts and tori."""
    parts = []
    for sx in (-1, 1):
        for sy in (-1, 1):
            cx, cy = sx * (w / 2 - rc), sy * (l / 2 - rc)
            post = Manifold.cylinder(z1 - rt - z0, rc, rc, SEG).translate([cx, cy, z0])
            torus = CrossSection.circle(rt, 24).translate([rc - rt, 0]).revolve(SEG).translate([cx, cy, z1 - rt])
            parts += [post, torus]
    return Manifold.hull(Manifold.batch_boolean(parts, m3.OpType.Add))

def build():
    frosted = []                                          # original ids whose faces get the frosted finish
    outer = rounded_top_box(W, L, RC, RT, Y_SH, H)
    plan = rrect(W, L, RC)
    band = lambda y0, y1: rrect(W + 1, y1 - y0, 0, 0, (y0 + y1) / 2)
    # the end walls carried down: back (zs < -5.95 -> Y > 5.95) to the base plane, front (zs > 5.95 -> Y < -5.95) to ys 0.56
    # (their faces below the shoulder take the frosted, EDM-textured finish: a moulded skirt over the black housing)
    endB = slab(plan ^ band(L / 2 - WALL, L / 2 + 0.5), 0.0, Y_SH + 0.05).as_original()
    endF = slab(plan ^ band(-L / 2 - 0.5, -(L / 2 - WALL)), YS_FRONT, Y_SH + 0.05).as_original()
    frosted += [endB.original_id(), endF.original_id()]
    body = outer + endB + endF
    cavity = slab(rrect(W - 2 * WALL, L - 2 * WALL, 0.25), -1.0, CEIL)
    body = body - cavity

    # ---- internal ribs (moulded, inside the cavity)
    xi = W / 2 - WALL                                    # inner face of a side wall: 2.45
    ribs = []
    def box(x0, x1, y0, y1, z0, z1):
        return Manifold.cube([x1 - x0, y1 - y0, z1 - z0]).translate([x0, y0, z0])
    for zs in (-4.4, -2.2, 0.0, 4.3):                     # vertical ribs on both side walls, ceiling down to ys 3.1, chamfered foot
        for s in (-1, 1):
            xo, xn = s * (xi + 0.02), s * (xi - 0.3)
            a = box(min(xo, xn), max(xo, xn), -zs - 0.17, -zs + 0.17, 3.45, CEIL + 0.05)
            xt = s * (xi - 0.002)
            b = box(min(xo, xt), max(xo, xt), -zs - 0.17, -zs + 0.17, 3.1, 3.45)
            ribs.append(Manifold.hull(a + b))
    for zs in (-3.3, -1.1, 4.65):                        # cross ribs under the ceiling
        ribs.append(slab(rrect(2 * xi + 0.1, 0.3, 0.0, 0, -zs), CEIL - 0.25, CEIL + 0.05))
    # the plunger's guide frame: round the flange (2.3 x 2.9), hanging from the ceiling to ys 5.45
    gf = rrect(2.95, 3.55, 0.35, 0, -ZP) - rrect(2.47, 3.07, 0.12, 0, -ZP)
    ribs.append(slab(gf, CEIL - 0.55, CEIL + 0.05))
    body = body + Manifold.batch_boolean(ribs, m3.OpType.Add)

    # ---- the plunger hole, turned 90 deg: 2.3 across x 1.75 along, r 0.45, a 0.1 chamfer, and a 0.05 spot-face round it
    hole = rrect(2.3, 1.75, 0.45, 0, -ZP)
    body = body - chamfer_cutter(hole, H - 0.05, TOP + 0.8, 0.1)
    # a round moulded collar round the hole: a 0.05 spot-face inside a ring 0.08 proud of the top (r 1.32 to 1.72)
    body = body - slab(CrossSection.circle(1.32, SEG).translate([0, -ZP]), H - 0.05, H + 0.3)
    body = body + slab(CrossSection.circle(1.72, SEG).translate([0, -ZP]) - CrossSection.circle(1.32, SEG).translate([0, -ZP]), H - 0.05, H + 0.08)
    # ---- the label recess, zs -5.5 to 0.12 (shortened for the collar), 0.06 deep, with a bead inside its edge (no marking)
    rz0, rz1 = -5.5, 0.12
    rec = slab(rrect(3.5, rz1 - rz0, 0.35, 0, -(rz0 + rz1) / 2), H - 0.06, H + 0.3)
    body = body - rec
    bead = rrect(3.2, rz1 - rz0 - 0.3, 0.22, 0, -(rz0 + rz1) / 2) - rrect(3.0, rz1 - rz0 - 0.5, 0.14, 0, -(rz0 + rz1) / 2)
    body = body + slab(bead, H - 0.07, H - 0.025)
    # ---- generic moulded marks on the recess floor, 0.02 proud: a date wheel (ring, 12 ticks, an arrow) and a cavity mark (3 dots)
    floor = H - 0.06
    marks = []
    wc = (0.75, -(-4.35))                                # (x, Y) of the date wheel: zs -4.35
    marks.append(CrossSection.circle(0.56, SEG).translate(wc) - CrossSection.circle(0.49, SEG).translate(wc))
    for k in range(12):
        a = k * 30.0
        t = rrect(0.05, 0.13, 0.0, 0, 0.4).rotate(a).translate(wc)
        marks.append(t)
    marks.append(CrossSection([[(-0.07, 0.0), (0.07, 0.0), (0.0, 0.3)]]).rotate(-60).translate(wc))
    for k in range(3):
        marks.append(CrossSection.circle(0.1, 32).translate([-0.95 + 0.32 * k, 4.35]))
    for m in marks:
        body = body + slab(m, floor - 0.01, floor + 0.02)
    # ---- the parting line: the lower walls stand 0.015 proud below ys 5.55, a fine step all round
    body = body + slab(rrect(W + 0.03, L + 0.03, RC + 0.015) - rrect(W - 0.3, L - 0.3, RC - 0.15), Y_SH, 5.55)
    # ---- latch windows in both end walls (the base's pedestals show through them)
    for s in (+1, -1):
        cut = rrect(2.6, 1.3, 0.2, 0, 3.1).extrude(1.2).translate([0, 0, -0.6]).rotate([90, 0, 0]).translate([0, -s * (L / 2 - WALL / 2), 0])
        body = body - cut
    # ---- ejector-pin witnesses on the ceiling (0.02 mm recesses, the core side) and a gate vestige on the back end wall
    for x, zs in ((-1.45, -4.6), (1.45, -4.6), (-1.45, 4.9), (1.45, 4.9), (0.0, -2.2)):
        body = body - Manifold.cylinder(0.04, 0.38, 0.38, 48).translate([x, -zs, CEIL - 0.02])
    gate = Manifold.cylinder(0.05, 0.32, 0.26, 48).rotate([-90, 0, 0]).translate([0, L / 2 - 0.03, 1.2]).as_original()
    frosted.append(gate.original_id())
    body = body + gate
    return body, frosted

def build_wedge(spec):
    """The GT01's moulded bottom housing (black), world frame (PCB: +Y up, plunger end +Z), one solid: the traced side profile
    (gt01.js, spec.profile.housing) extruded across the 5.8 mm width, with the four side pockets one wall (0.70) deep in each
    side (the deck builds it as two holed skins over a core; one solid lets every edge take a bevel). Pocket faces are tagged
    (finish 1) so they can take a duller, darker finish."""
    import math
    p = spec['profile']
    prof = [tuple(q) for q in p['housing']]              # (Z, Y)
    wall = p['wall']
    tilt = math.radians(spec['tiltDeg'])
    sT, cT = math.sin(tilt), math.cos(tilt)
    cs = CrossSection([prof])
    if cs.area() < 0:
        cs = CrossSection([prof[::-1]])
    solid = cs.extrude(W)                                 # (u, v, w) = (Z, Y, across)
    # the parting line: one half of the mould 0.015 proud of the other, a fine step round the profile at mid-width
    solid = solid + cs.offset(0.015, JoinType.Miter).extrude(W / 2)
    hb, hf, sl = p['holes']['back'], p['holes']['front'], p['holes']['slot']
    holes = [CrossSection.circle(hb[2], SEG).translate([hb[0], hb[1]]),
             CrossSection.circle(hf[2], SEG).translate([hf[0], hf[1]])]
    # the slot along the tilt, falling forward: a stadium
    ln, wd = sl[2], sl[3]
    stad = rrect(ln, wd, wd / 2 - 1e-3).rotate(-spec['tiltDeg']).translate([sl[0], sl[1]])
    holes.append(stad)
    # the long rounded triangle low at the back (gt01.js: filletPolygon([[0.07, WALL], [zb, 3.03], [zb, WALL]], [0.35, 0.25, 0.25]))
    zb = prof[0][0] + wall
    tri = CrossSection([[(0.07, wall), (zb, 3.03), (zb, wall)]])
    if tri.area() < 0:
        tri = CrossSection([[(zb, wall), (zb, 3.03), (0.07, wall)]])
    tri = tri.offset(-0.25, JoinType.Round).offset(0.25, JoinType.Round, circular_segments=SEG)
    holes.append(tri)
    cut = None
    for h in holes:
        for w0, w1 in ((-0.2, wall), (W - wall, W + 0.2)):
            c = h.extrude(w1 - w0).translate([0, 0, w0])
            cut = c if cut is None else cut + c
    cut = cut.as_original()
    pocket_id = cut.original_id()
    solid = solid - cut
    # ejector-pin witnesses on both side faces: 0.02 mm deep circles between the pockets
    for (u, v) in ((-0.95, 1.05), (1.75, 3.15), (4.55, 0.55)):
        for w0, w1 in ((-0.1, 0.02), (W - 0.02, W + 0.1)):
            solid = solid - CrossSection.circle(0.36, SEG).translate([u, v]).extrude(w1 - w0).translate([0, 0, w0])
    mesh = solid.to_mesh()
    v = np.asarray(mesh.vert_properties, dtype=np.float64)[:, :3]
    t = np.asarray(mesh.tri_verts, dtype=np.int64)
    fin = np.zeros(len(t), dtype=np.int8)
    ri, ro = list(mesh.run_index), list(mesh.run_original_id)
    for k, oid in enumerate(ro):
        if oid == pocket_id:
            fin[ri[k] // 3: ri[k + 1] // 3] = 1
    # (u, v, w) -> three (X, Y, Z) = (W/2 - w, v, u): a proper rotation (det +1)
    vw = np.stack([W / 2 - v[:, 2], v[:, 1], v[:, 0]], axis=1)
    np.savez(os.path.join(OUT, 'wedge.npz'), V=vw.astype(np.float32), T=t.astype(np.int32), F=fin)
    print(f'wedge: {len(vw)} verts, {len(t)} tris, pocket {int(fin.sum())} tris, genus {solid.genus()}, volume {solid.volume():.2f} mm3')


def export(body, frosted):
    mesh = body.to_mesh()
    v = np.asarray(mesh.vert_properties, dtype=np.float64)[:, :3]
    t = np.asarray(mesh.tri_verts, dtype=np.int64)
    fin = np.zeros(len(t), dtype=np.int8)
    ri, ro = list(mesh.run_index), list(mesh.run_original_id)
    for k, oid in enumerate(ro):
        if oid in frosted:
            fin[ri[k] // 3: ri[k + 1] // 3] = 1
    vs = np.stack([v[:, 0], v[:, 2], -v[:, 1]], axis=1)   # manifold (X, Y, Z) -> S (x, y, z) = (X, Z, -Y)
    np.savez(os.path.join(OUT, 'cover.npz'), V=vs.astype(np.float32), T=t.astype(np.int32), F=fin)
    print(f'cover: {len(vs)} verts, {len(t)} tris, frosted {int(fin.sum())} tris, genus {body.genus()}, volume {body.volume():.2f} mm3')
    lo, hi = vs.min(0), vs.max(0)
    print('bounds S:', np.round(lo, 3), np.round(hi, 3))

if __name__ == '__main__':
    import json
    export(*build())
    build_wedge(json.load(open(os.path.join(OUT, 'gt01.json')))['spec'])
