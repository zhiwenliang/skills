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

echo "regression tests passed"
