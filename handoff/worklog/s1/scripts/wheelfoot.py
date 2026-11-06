"""Where the scroll wheel passes through the triggers' wall, seen from above: the wheel's footprint at the inner skin
(where it would touch the wall's cut face) and at the outer skin (where it shows), from the height map of the 3D shell.
The wheel: K2's 0.900 g six-arm wheel, D 22.74 x 7.0 wide, a torus crown (crown radius = its radius) with 0.35 mm edge
fillets (3d/parts/scrollwheel.js), on the scan's centre (y 17.03, z 34.87; shell meta)."""
import sys, json
import numpy as np
sys.path.insert(0, '/home/claude/work/s1/scripts')

def wheel_r(x, R=11.37, W=7.0, fe=0.35):
    """the tyre's radius at axial position x (crown = R at the centre, a torus section, rounded at the edges)"""
    x = np.abs(np.asarray(x, float)); hw = W / 2
    r = np.sqrt(np.maximum(R * R - x * x, 0))
    edge = x > hw - fe
    r = np.where(edge, np.sqrt(np.maximum(R * R - (hw - fe) ** 2, 0)) - fe + np.sqrt(np.maximum(fe * fe - (x - (hw - fe)) ** 2, 0)), r)
    return np.where(x <= hw, r, 0.0)

def footprint(hm_npz='/home/claude/work/s1/heightmap_ths.npz', wall=1.4, yc=17.03, zc=34.87, R=11.37, W=7.0, lift=None):
    D = np.load(hm_npz); xs, zs, Y = D['xs'], D['zs'], D['Y']
    if lift is not None: Y = Y + lift(xs[None, :], zs[:, None])
    gz, gx = np.gradient(Y, zs, xs)
    Yi = Y - wall * np.sqrt(1 + gx ** 2 + gz ** 2)            # the inner skin, a wall of 1.4 mm along the normal
    out = {'inner': [], 'outer': []}
    for x in np.arange(-W / 2, W / 2 + 1e-9, 0.05):
        r = wheel_r(x, R, W)
        j = np.argmin(np.abs(xs - x))
        zz = zs[(zs > zc - r) & (zs < zc + r)]
        yw = yc + np.sqrt(np.maximum(r * r - (zz - zc) ** 2, 0))
        for key, S in (('inner', Yi), ('outer', Y)):
            ys = np.interp(zz, zs, S[:, j])
            above = yw > ys
            if above.any(): out[key].append((x, zz[above].min(), zz[above].max()))
    for k in out: out[k] = np.array(out[k])
    return out

if __name__ == '__main__':
    F = footprint()
    for k in ('inner', 'outer'):
        a = F[k]; c = a[np.argmin(np.abs(a[:, 0]))]; e = a[np.argmin(np.abs(np.abs(a[:, 0]) - 3.3))]
        print('%s skin: at x 0 z %.2f..%.2f (%.2f long); at x 3.3 z %.2f..%.2f' % (k, c[1], c[2], c[2] - c[1], e[1], e[2]))
    # the wheel's top, and the crown's height over it
    D = np.load('/home/claude/work/s1/heightmap_ths.npz'); xs, zs, Y = D['xs'], D['zs'], D['Y']
    j = np.argmin(np.abs(xs)); i = np.argmin(np.abs(zs - 34.87))
    print('wheel top 28.40; the crown (opening filled) at z 34.87: %.2f -> proud %.2f' % (Y[i, j], 28.40 - Y[i, j]))
    json.dump({k: F[k].round(3).tolist() for k in F}, open('/home/claude/work/s1/wheel_footprint.json', 'w'))
