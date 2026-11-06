"""The 3D lattice asset (3d/lattice/assets/lattice_tri.bin): its ribs seen from above, from the side and from below,
as rasters (rib = aEta > ETA mm above the inner wall), to compare with the parametric lattice drawn on the simplified mouse."""
import json, sys
import numpy as np, cv2
A = '/home/claude/theseus/3d/lattice/assets/'
M = json.load(open(A + 'lattice.json'))
TT = {'f32': np.float32, 'i16': np.int16, 'i8': np.int8, 'u8': np.uint8, 'u16': np.uint16, 'u32': np.uint32}
buf = open(A + M['tri']['file'], 'rb').read()
def get(k):
    it = M['tri']['items'][k]
    a = np.frombuffer(buf, dtype=TT[it['type']], count=it['count'] * it['itemSize'], offset=it['offset']).reshape(-1, it['itemSize'])
    return a.astype(float) / (255.0 if it.get('normalized') and it['type'] == 'u8' else 1.0)

def parts():
    out = {}
    for p in ['body', 'trigL', 'trigR']:
        P = get(f'tri_{p}.position'); I = get(f'tri_{p}.index').astype(np.int64).reshape(-1, 3)
        eta = get(f'tri_{p}.aEta')[:, 0] * 8.0
        out[p] = (P, I, eta)
    return out

def raster(view, s=10, eta=0.35, ymin=None):
    R = parts()
    allP = np.vstack([v[0] for v in R.values()])
    if view == 'top': U, V = (lambda P: -P[:, 0]), (lambda P: -P[:, 2])
    elif view == 'left': U, V = (lambda P: -P[:, 2]), (lambda P: -P[:, 1])
    u0, u1 = U(allP).min() - 2, U(allP).max() + 2; v0, v1 = V(allP).min() - 2, V(allP).max() + 2
    img = np.zeros((int((v1 - v0) * s), int((u1 - u0) * s)), np.uint8)
    for p, (P, I, E) in R.items():
        keep = (E[I] > eta).all(1)
        if view == 'left': keep &= (P[I][:, :, 0] > 0).all(1)          # the near half (+X, the user's left)
        if ymin is not None: keep &= (P[I][:, :, 1] > ymin).all(1)
        T = I[keep]
        q = np.stack([(U(P) - u0) * s, (V(P) - v0) * s], 1)
        for t in T: cv2.fillConvexPoly(img, np.round(q[t] * 16).astype(np.int32), 255, lineType=cv2.LINE_8, shift=4)
    return img, (u0, v0, s)

if __name__ == '__main__':
    for v in ['top', 'left']:
        img, _ = raster(v, 8)
        cv2.imwrite('/home/claude/work/s1/lat_asset_%s.png' % v, 255 - img)
        print(v, img.shape)
