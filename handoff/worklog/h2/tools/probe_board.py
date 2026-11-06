import json, os, sys
import numpy as np
sys.path.insert(0, '/home/claude/work/h2/tools')
import clear as CL
import board as BD
from shapely.geometry import Polygon
from shapely.ops import unary_union
ol = BD.theseus_outline()
holes = [Polygon([(x + 0.5*d*np.cos(a), z + 0.5*d*np.sin(a)) for a in np.linspace(0, 2*np.pi, 64)]) for k, (x, z, d, _) in BD.SORA_HOLES.items()]
core = ol.difference(unary_union([BD.wheel_cut_poly(), BD.square_cut_poly()] + holes))
print('outline area %.1f centroid (%.2f, %.2f) | core area %.1f centroid (%.2f, %.2f)' % (ol.area, ol.centroid.x, ol.centroid.y, core.area, core.centroid.x, core.centroid.y))
P = CL.pcb_parts()
for ref in ('ENC1', 'WB1', 'SW4', 'U1', 'U3', 'J1', 'SW1', 'SW2', 'J2', 'J2_plug', 'BATLEAD', 'LENS', 'WHEEL'):
    V = P[ref]; c = (V.min(0) + V.max(0)) / 2
    print('%-8s bbox X %.2f..%.2f Y %.2f..%.2f Z %.2f..%.2f  centre Y %.2f' % (ref, V[:,0].min(), V[:,0].max(), V[:,1].min(), V[:,1].max(), V[:,2].min(), V[:,2].max(), c[1]))
