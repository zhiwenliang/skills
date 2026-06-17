# Tutorial Template

This file turns the skill rules into copyable HTML structures and audit checklists. The canonical CSS and page shell live in `references/layout-template.html`; copy that file first, then fill `<article>` with the snippets below.

Structure is a scaffold, not a fixed chapter count:

- `index.html` comes first.
- `NN-self-check.html` comes last in multi-file tutorials.
- Topical chapters in between come from the concept dependency graph.
- Quick primers can be a single `index.html`.
- Hands-on tutorials add practice, pitfalls, and capstone chapters when the user asks for runnable progression.

## Reusable HTML Snippets

### Chapter Shell

```html
<article>
  <header class="chapter-opener">
    <p class="chapter-label">Chapter {{NN}}</p>
    <h1>{{chapter title}}</h1>
    <p class="recap">The previous chapter established {{prior schema}}. This chapter explains {{current role}}.</p>
  </header>

  <section class="schema-panel">
    <p class="label">Schema this chapter builds</p>
    <ul>
      <li>{{schema item 1}}</li>
      <li>{{schema item 2}}</li>
      <li>{{schema item 3}}</li>
    </ul>
  </section>

  <!-- Content sections go here. -->

  <section class="self-check" id="self-check">
    <h2><span class="num">§</span><span>Self-check</span></h2>
    <p style="color: var(--ink-soft); font-style: italic; font-size: 15px;">
      Close the chapter first. Write your answer before opening the reveal.
    </p>
    <ol>
      <li>{{focused question 1}}</li>
      <li>{{focused question 2}}</li>
      <li>{{design-level question 3}}</li>
    </ol>
    <details>
      <summary>Answers</summary>
      <ol>
        <li>{{answer 1}}</li>
        <li>{{answer 2}}</li>
        <li>{{answer 3}}</li>
      </ol>
    </details>
  </section>

  <div class="challenge">
    <span class="label">Challenge</span>
    <h3>{{challenge title}}</h3>
    <p>{{problem that sits slightly beyond the chapter}}</p>
    <details>
      <summary>Hint</summary>
      <p>{{nudge, not full answer}}</p>
    </details>
  </div>

  <footer class="references">
    <h3>Further Reading</h3>
    <ul>
      <li><a href="{{url}}">{{official source}}</a></li>
      <li><a href="{{url}}">{{design note or maintainer source}}</a></li>
    </ul>
  </footer>

  <nav class="chapter-nav" aria-label="Chapter navigation">
    <a href="0X-prev.html" class="prev">
      <span class="label">Previous</span>
      <span class="title">0X - {{previous title}}</span>
    </a>
    <a href="0Y-next.html" class="next">
      <span class="label">Next</span>
      <span class="title">0Y - {{next title}}</span>
    </a>
  </nav>
</article>
```

### Concept Definition + Rationale

```html
<h2 id="s11"><span class="num">1.1</span><span>{{Standard concept name}}</span></h2>

<p class="one-liner">{{one-sentence definition}}</p>

<div class="rationale">
  <span class="label">Why it exists</span>
  <p>{{specific problem this concept solves and what the engineer would do without it}}</p>
</div>

<div class="callout insight">
  <span class="label">Analogy boundary</span>
  <p>{{analogy, followed by where it stops being true}}</p>
</div>
```

### Code Block

```html
<div class="code-block">
  <div class="header">
    <span class="filename">{{snippet-name}}.py</span>
    <span class="lang">Python</span>
    <button class="copy" data-copy-target="{{unique-id}}">Copy</button>
  </div>
<pre id="{{unique-id}}"><code class="language-python">from dataclasses import dataclass

@dataclass
class ParsedInput:
    value: int

def parse(raw: str) -&gt; ParsedInput:
    return ParsedInput(value=int(raw))

print(parse("5").value)  # 5
</code></pre>
</div>
```

Escape `<`, `>`, and `&` inside `<pre><code>`. Prism handles syntax tokens; do not wrap tokens manually.

### Predictive Question

