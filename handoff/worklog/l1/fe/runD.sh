#!/bin/bash
# after stage C and the fillet: plan stage D, solve it, then buckling for the winner and the plain wall (one process at a time)
cd /home/claude/work/l1/fe
while pgrep -f "runC.sh|runD0.sh" > /dev/null; do sleep 5; done
nice -n 5 python3 stageD.py > stageD.plan.out 2>&1
nice -n 5 python3 sweep.py stageD.json > stageD.out 2>&1
nice -n 5 python3 sweep.py stageDb.json --buckle > stageDb.out 2>&1
