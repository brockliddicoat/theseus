"""Stage 5: structural comparison on the shell body (derived, this model).

Stiffened-shell finite elements (fem.py, validated on textbook plates and a T-section):
  - wall: flat CST+DKT shells on the mid-surface, graded thickness T(p), CF-PP E = 13.5 GPa, nu = 0.35
  - ribs: eccentric beams on mesh edges (the mesh is the lattice refined n = 6, so triangle AND hexagon ribs lie on edges)
  - rim flange, trigger rails/front arch, nose wall (as a deep beam): beams; bosses: stiff links; PCB: 1.0 mm FR4 plate
    screwed at the 4 bosses and tied to the rib feet (#94)
  - supports: the 8 skates (vertical), friction pins at two skates
Load cases: 'press' 10 N down on the crown (8 mm pad), 'squeeze' 10 N in on each side at the grip.
Variants: tri, hex (equal rib volume, width scaled from the meshed volumes), none (wall only), thick (no ribs, wall
thickened to the tri variant's total mass).
"""
import json, numpy as np
from scipy.spatial import cKDTree, Delaunay
from matplotlib.path import Path
from common import *
from geom import *
from fem import Model

S = Shell(); L = json.load(open(os.path.join(WORK, 'layout.json')))
d = np.load(os.path.join(WORK, 'lattice_raw.npz')); Xc, Kc, Jc, Y_RIM = d['X'], d['K'], d['J'], float(d['y_rim'])
coarse = {(int(k), int(j)): i for i, (k, j) in enumerate(zip(Kc, Jc))}
E, NU = P['E'], P['nu']
wscale_hex = json.load(open(os.path.join(WORK, 'hex_wscale.json')))['wscale'] if os.path.exists(os.path.join(WORK, 'hex_wscale.json')) else 1.0
import sys
n = int(sys.argv[1]) if len(sys.argv) > 1 else 6
OUT = sys.argv[2] if len(sys.argv) > 2 else ''

def mid_project(p, it=5):
    p = np.array(p, float)
    for _ in range(it):
        s = S.D(p) + wall_T(p) / 2; g = S.ext.grad(p); p -= (s / np.maximum((g * g).sum(1), 1e-9))[:, None] * g
    return p

# ---------------- fine nodes (refined lattice) ----------------
fine = {}
for (k, j), i in coarse.items():
    for dk in range(n):
        for dj in range(n):
            s_, t_ = dj / n, dk / n
            if s_ + t_ <= 1 + 1e-9: ids = [(k, j), (k, j + 1), (k + 1, j)]; w_ = [1 - s_ - t_, s_, t_]
            else: ids = [(k + 1, j + 1), (k + 1, j), (k, j + 1)]; w_ = [s_ + t_ - 1, 1 - s_, 1 - t_]
            if any(q not in coarse and ww > 1e-9 for q, ww in zip(ids, w_)): continue
            fine[(n * k + dk, n * j + dj)] = sum(ww * Xc[coarse[q]] for q, ww in zip(ids, w_) if ww > 1e-9)
keys = list(fine.keys()); Pf = mid_project(np.array([fine[q] for q in keys]))
fid = {q: i for i, q in enumerate(keys)}
tris = []
for (K, J) in keys:
    for tri in (((K, J), (K, J + 1), (K + 1, J)), ((K + 1, J), (K, J + 1), (K + 1, J + 1))):
        if all(q in fid for q in tri): tris.append([fid[q] for q in tri])
tris = np.array(tris)
cen = Pf[tris].mean(1)
_ol = np.array(L['outline_bottom']); from scipy.spatial import cKDTree as _KD
_fl = Path(_ol).contains_points(cen[:, [0, 2]]) & (_KD(_ol).query(cen[:, [0, 2]])[0] > 3.2) & (cen[:, 1] < 8.0)
keep = (trig_sdf(cen) > P['gap'] / 2 + 0.2) & (Pf[tris][:, :, 1].min(1) > 1.55) & ~_fl
# orientation: normals toward the cavity side consistent (n_in)
tris = tris[keep]
nrm = np.cross(Pf[tris[:, 1]] - Pf[tris[:, 0]], Pf[tris[:, 2]] - Pf[tris[:, 0]])
nin_c = S.normal_in(Pf[tris].mean(1))
flip = (nrm * nin_c).sum(1) < 0; tris[flip] = tris[flip][:, [0, 2, 1]]
used = np.unique(tris); remap = -np.ones(len(Pf), int); remap[used] = np.arange(len(used))
X = Pf[used]; T3 = remap[tris]; keys_used = [keys[i] for i in used]; nid = {q: remap[fid[q]] for q in keys if remap[fid[q]] >= 0}
NIN = S.normal_in(X)
print('FE mesh: nodes', len(X), 'shells', len(T3))

