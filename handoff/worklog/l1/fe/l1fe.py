"""L1 lattice study: the 3D stiffened-shell model of Theseus's shell body, every design at the same weight.

Model (mm, N, MPa, g): the outer skin from l1geo (shell-theseus-1seam.glb, mirrored -X half), the skin's mid-surface
t/2 inside it as flat CST + DKT facets (fem.py, the 3D lattice study's validated library: textbook plates within 0.5 %,
an eccentric ribbed strip within 0.14 %), the lattice ribs (and the rib along the crease that closes the cells) as
eccentric 3D beams on mesh edges (root on the skin's inner face, draft taken as the mean width), the rails along the
trigger opening and the cutout (1.1 x 1.5 and 1.15 x 2.0, as the 3D study), the base ledge as a 3.6 x 1.2 beam ring,
the chin (z > 54.5, round the USB-C port) as a deep beam (8 mm x t) as the 3D study's nose, supports at the 8 skates
(vertical; friction pins at two). PP-C-20A: E 13,500 MPa (flexural modulus), nu 0.35, 1.01 g/cm3.

Weight: every design is solved at the budget (9.35 g with the skates, F44.2): the skin thickness is what the budget
leaves after the fixed parts (the ledge with its pads, 4 bosses, POM skates), the rails, the ribs (their true plan union,
node overlaps removed), the root fillets and the node fillets. The rim below the crease is plain wall (F43.6).

Strength (F41.1, two strengths): use = sigma_stretch / 120 + sigma_bend / 207 per element: the skin's membrane stress
(von Mises of the CST stress) and its bending stress (von Mises of 6M/t^2); a rib's axial stress |N|/A and its bending
stress |Mz| c / Iz + |My| c / Iy, at each end. Stress concentrations at the fillets: the rib ends at a lattice node
x K_node, the skin elements on a rib's line x K_root (from the fillet studies).
"""
import numpy as np, scipy.sparse as sp, scipy.sparse.linalg as spla, json, time, os, hashlib
from shapely.geometry import LineString
from shapely.ops import unary_union
import shapely
from fem import Model, frames, cst_B, Dmat, beam_local, skew
import l1geo
from l1geo import Chart, build_mesh, to3d, quality, Y_CREASE, Y_BOT, Z_CUT, Z_NOSE, y_crease

E_PP, NU_PP, RHO = 13500.0, 0.35, 1.01e-3          # MPa, -, g/mm3
FT, FB = 120.0, 207.0                               # F41.1: stretched, bent (Pyrofil PP-C-20A datasheet)
BUDGET = 9.35                                        # g, shell + skates (F44.2)
V_LEDGE = 1437.1                                     # mm3: the body below y = 1.85 (the 1-seam GLB, measured)
V_BOSS = 4 * np.pi / 4 * (6.2 ** 2 - 3.2 ** 2) * 3.6 # mm3: four M2 bosses, OD 6.2, bore 3.2, 3.6 tall (3D study sizes)
M_SKATES = 8 * np.pi * 3.25 ** 2 * 0.65 * 1.42e-3    # g: eight POM dots, 6.5 x 0.65 mm (POM by default)
SKATES = [[13.722747420080253, 47.289462522778315], [19.972326616595975, 42.39115779229783], [17.197697612475782, -43.1797627130826],
          [10.816192897593531, -47.93493005695037], [-19.921577206128987, 42.53299289286734], [-13.491157792297805, 47.372326616595984],
          [-11.106874538944762, -47.83092250259379], [-17.398754005203866, -42.90866954968007]]
RAIL_SIDE = (1.1, 1.5); RAIL_CUT = (1.15, 2.0)
MEMBRANE = 'allman'                                  # drilling-rotation membrane (Scordelis-Lo roof: 0.97 at n = 8, CST 0.86)
OUT = '/home/claude/work/l1/out'
_CHART = None
def chart():
    global _CHART
    if _CHART is None: _CHART = Chart()
    return _CHART
NOSE_AREA = None


