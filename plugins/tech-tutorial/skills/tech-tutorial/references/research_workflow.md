# Research Workflow

Writing a tutorial is mostly a research problem. The drafting is the easy part — the hard part is knowing what's true, what's current, and what's worth saying.

This file is the playbook for combining a **current documentation lookup tool** with **web search / web fetch**, plus how to evaluate sources.

## Decision tree: where to look first

```
Question type                          → First source
─────────────────────────────────────────────────────────
"What does function X do?"             → current docs lookup (official docs)
"What's the type signature of Y?"      → current docs lookup
"How do I install Z?"                  → current docs lookup
"What changed in version 4.0?"         → current docs lookup (changelog) or web (announcement post)
"Why was X designed this way?"         → web (design docs, blog posts, conf talks)
"What are alternatives to X?"          → web (comparison articles)
"What are the common pitfalls?"        → web (community posts, Stack Overflow trends)
"Is library X still maintained?"       → web (GitHub activity, recent releases)
"Real-world case study"                → web (engineering blogs)
```

The boundary: **official docs own "what it is" — web sources own "why it is."**

## Using A Current Documentation Tool Effectively

If the environment provides a documentation lookup tool, use a two-step pattern:

1. **Resolve the library/project identity** if the tool requires it — e.g., "react router" → the official React Router docs package.
2. **Query with a focused topic** — e.g., `loader redirects`, not `everything`.

When to call it:
- Before writing any code example, to confirm current API.
- When you need to state a specific behavior ("the default timeout is X seconds").
- For version-specific information.

When **not** to call it:
- For motivation, history, or design rationale — that's almost never in API docs.
- For comparisons against other libraries — official docs are biased.

## Using Web Search + Web Fetch

Web search finds candidates; web fetch reads them.

Prompt patterns that work:

| Goal | Good query | Why |
|---|---|---|
| Design rationale | `"<tech>" "design" site:<official-blog-domain>` | Project's own blog usually has design posts |
| Architecture | `"<tech>" "<core design term>" tradeoffs` | Combine the tech with the design concept |
| Pitfalls | `"<tech>" "lessons learned"` OR `"<tech>" gotchas` | Engineers post lessons after pain |
| Comparisons | `"<tech>" vs "<main alternative>" 2026` | Year qualifier filters stale comparisons |
| Recent state | `"<tech>" 2026 release` | For "is this still relevant" |

**Bad queries** (will return SEO sludge):
- `"<tech> tutorial"` — endless AI-generated reposts
- `"best <tech> practices"` — listicle factories
- `"<tech> explained simply"` — content farm magnet

## Source evaluation

When you find a source, score it before quoting:

| Source type | Trust default | Notes |
|---|---|---|
| Official docs | High | Always cite, but read the date |
| Project's own blog / RFCs | High | Best for design rationale |
| Conference talks (KubeCon, QCon, Strange Loop) | High | Pre-vetted by review committees |
| Maintainer's personal blog | High | Often the only place rationale exists |
| GitHub issues / discussions (project repo) | High for behavior, medium for opinion | "We chose X because Y" from maintainers is gold |
| Established engineering blogs (Netflix, Uber, etc.) | Medium-high | Battle-tested practice; check date |
| Stack Overflow accepted answers | Medium | Verify against current docs |
| Medium articles | Low by default | Treat as starting point, verify everything |
| AI-generated content farms | Reject | Often factually wrong, always shallow |
| Year >2 old for fast-moving tech | Reject unless mature ecosystem | The framework probably changed |

If something feels off — a claim that's repeated without source, a snippet that doesn't compile, a "best practice" with no rationale — **stop and verify**. Tutorials propagate errors; one wrong claim can mislead hundreds of readers.

## Parallel research strategy

For a real tutorial, spawn 3-4 research workers in parallel when worker/task tools are available; otherwise do them sequentially but keep each pass tight. Here, **lead thread** means the main orchestration context, and **worker** means any parallel task unit.

- **Worker A**: current docs lookup — pull the official docs for the topic. Goal: get current API surface.
- **Worker B**: Web search for design rationale. Goal: find 2-3 high-quality "why" sources.
- **Worker C**: Web search for pitfalls and real-world experience. Goal: find 3-5 specific gotchas to address in chapter 04.
- **Worker D**: Web search for adjacent tech and comparisons. Goal: know what to compare against.

**Every worker brief must include (mandatory)**: the worker reserves the final 50-80 words of its ~400-word output for a literal `## Surprises` markdown section — a bullet list of gaps between the worker's prior model of this tech and what the worker actually found in the sources. The section header is on its own line; bullets follow on subsequent lines. Empty case (no surprises) is written as two real lines:

```
## Surprises
- none worth noting
```

This is the depth-orientation channel that feeds Phase 3's threshold-concept identification; without it, Phase 3 has nothing to derive from. See SKILL.md Phase 2 for the full surprise-list extraction protocol the lead thread uses to consume these sections.

When workers return, **synthesize** before drafting. Don't write chapter 1 with only Worker A's results, then realize in chapter 2 that Worker B contradicts something.

## Recording sources as you go

Keep a running `sources.md` (scratch file, not part of the final output) with:

```
- url: <link>
  trust: high|medium|low
  used_for: <which sections>
  key_claim: <one-line summary of what you took from it>
```

This makes the "Further reading" sections at the end of each chapter writable in 2 minutes instead of 30.

## When to stop researching

You're ready to write when:
- You can explain the technology to someone in 5 minutes without checking notes.
- You can name the 4-8 core concepts and define each in one sentence.
- You can name at least 2 design tradeoffs with their alternatives.
- You have at least 3 specific pitfalls you'd warn a junior engineer about.

If you can't do any of these, more research. If you can do all of these, **stop researching and start drafting** — perfectionist research is procrastination.
