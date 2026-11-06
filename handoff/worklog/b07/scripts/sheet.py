# contact sheet of shots: python3 sheet.py out.jpg cols width file...
import sys
from PIL import Image
out, cols, wd = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]); fs = sys.argv[4:]
ims = [Image.open(f).convert('RGB') for f in fs]
h = int(wd * 1080 / 1920)
W = Image.new('RGB', (cols * wd, ((len(ims) + cols - 1) // cols) * h), 'white')
for i, im in enumerate(ims): W.paste(im.resize((wd, h), Image.LANCZOS), ((i % cols) * wd, (i // cols) * h))
W.save(out, quality=88)
