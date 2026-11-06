"""rough mass and centroid of the four boss posts the board hangs from (#54; b11 draws them from the shell's skin down to the
board), from the shell meshes above each hole: a tube Ø5.3 / Ø3.5 (the insert's bore) from the board top to the first shell
surface above, CF-PP 1.06 g/cm3 (assumed). Not in the 3D shell; for the balance's uncertainty only."""
import json, math, sys
import numpy as np
sys.path.insert(0, '/home/claude/theseus/3d/shell/tools'); sys.path.insert(0, '/home/claude/theseus/3d/pcb/tools')
import glbio, deps
import board as BD
js, b = glbio.read('/home/claude/theseus/3d/shell/shell-theseus-1seam.glb')
def surf_above(X, Z, y0, names=('body', 'triggerL', 'triggerR', 'wheelBay')):
    hits = []
    for nm in names:
        n, d = glbio.mesh_arrays(js, b, nm); P = d['POSITION'].astype(float) + np.array(n.get('translation', [0, 0, 0])); I = d['indices'].reshape(-1, 3)
        A, B, C = P[I[:, 0]], P[I[:, 1]], P[I[:, 2]]
        # vertical ray at (X, Z) upward from y0: barycentric in XZ
        v0, v1 = B - A, C - A; p = np.array([X, Z])
        d00 = v0[:, 0]*v0[:, 0] + v0[:, 2]*v0[:, 2]; d01 = v0[:, 0]*v1[:, 0] + v0[:, 2]*v1[:, 2]; d11 = v1[:, 0]*v1[:, 0] + v1[:, 2]*v1[:, 2]
        w = np.c_[p[0] - A[:, 0], p[1] - A[:, 2]]; d20 = w[:, 0]*v0[:, 0] + w[:, 1]*v0[:, 2]; d21 = w[:, 0]*v1[:, 0] + w[:, 1]*v1[:, 2]
        den = d00*d11 - d01*d01; ok = np.abs(den) > 1e-12
        v = np.where(ok, (d11*d20 - d01*d21) / np.where(ok, den, 1), -1); u = np.where(ok, (d00*d21 - d01*d20) / np.where(ok, den, 1), -1)
        m = ok & (u >= 0) & (v >= 0) & (u + v <= 1)
        y = A[m, 1] + v[m]*v0[m, 1] + u[m]*v1[m, 1]
        for yy in y[y > y0]: hits.append((float(yy), nm))
    return sorted(hits)
tot = 0; mz = 0; my = 0
for k, (x, z, dia, _) in sorted(BD.SORA_HOLES.items()):
    X, Z = -x, z - 2.88
    h = surf_above(X, Z, 5.03)
    first = h[0] if h else None
    if not first: print(k, 'no surface above'); continue
    top = first[0]; L = top - 5.03; V = math.pi * (2.65**2 - 1.75**2) * L; m = V * 1.06e-3
    tot += m; mz += m * Z; my += m * (5.03 + top) / 2
    print('%s at X %+.2f Z %+.2f: first surface above at y %.2f (%s); post %.1f mm, %.0f mm3, %.2f g' % (k, X, Z, top, first[1], L, V, m))
body_c = -10.41
print('posts %.2f g at mean z %+.2f; moved out of the body centroid (z %.2f): CoM shift %+.2f mm' % (tot, mz / tot, body_c, tot * (mz / tot - body_c) / 29.312))