def nose_area():
    """outer-skin area of the chin past Z_NOSE (its mass is counted at the rim's thickness): the GLB body's volume past
    z = Z_NOSE above the ledge, over its 1.2 mm wall"""
    global NOSE_AREA
    if NOSE_AREA is None:
        f = os.path.join(OUT, 'nose_area.json')
        if os.path.exists(f): NOSE_AREA = json.load(open(f))['A']
        else:
            import trimesh
            b = trimesh.load('/home/claude/theseus/3d/shell/shell-theseus-1seam.glb', force='scene').geometry['body']
            V = b.vertices[b.faces]
            def vol_side(V, axis, c, keep_gt):
                O = np.zeros(3); O[axis] = c; tot = 0.0
                inside = (V[:, :, axis] >= c) if keep_gt else (V[:, :, axis] <= c)
                ni = inside.sum(1); full = V[ni == 3] - O
                tot += np.einsum('ij,ij->i', full[:, 0], np.cross(full[:, 1], full[:, 2])).sum() / 6
                for tri in V[(ni == 1) | (ni == 2)]:
                    out = []
                    for k in range(3):
                        P, Q = tri[k], tri[(k + 1) % 3]; pin = (P[axis] >= c) if keep_gt else (P[axis] <= c); qin = (Q[axis] >= c) if keep_gt else (Q[axis] <= c)
                        if pin: out.append(P)
                        if pin != qin: t = (c - P[axis]) / (Q[axis] - P[axis]); out.append(P + t * (Q - P))
                    out = np.array(out) - O
                    for k in range(1, len(out) - 1): tot += np.dot(out[0], np.cross(out[k], out[k + 1])) / 6
                return tot
            import trimesh as tm
            # body past the nose cut, minus its part under the ledge top (counted in V_LEDGE)
            sub = vol_side(V, 2, Z_NOSE, True)
            # the ledge part of it: approximate by the fraction of the nose's height under 1.85 (thin band): ignore, small
            NOSE_AREA = sub / 1.2
            json.dump({'A': NOSE_AREA, 'V_1p2': sub}, open(f, 'w'))
    return NOSE_AREA


# ---------------------------------------------------------------------------------------------------------------
def rib_plan_volume(mesh2, X3, zs3, edges, w, h, r_node):
    """the ribs' true volume per unit height in plan: the union of the rib (and crease-rib) strips in the developed
    (z, s) plane, node overlaps removed; and the node fillets' extra plan area (a morphological closing of radius
    r_node). Scaled from (z, s) to the surface by the ratio of the 3D to the (z, s) rib lengths."""
    lines = []
    for tg in ('rib', 'crease'):
        for a, b in edges.get(tg, []):
            lines.append(LineString([tuple(zs3[a]), tuple(zs3[b])]))
    if not lines: return 0.0, 0.0, 0.0
    L2 = sum(l.length for l in lines)
    L3 = sum(np.linalg.norm(X3[a] - X3[b]) for tg in ('rib', 'crease') for a, b in edges.get(tg, []))
    U = unary_union(lines)
    A_union = U.buffer(w / 2, cap_style='flat', join_style='mitre', mitre_limit=10).area
    A_close = U.buffer(w / 2 + r_node, cap_style='flat', join_style='round').buffer(-r_node, join_style='round').area if r_node > 0 else A_union
    sc = L3 / L2
    return A_union * sc, max(0.0, A_close - A_union) * sc, L3


def design_key(d):
    s = json.dumps(d, sort_keys=True); return hashlib.md5(s.encode()).hexdigest()[:12]


