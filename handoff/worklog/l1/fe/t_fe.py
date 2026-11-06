import sys, time, json, numpy as np
sys.path.insert(0, '/home/claude/work/l1/fe')
import l1fe
t0 = time.time()
for d in [dict(kind='none', rails=False, h=1.5), dict(kind='none', rails=True, h=1.5),
          dict(kind='tri', lam=0.3464, w=0.6, hr=2.0, draft=0.5, r_root=0.3, r_node=0.4, h=1.5)]:
    model, info = l1fe.build(d)
    print({k: (round(v, 4) if isinstance(v, float) else v) for k, v in info.items()})
    if model is None: continue
    res, U = l1fe.evaluate(model, buckle=('--b' in sys.argv))
    print(' crown', round(res['crown']['defl']*1000, 1), 'um  worst-grid', round(res['grid']['worst']*1000, 1), 'off', round(res['off']['defl']*1000,1),
          'palm', round(res['palm']['defl']*1000,1), 'squeeze', round(res['squeeze']['defl']*1000,1), 'time', {k: round(v,1) for k,v in res['time'].items()})
    print(' use crown', {k: (round(v, 4) if isinstance(v, float) else v) for k, v in res['use']['crown'].items()})
    print(' use squeeze', {k: (round(v, 4) if isinstance(v, float) else v) for k, v in res['use']['squeeze'].items()})
    if 'buckle' in res: print(' buckle', res['buckle'])
print('total', round(time.time()-t0, 1))
