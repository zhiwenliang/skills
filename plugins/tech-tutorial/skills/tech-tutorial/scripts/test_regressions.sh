#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCRIPTS="$ROOT/scripts"

tmp="$(mktemp -d)"
cleanup() { rm -rf "$tmp"; }
trap cleanup EXIT

make_base_html() {
  local file="$1"
  local body="$2"
  cat > "$file" <<HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Regression Fixture</title>
  <style>.diagram-ink{stroke:#000}.node-fill{fill:#fff}</style>
</head>
<body>
<article>
$body
<figure><svg viewBox="0 0 200 80" role="img" aria-label="example"><text x="20" y="40">Example</text></svg><figcaption>Fig. 1. Example.</figcaption></figure>
</article>
</body>
</html>
HTML
}

english_dir="$tmp/english"
mkdir "$english_dir"
make_base_html "$english_dir/index.html" '
<section data-tech-tutorial="audience-for"><h2>Who this is for</h2><p>Engineers learning the topic.</p></section>
<section data-tech-tutorial="audience-not-for"><h2>Who this is not for</h2><p>Readers who need debugging help.</p></section>
<section data-tech-tutorial="outcomes"><h2>What you can do after reading</h2><p>Explain the core mechanism.</p></section>
<section class="self-check"><h2>Self-check</h2><p data-tech-tutorial="reader-drawing">Sketch the flow from memory.</p></section>
'
bash "$SCRIPTS/verify_structure.sh" "$english_dir" >/dev/null

non_english_dir="$tmp/non-english"
mkdir "$non_english_dir"
make_base_html "$non_english_dir/index.html" '
<section data-tech-tutorial="audience-for"><h2>适合谁</h2><p>工程师。</p></section>
<section data-tech-tutorial="audience-not-for"><h2>不适合谁</h2><p>只想调试的人。</p></section>
<section data-tech-tutorial="outcomes"><h2>读完之后你能做到什么</h2><p>解释核心机制。</p></section>
<section class="self-check"><h2>自测</h2><p data-tech-tutorial="reader-drawing">合上教程，亲手画一张流程图。</p></section>
'
bash "$SCRIPTS/verify_structure.sh" "$non_english_dir" >/dev/null

voice_dir="$tmp/voice"
mkdir "$voice_dir"
cat > "$voice_dir/index.html" <<'HTML'
<!DOCTYPE html>
<html lang="en">
<body>
<article>
<p>We use the parser. Our handler returns the value. let’s inspect the result.</p>
</article>
</body>
</html>
HTML
if bash "$SCRIPTS/verify_prose.sh" "$voice_dir" >/dev/null 2>&1; then
  echo "verify_prose.sh failed to flag first-person and curly-apostrophe prose" >&2
  exit 1
fi

clean_voice_dir="$tmp/clean-voice"
mkdir "$clean_voice_dir"
cat > "$clean_voice_dir/index.html" <<'HTML'
<!DOCTYPE html>
<html lang="en">
<body>
<article>
<p>The parser receives bytes, validates the header, and returns a typed record.</p>
<details><summary>Answer</summary><p>We can use first person inside hidden answers if the prompt quotes it.</p></details>
<pre><code>print("let's keep code untouched")</code></pre>
</article>
</body>
</html>
HTML
bash "$SCRIPTS/verify_prose.sh" "$clean_voice_dir" >/dev/null

fail_test() { echo "regression: $1" >&2; exit 1; }

# One-paragraph chapter fixture for the prose checks: prose_dir <name> <html body>.
prose_dir() {
  mkdir "$tmp/$1"
  printf '<!DOCTYPE html>\n<html lang="en">\n<body>\n%s\n</body>\n</html>\n' "$2" > "$tmp/$1/index.html"
  printf '%s' "$tmp/$1"
}

# The curly apostrophe must be caught by the voice scan on its own, not just
# ride along with first-person hits that already fail the run.
d=$(prose_dir curly '<p>Let’s inspect the result.</p>')
out=$(bash "$SCRIPTS/verify_prose.sh" "$d" 2>&1) && fail_test "curly-apostrophe let’s passed"
grep -q "FAIL  forbidden voice phrases" <<<"$out" || fail_test "curly-apostrophe let’s not flagged by the voice scan"

# Character references must not hide a banned phrase.
n=0
for body in '<p>Let&rsquo;s inspect the result.</p>' '<p>Let&#39;s inspect the result.</p>' '<p>It is kind&nbsp;of slow.</p>'; do
  n=$((n + 1))
  d=$(prose_dir "entity-$n" "$body")
  bash "$SCRIPTS/verify_prose.sh" "$d" >/dev/null 2>&1 && fail_test "entity-encoded phrase passed: $body"
done

# Markup shapes that used to hide prose from every scan: a chapter built from the
# layout template (its CSS comment mentions <details>), a code block closed as
# </code> + newline + </pre>, a bare "<" in prose, block elements with no
# whitespace between them, and a phrase wrapped across two source lines.
n=0
for body in \
  '<pre><code>a = 1</code>
</pre>
<p>We probably just retry here.</p>
<pre><code>b = 2</code></pre>' \
  '<p>If n < 10, we probably just retry.</p>' \
  '<h2>Setup</h2><p>We install the tool.</p><h2>Timing</h2><p>Just run it.</p>' \
  '<p>It is kind
of slow.</p>'; do
  n=$((n + 1))
  d=$(prose_dir "hidden-$n" "$body")
  bash "$SCRIPTS/verify_prose.sh" "$d" >/dev/null 2>&1 && fail_test "violation hidden by markup passed: $body"
done
mkdir "$tmp/from-template"
python3 - "$ROOT/references/layout-template.html" "$tmp/from-template/01-concepts.html" <<'PY'
import sys
page = open(sys.argv[1], encoding="utf-8").read()
chapter = ('<header class="chapter-opener"><h1>Queues</h1><p class="recap">'
           "Let's just obviously start: we think our queue is probably fine.</p></header>"
           '<section class="self-check"><details><summary>Answers</summary>'
           "<p>A1</p></details></section>")
body = page.index('<div class="page">')  # the header comment also says "<article>"
page = page[:body] + page[body:].replace("<article>", "<article>" + chapter, 1)
open(sys.argv[2], "w", encoding="utf-8").write(page)
PY
bash "$SCRIPTS/verify_prose.sh" "$tmp/from-template" >/dev/null 2>&1 && fail_test "violations in a template-built chapter passed"

# The curly-apostrophe match must not depend on an installed UTF-8 locale.
LC_ALL=xx_YY.UTF-8 bash "$SCRIPTS/verify_prose.sh" "$tmp/curly" >/dev/null 2>&1 && fail_test "let’s passed under an uninstalled locale"

# A grep that errors (exit 2, e.g. an unsupported option) must fail the scan, not read as "no hits".
mkdir "$tmp/badgrep"
printf '#!/bin/sh\nexit 2\n' > "$tmp/badgrep/grep"
chmod +x "$tmp/badgrep/grep"
d=$(prose_dir grep-error '<p>We probably just retry.</p>')
PATH="$tmp/badgrep:$PATH" bash "$SCRIPTS/verify_prose.sh" "$d" >/dev/null 2>&1 && fail_test "a failing grep read as PASS"

# Technical prose and code that is not author narration must pass.
d=$(prose_dir not-narration '<p>Writes batch, i.e. they coalesce. Blocking I/O stalls most US regions.</p>
<p>The servlet'"'"'s init runs once; <code>i</code> counts retries in <code>us-east-1</code>.</p>
<pre>$ just build   # we probably need sudo</pre>
<script>for (let i = 0; i < 3; i++) { /* we just loop */ }</script>
<style>/* we just reset margins */ body { margin: 0 }</style>
<!-- we should maybe reword this -->')
bash "$SCRIPTS/verify_prose.sh" "$d" >/dev/null || fail_test "non-narration prose or code was flagged"

# A hit must be reported at its source line, even after multi-line tags and blocks.
d=$(prose_dir line-numbers '<figure>
  <svg viewBox="0 0 10 10"
       role="img">
  </svg>
</figure>
<details>
<summary>Answer</summary>
</details>
<p>We parse the header.</p>')
src_line=$(grep -n "We parse" "$d/index.html" | cut -d: -f1)
out=$(bash "$SCRIPTS/verify_prose.sh" "$d" 2>/dev/null) && fail_test "line-number fixture passed"
grep -q "index.html:$src_line:We parse" <<<"$out" || fail_test "hit not reported at source line $src_line: $out"

# A chapter that cannot be stripped fails the run and never reads as PASS.
mkdir "$tmp/unstrippable"
printf '<p>caf\xe9</p>\n' > "$tmp/unstrippable/index.html"
out=$(bash "$SCRIPTS/verify_prose.sh" "$tmp/unstrippable" 2>/dev/null) && fail_test "unstrippable chapter passed"
[ -z "$out" ] || fail_test "unstrippable chapter printed on stdout: $out"

# Only a closed <details> hides an answer: an open one is visible prose, so
# wrapping a chapter in <details open> must not hide it from the scans. A closed
# <details> still hides everything inside, open children included.
d=$(prose_dir details-open '<details open><summary>Overview</summary><p>We probably just retry.</p></details>')
bash "$SCRIPTS/verify_prose.sh" "$d" >/dev/null 2>&1 && fail_test "prose inside <details open> was not scanned"
d=$(prose_dir details-nested '<details><summary>Answer</summary><details open><p>A1</p></details><p>We probably just retry.</p></details>')
bash "$SCRIPTS/verify_prose.sh" "$d" >/dev/null || fail_test "an open <details> inside a closed answer leaked the answer"

# Quoted material and explicitly exempted elements keep their wording (SKILL.md
# "Legitimate exceptions"), and every exemption is listed so a reviewer can audit it.
d=$(prose_dir quoted '<blockquote><p>We propose a new consensus algorithm.</p></blockquote>
<p>The paper states <q>we sought an algorithm</q> that is understandable.</p>
<p data-prose-exempt="Bloom filter semantics">A hit means the key is probably in the set.</p>')
out=$(bash "$SCRIPTS/verify_prose.sh" "$d" 2>&1) || fail_test "quoted or exempted prose was flagged: $out"
[ "$(grep -c '^EXEMPT' <<<"$out")" -eq 3 ] || fail_test "exemptions were not listed one per element: $out"
grep -q "index.html:6: data-prose-exempt (Bloom filter semantics)" <<<"$out" || fail_test "exemption not reported with line and reason: $out"
d=$(prose_dir exempt-no-reason '<p data-prose-exempt="">A hit means the key is probably in the set.</p>')
bash "$SCRIPTS/verify_prose.sh" "$d" >/dev/null 2>&1 && fail_test "data-prose-exempt without a reason exempted prose"

# Standard technical usage is not a hedge or narration; the hedges still fail.
d=$(prose_dir technical-usage '<p>A Deployment is one kind of workload controller in us-east-1.</p>
<p>That sort of design trades latency for throughput; a Type I error is a false positive.</p>
<p>Failover takes roughly 150-300 ms. Group related writes together. A split vote is improbably long.</p>')
out=$(bash "$SCRIPTS/verify_prose.sh" "$d" 2>&1) || fail_test "standard technical usage was flagged: $out"
n=0
for body in '<p>The cache is kind of slow.</p>' '<p>Both paths cost roughly the same.</p>' \
  '<p>Now explore the scheduler together.</p>' '<p>It sort of works.</p>'; do
  n=$((n + 1))
  d=$(prose_dir "hedge-$n" "$body")
  bash "$SCRIPTS/verify_prose.sh" "$d" >/dev/null 2>&1 && fail_test "hedge or cheerleading passed: $body"
done

# The scans are English patterns: a non-English chapter must be reported as not
# checked, never as a silent PASS — whether <html lang> says so or the prose does.
mkdir "$tmp/zh" "$tmp/zh-mislabeled"
printf '<!DOCTYPE html>\n<html lang="zh-CN">\n<body><p>让我们一起深入探索！显然，我们只需要记住认知负荷。</p></body>\n</html>\n' > "$tmp/zh/index.html"
out=$(bash "$SCRIPTS/verify_prose.sh" "$tmp/zh" 2>&1) || fail_test "non-English chapter failed instead of being reported: $out"
grep -q "^NOT CHECKED  .*/index.html: lang=zh-CN" <<<"$out" || fail_test "zh-CN chapter not reported as NOT CHECKED: $out"
sed 's/lang="zh-CN"/lang="en"/' "$tmp/zh/index.html" > "$tmp/zh-mislabeled/index.html"
out=$(bash "$SCRIPTS/verify_prose.sh" "$tmp/zh-mislabeled" 2>&1) || true
grep -q "^NOT CHECKED  .*/index.html: .*mostly non-English" <<<"$out" || fail_test "lang=en chapter with Chinese prose not reported: $out"
out=$(bash "$SCRIPTS/verify_prose.sh" "$clean_voice_dir" 2>&1)
grep -q "NOT CHECKED" <<<"$out" && fail_test "English chapter reported as NOT CHECKED: $out"

# Every eval assertion is classified in the legend, and eval ids are unique.
python3 - "$ROOT/evals/evals.json" <<'PY' || fail_test "evals.json legend drifted from the assertions"
import json, sys
data = json.load(open(sys.argv[1], encoding="utf-8"))
legend = {name for kind, names in data["_assertion_legend"].items() if not kind.startswith("_") for name in names}
used = {a for case in data["evals"] for a in case["assertions"]}
ids = [case["id"] for case in data["evals"]]
problems = [f"unclassified: {sorted(used - legend)}"] if used - legend else []
problems += [f"unused in legend: {sorted(legend - used)}"] if legend - used else []
problems += ["duplicate eval ids"] if len(ids) != len(set(ids)) else []
if problems:
    sys.exit("; ".join(problems))
PY

# Multi-file tutorial: gate 6 counts figures, not lines; gate 5 needs a real prompt.
multi="$tmp/multi"; shots="$tmp/shots"
mkdir "$multi" "$shots"
page() { printf '<html><head><style>.diagram-ink{}</style></head><body>%s</body></html>\n' "$2" > "$multi/$1"; }
fig='<figure><svg viewBox="0 0 10 10"></svg></figure>'
page index.html "<section data-tech-tutorial=\"audience-for\"></section><section data-tech-tutorial=\"audience-not-for\"></section><section data-tech-tutorial=\"outcomes\"></section>$fig"
page 01-concepts.html "$fig$fig<p>Withdraw the request before retrying.</p>"
page 02-self-check.html "$fig"
touch -t 202001010000 "$multi"/*.html
touch "$shots/index-fig1.png" "$shots/01-concepts-fig1.png" "$shots/02-self-check-fig1.png"
out=$(bash "$SCRIPTS/verify_structure.sh" "$multi" "$shots") && fail_test "structure gates passed with an uncaptured figure and no drawing prompt"
grep -q "01-concepts.html — figures=2, fresh screenshots=1" <<<"$out" || fail_test "gate 6 did not count two figures on one line: $out"
grep -q "FAIL  reader-drawing prompt" <<<"$out" || fail_test "'Withdraw the' counted as a drawing prompt"
touch "$shots/01-concepts-fig1.jpg"  # a second format of fig1 is not a screenshot of fig2
out=$(bash "$SCRIPTS/verify_structure.sh" "$multi" "$shots") && fail_test "fig1.png + fig1.jpg passed for two figures"
grep -q "01-concepts.html — figures=2, fresh screenshots=1" <<<"$out" || fail_test "gate 6 counted a duplicate screenshot of fig1: $out"
page 02-self-check.html "$fig<p data-tech-tutorial=\"reader-drawing\">Draw it yourself.</p>"
touch -t 202001010000 "$multi/02-self-check.html"
touch "$shots/01-concepts-fig2.png"
bash "$SCRIPTS/verify_structure.sh" "$multi" "$shots" >/dev/null || fail_test "complete multi-file tutorial failed the structure gates"

# Gate 4 needs the utility CSS rule, not the snippet comment that names the class.
page 03-extra.html "$fig"
sed -i.bak 's#<style>.diagram-ink{}</style>#<style>body{margin:0}</style>#; s#<svg viewBox="0 0 10 10">#&<!-- Use .diagram-ink, .diagram-accent, .node-fill, .node-label, .edge-label. -->#' "$multi/03-extra.html"
rm -f "$multi/03-extra.html.bak"
out=$(bash "$SCRIPTS/verify_structure.sh" "$multi") && fail_test "gate 4 passed a chapter without the utility CSS"
grep -q "03-extra.html — paste the canonical SVG utility block" <<<"$out" || fail_test "gate 4 did not name 03-extra.html: $out"

# A macOS "._index.html" sidecar is not a chapter: the primer stays in single-file mode.
printf '\000\005\026\007Mac OS X sidecar' > "$english_dir/._index.html"
out=$(bash "$SCRIPTS/verify_structure.sh" "$english_dir") || fail_test "sidecar file broke the single-file primer: $out"
grep -q "single-file primer mode" <<<"$out" || fail_test "sidecar file counted as a chapter: $out"
bash "$SCRIPTS/verify_prose.sh" "$english_dir" >/dev/null || fail_test "verify_prose.sh scanned the sidecar file"

# Terminology candidates: straight single quotes are captured, contractions,
# possessives and inch marks do not pair up, section numbers are not glued onto
# titles, CJK quotes and diagram labels count, and a directory name with glob
# characters still works.
terms_dir="$tmp/terms [draft]"
mkdir "$terms_dir"
cat > "$terms_dir/index.html" <<'HTML'
<h2 id="s11"><span class="num">1.1</span><span>Event loop</span></h2>
<p>The 'task pump' drains the queue. It's fast, and don't worry about the users' data.</p>
<p>The 3.5" drive and the "execution funnel" and the "state triad". The answer is "42".</p>
<p>The ‘leader’s lease window’ bounds stale reads.</p>
<p>中文里的「执行漏斗」。</p>
<figure><svg viewBox="0 0 10 10"><text x="1" y="5">Dispatch prism</text></svg></figure>
HTML
terms=$(python3 "$SCRIPTS/extract_terms.py" "$terms_dir" | cut -f1)
for want in "Event loop" "task pump" "execution funnel" "state triad" "leader’s lease window" "执行漏斗" "Dispatch prism"; do
  grep -qxF "$want" <<<"$terms" || fail_test "extract_terms missed '$want': $terms"
done
[ "$(wc -l <<<"$terms" | tr -d ' ')" -eq 7 ] || fail_test "extract_terms emitted bogus candidates: $terms"

echo "regression tests passed"