def build(d, verbose=False):
    """build the FE model of design d = dict(kind, lam, w (root width), hr (rib height above the skin), draft (deg/side),
    r_root, r_node, h (mesh size), rails (bool), t_rim_add (mm, a thicker rim than the skin), t (optional: force the skin
    thickness instead of solving the budget))"""
    ch = chart()
    assert d.get('crease', 'level') == l1geo.CREASE, ('crease model mismatch', d.get('crease', 'level'), l1geo.CREASE)
    kind, lam = d['kind'], d.get('lam', 0.3)
    hmesh = d.get('h', 1.5)
    m2 = build_mesh(ch, kind, lam, h=hmesh, rails=d.get('rails', True), phase=d.get('phase'))
    M3 = to3d(ch, m2)
    Xo, tri, edges, zs3 = M3['X'], M3['tri'], M3['edges'], M3['zs']
    N = len(Xo)
    # node normals from the mesh (area weighted, outward)
    fn = np.cross(Xo[tri[:, 1]] - Xo[tri[:, 0]], Xo[tri[:, 2]] - Xo[tri[:, 0]])
    nn = np.zeros((N, 3))
    for k in range(3): np.add.at(nn, tri[:, k], fn)
    nn /= np.linalg.norm(nn, axis=1, keepdims=True)
    A_el = 0.5 * np.linalg.norm(fn, axis=1)
    yc = Xo[tri].mean(1)[:, 1]
    zc_ = Xo[tri].mean(1)[:, 2]; above = yc > y_crease(zc_)
    A_lat, A_rim = A_el[above].sum(), A_el[~above].sum()
    A_nose = nose_area()
    # ---------- the weight budget ----------
    w, hr = d.get('w', 0.0), d.get('hr', 0.0)
    draft = np.radians(d.get('draft', 0.5))
    wm = max(w - hr * np.tan(draft), 0.05) if w > 0 else 0.0           # mean width of a drafted rib
    has_ribs = kind not in ('none', 'plain') and w > 0 and hr > 0
    if has_ribs:
        Apl, Afil, Lrib = rib_plan_volume(m2, Xo, zs3, edges, wm, hr, d.get('r_node', 0.0))
        V_ribs = Apl * hr; V_nodefil = Afil * hr
        V_rootfil = (2 - np.pi / 2) * d.get('r_root', 0.0) ** 2 * Lrib
    else:
        Apl = Afil = Lrib = 0.0; V_ribs = V_nodefil = V_rootfil = 0.0
    def rail_len(tag_w):
        e = edges.get('rail', np.zeros((0, 2), int))
        if len(e) == 0: return 0.0, 0.0
        P = Xo[e].mean(1); cut = np.abs(P[:, 2] - Z_CUT) < 0.3
        L = np.linalg.norm(Xo[e[:, 0]] - Xo[e[:, 1]], axis=1)
        return L[~cut].sum(), L[cut].sum()
    Ls, Lc = rail_len(None)
    V_rails = (Ls * RAIL_SIDE[0] * RAIL_SIDE[1] + Lc * RAIL_CUT[0] * RAIL_CUT[1]) if d.get('rails', True) else 0.0
    V_fixed = V_LEDGE + V_BOSS
    V_avail = (BUDGET - M_SKATES) / RHO - V_fixed - V_rails - V_ribs - V_nodefil - V_rootfil
    t_rim_add = d.get('t_rim_add', 0.0)
    if 't' in d: t = d['t']
    else: t = (V_avail - t_rim_add * (A_rim + A_nose)) / (A_lat + A_rim + A_nose)
    t_rim = t + t_rim_add
    mass = RHO * (V_fixed + V_rails + V_ribs + V_nodefil + V_rootfil + t * A_lat + t_rim * (A_rim + A_nose)) + M_SKATES
    info = dict(N=N, ntri=len(tri), A_lat=A_lat, A_rim=A_rim, A_nose=A_nose, t=t, t_rim=t_rim, wm=wm, Lrib=Lrib,
                V_ribs=V_ribs, V_nodefil=V_nodefil, V_rootfil=V_rootfil, V_rails=V_rails, V_fixed=V_fixed, mass=mass,
                g_ribs=RHO * (V_ribs + V_nodefil + V_rootfil), g_skin=RHO * (t * A_lat + t_rim * (A_rim + A_nose)),
                g_fixed=RHO * (V_fixed + V_rails) + M_SKATES)
    if t <= 0.05: info['infeasible'] = 'no skin left'; return None, info
    # ---------- the FE model ----------
    tn = np.where(Xo[:, 1] > y_crease(Xo[:, 2]), t, t_rim)
    Xm = Xo - nn * (tn / 2)[:, None]                 # skin mid-surface
    nodes = [Xm]
    def add_nodes(P):
        base = sum(len(q) for q in nodes); P = np.asarray(P, float).reshape(-1, 3); nodes.append(P); return list(range(base, base + len(P)))
    bnd = edges.get('bnd', np.zeros((0, 2), int))
    # nose closure: a deep beam (the chin wall, 8 mm x t_rim) across the front at mid-height
    nose_beams = []
    front = np.unique(bnd[(Xo[bnd][:, :, 2].min(1) > Z_NOSE - 0.6)].ravel()) if len(bnd) else np.array([], int)
    if len(front):
        fl = front[Xo[front, 0] < 0]; fr = front[Xo[front, 0] > 0]
        if len(fl) and len(fr):
            iL = fl[np.argmin(np.abs(Xo[fl, 1] - 5.5))]; iR = fr[np.argmin(np.abs(Xo[fr, 1] - 5.5))]
            P = Xm[iL] + (Xm[iR] - Xm[iL]) * np.linspace(0, 1, 9)[1:-1, None]; P[:, 2] = Z_NOSE + 2.5
            ch_ = [iL] + add_nodes(P) + [iR]
            nose_beams = [(ch_[k], ch_[k + 1]) for k in range(len(ch_) - 1)]
    # the base ledge: one closed ring through every node on the wall's bottom edge (boundary nodes under y 2.6), in order
    # round the footprint (angle about its centre), so it has no gaps; across the chin it spans straight
    led = np.zeros((0, 2), int); led_extra = []
    if len(bnd):
        bn = np.unique(bnd.ravel()); bn = bn[Xo[bn, 1] < 2.6]
        th = np.arctan2(Xo[bn, 0], Xo[bn, 2]); order = bn[np.argsort(th)]
        ring = np.r_[order, order[:1]]
        pairs = np.c_[ring[:-1], ring[1:]]
        Lp = np.linalg.norm(Xo[pairs[:, 0]] - Xo[pairs[:, 1]], axis=1)
        led = pairs[Lp <= 4.0 * hmesh]; led_extra = [tuple(p) for p in pairs[Lp > 4.0 * hmesh]]
    X = np.vstack(nodes)
    m = Model(X)
    t_el = np.where(above, t, t_rim)
    m.add_shells(tri, t_el, E_PP, NU_PP, membrane=MEMBRANE)
    def beams(Bn, wv, hv, up, off, tag):
        Bn = np.asarray(Bn, int)
        if len(Bn) == 0: return
        wv = np.broadcast_to(np.asarray(wv, float), (len(Bn),)).copy(); hv = np.broadcast_to(np.asarray(hv, float), (len(Bn),)).copy()
        A = wv * hv; Iz = wv * hv ** 3 / 12; Iy = hv * wv ** 3 / 12
        a_, b_ = np.maximum(wv, hv), np.minimum(wv, hv); J = a_ * b_ ** 3 * (1 / 3 - 0.21 * b_ / a_ * (1 - b_ ** 4 / (12 * a_ ** 4)))
        m.add_beams(Bn, E_PP, NU_PP, A, Iy, Iz, J, up=up, off=off, tag=tag, h=hv, w=wv)
    rib_e = np.zeros((0, 2), int)
    if has_ribs:
        rib_e = np.vstack([edges.get('rib', np.zeros((0, 2), int)), edges.get('crease', np.zeros((0, 2), int))])
        nin = -0.5 * (nn[rib_e[:, 0]] + nn[rib_e[:, 1]]); nin /= np.linalg.norm(nin, axis=1, keepdims=True)
        tm = 0.5 * (tn[rib_e[:, 0]] + tn[rib_e[:, 1]])
        beams(rib_e, wm, hr, nin, nin * (tm / 2 + hr / 2)[:, None], 'rib')
    rail_e = edges.get('rail', np.zeros((0, 2), int)) if d.get('rails', True) else np.zeros((0, 2), int)
    if len(rail_e):
        P = Xo[rail_e].mean(1); cut = np.abs(P[:, 2] - Z_CUT) < 0.3
        nin = -0.5 * (nn[rail_e[:, 0]] + nn[rail_e[:, 1]]); nin /= np.linalg.norm(nin, axis=1, keepdims=True)
        wv = np.where(cut, RAIL_CUT[0], RAIL_SIDE[0]); hv = np.where(cut, RAIL_CUT[1], RAIL_SIDE[1])
        tm = 0.5 * (tn[rail_e[:, 0]] + tn[rail_e[:, 1]])
        beams(rail_e, wv, hv, nin, nin * (tm / 2 + hv / 2)[:, None], 'rail')
    if len(led):
        hin = -0.5 * (nn[led[:, 0]] + nn[led[:, 1]]); hin[:, 1] = 0; hin /= np.linalg.norm(hin, axis=1, keepdims=True)
        off = hin * (1.8 - 0.5 * t_rim) + np.array([0, -0.6, 0.0])
        beams(led, 1.2, 3.6, hin, off, 'ledge')
    if led_extra:
        le = np.array(led_extra); dirv = X[le[:, 1]] - X[le[:, 0]]; dirv /= np.linalg.norm(dirv, axis=1, keepdims=True)
        up = np.cross(dirv, np.array([0, 1.0, 0])); up /= np.linalg.norm(up, axis=1, keepdims=True)
        beams(le, 1.2, 3.6, up, np.tile([0, -0.6, 0.0], (len(le), 1)), 'ledge')
    info['led_long'] = [round(float(np.linalg.norm(Xo[p] - Xo[q])), 1) for p, q in led_extra]
    if nose_beams:
        nb = np.array(nose_beams)
        beams(nb, max(t_rim, 0.3), 8.0, np.tile([0, 1.0, 0], (len(nb), 1)), np.zeros((len(nb), 3)), 'nose')
    info.update(n_ledge=len(led), n_ledge_extra=len(led_extra), n_nose=len(nose_beams), n_rib=len(rib_e), n_rail=len(rail_e))
    # nodes of the chin's deep-beam chain lie on x = 0 near the middle: the nose pin can use them
    model = dict(m=m, X=X, Xo=Xo, nn=nn, tri=tri, A_el=A_el, above=above, t_el=t_el, tn=tn, rib_e=rib_e, led=led,
                 edges=edges, zs=zs3, N=N, info=info, d=d, ring_extra=[q for pr in nose_beams for q in pr] + [q for pr in led_extra for q in pr])
    return model, info


