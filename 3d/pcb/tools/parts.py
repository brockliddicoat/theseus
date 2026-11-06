# Footprint library + component placement for the Theseus main PCB.
# Local footprint frame: x right, z forward (when rot = 0), origin at the part centre.
# Rotation 'rot' is counter-clockwise in degrees seen from above (x right, z up on the page).
# Every dimension is labelled in README: [DS] datasheet / [MEAS] measured from the Sora photo /
# [REP] representative (no public drawing) / [PR] proposal.
import math

GND = 'GND'


def pad(name, x, z, w, h, shape='rect', r=None, drill=None, slot=None, mask=0.05, paste=True):
    """w along local x, h along local z. shape: rect | oval | circle. drill: round hole dia; slot: (w,h) slot."""
    return dict(name=str(name), x=x, z=z, w=w, h=h, shape=shape,
                r=(min(w, h) * 0.12 if r is None and shape == 'rect' else (r or 0)),
                drill=drill, slot=slot, mask=mask, paste=paste)


# ------------------------------------------------------------------ footprints
def fp_chip(size):
    # IPC-7351 nominal land patterns
    d = {'0402': (0.48, 0.56, 0.62, (1.0, 0.5)), '0603': (0.78, 0.80, 0.95, (1.6, 0.8)),
         '0805': (0.95, 1.0, 1.35, (2.0, 1.25))}[size]
    off, w, h, body = d
    return dict(pads=[pad(1, -off, 0, w, h), pad(2, off, 0, w, h)], body=body)


def fp_ind2016():
    # 2.0 x 1.6 x 1.0 mm molded metal-composite inductor (DFE201610E-class) [REP]
    return dict(pads=[pad(1, -0.78, 0, 0.72, 1.75), pad(2, 0.78, 0, 0.72, 1.75)], body=(2.0, 1.6))


def fp_qfn32():
    # 5 x 5 mm QFN32, 0.5 mm pitch, exposed pad 3.3 mm (nPM1300 QFN package size [DS]; land pattern [REP])
    P = []
    for i in range(8):
        o = 1.75 - 0.5 * i
        P.append(pad(1 + i, -2.45, o, 0.8, 0.26, r=0.05))          # left, top->bottom
        P.append(pad(9 + i, -o, -2.45, 0.26, 0.8, r=0.05))         # bottom, left->right
        P.append(pad(17 + i, 2.45, -o, 0.8, 0.26, r=0.05))         # right, bottom->top
        P.append(pad(25 + i, o, 2.45, 0.26, 0.8, r=0.05))          # top, right->left
    P.append(pad(33, 0, 0, 3.3, 3.3, r=0.15, paste=False))         # exposed pad (paste in windows)
    return dict(pads=P, body=(5.0, 5.0), ep_vias=[(x, z) for x in (-1.0, 0, 1.0) for z in (-1.0, 0, 1.0)])


def fp_module():
    # Raytac AN54LM-20A: 9.9 x 13.3 x 2.0 mm [DS]; castellated pad pattern [REP] (66 GPIO; not pin-for-pin)
    P = []
    for i in range(12):
        z = 2.9 - 0.8 * i
        P.append(pad('L%d' % (i + 1), -4.95, z, 1.1, 0.55, r=0.08))
        P.append(pad('R%d' % (i + 1), 4.95, z, 1.1, 0.55, r=0.08))
    for i in range(11):
        P.append(pad('B%d' % (i + 1), -4.0 + 0.8 * i, -6.65, 0.55, 1.1, r=0.08))
    return dict(pads=P, body=(9.9, 13.3))


def fp_sensor():
    # next-gen PixArt FrameSync-class sensor (proposal): generic 9.0 x 11.0 mm package, 2 x 8 side lands [PR]
    P = []
    for i in range(8):
        z = 4.2 - 1.2 * i
        P.append(pad(1 + i, -4.55, z, 1.1, 0.62, r=0.08))
        P.append(pad(9 + i, 4.55, z, 1.1, 0.62, r=0.08))
    return dict(pads=P, body=(9.0, 11.0), npth=[(0, 0, 2.4)], slots=[(0, 6.0, 2.0, 0.8), (0, -6.0, 2.0, 0.8)])


