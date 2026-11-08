#!/usr/bin/env python3
"""Cycles product shots of Theseus's switch (the GT01, as the deck models it), Blender as a Python module (bpy 5.x).

Geometry: the deck's own GT01 (3d/parts/gt01.js) exported by render/export_gt01.mjs (build/gt01.glb: every internal part,
the plunger, terminals, pins), with the cover and the moulded wedge replaced by the refined solids of render/refine_geo.py
(build/cover.npz, build/wedge.npz: real wall thickness, internal ribs, bevels, mould details). Sharp edges get 0.04-0.10 mm
bevels here (Bevel modifier, angle-limited, hardened normals).

    nice -n 10 python3 render/scene.py --shot hero --res 600 --spp 96 --out render/out/draft_hero.png
Shots: hero (two switches), inside (one switch close, the internals through the clear side wall).
Machine limits: one render thread (threads_mode FIXED, threads 1).
"""
import argparse, math, os, sys, time
import numpy as np
import bpy, bmesh
from mathutils import Matrix, Vector, Euler

HERE = os.path.dirname(os.path.abspath(__file__))
BUILD = os.path.join(HERE, 'build')

ap = argparse.ArgumentParser()
ap.add_argument('--shot', default='hero')
ap.add_argument('--res', type=int, default=600)
ap.add_argument('--spp', type=int, default=96)
ap.add_argument('--noise', type=float, default=0.02)
ap.add_argument('--out', default=os.path.join(HERE, 'out', 'draft.png'))
ap.add_argument('--threads', type=int, default=1)
ap.add_argument('--nodenoise', action='store_true')
ap.add_argument('--blend', default='')
ap.add_argument('--fstop', type=float, default=0)
ap.add_argument('--exposure', type=float, default=0.0)
ap.add_argument('--clay', action='store_true')
ap.add_argument('--look', default='AgX - Punchy')
ap.add_argument('--light', type=float, default=1.0)
ap.add_argument('--env', type=float, default=0.12)
ap.add_argument('--border', default='')        # x0,x1,y0,y1 (0-1) for crops while iterating
ap.add_argument('--pose', default='')          # JSON overrides of the shot's poses while iterating: {"A": [loc, rot], "B": .., "cam": {..}}
args = ap.parse_args(sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else sys.argv[1:])

D2R = math.pi / 180
TILT = 20 * D2R
L_SW = 12.8
LIFT = (L_SW / 2) * math.sin(TILT) - 0.52


# ============================================================================ scene
def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.unit_settings.system = 'METRIC'
    sc.unit_settings.scale_length = 1.0            # the glTF importer scales by this: keep 1 until the import is done
    return sc


def units_mm(sc):
    sc.unit_settings.scale_length = 0.001          # 1 unit = 1 mm (the DOF's f-number is then a real one)
    sc.unit_settings.length_unit = 'MILLIMETERS'


def three_to_blender(v):
    """three.js (x, y up, z toward the plunger end) -> Blender (x, -z, y): what the glTF importer does."""
    return np.stack([v[:, 0], -v[:, 2], v[:, 1]], axis=1)


def s_to_three(v):
    """The switch frame S (body: x, y up, z along) -> the part's world frame (three.js): tilt about x, then lift."""
    sT, cT = math.sin(TILT), math.cos(TILT)
    x, y, z = v[:, 0], v[:, 1], v[:, 2]
    return np.stack([x, y * cT - z * sT + LIFT, y * sT + z * cT], axis=1)


def mesh_from_npz(name, path, frame, mats):
    d = np.load(path)
    V, T, F = d['V'].astype(np.float64), d['T'], d['F']
    if frame == 'S':
        V = s_to_three(V)
    V = three_to_blender(V)
    me = bpy.data.meshes.new(name)
    me.from_pydata(V.tolist(), [], T.tolist())
    me.update()
    for m in mats:
        me.materials.append(m)
    me.polygons.foreach_set('material_index', F.astype(np.int32))
    ob = bpy.data.objects.new(name, me)
    return ob


def tidy(ob, dissolve=0.5):
    """Weld, merge coplanar triangles into n-gons (so the bevel runs clean), smooth faces, sharp edges over 30 deg."""
    bm = bmesh.new()
    bm.from_mesh(ob.data)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-5)
    if dissolve > 0:
        bmesh.ops.dissolve_limit(bm, angle_limit=dissolve * D2R, use_dissolve_boundaries=False, verts=bm.verts, edges=bm.edges,
                                 delimit={'MATERIAL'})
    for f in bm.faces:
        f.smooth = True
    for e in bm.edges:
        if e.is_manifold:
            e.smooth = e.calc_face_angle(0) < 30 * D2R
        else:
            e.smooth = False
    bm.to_mesh(ob.data)
    bm.free()
    ob.data.update()


