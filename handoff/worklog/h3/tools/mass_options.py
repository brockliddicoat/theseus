# H3: small pictures of the ways back from 5.68 g (the board as built) towards Brock's 5.63 and the 5.60 g target.
# Every dimension is the builder's (3d/parts/scrollwheel.js); the grams come from work/h3/whatif/run2.mjs (the builder
# re-run with each change: options.json). Writes one picture per option, /home/claude/work/h3/shots/mass_opt_<X>.png, and
# the sheet mass_options.png.
import json, textwrap
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import Polygon, Rectangle, Circle
from shapely.geometry import Polygon as SP, box
from PIL import Image, ImageDraw, ImageFont

OPT = json.load(open('/home/claude/work/h3/whatif/options.json'))
B0 = OPT['as built']
def dg(k): return (OPT[k]['enc'] - B0['enc']) + (OPT[k]['sup'] - B0['sup'])
AS_BUILT = 5.684
OUT = '/home/claude/work/h3/shots/'

PAPER, INK, MUTE, GREY, GREY2, ACC, RED, BOARD = '#f7f6f2', '#262626', '#6f6c66', '#b9b6ae', '#e4e1d9', '#127f86', '#b3412f', '#2f3a33'
plt.rcParams.update({'font.family': 'DejaVu Sans', 'font.size': 8.5, 'figure.facecolor': PAPER, 'axes.facecolor': PAPER})


def fig_for(title, grams, cost, cost_color=MUTE, grams_color=ACC):
    f = plt.figure(figsize=(6.4, 5.0), dpi=130)
    f.text(0.03, 0.955, title, fontsize=11.5, weight='bold', color=INK, va='top')
    f.text(0.03, 0.895, grams, fontsize=10, weight='bold', color=grams_color, va='top')
    f.text(0.03, 0.2, textwrap.fill(cost, 92), fontsize=8.4, color=cost_color, va='top', linespacing=1.35)
    return f


def axes(f, rect=(0.03, 0.24, 0.94, 0.6)):
    ax = f.add_axes(rect); ax.set_aspect('equal'); ax.set_xticks([]); ax.set_yticks([])
    for s in ax.spines.values(): s.set_visible(False)
    return ax


def poly(ax, pts, fc=GREY2, ec=GREY, lw=1.0, ls='-', z=1):
    ax.add_patch(Polygon(pts, closed=True, fc=fc, ec=ec, lw=lw, ls=ls, zorder=z))


def inset(pts, d): return list(SP(pts).buffer(-d, join_style=2).exterior.coords)
def rr(w, h, r, cx=0, cy=0): return list(box(cx - w / 2 + r, cy - h / 2 + r, cx + w / 2 - r, cy + h / 2 - r).buffer(r, quad_segs=8).exterior.coords)


def dim(ax, x0, y0, x1, y1, label='', at=None, color=INK, fs=7.5, ha='center'):
    ax.annotate('', xy=(x0, y0), xytext=(x1, y1), arrowprops=dict(arrowstyle='<->', lw=0.7, color=color, shrinkA=0, shrinkB=0))
    if label:
        x, y = at if at else ((x0 + x1) / 2, (y0 + y1) / 2)
        ax.text(x, y, label, fontsize=fs, color=color, ha=ha, va='center')


files = []
def save(f, key):
    p = OUT + 'mass_opt_%s.png' % key; f.savefig(p, facecolor=PAPER); plt.close(f); files.append(p)


# ---------------------------------------------------------------- B: encoder housings, walls 0.40 -> 0.35
ZH, YT, YB, CH, YS = 5.5, 4.0, -12.0, 2.6, -3.15
bot = [(ZH, YB), (ZH, YS), (-ZH, YS), (-ZH, YB)]
top = [(ZH, YS), (ZH, YT), (-ZH + CH, YT), (-ZH, YT - CH), (-ZH, YS)]
k = 'B encoder walls 0.35'
f = fig_for('B  Encoder housings: walls 0.40 -> 0.35 mm',
            '%+.3f g (encoder 0.475 -> %.3f)  ->  %.2f g' % (dg(k), OPT[k]['enc'], AS_BUILT + dg(k)),
            'Cost: the walls are already under general moulding guidance (Protolabs: polyester from 0.64 mm, PC from '
            '1.02 mm), so this is micro-moulding either way; 0.35 mm goes further, and the clear PC top fills worse than '
            'the black PBT. The snap hooks get weaker (a hook bends with its thickness cubed). From outside nothing changes.')
