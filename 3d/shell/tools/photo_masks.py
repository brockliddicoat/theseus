import numpy as np, cv2
from PIL import Image
P='/home/claude/theseus/refs/photos/'
def mask_dark(path, thr, close=5):
    im = np.asarray(Image.open(path).convert('RGB')).astype(float)
    g = im.mean(2)
    m = (g < thr).astype(np.uint8)
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((close,close),np.uint8))
    n, lab, st, _ = cv2.connectedComponentsWithStats(m)
    k = 1 + np.argmax(st[1:, cv2.CC_STAT_AREA])
    m = (lab == k).astype(np.uint8)
    # fill holes
    ff = m.copy(); h, w = m.shape
    mm = np.zeros((h+2, w+2), np.uint8); cv2.floodFill(ff, mm, (0,0), 1)
    m = m | (1 - ff)
    return m.astype(bool), g
if __name__ == '__main__':
    for name, thr in [('sora-v2-top.webp', 200), ('sora-v2-side.webp', 200), ('sora-v2-three-quarter-rtings.jpg', 110)]:
        m, g = mask_dark(P+name, thr)
        ys, xs = np.nonzero(m)
        print(name, 'bbox x[%d,%d] y[%d,%d]'%(xs.min(), xs.max(), ys.min(), ys.max()), 'area', m.sum())
        Image.fromarray((m*255).astype(np.uint8)).save('work/refs/mask_'+name.split('.')[0]+'.png')
