# Copy of S2's nose study with the four RTINGS product photos (third-party) replaced by labelled placeholders.
import sys
from PIL import Image, ImageDraw, ImageFont
src, dst = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGB')
d = ImageDraw.Draw(im)
f1 = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 30)
f2 = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 26)
names = ['Sora V2', 'Viper V3 Pro', 'Pulsar X2 V2', 'G Pro X Superlight 2']
for k, name in enumerate(names):
    x0, y0 = 59 + 710 * k, 244
    x1, y1 = x0 + 671, 638
    d.rectangle([x0, y0, x1, y1], fill=(226, 226, 230), outline=(190, 190, 196), width=2)
    lines = [('RTINGS product photo', f1, (60, 60, 66)), (name, f1, (60, 60, 66)),
             ('removed from this copy (third-party image;', f2, (90, 90, 96)),
             ('the sheet as sent is kept outside the repo)', f2, (90, 90, 96))]
    hs = [d.textbbox((0, 0), t, font=f)[3] for t, f, _ in lines]
    y = (y0 + y1) // 2 - (sum(hs) + 14 * (len(lines) - 1)) // 2
    for (t, f, c), h in zip(lines, hs):
        w = d.textbbox((0, 0), t, font=f)[2]
        d.text(((x0 + x1) // 2 - w // 2, y), t, font=f, fill=c)
        y += h + 14
im.save(dst, quality=95, optimize=True, progressive=True)
print(dst, im.size)