def bevel(ob, width, segs=3, angle=30, harden=True):
    m = ob.modifiers.new('bevel', 'BEVEL')
    m.width = width
    m.segments = segs
    m.limit_method = 'ANGLE'
    m.angle_limit = angle * D2R
    m.use_clamp_overlap = True
    m.harden_normals = harden
    m.miter_outer = 'MITER_ARC'
    m.profile = 0.5
    return m


# ============================================================================ materials
def node_mat(name):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    for n in list(nt.nodes):
        nt.nodes.remove(n)
    out = nt.nodes.new('ShaderNodeOutputMaterial')
    return m, nt, out


def principled(nt, **kw):
    p = nt.nodes.new('ShaderNodeBsdfPrincipled')
    names = {'base': 'Base Color', 'metal': 'Metallic', 'rough': 'Roughness', 'ior': 'IOR', 'trans': 'Transmission Weight',
             'spec': 'Specular IOR Level', 'tint': 'Specular Tint', 'coat': 'Coat Weight', 'coat_rough': 'Coat Roughness',
             'aniso': 'Anisotropic', 'aniso_rot': 'Anisotropic Rotation', 'sheen': 'Sheen Weight', 'sheen_rough': 'Sheen Roughness'}
    for k, v in kw.items():
        sock = p.inputs[names[k]]
        if isinstance(v, (tuple, list)):
            sock.default_value = tuple(v) + ((1.0,) if len(v) == 3 else ())
        else:
            sock.default_value = v
    return p


def micro_bump(nt, p, scale=900.0, strength=0.06, distance=0.002):
    """A fine moulded-surface texture (EDM/blasted tool finish): noise into a bump on the BSDF's normal."""
    tc = nt.nodes.new('ShaderNodeTexCoord')
    nz = nt.nodes.new('ShaderNodeTexNoise')
    nz.inputs['Scale'].default_value = scale
    nz.inputs['Detail'].default_value = 2.0
    nt.links.new(tc.outputs['Object'], nz.inputs['Vector'])
    bp = nt.nodes.new('ShaderNodeBump')
    bp.inputs['Strength'].default_value = strength
    bp.inputs['Distance'].default_value = distance
    nt.links.new(nz.outputs['Fac'], bp.inputs['Height'])
    nt.links.new(bp.outputs['Normal'], p.inputs['Normal'])


def mat_basic(name, clay=False, bump=None, **kw):
    m, nt, out = node_mat(name)
    if clay:
        kw = {'base': (0.6, 0.6, 0.6), 'rough': 0.5}
    p = principled(nt, **kw)
    if bump and not clay:
        micro_bump(nt, p, **bump)
    nt.links.new(p.outputs[0], out.inputs['Surface'])
    return m


def mat_pc(name, rough=0.012, absorb=0.035, tint=(0.93, 0.965, 1.0), shadow=0.86, frost_bump=False):
    """Clear polycarbonate: n 1.585, a polished tool finish, a faint cool absorption through its thickness. Shadow rays see a
    near-clear filter (the cover's Fresnel losses), so the internals take direct light without needing caustic paths."""
    m, nt, out = node_mat(name)
    p = principled(nt, base=(1, 1, 1), rough=rough, ior=1.585, trans=1.0, spec=0.5)
    if frost_bump:
        micro_bump(nt, p, scale=1400.0, strength=0.25, distance=0.003)
    tr = nt.nodes.new('ShaderNodeBsdfTransparent')
    tr.inputs['Color'].default_value = (shadow, shadow, shadow * 1.01, 1)
    lp = nt.nodes.new('ShaderNodeLightPath')
    mx = nt.nodes.new('ShaderNodeMixShader')
    nt.links.new(lp.outputs['Is Shadow Ray'], mx.inputs[0])
    nt.links.new(p.outputs[0], mx.inputs[1])
    nt.links.new(tr.outputs[0], mx.inputs[2])
    nt.links.new(mx.outputs[0], out.inputs['Surface'])
    if absorb > 0:
        va = nt.nodes.new('ShaderNodeVolumeAbsorption')
        va.inputs['Color'].default_value = tint + (1,)
        va.inputs['Density'].default_value = absorb
        nt.links.new(va.outputs[0], out.inputs['Volume'])
    return m


def materials(clay=False):
    M = {}
    gold = (1.0, 0.75, 0.30)                         # plated gold, F0 a shade richer than (1.0, 0.77, 0.34): AgX lifts it toward cream
    M['gold'] = mat_basic('gold', clay, base=gold, metal=1.0, rough=0.12, tint=(1.0, 0.86, 0.56))
    M['goldHard'] = mat_basic('goldHard', clay, base=(1.0, 0.80, 0.40), metal=1.0, rough=0.1, tint=(1.0, 0.88, 0.6))
    M['tin'] = mat_basic('tin', clay, base=(0.87, 0.875, 0.88), metal=1.0, rough=0.17,
                         bump={'scale': 1600.0, 'strength': 0.04, 'distance': 0.002})
    M['lcp'] = mat_basic('lcpBlack', clay, base=(0.028, 0.028, 0.03), rough=0.3, spec=0.62,
                         bump={'scale': 1100.0, 'strength': 0.035, 'distance': 0.002})
    M['lcpPocket'] = mat_basic('lcpPocket', clay, base=(0.016, 0.016, 0.017), rough=0.5, spec=0.45,
                               bump={'scale': 1100.0, 'strength': 0.06, 'distance': 0.002})
    M['pom'] = mat_basic('pomBlack', clay, base=(0.022, 0.022, 0.023), rough=0.34, spec=0.55)
    if clay:
        M['pc'] = mat_basic('pcClay', True)
        M['pcFrost'] = M['pc']
    else:
        M['pc'] = mat_pc('clearPC')
        M['pcFrost'] = mat_pc('frostPC', rough=0.24, frost_bump=True)
    return M


