#!/usr/bin/env python3
"""GT01 micro switch, product render: Blender 5.2 / Cycles, modelled procedurally from scratch (R1).

Dimensions follow theseus/3d/parts/gt01.js: a D2F-class SPDT micro switch (12.8 x 5.8 x 6.5 mm) on the GT01's
moulded wedge, tilted 20 deg, terminals at 5.08 mm pitch; snap-action spring with tongue and fulcrum, contacts,
plunger (cap 1.5 x 2.1, rounded top, 0.80 proud), clear PC cover with ribs and bosses, black PA base and wedge.
No maker logos or wordmarks.

R3 pass (took over R1's line): water-clear PC (no blue tint, a whisper of neutral absorption), frost only on the end
skirts and the debossed generic marks (>PC< material code, a date wheel); the cavity is cut before the ribs (R1 cut it
after, which deleted them), a round collar ring and guide tube round the plunger, end-wall ribs, ceiling steps, a
parting step and inside ejector marks; micro-bevels 0.03-0.1 mm on every part; chamfered tin pin tips; brighter gold
(roughness 0.12, no hammered bump); a deeper bow in the snap spring's tongue. Light rig: the key and a top softbox sit
on each switch's top-face mirror direction (mirror_dir), so they land as broad highlights on the flat tops; thin
flagged rim strips; neutral world and backdrop.
    nice python3 gt01_cycles.py --shot hero --res 1400 --spp 64 --noise 0.02 --out out/gt01_hero_1400_r3c.png
    nice python3 gt01_cycles.py --shot close --res 1400 --spp 40 --noise 0.025 --key 0.4 --key_flag --out out/gt01_close_1400_r3b.png   (rendered at --key 0.4 with the default then 0.7: same flags)

R4 pass (Brock 07:25 and 07:44):
  - Fillets that exist. Blender's bevel overlap clamp is global, so R3's single clamped passes came out at 0 mm on the
    cover, 0.015 on the wedge, 0.018 on the plunger and 0.03 on the pins. Now: the cover's bare shell is rounded first
    (R_SHELL 0.18, no clamp), the cuts come after with a 0.05 pass; the wedge's pockets are cut by lofted cutters that
    carry a true 0.25 round lip and a 0.12 floor fillet (pocket_rings), then its outer edges take a 0.25, 6-segment bevel
    (no clamp); the plunger's pieces are rounded before they are joined (0.09/0.08/0.06); the pins' corners are opened
    to 0.09 so a 0.07 bevel needs no clamp. Weighted normals last, so flat faces stay flat after the booleans.
  - The seam: the base sits INSET 0.04 inside the cover's sides and SEAM_GAP 0.016 under its skirt edge; both edges
    round (0.18 / 0.25). R3's 0.03 parting step is gone (it was what clamped the cover to zero).
  - TTC-style snap clip on each long side (TAB_*): a clear latch tab (0.45 thick) hangs from the side wall into a recess
    in the base; its plunger-side end and its window are cut on the diagonal; a wedge lug (ramp up top, flat catch
    under) on the base pokes through the window. Every edge rounded (tab 0.1, recess lip 0.12, lug 0.05). The oval
    pocket moved 0.25 lower to clear it.
  - No moulded text on the top (>PC< and the date wheel removed).
  - Union operands (the tabs, the lug, the plunger's flange and nose) carry their parent's materials: without them the
    union adds an empty slot, and those faces rendered as Cycles' default grey diffuse.
  - Satin black PA (roughness 0.30, F0 4 %, the sandy bump gone) and a satin softbox set 22/16 deg off the base side's
    computed mirror direction, light-linked to the base; the pin kicker (5 deg off that direction) now lights the pins only.
  - The gold: the second switch's parts were all named 'swB.swA.00N' (place_switch), so no light link ever found them;
    and key/top were seen through the PC, where light linking cannot act (Cycles checks it at the PC). Now: parts are
    named by role; key/top are hidden from transmission and skip the gold; gold-only copies (keyG/topG/frontG) light it.
    nice python3 gt01_cycles.py --shot hero --res 1400 --spp 64 --noise 0.02 --key 0.2 --gold_k 1.5 --out out/gt01_hero_1400_r4.png
    nice python3 gt01_cycles.py --shot close --res 1400 --spp 40 --noise 0.025 --key 0.2 --gold_k 1.5 --key_flag --out out/gt01_close_1400_r4.png
    nice python3 gt01_cycles.py --shot hero --res 4200 --spp 48 --noise 0.025 --key 0.2 --gold_k 1.5 --border 0.395,0.27,0.585,0.435 --out out/r4/crop3x_raw.png

Units: 1 BU = 1 mm (scene unit scale 0.001, so camera f-stops are physical).
Frames: switch frame S = X across (+-2.9), Y along (+Y = plunger end, the low end), Z up (0 = the switch's base plane).
        root frame = X across, Y along, Z up, origin on the board plane under the middle (NO) pin.

    nice python3 gt01_cycles.py --shot hero --res 600 --spp 64 --out out/draft.png
"""
import argparse, math, os, sys, time
import bpy, bmesh
from mathutils import Vector, Matrix, Euler, Quaternion

D2R = math.pi / 180.0

# ------------------------------------------------------------------------------------------------ dimensions (mm)
L, W, H = 12.8, 5.8, 6.5
YSH = 2.5                    # base / cover joint (the shoulder), switch frame
CW = 0.70                    # cover wall (R3 r3: real micro-switch covers run 0.6-0.8 mm; R1 had 0.55)
CEIL = 5.8                   # cavity ceiling (top plate 0.7)
ZP = 2.0                     # plunger axis, along the switch
PITCH = 5.08                 # COM +5.08, NO 0, NC -5.08 (D2F)
Z_TIP = -4.0                 # the moving contact, along
Z_ANCHOR, T_BLADE = 4.45, 0.12   # R3 r3: spring 0.12 (0.08 read paper-thin at hero scale)
Z_BLADE = Z_ANCHOR + 0.006
FUL_Y, FUL_Z = 4.0, 3.2      # the tongue's fulcrum (V notch), along / up
GAP = 0.30
T_SHEET = 0.5                # R3 r3: terminal sheet and pins (D2F class 0.4 per gt01.js; main asked for about 0.5)
R_FC, H_FC, R_MC, H_MC = 0.56, 0.24, 0.5, 0.2   # R3 r3: contact rivets, fixed (radius, crown) and moving (radius, crown each side)
Z_NCARM = Z_BLADE + T_BLADE + H_MC + H_FC
Z_NOTAB = Z_BLADE - GAP - H_MC - H_FC
H_MIN = -0.52
CAP_L, CAP_W, CAP_R, CAP_PROUD = 1.5, 2.1, 0.75, 0.80
WALL = 0.70                  # wedge wall / pocket inset
RO_COL, RI_COL = 2.1, 1.45    # R3: the plunger's round collar ring on the cover (outer radius, counterbored seat radius)
MARK_Y = -3.0                # R3: where the generic moulded marks sit on the top, along (r3: no recessed panel)
R_SHELL = 0.18               # R4: the cover's outer-shell fillet (every outside edge, the skirt edges, the seam edge)
R_WEDGE = 0.25               # R4: the black base / wedge's outer edges and corners
R_LIP = 0.25                 # R4: the round lip on every pocket in the wedge
INSET, SEAM_GAP = 0.04, 0.016   # R4: the base's sides sit 0.04 inside the cover's; its top 0.016 under the skirt edge
PA_ROUGH = 0.30              # R4: satin black PA
# R4: TTC-style snap clip, one on each long side (switch frame, outline in (along, up)): a clear latch tab hangs from the
# side wall into a recess in the black base, its plunger-side end and its window cut on the diagonal; a wedge lug on the
# base (ramp on top, flat catch under) pokes through the window, whose lower bar hooks under it
T_TAB, TAB_CLR = 0.45, 0.08  # the tab's thickness (a flexing arm, thinner than the 0.7 wall); its clearance in the recess
TAB_OUT = [(-1.9, YSH + 0.3), (-1.9, YSH - 0.95), (0.85, YSH - 0.95), (0.85 + 0.6 / 0.95 * 1.25, YSH + 0.3)]
TAB_EXT = [(-1.9, YSH + 0.6), (-1.9, YSH - 0.95), (0.85, YSH - 0.95), (0.85 + 0.6 / 0.95 * 1.55, YSH + 0.6)]
TAB_WIN = [(-1.45, YSH - 0.72), (0.45, YSH - 0.72), (0.45 + 0.6 / 0.95 * 0.4, YSH - 0.32), (-1.45, YSH - 0.32)]
TILT = 20.0 * D2R
sT, cT = math.sin(TILT), math.cos(TILT)
LIFT = (L / 2) * sT + H_MIN


def S2W(ys, zs):
    """switch frame (up, along) -> root frame (up, along)"""
    return (ys * cT - zs * sT + LIFT, ys * sT + zs * cT)


BODY_M = Matrix.Translation((0, 0, LIFT)) @ Matrix.Rotation(-TILT, 4, 'X')   # switch frame -> root frame

# ------------------------------------------------------------------------------------------------ 2D outlines


def ccw(pts):
    a = 0.0
    for i in range(len(pts)):
        x0, y0 = pts[i]; x1, y1 = pts[(i + 1) % len(pts)]
        a += x0 * y1 - x1 * y0
    return list(pts) if a > 0 else list(pts)[::-1]


def rrect(w, d, r, cx=0.0, cy=0.0, seg=8):
    r = max(0.0, min(r, w / 2 - 0.01, d / 2 - 0.01))
    if r < 1e-4:
        return [(cx - w / 2, cy - d / 2), (cx + w / 2, cy - d / 2), (cx + w / 2, cy + d / 2), (cx - w / 2, cy + d / 2)]
    pts = []
    for (ox, oy, a0) in ((cx + w / 2 - r, cy - d / 2 + r, -90), (cx + w / 2 - r, cy + d / 2 - r, 0),
                         (cx - w / 2 + r, cy + d / 2 - r, 90), (cx - w / 2 + r, cy - d / 2 + r, 180)):
        for i in range(seg + 1):
            a = (a0 + 90.0 * i / seg) * D2R
            pts.append((ox + r * math.cos(a), oy + r * math.sin(a)))
    return pts


