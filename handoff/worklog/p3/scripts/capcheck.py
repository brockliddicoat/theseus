# for every captions(t, [[t0, 'text'], ...]) in a file: does each line finish typing (70 cps) before the next one fades (next - 0.25)?
import re, sys
for p in sys.argv[1:]:
    s = open(p).read()
    for m in re.finditer(r"captions\(t, \[", s):
        i = m.end() - 1; depth = 0; j = i
        while True:
            c = s[j]
            if c == "'":
                j += 1
                while s[j] != "'":
                    j += 2 if s[j] == '\\' else 1
            elif c == '[': depth += 1
            elif c == ']':
                depth -= 1
                if depth == 0: break
            j += 1
        block = s[i:j+1]
        steps = re.findall(r"\[\s*([0-9.]+)\s*,\s*'((?:[^'\\]|\\.)*)'", block)
        sid = re.findall(r"id: '([a-z0-9_]+)'", s[:m.start()])
        sid = sid[-1] if sid else '?'
        for k, (t0, txt) in enumerate(steps):
            t0 = float(t0); n = len(txt.replace("\\'", "'")); done = t0 + n / 70
            nxt = float(steps[k+1][0]) - 0.25 if k + 1 < len(steps) else None
            flag = '' if nxt is None or done <= nxt else '  << CUT: done %.2f, fades %.2f' % (done, nxt)
            if flag or '-v' in sys.argv: print(f"{sid:16s} {t0:5.2f} {n:4d} chars{flag}")
