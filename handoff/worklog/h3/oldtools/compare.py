# "Sora V2 layout vs Theseus layout": Brock's Sora V2 PCB photo next to the Theseus top render, same scale and
# orientation (top view, nose up, user's right on the right), with numbered callouts on what changed.
#   python3 tools/compare.py [theme]      -> shots/compare_sora_v2_vs_theseus_<theme>.png
# Inputs: refs/photos/sora-v2-pcb-8.29g.jpg (de-rotated 0.72 deg, 15.15 px/mm, see board.py) and
# shots/top_<theme>.png (ortho top, halfh 31.5 mm, centre at board z 24.6, 2x).
import os, sys, math
from PIL import Image, ImageDraw, ImageFont, ImageFilter
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from board import S, XC, YT, ZF, SORA_PARTS

THEME = sys.argv[1] if len(sys.argv) > 1 else 'paper'
ROOT = os.path.abspath(os.path.join(HERE, '..'))
PHOTO = os.path.abspath(os.path.join(ROOT, '..', '..', 'refs', 'photos', 'sora-v2-pcb-8.29g.jpg'))
RENDER = os.path.join(ROOT, 'shots', 'top_%s.png' % THEME)
if not os.path.exists(RENDER):          # fall back to the transparent top on the theme colour
    RENDER = os.path.join(ROOT, 'shots', 'top_transparent.png')
C = dict(paper=dict(bg=(0xF7, 0xF6, 0xF2), ink=(0x11, 0x11, 0x11), ink2=(0x2E, 0x2E, 0x2C), mute=(0x66, 0x65, 0x5F),
                    faint=(0x8A, 0x89, 0x83), hair=(0xDD, 0xDC, 0xD6)),
         night=dict(bg=(0x0D, 0x0E, 0x0F), ink=(0xF3, 0xF2, 0xEE), ink2=(0xCF, 0xCE, 0xC9), mute=(0x96, 0x95, 0x8F),
                    faint=(0x6E, 0x6D, 0x68), hair=(0x26, 0x27, 0x2A)))[THEME]
YEL = (0xFD, 0xC3, 0x16)
FD = '/usr/share/fonts/opentype/inter/'
MONO = '/mnt/skills/examples/canvas-design/canvas-fonts/JetBrainsMono-Bold.ttf'
MONO_R = '/mnt/skills/examples/canvas-design/canvas-fonts/JetBrainsMono-Regular.ttf'
if not os.path.exists(MONO):
    MONO = MONO_R = '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf'
F = lambda p, s: ImageFont.truetype(p, s)

K = 22.0                                  # output px per mm
X0, X1, Z0, Z1 = -24.0, 24.0, -6.5, 56.0  # mm window (layout frame: x = user's right)
PW, PH = int((X1 - X0) * K), int((Z1 - Z0) * K)


DEROT = os.path.join(ROOT, 'tools', 'sora_derot.png')     # the de-rotated photo the outline was traced on


def photo_panel():
    im = Image.open(DEROT).convert('RGB')
    box = (XC + X0 * S, YT + (ZF - Z1) * S, XC + X1 * S, YT + (ZF - Z0) * S)
    return im.crop(tuple(int(round(v)) for v in box)).resize((PW, PH), Image.LANCZOS)


def render_panel():
    im = Image.open(RENDER).convert('RGBA')
    W, H = im.size
    k = H / 63.0                                  # px per mm (halfh 31.5)
    u0, u1 = W / 2 + X0 * k, W / 2 + X1 * k
    v0, v1 = H / 2 - (Z1 - 24.6) * k, H / 2 - (Z0 - 24.6) * k
    crop = im.crop((int(round(u0)), int(round(v0)), int(round(u1)), int(round(v1)))).resize((PW, PH), Image.LANCZOS)
    bg = Image.new('RGBA', crop.size, C['bg'] + (255,)); bg.alpha_composite(crop)
    return bg.convert('RGB')


def mm2px(x, z, ox, oy):
    return ox + (x - X0) * K, oy + (Z1 - z) * K


def sora_c(name):
    x0, z0, x1, z1 = SORA_PARTS[name]          # (min x, min z, max x, max z) in mm
    return ((x0 + x1) / 2, (z0 + z1) / 2)


# callouts: (number, sora anchor (x,z) or None, theseus anchor (x,z), label offset dir)
# (number, sora anchor (x, z) mm or None, theseus anchor, bubble offset in px (sora), bubble offset (theseus))
CALL = [
    (1, sora_c('SW L (Omron D2FP-FN2)'), (-16.0, 39.6), (-40, -60), (-40, -60)),
    (2, sora_c('MCU nRF52840'), (-3.6, 25.2), (-62, -30), (-70, -26)),
    (3, sora_c('Sensor PAW3395 + lens'), (-2.6, 6.2), (-62, -24), (-70, -20)),
    (4, None, (9.6, 11.2), None, (74, -62)),
    (5, sora_c('Battery conn.'), (14.0, 3.2), (52, -40), (40, -64)),
    (6, sora_c('Side-btn conn.'), (-12.0, 3.4), (-44, -46), (-40, -64)),
    (7, sora_c('Encoder (TTC)'), (-9.0, 37.75), (-56, 52), (-58, 52)),
    (8, (10.73, 20.1), (10.73, 20.1), (60, -30), (-64, 46)),
]
LEG = [
    (1, 'MAIN SWITCHES', 'Omron D2FP-FN2, soldered', 'Gateron GT01 (representative) in Mill-Max 3305 sockets, wedge-tilted 20° (#2, #14)'),
    (2, 'RADIO', 'nRF52840 chip, mid-board', 'Raytac AN54LM-20A module (nRF54LM20A, chip antenna, certs intended), moved up to the wheel bay (#68, #77)'),
    (3, 'SENSOR', 'PAW3395 + its lens', 'next-gen PixArt FrameSync-class sensor (proposal), smaller clip-on lens, near the centre (#37)'),
    (4, 'POWER', 'separate charger + regulator', 'Nordic nPM1300 PMIC: charger (JEITA + NTC), 2 bucks, fuel gauge, 22 V transient OVP; only 2 inductors + caps'),
    (5, 'BATTERY', 'connector at the rear', 'JST SH header turned sideways (#71); battery leads lightly braided (#69)'),
    (6, 'SIDE BUTTONS', 'connector at the rear', 'braided 3-wire lead into a JST SH, no FPC (#51)'),
    (7, 'WHEEL', 'TTC mechanical encoder', 'optical encoder + magnesium wheel (parts builder, proposal)'),
    (8, 'POWER SWITCH', 'unmarked slide', 'ON / OFF printed at the switch (#100)'),
]


