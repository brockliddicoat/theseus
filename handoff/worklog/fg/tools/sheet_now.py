"""The 'now' contact sheet: every finger in the film as it is, at the size each slide shows it (1:1 unless noted)."""
from PIL import Image, ImageDraw, ImageFont
import os
FG = '/home/claude/work/fg'
F = lambda s: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if s < 0 else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', abs(s))
c = lambda p: os.path.join(FG, 'crops', p)
sections = [
  ("The kit's finger from the side (the most common view)", [
    (c('001_b01_compromise_3.5_0.png'), 'b01_compromise', 'paper · 5.1 px/mm · tilted onto a top, no surface given'),
    (c('017_b02_direct_2.25_0.png'), 'b02_direct', 'night · 12.5 px/mm · on the trigger'),
    (c('m_b02_wedge.png'), 'b02_wedge', 'paper · 12.5 px/mm · on the trigger'),
    (c('039_b05_material_2.5_0.png'), 'b05_material', 'paper · 4.5 px/mm'),
    (c('042_b05_cubed_1.75_0.png'), 'b05_cubed', 'night · 4.6 px/mm'),
    (c('044_b05_nopick_3.25_0.png'), 'b05_nopick', 'night · 9 px/mm · with b05\'s glow'),
    (c('045_b05_hotspot_0.75_0.png'), 'b05_hotspot', 'paper · 8.7 px/mm'),
    (c('048_b06_lattice_4.75_0.png'), 'b06_lattice', 'paper · 6.2 px/mm · pointing straight down'),
    (c('049_b06_light_1_0.png'), 'b06_light', 'night · 6.2 px/mm'),
    (c('050_b06_arch_1_0.png'), 'b06_arch (egg, top)', 'night · 4.6 px/mm'),
    (c('050_b06_arch_1_1.png'), 'b06_arch (egg, bottom)', 'night · 4.6 px/mm'),
    (c('050_b06_arch_6_0.png'), 'b06_arch', 'night · 6.6 px/mm'),
    (c('051_b06_thrust_5.75_0.png'), 'b06_thrust', 'paper · 6.6 px/mm'),
    (c('m_b03_thumb.png'), 'b03_side: the thumb', 'paper · 24 px/mm · the index finger scaled up'),
  ]),
  ("The kit's finger from above, and end-on", [
    (c('012_b02_cutouts_3.25_0.png'), 'b02_cutouts', 'paper · 8.7 px/mm'),
    (c('013_b02_seams_2.5_0.png'), 'b02_seams', 'night · 13 px/mm'),
    (c('020_b02_rails_3.5_0.png'), 'b02_rails', 'night · 8.7 px/mm'),
    (c('m_b08_uv.png'), 'b08_uv', 'paper · 4.4 px/mm'),
    (c('m_b08_grip_0.png'), 'b08_grip (frame one)', 'night · 4.9 px/mm'),
    (c('m_b07_arms2.png'), 'b07_arms: the squeeze', 'paper · 7.9 px/mm · nails up, pressing sideways'),
    (c('m_b02_flush_ends.png'), 'b02_flush: end-on', 'paper · 14 to 19 px/mm · kit "end" (left) and b02\'s own pad (top)'),
  ]),
  ("The builders' own fingertips, and the small sizes", [
    (c('m_b02_seams_loupe.png'), 'b02_seams loupe: b02_fingerEndMM', 'night · 16.7 px/mm'),
    (c('m_b08_tape_tip.png'), 'b08_tape: b08_tip', 'paper · 150 px/mm · a section'),
    (c('m_b08_grip_print.png'), 'b08_grip: b08_print', 'night · the finger becomes its print'),
    (c('m_b08_gripmap_print.png'), 'b08_gripmap: b08_print', 'night'),
    (c('m_b07_newton_tiles.png'), 'b07_newton: the ball', 'paper · "a fingertip is that ball"'),
    (c('059_b07_tolerance_10.5_1.png'), 'b07_tolerance', 'night · 1.6 px/mm'),
    (c('001_b01_compromise_6_0.png'), 'b01_compromise icon', 'paper · 0.55 px/mm'),
  ]),
]
W, gap, lh = 1920, 22, 50
fT, fS, fL, fl = F(-34), F(-22), F(-17), F(15)
rows_all = []
y = 120
blocks = []
for title, items in sections:
    blocks.append(('title', title, y)); y += 46
    x, rowh, row = gap, 0, []
    for p, lab, sub in items:
        im = Image.open(p).convert('RGB'); note = ''
        if im.height > 520: k = 520 / im.height; im = im.resize((int(im.width * k), 520), Image.LANCZOS); note = f'  (shown at {k:.2f}x)'
        if im.width > W - 2 * gap: k = (W - 2 * gap) / im.width; im = im.resize((W - 2 * gap, int(im.height * k)), Image.LANCZOS); note = f'  (shown at {k:.2f}x)'
        w = max(im.width, 260)
        if row and x + w > W - gap: blocks.append(('row', row, y)); y += rowh + lh + gap; x, rowh, row = gap, 0, []
        row.append((im, lab, sub + note, x)); x += w + gap; rowh = max(rowh, im.height)
    if row: blocks.append(('row', row, y)); y += rowh + lh + gap
    y += 14
H = y + 20
S = Image.new('RGB', (W, H), (122, 122, 128)); d = ImageDraw.Draw(S)
d.text((gap, 30), "F49.1  Today's fingers, at the size each slide shows them (1:1 unless noted)", fill=(255, 255, 255), font=fT)
d.text((gap, 76), 'Film build 2026-11-06 11:11 (105 slides). 25 fingers on 23 slides: the kit\'s finger (side, top, end) and five private ones.', fill=(235, 235, 238), font=fl)
for b in blocks:
    if b[0] == 'title': d.text((gap, b[2]), b[1], fill=(255, 255, 255), font=fS)
    else:
        for im, lab, sub, x in b[1]:
            d.text((x, b[2]), lab, fill=(255, 255, 255), font=fL); d.text((x, b[2] + 22), sub, fill=(225, 225, 230), font=fl)
            S.paste(im, (x, b[2] + lh))
out = os.path.join(FG, 'sheets', 'fg_now.png'); os.makedirs(os.path.dirname(out), exist_ok=True); S.save(out); print(out, S.size)
