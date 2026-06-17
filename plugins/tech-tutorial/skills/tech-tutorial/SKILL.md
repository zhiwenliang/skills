---
name: tech-tutorial
description: Use when the user wants to learn, understand, teach, or build a systematic knowledge base around a technology, framework, library, protocol, tool, or technical concept. Triggers include "teach me X", "I want to learn X", "help me understand X", "give me a primer", "write a tutorial about X", "turn these docs into a tutorial", or requests for a structured learning path.
---

# Tech Tutorial Writer

A tutorial that does not build a mental model is a long paraphrase of the docs. This skill produces professional, English-first technical tutorials that teach durable understanding: low extraneous load, diagrams that carry structure, worked examples, retrieval practice, spaced revisit, interleaving, mechanism depth, and current field context.

Default output language is English. If the user explicitly requests another language, keep the same structure and verification intent. Localize visible headings, but preserve stable `data-tech-tutorial` markers for structural gates.

## Scope Gate

Use this skill when the user's intent is learning, teaching, or systematizing understanding of a technical subject.

Do not use it for:

- Debugging an existing code problem. Use a debugging workflow.
- One-shot reference answers such as "what does this API return?" Answer directly.
- Building a product or code feature with a technology. Use the relevant implementation workflow.

If intent is ambiguous, ask: "Do you want me to build something with this technology, or teach the technology itself?"

Diataxis is the routing vocabulary: this skill owns study-oriented explanation and tutorial work. Route work-oriented how-to and reference requests away unless the user asks to turn them into a learning artifact.

## Learning Principles

The tutorial is designed against seven mandatory principles. Research details and citations live in [references/cognitive_principles.md](references/cognitive_principles.md).

### 1. Declare the Target Reader

Open the tutorial with visible headings in the output language and these semantic markers:

- `data-tech-tutorial="audience-for"`: required background, tools, versions, and assumptions.
- `data-tech-tutorial="audience-not-for"`: readers who should take a different path.
- `data-tech-tutorial="outcomes"`: concrete, verifiable capabilities.

Do not try to serve novices and experts with the same explanation style. Expertise reversal makes that fail.

### 2. Map Before Territory

Start with a concept map and a learning-path breadcrumb. Re-show the breadcrumb at each chapter opener with the current chapter highlighted. This gives the reader anchors before details arrive.

### 3. Pair Text With Diagrams

Each major section needs at least one information-carrying diagram when spatial structure, flow, hierarchy, state, or comparison matters.

Rules:

- At least one `<figure>` per chapter.
- Labels live on the diagram elements, not in distant prose.
- Decorative images are deleted.
- At least one reader-drawing prompt exists in the tutorial, usually in self-check or capstone, marked with `data-tech-tutorial="reader-drawing"` when the visible prompt is not English.

Use [references/diagram_guide.md](references/diagram_guide.md) for diagram selection and SVG verification rules.

### 4. Worked -> Partial -> Open

For a new concept, lead with a worked example before asking the reader to solve.

- **Concept-focused mode, default**: use scenario walkthroughs. Walk through a concrete situation, name the mechanism, then ask discrimination questions in the final self-check.
- **Hands-on mode**: use runnable code progression in practice chapters:
  1. Complete worked example.
  2. Partial example with one or two schema-building decisions blank.
  3. Open exercise on a fresh problem.

Scale the worked-example ratio with reader level: novice-heavy tutorials use more worked examples; expert tutorials can shift faster to open practice.

### 5. Force Retrieval

Every chapter ends with 2-4 self-check questions, with answers hidden in `<details>` or a separate answer section. Predictive questions in prose must appear before the reveal.

Question quality:

- Focused: one fact or decision per question.
- Precise: no ambiguous wording.
- Consistent: the answer does not change between readings.
- Tractable: the target reader can usually answer it.
- Effortful: requires retrieval, not copying words from the prompt.

### 6. Engineer Desirable Difficulty

Smooth reading is not durable learning. Add productive friction:

- Show important concepts in 2-3 shapes.
- Include one "just out of reach" challenge per chapter.
- Delay answer reveal with `<details>` or a separate section.
- Warn the reader in `index.html` that fluency is not mastery.
- Ban anesthetic words such as `obviously`, `trivially`, and `just`.

### 7. Interleave And Revisit

Each chapter opens by recalling what the prior chapter contributed to the current one. Later examples reuse earlier concepts. The final self-check or capstone forces the reader to choose between approaches from at least two prior chapters.

