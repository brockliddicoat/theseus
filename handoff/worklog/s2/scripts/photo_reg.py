"""Register the Sora V2 side photo (refs) onto the raw scan's side render (known ortho camera, 6.5 px/mm), so the photo
can be drawn in scene mm (Z, Y). Saves the 2x3 affine photo px -> scan-render px and a check image."""
import sys, json, numpy as np, cv2
from PIL import Image
sys.path.insert(0, '/home/claude/theseus/3d/shell/tools')
from fitphoto import fit_photo
from common import *
REF = REPO + '/3d/shell/work/refs/'
scan = np.asarray(Image.open(SCAN_PX).convert('RGB')).astype(int)
bg = scan[5, 5]
tm = (np.abs(scan - bg).sum(2) > 18)
from scipy.ndimage import binary_fill_holes, binary_opening
tm = binary_fill_holes(binary_opening(tm, iterations=1))
# the scan render's wheel pokes above the shell: keep it (the photo has the wheel too)
pm = np.asarray(Image.open(REF + 'mask_sora-v2-side.png')) > 127
w, M, iou, p = fit_photo(pm, tm, rot=True)
print('IoU %.4f  scale %.5f scanpx/photopx  rot %.3f deg' % (iou, np.sqrt(abs(np.linalg.det(M[:, :2]))), np.degrees(p[3])))
json.dump(dict(M=M.tolist(), iou=iou), open('/home/claude/work/s2/photo_reg.json', 'w'))
ov = np.zeros(tm.shape + (3,), np.uint8); ov[:] = 245
ov[tm & ~w] = (220, 60, 60); ov[w & ~tm] = (60, 110, 230); ov[w & tm] = (150, 150, 150)
Image.fromarray(ov).save('/home/claude/work/s2/shots/photo_reg_check.png')
