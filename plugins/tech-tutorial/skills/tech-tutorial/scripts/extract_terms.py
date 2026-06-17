#!/usr/bin/env python3
"""extract_terms.py — enumerate terminology-audit candidates from a tutorial directory.

The mechanical half of the Phase 5 Terminology check (SKILL.md): grep cannot detect
a coined word (it is novel by definition), but it CAN enumerate every place a name
was given — so the standard-or-coined judgment runs over a complete, deterministic
list instead of whatever the auditor's eye happens to catch.

Collects, from every top-level .html file:
  - <strong> / <b> text                      (emphasized concept names)
  - <h1>-<h4> text                           (section titles)
  - <figcaption> text and <svg aria-label>   (figure titles)
  - quoted spans in prose: "..." and "curly quoted" terms

Skips <pre>/<code>/<script>/<style> content. Candidates longer than 40 chars are
dropped (those are sentences, not names). Output is deduplicated by term, keeping
the first location seen.

Usage:  python3 extract_terms.py <tutorial-dir>     # defaults to current dir
Output: one candidate per line:  <term>\t<file>:<where>
Exit:   0 with candidates, 2 if the dir has no .html files.
"""
import glob
import os
import re
import sys
from html.parser import HTMLParser

CAPTURE = {"strong", "b", "h1", "h2", "h3", "h4", "figcaption"}
SKIP = {"pre", "code", "script", "style"}
QUOTE_RE = re.compile(r"\"([^\"]{1,40})\"|“([^”]{1,40})”|'([^']{1,40})'|‘([^’]{1,40})’")
MAX_LEN = 40


class TermParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.skip_depth = 0
        self.frames = []   # open capture frames: [tag, text-parts]
        self.terms = []    # (term, where)
        self.prose = []    # text outside skip tags, scanned for quoted spans

    def handle_starttag(self, tag, attrs):
        if tag in SKIP:
            self.skip_depth += 1
        elif tag in CAPTURE:
            self.frames.append([tag, []])
        if tag == "svg":
            label = dict(attrs).get("aria-label") or ""
            if label.strip():
                self.terms.append((label.strip(), "svg aria-label"))

    def handle_endtag(self, tag):
        if tag in SKIP:
            self.skip_depth = max(0, self.skip_depth - 1)
        elif tag in CAPTURE:
            for i in range(len(self.frames) - 1, -1, -1):
                if self.frames[i][0] == tag:
                    text = " ".join("".join(self.frames[i][1]).split())
                    if text:
                        self.terms.append((text, "<%s>" % tag))
                    del self.frames[i]
                    break

    def handle_data(self, data):
        if self.skip_depth:
            return
        for frame in self.frames:
            frame[1].append(data)
        self.prose.append(data)


def main():
    d = sys.argv[1] if len(sys.argv) > 1 else "."
    files = sorted(glob.glob(os.path.join(d, "*.html")))
    if not files:
        print("extract_terms: no .html files in '%s'" % d, file=sys.stderr)
        sys.exit(2)
    seen = {}  # term -> first location
    for f in files:
        parser = TermParser()
        parser.feed(open(f).read())
        base = os.path.basename(f)
        for term, where in parser.terms:
            term = " ".join(term.split())
            if 0 < len(term) <= MAX_LEN and not term.isdigit():
                seen.setdefault(term, "%s:%s" % (base, where))
        for m in QUOTE_RE.finditer("".join(parser.prose)):
            term = " ".join(next(g for g in m.groups() if g is not None).split())
            if term:
                seen.setdefault(term, "%s:quoted" % base)
    for term, where in seen.items():
        print("%s\t%s" % (term, where))


main()