ax = axes(f, (0.03, 0.24, 0.55, 0.62))
ax.add_patch(Rectangle((-7, -12.6), 14, 0.6, fc=BOARD, ec='none', zorder=0))
for pts, fc in ((bot, '#3b3b3b'), (top, '#cfdde1')):
    poly(ax, pts, fc=fc, ec=INK, lw=0.8, z=2)
    poly(ax, inset(pts, 0.40), fc=PAPER, ec=GREY, lw=0.8, z=3)
    poly(ax, inset(pts, 0.35), fc='none', ec=ACC, lw=1.0, ls='--', z=4)
ax.add_patch(Circle((0, 0), 1.2, fc=GREY2, ec=GREY, lw=0.8, zorder=5)); ax.text(0, 0, 'axle', fontsize=6.5, ha='center', va='center', color=MUTE, zorder=6)
ax.text(-ZH, YT + 0.7, 'clear PC top housing', fontsize=7.5, color=INK)
ax.text(-ZH, -14.0, 'black PBT bottom housing on the main board', fontsize=7.5, color=INK)
ax.add_patch(Rectangle((4.3, 2.9), 1.4, 1.4, fc='none', ec=MUTE, lw=0.6, zorder=7))
ax.set_xlim(-7.2, 7.2); ax.set_ylim(-14.8, 5.6)
ia = axes(f, (0.62, 0.42, 0.35, 0.42))
poly(ia, top, fc='#cfdde1', ec=INK, lw=1.0, z=2); poly(ia, inset(top, 0.40), fc=PAPER, ec=GREY, lw=1.4, z=3)
poly(ia, inset(top, 0.35), fc='none', ec=ACC, lw=1.6, ls='--', z=4)
ia.set_xlim(4.3, 5.7); ia.set_ylim(2.9, 4.3)
for s in ia.spines.values(): s.set_visible(True); s.set_edgecolor(MUTE); s.set_linewidth(0.6)
ia.text(4.35, 3.40, 'inside at 0.40', fontsize=7.5, color=MUTE); ia.text(4.35, 3.75, 'inside at 0.35', fontsize=7.5, color=ACC)
f.text(0.62, 0.38, 'the corner, 10x: section across\nthe axle (11 x 16 mm housing)', fontsize=7.5, color=MUTE, va='top')
save(f, 'B')

# ---------------------------------------------------------------- C: the Hall IC's board 0.5 -> 0.4
k = 'C sensor board 0.4'
f = fig_for('C  The Hall IC\'s small board: 0.5 -> 0.4 mm FR4',
            '%+.3f g (its board 0.066 -> 0.053)  ->  %.2f g' % (dg(k), AS_BUILT + dg(k)),
            'Cost: little. 0.4 mm is a standard laminate; the small board flexes a little more on its four pins. The IC '
            'stays 0.4 mm from the magnet (about 110 mT there, a surface-charge estimate for a Ø3 x 0.8 mm N35 disc).')
ax = axes(f)
XB0, XB1 = 6.65, 11.5
ax.add_patch(Rectangle((XB0, -6.9), XB1 - XB0, 10.9, fc='none', ec=INK, lw=0.8, zorder=1))
ax.text(XB0, 4.5, 'encoder housing (section along the axle)', fontsize=7.5, color=MUTE)
ax.add_patch(Rectangle((2.6, -1.2), 6.3, 2.4, fc=GREY2, ec=GREY, lw=0.8, zorder=1)); ax.text(2.8, 1.6, 'axle and rotor', fontsize=7.2, color=MUTE)
ax.add_patch(Rectangle((8.95, -1.5), 0.8, 3.0, fc='#9aa0a6', ec=INK, lw=0.7, zorder=3)); ax.text(9.35, -2.0, 'magnet\nØ3 x 0.8', fontsize=7, ha='center', va='top')
ax.add_patch(Rectangle((10.15, -1.5), 0.75, 3.0, fc='#2b2b2b', ec=INK, lw=0.7, zorder=3)); ax.annotate('Hall IC', xy=(10.55, 1.0), xytext=(12.4, 2.4), fontsize=7.5, color=INK, va='center', zorder=6,
            arrowprops=dict(arrowstyle='->', lw=0.7, color=INK))
