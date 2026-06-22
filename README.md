# zhiwen-skills

A Claude Code plugin marketplace containing personal and project-ready skills.

## Install

In Claude Code:

```
/plugin marketplace add zhiwenliang/skills
/plugin install tech-tutorial@zhiwen-skills
/plugin install visual-explainer@zhiwen-skills
/plugin install book-to-skill@zhiwen-skills
/plugin install explain-article@zhiwen-skills
```

`/plugin marketplace update` refreshes after upstream changes.

## Available plugins

### `tech-tutorial`

Builds English-first, cognitive-science-aligned HTML tutorials for technical topics. Concept-focused by default (scenario walkthroughs that build mental models), with an optional hands-on mode (runnable code progression). The structure is a scaffold — index first, self-check last, and topical chapters in between sized by a concept dependency graph rather than a fixed count. Grounded in research on encoding, learning depth, and current field context.

[`plugins/tech-tutorial/`](./plugins/tech-tutorial)

### `visual-explainer`

Designs one-topic concept diagrams first, then preserves editable `.excalidraw` scenes and exports SVG explainers with Excalidraw.

[`plugins/visual-explainer/`](./plugins/visual-explainer)

### `book-to-skill`

Transforms book-like sources into focused agent skills with source maps, eval prompts, source preparation, and generated-skill validation helpers.

[`plugins/book-to-skill/`](./plugins/book-to-skill)

### `explain-article`

Writes researched explanatory Markdown articles that combine reader assumptions, causal mechanisms, concrete examples, default Mermaid diagrams, boundaries, and understanding checks.

[`plugins/explain-article/`](./plugins/explain-article)

## Repository structure

```
.
├── .claude-plugin/
│   └── marketplace.json       # marketplace catalog
└── plugins/
    └── <plugin-name>/
        ├── .claude-plugin/
        │   └── plugin.json    # plugin manifest
        └── skills/
            └── <skill-name>/
                └── SKILL.md
```

## For contributors

Per-skill authoring conventions live in [`SKILL_REPOSITORY_GUIDE.md`](./SKILL_REPOSITORY_GUIDE.md). The top-level layout there is superseded by the marketplace structure above, but the SKILL.md / references / evals conventions inside each skill directory still apply.
