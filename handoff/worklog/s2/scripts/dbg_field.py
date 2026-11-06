import sys, json, numpy as np
sys.path.insert(0, '/home/claude/theseus/3d/shell/tools'); sys.path.insert(0, '/home/claude/work/s2/scripts')
import glbio, s2_seam, skin as SK
RS = s2_seam.install()
js, b = glbio.read('/home/claude/theseus/3d/shell/shell-theseus-1seam.glb'); M = {}
for k in ('triggerL', 'triggerR', 'body'):
    _, d = glbio.mesh_arrays(js, b, k); M[k] = (d['POSITION'].astype(float), d['NORMAL'].astype(float), d['COLOR_0'], d['indices'].reshape(-1, 3))
skin = RS.Skin([M[k] for k in ('triggerL', 'triggerR', 'body')])
S = RS.old_seam(skin, [(M[k][0], M[k][1]) for k in ('triggerL', 'triggerR')], (M['body'][0], M['body'][1]))
curves = []
for sgn in (1, -1):
    old = RS.order_curve(S, sgn); old = old[old[:, 1] < RS.Z_HI + 1.5]
    side_part, tail = RS.new_curve(old, skin, sgn)
    src, dst = RS.correspondence(old, tail)
    src = np.vstack([side_part, src]); dst = np.vstack([side_part, dst]); curves.append((sgn, (src, dst)))
    if sgn > 0: np.save('/home/claude/work/s2/dbg_src.npy', src); np.save('/home/claude/work/s2/dbg_dst.npy', dst)
U, Z, D, det = RS.field(skin, curves)
np.savez('/home/claude/work/s2/dbg_field.npz', U=U, Z=Z, D=D, det=det)
bad = det < 0.2
print('det min %.3f; cells < 0.2: %d' % (det.min(), bad.sum()))
I, J = np.nonzero(bad)
for i, j in list(zip(I, J))[:: max(1, len(I) // 25)]: print('  u %6.1f z %5.1f det %+.2f  D (%+.2f, %+.2f)' % (U[i], Z[j], det[i, j], *D[i, j]))