# ---------------------------------------------------------------------------------------------------------------
def nodal_area(Xo, tri, A_el):
    a = np.zeros(len(Xo))
    for k in range(3): np.add.at(a, tri[:, k], A_el / 3)
    return a


def crown_point(model):
    """the hump's top on the midline (outer skin), from the chart"""
    ch = chart(); zz = np.linspace(-40, 0, 401); P = ch.P(zz, np.zeros_like(zz)); return P[np.argmax(P[:, 1])].copy()

def skin_point(z, x=None, y=None, side=-1):
    """the outer-skin point of section z where x (or y) takes a value, on side -1 (-X, s > 0) or +1"""
    ch = chart(); ss = np.linspace(0, ch.bnd('s_bot', z), 2000); P = ch.P(np.full_like(ss, z), ss)
    k = np.argmin(np.abs(P[:, 0] - x)) if x is not None else np.argmin(np.abs(P[:, 1] - y) + 100 * (P[:, 1] < 0))
    p = P[k].copy(); p[0] *= (-1 if side == 1 else 1) if x is None else 1
    return p


def pad_load(model, c, r, F, direction, area_w=None):
    """F newtons spread over the outer skin within r of point c (3D distance), weighted by nodal area, along direction"""
    Xo = model['Xo']; nA = model['nodalA']
    sel = np.where(np.linalg.norm(Xo - c, axis=1) < r)[0]
    if len(sel) == 0: sel = np.array([np.argmin(np.linalg.norm(Xo - c, axis=1))])
    wgt = nA[sel] / nA[sel].sum()
    Fv = np.zeros(6 * len(model['X']))
    for q in range(3): Fv[6 * sel + q] += F * wgt * direction[q]
    return Fv, sel, wgt


