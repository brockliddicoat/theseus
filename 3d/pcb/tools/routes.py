# Hand routing for the Theseus PCB, plan 5 (mm, layout frame: x = the user's right, z forward).
# Layers: L1 top (signals + GND pour), L2 solid GND plane, L3 power + long signals, L4 bottom (GND pour + artwork).
# Widths: signals 0.15, USB pair 0.13 (90-ohm class), power 0.25-0.5.
import math

ROUTES = []
VIAS = []


def _chamfer(pts, c):
    if c <= 0 or len(pts) < 3:
        return pts
    out = [pts[0]]
    for i in range(1, len(pts) - 1):
        (x0, z0), (x1, z1), (x2, z2) = pts[i - 1], pts[i], pts[i + 1]
        a = (x1 - x0, z1 - z0); b = (x2 - x1, z2 - z1)
        la, lb = math.hypot(*a), math.hypot(*b)
        if la < 1e-6 or lb < 1e-6:
            continue
        cos = (a[0] * b[0] + a[1] * b[1]) / (la * lb)
        if abs(cos) < 0.2:      # ~90 deg corner -> 45 deg chamfer
            k = min(c, la * 0.45, lb * 0.45)
            out.append((x1 - a[0] / la * k, z1 - a[1] / la * k))
            out.append((x1 + b[0] / lb * k, z1 + b[1] / lb * k))
        else:
            out.append((x1, z1))
    out.append(pts[-1])
    return out


def R(net, pts, w=0.15, layer='L1', ch=0.3):
    pts = [tuple(map(float, p)) for p in pts]
    ROUTES.append(dict(net=net, pts=_chamfer(pts, ch), w=w, layer=layer))


def V(net, x, z, d=0.45, drill=0.2):
    VIAS.append(dict(net=net, x=float(x), z=float(z), d=d, drill=drill))


# =============================================================== USB-C (J1 at z 49.38: lands z 45.28, legs S1/S2 z 50.16, S3/S4 z 46.35)
# The wheel bay sits right behind the lands, so everything leaves forward, under the receptacle's body.
J1Z = 45.28
# VBUS: both pads join on L3 under the receptacle; the right pad also feeds the TVS, the bulk caps and the test pad on L1,
# and the left one carries VBUS on L3 out through the corridor between the receptacle's legs to the PMIC
R('VBUS', [(2.4, J1Z), (2.4, 47.55), (9.6, 47.55), (9.6, 46.4)], w=0.4, ch=0)
for x in (6.0, 7.3, 8.4):
    R('VBUS', [(x, 47.55), (x, 46.85)], w=0.3, ch=0)                     # D1, C1, C2 (their VBUS pads face the bus)
R('VBUS', [(-2.4, J1Z), (-2.4, 46.55)], w=0.4, ch=0)
V('VBUS', -2.4, 46.55, d=0.6, drill=0.3); V('VBUS', 2.4, 46.55, d=0.6, drill=0.3)
R('VBUS', [(-2.4, 46.55), (2.4, 46.55)], w=0.4, layer='L3', ch=0)
R('VBUS', [(-2.4, 46.55), (-2.4, 47.6), (-6.0, 47.6), (-7.925, 45.675)], w=0.4, layer='L3', ch=0)
# D+/D-: each land forward to a via, the pairs joined on L3 and run left through the corridor (DN 48.0, DP 48.45)
for x, z, n in ((-0.75, 47.15, 'USB_DN'), (0.25, 47.15, 'USB_DN'), (-0.25, 47.9, 'USB_DP'), (0.75, 47.9, 'USB_DP')):
    R(n, [(x, J1Z), (x, z)], w=0.13)
    V(n, x, z)