def fp_usbc():
    # USB Type-C 16P top-mount receptacle, shell 8.94 x 7.35 x 3.16 mm [REP, standard class]
    xs = [-3.2, -2.4, -1.75, -1.25, -0.75, -0.25, 0.25, 0.75, 1.25, 1.75, 2.4, 3.2]
    names = ['GND_L', 'VBUS_L', 'SBU2', 'CC1', 'DN_B7', 'DP_A6', 'DN_A7', 'DP_B6', 'SBU1', 'CC2', 'VBUS_R', 'GND_R']
    P = []
    for x, n in zip(xs, names):
        w = 0.6 if abs(x) > 2 else 0.3
        P.append(pad(n, x, -4.10, w, 1.0, r=0.05))
    P.append(pad('S1', -4.32, 0.78, 1.0, 2.1, shape='oval', slot=(0.6, 1.7)))
    P.append(pad('S2', 4.32, 0.78, 1.0, 2.1, shape='oval', slot=(0.6, 1.7)))
    P.append(pad('S3', -4.32, -3.03, 1.0, 1.6, shape='oval', slot=(0.6, 1.2)))
    P.append(pad('S4', 4.32, -3.03, 1.0, 1.6, shape='oval', slot=(0.6, 1.2)))
    return dict(pads=P, body=(8.94, 7.35))


def fp_sot666():
    # 1.6 x 1.6 mm 6-lead ESD array (USBLC6-2P6-class) [REP]
    P = []
    for i, z in enumerate((0.5, 0.0, -0.5)):
        P.append(pad(1 + i, -0.78, z, 0.55, 0.3, r=0.05))
        P.append(pad(6 - i, 0.78, z, 0.55, 0.3, r=0.05))
    return dict(pads=P, body=(1.2, 1.6))


def fp_jst_sh3():
    # JST SH 1.0 mm 3-pin side-entry (SM03B-SRSS-TB-class): opening faces local +z [REP]
    P = [pad(1 + i, -1.0 + i, -2.78, 0.6, 1.55, r=0.08) for i in range(3)]
    P += [pad('MP1', -2.8, 0.4, 1.2, 1.8, r=0.1), pad('MP2', 2.8, 0.4, 1.2, 1.8, r=0.1)]
    return dict(pads=P, body=(4.0, 4.25))


def fp_slide():
    # micro side-actuated SPST slide switch, 1.8 x 4.6 x 1.2 mm, knob on local -x [REP]
    return dict(pads=[pad(1, 0.15, -2.75, 1.1, 0.8, r=0.08), pad(2, 0.15, 2.75, 1.1, 0.8, r=0.08)], body=(1.8, 4.6))


def fp_slide_bridge():
    # micro slide switch bridging the power-switch window, actuator down through the window's centre: its two
    # terminals land on the board in front of and behind the window, 1.2 x 0.8 mm, 5.9 mm apart [REP]
    return dict(pads=[pad(1, 0.0, -2.95, 1.2, 0.8, r=0.08), pad(2, 0.0, 2.95, 1.2, 0.8, r=0.08)], body=(1.8, 5.2))


def fp_encoder():
    # TTC-style vertical mechanical encoder (as on the Sora V2): 3 signal pins + 2 frame tabs [REP]
    P = [pad('A', 0.3, 2.5, 1.45, 1.45, shape='circle', drill=0.9),
         pad('C', 0.3, 0.0, 1.45, 1.45, shape='circle', drill=0.9),
         pad('B', 0.3, -2.5, 1.45, 1.45, shape='circle', drill=0.9),
         pad('F1', -1.55, 4.45, 1.0, 1.4, r=0.1), pad('F2', -1.55, -4.45, 1.0, 1.4, r=0.1)]
    return dict(pads=P, body=(3.8, 10.0))


