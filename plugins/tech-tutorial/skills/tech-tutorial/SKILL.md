---
name: tech-tutorial
description: Builds multi-chapter HTML tutorials (index, concept map, learning path, per-chapter self-checks) that teach a technology, framework, library, protocol, tool, or technical concept systematically. Use when the user wants to learn or teach a technical subject, or build a knowledge base of tutorials. Triggers include "teach me X", "I want to learn X", "help me understand X systematically", "give me a primer", "write a tutorial about X", "turn these docs into a tutorial", "系统学习 X", "教我 X", "写一套 X 教程", or requests for a structured learning path. Not for a single explanatory article (explain-article) or one standalone diagram (visual-explainer).
---

# Tech Tutorial Writer

A tutorial that does not build a mental model is a long paraphrase of the docs. This skill produces professional, English-first technical tutorials that teach durable understanding: low extraneous load, diagrams that carry structure, worked examples, retrieval practice, cumulative revisit, interleaving, mechanism depth, and current field context.

Default output language is English. If the user explicitly requests another language, keep the same structure and verification intent. Localize visible headings and set `<html lang>` to the output language (the layout template ships `lang="en"`), but preserve stable `data-tech-tutorial` markers for structural gates.

## Scope Gate

Use this skill when the user's intent is learning, teaching, or systematizing understanding of a technical subject.

Do not use it for:

- Debugging an existing code problem. Use a debugging workflow.
- One-shot reference answers such as "what does this API return?" Answer directly.
- Building a product or code feature where the deliverable is working code, not learning. Learning by building ("learn FastAPI by building a small service") is in scope through hands-on mode.
- One explanatory article about a single concept or mechanism, such as "write an article explaining why PKCE exists". Use `explain-article`.
- One standalone diagram, such as "draw the TCP handshake". Use `visual-explainer`.

If intent is ambiguous, ask one question: "Do you want me to build something with this technology, or teach the technology itself?" If the doubt is about form, ask instead: "Do you want a structured multi-chapter tutorial, or a single article or diagram?" A "why does X exist" question about one concept, with no mention of learning, a tutorial, or a course, goes to `explain-article`.

Diataxis is the routing vocabulary: this skill owns the tutorial quadrant and study-oriented explanation delivered as a learning path. A single explanatory article belongs to `explain-article`. Route work-oriented how-to and reference requests away unless the user asks to turn them into a learning artifact.

## Learning Principles

The tutorial is designed against seven mandatory principles. Research details and citations live in [references/cognitive_principles.md](references/cognitive_principles.md).

### 1. Declare the Target Reader

Open the tutorial with visible headings in the output language and these semantic markers:

- `data-tech-tutorial="audience-for"`: required background, tools, versions, and assumptions.
- `data-tech-tutorial="audience-not-for"`: readers who should take a different path.
- `data-tech-tutorial="outcomes"`: concrete, verifiable capabilities.

Do not try to serve novices and experts with the same explanation style. Expertise reversal makes that fail. Phase 1 sets a reader level, and the level changes the scaffolding, not only the audience text:

| Scaffold | Novice | Intermediate | Expert |
|---|---|---|---|
| Worked examples | One per core concept, before any question | For new mechanisms only | Only for the hardest one or two mechanisms |
| Order within a section | Example, then explanation, then question | Explanation, then example | Prediction first, then explanation |
| Mechanism depth | Surface model in `01-concepts`; mechanism in `02-principles` or a `<details class="under-the-hood">` block | Inline | Inline, with costs and failure boundaries up front |
| Self-check | 3-4 focused questions per chapter | 2-3 | 2 hard questions, weighted to discrimination |

The outcomes section opens with what the declared reader gains beyond the docs.

### 2. Map Before Territory

Start with a concept map and a learning-path breadcrumb. Re-show the breadcrumb at each chapter opener with the current chapter highlighted. This gives the reader anchors before details arrive.

### 3. Pair Text With Diagrams

Each major section needs at least one information-carrying diagram when spatial structure, flow, hierarchy, state, or comparison matters.

Rules:

- At least one non-empty `<figure>` per chapter. In the final self-check, the figure is the reference answer to the reader-drawing prompt, inside the answer `<details>`, not a decorative difficulty map.
- Labels live on the diagram elements, not in distant prose.
- Decorative images are deleted.
- Show important concepts in 2-3 complementary representations, such as a diagram, a scenario walkthrough, and a contrasting case. Each one adds information. Do not restate a figure's labels in the prose next to it.
- At least one reader-drawing prompt exists in the tutorial, usually in self-check or capstone, always marked with `data-tech-tutorial="reader-drawing"`.

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

Every chapter ends with self-check questions (count by reader level, above), with answers hidden in a `<details>` inside the `.self-check` section. The tutorial has at least three predictions (`.predict` with a `<details>` reveal), each asked before the explanation it tests, not only before its answer. The first one sits in `index.html`, before the reader starts.

Question quality depends on the layer:

- Concept-layer questions are focused (one fact or decision), precise, consistent (the answer does not change between readings), tractable, and effortful (retrieval, not copying words from the prompt).
- Mechanism and discrimination questions ask the reader to justify a choice. Their hidden answers give the reasoning points a good answer covers, not a single phrase.

### 6. Engineer Desirable Difficulty

Smooth reading is not durable learning. Add productive friction:

- Include one "just out of reach" challenge per chapter.
- Ask before telling: the predictions above make the reader commit to an answer before the explanation arrives, so a wrong guess exposes the gap that smooth reading hides.
- A one-line note in `index.html` that fluent reading is not mastery is optional; the index prediction does that work.

### 7. Interleave And Revisit

Each chapter opens with a recall question about what the prior chapter contributed, answered in a `<details>` and followed by a one-line restatement. A recap the reader only re-reads does not count. Later examples reuse earlier concepts. The final self-check or capstone forces the reader to choose between approaches from at least two prior chapters. This revisit is cumulative within one reading; the final self-check ends with a short set of questions to redo two or three days later.

Block early practice when the reader is acquiring brand-new syntax. Interleave after there are multiple concepts to discriminate.

## Depth And Currency

The seven principles control how learning sticks. They do not guarantee depth. Use these lenses while researching and writing:

- **One level below the docs**: "X does Y" becomes "X does Y by doing Z, which costs W and fails when V." A tutorial that stops at API surface is not finished. Every core concept gets there somewhere in the tutorial; for novice readers it can arrive in a later chapter or an "Under the hood" block (see the reader-level table).
- **Misconceptions first**: readers who already hold a wrong model absorb the right one into it. For each threshold or core concept, state the misconception the declared reader likely holds (from Phase 2 surprises and pitfalls), let a prediction or counterexample break it, then give the mechanism. Use the Misconception snippet in [references/tutorial_template.md](references/tutorial_template.md).
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
| Cheerleading | `let's`, `we'll`, "explore … together", `you'll discover` | State the task or behavior directly. |
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

Mark each of these with `<blockquote>`, `<q>`, or `data-prose-exempt="<reason>"` so the prose scan skips it (Phase 5).

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

`index.html` and exactly one final `NN-self-check.html` are invariant in multi-file HTML output. `01-concepts` and `02-principles` are the default first chapters:

```
<tech-name>/
├── index.html
├── 01-concepts.html
├── 02-principles.html
├── NN-<topic>.html
└── NN-self-check.html
```

The chapters between `index.html` and `*-self-check.html` come from the concept dependency graph. Do not pad to a fixed count. Number chapters with two digits.

Quick primer mode is a single `index.html` with `<h2>` sections, a concept map, a worked example, at least three figures, three predictions, and an inline `.self-check` with hidden answers.

Hands-on mode adds `NN-practice`, `NN-pitfalls`, and `NN-capstone` chapters, numbered after the topical chapters and before the self-check, when the user asks for runnable code progression.

## Workflow

### Phase 1 - Scope

Extract what the prompt already gives. Ask only what is genuinely missing:

| Question | Why it matters |
|---|---|
| What exactly is the topic? | Sets boundary and chapter graph. |
| Why now? | Evaluation, building, interview prep, and curiosity need different emphasis. |
| What background should be assumed? | Sets the reader level (novice, intermediate, expert) that scales scaffolding. |
| Concept-focused or hands-on? | Selects scenario walkthroughs vs runnable progression. |
| How deep and broad? | Primer, full tutorial, or deep dive. |

For a minimal one-shot request such as "give me a primer on Redux", make defensible assumptions and document them in `index.html` instead of blocking on an interview.

### Phase 2 - Research

Use current documentation lookup when available, then web/source research for design rationale, pitfalls, alternatives, and frontier state. See [references/research_workflow.md](references/research_workflow.md).

Scale the fan-out to the job. A primer uses the lead thread alone or at most two workers. A full tutorial with at least three independent research angles fans out to the workers in [references/research_workflow.md](references/research_workflow.md) ("Parallel Research Strategy"), which also defines the `## Surprises` and `## Terminology` sections every worker must return. For stable or academic topics (a protocol from a paper or RFC), the docs worker reads the primary source instead of product docs, and the frontier worker folds into the rationale worker. Give each worker the output contract from that section verbatim; workers do not see this file.

The lead thread synthesizes:

- Concept dependency graph.
- Rationale list: why each core concept exists and matters.
- Pitfall list.
- Surprise list.
- Term table.
- Frontier map: stable, in flux, superseded.

### Phase 3 - Outline Approval

Stop for approval only when all three hold: the session can take a reply (an interactive conversation, not a headless or scripted run); the output is a multi-file full tutorial or deep dive; and the scope is ambiguous or broad (more than about five topical chapters). Otherwise, including primers, single-file output, and a user who said to go ahead, do not stop. Put the packet into `index.html` (the outline in the learning path, the threshold concept in "The core idea", the frontier in the field-state block) and record the scope, depth, and mode you assumed in the `audience-for` section, then draft.