R('USB_DN', [(0.25, 47.15), (-0.75, 47.15), (-0.75, 48.0), (-6.9, 48.0)], w=0.13, layer='L3', ch=0)
R('USB_DP', [(0.75, 47.9), (-0.25, 47.9), (-0.25, 48.45), (-6.0, 48.45)], w=0.13, layer='L3', ch=0)
V('USB_DN', -6.9, 48.0); V('USB_DP', -6.0, 48.45)
# into the flow-through ESD (U4 turned 180: DN pins 3 -> 4 along z 46.85, DP pins 1 -> 6 along z 45.85), out past the
# test pads to the left channel (DN outer at x -13.2, DP at -12.9)
R('USB_DN', [(-6.9, 48.0), (-6.9, 46.85), (-8.12, 46.85)], w=0.13, ch=0.25)
R('USB_DP', [(-6.0, 48.45), (-6.0, 45.85), (-8.12, 45.85)], w=0.13, ch=0.25)
# CC1 / CC2 -> the 5.1 k pull-downs (Rd) beside the receptacle's right legs
R('CC1', [(-1.25, J1Z), (-1.25, 49.2)])
V('CC1', -1.25, 49.2)
R('CC1', [(-1.25, 49.2), (3.2, 49.2), (3.6, 48.8), (5.0, 48.8)], layer='L3', ch=0)
V('CC1', 5.0, 48.8)
R('CC1', [(5.0, 48.8), (5.55, 48.82)], ch=0)
R('CC2', [(1.75, J1Z), (1.75, 47.25)])
V('CC2', 1.75, 47.25)
R('CC2', [(1.75, 47.25), (1.75, 47.75), (7.3, 47.75), (7.3, 48.45)], layer='L3', ch=0.2)
V('CC2', 7.3, 48.45)
R('CC2', [(7.3, 48.45), (7.95, 48.22)], ch=0)


def bus(nets, cols, z_top, z_bot, layer='L1', w=0.15):
    """a straight vertical bus: nets[k] runs down column cols[k] from z_top[k] to z_bot[k]"""
    for n, x, a, b in zip(nets, cols, z_top, z_bot):
        R(n, [(x, a), (x, b)], w=w, layer=layer, ch=0)


# =============================================================== the left channel: the left switch, the encoder, USB (L1 above
# the front holes, L3 under the PMIC, up to L1 at the module's left side). 0.4 mm pitch, 45-degree jogs; inner -> outer:
LC = ['ENC_B', 'ENC_A', 'USB_DP', 'USB_DN', 'SW1_NO', 'SW1_NC']
LC_L1 = [-12.1, -12.5, -12.9, -13.3, -13.7, -14.1]           # on L1 between the encoder's pins and the switch's sockets
LC_VIA = [-11.6, -12.2, -12.8, -13.4, -14.0, -14.6]          # fanned to 0.6 mm for the vias (z 32.6)
LC_L3 = [-12.3, -12.7, -13.1, -13.5, -13.9, -14.3]           # on L3 between the front hole and the waist, under the PMIC
LC_ST = [-7.8, -8.2, -8.6, -9.0, -9.4, -9.8]                 # the staircase down to the module (L3)
LC_PAD = [3.7, 2.9, 2.1, 1.3, 0.5, -0.3]                     # U1 L6..L11
# entries
R('ENC_B', [(-11.15, 37.125), (LC_L1[0], 37.125)], ch=0)
R('ENC_A', [(-11.15, 38.375), (LC_L1[1], 38.375)], ch=0)
R('USB_DP', [(-9.68, 45.85), (LC_L1[2], 45.85)], w=0.13, ch=0)          # through TP7 (D+)
R('USB_DN', [(-9.68, 46.85), (LC_L1[3], 46.85)], w=0.13, ch=0)          # through TP6 (D-)
R('SW1_NO', [(-16.0, 39.6), (LC_L1[4], 39.6)], ch=0)
R('SW1_NC', [(-16.0, 34.52), (LC_L1[5], 34.52)], ch=0)
ENTRY = [37.125, 38.375, 45.85, 46.85, 39.6, 34.52]
for k, n in enumerate(LC):
    w = 0.13 if n.startswith('USB') else 0.15
    d = LC_VIA[k] - LC_L1[k]
    R(n, [(LC_L1[k], ENTRY[k]), (LC_L1[k], 33.8), (LC_VIA[k], 33.8 - abs(d)), (LC_VIA[k], 32.6)], w=w, ch=0)
    V(n, LC_VIA[k], 32.6)
    d3 = LC_L3[k] - LC_VIA[k]
    zs = 14.3; dd = LC_ST[k] - LC_L3[k]
    R(n, [(LC_VIA[k], 32.6), (LC_VIA[k], 32.3), (LC_L3[k], 32.3 - abs(d3)), (LC_L3[k], zs), (LC_ST[k], zs - dd),
          (LC_ST[k], LC_PAD[k]), (-7.2, LC_PAD[k])], w=w, layer='L3', ch=0)
    V(n, -7.2, LC_PAD[k])
    R(n, [(-7.2, LC_PAD[k]), (-4.95, LC_PAD[k])], w=w, ch=0)