def fp_encoder_mag():
    # the magnetic (Hall) scroll encoder in a normal encoder outline (3d/parts/scrollwheel.js): 4 pins in a row along z at
    # 1.25 mm pitch from its sensor board at the housing's far end (VDD, A, B, GND). F47.4 (H3): the lighter encoder has no
    # nickel-silver frame, so no frame tabs bent out into SMD feet (they were F1/F2, 1.0 x 1.2 at local x 0.85, z +/-5.9):
    # the bottom housing's two moulded pegs locate it instead, in two copper-free holes under it. Origin at the housing's
    # centre; local +x toward the wheel [PR]
    P = [pad(n, -1.95, z, 1.05, 1.05, shape='circle', drill=0.7) for n, z in (('GND', -1.875), ('B', -0.625), ('A', 0.625), ('VDD', 1.875))]
    return dict(pads=P, body=(4.6, 11.0), npth=[(0.0, -4.6, 0.9), (0.0, 4.6, 0.9)])


def fp_edge_slide():
    # variant B (F30.17): a right-angle SMD slide switch at the board's edge (C&K PCM12-class: 6.7 x 2.6 x 1.4 mm body,
    # its actuator 1.5 mm past the edge), on the top side so the board stays one reflow (#92). Local +x toward the edge;
    # two terminals and two hold-down tabs on the inboard side [REP]
    P = [pad(1, -0.75, -1.5, 0.7, 1.0, r=0.08), pad(2, -0.75, 1.5, 0.7, 1.0, r=0.08),
         pad('MP1', -0.2, -3.05, 1.1, 0.8, r=0.08), pad('MP2', -0.2, 3.05, 1.1, 0.8, r=0.08)]
    return dict(pads=P, body=(2.6, 6.7))


def fp_bracket():
    # wheel axle bracket (black POM), 4 SMD hold-down tabs [MEAS position, REP shape]
    return dict(pads=[pad('T%d' % (i + 1), sx * 2.1, sz * 3.45, 1.2, 1.0, r=0.1)
                      for i, (sx, sz) in enumerate([(-1, 1), (1, 1), (-1, -1), (1, -1)])], body=(5.4, 7.9))


def fp_tact():
    # middle-click SMD tact switch 3.5 x 2.9 x 1.6 mm [REP]
    return dict(pads=[pad(1, -2.05, 0, 1.0, 1.6, r=0.1), pad(2, 2.05, 0, 1.0, 1.6, r=0.1)], body=(3.5, 2.9))


def fp_gt01():
    # Gateron GT01 (parts API: COM +5.08 front, NO 0, NC -5.08; D2F 5.08 mm terminal pitch [DS, class]) seated in
    # 3 x Mill-Max 3305 receptacles: mounting hole 1.575 mm [DS]. Key-peg hole for the GT01 wedge base:
    # parts API keyPeg at local (+1.45, +2.54) in the WORLD frame = (-1.45, +2.54) in this pre-mirror layout frame.
    P = [pad(n, 0, z, 2.3, 2.3, shape='circle', drill=1.575) for n, z in (('COM', 5.08), ('NO', 0.0), ('NC', -5.08))]
    return dict(pads=P, body=(5.8, 12.8))       # three pins only (F12.7): the old key-peg hole is gone


def fp_sod523():
    # 1.2 x 0.8 mm SOD-523 TVS [REP]
    return dict(pads=[pad(1, -0.65, 0, 0.5, 0.6, r=0.06), pad(2, 0.65, 0, 0.5, 0.6, r=0.06)], body=(1.2, 0.8))


def fp_tp(d=0.9):
    return dict(pads=[pad(1, 0, 0, d, d, shape='circle', paste=False)], body=(d, d))


def fp_tp_tht():
    return dict(pads=[pad(1, 0, 0, 1.6, 1.6, shape='circle', drill=0.8, paste=False)], body=(1.6, 1.6))


def fp_fid():
    return dict(pads=[pad(1, 0, 0, 1.0, 1.0, shape='circle', mask=0.5, paste=False)], body=(1.0, 1.0))


