"""Step 1 alone: the seam onto S2's path (arch + K3 + cutout) on today's shell -> work/s2/build/shell-s2-seam.glb"""
import sys, json, time
import numpy as np
sys.path.insert(0, '/home/claude/theseus/3d/shell/tools'); sys.path.insert(0, '/home/claude/work/s2/scripts')
import glbio, one_seam, s2_seam
src = sys.argv[1] if len(sys.argv) > 1 else '/home/claude/theseus/3d/shell/shell-theseus-1seam.glb'
out = sys.argv[2] if len(sys.argv) > 2 else '/home/claude/work/s2/build/shell-s2-seam.glb'
t0 = time.time()
js, b = glbio.read(src)
M = {}
for n in js['nodes']:
    if 'mesh' not in n: continue
    _, d = glbio.mesh_arrays(js, b, n['name'])
    M[n['name']] = [d['POSITION'].astype(float), d['NORMAL'].astype(float), d['COLOR_0'].astype(float), d['indices'].reshape(-1, 3).astype(np.int64)]
RS = s2_seam.install()
mm = {k: tuple(M[k]) for k in ('triggerL', 'triggerR', 'body')}
moved, info = RS.apply(mm, verbose=False)
for k, v in moved.items(): M[k][0], M[k][1] = v[0].astype(float), v[1].astype(float)
print('seam moved: det_min %.3f  moved %s  (%.0fs)' % (info['det_min'], {k: info[k + '_moved'] for k in ('triggerL', 'triggerR', 'body')}, time.time() - t0))
print(json.dumps({k: v for k, v in info.items() if k in ('L', 'R')}))
rep = {k: (M[k][0].astype(np.float32), M[k][1].astype(np.float32), M[k][2], M[k][3].astype(np.uint32)) for k in M}
size = one_seam.write(js, b, rep, [], out)
print('wrote', out, size // 1024, 'KB')