# ============================================================================ the switch
# Round 3 (Brock: "some parts don't feel thick enough, a lot of parts are lacking a very tiny filet"): the deck's internals are
# web-weight (0.25-0.3 mm tabs, a 0.08 mm spring, 0.4 mm pins). Each imported part is welded, inflated along its normals to a
# real stock thickness, then given an angle-limited fillet scaled to the part, 3+ segments, hardened normals.
SHEET = {'comPost', 'comAnchor', 'comFulcrum', 'ncPost', 'ncArm', 'noTab', 'noRiser', 'noRun', 'noExit', 'run'}
SPRING = {'blade', 'tongue'}
CONTACT = {'contactNC', 'contactNO', 'movTop', 'movBot', 'anchorRivet'}
PINS = {'pinCOM', 'pinNO', 'pinNC'}
PLUNGER = {'plungerCap', 'plungerFlange', 'plungerNose'}
BASE = {'baseBody', 'comPedestal', 'ncPedestal', 'noPedestal', 'guideRail'}
D_TERM = 0.06          # terminal tabs: 0.25-0.3 -> about 0.4 mm (and 0.12 wider), the D2F class's brass stock
D_SPRING = 0.035       # the spring: 0.08 -> 0.15 mm, a believable edge
S_AXIS = Vector((0.0, -math.sin(TILT), math.cos(TILT)))     # the switch's own up axis, Blender frame


def inflate(ob, d):
    m = ob.modifiers.new('inflate', 'DISPLACE')
    m.direction = 'NORMAL'
    m.mid_level = 0.0
    m.strength = d
    return m


def refine_part(o, base):
    if base in PINS:
        o.data.transform(Matrix.Diagonal((1.25, 1.0, 1.0, 1.0)))       # 0.4 -> 0.5 mm sheet (pins sit on x = 0)
    if base == 'plungerFlange':
        o.data.transform(Matrix.Translation(-0.2 * S_AXIS))             # under the thicker (0.7) top
    tidy(o)
    if base in SHEET:
        inflate(o, D_TERM); bevel(o, 0.04, segs=3, angle=35)
    elif base in SPRING:
        inflate(o, D_SPRING); bevel(o, 0.03, segs=3, angle=35)
    elif base in CONTACT:
        inflate(o, 0.015); bevel(o, 0.03, segs=3, angle=35)
    elif base in PINS:
        bevel(o, 0.05, segs=3, angle=35)
    elif base in PLUNGER:
        bevel(o, 0.07, segs=3, angle=35)
    elif base in BASE:
        bevel(o, 0.06, segs=3, angle=35)
    else:
        bevel(o, 0.04, segs=3, angle=35)


def build_switch(M):
    """Import the deck's GT01, swap in the refined cover and wedge, assign the physical finishes, bevel. Returns the collection."""
    col = bpy.data.collections.new('GT01')
    bpy.context.scene.collection.children.link(col)
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=os.path.join(BUILD, 'gt01.glb'))
    imported = [o for o in bpy.data.objects if o not in before]
    for o in imported:
        for c in list(o.users_collection):
            c.objects.unlink(o)
        col.objects.link(o)
    drop = {'cover', 'coverEndB', 'coverEndF', 'wedgeSkinL', 'wedgeSkinR', 'wedgeCore'}
    for o in list(imported):
        base = o.name.split('.')[0]
        if base in drop:
            bpy.data.objects.remove(o, do_unlink=True)
            continue
        if o.type != 'MESH':
            continue
        mat = o.data.materials[0].name if o.data.materials else ''
        if base.startswith('pin'):
            new = M['tin']
        elif mat.startswith('goldSatin'):
            new = M['gold']
        elif mat.startswith('silverContact'):
            new = M['goldHard']                  # the contacts: gold (the brief's finish), a harder, brighter plate
        elif mat.startswith('pomBlack'):
            new = M['pom']
        elif mat.startswith('lcpBlack'):
            new = M['lcp']
        else:
            new = M['lcp']
        o.data.materials.clear()
        o.data.materials.append(new)
        refine_part(o, base)
    cover = mesh_from_npz('cover', os.path.join(BUILD, 'cover.npz'), 'S', [M['pc'], M['pcFrost']])
    col.objects.link(cover)
    tidy(cover)
    bevel(cover, 0.08, segs=4, angle=35)
    wedge = mesh_from_npz('wedge', os.path.join(BUILD, 'wedge.npz'), 'W', [M['lcp'], M['lcpPocket']])
    col.objects.link(wedge)
    tidy(wedge)
    bevel(wedge, 0.11, segs=4, angle=35)
    rv = mesh_from_npz('rivetBacks', os.path.join(BUILD, 'rivets.npz'), 'S', [M['goldHard']])
    col.objects.link(rv)
    tidy(rv)
    bevel(rv, 0.02, segs=3, angle=35)
    return col