FP = {'0402': lambda: fp_chip('0402'), '0603': lambda: fp_chip('0603'), '0805': lambda: fp_chip('0805'),
      'L2016': fp_ind2016, 'QFN32': fp_qfn32, 'MODULE': fp_module, 'SENSOR': fp_sensor, 'USBC': fp_usbc,
      'SOT666': fp_sot666, 'JSTSH3': fp_jst_sh3, 'SLIDE': fp_slide, 'SLIDEB': fp_slide_bridge, 'SLIDEE': fp_edge_slide, 'ENC': fp_encoder, 'ENCM': fp_encoder_mag, 'BRACKET': fp_bracket,
      'TACT': fp_tact, 'SOD523': fp_sod523, 'GT01': fp_gt01, 'TP': fp_tp, 'TPTHT': fp_tp_tht, 'FID': fp_fid}


# ------------------------------------------------------------------ placement
# (ref, footprint, x, z, rot, value, label, layer-for-explode)
C = []


def add(ref, fp, x, z, rot=0, value='', label='', layer='passives', nets=None, **kw):
    C.append(dict(ref=ref, fp=fp, x=x, z=z, rot=rot, value=value, label=label, layer=layer, nets=nets or {}, **kw))


# ===================================================================== plan 5 placement (Brock, 2026-11-05; F30)
# The sensor as far forward as it goes, the MCU module behind it, equal 1.60 mm gaps down the centre line (wheel bay ->
# sensor -> MCU -> rear notch, F30.3, F30.12); the PMIC in the left-middle spot, far from the MCU (F30.1, F30.3); the
# power switch on the x +10 axis in the sensor's row; the battery connector opening to the back (F26.4); the side-button
# connector on the left; parts centred on shared axes (F30.6). Layout frame: x = the user's right, z = toward the nose.
import os as _os
VARIANT = (_os.environ.get('PCB_VARIANT') or 'A').strip().upper()
ZS, ZM = 19.45, 4.80          # the sensor's and the module's centres (the equal gaps: 27.45 - 1.60 - 6.40; -4.0 + 1.60 + 7.20)
add('J1', 'USBC', 0.0, 49.38, 0, 'USB-C 16P', '[REP] standard top-mount receptacle; 1.05 mm back from plan 4, it hangs 1.60 mm past the front (F30.25)', 'connectors',
    {'GND_L': GND, 'GND_R': GND, 'VBUS_L': 'VBUS', 'VBUS_R': 'VBUS', 'CC1': 'CC1', 'CC2': 'CC2',
     'DN_B7': 'USB_DN', 'DN_A7': 'USB_DN', 'DP_A6': 'USB_DP', 'DP_B6': 'USB_DP', 'SBU1': 'NC_SBU1', 'SBU2': 'NC_SBU2',
     'S1': GND, 'S2': GND, 'S3': GND, 'S4': GND})
add('SW1', 'GT01', -16.0, 39.6, 0, 'Gateron GT01', '[REP] GT01 (no public datasheet), in 3x Mill-Max 3305', 'switches',
    {'COM': GND, 'NC': 'SW1_NC', 'NO': 'SW1_NO'})
add('SW2', 'GT01', 16.0, 39.6, 0, 'Gateron GT01', '[REP] GT01 (no public datasheet), in 3x Mill-Max 3305', 'switches',
    {'COM': GND, 'NC': 'SW2_NC', 'NO': 'SW2_NO'})
add('ENC1', 'ENCM', -9.2, 37.75, 0, 'Encoder', '[PR] magnetic (Hall) scroll encoder, clear top housing (3d/parts/scrollwheel.js)', 'mechanics',
    {'A': 'ENC_A', 'B': 'ENC_B', 'VDD': 'VDD_1V8', 'GND': GND})
add('WB1', 'BRACKET', 10.4, 37.75, 0, 'Wheel bracket', '[REP] POM wheel support with four hold-down tabs, over the middle click', 'mechanics',
    {'T1': GND, 'T2': GND, 'T3': GND, 'T4': GND})