When approval is due, show the user one approval packet:

1. Flat chapter outline, one schema-building sentence per chapter.
2. Concept map.
3. Learning-path breadcrumb.
4. Threshold concept as a plain-language claim built from standard terms.
5. Dated frontier framing, or explicit note that the topic is stable.
6. The two or three misconceptions the declared reader most likely holds.

Do not coin a name for the threshold concept. Use a sentence about how the system works.

### Phase 4 - Draft

Use [references/tutorial_template.md](references/tutorial_template.md).

Before each concept introduction, perform the Feynman test in scratch space: explain it in 50 jargon-free words. If that stalls, return to sources before writing.

Parallelize independent chapter drafts only after the outline and dependency graph are locked. Give every chapter worker the Phase 2 term table, so drafts name concepts with standard terms instead of coining labels. Workers and reference files do not expand `${CLAUDE_PLUGIN_ROOT}`, so pass them absolute paths to the layout template and scripts, resolved from the paths in this file. The lead thread owns the coherence merge: breadcrumb, cross-chapter callbacks, term consistency, and duplicate-definition cleanup.

### Phase 5 - Verify

Run the structural script. It parses the HTML and checks the self-check chapter's name and position, audience markers, non-empty figures, SVG utility CSS, the reader-drawing marker, retrieval (hidden-answer self-checks in every chapter and at least three predictions), and integrity (no leftover `{{placeholders}}`, broken relative links or anchors, duplicate ids, or missing `<html lang>`):

```bash
bash "${CLAUDE_PLUGIN_ROOT}/skills/tech-tutorial/scripts/verify_structure.sh" <tutorial-dir>
```

Then run prose checks over stripped prose:

```bash
bash "${CLAUDE_PLUGIN_ROOT}/skills/tech-tutorial/scripts/verify_prose.sh" <tutorial-dir>
```

This checks forbidden English voice phrases, first-person author narration, and pedagogy-jargon leaks while ignoring code and closed answer blocks (`verify_prose.sh` calls `strip_prose.py` to strip code and closed `<details>` before scanning; a `<details open>` is scanned). Every hit in reader-facing prose needs a fix or an explicit exception:

- Quoted material in `<blockquote>` or `<q>` is exempt automatically.
- For domain uncertainty or an epistemic note, add `data-prose-exempt="<reason>"` to the element. An empty reason exempts nothing.
- Each exemption prints as an `EXEMPT` line. Mention them in the delivery note.

The scans are English-only. A chapter whose `<html lang>` or prose is not English prints `NOT CHECKED`. For those chapters, add an equivalent voice review in the requested language.

Run terminology enumeration:

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/skills/tech-tutorial/scripts/extract_terms.py" <tutorial-dir>
```

Judge each candidate against the Phase 2 term table. Verify suspects against official docs or web search. Replace coined labels with standard terms or plain descriptions.

For SVGs:

1. Serve the tutorial folder locally.
2. Open each chapter in a browser.
3. Evaluate `"${CLAUDE_PLUGIN_ROOT}/skills/tech-tutorial/scripts/svg_overflow_check.js"` against the page. Read it from that path: the working directory is the tutorial folder, so a bare `scripts/...` path does not resolve. Fix each violation and re-run until it returns `OK: no SVG text defects`; a collision verified benign on a screenshot can be exempted with `data-collision-ok` on either `<text>`.
4. Capture every figure as `<chapter>-figN.png`, numbered in page order from 1 (for example `01-concepts-fig2.png`), into a screenshot folder outside the tutorial, and inspect connector crossings, label collisions, arrow piercing, and cropping. If the browser tool saves screenshots under its own names or folder, copy and rename them into that folder. Take screenshots after the last HTML edit: the gate rejects screenshots older than the chapter.

If no browser tool is available, skip steps 1-4, say in the delivery note that the SVGs were not render-checked, and do not claim that they pass.
5. Re-run:

```bash
bash "${CLAUDE_PLUGIN_ROOT}/skills/tech-tutorial/scripts/verify_structure.sh" <tutorial-dir> <screenshot-dir>
```

The scripts cannot judge the rest. Check these by reading, and cite a file and line for each in the delivery note:

- The outcomes section (`data-tech-tutorial="outcomes"`) opens with what the declared reader gains beyond the docs.
- Every core concept goes one level below the docs somewhere in the tutorial.
- Each misconception from Phase 3 is broken by a prediction or counterexample before the mechanism is stated.
- Discrimination scenarios force a choice between concepts from different chapters.
- Scaffolding matches the reader level.
- Frontier framing is dated where the field is moving.
- Code examples run, or the tutorial clearly states what was not run.
- External further-reading links are real.

Then walk the judgment items in the checklists in [references/tutorial_template.md](references/tutorial_template.md). Items marked (auto) are already covered by the scripts.

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
