#!/bin/bash
# errs on every slide of a built film, in batches of 30 (the checker crashes after ~45 page loads)
export NODE_PATH=/opt/npm-tools/node_modules
F=$1; OUT=$2; : > $OUT
cd /home/claude/live/deck
IDS=$(python3 -c "import json;print(' '.join(json.load(open('$3'))))")
set -- $IDS
while [ $# -gt 0 ]; do
  B=""; for i in $(seq 1 ${BATCH:-30}); do [ $# -gt 0 ] || break; B="$B $1"; shift; done
  TIMES=0.3,4,10 Q='&2d=1' timeout 900 node tools/errs.js $F $B >> $OUT 2>&1
done
echo DONE >> $OUT