add('SW4', 'TACT', 10.4, 37.75, 0, 'Middle click', '[REP] SMD tact under the bracket', 'mechanics', {'1': GND, '2': 'MID'})
add('U1', 'MODULE', 0.0, ZM, 0, 'AN54LM-P20A', '[DS] Raytac AN54LM-P20A (nRF54LM20A, long meander PCB antenna), black; the antenna end forward, toward the sensor: no metal there, 28 mm from the wheel', 'module', {})
add('U2', 'QFN32', -10.2, ZS, 0, 'nPM1300', '[DS] Nordic nPM1300 QFN32 5x5 (pin map representative), the left-middle spot far from the MCU (F30.1)', 'pmic', {})
add('U3', 'SENSOR', 0.0, ZS, 0, 'PAW3970', '[PR] PixArt PAW3970 (the Viper V4 Pro\'s sensor, F21.6) in a castellated module, as far forward as it goes (F30.3)', 'sensor', {})
add('U4', 'SOT666', -8.9, 46.35, 180, 'USB ESD', '[REP] USBLC6-2P6-class flow-through ESD on D+/D-', 'passives',
    {'1': 'USB_DP', '6': 'USB_DP', '3': 'USB_DN', '4': 'USB_DN', '2': GND, '5': 'NC'})
add('D1', 'SOD523', 6.0, 46.3, 90, 'VBUS TVS', '[REP] 5 V TVS beside the receptacle', 'passives', {'1': GND, '2': 'VBUS'})
add('J2', 'JSTSH3', 14.5, 7.9, 180, 'BAT', '[REP] JST SH 3-pin side-entry, opening toward the back: the battery plug pulls out toward the tail (F26.4)', 'connectors',
    {'1': 'VBAT', '2': 'NTC', '3': GND, 'MP1': GND, 'MP2': GND})
add('J3', 'JSTSH3', -14.5, 7.9, 90, 'SIDE', '[REP] JST SH 3-pin side-entry for the side-button wires (#51), opening to the left wall', 'connectors',
    {'1': 'SB5', '2': 'SB4', '3': GND, 'MP1': GND, 'MP2': GND})
if VARIANT == 'B':
    add('SW3', 'SLIDEE', 15.42 - 1.3, ZS, 0, 'POWER', '[REP] variant B (F30.17): a right-angle slide switch at the right waist edge, its actuator 1.5 mm past the edge, in the sensor\'s row -> nPM1300 SHPHLD', 'connectors',
        {'1': 'SW_PWR', '2': GND, 'MP1': GND, 'MP2': GND})
else:
    add('SW3', 'SLIDEB', 10.0, ZS, 0, 'POWER', '[REP] micro slide switch bridging its window on the x +10 axis, actuator down through it -> nPM1300 SHPHLD (ship mode)', 'connectors',
        {'1': 'SW_PWR', '2': GND})

# --- PMIC external parts round U2 (nPM1300 reference topology: 2 buck inductors, in/out caps, pull-ups) [DS topology]
add('L1', 'L2016', -12.0, 24.45, 90, '2.2uH', 'buck 1 inductor (1.8 V), Isat > 350 mA', 'pmic', {'1': 'SW_B1', '2': 'VDD_1V8'})
add('L2', 'L2016', -8.75, 24.45, 90, '2.2uH', 'buck 2 inductor (sensor core), Isat > 350 mA', 'pmic', {'1': 'SW_B2', '2': 'VDD_SNS'})
add('C32', '0402', -12.0, 26.55, 0, '10uF', 'VOUT1 (1.8 V)', 'pmic', {'1': GND, '2': 'VDD_1V8'})
add('C33', '0402', -8.75, 26.55, 0, '10uF', 'VOUT2 (sensor core)', 'pmic', {'1': GND, '2': 'VDD_SNS'})
add('C35', '0603', -8.45, 14.7, 90, '10uF', 'VSYS / buck input (PVDD)', 'pmic', {'1': GND, '2': 'VSYS'})
add('C30', '0402', -11.75, 14.9, 90, '1uF', 'VBUS in', 'pmic', {'1': GND, '2': 'VBUS'})
add('C31', '0402', -10.95, 14.9, 90, '1uF', 'VBUSOUT', 'pmic', {'1': GND, '2': 'VBUSOUT'})
add('C36', '0603', -9.7, 14.7, 90, '10uF', 'VBAT', 'pmic', {'1': GND, '2': 'VBAT'})
add('R1', '0402', -7.75, 9.65, 90, '4.7k', 'TWI SDA pull-up', 'pmic', {'1': 'SDA', '2': 'VDD_1V8'})
add('R2', '0402', -15.35, 15.8, 90, '4.7k', 'TWI SCL pull-up', 'pmic', {'1': 'VDD_1V8', '2': 'SCL'})
add('R3', '0402', 5.55, 49.3, 90, '5.1k', 'USB-C CC1 sink pull-down (Rd)', 'passives', {'1': 'CC1', '2': GND})
add('R4', '0402', 7.95, 48.7, 90, '5.1k', 'USB-C CC2 sink pull-down (Rd)', 'passives', {'1': 'CC2', '2': GND})

