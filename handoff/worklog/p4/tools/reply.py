"""Insert reply blocks under findings in a shared review file. usage: python3 reply.py <file> <replies.json>
replies.json: [[marker, reply_text], ...]: the reply goes after the paragraph that contains the marker (the next blank line or
'**' finding start or '## ' section). Skips a marker whose reply (first 40 chars) is already present."""
import sys, json, pathlib, fcntl
f, rj = sys.argv[1], sys.argv[2]
reps = json.load(open(rj))
p = pathlib.Path(f)
with open(f, 'r+') as fh:
    fcntl.flock(fh, fcntl.LOCK_EX)
    s = fh.read()
    for marker, reply in reps:
        if reply[:40] in s: print('already', marker); continue
        i = s.find(marker)
        if i < 0: print('MISSING', marker); continue
        # end of the finding paragraph: the next line that starts a new finding, a reply, a blank line or a section
        lines = s[i:].split('\n'); off = i + len(lines[0]) + 1
        for ln in lines[1:]:
            if ln.strip() == '' or ln.startswith('**') or ln.startswith('## ') or ln.startswith('> ') or ln.startswith('- ') or ln.startswith('(F'):
                break
            off += len(ln) + 1
        block = '\n'.join('> ' + l if l else '>' for l in reply.split('\n')) + '\n'
        s = s[:off] + block + s[off:]
        print('ok', marker)
    fh.seek(0); fh.write(s); fh.truncate()
