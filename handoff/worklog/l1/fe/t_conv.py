import sys, time, numpy as np
sys.path.insert(0, '/home/claude/work/l1/fe')
import l1fe
for d in [dict(kind='none', rails=True, h=1.5), dict(kind='none', rails=True, h=1.1),
          dict(kind='tri', lam=0.3464, w=0.6, hr=1.6, r_root=0.3, r_node=0.4, h=1.5), dict(kind='tri', lam=0.3464, w=0.6, hr=1.6, r_root=0.3, r_node=0.4, h=1.1)]:
    t0 = time.time(); model, info = l1fe.build(d); res, U = l1fe.evaluate(model, buckle=True)
    u = res['use']
    print(d['kind'], 'h', d['h'], 'N', info['N'], 't %.3f' % info['t'], '| crown %.1f worst %.1f off %.1f palm %.2f squeeze %.1f um' % tuple(1000*x for x in [res['crown']['defl'], res['grid']['worst'], res['off']['defl'], res['palm']['defl'], res['squeeze']['defl']]),
          '| use crown skin %.3f rib %.3f  squeeze skin %.3f rib %.3f' % (u['crown']['skin_use'], u['crown'].get('rib_use', 0), u['squeeze']['skin_use'], u['squeeze'].get('rib_use', 0)),
          '| buckle', {k: round(v, 1) for k, v in res['buckle'].items()}, '| slivers', res['mesh']['n_sliver'], '| %.0f s' % (time.time()-t0))
