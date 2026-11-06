"""Build the kit's finger section from FG2's dev copy for the picked nail treatment, and a full 06-motion.js with it.
usage: python3 make_kit.py <soft|line|tone> [--src=/path/06-motion.js]
-> kit/finger-section.<pick>.js (the new section) and kit/06-motion.<pick>.js (the given file with the old section replaced).
The old section is located by its exact text (notes/finger-section-orig.js); the script refuses if it is not there once."""
import sys, re, pathlib
me = pathlib.Path('/home/claude/work/fg2')
pick = sys.argv[1]
opt = dict(a[2:].split('=', 1) for a in sys.argv[2:] if a.startswith('--') and '=' in a)
srcf = pathlib.Path(opt.get('src', '/home/claude/theseus/deck/src/06-motion.js'))
orig = (me / 'notes/finger-section-orig.js').read_text()
body = (me / 'notes/f2-body.js').read_text()
head = '\n'.join(orig.split('\n')[:57]) + '\n'          # FG's header comment, FINGER, fngMono, fngCR (unchanged)
# the header: say what FG2 changed
head = head.replace("   2022, PLoS ONE 17: e0269722). press 1 = 1.5 mm, which flattens about 10 mm of the pad. */",
  "   2022, PLoS ONE 17: e0269722). press 1 = 1.5 mm, which flattens about 10 mm of the pad.\n"
  "   FG2 (Brock 13:18, \"the nails on them don't look quite right still\"; his pick: PICKNAME): the nail redrawn as a real one\n"
  "   sits (a U-shaped cuticle, a rounded free edge, its sides under the folds, a thin plate from the side, in the skin's own\n"
  "   greys with no outline of its own; sheet /home/claude/work/fg2/fg2_nail_options_1351_a.png), and the tip reads round:\n"
  "   the shadow wraps round it in every view (the end view's light/shadow line found on the model), the pressed pad rolls\n"
  "   onto the surface with no corner. */")
names = {'soft': 'A Soft', 'line': 'B Line', 'tone': 'C Tone'}
head = head.replace('PICKNAME', '"' + names[pick] + '"')
assert 'FG2 (Brock 13:18' in head
# the picked treatment only
m = re.search(r"const F2G_NAILS = \{\n(.*?)\n\};\n", body, re.S)
rows = {r.split(':', 1)[0].strip(): r.split(':', 1)[1].strip().rstrip(',') for r in m.group(1).split('\n')}
nailc = ("/* the nail, Brock's pick " + names[pick] + " (white and ink over the skin's greys, [paper, night]): tone, its lift over the skin;\n"
         "   free, the paler free edge; fold, the skin's edge round it (a crease line, x the crease's alpha); hl, the sheen along its\n"
         "   curve (alpha, width x); rim, its darkening toward its sides (it curves away under the folds); edge, a line on the free\n"
         "   edge; pf, the proximal fold's crease */\nconst FNG_NAIL = " + rows[pick] + ";\n")
body = body[:m.start()] + nailc + body[m.end():]
body = body.replace("/* the nail's treatments (white and ink over the skin's greys, [paper, night]): tone, its lift over the skin; free, the paler\n   free edge; fold, the skin's edge round it (a crease line, x the crease's alpha); hl, the sheen along its curve (alpha,\n   width x); rim, a soft darkening just inside its sides (it curves away under the folds); edge, a line on the free edge */\n", "")
assert "the nail's treatments" not in body
body = body.replace("  const NS = F2G_NAILS[o.nail] || F2G_NAILS.soft;\n", "")
body = body.replace("f2gPaint(geo, view, P, p, px, lod, Lx, Ly, L, epitch, dig, NS); }", "f2gPaint(geo, view, P, p, px, lod, Lx, Ly, L, epitch, dig, F2G_NAIL); }")
# no debug overlay in the kit
body = re.sub(r"\n    if \(typeof window !== 'undefined' && window\.F2G_DEBUG.*?\n", "\n", body)
body = body.replace("little lighter (F2G_NAILS), never", "little lighter (F2G_NAIL), never")
assert "F2G_DEBUG" not in body and "F2G_NAILS" not in body, [l for l in body.split("\n") if "F2G_DEBUG" in l or "F2G_NAILS" in l]
sec = head + body.lstrip('\n')
sec = re.sub(r'\bfingerPad2\b', 'fingerPad', sec); sec = re.sub(r'\bfinger2\(', 'finger(', sec)
sec = re.sub(r'\bf2g([A-Z])', r'fng\1', sec); sec = re.sub(r'\bF2G_', 'FNG_', sec); sec = re.sub(r'\bFINGER2\b', 'FINGER', sec)
for bad in ('f2g', 'F2G', 'finger2', 'FINGER2'): assert bad not in sec, bad
sec = sec.replace("its nail 10.5 by 12.7 mm (AIST x 1.03)", "its nail 10.3 by 12.7 mm between the folds")
if not sec.endswith('\n'): sec += '\n'
(me / 'kit').mkdir(exist_ok=True)
(me / ('kit/finger-section.%s.js' % pick)).write_text(sec)
full = srcf.read_text()
n = full.count(orig)
if n != 1: sys.exit('old finger section found %d times in %s: refusing' % (n, srcf))
(me / ('kit/06-motion.%s.js' % pick)).write_text(full.replace(orig, sec))
print('ok', pick, len(sec.split('\n')), 'lines; from', srcf)
