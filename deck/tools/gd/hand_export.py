# The open hand model (WebXR generic hand, MIT, Copyright (c) 2019 Amazon; assets/webxr-generic-hand) as data: its rest mesh
# subdivided (Catmull-Clark, level 2, skin weights carried), its 25 joint frames, in mm. Run with Blender as a Python module:
#   nice python3 -I deck/tools/gd/hand_export.py deck/tools/gd/assets/webxr-generic-hand/right.glb deck/tools/gd/out/hand/rest.npz
# Frames follow the WebXR joint convention: -Z along the bone to the tip, +Y out of the back of the hand and the nail, +X the
# axis the joint flexes about. World: Blender's (the glTF's y up turned to z up): fingers along -Z, the back of the hand +X,
# the thumb's side +Y. Everything after this (fit, pose, view, drawing) is hand_draw.py, in numpy.
import bpy, sys, json, struct
import numpy as np
from mathutils import Matrix, Vector, Quaternion
glb, out = sys.argv[-2], sys.argv[-1]

def glb_json(path):
    b = open(path, 'rb').read()
    return json.loads(b[20:20 + struct.unpack_from('<I', b, 12)[0]])
G = glb_json(glb); nodes = G['nodes']; parent = {}
for i, n in enumerate(nodes):
    for c in n.get('children', []): parent[c] = i
def local(i):
    n = nodes[i]; q = n.get('rotation', [0, 0, 0, 1]); s = n.get('scale', [1, 1, 1])
    return Matrix.Translation(Vector(n.get('translation', [0, 0, 0]))) @ Quaternion((q[3], q[0], q[1], q[2])).to_matrix().to_4x4() @ Matrix.Diagonal(Vector((s[0], s[1], s[2], 1)))
def world(i):
    M = local(i)
    while i in parent: i = parent[i]; M = local(i) @ M
    return M
Cz = Matrix(((1, 0, 0, 0), (0, 0, -1, 0), (0, 1, 0, 0), (0, 0, 0, 1)))   # glTF y-up to Blender z-up
frame = {n['name']: Cz @ world(i) for i, n in enumerate(nodes) if 'name' in n}

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=glb)
sc = bpy.context.scene
arm = [o for o in sc.objects if o.type == 'ARMATURE'][0]
hand = [o for o in sc.objects if o.type == 'MESH' and 'hand' in o.name.lower()][0]
names = [b.name for b in arm.data.bones]
# the rest mesh: no armature deform; subdivided, the vertex groups interpolated by the modifier
for m in list(hand.modifiers): hand.modifiers.remove(m)
sub = hand.modifiers.new('sub', 'SUBSURF'); sub.levels = 2; sub.render_levels = 2
bpy.context.view_layer.objects.active = hand
bpy.ops.object.modifier_apply(modifier='sub')
me = hand.data; me.calc_loop_triangles()
Mw = hand.matrix_world
V = np.array([tuple(Mw @ v.co) for v in me.vertices]) * 1000.0
F = np.array([tuple(t.vertices) for t in me.loop_triangles], dtype=np.int32)
gi = {g.index: g.name for g in hand.vertex_groups}
W = np.zeros((len(me.vertices), len(names)), dtype=np.float32)
for v in me.vertices:
    for g in v.groups:
        nm = gi.get(g.group)
        if nm in names: W[v.index, names.index(nm)] = g.weight
s = W.sum(1, keepdims=True); W = W / np.where(s > 0, s, 1)
FR = np.array([np.array(frame[n]) for n in names], dtype=np.float64); FR[:, :3, 3] *= 1000.0
head = np.array([tuple(Mw @ (arm.matrix_world @ arm.pose.bones[n].head)) for n in names]) * 1000.0
print('frame check (mm)', float(np.abs(FR[:, :3, 3] - head).max()))
np.savez_compressed(out, V=V, F=F, W=W, FR=FR, names=np.array(names))
print('verts', len(V), 'tris', len(F), 'unweighted', int((s[:, 0] == 0).sum()), 'extent mm', V.min(0).round(1), V.max(0).round(1))
