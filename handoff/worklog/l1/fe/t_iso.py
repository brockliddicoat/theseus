import sys, time, numpy as np
sys.path.insert(0, '/home/claude/work/l1/fe')
import l1fe
for h in [1.1, 0.8]:
    for hr in [0.01, 1.6]:
        d = dict(kind='tri', lam=0.3464, w=0.6, hr=hr, r_root=0.0, r_node=0.0, h=h, t=0.74 if hr < 0.1 else 0.487)
        t0 = time.time(); model, info = l1fe.build(d); res, U = l1fe.evaluate(model)
        print('tri hr', hr, 'h', h, 'N', info['N'], 't %.3f' % info['t'], '| crown %.1f worst %.1f off %.1f squeeze %.1f um' % tuple(1000*x for x in [res['crown']['defl'], res['grid']['worst'], res['off']['defl'], res['squeeze']['defl']]),
              '| slivers', res['mesh']['n_sliver'], 'P1 angle %.1f' % res['mesh']['minang_p1'], '| %.0f s' % (time.time()-t0), flush=True)
