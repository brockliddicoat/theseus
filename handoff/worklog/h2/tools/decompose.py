"""each H2 correction to H1's balance model, one at a time, and its effect on the CoM z (battery at H1's place)"""
import json, os, sys
import numpy as np
sys.path.insert(0, '/home/claude/theseus/3d/pcb/tools')
import balance as BL
lay = json.load(open('/home/claude/theseus/3d/pcb/pcb-layout.json'))
H1P = [-0.41, 7.46, -24.95]
def run(tag, bxyz, h1screws):
    c, M = BL.com(BL.mouse(bxyz, H1P, h1=h1screws)); zn = BL.z_for_zero(bxyz, h1=h1screws)
    print('%-70s board CoM z %+6.2f  mouse CoM z %+.3f  battery for 0: %+.3f (fwd %.3f)' % (tag, bxyz[2], c[2], zn, zn - H1P[2]))
    return c[2]
b_h1, _ = BL.board_com(lay, h1=True)
z0 = run('H1 model', b_h1, True)
z1 = run('1. screws + inserts at the board holes (else H1)', b_h1, False)
# 2. bare board: mass.py figures at the core centroid, no encoder/support, no MM/solder extras (to isolate)
FPM0, EX0 = dict(BL.FPM), list(BL.EXTRA)
BL.FPM.update(ENCM=0.0, BRACKET=0.0); BL.EXTRA[:] = []
b2, m2 = BL.board_com(lay); z2 = run('2. + bare board (mass.py) at the core centroid, parts as H1', b2, False)
BL.EXTRA[:] = EX0; b3, m3 = BL.board_com(lay); z3 = run('3. + Mill-Max sockets at the switches, solder', b3, False)
BL.FPM.update(ENCM=FPM0['ENCM'], BRACKET=FPM0['BRACKET']); b4, m4 = BL.board_com(lay); z4 = run('4. + encoder 1.0 g and support 0.26 g inside the 5.6 g', b4, False)
print('steps: screws %+.3f, core/bare %+.3f, MM+solder %+.3f, encoder+support %+.3f, total %+.3f' % (z1 - z0, z2 - z1, z3 - z2, z4 - z3, z4 - z0))
# sensitivity: the bosses (not modelled): Ø5.3/Ø3.5 posts, CF-PP 1.06 g/cm3 (assumed), from the board top to the shell's skin - 1.4
