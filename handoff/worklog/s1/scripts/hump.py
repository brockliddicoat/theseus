"""The centre hump: a vertical warp of the shell above the hard crease (y = Y_C) that moves the side profile's apex from
z_op (today, 62 % back) to z_np, keeping the length, the width (x never changes, so the top view is untouched), the
height (the apex stays at its height), the nose and the tail.

    h_new(z) = h_old(phi(z)),   phi(z) = z + (z_op - z_np) * b(z)

b is a C2 bump: 1 at z_np, 0 behind z_t and ahead of z_f (quintic smoothsteps), so phi is the identity on the tail and the
nose and monotone in between (needs z_np - z_t > 1.875 |z_op - z_np|). Each vertex above the crease is scaled about it:
    y' = Y_C + (y - Y_C) * k(z),   k(z) = (h_new(z) - Y_C) / (h_old(z) - Y_C)
so the base, the rim below the crease, the skates, the board and everything under y = Y_C stay put, and the one slope change
in the side wall sits on the crease that is already there.
"""
import json, sys
import numpy as np
Y_C = 9.3

def smooth5(t):
    t = np.clip(t, 0, 1); return t * t * t * (t * (6 * t - 15) + 10)

class Hump:
    def __init__(self, prof, z_np, z_t=-42.0, z_f=46.0, z_op=None):
        z = np.asarray(prof['z']); h = np.array([np.nan if v is None else v for v in prof['sil']], float)
        ok = np.isfinite(h); self.z, self.h = z[ok], h[ok]
        self.z_op = float(self.z[np.argmax(self.h)]) if z_op is None else z_op
        self.z_np, self.z_t, self.z_f = z_np, z_t, z_f
        self.H = float(self.h.max())
    def b(self, z):
        z = np.asarray(z, float)
        return np.where(z <= self.z_np, smooth5((z - self.z_t) / (self.z_np - self.z_t)), smooth5((self.z_f - z) / (self.z_f - self.z_np)))
    def phi(self, z): return np.asarray(z, float) + (self.z_op - self.z_np) * self.b(z)
    def h_old(self, z): return np.interp(z, self.z, self.h)
    def h_new(self, z): return self.h_old(self.phi(z))
    def k(self, z):
        return (self.h_new(z) - Y_C) / np.maximum(self.h_old(z) - Y_C, 1e-6)
    def warp(self, P):
        P = np.array(P, float); y, z = P[:, 1], P[:, 2]
        up = y > Y_C
        P[up, 1] = Y_C + (y[up] - Y_C) * self.k(z[up])
        return P
    def warp_normals(self, P, N):
        """normals under y' = Y_C + (y - Y_C) k(z): J = [[1,0,0],[0,k,(y-Y_C)k'],[0,0,1]]; n' ~ J^-T n"""
        P = np.asarray(P, float); N = np.array(N, float)
        y, z = P[:, 1], P[:, 2]; up = y > Y_C
        kk = self.k(z); dz = 0.05; kp = (self.k(z + dz) - self.k(z - dz)) / (2 * dz)
        # J^-T: inverse of J is [[1,0,0],[0,1/k,-(y-Y_C)k'/k],[0,0,1]]; its transpose
        n = N.copy()
        ny = N[:, 1] / kk; nz = N[:, 2] - (y - Y_C) * kp / kk * N[:, 1]
        n[up, 1] = ny[up]; n[up, 2] = nz[up]
        return n / np.maximum(np.linalg.norm(n, axis=1, keepdims=True), 1e-12)

if __name__ == '__main__':
    prof = json.load(open('/home/claude/work/s1/profile_centre.json'))
    nose, tail = prof['nose'], prof['tail']; L = nose - tail
    for pct in (50, 54):
        z_np = nose - pct / 100 * L
        H = Hump(prof, z_np)
        zz = np.linspace(tail, nose, 2000); hn = H.h_new(zz)
        dphi = np.gradient(H.phi(zz), zz)
        print('%d %%: apex z %.2f (%.1f mm from the nose), h %.2f; min phi\' %.3f; max lift %.2f at z %.1f; max drop %.2f at z %.1f; k range %.3f..%.3f' % (
            pct, zz[np.argmax(hn)], nose - zz[np.argmax(hn)], hn.max(), dphi.min(), (hn - H.h_old(zz)).max(), zz[np.argmax(hn - H.h_old(zz))],
            (hn - H.h_old(zz)).min(), zz[np.argmin(hn - H.h_old(zz))], H.k(zz).min(), H.k(zz).max()))
