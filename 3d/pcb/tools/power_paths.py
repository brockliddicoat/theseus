# Power-flow polylines for setPower(): ordered points along real copper (route geometry), tagged by layer.
# 'charge' = USB-C VBUS -> nPM1300 charger -> battery ; 'run' = battery -> PMIC -> bucks -> module + sensor.
def _seg(pts, layer='L1', w=0.3):
    return dict(layer=layer, w=w, pts=[[round(x, 3), round(z, 3)] for x, z in pts])


def paths(L):
    vbus = [
        _seg([(-2.4, 46.3), (-2.4, 45.42), (2.4, 45.42)], 'L1'),
        _seg([(2.4, 46.3), (2.4, 45.42), (11.37, 45.42), (12.85, 45.42), (13.05, 45.2), (13.05, 42.95)], 'L1'),
        _seg([(13.05, 42.95), (12.55, 42.45), (8.45, 42.45), (7.95, 41.95), (7.95, 17.0), (8.9, 16.3), (9.37, 16.3)], 'L3', 0.4),
        _seg([(9.37, 16.3), (9.37, 14.3), (9.85, 14.3), (9.85, 13.7)], 'L1'),
    ]
    charge_bat = [
        _seg([(8.6, 9.2), (8.6, 8.25), (8.38, 7.85), (8.38, 5.5), (8.9, 5.0), (9.9, 4.2), (11.6, 4.2), (13.4, 4.2)], 'L1', 0.5),
    ]
    run_bat = [dict(c, pts=list(reversed(c['pts']))) for c in charge_bat]
    run_1v8 = [
        _seg([(12.25, 11.95), (13.0, 11.95), (13.2, 12.12), (14.35, 12.12)], 'L1', 0.35),      # SW1 -> L1
        _seg([(14.35, 13.68), (15.95, 13.68)], 'L1', 0.4),                                       # L1 -> C32
        _seg([(14.35, 13.9), (13.6, 14.0), (13.2, 14.4), (13.2, 16.6), (12.85, 16.95), (7.45, 16.95), (7.25, 17.25)], 'L1', 0.25),
        _seg([(7.25, 17.25), (6.9, 17.6), (2.9, 17.6), (2.48, 17.2), (2.48, 11.0)], 'L3', 0.3),
        _seg([(2.48, 11.0), (2.48, 12.9), (2.4, 13.6)], 'L1', 0.2),                              # -> module VDD
        _seg([(2.48, 11.0), (2.48, 9.5), (5.0, 9.5), (5.45, 9.05)], 'L3', 0.25),
        _seg([(5.45, 9.0), (5.85, 8.6), (5.85, 8.3), (5.0, 8.2)], 'L1', 0.2),                    # -> sensor VDDIO
    ]
    run_sns = [
        _seg([(12.25, 9.95), (12.8, 9.95), (13.15, 9.6), (14.35, 9.28)], 'L1', 0.35),          # SW2 -> L2
        _seg([(14.35, 7.72), (13.9, 7.72), (12.95, 7.6), (12.5, 7.6), (12.5, 6.75)], 'L1', 0.3),
        _seg([(12.5, 6.75), (11.85, 5.3), (6.9, 5.3), (6.5, 5.7)], 'L3', 0.3),
        _seg([(6.5, 5.75), (5.85, 5.78), (5.0, 5.8)], 'L1', 0.25),                               # -> sensor core
    ]
    return dict(
        charge=dict(label='USB-C VBUS -> nPM1300 charger (JEITA, 22 V OVP) -> battery', segments=vbus + charge_bat),
        run=dict(label='battery -> nPM1300 -> buck 1 (1.8 V: module + sensor I/O) / buck 2 (sensor core)',
                 segments=run_bat + run_1v8 + run_sns),
        nodes=dict(usb=[0, 50.4], pmic=[9.6, 11.2], battery=[14.0, 3.2], module=[0, 20.6], sensor=[0, 4.0],
                   l1=[14.35, 12.9], l2=[14.35, 8.5]),
    )
