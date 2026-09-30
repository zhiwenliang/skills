#!/usr/bin/env bash
#
# verify_structure.sh — bundles the STABLE, purely-mechanical Phase 5 structural gates
# for a tech-tutorial output directory into a single run, so the author runs ONE command
# instead of hand-pasting five separate greps (which invites fatigue / skipped checks).
#
# WHAT IT CHECKS:
#   1. self-check naming     — exactly one *-self-check.html (any case), and it is the LAST
#                              chapter by numeric prefix (skipped in single-file primer mode)
#   2. audience-fit sections — index.html has elements marked data-tech-tutorial=audience-for,
#                              audience-not-for, and outcomes, each with text
#   3. figure coverage       — every chapter .html has >=1 non-empty <figure> (svg, img, table, pre)
#   4. SVG-utility-CSS        — every .html defines a .diagram-ink rule, inline or in a linked
#                              stylesheet (else node-fill rects render as solid black)
#   5. reader-drawing prompt  — >=1 element marked data-tech-tutorial="reader-drawing"
#   7. retrieval             — every chapter has self-check questions with <details> answers,
#                              and the tutorial has >=3 predictions with <details> reveals
#   8. integrity             — no {{placeholders}}, broken relative links or #anchors,
#                              duplicate ids, or missing <html lang>
#   Gates 2-5, 7 and 8 parse the HTML (check_structure.py, next to this script), so a
#   marker in a comment, a CSS rule in a CSS comment, or an empty <figure> does not count.
#
# OPTIONAL GATE (runs only when a screenshot dir is passed as the 2nd argument):
#   6. screenshot coverage   — for every chapter with n <figure> elements, the screenshot dir
#                              holds <chapter>-fig1..figN (.png/.jpg/.jpeg), each NEWER than
#                              the chapter .html
#                              (a screenshot taken before the last edit proves nothing).
#                              This mechanizes "screenshot every figure, no exceptions" —
#                              a real 2026-06 incident shipped a label collision in the one
#                              figure whose screenshot was skipped. Capture each figure as
#                              <chapter>-figN.png (e.g. 01-memory-fig2.png) into the dir,
#                              then run this script with the dir to prove coverage.
#
# MODES
#   multi-file (default)     — every gate runs.
#   single-file quick primer — auto-detected (the dir holds exactly one .html and it is
#                              index.html). Gate 1 is skipped: the self-check lives as an
#                              inline section, which gate 7 checks in index.html instead.
#   Markdown fallback        — no .html files: the gates don't apply; exit 2 with a note.
#                              Hand-check gates 2, 3, 5 and 7 against the .md output.
#
# WHAT IT DOES NOT CHECK (separate SKILL.md Phase 5 steps):
#   - prose checks — run verify_prose.sh (next to this script) for forbidden English voice phrases,
#     first-person author narration, and pedagogy-jargon leaks.
#   - SVG text defects (overflow / label collision — svg_overflow_check.js, next to this script) and
#     crossings / arrow-piercing / stop-policy (screenshot pass) — need a rendered browser.
#   - qualitative gates (terminology coinage, mechanism-depth, insight, currency) — judgment, not grep
#     (extract_terms.py, next to this script, enumerates the terminology-audit candidates; judging them stays qualitative).
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
# Locale: every pattern in this file is ASCII, so the checks run with byte semantics
# (LC_ALL=C, present on every system) and never depend on an installed locale.

export LC_ALL=C

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
# Dotfiles such as macOS "._index.html" sidecars are not chapters.
html_files=()
while IFS= read -r f; do html_files+=("$f"); done < <(find "$DIR" -maxdepth 1 -type f -name '*.html' ! -name '.*' | sort)

if [ "${#html_files[@]}" -eq 0 ]; then
  echo "verify_structure: no .html files in '$DIR' — these gates apply to HTML output only." >&2
  echo "If this is a Markdown-fallback tutorial, hand-check gates 2, 3, 5 and 7 (listed at the top of this script) instead." >&2
  exit 2
fi

for f in $(find "$DIR" -maxdepth 1 -type f -iname '*.htm' ! -name '.*' | sort); do
  echo "NOTE  ${f##*/} is ignored: chapters must use the .html extension"
done

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
  while IFS= read -r f; do sc+=("$f"); done < <(find "$DIR" -maxdepth 1 -type f -iname '*-self-check.html' ! -name '.*' | sort)
  if [ "${#sc[@]}" -eq 1 ]; then
    # The last chapter has the highest numeric prefix (9-x comes before 10-self-check).
    last_chapter="" last_num=-1
    for f in "${html_files[@]}"; do
      b="${f##*/}"; num="${b%%[!0-9]*}"
      if [ -n "$num" ] && [ $((10#$num)) -gt "$last_num" ]; then last_num=$((10#$num)); last_chapter="$b"; fi
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

# --- Gates 2-5, 7, 8: parsed HTML (check_structure.py) -------------------------
rc=0
python3 "$(dirname "${BASH_SOURCE[0]}")/check_structure.py" "$DIR" "$single_file" "${html_files[@]}" || rc=$?
case "$rc" in
  0) ;;
  1) fail=1 ;;
  *) fail_line "parsed gates: check_structure.py could not run (exit $rc); gates 2-5, 7 and 8 were NOT checked" ;;
esac

# Gate 6 counts every <figure> tag, empty or not: each one needs a screenshot.
count_figures() { grep -aoE '<figure([[:space:]>]|$)' "$1" | wc -l | tr -d ' '; }

# --- Gate 6 (optional): screenshot coverage per figure ------------------------
# Distinct figure numbers 1..n among <chapter>-figN.{png,jpg,jpeg} in the screenshot
# dir; extra find args (e.g. -newer FILE) narrow the set. Numbers, not files:
# fig1.png plus fig1.jpg (or a retake) is still one figure and must not stand in
# for an uncaptured fig2, and fig7 is no screenshot of a chapter's fig1.
shot_figures() {
  local base="$1" n="$2"; shift 2
  find "$SHOT_DIR" -maxdepth 1 \( -name "${base}-fig*.png" -o -name "${base}-fig*.jpg" -o -name "${base}-fig*.jpeg" \) "$@" |
    while IFS= read -r p; do p="${p##*/}"; p="${p#"$base-fig"}"; printf '%s\n' "${p%%[!0-9]*}"; done |
    grep '^[0-9]' | awk -v n="$n" '$1 + 0 >= 1 && $1 + 0 <= n { print $1 + 0 }' | sort -u | wc -l | tr -d ' '
}
if [ -n "$SHOT_DIR" ]; then
  shot_bad=()
  for f in "${html_files[@]}"; do
    b="${f##*/}"; base="${b%.html}"
    n=$(count_figures "$f")
    [ "$n" -lt 1 ] && continue  # gate 3 already reports figure-less chapters
    fresh=$(shot_figures "$base" "$n" -newer "$f")
    total=$(shot_figures "$base" "$n")
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
