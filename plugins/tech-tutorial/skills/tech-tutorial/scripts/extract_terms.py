#!/usr/bin/env python3
"""extract_terms.py — enumerate terminology-audit candidates from a tutorial directory.

The mechanical half of the Phase 5 Terminology check (SKILL.md): grep cannot detect
a coined word (it is novel by definition), but it CAN enumerate every place a name
was given — so the standard-or-coined judgment runs over a complete, deterministic
list instead of whatever the auditor's eye happens to catch.

Collects, from every top-level .html file:
  - <strong> / <b> / <dfn> text              (emphasized or defined concept names)
  - <h1>-<h4> text                           (section titles)
  - <figcaption> text and <svg aria-label>   (figure titles)
  - SVG <text> labels                        (names given inside diagrams)
  - quoted spans in prose: "...", '...', their curly forms, and 「...」 『...』 《...》

Skips <pre>/<code>/<script>/<style> content and the layout template's numbering
spans (<span class="num"> / <span class="fig-num">), so "1.1" is not glued onto a
section title. Candidates longer than 40 chars are dropped (those are sentences,
not names), as are pure numbers. Output is deduplicated by term, keeping the first
location seen.

Usage:  python3 "${CLAUDE_PLUGIN_ROOT}/skills/tech-tutorial/scripts/extract_terms.py" <tutorial-dir>
        (<tutorial-dir> defaults to the current dir)
Output: one candidate per line:  <term>\t<file>:<where>
Exit:   0 with candidates, 2 if the dir has no .html files.
"""
import glob
import os
import re
import sys
from html.parser import HTMLParser

CAPTURE = {"strong", "b", "dfn", "h1", "h2", "h3", "h4", "figcaption", "text"}
SKIP = {"pre", "code", "script", "style"}
NUMBERING = {"num", "fig-num"}  # layout-template classes for "1.1", "§", "Fig. 1.1"
# Straight quotes double as apostrophes (don't, users') and inch marks (3.5"), and
# the closing curly single quote is also the curly apostrophe (leader’s). So those
# marks open a span only when no ASCII letter or digit precedes them and close it
# only when none follows; an apostrophe inside a word may sit inside the span.
# Without this, one stray mark pairs with the next real quote, emits the text in
# between as a bogus candidate, and shifts every later pair so real terms vanish.
# The guards are ASCII-only so CJK text right before or after a quote still counts.
_ALNUM = "A-Za-z0-9"
QUOTE_RE = re.compile(
    rf"(?<![{_ALNUM}])\"([^\"]{{1,40}})\"(?![{_ALNUM}])"
    rf"|(?<![{_ALNUM}])'((?:[^']|'(?=[{_ALNUM}])){{1,40}})'(?![{_ALNUM}])"
    rf"|‘((?:[^’]|’(?=[{_ALNUM}])){{1,40}})’(?![{_ALNUM}])"
    r"|“([^”]{1,40})”|「([^」]{1,40})」|『([^』]{1,40})』|《([^》]{1,40})》"
)
MAX_LEN = 40


class TermParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.skip_depth = 0
        self.spans = []    # open <span>s: True when it is a numbering span
        self.frames = []   # open capture frames: [tag, text-parts]
        self.terms = []    # (term, where)
        self.prose = []    # text outside skip tags, scanned for quoted spans

    def handle_starttag(self, tag, attrs):
        if tag in SKIP:
            self.skip_depth += 1
        elif tag == "span":
            classes = (dict(attrs).get("class") or "").split()
            self.spans.append(bool(NUMBERING.intersection(classes)))
        elif tag in CAPTURE:
            self.frames.append([tag, []])
        if tag == "svg":
            label = dict(attrs).get("aria-label") or ""
            if label.strip():
                self.terms.append((label.strip(), "svg aria-label"))

    def handle_endtag(self, tag):
        if tag in SKIP:
            self.skip_depth = max(0, self.skip_depth - 1)
        elif tag == "span":
            if self.spans:
                self.spans.pop()
        elif tag in CAPTURE:
            for i in range(len(self.frames) - 1, -1, -1):
                if self.frames[i][0] == tag:
                    text = " ".join("".join(self.frames[i][1]).split())
                    if text:
                        self.terms.append((text, "<%s>" % tag))
                    del self.frames[i]
                    break

    def handle_data(self, data):
        if self.skip_depth or any(self.spans):
            return
        for frame in self.frames:
            frame[1].append(data)
        self.prose.append(data)


def is_candidate(term):
    return 0 < len(term) <= MAX_LEN and not term.isdigit()


def main():
    d = sys.argv[1] if len(sys.argv) > 1 else "."
    files = sorted(glob.glob(os.path.join(glob.escape(d), "*.html")))
    if not files:
        print("extract_terms: no .html files in '%s'" % d, file=sys.stderr)
        sys.exit(2)
    sys.stdout.reconfigure(encoding="utf-8")
    seen = {}  # term -> first location
    for f in files:
        parser = TermParser()
        with open(f, encoding="utf-8") as fh:
            parser.feed(fh.read())
        parser.close()
        base = os.path.basename(f)
        for term, where in parser.terms:
            term = " ".join(term.split())
            if is_candidate(term):
                seen.setdefault(term, "%s:%s" % (base, where))
        # Tags separate text runs, so join runs with a newline: gluing them would
        # hide the non-word character a straight quote needs before it to open.
        for m in QUOTE_RE.finditer("\n".join(parser.prose)):
            term = " ".join(next(g for g in m.groups() if g is not None).split())
            if is_candidate(term):
                seen.setdefault(term, "%s:quoted" % base)
    for term, where in seen.items():
        print("%s\t%s" % (term, where))


if __name__ == "__main__":
    main()
