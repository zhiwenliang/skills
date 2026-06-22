# Agent Guide

This repository is a **Claude Code plugin marketplace**. Each plugin lives in
`plugins/<plugin>/` and ships one skill under
`plugins/<plugin>/skills/<skill>/` (`SKILL.md` plus optional `references/`,
`scripts/`, and `evals/`).

- **Authoring conventions:** see [SKILL_REPOSITORY_GUIDE.md](./SKILL_REPOSITORY_GUIDE.md).
- **Catalog:** [.claude-plugin/marketplace.json](./.claude-plugin/marketplace.json).
  Keep each plugin's `version` in sync with its
  `plugins/<plugin>/.claude-plugin/plugin.json`, and list every plugin in both
  the catalog and the README install block.
- **Script paths:** inside a skill, invoke bundled scripts via
  `"${CLAUDE_PLUGIN_ROOT}/skills/<skill>/scripts/..."`. Skills run from the
  user's working directory, not the skill folder, so relative paths do not
  resolve. Never reference files outside the plugin directory with `../` —
  only `plugins/<plugin>/` is shipped on install.
- **Before changing a skill,** run its tests, e.g.
  `python3 "${CLAUDE_PLUGIN_ROOT}/skills/<skill>/scripts/test_*.py"`, or
  `npm test --prefix plugins/visual-explainer/skills/visual-explainer/scripts`.
