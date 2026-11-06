#!/bin/bash
# usage: shoot.sh <html copy> <outdir> spec... (one browser, PAR=1)
H=$1; O=$2; shift 2
cd /home/claude/theseus/deck && NODE_PATH=/opt/npm-tools/node_modules Q='&2d=1' PAR=1 timeout 1500 node tools/shoot.js "$H" "$O" 0 "$@"
