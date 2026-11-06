"""A review sheet in the deck's line style (paper theme): Apple light-grey paper with the deck's 40 px grid, the mouse as a
white body with a near-black outline, key lines at half strength, Theseus's blue for proposals, red for what Brock
rejected, Inter / Inter Display type. Panels are drawn in mm at an exact px-per-mm scale (true scale)."""
import numpy as np
import matplotlib; matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib import font_manager as fm
from matplotlib.patches import Polygon as MPoly, PathPatch
from matplotlib.path import Path

for f in ['/usr/share/fonts/opentype/inter/Inter-Regular.otf', '/usr/share/fonts/opentype/inter/Inter-SemiBold.otf',
          '/usr/share/fonts/opentype/inter/Inter-Bold.otf', '/usr/share/fonts/opentype/inter/Inter-Medium.otf',
          '/usr/share/fonts/opentype/inter/InterDisplay-Bold.otf', '/usr/share/fonts/opentype/inter/InterDisplay-ExtraBold.otf',
          '/usr/share/fonts/opentype/inter/InterDisplay-Medium.otf', '/usr/share/fonts/opentype/inter/InterDisplay-SemiBold.otf']:
    try: fm.fontManager.addfont(f)
    except Exception: pass

PAPER = '#F5F5F7'; INK = '#111111'; INK2 = '#2E2E30'; MUTE = '#66666B'; FAINT = '#8A8A8F'; HAIR = '#DCDCE0'; TRACK = '#E8E8EB'
PANEL = '#FFFFFF'; COMP = '#B8B8BC'; COMP2 = '#D3D3D7'; HERO = '#0A6CFF'; HERO_T = '#0058D6'; SECOND = '#E3A800'; RED = '#E5484D'
VIOLET = '#5B4FE0'
PX = 0.72          # points per px at dpi 100


class Sheet:
    def __init__(self, W, H, grid=True):
        self.W, self.H = W, H
        self.fig = plt.figure(figsize=(W / 100, H / 100), dpi=100)
        self.fig.patch.set_facecolor(PAPER)
        self.bg = self.fig.add_axes([0, 0, 1, 1]); self.bg.set_xlim(0, W); self.bg.set_ylim(H, 0); self.bg.axis('off')
        # type goes on an overlay above every panel (a panel's white body would hide it otherwise)
        self.ov = self.fig.add_axes([0, 0, 1, 1], label='overlay'); self.ov.set_xlim(0, W); self.ov.set_ylim(H, 0); self.ov.axis('off')
        self.ov.set_zorder(100); self.ov.patch.set_alpha(0)
        if grid:
            for x in range(0, W, 40): self.bg.plot([x, x], [0, H], color=INK, alpha=0.035, lw=0.72, zorder=0)
            for y in range(0, H, 40): self.bg.plot([0, W], [y, y], color=INK, alpha=0.035, lw=0.72, zorder=0)
            for x in range(0, W, 160):
                for y in range(0, H, 160):
                    self.bg.plot([x - 6, x + 6], [y, y], color=INK, alpha=0.22, lw=0.9, zorder=0)
                    self.bg.plot([x, x], [y - 6, y + 6], color=INK, alpha=0.22, lw=0.9, zorder=0)

    def text(self, x, y, s, size=22, weight=600, color=INK, font='Inter', ha='left', va='baseline', caps=False, track=0.0, alpha=1, z=20, **k):
        if caps: s = s.upper()
        return self.ov.text(x, y, s, fontsize=size * PX, fontweight=weight, color=color, family=font, ha=ha, va=va, alpha=alpha, zorder=z, **k)

    def title(self, x, y, s, size=44, color=INK):
        return self.text(x, y, s, size=size, weight=800, font='Inter Display', caps=True, color=color)

    def label(self, x, y, s, size=20, color=MUTE, **k):
        return self.text(x, y, s, size=size, weight=700, caps=True, color=color, **k)

    def card(self, x, y, w, h, color=PANEL, edge=None, alpha=1):
        self.bg.add_patch(plt.Rectangle((x, y), w, h, facecolor=color, edgecolor=edge or 'none', lw=1 * PX, alpha=alpha, zorder=1))

    def rule(self, x0, y0, x1, y1, color=HAIR, w=1.5, **k):
        self.bg.plot([x0, x1], [y0, y1], color=color, lw=w * PX, zorder=2, **k)

    def panel(self, x, y, w, h, cx, cy, s, frame=False):
        """an axes at stage px (x, y, w, h), drawing in mm: (cx, cy) mm at the panel's centre, s px per mm, y down"""
        ax = self.fig.add_axes([x / self.W, 1 - (y + h) / self.H, w / self.W, h / self.H])
        ax.set_xlim(cx - w / 2 / s, cx + w / 2 / s); ax.set_ylim(cy + h / 2 / s, cy - h / 2 / s)
        ax.set_aspect('equal'); ax.axis('off'); ax.patch.set_alpha(0)
        ax.s = s; ax.px = (x, y, w, h); ax.c = (cx, cy)
        if frame: self.bg.add_patch(plt.Rectangle((x, y), w, h, facecolor='none', edgecolor=HAIR, lw=1.5 * PX, zorder=3))
        return ax

    def to_px(self, ax, u, v):
        x, y, w, h = ax.px; cx, cy = ax.c
        return x + w / 2 + (u - cx) * ax.s, y + h / 2 + (v - cy) * ax.s

    def save(self, fn):
        self.fig.savefig(fn, dpi=100, facecolor=PAPER)
        plt.close(self.fig)


