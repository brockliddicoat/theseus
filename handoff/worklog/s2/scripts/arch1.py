import numpy as np, json
P = json.load(open('/home/claude/work/s1/profile_centre.json'))
Tz, Ty = np.array(P['z']), np.array(P['sil'])
T = lambda z: np.interp(z, Tz, Ty)
a = np.load('/home/claude/work/s2/seam_ths_cloud.npy'); b = np.load('/home/claude/work/s2/seam_sora_cloud.npy')
def bin_side(c, z0, z1, dz=1.0):
    out = []
    for z in np.arange(z0, z1 + 1e-9, dz):
        m = (np.abs(c[:, 2] - z) < dz / 2) & (c[:, 0] > 15)
        if m.sum(): out.append((z, c[m, 1].mean(), c[m, 0].mean(), m.sum()))
    return np.array(out)
A = bin_side(a, 5, 58); B = bin_side(b, 5, 58)
print(' z    T     y_ths  d_ths  x_ths |  y_sora d_sora')
for (z, y, x, n), (_, y2, x2, n2) in zip(A, B):
    print('%5.1f %5.2f  %5.2f  %5.2f  %5.2f | %5.2f  %5.2f' % (z, T(z), y, T(z) - y, x, y2, T(z) - y2))
