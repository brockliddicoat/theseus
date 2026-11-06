import sys, numpy as np
sys.path.insert(0, '/home/claude/work/l1/fe')
import l1fe
from l1geo import quality
d = dict(kind='tri', lam=0.3464, w=0.6, hr=2.0, draft=0.5, r_root=0.3, r_node=0.4, h=1.5)
model, info = l1fe.build(d)
print('ledge', info['n_ledge'], 'extra', info['n_ledge_extra'], 'nose', info['n_nose'], 'rail', info['n_rail'], 'rib', info['n_rib'])
res, U = l1fe.evaluate(model)
m = model['m']; amin, L = quality(model['Xo'], model['tri'])
for case in ['crown', 'squeeze']:
    vms, vbs, _ = l1fe.shell_split(m, U[case], 0); use = vms / 120 + vbs / 207
    o = np.argsort(use)[::-1][:6]
    C = model['Xo'][model['tri']].mean(1)
    for i in o: print(case, 'use', round(use[i], 3), 'at', C[i].round(2), 'minang', round(amin[i], 1), 't', round(model['t_el'][i], 3), 'vm_mem', round(vms[i],1), 'vm_b', round(vbs[i],1))
    good = amin > 15
    print(case, 'max use (min angle>15):', round(use[good].max(), 3), ' all:', round(use.max(), 3), ' P99.9:', round(np.percentile(use, 99.9), 3))
print('crown', res['crown'], 'squeeze', res['squeeze'])