# ============================================================================ studio
def world(sc, centre=(0.5, 0.56), c_in=0.15, c_out=0.028, env=0.2):
    """Camera and transmission rays see a dark grey radial gradient (window space, so it stays round on the frame); every other
    ray sees a near-black studio, so the reflections are the softboxes' alone."""
    w = bpy.data.worlds.new('studio')
    sc.world = w
    w.use_nodes = True
    nt = w.node_tree
    for n in list(nt.nodes):
        nt.nodes.remove(n)
    out = nt.nodes.new('ShaderNodeOutputWorld')
    tc = nt.nodes.new('ShaderNodeTexCoord')
    sep = nt.nodes.new('ShaderNodeSeparateXYZ')
    nt.links.new(tc.outputs['Window'], sep.inputs[0])
    dx = nt.nodes.new('ShaderNodeMath'); dx.operation = 'SUBTRACT'; dx.inputs[1].default_value = centre[0]
    dy = nt.nodes.new('ShaderNodeMath'); dy.operation = 'SUBTRACT'; dy.inputs[1].default_value = centre[1]
    nt.links.new(sep.outputs['X'], dx.inputs[0]); nt.links.new(sep.outputs['Y'], dy.inputs[0])
    ln = nt.nodes.new('ShaderNodeCombineXYZ')
    nt.links.new(dx.outputs[0], ln.inputs['X']); nt.links.new(dy.outputs[0], ln.inputs['Y'])
    vl = nt.nodes.new('ShaderNodeVectorMath'); vl.operation = 'LENGTH'
    nt.links.new(ln.outputs[0], vl.inputs[0])
    # falloff: smooth, wide (r in frame units; 0.75 reaches the corners)
    mr = nt.nodes.new('ShaderNodeMapRange')
    mr.inputs['From Min'].default_value = 0.0
    mr.inputs['From Max'].default_value = 0.85
    mr.interpolation_type = 'SMOOTHSTEP'
    nt.links.new(vl.outputs['Value'], mr.inputs['Value'])
    ramp = nt.nodes.new('ShaderNodeValToRGB')
    cr = ramp.color_ramp
    cr.interpolation = 'EASE'
    cr.elements[0].position = 0.0; cr.elements[0].color = (c_in, c_in, c_in, 1)
    cr.elements[1].position = 1.0; cr.elements[1].color = (c_out, c_out, c_out, 1)
    nt.links.new(mr.outputs['Result'], ramp.inputs['Fac'])
    bg_grad = nt.nodes.new('ShaderNodeBackground')
    nt.links.new(ramp.outputs['Color'], bg_grad.inputs['Color'])
    # the studio seen in reflections: a soft vertical gradient (a lit ceiling, a dim floor), a little light from everywhere
    tc2 = nt.nodes.new('ShaderNodeTexCoord')
    sep2 = nt.nodes.new('ShaderNodeSeparateXYZ')
    nt.links.new(tc2.outputs['Generated'], sep2.inputs[0])
    er = nt.nodes.new('ShaderNodeValToRGB')
    e = er.color_ramp
    e.interpolation = 'EASE'
    e.elements[0].position = 0.0; e.elements[0].color = (env * 0.15, env * 0.15, env * 0.16, 1)
    e.elements[1].position = 1.0; e.elements[1].color = (env * 1.6, env * 1.6, env * 1.65, 1)
    mid = e.elements.new(0.5); mid.color = (env * 0.55, env * 0.55, env * 0.57, 1)
    zr = nt.nodes.new('ShaderNodeMapRange')
    zr.inputs['From Min'].default_value = -1.0; zr.inputs['From Max'].default_value = 1.0
    nt.links.new(sep2.outputs['Z'], zr.inputs['Value'])
    nt.links.new(zr.outputs['Result'], er.inputs['Fac'])
    bg_env = nt.nodes.new('ShaderNodeBackground')
    nt.links.new(er.outputs['Color'], bg_env.inputs['Color'])
    lp = nt.nodes.new('ShaderNodeLightPath')
    mx = nt.nodes.new('ShaderNodeMath'); mx.operation = 'MAXIMUM'
    nt.links.new(lp.outputs['Is Camera Ray'], mx.inputs[0])
    nt.links.new(lp.outputs['Is Transmission Ray'], mx.inputs[1])
    # a transmission ray that has also reflected (glossy depth > 0) is an internal reflection: give it the studio, not the backdrop
    gd = nt.nodes.new('ShaderNodeMath'); gd.operation = 'LESS_THAN'; gd.inputs[1].default_value = 0.5
    nt.links.new(lp.outputs['Glossy Depth'], gd.inputs[0])
    mul = nt.nodes.new('ShaderNodeMath'); mul.operation = 'MULTIPLY'
    nt.links.new(mx.outputs[0], mul.inputs[0]); nt.links.new(gd.outputs[0], mul.inputs[1])
    mix = nt.nodes.new('ShaderNodeMixShader')
    nt.links.new(mul.outputs[0], mix.inputs[0])
    nt.links.new(bg_env.outputs[0], mix.inputs[1])
    nt.links.new(bg_grad.outputs[0], mix.inputs[2])
    nt.links.new(mix.outputs[0], out.inputs['Surface'])
    return w