Block early practice when the reader is acquiring brand-new syntax. Interleave after there are multiple concepts to discriminate.

## Depth And Currency

The seven principles control how learning sticks. They do not guarantee depth. Use these lenses while researching and writing:

- **One level below the docs**: "X does Y" becomes "X does Y by doing Z, which costs W and fails when V." A tutorial that stops at API surface is not finished.
- **Current field state**: for non-frozen subjects, name what is stable, what changed in roughly the last 6-12 months, and what is superseded or deprecated. Date this framing.

Agent-internal moves:

1. Phase 2 research workers track surprises and frontier findings.
2. Phase 3 names the threshold concept and dated frontier framing.
3. Phase 4 runs a 50-word jargon-free Feynman test before each concept introduction.
4. Phase 5 checks insight, mechanism depth, and currency before delivery.

## Voice And Terminology

Write for working professionals.

Hard rules:

- Use active voice and present tense.
- Use imperative mood for instructions.
- Put one concept in one sentence when the topic is new.
- Prefer specific names, numbers, versions, and conditions over hedges.
- Use the field's standard terms. Do not invent labels.
- Keep pedagogy vocabulary out of reader-facing prose unless the tutorial subject itself is pedagogy.

Terminology discipline:

- Naming is precise and standard.
- Explanation is plain and concrete.
- If the community keeps an English term, keep it.
- If no standard term exists, describe the thing in plain words instead of coining a noun.
- Analogies are temporary teaching aids. Do not reuse an analogy as if it were an established term.

Forbidden reader-prose patterns:

| Category | Ban | Replacement |
|---|---|---|
| Cheerleading | `let's`, `we'll`, `together`, `you'll discover` | State the task or behavior directly. |
| Empty transitions | `now we are going to`, `next we will look at` | Let the structure carry sequence. |
| Hedges | `maybe`, `probably`, `kind of`, `sort of`, unsupported `roughly` | Give the condition, range, or evidence. |
| Anesthetic words | `obviously`, `trivially`, unnecessary `just` | State the required prerequisite or actual cost. |
| Marketing filler | `in today's fast-paced world`, `deep dive journey`, `unlock the power of` | Delete. |
| Invented labels | "execution funnel", "state convergence triad" | Use the standard term or plain description. |
| Pedagogy leaks | `cognitive load`, `dual coding`, `threshold concept` in reader prose | Use subject-domain language. |

Legitimate exceptions:

- Quoted user material keeps its original wording.
- Code blocks and prompt strings are program content.
- Hidden answer blocks can use expected-value wording.
- Explicit epistemic notes may say what was not verified.
- Domain uncertainty can be stated precisely.

## Output Format

Default output is standalone HTML files, not Markdown. HTML supports sticky navigation, styled callouts, syntax-highlighted code, inline SVG diagrams, and `<details>` answer separation without a build step.

Use Markdown only when the user or host explicitly requires it. In Markdown, preserve the same learning structure and use the renderer's supported diagram format.

Visual identity:

- Minimal monochrome page.
- One warm red accent, used sparingly.
- Professional density, not marketing composition.
- No CSS framework, no build step, no external app shell.

Read and copy [references/layout-template.html](references/layout-template.html). Do not recreate the CSS from memory.

## File Scaffold

Two files are invariant in multi-file HTML output:

```
<tech-name>/
├── index.html
├── 01-concepts.html
├── 02-principles.html
├── 0N-<topic>.html
└── 0X-self-check.html
```

The chapters between `index.html` and `*-self-check.html` come from the concept dependency graph. Do not pad to a fixed count.

Quick primer mode can be a single `index.html` with sections, concept map, worked example, and self-check inline.

Hands-on mode adds practice, pitfalls, and capstone chapters when the user asks for runnable code progression.

## Workflow

### Phase 1 - Scope

Extract what the prompt already gives. Ask only what is genuinely missing:

| Question | Why it matters |
|---|---|
| What exactly is the topic? | Sets boundary and chapter graph. |
| Why now? | Evaluation, building, interview prep, and curiosity need different emphasis. |
| What background should be assumed? | Calibrates expertise reversal. |
| Concept-focused or hands-on? | Selects scenario walkthroughs vs runnable progression. |
| How deep and broad? | Primer, full tutorial, or deep dive. |

For a minimal one-shot request such as "give me a primer on Redux", make defensible assumptions and document them in `index.html` instead of blocking on an interview.

