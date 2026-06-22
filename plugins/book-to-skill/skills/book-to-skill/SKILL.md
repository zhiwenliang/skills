---
name: book-to-skill
description: Use when the user asks to turn a book, manual, long PDF, EPUB, course notes, or source text into a focused agent skill; convert a book into SKILL.md; extract a repeatable workflow from source material; or build skill evals, references, and source maps from a document.
---

# Book to Skill

Transform a book-like source into an operational agent skill. The output is not a summary of the book; it is a focused workflow another agent can use to do real work, with source grounding and evaluation prompts.

## Scope Gate

Use this skill when the requested artifact is a reusable skill, plugin skill, or `SKILL.md` derived from a book, manual, long-form documentation, course, or notes.

Do not use it when the user wants only a book summary, review, reading notes, flashcards, or a tutorial for humans. Route those requests to the appropriate writing or learning workflow.

Respect copyright and source limits. Use the source to synthesize original procedures, checklists, and references. Do not reproduce long passages from books. Keep direct quotes short and necessary.

## Workflow

1. **Define the target job.** Identify the future user, trigger phrases, the work the skill should enable, expected inputs, and non-goals. If the book covers several unrelated jobs, propose a narrow first skill or a small skill suite.
2. **Prepare the source.** For local files or directories, run:

```bash
python scripts/prepare_book_source.py <book-or-source-dir> --out .tmp/book-to-skill/<slug> --chunk-words 1200
```

Use the generated `normalized_book.md`, `manifest.json`, and `chunks/` as the working corpus. If PDF extraction reports a missing dependency, install or use an available local extractor before falling back to manual reading.

3. **Read the detailed method.** Use [references/extraction-workflow.md](references/extraction-workflow.md) before distilling the book. It gives the source inventory, chunk synthesis, skill-boundary, and eval design process.
4. **Extract reusable action, not prose.** Capture procedures, decision points, examples, constraints, failure modes, checklists, data shapes, and tools. Discard chapter order when a workflow order is clearer.
5. **Design tests first.** Create `evals/evals.json` before writing the final skill. Include at least one activation scenario, one realistic application scenario, one ambiguity scenario, and one anti-summary/source-grounding scenario.
6. **Build the skill artifact.** Create or update:

```text
<skill-name>/
├── SKILL.md
├── references/
│   ├── source-map.md
│   └── <field-guide-or-workflow-reference>.md
├── scripts/          # only when deterministic helpers are useful
└── evals/
    └── evals.json
```

7. **Write `references/source-map.md`.** Map each major skill rule, reference section, script, and eval back to book chapters, pages, sections, or chunk ids. Paraphrase; use direct quotes only when the exact wording is essential.
8. **Validate and evaluate.** Run:

```bash
python scripts/validate_book_skill.py <generated-skill-dir>
```

`validate_book_skill.py` already covers frontmatter, structure, source map, and evals. Optionally, if the separate `skill-creator` plugin is installed, also run its generic `quick_validate.py` for a second structural opinion; skip it when that plugin is unavailable.

Then run or manually inspect the eval scenarios. Fix the skill if it behaves like a summary, lacks source grounding, has vague triggers, omits verification, or cannot guide a new agent through the target work.

## Output Contract

The generated skill must include:

- Clear frontmatter with a hyphen-case `name` and concrete `description` triggers.
- A concise `SKILL.md` workflow under 500 lines unless the domain truly requires more.
- `references/source-map.md` with source-to-skill traceability.
- At least one detailed reference file when the book contributes substantial domain method.
- `evals/evals.json` with realistic prompts and assertions.
- Scripts only for repeated, deterministic tasks such as extraction, validation, conversion, or artifact generation.

## Quality Checklist

- [ ] The skill teaches repeatable work, not a book summary.
- [ ] Scope is narrow enough for one skill to own.
- [ ] Trigger phrases cover how users will actually ask for it.
- [ ] Long source detail lives in references, not `SKILL.md`.
- [ ] Source map links important instructions to chapters, sections, pages, or chunks.
- [ ] Evals test activation, application, ambiguity, and anti-summary behavior.
- [ ] Validators and script tests were run after edits.
- [ ] No unresolved placeholders, long copyrighted passages, secrets, or machine-specific paths remain.
