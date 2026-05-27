# zhiwen-skills

A Claude Code plugin marketplace containing personal and project-ready skills.

## Install

In Claude Code:

```
/plugin marketplace add zhiwenliang/skills
/plugin install tech-tutorial@zhiwen-skills
```

`/plugin marketplace update` refreshes after upstream changes.

## Available plugins

### `tech-tutorial`

Builds cognitive-science-aligned HTML tutorials for technical topics. Concept-focused by default (4 chapters: concepts + principles + self-check with discrimination scenarios); hands-on extension adds practice + pitfalls + capstone. Grounded in Sweller / Bjork / Mayer / Roediger (seven encoding principles) and Marton / Bloom / SOLO / Meyer & Land (depth orientation).

[`plugins/tech-tutorial/`](./plugins/tech-tutorial)

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