### Phase 2 - Research

Use current documentation lookup when available, then web/source research for design rationale, pitfalls, alternatives, and frontier state. See [references/research_workflow.md](references/research_workflow.md).

When the research surface has at least three independent angles, fan out:

| Worker | Focus |
|---|---|
| Official docs | API surface, examples, version notes, canonical terms. |
| Design rationale + mechanism | Why the design exists and how it works below the API surface. |
| Pitfalls + production experience | Specific failure modes, not generic warnings. |
| Alternatives | Competing approaches and discrimination context. |
| Frontier | Recent changes, emerging work, deprecations, each dated. |

Every worker summary must end with:

```
## Surprises
- ...
```

The official-docs worker also ends with:

```
## Terminology
- <concept> | <canonical term> | <language handling> | <plain gloss>
```

The lead thread synthesizes:

- Concept dependency graph.
- Why bank.
- Pitfall list.
- Surprise list.
- Term table.
- Frontier map: stable, in flux, superseded.

### Phase 3 - Outline Approval

Before drafting, show the user one approval packet:

1. Flat chapter outline, one schema-building sentence per chapter.
2. Concept map.
3. Learning-path breadcrumb.
4. Threshold concept as a plain-language claim built from standard terms.
5. Dated frontier framing, or explicit note that the topic is stable.

Do not coin a name for the threshold concept. Use a sentence about how the system works.

### Phase 4 - Draft

Use [references/tutorial_template.md](references/tutorial_template.md).

Before each concept introduction, perform the Feynman test in scratch space: explain it in 50 jargon-free words. If that stalls, return to sources before writing.

Parallelize independent chapter drafts only after the outline and dependency graph are locked. The lead thread owns the coherence merge: breadcrumb, cross-chapter callbacks, term consistency, and duplicate-definition cleanup.

### Phase 5 - Verify

Run the structural script:

```bash
bash "${CLAUDE_PLUGIN_ROOT}/skills/tech-tutorial/scripts/verify_structure.sh" <tutorial-dir>
```

Then run prose checks over stripped prose:

```bash
bash "${CLAUDE_PLUGIN_ROOT}/skills/tech-tutorial/scripts/verify_prose.sh" <tutorial-dir>
```

This checks forbidden English voice phrases, first-person author narration, and pedagogy-jargon leaks while ignoring code and hidden answer blocks. For explicit non-English output, run this script for any English prose that remains and add an equivalent language-specific voice review for the requested language. Every hit in reader-facing prose needs a fix or an explicit exception.

Run terminology enumeration:

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/skills/tech-tutorial/scripts/extract_terms.py" <tutorial-dir>
```

Judge each candidate against the Phase 2 term table. Verify suspects against official docs or web search. Replace coined labels with standard terms or plain descriptions.

For SVGs:

1. Serve the tutorial folder locally.
2. Open each chapter in a browser.
3. Run `scripts/svg_overflow_check.js` against the page.
4. Capture every figure and inspect connector crossings, label collisions, arrow piercing, and cropping.
5. Re-run:

```bash
bash "${CLAUDE_PLUGIN_ROOT}/skills/tech-tutorial/scripts/verify_structure.sh" <tutorial-dir> <screenshot-dir>
```

Also verify:

- Answers are hidden from prompts.
- Discrimination scenarios exist.
- Code examples run, or the tutorial clearly states what was not run.
- Further reading links are real.
- The insight check sentence exists in "What you can do after reading".
- Every core concept goes one level below docs.
- Frontier framing is dated where the field is moving.

## Knowledge Libraries

When the output lands in a directory with sibling tutorials, optionally build a library:

- Update or create the root hub `index.html`.
- Cluster tutorials by theme, not alphabetically.
- Add a one-line schema claim for each tutorial.
- Preserve existing entries.
- Add a "Related tutorials" block in the new tutorial only after verifying sibling `index.html` files exist.

Skip this for one-off tutorials or when the host system has its own navigation.

## What To Read Next

- [references/cognitive_principles.md](references/cognitive_principles.md) - research basis for the learning principles.
- [references/tutorial_template.md](references/tutorial_template.md) - chapter templates and completeness checklist.
- [references/research_workflow.md](references/research_workflow.md) - source strategy and current-docs workflow.
- [references/diagram_guide.md](references/diagram_guide.md) - diagram selection and SVG verification.
