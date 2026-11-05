"""Reproduce the neutral vector reference package from preserved public SVG paths.

Python 3.10+, standard library only. No network or main-checkout access.
Run: python generate_geometry.py
Verify existing outputs without modifying them: python generate_geometry.py --check
"""

from __future__ import annotations

import argparse
import hashlib
import html
import json
import math
import re
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parent
ARITY = {"M": 2, "L": 2, "H": 1, "V": 1, "C": 6, "S": 4, "Q": 4, "T": 2, "A": 7, "Z": 0}
TOKEN = re.compile(r"[MmLlHhVvCcSsQqTtAaZz]|[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:[eE][-+]?\d+)?")


def number(value: float) -> str:
    return format(value, ".13g")


def fnv1a32(value: str) -> str:
    result = 2166136261
    for char in value:
        result = ((result ^ ord(char)) * 16777619) & 0xFFFFFFFF
    return f"{result:08x}"


def parse_path(d: str) -> list[list]:
    """Expand repeated parameter groups, retaining relative/absolute semantics."""
    tokens = TOKEN.findall(d)
    assert not TOKEN.sub("", d).replace(",", "").strip(), "Unknown path syntax"
    result, index, active = [], 0, None
    while index < len(tokens):
        if tokens[index].isalpha():
            active = tokens[index]
            index += 1
        assert active is not None
        count = ARITY[active.upper()]
        if not count:
            result.append([active])
            active = None
            continue
        values = tokens[index:index + count]
        assert len(values) == count and not any(v.isalpha() for v in values)
        result.append([active, *[float(v) for v in values]])
        index += count
        if active == "M":
            active = "L"
        elif active == "m":
            active = "l"
    assert result[0][0] == "M" and result[-1][0].upper() == "Z"
    return result


def normalize(commands: list[list], width: float, height: float) -> list[list]:
    result = []
    for command, *values in commands:
        kind = command.upper()
        if kind == "H":
            values[0] /= width
        elif kind == "V":
            values[0] /= height
        elif kind == "A":
            # An anisotropic scale preserves this arc representation only for
            # unrotated source ellipses. Fail if a future source changes that.
            assert values[2] == 0, "Rotated arc needs an ellipse transform"
            assert values[3] in (0, 1) and values[4] in (0, 1)
            values[0] /= width
            values[1] /= height
            values[5] /= width
            values[6] /= height
        else:
            values = [v / (width if i % 2 == 0 else height) for i, v in enumerate(values)]
        assert all(math.isfinite(v) for v in values)
        result.append([command, *values])
    return result


def path_string(commands: list[list]) -> str:
    return " ".join(row[0] + " ".join(number(v) for v in row[1:]) for row in commands)


def svg(title: str, viewbox: list[float], body: str, size: str = "") -> str:
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{" ".join(number(v) for v in viewbox)}" {size} role="img" overflow="visible">\n'
            f'<title>{html.escape(title)}</title>\n{body}\n</svg>\n')


