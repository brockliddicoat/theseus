# Power-flow polylines for setPower(): ordered points along real copper (route geometry), tagged by layer.
# 'charge' = USB-C VBUS -> nPM1300 charger -> battery ; 'run' = battery -> PMIC -> bucks -> module + sensor.
# H1 (board plan 5): derived from the routes themselves. For each leg, the net's traces (and its vias, and the pads it
# lands on) make a graph; the shortest path through it from the source pad to the sink pad is the leg, split by layer.
import heapq, math
from shapely.geometry import Point
from layout import pad_poly


def _seg(pts, layer='L1', w=0.3):
    return dict(layer=layer, w=w, pts=[[round(x, 3), round(z, 3)] for x, z in pts])


def _leg(L, net, src, dst):
    """src, dst: (ref, pad name). Returns [segment] along the net's routes from src to dst, or [] if they don't connect.
    Copper that touches is connected: a trace's end on another trace, on a via's land or on a pad (vias in pads too)."""
    K = lambda x, z, l: (round(x, 3), round(z, 3), l)
    adj, width = {}, {}
    def edge(a, b, d, w=None):
        if a == b: return
        adj.setdefault(a, []).append((b, d)); adj.setdefault(b, []).append((a, d))
        if w: width[(a, b)] = width[(b, a)] = w
    segs = [(r['layer'], r['w'], tuple(a), tuple(b)) for r in L['routes'] if r['net'] == net for a, b in zip(r['pts'], r['pts'][1:])]
    vias = [(v['x'], v['z']) for v in L['vias'] if v['net'] == net]
    layers = sorted({l for l, *_ in segs})
    poi = {l: {a for ll, w, a, b in segs if ll == l} | {b for ll, w, a, b in segs if ll == l} | set(vias) for l in layers}
    verts = set()
    for l, w, a, b in segs:
        ax, az = a; bx, bz = b; dx, dz = bx - ax, bz - az; L2 = dx * dx + dz * dz or 1e-12
        on = []
        for (px, pz) in poi[l]:
            t = max(0.0, min(1.0, ((px - ax) * dx + (pz - az) * dz) / L2)); qx, qz = ax + t * dx, az + t * dz
            d = math.hypot(qx - px, qz - pz)
            if d < w / 2 + 0.15:
                on.append((t, qx, qz))
                if d > 1e-6: edge(K(px, pz, l), K(qx, qz, l), d)          # a junction onto the trace's side
                verts.update([K(px, pz, l), K(qx, qz, l)])
        on.sort()
        for (t0, x0, z0), (t1, x1, z1) in zip(on, on[1:]):
            edge(K(x0, z0, l), K(x1, z1, l), math.hypot(x1 - x0, z1 - z0), w)
    verts = list(verts)
    for (vx, vz) in vias:                      # a via: a hub joining every layer's copper on its land
        hub = ('V', vx, vz)
        for q in verts:
            if math.hypot(q[0] - vx, q[1] - vz) < 0.35: edge(hub, q, math.hypot(q[0] - vx, q[1] - vz))
    for p in L['pads']:                        # a pad: a hub joining what lands on it (L1, or every layer when plated through)
        if p.get('net') != net: continue
        g = pad_poly(p).buffer(0.25); tht = bool(p.get('drill') or p.get('slot')); hub = ('P', p['ref'], str(p['name']))
        for q in verts:
            if (q[2] == 'L1' or tht) and g.contains(Point(q[0], q[1])): edge(hub, q, math.hypot(q[0] - p['x'], q[1] - p['z']))
        for (vx, vz) in vias:
            if g.contains(Point(vx, vz)): edge(hub, ('V', vx, vz), 0.0)
    S, T = ('P', src[0], str(src[1])), ('P', dst[0], str(dst[1]))
    if S not in adj or T not in adj: return []
    dist = {S: 0.0}; prev = {}; pq = [(0.0, 0, S)]; tick = 0
    while pq:
        d, _, u = heapq.heappop(pq)
        if d > dist.get(u, 1e18): continue
        if u == T: break
        for v, w in adj.get(u, []):
            nd = d + w
            if nd < dist.get(v, 1e18): dist[v] = nd; prev[v] = u; tick += 1; heapq.heappush(pq, (nd, tick, v))
    if T not in dist: return []
    path = [T]
    while path[-1] in prev: path.append(prev[path[-1]])
    path.reverse()
    pc = lambda ref, name: next((q['x'], q['z']) for q in L['pads'] if q['ref'] == ref and str(q['name']) == name)
    runs, cur, lay, wmax = [], [pc(S[1], S[2])], None, 0.0
    for u, n in zip(path, path[1:-1] + [None]):
        if n is None: break
        if n[0] == 'P': continue               # through a pad on the way (a capacitor's land): its neighbours carry on
        if n[0] == 'V':                        # a layer change: close the run at the via's centre
            cur.append((n[1], n[2]))
            if len(cur) > 1 and lay: runs.append((lay, cur, wmax or 0.25))
            cur, lay, wmax = [(n[1], n[2])], None, 0.0
            continue
        if lay is None: lay = n[2]
        wmax = max(wmax, width.get((u, n), 0.0))
        cur.append((n[0], n[1]))
    cur.append(pc(T[1], T[2]))
    if len(cur) > 1: runs.append((lay or 'L1', cur, wmax or 0.25))
    out = []
    for lay, pts, w in runs:
        clean = [pts[0]] + [q for a, q in zip(pts, pts[1:]) if math.hypot(q[0] - a[0], q[1] - a[1]) > 1e-4]
        if len(clean) > 1: out.append(_seg(clean, lay, w))
    return out


def paths(L):
    comps = {c['ref']: c for c, fp in L['comps']}
    def legs(*spec):
        out = []
        for net, a, b in spec:
            got = _leg(L, net, a, b)
            if not got: print('power_paths: no route for', net, a, '->', b)
            out += got
        return out
    charge = legs(('VBUS', ('J1', 'VBUS_R'), ('U2', 9)), ('VBAT', ('U2', 13), ('J2', 1)))
    run = legs(('VBAT', ('J2', 1), ('U2', 13)), ('SW_B1', ('U2', 31), ('L1', 1)), ('VDD_1V8', ('L1', 2), ('U1', 'B3')),
               ('VDD_1V8', ('L1', 2), ('U3', 3)), ('SW_B2', ('U2', 26), ('L2', 1)), ('VDD_SNS', ('L2', 2), ('U3', 1)))
    node = lambda r: [round(comps[r]['x'], 3), round(comps[r]['z'], 3)]
    return dict(
        charge=dict(label='USB-C VBUS -> nPM1300 charger (JEITA, 22 V OVP) -> battery', segments=charge),
        run=dict(label='battery -> nPM1300 -> buck 1 (1.8 V: module + sensor I/O) / buck 2 (sensor core)', segments=run),
        nodes=dict(usb=node('J1'), pmic=node('U2'), battery=node('J2'), module=node('U1'), sensor=node('U3'), l1=node('L1'), l2=node('L2')),
    )


if __name__ == '__main__':
    import deps  # noqa: F401
    from layout import build
    P = paths(build())
    for m in ('charge', 'run'):
        print(m, [(s['layer'], len(s['pts']), round(sum(math.dist(a, b) for a, b in zip(s['pts'], s['pts'][1:])), 1)) for s in P[m]['segments']])