def circle(cx, cy, r, n=64):
    return [(cx + r * math.cos(2 * math.pi * i / n), cy + r * math.sin(2 * math.pi * i / n)) for i in range(n)]


def stadium(cx, cy, length, width, ang, n=24):
    r = width / 2; hl = length / 2 - r
    pts = [(hl + r * math.cos(-math.pi / 2 + math.pi * i / n), r * math.sin(-math.pi / 2 + math.pi * i / n)) for i in range(n + 1)]
    pts += [(-hl + r * math.cos(math.pi / 2 + math.pi * i / n), r * math.sin(math.pi / 2 + math.pi * i / n)) for i in range(n + 1)]
    c, s = math.cos(ang), math.sin(ang)
    return [(cx + x * c - y * s, cy + x * s + y * c) for x, y in pts]


def fillet(pts, radii, seg=10):
    """polygon with true circular fillets of radius radii[i] at vertex i (0 = sharp)"""
    out, n = [], len(pts)
    for i in range(n):
        B = Vector(pts[i]); r = radii[i]
        if r <= 0:
            out.append((B.x, B.y)); continue
        A = Vector(pts[i - 1]); C = Vector(pts[(i + 1) % n])
        u = A - B; lu = u.length; u.normalize()
        v = C - B; lv = v.length; v.normalize()
        ang = math.acos(max(-1.0, min(1.0, u.dot(v))))
        if ang < 1e-3 or ang > math.pi - 1e-3:
            out.append((B.x, B.y)); continue
        t = min(r / math.tan(ang / 2), lu * 0.49, lv * 0.49)
        rr = t * math.tan(ang / 2)
        P0, P1 = B + u * t, B + v * t
        Cc = B + (u + v).normalized() * (rr / math.sin(ang / 2))
        a0 = math.atan2(P0.y - Cc.y, P0.x - Cc.x); a1 = math.atan2(P1.y - Cc.y, P1.x - Cc.x)
        da = a1 - a0
        while da > math.pi: da -= 2 * math.pi
        while da < -math.pi: da += 2 * math.pi
        for k in range(seg + 1):
            a = a0 + da * k / seg
            out.append((Cc.x + rr * math.cos(a), Cc.y + rr * math.sin(a)))
    return out


# ------------------------------------------------------------------------------------------------ meshes
AX = {'X': 0, 'Y': 1, 'Z': 2}


def prism(outline, w0, w1, axes='XYZ', bm=None, taper=0.0):
    """Extrude a 2D outline (u, v) along w from w0 to w1; axes maps (u, v, w) to (X, Y, Z).
    taper > 0 shrinks the w1 cap inward by that much (moulding draft)."""
    bm = bm or bmesh.new()
    pts = ccw(outline)
    if taper:
        cx = sum(p[0] for p in pts) / len(pts); cy = sum(p[1] for p in pts) / len(pts)
    def P(u, v, w):
        c = [0.0, 0.0, 0.0]; c[AX[axes[0]]] = u; c[AX[axes[1]]] = v; c[AX[axes[2]]] = w
        return c
    vb = [bm.verts.new(P(u, v, w0)) for u, v in pts]
    if taper:
        top = []
        for u, v in pts:
            du, dv = u - cx, v - cy; ln = math.hypot(du, dv) or 1.0
            top.append((u - du / ln * taper, v - dv / ln * taper))
    else:
        top = pts
    vt = [bm.verts.new(P(u, v, w1)) for u, v in top]
    n = len(pts)
    faces = [bm.faces.new(vb[::-1]), bm.faces.new(vt)]
    for i in range(n):
        j = (i + 1) % n
        faces.append(bm.faces.new((vb[i], vb[j], vt[j], vt[i])))
    bmesh.ops.recalc_face_normals(bm, faces=faces)
    return bm


def dedup(pts, eps=1e-6):
    out = []
    for p in pts:
        if not out or abs(p[0] - out[-1][0]) > eps or abs(p[1] - out[-1][1]) > eps:
            out.append(p)
    if len(out) > 2 and abs(out[0][0] - out[-1][0]) < eps and abs(out[0][1] - out[-1][1]) < eps:
        out.pop()
    return out


def offset_outline(pts, d):
    """R4: a CCW convex outline offset outward by d (mitred along each vertex's bisector)"""
    n, out = len(pts), []
    for i in range(n):
        x0, y0 = pts[i - 1]; x1, y1 = pts[i]; x2, y2 = pts[(i + 1) % n]
        e1 = Vector((x1 - x0, y1 - y0)).normalized(); e2 = Vector((x2 - x1, y2 - y1)).normalized()
        n1, n2 = Vector((e1.y, -e1.x)), Vector((e2.y, -e2.x))
        m = n1 + n2
        m = m.normalized() if m.length > 1e-9 else n1
        k = d / max(0.3, m.dot(n1))
        out.append((x1 + m.x * k, y1 + m.y * k))
    return out


def loft(outline, rings, axes='XYZ', bm=None):
    """R4: a closed loft of a 2D outline through rings [(w, d)]: at height w the outline is offset outward by d"""
    bm = bm or bmesh.new()
    pts = ccw(dedup(outline))
    def P(u, v, w):
        c = [0.0, 0.0, 0.0]; c[AX[axes[0]]] = u; c[AX[axes[1]]] = v; c[AX[axes[2]]] = w
        return c
    loops = [[bm.verts.new(P(u, v, w)) for u, v in (offset_outline(pts, d) if abs(d) > 1e-9 else pts)] for w, d in rings]
    n = len(pts)
    faces = [bm.faces.new(loops[0][::-1]), bm.faces.new(loops[-1])]
    for a, b in zip(loops[:-1], loops[1:]):
        for i in range(n):
            j = (i + 1) % n
            faces.append(bm.faces.new((a[i], a[j], b[j], b[i])))
    bmesh.ops.recalc_face_normals(bm, faces=faces)
    return bm


LIP_PHI = (0, 15, 30, 45, 58, 70, 79, 85, 88.5, 90)     # R4: lip arc stations (deg), denser where it meets the face


def pocket_rings(xf, depth, s=1, lip=0.25, floor_r=0.12):
    """R4: rings for a pocket cutter whose mouth carries a true round lip (radius `lip`, tangent to the face at xf and
    to the wall) and whose floor meets the wall in a concave fillet (floor_r): the fillets are in the cut itself, so no
    bevel has to find (or be clamped on) the pocket's edges. s = +1 for a face at +xf, -1 for its mirror at -xf."""
    xb, eps = xf - depth, 0.0006
    R = [(xb + floor_r * (1 - math.cos(a * D2R)), -floor_r * (1 - math.sin(a * D2R))) for a in (0, 15, 30, 45, 60, 75, 90)]
    R += [(xf - lip + eps + lip * math.sin(a * D2R), lip * (1 - math.cos(a * D2R))) for a in LIP_PHI[1:]]
    R += [(xf + eps + 0.002, lip + 0.05), (xf + 0.5, lip + 0.05)]    # flare on past the face (keeps the rim's normals flat)
    return [(s * w, d) for w, d in R]


def weighted_normals(ob):
    """R4: face-area weighted custom normals (flat faces stay flat, fillets stay round), applied last: unlike the
    bevel's harden option it does not care what booleans ran after the bevel"""
    md = ob.modifiers.new('wn', 'WEIGHTED_NORMAL'); md.mode = 'FACE_AREA'; md.weight = 50; md.keep_sharp = True
    return md


def box(x0, x1, y0, y1, z0, z1, r=0.0, bm=None, seg=6):
    return prism(rrect(x1 - x0, y1 - y0, r, (x0 + x1) / 2, (y0 + y1) / 2, seg), z0, z1, 'XYZ', bm)


def lathe(profile, n=48, bm=None):
    """revolve (r, z) profile about Z; r == 0 points become poles"""
    bm = bm or bmesh.new()
    rings = []
    for (r, z) in profile:
        if r < 1e-7:
            rings.append([bm.verts.new((0, 0, z))])
        else:
            rings.append([bm.verts.new((r * math.cos(2 * math.pi * k / n), r * math.sin(2 * math.pi * k / n), z)) for k in range(n)])
    faces = []
    for i in range(len(rings) - 1):
        A, B = rings[i], rings[i + 1]
        if len(A) == 1 and len(B) == 1: continue
        for k in range(n):
            k2 = (k + 1) % n
            if len(A) == 1: faces.append(bm.faces.new((A[0], B[k], B[k2])))
            elif len(B) == 1: faces.append(bm.faces.new((A[k], A[k2], B[0])))
            else: faces.append(bm.faces.new((A[k], A[k2], B[k2], B[k])))
    bmesh.ops.recalc_face_normals(bm, faces=faces)
    return bm


def sweep_rect(path, w, t, up=Vector((1, 0, 0)), bm=None):
    """rectangular strip w (along `up`) x t swept along a polyline"""
    bm = bm or bmesh.new()
    rings, n = [], len(path)
    for i, p in enumerate(path):
        tan = (path[min(i + 1, n - 1)] - path[max(i - 1, 0)]).normalized()
        side = (up - tan * up.dot(tan)).normalized()
        nrm = tan.cross(side).normalized()
        rings.append([bm.verts.new(p + side * a + nrm * b) for a, b in ((-w / 2, -t / 2), (w / 2, -t / 2), (w / 2, t / 2), (-w / 2, t / 2))])
    faces = []
    for i in range(n - 1):
        a, b = rings[i], rings[i + 1]
        for k in range(4):
            k2 = (k + 1) % 4
            faces.append(bm.faces.new((a[k], a[k2], b[k2], b[k])))
    faces.append(bm.faces.new(rings[0][::-1])); faces.append(bm.faces.new(rings[-1]))
    bmesh.ops.recalc_face_normals(bm, faces=faces)
    return bm