def expected_files(source: dict) -> dict[str, str]:
    files, normalized = {}, {"schema_version": 1, "product": "Pulsar X2F CrazyLight", "source_url": source["outline_source"]["url"],
        "manufacturer_url": source["manufacturer_dimensions"]["url"], "verified_date": "2026-11-05",
        "coordinate_system": "Normalized 2D axes: (0,0) is source viewBox origin, (1,1) is its opposite corner. SVG command semantics are retained; relative deltas and arc radii need not be within 0..1.",
        "physical_mapping": "x_mm=x_normalized*nominal_axis_mm[0]; y_mm=y_normalized*nominal_axis_mm[1]. This maps the source viewBox to the official nominal box, not a measured shell.",
        "views": {}}
    for name, view in source["views"].items():
        d = view["d"]
        assert len(d) == view["source_d_characters"]
        assert fnv1a32(d) == view["source_d_fnv1a32"], f"{name}: differs from browser DOM fingerprint"
        _, _, width, height = view["source_viewbox"]
        mm_width, mm_height = view["nominal_axis_mm"]
        commands = parse_path(d)
        normalized_commands = normalize(commands, width, height)
        normalized_d = path_string(normalized_commands)
        reparsed = parse_path(normalized_d)
        for original, written in zip(normalized_commands, reparsed, strict=True):
            assert original[0] == written[0]
            assert all(abs(a-b) < 1e-11 for a, b in zip(original[1:], written[1:], strict=True))
        normalized["views"][name] = {"axes": view["axes"], "source_viewbox": view["source_viewbox"],
            "nominal_axis_mm": view["nominal_axis_mm"], "normalized_d": normalized_d,
            "normalized_commands": normalized_commands, "source_d_sha256": hashlib.sha256(d.encode()).hexdigest(),
            "source_to_mm_affine": [mm_width / width, 0, 0, mm_height / height, 0, 0]}
        files[f"x2f-crazylight-{name}.raw.svg"] = svg(f"X2F CrazyLight {name} — original EloShapes contour coordinates", view["source_viewbox"],
            f'<desc>Unchanged source d; sensor marker omitted. Published reference, not manufacturer CAD.</desc>\n<path d="{d}" fill="none" stroke="currentColor" stroke-width="3" vector-effect="non-scaling-stroke"/>')
        files[f"x2f-crazylight-{name}.mm.svg"] = svg(f"X2F CrazyLight {name} — scaled to official nominal dimensions", [0, 0, mm_width, mm_height],
            f'<desc>Official nominal {mm_width} by {mm_height} mm viewBox. Reference path scaled by independent x/y factors; no tolerance or physical measurement claimed.</desc>\n'
            f'<path d="{d}" transform="scale({number(mm_width / width)} {number(mm_height / height)})" fill="none" stroke="currentColor" stroke-width="0.25" vector-effect="non-scaling-stroke"/>',
            f'width="{mm_width}mm" height="{mm_height}mm"')
    normalized["source_aspect_reconciliation"] = {
        "top_width_at_isotropic_0_1_mm_per_unit": 61.4646,
        "official_width_mm": 61.1,
        "difference_mm": 0.3646,
        "raw_width_excess_over_official_percent": (61.4646 / 61.1 - 1) * 100,
        "top_x_scale_relative_to_y": 611 / 614.646,
        "top_width_reduction_from_raw_percent": (1 - 611 / 614.646) * 100,
        "policy": "Keep raw aspect unchanged in *.raw.svg; fit source viewBox to manufacturer nominal axes in *.mm.svg and normalized JSON physical mapping."
    }
    files["x2f-crazylight.normalized.json"] = json.dumps(normalized, indent=2, ensure_ascii=False) + "\n"
    top, side = source["views"]["top"], source["views"]["side"]
    tw, th = top["source_viewbox"][2:]
    sw, sh = side["source_viewbox"][2:]
    # Both viewports use 5 display px/mm, keeping the same physical scale.
    body = f'''<rect width="1120" height="760" fill="#111111"/>
<g font-family="Segoe UI,Arial,sans-serif" fill="#f5f5f5">
<text x="48" y="61" font-size="30" font-weight="600">Pulsar X2F CrazyLight</text>
<text x="48" y="94" font-size="17" fill="#b9b9b9">published outline / manufacturer nominal scale / editable vector</text>
<text x="48" y="143" font-size="21" fill="#f2d34f">87.5 × 61.1 × 31.6 mm</text>
<text x="77" y="196" font-size="16" fill="#b9b9b9">top · front ↑</text>
<text x="510" y="343" font-size="16" fill="#b9b9b9">side · front ←</text>
<text x="77" y="674" font-size="16">61.1 mm nominal width</text>
<text x="510" y="584" font-size="16">87.5 mm nominal length</text>
<text x="48" y="713" font-size="14" fill="#b9b9b9">source: EloShapes comparison · dimensions: Pulsar · verified 2026-11-05</text>
<text x="48" y="737" font-size="14" fill="#b9b9b9">original top aspect preserved separately; displayed top width is reduced 0.5932% to match nominal specification</text>
</g>
<g fill="none" stroke="#626262" stroke-width="1" stroke-dasharray="4 5">
<rect x="77" y="213" width="305.5" height="437.5"/>
<rect x="510" y="375" width="437.5" height="158"/>
</g>
<g fill="none" stroke="#f5f5f5" stroke-width="2.5" stroke-linejoin="round">
<path d="{top['d']}" transform="translate(77 213) scale({number(305.5/tw)} {number(437.5/th)})" vector-effect="non-scaling-stroke"/>
<path d="{side['d']}" transform="translate(510 375) scale({number(437.5/sw)} {number(158/sh)})" vector-effect="non-scaling-stroke"/>
</g>
<g stroke="#f2d34f" stroke-width="2"><path d="M77 662H382.5M77 656V668M382.5 656V668"/><path d="M510 557H947.5M510 551V563M947.5 551V563"/></g>'''
    files["x2f-crazylight-reference-sheet.svg"] = svg("X2F CrazyLight public reference outline sheet", [0, 0, 1120, 760], body, 'width="1120" height="760"')
    return files


def validate_svg(text: str) -> None:
    root = ET.fromstring(text)
    assert root.tag == "{http://www.w3.org/2000/svg}svg"
    for element in root.iter():
        assert element.tag.split("}")[-1] not in {"image", "script", "foreignObject"}
        assert not any(key.lower().startswith("on") for key in element.attrib)
        assert "href" not in element.attrib and "{http://www.w3.org/1999/xlink}href" not in element.attrib
    assert len(list(root.iter("{http://www.w3.org/2000/svg}path"))) > 0


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Verify deterministic output and source fingerprints without writing")
    args = parser.parse_args()
    source = json.loads((ROOT / "source-capture.json").read_text(encoding="utf-8"))
    files = expected_files(source)
    for filename, text in files.items():
        if filename.endswith(".svg"):
            validate_svg(text)
        target = ROOT / filename
        if args.check:
            assert target.read_text(encoding="utf-8") == text, f"Output drift: {filename}"
        else:
            target.write_text(text, encoding="utf-8", newline="\n")
    print(json.dumps({"status": "verified" if args.check else "generated", "generated_files": sorted(files),
        "source_fingerprints": {name: view["source_d_fnv1a32"] for name, view in source["views"].items()},
        "official_nominal_dimensions_mm": [87.5, 61.1, 31.6], "generator_main_checkout_accessed": False}, indent=2))


if __name__ == "__main__":
    main()
