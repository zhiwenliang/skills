#!/usr/bin/env bash
#
# verify_structure.sh — bundles the STABLE, purely-mechanical Phase 5 structural gates
# for a tech-tutorial output directory into a single run, so the author runs ONE command
# instead of hand-pasting five separate greps (which invites fatigue / skipped checks).
#
# WHAT IT CHECKS (the five static, table-independent gates):
#   1. self-check naming     — exactly one *-self-check.html, and it is the LAST chapter
#                              (skipped in single-file primer mode, see MODES below)
#   2. audience-fit sections — index.html has semantic markers or English headings
#                              for audience-for, audience-not-for, and outcomes
#   3. figure coverage       — every chapter .html has >=1 <figure> (code-blocks/tables don't count)
#   4. SVG-utility-CSS        — every .html <style> includes .diagram-ink (else node-fill rects
#                              render as solid black when the utility CSS is missing)
#   5. reader-drawing prompt  — >=1 explicit "draw it yourself" prompt across the tutorial
#
# OPTIONAL GATE (runs only when a screenshot dir is passed as the 2nd argument):
#   6. screenshot coverage   — for every chapter, the screenshot dir holds >= as many
#                              files named <chapter>-fig*.png/.jpg/.jpeg as the chapter has
#                              <figure> elements, AND each is NEWER than the chapter .html
#                              (a screenshot taken before the last edit proves nothing).
#                              This mechanizes "screenshot every figure, no exceptions" —
#                              a real 2026-06 incident shipped a label collision in the one
#                              figure whose screenshot was skipped. Capture each figure as
#                              <chapter>-figN.png (e.g. 01-memory-fig2.png) into the dir,
#                              then run this script with the dir to prove coverage.
#
# MODES
#   multi-file (default)     — all five gates run.
#   single-file quick primer — auto-detected (the dir holds exactly one .html and it is
#                              index.html). Gate 1 is skipped: the self-check lives as an
#                              inline section, which naming can't verify — check it by eye.
#   Markdown fallback        — no .html files: the gates don't apply; exit 2 with a note.
#                              Hand-check the same five rules against the .md output.
#
# WHAT IT DOES NOT CHECK (kept inline in SKILL.md Phase 5 on purpose):
#   - prose checks — run scripts/verify_prose.sh for forbidden English voice phrases,
#     first-person author narration, and pedagogy-jargon leaks.
#   - SVG text defects (overflow / label collision — scripts/svg_overflow_check.js) and
#     crossings / arrow-piercing / stop-policy (screenshot pass) — need a rendered browser.
#   - qualitative gates (terminology coinage, mechanism-depth, insight, currency) — judgment, not grep
#     (scripts/extract_terms.py enumerates the terminology-audit candidates; judging them stays qualitative).
#
# USAGE
#   bash verify_structure.sh <tutorial-dir>                    # defaults to current dir
#   bash verify_structure.sh <tutorial-dir> <screenshot-dir>   # also enforce gate 6
#   # when installed as a plugin:
#   bash "${CLAUDE_PLUGIN_ROOT}/skills/tech-tutorial/scripts/verify_structure.sh" path/to/<tech>/
#
# EXIT CODE: 0 if every gate passes, 1 if any gate fails, 2 on usage errors
# (not a directory / no .html files). Prints PASS/FAIL per gate with details.
#
# Locale: smart-quote alternations need a UTF-8 locale (LC_ALL=C breaks
# codepoint-level matching). Resolution order:
#   1. TECH_TUTORIAL_LC_ALL, if set — explicit override for systems without en_US.UTF-8
#   2. the caller's own locale, when it is already UTF-8
#   3. the first installed UTF-8 locale among en_US.UTF-8 / C.UTF-8 (via locale -a)

if [ -n "${TECH_TUTORIAL_LC_ALL:-}" ]; then
  export LC_ALL="$TECH_TUTORIAL_LC_ALL"
else
  cur="${LC_ALL:-${LC_CTYPE:-${LANG:-}}}"
  case "$cur" in
    *.[Uu][Tt][Ff]-8|*.[Uu][Tt][Ff]8) export LC_ALL="$cur" ;;
    *)
      utf8_loc=$(locale -a 2>/dev/null | grep -iE '^(en_US|C)\.utf-?8$' | head -n1)
      export LC_ALL="${utf8_loc:-en_US.UTF-8}"
      ;;
  esac