def softbox(name, centre, target, size, strength, falloff=0.45, color=(1, 1, 1), camera=False, reflect_only=False):
    # reflect_only: False, True/'outer' (seen only by paths that have not passed through the clear plastic), 'inner' (only by those that have)
    """An emissive card aimed at the target: radiance `strength` at its centre, easing to (1 - falloff) at its rim, so its
    reflections have the soft-edged gradient of a real diffused softbox."""
    bpy.ops.mesh.primitive_plane_add(size=1.0)
    ob = bpy.context.active_object
    ob.name = name
    ob.scale = (size[0], size[1], 1)
    c, t = Vector(centre), Vector(target)
    d = (t - c).normalized()
    ob.location = c
    ob.rotation_euler = d.to_track_quat('Z', 'Y').to_euler()    # the plane's +Z normal (its emitting face) toward the target
    m, nt, out = node_mat('emit_' + name)
    tc = nt.nodes.new('ShaderNodeTexCoord')
    sep = nt.nodes.new('ShaderNodeSeparateXYZ')
    nt.links.new(tc.outputs['Generated'], sep.inputs[0])
    # rim falloff from the generated coords (0..1 over the card): 1 at the centre, 1 - falloff at the edge, smooth
    dx = nt.nodes.new('ShaderNodeMath'); dx.operation = 'SUBTRACT'; dx.inputs[1].default_value = 0.5
    dy = nt.nodes.new('ShaderNodeMath'); dy.operation = 'SUBTRACT'; dy.inputs[1].default_value = 0.5
    nt.links.new(sep.outputs['X'], dx.inputs[0]); nt.links.new(sep.outputs['Y'], dy.inputs[0])
    ax = nt.nodes.new('ShaderNodeMath'); ax.operation = 'ABSOLUTE'
    ay = nt.nodes.new('ShaderNodeMath'); ay.operation = 'ABSOLUTE'
    nt.links.new(dx.outputs[0], ax.inputs[0]); nt.links.new(dy.outputs[0], ay.inputs[0])
    mxx = nt.nodes.new('ShaderNodeMath'); mxx.operation = 'MAXIMUM'
    nt.links.new(ax.outputs[0], mxx.inputs[0]); nt.links.new(ay.outputs[0], mxx.inputs[1])
    mr = nt.nodes.new('ShaderNodeMapRange')
    mr.inputs['From Min'].default_value = 0.25; mr.inputs['From Max'].default_value = 0.5
    mr.inputs['To Min'].default_value = strength; mr.inputs['To Max'].default_value = strength * (1 - falloff)
    mr.interpolation_type = 'SMOOTHSTEP'
    nt.links.new(mxx.outputs[0], mr.inputs['Value'])
    em = nt.nodes.new('ShaderNodeEmission')
    em.inputs['Color'].default_value = tuple(color) + (1,)
    if reflect_only:
        # a reflector card for the covers' outer faces only: dark to any path that has passed through the clear plastic, so the
        # gold spring under a top (parallel to it) keeps mirroring the studio, not this hot card (a standard art-direction cheat)
        lp = nt.nodes.new('ShaderNodeLightPath')
        lt = nt.nodes.new('ShaderNodeMath'); lt.operation = 'GREATER_THAN' if reflect_only == 'inner' else 'LESS_THAN'
        lt.inputs[1].default_value = 0.5
        nt.links.new(lp.outputs['Transmission Depth'], lt.inputs[0])
        mu = nt.nodes.new('ShaderNodeMath'); mu.operation = 'MULTIPLY'
        nt.links.new(mr.outputs['Result'], mu.inputs[0]); nt.links.new(lt.outputs[0], mu.inputs[1])
        nt.links.new(mu.outputs[0], em.inputs['Strength'])
    else:
        nt.links.new(mr.outputs['Result'], em.inputs['Strength'])
    # emit from the front face only
    geo = nt.nodes.new('ShaderNodeNewGeometry')
    tr = nt.nodes.new('ShaderNodeBsdfTransparent')
    mix = nt.nodes.new('ShaderNodeMixShader')
    nt.links.new(geo.outputs['Backfacing'], mix.inputs[0])
    nt.links.new(em.outputs[0], mix.inputs[1])
    nt.links.new(tr.outputs[0], mix.inputs[2])
    nt.links.new(mix.outputs[0], out.inputs['Surface'])
    ob.data.materials.append(m)
    ob.visible_camera = camera
    ob.visible_shadow = False
    return ob