def line(ax, P, w=1.3, color=INK, alpha=1.0, dash=None, z=5, cap='round', closed=False):
    P = np.asarray(P, float)
    if closed: P = np.vstack([P, P[:1]])
    ls = '-' if dash is None else (0, tuple(d / w for d in dash))
    return ax.plot(P[:, 0], P[:, 1], color=color, lw=w * PX, alpha=alpha, linestyle=ls, zorder=z, solid_capstyle=cap, solid_joinstyle='round', dash_capstyle='butt')


def fill(ax, P, color=PANEL, alpha=1.0, z=2, holes=()):
    P = np.asarray(P, float)
    verts = [P, *[np.asarray(h, float) for h in holes]]
    codes = []
    allv = []
    for V in verts:
        allv.append(V); codes += [Path.MOVETO] + [Path.LINETO] * (len(V) - 1)
    pp = Path(np.vstack(allv), codes)
    ax.add_patch(PathPatch(pp, facecolor=color, edgecolor='none', alpha=alpha, zorder=z))


def body(ax, P, lw=2.0, fillc=PANEL, line_a=0.78, z=2):
    fill(ax, P, fillc, z=z)
    line(ax, P, lw, INK, line_a, z=z + 6, closed=True)


def dim(sh, ax, a, b, text, off=0.0, color=MUTE, size=17, side=1, w=1.2, tick=5):
    """a dimension line between mm points a and b, offset off mm along the normal, its text at the middle"""
    a = np.asarray(a, float); b = np.asarray(b, float); d = b - a; L = np.linalg.norm(d); t = d / L; n = np.array([-t[1], t[0]]) * side
    pa, pb = a + n * off, b + n * off
    line(ax, [pa, pb], w, color, 0.9, z=12)
    for p in (pa, pb):
        q = np.array([p - n * tick / 2 / ax.s, p + n * tick / 2 / ax.s]); line(ax, q, w, color, 0.9, z=12)
    mx, my = sh.to_px(ax, *(pa + pb) / 2)
    ang = np.degrees(np.arctan2(-t[1], t[0])) if abs(t[0]) > 1e-3 else 90
    if ang > 90: ang -= 180
    if ang < -90: ang += 180
    sh.text(mx, my, text, size=size, weight=650, color=color, ha='center', va='center', rotation=ang,
            bbox=dict(boxstyle='square,pad=0.15', facecolor=PAPER, edgecolor='none', alpha=0.9))


def comb(ax, C, kappa, scale=1.0, color=HERO, w=0.9, alpha=0.55, every=6):
    """a curvature comb: the normal at each point scaled by curvature (mm per 1/mm), and its envelope"""
    C = np.asarray(C, float); d = np.gradient(C, axis=0); t = d / np.maximum(np.linalg.norm(d, axis=1, keepdims=True), 1e-12)
    n = np.c_[-t[:, 1], t[:, 0]]
    tip = C - n * (kappa * scale)[:, None]
    for i in range(0, len(C), every): line(ax, [C[i], tip[i]], w, color, alpha, z=9, cap='butt')
    line(ax, tip, w * 1.3, color, alpha + 0.2, z=9)
