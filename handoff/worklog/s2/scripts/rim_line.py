"""The 2 deg crease (F51 12:34) and its consequences: the line, where it meets the side outline, and per section (both walls)
the rim's chamfer carried to the line: the section's widest X before/after (the top-view outline), two ways of lowering the
crease where the line is under the scan's (continue the wall's own slope down = 'fill', or drop it vertically = 'hold')."""
import sys, json, os, numpy as np
sys.path.insert(0, '/home/claude/work/s1/scripts'); sys.path.insert(0, '/home/claude/work/s2/scripts')
A_DEG, C0 = float(os.environ.get('RIM_DEG', '1.75')), None   # Brock 12:50: 1.75 deg
import crease_fit as CF
C0 = float(CF.fit(A_DEG, kind='max')); TANA = float(np.tan(np.radians(A_DEG)))
line = lambda z: (C0 - TANA * np.asarray(z, float)) if np.ndim(z) else float(C0 - TANA * z)
CR = json.load(open('/home/claude/work/s1/crease_side.json')); cz, cy = np.array(CR['z']), np.array(CR['y'])
scan = lambda z: np.interp(z, cz, cy)
def meets_outline():
    import sidegeo as SG
    from shapely.geometry import Polygon, LineString
    P = Polygon(SG.silhouette('shell'))
    L = LineString([(-70, line(-70)), (70, line(70))]); I = L.intersection(P.exterior)
    return sorted([(p.x, p.y) for p in getattr(I, 'geoms', [I])])
exec(open('/home/claude/work/s2/scripts/rimsec.py').read().split('cr = json.load')[0])   # contour(z, side) from the body
def section_change(z, mode='hold'):
    ys, xs = contour(z)
    yc, yn = float(scan(z)), float(line(z)); xb_y = ys[0]
    xmax0 = xs.max()
    if yn >= yc:          # raise: the chamfer straight from the base edge to the wall at yn
        xl = np.interp(yn, ys, xs); seg = xs[0] + (xl - xs[0]) * (ys - ys[0]) / (yn - ys[0])
        new = np.where(ys <= yn, np.minimum(xs, seg), xs)
    else:                 # lower: the wall carried down below the old crease to yn, then the chamfer from the base edge
        k = (ys > yc) & (ys < yc + 1.5); slope = np.polyfit(ys[k], xs[k], 1)[0] if k.sum() > 3 else 0.0
        if mode == 'hold': slope = min(slope, 0.0) * 0 if slope < 0 else slope   # never lean further out than vertical
        xc = np.interp(yc, ys, xs); xn = xc + slope * (yn - yc)
        seg = xs[0] + (xn - xs[0]) * (ys - ys[0]) / (yn - ys[0])
        wall = xc + slope * (ys - yc)
        new = np.where(ys <= yn, seg, np.where(ys <= yc, wall, xs))
    return dict(z=z, yc=yc, yn=yn, xmax0=float(xmax0), xmax1=float(new.max()), ys=ys, xs=xs, new=new)
if __name__ == '__main__':
    print('line: y = %.3f - %.5f z  (%.1f deg); nose corner (z 55.4) %.2f, z 0 %.2f, tail (z -59.58) %.2f' % (C0, TANA, A_DEG, line(55.4), line(0), line(-59.58)))
    print('meets the side outline at', [tuple(round(v, 2) for v in p) for p in meets_outline()])
    for mode in ('fill', 'hold'):
        print(mode)
        for z in [-57, -55, -52.5, -50, -47.5, -45, -42.5, -40, -37.5, -35, -30, -25, -20, -10, 0, 20, 40, 50]:
            r = section_change(z, mode)
            print('  z %+6.1f  crease %.2f -> %.2f (%+.2f)  widest x %.2f -> %.2f (%+.2f)' % (z, r['yc'], r['yn'], r['yn'] - r['yc'], r['xmax0'], r['xmax1'], r['xmax1'] - r['xmax0']))