def dome(r, h, rim=0.06, n=64, flip=False, shank=0.0):
    prof = [(0.0, -shank), (r * 0.82, -shank)] if shank else [(0.0, 0.0)]
    prof += [(r, 0.0), (r, rim)]
    for i in range(1, 13):
        a = i / 12 * math.pi / 2
        prof.append((r * math.cos(a), rim + (h - rim) * math.sin(a)))
    prof[-1] = (0.0, h)
    if shank:
        prof.insert(2, (r * 0.82, 0.0))
    if flip:
        prof = [(rr, -z) for rr, z in prof][::-1]
    return lathe(prof, n)


def bm_merge(dst, src):
    """append bmesh src into dst (src is freed)"""
    me = bpy.data.meshes.new('tmp'); src.to_mesh(me); src.free(); dst.from_mesh(me); bpy.data.meshes.remove(me)
    return dst


def text_bm(body, size, depth, ang=0.0, loc=(0.0, 0.0, 0.0), spacing=1.0):
    """a closed mesh of `body` in Blender's built-in font, lying in XY (reading along +X before turning by `ang` about Z),
    spanning z 0..depth, centred on loc"""
    cu = bpy.data.curves.new('txt', 'FONT'); cu.body = body; cu.size = size
    cu.align_x = 'CENTER'; cu.align_y = 'CENTER'; cu.extrude = depth / 2; cu.resolution_u = 6
    cu.space_character = spacing
    ob = bpy.data.objects.new('txt', cu); SCN.collection.objects.link(ob)
    dg = bpy.context.evaluated_depsgraph_get(); dg.update()
    me = bpy.data.meshes.new_from_object(ob.evaluated_get(dg))
    bpy.data.objects.remove(ob, do_unlink=True); bpy.data.curves.remove(cu)
    bm = bmesh.new(); bm.from_mesh(me); bpy.data.meshes.remove(me)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-5)
    bmesh.ops.translate(bm, vec=Vector((0, 0, depth / 2)), verts=bm.verts)
    bmesh.ops.rotate(bm, cent=Vector((0, 0, 0)), matrix=Matrix.Rotation(ang, 3, 'Z'), verts=bm.verts)
    bmesh.ops.translate(bm, vec=Vector(loc), verts=bm.verts)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    return bm


SCN = None
CUTTERS = []


def mk(name, bm, mats=None, smooth=True):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me); bm.free()
    if smooth: me.shade_smooth()
    ob = bpy.data.objects.new(name, me)
    SCN.collection.objects.link(ob)
    for m in (mats or []):
        me.materials.append(m)
    return ob


def boolean(ob, cutter_bm, op='DIFFERENCE', name='cut', self_isect=False):
    cut = mk(ob.name + '.' + name, cutter_bm)
    cut.hide_render = True; cut.display_type = 'WIRE'
    md = ob.modifiers.new(name, 'BOOLEAN'); md.operation = op; md.solver = 'EXACT'; md.object = cut
    if self_isect: md.use_self = True
    CUTTERS.append(cut)
    return md


def bevel(ob, width, segs=3, angle=20.0, harden=True, profile=0.5, clamp=True):
    """R4: note the overlap clamp is global in Blender: one tight spot anywhere scales the whole object's bevel down
    (R3's cover came out at 0 mm, the wedge at 0.015, the plunger at 0.018, the pins at 0.03). clamp=False for passes
    run on geometry with no tight spots."""
    md = ob.modifiers.new('bevel', 'BEVEL')
    md.width = width; md.segments = segs; md.limit_method = 'ANGLE'; md.angle_limit = angle * D2R
    md.harden_normals = harden; md.use_clamp_overlap = clamp; md.profile = profile
    md.miter_outer = 'MITER_ARC'
    return md


def bake(ob):
    """apply the modifier stack into a fresh mesh (keeps hardened custom normals)"""
    dg = bpy.context.evaluated_depsgraph_get(); dg.update()
    ev = ob.evaluated_get(dg)
    me = bpy.data.meshes.new_from_object(ev, preserve_all_data_layers=True, depsgraph=dg)
    mats = [s.material for s in ob.material_slots]
    ob.modifiers.clear()
    old = ob.data; ob.data = me
    if len(me.materials) == 0:
        for m in mats: me.materials.append(m)
    if old.users == 0: bpy.data.meshes.remove(old)
    return ob


def assign_faces(ob, mat_index, pred):
    me = ob.data
    for p in me.polygons:
        if pred(Vector(p.center), Vector(p.normal)):
            p.material_index = mat_index


# ------------------------------------------------------------------------------------------------ materials

def _mat(name):
    m = bpy.data.materials.new(name)
    try: m.use_nodes = True
    except Exception: pass
    nt = m.node_tree
    return m, nt.nodes, nt.links, nt.nodes.get('Principled BSDF'), nt.nodes.get('Material Output')


def _noise(N, Lk, scale, detail=2.0, rough=0.5, coord='Object'):
    tc = N.new('ShaderNodeTexCoord'); nz = N.new('ShaderNodeTexNoise')
    nz.inputs['Scale'].default_value = scale; nz.inputs['Detail'].default_value = detail
    nz.inputs['Roughness'].default_value = rough
    Lk.new(tc.outputs[coord], nz.inputs['Vector'])
    return nz


def _range(N, Lk, src, a, b, lo=0.3, hi=0.7):
    mr = N.new('ShaderNodeMapRange')
    mr.inputs['From Min'].default_value = lo; mr.inputs['From Max'].default_value = hi
    mr.inputs['To Min'].default_value = a; mr.inputs['To Max'].default_value = b
    Lk.new(src, mr.inputs['Value'])
    return mr.outputs['Result']


def _bump(N, Lk, bsdf, scale, strength, dist=0.004, detail=3.0):
    nz = _noise(N, Lk, scale, detail, 0.6)
    bp = N.new('ShaderNodeBump'); bp.inputs['Strength'].default_value = strength; bp.inputs['Distance'].default_value = dist
    Lk.new(nz.outputs['Fac'], bp.inputs['Height'])
    Lk.new(bp.outputs['Normal'], bsdf.inputs['Normal'])
    return bp


def mat_pc(name, rough=0.003, rough_var=0.004, frost=False, shadow_pass=1.0, absorb=0.12, tint=(0.992, 0.992, 0.982)):
    """water-clear polycarbonate: IOR 1.585, full transmission, a whisper of neutral-warm absorption (only reads down the
    12.8 mm length, never as a tint), transparent shadow rays (so the parts inside are lit directly, as a studio renderer
    does; caustics stay off). R3: the v3 blue tint (0.93, 0.965, 1.0) and its 0.045 density are gone."""
    m, N, Lk, b, out = _mat(name)
    b.inputs['Base Color'].default_value = (1, 1, 1, 1)
    b.inputs['IOR'].default_value = 1.585
    b.inputs['Transmission Weight'].default_value = 1.0
    nz = _noise(N, Lk, 0.9 if not frost else 25.0, 3.0, 0.6)
    Lk.new(_range(N, Lk, nz.outputs['Fac'], rough, rough + rough_var), b.inputs['Roughness'])
    if frost:
        _bump(N, Lk, b, 160.0, 0.05, 0.002)
    lp = N.new('ShaderNodeLightPath'); tr = N.new('ShaderNodeBsdfTransparent'); mix = N.new('ShaderNodeMixShader')
    tr.inputs['Color'].default_value = (1.0, 1.0, 1.0, 1)
    mul = N.new('ShaderNodeMath'); mul.operation = 'MULTIPLY'; mul.inputs[1].default_value = shadow_pass
    Lk.new(lp.outputs['Is Shadow Ray'], mul.inputs[0]); Lk.new(mul.outputs[0], mix.inputs[0])
    Lk.new(b.outputs['BSDF'], mix.inputs[1]); Lk.new(tr.outputs['BSDF'], mix.inputs[2])
    Lk.new(mix.outputs['Shader'], out.inputs['Surface'])
    va = N.new('ShaderNodeVolumeAbsorption')
    va.inputs['Color'].default_value = (*tint, 1); va.inputs['Density'].default_value = absorb
    Lk.new(va.outputs['Volume'], out.inputs['Volume'])
    return m


def mat_metal(name, color, rough, rough_var=0.05, nscale=6.0, aniso=0.0, bump=0.0, bscale=200.0):
    m, N, Lk, b, out = _mat(name)
    b.inputs['Base Color'].default_value = (*color, 1)
    b.inputs['Metallic'].default_value = 1.0
    nz = _noise(N, Lk, nscale, 4.0, 0.55)
    Lk.new(_range(N, Lk, nz.outputs['Fac'], rough - rough_var / 2, rough + rough_var / 2), b.inputs['Roughness'])
    if aniso:
        b.inputs['Anisotropic'].default_value = aniso
    if bump:
        _bump(N, Lk, b, bscale, bump, 0.002)
    return m


def mat_plastic(name, color, rough, rough_var=0.06, bump=0.15, bscale=90.0, spec=0.5, coat=0.0):
    m, N, Lk, b, out = _mat(name)
    b.inputs['Base Color'].default_value = (*color, 1)
    b.inputs['Specular IOR Level'].default_value = spec
    nz = _noise(N, Lk, 2.5, 3.0, 0.55)
    Lk.new(_range(N, Lk, nz.outputs['Fac'], rough - rough_var / 2, rough + rough_var / 2), b.inputs['Roughness'])
    if bump:
        _bump(N, Lk, b, bscale, bump, 0.003)
    if coat:
        b.inputs['Coat Weight'].default_value = coat; b.inputs['Coat Roughness'].default_value = 0.25
    return m


