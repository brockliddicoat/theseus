"""P6: re-solve the lattice study's winner and the plain wall at Brock's 1.75 deg crease (F55.1; S2 13:45:
y = 4.6408 - 0.030553 z, scene frame, crease_line_175.json), with L1's own model imported read-only. The crease function is
replaced in memory (l1geo and l1fe) before the chart is built; nothing of L1's is written. One solve at a time; waits for
any L1 solver. Results: /home/claude/work/p6/fe/crease175/<label>.json"""
import sys, os, json, time, subprocess
sys.path.insert(0, '/home/claude/work/l1/fe')
import numpy as np
import l1geo
def y_crease_175(z):
    z = np.asarray(z, float); return 4.6408 - 0.030553 * z
l1geo.CREASE = 'slope175'; l1geo.y_crease = y_crease_175
import l1fe
l1fe.y_crease = y_crease_175
assert l1fe._CHART is None
OUT = '/home/claude/work/p6/fe/crease175'
def busy():
    p = subprocess.run(['pgrep', '-f', 'sweep.py|winK.py|stage[A-Z]\\.py|tjunction.py|run_tol.py'], capture_output=True, text=True)
    return [x for x in p.stdout.split() if x != str(os.getpid())]
def mem_ok(need_mb=4600):
    for ln in open('/proc/meminfo'):
        if ln.startswith('MemAvailable:'): return int(ln.split()[1]) / 1024 > need_mb
    return True
def conv(o):
    if isinstance(o, dict): return {k: conv(v) for k, v in o.items()}
    if isinstance(o, (list, tuple)): return [conv(v) for v in o]
    if isinstance(o, (np.floating,)): return float(o)
    if isinstance(o, (np.integer,)): return int(o)
    if isinstance(o, np.ndarray): return o.tolist()
    return o
F = json.load(open('/home/claude/work/l1/fe/stageF.json'))
w = [d for d in F if d['label'] == 'F-tri-t0.60'][0]
designs = [dict(w, h=0.55, crease='slope175', label='C175-win-h0.55'),
           dict(label='C175-plain+rails-h0.55', kind='none', rails=True, h=0.55, crease='slope175')]
if len(sys.argv) > 1 and sys.argv[1] == 'more':
    designs.append(dict(label='C175-plain-norails-h0.55', kind='none', rails=False, h=0.55, crease='slope175'))
if len(sys.argv) > 1 and sys.argv[1] == 'lam':      # L1's rule at this crease: lam solved for the 0.60 skin (lam175.py)
    designs = [dict(w, h=0.55, crease='slope175', lam=float(x), label='C175-win-lam%.4f-h0.55' % float(x)) for x in sys.argv[2:]]
for d in designs:
    f = os.path.join(OUT, d['label'] + '.json')
    if os.path.exists(f): print('cached', d['label'], flush=True); continue
    while busy() or not mem_ok(): time.sleep(10)     # one solver at a time; an h 0.55 solve peaks over 3 GB (13:50: OOM-killed)
    t0 = time.time()
    model, info = l1fe.build({k: v for k, v in d.items() if k != 'label'})
    r, U = l1fe.evaluate(model)
    r['d'] = d; r['wall'] = time.time() - t0
    r = conv(r); json.dump(r, open(f, 'w'))
    print(f"{d['label']} t={r['info']['t']:.4f} mass={r['info']['mass']:.3f} Lrib={r['info'].get('Lrib', 0):.0f} A_lat={r['info']['A_lat']:.0f} A_rim={r['info']['A_rim']:.0f} | crown {1e3*r['crown']['defl']:.2f} worst {1e3*r['grid']['worst']:.2f} off {1e3*r['off']['defl']:.2f} squeeze {1e3*r['squeeze']['defl']:.2f} palm {1e3*r['palm']['defl']:.3f} um | {r['wall']:.0f}s", flush=True)
