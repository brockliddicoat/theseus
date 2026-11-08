"""Render the realistic hand (hand3d.py) in Cycles: grey clay, soft studio light, transparent background, true-scale
orthographic side view from the thumb's side, mirrored so the nose is on the right (the slides' frame: z right, y up).

Each pose writes two layers, split by a material mask (one sample, no filtering): near (the index finger and the thumb,
which lie in front of the mouse in side view) and far (the palm and the other fingers, which the slide clips by the Sora's
profile, so they pass behind it). Run: nice python3 render_hand.py <job> [...]; jobs: rest:<k>, heel, lifted.
Output: out/hand/<name>_near.webp, _far.webp and a JSON of the frame (ppm, window) and the joints (hand frame)."""
import sys, os, json, time
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import hand3d as M
import bpy, bmesh
from PIL import Image

OUT = os.path.join(HERE, 'out', 'hand'); os.makedirs(OUT, exist_ok=True)
WIN = dict(z0=-172.0, z1=106.0, y0=-88.0, y1=26.0)          # the render window in the hand frame (mm)
args = [a for a in sys.argv[1:] if not a.startswith('--')]
opt = dict(a[2:].split('=', 1) for a in sys.argv[1:] if a.startswith('--') and '=' in a)
PPM = float(opt.get('ppm', 6.0)); SPP = int(opt.get('spp', 28)); H_ = float(opt.get('h', 0.55))

D = json.load(open(os.path.join(HERE, 'out', 'gd-deck.json'))); GR = D['hand']['grips']
GR['wall_x'] = D['la']['trials'][D['la']['recommended']]['end']['thumb']['u_bottom']

def scene_setup():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene; sc.render.engine = 'CYCLES'
    cy = sc.cycles; cy.device = 'CPU'; cy.samples = SPP; cy.use_adaptive_sampling = True; cy.adaptive_threshold = 0.015
    cy.use_denoising = True
    try: cy.denoiser = 'OPENIMAGEDENOISE'
    except Exception: pass
    cy.max_bounces = 6; cy.diffuse_bounces = 3; cy.glossy_bounces = 2; cy.transmission_bounces = 2
    sc.render.threads_mode = 'FIXED'; sc.render.threads = 1
    sc.render.film_transparent = True
    sc.render.resolution_x = int(round((WIN['z1'] - WIN['z0']) * PPM)); sc.render.resolution_y = int(round((WIN['y1'] - WIN['y0']) * PPM))
    sc.render.resolution_percentage = 100
    sc.render.image_settings.file_format = 'PNG'; sc.render.image_settings.color_mode = 'RGBA'; sc.render.image_settings.color_depth = '8'
    try: sc.view_settings.view_transform = 'AgX'; sc.view_settings.look = 'None'
    except Exception: sc.view_settings.view_transform = 'Filmic'
    sc.view_settings.exposure = 0.0
    w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True
    bg = w.node_tree.nodes['Background']; bg.inputs['Color'].default_value = (0.5, 0.5, 0.5, 1); bg.inputs['Strength'].default_value = 0.022
    # camera: orthographic, from the thumb's side (Blender -Y), looking +Y, up +Z; Blender (X, Y, Z) = (z, -x, y) / 1000
    cam = bpy.data.cameras.new('cam'); cam.type = 'ORTHO'; cam.ortho_scale = (WIN['z1'] - WIN['z0']) / 1000.0; cam.clip_start = 0.01; cam.clip_end = 10
    co = bpy.data.objects.new('cam', cam); sc.collection.objects.link(co); sc.camera = co
    co.location = ((WIN['z0'] + WIN['z1']) / 2000.0, -1.5, (WIN['y0'] + WIN['y1']) / 2000.0); co.rotation_euler = (np.pi / 2, 0, 0)
    def area(name, loc, size, power, target=(0.0, 0.0, -0.025)):
        L = bpy.data.lights.new(name, 'AREA'); L.size = size; L.energy = power; L.shape = 'DISK'
        o = bpy.data.objects.new(name, L); sc.collection.objects.link(o); o.location = loc
        d = np.array(target) - np.array(loc); d = d / np.linalg.norm(d)
        import mathutils; o.rotation_euler = mathutils.Vector(d.tolist()).to_track_quat('-Z', 'Y').to_euler()
        return o
    area('key', (-0.22, -0.55, 0.62), 0.7, 12.0)                 # soft key, upper left, toward the camera
    area('fill', (0.65, -0.45, -0.10), 0.9, 3.2)                # broad fill from the right, low
    area('rim', (0.10, 0.55, 0.40), 0.5, 11.0)                   # rim from behind, to hold the silhouette on dark
    area('under', (-0.05, -0.30, -0.55), 0.8, 1.3)              # a little lift into the palm and the pads
    return sc

