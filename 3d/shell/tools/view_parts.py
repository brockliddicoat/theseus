import sys, json, numpy as np
sys.path.insert(0, '/home/claude/theseus/3d/shell/tools')
from raster import persp_cam, shade, render
from PIL import Image
d = np.load(sys.argv[1]); out = sys.argv[2]
names = sorted(set(k.rsplit('_', 1)[0] for k in d.files if k != 'meta'))
pal = {'triggerL': (0.55,0.57,0.62), 'triggerR': (0.62,0.58,0.55), 'body': (0.5,0.5,0.52), 'plate': (0.45,0.5,0.6),
       'wheelBay': (0.7,0.5,0.4), 'usbC': (0.8,0.8,0.8), 'sideFront': (0.5,0.65,0.5), 'sideRear': (0.65,0.5,0.65)}
Vs, Fs, Ns, Cs = [], [], [], []; off = 0
for n in names:
    V, F, N = d[n+'_V'].astype(float), d[n+'_F'].astype(np.int64), d[n+'_N'].astype(float)
    Vs.append(V); Fs.append(F + off); Ns.append(N); Cs.append(np.tile(pal.get(n, (0.6,0.6,0.6)), (len(V),1))); off += len(V)
V = np.concatenate(Vs); F = np.concatenate(Fs); N = np.concatenate(Ns); C = np.concatenate(Cs)
cams = json.loads(sys.argv[3]) if len(sys.argv) > 3 else {'a': [[110, 90, 120], [0, 12, 5], 30]}
tiles = []
for k, (eye, tgt, fov) in cams.items():
    cam = persp_cam(np.array(eye, float), np.array(tgt, float), (0, 1, 0) if abs(eye[1]-tgt[1]) < 0.95*np.linalg.norm(np.subtract(eye,tgt)) else (0,0,1), fov)
    img, _ = shade(V, F, cam, 1000, 700, vcolor=C, spec=0.45, shininess=50, VN=N)
    tiles.append(img)
Image.fromarray(np.concatenate(tiles, 1)).save(out)
