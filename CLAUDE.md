# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Running tests

There is no repo-wide build or test runner. Each skill has its own tests, and they use only the standard library (no pytest). Run them from the repo root. `${CLAUDE_PLUGIN_ROOT}` is only set when a plugin is installed, so use repo-relative paths during development:

```bash
python3 plugins/book-to-skill/skills/book-to-skill/scripts/test_book_to_skill_scripts.py      # unittest
python3 plugins/explain-article/skills/explain-article/scripts/test_evaluate_article.py      # plain asserts; prints PASS
bash    plugins/tech-tutorial/skills/tech-tutorial/scripts/test_regressions.sh               # fixture HTML through verify_*.sh
npm install --prefix plugins/visual-explainer/skills/visual-explainer/scripts                 # first time only
npm test    --prefix plugins/visual-explainer/skills/visual-explainer/scripts
```

- To run a single book-to-skill test: `python3 -m unittest -v test_book_to_skill_scripts.<Class>.<test>`, run from inside its `scripts/` dir.
- To run a single visual-explainer test: `node --test --test-name-pattern "<substring>" render_excalidraw_svg.test.mjs`, run from inside its `scripts/` dir.
- visual-explainer's render tests launch a real browser through Playwright. It tries local Chrome first; if that fails, run `npm run install-browser` in that `scripts/` dir. A full render can take up to 120s.

## How the pieces connect

Each plugin ships one skill. A skill is a prompt (`SKILL.md` + `references/`) paired with deterministic helper scripts that check what the prompt produces. The agent following the skill runs those scripts against *its own output* (an HTML tutorial, a Markdown article, an Excalidraw scene, a generated skill). Prose and code are tightly coupled, so change them together:

- **explain-article**: `SKILL.md` requires the section markers `<!-- explain-article:<name> -->`. `evaluate_article.py` (`REQUIRED_MARKERS`, plus depth-probe and source thresholds) enforces them. If you rename a marker or change a threshold, update the SKILL, the references, the linter, and its tests together.
- **tech-tutorial**: Phase 5 of `SKILL.md` gates on `verify_structure.sh`, `verify_prose.sh`, `extract_terms.py`, and `svg_overflow_check.js`, the last run in a browser against a served tutorial. The prose-stripping rules live only in `strip_prose.py`; don't inline them as one-liners in `SKILL.md`. Fixture tutorials used by evals are in `evals/fixtures/`.
- **visual-explainer**: `validate_visual_explainer_scene.mjs` enforces the scene design rules, such as word and arrow limits, allowed diagram patterns, and required design metadata. Its test file also asserts on non-code files:
  - `assets/latest-style-demo.svg` must equal a fresh render of `assets/latest-style-demo.excalidraw`. After editing the scene or the renderer, re-render the SVG.
  - `references/diagram-patterns.md` must contain specific "visual grammar" terms.
  - `evals/evals.json` must contain specific topics and assertion names.

  So editing docs or evals can break `npm test`.
- **book-to-skill**: `prepare_book_source.py` normalizes a source into `normalized_book.md`, `manifest.json`, and `chunks/`. Only PDF input needs a third-party package (`pypdf`). `validate_book_skill.py` checks the skill it generates against this repo's own SKILL.md conventions: frontmatter, name format, and no TODO/TBD placeholders.

## Per-skill metadata to keep in sync

- Each skill has an `agents/openai.yaml` file, the display metadata used by Codex/OpenAI-style hosts. Update it when a skill's purpose or name changes.
- When a plugin's version changes, bump it in both `plugins/<plugin>/.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json`. The plugin descriptions there and in `README.md` should also match.
- Scratch output such as generated tutorials, eval workspaces, and prepared book chunks goes in `.tmp/` or `*-workspace/`. Both are gitignored.