def edges_of_mesh(T):
    e = np.sort(np.concatenate([T[:, [0, 1]], T[:, [1, 2]], T[:, [2, 0]]]), 1)
    u, c = np.unique(e, axis=0, return_counts=True); return u, c
EU, EC = edges_of_mesh(T3); edge_set = set(map(tuple, EU)); bnd = EU[EC == 1]

def lattice_edges(kind):
    out = []   # (a, b, fam)
    if kind == 'tri':
        for (K, J), i in nid.items():
            for (dk, dj, fam, cond) in ((0, 1, 0, K % n == 0), (1, 0, 1, J % n == 0), (1, -1, 2, (K + J) % n == 0)):
                q = (K + dk, J + dj)
                if cond and q in nid and tuple(sorted((i, nid[q]))) in edge_set: out.append((i, nid[q], fam))
    else:
        m = n // 3
        kept = {(K // m, J // m) for (K, J) in nid if K % m == 0 and J % m == 0 and ((J // m) - (K // m)) % 3 != 1}
        for (K3, J3) in kept:
            for (dk, dj, fam) in ((0, 1, 0), (1, 0, 1), (1, -1, 2)):
                if (K3 + dk, J3 + dj) not in kept: continue
                chain = [(m * K3 + s_ * dk, m * J3 + s_ * dj) for s_ in range(m + 1)]
                if all(q in nid for q in chain):
                    for (p_, q_) in zip(chain[:-1], chain[1:]):
                        if tuple(sorted((nid[p_], nid[q_]))) in edge_set: out.append((nid[p_], nid[q_], fam))
    return np.array(out)

def rib_section(mid, fam, kind, wsc=1.0):
    g = grade(mid); w = (P['w_top'] + (P['w_bot'] - P['w_top']) * g) * wsc
    k = smoothstep(6.0, 36.0, mid[:, 1]); h = P['h_min'] + (P['h_max'] - P['h_min']) * k
    if kind == 'tri': h = np.where(fam == 0, h, 0.86 * h)
    else: h = 0.93 * h
    return w, h

def rect_props(w, h):
    A = w * h; Iz = w * h ** 3 / 12; Iy = h * w ** 3 / 12
    a_, b_ = np.maximum(w, h), np.minimum(w, h); J = a_ * b_ ** 3 * (1 / 3 - 0.21 * b_ / a_ * (1 - b_ ** 4 / (12 * a_ ** 4)))
    return A, Iy, Iz, J

# ---------------- shared structure ----------------
bnd_mid = X[bnd].mean(1)
ts_b = trig_sdf(bnd_mid)
seam_edges = bnd[(ts_b < 4.0) & (bnd_mid[:, 1] > 6.0)]
rim_edges = bnd[(X[bnd][:, :, 1].max(1) < 4.5)]
print('boundary edges: seam', len(seam_edges), 'rim', len(rim_edges))

def build(kind, thick=1.0, ribs=True):
    Xall = [X]; extra = []
    def add_node(p):
        nonlocal_X = np.concatenate(Xall); Xall.append(np.asarray(p, float)[None]); return len(nonlocal_X)
    # nose: a deep beam around the front joining the two front ends of the side-wall mesh at mid-height
    fr = [i for i in range(len(X)) if X[i, 2] > 40 and 4.0 < X[i, 1] < 8.0]
    iL = max([i for i in fr if X[i, 0] < 0], key=lambda i: X[i, 2]); iR = max([i for i in fr if X[i, 0] > 0], key=lambda i: X[i, 2])
    nose_pts = []
    for x in np.linspace(X[iL, 0], X[iR, 0], 15)[1:-1]:
        zs = np.arange(40, 62, 0.05); Pq = np.stack([np.full_like(zs, x), np.full_like(zs, 5.5), zs], 1)
        s = S.D(Pq) + wall_T(Pq) / 2; k = np.where((s[:-1] < 0) & (s[1:] >= 0))[0]
        nose_pts.append(Pq[k[0]] if len(k) else [x, 5.5, 55.0])
    nose_ids = [iL] + [add_node(p) for p in nose_pts] + [iR]
    # bosses: centre node at insert mid-height, stiff links to the wall nodes around it, PCB node below
    bos = []
    for b in L['bosses']:
        c = np.array([b['x'], b['y0'] + 3.0, b['z']]); ic = add_node(c)
        Xn = np.concatenate(Xall); dd = np.linalg.norm(X - c, axis=1); near = np.argsort(dd)[:6]
        bos.append((ic, near[dd[near] < 7.5]))
    # PCB plate: Delaunay over boss + tie points + interior grid, clipped to the outline
    ol = np.array(L['pcb']['outline']); yb = L['pcb']['y0'] + L['pcb']['t'] / 2
    pth = Path(ol)
    gx, gz = np.meshgrid(np.arange(-30, 30, 5.0), np.arange(L['pcb']['z_rear'], L['pcb']['z_front'], 5.0))
    G = np.c_[gx.ravel(), gz.ravel()]; G = G[pth.contains_points(G, radius=-2.0)]
    ties = [t for t in L['ties'] if np.all(np.isfinite(t['p']))]
    tie_xz = np.array([[t['p'][0], t['p'][2]] for t in ties]); boss_xz = np.array([[b['x'], b['z']] for b in L['bosses']])
    pts = np.vstack([boss_xz, tie_xz, G])
    pts = pts[np.r_[True, np.linalg.norm(np.diff(pts, axis=0), axis=1) > 1e-6]]
    dl = Delaunay(pts); tri = dl.simplices
    cc = pts[tri].mean(1); tri = tri[pth.contains_points(cc)]
    q = np.sort(np.concatenate([tri[:, [0, 1]], tri[:, [1, 2]], tri[:, [2, 0]]]), 1)
    pcb0 = len(np.concatenate(Xall)); Xall.append(np.c_[pts[:, 0], np.full(len(pts), yb), pts[:, 1]])
    Xn = np.concatenate(Xall)
    m = Model(Xn)
    # wall shells
    tt = wall_T(X[T3].mean(1)) * thick
    m.add_shells(T3, tt, E, NU)
    # PCB shells (FR4)
    m.add_shells(tri + pcb0, np.full(len(tri), L['pcb']['t']), 20000.0, 0.15)
    def beams(Bn, w, h, off_dir, offset, tag, Emod=E):
        Bn = np.asarray(Bn, int)
        if len(Bn) == 0: return
        A, Iy, Iz, J = rect_props(w, h)
        up = off_dir
        m.add_beams(Bn, Emod, NU, A, Iy, Iz, J, up=up, off=offset, tag=tag, h=h, w=w)
    lat_vol = 0.0
    if ribs:
        Le = lattice_edges(kind)
        mid = Xn[Le[:, :2]].mean(1)
        w, h = rib_section(mid, Le[:, 2], kind, wscale_hex if kind == 'hex' else 1.0)
        nin = S.normal_in(mid); tm = wall_T(mid) * thick
        off = nin * (tm / 2 + h / 2)[:, None]
        beams(Le[:, :2], w, h, nin, off, 'lattice')
        lat_vol = float((w * h * np.linalg.norm(Xn[Le[:, 0]] - Xn[Le[:, 1]], axis=1)).sum())
        m.beams[-1]['fam'] = Le[:, 2]
        # rails: seam boundary (front arch + trigger support rails)
        mid = Xn[seam_edges].mean(1); nin = S.normal_in(mid); tm = wall_T(mid)
        hr = np.where(np.abs(mid[:, 0]) < 22, 2.0, 1.5); wr = np.full(len(mid), 1.12)
        beams(seam_edges, wr, hr, nin, nin * (tm / 2 + hr / 2)[:, None], 'rail')
    # rim flange ring (always: it is part of the moulding)
    mid = Xn[rim_edges].mean(1); nin = S.normal_in(mid); nin[:, 1] = 0; nin /= np.linalg.norm(nin, axis=1, keepdims=True)
    beams(rim_edges, np.full(len(mid), 1.2), np.full(len(mid), P['rim_w']), nin, nin * 2.0, 'rim')
    # nose deep beam (wall strip 1.1 x 8 mm, struts and rails folded in)
    nb = np.array([[nose_ids[i], nose_ids[i + 1]] for i in range(len(nose_ids) - 1)])
    mid = Xn[nb].mean(1); up = np.tile([0, 1.0, 0], (len(nb), 1))
    beams(nb, np.full(len(nb), 1.1 * thick + (0.25 if ribs else 0)), np.full(len(nb), 8.0), up, np.zeros((len(nb), 3)), 'nose')
    # bosses: stiff links
    for (ic, near) in bos:
        Bn = np.array([[ic, j] for j in near]); k = len(Bn)
        if k: beams(Bn, np.full(k, 4.0), np.full(k, 4.0), np.tile([0, 1.0, 0], (k, 1)), np.zeros((k, 3)), 'boss')
    # screws: boss centre -> PCB boss node (clamped joint)
    sc = np.array([[bos[i][0], pcb0 + i] for i in range(len(bos))])
    beams(sc, np.full(len(sc), 3.0), np.full(len(sc), 3.0), np.tile([1.0, 0, 0], (len(sc), 1)), np.zeros((len(sc), 3)), 'screw', Emod=60000.0)
    # PCB ties (#94): board edge node -> nearest wall node at the rib foot
    tie_b = []
    for i, t in enumerate(ties):
        pp = np.array(t['p']); j = np.argmin(np.linalg.norm(X - pp, axis=1))
        tie_b.append([pcb0 + len(boss_xz) + i, j])
    tie_b = np.array(tie_b)
    beams(tie_b, np.full(len(tie_b), 1.2), np.full(len(tie_b), 1.5), np.tile([0, 1.0, 0], (len(tie_b), 1)), np.zeros((len(tie_b), 3)), 'tie')
    return m, Xn, lat_vol, pcb0

# supports: skates -> nearest bottom-ring node
ring_nodes = np.unique(rim_edges)
def supports(Xn):
    fixed = []
    for i, (sx, sz) in enumerate(L['skates']):
        j = ring_nodes[np.argmin(np.hypot(X[ring_nodes, 0] - sx, X[ring_nodes, 2] - sz))]
        fixed.append(6 * j + 1)
        if i == 0: fixed += [6 * j, 6 * j + 2]
        if i == 3: fixed += [6 * j + 2]
    return np.array(fixed)

ztop = X[np.argmax(X[:, 1]), 2]
crown = np.array([0.0, X[:, 1].max(), ztop])
def loads(Xn, case):
    F = np.zeros(6 * len(Xn)); sel = []
    if case in ('press', 'press_off'):
        c = crown if case == 'press' else crown + np.array([7.0, 0, 6.0])
        top = np.where(np.hypot(X[:, 0] - c[0], X[:, 2] - c[2]) < 5.0)[0]; top = top[X[top, 1] > crown[1] - 4]
        F[6 * top + 1] = -10.0 / len(top); sel = [(top, np.array([0, -1.0, 0]))]
    else:
        for sg in (-1, 1):
            side = np.where((np.hypot(X[:, 1] - 15.0, X[:, 2] + 8.0) < 5.0) & (X[:, 0] * sg > 20))[0]
            F[6 * side] = -sg * 10.0 / len(side); sel.append((side, np.array([-sg, 0, 0.0])))
    return F, sel

results = {}; fields = {}
V_wall_fe = float((wall_T(X[T3].mean(1)) * np.linalg.norm(np.cross(X[T3[:, 1]] - X[T3[:, 0]], X[T3[:, 2]] - X[T3[:, 0]]), axis=1) / 2).sum())
vols = {k: json.load(open(os.path.join(WORK, f'vol_{k}.json'))) for k in ('vtri', 'vhex') if os.path.exists(os.path.join(WORK, f'vol_{k}.json'))}
tri_beam_vol = None
for kind in ('tri', 'hex', 'hex_eqbeam', 'none', 'thick'):
    thick = 1.0
    wsave = wscale_hex
    if kind == 'hex_eqbeam':      # sensitivity: hexagon walls widened until the straight-rib (beam) volume equals the triangles'
        wscale_hex = wsave * tri_beam_vol / results['hex']['lattice_beam_volume_mm3']
    if kind == 'thick':     # no ribs, wall thickened to the tri shell's total moulded mass (body)
        vf = os.path.join(WORK, 'vol_final.json')
        vt = json.load(open(vf))['tri'] if os.path.exists(vf) else vols.get('vtri')
        thick = ((vt['wall_body'] + vt['ribs_body']) / vt['wall_body']) if vt else 1.6
    m, Xn, lat_vol, pcb0 = build('tri' if kind in ('tri', 'none', 'thick') else 'hex', thick=thick, ribs=kind in ('tri', 'hex', 'hex_eqbeam'))
    if kind == 'tri': tri_beam_vol = lat_vol
    wscale_hex = wsave
    fx = supports(Xn)
    for case in ('press', 'press_off', 'squeeze'):
        F, sel = loads(Xn, case)
        U = m.solve(F, fx)
        disp = np.mean(np.concatenate([(U[6 * s[0][:, None] + np.arange(3)] * s[1]).sum(1) for s in sel]))
        k = (10.0 if case == 'press' else 10.0) / disp if disp > 0 else np.nan
        vm_wall, sm, M = m.shell_stress(U, 0); vm_pcb = m.shell_stress(U, 1)[0]
        out = dict(defl_mm=float(disp), stiffness_N_per_mm=float(k), wall_vm_max=float(vm_wall.max()), wall_vm_p99=float(np.percentile(vm_wall, 99)),
                   pcb_vm_max=float(vm_pcb.max()))
        rib_sig = None
        for b in m.beams:
            if b['tag'] == 'lattice':
                N, sig = m.beam_forces(U, b); rib_sig = sig
                out.update(rib_sig_max=float(sig.max()), rib_sig_p99=float(np.percentile(sig, 99)), rib_N_min=float(N.min()), rib_N_max=float(N.max()))
                fields[(kind, case, 'beam')] = dict(P1=Xn[b['Bn'][:, 0]] + 0, P2=Xn[b['Bn'][:, 1]] + 0, N=N, sig=sig, h=b['h'], fam=b.get('fam'))
            if b['tag'] == 'rail':
                N, sig = m.beam_forces(U, b); out.update(rail_sig_max=float(sig.max()))
                fields[(kind, case, 'rail')] = dict(P1=Xn[b['Bn'][:, 0]], P2=Xn[b['Bn'][:, 1]], N=N, sig=sig, h=b['h'])
        fields[(kind, case, 'wall')] = dict(C=X[T3].mean(1), vm=vm_wall)
        results.setdefault(kind, {})[case] = out
        results[kind]['lattice_beam_volume_mm3'] = lat_vol; results[kind]['wall_thickness_factor'] = thick
        if kind == 'hex_eqbeam': results[kind]['wscale'] = wsave * tri_beam_vol / results['hex']['lattice_beam_volume_mm3']
        print(kind, case, {k_: round(v, 3) for k_, v in out.items()})
results['meta'] = dict(fe_nodes=int(len(X)), fe_shells=int(len(T3)), crown=crown.tolist(), wscale_hex=wscale_hex, E_MPa=E, nu=NU,
                       V_wall_fe_mm3=V_wall_fe, note='derived, this model: linear stiffened-shell FE (CST+DKT shells, eccentric rib beams), CF-PP datasheet modulus')
jdump(results, os.path.join(WORK, f'fe_results{OUT}.json'))
np.savez_compressed(os.path.join(WORK, f'fe_fields{OUT}.npz'), **{'|'.join(k) + '|' + f: v for k, d_ in fields.items() for f, v in d_.items() if v is not None})
print('saved')