```html
<div class="predict">
  <span class="question-label">Predict</span>
  <p>{{what will happen and why?}}</p>
  <details>
    <summary>Reveal</summary>
    <p>{{answer}}</p>
    <p>{{design insight this points at}}</p>
  </details>
</div>
```

### Diagram

```html
<figure>
  <svg viewBox="0 0 680 360" xmlns="http://www.w3.org/2000/svg" role="img"
       aria-label="{{what this diagram shows}}">
    <defs>
      <marker id="arrow-ink" viewBox="0 0 10 10" refX="9" refY="5"
              markerWidth="8" markerHeight="8" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#0A0A0A"/>
      </marker>
    </defs>
    <!-- Use .diagram-ink, .diagram-accent, .node-fill, .node-label, .edge-label. -->
  </svg>
  <figcaption><span class="fig-num">Fig. N.M</span>{{one-line claim about the figure}}.
    <strong>Notice</strong>: {{the one thing the reader should notice}}.</figcaption>
</figure>
```

Before shipping a diagram:

1. Text fits nodes and viewBox.
2. Connector lines do not cross other connectors.
3. Arrow endpoints stop at box edges or corners.
4. Multi-arrow diagrams use a consistent stop policy.
5. Free-floating labels do not collide.

Use `scripts/svg_overflow_check.js` and screenshots; do not rely on mental width estimates.

### Callouts

```html
<div class="callout warning">
  <span class="label">Failure mode</span>
  <p>{{specific problem the reader will hit}}</p>
</div>

<div class="callout tip">
  <span class="label">Tip</span>
  <p>{{small operational shortcut}}</p>
</div>

<div class="callout example">
  <span class="label">Example</span>
  <p>{{concrete instance}}</p>
</div>

<div class="callout insight">
  <span class="label">Insight</span>
  <p>{{load-bearing observation}}</p>
</div>
```

### Comparison Table

```html
<table class="compare-table">
  <caption>Table N.M - {{caption}}</caption>
  <thead>
    <tr><th>Approach</th><th>Strength</th><th>Why it was not chosen</th></tr>
  </thead>
  <tbody>
    <tr><td>{{alternative A}}</td><td>{{strength}}</td><td>{{tradeoff}}</td></tr>
    <tr><td>{{alternative B}}</td><td>{{strength}}</td><td>{{tradeoff}}</td></tr>
    <tr class="selected"><td>{{chosen approach}}</td><td>{{strength}}</td><td>Chosen</td></tr>
  </tbody>
</table>
```

### Reader-Drawing Prompt

```html
<div class="predict" data-tech-tutorial="reader-drawing">
  <span class="question-label">Draw it yourself</span>
  <p>Close the chapter and sketch {{key structure}} from memory. Then compare your sketch with Fig. {{N}}.</p>
</div>
```

## Index Page

`index.html` is the entry point. It must let a reader decide in under one minute whether the tutorial fits.

Required sections:

| Section | HTML form | Notes |
|---|---|---|
| Who this is for | `<section data-tech-tutorial="audience-for">` | Required background, tooling, versions, assumptions. Localize visible heading when requested. |
| Who this is not for | `<section data-tech-tutorial="audience-not-for">` | Route readers to a better path. Localize visible heading when requested. |
| What you can do after reading | `<section data-tech-tutorial="outcomes">` | Start with the insight-check sentence, then 3-5 measurable capabilities. Localize visible heading when requested. |
| The core idea | `<section class="schema-panel">` | Phase 3 threshold concept as a sentence, not a coined label. |
| Field state as of `<date>` | `<div class="callout">` or `<section>` | Stable, in flux, superseded. If frozen, say so explicitly. |
| Concept map | `<figure>` | 5-10 nodes, labeled edges. |
| Learning path | `.learning-path` | Same breadcrumb appears in each chapter. |
| Fluency warning | `.callout.warning` | Warn that smooth reading is not mastery. |
| Further reading | `<footer>` | Official docs plus design sources. |
| Related tutorials | `<section class="related-tutorials">` | Only for verified sibling tutorials. |

Index checklist:

