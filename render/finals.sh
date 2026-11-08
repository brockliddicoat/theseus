#!/bin/sh
# The final renders, one render thread, under nice, one after the other: the two 1400 px heroes, then the close crop.
#   SPP=64 NOISE=0.03 ./render/finals.sh            (SHOTS="hero inside macro" by default)
cd "$(dirname "$0")/.." || exit 1
LOG=render/out/render_log.txt
for shot in ${SHOTS:-hero inside macro}; do
  res=1400; spp=${SPP:-64}
  [ "$shot" = macro ] && res=700 && spp=40
  t0=$(date +%s)
  nice -n 10 python3 render/scene.py --shot $shot --res $res --spp $spp --noise ${NOISE:-0.03} --out render/out/${shot}_${res}.png > render/out/${shot}_${res}.log 2>&1
  t1=$(date +%s)
  echo "$(date '+%F %T') $shot ${res}px spp<=$spp thr ${NOISE:-0.03}: $((t1 - t0)) s" >> $LOG
done
