"""contact sheet: python3 sheet.py out.png cols w file1 file2 ... (each downscaled to w x w*9/16, labelled)"""
import sys
from PIL import Image, ImageDraw
out, cols, w = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]); fs = sys.argv[4:]
h = w * 9 // 16; rows = (len(fs) + cols - 1) // cols
S = Image.new('RGB', (cols * w, rows * (h + 22)), (128, 128, 128)); D = ImageDraw.Draw(S)
for i, f in enumerate(fs):
    im = Image.open(f).convert('RGB').resize((w, h), Image.LANCZOS); x, y = (i % cols) * w, (i // cols) * (h + 22)
    S.paste(im, (x, y + 22)); D.text((x + 4, y + 4), f.split('/')[-1], fill=(255, 255, 255))
S.save(out); print(out, S.size)
