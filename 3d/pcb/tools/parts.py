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
    return dict(pads=P, body=(5.8, 12.8), npth=[(-1.45, 2.54, 1.0)])


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
      'SOT666': fp_sot666, 'JSTSH3': fp_jst_sh3, 'SLIDE': fp_slide, 'SLIDEB': fp_slide_bridge, 'ENC': fp_encoder, 'BRACKET': fp_bracket,
      'TACT': fp_tact, 'SOD523': fp_sod523, 'GT01': fp_gt01, 'TP': fp_tp, 'TPTHT': fp_tp_tht, 'FID': fp_fid}


# ------------------------------------------------------------------ placement
# (ref, footprint, x, z, rot, value, label, layer-for-explode)
C = []


def add(ref, fp, x, z, rot=0, value='', label='', layer='passives', nets=None, **kw):
    C.append(dict(ref=ref, fp=fp, x=x, z=z, rot=rot, value=value, label=label, layer=layer, nets=nets or {}, **kw))


# --- connectors / mechanics (positions traced from the Sora V2 photo unless noted)
add('J1', 'USBC', 0.0, 50.43, 0, 'USB-C 16P', '[REP] standard top-mount receptacle; position [MEAS]', 'connectors',
    {'GND_L': GND, 'GND_R': GND, 'VBUS_L': 'VBUS', 'VBUS_R': 'VBUS', 'CC1': 'CC1', 'CC2': 'CC2',
     'DN_B7': 'USB_DN', 'DN_A7': 'USB_DN', 'DP_A6': 'USB_DP', 'DP_B6': 'USB_DP', 'SBU1': 'NC_SBU1', 'SBU2': 'NC_SBU2',
     'S1': GND, 'S2': GND, 'S3': GND, 'S4': GND})
add('SW1', 'GT01', -16.0, 39.6, 0, 'Gateron GT01', '[REP] GT01 (no public datasheet), in 3x Mill-Max 3305', 'switches',
    {'COM': GND, 'NC': 'SW1_NC', 'NO': 'SW1_NO'})
add('SW2', 'GT01', 16.0, 39.6, 0, 'Gateron GT01', '[REP] GT01 (no public datasheet), in 3x Mill-Max 3305', 'switches',
    {'COM': GND, 'NC': 'SW2_NC', 'NO': 'SW2_NO'})
add('ENC1', 'ENC', -9.45, 37.75, 0, 'Encoder', '[REP] TTC-style mechanical encoder, Sora V2 position [MEAS]', 'mechanics',
    {'A': 'ENC_A', 'B': 'ENC_B', 'C': GND, 'F1': GND, 'F2': GND})
add('WB1', 'BRACKET', 10.1, 37.75, 0, 'Wheel bracket', '[MEAS] position, [REP] shape', 'mechanics',
    {'T1': GND, 'T2': GND, 'T3': GND, 'T4': GND})
add('SW4', 'TACT', 10.4, 37.75, 0, 'Middle click', '[REP] SMD tact under the bracket', 'mechanics',
    {'1': GND, '2': 'MID'})
add('U1', 'MODULE', 0.0, 20.6, 0, 'AN54LM-20A', '[DS] Raytac AN54LM-20A, nRF54LM20A, chip antenna, 9.9x13.3x2.0', 'module', {})
add('U2', 'QFN32', 9.6, 11.2, 0, 'nPM1300', '[DS] Nordic nPM1300 QFN32 5x5 (pin map representative)', 'pmic', {})
add('U3', 'SENSOR', 0.0, 4.0, 0, 'FS-class sensor', '[PR] next-gen PixArt FrameSync-class sensor (proposal), generic package', 'sensor', {})
add('U4', 'SOT666', -9.6, 44.0, 0, 'USB ESD', '[REP] USBLC6-2P6-class flow-through ESD on D+/D-', 'passives',
    {'1': 'USB_DP', '6': 'USB_DP', '3': 'USB_DN', '4': 'USB_DN', '2': GND, '5': 'NC'})
add('D1', 'SOD523', 8.45, 45.0, 45, 'VBUS TVS', '[REP] 5 V TVS at the Sora V2 diamond position [MEAS]', 'passives',
    {'1': GND, '2': 'VBUS'})
