#!/bin/bash
# the topology tie-break first: kagome and true triangles, each translated twice (pure translations)
cd /home/claude/work/l1/fe
nice -n 5 python3 sweep.py stageE.json > stageE.out 2>&1