def clay():
    m = bpy.data.materials.new('clay'); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    def S(k, v):
        try: b.inputs[k].default_value = v
        except Exception: pass
    S('Base Color', (0.26, 0.26, 0.26, 1)); S('Roughness', 0.50); S('Specular IOR Level', 0.42)
    S('Subsurface Weight', 0.14); S('Subsurface Radius', (1.0, 1.0, 1.0)); S('Subsurface Scale', 0.0025)
    S('Sheen Weight', 0.18); S('Sheen Roughness', 0.45); S('Coat Weight', 0.0)
    return m
def flat(v):
    m = bpy.data.materials.new('flat%d' % v); m.use_nodes = True; nt = m.node_tree; nt.nodes.clear()
    e = nt.nodes.new('ShaderNodeEmission'); e.inputs['Color'].default_value = (v, v, v, 1); e.inputs['Strength'].default_value = 1.0
    o = nt.nodes.new('ShaderNodeOutputMaterial'); nt.links.new(e.outputs[0], o.inputs[0]); return m

def build(V, F, near):
    Vb = np.c_[V[:, 2], -V[:, 0], V[:, 1]] / 1000.0
    me = bpy.data.meshes.new('hand'); me.from_pydata(Vb.tolist(), [], F.tolist()); me.update()
    bm = bmesh.new(); bm.from_mesh(me); bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:]); bm.to_mesh(me); bm.free()
    me.polygons.foreach_set('use_smooth', np.ones(len(me.polygons), bool)); me.update()
    ob = bpy.data.objects.new('hand', me); bpy.context.scene.collection.objects.link(ob)
    return ob, me

def render(name, V, F, lab):
    sc = scene_setup(); near = np.isin(lab, ['index', 'thumb'])
    fn = near[F].sum(1) >= 2
    ob, me = build(V, F, fn)
    C = clay(); me.materials.append(C); me.materials.append(C)
    me.polygons.foreach_set('material_index', fn.astype(np.int32)); me.update()
    t = time.time(); p_full = os.path.join(OUT, name + '_full.png'); sc.render.filepath = p_full; bpy.ops.render.render(write_still=True)
    print('render', name, round(time.time() - t, 1), 's', flush=True)
    # the mask: near white, far black, one sample, no filter
    me.materials.clear(); me.materials.append(flat(0.0)); me.materials.append(flat(1.0)); me.polygons.foreach_set('material_index', fn.astype(np.int32)); me.update()
    for o in sc.objects:
        if o.type == 'LIGHT': o.hide_render = True
    sc.world.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.0
    sc.cycles.samples = 1; sc.cycles.use_adaptive_sampling = False; sc.cycles.use_denoising = False; sc.cycles.filter_width = 0.01
    sc.view_settings.view_transform = 'Standard'
    p_mask = os.path.join(OUT, name + '_mask.png'); sc.render.filepath = p_mask; bpy.ops.render.render(write_still=True)
    full = np.asarray(Image.open(p_full).convert('RGBA')).copy(); mk = np.asarray(Image.open(p_mask).convert('RGBA'))[..., 0] > 127
    nearA = full.copy(); nearA[~mk] = 0; farA = full.copy(); farA[mk] = 0
    q = int(opt.get('q', 86))
    for nm, A in (('near', nearA), ('far', farA)):
        Image.fromarray(A, 'RGBA').save(os.path.join(OUT, name + '_' + nm + '.webp'), 'WEBP', quality=q, method=6, alpha_quality=90)
    return full

def job(spec):
    kind, _, kv = spec.partition(':'); k = float(kv) if kv else 1.0
    fi, J, pal, T = M.pose(kind, k, GR)
    t = time.time(); P = M.sculpt(fi, J, pal); V, F, _, _, _ = M.mesh(P, h=H_); lab = M.labels(V, P); V = M.taubin(V, F, it=4)
    print('mesh', spec, len(V), len(F), round(time.time() - t, 1), 's', flush=True)
    name = kind if kind in ('heel', 'lifted') else '%s_%03d' % (kind, round(k * 100))
    render(name, V, F, lab)
    meta = {'ppm': PPM, 'win': WIN, 'fingers': {f: fi[f].round(3).tolist() for f in fi}, 'thumb': J.round(3).tolist(), 'k': k, 'kind': kind,
            'thumb_ik': None if T is None else {'params_deg': np.degrees(T['params'][:3]).round(2).tolist(), 'dflex_deg': round(T['params'][3], 2), 'miss_mm': round(T['miss'], 2)}}
    json.dump(meta, open(os.path.join(OUT, name + '.json'), 'w'))

for a in args: job(a)