# --- USB input
add('C1', '0402', 7.3, 46.3, 90, '2.2uF', 'VBUS bulk at the receptacle', 'passives', {'1': GND, '2': 'VBUS'})
add('C2', '0402', 8.4, 46.3, 90, '100nF', 'VBUS HF', 'passives', {'1': GND, '2': 'VBUS'})

# --- module + sensor decoupling
# the module's VDD decoupling under its bottom pads (B3 is VDD, between NC B2 and GND B4). Two layers (F47.4, H3): the 1.8 V
# can't reach B3 from an inner layer any more, and the pocket B3 and the two caps' VDD pads made was walled in by GND pads,
# so the caps move apart (C11 0.5 mm left, C10 0.3 mm right) to open one via site between them (routes.py: the supply comes
# up there on the bottom); B3 still drops straight onto C10's VDD pad. Was C11 x -3.9, C10 x -2.0 (plan 5)
add('C10', '0402', -1.7, -2.95, 0, '4.7uF', 'module VDD', 'passives', {'1': 'VDD_1V8', '2': GND})
add('C11', '0402', -4.4, -2.95, 0, '100nF', 'module VDD HF', 'passives', {'1': GND, '2': 'VDD_1V8'})
add('C20', '0402', -6.1, 20.1, 90, '1uF', 'sensor VDDIO', 'passives', {'1': GND, '2': 'VDD_1V8'})
add('C21', '0402', -5.55, 25.5, 90, '1uF', 'sensor VDD', 'passives', {'1': 'VDD_SNS', '2': GND})
add('C22', '0402', -6.6, 26.7, 90, '100nF', 'sensor VDD HF', 'passives', {'1': 'VDD_SNS', '2': GND})

# --- test points (gold): the rail test pads in a row under the switch (plan 5), small pads, SWD, fiducials
for i, (x, n, net) in enumerate(((11.2, '1V8', 'VDD_1V8'), (13.2, 'GND', GND), (15.2, 'GND', GND), (17.2, 'SNS', 'VDD_SNS'))):
    add('TP%d' % (10 + i), 'TPTHT', x, 13.0, 0, n, 'rail test pad (2.0 mm pitch, as the Sora V2\'s edge pads)', 'board', {'1': net})
add('TP1', 'TP', 9.6, 46.4, 0, 'VBUS', 'test pad', 'board', {'1': 'VBUS'})
add('TP2', 'TP', 10.8, 46.4, 0, 'GND', 'test pad', 'board', {'1': GND})
add('TP3', 'TP', -6.85, 15.48, 0, 'VSYS', 'test pad', 'board', {'1': 'VSYS'})
add('TP4', 'TP', -10.95, 13.2, 0, 'VBAT', 'test pad', 'board', {'1': 'VBAT'})
add('TP5', 'TP', -7.8, 27.5, 0, 'SNS', 'test pad', 'board', {'1': 'VDD_SNS'})
add('TP6', 'TP', -11.75, 46.65, 0, 'D-', 'test pad', 'board', {'1': 'USB_DN'})
add('TP7', 'TP', -11.75, 45.55, 0, 'D+', 'test pad', 'board', {'1': 'USB_DP'})
add('TP8', 'TP', 6.5, -1.75, 0, 'SWDIO', 'SWD pad', 'board', {'1': 'SWDIO'})
add('TP9', 'TP', 7.7, -1.75, 0, 'SWCLK', 'SWD pad', 'board', {'1': 'SWCLK'})
add('FID1', 'FID', -17.4, 46.6, 0, '', 'fiducial', 'board', {})
add('FID2', 'FID', 17.6, 1.6, 0, '', 'fiducial', 'board', {})
add('FID3', 'FID', -17.6, 13.0, 0, '', 'fiducial', 'board', {})