add('J2', 'JSTSH3', 8.6, -0.9, 180, 'BAT', '[REP] JST SH 3-pin side-entry, opening toward the back: the battery plug pulls out toward the tail (F26.4)', 'connectors',
    {'1': 'VBAT', '2': 'NTC', '3': GND, 'MP1': GND, 'MP2': GND})
add('J3', 'JSTSH3', -12.0, 3.4, 90, 'SIDE', '[REP] JST SH 3-pin side-entry for the side-button wires (#51)', 'connectors',
    {'1': 'SB5', '2': 'SB4', '3': GND, 'MP1': GND, 'MP2': GND})
add('SW3', 'SLIDEB', 10.725, 20.095, 0, 'POWER', '[REP] micro slide switch centred over the power-switch window, actuator down through it (F26.8) -> nPM1300 SHPHLD (ship mode)', 'connectors',
    {'1': 'SW_PWR', '2': GND})

# --- PMIC external parts (nPM1300 reference topology: 2 buck inductors, in/out caps, pull-ups) [DS topology]
add('L1', 'L2016', 14.35, 12.9, 90, '2.2uH', 'buck 1 inductor, Isat > 350 mA', 'pmic', {'1': 'SW_B1', '2': 'VDD_1V8'})
add('L2', 'L2016', 14.35, 8.5, 90, '2.2uH', 'buck 2 inductor, Isat > 350 mA', 'pmic', {'1': 'VDD_SNS', '2': 'SW_B2'})
add('C32', '0402', 15.95, 14.15, 90, '10uF', 'VOUT1 (1.8 V)', 'pmic', {'1': 'VDD_1V8', '2': GND})
add('C33', '0402', 15.95, 7.25, 90, '10uF', 'VOUT2 (sensor rail)', 'pmic', {'1': GND, '2': 'VDD_SNS'})
add('C30', '0402', 9.85, 15.1, 0, '1uF', 'VBUS in', 'pmic', {'1': 'VBUS', '2': GND})
add('C31', '0402', 11.15, 15.15, 90, '1uF', 'VBUSOUT', 'pmic', {'1': 'VBUSOUT', '2': GND})
add('C35', '0603', 10.6, 7.3, 0, '10uF', 'VSYS / buck input (PVDD)', 'pmic', {'1': 'VSYS', '2': GND})
add('C36', '0603', 7.6, 6.9, 0, '10uF', 'VBAT', 'pmic', {'1': GND, '2': 'VBAT'})
add('R1', '0402', 7.15, 15.5, 90, '4.7k', 'TWI SDA pull-up', 'pmic', {'1': 'SDA', '2': 'VDD_1V8'})
add('R2', '0402', 5.2, 12.2, 90, '4.7k', 'TWI SCL pull-up', 'pmic', {'1': 'VDD_1V8', '2': 'SCL'})
add('R3', '0402', 6.05, 46.75, 90, '5.1k', 'USB-C CC1 sink pull-down (Rd)', 'passives', {'1': GND, '2': 'CC1'})
add('R4', '0402', 5.3, 47.5, 90, '5.1k', 'USB-C CC2 sink pull-down (Rd)', 'passives', {'1': GND, '2': 'CC2'})

# --- USB input
add('C1', '0402', 10.25, 44.75, 0, '2.2uF', 'VBUS bulk at connector', 'passives', {'1': 'VBUS', '2': GND})
add('C2', '0402', 11.85, 44.75, 0, '100nF', 'VBUS HF', 'passives', {'1': 'VBUS', '2': GND})

# --- module + sensor decoupling
add('C10', '0402', 2.0, 12.9, 0, '4.7uF', 'module VDD', 'passives', {'1': GND, '2': 'VDD_1V8'})
add('C11', '0402', 2.0, 11.9, 0, '100nF', 'module VDD HF', 'passives', {'1': GND, '2': 'VDD_1V8'})
add('C20', '0402', 5.85, 7.6, 90, '1uF', 'sensor VDDIO', 'passives', {'1': GND, '2': 'VDD_1V8'})
add('C21', '0402', 5.85, 5.3, 90, '1uF', 'sensor VDD', 'passives', {'1': GND, '2': 'VDD_SNS'})
add('C22', '0402', 5.85, 3.1, 90, '100nF', 'sensor VDD HF', 'passives', {'1': GND, '2': 'VDD_SNS'})

