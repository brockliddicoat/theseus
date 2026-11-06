"""render board2d.json (deck/tools/geo2d/board2d.py) with matplotlib: top and underside of a variant.
   python3 render_board2d.py board2d.json out.png [A|B] [top|bottom|both]"""
import sys, json, math
import numpy as np
import matplotlib; matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import PathPatch, Circle, Polygon as MPoly
from matplotlib.path import Path

MASK, POUR, TRACE, GOLD, SILK, PAGE = '#17181B', '#1D1F23', '#2A2D33', '#D7BD7F', '#EDEBE5', '#F5F5F7'
COPPER, GAPC, BARE = '#121316', '#2B2D33', '#26282D'


def poly_path(rings, mx):
    v, c = [], []
    for r in rings:
        a = np.array(r, float); a[:, 0] *= mx
        v += list(a) + [a[0]]; c += [Path.MOVETO] + [Path.LINETO] * (len(a) - 1) + [Path.CLOSEPOLY]
    return Path(np.array(v), c)


def draw_polys(ax, polys, mx, **kw):
    for p in polys:
        ax.add_patch(PathPatch(poly_path(p, mx), **kw))


def rtri(cx, cz, up, s, ins, r):
    """a cell's triangle inset by ins with its corners rounded r (as silk.rounded_inset)"""
    h = s * math.sqrt(3) / 2
    if up: P = np.array([(cx - s / 2, cz - h / 3), (cx + s / 2, cz - h / 3), (cx, cz + 2 * h / 3)])
    else:  P = np.array([(cx - s / 2, cz + h / 3), (cx, cz - 2 * h / 3), (cx + s / 2, cz + h / 3)])
    c = P.mean(0); r0 = s / (2 * math.sqrt(3)); q = c + (P - c) * (r0 - ins - r) / r0
    out = []
    for p in q:
        u = (p - c) / np.linalg.norm(p - c); a = math.atan2(u[1], u[0])
        out += [p + r * np.array([math.cos(a + (k / 8 - 0.5) * 2 * math.pi / 3), math.sin(a + (k / 8 - 0.5) * 2 * math.pi / 3)]) for k in range(9)]
    return np.array(out)


