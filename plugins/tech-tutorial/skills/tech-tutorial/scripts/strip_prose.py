#!/usr/bin/env python3
"""strip_prose.py — reduce a tutorial .html chapter to prose-only text.

Single home for the HTML-stripping rules used by the three Phase 5 prose greps
in verify_prose.sh (voice, first-person, pedagogy-jargon). All three scan this
script's output, so they always scan the same text — edit the stripping rules
here, never as inline one-liners in SKILL.md.

Drops, using a real HTML parser rather than regexes:
  - <pre> and <code> content (block and inline) — comments and prompt strings
    inside code are program content, not author voice.
  - <details> content, nested or not — answer blocks: expected-value hedges
    ("the expected answer is X") are answers, not commitments-to-the-reader.
  - <script> and <style> content, comments, and all markup — not reader prose.
Keeps all other text, with character references decoded (&rsquo; &#39; &nbsp;)
so an encoded apostrophe or space cannot hide a banned phrase. A bare "<" in
prose ("if n < 10") stays text instead of swallowing the words after it.

Each text run is printed on the line where it starts in the source file, so
`grep -n` hits point at the real line. A run the author wrapped across several
source lines is joined onto its first line (padding lines follow it), so a
phrase split by the wrap ("kind\\nof") is still one line for grep. Tags become
a space, so text in adjacent elements (<h2>Setup</h2><p>We ...) is not glued
into one word that hides "We" from a word-boundary match.

Usage: python3 "${CLAUDE_PLUGIN_ROOT}/skills/tech-tutorial/scripts/strip_prose.py" <file.html>
"""
import sys
from html.parser import HTMLParser

SKIP = {"pre", "code", "details", "script", "style"}


class ProseExtractor(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.open_skips = []  # SKIP elements currently open, innermost last
        self.parts = []
        self.line = 1         # output line the next part starts on

    def handle_starttag(self, tag, attrs):
        if tag in SKIP:
            self.open_skips.append(tag)
        self.separate()

    def handle_startendtag(self, tag, attrs):
        self.separate()  # <br/>, <img/>; <code/> and friends open nothing

    def handle_endtag(self, tag):
        # Closing an element also closes unclosed SKIP children, as a browser
        # does (<pre><code>...</pre>), so one missing </code> cannot hide the
        # rest of the chapter.
        if tag in self.open_skips:
            while self.open_skips.pop() != tag:
                pass
        self.separate()

    def separate(self):
        if self.parts and not self.parts[-1][-1:].isspace():
            self.parts.append(" ")

    def handle_data(self, data):
        if self.open_skips:
            return
        line = self.getpos()[0]
        if line > self.line:
            self.parts.append("\n" * (line - self.line))
            self.line = line
        breaks = data.count("\n")
        self.parts.append(data.replace("\n", " ").replace("\u00a0", " ") + "\n" * breaks)
        self.line += breaks


def strip(text):
    parser = ProseExtractor()
    parser.feed(text)
    parser.close()
    return "".join(parser.parts)


if __name__ == "__main__":
    with open(sys.argv[1], encoding="utf-8") as fh:
        source = fh.read()
    sys.stdout.reconfigure(encoding="utf-8")
    print(strip(source))