def make_materials():
    return {
        'pc': mat_pc('PC clear'),
        'frost': mat_pc('PC frosted', 0.08, 0.03, shadow_pass=0.96),   # r3: satin, not white: the bigger marks read as haze, not blotches
        'gold': mat_metal('Au plated', (1.0, 0.745, 0.29), 0.12, 0.025, 7.0, bump=0.006),   # r3: a touch more saturated
        'goldc': mat_metal('Au contact', (1.0, 0.79, 0.40), 0.08, 0.02, 9.0),
        'pom': mat_plastic('POM black', (0.022, 0.022, 0.024), 0.13, 0.03, bump=0.015, bscale=120.0, spec=0.5),
        # R4: satin, not matte: roughness 0.30 (was 0.4), full dielectric F0 (spec 0.5, was 0.32), the sandy bump
        # nearly gone (0.006, was 0.04: it broke the sheen into a chalky grain), a touch darker
        'pa': mat_plastic('PA black', (0.026, 0.026, 0.028), PA_ROUGH, 0.04, bump=0.006, bscale=140.0, spec=0.5),
        'tin': mat_metal('Sn plated', (0.90, 0.905, 0.91), 0.15, 0.02, 5.0, bump=0.0),
    }


# ------------------------------------------------------------------------------------------------ the switch

