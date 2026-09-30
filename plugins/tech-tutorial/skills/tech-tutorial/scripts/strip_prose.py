#!/usr/bin/env python3
"""strip_prose.py — reduce a tutorial .html chapter to prose-only text.

Single home for the HTML-stripping rules used by the three Phase 5 prose greps
in verify_prose.sh (voice, first-person, pedagogy-jargon). All three scan this
script's output, so they always scan the same text — edit the stripping rules
here, never as inline one-liners in SKILL.md.

Drops, using a real HTML parser rather than regexes:
  - <pre> and <code> content (block and inline) — comments and prompt strings
    inside code are program content, not author voice.
  - closed <details> content, including anything nested in it — answer blocks:
    expected-value hedges ("the expected answer is X") are answers, not
    commitments-to-the-reader. A <details open> is visible prose and is scanned,
    so wrapping a chapter in one cannot hide it, and so is a collapsed
    <details class="under-the-hood">, which holds mechanism prose, not answers.
  - <script> and <style> content, comments, and all markup — not reader prose.
  - exemptions (SKILL.md "Legitimate exceptions"), each listed by --report so a
    reviewer can audit it: <blockquote> and <q> (quoted material keeps its
    wording), and any element with a non-empty data-prose-exempt="<reason>"
    (domain uncertainty, epistemic notes). An empty reason exempts nothing.
Keeps all other text, with character references decoded (&rsquo; &#39; &nbsp;)
so an encoded apostrophe or space cannot hide a banned phrase. A bare "<" in
prose ("if n < 10") stays text instead of swallowing the words after it.

Standard technical usage that only looks like a hedge or narration is masked
so the scans skip it without an exemption: the noun "kind of"/"sort of" after
a determiner ("one kind of controller") keeps a no-break space before "of",
and the roman numeral in "Type I error" / "Phase I" becomes U+2160.

Each text run is printed on the line where it starts in the source file, so
`grep -n` hits point at the real line. A run the author wrapped across several
source lines is joined onto its first line (padding lines follow it), so a
phrase split by the wrap ("kind\\nof") is still one line for grep. Tags become
a space, so text in adjacent elements (<h2>Setup</h2><p>We ...) is not glued
into one word that hides "We" from a word-boundary match.

Usage: python3 "${CLAUDE_PLUGIN_ROOT}/skills/tech-tutorial/scripts/strip_prose.py" <file.html> [--report <path>]
  --report writes tab-separated metadata for verify_prose.sh:
    lang     <html lang value, empty if unset>
    letters  <ASCII letters> <non-ASCII letters>   (in the kept prose)
    exempt   <source line> <what was exempted>
"""
import re
import sys
from html.parser import HTMLParser

SKIP = {"pre", "code", "script", "style"}  # never prose
QUOTE = {"blockquote", "q"}                 # quoted material: exempt, reported
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link",
        "meta", "source", "track", "wbr"}   # no end tag, so nothing to exempt

DETERMINER = (r"a|an|one|the|this|that|these|those|what|which|each|every|any|"
              r"some|another|same|other|different|new|certain|particular|no|either|neither")
NOUN_KIND_OF = re.compile(rf"\b((?:{DETERMINER}) +(?:kind|sort)) +(of)\b", re.I)
ROMAN_ONE = re.compile(r"\b((?:Type|Phase|Class|Level|Tier|Stage|Grade|Part|Gen) )I\b")


class ProseExtractor(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []       # open tracked elements: (tag, hides its text)
        self.parts = []
        self.line = 1         # output line the next part starts on
        self.lang = ""
        self.exempt = []      # (source line, description)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "html":
            self.lang = (attrs.get("lang") or "").strip()
        reason = (attrs.get("data-prose-exempt") or "").strip()
        if tag in SKIP:
            self.stack.append((tag, True))
        elif tag == "details":
            classes = (attrs.get("class") or "").split()
            self.stack.append((tag, "open" not in attrs and "under-the-hood" not in classes))
        elif tag in QUOTE or (reason and tag not in VOID):
            hidden = self.hidden()
            if not hidden:
                what = tag if tag in QUOTE else "data-prose-exempt (%s)" % reason
                self.exempt.append((self.getpos()[0], what))
            self.stack.append((tag, True))
        self.separate()

    def handle_startendtag(self, tag, attrs):
        self.separate()  # <br/>, <img/>; <code/> and friends open nothing

    def handle_endtag(self, tag):
        # Closing an element also closes unclosed tracked children, as a browser
        # does (<pre><code>...</pre>), so one missing </code> cannot hide the
        # rest of the chapter.
        if any(t == tag for t, _ in self.stack):
            while self.stack.pop()[0] != tag:
                pass
        self.separate()

    def hidden(self):
        return any(h for _, h in self.stack)

    def separate(self):
        if self.parts and not self.parts[-1][-1:].isspace():
            self.parts.append(" ")

    def handle_data(self, data):
        if self.hidden():
            return
        line = self.getpos()[0]
        if line > self.line:
            self.parts.append("\n" * (line - self.line))
            self.line = line
        breaks = data.count("\n")
        self.parts.append(data.replace("\n", " ").replace("\u00a0", " ") + "\n" * breaks)
        self.line += breaks


def mask(text):
    text = NOUN_KIND_OF.sub("\\1\u00a0\\2", text)
    return ROMAN_ONE.sub("\\1\u2160", text)


def extract(text):
    parser = ProseExtractor()
    parser.feed(text)
    parser.close()
    return parser, mask("".join(parser.parts))


def strip(text):
    return extract(text)[1]


if __name__ == "__main__":
    args = sys.argv[1:]
    report = None
    if "--report" in args:
        i = args.index("--report")
        report = args[i + 1]
        del args[i:i + 2]
    with open(args[0], encoding="utf-8") as fh:
        source = fh.read()
    parser, prose = extract(source)
    sys.stdout.reconfigure(encoding="utf-8")
    print(prose)
    if report:
        letters = [c for c in prose if c.isalpha()]
        ascii_letters = sum(1 for c in letters if c.isascii())
        with open(report, "w", encoding="utf-8") as fh:
            fh.write("lang\t%s\n" % parser.lang)
            fh.write("letters\t%d\t%d\n" % (ascii_letters, len(letters) - ascii_letters))
            for line, what in parser.exempt:
                fh.write("exempt\t%d\t%s\n" % (line, what))
