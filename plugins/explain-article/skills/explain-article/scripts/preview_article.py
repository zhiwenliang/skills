#!/usr/bin/env python3
"""Render an explain-article Markdown draft to a self-contained HTML preview
with live Mermaid diagrams, and open it in the default browser.

The article stays Markdown; this only produces a throwaway HTML view so the
author can see the rendered diagrams. The Markdown is embedded as base64 so
CJK text and code fences survive without escaping issues. marked.js and
mermaid.js load from CDN, so an internet connection is needed for full
rendering; offline, the prose still shows as plain text.

Examples:
    python3 scripts/preview_article.py article.md            # build + open
    python3 scripts/preview_article.py article.md --no-open   # build only (headless/CI)
    python3 scripts/preview_article.py article.md --out /tmp/preview.html
"""

from __future__ import annotations

import argparse
import base64
import re
import sys
import webbrowser
from pathlib import Path


TEMPLATE = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>__TITLE__</title>
<style>
  :root { color-scheme: light; }
  body { max-width: 820px; margin: 0 auto; padding: 32px 20px 80px;
         font: 17px/1.7 -apple-system, "PingFang SC", "Helvetica Neue", Arial, sans-serif;
         color: #1a1a1a; }
  h1 { font-size: 2em; border-bottom: 2px solid #eee; padding-bottom: .3em; }
  h2 { margin-top: 2em; color: #0b5; border-left: 4px solid #0b5; padding-left: .5em; }
  code { background: #f4f4f4; padding: 2px 5px; border-radius: 4px; font-size: .9em; }
  pre.mermaid { background: #fafafa; border: 1px solid #eee; border-radius: 8px;
                padding: 16px; text-align: center; }
  blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 1em; color: #555; }
  a { color: #06c; }
  .meta { color: #888; font-size: .85em; margin-bottom: 2em; }
  ol li, ul li { margin: .3em 0; }
</style>
</head>
<body>
<div class="meta">explain-article preview &middot; source: __SRC__</div>
<div id="content">Rendering&hellip;</div>
<!-- Pinned, immutable CDN versions with Subresource Integrity. To bump a version,
     refetch the file and recompute: openssl dgst -sha384 -binary FILE | openssl base64 -A -->
<script src="https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js"
        integrity="sha384-/TQbtLCAerC3jgaim+N78RZSDYV7ryeoBCVqTuzRrFec2akfBkHS7ACQ3PQhvMVi"
        crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.min.js"
        integrity="sha384-rbtjAdnIQE/aQJGEgXrVUlMibdfTSa4PQju4HDhN3sR2PmaKFzhEafuePsl9H/9I"
        crossorigin="anonymous"></script>
<script>
(function () {
  const B64 = "__B64__";
  const raw = new TextDecoder("utf-8").decode(Uint8Array.from(atob(B64), c => c.charCodeAt(0)));
  const blocks = [];
  const stripped = raw.replace(/```mermaid\\s*\\n([\\s\\S]*?)```/g, function (m, code) {
    blocks.push(code);
    return "\\n@@MERMAID" + (blocks.length - 1) + "@@\\n";
  });
  let html = window.marked
    ? marked.parse(stripped)
    : stripped.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\\n/g, "<br>");
  html = html.replace(/@@MERMAID(\\d+)@@/g, function (m, i) {
    return '<pre class="mermaid">' + blocks[+i].replace(/</g, "&lt;") + "</pre>";
  });
  document.getElementById("content").innerHTML = html;
  if (window.mermaid) {
    mermaid.initialize({ startOnLoad: false });
    mermaid.run({ querySelector: "pre.mermaid" }).catch(function (e) { console.error(e); });
  }
})();
</script>
</body>
</html>
"""


def build_html(md: str, src_name: str) -> str:
    b64 = base64.b64encode(md.encode("utf-8")).decode("ascii")
    first_line = next((ln for ln in md.splitlines() if ln.strip()), "explain-article preview")
    title = first_line.lstrip("# ").strip() or "explain-article preview"
    # Single left-to-right pass so a token that appears inside an earlier
    # substitution (e.g. a title literally containing "__B64__") is inserted
    # verbatim and never re-scanned as another placeholder.
    replacements = {"__TITLE__": title, "__SRC__": src_name, "__B64__": b64}
    return re.sub(r"__TITLE__|__SRC__|__B64__", lambda m: replacements[m.group(0)], TEMPLATE)


def main() -> int:
    parser = argparse.ArgumentParser(description="Render an explain-article draft to an HTML preview.")
    parser.add_argument("article", type=Path)
    parser.add_argument("--out", type=Path, help="HTML output path (default: <article>.html).")
    parser.add_argument("--no-open", action="store_true", help="Build the HTML without opening a browser.")
    args = parser.parse_args()

    if not args.article.exists():
        print(f"ERROR: file not found: {args.article}", file=sys.stderr)
        return 2

    md = args.article.read_text(encoding="utf-8")
    out_path = args.out or args.article.with_suffix(".html")
    out_path.write_text(build_html(md, args.article.name), encoding="utf-8")
    print(f"wrote {out_path}")

    if not args.no_open:
        webbrowser.open(out_path.resolve().as_uri())
        print(f"opened {out_path} in the default browser")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
