"""The solid as one signed-distance field (negative inside), evaluated on demand.

  wall      = {-T(p) <= D(p) <= 0}                     D: exterior SDF, T: graded thickness (#93)
  ribs      = swept profile around each member's surface polyline: width w (draft 1 deg/side), height h, tip radius
  fillets   = hg_sdf round union: between rib families (node fillets) and between ribs and wall (root fillets),
              radius r(p) = 0.60 .. 0.75 mm (1/2 .. 3/4 of the strut, from the deck's FE fillet study)
  bosses    = vertical cylinders on the arch feet, round-unioned, with M2 heat-set insert bores
  cuts      = trigger seam slot, centre split + wheel slot (triggers), USB-C port, bottom opening (rim flange stays),
              all with 0.2 mm edge breaks (no knife edges on a moulded part)
"""
import json, numpy as np
from scipy.spatial import cKDTree
from scipy.ndimage import map_coordinates, distance_transform_edt, gaussian_filter, binary_opening, binary_closing
from common import *
from geom import *

def ru(a, b, r):
    """round union (hg_sdf fOpUnionRound): exact circular fillet of radius r between perpendicular surfaces"""
    ua = np.maximum(r - a, 0.0); ub = np.maximum(r - b, 0.0)
    return np.maximum(r, np.minimum(a, b)) - np.sqrt(ua * ua + ub * ub)

def ri(a, b, r):
    """round intersection"""
    ua = np.maximum(r + a, 0.0); ub = np.maximum(r + b, 0.0)
    return np.minimum(-r, np.maximum(a, b)) + np.sqrt(ua * ua + ub * ub)

def rounded_rect2(px, py, hx, hy, rr):
    qx = np.abs(px) - (hx - rr); qy = np.abs(py) - (hy - rr)
    return np.sqrt(np.maximum(qx, 0) ** 2 + np.maximum(qy, 0) ** 2) + np.minimum(np.maximum(qx, qy), 0) - rr

