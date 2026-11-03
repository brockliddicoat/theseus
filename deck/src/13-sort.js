/* move every slide into its chapter, keeping the order slides were written in within a chapter, so the
   idea sheets (written after the main slides) land at the end of their chapters */
(function () {
  const idx = s => DECK.chapters.findIndex(c => c.key === s.ch);
  const all = DECK.slides.map((s, i) => [s, i]).sort((a, b) => (idx(a[0]) - idx(b[0])) || (a[1] - b[1]));
  DECK.slides.length = 0; all.forEach(p => DECK.slides.push(p[0]));
})();
