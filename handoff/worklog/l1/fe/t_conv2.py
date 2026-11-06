import sys, time, numpy as np
sys.path.insert(0, '/home/claude/work/l1/fe')
import l1fe
kind = sys.argv[1]; hs = [float(x) for x in sys.argv[2].split(',')]
for h in hs:
    d = dict(kind='none', rails=True, h=h) if kind == 'none' else dict(kind='none', rails=False, h=h) if kind == 'norail' else dict(kind='tri', lam=0.3464, w=0.6, hr=1.6, r_root=0.3, r_node=0.4, h=h)
    t0 = time.time(); model, info = l1fe.build(d); res, U = l1fe.evaluate(model)
    u = res['use']
    print(kind, 'h', h, 'N', info['N'], 't %.3f' % info['t'], '| crown %.1f worst %.1f off %.1f palm %.2f squeeze %.1f um' % tuple(1000*x for x in [res['crown']['defl'], res['grid']['worst'], res['off']['defl'], res['palm']['defl'], res['squeeze']['defl']]),
          '| use crown skin %.3f  squeeze skin %.3f' % (u['crown']['skin_use'], u['squeeze']['skin_use']), '| %.0f s' % (time.time()-t0), flush=True)