# =============================================================== the PMIC's TWI and the side buttons into U1's upper left pads
TW = ['SDA', 'PMIC_INT', 'SCL']                  # PMIC pins 3, 2, 1 (z 20.2, 20.7, 21.2) -> U1 L1, L2, L3 (z 7.7, 6.9, 6.1)
TW_PIN = [20.2, 20.7, 21.2]
TW_C1 = [-13.45, -13.85, -14.25]                 # down the left of the PMIC (L1)
TW_C2 = [-9.0, -9.4, -9.8]                       # down to the module, left of the pull-ups
TW_PAD = [7.7, 6.9, 6.1]
for k, n in enumerate(TW):
    dd = TW_C2[k] - TW_C1[k]
    R(n, [(-12.65, TW_PIN[k]), (TW_C1[k], TW_PIN[k]), (TW_C1[k], 14.6), (TW_C2[k], 14.6 - dd), (TW_C2[k], TW_PAD[k]),
          (-4.95, TW_PAD[k])], ch=0)
# the pull-ups: R1 on SDA (the inner line) beside the keep-out, R2 on SCL (the outer line) at the PMIC's end
R('SDA', [(-9.0, 9.17), (-7.75, 9.17)], ch=0)
R('SCL', [(-14.25, 16.28), (-15.35, 16.28)], ch=0)
# J3 (side buttons): SB4 pin 2 (z 7.9) and SB5 pin 1 (z 6.9) -> U1 L4 (5.3), L5 (4.5), under the TWI's turns
R('SB4', [(-11.72, 7.9), (-10.3, 7.9), (-10.3, 5.3), (-4.95, 5.3)], ch=0.25)
R('SB5', [(-11.72, 6.9), (-10.7, 6.9), (-10.7, 4.5), (-4.95, 4.5)], ch=0.25)

# =============================================================== the sensor's SPI (PAW3970's right lands) -> U1 R1..R6 (L1)
SPI = ['SNS_RST', 'SNS_MISO', 'SNS_MOSI', 'SNS_SCK', 'SNS_CS', 'SNS_MOTION']   # sensor pins 16..11 (z 15.25 .. 21.25)
SPI_PIN = [15.25, 16.45, 17.65, 18.85, 20.05, 21.25]
SPI_C1 = [5.6, 6.0, 6.4, 6.8, 7.2, 7.6]                      # between the lands and the power switch's window
SPI_C2 = [6.8, 7.2, 7.6, 8.0, 8.4, 8.8]                      # clear of the antenna keep-out (x 6.6)
SPI_PAD = [7.7, 6.9, 6.1, 5.3, 4.5, 3.7]                     # U1 R1..R6
for k, n in enumerate(SPI):
    dd = SPI_C2[k] - SPI_C1[k]
    R(n, [(4.55, SPI_PIN[k]), (SPI_C1[k], SPI_PIN[k]), (SPI_C1[k], 14.0), (SPI_C2[k], 14.0 - dd), (SPI_C2[k], SPI_PAD[k]),
          (4.95, SPI_PAD[k])], ch=0)

# =============================================================== the right channel: the middle click and the right switch ->
# U1 R7..R9, down the right of the power switch's window, under it to the left of the rail test pads (L1)
RC = ['MID', 'SW2_NO', 'SW2_NC']
RC_C1 = [13.35, 13.75, 14.15]
RC_C2 = [9.2, 9.6, 10.0]
RC_PAD = [2.9, 2.1, 1.3]
R('MID', [(12.45, 37.75), (RC_C1[0], 37.75)], ch=0)
R('SW2_NO', [(16.0, 39.6), (RC_C1[1], 39.6)], ch=0)
R('SW2_NC', [(16.0, 34.52), (RC_C1[2], 34.52)], ch=0)
RC_ENTRY = [37.75, 39.6, 34.52]
import os as _os
VARIANT = (_os.environ.get('PCB_VARIANT') or 'A').strip().upper()
RC_DIAG = 17.9 if VARIANT != 'B' else 26.5     # B has no window: the channel turns in above where the edge switch sits
for k, n in enumerate(RC):
    dd = RC_C2[k] - RC_C1[k]
    R(n, [(RC_C1[k], RC_ENTRY[k]), (RC_C1[k], RC_DIAG), (RC_C2[k], RC_DIAG + dd), (RC_C2[k], RC_PAD[k]), (4.95, RC_PAD[k])], ch=0)

