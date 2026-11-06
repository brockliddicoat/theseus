"""S2 nose study sheet (new dated name): flagship photos, the three readings, and the nose in shaded 3D (side, front, top,
3/4 front at 30 px/mm) for the Sora V2 scan, C as sent at 12:21, and two candidates with the trigger's lip proud."""
import sys, json, time
import numpy as np
from PIL import Image
sys.path.insert(0, '/home/claude/work/s1/scripts')
from sheetlib import *
R = '/home/claude/work/s2/nose/real/'
NUM = json.load(open('/home/claude/work/s2/nose_numbers.json'))
def crop_view(name, view):
    im = Image.open(R + '%s_%s.png' % (name, view)).convert('RGB')
    if view == 'side':  im = im.crop((0, 40, 880, 840))            # z 62..40, y 23..3 at 40 px/mm
    if view == 'front': im = im.crop((40, 40, 1400, 840))          # x -1..33, y 23..3
    if view == 'top':   im = im.crop((40, 0, 1400, 800))           # x 33..-1 (user's left on the left), z 62..42
    if view == '34':
        im = im.crop((150, 250, 1350, 900)); s = 30.0 / 32.3
        return np.asarray(im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS))
    return np.asarray(im.resize((round(im.width * 0.75), round(im.height * 0.75)), Image.LANCZOS))
def put(sh, img, x, y):
    h, w = img.shape[:2]
    ax = sh.fig.add_axes([x / sh.W, 1 - (y + h) / sh.H, w / sh.W, h / sh.H]); ax.imshow(img, interpolation='none'); ax.axis('off')
    sh.bg.add_patch(plt.Rectangle((x, y), w, h, facecolor='none', edgecolor=HAIR, lw=1.5 * PX, zorder=3))
    return w, h
W_, H_ = 4520, 4330
sh = Sheet(W_, H_)
sh.title(60, 96, 'The nose: one cut from the side round the front, in 3D', size=50)
sh.text(60, 146, 'Shaded 3D at true scale, 30 px/mm, grey so the form reads (the real shell is black). From the side, the front, above and 3/4 front. Your Sora V2 scan first.', size=24, weight=500, color=MUTE)
# 1. the flagships (RTINGS photos, all from the same angle: nose lower left, the user's left side facing us)
sh.label(60, 222, 'What the flagships do (RTINGS product photos, same angle; the nose is at the lower left)', size=20, color=INK)
refs = [('Sora V2', 'sora_v2_design.jpg', 'One cut: down the side, round the corner, across under the lip.', 'The body sits flush under the lip (scan: lip 1.4 mm).'),
        ('Viper V3 Pro', 'viper_v3pro_design.jpg', 'One cut; the buttons’ front overhangs the base:', 'a dark shadow under the lip, no base edge at the tip.'),
        ('Pulsar X2 V2', 'pulsar_x2v2_design.jpg', 'One cut; thin lip, the base nearly flush under it.', 'The turn at the corner follows the nose round.'),
        ('G Pro X Superlight 2', 'gpx2_design.jpg', 'One cut wrapping the corner on a wide radius;', 'thin lip, flat across the middle.')]
x = 60
for nm, f, c1, c2 in refs:
    im = Image.open('/home/claude/work/s2/dl_refs/' + f).convert('RGB').crop((30, 170, 700, 563))
    im = im.resize((round(im.width * 1.0), round(im.height * 1.0)), Image.LANCZOS)
    w, h = put(sh, np.asarray(im), x, 245)
    sh.text(x, 245 + h + 34, nm, size=22, weight=700, color=INK)
    sh.text(x, 245 + h + 64, c1, size=18, weight=500, color=MUTE); sh.text(x, 245 + h + 88, c2, size=18, weight=500, color=MUTE)
    x += w + 40
S_ = NUM['sora']
sh.text(60, 790, 'All four: one continuous cut of one width, flat across the middle of the front, turning up at the corner; none has a separate slot or stub. '
        'The Sora V2 scan’s own cut, measured: flat at %.1f mm across the front to |x| 18, then up %.1f mm by |x| 24; from the side it bends into the flat on a %.0f mm knee and runs flat %.1f mm to the tip.' %
        (10.0, S_['front_y']['24'] - 10.0, S_['r_min_side'], S_['flat_run']), size=19, weight=500, color=INK2)
