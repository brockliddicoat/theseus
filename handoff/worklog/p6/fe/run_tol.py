"""P6: the mould's +-0.076 mm on Theseus's ribbed shell and on plain walls, solved with L1's own 3D model (read-only import
of /home/claude/work/l1/fe/l1fe.py; nothing of L1's is written). One design at a time; waits while any L1 solver runs.
Results: /home/claude/work/p6/fe/out/<label>.json. Usage: L1_CREASE=slope python3 run_tol.py tol.json"""
import sys, os, json, time, subprocess
sys.path.insert(0, '/home/claude/work/l1/fe')
OUT = '/home/claude/work/p6/fe/out'; os.makedirs(OUT, exist_ok=True)
def busy():
    p = subprocess.run(['pgrep', '-f', 'sweep.py|winK.py|stage[A-Z]\\.py|tjunction.py|flowlen.py'], capture_output=True, text=True)
    mine = str(os.getpid())
    return [x for x in p.stdout.split() if x != mine]
import l1fe, numpy as np
def conv(o):
    if isinstance(o, dict): return {k: conv(v) for k, v in o.items()}
    if isinstance(o, (list, tuple)): return [conv(v) for v in o]
    if isinstance(o, (np.floating,)): return float(o)
    if isinstance(o, (np.integer,)): return int(o)
    if isinstance(o, np.ndarray): return o.tolist()
    return o
designs = json.load(open(sys.argv[1]))
for d in designs:
    f = os.path.join(OUT, d['label'] + '.json')
    if os.path.exists(f): print('cached', d['label'], flush=True); continue
    while busy(): time.sleep(10)
    t0 = time.time()
    model, info = l1fe.build({k: v for k, v in d.items() if k != 'label'})
    r, U = l1fe.evaluate(model)
    r['d'] = d; r['wall'] = time.time() - t0
    r = conv(r); json.dump(r, open(f, 'w'))
    print(f"{d['label']} t={r['info']['t']:.4f} mass={r['info']['mass']:.3f} | crown {1e3*r['crown']['defl']:.2f} worst {1e3*r['grid']['worst']:.2f} off {1e3*r['off']['defl']:.2f} squeeze {1e3*r['squeeze']['defl']:.2f} palm {1e3*r['palm']['defl']:.3f} um | {r['wall']:.0f}s", flush=True)
