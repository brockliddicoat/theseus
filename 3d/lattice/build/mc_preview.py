"""marching-cubes preview of a grid iso-surface -> work/<name>.ply (for work/preview.html)"""
import sys, numpy as np, trimesh
from skimage.measure import marching_cubes
from common import *
g = Grid.load(os.path.join(WORK, sys.argv[1])); iso = float(sys.argv[3]) if len(sys.argv) > 3 else 0.0
step = int(sys.argv[4]) if len(sys.argv) > 4 else 1
A = g.A[::step, ::step, ::step]
v, f, nrm, _ = marching_cubes(A, iso, spacing=(g.h * step,) * 3)
v += g.o
m = trimesh.Trimesh(v, f, process=False)
print(len(f), 'tris')
m.export(os.path.join(WORK, sys.argv[2]))
