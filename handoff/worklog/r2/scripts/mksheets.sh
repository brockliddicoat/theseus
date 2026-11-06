#!/bin/bash
# usage: mksheets.sh <shotdir> <tag> id1 id2 ... : 2x2 sheet (0, 0.6, mid, settle) + phone view of settle, into sheets/<id>_<tag>.jpg
D=$1; TAG=$2; shift 2; S=/home/claude/work/r2/scripts; O=/home/claude/work/r2/sheets
cd $D
for id in "$@"; do
  fs=$(ls *_${id}_*.png 2>/dev/null | grep -E "_${id}_[0-9.]+\.png$" | sed -E "s/.*_${id}_([0-9.]+)\.png/\1/" | sort -g)
  arr=($fs); n=${#arr[@]}; [ $n -lt 4 ] && { echo "skip $id ($n)"; continue; }
  pre=$(ls *_${id}_0.png | sed -E "s/_0\.png$//")
  a=${arr[0]}; b=${arr[1]}; c=${arr[$((n-2))]}; d=${arr[$((n-1))]}
  python3 $S/sheet.py $O/${id}_${TAG}.jpg ${pre}_$a.png ${pre}_$b.png ${pre}_$c.png ${pre}_$d.png "t=$a" "t=$b" "t=$c" "t=$d" >/dev/null
  python3 $S/phone.py ${pre}_$d.png $O/${id}_${TAG}_phone.png >/dev/null
  echo "$id: $a $b $c $d"
done
