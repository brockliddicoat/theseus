#!/bin/bash
# usage: frames.sh <outdir> <html> id[:settle] ...  : shoots each slide at t 0, 0.4 x settle and settle (desktop), a phone-size
# copy of the settle frame (the stage at 0.44x, as R2's phone.py), and one contact sheet per slide (<outdir>/<id>_sheet.jpg)
out=$1; html=$2; shift 2
mkdir -p "$out"
for spec in "$@"; do
  id=${spec%%:*}; st=${spec#*:}; [ "$st" = "$spec" ] && st=11
  mid=$(python3 -c "print(round($st*0.4,2))")
  Q='&2d=1' timeout 600 node /home/claude/theseus/deck/tools/shot.js "$html" "$out" "$id:0.02" "$id:$mid" "$id:$st" >/dev/null 2>&1
  python3 /home/claude/work/r2/scripts/phone.py "$out/${id}_${st}.png" "$out/${id}_phone.png" >/dev/null
  python3 /home/claude/theseus/deck/tools/sheet.py "$out/${id}_sheet.jpg" 2 960 "$out/${id}_0.02.png" "$out/${id}_${mid}.png" "$out/${id}_${st}.png" "$out/${id}_phone.png" >/dev/null
  echo "$out/${id}_sheet.jpg"
done
