"""Check this resource bundle's file integrity; no network or main-worktree writes.

Run: python verify_bundle.py
This checks packaging, syntax and vector-only assets, not empirical claim validity.
"""
from __future__ import annotations

import ast
import hashlib
import json
import math
import re
import sys
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent
GENERATED = {"RESOURCE-MANIFEST.json", "bundle-validation.json"}


def unique_object(pairs):
    result = {}
    for key, value in pairs:
        if key in result:
            raise ValueError(f"duplicate JSON key: {key}")
        result[key] = value
    return result


def finite_json(value):
    if isinstance(value, float) and not math.isfinite(value):
        raise ValueError("non-finite JSON number")
    if isinstance(value, dict):
        for child in value.values():
            finite_json(child)
    if isinstance(value, list):
        for child in value:
            finite_json(child)


def check_file(path):
    suffix = path.suffix.lower()
    if suffix == ".json":
        finite_json(json.loads(path.read_text(encoding="utf-8-sig"), object_pairs_hook=unique_object))
    elif suffix == ".py":
        ast.parse(path.read_text(encoding="utf-8-sig"), filename=str(path))
    elif suffix == ".svg":
        tree = ET.fromstring(path.read_text(encoding="utf-8-sig"))
        for item in tree.iter():
            name = item.tag.rsplit("}", 1)[-1]
            if name in {"image", "script", "foreignObject"}:
                raise ValueError(f"non-vector/active SVG element: {name}")
            for key, value in item.attrib.items():
                if key.lower().startswith("on"):
                    raise ValueError("SVG event handler")
                if key.rsplit("}", 1)[-1] == "href" and not value.startswith("#"):
                    raise ValueError("external SVG dependency")
    elif suffix in {".png", ".jpg", ".jpeg", ".webp", ".gif", ".mp4"}:
        raise ValueError("raster/media artifact in code-native resource bundle")
    elif suffix == ".md":
        for target in re.findall(r"\]\(([^\n]+?)\)", path.read_text(encoding="utf-8-sig")):
            target = target.strip("<>").split("#", 1)[0]
            if not target or re.match(r"[a-z]+://", target, re.I):
                continue
            # Markdown may cite read-only source files as well as bundle assets.
            target = re.sub(r":\d+$", "", target)
            resolved = Path(target)
            if not resolved.is_absolute():
                resolved = path.parent / resolved
            if resolved.parent == ROOT and resolved.name in GENERATED:
                continue  # This invocation writes these two reports below.
            if not resolved.exists():
                raise ValueError(f"missing local Markdown target: {target}")


def main():
    files = sorted(p for p in ROOT.rglob("*") if p.is_file()
                   and p.name not in GENERATED and "__pycache__" not in p.parts)
    errors = []
    manifest = []
    for path in files:
        relative = path.relative_to(ROOT).as_posix()
        try:
            check_file(path)
        except Exception as exc:
            errors.append({"file": relative, "error": str(exc)})
        manifest.append({"path": relative, "absolute_path": str(path),
                         "bytes": path.stat().st_size,
                         "sha256": hashlib.sha256(path.read_bytes()).hexdigest()})
    required = ["RESOURCE-HANDOFF.md", "wheel/wheel-test-group.json",
                "wheel/wheel-evidence.md", "geometry-evidence.md",
                "mechanics-energy/mechanics-energy.json", "mechanics-energy/claims-review.md"]
    for relative in required:
        if not (ROOT / relative).is_file():
            errors.append({"file": relative, "error": "required deliverable missing"})
    if not list((ROOT / "reference-geometry").glob("*.svg")):
        errors.append({"file": "reference-geometry/", "error": "no editable vector asset"})
    stamp = datetime.now(timezone.utc).isoformat()
    report = {"verified_utc": stamp, "status": "passed" if not errors else "failed",
              "files_checked": len(files), "errors": errors,
              "scope": "File existence, JSON parse/finite values, Python syntax, SVG vector-only dependencies and local Markdown targets. Does not establish physical fidelity, source truth, final-deck rendering or prototype results."}
    (ROOT / "RESOURCE-MANIFEST.json").write_text(json.dumps({"generated_utc": stamp,
        "excludes": sorted(GENERATED), "files": manifest}, indent=2) + "\n", encoding="utf-8")
    (ROOT / "bundle-validation.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, indent=2))
    return int(bool(errors))


if __name__ == "__main__":
    sys.exit(main())