# --- test points (gold), rail test pads (the Sora's 4 edge pads), SWD pads, fiducials
for i, z in enumerate((14.25, 12.25, 10.25, 8.25)):
    add('TP%d' % (10 + i), 'TPTHT', 17.52, z, 0, ['1V8', 'GND', 'GND', 'SNS'][i], '[MEAS] Sora V2 edge pads (2.0 mm pitch) reused as rail test pads',
        'board', {'1': ['VDD_1V8', GND, GND, 'VDD_SNS'][i]})
add('TP1', 'TP', 12.45, 43.35, 0, 'VBUS', 'test pad', 'board', {'1': 'VBUS'})
add('TP2', 'TP', 12.45, 42.25, 0, 'GND', 'test pad', 'board', {'1': GND})
add('TP3', 'TP', 11.4, 5.9, 0, 'VSYS', 'test pad', 'board', {'1': 'VSYS'})
add('TP4', 'TP', 9.3, 5.6, 0, 'VBAT', 'test pad', 'board', {'1': 'VBAT'})
add('TP5', 'TP', 12.5, 7.6, 0, 'SNS', 'test pad', 'board', {'1': 'VDD_SNS'})
add('TP6', 'TP', -12.2, 42.6, 0, 'D-', 'test pad', 'board', {'1': 'USB_DN'})
add('TP7', 'TP', -11.45, 45.0, 0, 'D+', 'test pad', 'board', {'1': 'USB_DP'})
add('TP8', 'TP', 3.2, 10.15, 0, 'SWDIO', 'SWD pad', 'board', {'1': 'SWDIO'})
add('TP9', 'TP', 4.3, 10.15, 0, 'SWCLK', 'SWD pad', 'board', {'1': 'SWCLK'})
add('FID1', 'FID', -14.4, 31.6, 0, '', 'fiducial', 'board', {})
add('FID2', 'FID', 16.9, -0.3, 0, '', 'fiducial', 'board', {})
add('FID3', 'FID', -17.55, 14.3, 0, '', 'fiducial', 'board', {})

# module pin map (castellations) [REP]
U1_PINS = {
    'L1': GND, 'L2': 'ENC_B', 'L3': 'ENC_A', 'L4': GND, 'L5': 'USB_DN', 'L6': 'USB_DP', 'L7': 'SW1_NO', 'L8': 'SW1_NC',
    'L9': 'SB4', 'L10': 'SB5', 'L11': GND, 'L12': GND,
    'R1': GND, 'R2': GND, 'R3': 'MID', 'R4': 'SW2_NO', 'R5': 'SW2_NC', 'R6': GND, 'R7': 'VBUS', 'R8': 'SDA',
    'R9': 'PMIC_INT', 'R10': 'SCL', 'R11': GND, 'R12': GND,
    'B1': GND, 'B2': 'SNS_RST', 'B3': 'SNS_MISO', 'B4': 'SNS_MOSI', 'B5': 'SNS_SCK', 'B6': 'SNS_CS', 'B7': 'SNS_MOTION',
    'B8': GND, 'B9': 'VDD_1V8', 'B10': 'SWDIO', 'B11': 'SWCLK',
}
# nPM1300 QFN32 pin map [REP: function set per datasheet, pin order chosen for this layout]
U2_PINS = {1: 'SDA', 2: 'PMIC_INT', 3: 'SCL', 4: 'VDD_1V8', 5: 'NC', 6: 'NC', 7: 'NC', 8: GND,
           9: 'NTC', 10: 'VBAT', 11: 'VBAT', 12: 'VSYS', 13: 'VSYS', 14: 'VSYS', 15: 'VSYS', 16: GND,
           17: 'VDD_SNS', 18: 'SW_B2', 19: GND, 20: GND, 21: GND, 22: 'SW_B1', 23: 'NC', 24: 'VDD_1V8',
           25: 'SW_PWR', 26: 'VBUSOUT', 27: 'NC', 28: 'VBUS', 29: 'VBUS', 30: 'NC', 31: 'NC', 32: 'NC', 33: GND}
U3_PINS = {1: 'SNS_MOTION', 2: 'SNS_CS', 3: 'SNS_SCK', 4: 'SNS_MOSI', 5: 'SNS_MISO', 6: 'SNS_RST', 7: GND, 8: GND,
           9: 'VDD_1V8', 10: GND, 11: 'VDD_SNS', 12: GND, 13: 'NC', 14: 'NC', 15: GND, 16: GND}
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