# module pin map (castellations) [REP]: the left side takes what comes down the left (the side buttons, the PMIC's TWI,
# the left switch, the encoder, USB), the right side the sensor's SPI and the right switch and the middle click
U1_PINS = {
    'L1': 'SDA', 'L2': 'PMIC_INT', 'L3': 'SCL', 'L4': 'SB4', 'L5': 'SB5', 'L6': 'ENC_B', 'L7': 'ENC_A',
    'L8': 'USB_DP', 'L9': 'USB_DN', 'L10': 'SW1_NO', 'L11': 'SW1_NC', 'L12': GND,
    'R1': 'SNS_RST', 'R2': 'SNS_MISO', 'R3': 'SNS_MOSI', 'R4': 'SNS_SCK', 'R5': 'SNS_CS', 'R6': 'SNS_MOTION',
    'R7': 'MID', 'R8': 'SW2_NO', 'R9': 'SW2_NC', 'R10': GND, 'R11': GND, 'R12': GND,
    'B1': GND, 'B2': 'NC', 'B3': 'VDD_1V8', 'B4': GND, 'B5': 'VBUSOUT', 'B6': GND, 'B7': 'NC', 'B8': 'NC',
    'B9': 'SWDIO', 'B10': 'SWCLK', 'B11': GND,
}
# nPM1300 QFN32 pin map [REP: the function set per the datasheet, the order chosen for this layout]: the bucks toward their
# inductors above it, the charger and system rails below, the TWI and the ship-mode input on the left
U2_PINS = {1: 'SCL', 2: 'PMIC_INT', 3: 'SDA', 4: 'NC', 5: 'NC', 6: 'NC', 7: 'NC', 8: GND,
           9: 'VBUS', 10: 'VBUS', 11: 'VBUSOUT', 12: GND, 13: 'VBAT', 14: 'VBAT', 15: 'VSYS', 16: 'VSYS',
           17: GND, 18: 'SW_PWR', 19: 'NTC', 20: 'NC', 21: 'NC', 22: 'NC', 23: GND, 24: 'VDD_SNS',
           25: 'VDD_SNS', 26: 'SW_B2', 27: 'VSYS', 28: GND, 29: GND, 30: 'VSYS', 31: 'SW_B1', 32: 'VDD_1V8', 33: GND}
# PAW3970 module lands [REP]: power on the left column (toward the PMIC), the SPI on the right (toward the module's right side)
U3_PINS = {1: 'VDD_SNS', 2: GND, 3: 'VDD_1V8', 4: GND, 5: 'NC', 6: 'NC', 7: GND, 8: GND,
           9: GND, 10: GND, 11: 'SNS_MOTION', 12: 'SNS_CS', 13: 'SNS_SCK', 14: 'SNS_MOSI', 15: 'SNS_MISO', 16: 'SNS_RST'}
for c in C:
    if c['ref'] == 'U1': c['nets'] = U1_PINS
    if c['ref'] == 'U2': c['nets'] = {str(k): v for k, v in U2_PINS.items()}
    if c['ref'] == 'U3': c['nets'] = {str(k): v for k, v in U3_PINS.items()}


def world_pads(c):
    """pads of component c in world (x, z) with rotation applied; adds 'net' and 'ref'"""
    fp = FP[c['fp']]()
    a = math.radians(c['rot']); ca, sa = math.cos(a), math.sin(a)
    out = []
    for p in fp['pads']:
        q = dict(p)
        q['x'] = c['x'] + p['x'] * ca - p['z'] * sa
        q['z'] = c['z'] + p['x'] * sa + p['z'] * ca
        q['rot'] = c['rot']
        q['ref'] = c['ref']
        q['net'] = c['nets'].get(p['name'], c['nets'].get(str(p['name']), 'NC'))
        out.append(q)
    return out, fp
