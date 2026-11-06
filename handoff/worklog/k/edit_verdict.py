import json, pathlib
E = []
E.append([
" * o = { from, to (numbers or strings: one precision for both, G5), unit ('MPa', '%', '°', '×' attach without a space),\n",
" * o = { from, to (numbers or strings: one precision for both, G5), unit ('MPa', 'mm', '%': a space before it, as the film\n"
" *   writes \"17.6 %\"; only '°' (an angle) and '×' (a factor) attach, SI Brochure 9th ed. §5.4.3, §5.4.7),\n"])
E.append([
" *   'center'), rivalCol ('second' | 'grey': the colour of the rival's name), maxW (the label's width) }\n"
" * Returns { w, h, x0 } (the row's left edge and size, for layout).\n",
" *   'center'), rivalCol ('second' | 'grey': the colour of the rival's name), maxW (the label's width) }\n"
" * The grammar (FILM F8, F15): the struck grey value is always the rival's (or most mice's, or an old design's) and the\n"
" * blue one Theseus's. Never strike Theseus's own alternative: show an internal contrast as plain stats.\n"
" * The names under the values never overlap: the rival's stays left of the new value, wrapped to two lines when it is\n"
" * longer than the old value and the arrow, and only a single word too long for that moves Theseus's name right.\n"
" * Returns { w, h, x0 } (the row's left edge and size, for layout).\n"])
E.append([
"  const u = o.unit || '', tight = /^(%|°|×|x)$/.test(u), fmt = v => kitNum(v, dec), betterHigh = o.better === 'higher';\n",
"  /* tight: a symbol set big (%, °, ×); glue: one that attaches to its number (° and ×; % and every unit take a space) */\n"
"  const u = o.unit || '', tight = /^(%|°|×|x)$/.test(u), glue = /^(°|×|x)$/.test(u), fmt = v => kitNum(v, dec), betterHigh = o.better === 'higher';\n"])
E.append([
"  const uGap = z => (tight ? 0.03 : 0.16) * z, stOld",
"  const uGap = z => (glue ? 0.03 : 0.16) * z, stOld"])
E.append([
"    const kw = ep(t, cs, cs + 0.4);\n"
"    if (o.who[0]) text(o.who[0], x0, yy, { role: 'label', size: 19, color: o.rivalCol === 'grey' ? C.faint : C.secondText, alpha: kw * a0 });\n"
"    if (o.who[1]) text(o.who[1], xBig, yy, { role: 'label', size: 19, color: C.heroText, alpha: kg * a0 });\n",
"    const kw = ep(t, cs, cs + 0.4), wst = { role: 'label', size: 19 }, room = xBig - x0 - 20;\n"
"    /* the rival's name keeps to its own column, left of the new value: wrapped to two lines when it is longer than the old\n"
"       value and the arrow; only a single word too long for that moves Theseus's name right, so the two never overlap */\n"
"    let l0 = o.who[0] ? [String(o.who[0])] : [];\n"
"    if (l0.length && tw(l0[0], wst) > room) { const ws = wrap(l0[0], wst, room); l0 = ws.length > 2 ? [ws[0], ws.slice(1).join(' ')] : ws; }\n"
"    const w0 = l0.reduce((m, l) => Math.max(m, tw(l, wst)), 0), x1 = l0.length && x0 + w0 + 20 > xBig ? x0 + w0 + 24 : xBig;\n"
"    l0.forEach((l, i) => text(l, x0, yy + i * 23, Object.assign({ color: o.rivalCol === 'grey' ? C.faint : C.secondText, alpha: kw * a0 }, wst)));\n"
"    if (o.who[1]) text(o.who[1], x1, yy, Object.assign({ color: C.heroText, alpha: kg * a0 }, wst));\n"])
pathlib.Path('/home/claude/work/k/edit_verdict.json').write_text(json.dumps(E))
print(len(E), 'edits')
