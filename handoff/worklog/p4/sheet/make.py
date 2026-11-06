"""Inject a private slide file into a copy of a built deck page, before 20-app.js (so the film is untouched).
usage: python3 make.py <built.html> <slide.js> <out.html>"""
import sys, pathlib
built, slide, out = sys.argv[1:4]
html = pathlib.Path(built).read_text()
app = pathlib.Path('/home/claude/theseus/deck/.snapshot/src/20-app.js').read_text()
i = html.index(app[:400])
code = pathlib.Path(slide).read_text()
pathlib.Path(out).write_text(html[:i] + code + '\n' + html[i:])
print(out, len(html), '->', len(html) + len(code))