fi

DIR="${1:-.}"
if [ ! -d "$DIR" ]; then
  echo "verify_structure: '$DIR' is not a directory" >&2
  exit 2
fi
SHOT_DIR="${2:-}"
if [ -n "$SHOT_DIR" ] && [ ! -d "$SHOT_DIR" ]; then
  echo "verify_structure: screenshot dir '$SHOT_DIR' is not a directory" >&2
  exit 2
fi

fail=0
note() { printf '  %s\n' "$1"; }
pass_line() { printf 'PASS  %s\n' "$1"; }
skip_line() { printf 'SKIP  %s\n' "$1"; }
fail_line() { printf 'FAIL  %s\n' "$1"; fail=1; }

# Collect top-level .html files (the tutorial chapters; not nested, not the parent hub).
html_files=()
while IFS= read -r f; do html_files+=("$f"); done < <(find "$DIR" -maxdepth 1 -name '*.html' | sort)

if [ "${#html_files[@]}" -eq 0 ]; then
  echo "verify_structure: no .html files in '$DIR' — these gates apply to HTML output only." >&2
  echo "If this is a Markdown-fallback tutorial, hand-check the same five rules instead (SKILL.md Phase 5)." >&2
  exit 2
fi

single_file=0
if [ "${#html_files[@]}" -eq 1 ] && [ "${html_files[0]##*/}" = "index.html" ]; then
  single_file=1
fi

echo "verify_structure.sh — $DIR  (${#html_files[@]} html files$([ "$single_file" -eq 1 ] && echo ', single-file primer mode'))"
echo "------------------------------------------------------------"

# --- Gate 1: self-check naming + position --------------------------------------
if [ "$single_file" -eq 1 ]; then
  skip_line "self-check naming: single-file primer — self-check is an inline section; verify it by eye"
else
  sc=()
  while IFS= read -r f; do sc+=("$f"); done < <(find "$DIR" -maxdepth 1 -name '*-self-check.html' | sort)
  if [ "${#sc[@]}" -eq 1 ]; then
    # html_files is sorted, so the last NN- prefixed entry is the last chapter.
    last_chapter=""
    for f in "${html_files[@]}"; do
      b="${f##*/}"
      case "$b" in [0-9]*) last_chapter="$b" ;; esac
    done
    sc_base="${sc[0]##*/}"
    if [ -n "$last_chapter" ] && [ "$last_chapter" != "$sc_base" ]; then
      fail_line "self-check position: $sc_base is not the last chapter ($last_chapter is)"
      note "retrieval/discrimination must come last — renumber so *-self-check.html has the highest prefix"
    else
      pass_line "self-check naming + position: $sc_base is the last chapter"
    fi
  else
    fail_line "self-check naming: expected exactly one *-self-check.html, found ${#sc[@]}"
    for f in "${sc[@]}"; do note "${f##*/}"; done
    [ "${#sc[@]}" -eq 0 ] && note "did a question bank ship as e.g. 0N-discrimination.html? rename to *-self-check.html"
  fi
fi

# --- Gate 2: audience-fit sections (index.html) -------------------------------
idx="$DIR/index.html"
if [ ! -f "$idx" ]; then
  fail_line "audience-fit sections: index.html not found"
else
  for_count=$(grep -iEo "data-tech-tutorial=[\"']audience-for[\"']|Who this is for" "$idx" | wc -l | tr -d ' ')
  not_count=$(grep -iEo "data-tech-tutorial=[\"']audience-not-for[\"']|Who this is not for" "$idx" | wc -l | tr -d ' ')
  can_count=$(grep -iEo "data-tech-tutorial=[\"']outcomes[\"']|What you can do after reading" "$idx" | wc -l | tr -d ' ')
  if [ "$for_count" -ge 1 ] && [ "$not_count" -ge 1 ] && [ "$can_count" -ge 1 ]; then
    pass_line "audience-fit sections: audience-for + audience-not-for + outcomes all present"
  else
    fail_line "audience-fit sections incomplete in index.html (for=$for_count not_for=$not_count outcomes=$can_count)"
    [ "$for_count" -lt 1 ] && note "missing audience-for section (English heading or data-tech-tutorial marker)"
    [ "$not_count" -lt 1 ] && note "missing audience-not-for section (English heading or data-tech-tutorial marker)"
    [ "$can_count" -lt 1 ] && note "missing outcomes section (English heading or data-tech-tutorial marker)"
  fi
