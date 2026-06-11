#!/usr/bin/env python3
"""strip_prose.py — reduce a tutorial .html chapter to prose-only text.

Single home for the HTML-stripping rules used by the three Phase 5 prose greps
in SKILL.md (voice, first-person, pedagogy-jargon). All three pipe a chapter
through this script so they always scan the same text — edit the stripping
rules here, never as inline one-liners in SKILL.md.

Strips, in order:
  1. <pre...><code...>...</code></pre> — code blocks: comments and prompt strings
     inside code are program content, not author voice.
  2. <details ...>...</details>        — answer blocks: expected-value hedges
     ("正确答案应该是 X") are answers, not commitments-to-the-reader.
  3. every remaining tag               — markup is structure, not voice.

Usage: python3 strip_prose.py <file.html>
"""
import re
import sys

t = open(sys.argv[1]).read()
t = re.sub(r'<pre[^>]*><code[^>]*>.*?</code></pre>', '', t, flags=re.S)
t = re.sub(r'<details[^>]*>.*?</details>', '', t, flags=re.S | re.I)
t = re.sub(r'<[^>]+>', '', t)
print(t)