ax.add_patch(Rectangle((10.9, -6.4), 0.5, 9.6, fc='#55625a', ec=GREY, lw=0.8, zorder=2))
ax.add_patch(Rectangle((10.9, -6.4), 0.4, 9.6, fc='none', ec=ACC, lw=1.3, ls='--', zorder=4))
ax.annotate('small board\n0.5 -> 0.4 mm', xy=(11.3, -4.5), xytext=(12.4, -4.5), fontsize=7.5, color=ACC, va='center',
            arrowprops=dict(arrowstyle='->', lw=0.7, color=ACC))
dim(ax, 9.75, 2.2, 10.15, 2.2, '0.4 gap', at=(9.95, 2.9), fs=7)
ax.set_xlim(2.4, 15.2); ax.set_ylim(-7.4, 5.4)
save(f, 'C')

# ---------------------------------------------------------------- D: the support's post, walls 0.55 -> 0.45
k = 'D post walls 0.45'
f = fig_for('D  Support post: tube walls 0.55 -> 0.45 mm',
            '%+.3f g (post 0.087 -> %.3f)  ->  %.2f g' % (dg(k), OPT[k]['supParts']['post'], AS_BUILT + dg(k)),
            'Cost: POM\'s general guidance starts at 0.76 mm (Protolabs), so the cored support\'s 0.55 mm is already '
            'micro-moulding; 0.45 goes further. The post carries the far journal: a thinner tube bends more sideways.')
ax = axes(f)
W, H = 1.8, 4.2
poly(ax, rr(W, H, 0.4), fc='#3b3b3b', ec=INK, lw=0.8, z=1)
poly(ax, rr(W - 1.1, H - 1.1, 0.15), fc=PAPER, ec=GREY, lw=0.8, z=2)
poly(ax, rr(W - 0.9, H - 0.9, 0.15), fc='none', ec=ACC, lw=1.3, ls='--', z=3)
ax.text(1.4, 1.5, 'section through the post:\n1.8 x 4.2 mm, a tube under\na solid 1 mm cap', fontsize=7.5, color=MUTE, va='center')
dim(ax, -W / 2, -2.5, W / 2, -2.5, '1.8', at=(0, -2.85), color=MUTE)
ax.text(1.4, -0.4, 'core 0.70 x 3.10 (walls 0.55)', fontsize=7.5, color=MUTE); ax.text(1.4, -0.9, 'core 0.90 x 3.30 (walls 0.45)', fontsize=7.5, color=ACC)
ax.set_xlim(-1.6, 6.4); ax.set_ylim(-3.2, 2.6)
save(f, 'D')


# ---------------------------------------------------------------- E + F: the support's foot and seat (side view)
def support(ax, BH=2.4, seat0=5.3, col=GREY2, ec=GREY, ls='-', lw=0.9, z=1):
    yax = 12.0
    poly(ax, [(7.75, 0), (13.05, 0), (13.05, BH), (7.75, BH)], fc=col, ec=ec, ls=ls, lw=lw, z=z)
    poly(ax, [(7.9, BH), (9.7, BH), (9.7, yax + 1.6), (7.9, yax + 1.6)], fc=col, ec=ec, ls=ls, lw=lw, z=z)
    poly(ax, [(seat0, yax - 2.4), (7.9, yax - 2.4), (7.9, yax + 1.6), (seat0, yax + 1.6)], fc=col, ec=ec, ls=ls, lw=lw, z=z)


def side_view(ax):
    ax.add_patch(Rectangle((2.4, -0.6), 11.4, 0.6, fc=BOARD, ec='none', zorder=0))
    ax.add_patch(Rectangle((10.4 - 1.75, 0), 3.5, 1.65, fc='none', ec=INK, lw=0.8, ls=(0, (3, 2)), zorder=6))
    ax.text(10.4, 0.82, 'tact 1.65\n(hidden)', fontsize=6.3, ha='center', va='center', color=INK, zorder=6)
    ax.add_patch(Rectangle((2.4, 12 - 1.2), 5.3, 2.4, fc='#d8d4ca', ec=GREY, lw=0.7, zorder=0.5)); ax.text(2.6, 12, 'axle', fontsize=7, color=MUTE, va='center')
    ax.plot([3.5, 3.5], [3.0, 14.2], color=GREY, lw=0.8, ls=':'); ax.text(3.35, 3.2, 'wheel\'s\nside face', fontsize=6.5, color=MUTE, ha='right')
    ax.text(13.6, 0.3, 'board', fontsize=6.5, color=MUTE)