def build_switch(M):
    """model one GT01 at identity, bake every modifier; returns [(object, frame)] with frame 'S' (switch) or 'R' (root)"""
    parts = []

    # ---------------------------------------------------------------- cover (clear PC, switch frame)
    ysF = ((L / 2 - CW) * sT - LIFT) / cT                    # where the front end wall's inner face meets the board
    ysF_o = ((L / 2) * sT - LIFT) / cT                       # ... and its outer face
    zi = L / 2 - CW
    prof = [(-L / 2, 0.0), (-zi, 0.0), (-zi, YSH), (zi, YSH), (zi, ysF), (L / 2, ysF_o), (L / 2, H), (-L / 2, H)]
    bm = prism(prof, -W / 2, W / 2, 'YZX')
    # R4: split the end faces below the seam (the frosted skirt band) without a step, then round the whole outer shell
    # first (0.18, 6 segments, no clamp: the bare shell has no tight spots), so its edges, the skirt edges and the seam
    # edge of the side walls get a real fillet; the cuts below come after, and a small second pass rounds their edges
    bmesh.ops.bisect_plane(bm, geom=bm.verts[:] + bm.edges[:] + bm.faces[:], plane_co=(0, 0, YSH - 0.3), plane_no=(0, 0, 1))
    cover = mk('cover', bm, [M['pc'], M['frost']])
    bevel(cover, R_SHELL, 6, 30.0, harden=False, clamp=False)
    bake(cover)
    # cavity first (open at the bottom, onto the base): R1 cut it after the ribs and guide, which deleted them
    boolean(cover, box(-W / 2 + CW, W / 2 - CW, -zi, zi, 1.2, CEIL), 'DIFFERENCE', 'cavity')
    # the plunger's round collar: a raised ring on top (0.35 proud), continuing inside as a guide tube from the ceiling
    boolean(cover, prism(circle(0.0, ZP, RO_COL, 128), H - 0.05, H + 0.35), 'UNION', 'collar')
    boolean(cover, prism(circle(0.0, ZP, RO_COL, 128), 4.75, CEIL + 0.05), 'UNION', 'guide')
    # inner ribs on the side walls (moulded stiffeners, 0.5 x 0.3), and two on each end wall (0.4 x 0.34)
    rib = bmesh.new()
    for yy in (-4.2, -2.6, -0.4, 4.25):
        for s_ in (-1, 1):
            x0, x1 = (W / 2 - CW - 0.3, W / 2 - CW + 0.05) if s_ > 0 else (-W / 2 + CW - 0.05, -W / 2 + CW + 0.3)
            prism(rrect(x1 - x0, 0.5, 0.0, (x0 + x1) / 2, yy), 3.3, CEIL + 0.05, 'XYZ', rib)
    for s_ in (-1, 1):
        for xx in (-1.62, 1.62):
            ya, yb_ = (zi - 0.34, zi + 0.05) if s_ > 0 else (-zi - 0.05, -zi + 0.34)
            box(xx - 0.2, xx + 0.2, ya, yb_, 3.2, CEIL + 0.05, 0.0, rib)
    boolean(cover, rib, 'UNION', 'ribs')
    # ceiling: one thicker step at the COM end (r3: the cross-rib and the NC step under the marks are gone: calmer top)
    crib = bmesh.new()
    box(-W / 2 + CW - 0.05, W / 2 - CW + 0.05, 4.35, zi + 0.05, 5.4, CEIL + 0.05, 0.0, crib)
    boolean(cover, crib, 'UNION', 'crib')
    # the guide's bore (round the plunger's flange), the plunger hole, and the collar's counterbored seat
    boolean(cover, prism(rrect(2.5, 3.1, 0.4, 0.0, ZP, 8), 4.7, CEIL), 'DIFFERENCE', 'bore')
    boolean(cover, prism(rrect(2.3, 1.75, 0.45, 0.0, ZP, 10), 4.7, H + 0.6), 'DIFFERENCE', 'hole')
    boolean(cover, prism(circle(0.0, ZP, RI_COL, 128), H + 0.15, H + 0.7), 'DIFFERENCE', 'seat')
    # snap-fit windows in both end skirts (the base's latch bumps show through them)
    win = bmesh.new()
    box(-1.0, 1.0, -L / 2 - 0.3, -zi + 0.05, 0.92, 1.58, 0.08, win)
    box(-1.0, 1.0, zi - 0.05, L / 2 + 0.3, 1.12, 1.74, 0.08, win)
    boolean(cover, win, 'DIFFERENCE', 'windows')
    bake(cover)
    # R4: the TTC-style latch tabs (see TAB_*): each modelled on its own, its diagonal window cut, every edge rounded
    # (0.1, no clamp), then joined to the side wall, flush with its outer face
    for s_ in (-1, 1):
        x0, x1 = (W / 2 - T_TAB, W / 2) if s_ > 0 else (-W / 2, -W / 2 + T_TAB)
        tb_ = mk('cover.tab', prism(fillet(TAB_OUT, [0, 0.18, 0.18, 0], 8), x0, x1, 'YZX'), [M['pc'], M['frost']])   # R4: with the cover's slots, or the union adds an empty one
        boolean(tb_, prism(fillet(TAB_WIN, [0.08] * 4, 6), x0 - 0.2, x1 + 0.2, 'YZX'), 'DIFFERENCE', 'window')
        bake(tb_); bevel(tb_, 0.1, 4, 30.0, harden=False, clamp=False); bake(tb_)
        tb_.hide_render = True; CUTTERS.append(tb_)
        md = cover.modifiers.new('tab', 'BOOLEAN'); md.operation = 'UNION'; md.solver = 'EXACT'; md.object = tb_
    bake(cover)
    bevel(cover, 0.05, 4, 30.0, harden=False, clamp=True)    # R4: the cuts' edges (the shell's 15-deg segments are below the limit)
    bake(cover)
    # R4: no moulded text on the top (Brock 07:44): R3's >PC< and date wheel are gone; the top is plain moulding round
    # the collar ring. The one ejector-pin mark stays inside, on the ceiling step, where a core pin would push.
    # R3's 0.03 parting step is gone too: it clamped every fillet on the cover to zero; the seam with the base is the parting
    ej = bmesh.new()
    prism(circle(0.0, 5.1, 0.38, 40), 5.4 - 0.1, 5.4 + 0.025, 'XYZ', ej)
    boolean(cover, ej, 'DIFFERENCE', 'ejector')
    bake(cover)
    weighted_normals(cover); bake(cover)
    # frosted: the end skirts' outer faces below the seam band
    def frosted(c, n):
        return c.z < YSH - 0.15 and abs(n.y) > 0.95 and abs(c.y) > L / 2 - 0.08
    assign_faces(cover, 1, frosted)
    parts.append((cover, 'S'))

    # ---------------------------------------------------------------- wedge: the GT01's special bottom housing (black PA, root frame)
    Cf, Fb = S2W(0, L / 2), S2W(0, -L / 2)
    # R4: the seam: the base's top sits SEAM_GAP under the cover's skirt edge and its sides INSET inside the cover's,
    # both edges round (cover 0.18, base 0.25): a moulded parting, a soft V with a dark core and a lit lip either side
    C2, F2 = S2W(YSH - SEAM_GAP, zi), S2W(YSH - SEAM_GAP, -zi)
    Fi = S2W(0, -zi)
    fr = S2W(ysF, zi)
    wprof = [(Fb[1], 0.0), (fr[1], 0.0), (C2[1], C2[0]), (F2[1], F2[0]), (Fi[1], Fi[0]), (Fb[1], Fb[0])]
    WI = W / 2 - INSET
    wedge = mk('wedge', prism(wprof, -WI, WI, 'YZX'), [M['pa']])
    zb = Fb[1] + WALL
    pockets = [circle(-2.86, 3.81, 0.76, 96), circle(3.44, 1.49, 0.79, 96), stadium(0.15, 2.05, 2.11, 1.10, -TILT, 28),   # R4: oval 0.25 lower, clear of the clip
               fillet([(0.07, WALL), (zb, 3.03), (zb, WALL)], [0.35, 0.25, 0.25], 14)]
    # R4: each pocket is cut by a lofted cutter carrying its own round lip (R_LIP) and floor fillet, so the rim is a true
    # radius whatever the bevel below does (R3's bevel on these rims was clamped to 0.015 mm)
    pk = bmesh.new()
    for s in (-1, 1):
        for p in pockets:
            loft(p, pocket_rings(WI, 0.85, s, R_LIP, 0.12), 'YZX', pk)
    boolean(wedge, pk, 'DIFFERENCE', 'pockets')
    bake(wedge)
    # then the outer edges and corners: 0.25, 6 segments, no clamp (the lips' 15-deg steps are under the 30-deg limit)
    bevel(wedge, R_WEDGE, 6, 30.0, harden=False, clamp=False)
    bake(wedge)
    # R4: the clip's seat: a recess round each latch tab (TAB_CLR clear of it, open through the top at the seam, its rim
    # a 0.12 lip, its floor a 0.06 fillet), and in it the wedge lug the tab's window hooks under (ramp up top, flat
    # catch below, rounded 0.05)
    rbm = bmesh.new()
    xr = W / 2 - T_TAB - TAB_CLR
    for s_ in (-1, 1):
        loft(offset_outline(ccw(dedup(fillet(TAB_EXT, [0, 0.18, 0.18, 0], 8))), TAB_CLR), pocket_rings(WI, WI - xr, s_, 0.12, 0.06), 'YZX', rbm)
    bmesh.ops.transform(rbm, matrix=BODY_M, verts=rbm.verts)
    boolean(wedge, rbm, 'DIFFERENCE', 'clip_recess')
    lbm = bmesh.new()
    for s_ in (-1, 1):
        prof = [(W / 2 - 0.62, YSH - 0.68), (W / 2 - 0.10, YSH - 0.68), (W / 2 - 0.10, YSH - 0.55), (W / 2 - 0.40, YSH - 0.36), (W / 2 - 0.62, YSH - 0.36)]
        prism([(s_ * x, z) for x, z in prof], -1.37, 0.37, 'XZY', lbm)
    bmesh.ops.transform(lbm, matrix=BODY_M, verts=lbm.verts)
    lug = mk('wedge.lug', lbm, [M['pa']]); bevel(lug, 0.05, 3, 30.0, harden=False, clamp=False); bake(lug)
    lug.hide_render = True; CUTTERS.append(lug)
    md = wedge.modifiers.new('lug', 'BOOLEAN'); md.operation = 'UNION'; md.solver = 'EXACT'; md.object = lug
    bake(wedge)
    # ejector-pin marks on the underside (cut after the bevel: they are 0.03 deep)
    ejw = bmesh.new()
    for yy in (-3.0, 2.6):
        prism(circle(0.0, yy, 0.5, 40), -0.5, 0.03, 'XYZ', ejw)
    boolean(wedge, ejw, 'DIFFERENCE', 'ejector')
    bake(wedge)
    weighted_normals(wedge); bake(wedge)
    parts.append((wedge, 'R'))

    # the base's top details inside the cover (switch frame, black PA): terminal pedestals, latch bumps
    base_bm = bmesh.new()
    box(-1.4, 1.4, 4.70, zi - 0.02, YSH - 0.02, 3.0, 0.16, base_bm)          # COM pedestal
    box(-1.4, 1.4, -zi + 0.02, -5.245, YSH - 0.02, 4.62, 0.12, base_bm)      # NC pedestal
    box(-0.85, 0.85, -4.575, -3.325, YSH - 0.02, Z_NOTAB - T_SHEET - 0.002, 0.14, base_bm)   # NO pedestal (under the NO tab)
    for s in (-1, 1):                                                       # plunger / blade guide rails
        box(s * 1.85 - 0.2, s * 1.85 + 0.2, -3.5, 3.9, YSH - 0.02, 2.66, 0.1, base_bm)      # (r3: clear of the 0.7 walls)
    base = mk('baseTop', base_bm, [M['pa']])
    bevel(base, 0.08, 3, 20.0); bake(base)
    parts.append((base, 'S'))
    lat = bmesh.new()
    prism([(-zi + 0.02, 0.97), (-L / 2 + 0.08, 0.97), (-L / 2 + 0.08, 1.22), (-zi + 0.02, 1.53)], -0.95, 0.95, 'YZX', lat)
    prism([(zi - 0.02, 1.17), (L / 2 - 0.08, 1.17), (L / 2 - 0.08, 1.42), (zi - 0.02, 1.69)], -0.95, 0.95, 'YZX', lat)
    latch = mk('latches', lat, [M['pa']])
    bevel(latch, 0.06, 3, 20.0); bake(latch)
    parts.append((latch, 'S'))

    # ---------------------------------------------------------------- terminals inside (gold-plated brass, switch frame)
    tb = bmesh.new()
    t2 = T_SHEET / 2
    box(-1.1, 1.1, PITCH - t2, PITCH + t2, YSH - 0.3, Z_ANCHOR, 0.0, tb)                     # COM post
    box(-1.1, 1.1, PITCH - 0.34 - 0.49, PITCH - 0.34 + 0.49, Z_ANCHOR - T_SHEET, Z_ANCHOR, 0.08, tb)   # COM anchor tab
    box(-1.0, 1.0, -PITCH - t2, -PITCH + t2, YSH - 0.3, Z_NCARM + T_SHEET, 0.0, tb)           # NC post
    box(-0.72, 0.72, -PITCH - t2, Z_TIP + 0.72, Z_NCARM, Z_NCARM + T_SHEET, 0.12, tb)        # NC arm over the tip
    box(-0.72, 0.72, Z_TIP - 0.72, Z_TIP + 0.72, Z_NOTAB - T_SHEET, Z_NOTAB, 0.12, tb)       # NO tab under the tip
    box(-0.7, 0.7, Z_TIP + 0.22, Z_TIP + 0.72, YSH - 0.3, Z_NOTAB - 0.2, 0.0, tb)            # NO riser
    # the fulcrum: a narrow tab with a V notch at its tip, where the tongue seats
    prism([(PITCH - t2, FUL_Z - 0.2), (PITCH - t2, FUL_Z + 0.2), (FUL_Y, FUL_Z + 0.2), (FUL_Y + 0.16, FUL_Z), (FUL_Y, FUL_Z - 0.2)],
          -0.5, 0.5, 'YZX', tb)
    term = mk('terminals', tb, [M['gold']])
    bevel(term, 0.06, 3, 30.0); bake(term)
    parts.append((term, 'S'))

    # ---------------------------------------------------------------- the moving spring (gold-plated BeCu, 0.08 mm)
    zA0, zA1 = Z_TIP - 0.55, PITCH + 0.12
    blade = mk('spring', prism(rrect(2.2, zA1 - zA0, 0.5, 0.0, (zA0 + zA1) / 2, 10), Z_BLADE, Z_BLADE + T_BLADE), [M['gold']])
    wz0, wz1 = Z_TIP + 0.9, FUL_Y - 0.25
    boolean(blade, prism(rrect(1.16, wz1 - wz0, 0.22, 0.0, (wz0 + wz1) / 2, 8), Z_BLADE - 0.2, Z_BLADE + 0.3), 'DIFFERENCE', 'window')
    # two embossed stiffening ribs along the frame's rails (a pressed sheet-metal detail)
    bevel(blade, 0.04, 3, 30.0); bake(blade)
    parts.append((blade, 'S'))
    # the tongue: cut from the window, bowed, its end seated in the fulcrum's notch
    P0 = Vector((0, wz0 - 0.05, Z_BLADE + T_BLADE / 2)); P2 = Vector((0, FUL_Y + 0.06, FUL_Z))
    d = (P2 - P0).normalized(); nrm = Vector((0, -d.z, d.y))
    P1 = (P0 + P2) / 2 + nrm * -0.22          # R3: a deeper bow, so the snap spring's curve reads
    path = [P0 * (1 - t) ** 2 + P1 * 2 * (1 - t) * t + P2 * t * t for t in (i / 64 for i in range(65))]
    tongue = mk('tongue', sweep_rect(path, 0.96, T_BLADE), [M['gold']])
    bevel(tongue, 0.04, 3, 30.0); bake(tongue)
    parts.append((tongue, 'S'))

    # ---------------------------------------------------------------- contacts (gold alloy rivets) and the anchor rivet
    cb = bmesh.new()
    def add_dome(bmsrc, loc):
        bmsrc.verts.ensure_lookup_table()
        bmesh.ops.translate(bmsrc, vec=Vector(loc), verts=bmsrc.verts)
        me = bpy.data.meshes.new('tmp'); bmsrc.to_mesh(me); bmsrc.free(); cb.from_mesh(me); bpy.data.meshes.remove(me)
    add_dome(dome(R_FC, H_FC, flip=True), (0, Z_TIP, Z_NCARM))      # NC, under the arm
    add_dome(dome(R_FC, H_FC), (0, Z_TIP, Z_NOTAB))                 # NO, on the tab
    add_dome(dome(R_MC, H_MC), (0, Z_TIP, Z_BLADE + T_BLADE))       # moving contact, top
    add_dome(dome(R_MC, H_MC, flip=True), (0, Z_TIP, Z_BLADE))      # moving contact, bottom
    add_dome(dome(0.42, 0.16), (0, PITCH - 0.42, Z_BLADE + T_BLADE))  # anchor rivet
    contacts = mk('contacts', cb, [M['goldc']])
    bevel(contacts, 0.04, 3, 30.0); bake(contacts)
    parts.append((contacts, 'S'))

    # ---------------------------------------------------------------- plunger (black POM): cap with a rounded top, flange, nose
    ya = H + CAP_PROUD - CAP_R
    capp = [(ZP - CAP_L / 2, CEIL - 0.3), (ZP + CAP_L / 2, CEIL - 0.3), (ZP + CAP_L / 2, ya)]
    capp += [(ZP + CAP_R * math.cos(math.pi * i / 32), ya + CAP_R * math.sin(math.pi * i / 32)) for i in range(1, 32)]
    capp += [(ZP - CAP_L / 2, ya)]
    # R4: each piece rounded on its own (no clamp), then joined: R3's single pass after the unions was clamped to 0.018
    # by the 0.1 ledge between the cap and the flange
    plunger = mk('plunger', prism(capp, -CAP_W / 2, CAP_W / 2, 'YZX'), [M['pom']])
    bevel(plunger, 0.09, 5, 20.0, harden=False, clamp=False); bake(plunger)
    for nm, bmp, wd in (('flange', prism(rrect(2.3, 2.9, 0.3, 0.0, ZP, 10), CEIL - 0.45, CEIL - 0.02), 0.08),
                        ('nose', prism(rrect(1.3, 1.1, 0.3, 0.0, ZP, 10), Z_BLADE + T_BLADE + 0.002, CEIL - 0.2), 0.06)):
        pc_ = mk('plunger.' + nm, bmp, [M['pom']]); bevel(pc_, wd, 4, 20.0, harden=False, clamp=False); bake(pc_)
        pc_.hide_render = True; CUTTERS.append(pc_)
        md = plunger.modifiers.new(nm, 'BOOLEAN'); md.operation = 'UNION'; md.solver = 'EXACT'; md.object = pc_
    bake(plunger)
    weighted_normals(plunger); bake(plunger)
    parts.append((plunger, 'S'))

    # ---------------------------------------------------------------- pins (tin-plated, root frame)
    pb = bmesh.new()
    ys_, yb = -0.95, -3.3
    # R3: straight blades with 45-degree chamfered tips (0.16 mm each corner)
    pin = [(-0.55, 0.35), (-0.55, ys_ + 0.14), (-0.38, ys_ - 0.03), (-0.38, yb + 0.2), (-0.18, yb), (0.18, yb), (0.38, yb + 0.2),
           (0.38, ys_ - 0.03), (0.55, ys_ + 0.14), (0.55, 0.35)]
    # R4: convex corners 0.09 (over the 0.07 bevel, so it needs no clamp: R3's clamped pass came out at 0.03)
    pin = fillet(pin, [0, 0.09, 0.1, 0.09, 0.09, 0.09, 0.09, 0.1, 0.09, 0], 6)
    for zz in (PITCH, 0.0, -PITCH):
        prism([(u + zz, v) for u, v in pin], -T_SHEET / 2, T_SHEET / 2, 'YZX', pb)
    pins = mk('pins', pb, [M['tin']])
    bevel(pins, 0.07, 4, 30.0, harden=False, clamp=False); bake(pins)
    weighted_normals(pins); bake(pins)
    parts.append((pins, 'R'))

    for c in CUTTERS:
        bpy.data.objects.remove(c, do_unlink=True)
    CUTTERS.clear()
    return parts


