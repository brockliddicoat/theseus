/* move every slide into its chapter, keeping the order slides were written in within a chapter, so the
   idea sheets (written after the main slides) land at the end of their chapters.
   A slide can ask for a place: { after: 'slideId' } or { before: 'slideId' } (same chapter or not), or { first: true }
   to open its chapter. A slide with { replaces: 'slideId' } removes that slide (used when a slide is rebuilt in a new file). */
(function () {
  /* the film's manifest (25-film.js) has already set the order: nothing to sort */
  if (typeof FILM !== 'undefined' && FILM.on) return;
  const idx = s => DECK.chapters.findIndex(c => c.key === s.ch);
  /* replaces may be one id or a list (the revamp's new slides each replace the old slides they absorb); an old slide's
     place is kept for anything anchored after or before it: the anchor moves to the slide that replaced it */
  const repl = {};
  for (const s of DECK.slides.slice()) if (s.replaces) for (const id of [].concat(s.replaces)) { repl[id] = repl[id] || s.id; const k = DECK.slides.findIndex(x => x.id === id && x !== s); if (k >= 0) DECK.slides.splice(k, 1); }
  for (const s of DECK.slides) { if (s.after && repl[s.after]) s.after = repl[s.after]; if (s.before && repl[s.before]) s.before = repl[s.before]; }
  const all = DECK.slides.map((s, i) => [s, i]).sort((a, b) => (idx(a[0]) - idx(b[0])) || ((b[0].first ? 1 : 0) - (a[0].first ? 1 : 0)) || (a[1] - b[1]));
  DECK.slides.length = 0; all.forEach(p => DECK.slides.push(p[0]));
  for (const s of DECK.slides.filter(x => x.after || x.before)) {
    const from = DECK.slides.indexOf(s); DECK.slides.splice(from, 1);
    const k = DECK.slides.findIndex(x => x.id === (s.after || s.before));
    DECK.slides.splice(k < 0 ? from : s.after ? k + 1 : k, 0, s);
  }
  const seen = new Set(); for (const s of DECK.slides) { if (seen.has(s.id)) console.error('duplicate slide id', s.id); seen.add(s.id); }
})();
