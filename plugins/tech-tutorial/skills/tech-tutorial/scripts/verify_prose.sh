#!/usr/bin/env bash
set -euo pipefail

DIR="${1:-.}"
if [ ! -d "$DIR" ]; then
  echo "verify_prose: '$DIR' is not a directory" >&2
  exit 2
fi

if [ -n "${TECH_TUTORIAL_LC_ALL:-}" ]; then
  export LC_ALL="$TECH_TUTORIAL_LC_ALL"
else
  cur="${LC_ALL:-${LC_CTYPE:-${LANG:-}}}"
  case "$cur" in
    *.[Uu][Tt][Ff]-8|*.[Uu][Tt][Ff]8) export LC_ALL="$cur" ;;
    *)
      utf8_loc=$(locale -a 2>/dev/null | grep -iE '^(en_US|C)\.utf-?8$' | head -n1)
      export LC_ALL="${utf8_loc:-C.UTF-8}"
      ;;
  esac
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
STRIP="$SCRIPT_DIR/strip_prose.py"

html_files=()
while IFS= read -r f; do html_files+=("$f"); done < <(find "$DIR" -maxdepth 1 -name '*.html' | sort)
if [ "${#html_files[@]}" -eq 0 ]; then
  echo "verify_prose: no .html files in '$DIR'" >&2
  exit 2
fi

voice_pattern="let['’‘]s|we['’‘]ll|you['’‘]ll discover|together we['’‘]ll|now we (are|['’‘]re) going to|next we will look at|maybe|probably|kind of|sort of|(^|[^[:alpha:]])roughly([^[:alpha:]]|$)|obviously|trivially|(^|[^[:alpha:]])just([^[:alpha:]]|$)|in today['’‘]s fast-paced|deep dive journey|unlock the power of"
first_person_pattern="(^|[^[:alpha:]])(I|we|our|us)([^[:alpha:]]|$)"
jargon_pattern="cognitive load|intrinsic load|extraneous load|germane load|desirable difficulty|threshold concept|dual coding|retrieval practice|worked example effect|expertise reversal"

fail=0
scan() {
  local label="$1"
  local pattern="$2"
  local case_flag="$3"
  local any=0
  for f in "${html_files[@]}"; do
    if python3 "$STRIP" "$f" | grep "$case_flag" -nHE --label="$f" "$pattern"; then
      any=1
    fi
  done
  if [ "$any" -eq 1 ]; then
    echo "FAIL  $label" >&2
    fail=1
  else
    echo "PASS  $label"
  fi
}

scan "forbidden voice phrases" "$voice_pattern" "-i"
scan "first-person author narration" "$first_person_pattern" "-i"
scan "pedagogy-jargon leaks" "$jargon_pattern" "-i"

exit "$fail"