def place_switch(parts, name, M_world, first):
    """an instance of the switch at M_world (root frame -> world); the first call uses the objects, later ones link-copy"""
    obs = []
    for ob, frame in parts:
        # R4: name copies by role: R3 took ob.name.split('.')[0] after the first call had renamed the originals to
        # 'swA.<role>', so the second switch's parts were all 'swB.swA.00N' and no role-based light link ever found
        # them (its gold took the full key, top, front and rim strips: the champagne gold; its black parts no under fill)
        role = ob.get('role') or ob.name.split('.')[0]
        o = ob if first else ob.copy()
        if not first:
            SCN.collection.objects.link(o)
        o.name = f'{name}.{role}'; o['role'] = role
        o.matrix_world = M_world @ (BODY_M if frame == 'S' else Matrix.Identity(4))
        obs.append(o)
    return obs


# ------------------------------------------------------------------------------------------------ world, lights, camera

def make_world(env=0.012):
    """dim studio for reflections and bounces: brighter overhead, darker below"""
    w = bpy.data.worlds.new('studio')
    try: w.use_nodes = True
    except Exception: pass
    N, Lk = w.node_tree.nodes, w.node_tree.links
    for n in list(N): N.remove(n)
    out = N.new('ShaderNodeOutputWorld')
    gtc = N.new('ShaderNodeTexCoord'); gsep = N.new('ShaderNodeSeparateXYZ'); Lk.new(gtc.outputs['Generated'], gsep.inputs[0])
    up = N.new('ShaderNodeMapRange'); up.interpolation_type = 'SMOOTHSTEP'
    up.inputs['From Min'].default_value = -0.4; up.inputs['From Max'].default_value = 1.0
    up.inputs['To Min'].default_value = env * 0.2; up.inputs['To Max'].default_value = env * 3.0
    Lk.new(gsep.outputs['Z'], up.inputs['Value'])
    # a soft bright band round the horizon (the studio's walls / bounce flats): gives metals and black plastic a gradient
    ab = N.new('ShaderNodeMath'); ab.operation = 'ABSOLUTE'; Lk.new(gsep.outputs['Z'], ab.inputs[0])
    band = N.new('ShaderNodeMapRange'); band.interpolation_type = 'SMOOTHSTEP'
    band.inputs['From Min'].default_value = 0.0; band.inputs['From Max'].default_value = 0.42
    band.inputs['To Min'].default_value = env * 3.2; band.inputs['To Max'].default_value = 0.0
    Lk.new(ab.outputs[0], band.inputs['Value'])
    tot = N.new('ShaderNodeMath'); tot.operation = 'ADD'; Lk.new(up.outputs['Result'], tot.inputs[0]); Lk.new(band.outputs['Result'], tot.inputs[1])
    bg = N.new('ShaderNodeBackground'); Lk.new(tot.outputs[0], bg.inputs['Strength'])
    bg.inputs['Color'].default_value = (1.0, 1.0, 1.0, 1)
    Lk.new(bg.outputs[0], out.inputs['Surface'])
    try: w.cycles.sampling_method = 'NONE'
    except Exception: pass
    SCN.world = w
    return w


def make_backdrop(cam, tgt, behind=260.0, center=(0.5, 0.56), c_in=0.16, c_mid=0.05, c_out=0.012, squash=0.92):
    """a large emissive card square to the camera, far behind the subject: a dark-grey radial gradient in screen space
    (Window coordinates, so its view through the clear covers refracts correctly); seen by camera, glossy and
    transmission rays, invisible to shadow rays, not a light source"""
    m, N, Lk, b, out = _mat('backdrop')
    N.remove(b)
    tc = N.new('ShaderNodeTexCoord'); sep = N.new('ShaderNodeSeparateXYZ'); Lk.new(tc.outputs['Window'], sep.inputs[0])
    def mn(op, a=None, bb=None, va=None, vb=None):
        n = N.new('ShaderNodeMath'); n.operation = op
        if a is not None: Lk.new(a, n.inputs[0])
        else: n.inputs[0].default_value = va
        if bb is not None: Lk.new(bb, n.inputs[1])
        elif vb is not None: n.inputs[1].default_value = vb
        return n.outputs[0]
    dx = mn('MULTIPLY', mn('SUBTRACT', sep.outputs['X'], vb=center[0]), vb=squash)
    dy = mn('SUBTRACT', sep.outputs['Y'], vb=center[1])
    r = mn('SQRT', mn('ADD', mn('MULTIPLY', dx, dx), mn('MULTIPLY', dy, dy)))
    t1 = N.new('ShaderNodeMapRange'); t1.interpolation_type = 'SMOOTHERSTEP'
    t1.inputs['From Min'].default_value = 0.0; t1.inputs['From Max'].default_value = 0.45
    t1.inputs['To Min'].default_value = 1.0; t1.inputs['To Max'].default_value = 0.0
    Lk.new(r, t1.inputs['Value'])
    t2 = N.new('ShaderNodeMapRange'); t2.interpolation_type = 'SMOOTHSTEP'
    t2.inputs['From Min'].default_value = 0.0; t2.inputs['From Max'].default_value = 0.9
    t2.inputs['To Min'].default_value = 1.0; t2.inputs['To Max'].default_value = 0.0
    Lk.new(r, t2.inputs['Value'])
    lum = mn('ADD', mn('ADD', mn('MULTIPLY', t1.outputs['Result'], vb=c_in - c_mid), mn('MULTIPLY', t2.outputs['Result'], vb=c_mid - c_out)), vb=c_out)
    comb = N.new('ShaderNodeCombineXYZ')
    Lk.new(lum, comb.inputs[0]); Lk.new(lum, comb.inputs[1]); Lk.new(lum, comb.inputs[2])     # R3: neutral grey, as the reference
    em = N.new('ShaderNodeEmission'); Lk.new(comb.outputs[0], em.inputs['Color']); em.inputs['Strength'].default_value = 1.0
    Lk.new(em.outputs[0], out.inputs['Surface'])
    try: m.cycles.emission_sampling = 'NONE'
    except Exception: pass
    c = (cam.location - Vector(tgt)).normalized()
    D = (cam.location - Vector(tgt)).length + behind
    size = D * 0.36 * 3.0
    bm = box(-size / 2, size / 2, -size / 2, size / 2, -0.5, 0.0)
    card = mk('backdrop', bm, [m], smooth=False)
    q = (-c).to_track_quat('Z', 'Y')     # card's +Z faces the camera
    card.matrix_world = Matrix.Translation(Vector(tgt) - c * behind) @ q.to_matrix().to_4x4() @ Matrix.Rotation(math.pi, 4, 'X')
    card.visible_shadow = False; card.visible_diffuse = False; card.visible_volume_scatter = False
    return card


def look_at(ob, loc, tgt, roll=0.0):
    ob.location = loc
    d = (Vector(tgt) - Vector(loc))
    q = d.to_track_quat('-Z', 'Y')
    ob.rotation_euler = (q @ Quaternion((0, 0, 1), roll * D2R)).to_euler()


def area(name, tgt, direction, dist, sx, sy, power, color=(1, 1, 1), spread=180.0, roll=0.0, glossy_only=False, through=True):
    li = bpy.data.lights.new(name, 'AREA')
    li.shape = 'RECTANGLE'; li.size = sx; li.size_y = sy; li.energy = power; li.color = color
    li.spread = spread * D2R
    ob = bpy.data.objects.new(name, li); SCN.collection.objects.link(ob)
    dirv = Vector(direction).normalized()
    look_at(ob, Vector(tgt) + dirv * dist, tgt, roll)
    ob.visible_camera = False
    if not through:            # not seen through the clear covers (a flagged softbox): reflections and edge glints only
        ob.visible_transmission = False
    if glossy_only:
        ob.visible_diffuse = False
    return ob


