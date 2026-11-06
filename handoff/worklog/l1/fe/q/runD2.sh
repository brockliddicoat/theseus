#!/bin/bash
# stage D (phases, depth family, rule variants, fine meshes), then buckling for the winner and the plain wall
cd /home/claude/work/l1/fe
nice -n 5 python3 sweep.py stageD.json >> stageD.out 2>&1
nice -n 5 python3 sweep.py stageDb.json --buckle > stageDb.out 2>&1
