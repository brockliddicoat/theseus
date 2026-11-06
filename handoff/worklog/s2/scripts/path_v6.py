"""S2 seam path v6 (+X side, scene X Y Z, front -> centre): v5's rear (the cutout at z 4.8418, K3, the arch from J) and, ahead
of z 34, option C's run-out into the flat lip (front.design_C), to Z_END on the side wall. Side-view heights are the design's;
X on the wall from the polar skin (well conditioned there); the field (s2_seam) takes theta from the height on the arch."""
import json, sys
import numpy as np
sys.path.insert(0, '/home/claude/work/s2/scripts')
import skin as SK, front as FR
Z_END = 55.5
def build():
    v5 = json.load(open('/home/claude/work/s2/seam_path_v5.json')); P5 = np.array(v5['path']); zJ = v5['J'][1]
    rear = P5[P5[:, 2] <= zJ + 1e-9]                               # J (on the arch) ... the corner ... the cutout's centre
    fC, D = FR.design_C()
    sk = SK.get(); SK.fill_opening(sk)
    zz = np.arange(zJ + 0.05, Z_END + 1e-9, 0.05)
    yy = fC(zz)
    th = np.array([SK.th_at_y(sk, y, z) for y, z in zip(yy, zz)])
    X = SK.xyz(sk, th, zz)[:, 0]
    from scipy.ndimage import gaussian_filter1d
    X = gaussian_filter1d(X, 3)
    arch = np.c_[X, yy, zz]
    path = np.vstack([arch[::-1], rear])
    out = dict(v5)
    out.update(note='S2 seam path v6 (+X side; scene X Y Z, front (z %.1f, on the side wall) to the centre of the rear cutout): the arch 6.9 mm under the crown along its normal (4.75 at the nose) and, ahead of z %.0f, option C\'s run-out into the flat lip (r_min %.1f mm, lip corners +%.2f); K3 on the arch tangent; cutout z 4.8418' % (Z_END, D['z_a'], D['rmin'], D['rise']),
               path=path.round(4).tolist(), front_C=dict(z_a=D['z_a'], rmin=D['rmin'], rise=D['rise'], dip=D['dip']))
    json.dump(out, open('/home/claude/work/s2/seam_path_v6.json', 'w'))
    return path
if __name__ == '__main__':
    p = build(); print(p.shape, p[0].round(2), p[-1].round(2))
