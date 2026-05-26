# Skills

Personal and project-ready agent skills.

## Structure

Use one directory per skill:

```text
skills/
└── skill-name/
    ├── SKILL.md
    └── references/
```

Each `SKILL.md` should include YAML frontmatter with a `name` and `description`, followed by concise instructions for when and how the agent should use the skill.

## Notes

- Keep `SKILL.md` focused and short.
- Put longer references, examples, or templates next to the skill file.
- Use scripts only when they make a repeated workflow more reliable.

## Available Skills

- [`tech-tutorial`](./skills/tech-tutorial) — builds cognitive-science-aligned HTML tutorials for technical topics.