def supports(model):
    Xo, led = model['Xo'], model['led']
    ring = np.unique(led.ravel()) if len(led) else np.arange(len(Xo))
    fixed = []
    for i, (sx, sz) in enumerate(SKATES):
        dd = np.hypot(Xo[ring, 0] - sx, Xo[ring, 2] - sz)
        j = ring[np.argmin(dd)]                 # one node per skate (the same support at any mesh size)
        fixed += [6 * j + 1]
    # in-plane: a minimal set on the symmetry plane, so a symmetric squeeze meets no reaction: x at the ring's nodes
    # nearest x = 0 at the tail and at the chin, z at the tail
    X = model['X']; allring = np.unique(np.r_[ring, np.array(model.get('ring_extra', []), int)])
    tail = allring[X[allring, 2] < 0]; nose = allring[X[allring, 2] > 0]
    jt = tail[np.argmin(np.abs(X[tail, 0]) + 0.01 * np.abs(X[tail, 2] + 60))]
    jn = nose[np.argmin(np.abs(X[nose, 0]) + 0.01 * np.abs(X[nose, 2] - 60))]
    fixed += [6 * jt, 6 * jt + 2, 6 * jn]
    model['pins'] = (int(jt), int(jn))
    return np.array(sorted(set(fixed)))


def assemble(m):
    n = 6 * m.N
    K = sp.csr_matrix((np.concatenate(m.vals), (np.concatenate(m.rows), np.concatenate(m.cols))), shape=(n, n))
    return K


def solve_cases(model, cases):
    """cases: dict name -> F vector. Factorises K once."""
    m = model['m']; K = assemble(m).tocsc()
    fixed = supports(model)
    n = K.shape[0]
    diag = np.abs(K.diagonal()); free = np.ones(n, bool); free[fixed] = False; free &= diag > 1e-12 * diag.max()
    Kf = K[free][:, free].tocsc()
    lu = spla.splu(Kf, permc_spec='COLAMD')
    out = {}
    for name, F in cases.items():
        U = np.zeros(n); U[free] = lu.solve(F[free]); out[name] = U
    model['free'] = free; model['K'] = K; model['lu'] = lu
    return out


def beam_split(m, U, b):
    """axial and bending stress (MPa) at both ends of every beam of group b: arrays (n, 2) each"""
    ue = U[b['dofs']]; ul = np.einsum('nij,nj->ni', b['TT'], ue)
    f = np.einsum('nij,nj->ni', b['Kl'], ul)
    sa = np.zeros((len(ue), 2)); sb = np.zeros((len(ue), 2)); Nax = np.zeros(len(ue))
    for k, (end, sgn) in enumerate(((0, -1), (6, 1))):
        Nn = sgn * f[:, end]; My = sgn * f[:, end + 4]; Mz = sgn * f[:, end + 5]
        sa[:, k] = np.abs(Nn) / b['A']
        sb[:, k] = np.abs(Mz) * (b['h'] / 2) / b['Iz'] + np.abs(My) * (b['w'] / 2) / b['Iy']
        if k == 1: Nax = Nn
    # tip compression for tripping: the stress at the rib's free tip (bending about the skin-parallel axis) + axial
    return sa, sb, Nax, f


def membrane_stress(s, ul):
    x = s['xy'][..., 0]; y = s['xy'][..., 1]; D = Dmat(s['E'], s['nu'])
    if s.get('membrane') == 'allman':
        import fem as _f
        T = _f.allman_T(x, y); B, _ = _f.lst_B(x, y, 1 / 3, 1 / 3, 1 / 3)
        ua = ul[:, [0, 1, 5, 6, 7, 11, 12, 13, 17]]
        return np.einsum('ij,njk,nkl,nl->ni', D, B, T, ua)
    Bm, _ = cst_B(x, y); um = ul[:, [0, 1, 6, 7, 12, 13]]
    return np.einsum('ij,njk,nk->ni', D, Bm, um)


