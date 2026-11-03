"""Ortho depth maps of a mesh + high-pass 'detail' maps used to trace seams."""
import sys, numpy as np, cv2
sys.path.insert(0, '/home/claude/theseus/3d/shell/tools')
from raster import ortho_cam, render
from PIL import Image
PX = 10.0  # px per mm
def depthmap(V, F, view):
    if view == 'top':   # image x = -X (camera looks down, up=+Z) -> flip so image x = +X? keep raw: r = -X
        cam = ortho_cam((0,-1,0),(0,0,1),(0,20,0),0); W, H = int(70*PX), int(126*PX)
    elif view == 'bottom':
        cam = ortho_cam((0,1,0),(0,0,1),(0,20,0),0); W, H = int(70*PX), int(126*PX)
    elif view == 'px':  # camera on +X looking -X, up=+Y: image right = -Z (nose at left)
        cam = ortho_cam((-1,0,0),(0,1,0),(0,20,0),0); W, H = int(126*PX), int(42*PX)
    elif view == 'nx':
        cam = ortho_cam((1,0,0),(0,1,0),(0,20,0),0); W, H = int(126*PX), int(42*PX)
    elif view == 'front':
        cam = ortho_cam((0,0,-1),(0,1,0),(0,20,0),0); W, H = int(70*PX), int(42*PX)
    cam['half_h'] = H/2/PX
    R = render(V, F, cam, W, H)
    dep = R['depth'].copy(); dep[~R['mask']] = np.nan
    return dep, cam, R
def to_world(cam, W, H, px, py, depth):
    x = (px + 0.5 - W/2)/PX; y = -(py + 0.5 - H/2)/PX
    return cam['c'] + x*cam['r'][None] + y*cam['u'][None] + depth*cam['f'][None] if np.ndim(px) else cam['c'] + x*cam['r'] + y*cam['u'] + depth*cam['f']
def highpass(dep, sigma_mm=1.2):
    m = np.isfinite(dep)
    d = np.where(m, dep, 0).astype(np.float32); w = m.astype(np.float32)
    k = int(sigma_mm*PX*3)*2+1
    b = cv2.GaussianBlur(d, (k,k), sigma_mm*PX); bw = cv2.GaussianBlur(w, (k,k), sigma_mm*PX)
    sm = b/np.maximum(bw, 1e-6)
    hp = dep - sm  # depth is distance from camera plane: grooves are FARTHER -> positive
    return hp, m
def save_hp(hp, m, path, rng=0.25):
    img = np.clip(0.5 - hp/rng*0.5, 0, 1); img[~m] = 1.0
    Image.fromarray((img*255).astype(np.uint8)).save(path)
if __name__ == '__main__':
    d = np.load(sys.argv[1]); out = sys.argv[2]
    V = d['vertices'].astype(float); F = d['faces'].astype(np.int64)
    res = {}
    for view in ['top','px','nx','front','bottom']:
        dep, cam, R = depthmap(V, F, view)
        hp, m = highpass(dep)
        save_hp(hp, m, f'{out}_hp_{view}.png')
        np.savez_compressed(f'{out}_dm_{view}.npz', dep=dep.astype(np.float32), hp=hp.astype(np.float32), r=cam['r'], u=cam['u'], f=cam['f'], c=cam['c'], half_h=cam['half_h'])
        print(view, dep.shape)
