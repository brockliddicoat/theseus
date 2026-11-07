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
ap.add_argument('--env', type=float, default=0.2)
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
    gold = (1.0, 0.72, 0.29)          # plated gold, a touch richer than the F0 table value (AgX lifts its highlights to cream)
    M['gold'] = mat_basic('gold', clay, base=gold, metal=1.0, rough=0.22)
    M['goldHard'] = mat_basic('goldHard', clay, base=(1.0, 0.79, 0.38), metal=1.0, rough=0.13)
    M['tin'] = mat_basic('tin', clay, base=(0.80, 0.805, 0.81), metal=1.0, rough=0.21,
                         bump={'scale': 1600.0, 'strength': 0.05, 'distance': 0.002})
    M['lcp'] = mat_basic('lcpBlack', clay, base=(0.026, 0.026, 0.028), rough=0.42, spec=0.5,
                         bump={'scale': 1100.0, 'strength': 0.08, 'distance': 0.002})
    M['lcpPocket'] = mat_basic('lcpPocket', clay, base=(0.014, 0.014, 0.015), rough=0.62, spec=0.35,
                               bump={'scale': 1100.0, 'strength': 0.1, 'distance': 0.002})
    M['pom'] = mat_basic('pomBlack', clay, base=(0.02, 0.02, 0.021), rough=0.3, spec=0.55)
    if clay:
        M['pc'] = mat_basic('pcClay', True)
        M['pcFrost'] = M['pc']
    else:
        M['pc'] = mat_pc('clearPC')
        M['pcFrost'] = mat_pc('frostPC', rough=0.24, frost_bump=True)
    return M


# ============================================================================ the switch
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
        # the imported parts carry three.js's crease-split normals and their own small bevels: shade them as given
        for p in o.data.polygons:
            p.use_smooth = True
    cover = mesh_from_npz('cover', os.path.join(BUILD, 'cover.npz'), 'S', [M['pc'], M['pcFrost']])
    col.objects.link(cover)
    tidy(cover)
    bevel(cover, 0.06, segs=3, angle=35)
    wedge = mesh_from_npz('wedge', os.path.join(BUILD, 'wedge.npz'), 'W', [M['lcp'], M['lcpPocket']])
    col.objects.link(wedge)
    tidy(wedge)
    bevel(wedge, 0.09, segs=3, angle=35)
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


def softbox(name, centre, target, size, strength, falloff=0.45, color=(1, 1, 1), camera=False):
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


def shot_hero(sc, col):
    # front switch: three-quarter from above, the plunger end toward the lower left, the clear side and the top to camera;
    # back switch: up and to the left, turned the other way and tipped toward the camera, a little out of focus
    A = pose('A', [(2.0, 0.0, 0.0), (-6, 0, -50)])
    B = pose('B', [(-9.5, 8.8, 5.4), (50, 0, 35)])
    C = pose('cam', {'t': (-3.6, 4.4, 2.7), 'd': (0.25, -1.0, 0.75), 'dist': 84.0, 'focus': (2.6, -2.4, 1.8), 'fstop': 0.07, 'roll': 0})
    place_instance(col, 'swA', *A, PIVOT)
    place_instance(col, 'swB', *B, PIVOT)
    tgt = Vector(C['t'])
    cam = camera(sc, tgt, C['d'], C['dist'], lens=100.0, fstop=args.fstop or C['fstop'], focus=C['focus'], roll=C['roll'])
    lights_hero(tgt)
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
    for name, d, dist, size, strength, fall in lights:
        d = Vector(d).normalized()
        softbox(name, tuple(t + d * dist), tuple(t), size, strength * args.light, falloff=fall)


def lights_hero(t):
    L = pose('lights', {})
    rig(t, [
        # key: a very large, moderate softbox front-left and high (dim enough that the gold mirrors it as gold, not white)
        ('key', L.get('key', (-0.5, -0.32, 0.8)), 120, (200, 150), 3.2, 0.4),
        # top: a big softbox high behind and left, where the front cover's top mirrors it: a bright gradient over the back of
        # that top, fading out toward the plunger so the internals stay in view
        ('top', L.get('top', (-0.62, 0.62, 0.48)), 130, (110, 70), 7.0, 0.85),
        # topB: the back switch's top mirrors the front right, high: the same gradient on it
        ('topB', L.get('topB', (0.72, -0.35, 0.6)), 140, (90, 70), 5.0, 0.85),
        # floor card: low, front right, the side walls' soft sheen
        ('floor', L.get('floor', (0.62, -0.3, -0.72)), 120, (140, 90), 1.6, 0.6),
        # rims: tall strips behind each side: a bright line on every edge facing away
        ('rimR', L.get('rimR', (0.85, 0.5, 0.3)), 110, (12, 140), 20.0, 0.15),
        ('rimL', L.get('rimL', (-0.75, 0.62, 0.3)), 110, (12, 140), 16.0, 0.15),
        # back: a low wide strip behind, shining through the clear covers onto the internals from behind
        ('back', L.get('back', (0.15, 0.97, 0.15)), 120, (110, 18), 8.0, 0.2),
        # top strip: a crisp line along the top edges
        ('strip', L.get('strip', (0.08, 0.45, 0.9)), 125, (120, 10), 9.0, 0.2),
        # kicker: low front-left strip for the lower edges and the pins
        ('kick', L.get('kick', (-0.45, -0.7, -0.55)), 120, (12, 90), 5.0, 0.15),
    ])


def lights_inside(t):
    L = pose('lights', {})
    rig(t, [
        # key: large, front and high: the top, the plunger, the front face
        ('key', L.get('key', (0.15, -0.55, 0.82)), 120, (180, 140), 3.0, 0.4),
        # gold box: beyond the switch, high on the far side: the spring's top face mirrors it (seen through the near wall)
        ('goldbox', L.get('goldbox', (-0.85, 0.3, 0.45)), 120, (70, 60), 4.5, 0.5),
        # rims behind both ends and the top: the cover's far edges
        ('rimL', L.get('rimL', (-0.6, 0.78, 0.2)), 110, (12, 140), 18.0, 0.15),
        ('rimR', L.get('rimR', (-0.2, -0.95, 0.25)), 110, (12, 140), 10.0, 0.15),
        ('strip', L.get('strip', (-0.3, 0.25, 0.92)), 125, (120, 10), 8.0, 0.2),
        # fill: broad, dim, from the camera's side
        ('fill', L.get('fill', (0.9, 0.1, 0.3)), 150, (120, 140), 0.7, 0.3),
        # kicker: low front strip for the wedge's lower edges and the pins
        ('kick', L.get('kick', (0.35, -0.8, -0.45)), 120, (12, 90), 5.0, 0.15),
    ])


# ============================================================================ main
def main():
    t0 = time.time()
    sc = reset()
    M = materials(args.clay)
    col = build_switch(M)
    units_mm(sc)
    world(sc, env=args.env)
    shot = {'hero': shot_hero, 'inside': shot_inside}[args.shot]
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
