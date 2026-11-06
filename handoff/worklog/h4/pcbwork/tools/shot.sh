#!/bin/bash
# retrying wrapper: shot.sh <out.png> <w> <h> <query> [extra flags]
# Retries when the browser crashes or the page dies under memory pressure (a crashed GPU process still
# produces a "saved" PNG, so blank frames are detected and re-rendered).
cd /home/claude/theseus/3d
for i in 1 2 3 4 5 6; do
  if node pcb/tools/shot.mjs pcb/test.html "$1" --w=$2 --h=$3 --q="$4" ${@:5} > /tmp/shot_$$.log 2>&1 && grep -q saved /tmp/shot_$$.log; then
    if python3 -c "import sys; from PIL import Image, ImageStat; im=Image.open(sys.argv[1]).convert('L'); im.thumbnail((300,300)); sys.exit(0 if ImageStat.Stat(im).stddev[0] > 3 else 1)" "$1"; then
      grep -v "^\s*at " /tmp/shot_$$.log | grep -v "^saved" | grep -v "GL Driver" | head -5; echo "saved $1"; rm -f /tmp/shot_$$.log; exit 0
    fi
    echo "blank frame (renderer crashed), retry $i" >&2; rm -f "$1"
  fi
  sleep $((5 * i))
done
echo "FAILED $1"; tail -5 /tmp/shot_$$.log; exit 1