def bubble(d, x, y, n, r=17, fill=None, ink=None):
    fill = fill or C['ink']; ink = ink or C['bg']
    d.ellipse((x - r, y - r, x + r, y + r), fill=fill)
    f = F(MONO, 20)
    d.text((x, y + 1), str(n), font=f, fill=ink, anchor='mm')


def main():
    pad, gap, head, foot = 70, 90, 210, 0
    W = pad * 2 + PW * 2 + gap
    leg_rows = (len(LEG) + 1) // 2
    leg_h = 70 + leg_rows * 110
    H = head + PH + 70 + leg_h + 40
    can = Image.new('RGB', (W, H), C['bg'])
    d = ImageDraw.Draw(can)
    # header
    d.text((pad, 58), 'MAIN PCB  ·  LAYOUT', font=F(MONO, 24), fill=C['mute'])
    tf = F(FD + 'InterDisplay-Black.otf', 64)
    t1 = 'SORA V2 LAYOUT  VS  '
    d.text((pad, 96), t1, font=tf, fill=C['ink'])
    w1 = d.textlength(t1, font=tf)
    t2 = 'THESEUS'
    w2 = d.textlength(t2, font=tf)
    d.rectangle((pad + w1 - 8, 100, pad + w1 + w2 + 10, 168), fill=YEL)
    d.text((pad + w1, 96), t2, font=tf, fill=(0x11, 0x11, 0x11))
    d.text((pad + w1 + w2 + 40, 118), 'same outline, same scale (22 px/mm), top view, nose up', font=F(FD + 'Inter-Medium.otf', 28), fill=C['ink2'])
    # panels
    oyp = head
    oxL, oxR = pad, pad + PW + gap
    can.paste(photo_panel(), (oxL, oyp))
    can.paste(render_panel(), (oxR, oyp))
    d.text((oxL, oyp + PH + 18), "SORA V2 (BROCK'S PHOTO, PCB + WHEEL 8.29 G)", font=F(MONO, 21), fill=C['mute'])
    d.text((oxR, oyp + PH + 18), 'THESEUS MAIN PCB (RENDER)', font=F(MONO, 21), fill=C['mute'])
    # scale bar (10 mm) under the right panel
    sx, sy = oxR + PW - 10 * K, oyp + PH + 30
    d.line((sx, sy, sx + 10 * K, sy), fill=C['ink2'], width=3)
    for xx in (sx, sx + 10 * K):
        d.line((xx, sy - 7, xx, sy + 7), fill=C['ink2'], width=3)
    d.text((sx + 5 * K, sy + 12), '10 MM', font=F(MONO, 18), fill=C['mute'], anchor='ma')
    # callouts
    for n, sa, ta, so, to in CALL:
        for anchor, ox, off in ((sa, oxL, so), (ta, oxR, to)):
            if anchor is None:
                continue
            x, y = mm2px(anchor[0], anchor[1], ox, oyp)
            bx, by = x + off[0], y + off[1]
            bx = min(max(bx, ox + 22), ox + PW - 22)
            d.line((x, y, bx, by), fill=YEL, width=3)
            d.ellipse((x - 6, y - 6, x + 6, y + 6), fill=YEL)
            bubble(d, bx, by, n, fill=YEL, ink=(0x11, 0x11, 0x11))
    # legend: two columns
    ly = oyp + PH + 80
    d.line((pad, ly, W - pad, ly), fill=C['hair'], width=2)
    colw = (W - 2 * pad - gap) / 2
    for i, (n, title, sora, thes) in enumerate(LEG):
        col, row = i // leg_rows, i % leg_rows
        x = pad + col * (colw + gap)
        y = ly + 30 + row * 110
        bubble(d, x + 17, y + 17, n, fill=YEL, ink=(0x11, 0x11, 0x11))
        d.text((x + 50, y + 2), title, font=F(MONO, 21), fill=C['ink'])
        tw = d.textlength(title, font=F(MONO, 21))
        d.text((x + 50 + tw + 14, y + 3), 'was: ' + sora, font=F(MONO_R, 19), fill=C['faint'])
        # wrap the Theseus line to the column width
        f = F(FD + 'Inter-Medium.otf', 23)
        words, line, lines = thes.split(), '', []
        for w_ in words:
            t = (line + ' ' + w_).strip()
            if d.textlength(t, font=f) > colw - 60:
                lines.append(line); line = w_
            else:
                line = t
        lines.append(line)
        for j, ln in enumerate(lines[:2]):
            d.text((x + 50, y + 34 + j * 28), ln, font=f, fill=C['ink2'])
    out = os.path.join(ROOT, 'shots', 'compare_sora_v2_vs_theseus_%s.png' % THEME)
    can.save(out)
    print(out, can.size)


if __name__ == '__main__':
    main()