class Field:
    def __init__(self, kind='tri', wscale=1.0, families=None):
        self.S = Shell(); self.ext = self.S.ext
        self.L = json.load(open(os.path.join(WORK, 'layout.json')))
        d = np.load(os.path.join(WORK, f'members_{kind}.npz'))
        self.Q, self.mid, self.at = d['Q'], d['mid'], d['at'].copy()
        self.meta = json.loads(str(d['meta']))
        # equal-mass knob: scale the lattice ribs' width (not rails/struts)
        lat = np.isin(self.at[:, 3], [0, 1, 2]) & (self.at[:, 4] > 0)
        self.at[lat, 1] *= wscale
        self.fams = []
        for f in range(5):
            sel = np.where(self.at[:, 3] == f)[0]
            if len(sel) == 0: continue
            self.fams.append(dict(f=f, idx=sel, tree=cKDTree(self.Q[sel])))
        self.hmax = float(self.at[:, 0].max())
        self.tan_d = np.tan(np.radians(P['draft_deg']))
        self._opening()
        self.grad = [np.gradient(self.ext.A, self.ext.h, axis=i).astype(np.float32) for i in range(3)]

    # ---- bottom opening (2D) ----
    def _opening(self):
        h2 = 0.1
        xs = np.arange(-33, 33.001, h2); zs = np.arange(-62, 62.001, h2)
        Xg, Zg = np.meshgrid(xs, zs, indexing='ij')
        from matplotlib.path import Path
        ol = np.array(self.L['outline_bottom'])                       # true outer contour (marched inward from outside)
        foot = Path(ol).contains_points(np.c_[Xg.ravel(), Zg.ravel()]).reshape(Xg.shape)
        dist_in = distance_transform_edt(foot) * h2
        O = dist_in > P['rim_w']
        for sx, sz in self.L['skates']:
            O &= (Xg - sx) ** 2 + (Zg - sz) ** 2 > (3.25 + 1.45) ** 2
        k = int(1.5 / h2); yy, xx = np.mgrid[-k:k + 1, -k:k + 1]; disk = xx * xx + yy * yy <= k * k
        O = binary_closing(binary_opening(O, disk), disk)
        sd = (distance_transform_edt(~O) - distance_transform_edt(O)) * h2     # <0 inside the opening
        self.open2 = Grid(gaussian_filter(sd, 1.0)[:, None, :].repeat(2, 1), np.array([xs[0], -100.0, zs[0]]), h2)
        self.open_mask = O; self.open_axes = (xs, zs)

    def open_sdf(self, p):
        q = p.copy(); q[:, 1] = -100.0
        return self.open2(q)

    # ---- the field ----
    def eval(self, p, want_parts=False, ribs=True):
        p = np.asarray(p, float); n = len(p)
        I = self.ext.idx(p)
        D = map_coordinates(self.ext.A, I, order=1, mode='nearest')
        G = np.stack([map_coordinates(g, I, order=1, mode='nearest') for g in self.grad], 1)
        nin = -G / np.maximum(np.linalg.norm(G, axis=1, keepdims=True), 1e-9)
        T = wall_T(p); eta = -(D + T)
        f_wall = np.maximum(D, eta)
        # bottom opening: keep the rim flange. The prism runs up to y = 8 so the scan's floor recesses (sensor window
        # etc., offset into bumps) go too; the walls flare outward above the bottom contour, bosses/ribs are added after.
        yc = 8.0
        f_op = np.maximum(self.open_sdf(p), p[:, 1] - yc)
        f_wall = ri(f_wall, -f_op, 0.25)
        rr = P['r_top'] + (P['r_bot'] - P['r_top']) * grade(p)
        # ribs
        f_rib = np.full(n, 1e3); near = (eta > -0.8) & (eta < self.hmax + 0.6) & ribs
        memb = np.full(n, -1); ell_best = np.full(n, 1e3)
        if near.any():
            ii = np.where(near)[0]
            ps = p[ii] - eta[ii, None] * nin[ii]
            first = True
            for F in self.fams:
                dd, kk = F['tree'].query(ps, k=1, distance_upper_bound=2.6)
                ok = np.isfinite(dd)
                fF = np.full(len(ii), 1e3)
                if ok.any():
                    jj = F['idx'][kk[ok]]                        # global sample index
                    q = ps[ok]
                    best = np.full(len(jj), 1e9)
                    for o in (-1, 1):
                        j2 = np.clip(jj + o, 0, len(self.Q) - 1)
                        same = self.mid[j2] == self.mid[jj]
                        a_ = self.Q[jj]; b_ = self.Q[j2]; ab = b_ - a_
                        t = np.clip(((q - a_) * ab).sum(1) / np.maximum((ab * ab).sum(1), 1e-12), 0, 1)
                        dseg = np.linalg.norm(q - (a_ + t[:, None] * ab), axis=1)
                        dseg = np.where(same, dseg, np.linalg.norm(q - a_, axis=1))
                        best = np.minimum(best, dseg)
                    h, w = self.at[jj, 0], self.at[jj, 1]
                    e = eta[ii][ok]
                    hw = w / 2 - np.maximum(e, 0) * self.tan_d
                    rt = np.minimum(P['tip_r'], hw * 0.9)
                    qx = best - (hw - rt); qy = e - (h - rt)
                    prof = np.sqrt(np.maximum(qx, 0) ** 2 + np.maximum(qy, 0) ** 2) + np.minimum(np.maximum(qx, qy), 0) - rt
                    fF[ok] = prof
                    # remember the nearest member (for per-vertex attributes)
                    cur = ell_best[ii[ok]]; better = best < cur
                    sel = ii[ok][better]; ell_best[sel] = best[better]; memb[sel] = self.mid[jj[better]]
                f_rib[ii] = fF if first else ru(f_rib[ii], fF, rr[ii])
                first = False
            f_rib = np.maximum(f_rib, D)          # never through the outer skin
        f = ru(f_wall, f_rib, rr)
        # bosses (#54/#101): on the arch feet, filleted into wall and ribs
        for b in self.L['bosses']:
            dx = p[:, 0] - b['x']; dz = p[:, 2] - b['z']; rho = np.sqrt(dx * dx + dz * dz)
            if not (rho < b['od'] / 2 + 2.5).any(): continue
            cy = 0.5 * (b['y0'] + b['y1']); hy = 0.5 * (b['y1'] - b['y0'])
            fb = ri(rho - b['od'] / 2, np.abs(p[:, 1] - cy) - hy, 0.6)      # cylinder, 0.6 mm edge rounds
            fb = np.maximum(fb, D)
            f = ru(f, fb, 0.6)
        # ---- cuts ----
        ts = trig_sdf(p)
        f = ri(f, -(np.abs(ts) - P['gap'] / 2), 0.15)                     # trigger seam slot
        cg = SEAM['center_gap'] / 2
        f = ri(f, -np.maximum(np.abs(p[:, 0]) - cg, ts + 0.05), 0.12)     # centre split (triggers only)
        wv = self.L['wheel']
        fw = np.maximum(rounded_rect2(p[:, 0], p[:, 2] - 0.5 * (wv['z0'] + wv['z1']), wv['hw'], 0.5 * (wv['z1'] - wv['z0']), 2.0), ts + 0.05)
        f = ri(f, -fw, 0.2)                                                # wheel slot
        u = self.L['usb']
        fu = np.maximum(rounded_rect2(p[:, 0] - u['cx'], p[:, 1] - u['cy'], u['w'] / 2, u['h'] / 2, u['r']), 50.0 - p[:, 2])
        f = ri(f, -fu, 0.2)                                                # USB-C port
        for b in self.L['bosses']:                                         # insert bores, open at the bottom
            rho = np.sqrt((p[:, 0] - b['x']) ** 2 + (p[:, 2] - b['z']) ** 2)
            fbore = np.maximum(rho - b['bore'] / 2 - np.maximum(0, 0.35 - (p[:, 1] - b['y0'])), p[:, 1] - (b['y0'] + b['bore_depth']))
            f = ri(f, -fbore, 0.1)
        if want_parts:
            return f, dict(D=D, eta=eta, nin=nin, memb=memb, ts=ts)
        return f
