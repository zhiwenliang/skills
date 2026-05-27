# Skill Repository Best Practices

> **Note**: This repository was converted to a [Claude Code plugin marketplace](./README.md). The top-level layout below (a flat `skills/` directory) is superseded by `plugins/<plugin>/skills/<skill>/`. The per-skill authoring conventions (SKILL.md frontmatter, references/, evals/, scripts/) still apply unchanged inside each skill directory.

This guide describes how to structure, write, review, and maintain a repository of agent skills. It is based on the Cursor Agent Skills documentation, the Agent Skills open standard, Anthropic skill-authoring guidance, and common patterns from popular public skill repositories.

## Purpose

A skills repository should be a version-controlled library of reusable agent workflows. Each skill should teach the agent how to perform one specific task or workflow reliably, without requiring the user to re-explain the same process in every conversation.

Use a skill when the agent needs a repeatable procedure, domain-specific context, templates, validation steps, or bundled scripts. Use a rule instead when a short always-on instruction is enough.

## Recommended Repository Layout

This repository is a Claude Code plugin marketplace. Skills live two levels deep, inside a plugin:

```text
.claude-plugin/
+-- marketplace.json
plugins/
+-- plugin-name/
    +-- .claude-plugin/
    |   +-- plugin.json
    +-- skills/
    |   +-- skill-name/
    |       +-- SKILL.md
    |       +-- references/
    |       |   +-- reference.md
    |       +-- scripts/
    |       |   +-- validate.py
    |       +-- assets/
    |       |   +-- template.json
    |       +-- evals/
    |           +-- evals.json
    +-- commands/         (optional, slash commands at plugin root)
    +-- agents/           (optional)
    +-- hooks/            (optional)
```

At the repository root, keep human-facing project documentation:

```text
README.md
SKILL_REPOSITORY_GUIDE.md
AGENTS.md
.gitignore
```

The per-skill conventions below (`SKILL.md` frontmatter, `references/`, `scripts/`, `evals/`) apply unchanged inside `plugins/<plugin>/skills/<skill>/`. They were originally written for a flat `skills/<skill>/` layout — read them in that spirit and substitute the deeper path.

### Directory Purposes

- `SKILL.md`: Required entry point. Contains frontmatter and the core instructions the agent reads when the skill activates.
- `references/`: Detailed background, long examples, API notes, checklists, and domain knowledge loaded only when needed.
- `scripts/`: Deterministic helpers the agent can run, such as validators, formatters, extractors, or generators.
- `assets/`: Templates, static files, images, example configs, or other reusable resources.
- `evals/`: Test prompts, expected behavior, and assertions that help evaluate whether the skill works.

## `SKILL.md` Requirements

Every skill must contain a file named exactly `SKILL.md` with YAML frontmatter at the top:

```md
---
name: skill-name
description: Performs a specific workflow. Use when the user asks for the workflow, mentions relevant trigger phrases, or works with the target files.
---

# Skill Name

## When to Use

Use this skill when...

## Instructions

1. Do the first step.
2. Do the second step.
3. Verify the result.
```

### Required Fields

- `name`: Lowercase letters, numbers, and hyphens only. It must match the folder that contains `SKILL.md`.
- `description`: A clear description of what the skill does and when to use it. This is the routing text the agent sees before loading the full skill.

### Useful Optional Fields

- `paths`: Glob patterns that scope the skill to matching files.
- `disable-model-invocation: true`: Makes the skill explicit-only, so it is loaded when invoked by name rather than automatically.
- `metadata`: Extra key-value metadata for tools or repository indexing.

Use `paths` for file-specific skills:

```md
---
name: svelte-component-review
description: Reviews Svelte components for local conventions and Svelte 5 best practices. Use when editing or reviewing Svelte component files.
paths:
  - "**/*.svelte"
  - "**/*.svelte.ts"
---
```

Use `disable-model-invocation` for command-like skills:

```md
---
name: release-checklist
description: Runs the release checklist when explicitly invoked before publishing a package.
disable-model-invocation: true
---
```

## Writing Strong Descriptions

The description decides whether the agent finds the skill. Treat it as routing logic, not marketing copy.

Good descriptions include:

- What the skill does.
- When to use it.
- Trigger words users are likely to type.
- Relevant file types, tools, domains, or workflows.

Good:

```yaml
description: Reviews pull requests for correctness, security, maintainability, and test coverage. Use when the user asks for a code review, PR review, change review, or risk assessment.
```

Weak:

```yaml
description: Helps with code.
```

## Progressive Disclosure

Skills work best when they load in layers:

1. Frontmatter is always available for discovery.
2. `SKILL.md` is loaded when the skill is relevant.
3. Linked files in `references/`, `scripts/`, and `assets/` are loaded only when needed.

Keep the main `SKILL.md` focused. Move long explanations, examples, tables, and background into directly linked reference files.

Rules of thumb:

- Keep `SKILL.md` under 500 lines.
- Prefer under 100-300 lines for most skills.
- Keep references one level deep from `SKILL.md`.
- Link directly to files the agent may need.
- Avoid reference chains where `SKILL.md` links to one file that links to another file.

