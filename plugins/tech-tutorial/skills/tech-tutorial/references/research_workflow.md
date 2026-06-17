# Research Workflow

Writing a tutorial is mostly a research problem. Drafting starts only after the agent knows what is true, current, and worth teaching.

Use this workflow with any current documentation lookup tool, web search, source repositories, RFCs, release notes, and user-provided material.

## Where To Look First

| Question type | First source |
|---|---|
| What does function or command X do? | Current official docs. |
| What is the type signature or option name? | Current official docs or API reference. |
| How do I install or configure it? | Official docs and release notes. |
| What changed in version N? | Changelog, migration guide, announcement post. |
| Why was X designed this way? | RFC, design doc, maintainer post, conference talk. |
| How does X work internally? | Source, architecture docs, deep-dive talks. |
| What are common pitfalls? | GitHub issues, discussions, Stack Overflow, production writeups. |
| What are alternatives? | Official comparison docs, migration stories, engineering blogs. |
| Is it still maintained? | GitHub activity, releases, roadmap, maintainer statements. |
| What is current or emerging? | Release notes, roadmap, RFCs, recent conference talks, recent papers for AI/ML. |
| What is deprecated or superseded? | Migration guides, deprecation notices, changelogs. |

Official docs own the API surface. Rationale, tradeoffs, and production failure modes usually require sources beyond docs.

## Current Documentation Tool

If a docs lookup tool is available:

1. Resolve the project identity if required.
2. Query focused topics, such as `loader redirects`, not the whole framework.

Use it before writing code examples, stating defaults, or describing version-specific behavior.

Do not use it as the only source for design rationale, alternatives, or production pitfalls.

## Web Search And Fetch

Good query patterns:

| Goal | Query shape |
|---|---|
| Design rationale | `"<tech>" design site:<official-blog-domain>` |
| Architecture | `"<tech>" "<core design term>" tradeoffs` |
| Pitfalls | `"<tech>" lessons learned` or `"<tech>" gotchas` |
| Alternatives | `"<tech>" vs "<alternative>" <current-year>` |
| Recent state | `"<tech>" release notes <current-year>` |
| Internals | `how does "<tech>" work internally`, `"<tech>" internals` |
| Frontier | `"<tech>" roadmap`, `"<tech>" RFC`, `what's new in "<tech>" <current-year>` |
| Deprecation | `"<tech>" deprecated`, `"<old approach>" migration` |

Avoid content-farm queries such as `"<tech> tutorial"` or `"best <tech> practices"` unless they are only a starting point and every claim is verified elsewhere.

## Source Evaluation

| Source type | Trust default | Notes |
|---|---|---|
| Official docs | High | Check version and date. |
| Project blog, RFCs, design docs | High | Best source for rationale. |
| Conference talks | High | Useful for design context and tradeoffs. |
| Maintainer personal blog | High | Often explains why decisions were made. |
| GitHub issues and discussions | High for behavior, medium for opinion | Maintainer comments are valuable. |
| Established engineering blogs | Medium-high | Verify against current docs. |
| Stack Overflow accepted answers | Medium | Check date and current docs. |
| Medium-style posts | Low by default | Treat as leads, not authority. |
| AI-generated content | Reject | Too shallow and often wrong. |
| Sources older than two years for fast-moving tech | Reject unless the ecosystem is stable | Mature protocols can be exceptions. |

If a claim feels repeated but unsourced, stop and verify it. Tutorials spread errors efficiently.

## Parallel Research Strategy

Use parallel workers when the environment supports them and the topic has multiple independent research angles.

| Worker | Goal |
|---|---|
| Official docs | Current API, version notes, official examples, canonical terminology. |
| Design rationale + mechanism | Alternatives considered, tradeoffs, internals one level below docs. |
| Pitfalls + production experience | 3-5 concrete failure modes with symptoms and fixes. |
| Alternatives | Adjacent tools and when to choose each. |
| Frontier | Recent changes, emerging approaches, deprecations, all dated. |

Every worker returns about 400 words and reserves the final section:

```markdown
## Surprises
- <gap between prior model and source-backed finding>
```

If there are no surprises, write:

```markdown
## Surprises
- none worth noting
```

The official-docs worker also returns:

```markdown
## Terminology
- <concept> | <canonical term> | <language handling> | <plain gloss>
```

`language handling` means how to render the term in the requested tutorial language. For English output, this is usually `standard English term`. For another requested language, record whether the field uses a local translation or keeps the English term.

The lead thread extracts these sections mechanically. If a required header is missing, re-prompt the worker.

## Source Log

Keep a scratch `sources.md` while researching:

```markdown
- url: <link>
  trust: high|medium|low
  used_for: <section>
  key_claim: <one-line summary>
```

This makes chapter "Further reading" sections fast and auditable.

## Stop Criteria

Research is ready when the lead thread can:

- Explain the topic in five minutes without notes.
- Name 4-8 core concepts and define each in one sentence.
- Explain each core concept one level below docs.
- Name at least two tradeoffs and their rejected alternatives.
- Name at least three concrete pitfalls.
- State what is stable, in flux, and superseded, or explain why the subject is frozen.

If any item is missing, do targeted research. If all are present, stop researching and draft.
