#!/usr/bin/env bash
set -u
S=/home/claude/theseus/feedback/snap.sh
O=/home/claude/work/fa/old
V3='The player opened in 3D by default then (2D if he had switched, remembered by his browser); the 3D assets on disk today are not that day'"'"'s, so these are the 2D view.'
run() { echo "=== $(date +%H:%M:%S) $*"; nice -n 10 "$S" "$@" || echo "FAILED $*"; }
WHEN='2026-11-04 21:47 to ~21:55' LIVE='not recorded (v14 went live at 20:58); nearest committed build before: a33747b (21:44, plate v3)' COMMIT='a33747b' BUILD='git show a33747b:deck/dist/main.html' NOTE="F21: the slides behind his answers that F27 never rated: the inserts (F21.3, F21.5, F21.12), the Newtonian profiles (F21.12), the size slide (F21.13), the plate (F21.2, F21.14). $V3" run F21 $O/c2144.html own_insert:settle own_life:settle shp_newton:settle size:settle pltPlate:settle
WHEN='2026-11-04 ~15:20' LIVE='not recorded; nearest committed build before: f608549 (15:13, the bottom plate in 2D and 3D)' COMMIT='f608549' BUILD='git show f608549:deck/dist/main.html' NOTE="F20: the plate as the plate builder had it when he answered (skates, the clip-on lens dots, the skin, the half-moons). $V3" run F20 $O/c1513.html pltPlate:settle pltSim:settle
WHEN='2026-11-04 ~10:20' LIVE='not recorded; nearest committed build before: 42cf92c (10:10, Shell B rebuilt)' COMMIT='42cf92c' BUILD='git show 42cf92c:deck/dist/main.html' NOTE="F13: the Shell B slides the questions were about: the strength strip on the arch and fibre slides (F13.1), the mold (F13.2), the gate (F13.3), the thumb band (F13.4). $V3" run F13 $O/c1010.html shbArches:settle shbFibres:settle shbMill:settle shbGates:settle shbSides:settle
echo "=== done $(date +%H:%M:%S)"
