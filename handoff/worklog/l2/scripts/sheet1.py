"""L2 image 1: the two lattices inside Theseus's top shell, from below, side by side, with the numbers under them.
True greys; blue only for the current pick (kagome). Dated name, never overwritten."""
import sys, json, time, os
sys.dont_write_bytecode = True
sys.path.insert(0, '/home/claude/work/l2/scripts'); sys.path.insert(0, '/home/claude/work/s1/scripts')
import numpy as np
import env, geo, rast
import sheetlib as SL
from sheetlib import Sheet

# true greys (R = G = B); the deck's blue for the current pick only
PAPER, INK, INK2, MUTE, FAINT, HAIR = '#F5F5F5', '#111111', '#2E2E2E', '#5E5E5E', '#8A8A8A', '#DCDCDC'
HERO, HERO_T = SL.HERO, SL.HERO_T
SL.PAPER = PAPER
OUT = '/home/claude/work/l2/out'
RES = json.load(open('/home/claude/work/l1/out/results-final.json'))
ND = json.load(open('%s/nodes.json' % OUT))
B2 = json.load(open('%s/budget_s2.json' % OUT)); B1 = json.load(open('%s/budget_l1.json' % OUT))
kag = RES['winner']; tri = [p for p in RES['patterns'] if p['label'] == 'H-kagome-t0.60'][0]
assert kag['kind_code'] == 'tri' and tri['kind_code'] == 'kagome'
plain = RES['plain_wall_with_rails']['flex_um']['worst_hard_press']

CAM = dict(elev=62.0, azim=22.0, box=(-31.62, -52.1, 35.96, 59.77), s=11.0)


def proj(P):
    d = rast.view_dir(CAM['elev'], CAM['azim'], below=True); cam = rast.cam_from(d, (0, 0, 1.0))
    xy, z = rast.project(np.atleast_2d(P), cam, CAM['s'], CAM['box'])
    return xy


def node_px(key, near_zs):
    """the rib tip at the junction nearest to (z, s), in render pixels"""
    p2 = json.load(open('%s/p2_%s.json' % (OUT, key)))
    pts = np.array([n['p'] for n in p2['nodes']])
    i = np.argmin(((pts - np.array(near_zs)) ** 2).sum(1)); z, s = pts[i]
    ch = geo.chart(); X, n, _, _ = ch.frame(np.array([z]), np.array([s]))
    return proj(X[0] - n[0] * (geo.T_SKIN + geo.H_RIB))[0]


def render_img(key):
    d = np.load('%s/r_%s_inside_final.npz' % (OUT, key))
    c, a = d['c'], d['a']
    pg = 0xF5 / 255
    return np.clip(c * a + pg * (1 - a), 0, 1)


def halo_text(sh, x, y, s, size, weight=650, color=INK, ha='left', **k):
    import matplotlib.patheffects as pe
    t = sh.text(x, y, s, size=size, weight=weight, color=color, ha=ha, **k)
    t.set_path_effects([pe.withStroke(linewidth=6, foreground=PAPER)])
    return t


def callout(sh, px, py, tx, ty, label, ha='left', color=INK):
    sh.ov.plot([px, tx], [py, ty], color=color, lw=2.2 * SL.PX, zorder=60, solid_capstyle='round')
    sh.ov.plot([px], [py], 'o', ms=9, mfc='none', mec=color, mew=2.2, zorder=61)
    halo_text(sh, tx + (8 if ha == 'left' else -8), ty + 9, label, 27, 700, color, ha=ha, z=62)


