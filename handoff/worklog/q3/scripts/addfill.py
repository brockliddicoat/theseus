#!/usr/bin/env python3
"""Insert an entry file at the top of FILLS.md (after the header block), newest first. Usage: addfill.py entry.md"""
import sys, os, fcntl
F = '/home/claude/work/research/FILLS.md'
entry = open(sys.argv[1], encoding='utf-8').read().strip('\n') + '\n\n'
with open(F + '.lock', 'w') as lk:
    fcntl.flock(lk, fcntl.LOCK_EX)
    txt = open(F, encoding='utf-8').read()
    lines = txt.split('\n')
    # header = title line + blank + description paragraph; insert after the first '### ' or at end of header
    idx = None
    for i, l in enumerate(lines):
        if l.startswith('### '):
            idx = i; break
    if idx is None:
        out = txt.rstrip('\n') + '\n\n' + entry
    else:
        out = '\n'.join(lines[:idx]) + '\n' + entry + '\n'.join(lines[idx:])
    tmp = F + '.tmp.q3'
    open(tmp, 'w', encoding='utf-8').write(out)
    os.replace(tmp, F)
print('ok')
