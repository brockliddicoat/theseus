# The board's stack-up, in one place for every tool (board_geo, routes, layout, autoroute, silk, build_pcb, mass).
# F47.4 (Brock, 2026-11-06, "0.6 mm, 5.63 g"; H3): a 0.6 mm finished, two-layer board with half-ounce outer copper, on the
# path to the board's 5.6 g target (F42.2). Plan 5 was built as 1.0 mm, four layers (L2 a solid GND plane, L3 power and
# long runs), 1 oz outer copper. On two layers the second routing layer is the bottom copper, L4, which also carries the
# underside's art (#63): the triangle mosaic pour, its vertices joined so the pour is one ground (silk.build_bottom).
# The board's TOP stays where it was in the mouse (5.03 mm over the pad: the shell's posts, the switches, the wheel's axle
# 12 mm up and the lens's focus are all set from it); the underside comes up 0.4 mm. The deck reads the thickness through
# KEY_PARTS (deck/tools/geo2d/key_parts.py -> KEY_PARTS.board.t / .top -> BOARD_T / BOARD_TOP in deck/src/03-parts.js).
T = 0.6                 # finished thickness (mm)
LAYERS = 2              # copper layers: 2 = L1 (top) + L4 (bottom); 4 adds L2 (GND plane) and L3 (power + long runs)
CU = 0.0175             # outer copper (0.5 oz, 17.5 um; plan 5 as first built: 1 oz, 35 um)
CU_IN = 0.0175          # inner copper (four layers only)
FAR = 'L4' if LAYERS == 2 else 'L3'     # the second routing layer: the bottom on two layers, the inner L3 on four
ROUTE_LAYERS = ('L1', FAR)
