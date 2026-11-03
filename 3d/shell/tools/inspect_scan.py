import sys, numpy as np, trimesh
sys.path.insert(0, '/home/claude/theseus/3d/shell/tools')
from raster import *
from PIL import Image
d = np.load('/home/claude/theseus/refs/scan/sora-normalized.npz')
V = d['vertices'].astype(np.float64); F = d['faces'].astype(np.int64)
m = trimesh.Trimesh(V, F, process=False)
cc = sorted(trimesh.graph.connected_components(m.face_adjacency, min_len=1), key=len, reverse=True)
pal = np.array([[0.6,0.6,0.62],[0.75,0.55,0.4],[0.3,0.6,0.9],[0.9,0.3,0.3],[0.3,0.8,0.4],[0.9,0.8,0.2],[0.7,0.3,0.8],[0.2,0.8,0.8],[1,0.5,0.0],[0.5,0.2,0.1]])
fcol = np.zeros((len(F),3)); fcol[:] = [0.4,0.4,0.4]
for i,c in enumerate(cc): fcol[c] = pal[i % len(pal)]
# per-vertex color from faces (approx)
vc = np.zeros_like(V); 
for k in range(3): vc[F[:,k]] = fcol
views = {
 'top':   ortho_cam((0,-1,0),(0,0,1),(0,19,0),64),
 'bottom':ortho_cam((0,1,0),(0,0,1),(0,19,0),64),
 'sidePX':ortho_cam((-1,0,0),(0,1,0),(0,19,0),40),   # camera on +X looking -X
 'sideNX':ortho_cam((1,0,0),(0,1,0),(0,19,0),40),
 'front': ortho_cam((0,0,-1),(0,1,0),(0,19,0),40),
 'back':  ortho_cam((0,0,1),(0,1,0),(0,19,0),40),
}
for name, cam in views.items():
    W,H = (900,900) if name in ('top','bottom') else (1300, 520)
    if name in ('front','back'): W,H=(900,600)
    img,_ = shade(V,F,cam,W,H,vcolor=vc)
    Image.fromarray(img).save(f'work/scan_{name}.png')
    print(name)
