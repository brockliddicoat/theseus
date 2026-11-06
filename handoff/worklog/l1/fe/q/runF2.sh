#!/bin/bash
# the final crease: wait for the planner, solve F, the element-wise strength on F's winner and triangles, then the
# convergence (the winner at h 0.7, 0.55; the plain wall at 0.7, 0.55) and buckling (the winner, the plain wall)
cd /home/claude/work/l1/fe
while pgrep -f "stageF.py" > /dev/null; do sleep 5; done
L1_CREASE=slope nice -n 5 python3 sweep.py stageF.json > stageF.out 2>&1
L1_CREASE=slope nice -n 5 python3 winK.py 1.472 stageF > /home/claude/work/l1/out/winK_F.log 2>&1
L1_CREASE=slope nice -n 5 python3 -c "
import json; F=json.load(open('stageF.json')); w=[d for d in F if d['label']=='F-tri-t0.60'][0]
json.dump([dict(w, h=0.7, label='G-win-h0.7'), dict(w, h=0.55, label='G-win-h0.55')], open('stageG.json','w'), indent=1)
json.dump([dict(w, label='Gb-win')], open('stageGb.json','w'), indent=1)
json.dump([dict(label='G-plain+rails-h0.7', kind='none', rails=True, h=0.7), dict(label='G-plain+rails-h0.55', kind='none', rails=True, h=0.55)], open('stageGp.json','w'), indent=1)
json.dump([dict(label='Gb-plain+rails', kind='none', rails=True, h=0.9)], open('stageGpb.json','w'), indent=1)"
L1_CREASE=slope nice -n 5 python3 sweep.py stageGb.json --buckle > stageGb.out 2>&1
nice -n 5 python3 sweep.py stageGpb.json --buckle > stageGpb.out 2>&1
L1_CREASE=slope nice -n 5 python3 sweep.py stageG.json > stageG.out 2>&1
nice -n 5 python3 sweep.py stageGp.json > stageGp.out 2>&1