if __name__ == '__main__':
    stamp = time.strftime('%H%M')
    W_, H_ = 1600, 2420
    sh = Sheet(W_, H_)
    sh.fig.patch.set_facecolor(PAPER)
    sh.title(46, 74, 'Kagome or true triangles, inside the shell', size=50)
    sh.text(46, 120, 'Theseus’s top shell from below, as moulded: the same 9.35 g and the same ribs (0.36 × 1.80 mm on a 0.60 mm skin),', size=25, weight=500, color=MUTE)
    sh.text(46, 152, 'stopping at the 1.75° crease. The ribs also run up the side walls, out of sight in this view.', size=25, weight=500, color=MUTE)
    X0 = (46, 811); Y0 = 268
    heads = [('Kagome (woven)', HERO_T, 'Two ribs cross at each node. Cells: triangles and', 'hexagons, 7.3 mm a side; 12.6 mm between ribs.'),
             ('True triangles', INK, 'Six ribs meet at each node. Cells: triangles', '14.4 mm a side; 12.5 mm between ribs.')]
    for k, key in enumerate(('kag', 'tri')):
        x0 = X0[k]
        t = sh.label(x0, 202, heads[k][0], size=36, color=heads[k][1])
        if k == 0:
            sh.text(x0 + 372, 202, 'Current pick', size=24, weight=700, color=HERO_T,
                    bbox=dict(boxstyle='round,pad=0.35', facecolor='white', edgecolor=HERO, lw=1.6))
        sh.text(x0, 236, heads[k][2], size=24, weight=550, color=INK2)
        sh.text(x0, 264, heads[k][3], size=24, weight=550, color=INK2)
        img = render_img(key)
        h, w = img.shape
        ax = sh.fig.add_axes([x0 / W_, 1 - (Y0 + 14 + h) / H_, w / W_, h / H_]); ax.axis('off')
        ax.imshow(img, cmap='gray', vmin=0, vmax=1, interpolation='nearest')
        ax.set_zorder(5)
    # callouts: a junction near the dome's middle in each
    for k, key, lab in ((0, 'kag', 'Two ribs cross'), (1, 'tri', 'Six ribs meet: a knot')):
        px, py = node_px(key, (-27.0, -8.0))
        px += X0[k]; py += Y0 + 14
        callout(sh, px, py, px - 70, py - 96, lab, ha='right')
    # orientation and parts
    for k in (0, 1):
        halo_text(sh, X0[k] + 372, Y0 + 66, '↑ nose', 24, 700, MUTE, ha='center')
        halo_text(sh, X0[k] + 372, Y0 + 14 + 318, 'Buttons (separate parts)', 23, 650, MUTE, ha='center')
    # ---------------- the numbers ----------------
    y = Y0 + 14 + 1230 + 44
    sh.rule(46, y - 14, W_ - 46, y - 14, HAIR, 2)
    cx = [46 + 372, 811 + 372]
    def row(y, label, vals, subs=None, vsize=42):
        sh.text(W_ / 2, y, label, size=22, weight=700, color=MUTE, ha='center', caps=True)
        for i in (0, 1):
            sh.text(cx[i], y + 50, vals[i], size=vsize, weight=750, color=INK, ha='center', font='Inter Display')
            if subs: sh.text(cx[i], y + 84, subs[i], size=22, weight=550, color=MUTE, ha='center')
        return y + (118 if subs else 92)
    fk, ft = kag['flex_um']['worst_hard_press'], tri['flex_um']['worst_hard_press']
    y = row(y, 'Flex under a hard press (10 N, at the worst spot)', ['%.1f µm' % fk, '%.1f µm' % ft],
            ['a tie: the study resolves about ±4 %', 'a plain wall of the same weight: %.0f µm' % plain])
    su = lambda p: p['strength_used_at_10N']
    y = row(y, 'Strength used at 10 N: the hottest rib · the skin’s hottest spot',
            ['%.1f %% · %.1f %%' % (100 * su(kag)['ribs'], 100 * su(kag)['skin']), '%.1f %% · %.1f %%' % (100 * su(tri)['ribs'], 100 * su(tri)['skin'])],
            ['skin’s peak: the rear cutout’s edge (a press)', 'skin’s peak: the crease near the tail (a squeeze)'])
    y = row(y, 'Each node: ribs meeting · width in plan · thickest spot (a ball, vs the 0.60 skin)',
            ['2 · %.2f · %.2f mm (%.1f×)' % (ND['kag']['plan']['D'], ND['kag']['ball']['D'], ND['kag']['ball']['D'] / 0.6),
             '6 · %.2f · %.2f mm (%.1f×)' % (ND['tri']['plan']['D'], ND['tri']['ball']['D'], ND['tri']['ball']['D'] / 0.6)],
            ['%d crossings on the shell' % B2['kag']['n_nodes'], '%d knots on the shell' % B2['tri']['n_nodes']], vsize=38)
    y = row(y, 'Stiff in', ['3 directions, 60° apart', '3 directions, 60° apart'], None, vsize=36)
    # ---------------- the film ----------------
    sh.rule(46, y - 4, W_ - 46, y - 4, HAIR, 2)
    y += 36
    sh.text(W_ / 2, y, 'In the film', size=22, weight=700, color=MUTE, ha='center', caps=True)
    film = [['New to it: b06 teaches triangles, open like the', 'honeycomb mice’s holes. The kagome needs one more', 'line: its hexagons are straight ribs running on through,', 'unlike a honeycomb’s; and b06’s six-rib nodes become', 'two-rib crossings.'],
            ['Exactly what b06 teaches (“Triangles, not hexagons”),', 'with the six-rib node it already draws: nothing new', 'to explain.']]
    for i in (0, 1):
        for j, ln in enumerate(film[i]):
            sh.text(X0[i] + 10, y + 42 + 31 * j, ln, size=24, weight=550, color=INK2)
    y += 42 + 31 * 5 + 30
    sh.rule(46, y - 10, W_ - 46, y - 10, HAIR, 2)
    foot = ['Numbers: L1’s 3D study of the whole shell (results-final.json: fine mesh, 10 N, every design 9.35 g), solved on its earlier crease (2.8°).',
            'Drawn on the 1.75° crease: %.1f %% more ribbed area, so +%.2f g (kagome) and +%.2f g (triangles) of ribs at these spacings: not yet re-solved.'
            % (100 * (B2['A_lat'] / B1['A_lat'] - 1), (B2['kag']['V'] - B1['kag']['V']) * 1.01e-3, (B2['tri']['V'] - B1['tri']['V']) * 1.01e-3),
            'Node sizes from this sheet’s geometry (0.24 mm root fillets, 0.22 mm node fillets). Triangles drawn where L1 placed them, not centred on the midline.']
    for j, ln in enumerate(foot): sh.text(46, y + 24 + 28 * j, ln, size=19, weight=500, color=MUTE)
    H_used = y + 24 + 28 * len(foot) + 24
    fn = '/home/claude/work/l2/l2_kagome_vs_triangles_1_inside_%s.png' % stamp
    assert not os.path.exists(fn)
    sh.save(fn)
    from PIL import Image
    im = Image.open(fn); im.crop((0, 0, W_, min(H_, int(H_used)))).save(fn)
    print(fn, im.size, 'used', H_used)
