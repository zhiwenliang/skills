# Book-to-Skill Extraction Workflow

Use this reference after `SKILL.md` triggers and before drafting the derived skill.

## Source Inventory

Build an inventory before synthesis:

- Source type, title, author or owner, edition/date, and rights constraints.
- Table of contents or section list.
- Chapter goals and repeated tasks.
- Procedures, checklists, templates, decision trees, examples, anti-patterns, and validation steps.
- Terms that must be preserved because the field uses them.
- Material that is interesting but not operational enough for the skill.

If the source is large, work chunk by chunk from the output of `scripts/prepare_book_source.py`. Keep notes in this shape:

```text
chunk: chunks/chunk-004.md
source location: chapter 3, "Diagnostic Loop"
usable action: compare expected behavior, observed behavior, and the first divergence
skill location: SKILL.md > Workflow step 3
verification: require a reproducer before fixing
```

## Choose the Skill Boundary

A book often contains more than one skill. Pick one boundary by asking:

- What future user request should activate this skill?
- What work should the agent be able to finish after reading it?
- Which parts of the book change the agent's behavior?
- Which parts are only background, examples, or motivation?
- What deterministic helper would reduce repeated effort?

Prefer one narrow, usable skill over one broad book-shaped skill. If the book has multiple independent workflows, create a suite plan and implement the highest-value skill first.

## Transform Content

Convert source material into agent-operational components:

| Book material | Skill artifact |
|---|---|
| Thesis or central argument | Scope gate and non-goals |
| Repeated method | Workflow steps |
| Decision criteria | Decision table or small flow |
| Case study | Compact example or eval scenario |
| Checklist | Quality checklist |
| Terminology | Reference glossary or field guide |
| Long explanation | Reference file |
| Calculation or conversion | Script |
| Warning or failure mode | Common mistakes and validation checks |

Do not preserve chapter order by default. Skills should follow the order of agent action: scope, gather inputs, decide path, execute, validate, deliver.

## Write the Source Map

Every derived skill needs `references/source-map.md`. Use this format:

```markdown
# Source Map

| Skill artifact | Source location | Transformation |
|---|---|---|
| `SKILL.md` workflow step 2 | Chapter 4, pages 80-86, chunk 006 | Paraphrased the diagnostic sequence into an agent checklist |
| `evals/evals.json` ambiguity case | Chapter 7 case study | Converted a case into a prompt that tests boundary selection |
```

The map is for traceability, not quotation. It should let a maintainer audit where the skill's instructions came from without loading the whole book into context.

## Eval Design

Create evals before final drafting:

- **Activation:** User asks to perform the target workflow in natural language.
- **Application:** User gives realistic inputs and expects a concrete artifact or decision.
- **Ambiguity:** User request partly overlaps a non-goal; expected behavior routes or asks a focused question.
- **Anti-summary:** User asks in a way that tempts the agent to summarize the book; expected behavior produces or improves an operational skill.

Recommended `evals/evals.json` shape:

```json
{
  "skill_name": "generated-skill-name",
  "evals": [
    {
      "id": 1,
      "name": "activation",
      "prompt": "Use $generated-skill-name to ...",
      "expected_output": "Applies the workflow and validates the result.",
      "assertions": ["loads_skill", "uses_workflow", "runs_verification"]
    }
  ]
}
```

## Drafting Rules

- Put only routing, workflow, resource navigation, and core quality gates in `SKILL.md`.
- Move detailed concepts, schemas, examples, and domain reference into directly linked files under `references/`.
- Add scripts only when the operation should be deterministic or repeated.
- Use imperative instructions and concrete file paths.
- Avoid long direct quotes. Paraphrase source ideas into original operational guidance.
- Remove source motivational prose unless it changes agent behavior.
- Keep generated descriptions concrete enough to trigger on user phrasing.

## Validation Loop

Run these checks before delivery:

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/skills/book-to-skill/scripts/validate_book_skill.py" <generated-skill-dir>
```

`validate_book_skill.py` is self-contained. Optionally, if the separate `skill-creator` plugin is installed, also run its generic `quick_validate.py <generated-skill-dir>` for a second structural opinion; skip it when that plugin is unavailable.

Then inspect the evals manually or with a fresh agent. A derived skill is not ready if:

- It reads like a chapter summary.
- It lacks a source map.
- It cannot be used without rereading the book.
- It has no concrete trigger phrases.
- It hides important method details in unlinked notes.
- It has placeholders, long quotes, or unverifiable claims.
