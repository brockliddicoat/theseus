# b09_radio options: antenna clearance to the wheel's metal and to the battery, board-local mm (z to the nose, h over the board)
import math, json
AXLE, AH, R, HA, ALEN, MODH = 37.75, 12.0, 22.74 / 2, 0.8, 3.5, 13.3
def wheel(zf): return math.hypot(AXLE - zf, AH - HA) - R
def batt(zf, bF, bH0, bH1): return math.hypot(max(0.0, zf - ALEN - bF), max(0.0, bH0 - HA, HA - bH1))
def zf_for_wheel(c): return AXLE - math.sqrt((c + R) ** 2 - (AH - HA) ** 2)          # front end for wheel clearance c
cases = {
  "H2 now (snapshot: 2.03 mm back of H1's place, no rise)": dict(bF=-11.60, bH0=0.43, bH1=4.43),
  "F42.1 as the integrator relayed (3.01 fwd, 1.5 up)": dict(bF=-6.56, bH0=1.93, bH1=5.93),
}
out = {}
for name, b in cases.items():
    zf0 = 4.80 + MODH / 2
    A = dict(zf=zf0, wheel=wheel(zf0), batt=batt(zf0, **b))
    # balanced: move the module so both clearances are equal (bisection on zf)
    lo, hi = zf0 - 10, zf0 + 10
    for _ in range(80):
        m = (lo + hi) / 2
        if wheel(m) > batt(m, **b): lo = m
        else: hi = m
    zc = (lo + hi) / 2; Cb = dict(zf=zc, shift=zc - zf0, wheel=wheel(zc), batt=batt(zc, **b))
    # 20 / 20: the front end for 20 mm from the wheel, then where the battery's front must be
    zf20 = zf_for_wheel(20.0); dh = max(0.0, b['bH0'] - HA, HA - b['bH1'])
    bF20 = zf20 - ALEN - math.sqrt(400 - dh * dh)
    Bo = dict(zf=zf20, moduleShift=zf20 - zf0, moduleCentre=zf20 - MODH / 2, moduleRear=zf20 - MODH, batteryFront=bF20, batteryShift=bF20 - b['bF'], wheel=wheel(zf20), batt=batt(zf20, bF20, b['bH0'], b['bH1']))
    out[name] = dict(A=A, balanced=Cb, both20=Bo)
for k, v in out.items():
    print('==', k)
    for kk, vv in v.items(): print('  ', kk, {a: round(b, 2) for a, b in vv.items()})
# the battery's mass shift on the centre of mass (8 g of 29.31 g)
print('CoM per mm of battery move:', round(8 / 29.31, 3), 'mm')
json.dump(out, open('/home/claude/work/p1/opts/opts.json', 'w'), indent=1)