def shell_split(m, U, g=0):
    s = m.shell_groups[g]; ue = U[s['dofs']]
    ul = np.einsum('nij,nj->ni', s['Tm'], ue)
    x = s['xy'][..., 0]; y = s['xy'][..., 1]
    D = Dmat(s['E'], s['nu'])
    sm = membrane_stress(s, ul)                                    # membrane stress at the centroid
    from fem import dkt_B
    Bb, _ = dkt_B(x, y, 1 / 3, 1 / 3); ub = ul[:, [2, 3, 4, 8, 9, 10, 14, 15, 16]]
    kap = np.einsum('nij,nj->ni', Bb, ub)
    M = np.einsum('ij,nj->ni', D, kap) * (s['t'] ** 3 / 12)[:, None]
    sbend = 6 * M / (s['t'] ** 2)[:, None]
    vm = lambda q: np.sqrt(q[:, 0] ** 2 - q[:, 0] * q[:, 1] + q[:, 1] ** 2 + 3 * q[:, 2] ** 2)
    return vm(sm), vm(sbend), sm


def evaluate(model, K_node=1.0, K_root=1.0, buckle=False, verbose=False):
    """all load cases; returns a dict of results"""
    t0 = time.time()
    model['nodalA'] = nodal_area(model['Xo'], model['tri'], model['A_el'])
    Xo = model['Xo']; d = model['d']
    c = crown_point(model)
    dn = np.array([0, -1.0, 0])
    cases = {}; pads = {}
    F, sel, wg = pad_load(model, c, 5.0, 10.0, dn); cases['crown'] = F; pads['crown'] = (sel, wg, dn)
    # the worst press position near the crown: a 5 x 5 grid at 3 mm on the crown's tangent plane, projected to the skin
    k = 0
    for ix in (-6, -3, 0, 3, 6):
        for iz in (-6, -3, 0, 3, 6):
            q = chart().P(np.array([c[2] + iz]), np.array([-ix]))[0]       # s ~ -x on the crown (s > 0 is -X)
            F, sel, wg = pad_load(model, q, 5.0, 10.0, dn); cases[f'grid{k}'] = F; pads[f'grid{k}'] = (sel, wg, dn); k += 1
    po = skin_point(c[2] + 6.0, x=-7.0)
    F, sel, wg = pad_load(model, po, 5.0, 10.0, dn); cases['off'] = F; pads['off'] = (sel, wg, dn)
    # the resting hand: 4.4 N over the rear hump (z from the crown - 30 to the crown + 5, |x| < 22, y > 20), by area
    selp = np.where((Xo[:, 2] > c[2] - 30) & (Xo[:, 2] < c[2] + 5) & (np.abs(Xo[:, 0]) < 22) & (Xo[:, 1] > 20))[0]
    wgp = model['nodalA'][selp] / model['nodalA'][selp].sum()
    F = np.zeros(6 * len(model['X'])); F[6 * selp + 1] = -4.4 * wgp; cases['palm'] = F; pads['palm'] = (selp, wgp, dn)
    # the squeeze: 10 N in on each side at the grip (y 15, z -8), a 10 mm pad on each side wall
    F = np.zeros(6 * len(model['X'])); sq = []
    for sg in (-1, 1):
        pq = skin_point(-8.0, y=15.0); pq[0] = sg * abs(pq[0])
        Fs, sel, wg = pad_load(model, pq, 5.0, 10.0, np.array([-sg, 0, 0.0])); F += Fs; sq.append((sel, wg, np.array([-sg, 0, 0.0])))
    cases['squeeze'] = F; pads['squeeze'] = sq
    U = solve_cases(model, cases)
    t1 = time.time()
    def defl(name):
        p = pads[name]; u = U[name]
        if name == 'squeeze':
            return float(np.mean([(np.stack([u[6 * s + q] for q in range(3)], 1) @ dv * w).sum() for s, w, dv in p]))
        s, w, dv = p; return float((np.stack([u[6 * s + q] for q in range(3)], 1) @ dv * w).sum())
    res = dict(d=d, info=model['info'], crown=c.tolist())
    for name in ['crown', 'off', 'palm', 'squeeze']: res[name] = dict(defl=defl(name))
    gd = [defl(f'grid{k}') for k in range(25)]
    res['grid'] = dict(defl=gd, worst=max(gd), worst_i=int(np.argmax(gd)))
    # strength (F41.1) per case
    m = model['m']
    rib_groups = [b for b in m.beams if b['tag'] == 'rib']
    # lattice nodes: rib edge ends where 3+ rib edges meet (the fillet's SCF applies there)
    deg = np.zeros(len(model['X']), int)
    if len(model['rib_e']): np.add.at(deg, model['rib_e'].ravel(), 1)
    rib_line_nodes = set(np.unique(model['rib_e'].ravel()).tolist()) if len(model['rib_e']) else set()
    sk_on_rib = np.array([any(int(v) in rib_line_nodes for v in tr) for tr in model['tri']]) if rib_line_nodes else np.zeros(len(model['tri']), bool)
    amin, _ = quality(model['Xo'], model['tri']); okq = amin >= 12.0           # peaks over well-shaped elements only
    res['mesh'] = dict(n_sliver=int((~okq).sum()), sliver_area=float(model['A_el'][~okq].sum()), minang_p1=float(np.percentile(amin, 1)))
    for name in ['crown', 'off', 'palm', 'squeeze', f"grid{res['grid']['worst_i']}"]:
        u = U[name]
        vms, vbs, _ = shell_split(m, u, 0)
        use_sk = vms / FT + vbs / FB
        use_sk_k = np.where(sk_on_rib, use_sk * K_root, use_sk)
        ih = int(np.argmax(np.where(okq, use_sk_k, -1)))
        out = dict(skin_use=float(use_sk[okq].max()), skin_use_p99=float(np.percentile(use_sk, 99)), skin_use_scf=float(use_sk_k[okq].max()),
                   skin_vm_mem=float(vms[okq].max()), skin_vm_bend=float(vbs[okq].max()), skin_use_all=float(use_sk.max()),
                   skin_hot=model['Xo'][model['tri'][ih]].mean(0).round(2).tolist(), skin_hot_onrib=bool(sk_on_rib[ih]))
        if rib_groups:
            b = rib_groups[0]; sa, sb, Nax, f = beam_split(m, u, b)
            use_r = sa / FT + sb / FB
            ends = b['Bn']; atnode = deg[ends] >= 3
            use_rk = np.where(atnode, use_r * K_node, use_r)
            out.update(rib_use=float(use_r.max()), rib_use_p99=float(np.percentile(use_r, 99)), rib_use_scf=float(use_rk.max()),
                       rib_sa=float(sa.max()), rib_sb=float(sb.max()))
            # tripping: compressive stress at the rib's free tip vs a plate strip, root hinged, tip free (k = 0.425)
            hr = b['h']; wv = b['w']
            sig_cr = 0.425 * np.pi ** 2 * E_PP / (12 * (1 - NU_PP ** 2)) * (wv / hr) ** 2
            # tip stress: bending about the skin-parallel axis (Mz in local, up = rib height) + axial, compressive part
            Mz = np.stack([-f[:, 5], f[:, 11]], 1); Nn = np.stack([-f[:, 0], f[:, 6]], 1)
            tip = Nn / b['A'][:, None] - Mz * (hr / 2)[:, None] / b['Iz'][:, None]       # sign: + tension at the tip
            comp = np.maximum(0, -tip).max(1)
            with np.errstate(divide='ignore'):
                trip = np.where(comp > 1e-9, sig_cr / comp, np.inf)
            out['trip_factor'] = float(trip.min())
        rl = [b for b in m.beams if b['tag'] == 'rail']
        if rl:
            sa, sb, _, _ = beam_split(m, u, rl[0]); out['rail_use'] = float((sa / FT + sb / FB).max())
        # zones: the lattice field (above the crease, 3 mm clear of the crease and of the opening's corners), the crease
        # transition (skin within 2 mm of the crease), the opening's corners (within 6 mm of the rear cutout's ends:
        # S1 is reshaping them, F43.2), the rest
        C = model['Xo'][model['tri']].mean(1)
        corner = (np.abs(C[:, 2] - Z_CUT) < 6) & (np.abs(np.abs(C[:, 0]) - 24.6) < 6) & (C[:, 1] > 24)
        ycr_ = y_crease(C[:, 2]); crease = np.abs(C[:, 1] - ycr_) < 2.0
        field = (C[:, 1] > ycr_ + 3) & ~corner
        for zn, msk in (('field', field), ('crease', crease), ('corner', corner)):
            mm = msk & okq
            out['skin_use_' + zn] = float(use_sk[mm].max()) if mm.any() else 0.0
        res.setdefault('use', {})[name] = out
    res['time'] = dict(solve=t1 - t0, total=time.time() - t0)
    if buckle:
        res['buckle'] = {}
        for name in ['crown', 'squeeze']:
            res['buckle'][name] = buckling(model, U[name])
    return res, U