fi

# --- Gate 3: figure coverage (every chapter file has >=1 <figure>) ------------
missing_fig=()
for f in "${html_files[@]}"; do
  n=$(grep -cE '<figure[ >]' "$f")
  [ "$n" -lt 1 ] && missing_fig+=("${f##*/}")
done
if [ "${#missing_fig[@]}" -eq 0 ]; then
  pass_line "figure coverage: every chapter has >=1 <figure>"
else
  fail_line "figure coverage: ${#missing_fig[@]} file(s) with no <figure>"
  for f in "${missing_fig[@]}"; do note "$f — add a figure (every chapter has a figure-worthy shape)"; done
fi

# --- Gate 4: SVG-utility-CSS presence (.diagram-ink in every file) ------------
missing_css=()
for f in "${html_files[@]}"; do
  grep -q '\.diagram-ink' "$f" || missing_css+=("${f##*/}")
done
if [ "${#missing_css[@]}" -eq 0 ]; then
  pass_line "SVG utility CSS: .diagram-ink present in every file"
else
  fail_line "SVG utility CSS: ${#missing_css[@]} file(s) missing .diagram-ink (rects will render solid black)"
  for f in "${missing_css[@]}"; do note "$f — paste the canonical SVG utility block from references/layout-template.html"; done
fi

# --- Gate 5: reader-drawing prompt (>=1 across the tutorial) ------------------
draw=$(grep -liE "data-tech-tutorial=[\"']reader-drawing[\"']|draw it yourself|draw from memory|sketch from memory|sketch .*from memory|close the .*sketch|draw the" "${html_files[@]}" 2>/dev/null | head -n1)
if [ -n "$draw" ]; then
  pass_line "reader-drawing prompt: found in ${draw##*/}"
else
  fail_line "reader-drawing prompt: none found (dual coding stays one-way)"
  note "add a 'Draw it yourself' prompt or data-tech-tutorial=\"reader-drawing\", typically in *-self-check.html (or capstone for hands-on)"
fi

# --- Gate 6 (optional): screenshot coverage per figure ------------------------
if [ -n "$SHOT_DIR" ]; then
  shot_bad=()
  for f in "${html_files[@]}"; do
    b="${f##*/}"; base="${b%.html}"
    n=$(grep -cE '<figure[ >]' "$f")
    [ "$n" -lt 1 ] && continue  # gate 3 already reports figure-less chapters
    fresh=$(find "$SHOT_DIR" -maxdepth 1 \( -name "${base}-fig*.png" -o -name "${base}-fig*.jpg" -o -name "${base}-fig*.jpeg" \) -newer "$f" | wc -l | tr -d ' ')
    total=$(find "$SHOT_DIR" -maxdepth 1 \( -name "${base}-fig*.png" -o -name "${base}-fig*.jpg" -o -name "${base}-fig*.jpeg" \) | wc -l | tr -d ' ')
    if [ "$fresh" -lt "$n" ]; then
      shot_bad+=("$b — figures=$n, fresh screenshots=$fresh (total=$total$([ "$total" -gt "$fresh" ] && echo ', some STALER than the html'))")
    fi
  done
  if [ "${#shot_bad[@]}" -eq 0 ]; then
    pass_line "screenshot coverage: every figure has a fresh screenshot in $SHOT_DIR"
  else
    fail_line "screenshot coverage: ${#shot_bad[@]} chapter(s) under-screenshotted"
    for s in "${shot_bad[@]}"; do note "$s"; done
    note "capture each figure as <chapter>-figN.png into $SHOT_DIR AFTER the last html edit, then re-run"
  fi
fi

echo "------------------------------------------------------------"
if [ "$fail" -eq 0 ]; then
  if [ -n "$SHOT_DIR" ]; then
    echo "ALL STRUCTURAL GATES PASS (incl. screenshot coverage). (Still run: verify_prose.sh, svg_overflow_check.js, the screenshot INSPECTION, and the qualitative checks.)"
  else
    echo "ALL STRUCTURAL GATES PASS. (Still run: verify_prose.sh, svg_overflow_check.js + screenshot, and the qualitative checks. Tip: pass a screenshot dir as arg 2 to enforce per-figure screenshot coverage.)"
  fi
else
  echo "STRUCTURAL GATES FAILED — fix the FAIL lines above, then re-run."
fi
exit "$fail"