# =============================================================== round the PMIC (U2 at (-10.2, 19.45)): the bucks up to their
# inductors, the sense pins to the outputs, the charger and system rails down to their capacitors (L1, short and wide)
R('SW_B1', [(-11.45, 21.9), (-11.45, 23.67)], w=0.35, ch=0)                 # pin 31 -> L1
R('SW_B2', [(-8.95, 21.9), (-8.95, 23.67)], w=0.35, ch=0)                   # pin 26 -> L2
R('VDD_1V8', [(-11.95, 21.9), (-12.35, 22.55), (-13.3, 22.55), (-13.3, 25.23), (-12.0, 25.23)], w=0.2, ch=0)   # VOUT1 sense
R('VDD_1V8', [(-11.52, 25.23), (-11.52, 26.55)], w=0.3, ch=0)                                                    # L1 -> C32
R('VDD_SNS', [(-8.27, 25.23), (-8.27, 26.55)], w=0.3, ch=0)                                                     # L2 -> C33
R('VDD_SNS', [(-8.75, 25.23), (-6.3, 25.23), (-6.3, 23.65), (-4.55, 23.65)], w=0.3, ch=0.3)                    # -> sensor pin 1
R('VDD_SNS', [(-6.3, 25.23), (-6.6, 25.53), (-6.6, 26.22)], w=0.25, ch=0)                                       # C22
R('VDD_SNS', [(-6.3, 25.02), (-5.55, 25.02)], w=0.25, ch=0)                                                     # C21
R('VDD_SNS', [(-7.75, 21.2), (-6.95, 21.2), (-6.95, 25.23)], w=0.2, ch=0)                                     # VOUT2 sense (pin 24)
R('VDD_SNS', [(-8.45, 21.9), (-8.45, 22.5), (-7.25, 22.5), (-6.95, 22.2)], w=0.2, ch=0)                       # pin 25
R('VDD_SNS', [(-8.27, 26.55), (-7.8, 27.05), (-7.8, 27.5)], w=0.25, ch=0)                                       # TP5
R('VBUS', [(-11.95, 17.0), (-11.95, 16.4), (-11.45, 16.4), (-11.45, 17.0)], w=0.25, ch=0)                      # pins 9, 10
R('VBUS', [(-11.75, 16.4), (-11.75, 15.38)], w=0.3, ch=0)                                                       # C30
R('VBUSOUT', [(-10.95, 17.0), (-10.95, 15.38)], w=0.25, ch=0)                                                   # pin 11 -> C31
R('VBAT', [(-9.95, 17.0), (-9.95, 16.3), (-9.45, 16.3), (-9.45, 17.0)], w=0.25, ch=0)                          # pins 13, 14
R('VBAT', [(-9.7, 16.3), (-9.7, 15.48)], w=0.4, ch=0)                                                           # C36
R('VSYS', [(-8.95, 17.0), (-8.95, 16.3), (-8.45, 16.3), (-8.45, 17.0)], w=0.25, ch=0)                          # pins 15, 16
R('VSYS', [(-8.45, 16.3), (-8.45, 15.48), (-6.85, 15.48)], w=0.4, ch=0)                                         # C35, TP3
R('VSYS', [(-10.95, 21.9), (-10.95, 22.75), (-9.45, 22.75), (-9.45, 21.9)], w=0.25, ch=0)                      # PVDD pins 30, 27


# =============================================================== what the router filled in (tools/autoroute.py -> routes_auto.py)
try:
    from routes_auto import AUTO_ROUTES, AUTO_VIAS
    _skip = {'SW_PWR'} if VARIANT == 'B' else set()      # routed for A's window switch; B's is below
    ROUTES += [dict(net=t['net'], pts=[tuple(p) for p in t['pts']], w=t['w'], layer=t['layer']) for t in AUTO_ROUTES if t['net'] not in _skip]
    VIAS += [dict(v) for v in AUTO_VIAS if v['net'] not in _skip]
except ImportError:
    pass
if VARIANT == 'B':
    # variant B's edge switch (SW3 at the right waist edge, pin 1 at (13.37, 17.95)): down and in to a via, along L3 at
    # z 17.35 (A's row, run on to the right), up to the PMIC's SHPHLD (pin 18) as in A
    R('SW_PWR', [(13.37, 17.95), (12.77, 17.35), (12.0, 17.35)], ch=0)
    V('SW_PWR', 12.0, 17.35)
    R('SW_PWR', [(12.0, 17.35), (-6.65, 17.35)], layer='L3', ch=0)
    V('SW_PWR', -6.65, 17.35)
    R('SW_PWR', [(-6.65, 17.35), (-6.65, 17.5), (-7.35, 18.2)], ch=0)
