"""Stage 4: mesh the field with marching cubes in z-slabs, weld, split parts, decimate -> work/mesh_<name>_<part>.npz

  python3 build/s04_mesh.py --kind tri --h 0.12                 # whole shell (body + two triggers)
  python3 build/s04_mesh.py --kind tri --h 0.035 --box x0,x1,y0,y1,z0,z1 --name patch   # fillet macro patch
"""
import argparse, time, numpy as np
from skimage.measure import marching_cubes
from scipy.sparse import coo_matrix
from scipy.sparse.csgraph import connected_components
import fast_simplification
from field import *

ap = argparse.ArgumentParser()
ap.add_argument('--kind', default='tri'); ap.add_argument('--h', type=float, default=0.12)
ap.add_argument('--wscale', type=float, default=1.0); ap.add_argument('--name', default=None)
ap.add_argument('--box', default=None); ap.add_argument('--target', default='body:230000,trigL:36000,trigR:36000')
ap.add_argument('--slab', type=int, default=20); ap.add_argument('--vol', action='store_true'); ap.add_argument('--nomesh', action='store_true'); ap.add_argument('--zr', default=None, help='debug z range z0,z1')
a = ap.parse_args()
name = a.name or a.kind
F = Field(a.kind, a.wscale)
h = a.h
if a.box:
    x0, x1, y0, y1, z0, z1 = map(float, a.box.split(','))
else:
    x0, x1, y0, y1, z0, z1 = -32.2, 32.2, 0.3, 39.0, -60.6, 60.6
