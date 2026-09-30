#!/usr/bin/env python3
"""check_structure.py — the parsed-HTML structural gates behind verify_structure.sh.

These gates read the chapters with a real HTML parser, so a marker inside an
HTML comment, a rule inside a CSS comment, or an empty <figure> no longer
satisfies them the way a grep did. verify_structure.sh runs gate 1 (self-check
naming) and gate 6 (screenshots) itself and calls this script for:

  2. audience-fit sections — index.html has elements marked data-tech-tutorial=
                             audience-for / audience-not-for / outcomes, each with text
  3. figure coverage       — every chapter has >=1 <figure> holding an svg, img,
                             table, pre, or other media (an empty <figure> is not a figure)
  4. SVG utility CSS       — every chapter defines a .diagram-ink rule outside CSS
                             comments, inline or in a linked local stylesheet
  5. reader-drawing prompt — >=1 element marked data-tech-tutorial="reader-drawing"
                             with text, anywhere in the tutorial
  7. retrieval             — every chapter except index.html has self-check questions
                             with hidden answers (a <details> inside .self-check; the
                             final *-self-check.html needs a <details> anywhere), a
                             single-file primer has them in index.html, and the
                             tutorial has >=3 predictions (.predict with a <details> reveal)
  8. integrity             — no leftover {{placeholders}}, every relative link and
                             #anchor resolves, no duplicate ids in a page, <html lang> set

Usage: python3 check_structure.py <tutorial-dir> <single-file 0|1> <chapter.html>...
Prints PASS/FAIL lines in verify_structure.sh's format; exits 1 if any gate fails.
"""
import os
import re
import sys
from html.parser import HTMLParser
from urllib.parse import unquote

VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link",
        "meta", "source", "track", "wbr"}
MEDIA = {"svg", "img", "table", "pre", "picture", "video", "canvas", "object",
         "iframe", "math", "code"}
NOT_PROSE = {"script", "style", "pre", "code"}
SCHEME = re.compile(r"^[a-zA-Z][a-zA-Z0-9+.-]*:|^//")
CSS_COMMENT = re.compile(r"/\*.*?\*/", re.S)
CSS_RULE = re.compile(r"\.diagram-ink\s*[{,]")


