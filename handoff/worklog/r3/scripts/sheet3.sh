#!/bin/bash
# usage: sheet3.sh <shotdir> <tag> id1 id2 ... : 2x2 sheet (0, mid, settle, phone-size settle) into r2/sheets/<id>_<tag>.jpg
D=$1; TAG=$2; shift 2; S=/home/claude/work/r3/scripts; O=/home/claude/work/r3/sheets
cd $D
for id in "$@"; do
  fs=$(ls *_${id}_*.png 2>/dev/null | grep -E "_${id}_[0-9.]+\.png$" | sed -E "s/.*_${id}_([0-9.]+)\.png/\1/" | sort -g)
  arr=($fs); n=${#arr[@]}; [ $n -lt 3 ] && { echo "skip $id ($n)"; continue; }
  pre=$(ls *_${id}_0.png | sed -E "s/_0\.png$//")
  a=${arr[0]}; c=${arr[$((n-2))]}; d=${arr[$((n-1))]}
  python3 $S/phone.py ${pre}_$d.png /tmp/r3_phone_$id.png >/dev/null
  python3 - "$O/${id}_${TAG}.jpg" ${pre}_$a.png ${pre}_$c.png ${pre}_$d.png /tmp/r3_phone_$id.png "t=$a" "t=$c" "t=$d" "phone" <<'PY'
import sys
from PIL import Image, ImageDraw, ImageFont
out = sys.argv[1]; files = sys.argv[2:6]; labels = sys.argv[6:10]
W, H = 1920, 1080
sheet = Image.new('RGB', (W, H), (128, 128, 128))
font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 22)
for i, f in enumerate(files):
    im = Image.open(f).convert('RGB')
    if i < 3: im = im.resize((W // 2 - 4, H // 2 - 4), Image.LANCZOS)
    x = (i % 2) * (W // 2) + 2; y = (i // 2) * (H // 2) + 2
    sheet.paste(im, (x, y))
    d = ImageDraw.Draw(sheet); d.rectangle([x, y, x + 150, y + 30], fill=(255, 0, 255)); d.text((x + 6, y + 3), labels[i], fill=(255, 255, 255), font=font)
sheet.save(out, quality=90)
PY
  echo "$id: $a $c $d"
done