def place_instance(col, name, loc, rot_deg, pivot):
    e = bpy.data.objects.new(name, None)
    e.instance_type = 'COLLECTION'
    e.instance_collection = col
    bpy.context.scene.collection.objects.link(e)
    R = Euler([a * D2R for a in rot_deg], 'XYZ').to_matrix().to_4x4()
    e.matrix_world = Matrix.Translation(Vector(loc)) @ R @ Matrix.Translation(-Vector(pivot))
    return e


def camera(sc, target, direction, dist, lens=100.0, fstop=8.0, focus=None, shift=(0, 0), roll=0.0):
    cd = bpy.data.cameras.new('cam')
    cd.lens = lens
    cd.sensor_fit = 'HORIZONTAL'
    cd.sensor_width = 36.0
    cd.clip_start = 1.0
    cd.clip_end = 5000.0
    cd.shift_x, cd.shift_y = shift
    cam = bpy.data.objects.new('cam', cd)
    sc.collection.objects.link(cam)
    d = Vector(direction).normalized()
    cam.location = Vector(target) + d * dist
    q = (-d).to_track_quat('-Z', 'Y')            # look along -d, image up toward world +Z
    cam.rotation_euler = q.to_euler()
    if roll:
        cam.rotation_euler.rotate_axis('Z', roll * D2R)
    sc.camera = cam
    if fstop > 0:
        cd.dof.use_dof = True
        cd.dof.focus_distance = (Vector(focus) - cam.location).length if focus is not None else dist
        cd.dof.aperture_fstop = fstop
        cd.dof.aperture_blades = 0
    return cam


def render_settings(sc, res, spp, noise, threads, denoise=True, exposure=0.0, look='AgX - Medium High Contrast'):
    sc.render.engine = 'CYCLES'
    cy = sc.cycles
    cy.device = 'CPU'
    sc.render.threads_mode = 'FIXED'
    sc.render.threads = threads
    cy.samples = spp
    cy.use_adaptive_sampling = True
    cy.adaptive_threshold = noise
    cy.adaptive_min_samples = min(32, spp)
    cy.use_denoising = denoise
    cy.denoiser = 'OPENIMAGEDENOISE'
    cy.denoising_input_passes = 'RGB_ALBEDO_NORMAL'
    cy.denoising_prefilter = 'ACCURATE'
    try:
        cy.denoising_quality = 'HIGH'
    except Exception:
        pass
    cy.max_bounces = 32
    cy.diffuse_bounces = 3
    cy.glossy_bounces = 10
    cy.transmission_bounces = 32
    cy.transparent_max_bounces = 32
    cy.volume_bounces = 0
    cy.caustics_reflective = False
    cy.caustics_refractive = False
    cy.blur_glossy = 0.0
    cy.sample_clamp_direct = 0.0
    cy.sample_clamp_indirect = 8.0
    cy.filter_width = 1.15
    cy.use_light_tree = True
    cy.use_auto_tile = True
    cy.tile_size = 512
    sc.render.resolution_x = res
    sc.render.resolution_y = res
    sc.render.resolution_percentage = 100
    sc.render.film_transparent = False
    sc.render.use_persistent_data = False
    sc.view_settings.view_transform = 'AgX'
    try:
        sc.view_settings.look = look
    except Exception as e:
        print('look not set:', e)
    sc.view_settings.exposure = exposure
    sc.view_settings.gamma = 1.0
    sc.render.dither_intensity = 1.0
    sc.render.image_settings.file_format = 'PNG'
    sc.render.image_settings.color_mode = 'RGB'
    sc.render.image_settings.color_depth = '8'
    sc.render.image_settings.compression = 60


# ============================================================================ shots
# Blender frame of a switch (before placement): +Z up from the board, the plunger end toward -Y, x across. Its middle:
PIVOT = (0.0, -1.1, 3.2)


def pose(name, default):
    import json
    P = json.loads(args.pose) if args.pose else {}
    v = P.get(name, default)
    if isinstance(default, dict):
        d = dict(default); d.update(v); return d
    return v


def top_normal(rot_deg):
    """The cover top's normal (Blender frame) for a switch placed with this rotation: the body is tilted 20 deg in its wedge."""
    n = Vector((0.0, -math.sin(TILT), math.cos(TILT)))
    return (Euler([a * D2R for a in rot_deg], 'XYZ').to_matrix() @ n).normalized()


