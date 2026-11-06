#!/usr/bin/env python3
"""Prepend a finding (newest first) to /home/claude/work/review/<code>.md: python3 prepend.py <code> <finding.md>"""
import sys, os
code, fp = sys.argv[1], sys.argv[2]
path = f'/home/claude/work/review/{code}.md'
new = open(fp).read().rstrip() + '\n\n'
old = open(path).read() if os.path.exists(path) else ''
if old.startswith('# '):
    head, _, rest = old.partition('\n')
    out = head + '\n\n' + new + rest.lstrip('\n')
else:
    out = f'# Review findings for {code}\n\n' + new + old
open(path, 'w').write(out)
print('prepended to', path, len(out), 'bytes')
