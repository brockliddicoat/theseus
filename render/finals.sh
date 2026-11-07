#!/bin/sh
# The two hero renders at 1400 px, one render thread, under nice, one after the other.
cd "$(dirname "$0")/.." || exit 1
LOG=render/out/render_log.txt
for shot in hero inside; do
  t0=$(date +%s)
  nice -n 10 python3 render/scene.py --shot $shot --res 1400 --spp ${SPP:-64} --noise ${NOISE:-0.03} --out render/out/${shot}_1400.png > render/out/${shot}_1400.log 2>&1
  t1=$(date +%s)
  echo "$(date '+%F %T') $shot 1400px spp<=${SPP:-64} thr ${NOISE:-0.03}: $((t1 - t0)) s" >> $LOG
done
