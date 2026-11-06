#!/usr/bin/env python3
"""Append a RESEARCH line to review/<builder>.md. Usage: review.py b01 'gap filled (answer)'"""
import sys, os, time
b, msg = sys.argv[1], sys.argv[2]
p = f'/home/claude/work/review/{b}.md'
line = f'- {time.strftime("%H:%M")} RESEARCH: {msg}, see research/FILLS.md\n'
new = not os.path.exists(p)
with open(p, 'a', encoding='utf-8') as f:
    if new:
        f.write(f'# Review notes for {b}\n\n')
    f.write(line)
print(line.strip())
