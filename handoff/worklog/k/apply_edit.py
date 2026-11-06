# exact-string edits applied identically to several files: python3 apply_edit.py <edits.json> <file> [<file> ...]
# edits.json: [[old, new], ...]; each old must occur exactly once in each file, or nothing is written
import sys, json, pathlib
edits = json.loads(pathlib.Path(sys.argv[1]).read_text())
files = [pathlib.Path(f) for f in sys.argv[2:]]
texts = {}
for f in files:
    s = f.read_text()
    for old, new in edits:
        n = s.count(old)
        if n != 1: sys.exit(f'ABORT {f}: anchor found {n} times: {old[:80]!r}')
        s = s.replace(old, new)
    texts[f] = s
for f, s in texts.items(): f.write_text(s); print('wrote', f)
