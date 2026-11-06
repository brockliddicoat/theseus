# usage: python3 insert.py <review file> <section file> : puts the section right after the file's first heading line
# (newest first), creating the file with a heading if it doesn't exist
import sys, os
f, s = sys.argv[1], sys.argv[2]
sec = open(s).read().strip('\n') + '\n\n'
code = os.path.basename(f).split('.')[0]
if not os.path.exists(f):
    open(f, 'w').write(f'# Review findings for {code}\n\n' + sec); print('created', f); sys.exit()
txt = open(f).read()
i = txt.find('\n')
head, rest = txt[:i + 1], txt[i + 1:].lstrip('\n')
open(f, 'w').write(head + '\n' + sec + rest)
print('inserted into', f)
