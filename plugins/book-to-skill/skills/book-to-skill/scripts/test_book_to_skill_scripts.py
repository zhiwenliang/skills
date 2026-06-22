#!/usr/bin/env python3
"""Regression tests for book-to-skill helper scripts."""

from __future__ import annotations

import json
import shutil
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPT_DIR))

from prepare_book_source import prepare_book_source
from validate_book_skill import validate_book_skill


class PrepareBookSourceTests(unittest.TestCase):
    def setUp(self) -> None:
        self.tmp = Path(tempfile.mkdtemp(prefix="book-to-skill-test-"))

    def tearDown(self) -> None:
        shutil.rmtree(self.tmp)

    def test_chunks_directory_sources_in_stable_order(self) -> None:
        source = self.tmp / "book"
        source.mkdir()
        (source / "02-method.md").write_text("beta gamma delta epsilon zeta eta theta", encoding="utf-8")
        (source / "01-foundation.txt").write_text("alpha concept principle practice", encoding="utf-8")
        (source / "notes.bin").write_bytes(b"\x00ignored")

        manifest = prepare_book_source(source, self.tmp / "prepared", chunk_words=5)

        self.assertEqual(
            [Path(item["path"]).name for item in manifest["files"]],
            ["01-foundation.txt", "02-method.md"],
        )
        self.assertEqual(manifest["total_words"], 11)
        self.assertGreaterEqual(len(manifest["chunks"]), 3)
        for chunk in manifest["chunks"]:
            self.assertTrue((self.tmp / "prepared" / chunk["path"]).exists())

        written_manifest = json.loads((self.tmp / "prepared" / "manifest.json").read_text())
        self.assertEqual(written_manifest["total_words"], 11)
        normalized = (self.tmp / "prepared" / "normalized_book.md").read_text(encoding="utf-8")
        self.assertIn("# 01-foundation.txt", normalized)
        self.assertIn("# 02-method.md", normalized)

    def test_strips_html_noise(self) -> None:
        source = self.tmp / "chapter.html"
        source.write_text(
            """
            <html>
              <head><script>window.bad = true</script><style>.x{}</style></head>
              <body><h1>Deliberate Practice</h1><p>Use feedback loops.</p></body>
            </html>
            """,
            encoding="utf-8",
        )

        prepare_book_source(source, self.tmp / "prepared", chunk_words=100)

        normalized = (self.tmp / "prepared" / "normalized_book.md").read_text(encoding="utf-8")
        self.assertIn("Deliberate Practice", normalized)
        self.assertIn("Use feedback loops.", normalized)
        self.assertNotIn("window.bad", normalized)
        self.assertNotIn(".x{}", normalized)


class ValidateBookSkillTests(unittest.TestCase):
    def setUp(self) -> None:
        self.tmp = Path(tempfile.mkdtemp(prefix="book-skill-validate-"))

    def tearDown(self) -> None:
        shutil.rmtree(self.tmp)

    def write_skill(self, body: str, *, include_refs: bool = True, include_evals: bool = True) -> Path:
        skill = self.tmp / "generated-skill"
        skill.mkdir()
        (skill / "SKILL.md").write_text(body, encoding="utf-8")
        if include_refs:
            refs = skill / "references"
            refs.mkdir()
            (refs / "source-map.md").write_text(
                "# Source Map\n\n- Chapter 1 -> Workflow step 1\n",
                encoding="utf-8",
            )
        if include_evals:
            evals = skill / "evals"
            evals.mkdir()
            (evals / "evals.json").write_text(
                json.dumps(
                    {
                        "skill_name": "generated-skill",
                        "evals": [
                            {
                                "id": 1,
                                "name": "apply-workflow",
                                "prompt": "Use this skill on a realistic task.",
                                "expected_output": "Applies the workflow and verifies the result.",
                                "assertions": ["uses_workflow", "runs_verification"],
                            }
                        ],
                    }
                ),
                encoding="utf-8",
            )
        return skill

    def test_accepts_wellformed_generated_skill(self) -> None:
        skill = self.write_skill(
            """---
name: generated-skill
description: Use when applying a book-derived operating method to real work, converting source principles into a repeatable workflow with verification.
---

# Generated Skill

## Workflow

1. Gather the user context.
2. Select the relevant source-backed method.
3. Apply the method to the current task.

## Quality Checklist

- [ ] Source-backed method selected.
- [ ] Verification command or review step completed.
"""
        )

        result = validate_book_skill(skill)

        self.assertTrue(result.ok, result.errors)

    def test_accepts_block_scalar_description(self) -> None:
        skill = self.write_skill(
            """---
name: generated-skill
description: >
  Use when applying a book-derived operating method to real work,
  converting source principles into a repeatable workflow with
  verification.
---

# Generated Skill

## Workflow

1. Gather the user context.
2. Apply the source-backed method to the current task.

## Quality Checklist

- [ ] Verification command or review step completed.
"""
        )

        result = validate_book_skill(skill)

        self.assertTrue(result.ok, result.errors)
        # Wrapped continuation lines must not be flagged as invalid frontmatter.
        self.assertFalse(
            any("Invalid frontmatter line" in e for e in result.errors), result.errors
        )
        # The folded description contains "Use when" and a domain term, so it
        # must not produce the trigger-language / domain warnings.
        self.assertEqual(result.warnings, [], result.warnings)

    def test_rejects_summary_only_skill(self) -> None:
        skill = self.write_skill(
            """---
name: generated-skill
description: Summary of a book.
---

# Generated Skill

This is a summary of the book's main ideas.
""",
            include_refs=False,
            include_evals=False,
        )

        result = validate_book_skill(skill)

        self.assertFalse(result.ok)
        self.assertIn("SKILL.md must include a workflow section", result.errors)
        self.assertIn("references/source-map.md is required", result.errors)
        self.assertIn("evals/evals.json is required", result.errors)


if __name__ == "__main__":
    unittest.main(verbosity=2)
