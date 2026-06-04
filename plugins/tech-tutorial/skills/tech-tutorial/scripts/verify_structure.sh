#!/usr/bin/env bash
#
# verify_structure.sh — bundles the STABLE, purely-mechanical Phase 5 structural gates
# for a tech-tutorial output directory into a single run, so the author runs ONE command
# instead of hand-pasting five separate greps (which invites fatigue / skipped checks).
#
# WHAT IT CHECKS (the five static, table-independent gates):
#   1. self-check naming     — exactly one *-self-check.html (the suffix other checks key on)
#   2. audience-fit pair     — index.html has BOTH 适合谁 and 不适合谁 (a standalone 适合谁 beyond
#                              the 不适合谁 ones), plus 读完之后你能做到什么
#   3. figure coverage       — every chapter .html has >=1 <figure> (code-blocks/tables don't count)
#   4. SVG-utility-CSS        — every .html <style> includes .diagram-ink (else node-fill rects
#                              render as solid black when the utility CSS is missing)
#   5. reader-drawing prompt  — >=1 explicit "draw it yourself" prompt across the tutorial
#
# WHAT IT DOES NOT CHECK (kept inline in SKILL.md Phase 5 on purpose):
#   - voice grep + pedagogy-jargon grep — coupled 1:1 to the Forbidden-phrases table; keeping them
#     inline preserves the "edit the table, sync the grep" auditability. Run those separately.
#   - SVG text-overflow / crossings / arrow-piercing — needs a rendered browser (scripts/svg_overflow_check.js
#     + a screenshot pass).
#   - qualitative gates (terminology coinage, mechanism-depth, insight, currency) — judgment, not grep.
#
# USAGE
#   bash verify_structure.sh <tutorial-dir>      # defaults to current dir
#   # when installed as a plugin:
#   bash "${CLAUDE_PLUGIN_ROOT}/skills/tech-tutorial/scripts/verify_structure.sh" path/to/<tech>/
#
# EXIT CODE: 0 if every gate passes, 1 if any gate fails. Prints PASS/FAIL per gate with details.
#
# Locale: forces a UTF-8 collation so the CJK alternations match regardless of the caller's LC_ALL
# (LC_ALL=C would break the Chinese / smart-quote matching).

export LC_ALL="${TECH_TUTORIAL_LC_ALL:-en_US.UTF-8}"

DIR="${1:-.}"
if [ ! -d "$DIR" ]; then
  echo "verify_structure: '$DIR' is not a directory" >&2
  exit 2
fi

fail=0
note() { printf '  %s\n' "$1"; }
pass_line() { printf 'PASS  %s\n' "$1"; }
fail_line() { printf 'FAIL  %s\n' "$1"; fail=1; }

# Collect top-level .html files (the tutorial chapters; not nested, not the parent hub).
html_files=()
while IFS= read -r f; do html_files+=("$f"); done < <(find "$DIR" -maxdepth 1 -name '*.html' | sort)

if [ "${#html_files[@]}" -eq 0 ]; then
  echo "verify_structure: no .html files in '$DIR'" >&2
  exit 2
fi

echo "verify_structure.sh — $DIR  (${#html_files[@]} html files)"
echo "------------------------------------------------------------"

# --- Gate 1: self-check naming -------------------------------------------------
sc=()
while IFS= read -r f; do sc+=("$f"); done < <(find "$DIR" -maxdepth 1 -name '*-self-check.html' | sort)
if [ "${#sc[@]}" -eq 1 ]; then
  pass_line "self-check naming: $(basename "${sc[0]}")"
else
  fail_line "self-check naming: expected exactly one *-self-check.html, found ${#sc[@]}"
  for f in "${sc[@]}"; do note "$(basename "$f")"; done
  [ "${#sc[@]}" -eq 0 ] && note "did a question bank ship as e.g. 0N-discrimination.html? rename to *-self-check.html"
fi

# --- Gate 2: audience-fit pair (index.html) -----------------------------------
idx="$DIR/index.html"
if [ ! -f "$idx" ]; then
  fail_line "audience-fit: index.html not found"
else
  pos=$(grep -o 适合谁 "$idx" | wc -l | tr -d ' ')
  neg=$(grep -o 不适合谁 "$idx" | wc -l | tr -d ' ')
  can=$(grep -c 读完之后你能做到什么 "$idx")
  # pos counts every 适合谁 INCLUDING those inside 不适合谁; a standalone 适合谁 section requires pos > neg.
  if [ "$neg" -ge 1 ] && [ "$pos" -gt "$neg" ] && [ "$can" -ge 1 ]; then
    pass_line "audience-fit pair: 适合谁 + 不适合谁 + 读完之后你能做到什么 all present"
  else
    fail_line "audience-fit pair incomplete in index.html (适合谁=$pos 不适合谁=$neg 读完之后…=$can)"
    [ "$pos" -le "$neg" ] && note "no standalone 适合谁 section (pos must exceed neg)"
    [ "$neg" -lt 1 ] && note "missing 不适合谁 section"
    [ "$can" -lt 1 ] && note "missing 读完之后你能做到什么 section"
  fi
fi

# --- Gate 3: figure coverage (every chapter file has >=1 <figure>) ------------
missing_fig=()
for f in "${html_files[@]}"; do
  n=$(grep -cE '<figure[ >]' "$f")
  [ "$n" -lt 1 ] && missing_fig+=("$(basename "$f")")
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
  grep -q '\.diagram-ink' "$f" || missing_css+=("$(basename "$f")")
done
if [ "${#missing_css[@]}" -eq 0 ]; then
  pass_line "SVG utility CSS: .diagram-ink present in every file"
else
  fail_line "SVG utility CSS: ${#missing_css[@]} file(s) missing .diagram-ink (rects will render solid black)"
  for f in "${missing_css[@]}"; do note "$f — paste the canonical SVG utility block from references/layout-template.html"; done
fi

# --- Gate 5: reader-drawing prompt (>=1 across the tutorial) ------------------
draw=$(grep -lE "自己画|亲手画|手画|画一画|画一张|sketch|Draw the" "${html_files[@]}" 2>/dev/null | head -n1)
if [ -n "$draw" ]; then
  pass_line "reader-drawing prompt: found in $(basename "$draw")"
else
  fail_line "reader-drawing prompt: none found (dual coding stays one-way)"
  note "add a '亲手画一张图' prompt, typically in *-self-check.html (or capstone for hands-on)"
fi

echo "------------------------------------------------------------"
if [ "$fail" -eq 0 ]; then
  echo "ALL STRUCTURAL GATES PASS. (Still run: voice grep, pedagogy-jargon grep, svg_overflow_check.js + screenshot, and the qualitative checks.)"
else
  echo "STRUCTURAL GATES FAILED — fix the FAIL lines above, then re-run."
fi
exit "$fail"
