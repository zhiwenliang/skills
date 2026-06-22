# Source Map

This map records how the `book-to-skill` skill was derived from research, local repository conventions, and implemented helper behavior.

| Skill artifact | Source location | Transformation |
|---|---|---|
| `SKILL.md` frontmatter and concise workflow | OpenAI Codex Skills docs; local `skill-creator` guidance; `SKILL_REPOSITORY_GUIDE.md` | Combined Codex skill routing requirements with this repository's marketplace layout and progressive disclosure guidance |
| `SKILL.md` output contract | Local `SKILL_REPOSITORY_GUIDE.md`; existing `tech-tutorial` and `visual-explainer` skill structure | Converted repository conventions into mandatory generated-skill artifacts |
| `references/extraction-workflow.md` source inventory and boundary rules | Agent Skills specification; local `writing-skills` TDD guidance; local skill-creator progressive disclosure guidance | Turned skill-authoring best practices into a book-specific extraction process |
| `scripts/prepare_book_source.py` | User requirement to get resources independently; repo pattern of deterministic helper scripts | Implemented local source normalization, manifest generation, and chunking for long book sources |
| `scripts/validate_book_skill.py` | Skill quality checklist in `SKILL_REPOSITORY_GUIDE.md`; the `skill-creator` plugin's `quick_validate.py` constraints | Added book-specific validation for workflow, source map, evals, and anti-summary behavior |
| `evals/evals.json` | Repository eval convention; `writing-skills` guidance to test activation and application behavior | Added realistic prompts for book conversion, ambiguity, and anti-summary behavior |

External research links:

- OpenAI Codex Skills documentation: https://developers.openai.com/codex/skills
- Agent Skills specification: https://agentskills.io/specification
- Anthropic Agent Skills guide: https://docs.claude.com/en/api/skills-guide
