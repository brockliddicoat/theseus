"""compose /home/claude/work/h1/review.png from the panels (before beside after)"""
from PIL import Image, ImageDraw, ImageFont
R = '/home/claude/work/h1/'; P = R + 'review_parts/'
F = lambda s, b=False: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf' % ('-Bold' if b else ''), s)
BG, INK, MUTE, HERO = '#F5F5F7', '#17181B', '#6E7076', '#1F6FEB'


def fit(im, w, h, bg=BG):
    im = im.convert('RGB'); k = min(w / im.width, h / im.height); im = im.resize((max(1, int(im.width * k)), max(1, int(im.height * k))), Image.LANCZOS)
    out = Image.new('RGB', (w, h), bg); out.paste(im, ((w - im.width) // 2, (h - im.height) // 2)); return out


W, PW, PH, M = 2040, 640, 900, 20
rows = []
def row(title, panels, h=PH):
    """panels: [(image or None, caption, note)]"""
    img = Image.new('RGB', (W, h + 120), BG); d = ImageDraw.Draw(img)
    d.text((M, 8), title, font=F(30, True), fill=INK)
    x = M
    for im, cap, note in panels:
        if isinstance(im, Image.Image): img.paste(fit(im, PW, h), (x, 56))
        elif isinstance(im, str):
            for k, line in enumerate(im.split('\n')): d.text((x + 10, 70 + k * 31), line, font=F(21, line.endswith(':')), fill=INK if not line.startswith('  ') else MUTE)
        d.text((x, 56 + h + 6), cap, font=F(22, True), fill=HERO if cap.startswith('AFTER') else INK)
        if note: d.text((x, 56 + h + 36), note, font=F(19), fill=MUTE)
        x += PW + M
    rows.append(img)


O = lambda f: Image.open(f)
row('1. The board from above: v1 (before) and board plan 5, both switch versions (after)', [
    (O(R + 'v1_top.png'), 'BEFORE: the v1 board (git HEAD), schematic', 'module mid-board, turned; sensor at the rear'),
    (O(P + 'after_board_top_A.png'), 'AFTER: plan 5, A (switch in its window)', 'boardMM({ side: "top" }), from the PCB tools'),
    (O(P + 'after_board_top_B.png'), 'AFTER: plan 5, B (edge switch, renders)', 'boardMM({ variant: "B" })')])
row('2. The underside: the old art (before) adapted to plan 5 (after), every triangle filleted', [
    (O(R + 'before_underside.png'), 'BEFORE: the v1 underside (render, plan-5 sheet)', ''),
    (O(P + 'after_board_bottom_A.png'), 'AFTER: plan 5, A, seen from below', 'QR, wordmark, fab block, ON/OFF, rail labels, LT/RT'),
    (O(P + 'after_board_bottom_B.png'), 'AFTER: plan 5, B, seen from below', '')])
notes = '\n'.join([
    'Board (plan 5, F30.23/F30.25):',
    '  one mirrored outline, 1991.6 mm2; notch depth 3.61;',
    '  chamfers 35.24 deg, fillets at tangent 1.0;',
    '  rear notch flat 13.09 = the side notches;',
    '  bay x +/-7.20, z 27.45..44.13, gold trim 0.35;',
    '  USB-C 1.05 back, hangs 1.60; MH in mirror pairs;',
    '  DRC 0 (A and B); every net routed.',
    'Sensor and lens:',
    '  mouse z 1.12 -> 16.57 (layout 19.45);',
    '  lens face 2.40 mm over the pad (was 1.0 / 1.28).',
    'Battery (LP402535JU, 35 x 25 x 4.0):',
    '  2.23 mm back: centre mouse z -22.72 -> -24.95;',
    '  3.84 mm clear of the shell in the tail;',
    '  centre of mass z -0.87 -> -1.61 mm',
    '  (plan 5 with the battery unmoved: -1.00).',
    'Mass: board + parts 6.66 g (v1 6.28);',
    '  with the wheel assembly 8.94 g (Sora 8.29).'])
row('3. The key plan: board, sensor, antenna keep-out, battery (keyPlanMM, from KEY_PARTS)', [
    (O(P + 'before_key.png'), 'BEFORE: the key plan this morning', 'board a rounded box; sensor at z 0; keep-out behind'),
    (O(P + 'after_key.png'), 'AFTER: plan 5 outline, sensor forward', 'keep-out ahead of the module; battery 2.23 back'),
    (notes, 'THE NUMBERS', '')])
row('4. The GT01 side profile (clk_gt01MM; 3d/parts/gt01.js has the same numbers)', [
    (O(P + 'before_gt01.png'), 'BEFORE: v23, walls 0.45 mm', 'the slot 1.07 mm higher than Gateron\'s render'),
    (O(P + 'after_gt01.png'), 'AFTER: walls 0.70 mm, the render\'s slot', 'holes r 0.76 / 0.79; webs 0.92 or more; 3 pins'),
    ('GT01 bottom housing (F30.18, F30.24):\n  one wall 0.70 mm: the median web measured\n  on Gateron\'s side-on render (0.39..1.27);\n  every cut-out 0.70 from the edges;\n  the cover\'s end walls stay 0.45 (D2F cover);\n  side profile still the traced one (F28.1);\n  plunger cap 2.1 across x 1.5 along (turned);\n  board sections now black with gold rings.', 'NOTES', '')], h=540)
H = sum(r.height for r in rows) + 90
out = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(out)
d.text((M, 20), 'H1 review: board plan 5 (A and B), battery and balance, sensor forward, GT01 walls', font=F(32, True), fill=INK)
y = 80
for r in rows: out.paste(r, (0, y)); y += r.height
out.save(R + 'review.png'); print(R + 'review.png', out.size)