def mirror(v, n):
    """Where a light must sit (direction from the part) to show in a face of normal n, seen from direction v."""
    v, n = Vector(v).normalized(), Vector(n).normalized()
    return (2 * n.dot(v) * n - v).normalized()


def nudge(d, toward, deg):
    """d turned by deg toward the direction `toward` (so a softbox's edge, not its middle, lies on the mirror direction)."""
    d, t = Vector(d).normalized(), Vector(toward).normalized()
    ax = d.cross(t)
    if ax.length < 1e-6:
        return d
    from mathutils import Quaternion
    return (Quaternion(ax.normalized(), deg * D2R) @ d).normalized()


def shot_hero(sc, col):
    # a pair, close and overlapping, both three-quarter: the front one turned plunger-end left, the one behind turned the
    # other way and tipped back toward the camera, up and to the left
    A = pose('A', [(2.5, 0.0, 0.0), (-8, 0, -42)])
    B = pose('B', [(-4.6, 7.2, 3.6), (24, 0, 38)])
    C = pose('cam', {'t': (-1.0, 3.6, 2.6), 'd': (0.25, -1.0, 0.75), 'dist': 80.0, 'focus': (2.4, -1.6, 2.6), 'fstop': 0.08, 'roll': 0})
    place_instance(col, 'swA', *A, PIVOT)
    place_instance(col, 'swB', *B, PIVOT)
    tgt = Vector(C['t'])
    cam = camera(sc, tgt, C['d'], C['dist'], lens=100.0, fstop=args.fstop or C['fstop'], focus=C['focus'], roll=C['roll'])
    v = Vector(C['d']).normalized()
    lights_hero(tgt, mirror(v, top_normal(A[1])), mirror(v, top_normal(B[1])))
    return cam


def shot_inside(sc, col):
    # one switch, close, from the side and above: the gold spring and its tongue through the clear side wall and the top
    A = pose('A', [(0.0, 0.0, 0.0), (0, 0, -25)])
    B = pose('B', None)                     # alone: nothing competes with the internals
    C = pose('cam', {'t': (0.0, 0.0, 2.9), 'd': (0.8, -0.5, 0.55), 'dist': 52.0, 'focus': (2.6, -1.2, 3.2), 'fstop': 0.15, 'roll': 0})
    place_instance(col, 'swA', *A, PIVOT)
    if B:
        place_instance(col, 'swB', *B, PIVOT)
    tgt = Vector(C['t'])
    cam = camera(sc, tgt, C['d'], C['dist'], lens=100.0, fstop=args.fstop or C['fstop'], focus=C['focus'], roll=C['roll'])
    lights_inside(tgt)
    return cam


def rig(t, lights):
    """Softboxes placed by direction from the target: (name, direction, distance, (w, h), radiance, falloff)."""
    G = pose('gain', {})
    for name, d, dist, size, strength, fall, *opt in lights:
        d = Vector(d).normalized()
        softbox(name, tuple(t + d * dist), tuple(t), size, strength * args.light * G.get(name, 1.0), falloff=fall,
                reflect_only=(opt[0] if opt else False))


def lights_hero(t, rA, rB):
    """rA, rB: where the two covers' tops mirror (from the camera). Each top gets a hot card whose edge lies on that direction (a
    broad highlight over part of the top), seen only by paths that have not entered the plastic; under each top a dimmer card on
    the mirror direction itself, seen only by paths that have, so the gold spring under it (parallel to the top) mirrors it."""
    L = pose('lights', {})
    up = Vector((0, 0, 1))
    rig(t, [
        ('key', L.get('key', (-0.5, -0.32, 0.8)), 120, (200, 150), 4.0, 0.4),
        ('topA', L.get('topA', tuple(nudge(rA, up, 12))), 120, (70, 26), 38.0, 0.8, 'outer'),
        ('topB', L.get('topB', tuple(nudge(rB, up, 15))), 120, (70, 26), 30.0, 0.8, 'outer'),
        ('goldA', L.get('goldA', tuple(rA)), 110, (110, 80), 1.1, 0.6, 'inner'),
        ('goldB', L.get('goldB', tuple(rB)), 110, (110, 80), 1.0, 0.6, 'inner'),
        # the dark parts at the bottom: a broad bounce card below and in front, and a hot strip low behind for the bottom edges
        ('under', L.get('under', (0.15, -0.55, -0.82)), 110, (160, 110), 1.2, 0.5),
        ('rimBot', L.get('rimBot', (-0.1, 0.8, -0.6)), 110, (150, 8), 44.0, 0.1),
        ('rimR', L.get('rimR', (0.85, 0.5, 0.3)), 110, (10, 150), 62.0, 0.1),
        ('rimL', L.get('rimL', (-0.75, 0.62, 0.3)), 110, (10, 150), 52.0, 0.1),
        ('sideR', L.get('sideR', (0.95, -0.25, 0.2)), 115, (10, 150), 32.0, 0.1),
        ('sideL', L.get('sideL', (-0.92, -0.2, 0.3)), 115, (10, 150), 28.0, 0.1),
        ('strip', L.get('strip', (0.08, 0.45, 0.9)), 125, (130, 9), 38.0, 0.1),
        ('back', L.get('back', (0.15, 0.97, 0.15)), 120, (120, 12), 20.0, 0.15),
        ('kick', L.get('kick', (-0.45, -0.7, -0.55)), 120, (10, 100), 18.0, 0.1),
    ])