# 2. the readings
y0 = 880
sh.label(60, y0, '“It needs to properly connect completely”: three readings, and what each design does', size=20, color=INK)
cols = ['11:50 (= the Sora’s own nose)', 'B (12:16)', 'C (12:21)', 'Candidate 1: C + proud lip', 'Candidate 2: Sora knee + proud lip']
rows = [('(i) One cut, no stub', ['No: one cut, but the body’s top edge reaches the tip under it (the stub)', 'No: at the lip’s corners the cut runs into the nose’s round: 0–0.7 mm left, can’t be moulded', 'No: one cut, the same stub as 11:50', 'Yes: the lip overhangs 0.8 mm; nothing under it reaches the tip', 'Yes: as candidate 1']),
        ('(ii) Meets the nose’s outline without a corner', ['No: a %.0f mm knee, then square into the front face' % S_['r_min_side'], 'No: arrives at the tip at about 30°', 'Half: no knee (smallest radius 16.8 mm), but square into the front face', 'Yes: the cut runs on as the lip’s underside, which is the nose’s lower outline', 'Half: the Sora’s knee stays; then as candidate 1']),
        ('(iii) Reaches the very tip', ['Yes', 'Yes', 'Yes', 'Yes', 'Yes'])]
cx = [60, 700, 1440, 2180, 2920, 3660]; cw = 700
for j, c in enumerate(cols): sh.text(cx[j + 1], y0 + 50, c, size=19, weight=700, color=HERO_T if j >= 3 else INK)
yy = y0 + 70
for nm, cells in rows:
    sh.rule(60, yy, W_ - 60, yy)
    sh.text(cx[0], yy + 36, nm, size=19, weight=700, color=INK)
    for j, t in enumerate(cells):
        ok = t.startswith('Yes'); half = t.startswith('Half')
        col = HERO_T if ok else (SECOND if half else RED)
        words = t.split(' '); lines = ['']
        for wd in words:
            if len(lines[-1]) + len(wd) > 52: lines.append('')
            lines[-1] += ('' if not lines[-1] else ' ') + wd
        for k, ln in enumerate(lines): sh.text(cx[j + 1], yy + 36 + 26 * k, ln, size=18, weight=600 if k == 0 else 500, color=col if k == 0 else INK2)
    yy += 36 + 26 * 3
sh.rule(60, yy, W_ - 60, yy)
sh.text(60, yy + 40, 'In 3D all of them reach the tip; in the 2D side view the front gap was drawn as a separate little slot, which reads as unconnected. The 2D will be redrawn from whichever you pick.', size=19, weight=500, color=MUTE)
# 3. the renders
designs = [('sora', 'Your Sora V2 scan', ['= 11:50 ahead of 45 mm from the nose', '(Theseus today is within 0.2 mm)', 'knee r %.0f mm, then flat %.1f mm' % (S_['r_min_side'], S_['flat_run']), 'lip under the round %.2f mm' % S_['lip_min'], 'body flush under the lip'], INK),
           ('C_flush', 'C, as sent at 12:21', ['bends in on r 16.8 mm (smallest)', 'no flat; the lip’s corners +0.3 mm', 'lip %.2f mm at |x| %.0f (today 1.36)' % (NUM['C_flush']['lip_min'], NUM['C_flush']['lip_min_at_x']), 'body flush under the lip (the stub)'], INK),
           ('C_proud', 'Candidate 1: C + proud lip', ['C’s line, and the body tucked', '0.8 mm under the lip across the front,', 'fading out round the corners and', '4.5 mm down the face: the cut runs', 'on as the lip’s underside to the tip'], HERO_T),
           ('S_proud', 'Candidate 2: Sora knee + proud lip', ['the Sora’s own cut (knee r %.0f mm,' % S_['r_min_side'], 'flat %.1f mm), with the same' % NUM['S_flush']['flat_run'], '0.8 mm tuck under the lip:', 'the smallest change'], HERO_T)]
y = yy + 110
heads = ['From the side (user’s left)', 'From the front (centre line at the left edge)', 'From above (nose up)', '3/4 front']
xs = [520]
for k, (key, ttl, lines, col) in enumerate(designs):
    sh.text(60, y + 40, ttl, size=24, weight=800, color=col)
    for i, ln in enumerate(lines): sh.text(60, y + 80 + 28 * i, ln, size=19, weight=500, color=INK2)
    x = 520
    for v, hd in zip(('side', 'front', 'top', '34'), heads):
        img = crop_view(key, v)
        if k == 0: sh.label(x, y - 14, hd, size=17, color=MUTE)
        w, h = put(sh, img, x, y)
        x += w + 30
    y += 610 + 60
sh.text(60, y + 20, 'Built on the shell with the new arch and K3 corners (the rear and the side behind 40 mm from the nose are the same in every row). Proud lip: the trigger is untouched; the body’s front wall moves back as a whole (its thickness kept), so the USB-C opening’s top edge moves back up to 0.8 mm.', size=19, weight=500, color=MUTE)
sh.text(60, y + 50, 'Question: which nose: candidate 1 (C’s smooth bend + proud lip), candidate 2 (the Sora’s own knee + proud lip), or C without the tuck? And is a 0.8 mm overhang the right amount (the Viper V3 Pro’s is larger)?', size=21, weight=700, color=INK)
fn = '/home/claude/work/s2/s2_nose_study_%s.png' % time.strftime('%H%M')
sh.save(fn); print(fn)
