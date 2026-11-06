import sys, numpy as np
sys.path.insert(0, '/home/claude/theseus/3d/shell/tools'); sys.path.insert(0, '/home/claude/work/s2/scripts')
import glbio, s2_seam, skin as SK
RS = s2_seam.install()
sk = SK.get()
js, b = glbio.read('/home/claude/theseus/3d/shell/shell-theseus-1seam.glb'); M = {}
for k in ('triggerL', 'triggerR', 'body'):
    _, d = glbio.mesh_arrays(js, b, k); M[k] = (d['POSITION'].astype(float), d['NORMAL'].astype(float))
S = RS.old_seam(sk, [M['triggerL'], M['triggerR']], M['body'])
old = RS.order_curve(S, 1)
print('old', old.shape)
for i in range(0, len(old), max(1, len(old) // 40)): print('  u %.2f z %.2f' % tuple(old[i]))
new = s2_seam.path_uz(sk)
print('new', new.shape)
for i in range(0, len(new), max(1, len(new) // 25)): print('  u %.2f z %.2f' % tuple(new[i]))
np.save('/home/claude/work/s2/dbg_old.npy', old); np.save('/home/claude/work/s2/dbg_new.npy', new)
