# builds the deck's embedded fonts, then writes them into src/00-head.html (the three @font-face lines).
# usage (from deck/tools/fonts):  npm install  &&  python3 build_fonts.py
#   needs fontTools + brotli (pip install fonttools brotli); sources come from npm (inter-ui, @fontsource-variable/jetbrains-mono)
# builds:
#   Inter Display = InterVariable pinned at opsz 32, wght 400-900, 'case' forms baked into the cmap (display is set in caps)
#   Inter         = InterVariable pinned at opsz 14, wght 300-800
#   JetBrains Mono = fontsource variable latin subset, wght 300-800
import sys
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset

SRC_INTER = 'node_modules/inter-ui/variable/InterVariable.woff2'
SRC_JBM = 'node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2'
ranges = [(0x20, 0x7E), (0xA0, 0xFF), (0x131, 0x131), (0x152, 0x153), (0x2010, 0x2027), (0x2030, 0x203A), (0x2070, 0x209F),
          (0x20AC, 0x20AC), (0x2122, 0x2122), (0x2190, 0x2199), (0x21C4, 0x21C6), (0x2200, 0x22FF), (0x2300, 0x2300), (0x25A0, 0x25CF),
          (0x2713, 0x2717), (0x391, 0x3A9), (0x3B1, 0x3C9), (0x2032, 0x2033), (0x2212, 0x2212), (0x2248, 0x2248)]
unis = sorted({u for a, b in ranges for u in range(a, b + 1)})

def bake_feature(font, tag):
    """point the cmap at the glyphs a single-substitution feature would choose (so canvas gets them without font-feature-settings)"""
    gsub = font['GSUB'].table
    idx = [i for i, fr in enumerate(gsub.FeatureList.FeatureRecord) if fr.FeatureTag == tag]
    mapping = {}
    for i in idx:
        for li in gsub.FeatureList.FeatureRecord[i].Feature.LookupListIndex:
            lk = gsub.LookupList.Lookup[li]
            for st in lk.SubTable:
                if lk.LookupType == 7: st = st.ExtSubTable
                if hasattr(st, 'mapping'): mapping.update(st.mapping)
    n = 0
    for table in font['cmap'].tables:
        for u, g in list(table.cmap.items()):
            if g in mapping: table.cmap[u] = mapping[g]; n += 1
    return n

def make(src, out, axes, family, bake=(), keep_unis=unis):
    f = TTFont(src)
    f = instancer.instantiateVariableFont(f, axes)
    for tag in bake: print(family, 'baked', tag, bake_feature(f, tag))
    import io; buf = io.BytesIO(); f.flavor = None; f.save(buf); buf.seek(0); f = TTFont(buf)
    opts = subset.Options(); opts.layout_features = ['*']; opts.flavor = 'woff2'; opts.name_IDs = ['*']; opts.notdef_outline = True
    opts.glyph_names = False; opts.hinting = False; opts.desubroutinize = True
    s = subset.Subsetter(opts); s.populate(unicodes=keep_unis); s.subset(f)
    # rename the family so it can't collide with an installed Inter
    for rec in f['name'].names:
        if rec.nameID in (1, 16): rec.string = family
    f.flavor = 'woff2'; f.save(out)
    import os; print(out, os.path.getsize(out))

make(SRC_INTER, 'out/inter-display.woff2', {'opsz': 32, 'wght': (400, 900)}, 'Inter Display', bake=('case',))
make(SRC_INTER, 'out/inter-text.woff2', {'opsz': 14, 'wght': (300, 800)}, 'Inter')
make(SRC_JBM, 'out/jbmono.woff2', {'wght': (300, 800)}, 'JetBrains Mono')

# ---- embed: replace the three @font-face lines in src/00-head.html with the new files, as base64 ----
import base64, pathlib
head = pathlib.Path(__file__).resolve().parents[2] / 'src' / '00-head.html'
faces = [('Inter Display', '400 900', 'out/inter-display.woff2'), ('Inter', '300 800', 'out/inter-text.woff2'), ('JetBrains Mono', '300 800', 'out/jbmono.woff2')]
lines = head.read_text().split('\n')
for fam, wr, fn in faces:
    b64 = base64.b64encode(open(fn, 'rb').read()).decode()
    css = '@font-face{font-family:"%s";font-style:normal;font-weight:%s;font-display:block;src:url(data:font/woff2;base64,%s) format("woff2");}' % (fam, wr, b64)
    key = '@font-face{font-family:"%s";' % fam
    idx = [i for i, l in enumerate(lines) if l.startswith(key)]
    if idx: lines[idx[0]] = css
    else: print('no @font-face line for', fam, 'in', head)
head.write_text('\n'.join(lines))
print('embedded into', head)
