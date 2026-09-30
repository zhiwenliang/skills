#!/usr/bin/env bash
set -euo pipefail

DIR="${1:-.}"
if [ ! -d "$DIR" ]; then
  echo "verify_prose: '$DIR' is not a directory" >&2
  exit 2
fi

# Byte semantics, which every system has. The patterns below are ASCII plus
# explicit UTF-8 byte alternations for the curly apostrophes ('|’|‘), so they
# match without any installed UTF-8 locale; a ['’‘] bracket would silently stop
# matching curly apostrophes whenever the named UTF-8 locale was missing.
export LC_ALL=C

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
STRIP="$SCRIPT_DIR/strip_prose.py"

# Top-level chapter files; dotfiles such as macOS "._index.html" sidecars are not chapters.
html_files=()
while IFS= read -r f; do html_files+=("$f"); done < <(find "$DIR" -maxdepth 1 -type f -name '*.html' ! -name '.*' | sort)
if [ "${#html_files[@]}" -eq 0 ]; then
  echo "verify_prose: no .html files in '$DIR'" >&2
  exit 2
fi

# (^|[^[:alpha:]]) / ([^[:alpha:]]|$) are word boundaries: without them `let's`
# also matches "servlet's", `kind of` matches "unkind of", and `just` matches
# "adjust". `just` is not followed by "-", so "just-in-time" (JIT) passes.
# `roughly` is a hedge only when no number follows ("roughly 150-300 ms" states a
# range). `together` is cheerleading only after an exploring verb ("explore this
# together"), not in "group related writes together". The noun "one kind of X"
# arrives masked by strip_prose.py, so it does not match `kind of`.
apos="('|’|‘)"
together="(^|[^[:alpha:]])(explore|learn|build|walk|dive|look|work|go|step|discover)(s|ed|ing)?( +[[:alpha:]]+){0,3} +together([^[:alpha:]]|$)"
voice_pattern="(^|[^[:alpha:]])let${apos}s|we${apos}ll|you${apos}ll discover|now we (are|${apos}re) going to|next we will look at|(^|[^[:alpha:]])(maybe|probably)|(^|[^[:alpha:]])(kind|sort) of|(^|[^[:alpha:]])roughly( *$| +[^0-9 ]|[^[:alpha:] ])|obviously|trivially|(^|[^[:alpha:]])just([^[:alpha:]-]|$)|in today${apos}s fast-paced|deep dive journey|unlock the power of|${together}"
# Scanned case-sensitively: the pronoun is a capital I (not the "i" of "i.e." or
# a loop index, nor the roman numeral of "Type I", which strip_prose.py masks),
# and I/O is not narration; lowercase-initial or capitalized we/our/us still
# match, while "US" (the country or a unit) and "us-east-1" do not.
first_person_pattern="(^|[^[:alpha:]])(I([^[:alpha:]/]|$)|([Ww]e|[Oo]ur)([^[:alpha:]]|$)|[Uu]s([^[:alpha:]-]|$))"
jargon_pattern="cognitive load|intrinsic load|extraneous load|germane load|desirable difficulty|threshold concept|dual coding|retrieval practice|worked example effect|expertise reversal"

# Strip every chapter once, up front. A chapter that fails to strip is reported
# once and fails the run, and no scan may print PASS while it is unscanned: a
# strip crash must never read as "no matches".
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT
fail=0
sources=()
stripped=()
metas=()
unscanned=0
not_checked=0
for f in "${html_files[@]}"; do
  out="$work/${#sources[@]}.txt"
  meta="$out.meta"
  if python3 "$STRIP" "$f" --report "$meta" > "$out"; then
    sources+=("$f")
    stripped+=("$out")
    metas+=("$meta")
    # Exemptions are allowed but never silent: list each one for review.
    while IFS=$'\t' read -r kind line what; do
      if [ "$kind" = exempt ]; then echo "EXEMPT  $f:$line: $what"; fi
    done < "$meta"
    # The patterns below are English. A chapter whose <html lang> or prose is not
    # English is reported as not checked, so its PASS is never mistaken for a
    # voice review (SKILL.md Phase 5 asks for a review in that language).
    lang=$(awk -F'\t' '$1 == "lang" {print $2}' "$meta")
    read -r ascii other < <(awk -F'\t' '$1 == "letters" {print $2, $3}' "$meta")
    case "$lang" in
      ""|[Ee][Nn]|[Ee][Nn]-*)
        if [ "$other" -ge 20 ] && [ "$other" -gt "$ascii" ]; then
          echo "NOT CHECKED  $f: lang=${lang:-unset} but the prose is mostly non-English; set <html lang> and review its voice in that language"
          not_checked=$((not_checked + 1))
        fi ;;
      *)
        echo "NOT CHECKED  $f: lang=$lang; these scans cover English only, so review its voice in that language"
        not_checked=$((not_checked + 1)) ;;
    esac
  else
    echo "verify_prose: strip_prose.py failed on $f; this chapter was NOT scanned" >&2
    unscanned=$((unscanned + 1))
    fail=1
  fi
done

# scan <label> <pattern> [grep flags...]
# grep exits 0 on a hit, 1 on no hit, and >1 on an error (a bad option or
# pattern); an error must fail the scan, never read as "no hits".
scan() {
  local label="$1" pattern="$2" any=0 broken=0 i rc
  shift 2
  for ((i = 0; i < ${#sources[@]}; i++)); do
    rc=0
    grep "$@" -nHE --label="${sources[$i]}" "$pattern" < "${stripped[$i]}" || rc=$?
    case "$rc" in
      0) any=1 ;;
      1) ;;
      *) broken=1 ;;
    esac
  done
  if [ "$any" -eq 1 ]; then
    echo "FAIL  $label" >&2
    fail=1
  elif [ "$broken" -eq 1 ]; then
    echo "FAIL  $label: grep could not run the scan (see the error above)" >&2
    fail=1
  elif [ "$unscanned" -gt 0 ]; then
    echo "FAIL  $label: $unscanned chapter(s) could not be stripped and were not scanned" >&2
    fail=1
  elif [ "$not_checked" -gt 0 ]; then
    echo "PASS  $label (English prose only; $not_checked chapter(s) NOT CHECKED above)"
  else
    echo "PASS  $label"
  fi
}

scan "forbidden voice phrases" "$voice_pattern" -i
scan "first-person author narration" "$first_person_pattern"
scan "pedagogy-jargon leaks" "$jargon_pattern" -i

# An exemption must hide at least one hit. One that hides nothing is stale, and
# it would silently swallow the next banned phrase written inside it.
unused=0
for ((i = 0; i < ${#sources[@]}; i++)); do
  while IFS=$'\t' read -r kind line text; do
    [ "$kind" = exempt_text ] || continue
    if ! grep -qiE "$voice_pattern" <<<"$text" && ! grep -qE "$first_person_pattern" <<<"$text" &&
       ! grep -qiE "$jargon_pattern" <<<"$text"; then
      echo "UNUSED  ${sources[$i]}:$line: data-prose-exempt hides no banned phrase; remove it" >&2
      unused=$((unused + 1))
    fi
  done < "${metas[$i]}"
done
if [ "$unused" -gt 0 ]; then
  echo "FAIL  unused exemptions: $unused" >&2
  fail=1
fi

exit "$fail"
