#!/usr/bin/env python3
"""Prepare book-like sources for book-to-skill synthesis.

The script normalizes a file or directory into:
- normalized_book.md
- manifest.json
- chunks/chunk-NNN.md

Core formats use only the Python standard library. PDF extraction requires
`pypdf` when a PDF source is supplied.
"""

from __future__ import annotations

import argparse
import html
import json
import re
import sys
import zipfile
from dataclasses import dataclass
from html.parser import HTMLParser
from pathlib import Path
from typing import Iterable
from xml.etree import ElementTree


TEXT_SUFFIXES = {".txt", ".md", ".markdown", ".rst"}
HTML_SUFFIXES = {".html", ".htm", ".xhtml"}
SUPPORTED_SUFFIXES = TEXT_SUFFIXES | HTML_SUFFIXES | {".docx", ".epub", ".pdf"}
WORD_RE = re.compile(r"\b\w+\b", re.UNICODE)


@dataclass(frozen=True)
class ExtractedFile:
    path: str
    suffix: str
    text: str


class _HTMLTextExtractor(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self._skip_depth = 0
        self._parts: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag in {"script", "style", "noscript"}:
            self._skip_depth += 1
            return
        if tag in {"p", "br", "div", "section", "article", "li", "h1", "h2", "h3", "h4"}:
            self._parts.append("\n")

    def handle_endtag(self, tag: str) -> None:
        if tag in {"script", "style", "noscript"} and self._skip_depth:
            self._skip_depth -= 1
            return
        if tag in {"p", "div", "section", "article", "li", "h1", "h2", "h3", "h4"}:
            self._parts.append("\n")

    def handle_data(self, data: str) -> None:
        if not self._skip_depth:
            self._parts.append(data)

    def text(self) -> str:
        return clean_text(" ".join(self._parts))


def clean_text(raw: str) -> str:
    """Normalize whitespace without inventing wording."""
    text = html.unescape(raw).replace("\r\n", "\n").replace("\r", "\n")
    text = re.sub(r"[ \t\f\v]+", " ", text)
    text = re.sub(r" *\n *", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def word_count(text: str) -> int:
    return len(WORD_RE.findall(text))


def strip_html(raw: str) -> str:
    parser = _HTMLTextExtractor()
    parser.feed(raw)
    parser.close()
    return parser.text()


def _read_text_file(path: Path) -> str:
    return clean_text(path.read_text(encoding="utf-8", errors="replace"))


def _read_docx(path: Path) -> str:
    with zipfile.ZipFile(path) as archive:
        try:
            document_xml = archive.read("word/document.xml")
        except KeyError as exc:
            raise ValueError(f"{path} is not a readable DOCX file") from exc

    root = ElementTree.fromstring(document_xml)
    paragraphs: list[str] = []
    for para in root.iter("{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p"):
        runs = [
            node.text or ""
            for node in para.iter("{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t")
        ]
        paragraph = "".join(runs).strip()
        if paragraph:
            paragraphs.append(paragraph)
    return clean_text("\n\n".join(paragraphs))


def _read_epub(path: Path) -> list[ExtractedFile]:
    extracted: list[ExtractedFile] = []
    with zipfile.ZipFile(path) as archive:
        names = sorted(
            name
            for name in archive.namelist()
            if Path(name).suffix.lower() in HTML_SUFFIXES and not name.endswith("/")
        )
        for name in names:
            raw = archive.read(name).decode("utf-8", errors="replace")
            text = strip_html(raw)
            if text:
                extracted.append(ExtractedFile(f"{path.name}::{name}", Path(name).suffix.lower(), text))
    if not extracted:
        raise ValueError(f"{path} has no readable EPUB HTML/XHTML content")
    return extracted


def _read_pdf(path: Path) -> str:
    try:
        from pypdf import PdfReader  # type: ignore
    except ImportError as exc:
        raise RuntimeError("PDF extraction requires installing pypdf in the active Python environment") from exc

    reader = PdfReader(str(path))
    pages = [page.extract_text() or "" for page in reader.pages]
    return clean_text("\n\n".join(pages))


def _extract_file(path: Path, label: str | None = None) -> list[ExtractedFile]:
    suffix = path.suffix.lower()
    source_label = label or path.name
    if suffix not in SUPPORTED_SUFFIXES:
        return []
    if suffix in TEXT_SUFFIXES:
        text = _read_text_file(path)
    elif suffix in HTML_SUFFIXES:
        text = strip_html(path.read_text(encoding="utf-8", errors="replace"))
    elif suffix == ".docx":
        text = _read_docx(path)
    elif suffix == ".epub":
        return _read_epub(path)
    elif suffix == ".pdf":
        text = _read_pdf(path)
    else:
        return []
    if not text:
        return []
    return [ExtractedFile(source_label, suffix, text)]


def _is_within(path: Path, directory: Path) -> bool:
    """True if path is the directory itself or nested under it."""
    try:
        path.resolve().relative_to(directory)
        return True
    except ValueError:
        return False


def extract_sources(source: Path, exclude: Path | None = None) -> list[ExtractedFile]:
    source = source.expanduser().resolve()
    if not source.exists():
        raise FileNotFoundError(source)

    if source.is_file():
        return _extract_file(source)

    # When the output directory lives inside the source tree, skip it so a
    # previous run's normalized_book.md/chunks are not re-ingested (which would
    # compound the corpus on every re-run).
    exclude_dir = exclude.expanduser().resolve() if exclude is not None else None
    extracted: list[ExtractedFile] = []
    for path in sorted(item for item in source.rglob("*") if item.is_file()):
        if exclude_dir is not None and _is_within(path, exclude_dir):
            continue
        label = str(path.relative_to(source))
        extracted.extend(_extract_file(path, label))
    if not extracted:
        supported = ", ".join(sorted(SUPPORTED_SUFFIXES))
        raise ValueError(f"No supported source files found under {source}. Supported suffixes: {supported}")
    return extracted


def _chunk_words(text: str, chunk_words: int) -> list[str]:
    if chunk_words < 1:
        raise ValueError("chunk_words must be at least 1")
    words = text.split()
    if not words:
        return []
    return [" ".join(words[index : index + chunk_words]) for index in range(0, len(words), chunk_words)]


def _write_chunks(out_dir: Path, normalized_text: str, chunk_words: int) -> list[dict[str, int | str]]:
    chunks_dir = out_dir / "chunks"
    chunks_dir.mkdir(parents=True, exist_ok=True)
    chunks: list[dict[str, int | str]] = []
    for index, chunk_text in enumerate(_chunk_words(normalized_text, chunk_words), start=1):
        rel_path = Path("chunks") / f"chunk-{index:03d}.md"
        full_path = out_dir / rel_path
        full_path.write_text(f"# Chunk {index:03d}\n\n{chunk_text}\n", encoding="utf-8")
        chunks.append(
            {
                "path": rel_path.as_posix(),
                "word_count": word_count(chunk_text),
                "characters": len(chunk_text),
            }
        )
    return chunks


def prepare_book_source(source: str | Path, out_dir: str | Path, chunk_words: int = 1200) -> dict:
    """Normalize and chunk a book-like source."""
    source_path = Path(source)
    output = Path(out_dir)
    output.mkdir(parents=True, exist_ok=True)

    files = extract_sources(source_path, exclude=output)
    normalized_parts: list[str] = []
    file_manifest: list[dict[str, int | str]] = []
    for extracted in files:
        normalized_parts.append(f"# {extracted.path}\n\n{extracted.text}")
        file_manifest.append(
            {
                "path": extracted.path,
                "suffix": extracted.suffix,
                "word_count": word_count(extracted.text),
                "characters": len(extracted.text),
            }
        )

    normalized_text = clean_text("\n\n".join(normalized_parts)) + "\n"
    (output / "normalized_book.md").write_text(normalized_text, encoding="utf-8")
    chunks = _write_chunks(output, normalized_text, chunk_words)
    manifest = {
        "source": str(source_path.expanduser().resolve()),
        "total_files": len(file_manifest),
        "total_words": sum(int(item["word_count"]) for item in file_manifest),
        "files": file_manifest,
        "chunks": chunks,
    }
    (output / "manifest.json").write_text(json.dumps(manifest, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    return manifest


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Normalize and chunk a book-like source for skill synthesis.")
    parser.add_argument("source", help="Book source file or directory")
    parser.add_argument("--out", required=True, help="Output directory")
    parser.add_argument("--chunk-words", type=int, default=1200, help="Target words per chunk")
    parser.add_argument("--json", action="store_true", help="Print the manifest JSON")
    args = parser.parse_args(argv)

    try:
        manifest = prepare_book_source(args.source, args.out, args.chunk_words)
    except Exception as exc:  # pragma: no cover - exercised through CLI use
        print(f"[ERROR] {exc}", file=sys.stderr)
        return 1

    if args.json:
        print(json.dumps(manifest, indent=2, sort_keys=True))
    else:
        print(
            f"Prepared {manifest['total_files']} file(s), "
            f"{manifest['total_words']} word(s), {len(manifest['chunks'])} chunk(s)."
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
