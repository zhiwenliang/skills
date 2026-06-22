#!/usr/bin/env python3
"""Structural evaluator for explain-article Markdown drafts."""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path


REQUIRED_MARKERS = [
    "audience",
    "core-claim",
    "map",
    "mechanism",
    "depth-probes",
    "example",
    "boundary",
    "check",
    "sources",
]

MERMAID_TYPES = (
    "flowchart",
    "graph",
    "sequenceDiagram",
    "stateDiagram",
    "stateDiagram-v2",
    "mindmap",
    "timeline",
    "quadrantChart",
    "classDiagram",
    "erDiagram",
)

DEPTH_PROBE_CATEGORIES = {
    "mechanism_chain": re.compile(r"机制|因果|causal|what changes|changes what|sequence|链", re.IGNORECASE),
    "constraint_tradeoff": re.compile(r"约束|权衡|代价|成本|限制|constraint|tradeoff|cost", re.IGNORECASE),
    "counterfactual": re.compile(r"反事实|如果没有|假如没有|without|what would break|would fail", re.IGNORECASE),
    "model_comparison": re.compile(r"模型对比|对比|相比|versus|ordinary|centralized|centralised|普通", re.IGNORECASE),
    "evidence_detail": re.compile(
        r"证据|来源|研究|文档|报告|资料显示|数据显示|根据|RFC|NIST|OpenStax|source|evidence|according|observed",
        re.IGNORECASE,
    ),
}

MIN_SUBSTANTIVE_PROBE_UNITS = 24

TRANSFER_QUESTION_PATTERN = re.compile(
    r"为什么|为何|如果|假如|怎样|如何|区别|对比|什么情况下|会发生什么|预测|边界|失效|失败|"
    r"\bwhy\b|\bhow\b|what if|\bif\b|compare|difference|where .*fail|when .*fail|predict|boundary",
    re.IGNORECASE,
)


def extract_mermaid_blocks(text: str) -> list[str]:
    pattern = re.compile(r"```mermaid\s*\n(.*?)```", re.DOTALL | re.IGNORECASE)
    return [match.group(1).strip() for match in pattern.finditer(text)]


def count_words_or_cjk_chars(text: str) -> int:
    code_fences_removed = re.sub(r"```.*?```", "", text, flags=re.DOTALL)
    words = re.findall(r"[A-Za-z0-9]+(?:[-'][A-Za-z0-9]+)?", code_fences_removed)
    cjk_chars = re.findall(r"[\u4e00-\u9fff]", code_fences_removed)
    return len(words) + len(cjk_chars)


def marker_present(text: str, marker: str) -> bool:
    return f"<!-- explain-article:{marker} -->" in text


def section_after_marker(text: str, marker: str) -> str:
    needle = f"<!-- explain-article:{marker} -->"
    start = text.find(needle)
    if start == -1:
        return ""
    rest = text[start + len(needle) :]
    next_marker = re.search(r"<!--\s*explain-article:[a-z-]+\s*-->", rest)
    if next_marker:
        return rest[: next_marker.start()]
    return rest


def depth_probe_hits(text: str) -> list[str]:
    section = section_after_marker(text, "depth-probes")
    return [name for name, pattern in DEPTH_PROBE_CATEGORIES.items() if pattern.search(section)]


def substantive_depth_probe_count(text: str) -> int:
    # A probe is "substantive" if the bullet carries real content (length).
    # Depth-dimension coverage is enforced separately by depth_probe_hits, so a
    # genuinely substantive probe is not dropped just because it avoids the
    # category keywords.
    section = section_after_marker(text, "depth-probes")
    lines = re.findall(r"^\s*(?:[-*]|\d+[\.)、])\s+(.+)$", section, flags=re.MULTILINE)
    return sum(1 for line in lines if count_words_or_cjk_chars(line) >= MIN_SUBSTANTIVE_PROBE_UNITS)


def has_source_link(text: str) -> bool:
    return source_link_count(text) > 0


def source_link_count(text: str) -> int:
    source_idx = text.find("<!-- explain-article:sources -->")
    if source_idx == -1:
        return 0
    source_section = text[source_idx:]
    markdown_links = re.findall(r"\[[^\]]+\]\(https?://[^)]+\)", source_section)
    plain_urls = re.findall(r"(?<!\()https?://\S+", source_section)
    return len(markdown_links) + len(plain_urls)


def has_unverified_note(text: str) -> bool:
    source_idx = text.find("<!-- explain-article:sources -->")
    if source_idx == -1:
        return False
    source_section = text[source_idx:]
    has_unverified_note = re.search(
        r"not verified|未验证|未进行来源验证|quick draft|快速草稿",
        source_section,
        re.IGNORECASE,
    )
    return bool(has_unverified_note)


def marker_word_position(text: str, marker: str) -> int | None:
    needle = f"<!-- explain-article:{marker} -->"
    idx = text.find(needle)
    if idx == -1:
        return None
    return count_words_or_cjk_chars(text[:idx])


def has_understanding_questions(text: str) -> bool:
    check_idx = text.find("<!-- explain-article:check -->")
    if check_idx == -1:
        return False
    check_section = text[check_idx:]
    numbered = re.findall(r"^\s*\d+[\.)、]", check_section, flags=re.MULTILINE)
    bullets_with_question = re.findall(r"^\s*[-*]\s+.*[?？]", check_section, flags=re.MULTILINE)
    question_marks = re.findall(r"[?？]", check_section)
    return len(numbered) + len(bullets_with_question) >= 3 or len(question_marks) >= 3


