"""Shared helpers for the Theseus lattice build (mm; +X = scan's side-button side, +Y up, +Z forward).

The whole pipeline is driven by one signed-distance field of the *exterior* surface (negative inside the mouse).
Everything else (inner wall, ribs, bosses, slots) is defined relative to that field, so swapping the exterior
(raw scan -> the shell builder's clean surface) only means re-running 01_exterior.py with --exterior <file>.
"""
import json, os, numpy as np
from scipy.ndimage import map_coordinates

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)                      # 3d/lattice
WORK = os.path.join(ROOT, 'work')
ASSETS = os.path.join(ROOT, 'assets')
SCAN_NPZ = '/home/claude/theseus/refs/scan/sora-normalized.npz'
os.makedirs(WORK, exist_ok=True); os.makedirs(ASSETS, exist_ok=True)

# ---------------- design parameters (one place) ----------------
P = dict(
    rho=1.01,             # g/cm^3, Mitsubishi Pyrofil PP-C-20A (deck source plabase20)
    E=13500.0,            # MPa flexural modulus, same datasheet
    nu=0.35,              # assumed for PP composites
    y_bottom=0.70,        # exterior bottom face of the shell (skates 0.65 below it)
    T_top=0.90,           # wall thickness at the crown (Protolabs PP floor 0.889)
    T_bot=1.20,           # wall thickness at the bottom rim (#93)
    T_y0=2.0, T_y1=16.0,  # grade band (height above pad) over which T goes T_bot -> T_top
    rim_t=1.30,           # bottom rim flange thickness
    rim_w=4.2,            # rim flange width along the sides (wider pads under the skates)
    a=12.5,               # triangle lattice edge (mm, along the inner surface)
    w_top=1.00, w_bot=1.20,      # rib width at the root (graded with height, #93 + Brock's flow note)
    r_top=0.60, r_bot=0.75,      # fillet radius (node + root), 1/2..3/4 of the strut (FE study)
    h_min=1.10, h_max=2.00,      # rib height above the inner wall (graded by span)
    draft_deg=1.0,               # per side
    tip_r=0.35,                  # rib tip edge radius
    gap=0.45,                    # trigger seam slot width
    pcb_y0=4.0, pcb_t=1.0,       # stand-in PCB: underside at y=4.0, 1.0 mm FR4
    insert_od=3.5, insert_len=3.0, bore_d=3.2, boss_od=6.2,   # M2 heat-set insert (parts API: od 3.5, len 3.0)
)

def smoothstep(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0.0, 1.0)
    return t * t * (3 - 2 * t)

def wall_T(p):
    """graded wall thickness at points p (N,3): thick near the rim, thin over the crown (#93)."""
    y = p[..., 1]
    k = 1.0 - smoothstep(P['T_y0'], P['T_y1'], y)       # 1 at the rim, 0 above T_y1
    return P['T_top'] + (P['T_bot'] - P['T_top']) * k

def grade(p):
    """0 at the crown .. 1 at the bottom (used for rib width / fillet radius)."""
    return 1.0 - smoothstep(P['T_y0'] + 1.0, 30.0, p[..., 1])

class Grid:
    """regular 3D scalar grid with trilinear/cubic sampling and central-difference gradients."""
    def __init__(self, A, o, h):
        self.A = np.ascontiguousarray(A, dtype=np.float32); self.o = np.asarray(o, float); self.h = float(h)
        self._g = None
    @staticmethod
    def load(path):
        d = np.load(path); return Grid(d['A'], d['o'], float(d['h']))
    def save(self, path):
        np.savez_compressed(path, A=self.A, o=self.o, h=self.h)
    def idx(self, p):
        return ((p - self.o) / self.h).T
    def __call__(self, p, order=1):
        p = np.asarray(p, float).reshape(-1, 3)
        return map_coordinates(self.A, self.idx(p), order=order, mode='nearest')
    def grad(self, p):
        if self._g is None:
            self._g = [np.gradient(self.A, self.h, axis=i).astype(np.float32) for i in range(3)]
        p = np.asarray(p, float).reshape(-1, 3); I = self.idx(p)
        return np.stack([map_coordinates(g, I, order=1, mode='nearest') for g in self._g], 1)
    def axes(self):
        n = self.A.shape
        return [self.o[i] + self.h * np.arange(n[i]) for i in range(3)]

def load_exterior_mesh(path):
    import trimesh
    if path.endswith('.npz'):
        d = np.load(path); return d['vertices'].astype(np.float64), d['faces'].astype(np.int64)
    m = trimesh.load(path, force='mesh', process=False)
    return np.asarray(m.vertices, np.float64), np.asarray(m.faces, np.int64)

def project_to_offset(ext, p, off, iters=3):
    """move points onto the iso-surface D = -off (off may be an array or a callable of p)."""
    p = np.array(p, float)
    for _ in range(iters):
        o = off(p) if callable(off) else off
        d = ext(p) + o
        g = ext.grad(p); n2 = np.maximum((g * g).sum(1), 1e-9)
        p -= (d / n2)[:, None] * g
    return p

def jdump(obj, path):
    def conv(o):
        if isinstance(o, np.ndarray): return o.tolist()
        if isinstance(o, (np.floating,)): return float(o)
        if isinstance(o, (np.integer,)): return int(o)
        raise TypeError(type(o))
    with open(path, 'w') as f: json.dump(obj, f, default=conv)
