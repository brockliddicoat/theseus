#!/bin/bash
# the final crease (sloped line): plan, solve; then convergence (the winner at h 0.7 and 0.55; the plain wall, which the
# crease doesn't change, at 0.7 and 0.55) and buckling for the winner and the plain wall
cd /home/claude/work/l1/fe
L1_CREASE=slope nice -n 5 python3 stageF.py > stageF.plan.out 2>&1
L1_CREASE=slope nice -n 5 python3 sweep.py stageF.json > stageF.out 2>&1
L1_CREASE=slope nice -n 5 python3 -c "
import json; F=json.load(open('stageF.json')); w=[d for d in F if d['label']=='F-tri-t0.60'][0]
G=[dict(w, h=0.7, label='G-win-h0.7'), dict(w, h=0.55, label='G-win-h0.55')]
json.dump(G, open('stageG.json','w'), indent=1)
json.dump([dict(w, label='Gb-win')], open('stageGb.json','w'), indent=1)"
L1_CREASE=slope nice -n 5 python3 sweep.py stageG.json > stageG.out 2>&1
nice -n 5 python3 -c "
import json; P=[dict(label='G-plain+rails-h0.7', kind='none', rails=True, h=0.7), dict(label='G-plain+rails-h0.55', kind='none', rails=True, h=0.55)]
json.dump(P, open('stageGp.json','w'), indent=1)
json.dump([dict(label='Gb-plain+rails', kind='none', rails=True, h=0.9)], open('stageGpb.json','w'), indent=1)"
nice -n 5 python3 sweep.py stageGp.json > stageGp.out 2>&1
L1_CREASE=slope nice -n 5 python3 sweep.py stageGb.json --buckle > stageGb.out 2>&1
nice -n 5 python3 sweep.py stageGpb.json --buckle > stageGpb.out 2>&1