def sph(az, el):
    """direction from azimuth (deg, about +Z, 0 = +Y... measured in the world) and elevation"""
    a, e = az * D2R, el * D2R
    return (math.cos(e) * math.sin(a), -math.cos(e) * math.cos(a), math.sin(e))


# ------------------------------------------------------------------------------------------------ shots

def M_of(loc, rot_deg, order='XYZ'):
    return Matrix.Translation(loc) @ Euler([r * D2R for r in rot_deg], order).to_matrix().to_4x4()


CENTER = Vector((0.0, 1.1, 3.6))    # the switch's visual centre in its root frame


def frame_m(z_axis, y_hint, center_world):
    """root-frame matrix whose +Z (switch up) is z_axis and +Y (toward the plunger end) follows y_hint, placed so the
    switch's visual centre lands on center_world"""
    z = Vector(z_axis).normalized(); y = Vector(y_hint); y = (y - z * y.dot(z)).normalized(); x = y.cross(z)
    R = Matrix((x, y, z)).transposed().to_4x4()
    t = Vector(center_world) - (R @ CENTER.to_4d()).to_3d()
    return Matrix.Translation(t) @ R


def cam_basis(cdir):
    c = Vector(cdir).normalized(); right = c.cross(Vector((0, 0, -1))).normalized()   # screen right
    up = right.cross(-c).normalized()
    return c, right, up


def shot_hero(parts, args):
    """front switch in three-quarter view (plunger end toward the camera, right); a second one tilted behind it"""
    cdir = Vector(sph(-24, 23))
    c, right, up = cam_basis(cdir)
    A = frame_m((0, 0, 1), right * 0.78 + c * 0.62, Vector((1.2, -1.0, 0.0)))
    place_switch(parts, 'swA', A, True); SW['A'] = A
    bz = (c * 0.86 + up * 0.32 - right * 0.22)
    by = (up * 0.78 + right * 0.55)
    B = frame_m(bz, by, Vector((1.2, -1.0, 0.0)) - c * 13.0 - right * 5.4 + up * 9.6)
    place_switch(parts, 'swB', B, False); SW['B'] = B
    tgt = Vector((1.2, -1.0, 0.0)) - c * 5.0 - right * 2.6 + up * 4.4
    return tgt, cdir, 98.0, Vector((1.2, -1.0, 0.0)) + c * 2.0


def shot_close(parts, args):
    """one switch, side-on and low, the mechanism read through the clear side wall"""
    cdir = Vector(sph(-14, 14))
    c, right, up = cam_basis(cdir)
    A = frame_m((0, 0, 1), right * 0.92 + c * 0.38, Vector((0.0, 0.0, 0.0)))
    place_switch(parts, 'swA', A, True); SW['A'] = A
    tgt = Vector((0.0, 0.0, 2.2))
    return tgt, cdir, 60.0, Vector((0.0, 0.0, 3.6)) + c * 1.6


SHOTS = {'hero': shot_hero, 'close': shot_close}
FRONT_THROUGH = True
KEY_FLAG = False                     # R3: hide key/top from transmission (the close shot, where the key sits low behind)
SW = {}                              # R3: the shot's switch placements (root frame -> world), for the light rig
SATIN = (1.0, 22.0, 16.0)            # R4: the satin softbox (power, az and el offsets from the base side's mirror direction)
GOLD_K = 0.3                         # R4: the key/top softboxes' strength on the gold (gold-only copies)


def mirror_dir(M, cam_loc, ys=-1.0):
    """R3: (point, direction) of the camera's mirror image in a switch's flat top face: a softbox placed along the
    direction from the point reflects in that face (and in the gold blade below it, which lies parallel)"""
    MS = M @ BODY_M
    n = (MS.to_3x3() @ Vector((0, 0, 1))).normalized()
    p = MS @ Vector((0.0, ys, H))
    v = (Vector(cam_loc) - p).normalized()
    return p, (2 * n.dot(v) * n - v).normalized()


def setup_lights(tgt, cam_dir, scale=1.0, k=1.0, cam_loc=None, key_k=1.0, rim_k=1.0, front_k=1.0, under_k=1.0):
    """R3 rig. Key: a big softbox on the front switch's top-face mirror direction (broad clean highlight on the cover's
    flat top and its gold blade); top: another on the back switch's; front: soft key from the camera's left; rim strips:
    thin, bright, flagged from the covers' transmission (reflections and edge lines only); kicker and under-bounce."""
    caz = math.degrees(math.atan2(cam_dir.x, -cam_dir.y))
    def at(daz, el): return sph(caz + daz, el)
    s = scale; P = k * s * s
    pA, rA = mirror_dir(SW['A'], cam_loc)
    # r3: a larger, mid-bright key (160 x 110) washed the covers: it is seen through the PC, and 2.75x the solid angle
    # meant far more refracted rays found it. Back to round 2's 100 x 64.
    # R4: key and top are not seen through the PC: the gold behind a cover mirrors them via refraction paths, where light
    # linking cannot reach (Cycles checks the link at the last surface, the PC); the gold gets them from keyG/topG instead
    area('key', pA, rA, 170 * s, 100 * s, 64 * s, 0.78e5 * P * key_k, (1.0, 0.99, 0.975), through=False)
    # R4 gold fix: the gold blades lie parallel to the tops, so they mirror the key and top softboxes square on, at ~1.3
    # linear, and AgX bleaches that to champagne (it stayed pale at -1 EV and with the rim strips unlinked: those were
    # not it). The key and top now skip the gold (main links them); these copies light only the gold, at GOLD_K
    area('keyG', pA, rA, 170 * s, 100 * s, 64 * s, 0.78e5 * P * key_k * GOLD_K, (1.0, 0.99, 0.975), through=not KEY_FLAG)
    if 'B' in SW:
        pB, rB = mirror_dir(SW['B'], cam_loc)
        area('top', pB, rB, 170 * s, 100 * s, 70 * s, 0.66e5 * P * key_k, (1.0, 1.0, 1.0), through=False)
        area('topG', pB, rB, 170 * s, 100 * s, 70 * s, 0.66e5 * P * key_k * GOLD_K, (1.0, 1.0, 1.0))
    else:
        area('top', tgt, at(-150, 78), 170 * s, 110 * s, 60 * s, 0.48e5 * P * key_k, (1.0, 1.0, 1.0), through=not KEY_FLAG)
    area('front', tgt, at(-52, 40), 170 * s, 140 * s, 110 * s, 1.9e5 * P * front_k, (1.0, 0.99, 0.98), through=FRONT_THROUGH)
    # R4: the back switch's tops (and their gold) mirror this one too (16 deg off; radiance 4.2 vs the top's 1.5): split
    area('frontG', tgt, at(-52, 40), 170 * s, 140 * s, 110 * s, 1.9e5 * P * front_k * GOLD_K, (1.0, 0.99, 0.98), through=FRONT_THROUGH)
    area('fill', tgt, at(65, 8), 190 * s, 170 * s, 170 * s, 0.5e5 * P * front_k, (1.0, 1.0, 1.0))
    R = rim_k
    area('rimL', tgt, at(-128, 18), 150 * s, 10 * s, 220 * s, 2.4e5 * P * R, (1.0, 1.0, 1.0), through=False)
    area('rimR', tgt, at(118, 12), 150 * s, 10 * s, 220 * s, 2.4e5 * P * R, (1.0, 1.0, 1.0), through=False)
    area('rimTop', tgt, at(178, 58), 150 * s, 220 * s, 10 * s, 2.0e5 * P * R, (1.0, 1.0, 1.0), through=False)
    area('stripF', tgt, at(-8, 58), 160 * s, 220 * s, 9 * s, 1.3e5 * P * R, (1.0, 1.0, 1.0), through=False)
    area('kick', tgt, at(20, -26), 150 * s, 200 * s, 12 * s, 1.6e5 * P * R, (1.0, 1.0, 1.0), through=False)
    area('pinkick', tgt, at(-72, -22), 150 * s, 26 * s, 60 * s, 0.2e5 * P, (1.0, 1.0, 1.0), through=False)   # the pins' flat faces mirror this (so does the wedge's side: keep it low)
    area('bounce', tgt, at(175, -28), 150 * s, 220 * s, 70 * s, 0.3e5 * P, (1.0, 1.0, 1.0), through=False)
    # r3: the dark parts at the bottom: a broad, soft fill card from below and in front, and a thin strip on the
    # mirror direction of the wedge's bottom-edge bevels (computed: about -168 deg, -45 deg from the camera)
    area('under', tgt, at(5, -46), 170 * s, 260 * s, 150 * s, 0.55e5 * P * under_k, (1.0, 1.0, 1.0))
    area('rimBot', tgt, at(-168, -45), 150 * s, 230 * s, 10 * s, 1.2e5 * P * under_k, (1.0, 1.0, 1.0), through=False)
    area('rimBotR', tgt, at(128, -40), 150 * s, 230 * s, 10 * s, 0.9e5 * P * under_k, (1.0, 1.0, 1.0), through=False)
    # R4: the satin sheen: a broad softbox just off the mirror direction of the front switch's base side face (computed,
    # not guessed), so the face carries the soft edge of its reflection as a gradient and the fillets and the pockets'
    # lips that turn toward it catch it; light-linked to the black base only (main)
    M = SW['A']
    n = (M.to_3x3() @ Vector((1, 0, 0))).normalized()
    p = M @ Vector((W / 2, 0.0, 2.0))
    v = (Vector(cam_loc) - p).normalized()
    r = (2 * n.dot(v) * n - v).normalized()
    az, el = math.degrees(math.atan2(r.x, -r.y)), math.degrees(math.asin(max(-1.0, min(1.0, r.z))))
    print(f'[r4] base side mirror dir: az {az - caz:+.1f} el {el:+.1f} (from the camera azimuth)', flush=True)
    area('satin', p, sph(az + SATIN[1], el + SATIN[2]), 150 * s, 120 * s, 80 * s, 0.5e5 * P * SATIN[0], (1.0, 1.0, 1.0), through=False)