def board(ax, d, side):
    mx = 1 if side == 'top' else -1
    ol = np.array(d['outline'], float); ol[:, 0] *= mx
    clip = MPoly(ol, closed=True, transform=ax.transData)
    ax.add_patch(MPoly(ol, closed=True, fc=GOLD, ec='none', zorder=1))
    from shapely.geometry import Polygon
    inner = Polygon(d['outline']).buffer(-d['edgeBand'])
    ia = np.array(inner.exterior.coords); ia[:, 0] *= mx
    ax.add_patch(MPoly(ia, closed=True, fc=MASK if side == 'top' else GAPC, ec='none', zorder=1.1))
    if side == 'top':
        draw_polys(ax, d['top']['pour'], mx, fc=POUR, ec='none', zorder=1.2)
        for lay, w, pts in d['top']['traces']:
            if lay != 'L1': continue
            a = np.array(pts, float); a[:, 0] *= mx
            ax.plot(a[:, 0], a[:, 1], color=TRACE, lw=w * PT, solid_capstyle='round', solid_joinstyle='round', zorder=1.3)
        for x, z in d['top']['vias']:
            ax.add_patch(Circle((mx * x, z), 0.225, fc='#34373E', ec='none', zorder=1.35))
        draw_polys(ax, d['top']['pads'], mx, fc=GOLD, ec='none', zorder=1.5)
        draw_polys(ax, d['top']['silk'], mx, fc=SILK, ec='none', zorder=1.6)
        for ref, fp, x, z, rot, w, h, val in d['top']['parts']:
            if fp in ('TP', 'TPTHT', 'FID', 'GT01'): continue
            ww, hh = (h, w) if rot % 180 else (w, h)
            col = {'MODULE': '#0E0F11', 'SENSOR': '#22252B', 'QFN32': '#26282C', 'USBC': '#B9BDC4', 'JSTSH3': '#E9E6DC',
                   'ENCM': '#2A2C31', 'BRACKET': '#1A1B1E', 'TACT': '#2A2C31', 'SLIDEB': '#202226', 'SLIDEE': '#202226',
                   'L2016': '#3A3C42'}.get(fp, '#B79B6B')
            ax.add_patch(matplotlib.patches.FancyBboxPatch((mx * x - ww / 2, z - hh / 2), ww, hh, boxstyle='round,pad=0,rounding_size=%.2f' % min(0.4, ww / 4, hh / 4),
                                                           fc=col, ec='#00000080', lw=0.3, zorder=1.7, alpha=0.92))
            if fp in ('MODULE', 'SENSOR', 'QFN32'):
                ax.text(mx * x, z, {'MODULE': 'AN54LM-P20A', 'SENSOR': 'PAW3970', 'QFN32': 'nPM1300'}[fp], color='#C9CBD1', fontsize=FS * 0.9, ha='center', va='center', zorder=1.8, rotation=0)
        k = d['top']['keepout']
        ax.add_patch(matplotlib.patches.Rectangle((min(mx * k[0], mx * k[2]), k[1]), abs(k[2] - k[0]), k[3] - k[1], fc='none', ec='#7FB2FF', lw=0.8, ls='--', zorder=1.9))
    else:
        A = d['bottom']['art']
        reg = d['bottom']['art']['region']
        for p in reg:
            pp = PathPatch(poly_path(p, mx), fc=GAPC, ec='none', zorder=1.15); ax.add_patch(pp)
        regclip = [PathPatch(poly_path(p, mx), transform=ax.transData) for p in reg]
        for x, z, up, k in A['cells']:
            t = rtri(x, z, up, A['s'], A['inset']['m'], A['fillet']['m']); t[:, 0] *= mx
            m = MPoly(t, closed=True, fc=COPPER, ec='none', zorder=1.2); ax.add_patch(m)
            if regclip: m.set_clip_path(regclip[0])
        draw_polys(ax, A['reserved'], mx, fc=COPPER, ec='none', zorder=1.25)
        for x, z, up, k in A['cells']:
            if k == 'g':
                t = rtri(x, z, up, A['s'], A['inset']['g'], A['fillet']['g']); t[:, 0] *= mx
                ax.add_patch(MPoly(t, closed=True, fc=GOLD, ec='none', zorder=1.4))
        draw_polys(ax, d['bottom']['tht'], mx, fc=GOLD, ec='none', zorder=1.45)
        draw_polys(ax, d['bottom']['silk'], mx, fc=SILK, ec='none', zorder=1.5)
        L = d['bottom']['lens']; c = L['c']
        ax.add_patch(matplotlib.patches.FancyBboxPatch((mx * c[0] - L['hw'], c[1] - L['hl']), 2 * L['hw'], 2 * L['hl'], boxstyle='round,pad=0,rounding_size=%.2f' % L['hw'],
                                                       fc='#C9CCD2', ec='#8E939B', lw=0.6, zorder=1.95, alpha=0.92))
        for dz, r in ((1.1, 1.05), (-1.9, 0.75)):
            ax.add_patch(Circle((mx * c[0], c[1] + dz), r, fc='#33363C', ec='none', zorder=1.96))
    for x, z, r, kind in d['holes']:
        if kind == 1: ax.add_patch(Circle((mx * x, z), r + 0.75, fc=GOLD, ec='none', zorder=1.8))
        ax.add_patch(Circle((mx * x, z), r, fc=PAGE, ec='none', zorder=1.85))
    for cut in d['cuts']:
        from shapely.geometry import Polygon as SP
        g = SP(cut[0]); gt = g.buffer(d['trim'])
        draw_polys(ax, [[list(map(list, gt.exterior.coords))]], mx, fc=GOLD, ec='none', zorder=1.86)
        draw_polys(ax, [cut], mx, fc=PAGE, ec='none', zorder=1.9)


if __name__ == '__main__':
    D = json.load(open(sys.argv[1])); out = sys.argv[2]
    var = sys.argv[3] if len(sys.argv) > 3 else 'A'; sides = (sys.argv[4] if len(sys.argv) > 4 else 'both')
    sides = ['top', 'bottom'] if sides == 'both' else [sides]
    W, H = 44, 64; K = 0.32
    fig = plt.figure(figsize=(W * K * len(sides), H * K), dpi=110); fig.patch.set_facecolor(PAGE)
    PT = 72 * K * 1.0                     # points per mm at this scale (figure inch per mm = K)
    FS = 2.2 * PT / 2.0
    for i, sd in enumerate(sides):
        ax = fig.add_axes([i / len(sides), 0, 1 / len(sides), 1]); ax.set_xlim(-W / 2, W / 2); ax.set_ylim(-9.5, 54.5); ax.set_aspect('equal'); ax.axis('off')
        board(ax, D[var], sd)
        ax.text(0, 53.6, '%s, variant %s' % ('TOP' if sd == 'top' else 'UNDERSIDE (seen from below)', var), ha='center', fontsize=14, color='#333')
    fig.savefig(out, facecolor=PAGE)
    print(out)