- [ ] The three audience sections exist.
- [ ] "What you can do after reading" starts with the insight-check sentence.
- [ ] "The core idea" exists and contains the approved threshold concept.
- [ ] "Field state as of ..." exists and is dated, unless the topic is explicitly stable.
- [ ] The concept map exists and has labeled edges.
- [ ] The learning path exists.
- [ ] The fluency warning exists.

## Related Tutorials Block

Use only when sibling tutorials exist and their `index.html` files were verified.

```html
<section class="related-tutorials" id="related">
  <h2><span class="num">↗</span><span>Related tutorials</span></h2>
  <div class="related-grid">
    <a href="../{{sibling}}/index.html">
      <span class="label">Prerequisite</span>
      <strong>{{Sibling title}}</strong>
      <span>{{why it matters}}</span>
    </a>
  </div>
</section>
```

## Hub Index

When a directory contains multiple tutorial folders, the root `index.html` is a themed hub:

- Cluster by domain, not alphabetically.
- Preserve existing entries.
- Add one schema sentence per tutorial.
- Match the tutorial visual identity.

Skeleton:

```html
<main>
  <header class="chapter-opener">
    <p class="chapter-label">Learning library</p>
    <h1>{{Library title}}</h1>
    <p class="recap">{{one sentence about the library}}</p>
  </header>

  <section>
    <h2>{{Theme}}</h2>
    <ul class="tutorial-cards">
      <li><a href="{{tutorial}}/index.html">{{Tutorial title}}</a>
        <span class="schema">{{schema sentence}}</span></li>
    </ul>
  </section>
</main>
```

## Chapter Types

### `01-concepts.html`

Purpose: establish vocabulary and first mental model.

Include:

- Chapter recap and schema panel.
- Core concepts in dependency order.
- One scenario walkthrough per new concept.
- At least one figure.
- Predictive questions.
- Chapter self-check and challenge.
- Further reading.

Checklist:

- [ ] Every term is standard and introduced before use.
- [ ] Every core concept has a scenario walkthrough.
- [ ] At least one figure explains relationships or flow.
- [ ] Self-check answers are hidden.

### `02-principles.html`

Purpose: explain mechanisms, design tradeoffs, and failure boundaries.

Include:

- Mechanism sections that go below docs.
- Comparison tables for alternatives.
- "Cost introduced" or "failure boundary" paragraphs.
- Predictive questions and hidden answers.
- At least one figure.

Checklist:

- [ ] Each mechanism explains how or why, not only what.
- [ ] At least two rejected alternatives appear where design tradeoffs matter.
- [ ] The chapter names costs and failure modes.

### `0N-<topic>.html`

Purpose: expand the dependency graph with subject-specific chapters.

Include:

- Recap from earlier concepts.
- A chapter-specific figure.
- Worked examples or scenario walkthroughs.
- Predictive questions.
- Self-check, challenge, and further reading.

Name the chapter after what it teaches, such as `03-replication.html`, not `03-extra.html`.

### `0N-frontier.html`

Optional. Add only when `index.html` cannot carry the current field state clearly.

Include:

- Dated stable/in-flux/superseded table.
- Recent release notes, RFCs, maintainer posts, or papers.
- Migration notes for superseded approaches.
- Explicit uncertainty boundaries.

### `03-practice.html` (Hands-on Only)

Include:

1. Complete runnable worked example.
2. Partial example with 1-2 schema-building decisions blank.
3. Open exercise on a new problem.

The blanks must be design decisions, not trivial variable names.

### `04-pitfalls.html` (Hands-on Only)

Include at least five specific failure modes:

- Symptom.
- Root cause.
- Minimal reproduction or scenario.
- Fix.
- Why the fix works.

Use "failure mode", "common mistake", or "pitfall" in prose. Avoid casual slang.

### `05-capstone.html` (Hands-on Only)

Purpose: force transfer across chapters.

Include:

- A realistic task that uses earlier concepts together.
- At least three discrimination decisions.
- A reader-drawing prompt.
- Hidden reference solution or decision path.

### `NN-self-check.html`

