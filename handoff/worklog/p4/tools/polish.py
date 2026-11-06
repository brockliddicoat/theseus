"""Exact-string edits to the shared POLISH.md under a lock. usage: python3 polish.py <edits.json>: [[old, new], ...]"""
import sys, json, fcntl
f = '/home/claude/work/POLISH.md'
with open(f, 'r+') as fh:
    fcntl.flock(fh, fcntl.LOCK_EX)
    s = fh.read()
    for old, new in json.load(open(sys.argv[1])):
        if old not in s: print('MISSING', old[:80]); continue
        s = s.replace(old, new, 1); print('ok', old[:60])
    fh.seek(0); fh.write(s); fh.truncate()
