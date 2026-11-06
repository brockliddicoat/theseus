# usage: python3 filmins.py <section file> : inserts the section above the first "## " heading of review/FILM.md (newest first)
import sys
f = '/home/claude/work/review/FILM.md'
sec = open(sys.argv[1]).read().strip('\n') + '\n\n'
txt = open(f).read()
i = txt.find('\n## ')
open(f, 'w').write(txt[:i + 1] + sec + txt[i + 1:])
print('inserted into', f)