class Chapter(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []          # open elements: dict(tag, marker, classes, ...)
        self.lang = ""
        self.markers = {}        # marker -> max text length among its elements
        self.figures = self.empty_figures = 0
        self.details = 0
        self.self_check_answers = 0
        self.predictions = 0
        self.ids = {}            # id -> first line
        self.duplicate_ids = []
        self.links = []          # (line, href)
        self.stylesheets = []
        self.css = []
        self.placeholders = []   # lines

    def inside(self, test):
        return [e for e in self.stack if test(e)]

    def handle_starttag(self, tag, attrs):
        line = self.getpos()[0]
        attrs = dict(attrs)
        if any(v and "{{" in v for v in attrs.values()):
            self.placeholders.append(line)
        if tag == "html":
            self.lang = (attrs.get("lang") or "").strip()
        if attrs.get("id"):
            if attrs["id"] in self.ids:
                self.duplicate_ids.append((line, attrs["id"]))
            else:
                self.ids[attrs["id"]] = line
        if tag == "a" and attrs.get("href") is not None:
            self.links.append((line, attrs["href"]))
        if tag == "link" and "stylesheet" in (attrs.get("rel") or "").lower().split():
            self.stylesheets.append((line, attrs.get("href") or ""))
        if tag in MEDIA:
            for e in self.inside(lambda e: e["tag"] == "figure"):
                e["media"] = True
        if tag == "details":
            self.details += 1
            if self.inside(lambda e: "self-check" in e["classes"]):
                self.self_check_answers += 1
            for e in self.inside(lambda e: "predict" in e["classes"] and not e["marker"]):
                if not e["revealed"]:
                    e["revealed"] = True
                    self.predictions += 1
        if tag in VOID:
            return
        self.stack.append({
            "tag": tag,
            "marker": (attrs.get("data-tech-tutorial") or "").strip(),
            "classes": (attrs.get("class") or "").split(),
            "text": 0, "media": False, "revealed": False,
        })

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        if not any(e["tag"] == tag for e in self.stack):
            return
        while True:
            e = self.stack.pop()
            self.close_element(e)
            if e["tag"] == tag:
                break

    def close_element(self, e):
        if e["marker"]:
            self.markers[e["marker"]] = max(self.markers.get(e["marker"], 0), e["text"])
        if e["tag"] == "figure":
            self.figures += 1
            self.empty_figures += not e["media"]

    def handle_data(self, data):
        tags = {e["tag"] for e in self.stack}
        if "style" in tags:
            self.css.append(data)
            return
        if tags & NOT_PROSE:
            return
        if "{{" in data:
            self.placeholders.append(self.getpos()[0])
        n = len(data.strip())
        for e in self.stack:
            if e["marker"]:
                e["text"] += n

    def finish(self):
        while self.stack:
            self.close_element(self.stack.pop())


def parse(path, cache):
    if path not in cache:
        c = Chapter()
        with open(path, encoding="utf-8") as fh:
            c.feed(fh.read())
        c.close()
        c.finish()
        cache[path] = c
    return cache[path]


class Report:
    failed = False

    def ok(self, msg):
        print("PASS  " + msg)

    def fail(self, msg, notes=()):
        self.failed = True
        print("FAIL  " + msg)
        for n in notes:
            print("  " + n)


def main():
    root, single, files = sys.argv[1], sys.argv[2] == "1", sys.argv[3:]
    cache = {}
    pages = {f: parse(f, cache) for f in files}
    name = os.path.basename
    r = Report()

    # Gate 2
    index = os.path.join(root, "index.html")
    if index not in pages:
        r.fail("audience-fit sections: index.html not found")
    else:
        m = pages[index].markers
        missing = [k for k in ("audience-for", "audience-not-for", "outcomes") if not m.get(k)]
        if missing:
            r.fail("audience-fit sections incomplete in index.html",
                   ["missing or empty: data-tech-tutorial=\"%s\" (a marker in a comment or an English heading alone does not count)" % k
                    for k in missing])
        else:
            r.ok("audience-fit sections: audience-for + audience-not-for + outcomes all present")

    # Gate 3
    bad = [(f, p) for f, p in pages.items() if p.figures - p.empty_figures < 1]
    if bad:
        r.fail("figure coverage: %d file(s) with no non-empty <figure>" % len(bad),
               ["%s — %s" % (name(f), "its <figure> elements are empty (add an svg, img, table, or pre)" if p.figures
                             else "add a figure (every chapter has a figure-worthy shape)") for f, p in bad])
    else:
        r.ok("figure coverage: every chapter has >=1 non-empty <figure>")

    # Gate 4
    missing_css = []
    for f, p in pages.items():
        css = "".join(p.css)
        for _, href in p.stylesheets:
            target = os.path.join(os.path.dirname(f), unquote(href.split("#")[0].split("?")[0]))
            if href and not SCHEME.match(href) and os.path.isfile(target):
                with open(target, encoding="utf-8") as fh:
                    css += fh.read()
        if not CSS_RULE.search(CSS_COMMENT.sub("", css)):
            missing_css.append(name(f))
    if missing_css:
        r.fail("SVG utility CSS: %d file(s) missing .diagram-ink (rects will render solid black)" % len(missing_css),
               ["%s — paste the canonical SVG utility block from references/layout-template.html, or link a shared stylesheet that has it" % f
                for f in missing_css])
    else:
        r.ok("SVG utility CSS: .diagram-ink defined for every file")

    # Gate 5
    drawing = [f for f, p in pages.items() if p.markers.get("reader-drawing")]
    if drawing:
        r.ok("reader-drawing prompt: found in %s" % name(sorted(drawing)[0]))
    else:
        r.fail("reader-drawing prompt: none found (dual coding stays one-way)",
               ["add an element with data-tech-tutorial=\"reader-drawing\" and a prompt, typically in *-self-check.html (or capstone for hands-on)"])

    # Gate 7
    notes = []
    for f, p in pages.items():
        b = name(f)
        if single or b != "index.html":
            if b.lower().endswith("-self-check.html"):
                if not p.details:
                    notes.append("%s — hide the answers in a <details> block" % b)
            elif not p.self_check_answers:
                notes.append("%s — add a .self-check section with questions and a <details> answer block" % b)
    predictions = sum(p.predictions for p in pages.values())
    if predictions < 3:
        notes.append("%d prediction(s) across the tutorial; need >=3 .predict blocks, each with a <details> reveal" % predictions)
    if notes:
        r.fail("retrieval: self-check answers or predictions missing", notes)
    else:
        r.ok("retrieval: every chapter has hidden-answer self-check questions; %d predictions" % predictions)

    # Gate 8
    notes = []
    for f, p in pages.items():
        b = name(f)
        if not p.lang:
            notes.append("%s — set <html lang> to the output language" % b)
        for line in sorted(set(p.placeholders)):
            notes.append("%s:%d — leftover {{placeholder}}" % (b, line))
        for line, i in p.duplicate_ids:
            notes.append("%s:%d — duplicate id \"%s\"" % (b, line, i))
        for line, href in p.links:
            if not href or SCHEME.match(href):
                continue
            path, _, frag = href.partition("#")
            target = os.path.normpath(os.path.join(os.path.dirname(f), unquote(path.split("?")[0]))) if path else f
            if not os.path.exists(target):
                notes.append("%s:%d — link to missing file %s" % (b, line, path))
            elif frag and target.lower().endswith((".html", ".htm")) and unquote(frag) not in parse(target, cache).ids:
                notes.append("%s:%d — link to missing anchor %s" % (b, line, href))
    if notes:
        r.fail("integrity: %d problem(s)" % len(notes), notes)
    else:
        r.ok("integrity: no placeholders, broken links or anchors, duplicate ids, or missing lang")

    sys.exit(1 if r.failed else 0)


if __name__ == "__main__":
    try:
        main()
    except (OSError, UnicodeDecodeError) as exc:
        # Exit 2, not 1: a chapter that cannot be read was never checked, which
        # must not read as an ordinary gate failure (or, worse, as a pass).
        print("check_structure: %s" % exc, file=sys.stderr)
        sys.exit(2)