def lights_inside(t):
    L = pose('lights', {})
    rig(t, [
        ('key', L.get('key', (0.15, -0.55, 0.82)), 120, (180, 140), 3.6, 0.4),
        # gold box: beyond the switch, high on the far side; only paths through the plastic see it: the spring mirrors it, the
        # cover's outer faces do not
        ('goldbox', L.get('goldbox', (-0.85, 0.3, 0.45)), 120, (80, 70), 5.0, 0.5, 'inner'),
        ('rimL', L.get('rimL', (-0.6, 0.78, 0.2)), 110, (10, 150), 52.0, 0.1),
        ('rimR', L.get('rimR', (-0.2, -0.95, 0.25)), 110, (10, 150), 28.0, 0.1),
        ('sideF', L.get('sideF', (0.55, -0.8, 0.1)), 115, (10, 150), 22.0, 0.1),
        ('strip', L.get('strip', (-0.3, 0.25, 0.92)), 125, (130, 9), 36.0, 0.1),
        ('back', L.get('back', (-0.95, -0.1, 0.25)), 120, (12, 120), 20.0, 0.15),
        ('fill', L.get('fill', (0.9, 0.1, 0.3)), 150, (120, 140), 0.9, 0.3),
        ('under', L.get('under', (0.6, -0.35, -0.72)), 110, (160, 110), 1.2, 0.5),
        ('rimBot', L.get('rimBot', (-0.75, 0.35, -0.55)), 110, (150, 8), 44.0, 0.1),
        ('kick', L.get('kick', (0.35, -0.8, -0.45)), 120, (10, 100), 16.0, 0.1),
    ])


def shot_macro(sc, col):
    """A close crop on the front switch of the hero: the collar, the cover's top edge and corner, the wedge's cut-outs, to check
    that every edge carries its fillet. Same placement and lights as the hero, the camera 22 mm away."""
    A = pose('A', [(2.5, 0.0, 0.0), (-8, 0, -42)])
    B = pose('B', [(-4.6, 7.2, 3.6), (24, 0, 38)])
    a = place_instance(col, 'swA', *A, PIVOT)
    place_instance(col, 'swB', *B, PIVOT)
    sp = np.array([pose('macroS', [2.2, 4.4, 3.4])], dtype=np.float64)        # a point on the switch (frame S): the side, near the top
    loc = three_to_blender(s_to_three(sp))[0]
    bpy.context.view_layer.update()
    tgt = a.matrix_world @ Vector(loc)
    d = Vector((0.25, -1.0, 0.75)).normalized()
    cam = camera(sc, tgt, d, pose('macroDist', 22.0), lens=100.0, fstop=args.fstop or 0.5, focus=tuple(tgt))
    hero_t = Vector((-1.0, 3.6, 2.6))
    lights_hero(hero_t, mirror(d, top_normal(A[1])), mirror(d, top_normal(B[1])))
    return cam


# ============================================================================ main
def main():
    t0 = time.time()
    sc = reset()
    M = materials(args.clay)
    col = build_switch(M)
    units_mm(sc)
    world(sc, env=args.env)
    shot = {'hero': shot_hero, 'inside': shot_inside, 'macro': shot_macro}[args.shot]
    shot(sc, col)
    # the source collection renders only through its instances
    lc = bpy.context.view_layer.layer_collection.children[col.name]
    lc.exclude = True
    render_settings(sc, args.res, args.spp, args.noise, args.threads, denoise=not args.nodenoise, exposure=args.exposure, look=args.look)
    if args.border:
        x0, x1, y0, y1 = (float(v) for v in args.border.split(','))
        sc.render.use_border = True
        sc.render.use_crop_to_border = True
        sc.render.border_min_x, sc.render.border_max_x, sc.render.border_min_y, sc.render.border_max_y = x0, x1, y0, y1
    if args.blend:
        bpy.ops.wm.save_as_mainfile(filepath=os.path.abspath(args.blend))
    os.makedirs(os.path.dirname(os.path.abspath(args.out)), exist_ok=True)
    sc.render.filepath = os.path.abspath(args.out)
    t1 = time.time()
    print(f'scene built in {t1 - t0:.1f} s; rendering {args.shot} {args.res}px, <= {args.spp} spp, threshold {args.noise}', flush=True)
    bpy.ops.render.render(write_still=True)
    t2 = time.time()
    print(f'RENDER {args.shot} {args.res}px done in {t2 - t1:.1f} s -> {args.out}', flush=True)


main()
