#!/usr/bin/env python3
"""Validate a skill generated from a book source."""

from __future__ import annotations

import argparse
import json
import re
from dataclasses import dataclass, field
from pathlib import Path


FRONTMATTER_RE = re.compile(r"^---\n(.*?)\n---\n?", re.DOTALL)
NAME_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
PLACEHOLDER_RE = re.compile(r"\b(TODO|TBD|FIXME)\b|\[TODO[:\]]", re.IGNORECASE)
KEY_LINE_RE = re.compile(r"^(?P<key>[A-Za-z0-9_-]+):(?P<rest>.*)$")


@dataclass
class ValidationResult:
    ok: bool
    errors: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)


def _parse_simple_frontmatter(text: str) -> tuple[dict[str, str], str, list[str]]:
    errors: list[str] = []
    match = FRONTMATTER_RE.match(text)
    if not match:
        return {}, text, ["SKILL.md must start with YAML frontmatter"]

    frontmatter: dict[str, str] = {}
    lines = match.group(1).splitlines()
    i, n = 0, len(lines)
    while i < n:
        raw_line = lines[i]
        if not raw_line.strip():
            i += 1
            continue
        # A top-level key starts in column 0. Indented lines here are stray
        # (their owning key already consumed its continuation below).
        if raw_line[:1].isspace():
            errors.append(f"Invalid frontmatter line: {raw_line}")
            i += 1
            continue
        key_match = KEY_LINE_RE.match(raw_line)
        if not key_match:
            errors.append(f"Invalid frontmatter line: {raw_line}")
            i += 1
            continue

        key = key_match.group("key").strip()
        rest = key_match.group("rest").strip()
        block_scalar = rest[:1] in ("|", ">")
        # Folded ('>') and literal ('|') block scalars carry no inline value;
        # plain scalars may still wrap onto indented continuation lines.
        parts = [] if block_scalar else ([rest] if rest else [])

        i += 1
        while i < n:
            nxt = lines[i]
            if not nxt.strip():
                # Blank lines continue a block scalar but terminate a plain one.
                if block_scalar:
                    i += 1
                    continue
                break
            if not nxt[:1].isspace():
                break
            parts.append(nxt.strip())
            i += 1

        # Fold to a single line so substring/regex checks (e.g. "Use when")
        # work across a wrapped value.
        value = " ".join(p for p in parts if p).strip()
        if not block_scalar:
            value = value.strip('"').strip("'")
        frontmatter[key] = value
    return frontmatter, text[match.end() :], errors


def _validate_evals(evals_path: Path, errors: list[str]) -> None:
    if not evals_path.exists():
        errors.append("evals/evals.json is required")
        return
    try:
        data = json.loads(evals_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        errors.append(f"evals/evals.json must be valid JSON: {exc}")
        return

    evals = data.get("evals")
    if not isinstance(evals, list) or not evals:
        errors.append("evals/evals.json must contain a non-empty evals list")
        return

    for index, item in enumerate(evals, start=1):
        if not isinstance(item, dict):
            errors.append(f"eval {index} must be an object")
            continue
        for key in ("name", "prompt", "expected_output", "assertions"):
            if key not in item:
                errors.append(f"eval {index} is missing {key}")
        assertions = item.get("assertions")
        if not isinstance(assertions, list) or not assertions:
            errors.append(f"eval {index} must include non-empty assertions")


def validate_book_skill(skill_dir: str | Path) -> ValidationResult:
    """Validate that a book-derived skill is operational, not just a summary."""
    # Resolve so a relative path like "." still yields the real folder name for
    # the frontmatter-name comparison below.
    path = Path(skill_dir).resolve()
    errors: list[str] = []
    warnings: list[str] = []

    skill_md = path / "SKILL.md"
    if not skill_md.exists():
        return ValidationResult(False, ["SKILL.md is required"], warnings)

    text = skill_md.read_text(encoding="utf-8")
    frontmatter, body, frontmatter_errors = _parse_simple_frontmatter(text)
    errors.extend(frontmatter_errors)

    name = frontmatter.get("name", "")
    description = frontmatter.get("description", "")
    if not name:
        errors.append("frontmatter name is required")
    elif not NAME_RE.match(name):
        errors.append("frontmatter name must be lowercase hyphen-case")
    elif path.name != name:
        errors.append("skill folder name must match frontmatter name")

    if not description:
        errors.append("frontmatter description is required")
    else:
        if len(description) > 1024:
            errors.append("frontmatter description must be 1024 characters or fewer")
        if "Use when" not in description:
            warnings.append("description should include concrete 'Use when' trigger language")
        if not re.search(r"book|source|manual|framework|method", description, re.IGNORECASE):
            warnings.append("description should mention the source-derived workflow domain")

    if PLACEHOLDER_RE.search(text):
        errors.append("skill files must not contain TODO/TBD/FIXME placeholders")

    if len(text.splitlines()) > 500:
        warnings.append("SKILL.md is over 500 lines; move details into references/")

    if not re.search(r"^##\s+.*Workflow", body, re.MULTILINE | re.IGNORECASE):
        errors.append("SKILL.md must include a workflow section")

    if not re.search(r"Quality Checklist|Verification|Validate", body, re.IGNORECASE):
        errors.append("SKILL.md must include verification or quality checks")

    if re.search(r"\b(summary|summarize)\b", description, re.IGNORECASE) and not re.search(
        r"\bworkflow|procedure|method|operate|apply\b", text, re.IGNORECASE
    ):
        errors.append("book-derived skills must teach repeatable action, not only summarize")

    source_map = path / "references" / "source-map.md"
    if not source_map.exists():
        errors.append("references/source-map.md is required")
    elif PLACEHOLDER_RE.search(source_map.read_text(encoding="utf-8")):
        errors.append("references/source-map.md must not contain placeholders")

    _validate_evals(path / "evals" / "evals.json", errors)

    return ValidationResult(not errors, errors, warnings)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Validate a book-derived skill artifact.")
    parser.add_argument("skill_dir", help="Path to the generated skill directory")
    parser.add_argument("--json", action="store_true", help="Print machine-readable validation output")
    args = parser.parse_args(argv)

    result = validate_book_skill(args.skill_dir)
    if args.json:
        print(json.dumps({"ok": result.ok, "errors": result.errors, "warnings": result.warnings}, indent=2))
    else:
        if result.errors:
            print("Errors:")
            for error in result.errors:
                print(f"- {error}")
        if result.warnings:
            print("Warnings:")
            for warning in result.warnings:
                print(f"- {warning}")
        if result.ok:
            print("Book-derived skill is valid.")
    return 0 if result.ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