k = 'E foot 1.8 tall'
f = fig_for('E  Support foot: 2.4 -> 1.8 mm tall',
            '%+.3f g (foot 0.069 -> %.3f, the post +%.3f)  ->  %.2f g' % (dg(k), OPT[k]['supParts']['foot'], OPT[k]['supParts']['post'] - B0['supParts']['post'], AS_BUILT + dg(k)),
            'Cost: the foot still clears the 1.65 mm middle-click tact in its window, by 0.15 mm (was 0.75); the post '
            'grows 0.6 mm down to meet it. The 2.4 mm is a drawn value, not a load case: a real middle-click mechanism '
            'may want the room.')
ax = axes(f)
side_view(ax); support(ax)
poly(ax, [(7.75, 0), (13.05, 0), (13.05, 1.8), (7.75, 1.8)], fc='none', ec=ACC, ls='--', lw=1.4, z=7)
dim(ax, 13.55, 0, 13.55, 2.4, '2.4', at=(14.05, 1.9), color=MUTE)
dim(ax, 7.35, 0, 7.35, 1.8, '1.8', at=(6.9, 0.9), color=ACC)
ax.text(5.3, 14.5, 'side view; mm from the wheel\'s centre', fontsize=7, color=MUTE)
ax.set_xlim(1.8, 14.8); ax.set_ylim(-1.0, 15.3)
save(f, 'E')

k = 'F seat 0.6 shorter'
f = fig_for('F  Support seat: 0.6 mm shorter along the axle',
            '%+.3f g (seat 0.044 -> %.3f)  ->  %.2f g' % (dg(k), OPT[k]['supParts']['seat'], AS_BUILT + dg(k)),
            'Cost: the far journal\'s bearing shortens from 2.4 to 1.8 mm (the axle ends at 7.7 mm): more wear and '
            'wobble at that end; the gap to the wheel\'s side face grows from 1.8 to 2.4 mm.')
ax = axes(f)
side_view(ax); support(ax)
poly(ax, [(5.9, 9.6), (7.9, 9.6), (7.9, 13.6), (5.9, 13.6)], fc='none', ec=ACC, ls='--', lw=1.4, z=7)
ax.plot([7.7, 7.7], [10.8, 13.2], color=INK, lw=0.7, zorder=8); ax.text(7.75, 8.9, 'axle ends\nat 7.7', fontsize=6.5, ha='center', va='top')
dim(ax, 5.3, 14.2, 7.9, 14.2, '2.6', at=(6.6, 14.75), color=MUTE)
dim(ax, 5.9, 9.2, 7.9, 9.2, '2.0', at=(5.2, 9.2), color=ACC)
ax.set_xlim(1.8, 14.8); ax.set_ylim(-1.0, 15.3)
save(f, 'F')

# ---------------------------------------------------------------- G: the Hall IC on the main board (not recommended)
f = fig_for('G  The Hall IC on the main board: not recommended',
            '-0.097 g (no small board, no pins)  ->  5.59 g', grams_color=RED, cost_color=RED,
            cost='Cost: it doesn\'t work as drawn. About 12 mm under the magnet the field is 0.3 to 0.6 mT, changing 2:1 '
                 'as the magnet turns: some 200 times weaker than the 110 mT at 0.4 mm. Angle sensors want tens of mT, '
                 'and the Earth\'s ~0.05 mT would be a tenth of the signal. A magnet strong enough would outweigh the '
                 'saving. (H2\'s 0.45 g estimate assumed this.)')
ax = axes(f)
ax.add_patch(Rectangle((-6, -0.6), 12, 0.6, fc=BOARD, ec='none'))
ax.add_patch(Rectangle((-1.5, 0), 3.0, 0.75, fc='#2b2b2b', ec=INK, lw=0.6)); ax.text(1.9, 0.4, 'Hall IC on the main board', fontsize=7.5, va='center')
ax.add_patch(Circle((0, 12), 1.5, fc='#9aa0a6', ec=INK, lw=0.7)); ax.text(1.9, 12, 'magnet Ø3 on the axle,\n12 mm over the board', fontsize=7.5, va='center')
dim(ax, -2.4, 0.75, -2.4, 10.5, '~10.5 mm', at=(-3.0, 5.6), color=RED, ha='right')
ax.set_xlim(-7.5, 9.5); ax.set_ylim(-1.2, 14.2)
save(f, 'G')