# ---------------------------------------------------------------------------------------------------------------
def geometric_stiffness(model, U):
    """K_G for the membrane stresses of the shells (u, v, w of each node) and the axial forces of the beams"""
    m = model['m']; rows, cols, vals = [], [], []
    for s in m.shell_groups:
        ue = U[s['dofs']]; ul = np.einsum('nij,nj->ni', s['Tm'], ue)
        x = s['xy'][..., 0]; y = s['xy'][..., 1]
        D = Dmat(s['E'], s['nu']); Bm, A2 = cst_B(x, y)
        sm = membrane_stress(s, ul); Nres = sm * s['t'][:, None]   # Nx, Ny, Nxy per element
        A = np.abs(A2) / 2
        x1, x2, x3 = x[:, 0], x[:, 1], x[:, 2]; y1, y2, y3 = y[:, 0], y[:, 1], y[:, 2]
        dNdx = np.stack([y2 - y3, y3 - y1, y1 - y2], 1) / A2[:, None]; dNdy = np.stack([x3 - x2, x1 - x3, x2 - x1], 1) / A2[:, None]
        G = np.stack([dNdx, dNdy], 1)                               # (n, 2, 3)
        S = np.stack([np.stack([Nres[:, 0], Nres[:, 2]], 1), np.stack([Nres[:, 2], Nres[:, 1]], 1)], 1)
        kg3 = np.einsum('nai,nab,nbj->nij', G, S, G) * A[:, None, None]   # (n, 3, 3) for one translation component
        KGl = np.zeros((len(x), 18, 18))
        for comp in range(3):
            idx = np.array([comp, 6 + comp, 12 + comp])
            KGl[:, idx[:, None], idx[None, :]] += kg3
        KGg = np.einsum('nji,njk,nkl->nil', s['Tm'], KGl, s['Tm'])
        d_ = s['dofs']; r = np.repeat(d_[:, :, None], 18, 2); c = np.repeat(d_[:, None, :], 18, 1)
        rows.append(r.ravel()); cols.append(c.ravel()); vals.append(KGg.ravel())
    for b in m.beams:
        ue = U[b['dofs']]; ul = np.einsum('nij,nj->ni', b['TT'], ue); f = np.einsum('nij,nj->ni', b['Kl'], ul)
        Nn = f[:, 6]; L = b['L']; q = Nn / L
        KGl = np.zeros((len(L), 12, 12))
        def put(i, j, v): KGl[:, i, j] += v
        # v - rz plane and w - ry plane, consistent cubic
        for (dv, dr, sgn) in ((1, 5, 1), (2, 4, -1)):
            a1, b1, a2, b2 = dv, dr, 6 + dv, 6 + dr
            put(a1, a1, 6 / 5 * q); put(a2, a2, 6 / 5 * q); put(a1, a2, -6 / 5 * q); put(a2, a1, -6 / 5 * q)
            put(a1, b1, sgn * L / 10 * q); put(b1, a1, sgn * L / 10 * q); put(a1, b2, sgn * L / 10 * q); put(b2, a1, sgn * L / 10 * q)
            put(a2, b1, -sgn * L / 10 * q); put(b1, a2, -sgn * L / 10 * q); put(a2, b2, -sgn * L / 10 * q); put(b2, a2, -sgn * L / 10 * q)
            put(b1, b1, 2 * L * L / 15 * q); put(b2, b2, 2 * L * L / 15 * q); put(b1, b2, -L * L / 30 * q); put(b2, b1, -L * L / 30 * q)
        KGg = np.einsum('nji,njk,nkl->nil', b['TT'], KGl, b['TT'])
        d_ = b['dofs']; r = np.repeat(d_[:, :, None], 12, 2); c = np.repeat(d_[:, None, :], 12, 1)
        rows.append(r.ravel()); cols.append(c.ravel()); vals.append(KGg.ravel())
    n = 6 * m.N
    return sp.csr_matrix((np.concatenate(vals), (np.concatenate(rows), np.concatenate(cols))), shape=(n, n))


def buckling(model, U, k=3):
    """linear eigen-buckling: the smallest load factor lambda with (K + lambda K_G) phi = 0. Solved as the symmetric
    generalised problem K_G phi = mu K phi (K positive definite after the supports), lambda = -1 / mu_min"""
    KG = geometric_stiffness(model, U)
    free = model['free']; K = model['K']
    Kf = K[free][:, free].tocsc(); Gf = KG[free][:, free].tocsc()
    lu = model['lu']
    Minv = spla.LinearOperator(Kf.shape, matvec=lambda x: lu.solve(np.asarray(x, float)), dtype=float)
    try:
        vals = spla.eigsh(Gf, k=k, M=Kf, Minv=Minv, which='SA', return_eigenvectors=False, maxiter=5000, tol=1e-6)
        mu = float(np.min(vals))
        lam = -1.0 / mu if mu < 0 else float('inf')
    except Exception as e:
        print('buckling failed', e); lam = float('nan')
    return float(lam)
