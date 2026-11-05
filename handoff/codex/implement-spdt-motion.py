"""Keep the original detailed switch geometry, add a continuous contact for slowed logic.

Only edits this lane's 20-clicks.js. The shared swMM remains byte-for-byte unchanged.
"""
from pathlib import Path

root = Path(__file__).resolve().parents[2]
original = (root / 'deck/src/03-parts.js').read_text(encoding='utf-8-sig')
start = original.index('function swMM(o = {}) {')
end = original.index('\nfunction drawSwitch', start)
switch = original[start:end].replace('function swMM(', 'function rvcSpdtMM(', 1)
edits = {
    "no = o.state ? o.state === 'no' : d >= Q.OP": "contact = clamp(o.contact == null ? (d >= Q.OP ? 1 : 0) : o.contact), no = contact > 0.5",
    'Fy = no ? -3.185 : -4.015': 'Fy = lerp(-4.015, -3.185, contact)',
    '(no ? -0.36 : 0.46)': 'lerp(0.46, -0.36, contact)',
    'const cp = no ? [10.3, -2.86] : [10.3, -4.34];': 'const cp = [10.3, lerp(-4.34, -2.86, contact)];',
    'out.isNO = no;': 'out.contactProgress = contact; out.isNO = no;',
}
for old, new in edits.items():
    assert switch.count(old) == 1, old
    switch = switch.replace(old, new, 1)
path = root / 'deck/revamp/20-clicks.js'
source = path.read_text(encoding='utf-8')
marker = '/* LOCAL_SPDT_GEOMETRY */'
if marker not in source:
    old_start = source.index('// Detailed swMM geometry; only the slowed contact state is continuous.')
    old_end = source.index("RV.add({id:'rv_spdt'", old_start)
    source = source[:old_start] + marker + '\n' + source[old_end:]
assert source.count(marker) == 1
path.write_text(source.replace(marker, '// Detailed swMM geometry; only the slowed contact state is continuous.\n' + switch), encoding='utf-8')