# ---------------------------------------------------------------- H: the board itself, 0.6 -> 0.5 mm
f = fig_for('H  The board itself: 0.6 -> 0.5 mm laminate', '-0.32 g (1702 mm² x 0.1 mm x 1.85 g/cm³)  ->  5.37 g', grams_color=MUTE,
            cost='Cost: bending stiffness 12.5 % of the 1.0 mm board\'s (21.6 % now; it goes with t³), so the posts and '
                 'ribs carry more; fewer fabs offer 0.5 mm than 0.6; the Mill-Max sockets and the encoder\'s pins stand '
                 'further through. One step does four times what B to F do together.')
ax = axes(f)
ax.add_patch(Rectangle((0, 4.43), 10, 0.6, fc=BOARD, ec=INK, lw=0.6)); ax.add_patch(Rectangle((0, 4.53), 10, 0.5, fc='none', ec=ACC, lw=1.4, ls='--'))
ax.plot([0, 10], [5.03, 5.03], color=INK, lw=0.8); ax.text(10.4, 5.1, 'top 5.03 mm over the pad (kept)', fontsize=7.5, va='center')
ax.text(10.4, 4.5, 'underside 4.43 -> 4.53', fontsize=7.5, va='center', color=ACC)
ax.text(0, 5.45, 'the board in section (x4 vertically)', fontsize=7.5, color=MUTE)
ax.set_xlim(-0.5, 18.5); ax.set_ylim(3.9, 5.8); ax.set_aspect(4)
save(f, 'H')

# ---------------------------------------------------------------- the sums
f = plt.figure(figsize=(6.4, 5.0), dpi=130)
f.text(0.03, 0.955, 'What they add up to', fontsize=11.5, weight='bold', color=INK, va='top')
rows = [('As built: 0.6 mm, two layers, the lighter encoder, the cored support', AS_BUILT, INK),
        ('B + C + D: housings, the small board, the post\'s walls', AS_BUILT + dg('B+C+D'), ACC),
        ('B + C + D + E + F: and the foot, the seat', AS_BUILT + dg('B+C+D+E+F'), ACC),
        ('H alone: the board 0.5 mm', AS_BUILT - 0.315, MUTE),
        ('Brock\'s figure (F47.4)', 5.63, MUTE), ('The target (F42.2)', 5.60, MUTE)]
y = 0.84
for name, g, c in rows:
    f.text(0.03, y, textwrap.fill(name, 60), fontsize=9, color=c, va='center')
    f.text(0.95, y, '%.2f g' % g, fontsize=11, color=c, va='center', ha='right', weight='bold')
    y -= 0.095
f.text(0.03, y - 0.02, textwrap.fill('Grams: the 3D builder re-run with each change (volumes x densities), combined '
       'where they stack. The uncertain line is bigger than any of these: Brock weighs a Mill-Max 3305 at 0.11 g, the '
       'model 0.03 g, so six of them are +0.48 g if his figure holds; the GT01s are typical micro switches (0.5 g each), '
       'not weighed.', 88), fontsize=8.4, color=MUTE, va='top', linespacing=1.35)
p = OUT + 'mass_opt_sum.png'; f.savefig(p, facecolor=PAPER); plt.close(f); files.append(p)

# ---------------------------------------------------------------- the sheet
ims = [Image.open(p).convert('RGB') for p in files]
w, h = ims[0].size
head = 110
sheet = Image.new('RGB', (4 * w, 2 * h + head), PAPER)
d = ImageDraw.Draw(sheet)
try:
    fb = ImageFont.truetype('DejaVuSans-Bold.ttf', 34); fr = ImageFont.truetype('DejaVuSans.ttf', 22)
except OSError:
    fb = fr = ImageFont.load_default()
d.text((30, 18), 'Where the last 0.08 g could come from (H3, F47.4): as built 5.68 g, Brock\'s path 5.63, the target 5.60', fill=INK, font=fb)
d.text((30, 66), 'Grey: as drawn now. Teal: the option. Nothing is applied until Brock picks.', fill=MUTE, font=fr)
for i, im in enumerate(ims):
    sheet.paste(im, ((i % 4) * w, head + (i // 4) * h))
sheet.save(OUT + 'mass_options.png')
print('\n'.join(files)); print(OUT + 'mass_options.png', sheet.size)