## What Belongs In A Skill

A strong skill usually includes:

- Clear trigger conditions.
- Clear non-goals or "when not to use this."
- Step-by-step workflow.
- Decision points and fallback behavior.
- Concrete examples of good output.
- Verification or quality checks.
- Links to reference material.
- Scripts for deterministic or repeated operations.

Example structure:

```md
# Skill Name

## When to Use

Apply this skill when...

Do not apply it when...

## Workflow

1. Gather context.
2. Decide the path.
3. Execute the workflow.
4. Verify the result.

## Quality Checklist

- [ ] Output matches the requested format.
- [ ] Required validation commands were run.
- [ ] Edge cases were handled or explicitly called out.

## References

- See [references/examples.md](references/examples.md) for examples.
```

## When To Add Scripts

Add scripts when a repeated operation is easier, safer, or more reliable as code than as generated instructions.

Good script candidates:

- Validate a generated artifact.
- Parse a file format.
- Normalize or format output.
- Run a repeatable checklist.
- Extract metadata.
- Generate a template.

Script guidance:

- Use relative paths from the skill root.
- Document dependencies.
- Print clear errors.
- Avoid hidden network calls unless the skill requires them.
- Never hardcode secrets.
- Prefer portable languages already common in the repo.

Example:

````md
Before finalizing, run:

```bash
python scripts/validate_skill.py skills/my-skill
```
````

## Evals

Each skill should include a small eval set when quality matters. Evals do not need to be complex. They should capture realistic user prompts and expected behavior.

Recommended shape:

```json
{
  "skill_name": "skill-name",
  "evals": [
    {
      "id": 1,
      "name": "common-request",
      "prompt": "User request that should activate the skill.",
      "expected_output": "Short description of successful behavior.",
      "assertions": [
        "uses_required_workflow",
        "asks_clarifying_question_when_needed",
        "runs_validation"
      ]
    }
  ]
}
```

Use evals to protect the core behavior of the skill, not to test every possible wording.

## Skill Quality Checklist

Before adding or publishing a skill, check:

- [ ] Folder name matches the `name` field.
- [ ] `SKILL.md` exists and is capitalized exactly.
- [ ] Description includes both what and when.
- [ ] Description has concrete trigger phrases.
- [ ] `SKILL.md` is focused and under 500 lines.
- [ ] Long material is moved to `references/`.
- [ ] References are linked directly from `SKILL.md`.
- [ ] The skill does one job well.
- [ ] Non-goals are explicit.
- [ ] Scripts, if present, have documented dependencies.
- [ ] No secrets, tokens, private credentials, or machine-specific paths are included.
- [ ] Examples are concrete.
- [ ] Verification steps are included.
- [ ] Evals cover the most important activation scenarios.

## Common Anti-Patterns

Avoid these patterns:

- Vague descriptions such as "helps with docs" or "coding assistant."
- One giant skill that handles unrelated workflows.
- Long essays in `SKILL.md` that should be reference material.
- Deeply nested reference chains.
- Scripts that fail silently.
- Hidden assumptions about local paths or installed tools.
- Skills that duplicate existing always-on project rules.
- Time-sensitive instructions that will become stale.
- Public skills that include private company context.

## Public Repository Guidance

For public or shared skill repositories:

- Add a concise `README.md` listing available skills.
- Include installation instructions for Cursor and other compatible agents.
- Keep each skill portable by using standard `SKILL.md` structure.
- Prefer `name`, `description`, `paths`, `disable-model-invocation`, and `metadata` over tool-specific custom fields.
- Include licenses where needed.
- Audit any third-party skills before importing them.
- Review scripts carefully before publishing or installing.

Cursor discovers skills from these common locations:

```text
.agents/skills/
.cursor/skills/
~/.agents/skills/
~/.cursor/skills/
```

Cursor also supports compatible Claude and Codex skill directories.

## Maintaining This Repository

When adding a new skill:

1. Create `skills/<skill-name>/SKILL.md`.
2. Write a specific description with trigger phrases.
3. Keep core instructions in `SKILL.md`.
4. Move long context into `references/`.
5. Add scripts only for deterministic repeated work.
6. Add eval prompts for important behavior.
7. Update `README.md` with the new skill.
8. Run the skill quality checklist.

When updating an existing skill:

1. Preserve its main trigger behavior unless intentionally changing it.
2. Keep the description aligned with the actual workflow.
3. Split bloated sections into references.
4. Update evals when behavior changes.
5. Remove stale references and unused files.

## References

- [Cursor Agent Skills](https://cursor.com/docs/skills)
- [Agent Skills Overview](https://agentskills.io/home)
- [Anthropic custom skills guide](https://support.anthropic.com/en/articles/12512198-creating-custom-skills)
- [awesome-agent-skills](https://github.com/JackyST0/awesome-agent-skills)
- [awesome-cursor-skills](https://github.com/spencerpauly/awesome-cursor-skills)