def setup_render(args):
    sc = SCN
    sc.render.engine = 'CYCLES'
    cy = sc.cycles
    cy.device = 'CPU'
    sc.render.threads_mode = 'FIXED'; sc.render.threads = args.threads
    sc.render.resolution_x = args.res; sc.render.resolution_y = args.res; sc.render.resolution_percentage = 100
    cy.samples = args.spp
    cy.use_adaptive_sampling = True; cy.adaptive_threshold = args.noise; cy.adaptive_min_samples = min(32, max(8, args.spp // 8))
    cy.use_denoising = True; cy.denoiser = 'OPENIMAGEDENOISE'
    cy.denoising_input_passes = 'RGB_ALBEDO_NORMAL'; cy.denoising_prefilter = 'ACCURATE'
    try: cy.denoising_quality = 'HIGH'
    except Exception: pass
    cy.max_bounces = 32; cy.diffuse_bounces = 3; cy.glossy_bounces = 10; cy.transmission_bounces = 20
    cy.volume_bounces = 0; cy.transparent_max_bounces = 24
    cy.caustics_reflective = False; cy.caustics_refractive = False
    cy.blur_glossy = 0.25
    cy.sample_clamp_direct = 0.0; cy.sample_clamp_indirect = 12.0
    cy.use_light_tree = True
    cy.seed = 7
    sc.render.film_transparent = False
    try: sc.cycles.pixel_filter_type = 'BLACKMAN_HARRIS'
    except Exception: pass
    sc.cycles.filter_width = 1.3
    sc.view_settings.view_transform = 'AgX'
    sc.view_settings.look = args.look
    sc.view_settings.exposure = args.exposure
    sc.view_settings.gamma = 1.0
    sc.render.image_settings.file_format = 'PNG'
    sc.render.image_settings.color_mode = 'RGB'
    sc.render.image_settings.color_depth = '16' if args.depth16 else '8'
    sc.render.dither_intensity = 1.0
    sc.unit_settings.system = 'METRIC'; sc.unit_settings.scale_length = 0.001; sc.unit_settings.length_unit = 'MILLIMETERS'


def main():
    global SCN
    ap = argparse.ArgumentParser()
    ap.add_argument('--shot', default='hero', choices=list(SHOTS))
    ap.add_argument('--res', type=int, default=600)
    ap.add_argument('--spp', type=int, default=64)
    ap.add_argument('--noise', type=float, default=0.03)
    ap.add_argument('--threads', type=int, default=1)
    ap.add_argument('--fstop', type=float, default=0.0)
    ap.add_argument('--lens', type=float, default=100.0)
    ap.add_argument('--exposure', type=float, default=0.0)
    ap.add_argument('--look', default='AgX - Medium High Contrast')
    ap.add_argument('--depth16', action='store_true')
    ap.add_argument('--blend', default='')
    ap.add_argument('--out', default='out/draft.png')
    ap.add_argument('--bgx', type=float, default=0.5)
    ap.add_argument('--bgy', type=float, default=0.56)
    ap.add_argument('--bgin', type=float, default=0.16)
    ap.add_argument('--bgmid', type=float, default=0.058)
    ap.add_argument('--bgout', type=float, default=0.014)
    ap.add_argument('--light', type=float, default=1.25)
    ap.add_argument('--only', default='')
    ap.add_argument('--key', type=float, default=0.4)
    ap.add_argument('--under', type=float, default=1.0)
    ap.add_argument('--rim', type=float, default=0.8)
    ap.add_argument('--front', type=float, default=0.85)
    ap.add_argument('--front_flag', action='store_true')
    ap.add_argument('--key_flag', action='store_true')
    ap.add_argument('--satin', type=float, default=1.0)       # R4: the black base's satin softbox (power multiplier)
    ap.add_argument('--satin_az', type=float, default=22.0)   # ... its offset from the base side's mirror direction
    ap.add_argument('--satin_el', type=float, default=16.0)
    ap.add_argument('--gold_k', type=float, default=0.3)      # R4: the key/top's strength on the gold
    ap.add_argument('--border', default='')                   # R4: x0,y0,x1,y1 (0-1, y up): render only that region
    args = ap.parse_args([a for a in sys.argv[1:]])
    global SATIN, GOLD_K; SATIN = (args.satin, args.satin_az, args.satin_el); GOLD_K = args.gold_k
    t0 = time.time()
    bpy.ops.wm.read_factory_settings(use_empty=True)
    SCN = bpy.context.scene
    setup_render(args)
    M = make_materials()
    parts = build_switch(M)
    tgt, cdir, dist, focus = SHOTS[args.shot](parts, args)
    make_world()
    cam_d = bpy.data.cameras.new('cam'); cam_d.lens = args.lens; cam_d.sensor_width = 36.0; cam_d.sensor_fit = 'HORIZONTAL'
    cam_d.clip_start = 1.0; cam_d.clip_end = 5000.0
    cam = bpy.data.objects.new('cam', cam_d); SCN.collection.objects.link(cam); SCN.camera = cam
    look_at(cam, tgt + cdir.normalized() * dist, tgt)
    if args.fstop > 0:
        cam_d.dof.use_dof = True; cam_d.dof.aperture_fstop = args.fstop; cam_d.dof.aperture_blades = 7; cam_d.dof.aperture_rotation = 10 * D2R
        cam_d.dof.focus_distance = (Vector(focus) - cam.location).length if focus is not None else dist
    global FRONT_THROUGH, KEY_FLAG; FRONT_THROUGH = not args.front_flag; KEY_FLAG = args.key_flag
    setup_lights(tgt, cdir, k=args.light, cam_loc=cam.location, key_k=args.key, rim_k=args.rim, front_k=args.front, under_k=args.under)
    make_backdrop(cam, tgt, center=(args.bgx, args.bgy), c_in=args.bgin, c_mid=args.bgmid, c_out=args.bgout)
    # r3: light linking: the under fill and the bottom rims light only the black parts and the pins (they washed the
    # gold seen through the covers to flat cream, and lit the frosted skirts white)
    rc = bpy.data.collections.new('under_receivers')
    for o in SCN.objects:
        if o.type == 'MESH' and o.name.split('.')[-1] in ('wedge', 'baseTop', 'latches', 'pins', 'plunger'):
            rc.objects.link(o)
    for nm in ('under', 'rimBot', 'rimBotR'):
        if nm in SCN.objects:
            SCN.objects[nm].light_linking.receiver_collection = rc
    # R4: the satin softbox lights the black base only (not the plunger: its POM is glossier and would wash out)
    sc_ = bpy.data.collections.new('satin_receivers')
    for o in SCN.objects:
        if o.type == 'MESH' and o.name.split('.')[-1] in ('wedge', 'baseTop', 'latches'):
            sc_.objects.link(o)
    if 'satin' in SCN.objects:
        SCN.objects['satin'].light_linking.receiver_collection = sc_
    # R4 (R3's gold fix): the rim strips no longer reach the gold (they turned it pale champagne under the tops); they
    # still light the covers, the black parts and the pins, whose new fillets need their edge lines
    gold = ('terminals', 'spring', 'tongue', 'contacts')
    rr = bpy.data.collections.new('rim_receivers')
    for o in SCN.objects:
        if o.type == 'MESH' and o.name != 'backdrop' and o.name.split('.')[-1] not in gold:
            rr.objects.link(o)
    for nm in ('rimL', 'rimR', 'rimTop', 'stripF', 'kick', 'key', 'top', 'front'):
        if nm in SCN.objects:
            SCN.objects[nm].light_linking.receiver_collection = rr
    gc_ = bpy.data.collections.new('gold_receivers')
    for o in SCN.objects:
        if o.type == 'MESH' and o.name.split('.')[-1] in gold:
            gc_.objects.link(o)
    for nm in ('keyG', 'topG', 'frontG'):
        if nm in SCN.objects:
            SCN.objects[nm].light_linking.receiver_collection = gc_
    # R4: the pin kicker sits within 5 deg of the base side's mirror direction: it washed the satin face grey; pins only
    pk_ = bpy.data.collections.new('pin_receivers')
    for o in SCN.objects:
        if o.type == 'MESH' and o.name.split('.')[-1] == 'pins':
            pk_.objects.link(o)
    if 'pinkick' in SCN.objects:
        SCN.objects['pinkick'].light_linking.receiver_collection = pk_
    if args.only:
        keep = set(args.only.split(','))
        for o in list(SCN.objects):
            if o.type == 'LIGHT' and o.name not in keep:
                bpy.data.objects.remove(o, do_unlink=True)
    t1 = time.time()
    print(f'[r1] scene built in {t1 - t0:.1f}s; objects {len(SCN.objects)}; tris ~{sum(len(o.data.polygons) for o in SCN.objects if o.type == "MESH")} faces', flush=True)
    if args.blend:
        bpy.ops.wm.save_as_mainfile(filepath=os.path.abspath(args.blend))
    if args.border:
        x0, y0, x1, y1 = (float(t) for t in args.border.split(','))
        SCN.render.use_border = True; SCN.render.use_crop_to_border = True
        SCN.render.border_min_x, SCN.render.border_min_y, SCN.render.border_max_x, SCN.render.border_max_y = x0, y0, x1, y1
    SCN.render.filepath = os.path.abspath(args.out)
    bpy.ops.render.render(write_still=True)
    print(f'[r1] rendered {args.shot} {args.res}px {args.spp}spp in {time.time() - t1:.1f}s -> {args.out}', flush=True)


if __name__ == '__main__':
    main()
