"""Silhouette validation of a built shell GLB against the reference photos (same metrics as for the raw scan).
python3 validate.py shell-theseus.glb out_prefix
"""
import sys, json, numpy as np, trimesh
sys.path.insert(0, '/home/claude/theseus/3d/shell/tools')
from silhouette import compare_ortho
from fit_rtings_cam import PM, H0, W0, iou
from raster import persp_cam, render, shade
from PIL import Image


def load_visible(path, wheel_d=22.4, wheel_w=7.0, wheel_c=(0, 17.03, 34.87)):
    s = trimesh.load(path)
    Vs, Fs, off = [], [], 0
    for name, g in s.geometry.items():
        if name.startswith('engrave') or name == 'sideMark':
            continue
        T = s.graph.get(name)[0]
        Vs.append(trimesh.transform_points(g.vertices, T)); Fs.append(g.faces + off); off += len(g.vertices)
    w = trimesh.creation.cylinder(radius=wheel_d / 2, height=wheel_w, sections=96)
    w.apply_transform(trimesh.transformations.rotation_matrix(np.pi / 2, [0, 1, 0]))
    w.apply_translation(wheel_c)
    Vs.append(w.vertices); Fs.append(w.faces + off)
    # skates (8 dots under the rim) matter for the side profile at the pad
    return np.concatenate(Vs), np.concatenate(Fs)


if __name__ == '__main__':
    V, F = load_visible(sys.argv[1]); out = sys.argv[2]
    res = {}
    for view in ('top', 'side'):
        r = compare_ortho(V, F, view)
        Image.fromarray(r.pop('overlay')).save(f'{out}_{view}.png')
        res[view] = {k: round(v, 4) for k, v in r.items()}
    cam = json.load(open('/home/claude/theseus/3d/shell/work/rtings_scan.json'))
    c = persp_cam(np.array(cam['eye']), np.array(cam['target']), np.array(cam['up']), cam['fov'])
    from scipy.ndimage import binary_fill_holes, binary_closing
    m = binary_fill_holes(binary_closing(render(V, F, c, W0, H0)['mask'], iterations=2))
    res['rtings34_fixed_camera'] = {'iou': round(float(iou(m, PM)), 4)}
    ov = np.zeros((H0, W0, 3), np.uint8); ov[:] = 245
    ov[m & ~PM] = (220, 60, 60); ov[PM & ~m] = (60, 110, 230); ov[m & PM] = (120, 120, 120)
    Image.fromarray(ov).save(f'{out}_rtings.png')
    b = trimesh.Trimesh(V, F, process=False).bounds
    res['bbox_mm'] = {'W': round(b[1, 0] - b[0, 0], 2), 'H': round(b[1, 1] - b[0, 1], 2), 'L': round(b[1, 2] - b[0, 2], 2)}
    json.dump(res, open(out + '.json', 'w'), indent=1)
    print(json.dumps(res, indent=1))
