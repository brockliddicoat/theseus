"""Stand-in for HersheyFonts. OpenCV 5 draws its FONT_HERSHEY_SIMPLEX as a filled sans glyph (not Hershey strokes), so
the text is that glyph, drawn at a fine scale, grown (or thinned) through its signed distance field until its strokes are
`w` wide with round ends, and traced back to polygons. Sizes follow the real package: `height` is the font's full height,
the caps are 0.75 of it (checked on the old board: 'MAIN  PCB  V1.0' at 0.5 came out 4.69 x 0.46 mm in ink), and a space
is 16 of the 21 units of cap height. geom.hershey_text calls text_geometry() when it exists."""
import math
import numpy as np, cv2

FONT = cv2.FONT_HERSHEY_SIMPLEX
TRACK = 0.11         # letter advance taken off, in caps (fitted: 'MAIN  PCB  V1.0' at 0.5 is 4.69 mm wide on the old board)
_M = None


def _metrics():
    """(cap height, stroke width) of the drawn glyphs at fontScale 1, in px, measured at scale 20"""
    global _M
    if _M is None:
        img = np.zeros((900, 900), np.uint8)
        cv2.putText(img, 'H', (100, 800), FONT, 20.0, 1, 1, cv2.LINE_8)
        rows = np.nonzero(img.any(1))[0]
        img2 = np.zeros((900, 900), np.uint8)
        cv2.putText(img2, 'I', (100, 800), FONT, 20.0, 1, 1, cv2.LINE_8)
        cols = np.nonzero(img2.any(0))[0]
        _M = ((rows.max() - rows.min() + 1) / 20.0, (cols.max() - cols.min() + 1) / 20.0)
    return _M


class HersheyFonts:
    def __init__(self):
        self.height = 1.0

    def load_default_font(self, name=None):
        return self

    def normalize_rendering(self, factor=1.0):
        self.height = float(factor)

    def lines_for_text(self, text):
        raise NotImplementedError('shim HersheyFonts: use text_geometry()')

    def text_geometry(self, text, height, w, spacing=1.0):
        """the text as shim polygons, ink as the real package's strokes of width w would make it; baseline near y = 0"""
        import sdfgeom as G
        cap = 0.75 * height                               # cap height on the stroke centrelines (mm)
        hp = min(0.004, w / 12.0)                         # mm per pixel of the drawing
        G1, S1 = _metrics()                               # glyph ink cap height and stroke at fontScale 1 (px)
        # the drawn glyph's ink cap is cap + its own stroke; after growing by (w - stroke) / 2 the ink is cap + w
        s = (cap / hp) / (G1 - S1)
        stroke = S1 * s * hp                              # the glyph's own stroke width (mm)
        grow = (w - stroke) / 2.0
        pad = int((abs(grow) + w) / hp) + 6
        adv = []
        for ch in text:
            if ch == ' ':
                adv.append(16.0 / 21.0 * (cap / hp))      # the Hershey space: 16 units against 21 of cap height
            else:
                (cw, _), _ = cv2.getTextSize(ch, FONT, s, 1)
                adv.append(cw - TRACK * (cap / hp))       # tighter than OpenCV's advances: Hershey's footprint
        W = int(sum(adv) * spacing + 2 * pad + 8); Hh = int(G1 * s * 1.6 + 2 * pad)
        ink = np.zeros((Hh, W), np.uint8)
        x = pad; yb = Hh - pad - int(G1 * s * 0.3)
        for ch, a in zip(text, adv):
            if ch != ' ':
                cv2.putText(ink, ch, (int(round(x)), yb), FONT, s, 255, 1, cv2.LINE_8)
            x += a * spacing
        if not ink.any():
            return G.Polygon()
        out = cv2.distanceTransform(255 - ink, cv2.DIST_L2, cv2.DIST_MASK_PRECISE)     # outside: px to the glyph
        inn = cv2.distanceTransform(ink, cv2.DIST_L2, cv2.DIST_MASK_PRECISE)           # inside: px to the background
        sd = np.where(ink > 0, -(inn - 0.5), out - 0.5) * hp                           # signed, at the pixel edge
        D = (sd - grow).astype(np.float32)[::-1].copy()                                # y up
        oldH, oldO = G.H, G.O
        try:
            G.H, G.O = hp, 0.0
            g = G._contour(D, (0, 0, W, Hh), tol=hp * 0.35)
        finally:
            G.H, G.O = oldH, oldO
        return G.translate(g, 0, -(Hh - 1 - yb) * hp)