def transfer_question_count(text: str) -> int:
    check_section = section_after_marker(text, "check")
    lines = re.findall(r"^\s*(?:[-*]|\d+[\.)、])\s+(.+)$", check_section, flags=re.MULTILINE)
    if not lines:
        lines = [line.strip() for line in check_section.splitlines() if "?" in line or "？" in line]
    # Split each line into individual question segments so several questions
    # written on one line are each counted, not collapsed into one.
    segments: list[str] = []
    for line in lines:
        parts = re.split(r"(?<=[?？])\s*", line)
        segments.extend(part for part in parts if part.strip())
    return sum(1 for segment in segments if TRANSFER_QUESTION_PATTERN.search(segment))


def evaluate(
    path: Path,
    short: bool = False,
    allow_unverified_note: bool = False,
) -> tuple[list[str], list[str]]:
    text = path.read_text(encoding="utf-8")
    failures: list[str] = []
    warnings: list[str] = []

    # Short answers (<~500 words) may omit the depth-probes section, matching
    # the "normal-length articles" scope in references/explanation-principles.md.
    required_markers = [m for m in REQUIRED_MARKERS if not (short and m == "depth-probes")]
    for marker in required_markers:
        if not marker_present(text, marker):
            failures.append(f"missing marker: explain-article:{marker}")

    if not short and marker_present(text, "depth-probes"):
        depth_hits = depth_probe_hits(text)
        if len(depth_hits) < 3:
            failures.append(
                "depth-probes section needs at least 3 depth signals "
                "(mechanism chain, constraint/tradeoff, counterfactual, model comparison, evidence detail)"
            )
        if "evidence_detail" not in depth_hits:
            failures.append("depth-probes section needs one source-backed evidence/detail probe")
        if substantive_depth_probe_count(text) < 3:
            failures.append(
                "depth-probes section needs at least 3 substantive bullet probes "
                f"({MIN_SUBSTANTIVE_PROBE_UNITS}+ word/CJK units each)"
            )

    mermaid_blocks = extract_mermaid_blocks(text)
    min_diagrams = 1 if short else 2
    if len(mermaid_blocks) < min_diagrams:
        failures.append(f"expected at least {min_diagrams} Mermaid diagram(s), found {len(mermaid_blocks)}")

    for i, block in enumerate(mermaid_blocks, start=1):
        first_line = block.splitlines()[0].strip() if block.splitlines() else ""
        if not first_line.startswith(MERMAID_TYPES):
            warnings.append(f"Mermaid block {i} starts with '{first_line}', not a recognized diagram declaration")
        forbidden_style = re.search(r"%%\{init|theme\s*:|look\s*:|config\s*:|handDrawn", block, re.IGNORECASE)
        if forbidden_style:
            failures.append(f"Mermaid block {i} uses custom styling; default Mermaid style is required")

    word_units = count_words_or_cjk_chars(text)
    if word_units < 500 and not short:
        warnings.append(f"article is short for a full explanation: {word_units} word/CJK units")

    if not has_understanding_questions(text):
        failures.append("understanding-check section needs at least 3 questions or prompts")
    elif transfer_question_count(text) < 2:
        failures.append("understanding-check section needs at least 2 transfer questions")

    sources = source_link_count(text)
    min_sources = 1 if short else 2
    if sources == 0:
        if allow_unverified_note and has_unverified_note(text):
            warnings.append("sources section uses an explicit unverified/quick-draft note")
        else:
            failures.append("sources section needs at least one source link")
    elif sources < min_sources:
        failures.append(f"sources section needs at least {min_sources} source links")

    core_position = marker_word_position(text, "core-claim")
    if core_position is not None and core_position > 180:
        warnings.append(f"core claim appears late: marker starts after {core_position} word/CJK units")

    banned = re.findall(r"\b(obviously|trivially|simply|just)\b", text, re.IGNORECASE)
    if banned:
        warnings.append("possible load-shaming or oversimplifying words: " + ", ".join(sorted(set(banned))))

    return failures, warnings


def main() -> int:
    parser = argparse.ArgumentParser(description="Evaluate an explain-article Markdown draft.")
    parser.add_argument("article", type=Path)
    parser.add_argument("--short", action="store_true", help="Allow a short answer with one Mermaid diagram.")
    parser.add_argument(
        "--allow-unverified-note",
        action="store_true",
        help="Allow a source section that explicitly says verification was not performed.",
    )
    args = parser.parse_args()

    if not args.article.exists():
        print(f"ERROR: file not found: {args.article}", file=sys.stderr)
        return 2

    failures, warnings = evaluate(
        args.article,
        short=args.short,
        allow_unverified_note=args.allow_unverified_note,
    )

    for warning in warnings:
        print(f"WARN: {warning}")
    for failure in failures:
        print(f"FAIL: {failure}")

    if failures:
        print(f"Result: FAIL ({len(failures)} failure(s), {len(warnings)} warning(s))")
        return 1

    print(f"Result: PASS (0 failure(s), {len(warnings)} warning(s))")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