if a.zr: z0, z1 = map(float, a.zr.split(','))
xs = np.arange(x0, x1 + 1e-9, h); ys = np.arange(y0, y1 + 1e-9, h); zs = np.arange(z0, z1 + 1e-9, h)
print('grid', len(xs), len(ys), len(zs), 'h', h)
XY = np.stack(np.meshgrid(xs, ys, indexing='ij'), -1).reshape(-1, 2)
Vs, Fs = [], []; nv = 0; t0 = time.time(); nband = 0
VOL = dict(all_body=0.0, all_trig=0.0, wall_body=0.0, wall_trig=0.0)
bos = F.L['bosses']
for k0 in range(0, len(zs) - 1, a.slab):
    k1 = min(k0 + a.slab, len(zs) - 1)
    zz = zs[k0:k1 + 1]
    pts = np.concatenate([np.c_[XY, np.full(len(XY), z)] for z in zz])[:, [0, 1, 2]]
    D = F.ext(pts)
    T = wall_T(pts)
    band = (D < 0.45) & (D > -(T + F.hmax + 0.9))
    for b in bos:
        band |= ((pts[:, 0] - b['x']) ** 2 + (pts[:, 2] - b['z']) ** 2 < (b['od'] / 2 + 1.6) ** 2) & (pts[:, 1] > b['y0'] - 1.0) & (pts[:, 1] < b['y1'] + 1.0) & (D < 0.45)
    vol = np.ones(len(pts), np.float32)
    if band.any():
        vol[band] = F.eval(pts[band])
        if a.vol:
            pb = pts[band]; reg = trig_sdf(pb) > 0
            fr = np.clip(0.5 - vol[band] / h, 0, 1) * h ** 3
            f0 = np.clip(0.5 - F.eval(pb, ribs=False) / h, 0, 1) * h ** 3
            w_ = np.ones(len(pb)); w_[np.isclose(pb[:, 2], zz[-1])] = 0.0 if k1 < len(zs) - 1 else 1.0   # shared layer counted once
            VOL['all_body'] += (fr * w_ * reg).sum(); VOL['all_trig'] += (fr * w_ * ~reg).sum()
            VOL['wall_body'] += (f0 * w_ * reg).sum(); VOL['wall_trig'] += (f0 * w_ * ~reg).sum()
    nband += band.sum()
    if a.nomesh: continue
    vol = vol.reshape(len(zz), len(xs), len(ys)).transpose(1, 2, 0)
    if vol.min() < 0 < vol.max():
        v, f, _, _ = marching_cubes(vol, 0.0, spacing=(h, h, h))
        v += np.array([xs[0], ys[0], zz[0]])
        Vs.append(v.astype(np.float32)); Fs.append(f.astype(np.int64) + nv); nv += len(v)
    if (k0 // a.slab) % 10 == 0:
        print('slab z=%.1f  band %.2fM  tris %.2fM  %.0fs' % (zz[0], band.sum() / 1e6, sum(len(x) for x in Fs) / 1e6, time.time() - t0), flush=True)
if a.vol:
    VOL = {k: v for k, v in VOL.items()}; VOL['ribs_body'] = VOL['all_body'] - VOL['wall_body']; VOL['ribs_trig'] = VOL['all_trig'] - VOL['wall_trig']
    VOL['h'] = h; VOL['kind'] = a.kind; VOL['wscale'] = a.wscale
    print('VOLUME mm3', {k: (round(v, 1) if isinstance(v, float) else v) for k, v in VOL.items()})
    jdump(VOL, os.path.join(WORK, f'vol_{name}.json'))
if a.nomesh: raise SystemExit
V = np.concatenate(Vs); Fc = np.concatenate(Fs); del Vs, Fs
print('raw', len(V), len(Fc), 'band pts %.1fM' % (nband / 1e6), '%.0fs' % (time.time() - t0))
# weld the duplicated slab-boundary vertices
key = np.round(V.astype(np.float64) / 1e-4).astype(np.int64)
_, inv, = np.unique(key, axis=0, return_inverse=True)[0:2] if False else (None, None)
uq, idx, inv = np.unique(key, axis=0, return_index=True, return_inverse=True)
V = V[idx]; Fc = inv.reshape(-1)[Fc]; del key, uq, idx, inv
Fc = Fc[(Fc[:, 0] != Fc[:, 1]) & (Fc[:, 1] != Fc[:, 2]) & (Fc[:, 0] != Fc[:, 2])]
print('welded', len(V), len(Fc))
# components
A = coo_matrix((np.ones(len(Fc) * 2), (np.r_[Fc[:, 0], Fc[:, 1]], np.r_[Fc[:, 1], Fc[:, 2]])), shape=(len(V), len(V)))
nc, lab = connected_components(A, directed=False)
fl = lab[Fc[:, 0]]; del A
cnt = np.bincount(fl, minlength=nc)
order = np.argsort(-cnt)
parts = {}
if a.box:
    parts['patch'] = np.where(cnt[fl] > 50)[0]
else:
    big = [c for c in order[:3] if cnt[c] > 2000]
    print('dropping components', [int(cnt[c]) for c in order[3:] if cnt[c] > 50])
    for c in big:
        sel = np.where(fl == c)[0]; cx = V[Fc[sel].ravel(), 0].mean(); cz = V[Fc[sel].ravel(), 2].mean()
        nm = 'body' if c == order[0] else ('trigL' if cx < 0 else 'trigR')
        if nm in parts: nm = nm + '_' + str(c)
        parts[nm] = sel
    print('components', nc, 'kept', {k: len(v) for k, v in parts.items()}, 'dropped tris', len(Fc) - sum(len(v) for v in parts.values()))
tg = dict(kv.split(':') for kv in a.target.split(','))
for nm, sel in parts.items():
    f = Fc[sel]; used = np.unique(f); remap = np.full(len(V), -1); remap[used] = np.arange(len(used))
    v = V[used].astype(np.float64); f = remap[f]
    target = int(tg.get(nm, tg.get('patch', 120000)))
    raw_n = len(f)
    if len(f) > target:
        v, f = fast_simplification.simplify(v.astype(np.float32), f.astype(np.int32), target_reduction=1 - target / len(f), agg=5)
    np.savez_compressed(os.path.join(WORK, f'mesh_{name}_{nm}.npz'), V=np.asarray(v, np.float32), F=np.asarray(f, np.int32), h=h, raw=raw_n)
    print(nm, 'raw', raw_n, '->', len(f))
print('done %.0fs' % (time.time() - t0))