The final chapter in multi-file tutorials. The suffix must be `-self-check.html`.

Concept-focused tutorials use this chapter as the capstone surrogate. It must contain at least three cross-chapter discrimination scenarios.

Skeleton:

```html
<article>
  <header class="chapter-opener">
    <p class="chapter-label">Final self-check</p>
    <h1>{{NN}} - Self-check</h1>
    <p class="recap">Use this chapter to test recall, discrimination, and transfer.</p>
  </header>

  <section>
    <h2>Concept layer</h2>
    <ol>
      <li>{{question}} <small><a href="01-concepts.html#xxx">Hint: revisit 01 §xxx</a></small></li>
    </ol>
  </section>

  <section>
    <h2>Mechanism layer</h2>
    <ol>
      <li>{{question}}</li>
    </ol>
  </section>

  <section>
    <h2>Discrimination layer</h2>
    <ol>
      <li>In {{scenario}}, choose {{approach A}} or {{approach B}}. Explain why.</li>
    </ol>
  </section>

  <div class="predict" data-tech-tutorial="reader-drawing">
    <span class="question-label">Draw it yourself</span>
    <p>Close the tutorial and sketch {{key structure}} from memory.</p>
  </div>

  <details>
    <summary>Answers</summary>
    <h3>Concept layer</h3>
    <p>{{answers}}</p>
    <h3>Mechanism layer</h3>
    <p>{{answers}}</p>
    <h3>Discrimination layer</h3>
    <p>{{answers}}</p>
  </details>
</article>
```

Checklist:

- [ ] Concept, mechanism, and discrimination layers exist.
- [ ] Concept-focused mode has at least three cross-chapter discrimination scenarios.
- [ ] Hands-on mode has at least one or two reinforcement discrimination scenarios.
- [ ] At least one reader-drawing prompt exists here or in capstone.
- [ ] Answers are hidden in a final `<details>` block.
- [ ] Questions are focused, precise, consistent, tractable, and effortful.

## Full Tutorial Checklist

### Structure

- [ ] `index.html` lets the reader judge fit quickly.
- [ ] Audience sections exist, either with English headings or stable `data-tech-tutorial` markers.
- [ ] Concept map appears in `index.html`.
- [ ] Learning path appears in `index.html` and each chapter.
- [ ] Each chapter opens with a prior-chapter recall sentence.
- [ ] Each chapter has a schema panel.
- [ ] Multi-file output has exactly one final `*-self-check.html`.

### Diagrams

- [ ] Every chapter has at least one `<figure>`.
- [ ] Every figure adds information.
- [ ] Labels sit on diagram elements.
- [ ] No decorative images.
- [ ] At least one reader-drawing prompt exists.
- [ ] SVG utility CSS exists in every HTML file.
- [ ] Every figure was rendered and inspected.

### Examples

- [ ] Each new concept has a worked example or scenario walkthrough.
- [ ] Hands-on practice uses worked -> partial -> open progression.
- [ ] Partial examples leave meaningful decisions blank.

### Retrieval

- [ ] Every chapter has self-check questions.
- [ ] Answers are hidden from prompts.
- [ ] At least three predictive questions exist across the tutorial.
- [ ] Final discrimination scenarios force choice between prior concepts.

### Voice

- [ ] No cheerleading.
- [ ] No empty transition prose.
- [ ] No unsupported hedges.
- [ ] No anesthetic words.
- [ ] No marketing filler.
- [ ] No first-person author narration except explicit epistemic notes.
- [ ] No pedagogy jargon leaks into reader prose.

### Depth And Currency

- [ ] Each core concept goes one level below docs.
- [ ] `index.html` has dated field-state framing or an explicit stable note.
- [ ] Fast-moving topics use recent primary sources.
- [ ] The insight-check sentence names what an experienced engineer gains beyond docs.

### Completeness

- [ ] Further reading appears in each chapter.
- [ ] Code examples run, or unverified code is clearly marked.
- [ ] Links point to real files or URLs.
- [ ] Knowledge-library hub and related links are updated only when appropriate.
