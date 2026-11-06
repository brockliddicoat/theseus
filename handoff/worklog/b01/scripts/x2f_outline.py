# X2F CrazyLight top outline, mm, nose up (y from the nose at 0 to the cut at 87.5), from the X2-family profile traced off
# Brock's photo (pulsar-x2h-crazylight-base.png), scaled to the X2F's 61.1 mm width and cut flat at its 87.5 mm length.
prof = [[0.0, 1.38], [2.0, 15.18], [4.0, 20.35], [6.0, 23.11], [8.0, 25.18], [10.0, 26.56], [12.0, 27.94], [14.0, 28.63], [16.1, 29.32], [18.1, 29.67], [20.1, 29.84], [22.1, 30.01], [24.1, 30.36], [26.1, 30.36], [28.1, 30.36], [30.1, 30.36], [32.1, 30.36], [34.1, 30.36], [36.1, 30.36], [38.1, 30.36], [40.1, 30.53], [42.1, 30.88], [44.1, 30.88], [46.2, 30.88], [48.2, 30.88], [50.2, 30.88], [52.2, 30.88], [54.2, 30.88], [56.2, 30.36], [58.2, 30.88], [60.2, 31.05], [62.2, 31.05], [64.2, 31.05], [66.2, 31.22], [68.2, 31.22], [70.2, 31.22], [72.2, 31.22], [74.2, 31.39], [76.3, 31.39], [78.3, 31.74], [80.3, 32.08], [82.3, 32.26], [84.3, 32.43], [86.3, 32.43], [88.3, 32.43], [90.3, 32.43], [92.3, 32.08], [94.3, 31.74], [96.3, 31.05], [98.3, 30.53], [100.3, 29.67], [102.3, 28.81], [104.3, 27.94], [106.4, 26.56], [108.4, 24.84], [110.4, 22.77], [112.4, 20.35], [114.4, 17.59], [116.4, 14.83], [118.4, 10.69], [120.4, 2.41]]
# smooth the pixel steps with a small running mean (keep the ends)
import math
ys = [p[0] for p in prof]; ws = [p[1] for p in prof]
sm = ws[:]
for i in range(2, len(ws) - 2): sm[i] = sum(ws[i-2:i+3]) / 5
# a round nose: replace the first 3 mm with a circle-ish ramp from the traced values
full_w = 2 * max(sm)
k = 61.1 / full_w
cut = 87.5
pts = [(y, w * k) for y, w in zip(ys, sm) if y <= cut]
w_cut = None
for (y0, w0), (y1, w1) in zip(zip(ys, sm), list(zip(ys, sm))[1:]):
    if y0 <= cut <= y1: w_cut = (w0 + (w1 - w0) * (cut - y0) / (y1 - y0)) * k
pts.append((cut, w_cut))
print('X2F half width at cut %.2f, max %.2f' % (w_cut, max(w for _, w in pts)))
print('const B01_X2F_HALF = [' + ', '.join('[%.1f, %.2f]' % (y, w) for y, w in pts) + '];')
# the full X2 for the "cut" demonstration (scaled the same, full 120 mm length scaled to the X2's 120.0 / 120.4)
pts2 = [(y * 120.0 / 120.4, w * k) for y, w in zip(ys, sm)]
print('const B01_X2_HALF = [' + ', '.join('[%.1f, %.2f]' % (y, w) for y, w in pts2) + '];')
