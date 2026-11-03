#!/bin/bash
# retrying wrapper: shot.sh <out.png> <w> <h> <query> [extra flags]
cd /home/claude/theseus/3d
for i in 1 2 3 4; do
  if node pcb/tools/shot.mjs pcb/test.html "$1" --w=$2 --h=$3 --q="$4" ${@:5} > /tmp/shot_$$.log 2>&1 && grep -q saved /tmp/shot_$$.log; then
    grep -v "^\s*at " /tmp/shot_$$.log | grep -v "^saved" | head -5; echo "saved $1"; rm -f /tmp/shot_$$.log; exit 0; fi
  sleep 3
done
echo "FAILED $1"; tail -5 /tmp/shot_$$.log; exit 1
