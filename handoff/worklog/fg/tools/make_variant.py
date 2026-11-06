"""A copy of the film with the kit's finger swapped for one of FG's directions (for in-context frames; never published).
usage: python3 make_variant.py <film.html> <style A|B|C> <out.html>
URL switches on the variant page: &fgsurf=0 (give every side-view call with no surface a level one: what an owner's
one-word fix does on b05/b06), &fgthumb=1 (draw the thumb: b03_side's owner adds digit: 'thumb')."""
import sys, pathlib
film, style, out = sys.argv[1], sys.argv[2], sys.argv[3]
src = pathlib.Path('/home/claude/work/fg/src')
code = (src / '19-fg-model.js').read_text() + '\n' + (src / '19-fg-draw.js').read_text()
ov = """
(function () {
  const q = new URLSearchParams(location.search), surf0 = q.get('fgsurf'), thumb = q.get('fgthumb');
  window.__fgOld = finger;
  window.finger = function (x, y, ang, o = {}) {
    const p = Object.assign({ style: '%s' }, o);
    if (surf0 != null && p.surf == null && (p.view || 'side') === 'side') p.surf = +surf0;
    if (thumb) p.digit = 'thumb';
    return fgFinger(x, y, ang, p);
  };
})();
""" % style
h = pathlib.Path(film).read_text()
i = h.rindex('</body>')
h = h[:i] + '<script>\n' + code + ov + '\n</script>\n' + h[i:]
pathlib.Path(out).write_text(h)
print(out, len(h))
